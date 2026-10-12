import {
  Scene, Vector3, Color3, Mesh, MeshBuilder,
  type ShadowGenerator,
} from "@babylonjs/core";
import type { UnitDefinition } from "../data/unitDefinitions";
import { getCrowdPhysicsProfile, getRagdollProfile } from "../data/combatProfiles";
import { FACTION_COLORS, FactionId, TEAM_COLORS } from "../data/factionColors";
import { buildArticulatedBody } from "./bodyBuilder";
import { getUnitVisual, type MaterialPreset, type UnitVisualConfig } from "./unitVisuals";
import { attachProps } from "./propBuilder";
import { isVehicleUnit, buildVehicleBody } from "./vehicleBuilder";
import { RuntimeUnit } from "./runtimeUnit";
import { getMaterialFactory } from "./materialFactory";
import { getLinkedActorPreset } from "./linkedActorPresets";

export interface SpawnVisualOptions {
  visualOverride?: UnitVisualConfig;
  suppressDecorativeOperators?: boolean;
  forceArticulatedBody?: boolean;
}

const TEAM_DOMINANT_BODY_PRESETS = new Set<MaterialPreset>([
  "evil_void",
  "secret_beast",
  "secret_bone",
  "secret_demon",
  "secret_ghost",
  "secret_ice",
  "secret_nature",
]);

// How much of each preset's flesh tone / cloth tone survives over the team color.
const SKIN_FLESH_WEIGHT = 0.25;
const BODY_PRESET_WEIGHT = 0.45;
// Preset metal is quartered: an unlit-environment metal body goes grey or near-black and loses its team colour.
const BODY_METAL_WEIGHT = 0.25;
// Cloth and armour are a different hue from the team-coloured skin they are worn over, not just a darker one:
// rotated away from the skin hue and a little darker, but nearly as saturated so it still reads as the team's.
const CLOTH_HUE_SHIFT = 18;
const CLOTH_SATURATION = 0.92;
const CLOTH_SHADE = 0.8;
// Trousers are a darker shade of the tunic cloth, so the legs break from the torso at the waist and from the boot at the ankle.
const TROUSER_SHADE = 0.68;
// Clothed humanoids take more of their preset's cloth tone, so the torso is a different hue from the skin.
const CLOTHED_PRESET_WEIGHT = 0.75;
// Armour is the team colour itself, only darker (TABS): a light wash of its metal, no hue rotation. More grey or a
// turn toward orange and red plate goes brown-maroon.
const ARMOUR_PRESET_WEIGHT = 0.2;
// Plate is a clearly darker value than the skin of the head and hands beside it, on top of the cloth shade.
const ARMOUR_SHADE = 0.65;
// Boots are the trouser cloth a shade darker, so the foot ends the leg and does not sit under it as a black block.
const BOOT_SHADE = 0.7;
const BARE_FOOT_SHADE = 0.85;
// Red darkened as far as blue goes brick-maroon, so warm cloth, plate, trousers and boots keep only a quarter of each darkening and stay coral.
const WARM_SHADE_KEEP = 0.25;
// ...but trousers and boots keep four fifths of theirs, so red legs step clearly down from the tunic, and warm cloth and
// plate are pushed more saturated instead of washing out to salmon.
const WARM_LEG_SHADE_KEEP = 0.8;
const WARM_SATURATION = 1.18;
// A surcoat is the team colour a shade lighter (a third of the way to cream), the full width of the chest it
// covers and long enough to hang a third of the torso's height below it as a short skirt, cinched by a dark belt.
const TABARD_COLOR = new Color3(0.93, 0.9, 0.8);
const TABARD_PALE = 0.75;
const TABARD_WIDTH = 1.02;
const TABARD_LENGTH = 1.35;
const BELT_COLOR = new Color3(0.2, 0.14, 0.1);
// Tribal units wear nothing but a hide loincloth: the only part of them that is not team-coloured skin.
const LOINCLOTH_COLOR = new Color3(0.42, 0.27, 0.15);
// ...and a dark shaggy mop of hair over the crown and the back of the head.
const TRIBAL_HAIR_COLOR = new Color3(0.16, 0.1, 0.06);

