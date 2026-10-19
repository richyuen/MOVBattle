import { Scene, Vector3, Color3, Mesh, MeshBuilder, VertexData } from "@babylonjs/core";
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
  band: 0.17, apart: 0.42, proud: 0.05, hem: 0.08, cuff: 0.75, collar: 0.62, belt: 0.13, knot: 0.42,
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
  // the turned collar: a flat gold ring laid round the neck on the shoulders
  const collar = MeshBuilder.CreateTorus("healerCollar", { diameter: cx * 2 * T.collar, thickness: cy * 0.16, tessellation: 8 }, scene);
  collar.convertToFlatShadedMesh();
  collar.scaling.set(1, 0.7, Math.max(0.75, cz / cx * 1.25));
  collar.parent = t.parent;
  collar.position.y = t.position.y + cy * 0.9;
  collar.material = gold;
  out.push(collar);
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

/** Every medieval unit's own dress; an empty list for a unit with none. */
export function dressMedieval(scene: Scene, body: ArticulatedBody, unitId: string, team: Color3): Mesh[] {
  switch (unitId) {
    case "medieval.healer": return healerTonsure(scene, body);
    case "medieval.archer": return archerHood(scene, body, team);
    default: return [];
  }
}
