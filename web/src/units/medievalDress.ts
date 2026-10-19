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
const ARCHER_HOOD = {
  out: 1.38, peak: 0.4, chin: 1.12, open: 0.62, brow: 0.58, jaw: -0.82, tail: 1.5,
  cape: { wide: 1.4, drop: 0.32, neck: 0.75 }, shade: 0.5, glow: 0.05, lining: 0.96,
};

function archerHood(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const H = ARCHER_HOOD;
  const cloth = getMaterialFactory().get("cloth", team.scale(H.shade), { emissiveIntensity: H.glow });
  // The shell: rings from the crown (t 0) down to under the chin (t 1); each ring runs from one side of the face round the back to the other.
  const rings = 10, around = 16;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let r = 0; r <= rings; r++) {
    const t = r / rings;
    const theta = t * Math.PI * 0.82;
    const y = Math.cos(theta) * e.y * H.out + (t < 0.2 ? (1 - t / 0.2) * e.y * H.peak : 0) - (t > 0.6 ? (t - 0.6) / 0.4 * e.y * (H.chin - 1) : 0);
    const ring = Math.sin(theta);
    // the face opening: widest at the eyes, shut above the brow and below the jaw
    const yRel = Math.cos(theta);
    const span = (H.brow - H.jaw) / 2, mid = (H.brow + H.jaw) / 2;
    const k = 1 - ((yRel - mid) / span) ** 2;
    const open = k > 0 ? H.open * Math.sqrt(k) : 0;
    for (let i = 0; i <= around; i++) {
      const phi = open + (i / around) * (2 * Math.PI - 2 * open);
      positions.push(Math.sin(phi) * ring * e.x * H.out, y, Math.cos(phi) * ring * e.z * H.out);
    }
  }
  for (let r = 0; r < rings; r++) {
    for (let i = 0; i < around; i++) {
      const a = r * (around + 1) + i, b = a + around + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
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
  return [shell, lining, tail, cape];
}

/*
 * [S] the Healer's robe trim (356; medieval.healer.red.png, .blue.png, card Appearance "a priest robe decorated with two crossed bands"): two gold bands run down
 * the front from the collar to the knee, either side of the middle; a gold band round the hem and round each cuff; a gold turned collar round the neck; a grey rope
 * belt at the waist with its end hanging down the front. Bands HEALER_TRIM.band of the chest's half-width wide at HEALER_TRIM.apart of it off the middle, sunk so
 * only their faces stand HEALER_TRIM.proud proud of the cloth; hem band HEALER_TRIM.hem of the robe's length tall; cuffs at HEALER_TRIM.cuff of the forearm;
 * belt HEALER_TRIM.belt of the chest's half-height thick, its end HEALER_TRIM.knot of the robe's length long.
 */
const HEALER_TRIM = {
  band: 0.17, apart: 0.42, proud: 0.05, hem: 0.08, cuff: 0.75, collar: 0.72, belt: 0.13, knot: 0.42,
  gold: new Color3(0.93, 0.66, 0.24), rope: new Color3(0.42, 0.4, 0.38), glow: 0.12,
};

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
  const top = t.position.y + cy * 0.93;
  const zc = (y: number) => chestFrontAt(body, y) + cx * T.proud * 0.6;
  for (const side of [-1, 1]) {
    const pts = [
      new Vector3(side * cx * 0.16, top, zc(top)),
      new Vector3(side * cx * T.collar, top - cy * 0.04, zc(top - cy * 0.04)),
      new Vector3(side * cx * T.collar * 0.72, top - cy * 0.34, zc(top - cy * 0.34)),
      new Vector3(side * cx * 0.07, top - cy * 0.52, zc(top - cy * 0.52)),
    ];
    const lapel = panel(scene, "healerCollar", pts);
    lapel.parent = t.parent;
    lapel.material = gold;
    out.push(lapel);
    const zf = zc(top);
    const strip = MeshBuilder.CreateBox("healerCollarShoulder", { width: cx * (T.collar - 0.16), height: cy * 0.06, depth: zf * 1.9 }, scene);
    strip.parent = t.parent;
    strip.position.set(side * cx * (T.collar + 0.16) / 2, top + cy * 0.01, -zf * 0.05);
    strip.rotation.z = -side * 0.22;
    strip.material = gold;
    out.push(strip);
  }
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

function medievalCape(scene: Scene, body: ArticulatedBody, cloth: Color3): Mesh[] {
  const C = MEDIEVAL_CAPE;
  const t = body.torsoMesh;
  const c = t.getBoundingInfo().boundingBox.extendSize;
  const cx = c.x * t.scaling.x, cy = c.y * t.scaling.y;
  const back = -chestBack(body);
  const top = t.position.y + cy * 0.92;
  const hipY = -body.torso.position.y; // the hip joint, in the torso joint's frame
  const hemY = hipY - Math.abs(body.leftKnee.position.y) * C.drop;
  const rows: Vector3[][] = [];
  for (let r = 0; r <= C.rows; r++) {
    const f = r / C.rows; // 0 at the collar, 1 at the hem
    const y = top + (hemY - top) * f;
    const wide = cx * (C.top + (C.hem - C.top) * f);
    const deep = back * (1.06 + C.off * f);
    const row: Vector3[] = [];
    for (let i = 0; i <= 10; i++) {
      const phi = -C.wrap + (i / 10) * 2 * C.wrap;
      row.push(new Vector3(Math.sin(phi) * wide, y, -Math.cos(phi) * deep - back * C.off * f * 0.5));
    }
    rows.push(row);
  }
  const capeCloth = getMaterialFactory().get("cloth", cloth, { emissiveIntensity: C.glow });
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
 * [S] the Archer's arms (357; medieval.archer.red.png): beige cloth sleeves on the upper arms, brown leather vambraces from the elbow to the wrist with a dark
 * strap at each end. Sleeves ARCHER_ARMS.beige on the upper arm itself; vambraces .out of the forearm's half-width round it, from .from to .to of its length.
 */
const ARCHER_ARMS = {
  out: 1.3, from: 0.08, to: 0.94,
  beige: new Color3(0.86, 0.78, 0.6), leather: new Color3(0.44, 0.27, 0.16), strap: new Color3(0.27, 0.16, 0.1), glow: 0.1,
};

function archerArms(scene: Scene, body: ArticulatedBody): Mesh[] {
  const A = ARCHER_ARMS;
  const beige = getMaterialFactory().get("cloth", A.beige, { emissiveIntensity: A.glow });
  const leather = getMaterialFactory().get("cloth", A.leather, { emissiveIntensity: A.glow });
  const strap = getMaterialFactory().get("cloth", A.strap, { emissiveIntensity: A.glow });
  const out: Mesh[] = [];
  for (const upper of [body.leftUpperArm, body.rightUpperArm]) upper.material = beige;
  for (const fore of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "archerVambrace", fore, A.from, A.to, A.out, leather));
    for (const at of [A.from + 0.04, A.to - 0.1]) out.push(limbShell(scene, "archerVambraceStrap", fore, at, at + 0.07, A.out * 1.12, strap));
  }
  return out;
}

/** Every medieval unit's own dress; an empty list for a unit with none. */
export function dressMedieval(scene: Scene, body: ArticulatedBody, unitId: string, team: Color3): Mesh[] {
  switch (unitId) {
    case "medieval.healer": return healerTonsure(scene, body);
    case "medieval.archer": return [...archerHood(scene, body, team), ...archerArms(scene, body)];
    case "medieval.bard": return bardVest(scene, body, team);
    case "medieval.king": return [...kingBeard(scene, body), ...medievalCape(scene, body, MEDIEVAL_CAPE.cream)];
    case "medieval.squire": return squireLegs(scene, body);
    default: return [];
  }
}
