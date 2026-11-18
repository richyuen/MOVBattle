// TABS "Spooky 1" (spooky map): Medieval 1's two plateaus at night, the river a fog chasm, a graveyard on the right plateau
// (reference/maps/wiki/spooky_1.png, reference/maps/spooky_1.png; card loop/cards/maps/spooky_1.md). Built on campaign.spooky, which
// Spooky 2 shares: dress its build here only.
//
// Night sky (576, spooky_1.png and the wiki shot: the island hangs in a deep navy night, no clouds and no mountain range, a pale moon
// up in the sky and stars, the light a dim cold blue from above). Spec: clear and fog colour navy (0.035, 0.05, 0.13); the base's
// mountain* range and clouds hidden; the hemispheric light at 0.3 with a blue sky (0.42, 0.52, 1.1) and dark ground (0.1, 0.1, 0.25),
// the directional moonlight 0.65 pale blue from the front left; a moon 14 m across at 175 m high in the back left with a faint halo; 300
// star specks on a 170-200 m dome; all unlit, out of fog and glow. The lights are put back on dispose (a build does not reset them).
import { Color3, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, VertexData, type DirectionalLight, type HemisphericLight, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

// Fog chasm (577, spooky_1.png: the island is Medieval 1's, two raised plateaus of stacked rock columns split front to back by a
// winding ravine; the river is gone and the ravine is filled with pale blue fog that kills; a narrow stone bridge crosses it at the
// middle). Spec, a self-contained copy of Medieval 1's shape (tabs/medieval_1.ts SHORE, plateau, bridge, hazards): SHORE gives, at
// each z, the ravine's half width (inside) and the plateau's outer edge; each plateau is a fan of the outline in navy night grass
// with cliff columns 6-12 m (upper) and the rest to 19 m (lower) down its edges in blue-grey stone; the base floor, underside,
// blades, haze band and base void band go; the ravine holds three stacked translucent fog sheets (y -1.5, -4.5, -8) over a navy
// floor at -19 m; the bridge is eleven stone courses at z 1, 8 m deep, with coping; void hazards fill the ravine but under the
// bridge (Medieval 1's seven boxes); base props and ring trees in the ravine or off the plateaus go with their colliders; the
// placement zones are Medieval 1's (x +-23, 36 x 62 m).
const SHORE = [
  [-43, 12, 24], [-35, 9, 38], [-23, 7, 48], [-10, 5, 52], [-3, 4, 53],
  [5, 4, 53], [18, 6, 49], [31, 8, 40], [40, 13, 25],
] as const;

function onPlateau(x: number, z: number): boolean {
  for (let i = 1; i < SHORE.length; i++) {
    const [front, near, far] = SHORE[i - 1];
    const [back, nextNear, nextFar] = SHORE[i];
    if (z < front || z > back) continue;
    const t = (z - front) / (back - front);
    return Math.abs(x) > near + (nextNear - near) * t + 0.8 && Math.abs(x) < far + (nextFar - far) * t - 0.5;
  }
  return false;
}

function plateau(scene: Scene, side: number, grass: StandardMaterial, stone: StandardMaterial): void {
  const points = [
    ...SHORE.map(([z, inside]) => new Vector3(side * inside, 0, z)),
    ...[...SHORE].reverse().map(([z, , outside]) => new Vector3(side * outside, 0, z)),
  ];
  const mesh = new Mesh("spooky1Plateau", scene);
  const positions = [side * 25, 0, 0, ...points.flatMap((p) => [p.x, p.y, p.z])];
  const indices = points.flatMap((_, i) => {
    const j = (i + 1) % points.length;
    return side > 0 ? [0, j + 1, i + 1] : [0, i + 1, j + 1];
  });
  const normals: number[] = [];
  VertexData.ComputeNormals(positions, indices, normals);
  const data = new VertexData();
  data.positions = positions;
  data.indices = indices;
  data.normals = normals;
  data.applyToMesh(mesh);
  mesh.material = grass;
  mesh.receiveShadows = true;
  const columns: Mesh[] = [];
  const caps: Mesh[] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    const span = Vector3.Distance(a, b);
    const count = Math.ceil(span / 5);
    const nx = side * (a.z - b.z) / span, nz = side * (b.x - a.x) / span;
    for (let j = 0; j < count; j++) {
      const p = Vector3.Lerp(a, b, (j + 0.5) / count);
      const width = span / count;
      const upper = 6 + ((i * 3 + j * 5) % 7);
      for (const [height, top, offset] of [[upper, 0, 0.35], [19 - upper, -upper, 1.65 + j % 3]]) {
        const x = p.x + nx * offset, z = p.z + nz * offset;
        const shaft = MeshBuilder.CreateCylinder("spooky1CliffColumn", { height, diameterTop: width * 1.18, diameterBottom: width * 1.37, tessellation: 6 }, scene);
        shaft.scaling.z = 0.72;
        shaft.rotation.y = Math.atan2(a.z - b.z, b.x - a.x);
        shaft.position.set(x, top - height / 2 - 0.18, z);
        columns.push(shaft);
        const cap = MeshBuilder.CreateCylinder("spooky1TurfLedge", { height: 0.72, diameterTop: width * 1.23, diameterBottom: width * 1.13, tessellation: 6 }, scene);
        cap.scaling.copyFrom(shaft.scaling);
        cap.rotation.y = shaft.rotation.y;
        cap.position.set(x, top - 0.39, z);
        caps.push(cap);
      }
    }
  }
  for (const [group, mat] of [[columns, stone], [caps, grass]] as const) {
    const merged = Mesh.MergeMeshes(group, true);
    if (!merged) continue;
    merged.name = "spooky1Cliffs";
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.receiveShadows = true;
  }
}

