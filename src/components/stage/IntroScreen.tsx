"use client";

import { HLogo } from "@/components/icons/HLogo";

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <button
      type="button"
      onClick={onStart}
      aria-label="はじめる"
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-bg-primary px-8 text-center"
    >
      <HLogo className="text-text-primary intro-fade" size={72} />

      <div className="intro-fade intro-fade-delay-1">
        <p className="text-[28px] font-bold leading-9 text-text-primary">
          ほめられ
        </p>
        <p className="mt-3 text-body leading-6 text-text-secondary">
          やったことを書くだけで、
          <br />
          Hのみんなが一斉に褒めてくれます。
        </p>
      </div>

      <p className="intro-fade intro-fade-delay-2 mt-4 text-meta font-bold text-accent">
        タップして始める
      </p>
    </button>
  );
}
