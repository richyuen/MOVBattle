// TABS "Medieval 2" (medieval map, formerly "Castle"): a floating meadow whose back edge is a tall ruined castle, a pond at the front of
// the island, and dirt paths running in all directions across the field, the main one to the castle gate (reference/maps/wiki/medieval_2.png,
// reference/maps/meadow_medieval_2.png; card loop/cards/maps/medieval_2.md). Built on campaign.adventure (base(); the regression scenarios
// stand on that base: never edit it, dress its build here).
//
// Field layout (565), spec read off the references: the field centre is open meadow (the base's two lagoons with their water hazards and the
// plank bridge between them go); one pond lies at the front lip of the island (meadow_medieval_2.png: turquoise shallows along the front
// edge), a lobed oval 38 x 14 m centred at (-6, -39) with a pale shore, its water a hazard (three 5 m circles along it, inside the drawn
// water); pinkish dirt paths 3.4 m wide branch over the field (wiki shot): the main one from the castle gate (-10, 25) down the middle to
// the front, two branches off it to the left rim and two to the right rim, each a polyline of straight runs with round joints, stopping a few
// metres in from the rim. The stage armies (x 28..37, z -26..-6) stand on open meadow clear of the pond. All paths are drawn only (flat).
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, VertexData, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const POND = { x: -6, z: -39, rx: 19, rz: 7, lobes: 20 };
const POND_HAZARDS: Array<[number, number]> = [[-18, -39], [-6, -39], [6, -39]];
const PATH_WIDTH = 3.4;
const GATE: [number, number] = [-10, 25];
const PATHS: Array<Array<[number, number]>> = [
  [GATE, [-6, 12], [0, 0], [3, -14], [4, -29]],
  [[-6, 12], [-22, 8], [-38, 2], [-50, -4]],
  [[-6, 12], [14, 16], [32, 20], [48, 26]],
  [[0, 0], [16, -6], [34, -8], [51, -6]],
  [[3, -14], [-14, -20], [-30, -26], [-43, -31]],
];

function clearCentrePools(scene: Scene, built: Set<unknown>, result: MapBuildResult): MapBuildResult["hazards"] {
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (mesh.name.startsWith("campaign_lagoon_") || mesh.name === "Adventure Wilds_box") mesh.setEnabled(false);
  }
  return result.hazards.filter((h) => h.kind !== "water");
}

function flatDisc(scene: Scene, name: string, outline: Array<[number, number]>, cx: number, cz: number, y: number, mat: StandardMaterial): void {
  const positions = [cx, y, cz], normals = [0, 1, 0], indices: number[] = [];
  outline.forEach(([x, z], i) => {
    positions.push(cx + x, y, cz + z);
    normals.push(0, 1, 0);
    indices.push(0, 1 + ((i + 1) % outline.length), 1 + i);
  });
  const mesh = new Mesh(name, scene);
  const data = new VertexData();
  data.positions = positions;
  data.normals = normals;
  data.indices = indices;
  data.applyToMesh(mesh);
  mat.backFaceCulling = false;
  mesh.material = mat;
  mesh.receiveShadows = true;
  mesh.isPickable = false;
}

// The pond's ground is open water: ring trees standing on it or its shore (within 4 m of the drawn outline) go with their colliders, the
// haze band of crowns along the front rim goes (it is one merged mesh with the back band), and the grass blades inside it collapse
// (fieldBlades_* are plain quads, 4 vertices a blade).
function clearPondGround(scene: Scene, built: Set<unknown>, obstacles: MapBuildResult["obstacles"]): MapBuildResult["obstacles"] {
  const inPond = (x: number, z: number, grow: number) => ((x - POND.x) / (POND.rx + grow)) ** 2 + ((z - POND.z) / (POND.rz + grow)) ** 2 < 1;
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (mesh.name === "hazeTreeline") mesh.setEnabled(false);
    else if ((mesh.name === "trunk" || mesh.name === "stump") && !mesh.parent && inPond(mesh.position.x, mesh.position.z, 4)) {
      gone.push([mesh.position.x, mesh.position.z]);
      mesh.setEnabled(false);
    } else if (mesh.name.startsWith("fieldBlades_") && mesh instanceof Mesh) {
      const pos = mesh.getVerticesData("position");
      if (!pos) continue;
      mesh.computeWorldMatrix(true);
      const o = mesh.getAbsolutePosition();
      let changed = false;
      for (let q = 0; q + 12 <= pos.length; q += 12) {
        if (!inPond(pos[q] + o.x, pos[q + 2] + o.z, 1.6)) continue;
        for (let v = 3; v < 12; v += 3) {
          pos[q + v] = pos[q];
          pos[q + v + 1] = pos[q + 1];
          pos[q + v + 2] = pos[q + 2];
        }
        changed = true;
      }
      if (changed) mesh.updateVerticesData("position", pos);
    }
  }
  return obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
}

