/** 投稿カード用の時刻行フォーマット */
export function formatPostTimestamp(date = new Date()): string {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours < 12 ? "午前" : "午後";
  const hour12 = hours % 12 || 12;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${period}${hour12}:${minutes} · ${year}年${month}月${day}日`;
}
