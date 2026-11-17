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
import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, VertexData, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const RIM = { a: 51, b: 51, round: 2 };
// Temple mound (575, wiki ancient_2.png and greek_ancient_2.png: the complex is a tall dense mound, terrace on terrace
// of temples, stairs and green-topped walls climbing to a crowning temple that is the highest thing on the island).
// Spec: four terraces (fronts 24/30/36/42, half-widths 42/33/23/13, tops 4/9/14.5/20 m) inside the old footprint;
// temples on each front vary 4.6-6.6 m wide and alternate with paired free-standing columns; the moss strip along
// each top is 2.4 m deep with clumps of faceted shrubs every ~5 m; the crowning temple (9 m) stands on a 2.2 m
// podium on the top terrace (roof ridge ~31 m); the central stair climbs all four. Field edge and colliders unchanged.
const TERRACES = [
  { front: 24, half: 42, h: 4 },
  { front: 30, half: 33, h: 9 },
  { front: 36, half: 23, h: 14.5 },
  { front: 42, half: 13, h: 20 },
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
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i], z = positions[i + 2];
        const radial = Math.hypot(x, z);
        if (radial < 0.001) continue;
        const oldFraction = Math.cbrt(Math.abs(x / 54) ** 3 + Math.abs(z / 48) ** 3);
        const scale = RIM.a * oldFraction / radial;
        positions[i] *= scale;
        positions[i + 2] *= scale;
      }
      mesh.updateVerticesData("position", positions, true);
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
  // The walls face the field and the low island camera, away from the sun: they carry their beige-grey in self-light
  // (lit at 0.3 they read charcoal, critic 575)
  const stone = mk("ancient2Stone", new Color3(0.74, 0.68, 0.57), 0.72);
  const pale = mk("ancient2Marble", new Color3(0.86, 0.82, 0.72), 0.7);
  const moss = mk("ancient2Moss", new Color3(0.42, 0.6, 0.18), 0.45);
  const shade = mk("ancient2Shade", new Color3(0.42, 0.37, 0.3), 0.6);
  const lists: Record<"stone" | "pale" | "moss" | "shade", Mesh[]> = { stone: [], pale: [], moss: [], shade: [] };
  const box = (list: keyof typeof lists, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("ancient2Part", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    lists[list].push(b);
    return b;
  };
  // A temple facing the field (-z): plinth, cella, a column row across the front, a gabled roof with its pediment.
  // yaw turns the whole temple about its centre (0 faces the field, +-pi/2 faces along the terrace)
  const temple = (x: number, y: number, z: number, w: number, k: number, yaw = 0) => {
    const d = w * 0.85, eave = w * 0.55;
    const first = Object.values(lists).map((l) => l.length);
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
    if (yaw === 0) return;
    const cos = Math.cos(yaw), sin = Math.sin(yaw);
    Object.values(lists).forEach((l, n) => {
      for (let i = first[n]; i < l.length; i++) {
        const p = l[i].position, dx = p.x - x, dz = p.z - z;
        p.x = x + dx * cos + dz * sin;
        p.z = z - dx * sin + dz * cos;
        l[i].rotation.y += yaw;
      }
    });
  };
  // Irregular mound (576, wiki ancient_2.png: not a mirrored grid but a tangle of stone blocks of mixed size climbing to
  // the crowning temple, with stairs running up between them and temples facing every way). Spec: each terrace is cut
  // into blocks 3.5-9 m wide (widths drawn left to right, so the two halves differ); behind terrace 1 every block's front
  // steps 0-3.5 m back or forward and its top 0-3 m up or down; a block's top carries a 1.6-2.6 m moss lip and, on
  // about two blocks in three, a temple 4.4-7 m wide, one in three of them turned side-on; the rest carry column pairs,
  // a lintel or a broken drum. On terraces 2-4 two side stair flights 2.4 m wide (one each side, at different x) climb
  // the face from the terrace below. Terrace 1's front edge and its box colliders stay as they were (the field's edge).
  TERRACES.forEach((t, k) => {
    if (k === 0) {
      for (let x0 = -t.half; x0 < t.half; x0 += STRIP) {
        const x = x0 + STRIP / 2, back = rimZ(Math.abs(x) + STRIP / 2) * 0.95;
        if (back - t.front >= 3) obstacles.push({ type: "box", center: new Vector3(x, 0, (t.front + back) / 2), halfX: STRIP / 2, halfZ: (back - t.front) / 2 });
      }
    }
    let x0 = -t.half, i = 0;
    while (x0 < t.half - 0.5) {
      const seed = k * 50 + i;
      let x1 = Math.min(t.half, x0 + 3.5 + seeded(seed, 21) * 5.5);
      if (t.half - x1 < 2.5) x1 = t.half;
      // The central stair keeps its slot
      const pieces: Array<[number, number]> = x0 < STAIR_HALF && x1 > -STAIR_HALF
        ? [[x0, -STAIR_HALF], [STAIR_HALF, x1]].filter(([a, b]) => b - a > 0.4) as Array<[number, number]>
        : [[x0, x1]];
      for (const [a, b] of pieces) {
        const cx = (a + b) / 2, w = b - a;
        const back = rimZ(Math.min(51, Math.max(Math.abs(a), Math.abs(b)))) * 0.95;
        const front = k === 0 ? t.front : t.front + (seeded(seed, 22) - 0.4) * 3.5;
        const h = k === 0 ? t.h + seeded(seed, 23) * 1.2 : t.h + (seeded(seed, 24) - 0.5) * 3;
        if (back - front < 3) continue;
        box("stone", w + 0.02, h, back - front, cx, h / 2, (front + back) / 2);
        const lip = 1.6 + seeded(seed, 25);
        box("moss", w + 0.02, 0.3, lip, cx, h + 0.12, front + lip / 2 + 0.1);
        box("shade", 0.2, h * 0.92, 0.12, a + 0.08, h / 2, front - 0.05);
        // A course line part way up the wall
        box("shade", w * 0.96, 0.14, 0.1, cx, h * (0.45 + seeded(seed, 26) * 0.2), front - 0.05);
        const room = back - front - lip;
        const pick = seeded(seed, 27);
        if (pick < 0.66 && w > 4.6 && room > 6) {
          const tw = Math.min(w - 0.6, 4.4 + seeded(seed, 28) * 2.6);
          const side = seeded(seed, 29) < 0.33;
          temple(cx, h, front + lip + (side ? tw * 0.55 : tw * 0.45), tw, seed, side ? (cx < 0 ? -1 : 1) * Math.PI / 2 : 0);
        } else if (pick < 0.85) {
          for (const dx of [-0.9, 0.9]) {
            const col = MeshBuilder.CreateCylinder("ancient2Column", { diameter: 0.55, height: 3.6 + seeded(seed, 30) * 1.4, tessellation: 8 }, scene);
            col.position.set(cx + dx, h + col.getBoundingInfo().boundingBox.extendSize.y, front + 1.4);
            lists.pale.push(col);
          }
          if (seeded(seed, 31) < 0.6) box("pale", 2.6, 0.4, 0.8, cx, h + 3.8, front + 1.4);
        } else {
          const drum = MeshBuilder.CreateCylinder("ancient2Drum", { diameter: 0.7, height: 1.4, tessellation: 8 }, scene);
          drum.position.set(cx + 0.6, h + 0.7, front + 1.6);
          lists.pale.push(drum);
          const fallen = MeshBuilder.CreateCylinder("ancient2Drum", { diameter: 0.6, height: 2.6, tessellation: 8 }, scene);
          fallen.rotation.z = Math.PI / 2;
          fallen.position.set(cx - 0.8, h + 0.3, front + 2.4);
          lists.pale.push(fallen);
        }
        // Shrubs spill over the lip
        for (let s = 0; s < Math.floor(w / 3); s++) {
          const shrub = MeshBuilder.CreateIcoSphere("ancient2Shrub", { radius: 0.7 + seeded(seed * 7 + s, 11) * 0.7, subdivisions: 1 }, scene);
          shrub.scaling.y = 0.75;
          shrub.position.set(a + 1.2 + s * 3 + seeded(seed * 7 + s, 12) * 1.2, h + 0.5, front + 0.6 + seeded(seed * 7 + s, 13));
          lists.moss.push(shrub);
        }
      }
      x0 = x1;
      i++;
    }
    // Two side flights climb this terrace's face from the one below, at different x on each side
    if (k > 0) {
      const below = TERRACES[k - 1];
      for (const sx of [-1, 1]) {
        const x = sx * (STAIR_HALF + 4 + seeded(k * 9 + sx + 1, 32) * (t.half - STAIR_HALF - 8));
        const rise = t.h - below.h + 1.5, run = Math.min(rise * 1.1, t.front - below.front - 0.8);
        const n = Math.max(4, Math.round(rise / 0.55));
        for (let s = 0; s < n; s++) {
          const y = below.h + rise * (s + 1) / n;
          const z0 = t.front - run + run * s / n;
          box(s % 2 === 0 ? "pale" : "stone", 2.4, y - below.h, t.front + 1.5 - z0, x, below.h + (y - below.h) / 2, (z0 + t.front + 1.5) / 2);
        }
      }
    }
  });
  // The crowning temple on a podium at the back centre of the top terrace
  const top = TERRACES[TERRACES.length - 1];
  box("stone", 12, 2.2, 7.6, 0, top.h + 1.1, top.front + 3);
  temple(0, top.h + 2.2, top.front + 3, 9, 99);
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
      mesh.material.diffuseColor.set(0.6, 0.63, 0.22);
      mesh.material.emissiveColor.set(0.08, 0.085, 0.03);
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
  // Olive meadow (576, renaissance_vs_ancient_2.png and the wiki shot: a muted yellow-green, not lime). Spec: floor
  // (0.6,0.63,0.22) barely self-lit; low faceted clumps 1-1.8 m across on a 1.1 m jittered grid inside the wall, two
  // olives (0.58,0.62,0.21) and (0.46,0.52,0.16) chosen in broad swathes by a slow sine field, thinned where it peaks.
  const lawn = [instanced("ancient2LawnLight", new Color3(0.58, 0.62, 0.21), 0.24, 0.5), instanced("ancient2LawnDark", new Color3(0.46, 0.52, 0.16), 0.22, 0.5)];
  const petals = [instanced("ancient2FlowerPink", new Color3(1, 0.42, 0.72), 0.5, 0.16), instanced("ancient2FlowerViolet", new Color3(0.52, 0.34, 1), 0.5, 0.16)];
  let i = 0;
  for (let z = -RIM.b; z < RIM.b; z += 1.1) {
    for (let x = -RIM.a; x < RIM.a; x += 1.1) {
      i += 1;
      const jx = seeded(i, 103), jz = seeded(i, 105);
      const px = x + (jx - 0.5) * 0.9, pz = z + (jz - 0.5) * 0.9;
      if (Math.hypot(px, pz) > RIM.a - 2 || onTerrace(px, pz) || onPath(px, pz)) continue;
      const swathe = Math.sin(px * 0.085 + 1.3) * Math.cos(pz * 0.1 + 0.4) + Math.sin((px + pz) * 0.045) * 0.6;
      if (swathe > 0.9 && jx > 0.5) continue;
      const w = 1 + jx * 0.8, h = 0.2 + jz * 0.15;
      lawn[swathe + jz * 0.4 > 0.45 ? 1 : 0].m.push(...Matrix.Compose(new Vector3(w, h, w * (0.8 + jz * 0.3)), Quaternion.RotationAxis(Vector3.Up(), jx * 6.28), new Vector3(px, h * 0.3 + 0.03, pz)).m);
    }
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

// Gate pavilions (573, wiki ancient_2.png and greek_ancient_2.png): where the field paths reach the ring wall,
// small beige pavilions stand set into it: a flat-roofed cella on the left and front-right, and on the front
// centre line a larger columned gate with a gabled pediment, each flanked by a pair of cypresses. Spec: at the
// path ends, angles 188, 320 (cellas: 6.5 m wide along the wall, 4.5 m deep, 3.6 m walls, a 0.45 m roof slab
// overhanging 0.4 m, two porch columns and a dark doorway facing the centre) and 250 degrees (gate: 8 m wide, 5 m
// deep, 4.4 m walls, four columns, a pediment); backs against the wall (centre 2 m inside it); one 3.4 m
// cylinder collider each (clear of the stage armies at x 29..37, |z| <= 18).
const PAVILIONS: Array<{ deg: number; gate: boolean }> = [{ deg: 188, gate: false }, { deg: 320, gate: false }];

// Front propylon (574, greek_ancient_2.png: on the front centre line the ring wall opens through a gabled gate:
// two plain side piers, four columns on each face, an architrave and a triangular pediment facing out, the field path
// running straight through it). Spec: at 250 degrees, centred on the wall line (r 49), 8.4 m wide along the wall,
// 5.4 m deep through it, a 0.35 m plinth; piers 0.9 m at the ends, columns 0.6 m at +-1.6 and +-2.75 m 0.4 m in from
// each face, 4.4 m tall; 0.55 m architrave; a 2 m triangular pediment prism whose gable faces in and out; a pale
// paving strip 2.6 m wide on the plinth continuing the path. The ring wall segments and cypresses in its span go;
// the ring's colliders stay (the wall line stays closed to units), plus one 1 m collider per pier.
function frontPropylon(scene: Scene, obstacles: Obstacle[]): void {
  const deg = 250, a = (deg * Math.PI) / 180, Rg = 49;
  const cx = Math.cos(a) * Rg, cz = Math.sin(a) * Rg;
  const W = 8.4, D = 5.4, H = 4.4, P = 0.35;
  for (const mesh of scene.meshes) {
    if (!/^(ancient2RingWall|ancient2RingCoping|ancient2Cypress)$/.test(mesh.name)) continue;
    const d = Math.hypot(mesh.position.x - cx, mesh.position.z - cz);
    if (d > (mesh.name === "ancient2Cypress" ? 5.5 : W / 2 + 0.3)) continue;
    mesh.setEnabled(false);
    if (mesh.name !== "ancient2Cypress") continue;
    const at = obstacles.findIndex((o) => Math.hypot(o.center.x - mesh.position.x, o.center.z - mesh.position.z) < 0.05);
    if (at >= 0) obstacles.splice(at, 1);
  }
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const plaster = mk("ancient2PropylonPlaster", new Color3(0.8, 0.7, 0.52), 0.26);
  const pale = mk("ancient2PropylonPale", new Color3(0.9, 0.83, 0.68), 0.28);
  const leaves = mk("ancient2PropylonCypress", new Color3(0.33, 0.5, 0.16), 0.18);
  const root = new Mesh("ancient2PropylonRoot", scene);
  root.position.set(cx, 0, cz);
  // Local +z faces the field centre, local x runs along the wall
  root.rotation.y = Math.PI / 2 - a + Math.PI;
  const piece = (mesh: Mesh, mat: StandardMaterial, x: number, y: number, z: number) => {
    mesh.parent = root;
    mesh.position.set(x, y, z);
    mesh.material = mat;
    mesh.receiveShadows = true;
    mesh.isPickable = false;
    return mesh;
  };
  piece(MeshBuilder.CreateBox("ancient2PropylonPlinth", { width: W + 0.8, height: P, depth: D + 0.6 }, scene), pale, 0, P / 2, 0);
  for (const side of [-1, 1]) {
    piece(MeshBuilder.CreateBox("ancient2PropylonPier", { width: 0.9, height: H, depth: D }, scene), plaster, side * (W / 2 - 0.45), P + H / 2, 0);
    for (const x of [1.6, 2.75]) {
      for (const face of [-1, 1]) {
        piece(MeshBuilder.CreateCylinder("ancient2PropylonColumn", { diameter: 0.6, height: H, tessellation: 10 }, scene), pale, side * x, P + H / 2, face * (D / 2 - 0.4));
      }
    }
    const h = 5 + seeded(deg + side, 151) * 1.5;
    piece(MeshBuilder.CreateCylinder("ancient2PropylonCypress", { height: h, diameterTop: 0.1, diameterBottom: 1.4, tessellation: 7 }, scene), leaves, side * (W / 2 + 1.4), h / 2 + 0.2, 1.4);
    const px = cx + Math.cos(root.rotation.y) * side * (W / 2 - 0.45), pz = cz - Math.sin(root.rotation.y) * side * (W / 2 - 0.45);
    obstacles.push({ type: "cylinder", center: new Vector3(px, 0, pz), radius: 1 });
  }
  piece(MeshBuilder.CreateBox("ancient2PropylonArchitrave", { width: W + 0.4, height: 0.55, depth: D + 0.4 }, scene), pale, 0, P + H + 0.27, 0);
  const clay = scene.getMaterialByName("ancient2PathClay");
  const paving = piece(MeshBuilder.CreateBox("ancient2PropylonPaving", { width: 2.6, height: 0.04, depth: D + 0.6 }, scene), pale, 0, P + 0.02, 0);
  if (clay instanceof StandardMaterial) paving.material = clay;
  // Pediment: a triangular prism, gable faces at local z +-hd, ridge along z
  const hw = (W + 0.6) / 2, ph = 2, hd = (D + 0.6) / 2;
  const A = [-hw, 0, hd], B = [hw, 0, hd], C = [0, ph, hd], Dv = [-hw, 0, -hd], E = [hw, 0, -hd], F = [0, ph, -hd];
  const tris = [[A, B, C], [Dv, F, E], [A, C, F], [A, F, Dv], [B, E, F], [B, F, C], [A, Dv, E], [A, E, B]];
  const positions: number[] = [], indices: number[] = [];
  tris.forEach((t, i) => { for (const v of t) positions.push(...v); indices.push(i * 3, i * 3 + 1, i * 3 + 2); });
  const normals: number[] = [];
  VertexData.ComputeNormals(positions, indices, normals);
  // Babylon's winding may face the first gable inward: flip every triangle if so
  if (normals[2] < 0) {
    for (let i = 0; i < indices.length; i += 3) [indices[i + 1], indices[i + 2]] = [indices[i + 2], indices[i + 1]];
    VertexData.ComputeNormals(positions, indices, normals);
  }
  const prism = new Mesh("ancient2PropylonPediment", scene);
  const data = new VertexData();
  data.positions = positions;
  data.indices = indices;
  data.normals = normals;
  data.applyToMesh(prism);
  piece(prism, plaster, 0, P + H + 0.55, 0);
}

function gatePavilions(scene: Scene, obstacles: Obstacle[]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const plaster = mk("ancient2PavilionPlaster", new Color3(0.8, 0.7, 0.52), 0.26);
  const pale = mk("ancient2PavilionPale", new Color3(0.9, 0.83, 0.68), 0.28);
  const dark = mk("ancient2PavilionDoor", new Color3(0.16, 0.12, 0.09), 0.2);
  const leaves = mk("ancient2PavilionCypress", new Color3(0.33, 0.5, 0.16), 0.18);
  const R = RIM.a - 1.4 - 2;
  for (const { deg, gate } of PAVILIONS) {
    const a = (deg * Math.PI) / 180;
    const root = new Mesh("ancient2PavilionRoot", scene);
    root.position.set(Math.cos(a) * R, 0, Math.sin(a) * R);
    // Local +z faces the field centre, local x runs along the wall
    root.rotation.y = Math.PI / 2 - a + Math.PI;
    const W = gate ? 8 : 6.5, D = gate ? 5 : 4.5, H = gate ? 4.4 : 3.6;
    const piece = (mesh: Mesh, mat: StandardMaterial, x: number, y: number, z: number) => {
      mesh.parent = root;
      mesh.position.set(x, y, z);
      mesh.material = mat;
      mesh.receiveShadows = true;
      mesh.isPickable = false;
      return mesh;
    };
    piece(MeshBuilder.CreateBox("ancient2Pavilion", { width: W, height: H, depth: D - 1.6 }, scene), plaster, 0, H / 2, -0.8);
    piece(MeshBuilder.CreateBox("ancient2PavilionPlinth", { width: W + 0.6, height: 0.35, depth: D + 0.6 }, scene), pale, 0, 0.17, 0);
    piece(MeshBuilder.CreateBox("ancient2PavilionRoof", { width: W + 0.8, height: 0.45, depth: D + 0.8 }, scene), pale, 0, H + 0.22, 0);
    piece(MeshBuilder.CreateBox("ancient2PavilionDoor", { width: gate ? 2.4 : 1.6, height: gate ? 3.2 : 2.4, depth: 0.12 }, scene), dark, 0, (gate ? 3.2 : 2.4) / 2 + 0.35, -0.8 + (D - 1.6) / 2 + 0.05);
    const cols = gate ? [-3.1, -1.4, 1.4, 3.1] : [-1.9, 1.9];
    for (const x of cols) {
      piece(MeshBuilder.CreateCylinder("ancient2PavilionColumn", { diameter: 0.55, height: H - 0.35, tessellation: 8 }, scene), pale, x, 0.35 + (H - 0.35) / 2, D / 2 - 0.4);
    }
    if (gate) {
      const gable = piece(MeshBuilder.CreateBox("ancient2PavilionPediment", { width: W + 0.6, height: 2.6, depth: 2.6 }, scene), plaster, 0, H + 0.45, 0);
      gable.rotation.x = Math.PI / 4;
    }
    for (const side of [-1, 1]) {
      const h = 4.5 + seeded(deg + side, 151) * 1.5;
      piece(MeshBuilder.CreateCylinder("ancient2PavilionCypress", { height: h, diameterTop: 0.1, diameterBottom: 1.4, tessellation: 7 }, scene), leaves, side * (W / 2 + 1.3), h / 2 + 0.2, 0.6);
    }
    obstacles.push({ type: "cylinder", center: new Vector3(root.position.x, 0, root.position.z), radius: 3.4 });
  }
}

// Crisp disc edge (574, probe: rays find nothing past r 51 yet the top shot draws a lime apron out to the old 54 x 48
// rounded rectangle: the base floor's GPU buffer never took roundIsland's remap). Spec: the floor discs ("ground",
// "centerGrass") are trimmed to the wall's outer face (r 50.3) and re-uploaded as fresh buffers so the drum's brown rim,
// not a band of grass, meets the wall; the floor, lawn clumps and flower drifts also leave the glow pass. The island
// reads as one hard-edged circular disc.
function crispRim(scene: Scene, built: Set<unknown>): void {
  const glow = scene.getGlowLayerByName("glow");
  const lawn = /^(ground|centerGrass|ancient2Lawn|ancient2Flower|ancient2FieldPath)/;
  for (const mesh of scene.meshes) {
    if (!lawn.test(mesh.name) || !(mesh instanceof Mesh)) continue;
    glow?.addExcludedMesh(mesh);
    if (!built.has(mesh) || (mesh.name !== "ground" && mesh.name !== "centerGrass")) continue;
    const positions = mesh.getVerticesData("position");
    if (!positions) continue;
    for (let i = 0; i < positions.length; i += 3) {
      const r = Math.hypot(positions[i], positions[i + 2]);
      if (r <= RIM.a - 0.7) continue;
      positions[i] *= (RIM.a - 0.7) / r;
      positions[i + 2] *= (RIM.a - 0.7) / r;
    }
    // The base floor's buffers are static: updateVerticesData changes only the CPU copy (picking saw the circle while the
    // GPU still drew the old 54 x 48 rounded rectangle, 573/574), so the positions are set as a fresh buffer
    mesh.setVerticesData("position", positions, false);
    mesh.refreshBoundingInfo();
  }
}

// Open skyline (575, greek_ancient_2.png: nothing stands behind the island; the temple mound is the only mass
// against the sky). Spec: the base's far ridge range and its second floating slab (mountainBase, mountainCap,
// mountainRoot) are hidden; the clouds stay.
function openSkyline(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && mesh.name.startsWith("mountain")) mesh.setEnabled(false);
    // The base's translucent placement-guide slabs reach past the round rim (the pale sheet behind the island, critic 575)
    if (built.has(mesh) && /^campaign_zone_(overlay|border)_/.test(mesh.name)) mesh.setEnabled(false);
  }
}

// Clear sky (575, greek_ancient_2.png: the island floats in a pale-to-mid blue sky with white puffy clouds, no beige
// haze). Spec: clear colour (0.3, 0.6, 0.88), fog a pale sky blue (0.66, 0.8, 0.93), base clouds kept white; both
// restored on dispose.
function clearSky(scene: Scene): () => void {
  const oldClear = scene.clearColor.clone();
  const oldFog = scene.fogColor.clone();
  scene.clearColor.set(0.3, 0.6, 0.88, 1);
  scene.fogColor = new Color3(0.66, 0.8, 0.93);
  return () => {
    scene.clearColor.copyFrom(oldClear);
    scene.fogColor.copyFrom(oldFog);
  };
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
  openSkyline(scene, built);
  greenLawn(scene, built);
  fieldPaths(scene);
  templeComplex(scene, obstacles);
  gatePavilions(scene, obstacles);
  frontPropylon(scene, obstacles);
  crispRim(scene, built);
  const restoreSky = clearSky(scene);
  return { ...result, dispose: () => { restoreSky(); result.dispose?.(); }, obstacles };
}
