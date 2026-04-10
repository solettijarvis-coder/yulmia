"use client";

import { Bed, Bath, Square, CalendarDays, Building2, Clock } from "lucide-react";

interface QuickStatsBarProps {
  beds: number;
  baths: number;
  halfBaths?: number;
  sqft: number;
  yearBuilt?: number | null;
  daysOnMarket: number;
  propertyType: string;
}

export function QuickStatsBar({
  beds,
  baths,
  halfBaths,
  sqft,
  yearBuilt,
  daysOnMarket,
  propertyType,
}: QuickStatsBarProps) {
  const stats = [
    {
      icon: Bed,
      value: `${beds}`,
      label: beds === 1 ? "Bed" : "Beds",
    },
    {
      icon: Bath,
      value: halfBaths ? `${baths}/${halfBaths}` : `${baths}`,
      label: halfBaths ? "Full/Half Baths" : baths === 1 ? "Bath" : "Baths",
    },
    {
      icon: Square,
      value: sqft.toLocaleString(),
      label: "Sqft",
    },
    ...(yearBuilt
      ? [
          {
            icon: CalendarDays,
            value: `${yearBuilt}`,
            label: "Year Built",
          },
        ]
      : []),
    {
      icon: Building2,
      value: propertyType,
      label: "Type",
    },
    {
      icon: Clock,
      value: `${daysOnMarket}`,
      label: daysOnMarket === 1 ? "Day on Market" : "Days on Market",
    },
  ];

  return (
    <div className="w-full bg-card border border-border rounded-xl px-4 py-3">
      <div className="flex flex-wrap items-center gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const isLast = i === stats.length - 1;
          return (
            <div
              key={stat.label}
              className={`flex items-center gap-2 ${
                !isLast ? "border-r border-border pr-4" : ""
              } max-sm:border-r-0 max-sm:pr-0`}
            >
              <Icon className="h-4 w-4 text-[#C8A960] shrink-0" />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
