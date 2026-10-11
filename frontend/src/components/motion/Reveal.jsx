import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export const EASE_CINEMATIC = [0.16, 1, 0.3, 1];

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export const revealItem = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.62, ease: EASE_CINEMATIC },
  },
};

/**
 * Stagger parent. Children using <Reveal> inherit the entrance timeline.
 * `once` keeps a section from re-animating every time it re-enters the viewport.
 */
export function Stagger({ children, className, delay = 0, once = true, ...rest }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.07, delayChildren: delay },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Stagger child, or a standalone scroll reveal when outside a <Stagger>. */
export function Reveal({ children, className, as = "div", ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;
  if (reduce) {
    const Plain = as;
    return <Plain className={className} {...rest}>{children}</Plain>;
  }
  return (
    <Tag className={className} variants={revealItem} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Headline mask reveal — each line slides up out of a clipped band and the
 * letter-spacing settles as it lands. Reads as a title card rather than a pop-in.
 */
export function MaskLine({ children, className, delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{children}</span>;
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={"block " + (className || "")}
        initial={{ y: "115%", letterSpacing: "0.06em" }}
        animate={{ y: "0%", letterSpacing: "-0.02em" }}
        transition={{ duration: 0.85, ease: EASE_CINEMATIC, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Fades + un-blurs a single block on mount. For panels that aren't in a stagger. */
export function Fade({ children, className, delay = 0, y = 12 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: EASE_CINEMATIC, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Section header: accent kicker with a blinking caret, then a masked title.
 * The recurring visual beat that gives every page the same opening rhythm.
 */
export function SectionHeading({ kicker, title, subtitle, right, testid, className = "" }) {
  return (
    <div className={"flex flex-col md:flex-row md:items-end md:justify-between gap-4 " + className}>
      <div>
        {kicker && (
          <div className="kicker flex items-center gap-1.5">
            <span>{kicker}</span>
            <span className="caret-blink inline-block w-[6px] h-[11px] bg-brand" />
          </div>
        )}
        <h1 className="font-display text-4xl lg:text-5xl font-bold mt-1">
          <MaskLine delay={0.08}>{title}</MaskLine>
        </h1>
        {subtitle && (
          <Fade delay={0.28}>
            <p className="text-ink-2 mt-2 text-sm">{subtitle}</p>
          </Fade>
        )}
      </div>
      {right && <Fade delay={0.34}>{right}</Fade>}
      <span data-testid={testid} hidden />
    </div>
  );
}
