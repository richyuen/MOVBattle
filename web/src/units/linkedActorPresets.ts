import { Vector3 } from "@babylonjs/core";
import type { CompositionPartRelation } from "../data/rosterManifest";
import type {
  AttachmentPreset, HatType, MaterialPreset, PosePreset, ShieldType, SpecialType, UnitVisualConfig, WeaponType,
} from "./unitVisuals";

export type LinkedDamageRouting = "parent" | "self";

export interface LinkedActorSemantics {
  visibleActor: boolean;
  combatEmitter: boolean;
  damageRouting: LinkedDamageRouting;
  targetable: boolean;
  countsTowardVictory: boolean;
}

export interface LinkedActorSpec {
  key: string;
  label: string;
  relation: CompositionPartRelation;
  offset: Vector3;
  syncFacing?: boolean;
  semantics: LinkedActorSemantics;
  visual: UnitVisualConfig;
  hideBaseBody?: boolean;
}

export interface LinkedActorPreset {
  parentRoleLabel?: string;
  disableParentEmitter?: boolean;
  suppressParentSpecial?: boolean;
  actors: LinkedActorSpec[];
}

function visual(
  weapon: WeaponType,
  hat: HatType,
  shield: ShieldType,
  special: SpecialType,
  options: {
    proportions?: UnitVisualConfig["proportions"];
    attachmentPreset?: AttachmentPreset;
    materialPreset?: MaterialPreset;
    posePreset?: PosePreset;
    accentColor?: string;
    offhandWeapon?: WeaponType;
  } = {},
): UnitVisualConfig {
  return {
    proportions: options.proportions ?? { scale: 0.68, bulk: 0.82, headSize: 1.0 },
    weapon,
    offhandWeapon: options.offhandWeapon,
    hat,
    shield,
    special,
    accentColor: options.accentColor,
    posePreset: options.posePreset ?? "default",
    materialPreset: options.materialPreset ?? "default",
    attachmentPreset: options.attachmentPreset ?? "none",
    fxPreset: "none",
    stateVariants: {},
  };
}

const parentDamage: LinkedActorSemantics = {
  visibleActor: true,
  combatEmitter: false,
  damageRouting: "parent",
  targetable: false,
  countsTowardVictory: false,
};

const attachmentOnly: LinkedActorSemantics = {
  visibleActor: true,
  combatEmitter: false,
  damageRouting: "parent",
  targetable: false,
  countsTowardVictory: false,
};

const emittingCrew: LinkedActorSemantics = {
  visibleActor: true,
  combatEmitter: true,
  damageRouting: "parent",
  targetable: false,
  countsTowardVictory: false,
};

