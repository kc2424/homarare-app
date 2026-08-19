import type { MetricTargets } from "@/types/scenario";

export interface LiveMetrics {
  yells: number;
  spreads: number;
  replyCount: number;
  impressions: number;
  bookmarks: number;
}

export const ZERO_METRICS: LiveMetrics = {
  yells: 0,
  spreads: 0,
  replyCount: 0,
  impressions: 0,
  bookmarks: 0,
};

export function targetsToLiveMetrics(targets: MetricTargets): LiveMetrics {
  return {
    yells: targets.yells,
    spreads: targets.spreads,
    replyCount: targets.replyCount,
    impressions: targets.impressions,
    bookmarks: targets.bookmarks,
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
