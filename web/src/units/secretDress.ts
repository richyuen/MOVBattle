import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, Scene, TransformNode, Vector3, VertexData } from "@babylonjs/core";
import type { Material } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

/*
 * Secret faction cloth, hats and ornaments (loop: new per-unit dress goes here, not into unitFactory or propBuilder).
 */

/** Bare team chest under a narrow dark sash over the right shoulder. */
export function fanBearerSash(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const torso = body.torsoMesh;
  const { center: c, extendSize: s } = torso.getBoundingInfo().boundingBox;
  for (const mesh of [torso, ...body.allMeshes.filter(m => /_yoke$|_[lr]Pad$/.test(m.name))]) {
    mesh.material = body.skinMaterial;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(mesh);
  }
  const dark = team.scale(0.25);
  const cloth = getMaterialFactory().get("cloth", dark, { emissive: dark.scale(0.12) });
  const out: Mesh[] = [];
  // Front and back diagonal runs meet over the right shoulder and left waist.
  for (const front of [-1, 1]) {
    const a = new Vector3(c.x + s.x * 0.82, c.y + s.y * 1.08, c.z + front * s.z * 1.10);
    const b = new Vector3(c.x - s.x * 0.78, c.y - s.y * 0.82, c.z + front * s.z * 1.14);
    const run = b.subtract(a);
    const sash = MeshBuilder.CreateBox("fanBearerSash", {
      width: s.x * 0.31, height: run.length(), depth: s.z * 0.15,
    }, scene);
    sash.parent = torso; sash.position.copyFrom(a.add(b).scale(0.5));
    sash.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), run.normalize(), new Quaternion());
    sash.material = cloth; out.push(sash);
  }
  const bridge = MeshBuilder.CreateBox("fanBearerSashShoulder", {
    width: s.x * 0.34, height: s.y * 0.16, depth: s.z * 2.32,
  }, scene);
  bridge.parent = torso; bridge.position.set(c.x + s.x * 0.82, c.y + s.y * 1.10, c.z);
  bridge.material = cloth; out.push(bridge);
  return out;
}

/** A node's world origin read into `frame`'s local space. */
function originIn(node: TransformNode, frame: TransformNode): Vector3 {
  for (let n: TransformNode | null = node; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
  for (let n: TransformNode | null = frame; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
  return Vector3.TransformCoordinates(node.getAbsolutePosition(), Matrix.Invert(frame.getWorldMatrix()));
}

/**
 * [S] 513 the Fan Bearer's layered skirt (secret.fan_bearer.red.png: a dark team wrap skirt from the waist to mid-thigh in three overlapping
 * pieces of falling shade, a lighter under-layer showing below and between two darker front flaps cut on a slant, bare team-skin legs under it;
 * audit 500 a.3 "dark-blue shorts"). Spec in the pelvis frame (its box centre c, half size h; front +z), thigh length read off the knee: an 8-sided
 * under-skirt .r h.x round at the waist flaring .flare to its hem .long of the way from the pelvis top to the knee, .deep h.z/h.x deep; two front
 * flaps .flapW h.x wide over it, .flapOut proud, the left reaching .left of the under-skirt's length and the right .right, each slanted .slant rad.
 * Shades team x .under / .left / .right. The thighs in skin. Own team cloth (LESSONS 449), out of the glow. No generic tunic skirt (unitFactory).
 */
const FAN_SKIRT = { r: 1.18, flare: 1.3, long: 0.62, deep: 1.25, flapW: 1.15, flapOut: 0.06, left: 0.96, right: 0.82, slant: 0.18, under: 0.7, leftShade: 0.42, rightShade: 0.55 };
export function fanBearerSkirt(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const F = FAN_SKIRT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const pelvis = body.allMeshes.find((m) => m.name.endsWith("_pelvis"));
  if (!pelvis) return [];
  const { center: c, extendSize: h, maximum: hi } = pelvis.getBoundingInfo().boundingBox;
  const cloth = (k: number) => { const col = team.scale(k); return mf.get("cloth", col, { emissive: col.scale(0.4), roughness: 1 }); };
  const kneeY = (originIn(body.leftKnee, pelvis).y + originIn(body.rightKnee, pelvis).y) / 2;
  const top = hi.y, hem = top + (kneeY - top) * F.long, long = top - hem;
  const out: Mesh[] = [];
  const under = MeshBuilder.CreateCylinder("fanBearerSkirt", { height: long, diameterTop: h.x * 2 * F.r, diameterBottom: h.x * 2 * F.r * F.flare, tessellation: 8 }, scene);
  under.parent = pelvis; under.position.set(c.x, top - long / 2, c.z); under.scaling.z = (h.z * F.deep) / (h.x * F.r); under.rotation.y = Math.PI / 8;
  under.material = cloth(F.under); out.push(under);
  // the flaps lean out with the under-skirt's flare, standing .flapOut off it
  const zTop = h.z * F.deep, flareOut = zTop * (F.flare - 1), lean = Math.atan2(flareOut, long);
  for (const [side, reach, shade] of [[1, F.left, F.leftShade], [-1, F.right, F.rightShade]] as const) {
    const flapLong = long * reach, k = reach / 2;
    const flap = MeshBuilder.CreateBox("fanBearerSkirtFlap", { width: h.x * F.flapW, height: flapLong, depth: h.z * 0.14 }, scene);
    flap.parent = pelvis;
    flap.position.set(c.x + side * h.x * 0.38, top - flapLong / 2, c.z + zTop + flareOut * k + h.z * F.flapOut + (side > 0 ? 0 : h.z * 0.1));
    flap.rotation.set(-lean, 0, side * F.slant); flap.material = cloth(shade); out.push(flap); // hem out (+z)
  }
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) thigh.material = body.skinMaterial;
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/** A chain of 6-sided tapered segments through `pts` (in `parent`'s frame), `root` across at the first point to a point at the last. */
function taper(scene: Scene, name: string, pts: Vector3[], root: number, tip: number, parent: TransformNode, material: Material, out: Mesh[]): void {
  const n = pts.length - 1, up = new Vector3(0, 1, 0);
  for (let k = 0; k < n; k++) {
    const a = pts[k], e = pts[k + 1], d = e.subtract(a);
    const r0 = root + (tip - root) * (k / n), r1 = root + (tip - root) * ((k + 1) / n);
    const seg = MeshBuilder.CreateCylinder(name, { height: d.length() * 1.08, diameterBottom: r0, diameterTop: r1, tessellation: 6 }, scene);
    seg.parent = parent; seg.material = material;
    seg.position.copyFrom(a.add(e).scale(0.5));
    seg.rotationQuaternion = Quaternion.FromUnitVectorsToRef(up, d.normalize(), new Quaternion());
    out.push(seg);
  }
}

export function prisonerShirt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const cream = new Color3(0.88, 0.82, 0.65);
  const cotton = getMaterialFactory().get("unlit", cream, { emissive: cream });
  const glow = scene.getGlowLayerByName("glow");
  for (const mesh of [body.torsoMesh, ...body.allMeshes.filter(mesh => /_yoke$|_[lr]Pad$/.test(mesh.name))]) {
    mesh.material = cotton;
    glow?.addExcludedMesh(mesh);
  }
  const sleeves: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm]) {
    const { center, extendSize: size } = arm.getBoundingInfo().boundingBox;
    const upper = arm === body.leftUpperArm || arm === body.rightUpperArm;
    const bands = upper ? [[0.39, 1.27]] : [[0.14, 0.57], [-0.68, 0.25]];
    for (const [height, length] of bands) {
      const band = MeshBuilder.CreateCylinder("prisonerSleeveBand", {
        height: size.y * length, diameterTop: size.x * 2.42, diameterBottom: size.x * 2.22, tessellation: 8,
      }, scene);
      band.parent = arm;
      band.position.set(center.x, center.y + size.y * height, center.z);
      band.scaling.z = size.z / size.x;
      band.rotation.y = Math.PI / 8;
      band.material = cotton;
      glow?.addExcludedMesh(band);
      sleeves.push(band);
    }
  }
  return sleeves;
}

export function prisonerTrousers(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const cream = new Color3(0.88, 0.82, 0.65);
  const mf = getMaterialFactory();
  const cotton = mf.get("unlit", cream, { emissive: cream });
  const dyed = mf.get("cloth", team, { emissive: team.scale(0.18) });
  const glow = scene.getGlowLayerByName("glow");
  const out: Mesh[] = [];
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) {
    const { center, extendSize: size } = leg.getBoundingInfo().boundingBox;
    const upper = leg === body.leftUpperLeg || leg === body.rightUpperLeg;
    const count = upper ? 3 : 5;
    const edge = upper ? 1 : 0.96;
    const height = size.y * (1 + edge) / count;
    const radius = (index: number) => size.x * (1.19 - index * (upper ? 0.19 : 0.29) / count);
    leg.isVisible = false;
    for (let index = 0; index < count; index++) {
      const band = MeshBuilder.CreateCylinder("prisonerTrouserStripe", {
        height: height * 1.005, diameterTop: radius(index) * 2, diameterBottom: radius(index + 1) * 2, tessellation: 8,
      }, scene);
      band.parent = leg;
      band.position.set(center.x, center.y + size.y - height * (index + 0.5), center.z);
      band.scaling.z = size.z / size.x;
      band.rotation.y = Math.PI / 8;
      band.material = (index + Number(!upper)) % 2 ? dyed : cotton;
      glow?.addExcludedMesh(band);
      out.push(band);
    }
  }
  return out;
}

/** The bead eyes' top, read into the head mesh's frame (LESSONS: the eyes hang off the neck, not the head block). */
function eyeTopInHead(body: ArticulatedBody): number | null {
  const head = body.headMesh, eye = body.leftEye ?? body.rightEye;
  if (!eye) return null;
  for (let n: TransformNode | null = eye; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
  for (let n: TransformNode | null = head; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
  eye.refreshBoundingInfo();
  const inv = Matrix.Invert(head.getWorldMatrix());
  let top = -Infinity;
  for (const v of eye.getBoundingInfo().boundingBox.vectorsWorld) top = Math.max(top, Vector3.TransformCoordinates(v, inv).y);
  return top;
}

export function prisonerCap(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const head = body.headMesh;
  const { center, extendSize } = head.getBoundingInfo().boundingBox;
  const width = extendSize.x * 2;
  const height = extendSize.y * 2;
  const hem = (eyeTopInHead(body) ?? center.y + height * 0.18) + height * 0.015;
  const mf = getMaterialFactory();
  const wool = team.scale(0.48);
  const cream = new Color3(0.88, 0.82, 0.64);
  const cap = MeshBuilder.CreateCylinder("prisonerCap", {
    height: height * 0.29, diameterTop: width * 0.94, diameterBottom: width * 1.12, tessellation: 8,
  }, scene);
  const band = MeshBuilder.CreateCylinder("prisonerCapHem", {
    height: height * 0.105, diameter: width * 1.14, tessellation: 8,
  }, scene);
  cap.material = mf.get("cloth", wool, { emissive: wool.scale(0.12) });
  band.material = mf.get("cloth", cream, { emissive: cream.scale(0.12) });
  cap.position.set(center.x, hem + height * 0.215, center.z);
  band.position.set(center.x, hem + height * 0.0525, center.z);
  for (const mesh of [cap, band]) {
    mesh.parent = head;
    mesh.rotation.y = Math.PI / 8;
    mesh.scaling.z = extendSize.z / extendSize.x;
    mesh.convertToFlatShadedMesh();
  }
  return [cap, band];
}

export function bomberHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const head = body.headMesh;
  const { center, extendSize } = head.getBoundingInfo().boundingBox;
  const w = extendSize.x, h = extendSize.y, d = extendSize.z;
  const ginger = new Color3(0.7, 0.294, 0.07);
  const hair = getMaterialFactory().get("cloth", ginger, { emissive: ginger.scale(0.12) });
  const out: Mesh[] = [];
  const lock = (name: string, x: number, y: number, z: number, sx: number, sy: number, sz: number, tilt: number) => {
    const mesh = MeshBuilder.CreateIcoSphere(name, { radius: 1, subdivisions: 1, flat: true }, scene);
    mesh.parent = head;
    mesh.position.set(center.x + x * w, center.y + y * h, center.z + z * d);
    mesh.scaling.set(sx * w, sy * h, sz * d);
    mesh.rotation.z = tilt;
    mesh.material = hair;
    out.push(mesh);
  };
  lock("bomberHairCrown", 0, 0.68, -0.12, 1.16, 0.66, 1.15, -0.08);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      lock("bomberHairLock", side * (0.94 + i * 0.08), 0.52 - i * 0.41, 0.42 - i * 0.37,
        0.26, 0.45, 0.30, side * (0.55 - i * 0.27));
    }
  }
  for (let i = 0; i < 7; i++) {
    const diameter = 0.39 - i * 0.033;
    lock("bomberHairBraid", (i % 2 ? 0.13 : -0.13) + i * 0.07, 0.06 - i * 0.37, -1.03 - i * 0.065,
      diameter, diameter * 1.22, diameter, i % 2 ? -0.43 : 0.43);
  }
  return out;
}

