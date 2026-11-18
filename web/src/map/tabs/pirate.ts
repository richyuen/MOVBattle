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
import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, VertexData, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

const SHIPS = [{ z: 37, bow: 1 }, { z: -37, bow: -1 }];
const LONG = 30, BEAM = 8, HULL = 4.4, SINK = 0.8;

// Curved hull (593, blocker a2; wiki pirate.png: the galleon hull is one smooth dark planked shell, its sides rounding in to the
// keel, its bow drawing to a point, its stern raked under a high transom; dark chocolate brown with gold bands at the sheer and
// along the wale). Spec: a lofted shell from the stern transom (u -13) to the bow (u 15), 29 stations, each section a rounded U
// (superellipse, exponent 2.6) from the bulwark top (0.9 m over the deck) down to the keel and back; half beam 4 m amidships,
// 0.9 of it at the transom, drawing in on a quarter ellipse from u 3 to the stem at u 15; depth 4.4 m, the keel rising forward
// of u 3 to half that at the stem and raked up aft of u -11; the transom closed by a fan; the deck a plate following the
// shell at 0.97 of its beam. Strakes (dark, every 0.6 m), the sheer rail and the wale (gold) run as bands along the shell,
// gun ports sit on it. Hull (.24,.11,.04) self .14 (palette: orange x .25 reads dark chocolate), both faces lit.
const HULL_U0 = -13, HULL_U1 = 15, HULL_PW = 2 / 2.6, BULWARK = 0.9;
const hullHalfBeam = (u: number) =>
  u <= 3 ? (BEAM / 2) * (1 - 0.1 * ((3 - u) / 16) ** 2) : (BEAM / 2) * Math.sqrt(Math.max(0.003, 1 - ((u - 3) / 12) ** 2));
const hullDepth = (u: number) => {
  let d = HULL;
  if (u > 3) d *= 0.5 + 0.5 * Math.sqrt(Math.max(0, 1 - ((u - 3) / 12) ** 2));
  if (u < -11) d *= 1 - (0.45 * (-11 - u)) / 2;
  return d;
};
/** The shell's half-width at height y (deck top `top`) at station u. */
function hullV(u: number, y: number, top: number): number {
  const f = Math.min(1, Math.max(0, (top - y) / hullDepth(u)));
  const s = f ** (1 / HULL_PW), c = Math.sqrt(Math.max(0, 1 - s * s));
  return hullHalfBeam(u) * c ** HULL_PW;
}

