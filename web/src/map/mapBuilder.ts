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
  dispose?: () => void;
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
    this._createGrassPatches();
    this._createScatterProps();
    this._createZoneOverlays();
    this._createZoneBorders();
    return { zones: getPlacementZones(), obstacles: this._obstacles };
  }

  private _seededValue(index: number, seed: number): number {
    const raw = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
    return raw - Math.floor(raw);
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
    const base = MeshBuilder.CreateCylinder("mountainBase", {
      diameterTop: 0.3, diameterBottom: 1, height: 1, tessellation: 8,
    }, this._scene);
    base.scaling.set(diameterX, height, diameterZ);
    base.position.set(pos.x, height / 2, pos.z);
    base.material = mat;
    base.receiveShadows = true;

    const mid = MeshBuilder.CreateCylinder("mountainMid", {
      diameterTop: 0.28, diameterBottom: 1, height: 1, tessellation: 8,
    }, this._scene);
    mid.scaling.set(diameterX * 0.6, height * 0.7, diameterZ * 0.6);
    mid.position.set(pos.x, height * 0.72, pos.z);
    mid.material = mat;
    mid.receiveShadows = true;

    const cap = MeshBuilder.CreateSphere("mountainCap", { diameter: 1, segments: 8 }, this._scene);
    cap.scaling.set(diameterX * 0.25, height * 0.18, diameterZ * 0.25);
    cap.position.set(pos.x, height * 1.02, pos.z);
    cap.material = mat;
    cap.receiveShadows = true;

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
    const mound = MeshBuilder.CreateSphere("hill", { diameter: 1, segments: 10 }, this._scene);
    mound.scaling.set(diameterX, height * 0.6, diameterZ);
    mound.position.set(pos.x, height * 0.3, pos.z);
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
      this._createTree(
        t.pos,
        t.height,
        trunk,
        t.leafMat,
        t.leafMat === leaves ? darkLeaves : leaves,
      );
    }
  }

  private _createTree(
    pos: Vector3, height: number,
    trunkMat: StandardMaterial, leafMat: StandardMaterial, upperLeafMat: StandardMaterial,
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

    const upperCanopy = MeshBuilder.CreateCylinder("canopyUpper", {
      diameterTop: 0,
      diameterBottom: canopyRadius * 1.4,
      height: canopyHeight * 0.5,
      tessellation: 8,
    }, this._scene);
    upperCanopy.position.set(pos.x, trunkHeight + canopyHeight * 0.78, pos.z);
    upperCanopy.material = upperLeafMat;
    upperCanopy.receiveShadows = true;

    // Collision for tree trunk
    this._obstacles.push({
      type: "cylinder",
      center: new Vector3(pos.x, 0, pos.z),
      radius: trunkRadius + 0.3,
    });
  }

  private _createGrassPatches(): void {
    const leaves = this._scene.getMaterialByName("leaves") as StandardMaterial;

    for (let i = 0; i < 36; i++) {
      const x = -45 + this._seededValue(i, 1) * 90;
      const z = -35 + this._seededValue(i, 2) * 70;
      const blades = 3 + Math.floor(this._seededValue(i, 3) * 2);

      for (let j = 0; j < blades; j++) {
        const blade = MeshBuilder.CreateCylinder("grassTuft", {
          height: 0.15 + this._seededValue(i * 10 + j, 4) * 0.15,
          diameterTop: 0,
          diameterBottom: 0.05 + this._seededValue(i * 10 + j, 5) * 0.03,
          tessellation: 4,
        }, this._scene);
        blade.position.set(
          x + (this._seededValue(i * 10 + j, 6) - 0.5) * 0.45,
          blade.getBoundingInfo().boundingBox.extendSize.y,
          z + (this._seededValue(i * 10 + j, 7) - 0.5) * 0.45,
        );
        blade.rotation.z = (this._seededValue(i * 10 + j, 8) - 0.5) * 0.4;
        blade.rotation.x = (this._seededValue(i * 10 + j, 9) - 0.5) * 0.25;
        blade.material = leaves;
        blade.receiveShadows = true;
      }
    }
  }

  private _createScatterProps(): void {
    const flowerColors = [
      new Color3(0.88, 0.24, 0.2),
      new Color3(0.96, 0.82, 0.28),
      new Color3(0.95, 0.95, 0.9),
    ];
    const flowerMats = flowerColors.map((color, index) => {
      const material = new StandardMaterial(`flower${index}`, this._scene);
      material.diffuseColor = color;
      material.specularColor = new Color3(0.03, 0.03, 0.03);
      return material;
    });
    const pebbleMat = new StandardMaterial("pebble", this._scene);
    pebbleMat.diffuseColor = new Color3(0.22, 0.2, 0.18);
    pebbleMat.specularColor = new Color3(0.03, 0.03, 0.03);

    for (let i = 0; i < 18; i++) {
      const flower = MeshBuilder.CreateSphere("flowerDot", {
        diameter: 0.08 + this._seededValue(i, 10) * 0.04,
        segments: 4,
      }, this._scene);
      flower.position.set(
        -45 + this._seededValue(i, 11) * 90,
        0.03,
        -35 + this._seededValue(i, 12) * 70,
      );
      flower.material = flowerMats[i % flowerMats.length];
    }

    for (let i = 0; i < 11; i++) {
      const pebbleSize = 0.1 + this._seededValue(i, 13) * 0.1;
      const pebble = MeshBuilder.CreateSphere("pebble", {
        diameter: pebbleSize,
        segments: 5,
      }, this._scene);
      pebble.scaling.set(
        1 + this._seededValue(i, 14) * 0.3,
        0.45 + this._seededValue(i, 15) * 0.2,
        0.8 + this._seededValue(i, 16) * 0.3,
      );
      pebble.position.set(
        -45 + this._seededValue(i, 17) * 90,
        0.03,
        -35 + this._seededValue(i, 18) * 70,
      );
      pebble.material = pebbleMat;
      pebble.receiveShadows = true;
    }
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

export interface BattleMapInstance extends MapBuildResult {
  id: BattleMapId;
  displayName: string;
  dispose: () => void;
}

export interface BattleMapDefinition {
  id: BattleMapId;
  displayName: string;
  build: (scene: Scene) => BattleMapInstance;
}

export type BattleMapId =
  | "sandbox.tribal"
  | "campaign.introduction"
  | "campaign.adventure"
  | "campaign.challenge"
  | "campaign.dynasty"
  | "campaign.renaissance"
  | "campaign.pirate"
  | "campaign.spooky"
  | "campaign.simulation"
  | "campaign.wild_west"
  | "campaign.legacy"
  | "campaign.fantasy_good"
  | "campaign.fantasy_evil";

interface CampaignPropSpec {
  kind: "tree" | "ruin" | "lantern" | "column" | "bones" | "crystal" | "cactus" | "ship" | "totem" | "barricade";
  x: number;
  z: number;
  scale?: number;
  rotationY?: number;
  blocking?: boolean;
}

interface CampaignMapTheme {
  displayName: string;
  clearColor: Color3;
  fogColor: Color3;
  ground: Color3;
  grass: Color3;
  accent: Color3;
  props: CampaignPropSpec[];
}

function trackMapBuild(scene: Scene, id: BattleMapId, displayName: string, build: () => MapBuildResult): BattleMapInstance {
  const priorMeshes = new Set(scene.meshes);
  const priorMaterials = new Set(scene.materials);
  const result = build();
  const createdMeshes = scene.meshes.filter((mesh) => !priorMeshes.has(mesh));
  const createdMaterials = scene.materials.filter((material) => !priorMaterials.has(material));
  return {
    ...result,
    id,
    displayName,
    dispose: () => {
      result.dispose?.();
      for (const mesh of createdMeshes) {
        if (!mesh.isDisposed()) mesh.dispose(false, true);
      }
      for (const material of createdMaterials) {
        material.dispose(true, true);
      }
    },
  };
}

function recolorBaseTerrain(scene: Scene, theme: CampaignMapTheme): void {
  scene.clearColor.set(theme.clearColor.r, theme.clearColor.g, theme.clearColor.b, 1);
  scene.fogColor = theme.fogColor;
  const groundMat = scene.getMaterialByName("groundMat") as StandardMaterial | null;
  if (groundMat) groundMat.diffuseColor = theme.ground;
  const grassMat = scene.getMaterialByName("grass") as StandardMaterial | null;
  if (grassMat) grassMat.diffuseColor = theme.grass;
  const dryGrassMat = scene.getMaterialByName("dryGrass") as StandardMaterial | null;
  if (dryGrassMat) dryGrassMat.diffuseColor = Color3.Lerp(theme.ground, theme.grass, 0.45);
}

function addCampaignProps(scene: Scene, theme: CampaignMapTheme, obstacles: Obstacle[]): void {
  const accentMat = new StandardMaterial(`${theme.displayName}_accent`, scene);
  accentMat.diffuseColor = theme.accent;
  accentMat.specularColor = new Color3(0.04, 0.04, 0.04);
  const darkMat = new StandardMaterial(`${theme.displayName}_dark`, scene);
  darkMat.diffuseColor = theme.accent.scale(0.45);
  darkMat.specularColor = new Color3(0.04, 0.04, 0.04);
  const trunkMat = new StandardMaterial(`${theme.displayName}_trunk`, scene);
  trunkMat.diffuseColor = new Color3(0.43, 0.28, 0.14);
  trunkMat.specularColor = new Color3(0.03, 0.03, 0.03);
  const canopyMat = new StandardMaterial(`${theme.displayName}_canopy`, scene);
  canopyMat.diffuseColor = theme.grass.scale(0.8);
  canopyMat.specularColor = new Color3(0.03, 0.03, 0.03);

  const addCylinderObstacle = (
    x: number,
    z: number,
    radius: number,
    height: number,
    material = accentMat,
    blocking = true,
  ) => {
    const mesh = MeshBuilder.CreateCylinder(`${theme.displayName}_cyl`, {
      height,
      diameter: radius * 2,
      tessellation: 8,
    }, scene);
    mesh.position = new Vector3(x, height / 2, z);
    mesh.material = material;
    mesh.receiveShadows = true;
    if (blocking) {
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: radius * 0.8 });
    }
  };
  const addBoxObstacle = (
    x: number,
    z: number,
    width: number,
    depth: number,
    height: number,
    material = darkMat,
    blocking = true,
    rotationY = 0,
  ) => {
    const mesh = MeshBuilder.CreateBox(`${theme.displayName}_box`, {
      width,
      depth,
      height,
    }, scene);
    mesh.position = new Vector3(x, height / 2, z);
    mesh.rotation.y = rotationY;
    mesh.material = material;
    mesh.receiveShadows = true;
    if (blocking) {
      obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: width / 2, halfZ: depth / 2 });
    }
  };
  const addTree = (x: number, z: number, scale = 1, blocking = true) => {
    const trunk = MeshBuilder.CreateCylinder(`${theme.displayName}_tree_trunk`, {
      height: 5 * scale,
      diameterTop: 0.7 * scale,
      diameterBottom: 0.9 * scale,
    }, scene);
    trunk.position = new Vector3(x, 2.5 * scale, z);
    trunk.material = trunkMat;
    trunk.receiveShadows = true;
    const canopy = MeshBuilder.CreateSphere(`${theme.displayName}_tree_canopy`, { diameter: 4.5 * scale, segments: 6 }, scene);
    canopy.position = new Vector3(x, 5.7 * scale, z);
    canopy.scaling.y = 0.8;
    canopy.material = canopyMat;
    canopy.receiveShadows = true;
    if (blocking) {
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 1.4 * scale });
    }
  };
  const addLantern = (x: number, z: number, scale = 1, blocking = true) => {
    addCylinderObstacle(x, z, 0.35 * scale, 5 * scale, trunkMat, blocking);
    const glow = MeshBuilder.CreateSphere(`${theme.displayName}_lantern_glow`, { diameter: 1.1 * scale, segments: 6 }, scene);
    glow.position = new Vector3(x, 5.4 * scale, z);
    glow.material = accentMat;
    glow.receiveShadows = true;
  };
  const addColumn = (x: number, z: number, scale = 1, blocking = true) => {
    addCylinderObstacle(x, z, 0.9 * scale, 7.5 * scale, accentMat, blocking);
    addBoxObstacle(x, z, 2.2 * scale, 2.2 * scale, 0.55 * scale, accentMat, false);
  };
  const addCrystal = (x: number, z: number, scale = 1, blocking = true) => {
    const crystal = MeshBuilder.CreateCylinder(`${theme.displayName}_crystal`, {
      height: 6 * scale,
      diameterTop: 0.2 * scale,
      diameterBottom: 2.2 * scale,
      tessellation: 6,
    }, scene);
    crystal.position = new Vector3(x, 3 * scale, z);
    crystal.rotation.z = 0.35;
    crystal.material = accentMat;
    crystal.receiveShadows = true;
    if (blocking) {
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 1.1 * scale });
    }
  };
  const addCactus = (x: number, z: number, scale = 1, blocking = true) => {
    const body = MeshBuilder.CreateCylinder(`${theme.displayName}_cactus_body`, { height: 7 * scale, diameter: 1.3 * scale }, scene);
    body.position = new Vector3(x, 3.5 * scale, z);
    body.material = accentMat;
    body.receiveShadows = true;
    const arm = MeshBuilder.CreateCylinder(`${theme.displayName}_cactus_arm`, { height: 3.2 * scale, diameter: 0.7 * scale }, scene);
    arm.position = new Vector3(x + 1.4 * scale, 4.4 * scale, z);
    arm.rotation.z = Math.PI / 2.6;
    arm.material = accentMat;
    arm.receiveShadows = true;
    if (blocking) {
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 1.1 * scale });
    }
  };
  const addRuin = (x: number, z: number, scale = 1, blocking = true) => {
    addBoxObstacle(x, z, 5 * scale, 3 * scale, 2 * scale, darkMat, blocking);
    addBoxObstacle(x - 1.4 * scale, z + 0.8 * scale, 1.2 * scale, 1.2 * scale, 6 * scale, accentMat, false);
  };
  const addBonePile = (x: number, z: number, scale = 1, blocking = true) => {
    const pile = MeshBuilder.CreateTorus(`${theme.displayName}_bones`, { diameter: 3.6 * scale, thickness: 0.5 * scale, tessellation: 8 }, scene);
    pile.position = new Vector3(x, 0.5 * scale, z);
    pile.rotation.x = Math.PI / 2.3;
    pile.material = accentMat;
    pile.receiveShadows = true;
    if (blocking) {
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 1.4 * scale });
    }
  };
  const addTotem = (x: number, z: number, scale = 1, blocking = true) => {
    addCylinderObstacle(x, z, 0.6 * scale, 5.4 * scale, darkMat, blocking);
    const topper = MeshBuilder.CreateSphere(`${theme.displayName}_totem_top`, { diameter: 1.8 * scale, segments: 6 }, scene);
    topper.position = new Vector3(x, 5.2 * scale, z);
    topper.material = accentMat;
    topper.receiveShadows = true;
  };
  const addBarricade = (x: number, z: number, scale = 1, rotationY = 0, blocking = true) => {
    addBoxObstacle(x, z, 7 * scale, 1.8 * scale, 2 * scale, darkMat, blocking, rotationY);
  };
  const addShip = (x: number, z: number, scale = 1, rotationY = 0, blocking = false) => {
    addBoxObstacle(x, z, 16 * scale, 4.5 * scale, 2.8 * scale, darkMat, blocking, rotationY);
    addBoxObstacle(x, z, 13 * scale, 3.4 * scale, 0.6 * scale, accentMat, false, rotationY);
    addCylinderObstacle(x, z, 0.25 * scale, 9 * scale, trunkMat, false);
    const sail = MeshBuilder.CreateBox(`${theme.displayName}_ship_sail`, {
      width: 0.25 * scale,
      height: 5.4 * scale,
      depth: 3.8 * scale,
    }, scene);
    sail.position = new Vector3(x + Math.sin(rotationY) * 1.2 * scale, 5.6 * scale, z + Math.cos(rotationY) * 1.2 * scale);
    sail.rotation.y = rotationY;
    sail.material = accentMat;
    sail.receiveShadows = true;
  };

  for (const prop of theme.props) {
    const scale = prop.scale ?? 1;
    const blocking = prop.blocking ?? true;
    const rotationY = prop.rotationY ?? 0;
    switch (prop.kind) {
      case "tree":
        addTree(prop.x, prop.z, scale, blocking);
        break;
      case "ruin":
        addRuin(prop.x, prop.z, scale, blocking);
        break;
      case "lantern":
        addLantern(prop.x, prop.z, scale, blocking);
        break;
      case "column":
        addColumn(prop.x, prop.z, scale, blocking);
        break;
      case "bones":
        addBonePile(prop.x, prop.z, scale, blocking);
        break;
      case "crystal":
        addCrystal(prop.x, prop.z, scale, blocking);
        break;
      case "cactus":
        addCactus(prop.x, prop.z, scale, blocking);
        break;
      case "ship":
        addShip(prop.x, prop.z, scale, rotationY, blocking);
        break;
      case "totem":
        addTotem(prop.x, prop.z, scale, blocking);
        break;
      case "barricade":
        addBarricade(prop.x, prop.z, scale, rotationY, blocking);
        break;
    }
  }
}


