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
    const cliff = MeshBuilder.CreateRibbon("medieval1CliffFace", {
      pathArray: [
        [a, Vector3.Lerp(a, b, 0.52), b],
        [
          new Vector3(a.x * 0.95, -19, a.z * 0.95),
          new Vector3((a.x + b.x) * 0.48 + (i % 2 ? 1.4 : -1.4), -22, (a.z + b.z) * 0.48),
          new Vector3(b.x * 0.95, -19, b.z * 0.95),
        ],
      ],
      sideOrientation: Mesh.DOUBLESIDE,
    }, scene);
    cliff.convertToFlatShadedMesh();
    cliff.material = stone;
  }
}

export function buildMedieval1(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  for (const mesh of scene.meshes) {
    if (!prior.has(mesh) && /^(ground$|centerGrass$|islandUnder|islandShelf|islandCliff|fieldBlades_)/.test(mesh.name)) mesh.setEnabled(false);
  }
  const grass = new StandardMaterial("medieval1Meadow", scene);
  grass.diffuseColor = new Color3(0.48, 0.65, 0.24);
  grass.emissiveColor = grass.diffuseColor.scale(0.1);
  const stone = new StandardMaterial("medieval1Cliff", scene);
  stone.diffuseColor = new Color3(0.49, 0.47, 0.52);
  stone.emissiveColor = stone.diffuseColor.scale(0.25);
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
  const waterGap = (z: number, halfZ: number): MapBuildResult["hazards"][number] => ({
    shape: "box", kind: "water", center: new Vector3(0, 0, z), halfX: 3.75, halfZ,
  });
  return { ...result, hazards: [waterGap(-23, 20), waterGap(22.5, 17.5)] };
}
