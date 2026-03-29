import {
  Scene, MeshBuilder, Vector3, StandardMaterial, Color3, Mesh,
} from "@babylonjs/core";
import type { UnitDefinition } from "../data/unitDefinitions";
import { getRagdollProfile } from "../data/combatProfiles";
import { FACTION_COLORS, TEAM_COLORS } from "../data/factionColors";
import { buildArticulatedBody } from "./bodyBuilder";
import { getUnitVisual } from "./unitVisuals";
import { attachProps } from "./propBuilder";
import { isVehicleUnit, buildVehicleBody } from "./vehicleBuilder";
import { RuntimeUnit } from "./runtimeUnit";

export class UnitFactory {
  private _scene: Scene;

  constructor(scene: Scene) {
    this._scene = scene;
  }

  spawn(definition: UnitDefinition, team: number, position: Vector3): RuntimeUnit {
    const ragdoll = getRagdollProfile(definition.ragdollProfileId);
    const visual = getUnitVisual(definition.id);

    // Compute body color: blend faction + team
    const factionColor = FACTION_COLORS[definition.faction] ?? new Color3(0.5, 0.5, 0.5);
    const teamColor = TEAM_COLORS[team] ?? new Color3(0.5, 0.5, 0.5);
    const bodyColor = Color3.Lerp(factionColor, teamColor, 0.35);

    let body;
    let propMeshes: Mesh[] = [];

    if (isVehicleUnit(definition.id)) {
      // Build as vehicle/equipment instead of humanoid
      body = buildVehicleBody(this._scene, definition.id, bodyColor);
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

    body.root.position = position.clone();
    // Face the border: blue (team 0) faces right (+X), red (team 1) faces left (-X)
    body.root.rotation.y = team === 0 ? Math.PI / 2 : -Math.PI / 2;

    // Tag all meshes for raycasting
    const unit = new RuntimeUnit(definition, team, body, propMeshes, ragdoll);

    // Set animation style for special units
    if (definition.id === "tribal.mammoth") {
      unit.animator.attackStyle = "mammoth";
      unit.animator.walkStyle = "quadruped";
    }
    for (const mesh of body.allMeshes) {
      mesh.metadata = { runtimeUnit: unit };
    }

    // Health bar
    const scale = visual.proportions.scale ?? 1.0;
    const barY = isVehicleUnit(definition.id)
      ? 1.8  // vehicle units: fixed height above
      : (0.55 + 0.35 * (visual.proportions.legLength ?? 1) + 0.45 + 0.25 * (visual.proportions.headSize ?? 1) + 0.15) * scale;
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
