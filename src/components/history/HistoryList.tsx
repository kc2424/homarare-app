"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import type { HistoryEntry } from "@/types/scenario";
import { formatHistoryTimestamp } from "@/lib/datetime";
import { formatMetric, formatYells } from "@/lib/format";
import { loadHistory, removeEntry } from "@/lib/history/storage";

interface HistoryListProps {
  onClose: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

export function HistoryList({ onClose, onSelect }: HistoryListProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const reload = useCallback(() => {
    setEntries(loadHistory());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleDelete = (id: string) => {
    removeEntry(id);
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  if (entries.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <p className="text-body text-text-secondary">まだポストがありません</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 h-9 px-4 rounded-full border border-border-strong text-body font-bold text-text-primary hover:bg-bg-hover transition-colors duration-150"
          >
            閉じる
          </button>
        </div>
        <PrivacyNote />
      </>
    );
  }

  return (
    <>
      <ul className="divide-y divide-border">
        {entries.map((entry) => (
          <li key={entry.id} className="px-4 py-3">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => onSelect(entry)}
                className="min-w-0 flex-1 text-left hover:bg-bg-hover -mx-2 px-2 py-1 rounded-lg transition-colors duration-150"
              >
                <p className="text-meta text-text-secondary">
                  {formatHistoryTimestamp(entry.postedAt)}
                </p>
                <p className="mt-1 text-body text-text-primary line-clamp-2 break-words">
                  {entry.scenario.deed}
                </p>
                <div className="mt-2 flex items-center gap-4 text-meta tabular-nums">
                  <span className="flex items-center gap-1 font-bold text-like">
                    <Heart size={14} strokeWidth={0} fill="currentColor" />
                    {formatYells(entry.scenario.targets.yells)}
                  </span>
                  <span className="flex items-center gap-1 text-text-secondary">
                    <MessageCircle size={14} strokeWidth={1.75} />
                    {formatMetric(entry.scenario.targets.replyCount)}
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleDelete(entry.id);
                }}
                aria-label="このポストを削除"
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-hover transition-colors duration-150 shrink-0"
              >
                <Trash2 size={18} strokeWidth={1.75} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <PrivacyNote />
    </>
  );
}

function PrivacyNote() {
  return (
    <p className="px-4 py-6 text-meta text-text-secondary text-center">
      保存されたポストはこの端末の中だけに残ります。サーバーには送信されません。
    </p>
  );
}
