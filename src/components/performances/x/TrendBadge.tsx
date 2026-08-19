"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/hooks/metrics";

interface TrendBadgeProps {
  label: string;
  visible: boolean;
}

export function TrendBadge({ label, visible }: TrendBadgeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !visible) return;

    if (prefersReducedMotion()) {
      gsap.set(element, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      element,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="mx-4 my-3 px-4 py-2 rounded-full border border-border bg-bg-hover text-body text-text-primary text-center font-bold"
    >
      {label}
    </div>
  );
}
