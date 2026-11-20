// TABS "Viking Sandbox" (viking map): a big flat icy arena closed on every side by a giant tiered ice-cliff wall, a great gate in its left
// side (reference/maps/wiki/viking_sandbox.png, reference/maps/winter_viking_sandbox.png). Built on campaign.challenge (base(); the base is
// shared with four other maps: never edit it, dress its build here).
//
// Ice wall: three stepped tiers of leaning ice buttresses, each joined at the top by long fractured snow shelves.
// The base's autumn tree ring (every "trunk" with its canopy, the haze band) goes with its colliders; one 3.5 m collider per tier-1 slab;
// placement stays inside the wall (placementZones clipped to |x| <= 44). The stage army (pirate.arrows_and_arrow) stands at x 29..36, |z| <= 10.
//
// [R] 574 rebuild of look a (CONFIRM 571/572/573 lists; wiki viking_sandbox.png, winter_viking_sandbox.png), three mechanisms:
// - Skyline: the wall's top is level stepped terraces with a flat snowy top. The free-standing rim peaks go; the jutting ice columns stop
//   flush with their tier (0.94-1.02 of its top, not 1.2-1.45x). Only one side (right-back, 18-58 deg) carries two big crystal clusters:
//   5-6 leaning hexagonal prisms each, 6-12 m, deep cyan, rooted on the top tier.
// - Gate: the left wall's gap (166-194 deg) is closed by a great carved gate readable from above: two leaves 12 m wide, 21 m tall, 3 m
//   thick at x -47 in a darker steel-teal ice (0.24, 0.5, 0.64) against the white wall, each leaf carrying a 2 x 3 grid of square spiral
//   rune panels (three nested pale frames); 7 m flanking towers 25 m tall with four ice spikes each; a lintel beam with a row of spikes;
//   heavy chains (0.36 m links) drooping from each tower top out to the wall crest beside it and a third across the lintel.
// - Floor balance: about half the floor is snow. The blue ice sheet reaches only 0.72 R (a broad snow band under the walls), and over the
//   ice lie 12 snow tongues from the band (18-30 m long, 8-14 m wide) and 12 snow islands (6-14 m) with a 0.25 m raised lip, the cracks under
//   them.
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const TIERS = [
  { at: 0.86, h0: 5, h1: 7 },
  { at: 0.93, h0: 9, h1: 12 },
  { at: 0.99, h0: 14, h1: 18 },
];
const STEP = 6;
const INSIDE_X = 44;
const ARENA_RADIUS = 51;

function rimPoint(deg: number, f: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [Math.cos(a) * ARENA_RADIUS * f, Math.sin(a) * ARENA_RADIUS * f];
}

function clearTreeRing(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (mesh.name === "hazeTreeline") mesh.setEnabled(false);
    else if (mesh.name === "trunk" && !mesh.parent) {
      gone.push([mesh.position.x, mesh.position.z]);
      mesh.setEnabled(false);
    }
  }
  return obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
}

// The base's field junk (Challenge Bluffs: two dark barricade slabs, the ruin block with its pillar, the ball-topped totem) goes with its
// colliders: TABS's arena floor is flat open ice. Every one of those is a "<displayName>_box|_cyl|_totem_top" mesh; a collider goes when its
// centre sits under a removed mesh.
function clearFieldJunk(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (!/^Challenge Bluffs_(box|cyl|totem_top)$/.test(mesh.name)) continue;
    gone.push([mesh.position.x, mesh.position.z]);
    mesh.setEnabled(false);
  }
  return obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
}

// The rest of the base's field dressing (565, named by a probe of the built set): the low dark dry-stone wall runs ("wallStone", the black
// block row of the battle shot), navy boulder clusters ("boulder"), gold hay bales ("hayBale"), grass mounds ("hill"), stumps ("stump"),
// and the two pits (a dark see-through box overlay each, with its hazard). TABS's arena floor is flat open ice: all of them go, and every
// base collider standing inside 0.8 of the rim with them (the ice wall's own colliders are added after).
const FIELD_DRESSING = new Set(["wallStone", "boulder", "hayBale", "hill", "stump", "campaign_hazard_box_pit"]);

