import { Scene, Vector3, Color3, Mesh, MeshBuilder, VertexData } from "@babylonjs/core";
import type { Material } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { jitterVertices } from "./tribalDress";

// Medieval faction hair, cloth and ornaments (loop v2: per-unit dress lives here, not in the builder monoliths).

/*
 * [S] the Healer's tonsure (355; medieval.healer.red.png, card Appearance "having the tonsure", "an old Wobbler"): the crown of the head bare skin, a thick
 * grey fringe ring round the sides and back of the head and a short grey beard over the jaw. In head half-extents (x across, y up, z ahead):
 * fringe TONSURE.ring of the head round its sides and back (the front TONSURE.open rad either side of the face left bare), its middle TONSURE.y of the
 * half-height above the head's middle, TONSURE.thick of the head height thick, standing TONSURE.out past the skull; beard TONSURE.beard: .wide of the
 * head across, .down head heights below the chin, .deep of the half-depth thick; both TONSURE.grey, self-lit .glow so the grey stays grey in the sky light.
 */
const TONSURE = {
  ring: 1.0, open: 0.95, y: 0.12, thick: 0.42, out: 1.1, jitter: 0.12,
  beard: { wide: 1.0, down: 0.22, deep: 0.55 }, grey: new Color3(0.66, 0.64, 0.62), glow: 0.15,
};

function healerTonsure(scene: Scene, body: ArticulatedBody): Mesh[] {
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const T = TONSURE;
  const hair = getMaterialFactory().get("cloth", T.grey, { emissiveIntensity: T.glow });
  const path: Vector3[] = [];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const phi = T.open + (i / steps) * (2 * Math.PI - 2 * T.open); // round the back from one temple to the other; 0 is the face
    path.push(new Vector3(Math.sin(phi) * e.x * T.out, e.y * T.y, Math.cos(phi) * e.z * T.out));
  }
  const fringe = MeshBuilder.CreateTube("tonsureFringe", {
    path, tessellation: 6, cap: Mesh.CAP_ALL, radiusFunction: () => e.y * T.thick,
  }, scene);
  fringe.convertToFlatShadedMesh();
  fringe.material = hair;
  fringe.parent = body.headMesh;

  const B = T.beard;
  const tall = e.y * 0.75 + e.y * 2 * B.down;
  const beard = MeshBuilder.CreateIcoSphere("tonsureBeard", { radius: 1, subdivisions: 1, flat: true }, scene);
  jitterVertices(beard, T.jitter, 21.7, e.x * 1.08 * B.wide, tall * 0.5, e.z * B.deep);
  beard.position.set(0, -e.y * 0.1 - tall * 0.5, e.z * 0.85);
  beard.material = hair;
  beard.parent = body.headMesh;
  return [fringe, beard];
}

/*
 * [S] the Archer's hood (356; medieval.archer.blue.png, card Appearance "a hood with a liripipe"): a dark team cowl closed round the skull, the back and under the
 * chin, open at the face from the brow to the chin so the eyes and the face show in an oval; the crown drawn up into a low point; the liripipe tail from that point
 * down the back to the shoulder blades; a short capelet of the same cloth off the neck over the shoulders. In head half-extents (x across, y up, z ahead):
 * shell ARCHER_HOOD.out past the skull, its crown ARCHER_HOOD.peak above the head top, closed ARCHER_HOOD.chin below the head's middle; the face opening
 * ARCHER_HOOD.open rad either side of the face at its widest, from ARCHER_HOOD.brow down to ARCHER_HOOD.jaw of the half-height; tail ARCHER_HOOD.tail head
 * heights long; capelet ARCHER_HOOD.cape: .wide of the chest across at its hem, .drop of the torso height down from the collar. Cloth: team x ARCHER_HOOD.shade.
 */
/*
 * [S] the hood's tight face opening and its capelet layer (359; medieval.archer.blue.png: the navy cloth comes down over the forehead to just above the eyes and
 * closes round the face in a narrow oval, brow to chin; the capelet a dark layer of its own over the shoulders with a visible lower edge): the opening now
 * ARCHER_HOOD.open rad either side at the eyes, from ARCHER_HOOD.brow (just over the eyes) to .jaw, the shell wound both ways (one-sided it was culled from outside and showed the self-lit head through it); a rolled cloth rim (.rim of the head half-width thick) runs
 * round the opening's edge so the oval reads as a hem; hood and capelet a dark navy (team x .shade), the capelet ringed at its foot by a hem .hemTall of its
 * height in team x .hemShade so it reads as a separate layer over the chest. Shell rings 16 so the opening's edge is smooth.
 */
const ARCHER_HOOD = {
  out: 1.38, peak: 0.4, chin: 1.12, open: 0.56, brow: 0.38, jaw: -0.8, tail: 1.5, rim: 0.1,
  cape: { wide: 1.4, drop: 0.32, neck: 0.75, hemTall: 0.22, hemShade: 0.2 }, shade: 0.3, glow: 0.02, lining: 0.96,
};

function archerHood(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const H = ARCHER_HOOD;
  const cloth = getMaterialFactory().get("cloth", team.scale(H.shade), { emissiveIntensity: H.glow });
  // A point on the shell: theta from the crown (0) to under the chin (.82 pi), phi round from the face (0)
  const span = (H.brow - H.jaw) / 2, mid = (H.brow + H.jaw) / 2;
  const at = (theta: number, phi: number, grow = 1): Vector3 => {
    const t = theta / (Math.PI * 0.82);
    const y = Math.cos(theta) * e.y * H.out + (t < 0.2 ? (1 - t / 0.2) * e.y * H.peak : 0) - (t > 0.6 ? (t - 0.6) / 0.4 * e.y * (H.chin - 1) : 0);
    const ring = Math.sin(theta) * grow;
    return new Vector3(Math.sin(phi) * ring * e.x * H.out, y, Math.cos(phi) * ring * e.z * H.out);
  };
  // the face opening's half-angle at a ring: widest at the eyes, shut above the brow and below the jaw
  const openAt = (theta: number): number => {
    const k = 1 - ((Math.cos(theta) - mid) / span) ** 2;
    return k > 0 ? H.open * Math.sqrt(k) : 0;
  };
  // The shell: rings from the crown down to under the chin; each ring runs from one side of the face round the back to the other.
  const rings = 16, around = 16;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let r = 0; r <= rings; r++) {
    const theta = (r / rings) * Math.PI * 0.82;
    const open = openAt(theta);
    for (let i = 0; i <= around; i++) {
      const p = at(theta, open + (i / around) * (2 * Math.PI - 2 * open));
      positions.push(p.x, p.y, p.z);
    }
  }
  for (let r = 0; r < rings; r++) {
    for (let i = 0; i < around; i++) {
      const a = r * (around + 1) + i, b = a + around + 1;
      // both windings, so the cloth shows from outside and from within through the face opening
      indices.push(a, b, a + 1, a + 1, b, b + 1, a, a + 1, b, a + 1, b + 1, b);
    }
  }
  const shell = new Mesh("archerHood", scene);
  const data = new VertexData();
  data.positions = positions;
  data.indices = indices;
  const normals: number[] = [];
  VertexData.ComputeNormals(positions, indices, normals);
  data.normals = normals;
  data.applyToMesh(shell);
  shell.convertToFlatShadedMesh();
  shell.material = cloth;
  shell.parent = body.headMesh;
  // the lining: the same shell turned inside out a little within, so the cloth is seen from inside through the face opening without fighting the outer faces
  const lining = shell.clone("archerHoodLining");
  lining.makeGeometryUnique();
  lining.flipFaces(true);
  lining.scaling.setAll(H.lining);
  lining.parent = body.headMesh;
  // the rolled rim round the face opening: down one edge from the brow to the jaw and back up the other
  const th0 = Math.acos(Math.min(1, H.brow)), th1 = Math.acos(Math.max(-1, H.jaw));
  const edge: Vector3[] = [];
  const steps = 10;
  for (let s = 0; s <= steps; s++) { const th = th0 + (th1 - th0) * (s / steps); edge.push(at(th, openAt(th))); }
  for (let s = steps - 1; s >= 1; s--) { const th = th0 + (th1 - th0) * (s / steps); edge.push(at(th, -openAt(th))); }
  edge.push(edge[0].clone());
  const rim = MeshBuilder.CreateTube("archerHoodRim", { path: edge, tessellation: 5, radius: e.x * H.rim, cap: Mesh.NO_CAP }, scene);
  rim.convertToFlatShadedMesh();
  rim.material = cloth;
  rim.parent = body.headMesh;

  // The liripipe: a tapering tail from the point down the back
  const top = new Vector3(0, e.y * (H.out + H.peak * 0.8), -e.z * 0.25);
  const path = [top, new Vector3(0, e.y * 0.9, -e.z * 1.25), new Vector3(0, -e.y * 0.3, -e.z * 1.45), new Vector3(0, -e.y * (H.tail * 2 - 0.9), -e.z * 1.35)];
  const tail = MeshBuilder.CreateTube("archerLiripipe", {
    path, tessellation: 5, cap: Mesh.CAP_ALL, radiusFunction: (i) => e.x * (0.3 - i * 0.07),
  }, scene);
  tail.convertToFlatShadedMesh();
  tail.material = cloth;
  tail.parent = body.headMesh;

  // The capelet: a short flared cloth collar off the neck over the shoulders, on the chest so it stays put when the head turns
  const t = body.torsoMesh;
  const c = t.getBoundingInfo().boundingBox.extendSize;
  const wide = Math.max(c.x * t.scaling.x, c.z * t.scaling.z) * 2;
  const tall = c.y * t.scaling.y * 2 * H.cape.drop;
  const cape = MeshBuilder.CreateCylinder("archerCapelet", {
    height: tall, diameterTop: wide * H.cape.neck, diameterBottom: wide * H.cape.wide, tessellation: 8,
  }, scene);
  cape.scaling.z = (c.z * t.scaling.z) / (c.x * t.scaling.x) * 1.25;
  cape.convertToFlatShadedMesh();
  cape.material = cloth;
  cape.parent = t.parent;
  cape.position.y = t.position.y + c.y * t.scaling.y - tall * 0.42;
  // its hem: a darker band round the capelet's foot, standing a little proud, so the capelet's lower edge reads over the chest
  const hemTall = tall * H.cape.hemTall;
  const hem = MeshBuilder.CreateCylinder("archerCapeletHem", {
    height: hemTall, diameterTop: wide * (H.cape.wide - (H.cape.wide - H.cape.neck) * H.cape.hemTall) * 1.04, diameterBottom: wide * H.cape.wide * 1.05, tessellation: 8,
  }, scene);
  hem.scaling.z = cape.scaling.z;
  hem.convertToFlatShadedMesh();
  hem.material = getMaterialFactory().get("cloth", team.scale(H.cape.hemShade), { emissiveIntensity: H.glow });
  hem.parent = t.parent;
  hem.position.y = cape.position.y - tall / 2 + hemTall / 2;
  return [shell, lining, rim, tail, cape, hem];
}

