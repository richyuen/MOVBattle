import {
  Scene, MeshBuilder, Vector3, StandardMaterial, Color3, Mesh,
} from "@babylonjs/core";
import type { PlacementZone } from "./placementValidator";

const MAP_WIDTH = 160;  // full X extent
const MAP_DEPTH = 120;  // full Z extent

export class AncientSandboxMapBuilder {
  private _scene: Scene;

  constructor(scene: Scene) {
    this._scene = scene;
  }

  build(): PlacementZone[] {
    this._createGround();
    this._createCenterRuins();
    this._createFlankElevations();
    this._createZoneOverlays();
    this._createZoneBorders();
    return getPlacementZones();
  }

  private _createGround(): void {
    const ground = MeshBuilder.CreateGround("ground", {
      width: MAP_WIDTH * 2, height: MAP_DEPTH * 2,
    }, this._scene);
    const mat = new StandardMaterial("sand", this._scene);
    mat.diffuseColor = new Color3(0.76, 0.7, 0.5);
    mat.specularColor = new Color3(0.1, 0.1, 0.1);
    ground.material = mat;
    ground.receiveShadows = true;
  }

  private _createCenterRuins(): void {
    const stoneMat = new StandardMaterial("stone", this._scene);
    stoneMat.diffuseColor = new Color3(0.6, 0.58, 0.52);
    stoneMat.specularColor = new Color3(0.15, 0.15, 0.15);

    this._createBlock(new Vector3(0, 1.4, 0), new Vector3(14, 2.8, 8), 0, stoneMat);
    this._createBlock(new Vector3(-12, 1.1, 6), new Vector3(8, 2.2, 5), 18, stoneMat);
    this._createBlock(new Vector3(12, 1.1, -6), new Vector3(8, 2.2, 5), -18, stoneMat);

    for (let i = 0; i < 8; i++) {
      const angle = i * 45 * Math.PI / 180;
      const pos = new Vector3(Math.cos(angle) * 18, 1.8, Math.sin(angle) * 18);
      this._createColumn(pos, 0.8, 3.6, stoneMat);
    }
  }

  private _createFlankElevations(): void {
    const stoneMat = this._scene.getMaterialByName("stone") as StandardMaterial;
    this._createBlock(new Vector3(-35, 1.5, 22), new Vector3(12, 3, 20), 0, stoneMat);
    this._createBlock(new Vector3(35, 1.5, -22), new Vector3(12, 3, 20), 0, stoneMat);
    this._createBlock(new Vector3(-35, 0.7, -20), new Vector3(18, 1.4, 14), 8, stoneMat);
    this._createBlock(new Vector3(35, 0.7, 20), new Vector3(18, 1.4, 14), -8, stoneMat);
  }

  private _createBlock(pos: Vector3, size: Vector3, yawDeg: number, mat: StandardMaterial): void {
    const box = MeshBuilder.CreateBox("ruin", { width: size.x, height: size.y, depth: size.z }, this._scene);
    box.position = pos;
    box.rotation.y = yawDeg * Math.PI / 180;
    box.material = mat;
    box.receiveShadows = true;
  }

  private _createColumn(pos: Vector3, radius: number, height: number, mat: StandardMaterial): void {
    const cyl = MeshBuilder.CreateCylinder("column", {
      diameter: radius * 2, height, tessellation: 16,
    }, this._scene);
    cyl.position = pos;
    cyl.material = mat;
    cyl.receiveShadows = true;
  }

  /** Tinted ground overlays so each half is clearly blue / red */
  private _createZoneOverlays(): void {
    const zones = getPlacementZones();
    const colors = [new Color3(0.2, 0.5, 1.0), new Color3(1.0, 0.25, 0.25)];

    for (const zone of zones) {
      const overlay = MeshBuilder.CreateGround(`zone_overlay_${zone.team}`, {
        width: zone.size.x, height: zone.size.z,
      }, this._scene);
      overlay.position = zone.center.clone();
      overlay.position.y = 0.03;
      const mat = new StandardMaterial(`zone_overlay_mat_${zone.team}`, this._scene);
      mat.diffuseColor = colors[zone.team];
      mat.alpha = 0.12;
      mat.emissiveColor = colors[zone.team].scale(0.25);
      mat.disableLighting = true;
      overlay.material = mat;
    }
  }

  /** Draw clear border lines: outer rectangle for each zone + center divider */
  private _createZoneBorders(): void {
    const zones = getPlacementZones();
    const colors = [new Color3(0.3, 0.65, 1.0), new Color3(1.0, 0.35, 0.35)];
    const borderHeight = 0.06;
    const borderThick = 0.4;

    for (const zone of zones) {
      const color = colors[zone.team];
      const hx = zone.size.x / 2;
      const hz = zone.size.z / 2;
      const cx = zone.center.x;
      const cz = zone.center.z;

      // 4 edges of the zone rectangle
      // top edge (positive Z)
      this._createBorderStrip(
        new Vector3(cx, borderHeight, cz + hz),
        zone.size.x + borderThick, borderThick, color,
      );
      // bottom edge (negative Z)
      this._createBorderStrip(
        new Vector3(cx, borderHeight, cz - hz),
        zone.size.x + borderThick, borderThick, color,
      );
      // left edge (negative X)
      this._createBorderStrip(
        new Vector3(cx - hx, borderHeight, cz),
        borderThick, zone.size.z, color,
      );
      // right edge (positive X)
      this._createBorderStrip(
        new Vector3(cx + hx, borderHeight, cz),
        borderThick, zone.size.z, color,
      );
    }

    // Center divider line (white/gold)
    this._createBorderStrip(
      new Vector3(0, borderHeight + 0.01, 0),
      0.6, MAP_DEPTH * 2, new Color3(1.0, 0.85, 0.3),
    );
  }

  private _createBorderStrip(pos: Vector3, width: number, depth: number, color: Color3): void {
    const strip = MeshBuilder.CreateGround("border", { width, height: depth }, this._scene);
    strip.position = pos;
    const mat = new StandardMaterial("border_mat", this._scene);
    mat.diffuseColor = color;
    mat.emissiveColor = color.scale(0.6);
    mat.alpha = 0.7;
    mat.disableLighting = true;
    strip.material = mat;
  }
}

/** Both zones together cover the entire map, split at x = 0 */
export function getPlacementZones(): PlacementZone[] {
  return [
    // Team A: entire left half
    { team: 0, center: new Vector3(-MAP_WIDTH / 2, 0, 0), size: new Vector3(MAP_WIDTH, 100, MAP_DEPTH * 2) },
    // Team B: entire right half
    { team: 1, center: new Vector3(MAP_WIDTH / 2, 0, 0), size: new Vector3(MAP_WIDTH, 100, MAP_DEPTH * 2) },
  ];
}
