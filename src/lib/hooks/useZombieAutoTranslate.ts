"use client";

import { useEffect, useState } from "react";
import type { ReactionItem } from "@/types/scenario";

export function useZombieAutoTranslate(
  items: ReactionItem[],
  enabled: boolean
) {
  const [autoOpenIds, setAutoOpenIds] = useState<string[]>([]);

  useEffect(() => {
    if (!enabled) {
      setAutoOpenIds([]);
      return;
    }

    const zombies = items.filter((item) => item.lang === "ar");
    if (zombies.length === 0) return;

    const timeouts: number[] = [];

    zombies.forEach((item, index) => {
      const timeout = window.setTimeout(() => {
        setAutoOpenIds((prev) =>
          prev.includes(item.id) ? prev : [...prev, item.id]
        );
      }, 600 + index * 600);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [enabled, items]);

  return autoOpenIds;
}
