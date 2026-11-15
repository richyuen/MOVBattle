// TABS "Farmer 2" (farmer map): grey dry-stone walls cut the island into fields (reference/maps/wiki/farmer_2.png; the card counts eight
// sections): a long wall down the front of the centre line between the sheaf field and the wheat, a cross wall closing the front-left sheaf
// field, a yard wall along the back past the farmhouse, a wall down the left side that makes the open pathway and its alley, and two short
// walls closing the back-right and front-right corners. Each wall has one gap a man can walk through.
// Spec: walls are axis-aligned runs of rough cobbles, knee high (0.5-0.8 m), 1 m thick, one box obstacle per stretch. They keep clear of the
// stage armies fought here (team 1 stands in x 2..41, z -26..18). Built on campaign.introduction (base()).
import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

/** [x0, z0, x1, z1, gap centre along the run (0..1)] */
const WALLS: Array<[number, number, number, number, number]> = [
  [-2.5, -46, -2.5, -22, 0.55],   // front centre: sheaf field | wheat
  [-44, -20, -6, -20, 0.3],       // front-left sheaf field's back wall
  [-40, 24, 40, 24, 0.5],         // back yard wall
  [-26, -16, -26, 20, 0.6],       // left pathway | alley
  [22, 24, 22, 44, 0.45],         // back-right corner
  [8, -31, 46, -31, 0.4],         // front-right corner
];
const GAP = 4;
const THICK = 1.0;

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function cobbleWall(scene: Scene, mat: StandardMaterial, [x0, z0, x1, z1, gapAt]: (typeof WALLS)[number], w: number, obstacles: Obstacle[]): void {
  const len = Math.hypot(x1 - x0, z1 - z0);
  const ux = (x1 - x0) / len, uz = (z1 - z0) / len;
  const gapFrom = gapAt * len - GAP / 2, gapTo = gapAt * len + GAP / 2;
  const stones: Mesh[] = [];
  let k = 0;
  for (let along = 0.4; along < len; along += 0.75) {
    if (along > gapFrom && along < gapTo) continue;
    for (let layer = 0; layer < 2; layer++) {
      for (const side of [-0.25, 0.25]) {
        k++;
        if (layer === 1 && seeded(k + w * 500, 3) < 0.25) continue; // a broken top line
        const size = 0.42 + seeded(k + w * 500, 4) * 0.22;
        const stone = MeshBuilder.CreatePolyhedron("farmer2Cobble", { type: 1, size }, scene);
        stone.scaling.set(1, 0.7, 1);
        const jitter = (seeded(k + w * 500, 5) - 0.5) * 0.3;
        const ax = along + jitter;
        stone.position.set(x0 + ux * ax - uz * side, 0.22 + layer * 0.38, z0 + uz * ax + ux * side);
        stone.rotation.set(seeded(k, 6) * 3, seeded(k, 7) * 3, seeded(k, 8) * 3);
        stones.push(stone);
      }
    }
  }
  const merged = Mesh.MergeMeshes(stones, true);
  if (merged) {
    merged.name = "farmer2Wall";
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  // Two stretches either side of the gap, each one box
  for (const [a, b] of [[0, gapFrom], [gapTo, len]]) {
    if (b - a < 0.5) continue;
    const mid = (a + b) / 2;
    obstacles.push({
      type: "box",
      center: new Vector3(x0 + ux * mid, 0, z0 + uz * mid),
      halfX: Math.abs(ux) * (b - a) / 2 + Math.abs(uz) * THICK / 2,
      halfZ: Math.abs(uz) * (b - a) / 2 + Math.abs(ux) * THICK / 2,
    });
  }
}

/**
 * The wheat field (wiki shot, the_tiniest_attack): tall golden wheat covers the right part of the island, from the front-right corner wall
 * back past the centre, beside the long centre wall. Spec: a field x 5..45, z -29..21 (its corners rounded off), filled with tufts of five
 * thin stalks 0.5-0.7 m tall with a fat ear on each (waist high, under 1 m), 0.9 m apart and jittered, leaning a little with the wind. Units walk through it (no
 * colliders) and stand chest-up above it. Drawn as thin instances of one tuft.
 */
const WHEAT = { x0: 5, x1: 45, z0: -29, z1: 21, step: 0.9 };

function wheatField(scene: Scene): void {
  const gold = new StandardMaterial("farmer2Wheat", scene);
  gold.diffuseColor = new Color3(0.78, 0.55, 0.16);
  gold.emissiveColor = new Color3(0.26, 0.17, 0.04);
  gold.specularColor = Color3.Black();
  const parts: Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const h = 0.5 + seeded(i, 30) * 0.2;
    const stalk = MeshBuilder.CreateCylinder("farmer2WheatStalk", { diameterTop: 0.05, diameterBottom: 0.09, height: h, tessellation: 3 }, scene);
    stalk.position.set(Math.cos(a) * 0.18, h / 2, Math.sin(a) * 0.18);
    stalk.rotation.set(Math.sin(a) * 0.15, 0, -Math.cos(a) * 0.15);
    const ear = MeshBuilder.CreateCylinder("farmer2WheatEar", { diameterTop: 0.04, diameterBottom: 0.16, height: 0.38, tessellation: 4 }, scene);
    ear.rotation.x = Math.PI;
    ear.position.set(Math.cos(a) * 0.25, h + 0.1, Math.sin(a) * 0.25);
    parts.push(stalk, ear);
  }
  const tuft = Mesh.MergeMeshes(parts, true);
  if (!tuft) return;
  tuft.name = "farmer2WheatField";
  tuft.convertToFlatShadedMesh();
  tuft.material = gold;
  tuft.isPickable = false;
  const cx = (WHEAT.x0 + WHEAT.x1) / 2, cz = (WHEAT.z0 + WHEAT.z1) / 2;
  const rx = (WHEAT.x1 - WHEAT.x0) / 2, rz = (WHEAT.z1 - WHEAT.z0) / 2;
  const matrices: number[] = [];
  let k = 0;
  for (let x = WHEAT.x0; x <= WHEAT.x1; x += WHEAT.step) {
    for (let z = WHEAT.z0; z <= WHEAT.z1; z += WHEAT.step) {
      k++;
      // Rounded-off corners: a superellipse over the rectangle
      if (((x - cx) / rx) ** 4 + ((z - cz) / rz) ** 4 > 1) continue;
      const px = x + (seeded(k, 31) - 0.5) * 0.6, pz = z + (seeded(k, 32) - 0.5) * 0.6;
      const s = 0.85 + seeded(k, 33) * 0.3;
      const m = Matrix.Compose(new Vector3(s, s, s), Quaternion.RotationYawPitchRoll(seeded(k, 34) * Math.PI * 2, 0.08, (seeded(k, 35) - 0.5) * 0.1), new Vector3(px, 0, pz));
      m.copyToArray(matrices, matrices.length);
    }
  }
  tuft.thinInstanceSetBuffer("matrix", new Float32Array(matrices), 16);
}

