"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NearbyPlace {
  name: string;
  type: string;
  distance: string;
  icon: string;
}

interface NearbyPlacesProps {
  places: NearbyPlace[];
}

const typeOrder = ["Schools", "Grocery", "Medical", "Transit", "Shopping"];
const typeHeaders: Record<string, string> = {
  Schools: "Schools",
  Grocery: "Grocery",
  Medical: "Medical",
  Transit: "Transit",
  Shopping: "Shopping",
};

export function NearbyPlaces({ places }: NearbyPlacesProps) {
  // Group places by type
  const grouped: Record<string, NearbyPlace[]> = {};
  for (const place of places) {
    if (!grouped[place.type]) grouped[place.type] = [];
    grouped[place.type].push(place);
  }

  // Sort groups in defined order
  const sortedTypes = typeOrder.filter((t) => grouped[t] && grouped[t].length > 0);

  // Add any types not in the predefined order
  for (const type of Object.keys(grouped)) {
    if (!typeOrder.includes(type)) sortedTypes.push(type);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-serif">Nearby Places</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedTypes.map((type) => {
          const items = grouped[type].slice(0, 4); // Max 4 per category
          return (
            <div key={type}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {typeHeaders[type] || type}
              </h4>
              <ul className="space-y-1.5">
                {items.map((place, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-foreground">
                      <span className="text-base leading-none">{place.icon}</span>
                      <span>{place.name}</span>
                    </span>
                    <span className="text-muted-foreground text-xs ml-2 flex-shrink-0">
                      {place.distance}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