function fogChasm(scene: Scene, built: Set<unknown>, result: MapBuildResult): MapBuildResult {
  const gone: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (/^(ground$|centerGrass$|islandUnder|islandShelf|islandCliff|fieldBlades_|fieldTufts_|grassTuft|hazeTreeline|campaign_zone_|campaign_hazard_box_void)/.test(mesh.name)) mesh.setEnabled(false);
    else if (!mesh.parent && /^(trunk$|Spooky Graveyard_)/.test(mesh.name) && !onPlateau(mesh.position.x, mesh.position.z)) {
      gone.push(mesh.position.clone());
      mesh.setEnabled(false);
    }
  }
  const mk = (name: string, c: Color3, self: Color3, alpha = 1) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = self;
    m.specularColor = Color3.Black();
    m.alpha = alpha;
    return m;
  };
  const grass = mk("spooky1PlateauGrass", new Color3(0.2, 0.24, 0.38), new Color3(0.05, 0.06, 0.11));
  const stone = mk("spooky1CliffStone", new Color3(0.3, 0.33, 0.48), new Color3(0.1, 0.11, 0.18));
  plateau(scene, -1, grass, stone);
  plateau(scene, 1, grass, stone);
  const glow = scene.getGlowLayerByName("glow");
  const fog = mk("spooky1Fog", Color3.Black(), new Color3(0.42, 0.48, 0.78), 0.32);
  fog.disableLighting = true;
  fog.backFaceCulling = false;
  for (const y of [-1.5, -4.5, -8]) {
    const sheet = MeshBuilder.CreateGround("spooky1FogSheet", { width: 28, height: 92 }, scene);
    sheet.position.set(0, y, -1.5);
    sheet.material = fog;
    sheet.isPickable = false;
    sheet.applyFog = false;
    glow?.addExcludedMesh(sheet);
  }
  const floor = MeshBuilder.CreateGround("spooky1ChasmFloor", { width: 30, height: 94 }, scene);
  floor.position.set(0, -19, -1.5);
  floor.material = mk("spooky1ChasmFloor", new Color3(0.06, 0.07, 0.16), new Color3(0.03, 0.035, 0.08));
  for (let i = 0; i < 11; i++) {
    const h = 0.45 + Math.abs(i - 5) * 0.42;
    const block = MeshBuilder.CreateBox("spooky1BridgeCourse", { width: 1.08, height: h, depth: 8 }, scene);
    block.position.set(i - 5, -h / 2, 1);
    block.material = stone;
  }
  for (const z of [-3, 5]) {
    for (let x = -5; x <= 5; x += 2) {
      const coping = MeshBuilder.CreateBox("spooky1BridgeCoping", { width: 1.88, height: 0.52, depth: 0.46 }, scene);
      coping.position.set(x, 0.18, z);
      coping.material = stone;
    }
  }
  const hazards: MapBuildResult["hazards"] = [];
  for (const [front, back, halfX] of [[-45, -34, 9], [-34, -23, 7], [-23, -10, 5.5], [-10, -3, 4.5], [5, 18, 4.5], [18, 31, 6.8], [31, 42, 9.5]]) {
    hazards.push({ shape: "box", kind: "void", center: new Vector3(0, 0, (front + back) / 2), halfX, halfZ: (back - front) / 2 });
  }
  const obstacles = result.obstacles.filter((o) => !gone.some((p) => Math.hypot(p.x - o.center.x, p.z - o.center.z) < 0.6));
  const placementZones = result.zones.map((zone) => ({ ...zone, center: new Vector3(Math.sign(zone.center.x) * 23, 0, 0), size: new Vector3(36, zone.size.y, 62) }));
  return { ...result, obstacles, hazards, placementZones };
}

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const NIGHT = new Color3(0.035, 0.05, 0.13);