/**
 * The open pathway down the left side and its alley (card Overview; wiki shot left edge): a wide dirt track, 5 m across with two darker
 * wheel ruts, runs from the back-left rim down past the farmhouse corner to the front-left rim, bending a little; between it and the
 * left cobble wall (x -26) a narrow alley is shut off from the track by a broken wooden fence: posts every 2 m with two rails, some rails
 * hanging, two posts down and one stretch missing. Ring trees standing on the track go. Spec: track centre x = PATH.x + a 2 m sway.
 */
const PATH = { x: -37, half: 2.5, back: 44, front: -44 };
const FENCE = { x: -31, z0: -18, z1: 22, step: 2 };
const pathX = (z: number) => PATH.x + 2 * Math.sin(z * 0.06);

function leftPathway(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const mat = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = Color3.Black();
    return m;
  };
  const dirt = mat("farmer2Path", new Color3(0.62, 0.45, 0.24), 0.18);
  const rut = mat("farmer2PathRut", new Color3(0.45, 0.31, 0.16), 0.15);
  const wood = mat("farmer2Fence", new Color3(0.4, 0.27, 0.15), 0.2);
  const strip = (name: string, offset: number, half: number, y: number, m: StandardMaterial) => {
    const left: Vector3[] = [], right: Vector3[] = [];
    for (let z = PATH.back; z >= PATH.front; z -= 1) {
      left.push(new Vector3(pathX(z) + offset - half, y, z));
      right.push(new Vector3(pathX(z) + offset + half, y, z));
    }
    const mesh = MeshBuilder.CreateRibbon(name, { pathArray: [left, right], sideOrientation: Mesh.DOUBLESIDE }, scene);
    mesh.material = m;
    mesh.receiveShadows = true;
    mesh.isPickable = false;
  };
  strip("farmer2Path", 0, PATH.half, 0.05, dirt);
  strip("farmer2PathRut", -0.9, 0.25, 0.07, rut);
  strip("farmer2PathRut", 0.9, 0.25, 0.07, rut);

  // Clear ring trees off the track
  const cleared: Array<[number, number]> = [];
  for (const trunk of scene.meshes.filter((m) => built.has(m) && m.name === "trunk")) {
    const p = trunk.getAbsolutePosition();
    if (p.z > PATH.back || p.z < PATH.front || Math.abs(p.x - pathX(p.z)) > PATH.half + 1.5) continue;
    cleared.push([p.x, p.z]);
    trunk.dispose();
  }
  const kept = obstacles.filter((o) => !cleared.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));

  // The broken fence along the alley
  const parts: Mesh[] = [];
  let k = 0;
  for (let z = FENCE.z0; z < FENCE.z1; z += FENCE.step) {
    k++;
    const missing = z > 2 && z < 7; // one stretch gone
    if (missing) continue;
    const down = seeded(k, 51) < 0.15;
    const post = MeshBuilder.CreateBox("farmer2FencePost", { width: 0.22, height: 1.3, depth: 0.22 }, scene);
    post.position.set(FENCE.x, down ? 0.15 : 0.65, z);
    if (down) post.rotation.z = Math.PI / 2 - 0.2;
    else post.rotation.set((seeded(k, 52) - 0.5) * 0.2, 0, (seeded(k, 53) - 0.5) * 0.25);
    parts.push(post);
    if (z + FENCE.step >= FENCE.z1 || (z + FENCE.step > 2 && z + FENCE.step < 7) || down) continue;
    for (const y of [0.45, 0.95]) {
      const hanging = seeded(k * 2 + (y > 0.5 ? 1 : 0), 54) < 0.25;
      const rail = MeshBuilder.CreateBox("farmer2FenceRail", { width: 0.1, height: 0.12, depth: FENCE.step + 0.2 }, scene);
      rail.position.set(FENCE.x, hanging ? y - 0.25 : y, z + FENCE.step / 2);
      if (hanging) rail.rotation.x = 0.35 * (seeded(k, 55) < 0.5 ? 1 : -1);
      parts.push(rail);
    }
  }
  const fence = Mesh.MergeMeshes(parts, true);
  if (fence) {
    fence.name = "farmer2Fence";
    fence.convertToFlatShadedMesh();
    fence.material = wood;
    fence.receiveShadows = true;
    fence.isPickable = false;
  }
  // The fence blocks except at its missing stretch
  kept.push({ type: "box", center: new Vector3(FENCE.x, 0, (FENCE.z0 + 2) / 2), halfX: 0.2, halfZ: (2 - FENCE.z0) / 2 });
  kept.push({ type: "box", center: new Vector3(FENCE.x, 0, (7 + FENCE.z1) / 2), halfX: 0.2, halfZ: (FENCE.z1 - 7) / 2 });
  return kept;
}

