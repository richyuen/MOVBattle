import {
  Scene, MeshBuilder, Vector3, StandardMaterial, Color3, Mesh,
} from "@babylonjs/core";
import type { PlacementZone } from "./placementValidator";
import type { Obstacle } from "./obstacles";

const MAP_WIDTH = 160;  // full X extent
const MAP_DEPTH = 120;  // full Z extent

export interface MapBuildResult {
  zones: PlacementZone[];
  obstacles: Obstacle[];
}

export class TribalSandboxMapBuilder {
  private _scene: Scene;
  private _obstacles: Obstacle[] = [];

  constructor(scene: Scene) {
    this._scene = scene;
  }

  build(): MapBuildResult {
    this._createMaterials();
    this._createGround();
    this._createMountains();
    this._createRocks();
    this._createTrees();
    this._createZoneOverlays();
    this._createZoneBorders();
    return { zones: getPlacementZones(), obstacles: this._obstacles };
  }

  private _createMaterials(): void {
    // Grass
    const grass = new StandardMaterial("grass", this._scene);
    grass.diffuseColor = new Color3(0.55, 0.65, 0.25);
    grass.specularColor = new Color3(0.05, 0.05, 0.05);

    // Warm orange-grass for edges
    const dryGrass = new StandardMaterial("dryGrass", this._scene);
    dryGrass.diffuseColor = new Color3(0.72, 0.62, 0.30);
    dryGrass.specularColor = new Color3(0.05, 0.05, 0.05);

    // Mountain rock
    const rock = new StandardMaterial("rock", this._scene);
    rock.diffuseColor = new Color3(0.50, 0.45, 0.38);
    rock.specularColor = new Color3(0.08, 0.08, 0.08);

    // Dark rock
    const darkRock = new StandardMaterial("darkRock", this._scene);
    darkRock.diffuseColor = new Color3(0.38, 0.35, 0.30);
    darkRock.specularColor = new Color3(0.06, 0.06, 0.06);

    // Tree trunk
    const trunk = new StandardMaterial("trunk", this._scene);
    trunk.diffuseColor = new Color3(0.45, 0.30, 0.15);
    trunk.specularColor = new Color3(0.03, 0.03, 0.03);

    // Tree leaves
    const leaves = new StandardMaterial("leaves", this._scene);
    leaves.diffuseColor = new Color3(0.35, 0.55, 0.18);
    leaves.specularColor = new Color3(0.03, 0.03, 0.03);

    // Dark leaves
    const darkLeaves = new StandardMaterial("darkLeaves", this._scene);
    darkLeaves.diffuseColor = new Color3(0.25, 0.42, 0.12);
    darkLeaves.specularColor = new Color3(0.03, 0.03, 0.03);
  }

  private _createGround(): void {
    // Main ground — warm green-orange grass
    const ground = MeshBuilder.CreateGround("ground", {
      width: MAP_WIDTH * 2, height: MAP_DEPTH * 2,
    }, this._scene);
    const mat = new StandardMaterial("groundMat", this._scene);
    mat.diffuseColor = new Color3(0.60, 0.58, 0.30);
    mat.specularColor = new Color3(0.05, 0.05, 0.05);
    ground.material = mat;
    ground.receiveShadows = true;

    // Center grass patch — greener in the middle
    const centerGrass = MeshBuilder.CreateGround("centerGrass", {
      width: 100, height: 80,
    }, this._scene);
    centerGrass.position.y = 0.02;
    centerGrass.material = this._scene.getMaterialByName("grass")!;
    centerGrass.receiveShadows = true;
  }

  private _createMountains(): void {
    const rock = this._scene.getMaterialByName("rock") as StandardMaterial;
    const darkRock = this._scene.getMaterialByName("darkRock") as StandardMaterial;
    const dryGrass = this._scene.getMaterialByName("dryGrass") as StandardMaterial;

    // ── Back mountains (positive Z, far edge) ──
    this._createMountain(new Vector3(-50, 0, 55), 35, 22, 20, rock);
    this._createMountain(new Vector3(-20, 0, 60), 28, 18, 18, darkRock);
    this._createMountain(new Vector3(15, 0, 58), 32, 25, 22, rock);
    this._createMountain(new Vector3(50, 0, 55), 30, 20, 18, darkRock);

    // ── Front mountains (negative Z, near edge) ──
    this._createMountain(new Vector3(-55, 0, -55), 30, 18, 20, rock);
    this._createMountain(new Vector3(-20, 0, -60), 25, 16, 16, darkRock);
    this._createMountain(new Vector3(20, 0, -58), 28, 20, 18, rock);
    this._createMountain(new Vector3(55, 0, -55), 32, 22, 20, darkRock);

    // ── Side mountains (left edge) ──
    this._createMountain(new Vector3(-75, 0, -20), 25, 20, 22, rock);
    this._createMountain(new Vector3(-78, 0, 15), 22, 18, 20, darkRock);
    this._createMountain(new Vector3(-72, 0, 40), 20, 15, 18, rock);

    // ── Side mountains (right edge) ──
    this._createMountain(new Vector3(75, 0, -20), 25, 20, 22, darkRock);
    this._createMountain(new Vector3(78, 0, 15), 22, 18, 20, rock);
    this._createMountain(new Vector3(72, 0, 40), 20, 15, 18, darkRock);

    // ── Grassy hills (smaller, in play area for variety) ──
    this._createHill(new Vector3(-40, 0, 30), 12, 4, 10, dryGrass);
    this._createHill(new Vector3(40, 0, -30), 12, 4, 10, dryGrass);
    this._createHill(new Vector3(-35, 0, -25), 10, 3, 8, dryGrass);
    this._createHill(new Vector3(35, 0, 25), 10, 3, 8, dryGrass);
  }

