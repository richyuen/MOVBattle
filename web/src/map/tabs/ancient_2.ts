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
import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const RIM = { a: 51, b: 51, round: 2 };
const TERRACES = [
  { front: 24, half: 42, h: 3 },
  { front: 30, half: 32, h: 6.5 },
  { front: 36, half: 20, h: 10 },
];
const STRIP = 6;
const STAIR_HALF = 3;
const STATUES: Array<[number, number]> = [[-11, 21.5], [11, 21.5]];

/** The room available behind each temple terrace follows the circular island. */
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

function roundIsland(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const detached: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || !(mesh instanceof Mesh)) continue;
    if (/^(ground$|centerGrass$|islandUnder|islandShelf|islandCliff)/.test(mesh.name)) {
      const positions = mesh.getVerticesData("position");
      if (!positions) continue;
      // Remap in world space (573): the base slabs are scaled meshes, so their local radii are not metres and a
      // local remap left the old 54 x 48 shelf projecting past the wall. Each vertex keeps its fraction of the old
      // superellipse (54 x 48, power 3) and lands at that fraction of the 51 m circle.
      const world = mesh.computeWorldMatrix(true);
      const inverse = world.clone().invert();
      for (let i = 0; i < positions.length; i += 3) {
        const p = Vector3.TransformCoordinates(new Vector3(positions[i], positions[i + 1], positions[i + 2]), world);
        const radial = Math.hypot(p.x, p.z);
        if (radial < 0.001) continue;
        const oldFraction = Math.cbrt(Math.abs(p.x / 54) ** 3 + Math.abs(p.z / 48) ** 3);
        const scale = RIM.a * oldFraction / radial;
        const back = Vector3.TransformCoordinates(new Vector3(p.x * scale, p.y, p.z * scale), inverse);
        positions[i] = back.x;
        positions[i + 1] = back.y;
        positions[i + 2] = back.z;
      }
      mesh.updateVerticesData("position", positions, true);
      mesh.refreshBoundingInfo();
    } else if (/^(fieldBlades_|fieldTufts_)/.test(mesh.name)) {
      // The old range of these merged meshes crosses the new circular edge.
      mesh.setEnabled(false);
    } else if (!mesh.parent && /^(trunk|boulder|wallStone|pebble|hill)$/.test(mesh.name) &&
      Math.hypot(mesh.position.x, mesh.position.z) > RIM.a - 2) {
      detached.push(mesh.position.clone());
      mesh.setEnabled(false);
    }
  }
  return obstacles.filter(({ center }) => !detached.some((p) => Math.hypot(p.x - center.x, p.z - center.z) < 0.55));
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

