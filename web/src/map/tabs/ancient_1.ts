import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

// The placement reference shows a long rectangular slab. Two four-metre streets run along it
// between low blocks, with a cross street and an open plaza around each end of the building rows.
const LENGTH = 112;
const WIDTH = 72;
// Streets (572, card Overview + greek_ancient_1.png): the houses stand in three continuous bands across the middle
// of the city (front z -26..-12, middle -8..8, back 12..26, each x -24..24 in four joined houses), so two narrow
// 4 m streets at z -10 and +10 run side to side between them and open onto the side plazas at both ends; the
// arch spans the back street at x 0. The armies' plazas (|x| >= 25) stay open.
const STREETS = [-10, 10];
const STREET_WIDTH = 4;
const BLOCK_SPAN = 24;
const BANDS: Array<[number, number]> = [[-19, 14], [0, 16], [19, 14]];

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

// Statue corner (571, wiki shot and greek_ancient_1.png): beyond the back wall on the left half the island
// runs on as a rocky headland. A blue bay (about 30 x 9 m, lobed) lies between the city wall and the rocks,
// rimmed by heaped brown boulders with moss on top; behind it a raised rock outcrop (about 16 m across,
// 3-4 m high) carries the statue. All of it is outside the walled field: drawn only, no colliders.
export const HEADLAND = { x: -21, z: 49, outcrop: 8 };
function bayHeadland(scene: Scene, earth: StandardMaterial): void {
  const rock = new StandardMaterial("ancient1HeadlandRock", scene);
  rock.diffuseColor = new Color3(0.55, 0.27, 0.18);
  rock.emissiveColor = rock.diffuseColor.scale(0.22);
  const moss = new StandardMaterial("ancient1HeadlandMoss", scene);
  moss.diffuseColor = new Color3(0.45, 0.58, 0.2);
  moss.emissiveColor = moss.diffuseColor.scale(0.2);
  const sea = new StandardMaterial("ancient1BayWater", scene);
  sea.diffuseColor = new Color3(0.09, 0.27, 0.78);
  sea.emissiveColor = new Color3(0.04, 0.12, 0.42);
  sea.specularColor = new Color3(0.3, 0.35, 0.45);
  const shelf = MeshBuilder.CreateBox("ancient1HeadlandSlab", { width: 44, height: 10, depth: 21 }, scene);
  shelf.position.set(-22, -6.4, 46.5);
  shelf.material = earth;
  const bay = MeshBuilder.CreateDisc("ancient1Bay", { radius: 1, tessellation: 28 }, scene);
  bay.rotation.x = Math.PI / 2;
  bay.scaling.set(16, 5.2, 1);
  bay.position.set(-22, -1.05, 41.6);
  bay.material = sea;
  const shallows = MeshBuilder.CreateDisc("ancient1BayShallows", { radius: 1, tessellation: 28 }, scene);
  shallows.rotation.x = Math.PI / 2;
  shallows.scaling.set(17.4, 6.3, 1);
  shallows.position.set(-22, -1.1, 41.4);
  shallows.material = sea;
  const boulder = (name: string, x: number, y: number, z: number, r: number, i: number) => {
    const b = MeshBuilder.CreateIcoSphere(name, { radius: r, subdivisions: 1, flat: true }, scene);
    b.position.set(x, y, z);
    b.scaling.set(1 + seeded(i, 3) * 0.4, 0.62 + seeded(i, 4) * 0.3, 1 + seeded(i, 5) * 0.3);
    b.rotation.y = seeded(i, 6) * Math.PI;
    b.material = rock;
    b.receiveShadows = true;
    if (seeded(i, 7) > 0.45) {
      const cap = MeshBuilder.CreateIcoSphere("ancient1HeadlandMossCap", { radius: r * 0.72, subdivisions: 1, flat: true }, scene);
      cap.position.set(x, y + r * 0.42, z);
      cap.scaling.set(b.scaling.x, 0.28, b.scaling.z);
      cap.material = moss;
    }
  };
  // The bay rim: heaped boulders along its left, right and back shores (the wall is its front shore).
  for (let i = 0; i < 22; i++) {
    const a = Math.PI * (0.02 + 0.96 * i / 21);
    const x = -22 - Math.cos(a) * (17.5 + seeded(i, 1) * 1.5);
    const z = 41.4 + Math.sin(a) * (6.6 + seeded(i, 2) * 1.2);
    boulder("ancient1BayBoulder", x, -0.7, z, 1.4 + seeded(i, 8) * 1.1, i);
  }
  // The outcrop under the statue: a heaped mound of boulders rising to about 4 m.
  for (let i = 0; i < 18; i++) {
    const a = i * 2.39996, d = Math.sqrt(i / 18) * HEADLAND.outcrop;
    const x = HEADLAND.x + Math.cos(a) * d, z = HEADLAND.z + Math.sin(a) * d * 0.7;
    boulder("ancient1OutcropRock", x, 2.6 - d * 0.32, z, 2.4 + seeded(i, 9) * 1.4, i + 40);
  }
  for (const [x, z, r] of [[-38, 50, 2.4], [-6, 50, 2.6], [-41, 44, 1.8], [-3, 44, 1.9]] as const) {
    boulder("ancient1HeadlandRock", x, -0.3, z, r, Math.round(x * z));
  }
}

