import { forwardRef } from "react";
import { Avatar } from "@/components/ui/Avatar";
import type { LiveMetrics } from "@/lib/hooks/metrics";
import { ActionBar } from "./ActionBar";
import { TimestampLine } from "./TimestampLine";

interface PostCardProps {
  deed: string;
  metrics: LiveMetrics;
  postedAt?: Date;
}

export const PostCard = forwardRef<HTMLElement, PostCardProps>(
  function PostCard({ deed, metrics, postedAt }, ref) {
    return (
      <article
        ref={ref}
        className="bg-bg-primary border-b border-border"
      >
        <div className="px-4 py-3">
          <div className="flex gap-3">
            <Avatar name="あなた" personaId="user" size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col leading-5">
                <span className="text-body font-bold text-text-primary">
                  あなた
                </span>
                <span className="text-body text-text-secondary">@anonymous</span>
              </div>
              <p className="mt-1 text-post text-text-primary whitespace-pre-wrap break-words">
                {deed}
              </p>
              <div className="mt-3">
                <TimestampLine
                  impressions={metrics.impressions}
                  postedAt={postedAt}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 border-t border-border pt-1">
            <ActionBar
              variant="post"
              counts={{
                reply: metrics.replyCount,
                repost: metrics.spreads,
                like: metrics.yells,
                bookmark: metrics.bookmarks,
              }}
            />
          </div>
        </div>
      </article>
    );
  }
);
