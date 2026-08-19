"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/hooks/metrics";

const MAX_HEARTS = 12;
const SPAWN_MIN_MS = 150;
const SPAWN_MAX_MS = 250;
const FLIGHT_DURATION_S = 1.2;

interface HeartBurstProps {
  active: boolean;
}

interface HeartParticle {
  id: number;
  size: number;
}

interface HeartParticleViewProps {
  size: number;
  onComplete: () => void;
}

function HeartParticleView({ size, onComplete }: HeartParticleViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const sizeRef = useRef(size);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const particleSize = sizeRef.current;
    const startX = Math.random() * Math.max(window.innerWidth - particleSize, 1);
    const drift = (Math.random() - 0.5) * 100;
    const travelDistance =
      window.innerHeight * (0.45 + Math.random() * 0.35) + particleSize;

    gsap.set(element, {
      left: startX,
      top: window.innerHeight,
      x: 0,
      y: 0,
      opacity: 0.9 + Math.random() * 0.1,
      scale: 0.55 + Math.random() * 0.45,
    });

    const tl = gsap.timeline({
      onComplete: () => onCompleteRef.current(),
    });

    tl.to(element, {
      y: -travelDistance,
      duration: FLIGHT_DURATION_S,
      ease: "power1.out",
    });

    tl.to(
      element,
      {
        x: drift,
        duration: FLIGHT_DURATION_S * 0.35,
        repeat: 2,
        yoyo: true,
        ease: "sine.inOut",
      },
      0
    );

    tl.to(
      element,
      {
        opacity: 0,
        duration: FLIGHT_DURATION_S * 0.45,
        ease: "power1.out",
      },
      FLIGHT_DURATION_S * 0.55
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className="absolute will-change-transform" aria-hidden>
      <Heart
        size={size}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0}
        style={{ color: "var(--like)" }}
      />
    </div>
  );
}

export function HeartBurst({ active }: HeartBurstProps) {
  const [particles, setParticles] = useState<HeartParticle[]>([]);
  const idRef = useRef(0);
  const activeCountRef = useRef(0);
  const spawnTimeoutRef = useRef<number | undefined>(undefined);

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((particle) => particle.id !== id));
    activeCountRef.current = Math.max(0, activeCountRef.current - 1);
  }, []);

  const spawnParticle = useCallback(() => {
    if (activeCountRef.current >= MAX_HEARTS) return;

    const id = idRef.current;
    idRef.current += 1;
    const size = 16 + Math.random() * 14;
    activeCountRef.current += 1;
    setParticles((prev) => [...prev, { id, size }]);
  }, []);

  useEffect(() => {
    if (!active || prefersReducedMotion()) {
      if (spawnTimeoutRef.current !== undefined) {
        window.clearTimeout(spawnTimeoutRef.current);
        spawnTimeoutRef.current = undefined;
      }
      return;
    }

    const scheduleSpawn = () => {
      const delay =
        SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
      spawnTimeoutRef.current = window.setTimeout(() => {
        spawnParticle();
        scheduleSpawn();
      }, delay);
    };

    spawnParticle();
    scheduleSpawn();

    return () => {
      if (spawnTimeoutRef.current !== undefined) {
        window.clearTimeout(spawnTimeoutRef.current);
        spawnTimeoutRef.current = undefined;
      }
    };
  }, [active, spawnParticle]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[45] overflow-hidden"
      aria-hidden
    >
      {particles.map((particle) => (
        <HeartParticleView
          key={particle.id}
          size={particle.size}
          onComplete={() => removeParticle(particle.id)}
        />
      ))}
    </div>
  );
}
