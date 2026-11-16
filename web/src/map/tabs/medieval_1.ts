import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, VertexData, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

// The placement reference shows two grassy cliff shelves, a deep front inlet, and a narrow bridge.
const SHORE = [
  [-43, 12, 24], [-35, 9, 38], [-23, 7, 48], [-10, 5, 52], [-3, 4, 53],
  [5, 4, 53], [18, 6, 49], [31, 8, 40], [40, 13, 25],
] as const;
const BRIDGE_Z = 1;
const BRIDGE_DEPTH = 8;

function plateau(scene: Scene, side: number, grass: StandardMaterial, stone: StandardMaterial): void {
  const points = [
    ...SHORE.map(([z, inside]) => new Vector3(side * inside, 0, z)),
    ...[...SHORE].reverse().map(([z, , outside]) => new Vector3(side * outside, 0, z)),
  ];
  const mesh = new Mesh("medieval1Meadow", scene);
  const positions = [side * 25, 0, 0, ...points.flatMap((p) => [p.x, p.y, p.z])];
  const indices = points.flatMap((_, i) => {
    const j = (i + 1) % points.length;
    return side > 0 ? [0, j + 1, i + 1] : [0, i + 1, j + 1];
  });
  const normals: number[] = [];
  VertexData.ComputeNormals(positions, indices, normals);
  const data = new VertexData();
  data.positions = positions;
  data.indices = indices;
  data.normals = normals;
  data.applyToMesh(mesh);
  mesh.material = grass;
  mesh.receiveShadows = true;
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    const span = Vector3.Distance(a, b);
    const count = Math.ceil(span / 5);
    const nx = side * (a.z - b.z) / span, nz = side * (b.x - a.x) / span;
    for (let j = 0; j < count; j++) {
      const p = Vector3.Lerp(a, b, (j + 0.5) / count);
      const width = span / count;
      const upper = 6 + ((i * 3 + j * 5) % 7);
      for (const [height, top, offset] of [[upper, 0, 0.35], [19 - upper, -upper, 1.65 + j % 3]]) {
        const x = p.x + nx * offset, z = p.z + nz * offset;
        const shaft = MeshBuilder.CreateCylinder("medieval1CliffColumn", {
          height, diameterTop: width * 1.18, diameterBottom: width * 1.37, tessellation: 6,
        }, scene);
        shaft.scaling.z = 0.72;
        shaft.rotation.y = Math.atan2(a.z - b.z, b.x - a.x);
        shaft.position.set(x, top - height / 2, z);
        shaft.material = stone;
        shaft.convertToFlatShadedMesh();
        const cap = MeshBuilder.CreateCylinder("medieval1TurfLedge", {
          height: 0.72, diameterTop: width * 1.23, diameterBottom: width * 1.13, tessellation: 6,
        }, scene);
        cap.scaling.copyFrom(shaft.scaling);
        cap.rotation.y = shaft.rotation.y;
        cap.position.set(x, top - 0.36, z);
        cap.material = grass;
      }
    }
  }
}

export function buildMedieval1(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const detachedTrees: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (prior.has(mesh)) continue;
    if (/^(ground$|centerGrass$|islandUnder|islandShelf|islandCliff|fieldBlades_|hazeTreeline|campaign_zone_)/.test(mesh.name)) mesh.setEnabled(false);
    if (mesh.name !== "trunk") continue;
    const { x, z } = mesh.position;
    let onLand = false;
    for (let i = 1; i < SHORE.length; i++) {
      const [front, near, far] = SHORE[i - 1];
      const [back, nextNear, nextFar] = SHORE[i];
      if (z < front || z > back) continue;
      const t = (z - front) / (back - front);
      onLand = Math.abs(x) > near + (nextNear - near) * t && Math.abs(x) < far + (nextFar - far) * t;
      break;
    }
    if (!onLand) {
      detachedTrees.push(mesh.position.clone());
      mesh.setEnabled(false);
    }
  }
  const grass = new StandardMaterial("medieval1Meadow", scene);
  grass.diffuseColor = new Color3(0.48, 0.65, 0.24);
  grass.emissiveColor = grass.diffuseColor.scale(0.1);
  const stone = new StandardMaterial("medieval1Cliff", scene);
  stone.diffuseColor = new Color3(0.56, 0.55, 0.64);
  stone.emissiveColor = stone.diffuseColor.scale(0.44);
  plateau(scene, -1, grass, stone);
  plateau(scene, 1, grass, stone);

  const sea = MeshBuilder.CreateCylinder("medieval1Sea", { diameter: 260, height: 0.15, tessellation: 64 }, scene);
  sea.position.y = -17;
  const water = new StandardMaterial("medieval1Sea", scene);
  water.diffuseColor = new Color3(0.08, 0.65, 0.61);
  water.emissiveColor = new Color3(0.02, 0.22, 0.23);
  sea.material = water;
  sea.isPickable = false;

  for (let i = 0; i < 11; i++) {
    const block = MeshBuilder.CreateBox("medieval1BridgeCourse", {
      width: 1.08, height: 0.45 + Math.abs(i - 5) * 0.42, depth: BRIDGE_DEPTH,
    }, scene);
    block.position.set(i - 5, -(0.45 + Math.abs(i - 5) * 0.42) / 2, BRIDGE_Z);
    block.material = stone;
  }
  for (const z of [BRIDGE_Z - BRIDGE_DEPTH / 2, BRIDGE_Z + BRIDGE_DEPTH / 2]) {
    for (let x = -5; x <= 5; x += 2) {
      const coping = MeshBuilder.CreateBox("medieval1BridgeCoping", { width: 1.88, height: 0.52, depth: 0.46 }, scene);
      coping.position.set(x, 0.18, z);
      coping.material = stone;
    }
  }
  const hazards: MapBuildResult["hazards"] = [];
  for (const [front, back, halfX] of [[-45, -34, 9], [-34, -23, 7], [-23, -10, 5.5], [-10, -3, 4.5], [5, 18, 4.5], [18, 31, 6.8], [31, 42, 9.5]]) {
    hazards.push({ shape: "box", kind: "water", center: new Vector3(0, 0, (front + back) / 2), halfX, halfZ: (back - front) / 2 });
  }
  const obstacles = result.obstacles.filter((o) => !detachedTrees.some((p) => Math.hypot(p.x - o.center.x, p.z - o.center.z) < 0.55));
  const placementZones = result.zones.map((zone) => ({
    ...zone,
    center: new Vector3(Math.sign(zone.center.x) * 23, 0, 0),
    size: new Vector3(36, zone.size.y, 62),
  }));
  return { ...result, obstacles, hazards, placementZones };
}
