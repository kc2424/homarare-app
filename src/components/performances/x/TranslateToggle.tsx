"use client";

import { useState } from "react";

interface TranslateToggleProps {
  translation: string;
  open?: boolean;
  defaultOpen?: boolean;
}

export function TranslateToggle({
  translation,
  open,
  defaultOpen = false,
}: TranslateToggleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  return (
    <div className="mt-2">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setInternalOpen(true)}
          className="text-body text-accent hover:underline"
        >
          翻訳を表示
        </button>
      ) : (
        <div className="pt-2 border-t border-border">
          <p className="text-meta text-text-secondary">Yが翻訳しました</p>
          <p className="mt-1 text-body text-text-primary">{translation}</p>
        </div>
      )}
    </div>
  );
}
