// TABS "Farmer Snow" (farmer map, Farmer 1 in winter): the river down the middle of the island is frozen over, so units walk across it
// anywhere (reference/maps/wiki/farmer_snow.png; the card: "units can now walk over it").
// Spec: Farmer 1's river course (down x = 0 with a gentle bend, about 4 m wide, back rim to front rim) laid as a sheet of pale blue ice
// level with the ground, in a frosted bank, with a few darker crack lines across it and a frozen icefall hanging off the front rim.
// No hazard. Built on campaign.introduction (base()).
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const ICE = { halfWidth: 2, bend: 1.4, bendRate: 0.075, back: 48, front: -48, fall: 12 };
const iceX = (z: number) => ICE.bend * Math.sin(z * ICE.bendRate);

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

/**
 * Snow cover (wiki shot): the whole top of the island is white-blue snow, no green showing. The ground and grass materials of this build
 * turn to snow, the grass blades and tufts go, and soft low drifts (0.3-0.6 m high, 2-6 m long, flattened) lie along the tree ring, at the
 * rim and in a few banks on the field, none of them in the way (drawn only).
 */
const SNOW = new Color3(0.8, 0.85, 0.96);
const SNOW_SHADE = new Color3(0.3, 0.34, 0.45);

function snowCover(scene: Scene, built: Set<unknown>): void {
  for (const name of ["groundMat", "grass", "dryGrass", "grassBladeDark", "grassBladeLight"]) {
    const m = scene.getMaterialByName(name) as StandardMaterial | null;
    if (!m) continue;
    m.diffuseColor = SNOW.clone();
    m.emissiveColor = SNOW_SHADE.clone();
    m.specularColor = new Color3(0.05, 0.05, 0.06);
  }
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (mesh.name.startsWith("fieldBlades_") || mesh.name === "grassTuft" || mesh.name === "centerGrass" || mesh.name === "flowerDot") mesh.setEnabled(false);
  }
  const drift = new StandardMaterial("farmerSnowDrift", scene);
  drift.diffuseColor = SNOW.clone();
  drift.emissiveColor = SNOW_SHADE.clone();
  drift.specularColor = new Color3(0.08, 0.08, 0.1);
  const parts: Mesh[] = [];
  for (let i = 0; i < 70; i++) {
    const ring = i < 56;
    const a = seeded(i, 11) * Math.PI * 2;
    const band = ring ? 0.78 + seeded(i, 12) * 0.2 : 0.2 + seeded(i, 12) * 0.45;
    const x = Math.cos(a) * 50 * band, z = Math.sin(a) * 42 * band;
    if (Math.abs(x - iceX(z)) < ICE.halfWidth + 2.5) continue;
    const len = 2 + seeded(i, 13) * 4;
    const d = MeshBuilder.CreateIcoSphere("farmerSnowDrift", { radius: 1, subdivisions: 2 }, scene);
    d.scaling.set(len, 0.3 + seeded(i, 14) * 0.3, len * (0.4 + seeded(i, 15) * 0.3));
    d.rotation.y = -a + Math.PI / 2 + (seeded(i, 16) - 0.5) * 0.6;
    d.position.set(x, 0, z);
    parts.push(d);
  }
  const drifts = Mesh.MergeMeshes(parts, true);
  if (drifts) {
    drifts.name = "farmerSnowDrifts";
    drifts.material = drift;
    drifts.receiveShadows = true;
    drifts.isPickable = false;
  }
}

export function buildFarmerSnow(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  snowCover(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  const mat = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = new Color3(0.3, 0.32, 0.36);
    return m;
  };
  const ice = mat("farmerSnowIce", new Color3(0.72, 0.86, 0.96), 0.25);
  const bank = mat("farmerSnowBank", new Color3(0.9, 0.93, 0.97), 0.2);
  const crack = mat("farmerSnowCrack", new Color3(0.36, 0.5, 0.66), 0.1);

  const strip = (name: string, half: number, y: number, m: StandardMaterial) => {
    const left: Vector3[] = [], right: Vector3[] = [];
    for (let z = ICE.back + 1; z >= ICE.front - 0.5; z -= 1) {
      left.push(new Vector3(iceX(z) - half, y, z));
      right.push(new Vector3(iceX(z) + half, y, z));
    }
    const mesh = MeshBuilder.CreateRibbon(name, { pathArray: [left, right], sideOrientation: Mesh.DOUBLESIDE }, scene);
    mesh.material = m;
    mesh.receiveShadows = true;
    mesh.isPickable = false;
  };
  strip("farmerSnowBank", ICE.halfWidth + 0.8, 0.05, bank);
  strip("farmerSnowIce", ICE.halfWidth, 0.08, ice);

  // Cracks: thin dark slivers lying across the ice
  const cracks: Mesh[] = [];
  for (let i = 0; i < 14; i++) {
    const z = ICE.front + 4 + i * 6.5 + seeded(i, 1) * 3;
    const c = MeshBuilder.CreateBox("farmerSnowCrack", { width: ICE.halfWidth * (0.8 + seeded(i, 2) * 0.9), height: 0.02, depth: 0.12 }, scene);
    c.position.set(iceX(z) + (seeded(i, 3) - 0.5) * 1.2, 0.1, z);
    c.rotation.y = (seeded(i, 4) - 0.5) * 1.4;
    cracks.push(c);
  }
  const crackMesh = Mesh.MergeMeshes(cracks, true);
  if (crackMesh) {
    crackMesh.name = "farmerSnowCracks";
    crackMesh.material = crack;
    crackMesh.isPickable = false;
  }

  // The frozen icefall off the front rim: a hanging sheet with icicles along its foot
  const x = iceX(ICE.front);
  const parts: Mesh[] = [];
  const sheet = MeshBuilder.CreateCylinder("farmerSnowIcefall", { diameterTop: ICE.halfWidth * 2.4, diameterBottom: ICE.halfWidth * 1.6, height: ICE.fall, tessellation: 7 }, scene);
  sheet.scaling.z = 0.4;
  sheet.position.set(x, -ICE.fall / 2 + 0.05, ICE.front - 0.6);
  parts.push(sheet);
  for (let i = 0; i < 6; i++) {
    const len = 2 + seeded(i, 5) * 3;
    const icicle = MeshBuilder.CreateCylinder("farmerSnowIcicle", { diameterTop: 0.6, diameterBottom: 0.02, height: len, tessellation: 5 }, scene);
    icicle.position.set(x - ICE.halfWidth + i * (ICE.halfWidth * 0.8), -ICE.fall - len / 2 + 0.3, ICE.front - 0.6);
    parts.push(icicle);
  }
  const fall = Mesh.MergeMeshes(parts, true);
  if (fall) {
    fall.name = "farmerSnowIcefall";
    fall.convertToFlatShadedMesh();
    fall.material = ice;
    fall.isPickable = false;
  }
  return result;
}
