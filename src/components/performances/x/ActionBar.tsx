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
  compact = false,
  widthClass = "",
}: {
  icon: typeof MessageCircle;
  label: string;
  count?: number;
  hoverClass: string;
  countStyle?: CountStyle;
  /** リプライ行は要素が多く、34pxのままだと数値が折り返す（03 4-2章） */
  compact?: boolean;
  /** 列幅を固定して、行をまたいでアイコンのx座標を揃えるためのクラス */
  widthClass?: string;
}) {
  const showCount = count !== undefined && count > 0;
  const countClassName =
    countStyle === "yell"
      ? "min-w-[1ch] text-meta font-bold text-like tabular-nums whitespace-nowrap"
      : "min-w-[1ch] text-meta text-text-secondary tabular-nums whitespace-nowrap";
  const boxClassName = compact ? "w-7 h-7" : "w-[34px] h-[34px]";

  return (
    <button
      type="button"
      aria-label={label}
      className={`flex items-center gap-0.5 text-text-secondary shrink-0 ${widthClass}`}
    >
      <span
        className={`${boxClassName} rounded-full flex items-center justify-center transition-colors duration-150 ${hoverClass}`}
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
  compact = false,
}: {
  icon: typeof Share;
  label: string;
  hoverClass: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`${compact ? "w-7 h-7" : "w-[34px] h-[34px]"} shrink-0 rounded-full flex items-center justify-center text-text-secondary transition-colors duration-150 ${hoverClass}`}
    >
      <Icon size={18} strokeWidth={1.75} />
    </button>
  );
}

export function ActionBar({ variant, counts }: ActionBarProps) {
  if (variant === "reply") {
    return (
      /* 列幅を固定する。justify-between だと各行の数値の桁数で配置が変わり、
         行をまたいだときにアイコンの縦の列が揃わない（03_デザイントークン.md 4-2章）。
         幅は各指標の最大桁から決めている（返信2桁 / ひろめる3桁 / エール4桁）。 */
      <div className="mt-3 flex w-full items-center">
        <ActionButton
          icon={MessageCircle}
          label="リプライ"
          count={counts?.reply}
          hoverClass={HOVER.reply}
          compact
          widthClass="w-12"
        />
        <ActionButton
          icon={Repeat2}
          label="ひろめる"
          count={counts?.repost}
          hoverClass={HOVER.repost}
          compact
          widthClass="w-14"
        />
        <ActionButton
          icon={Heart}
          label="エール"
          count={counts?.like}
          hoverClass={HOVER.like}
          compact
          widthClass="w-[68px]"
        />
        <ActionButton
          icon={BarChart3}
          label="表示回数"
          count={counts?.impression}
          hoverClass={HOVER.impression}
          compact
          widthClass="flex-1"
        />
        {/* リプライ行に保存アイコンは置かない。本文カラムがアバター分だけ狭く、
            6要素だと 360px 級の端末で数値がはみ出す（03_デザイントークン.md 4-2章）。
            保存は数値を持たない装飾要素なので、削っても情報は失われない。 */}
        <IconOnlyButton icon={Share} label="共有" hoverClass={HOVER.neutral} compact />
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
