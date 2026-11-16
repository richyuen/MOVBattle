// TABS "Tribal 2" (tribal map): a tall grey rock mountain fills the right side of the island, its peak at the back-right, falling to the
// front as stacked rock blocks, with a dark cave mouth at its foot looking into the field (reference/maps/wiki/tribal_2.png,
// reference/stages/challenge.a_warm_welcome.png).
// Spec read off the wiki shot: the mass runs along the right rim from the back (z +44) to the front (z -38); the peak, about 26 m high, stands
// at the back-right; the middle is a 10-14 m cliff of blocks with the cave mouth (5 m wide, 4 m high) near the middle at its foot; the front is
// a low step of boulders. Its foot keeps clear of the stage armies fought here (team 1 stands at x <= 24.4, |z| <= 9.9; the massif spec
// is at footX). Built on sandbox.tribal (base()).
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const CAVE = { z: 6, width: 5, height: 4 };

/**
 * The massif (563; wiki tribal_2.png: the mountain takes the right third of the island and the open field is a bowl on the left and centre).
 * Spec: the field-side foot runs at x 31 from z -16 to z 30 (6 m clear of the stage armies, which stand at x <= 24.4, |z| <= 9.9) and
 * curves out toward the rim at the front (x 43 at z -38) and the back (x 41 at z 44); from the foot to 0.96 of the rim the rock fills
 * every 5 m band of z with 2-4 leaning faceted slabs across it, each band's height rising from the foot (0.55) to the rim (1.0) of its
 * profile: 4 m at the front, 12 m at z -10, 16 m at z 10, 22 m at z 30; the peak cone stands at (41, 25) inside the rim. Slabs within
 * 7 m of the dog shrine (43, -29) are left out so it keeps its notch at the front foot. One box collider per band.
 */
function footX(z: number): number {
  if (z < -16) return 31 + ((-16 - z) / 22) ** 2 * 12;
  if (z > 30) return 31 + ((z - 30) / 14) ** 2 * 10;
  return 31;
}
const FOOT_X = footX(CAVE.z);   // the foot at the cave mouth
const MASSIF_PROFILE: Array<[number, number]> = [[-38, 4], [-30, 6], [-20, 9], [-10, 12], [0, 14], [10, 16], [20, 20], [30, 22], [40, 18], [46, 12]];

function massifHeight(z: number): number {
  const p = MASSIF_PROFILE;
  if (z <= p[0][0]) return p[0][1];
  for (let i = 1; i < p.length; i++) {
    if (z <= p[i][0]) return p[i - 1][1] + ((z - p[i - 1][0]) / (p[i][0] - p[i - 1][0])) * (p[i][1] - p[i - 1][1]);
  }
  return p[p.length - 1][1];
}

/** The rim's x on the right at a given z (bisection along +x) */
function rimXAt(z: number): number {
  let lo = 0, hi = 70;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (Math.hypot(mid, z) < rimR(mid, z)) lo = mid; else hi = mid;
  }
  return lo;
}

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

// The open field (wiki shot): no dry-stone walls cross it; the base's wall stones inside the ellipse |x| < 47, |z| < 32 go with their colliders
const FIELD = { rx: 47, rz: 32 };
const inField = (x: number, z: number, margin = 0) => (x / (FIELD.rx + margin)) ** 2 + (z / (FIELD.rz + margin)) ** 2 < 1;

function clearFieldWalls(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes.filter((m) => built.has(m) && m.name === "wallStone")) {
    if (!inField(mesh.position.x, mesh.position.z, 2)) continue;
    gone.push([mesh.position.x, mesh.position.z]);
    mesh.dispose();
  }
  result.obstacles = result.obstacles.filter((o) => !(inField(o.center.x, o.center.z, 2)
    && gone.some(([x, z]) => Math.abs(x - o.center.x) < 0.01 && Math.abs(z - o.center.z) < 0.01)));
}

/**
 * Autumn birches (wiki shot; tribal_1's birch kit, this map's own copy): every ring tree is one faceted ball crown on a tall thin white
 * trunk, crowns red, orange and yellow (about 2:2:1), 2.8-4.4 m across the ball (larger than tribal_1's first cut, which read half size).
 * Crowns are lit by their own colour and kept out of fog, glow and the canopy haze so they stay saturated. Trees standing under the
 * mountain (x > footX(z) - 2) go, so no crown pokes out of the rock.
 */
const BIRCH_CROWNS: Array<[string, Color3]> = [
  ["tribal2CrownRed", new Color3(0.72, 0.12, 0.05)],
  ["tribal2CrownOrange", new Color3(0.82, 0.3, 0.05)],
  ["tribal2CrownRed2", new Color3(0.66, 0.16, 0.06)],
  ["tribal2CrownOrange2", new Color3(0.78, 0.38, 0.07)],
  ["tribal2CrownYellow", new Color3(0.7, 0.55, 0.08)],
];
const BIRCH_STRETCH = 1.5;

