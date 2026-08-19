import { History } from "lucide-react";
import { HLogo } from "@/components/icons/HLogo";

interface HeaderProps {
  onHistoryClick: () => void;
  /** PCの中央カラムに出すタイトル。本家も投稿詳細では「ポスト」と出す */
  title: string;
}

export function Header({ onHistoryClick, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-[53px] border-b border-border bg-bg-primary">
      {/* スマホ: ロゴ中央 + 履歴。PCではロゴも履歴も左ナビにあるので出さない */}
      <div className="lg:hidden h-full flex items-center justify-between px-4">
        <div className="w-[34px] shrink-0" aria-hidden />
        <HLogo className="text-text-primary" />
        <button
          type="button"
          onClick={onHistoryClick}
          aria-label="投稿履歴"
          className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-hover shrink-0"
        >
          <History size={18} strokeWidth={1.75} />
        </button>
      </div>

      {/* PC: タイトルのみ。ヘッダーごと消すと中央カラムの上が詰まって見える */}
      <div className="hidden lg:flex h-full items-center px-4">
        <h1 className="text-post font-bold text-text-primary">{title}</h1>
      </div>
    </header>
  );
}
