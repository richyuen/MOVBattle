import {
  Scene, MeshBuilder, Vector3, StandardMaterial, Color3, Mesh,
  type ShadowGenerator,
} from "@babylonjs/core";
import type { UnitDefinition } from "../data/unitDefinitions";
import { getRagdollProfile } from "../data/combatProfiles";
import { FACTION_COLORS, TEAM_COLORS } from "../data/factionColors";
import { buildArticulatedBody } from "./bodyBuilder";
import { getUnitVisual, type MaterialPreset, type UnitVisualConfig } from "./unitVisuals";
import { attachProps } from "./propBuilder";
import { isVehicleUnit, buildVehicleBody } from "./vehicleBuilder";
import { RuntimeUnit } from "./runtimeUnit";
import { getLinkedActorPreset } from "./linkedActorPresets";

export interface SpawnVisualOptions {
  visualOverride?: UnitVisualConfig;
  suppressDecorativeOperators?: boolean;
  forceArticulatedBody?: boolean;
}

export class UnitFactory {
  private _scene: Scene;
  shadowGenerator?: ShadowGenerator;

  constructor(scene: Scene) {
    this._scene = scene;
  }

  spawn(
    definition: UnitDefinition,
    team: number,
    position: Vector3,
    options: SpawnVisualOptions = {},
  ): RuntimeUnit {
    const ragdoll = getRagdollProfile(definition.ragdollProfileId);
    const visual = options.visualOverride ?? getUnitVisual(definition.id);
    const linkedPreset = getLinkedActorPreset(definition.id);

    // Compute body color: blend faction + team
    const factionColor = FACTION_COLORS[definition.faction] ?? new Color3(0.5, 0.5, 0.5);
    const teamColor = TEAM_COLORS[team] ?? new Color3(0.5, 0.5, 0.5);
    const bodyColor = Color3.Lerp(factionColor, teamColor, 0.25);

    let body;
    let propMeshes: Mesh[] = [];
    const shouldUseVehicleBody = isVehicleUnit(definition.id) && !options.forceArticulatedBody;

    if (shouldUseVehicleBody) {
      // Build as vehicle/equipment instead of humanoid
      body = buildVehicleBody(this._scene, definition.id, bodyColor, {
        showOperators: options.suppressDecorativeOperators ? false : true,
      });
    } else {
      // Build articulated humanoid body
      body = buildArticulatedBody(
        this._scene,
        `${team}_${definition.id}_${Math.random().toString(36).slice(2, 6)}`,
        visual.proportions,
        bodyColor,
      );
      // Attach weapon, hat, shield, special props
      propMeshes = attachProps(this._scene, body, visual, visual.proportions.scale ?? 1.0);
    }

    applyMaterialPreset(body, visual, bodyColor);

    body.root.position = position.clone();
    // Face the border: blue (team 0) faces right (+X), red (team 1) faces left (-X)
    body.root.rotation.y = team === 0 ? Math.PI / 2 : -Math.PI / 2;

    // Tag all meshes for raycasting
    const unit = new RuntimeUnit(definition, team, body, propMeshes, visual, ragdoll);
    if (!linkedPreset) {
      for (const part of definition.compositionParts ?? []) {
        unit.addLinkedDescriptor(part.relation, part.label, true);
      }
    }

    // Set animation style for special units
    if (definition.id === "tribal.mammoth") {
      unit.animator.attackStyle = "mammoth";
      unit.animator.walkStyle = "quadruped";
    }
    for (const mesh of [...body.allMeshes, ...propMeshes]) {
      mesh.metadata = { runtimeUnit: unit };
    }

    // Register shadow casters
    if (this.shadowGenerator) {
      for (const mesh of body.allMeshes) {
        this.shadowGenerator.addShadowCaster(mesh);
      }
    }

    // Health bar
    const barY = body.metrics.headTopY + Math.max(0.14, definition.collisionRadius * 0.32);
    const barWidth = Math.max(0.4, definition.collisionRadius * 2.2);

    const barBg = MeshBuilder.CreatePlane(`hpbg`, { width: barWidth, height: 0.06 }, this._scene);
    barBg.position.y = barY;
    barBg.billboardMode = Mesh.BILLBOARDMODE_ALL;
    barBg.parent = body.root;
    const bgMat = new StandardMaterial(`hpbg_mat`, this._scene);
    bgMat.diffuseColor = new Color3(0.15, 0.15, 0.15);
    bgMat.emissiveColor = new Color3(0.1, 0.1, 0.1);
    bgMat.disableLighting = true;
    barBg.material = bgMat;

    const barFill = MeshBuilder.CreatePlane(`hpfill`, { width: barWidth, height: 0.045 }, this._scene);
    barFill.position.y = barY;
    barFill.position.z = -0.001;
    barFill.billboardMode = Mesh.BILLBOARDMODE_ALL;
    barFill.parent = body.root;
    const fillMat = new StandardMaterial(`hpfill_mat`, this._scene);
    fillMat.diffuseColor = new Color3(0.2, 0.9, 0.2);
    fillMat.emissiveColor = new Color3(0.1, 0.5, 0.1);
    fillMat.disableLighting = true;
    barFill.material = fillMat;

    unit.healthBarMesh = barFill;
    unit.healthBarBg = barBg;

    return unit;
  }
}

