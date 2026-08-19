export interface LiveMetrics {
  yells: number;
  spreads: number;
  replyCount: number;
  impressions: number;
}

export const ZERO_METRICS: LiveMetrics = {
  yells: 0,
  spreads: 0,
  replyCount: 0,
  impressions: 0,
};

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
