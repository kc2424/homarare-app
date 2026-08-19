import {
  BarChart3,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from "lucide-react";

const ACTIONS = [
  { icon: MessageCircle, label: "リプライ", hoverClass: "hover:bg-accent-subtle hover:text-accent" },
  { icon: Repeat2, label: "ひろめる", hoverClass: "hover:bg-spread-subtle hover:text-spread" },
  { icon: Heart, label: "エール", hoverClass: "hover:bg-like-subtle hover:text-like" },
  { icon: BarChart3, label: "表示回数", hoverClass: "hover:bg-accent-subtle hover:text-accent" },
  { icon: Bookmark, label: "保存", hoverClass: "hover:bg-accent-subtle hover:text-accent" },
  { icon: Share, label: "共有", hoverClass: "hover:bg-accent-subtle hover:text-accent" },
] as const;

export function ActionBar() {
  return (
    <div className="flex items-center justify-between max-w-[425px]">
      {ACTIONS.map(({ icon: Icon, label, hoverClass }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-text-secondary transition-colors duration-150 ${hoverClass}`}
        >
          <Icon size={18} strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
}
