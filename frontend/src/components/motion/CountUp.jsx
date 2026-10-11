import React, { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { EASE_CINEMATIC } from "./Reveal";

/**
 * Animates a numeric value and formats every frame, so money tickers count up
 * in the same currency format they'll settle in. tabular-nums prevents reflow.
 *
 * `format` must be a stable-ish fn; we keep the latest in a ref so changing the
 * value doesn't restart the animation just because the closure identity did.
 */
export default function CountUp({
  value,
  format = (v) => String(Math.round(v)),
  duration = 1.1,
  delay = 0,
  className = "",
  testid,
}) {
  const reduce = useReducedMotion();
  const formatRef = useRef(format);
  formatRef.current = format;

  const numeric = Number(value) || 0;
  const [display, setDisplay] = useState(() =>
    reduce ? formatRef.current(numeric) : formatRef.current(0)
  );
  const fromRef = useRef(reduce ? numeric : 0);

  useEffect(() => {
    if (reduce) {
      fromRef.current = numeric;
      setDisplay(formatRef.current(numeric));
      return;
    }
    const controls = animate(fromRef.current, numeric, {
      duration,
      delay,
      ease: EASE_CINEMATIC,
      onUpdate: (v) => {
        fromRef.current = v;
        setDisplay(formatRef.current(v));
      },
      onComplete: () => {
        fromRef.current = numeric;
        setDisplay(formatRef.current(numeric));
      },
    });
    return () => controls.stop();
  }, [numeric, reduce, duration, delay]);

  return (
    <span className={"font-mono-tab tabular-nums " + className} data-testid={testid}>
      {display}
    </span>
  );
}
