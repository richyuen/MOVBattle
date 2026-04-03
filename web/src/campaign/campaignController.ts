import type { CampaignDefinition, CampaignId, CampaignSessionState } from "./campaignTypes";
import { CAMPAIGN_DEFINITIONS } from "./campaignData";

export function listCampaigns(): CampaignDefinition[] {
  return CAMPAIGN_DEFINITIONS;
}

export function getCampaignDefinition(campaignId: CampaignId): CampaignDefinition | undefined {
  return CAMPAIGN_DEFINITIONS.find((campaign) => campaign.id === campaignId);
}

export function createCampaignSession(campaignId: CampaignId, unlimited = false): CampaignSessionState | null {
  const campaignIndex = CAMPAIGN_DEFINITIONS.findIndex((campaign) => campaign.id === campaignId);
  if (campaignIndex < 0) return null;
  const campaign = CAMPAIGN_DEFINITIONS[campaignIndex];
  return {
    campaignId: campaign.id,
    scenarioId: campaign.scenario.id,
    campaignIndex,
    unlimited,
  };
}

export function getCurrentCampaignDefinition(session: CampaignSessionState | null): CampaignDefinition | null {
  if (!session) return null;
  return getCampaignDefinition(session.campaignId) ?? null;
}

export function advanceCampaignSession(session: CampaignSessionState): CampaignSessionState {
  const nextIndex = Math.min(session.campaignIndex + 1, CAMPAIGN_DEFINITIONS.length - 1);
  const nextCampaign = CAMPAIGN_DEFINITIONS[nextIndex];
  return {
    campaignId: nextCampaign.id,
    scenarioId: nextCampaign.scenario.id,
    campaignIndex: nextIndex,
    unlimited: session.unlimited,
  };
}
