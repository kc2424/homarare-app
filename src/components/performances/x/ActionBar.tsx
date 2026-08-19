import {
  BarChart3,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from "lucide-react";
import { formatMetric, formatYells } from "@/lib/format";

interface ActionCounts {
  reply?: number;
  repost?: number;
  like?: number;
  impression?: number;
  bookmark?: number;
}

interface ActionBarProps {
  variant: "post" | "reply";
  counts?: ActionCounts;
}

const HOVER = {
  reply: "hover:bg-accent-subtle hover:text-accent",
  repost: "hover:bg-spread-subtle hover:text-spread",
  like: "hover:bg-like-subtle hover:text-like",
  impression: "hover:bg-accent-subtle hover:text-accent",
  neutral: "hover:bg-accent-subtle hover:text-accent",
} as const;

type CountStyle = "default" | "yell";

function formatCount(value: number, style: CountStyle): string {
  return style === "yell" ? formatYells(Math.floor(value)) : formatMetric(Math.floor(value));
}

function ActionButton({
  icon: Icon,
  label,
  count,
  hoverClass,
  countStyle = "default",
}: {
  icon: typeof MessageCircle;
  label: string;
  count?: number;
  hoverClass: string;
  countStyle?: CountStyle;
}) {
  const showCount = count !== undefined && count > 0;
  const countClassName =
    countStyle === "yell"
      ? "min-w-[1ch] pr-1 text-meta font-bold text-like tabular-nums"
      : "min-w-[1ch] pr-1 text-meta text-text-secondary tabular-nums";

  return (
    <button
      type="button"
      aria-label={label}
      className="flex items-center gap-0.5 text-text-secondary"
    >
      <span
        className={`w-[34px] h-[34px] rounded-full flex items-center justify-center transition-colors duration-150 ${hoverClass}`}
      >
        <Icon size={18} strokeWidth={1.75} />
      </span>
      {showCount && (
        <span className={countClassName}>{formatCount(count, countStyle)}</span>
      )}
    </button>
  );
}

function IconOnlyButton({
  icon: Icon,
  label,
  hoverClass,
}: {
  icon: typeof Share;
  label: string;
  hoverClass: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-text-secondary transition-colors duration-150 ${hoverClass}`}
    >
      <Icon size={18} strokeWidth={1.75} />
    </button>
  );
}

export function ActionBar({ variant, counts }: ActionBarProps) {
  if (variant === "reply") {
    return (
      <div className="mt-3 flex w-full items-center justify-between">
        <ActionButton
          icon={MessageCircle}
          label="リプライ"
          count={counts?.reply}
          hoverClass={HOVER.reply}
        />
        <ActionButton
          icon={Repeat2}
          label="ひろめる"
          count={counts?.repost}
          hoverClass={HOVER.repost}
        />
        <ActionButton
          icon={Heart}
          label="エール"
          count={counts?.like}
          hoverClass={HOVER.like}
        />
        <ActionButton
          icon={BarChart3}
          label="表示回数"
          count={counts?.impression}
          hoverClass={HOVER.impression}
        />
        <IconOnlyButton icon={Bookmark} label="保存" hoverClass={HOVER.neutral} />
        <IconOnlyButton icon={Share} label="共有" hoverClass={HOVER.neutral} />
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between">
      <ActionButton
        icon={MessageCircle}
        label="リプライ"
        count={counts?.reply}
        hoverClass={HOVER.reply}
      />
      <ActionButton
        icon={Repeat2}
        label="ひろめる"
        count={counts?.repost}
        hoverClass={HOVER.repost}
      />
      <ActionButton
        icon={Heart}
        label="エール"
        count={counts?.like}
        hoverClass={HOVER.like}
        countStyle="yell"
      />
      <ActionButton
        icon={Bookmark}
        label="保存"
        count={counts?.bookmark}
        hoverClass={HOVER.neutral}
      />
      <IconOnlyButton icon={Share} label="共有" hoverClass={HOVER.neutral} />
    </div>
  );
}
