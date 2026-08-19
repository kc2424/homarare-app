import Image from "next/image";
import { User } from "lucide-react";

/**
 * 画像読み込み前・失敗時に見える下地の色（05_アセット方針.md）。
 * 03_デザイントークン.md 10章「エールのピンクが画面内で唯一の強い色」に従い、
 * 人格の区別がつく範囲まで彩度を落とした低彩度トーンに揃える。
 */
const PERSONA_COLORS: Record<string, string> = {
  kouhai: "#C9A9B4",
  shinyu: "#C9B199",
  senpai: "#A3B5C7",
  mom: "#B3AAC4",
  pro: "#9FBDB0",
  stranger: "#B2BAC1",
  zombie: "#A8A29E",
  user: "#EFF3F4",
};

interface AvatarProps {
  name: string;
  personaId?: string;
  size: 40 | 48;
  /** persona.avatarSrc。未指定なら色付きの丸＋イニシャルで代替する */
  src?: string;
}

export function Avatar({ name, personaId = "user", size, src }: AvatarProps) {
  const color = PERSONA_COLORS[personaId] ?? PERSONA_COLORS.user;
  const initial = name.trim().charAt(0) || "?";

  return (
    <div
      className="relative rounded-full shrink-0 overflow-hidden flex items-center justify-center font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size === 48 ? 18 : 15,
        color: personaId === "user" ? "#536471" : "#FFFFFF",
      }}
      aria-hidden
    >
      {src ? (
        <Image src={src} alt="" width={size} height={size} className="object-cover" />
      ) : personaId === "user" ? (
        <User size={size * 0.45} strokeWidth={2.2} />
      ) : (
        initial
      )}
    </div>
  );
}
