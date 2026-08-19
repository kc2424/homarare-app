"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HistoryEntry, ReactionScenario, StageState } from "@/types/scenario";
import {
  clearLastEntryPointer,
  loadHistory,
  loadLastEntryPointer,
  saveEntry,
  saveLastEntryPointer,
} from "@/lib/history/storage";
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

const RESTORE_WINDOW_MS = 30 * 60 * 1000;

export function StageContainer() {
  const [state, setState] = useState<StageState>("idle");
  const [deed, setDeed] = useState("");
  const [scenario, setScenario] = useState<ReactionScenario | null>(null);
  const [postedAt, setPostedAt] = useState<Date | null>(null);
  const [isComposerVisible, setIsComposerVisible] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showFirstTimeHint, setShowFirstTimeHint] = useState(false);
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
    clearLastEntryPointer();
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
    setShowFirstTimeHint(loadHistory().length === 0);
  }, []);

  useEffect(() => {
    const pointer = loadLastEntryPointer();
    if (!pointer) return;

    const elapsed = Date.now() - new Date(pointer.savedAt).getTime();
    if (elapsed > RESTORE_WINDOW_MS) {
      clearLastEntryPointer();
      return;
    }

    const entry = loadHistory().find((item) => item.id === pointer.entryId);
    if (!entry) {
      clearLastEntryPointer();
      return;
    }

    setScenario(entry.scenario);
    setPostedAt(new Date(entry.postedAt));
    setDeed(entry.scenario.deed);
    setIsComposerVisible(false);
    hasSavedHistoryRef.current = true;
    setState("settled");
  }, []);

  useEffect(() => {
    if (state !== "posting" || !scenario) return;

    const frame = requestAnimationFrame(() => {
      animatePostCardEntrance(postCardRef.current, () => setState("reacting"));
    });

    return () => cancelAnimationFrame(frame);
  }, [state, scenario, postCardRef]);

  useEffect(() => {
    if (state !== "posting" || !scenario || !postedAt || hasSavedHistoryRef.current) {
      return;
    }

    hasSavedHistoryRef.current = true;
    const entryId = saveEntry(scenario, postedAt);
    if (entryId) {
      saveLastEntryPointer(entryId);
    }
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
            showFirstTimeHint={showFirstTimeHint}
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

        {state === "settled" && scenario && (
          <ResultActions
            deed={scenario.deed}
            yells={scenario.targets.yells}
            onRetry={handleRetry}
          />
        )}
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
