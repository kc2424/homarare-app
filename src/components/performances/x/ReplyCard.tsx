"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BadgeCheck } from "lucide-react";
import type { ReactionItem } from "@/types/scenario";
import { Avatar } from "@/components/ui/Avatar";
import { prefersReducedMotion } from "@/lib/hooks/metrics";
import { TranslateToggle } from "./TranslateToggle";

interface ReplyCardProps {
  item: ReactionItem;
  autoOpenTranslation?: boolean;
}

export function ReplyCard({ item, autoOpenTranslation = false }: ReplyCardProps) {
  const { persona, body, likeCount, lang } = item;
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      gsap.set(element, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      element,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.4)" }
    );
  }, []);

  return (
    <article
      ref={cardRef}
      className="flex gap-3 px-4 py-3 border-b border-border"
    >
      <Avatar
        name={persona.displayName}
        personaId={persona.id}
        size={40}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-body font-bold text-text-primary truncate">
            {persona.displayName}
          </span>
          {persona.verified && (
            <BadgeCheck
              size={16}
              className="text-accent shrink-0 fill-accent text-white"
            />
          )}
          <span className="text-body text-text-secondary truncate">
            {persona.handle}
          </span>
        </div>

        {lang === "ar" ? (
          <div className="mt-0.5">
            <p className="text-body text-text-primary" dir="rtl" lang="ar">
              {body}
            </p>
            {item.translation && (
              <TranslateToggle
                translation={item.translation}
                open={autoOpenTranslation ? true : undefined}
                defaultOpen={false}
              />
            )}
          </div>
        ) : (
          <p className="mt-0.5 text-body text-text-primary whitespace-pre-wrap break-words">
            {body}
          </p>
        )}

        <div className="mt-3 flex items-center gap-1 text-meta text-text-secondary">
          <span className="tabular-nums">
            ♡ {likeCount.toLocaleString("en-US")}
          </span>
        </div>
      </div>
    </article>
  );
}
