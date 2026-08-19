/**
 * 数値フォーマット規則（エール数以外のメトリクス用）
 * - < 10,000: 3桁区切り
 * - 10,000 – 999,999: 万・小数第1位
 * - ≥ 1,000,000: 万・整数
 */
export function formatMetric(value: number): string {
  if (value < 10_000) {
    return value.toLocaleString("en-US");
  }
  if (value < 1_000_000) {
    const man = value / 10_000;
    const rounded = Math.round(man * 10) / 10;
    return `${rounded}万`;
  }
  const man = Math.round(value / 10_000);
  return `${man}万`;
}

/** エール数は常に3桁区切りのフル表示 */
export function formatYells(value: number): string {
  return value.toLocaleString("en-US");
}
