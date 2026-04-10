-- YULMIA Database Schema
-- South Florida Investment Properties Platform
-- No condos. Houses, multifamily, distressed, commercial only.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA extensions;

-- ============================================
-- PROPERTIES (core listing data)
-- ============================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  source_id TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'realtor',

  -- Location
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'FL',
  zip TEXT NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  neighborhood TEXT,

  -- Core details
  price DECIMAL(12, 2) NOT NULL,
  beds INTEGER NOT NULL DEFAULT 0,
  baths DECIMAL(3, 1) NOT NULL DEFAULT 0,
  sqft INTEGER NOT NULL DEFAULT 0,
  lot_size DECIMAL(10, 2), -- in sqft
  year_built INTEGER,
  property_type TEXT NOT NULL CHECK (
    property_type IN (
      'SINGLE_FAMILY',
      'MULTIFAMILY_2_4',
      'MULTIFAMILY_5PLUS',
      'DISTRESSED',
      'LAND',
      'COMMERCIAL'
    )
    -- NO CONDOS ALLOWED
  ),
  subtype TEXT,
  hoa_fee DECIMAL(10, 2),
  annual_tax DECIMAL(10, 2),
  days_on_market INTEGER,
  description TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (
    status IN ('ACTIVE', 'PENDING', 'SOLD', 'WITHDRAWN', 'OFF_MARKET')
  ),
  listing_url TEXT,
  mls_id TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure no duplicate listings from same source
  UNIQUE(source_id, source)
);

-- Indexes for property search
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_neighborhood ON properties(neighborhood);
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_location ON properties(latitude, longitude);

-- ============================================
-- PROPERTY DETAILS (enrichment data)
-- ============================================
CREATE TABLE property_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  flood_zone TEXT,
  flood_risk_score INTEGER CHECK (flood_risk_score BETWEEN 1 AND 10),
  walk_score INTEGER CHECK (walk_score BETWEEN 0 AND 100),
  transit_score INTEGER CHECK (transit_score BETWEEN 0 AND 100),
  bike_score INTEGER CHECK (bike_score BETWEEN 0 AND 100),
  school_rating_avg DECIMAL(3, 1) CHECK (school_rating_avg BETWEEN 0 AND 10),
  neighborhood_score INTEGER CHECK (neighborhood_score BETWEEN 1 AND 100),
  zoning TEXT,
  land_use_code TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(property_id)
);

-- ============================================
-- PROPERTY FINANCIALS (investor metrics)
-- ============================================
CREATE TABLE property_financials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- Rent estimates
  estimated_rent_monthly DECIMAL(10, 2),
  estimated_rent_source TEXT DEFAULT 'rentcast',

  -- Investment metrics
  cap_rate DECIMAL(5, 2), -- Net Operating Income / Price * 100
  cash_on_cash_return DECIMAL(5, 2), -- Annual cash flow / Down payment * 100
  monthly_cash_flow DECIMAL(10, 2), -- Rent - expenses - mortgage
  one_percent_rule BOOLEAN, -- Monthly rent >= 1% of price?
  gross_rent_multiplier DECIMAL(5, 2), -- Price / Annual gross rent

  -- Per-unit pricing
  price_per_sqft DECIMAL(10, 2),
  neighborhood_avg_price_per_sqft DECIMAL(10, 2),

  -- Expense estimates
  annual_insurance_estimate DECIMAL(10, 2),
  annual_maintenance_estimate DECIMAL(10, 2), -- Usually 1% of price
  annual_property_tax DECIMAL(10, 2),
  monthly_mortgage_estimate DECIMAL(10, 2), -- Assuming 20% down, 30yr fixed

  -- Down payment assumptions
  down_payment_percent DECIMAL(5, 2) DEFAULT 20.00,
  interest_rate DECIMAL(5, 2) DEFAULT 7.00,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(property_id)
);

-- ============================================
-- PROPERTY HISTORY (price changes, status changes)
-- ============================================
CREATE TABLE property_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (
    event_type IN ('PRICE_CHANGE', 'STATUS_CHANGE', 'SOLD', 'LISTED', 'RELISTED')
  ),
  old_value TEXT,
  new_value TEXT,
  event_date DATE NOT NULL DEFAULT CURRENT_DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_property_history_property_id ON property_history(property_id);
CREATE INDEX idx_property_history_event_date ON property_history(event_date);

-- ============================================
-- PROPERTY IMAGES
-- ============================================
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_property_images_property_id ON property_images(property_id);