function shouldFavorTeamBodyColor(materialPreset: MaterialPreset): boolean {
  return TEAM_DOMINANT_BODY_PRESETS.has(materialPreset);
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
    const crowdPhysics = getCrowdPhysicsProfile(definition.crowdPhysicsProfileId);
    const visual = options.visualOverride ?? getUnitVisual(definition.id);
    const linkedPreset = getLinkedActorPreset(definition.id);
    const materialPreset = visual.materialPreset ?? "default";

    // Team color is the skin and dominates the body; faction color and material preset only tint it,
    // with low-skin/non-skin units biased even further toward team ownership.
    const factionColor = FACTION_COLORS[definition.faction] ?? new Color3(0.5, 0.5, 0.5);
    const teamColor = TEAM_COLORS[team] ?? new Color3(0.5, 0.5, 0.5);
    const shouldUseVehicleBody = isVehicleUnit(definition.id) && !options.forceArticulatedBody;
    const isArmored = materialPreset === "medieval_steel" || materialPreset === "ancient_bronze"
      || materialPreset === "good_gold" || materialPreset === "secret_hero" || materialPreset === "secret_holy";
    const bodyColor = Color3.Lerp(
      factionColor,
      teamColor,
      isArmored ? 0.95 : shouldUseVehicleBody || shouldFavorTeamBodyColor(materialPreset) ? 0.9 : 0.85,
    );
    const skinColor = teamColor.scale(0.9);
    const bareSkinned = definition.faction === FactionId.Tribal && !shouldFavorTeamBodyColor(materialPreset);

    let body;
    let propMeshes: Mesh[] = [];

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
        {
          detailLevel: visual.bodyDetailLevel ?? "standard",
          showNeck: true,
          showShoulderPads: isArmored,
          showBelt: isArmored,
        },
      );
      // Attach weapon, hat, shield, special props
      propMeshes = attachProps(this._scene, body, visual, visual.proportions.scale ?? 1.0, teamColor);
      // Arms are bare team-coloured skin (TABS); the torso and thighs keep the cloth or armour colour as a
      // tunic and trousers down to the ankle, and the feet are boots a shade darker than the trousers. Whole-body presets (ghost, bone, void...)
      // stay one material.
      if (bareSkinned) {
        // Bare from head to foot (TABS tribal): only the hips keep the body material, as the loincloth.
        // The hip caps are swollen so the two meet across the pelvis as one brief wrap.
        for (const mesh of body.root.getChildMeshes(false)) {
          if (mesh.material !== body.bodyMaterial || propMeshes.includes(mesh as Mesh)) continue;
          if (/_[lr]HipCap$/.test(mesh.name)) mesh.scaling.set(1.7, 1.4, 1.7);
          else mesh.material = body.skinMaterial;
        }
        // Hair mop: a coarse faceted lump a little bigger than the head, set up and back so the face stays bare.
        const headSize = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2;
        const hair = MeshBuilder.CreateSphere(`${body.headMesh.name}_hair`, { diameter: headSize * 1.14, segments: 3 }, this._scene);
        hair.position.set(0, headSize * 0.16, -headSize * 0.14);
        hair.material = getMaterialFactory().getCloth(TRIBAL_HAIR_COLOR);
        hair.convertToFlatShadedMesh();
        hair.parent = body.headMesh;
        propMeshes.push(hair);
      } else if (!shouldFavorTeamBodyColor(materialPreset)) {
        for (const limb of [body.leftUpperArm, body.rightUpperArm]) {
          limb.material = body.skinMaterial;
        }
      }
    }

    const clothed = !shouldUseVehicleBody && !shouldFavorTeamBodyColor(materialPreset);
    applyMaterialPreset(body, visual, bodyColor, skinColor, clothed ? (isArmored ? ARMOUR_PRESET_WEIGHT : CLOTHED_PRESET_WEIGHT) : BODY_PRESET_WEIGHT);
    if (bareSkinned && clothed) {
      body.bodyMaterial.baseColor = LOINCLOTH_COLOR;
      // Bare feet are a slightly darker shade of the skin, so a bare leg still ends in a foot and not a point.
      const soleMaterial = getMaterialFactory().getCloth(body.skinMaterial.baseColor.scale(BARE_FOOT_SHADE));
      for (const mesh of [...body.leftKnee.getChildMeshes(true), ...body.rightKnee.getChildMeshes(true)]) {
        if (/_[lr]FootM$/.test(mesh.name)) mesh.material = soleMaterial;
      }
    } else if (clothed) {
      // Warm cloth rotates toward orange and tan, cool cloth toward teal, so neither drifts into the other team's colour.
      const hsv = body.bodyMaterial.baseColor.toHSV();
      const cool = hsv.r > 150 && hsv.r < 300;
      const shade = (factor: number) => cool ? factor : 1 - (1 - factor) * WARM_SHADE_KEEP;
      const legShade = (factor: number) => cool ? factor : 1 - (1 - factor) * WARM_LEG_SHADE_KEEP;
      const hue = isArmored ? hsv.r : (hsv.r + (cool ? -CLOTH_HUE_SHIFT : CLOTH_HUE_SHIFT) + 360) % 360;
      const saturation = cool ? hsv.g * (isArmored ? 1 : CLOTH_SATURATION) : Math.min(1, hsv.g * WARM_SATURATION);
      body.bodyMaterial.baseColor = Color3.HSVtoRGBToRef(hue, saturation, hsv.b * shade(CLOTH_SHADE) * (isArmored ? shade(ARMOUR_SHADE) : 1), new Color3());
      const trouserMaterial = getMaterialFactory().getCloth(body.bodyMaterial.baseColor.scale(legShade(TROUSER_SHADE)));
      for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) {
        leg.material = trouserMaterial;
      }
      const bootMaterial = getMaterialFactory().getCloth(body.bodyMaterial.baseColor.scale(legShade(TROUSER_SHADE) * legShade(BOOT_SHADE)));
      for (const mesh of [...body.leftKnee.getChildMeshes(true), ...body.rightKnee.getChildMeshes(true)]) {
        if (/_[lr]FootM$/.test(mesh.name)) mesh.material = bootMaterial;
      }
    }

    // Helmed medieval men-at-arms wear a tabard: a pale slab of cloth down the chest and back, so they are two colours and not one.
    if (!shouldUseVehicleBody && definition.faction === FactionId.Medieval && (visual.hat === "great_helm" || visual.hat === "plume_helmet")) {
      // It is the torso's own tapered shape, a skin thicker front and back, so it hugs the chest, narrows with the
      // waist and ends above the hip instead of standing off the body as a board.
      const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
      const tabard = body.torsoMesh.clone("tabard");
      tabard.scaling.set(body.torsoMesh.scaling.x * TABARD_WIDTH, TABARD_LENGTH, body.torsoMesh.scaling.z * 1.06);
      tabard.position.y = body.torsoMesh.position.y + chest.y * (1 - TABARD_LENGTH) * 0.8;
      tabard.material = getMaterialFactory().getCloth(Color3.Lerp(teamColor, TABARD_COLOR, TABARD_PALE));
      propMeshes.push(tabard);
      // The belt is a thin dark band round the waist, just proud of the cloth, so the skirt below it reads as a hem.
      // It is a faceted ring of the torso's own section and not a box, whose corners stood out of the waist as a plate.
      const belt = MeshBuilder.CreateCylinder("tabardBelt", {
        diameter: Math.max(chest.x, chest.z) * 2 * body.torsoMesh.scaling.x * 0.88, height: chest.y * 0.14,
        tessellation: visual.bodyDetailLevel === "hero" ? 8 : 6,
      }, this._scene);
      belt.scaling.z = body.torsoMesh.scaling.z / body.torsoMesh.scaling.x;
      belt.parent = body.torsoMesh.parent;
      belt.position.y = body.torsoMesh.position.y - chest.y * 0.85;
      belt.material = getMaterialFactory().getCloth(BELT_COLOR);
      propMeshes.push(belt);
    }

    body.root.position = position.clone();
    // Face the border: blue (team 0) faces right (+X), red (team 1) faces left (-X)
    body.root.rotation.y = team === 0 ? Math.PI / 2 : -Math.PI / 2;

    // Tag all meshes for raycasting
    const unit = new RuntimeUnit(definition, team, body, propMeshes, visual, ragdoll, crowdPhysics);
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
      // Solid props cast too, so a shield or a spear shows in the shadow; see-through effect props do not
      for (const mesh of propMeshes) {
        if ((mesh.material?.alpha ?? 1) >= 1 && mesh.visibility >= 1) this.shadowGenerator.addShadowCaster(mesh, false);
      }
    }

    // No per-unit health bars: TABS never draws them; damage reads from the body alone.

    return unit;
  }
}