// Lawn (571, wiki shot): the field is a bright yellow-green lawn with a soft mottled texture, and pink and
// violet flower specks gather in drifts along the foot of the ring wall (thicker toward the front and
// sides) with a few loose ones out in the field. The base's orange autumn floor and its blades go: the
// floor is recoloured, low lawn clumps (two greens, under 0.25 m) mottle it, and the flower drifts are
// clusters of small faceted heads 0.25-0.4 m across, kept off the paths and the temple terraces.
function greenLawn(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (/^(fieldBlades_|fieldTufts_|grassTuft)/.test(mesh.name)) mesh.setEnabled(false);
    if ((mesh.name === "ground" || mesh.name === "centerGrass") && mesh.material instanceof StandardMaterial) {
      mesh.material.diffuseColor.set(0.55, 0.69, 0.21);
      mesh.material.emissiveColor.set(0.15, 0.19, 0.05);
    }
  }
  const onTerrace = (x: number, z: number) => z > TERRACES[0].front - 2.5 && Math.abs(x) < TERRACES[0].half + 2;
  const onPath = (x: number, z: number) => Math.abs(x - 0.36 * Math.min(z, 0)) < 3.2 ||
    (x < 0 && Math.abs(z - Math.max(-7, x * 0.25)) < 3.4) || (x > 0 && x < 40 && Math.abs(z + x * 0.82) < 3.6);
  const instanced = (name: string, colour: Color3, glow: number, radius: number) => {
    const mesh = MeshBuilder.CreateIcoSphere(name, { radius, subdivisions: 1, flat: true }, scene);
    const mat = new StandardMaterial(name, scene);
    mat.diffuseColor = colour;
    mat.emissiveColor = colour.scale(glow);
    mat.specularColor = Color3.Black();
    mesh.material = mat;
    mesh.isPickable = false;
    mesh.receiveShadows = true;
    return { mesh, m: [] as number[] };
  };
  const lawn = [instanced("ancient2LawnLight", new Color3(0.62, 0.76, 0.24), 0.3, 0.5), instanced("ancient2LawnDark", new Color3(0.42, 0.58, 0.17), 0.26, 0.5)];
  const petals = [instanced("ancient2FlowerPink", new Color3(1, 0.42, 0.72), 0.5, 0.16), instanced("ancient2FlowerViolet", new Color3(0.52, 0.34, 1), 0.5, 0.16)];
  for (let i = 0; i < 2600; i++) {
    const a = seeded(i, 101) * Math.PI * 2, r = Math.sqrt(seeded(i, 102)) * (RIM.a - 2);
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (onTerrace(x, z) || onPath(x, z)) continue;
    const w = 0.9 + seeded(i, 103) * 1.1;
    lawn[seeded(i, 104) > 0.5 ? 1 : 0].m.push(...Matrix.Compose(new Vector3(w, 0.18 + seeded(i, 105) * 0.1, w), Quaternion.RotationAxis(Vector3.Up(), a), new Vector3(x, 0.04, z)).m);
  }
  for (let c = 0; c < 70; c++) {
    const a = seeded(c, 111) * Math.PI * 2;
    const r = c < 54 ? RIM.a - 3.5 - seeded(c, 112) * 7 : 8 + seeded(c, 112) * 34;
    const cx = Math.cos(a) * r, cz = Math.sin(a) * r;
    for (let k = 0; k < 16; k++) {
      const d = seeded(c * 16 + k, 113) * 2.6, t = seeded(c * 16 + k, 114) * Math.PI * 2;
      const x = cx + Math.cos(t) * d, z = cz + Math.sin(t) * d * 0.7;
      if (onTerrace(x, z) || onPath(x, z) || Math.hypot(x, z) > RIM.a - 1.5) continue;
      const s = 0.8 + seeded(c * 16 + k, 115) * 0.5;
      petals[(c + k) % 3 === 0 ? 1 : 0].m.push(...Matrix.Compose(new Vector3(s, 0.6 * s, s), Quaternion.Identity(), new Vector3(x, 0.14 + seeded(k, c) * 0.12, z)).m);
    }
  }
  for (const { mesh, m } of [...lawn, ...petals]) mesh.thinInstanceSetBuffer("matrix", new Float32Array(m), 16);
}

// Ring wall (572, wiki shot ancient_2.png): the field is walled in by a low beige plastered wall following the round
// rim all the way round (the complex stands inside it), not a ring of autumn trees. Spec: the base's ring trees go
// (every unparented trunk left, with its crown children and colliders); 72 wall segments on radius 49.6, 1.5 m
// high, 1.1 m thick, with a paler 1.4 m coping and slightly offset joints; colliders every 2.4 m. Cypress
// clusters (2-3 slim cones 4-6 m) stand inside the wall at six spots.
function ringWall(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || mesh.name !== "trunk" || mesh.parent || !mesh.isEnabled()) continue;
    gone.push([mesh.position.x, mesh.position.z]);
    mesh.setEnabled(false);
  }
  const kept = obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const plaster = mk("ancient2RingPlaster", new Color3(0.78, 0.68, 0.5), 0.24);
  const coping = mk("ancient2RingCoping", new Color3(0.88, 0.8, 0.64), 0.26);
  const leaves = mk("ancient2Cypress", new Color3(0.33, 0.5, 0.16), 0.18);
  const R = RIM.a - 1.4;
  const count = 72;
  const segLength = (2 * Math.PI * R) / count + 0.15;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const h = 1.5 + (seeded(i, 61) - 0.5) * 0.12;
    const wall = MeshBuilder.CreateBox("ancient2RingWall", { width: segLength, height: h, depth: 1.1 }, scene);
    wall.position.set(Math.cos(a) * R, h / 2, Math.sin(a) * R);
    wall.rotation.y = -a + Math.PI / 2;
    wall.material = plaster;
    wall.receiveShadows = true;
    const cap = MeshBuilder.CreateBox("ancient2RingCoping", { width: segLength, height: 0.16, depth: 1.4 }, scene);
    cap.position.set(wall.position.x, h + 0.08, wall.position.z);
    cap.rotation.y = wall.rotation.y;
    cap.material = coping;
  }
  for (let s = 0; s < 2 * Math.PI * R; s += 2.4) {
    const a = s / R;
    kept.push({ type: "cylinder", center: new Vector3(Math.cos(a) * R, 0, Math.sin(a) * R), radius: 1.2 });
  }
  for (const [deg, n] of [[200, 3], [160, 2], [250, 3], [290, 2], [330, 3], [20, 2]] as const) {
    const a = (deg * Math.PI) / 180;
    for (let j = 0; j < n; j++) {
      const r = R - 2.2 - (j % 2) * 1.3;
      const off = (j - (n - 1) / 2) * 1.6 / R;
      const h = 4 + seeded(deg + j, 62) * 2;
      const cone = MeshBuilder.CreateCylinder("ancient2Cypress", { height: h, diameterTop: 0.1, diameterBottom: 1.4, tessellation: 7 }, scene);
      cone.position.set(Math.cos(a + off) * r, h / 2 + 0.3, Math.sin(a + off) * r);
      cone.material = leaves;
      kept.push({ type: "cylinder", center: new Vector3(cone.position.x, 0, cone.position.z), radius: 0.6 });
    }
  }
  return kept;
}

