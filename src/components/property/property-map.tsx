"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyMapProps {
  address: string;
  city: string;
  state: string;
  zip: string;
}

export function PropertyMap({ address, city, state, zip }: PropertyMapProps) {
  const fullAddress = `${address}, ${city}, ${state} ${zip}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
  const linkUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg text-foreground">
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <iframe
          src={embedUrl}
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: "0.75rem" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Property location on Google Maps"
          className="w-full rounded-xl"
        />

        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-[#C8A960] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-foreground font-medium">{address}</p>
            <p className="text-sm text-muted-foreground">
              {city}, {state} {zip}
            </p>
          </div>
        </div>

        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[#C8A960] hover:underline font-medium"
        >
          View on Google Maps
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </CardContent>
    </Card>
  );
}
