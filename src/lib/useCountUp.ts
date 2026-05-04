import { useEffect, useRef, useState } from "react";

/**
 * Smoothly animates a numeric value toward `target` using an
 * Apple-style ease-out curve. Returns the current rounded value.
 */
export function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      setValue(target);
      return;
    }
    fromRef.current = value;
    startRef.current = null;

    const ease = (t: number) => 1 - Math.pow(1 - t, 4); // easeOutQuart

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      const next = fromRef.current + (target - fromRef.current) * ease(t);
      setValue(next);
      if (t < 1) rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return value;
}
