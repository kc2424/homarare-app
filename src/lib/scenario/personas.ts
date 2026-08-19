import type { Persona } from "@/types/scenario";
import { TEMPLATES } from "./templates";

export const PERSONAS: Persona[] = [
  {
    id: "kouhai",
    displayName: "みなみ",
    handle: "@minami_0203",
    avatarSrc: "/avatars/kouhai.jpg",
    verified: false,
    templates: TEMPLATES.kouhai,
  },
  {
    id: "shinyu",
    displayName: "りょう",
    handle: "@ryo_tekitou",
    avatarSrc: "/avatars/shinyu.jpg",
    verified: false,
    templates: TEMPLATES.shinyu,
  },
  {
    id: "senpai",
    displayName: "タカハシ",
    handle: "@takahashi_wk",
    avatarSrc: "/avatars/senpai.jpg",
    verified: false,
    templates: TEMPLATES.senpai,
  },
  {
    id: "mom",
    displayName: "かあちゃん",
    handle: "@kaachan_gohan",
    avatarSrc: "/avatars/mom.jpg",
    verified: false,
    templates: TEMPLATES.mom,
  },
  {
    id: "pro",
    displayName: "藤堂 慧",
    handle: "@toudou_kei",
    avatarSrc: "/avatars/pro.jpg",
    verified: true,
    templates: TEMPLATES.pro,
  },
  {
    id: "stranger",
    displayName: "な",
    handle: "@nanashi_1129",
    avatarSrc: "/avatars/stranger.jpg",
    verified: false,
    templates: TEMPLATES.stranger,
  },
];

/** インプレゾンビのアカウントプール（毎回ここから重複なしで抽選） */
export const ZOMBIE_IDENTITIES = [
  { displayName: "أحمد",       handle: "@ahmed_x9271",     avatarSrc: "/avatars/zombie_1.jpg" },
  { displayName: "محمد علي",   handle: "@m_ali8823",       avatarSrc: "/avatars/zombie_2.jpg" },
  { displayName: "Crypto_King", handle: "@king_7741x",     avatarSrc: "/avatars/zombie_3.jpg" },
  { displayName: "سارة",       handle: "@sara_love221",    avatarSrc: "/avatars/zombie_4.jpg" },
  { displayName: "Follow_Back", handle: "@followback_0092", avatarSrc: "/avatars/zombie_5.jpg" },
];

/** リプライ自体につくエール数のレンジ */
export const LIKE_RANGES: Record<string, [number, number]> = {
  kouhai: [12, 80],
  shinyu: [30, 150],
  senpai: [200, 900],
  mom: [400, 1800],
  pro: [800, 3200],
  stranger: [150, 700],
  zombie: [2, 40],
};

/** 出現フェーズの制約（ms） */
export const PHASE_CONSTRAINTS: Record<string, [number, number]> = {
  kouhai: [1200, 5000],
  shinyu: [1500, 6500],
  senpai: [3500, 8000],
  mom: [3500, 8000],
  pro: [6000, 9500],
  stranger: [8000, 11500],
  zombie: [8500, 11000], // 2〜3件を 0.4s 以内に固めて出す
};
