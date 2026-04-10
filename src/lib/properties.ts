import type {
  Property,
  PropertyFinancials,
  PropertyWithDetails,
  SearchFilters,
  InvestmentVerdict,
  Neighborhood,
} from "@/types/property";

// Load the real property data
let _properties: RawProperty[] | null = null;

interface RawFinancials {
  estimated_rent_monthly: number;
  cap_rate: number;
  cash_on_cash_return: number;
  monthly_cash_flow: number;
  monthly_mortgage_estimate: number;
  one_percent_rule: boolean;
  gross_rent_multiplier: number;
  price_per_sqft: number;
  annual_property_tax: number;
  annual_insurance_estimate: number;
  annual_maintenance_estimate: number;
  annual_management_estimate: number;
  annual_hoa: number;
  down_payment_percent: number;
  interest_rate: number;
}

interface RawProperty {
  source_id: string;
  source: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  neighborhood: string | null;
  county: string | null;
  price: number;
  beds: number;
  baths: number;
  half_baths: number;
  sqft: number;
  lot_size: number | null;
  year_built: number | null;
  property_type: string;
  hoa_fee: number;
  days_on_market: number;
  description: string | null;
  status: string;
  mls_id: string | null;
  listing_url: string;
  photos: string[];
  assessed_value: number | null;
  estimated_value: number | null;
  new_construction: boolean;
  financials: RawFinancials;
  verdict: InvestmentVerdict;
  e2_eligible: boolean;
}

