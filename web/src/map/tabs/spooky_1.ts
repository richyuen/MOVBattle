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
  // Stepped rock masses (584 rebuild, spec at the head of the cliff rebuild below): a dark skirt wall under the whole outline;
  // in front of it few large masses in four kinds: cliff blocks, buttresses, a projecting lower shelf and hanging roots.
  const rocks: Mesh[] = [];
  const skirtPositions: number[] = [];
  const skirtIndices: number[] = [];
  let n = side < 0 ? 0 : 700;
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    const span = Vector3.Distance(a, b);
    const at = skirtPositions.length / 3;
    skirtPositions.push(a.x, -0.05, a.z, b.x, -0.05, b.z, b.x, -24, b.z, a.x, -24, a.z);
    skirtIndices.push(at, at + 1, at + 2, at, at + 2, at + 3);
    const nx = side * (a.z - b.z) / span, nz = side * (b.x - a.x) / span;
    const tx = (b.x - a.x) / span, tz = (b.z - a.z) / span;
    const yaw = Math.atan2(a.z - b.z, b.x - a.x);
    // The ravine's own faces (the first SHORE.length - 1 edges) carry cliff blocks only: the fog hides what is below
    const ravine = i < SHORE.length - 1;
    // A mass whose face stands `proud` metres outside the outline at distance `mid` along the edge, its top at `top`
    const mass = (shape: "block" | "boulder" | "root", w: number, h: number, d: number, mid: number, proud: number, top: number, turn: number, tip: number) => {
      const rock = shape === "boulder"
        ? MeshBuilder.CreateIcoSphere("spooky1CliffRock", { radius: 0.5, subdivisions: 1 }, scene)
        : MeshBuilder.CreateCylinder("spooky1CliffRock", { height: 1, diameterTop: 1, diameterBottom: shape === "root" ? 0.3 : 0.82, tessellation: shape === "root" ? 5 : 6 }, scene);
      rock.scaling.set(w, h, d);
      rock.rotation.set(tip, yaw + turn, -tip * 0.7);
      const off = proud - d / 2;
      rock.position.set(a.x + tx * mid + nx * off, top - h / 2, a.z + tz * mid + nz * off);
      rocks.push(rock);
    };
    const inRecess = (mid: number) => {
      // Leave the recessed secret passage open before the cliff rocks merge.
      const x = a.x + tx * mid, z = a.z + tz * mid;
      return side < 0 && x > -17 && z > -25 && z < 7;
    };
    // Cliff blocks, 7-12 m of edge each (a remainder under 4 m joins the last)
    for (let from = 0; from < span - 0.01;) {
      n++;
      const r = (s: number) => seeded(n, 500 + s);
      let len = 7 + r(1) * 5;
      if (span - from - len < 4) len = span - from;
      const mid = from + len / 2;
      from += len;
      if (inRecess(mid)) continue;
      mass(r(2) < 0.3 ? "boulder" : "block", len * (1.12 + r(3) * 0.2), 8 + r(4) * 6, 6 + r(5) * 4, mid, (ravine ? 0.2 : 0.4) + r(6) * (ravine ? 0.9 : 2.2), -0.2 - r(7) * 0.5, (r(8) - 0.5) * 0.5, (r(9) - 0.5) * 0.12);
      // A buttress stepping out below the block on about two stations in three
      if (!ravine && r(10) < 0.66) mass(r(11) < 0.5 ? "boulder" : "block", len * (0.55 + r(12) * 0.4), 7 + r(13) * 4, 6 + r(14) * 3, mid + (r(15) - 0.5) * len * 0.4, 2.8 + r(16) * 3, -3.4 - r(17) * 4.2, (r(18) - 0.5) * 0.9, (r(19) - 0.5) * 0.25);
    }
    if (ravine) continue;
    // Lower shelf and the roots hanging under it, 11-16 m of edge each
    for (let from = 0; from < span - 0.01;) {
      n++;
      const r = (s: number) => seeded(n, 540 + s);
      let len = 11 + r(1) * 5;
      if (span - from - len < 6) len = span - from;
      const mid = from + len / 2;
      from += len;
      const shelfTop = -10.5 - r(2) * 3.5, shelfH = 6 + r(3) * 3, proud = 7 + r(4) * 6;
      mass("block", len * (1.2 + r(5) * 0.2), shelfH, proud + 6 + r(6) * 4, mid, proud, shelfTop, (r(7) - 0.5) * 0.4, (r(8) - 0.5) * 0.06);
      for (let k = 0; k < 2; k++) {
        const s = 2.4 + r(9 + k) * 2.4;
        mass("boulder", s * 1.3, s, s * 1.1, mid + (r(11 + k) - 0.5) * len * 0.8, proud - 1 - r(13 + k) * (proud - 3), shelfTop + s * 0.72, r(15 + k) * 3, (r(17 + k) - 0.5) * 0.4);
      }
      const rootH = 5 + r(19) * 13;
      mass("root", len * (0.85 + r(20) * 0.25), rootH, 9 + r(21) * 6, mid + (r(22) - 0.5) * 3, proud - 1.5 - r(23) * 3, shelfTop - shelfH + 1.2, (r(24) - 0.5) * 0.7, (r(25) - 0.5) * 0.1);
    }
  }
  const skirt = new Mesh("spooky1CliffSkirt", scene);
  const skirtNormals: number[] = [];
  VertexData.ComputeNormals(skirtPositions, skirtIndices, skirtNormals);
  const skirtData = new VertexData();
  skirtData.positions = skirtPositions;
  skirtData.indices = skirtIndices;
  skirtData.normals = skirtNormals;
  skirtData.applyToMesh(skirt);
  const skirtStone = stone.clone("spooky1CliffSkirtStone");
  skirtStone.backFaceCulling = false;
  skirt.material = skirtStone;
  skirt.isPickable = false;
  const merged = Mesh.MergeMeshes(rocks, true, true);
  if (!merged) return;
  merged.name = "spooky1Cliffs";
  merged.convertToFlatShadedMesh();
  merged.material = stone;
  merged.receiveShadows = true;
  merged.isPickable = false;
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
  const grass = mk("spooky1PlateauGrass", new Color3(0.13, 0.16, 0.28), new Color3(0.03, 0.038, 0.075));
  const stone = mk("spooky1CliffStone", new Color3(0.22, 0.25, 0.4), new Color3(0.04, 0.046, 0.085));
  plateau(scene, -1, grass, stone);
  plateau(scene, 1, grass, stone);
  const glow = scene.getGlowLayerByName("glow");
  // 584: a dim mist, no brighter than the turf beside it (it was the brightest band of the map and washed the cliffs pale)
  const fog = mk("spooky1Fog", Color3.Black(), new Color3(0.1, 0.125, 0.26), 0.34);
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
  bark.diffuseColor = new Color3(0.035, 0.035, 0.055);
  bark.emissiveColor = new Color3(0.012, 0.012, 0.02);
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
    // Two of every five ring trunks stay bare ground: the wood is a broken line of separate black trees, not a fence.
    if (k % 5 === 1 || k % 5 === 3) continue;
    const tall = 5.5 + seeded(k, 71) * 3.5;
    const twist = seeded(k, 72) * 6.28;
    // A squat crooked three-section trunk with a broad root flare, and three or four heavy limbs that leave it low,
    // bend at an elbow and end in one claw twig.
    const knee = limb(new Vector3(x, 0, z), tall * 0.3, 1.7, twist, 0.28);
    const shoulder = limb(knee, tall * 0.26, 1.2, twist + 1.3, 0.45);
    const top = limb(shoulder, tall * 0.2, 0.85, twist - 0.7, 0.32);
    const limbs = 3 + Math.floor(seeded(k, 74) * 2);
    for (let j = 0; j < limbs; j++) {
      const yaw = twist + j * 2.4 + seeded(k + j, 75) * 0.7;
      const start = j === 0 ? knee : j === 1 ? shoulder : top;
      const elbow = limb(start, 1.6 + seeded(k + j, 76) * 1.6, 0.7, yaw, 0.95 + seeded(k + j, 77) * 0.6);
      const end = limb(elbow, 1.2 + seeded(k + j, 78) * 1.3, 0.42, yaw + 0.65, 0.45 + seeded(k + j, 79) * 0.8);
      limb(end, 0.7 + seeded(k + j, 80), 0.2, yaw - 0.7, 0.7);
    }
  }
  // 32-bit indices: past 65536 vertices a 16-bit merge returns null and leaves every limb unmerged on the default white
  // material (582's blue-white thicket).
  const merged = Mesh.MergeMeshes(parts, true, true);
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

