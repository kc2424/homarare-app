/** min 以上 max 以下の整数を返す（レンジ抽選） */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** min 以上 max 以下の浮動小数を返す */
export function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** 配列から min〜max の範囲でランダムに1要素を返す */
export function pickFromRange<T>(items: T[], min: number, max: number): T {
  const count = randInt(min, Math.min(max, items.length));
  const shuffled = shuffle([...items]);
  return shuffled[count - 1];
}

/** Fisher-Yates シャッフル */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** 配列から重複なしで count 件を抽選する */
export function pickWithoutReplacement<T>(items: T[], count: number): T[] {
  if (count > items.length) {
    throw new Error(
      `pickWithoutReplacement: count (${count}) exceeds items length (${items.length})`
    );
  }
  return shuffle(items).slice(0, count);
}

/** 配列からランダムに1要素を返す */
export function pickOne<T>(items: T[]): T {
  return items[randInt(0, items.length - 1)];
}
