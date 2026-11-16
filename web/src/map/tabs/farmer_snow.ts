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
      // Inside the round outline (ellipse 54 x 48), 3 m in
      if ((px / 51) ** 2 + (pz / 45) ** 2 > 1 || seeded(k, 103) < 0.12) continue;
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

/**
 * Island underside (farm_snow.png; farmer_1's earth bowl kit, this map's own copy): under the snow lip the island is one deep rounded bowl
 * of dark navy earth with blue-grey stones set in its face, each stone capped with snow, and nothing hangs outside it: the base's
 * islandUnder/islandShelf/islandCliff (black spikes) go, and the translucent placement-guide slabs (campaign_zone_overlay_ and campaign_zone_border_ meshes)
 * that reach past the rim are hidden (the zones stay in data). Spec: the bowl follows the island outline (superellipse 54 x 48, power 3),
 * a 2 m snow-white lip band, then bulges down to a rounded point 34 m below the field (about 0.3 of the island width, as the reference
 * shows; scale 1, .98, .94, .86, .72, .52, .28, .04); about 80 flattened stones 1.4-3.2 m across sunk half into its face between 3 and
 * 26 m down, each with a flat snow cap on its top.
 */
const BOWL: Array<[number, number]> = [[1, -0.02], [1, -2], [0.98, -6], [0.94, -12], [0.86, -18], [0.72, -24], [0.52, -29], [0.28, -32.5], [0.04, -34]];

function islandOutline(a: number): [number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  const r = (Math.abs(c / 54) ** 2 + Math.abs(s / 48) ** 2) ** (-1 / 2);
  return [c * r, s * r];
}

/**
 * Round island (wiki farmer_snow.png): the island is a near-circle with the snow field running to its rim, not a rounded-rectangle slab
 * ringed by dense trees. Spec (farmer_1's remap kit, this map's own copy): the outline is the ellipse 54 x 48 (islandOutline, which the
 * bowl follows); the base's lawn slab "ground" is remapped vertex by vertex from the base's superellipse (54 x 48, power 3) to it at the
 * same fraction of the radius; base props standing past it (less 1 m) are hidden with their colliders; the ring trees are thinned to one
 * in three (the rest hidden with their colliders) and the haze band behind them goes, so the snow shows open to the rim.
 */
const SNOW_RIM_PROPS = new Set(["trunk", "boulder", "wallStone", "hayBale", "stump", "hill", "pebble"]);

function roundSnowIsland(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const oldR = (a: number) => (Math.abs(Math.cos(a) / 54) ** 3 + Math.abs(Math.sin(a) / 48) ** 3) ** (-1 / 3);
  const newR = (a: number) => Math.hypot(...islandOutline(a));
  const inside = (x: number, z: number, m: number) => Math.hypot(x, z) <= newR(Math.atan2(z, x)) - m;
  const gone: Array<[number, number]> = [];
  let tree = 0;
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || !(mesh instanceof Mesh)) continue;
    if (mesh.name === "ground") {
      const pos = mesh.getVerticesData("position");
      if (!pos) continue;
      for (let v = 0; v < pos.length; v += 3) {
        if (Math.hypot(pos[v], pos[v + 2]) < 1e-6) continue;
        const k = newR(Math.atan2(pos[v + 2], pos[v])) / oldR(Math.atan2(pos[v + 2], pos[v]));
        pos[v] *= k;
        pos[v + 2] *= k;
      }
      mesh.setVerticesData("position", pos);
      mesh.refreshBoundingInfo();
    } else if (mesh.name === "hazeTreeline") {
      mesh.setEnabled(false);
    } else if (SNOW_RIM_PROPS.has(mesh.name) && !mesh.parent && mesh.isEnabled()) {
      const p = mesh.getAbsolutePosition();
      const thin = mesh.name === "trunk" && tree++ % 3 !== 0;
      if (!thin && inside(p.x, p.z, 1)) continue;
      gone.push([p.x, p.z]);
      mesh.setEnabled(false);
    }
  }
  return obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
}