  private _createMountain(
    pos: Vector3, diameterX: number, height: number, diameterZ: number,
    mat: StandardMaterial,
  ): void {
    // Use a cone for the main mountain shape
    const cone = MeshBuilder.CreateCylinder("mountain", {
      diameterTop: 0, diameterBottom: 1, height: 1, tessellation: 8,
    }, this._scene);
    cone.scaling.set(diameterX, height, diameterZ);
    cone.position.set(pos.x, height / 2, pos.z);
    cone.material = mat;
    cone.receiveShadows = true;

    // Add collision — approximate as a cylinder covering the base
    const collisionRadius = Math.min(diameterX, diameterZ) * 0.35;
    this._obstacles.push({
      type: "cylinder",
      center: new Vector3(pos.x, 0, pos.z),
      radius: collisionRadius,
    });
  }

  private _createHill(
    pos: Vector3, diameterX: number, height: number, diameterZ: number,
    mat: StandardMaterial,
  ): void {
    // Wider, flatter mound — units can walk close but not through
    const mound = MeshBuilder.CreateCylinder("hill", {
      diameterTop: 0.3, diameterBottom: 1, height: 1, tessellation: 12,
    }, this._scene);
    mound.scaling.set(diameterX, height, diameterZ);
    mound.position.set(pos.x, height / 2, pos.z);
    mound.material = mat;
    mound.receiveShadows = true;

    // Smaller collision since hills are walkable near edges
    const collisionRadius = Math.min(diameterX, diameterZ) * 0.25;
    this._obstacles.push({
      type: "cylinder",
      center: new Vector3(pos.x, 0, pos.z),
      radius: collisionRadius,
    });
  }

  private _createRocks(): void {
    const rock = this._scene.getMaterialByName("rock") as StandardMaterial;
    const darkRock = this._scene.getMaterialByName("darkRock") as StandardMaterial;

    // Scattered boulders in the play area
    const boulders: { pos: Vector3; size: number; mat: StandardMaterial }[] = [
      { pos: new Vector3(-15, 0, 15), size: 2.5, mat: rock },
      { pos: new Vector3(18, 0, -12), size: 3.0, mat: darkRock },
      { pos: new Vector3(-25, 0, -8), size: 2.0, mat: rock },
      { pos: new Vector3(28, 0, 10), size: 2.8, mat: darkRock },
      { pos: new Vector3(0, 0, 20), size: 2.2, mat: rock },
      { pos: new Vector3(5, 0, -18), size: 1.8, mat: darkRock },
      { pos: new Vector3(-45, 0, 5), size: 3.0, mat: rock },
      { pos: new Vector3(45, 0, -5), size: 3.0, mat: darkRock },
      // Near edges
      { pos: new Vector3(-60, 0, 35), size: 4.0, mat: rock },
      { pos: new Vector3(60, 0, -35), size: 4.0, mat: darkRock },
      { pos: new Vector3(-55, 0, -40), size: 3.5, mat: darkRock },
      { pos: new Vector3(55, 0, 40), size: 3.5, mat: rock },
    ];

    for (const b of boulders) {
      this._createBoulder(b.pos, b.size, b.mat);
    }
  }

  private _createBoulder(pos: Vector3, size: number, mat: StandardMaterial): void {
    const rock = MeshBuilder.CreateSphere("boulder", {
      diameter: size, segments: 6,
    }, this._scene);
    // Slightly squished to look more natural
    rock.scaling.set(1.0, 0.7, 1.1);
    rock.position.set(pos.x, size * 0.25, pos.z);
    rock.material = mat;
    rock.receiveShadows = true;

    this._obstacles.push({
      type: "cylinder",
      center: new Vector3(pos.x, 0, pos.z),
      radius: size * 0.5,
    });
  }

