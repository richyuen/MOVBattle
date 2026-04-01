import { Color3 } from "@babylonjs/core";

export enum FactionId {
  Tribal,
  Farmer,
  Medieval,
  Ancient,
  Viking,
  Dynasty,
  Renaissance,
  Pirate,
  Spooky,
  WildWest,
  Legacy,
  Good,
  Evil,
  Secret,
}

export const FACTION_COLORS: Record<FactionId, Color3> = {
  [FactionId.Tribal]: new Color3(0.6, 0.35, 0.15),    // warm brown
  [FactionId.Farmer]: new Color3(0.92, 0.84, 0.2),    // vivid yellow
  [FactionId.Medieval]: new Color3(0.2, 0.35, 0.95),  // vivid blue
  [FactionId.Ancient]: new Color3(0.85, 0.74, 0.5),   // tan
  [FactionId.Viking]: new Color3(0.15, 0.85, 0.92),   // vivid cyan
  [FactionId.Dynasty]: new Color3(0.95, 0.15, 0.15),  // vivid red
  [FactionId.Renaissance]: new Color3(0.12, 0.16, 0.55),// deep navy
  [FactionId.Pirate]: new Color3(0.5, 0.5, 0.5),      // grey
  [FactionId.Spooky]: new Color3(0.52, 0.28, 0.7),    // vivid violet
  [FactionId.WildWest]: new Color3(0.78, 0.48, 0.14), // dusty orange
  [FactionId.Legacy]: new Color3(0.62, 0.62, 0.62),   // silver
  [FactionId.Good]: new Color3(1.0, 0.9, 0.45),       // vivid gold
  [FactionId.Evil]: new Color3(0.48, 0.12, 0.12),     // deep crimson
  [FactionId.Secret]: new Color3(0.72, 0.72, 0.72),   // light gray
};

export const FACTION_NAMES: Record<FactionId, string> = {
  [FactionId.Tribal]: "Tribal",
  [FactionId.Farmer]: "Farmer",
  [FactionId.Medieval]: "Medieval",
  [FactionId.Ancient]: "Ancient",
  [FactionId.Viking]: "Viking",
  [FactionId.Dynasty]: "Dynasty",
  [FactionId.Renaissance]: "Renaissance",
  [FactionId.Pirate]: "Pirate",
  [FactionId.Spooky]: "Spooky",
  [FactionId.WildWest]: "Wild West",
  [FactionId.Legacy]: "Legacy",
  [FactionId.Good]: "Good",
  [FactionId.Evil]: "Evil",
  [FactionId.Secret]: "Secret",
};

export const TEAM_COLORS = {
  0: new Color3(0.3, 0.7, 1.0),   // Team A - blue tint
  1: new Color3(1.0, 0.3, 0.3),   // Team B - red tint
} as Record<number, Color3>;
