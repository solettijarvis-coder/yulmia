// Property types - NO CONDOS
export type PropertyType =
  | "SINGLE_FAMILY"
  | "MULTIFAMILY_2_4"
  | "MULTIFAMILY_5PLUS"
  | "DISTRESSED"
  | "LAND"
  | "COMMERCIAL";

export type PropertyStatus = "ACTIVE" | "PENDING" | "SOLD" | "WITHDRAWN" | "OFF_MARKET";

export type InvestmentVerdict = "STRONG" | "MODERATE" | "CAUTIOUS";

export interface Property {
  id: string;
  slug: string;
  sourceId: string;
  source: string;

  // Location
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  neighborhood: string | null;

  // Core details
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: number | null;
  yearBuilt: number | null;
  propertyType: PropertyType;
  subtype: string | null;
  hoaFee: number | null;
  annualTax: number | null;
  daysOnMarket: number | null;

  // Status
  status: PropertyStatus;
  listingUrl: string | null;
  mlsId: string | null;

  // Description
  description: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface PropertyDetail extends Property {
  // Enrichment data
  floodZone: string | null;
  floodRiskScore: number | null;
  walkScore: number | null;
  transitScore: number | null;
  bikeScore: number | null;
  schoolRatingAvg: number | null;
  neighborhoodScore: number | null;
  zoning: string | null;
}

export interface PropertyFinancials {
  propertyId: string;
  estimatedRentMonthly: number | null;
  estimatedRentSource: string | null;
  capRate: number | null;
  cashOnCashReturn: number | null;
  monthlyCashFlow: number | null;
  onePercentRule: boolean | null;
  pricePerSqft: number | null;
  neighborhoodAvgPricePerSqft: number | null;
  annualInsuranceEstimate: number | null;
  annualMaintenanceEstimate: number | null;
  grossRentMultiplier: number | null;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  caption: string | null;
  order: number;
  isPrimary: boolean;
}

export interface AIInsight {
  id: string;
  propertyId: string;
  summary: string;
  pros: string[];
  risks: string[];
  e2Eligible: boolean | null;
  e2Notes: string | null;
  investmentVerdict: InvestmentVerdict;
  comparableProperties: string[];
  generatedAt: string;
  modelUsed: string;
}

export interface PropertyWithDetails extends Property {
  detail: PropertyDetail | null;
  financials: PropertyFinancials | null;
  images: PropertyImage[];
  aiInsight: AIInsight | null;
}

// Search filters
export interface SearchFilters {
  query?: string;
  propertyType?: PropertyType[];
  city?: string[];
  neighborhood?: string[];
  priceMin?: number;
  priceMax?: number;
  bedsMin?: number;
  bathsMin?: number;
  sqftMin?: number;
  capRateMin?: number;
  capRateMax?: number;
  cashFlowMin?: number;
  sortBy?: "price_asc" | "price_desc" | "cap_rate" | "cash_flow" | "newest" | "days_on_market";
  page?: number;
  limit?: number;
}

// Neighborhood
export interface Neighborhood {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  description: string | null;
  investmentOverview: string | null;
  avgCapRate: number | null;
  avgPrice: number | null;
  avgRent: number | null;
  avgDaysOnMarket: number | null;
  totalListings: number;
}