// Hoplite statue (571, greek_ancient_1.png): a giant pale stone warrior on a stepped plinth atop the
// outcrop, facing the field, a spear upright in his right hand rising well above his head and a big round
// shield on his left arm. Spec: plinth 8 / 6 m square in two steps to 7 m above the base; figure 13 m to
// the crest; spear 21 m; shield 6.4 m across.
function hopliteStatue(scene: Scene): void {
  const marble = new StandardMaterial("ancient1StatueMarble", scene);
  marble.diffuseColor = new Color3(0.86, 0.84, 0.76);
  marble.emissiveColor = marble.diffuseColor.scale(0.2);
  const { x, z } = HEADLAND;
  const part = (name: string, px: number, py: number, pz: number, w: number, h: number, d: number) => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.position.set(x + px, py, z + pz);
    m.material = marble;
    m.receiveShadows = true;
    return m;
  };
  part("ancient1StatuePlinth", 0, 4.1, 0, 8, 1.8, 8);
  part("ancient1StatuePlinth", 0, 5.9, 0, 6, 1.8, 6);
  const foot = 6.8;
  for (const side of [-1, 1]) {
    part("ancient1StatueLeg", side * 0.95, foot + 2.3, 0, 1.15, 4.6, 1.25).rotation.z = side * 0.06;
  }
  part("ancient1StatueSkirt", 0, foot + 5, 0, 3.3, 1.6, 2.1);
  part("ancient1StatueTorso", 0, foot + 7.2, 0, 3.1, 3, 1.9);
  part("ancient1StatueShoulders", 0, foot + 8.9, 0, 4.4, 0.9, 1.9);
  part("ancient1StatueNeck", 0, foot + 9.6, 0, 0.8, 0.6, 0.8);
  const head = MeshBuilder.CreateIcoSphere("ancient1StatueHelmet", { radius: 0.95, subdivisions: 1, flat: true }, scene);
  head.position.set(x, foot + 10.5, z);
  head.scaling.y = 1.15;
  head.material = marble;
  part("ancient1StatueCrest", 0, foot + 11.5, 0.25, 0.35, 1.0, 2.4);
  // Right arm down to the spear, left arm forward behind the shield.
  part("ancient1StatueArm", 2.5, foot + 7.6, 0, 0.9, 2.8, 0.9).rotation.z = 0.15;
  part("ancient1StatueArm", -2.4, foot + 7.8, -0.6, 0.9, 2.6, 0.9).rotation.x = -0.5;
  const spear = MeshBuilder.CreateCylinder("ancient1StatueSpear", { diameter: 0.34, height: 21, tessellation: 8 }, scene);
  spear.position.set(x + 3, foot + 6.5, z - 0.3);
  spear.material = marble;
  const tip = MeshBuilder.CreateCylinder("ancient1StatueSpearTip", { diameterTop: 0, diameterBottom: 0.7, height: 1.6, tessellation: 6 }, scene);
  tip.position.set(x + 3, foot + 17.8, z - 0.3);
  tip.material = marble;
  const shield = MeshBuilder.CreateCylinder("ancient1StatueShield", { diameter: 6.4, height: 0.45, tessellation: 20 }, scene);
  shield.rotation.x = Math.PI / 2;
  shield.rotation.y = 0.35;
  shield.position.set(x - 2.9, foot + 6.9, z - 1.5);
  shield.material = marble;
  const boss = MeshBuilder.CreateCylinder("ancient1StatueShieldRim", { diameter: 5.2, height: 0.3, tessellation: 20 }, scene);
  boss.rotation.copyFrom(shield.rotation);
  boss.position.set(x - 3.0, foot + 6.9, z - 1.8);
  boss.material = marble;
}