function loftHull(scene: Scene, parts: Record<string, Mesh[]>, at: (u: number, v: number) => readonly [number, number], top: number): void {
  const NS = 28, NP = 14;
  const stations = Array.from({ length: NS + 1 }, (_, i) => HULL_U0 + ((HULL_U1 - HULL_U0) * i) / NS);
  const sheet = (rows: number[][][], closeFan?: number[]) => {
    const pos: number[] = [], idx: number[] = [];
    const per = rows[0].length;
    for (const row of rows) for (const [u, y, v] of row) { const [x, z] = at(u, v); pos.push(x, y, z); }
    for (let i = 0; i < rows.length - 1; i++) for (let j = 0; j < per - 1; j++) {
      const a = i * per + j, b = a + per;
      idx.push(a, b, b + 1, a, b + 1, a + 1);
    }
    if (closeFan) {
      const [u, y, v] = closeFan, [x, z] = at(u, v), c = pos.length / 3;
      pos.push(x, y, z);
      for (let j = 0; j < per - 1; j++) idx.push(c, j, j + 1);
    }
    const m = new Mesh("pirateGalleonShell", scene);
    const vd = new VertexData();
    vd.positions = pos;
    vd.indices = idx;
    const normals: number[] = [];
    VertexData.ComputeNormals(pos, idx, normals);
    vd.normals = normals;
    vd.applyToMesh(m);
    return m;
  };
  // the shell: bulwark top, round the U, bulwark top
  const section = (u: number) => {
    const b = hullHalfBeam(u), d = hullDepth(u), pts: number[][] = [[u, top + BULWARK, b]];
    for (let j = 0; j <= NP; j++) {
      const phi = (Math.PI * j) / NP, c = Math.cos(phi), s = Math.sin(phi);
      pts.push([u, top - d * Math.abs(s) ** HULL_PW, b * Math.sign(c) * Math.abs(c) ** HULL_PW]);
    }
    pts.push([u, top + BULWARK, -b]);
    return pts;
  };
  parts.hull.push(sheet(stations.map(section), [HULL_U0, top - hullDepth(HULL_U0) / 2, 0]));
  // the deck plate inside the bulwarks
  parts.deck.push(sheet(stations.map((u) => [[u, top + 0.2, -0.97 * hullHalfBeam(u)], [u, top + 0.2, 0.97 * hullHalfBeam(u)]])));
  // bands along the shell at a height, both sides, where the hull is deep enough
  const band = (k: string, y: number, h: number, out: number) => {
    const live = stations.filter((u) => top - y < hullDepth(u) * 0.92);
    for (const side of [-1, 1]) {
      parts[k].push(sheet(live.map((u) => {
        const v = side * (hullV(u, y, top) + out);
        return [[u, y - h / 2, v], [u, y + h / 2, v]];
      })));
    }
  };
  for (let y = top - 0.6; y > top - HULL + 0.9; y -= 0.6) band("dark", y, 0.07, 0.03);
  band("gold", top + BULWARK + 0.1, 0.28, 0.06);
  band("gold", top - 1.9, 0.22, 0.05);
}