function buildCampaignBattlefield(scene: Scene, theme: CampaignMapTheme): MapBuildResult {
  const base = new TribalSandboxMapBuilder(scene).build();
  const obstacles = [...base.obstacles];
  recolorBaseTerrain(scene, theme);
  addCampaignProps(scene, theme, obstacles);
  return {
    zones: base.zones,
    obstacles,
  };
}

function restoreSandboxSceneLook(scene: Scene): void {
  scene.clearColor.set(0.52, 0.72, 0.90, 1);
  scene.fogColor = new Color3(0.52, 0.72, 0.90);
}

const campaignThemes: Record<Exclude<BattleMapId, "sandbox.tribal">, CampaignMapTheme> = {
  "campaign.introduction": {
    displayName: "Introduction Grounds",
    clearColor: new Color3(0.64, 0.79, 0.94),
    fogColor: new Color3(0.64, 0.79, 0.94),
    ground: new Color3(0.62, 0.59, 0.32),
    grass: new Color3(0.52, 0.67, 0.29),
    accent: new Color3(0.92, 0.82, 0.38),
    props: [
      { kind: "tree", x: -26, z: -26, scale: 1.1 },
      { kind: "tree", x: -24, z: 24, scale: 1.1 },
      { kind: "totem", x: 22, z: 0, scale: 1.15 },
      { kind: "barricade", x: 10, z: 16, scale: 0.9, rotationY: 0.18 },
    ],
  },
  "campaign.adventure": {
    displayName: "Adventure Wilds",
    clearColor: new Color3(0.52, 0.76, 0.72),
    fogColor: new Color3(0.52, 0.76, 0.72),
    ground: new Color3(0.42, 0.46, 0.24),
    grass: new Color3(0.28, 0.43, 0.18),
    accent: new Color3(0.78, 0.68, 0.34),
    props: [
      { kind: "tree", x: -28, z: -24, scale: 1.15 },
      { kind: "tree", x: -22, z: 22, scale: 1.1 },
      { kind: "tree", x: 18, z: -10, scale: 1.05 },
      { kind: "ruin", x: 22, z: 20, scale: 1.0 },
      { kind: "totem", x: 0, z: -24, scale: 1.0 },
    ],
  },
  "campaign.challenge": {
    displayName: "Challenge Bluffs",
    clearColor: new Color3(0.74, 0.68, 0.52),
    fogColor: new Color3(0.74, 0.68, 0.52),
    ground: new Color3(0.56, 0.44, 0.29),
    grass: new Color3(0.47, 0.36, 0.23),
    accent: new Color3(0.95, 0.79, 0.37),
    props: [
      { kind: "barricade", x: -6, z: -20, scale: 1.1, rotationY: 0.2 },
      { kind: "barricade", x: -4, z: 20, scale: 1.1, rotationY: -0.2 },
      { kind: "ruin", x: 22, z: 0, scale: 1.1 },
      { kind: "totem", x: -24, z: 0, scale: 1.0 },
    ],
  },
  "campaign.dynasty": {
    displayName: "Dynasty Garden",
    clearColor: new Color3(0.72, 0.76, 0.66),
    fogColor: new Color3(0.72, 0.76, 0.66),
    ground: new Color3(0.46, 0.42, 0.2),
    grass: new Color3(0.34, 0.41, 0.2),
    accent: new Color3(0.72, 0.18, 0.18),
    props: [
      { kind: "lantern", x: -20, z: -18, scale: 1.0 },
      { kind: "lantern", x: -20, z: 18, scale: 1.0 },
      { kind: "column", x: 18, z: -10, scale: 0.95 },
      { kind: "column", x: 18, z: 10, scale: 0.95 },
      { kind: "tree", x: 0, z: 24, scale: 1.0 },
    ],
  },
  "campaign.renaissance": {
    displayName: "Renaissance Terrace",
    clearColor: new Color3(0.82, 0.84, 0.9),
    fogColor: new Color3(0.82, 0.84, 0.9),
    ground: new Color3(0.66, 0.56, 0.34),
    grass: new Color3(0.5, 0.56, 0.33),
    accent: new Color3(0.95, 0.87, 0.52),
    props: [
      { kind: "column", x: -22, z: -18, scale: 1.0 },
      { kind: "column", x: -22, z: 18, scale: 1.0 },
      { kind: "column", x: 18, z: -10, scale: 0.9 },
      { kind: "column", x: 18, z: 10, scale: 0.9 },
      { kind: "ruin", x: 0, z: 24, scale: 0.9 },
    ],
  },
  "campaign.pirate": {
    displayName: "Pirate Cove",
    clearColor: new Color3(0.58, 0.76, 0.88),
    fogColor: new Color3(0.58, 0.76, 0.88),
    ground: new Color3(0.73, 0.63, 0.42),
    grass: new Color3(0.54, 0.58, 0.34),
    accent: new Color3(0.94, 0.82, 0.38),
    props: [
      { kind: "ship", x: -14, z: -24, scale: 0.98, rotationY: 0.34, blocking: false },
      { kind: "ship", x: 20, z: 20, scale: 1.02, rotationY: -2.8, blocking: false },
      { kind: "ruin", x: 24, z: -14, scale: 1.0 },
      { kind: "lantern", x: 20, z: 18, scale: 1.0 },
      { kind: "barricade", x: 4, z: 0, scale: 1.1, rotationY: 0.1 },
    ],
  },
  "campaign.spooky": {
    displayName: "Spooky Graveyard",
    clearColor: new Color3(0.3, 0.32, 0.42),
    fogColor: new Color3(0.3, 0.32, 0.42),
    ground: new Color3(0.23, 0.26, 0.23),
    grass: new Color3(0.18, 0.2, 0.18),
    accent: new Color3(0.82, 0.7, 0.38),
    props: [
      { kind: "bones", x: -22, z: -16, scale: 1.0 },
      { kind: "bones", x: -20, z: 16, scale: 1.0 },
      { kind: "totem", x: 20, z: -8, scale: 1.0 },
      { kind: "lantern", x: 18, z: 18, scale: 1.0 },
      { kind: "tree", x: 0, z: 24, scale: 0.95 },
    ],
  },
  "campaign.simulation": {
    displayName: "Simulation Arena",
    clearColor: new Color3(0.62, 0.67, 0.75),
    fogColor: new Color3(0.62, 0.67, 0.75),
    ground: new Color3(0.44, 0.44, 0.47),
    grass: new Color3(0.32, 0.34, 0.38),
    accent: new Color3(0.96, 0.84, 0.4),
    props: [
      { kind: "crystal", x: -20, z: -18, scale: 1.05 },
      { kind: "crystal", x: -20, z: 18, scale: 1.05 },
      { kind: "column", x: 18, z: -10, scale: 0.9 },
      { kind: "column", x: 18, z: 10, scale: 0.9 },
      { kind: "barricade", x: 0, z: 0, scale: 1.0 },
    ],
  },
  "campaign.wild_west": {
    displayName: "Wild West Flats",
    clearColor: new Color3(0.9, 0.76, 0.58),
    fogColor: new Color3(0.9, 0.76, 0.58),
    ground: new Color3(0.78, 0.62, 0.3),
    grass: new Color3(0.67, 0.55, 0.28),
    accent: new Color3(0.92, 0.82, 0.34),
    props: [
      { kind: "cactus", x: -24, z: -18, scale: 1.0 },
      { kind: "cactus", x: -24, z: 18, scale: 1.0 },
      { kind: "barricade", x: 16, z: -10, scale: 1.0, rotationY: 0.35 },
      { kind: "barricade", x: 18, z: 12, scale: 1.0, rotationY: -0.28 },
      { kind: "totem", x: 0, z: 22, scale: 0.95 },
    ],
  },
  "campaign.legacy": {
    displayName: "Legacy Parade Grounds",
    clearColor: new Color3(0.78, 0.8, 0.84),
    fogColor: new Color3(0.78, 0.8, 0.84),
    ground: new Color3(0.64, 0.63, 0.54),
    grass: new Color3(0.56, 0.58, 0.46),
    accent: new Color3(0.94, 0.84, 0.4),
    props: [
      { kind: "column", x: -22, z: -18, scale: 1.0 },
      { kind: "column", x: -22, z: 18, scale: 1.0 },
      { kind: "totem", x: 20, z: -10, scale: 1.0 },
      { kind: "totem", x: 20, z: 10, scale: 1.0 },
      { kind: "tree", x: 0, z: 24, scale: 0.95 },
    ],
  },
  "campaign.fantasy_good": {
    displayName: "Fantasy Good Sanctum",
    clearColor: new Color3(0.86, 0.9, 0.96),
    fogColor: new Color3(0.86, 0.9, 0.96),
    ground: new Color3(0.74, 0.7, 0.47),
    grass: new Color3(0.6, 0.66, 0.42),
    accent: new Color3(0.98, 0.95, 0.74),
    props: [
      { kind: "crystal", x: -22, z: -16, scale: 1.0 },
      { kind: "crystal", x: -22, z: 16, scale: 1.0 },
      { kind: "column", x: 18, z: -10, scale: 0.95 },
      { kind: "column", x: 18, z: 10, scale: 0.95 },
      { kind: "lantern", x: 0, z: 24, scale: 0.9 },
    ],
  },
  "campaign.fantasy_evil": {
    displayName: "Fantasy Evil Rift",
    clearColor: new Color3(0.26, 0.18, 0.2),
    fogColor: new Color3(0.26, 0.18, 0.2),
    ground: new Color3(0.2, 0.18, 0.19),
    grass: new Color3(0.16, 0.14, 0.16),
    accent: new Color3(0.86, 0.32, 0.34),
    props: [
      { kind: "bones", x: -22, z: -16, scale: 1.0 },
      { kind: "bones", x: -22, z: 16, scale: 1.0 },
      { kind: "crystal", x: 18, z: -10, scale: 0.95 },
      { kind: "crystal", x: 18, z: 10, scale: 0.95 },
      { kind: "totem", x: 0, z: 24, scale: 1.0 },
    ],
  },
};