function frontPond(scene: Scene): MapBuildResult["hazards"] {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = new Color3(0.1, 0.12, 0.12);
    return m;
  };
  const outline: Array<[number, number]> = [];
  for (let i = 0; i < POND.lobes * 3; i++) {
    const a = (i / (POND.lobes * 3)) * Math.PI * 2;
    const pull = 0.88 + seeded(Math.floor(i / 3), 5) * 0.12;
    outline.push([Math.cos(a) * POND.rx * pull, Math.sin(a) * POND.rz * pull]);
  }
  const grown = (f: number, add: number) => outline.map(([x, z]): [number, number] => {
    const d = Math.hypot(x, z) || 1;
    return [x * f + (x / d) * add, z * f + (z / d) * add];
  });
  flatDisc(scene, "medieval2PondShore", grown(1, 1.6), POND.x, POND.z, 0.05, mk("medieval2PondShoreMat", new Color3(0.74, 0.86, 0.68), 0.35));
  flatDisc(scene, "medieval2PondWater", outline, POND.x, POND.z, 0.065, mk("medieval2PondWaterMat", new Color3(0.26, 0.78, 0.66), 0.4));
  flatDisc(scene, "medieval2PondDeep", grown(0.6, 0), POND.x, POND.z, 0.075, mk("medieval2PondDeepMat", new Color3(0.1, 0.56, 0.56), 0.4));
  return POND_HAZARDS.map(([x, z]) => ({ kind: "water" as const, shape: "cylinder" as const, center: new Vector3(x, 0, z), radius: 5 }));
}

