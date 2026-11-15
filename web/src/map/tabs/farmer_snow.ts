// TABS "Farmer Snow" (farmer map, Farmer 1 in winter): the river down the middle of the island is frozen over, so units walk across it
// anywhere (reference/maps/wiki/farmer_snow.png; the card: "units can now walk over it").
// Spec: Farmer 1's river course (down x = 0 with a gentle bend, about 4 m wide, back rim to front rim) laid as a sheet of pale blue ice
// level with the ground, in a frosted bank, with a few darker crack lines across it and a frozen icefall hanging off the front rim.
// No hazard. Built on campaign.introduction (base()).
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type DirectionalLight, type HemisphericLight, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

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

/**
 * The arched stone bridge over the ice at the centre (wiki shot, Farmer 1's bridge in winter): a deck 10 m across the river and 6 m wide, a
 * ring of voussoirs under each face, a humped parapet of rough blocks along each side, and snow lying on the deck and along the parapet tops.
 */
const BRIDGE = { span: 10, width: 6, rise: 1.1, parapet: 0.7 };

function snowyBridge(scene: Scene): Obstacle[] {
  const stone = new StandardMaterial("farmerSnowBridgeStone", scene);
  stone.diffuseColor = new Color3(0.56, 0.56, 0.6);
  stone.emissiveColor = new Color3(0.08, 0.08, 0.1);
  stone.specularColor = new Color3(0.04, 0.04, 0.04);
  const snow = new StandardMaterial("farmerSnowBridgeSnow", scene);
  snow.diffuseColor = SNOW.clone();
  snow.emissiveColor = SNOW_SHADE.clone();
  snow.specularColor = new Color3(0.08, 0.08, 0.1);
  const x = iceX(0);
  const blocks: Mesh[] = [], caps: Mesh[] = [];
  const deck = MeshBuilder.CreateBox("farmerSnowBridgeDeck", { width: BRIDGE.span, height: 0.3, depth: BRIDGE.width }, scene);
  deck.position.set(x, 0.0, 0);
  blocks.push(deck);
  const deckSnow = MeshBuilder.CreateBox("farmerSnowBridgeDeckSnow", { width: BRIDGE.span - 0.6, height: 0.14, depth: BRIDGE.width - 1.4 }, scene);
  deckSnow.position.set(x, 0.2, 0);
  caps.push(deckSnow);
  for (const side of [-1, 1]) {
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (i + 0.5) / n;
      const block = MeshBuilder.CreateBox("farmerSnowBridgeArch", { width: 1.15, height: 0.5, depth: 0.5 }, scene);
      block.position.set(x - Math.cos(a) * (BRIDGE.span / 2 - 1.6), Math.sin(a) * BRIDGE.rise - 0.55, side * (BRIDGE.width / 2 - 0.25));
      block.rotation.z = -Math.cos(a) * 0.9;
      blocks.push(block);
    }
    for (let i = 0; i < 8; i++) {
      const along = -BRIDGE.span / 2 + 0.6 + i * ((BRIDGE.span - 1.2) / 7);
      const h = BRIDGE.parapet + 0.35 * Math.cos((along / BRIDGE.span) * Math.PI);
      const block = MeshBuilder.CreateBox("farmerSnowBridgeParapet", { width: 1.2, height: h, depth: 0.55 }, scene);
      block.position.set(x + along, h / 2, side * (BRIDGE.width / 2 - 0.1));
      block.rotation.y = (i % 2 - 0.5) * 0.08;
      blocks.push(block);
      const cap = MeshBuilder.CreateIcoSphere("farmerSnowBridgeCap", { radius: 0.5, subdivisions: 1 }, scene);
      cap.scaling.set(1.35, 0.35, 0.75);
      cap.position.set(x + along, h + 0.04, side * (BRIDGE.width / 2 - 0.1));
      caps.push(cap);
    }
  }
  for (const [list, m, name] of [[blocks, stone, "farmerSnowBridge"], [caps, snow, "farmerSnowBridgeSnow"]] as const) {
    const merged = Mesh.MergeMeshes(list, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = m;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  return [-1, 1].map((side) => ({
    type: "box" as const, center: new Vector3(x, 0, side * (BRIDGE.width / 2 - 0.1)), halfX: BRIDGE.span / 2, halfZ: 0.3,
  }));
}

/**
 * Night (farm_snow.png): a deep navy sky full of stars and big soft snowflakes, no clouds and no far mountains or second slab, the
 * island lit by a dim cold blue moonlight so the snow reads blue-white. Spec: sky and fog navy (0.03, 0.06, 0.2); 260 star points on a
 * shell 160-190 m out above the horizon; 220 flakes 0.2-0.5 m drifting in the air over and around the island, out to 90 m and up to 40 m.
 * The lights are put back when the map goes (dispose).
 */
const NIGHT = new Color3(0.03, 0.06, 0.2);

function nightSky(scene: Scene, built: Set<unknown>): () => void {
  scene.clearColor.set(NIGHT.r, NIGHT.g, NIGHT.b, 1);
  scene.fogColor = NIGHT.clone();
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && (mesh.name.startsWith("mountain") || mesh.name === "cloud")) mesh.setEnabled(false);
  }
  const hemi = scene.getLightByName("hemi") as HemisphericLight | null;
  const dir = scene.getLightByName("dir") as DirectionalLight | null;
  const saved = {
    hemi: hemi ? [hemi.intensity, hemi.diffuse.clone(), hemi.groundColor.clone()] as const : null,
    dir: dir ? [dir.intensity, dir.diffuse.clone()] as const : null,
  };
  if (hemi) {
    hemi.intensity = 0.35;
    hemi.diffuse = new Color3(0.45, 0.6, 1.3);
    hemi.groundColor = new Color3(0.12, 0.16, 0.36);
  }
  if (dir) {
    dir.intensity = 0.55;
    dir.diffuse = new Color3(0.6, 0.72, 1.0);
  }
  const glow = scene.getGlowLayerByName("glow");
  const dots = (name: string, count: number, place: (i: number) => [number, number, number, number], c: Color3) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.Black();
    m.emissiveColor = c;
    m.specularColor = Color3.Black();
    m.disableLighting = true;
    const parts: Mesh[] = [];
    for (let i = 0; i < count; i++) {
      const [x, y, z, r] = place(i);
      const d = MeshBuilder.CreateIcoSphere(name, { radius: r, subdivisions: 1 }, scene);
      d.position.set(x, y, z);
      parts.push(d);
    }
    const merged = Mesh.MergeMeshes(parts, true);
    if (!merged) return;
    merged.name = name;
    merged.material = m;
    merged.applyFog = false;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  };
  dots("farmerSnowStars", 260, (i) => {
    const a = seeded(i, 61) * Math.PI * 2, up = 0.05 + seeded(i, 62) * 1.4, r = 160 + seeded(i, 63) * 30;
    return [Math.cos(a) * Math.cos(up) * r, Math.sin(up) * r - 10, Math.sin(a) * Math.cos(up) * r, 0.35 + seeded(i, 64) * 0.5];
  }, new Color3(0.95, 0.95, 0.85));
  dots("farmerSnowFlakes", 220, (i) => {
    const a = seeded(i, 71) * Math.PI * 2, r = 8 + seeded(i, 72) * 82;
    return [Math.cos(a) * r, -12 + seeded(i, 73) * 52, Math.sin(a) * r, 0.2 + seeded(i, 74) * 0.3];
  }, new Color3(0.9, 0.92, 1.0));
  return () => {
    if (hemi && saved.hemi) [hemi.intensity, hemi.diffuse, hemi.groundColor] = [saved.hemi[0], saved.hemi[1], saved.hemi[2]];
    if (dir && saved.dir) [dir.intensity, dir.diffuse] = [saved.dir[0], saved.dir[1]];
  };
}

