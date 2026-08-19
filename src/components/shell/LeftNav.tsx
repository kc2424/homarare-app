"use client";

import { History, Home, PenLine } from "lucide-react";
import { HLogo } from "@/components/icons/HLogo";
import { Avatar } from "@/components/ui/Avatar";

interface LeftNavProps {
  onHome: () => void;
  onHistory: () => void;
  onPost: () => void;
}

/**
 * 1360px 未満ではアイコンだけに畳む（本家Xと同じ挙動）。
 * 275px のまま維持すると 3カラムの合計が 1225px になり、
 * 1300px 前後の画面で右パネルが入らなくなるため。
 */
export function LeftNav({ onHome, onHistory, onPost }: LeftNavProps) {
  return (
    <nav className="hidden lg:flex w-[88px] min-[1360px]:w-[275px] shrink-0 flex-col sticky top-0 h-screen py-2 min-[1360px]:pr-4 items-center min-[1360px]:items-stretch">
      <button
        type="button"
        onClick={onHome}
        aria-label="ホームに戻る"
        className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-text-primary hover:bg-bg-hover"
      >
        <HLogo />
      </button>

      <div className="mt-1 flex flex-col items-center min-[1360px]:items-start gap-1">
        <NavItem icon={Home} label="ホーム" onClick={onHome} />
        <NavItem icon={History} label="履歴" onClick={onHistory} />
      </div>

      <button
        type="button"
        onClick={onPost}
        aria-label="ポストする"
        className="mt-5 h-[52px] w-[52px] min-[1360px]:w-full rounded-full bg-accent text-text-on-accent text-post font-bold hover:bg-accent-hover flex items-center justify-center"
      >
        <PenLine size={22} strokeWidth={2} className="min-[1360px]:hidden" />
        <span className="hidden min-[1360px]:inline">ポストする</span>
      </button>

      <div className="mt-auto flex items-center gap-3 rounded-full p-3 hover:bg-bg-hover">
        <Avatar name="あなた" personaId="user" size={40} />
        <div className="hidden min-[1360px]:block min-w-0 leading-5">
          <p className="text-body font-bold text-text-primary">あなた</p>
          <p className="text-body text-text-secondary">@anonymous</p>
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Home;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex items-center gap-4 rounded-full p-3 min-[1360px]:pl-3 min-[1360px]:pr-6 text-text-primary hover:bg-bg-hover"
    >
      <Icon size={24} strokeWidth={1.75} />
      <span className="hidden min-[1360px]:inline text-post">{label}</span>
    </button>
  );
}