-- ============================================
-- AI INSIGHTS (generated per property)
-- ============================================
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  summary TEXT NOT NULL,
  pros JSONB NOT NULL DEFAULT '[]', -- Array of strings
  risks JSONB NOT NULL DEFAULT '[]', -- Array of strings
  e2_eligible BOOLEAN,
  e2_notes TEXT,
  investment_verdict TEXT NOT NULL CHECK (
    investment_verdict IN ('STRONG', 'MODERATE', 'CAUTIOUS')
  ),
  comparable_property_ids JSONB DEFAULT '[]', -- Array of UUIDs

  model_used TEXT DEFAULT 'gpt-4o-mini',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(property_id)
);

-- ============================================
-- NEIGHBORHOODS
-- ============================================
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'FL',
  county TEXT NOT NULL,

  description TEXT,
  investment_overview TEXT,

  -- Investment metrics
  avg_cap_rate DECIMAL(5, 2),
  avg_price DECIMAL(12, 2),
  avg_rent DECIMAL(10, 2),
  avg_days_on_market INTEGER,
  total_listings INTEGER DEFAULT 0,

  -- Boundaries (optional)
  boundary_geojson JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- COUNTIES (data source tracking)
-- ============================================
CREATE TABLE counties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'FL',
  fips_code TEXT NOT NULL,

  has_api BOOLEAN DEFAULT FALSE,
  api_url TEXT,
  api_type TEXT CHECK (api_type IN ('SOCRATA', 'ARCGIS', 'BULK', 'NONE')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-generate slug from address
CREATE OR REPLACE FUNCTION generate_property_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(
      REGEXP_REPLACE(
        NEW.address || ' ' || NEW.city || ' ' || NEW.zip,
        '[^a-zA-Z0-9]+', '-', 'g'
      )
    );
    -- Remove leading/trailing dashes
    NEW.slug := BTRIM(NEW.slug, '-');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_slug
  BEFORE INSERT ON properties
  FOR EACH ROW
  EXECUTE FUNCTION generate_property_slug();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_property_details_updated_at
  BEFORE UPDATE ON property_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_property_financials_updated_at
  BEFORE UPDATE ON property_financials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (enable later when auth is set up)
-- ============================================
-- ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE property_details ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE property_financials ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

-- Public read access (for launch)
-- CREATE POLICY "Public read properties" ON properties FOR SELECT USING (true);
-- CREATE POLICY "Public read details" ON property_details FOR SELECT USING (true);
-- CREATE POLICY "Public read financials" ON property_financials FOR SELECT USING (true);
-- CREATE POLICY "Public read insights" ON ai_insights FOR SELECT USING (true);
-- CREATE POLICY "Public read neighborhoods" ON neighborhoods FOR SELECT USING (true);

-- ============================================
-- SEED DATA (neighborhoods)
-- ============================================
INSERT INTO neighborhoods (slug, name, city, county, description, avg_cap_rate, avg_price, avg_rent, avg_days_on_market) VALUES
  ('miami', 'Miami', 'Miami', 'Miami-Dade', 'Miami''s diverse neighborhoods offer strong rental demand and appreciation potential for house and multifamily investors.', 6.80, 520000, 3200, 38),
  ('brickell', 'Brickell', 'Miami', 'Miami-Dade', 'Miami''s financial district. Higher entry price, strong corporate housing demand.', 5.20, 680000, 4200, 45),
  ('wynwood', 'Wynwood', 'Miami', 'Miami-Dade', 'Arts district with rapidly appreciating properties and growing rental demand.', 7.10, 420000, 2900, 28),
  ('little-havana', 'Little Havana', 'Miami', 'Miami-Dade', 'Affordable entry point with some of the highest cap rates in Miami-Dade.', 7.80, 380000, 2600, 22),
  ('coconut-grove', 'Coconut Grove', 'Miami', 'Miami-Dade', 'Upscale village atmosphere with premium properties and stable demand.', 5.50, 750000, 4800, 52),
  ('edgewater', 'Edgewater', 'Miami', 'Miami-Dade', 'Growing neighborhood between Wynwood and the Bay with investor opportunity.', 6.20, 440000, 3000, 32),
  ('fort-lauderdale', 'Fort Lauderdale', 'Fort Lauderdale', 'Broward', 'Broward County''s urban core with excellent multifamily opportunities.', 7.40, 450000, 3100, 30),
  ('pompano-beach', 'Pompano Beach', 'Pompano Beach', 'Broward', 'Undervalued market with strong cap rates and growing demand.', 8.50, 350000, 2500, 25),
  ('west-palm-beach', 'West Palm Beach', 'West Palm Beach', 'Palm Beach', 'Palm Beach County hub with affordable investment properties.', 8.10, 310000, 2400, 28),
  ('boca-raton', 'Boca Raton', 'Boca Raton', 'Palm Beach', 'Premium South Palm Beach market with stable demand and appreciation.', 5.90, 520000, 3500, 48);