/** Open plots (wiki shot): the base's dark totem pillar (22, 0) and black barricade box (10, 16) go, meshes and colliders */
const FIELD_JUNK: Array<[number, number]> = [[22, 0], [10, 16]];

function clearFieldJunk(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  for (const mesh of scene.meshes.filter((m) => built.has(m) && /^Introduction Grounds_(cyl|box|totem_top)$/.test(m.name))) {
    if (FIELD_JUNK.some(([x, z]) => Math.hypot(mesh.position.x - x, mesh.position.z - z) < 0.5)) mesh.dispose();
  }
  result.obstacles = result.obstacles.filter((o) => !FIELD_JUNK.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
}

/**
 * Straw sheaves (wiki shot, front-left field): tied sheaves of pale golden straw stand scattered over the front-left field (right of the dirt pathway) and the front
 * middle, about one every 5 m, some fallen on their side. Spec: about 18 sheaves on a jittered 5 m grid inside x -30..-6, z -44..-23 (the field the
 * cross wall z -20 and the centre wall x -2.5 close), kept on the island; each a 1.1 m bundle pinched at the waist (a flared foot, a flared
 * head of ears) with a dark twine band at the waist, 0.7 m across; one in four lies down. Drawn only, no colliders.
 */
const SHEAVES = { x0: -30, x1: -6, z0: -44, z1: -23, step: 5 };

function strawSheaves(scene: Scene): void {
  const mk = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = Color3.Black();
    return m;
  };
  const straw = mk("farmer2Sheaf", new Color3(0.9, 0.7, 0.36), 0.28);
  const twine = mk("farmer2SheafBand", new Color3(0.42, 0.27, 0.13), 0.2);
  const bodies: Mesh[] = [], bands: Mesh[] = [];
  let k = 0;
  for (let x = SHEAVES.x0; x <= SHEAVES.x1; x += SHEAVES.step) {
    for (let z = SHEAVES.z0; z <= SHEAVES.z1; z += SHEAVES.step) {
      k++;
      if (seeded(k, 60) < 0.12) continue;
      const px = x + (seeded(k, 61) - 0.5) * 3, pz = z + (seeded(k, 62) - 0.5) * 3;
      if ((px / 50) ** 2 + (pz / 46) ** 2 > 0.85) continue;
      const lying = seeded(k, 63) < 0.25;
      const s = 0.85 + seeded(k, 64) * 0.3;
      const foot = MeshBuilder.CreateCylinder("farmer2SheafFoot", { diameterTop: 0.38, diameterBottom: 0.7, height: 0.5, tessellation: 7 }, scene);
      foot.position.y = 0.25;
      const head = MeshBuilder.CreateCylinder("farmer2SheafHead", { diameterTop: 0.8, diameterBottom: 0.36, height: 0.6, tessellation: 7 }, scene);
      head.position.y = 0.8;
      const band = MeshBuilder.CreateCylinder("farmer2SheafBand", { diameter: 0.44, height: 0.12, tessellation: 7 }, scene);
      band.position.y = 0.5;
      for (const m of [foot, head, band]) {
        if (lying) {
          // Laid over on its side, its foot toward a random bearing
          m.position.set(m.position.y - 0.55, 0.36, 0);
          m.rotation.z = Math.PI / 2;
        }
        m.scaling.scaleInPlace(s);
        m.position.scaleInPlace(s);
        m.bakeCurrentTransformIntoVertices();
        m.rotation.y = seeded(k, 65) * Math.PI * 2;
        m.position.set(px, 0, pz);
        m.bakeCurrentTransformIntoVertices();
      }
      bodies.push(foot, head);
      bands.push(band);
    }
  }
  for (const [list, m, name] of [[bodies, straw, "farmer2Sheaves"], [bands, twine, "farmer2SheafBands"]] as const) {
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
 * Olive meadow (wiki shot): the grass is a warm olive yellow-green (not a cool grey-green, and not farmer_1's lemon), with faint darker
 * furrow strips worn into the open middle field between the left wall and the centre. Spec: grass, ground, dry-grass and blade materials of
 * this build take the olive hue (blades keep their shade ratio to the lawn); seven furrows 1.2 m wide, 3 m apart, run front to back
 * over x -23..-5, z -15..21, each a darker olive ribbon with a wavering edge, drawn only.
 */
const MEADOW = new Color3(0.62, 0.64, 0.2);
const FURROWS = { x0: -23, count: 7, gap: 3, z0: -15, z1: 21, half: 0.6 };

function oliveMeadow(scene: Scene): void {
  const grass = scene.getMaterialByName("grass") as StandardMaterial | null;
  if (grass) {
    const old = grass.diffuseColor.clone();
    grass.diffuseColor = MEADOW.clone();
    grass.emissiveColor = new Color3(0.05, 0.05, 0.0);
    for (const name of ["grassBladeDark", "grassBladeLight"]) {
      const blade = scene.getMaterialByName(name) as StandardMaterial | null;
      if (!blade) continue;
      const d = blade.diffuseColor;
      blade.diffuseColor = new Color3(d.r / old.r * MEADOW.r, d.g / old.g * MEADOW.g, d.b / old.b * MEADOW.b);
      blade.emissiveColor = grass.emissiveColor.clone();
    }
  }
  const ground = scene.getMaterialByName("groundMat") as StandardMaterial | null;
  if (ground) ground.diffuseColor = new Color3(0.56, 0.54, 0.2);
  const dry = scene.getMaterialByName("dryGrass") as StandardMaterial | null;
  if (dry) dry.diffuseColor = new Color3(0.66, 0.62, 0.24);
  const furrow = new StandardMaterial("farmer2Furrow", scene);
  furrow.diffuseColor = new Color3(0.46, 0.48, 0.15);
  furrow.emissiveColor = new Color3(0.04, 0.04, 0.0);
  furrow.specularColor = Color3.Black();
  const strips: Mesh[] = [];
  for (let f = 0; f < FURROWS.count; f++) {
    const x = FURROWS.x0 + f * FURROWS.gap;
    const left: Vector3[] = [], right: Vector3[] = [];
    for (let z = FURROWS.z0; z <= FURROWS.z1; z += 1.5) {
      const w = FURROWS.half * (0.8 + 0.4 * seeded(f * 40 + Math.round(z), 70));
      const sway = Math.sin(z * 0.08 + f) * 0.4;
      left.push(new Vector3(x + sway - w, 0.045, z));
      right.push(new Vector3(x + sway + w, 0.045, z));
    }
    strips.push(MeshBuilder.CreateRibbon("farmer2Furrow", { pathArray: [right, left], sideOrientation: Mesh.DOUBLESIDE }, scene));
  }
  const merged = Mesh.MergeMeshes(strips, true);
  if (merged) {
    merged.name = "farmer2Furrows";
    merged.material = furrow;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

export function buildFarmer2(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  clearFieldJunk(scene, built, result);
  oliveMeadow(scene);
  const stone = new StandardMaterial("farmer2WallStone", scene);
  stone.diffuseColor = new Color3(0.62, 0.62, 0.6);
  stone.emissiveColor = new Color3(0.07, 0.07, 0.08);
  stone.specularColor = new Color3(0.04, 0.04, 0.04);
  const obstacles = leftPathway(scene, built, [...result.obstacles]);
  WALLS.forEach((wall, w) => cobbleWall(scene, stone, wall, w, obstacles));
  wheatField(scene);
  strawSheaves(scene);
  return { ...result, obstacles };
}