function clearFieldDressing(scene: Scene, built: Set<unknown>, result: MapBuildResult, obstacles: Obstacle[]): { obstacles: Obstacle[]; hazards: MapBuildResult["hazards"] } {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && FIELD_DRESSING.has(mesh.name)) mesh.setEnabled(false);
  }
  const inside = (x: number, z: number) => (x / 54) ** 2 + (z / 48) ** 2 < 0.8 ** 2;
  return {
    obstacles: obstacles.filter((o) => !inside(o.center.x, o.center.z)),
    hazards: result.hazards.filter((h) => h.kind !== "pit"),
  };
}

// Snow and cracked ice floor (564), spec read off the wiki shot: the arena floor is pale blue-white snow; over it lie big blotchy patches of
// darker teal-blue ice (each 6-16 m across, ragged lobed outlines, about 45% of the floor, larger towards the middle), and thin white crack
// lines (3-9 m, a few joined at angles) run across the ice. The base's autumn colours go: ground and grass materials turn to snow, the tuft
// clumps and grass blades are hidden. All drawn only (flat, 3-8 cm high), nothing in the way.
const SNOW = new Color3(0.8, 0.86, 0.95);
const SNOW_SHADE = new Color3(0.3, 0.36, 0.44);
const ICE_PATCH = new Color3(0.36, 0.62, 0.72);