// Lighthouse (572, greek_ancient_1.png): a slim white octagonal tower stands on the rocks at the back-left corner
// of the headland, left of the statue. Spec: 2 m rock plinth, octagonal shaft 14 m tapering 4.2 -> 3.2 m, a blue
// band two thirds up, a gallery ring, an 8-post lantern with a blue cap. Drawn only.
function lighthouse(scene: Scene): void {
  const white = new StandardMaterial("ancient1LighthouseWhite", scene);
  white.diffuseColor = new Color3(0.95, 0.93, 0.86);
  white.emissiveColor = white.diffuseColor.scale(0.24);
  const blue = new StandardMaterial("ancient1LighthouseBlue", scene);
  blue.diffuseColor = new Color3(0.2, 0.42, 0.78);
  blue.emissiveColor = blue.diffuseColor.scale(0.26);
  const glass = new StandardMaterial("ancient1LighthouseLamp", scene);
  glass.diffuseColor = new Color3(0.98, 0.86, 0.45);
  glass.emissiveColor = new Color3(0.7, 0.55, 0.2);
  const x = -42, z = 46, base = -0.6;
  const cyl = (name: string, y: number, h: number, top: number, bottom: number, mat: StandardMaterial, tess = 8) => {
    const m = MeshBuilder.CreateCylinder(name, { height: h, diameterTop: top, diameterBottom: bottom, tessellation: tess }, scene);
    m.position.set(x, y + h / 2, z);
    m.material = mat;
    m.receiveShadows = true;
    return m;
  };
  cyl("ancient1LighthousePlinth", base, 2, 5.6, 6.4, white);
  cyl("ancient1LighthouseShaft", base + 2, 14, 3.2, 4.2, white);
  cyl("ancient1LighthouseBand", base + 10.5, 1, 3.6, 3.7, blue);
  cyl("ancient1LighthouseGallery", base + 16, 0.5, 4.8, 4.8, white);
  cyl("ancient1LighthouseLamp", base + 16.5, 2.2, 2.2, 2.2, glass);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const post = MeshBuilder.CreateBox("ancient1LighthousePost", { width: 0.25, height: 2.2, depth: 0.25 }, scene);
    post.position.set(x + Math.cos(a) * 1.35, base + 17.6, z + Math.sin(a) * 1.35);
    post.material = white;
  }
  cyl("ancient1LighthouseCap", base + 18.7, 2.2, 0, 3.4, blue);
}