function navyBowl(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (["islandUnder", "islandShelf", "islandCliff"].includes(mesh.name) || /^campaign_zone_(overlay|border)_/.test(mesh.name)) mesh.setEnabled(false);
  }
  const mk = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = Color3.Black();
    return m;
  };
  const lip = mk("farmerSnowUnderLip", SNOW.scale(0.9), 0.3);
  // The moonlight and the night haze lift a lit navy toward lavender: the earth is a deep blue lit mostly by itself, out of the fog
  const earth = mk("farmerSnowUnderEarth", new Color3(0.035, 0.05, 0.16), 0.9);
  const stoneMat = mk("farmerSnowUnderStone", new Color3(0.2, 0.24, 0.4), 0.45);
  const capMat = mk("farmerSnowUnderCap", SNOW, 0.4);
  const bands: Mesh[] = [];
  for (let i = 0; i < BOWL.length - 1; i++) {
    const [s0, y0] = BOWL[i], [s1, y1] = BOWL[i + 1];
    const band = MeshBuilder.CreateCylinder("farmerSnowBowl", { diameterTop: s0, diameterBottom: s1, height: y0 - y1, tessellation: 64 }, scene);
    const pos = band.getVerticesData("position")!;
    for (let v = 0; v < pos.length; v += 3) {
      const reach = Math.hypot(pos[v], pos[v + 2]) * 2;
      const [x, z] = islandOutline(Math.atan2(pos[v + 2], pos[v]));
      pos[v] = x * reach;
      pos[v + 2] = z * reach;
    }
    band.setVerticesData("position", pos);
    band.position.y = (y0 + y1) / 2;
    if (i === 0) {
      band.convertToFlatShadedMesh();
      band.material = lip;
      band.name = "farmerSnowBowlLip";
      band.isPickable = false;
    } else bands.push(band);
  }
  const bowl = Mesh.MergeMeshes(bands, true);
  if (bowl) {
    bowl.name = "farmerSnowBowl";
    bowl.convertToFlatShadedMesh();
    bowl.material = earth;
    bowl.applyFog = false;
    bowl.isPickable = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(bowl);
  }
  // Stones set into the face, flattened along the outward direction, each with a snow cap on its top
  const stones: Mesh[] = [], caps: Mesh[] = [];
  for (let k = 0; k < 80; k++) {
    const a = seeded(k, 91) * Math.PI * 2;
    const y = -3 - seeded(k, 92) * 23;
    let j = 1;
    while (j < BOWL.length - 1 && BOWL[j][1] > y) j++;
    const [sa, ya] = BOWL[j - 1], [sb, yb] = BOWL[j];
    const s = sa + (sb - sa) * ((y - ya) / (yb - ya));
    const [ox, oz] = islandOutline(a);
    const d = 1.4 + seeded(k, 93) * 1.8;
    const stone = MeshBuilder.CreateBox("farmerSnowUnderStone", { width: d * 1.3, height: d * 0.7, depth: d * 0.5 }, scene);
    stone.rotation.set(0, Math.PI / 2 - a, (seeded(k, 94) - 0.5) * 0.3);
    stone.position.set(ox * s, y, oz * s);
    stones.push(stone);
    const cap = MeshBuilder.CreateBox("farmerSnowUnderCap", { width: d * 1.35, height: d * 0.16, depth: d * 0.56 }, scene);
    cap.rotation.copyFrom(stone.rotation);
    cap.position.set(ox * s, y + d * 0.38, oz * s);
    caps.push(cap);
  }
  for (const [list, m, name] of [[stones, stoneMat, "farmerSnowUnderStones"], [caps, capMat, "farmerSnowUnderCaps"]] as const) {
    const merged = Mesh.MergeMeshes(list, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = m;
    merged.applyFog = false;
    merged.isPickable = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(merged);
  }
}

/**
 * Buildings (wiki farmer_snow.png; Farmer 1's layout in winter, this map's own pieces): two timber houses stand on the back rim facing the
 * field and the two-halved watermill straddles the frozen river at the front rim, all roofed in snow. Spec: houses at (-26, 36) and
 * (-11, 39), 7 m wide and 6 m deep, dark red-brown board walls 4.4 m high on a 0.6 m stone footing, a steep gable roof 3.8 m high with its
 * ridge running front to back (the gable end faces the field), roof planes overhanging 0.6 m, laid as a dark board layer under a 0.3 m
 * snow layer; two lit yellow windows and a door on the gable end, one lit window upstairs. The mill: two halves 9 m wide and 10 m deep
 * either side of the ice (2.8 m gap) at z -41, a 1.2 m stone plinth, 6 m of dark blue-grey boards, the same snow gable roof (4.4 m), a lit
 * window on each field face, and a 8 m wheel (two rims, eight spokes, twelve paddles) standing in the gap, its rims capped with snow.
 * Each house is one box collider; the mill (both halves and the wheel) is one.
 */