function snowAndIce(scene: Scene, built: Set<unknown>): void {
  for (const name of ["groundMat", "grass", "dryGrass", "grassBladeDark", "grassBladeLight"]) {
    const m = scene.getMaterialByName(name) as StandardMaterial | null;
    if (!m) continue;
    m.diffuseColor = SNOW.clone();
    m.emissiveColor = SNOW_SHADE.clone();
    m.specularColor = new Color3(0.05, 0.05, 0.06);
  }
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    const n = mesh.name;
    if (n === "ground" || n.startsWith("campaign_zone_") || n.startsWith("fieldBlades_") || n.startsWith("fieldTufts_") || n === "grassTuft" || n === "centerGrass" || n === "flowerDot") mesh.setEnabled(false);
  }
  const ground = MeshBuilder.CreateCylinder("vikingSandboxCircularFloor", {
    diameter: ARENA_RADIUS * 2, height: 0.16, tessellation: 96,
  }, scene);
  ground.position.y = -0.08;
  ground.material = scene.getMaterialByName("groundMat");
  ground.receiveShadows = true;
  const iceMat = new StandardMaterial("vikingSandboxFloorIce", scene);
  iceMat.diffuseColor = ICE_PATCH;
  iceMat.emissiveColor = ICE_PATCH.scale(0.4);
  iceMat.specularColor = new Color3(0.15, 0.18, 0.2);
  const crackMat = new StandardMaterial("vikingSandboxCrack", scene);
  crackMat.diffuseColor = new Color3(0.9, 0.95, 1);
  crackMat.emissiveColor = new Color3(0.45, 0.5, 0.55);
  crackMat.specularColor = Color3.Black();
  // [R] 571 floor spec (wiki shot, pirate.arrows_and_arrow.png; CONFIRM 568/569): the floor is NOT one blue
  // patch inside a white ring. Blue ice reaches out to ~0.8 R, cut into polygon plates 7-12 m across by thin
  // white cracks that join into closed cells; across it lie large irregular snow shapes: 9 tongues running in
  // from the rim (14-24 m long, 5-10 m wide, lobed, reaching to ~0.3 R) and 7 snow islands (4-11 m) scattered
  // over the middle, so the blue reads as broken fields between snow. Snow shapes sit above the ice and cracks.
  const edge = (angle: number) => 0.72 + 0.05 * Math.sin(angle * 5) + 0.04 * Math.sin(angle * 11);
  const ice = MeshBuilder.CreateCylinder("vikingSandboxIceSheet", { diameter: ARENA_RADIUS * 2, height: 0.045, tessellation: 96 }, scene);
  const vertices = ice.getVerticesData("position")!;
  for (let i = 0; i < vertices.length; i += 3) {
    const reach = edge(Math.atan2(vertices[i + 2], vertices[i]));
    vertices[i] *= reach;
    vertices[i + 2] *= reach;
  }
  ice.setVerticesData("position", vertices);
  ice.refreshBoundingInfo();
  ice.position.y = 0.015;
  ice.material = iceMat;
  ice.receiveShadows = true;
  ice.isPickable = false;
  const cracks: Mesh[] = [];
  const insideIce = (x: number, z: number) => Math.hypot(x, z) < ARENA_RADIUS * edge(Math.atan2(z, x)) - 0.8;
  // Plate network: jittered 9.5 m grid of nodes joined to right and back neighbours (a sixth left out) and
  // one diagonal per cell, so the cracks close into uneven polygon plates.
  const GRID = 9.5;
  const span = Math.ceil(ARENA_RADIUS / GRID) + 1;
  const node = (i: number, j: number): [number, number] => {
    const k = (i + 20) * 61 + (j + 20);
    return [i * GRID + (seeded(k, 61) - 0.5) * GRID * 0.7, j * GRID + (seeded(k, 62) - 0.5) * GRID * 0.7];
  };
  const crackLine = (a: [number, number], b: [number, number], k: number) => {
    const [ax, az] = a, [bx, bz] = b;
    const len = Math.hypot(bx - ax, bz - az);
    const push = (seeded(k, 63) - 0.5) * len * 0.3;
    const mx = (ax + bx) / 2 - ((bz - az) / len) * push, mz = (az + bz) / 2 + ((bx - ax) / len) * push;
    for (const [px, pz, qx, qz] of [[ax, az, mx, mz], [mx, mz, bx, bz]]) {
      if (!insideIce(px, pz) || !insideIce(qx, qz)) continue;
      const l = Math.hypot(qx - px, qz - pz);
      const c = MeshBuilder.CreateBox("vsIceCrack", { width: l + 0.1, height: 0.018, depth: 0.1 + seeded(k, 64) * 0.06 }, scene);
      c.rotation.y = -Math.atan2(qz - pz, qx - px);
      c.position.set((px + qx) / 2, 0.043, (pz + qz) / 2);
      cracks.push(c);
    }
  };
  for (let i = -span; i <= span; i++) {
    for (let j = -span; j <= span; j++) {
      const k = (i + 20) * 61 + (j + 20);
      if (seeded(k, 65) > 0.16) crackLine(node(i, j), node(i + 1, j), k * 3);
      if (seeded(k, 66) > 0.16) crackLine(node(i, j), node(i, j + 1), k * 3 + 1);
      if (seeded(k, 67) > 0.55) crackLine(node(i, j), node(i + 1, j + 1), k * 3 + 2);
    }
  }
  // Snow tongues and islands: lobed discs, stretched and turned.
  const snowMat = new StandardMaterial("vikingSandboxSnowDrift", scene);
  snowMat.diffuseColor = SNOW.clone();
  snowMat.emissiveColor = SNOW_SHADE.scale(1.25);
  snowMat.specularColor = new Color3(0.04, 0.04, 0.05);
  const drifts: Mesh[] = [];
  const drift = (x: number, z: number, length: number, width: number, yaw: number, k: number) => {
    const disc = MeshBuilder.CreateCylinder("vsSnowDrift", { diameter: 2, height: 0.25, tessellation: 40 }, scene);
    const pos = disc.getVerticesData("position")!;
    for (let v = 0; v < pos.length; v += 3) {
      const a = Math.atan2(pos[v + 2], pos[v]);
      if (Math.hypot(pos[v], pos[v + 2]) < 1e-6) continue;
      const r = 1 + 0.22 * Math.sin(a * 3 + k) + 0.14 * Math.sin(a * 7 + k * 2.3) + 0.08 * Math.cos(a * 13 + k);
      pos[v] *= r * length / 2;
      pos[v + 2] *= r * width / 2;
    }
    disc.setVerticesData("position", pos);
    disc.rotation.y = yaw;
    disc.position.set(x, 0.08 + (k % 5) * 0.004, z);
    drifts.push(disc);
  };
  for (let t = 0; t < 12; t++) {
    const a = (t / 12) * Math.PI * 2 + seeded(t, 71) * 0.4;
    const length = 18 + seeded(t, 72) * 12;
    const r = ARENA_RADIUS * 0.74 - length * 0.4;
    drift(Math.cos(a) * r, Math.sin(a) * r, length, 8 + seeded(t, 73) * 6, -a + (seeded(t, 74) - 0.5) * 0.5, t);
  }
  for (let s = 0; s < 12; s++) {
    const a = seeded(s, 75) * Math.PI * 2, r = 4 + seeded(s, 76) * 24;
    const size = 6 + seeded(s, 77) * 8;
    drift(Math.cos(a) * r, Math.sin(a) * r, size * 1.4, size, seeded(s, 78) * Math.PI, s + 20);
  }
  const driftMesh = Mesh.MergeMeshes(drifts, true);
  if (driftMesh) {
    driftMesh.name = "vikingSandboxSnowDrifts";
    driftMesh.material = snowMat;
    driftMesh.receiveShadows = true;
    driftMesh.isPickable = false;
  }
  const merged = Mesh.MergeMeshes(cracks, true);
  if (merged) {
    merged.name = "vikingSandboxIceCracks";
    merged.material = crackMat;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

function iceWall(scene: Scene, obstacles: Obstacle[]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = new Color3(0.2, 0.22, 0.25);
    return m;
  };
  const ice = mk("vikingSandboxIce", new Color3(0.55, 0.82, 0.9), 0.35);
  const snow = mk("vikingSandboxSnow", new Color3(0.88, 0.94, 0.98), 0.35);
  const blocks: Mesh[] = [], caps: Mesh[] = [];
  TIERS.forEach((tier, t) => {
    for (let deg = 0; deg < 360; deg += STEP) {
      const k = t * 100 + deg / STEP;
      const d = deg + (t % 2) * (STEP / 2) + (seeded(k, 1) - 0.5) * 2;
      if (Math.abs(d - 180) < 14) continue;
      const [x, z] = rimPoint(d, tier.at);
      const along = 6.5 + seeded(k, 2) * 8.5;
      const h = tier.h0 + seeded(k, 3) * (tier.h1 - tier.h0);
      const yaw = -(d * Math.PI) / 180 - Math.PI / 2;
      const slab = MeshBuilder.CreateCylinder("vsIceBlock", { diameterTop: along * (0.66 + seeded(k, 4) * 0.52), diameterBottom: along, height: h, tessellation: 5 }, scene);
      slab.scaling.z = (4 + seeded(k, 5) * 2) / along;
      slab.rotation.set((seeded(k, 4) - 0.5) * 0.16, yaw + (seeded(k, 5) - 0.5) * 0.3, (seeded(k, 6) - 0.5) * 0.27);
      slab.position.set(x, h / 2 - 0.2, z);
      blocks.push(slab);
      if (t === 0) obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 3.5 });
    }
    // [R] 571 wall spec (wiki shot; CONFIRM 568/569): no continuous narrow snow band per tier. Each tier's
    // snow is broken into separate ledges 9-24 degrees long, each with its own depth (1.5-6 m, a few broad
    // 7-9 m shelves) and its own height (-2..+1.2 m off the tier top), tilted a little; between ledges a
    // 3-7 degree break where a jutting ice column stands proud of the ledges (1.2-1.45x the tier height,
    // pushed 1.5-3 m inward). The gate gap (164..196 deg) stays open.
    let angle = (t * 7) % 11;
    let n = 0;
    while (angle < 360) {
      n += 1;
      const k = t * 1000 + n;
      const arc = 9 + seeded(k, 11) * 15;
      const end = Math.min(360, angle + arc);
      const broad = t > 0 && seeded(k, 12) > 0.75;
      const depth = (broad ? 7 + seeded(k, 13) * 2 : 1.5 + seeded(k, 13) * (t === 0 ? 2 : 4.5)) / ARENA_RADIUS;
      // 572: each ledge is a thick faceted snow cap (2-3.2 m lip) on an ice body that drops from the cap's
      // inner lip to the tier below (or the floor), so no ledge hangs as a plate partway up the columns.
      const lipDrop = broad ? tier.h1 - TIERS[t - 1].h1 : 2 + seeded(k, 23) * 1.2;
      const body: Vector3[][] = [[], []];
      const rest = t === 0 ? -0.1 : TIERS[t - 1].h1 - 0.6;
      const lift = -2 + seeded(k, 14) * 3.2;
      const tilt = (seeded(k, 15) - 0.5) * 1.6;
      const rows: Vector3[][] = [[], [], [], []];
      for (let a = angle; a <= end + 0.01; a += 2) {
        if (a > 164 && a < 196) continue;
        const f = (a - angle) / Math.max(1, end - angle);
        const y = tier.h1 + lift + tilt * (f - 0.5) + seeded(k * 7 + a, 9) * 0.3;
        const inner = tier.at - depth * (0.75 + 0.25 * Math.sin(f * Math.PI)) - seeded(k + a, 7) * 0.012;
        const [ix, iz] = rimPoint(a, inner);
        const [ox, oz] = rimPoint(a, tier.at + 0.05);
        const lipY = y - lipDrop + (seeded(k * 5 + a, 24) - 0.5) * 0.8;
        rows[0].push(new Vector3(ix * 1.012, lipY, iz * 1.012));
        body[0].push(new Vector3(ix * 1.014, lipY + 0.2, iz * 1.014));
        body[1].push(new Vector3(ix * 1.03, Math.min(rest, lipY), iz * 1.03));
        rows[1].push(new Vector3(ix, y - 0.1, iz));
        rows[2].push(new Vector3(ox, y + 0.3, oz));
        const foot = t === 0 ? -0.1 : TIERS[t - 1].h0 - 0.45;
        rows[3].push(new Vector3(ox, foot, oz));
      }
      if (rows[0].length >= 2) caps.push(MeshBuilder.CreateRibbon("vsIceShelf", { pathArray: rows, sideOrientation: Mesh.DOUBLESIDE }, scene));
      if (body[0].length >= 2) blocks.push(MeshBuilder.CreateRibbon("vsIceLedgeBody", { pathArray: body, sideOrientation: Mesh.DOUBLESIDE }, scene));
      const gap = 3 + seeded(k, 16) * 4;
      const colAngle = end + gap / 2;
      if (colAngle < 360 && Math.abs(colAngle - 180) > 18) {
        const h = tier.h1 * (0.94 + seeded(k, 17) * 0.08);
        const [cx, cz] = rimPoint(colAngle, tier.at - (1.5 + seeded(k, 18) * 1.5) / ARENA_RADIUS);
        const width = 3.2 + seeded(k, 19) * 2.4;
        const column = MeshBuilder.CreateCylinder("vsIceColumn", { diameterTop: width * 0.55, diameterBottom: width, height: h, tessellation: 5 }, scene);
        column.position.set(cx, h / 2 - 0.2, cz);
        column.rotation.set((seeded(k, 20) - 0.5) * 0.18, seeded(k, 21) * Math.PI, (seeded(k, 22) - 0.5) * 0.18);
        blocks.push(column);
        if (t === 0) obstacles.push({ type: "cylinder", center: new Vector3(cx, 0, cz), radius: width / 2 });
      }
      angle = end + gap;
    }
  });
  for (const [list, m, name] of [[blocks, ice, "vikingSandboxIceWall"], [caps, snow, "vikingSandboxIceSnow"]] as const) {
    const merged = Mesh.MergeMeshes([...list], true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = m;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  runeGate(scene, snow, obstacles);
}

// The great gate (574 [R], spec at the head of the file).
function runeGate(scene: Scene, snow: StandardMaterial, obstacles: Obstacle[]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = new Color3(0.12, 0.14, 0.16);
    return m;
  };
  const steel = mk("vikingSandboxGateSteel", new Color3(0.24, 0.5, 0.64), 0.3);
  const relief = mk("vikingSandboxGateRelief", new Color3(0.72, 0.9, 0.96), 0.4);
  const chainMat = mk("vikingSandboxGateChain", new Color3(0.2, 0.36, 0.46), 0.3);
  const X = -47;
  const parts: Mesh[] = [], reliefs: Mesh[] = [], chains: Mesh[] = [];
  const box = (list: Mesh[], w: number, h: number, d: number, x: number, y: number, z: number) => {
    const part = MeshBuilder.CreateBox("vikingSandboxGate", { width: w, height: h, depth: d }, scene);
    part.position.set(x, y, z);
    list.push(part);
    return part;
  };
  const spike = (list: Mesh[], x: number, y: number, z: number, h: number, w: number) => {
    const s = MeshBuilder.CreateCylinder("vikingSandboxGateSpike", { height: h, diameterTop: 0, diameterBottom: w, tessellation: 4 }, scene);
    s.position.set(x, y + h / 2, z);
    list.push(s);
  };
  // Two leaves, z -12..0 and 0..12, with a 2 x 3 grid of square spiral rune panels on the arena face
  for (const side of [-1, 1]) {
    box(parts, 3, 21, 11.8, X, 10.5, side * 6);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        const y = 4 + r * 6.2, z = side * (3 + c * 5.8);
        for (let ring = 0; ring < 3; ring++) {
          const s = 4.2 - ring * 1.3, fx = X + 1.55 + ring * 0.12;
          // A square frame of four bars: the nested frames read as a spiral rune
          box(reliefs, 0.2, 0.32, s, fx, y + s / 2, z);
          box(reliefs, 0.2, 0.32, s, fx, y - s / 2, z);
          box(reliefs, 0.2, s, 0.32, fx, y, z + s / 2);
          box(reliefs, 0.2, s * (ring === 2 ? 0.5 : 1), 0.32, fx, y - (ring === 2 ? s / 4 : 0), z - s / 2);
        }
      }
    }
    // Flanking tower with a spiked crown
    const tz = side * 15.5;
    box(parts, 7, 25, 7, X - 0.5, 12.5, tz);
    box(parts, 7.8, 1.2, 7.8, X - 0.5, 25.4, tz);
    for (const [dx, dz] of [[-2.2, -2.2], [-2.2, 2.2], [2.2, -2.2], [2.2, 2.2]]) spike(parts, X - 0.5 + dx, 26, tz + dz, 4.5, 1.8);
  }
  // Lintel with a row of spikes over the leaves
  box(parts, 4, 2.4, 25, X, 22.2, 0);
  for (let z = -10; z <= 10; z += 2.5) spike(parts, X, 23.4, z, 2.6 + (Math.abs(z) < 2 ? 1.6 : 0), 1.1);
  // Chains: tower top to the wall crest beside it, and one across the lintel
  const hang = (from: Vector3, to: Vector3, sag: number, n: number) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const link = MeshBuilder.CreateTorus("vikingSandboxChainLink", { diameter: 1.2, thickness: 0.36, tessellation: 8 }, scene);
      link.position.set(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t - sag * 4 * t * (1 - t), from.z + (to.z - from.z) * t);
      link.rotation.set(i % 2 === 0 ? Math.PI / 2 : 0, Math.atan2(to.x - from.x, to.z - from.z), 0);
      chains.push(link);
    }
  };
  for (const side of [-1, 1]) {
    const crest = Math.atan2(side * 30, -42);
    hang(new Vector3(X, 24.5, side * 15.5), new Vector3(Math.cos(crest) * 49, 18, Math.sin(crest) * 49), 4, 26);
  }
  hang(new Vector3(X + 2.2, 21.5, -12), new Vector3(X + 2.2, 21.5, 12), 3.2, 30);
  for (const [list, m, name] of [[parts, steel, "vikingSandboxGateBody"], [reliefs, relief, "vikingSandboxGateRunes"], [chains, chainMat, "vikingSandboxGateChains"]] as const) {
    const merged = Mesh.MergeMeshes([...list], true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = m;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  // Snow on the lintel top
  const lintelSnow = MeshBuilder.CreateBox("vikingSandboxGateSnow", { width: 4.3, height: 0.5, depth: 25.4 }, scene);
  lintelSnow.position.set(X, 23.6, 0);
  lintelSnow.material = snow;
  obstacles.push({ type: "box", center: new Vector3(X, 0, 0), halfX: 3.5, halfZ: 19 });
}

function iceBody(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && /^island(Under|Shelf|Cliff)/.test(mesh.name)) mesh.setEnabled(false);
  }
  const ice = new StandardMaterial("vikingSandboxGlacier", scene);
  ice.diffuseColor = new Color3(0.63, 0.88, 0.95);
  ice.emissiveColor = ice.diffuseColor.scale(0.62);
  ice.specularColor = Color3.Black();
  const crystal = new StandardMaterial("vikingSandboxCrystal", scene);
  crystal.diffuseColor = new Color3(0.21, 0.62, 0.82);
  crystal.emissiveColor = crystal.diffuseColor.scale(0.54);
  crystal.specularColor = Color3.Black();
  const rings = [[-0.12, 1.03], [-8, 0.98], [-18, 0.82], [-26, 0.52], [-28, 0]];
  const pathArray = rings.map(([y, scale], tier) => Array.from({ length: 61 }, (_, i) => {
    const k = i % 60;
    const [x, z] = rimPoint(k * 6 + tier * 2.3, scale * (1 + 0.035 * (seeded(k, 311) - 0.5)));
    return new Vector3(x, y - (tier === 0 || scale === 0 ? 0 : seeded(k, 312) * 2.5), z);
  }));
  const body = MeshBuilder.CreateRibbon("vikingSandboxIceBody", { pathArray, sideOrientation: Mesh.DOUBLESIDE }, scene);
  body.convertToFlatShadedMesh();
  body.material = ice;
  body.isPickable = false;
  const facets: Mesh[] = [];
  for (let i = 0; i < 25; i++) {
    const [x, z] = rimPoint(i * (360 / 25) + seeded(i, 315) * 7, 0.9 + seeded(i, 316) * 0.06);
    const height = 4 + seeded(i, 317) * 7;
    const shard = MeshBuilder.CreateCylinder("vikingSandboxIceShard", {
      height, diameterTop: 3.8 + seeded(i, 318) * 3, diameterBottom: 0.25, tessellation: 4,
    }, scene);
    shard.position.set(x, -8 - height / 2, z);
    shard.rotation.set(0.45 * Math.sin(i * 2), i * 0.77, 0.42 * Math.cos(i * 2));
    facets.push(shard);
  }
  const shards = Mesh.MergeMeshes(facets, true);
  if (shards) {
    shards.convertToFlatShadedMesh();
    shards.material = crystal;
    shards.isPickable = false;
  }
}

