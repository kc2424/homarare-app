import { buildScenario } from "@/lib/scenario/buildScenario";
import { formatMetric, formatYells } from "@/lib/format";

const SAMPLE_DEEDS = [
  "ゴミを捨てた",
  "朝6時に起きてジョギングした",
  "レポートを1ページ書いた",
];

const deed = process.argv[2] ?? SAMPLE_DEEDS[Math.floor(Math.random() * SAMPLE_DEEDS.length)];

const scenario = buildScenario(deed);
const { targets, items } = scenario;

const engageRate = ((targets.yells / targets.impressions) * 100).toFixed(2);
const spreadRate = ((targets.spreads / targets.yells) * 100).toFixed(2);
const replyRate = ((targets.replyCount / targets.yells) * 100).toFixed(2);
const bookmarkRate = ((targets.bookmarks / targets.yells) * 100).toFixed(2);

console.log("=== buildScenario output ===");
console.log(`deed: ${deed}`);
console.log(`trendLabel: ${scenario.trendLabel}`);
console.log(`totalDurationMs: ${scenario.totalDurationMs}`);
console.log("");
console.log("--- MetricTargets ---");
console.log(`yells:        ${targets.yells} (${formatYells(targets.yells)})`);
console.log(`impressions:  ${targets.impressions} (${formatMetric(targets.impressions)})`);
console.log(`spreads:      ${targets.spreads} (${formatMetric(targets.spreads)})`);
console.log(`replyCount:   ${targets.replyCount} (${formatMetric(targets.replyCount)})`);
console.log(`bookmarks:    ${targets.bookmarks} (${formatMetric(targets.bookmarks)})`);
console.log("");
console.log("--- Derived ratios ---");
console.log(`engage rate (yells/impressions): ${engageRate}%  [spec: 0.4–1.5%]`);
console.log(`spread rate (spreads/yells):     ${spreadRate}%  [spec: 1.5–6%]`);
console.log(`reply rate (replyCount/yells):   ${replyRate}%  [spec: 0.5–2.5%, min 30]`);
console.log(`bookmark rate (bookmarks/yells): ${bookmarkRate}%  [spec: 8–15%]`);
console.log("");
console.log(`display replies: ${items.length}  [spec: 8–12]`);
console.log(`zombie replies:  ${items.filter((item) => item.persona.id === "zombie").length}  [spec: 2–3]`);
console.log("");
console.log("--- ReactionItems (appearAt asc) ---");
for (const item of items) {
  const lang = item.lang === "ar" ? " [ar]" : "";
  const repostRate = ((item.repostCount / item.likeCount) * 100).toFixed(2);
  const itemReplyRate = ((item.replyCount / item.likeCount) * 100).toFixed(2);
  const impressionRate = ((item.impressionCount / targets.impressions) * 100).toFixed(2);

  console.log(
    `[${(item.appearAt / 1000).toFixed(2)}s] ${item.persona.id} (@${item.persona.handle.slice(1)}) ♡${item.likeCount}${lang}`
  );
  console.log(
    `  repost=${item.repostCount} (${repostRate}%) reply=${item.replyCount} (${itemReplyRate}%) impression=${item.impressionCount} (${impressionRate}%)`
  );
  console.log(`  ${item.body}`);
  if (item.translation) {
    console.log(`  → ${item.translation}`);
  }
}
