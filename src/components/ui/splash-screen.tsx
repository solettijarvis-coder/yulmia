"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [phase, setPhase] = useState<"logo" | "tagline" | "fadeout" | "done">("logo");
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Only show on first visit per session
    const seen = sessionStorage.getItem("yulmia-splash-seen");
    if (seen) {
      setPhase("done");
      return;
    }
    setShouldShow(true);
    const t1 = setTimeout(() => setPhase("tagline"), 900);
    const t2 = setTimeout(() => setPhase("fadeout"), 2600);
    const t3 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("yulmia-splash-seen", "1");
    }, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done" || !shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        animate={phase === "fadeout" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center"
      >
        <div className="flex flex-col items-center">
          {/* Glow behind the text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-[300px] h-[80px] blur-[80px] bg-[#C8A960] rounded-full"
          />

          {/* The letters - reveal one by one */}
          <div className="relative flex items-center">
            {"YULMIA".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="text-7xl sm:text-8xl md:text-9xl font-extralight tracking-[-0.06em] text-[#EDEDEF]"
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Gold line that sweeps across */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
            className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#C8A960] to-transparent origin-center mt-4"
          />

          {/* Tagline */}
          <AnimatePresence>
            {(phase === "tagline" || phase === "fadeout") && (
              <motion.div
                initial={{ opacity: 0, y: 6, letterSpacing: "0.05em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.2em" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mt-5 flex items-center gap-3"
              >
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C8A960]/80 font-light">
                  Montreal
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="w-6 h-[1px] bg-[#6B6B73] inline-block"
                />
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C8A960]/80 font-light">
                  Miami
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle scanning line effect */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "200%" }}
            transition={{ duration: 1.5, delay: 0.3, ease: "linear" }}
            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8A960]/30 to-transparent"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}