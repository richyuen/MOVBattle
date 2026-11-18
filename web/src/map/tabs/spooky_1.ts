// TABS "Spooky 1" (spooky map): Medieval 1's two plateaus at night, the river a fog chasm, a graveyard on the right plateau
// (reference/maps/wiki/spooky_1.png, reference/maps/spooky_1.png; card loop/cards/maps/spooky_1.md). Built on campaign.spooky, which
// Spooky 2 shares: dress its build here only.
//
// Night sky (576, spooky_1.png and the wiki shot: the island hangs in a deep navy night, no clouds and no mountain range, a pale moon
// up in the sky and stars, the light a dim cold blue from above). Spec: clear and fog colour navy (0.035, 0.05, 0.13); the base's
// mountain* range and clouds hidden; the hemispheric light at 0.3 with a blue sky (0.42, 0.52, 1.1) and dark ground (0.1, 0.1, 0.25),
// the directional moonlight 0.65 pale blue from the front left; a moon 14 m across at 175 m high in the back left with a faint halo; 300
// star specks on a 170-200 m dome; all unlit, out of fog and glow. The lights are put back on dispose (a build does not reset them).
import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, VertexData, type DirectionalLight, type HemisphericLight, type Scene } from "@babylonjs/core";
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
    ...SHORE.map(([z, inside]) => new Vector3(side * (side < 0 && z >= -23 && z <= 5 ? 15 : inside), 0, z)),
    ...[...SHORE].reverse().map(([z, , outside]) => new Vector3(side * outside, 0, z)),
  ];
  const mesh = new Mesh("spooky1Plateau", scene);
  // Longitudinal strips triangulate the concave recess without a fan crossing its mouth.
  const positions = points.flatMap((p) => [p.x, p.y, p.z]);
  const indices: number[] = [];
  for(let i=0;i<SHORE.length-1;i++) {
    const a=i,b=i+1,c=points.length-1-i,d=c-1;
    indices.push(...(side>0?[a,c,b,b,c,d]:[a,b,c,b,d,c]));
  }
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
      // Leave the recessed secret passage open before the cliff columns merge.
      if (side < 0 && p.x > -17 && p.z > -25 && p.z < 7) continue;
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