export const DEFAULT_BATTLE_MAP_ID: BattleMapId = "sandbox.tribal";

const battleMapEntries: Array<[BattleMapId, BattleMapDefinition]> = [
  [DEFAULT_BATTLE_MAP_ID, {
    id: DEFAULT_BATTLE_MAP_ID,
    displayName: "Sandbox",
    build: (scene) => trackMapBuild(scene, DEFAULT_BATTLE_MAP_ID, "Sandbox", () => {
      restoreSandboxSceneLook(scene);
      return new TribalSandboxMapBuilder(scene).build();
    }),
  }],
  ...Object.entries(campaignThemes).map(([id, theme]) => [
    id as BattleMapId,
    {
      id: id as BattleMapId,
      displayName: theme.displayName,
      build: (scene: Scene) => trackMapBuild(scene, id as BattleMapId, theme.displayName, () => buildCampaignBattlefield(scene, theme)),
    },
  ] as [BattleMapId, BattleMapDefinition]),
];

const mapRegistry = new Map<BattleMapId, BattleMapDefinition>(battleMapEntries);

export function loadBattleMap(scene: Scene, id: string): BattleMapInstance {
  const definition = mapRegistry.get(id as BattleMapId) ?? mapRegistry.get(DEFAULT_BATTLE_MAP_ID)!;
  return definition.build(scene);
}

