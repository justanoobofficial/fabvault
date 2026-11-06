"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

type CursorState = {
  mode: "default" | "hover" | "snap";
  label: string;
  width: number;
  height: number;
};

const initialState: CursorState = {
  mode: "default",
  label: "",
  width: 44,
  height: 44,
};

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>(initialState);

  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);

  const ringX = useSpring(pointerX, { stiffness: 180, damping: 22, mass: 0.35 });
  const ringY = useSpring(pointerY, { stiffness: 180, damping: 22, mass: 0.35 });
  const width = useSpring(initialState.width, { stiffness: 260, damping: 28 });
  const height = useSpring(initialState.height, { stiffness: 260, damping: 28 });

  const translateX = useTransform(width, (w) => -w / 2);
  const translateY = useTransform(height, (h) => -h / 2);

  const activeEl = useRef<HTMLElement | null>(null);

  // Drive the ring size from the hover state.
  useEffect(() => {
    width.set(state.width);
    height.set(state.height);
  }, [state.width, state.height, width, height]);

  useEffect(() => {
    const precise = window.matchMedia("(pointer: fine)").matches;
    if (!precise) return;
    setEnabled(true);

    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);

      if (state.mode === "snap" && activeEl.current) {
        const rect = activeEl.current.getBoundingClientRect();
        ringX.set(rect.left + rect.width / 2);
        ringY.set(rect.top + rect.height / 2);
      }
    };

    const resolveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null;
      return target.closest<HTMLElement>("[data-cursor]");
    };

    const onOver = (event: PointerEvent) => {
      const el = resolveTarget(event.target);
      if (!el) {
        if (activeEl.current) {
          activeEl.current = null;
          setState(initialState);
        }
        return;
      }
      activeEl.current = el;
      const mode = el.dataset.cursor as CursorState["mode"] | undefined;
      const label = el.dataset.cursorLabel ?? "";
      const rect = el.getBoundingClientRect();

      if (mode === "snap" && rect.width < 520 && rect.height < 640) {
        setState({
          mode: "snap",
          label,
          width: Math.round(rect.width + 6),
          height: Math.round(rect.height + 6),
        });
        ringX.set(rect.left + rect.width / 2);
        ringY.set(rect.top + rect.height / 2);
      } else {
        setState({
          mode: "hover",
          label,
          width: label ? 96 : 74,
          height: label ? 96 : 74,
        });
      }
    };

    const onOut = (event: PointerEvent) => {
      const el = resolveTarget(event.target);
      if (!el) return;
      activeEl.current = null;
      setState(initialState);
    };

    const onLeaveWindow = () => {
      pointerX.set(-200);
      pointerY.set(-200);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);

    // Magnetic elements drift toward the pointer.
    const magneticHandlers = new WeakMap<
      HTMLElement,
      { move: (e: PointerEvent) => void; leave: () => void }
    >();

    const attachMagnetic = (el: HTMLElement) => {
      if (magneticHandlers.has(el)) return;
      const strength = Number(el.dataset.magnetic) || 0.28;
      const move = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
        const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      };
      const leave = () => {
        el.style.transform = "translate3d(0, 0, 0)";
      };
      el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      magneticHandlers.set(el, { move, leave });
    };

    const magnetObserver = new MutationObserver(() => {
      document
        .querySelectorAll<HTMLElement>("[data-magnetic]")
        .forEach(attachMagnetic);
    });

    document
      .querySelectorAll<HTMLElement>("[data-magnetic]")
      .forEach(attachMagnetic);
    magnetObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerleave", onLeaveWindow);
      magnetObserver.disconnect();
    };
  }, [pointerX, pointerY, ringX, ringY, state.mode]);

  if (!enabled) return null;

  // The ring is outline only so that the inverted fill never washes out the
  // imagery underneath. Difference blending keeps it legible on both tones.
  const accent =
    state.mode === "default" ? "border-white/55" : "border-white/85";

  return (
    <div className="pointer-events-none fixed inset-0 z-[130] hidden mix-blend-difference md:block">
      {/* trailing ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          width,
          height,
          translateX,
          translateY,
        }}
        animate={{
          // Square when it snaps to a card, circular for links.
          borderRadius:
            state.mode === "snap"
              ? 0
              : Math.round(Math.min(state.width, state.height) / 2),
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute left-0 top-0 flex items-center justify-center border ${accent} bg-white/[0.04]`}
      >
        <motion.span
          animate={{ opacity: state.label ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="whitespace-nowrap px-2 text-center font-sans text-[9px] uppercase tracking-[0.22em] text-white"
        >
          {state.label}
        </motion.span>
      </motion.div>

      {/* precise dot */}
      <motion.div
        style={{ x: pointerX, y: pointerY }}
        className="absolute left-0 top-0 -ml-[1.5px] -mt-[1.5px]"
      >
        <motion.div
          animate={{
            scale: state.mode === "default" ? 1 : 0,
            opacity: state.mode === "default" ? 1 : 0,
          }}
          transition={{ duration: 0.25 }}
          className="h-[3px] w-[3px] rounded-full bg-white"
        />
      </motion.div>
    </div>
  );
}