/*
 * [S] the Healer's robe trim (356; medieval.healer.red.png, .blue.png, card Appearance "a priest robe decorated with two crossed bands"): two gold bands run down
 * the front from the collar to the knee, either side of the middle; a gold band round the hem and round each cuff; a gold turned collar round the neck; a grey rope
 * belt at the waist with its end hanging down the front. Bands HEALER_TRIM.band of the chest's half-width wide at HEALER_TRIM.apart of it off the middle, sunk so
 * only their faces stand HEALER_TRIM.proud proud of the cloth; hem band HEALER_TRIM.hem of the robe's length tall; cuffs at HEALER_TRIM.cuff of the forearm;
 * belt HEALER_TRIM.belt of the chest's half-height thick, its end HEALER_TRIM.knot of the robe's length long.
 */
const HEALER_TRIM = {
  band: 0.17, apart: 0.42, proud: 0.05, hem: 0.08, cuff: 0.75, collar: 0.95, belt: 0.13, knot: 0.42,
  gold: new Color3(0.93, 0.66, 0.24), rope: new Color3(0.42, 0.4, 0.38), glow: 0.12,
};

const HEALER_FOLD = { inner: 0.05, outer: 0.14, stand: 0.2, flare: 1.25, neck: 0.42, from: 1.0 };

/** The trim, fitted to the robe skirt hung from his hips (unitFactory HEALER_ROBE) and to his chest. */
export function healerRobeTrim(scene: Scene, body: ArticulatedBody, robe: Mesh): Mesh[] {
  const T = HEALER_TRIM;
  const gold = getMaterialFactory().get("cloth", T.gold, { emissiveIntensity: T.glow });
  const rope = getMaterialFactory().get("cloth", T.rope, { emissiveIntensity: T.glow });
  const out: Mesh[] = [];
  const t = body.torsoMesh;
  const c = t.getBoundingInfo().boundingBox.extendSize;
  const cx = c.x * t.scaling.x, cy = c.y * t.scaling.y, cz = c.z * t.scaling.z;
  // Robe skirt: its hexagon's front face stands at the apothem (cos 30) of its radius, flaring from the waist to the hem
  const verts = robe.getVerticesData("position") ?? [];
  const rb = robe.getBoundingInfo().boundingBox.extendSize;
  let rTop = 0;
  for (let i = 0; i < verts.length; i += 3) if (verts[i + 1] > rb.y * 0.99) rTop = Math.max(rTop, Math.hypot(verts[i], verts[i + 2]));
  const rBot = rb.x;
  const ap = Math.cos(Math.PI / 6);
  const depth = cz * 0.3;
  for (const side of [-1, 1]) {
    // down the chest from the collar to the waist...
    const chestBand = MeshBuilder.CreateBox("healerBand", { width: cx * T.band, height: cy * 1.9, depth }, scene);
    chestBand.parent = t.parent;
    chestBand.position.set(side * cx * T.apart, t.position.y - cy * 0.02, cz * (1 + T.proud) - depth / 2);
    chestBand.material = gold;
    out.push(chestBand);
    // ...and on down the robe's front face to the hem, leaning out with its flare
    const fall = rb.y * 2;
    const lean = Math.atan2((rBot - rTop) * ap, fall);
    const robeBand = MeshBuilder.CreateBox("healerRobeBand", { width: cx * T.band / robe.scaling.x, height: fall / Math.cos(lean), depth: depth / robe.scaling.z }, scene);
    robeBand.parent = robe;
    robeBand.rotation.x = lean;
    robeBand.position.set(side * cx * T.apart, 0, ((rTop + rBot) / 2) * ap * (1 + T.proud) - depth / robe.scaling.z / 2);
    robeBand.material = gold;
    out.push(robeBand);
  }
  // hem band round the foot of the robe
  const hemTall = rb.y * 2 * T.hem;
  const hem = MeshBuilder.CreateCylinder("healerHem", { height: hemTall, diameterTop: rBot * 2 * 1.02, diameterBottom: rBot * 2 * 1.05, tessellation: 6 }, scene);
  hem.convertToFlatShadedMesh();
  hem.parent = robe;
  hem.position.y = -rb.y + hemTall / 2;
  hem.material = gold;
  out.push(hem);
  // cuffs round the wrists
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    const a = arm.getBoundingInfo().boundingBox.extendSize;
    const cuff = MeshBuilder.CreateCylinder("healerCuff", { height: a.y * 0.28, diameter: Math.max(a.x, a.z) * 2.35, tessellation: 6 }, scene);
    cuff.convertToFlatShadedMesh();
    cuff.parent = arm;
    cuff.position.y = -a.y * T.cuff;
    cuff.material = gold;
    out.push(cuff);
  }
  // [S] the turned collar (357; medieval.healer.red.png: a broad gold collar lying open in a V over the shoulders, not a ring hidden in the yoke): a flat gold
  // lapel each side laid on the chest's visible front (chestFrontAt), from the neck out T.collar of the chest half-width and down to a point by the V's middle,
  // and a gold strip over each shoulder from the lapel's top to the back
  // [S] the turned collar made solid (359; medieval.healer.red.png: the collar is a folded cloth with thickness, its lapels standing off the chest and rolled at
  // their outer edge, and a band standing up round the back of the neck): each lapel is a closed slab from the chest's front out to HEALER_FOLD.inner of the
  // chest half-width proud at the V and .outer at the rolled outer edge; a stand collar .stand of the chest height tall rings the back of the neck, flaring
  // out .flare at its top edge, from the lapels' tops round the back.
  const top = t.position.y + cy * 0.93;
  const zb = (y: number) => chestFrontAt(body, y) - cx * 0.02;
  const zc = (y: number, proud: number) => chestFrontAt(body, y) + cx * proud;
  const F = HEALER_FOLD;
  for (const side of [-1, 1]) {
    const corners: [number, number, number][] = [
      [0.16, 0, F.inner], [T.collar, -0.04, F.outer], [T.collar * 0.85, -0.42, F.outer], [0.07, -0.52, F.inner],
    ];
    const front = corners.map(([x, dy, p]) => new Vector3(side * cx * x, top + cy * dy, zc(top + cy * dy, p)));
    const back = corners.map(([x, dy]) => new Vector3(side * cx * x, top + cy * dy, zb(top + cy * dy)));
    const lapel = slab(scene, "healerCollar", front, back);
    lapel.parent = t.parent;
    lapel.material = gold;
    out.push(lapel);
    const zf = zc(top, T.proud * 0.6);
    const strip = MeshBuilder.CreateBox("healerCollarShoulder", { width: cx * (T.collar - 0.16), height: cy * 0.1, depth: zf * 1.9 }, scene);
    strip.parent = t.parent;
    strip.position.set(side * cx * (T.collar + 0.16) / 2, top + cy * 0.01, -zf * 0.05);
    strip.rotation.z = -side * 0.22;
    strip.material = gold;
    out.push(strip);
  }
  // the stand collar round the back of the neck, from beside one lapel's top round the back to the other, flaring out at its top
  const zf = zc(top, 0);
  const rows: Vector3[][] = [];
  for (const [dy, grow] of [[-0.02, 1], [F.stand, F.flare]] as const) {
    const row: Vector3[] = [];
    for (let i = 0; i <= 12; i++) {
      const phi = F.from + (i / 12) * (2 * Math.PI - 2 * F.from);
      row.push(new Vector3(Math.sin(phi) * cx * F.neck * grow, top + cy * dy, Math.cos(phi) * zf * 0.8 * grow));
    }
    rows.push(row);
  }
  const stand = MeshBuilder.CreateRibbon("healerCollarStand", { pathArray: rows, sideOrientation: Mesh.DOUBLESIDE }, scene);
  stand.convertToFlatShadedMesh();
  stand.parent = t.parent;
  stand.material = gold;
  out.push(stand);
  // the rope belt at the waist, its end hanging down the front
  const belt = MeshBuilder.CreateTorus("healerRopeBelt", { diameter: rTop * 2 * 1.02, thickness: cy * T.belt, tessellation: 10 }, scene);
  belt.convertToFlatShadedMesh();
  belt.parent = robe;
  belt.position.y = rb.y - cy * T.belt * 0.3;
  belt.material = rope;
  out.push(belt);
  const end = MeshBuilder.CreateCylinder("healerRopeEnd", { height: rb.y * 2 * T.knot, diameter: cy * T.belt * 0.85, tessellation: 5 }, scene);
  end.convertToFlatShadedMesh();
  end.parent = robe;
  const endLean = Math.atan2((rBot - rTop) * ap * T.knot, rb.y * 2);
  end.rotation.x = endLean;
  end.position.set(cx * 0.08, rb.y * (1 - T.knot), (rTop + (rBot - rTop) * T.knot * 0.5) * ap * 1.06);
  end.material = rope;
  out.push(end);
  return out;
}