function birchRing(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const crowns = BIRCH_CROWNS.map(([name, c]) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c.scale(0.55);
    m.emissiveColor = c.scale(0.55);
    m.specularColor = Color3.Black();
    return m;
  });
  const bark = new StandardMaterial("tribal2Birch", scene);
  bark.diffuseColor = new Color3(0.9, 0.88, 0.84);
  bark.emissiveColor = new Color3(0.4, 0.39, 0.37);
  bark.specularColor = Color3.Black();
  const glow = scene.getGlowLayerByName("glow");
  const trunks = scene.meshes.filter((m): m is Mesh => built.has(m) && m.name === "trunk" && m instanceof Mesh);
  const buried: Array<[number, number]> = [];
  trunks.forEach((trunk, i) => {
    const p = trunk.getAbsolutePosition();
    if (p.x > footX(p.z) - 2 || Math.hypot(p.x - SHRINE.x, p.z - SHRINE.z) < SHRINE.clear) {
      buried.push([p.x, p.z]);
      trunk.dispose();
      return;
    }
    for (const child of trunk.getChildMeshes()) if (child.name === "canopy") child.dispose();
    const h = trunk.getBoundingInfo().boundingBox.extendSize.y * 2;
    trunk.scaling.set(0.7, BIRCH_STRETCH, 0.7);
    trunk.position.y = (h * BIRCH_STRETCH) / 2 - 0.15;
    trunk.material = bark;
    trunk.computeWorldMatrix(true);
    const top = Vector3.TransformCoordinates(new Vector3(0, h / 2, 0), trunk.getWorldMatrix());
    const r = 1.4 + seeded(i, 21) * 0.8 + h * 0.1;
    const ball = MeshBuilder.CreateIcoSphere("tribal2Crown", { radius: r, subdivisions: 1 }, scene);
    ball.scaling.y = 1.08;
    ball.rotation.y = seeded(i, 22) * Math.PI;
    ball.position.set(top.x, top.y + r * 0.7, top.z);
    ball.convertToFlatShadedMesh();
    ball.material = crowns[Math.floor(seeded(i, 23) * crowns.length)];
    ball.applyFog = false;
    ball.isPickable = false;
    glow?.addExcludedMesh(ball);
  });
  result.obstacles = result.obstacles.filter((o) => !buried.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
  // The low band of ball crowns behind the ring takes the same colours
  scene.meshes.filter((m) => built.has(m) && m.name === "hazeTreeline").forEach((m, i) => {
    m.material = crowns[i % 2 === 0 ? 0 : 1];
    m.applyFog = false;
  });
}

/**
 * Open sky (autumn_tribal_2.png): the island floats alone in a teal sky with only clouds round it; the base's far ridge range and the
 * floating rock roots under it (meshes mountainBase/Cap/Root) go, the clouds stay.
 */
function openSky(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && mesh.name.startsWith("mountain")) mesh.setEnabled(false);
  }
}

/**
 * Island underside (autumn_tribal_2.png; tribal_1's tier kit, this map's own copy): under the field the island is three stacked rounded
 * tiers of orange earth, each narrower than the one above with a crease between them, sparse white blocky stones set in their faces; the
 * base's navy islandUnder/islandShelf/islandCliff (the black spikes) go. Spec: the tiers follow the island outline (superellipse 54 x 48,
 * power 3) at 1.0, 0.86 and 0.66 of it, 16, 13 and 10 m tall (the reference's tiers stand about 0.19, 0.13 and 0.1 of the island's
 * width), each side bulging 3% at mid height and rounding in to 88% at its foot; the last tier closes in a rounded foot; about 70 white
 * boxes 1.2-2.4 m flat against the faces.
 */
const ISLAND = { a: 54, b: 48, round: 3 };
const TIERS = [{ s: 1, top: -0.02, h: 16 }, { s: 0.86, top: -16.6, h: 13 }, { s: 0.66, top: -30.2, h: 10 }];

function rim(deg: number): [number, number] {
  const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
  const p = rimPower(c);
  const r = (Math.abs(c / ISLAND.a) ** p + Math.abs(s / ISLAND.b) ** p) ** (-1 / p);
  return [c * r, s * r];
}

/**
 * Round island (wiki tribal_2.png): the island is a near-circle with the field running out to the ring, not a rounded rectangle with a bare
 * margin. Spec: the outline is 54 x 48 with its power blending from 2 (an ellipse) over the left half to the base's 3 under the mountain on
 * the right (power 2 + max(0, cos a)^2), so the mountain's blocks keep their ground; the tiers and rim rocks follow rim(); the base's lawn
 * slabs ("ground", "centerGrass") are remapped vertex by vertex from the base's superellipse (power 3) at the same fraction of the radius;
 * blades and base props past the new rim (less 1 m) go with their colliders, the haze band goes whole; every ring birch beyond 0.6 of the
 * rim is pushed out to 0.84-0.93 of it (its collider moves with it), so the trees stand at the rim with the field open up to them.
 */