function galleons(scene: Scene, obstacles: Obstacle[]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    // (593) the lofted shell and its bands are open sheets: light both faces
    m.backFaceCulling = false;
    m.twoSidedLighting = true;
    return m;
  };
  const mats = {
    hull: mk("pirateGalleonHull", new Color3(0.24, 0.11, 0.04), 0.14),
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
    // A rod between two world points (rigging, shrouds)
    const rod = (k: keyof typeof mats, a: Vector3, b: Vector3, d: number) => {
      const span = b.subtract(a);
      const c = MeshBuilder.CreateCylinder("pirateGalleonRod", { height: span.length(), diameter: d, tessellation: 4 }, scene);
      c.rotationQuaternion = Quaternion.Identity();
      Quaternion.FromUnitVectorsToRef(Vector3.Up(), span.normalize(), c.rotationQuaternion);
      c.position = a.add(span.scale(0.5));
      parts[k].push(c);
    };
    const world = (u: number, y: number, v: number) => { const [x, z] = at(u, v); return new Vector3(x, y, z); };
    // Galleon rebuild (586, wiki pirate.png: deep dark-brown planked hulls that round in toward the keel, gold rails along the
    // sheer, a raised forecastle, a tall stern castle in three tiers with rows of gold-framed stern windows, three tall masts
    // with shrouds, three yards each and long white sails furled along every yard, tied with dark gaskets). Spec: the hull in
    // four stacked courses narrowing from the full beam at the deck to 0.62 of it at the keel; dark strakes every 0.6 m on
    // both sides; gold rails only along the sheer edges (no full-width slabs); forecastle 6 m long, 1.4 m high at the bow;
    // stern castle tiers 8/6/4.2 m long rising 2.2/1.8/1.4 m, gold edge rails, four then three gold-framed windows on the stern
    // face; masts 19/23/17 m, yards at 0.4/0.62/0.82 of the height spanning 13/10.5/7.5 m, furled rolls 1.15 m thick with four
    // gaskets; three shrouds a side per mast from the deck edge to 0.8 of its height. Deck, cannons, gangplanks and the hull's
    // collider are as before.
    loftHull(scene, parts, at, top);
    for (let g = 0; g < 7; g++) {
      const u = -LONG * 0.36 + g * 3.6;
      box("dark", 0.9, 0.8, 0.1, u, top - 1.2, hullV(u, top - 1.2, top) + 0.04);
    }
    // Forecastle at the bow, inside the narrowing hull
    const foreU = 5.5;
    box("hull", 5, 1.4, 2 * hullHalfBeam(8) - 0.1, foreU, top + 0.7, 0);
    for (const s of [-1, 1]) box("gold", 5.1, 0.2, 0.14, foreU, top + 1.45, s * (hullHalfBeam(8) - 0.05));
    // Stern castle in three tiers with gold edge rails and gold-framed windows on its stern face
    const sternU = -LONG * 0.45 + 4;
    let base = top;
    for (const [len, rise, wins] of [[8, 2.2, 4], [6, 1.8, 3], [4.2, 1.4, 0]] as const) {
      const cu = sternU - 4 + len / 2, beam = BEAM * (1.02 - (8 - len) * 0.025);
      box("hull", len, rise, beam, cu, base + rise / 2, 0);
      for (const s of [-1, 1]) box("gold", len + 0.1, 0.2, 0.14, cu, base + rise + 0.05, s * beam / 2);
      box("gold", 0.14, 0.2, beam, sternU - 4.03, base + rise + 0.05, 0);
      for (let w = 0; w < wins; w++) {
        const v = (w + 0.5 - wins / 2) * (beam / wins);
        box("gold", 0.08, rise * 0.62, 1.25, sternU - 4.04, base + rise * 0.5, v);
        box("dark", 0.1, rise * 0.48, 0.95, sternU - 4.07, base + rise * 0.5, v);
      }
      base += rise;
    }
    for (const s of [-1, 1]) {
      const lamp = MeshBuilder.CreateCylinder("pirateGalleonLamp", { diameter: 0.6, height: 1, tessellation: 6 }, scene);
      const [x, z] = at(sternU - 3.8, s * BEAM * 0.4);
      lamp.position.set(x, base + 0.6, z);
      parts.gold.push(lamp);
    }
    // Bowsprit
    const sprit = MeshBuilder.CreateCylinder("pirateGalleonSprit", { height: 9, diameterTop: 0.15, diameterBottom: 0.4, tessellation: 6 }, scene);
    sprit.rotation.z = -bow * (Math.PI / 2 - 0.35);
    const [sx, sz] = at(LONG * 0.5, 0);
    sprit.position.set(sx, top + 2.2, sz);
    parts.dark.push(sprit);
    // Masts with yards, furled sails along each yard and a crow's nest
    for (const [u, tall] of [[LONG * 0.22, 19], [-LONG * 0.03, 23], [-LONG * 0.27, 17]] as const) {
      const mast = MeshBuilder.CreateCylinder("pirateGalleonMast", { height: tall, diameterTop: 0.28, diameterBottom: 0.6, tessellation: 7 }, scene);
      const [mx, mz] = at(u, 0);
      mast.position.set(mx, top + tall / 2, mz);
      parts.dark.push(mast);
      for (const [f, span] of [[0.4, 13], [0.62, 10.5], [0.82, 7.5]] as const) {
        const y = top + tall * f;
        box("dark", 0.28, 0.28, span, u, y, 0);
        const roll = MeshBuilder.CreateCylinder("pirateGalleonSail", { height: span * 0.92, diameter: 1.15, tessellation: 8 }, scene);
        roll.rotation.x = Math.PI / 2;
        roll.position.set(mx, y - 0.62, mz);
        parts.sail.push(roll);
        for (let g = 0; g < 4; g++) box("dark", 1.25, 1.25, 0.18, u, y - 0.62, (g - 1.5) * span * 0.24);
      }
      for (const s of [-1, 1]) for (const du of [-1.4, 0, 1.4]) rod("dark", world(u + du, top + 0.9, s * BEAM * 0.47), world(u, top + tall * 0.8, 0), 0.07);
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
    // Gangplanks (585, wiki pirate.png: three broad planked ramps from each deck's rail across the shallows onto the dry sand,
    // fanned a little): 3.2 m wide, 12.5 m run from the rail (|z| 33) to |z| ~20.5, each turned up to 0.18 rad off square, dark
    // cleats every metre and a dark rail beam along both edges.
    for (const [u, fan] of [[-9, -0.18], [0, 0.04], [9, 0.16]] as const) {
      const run = 12.5, drop = top + 0.6, len = Math.hypot(run, drop), slope = Math.atan2(drop, run);
      const [rx, rz] = at(u, hullHalfBeam(u));
      const yaw = Math.atan2(Math.sin(fan) * bow, toBeach * Math.cos(fan));
      const piece = (k: keyof typeof mats, w: number, h: number, along: number, across: number, lift: number) => {
        const m = MeshBuilder.CreateBox("pirateGalleonPlank", { width: w, height: h, depth: along === 0 ? len : 0.22 }, scene);
        m.rotation.set(slope, yaw, 0);
        const d = along === 0 ? len / 2 : along;
        // local (across, y, forward) turned by the yaw onto the world
        const fwd = Math.cos(slope) * d;
        m.position.set(rx + Math.cos(yaw) * across + Math.sin(yaw) * fwd, drop - 0.05 - Math.sin(slope) * d + lift, rz - Math.sin(yaw) * across + Math.cos(yaw) * fwd);
        parts[k].push(m);
      };
      piece("deck", 3.2, 0.22, 0, 0, 0);
      for (const s of [-1, 1]) piece("dark", 0.22, 0.3, 0, s * 1.6, 0.12);
      for (let r = 1; r < Math.floor(len); r++) piece("dark", 3.1, 0.1, r, 0, 0.14);
    }
    // Standable deck (587): the hull's one box collider becomes rails round the deck: the seaward side, both ends, and the
    // beach side broken by the three gangplank mouths (u -9, 0, 9, 3.6 m wide), so units walk up a plank onto the deck.
    const rail = (u0: number, u1: number, v: number, halfV: number) => {
      const [cx, cz] = at((u0 + u1) / 2, v);
      obstacles.push({ type: "box", center: new Vector3(cx, 0, cz), halfX: Math.abs(u1 - u0) / 2, halfZ: halfV });
    };
    rail(-15, 15, -BEAM / 2 - 0.1, 0.4);
    for (const s of [-1, 1]) {
      const [ex, ez] = at(s * 15, 0);
      obstacles.push({ type: "box", center: new Vector3(ex, 0, ez), halfX: 0.5, halfZ: BEAM / 2 + 0.5 });
    }
    for (const [u0, u1] of [[-15, -10.8], [-7.2, -1.8], [1.8, 7.2], [10.8, 15]]) rail(u0, u1, BEAM / 2 + 0.1, 0.4);
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
    // (586.8b) dark solids stay in the glow pass so they occlude the glow behind them (excluded, the near hull wore the
    // sea's glow as a pale veil); only the bright gold and sails leave it
    if (key === "gold" || key === "sail") glow?.addExcludedMesh(merged);
  }
}

