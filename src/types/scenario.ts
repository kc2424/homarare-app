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
  avatarSrc: string;     // /avatars/kouhai.png
  verified: boolean;     // pro のみ true
  templates: string[];   // {{deed}} を含みうる
}

// ---- 生成されたリプライ1件 ----
export interface ReactionItem {
  id: string;
  persona: Persona;
  body: string;          // テンプレート展開済みの本文
  appearAt: number;      // 演出開始からの ms
  likeCount: number;     // このリプライ自体につくエール数

  /** 本文の言語。"ar" のとき RTL 表示 + 翻訳UIを出す */
  lang: "ja" | "ar";
  /** lang === "ar" のときのみ存在。「翻訳を表示」で出る日本語 */
  translation?: string;
}

// ---- 数値カウンタの目標値 ----
// すべて yells から比率で導出する。独立にランダム抽選してはいけない。
export interface MetricTargets {
  yells: number;         // いいね相当（基準値・主役）
  impressions: number;   // 表示回数。yells / 1.2〜2.5%
  spreads: number;       // リポスト相当。yells × 10〜18%
  replyCount: number;    // リプライ総数（表示用）。yells × 1.5〜4.5%
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