/** The front of a torso-shaped mesh at a height, in its parent's units: the furthest-forward vertex of each ring of the mesh, interpolated between the rings
 *  above and below that height (a faceted torso has only a few rings, so a band round the height can hold none). `band` is unused, kept for the call sites. */
function frontAt(mesh: Mesh, y: number, _band?: number): number {
  const v = mesh.getVerticesData("position") ?? [];
  const rows = new Map<number, number>();
  for (let i = 0; i < v.length; i += 3) {
    const vy = Math.round((v[i + 1] * mesh.scaling.y + mesh.position.y) * 1e4) / 1e4;
    rows.set(vy, Math.max(rows.get(vy) ?? -Infinity, v[i + 2] * mesh.scaling.z + mesh.position.z));
  }
  const ys = [...rows.keys()].sort((a, b) => a - b);
  if (!ys.length) return 0;
  if (y <= ys[0]) return rows.get(ys[0])!;
  for (let i = 1; i < ys.length; i++) {
    if (y <= ys[i]) {
      const f = (y - ys[i - 1]) / (ys[i] - ys[i - 1]);
      return rows.get(ys[i - 1])! * (1 - f) + rows.get(ys[i])! * f;
    }
  }
  return rows.get(ys[ys.length - 1])!;
}

/** The chest's visible front at a height: the torso's swell or the shoulder yoke's hull over it, whichever stands further forward (both on the torso joint). */
function chestFrontAt(body: ArticulatedBody, y: number): number {
  const yoke = body.allMeshes.find((m) => /_yoke$/.test(m.name));
  return Math.max(frontAt(body.torsoMesh, y), yoke ? frontAt(yoke, y) : 0);
}

/** One flat panel from corner points (a fan round the first), seen from both sides. */
function panel(scene: Scene, name: string, pts: Vector3[]): Mesh {
  // each side its own copy of the corners, so the two faces' normals do not cancel at shared vertices
  const positions: number[] = [];
  for (let copy = 0; copy < 2; copy++) for (const p of pts) positions.push(p.x, p.y, p.z);
  const n = pts.length;
  const indices: number[] = [];
  for (let i = 1; i + 1 < n; i++) indices.push(0, i + 1, i, n, n + i, n + i + 1);
  const normals: number[] = [];
  VertexData.ComputeNormals(positions, indices, normals);
  const data = new VertexData();
  data.positions = positions; data.indices = indices; data.normals = normals;
  const m = new Mesh(name, scene);
  data.applyToMesh(m);
  return m;
}

/** A closed slab between two outlines of the same corners (front and back), each face wound both ways so it shows from any side. */
function slab(scene: Scene, name: string, front: Vector3[], back: Vector3[]): Mesh {
  const n = front.length;
  const positions: number[] = [];
  for (const p of [...front, ...back]) positions.push(p.x, p.y, p.z);
  const tris: number[] = [];
  for (let i = 1; i + 1 < n; i++) tris.push(0, i, i + 1, n, n + i, n + i + 1);
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; tris.push(i, j, n + j, i, n + j, n + i); }
  const indices = [...tris];
  for (let i = 0; i < tris.length; i += 3) indices.push(tris[i], tris[i + 2], tris[i + 1]);
  const normals: number[] = [];
  VertexData.ComputeNormals(positions, indices, normals);
  const data = new VertexData();
  data.positions = positions; data.indices = indices; data.normals = normals;
  const m = new Mesh(name, scene);
  data.applyToMesh(m);
  m.convertToFlatShadedMesh();
  return m;
}

/*
 * [S] the Bard's peasant vest (356; medieval.bard.red.png, card Appearance "peasant dress"): a dark vest over the team tunic from the shoulders to the hip, open
 * down the front in a V that shows the tunic, the V laced across with brown cord and closed at its top by two beige toggles. The vest is the torso's own shape a
 * skin larger (BARD_VEST.wide across, .deep front to back, .long of its height), team x BARD_VEST.shade; the V BARD_VEST.v of the chest's half-width across at the
 * collar and BARD_VEST.down of the torso height deep, in the tunic's team; BARD_VEST.laces cords across it; toggles BARD_VEST.toggle of the chest half-width.
 */
const BARD_VEST = {
  wide: 1.05, deep: 1.12, long: 1.0, shade: 0.5, v: 0.62, down: 0.62, laces: 2, toggle: 0.22, proud: 0.06,
  cord: new Color3(0.4, 0.24, 0.14), bone: new Color3(0.86, 0.74, 0.55), glow: 0.06, tunicPale: 0.04, tunicGlow: 0.16,
};

/*
 * [S] the Bard's tunic (357; medieval.bard.red.png: the team tunic shows in the vest's V and runs on below the vest as a short skirt to mid-thigh). One tunic
 * cloth for the V panel and the skirt (team barely paled, BARD_VEST.tunicPale/.tunicGlow); the skirt unitFactory hangs from his hips lengthened to
 * BARD_TUNIC.long of its own length (its top kept at the waist) and ended in a darker hem band .hem of its length (team x .hemShade).
 */
const BARD_TUNIC = { long: 1.45, hem: 0.16, hemShade: 0.62 };

function bardTunicCloth(team: Color3) {
  return getMaterialFactory().get("cloth", Color3.Lerp(team, Color3.White(), BARD_VEST.tunicPale), { emissiveIntensity: BARD_VEST.tunicGlow });
}

/** The tunic skirt, fitted to the skirt hung from his hips. */
export function bardTunic(scene: Scene, skirt: Mesh, team: Color3): Mesh[] {
  const T = BARD_TUNIC;
  const sb = skirt.getBoundingInfo().boundingBox.extendSize;
  const drop = sb.y * 2;
  skirt.scaling.y *= T.long;
  skirt.position.y -= (drop * T.long - drop) / 2;
  skirt.material = bardTunicCloth(team);
  const hemTall = sb.y * 2 * T.hem;
  const hem = MeshBuilder.CreateCylinder("bardTunicHem", { height: hemTall, diameterTop: sb.x * 2 * 1.02, diameterBottom: sb.x * 2 * 1.05, tessellation: 6 }, scene);
  hem.convertToFlatShadedMesh();
  hem.parent = skirt;
  hem.position.y = -sb.y + hemTall / 2;
  hem.material = getMaterialFactory().get("cloth", team.scale(T.hemShade), { emissiveIntensity: BARD_VEST.glow });
  return [hem];
}