  private _createTrees(): void {
    const trunk = this._scene.getMaterialByName("trunk") as StandardMaterial;
    const leaves = this._scene.getMaterialByName("leaves") as StandardMaterial;
    const darkLeaves = this._scene.getMaterialByName("darkLeaves") as StandardMaterial;

    // Trees scattered around edges and some in the play area
    const trees: { pos: Vector3; height: number; leafMat: StandardMaterial }[] = [
      // Left side cluster
      { pos: new Vector3(-65, 0, -5), height: 10, leafMat: leaves },
      { pos: new Vector3(-62, 0, 5), height: 8, leafMat: darkLeaves },
      { pos: new Vector3(-68, 0, -12), height: 12, leafMat: leaves },
      { pos: new Vector3(-60, 0, 25), height: 9, leafMat: darkLeaves },
      { pos: new Vector3(-66, 0, 32), height: 11, leafMat: leaves },
      // Right side cluster
      { pos: new Vector3(65, 0, 5), height: 10, leafMat: leaves },
      { pos: new Vector3(62, 0, -5), height: 8, leafMat: darkLeaves },
      { pos: new Vector3(68, 0, 12), height: 12, leafMat: leaves },
      { pos: new Vector3(60, 0, -25), height: 9, leafMat: darkLeaves },
      { pos: new Vector3(66, 0, -32), height: 11, leafMat: leaves },
      // Back edge
      { pos: new Vector3(-35, 0, 50), height: 10, leafMat: leaves },
      { pos: new Vector3(-10, 0, 52), height: 8, leafMat: darkLeaves },
      { pos: new Vector3(30, 0, 48), height: 11, leafMat: leaves },
      { pos: new Vector3(45, 0, 50), height: 9, leafMat: darkLeaves },
      // Front edge
      { pos: new Vector3(-35, 0, -48), height: 10, leafMat: darkLeaves },
      { pos: new Vector3(10, 0, -50), height: 9, leafMat: leaves },
      { pos: new Vector3(35, 0, -48), height: 11, leafMat: darkLeaves },
      // Sparse trees in play area
      { pos: new Vector3(-30, 0, 18), height: 7, leafMat: leaves },
      { pos: new Vector3(30, 0, -18), height: 7, leafMat: darkLeaves },
      { pos: new Vector3(-20, 0, -30), height: 6, leafMat: leaves },
      { pos: new Vector3(20, 0, 30), height: 6, leafMat: darkLeaves },
    ];

    for (const t of trees) {
      this._createTree(t.pos, t.height, trunk, t.leafMat);
    }
  }

  private _createTree(
    pos: Vector3, height: number,
    trunkMat: StandardMaterial, leafMat: StandardMaterial,
  ): void {
    const trunkHeight = height * 0.45;
    const trunkRadius = height * 0.06;
    const canopyHeight = height * 0.65;
    const canopyRadius = height * 0.3;

    // Trunk
    const trunkMesh = MeshBuilder.CreateCylinder("trunk", {
      diameterTop: trunkRadius * 1.6,
      diameterBottom: trunkRadius * 2,
      height: trunkHeight,
      tessellation: 8,
    }, this._scene);
    trunkMesh.position.set(pos.x, trunkHeight / 2, pos.z);
    trunkMesh.material = trunkMat;
    trunkMesh.receiveShadows = true;

    // Canopy — cone shape
    const canopy = MeshBuilder.CreateCylinder("canopy", {
      diameterTop: 0,
      diameterBottom: canopyRadius * 2,
      height: canopyHeight,
      tessellation: 8,
    }, this._scene);
    canopy.position.set(pos.x, trunkHeight + canopyHeight * 0.4, pos.z);
    canopy.material = leafMat;
    canopy.receiveShadows = true;

    // Collision for tree trunk
    this._obstacles.push({
      type: "cylinder",
      center: new Vector3(pos.x, 0, pos.z),
      radius: trunkRadius + 0.3,
    });
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
      mat.alpha = 0.08;
      mat.emissiveColor = colors[zone.team].scale(0.15);
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
      this._createBorderStrip(
        new Vector3(cx, borderHeight, cz + hz),
        zone.size.x + borderThick, borderThick, color,
      );
      this._createBorderStrip(
        new Vector3(cx, borderHeight, cz - hz),
        zone.size.x + borderThick, borderThick, color,
      );
      this._createBorderStrip(
        new Vector3(cx - hx, borderHeight, cz),
        borderThick, zone.size.z, color,
      );
      this._createBorderStrip(
        new Vector3(cx + hx, borderHeight, cz),
        borderThick, zone.size.z, color,
      );
    }

    // Center divider line
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
