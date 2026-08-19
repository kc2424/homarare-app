import { formatMetric } from "@/lib/format";
import { formatPostTimestamp } from "@/lib/datetime";

interface TimestampLineProps {
  impressions: number;
  postedAt?: Date;
}

export function TimestampLine({ impressions, postedAt }: TimestampLineProps) {
  const formattedImpressions = formatMetric(Math.floor(impressions));

  return (
    <p className="text-body text-text-secondary">
      {formatPostTimestamp(postedAt)}
      {" · "}
      <span className="font-bold text-text-primary tabular-nums">
        {formattedImpressions}
      </span>
      {" 件の表示"}
    </p>
  );
}
