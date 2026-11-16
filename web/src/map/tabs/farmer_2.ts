// TABS "Farmer 2" (farmer map): grey dry-stone walls cut the island into fields (reference/maps/wiki/farmer_2.png; the card counts eight
// sections): a long wall down the front of the centre line between the sheaf field and the wheat, a cross wall closing the front-left sheaf
// field, a yard wall along the back past the farmhouse, a wall down the left side that makes the open pathway and its alley, and two short
// walls closing the back-right and front-right corners. Each wall has one gap a man can walk through.
// Spec: walls are axis-aligned runs of rough cobbles, knee high (0.5-0.8 m), 1 m thick, one box obstacle per stretch. They keep clear of the
// stage armies fought here (team 1 stands in x 2..41, z -26..18). Built on campaign.introduction (base()).
//
// [R] 563 look rebuild, spec read off reference/maps/wiki/farmer_2.png and farm_2.png (both CONFIRM lists):
// - Meadow: a yellow-olive khaki lawn, red above green (linear (0.6, 0.54, 0.18); green over red reads spring green), blades and dry grass
//   in the same hue, furrows a darker khaki.
// - Ring: the base's oak wall goes whole (every "trunk" with its oakBole/oakCrown lumps and the two round "Introduction Grounds" trees,
//   with their colliders).
//
// [R] 564 grove and wheat rebuild (CONFIRM lists 560, 561, 563; wiki farmer_2.png: trees stand in groups of two or three, each a tall
// trunk carrying a column of big chunky faceted crown blocks, their feet buried in boulder-like olive bush masses that run on as a hedge
// along the back rim and left edge; cottage-high bush heaps stand at the wall corners and beside the farmhouse; the wheat is a dense
// warm gold, taller than the meadow grass but under a man's waist):
// - Wheat: warm gold, linear (0.9, 0.66, 0.2), 0.3 self-lit (between the 562 orange and the 563 pale); stalks 0.65-0.8 m, ears to
//   0.9-1.0 m, 0.75 m apart.
// - Tree groups: 9 sites at 0.86 of the round rim (ellipse 54 x 48), angles 0, 40, 62, 84, 135, 158, 180, 197, 345 (from +x toward +z;
//   none across the front 215..325, none within 9 m of the farmhouse); 2 or 3 trees a site, 3.5 m apart along the rim, 1 m in or out.
//   Each tree: a dark trunk 0.5 / 0.85 m thick, 5.5-7 m tall, carrying 4 crown blocks stacked up it (7, 5.5, 4, 2.6 m across, flattened
//   0.7, each pushed 0.6-1 m off the trunk line to a different side), crown top about 13 m. One 0.7 m collider per tree.
// - Bush masses: at each tree's foot 3-4 olive balls 1.0-1.5 m in radius (2-3 m wide), and a hedge of 2 balls every 7 degrees at 0.93 of
//   the rim from 60 round the back to 210 (the back rim and left edge), skipped within 6 m of the farmhouse.
// - Bush heaps, cottage high (about 4 m): a ring of 4 balls 1.6-2 m radius under 1-2 more on top, at the wall corners (-43, 22), (42, 27),
//   (-4.5, -22.5), (6.5, -33.5) and beside the farmhouse (-20, 33), (-8, 33); one 3 m collider each.
// - Front rim: open grass to the edge, the hay sheaves on it; the six front clumps by the walls stay, their balls 1.1-1.6 m (were 0.8-1.3),
//   each with 1-2 khaki-grey faceted boulders 1.4-2.4 m: (-6, -41), (1.5, -40), (12, -36), (25, -37), (36, -34), (-41, -25) (2.4 m colliders).
//
// [R] 565 look rebuild (CONFIRM lists 560-564; wiki farmer_2.png, farm_2.png, stages/adventure.the_tiniest_attack.png):
// - Rim: the base's flat olive "hill" discs at the rim (one jutted past the edge over the void) go; where each stood, a chunky bush mass of
//   4-5 olive balls 1.5-2.1 m in radius (one riding on top) and two khaki-grey boulders 1.6-2.6 m sit on the field at 0.84 of the rim,
//   nothing past the edge; one 3 m collider each.
// - Farmhouse: pale weathered-tan plank walls (linear (0.88, 0.74, 0.52), a third self-lit), a mid-tan frame with half the battens, a light
//   grey-tan roof (0.74, 0.65, 0.5) on the same steep gable, a lit yellow window up in the front gable beside the two front ones.
// - Wheat: bright pale straw-gold (1, 0.8, 0.3), 0.35 self-lit (between the 563 pale and the 564 ochre), the lightest warm surface; a
//   straw floor (0.92, 0.72, 0.3) under the tufts so the gaps no longer read as dark speckle from above.
// - Alley: its lush green strip goes; the meadow runs between the fence and the wall (the field is one yellow-olive tone).
// - The 564 grove groups, hedge and heaps are kept.
import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

