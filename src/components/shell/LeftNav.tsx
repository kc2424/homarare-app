"use client";

import { History, Home } from "lucide-react";
import { HLogo } from "@/components/icons/HLogo";
import { Avatar } from "@/components/ui/Avatar";

interface LeftNavProps {
  onHome: () => void;
  onHistory: () => void;
  onPost: () => void;
}

export function LeftNav({ onHome, onHistory, onPost }: LeftNavProps) {
  return (
    <nav className="hidden lg:flex w-[275px] shrink-0 flex-col sticky top-0 h-screen py-2 pr-4">
      <button
        type="button"
        onClick={onHome}
        aria-label="ホームに戻る"
        className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-text-primary hover:bg-bg-hover"
      >
        <HLogo />
      </button>

      <div className="mt-1 flex flex-col items-start gap-1">
        <NavItem icon={Home} label="ホーム" onClick={onHome} />
        <NavItem icon={History} label="履歴" onClick={onHistory} />
      </div>

      <button
        type="button"
        onClick={onPost}
        className="mt-5 h-[52px] w-full rounded-full bg-accent text-text-on-accent text-post font-bold hover:bg-accent-hover"
      >
        ポストする
      </button>

      <div className="mt-auto flex items-center gap-3 rounded-full p-3 hover:bg-bg-hover">
        <Avatar name="あなた" personaId="user" size={40} />
        <div className="min-w-0 leading-5">
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
      className="flex items-center gap-4 rounded-full py-3 pl-3 pr-6 text-text-primary hover:bg-bg-hover"
    >
      <Icon size={24} strokeWidth={1.75} />
      <span className="text-post">{label}</span>
    </button>
  );
}
