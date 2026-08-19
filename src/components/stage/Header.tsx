import { History } from "lucide-react";
import { HLogo } from "@/components/icons/HLogo";

interface HeaderProps {
  onHistoryClick: () => void;
}

export function Header({ onHistoryClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-[53px] border-b border-border bg-bg-primary flex items-center justify-between px-4">
      <div className="w-[34px] shrink-0" aria-hidden />
      <HLogo className="text-text-primary" />
      <button
        type="button"
        onClick={onHistoryClick}
        aria-label="投稿履歴"
        className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-hover transition-colors duration-150 shrink-0"
      >
        <History size={18} strokeWidth={1.75} />
      </button>
    </header>
  );
}
