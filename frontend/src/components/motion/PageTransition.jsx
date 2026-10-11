import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { EASE_CINEMATIC } from "./Reveal";

/**
 * Route-level crossfade. mode="wait" means the outgoing page fully leaves before
 * the next one enters, which keeps the scroll position from jumping mid-transition.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10, filter: "blur(7px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(7px)" }}
        transition={{ duration: 0.42, ease: EASE_CINEMATIC }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Sun/moon swap that rotates and scales instead of hard-cutting. */
export function ThemeMorph({ icon: Icon, theme }) {
  const reduce = useReducedMotion();
  if (reduce) return <Icon className="w-4 h-4" />;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={theme}
        initial={{ rotate: -80, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 80, scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE_CINEMATIC }}
        className="inline-flex"
      >
        <Icon className="w-4 h-4" />
      </motion.span>
    </AnimatePresence>
  );
}