function dirtPaths(scene: Scene): void {
  const mat = new StandardMaterial("medieval2PathDirt", scene);
  mat.diffuseColor = new Color3(0.55, 0.38, 0.34);
  mat.emissiveColor = new Color3(0.14, 0.09, 0.08);
  mat.specularColor = Color3.Black();
  const parts: Mesh[] = [];
  PATHS.forEach((line, p) => {
    line.forEach(([x, z], i) => {
      const joint = MeshBuilder.CreateCylinder("medieval2PathJoint", { diameter: PATH_WIDTH, height: 0.04, tessellation: 16 }, scene);
      joint.position.set(x, 0.035 + p * 0.001, z);
      parts.push(joint);
      if (i === 0) return;
      const [px, pz] = line[i - 1];
      const len = Math.hypot(x - px, z - pz);
      const run = MeshBuilder.CreateBox("medieval2PathRun", { width: len, height: 0.04, depth: PATH_WIDTH * (0.9 + seeded(p * 10 + i, 7) * 0.2) }, scene);
      run.rotation.y = -Math.atan2(z - pz, x - px);
      run.position.set((x + px) / 2, 0.035 + p * 0.001, (z + pz) / 2);
      parts.push(run);
    });
  });
  const merged = Mesh.MergeMeshes(parts, true);
  if (merged) {
    merged.name = "medieval2Paths";
    merged.material = mat;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

function castleFront(scene: Scene, obstacles: MapBuildResult["obstacles"]): void {
  const material = (name: string, color: Color3) => {
    const mat = new StandardMaterial(name, scene);
    mat.diffuseColor = color;
    mat.emissiveColor = color.scale(0.16);
    mat.specularColor = Color3.Black();
    return mat;
  };
  const stone = material("medieval2CurtainStone", new Color3(0.46, 0.45, 0.52));
  const wood = material("medieval2GateWood", new Color3(0.3, 0.15, 0.09));
  const blue = material("medieval2BannerBlue", new Color3(0.045, 0.14, 0.58));
  const gold = material("medieval2BannerTrim", new Color3(0.62, 0.45, 0.12));
  const leaves = material("medieval2WallIvy", new Color3(0.25, 0.39, 0.12));
  const box = (name: string, x: number, y: number, z: number, width: number, height: number, depth: number, mat: StandardMaterial) => {
    const mesh = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
    mesh.position.set(x, y, z);
    mesh.material = mat;
    mesh.receiveShadows = true;
    return mesh;
  };
  const [gateX, gateZ] = GATE;
  const z = gateZ + 2;
  for (const [offset, span, depth] of [[-16, 22, 6], [16, 22, 6], [-32, 10, 8], [32, 10, 8]]) {
    const x = gateX + offset;
    box("medieval2CurtainWall", x, 6, z, span, 12, depth, stone);
    obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: span / 2, halfZ: depth / 2 });
    for (let dx = -span / 2 + 0.9; dx < span / 2; dx += 2.5) {
      box("medieval2Merlon", x + dx, 12.7, z - depth / 2 + 0.8, 1.55, 1.4, 1.6, stone);
    }
  }
  box("medieval2Gatehouse", gateX, 10.4, z, 10.4, 4.8, 6, stone);
  for (const x of [-4.5, 4.5]) {
    box("medieval2GateJamb", gateX + x, 4.05, gateZ - 0.17, 1.35, 8.1, 0.62, stone);
  }
  for (let i = -4; i <= 4; i++) {
    const width = 0.87;
    const x = i * width;
    const height = 3.8 + Math.sqrt(16 - x * x);
    box("medieval2GatePlank", gateX + x, height / 2, gateZ - 0.11, width - 0.025, height, 0.5, wood);
    box("medieval2GateArch", gateX + x, (height + 8.1) / 2, gateZ - 0.17, width + 0.02, 8.1 - height, 0.62, stone);
  }
  obstacles.push({ type: "box", center: new Vector3(gateX, 0, gateZ), halfX: 4, halfZ: 0.55 });
  for (const offset of [-12, 12]) {
    box("medieval2BannerBorder", gateX + offset, 6.4, z - 3.22, 3.1, 7.4, 0.15, gold);
    box("medieval2Banner", gateX + offset, 6.4, z - 3.34, 2.75, 7.08, 0.14, blue);
    box("medieval2BannerRod", gateX + offset, 10.1, z - 3.4, 3.8, 0.19, 0.21, wood);
  }
  for (const [x, y] of [[-41, 10], [-33, 6], [-28, 10.5], [-17, 11], [2, 11], [11, 9], [21, 6]]) {
    for (let i = 0; i < 5; i++) {
      const d = seeded(i, x + 45);
      const ivy = MeshBuilder.CreateIcoSphere("medieval2WallIvy", { radius: 1.15 + d, subdivisions: 1 }, scene);
      ivy.position.set(x + i * 0.55, y - i * (0.6 + d * 0.24), z - (x < -37 || x > 17 ? 4 : 3) - 0.1);
      ivy.scaling.set(0.9, 0.7, 0.47);
      ivy.material = leaves;
    }
  }
}

function castleOaks(scene: Scene, built: Set<unknown>, obstacles: MapBuildResult["obstacles"]): MapBuildResult["obstacles"] {
  const oldTrunks: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || !/^(trunk|oakCrown|hazeTreeline)$/.test(mesh.name)) continue;
    if (mesh.name === "trunk") oldTrunks.push(mesh.position.clone());
    mesh.setEnabled(false);
  }
  const kept = obstacles.filter(({ center }) => !oldTrunks.some((p) => Math.hypot(p.x - center.x, p.z - center.z) < 0.5));
  const bark = new StandardMaterial("medieval2OakBark", scene);
  bark.diffuseColor = new Color3(0.36, 0.19, 0.11);
  bark.emissiveColor = bark.diffuseColor.scale(0.16);
  const leaves = new StandardMaterial("medieval2OakLeaves", scene);
  leaves.diffuseColor = new Color3(0.31, 0.46, 0.13);
  leaves.emissiveColor = leaves.diffuseColor.scale(0.23);
  const groves = [[-29, 24], [-40, 29], [-24, 32], [9, 28], [14, 35], [28, 36], [43, 28], [41, -30], [46, -19], [-40, -30], [-45, -24]];
  groves.forEach(([x, z], i) => {
    const h = 5.5 + seeded(i, 51) * 3.5;
    const lean = (i % 2 ? 1 : -1) * (1.1 + seeded(i, 52));
    const origin = new Vector3(x, 0, z);
    const fork = new Vector3(x + lean * 0.55, h * 0.63, z - 0.5);
    const crown = new Vector3(x + lean, h, z + 0.6);
    const path = [origin, new Vector3(x - lean * 0.34, h * 0.33, z + 0.36), fork, crown];
    const trunk = MeshBuilder.CreateTube("medieval2OakTrunk", {
      path, tessellation: 7, cap: Mesh.CAP_ALL, radiusFunction: (index) => [0.75, 0.61, 0.4, 0.18][index],
    }, scene);
    trunk.material = bark;
    for (let j = 0; j < 4; j++) {
      const angle = j * Math.PI / 2 + i;
      const tip = crown.add(new Vector3(2.1 * Math.cos(angle), -0.75 + (j % 2) * 0.85, 2.1 * Math.sin(angle)));
      const branch = MeshBuilder.CreateTube("medieval2OakBranch", {
        path: [fork, Vector3.Lerp(fork, tip, 0.58).add(new Vector3(0, -0.65, 0)), tip], tessellation: 6,
        radiusFunction: (index) => [0.35, 0.22, 0.09][index],
      }, scene);
      branch.material = bark;
      const clump = MeshBuilder.CreateIcoSphere("medieval2OakCrown", { radius: 2.1 + seeded(i * 4 + j, 53) * 0.9, subdivisions: 1 }, scene);
      clump.position.copyFrom(tip);
      clump.scaling.y = 0.77;
      clump.material = leaves;
      clump.convertToFlatShadedMesh();
      clump.isPickable = false;
    }
    kept.push({ type: "cylinder", center: origin, radius: 0.85 });
  });
  return kept;
}