function nightSky(scene: Scene, built: Set<unknown>): () => void {
  scene.clearColor.set(NIGHT.r, NIGHT.g, NIGHT.b, 1);
  scene.fogColor = NIGHT.clone();
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && (mesh.name.startsWith("mountain") || mesh.name.startsWith("cloud"))) mesh.setEnabled(false);
  }
  const hemi = scene.getLightByName("hemi") as HemisphericLight | null;
  const dir = scene.getLightByName("dir") as DirectionalLight | null;
  const saved = {
    hemi: hemi ? [hemi.intensity, hemi.diffuse.clone(), hemi.groundColor.clone()] as const : null,
    dir: dir ? [dir.intensity, dir.diffuse.clone(), dir.direction.clone()] as const : null,
  };
  if (hemi) {
    hemi.intensity = 0.3;
    hemi.diffuse = new Color3(0.42, 0.52, 1.1);
    hemi.groundColor = new Color3(0.1, 0.1, 0.25);
  }
  if (dir) {
    dir.intensity = 0.65;
    dir.diffuse = new Color3(0.58, 0.68, 1.1);
    dir.direction.set(0.55, -0.62, 0.5);
  }
  const glow = scene.getGlowLayerByName("glow");
  const unlit = (name: string, c: Color3, alpha = 1) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.Black();
    m.emissiveColor = c;
    m.specularColor = Color3.Black();
    m.disableLighting = true;
    m.alpha = alpha;
    return m;
  };
  const finish = (mesh: Mesh, mat: StandardMaterial) => {
    mesh.material = mat;
    mesh.applyFog = false;
    mesh.isPickable = false;
    glow?.addExcludedMesh(mesh);
  };
  const stars: Mesh[] = [];
  for (let i = 0; i < 300; i++) {
    const a = seeded(i, 61) * Math.PI * 2, up = 0.08 + seeded(i, 62) * 1.35, r = 170 + seeded(i, 63) * 30;
    const s = MeshBuilder.CreateIcoSphere("spooky1Star", { radius: 0.3 + seeded(i, 64) * 0.45, subdivisions: 1 }, scene);
    s.position.set(Math.cos(a) * Math.cos(up) * r, Math.sin(up) * r - 10, Math.sin(a) * Math.cos(up) * r);
    stars.push(s);
  }
  const starMesh = Mesh.MergeMeshes(stars, true);
  if (starMesh) {
    starMesh.name = "spooky1Stars";
    finish(starMesh, unlit("spooky1Stars", new Color3(0.9, 0.92, 1)));
  }
  const moonAt = { x: -70, y: 120, z: 150 };
  const moon = MeshBuilder.CreateSphere("spooky1Moon", { diameter: 14, segments: 16 }, scene);
  moon.position.set(moonAt.x, moonAt.y, moonAt.z);
  finish(moon, unlit("spooky1Moon", new Color3(0.95, 0.93, 0.82)));
  const halo = MeshBuilder.CreateSphere("spooky1MoonHalo", { diameter: 26, segments: 12 }, scene);
  halo.position.set(moonAt.x, moonAt.y, moonAt.z + 4);
  finish(halo, unlit("spooky1MoonHalo", new Color3(0.35, 0.42, 0.7), 0.25));
  return () => {
    if (hemi && saved.hemi) [hemi.intensity, hemi.diffuse, hemi.groundColor] = [saved.hemi[0], saved.hemi[1], saved.hemi[2]];
    if (dir && saved.dir) [dir.intensity, dir.diffuse, dir.direction] = [saved.dir[0], saved.dir[1], saved.dir[2]];
  };
}