// Deck heights (587, card Overview and reference/stages/pirate.x_marks_the_spot.png: the galleon decks are standable fighting
// ground with their cannon batteries). Spec: a unit inside a galleon's rails (|x| <= 14.6, within 3.9 m of its keel line) is
// drawn on the deck (y 3.6); on a gangplank (within 1.6 m of its centre line, 0..12.5 m from the rail toward the beach) it
// is drawn on the plank, falling from 4.15 m at the rail to the sand. The sim stays flat (terrain.ts).
function deckHeight(x: number, z: number): number {
  const top = HULL - SINK;
  let h = 0;
  for (const { z: Z, bow } of SHIPS) {
    const toBeach = -Math.sign(Z);
    const v = (z - Z) * toBeach;
    if (Math.abs(x) <= 14.6 && Math.abs(v) <= BEAM / 2 - 0.1) return top;
    for (const [u, fan] of [[-9, -0.18], [0, 0.04], [9, 0.16]] as const) {
      const yaw = Math.atan2(Math.sin(fan) * bow, toBeach * Math.cos(fan));
      const rx = u * bow, rz = Z + (BEAM / 2) * toBeach;
      const dx = x - rx, dz = z - rz;
      const d = dx * Math.sin(yaw) + dz * Math.cos(yaw);
      const a = dx * Math.cos(yaw) - dz * Math.sin(yaw);
      if (Math.abs(a) <= 1.6 && d >= -0.1 && d <= 12.5) h = Math.max(h, (top + 0.55) * (1 - Math.max(0, d) / 12.5));
    }
  }
  return h;
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
  const restoreSky = tropicSky(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));

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
  hourglassBeach(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))), obstacles);
  bellMountain(scene, obstacles);
  openShore(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));
  const baseHeight = result.height;
  const height = (x: number, z: number) => Math.max(baseHeight?.(x, z) ?? 0, deckHeight(x, z));
  return { ...result, obstacles, hazards, height, dispose: () => { restoreSky(); result.dispose?.(); } };
}

