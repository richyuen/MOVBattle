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
      const w = 0.8 + jx * 0.6, h = 0.35 + jz * 0.25;
      const at = new Vector3(px, h * 0.35, pz);
      grass[swathe + jz * 0.4 > 0.4 ? 1 : 0].m.push(...Matrix.Compose(new Vector3(w, h, w * (0.8 + jz * 0.3)), Quaternion.RotationAxis(Vector3.Up(), jx * 6.28), at).m);
    }
  }
  for (const { mesh, m } of grass) mesh.thinInstanceSetBuffer("matrix", new Float32Array(m), 16);
}

export function buildLegacy(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  pineForest(scene, built);
  meadow(scene, built);
  return result;
}
