"use client";

import { Globe } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

const MAX_LENGTH = 280;
const RING_SIZE = 20;
const RING_RADIUS = 8;
const RING_STROKE = 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface DeedComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

function CharCountRing({ length }: { length: number }) {
  if (length === 0) {
    return <div className="w-5 h-5 shrink-0" aria-hidden />;
  }

  const remaining = MAX_LENGTH - length;
  const progress = Math.min(length / MAX_LENGTH, 1);
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  let ringColor = "var(--accent)";
  let showNumber = false;

  if (remaining <= 0) {
    ringColor = "var(--like)";
    showNumber = true;
  } else if (remaining <= 20) {
    ringColor = "var(--warning)";
    showNumber = true;
  }

  return (
    <div
      className="relative flex items-center justify-center w-5 h-5 shrink-0"
      aria-label={`残り${remaining}文字`}
    >
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={RING_STROKE}
        />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={ringColor}
          strokeWidth={RING_STROKE}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 150ms ease-out, stroke 150ms ease-out",
          }}
        />
      </svg>
      {showNumber && (
        <span
          className="absolute text-[10px] font-bold leading-none tabular-nums"
          style={{ color: ringColor }}
        >
          {remaining}
        </span>
      )}
    </div>
  );
}

export function DeedComposer({
  value,
  onChange,
  onSubmit,
}: DeedComposerProps) {
  const trimmedLength = value.trim().length;
  const canSubmit = trimmedLength > 0 && value.length <= MAX_LENGTH;

  const handleSubmit = () => {
    // 押した瞬間の短い触覚フィードバック（Androidのみ有効）
    navigator.vibrate?.(10);
    onSubmit();
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-53px)] lg:min-h-screen">
      <div className="flex justify-end px-4 py-2 shrink-0">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="h-9 px-4 rounded-full bg-accent text-text-on-accent text-body font-bold transition-colors duration-150 enabled:hover:bg-accent-hover disabled:bg-accent-disabled disabled:text-text-on-accent disabled:pointer-events-none"
        >
          ポストする
        </button>
      </div>

      {/* 入力欄は余白いっぱいまで広げる。行数を固定すると長文で内部スクロールになり、
          空白部分をタップしてもフォーカスが当たらない（本家は伸びる）。
          高さは h-full（height:100%）ではなく flex の stretch で出すこと。
          パーセント指定は親の高さを解決できず、textarea 既定の2行に落ちる。 */}
      <div className="flex flex-1 flex-col gap-2 px-4 pt-3 min-h-0">
        <div className="flex flex-1 gap-3 min-h-0">
          <Avatar name="あなた" personaId="user" size={40} />
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="今日やったことを書いてみよう"
            className="flex-1 min-w-0 self-stretch resize-none border-none outline-none bg-transparent text-compose text-text-primary placeholder:text-text-secondary"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-border bg-bg-primary shrink-0">
        <p className="flex items-center gap-1.5 text-meta text-accent">
          <Globe size={16} strokeWidth={1.75} aria-hidden />
          全員が褒めてくれます
        </p>
        <CharCountRing length={value.length} />
      </div>
    </div>
  );
}