// Earth drum underside (573, greek_ancient_2.png: under the wall the island is a round drum of brown earth with
// near-vertical sides set with grey stones, rounding off underneath; no navy slab or dark spikes). Spec: the base's
// islandUnder/islandShelf/islandCliff go; a 64-sided drum on the 51 m circle, 9 m of near-vertical
// side (diameter 102 to 96) then a rounded base to a 30 m flat bottom 17 m down; warm brown (0.42,0.27,0.15) half
// self-lit; 110 grey stones (flattened dodecahedra 1.2-2.6 m) sunk half into the side between 1 and 13 m down.
function earthDrum(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && /^(islandUnder|islandShelf|islandCliff)/.test(mesh.name)) mesh.setEnabled(false);
  }
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const earth = mk("ancient2DrumEarth", new Color3(0.42, 0.27, 0.15), 0.5);
  const stoneMat = mk("ancient2DrumStone", new Color3(0.58, 0.58, 0.56), 0.45);
  const profile: Array<[number, number]> = [[51, 0], [50.6, -4], [48, -9], [44, -12.5], [36, -15.5], [15, -17]];
  const parts: Mesh[] = [];
  for (let i = 0; i < profile.length - 1; i++) {
    const [r0, y0] = profile[i], [r1, y1] = profile[i + 1];
    const band = MeshBuilder.CreateCylinder("ancient2Drum", { diameterTop: r0 * 2, diameterBottom: r1 * 2, height: y0 - y1, tessellation: 64, cap: Mesh.NO_CAP }, scene);
    band.position.y = (y0 + y1) / 2;
    parts.push(band);
  }
  const bottom = MeshBuilder.CreateCylinder("ancient2Drum", { diameter: profile[profile.length - 1][0] * 2, height: 0.2, tessellation: 64 }, scene);
  bottom.position.y = profile[profile.length - 1][1];
  parts.push(bottom);
  const drum = Mesh.MergeMeshes(parts, true);
  if (drum) {
    drum.name = "ancient2Drum";
    drum.convertToFlatShadedMesh();
    drum.material = earth;
    drum.isPickable = false;
  }
  const stones: Mesh[] = [];
  for (let k = 0; k < 110; k++) {
    const a = seeded(k, 141) * Math.PI * 2;
    const y = -1 - seeded(k, 142) * 12;
    let j = 1;
    while (j < profile.length - 1 && profile[j][1] > y) j++;
    const [ra, ya] = profile[j - 1], [rb, yb] = profile[j];
    const r = ra + (rb - ra) * ((y - ya) / (yb - ya));
    const d = 1.2 + seeded(k, 143) * 1.4;
    const stone = MeshBuilder.CreatePolyhedron("ancient2DrumStone", { type: 2, sizeX: d * 0.5, sizeY: d * 0.36, sizeZ: d * 0.5 }, scene);
    stone.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    stone.rotation.set(seeded(k, 144) * 0.6, seeded(k, 145) * Math.PI, 0);
    stones.push(stone);
  }
  const studs = Mesh.MergeMeshes(stones, true);
  if (studs) {
    studs.name = "ancient2DrumStones";
    studs.convertToFlatShadedMesh();
    studs.material = stoneMat;
    studs.isPickable = false;
  }
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
  const obstacles = ringWall(scene, built, clearFootprint(scene, built, roundIsland(scene, built, result.obstacles)));
  earthDrum(scene, built);
  greenLawn(scene, built);
  fieldPaths(scene);
  templeComplex(scene, obstacles);
  return { ...result, obstacles };
}
