"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactionScenario, StageState } from "@/types/scenario";
import { buildScenario } from "@/lib/scenario/buildScenario";
import { ZERO_METRICS } from "@/lib/hooks/metrics";
import {
  animatePostCardEntrance,
  useReactionTimeline,
} from "@/lib/hooks/useReactionTimeline";
import { useZombieAutoTranslate } from "@/lib/hooks/useZombieAutoTranslate";
import { XPerformance } from "@/components/performances/x/XPerformance";
import { Header } from "./Header";
import { DeedComposer } from "./DeedComposer";
import { ResultActions } from "./ResultActions";

export function StageContainer() {
  const [state, setState] = useState<StageState>("idle");
  const [deed, setDeed] = useState("");
  const [scenario, setScenario] = useState<ReactionScenario | null>(null);
  const [postedAt, setPostedAt] = useState<Date | null>(null);
  const [isComposerVisible, setIsComposerVisible] = useState(true);
  const performanceRef = useRef<HTMLDivElement>(null);

  const handleReactingComplete = useCallback(() => {
    setState("settled");
  }, []);

  const { metrics, visibleReplyIds, showTrendBadge, postCardRef } =
    useReactionTimeline({
      scenario,
      active: state === "reacting",
      onComplete: handleReactingComplete,
    });

  const autoOpenZombieIds = useZombieAutoTranslate(
    scenario?.items ?? [],
    state === "settled"
  );

  const handleDeedChange = (value: string) => {
    setDeed(value);
    if (value.length > 0 && state === "idle") {
      setState("composing");
    }
    if (value.length === 0 && state === "composing") {
      setState("idle");
    }
  };

  const handleSubmit = () => {
    const trimmed = deed.trim();
    if (!trimmed) return;

    const nextScenario = buildScenario(trimmed);
    setScenario(nextScenario);
    setPostedAt(new Date());
    setState("posting");
    setIsComposerVisible(false);
  };

  const handleRetry = () => {
    setDeed("");
    setScenario(null);
    setPostedAt(null);
    setIsComposerVisible(true);
    setState("idle");
  };

  useEffect(() => {
    if (state !== "posting" || !scenario) return;

    const frame = requestAnimationFrame(() => {
      animatePostCardEntrance(postCardRef.current, () => setState("reacting"));
    });

    return () => cancelAnimationFrame(frame);
  }, [state, scenario, postCardRef]);

  const showComposer =
    isComposerVisible && (state === "idle" || state === "composing");
  const showPerformance =
    scenario &&
    (state === "posting" || state === "reacting" || state === "settled");

  const performanceMetrics =
    state === "posting"
      ? ZERO_METRICS
      : state === "settled" && scenario
        ? {
            yells: scenario.targets.yells,
            spreads: scenario.targets.spreads,
            replyCount: scenario.targets.replyCount,
            impressions: scenario.targets.impressions,
          }
        : metrics;

  const performanceVisibleReplyIds =
    state === "posting"
      ? []
      : state === "settled" && scenario
        ? scenario.items.map((item) => item.id)
        : visibleReplyIds;

  const performanceShowTrendBadge =
    state === "posting" ? false : state === "settled" ? true : showTrendBadge;

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto w-full max-w-column min-h-screen border-x border-border">
        <Header />

        {showComposer && (
          <DeedComposer
            value={deed}
            onChange={handleDeedChange}
            onSubmit={handleSubmit}
          />
        )}

        {showPerformance && scenario && (
          <div ref={performanceRef}>
            <XPerformance
              scenario={scenario}
              metrics={performanceMetrics}
              visibleReplyIds={performanceVisibleReplyIds}
              showTrendBadge={performanceShowTrendBadge}
              autoOpenZombieIds={autoOpenZombieIds}
              postCardRef={postCardRef}
              postedAt={postedAt ?? undefined}
            />
          </div>
        )}

        {state === "settled" && <ResultActions onRetry={handleRetry} />}
      </div>
    </div>
  );
}
