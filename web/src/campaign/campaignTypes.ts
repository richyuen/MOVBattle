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
  /** Degrees added to the team's starting facing (+ turns the front toward +z); the battle turns the unit as usual */
  yaw?: number;
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
  ladderRole: "opener" | "pressure" | "gimmick" | "elite" | "finale";
  restrictions: CampaignRestrictions;
  placements: CampaignPlacementSpec[];
  validationTier?: "smoke" | "core";
  validationNote?: string;
  smokeAdvanceMs?: number;
  validationTags?: Array<"hazard" | "gimmick" | "finale">;
}

export interface CampaignDefinition {
  id: CampaignId;
  displayName: string;
  description: string;
  scenarios: CampaignScenarioDefinition[];
}

export interface CampaignSessionState {
  campaignId: CampaignId;
  scenarioIndex: number;
  scenarioId: string;
  campaignIndex: number;
  unlimited: boolean;
}
