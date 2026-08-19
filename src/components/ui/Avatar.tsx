import { User } from "lucide-react";

const PERSONA_COLORS: Record<string, string> = {
  kouhai: "#F472B6",
  shinyu: "#FB923C",
  senpai: "#60A5FA",
  mom: "#A78BFA",
  pro: "#34D399",
  stranger: "#94A3B8",
  zombie: "#78716C",
  user: "#EFF3F4",
};

interface AvatarProps {
  name: string;
  personaId?: string;
  size: 40 | 48;
}

export function Avatar({ name, personaId = "user", size }: AvatarProps) {
  const color = PERSONA_COLORS[personaId] ?? PERSONA_COLORS.user;
  const initial = name.trim().charAt(0) || "?";

  return (
    <div
      className="rounded-full shrink-0 flex items-center justify-center font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size === 48 ? 18 : 15,
        color: personaId === "user" ? "#536471" : "#FFFFFF",
      }}
      aria-hidden
    >
      {personaId === "user" ? (
        <User size={size * 0.45} strokeWidth={2.2} />
      ) : (
        initial
      )}
    </div>
  );
}