function rimPeaks(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && /^mountain(Base|Cap|Root)/.test(mesh.name)) mesh.setEnabled(false);
  }
  // [R] 574: no rim peaks; two crystal clusters on the right-back side only (spec at the head of the file)
  const crystal = new StandardMaterial("vikingSandboxRimCrystal", scene);
  crystal.diffuseColor = new Color3(0.2, 0.58, 0.8);
  crystal.emissiveColor = crystal.diffuseColor.scale(0.4);
  crystal.specularColor = new Color3(0.2, 0.22, 0.25);
  const prisms: Mesh[] = [];
  for (const [axis, count] of [[28, 6], [50, 5]]) {
    const [cx, cz] = rimPoint(axis, 1.02);
    for (let i = 0; i < count; i++) {
      const k = axis * 10 + i;
      const h = 6 + seeded(k, 77) * 6;
      const w = 2.2 + seeded(k, 78) * 1.8;
      const prism = MeshBuilder.CreateCylinder("vikingSandboxRimCrystal", { height: h, diameterTop: w * 0.35, diameterBottom: w, tessellation: 6 }, scene);
      const a = seeded(k, 79) * Math.PI * 2, d = i === 0 ? 0 : 1.5 + seeded(k, 80) * 3;
      prism.position.set(cx + Math.cos(a) * d, 17 + h / 2 - 0.6, cz + Math.sin(a) * d);
      prism.rotation.set(Math.cos(a) * 0.35 * (i === 0 ? 0.2 : 1), seeded(k, 81) * Math.PI, Math.sin(a) * 0.35 * (i === 0 ? 0.2 : 1));
      prisms.push(prism);
    }
  }
  const merged = Mesh.MergeMeshes(prisms, true);
  if (merged) {
    merged.name = "vikingSandboxRimCrystals";
    merged.convertToFlatShadedMesh();
    merged.material = crystal;
    merged.isPickable = false;
  }
}

