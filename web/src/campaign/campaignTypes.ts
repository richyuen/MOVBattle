import type { BattleMapId } from "../map/mapBuilder";

export type CampaignId =
  | "introduction"
  | "adventure"
  | "challenge"
  | "dynasty"
  | "renaissance"
  | "pirate"
  | "spooky"
  | "simulation"
  | "wild_west"
  | "legacy"
  | "fantasy_good"
  | "fantasy_evil";

export interface CampaignPlacementSpec {
  unitId: string;
  team: 0 | 1;
  position: { x: number; y?: number; z: number };
  locked?: boolean;
}

export interface CampaignRestrictions {
  budget: number;
  allowedUnitIds: string[];
}

export interface CampaignScenarioDefinition {
  id: string;
  displayName: string;
  description: string;
  mapId: BattleMapId;
  restrictions: CampaignRestrictions;
  placements: CampaignPlacementSpec[];
}

export interface CampaignDefinition {
  id: CampaignId;
  displayName: string;
  description: string;
  scenario: CampaignScenarioDefinition;
}

export interface CampaignSessionState {
  campaignId: CampaignId;
  scenarioId: string;
  campaignIndex: number;
  unlimited: boolean;
}
