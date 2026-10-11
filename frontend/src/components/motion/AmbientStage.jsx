import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Fixed atmospheric layer behind the app: three slow-drifting light blooms over a
 * masked grid, with scroll parallax so the depth reads as you move down the page.
 *
 * Each bloom is two nested layers on purpose — the outer element is translated by
 * framer-motion, the inner one runs the CSS drift keyframes. CSS animations beat
 * inline styles in the cascade, so combining both on one node would kill the parallax.
 */
export default function AmbientStage({ intensity = 1 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -130]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 95]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -55]);

  const o = Number(intensity);

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* mint / emerald bloom, top-left */}
      <motion.div className="absolute -top-48 -left-40" style={{ y: y1 }}>
        <div
          className={reduce ? "" : "bloom-a"}
          style={{
            width: "48rem",
            height: "48rem",
            borderRadius: "9999px",
            filter: "blur(110px)",
            opacity: o,
            background: "radial-gradient(circle at 50% 50%, var(--bloom-1), transparent 66%)",
          }}
        />
      </motion.div>

      {/* rose / crimson bloom, right side */}
      <motion.div className="absolute top-[28%] -right-48" style={{ y: y2 }}>
        <div
          className={reduce ? "" : "bloom-b"}
          style={{
            width: "44rem",
            height: "44rem",
            borderRadius: "9999px",
            filter: "blur(120px)",
            opacity: o,
            background: "radial-gradient(circle at 50% 50%, var(--bloom-2), transparent 66%)",
          }}
        />
      </motion.div>

      {/* tertiary bloom, low centre */}
      <motion.div className="absolute -bottom-[22rem] left-[22%]" style={{ y: y3 }}>
        <div
          className={reduce ? "" : "bloom-c"}
          style={{
            width: "56rem",
            height: "40rem",
            borderRadius: "9999px",
            filter: "blur(130px)",
            opacity: o,
            background: "radial-gradient(circle at 50% 50%, var(--bloom-3), transparent 64%)",
          }}
        />
      </motion.div>

      <div className="grid-backdrop absolute inset-0" />
    </div>
  );
}
