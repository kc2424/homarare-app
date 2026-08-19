"use client";

import type { ReactionScenario } from "@/types/scenario";
import type { LiveMetrics } from "@/lib/hooks/metrics";
import { PostCard } from "./PostCard";
import { ReplyList } from "./ReplyList";
import { TrendBadge } from "./TrendBadge";

interface XPerformanceProps {
  scenario: ReactionScenario;
  metrics: LiveMetrics;
  visibleReplyIds: string[];
  showTrendBadge: boolean;
  autoOpenZombieIds?: string[];
  postCardRef: React.RefObject<HTMLElement | null>;
  postedAt?: Date;
}

export function XPerformance({
  scenario,
  metrics,
  visibleReplyIds,
  showTrendBadge,
  autoOpenZombieIds = [],
  postCardRef,
  postedAt,
}: XPerformanceProps) {
  return (
    <div>
      <PostCard
        ref={postCardRef}
        deed={scenario.deed}
        metrics={metrics}
        postedAt={postedAt}
      />
      <ReplyList
        items={scenario.items}
        visibleIds={visibleReplyIds}
        autoOpenZombieIds={autoOpenZombieIds}
      />
      <TrendBadge label={scenario.trendLabel} visible={showTrendBadge} />
    </div>
  );
}