function applyMaterialPreset(body: ReturnType<typeof buildArticulatedBody>, visual: UnitVisualConfig, bodyColor: Color3): void {
  const bodyTint = resolveMaterialTint(visual.materialPreset ?? "default", bodyColor);
  body.bodyMaterial.diffuseColor = bodyTint.bodyDiffuse;
  body.bodyMaterial.emissiveColor = bodyTint.bodyEmissive;
  body.bodyMaterial.alpha = bodyTint.alpha;
  body.skinMaterial.diffuseColor = bodyTint.skinDiffuse;
  body.skinMaterial.emissiveColor = bodyTint.skinEmissive;
}

function resolveMaterialTint(materialPreset: MaterialPreset, bodyColor: Color3): {
  bodyDiffuse: Color3;
  bodyEmissive: Color3;
  skinDiffuse: Color3;
  skinEmissive: Color3;
  alpha: number;
} {
  const skinBase = new Color3(0.94, 0.90, 0.86);
  const zero = new Color3(0, 0, 0);
  const blend = (target: Color3, amount: number) => Color3.Lerp(bodyColor, target, amount);
  switch (materialPreset) {
    case "secret_hero":
      return { bodyDiffuse: blend(new Color3(0.92, 0.84, 0.45), 0.45), bodyEmissive: new Color3(0.08, 0.06, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.98, 0.92, 0.82), 0.25), skinEmissive: zero, alpha: 1 };
    case "secret_ghost":
      return { bodyDiffuse: blend(new Color3(0.82, 0.78, 0.96), 0.55), bodyEmissive: new Color3(0.06, 0.04, 0.08), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.9, 0.9, 1.0), 0.4), skinEmissive: new Color3(0.02, 0.02, 0.04), alpha: 0.94 };
    case "secret_ice":
      return { bodyDiffuse: blend(new Color3(0.62, 0.88, 0.98), 0.6), bodyEmissive: new Color3(0.03, 0.06, 0.08), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.88, 0.96, 1.0), 0.45), skinEmissive: zero, alpha: 1 };
    case "secret_nature":
      return { bodyDiffuse: blend(new Color3(0.4, 0.54, 0.28), 0.6), bodyEmissive: new Color3(0.02, 0.04, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.68, 0.58, 0.46), 0.35), skinEmissive: zero, alpha: 1 };
    case "secret_bone":
      return { bodyDiffuse: blend(new Color3(0.88, 0.84, 0.76), 0.58), bodyEmissive: new Color3(0.03, 0.03, 0.02), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.92, 0.88, 0.8), 0.3), skinEmissive: zero, alpha: 1 };
    case "secret_demon":
      return { bodyDiffuse: blend(new Color3(0.56, 0.16, 0.12), 0.62), bodyEmissive: new Color3(0.06, 0.02, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.88, 0.66, 0.58), 0.15), skinEmissive: zero, alpha: 1 };
    case "secret_holy":
      return { bodyDiffuse: blend(new Color3(0.94, 0.9, 0.72), 0.42), bodyEmissive: new Color3(0.05, 0.04, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.98, 0.9, 0.8), 0.22), skinEmissive: zero, alpha: 1 };
    case "secret_bandit":
      return { bodyDiffuse: blend(new Color3(0.24, 0.24, 0.28), 0.55), bodyEmissive: zero, skinDiffuse: Color3.Lerp(skinBase, new Color3(0.8, 0.66, 0.56), 0.12), skinEmissive: zero, alpha: 1 };
    case "secret_beast":
      return { bodyDiffuse: blend(new Color3(0.48, 0.52, 0.24), 0.55), bodyEmissive: zero, skinDiffuse: Color3.Lerp(skinBase, new Color3(0.78, 0.68, 0.5), 0.2), skinEmissive: zero, alpha: 1 };
    case "secret_pirate":
      return { bodyDiffuse: blend(new Color3(0.3, 0.18, 0.14), 0.58), bodyEmissive: new Color3(0.02, 0.01, 0.0), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.84, 0.68, 0.55), 0.14), skinEmissive: zero, alpha: 1 };
    case "secret_festive":
      return { bodyDiffuse: blend(new Color3(0.34, 0.6, 0.28), 0.46), bodyEmissive: new Color3(0.02, 0.03, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.94, 0.82, 0.72), 0.12), skinEmissive: zero, alpha: 1 };
    case "secret_royal":
      return { bodyDiffuse: blend(new Color3(0.62, 0.18, 0.18), 0.52), bodyEmissive: new Color3(0.03, 0.01, 0.0), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.92, 0.82, 0.74), 0.15), skinEmissive: zero, alpha: 1 };
    default:
      return { bodyDiffuse: bodyColor, bodyEmissive: zero, skinDiffuse: skinBase, skinEmissive: zero, alpha: 1 };
  }
}
