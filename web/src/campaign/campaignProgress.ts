import { CAMPAIGN_DEFINITIONS } from "./campaignData";
import type { CampaignId } from "./campaignTypes";

/**
 * Campaign progress kept in the browser between visits: the stages won on a budget, and the last stage played, so the
 * campaign map opens where the player left off. Unlimited-mode wins do not count as clears. Without storage (private
 * mode, a blocked iframe) everything still works for the session and nothing is kept.
 */
export const CAMPAIGN_PROGRESS_KEY = "movbattle.campaignProgress.v1";

export interface CampaignProgress {
  version: 1;
  /** Stage ids won on a budget, per campaign. */
  cleared: Partial<Record<CampaignId, string[]>>;
  /** The last stage loaded, to reopen the campaign map on it. */
  last: { campaignId: CampaignId; scenarioId: string } | null;
}

function emptyProgress(): CampaignProgress {
  return { version: 1, cleared: {}, last: null };
}

let cache: CampaignProgress | null = null;

function storage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

function knownScenario(campaignId: unknown, scenarioId: unknown): campaignId is CampaignId {
  const campaign = CAMPAIGN_DEFINITIONS.find((entry) => entry.id === campaignId);
  return Boolean(campaign && campaign.scenarios.some((scenario) => scenario.id === scenarioId));
}

/** Reads what is stored, keeping only campaigns and stages that still exist, so a renamed stage never breaks a load. */
function parse(raw: string | null): CampaignProgress {
  const progress = emptyProgress();
  if (!raw) return progress;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return progress;
  }
  if (!data || typeof data !== "object" || (data as { version?: unknown }).version !== 1) return progress;
  const { cleared, last } = data as { cleared?: unknown; last?: unknown };
  if (cleared && typeof cleared === "object") {
    for (const [campaignId, ids] of Object.entries(cleared as Record<string, unknown>)) {
      if (!Array.isArray(ids)) continue;
      const kept = ids.filter((id): id is string => typeof id === "string" && knownScenario(campaignId, id));
      if (kept.length > 0) progress.cleared[campaignId as CampaignId] = [...new Set(kept)];
    }
  }
  if (last && typeof last === "object") {
    const { campaignId, scenarioId } = last as { campaignId?: unknown; scenarioId?: unknown };
    if (knownScenario(campaignId, scenarioId)) progress.last = { campaignId, scenarioId: scenarioId as string };
  }
  return progress;
}

export function loadCampaignProgress(): CampaignProgress {
  if (!cache) {
    let raw: string | null = null;
    try {
      raw = storage()?.getItem(CAMPAIGN_PROGRESS_KEY) ?? null;
    } catch {
      raw = null;
    }
    cache = parse(raw);
  }
  return cache;
}

function save(progress: CampaignProgress): void {
  cache = progress;
  try {
    storage()?.setItem(CAMPAIGN_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or blocked: progress stays for this session only.
  }
}

export function markScenarioCleared(campaignId: CampaignId, scenarioId: string): void {
  if (!knownScenario(campaignId, scenarioId)) return;
  const progress = loadCampaignProgress();
  const ids = progress.cleared[campaignId] ?? [];
  if (ids.includes(scenarioId)) return;
  save({ ...progress, cleared: { ...progress.cleared, [campaignId]: [...ids, scenarioId] } });
}

export function setLastCampaignScenario(campaignId: CampaignId, scenarioId: string): void {
  if (!knownScenario(campaignId, scenarioId)) return;
  const progress = loadCampaignProgress();
  if (progress.last?.campaignId === campaignId && progress.last.scenarioId === scenarioId) return;
  save({ ...progress, last: { campaignId, scenarioId } });
}

export function isScenarioCleared(campaignId: CampaignId, scenarioId: string): boolean {
  return loadCampaignProgress().cleared[campaignId]?.includes(scenarioId) ?? false;
}

export function isCampaignCleared(campaignId: CampaignId): boolean {
  const campaign = CAMPAIGN_DEFINITIONS.find((entry) => entry.id === campaignId);
  if (!campaign || campaign.scenarios.length === 0) return false;
  return campaign.scenarios.every((scenario) => isScenarioCleared(campaignId, scenario.id));
}

export function clearedScenarioCount(): number {
  return Object.values(loadCampaignProgress().cleared).reduce((sum, ids) => sum + (ids?.length ?? 0), 0);
}

export function resetCampaignProgress(): void {
  cache = emptyProgress();
  try {
    storage()?.removeItem(CAMPAIGN_PROGRESS_KEY);
  } catch {
    // Nothing kept to remove.
  }
}