function cottagesAndFallenTower(scene: Scene, obstacles: MapBuildResult["obstacles"]): void {
  const masonry = new StandardMaterial("medieval2CottageStone", scene);
  masonry.diffuseColor = new Color3(0.55, 0.52, 0.49);
  masonry.emissiveColor = masonry.diffuseColor.scale(0.24);
  const roof = new StandardMaterial("medieval2RedTiles", scene);
  roof.diffuseColor = new Color3(0.78, 0.22, 0.16);
  roof.emissiveColor = roof.diffuseColor.scale(0.22);
  const tile = (name: string, material: StandardMaterial, x: number, y: number, z: number, width: number, height: number, depth: number): Mesh => {
    const mesh = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
    mesh.position.set(x, y, z);
    mesh.material = material;
    mesh.receiveShadows = true;
    return mesh;
  };
  for (const [x, z, wall] of [[33, -37, 2.2], [46, -26, 1.55]]) {
    tile("medieval2CottageBack", masonry, x, wall / 2, z - 2.35, 5.2, wall, 0.85);
    tile("medieval2CottageSide", masonry, x - 2.15, wall / 2, z, 0.84, wall, 4.6);
    tile("medieval2CottageStump", masonry, x + 2.25, 0.64, z - 1.6, 0.9, 1.28, 2.12);
    for (let row = 0; row < 5; row++) {
      for (const side of [-1, 1]) {
        if (side > 0 && row > 1) continue;
        const fallen = side > 0;
        const panel = tile("medieval2BrokenRoofCourse", roof, x + side * (fallen ? 2.65 : 1.37),
          fallen ? 0.8 + row * 0.31 : wall + 1.03, z - 2.42 + row * 0.96, 3.25, 0.31, 1.08);
        panel.rotation.z = -side * (fallen ? 0.34 : 0.63);
        panel.rotation.y = fallen ? 0.19 : 0;
      }
    }
    obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: 2.45, halfZ: 2.4 });
  }
  for (let i = 0; i < 3; i++) {
    const drum = MeshBuilder.CreateCylinder("medieval2FallenTowerDrum", { diameter: 2.7 + i * 0.17, height: 2.28, tessellation: 8 }, scene);
    drum.rotation.set(Math.PI / 2, 0.24, 0.16);
    drum.position.set(19 + i * 1.1, 1.15, -38.6 + i * 1.86);
    drum.material = masonry;
  }
  const spire = MeshBuilder.CreateCylinder("medieval2FallenTowerRoof", {
    diameterTop: 0.24, diameterBottom: 3.75, height: 4.8, tessellation: 8,
  }, scene);
  spire.position.set(22.9, 1.2, -31.9);
  spire.rotation.set(1.54, 0.39, -0.27);
  spire.material = roof;
  for (const [x, z] of [[19, -38.6], [20.1, -36.74], [21.2, -34.88], [22.9, -31.9]]) {
    obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 1.4 });
  }
}

export function buildMedieval2(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  const hazards = [...clearCentrePools(scene, built, result), ...frontPond(scene)];
  const obstacles = castleOaks(scene, built, clearPondGround(scene, built, [...result.obstacles]));
  dirtPaths(scene);
  castleFront(scene, obstacles);
  cottagesAndFallenTower(scene, obstacles);
  return { ...result, obstacles, hazards };
}