function applyMaterialPreset(
  body: ReturnType<typeof buildArticulatedBody>,
  visual: UnitVisualConfig,
  bodyColor: Color3,
  skinColor: Color3,
  presetWeight: number,
): void {
  const tint = resolveMaterialTint(visual.materialPreset ?? "default", bodyColor, skinColor, presetWeight);
  body.bodyMaterial.baseColor = tint.bodyDiffuse;
  body.bodyMaterial.emissiveColor = tint.bodyEmissive;
  body.bodyMaterial.metallic = tint.metallic * BODY_METAL_WEIGHT;
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

function resolveMaterialTint(materialPreset: MaterialPreset, bodyColor: Color3, skinColor: Color3, presetWeight: number): MaterialTint {
  const skinBase = skinColor;
  // Skin is the team color (TABS); presets only nudge it a little toward their flesh tone.
  const flesh = (target: Color3, amount: number) => Color3.Lerp(skinBase, target, amount * SKIN_FLESH_WEIGHT);
  const zero = new Color3(0, 0, 0);
  const blend = (target: Color3, amount: number) => Color3.Lerp(bodyColor, target, amount * presetWeight);
  // Defaults: cloth-like (non-metallic, fairly rough)
  const base = { metallic: 0.0, roughness: 0.9 };
  switch (materialPreset) {
    case "tribal_hide":
      return { ...base, roughness: 0.85, bodyDiffuse: blend(new Color3(0.46, 0.32, 0.2), 0.58), bodyEmissive: new Color3(0.01, 0.01, 0.0), skinDiffuse: flesh(new Color3(0.84, 0.74, 0.62), 0.16), skinEmissive: zero, alpha: 1 };
    case "medieval_steel":
      return { metallic: 0.8, roughness: 0.3, bodyDiffuse: blend(new Color3(0.62, 0.64, 0.68), 0.46), bodyEmissive: new Color3(0.01, 0.01, 0.01), skinDiffuse: flesh(new Color3(0.9, 0.84, 0.76), 0.12), skinEmissive: zero, alpha: 1 };
    case "ancient_bronze":
      return { metallic: 0.7, roughness: 0.35, bodyDiffuse: blend(new Color3(0.72, 0.56, 0.28), 0.5), bodyEmissive: new Color3(0.02, 0.01, 0.0), skinDiffuse: flesh(new Color3(0.92, 0.8, 0.68), 0.16), skinEmissive: zero, alpha: 1 };
    case "viking_fur":
      return { ...base, roughness: 0.85, bodyDiffuse: blend(new Color3(0.5, 0.4, 0.28), 0.54), bodyEmissive: zero, skinDiffuse: flesh(new Color3(0.88, 0.78, 0.68), 0.14), skinEmissive: zero, alpha: 1 };
    case "dynasty_lacquer":
      return { metallic: 0.15, roughness: 0.35, bodyDiffuse: blend(new Color3(0.62, 0.16, 0.14), 0.5), bodyEmissive: new Color3(0.02, 0.0, 0.0), skinDiffuse: flesh(new Color3(0.92, 0.84, 0.72), 0.12), skinEmissive: zero, alpha: 1 };
    case "renaissance_velvet":
      return { ...base, roughness: 0.92, bodyDiffuse: blend(new Color3(0.38, 0.32, 0.52), 0.48), bodyEmissive: new Color3(0.01, 0.01, 0.02), skinDiffuse: flesh(new Color3(0.9, 0.82, 0.74), 0.12), skinEmissive: zero, alpha: 1 };
    case "pirate_tar":
      return { metallic: 0.05, roughness: 0.7, bodyDiffuse: blend(new Color3(0.24, 0.18, 0.14), 0.62), bodyEmissive: new Color3(0.01, 0.01, 0.0), skinDiffuse: flesh(new Color3(0.84, 0.68, 0.55), 0.14), skinEmissive: zero, alpha: 1 };
    case "wildwest_leather":
      return { ...base, roughness: 0.8, bodyDiffuse: blend(new Color3(0.46, 0.3, 0.18), 0.54), bodyEmissive: zero, skinDiffuse: flesh(new Color3(0.86, 0.72, 0.6), 0.14), skinEmissive: zero, alpha: 1 };
    case "legacy_toy":
      return { metallic: 0.1, roughness: 0.5, bodyDiffuse: blend(new Color3(0.74, 0.74, 0.74), 0.4), bodyEmissive: new Color3(0.01, 0.01, 0.01), skinDiffuse: flesh(new Color3(0.92, 0.86, 0.8), 0.08), skinEmissive: zero, alpha: 1 };
    case "good_gold":
      return { metallic: 0.85, roughness: 0.2, bodyDiffuse: blend(new Color3(0.92, 0.82, 0.56), 0.48), bodyEmissive: new Color3(0.04, 0.03, 0.01), skinDiffuse: flesh(new Color3(0.98, 0.9, 0.8), 0.2), skinEmissive: zero, alpha: 1 };
    case "evil_void":
      return { metallic: 0.2, roughness: 0.6, bodyDiffuse: blend(new Color3(0.3, 0.22, 0.42), 0.62), bodyEmissive: new Color3(0.03, 0.01, 0.05), skinDiffuse: flesh(new Color3(0.82, 0.72, 0.84), 0.14), skinEmissive: zero, alpha: 0.98 };
    case "secret_hero":
      return { metallic: 0.6, roughness: 0.3, bodyDiffuse: blend(new Color3(0.92, 0.84, 0.45), 0.45), bodyEmissive: new Color3(0.08, 0.06, 0.01), skinDiffuse: flesh(new Color3(0.98, 0.92, 0.82), 0.25), skinEmissive: zero, alpha: 1 };
    case "secret_ghost":
      return { metallic: 0.1, roughness: 0.3, bodyDiffuse: blend(new Color3(0.82, 0.78, 0.96), 0.55), bodyEmissive: new Color3(0.06, 0.04, 0.08), skinDiffuse: flesh(new Color3(0.9, 0.9, 1.0), 0.4), skinEmissive: new Color3(0.02, 0.02, 0.04), alpha: 0.94 };
    case "secret_ice":
      return { metallic: 0.15, roughness: 0.2, bodyDiffuse: blend(new Color3(0.62, 0.88, 0.98), 0.6), bodyEmissive: new Color3(0.03, 0.06, 0.08), skinDiffuse: flesh(new Color3(0.88, 0.96, 1.0), 0.45), skinEmissive: zero, alpha: 1 };
    case "secret_nature":
      return { ...base, roughness: 0.85, bodyDiffuse: blend(new Color3(0.4, 0.54, 0.28), 0.6), bodyEmissive: new Color3(0.02, 0.04, 0.01), skinDiffuse: flesh(new Color3(0.68, 0.58, 0.46), 0.35), skinEmissive: zero, alpha: 1 };
    case "secret_bone":
      return { ...base, roughness: 0.5, bodyDiffuse: blend(new Color3(0.88, 0.84, 0.76), 0.58), bodyEmissive: new Color3(0.03, 0.03, 0.02), skinDiffuse: flesh(new Color3(0.92, 0.88, 0.8), 0.3), skinEmissive: zero, alpha: 1 };
    case "secret_demon":
      return { metallic: 0.3, roughness: 0.5, bodyDiffuse: blend(new Color3(0.56, 0.16, 0.12), 0.62), bodyEmissive: new Color3(0.06, 0.02, 0.01), skinDiffuse: flesh(new Color3(0.88, 0.66, 0.58), 0.15), skinEmissive: zero, alpha: 1 };
    case "secret_holy":
      return { metallic: 0.5, roughness: 0.25, bodyDiffuse: blend(new Color3(0.94, 0.9, 0.72), 0.42), bodyEmissive: new Color3(0.05, 0.04, 0.01), skinDiffuse: flesh(new Color3(0.98, 0.9, 0.8), 0.22), skinEmissive: zero, alpha: 1 };
    case "secret_bandit":
      return { ...base, roughness: 0.75, bodyDiffuse: blend(new Color3(0.24, 0.24, 0.28), 0.55), bodyEmissive: zero, skinDiffuse: flesh(new Color3(0.8, 0.66, 0.56), 0.12), skinEmissive: zero, alpha: 1 };
    case "secret_beast":
      return { ...base, roughness: 0.85, bodyDiffuse: blend(new Color3(0.48, 0.52, 0.24), 0.55), bodyEmissive: zero, skinDiffuse: flesh(new Color3(0.78, 0.68, 0.5), 0.2), skinEmissive: zero, alpha: 1 };
    case "secret_pirate":
      return { metallic: 0.05, roughness: 0.7, bodyDiffuse: blend(new Color3(0.3, 0.18, 0.14), 0.58), bodyEmissive: new Color3(0.02, 0.01, 0.0), skinDiffuse: flesh(new Color3(0.84, 0.68, 0.55), 0.14), skinEmissive: zero, alpha: 1 };
    case "secret_festive":
      return { ...base, roughness: 0.8, bodyDiffuse: blend(new Color3(0.34, 0.6, 0.28), 0.46), bodyEmissive: new Color3(0.02, 0.03, 0.01), skinDiffuse: flesh(new Color3(0.94, 0.82, 0.72), 0.12), skinEmissive: zero, alpha: 1 };
    case "secret_royal":
      return { metallic: 0.4, roughness: 0.4, bodyDiffuse: blend(new Color3(0.62, 0.18, 0.18), 0.52), bodyEmissive: new Color3(0.03, 0.01, 0.0), skinDiffuse: flesh(new Color3(0.92, 0.82, 0.74), 0.15), skinEmissive: zero, alpha: 1 };
    default:
      return { ...base, bodyDiffuse: bodyColor, bodyEmissive: zero, skinDiffuse: skinBase, skinEmissive: zero, alpha: 1 };
  }
}