// Tropic sky (585, pirate_beach.png and the wiki shot: the island floats in a bright sky-blue haze with soft white clouds, no
// mountain range). Spec: the base's mountain* range hidden; the shared sky dome off and in its place a fog-free unlit
// backdrop sphere in light sky blue (0.55, 0.84, 0.93), clear and fog colour to match; clouds stay; all put back on dispose.
function tropicSky(scene: Scene, built: Set<unknown>): () => void {
  const clear = scene.clearColor.clone(), fog = scene.fogColor.clone();
  for (const mesh of scene.meshes) if (built.has(mesh) && mesh.name.startsWith("mountain")) mesh.setEnabled(false);
  const inherited = scene.getMeshByName("skyDome"), enabled = inherited?.isEnabled();
  inherited?.setEnabled(false);
  const backdrop = MeshBuilder.CreateSphere("pirateTropicSky", { diameter: 1800, segments: 16, sideOrientation: Mesh.BACKSIDE }, scene);
  const material = new StandardMaterial("pirateTropicSky", scene);
  material.disableLighting = true;
  material.diffuseColor = Color3.Black();
  material.emissiveColor.set(0.55, 0.84, 0.93);
  material.fogEnabled = false;
  backdrop.material = material;
  backdrop.infiniteDistance = true;
  backdrop.applyFog = false;
  backdrop.isPickable = false;
  scene.getGlowLayerByName("glow")?.addExcludedMesh(backdrop);
  scene.clearColor.set(0.5, 0.8, 0.9, 1);
  scene.fogColor.set(0.6, 0.84, 0.92);
  return () => { inherited?.setEnabled(enabled ?? true); scene.clearColor.copyFrom(clear); scene.fogColor.copyFrom(fog); };
}

// Open shore (585, pirate_beach.png and the wiki shot: the beach runs straight into the shallows, fringed only by palms,
// bushes and a few crates; no wall of grey stones). The grey chain along the front and back shores is the base's haze
// treeline (merged "hazeTreeline" ball crowns at |z| 37.5-40.5, no colliders): hidden whole. In its place a few washed-up
// crates and barrels stand by the waterline at the near shore's open stretches (drawn only, |x| 20..34, |z| 27..31).
function openShore(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) if (built.has(mesh) && mesh.name === "hazeTreeline") mesh.setEnabled(false);
  const wood = new StandardMaterial("pirateShoreCrate", scene);
  wood.diffuseColor = new Color3(0.42, 0.27, 0.14);
  wood.emissiveColor = new Color3(0.13, 0.08, 0.04);
  wood.specularColor = Color3.Black();
  const parts: Mesh[] = [];
  for (const [x, z, s, kind] of [[-31, -29, 1.1, 0], [-29.4, -29.8, 0.8, 1], [24, -28, 1, 0], [33, 29, 1.2, 0], [31.5, 30.2, 0.8, 1], [-24, 28.5, 0.9, 0]] as const) {
    const m = kind === 0
      ? MeshBuilder.CreateBox("pirateShoreCrate", { size: s }, scene)
      : MeshBuilder.CreateCylinder("pirateShoreCrate", { height: s * 1.2, diameter: s * 0.9, tessellation: 9 }, scene);
    m.position.set(x, kind === 0 ? s / 2 : s * 0.6, z);
    m.rotation.y = x * 0.37;
    parts.push(m);
  }
  const merged = Mesh.MergeMeshes(parts, true);
  if (!merged) return;
  merged.name = "pirateShoreCrates";
  merged.convertToFlatShadedMesh();
  merged.material = wood;
  merged.receiveShadows = true;
  merged.isPickable = false;
}