// Underside (572, greek_ancient_1.png): two stacked brown earth slabs, the upper one the island's full footprint
// (7 m deep), the lower one inset ~7 m on every side (6 m deep) with a dark step between, both faces studded
// with grey pebbles (flattened faceted stones 0.5-1.3 m, ~3.5 m apart, half sunk into the face).
function pebbledUnderside(scene: Scene, earth: StandardMaterial): void {
  const tiers: Array<{ w: number; d: number; top: number; h: number }> = [
    { w: LENGTH + 1.5, d: WIDTH + 1.5, top: -0.55, h: 7 },
    { w: LENGTH - 13, d: WIDTH - 12, top: -7.55, h: 6 },
  ];
  const stone = new StandardMaterial("ancient1Pebble", scene);
  stone.diffuseColor = new Color3(0.56, 0.55, 0.53);
  stone.emissiveColor = stone.diffuseColor.scale(0.22);
  const pebble = MeshBuilder.CreateIcoSphere("ancient1Pebbles", { radius: 1, subdivisions: 1 }, scene);
  pebble.convertToFlatShadedMesh();
  pebble.material = stone;
  pebble.isPickable = false;
  const matrices: number[] = [];
  let n = 0;
  tiers.forEach(({ w, d, top, h }, t) => {
    const slab = MeshBuilder.CreateBox(t === 0 ? "ancient1RectangularIsland" : "ancient1LowerSlab", { width: w, height: h, depth: d }, scene);
    slab.position.y = top - h / 2;
    slab.material = earth;
    slab.receiveShadows = true;
    // Faces: [half extent along the face, outward axis, offset]
    for (const [along, axisX, half] of [[w / 2, false, d / 2], [w / 2, false, -d / 2], [d / 2, true, w / 2], [d / 2, true, -w / 2]] as const) {
      for (let s = -along + 1.5; s < along - 1; s += 3.5) {
        n += 1;
        if (seeded(n, 41) < 0.25) continue;
        const r = 0.5 + seeded(n, 42) * 0.8;
        const y = top - 1 - seeded(n, 43) * (h - 2);
        const jitter = (seeded(n, 44) - 0.5) * 1.6;
        const pos = axisX ? new Vector3(half, y, s + jitter) : new Vector3(s + jitter, y, half);
        const scale = axisX ? new Vector3(0.45 * r, 0.7 * r, r) : new Vector3(r, 0.7 * r, 0.45 * r);
        const m = Matrix.Compose(scale, Quaternion.RotationYawPitchRoll(seeded(n, 45) * 3, 0, seeded(n, 46) - 0.5), pos);
        matrices.push(...m.asArray());
      }
    }
  });
  pebble.thinInstanceSetBuffer("matrix", new Float32Array(matrices), 16);
}

// Clear sky (573, greek_ancient_1.png: a clean mid-blue sky with big white clouds, no beige haze). Spec: clear
// colour (0.3, 0.6, 0.88), fog a pale sky blue (0.66, 0.8, 0.93) so the distance fades toward the horizon, the
// base clouds kept white; both restored on dispose.
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