const SNOW_HOUSES: Array<[number, number]> = [[-26, 36], [-11, 39]];
const SNOW_MILL = { z: -41, gap: 2.8, width: 9, depth: 10, plinth: 1.2, wall: 6, roof: 4.4, wheel: 8 };

function snowBuildings(scene: Scene): Obstacle[] {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    wall: mk("farmerSnowHouseWall", new Color3(0.36, 0.12, 0.08), 0.35),
    mill: mk("farmerSnowMillWall", new Color3(0.2, 0.23, 0.32), 0.4),
    board: mk("farmerSnowRoofBoard", new Color3(0.2, 0.12, 0.08), 0.3),
    snow: mk("farmerSnowRoofSnow", SNOW, 0.35),
    stone: mk("farmerSnowFooting", new Color3(0.34, 0.37, 0.48), 0.35),
    lit: mk("farmerSnowWindow", new Color3(1, 0.72, 0.28), 1),
    wood: mk("farmerSnowWheel", new Color3(0.24, 0.16, 0.1), 0.35),
  };
  const lists: Record<keyof typeof mats, Mesh[]> = { wall: [], mill: [], board: [], snow: [], stone: [], lit: [], wood: [] };
  const box = (list: keyof typeof mats, w: number, h: number, d: number, x: number, y: number, z: number, rz = 0) => {
    const b = MeshBuilder.CreateBox("farmerSnowPart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    b.rotation.z = rz;
    lists[list].push(b);
    return b;
  };
  // A block with a gable roof whose ridge runs along z: walls, gable rhombus, two roof planes each a board layer under a snow layer
  const gabled = (wallList: "wall" | "mill", x: number, z: number, w: number, d: number, base: number, high: number, roof: number) => {
    box(wallList, w, high, d, x, base + high / 2, z);
    const gable = MeshBuilder.CreateBox("farmerSnowGable", { size: 1 }, scene);
    gable.rotation.z = Math.PI / 4;
    gable.bakeCurrentTransformIntoVertices();
    gable.scaling.set(w / Math.SQRT2, (2 * roof) / Math.SQRT2, d);
    gable.bakeCurrentTransformIntoVertices();
    gable.position.set(x, base + high, z);
    lists[wallList].push(gable);
    const pitch = Math.atan2(roof, w / 2), slope = Math.hypot(w / 2, roof) + 0.6;
    for (const side of [-1, 1]) {
      // Outward normal of the plane sloping down toward this side, and its centre moved 0.3 m down-slope for the eave overhang
      const nx = side * Math.sin(pitch), ny = Math.cos(pitch);
      const cx = x + side * (w / 4) + side * 0.3 * Math.cos(pitch), cy = base + high + roof / 2 - 0.3 * Math.sin(pitch);
      box("board", slope, 0.25, d + 1.2, cx + nx * 0.15, cy + ny * 0.15, z, -side * pitch);
      box("snow", slope + 0.1, 0.3, d + 1.3, cx + nx * 0.42, cy + ny * 0.42, z, -side * pitch);
    }
  };
  const obstacles: Obstacle[] = [];
  for (const [x, z] of SNOW_HOUSES) {
    box("stone", 7.6, 0.6, 6.6, x, 0.3, z);
    gabled("wall", x, z, 7, 6, 0.6, 4.4, 3.8);
    const front = z - 3.05;
    box("lit", 1.1, 1.2, 0.12, x - 2, 2.4, front);
    box("lit", 1.1, 1.2, 0.12, x + 2, 2.4, front);
    box("lit", 1, 1.1, 0.12, x, 5.6, front);
    box("board", 1.3, 2.3, 0.14, x, 1.75, front);
    obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: 3.8, halfZ: 3.3 });
  }
  const x0 = iceX(SNOW_MILL.z), off = SNOW_MILL.gap / 2 + SNOW_MILL.width / 2;
  for (const side of [-1, 1]) {
    const x = x0 + side * off;
    box("stone", SNOW_MILL.width, SNOW_MILL.plinth, SNOW_MILL.depth, x, SNOW_MILL.plinth / 2, SNOW_MILL.z);
    gabled("mill", x, SNOW_MILL.z, SNOW_MILL.width - 0.4, SNOW_MILL.depth - 0.4, SNOW_MILL.plinth, SNOW_MILL.wall, SNOW_MILL.roof);
    box("lit", 1.2, 1.3, 0.12, x, SNOW_MILL.plinth + 3.2, SNOW_MILL.z + SNOW_MILL.depth / 2 - 0.15);
  }
  // The wheel turns about x in the gap: rims, spokes and paddles in the y-z plane
  const R = SNOW_MILL.wheel / 2, wz = SNOW_MILL.z, wy = R - 1;
  for (const dx of [-0.9, 0.9]) {
    const rim = MeshBuilder.CreateTorus("farmerSnowRim", { diameter: SNOW_MILL.wheel, thickness: 0.35, tessellation: 24 }, scene);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(x0 + dx, wy, wz);
    lists.wood.push(rim);
    const cap = MeshBuilder.CreateTorus("farmerSnowRimCap", { diameter: SNOW_MILL.wheel, thickness: 0.2, tessellation: 24 }, scene);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(x0 + dx, wy + 0.2, wz);
    lists.snow.push(cap);
  }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const paddle = MeshBuilder.CreateBox("farmerSnowPaddle", { width: 2, height: 0.12, depth: 1.1 }, scene);
    paddle.position.set(x0, wy + Math.sin(a) * R, wz + Math.cos(a) * R);
    paddle.rotation.x = -a;
    lists.wood.push(paddle);
    if (i % 3 === 0) {
      const spoke = MeshBuilder.CreateBox("farmerSnowSpoke", { width: 1.6, height: 0.2, depth: SNOW_MILL.wheel }, scene);
      spoke.position.set(x0, wy, wz);
      spoke.rotation.x = a;
      lists.wood.push(spoke);
    }
  }
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(lists) as Array<keyof typeof mats>) {
    const merged = lists[key].length ? Mesh.MergeMeshes(lists[key], true) : null;
    if (!merged) continue;
    merged.name = `farmerSnowBuildings_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
    if (key !== "lit") {
      merged.applyFog = false;
      glow?.addExcludedMesh(merged);
    }
  }
  obstacles.push({ type: "box", center: new Vector3(x0, 0, SNOW_MILL.z), halfX: off + SNOW_MILL.width / 2, halfZ: SNOW_MILL.depth / 2 });
  return obstacles;
}

/**
 * Festive lights (wiki farmer_snow.png): a string of warm yellow bulbs sags between the two back houses, bulbs outline the gable of the
 * nearer house and of each mill half, another string sags across the gap between the mill ridges, and a lit Christmas tree stands
 * between the houses. Spec: bulbs 0.22 m spheres 0.7 m apart, self-lit warm yellow, in the glow but out of the fog; the house string runs
 * from house 1's right eave to house 2's left eave (5 m up, 1.4 m sag); the tree at (-18.5, 31): three stacked dark green cones 5.5 m in
 * all on a short trunk, 18 bulbs spiralled over it, a gold star on top; one collider (1.2 m).
 */
function festiveLights(scene: Scene): Obstacle[] {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const bulbs: Mesh[] = [], wires: Mesh[] = [], greens: Mesh[] = [], star: Mesh[] = [];
  const bulb = (p: Vector3, r = 0.22) => {
    const b = MeshBuilder.CreateSphere("farmerSnowBulb", { diameter: r * 2, segments: 3 }, scene);
    b.position.copyFrom(p);
    bulbs.push(b);
  };
  // A string from a to b sagging by `sag` at its middle: a thin dark wire with bulbs hung along it
  const string = (a: Vector3, b: Vector3, sag: number) => {
    const n = Math.max(2, Math.round(Vector3.Distance(a, b) / 0.7));
    const pts: Vector3[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const p = Vector3.Lerp(a, b, t);
      p.y -= sag * 4 * t * (1 - t);
      pts.push(p);
      if (i > 0 && i < n) bulb(p.add(new Vector3(0, -0.18, 0)));
    }
    wires.push(MeshBuilder.CreateTube("farmerSnowWire", { path: pts, radius: 0.04, tessellation: 4 }, scene));
  };
  const [h1, h2] = SNOW_HOUSES;
  string(new Vector3(h1[0] + 3.6, 5, h1[1] - 2.6), new Vector3(h2[0] - 3.6, 5, h2[1] - 2.6), 1.4);
  // House 2's field gable: eave, ridge, eave
  const gable = (x: number, z: number, half: number, eave: number, ridge: number) => {
    string(new Vector3(x - half, eave, z), new Vector3(x, ridge, z), 0.1);
    string(new Vector3(x, ridge, z), new Vector3(x + half, eave, z), 0.1);
  };
  gable(h2[0], h2[1] - 3.4, 3.8, 5, 8.8);
  const x0 = iceX(SNOW_MILL.z), off = SNOW_MILL.gap / 2 + SNOW_MILL.width / 2;
  const millEave = SNOW_MILL.plinth + SNOW_MILL.wall, millRidge = millEave + SNOW_MILL.roof, millFace = SNOW_MILL.z - SNOW_MILL.depth / 2 - 0.5;
  for (const side of [-1, 1]) gable(x0 + side * off, millFace, SNOW_MILL.width / 2, millEave, millRidge);
  string(new Vector3(x0 - off, millRidge, millFace), new Vector3(x0 + off, millRidge, millFace), 1.6);
  // The Christmas tree
  const tx = -18.5, tz = 31;
  const trunk = MeshBuilder.CreateCylinder("farmerSnowXmasTrunk", { diameter: 0.4, height: 0.8, tessellation: 6 }, scene);
  trunk.position.set(tx, 0.4, tz);
  wires.push(trunk);
  for (let t = 0; t < 3; t++) {
    const w = 3.4 * (1 - t * 0.28), h = 2.6 - t * 0.3, y = 0.6 + t * 1.45;
    const cone = MeshBuilder.CreateCylinder("farmerSnowXmasCone", { diameterTop: 0, diameterBottom: w, height: h, tessellation: 8 }, scene);
    cone.position.set(tx, y + h / 2, tz);
    greens.push(cone);
  }
  for (let i = 0; i < 18; i++) {
    const u = i / 18, y = 0.9 + u * 4.2, r = 1.6 * (1 - u * 0.85);
    const a = u * Math.PI * 7;
    bulb(new Vector3(tx + Math.cos(a) * r, y, tz + Math.sin(a) * r), 0.18);
  }
  const top = MeshBuilder.CreatePolyhedron("farmerSnowXmasStar", { type: 1, size: 0.35 }, scene);
  top.position.set(tx, 6.3, tz);
  star.push(top);
  const glow = scene.getGlowLayerByName("glow");
  for (const [list, m, name, glowing] of [
    [bulbs, mk("farmerSnowBulb", new Color3(1, 0.78, 0.32), 1.6), "farmerSnowBulbs", true],
    [star, mk("farmerSnowStar", new Color3(1, 0.85, 0.3), 1.4), "farmerSnowStar", true],
    [wires, mk("farmerSnowWire", new Color3(0.12, 0.09, 0.07), 0.3), "farmerSnowWires", false],
    [greens, mk("farmerSnowXmas", new Color3(0.06, 0.24, 0.13), 0.45), "farmerSnowXmasTree", false],
  ] as const) {
    const merged = Mesh.MergeMeshes(list, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = m;
    merged.applyFog = false;
    merged.isPickable = false;
    if (!glowing) glow?.addExcludedMesh(merged);
  }
  return [{ type: "cylinder", center: new Vector3(tx, 0, tz), radius: 1.2 }];
}

export function buildFarmerSnow(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  snowCover(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  const restoreLights = nightSky(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  navyBowl(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
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
    obstacles: [...roundSnowIsland(scene, new Set(scene.meshes.filter((m) => !prior.has(m))), result.obstacles), ...snowyBridge(scene), ...pineGrove(scene), ...snowBuildings(scene), ...festiveLights(scene)],
    dispose: () => {
      restoreLights();
      baseDispose?.();
    },
  };
}
