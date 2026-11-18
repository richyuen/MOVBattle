// TABS "Pirate" (pirate map): a sandy beach in a turquoise sea ring, a grassy mountain with palms and a waterfall behind it, and two
// galleons moored along the beach's long sides with gangplanks down to the sand (reference/maps/wiki/pirate.png,
// reference/maps/pirate_beach.png; card loop/cards/maps/pirate.md). Built on campaign.pirate (base(); never edit the base, dress its
// build here).
//
// Moored galleons (576, wiki pirate.png: one big galleon lies along each long side of the beach, broadside to it and facing across the
// sand at the other; brown planked hulls with gold bands and a row of gun ports, a tall two-tier stern castle, three masts with yards,
// crow's nests and long white sails furled along the yards, a bowsprit; three or four gangplanks run from each deck down to the sand).
// Spec: the base's two ships at the back edge and their two plank bridges go; galleons 30 m long, 8 m beam, hull 4.4 m (0.8 m of it
// sunk), centred at x 0 and z +-37 along x, bows to +x (the far one) and -x (the near one); stern castle 8 m long in two tiers to
// 3.4 m above the deck; masts 17/20/15 m with two yards each; three gangplanks 1.6 m wide from the deck edge (z +-33) down to the sand
// at z +-27; a row of six cannons on each deck facing the beach. One box collider per hull (outside both armies' zones, |z| <= 29).
import { Color3, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, VertexData, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

const SHIPS = [{ z: 37, bow: 1 }, { z: -37, bow: -1 }];
const LONG = 30, BEAM = 8, HULL = 4.4, SINK = 0.8;

function galleons(scene: Scene, obstacles: Obstacle[]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    hull: mk("pirateGalleonHull", new Color3(0.45, 0.26, 0.13), 0.42),
    dark: mk("pirateGalleonDark", new Color3(0.18, 0.11, 0.07), 0.35),
    deck: mk("pirateGalleonDeck", new Color3(0.72, 0.55, 0.34), 0.42),
    gold: mk("pirateGalleonGold", new Color3(0.95, 0.72, 0.25), 0.5),
    sail: mk("pirateGalleonSail", new Color3(0.96, 0.93, 0.85), 0.55),
    iron: mk("pirateGalleonIron", new Color3(0.2, 0.2, 0.24), 0.35),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { hull: [], dark: [], deck: [], gold: [], sail: [], iron: [] };
  for (const { z: Z, bow } of SHIPS) {
    // u: along the hull toward the bow; v: across, toward the beach (+v points at z 0)
    const toBeach = -Math.sign(Z);
    const at = (u: number, v: number) => [u * bow, Z + v * toBeach] as const;
    const box = (k: keyof typeof mats, l: number, h: number, b: number, u: number, y: number, v: number, yaw = 0) => {
      const m = MeshBuilder.CreateBox("pirateGalleonPart", { width: l, height: h, depth: b }, scene);
      const [x, z] = at(u, v);
      m.position.set(x, y, z);
      m.rotation.y = yaw;
      parts[k].push(m);
      return m;
    };
    const top = HULL - SINK;
    // Hull: a main body, a narrower lower body (the hull rounding in), the bow a diamond prow
    box("hull", LONG * 0.8, HULL, BEAM, -LONG * 0.05, top - HULL / 2, 0);
    box("hull", LONG * 0.7, HULL * 0.5, BEAM * 1.06, -LONG * 0.05, top - HULL * 0.3, 0);
    const prow = BEAM / Math.SQRT2;
    box("hull", prow, HULL * 1.1, prow, LONG * 0.35, top - HULL * 0.45, 0, Math.PI / 4);
    // Gold bands and a row of gun ports along the beach side
    box("gold", LONG * 0.81, 0.35, BEAM * 1.08, -LONG * 0.05, top - 0.25, 0);
    box("gold", LONG * 0.74, 0.25, BEAM * 1.1, -LONG * 0.05, top - 2.1, 0);
    for (let g = 0; g < 7; g++) box("dark", 0.9, 0.8, 0.1, -LONG * 0.36 + g * 3.6, top - 1.2, BEAM / 2 + 0.3);
    box("deck", LONG * 0.78, 0.2, BEAM * 0.9, -LONG * 0.05, top + 0.1, 0);
    for (const s of [-1, 1]) box("hull", LONG * 0.78, 0.9, 0.3, -LONG * 0.05, top + 0.55, s * BEAM * 0.47);
    // Stern castle in two tiers with gold rims and dark windows on its back
    const sternU = -LONG * 0.45 + 4;
    box("hull", 8, 2, BEAM * 1.02, sternU, top + 1, 0);
    box("gold", 8.2, 0.25, BEAM * 1.06, sternU, top + 2.05, 0);
    box("hull", 5.5, 1.4, BEAM * 0.9, sternU - 1, top + 2.75, 0);
    box("gold", 5.7, 0.25, BEAM * 0.94, sternU - 1, top + 3.5, 0);
    for (let w = -1; w <= 1; w++) box("dark", 0.1, 0.9, 1.2, sternU - 4.05, top + 1.1, w * 2.2);
    for (const s of [-1, 1]) {
      const lamp = MeshBuilder.CreateCylinder("pirateGalleonLamp", { diameter: 0.6, height: 1, tessellation: 6 }, scene);
      const [x, z] = at(sternU - 3.8, s * BEAM * 0.4);
      lamp.position.set(x, top + 4.2, z);
      parts.gold.push(lamp);
    }
    // Bowsprit
    const sprit = MeshBuilder.CreateCylinder("pirateGalleonSprit", { height: 9, diameterTop: 0.15, diameterBottom: 0.4, tessellation: 6 }, scene);
    sprit.rotation.z = -bow * (Math.PI / 2 - 0.35);
    const [sx, sz] = at(LONG * 0.5, 0);
    sprit.position.set(sx, top + 2.2, sz);
    parts.dark.push(sprit);
    // Masts with yards, furled sails along each yard and a crow's nest
    for (const [u, tall] of [[LONG * 0.22, 17], [-LONG * 0.03, 20], [-LONG * 0.27, 15]] as const) {
      const mast = MeshBuilder.CreateCylinder("pirateGalleonMast", { height: tall, diameterTop: 0.25, diameterBottom: 0.55, tessellation: 7 }, scene);
      const [mx, mz] = at(u, 0);
      mast.position.set(mx, top + tall / 2, mz);
      parts.dark.push(mast);
      for (const [f, span] of [[0.45, 9.5], [0.75, 7]] as const) {
        const y = top + tall * f;
        box("dark", 0.25, 0.25, span, u, y, 0);
        const roll = MeshBuilder.CreateCylinder("pirateGalleonSail", { height: span * 0.94, diameter: 0.85, tessellation: 7 }, scene);
        roll.rotation.x = Math.PI / 2;
        roll.position.set(mx, y - 0.5, mz);
        parts.sail.push(roll);
      }
      const nest = MeshBuilder.CreateCylinder("pirateGalleonNest", { height: 0.9, diameter: 1.8, tessellation: 8 }, scene);
      nest.position.set(mx, top + tall * 0.88, mz);
      parts.hull.push(nest);
    }
    // Cannons along the beach rail
    for (let c = 0; c < 6; c++) {
      const barrel = MeshBuilder.CreateCylinder("pirateGalleonCannon", { height: 1.8, diameterTop: 0.3, diameterBottom: 0.42, tessellation: 7 }, scene);
      barrel.rotation.x = Math.PI / 2;
      const [cx, cz] = at(-LONG * 0.28 + c * 3.8, BEAM * 0.36);
      barrel.position.set(cx, top + 0.75, cz);
      parts.iron.push(barrel);
    }
    // Gangplanks from the deck edge down to the sand
    for (const u of [-8, 0, 8]) {
      const run = 6.2, drop = top + 0.2;
      const plank = MeshBuilder.CreateBox("pirateGalleonPlank", { width: 1.6, height: 0.18, depth: Math.hypot(run, drop) }, scene);
      plank.rotation.x = toBeach * Math.atan2(drop, run);
      const [px, pz] = at(u, BEAM / 2 + run / 2);
      plank.position.set(px, drop / 2, pz);
      parts.deck.push(plank);
      for (let r = 1; r < 6; r++) {
        const cleat = MeshBuilder.CreateBox("pirateGalleonCleat", { width: 1.6, height: 0.1, depth: 0.15 }, scene);
        const [qx, qz] = at(u, BEAM / 2 + run * r / 6);
        cleat.position.set(qx, drop * (1 - r / 6) + 0.12, qz);
        parts.dark.push(cleat);
      }
    }
    obstacles.push({ type: "box", center: new Vector3(0, 0, Z), halfX: LONG / 2, halfZ: BEAM / 2 + 0.3 });
  }
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `pirateGalleons_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  }
}

// No lagoon (577, pirate_beach.png and the wiki shot: the sand runs unbroken from the middle of the beach to the galleons'
// gangplanks; there is no water band across the field, the turquoise is only the sea round the rim). Spec: the base's two
// lagoon water hazards (boxes at z +-24 across |x| <= 22) go from the hazard list, and their drawn shore and water sheets
// (campaign_hazard_sea_shore / _water at those spots) are hidden, leaving the beach's sand under them.
function drainLagoon(scene: Scene, built: Set<unknown>, result: MapBuildResult): MapBuildResult["hazards"] {
  const lagoon = (z: number) => Math.abs(Math.abs(z) - 24) < 0.5;
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && /^campaign_hazard_sea_(shore|water)$/.test(mesh.name) && lagoon(mesh.position.z)) mesh.setEnabled(false);
  }
  return result.hazards.filter((h) => !(h.kind === "water" && h.shape === "box" && lagoon(h.center.z)));
}

// Sand island (578, pirate_beach.png: the beach is a round sandy disc set in a ring of turquoise shallow sea, its sides a thick
// rounded drum of the same pale sand tapering underneath, no dark stalactite crags). Spec: the base underside (islandUnder,
// islandShelf, islandCliff) hidden; a turquoise (0.2, 0.8, 0.75) shallow-sea ring, an oval 62 x 56 m half sizes, its top just
// under the beach; a sand drum (0.84, 0.68, 0.42) oval 64 x 58 at the top, 6 m deep, tapering to 0.8 of that, then a faceted sand
// belly 14 m deep down to 0.35; 28 sides, flat shaded, faces self-lit 0.6 so the drum reads pale from the island camera.
function sandIsland(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) if (built.has(mesh) && /^(islandUnder|islandShelf|islandCliff)/.test(mesh.name)) mesh.setEnabled(false);
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const oval = (name: string, top: number, bottom: number, h: number, y: number, sx: number, sz: number, mat: StandardMaterial) => {
    const c = MeshBuilder.CreateCylinder(name, { height: h, diameterTop: top, diameterBottom: bottom, tessellation: 28 }, scene);
    c.scaling.set(sx, 1, sz);
    c.position.y = y - h / 2;
    c.convertToFlatShadedMesh();
    c.material = mat;
    c.receiveShadows = true;
    c.isPickable = false;
    c.applyFog = false;
    return c;
  };
  oval("pirateShallowSea", 2, 2, 0.3, -0.04, 62, 56, mk("pirateShallowSea", new Color3(0.2, 0.8, 0.75), 0.45));
  const sand = mk("pirateSandDrum", new Color3(0.72, 0.52, 0.28), 0.4);
  oval("pirateSandDrum", 2, 1.6, 6, -0.3, 64, 58, sand);
  oval("pirateSandBelly", 1.6, 0.56, 14, -6.3, 64, 58, sand);
}

export function buildPirate(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const hazards = drainLagoon(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))), result);
  // The base's ships (roots with their parts as children) and the two plank bridges between them
  const bridges = [[-6, 20], [6, 20]];
  const gone: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (prior.has(mesh) || mesh.parent) continue;
    const p = mesh.position;
    const bridge = mesh.name === "Pirate Cove_box" && bridges.some(([x, z]) => Math.hypot(p.x - x, p.z - z) < 0.5);
    // and any palm or rock standing where a galleon now lies
    const underShip = /^(trunk|Pirate Cove_)/.test(mesh.name) && SHIPS.some(({ z }) => Math.abs(p.x) < LONG / 2 + 2 && Math.abs(p.z - z) < BEAM / 2 + 7);
    if (mesh.name === "Pirate Cove_ship" || bridge || underShip) {
      gone.push(p.clone());
      mesh.setEnabled(false);
    }
  }
  const obstacles = result.obstacles.filter(({ center }) => !gone.some((p) => Math.hypot(center.x - p.x, center.z - p.z) < 0.6));
  galleons(scene, obstacles);
  sandIsland(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));
  hourglassBeach(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));
  bellMountain(scene, obstacles);
  return { ...result, obstacles, hazards };
}

// Pirate wiki: the broad foreground beach pinches before widening beneath the
// mountain. The ships lie along z +/-37; keep all authored armies on dry sand.
function hourglassBeach(scene: Scene, built: Set<unknown>): void {
  const ground = scene.meshes.find(m => built.has(m) && m.name === "ground");
  const sand = ground?.material ?? scene.getMaterialByName("pirateSandDrum");
  for(const m of scene.meshes) if(built.has(m) && /^(ground$|centerGrass$|pirateSandDrum$|pirateSandBelly$|campaign_zone_)/.test(m.name)) m.setEnabled(false);
  const outline: Array<[number,number]> = [];
  const stations = [[-58,7],[-51,24],[-38,32],[-23,30],[-7,25],[9,21],[23,24],[38,31],[49,28],[56,10]];
  for(const [x,w] of stations) outline.push([x,-w]);
  for(const [x,w] of [...stations].reverse()) outline.push([x,w]);
  const positions = [0,0.1,0], indices: number[] = [];
  for(const [x,z] of outline) positions.push(x,0.1,z);
  const n=outline.length;
  for(let i=0;i<n;i++) indices.push(0,1+i,1+(i+1)%n);
  // Two tapering shore courses follow the same outline rather than leaving the
  // former oval sand drum projecting past the new waterline.
  for(const [scale,y] of [[0.9,-6],[0.45,-18]]) for(const [x,z] of outline) positions.push(x*scale,y,z*scale);
  for(let ring=0;ring<2;ring++) for(let i=0;i<n;i++) {
    const a=1+ring*n+i,b=1+ring*n+(i+1)%n,c=a+n,d=b+n;
    indices.push(a,c,b,b,c,d);
  }
  const normals: number[]=[];VertexData.ComputeNormals(positions,indices,normals);
  const data=new VertexData();data.positions=positions;data.indices=indices;data.normals=normals;
  const beach=new Mesh("pirateHourglassBeach",scene);data.applyToMesh(beach);beach.material=sand;
  beach.convertToFlatShadedMesh();beach.receiveShadows=true;
}

// Bell mountain (583, wiki pirate.png and card Overview: at the narrow end of the beach a grassy rock mountain rises out
// of the shallows, a heap of big tan boulders with green ledges, palms growing from the ledges and the foot, a white
// waterfall down its beach face into a foam pool, and a huge wooden bell hanging in a timber frame on its summit). Spec:
// centre (60, 0), past the beach's +x tip; four tiers of faceted boulders round a core, ring radius 11 / 8 / 5.5 / 3 m at
// y 0 / 5 / 10.5 / 15, to about 19 m; flattened green caps on the three lower tiers; seven palms 4.5-6.5 m (leaning
// four-piece trunks, seven drooping fronds) on the ledges and at the foot; the fall 1.8 m wide in two leaning runs from
// y 13 down the -x face; the bell 3.2 m across under a 5 m A-frame. One cylinder collider, radius 10.5 (the stage armies
// stand at x <= 41.4).
function bellMountain(scene: Scene, obstacles: Obstacle[]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    rock: mk("pirateMountainRock", new Color3(0.5, 0.43, 0.32), 0.35),
    grass: mk("pirateMountainGrass", new Color3(0.3, 0.5, 0.13), 0.35),
    trunk: mk("pirateMountainPalmTrunk", new Color3(0.42, 0.3, 0.18), 0.35),
    frond: mk("pirateMountainPalmFrond", new Color3(0.14, 0.42, 0.11), 0.35),
    water: mk("pirateMountainFall", new Color3(0.78, 0.94, 0.98), 0.7),
    bell: mk("pirateMountainBell", new Color3(0.3, 0.19, 0.1), 0.35),
    gold: mk("pirateMountainBellRim", new Color3(0.9, 0.68, 0.22), 0.45),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { rock: [], grass: [], trunk: [], frond: [], water: [], bell: [], gold: [] };
  const rnd = (i: number, s: number) => {
    const raw = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
    return raw - Math.floor(raw);
  };
  const CX = 60, CZ = 0;
  const lump = (key: keyof typeof mats, sx: number, sy: number, sz: number, x: number, y: number, z: number, i: number) => {
    const m = MeshBuilder.CreateIcoSphere("pirateMountainPart", { radius: 0.5, subdivisions: 1 }, scene);
    m.scaling.set(sx, sy, sz);
    m.rotation.set(rnd(i, 5) * 0.5, rnd(i, 6) * 6.28, rnd(i, 7) * 0.5);
    m.position.set(x, y, z);
    parts[key].push(m);
  };
  let k = 0;
  const tiers = [[11, 6.5, 0, 9], [8, 7, 5, 7], [5.5, 6.5, 10.5, 5], [3, 5, 15, 3]];
  tiers.forEach(([ring, size, y, count], t) => {
    lump("rock", ring * 1.5, size * 1.5, ring * 1.5, CX, y + size * 0.4, CZ, ++k);
    for (let j = 0; j < count; j++) {
      const a = (j / count) * 6.28 + t * 0.7, r = ring * (0.55 + rnd(++k, 1) * 0.35);
      lump("rock", size * (1.1 + rnd(k, 2) * 0.5), size * (1 + rnd(k, 3) * 0.6), size * (1 + rnd(k, 4) * 0.4), CX + Math.cos(a) * r, y + size * 0.35, CZ + Math.sin(a) * r, k);
      if (t < 3 && j % 2 === 0) lump("grass", size * 0.85, 0.7, size * 0.75, CX + Math.cos(a + 0.3) * r * 1.05, y + size * 0.92, CZ + Math.sin(a + 0.3) * r * 1.05, k + 40);
    }
  });
  lump("grass", 4.2, 0.8, 4.2, CX, 18.4, CZ, 90);
  // Palms on the ledges and at the foot
  const up = Vector3.Up();
  const palm = (x: number, y: number, z: number, tall: number, i: number) => {
    const lean = rnd(i, 11) * 6.28;
    let at = new Vector3(x, y, z);
    for (let s = 0; s < 4; s++) {
      const tilt = 0.08 + s * 0.11;
      const dir = new Vector3(Math.sin(tilt) * Math.cos(lean), Math.cos(tilt), Math.sin(tilt) * Math.sin(lean));
      const seg = MeshBuilder.CreateCylinder("pirateMountainPalm", { height: tall / 4 + 0.1, diameterBottom: 0.5 - s * 0.07, diameterTop: 0.43 - s * 0.07, tessellation: 6 }, scene);
      seg.rotationQuaternion = Quaternion.FromUnitVectorsToRef(up, dir, new Quaternion());
      seg.position = at.add(dir.scale(tall / 8));
      parts.trunk.push(seg);
      at = at.add(dir.scale(tall / 4));
    }
    for (let f = 0; f < 7; f++) {
      const fa = (f / 7) * 6.28 + lean;
      const dir = new Vector3(Math.cos(fa), -0.32 - (f % 2) * 0.2, Math.sin(fa)).normalize();
      const frond = MeshBuilder.CreateCylinder("pirateMountainFrond", { height: 3, diameterBottom: 1.1, diameterTop: 0, tessellation: 4 }, scene);
      frond.scaling.z = 0.22;
      frond.rotationQuaternion = Quaternion.FromUnitVectorsToRef(up, dir, new Quaternion());
      frond.position = at.add(dir.scale(1.5));
      parts.frond.push(frond);
    }
  };
  [[-10.5, 0, 6, 6], [-9.5, 0, -7.5, 5.2], [-3, 0, 12, 6.5], [-6.5, 7.5, -4, 5], [-3.5, 8, 7, 4.8], [4, 9, -6.5, 5.5], [-2.5, 14, -2.5, 4.5]]
    .forEach(([dx, y, dz, tall], i) => palm(CX + dx, y, CZ + dz, tall, i + 1));
  // The fall down the beach face, and its foam
  for (const [x, y, len, tilt] of [[-5.4, 10, 7, -0.5], [-8.3, 3.6, 8, -0.22]]) {
    const run = MeshBuilder.CreateBox("pirateMountainFall", { width: 0.35, height: len, depth: 1.8 }, scene);
    run.rotation.z = tilt;
    run.position.set(CX + x, y, CZ + 1.5);
    parts.water.push(run);
  }
  lump("water", 4.5, 0.5, 5, CX - 10, 0.15, CZ + 1.5, 95);
  // The bell in its frame on the summit
  for (const s of [-1, 1]) {
    const post = MeshBuilder.CreateCylinder("pirateMountainBellPost", { height: 5.6, diameter: 0.4, tessellation: 6 }, scene);
    post.rotation.x = s * 0.3;
    post.position.set(CX - 0.5, 20.6, CZ + s * 1.9);
    parts.bell.push(post);
  }
  const beam = MeshBuilder.CreateBox("pirateMountainBellBeam", { width: 0.45, height: 0.45, depth: 3.6 }, scene);
  beam.position.set(CX - 0.5, 23.2, CZ);
  parts.bell.push(beam);
  const bell = MeshBuilder.CreateCylinder("pirateMountainBell", { height: 2.8, diameterTop: 1.3, diameterBottom: 3.2, tessellation: 10 }, scene);
  bell.position.set(CX - 0.5, 21.2, CZ);
  parts.bell.push(bell);
  const crown = MeshBuilder.CreateSphere("pirateMountainBellCrown", { diameter: 1.4, segments: 6 }, scene);
  crown.position.set(CX - 0.5, 22.6, CZ);
  parts.bell.push(crown);
  const rim = MeshBuilder.CreateCylinder("pirateMountainBellRim", { height: 0.3, diameter: 3.45, tessellation: 10 }, scene);
  rim.position.set(CX - 0.5, 19.85, CZ);
  parts.gold.push(rim);
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true, true);
    if (!merged) continue;
    merged.name = `pirateMountain_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  }
  obstacles.push({ type: "cylinder", center: new Vector3(CX, 0, CZ), radius: 10.5 });
}