// Bank rebuild (583, replaces 582's meadow, trees and column cliffs; references reference/stages/spooky.bone.png,
// reference/maps/wiki/spooky_1.png, reference/maps/spooky_1.png). Spec:
// - Ground: the banks are dark navy turf, darker than the cliffs' lit faces (floor (0.13, 0.16, 0.28)); over it lie low
//   soft tussocks in drifts, not a carpet: flattened faceted lumps 0.9-1.7 m across and 0.14-0.26 m high on a 0.95 m grid,
//   present on about half the cells (two crossing sine swathes), in two tones a shade lighter than the floor, so the wiki
//   shot's pale grass patches between bare dark ground read; nothing stands above ankle height.
// - Trees: three of every five ring positions carry a tree; each is black (0.035, 0.035, 0.055), a squat trunk 1.7 m at
//   the root in three bent sections 5.5-9 m, with 3-4 heavy elbowed limbs; merged with 32-bit indices so the bark material
//   applies to all of them.
// - Cliffs: no columns. A dark skirt wall drops 20 m under the outline; in front of it every 4.2 m of edge carries three
//   stepped tiers of rock, each a faceted boulder or a tilted five-sided block 4-9 m wide and 6.5-12 m high, tops at
//   -0.75..-1.65, -4.4..-7 and -10.5..-13.3 m, standing 0.4-2.1, 2.6-4.3 and 1.1-2.8 m out, turned up to 23 degrees and
//   tipped up to 9, so the face is broken and stepped and the underside ends at uneven depths (-17..-25 m). Stone is a
//   darker navy (0.22, 0.25, 0.4), barely self-lit, so the cliff no longer glows white.
//
// Cliff rebuild (584, replaces 583's three even rock tiers and flattened tussocks; references reference/maps/spooky_1.png for
// the island's build and reference/maps/wiki/spooky_1.png for the turf). Spec, read off the placement view:
// - Each plateau's face is a few big blocks, not a row: about ten along a side, each 7-12 m of edge, 8-14 m high and 6-10 m
//   deep, mostly six-sided blocks a little narrower at the foot (three in ten a faceted boulder), their faces 0.4-2.6 m
//   proud of the grass edge (0.2-1.1 m on the ravine's faces), turned up to 14 degrees, tops 0.2-0.7 m under the turf.
// - On two stations in three of the outer faces a buttress steps out below the block: 4-11 m wide, top 3.4-7.6 m down,
//   2.8-5.8 m proud.
// - Under the outer faces a lower shelf rings the plateau, as the view's broad base tier: flat-topped masses every 11-16 m,
//   tops 10.5-14 m down, 6-9 m thick, standing 7-13 m proud of the outline, two loose boulders 2.4-4.8 m on each.
// - Under each shelf mass hangs a tapering root 5-18 m deep, so the underside ends anywhere between -20 and -40 m.
// - The skirt wall behind them drops to -24 m. The ravine's faces carry blocks only; the descent's recess stays open.
// - Turf: soft blade tufts, not lumps: fans of six thin blades with up-facing normals (the Legacy meadow's tuft), 0.28-0.5 m
//   high and 0.9-1.4 m across on a 0.8 m grid over seven cells in ten, two blue-greys a shade paler than the floor.
// - Fog: three sheets of dim mist (0.1, 0.125, 0.26), no brighter than the turf.
function duskyMeadow(scene: Scene): void {
  const tones = [[0.19, 0.24, 0.4], [0.25, 0.31, 0.5]] as const;
  const matrices: number[][] = [[], []];
  let i = 0;
  for (let x = -52; x <= 52; x += 0.8) for (let z = -42; z <= 39; z += 0.8) {
    i++;
    const px = x + (seeded(i, 301) - 0.5) * 0.7, pz = z + (seeded(i, 302) - 0.5) * 0.7;
    if (!onPlateau(px, pz) || (px > -16 && px < -6 && pz > -26 && pz < 2)) continue;
    const drift = Math.sin(px * 0.21 + pz * 0.09) + Math.sin(pz * 0.27 - px * 0.13 + 1.7);
    if (drift + (seeded(i, 307) - 0.5) * 1.6 < -0.75) continue;
    const w = 0.9 + seeded(i, 304) * 0.5, h = 0.28 + seeded(i, 303) * 0.22;
    matrices[drift + seeded(i, 308) * 0.8 > 0.5 ? 1 : 0].push(...Matrix.Compose(new Vector3(w, h, w), Quaternion.RotationAxis(Vector3.Up(), seeded(i, 306) * 6.28), new Vector3(px, 0.01, pz)).m);
  }
  const positions: number[] = [], indices: number[] = [], normals: number[] = [];
  for (let b = 0; b < 6; b++) {
    const a = b * 1.047 + (b % 2) * 0.4, lean = 0.3 + (b % 3) * 0.2, cx = Math.cos(a), cz = Math.sin(a);
    positions.push(cx * 0.1 - cz * 0.07, 0, cz * 0.1 + cx * 0.07, cx * 0.1 + cz * 0.07, 0, cz * 0.1 - cx * 0.07, cx * (0.1 + lean), 0.7 + (b % 2) * 0.3, cz * (0.1 + lean));
    indices.push(b * 3, b * 3 + 1, b * 3 + 2);
    normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0);
  }
  const fan = new VertexData();
  fan.positions = positions;
  fan.indices = indices;
  fan.normals = normals;
  for (const [t, tone] of tones.entries()) {
    const mat = new StandardMaterial(`spooky1DuskyGrass${t}`, scene);
    mat.diffuseColor.set(tone[0], tone[1], tone[2]);
    mat.emissiveColor.set(tone[0] * 0.25, tone[1] * 0.25, tone[2] * 0.25);
    mat.specularColor = Color3.Black();
    mat.backFaceCulling = false;
    const tuft = new Mesh("spooky1DuskyTufts", scene);
    fan.applyToMesh(tuft);
    tuft.material = mat;
    tuft.receiveShadows = true;
    tuft.isPickable = false;
    tuft.thinInstanceSetBuffer("matrix", new Float32Array(matrices[t]), 16);
  }
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
