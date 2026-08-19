"use client";

interface ResultActionsProps {
  onRetry: () => void;
}

export function ResultActions({ onRetry }: ResultActionsProps) {
  return (
    <div className="px-4 py-6 border-t border-border bg-bg-primary">
      <p className="text-body text-text-secondary text-center mb-4">
        画面をスクショして保存できます
      </p>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="h-9 px-4 rounded-full bg-accent text-text-on-accent text-body font-bold hover:bg-accent-hover transition-colors duration-150"
        >
          保存する
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="h-9 px-4 rounded-full border border-border-strong text-body font-bold text-text-primary hover:bg-bg-hover transition-colors duration-150"
        >
          もう一度
        </button>
      </div>
      <p className="mt-6 text-meta text-text-secondary text-center">ほめられ</p>
    </div>
  );
}
