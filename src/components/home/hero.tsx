"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const heroImages = [
  "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1920&q=80",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=80",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
];

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  // Cycle hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <section className="relative h-screen flex items-end overflow-hidden">
      {/* Full-bleed photography background */}
      <div className="absolute inset-0">
        {heroImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms]"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === currentImage ? 1 : 0,
            }}
          />
        ))}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-background/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-gold">
            Montreal → Miami
          </span>
        </motion.div>

        {/* Display headline — tight tracked, weight 300 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[clamp(2.5rem,8vw,6rem)] font-light tracking-[-0.04em] leading-[0.95] text-foreground max-w-[900px]"
        >
          Investment properties,{" "}
          <span className="text-muted-foreground">not condos.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed tracking-[0.01em]"
        >
          Houses, multifamily, and distressed properties across South Florida. 
          AI-powered analysis. E-2 visa guidance for Canadian investors.
        </motion.p>

        {/* Search bar — single, clean, Revolut-style */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-10 max-w-xl"
        >
          <div className="flex items-center gap-0 border border-border bg-card/80 backdrop-blur-sm">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="City, address, or ZIP code..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full h-12 bg-transparent pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none tracking-[0.01em]"
              />
            </div>
            <button
              onClick={handleSearch}
              className="h-12 px-6 bg-foreground text-background text-sm font-medium tracking-[0.01em] hover:bg-foreground/90 transition-colors flex items-center gap-2"
            >
              Search
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Quick stats row — flat, no cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-14 flex items-center gap-8 lg:gap-12 text-muted-foreground"
        >
          {[
            { value: "5,826", label: "Properties" },
            { value: "40+", label: "Cities" },
            { value: "5,606", label: "E-2 Eligible" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-xl lg:text-2xl font-light tracking-[-0.02em] text-foreground tabular-nums">
                {stat.value}
              </div>
              <div className="text-[11px] tracking-[0.1em] uppercase mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="h-4 w-4 text-muted-foreground/40 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
