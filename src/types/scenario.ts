// ---- 演出パターンの識別子 ----
export type PerformanceKind = "x" | "line" | "instagram";

// ---- 人格 ----
export type PersonaId =
  | "kouhai" | "shinyu" | "senpai" | "mom" | "pro" | "stranger"
  | "zombie";            // インプレゾンビ（アラビア語）

export interface Persona {
  id: PersonaId;
  displayName: string;   // 表示名（例: "みなみ"）
  handle: string;        // @minami_0203
  avatarSrc: string;     // /avatars/kouhai.jpg
  verified: boolean;     // pro のみ true
  templates: string[];   // {{deed}} を含みうる
}

/** リプライの表示に必要な情報だけを持つ。templates は含まない */
export interface ReplyAuthor {
  id: PersonaId;
  displayName: string;
  handle: string;
  avatarSrc: string;
  verified: boolean;
}

// ---- 生成されたリプライ1件 ----
export interface ReactionItem {
  id: string;
  persona: ReplyAuthor;
  body: string;          // テンプレート展開済みの本文
  appearAt: number;      // 演出開始からの ms
  likeCount: number;     // このリプライ自体につくエール数

  /** 本文の言語。"ar" のとき RTL 表示 + 翻訳UIを出す */
  lang: "ja" | "ar";
  /** lang === "ar" のときのみ存在。「翻訳を表示」で出る日本語 */
  translation?: string;

  /** このリプライのアクション行に出す指標。0 のときは数字を表示しない */
  repostCount: number;      // likeCount × 6〜9%
  replyCount: number;       // likeCount × 0.1〜0.5%
  impressionCount: number;  // 親投稿の impressions × 8〜15%
}

// ---- 数値カウンタの目標値 ----
// すべて yells から比率で導出する。独立にランダム抽選してはいけない。
export interface MetricTargets {
  yells: number;         // いいね相当（基準値・主役）
  impressions: number;   // 表示回数。yells / 0.4〜1.5%
  spreads: number;       // リポスト相当。yells × 1.5〜6%
  replyCount: number;    // リプライ総数（表示用）。yells × 0.5〜2.5%（下限30）
  bookmarks: number;     // 保存相当。yells × 8〜15%
}

// ---- 1回の演出の完全な設計図 ----
export interface ReactionScenario {
  kind: PerformanceKind;
  deed: string;              // ユーザーの入力
  targets: MetricTargets;
  items: ReactionItem[];     // appearAt 昇順
  totalDurationMs: number;   // 通常 12000
  trendLabel: string;        // 例: "エール数 急上昇1位"
}

// ---- 状態機械 ----
export type StageState =
  | "idle" | "composing" | "posting" | "reacting" | "settled";

// ---- 投稿履歴 ----
export interface HistoryEntry {
  id: string;
  postedAt: string;
  scenario: ReactionScenario;
}

export interface HistoryStore {
  version: 1;
  entries: HistoryEntry[];
}
