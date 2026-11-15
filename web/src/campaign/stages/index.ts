import type { CampaignId } from "../campaignTypes";
import type { TabsStageDef } from "./types";
import { STAGES as introduction } from "./introduction";
import { STAGES as adventure } from "./adventure";
import { STAGES as challenge } from "./challenge";
import { STAGES as dynasty } from "./dynasty";
import { STAGES as renaissance } from "./renaissance";
import { STAGES as pirate } from "./pirate";
import { STAGES as spooky } from "./spooky";
import { STAGES as simulation } from "./simulation";
import { STAGES as wild_west } from "./wild_west";
import { STAGES as legacy } from "./legacy";
import { STAGES as fantasy_good } from "./fantasy_good";
import { STAGES as fantasy_evil } from "./fantasy_evil";

export type { TabsStageDef } from "./types";

export const TABS_STAGES: Record<CampaignId, TabsStageDef[]> = {
  introduction,
  adventure,
  challenge,
  dynasty,
  renaissance,
  pirate,
  spooky,
  simulation,
  wild_west,
  legacy,
  fantasy_good,
  fantasy_evil,
};
