// TABS "Ancient 2" (ancient map): a round walled-in green field with a large Greek temple complex filling its back (reference/maps/wiki/
// ancient_2.png, reference/maps/greek_ancient_2.png; card loop/cards/maps/ancient_2.md). Built on campaign.challenge (base(); the base is
// shared with four other maps: never edit it, dress its build here).
//
// Temple complex (565), spec read off the references: across the back third the ground rises in three stone terraces, each a beige
// retaining wall with a strip of moss green along its top, stepping back and up toward the rim and narrower each time (a stepped mound
// highest at the back centre); a straight stair runs up the middle from the field to the top; along the front edge of each terrace stand
// small temples (a beige cella on a plinth, a row of columns across its front, a low gabled roof with a pediment over them), one big temple
// crowns the top terrace at the back centre, and two tall statues on plinths flank the foot of the stair. Spec: terraces from z 24 / 30 / 36
// (front edges) back to 0.95 of the rim, |x| <= 42 / 32 / 20, 3 / 6.5 / 10 m high, built from 6 m strips so the back follows the rim; temples
// every 9-10 m along each terrace front (none within 4 m of the stair), 5.6 m wide, 3 m to the eaves; the stair 6 m wide; statues 6 m tall
// at x +-11, z 21.5. The base's ring trees and haze band standing in the footprint go with their colliders; one box collider per terrace-1
// strip and one per statue. The stage armies (x 29..37, |z| <= 18) stand on the open field in front of it.
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const RIM = { a: 54, b: 48, round: 3 };
const TERRACES = [
  { front: 24, half: 42, h: 3 },
  { front: 30, half: 32, h: 6.5 },
  { front: 36, half: 20, h: 10 },
];
const STRIP = 6;
const STAIR_HALF = 3;
const STATUES: Array<[number, number]> = [[-11, 21.5], [11, 21.5]];

/** The rim's z at the back for a given x (superellipse 54 x 48, power 3) */
function rimZ(x: number): number {
  const t = 1 - Math.abs(x / RIM.a) ** RIM.round;
  return t <= 0 ? 0 : RIM.b * t ** (1 / RIM.round);
}

function clearFootprint(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (mesh.name === "hazeTreeline") mesh.setEnabled(false);
    else if (mesh.name === "trunk" && !mesh.parent) {
      const p = mesh.position;
      if (p.z < TERRACES[0].front - 3 || Math.abs(p.x) > TERRACES[0].half + 4) continue;
      gone.push([p.x, p.z]);
      mesh.setEnabled(false);
    }
  }
  return obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
}

