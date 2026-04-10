"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [phase, setPhase] = useState<"logo" | "tagline" | "fadeout" | "done">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 800);
    const t2 = setTimeout(() => setPhase("fadeout"), 2200);
    const t3 = setTimeout(() => setPhase("done"), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        animate={phase === "fadeout" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: phase === "fadeout" ? 0.8 : 0 }}
        className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center"
      >
        <div className="flex flex-col items-center">
          {/* YULMIA Logo — typographic, high-tech reveal */}
          <div className="relative">
            {/* Glow behind the text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 blur-[60px] bg-[#C8A960]"
            />

            {/* The letters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* Each letter animates in with a stagger */}
              <div className="flex items-center gap-0">
                {"YULMIA".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + i * 0.08,
                      ease: "easeOut",
                    }}
                    className="text-6xl sm:text-7xl md:text-8xl font-light tracking-[-0.08em] text-[#EDEDEF]"
                    style={{ display: "inline-block" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* Horizontal line that sweeps across */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }}
                className="h-px bg-[#C8A960] origin-left mt-2"
              />
            </motion.div>
          </div>

          {/* Tagline — fades in after logo */}
          <AnimatePresence>
            {phase === "tagline" || phase === "fadeout" ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-6 flex items-center gap-2"
              >
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#C8A960]">
                  Montreal
                </span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 0.3 }}
                  className="text-[11px] text-[#6B6B73]"
                >
                  →
                </motion.span>
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#C8A960]">
                  Miami
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}