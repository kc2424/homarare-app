import { Volume2 } from "lucide-react";
import { YLogo } from "@/components/icons/YLogo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-[53px] border-b border-border bg-bg-primary flex items-center justify-between px-4">
      <div className="w-[34px]" />
      <YLogo className="text-text-primary" />
      <button
        type="button"
        className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-hover transition-colors duration-150"
        aria-label="ミュート"
      >
        <Volume2 size={18} />
      </button>
    </header>
  );
}
