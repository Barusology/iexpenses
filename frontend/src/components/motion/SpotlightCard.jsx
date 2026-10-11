import React, { useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { revealItem, EASE_CINEMATIC } from "./Reveal";

/**
 * Panel with a cursor-tracked radial glow, an accent rule that draws in on
 * entrance, and a lift on hover. Writes --spot-x/--spot-y straight to the node
 * so pointer movement never triggers a React render.
 */
export default function SpotlightCard({
  children,
  className = "",
  testid,
  accent,
  rule = false,
  as = "div",
  ...rest
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  }, []);

  const Tag = reduce ? as : motion[as] || motion.div;
  const tagProps = reduce
    ? {}
    : {
        variants: revealItem,
        whileHover: { y: -3 },
        transition: { duration: 0.3, ease: EASE_CINEMATIC },
      };

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      data-testid={testid}
      className={`spotlight relative overflow-hidden rounded-2xl border border-hairline bg-surface-1 theme-fade ${className}`}
      {...tagProps}
      {...rest}
    >
      {rule && (
        <AccentRule accent={accent} reduced={reduce} />
      )}
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}

function AccentRule({ accent = "var(--brand)", reduced }) {
  if (reduced) {
    return <div className="absolute top-0 left-0 h-[2px] w-full" style={{ background: accent }} />;
  }
  return (
    <motion.div
      className="absolute top-0 left-0 h-[2px] w-full origin-left z-20"
      style={{ background: accent }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.75, ease: EASE_CINEMATIC, delay: 0.15 }}
    />
  );
}
