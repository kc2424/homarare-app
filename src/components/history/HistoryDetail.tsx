"use client";

import { useRef } from "react";
import type { HistoryEntry } from "@/types/scenario";
import { targetsToLiveMetrics } from "@/lib/hooks/metrics";
import { XPerformance } from "@/components/performances/x/XPerformance";

interface HistoryDetailProps {
  entry: HistoryEntry;
  onReplay: () => void;
}

export function HistoryDetail({ entry, onReplay }: HistoryDetailProps) {
  const postCardRef = useRef<HTMLElement>(null);

  const autoOpenZombieIds = entry.scenario.items
    .filter((item) => item.lang === "ar")
    .map((item) => item.id);

  return (
    <>
      <XPerformance
        scenario={entry.scenario}
        metrics={targetsToLiveMetrics(entry.scenario.targets)}
        visibleReplyIds={entry.scenario.items.map((item) => item.id)}
        showTrendBadge={true}
        heartsActive={false}
        autoOpenZombieIds={autoOpenZombieIds}
        postCardRef={postCardRef}
        postedAt={new Date(entry.postedAt)}
      />
      <div className="px-4 py-6 border-t border-border bg-bg-primary">
        <button
          type="button"
          onClick={onReplay}
          className="w-full h-9 px-4 rounded-full bg-accent text-text-on-accent text-body font-bold hover:bg-accent-hover transition-colors duration-150"
        >
          もう一度再生
        </button>
      </div>
    </>
  );
}
