"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  photos: string[];
}

export function ImageGallery({ photos }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      setSelectedIndex((index + photos.length) % photos.length);
    },
    [photos.length]
  );

  const goNext = useCallback(() => goTo(selectedIndex + 1), [goTo, selectedIndex]);
  const goPrev = useCallback(() => goTo(selectedIndex - 1), [goTo, selectedIndex]);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      {/* Gallery Card */}
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Main Image */}
        <div className="relative aspect-[16/9] bg-gray-900 group">
          <div
            className="w-full h-full bg-cover bg-center cursor-zoom-in"
            style={{ backgroundImage: `url(${photos[selectedIndex]})` }}
            onClick={() => setLightboxOpen(true)}
          />

          {/* Nav Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 text-white text-xs font-medium">
            {selectedIndex + 1} / {photos.length}
          </div>
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="flex gap-1.5 p-2 bg-card overflow-x-auto">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-colors ${
                  i === selectedIndex
                    ? "border-primary ring-1 ring-primary/50"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${photo})` }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Counter in lightbox */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-md bg-white/10 text-white text-sm font-medium z-10">
            {selectedIndex + 1} / {photos.length}
          </div>

          {/* Main image */}
          <div
            className="max-w-[90vw] max-h-[85vh] bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${photos[selectedIndex]})` }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Lightbox nav arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