function bardVest(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const V = BARD_VEST;
  const t = body.torsoMesh;
  const c = t.getBoundingInfo().boundingBox.extendSize;
  const cx = c.x * t.scaling.x, cy = c.y * t.scaling.y;
  // the vest is the chest's own two solids (the torso's swell and the shoulder yoke's hull over it) a skin larger
  const vestCloth = getMaterialFactory().get("cloth", team.scale(V.shade), { emissiveIntensity: V.glow });
  const yoke = body.allMeshes.find((m) => /_yoke$/.test(m.name));
  const shells: Mesh[] = [];
  for (const src of yoke ? [t, yoke] : [t]) {
    const shell = src.clone(src === t ? "bardVest" : "bardVestYoke", src.parent, true);
    shell.makeGeometryUnique();
    shell.scaling.set(src.scaling.x * V.wide, src.scaling.y * V.long, src.scaling.z * V.deep);
    shell.material = vestCloth;
    shells.push(shell);
  }
  const vestFront = (y: number) => Math.max(...shells.map((m) => frontAt(m, y)));
  // The V: from the collar's two corners down to a point on the chest, laid on the vest's front (which leans back toward the collar)
  const top = t.position.y + cy * 0.94, tip = top - cy * 2 * V.down;
  const zTop = vestFront(top - cy * 0.08) + V.proud * cx, zTip = vestFront(tip) + V.proud * cx;
  const half = cx * V.v;
  const vee = panel(scene, "bardVestV", [new Vector3(0, tip, zTip), new Vector3(-half, top, zTop), new Vector3(half, top, zTop)]);
  vee.parent = t.parent;
  vee.material = bardTunicCloth(team);
  const out: Mesh[] = [...shells, vee];
  // cords laced across the V: an X of thin brown bars between its sides
  const cord = getMaterialFactory().get("cloth", V.cord, { emissiveIntensity: V.glow });
  const lean = Math.atan2(zTop - zTip, top - tip);
  for (let i = 0; i < V.laces; i++) {
    const f0 = 0.3 + i * 0.3, f1 = f0 + 0.3; // fractions of the way up the V
    for (const side of [-1, 1]) {
      const y0 = tip + (top - tip) * f0, y1 = tip + (top - tip) * Math.min(0.95, f1);
      const x0 = side * half * f0 * 0.8, x1 = -side * half * Math.min(0.95, f1) * 0.8;
      const len = Math.hypot(x1 - x0, (y1 - y0) / Math.cos(lean));
      const bar = MeshBuilder.CreateBox("bardVestLace", { width: len, height: cx * 0.05, depth: cx * 0.03 }, scene);
      bar.parent = t.parent;
      const my = (y0 + y1) / 2;
      bar.position.set((x0 + x1) / 2, my, zTip + (zTop - zTip) * ((my - tip) / (top - tip)) + cx * 0.02);
      bar.rotation.set(-lean, 0, Math.atan2(y1 - y0, x1 - x0));
      bar.material = cord;
      out.push(bar);
    }
  }
  // two beige toggles at the V's top corners
  const bone = getMaterialFactory().get("cloth", V.bone, { emissiveIntensity: V.glow });
  for (const side of [-1, 1]) {
    const toggle = MeshBuilder.CreateCylinder("bardVestToggle", { height: cx * V.toggle * 1.6, diameter: cx * V.toggle * 0.7, tessellation: 6 }, scene);
    toggle.parent = t.parent;
    toggle.rotation.z = Math.PI / 2 + side * 0.25;
    toggle.position.set(side * half * 0.75, top - cy * 0.14, zTop + cx * 0.04);
    toggle.material = bone;
    out.push(toggle);
  }
  return out;
}

/*
 * [S] the Squire's tabard (356; medieval.squire.red.png, card Appearance "a basic tabard"): a beige cross pattee across the chest, its four arms flaring from a
 * narrow middle to broad square ends, the side arms reaching nearly to the tabard's edges and the upright from the collar to the belt; a beige band round the hem of
 * the tabard skirt; beige edging over each shoulder. Cross SQUIRE_TABARD.span of the tabard's half-width across, its arms SQUIRE_TABARD.waist of that at the middle
 * and SQUIRE_TABARD.end at their ends; hem band SQUIRE_TABARD.hem of the skirt's length; shoulder edges SQUIRE_TABARD.edge of the chest half-width wide.
 */
const SQUIRE_TABARD = {
  span: 0.86, up: 0.85, down: 0.75, waist: 0.14, end: 0.42, hem: 0.12, edge: 0.3, proud: 0.015,
  beige: new Color3(0.88, 0.8, 0.62), glow: 0.08,
};

/** The trim, fitted to the tabard (a skin over the torso) and the tabard skirt unitFactory hangs from the hips. */
export function squireTabardTrim(scene: Scene, body: ArticulatedBody, tabard: Mesh, skirt: Mesh): Mesh[] {
  const S = SQUIRE_TABARD;
  const beige = getMaterialFactory().get("cloth", S.beige, { emissiveIntensity: S.glow });
  const tb = tabard.getBoundingInfo().boundingBox.extendSize;
  const tx = tb.x * tabard.scaling.x, ty = tb.y * tabard.scaling.y;
  const t = body.torsoMesh;
  const cy = t.getBoundingInfo().boundingBox.extendSize.y * t.scaling.y;
  const proud = S.proud * tx;
  // the cross: its middle on the chest line, each arm a flat trapezoid laid on the tabard's front
  const y0 = t.position.y + cy * 0.25;
  const z = (y: number) => Math.max(frontAt(tabard, y), chestFrontAt(body, y)) + proud;
  const z0 = z(y0);
  const w0 = tx * S.waist, w1 = tx * S.end;
  const yUp = y0 + (t.position.y + cy - y0) * S.up, yDown = y0 - (y0 - (t.position.y - cy)) * S.down;
  const arms: Vector3[][] = [
    [new Vector3(-w0, y0, z0), new Vector3(-w1, yUp, z(yUp)), new Vector3(w1, yUp, z(yUp)), new Vector3(w0, y0, z0)],
    [new Vector3(-w0, y0, z0), new Vector3(w0, y0, z0), new Vector3(w1, yDown, z(yDown)), new Vector3(-w1, yDown, z(yDown))],
  ];
  const xs = tx * S.span, hy0 = w0 * (ty / tx) * 0.6, hy1 = w1 * 0.7;
  for (const side of [-1, 1]) {
    arms.push([new Vector3(0, y0 - hy0, z0), new Vector3(side * xs, y0 - hy1, z0), new Vector3(side * xs, y0 + hy1, z0), new Vector3(0, y0 + hy0, z0)]);
  }
  const out: Mesh[] = [];
  for (const pts of arms) {
    const arm = panel(scene, "squireCross", pts);
    arm.parent = tabard.parent;
    arm.material = beige;
    out.push(arm);
  }
  // the hem band round the foot of the tabard skirt
  const sb = skirt.getBoundingInfo().boundingBox.extendSize;
  const hemTall = sb.y * 2 * S.hem;
  const hem = MeshBuilder.CreateCylinder("squireHem", { height: hemTall, diameterTop: sb.x * 2 * 1.02, diameterBottom: sb.x * 2 * 1.05, tessellation: 6 }, scene);
  hem.convertToFlatShadedMesh();
  hem.parent = skirt;
  hem.position.y = -sb.y + hemTall / 2;
  hem.material = beige;
  out.push(hem);
  // beige edging over each shoulder, front to back across the tabard's top corners
  const topY = t.position.y + cy * 0.82;
  const zf = Math.max(frontAt(tabard, topY), chestFrontAt(body, topY));
  for (const side of [-1, 1]) {
    const edge = MeshBuilder.CreateBox("squireShoulderEdge", { width: tx * S.edge, height: cy * 0.12, depth: zf * 2.08 }, scene);
    edge.parent = tabard.parent;
    edge.position.set(side * tx * 0.82, topY, tabard.position.z);
    edge.rotation.z = -side * 0.35;
    edge.material = beige;
    out.push(edge);
  }
  return out;
}

/*
 * [S] the King's beard (356; medieval.king.red.png, card Appearance "a dirty blonde beard"): a full faceted dirty-blonde beard over the jaw and chin, wider than
 * the chin and hanging below it in a blunt point, and a moustache across the upper lip whose two halves droop out to the beard at the mouth's corners. In head
 * half-extents: beard KING_BEARD.wide of the head across, KING_BEARD.down head heights below the chin, KING_BEARD.deep of the half-depth thick, its top at
 * KING_BEARD.top of the half-height below the head's middle; moustache halves KING_BEARD.tache long, at KING_BEARD.lip below the middle, drooping KING_BEARD.droop.
 */
const KING_BEARD = {
  wide: 1.6, down: 0.5, deep: 0.9, top: 0.12, tache: 0.5, lip: 0.2, droop: 0.4, jitter: 0.14,
  blonde: new Color3(0.88, 0.62, 0.28), glow: 0.12,
};

function kingBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const B = KING_BEARD;
  const hair = getMaterialFactory().get("cloth", B.blonde, { emissiveIntensity: B.glow });
  const tall = e.y * (1 - B.top) + e.y * 2 * B.down;
  const beard = MeshBuilder.CreateIcoSphere("kingBeard", { radius: 1, subdivisions: 1, flat: true }, scene);
  jitterVertices(beard, B.jitter, 37.3, e.x * 1.08 * B.wide, tall * 0.5, e.z * B.deep);
  // drawn to a blunt point under the chin: the lower half narrows toward its foot
  const pos = beard.getVerticesData("position")!;
  for (let i = 0; i < pos.length; i += 3) if (pos[i + 1] < 0) pos[i] *= 1 + (pos[i + 1] / (tall * 0.5)) * 0.45;
  beard.setVerticesData("position", pos);
  beard.position.set(0, -e.y * B.top - tall * 0.5, e.z * 0.82);
  beard.material = hair;
  beard.parent = body.headMesh;
  const out = [beard];
  for (const side of [-1, 1]) {
    const tache = MeshBuilder.CreateCylinder("kingMoustache", { height: e.x * B.tache, diameterTop: e.y * 0.2, diameterBottom: e.y * 0.08, tessellation: 5 }, scene);
    tache.convertToFlatShadedMesh();
    tache.rotation.z = side * (Math.PI / 2 - B.droop);
    tache.position.set(side * e.x * B.tache * 0.42, -e.y * B.lip - e.x * B.tache * 0.2, e.z * 1.04);
    tache.material = hair;
    tache.parent = body.headMesh;
    out.push(tache);
  }
  return out;
}

/*
 * [S] the Knight's cuirass (357; medieval.knight.png, card Appearance "plate armor covering most of its body"): a grey steel breastplate over the whole chest in
 * place of the team tabard, and below the waist a fauld of overlapping steel lames over the hips. The breastplate is the chest's own two solids (the torso's
 * swell and the shoulder yoke's hull) a skin larger: KNIGHT_PLATE.wide across, .deep front to back; the fauld is the steel skirt unitFactory hangs from the hips,
 * banded by KNIGHT_PLATE.lames rings each standing .proud of it in a darker steel (.edge) so the lames read; a waist rim the same. Steel the armet's (ARMET.steel).
 */
const KNIGHT_PLATE = {
  wide: 1.07, deep: 1.1, lames: 2, proud: 1.05, rim: 0.12,
  steel: new Color3(0.6, 0.6, 0.65), edge: new Color3(0.44, 0.44, 0.48), glow: 0.05,
};

/** The plate, fitted to the chest and to the steel fauld hung from his hips. */
export function knightCuirass(scene: Scene, body: ArticulatedBody, fauld: Mesh): Mesh[] {
  const K = KNIGHT_PLATE;
  const steel = getMaterialFactory().get("stone", K.steel, { emissiveIntensity: K.glow });
  const edge = getMaterialFactory().get("stone", K.edge, { emissiveIntensity: K.glow });
  const t = body.torsoMesh;
  const yoke = body.allMeshes.find((m) => /_yoke$/.test(m.name));
  const out: Mesh[] = [];
  for (const src of yoke ? [t, yoke] : [t]) {
    const shell = src.clone(src === t ? "knightCuirass" : "knightCuirassYoke", src.parent, true);
    shell.makeGeometryUnique();
    shell.scaling.set(src.scaling.x * K.wide, src.scaling.y, src.scaling.z * K.deep);
    shell.material = steel;
    out.push(shell);
  }
  // the fauld's lames: darker steel rings round the skirt, evenly down it, and a rim at the waist
  const fb = fauld.getBoundingInfo().boundingBox.extendSize;
  const verts = fauld.getVerticesData("position") ?? [];
  let rTop = 0;
  for (let i = 0; i < verts.length; i += 3) if (verts[i + 1] > fb.y * 0.99) rTop = Math.max(rTop, Math.hypot(verts[i], verts[i + 2]));
  const rBot = fb.x;
  const tall = fb.y * 2 * K.rim;
  for (let k = 0; k <= K.lames; k++) {
    const f = k / (K.lames + 1); // 0 at the waist
    const y = fb.y - tall / 2 - f * (fb.y * 2 - tall);
    const r = rTop + (rBot - rTop) * (fb.y - y) / (fb.y * 2);
    const ring = MeshBuilder.CreateCylinder("knightLame", { height: tall, diameterTop: r * 2 * K.proud, diameterBottom: (r + (rBot - rTop) * K.rim) * 2 * K.proud, tessellation: 6 }, scene);
    ring.convertToFlatShadedMesh();
    ring.parent = fauld;
    ring.position.y = y;
    ring.material = edge;
    out.push(ring);
  }
  return out;
}

/*
 * [S] the King's cape (357; medieval.king.jpg, card Appearance "an elegant medium-sized cape with golden buttons and straps"): a cream cape hung off the shoulders
 * down the back to mid-thigh, its top edge wrapped round the backs of the shoulders, falling in a gentle flare and standing off the back; over each shoulder a
 * cream flap that comes forward onto the chest and ends in a gold button. In chest half-extents: top edge MEDIEVAL_CAPE.top wide round the back at the
 * collar, hem .hem wide, .drop of the knee's depth below the hip, .off of the back's depth behind it; the arc .wrap rad either side of straight back; flaps
 * .flap of the chest half-width wide; buttons .button of it across. Cloth MEDIEVAL_CAPE.cream, buttons .gold. Written for any medieval caped man (colour in).
 */
const MEDIEVAL_CAPE = {
  top: 1.2, hem: 1.75, drop: 0.6, off: 0.35, wrap: 1.45, rows: 4, flap: 0.5, button: 0.24,
  cream: new Color3(0.95, 0.88, 0.7), gold: new Color3(0.93, 0.7, 0.25), glow: 0.28,
};

/** The furthest-back point of the chest (the torso and the shoulder yoke), in the torso joint's units. */
function chestBack(body: ArticulatedBody): number {
  let back = 0;
  const yoke = body.allMeshes.find((m) => /_yoke$/.test(m.name));
  for (const m of yoke ? [body.torsoMesh, yoke] : [body.torsoMesh]) {
    const v = m.getVerticesData("position") ?? [];
    for (let i = 2; i < v.length; i += 3) back = Math.min(back, v[i] * m.scaling.z + m.position.z);
  }
  return back;
}

/** `skin` scales the back it hangs off (a cuirass over the chest stands that much deeper); `drop`, `hemWide`, `glow` override MEDIEVAL_CAPE.drop, .hem, .glow. */
function medievalCape(scene: Scene, body: ArticulatedBody, cloth: Color3, skin = 1, drop = MEDIEVAL_CAPE.drop, hemWide = MEDIEVAL_CAPE.hem, glow = MEDIEVAL_CAPE.glow): Mesh[] {
  const C = MEDIEVAL_CAPE;
  const t = body.torsoMesh;
  const c = t.getBoundingInfo().boundingBox.extendSize;
  const cx = c.x * t.scaling.x, cy = c.y * t.scaling.y;
  const back = -chestBack(body) * skin;
  const top = t.position.y + cy * 0.92;
  const hipY = -body.torso.position.y; // the hip joint, in the torso joint's frame
  const hemY = hipY - Math.abs(body.leftKnee.position.y) * drop;
  const rows: Vector3[][] = [];
  for (let r = 0; r <= C.rows; r++) {
    const f = r / C.rows; // 0 at the collar, 1 at the hem
    const y = top + (hemY - top) * f;
    const wide = cx * (C.top + (hemWide - C.top) * f);
    const deep = back * (1.06 + C.off * f);
    const row: Vector3[] = [];
    for (let i = 0; i <= 10; i++) {
      const phi = -C.wrap + (i / 10) * 2 * C.wrap;
      row.push(new Vector3(Math.sin(phi) * wide, y, -Math.cos(phi) * deep - back * C.off * f * 0.5));
    }
    rows.push(row);
  }
  const capeCloth = getMaterialFactory().get("cloth", cloth, { emissiveIntensity: glow });
  const cape = MeshBuilder.CreateRibbon("medievalCape", { pathArray: rows, sideOrientation: Mesh.DOUBLESIDE }, scene);
  cape.convertToFlatShadedMesh();
  cape.parent = body.torso;
  cape.material = capeCloth;
  const out: Mesh[] = [cape];
  // a flap over each shoulder from the cape's edge forward onto the chest, a gold button at its front end
  const gold = getMaterialFactory().get("cloth", C.gold, { emissiveIntensity: C.glow });
  const zFront = chestFrontAt(body, top - cy * 0.12);
  for (const side of [-1, 1]) {
    const x = side * cx * 0.72;
    const flap = MeshBuilder.CreateBox("medievalCapeFlap", { width: cx * C.flap, height: cy * 0.1, depth: back + zFront }, scene);
    flap.parent = body.torso;
    flap.position.set(x, top + cy * 0.04, (zFront - back) / 2);
    flap.rotation.z = -side * 0.3;
    flap.material = capeCloth;
    out.push(flap);
    const button = MeshBuilder.CreateCylinder("medievalCapeButton", { height: cx * 0.06, diameter: cx * C.button, tessellation: 8 }, scene);
    button.parent = body.torso;
    button.rotation.x = Math.PI / 2;
    button.position.set(x, top - cy * 0.1, zFront + cx * 0.04);
    button.material = gold;
    out.push(button);
  }
  return out;
}

