"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type MagneticProps = {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  innerClassName?: string;
};

/**
 * Pulls its child toward the pointer while the pointer is near it. The hit box
 * is padded relative to the element so the pull begins before the pointer
 * reaches the edge, which is what reads as "magnetic".
 */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
  innerClassName = "",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const spring = { stiffness: 210, damping: 17, mass: 0.45 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  // The label drifts a touch further than the plate for depth.
  const labelX = useTransform(x, (value) => value * 0.3);
  const labelY = useTransform(y, (value) => value * 0.3);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    rawX.set(offsetX * strength);
    rawY.set(offsetY * strength);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={`inline-flex ${className}`}
      style={{ padding: "10px" }}
    >
      <motion.div style={{ x, y }} className={`w-full ${innerClassName}`}>
        <motion.div style={{ x: labelX, y: labelY }}>{children}</motion.div>
      </motion.div>
    </div>
  );
}