export function buildVikingSandbox(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  const cleared = clearFieldDressing(scene, built, result, clearFieldJunk(scene, built, clearTreeRing(scene, built, [...result.obstacles])));
  const obstacles = cleared.obstacles;
  snowAndIce(scene, built);
  iceBody(scene, built);
  iceWall(scene, obstacles);
  rimPeaks(scene, built);
  const oldClear = scene.clearColor.clone();
  const oldFog = scene.fogColor.clone();
  const oldDensity = scene.fogDensity;
  scene.clearColor.set(0.52, 0.78, 0.83, 1);
  scene.fogColor = new Color3(0.62, 0.82, 0.86);
  scene.fogDensity = 0.012;
  const flakes: Mesh[] = [];
  for (let i = 0; i < 155; i++) {
    const flake = MeshBuilder.CreateIcoSphere("vikingSandboxFlake", { radius: 0.045 + seeded(i, 290) * 0.08, subdivisions: 1 }, scene);
    flake.position.set((seeded(i, 291) - 0.5) * 115, 1 + seeded(i, 292) * 22, (seeded(i, 293) - 0.5) * 100);
    flake.scaling.set(1.8, 0.6, 1);
    flakes.push(flake);
  }
  const flurry = Mesh.MergeMeshes(flakes, true);
  if (flurry) {
    const snow = new StandardMaterial("vikingSandboxFlurry", scene);
    snow.disableLighting = true;
    snow.emissiveColor = new Color3(0.94, 0.98, 1);
    flurry.material = snow;
    flurry.isPickable = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(flurry);
  }
  const placementZones = (result.placementZones ?? result.zones).map((zone) => {
    const x0 = Math.max(zone.center.x - zone.size.x / 2, -INSIDE_X), x1 = Math.min(zone.center.x + zone.size.x / 2, INSIDE_X);
    return { ...zone, center: new Vector3((x0 + x1) / 2, zone.center.y, zone.center.z), size: new Vector3(x1 - x0, zone.size.y, zone.size.z) };
  });
  // The bowl's clear inner ice is usable too; retain the outer zones first for
  // skirmish spawning, and keep both teams on their own half of the arena.
  for (const team of [0, 1] as const) placementZones.push({
    team, center: new Vector3((team === 0 ? -1 : 1) * 14, 0, 0), size: new Vector3(26, 100, 40),
  });
  return {
    ...result, obstacles, hazards: cleared.hazards, placementZones,
    dispose: () => {
      scene.clearColor.copyFrom(oldClear);
      scene.fogColor.copyFrom(oldFog);
      scene.fogDensity = oldDensity;
      result.dispose?.();
    },
  };
}
