"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

interface PropertyCardProps {
  property: {
    id: string;
    slug: string;
    address: string;
    city: string;
    zip: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    propertyType: string;
    photo?: string | null;
    photos?: string[];
    capRate: number;
    cashFlow: number;
    cocReturn: number;
    rent: number;
    verdict: "STRONG" | "MODERATE" | "CAUTIOUS";
    e2Eligible: boolean;
    grossYield?: number;
    daysOnMarket?: number;
    yearBuilt?: number | null;
    hoaFee?: number;
    onePercentRule?: boolean;
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function PropertyCard({ property }: PropertyCardProps) {
  const photo = property.photos?.[0] || property.photo;
  const cashFlowPositive = property.cashFlow >= 0;

  return (
    <Link
      href={`/property/${property.slug}`}
      className="group block border border-border hover:border-gold/20 transition-colors"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-card">
        {photo ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${photo})` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-muted-foreground/20 text-xs">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        {/* Badges — minimal, top-left */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`text-[9px] font-medium tracking-[0.1em] uppercase px-1.5 py-0.5 ${
            property.verdict === "STRONG"
              ? "bg-success/15 text-success"
              : property.verdict === "MODERATE"
              ? "bg-warning/15 text-warning"
              : "bg-destructive/15 text-destructive"
          }`}>
            {property.verdict}
          </span>
          {property.e2Eligible && (
            <span className="text-[9px] font-medium tracking-[0.1em] uppercase px-1.5 py-0.5 bg-gold/10 text-gold">
              E-2
            </span>
          )}
        </div>

        {/* Price — bottom-left */}
        <div className="absolute bottom-2 left-2">
          <span className="text-lg font-light tracking-[-0.02em] text-foreground tabular-nums">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>

      {/* Data tile */}
      <div className="p-3">
        {/* Address */}
        <div className="text-[13px] text-foreground tracking-[0.01em] truncate">
          {property.address}
        </div>
        <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
          <MapPin className="h-2.5 w-2.5" />
          {property.city}, FL {property.zip}
        </div>

        {/* Metrics grid — Bloomberg tile */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/50">
          <div>
            <div className="text-[9px] tracking-[0.1em] uppercase text-muted-foreground/40">Cap Rate</div>
            <div className="text-[13px] font-light tabular-nums text-gold">{property.capRate}%</div>
          </div>
          <div>
            <div className="text-[9px] tracking-[0.1em] uppercase text-muted-foreground/40">Cash Flow</div>
            <div className={`text-[13px] font-light tabular-nums ${cashFlowPositive ? "text-success" : "text-muted-foreground"}`}>
              {cashFlowPositive ? "+" : ""}${Math.abs(property.cashFlow).toLocaleString()}/mo
            </div>
          </div>
          <div>
            <div className="text-[9px] tracking-[0.1em] uppercase text-muted-foreground/40">Rent</div>
            <div className="text-[13px] font-light tabular-nums text-foreground tabular-nums">
              ${formatNumber(property.rent)}/mo
            </div>
          </div>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground tabular-nums">
          <span>{property.beds} bd</span>
          <span>{property.baths} ba</span>
          <span>{formatNumber(property.sqft)} sqft</span>
        </div>
      </div>
    </Link>
  );
}