/**
 * The evergreen grove (card Overview; wiki shot upper right): where Farmer 1 has its wheat, a cluster of dark snowy pines stands in the
 * back-right corner. Spec: 15 pines on a jittered 6 m grid over x 9..35, z 18..40 (kept 3 m in from the rim), each 5.5-9 m tall: a short
 * brown trunk under three stacked dark green cones, each cone wearing a white snow cap on its upper half. Kept out of the glow and fog so
 * they read dark against the snow. A trunk collider (0.7 m) per pine.
 */
function pineGrove(scene: Scene): Obstacle[] {
  const glow = scene.getGlowLayerByName("glow");
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const needles = mk("farmerSnowPine", new Color3(0.07, 0.2, 0.14), 0.35);
  const capSnow = mk("farmerSnowPineSnow", new Color3(0.82, 0.87, 0.97), 0.3);
  const bark = mk("farmerSnowPineBark", new Color3(0.26, 0.16, 0.09), 0.3);
  const greens: Mesh[] = [], whites: Mesh[] = [], trunks: Mesh[] = [];
  const obstacles: Obstacle[] = [];
  let k = 0;
  for (let x = 9; x <= 35; x += 6) {
    for (let z = 18; z <= 40; z += 6) {
      k++;
      const px = x + (seeded(k, 101) - 0.5) * 3.5, pz = z + (seeded(k, 102) - 0.5) * 3.5;
      if (Math.abs(px / 51) ** 3 + Math.abs(pz / 45) ** 3 > 1 || seeded(k, 103) < 0.12) continue;
      const h = 5.5 + seeded(k, 104) * 3.5, w = h * 0.42;
      const trunk = MeshBuilder.CreateCylinder("farmerSnowPineTrunk", { diameterTop: 0.3, diameterBottom: 0.45, height: h * 0.25, tessellation: 5 }, scene);
      trunk.position.set(px, h * 0.125, pz);
      trunks.push(trunk);
      for (let t = 0; t < 3; t++) {
        const tw = w * (1 - t * 0.27), th = h * (0.42 - t * 0.06), ty = h * (0.18 + t * 0.24);
        const cone = MeshBuilder.CreateCylinder("farmerSnowPineCone", { diameterTop: 0, diameterBottom: tw, height: th, tessellation: 7 }, scene);
        cone.position.set(px, ty + th / 2, pz);
        cone.rotation.y = seeded(k * 3 + t, 105) * Math.PI;
        greens.push(cone);
        const cap = MeshBuilder.CreateCylinder("farmerSnowPineCap", { diameterTop: 0, diameterBottom: tw * 0.6, height: th * 0.55, tessellation: 7 }, scene);
        cap.position.set(px, ty + th * 0.45 + th * 0.55 / 2 + 0.05, pz);
        cap.rotation.y = cone.rotation.y;
        whites.push(cap);
      }
      obstacles.push({ type: "cylinder", center: new Vector3(px, 0, pz), radius: 0.7 });
    }
  }
  for (const [list, m, name] of [[greens, needles, "farmerSnowPines"], [whites, capSnow, "farmerSnowPineCaps"], [trunks, bark, "farmerSnowPineTrunks"]] as const) {
    const merged = Mesh.MergeMeshes(list, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = m;
    merged.applyFog = false;
    merged.receiveShadows = true;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  }
  return obstacles;
}

export function buildFarmerSnow(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  snowCover(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  const restoreLights = nightSky(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
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
  const baseDispose = result.dispose;
  return {
    ...result,
    obstacles: [...result.obstacles, ...snowyBridge(scene), ...pineGrove(scene)],
    dispose: () => {
      restoreLights();
      baseDispose?.();
    },
  };
}
