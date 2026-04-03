import {
  Scene, MeshBuilder, Vector3, Color3, Mesh,
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
import { getMaterialFactory } from "./materialFactory";

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
      const preset = visual.materialPreset ?? "default";
      const isArmored = preset === "medieval_steel" || preset === "ancient_bronze"
        || preset === "good_gold" || preset === "secret_hero" || preset === "secret_holy";
      body = buildArticulatedBody(
        this._scene,
        `${team}_${definition.id}_${Math.random().toString(36).slice(2, 6)}`,
        visual.proportions,
        bodyColor,
        {
          detailLevel: visual.bodyDetailLevel ?? "standard",
          showNeck: true,
          showShoulderPads: isArmored,
          showBelt: isArmored,
        },
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
    unit.initFxParticles(this._scene);
    if (!linkedPreset) {
      for (const part of definition.compositionParts ?? []) {
        unit.addLinkedDescriptor(part.relation, part.label, true);
      }
    }

    // Set animation style for special units
    if (definition.id === "tribal.mammoth" || definition.id === "good.sacred_elephant") {
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

    const mf = getMaterialFactory();
    const barBg = MeshBuilder.CreatePlane(`hpbg`, { width: barWidth, height: 0.06 }, this._scene);
    barBg.position.y = barY;
    barBg.billboardMode = Mesh.BILLBOARDMODE_ALL;
    barBg.parent = body.root;
    barBg.material = mf.get("unlit", new Color3(0.15, 0.15, 0.15), { emissive: new Color3(0.1, 0.1, 0.1) });

    const barFill = MeshBuilder.CreatePlane(`hpfill`, { width: barWidth, height: 0.045 }, this._scene);
    barFill.position.y = barY;
    barFill.position.z = -0.001;
    barFill.billboardMode = Mesh.BILLBOARDMODE_ALL;
    barFill.parent = body.root;
    barFill.material = mf.get("unlit", new Color3(0.2, 0.9, 0.2), { emissive: new Color3(0.1, 0.5, 0.1) });

    unit.healthBarMesh = barFill;
    unit.healthBarBg = barBg;

    return unit;
  }
}

function applyMaterialPreset(body: ReturnType<typeof buildArticulatedBody>, visual: UnitVisualConfig, bodyColor: Color3): void {
  const tint = resolveMaterialTint(visual.materialPreset ?? "default", bodyColor);
  body.bodyMaterial.baseColor = tint.bodyDiffuse;
  body.bodyMaterial.emissiveColor = tint.bodyEmissive;
  body.bodyMaterial.metallic = tint.metallic;
  body.bodyMaterial.roughness = tint.roughness;
  body.bodyMaterial.alpha = tint.alpha;
  body.skinMaterial.baseColor = tint.skinDiffuse;
  body.skinMaterial.emissiveColor = tint.skinEmissive;
}

interface MaterialTint {
  bodyDiffuse: Color3;
  bodyEmissive: Color3;
  skinDiffuse: Color3;
  skinEmissive: Color3;
  alpha: number;
  metallic: number;
  roughness: number;
}

function resolveMaterialTint(materialPreset: MaterialPreset, bodyColor: Color3): MaterialTint {
  const skinBase = new Color3(0.94, 0.90, 0.86);
  const zero = new Color3(0, 0, 0);
  const blend = (target: Color3, amount: number) => Color3.Lerp(bodyColor, target, amount);
  // Defaults: cloth-like (non-metallic, fairly rough)
  const base = { metallic: 0.0, roughness: 0.9 };
  switch (materialPreset) {
    case "tribal_hide":
      return { ...base, roughness: 0.85, bodyDiffuse: blend(new Color3(0.46, 0.32, 0.2), 0.58), bodyEmissive: new Color3(0.01, 0.01, 0.0), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.84, 0.74, 0.62), 0.16), skinEmissive: zero, alpha: 1 };
    case "medieval_steel":
      return { metallic: 0.8, roughness: 0.3, bodyDiffuse: blend(new Color3(0.62, 0.64, 0.68), 0.46), bodyEmissive: new Color3(0.01, 0.01, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.9, 0.84, 0.76), 0.12), skinEmissive: zero, alpha: 1 };
    case "ancient_bronze":
      return { metallic: 0.7, roughness: 0.35, bodyDiffuse: blend(new Color3(0.72, 0.56, 0.28), 0.5), bodyEmissive: new Color3(0.02, 0.01, 0.0), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.92, 0.8, 0.68), 0.16), skinEmissive: zero, alpha: 1 };
    case "viking_fur":
      return { ...base, roughness: 0.85, bodyDiffuse: blend(new Color3(0.5, 0.4, 0.28), 0.54), bodyEmissive: zero, skinDiffuse: Color3.Lerp(skinBase, new Color3(0.88, 0.78, 0.68), 0.14), skinEmissive: zero, alpha: 1 };
    case "dynasty_lacquer":
      return { metallic: 0.15, roughness: 0.35, bodyDiffuse: blend(new Color3(0.62, 0.16, 0.14), 0.5), bodyEmissive: new Color3(0.02, 0.0, 0.0), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.92, 0.84, 0.72), 0.12), skinEmissive: zero, alpha: 1 };
    case "renaissance_velvet":
      return { ...base, roughness: 0.92, bodyDiffuse: blend(new Color3(0.38, 0.32, 0.52), 0.48), bodyEmissive: new Color3(0.01, 0.01, 0.02), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.9, 0.82, 0.74), 0.12), skinEmissive: zero, alpha: 1 };
    case "pirate_tar":
      return { metallic: 0.05, roughness: 0.7, bodyDiffuse: blend(new Color3(0.24, 0.18, 0.14), 0.62), bodyEmissive: new Color3(0.01, 0.01, 0.0), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.84, 0.68, 0.55), 0.14), skinEmissive: zero, alpha: 1 };
    case "wildwest_leather":
      return { ...base, roughness: 0.8, bodyDiffuse: blend(new Color3(0.46, 0.3, 0.18), 0.54), bodyEmissive: zero, skinDiffuse: Color3.Lerp(skinBase, new Color3(0.86, 0.72, 0.6), 0.14), skinEmissive: zero, alpha: 1 };
    case "legacy_toy":
      return { metallic: 0.1, roughness: 0.5, bodyDiffuse: blend(new Color3(0.74, 0.74, 0.74), 0.4), bodyEmissive: new Color3(0.01, 0.01, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.92, 0.86, 0.8), 0.08), skinEmissive: zero, alpha: 1 };
    case "good_gold":
      return { metallic: 0.85, roughness: 0.2, bodyDiffuse: blend(new Color3(0.92, 0.82, 0.56), 0.48), bodyEmissive: new Color3(0.04, 0.03, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.98, 0.9, 0.8), 0.2), skinEmissive: zero, alpha: 1 };
    case "evil_void":
      return { metallic: 0.2, roughness: 0.6, bodyDiffuse: blend(new Color3(0.3, 0.22, 0.42), 0.62), bodyEmissive: new Color3(0.03, 0.01, 0.05), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.82, 0.72, 0.84), 0.14), skinEmissive: zero, alpha: 0.98 };
    case "secret_hero":
      return { metallic: 0.6, roughness: 0.3, bodyDiffuse: blend(new Color3(0.92, 0.84, 0.45), 0.45), bodyEmissive: new Color3(0.08, 0.06, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.98, 0.92, 0.82), 0.25), skinEmissive: zero, alpha: 1 };
    case "secret_ghost":
      return { metallic: 0.1, roughness: 0.3, bodyDiffuse: blend(new Color3(0.82, 0.78, 0.96), 0.55), bodyEmissive: new Color3(0.06, 0.04, 0.08), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.9, 0.9, 1.0), 0.4), skinEmissive: new Color3(0.02, 0.02, 0.04), alpha: 0.94 };
    case "secret_ice":
      return { metallic: 0.15, roughness: 0.2, bodyDiffuse: blend(new Color3(0.62, 0.88, 0.98), 0.6), bodyEmissive: new Color3(0.03, 0.06, 0.08), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.88, 0.96, 1.0), 0.45), skinEmissive: zero, alpha: 1 };
    case "secret_nature":
      return { ...base, roughness: 0.85, bodyDiffuse: blend(new Color3(0.4, 0.54, 0.28), 0.6), bodyEmissive: new Color3(0.02, 0.04, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.68, 0.58, 0.46), 0.35), skinEmissive: zero, alpha: 1 };
    case "secret_bone":
      return { ...base, roughness: 0.5, bodyDiffuse: blend(new Color3(0.88, 0.84, 0.76), 0.58), bodyEmissive: new Color3(0.03, 0.03, 0.02), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.92, 0.88, 0.8), 0.3), skinEmissive: zero, alpha: 1 };
    case "secret_demon":
      return { metallic: 0.3, roughness: 0.5, bodyDiffuse: blend(new Color3(0.56, 0.16, 0.12), 0.62), bodyEmissive: new Color3(0.06, 0.02, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.88, 0.66, 0.58), 0.15), skinEmissive: zero, alpha: 1 };
    case "secret_holy":
      return { metallic: 0.5, roughness: 0.25, bodyDiffuse: blend(new Color3(0.94, 0.9, 0.72), 0.42), bodyEmissive: new Color3(0.05, 0.04, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.98, 0.9, 0.8), 0.22), skinEmissive: zero, alpha: 1 };
    case "secret_bandit":
      return { ...base, roughness: 0.75, bodyDiffuse: blend(new Color3(0.24, 0.24, 0.28), 0.55), bodyEmissive: zero, skinDiffuse: Color3.Lerp(skinBase, new Color3(0.8, 0.66, 0.56), 0.12), skinEmissive: zero, alpha: 1 };
    case "secret_beast":
      return { ...base, roughness: 0.85, bodyDiffuse: blend(new Color3(0.48, 0.52, 0.24), 0.55), bodyEmissive: zero, skinDiffuse: Color3.Lerp(skinBase, new Color3(0.78, 0.68, 0.5), 0.2), skinEmissive: zero, alpha: 1 };
    case "secret_pirate":
      return { metallic: 0.05, roughness: 0.7, bodyDiffuse: blend(new Color3(0.3, 0.18, 0.14), 0.58), bodyEmissive: new Color3(0.02, 0.01, 0.0), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.84, 0.68, 0.55), 0.14), skinEmissive: zero, alpha: 1 };
    case "secret_festive":
      return { ...base, roughness: 0.8, bodyDiffuse: blend(new Color3(0.34, 0.6, 0.28), 0.46), bodyEmissive: new Color3(0.02, 0.03, 0.01), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.94, 0.82, 0.72), 0.12), skinEmissive: zero, alpha: 1 };
    case "secret_royal":
      return { metallic: 0.4, roughness: 0.4, bodyDiffuse: blend(new Color3(0.62, 0.18, 0.18), 0.52), bodyEmissive: new Color3(0.03, 0.01, 0.0), skinDiffuse: Color3.Lerp(skinBase, new Color3(0.92, 0.82, 0.74), 0.15), skinEmissive: zero, alpha: 1 };
    default:
      return { ...base, bodyDiffuse: bodyColor, bodyEmissive: zero, skinDiffuse: skinBase, skinEmissive: zero, alpha: 1 };
  }
}