async function loadProperties(): Promise<RawProperty[]> {
  if (_properties) return _properties;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/data/properties.json`
    );
    if (res.ok) {
      _properties = await res.json();
      return _properties!;
    }
  } catch {
    // fallback
  }

  // Fallback: try direct file read (server-side only)
  if (typeof window === "undefined") {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const dataPath = path.join(
        process.cwd(),
        "..",
        "data",
        "properties.json"
      );
      const raw = fs.readFileSync(dataPath, "utf-8");
      _properties = JSON.parse(raw);
      return _properties!;
    } catch (e) {
      console.error("Failed to load properties:", e);
    }
  }

  return [];
}

function mapRawToProperty(raw: RawProperty): PropertyWithDetails {
  const financials: PropertyFinancials = {
    propertyId: raw.source_id,
    estimatedRentMonthly: raw.financials.estimated_rent_monthly,
    estimatedRentSource: raw.source === "realtor" ? "market_estimate" : "formula",
    capRate: raw.financials.cap_rate,
    cashOnCashReturn: raw.financials.cash_on_cash_return,
    monthlyCashFlow: raw.financials.monthly_cash_flow,
    onePercentRule: raw.financials.one_percent_rule,
    pricePerSqft: raw.financials.price_per_sqft,
    neighborhoodAvgPricePerSqft: null,
    annualInsuranceEstimate: raw.financials.annual_insurance_estimate,
    annualMaintenanceEstimate: raw.financials.annual_maintenance_estimate,
    grossRentMultiplier: raw.financials.gross_rent_multiplier,
  };

  return {
    id: raw.source_id,
    slug: raw.slug,
    sourceId: raw.source_id,
    source: raw.source,
    address: raw.address,
    city: raw.city,
    state: raw.state,
    zip: raw.zip,
    latitude: raw.latitude,
    longitude: raw.longitude,
    neighborhood: raw.neighborhood,
    price: raw.price,
    beds: raw.beds,
    baths: raw.baths + (raw.half_baths || 0) * 0.5,
    sqft: raw.sqft,
    lotSize: raw.lot_size,
    yearBuilt: raw.year_built,
    propertyType: raw.property_type as Property["propertyType"],
    subtype: raw.county,
    hoaFee: raw.hoa_fee > 0 ? raw.hoa_fee : null,
    annualTax: raw.financials.annual_property_tax > 0 ? raw.financials.annual_property_tax : null,
    daysOnMarket: raw.days_on_market,
    status: raw.status === "FOR_SALE" ? "ACTIVE" : (raw.status as Property["status"]),
    listingUrl: raw.listing_url || null,
    mlsId: raw.mls_id,
    description: raw.description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    detail: null,
    financials,
    images: raw.photos?.map((url, i) => ({
      id: `${raw.source_id}-${i}`,
      propertyId: raw.source_id,
      url,
      caption: null,
      order: i,
      isPrimary: i === 0,
    })) || [],
    aiInsight: {
      id: raw.source_id,
      propertyId: raw.source_id,
      summary: generateSummary(raw),
      pros: generatePros(raw),
      risks: generateRisks(raw),
      e2Eligible: raw.e2_eligible,
      e2Notes: raw.e2_eligible
        ? `At $${raw.price.toLocaleString()}, this property meets the E-2 visa investment threshold. Combined with active property management, this investment would support a strong E-2 application for Canadian investors.`
        : "Property price is below typical E-2 visa investment threshold ($200K+). Consider combining with additional investment.",
      investmentVerdict: raw.verdict,
      comparableProperties: [],
      generatedAt: new Date().toISOString(),
      modelUsed: "template",
    },
  };
}

function generateSummary(raw: RawProperty): string {
  const f = raw.financials;
  const type = raw.property_type === "SINGLE_FAMILY" ? "single-family home" : "multifamily property";
  const onePct = f.one_percent_rule ? "passes" : "does not meet";
  const capVs = f.cap_rate >= 6.8 ? "above" : f.cap_rate >= 5.5 ? "near" : "below";

  return `This ${raw.beds}-bedroom ${type} in ${raw.city} is listed at $${raw.price.toLocaleString()} with an estimated monthly rent of $${f.estimated_rent_monthly.toLocaleString()}. It ${onePct} the 1% rule, and its ${f.cap_rate}% cap rate is ${capVs} the South Florida average of 6.8%. Monthly cash flow is estimated at $${f.monthly_cash_flow.toLocaleString()}.`;
}

function generatePros(raw: RawProperty): string[] {
  const f = raw.financials;
  const pros: string[] = [];

  if (f.cap_rate >= 7) pros.push(`Strong cap rate (${f.cap_rate}%) exceeding South Florida average`);
  if (f.one_percent_rule) pros.push(`Passes the 1% rule with $${f.estimated_rent_monthly.toLocaleString()}/month estimated rent`);
  if (f.cash_on_cash_return >= 5) pros.push(`Cash on cash return of ${f.cash_on_cash_return}% is strong`);
  if (raw.e2_eligible) pros.push("E2 visa eligible for Canadian investors");
  if (raw.hoa_fee === 0) pros.push("No HOA fees — full control over the property");
  if (raw.year_built && raw.year_built >= 2000) pros.push(`Modern construction (${raw.year_built}) — lower maintenance costs`);
  if (raw.beds >= 3) pros.push(`${raw.beds} bedrooms appeals to families — stronger rental demand`);
  if (raw.price < 400000) pros.push("Lower entry price reduces investment risk");
  if (raw.new_construction) pros.push("New construction — minimal maintenance for years");

  return pros.slice(0, 6);
}

function generateRisks(raw: RawProperty): string[] {
  const f = raw.financials;
  const risks: string[] = [];

  if (raw.year_built && raw.year_built < 1970) risks.push(`Built in ${raw.year_built} — budget ~1% of value annually for maintenance`);
  risks.push("South Florida flood zone — mandatory flood insurance may be required");
  risks.push("Hurricane risk requires adequate insurance coverage");
  if (raw.price > 500000) risks.push("Higher price point means larger down payment required");
  if (f.cap_rate < 6) risks.push(`Cap rate (${f.cap_rate}%) is below market average — limited margin`);
  if (!f.one_percent_rule) risks.push("Does not meet 1% rule — rent may not cover expenses comfortably");
  if (f.monthly_cash_flow < 0) risks.push("Negative monthly cash flow — property costs more than it earns");
  risks.push("Property taxes may increase as area appreciates");
  if (raw.hoa_fee > 0) risks.push(`$${raw.hoa_fee}/month HOA fees reduce net returns`);

  return risks.slice(0, 6);
}

// ============================================================
// PUBLIC API
// ============================================================

export async function getProperties(
  filters: SearchFilters = {}
): Promise<{ properties: PropertyWithDetails[]; total: number }> {
  const raw = await loadProperties();
  let results = raw.map(mapRawToProperty);

  // Apply filters
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.address.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.neighborhood?.toLowerCase().includes(q) ||
        p.zip.includes(q)
    );
  }

  if (filters.propertyType?.length) {
    results = results.filter((p) =>
      filters.propertyType!.includes(p.propertyType)
    );
  }

  if (filters.city?.length) {
    results = results.filter((p) =>
      filters.city!.some((c) => p.city.toLowerCase() === c.toLowerCase())
    );
  }

  if (filters.priceMin) {
    results = results.filter((p) => p.price >= filters.priceMin!);
  }
  if (filters.priceMax) {
    results = results.filter((p) => p.price <= filters.priceMax!);
  }
  if (filters.bedsMin) {
    results = results.filter((p) => p.beds >= filters.bedsMin!);
  }
  if (filters.bathsMin) {
    results = results.filter((p) => p.baths >= filters.bathsMin!);
  }
  if (filters.sqftMin) {
    results = results.filter((p) => p.sqft >= filters.sqftMin!);
  }
  if (filters.capRateMin) {
    results = results.filter(
      (p) => (p.financials?.capRate ?? 0) >= filters.capRateMin!
    );
  }
  if (filters.capRateMax) {
    results = results.filter(
      (p) => (p.financials?.capRate ?? 0) <= filters.capRateMax!
    );
  }
  if (filters.cashFlowMin) {
    results = results.filter(
      (p) => (p.financials?.monthlyCashFlow ?? 0) >= filters.cashFlowMin!
    );
  }

  // Sort
  switch (filters.sortBy) {
    case "price_asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "cap_rate":
      results.sort(
        (a, b) => (b.financials?.capRate ?? 0) - (a.financials?.capRate ?? 0)
      );
      break;
    case "cash_flow":
      results.sort(
        (a, b) =>
          (b.financials?.monthlyCashFlow ?? 0) -
          (a.financials?.monthlyCashFlow ?? 0)
      );
      break;
    case "newest":
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "days_on_market":
      results.sort(
        (a, b) => (a.daysOnMarket ?? 999) - (b.daysOnMarket ?? 999)
      );
      break;
  }

  const total = results.length;

  // Paginate
  const page = filters.page || 1;
  const limit = filters.limit || 24;
  const start = (page - 1) * limit;
  results = results.slice(start, start + limit);

  return { properties: results, total };
}

export async function getPropertyBySlug(
  slug: string
): Promise<PropertyWithDetails | null> {
  const raw = await loadProperties();
  const found = raw.find((p) => p.slug === slug);
  return found ? mapRawToProperty(found) : null;
}

export async function getFeaturedProperties(
  count = 6
): Promise<PropertyWithDetails[]> {
  const raw = await loadProperties();
  // Mix of STRONG and MODERATE, sorted by cap rate
  const good = raw
    .filter((p) => p.verdict === "STRONG" || p.verdict === "MODERATE")
    .sort((a, b) => b.financials.cap_rate - a.financials.cap_rate)
    .slice(0, count);
  return good.map(mapRawToProperty);
}

export async function getNeighborhoods(): Promise<Neighborhood[]> {
  const raw = await loadProperties();

  // Group by city
  const cityMap = new Map<
    string,
    {
      count: number;
      capRates: number[];
      prices: number[];
      rents: number[];
      doms: number[];
    }
  >();

  for (const p of raw) {
    const key = p.city;
    if (!cityMap.has(key)) {
      cityMap.set(key, {
        count: 0,
        capRates: [],
        prices: [],
        rents: [],
        doms: [],
      });
    }
    const stats = cityMap.get(key)!;
    stats.count++;
    stats.capRates.push(p.financials.cap_rate);
    stats.prices.push(p.price);
    stats.rents.push(p.financials.estimated_rent_monthly);
    stats.doms.push(p.days_on_market);
  }

  const neighborhoods: Neighborhood[] = [];
  for (const [city, stats] of cityMap) {
    const avg = (arr: number[]) =>
      arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    neighborhoods.push({
      id: city.toLowerCase().replace(/\s+/g, "-"),
      slug: city.toLowerCase().replace(/\s+/g, "-"),
      name: city,
      city,
      state: "FL",
      description: null,
      investmentOverview: null,
      avgCapRate: Math.round(avg(stats.capRates) * 100) / 100,
      avgPrice: Math.round(avg(stats.prices)),
      avgRent: Math.round(avg(stats.rents)),
      avgDaysOnMarket: Math.round(avg(stats.doms)),
      totalListings: stats.count,
    });
  }

  // Sort by total listings desc
  neighborhoods.sort((a, b) => b.totalListings - a.totalListings);
  return neighborhoods;
}

export async function getMarketStats(): Promise<{
  totalProperties: number;
  avgCapRate: number;
  medianPrice: number;
  avgRent: number;
  strongCount: number;
  e2Count: number;
}> {
  const raw = await loadProperties();
  if (raw.length === 0) {
    return {
      totalProperties: 0,
      avgCapRate: 0,
      medianPrice: 0,
      avgRent: 0,
      strongCount: 0,
      e2Count: 0,
    };
  }

  const capRates = raw.map((p) => p.financials.cap_rate);
  const prices = raw.map((p) => p.price);
  const rents = raw.map((p) => p.financials.estimated_rent_monthly);

  const avg = (arr: number[]) =>
    arr.reduce((a, b) => a + b, 0) / arr.length;
  const median = (arr: number[]) => {
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  };

  return {
    totalProperties: raw.length,
    avgCapRate: Math.round(avg(capRates) * 100) / 100,
    medianPrice: median(prices),
    avgRent: Math.round(avg(rents)),
    strongCount: raw.filter((p) => p.verdict === "STRONG").length,
    e2Count: raw.filter((p) => p.e2_eligible).length,
  };
}
