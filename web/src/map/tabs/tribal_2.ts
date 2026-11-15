// TABS "Tribal 2" (tribal map): a tall grey rock mountain fills the right side of the island, its peak at the back-right, falling to the
// front as stacked rock blocks, with a dark cave mouth at its foot looking into the field (reference/maps/wiki/tribal_2.png,
// reference/stages/challenge.a_warm_welcome.png).
// Spec read off the wiki shot: the mass runs along the right rim from the back (z +44) to the front (z -38); the peak, about 26 m high, stands
// at the back-right; the middle is a 10-14 m cliff of blocks with the cave mouth (5 m wide, 4 m high) near the middle at its foot; the front is
// a low step of boulders. Its foot keeps clear of the stage armies fought here (team 1 stands at x <= 40). Built on sandbox.tribal (base()).
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const FOOT_X = 45;   // the mountain's field-side foot
const CAVE = { z: 6, width: 5, height: 4 };

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

/** [x, z, width, height, depth] of each rock block, back to front */
const BLOCKS: Array<[number, number, number, number, number]> = [
  [53, 38, 16, 18, 14], [52, 29, 18, 22, 14], [53, 20, 16, 17, 12], [52, 13, 14, 13, 10],
  [53, 1, 16, 12, 12], [52, -7, 14, 10, 10], [53, -15, 15, 8, 11], [52, -23, 13, 6, 10], [52, -31, 12, 4, 9], [51, -38, 9, 3, 7],
];

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
 * mountain (x > FOOT_X - 2) go, so no crown pokes out of the rock.
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
    if (p.x > FOOT_X - 2) {
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
  const r = (Math.abs(c / ISLAND.a) ** ISLAND.round + Math.abs(s / ISLAND.b) ** ISLAND.round) ** (-1 / ISLAND.round);
  return [c * r, s * r];
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
const SLAB_SPREAD = { x0: 32, x1: 44, z0: -4, z1: 16 };

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

export function buildTribal2(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  clearFieldWalls(scene, new Set(scene.meshes.filter((m) => !prior.has(m))), result);
  birchRing(scene, new Set(scene.meshes.filter((m) => !prior.has(m))), result);
  openSky(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  earthTiers(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  caveApron(scene);
  const rock = new StandardMaterial("tribal2Mountain", scene);
  rock.diffuseColor = new Color3(0.6, 0.54, 0.52);
  rock.emissiveColor = new Color3(0.08, 0.06, 0.05);
  rock.specularColor = new Color3(0.03, 0.03, 0.03);
  const dark = new StandardMaterial("tribal2Cave", scene);
  dark.diffuseColor = new Color3(0.04, 0.03, 0.04);
  dark.specularColor = Color3.Black();

  const pieces: Mesh[] = [];
  // The peak: a leaning faceted cone over the back-right blocks
  const peak = MeshBuilder.CreateCylinder("tribal2Peak", { diameterTop: 5, diameterBottom: 24, height: 30, tessellation: 6 }, scene);
  peak.position.set(55, 14, 27);
  peak.rotation.set(0.08, 0.4, -0.1);
  pieces.push(peak);
  BLOCKS.forEach(([x, z, w, h, d], i) => {
    // Each block is two or three leaning slabs, so the face reads as stacked rock and not one box
    for (let j = 0; j < 3; j++) {
      const k = i * 10 + j;
      const s = 1 - j * 0.22;
      const slab = MeshBuilder.CreateCylinder("tribal2Block", {
        diameterTop: w * s * 0.5, diameterBottom: w * s, height: h * (1 - j * 0.18), tessellation: 5,
      }, scene);
      slab.scaling.z = d / w;
      slab.position.set(x + (seeded(k, 1) - 0.5) * 3, h * (1 - j * 0.18) / 2, z + (seeded(k, 2) - 0.5) * 4);
      slab.rotation.set((seeded(k, 3) - 0.5) * 0.15, seeded(k, 4) * Math.PI, (seeded(k, 5) - 0.5) * 0.15);
      pieces.push(slab);
    }
  });
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

  // The mountain is solid: one box over its foot along the right rim
  const obstacles = [
    ...result.obstacles,
    { type: "box" as const, center: new Vector3(FOOT_X + 6, 0, 3), halfX: 6, halfZ: 41 },
    ...rimRocks(scene),
  ];
  return { ...result, obstacles };
}
