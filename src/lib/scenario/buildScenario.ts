import type {
  MetricTargets,
  Persona,
  PersonaId,
  ReactionItem,
  ReactionScenario,
  ReplyAuthor,
} from "@/types/scenario";
import {
  LIKE_RANGES,
  PERSONAS,
  PHASE_CONSTRAINTS,
  ZOMBIE_IDENTITIES,
} from "./personas";
import {
  pickOne,
  pickWithoutReplacement,
  randFloat,
  randInt,
  shuffle,
} from "./random";
import { TEMPLATES, TREND_LABELS, ZOMBIE_TEMPLATES } from "./templates";

const REGULAR_PERSONA_IDS = [
  "kouhai",
  "shinyu",
  "senpai",
  "mom",
  "pro",
  "stranger",
] as const;

type RegularPersonaId = (typeof REGULAR_PERSONA_IDS)[number];

const PERSONA_MAP = Object.fromEntries(
  PERSONAS.map((persona) => [persona.id, persona])
) as Record<RegularPersonaId, Persona>;

const PHASE_B_END = 3500;
const PHASE_D_START = 8000;
const PRO_PHASE_C_LATE_START = 6000;
const ZOMBIE_CLUSTER_START = 8500;
const TOTAL_DURATION_MS = 12000;
/** リプライ同士の最低間隔。これを割ると2枚同時に出て演出が潰れる */
const MIN_REPLY_GAP_MS = 300;

function expandTemplate(template: string, deed: string): string {
  const normalized = deed.replace(/\n/g, " ");
  const trimmed =
    normalized.length > 24 ? `${normalized.slice(0, 24)}…` : normalized;
  return template.replaceAll("{{deed}}", trimmed);
}

function toReplyAuthor(persona: Persona): ReplyAuthor {
  return {
    id: persona.id,
    displayName: persona.displayName,
    handle: persona.handle,
    avatarSrc: persona.avatarSrc,
    verified: persona.verified,
  };
}

function generateMetricTargets(): MetricTargets {
  const yells = randInt(8_000, 24_000);
  const engageRate = randFloat(0.004, 0.015);
  const impressions = Math.round(yells / engageRate);
  const spreads = Math.round(yells * randFloat(0.015, 0.06));
  const replyCount = Math.max(
    30,
    Math.round(yells * randFloat(0.005, 0.025))
  );
  const bookmarks = Math.round(yells * randFloat(0.08, 0.15));

  return { yells, impressions, spreads, replyCount, bookmarks };
}

function deriveReplyItemMetrics(
  likeCount: number,
  parentImpressions: number
): Pick<ReactionItem, "repostCount" | "replyCount" | "impressionCount"> {
  return {
    repostCount: Math.round(likeCount * randFloat(0.06, 0.09)),
    replyCount: Math.round(likeCount * randFloat(0.001, 0.005)),
    impressionCount: Math.round(parentImpressions * randFloat(0.08, 0.15)),
  };
}

function selectRegularPersonaIds(count: number): RegularPersonaId[] {
  const firstRound = pickWithoutReplacement(
    [...REGULAR_PERSONA_IDS],
    Math.min(count, REGULAR_PERSONA_IDS.length)
  );
  if (count <= REGULAR_PERSONA_IDS.length) {
    return firstRound;
  }
  const secondRound = pickWithoutReplacement(
    [...REGULAR_PERSONA_IDS],
    count - REGULAR_PERSONA_IDS.length
  );
  return [...firstRound, ...secondRound];
}

function getAvailableTemplates(
  personaId: RegularPersonaId,
  deed: string,
  usedTemplates: Set<string>
): string[] {
  return TEMPLATES[personaId].filter((template) => {
    if (usedTemplates.has(template)) return false;
    if (!deed.trim() && template.includes("{{deed}}")) return false;
    return true;
  });
}

function pickTemplate(
  personaId: RegularPersonaId,
  deed: string,
  usedTemplates: Set<string>
): string {
  const available = getAvailableTemplates(personaId, deed, usedTemplates);
  if (available.length === 0) {
    throw new Error(`No available templates for persona: ${personaId}`);
  }
  const template = pickOne(available);
  usedTemplates.add(template);
  return template;
}

function likeCountFor(personaId: PersonaId): number {
  const [min, max] = LIKE_RANGES[personaId];
  return randInt(min, max);
}

function randomInRange(min: number, max: number): number {
  return randInt(min, max);
}

function assignZombieAppearTimes(count: number): number[] {
  const maxStart = 11_000 - 400;
  const start = randInt(ZOMBIE_CLUSTER_START, maxStart);
  if (count === 1) {
    return [start];
  }
  const span = randInt(100, 400);
  const step = Math.floor(span / (count - 1));
  return Array.from({ length: count }, (_, index) => start + index * step);
}

interface DraftItem {
  persona: Persona;
  body: string;
  lang: "ja" | "ar";
  translation?: string;
  appearAt?: number;
}

