import type {
  HistoryEntry,
  HistoryStore,
  MetricTargets,
  ReactionItem,
  ReactionScenario,
} from "@/types/scenario";

const KEY = "homarare:history:v1";
const MAX_ENTRIES = 50;
const STORE_VERSION = 1 as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * crypto.randomUUID() はセキュアコンテキスト（https / localhost）でしか存在しない。
 * スマホ実機を http://192.168.x.x:3000 で開くと undefined になり、
 * 呼んだ瞬間に TypeError で演出直後の画面が壊れる。必ずフォールバックを持つ。
 */
function createEntryId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `entry-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isQuotaExceededError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  return (
    "name" in error &&
    (error as { name: string }).name === "QuotaExceededError"
  );
}

function isPersonaId(value: unknown): boolean {
  return (
    value === "kouhai" ||
    value === "shinyu" ||
    value === "senpai" ||
    value === "mom" ||
    value === "pro" ||
    value === "stranger" ||
    value === "zombie"
  );
}

function isReplyAuthor(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const author = value as Record<string, unknown>;
  return (
    isPersonaId(author.id) &&
    typeof author.displayName === "string" &&
    typeof author.handle === "string" &&
    typeof author.avatarSrc === "string" &&
    typeof author.verified === "boolean"
  );
}

function isReactionItem(value: unknown): value is ReactionItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    isReplyAuthor(item.persona) &&
    typeof item.body === "string" &&
    typeof item.appearAt === "number" &&
    typeof item.likeCount === "number" &&
    (item.lang === "ja" || item.lang === "ar") &&
    typeof item.repostCount === "number" &&
    typeof item.replyCount === "number" &&
    typeof item.impressionCount === "number" &&
    (item.translation === undefined || typeof item.translation === "string")
  );
}

function isMetricTargets(value: unknown): value is MetricTargets {
  if (!value || typeof value !== "object") return false;
  const targets = value as Record<string, unknown>;
  return (
    typeof targets.yells === "number" &&
    typeof targets.impressions === "number" &&
    typeof targets.spreads === "number" &&
    typeof targets.replyCount === "number" &&
    typeof targets.bookmarks === "number"
  );
}

function isReactionScenario(value: unknown): value is ReactionScenario {
  if (!value || typeof value !== "object") return false;
  const scenario = value as Record<string, unknown>;
  if (
    scenario.kind !== "x" &&
    scenario.kind !== "line" &&
    scenario.kind !== "instagram"
  ) {
    return false;
  }
  if (typeof scenario.deed !== "string") return false;
  if (!isMetricTargets(scenario.targets)) return false;
  if (!Array.isArray(scenario.items)) return false;
  if (!scenario.items.every(isReactionItem)) return false;
  if (typeof scenario.totalDurationMs !== "number") return false;
  if (typeof scenario.trendLabel !== "string") return false;
  return true;
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    typeof entry.postedAt === "string" &&
    isReactionScenario(entry.scenario)
  );
}

function isHistoryStore(value: unknown): value is HistoryStore {
  if (!value || typeof value !== "object") return false;
  const store = value as Record<string, unknown>;
  return (
    store.version === STORE_VERSION &&
    Array.isArray(store.entries) &&
    store.entries.every(isHistoryEntry)
  );
}

function discardCorruptedStore(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // localStorage 自体が使えない場合は握りつぶす
  }
}

function readStore(): HistoryStore | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isHistoryStore(parsed)) {
      discardCorruptedStore();
      return null;
    }

    return parsed;
  } catch {
    discardCorruptedStore();
    return null;
  }
}

function writeStore(store: HistoryStore): void {
  if (!isBrowser()) return;

  const payload = JSON.stringify(store);

  try {
    localStorage.setItem(KEY, payload);
    return;
  } catch (error) {
    if (!isQuotaExceededError(error)) return;
  }

  const trimmed: HistoryStore = {
    version: STORE_VERSION,
    entries: [...store.entries],
  };

  while (trimmed.entries.length > 0) {
    trimmed.entries.pop();
    try {
      localStorage.setItem(KEY, JSON.stringify(trimmed));
      return;
    } catch (error) {
      if (!isQuotaExceededError(error)) return;
    }
  }
}

export function loadHistory(): HistoryEntry[] {
  return readStore()?.entries ?? [];
}

export function saveEntry(scenario: ReactionScenario, postedAt: Date): void {
  if (!isBrowser()) return;

  // 履歴の保存失敗でアプリを止めない（06_投稿履歴_実装仕様.md 4章）。
  // ここは演出が完走した直後に呼ばれるため、例外を通すと最悪の位置で画面が壊れる。
  try {
    const store = readStore() ?? { version: STORE_VERSION, entries: [] };
    const entry: HistoryEntry = {
      id: createEntryId(),
      postedAt: postedAt.toISOString(),
      scenario,
    };

    store.entries.unshift(entry);
    if (store.entries.length > MAX_ENTRIES) {
      store.entries = store.entries.slice(0, MAX_ENTRIES);
    }

    writeStore(store);
  } catch {
    // 保存できなくても演出体験は成立する
  }
}

export function removeEntry(id: string): void {
  if (!isBrowser()) return;

  const store = readStore();
  if (!store) return;

  writeStore({
    version: STORE_VERSION,
    entries: store.entries.filter((entry) => entry.id !== id),
  });
}

export function clearHistory(): void {
  discardCorruptedStore();
}