// Night grass (577, wiki spooky_1.png: the grass is a dark navy-grey under the blue night, its tufts a shade lighter where
// the moon catches them; no red or blue tint across the two halves). Spec: the translucent team-zone slabs
// (campaign_zone_overlay_* / border_*, the maroon and blue sheets reaching past the island) hidden; the floor ("ground",
// "centerGrass") navy-grey (0.2, 0.24, 0.38) with a cold self-light (0.05, 0.06, 0.11); the base's grass blades and tufts
// recoloured a lighter blue-grey (0.26, 0.31, 0.46), self-lit (0.06, 0.07, 0.12), so they read in the dark.
function nightGrass(scene: Scene, built: Set<unknown>): void {
  const floor = new StandardMaterial("spooky1NightFloor", scene);
  floor.diffuseColor = new Color3(0.2, 0.24, 0.38);
  floor.emissiveColor = new Color3(0.05, 0.06, 0.11);
  floor.specularColor = Color3.Black();
  const blades = new StandardMaterial("spooky1NightBlades", scene);
  blades.diffuseColor = new Color3(0.26, 0.31, 0.46);
  blades.emissiveColor = new Color3(0.06, 0.07, 0.12);
  blades.specularColor = Color3.Black();
  blades.backFaceCulling = false;
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (/^campaign_zone_(overlay|border)_/.test(mesh.name)) mesh.setEnabled(false);
    else if (mesh.name === "ground" || mesh.name === "centerGrass") mesh.material = floor;
    else if (/^(fieldBlades_|fieldTufts_|grassTuft)/.test(mesh.name)) mesh.material = blades;
  }
}

// Dead trees (578, card Overview and the wiki shot: every tree is black and leafless, a crooked trunk splitting into a few
// gnarled limbs that twist up and out, forking again into bare twigs; no round crowns anywhere). Spec: every base ring tree on a
// plateau (an unparented "trunk", its crown as children) goes, its collider kept; in its place a dead tree 4-6.5 m: a trunk
// leaning up to 12 degrees, two or three limbs from its top 2-3.4 m long at 35-60 degrees from upright, each with two twigs
// 0.9-1.6 m flaring further out; all near-black navy (0.07, 0.07, 0.11), barely self-lit, merged, in the glow pass (dark solid).
function deadTrees(scene: Scene, built: Set<unknown>): void {
  const bark = new StandardMaterial("spooky1DeadBark", scene);
  bark.diffuseColor = new Color3(0.07, 0.07, 0.11);
  bark.emissiveColor = new Color3(0.028, 0.028, 0.045);
  bark.specularColor = Color3.Black();
  const parts: Mesh[] = [];
  const up = Vector3.Up();
  const limb = (from: Vector3, len: number, d: number, yaw: number, tilt: number): Vector3 => {
    const dir = new Vector3(Math.sin(tilt) * Math.cos(yaw), Math.cos(tilt), Math.sin(tilt) * Math.sin(yaw));
    const c = MeshBuilder.CreateCylinder("spooky1DeadLimb", { height: len, diameterBottom: d, diameterTop: d * 0.55, tessellation: 5 }, scene);
    c.rotationQuaternion = Quaternion.Identity();
    Quaternion.FromUnitVectorsToRef(up, dir, c.rotationQuaternion);
    c.position = from.add(dir.scale(len / 2));
    parts.push(c);
    return from.add(dir.scale(len * 0.95));
  };
  let k = 0;
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || mesh.name !== "trunk" || mesh.parent || !mesh.isEnabled()) continue;
    const { x, z } = mesh.position;
    if (!onPlateau(x, z)) continue;
    mesh.setEnabled(false);
    k++;
    const tall = 4 + seeded(k, 71) * 2.5;
    const top = limb(new Vector3(x, 0, z), tall * 0.6, 0.55, seeded(k, 72) * 6.28, seeded(k, 73) * 0.2);
    const limbs = seeded(k, 74) < 0.5 ? 2 : 3;
    for (let j = 0; j < limbs; j++) {
      const yaw = seeded(k, 75) * 6.28 + (j * 6.28) / limbs;
      const end = limb(top, 2 + seeded(k + j, 76) * 1.4, 0.32, yaw, 0.6 + seeded(k + j, 77) * 0.45);
      for (const s of [-1, 1]) limb(end, 0.9 + seeded(k + j, 78 + s) * 0.7, 0.15, yaw + s * 0.7, 0.9 + seeded(k + j, 80) * 0.3);
    }
  }
  const merged = Mesh.MergeMeshes(parts, true);
  if (!merged) return;
  merged.name = "spooky1DeadTrees";
  merged.convertToFlatShadedMesh();
  merged.material = bark;
  merged.receiveShadows = true;
  merged.isPickable = false;
}

export function buildSpooky1(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const base0 = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  nightGrass(scene, built);
  deadTrees(scene, built);
  const result = fogChasm(scene, built, base0);
  const restore = nightSky(scene, built);
  return { ...result, dispose: () => { restore(); result.dispose?.(); } };
}