const KNIGHT_CAPE = { shade: 0.85, clear: 1.03, drop: 0.95, hem: 2.3, glow: 0.06 };

function knightCape(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  return medievalCape(scene, body, team.scale(KNIGHT_CAPE.shade), KNIGHT_PLATE.deep * KNIGHT_CAPE.clear, KNIGHT_CAPE.drop, KNIGHT_CAPE.hem, KNIGHT_CAPE.glow);
}

/** `n` thin upright strips evenly round a limbShell of the same span, standing just proud of its faces (puffed-cloth folds or slashes). */
function shellStripes(scene: Scene, name: string, limb: Mesh, from: number, to: number, out: number, n: number, mat: Material): Mesh[] {
  const L = limbBox(limb);
  const yTop = L.mid + L.half - from * L.half * 2, yBot = L.mid + L.half - to * L.half * 2;
  const r = Math.max(L.wide, L.deep) * out * 0.93;
  const zs = L.deep / Math.max(L.wide, L.deep) * 1.08;
  const strips: Mesh[] = [];
  for (let k = 0; k < n; k++) {
    const a = ((k + 0.5) / n) * Math.PI * 2;
    const s = MeshBuilder.CreateBox(name, { width: r * 0.2, height: (yTop - yBot) * 0.96, depth: r * 0.22 }, scene);
    s.parent = limb.parent;
    s.position.set(Math.sin(a) * r, (yTop + yBot) / 2, Math.cos(a) * r * zs);
    s.rotation.y = a;
    s.material = mat;
    strips.push(s);
  }
  return strips;
}

/*
 * [S] the King's royal dress (358; medieval.king.red.png, card Appearance "a short-sleeved blouse with golden-yellow designs around the collar and sleeves ... a
 * thick basic leather brown belt with a golden buckle ... puffy pantaloons with golden yellow folds ... leggings with brown, buckled shoes"):
 * - puffed short sleeves: team shells KING_DRESS.puff of the upper arm's half-width round it, to .sleeve of its length, KING_DRESS.stripes gold folds round
 *   each and a gold cuff band at the foot;
 * - a gold collar opening in a V on the chest's visible front (chestFrontAt), from the neck .collar of the chest half-width out and .vee of its height down;
 * - a brown belt round the waist .belt of the chest height tall, a gold buckle .buckle of the chest half-width square at the front;
 * - puffy pantaloons: team shells .pants of the thigh's half-width round it, the same gold folds;
 * - beige stockings: shells .hose of the shin's half-width; brown shoes with a gold buckle on the instep.
 */
const KING_DRESS = {
  puff: 1.55, sleeve: 0.7, stripes: 4, pants: 1.5, hose: 1.1, collar: 0.5, vee: 0.42, belt: 0.16, buckle: 0.28,
  gold: new Color3(0.95, 0.7, 0.22), leather: new Color3(0.42, 0.24, 0.12), beige: new Color3(0.82, 0.72, 0.52), shoe: new Color3(0.45, 0.27, 0.14),
  shade: 0.92, glow: 0.12,
};

function kingDress(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const K = KING_DRESS;
  const mats = getMaterialFactory();
  const cloth = mats.get("cloth", team.scale(K.shade), { emissiveIntensity: K.glow });
  const gold = mats.get("cloth", K.gold, { emissiveIntensity: K.glow });
  const leather = mats.get("cloth", K.leather, { emissiveIntensity: K.glow });
  const beige = mats.get("cloth", K.beige, { emissiveIntensity: K.glow });
  const shoe = mats.get("cloth", K.shoe, { emissiveIntensity: K.glow });
  const out: Mesh[] = [];
  // puffed sleeves, gold folds, gold cuff band
  for (const upper of [body.leftUpperArm, body.rightUpperArm]) {
    out.push(limbShell(scene, "kingSleeve", upper, 0, K.sleeve, K.puff, cloth));
    out.push(...shellStripes(scene, "kingSleeveFold", upper, 0.04, K.sleeve - 0.08, K.puff, K.stripes, gold));
    out.push(limbShell(scene, "kingSleeveCuff", upper, K.sleeve - 0.1, K.sleeve, K.puff * 1.06, gold));
  }
  // [S] re-land (359): puffy pantaloons ballooning out round the thigh and gathered at a gold band just above the knee, gold folds following the puff; beige
  // stockings from the knee to the shoe, clear of the pantaloons
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) out.push(...kingPantaloon(scene, thigh, cloth, gold));
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) out.push(limbShell(scene, "kingStocking", shin, 0, 0.96, K.hose, beige));
  // brown shoes, gold buckle on the instep
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const m of knee.getChildMeshes(true)) {
      if (!/_[lr]FootM$/.test(m.name)) continue;
      m.material = shoe;
      const fb = m.getBoundingInfo().boundingBox;
      const buckle = MeshBuilder.CreateBox("kingShoeBuckle", { width: fb.extendSize.x * 0.9, height: fb.extendSize.y * 0.5, depth: fb.extendSize.z * 0.3 }, scene);
      buckle.parent = m;
      buckle.position.set(fb.center.x, fb.maximum.y, fb.center.z + fb.extendSize.z * 0.35);
      buckle.material = gold;
      out.push(buckle);
    }
  }
  // gold collar in a V on the chest
  const t = body.torsoMesh;
  const c = t.getBoundingInfo().boundingBox.extendSize;
  const cx = c.x * t.scaling.x, cy = c.y * t.scaling.y;
  const top = t.position.y + cy * 0.93;
  const zc = (y: number) => chestFrontAt(body, y) + cx * 0.03;
  for (const side of [-1, 1]) {
    const lapel = panel(scene, "kingCollar", [
      new Vector3(side * cx * 0.14, top, zc(top)),
      new Vector3(side * cx * K.collar, top - cy * 0.03, zc(top - cy * 0.03)),
      new Vector3(side * cx * K.collar * 0.55, top - cy * K.vee * 0.6, zc(top - cy * K.vee * 0.6)),
      new Vector3(side * cx * 0.04, top - cy * K.vee, zc(top - cy * K.vee)),
    ]);
    lapel.parent = t.parent;
    lapel.material = gold;
    out.push(lapel);
  }
  // brown belt round the waist, gold buckle at the front
  const beltY = t.position.y - cy * 0.82;
  let half = 0;
  const v = t.getVerticesData("position") ?? [];
  for (let i = 0; i < v.length; i += 3) half = Math.max(half, Math.abs(v[i] * t.scaling.x));
  const zFront = chestFrontAt(body, beltY);
  const belt = MeshBuilder.CreateCylinder("kingBelt", { height: cy * K.belt, diameter: half * 2 * 1.04, tessellation: 8 }, scene);
  belt.convertToFlatShadedMesh();
  belt.scaling.z = (zFront * 1.08) / (half * 1.04);
  belt.parent = t.parent;
  belt.position.set(0, beltY, t.position.z);
  belt.material = leather;
  out.push(belt);
  const buckle = MeshBuilder.CreateBox("kingBeltBuckle", { width: cx * K.buckle, height: cy * K.belt * 1.35, depth: cx * 0.06 }, scene);
  buckle.parent = t.parent;
  buckle.position.set(0, beltY, zFront * 1.08 + cx * 0.02);
  buckle.material = gold;
  out.push(buckle);
  return out;
}

/** The puff of a pantaloon leg, top to foot: [share of the thigh's length down, radius in thigh half-widths]; it ends KING_PANTS.knee down at a gold band. */
const KING_PANTS = { knee: 0.8, profile: [[0, 1.15], [0.2, 1.45], [0.5, 1.7], [0.78, 1.5], [1, 1.1]] as [number, number][], band: 1.18, folds: 4 };

