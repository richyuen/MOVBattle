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

export function buildMedieval2(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  const hazards = [...clearCentrePools(scene, built, result), ...frontPond(scene)];
  const obstacles = clearPondGround(scene, built, [...result.obstacles]);
  dirtPaths(scene);
  return { ...result, obstacles, hazards };
}