function assignAppearTimes(items: DraftItem[]): void {
  const zombies = items.filter((item) => item.persona.id === "zombie");
  const normals = items.filter((item) => item.persona.id !== "zombie");

  const zombieTimes = assignZombieAppearTimes(zombies.length);
  zombies.forEach((item, index) => {
    item.appearAt = zombieTimes[index];
  });

  const pinned = new Set<DraftItem>();
  const kouhaiItems = normals.filter((item) => item.persona.id === "kouhai");
  if (kouhaiItems.length > 0) {
    const item = kouhaiItems[0];
    item.appearAt = randomInRange(1200, PHASE_B_END);
    pinned.add(item);
  }

  const shinyuItems = normals.filter((item) => item.persona.id === "shinyu");
  if (shinyuItems.length > 0) {
    const item = shinyuItems.find((candidate) => !pinned.has(candidate)) ?? shinyuItems[0];
    item.appearAt = randomInRange(1200, PHASE_B_END);
    pinned.add(item);
  }

  const strangerItems = normals.filter((item) => item.persona.id === "stranger");
  if (strangerItems.length > 0) {
    const item = strangerItems[0];
    item.appearAt = randomInRange(PHASE_D_START, PHASE_CONSTRAINTS.stranger[1]);
    pinned.add(item);
  }

  for (const item of normals) {
    if (item.persona.id !== "pro" || pinned.has(item)) continue;
    item.appearAt = randomInRange(
      PRO_PHASE_C_LATE_START,
      PHASE_CONSTRAINTS.pro[1]
    );
    pinned.add(item);
  }

  for (const item of normals) {
    if (pinned.has(item)) continue;
    const [min, max] = PHASE_CONSTRAINTS[item.persona.id];
    item.appearAt = randomInRange(min, max);
  }

  // 時刻順に走査し、直前のリプライから最低間隔を確保する。
  // 単調増加で詰めるので、この1パスで同時刻・順序逆転が起きない。
  const sortedNormals = [...normals].sort(
    (a, b) => (a.appearAt ?? 0) - (b.appearAt ?? 0)
  );
  for (let index = 1; index < sortedNormals.length; index++) {
    const prev = sortedNormals[index - 1];
    const current = sortedNormals[index];
    const earliest = (prev.appearAt ?? 0) + MIN_REPLY_GAP_MS;
    if ((current.appearAt ?? 0) >= earliest) continue;

    const [, max] = PHASE_CONSTRAINTS[current.persona.id];
    const desired = (prev.appearAt ?? 0) + randInt(MIN_REPLY_GAP_MS, 600);
    // フェーズ上限に張り付く場合は、上限を超えてでも最低間隔を優先する。
    // 同時に2枚出るほうが演出としての損失が大きいため。
    current.appearAt = Math.max(earliest, Math.min(max, desired));
  }
}

function createReactionId(index: number): string {
  return `reply-${index}-${Date.now().toString(36)}-${randInt(1000, 9999)}`;
}

export function buildScenario(deed: string): ReactionScenario {
  const targets = generateMetricTargets();
  const displayReplyCount = randInt(8, 12);
  // 表示リプライ数はゾンビを含む内数。ただし1周目で6人格を一巡させるため、
  // 通常人格を最低6件確保し、ゾンビ数は残り枠に収まるよう切り詰める。
  const zombieCount = Math.min(
    randInt(2, 3),
    displayReplyCount - REGULAR_PERSONA_IDS.length
  );
  const regularCount = displayReplyCount - zombieCount;

  const regularPersonaIds = selectRegularPersonaIds(regularCount);
  const usedTemplates = new Set<string>();

  const regularDrafts: DraftItem[] = regularPersonaIds.map((personaId) => {
    const persona = PERSONA_MAP[personaId];
    const template = pickTemplate(personaId, deed, usedTemplates);
    return {
      persona,
      body: expandTemplate(template, deed),
      lang: "ja",
    };
  });

  const zombieIdentities = pickWithoutReplacement(
    ZOMBIE_IDENTITIES,
    zombieCount
  );
  const zombieTemplates = pickWithoutReplacement(ZOMBIE_TEMPLATES, zombieCount);

  const zombieDrafts: DraftItem[] = zombieIdentities.map((identity, index) => {
    const template = zombieTemplates[index];
    const persona: Persona = {
      id: "zombie",
      displayName: identity.displayName,
      handle: identity.handle,
      avatarSrc: identity.avatarSrc,
      verified: false,
      templates: [],
    };
    return {
      persona,
      body: template.body,
      lang: "ar",
      translation: template.translation,
    };
  });

  const drafts = shuffle([...regularDrafts, ...zombieDrafts]);
  assignAppearTimes(drafts);

  drafts.sort((a, b) => (a.appearAt ?? 0) - (b.appearAt ?? 0));

  const items: ReactionItem[] = drafts.map((draft, index) => {
    const likeCount = likeCountFor(draft.persona.id);
    const replyMetrics = deriveReplyItemMetrics(likeCount, targets.impressions);

    return {
      id: createReactionId(index),
      persona: toReplyAuthor(draft.persona),
      body: draft.body,
      appearAt: draft.appearAt ?? 0,
      likeCount,
      lang: draft.lang,
      ...replyMetrics,
      ...(draft.translation ? { translation: draft.translation } : {}),
    };
  });

  return {
    kind: "x",
    deed,
    targets,
    items,
    totalDurationMs: TOTAL_DURATION_MS,
    trendLabel: pickOne(TREND_LABELS),
  };
}