function kingPantaloon(scene: Scene, thigh: Mesh, cloth: Material, gold: Material): Mesh[] {
  const P = KING_PANTS;
  const L = limbBox(thigh);
  const r0 = Math.max(L.wide, L.deep);
  const yTop = L.mid + L.half, len = L.half * 2 * P.knee;
  const zs = L.deep / r0 * 1.08;
  const shape = P.profile.map(([f, r]) => new Vector3(r * r0, -f * len, 0));
  const puff = MeshBuilder.CreateLathe("kingPantaloon", { shape, tessellation: 8, cap: Mesh.CAP_ALL }, scene);
  puff.convertToFlatShadedMesh();
  puff.scaling.z = zs;
  puff.parent = thigh.parent;
  puff.position.y = yTop;
  puff.material = cloth;
  const out: Mesh[] = [puff];
  // gold folds down the puff, just proud of it
  for (let k = 0; k < P.folds; k++) {
    const a = ((k + 0.5) / P.folds) * Math.PI * 2;
    const path = P.profile.slice(0, -1).map(([f, r]) => new Vector3(Math.sin(a) * r * r0 * 1.02, yTop - f * len, Math.cos(a) * r * r0 * 1.02 * zs));
    const fold = MeshBuilder.CreateTube("kingPantaloonFold", { path, radius: r0 * 0.09, tessellation: 4, cap: Mesh.CAP_ALL }, scene);
    fold.convertToFlatShadedMesh();
    fold.parent = thigh.parent;
    fold.material = gold;
    out.push(fold);
  }
  // the gathered gold band at the foot
  const band = MeshBuilder.CreateCylinder("kingPantaloonBand", { height: len * 0.09, diameter: r0 * 2 * P.band, tessellation: 8 }, scene);
  band.convertToFlatShadedMesh();
  band.scaling.z = zs;
  band.parent = thigh.parent;
  band.position.y = yTop - len * 0.96;
  band.material = gold;
  out.push(band);
  return out;
}

/** A limb mesh's extent in its joint's frame: its middle height, half-height and half-width (x) and half-depth (z). */
function limbBox(limb: Mesh): { mid: number; half: number; wide: number; deep: number } {
  const b = limb.getBoundingInfo().boundingBox;
  return {
    mid: limb.position.y + b.center.y * limb.scaling.y, half: b.extendSize.y * limb.scaling.y,
    wide: b.extendSize.x * limb.scaling.x, deep: b.extendSize.z * limb.scaling.z,
  };
}

/** A tapered faceted sleeve round a limb, in its joint's frame, from `from` to `to` of the way down it (0 its top, 1 its foot). */
function limbShell(scene: Scene, name: string, limb: Mesh, from: number, to: number, out: number, mat: Material): Mesh {
  const L = limbBox(limb);
  const yTop = L.mid + L.half - from * L.half * 2, yBot = L.mid + L.half - to * L.half * 2;
  const r = Math.max(L.wide, L.deep) * out;
  const shell = MeshBuilder.CreateCylinder(name, { height: yTop - yBot, diameterTop: r * 2, diameterBottom: r * 2 * 0.86, tessellation: 6 }, scene);
  shell.convertToFlatShadedMesh();
  shell.scaling.z = L.deep / Math.max(L.wide, L.deep) * 1.08;
  shell.parent = limb.parent;
  shell.position.y = (yTop + yBot) / 2;
  shell.material = mat;
  return shell;
}

/*
 * [S] the Squire's lower legs (357; medieval.squire.blue.png): grey steel greaves from the knee down into the shoe, a rounded grey knee cop over each knee,
 * brown shoes. Greaves SQUIRE_LEGS.out of the shin's half-width round it, from .from of the shin down into the shoe; knee cops .cop of the shin's top across,
 * standing .ahead in front of the knee; shoes .shoe brown, a darker strap round the ankle.
 */
const SQUIRE_LEGS = {
  out: 1.32, from: 0.06, cop: 1.25, ahead: 0.55,
  iron: new Color3(0.46, 0.47, 0.5), shoe: new Color3(0.5, 0.3, 0.17), strap: new Color3(0.32, 0.19, 0.11), glow: 0.08,
};

function squireLegs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = SQUIRE_LEGS;
  const iron = getMaterialFactory().get("stone", S.iron, { emissiveIntensity: S.glow });
  const shoe = getMaterialFactory().get("cloth", S.shoe, { emissiveIntensity: S.glow });
  const strap = getMaterialFactory().get("cloth", S.strap, { emissiveIntensity: S.glow });
  const out: Mesh[] = [];
  for (const [knee, shin] of [[body.leftKnee, body.leftLowerLeg], [body.rightKnee, body.rightLowerLeg]] as const) {
    out.push(limbShell(scene, "squireGreave", shin, S.from, 0.92, S.out, iron));
    const L = limbBox(shin);
    const cop = MeshBuilder.CreateIcoSphere("squireKneeCop", { radius: Math.max(L.wide, L.deep) * S.cop, subdivisions: 1, flat: true }, scene);
    cop.scaling.set(1, 0.85, 0.7);
    cop.parent = knee;
    cop.position.set(0, L.mid + L.half * 0.95, L.deep * S.ahead);
    cop.material = iron;
    out.push(cop);
    for (const m of knee.getChildMeshes(true)) {
      if (!/_[lr]FootM$/.test(m.name)) continue;
      m.material = shoe;
      const fb = m.getBoundingInfo().boundingBox;
      const band = MeshBuilder.CreateBox("squireShoeStrap", { width: fb.extendSize.x * 2.08, height: fb.extendSize.y * 0.22, depth: fb.extendSize.z * 0.9 }, scene);
      band.parent = m;
      band.position.set(fb.center.x, fb.maximum.y - fb.extendSize.y * 0.5, fb.minimum.z + fb.extendSize.z * 0.45);
      band.material = strap;
      out.push(band);
    }
  }
  return out;
}

/*
 * [S] the Squire's arms (358; medieval.squire.blue.png, card Appearance "plate greaves and couters"): beige cloth sleeves from the shoulder to the elbow, a rounded
 * grey couter over each elbow and grey gauntlets over the forearm and hand. Shells, not recolours (unitFactory's tabard block paints the arms mail after the dress
 * runs): sleeves SQUIRE_ARMS.sleeve of the upper arm's half-width round it, gauntlets .gauntlet of the forearm's, couters .couter of it across; steel SQUIRE_LEGS.iron.
 */
const SQUIRE_ARMS = { sleeve: 1.16, gauntlet: 1.4, couter: 1.5, beige: new Color3(0.82, 0.72, 0.52), glow: 0.1 };

function squireArms(scene: Scene, body: ArticulatedBody): Mesh[] {
  const A = SQUIRE_ARMS;
  const beige = getMaterialFactory().get("cloth", A.beige, { emissiveIntensity: A.glow });
  const iron = getMaterialFactory().get("stone", SQUIRE_LEGS.iron, { emissiveIntensity: SQUIRE_LEGS.glow });
  const out: Mesh[] = [];
  for (const upper of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "squireSleeve", upper, 0, 0.96, A.sleeve, beige));
  for (const fore of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "squireGauntlet", fore, 0.12, 1, A.gauntlet, iron));
    const L = limbBox(fore);
    const couter = MeshBuilder.CreateIcoSphere("squireCouter", { radius: Math.max(L.wide, L.deep) * A.couter, subdivisions: 1, flat: true }, scene);
    couter.scaling.set(1, 0.9, 0.85);
    couter.parent = fore.parent;
    couter.position.set(0, L.mid + L.half * 0.92, 0);
    couter.material = iron;
    out.push(couter);
  }
  for (const m of body.allMeshes) if (/_[lr]HandM$/.test(m.name)) m.material = iron;
  return out;
}

/*
 * [S] the Archer's arms (357; medieval.archer.red.png): beige cloth sleeves on the upper arms, brown leather vambraces from the elbow to the wrist with a dark
 * strap at each end. Sleeves ARCHER_ARMS.beige on the upper arm itself; vambraces .out of the forearm's half-width round it, from .from to .to of its length.
 */
const ARCHER_ARMS = {
  out: 1.3, from: 0.08, to: 0.94,
  beige: new Color3(0.74, 0.58, 0.38), leather: new Color3(0.44, 0.27, 0.16), strap: new Color3(0.27, 0.16, 0.1), glow: 0.1,
};

const ARCHER_SLEEVE = { out: 1.15, tan: new Color3(0.84, 0.7, 0.48), glow: 0.14 };

function archerArms(scene: Scene, body: ArticulatedBody): Mesh[] {
  const A = ARCHER_ARMS;
  const beige = getMaterialFactory().get("cloth", A.beige, { emissiveIntensity: A.glow });
  const leather = getMaterialFactory().get("cloth", A.leather, { emissiveIntensity: A.glow });
  const strap = getMaterialFactory().get("cloth", A.strap, { emissiveIntensity: A.glow });
  const out: Mesh[] = [];
  // [S] the sleeves as cloth shells (359; medieval.archer.red.png: beige-tan sleeves shoulder to elbow): the recoloured arm kept the body shader's grey cast, so
  // each upper arm now wears a tan shell of its own cloth, ARCHER_SLEEVE.out of its half-width round it, the whole upper arm long
  for (const upper of [body.leftUpperArm, body.rightUpperArm]) {
    upper.material = beige;
    out.push(limbShell(scene, "archerSleeve", upper, 0, 0.98, ARCHER_SLEEVE.out, getMaterialFactory().get("cloth", ARCHER_SLEEVE.tan, { emissiveIntensity: ARCHER_SLEEVE.glow })));
  }
  for (const fore of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "archerVambrace", fore, A.from, A.to, A.out, leather));
    for (const at of [A.from + 0.04, A.to - 0.1]) out.push(limbShell(scene, "archerVambraceStrap", fore, at, at + 0.07, A.out * 1.12, strap));
  }
  return out;
}

