"use client";

import { useEffect, useState } from "react";
import { formatYells } from "@/lib/format";
import { loadHistory } from "@/lib/history/storage";

interface Stats {
  posts: number;
  totalYells: number;
}

export function RightPanel({ refreshKey }: { refreshKey: number }) {
  const [stats, setStats] = useState<Stats | null>(null);

  // localStorage はマウント後に読む（レンダー中に読むとハイドレーション不一致になる）
  useEffect(() => {
    const entries = loadHistory();
    setStats({
      posts: entries.length,
      totalYells: entries.reduce(
        (sum, entry) => sum + entry.scenario.targets.yells,
        0
      ),
    });
  }, [refreshKey]);

  return (
    <aside className="hidden min-[1360px]:block w-[350px] shrink-0 sticky top-0 h-screen overflow-y-auto py-3 pl-8">
      <section className="rounded-2xl bg-bg-hover p-4">
        <h2 className="text-post font-bold text-text-primary">これまでの記録</h2>
        <dl className="mt-3 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <dt className="text-body text-text-secondary">ポスト</dt>
            <dd className="text-post font-bold text-text-primary tabular-nums">
              {stats ? stats.posts : "—"}
            </dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="text-body text-text-secondary">累計エール</dt>
            <dd className="text-post font-bold text-like tabular-nums">
              {stats ? formatYells(stats.totalYells) : "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-4 rounded-2xl bg-bg-hover p-4">
        <h2 className="text-post font-bold text-text-primary">ほめられ</h2>
        <p className="mt-2 text-body leading-6 text-text-secondary">
          やったことを書くだけで、Hのみんなが一斉に褒めてくれます。
        </p>
      </section>
    </aside>
  );
}