// Graveyard (578, spooky_1.png and card Overview: the graveyard is on the right plateau only, at its back, a grid of pale
// headstones and crosses behind a black iron fence; the left plateau has none). Spec: every base tomb, gravestone and grave
// light (and the base tree standing in the plot) goes, colliders with them; on the right plateau a plot x 13..31, z 13..29 is
// fenced in black iron (0.12, 0.12, 0.16): posts 1.6 m every 1.5 m with spear tips, two rails, a 4 m gate gap in the front side
// at x 20..24; inside, 4 rows of 6 headstones (z 16..26.5, x 15.5..30.5), alternately round-topped slabs and crosses, pale
// blue-grey (0.55, 0.58, 0.7) self-lit 0.4, leaning a little. Drawn only (the base's stones did not block either).
const PLOT = { x0: 13, x1: 31, z0: 13, z1: 29 };
function graveyard(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const gone: Vector3[] = [];
  const inPlot = (p: Vector3) => p.x > PLOT.x0 - 1 && p.x < PLOT.x1 + 1 && p.z > PLOT.z0 - 1 && p.z < PLOT.z1 + 1;
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || mesh.parent) continue;
    const grave = /^Spooky Graveyard_(tomb|graveLight|graveLightPool)$/.test(mesh.name);
    const stone = mesh.name === "Spooky Graveyard_box" && Math.abs(Math.abs(mesh.position.x) - 21) < 1.5 && Math.abs(Math.abs(mesh.position.z) - 16) < 0.5;
    const inside = /^(Spooky Graveyard_|trunk$)/.test(mesh.name) && inPlot(mesh.position);
    if (grave || stone || inside || (mesh.name === "Spooky Graveyard_cyl" && built.has(mesh) && scene.meshes.some((m) => m.name === "Spooky Graveyard_graveLight" && Math.hypot(m.position.x - mesh.position.x, m.position.z - mesh.position.z) < 0.3))) {
      gone.push(mesh.position.clone());
      mesh.setEnabled(false);
    }
  }
  result.obstacles = result.obstacles.filter(({ center }) => !gone.some((p) => Math.hypot(center.x - p.x, center.z - p.z) < 0.6));
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const iron = mk("spooky1Iron", new Color3(0.12, 0.12, 0.16), 0.3);
  const pale = mk("spooky1Headstone", new Color3(0.55, 0.58, 0.7), 0.4);
  const fence: Mesh[] = [], stones: Mesh[] = [];
  const box = (into: Mesh[], w: number, h: number, d: number, x: number, y: number, z: number, lean = 0) => {
    const b = MeshBuilder.CreateBox("spooky1GravePart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    b.rotation.x = lean;
    into.push(b);
    return b;
  };
  const side = (ax: number, az: number, bx: number, bz: number) => {
    const len = Math.hypot(bx - ax, bz - az), n = Math.round(len / 1.5);
    for (let i = 0; i <= n; i++) {
      const x = ax + ((bx - ax) * i) / n, z = az + ((bz - az) * i) / n;
      box(fence, 0.12, 1.6, 0.12, x, 0.8, z);
      const tip = MeshBuilder.CreateCylinder("spooky1GraveTip", { height: 0.35, diameterBottom: 0.2, diameterTop: 0, tessellation: 4 }, scene);
      tip.position.set(x, 1.77, z);
      fence.push(tip);
    }
    for (const y of [0.5, 1.3]) box(fence, ax === bx ? 0.06 : len, 0.07, ax === bx ? len : 0.06, (ax + bx) / 2, y, (az + bz) / 2);
  };
  side(PLOT.x0, PLOT.z0, 20, PLOT.z0);
  side(24, PLOT.z0, PLOT.x1, PLOT.z0);
  side(PLOT.x1, PLOT.z0, PLOT.x1, PLOT.z1);
  side(PLOT.x0, PLOT.z1, PLOT.x1, PLOT.z1);
  side(PLOT.x0, PLOT.z0, PLOT.x0, PLOT.z1);
  let k = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      k++;
      const x = 15.5 + c * 3, z = 16 + r * 3.5, lean = (seeded(k, 91) - 0.5) * 0.25;
      if ((r + c) % 2) {
        box(stones, 0.22, 1.5, 0.22, x, 0.75, z, lean);
        box(stones, 0.9, 0.22, 0.22, x, 1.1, z, lean);
      } else {
        box(stones, 1, 1, 0.3, x, 0.5, z, lean);
        const cap = MeshBuilder.CreateCylinder("spooky1GraveCap", { height: 0.3, diameter: 1, tessellation: 10 }, scene);
        cap.rotation.set(Math.PI / 2 + lean, 0, 0);
        cap.position.set(x, 1, z);
        stones.push(cap);
      }
    }
  }
  for (const [parts, mat, name] of [[fence, iron, "spooky1GraveFence"], [stones, pale, "spooky1GraveStones"]] as const) {
    const merged = Mesh.MergeMeshes([...parts], true);
    if (!merged) continue;
    merged.name = name;
    merged.material = mat;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

// Night grass (577,wiki spooky_1.png: the grass is a dark navy-grey under the blue night, its tufts a shade lighter where
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

// Rim offerings: ribbed orange lanterns with lit eyes/mouths, beside irregular groups of ivory candles.
function rimOfferings(scene: Scene): void {
  const material = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c; m.emissiveColor = c.scale(self); m.specularColor = Color3.Black();
    return m;
  };
  const orange = material("spooky1Pumpkin", new Color3(0.45, 0.09, 0.008), 0.5);
  const lit = material("spooky1LanternLight", new Color3(1, 0.42, 0.1), 2);
  const wax = material("spooky1Wax", new Color3(0.8, 0.7, 0.46), 0.6);
  const stalk = material("spooky1Stalk", new Color3(0.07, 0.09, 0.03), 0.2);
  const finish = (m: Mesh, mat: StandardMaterial, x: number, y: number, z: number) => {
    m.position.set(x, y, z); m.material = mat; m.isPickable = false;
  };
  const spots = [[-22,-34],[-37,-23],[-45,-10],[-42,19],[-26,32],[-9,8],[9,8],[35,-27],[46,-10],[42,15],[28,33],[12,-18]];
  for (const [i, [x,z]] of spots.entries()) {
    const r = 0.85 + seeded(i, 91) * 0.5;
    const body = MeshBuilder.CreateSphere("spooky1JackOLantern", { diameter: r * 2, segments: 12 }, scene);
    body.scaling.y = 0.8; finish(body, orange, x, r * 0.8, z);
    for (const dx of [-0.33,0.33]) {
      const eye = MeshBuilder.CreateCylinder("spooky1PumpkinEye", { height: 0.08, diameter: r * 0.43, tessellation: 3 }, scene);
      eye.rotation.x = Math.PI / 2; finish(eye, lit, x + dx * r, r * 1.04, z - r * 0.85);
    }
    const mouth = MeshBuilder.CreateBox("spooky1PumpkinSmile", { width: r * 0.9, height: r * 0.2, depth: 0.08 }, scene);
    finish(mouth, lit, x, r * 0.55, z - r * 0.91);
    const stem = MeshBuilder.CreateCylinder("spooky1PumpkinStem", { height: 0.4, diameter: 0.22, tessellation: 5 }, scene);
    finish(stem, stalk, x, r * 1.6 + 0.1, z);
    for (let j=0;j<6;j++) {
      const cx=x+1.5+(j%3)*0.38, cz=z+Math.floor(j/3)*0.55, h=0.45+seeded(i*6+j,92)*0.7;
      const candle=MeshBuilder.CreateCylinder("spooky1Candle",{height:h,diameter:0.18,tessellation:6},scene);
      finish(candle,wax,cx,h/2,cz);
      const flame=MeshBuilder.CreateSphere("spooky1CandleFlame",{diameter:0.17,segments:6},scene);
      flame.scaling.y=1.7; finish(flame,lit,cx,h+0.12,cz);
    }
  }
}

