"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";

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

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Keyboard support for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          goPrev();
          break;
        case "ArrowRight":
          goNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, closeLightbox, goPrev, goNext]);

  if (!photos || photos.length === 0) return null;

  const totalPhotos = photos.length;

  // Single photo: full-width 16:9
  if (totalPhotos === 1) {
    return (
      <>
        <div className="rounded-xl overflow-hidden border border-border">
          <div
            className="aspect-[16/9] bg-cover bg-center cursor-zoom-in hover:brightness-90 transition-all duration-200"
            style={{ backgroundImage: `url(${photos[0]})` }}
            onClick={() => openLightbox(0)}
          />
        </div>

        {lightboxOpen && (
          <Lightbox
            photos={photos}
            selectedIndex={selectedIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </>
    );
  }

  // 2-4 photos: 1 large left + remaining smaller right
  // 5+ photos: 1 large left + 4 smaller right (2x2), bottom-right has overlay
  const smallCount = Math.min(totalPhotos - 1, 4);
  const showOverlay = totalPhotos > 5;
  const overlayCount = totalPhotos - 4; // how many extra photos beyond the 5 shown

  // For 2-4 photos, the right side may have 1-3 items — still arrange in 2x2 grid
  const rightPhotos = photos.slice(1, 1 + smallCount);

  return (
    <>
      {/* Split-grid gallery */}
      <div className="rounded-xl overflow-hidden border border-border">
        <div className="flex h-[400px]">
          {/* Large image on left (60%) */}
          <div
            className="w-[60%] bg-cover bg-center cursor-zoom-in hover:brightness-90 transition-all duration-200"
            style={{ backgroundImage: `url(${photos[0]})` }}
            onClick={() => openLightbox(0)}
          />

          {/* Smaller images on right (40%) in 2x2 grid */}
          <div className="w-[40%] grid grid-cols-2 grid-rows-2 gap-0.5">
            {rightPhotos.map((photo, i) => {
              const isLastSmall = i === smallCount - 1;
              const showSeeAll = showOverlay && isLastSmall;

              return (
                <div
                  key={i}
                  className="relative bg-cover bg-center cursor-zoom-in hover:brightness-90 transition-all duration-200"
                  style={{ backgroundImage: `url(${photo})` }}
                  onClick={() => openLightbox(i + 1)}
                >
                  {/* "See all N Photos" overlay on bottom-right small image */}
                  {showSeeAll && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                      <Camera className="h-6 w-6 mb-1" />
                      <span className="text-sm font-semibold">
                        See all {totalPhotos} Photos
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Fill empty grid cells when fewer than 4 right-side photos */}
            {rightPhotos.length < 4 &&
              Array.from({ length: 4 - rightPhotos.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-gray-900"
                />
              ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          photos={photos}
          selectedIndex={selectedIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}

/* ── Fullscreen Lightbox Carousel ── */

interface LightboxProps {
  photos: string[];
  selectedIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ photos, selectedIndex, onClose, onPrev, onNext }: LightboxProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-md bg-white/10 text-white text-sm font-medium z-10">
        {selectedIndex + 1} / {photos.length}
      </div>

      {/* Main image */}
      <div
        className="max-w-[90vw] max-h-[85vh] w-[90vw] h-[85vh] bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${photos[selectedIndex]})` }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Prev arrow */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}

      {/* Next arrow */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}
    </div>
  );
}
