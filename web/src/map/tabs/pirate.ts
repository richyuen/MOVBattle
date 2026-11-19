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

// Rebuild 602 b (plateau, blocker b1; wiki pirate.png: the camera looks down a long sand strip toward the mountain; a big galleon
// lies along each long side of the strip, both bows toward the mountain, each running along most of its shore and framing the
// fighting ground closely; the red army stands by one ship and the blue by the other, facing across the strip; three gangplanks
// from each deck reach a third of the way into the sand). Our teams split on x and the top camera looks along +z, so:
// - the strip runs along z (z -56..48), half width 25-27 m in the near bulb (z -46..-34), pinching to 18.5 m between the ships
//   (z -26..14), 21-22 m past their bows, closing under the mountain (z 44..48);
// - each galleon is the old local ship scaled 1.5x (42 m stern to stem, 18 m beam, deck 8.4 m up, masts to ~38 m, 6 m nests),
//   its keel along z at x -29 (team 0, beach to +x) and x +29 (team 1, beach to -x), stern z -24, bow z +18, 1.5 m of water
//   between hull and sand; planks 13 m long land at |x| ~7;
// - placement: each team on its half of the strip (|x| 1.5..17.5, z -40..20) and on its own deck (|x| 17.5..38.5, z -27..18);
//   the stage armies, authored on the old -z deck, keep their deck-local places on the +x deck (x' = 29 - 1.5 (z + 37),
//   z' = -4.5 + 1.5 (17 - x));
// - the mountain moves to the strip's far end (4, 47), between the bows.
// The ship is built in its own frame (u along the keel to the bow, v across toward the beach) and baked into the world by SHIP_S.
const SHIP_S = 1.5, SHIP_CZ = -4.5;
const SHIPS = [{ x: -29, beach: 1 }, { x: 29, beach: -1 }];
/** A ship-local point (u, v) in the world. */
const shipWorld = (s: { x: number; beach: number }, u: number, v: number) => [s.x + s.beach * SHIP_S * v, SHIP_CZ + SHIP_S * u] as const;
/** A world point in a ship's frame. */
const shipLocal = (s: { x: number; beach: number }, x: number, z: number) => [(z - SHIP_CZ) / SHIP_S, ((x - s.x) * s.beach) / SHIP_S] as const;
const PLANK_RUN = 8.7;
// Rebuild600 a (wiki pirate.png, CONFIRM592/599): broad deep galleons dominate
// both shores, dark planks with gold strakes, tall raked windowed sterns and
// open 4m crow's nests. Keep the 28m mooring footprint and every plank mouth;
// increase the visible shell to 7.2m deep and its beam to 12m, drawing actors
// on the same newly raised decks. The summit carries an open wrecked bow,
// not a bell. Irregular 8..16m palms and broad leaf rosettes close shore ends.
// 602: sunk 2.4 m (local) so the 1.5x deck stands 8.4 m over the sand
const LONG = 30, BEAM = 12, HULL = 8, SINK = 2.4, STERN_RISE = 5.6;

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
    // (593.4b) uvs too, or it cannot merge with the boxes (MergeMeshes needs one set of attributes)
    vd.uvs = new Array((pos.length / 3) * 2).fill(0);
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
  for (const drop of [1.9, 4.1, 6]) band("gold", top - drop, 0.22, 0.05);
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
  for (const ship of SHIPS) {
    // u: along the hull toward the bow; v: across, toward the beach. 602: built in the ship's own frame (x = u, z = v), then
    // every part made for this ship is baked into the world by the ship's matrix (scale SHIP_S, keel along z).
    const SX = 0, Z = 0, bow = 1, toBeach = 1;
    const at = (u: number, v: number) => [SX + u * bow, Z + v * toBeach] as const;
    const first = Object.fromEntries(Object.entries(parts).map(([k, list]) => [k, list.length])) as Record<keyof typeof mats, number>;
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
    // Rising stern (602, blocker a1; wiki pirate.png: the stern is one high castle whose deck sweeps up from the waist to a tall
    // raked transom, its sides walled with two rows of gold-framed windows and topped by an open baluster railing; no stack of
    // flat cabin lids). Spec: one lofted castle from the transom (u -13.5) to the waist (u -5.5), its deck rising on
    // STERN_RISE * t^1.4 (t = 0 at the waist, 1 at the transom; 5.6 m), its sides the old gallery plan (0.8..1 of 12.2 m), the
    // transom raked 0.9 m aft at the top; side windows in two rows where the wall stands over 2.5 m, four by two on the transom;
    // balusters every 0.5 m along both top edges and the transom with a gold handrail 0.9 m up; the quarter balconies kept, one
    // per side at 2.5 m.
    const sternU = -LONG * 0.45 + 4;
    const aft = sternU - 4, fore = -5.5, len = fore - aft, beam = BEAM * 1.02;
    const width = (u: number) => beam / 2 * (0.8 + 0.2 * Math.sin(Math.min(1, Math.max(0, (u - aft) / len)) * Math.PI));
    const sternT = (u: number) => Math.min(1, Math.max(0, (fore - u) / len));
    const rake = (u: number) => 0.9 * sternT(u);
    const H = (u: number) => STERN_RISE * sternT(u) ** 1.4;
    {
      const N = 16, outline: Array<[number, number]> = [];
      for (let i = 0; i <= N; i++) { const u = aft + (len * i) / N; outline.push([u, -width(u)]); }
      for (let i = N; i >= 0; i--) { const u = aft + (len * i) / N; outline.push([u, width(u)]); }
      const pos: number[] = [], idx: number[] = [], n = outline.length;
      for (const upper of [false, true]) for (const [u, v] of outline) {
        const [x, z] = at(u - (upper ? rake(u) : 0), v * (upper ? 1 : 0.84));
        pos.push(x, top + (upper ? H(u) : 0), z);
      }
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; idx.push(i, j, n + i, j, n + j, n + i); }
      // the sweeping deck: a strip between the two upper edges (outline i and its mirror n-1-i)
      for (let i = 0; i < N; i++) {
        const a = n + i, b = n + i + 1, c = n + (n - 1 - i), d = n + (n - 2 - i);
        idx.push(a, c, b, b, c, d);
      }
      const shell = new Mesh("pirateSternCastle", scene), data = new VertexData(), normals: number[] = [];
      VertexData.ComputeNormals(pos, idx, normals);
      data.positions = pos; data.indices = idx; data.normals = normals; data.uvs = new Array((pos.length / 3) * 2).fill(0);
      data.applyToMesh(shell);
      parts.hull.push(shell);
    }
    // two rows of gold-framed side windows along the walls, where the wall is tall enough
    for (const side of [-1, 1]) for (let i = 0; i < 8; i++) {
      const u = aft + 0.6 + i, h = H(u);
      if (h < 2.5) continue;
      for (const f of [0.32, 0.68]) {
        const v = side * (width(u) + 0.04), y = top + h * f;
        box("gold", 0.8, 1.15, 0.16, u, y, v);
        box("sail", 0.55, 0.8, 0.19, u, y, v + side * 0.06);
        box("dark", 0.07, 0.85, 0.21, u, y, v + side * 0.08);
      }
    }
    // the open baluster railing along both top edges and across the transom, a gold handrail on top
    const railPoints = (side: number) => Array.from({ length: Math.round(len / 0.5) + 1 }, (_, i) => {
      const u = aft + i * 0.5;
      return world(u - rake(u), top + H(u), side * (width(u) - 0.15));
    });
    for (const side of [-1, 1]) {
      const pts = railPoints(side);
      pts.forEach((p, i) => {
        rod("dark", p, p.add(new Vector3(0, 0.9, 0)), 0.12);
        if (i > 0) rod("gold", pts[i - 1].add(new Vector3(0, 0.9, 0)), p.add(new Vector3(0, 0.9, 0)), 0.16);
      });
    }
    const transomL = world(aft - 0.9, top + STERN_RISE, -(width(aft) - 0.15)), transomR = world(aft - 0.9, top + STERN_RISE, width(aft) - 0.15);
    for (let k = 0; k <= 12; k++) {
      const p = Vector3.Lerp(transomL, transomR, k / 12);
      rod("dark", p, p.add(new Vector3(0, 0.9, 0)), 0.12);
    }
    rod("gold", transomL.add(new Vector3(0, 0.9, 0)), transomR.add(new Vector3(0, 0.9, 0)), 0.16);
    // the transom: four by two gold-framed windows on the raked face
    for (const f of [0.35, 0.68]) for (let w = 0; w < 4; w++) {
      const y = top + STERN_RISE * f, u = aft - 0.9 * f - 0.12, v = (w - 1.5) * (beam * 0.18);
      box("gold", 0.12, 1.3, 1.1, u, y, v);
      box("sail", 0.15, 0.9, 0.8, u - 0.02, y, v);
    }
    // gold-framed quarter balconies projecting past the hull at the quarters, curved rails facing the island cameras
    for (const side of [-1, 1]) {
      let previous: Vector3 | undefined;
      for (let i = 0; i <= 10; i++) {
        const angle = (Math.PI * i) / 10, u = aft + 0.3 + Math.sin(angle) * 1.5;
        const v = side * (beam * 0.4 + Math.sin(angle) * 1.1), p = world(u, top + 2.5, v);
        if (previous) rod("gold", previous, p, 0.18);
        rod("gold", p, world(u, top + 1.4, v), 0.1);
        previous = p;
      }
    }
    const base = top + STERN_RISE + 0.9;
    for (const s of [-1, 1]) {
      const lamp = MeshBuilder.CreateCylinder("pirateGalleonLamp", { diameter: 0.6, height: 1, tessellation: 6 }, scene);
      // 602.2b: on the raked transom's handrail corners, not floating over the old upright transom
      const [x, z] = at(aft - 0.9 + 0.25, s * (width(aft) - 0.15));
      lamp.position.set(x, base + 0.5, z);
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
      const nestY = top + tall * 0.88;
      const nest = MeshBuilder.CreateCylinder("pirateGalleonNest", { height: 0.25, diameter: 4.2, tessellation: 10 }, scene);
      nest.position.set(mx, nestY, mz);
      parts.dark.push(nest);
      for (const lift of [0.2, 1.2]) {
        const hoop = MeshBuilder.CreateTorus("pirateGalleonNestRail", { diameter: 4, thickness: 0.2, tessellation: 10 }, scene);
        hoop.position.set(mx, nestY + lift, mz);
        parts.hull.push(hoop);
      }
      for (let post = 0; post < 10; post++) {
        const a = post * Math.PI / 5;
        rod("dark", new Vector3(mx + Math.cos(a) * 2, nestY + 0.2, mz + Math.sin(a) * 2),
          new Vector3(mx + Math.cos(a) * 2, nestY + 1.2, mz + Math.sin(a) * 2), 0.16);
      }
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
      const run = PLANK_RUN, drop = top + 0.6, len = Math.hypot(run, drop), slope = Math.atan2(drop, run);
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
    // 602: a local box (half halfU along the keel, halfV across) in the world: the keel runs along z
    const localBox = (u: number, v: number, halfU: number, halfV: number) => {
      const [cx, cz] = shipWorld(ship, u, v);
      obstacles.push({ type: "box", center: new Vector3(cx, 0, cz), halfX: halfV * SHIP_S, halfZ: halfU * SHIP_S });
    };
    const rail = (u0: number, u1: number, v: number, halfV: number) => localBox((u0 + u1) / 2, v, Math.abs(u1 - u0) / 2, halfV);
    rail(-15, 15, -BEAM / 2 - 0.1, 0.4);
    for (const s of [-1, 1]) localBox(s * 15, 0, 0.5, BEAM / 2 + 0.5);
    for (const [u0, u1] of [[-15, -10.8], [-7.2, -1.8], [1.8, 7.2], [10.8, 15]]) rail(u0, u1, BEAM / 2 + 0.1, 0.4);
    // local x = u, z = v  ->  world x = ship.x + beach S v, z = SHIP_CZ + S u (rows are the images of local x, y, z)
    const toWorld = Matrix.FromValues(
      0, 0, SHIP_S, 0,
      0, SHIP_S, 0, 0,
      ship.beach * SHIP_S, 0, 0, 0,
      ship.x, 0, SHIP_CZ, 1,
    );
    for (const key of Object.keys(parts) as Array<keyof typeof mats>) {
      for (const m of parts[key].slice(first[key])) {
        m.bakeCurrentTransformIntoVertices();
        m.bakeTransformIntoVertices(toWorld);
      }
    }
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
// 596: a unit over the forecastle (u 3..8) is drawn on its roof (+1.4 m), over the stern castle's tiers (from u -13.5 to
// -5.5 / -7.5 / -9.3) on the top tier it stands over (+2.2 / +4 / +5.4 m), so a stage army on the deck never stands inside them.
// 602: read in each ship's own frame (shipLocal) and scaled by SHIP_S; planks PLANK_RUN long.
function deckHeight(x: number, z: number): number {
  const top = HULL - SINK;
  let h = 0;
  for (const ship of SHIPS) {
    const [u, v] = shipLocal(ship, x, z);
    if (Math.abs(u) <= 14.6 && Math.abs(v) <= BEAM / 2 - 0.1) {
      if (u >= 3 && u <= 8 && Math.abs(v) <= hullHalfBeam(8) - 0.1) return SHIP_S * (top + 1.4);
      // 602 a1: the stern castle's deck sweeps up from the waist (u -5.5) to the transom (u -13.5), STERN_RISE t^1.4
      if (u >= -14.4 && u <= -5.5) return SHIP_S * (top + STERN_RISE * Math.min(1, (-5.5 - u) / 8) ** 1.4);
      return SHIP_S * top;
    }
    for (const [pu, fan] of [[-9, -0.18], [0, 0.04], [9, 0.16]] as const) {
      const yaw = Math.atan2(Math.sin(fan), Math.cos(fan));
      const du = u - pu, dv = v - BEAM / 2;
      const d = du * Math.sin(yaw) + dv * Math.cos(yaw);
      const a = du * Math.cos(yaw) - dv * Math.sin(yaw);
      if (Math.abs(a) <= 1.6 && d >= -0.1 && d <= PLANK_RUN) h = Math.max(h, SHIP_S * (top + 0.55) * (1 - Math.max(0, d) / PLANK_RUN));
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

// Outer beach ring (596, blocker a3; pirate_beach.png: the round island is closed all round by a band of golden sand with
// clumps of palms, the turquoise shallows lying inside it round the hourglass beach, and the island's side below it is a
// thick sandy drum, not the sea disc's bare edge). Spec: an elliptical ring 8 m wide, outer half sizes 63 x 57 (just past
// the shallow-sea disc, 62 x 56), 64 sides; its section a wet lip rising from under the water (y -0.2) at the inner edge to
// a crown at y 0.3 two metres in, flat to 0.6 m from the outer edge, then rounding over into the drum: a sandy side falling
// 7 m at 0.97 of the size, a belly to y -13 at 0.82 and a point at y -21 at 0.42. Ring top in the beach's golden sand, the
// side and belly in a browner self-lit sand (.66,.46,.22) self .45 so it reads in the island shot; both out of the glow.
// Nine palm clumps (2-4 palms, 4.5-7.5 m, leaning in toward the lagoon, seven drooping fronds) on the crown, none by the
// bell mountain (34, 38). Drawn only: the ring lies in the sea round the field, no unit's zone reaches it.
function beachRing(scene: Scene): void {
  const RX = 63, RZ = 57, W = 8, SIDES = 64;
  const prof: Array<[number, number]> = [[W + 0.5, -0.2], [W - 2, 0.3], [0.6, 0.3], [0, 0.05]];
  const lower: Array<[number, number]> = [[0.97, -7], [0.82, -13], [0.42, -21]];
  const positions: number[] = [], indices: number[] = [];
  const rows: Array<Array<[number, number, number]>> = [];
  for (const [inset, y] of prof) rows.push(Array.from({ length: SIDES }, (_, i) => {
    const a = (i / SIDES) * Math.PI * 2;
    return [Math.cos(a) * (RX - inset), y, Math.sin(a) * (RZ - inset)];
  }));
  for (const [f, y] of lower) rows.push(Array.from({ length: SIDES }, (_, i) => {
    const a = (i / SIDES) * Math.PI * 2;
    return [Math.cos(a) * RX * f, y, Math.sin(a) * RZ * f];
  }));
  for (const row of rows) for (const p of row) positions.push(...p);
  const strip = (r: number) => {
    const out: number[] = [];
    for (let i = 0; i < SIDES; i++) {
      const a = r * SIDES + i, b = r * SIDES + (i + 1) % SIDES, c = a + SIDES, d = b + SIDES;
      out.push(a, b, c, b, d, c);
    }
    return out;
  };
  const mkMesh = (name: string, from: number, to: number, mat: StandardMaterial) => {
    let idx: number[] = [];
    for (let r = from; r < to; r++) idx = idx.concat(strip(r));
    const normals: number[] = [];
    VertexData.ComputeNormals(positions, idx, normals);
    // the crown must face up (the lip's first vertex normal); else turn every triangle over
    if (normals[(from * SIDES) * 3 + 1] < 0 && from === 0) for (let t = 0; t < idx.length; t += 3) [idx[t + 1], idx[t + 2]] = [idx[t + 2], idx[t + 1]];
    const data = new VertexData();
    data.positions = positions.slice();
    data.indices = idx;
    const n2: number[] = [];
    VertexData.ComputeNormals(positions, idx, n2);
    data.normals = n2;
    const m = new Mesh(name, scene);
    data.applyToMesh(m);
    m.convertToFlatShadedMesh();
    m.material = mat;
    m.receiveShadows = true;
    m.isPickable = false;
    m.applyFog = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(m);
    return m;
  };
  const gold = scene.getMaterialByName("pirateGoldenSand") as StandardMaterial | null;
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    m.backFaceCulling = false;
    return m;
  };
  // 596.3b: at self .45 the side, facing away from the sun, read dark chocolate; self-lit 1x its colour it reads as sand
  const side = mk("pirateRingSide", new Color3(0.66, 0.46, 0.22), 1);
  const top = mkMesh("pirateBeachRing", 0, prof.length - 1, gold ?? side);
  const drum = mkMesh("pirateRingDrum", prof.length - 1, rows.length - 1, side);
  // the side must face outward: compare a side vertex's normal with its radial direction
  const sn = drum.getVerticesData("normal"), sp = drum.getVerticesData("position");
  if (sn && sp && sn[0] * sp[0] + sn[2] * sp[2] < 0) drum.flipFaces(true);
  void top;
  // palm clumps on the crown
  const trunkMat = mk("pirateRingPalmTrunk", new Color3(0.42, 0.29, 0.16), 0.18);
  const leafMat = mk("pirateRingPalmLeaf", new Color3(0.16, 0.5, 0.22), 0.22);
  const trunks: Mesh[] = [], leaves: Mesh[] = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (const deg of [116, 121, 145, 153, 160, 178, 186, 203, 211, 226, 293, 307, 315, 327, 339]) {
    const a = (deg * Math.PI) / 180;
    const count = 3 + Math.floor(rnd() * 4);
    for (let k = 0; k < count; k++) {
      const aa = a + (rnd() - 0.5) * 0.13, inset = 1.5 + rnd() * 5.5;
      const px = Math.cos(aa) * (RX - inset), pz = Math.sin(aa) * (RZ - inset);
      const inward = new Vector3(-px, 0, -pz).normalize();
      const tall = 8 + rnd() * 8, lean = 0.18 + rnd() * 0.32, segs = 5;
      let p = new Vector3(px, 0.25, pz);
      for (let s = 0; s < segs; s++) {
        const tilt = lean * (s + 1) / segs;
        const dir = new Vector3(inward.x * Math.sin(tilt), Math.cos(tilt), inward.z * Math.sin(tilt));
        const len = tall / segs;
        const seg = MeshBuilder.CreateCylinder("pirateRingPalm", { height: len * 1.05, diameterBottom: 0.5 - s * 0.05, diameterTop: 0.45 - s * 0.05, tessellation: 6 }, scene);
        seg.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, new Quaternion());
        seg.position.copyFrom(p.add(dir.scale(len / 2)));
        trunks.push(seg);
        p = p.add(dir.scale(len));
      }
      const spin = rnd() * Math.PI;
      for (let f = 0; f < 7; f++) {
        const yaw = spin + (f / 7) * Math.PI * 2;
        const frond = MeshBuilder.CreateCylinder("pirateRingPalm", { height: 4.5, diameterBottom: 1.8, diameterTop: 0, tessellation: 4 }, scene);
        frond.scaling.z = 0.16;
        const dir = new Vector3(Math.sin(yaw), -0.4, Math.cos(yaw)).normalize();
        frond.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, new Quaternion());
        frond.position.copyFrom(p.add(dir.scale(2.15)));
        leaves.push(frond);
      }
      // Wide pointed tropical leaves rather than another row of miniature palms.
      for (let f = 0; f < 9; f++) {
        const yaw = spin + f * Math.PI * 2 / 9;
        const blade = MeshBuilder.CreateCylinder("pirateShoreRosette", { height: 3.5 + rnd() * 2, diameterBottom: 2.4, diameterTop: 0, tessellation: 4 }, scene);
        blade.scaling.z = 0.12;
        const dir = new Vector3(Math.cos(yaw), 0.6 + rnd(), Math.sin(yaw)).normalize();
        blade.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, new Quaternion());
        blade.position.set(px + dir.x * 1.6, 0.4 + dir.y * 1.6, pz + dir.z * 1.6);
        leaves.push(blade);
      }
    }
  }
  for (const [list, mat, name] of [[trunks, trunkMat, "pirateRingPalmTrunks"], [leaves, leafMat, "pirateRingPalmLeaves"]] as const) {
    const merged = Mesh.MergeMeshes(list, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
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
    const underShip = /^(trunk|Pirate Cove_)/.test(mesh.name) && SHIPS.some((s) => {
      const [u, v] = shipLocal(s, p.x, p.z);
      return Math.abs(u) < LONG / 2 + 2 && Math.abs(v) < BEAM / 2 + PLANK_RUN;
    });
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
  beachRing(scene);
  openShore(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));
  const baseHeight = result.height;
  const height = (x: number, z: number) => Math.max(baseHeight?.(x, z) ?? 0, deckHeight(x, z));
  // Team decks (596, blocker b2; reference/stages/pirate.x_marks_the_spot.png, spooky.plunder.png: the enemy army stands on
  // its own galleon's deck and gangplanks, not on the open sand). 602: the base's island-wide zones go (they reached x +-61,
  // now sea and hull); each team gets its half of the strip first (the default placement lands on the sand), then its own
  // deck from the plank heads to the seaward rail (stage armies stand there in ranks along the keel).
  const placementZones = [0, 1].flatMap((team) => {
    const side = team === 0 ? -1 : 1;
    return [
      { team, center: new Vector3(side * 9.5, 0, -10), size: new Vector3(16, 100, 60) },
      { team, center: new Vector3(side * 28, 0, -4.5), size: new Vector3(21, 100, 45) },
    ];
  });
  return { ...result, obstacles, hazards, height, placementZones, dispose: () => { restoreSky(); result.dispose?.(); } };
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
  // 602 rebuild: the strip runs along z (stations [z, half width in x]); see the spec at the head of the file.
  const stations = [[-56,3],[-51,16],[-44,25],[-34,27],[-27,20],[-22,18.5],[14,18.5],[22,21],[30,22],[38,16],[44,8],[48,2]];
  const halfAt = (s: number) => {
    for (let i = 0; i < stations.length - 1; i++) {
      const [sa, wa] = stations[i], [sb, wb] = stations[i + 1];
      if (s >= sa && s <= sb) return wa + (wb - wa) * (s - sa) / (sb - sa);
    }
    return 0;
  };
  for (const m of scene.meshes) {
    if (!built.has(m) || m.parent || !m.isEnabled() || !/^(trunk$|bush$|Pirate Cove_)/.test(m.name)) continue;
    const { x, z } = m.position;
    if (Math.abs(x) <= halfAt(z) + 1) continue;
    m.setEnabled(false);
    for (let o = obstacles.length - 1; o >= 0; o--) {
      if (Math.hypot(obstacles[o].center.x - x, obstacles[o].center.z - z) < 0.6) obstacles.splice(o, 1);
    }
  }
  // [x, z]: the +x shore from the near tip to the far one, then the -x shore back (the old x-long outline turned 90 degrees, so
  // the fan keeps its winding)
  for(const [s,w] of stations) outline.push([w,s]);
  for(const [s,w] of [...stations].reverse()) outline.push([-w,s]);
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
  // 602: stations are [z, half width in x]; the ripple lines run across the strip (along x), stacked along z
  const half = (s: number) => {
    for (let i = 0; i < stations.length - 1; i++) {
      const [sa, wa] = stations[i], [sb, wb] = stations[i + 1];
      if (s >= sa && s <= sb) return wa + (wb - wa) * (s - sa) / (sb - sa);
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
  for (let z = -52; z < 45; z += 1.3 + rnd() * 0.8) {
    const w = half(z) - 1.5;
    let drift = 0;
    for (let x = -w + rnd() * 2; x < w - 2.6;) {
      const len = 1.6 + rnd() * 1.4;
      drift = Math.max(-0.7, Math.min(0.7, drift + (rnd() - 0.5) * 0.5));
      const z0 = z + drift;
      // a V: (x, z0) -> (x + len/2, z0 + dz) -> (x + len, z0); a box's long side (local z) turned by yaw points (sin, cos)
      const dz = (rnd() < 0.5 ? -1 : 1) * (0.25 + rnd() * 0.55), seg = Math.hypot(dz, len / 2);
      for (const s of [1, -1]) {
        const yaw = Math.atan2(len / 2, s * dz);
        m.push(...Matrix.Compose(new Vector3(1, 1, seg), Quaternion.RotationAxis(Vector3.Up(), yaw),
          new Vector3(x + len * (s > 0 ? 0.25 : 0.75), 0.105, z0 + dz / 2)).m);
      }
      x += len + rnd() * 0.25;
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
  // 602: at the strip's far end between the two bows (spec at the head of the file)
  const CX = 4, CZ = 47;
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
  // The wreck is an open U-shaped bow, tilted upright on the summit. Its open
  // broken cross-section faces the beach; longitudinal boards and curved ribs
  // read as a boat even from the high map shot, unlike a closed conical bell.
  const wreckPoint = (depth: number, theta: number) => {
    const radius = 4.8 * (1 - 0.72 * depth / 9);
    return new Vector3(CX + Math.cos(theta) * radius,
      23.5 - Math.sin(theta) * radius + depth * 0.38, CZ - 3 + depth);
  };
  const wreckRod = (a: Vector3, b: Vector3, diameter: number, key: "bell" | "gold") => {
    const dir = b.subtract(a), len = dir.length();
    const beam = MeshBuilder.CreateCylinder("pirateWreckBoard", { height: len, diameter, tessellation: 4 }, scene);
    beam.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir.normalize(), new Quaternion());
    beam.position.copyFrom(Vector3.Center(a, b));
    parts[key].push(beam);
  };
  const pos: number[] = [], idx: number[] = [], steps = 16, rows = 9;
  for (let row = 0; row <= rows; row++) for (let j = 0; j <= steps; j++) {
    const theta = Math.PI * j / steps, p = wreckPoint(row, theta);
    pos.push(p.x, p.y, p.z);
    if (row < rows && j < steps) {
      const v = row * (steps + 1) + j;
      idx.push(v, v + steps + 1, v + 1, v + 1, v + steps + 1, v + steps + 2);
    }
  }
  const shell = new Mesh("pirateSummitWreck", scene), data = new VertexData(), normals: number[] = [];
  VertexData.ComputeNormals(pos, idx, normals);
  data.positions = pos; data.indices = idx; data.normals = normals;
  data.uvs = new Array(pos.length / 3 * 2).fill(0); data.applyToMesh(shell);
  parts.bell.push(shell); mats.bell.backFaceCulling = false; mats.bell.twoSidedLighting = true;
  for (let j = 0; j <= steps; j++) {
    const theta = Math.PI * j / steps;
    wreckRod(wreckPoint(0, theta), wreckPoint(9, theta), 0.14, "gold");
  }
  for (const depth of [0, 3, 6, 9]) for (let j = 0; j < steps; j++) {
    wreckRod(wreckPoint(depth, Math.PI * j / steps), wreckPoint(depth, Math.PI * (j + 1) / steps), 0.3, "bell");
  }
  wreckRod(new Vector3(CX, 24.5, CZ + 3), new Vector3(CX - 1, 34, CZ + 5), 0.35, "bell");
  // More grassy shoulders around the stranded hull, with plants breaking its base.
  lump("grass", 10, 0.9, 8, CX, 18.5, CZ, 201);
  palm(CX - 5, 18, CZ + 1, 6.5, 202);
  palm(CX + 5, 17, CZ - 1, 7.8, 203);
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