// Outer rows (574, wiki ancient_1.png: the house rows run most of the rectangle's length, the plazas at the ends are
// small). The armies' zones (|x| 25..55, |z| <= 20; stage enemies at x 29..40.5, |z| <= 18) must stay open, so the
// rows run on along the long walls instead. Spec: past each end of the front and back bands (x 28.5..52 on both
// sides), two flat-roofed whitewashed houses per row, 11 m along the wall, 10 m deep (|z| 21.5..31.5), 3-4.4 m
// walls with a blue roof band, a parapet terrace, one upper room, blue shutters and a blue door on the plaza face and a
// stair flight up the plaza end; the inner cypress planters step to the wall lane (|z| 33.3) beside them. One box
// collider per house and per stair.
function outerRows(scene: Scene, plaster: StandardMaterial, blue: StandardMaterial, obstacles: MapBuildResult["obstacles"]): void {
  const box = (name: string, x: number, y: number, z: number, width: number, height: number, depth: number, material: StandardMaterial) => {
    const part = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
    part.position.set(x, y, z);
    part.material = material;
    part.receiveShadows = true;
  };
  let k = 0;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      for (const [x0, x1] of [[28.5, 39.5], [41, 52]]) {
        const x = sx * (x0 + x1) / 2, w = x1 - x0, z = sz * 26.5, d = 10;
        const h = 3 + seeded(k, 41) * 1.4;
        box("ancient1OuterHouse", x, h / 2, z, w, h, d, plaster);
        box("ancient1RoofBand", x, h - 0.24, z, w + 0.3, 0.24, d + 0.3, blue);
        box("ancient1RoofTerrace", x, h, z, w + 0.4, 0.36, d + 0.4, plaster);
        const ux = x + sx * (seeded(k, 42) - 0.5) * 3, uz = z + sz * 1.5;
        box("ancient1UpperRoom", ux, h + 1.1, uz, 4.6, 2.2, 4.4, plaster);
        box("ancient1UpperCoping", ux, h + 2.24, uz, 4.9, 0.27, 4.7, plaster);
        // The plaza face looks toward the field's centre line (z 0)
        const face = z - sz * (d / 2 + 0.03);
        for (const dx of [-3.2, 3.2]) box("ancient1BlueShutter", x + dx, 1.52, face, 0.78, 1.1, 0.12, blue);
        box("ancient1BlueDoor", x, 1.05, face, 1.3, 2.1, 0.14, blue);
        obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: w / 2, halfZ: d / 2 });
        if (x0 === 28.5) {
          // A stair flight climbs the inner end of the row, rising away from the bands
          for (let i = 0; i < 8; i++) {
            const rise = h * (i + 1) / 8;
            box("ancient1RoofStep", sx * (x0 - 2.4 + 0.3 * i), rise / 2, z + sz * 2, 0.4, rise, 2.1, plaster);
          }
          obstacles.push({ type: "box", center: new Vector3(sx * (x0 - 1.2), 0, z + sz * 2), halfX: 1.25, halfZ: 1.05 });
        }
        k++;
      }
    }
  }
}

// Flagstones (574, wiki ancient_1.png: the whole town floor is one mid-grey paving split by thin white lines into large
// irregular flagstones, streets included; no straight seam grid, no pale street strips). Spec: the straight seams and
// the lime street strips go; the pavement turns a neutral mid grey (0.46, 0.45, 0.43); a jittered 6.75 x 6.9 m lattice
// of points (+-2.3 m, a diagonal in three cells of ten) joined to its right and lower neighbours by 0.16 m white lines (one merged mesh, out of the glow)
// draws the flagstones over the whole slab inside the walls.
function flagstones(scene: Scene): void {
  for (const name of ["ancient1LongSeam", "ancient1CrossSeam", "ancient1StreetPaving"]) {
    for (const mesh of scene.meshes.filter((m) => m.name === name)) mesh.setEnabled(false);
  }
  const pavement = scene.getMaterialByName("ancient1Pavement");
  if (pavement instanceof StandardMaterial) {
    pavement.diffuseColor = new Color3(0.46, 0.45, 0.43);
    pavement.emissiveColor = pavement.diffuseColor.scale(0.16);
  }
  const white = new StandardMaterial("ancient1FlagstoneLine", scene);
  white.diffuseColor = new Color3(0.92, 0.91, 0.88);
  white.emissiveColor = white.diffuseColor.scale(0.3);
  white.specularColor = Color3.Black();
  const nx = 16, nz = 10, x0 = -54, z0 = -34.5;
  const pt = (i: number, j: number): [number, number] => {
    const edgeX = i === 0 || i === nx, edgeZ = j === 0 || j === nz;
    const jx = edgeX ? 0 : (seeded(i * 31 + j, 71) - 0.5) * 4.6, jz = edgeZ ? 0 : (seeded(i * 31 + j, 72) - 0.5) * 4.6;
    return [Math.min(54, x0 + i * (108 / nx) + jx), Math.min(34.5, z0 + j * (69 / nz) + jz)];
  };
  const lines: Mesh[] = [];
  const seg = (a: [number, number], b: [number, number]) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const line = MeshBuilder.CreateBox("ancient1FlagstoneLine", { width: len + 0.16, height: 0.03, depth: 0.16 }, scene);
    line.position.set((a[0] + b[0]) / 2, 0.015, (a[1] + b[1]) / 2);
    line.rotation.y = -Math.atan2(b[1] - a[1], b[0] - a[0]);
    lines.push(line);
  };
  for (let i = 0; i <= nx; i++) {
    for (let j = 0; j <= nz; j++) {
      if (i < nx && j > 0 && j < nz) seg(pt(i, j), pt(i + 1, j));
      if (j < nz && i > 0 && i < nx) seg(pt(i, j), pt(i, j + 1));
      // A diagonal in some cells breaks the lattice into irregular slabs
      if (i < nx && j < nz && seeded(i * 17 + j, 73) < 0.3) seg(pt(i, j), pt(i + 1, j + 1));
    }
  }
  const merged = Mesh.MergeMeshes(lines, true);
  if (!merged) return;
  merged.name = "ancient1Flagstones";
  merged.material = white;
  merged.isPickable = false;
  merged.receiveShadows = true;
  scene.getGlowLayerByName("glow")?.addExcludedMesh(merged);
}