function rimPower(c: number): number {
  return 2 + Math.max(0, c) ** 2;
}

function rimR(x: number, z: number): number {
  const [rx, rz] = rim((Math.atan2(z, x) * 180) / Math.PI);
  return Math.hypot(rx, rz);
}

const ROUND_PROPS = new Set(["boulder", "wallStone", "hayBale", "stump", "hill", "grassTuft", "flowerDot", "pebble"]);

function roundIsland(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const baseR = (a: number) => (Math.abs(Math.cos(a) / 54) ** 3 + Math.abs(Math.sin(a) / 48) ** 3) ** (-1 / 3);
  const inside = (x: number, z: number, m: number) => Math.hypot(x, z) <= rimR(x, z) - m;
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || !(mesh instanceof Mesh)) continue;
    if (mesh.name === "ground" || mesh.name === "centerGrass") {
      const pos = mesh.getVerticesData("position");
      if (!pos) continue;
      for (let v = 0; v < pos.length; v += 3) {
        if (Math.hypot(pos[v], pos[v + 2]) < 1e-6) continue;
        const k = rimR(pos[v], pos[v + 2]) / baseR(Math.atan2(pos[v + 2], pos[v]));
        pos[v] *= k;
        pos[v + 2] *= k;
      }
      mesh.setVerticesData("position", pos);
      mesh.refreshBoundingInfo();
    } else if (mesh.name === "hazeTreeline") {
      mesh.setEnabled(false);
    } else if (mesh.name.startsWith("fieldBlades_")) {
      const pos = mesh.getVerticesData("position");
      if (!pos) continue;
      for (let v = 0; v + 11 < pos.length; v += 12) {
        if (inside(pos[v], pos[v + 2], 0.5)) continue;
        for (let c = 3; c < 12; c++) pos[v + c] = pos[v + (c % 3)];
      }
      mesh.setVerticesData("position", pos);
    } else if (ROUND_PROPS.has(mesh.name) && !mesh.parent && mesh.isEnabled() && !inside(mesh.position.x, mesh.position.z, 1)) {
      gone.push([mesh.position.x, mesh.position.z]);
      mesh.setEnabled(false);
    }
  }
  result.obstacles = result.obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
  // Ring birches out to the rim, colliders with them
  let i = 0;
  for (const trunk of scene.meshes.filter((m) => built.has(m) && m.name === "trunk" && !m.parent)) {
    const { x, z } = trunk.position;
    const R = rimR(x, z), d = Math.hypot(x, z);
    if (d < 0.6 * R) continue;
    const k = ((0.84 + seeded(i++, 31) * 0.09) * R) / d;
    const col = result.obstacles.find((o) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5);
    trunk.position.x = x * k;
    trunk.position.z = z * k;
    trunk.computeWorldMatrix(true);
    if (col) col.center = new Vector3(x * k, 0, z * k);
  }
}

function tierProfile(s: number, top: number, h: number, last: boolean): Array<[number, number]> {
  const p: Array<[number, number]> = [[s * (top > -0.1 ? 1 : 0.95), top], [s * 1.01, top - h * 0.2], [s * 1.03, top - h * 0.5], [s * 0.99, top - h * 0.8], [s * 0.88, top - h]];
  if (last) p.push([s * 0.6, top - h - 1.5], [s * 0.15, top - h - 2.2]);
  return p;
}