// Pirate wiki: the broad foreground beach pinches before widening beneath the
// mountain. The ships lie along z +/-37; keep all authored armies on dry sand.
// Bare outline (587, blocker b3: the hourglass still read as a broad oval with a pale rectangle on it). The base's own sand
// oval (sandSpit, sandWet, seaShore, 57 x 52 m) lay over the hourglass beach at the same height, and its sand-coloured field
// blades (fieldBlades_*, |x| < 50, |z| < 44) drew a pale rectangle over the middle; the base waterfall (Pirate Cove_waterfall,
// a translucent blue sheet at x 58) floated off the right rim. Spec: all of them hidden, so the hourglass (waist 21 m at x 9,
// 32 m at the back flanks) is the only sand and the turquoise shallows show round its waist; every base palm, bush or prop
// root left standing off the new sand (|z| past the outline's half width + 1 m) goes with its collider.
function hourglassBeach(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): void {
  const ground = scene.meshes.find(m => built.has(m) && m.name === "ground");
  const sand = ground?.material ?? scene.getMaterialByName("pirateSandDrum");
  for(const m of scene.meshes) if(built.has(m) && /^(ground$|centerGrass$|pirateSandDrum$|pirateSandBelly$|campaign_zone_|sandSpit$|sandWet$|seaShore$|fieldBlades_|grassTuft|Pirate Cove_waterfall$)/.test(m.name)) m.setEnabled(false);
  const outline: Array<[number,number]> = [];
  // Spit taper (592, blocker b3; wiki pirate.png: the sand is a spit, broad in the foreground and narrowing steadily toward the
  // back rock, its tip a rounded point in the shallows, not a blunt end). Spec: the -x end closes to a rounded point (half 14
  // at x -57, 3 at x -61); past the waist the +x half no longer swells again but narrows from 24 m at x 23 through 20 at x 38
  // (still dry for every stage army: they stand stands at x 29..41.4, |z| <= 9.9) to 12 at x 50 and a 2 m point at x 61.
  const stations = [[-61,3],[-57,14],[-51,24],[-38,32],[-23,30],[-7,25],[9,21],[23,24],[38,20],[50,12],[56,7],[61,2]];
  const halfAt = (x: number) => {
    for (let i = 0; i < stations.length - 1; i++) {
      const [xa, wa] = stations[i], [xb, wb] = stations[i + 1];
      if (x >= xa && x <= xb) return wa + (wb - wa) * (x - xa) / (xb - xa);
    }
    return 0;
  };
  for (const m of scene.meshes) {
    if (!built.has(m) || m.parent || !m.isEnabled() || !/^(trunk$|bush$|Pirate Cove_)/.test(m.name)) continue;
    const { x, z } = m.position;
    if (Math.abs(z) <= halfAt(x) + 1) continue;
    m.setEnabled(false);
    for (let o = obstacles.length - 1; o >= 0; o--) {
      if (Math.hypot(obstacles[o].center.x - x, obstacles[o].center.z - z) < 0.6) obstacles.splice(o, 1);
    }
  }
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
  goldenSand(scene, beach, stations);
}

