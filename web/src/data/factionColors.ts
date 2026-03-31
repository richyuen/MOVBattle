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
  [FactionId.Tribal]: new Color3(0.55, 0.35, 0.2),   // brown
  [FactionId.Farmer]: new Color3(0.85, 0.78, 0.25),   // yellow
  [FactionId.Medieval]: new Color3(0.25, 0.4, 0.85),  // blue
  [FactionId.Ancient]: new Color3(0.8, 0.72, 0.55),   // tan
  [FactionId.Viking]: new Color3(0.2, 0.75, 0.82),    // cyan
  [FactionId.Dynasty]: new Color3(0.85, 0.2, 0.2),    // red
  [FactionId.Renaissance]: new Color3(0.15, 0.2, 0.45),// navy
  [FactionId.Pirate]: new Color3(0.5, 0.5, 0.5),      // grey
  [FactionId.Spooky]: new Color3(0.48, 0.32, 0.62),   // muted violet
  [FactionId.WildWest]: new Color3(0.72, 0.46, 0.18), // dusty orange
  [FactionId.Legacy]: new Color3(0.62, 0.62, 0.62),   // silver
  [FactionId.Good]: new Color3(0.94, 0.85, 0.52),     // gold
  [FactionId.Evil]: new Color3(0.38, 0.18, 0.18),     // crimson-brown
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
