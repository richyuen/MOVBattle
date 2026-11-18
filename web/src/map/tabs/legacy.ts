// TABS "Legacy" (legacy map): a round yellow-green glade in a valley, closed in by dense dark pine forest under snowy mountains, a spired
// stone church at the back with its graveyard, tent camps at both ends (reference/maps/wiki/legacy.png, reference/maps/legacy.png; card
// loop/cards/maps/legacy.md). Built on campaign.legacy (base(); never edit the base, dress its build here).
//
// Pine forest (576, wiki legacy.png and legacy.the_war.png: the glade is walled in by a dense band of tall dark-green conifers, no round
// leafy trees). Spec: every base ring tree (an unparented "trunk" with its crown as children) goes, its collider kept; in its place a pine
// 9-14 m tall, a short brown trunk under four stacked seven-sided cones, dark green (0.1, 0.27, 0.12) with a lighter tier
// (0.15, 0.35, 0.15) every other cone; beside each, two more pines 1.8-3.8 m along the ring and up to 2.5 m in or 1 m out (drawn
// only) so the band reads dense; all merged
// per material, in the glow pass (dark solids), receiving shadows.
import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function pineForest(scene: Scene, built: Set<unknown>): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    dark: mk("legacyPineDark", new Color3(0.1, 0.27, 0.12), 0.3),
    light: mk("legacyPineLight", new Color3(0.15, 0.35, 0.15), 0.3),
    bark: mk("legacyPineBark", new Color3(0.36, 0.24, 0.15), 0.3),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { dark: [], light: [], bark: [] };
  const spots: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || mesh.name !== "trunk" || mesh.parent || !mesh.isEnabled()) continue;
    spots.push([mesh.position.x, mesh.position.z]);
    mesh.setEnabled(false);
  }
  let k = 0;
  const pine = (x: number, z: number) => {
    k++;
    const tall = 9 + seeded(k, 21) * 5, wide = tall * (0.36 + seeded(k, 22) * 0.06);
    const trunk = MeshBuilder.CreateCylinder("legacyPineTrunk", { height: tall * 0.2, diameter: wide * 0.14, tessellation: 6 }, scene);
    trunk.position.set(x, tall * 0.1, z);
    parts.bark.push(trunk);
    for (let t = 0; t < 4; t++) {
      const f = 1 - t * 0.2;
      const h = tall * 0.34 * (0.85 + t * 0.05);
      const cone = MeshBuilder.CreateCylinder("legacyPineCone", { height: h, diameterBottom: wide * f, diameterTop: wide * f * 0.08, tessellation: 7 }, scene);
      cone.rotation.y = seeded(k * 4 + t, 23) * 6.28;
      cone.position.set(x, tall * 0.15 + t * tall * 0.19 + h / 2, z);
      parts[t % 2 ? "light" : "dark"].push(cone);
    }
  };
  for (const [x, z] of spots) {
    pine(x, z);
    const out = Math.hypot(x, z) || 1;
    for (let j = 0; j < 2; j++) {
      // along the ring and a little in or out (never far out: the ring stands near the rim)
      const d = -2.5 + seeded(k, 31 + j) * 3.5, side = (j ? 1 : -1) * (1.8 + seeded(k, 33 + j) * 2);
      pine(x + (x / out) * d - (z / out) * side, z + (z / out) * d + (x / out) * side);
    }
  }
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `legacyPines_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

// Meadow (577, legacy.the_war.png and the wiki shot: the glade is a bright yellow-green meadow of tall soft grass,
// shin-high, in lighter and darker swathes; no lilac floor and no red or blue tint across the halves). Spec: the base
// floor ("ground", "centerGrass") recoloured (0.56, 0.64, 0.2), barely self-lit; the base's blades and tufts hidden; the
// translucent team-zone slabs (campaign_zone_overlay_* / border_*) hidden; tall faceted grass clumps 0.8-1.4 m across and
// 0.35-0.6 m high on a 1.1 m jittered grid inside the rim (superellipse 52 x 46, power 3), two yellow-greens (0.62, 0.72,
// 0.2) and (0.48, 0.6, 0.15) chosen in broad swathes by a slow sine field; thin instances, receiving shadows.
function meadow(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (/^(fieldBlades_|fieldTufts_|grassTuft|campaign_zone_overlay_|campaign_zone_border_)/.test(mesh.name)) mesh.setEnabled(false);
    if ((mesh.name === "ground" || mesh.name === "centerGrass") && mesh.material instanceof StandardMaterial) {
      mesh.material.diffuseColor.set(0.56, 0.64, 0.2);
      mesh.material.emissiveColor.set(0.08, 0.09, 0.03);
    }
  }
  const clump = (name: string, colour: Color3) => {
    const mesh = MeshBuilder.CreateIcoSphere(name, { radius: 0.5, subdivisions: 1, flat: true }, scene);
    const mat = new StandardMaterial(name, scene);
    mat.diffuseColor = colour;
    mat.emissiveColor = colour.scale(0.24);
    mat.specularColor = Color3.Black();
    mesh.material = mat;
    mesh.isPickable = false;
    mesh.receiveShadows = true;
    return { mesh, m: [] as number[] };
  };
  const grass = [clump("legacyMeadowLight", new Color3(0.62, 0.72, 0.2)), clump("legacyMeadowDark", new Color3(0.48, 0.6, 0.15))];
  let i = 0;
  for (let z = -46; z < 46; z += 1.1) {
    for (let x = -52; x < 52; x += 1.1) {
      i += 1;
      const jx = seeded(i, 41), jz = seeded(i, 43);
      const px = x + (jx - 0.5) * 0.9, pz = z + (jz - 0.5) * 0.9;
      if (Math.abs(px / 52) ** 3 + Math.abs(pz / 46) ** 3 > 1) continue;
      const swathe = Math.sin(px * 0.08 + 0.7) * Math.cos(pz * 0.11 + 1.9) + Math.sin((px - pz) * 0.05) * 0.6;
      const w = 0.35 + jx * 0.25, h = 0.7 + jz * 0.4;
      const at = new Vector3(px, h * 0.35, pz);
      grass[swathe + jz * 0.4 > 0.4 ? 1 : 0].m.push(...Matrix.Compose(new Vector3(w, h, w * (0.8 + jz * 0.3)), Quaternion.RotationAxis(Vector3.Up(), jx * 6.28), at).m);
    }
  }
  for (const { mesh, m } of grass) mesh.thinInstanceSetBuffer("matrix", new Float32Array(m), 16);
}

// Church (578, legacy.png: at the back of the glade stands the dark grey stone church of St. Wobbly Horse: a long nave under a
// steep dark slate gable roof, a side transept, and at its left end a tall square tower with belfry openings under a very steep
// pointed spire, the highest thing in the glade). Spec: the base church (a dark box at (-20, 20) with its side cylinder) goes with
// its colliders; the new one at the back centre: nave x -4..10, z 28.5..35.5, walls 6 m, a gable roof 4.5 m high overhanging 0.5
// m; a transept 5 x 10 m across the nave at x 5 with its own gable; the tower 4.4 m square at x -6.5, 14 m to its parapet, belfry
// slits, a four-sided spire 9 m; pointed dark windows along the nave. Stone (0.24, 0.24, 0.28) and slate (0.13, 0.14, 0.19),
// self-lit 0.35, in the glow pass (dark solids). One box collider for nave and tower, one for the transept.
function church(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const old = (x: number, z: number) => Math.abs(z - 20) < 0.5 && x > -23.5 && x < -19.5;
  const gone: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && !mesh.parent && /^Legacy Parade Grounds_(box|cyl)$/.test(mesh.name) && old(mesh.position.x, mesh.position.z)) {
      gone.push(mesh.position.clone());
      mesh.setEnabled(false);
    }
  }
  result.obstacles = result.obstacles.filter(({ center }) => !gone.some((p) => Math.hypot(center.x - p.x, center.z - p.z) < 0.6));
  const mk = (name: string, c: Color3) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(0.35);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = { stone: mk("legacyChurchStone", new Color3(0.24, 0.24, 0.28)), slate: mk("legacyChurchSlate", new Color3(0.13, 0.14, 0.19)), dark: mk("legacyChurchDark", new Color3(0.05, 0.05, 0.07)) };
  const parts: Record<keyof typeof mats, Mesh[]> = { stone: [], slate: [], dark: [] };
  const box = (k: keyof typeof mats, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("legacyChurchPart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    parts[k].push(b);
  };
  // A gable roof with its ridge along x (or along z): two slate slabs leaning together over the span
  const gable = (len: number, span: number, h: number, x: number, y: number, z: number, alongZ: boolean) => {
    const slope = Math.hypot(span / 2, h), tilt = Math.atan2(h, span / 2);
    for (const s of [-1, 1]) {
      const slab = MeshBuilder.CreateBox("legacyChurchRoof", { width: alongZ ? slope : len, height: 0.35, depth: alongZ ? len : slope }, scene);
      if (alongZ) slab.rotation.z = -s * tilt;
      else slab.rotation.x = s * tilt;
      slab.position.set(x + (alongZ ? s * span / 4 : 0), y + h / 2, z + (alongZ ? 0 : s * span / 4));
      parts.slate.push(slab);
    }
  };
  const Z = 32;
  box("stone", 14, 6, 7, 3, 3, Z);
  gable(15, 8, 4.5, 3, 6, Z, false);
  box("stone", 5, 6, 10, 5, 3, Z);
  gable(11, 6, 4.5, 5, 6, Z, true);
  for (let i = 0; i < 4; i++) box("dark", 0.9, 2.6, 0.2, -2 + i * 3.4, 3.4, Z - 3.55);
  box("dark", 1.8, 3.2, 0.2, 5, 1.6, Z - 5.05);
  box("stone", 4.4, 14, 4.4, -6.5, 7, Z);
  box("stone", 5, 0.6, 5, -6.5, 14.2, Z);
  for (const [dx, dz] of [[0, -2.25], [0, 2.25], [-2.25, 0], [2.25, 0]]) box("dark", dx ? 0.2 : 1, 2.4, dz ? 0.2 : 1, -6.5 + dx, 11.6, Z + dz);
  box("dark", 1.6, 2.8, 0.2, -6.5, 1.4, Z - 2.25);
  const spire = MeshBuilder.CreateCylinder("legacyChurchSpire", { height: 9, diameterBottom: 4.6 * Math.SQRT2, diameterTop: 0.05, tessellation: 4 }, scene);
  spire.rotation.y = Math.PI / 4;
  spire.position.set(-6.5, 14.5 + 4.5, Z);
  parts.slate.push(spire);
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `legacyChurch_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  result.obstacles.push({ type: "box", center: new Vector3(1.5, 0, Z), halfX: 9.5, halfZ: 3.6 });
  result.obstacles.push({ type: "box", center: new Vector3(5, 0, Z), halfX: 2.6, halfZ: 5.1 });
}

// Open glade (578,the wiki shot and legacy.the_war.png: the meadow between the two armies is open grass with only small
// scattered boulders; nothing stands across the middle). Spec: the base's dark barricade box at (22, 0) and its collider go.
function openGlade(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const atBar = (x: number, z: number) => Math.hypot(x - 22, z) < 0.5;
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && mesh.name === "Legacy Parade Grounds_box" && atBar(mesh.position.x, mesh.position.z)) mesh.setEnabled(false);
  }
  result.obstacles = result.obstacles.filter(({ center }) => !atBar(center.x, center.z));
}

export function buildLegacy(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  openGlade(scene, built, result);

  pineForest(scene, built);
  meadow(scene, built);
  church(scene, built, result);
  return result;
}
