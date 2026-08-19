"use client";

import { useEffect, useState } from "react";

const SHARE_URL = "https://homarare-app.vercel.app";
/** 共有文に載せる投稿文の最大長。280文字の全文を載せると共有シートが読めなくなる */
const SHARE_DEED_MAX = 24;

interface ResultActionsProps {
  deed: string;
  yells: number;
  onRetry: () => void;
}

type ShareMode = "none" | "native" | "clipboard";

export function ResultActions({ deed, yells, onRetry }: ResultActionsProps) {
  const [shareMode, setShareMode] = useState<ShareMode>("none");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof navigator.share === "function") {
      setShareMode("native");
      return;
    }
    if (typeof navigator.clipboard?.writeText === "function") {
      setShareMode("clipboard");
    }
  }, []);

  const handleShare = () => {
    const compactDeed =
      deed.length > SHARE_DEED_MAX ? `${deed.slice(0, SHARE_DEED_MAX)}…` : deed;
    const shareText = `「${compactDeed}」で ${yells.toLocaleString()} エールもらいました`;

    if (shareMode === "native") {
      navigator
        .share({
          title: "ほめられ",
          text: shareText,
          url: SHARE_URL,
        })
        .catch(() => {
          // AbortError（キャンセル）含めすべて握りつぶす
        });
      return;
    }

    if (shareMode === "clipboard") {
      navigator.clipboard
        .writeText(`${shareText}\n${SHARE_URL}`)
        .then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  };

  return (
    <div className="px-4 py-6 border-t border-border bg-bg-primary">
      <p className="text-body text-text-secondary text-center mb-4">
        画面をスクショして保存できます
      </p>
      <div className="flex flex-col gap-3">
        {shareMode !== "none" && (
          <button
            type="button"
            onClick={handleShare}
            className="h-9 px-4 rounded-full bg-accent text-text-on-accent text-body font-bold transition-colors duration-150 hover:bg-accent-hover"
          >
            {copied ? "コピーしました" : "共有する"}
          </button>
        )}
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