export function buildAncient1(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  for (const mesh of scene.meshes) {
    if (!prior.has(mesh) && !mesh.name.startsWith("cloud")) mesh.setEnabled(false);
  }
  const stone = new StandardMaterial("ancient1Pavement", scene);
  stone.diffuseColor = new Color3(0.53, 0.56, 0.62);
  stone.emissiveColor = stone.diffuseColor.scale(0.15);
  const earth = new StandardMaterial("ancient1Island", scene);
  earth.diffuseColor = new Color3(0.49, 0.29, 0.23);
  earth.emissiveColor = earth.diffuseColor.scale(0.24);
  const lime = new StandardMaterial("ancient1Limestone", scene);
  lime.diffuseColor = new Color3(0.84, 0.81, 0.7);
  lime.emissiveColor = lime.diffuseColor.scale(0.13);
  pebbledUnderside(scene, earth);
  bayHeadland(scene, earth);
  hopliteStatue(scene);
  lighthouse(scene);
  const pavement = MeshBuilder.CreateBox("ancient1Pavement", { width: LENGTH, height: 0.55, depth: WIDTH }, scene);
  pavement.position.y = -0.275;
  pavement.material = stone;
  pavement.receiveShadows = true;
  for (const z of [-34.5, -12, -8, 8, 12, 34.5]) {
    const seam = MeshBuilder.CreateBox("ancient1LongSeam", { width: LENGTH - 0.5, height: 0.025, depth: 0.13 }, scene);
    seam.position.set(0, 0.01, z);
    seam.material = lime;
    seam.isPickable = false;
  }
  for (const x of [-42, -26, 0, 26, 42]) {
    const seam = MeshBuilder.CreateBox("ancient1CrossSeam", { width: 0.13, height: 0.025, depth: WIDTH - 0.5 }, scene);
    seam.position.set(x, 0.011, 0);
    seam.material = lime;
    seam.isPickable = false;
  }
  for (const z of STREETS) {
    const street = MeshBuilder.CreateBox("ancient1StreetPaving", { width: BLOCK_SPAN * 2 + 4, height: 0.05, depth: STREET_WIDTH }, scene);
    street.position.set(0, 0.02, z);
    street.material = lime;
    street.receiveShadows = true;
  }
  const plaster = new StandardMaterial("ancient1Whitewash", scene);
  plaster.diffuseColor = new Color3(0.95, 0.92, 0.81);
  plaster.emissiveColor = plaster.diffuseColor.scale(0.23);
  const blue = new StandardMaterial("ancient1BlueTile", scene);
  blue.diffuseColor = new Color3(0.26, 0.5, 0.78);
  blue.emissiveColor = blue.diffuseColor.scale(0.26);
  const box = (name: string, x: number, y: number, z: number, width: number, height: number, depth: number, material: StandardMaterial) => {
    const part = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
    part.position.set(x, y, z);
    part.material = material;
    part.receiveShadows = true;
  };
  const obstacles: MapBuildResult["obstacles"] = [];
  for (const side of [-1, 1]) {
    box("ancient1CityWall", 0, 0.67, side * 35, 111, 1.34, 0.82, plaster);
    box("ancient1CityWallCoping", 0, 1.38, side * 35, 111.3, 0.18, 1.02, blue);
    box("ancient1CityWall", side * 55, 0.67, 0, 0.82, 1.34, 70, plaster);
    box("ancient1CityWallCoping", side * 55, 1.38, 0, 1.02, 0.18, 70.3, blue);
    obstacles.push(
      { type: "box", center: new Vector3(0, 0, side * 35), halfX: 55.5, halfZ: 0.41 },
      { type: "box", center: new Vector3(side * 55, 0, 0), halfX: 0.41, halfZ: 35 },
    );
  }
  const foliage = new StandardMaterial("ancient1CypressLeaves", scene);
  foliage.diffuseColor = new Color3(0.39, 0.56, 0.18);
  foliage.emissiveColor = foliage.diffuseColor.scale(0.17);
  for (const [x, z] of [[-51, -33.3], [-32, -33.3], [30, -33.3], [50, -33.3], [-50, 33.3], [-25, 33.3], [25, 33.3], [50, 33.3]]) {
    const basin = MeshBuilder.CreateCylinder("ancient1CypressPlanter", { height: 0.5, diameter: 2.55, tessellation: 10 }, scene);
    basin.scaling.x = 1.78;
    basin.position.set(x, 0.25, z);
    basin.material = plaster;
    const soil = MeshBuilder.CreateCylinder("ancient1PlanterSoil", { height: 0.055, diameter: 2.29, tessellation: 10 }, scene);
    soil.scaling.x = 1.78;
    soil.position.set(x, 0.52, z);
    soil.material = earth;
    for (let i = -1; i <= 1; i++) {
      const crown = MeshBuilder.CreateCylinder("ancient1Cypress", { height: 3.2 + (1 - Math.abs(i)) * 1.2, diameterTop: 0.1, diameterBottom: 1.27, tessellation: 6 }, scene);
      crown.position.set(x + i * 1.1, i === 0 ? 2.69 : 2.08, z + i * 0.26);
      crown.rotation.z = -i * 0.12;
      crown.material = foliage;
    }
    obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: 2.19, halfZ: 1.26 });
  }
  outerRows(scene, plaster, blue, obstacles);
  // Separate houses (574, wiki ancient_1.png: each band is a run of distinct whitewashed houses, not one slab). Spec:
  // four houses per band, 9.8 m wide with 2.2 m alleys between them, each 1-3.5 m shallower than the band and set
  // toward one street, its own roof band and parapet terrace (no shared roof), a blue door and two shutters on each
  // street face; a 1.5 m stair flight in every alley climbs from the street side onto the lower neighbour's roof.
  const houseWidth = (BLOCK_SPAN * 2) / 4;
  const ALLEY = 2.2;
  BANDS.forEach(([bandZ, bandDepth], row) => {
    const heights: number[] = [];
    for (let col = 0; col < 4; col++) heights.push(2.8 + seeded(row * 4 + col, 31) * 1.6);
    for (let col = 0; col < 3; col++) {
      const x = -BLOCK_SPAN + houseWidth * (col + 1);
      const top = Math.min(heights[col], heights[col + 1]);
      // The x 0 alley meets the arch piers on the back street (z 7.6 and 12.4): its stairs start on the other side
      const toward = col === 1 ? (row === 2 ? 1 : -1) : (col + row) % 2 === 0 ? 1 : -1;
      const z0 = bandZ + toward * (bandDepth / 2 - 0.2);
      for (let i = 0; i < 7; i++) {
        const rise = top * (i + 1) / 7;
        box("ancient1AlleyStep", x, rise / 2, z0 - toward * (0.25 + 0.5 * i), 1.5, rise, 0.5, plaster);
      }
      obstacles.push({ type: "box", center: new Vector3(x, 0, z0 - toward * 1.85), halfX: 0.75, halfZ: 1.85 });
    }
    for (let col = 0; col < 4; col++) {
      const k = row * 4 + col;
      const height = heights[col];
      const x = -BLOCK_SPAN + houseWidth * (col + 0.5);
      const w = houseWidth - ALLEY;
      const depth = bandDepth - 1 - seeded(k, 34) * 2.5;
      const z = bandZ + (seeded(k, 35) < 0.5 ? -1 : 1) * (bandDepth - depth) / 2;
      box("ancient1House", x, height / 2, z, w, height, depth, plaster);
      box("ancient1RoofBand", x, height - 0.24, z, w + 0.2, 0.24, depth + 0.2, blue);
      box("ancient1RoofTerrace", x, height, z, w + 0.3, 0.36, depth + 0.3, plaster);
      const tx = x + (seeded(k, 32) - 0.5) * 3, tz = z + (seeded(k, 33) - 0.5) * (depth - 6);
      box("ancient1UpperRoom", tx, height + 1.1, tz, 5.1, 2.2, 5, plaster);
      box("ancient1UpperCoping", tx, height + 2.24, tz, 5.4, 0.27, 5.3, plaster);
      if (k % 3 !== 1) {
        const dome = MeshBuilder.CreateSphere("ancient1BlueDome", { diameter: 5.1, segments: 8, slice: 0.5 }, scene);
        dome.position.set(tx, height + 2.3, tz);
        dome.material = blue;
        dome.convertToFlatShadedMesh();
      }
      // Blue shutters on the street fronts.
      for (const face of [-1, 1]) {
        if ((row === 0 && face < 0) || (row === 2 && face > 0)) continue;
        for (const dx of [-3, 3]) box("ancient1BlueShutter", x + dx, 1.52, z + face * (depth / 2 + 0.03), 0.78, 1.1, 0.12, blue);
        box("ancient1BlueDoor", x, 1.05, z + face * (depth / 2 + 0.04), 1.3, 2.1, 0.14, blue);
      }
      // Roof stairs climb the plaza ends of each band.
      if (col === 0 || col === 3) {
        const side = col === 0 ? -1 : 1;
        const end = BLOCK_SPAN - ALLEY / 2;
        for (let i = 0; i < 8; i++) {
          const rise = height * (i + 1) / 8;
          box("ancient1RoofStep", side * (end + 2.3 - 0.32 * i), rise / 2, z - depth * 0.3, 0.42, rise, 2.1, plaster);
        }
        obstacles.push({ type: "box", center: new Vector3(side * (end + 1.2), 0, z - depth * 0.3), halfX: 1.25, halfZ: 1.05 });
      }
      obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: w / 2, halfZ: depth / 2 });
    }
  });
  for (const z of [STREETS[1] - STREET_WIDTH / 2 - 0.4, STREETS[1] + STREET_WIDTH / 2 + 0.4]) {
    const pier = MeshBuilder.CreateBox("ancient1ArchPier", { width: 1.6, height: 4.6, depth: 1.15 }, scene);
    pier.position.set(0, 2.3, z);
    pier.material = lime;
  }
  for (let i = 0; i <= 8; i++) {
    const angle = Math.PI * i / 8;
    const block = MeshBuilder.CreateBox("ancient1ArchStone", { width: 1.6, height: 0.8, depth: 1.3 }, scene);
    block.position.set(0, 4.2 + Math.sin(angle) * 2.6, STREETS[1] + Math.cos(angle) * 2.6);
    block.rotation.x = -angle;
    block.material = lime;
  }
  flagstones(scene);
  const restoreSky = clearSky(scene);
  return {
    ...result,
    dispose: () => { restoreSky(); result.dispose?.(); },
    zones: result.zones.map((zone) => ({ ...zone, center: new Vector3(Math.sign(zone.center.x) * 40, 0, 0), size: new Vector3(30, zone.size.y, 40) })),
    obstacles,
    hazards: [],
  };
}