export const LINKED_ACTOR_PRESETS: Record<string, LinkedActorPreset> = {
  "secret.cavalry": {
    parentRoleLabel: "rider",
    suppressParentSpecial: true,
    actors: [
      {
        key: "horse",
        label: "horse",
        relation: "mount",
        offset: new Vector3(0, 0, 0),
        syncFacing: true,
        semantics: parentDamage,
        visual: visual("none", "none", "none", "mount_horse", {
          proportions: { scale: 1.3, bulk: 1.05, legLength: 0.78 },
          materialPreset: "secret_royal",
          posePreset: "mounted",
          accentColor: "#c4b28a",
        }),
        hideBaseBody: true,
      },
    ],
  },
  "secret.raptor_rider": {
    parentRoleLabel: "rider",
    suppressParentSpecial: true,
    actors: [
      {
        key: "raptor",
        label: "raptor",
        relation: "mount",
        offset: new Vector3(0, 0, 0),
        syncFacing: true,
        semantics: parentDamage,
        visual: visual("none", "none", "none", "raptor_mount", {
          proportions: { scale: 1.18, bulk: 0.9, legLength: 0.82 },
          materialPreset: "secret_beast",
          posePreset: "mounted",
          accentColor: "#8c6b45",
        }),
        hideBaseBody: true,
      },
    ],
  },
  "secret.bomb_cannon": {
    parentRoleLabel: "chassis",
    disableParentEmitter: true,
    actors: [
      {
        key: "gunner",
        label: "gunner",
        relation: "crew",
        offset: new Vector3(0.18, 0, -0.5),
        syncFacing: true,
        semantics: emittingCrew,
        visual: visual("none", "hood", "none", "none", {
          proportions: { scale: 0.7, bulk: 0.82, headSize: 1.02 },
          materialPreset: "secret_bandit",
          posePreset: "vehicle",
          accentColor: "#4a4a4a",
        }),
      },
      {
        key: "loader",
        label: "loader",
        relation: "crew",
        offset: new Vector3(-0.2, 0, -0.48),
        syncFacing: true,
        semantics: parentDamage,
        visual: visual("bomb", "bandana", "none", "none", {
          proportions: { scale: 0.66, bulk: 0.78, headSize: 1.0 },
          materialPreset: "secret_bandit",
          posePreset: "support",
          accentColor: "#5b5b5b",
        }),
      },
    ],
  },
  "secret.gatling_gun": {
    parentRoleLabel: "chassis",
    disableParentEmitter: true,
    actors: [
      {
        key: "crank_gunner",
        label: "crank gunner",
        relation: "crew",
        offset: new Vector3(-0.22, 0, -0.18),
        syncFacing: true,
        semantics: emittingCrew,
        visual: visual("none", "captain_hat", "none", "none", {
          proportions: { scale: 0.7, bulk: 0.82, headSize: 1.02 },
          materialPreset: "secret_pirate",
          posePreset: "vehicle",
          accentColor: "#6f5f48",
        }),
      },
      {
        key: "loader",
        label: "loader",
        relation: "crew",
        offset: new Vector3(0.22, 0, -0.18),
        syncFacing: true,
        semantics: parentDamage,
        visual: visual("none", "bandana", "none", "none", {
          proportions: { scale: 0.66, bulk: 0.78, headSize: 1.0 },
          materialPreset: "secret_pirate",
          posePreset: "vehicle",
          accentColor: "#6f5f48",
        }),
      },
    ],
  },
  "secret.bank_robbers": {
    parentRoleLabel: "lead robber",
    suppressParentSpecial: true,
    actors: [
      {
        key: "safe",
        label: "safe",
        relation: "attachment",
        offset: new Vector3(0, 0, 0),
        syncFacing: true,
        semantics: attachmentOnly,
        visual: visual("none", "none", "none", "safe_bundle", {
          proportions: { scale: 0.95, bulk: 0.95 },
          materialPreset: "secret_bandit",
          posePreset: "support",
          accentColor: "#5b5b5b",
        }),
        hideBaseBody: true,
      },
      {
        key: "flank_robber",
        label: "flank robber",
        relation: "crew",
        offset: new Vector3(-0.46, 0, -0.08),
        syncFacing: true,
        semantics: emittingCrew,
        visual: visual("flintlock", "bandana", "none", "none", {
          proportions: { scale: 0.78, bulk: 0.82, headSize: 1.0 },
          materialPreset: "secret_bandit",
          posePreset: "duelist",
          accentColor: "#5b5b5b",
        }),
      },
    ],
  },
  "secret.wheelbarrow_dragon": {
    parentRoleLabel: "driver",
    disableParentEmitter: true,
    suppressParentSpecial: true,
    actors: [
      {
        key: "wheelbarrow_cart",
        label: "wheelbarrow cart",
        relation: "attachment",
        offset: new Vector3(0, 0, 0),
        syncFacing: true,
        semantics: attachmentOnly,
        visual: visual("none", "none", "none", "dragon_cart", {
          proportions: { scale: 1.18, bulk: 1.0 },
          materialPreset: "secret_beast",
          posePreset: "mounted",
          accentColor: "#7f4c2c",
          attachmentPreset: "dragon_cart_fx",
        }),
        hideBaseBody: true,
      },
      {
        key: "dragon_head",
        label: "dragon head",
        relation: "mount",
        offset: new Vector3(0, 0.05, 0.42),
        syncFacing: true,
        semantics: {
          ...attachmentOnly,
          combatEmitter: true,
        },
        visual: visual("none", "none", "none", "dragon_cart", {
          proportions: { scale: 0.7, bulk: 0.65 },
          materialPreset: "secret_beast",
          posePreset: "beast",
          accentColor: "#7f4c2c",
        }),
        hideBaseBody: true,
      },
    ],
  },
  "secret.clams": {
    parentRoleLabel: "bomb diver",
    suppressParentSpecial: true,
    actors: [
      {
        key: "clam_shell",
        label: "clam shell",
        relation: "attachment",
        offset: new Vector3(0, 0, 0),
        syncFacing: true,
        semantics: attachmentOnly,
        visual: visual("none", "none", "none", "clam_shell", {
          proportions: { scale: 1.0, bulk: 1.0 },
          materialPreset: "secret_holy",
          posePreset: "support",
          accentColor: "#8db4be",
          attachmentPreset: "summoner",
        }),
        hideBaseBody: true,
      },
    ],
  },
};

export function getLinkedActorPreset(unitId: string): LinkedActorPreset | undefined {
  return LINKED_ACTOR_PRESETS[unitId];
}
