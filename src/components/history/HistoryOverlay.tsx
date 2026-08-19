"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { HistoryEntry } from "@/types/scenario";
import { clearHistory } from "@/lib/history/storage";
import { HistoryDetail } from "./HistoryDetail";
import { HistoryList } from "./HistoryList";

interface HistoryOverlayProps {
  onClose: () => void;
  onReplay: (entry: HistoryEntry) => void;
}

export function HistoryOverlay({ onClose, onReplay }: HistoryOverlayProps) {
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBack = () => {
    if (selectedEntry) {
      setSelectedEntry(null);
    } else {
      onClose();
    }
  };

  const handleClearAll = () => {
    if (
      !window.confirm("保存されたポストをすべて削除しますか？")
    ) {
      return;
    }
    clearHistory();
    setSelectedEntry(null);
    setRefreshKey((key) => key + 1);
  };

  // スクロールコンテナはこの1枚だけにする。内側に overflow-y-auto を作ると、
  // 投稿カードの sticky top-[53px] が「ヘッダーの下」ではなく
  // 「スクロール領域の上端から53px下」を基準にしてしまい、
  // ヘッダーとカードの間に53pxの隙間が空いてリプライがそこを流れる。
  // アプリ本体（StageContainer）と同じ構造にして sticky の基準を揃える。
  return (
    <div className="fixed inset-0 z-[60] bg-bg-primary overflow-y-auto overscroll-contain">
      <div className="mx-auto w-full max-w-column min-h-screen border-x border-border">
        <header className="sticky top-0 z-50 h-[53px] border-b border-border bg-bg-primary flex items-center justify-between px-4">
          <button
            type="button"
            onClick={handleBack}
            aria-label={selectedEntry ? "一覧に戻る" : "閉じる"}
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-hover transition-colors duration-150 shrink-0"
          >
            <ArrowLeft size={18} strokeWidth={1.75} />
          </button>
          <h2 className="text-body font-bold text-text-primary">
            {selectedEntry ? "ポスト" : "これまでのポスト"}
          </h2>
          {selectedEntry ? (
            <div className="w-[72px] shrink-0" aria-hidden />
          ) : (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-meta text-accent hover:underline shrink-0"
            >
              すべて削除
            </button>
          )}
        </header>

        <div>
          {selectedEntry ? (
            <HistoryDetail
              entry={selectedEntry}
              onReplay={() => onReplay(selectedEntry)}
            />
          ) : (
            <HistoryList
              key={refreshKey}
              onClose={onClose}
              onSelect={setSelectedEntry}
            />
          )}
        </div>
      </div>
    </div>
  );
}