/** [x0, z0, x1, z1, gap centre along the run (0..1)] */
const WALLS: Array<[number, number, number, number, number]> = [
  [-2.5, -46, -2.5, -22, 0.55],   // front centre: sheaf field | wheat
  [-44, -20, -6, -20, 0.3],       // front-left sheaf field's back wall
  [-40, 24, 40, 24, 0.5],         // back yard wall
  [-26, -16, -26, 20, 0.6],       // left pathway | alley
  [22, 24, 22, 42.5, 0.45],       // back-right corner
  [8, -31, 40, -31, 0.4],         // front-right corner (ends at the round rim)
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
  // Big rounded field stones (wiki shot): a bottom course two stones wide (1.1-1.4 m across), a top course of single stones riding the
  // seam (0.9-1.15 m, one in five missing), so the wall stands about 1.6 m high and 1.8 m wide, a heap of round warm grey boulders
  for (let along = 0.55; along < len; along += 1.05) {
    if (along > gapFrom && along < gapTo) continue;
    const courses: Array<[number, number, number, number]> = [[-0.42, 0.45, 1.1, 0.3], [0.42, 0.45, 1.1, 0.3], [0, 1.15, 0.9, 0.25]];
    courses.forEach(([side, y, d, spread], c) => {
      k++;
      if (c === 2 && seeded(k + w * 500, 3) < 0.2) return;
      const r = (d + seeded(k + w * 500, 4) * spread) / 2;
      const stone = MeshBuilder.CreateIcoSphere("farmer2Cobble", { radius: r, subdivisions: 1 }, scene);
      stone.scaling.set(1.1, 0.78, 0.95);
      const ax = along + (seeded(k + w * 500, 5) - 0.5) * 0.3 + (c === 2 ? 0.52 : 0);
      stone.position.set(x0 + ux * ax - uz * side, y + (seeded(k, 9) - 0.5) * 0.1, z0 + uz * ax + ux * side);
      stone.rotation.set(seeded(k, 6) * 3, seeded(k, 7) * 3, seeded(k, 8) * 3);
      stones.push(stone);
    });
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
 * back past the centre, beside the long centre wall. The reference shows a warm straw-gold canopy
 * with a deeper orange at the rows' feet. Six swept stalks per clump, 0.65–0.95 m to the tips,
 * keep the crop below the waist. The heads overlap in the high shot and read separately at ground level.
 */
const WHEAT = { x0: 5, x1: 45, z0: -29, z1: 21, step: 0.75 };

function wheatField(scene: Scene): void {
  const gold = new StandardMaterial("farmer2Wheat", scene);
  gold.disableLighting = true;
  gold.emissiveColor = new Color3(1.1, 0.67, 0.23);
  const stems = new StandardMaterial("farmer2WheatStems", scene);
  stems.disableLighting = true;
  stems.emissiveColor = new Color3(0.88, 0.51, 0.14);
  gold.specularColor = Color3.Black();
  // A straw floor under the tufts ([R] 565): from above the gaps between them showed the meadow and shadow as dark speckle
  const straw = new StandardMaterial("farmer2WheatFloor", scene);
  straw.diffuseColor = new Color3(0.94, 0.58, 0.17);
  straw.emissiveColor = straw.diffuseColor.scale(0.145);
  straw.specularColor = Color3.Black();
  const floor = MeshBuilder.CreateCylinder("farmer2WheatFloor", { diameter: 2, height: 0.04, tessellation: 64 }, scene);
  const fpos = floor.getVerticesData("position")!;
  for (let v = 0; v < fpos.length; v += 3) {
    const reach = Math.hypot(fpos[v], fpos[v + 2]);
    if (reach < 1e-6) continue;
    // Pulled out from the unit circle to the field's rounded rectangle (the same superellipse, power 4)
    const c = fpos[v] / reach, s = fpos[v + 2] / reach;
    const r = (c ** 4 + s ** 4) ** -0.25;
    fpos[v] = c * r * reach * ((WHEAT.x1 - WHEAT.x0) / 2 + 0.3);
    fpos[v + 2] = s * r * reach * ((WHEAT.z1 - WHEAT.z0) / 2 + 0.3);
  }
  floor.setVerticesData("position", fpos);
  floor.refreshBoundingInfo();
  floor.position.set((WHEAT.x0 + WHEAT.x1) / 2, 0.06, (WHEAT.z0 + WHEAT.z1) / 2);
  floor.material = straw;
  floor.receiveShadows = true;
  floor.isPickable = false;
  const stalks: Mesh[] = [];
  const ears: Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = Math.cos(a), z = Math.sin(a);
    const h = 0.5 + seeded(i, 30) * 0.22;
    const foot = new Vector3(x * 0.11, 0, z * 0.11);
    const bend = new Vector3(x * 0.18 + 0.07, h * 0.58, z * 0.18);
    const tip = new Vector3(x * 0.24 + 0.13, h, z * 0.24);
    const stalk = MeshBuilder.CreateTube("farmer2WheatStalk", {
      path: [foot, bend, tip], radiusFunction: (index) => 0.044 - index * 0.009, tessellation: 3,
    }, scene);
    const ear = MeshBuilder.CreateIcoSphere("farmer2WheatEar", { radius: 0.15, subdivisions: 1 }, scene);
    ear.position.copyFrom(tip);
    ear.position.y += 0.08;
    ear.scaling.set(0.55, 1.55, 0.55);
    ear.rotation.z = -0.29;
    stalks.push(stalk);
    ears.push(ear);
  }
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
  const placement = new Float32Array(matrices);
  for (const [parts, mat, name] of [[stalks, stems, "farmer2WheatStems"], [ears, gold, "farmer2WheatHeads"]] as const) {
    const tuft = Mesh.MergeMeshes(parts, true);
    if (!tuft) continue;
    tuft.name = name;
    tuft.convertToFlatShadedMesh();
    tuft.material = mat;
    tuft.isPickable = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(tuft);
    tuft.thinInstanceSetBuffer("matrix", placement, 16);
  }
}

/**
 * The open pathway down the left side and its alley (card Overview; wiki shot left edge): a wide dirt track, 5 m across with two darker
 * wheel ruts, runs from the back-left rim down past the farmhouse corner to the front-left rim, bending a little; between it and the
 * left cobble wall (x -26) a narrow alley is shut off from the track by a broken wooden fence: posts every 2 m with two rails, some rails
 * hanging, two posts down and one stretch missing. Ring trees standing on the track go. Spec: track centre x = PATH.x + a 2 m sway.
 */
// The alley (critic 557): the fence reads as a real barrier (posts 1.6 m, three rails), the alley between it and the wall is meadow ([R]
// 565: no strip of its own), and the track stops at the back yard wall (z 24) instead of running through it.
const PATH = { x: -37, half: 2.5, back: 22.5, front: -32 };
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
    const post = MeshBuilder.CreateBox("farmer2FencePost", { width: 0.32, height: 1.6, depth: 0.32 }, scene);
    post.position.set(FENCE.x, down ? 0.18 : 0.8, z);
    if (down) post.rotation.z = Math.PI / 2 - 0.2;
    else post.rotation.set((seeded(k, 52) - 0.5) * 0.2, 0, (seeded(k, 53) - 0.5) * 0.25);
    parts.push(post);
    if (z + FENCE.step >= FENCE.z1 || (z + FENCE.step > 2 && z + FENCE.step < 7) || down) continue;
    for (const y of [0.4, 0.85, 1.3]) {
      const hanging = seeded(k * 3 + Math.round(y * 2), 54) < 0.22;
      const rail = MeshBuilder.CreateBox("farmer2FenceRail", { width: 0.14, height: 0.2, depth: FENCE.step + 0.2 }, scene);
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
  // The alley floor is the meadow itself ([R] 565: the whole field is one yellow-olive tone; the darker green strip went)
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
const SHEAVES = { x0: -30, x1: -6, z0: -36, z1: -16, step: 5 };

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
      const s = (0.85 + seeded(k, 64) * 0.3) * 1.5;
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
const MEADOW = new Color3(0.6, 0.54, 0.18);
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
  if (ground) ground.diffuseColor = new Color3(0.56, 0.5, 0.17);
  const dry = scene.getMaterialByName("dryGrass") as StandardMaterial | null;
  if (dry) dry.diffuseColor = new Color3(0.68, 0.6, 0.24);
  const furrow = new StandardMaterial("farmer2Furrow", scene);
  furrow.diffuseColor = new Color3(0.46, 0.41, 0.13);
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

/**
 * Back yard (wiki shot): no ruins and no far ridge range; behind the back yard wall stand big round olive bushes with pumpkins lying at
 * their feet. The base's ruins (meshes ruin*: tower at (16, 29), pillars, fallen pillar, blocks) go with their colliders, and its far
 * range (mountain*) is hidden. Spec: 7 bushes along z 27..35 between x -34 and 34, each 2-4 faceted olive balls 1.4-2.6 m across
 * heaped together; 16 pumpkins in clusters of 2-3 at the bushes' field side, 0.7-1.1 m across, squat, deep orange with a stem.
 * Drawn only, no colliders (all of it stands behind the wall, clear of the armies).
 */
const RUIN_COLLIDERS: Array<[number, number]> = [[16, 29], [-31, 29], [-24, 27], [-16, 30], [-8, 28], [30, 26], [-16.5, 24]];
const BUSHES: Array<[number, number]> = [[-33, 30], [-21, 33], [-9, 29], [3, 34], [13, 28], [24, 32], [34, 29]];

function backYard(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  for (const mesh of scene.meshes.filter((m) => built.has(m) && (m.name.startsWith("ruin") || m.name.startsWith("mountain")))) {
    if (mesh.name.startsWith("ruin")) mesh.dispose();
    else mesh.setEnabled(false);
  }
  result.obstacles = result.obstacles.filter((o) => !RUIN_COLLIDERS.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.01));
  const mk = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = Color3.Black();
    return m;
  };
  const balls: Mesh[] = [], fruit: Mesh[] = [], stems: Mesh[] = [];
  let k = 0;
  BUSHES.forEach(([bx, bz], b) => {
    const n = 2 + Math.floor(seeded(b, 81) * 3);
    for (let j = 0; j < n; j++) {
      const r = 0.7 + seeded(b * 5 + j, 82) * 0.6;
      const ball = MeshBuilder.CreateIcoSphere("farmer2Bush", { radius: r, subdivisions: 1 }, scene);
      ball.scaling.y = 0.85;
      ball.rotation.y = seeded(b * 5 + j, 83) * Math.PI;
      ball.position.set(bx + (j - (n - 1) / 2) * r * 1.2, r * 0.75 + (j === 1 ? r * 0.5 : 0), bz + (seeded(b * 5 + j, 84) - 0.5) * 1.5);
      balls.push(ball);
    }
    // Pumpkins at the bush's field side
    const m = b % 3 === 1 ? 3 : 2;
    for (let j = 0; j < m; j++, k++) {
      const d = 0.7 + seeded(k, 85) * 0.4;
      const x = bx + (seeded(k, 86) - 0.5) * 3.5, z = bz - 2.2 - seeded(k, 87) * 1.2;
      const p = MeshBuilder.CreateSphere("farmer2Pumpkin", { diameter: d, segments: 6 }, scene);
      p.scaling.y = 0.75;
      p.position.set(x, d * 0.36, z);
      fruit.push(p);
      const stem = MeshBuilder.CreateCylinder("farmer2PumpkinStem", { diameterTop: 0.06, diameterBottom: 0.1, height: 0.22, tessellation: 5 }, scene);
      stem.position.set(x, d * 0.72 + 0.08, z);
      stems.push(stem);
    }
  });
  const mats: Array<[Mesh[], StandardMaterial, string]> = [
    [balls, mk("farmer2Bush", new Color3(0.5, 0.52, 0.18), 0.2), "farmer2Bushes"],
    [fruit, mk("farmer2Pumpkin", new Color3(0.86, 0.36, 0.05), 0.3), "farmer2Pumpkins"],
    [stems, mk("farmer2PumpkinStem", new Color3(0.36, 0.26, 0.1), 0.15), "farmer2PumpkinStems"],
  ];
  for (const [list, m, name] of mats) {
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
 * Nothing outside the island (farm_2.png): the base's translucent placement-guide slabs (campaign_zone_overlay_* and
 * campaign_zone_border_*, rectangles reaching past the rim) are hidden; the placement zones stay in the map data.
 */
function hidePlacementGuides(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && /^campaign_zone_(overlay|border)_/.test(mesh.name)) mesh.setEnabled(false);
  }
}

