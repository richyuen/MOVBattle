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
import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, VertexData, type Scene } from "@babylonjs/core";
import { clampToIsland, type MapBuildResult } from "../mapBuilder";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const POND = { x: -6, z: -39, rx: 31, rz: 10, lobes: 20 };
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
    const [x, z] = clampToIsland(POND.x + Math.cos(a) * POND.rx * pull, POND.z + Math.sin(a) * POND.rz * pull);
    outline.push([x - POND.x, z - POND.z]);
  }
  const grown = (f: number, add: number) => outline.map(([x, z]): [number, number] => {
    const d = Math.hypot(x, z) || 1;
    const [edgeX, edgeZ] = clampToIsland(POND.x + x * f + (x / d) * add, POND.z + z * f + (z / d) * add);
    return [edgeX - POND.x, edgeZ - POND.z];
  });
  flatDisc(scene, "medieval2PondShore", grown(1, 1.6), POND.x, POND.z, 0.05, mk("medieval2PondShoreMat", new Color3(0.74, 0.86, 0.68), 0.35));
  flatDisc(scene, "medieval2PondWater", outline, POND.x, POND.z, 0.065, mk("medieval2PondWaterMat", new Color3(0.26, 0.78, 0.66), 0.4));
  flatDisc(scene, "medieval2PondDeep", grown(0.6, 0), POND.x, POND.z, 0.075, mk("medieval2PondDeepMat", new Color3(0.1, 0.56, 0.56), 0.4));
  return [-28, -20, -12, -4, 4, 12, 20].map((x) => ({
    kind: "water" as const, shape: "cylinder" as const,
    center: new Vector3(x, 0, x < -20 || x > 14 ? -41 : -40),
    radius: x < -20 || x > 14 ? 4.5 : 6.4,
  }));
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
  // Silhouette (571, meadow_medieval_2.png): no single straight curtain. Short curtain runs step forward
  // toward both ends so the front reads as a rounded arc, each joint is a round drum tower with a ring
  // of merlons, and a tall round keep behind the gate carries the highest blue spire, with smaller
  // spires on the inner drums. Towers sit at gate offsets 6.5, 18, 29, 37 (z set back by TOWER_DZ).
  const roof = material("medieval2SpireSlate", new Color3(0.13, 0.2, 0.62));
  const towerAt: Array<[number, number, number, number, boolean]> = [
    // offset, radius, height, z shift, spire
    [6.5, 2.7, 15.5, 0, false], [18, 3.1, 14, -0.8, true], [29, 2.9, 13.4, -2.4, false], [37, 2.6, 12.6, -4.6, true],
  ];
  const runs: Array<[number, number, number]> = [[6.5, 18, 0], [18, 29, -1.6], [29, 37, -3.6]];
  const ringMerlons = (cx: number, cy: number, cz: number, radius: number) => {
    const count = Math.max(8, Math.round(radius * 3.2));
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const merlon = box("medieval2Merlon", cx + Math.cos(angle) * (radius - 0.35), cy, cz + Math.sin(angle) * (radius - 0.35), 0.95, 1.3, 0.7, stone);
      merlon.rotation.y = -angle + Math.PI / 2;
    }
  };
  const spire = (cx: number, base: number, cz: number, radius: number, height: number) => {
    const cone = MeshBuilder.CreateCylinder("medieval2Spire", { diameterTop: 0, diameterBottom: radius * 2, height, tessellation: 10 }, scene);
    cone.position.set(cx, base + height / 2, cz);
    cone.material = roof;
  };
  for (const side of [-1, 1]) {
    for (const [from, to, dz] of runs) {
      const span = to - from;
      const x = gateX + side * (from + span / 2);
      const depth = 5.6;
      box("medieval2CurtainWall", x, 5.6, z + dz, span, 11.2, depth, stone);
      obstacles.push({ type: "box", center: new Vector3(x, 0, z + dz), halfX: span / 2, halfZ: depth / 2 });
      for (let dx = -span / 2 + 1.2; dx < span / 2 - 0.6; dx += 2.4) {
        box("medieval2Merlon", x + dx, 11.85, z + dz - depth / 2 + 0.7, 1.4, 1.3, 1.4, stone);
      }
    }
    for (const [offset, radius, height, dz, hasSpire] of towerAt) {
      const x = gateX + side * offset;
      const drum = MeshBuilder.CreateCylinder("medieval2DrumTower", { diameter: radius * 2, height, tessellation: 14 }, scene);
      drum.position.set(x, height / 2, z + dz - 0.6);
      drum.material = stone;
      drum.receiveShadows = true;
      const parapet = MeshBuilder.CreateCylinder("medieval2DrumParapet", { diameter: radius * 2 + 0.7, height: 0.9, tessellation: 14 }, scene);
      parapet.position.set(x, height - 0.2, z + dz - 0.6);
      parapet.material = stone;
      ringMerlons(x, height + 0.85, z + dz - 0.6, radius + 0.35);
      if (hasSpire) spire(x, height + 0.3, z + dz - 0.6, radius + 0.5, radius * 3.1);
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z + dz - 0.6), radius: radius + 0.2 });
    }
  }
  // The keep: a tall round tower behind the gatehouse, banded, with an upper turret and the tallest spire.
  const keepZ = z + 6.5;
  const keep = MeshBuilder.CreateCylinder("medieval2Keep", { diameter: 8.4, height: 23, tessellation: 16 }, scene);
  keep.position.set(gateX, 11.5, keepZ);
  keep.material = stone;
  keep.receiveShadows = true;
  const keepBand = MeshBuilder.CreateCylinder("medieval2KeepParapet", { diameter: 9.4, height: 1.1, tessellation: 16 }, scene);
  keepBand.position.set(gateX, 22.6, keepZ);
  keepBand.material = stone;
  ringMerlons(gateX, 23.7, keepZ, 4.7);
  const turret = MeshBuilder.CreateCylinder("medieval2KeepTurret", { diameter: 5.2, height: 6.5, tessellation: 14 }, scene);
  turret.position.set(gateX, 26.2, keepZ);
  turret.material = stone;
  spire(gateX, 29.3, keepZ, 3.4, 11.5);
  for (const side of [-1, 1]) {
    const pinnacle = MeshBuilder.CreateCylinder("medieval2KeepPinnacle", { diameter: 2, height: 4.2, tessellation: 10 }, scene);
    pinnacle.position.set(gateX + side * 3.8, 25.4, keepZ - 1.4);
    pinnacle.material = stone;
    spire(gateX + side * 3.8, 27.4, keepZ - 1.4, 1.3, 4.4);
  }
  obstacles.push({ type: "cylinder", center: new Vector3(gateX, 0, keepZ), radius: 4.4 });
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
      const offset = Math.abs(x + i * 0.55 - gateX);
      const shift = offset > 29 ? -3.6 : offset > 18 ? -1.6 : 0;
      ivy.position.set(x + i * 0.55, Math.min(10.5, y - i * (0.6 + d * 0.24)), z + shift - 2.8 - 0.1);
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
  // Castle foot (571, wiki shot): broad layered oaks crowd the base of the wall on both sides of the gate,
  // big multi-lobed canopies at the left foot and right foot with smaller oaks nearer the gate; a few stand
  // behind the curtain and at the corners. [x, z, scale]; the gate path (x -10..-6) stays clear.
  const groves: Array<[number, number, number]> = [
    [-30, 19, 1.5], [-39, 17, 1.4], [-46, 12, 1.2], [-22, 20.5, 1.05], [-16, 18.5, 0.7], [-1, 19.5, 0.75],
    [5, 21, 0.95], [16, 20.8, 1.3], [36, 25, 1.4], [44, 22, 1.0],
    [-24, 32, 1.0], [14, 35, 1.0], [28, 36, 1.0], [41, -30, 1.0], [46, -19, 1.0], [-40, -30, 1.0], [-45, -24, 1.0],
  ];
  groves.forEach(([x, z, s], i) => {
    const h = (5.5 + seeded(i, 51) * 3.5) * Math.min(1.25, s);
    const lean = (i % 2 ? 1 : -1) * (1.1 + seeded(i, 52)) * s;
    const origin = new Vector3(x, 0, z);
    const fork = new Vector3(x + lean * 0.55, h * 0.63, z - 0.5);
    const crown = new Vector3(x + lean, h, z + 0.6);
    const path = [origin, new Vector3(x - lean * 0.34, h * 0.33, z + 0.36), fork, crown];
    const trunk = MeshBuilder.CreateTube("medieval2OakTrunk", {
      path, tessellation: 7, cap: Mesh.CAP_ALL, radiusFunction: (index) => [0.75, 0.61, 0.4, 0.18][index],
    }, scene);
    trunk.material = bark;
    const lobes = s > 1.2 ? 7 : s < 0.9 ? 3 : 5;
    for (let j = 0; j < lobes; j++) {
      const angle = j * Math.PI * 2 / lobes + i;
      const reach = 2.1 * s * (j === lobes - 1 && lobes > 4 ? 0.3 : 1);
      const tip = crown.add(new Vector3(reach * Math.cos(angle), (-0.75 + (j % 2) * 0.85) * s + (j === lobes - 1 && lobes > 4 ? 1.6 * s : 0), reach * Math.sin(angle)));
      const branch = MeshBuilder.CreateTube("medieval2OakBranch", {
        path: [fork, Vector3.Lerp(fork, tip, 0.58).add(new Vector3(0, -0.65, 0)), tip], tessellation: 6,
        radiusFunction: (index) => [0.35, 0.22, 0.09][index],
      }, scene);
      branch.material = bark;
      const clump = MeshBuilder.CreateIcoSphere("medieval2OakCrown", { radius: (2.1 + seeded(i * 4 + j, 53) * 0.9) * s, subdivisions: 1 }, scene);
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

// Castle-foot thicket (572, wiki shot medieval_2.png): the wall base is hidden behind two more depths of woodland
// behind the single oak row. Depth 3, against the curtain (z 21.5-23.5): a continuous hedge of rounded 1.6-2.6 m
// bush domes. Depth 2 (z 19.5-21.5): big oaks 7-10 m tall every ~6.5 m with domed crowns of five overlapping
// 2.6-3.4 m lobes, so their canopies touch and overlap the front row. Spans x -47..-15 and 9..45; the gate path
// (x -14..-5) stays open. Lobes are subdivision-2 icospheres (rounded low-poly), two greens.
function castleFootThicket(scene: Scene, obstacles: MapBuildResult["obstacles"]): void {
  const leafMat = (name: string, color: Color3) => {
    const mat = new StandardMaterial(name, scene);
    mat.diffuseColor = color;
    mat.emissiveColor = color.scale(0.22);
    mat.specularColor = Color3.Black();
    return mat;
  };
  const bark = new StandardMaterial("medieval2ThicketBark", scene);
  bark.diffuseColor = new Color3(0.34, 0.18, 0.1);
  bark.emissiveColor = bark.diffuseColor.scale(0.16);
  const tones = [leafMat("medieval2ThicketLeaf", new Color3(0.31, 0.47, 0.13)), leafMat("medieval2ThicketLeafDark", new Color3(0.2, 0.34, 0.09))];
  const lobes = tones.map((mat, k) => {
    const mesh = MeshBuilder.CreateIcoSphere(`medieval2ThicketLobe${k}`, { radius: 1, subdivisions: 2 }, scene);
    mesh.convertToFlatShadedMesh();
    mesh.material = mat;
    mesh.isPickable = false;
    mesh.receiveShadows = true;
    return { mesh, matrices: [] as number[] };
  });
  let n = 0;
  const lobe = (x: number, y: number, z: number, r: number, squash: number) => {
    const tone = lobes[seeded(n, 71) < 0.55 ? 0 : 1];
    const m = Matrix.Compose(new Vector3(r, r * squash, r), Quaternion.RotationYawPitchRoll(seeded(n, 72) * Math.PI * 2, 0, 0), new Vector3(x, y, z));
    for (const v of m.asArray()) tone.matrices.push(v);
    n += 1;
  };
  const spans: Array<[number, number]> = [[-47, -15], [9, 45]];
  for (const [from, to] of spans) {
    // Depth 3: hedge domes against the wall.
    for (let x = from; x <= to; x += 2.3) {
      const r = 1.6 + seeded(x * 3, 73) * 1.0;
      lobe(x + seeded(x, 74) * 0.8, r * 0.55, 22.5 + seeded(x, 75) * 1.2, r, 0.8);
    }
    // Depth 2: big domed oaks.
    for (let x = from + 2.5; x <= to - 1; x += 6.5) {
      const i = Math.round(x * 7);
      const tx = x + (seeded(i, 76) - 0.5) * 2;
      const tz = 20 + seeded(i, 77) * 1.5;
      const h = 7 + seeded(i, 78) * 3;
      const trunk = MeshBuilder.CreateTube("medieval2ThicketTrunk", {
        path: [new Vector3(tx, 0, tz), new Vector3(tx + 0.4, h * 0.45, tz - 0.2), new Vector3(tx - 0.2, h * 0.8, tz)],
        tessellation: 7, cap: Mesh.CAP_ALL, radiusFunction: (index) => [0.8, 0.55, 0.35][index],
      }, scene);
      trunk.material = bark;
      obstacles.push({ type: "cylinder", center: new Vector3(tx, 0, tz), radius: 0.9 });
      const crownR = 2.6 + seeded(i, 79) * 0.8;
      lobe(tx, h, tz, crownR * 1.15, 0.82);
      for (let j = 0; j < 4; j++) {
        const a = j * Math.PI / 2 + seeded(i, 80);
        lobe(tx + Math.cos(a) * crownR * 0.95, h - 0.9 + (j % 2) * 0.7, tz + Math.sin(a) * crownR * 0.75, crownR * (0.85 + seeded(i + j, 81) * 0.2), 0.8);
      }
    }
  }
  for (const { mesh, matrices } of lobes) mesh.thinInstanceSetBuffer("matrix", new Float32Array(matrices), 16);
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

// Island dressing rebuild (575 [R], criterion a, from both CONFIRM lists 569 and 572, read off meadow_medieval_2.png and
// wiki medieval_2.png). Spec:
// 1. Underside (replaces the smooth pale earthen bowl): under the turf a dark earth band 3.2 m deep (warm brown
//    (0.27,0.17,0.1), self-lit 0.6x), then a faceted grey rock body tapering to a blunt point 34 m down (~0.31 of the 108 m
//    island width, so it reads deep in the island shot): rings at 0.985/0.93/0.8/0.6/0.33/0.05 of the rim at -3.2/-9/-16/
//    -23/-29/-34 m, 48 vertices round with 6% radial and +-1.2 m vertical jitter, flat-shaded, warm grey (0.5,0.47,0.44)
//    to (0.37,0.35,0.34) (r over b), self-lit 0.7x; 70 faceted boulders 3-7 m (icosahedra) set half into the rock face
//    break up the profile.
// 2. Vine: one brown tube (0.42,0.25,0.13), 1.1 m radius at the root tapering to 0.3 m, rooted at the keep's front-right
//    foot and coiling 2.75 turns up the keep (r 5.3 to 23 m, round the parapet at r 5.6, the turret at r 3.4, the spire
//    narrowing r 3 to 1.2) to 37 m, its tip curling out; a second strand arches from the keep foot over the left curtain
//    (top 13.5 m at x -20) down into the castle-foot thicket. Leaf tufts every few metres along both. Drawn only.
// 3. Side tree ring: dense round bushy oaks down both side rims from the castle (z 17) to the pond (z -32): two staggered
//    rows at 0.97 and 0.89 of the rim every ~3.4 m, 5-8 m tall, crowns of 3-4 overlapping faceted lumps 2.2-3.2 m, two
//    greens; none within 2.6 m of a path or 3 m of an existing oak; a 0.8 m collider each (all outside the stage armies,
//    x <= 37). The pond, halves and paths stay as they are.
function earthenBowl(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && /^island(Under|Shelf|Cliff)/.test(mesh.name)) mesh.setEnabled(false);
  }
  const N = 48;
  const glow = scene.getGlowLayerByName("glow");
  const tiers = [
    { scale: 1, height: -0.07, color: [0.27, 0.17, 0.1], self: 0.6 },
    { scale: 0.995, height: -3.2, color: [0.27, 0.17, 0.1], self: 0.6 },
    { scale: 0.985, height: -3.4, color: [0.44, 0.41, 0.38], self: 0.6 },
    { scale: 0.93, height: -9, color: [0.44, 0.41, 0.38], self: 0.6 },
    { scale: 0.8, height: -16, color: [0.41, 0.38, 0.36], self: 0.6 },
    { scale: 0.6, height: -23, color: [0.38, 0.36, 0.34], self: 0.6 },
    { scale: 0.33, height: -29, color: [0.35, 0.33, 0.32], self: 0.6 },
    { scale: 0.05, height: -34, color: [0.33, 0.31, 0.3], self: 0.6 },
  ];
  const rim = (angle: number) => clampToIsland(Math.cos(angle) * 100, Math.sin(angle) * 100);
  const rings = tiers.map(({ scale, height }, row) => Array.from({ length: N }, (_, i) => {
    const angle = (i / N) * Math.PI * 2;
    const [x, z] = rim(angle);
    const jag = row < 2 ? 1 : 1 + (seeded(i, 50 + row) - 0.5) * 0.12;
    const dy = row < 3 ? 0 : (seeded(i, 70 + row) - 0.5) * 2.4;
    return new Vector3(x * scale * jag, height + dy, z * scale * jag);
  }));
  for (let row = 1; row < rings.length; row++) {
    const [r, g, b] = tiers[row].color;
    const mat = new StandardMaterial(row <= 1 ? "medieval2EarthBand" : "medieval2UnderRock", scene);
    mat.diffuseColor = new Color3(r, g, b);
    mat.emissiveColor = mat.diffuseColor.scale(tiers[row].self);
    mat.specularColor = Color3.Black();
    const band = MeshBuilder.CreateRibbon("medieval2BowlBand", {
      pathArray: [rings[row - 1], rings[row]], closePath: true, sideOrientation: Mesh.DOUBLESIDE,
    }, scene);
    band.material = mat;
    band.isPickable = false;
    band.convertToFlatShadedMesh();
    glow?.addExcludedMesh(band);
  }
  const rockMat = new StandardMaterial("medieval2UnderBoulder", scene);
  rockMat.diffuseColor = new Color3(0.42, 0.39, 0.36);
  rockMat.emissiveColor = new Color3(0.42, 0.39, 0.36);
  rockMat.specularColor = Color3.Black();
  const boulders: Mesh[] = [];
  for (let i = 0; i < 70; i++) {
    const angle = (i / 70) * Math.PI * 2 + seeded(i, 81) * 0.08;
    const t = 0.1 + seeded(i, 83) * 0.75;
    // Interpolate the rock body's radius fraction and depth at this height
    const f = t * (tiers.length - 3) + 2;
    const k = Math.min(tiers.length - 2, Math.floor(f)), u = f - k;
    const scale = tiers[k].scale * (1 - u) + tiers[k + 1].scale * u;
    const y = tiers[k].height * (1 - u) + tiers[k + 1].height * u;
    const [x, z] = rim(angle);
    const size = 1.5 + seeded(i, 85) * 2;
    const rock = MeshBuilder.CreateIcoSphere("medieval2UnderBoulder", { radius: size, subdivisions: 1, flat: true }, scene);
    rock.scaling.set(1, 0.7 + seeded(i, 87) * 0.5, 1);
    rock.rotation.set(seeded(i, 89) * 3, seeded(i, 91) * 3, 0);
    rock.position.set(x * scale, y, z * scale);
    boulders.push(rock);
  }
  const merged = Mesh.MergeMeshes(boulders, true);
  if (merged) { merged.material = rockMat; merged.isPickable = false; glow?.addExcludedMesh(merged); }
}

function keepVine(scene: Scene): void {
  const bark = new StandardMaterial("medieval2Vine", scene);
  bark.diffuseColor = new Color3(0.42, 0.25, 0.13);
  bark.emissiveColor = bark.diffuseColor.scale(0.35);
  bark.specularColor = Color3.Black();
  const leaf = new StandardMaterial("medieval2VineLeaf", scene);
  leaf.diffuseColor = new Color3(0.3, 0.48, 0.14);
  leaf.emissiveColor = leaf.diffuseColor.scale(0.25);
  leaf.specularColor = Color3.Black();
  const cx = GATE[0], cz = GATE[1] + 8.5;
  const coil: Vector3[] = [];
  const S = 90, turns = 2.75, start = -Math.PI / 2 + 0.6;
  for (let s = 0; s <= S; s++) {
    const t = s / S;
    const y = t * 37;
    let r = 5.3;
    if (y > 21.5 && y <= 24.5) r = 5.6;
    else if (y > 24.5 && y <= 29.5) r = 3.4;
    else if (y > 29.5) r = 3 - (y - 29.5) / 7.5 * 1.8;
    const a = start + t * turns * Math.PI * 2;
    coil.push(new Vector3(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r));
  }
  // The tip curls out and down
  const last = coil[coil.length - 1];
  const a1 = start + turns * Math.PI * 2;
  coil.push(new Vector3(last.x + Math.cos(a1) * 1.6, 38.2, last.z + Math.sin(a1) * 1.6));
  coil.push(new Vector3(last.x + Math.cos(a1 + 0.9) * 2.6, 37.4, last.z + Math.sin(a1 + 0.9) * 2.6));
  const arch = [
    new Vector3(cx + 3.5, 0.3, cz - 4.2), new Vector3(cx - 1, 5, cz - 5), new Vector3(cx - 6, 10.5, cz - 6),
    new Vector3(cx - 10, 13.5, cz - 6.8), new Vector3(cx - 15, 11.5, cz - 8.6), new Vector3(cx - 19, 6.5, cz - 10.6),
    new Vector3(cx - 22, 1.5, cz - 12),
  ];
  const strands: Array<[Vector3[], number]> = [[coil, 1.5], [arch, 1.0]];
  const leaves: Mesh[] = [];
  for (const [path, r0] of strands) {
    const n = path.length;
    const tube = MeshBuilder.CreateTube("medieval2Vine", {
      path, tessellation: 8, cap: Mesh.CAP_ALL, radiusFunction: (i) => r0 - (r0 - 0.3) * (i / (n - 1)),
    }, scene);
    tube.material = bark;
    tube.isPickable = false;
    tube.receiveShadows = true;
    for (let i = 4; i < n - 1; i += path === coil ? 7 : 2) {
      const tuft = MeshBuilder.CreateIcoSphere("medieval2VineLeaf", { radius: 0.9 + seeded(i, 95) * 0.6, subdivisions: 1, flat: true }, scene);
      tuft.position.copyFrom(path[i]).addInPlace(new Vector3(0, 0.6, 0));
      tuft.rotation.y = seeded(i, 97) * 3;
      leaves.push(tuft);
    }
  }
  const merged = Mesh.MergeMeshes(leaves, true);
  if (merged) { merged.material = leaf; merged.isPickable = false; }
}

function sideTreeRing(scene: Scene, obstacles: MapBuildResult["obstacles"]): void {
  const bark = new StandardMaterial("medieval2RimBark", scene);
  bark.diffuseColor = new Color3(0.36, 0.19, 0.11);
  bark.emissiveColor = bark.diffuseColor.scale(0.16);
  const greens = [new Color3(0.31, 0.46, 0.13), new Color3(0.4, 0.55, 0.16)].map((c, i) => {
    const m = new StandardMaterial(`medieval2RimLeaves${i}`, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(0.23);
    m.specularColor = Color3.Black();
    return m;
  });
  const nearPath = (x: number, z: number) => PATHS.some((route) => route.some(([ex, ez], i) => {
    if (i === 0) return false;
    const [sx, sz] = route[i - 1];
    const dx = ex - sx, dz = ez - sz;
    const t = Math.max(0, Math.min(1, ((x - sx) * dx + (z - sz) * dz) / (dx * dx + dz * dz)));
    return Math.hypot(x - sx - dx * t, z - sz - dz * t) < PATH_WIDTH / 2 + 2.6;
  }));
  const existing = obstacles.filter((o) => o.type === "cylinder").map((o) => o.center);
  const trunks: Mesh[] = [], crowns: Mesh[][] = [[], []];
  let k = 0;
  for (const side of [-1, 1]) {
    for (const [row, frac] of [[0, 0.97], [1, 0.89]] as const) {
      for (let z = 17 - row * 1.7; z > -32; z -= 3.4) {
        k += 1;
        const zz = z + (seeded(k, 131) - 0.5) * 1.2;
        // The rim's x at this z (island superellipse 54 x 48, power 3)
        const x = side * 54 * Math.cbrt(Math.max(0, 1 - Math.abs(zz / 48) ** 3)) * frac;
        if (nearPath(x, zz) || existing.some((p) => Math.hypot(p.x - x, p.z - zz) < 3)) continue;
        const h = 5 + seeded(k, 133) * 3;
        const trunk = MeshBuilder.CreateCylinder("medieval2RimTrunk", { height: h * 0.6, diameterTop: 0.45, diameterBottom: 0.8, tessellation: 6 }, scene);
        trunk.position.set(x, h * 0.3, zz);
        trunks.push(trunk);
        const lumps = 3 + Math.round(seeded(k, 135));
        for (let j = 0; j < lumps; j++) {
          const ang = j * Math.PI * 2 / lumps + k;
          const rad = 2.2 + seeded(k * 5 + j, 137) * 1;
          const lump = MeshBuilder.CreateIcoSphere("medieval2RimCrown", { radius: rad, subdivisions: 1, flat: true }, scene);
          lump.position.set(x + Math.cos(ang) * 1.3, h * 0.72 + (j % 2) * 0.9, zz + Math.sin(ang) * 1.3);
          lump.scaling.y = 0.8;
          crowns[(k + j) % 2].push(lump);
        }
        obstacles.push({ type: "cylinder", center: new Vector3(x, 0, zz), radius: 0.8 });
        existing.push(new Vector3(x, 0, zz));
      }
    }
  }
  const t = Mesh.MergeMeshes(trunks, true);
  if (t) { t.material = bark; t.isPickable = false; }
  crowns.forEach((list, i) => {
    const m = Mesh.MergeMeshes(list, true);
    if (m) { m.material = greens[i]; m.isPickable = false; m.receiveShadows = true; }
  });
}

function facingHalves(scene: Scene, built: Set<unknown>): MapBuildResult["zones"] {
  for (const mesh of [...scene.meshes]) {
    if (built.has(mesh) && mesh.name.startsWith("campaign_zone_")) mesh.dispose();
  }
  const separation = new StandardMaterial("medieval2TeamDivide", scene);
  separation.diffuseColor = new Color3(0.77, 0.38, 0.27);
  separation.emissiveColor = separation.diffuseColor.scale(0.42);
  separation.alpha = 0.64;
  const line = MeshBuilder.CreateGround("campaign_zone_medieval2_divide", { width: 0.12, height: 64 }, scene);
  line.position.y = 0.12;
  line.material = separation;
  line.isPickable = false;
  return [
    { team: 0, center: new Vector3(-24, 0, 0), size: new Vector3(48, 100, 64) },
    { team: 1, center: new Vector3(24, 0, 0), size: new Vector3(48, 100, 64) },
  ];
}

function meadowGrass(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (/^(fieldBlades_|fieldTufts_|grassTuft)/.test(mesh.name)) mesh.setEnabled(false);
    if ((mesh.name === "ground" || mesh.name === "centerGrass") && mesh.material instanceof StandardMaterial) {
      mesh.material.diffuseColor.set(0.53, 0.66, 0.25);
      mesh.material.emissiveColor.set(0.13, 0.16, 0.054);
    }
  }
  const nearPath = (x: number, z: number) => PATHS.some((route) => route.some(([endX, endZ], i) => {
    if (i === 0) return false;
    const [startX, startZ] = route[i - 1];
    const dx = endX - startX, dz = endZ - startZ;
    const t = Math.max(0, Math.min(1, ((x - startX) * dx + (z - startZ) * dz) / (dx * dx + dz * dz)));
    return Math.hypot(x - startX - dx * t, z - startZ - dz * t) < PATH_WIDTH * 0.54;
  }));
  // Swathes (571, wiki shot): the field is soft bushy cover in broad contiguous swathes, darker and
  // fuzzier than the smooth lawn strips that run beside every path. Low faceted clumps (1.2-2.1 m across,
  // under 0.5 m tall) overlap on a 0.85 m jittered grid; a 2.4 m lane of open lawn borders each path, and
  // a smooth field leaves a few open lawn glades between the swathes.
  const nearLane = (x: number, z: number) => PATHS.some((route) => route.some(([endX, endZ], i) => {
    if (i === 0) return false;
    const [startX, startZ] = route[i - 1];
    const dx = endX - startX, dz = endZ - startZ;
    const t = Math.max(0, Math.min(1, ((x - startX) * dx + (z - startZ) * dz) / (dx * dx + dz * dz)));
    return Math.hypot(x - startX - dx * t, z - startZ - dz * t) < PATH_WIDTH * 0.5 + 2.4;
  }));
  const tones = [new Color3(0.45, 0.62, 0.2), new Color3(0.36, 0.53, 0.17)].map((colour, i) => {
    const mesh = MeshBuilder.CreateIcoSphere(`medieval2MeadowClump${i}`, { radius: 0.5, subdivisions: 1, flat: true }, scene);
    const mat = new StandardMaterial(`medieval2MeadowClump${i}`, scene);
    mat.diffuseColor = colour;
    mat.emissiveColor = colour.scale(0.3);
    mat.specularColor = Color3.Black();
    mesh.material = mat;
    mesh.receiveShadows = true;
    mesh.isPickable = false;
    return { mesh, matrices: [] as number[] };
  });
  let i = 0;
  for (let z = -45; z < 45; z += 0.85) {
    for (let x = -51; x < 51; x += 0.85) {
      i += 1;
      const jx = seeded(i, 72), jz = seeded(i, 73);
      const px = x + (jx - 0.5) * 0.7, pz = z + (jz - 0.5) * 0.7;
      if (Math.abs(px / 50.5) ** 3 + Math.abs(pz / 44.5) ** 3 > 1 || nearPath(px, pz)) continue;
      if (((px - POND.x) / (POND.rx + 2.5)) ** 2 + ((pz - POND.z) / (POND.rz + 2.4)) ** 2 < 1) continue;
      if (pz > 17 && Math.abs(px - GATE[0]) < 40) continue;
      const glade = Math.sin(px * 0.13 + 1.3) * Math.cos(pz * 0.15 - 0.4) + Math.sin((px + pz) * 0.07) * 0.5;
      if (glade > 0.72) continue;
      if (nearLane(px, pz) && jx > 0.12) continue;
      const width = 1.2 + jx * 0.9;
      const height = 0.3 + jz * 0.18;
      const tone = tones[(jz + glade * 0.3) > 0.55 ? 1 : 0];
      const yaw = Matrix.RotationY(jx * Math.PI * 2);
      const m = Matrix.Scaling(width, height, width * (0.8 + jz * 0.35)).multiply(yaw).multiply(Matrix.Translation(px, height * 0.3 + 0.04, pz));
      tone.matrices.push(...m.m);
    }
  }
  for (const { mesh, matrices } of tones) mesh.thinInstanceSetBuffer("matrix", new Float32Array(matrices), 16);
}

export function buildMedieval2(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && mesh.name.startsWith("mountain")) mesh.setEnabled(false);
  }
  scene.clearColor.set(0.66, 0.84, 0.87, 1);
  scene.fogColor.set(0.68, 0.84, 0.87);
  const hazards = [...clearCentrePools(scene, built, result), ...frontPond(scene)];
  const obstacles = castleOaks(scene, built, clearPondGround(scene, built, [...result.obstacles]));
  earthenBowl(scene, built);
  dirtPaths(scene);
  meadowGrass(scene, built);
  castleFront(scene, obstacles);
  castleFootThicket(scene, obstacles);
  keepVine(scene);
  cottagesAndFallenTower(scene, obstacles);
  sideTreeRing(scene, obstacles);
  return { ...result, obstacles, hazards, zones: facingHalves(scene, built) };
}
