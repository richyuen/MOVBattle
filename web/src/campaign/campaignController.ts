import type { CampaignDefinition, CampaignId, CampaignScenarioDefinition, CampaignSessionState } from "./campaignTypes";
import { CAMPAIGN_DEFINITIONS } from "./campaignData";

export function listCampaigns(): CampaignDefinition[] {
  return CAMPAIGN_DEFINITIONS;
}

export function getCampaignDefinition(campaignId: CampaignId): CampaignDefinition | undefined {
  return CAMPAIGN_DEFINITIONS.find((campaign) => campaign.id === campaignId);
}

export function createCampaignSession(campaignId: CampaignId, unlimited = false, scenarioId?: string): CampaignSessionState | null {
  const campaignIndex = CAMPAIGN_DEFINITIONS.findIndex((campaign) => campaign.id === campaignId);
  if (campaignIndex < 0) return null;
  const campaign = CAMPAIGN_DEFINITIONS[campaignIndex];
  const scenarioIndex = Math.max(
    0,
    campaign.scenarios.findIndex((scenario) => scenario.id === scenarioId),
  );
  const scenario = campaign.scenarios[scenarioIndex] ?? campaign.scenarios[0];
  return {
    campaignId: campaign.id,
    scenarioIndex,
    scenarioId: scenario.id,
    campaignIndex,
    unlimited,
  };
}

export function getCurrentCampaignDefinition(session: CampaignSessionState | null): CampaignDefinition | null {
  if (!session) return null;
  return getCampaignDefinition(session.campaignId) ?? null;
}

export function getCurrentCampaignScenario(session: CampaignSessionState | null): CampaignScenarioDefinition | null {
  const campaign = getCurrentCampaignDefinition(session);
  if (!campaign || !session) return null;
  return campaign.scenarios[session.scenarioIndex] ?? campaign.scenarios[0] ?? null;
}

export function advanceCampaignSession(session: CampaignSessionState): CampaignSessionState {
  const currentCampaign = getCampaignDefinition(session.campaignId);
  if (!currentCampaign) return session;

  if (session.scenarioIndex < currentCampaign.scenarios.length - 1) {
    const nextScenario = currentCampaign.scenarios[session.scenarioIndex + 1];
    return {
      campaignId: currentCampaign.id,
      scenarioIndex: session.scenarioIndex + 1,
      scenarioId: nextScenario.id,
      campaignIndex: session.campaignIndex,
      unlimited: session.unlimited,
    };
  }

  const nextIndex = Math.min(session.campaignIndex + 1, CAMPAIGN_DEFINITIONS.length - 1);
  const nextCampaign = CAMPAIGN_DEFINITIONS[nextIndex];
  const nextScenario = nextCampaign.scenarios[0];
  return {
    campaignId: nextCampaign.id,
    scenarioIndex: 0,
    scenarioId: nextScenario.id,
    campaignIndex: nextIndex,
    unlimited: session.unlimited,
  };
}