/** A belt round the waist (the torso's foot) in `mat`, `tall` of the chest height, and its front z; a buckle goes at the returned front. */
function waistBelt(scene: Scene, body: ArticulatedBody, name: string, mat: Material, tall: number): { belt: Mesh; y: number; front: number } {
  const t = body.torsoMesh;
  const cy = t.getBoundingInfo().boundingBox.extendSize.y * t.scaling.y;
  const y = t.position.y - cy * 0.82;
  let half = 0;
  const v = t.getVerticesData("position") ?? [];
  for (let i = 0; i < v.length; i += 3) half = Math.max(half, Math.abs(v[i] * t.scaling.x));
  const front = chestFrontAt(body, y) * 1.08;
  const belt = MeshBuilder.CreateCylinder(name, { height: cy * tall, diameter: half * 2 * 1.04, tessellation: 8 }, scene);
  belt.convertToFlatShadedMesh();
  belt.scaling.z = front / (half * 1.04);
  belt.parent = t.parent;
  belt.position.set(0, y, t.position.z);
  belt.material = mat;
  return { belt, y, front };
}

/** The foot meshes under the knees. */
function feet(body: ArticulatedBody): Mesh[] {
  return [body.leftKnee, body.rightKnee].flatMap((k) => k.getChildMeshes(true).filter((m): m is Mesh => /_[lr]FootM$/.test(m.name)));
}

/*
 * [S] the Bard's legs (358; medieval.bard.blue.png: cream knee socks from the knee down, brown shoes, a team-coloured bow on each ankle). Socks BARD_LEGS.sock
 * shells .out of the shin's half-width round it from .from of it down; shoes .shoe; a bow of two flat loops .bow of the foot's width across and a knot at the
 * front of the ankle, in team x .bowShade.
 */
const BARD_LEGS = { out: 1.16, from: 0.04, bow: 0.55, bowShade: 0.85, sock: new Color3(0.88, 0.84, 0.7), shoe: new Color3(0.5, 0.3, 0.17), glow: 0.12 };

function bardLegs(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const B = BARD_LEGS;
  const sock = getMaterialFactory().get("cloth", B.sock, { emissiveIntensity: B.glow });
  const shoe = getMaterialFactory().get("cloth", B.shoe, { emissiveIntensity: B.glow });
  const ribbon = getMaterialFactory().get("cloth", team.scale(B.bowShade), { emissiveIntensity: B.glow });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) out.push(limbShell(scene, "bardSock", shin, B.from, 0.96, B.out, sock));
  for (const f of feet(body)) {
    f.material = shoe;
    const fb = f.getBoundingInfo().boundingBox;
    const ex = fb.extendSize;
    const y = fb.maximum.y + ex.y * 0.1, z = fb.center.z + ex.z * 0.15;
    for (const side of [-1, 1]) {
      const loop = MeshBuilder.CreateBox("bardShoeBow", { width: ex.x * B.bow, height: ex.y * 0.7, depth: ex.z * 0.12 }, scene);
      loop.parent = f;
      loop.position.set(fb.center.x + side * ex.x * B.bow * 0.55, y, z);
      loop.rotation.z = side * 0.35;
      loop.material = ribbon;
      out.push(loop);
    }
    const knot = MeshBuilder.CreateBox("bardShoeBowKnot", { width: ex.x * 0.3, height: ex.y * 0.4, depth: ex.z * 0.16 }, scene);
    knot.parent = f;
    knot.position.set(fb.center.x, y, z + ex.z * 0.02);
    knot.material = ribbon;
    out.push(knot);
  }
  return out;
}

/*
 * [S] the Archer's belt and boots (358; medieval.archer.red.png: a brown belt at the waist, brown knee boots with a turned-down cuff). Belt ARCHER_KIT.belt of the
 * chest height in .leather; boots shells .boot of the shin's half-width from .from of it down, a cuff .cuff round its top; feet .leather.
 */
const ARCHER_KIT = { belt: 0.15, boot: 1.24, from: 0.22, cuff: 1.45, leather: new Color3(0.42, 0.25, 0.14), cuffTone: new Color3(0.5, 0.31, 0.18), glow: 0.1 };

function archerKit(scene: Scene, body: ArticulatedBody): Mesh[] {
  const K = ARCHER_KIT;
  const leather = getMaterialFactory().get("cloth", K.leather, { emissiveIntensity: K.glow });
  const cuffMat = getMaterialFactory().get("cloth", K.cuffTone, { emissiveIntensity: K.glow });
  const out: Mesh[] = [waistBelt(scene, body, "archerBelt", leather, K.belt).belt];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "archerBoot", shin, K.from, 1, K.boot, leather));
    out.push(limbShell(scene, "archerBootCuff", shin, K.from - 0.04, K.from + 0.1, K.cuff, cuffMat));
  }
  for (const f of feet(body)) f.material = leather;
  return out;
}

/*
 * [S] the Knight's plate legs (359; medieval.knight.red.png, card "plate armor covering most of its body"): grey steel cuisses over the thighs and greaves
 * over the shins, a rounded knee cop over each knee, grey steel sabatons over the feet with a lame ridge across the instep, and a darker steel lame ring at
 * the top of each greave. Shells (the legs are team cloth under them): cuisses KNIGHT_LEGS.cuisse of the thigh's half-width round it, greaves .greave of the
 * shin's from .from down into the foot, cops .cop of the shin's top across standing .ahead in front of the knee; steel and edge KNIGHT_PLATE's.
 */
const KNIGHT_LEGS = { cuisse: 1.2, greave: 1.28, from: 0.05, cop: 1.3, ahead: 0.5 };

function knightLegs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const K = KNIGHT_LEGS, P = KNIGHT_PLATE;
  const steel = getMaterialFactory().get("stone", P.steel, { emissiveIntensity: P.glow });
  const edge = getMaterialFactory().get("stone", P.edge, { emissiveIntensity: P.glow });
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) out.push(limbShell(scene, "knightCuisse", thigh, 0.02, 0.98, K.cuisse, steel));
  for (const [knee, shin] of [[body.leftKnee, body.leftLowerLeg], [body.rightKnee, body.rightLowerLeg]] as const) {
    out.push(limbShell(scene, "knightGreave", shin, K.from, 0.95, K.greave, steel));
    out.push(limbShell(scene, "knightGreaveLame", shin, K.from, K.from + 0.1, K.greave * 1.1, edge));
    const L = limbBox(shin);
    const cop = MeshBuilder.CreateIcoSphere("knightKneeCop", { radius: Math.max(L.wide, L.deep) * K.cop, subdivisions: 1, flat: true }, scene);
    cop.scaling.set(1, 0.85, 0.7);
    cop.parent = knee;
    cop.position.set(0, L.mid + L.half * 0.95, L.deep * K.ahead);
    cop.material = steel;
    out.push(cop);
  }
  for (const f of feet(body)) {
    f.material = steel;
    const fb = f.getBoundingInfo().boundingBox;
    const ridge = MeshBuilder.CreateBox("knightSabatonLame", { width: fb.extendSize.x * 2.1, height: fb.extendSize.y * 0.3, depth: fb.extendSize.z * 0.25 }, scene);
    ridge.parent = f;
    ridge.position.set(fb.center.x, fb.maximum.y - fb.extendSize.y * 0.2, fb.center.z + fb.extendSize.z * 0.25);
    ridge.material = edge;
    out.push(ridge);
  }
  return out;
}

/** Every medieval unit's own dress; an empty list for a unit with none. */
export function dressMedieval(scene: Scene, body: ArticulatedBody, unitId: string, team: Color3): Mesh[] {
  switch (unitId) {
    case "medieval.healer": return healerTonsure(scene, body);
    case "medieval.archer": return [...archerHood(scene, body, team), ...archerArms(scene, body), ...archerKit(scene, body)];
    case "medieval.bard": return [...bardVest(scene, body, team), ...bardLegs(scene, body, team)];
    case "medieval.king": return [...kingBeard(scene, body), ...medievalCape(scene, body, MEDIEVAL_CAPE.cream), ...kingDress(scene, body, team)];
    case "medieval.squire": return [...squireLegs(scene, body), ...squireArms(scene, body)];
    // [S] the Knight's cape (358; medieval.knight.png, card "a team colored cape"): the king's cape in team cloth (x KNIGHT_CAPE.shade) off the backs of his
    // steel shoulders to the knee (.drop), hung KNIGHT_PLATE.deep x .clear off the back so it clears the cuirass
    case "medieval.knight": return [...knightCape(scene, body, team), ...knightLegs(scene, body)];
    default: return [];
  }
}
