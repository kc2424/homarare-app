"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { ReactionScenario } from "@/types/scenario";
import {
  prefersReducedMotion,
  ZERO_METRICS,
  type LiveMetrics,
} from "./metrics";

interface UseReactionTimelineOptions {
  scenario: ReactionScenario | null;
  active: boolean;
  onComplete: () => void;
}

export function useReactionTimeline({
  scenario,
  active,
  onComplete,
}: UseReactionTimelineOptions) {
  const [metrics, setMetrics] = useState<LiveMetrics>(ZERO_METRICS);
  const [visibleReplyIds, setVisibleReplyIds] = useState<string[]>([]);
  const [showTrendBadge, setShowTrendBadge] = useState(false);
  const postCardRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const onCompleteRef = useRef(onComplete);

  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active || !scenario) return;

    const targets = scenario.targets;
    const reducedMotion = prefersReducedMotion();

    setMetrics(ZERO_METRICS);
    setVisibleReplyIds([]);
    setShowTrendBadge(false);

    if (reducedMotion) {
      setMetrics(targets);
      setVisibleReplyIds(scenario.items.map((item) => item.id));
      setShowTrendBadge(true);
      onCompleteRef.current();
      return;
    }

    const counters: LiveMetrics = { ...ZERO_METRICS };
    const syncMetrics = () => setMetrics({ ...counters });

    const tl = gsap.timeline({
      onComplete: () => onCompleteRef.current(),
    });
    timelineRef.current = tl;

    const phaseBYells = Math.max(30, Math.floor(targets.yells * 0.04));
    const phaseBImpressions = Math.floor(targets.impressions * 0.05);

    // Phase A (0–1.2s): 静寂。カードは posting 側で出現済み
    if (postCardRef.current) {
      gsap.set(postCardRef.current, { scale: 1.02 });
      tl.to(
        postCardRef.current,
        { scale: 1, duration: 1.2, ease: "power2.out" },
        0
      );
    }

    // Phase B (1.2–3.5s): さざなみ。表示回数はエールよりわずかに先行
    tl.to(
      counters,
      {
        impressions: phaseBImpressions,
        duration: 2.2,
        ease: "power1.out",
        onUpdate: syncMetrics,
      },
      1.1
    );
    tl.to(
      counters,
      {
        yells: phaseBYells,
        duration: 2.3,
        ease: "power1.out",
        onUpdate: syncMetrics,
      },
      1.2
    );

    // Phase C (3.5–8.0s): 爆発。90% まで加速
    let vibrateInterval: number | undefined;
    tl.call(() => {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(30);
        vibrateInterval = window.setInterval(() => navigator.vibrate(30), 120);
      }
    }, [], 3.5);

    tl.to(
      counters,
      {
        impressions: Math.floor(targets.impressions * 0.92),
        duration: 4.5,
        ease: "power3.in",
        onUpdate: syncMetrics,
      },
      3.4
    );
    tl.to(
      counters,
      {
        yells: Math.floor(targets.yells * 0.9),
        spreads: Math.floor(targets.spreads * 0.9),
        replyCount: Math.floor(targets.replyCount * 0.9),
        duration: 4.5,
        ease: "power3.in",
        onUpdate: syncMetrics,
      },
      3.5
    );
    tl.call(() => {
      if (vibrateInterval !== undefined) {
        window.clearInterval(vibrateInterval);
      }
    }, [], 8);

    // Phase D (8.0–12.0s): 余韻。残り 10% をゆっくり詰める
    tl.to(
      counters,
      {
        impressions: targets.impressions,
        yells: targets.yells,
        spreads: targets.spreads,
        replyCount: targets.replyCount,
        duration: 4,
        ease: "power3.out",
        onUpdate: syncMetrics,
      },
      8
    );

    // リプライを appearAt に従って出現
    for (const item of scenario.items) {
      tl.call(
        () => {
          setVisibleReplyIds((prev) =>
            prev.includes(item.id) ? prev : [...prev, item.id]
          );
        },
        [],
        item.appearAt / 1000
      );
    }

    // トレンドバッジ（Phase D 終盤）
    tl.call(() => setShowTrendBadge(true), [], 11.2);

    return () => {
      if (vibrateInterval !== undefined) {
        window.clearInterval(vibrateInterval);
      }
      tl.kill();
      timelineRef.current = null;
    };
  }, [active, scenario]);

  return {
    metrics,
    visibleReplyIds,
    showTrendBadge,
    postCardRef,
  };
}

export function animatePostCardEntrance(
  element: HTMLElement | null,
  onComplete: () => void
) {
  if (!element) {
    onComplete();
    return () => undefined;
  }

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0, scale: 1 });
    onComplete();
    return () => undefined;
  }

  gsap.set(element, { opacity: 0, y: 48, scale: 1.02 });
  const tween = gsap.to(element, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
    onComplete,
  });

  return () => {
    tween.kill();
  };
}