export function buildSpooky1(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const base0 = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  nightGrass(scene, built);
  deadTrees(scene, built);
  const result = fogChasm(scene, built, base0);
  duskyMeadow(scene);
  const restore = nightSky(scene, built);
  graveyard(scene, built, result);
  rimOfferings(scene);
  leftDescent(scene, result);
  return { ...result, dispose: () => { restore(); result.dispose?.(); } };
}

// Dense short, faceted grass on both banks (spooky.bone). Thin instances keep
// the cover inexpensive; the ravine, bridge and recessed descent stay bare.
function duskyMeadow(scene: Scene): void {
  const mat = new StandardMaterial("spooky1DuskyGrass",scene);
  mat.diffuseColor.set(0.2,0.24,0.38);mat.emissiveColor.set(0.05,0.06,0.11);mat.specularColor=Color3.Black();
  const tuft = MeshBuilder.CreateIcoSphere("spooky1DuskyTufts",{radius:0.5,subdivisions:1},scene);
  tuft.material=mat;tuft.receiveShadows=true;tuft.isPickable=false;
  const matrices: number[]=[];
  let i=0;
  for(let x=-52;x<=52;x+=0.78) for(let z=-42;z<=39;z+=0.78) {
    i++;
    const px=x+(seeded(i,301)-0.5)*0.5,pz=z+(seeded(i,302)-0.5)*0.5;
    if(!onPlateau(px,pz) || (px>-16&&px<-6&&pz>-26&&pz<2)) continue;
    const h=0.32+seeded(i,303)*0.3;
    matrices.push(...Matrix.Compose(new Vector3(0.7+seeded(i,304)*0.4,h*2,0.6+seeded(i,305)*0.35),Quaternion.RotationAxis(Vector3.Up(),seeded(i,306)*6.28),new Vector3(px,h*0.4,pz)).m);
  }
  tuft.thinInstanceSetBuffer("matrix",new Float32Array(matrices),16);
}

// A walled descent in a recess on the left bank, ending at the broken room beneath the bridge.
// The 4 m path drops 6 m over z -23..0; the cliff columns above it are omitted in plateau().
function leftDescent(scene: Scene, result: MapBuildResult): void {
  const stone = new StandardMaterial("spooky1PassageStone",scene);
  stone.diffuseColor.set(0.22,0.25,0.36);stone.emissiveColor.set(0.11,0.13,0.2);
  const dark = new StandardMaterial("spooky1RoomDark",scene);
  dark.diffuseColor.set(0.015,0.018,0.035);dark.emissiveColor.set(0.006,0.008,0.02);
  const box=(w:number,h:number,d:number,x:number,y:number,z:number,mat=stone)=>{
    const m=MeshBuilder.CreateBox("spooky1LeftDescent",{width:w,height:h,depth:d},scene);
    m.position.set(x,y,z);m.material=mat;m.receiveShadows=true;return m;
  };
  for(let i=0;i<24;i++) {
    const z=-23+i, y=-i/23*6;
    box(4.8,0.45,1.08,-10.5,y-0.23,z);
    for(const x of [-13.1,-7.9]) box(0.45,0.85,1.08,x,y+0.2,z);
  }
  box(8.5,0.5,5,-8,-6.3,1);
  box(0.5,5.7,6,-14.6,-2.85,1);
  box(0.3,3.7,3.4,-3.9,-4.4,1,dark);
  for(const z of [-1.2,3.2]) box(1.2,4,0.75,-4.7,-4.1,z);
  box(1.4,0.75,5.2,-4.7,-2.2,1);
  for(let i=0;i<4;i++) {const plank=box(0.18,2.4-i*0.4,0.3,-5.5,-4.7,-0.5+i*0.9,dark);plank.rotation.x=0.25-i*0.2;}
  // Keep the lowered secret corridor separated from the ordinary combat meadow.
  result.obstacles.push({type:"box",center:new Vector3(-15,0,-12),halfX:0.5,halfZ:10});
}
