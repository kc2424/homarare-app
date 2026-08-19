import type { ReactionItem } from "@/types/scenario";
import { ReplyCard } from "./ReplyCard";

interface ReplyListProps {
  items: ReactionItem[];
  visibleIds: string[];
  autoOpenZombieIds?: string[];
}

export function ReplyList({
  items,
  visibleIds,
  autoOpenZombieIds = [],
}: ReplyListProps) {
  const visibleSet = new Set(visibleIds);
  const visibleItems = items.filter((item) => visibleSet.has(item.id));

  return (
    <section aria-label="リプライ">
      {visibleItems.map((item) => (
        <ReplyCard
          key={item.id}
          item={item}
          autoOpenTranslation={autoOpenZombieIds.includes(item.id)}
        />
      ))}
    </section>
  );
}
