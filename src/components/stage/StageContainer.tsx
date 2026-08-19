"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HistoryEntry, ReactionScenario, StageState } from "@/types/scenario";
import { saveEntry } from "@/lib/history/storage";
import { buildScenario } from "@/lib/scenario/buildScenario";
import { ZERO_METRICS, targetsToLiveMetrics } from "@/lib/hooks/metrics";
import {
  animatePostCardEntrance,
  useReactionTimeline,
} from "@/lib/hooks/useReactionTimeline";
import { useZombieAutoTranslate } from "@/lib/hooks/useZombieAutoTranslate";
import { HistoryOverlay } from "@/components/history/HistoryOverlay";
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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const performanceRef = useRef<HTMLDivElement>(null);
  const hasSavedHistoryRef = useRef(false);

  const handleReactingComplete = useCallback(() => {
    setState("settled");
  }, []);

  const { metrics, visibleReplyIds, showTrendBadge, heartsActive, postCardRef } =
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
    hasSavedHistoryRef.current = false;
    setState("posting");
    setIsComposerVisible(false);
  };

  const handleRetry = () => {
    setDeed("");
    setScenario(null);
    setPostedAt(null);
    hasSavedHistoryRef.current = false;
    setIsComposerVisible(true);
    setState("idle");
  };

  const handleReplay = useCallback((entry: HistoryEntry) => {
    setIsHistoryOpen(false);
    setScenario(entry.scenario);
    setPostedAt(new Date(entry.postedAt));
    setDeed(entry.scenario.deed);
    setIsComposerVisible(false);
    hasSavedHistoryRef.current = true;
    setState("posting");
  }, []);

  useEffect(() => {
    if (state !== "posting" || !scenario) return;

    const frame = requestAnimationFrame(() => {
      animatePostCardEntrance(postCardRef.current, () => setState("reacting"));
    });

    return () => cancelAnimationFrame(frame);
  }, [state, scenario, postCardRef]);

  useEffect(() => {
    if (state !== "settled" || !scenario || !postedAt || hasSavedHistoryRef.current) {
      return;
    }

    hasSavedHistoryRef.current = true;
    saveEntry(scenario, postedAt);
  }, [state, scenario, postedAt]);

  const showComposer =
    isComposerVisible && (state === "idle" || state === "composing");
  const showPerformance =
    scenario &&
    (state === "posting" || state === "reacting" || state === "settled");

  const performanceMetrics =
    state === "posting"
      ? ZERO_METRICS
      : state === "settled" && scenario
        ? targetsToLiveMetrics(scenario.targets)
        : metrics;

  const performanceVisibleReplyIds =
    state === "posting"
      ? []
      : state === "settled" && scenario
        ? scenario.items.map((item) => item.id)
        : visibleReplyIds;

  const performanceShowTrendBadge =
    state === "posting" ? false : state === "settled" ? true : showTrendBadge;

  const performanceHeartsActive = state === "reacting" ? heartsActive : false;

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto w-full max-w-column min-h-screen border-x border-border">
        <Header onHistoryClick={() => setIsHistoryOpen(true)} />

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
              heartsActive={performanceHeartsActive}
              autoOpenZombieIds={autoOpenZombieIds}
              postCardRef={postCardRef}
              postedAt={postedAt ?? undefined}
            />
          </div>
        )}

        {state === "settled" && <ResultActions onRetry={handleRetry} />}
      </div>

      {isHistoryOpen && (
        <HistoryOverlay
          onClose={() => setIsHistoryOpen(false)}
          onReplay={handleReplay}
        />
      )}
    </div>
  );
}