function earthTiers(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && ["islandUnder", "islandShelf", "islandCliff"].includes(mesh.name)) mesh.setEnabled(false);
  }
  const mk = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = Color3.Black();
    return m;
  };
  const earth = mk("tribal2UnderEarth", new Color3(0.88, 0.5, 0.2), 0.32);
  const fleck = mk("tribal2UnderFleck", new Color3(0.95, 0.93, 0.88), 0.5);
  const bands: Mesh[] = [];
  TIERS.forEach(({ s, top, h }, t) => {
    const prof = tierProfile(s, top, h, t === TIERS.length - 1);
    for (let i = 0; i < prof.length - 1; i++) {
      const [s0, y0] = prof[i], [s1, y1] = prof[i + 1];
      const band = MeshBuilder.CreateCylinder("tribal2Tier", { diameterTop: s0, diameterBottom: s1, height: y0 - y1, tessellation: 72 }, scene);
      const pos = band.getVerticesData("position")!;
      for (let v = 0; v < pos.length; v += 3) {
        const reach = Math.hypot(pos[v], pos[v + 2]) * 2;
        const [x, z] = rim((Math.atan2(pos[v + 2], pos[v]) * 180) / Math.PI);
        pos[v] = x * reach;
        pos[v + 2] = z * reach;
      }
      band.setVerticesData("position", pos);
      band.position.y = (y0 + y1) / 2;
      bands.push(band);
    }
  });
  const tiers = Mesh.MergeMeshes(bands, true);
  if (tiers) {
    tiers.name = "tribal2Tiers";
    tiers.material = earth;
    tiers.isPickable = false;
  }
  // White stones on the tier faces, at mid height where the face stands out furthest
  const flecks: Mesh[] = [];
  for (let k = 0; k < 70; k++) {
    const { s, top, h } = TIERS[k % TIERS.length];
    const deg = seeded(k, 31) * 360;
    const y = top - h * 0.3 - seeded(k, 32) * h * 0.4;
    const [ox, oz] = rim(deg);
    const w = 1.2 + seeded(k, 33) * 1.2;
    const box = MeshBuilder.CreateBox("tribal2Fleck", { width: w, height: w * (0.6 + seeded(k, 34) * 0.3), depth: 0.5 }, scene);
    box.rotation.set(0, Math.PI / 2 - (deg * Math.PI) / 180, (seeded(k, 35) - 0.5) * 0.4);
    box.position.set(ox * s * 1.025, y, oz * s * 1.025);
    flecks.push(box);
  }
  const set = Mesh.MergeMeshes(flecks, true);
  if (set) {
    set.name = "tribal2Flecks";
    set.material = fleck;
    set.isPickable = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(set);
  }
}

/**
 * Before the cave (reference/stages/spooky.cave.png): the ground at the cave mouth is strewn with wide flat grey slab rocks lying almost
 * flush with the earth, and old bones lie among them. Spec: 9 slabs 2.5-5.5 m across and 0.3-0.6 m high (faceted plates, a little
 * narrower on top, tilted a few degrees), fanned out from the mouth over x 32..44, z -4..16; 12 bones (a 0.8-1.3 m shaft with a knob at
 * each end) and 2 skulls lying between them. Drawn only, no colliders: units walk over them.
 */
const SLAB_SPREAD = { x0: FOOT_X - 12, x1: FOOT_X, z0: -4, z1: 16 };

