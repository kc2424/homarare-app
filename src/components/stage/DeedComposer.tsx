"use client";

const MAX_LENGTH = 280;

interface DeedComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function DeedComposer({ value, onChange, onSubmit }: DeedComposerProps) {
  const canSubmit = value.trim().length > 0;

  return (
    <div className="flex flex-col min-h-[calc(100vh-53px)] px-4">
      <div className="flex-1 flex flex-col justify-center py-8">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="今日やったことを書いてみよう"
          maxLength={MAX_LENGTH}
          rows={4}
          className="w-full resize-none border-none outline-none bg-transparent text-compose text-text-primary placeholder:text-text-secondary"
        />
      </div>

      <div className="sticky bottom-0 pb-6 pt-3 border-t border-border bg-bg-primary flex items-center justify-between gap-4">
        {value.length > 0 && (
          <span className="text-meta text-text-secondary tabular-nums">
            {value.length}/{MAX_LENGTH}
          </span>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="h-9 px-4 rounded-full bg-accent text-text-on-accent text-body font-bold transition-colors duration-150 enabled:hover:bg-accent-hover disabled:opacity-50 disabled:pointer-events-none"
        >
          投稿する
        </button>
      </div>
    </div>
  );
}