/**
 * [S] 513 the Bomber's headband (secret.bomb_on_a_stick.red.png: a team-coloured cloth band round the head over the ginger hair, across the
 * forehead just above the eyes, its ends knotted at the back; audit 500 a.2 "none"). Spec in head widths W, heights H, depths D (the head box,
 * centre c; e the eyes' top in the head frame): a 10-sided band .band H tall from .over H above e, .round W across (x D/W for depth, over the
 * crown lock's 1.16 W), centred .back D behind c; a knot (.knot W ico) at its back and two tails .tail H long hanging from it. Own team cloth
 * (team x .shade, LESSONS 449), out of the glow.
 */
const BOMBER_BAND = { band: 0.17, over: 0.03, round: 1.24, back: 0.06, knot: 0.2, tail: 0.38, shade: 0.9 };
export function bomberHeadband(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const B = BOMBER_BAND, glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, bb = head.getBoundingInfo().boundingBox, c = bb.center;
  const W = bb.extendSize.x * 2, H = bb.extendSize.y * 2, D = bb.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const color = team.scale(B.shade);
  const cloth = getMaterialFactory().get("cloth", color, { emissive: color.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const y = e + H * (B.over + B.band / 2), z = c.z - D * B.back;
  const band = MeshBuilder.CreateCylinder("bomberHeadband", { height: H * B.band, diameter: W * B.round, tessellation: 10 }, scene);
  band.parent = head; band.position.set(c.x, y, z); band.scaling.z = (D * 1.2) / (W * B.round); band.rotation.y = Math.PI / 10;
  out.push(band);
  const backZ = z - D * 0.6;
  const knot = MeshBuilder.CreateIcoSphere("bomberHeadbandKnot", { radius: (W * B.knot) / 2, subdivisions: 1, flat: true }, scene);
  knot.parent = head; knot.position.set(c.x, y, backZ); out.push(knot);
  for (const side of [-1, 1]) {
    const tail = MeshBuilder.CreateBox("bomberHeadbandTail", { width: W * 0.1, height: H * B.tail, depth: D * 0.05 }, scene);
    tail.parent = head; tail.position.set(c.x + side * W * 0.07, y - (H * B.tail) / 2, backZ - D * 0.02); tail.rotation.z = side * 0.25;
    out.push(tail);
  }
  for (const m of out) { m.material = cloth; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 513 the Bomber's breeches (secret.bomb_on_a_stick.red.png: baggy team breeches from the waist to just under the knee, a turned-up cuff band
 * round each just below the knee, a lighter stitched square patch on the front of his left thigh, then bare team-skin shins down to the team
 * shoes; audit 500 a.5 "straight legs"). The thigh hidden; per leg a 7-sided lathe in the thigh's box (centre c, half size s) from .top s.y down
 * to .hem m under the knee joint (LESSONS 433: anchor to the joint, not the box), .waist / .bulge / .low s.x round at its top / middle / hem; a cuff
 * on the shin .cuffH m tall from the knee down, .cuff shin widths round; on the left a patch .patch s.x square on the front .patchY of the way up
 * with three cream stitch bars across its outer edge. Pelvis in the breech cloth, shins in skin. Own team cloth (LESSONS 449), out of the glow.
 */
const BOMBER_BREECH = { top: 0.96, hem: -0.06, waist: 1.18, bulge: 1.42, low: 1.22, cuffH: 0.075, cuff: 2.6, patch: 0.85, patchY: 0.45, shade: 0.8 };
export function bomberBreeches(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const B = BOMBER_BREECH, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const color = team.scale(B.shade), patchC = team.scale(1.0), cream = new Color3(0.88, 0.82, 0.65);
  const cloth = mf.get("cloth", color, { emissive: color.scale(0.12), roughness: 1 });
  const patchCloth = mf.get("cloth", patchC, { emissive: patchC.scale(0.2), roughness: 1 });
  const stitch = mf.get("unlit", cream, { emissive: cream });
  const out: Mesh[] = [];
  for (const [thigh, knee, shin, left] of [[body.leftUpperLeg, body.leftKnee, body.leftLowerLeg, true], [body.rightUpperLeg, body.rightKnee, body.rightLowerLeg, false]] as const) {
    const { center: c, extendSize: s } = thigh.getBoundingInfo().boundingBox;
    const hem = (knee.position.y - thigh.position.y + B.hem - c.y) / s.y;
    const at = (f: number) => hem + (B.top - hem) * f;
    const shape = [[0, hem], [B.low, hem], [B.bulge, at(0.4)], [B.bulge * 0.96, at(0.7)], [B.waist, B.top], [0, B.top]]
      .map(([w, h]) => new Vector3(w * s.x, h * s.y, 0));
    const breech = MeshBuilder.CreateLathe("bomberBreech", { shape, tessellation: 7 }, scene);
    breech.parent = thigh; breech.position.copyFrom(c); breech.scaling.z = s.z / s.x; breech.material = cloth;
    out.push(breech);
    thigh.isVisible = false;
    if (left) {
      const front = c.z + s.z * B.bulge * 0.95, y = c.y + s.y * (hem + (B.top - hem) * B.patchY);
      const patch = MeshBuilder.CreateBox("bomberBreechPatch", { width: s.x * B.patch, height: s.x * B.patch, depth: s.z * 0.12 }, scene);
      patch.parent = thigh; patch.position.set(c.x + s.x * 0.15, y, front); patch.rotation.z = 0.12; patch.material = patchCloth;
      out.push(patch);
      for (let k = -1; k <= 1; k++) {
        const bar = MeshBuilder.CreateBox("bomberBreechStitch", { width: s.x * 0.22, height: s.x * 0.06, depth: s.z * 0.06 }, scene);
        bar.parent = thigh; bar.position.set(c.x + s.x * (0.15 + B.patch / 2), y + k * s.x * B.patch * 0.3, front + s.z * 0.06); bar.material = stitch;
        out.push(bar);
      }
    }
    const sc = shin.getBoundingInfo().boundingBox;
    const kneeY = -shin.position.y;
    const cuff = MeshBuilder.CreateCylinder("bomberBreechCuff", { height: B.cuffH, diameter: sc.extendSize.x * B.cuff, tessellation: 7 }, scene);
    cuff.parent = shin; cuff.position.set(sc.center.x, kneeY + B.hem - B.cuffH / 2 + 0.01, sc.center.z); cuff.scaling.z = sc.extendSize.z / sc.extendSize.x;
    cuff.material = cloth; out.push(cuff);
    shin.material = body.skinMaterial;
  }
  const pelvis = body.allMeshes.find((m) => m.name.endsWith("_pelvis"));
  if (pelvis) pelvis.material = cloth;
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

export function executionerHood(scene: Scene, body: ArticulatedBody): Mesh[] {
  const head = body.headMesh;
  const { center, extendSize: size } = head.getBoundingInfo().boundingBox;
  const black = new Color3(0.11, 0.12, 0.15);
  const cloth = getMaterialFactory().get("cloth", black, { emissive: black.scale(0.12) });
  const outline = [
    [0, -1.87], [0.59, -1.87], [0.82, -1.35], [1.04, -0.69],
    [1.1, 0.3], [0.96, 0.82], [0.52, 1.05], [0, 1.09],
  ].map(([radius, height]) => new Vector3(radius * size.x, height * size.y, 0));
  const hood = MeshBuilder.CreateLathe("executionerHood", { shape: outline, tessellation: 10 }, scene);
  hood.parent = head;
  hood.position.copyFrom(center);
  hood.scaling.z = size.z / size.x * 1.13;
  hood.material = cloth;
  hood.convertToFlatShadedMesh();
  head.isVisible = false;
  body.leftEye?.setEnabled(false);
  body.rightEye?.setEnabled(false);
  return [hood];
}

export function executionerVest(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const torso = body.torsoMesh;
  const { center, extendSize } = torso.getBoundingInfo().boundingBox;
  const mf = getMaterialFactory();
  const iron = new Color3(0.45, 0.45, 0.45);
  const buttonColor = iron.scale(0.4);
  const buttons = mf.get("cloth", buttonColor, { emissive: buttonColor.scale(0.12) });
  const sleeves = mf.get("cloth", team.scale(0.24));
  body.leftUpperArm.material = sleeves;
  body.rightUpperArm.material = sleeves;

  const shell = MeshBuilder.CreateCylinder("executionerVest", {
    height: extendSize.y * 1.92,
    diameterTop: extendSize.x * 2.34,
    diameterBottom: extendSize.x * 2.18,
    tessellation: 8,
  }, scene);
  shell.parent = torso;
  shell.position.copyFrom(center);
  shell.rotation.y = Math.PI / 8;
  shell.scaling.z = extendSize.z / extendSize.x * 1.12;
  shell.material = mf.get("cloth", iron, { emissive: iron.scale(0.12) });
  const out = [shell];
  for (const height of [-0.63, -0.31, 0.01, 0.33, 0.65]) {
    const button = MeshBuilder.CreatePolyhedron("executionerVestButton", { type: 1, size: extendSize.x * 0.08 }, scene);
    button.parent = torso;
    button.position.set(center.x, center.y + extendSize.y * height, center.z + extendSize.z * 1.21);
    button.material = buttons;
    out.push(button);
  }
  return out;
}

/** The bead eyes' box (both eyes and rims), read into the head mesh's frame. */
function eyeBoxInHead(body: ArticulatedBody): { lo: Vector3; hi: Vector3 } | null {
  const head = body.headMesh;
  const eyes = body.allMeshes.filter((m) => /_[lr]Eye(Rim)?$/.test(m.name));
  if (!eyes.length) return null;
  for (let n: TransformNode | null = head; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
  const inv = Matrix.Invert(head.getWorldMatrix());
  const lo = new Vector3(Infinity, Infinity, Infinity), hi = new Vector3(-Infinity, -Infinity, -Infinity);
  for (const eye of eyes) {
    for (let n: TransformNode | null = eye; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
    eye.refreshBoundingInfo();
    for (const v of eye.getBoundingInfo().boundingBox.vectorsWorld) {
      const p = Vector3.TransformCoordinates(v, inv);
      lo.minimizeInPlace(p); hi.maximizeInPlace(p);
    }
  }
  return { lo, hi };
}

/**
 * [R] 513 the Shouter's Nordic helm, rebuilt (CONFIRM 509 and 512 failed a on the figure; blockers a.2 "a flat-topped box cap with a brim-like front
 * edge", a.3 "two small dark blocks beside the eyes like goggles"). Spec read off secret.shouter.red.png and .blue.png: a dark iron helm that is a
 * low rounded dome over the crown, its rim coming down to the brow just over the eyes and on down the sides of the head to the jaw (ear guards) and
 * round the back to the nape; on the face a plate from the brow to the nose: a brow bar dipping to a point between the eyes, cheek plates outside
 * each eye down to below it, an under-eye bar from each cheek plate in to a nose guard that narrows to a point over the mouth; the eyes look out of
 * the two holes so framed, the chin and mouth bare team skin. Out of each side a thick tan horn, out sideways then curled down at the tip.
 * Spec in head widths W, heights H, depths D (the head box, centre c) and the eye box (lo..hi, both eyes) in the head frame:
 *   dome: a 5-segment half sphere .dome W across (x D for z), from .rim H over the eye top up to .crown H over c (no straight bowl wall);
 *   brow band round its foot .band H tall, .bandW W across; ear guards per side .earW D long, .ear H down from the band, .earX W out, splayed .earTilt;
 *   back plate .backW W wide down to the ear guards' foot; on the face (front at the eyes' back + .stand D): a brow V .browH H tall over the eyes,
 *   cheek plates .cheekW W wide outside the eyes from the band to .under H under the eye bottom; under-eye bars .barH H tall from cheek to nose;
 *   a nose guard .noseW W wide at the eyes narrowing to .noseTip W, .nose H down from the eye bottom.
 *   Horns: HORN_PATH [x W out, y H up, z D back] from the dome's side .hornY H over the eye top, .hornRoot W to .hornTip W.
 * Iron dark lit cloth .iron self-lit .12 (LESSONS: metal reads near black); horn brown .horn. All flat-shaded, out of the glow.
 */
const SHOUTER_HELM = {
  iron: new Color3(0.2, 0.21, 0.23), horn: new Color3(0.72, 0.44, 0.24), dome: 1.24, rim: 0.03, crown: 0.64, band: 0.11, bandW: 1.27,
  earW: 0.78, ear: 0.5, earX: 0.58, earTilt: 0.08, backW: 1.1, stand: 0.02, browH: 0.11, cheekW: 0.24, under: 0.14, barH: 0.1,
  noseW: 0.16, noseTip: 0.07, nose: 0.34, hornY: 0.16, hornRoot: 0.39, hornTip: 0.11,
};
const HORN_PATH: [number, number, number][] = [[0.52, 0, 0], [0.73, 0.035, 0.015], [0.94, 0.047, 0.04], [1.12, 0.015, 0.07], [1.20, -0.065, 0.08], [1.22, -0.14, 0.08]];
export function shouterHelm(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = SHOUTER_HELM, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const eyes = eyeBoxInHead(body) ?? { lo: new Vector3(c.x - W * 0.3, c.y, c.z + D * 0.4), hi: new Vector3(c.x + W * 0.3, c.y + H * 0.15, c.z + D * 0.55) };
  const e = eyes.hi.y, eb = eyes.lo.y, ex = (eyes.lo.x + eyes.hi.x) / 2, eHalf = (eyes.hi.x - eyes.lo.x) / 2;
  const iron = mf.get("cloth", C.iron, { emissive: C.iron.scale(0.12), roughness: 1 });
  const horn = mf.get("cloth", C.horn, { emissive: C.horn.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: Material = iron): Mesh => { m.parent = head; m.material = material; out.push(m); return m; };
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number): Mesh => {
    const m = put(MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene));
    m.position.set(x, y, z);
    return m;
  };
  const foot = e + H * C.rim, crown = c.y + H * C.crown;
  const dome = put(MeshBuilder.CreateSphere("shouterHelmDome", { diameter: 1, segments: 5, slice: 0.5 }, scene));
  dome.scaling.set(W * C.dome, (crown - foot) * 2, D * C.dome); dome.position.set(c.x, foot, c.z);
  const band = put(MeshBuilder.CreateCylinder("shouterHelmBand", { height: H * C.band, diameter: W * C.bandW, tessellation: 10 }, scene));
  band.rotation.y = Math.PI / 10; band.scaling.z = (D * C.dome) / (W * C.bandW); band.position.set(c.x, foot + (H * C.band) / 2 - H * 0.02, c.z);
  const guardFoot = foot - H * C.ear;
  for (const side of [-1, 1]) {
    const ear = box("shouterHelmEar", W * 0.1, H * C.ear, D * C.earW, c.x + side * W * C.earX, foot - (H * C.ear) / 2, c.z - D * 0.06);
    ear.rotation.z = side * C.earTilt;
  }
  box("shouterHelmBack", W * C.backW, foot - guardFoot, D * 0.1, c.x, (foot + guardFoot) / 2, c.z - D * 0.58);
  // the face plate, in front of the face just behind the eyes' front
  const front = Math.max(eyes.lo.z, c.z + D / 2) + D * C.stand, depth = D * 0.09;
  for (const side of [-1, 1]) {
    const brow = box("shouterHelmMaskBrow", eHalf * 1.15, H * C.browH, depth, ex + side * eHalf * 0.55, e + (H * C.browH) / 2 - H * 0.01, front);
    brow.rotation.z = side * 0.22; // dips to a point between the eyes
    const outer = ex + side * (eHalf + (W * C.cheekW) / 2);
    const cheekTop = foot, cheekBot = eb - H * C.under;
    const cheek = box("shouterHelmMaskCheek", W * C.cheekW, cheekTop - cheekBot, depth, outer, (cheekTop + cheekBot) / 2, front - D * 0.02);
    cheek.rotation.z = side * 0.1;
    const bar = box("shouterHelmMaskBar", eHalf * 1.1, H * C.barH, depth, ex + side * eHalf * 0.5, eb - (H * C.barH) / 2 - H * 0.01, front);
    bar.rotation.z = side * -0.3; // slopes down to the nose guard
  }
  const nose = put(MeshBuilder.CreateCylinder("shouterHelmMaskNose", { height: H * C.nose, diameterTop: W * C.noseW, diameterBottom: W * C.noseTip, tessellation: 4 }, scene));
  nose.rotation.y = Math.PI / 4; nose.scaling.z = 0.45; nose.position.set(ex, eb - (H * C.nose) / 2 + H * 0.02, front + D * 0.02);
  for (const side of [-1, 1]) {
    const pts = HORN_PATH.map(([x, y, z]) => new Vector3(c.x + side * x * W, e + H * C.hornY + y * H, c.z - z * D));
    taper(scene, "shouterHorn", pts, W * C.hornRoot, W * C.hornTip, head, horn, out);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [R] 513 the Shouter's iron vest, rebuilt (blocker a.4 "a flat slab on the chest front, with team torso showing at the sides and shoulders").
 * Spec read off secret.shouter.blue.png: a grey iron shell round the whole trunk from over the shoulders to just under the waist, wider at the chest
 * than at its hem, faceted, its hem cut with a shallow point at the front; the team tunic shows under it to the crotch. In the yoke's box (centre c,
 * half size h; front +z): a 10-sided shell .wide h.x across at the top and .hem of that at the foot, .deep h.z deep, from .top h.y over c down to
 * .low h.y under it; a front point .point h.y deep at the hem; the trunk under it re-clothed in team cloth x .tunic. Iron as the helm, out of the glow.
 */
const SHOUTER_VEST = { wide: 2.3, hem: 0.9, deep: 2.5, top: 1.04, low: 1.3, point: 0.2, tunic: 0.8 };
export function shouterVest(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const V = SHOUTER_VEST, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const yoke = body.allMeshes.find((mesh) => mesh.name.endsWith("_yoke")) ?? body.torsoMesh;
  const { center: c, extendSize: h } = yoke.getBoundingInfo().boundingBox;
  const iron = mf.get("cloth", SHOUTER_HELM.iron, { emissive: SHOUTER_HELM.iron.scale(0.12), roughness: 1 });
  const tunicColor = team.scale(V.tunic);
  body.torsoMesh.material = mf.get("cloth", tunicColor, { emissive: tunicColor.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const top = c.y + h.y * V.top, low = c.y - h.y * V.low, tall = top - low;
  const shell = MeshBuilder.CreateCylinder("shouterVestShell", { height: tall, diameterTop: h.x * V.wide, diameterBottom: h.x * V.wide * V.hem, tessellation: 10 }, scene);
  shell.parent = yoke; shell.position.set(c.x, (top + low) / 2, c.z);
  shell.rotation.y = Math.PI / 10; shell.scaling.z = (h.z * V.deep) / (h.x * V.wide);
  shell.material = iron; out.push(shell);
  const point = MeshBuilder.CreateCylinder("shouterVestPoint", { height: h.y * V.point, diameterTop: h.x * 0.9, diameterBottom: 0, tessellation: 3 }, scene);
  point.parent = yoke; point.rotation.y = Math.PI; point.scaling.z = 0.25;
  point.position.set(c.x, low - (h.y * V.point) / 2, c.z + (h.z * V.deep) / 2 - h.z * 0.12);
  point.material = iron; out.push(point);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

export function chuKoNuRobe(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const torso = body.torsoMesh;
  const bounds = torso.getBoundingInfo().boundingBox;
  const width = bounds.extendSize.x * 2 * torso.scaling.x;
  const depth = bounds.extendSize.z * 2 * torso.scaling.z;
  const length = Math.abs(body.leftKnee.position.y);
  const factory = getMaterialFactory();
  const cloth = factory.get("cloth", team, { emissive: team.scale(0.12) });
  const orange = new Color3(0.7, 0.294, 0.07);
  const trim = factory.get("cloth", orange, { emissive: orange.scale(0.12) });
  const out: Mesh[] = [];
  const tier = (name: string, from: number, to: number, top: number, foot: number, material: Material): void => {
    const panel = MeshBuilder.CreateCylinder(name, {
      height: (to - from) * length, diameterTop: top * width, diameterBottom: foot * width, tessellation: 8,
    }, scene);
    panel.parent = body.torso;
    panel.scaling.z = depth / width * 1.16;
    panel.position.y = length * (0.12 - (from + to) / 2);
    panel.rotation.y = Math.PI / 8;
    panel.material = material;
    panel.convertToFlatShadedMesh();
    out.push(panel);
  };
  tier("konuLowerRobe", 0.28, 1.05, 1.12, 1.52, cloth);
  tier("konuUpperRobe", 0, 0.76, 1.08, 1.55, cloth);
  tier("konuHem", 0.69, 0.77, 1.53, 1.57, trim);
  tier("konuHem", 0.98, 1.06, 1.50, 1.54, trim);
  return out;
}

/**
 * [S] 501 the Ballooner's Balloon Backpack (card Appearance "a backpack with a mini hot air balloon attached to it"; reference/units/secret.ballooner.png,
 * the icon: a satchel with a cluster of small balloons on strings over it; the red render shows its dark straps at the chest's sides; audit 500 a.1:
 * "one head-sized pink sphere at head height, hiding the head"). The old "balloon" special sphere and its string are hidden.
 * Spec in torso widths TW, heights TH, depths TD (the torso box, torso frame): a brown leather satchel .packW TW wide, .packH TH tall, .packD TD deep,
 * hung on the back .packY TH under the collar, a darker flap .flap of its height over its top and a brass buckle; two straps .strapW TW wide over
 * the shoulders at .strapX TW out, down the chest's front to its foot; from the satchel's top .balloons balloons on BALLOON_SPOTS [x TW, y TH over
 * the collar, z TD behind the back], each a flat-shaded ico ball .ball TW across, a little taller than wide, a dark knot under it, a thin string down
 * to the satchel's top; cream, pale team and team balloons in turn (unlit, out of the glow, so the cream stays cream, LESSONS 442).
 */
const BALLOONER_PACK = {
  packW: 0.62, packH: 0.5, packD: 0.42, packY: 0.12, flap: 0.3, strapW: 0.09, strapX: 0.3, balloons: 5, ball: 0.42, tall: 1.18, string: 0.012,
  leather: new Color3(0.3, 0.16, 0.07), flapC: new Color3(0.2, 0.1, 0.05), brass: new Color3(0.75, 0.55, 0.15), cream: new Color3(0.95, 0.9, 0.78),
};
const BALLOON_SPOTS: [number, number, number][] = [[0, 1.4, 0.7], [-0.36, 1.2, 0.8], [0.36, 1.22, 0.75], [-0.16, 1.0, 1.0], [0.2, 1.02, 0.95]];
export function balloonerPack(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = BALLOONER_PACK, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  for (const m of body.torso.getChildMeshes(false)) if (m.name === "balloon" || (m.name === "string" && m.parent?.name === "balloon")) m.setEnabled(false);
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, sc = tm.scaling;
  const TW = tb.extendSize.x * 2 * sc.x, TH = tb.extendSize.y * 2 * sc.y, TD = tb.extendSize.z * 2 * sc.z;
  const top = tm.position.y + (tb.center.y + tb.extendSize.y) * sc.y, cx = tm.position.x + tb.center.x * sc.x, cz = tm.position.z + tb.center.z * sc.z;
  const back = cz - TD / 2;
  const leather = mf.get("cloth", C.leather, { emissive: C.leather.scale(0.12), roughness: 1 });
  const flap = mf.get("cloth", C.flapC, { emissive: C.flapC.scale(0.12), roughness: 1 });
  const brass = mf.get("cloth", C.brass, { emissive: C.brass.scale(0.12) });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: Material, x: number, y: number, z: number): Mesh => { m.parent = body.torso; m.position.set(x, y, z); m.material = material; out.push(m); return m; };
  const packY = top - TH * C.packY - (TH * C.packH) / 2, packZ = back - (TD * C.packD) / 2;
  put(MeshBuilder.CreateBox("balloonerPack", { width: TW * C.packW, height: TH * C.packH, depth: TD * C.packD }, scene), leather, cx, packY, packZ);
  const flapH = TH * C.packH * C.flap;
  put(MeshBuilder.CreateBox("balloonerPackFlap", { width: TW * C.packW * 1.04, height: flapH, depth: TD * C.packD * 1.08 }, scene), flap, cx, packY + TH * C.packH / 2 - flapH / 2 + TH * 0.01, packZ);
  put(MeshBuilder.CreateBox("balloonerPackBuckle", { width: TW * 0.1, height: TW * 0.08, depth: TW * 0.03 }, scene), brass, cx, packY + TH * C.packH / 2 - flapH, packZ - TD * C.packD * 0.55);
  for (const side of [-1, 1]) {
    // a strap over the shoulder: across the top, then down the chest's front to its foot
    put(MeshBuilder.CreateBox("balloonerStrap", { width: TW * C.strapW, height: TW * 0.04, depth: TD * 1.12 }, scene), flap, cx + side * TW * C.strapX, top + TW * 0.015, cz);
    put(MeshBuilder.CreateBox("balloonerStrap", { width: TW * C.strapW, height: TH * 0.85, depth: TW * 0.04 }, scene), flap, cx + side * TW * C.strapX, top - TH * 0.425, cz + TD / 2 + TW * 0.02);
  }
  const packTop = packY + TH * C.packH / 2;
  const tints = [C.cream, team.scale(0.6).add(C.cream.scale(0.4)), team, C.cream, team.scale(0.6).add(C.cream.scale(0.4))];
  for (let i = 0; i < C.balloons; i++) {
    const [x, y, z] = BALLOON_SPOTS[i], col = tints[i % tints.length];
    const skin = mf.get("unlit", col, { emissive: col });
    const R = (TW * C.ball) / 2, bx = cx + x * TW, by = top + y * TH, bz = back - z * TD;
    const ball = put(MeshBuilder.CreateIcoSphere("balloonerBalloon", { radius: R, subdivisions: 1 }, scene), skin, bx, by, bz);
    ball.scaling.y = C.tall;
    put(MeshBuilder.CreateCylinder("balloonerKnot", { height: R * 0.3, diameterTop: R * 0.35, diameterBottom: 0, tessellation: 4 }, scene), skin, bx, by - R * C.tall - R * 0.1, bz);
    // the string from the knot down to the satchel's top
    const from = new Vector3(bx, by - R * C.tall - R * 0.25, bz), to = new Vector3(cx + x * TW * 0.3, packTop, packZ), d = from.subtract(to);
    const s = put(MeshBuilder.CreateCylinder("balloonerString", { height: d.length(), diameter: TW * C.string * 2, tessellation: 3 }, scene), flap, (from.x + to.x) / 2, (from.y + to.y) / 2, (from.z + to.z) / 2);
    s.rotationQuaternion = Quaternion.FromUnitVectorsToRef(new Vector3(0, 1, 0), d.normalize(), new Quaternion());
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 503 the Ballooner's Ballooner Grab mitts (card Main Hand / Off Hand "Ballooner Grab", Unarmed; Appearance "arms covered with glue to catch
 * enemies"; secret.ballooner.red.png: both hands are big lumpy beige glue blobs, open and empty, the glue running up the wrist; audit 500 b.1: "a
 * dark ninja shuriken in the raised hand"). The visual entry carries no weapon now; each hand is cased in glue.
 * Spec in hand widths HW (the hand mesh's box, hand frame: +y up the forearm, -y past the knuckles): per hand a flat-shaded ico blob .mitt HW
 * across over the hand mesh, stretched .long in y, flattened .flat in z; smaller lumps .lump HW across round it on GLUE_LUMPS
 * [x, y, z in HW from the hand mesh's centre], the topmost over the wrist. Flat unlit beige glue .glue, out of the glow.
 */
// look 503: 1.7 HW with .95 lumps read as small pale knobs on the fists, and lit tan cloth read grey in the field: flat unlit beige (between
// the palette's unlit tan x.7 and x1 swatches), bigger
const BALLOONER_GLUE = { mitt: 3.4, long: 1.3, flat: 0.85, lump: 1.9, glue: new Color3(0.66, 0.5, 0.3) };
const GLUE_LUMPS: [number, number, number][] = [[0.75, 0.4, 0.25], [-0.7, -0.25, -0.2], [0.15, 1.3, 0], [-0.3, -1.1, 0.35]];
export function balloonerGlueMitts(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = BALLOONER_GLUE, glow = scene.getGlowLayerByName("glow");
  const glue = getMaterialFactory().get("unlit", C.glue, { emissive: C.glue });
  const out: Mesh[] = [];
  for (const hand of [body.leftHand, body.rightHand]) {
    const hm = hand.getChildMeshes(true).find((m) => /_[lr]HandM$/.test(m.name)) as Mesh | undefined;
    if (!hm) continue;
    const hb = hm.getBoundingInfo().boundingBox, HW = hb.extendSize.x * 2 * hm.scaling.x;
    const at = hm.position.add(hb.center.multiply(hm.scaling));
    const blob = MeshBuilder.CreateIcoSphere("balloonerGlue", { radius: (HW * C.mitt) / 2, subdivisions: 1 }, scene);
    blob.parent = hand; blob.position.copyFrom(at); blob.scaling.set(1, C.long, C.flat); blob.rotation.y = 0.4; blob.material = glue;
    out.push(blob);
    GLUE_LUMPS.forEach(([x, y, z], k) => {
      const l = MeshBuilder.CreateIcoSphere("balloonerGlue", { radius: (HW * C.lump) / 2, subdivisions: 1 }, scene);
      l.parent = hand; l.position.set(at.x + x * HW, at.y + y * HW, at.z + z * HW); l.rotation.set(k * 0.9, k * 1.7, k * 0.5); l.material = glue;
      out.push(l);
    });
  }
  for (const [arm, wrist, side] of [
    [body.leftLowerArm, body.leftHand, -1], [body.rightLowerArm, body.rightHand, 1],
  ] as const) {
    const bounds = arm.getBoundingInfo().boundingBox;
    const length = -wrist.position.y;
    const width = bounds.extendSize.x * 2 * arm.scaling.x;
    for (const [reach, girth, offset] of [[0.41, 1.85, 0.18], [0.66, 2.18, -0.1], [0.84, 2.35, 0.12]]) {
      const lobe = MeshBuilder.CreateIcoSphere("balloonerForearmGlue", { radius: 0.5, subdivisions: 1 }, scene);
      lobe.parent = wrist.parent;
      lobe.position.set(width * offset * side, -length * reach, width * offset);
      lobe.scaling.set(width * girth, length * 0.49, width * girth * 0.9);
      lobe.rotation.z = side * offset;
      lobe.material = glue;
      out.push(lobe);
    }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 503 the Jester's hood and three-pointed cap (secret.jester.red.png; card Appearance "a team-colored jester outfit and hat"; audit 500 a.1:
 * "a flat maroon disc with two short yellow-tipped stubs"). The render: a team hood close round the whole head and under the chin, only the face
 * open; out of its crown two thick team points arc up and out past the shoulders and droop at the ends, each ending in a round bell ball; between
 * them a brown spike stands straight up about half a head, a knob on its tip. The old jester_cap (propBuilder) is hidden.
 * Spec in head widths W, heights H, depths D (the head box, its centre c; e the eyes' top in the head frame): the hood an ellipsoid .hoodW W x
 * .hoodH H x .hoodD D set .hoodBack D back (its front stays behind the face, so the face shows), a chin band .chin H under the head's foot; per
 * side a point tapering .root W to .tip W along JESTER_POINT [x W out, y H over e]; a bell ball .bell W across at its end; the spike .spike H tall
 * from .spikeRoot W at the crown to a point, a knob .knob W across on it. Team cloth (team x .shade, self-lit .12), brown .brown, out of the glow.
 */
const JESTER_CAP = { hoodW: 1.14, hoodH: 1.1, hoodD: 1.12, hoodBack: 0.1, chin: 0.12, root: 0.34, tip: 0.14, bell: 0.22, spike: 0.62, spikeRoot: 0.26, knob: 0.16, shade: 0.85, brown: new Color3(0.38, 0.2, 0.09) };
const JESTER_POINT: [number, number][] = [[0.2, 0.42], [0.5, 0.72], [0.85, 0.86], [1.15, 0.78], [1.32, 0.56], [1.36, 0.36]];

/**
 * [S] 513 the Jester's team outfit (secret.jester.red.png, .blue.png; card Appearance "team-colored jester outfit and hat"; CONFIRM 512 a.1 "the
 * jester outfit reads olive/khaki under pink team arms ... in unit_secret.jester_idle a teal shade"). The faction tint and the clothed recolour
 * shift the shared body cloth off the team hue (LESSONS 449), so every mesh still in body.bodyMaterial once the generic tunic skirt is hung (trunk,
 * yoke, shoulder pads, pelvis, tunic skirt, legs, stubs) is moved onto the hood's own team cloth (team x JESTER_CAP.shade, self-lit .12), out of
 * the glow. Run after the skirt (unitFactory), so the skirt is caught too.
 */
export function jesterTunic(scene: Scene, body: ArticulatedBody, team: Color3, props: Mesh[]): void {
  const clothC = team.scale(JESTER_CAP.shade), glow = scene.getGlowLayerByName("glow");
  const cloth = getMaterialFactory().get("cloth", clothC, { emissive: clothC.scale(0.12), roughness: 1 });
  for (const mesh of [...body.allMeshes, ...props]) {
    if (mesh.material !== body.bodyMaterial) continue;
    mesh.material = cloth;
    glow?.addExcludedMesh(mesh);
  }
}
export function jesterCap(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = JESTER_CAP, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  for (const m of body.root.getChildMeshes(false)) if (/^jester(Cap|Horn|Bell)$/.test(m.name)) m.setEnabled(false);
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const clothC = team.scale(C.shade), cloth = mf.get("cloth", clothC, { emissive: clothC.scale(0.12), roughness: 1 });
  const brown = mf.get("cloth", C.brown, { emissive: C.brown.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const hood = MeshBuilder.CreateSphere("jesterHood", { diameter: 1, segments: 5 }, scene);
  hood.parent = head; hood.material = cloth; hood.scaling.set(W * C.hoodW, H * C.hoodH, D * C.hoodD); hood.position.set(c.x, c.y, c.z - D * C.hoodBack);
  out.push(hood);
  const chin = MeshBuilder.CreateBox("jesterHoodChin", { width: W * C.hoodW * 0.85, height: H * C.chin, depth: D * C.hoodD * 0.8 }, scene);
  chin.parent = head; chin.material = cloth; chin.position.set(c.x, c.y - H * 0.5, c.z - D * C.hoodBack);
  out.push(chin);
  for (const side of [-1, 1]) {
    const pts = JESTER_POINT.map(([x, y]) => new Vector3(c.x + side * x * W, e + y * H, c.z - D * 0.05));
    taper(scene, "jesterPoint", pts, W * C.root, W * C.tip, head, cloth, out);
    const end = pts[pts.length - 1];
    const bell = MeshBuilder.CreateIcoSphere("jesterBellBall", { radius: (W * C.bell) / 2, subdivisions: 1 }, scene);
    bell.parent = head; bell.material = brown; bell.position.set(end.x, end.y - W * C.bell * 0.4, end.z);
    out.push(bell);
  }
  const crown = c.y + H * C.hoodH * 0.45;
  const spike = MeshBuilder.CreateCylinder("jesterSpike", { height: H * C.spike, diameterBottom: W * C.spikeRoot, diameterTop: W * 0.05, tessellation: 6 }, scene);
  spike.parent = head; spike.material = brown; spike.position.set(c.x, crown + (H * C.spike) / 2, c.z - D * 0.05);
  out.push(spike);
  const knob = MeshBuilder.CreateIcoSphere("jesterSpikeKnob", { radius: (W * C.knob) / 2, subdivisions: 1 }, scene);
  knob.parent = head; knob.material = brown; knob.position.set(c.x, crown + H * C.spike, c.z - D * 0.05);
  out.push(knob);
  const torso = body.torsoMesh;
  const bounds = torso.getBoundingInfo().boundingBox;
  const width = bounds.extendSize.x * 2 * torso.scaling.x;
  const depth = bounds.extendSize.z * 2 * torso.scaling.z;
  const collarY = torso.position.y + bounds.maximum.y * torso.scaling.y - width * 0.17;
  const gold = new Color3(1, 0.7, 0.18);
  const edging = getMaterialFactory().get("cloth", gold, { emissive: gold.scale(0.12) });
  for (const side of [-1, 1]) {
    for (const [x, drop, z, angle] of [[0.13, 0.13, 0.6, 0.5], [0.36, 0.02, 0.47, 0.9], [0.46, -0.1, 0.06, 1.25]]) {
      const lobe = MeshBuilder.CreateIcoSphere("jesterCollarEdging", { radius: 0.5, subdivisions: 1 }, scene);
      lobe.parent = body.torso;
      lobe.position.set(side * width * x, collarY - width * drop, torso.position.z + depth * z);
      lobe.scaling.set(width * 0.32, width * 0.38, width * 0.16);
      lobe.rotation.z = -side * angle;
      lobe.material = edging;
      out.push(lobe);
      const inset = lobe.clone("jesterCollarCloth");
      inset.scaling.scaleInPlace(0.84);
      inset.position.y += width * 0.025;
      inset.position.z += width * 0.029;
      inset.material = cloth;
      out.push(inset);
    }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 503 the Chu Ko Nu's topknot and headband (secret.chu_ko_nu.red.png; card Appearance "their hair in a bun like other Dynasty-themed units";
 * audit 500 a.1: "a black conical straw hat - TABS a topknot bun with a black/team headband"). The render: black hair close over the crown, its
 * front edge just over the bead eyes; round the head at the hair's foot a black band with a team stripe along its middle; on the crown a tall black
 * bun, a little narrower at its top, ringed by a team band. The visual entry's conical hat is gone.
 * Spec in head widths W, heights H, depths D (the head box, its centre c; e the eyes' top in the head frame): the hair a half ellipsoid .capW W x
 * .capH H x .capD D on a base .capLo H over e; the band an 8-sided ring .bandW W across, .band H tall from .capLo H over e, the stripe .stripe of its
 * height, .stripeOut proud; the bun a 6-sided cylinder .bunW W across (.bunTop of it at the top) .bun H tall on the crown, set .bunBack D back,
 * its band .bunBand H tall at .bunBandAt of its height. Near-black hair (LESSONS: lit .08 cloth self-lit), team stripe; out of the glow.
 */
const KONU_KNOT = { capW: 1.1, capH: 0.62, capD: 1.1, capLo: 0.04, bandW: 1.14, band: 0.16, stripe: 0.4, stripeOut: 0.02, bunW: 0.36, bunTop: 0.8, bun: 0.42, bunBack: 0.12, bunBand: 0.08, bunBandAt: 0.35, black: new Color3(0.05, 0.04, 0.04) };
export function chuKoNuTopknot(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = KONU_KNOT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const black = mf.get("cloth", C.black, { emissive: C.black.scale(0.4), roughness: 1 });
  const stripe = mf.get("cloth", team, { emissive: team.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: Material, y: number, z = c.z): Mesh => { m.parent = head; m.material = material; m.position.set(c.x, y, z); out.push(m); return m; };
  const base = e + H * C.capLo;
  const cap = put(MeshBuilder.CreateSphere("konuHair", { diameter: 1, segments: 5, slice: 0.5 }, scene), black, base);
  cap.scaling.set(W * C.capW, H * C.capH * 2, D * C.capD);
  const band = put(MeshBuilder.CreateCylinder("konuBand", { height: H * C.band, diameter: W * C.bandW, tessellation: 8 }, scene), black, base + (H * C.band) / 2);
  band.scaling.z = (D * C.bandW) / (W * C.bandW); band.rotation.y = Math.PI / 8;
  const st = put(MeshBuilder.CreateCylinder("konuBandStripe", { height: H * C.band * C.stripe, diameter: W * (C.bandW + C.stripeOut * 2), tessellation: 8 }, scene), stripe, base + (H * C.band) / 2);
  st.scaling.z = D / W; st.rotation.y = Math.PI / 8;
  const top = base + H * C.capH * 0.92, bz = c.z - D * C.bunBack;
  put(MeshBuilder.CreateCylinder("konuBun", { height: H * C.bun, diameterBottom: W * C.bunW, diameterTop: W * C.bunW * C.bunTop, tessellation: 6 }, scene), black, top + (H * C.bun) / 2, bz);
  put(MeshBuilder.CreateCylinder("konuBunBand", { height: H * C.bunBand, diameter: W * C.bunW * 1.08, tessellation: 6 }, scene), stripe, top + H * C.bun * C.bunBandAt, bz);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 501 the Ball 'n' Chain's stone ball (secret.ball_n_chain.red.png: he hugs a huge faceted grey stone ball, wider than his chest, at chest
 * height in both arms, a thick grey chain of open links hanging from its foot to his knees; audit 500 b.1: "a small dark ball on a stick, held
 * one-handed like a mace"). The flail (handle, chain, ball) in his fist is hidden; the stone rides the torso so it stays at his chest through the
 * walk and the swing, the forearms reaching round its sides.
 * Spec in torso widths TW, heights TH (the torso box, torso frame): a flat-shaded ico boulder .ball TW across, squashed to .squash in y and
 * .deep in z, turned .turn so its facets sit off-axis, its centre .y TH under the collar and .ahead TW in front of the chest; grey stone lit cloth;
 * under it .links chain links, each a 4-sided torus .link TW long x .linkW TW wide (stretched in y), .linkT TW thick, alternating a quarter
 * turn about y, from the ball's foot down .chain TH; dark iron.
 */
const BALL_STONE = {
  ball: 1.3, squash: 0.92, deep: 0.9, turn: 0.5, y: 0.5, ahead: 0.62, links: 6, link: 0.22, linkW: 0.13, linkT: 0.045, chain: 1.05,
  stone: new Color3(0.42, 0.41, 0.4), iron: new Color3(0.26, 0.26, 0.28),
};
export function ballStone(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = BALL_STONE, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  for (const hand of [body.rightHand, body.leftHand]) for (const m of hand.getChildMeshes(false)) if (/^flail/.test(m.name)) m.setEnabled(false);
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, sc = tm.scaling;
  const TW = tb.extendSize.x * 2 * sc.x, TH = tb.extendSize.y * 2 * sc.y, TD = tb.extendSize.z * 2 * sc.z;
  const top = tm.position.y + (tb.center.y + tb.extendSize.y) * sc.y, cx = tm.position.x + tb.center.x * sc.x, cz = tm.position.z + tb.center.z * sc.z;
  const stone = mf.get("cloth", C.stone, { emissive: C.stone.scale(0.12), roughness: 1 });
  const iron = mf.get("cloth", C.iron, { emissive: C.iron.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const R = (TW * C.ball) / 2, by = top - TH * C.y, bz = cz + TD / 2 + TW * C.ahead - R * 0.35;
  const ball = MeshBuilder.CreateIcoSphere("ballStone", { radius: R, subdivisions: 1 }, scene);
  ball.parent = body.torso; ball.position.set(cx, by, bz); ball.material = stone;
  ball.scaling.set(1, C.squash, C.deep); ball.rotation.set(C.turn * 0.4, C.turn, C.turn * 0.2);
  out.push(ball);
  // the chain from the ball's foot straight down
  const linkL = TW * C.link, step = (TH * C.chain) / C.links;
  for (let i = 0; i < C.links; i++) {
    const link = MeshBuilder.CreateTorus("ballChainLink", { diameter: TW * C.linkW, thickness: TW * C.linkT, tessellation: 6 }, scene);
    link.parent = body.torso; link.material = iron;
    link.rotation.set(Math.PI / 2, i % 2 ? Math.PI / 2 : 0, 0);
    link.scaling.set(1, 1, linkL / (TW * C.linkW));
    link.position.set(cx, by - R * C.squash * 0.88 - step * (i + 0.5), bz - R * 0.1);
    out.push(link);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 502 the Teacher's long renaissance hair (secret.the_teacher.red.png; audit 500 a.1: "a bald head - TABS long brown renaissance hair to the
 * shoulders"). The render: a dark greyish-brown cap over the crown and the back of the head, its front edge high on the brow over the bead eyes;
 * either side a bushy mass of curls standing out past the head from the temple down to the jaw, and behind a thick fall to the nape.
 * Spec in head widths W, heights H, depths D (the head box, its centre c; e the eyes' top in the head frame): a cap box .capW W x from .capLo H
 * over e to .capTop H over the centre x .capD D, set .capBack D back; per side .puffs flat-shaded ico lumps .puff W across, .out W from the
 * centre, from .puffHi H over the centre down to .puffLo H, stepping .stepZ D back as they go down; a back fall of .back lumps .backW W across
 * .rear D behind the centre from the crown to .backLo H. Brown lit cloth (palette brown x .25), self-lit .12, out of the glow.
 */
/** A closed faceted solid from triangles, each wound so its face looks away from the solid's centroid. */
function facetedSolid(scene: Scene, name: string, tris: Vector3[][]): Mesh {
  const mid = Vector3.Zero();
  for (const t of tris) for (const p of t) mid.addInPlace(p.scale(1 / (tris.length * 3)));
  const positions: number[] = [], indices: number[] = [];
  for (const [a, b, d] of tris) {
    const n = Vector3.Cross(a.subtract(b), d.subtract(b));
    const centre = a.add(b).add(d).scale(1 / 3);
    const tri = Vector3.Dot(n, centre.subtract(mid)) > 0 ? [a, b, d] : [a, d, b];
    for (const p of tri) { indices.push(positions.length / 3); positions.push(p.x, p.y, p.z); }
  }
  const vd = new VertexData();
  vd.positions = positions; vd.indices = indices;
  const normals: number[] = [];
  VertexData.ComputeNormals(positions, indices, normals);
  vd.normals = normals;
  const mesh = new Mesh(name, scene);
  vd.applyToMesh(mesh);
  return mesh;
}

/**
 * [S] 514 the Teacher's beard (secret.the_teacher.blue.png: a broad brown triangular beard filling the lower face from cheek to cheek just under
 * the eyes, coming to a point in front of the jabot; CONFIRM 512 a.3 "a small dark tuft at the mouth"). Probe 514: the 506 cone hung half inside
 * the head and the jabot's top fold stood 2-4 cm in front of it, so only its stub showed. Spec in head widths W, heights H, depths D (head box,
 * centre c, front +z; e the eye box's bottom): a front outline from the cheeks (.top W half-wide, .gap H under e, .cheekZ D forward) to the jaw
 * (.jaw W half-wide at .jawY H under c, .jawZ D forward) to a tip (.tipY H under c, .tipZ D forward, clear of the jabot), raised to a ridge at
 * (.ridgeY H, .ridgeZ D); the back outline the same .thick D behind. Hair brown, flat-shaded; the moustache sits .stache D forward on it.
 */
const TEACHER_BEARD = { top: 0.56, gap: 0.03, cheekZ: 0.4, jaw: 0.5, jawY: 0.52, jawZ: 0.66, tipY: 1.12, tipZ: 1.08, ridgeY: 0.4, ridgeZ: 0.84, thick: 0.3, stache: 0.92 };
function teacherBeardSlab(scene: Scene, body: ArticulatedBody, c: Vector3, W: number, H: number, D: number): Mesh {
  const B = TEACHER_BEARD;
  const e = eyeBoxInHead(body)?.lo.y ?? c.y - H * 0.1;
  const at = (x: number, y: number, z: number) => new Vector3(c.x + x * W, y, c.z + z * D);
  const top = e - H * B.gap, jaw = c.y - H * B.jawY, tip = c.y - H * B.tipY;
  const front = [at(-B.top, top, B.cheekZ), at(B.top, top, B.cheekZ), at(B.jaw, jaw, B.jawZ), at(0, tip, B.tipZ), at(-B.jaw, jaw, B.jawZ)];
  const back = front.map((p) => p.add(new Vector3(0, 0, -D * B.thick)));
  const ridge = at(0, c.y - H * B.ridgeY, B.ridgeZ), rear = at(0, c.y - H * B.ridgeY, B.ridgeZ - B.thick * 1.6);
  const tris: Vector3[][] = [];
  for (let i = 0; i < 5; i++) {
    const j = (i + 1) % 5;
    tris.push([ridge, front[i], front[j]], [rear, back[j], back[i]], [front[i], back[i], back[j]], [front[i], back[j], front[j]]);
  }
  return facetedSolid(scene, "teacherBeard", tris);
}

const TEACHER_HAIR = {
  brown: new Color3(0.16, 0.085, 0.06), capW: 1.12, capLo: 0.06, capTop: 0.6, capD: 1.08, capBack: 0.06,
  puffs: 3, puff: 0.42, out: 0.6, puffHi: 0.3, puffLo: -0.42, stepZ: 0.1, back: 3, backW: 0.6, rear: 0.5, backLo: -0.5,
};
export function teacherHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = TEACHER_HAIR, glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const hair = getMaterialFactory().get("cloth", C.brown, { emissive: C.brown.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, y: number, z: number): Mesh => { m.parent = head; m.position.set(x, y, z); m.material = hair; out.push(m); return m; };
  const lo = e + H * C.capLo, hi = c.y + H * C.capTop;
  put(MeshBuilder.CreateBox("teacherHairCap", { width: W * C.capW, height: hi - lo, depth: D * C.capD }, scene), c.x, (lo + hi) / 2, c.z - D * C.capBack);
  for (const side of [-1, 1]) for (let k = 0; k < C.puffs; k++) {
    const t = k / (C.puffs - 1), y = c.y + H * (C.puffHi + (C.puffLo - C.puffHi) * t);
    const p = put(MeshBuilder.CreateIcoSphere("teacherHairPuff", { radius: (W * C.puff) / 2, subdivisions: 1 }, scene), c.x + side * W * (C.out + 0.05 * Math.sin(k * 2.1)), y, c.z - D * (0.05 + C.stepZ * k));
    p.scaling.set(0.8, 1, 1.15); p.rotation.set(k * 0.7, k * 1.3, side * 0.4);
  }
  for (let k = 0; k < C.back; k++) {
    const t = k / (C.back - 1), y = hi - (hi - (c.y + H * C.backLo)) * t;
    const p = put(MeshBuilder.CreateIcoSphere("teacherHairBack", { radius: (W * C.backW) / 2, subdivisions: 1 }, scene), c.x + (k - 1) * W * 0.12, y, c.z - D * C.rear);
    p.scaling.set(1.5, 1, 0.8); p.rotation.y = k * 0.9;
  }
  put(teacherBeardSlab(scene, body, c, W, H, D), 0, 0, 0);
  for (const side of [-1, 1]) {
    const moustache = put(MeshBuilder.CreateIcoSphere("teacherMoustache", {
      radius: W * 0.19, subdivisions: 1,
    }, scene), c.x + side * W * 0.16, c.y - H * 0.23, c.z + D * TEACHER_BEARD.stache);
    moustache.scaling.set(1.12, 0.39, 0.52);
    moustache.rotation.z = -side * 0.45;
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

export function chuKoNuHarness(scene: Scene, body: ArticulatedBody): Mesh[] {
  const torso = body.torsoMesh;
  const { center, extendSize: size } = torso.getBoundingInfo().boundingBox;
  const mf = getMaterialFactory();
  const brown = new Color3(0.62, 0.30, 0.20);
  const leather = mf.get("cloth", brown, { emissive: brown.scale(0.12) });
  const pouch = mf.get("cloth", brown.scale(0.45));
  const out: Mesh[] = [];
  const point = (x: number, y: number, z: number) =>
    center.add(new Vector3(x * size.x, y * size.y, z * size.z));
  const strap = (a: Vector3, b: Vector3) => {
    const run = b.subtract(a);
    const segment = MeshBuilder.CreateBox("chuKoNuLeatherStrap", {
      width: size.x * 0.21, height: run.length() + size.x * 0.07, depth: size.z * 0.15,
    }, scene);
    segment.parent = torso;
    segment.position.copyFrom(a.add(b).scale(0.5));
    segment.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), run.normalize(), new Quaternion());
    segment.material = leather;
    out.push(segment);
  };
  for (const side of [-1, 1]) {
    const front = point(side * 0.80, 1.04, 1.19);
    const shoulder = point(side * 0.82, 1.18, 0.10);
    const back = point(side * 0.80, 1.01, -1.18);
    strap(point(side * 0.48, -0.75, 1.20), front);
    strap(front, shoulder);
    strap(shoulder, back);
    strap(back, point(side * 0.25, -0.67, -1.45));
  }
  for (const [name, y, height, radius, material] of [
    ["chuKoNuQuiver", 0.04, 1.73, 0.50, pouch],
    ["chuKoNuQuiverRim", 0.85, 0.19, 0.58, leather],
  ] as const) {
    const mesh = MeshBuilder.CreateCylinder(name, {
      height: height * size.y, diameterTop: radius * size.x, diameterBottom: radius * size.x * 0.9, tessellation: 6,
    }, scene);
    mesh.parent = torso;
    mesh.position.copyFrom(point(0.22 + y * 0.18, y, -1.59));
    mesh.rotation.z = -0.18;
    mesh.material = material;
    out.push(mesh);
  }
  return out;
}

/** A dark waist strap with an open square buckle and a loose end across the robe. */
export function chuKoNuBelt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const torso = body.torsoMesh;
  const { center: c, extendSize: s } = torso.getBoundingInfo().boundingBox;
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", new Color3(0.12, 0.065, 0.045));
  const gold = mf.get("cloth", new Color3(0.7, 0.35, 0.09), { emissive: new Color3(0.084, 0.042, 0.011) });
  const out: Mesh[] = [];
  const box = (name: string, x: number, y: number, z: number, w: number, h: number, d: number, material: Material) => {
    const mesh = MeshBuilder.CreateBox(name, { width: s.x * w, height: s.y * h, depth: s.z * d }, scene);
    mesh.parent = torso; mesh.position.set(c.x + s.x * x, c.y + s.y * y, c.z + s.z * z);
    mesh.material = material; out.push(mesh); return mesh;
  };
  const beltY = -1.04;
  const buckleX = -0.25;
  const buckleZ = 1.71;
  const strap = MeshBuilder.CreateCylinder("chuKoNuBeltStrap", {
    height: s.y * 0.29, diameterTop: s.x * 2.53, diameterBottom: s.x * 2.72, tessellation: 8,
  }, scene);
  strap.parent = torso;
  strap.position.set(c.x, c.y + s.y * beltY, c.z);
  strap.scaling.z = s.z / s.x * 1.3;
  strap.rotation.y = Math.PI / 8;
  strap.material = leather;
  out.push(strap);
  for (const side of [-1, 1]) {
    box("chuKoNuBuckleSide", buckleX + side * 0.24, beltY, buckleZ, 0.085, 0.35, 0.12, gold);
    box("chuKoNuBuckleBar", buckleX, beltY + side * 0.16, buckleZ, 0.56, 0.07, 0.12, gold);
  }
  box("chuKoNuBuckleTongue", buckleX, beltY, buckleZ + 0.04, 0.34, 0.048, 0.07, gold);
  const end = box("chuKoNuLooseBelt", -0.67, beltY - 0.49, buckleZ, 0.28, 1.0, 0.14, leather);
  end.rotation.z = -0.32;
  return out;
}

export function teacherJabot(scene: Scene, body: ArticulatedBody): Mesh[] {
  const torso = body.torsoMesh;
  const { center, extendSize: size } = torso.getBoundingInfo().boundingBox;
  const cream = new Color3(0.80, 0.60, 0.35);
  const material = getMaterialFactory().get("unlit", cream, { emissive: cream });
  const out: Mesh[] = [];
  for (const [index, [y, width, z]] of [[1.19, 0.48, 1.24], [0.92, 0.59, 1.35], [0.65, 0.65, 1.46]].entries()) {
    const fold = MeshBuilder.CreateCylinder("teacherJabotFold", {
      height: size.y * 0.38,
      diameterTop: size.x * width * 1.6,
      diameterBottom: size.x * width * 2.25,
      tessellation: 6,
    }, scene);
    fold.parent = torso;
    fold.position.set(center.x, center.y + size.y * y, center.z + size.z * z);
    fold.scaling.z = size.z / size.x * 0.42;
    fold.rotation.x = 0.16 - index * 0.08;
    fold.rotation.y = Math.PI / 6;
    fold.material = material;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(fold);
    out.push(fold);
  }
  return out;
}

export function shouterFurTrim(scene: Scene, body: ArticulatedBody): Mesh[] {
  const tan = new Color3(0.8, 0.60, 0.35);
  const mf = getMaterialFactory();
  const fur = mf.get("cloth", tan, { emissive: tan.scale(0.12) });
  const root = mf.get("cloth", tan.scale(0.7), { emissive: tan.scale(0.08) });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm]) {
    const { center, extendSize: size } = arm.getBoundingInfo().boundingBox;
    const shoulder = arm === body.leftUpperArm || arm === body.rightUpperArm;
    const y = center.y + size.y * (shoulder ? 0.68 : 0.64);
    const radius = size.x * (shoulder ? 1.33 : 1.30);
    const cuff = MeshBuilder.CreateCylinder("shouterFurBacking", {
      height: size.y * (shoulder ? 0.62 : 0.28), diameter: radius * 2, tessellation: 8,
    }, scene);
    cuff.parent = arm;
    cuff.position.set(center.x, y, center.z);
    cuff.scaling.z = size.z / size.x;
    cuff.material = root;
    out.push(cuff);
    for (let index = 0; index < 7; index++) {
      const angle = index * Math.PI * 2 / 7;
      const tuft = MeshBuilder.CreateIcoSphere("shouterFurTuft", { radius: 1, subdivisions: 1, flat: true }, scene);
      tuft.parent = arm;
      tuft.position.set(center.x + Math.sin(angle) * radius, y + size.y * (index % 2 ? 0.03 : -0.11),
        center.z + Math.cos(angle) * radius * size.z / size.x);
      tuft.scaling.set(size.x * 0.57, size.y * (shoulder ? 0.48 : 0.27), size.z * 0.47);
      tuft.rotation.set(Math.cos(angle) * 0.34, 0, -Math.sin(angle) * 0.34);
      tuft.material = index % 3 === 0 ? root : fur;
      out.push(tuft);
    }
  }
  return out;
}

/*
 * [S] 512 the Shouter's breeches end at the knee and the pale wraps take the shin below (secret.shouter.blue.png: baggy team breeches to the knee,
 * then a bulky tan wrap from the knee to mid-shin over brown boots; audit a.3 "narrow angular slivers intersect the front faces of the knees").
 * The thigh mesh runs ~.12 m past the knee joint, so a hem cut on the thigh box covered the wraps: the hem is anchored to the knee joint itself
 * (SHOUTER_LEG.hem m above it, LESSONS 433), and the wrap's .bands bands run down the shin from .wrapTop m above the joint, .step m apart.
 */
const SHOUTER_LEG = { hem: 0.02, wrapTop: 0.08, bands: 5, step: 0.052, bandH: 0.07, wrapW: 2.7 };
export function shouterBreeches(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const color = team.scale(0.62);
  const cloth = getMaterialFactory().get("cloth", color, { emissive: color.scale(0.15) });
  const out: Mesh[] = [];
  for (const [thigh, knee] of [[body.leftUpperLeg, body.leftKnee], [body.rightUpperLeg, body.rightKnee]] as const) {
    const { center, extendSize: size } = thigh.getBoundingInfo().boundingBox;
    const top = 0.94, hem = (knee.position.y - thigh.position.y + SHOUTER_LEG.hem - center.y) / size.y;
    const at = (f: number) => hem + (top - hem) * f;
    const shape = [[0, hem], [1.1, hem], [1.3, at(0.3)], [1.26, at(0.62)], [1.08, top], [0, top]] // [R] 513 narrower at the hip (a.1 "wide bulging hips")
      .map(([width, height]) => new Vector3(width * size.x, height * size.y, 0));
    const breech = MeshBuilder.CreateLathe("shouterBreech", { shape, tessellation: 7 }, scene);
    breech.parent = thigh;
    breech.position.copyFrom(center);
    breech.scaling.z = size.z / size.x;
    breech.material = cloth;
    breech.convertToFlatShadedMesh();
    thigh.isVisible = false;
    out.push(breech);
  }
  const pelvis = body.allMeshes.find(mesh => mesh.name.endsWith("_pelvis"));
  if (pelvis) {
    const { center, extendSize: size } = pelvis.getBoundingInfo().boundingBox;
    for (const side of [-1, 1]) {
      const flap = MeshBuilder.CreateBox("shouterSplitHem", { width: size.x * 0.99, height: size.y * 2.1, depth: size.z * 0.24 }, scene);
      flap.parent = pelvis;
      flap.position.set(center.x + side * size.x * 0.52, center.y - size.y * 0.48, center.z + size.z * 1.03);
      flap.rotation.z = side * 0.18;
      flap.material = cloth;
      out.push(flap);
    }
  }
  return out;
}

export function shouterKneeWraps(scene: Scene, body: ArticulatedBody): Mesh[] {
  const tan = new Color3(0.8, 0.60, 0.35);
  const cloth = getMaterialFactory().get("cloth", tan, { emissive: tan.scale(0.12) });
  const out: Mesh[] = [];
  const L = SHOUTER_LEG;
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const { center: c, extendSize: s } = shin.getBoundingInfo().boundingBox;
    const kneeY = -shin.position.y;
    for (let index = 0; index < L.bands; index++) {
      const band = MeshBuilder.CreateCylinder("shouterKneeBand", {
        height: L.bandH, diameterTop: s.x * L.wrapW, diameterBottom: s.x * (L.wrapW - 0.15), tessellation: 7,
      }, scene);
      band.parent = shin; band.position.set(c.x, kneeY + L.wrapTop - L.bandH / 2 - index * L.step, c.z);
      band.scaling.z = s.z / s.x * 0.95; band.rotation.z = index % 2 ? -0.10 : 0.10;
      band.material = cloth; band.convertToFlatShadedMesh(); out.push(band);
    }
  }
  // [R] 513 brown boots under the wraps (secret.shouter.red.png), not the team foot
  const brown = new Color3(0.2, 0.09, 0.06);
  const boot = getMaterialFactory().get("cloth", brown, { emissive: brown.scale(0.15), roughness: 1 });
  for (const foot of body.allMeshes.filter((m) => /_[lr]FootM$/.test(m.name))) { foot.material = boot; scene.getGlowLayerByName("glow")?.addExcludedMesh(foot); }
  return out;
}

export function shouterBracers(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const dark = team.scale(0.24);
  const leather = getMaterialFactory().get("cloth", dark, { emissive: dark.scale(0.12) });
  const edgeColor = team.scale(0.12);
  const edge = getMaterialFactory().get("cloth", edgeColor);
  const out: Mesh[] = [];
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    const { center: c, extendSize: s } = arm.getBoundingInfo().boundingBox;
    for (const [name, y, height, diameter, material] of [
      ["shouterBracer", -0.04, 1.28, 2.65, leather],
      ["shouterBracerTop", 0.59, 0.10, 2.76, edge],
      ["shouterBracerWrist", -0.67, 0.10, 2.22, edge],
    ] as const) {
      const guard = MeshBuilder.CreateCylinder(name, {
        height: s.y * height, diameterTop: s.x * diameter, diameterBottom: s.x * diameter * 0.77, tessellation: 6,
      }, scene);
      guard.parent = arm; guard.position.set(c.x, c.y + s.y * y, c.z);
      guard.scaling.z = s.z / s.x; guard.rotation.y = Math.PI / 6;
      guard.material = material; guard.convertToFlatShadedMesh(); out.push(guard);
    }
  }
  return out;
}

export function bomberShirt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const cream = new Color3(0.80, 0.60, 0.35);
  const mf = getMaterialFactory();
  const cloth = mf.get("unlit", cream, { emissive: cream });
  const foldColor = new Color3(0.91, 0.76, 0.52);
  const foldedCloth = mf.get("unlit", foldColor, { emissive: foldColor });
  const thread = mf.get("cloth", new Color3(0.31, 0.13, 0.075));
  const glow = scene.getGlowLayerByName("glow");
  const torso = body.torsoMesh;
  const out: Mesh[] = [];
  for (const mesh of [torso, ...body.allMeshes.filter((mesh) => mesh.name.endsWith("_yoke"))]) {
    mesh.material = cloth;
    glow?.addExcludedMesh(mesh);
  }
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    const { center, extendSize: size } = arm.getBoundingInfo().boundingBox;
    arm.material = cloth;
    glow?.addExcludedMesh(arm);
    arm.scaling.x *= 1.22;
    arm.scaling.z *= 1.19;
    for (const [index, offset] of [0.06, 0.23].entries()) {
      const cuff = MeshBuilder.CreateCylinder("bomberRolledSleeve", {
        height: size.y * 0.20, diameterTop: size.x * (index === 0 ? 1.70 : 1.77),
        diameterBottom: size.x * 1.67, tessellation: 8,
      }, scene);
      cuff.parent = arm;
      cuff.position.set(center.x, center.y - size.y * (1 - offset), center.z);
      cuff.scaling.z = size.z / size.x;
      cuff.material = index === 0 ? foldedCloth : cloth;
      glow?.addExcludedMesh(cuff);
      out.push(cuff);
    }
  }
  const { center, extendSize: size } = torso.getBoundingInfo().boundingBox;
  for (const [index, angle] of [-0.72, 0.72, Math.PI / 2].entries()) {
    const lace = MeshBuilder.CreateBox("bomberShirtLace", {
      width: size.x * 0.065, height: size.y * (index === 2 ? 0.22 : 0.29), depth: size.z * 0.06,
    }, scene);
    lace.parent = torso;
    lace.position.set(center.x, center.y + size.y * (index === 2 ? 0.64 : 0.86), center.z + size.z * 1.05);
    lace.rotation.z = angle;
    lace.material = thread;
    out.push(lace);
  }
  return out;
}

/**
 * [S] 511 the Jester's toe knives (secret.jester.red.png: a grey knife blade juts ahead of and below each shoe tip; card Appearance "two knives on
 * its shoes", Characteristics "sharp daggers on their hands and toes"; audit 500 b.2). Spec in the foot box (the merged boot under the knee, its
 * front face f, length L, width Wf, height Hf): per foot a flat steel blade .blade L long, .root Wf deep at the root to a point, .thin Wf thick, set
 * .lift Hf over the sole at the toe's front and pitched .pitch rad down past it; a dark clip band .clip L long round the toe at its root.
 */
const JESTER_TOE = { blade: 1.1, root: 0.7, thin: 0.12, lift: 0.3, pitch: -0.3, clip: 0.16, steel: new Color3(0.47, 0.49, 0.53), strap: new Color3(0.17, 0.075, 0.045) };
export function jesterToeKnives(scene: Scene, body: ArticulatedBody): Mesh[] {
  const T = JESTER_TOE, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const steel = mf.get("cloth", T.steel, { emissive: T.steel.scale(0.35), roughness: 0.6 });
  const strap = mf.get("cloth", T.strap, { emissive: T.strap.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  for (const foot of body.allMeshes.filter((m) => /_[lr]FootM$/.test(m.name))) {
    const { minimum: lo, maximum: hi } = foot.getBoundingInfo().boundingBox;
    const L = hi.z - lo.z, Wf = hi.x - lo.x, Hf = hi.y - lo.y, x = (lo.x + hi.x) / 2;
    const blade = MeshBuilder.CreateCylinder("jesterToeKnife", { height: L * T.blade, diameterBottom: Wf * T.root, diameterTop: 0.001, tessellation: 4 }, scene);
    blade.parent = foot; blade.material = steel;
    // laid along +z (the toe's way), its flat standing upright, the root on the toe's front face
    blade.rotation.set(Math.PI / 2 + T.pitch, 0, 0);
    blade.scaling.x = T.thin / T.root;
    const dir = new Vector3(0, -Math.sin(T.pitch), Math.cos(T.pitch));
    blade.position.set(x, lo.y + Hf * T.lift, hi.z).addInPlace(dir.scale((L * T.blade) / 2 - L * 0.06));
    out.push(blade);
    const clip = MeshBuilder.CreateBox("jesterToeClip", { width: Wf * 0.86, height: Hf * 0.32, depth: L * T.clip }, scene);
    clip.parent = foot; clip.material = strap;
    clip.position.set(x, lo.y + Hf * T.lift, hi.z - L * T.clip * 0.4);
    out.push(clip);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 511 the Jester's puffy striped shorts (secret.jester.red.png: from the hip to just over the knee each thigh is wrapped in a ballooning short
 * of upright stripes, team, gold and dark team in turn, closed at the hem by a dark team band; audit 500 a.4 "plain team legs"). Spec in the thigh
 * mesh's box (centre c, half size h, its long axis y): per thigh .slices upright arc slices, each two frustums from .top h.x round at the hip to
 * .bulge h.x at .mid of the way down and back to .hem h.x at the hem (.from h.y over c to .to h.y under it), coloured JESTER_STRIPES in turn; a band
 * .band h.y tall .hem*1.06 round at the hem in dark team. Team cloth of its own (LESSONS 449), out of the glow.
 */
const JESTER_SHORTS = { slices: 8, top: 1.22, bulge: 1.62, hem: 1.2, mid: 0.48, from: 1.08, to: 0.78, band: 0.16, gold: new Color3(0.78, 0.55, 0.14) };
const JESTER_STRIPES = [0, 1, 2, 1];
export function jesterShorts(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const J = JESTER_SHORTS, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const dark = team.scale(0.5);
  const mats = [
    mf.get("cloth", team, { emissive: team.scale(0.12), roughness: 1 }),
    mf.get("cloth", J.gold, { emissive: J.gold.scale(0.12), roughness: 1 }),
    mf.get("cloth", dark, { emissive: dark.scale(0.12), roughness: 1 }),
  ];
  const out: Mesh[] = [];
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg]) {
    const { center: c, extendSize: h } = leg.getBoundingInfo().boundingBox;
    const yTop = c.y + h.y * J.from, yHem = c.y - h.y * J.to, yMid = yTop + (yHem - yTop) * J.mid;
    for (let k = 0; k < J.slices; k++) {
      for (const [a, b, ra, rb] of [[yTop, yMid, J.top, J.bulge], [yMid, yHem, J.bulge, J.hem]]) {
        const piece = MeshBuilder.CreateCylinder("jesterShortsStripe", {
          height: a - b, diameterTop: h.x * ra * 2, diameterBottom: h.x * rb * 2, tessellation: J.slices * 2, arc: 1 / J.slices,
        }, scene);
        piece.parent = leg; piece.material = mats[JESTER_STRIPES[k % JESTER_STRIPES.length]];
        piece.position.set(c.x, (a + b) / 2, c.z);
        piece.rotation.y = (k * 2 * Math.PI) / J.slices;
        piece.scaling.z = h.z / h.x;
        out.push(piece);
      }
    }
    const band = MeshBuilder.CreateCylinder("jesterShortsHem", { height: h.y * J.band, diameter: h.x * J.hem * 2.12, tessellation: 8 }, scene);
    band.parent = leg; band.material = mats[2];
    band.position.set(c.x, yHem + h.y * J.band * 0.3, c.z);
    band.scaling.z = h.z / h.x;
    out.push(band);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 512 the Jester's belt (secret.jester.red.png: a dark brown leather belt round the tunic's waist, just over the skirt's flare, with a square
 * dark buckle framed in a pale edge at the front; audit 500 a.3 "none"). Spec in the torso mesh's box (centre c, half size s; front +z): an
 * eight-sided band .h s.y tall at .y s.y under c (the waist, above the tunic skirt's top), .out times the yoke's half width round and .deep of
 * that front to back; at the front a buckle plate .bW s.x wide, .bH s.y tall, .bOut proud of the band, in pale steel with a dark centre bar
 * (the TABS "E"). Lit leather of its own, the steel a little self-lit, out of the glow.
 */
const JESTER_BELT = {
  y: -0.5, h: 0.22, out: 1.1, deep: 0.62, bW: 0.46, bH: 0.34, bOut: 0.05,
  leather: new Color3(0.3, 0.2, 0.12), steel: new Color3(0.8, 0.78, 0.72), dark: new Color3(0.05, 0.05, 0.07),
};
export function jesterBelt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = JESTER_BELT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const torso = body.torsoMesh;
  const { center: c, extendSize: s } = torso.getBoundingInfo().boundingBox;
  const yoke = body.allMeshes.find(mesh => mesh.name.endsWith("_yoke"));
  const half = Math.max(s.x, yoke ? yoke.getBoundingInfo().boundingBox.extendSize.x : 0) * B.out;
  const leather = mf.get("cloth", B.leather, { emissive: B.leather.scale(0.12), roughness: 1 });
  const steel = mf.get("cloth", B.steel, { emissive: B.steel.scale(0.25) });
  const dark = mf.get("cloth", B.dark, { roughness: 1 });
  const out: Mesh[] = [];
  const y = c.y + s.y * B.y;
  const band = MeshBuilder.CreateCylinder("jesterBelt", { height: s.y * B.h, diameter: half * 2, tessellation: 8 }, scene);
  band.parent = torso; band.position.set(c.x, y, c.z);
  band.rotation.y = Math.PI / 8; band.scaling.z = B.deep;
  band.material = leather; out.push(band);
  const front = c.z + half * B.deep * Math.cos(Math.PI / 8) + s.x * B.bOut;
  const plate = (name: string, x: number, yy: number, w: number, h: number, material: Material, z: number) => {
    const mesh = MeshBuilder.CreateBox(name, { width: s.x * w, height: s.y * h, depth: s.x * 0.06 }, scene);
    mesh.parent = torso; mesh.position.set(c.x + s.x * x, y + s.y * yy, front + z);
    mesh.material = material; out.push(mesh);
  };
  plate("jesterBuckle", 0, 0, B.bW, B.bH, steel, 0);
  plate("jesterBuckleBar", 0.02, 0, B.bW * 0.6, B.bH * 0.22, dark, s.x * 0.035);
  plate("jesterBuckleBar", -B.bW * 0.28, 0, B.bW * 0.16, B.bH * 0.7, dark, s.x * 0.035);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 511 the Ballooner's slashed doublet (secret.ballooner.red.png: a team doublet with a cream V insert from the collar's points to the belly,
 * big puffed team shoulders over the upper arms slashed with cream, and a dark belt with a buckle at the waist; audit 500 a.3 "a plain pale-blue
 * tunic block"). Spec in torso widths TW, heights TH, depths TD (the torso mesh's box, its top the collar): the trunk, yoke and pads in team cloth;
 * the V two cream slats .vW TW wide from .vTop TW out at the collar to the middle .vDeep TH down, .vOut proud of the chest; per arm a puff, an ico
 * ball .puff upper-arm widths across and .puffLong of its length, over the arm's top .puffAt, with .slashes cream slats down its outer face; the
 * belt a band .beltH TH tall .beltOut wider than the trunk at .beltAt TH over its foot, a brass buckle. Team cloth of its own (LESSONS 449), the
 * cream flat unlit (LESSONS 442), out of the glow.
 */
const BALLOONER_DOUBLET = {
  vW: 0.09, vTop: 0.2, vDeep: 0.62, vOut: 0.03, puff: 2.5, puffLong: 0.62, puffAt: 0.3, slashes: 3, beltH: 0.1, beltOut: 1.06, beltAt: 0.12,
  cream: new Color3(0.95, 0.88, 0.7), belt: new Color3(0.16, 0.08, 0.04), brass: new Color3(0.75, 0.55, 0.15),
};
export function balloonerDoublet(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = BALLOONER_DOUBLET, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const cloth = mf.get("cloth", team, { emissive: team.scale(0.12), roughness: 1 });
  const cream = mf.get("unlit", C.cream, { emissive: C.cream });
  const belt = mf.get("cloth", C.belt, { emissive: C.belt.scale(0.12), roughness: 1 });
  const brass = mf.get("cloth", C.brass, { emissive: C.brass.scale(0.12) });
  for (const m of [body.torsoMesh, ...body.allMeshes.filter((x) => /_yoke$|_[lr]Pad$/.test(x.name))]) m.material = cloth;
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, sc = tm.scaling;
  const TW = tb.extendSize.x * 2 * sc.x, TH = tb.extendSize.y * 2 * sc.y, TD = tb.extendSize.z * 2 * sc.z;
  const top = tm.position.y + (tb.center.y + tb.extendSize.y) * sc.y, cx = tm.position.x + tb.center.x * sc.x, cz = tm.position.z + tb.center.z * sc.z;
  const front = cz + TD / 2;
  const out: Mesh[] = [];
  for (const side of [-1, 1]) {
    // a slat of the V: from the collar's point down and in to the middle
    const a = new Vector3(cx + side * TW * C.vTop, top - TH * 0.02, front + TW * C.vOut), e = new Vector3(cx, top - TH * C.vDeep, front + TW * C.vOut);
    const d = e.subtract(a);
    const slat = MeshBuilder.CreateBox("balloonerDoubletV", { width: TW * C.vW, height: d.length(), depth: TW * 0.03 }, scene);
    slat.parent = body.torso; slat.material = cream; slat.position.copyFrom(a.add(e).scale(0.5));
    slat.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), d.normalize(), new Quaternion());
    out.push(slat);
  }
  const beltY = top - TH + TH * C.beltAt;
  const band = MeshBuilder.CreateBox("balloonerBelt", { width: TW * C.beltOut, height: TH * C.beltH, depth: TD * C.beltOut + TW * 0.04 }, scene);
  band.parent = body.torso; band.material = belt; band.position.set(cx, beltY, cz); out.push(band);
  const buckle = MeshBuilder.CreateBox("balloonerBeltBuckle", { width: TW * 0.13, height: TH * C.beltH * 1.25, depth: TW * 0.03 }, scene);
  buckle.parent = body.torso; buckle.material = brass; buckle.position.set(cx + TW * 0.08, beltY, cz + (TD * C.beltOut) / 2 + TW * 0.03); out.push(buckle);
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    const { center: c, extendSize: h } = arm.getBoundingInfo().boundingBox;
    const outward = arm === body.leftUpperArm ? -1 : 1;
    const R = h.x * C.puff, y = c.y + h.y * (1 - C.puffAt);
    const puff = MeshBuilder.CreateIcoSphere("balloonerPuff", { radius: R, subdivisions: 1 }, scene);
    puff.parent = arm; puff.material = cloth; puff.position.set(c.x, y, c.z);
    puff.scaling.set(1, (h.y * 2 * C.puffLong) / (2 * R), (h.z / h.x) * 1.05);
    out.push(puff);
    for (let k = 0; k < C.slashes; k++) {
      const ang = (k - (C.slashes - 1) / 2) * 0.75;
      const slash = MeshBuilder.CreateBox("balloonerPuffSlash", { width: R * 0.22, height: h.y * 2 * C.puffLong * 0.62, depth: R * 0.12 }, scene);
      slash.parent = arm; slash.material = cream;
      // on the puff's outer face, fanned round it from the front to the back
      slash.position.set(c.x + outward * Math.cos(ang) * R * 0.93, y, c.z + Math.sin(ang) * R * 0.93 * (h.z / h.x));
      slash.rotation.y = -outward * ang;
      out.push(slash);
    }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 512 the Teacher's little black shoes (card Appearance "dark pants with little black shoes"; secret.the_teacher.red.png: small near-black
 * ankle shoes under the trouser legs, much slimmer than a boot; audit 500 a.5 "team boots"). The team boot (foot box: length L, width Wf, height
 * Hf, toe +z) is hidden; in its place per foot a slim ankle quarter .ankleW Wf wide, .ankleH Hf tall over the rear .ankleL L (it tops the grass,
 * which hides a foot box to ~.6, LESSONS 434), a low vamp .toeW Wf wide, .toeH Hf tall over the front .toeL L, its nose bevelled down, and a heel
 * block. Near-black lit cloth self-lit .4 (LESSONS 494), out of the glow.
 */
const TEACHER_SHOE = { ankleW: 0.8, ankleH: 0.92, ankleL: 0.48, toeW: 0.74, toeH: 0.42, toeL: 0.6, heelH: 0.14, black: new Color3(0.08, 0.06, 0.07) };
export function teacherShoes(scene: Scene, body: ArticulatedBody): Mesh[] {
  const T = TEACHER_SHOE, glow = scene.getGlowLayerByName("glow");
  const black = getMaterialFactory().get("cloth", T.black, { emissive: T.black.scale(0.4), roughness: 1 });
  const out: Mesh[] = [];
  for (const foot of body.allMeshes.filter((m) => /_[lr]FootM$/.test(m.name))) {
    const { minimum: lo, maximum: hi } = foot.getBoundingInfo().boundingBox;
    const L = hi.z - lo.z, Wf = hi.x - lo.x, Hf = hi.y - lo.y, x = (lo.x + hi.x) / 2;
    const part = (name: string, w: number, h: number, d: number, y: number, z: number) => {
      const mesh = MeshBuilder.CreateBox(name, { width: Wf * w, height: Hf * h, depth: L * d }, scene);
      mesh.parent = foot; mesh.material = black;
      mesh.position.set(x, lo.y + Hf * y, lo.z + L * z);
      out.push(mesh);
      return mesh;
    };
    part("teacherShoeAnkle", T.ankleW, T.ankleH, T.ankleL, T.ankleH / 2, T.ankleL / 2);
    part("teacherShoeVamp", T.toeW, T.toeH, T.toeL, T.toeH / 2, 1 - T.toeL / 2);
    const nose = part("teacherShoeNose", T.toeW * 0.9, T.toeH * 0.7, 0.16, T.toeH * 0.42, 1 - 0.02);
    nose.rotation.x = 0.5;
    part("teacherShoeHeel", T.ankleW * 0.9, T.heelH, 0.22, T.heelH / 2 - 0.04, 0.12);
    foot.isVisible = false;
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 513 the Teacher's trousers (secret.the_teacher.blue.png, .red.png: dark trousers in the jacket's own cloth from the hip to the little black
 * shoes, straight and a little loose, hemmed just over the shoe; card Appearance "dark pants with little black shoes"; CONFIRM 512 a.1 "bare team
 * skin from hip to ankle"). Per thigh and shin an 8-sided shell .loose of the limb box round (thigh) over its whole length, the shin's flaring to
 * .flare at its hem; both limbs and the pelvis re-clothed in the jacket's material (body.torsoMesh), so a gap shows the same cloth.
 */
const TEACHER_TROUSER = { loose: 1.16, flare: 1.26 };
export function teacherTrousers(scene: Scene, body: ArticulatedBody): Mesh[] {
  const T = TEACHER_TROUSER, jacket = body.torsoMesh.material;
  if (!jacket) return [];
  const out: Mesh[] = [];
  for (const [limb, shin] of [[body.leftUpperLeg, false], [body.rightUpperLeg, false], [body.leftLowerLeg, true], [body.rightLowerLeg, true]] as const) {
    const { center: c, extendSize: s } = limb.getBoundingInfo().boundingBox;
    const shell = MeshBuilder.CreateCylinder(shin ? "teacherTrouserShin" : "teacherTrouserThigh", {
      height: s.y * 2, diameterTop: s.x * 2 * T.loose, diameterBottom: s.x * 2 * (shin ? T.flare : T.loose), tessellation: 8,
    }, scene);
    shell.parent = limb; shell.position.copyFrom(c); shell.scaling.z = s.z / s.x; shell.rotation.y = Math.PI / 8;
    shell.material = jacket; shell.convertToFlatShadedMesh(); out.push(shell);
    limb.material = jacket;
  }
  const pelvis = body.allMeshes.find((m) => m.name.endsWith("_pelvis"));
  if (pelvis) pelvis.material = jacket;
  return out;
}

/**
 * [S] 513 the Teacher's jacket sleeves (secret.the_teacher.red.png: the dark jacket's sleeves run from the shoulder to the wrist, a little loose,
 * only the hands bare team skin; CONFIRM 512 a.2 "the arms are bright team skin from shoulder to hand"). Per upper and lower arm an 8-sided shell
 * .loose of the limb box round over its length, the forearm's widening to a .cuff turned cuff band .cuffH of it long at the wrist end (the box's
 * far end from the elbow); both arm meshes and the elbow stubs re-clothed in the jacket's material (body.torsoMesh). Hands untouched.
 */
const TEACHER_SLEEVE = { loose: 1.18, cuff: 1.42, cuffH: 0.16 };
export function teacherSleeves(scene: Scene, body: ArticulatedBody): Mesh[] {
  const T = TEACHER_SLEEVE, jacket = body.torsoMesh.material;
  if (!jacket) return [];
  const out: Mesh[] = [];
  for (const [arm, lower] of [[body.leftUpperArm, false], [body.rightUpperArm, false], [body.leftLowerArm, true], [body.rightLowerArm, true]] as const) {
    const { center: c, extendSize: s } = arm.getBoundingInfo().boundingBox;
    const shell = MeshBuilder.CreateCylinder(lower ? "teacherSleeveLower" : "teacherSleeveUpper", {
      height: s.y * 2, diameter: s.x * 2 * T.loose, tessellation: 8,
    }, scene);
    shell.parent = arm; shell.position.copyFrom(c); shell.scaling.z = s.z / s.x; shell.rotation.y = Math.PI / 8;
    shell.material = jacket; shell.convertToFlatShadedMesh(); out.push(shell);
    if (lower) {
      const cuff = MeshBuilder.CreateCylinder("teacherSleeveCuff", { height: s.y * 2 * T.cuffH, diameter: s.x * 2 * T.cuff, tessellation: 8 }, scene);
      cuff.parent = arm; cuff.position.set(c.x, c.y - s.y * (1 - T.cuffH), c.z); cuff.scaling.z = s.z / s.x; cuff.rotation.y = Math.PI / 8;
      cuff.material = jacket; cuff.convertToFlatShadedMesh(); out.push(cuff);
    }
    arm.material = jacket;
  }
  return out;
}

/**
 * [S] 512 the Executioner's trousers tucked into banded boots (secret.executioner.red.png: dark team trousers down the thigh into tall darker boots
 * that reach just under the knee, ridged by four raised bands and topped by a flared cuff; audit 500 a.4 "plain team legs"). Spec in the shin's box
 * (centre c, half size s) and the foot box: thighs and the upper shin in trouser cloth (team x .trouser); a boot shaft .shaft s.x round over the
 * shin from its foot to .top of the way up from the knee joint's foot, a flared cuff .cuff round at its top, .bands raised bands .band s.x round
 * spread evenly down it, and the foot box re-clothed in boot cloth (team x .boot). Own team cloth (LESSONS 449), out of the glow.
 */
const EXEC_BOOT = { trouser: 0.5, boot: 0.26, ridge: 0.15, shaft: 2.25, cuff: 2.55, band: 2.45, top: 0.82, bands: 4 };
export function executionerBoots(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const E = EXEC_BOOT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const cloth = (k: number) => { const c = team.scale(k); return mf.get("cloth", c, { emissive: c.scale(0.12), roughness: 1 }); };
  const trousers = cloth(E.trouser), boot = cloth(E.boot), ridge = cloth(E.ridge);
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) thigh.material = trousers;
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    shin.material = trousers;
    const { center: c, extendSize: s } = shin.getBoundingInfo().boundingBox;
    const kneeY = -shin.position.y, foot = c.y - s.y;
    const top = foot + (kneeY - foot) * E.top, mid = (top + foot) / 2, len = top - foot;
    const ring = (name: string, height: number, round: number, y: number, material: Material) => {
      const mesh = MeshBuilder.CreateCylinder(name, { height, diameterTop: s.x * round, diameterBottom: s.x * round * 0.94, tessellation: 8 }, scene);
      mesh.parent = shin; mesh.position.set(c.x, y, c.z);
      mesh.scaling.z = s.z / s.x; mesh.rotation.y = Math.PI / 8;
      mesh.material = material; out.push(mesh);
    };
    ring("executionerBootShaft", len, E.shaft, mid, boot);
    ring("executionerBootCuff", len * 0.14, E.cuff, top - len * 0.04, boot);
    for (let k = 0; k < E.bands; k++) ring("executionerBootBand", len * 0.06, E.band, top - len * (0.26 + k * 0.19), ridge);
  }
  for (const foot of body.allMeshes.filter((m) => /_[lr]FootM$/.test(m.name))) foot.material = boot;
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 512 the Bomber's open team vest (secret.bomb_on_a_stick.blue.png: a dark team waistcoat open down the front over the cream shirt, its fronts
 * from the shoulders to the belt either side of a wide cream gap, a lighter team edge down each opening, a team back; audit 500 a.4 "none"). Spec in
 * the yoke mesh's box (centre c, half size h; front +z): per side a front panel .frontW h.x wide at .frontX h.x out, .tall h.y tall, .out h.z
 * proud of the front, with an edge strip .edgeW h.x wide on its inner side; a side panel at .sideX h.x and a back panel, all .thick h.z thick. Own
 * team cloth (LESSONS 449), out of the glow.
 */
const BOMBER_VEST = { frontW: 0.6, frontX: 0.68, tall: 1.86, low: -0.06, out: 1.04, thick: 0.2, edgeW: 0.09, sideX: 1.04, vest: 0.55, edge: 0.95 };
export function bomberVest(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const V = BOMBER_VEST, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const yoke = body.allMeshes.find((mesh) => mesh.name.endsWith("_yoke")) ?? body.torsoMesh;
  const { center: c, extendSize: h } = yoke.getBoundingInfo().boundingBox;
  const vestColor = team.scale(V.vest), edgeColor = team.scale(V.edge);
  const vest = mf.get("cloth", vestColor, { emissive: vestColor.scale(0.12), roughness: 1 });
  const edge = mf.get("cloth", edgeColor, { emissive: edgeColor.scale(0.2), roughness: 1 });
  const out: Mesh[] = [];
  const y = c.y + h.y * V.low, tall = h.y * V.tall, thick = h.z * V.thick;
  const panel = (name: string, w: number, d: number, x: number, z: number, material: Material) => {
    const mesh = MeshBuilder.CreateBox(name, { width: w, height: tall, depth: d }, yoke.getScene());
    mesh.parent = yoke; mesh.material = material; mesh.position.set(c.x + x, y, c.z + z);
    out.push(mesh);
  };
  for (const side of [-1, 1]) {
    panel("bomberVestFront", h.x * V.frontW, thick, side * h.x * V.frontX, h.z * V.out, vest);
    panel("bomberVestEdge", h.x * V.edgeW, thick * 1.1, side * h.x * (V.frontX - V.frontW / 2 + V.edgeW / 2), h.z * V.out + thick * 0.15, edge);
    panel("bomberVestSide", thick, h.z * 2 * V.out, side * h.x * V.sideX, 0, vest);
  }
  panel("bomberVestBack", h.x * 2 * V.sideX, thick, 0, -h.z * V.out, vest);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}