/**
 * The farmhouse (wiki shot, back left): one timber cottage behind the back-left yard wall, its gable facing the field, among tall olive
 * pines. Spec: centred (-14, 37), 8 m wide, 6.5 m deep; walls 3.6 m of pale vertical planks (a batten every 0.8 m on the front and sides)
 * in a dark frame on a low stone sill; a steep 4.6 m gable roof of dark plank strips (eight a side) running front to back with a 0.7 m
 * overhang; a door and two lit yellow windows on the front, one lit window on each side. Two olive pines flank it at (-24, 39) and (-4, 40):
 * an 11-12 m trunk with four faceted olive clumps stacked up its top half, narrowing to the tip. The ring trees on the plot go with their
 * colliders; the house and pines get colliders.
 */
const COTTAGE = { x: -14, z: 37, w: 8, d: 6.5, wall: 3.6, roof: 4.6, eave: 0.7 };
const YARD_PINES: Array<[number, number]> = [[-24, 39], [-4, 40]];

function farmhouse(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const { x: cx, z: cz, w: W, d: D, wall: H } = COTTAGE;
  const cleared: Array<[number, number]> = [];
  for (const trunk of scene.meshes.filter((m) => built.has(m) && m.name === "trunk")) {
    const p = trunk.getAbsolutePosition();
    const onPlot = Math.abs(p.x - cx) < W / 2 + 3 && Math.abs(p.z - cz) < D / 2 + 3;
    if (!onPlot && !YARD_PINES.some(([x, z]) => Math.hypot(p.x - x, p.z - z) < 3.5)) continue;
    cleared.push([p.x, p.z]);
    trunk.dispose();
  }
  const kept = obstacles.filter((o) => !cleared.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
  const mk = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = Color3.Black();
    return m;
  };
  // [R] 565 (CONFIRM 564: the cottage read as a dark chocolate cabin): pale weathered-tan planks, a mid-tan frame, a light grey-tan roof
  const plankMat = mk("farmer2HousePlank", new Color3(0.88, 0.74, 0.52), 0.32);
  const darkMat = mk("farmer2HouseFrame", new Color3(0.56, 0.43, 0.28), 0.25);
  const roofMat = mk("farmer2HouseRoof", new Color3(0.74, 0.65, 0.5), 0.3);
  const sillMat = mk("farmer2HouseSill", new Color3(0.5, 0.45, 0.41), 0.1);
  const lit = new StandardMaterial("farmer2HouseLight", scene);
  lit.diffuseColor = Color3.Black();
  lit.emissiveColor = new Color3(1, 0.78, 0.3);
  lit.specularColor = Color3.Black();
  const needles = mk("farmer2PineCrown", new Color3(0.4, 0.42, 0.13), 0.25);
  const bark = mk("farmer2PineBark", new Color3(0.3, 0.17, 0.09), 0.15);
  const lists: Record<string, Mesh[]> = { plank: [], dark: [], roof: [], sill: [], lit: [], crown: [], bark: [] };
  const box = (k: string, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox(`farmer2House_${k}`, { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    lists[k].push(b);
    return b;
  };
  box("sill", W + 0.4, 0.5, D + 0.4, cx, 0.25, cz);
  box("plank", W, H, D, cx, 0.5 + H / 2, cz);
  for (let i = 0; i <= 10; i += 2) box("dark", 0.14, H, 0.1, cx - W / 2 + (i * W) / 10, 0.5 + H / 2, cz - D / 2 - 0.05);
  for (const s of [-1, 1]) for (let i = 0; i <= 8; i += 2) box("dark", 0.1, H, 0.14, cx + s * (W / 2 + 0.05), 0.5 + H / 2, cz - D / 2 + (i * D) / 8);
  for (const y of [0.6, 0.5 + H - 0.1]) box("dark", W + 0.3, 0.3, D + 0.3, cx, y, cz);
  // Door and lit windows on the front, a lit window on each side and one up in the front gable
  box("dark", 1.3, 2.2, 0.2, cx, 0.5 + 1.1, cz - D / 2 - 0.1);
  box("lit", 0.9, 0.9, 0.2, cx, 0.5 + H + 1.3, cz - D / 2 - 0.1);
  for (const s of [-1, 1]) {
    box("lit", 1.1, 1, 0.2, cx + s * 2.5, 0.5 + 1.9, cz - D / 2 - 0.1);
    box("lit", 0.2, 1, 1.1, cx + s * (W / 2 + 0.1), 0.5 + 1.9, cz);
  }
  // Gable prism and plank roof strips
  const top = 0.5 + H, span = W + 2 * COTTAGE.eave, half = span / 2;
  const gable = MeshBuilder.CreateCylinder("farmer2HouseGable", { diameter: W * 1.155, height: D, tessellation: 3 }, scene);
  gable.rotation.y = Math.PI / 2;
  gable.bakeCurrentTransformIntoVertices();
  gable.rotation.x = Math.PI / 2;
  const tall = COTTAGE.roof / (W * 1.155 * 0.75);
  gable.scaling.set(1, 1, tall);
  gable.position.set(cx, top + W * 1.155 * 0.25 * tall, cz);
  lists.plank.push(gable);
  const theta = Math.atan2(COTTAGE.roof, W / 2);
  const slope = half / Math.cos(theta);
  const eaveY = top - COTTAGE.eave * Math.tan(theta);
  for (const s2 of [-1, 1]) {
    for (let j = 0; j < 8; j++) {
      const s = ((j + 0.5) / 8) * slope;
      const p = box("roof", slope / 8 + 0.1, 0.2, D + 1.4, cx + s2 * (half - s * Math.cos(theta)), eaveY + s * Math.sin(theta) + 0.12, cz);
      p.rotation.z = -s2 * theta;
    }
  }
  kept.push({ type: "box", center: new Vector3(cx, 0, cz), halfX: W / 2 + 0.2, halfZ: D / 2 + 0.2 });
  // Olive pines either side
  YARD_PINES.forEach(([x, z], i) => {
    const h = 11 + seeded(i, 91);
    const trunk = MeshBuilder.CreateCylinder("farmer2PineTrunk", { diameterTop: 0.25, diameterBottom: 0.55, height: h, tessellation: 6 }, scene);
    trunk.position.set(x, h / 2, z);
    lists.bark.push(trunk);
    for (let c = 0; c < 4; c++) {
      const r = 2.3 - c * 0.45;
      const clump = MeshBuilder.CreateIcoSphere("farmer2PineCrown", { radius: r, subdivisions: 1 }, scene);
      clump.scaling.y = 0.8;
      clump.rotation.y = seeded(i * 4 + c, 92) * Math.PI;
      clump.position.set(x + (seeded(i * 4 + c, 93) - 0.5) * 1.2, h * 0.5 + c * h * 0.15 + r * 0.4, z + (seeded(i * 4 + c, 94) - 0.5) * 1.2);
      lists.crown.push(clump);
    }
    kept.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 0.6 });
  });
  const mats: Record<string, StandardMaterial> = { plank: plankMat, dark: darkMat, roof: roofMat, sill: sillMat, lit, crown: needles, bark };
  for (const [k, list] of Object.entries(lists)) {
    const merged = Mesh.MergeMeshes(list, true);
    if (!merged) continue;
    merged.name = `farmer2House_${k}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[k];
    merged.receiveShadows = k !== "lit";
    merged.isPickable = false;
    if (k === "lit") scene.getGlowLayerByName("glow")?.addExcludedMesh(merged);
  }
  return kept;
}

/**
 * Round island (farm_2.png): the island is a near-circle with the field running to its rim, not a rounded-rectangle slab. Spec: the outline
 * is the ellipse 54 x 48; every base slab that follows the base's superellipse (54 x 48, power 3: "ground", "centerGrass", the underside
 * "islandUnder", "islandShelf", "islandCliff") is remapped vertex by vertex onto it at the same fraction of the radius; grass blades and
 * wheat tufts past the rim (less 0.5 m) are dropped, base props past it (less 1 m) hidden with their colliders; the pathway stops at
 * z -32 and the front-right and back-right walls end inside the rim.
 */
const RIM_PROPS = new Set(["trunk", "boulder", "wallStone", "hayBale", "stump", "hill", "grassTuft", "flowerDot", "pebble"]);
const REMAPPED = new Set(["ground", "centerGrass", "islandUnder", "islandShelf", "islandCliff"]);

function roundIsland(scene: Scene, prior: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const oldR = (a: number) => (Math.abs(Math.cos(a) / 54) ** 3 + Math.abs(Math.sin(a) / 48) ** 3) ** (-1 / 3);
  const newR = (a: number) => ((Math.cos(a) / 54) ** 2 + (Math.sin(a) / 48) ** 2) ** -0.5;
  const inside = (x: number, z: number, m: number) => Math.hypot(x, z) <= newR(Math.atan2(z, x)) - m;
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (prior.has(mesh) || !(mesh instanceof Mesh)) continue;
    // The haze band is one merged mesh laid along the old straight edges: it goes whole
    if (mesh.name === "hazeTreeline") mesh.setEnabled(false);
    else if (REMAPPED.has(mesh.name)) {
      const pos = mesh.getVerticesData("position");
      if (!pos) continue;
      for (let v = 0; v < pos.length; v += 3) {
        if (Math.hypot(pos[v], pos[v + 2]) < 1e-6) continue;
        const a = Math.atan2(pos[v + 2], pos[v]);
        const k = newR(a) / oldR(a);
        pos[v] *= k;
        pos[v + 2] *= k;
      }
      mesh.setVerticesData("position", pos);
      mesh.refreshBoundingInfo();
    } else if (mesh.name.startsWith("fieldBlades_")) {
      const pos = mesh.getVerticesData("position");
      if (!pos) continue;
      for (let v = 0; v + 11 < pos.length; v += 12) {
        if (inside(pos[v], pos[v + 2], 0.5)) continue;
        for (let c = 3; c < 12; c++) pos[v + c] = pos[v + (c % 3)];
      }
      mesh.setVerticesData("position", pos);
    } else if (mesh.thinInstanceCount > 0 && mesh.name === "farmer2WheatField") {
      const kept = mesh.thinInstanceGetWorldMatrices().filter((w) => inside(w.m[12], w.m[14], 0.5));
      const buf = new Float32Array(kept.length * 16);
      kept.forEach((w, i) => buf.set(w.m, i * 16));
      mesh.thinInstanceSetBuffer("matrix", buf, 16);
    } else if (RIM_PROPS.has(mesh.name) && !mesh.parent && mesh.isEnabled() && !inside(mesh.position.x, mesh.position.z, 1)) {
      gone.push([mesh.position.x, mesh.position.z]);
      mesh.setEnabled(false);
    }
  }
  return obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
}

/**
 * Island underside (farm_2.png; farmer_1's earth bowl kit, this map's own copy): under a thin olive grass lip the island is one deep
 * rounded bowl of warm grey-brown earth with pale grey stones set all over its face; the base's navy islandUnder/islandShelf/islandCliff
 * (shelf and black spikes) go. Spec: the bowl follows the round outline (ellipse 54 x 48), a 1.5 m lip band, then bulges down to a rounded
 * point 34 m below the field (about 0.3 of the island width; scale 1, .98, .94, .86, .72, .52, .28, .04); about 110 flattened stones
 * 1.6-3.6 m across sunk half into its face at every angle between 2 and 30 m down. Mid-tone, self-lit and out of the fog so the shaded
 * face stays brown rather than black.
 */
const BOWL: Array<[number, number]> = [[1, -0.02], [1, -1.5], [0.98, -6], [0.94, -12], [0.86, -18], [0.72, -24], [0.52, -29], [0.28, -32.5], [0.04, -34]];
const bowlOutline = (a: number): [number, number] => {
  const c = Math.cos(a), s = Math.sin(a);
  const r = ((c / 54) ** 2 + (s / 48) ** 2) ** -0.5;
  return [c * r, s * r];
};

function earthBowl(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && ["islandUnder", "islandShelf", "islandCliff"].includes(mesh.name)) mesh.setEnabled(false);
  }
  const glow = scene.getGlowLayerByName("glow");
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const lip = mk("farmer2UnderLip", new Color3(0.42, 0.46, 0.13), 0.3);
  // The bowl's face looks down and away from the sun: it is lit mostly by itself, or it reads near black
  const earth = mk("farmer2UnderEarth", new Color3(0.5, 0.4, 0.27), 1.0);
  const pebble = mk("farmer2UnderStone", new Color3(0.62, 0.57, 0.48), 0.9);
  const finish = (mesh: Mesh | null, name: string, mat: StandardMaterial) => {
    if (!mesh) return;
    mesh.name = name;
    mesh.convertToFlatShadedMesh();
    mesh.material = mat;
    mesh.applyFog = false;
    mesh.isPickable = false;
    glow?.addExcludedMesh(mesh);
  };
  const bands: Mesh[] = [];
  for (let i = 0; i < BOWL.length - 1; i++) {
    const [s0, y0] = BOWL[i], [s1, y1] = BOWL[i + 1];
    const band = MeshBuilder.CreateCylinder("farmer2Bowl", { diameterTop: s0, diameterBottom: s1, height: y0 - y1, tessellation: 64 }, scene);
    const pos = band.getVerticesData("position")!;
    for (let v = 0; v < pos.length; v += 3) {
      const reach = Math.hypot(pos[v], pos[v + 2]) * 2;
      const [x, z] = bowlOutline(Math.atan2(pos[v + 2], pos[v]));
      pos[v] = x * reach;
      pos[v + 2] = z * reach;
    }
    band.setVerticesData("position", pos);
    band.position.y = (y0 + y1) / 2;
    if (i === 0) finish(band, "farmer2BowlLip", lip);
    else bands.push(band);
  }
  finish(Mesh.MergeMeshes(bands, true), "farmer2Bowl", earth);
  // Stones set into the face at every angle and depth, flattened along the outward direction
  const stones: Mesh[] = [];
  for (let k = 0; k < 110; k++) {
    const a = ((k + seeded(k, 91)) / 110) * Math.PI * 2;
    const y = -2 - seeded(k, 92) * 28;
    let j = 1;
    while (j < BOWL.length - 1 && BOWL[j][1] > y) j++;
    const [sa, ya] = BOWL[j - 1], [sb, yb] = BOWL[j];
    const s = sa + (sb - sa) * ((y - ya) / (yb - ya));
    const [ox, oz] = bowlOutline(a);
    const d = 1.6 + seeded(k, 93) * 2;
    const stone = MeshBuilder.CreateIcoSphere("farmer2UnderStone", { radius: d / 2, subdivisions: 2 }, scene);
    stone.scaling.set(1.3, 0.85, 0.5);
    stone.rotation.set(0, Math.PI / 2 - a, (seeded(k, 94) - 0.5) * 0.6);
    stone.position.set(ox * s, y, oz * s);
    stones.push(stone);
  }
  finish(Mesh.MergeMeshes(stones, true), "farmer2UnderStones", pebble);
}

/**
 * Olive grove ring ([R] 563, spec at the head of this file): the base's oak wall and the two round field trees go with their colliders;
 * sparse tall stacked-crown olive trees and round olive bush clumps stand round the back and sides, the front rim is open grass with big
 * bush/boulder clumps beside the front walls. Crowns are lit by their own colour, out of the fog; dark trunks stay in the glow pass.
 */
const GROVE = { at: 0.86, bushAt: 0.93, hedgeFrom: 60, hedgeTo: 210 }; // angles from +x toward +z
const GROVE_SITES = [0, 40, 62, 84, 135, 158, 180, 197, 345];
const BUSH_HEAPS: Array<[number, number]> = [[-43, 22], [42, 27], [-4.5, -22.5], [6.5, -33.5], [-20, 33], [-8, 33]];
const FRONT_CLUMPS: Array<[number, number]> = [[-6, -41], [1.5, -40], [12, -36], [25, -37], [36, -34], [-41, -25]];

function oliveGrove(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || mesh.parent || !mesh.isEnabled()) continue;
    if (mesh.name !== "trunk" && !mesh.name.startsWith("Introduction Grounds_")) continue;
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
  const leaf = mk("farmer2OliveLeaf", new Color3(0.62, 0.56, 0.19), 0.6);
  const leafDark = mk("farmer2OliveLeafDark", new Color3(0.5, 0.46, 0.15), 0.55);
  const bark = mk("farmer2OliveBark", new Color3(0.2, 0.15, 0.1), 0.25);
  const rockMat = mk("farmer2FrontRock", new Color3(0.6, 0.55, 0.44), 0.25);
  const rimAt = (deg: number, f: number): [number, number] => {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const r = ((c / 54) ** 2 + (s / 48) ** 2) ** -0.5 * f;
    return [c * r, s * r];
  };
  const light: Mesh[] = [], dark: Mesh[] = [], trunks: Mesh[] = [], rocks: Mesh[] = [];
  const ball = (x: number, y: number, z: number, r: number, k: number, squash = 0.85) => {
    const b = MeshBuilder.CreateIcoSphere("farmer2OliveBall", { radius: r, subdivisions: 1 }, scene);
    b.scaling.y = squash;
    b.rotation.set(seeded(k, 141) * 0.5, seeded(k, 142) * Math.PI, 0);
    b.position.set(x, y, z);
    (seeded(k, 143) < 0.55 ? light : dark).push(b);
  };
  // Tree groups ([R] 564): 2-3 trees a site along the rim, each a thick trunk under a column of four chunky crown blocks, bush masses at
  // their feet
  let k = 0;
  GROVE_SITES.forEach((deg, site) => {
    const [sx, sz] = rimAt(deg, GROVE.at);
    const len = Math.hypot(sx, sz), ux = sx / len, uz = sz / len;   // out from the centre
    const tx = -uz, tz = ux;                                         // along the rim
    const n = 2 + (seeded(site, 160) > 0.45 ? 1 : 0);
    for (let j = 0; j < n; j++) {
      k++;
      const along = (j - (n - 1) / 2) * 3.5, out = (seeded(k, 161) - 0.5) * 2;
      const x = sx + tx * along + ux * out, z = sz + tz * along + uz * out;
      if (Math.hypot(x - COTTAGE.x, z - COTTAGE.z) < 9) continue;
      const h = 5.5 + seeded(k, 145) * 1.5;
      const trunk = MeshBuilder.CreateCylinder("farmer2OliveTrunk", { diameterTop: 0.5, diameterBottom: 0.85, height: h, tessellation: 5 }, scene);
      trunk.position.set(x, h / 2, z);
      trunk.rotation.z = (seeded(k, 146) - 0.5) * 0.12;
      trunks.push(trunk);
      let y = h - 1.2;
      [7, 5.5, 4, 2.6].forEach((w, t) => {
        const c = MeshBuilder.CreateIcoSphere("farmer2OliveCrown", { radius: w / 2, subdivisions: 1 }, scene);
        c.scaling.set(1, 0.7, 0.9);
        c.rotation.set(seeded(k * 4 + t, 162) * 0.6, seeded(k * 4 + t, 147) * Math.PI, 0);
        const side = seeded(k * 4 + t, 148) * Math.PI * 2, push = t === 0 ? 0.3 : 0.6 + seeded(k * 4 + t, 149) * 0.4;
        c.position.set(x + Math.cos(side) * push, y, z + Math.sin(side) * push);
        (t % 2 === 1 ? dark : light).push(c);
        y += w * 0.7 * 0.62;
      });
      kept.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 0.7 });
      // The bush mass at its foot
      const m = 3 + (seeded(k, 163) > 0.5 ? 1 : 0);
      for (let b = 0; b < m; b++) {
        const r = 1 + seeded(k * 5 + b, 151) * 0.5;
        const a = (b / m) * Math.PI * 2 + seeded(k, 164) * 2;
        ball(x + Math.cos(a) * 1.6, r * 0.7, z + Math.sin(a) * 1.6, r, 500 + k * 5 + b);
      }
    }
  });
  // The hedge: two balls every 7 degrees along the back rim and the left edge
  // Rim masses ([R] 565): the base's flat olive "hill" discs at the rim (one jutted past the edge) go; where each stood, a chunky bush
  // mass of 4-5 balls (1.5-2.1 m) with two khaki-grey boulders sits on the field at 0.84 of the rim, nothing past the edge
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || mesh.name !== "hill" || !mesh.isEnabled()) continue;
    const deg = (Math.atan2(mesh.position.z, mesh.position.x) * 180) / Math.PI;
    mesh.setEnabled(false);
    k++;
    const [hx, hz] = rimAt(deg, 0.84);
    if (Math.hypot(hx - COTTAGE.x, hz - COTTAGE.z) < 8) continue;
    const n = 4 + (seeded(k, 170) > 0.5 ? 1 : 0);
    for (let j = 0; j < n; j++) {
      const r = 1.5 + seeded(k * 7 + j, 171) * 0.6;
      const a = (j / n) * Math.PI * 2 + seeded(k, 172) * 2;
      const lift = j === n - 1 ? r * 0.9 : 0;
      ball(hx + Math.cos(a) * (j === n - 1 ? 0.4 : 1.9), r * 0.75 + lift, hz + Math.sin(a) * (j === n - 1 ? 0.4 : 1.9), r, 1400 + k * 7 + j);
    }
    for (let j = 0; j < 2; j++) {
      const d = 1.6 + seeded(k * 3 + j, 173) * 1;
      const rock = MeshBuilder.CreatePolyhedron("farmer2FrontRock", { type: 2, size: d / 2.6 }, scene);
      rock.scaling.set(1.15, 0.7, 1);
      rock.rotation.set(seeded(k * 3 + j, 174) * 0.4, seeded(k * 3 + j, 175) * Math.PI, 0);
      const a = seeded(k * 3 + j, 176) * Math.PI * 2;
      rock.position.set(hx + Math.cos(a) * 3, d * 0.28, hz + Math.sin(a) * 3);
      rocks.push(rock);
    }
    kept.push({ type: "cylinder", center: new Vector3(hx, 0, hz), radius: 3 });
  }
  for (let deg = GROVE.hedgeFrom; deg <= GROVE.hedgeTo; deg += 7) {
    k++;
    const [bx, bz] = rimAt(deg + (seeded(k, 165) - 0.5) * 3, GROVE.bushAt);
    if (Math.hypot(bx - COTTAGE.x, bz - COTTAGE.z) < 6) continue;
    for (let j = 0; j < 2; j++) {
      const r = 1 + seeded(k * 3 + j, 152) * 0.4;
      const a = deg * (Math.PI / 180) + Math.PI / 2;
      ball(bx + Math.cos(a) * (j - 0.5) * 1.8, r * 0.7, bz + Math.sin(a) * (j - 0.5) * 1.8, r, 800 + k * 3 + j);
    }
  }
  // Cottage-high bush heaps at the wall corners and beside the farmhouse
  BUSH_HEAPS.forEach(([cx, cz], p) => {
    for (let j = 0; j < 4; j++) {
      const r = 1.6 + seeded(p * 9 + j, 166) * 0.4;
      const a = (j / 4) * Math.PI * 2 + seeded(p, 167);
      ball(cx + Math.cos(a) * 1.7, r * 0.75, cz + Math.sin(a) * 1.7, r, 1200 + p * 9 + j);
    }
    for (let j = 0; j < 1 + (p % 2); j++) {
      const r = 1.4 + seeded(p * 9 + 5 + j, 166) * 0.4;
      ball(cx + (j - 0.5 * (p % 2)) * 1.4, 2.6 + r * 0.5, cz + (seeded(p * 9 + j, 168) - 0.5) * 1.2, r, 1250 + p * 9 + j);
    }
    kept.push({ type: "cylinder", center: new Vector3(cx, 0, cz), radius: 3 });
  });
  FRONT_CLUMPS.forEach(([cx, cz], p) => {
    const n = 2 + (p % 2);
    for (let j = 0; j < n; j++) {
      const r = 1.1 + seeded(p * 7 + j, 153) * 0.5;
      const a = (j / n) * Math.PI * 2 + seeded(p, 154);
      ball(cx + Math.cos(a) * 1.4, r * 0.75 + (j === n - 1 && n > 2 ? r * 0.5 : 0), cz + Math.sin(a) * 1.4, r, 300 + p * 7 + j);
    }
    for (let j = 0; j < 1 + (p % 2 === 0 ? 1 : 0); j++) {
      const d = 1.4 + seeded(p * 3 + j, 155) * 1;
      const rock = MeshBuilder.CreatePolyhedron("farmer2FrontRock", { type: 2, size: d / 2.6 }, scene);
      rock.scaling.set(1.15, 0.7, 1);
      rock.rotation.set(seeded(p * 3 + j, 156) * 0.4, seeded(p * 3 + j, 157) * Math.PI, 0);
      const a = seeded(p * 3 + j, 158) * Math.PI * 2;
      rock.position.set(cx + Math.cos(a) * 2.2, d * 0.28, cz + Math.sin(a) * 2.2);
      rocks.push(rock);
    }
    kept.push({ type: "cylinder", center: new Vector3(cx, 0, cz), radius: 2.4 });
  });
  for (const [list, m, name, inGlow] of [[light, leaf, "farmer2OliveCrowns", false], [dark, leafDark, "farmer2OliveCrownsDark", false], [trunks, bark, "farmer2OliveTrunks", true], [rocks, rockMat, "farmer2FrontRocks", true]] as const) {
    const merged = list.length ? Mesh.MergeMeshes([...list], true) : null;
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = m;
    merged.applyFog = false;
    merged.receiveShadows = true;
    merged.isPickable = false;
    if (!inGlow) scene.getGlowLayerByName("glow")?.addExcludedMesh(merged);
  }
  return kept;
}

export function buildFarmer2(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  clearFieldJunk(scene, built, result);
  backYard(scene, built, result);
  hidePlacementGuides(scene, built);
  oliveMeadow(scene);
  const stone = new StandardMaterial("farmer2WallStone", scene);
  stone.diffuseColor = new Color3(0.62, 0.5, 0.38);
  stone.emissiveColor = new Color3(0.13, 0.105, 0.075);
  stone.specularColor = new Color3(0.04, 0.04, 0.04);
  const obstacles = farmhouse(scene, built, leftPathway(scene, built, [...result.obstacles]));
  WALLS.forEach((wall, w) => cobbleWall(scene, stone, wall, w, obstacles));
  wheatField(scene);
  strawSheaves(scene);
  earthBowl(scene, built);
  const kept = oliveGrove(scene, built, roundIsland(scene, prior, obstacles));
  return { ...result, obstacles: kept };
}
