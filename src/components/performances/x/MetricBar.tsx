import { formatMetric, formatYells } from "@/lib/format";
import type { LiveMetrics } from "@/lib/hooks/metrics";

interface MetricBarProps {
  metrics: LiveMetrics;
}

export function MetricBar({ metrics }: MetricBarProps) {
  const yells = Math.floor(metrics.yells);
  const spreads = Math.floor(metrics.spreads);
  const replyCount = Math.floor(metrics.replyCount);

  return (
    <div className="grid grid-cols-3 gap-2 py-3">
      <div className="text-center">
        <div className="text-metric-hero font-bold text-like tabular-nums leading-[36px]">
          {formatYells(yells)}
        </div>
        <div className="text-meta text-text-secondary">エール</div>
      </div>
      <div className="text-center">
        <div className="text-metric-sub font-bold text-spread tabular-nums leading-6">
          {formatMetric(spreads)}
        </div>
        <div className="text-meta text-text-secondary">ひろめる</div>
      </div>
      <div className="text-center">
        <div className="text-metric-sub font-bold text-text-secondary tabular-nums leading-6">
          {formatMetric(replyCount)}
        </div>
        <div className="text-meta text-text-secondary">リプライ</div>
      </div>
    </div>
  );
}
