"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Direction = "up" | "left" | "right" | "down";

const fromClip: Record<Direction, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Scroll triggered clip-path reveal. The wrapper uncovers the media while the
 * media itself settles from a slight scale, which keeps the motion from
 * feeling like a flat wipe.
 */
export function ClipReveal({
  children,
  direction = "up",
  duration = 1.5,
  scale = 1.14,
  className = "",
  start = "top 82%",
}: {
  children: React.ReactNode;
  direction?: Direction;
  duration?: number;
  scale?: number;
  className?: string;
  start?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const frame = root.current;
      if (!frame) return;
      const media = frame.querySelector("[data-clip-media]");

      gsap.set(frame, { clipPath: fromClip[direction] });
      if (media) gsap.set(media, { scale });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: frame, start, once: true },
        defaults: { ease: "expo.out" },
      });

      tl.to(frame, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration,
      });

      if (media) {
        tl.to(media, { scale: 1, duration: duration * 1.15 }, 0);
      }
    }, root);

    return () => ctx.revert();
  }, [direction, duration, scale, start]);

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div data-clip-media className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