// Golden sand (586, wiki pirate.png: the beach is a warm golden yellow sand, not pale pink-white, combed by long wavy
// ripple lines running across it). Spec: the beach and its shore courses take their own lit sand (diffuse (0.8, 0.6, 0.3),
// warm self-light (0.3, 0.21, 0.09)), out of the glow so it does not bloom; about 900 ripple strokes, each a zig-zag of two
// 1.6-2.6 m strips 0.22 m wide and 1.5 cm proud, a shade darker and browner (0.62, 0.44, 0.2), laid across the beach (along
// z) in lines about 1.6 m apart along x, inside the hourglass outline less 1.5 m; thin instances receiving shadows.
function goldenSand(scene: Scene, beach: Mesh, stations: number[][]): void {
  const glow = scene.getGlowLayerByName("glow");
  const mk = (name: string, d: Color3, self: Color3) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = d;
    m.emissiveColor = self;
    m.specularColor = Color3.Black();
    return m;
  };
  // (586.5b) the first gold read pale cream under ACES: a deeper, browner gold with less blue in the self-light
  beach.material = mk("pirateGoldenSand", new Color3(0.82, 0.56, 0.2), new Color3(0.3, 0.18, 0.04));
  glow?.addExcludedMesh(beach);
  const half = (x: number) => {
    for (let i = 0; i < stations.length - 1; i++) {
      const [xa, wa] = stations[i], [xb, wb] = stations[i + 1];
      if (x >= xa && x <= xb) return wa + (wb - wa) * (x - xa) / (xb - xa);
    }
    return 0;
  };
  const ripple = MeshBuilder.CreateBox("pirateSandRipple", { width: 0.22, height: 0.03, depth: 1 }, scene);
  ripple.material = mk("pirateSandRipple", new Color3(0.62, 0.44, 0.2), new Color3(0.2, 0.13, 0.05));
  ripple.isPickable = false;
  ripple.receiveShadows = true;
  glow?.addExcludedMesh(ripple);
  const m: number[] = [];
  let k = 0;
  const rnd = () => { k++; const v = Math.sin(k * 37.719 + 3.1) * 14375.13; return v - Math.floor(v); };
  // (586.5b) irregular: lines 1.3-2.1 m apart, each stroke drifting along x, its kink 0.25-0.8 m either way, so the strokes
  // join into long wavy lines rather than a chevron grid
  for (let x = -55; x < 54; x += 1.3 + rnd() * 0.8) {
    const w = half(x) - 1.5;
    let drift = 0;
    for (let z = -w + rnd() * 2; z < w - 2.6;) {
      const len = 1.6 + rnd() * 1.4;
      drift = Math.max(-0.7, Math.min(0.7, drift + (rnd() - 0.5) * 0.5));
      const x0 = x + drift;
      // a V: (x0, z) -> (x0 + dx, z + len/2) -> (x0, z + len)
      const dx = (rnd() < 0.5 ? -1 : 1) * (0.25 + rnd() * 0.55), seg = Math.hypot(dx, len / 2), yaw = Math.atan2(dx, len / 2);
      for (const s of [1, -1]) {
        m.push(...Matrix.Compose(new Vector3(1, 1, seg), Quaternion.RotationAxis(Vector3.Up(), s * yaw),
          new Vector3(x0 + dx / 2, 0.105, z + len * (s > 0 ? 0.25 : 0.75))).m);
      }
      z += len + rnd() * 0.25;
    }
  }
  ripple.thinInstanceSetBuffer("matrix", new Float32Array(m), 16);
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
    rock: mk("pirateMountainRock", new Color3(0.64, 0.5, 0.31), 0.6),
    grass: mk("pirateMountainGrass", new Color3(0.36, 0.56, 0.14), 0.6),
    trunk: mk("pirateMountainPalmTrunk", new Color3(0.42, 0.3, 0.18), 0.35),
    frond: mk("pirateMountainPalmFrond", new Color3(0.14, 0.42, 0.11), 0.35),
    water: mk("pirateMountainFall", new Color3(0.95, 0.98, 1), 0.85),
    bell: mk("pirateMountainBell", new Color3(0.3, 0.19, 0.1), 0.35),
    gold: mk("pirateMountainBellRim", new Color3(0.9, 0.68, 0.22), 0.45),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { rock: [], grass: [], trunk: [], frond: [], water: [], bell: [], gold: [] };
  const rnd = (i: number, s: number) => {
    const raw = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
    return raw - Math.floor(raw);
  };
  // 584 re-site (wiki pirate.png: the mountain stands on the island behind the beach, between the ships' bows, tan rock
  // with a green cap on every ledge, a white fall down its beach face and a bell as wide as its summit). It stands at
  // the back (34, 38), inside the island's rim beside the far ship's bow, behind the right zone (z <= 27) and the stage
  // armies; its palms, fall and bell frame face the beach (-z).
  const CX = 34, CZ = 38;
  // The base's ring palms and props under its foot go with their colliders
  for (const mesh of scene.meshes) {
    if (mesh.parent || !mesh.isEnabled() || !/^(trunk|Pirate Cove_)/.test(mesh.name)) continue;
    if (Math.hypot(mesh.position.x - CX, mesh.position.z - CZ) > 11.5) continue;
    mesh.setEnabled(false);
    for (let o = obstacles.length - 1; o >= 0; o--) {
      if (Math.hypot(obstacles[o].center.x - mesh.position.x, obstacles[o].center.z - mesh.position.z) < 0.6) obstacles.splice(o, 1);
    }
  }
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
      if (t > 0 || j % 2 === 0) lump("grass", size * 0.85, 0.7, size * 0.75, CX + Math.cos(a + 0.3) * r * 1.05, y + size * 0.92, CZ + Math.sin(a + 0.3) * r * 1.05, k + 40);
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
    .forEach(([dx, y, dz, tall], i) => palm(CX + dz, y, CZ + dx, tall, i + 1));
  // The fall down the beach face (-z), 2.6 m wide, and its foam
  for (const [z, y, len, tilt] of [[-5.4, 10, 7, 0.5], [-8.3, 3.6, 8, 0.22]]) {
    const run = MeshBuilder.CreateBox("pirateMountainFall", { width: 2.6, height: len, depth: 0.4 }, scene);
    run.rotation.x = tilt;
    run.position.set(CX + 1.5, y, CZ + z);
    parts.water.push(run);
  }
  lump("water", 5, 0.5, 4.5, CX + 1.5, 0.15, CZ - 10, 95);
  // The bell, 6 m across, in an A-frame standing across the summit (seen whole from the beach)
  for (const s of [-1, 1]) {
    const post = MeshBuilder.CreateCylinder("pirateMountainBellPost", { height: 13, diameter: 0.6, tessellation: 6 }, scene);
    post.rotation.z = s * 0.2;
    post.position.set(CX + s * 3.9, 22, CZ - 0.5);
    parts.bell.push(post);
  }
  const beam = MeshBuilder.CreateBox("pirateMountainBellBeam", { width: 6.6, height: 0.6, depth: 0.6 }, scene);
  beam.position.set(CX, 28.3, CZ - 0.5);
  parts.bell.push(beam);
  const bell = MeshBuilder.CreateCylinder("pirateMountainBell", { height: 5.2, diameterTop: 2.4, diameterBottom: 6, tessellation: 10 }, scene);
  bell.position.set(CX, 25.2, CZ - 0.5);
  parts.bell.push(bell);
  const crown = MeshBuilder.CreateSphere("pirateMountainBellCrown", { diameter: 2.5, segments: 6 }, scene);
  crown.position.set(CX, 27.7, CZ - 0.5);
  parts.bell.push(crown);
  const rim = MeshBuilder.CreateCylinder("pirateMountainBellRim", { height: 0.5, diameter: 6.4, tessellation: 10 }, scene);
  rim.position.set(CX, 22.7, CZ - 0.5);
  parts.gold.push(rim);
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true, true);
    if (!merged) continue;
    merged.name = `pirateMountain_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    // No received shadows: the heap shadowed itself to near black from the island camera.
    merged.receiveShadows = false;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  }
  obstacles.push({ type: "cylinder", center: new Vector3(CX, 0, CZ), radius: 10.5 });
}