function templeComplex(scene: Scene, obstacles: Obstacle[]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const stone = mk("ancient2Stone", new Color3(0.78, 0.69, 0.55), 0.3);
  const pale = mk("ancient2Marble", new Color3(0.88, 0.83, 0.72), 0.32);
  const moss = mk("ancient2Moss", new Color3(0.42, 0.6, 0.18), 0.3);
  const shade = mk("ancient2Shade", new Color3(0.3, 0.26, 0.21), 0.3);
  const lists: Record<"stone" | "pale" | "moss" | "shade", Mesh[]> = { stone: [], pale: [], moss: [], shade: [] };
  const box = (list: keyof typeof lists, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("ancient2Part", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    lists[list].push(b);
    return b;
  };
  // A temple facing the field (-z): plinth, cella, a column row across the front, a gabled roof with its pediment
  const temple = (x: number, y: number, z: number, w: number, k: number) => {
    const d = w * 0.85, eave = w * 0.55;
    box("stone", w + 0.6, 0.6, d + 0.6, x, y + 0.3, z);
    box("pale", w * 0.75, eave, d * 0.7, x, y + 0.6 + eave / 2, z + d * 0.12);
    const cols = w > 8 ? 6 : 4;
    for (let c = 0; c < cols; c++) {
      const col = MeshBuilder.CreateCylinder("ancient2Column", { diameter: w * 0.08, height: eave, tessellation: 8 }, scene);
      col.position.set(x - w * 0.42 + (c * w * 0.84) / (cols - 1), y + 0.6 + eave / 2, z - d * 0.4);
      lists.pale.push(col);
    }
    box("pale", w, 0.4, d, x, y + 0.6 + eave + 0.2, z);
    // The roof: a triangular prism (a 3-sided cylinder: apex at +x, flat side at x -0.25), turned so the apex is up and the ridge runs
    // along z, its gable (the pediment) facing the field
    const roof = MeshBuilder.CreateCylinder("ancient2Roof", { diameter: 1, height: d + 0.2, tessellation: 3 }, scene);
    roof.rotation.z = Math.PI / 2;
    roof.bakeCurrentTransformIntoVertices();
    roof.rotation.y = Math.PI / 2;
    roof.bakeCurrentTransformIntoVertices();
    const pitch = w * (0.2 + seeded(k, 3) * 0.04);
    roof.scaling.set((w + 0.4) / 0.866, pitch / 0.75, 1);
    roof.position.set(x, y + 0.6 + eave + 0.4 + 0.25 * (pitch / 0.75), z);
    lists.stone.push(roof);
  };
  TERRACES.forEach((t, k) => {
    for (let x0 = -t.half; x0 < t.half; x0 += STRIP) {
      const x = x0 + STRIP / 2;
      const back = rimZ(Math.abs(x) + STRIP / 2) * 0.95;
      if (back - t.front < 3) continue;
      // The stair cuts through the middle strip of every terrace
      const parts: Array<[number, number]> = Math.abs(x) < STAIR_HALF + STRIP / 2
        ? [[x0, -STAIR_HALF], [STAIR_HALF, x0 + STRIP]].filter(([a, b]) => b - a > 0.2) as Array<[number, number]>
        : [[x0, x0 + STRIP]];
      for (const [a, b] of parts) {
        box("stone", b - a + 0.02, t.h, back - t.front, (a + b) / 2, t.h / 2, (t.front + back) / 2);
        box("moss", b - a + 0.02, 0.25, 1.6, (a + b) / 2, t.h + 0.1, t.front + 0.9);
        // A shaded joint every strip so the retaining wall reads as courses of blocks
        box("shade", 0.18, t.h * 0.9, 0.1, a + 0.05, t.h / 2, t.front - 0.04);
      }
      if (k === 0) obstacles.push({ type: "box", center: new Vector3(x, 0, (t.front + back) / 2), halfX: STRIP / 2, halfZ: (back - t.front) / 2 });
    }
    // Temples along this terrace's front
    let i = 0;
    for (let x = -t.half + 5; x <= t.half - 5; x += 9.5, i++) {
      if (Math.abs(x) < STAIR_HALF + 4) continue;
      if (rimZ(Math.abs(x) + 3) * 0.95 - t.front < 8) continue;
      temple(x, t.h, t.front + 4, 5.6, k * 20 + i);
    }
  });
  // The crowning temple at the back centre of the top terrace
  const top = TERRACES[2];
  temple(0, top.h, top.front + 6, 10, 99);
  // The stair: one step per 0.5 m of rise, from the field to the top terrace
  const rise = top.h, run = top.front + 2 - TERRACES[0].front;
  const steps = Math.round(rise / 0.5);
  for (let s = 0; s < steps; s++) {
    const y = (s + 1) * 0.5;
    const z0 = TERRACES[0].front + (s / steps) * run;
    box(s % 2 === 0 ? "pale" : "stone", STAIR_HALF * 2, y, run - (z0 - TERRACES[0].front), 0, y / 2, (z0 + TERRACES[0].front + run) / 2);
  }
  // Two statues flanking the stair foot
  for (const [x, z] of STATUES) {
    box("stone", 3, 1.6, 3, x, 0.8, z);
    const body = MeshBuilder.CreateCylinder("ancient2Statue", { diameterTop: 0.9, diameterBottom: 1.3, height: 3.4, tessellation: 8 }, scene);
    body.position.set(x, 1.6 + 1.7, z);
    lists.pale.push(body);
    const head = MeshBuilder.CreateSphere("ancient2StatueHead", { diameter: 0.9, segments: 6 }, scene);
    head.position.set(x, 1.6 + 3.4 + 0.45, z);
    lists.pale.push(head);
    const arm = MeshBuilder.CreateBox("ancient2StatueArm", { width: 0.35, height: 2.2, depth: 0.35 }, scene);
    arm.rotation.z = (x < 0 ? 1 : -1) * 0.5;
    arm.position.set(x + (x < 0 ? -0.8 : 0.8), 1.6 + 2.6, z);
    lists.pale.push(arm);
    obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 1.8 });
  }
  const glow = scene.getGlowLayerByName("glow");
  for (const [key, mat] of [["stone", stone], ["pale", pale], ["moss", moss], ["shade", shade]] as const) {
    const merged = Mesh.MergeMeshes(lists[key], true);
    if (!merged) continue;
    merged.name = `ancient2Temples_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.receiveShadows = true;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  }
}

function fieldPaths(scene: Scene): void {
  const clay = new StandardMaterial("ancient2PathClay", scene);
  clay.diffuseColor = new Color3(0.86, 0.76, 0.54);
  clay.emissiveColor = clay.diffuseColor.scale(0.24);
  const routes = [
    [[-48, -7], [-30, -7], [-13, -4], [0, 0], [16, -12], [31, -25], [38, -32]],
    [[-15, -42], [-10, -31], [-6, -15], [0, 0], [0, 11], [0, 24]],
  ];
  routes.forEach((route, index) => {
    const edges: [Vector3[], Vector3[]] = [[], []];
    route.forEach(([x, z], i) => {
      const before = route[Math.max(0, i - 1)], after = route[Math.min(route.length - 1, i + 1)];
      const dx = after[0] - before[0], dz = after[1] - before[1];
      const width = (1.8 + 0.35 * seeded(i, index + 91)) / Math.hypot(dx, dz);
      const y = 0.035 + 0.005 * index;
      edges[0].push(new Vector3(x - dz * width, y, z + dx * width));
      edges[1].push(new Vector3(x + dz * width, y, z - dx * width));
    });
    const path = MeshBuilder.CreateRibbon("ancient2FieldPath", { pathArray: edges, sideOrientation: Mesh.DOUBLESIDE }, scene);
    path.material = clay;
    path.receiveShadows = true;
    path.isPickable = false;
  });
}

export function buildAncient2(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  const debris = new Set(["wallStone", "boulder", "hayBale", "hill", "stump", "campaign_hazard_box_pit"]);
  const removed: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || !(debris.has(mesh.name) || mesh.name.startsWith("Challenge Bluffs_"))) continue;
    if (mesh.name !== "campaign_hazard_box_pit") removed.push(mesh.position.clone());
    mesh.setEnabled(false);
  }
  result.obstacles = result.obstacles.filter(({ center }) => !removed.some((p) =>
    (p.x / 54) ** 2 + (p.z / 48) ** 2 < 0.8 ** 2 && Math.hypot(center.x - p.x, center.z - p.z) < 3.4));
  result.hazards = result.hazards.filter((hazard) => hazard.kind !== "pit");
  const obstacles = clearFootprint(scene, built, [...result.obstacles]);
  fieldPaths(scene);
  templeComplex(scene, obstacles);
  return { ...result, obstacles };
}