function caveApron(scene: Scene): void {
  const mk = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = Color3.Black();
    return m;
  };
  const slabMat = mk("tribal2Slab", new Color3(0.62, 0.55, 0.52), 0.18);
  const boneMat = mk("tribal2Bone", new Color3(0.92, 0.88, 0.78), 0.35);
  const slabs: Mesh[] = [];
  for (let i = 0; i < 9; i++) {
    const w = 2.5 + seeded(i, 41) * 3;
    const h = 0.3 + seeded(i, 42) * 0.3;
    const slab = MeshBuilder.CreateCylinder("tribal2Slab", { diameterTop: w * 0.82, diameterBottom: w, height: h, tessellation: 5 + (i % 2) }, scene);
    slab.scaling.z = 0.55 + seeded(i, 43) * 0.35;
    // Fanned out from the mouth: the near ones close to the rock, the far ones out toward the field
    const t = i / 8;
    const x = SLAB_SPREAD.x1 - t * (SLAB_SPREAD.x1 - SLAB_SPREAD.x0) + (seeded(i, 44) - 0.5) * 3;
    const z = CAVE.z + (seeded(i, 45) - 0.5) * (6 + t * (SLAB_SPREAD.z1 - SLAB_SPREAD.z0 - 6));
    slab.position.set(Math.min(x, FOOT_X - 1.5), h / 2 - 0.05, Math.max(SLAB_SPREAD.z0, Math.min(SLAB_SPREAD.z1, z)));
    slab.rotation.set((seeded(i, 46) - 0.5) * 0.12, seeded(i, 47) * Math.PI, (seeded(i, 48) - 0.5) * 0.12);
    slabs.push(slab);
  }
  const bones: Mesh[] = [];
  for (let i = 0; i < 12; i++) {
    const len = 0.8 + seeded(i, 51) * 0.5;
    const shaft = MeshBuilder.CreateCylinder("tribal2Bone", { diameter: 0.14, height: len, tessellation: 6 }, scene);
    shaft.rotation.z = Math.PI / 2;
    const knobs = [-1, 1].map((e) => {
      const knob = MeshBuilder.CreateIcoSphere("tribal2BoneKnob", { radius: 0.15, subdivisions: 1 }, scene);
      knob.position.x = (e * len) / 2;
      return knob;
    });
    const bone = Mesh.MergeMeshes([shaft, ...knobs], true)!;
    bone.rotation.y = seeded(i, 52) * Math.PI;
    bone.position.set(SLAB_SPREAD.x0 + seeded(i, 53) * (FOOT_X - 2 - SLAB_SPREAD.x0), 0.12, SLAB_SPREAD.z0 + seeded(i, 54) * (SLAB_SPREAD.z1 - SLAB_SPREAD.z0));
    bones.push(bone);
  }
  for (let i = 0; i < 2; i++) {
    const skull = MeshBuilder.CreateIcoSphere("tribal2Skull", { radius: 0.32, subdivisions: 1 }, scene);
    skull.scaling.set(1, 0.85, 1.15);
    skull.rotation.y = seeded(i, 56) * Math.PI;
    skull.position.set(FOOT_X - 4 - i * 5, 0.26, CAVE.z - 3 + i * 7);
    bones.push(skull);
  }
  for (const [list, mat, name] of [[slabs, slabMat, "tribal2Slabs"], [bones, boneMat, "tribal2Bones"]] as const) {
    const merged = Mesh.MergeMeshes(list, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

/**
 * Rim rocks (wiki tribal_2.png): a broken wall of grey rock cliffs runs along the back-left arc of the rim behind the birches, and big boulder
 * piles sit along the front rim between the trees. Spec read off the wiki shot: the cliff run spans the rim from the back centre (90 deg)
 * round to the left (205 deg), 15 blocks, each two or three leaning faceted slabs 7-10 m along the rim, 5-9 m high, 5 m deep, their faces at
 * 0.9 of the rim; the front has 7 piles between 225 and 320 deg, each 3-5 rounded boulders 2.4-4.8 m across at 0.9 of the rim. The
 * rock is a warm grey (r well over b; the cool grey reads lavender). Each block and pile is solid (one cylinder collider).
 */
function rimRocks(scene: Scene): Array<{ type: "cylinder"; center: Vector3; radius: number }> {
  const rock = new StandardMaterial("tribal2RimRock", scene);
  rock.diffuseColor = new Color3(0.62, 0.52, 0.45);
  rock.emissiveColor = new Color3(0.1, 0.08, 0.065);
  rock.specularColor = new Color3(0.03, 0.03, 0.03);
  const pieces: Mesh[] = [];
  const colliders: Array<{ type: "cylinder"; center: Vector3; radius: number }> = [];
  for (let i = 0; i < 15; i++) {
    const deg = 90 + (i / 14) * 115 + (seeded(i, 71) - 0.5) * 4;
    const [rx, rz] = rim(deg);
    const cx = rx * 0.92, cz = rz * 0.92;
    const along = 7 + seeded(i, 72) * 3, high = 5 + seeded(i, 73) * 4;
    // The block's long side runs along the rim
    const yaw = -(deg * Math.PI) / 180 - Math.PI / 2;
    for (let j = 0; j < 3; j++) {
      const k = i * 10 + j;
      const s = 1 - j * 0.25;
      const h = high * (1 - j * 0.22);
      const slab = MeshBuilder.CreateCylinder("tribal2CliffSlab", { diameterTop: along * s * 0.55, diameterBottom: along * s, height: h, tessellation: 5 }, scene);
      slab.scaling.z = 5 / along;
      slab.rotation.set((seeded(k, 74) - 0.5) * 0.18, yaw + (seeded(k, 75) - 0.5) * 0.4, (seeded(k, 76) - 0.5) * 0.18);
      slab.position.set(cx + (seeded(k, 77) - 0.5) * 3, h / 2 - 0.2, cz + (seeded(k, 78) - 0.5) * 3);
      pieces.push(slab);
    }
    colliders.push({ type: "cylinder", center: new Vector3(cx, 0, cz), radius: 3 });
  }
  for (let p = 0; p < 7; p++) {
    const deg = 228 + (p / 6) * 90 + (seeded(p, 81) - 0.5) * 6;
    const [rx, rz] = rim(deg);
    const cx = rx * 0.9, cz = rz * 0.9;
    const n = 3 + Math.floor(seeded(p, 82) * 3);
    for (let b = 0; b < n; b++) {
      const k = p * 10 + b;
      const r = 1.2 + seeded(k, 83) * 1.2;
      const boulder = MeshBuilder.CreateIcoSphere("tribal2Boulder", { radius: r, subdivisions: 1 }, scene);
      boulder.scaling.set(1.15, 0.8 + seeded(k, 84) * 0.25, 1);
      boulder.rotation.set(seeded(k, 85), seeded(k, 86) * Math.PI, 0);
      const a = seeded(k, 87) * Math.PI * 2, d = b === 0 ? 0 : 1.6 + seeded(k, 88) * 1.4;
      boulder.position.set(cx + Math.cos(a) * d, r * 0.55 + (b === n - 1 && n > 3 ? r * 0.7 : 0), cz + Math.sin(a) * d);
      pieces.push(boulder);
    }
    colliders.push({ type: "cylinder", center: new Vector3(cx, 0, cz), radius: 2.8 });
  }
  const merged = Mesh.MergeMeshes(pieces, true);
  if (merged) {
    merged.name = "tribal2RimRocks";
    merged.convertToFlatShadedMesh();
    merged.material = rock;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  return colliders;
}

/**
 * Rubble at the mountain's foot (wiki shot; spooky.cave.png): loose boulders and stones edge the field all along the foot of the mountain,
 * thickest from the cave mouth toward the front. Spec (563): ~40 faceted boulders 1.4-3 m across on open sand 0-3 m out from the massif
 * foot (footX) from z 38 to z -36 (skipping the cave mouth, |z - 6| < 3.5, and the shrine), denser toward the front, in the mountain's warm
 * grey; plus ~18 pale bone-white flat stones 2.5-6 m out. Drawn only: knee high, outside the stage armies (x <= 24.4).
 */
function footRubble(scene: Scene): void {
  const mat = new StandardMaterial("tribal2Rubble", scene);
  mat.diffuseColor = new Color3(0.6, 0.51, 0.45);
  mat.emissiveColor = new Color3(0.09, 0.075, 0.065);
  mat.specularColor = Color3.Black();
  const pale = new StandardMaterial("tribal2RubblePale", scene);
  pale.diffuseColor = new Color3(0.92, 0.88, 0.8);
  pale.emissiveColor = new Color3(0.3, 0.28, 0.25);
  pale.specularColor = Color3.Black();
  const stones: Mesh[] = [], pales: Mesh[] = [];
  // Mid-size faceted boulders (dodecahedra, 1.4-3 m) along the massif foot (footX), 0-3 m out on open sand, front-weighted
  for (let i = 0; i < 40; i++) {
    const z = 38 - 74 * Math.sqrt(seeded(i, 101));
    if (Math.abs(z - CAVE.z) < 3.5 || Math.hypot(footX(z) - SHRINE.x, z - SHRINE.z) < 6) continue;
    const r = 0.7 + seeded(i, 102) * 0.8;
    const stone = MeshBuilder.CreatePolyhedron("tribal2RubbleStone", { type: 2, size: r }, scene);
    stone.scaling.set(1.15, 0.7 + seeded(i, 106) * 0.25, 1);
    stone.rotation.set(seeded(i, 104), seeded(i, 105) * Math.PI, seeded(i, 107) * 0.4);
    stone.position.set(footX(z) - 0.3 - seeded(i, 103) * 3, r * 0.45, z);
    stones.push(stone);
  }
  // Pale bone-white stones a little further out (2.5-6 m from the foot)
  for (let i = 0; i < 18; i++) {
    const z = 34 - 66 * seeded(i, 111);
    if (Math.abs(z - CAVE.z) < 3.5) continue;
    const r = 0.3 + seeded(i, 112) * 0.35;
    const stone = MeshBuilder.CreatePolyhedron("tribal2RubblePale", { type: 1, size: r }, scene);
    stone.scaling.set(1.3, 0.6, 1);
    stone.rotation.set(seeded(i, 114), seeded(i, 115) * Math.PI, 0);
    stone.position.set(footX(z) - 2.5 - seeded(i, 113) * 3.5, r * 0.35, z);
    pales.push(stone);
  }
  for (const [list, m, name] of [[stones, mat, "tribal2Rubble"], [pales, pale, "tribal2RubblePale"]] as const) {
    const merged = Mesh.MergeMeshes(list, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = m;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

/**
 * The stone dog shrine (card Overview; wiki shot, bottom right): where the mountain runs toward the front a small shrine stands at its foot,
 * a pale stone platform with a gate of two posts and a lintel facing the field and two seated stone dogs guarding it. Spec: centre (43, -29)
 * in front of the mountain's front blocks (stage armies stand at x <= 40, z >= -26); a two-step round platform 3.2 / 2.4 m in radius,
 * 0.35 m a step; the gate 3.2 m wide, posts 2.6 m tall, a lintel 4.4 m long overhanging; each dog 2.2 m tall seated on a 0.7 m pedestal
 * either side of the gate on the field side, facing the field; the ring birches within 8 m go so it shows from above. One collider (r 2.6).
 */
const SHRINE = { x: 43, z: -29, clear: 8 };

function dogShrine(scene: Scene): { type: "cylinder"; center: Vector3; radius: number } {
  const stone = new StandardMaterial("tribal2Shrine", scene);
  stone.diffuseColor = new Color3(0.84, 0.78, 0.68);
  stone.emissiveColor = new Color3(0.2, 0.18, 0.15);
  stone.specularColor = Color3.Black();
  const parts: Mesh[] = [];
  const { x, z } = SHRINE;
  // The gate faces the field: its axis points from the shrine toward the island centre
  const face = Math.atan2(-z, -x);
  const fx = Math.cos(face), fz = Math.sin(face), sx = -fz, sz = fx;
  for (const [r, y] of [[3.2, 0.175], [2.4, 0.525]] as const) {
    const step = MeshBuilder.CreateCylinder("tribal2ShrineStep", { diameter: r * 2, height: 0.35, tessellation: 10 }, scene);
    step.position.set(x, y, z);
    parts.push(step);
  }
  const yaw = -face + Math.PI / 2;
  for (const s of [-1, 1]) {
    const post = MeshBuilder.CreateBox("tribal2ShrinePost", { width: 0.45, height: 2.6, depth: 0.45 }, scene);
    post.position.set(x + sx * s * 1.6, 0.7 + 1.3, z + sz * s * 1.6);
    post.rotation.y = yaw;
    parts.push(post);
  }
  for (const [w, h, y] of [[4.4, 0.35, 3.45], [3.6, 0.25, 3.05]] as const) {
    const beam = MeshBuilder.CreateBox("tribal2ShrineLintel", { width: w, height: h, depth: 0.55 }, scene);
    beam.position.set(x, y, z);
    beam.rotation.y = yaw;
    parts.push(beam);
  }
  // Two seated dogs on pedestals, either side of the gate, a step toward the field
  for (const s of [-1, 1]) {
    const dx = x + fx * 3.9 + sx * s * 2.2, dz = z + fz * 3.9 + sz * s * 2.2;
    const at = (mesh: Mesh, f: number, side: number, y: number) => {
      mesh.position.set(dx + fx * f + sx * side, y, dz + fz * f + sz * side);
      mesh.rotation.y = yaw;
      parts.push(mesh);
    };
    at(MeshBuilder.CreateBox("tribal2DogPedestal", { width: 1.3, height: 0.7, depth: 1.7 }, scene), 0, 0, 0.35);
    // Haunches (low, back), chest (upright, front), head, snout, ears
    const haunch = MeshBuilder.CreateIcoSphere("tribal2DogBody", { radius: 0.62, subdivisions: 1 }, scene);
    haunch.scaling.set(0.95, 0.75, 1.15);
    at(haunch, -0.3, 0, 1.15);
    const chest = MeshBuilder.CreateIcoSphere("tribal2DogBody", { radius: 0.5, subdivisions: 1 }, scene);
    chest.scaling.set(0.9, 1.4, 0.85);
    at(chest, 0.25, 0, 1.75);
    for (const leg of [-0.28, 0.28]) {
      at(MeshBuilder.CreateBox("tribal2DogLeg", { width: 0.2, height: 0.9, depth: 0.22 }, scene), 0.55, leg, 1.15);
    }
    const head = MeshBuilder.CreateIcoSphere("tribal2DogHead", { radius: 0.42, subdivisions: 1 }, scene);
    at(head, 0.45, 0, 2.55);
    at(MeshBuilder.CreateBox("tribal2DogSnout", { width: 0.3, height: 0.26, depth: 0.42 }, scene), 0.85, 0, 2.47);
    for (const ear of [-0.22, 0.22]) {
      const e = MeshBuilder.CreateCylinder("tribal2DogEar", { diameterTop: 0, diameterBottom: 0.24, height: 0.34, tessellation: 4 }, scene);
      at(e, 0.4, ear, 2.98);
    }
  }
  const merged = Mesh.MergeMeshes(parts, true);
  if (merged) {
    merged.name = "tribal2Shrine";
    merged.convertToFlatShadedMesh();
    merged.material = stone;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  return { type: "cylinder", center: new Vector3(x, 0, z), radius: 2.6 };
}

export function buildTribal2(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  clearFieldWalls(scene, new Set(scene.meshes.filter((m) => !prior.has(m))), result);
  roundIsland(scene, new Set(scene.meshes.filter((m) => !prior.has(m))), result);
  birchRing(scene, new Set(scene.meshes.filter((m) => !prior.has(m))), result);
  openSky(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  earthTiers(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  caveApron(scene);
  footRubble(scene);
  // Warm brownish grey (spooky.cave.png), r well over b so it does not read blue-violet
  const rock = new StandardMaterial("tribal2Mountain", scene);
  rock.diffuseColor = new Color3(0.6, 0.5, 0.4);
  rock.emissiveColor = new Color3(0.1, 0.075, 0.05);
  rock.specularColor = new Color3(0.03, 0.03, 0.03);
  const dark = new StandardMaterial("tribal2Cave", scene);
  dark.diffuseColor = new Color3(0.04, 0.03, 0.04);
  dark.specularColor = Color3.Black();

  const pieces: Mesh[] = [];
  const massifColliders: Array<{ type: "box"; center: Vector3; halfX: number; halfZ: number }> = [];
  // Boulder heap (564; CONFIRM 563 a1, wiki tribal_2.png): the massif is one craggy mountain of big rounded faceted boulders heaped up to a
  // single peak, not a field of flat-topped prisms. Spec: each 5 m band of z, from the foot (footX) to 0.96 of the rim, holds 2-4 columns of
  // boulders (low-poly icospheres, 6-12 m across, squashed 0.75-0.95 in height, turned at random so no face is flat on top); each column
  // stacks boulders, smaller as they rise, until it reaches the band's height (the same profile as before, 0.55 at the foot to 1.0 at the
  // rim). The peak at (41, 25) is a pile of five boulders, 20 m across at its foot to 6 m at its top, about 28 m high. The foot column's
  // field-side edge stays at footX, the shrine notch and the band colliders are kept.
  const boulder = (x: number, y: number, z: number, d: number, k: number) => {
    const b = MeshBuilder.CreateIcoSphere("tribal2Boulder", { radius: d / 2, subdivisions: 1 }, scene);
    b.scaling.set(1 + (seeded(k, 7) - 0.5) * 0.25, 0.75 + seeded(k, 8) * 0.2, 1 + (seeded(k, 9) - 0.5) * 0.25);
    b.rotation.set(seeded(k, 10) * Math.PI, seeded(k, 11) * Math.PI, seeded(k, 12) * Math.PI);
    b.position.set(x, y, z);
    pieces.push(b);
  };
  [[20, 6], [16, 13], [12, 19], [9, 24], [6, 27.5]].forEach(([d, y], i) => {
    boulder(41 + (seeded(i, 13) - 0.5) * 3, y, 25 + (seeded(i, 14) - 0.5) * 3, d, 900 + i);
  });
  let band = 0;
  for (let z = -38; z <= 46; z += 5) {
    band++;
    const x0 = footX(z), x1 = rimXAt(z) * 0.96;
    if (x1 - x0 < 3) continue;
    const n = Math.max(2, Math.min(4, Math.round((x1 - x0) / 5)));
    for (let j = 0; j < n; j++) {
      const k = band * 10 + j;
      const frac = (j + 0.5) / n;
      const zz = z + (seeded(k, 2) - 0.5) * 2.5;
      const h = massifHeight(zz) * (0.55 + 0.45 * frac) * (0.9 + seeded(k, 6) * 0.2);
      let d = Math.min(12, Math.max(6, (x1 - x0) / n * 1.6, h * 0.55));
      // The foot column's field-side edge sits at the foot
      // (by the cave mouth it stands 1.2 m further back so the dark mouth stays open)
      const x = j === 0 ? x0 + d * (Math.abs(zz - CAVE.z) < 5 ? 0.5 : 0.42) + (Math.abs(zz - CAVE.z) < 5 ? 1.2 : 0) :x0 + frac * (x1 - x0) + (seeded(k, 1) - 0.5) * 1.5;
      if (Math.hypot(x - SHRINE.x, zz - SHRINE.z) < 7) continue;
      let y = d * 0.3, s = 0;
      while (y < h) {
        boulder(x + (seeded(k * 7 + s, 15) - 0.5) * 2, y, zz + (seeded(k * 7 + s, 16) - 0.5) * 2, d, k * 7 + s);
        y += d * 0.55;
        d = Math.max(4, d * 0.8);
        s++;
      }
    }
    // Bands beside the shrine stop short of its notch (the shrine has its own collider)
    const cx1 = Math.abs(z - SHRINE.z) < 9 ? Math.min(x1, SHRINE.x - 6) : x1;
    if (cx1 - x0 > 2) massifColliders.push({ type: "box", center: new Vector3((x0 + 0.8 + cx1) / 2, 0, z), halfX: (cx1 - x0 - 0.8) / 2, halfZ: 2.5 });
  }
  const mountain = Mesh.MergeMeshes(pieces, true);
  if (mountain) {
    mountain.name = "tribal2Mountain";
    mountain.convertToFlatShadedMesh();
    mountain.material = rock;
    mountain.receiveShadows = true;
    mountain.isPickable = false;
  }
  // The cave mouth: a dark arch sunk into the cliff foot, facing the field
  const mouth = MeshBuilder.CreateSphere("tribal2CaveMouth", { diameter: 1, segments: 6 }, scene);
  mouth.scaling.set(2.5, CAVE.height * 2, CAVE.width);
  mouth.position.set(FOOT_X - 0.2, 0, CAVE.z);
  mouth.material = dark;
  mouth.isPickable = false;

  // The mountain is solid: one box per band from its foot to the rim
  const obstacles = [
    ...result.obstacles,
    ...massifColliders,
    ...rimRocks(scene),
    dogShrine(scene),
  ];
  return { ...result, obstacles };
}
