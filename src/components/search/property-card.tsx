"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatPercent } from "@/lib/utils";
import type { PropertyType, InvestmentVerdict } from "@/types/property";

interface PropertyCardProps {
  id: string;
  slug: string;
  address: string;
  city: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: PropertyType;
  photos: string[];
  capRate: number;
  cashFlow: number;
  cocReturn: number;
  rent: number;
  verdict: InvestmentVerdict;
  e2Eligible: boolean;
  daysOnMarket: number;
  yearBuilt: number | null;
  hoaFee: number;
}

const verdictConfig = {
  STRONG: { label: "Strong", className: "bg-success/10 text-success border-success/20" },
  MODERATE: { label: "Moderate", className: "bg-warning/10 text-warning border-warning/20" },
  CAUTIOUS: { label: "Cautious", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function PropertyCard({
  slug,
  address,
  city,
  zip,
  price,
  beds,
  baths,
  sqft,
  photos,
  capRate,
  rent,
  verdict,
  e2Eligible,
  daysOnMarket,
}: PropertyCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCarousel = useCallback(() => {
    if (photos.length <= 1) return;
    setIsHovered(true);
    intervalRef.current = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 1500);
  }, [photos.length]);

  const stopCarousel = useCallback(() => {
    setIsHovered(false);
    setPhotoIndex(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const vConfig = verdictConfig[verdict];
  const grossYield = ((rent * 12) / price * 100).toFixed(1);
  const hasPhotos = photos.length > 0;

  return (
    <a
      href={`/property/${slug}`}
      className="group block"
      onMouseEnter={startCarousel}
      onMouseLeave={stopCarousel}
    >
      <div className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
        {/* Image with Carousel */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {hasPhotos ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-gray-800 transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${photos[photoIndex]})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges - Top Left */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Badge className={`${vConfig.className} border text-xs font-semibold`}>
              {vConfig.label}
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 border text-[10px] font-semibold">
              FOR SALE
            </Badge>
          </div>

          {/* E-2 Badge - next to FOR SALE on left */}
          {e2Eligible && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <Badge className="bg-[#C8A960]/20 text-[#C8A960] border-[#C8A960]/30 border text-[10px] font-semibold">
                E-2
              </Badge>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`absolute top-3 ${e2Eligible ? "right-16" : "right-3"} z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-white"
              }`}
            />
          </button>

          {/* Dot Indicators */}
          {photos.length > 1 && isHovered && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === photoIndex
                      ? "bg-white"
                      : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Price - Bottom Left */}
          <div className="absolute bottom-3 left-3">
            <span className="text-xl font-serif font-bold text-white">
              {formatPrice(price)}
            </span>
          </div>

          {/* Days on Market - Bottom Right */}
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
              {daysOnMarket}d on market
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-[#C8A960] mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">{address}</p>
              <p className="text-xs text-muted-foreground">
                {city}, FL {zip}
              </p>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            <span>{beds} bd</span>
            <span className="text-border">|</span>
            <span>{baths} ba</span>
            <span className="text-border">|</span>
            <span>{sqft.toLocaleString()} sqft</span>
          </div>

          <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-sm font-bold text-[#C8A960]">{formatPercent(capRate)}</p>
              <p className="text-[10px] text-muted-foreground">Cap Rate</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#C8A960]">{formatPrice(rent)}</p>
              <p className="text-[10px] text-muted-foreground">Est. Rent</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#C8A960]">{formatPercent(parseFloat(grossYield))}</p>
              <p className="text-[10px] text-muted-foreground">Gross Yield</p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
