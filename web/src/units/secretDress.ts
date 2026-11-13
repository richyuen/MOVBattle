import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, Scene, TransformNode, Vector3, VertexData } from "@babylonjs/core";
import type { Material } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { limbBox, limbShell } from "./medievalDress";

/*
 * Secret faction cloth, hats and ornaments (loop: new per-unit dress goes here, not into unitFactory or propBuilder).
 */

/**
 * [R] 517 the Fan Bearer's whole dress, one pass owning sash, skirt, legs and shoes (plateau a: CONFIRM 514 "skirt shade, sash width", CONFIRM
 * 515 "dark navy wraps covering the whole lower leg"). Spec read off secret.fan_bearer.red.png and .blue.png, card Appearance ("a sash over its
 * right shoulder and a three piece skirt, all of which are different shades of team color ... wrist guards and shoes identical to those of the
 * Sarissa"):
 *  - cloth: every garment piece is a SATURATED deep shade of team colour (TABS: deep navy on blue, deep crimson on red, never grey). The team
 *    colour is saturated by raising it to the power .sat (renormalised to its own peak) and scaled per piece: sash .sash, skirt body .skirt,
 *    left flap .left, right flap .right, the light under-layer band .hem (paler than the skirt, still team). Lit cloth self-lit .12 (the palette
 *    wall's "cloth" swatches read saturated; the 515 self-light .4 on an unsaturated team x .36 read grey), own materials, out of the glow.
 *  - sash: the 515 geometry (FAN_SASH), broad over the right shoulder to the left hip with its hip fall and two folds.
 *  - skirt: the 513/515 geometry (FAN_SKIRT): under-skirt to .62 of the thigh, two slanted front flaps, the light hem band below.
 *  - legs: bare team skin from the skirt to the ankle: thighs AND shins in the skin material (the shins were the dark body cloth: the navy wraps).
 *  - shoes: the grey team boot hidden; small dark-brown low shoes per foot (FAN_SHOE, the Teacher's cut, lower): ankle .ankleH of the foot
 *    box tall (tops the grass at ~.6, LESSONS 434), vamp, bevelled nose. Dark brown lit cloth self-lit .4, out of the glow.
 */
const FAN_DRESS = { sat: 2, sash: 0.42, skirt: 0.5, left: 0.38, right: 0.3, hem: 0.95 };
const FAN_SHOE = { ankleW: 0.86, ankleH: 0.7, ankleL: 0.5, toeW: 0.8, toeH: 0.4, toeL: 0.58, brown: new Color3(0.13, 0.07, 0.04) };
export function fanBearerDress(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const D = FAN_DRESS, mf = getMaterialFactory();
  const peak = Math.max(team.r, team.g, team.b), sat = new Color3(team.r ** D.sat, team.g ** D.sat, team.b ** D.sat);
  const deep = sat.scale(peak / Math.max(sat.r, sat.g, sat.b, 1e-3));
  const cloth = (k: number) => { const col = deep.scale(k); return mf.get("cloth", col, { emissive: col.scale(0.12), roughness: 1 }); };
  const hemCol = team.scale(D.hem), hemCloth = mf.get("cloth", hemCol, { emissive: hemCol.scale(0.12), roughness: 1 });
  const out = [
    ...fanBearerSash(scene, body, cloth(D.sash), cloth(D.sash * 0.7)),
    ...fanBearerSkirt(scene, body, cloth(D.skirt), cloth(D.left), cloth(D.right), hemCloth),
    ...fanBearerShoes(scene, body),
  ];
  // bare team legs from the skirt to the shoes (the shins wore the dark body cloth); the pelvis under the skirt in its cloth
  for (const limb of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) limb.material = body.skinMaterial;
  const pelvis = body.allMeshes.find((m) => m.name.endsWith("_pelvis"));
  if (pelvis) pelvis.material = cloth(D.skirt);
  return out;
}

function fanBearerShoes(scene: Scene, body: ArticulatedBody): Mesh[] {
  const T = FAN_SHOE, glow = scene.getGlowLayerByName("glow");
  const brown = getMaterialFactory().get("cloth", T.brown, { emissive: T.brown.scale(0.4), roughness: 1 });
  const out: Mesh[] = [];
  for (const foot of body.allMeshes.filter((m) => /_[lr]FootM$/.test(m.name))) {
    const { minimum: lo, maximum: hi } = foot.getBoundingInfo().boundingBox;
    const L = hi.z - lo.z, Wf = hi.x - lo.x, Hf = hi.y - lo.y, x = (lo.x + hi.x) / 2;
    const part = (name: string, w: number, h: number, d: number, y: number, z: number) => {
      const mesh = MeshBuilder.CreateBox(name, { width: Wf * w, height: Hf * h, depth: L * d }, scene);
      mesh.parent = foot; mesh.material = brown;
      mesh.position.set(x, lo.y + Hf * y, lo.z + L * z);
      out.push(mesh);
      return mesh;
    };
    part("fanBearerShoeAnkle", T.ankleW, T.ankleH, T.ankleL, T.ankleH / 2, T.ankleL / 2);
    part("fanBearerShoeVamp", T.toeW, T.toeH, T.toeL, T.toeH / 2, 1 - T.toeL / 2);
    const nose = part("fanBearerShoeNose", T.toeW * 0.9, T.toeH * 0.7, 0.16, T.toeH * 0.42, 1 - 0.02);
    nose.rotation.x = 0.5;
    foot.isVisible = false;
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 515 the Fan Bearer's wrapped sash (secret.fan_bearer.red.png: a broad cloth in a darker shade of team colour, about a third of the chest
 * wide, thrown over his right shoulder, falling across the chest to the left hip, where its end hangs down over the skirt, with fold lines along
 * it; card Appearance "a sash over its right shoulder"; CONFIRM 514 a.2 "a thin dark strap"). Bare team chest under it. Spec in the torso mesh's
 * frame (box centre c, half size s): front and back runs .wide s.x across and .thick s.z deep from the shoulder point (x .sx, y .sy) to the hip
 * point (x .hx, y .hy), standing .out s.z off the chest; a shoulder drape .capW s.x wide over the top, .capH s.y deep, rolled down the arm side;
 * a hip fall .fallW s.x wide and .fall s.y long hanging from the hip point, slanted .fallTilt rad; two fold ridges .fold s.x wide along the front
 * run at .foldAt of its width either side of the middle, team x .foldShade. Team x .shade self-lit .4 (FAN_SKIRT's flaps), own material, out of the glow.
 */
const FAN_SASH = {
  wide: 0.66, thick: 0.16, sx: 0.78, sy: 1.06, hx: -0.8, hy: -0.86, out: 1.1, capW: 0.72, capH: 0.22, fallW: 0.5, fall: 0.62, fallTilt: 0.16,
  fold: 0.07, foldAt: 0.28,
};
// [R] 517 materials from fanBearerDress (the saturated team shades); FAN_SASH.shade/.foldShade retired
function fanBearerSash(scene: Scene, body: ArticulatedBody, cloth: Material, foldCloth: Material): Mesh[] {
  const F = FAN_SASH, torso = body.torsoMesh, glow = scene.getGlowLayerByName("glow");
  const { center: c, extendSize: s } = torso.getBoundingInfo().boundingBox;
  for (const mesh of [torso, ...body.allMeshes.filter(m => /_yoke$|_[lr]Pad$/.test(m.name))]) {
    mesh.material = body.skinMaterial;
    glow?.addExcludedMesh(mesh);
  }
  const out: Mesh[] = [];
  const slab = (name: string, a: Vector3, b: Vector3, width: number, depth: number, material: Material) => {
    const run = b.subtract(a);
    const m = MeshBuilder.CreateBox(name, { width, height: run.length(), depth }, scene);
    m.parent = torso; m.position.copyFrom(a.add(b).scale(0.5));
    m.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), run.normalize(), new Quaternion());
    m.material = material; out.push(m);
    return m;
  };
  // Front and back runs from the right shoulder to the left hip, broad and standing off the chest
  for (const front of [-1, 1]) {
    const a = new Vector3(c.x + s.x * F.sx, c.y + s.y * F.sy, c.z + front * s.z * F.out);
    const b = new Vector3(c.x + s.x * F.hx, c.y + s.y * F.hy, c.z + front * s.z * (F.out + 0.04));
    slab("fanBearerSash", a, b, s.x * F.wide, s.z * F.thick, cloth);
    if (front > 0) {
      // fold ridges along the front run, either side of its middle
      const across = new Vector3(b.y - a.y, -(b.x - a.x), 0).normalize();
      for (const k of [-1, 1]) {
        const o = across.scale(k * s.x * F.wide * F.foldAt).add(new Vector3(0, 0, s.z * F.thick * 0.55));
        slab("fanBearerSashFold", a.add(o), b.add(o), s.x * F.fold, s.z * F.thick * 0.5, foldCloth);
      }
    }
  }
  // the drape over the shoulder top, rolled a little down the arm side
  const cap = MeshBuilder.CreateBox("fanBearerSashShoulder", { width: s.x * F.capW, height: s.y * F.capH, depth: s.z * (F.out * 2 + F.thick) }, scene);
  cap.parent = torso; cap.position.set(c.x + s.x * F.sx, c.y + s.y * (F.sy + 0.02), c.z); cap.rotation.z = -0.22;
  cap.material = cloth; out.push(cap);
  // the end hanging from the left hip over the skirt
  const hip = new Vector3(c.x + s.x * F.hx, c.y + s.y * F.hy, c.z + s.z * (F.out + 0.06));
  const fall = MeshBuilder.CreateBox("fanBearerSashFall", { width: s.x * F.fallW, height: s.y * F.fall, depth: s.z * F.thick }, scene);
  fall.parent = torso; fall.position.set(hip.x, hip.y - (s.y * F.fall) / 2, hip.z); fall.rotation.z = F.fallTilt;
  fall.material = cloth; out.push(fall);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 514 the Fan Bearer's wrist guards (card Appearance "wrist guards ... identical to those of the Sarissa"; secret.fan_bearer.red.png: a tan
 * leather guard over each forearm from about its middle down to the wrist, flaring a little toward the elbow, a darker strap round each end; audit
 * a.4 "wrists: none"). Spec on each lower arm (limbBox: its length and half-width in its joint's frame, 0 its top, 1 the wrist): an 8-sided
 * flat-shaded shell from .from to .to of the way down, .out of the half-width round at the top tapering to .taper of that at the wrist; a strap
 * .strap of the length tall and .band round at each end. The Sarissa's leather and dark browns, self-lit .12, out of the glow.
 */
const FAN_GUARD = { from: 0.36, to: 0.97, out: 1.7, taper: 0.84, strap: 0.07, band: 1.12, leather: new Color3(0.4, 0.24, 0.13), dark: new Color3(0.2, 0.11, 0.06) };
export function fanBearerWristGuards(scene: Scene, body: ArticulatedBody): Mesh[] {
  const G = FAN_GUARD, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const leather = mf.get("cloth", G.leather, { emissive: G.leather.scale(0.12), roughness: 1 });
  const dark = mf.get("cloth", G.dark, { emissive: G.dark.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  for (const fore of [body.leftLowerArm, body.rightLowerArm]) {
    const L = limbBox(fore), r = Math.max(L.wide, L.deep), top = L.mid + L.half;
    const at = (t: number) => top - t * L.half * 2;
    const ring = (name: string, a: number, b: number, rTop: number, rBot: number, material: Material) => {
      const m = MeshBuilder.CreateCylinder(name, { height: at(a) - at(b), diameterTop: rTop * 2, diameterBottom: rBot * 2, tessellation: 8 }, scene);
      m.parent = fore.parent; m.position.y = (at(a) + at(b)) / 2; m.scaling.z = (L.deep / r) * 1.1; m.rotation.y = Math.PI / 8;
      m.material = material; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m);
    };
    const rAt = (t: number) => r * G.out * (1 - (1 - G.taper) * ((t - G.from) / (G.to - G.from)));
    ring("fanBearerWristGuard", G.from, G.to, rAt(G.from), rAt(G.to), leather);
    for (const t of [G.from, G.to - G.strap]) ring("fanBearerGuardStrap", t, t + G.strap, rAt(t) * G.band, rAt(t + G.strap) * G.band, dark);
  }
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
// [S] 515 (a.1, CONFIRM 514 "pale grey-blue, lighter than the skin"): the skirt body is the darker team cloth (.under); the light under-layer
// shows only as a band .hemH of the length deep below its hem, .hemOut wider, team x .hemShade (secret.fan_bearer.red.png: pale only at the hem)
// [R] 517 materials from fanBearerDress (skirt body, left and right flaps, hem band); the shade numbers retired, thighs re-skinned there
const FAN_SKIRT = { r: 1.18, flare: 1.3, long: 0.62, deep: 1.25, flapW: 1.15, flapOut: 0.06, left: 0.96, right: 0.82, slant: 0.18, hemH: 0.16, hemOut: 1.04 };
function fanBearerSkirt(scene: Scene, body: ArticulatedBody, skirtCloth: Material, leftCloth: Material, rightCloth: Material, hemCloth: Material): Mesh[] {
  const F = FAN_SKIRT, glow = scene.getGlowLayerByName("glow");
  const pelvis = body.allMeshes.find((m) => m.name.endsWith("_pelvis"));
  if (!pelvis) return [];
  const { center: c, extendSize: h, maximum: hi } = pelvis.getBoundingInfo().boundingBox;
  const kneeY = (originIn(body.leftKnee, pelvis).y + originIn(body.rightKnee, pelvis).y) / 2;
  const top = hi.y, hem = top + (kneeY - top) * F.long, long = top - hem;
  const out: Mesh[] = [];
  const under = MeshBuilder.CreateCylinder("fanBearerSkirt", { height: long, diameterTop: h.x * 2 * F.r, diameterBottom: h.x * 2 * F.r * F.flare, tessellation: 8 }, scene);
  under.parent = pelvis; under.position.set(c.x, top - long / 2, c.z); under.scaling.z = (h.z * F.deep) / (h.x * F.r); under.rotation.y = Math.PI / 8;
  under.material = skirtCloth; out.push(under);
  // the light under-layer, a band showing only below the dark skirt's hem
  const hemH = long * F.hemH, rHem = h.x * F.r * F.flare * F.hemOut;
  const band = MeshBuilder.CreateCylinder("fanBearerSkirtHem", { height: hemH, diameterTop: rHem * 2 * 0.97, diameterBottom: rHem * 2, tessellation: 8 }, scene);
  band.parent = pelvis; band.position.set(c.x, top - long - hemH / 2 + hemH * 0.3, c.z); band.scaling.z = (h.z * F.deep) / (h.x * F.r); band.rotation.y = Math.PI / 8;
  band.material = hemCloth; out.push(band);
  // the flaps lean out with the under-skirt's flare, standing .flapOut off it
  const zTop = h.z * F.deep, flareOut = zTop * (F.flare - 1), lean = Math.atan2(flareOut, long);
  for (const [side, reach, shade] of [[1, F.left, leftCloth], [-1, F.right, rightCloth]] as const) {
    const flapLong = long * reach, k = reach / 2;
    const flap = MeshBuilder.CreateBox("fanBearerSkirtFlap", { width: h.x * F.flapW, height: flapLong, depth: h.z * 0.14 }, scene);
    flap.parent = pelvis;
    flap.position.set(c.x + side * h.x * 0.38, top - flapLong / 2, c.z + zTop + flareOut * k + h.z * F.flapOut + (side > 0 ? 0 : h.z * 0.1));
    flap.rotation.set(-lean, 0, side * F.slant); flap.material = shade; out.push(flap); // hem out (+z)
  }
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

/**
 * [S] 514 the Chu Ko Nu's shirt sleeves (secret.chu_ko_nu.blue.png: a loose team shirt sleeve from the shoulder down to the wrist on both arms,
 * fuller than the arm, a little wider at the forearm; audit a.1 "exposed stick-thin upper arm"). Per upper and lower arm an 8-sided shell over the
 * limb box's length, .upper / .lower of its half width round (the forearm's .flare wider at the wrist end), the upper one run .over of its length up
 * into the shoulder; both arm meshes re-clothed in the shell's team cloth. Team cloth of its own (LESSONS 449), self-lit .12.
 */
const KONU_SLEEVE = { upper: 1.55, lower: 1.5, flare: 1.18, over: 0.12 };
export function chuKoNuSleeves(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const S = KONU_SLEEVE;
  const cloth = getMaterialFactory().get("cloth", team, { emissive: team.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  for (const [arm, lower] of [[body.leftUpperArm, false], [body.rightUpperArm, false], [body.leftLowerArm, true], [body.rightLowerArm, true]] as const) {
    const { center: c, extendSize: s } = arm.getBoundingInfo().boundingBox;
    const r = s.x * 2 * (lower ? S.lower : S.upper), over = lower ? 0 : s.y * 2 * S.over;
    const shell = MeshBuilder.CreateCylinder(lower ? "konuSleeveLower" : "konuSleeveUpper", {
      height: s.y * 2 + over, diameterTop: r, diameterBottom: lower ? r * S.flare : r, tessellation: 8,
    }, scene);
    shell.parent = arm; shell.position.set(c.x, c.y + over / 2, c.z); shell.scaling.z = s.z / s.x; shell.rotation.y = Math.PI / 8;
    shell.material = cloth; shell.convertToFlatShadedMesh(); out.push(shell);
    arm.material = cloth;
  }
  return out;
}

/**
 * [S] 514 the Chu Ko Nu's cloth mitts (secret.chu_ko_nu.blue.png: both hands wrapped in pale cream cloth mitts, bulkier than the bare fist, a
 * wrapped band at the wrist; audit a.2 "bare team-blue hands"). Per hand mesh a flat-shaded box .mitt of the hand box round it (its own centre),
 * and a band .band of the hand's width round at the wrist end, .bandH of its height tall; the hand mesh under it in the same cream. Flat unlit cream
 * (LESSONS 442: lit cream reads grey in the field), out of the glow.
 */
const KONU_MITT = { mitt: 1.3, band: 1.45, bandH: 0.28, cream: new Color3(0.86, 0.78, 0.62) };
export function chuKoNuMitts(scene: Scene, body: ArticulatedBody): Mesh[] {
  const M = KONU_MITT, glow = scene.getGlowLayerByName("glow");
  const cream = getMaterialFactory().get("unlit", M.cream, { emissive: M.cream });
  const out: Mesh[] = [];
  for (const hand of [body.leftHand, body.rightHand]) {
    const hm = hand.getChildMeshes(true).find((m) => /_[lr]HandM$/.test(m.name)) as Mesh | undefined;
    if (!hm) continue;
    const hb = hm.getBoundingInfo().boundingBox, e = hb.extendSize.multiply(hm.scaling);
    const at = hm.position.add(hb.center.multiply(hm.scaling));
    const mitt = MeshBuilder.CreateBox("konuMitt", { width: e.x * 2 * M.mitt, height: e.y * 2 * M.mitt, depth: e.z * 2 * M.mitt }, scene);
    mitt.parent = hand; mitt.position.copyFrom(at); mitt.rotation.copyFrom(hm.rotation); mitt.material = cream; out.push(mitt);
    // the wrist band at the hand's top (toward the forearm, +y in the hand frame)
    const band = MeshBuilder.CreateCylinder("konuMittBand", { height: e.y * 2 * M.bandH, diameter: Math.max(e.x, e.z) * 2 * M.band, tessellation: 8 }, scene);
    band.parent = hand; band.position.set(at.x, at.y + e.y * (1 - M.bandH), at.z); band.material = cream; out.push(band);
    hm.material = cream;
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 515 the Chu Ko Nu's wrapped leggings (secret.chu_ko_nu.blue.png: dark team leggings from the knee to the ankle, three orange-red wrap bands
 * stacked down each shin, the lowest just over the shoe; audit a.4 "plain shins"). Per shin mesh (box centre c, half size s; knee at -position.y):
 * an 8-sided shell .shell s.x round from .top m under the knee to the shin box's foot, tapering to .taper of that at the ankle, team x .shade; .bands
 * bands .bandH m tall, .wrap s.x round, from .first of the way down to .last, each tilted a little in turn. Own cloth (LESSONS 449), out of the glow.
 */
const KONU_LEG = { shell: 1.32, taper: 0.86, top: 0.03, shade: 0.3, bands: 3, bandH: 0.04, wrap: 1.5, first: 0.3, last: 0.88, orange: new Color3(0.7, 0.2, 0.05) };
export function chuKoNuLeggings(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const K = KONU_LEG, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const dark = team.scale(K.shade);
  const cloth = mf.get("cloth", dark, { emissive: dark.scale(0.3), roughness: 1 });
  const orange = mf.get("cloth", K.orange, { emissive: K.orange.scale(0.25), roughness: 1 });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const { center: c, extendSize: s } = shin.getBoundingInfo().boundingBox;
    const top = -shin.position.y - K.top, foot = c.y - s.y, long = top - foot;
    const legging = MeshBuilder.CreateCylinder("konuLegging", { height: long, diameterTop: s.x * 2 * K.shell, diameterBottom: s.x * 2 * K.shell * K.taper, tessellation: 8 }, scene);
    legging.parent = shin; legging.position.set(c.x, foot + long / 2, c.z); legging.scaling.z = s.z / s.x; legging.rotation.y = Math.PI / 8;
    legging.material = cloth; out.push(legging);
    for (let k = 0; k < K.bands; k++) {
      const f = K.first + (K.last - K.first) * (k / (K.bands - 1));
      const r = s.x * K.shell * (1 - (1 - K.taper) * f) * K.wrap / K.shell;
      const band = MeshBuilder.CreateCylinder("konuLegBand", { height: K.bandH, diameter: r * 2, tessellation: 8 }, scene);
      band.parent = shin; band.position.set(c.x, top - long * f, c.z); band.scaling.z = s.z / s.x; band.rotation.set(0, Math.PI / 8, k % 2 ? -0.08 : 0.08);
      band.material = orange; out.push(band);
    }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 515 the CLAMS' clam hands (secret.clams.red.png: each hand is a grey clam, two faceted half-shells closed on each other, as long as the
 * forearm is thick x4, pointed off the wrist, two bead eyes on its top shell; card Main/Off Hand Clam; audit b.1 "bare fists"). Per hand mesh
 * (box centre at, half size e, hand frame: +y up the forearm): two flat-shaded ico half-shells .long e.y*2 long, .wide e.x*2 wide, .thick e.z*2 deep,
 * centred .past e.y past the knuckles (-y), upper and lower stood .gap apart, upper grey .grey, lower .dark; two
 * bead eyes (white ball .eye e.x, dark pupil) on the upper shell near its wrist end. The fist hidden. Lit cloth (stone greys), out of the glow.
 */
/*
 * [S] 526 (b.1) the clam hands are head-sized, not hand-sized (secret.clams.red.png: each hand a fat faceted grey clam longer than his head and about
 * as wide, the biggest shapes at the ends of his arms; CONFIRM 525 "small slim pointed shells, shorter than the head"). CLAM_HAND is now read off the
 * head mesh's world box (head height Hh, width Hw), turned into the hand's frame: each half-shell is a faceted ico .long Hh long, .wide Hw wide and
 * .thick Hw deep (half each), its inside face flattened to .flat and its far end drawn to a blunt point (.point of the width left there), set .past
 * of its length beyond the knuckles; the two halves .gap of the thickness apart; a bead eye pair .eye Hw on the upper shell at its tip end.
 */
// 526.6b: the look read the shells as slivers edge-on (each half was a quarter of .thick deep): each half is now half of it, bigger overall
const CLAM_HAND = { long: 1.55, wide: 1.25, thick: 0.85, past: 0.4, gap: 0.06, flat: 0.35, point: 0.45, eye: 0.13, grey: new Color3(0.42, 0.4, 0.4), dark: new Color3(0.22, 0.2, 0.2) };
function clamHalfShell(scene: Scene, side: number, C: typeof CLAM_HAND): Mesh {
  const shell = MeshBuilder.CreateIcoSphere("clamShell", { radius: 1, subdivisions: 1, updatable: true }, scene);
  const p = shell.getVerticesData("position")!;
  for (let i = 0; i < p.length; i += 3) {
    const tip = Math.max(0, -p[i + 1]);
    p[i] *= 1 - (1 - C.point) * tip * tip;
    if (p[i + 2] * side < 0) p[i + 2] *= C.flat;
  }
  shell.updateVerticesData("position", p);
  return shell;
}
export function clamsHands(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CLAM_HAND, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const grey = mf.get("cloth", C.grey, { emissive: C.grey.scale(0.15), roughness: 1 });
  const dark = mf.get("cloth", C.dark, { emissive: C.dark.scale(0.15), roughness: 1 });
  const white = mf.get("unlit", new Color3(0.95, 0.95, 0.92), { emissive: new Color3(0.95, 0.95, 0.92) });
  const pupil = mf.get("unlit", new Color3(0.04, 0.04, 0.05), { emissive: new Color3(0.04, 0.04, 0.05) });
  const out: Mesh[] = [];
  const head = body.headMesh;
  for (let n: TransformNode | null = head; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
  const hw = head.getBoundingInfo().boundingBox.extendSizeWorld;
  const Hh = hw.y * 2, Hw = Math.max(hw.x, hw.z) * 2;
  for (const hand of [body.leftHand, body.rightHand]) {
    const hm = hand.getChildMeshes(true).find((m) => /_[lr]HandM$/.test(m.name)) as Mesh | undefined;
    if (!hm) continue;
    for (let n: TransformNode | null = hand; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
    const hs = hand.absoluteScaling;
    const L = Hh * C.long / hs.y, W = Hw * C.wide / hs.x, T = Hw * C.thick / hs.z;
    const hb = hm.getBoundingInfo().boundingBox, e = hb.extendSize.multiply(hm.scaling);
    const knuckles = hm.position.add(hb.center.multiply(hm.scaling)).add(new Vector3(0, -e.y, 0));
    const at = knuckles.add(new Vector3(0, -L * C.past, 0));
    for (const [side, material] of [[1, grey], [-1, dark]] as const) {
      const shell = clamHalfShell(scene, side, C);
      shell.parent = hand; shell.material = material;
      shell.scaling.set(W / 2, L / 2, T / 2);
      shell.position.set(at.x, at.y, at.z + side * T * (0.5 * C.flat + C.gap / 2));
      out.push(shell);
    }
    for (const sx of [-1, 1]) {
      const r = Hw * C.eye / hs.x;
      const eye = MeshBuilder.CreateSphere("clamEye", { diameter: r * 2, segments: 6 }, scene);
      eye.parent = hand; eye.material = white;
      eye.position.set(at.x + sx * r * 1.15, at.y - L * 0.3, at.z + T * (0.5 * C.flat + C.gap / 2) + T * 0.38 + r * 0.2);
      const dot = MeshBuilder.CreateSphere("clamPupil", { diameter: r, segments: 6 }, scene);
      dot.parent = hand; dot.material = pupil;
      dot.position.copyFrom(eye.position.add(new Vector3(0, -r * 0.25, r * 0.7)));
      out.push(eye, dot);
    }
    hm.isVisible = false;
  }
  for (const m of out) { if (!/clamEye|clamPupil/.test(m.name)) m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/*
 * [S] 520 the CLAMS' summoned clam (secret.clams.png: a clam as wide as a man's shoulders, two grey scalloped half-shells gaping open on a big red
 * mouth with a pale lip round it, two bead eyes on the top shell; card "throw dozens of weak but quick Clams"; audit 515 c.1 "summoned units - TABS:
 * clams with eyes and red mouths; ours summons bomb-on-a-stick men"). Built on a summoned small man's root, his own body and props hidden
 * (simulationSystem _summonUnits): CLAM_CRITTER in metres, +z ahead: a lower shell (a flat half-dome, dome down) .wide x .deep x .low, the upper
 * one .high tall hinged at the back and gaped .gape rad open, both ribbed by .ribs dark grey ridges; between them a red mouth plate and a pale lip
 * ring; two white bead eyes with dark pupils on the top shell's front. Sat .lift m off his root (the ground when he walks, his foe's chest when he
 * clings). Greys and red lit cloth a little self-lit, the eyes and lip unlit, all out of the glow.
 */
const CLAM_CRITTER = { wide: 0.62, deep: 0.5, low: 0.12, high: 0.16, gape: 0.6, ribs: 5, lift: 0.14, eye: 0.075,
  grey: new Color3(0.42, 0.4, 0.4), rib: new Color3(0.22, 0.2, 0.2), red: new Color3(0.62, 0.05, 0.08), lip: new Color3(0.86, 0.84, 0.8) };
export function clamCritter(scene: Scene, root: TransformNode): Mesh[] {
  const C = CLAM_CRITTER, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const grey = mf.get("cloth", C.grey, { emissive: C.grey.scale(0.15), roughness: 1 });
  const rib = mf.get("cloth", C.rib, { emissive: C.rib.scale(0.15), roughness: 1 });
  const red = mf.get("cloth", C.red, { emissive: C.red.scale(0.25), roughness: 1 });
  const lip = mf.get("unlit", C.lip, { emissive: C.lip });
  const white = mf.get("unlit", new Color3(0.95, 0.95, 0.92), { emissive: new Color3(0.95, 0.95, 0.92) });
  const pupil = mf.get("unlit", new Color3(0.04, 0.04, 0.05), { emissive: new Color3(0.04, 0.04, 0.05) });
  const out: Mesh[] = [];
  const base = new TransformNode("clamCritter", scene);
  base.parent = root; base.position.y = C.lift;
  const shell = (name: string, parent: TransformNode, h: number, down: boolean): Mesh => {
    const s = MeshBuilder.CreateSphere(name, { diameter: 1, segments: 5, slice: 0.5 }, scene);
    s.parent = parent; s.material = grey; s.scaling.set(C.wide, h * 2 * (down ? -1 : 1), C.deep);
    s.position.z = C.deep / 2;
    if (down) s.flipFaces(true);
    out.push(s);
    for (let i = 0; i < C.ribs; i++) {
      const a = -0.9 + (1.8 * i) / (C.ribs - 1);
      const r = MeshBuilder.CreateBox(`${name}Rib`, { width: 0.02, height: 0.02, depth: C.deep * 0.95 }, scene);
      r.parent = parent; r.material = rib;
      r.position.set(Math.sin(a) * C.wide * 0.3, (down ? -1 : 1) * h * 0.72, C.deep * 0.5 + Math.cos(a) * 0.02);
      r.rotation.y = a * 0.6; r.rotation.x = (down ? 1 : -1) * 0.25;
      out.push(r);
    }
    return s;
  };
  shell("clamLower", base, C.low, true);
  const hinge = new TransformNode("clamHinge", scene);
  hinge.parent = base; hinge.rotation.x = -C.gape;
  shell("clamUpper", hinge, C.high, false);
  const mouth = MeshBuilder.CreateCylinder("clamMouth", { height: 0.02, diameter: 1, tessellation: 14 }, scene);
  mouth.parent = base; mouth.material = red; mouth.scaling.set(C.wide * 0.88, 1, C.deep * 0.85); mouth.position.set(0, 0.01, C.deep * 0.5);
  mouth.rotation.x = -C.gape * 0.45; out.push(mouth);
  const ring = MeshBuilder.CreateTorus("clamLip", { diameter: 1, thickness: 0.035, tessellation: 16 }, scene);
  ring.parent = base; ring.material = lip; ring.scaling.set(C.wide * 0.9, 1, C.deep * 0.88); ring.position.set(0, 0.015, C.deep * 0.5);
  ring.rotation.x = -C.gape * 0.45; out.push(ring);
  for (const sx of [-1, 1]) {
    const eye = MeshBuilder.CreateSphere("clamCritterEye", { diameter: C.eye * 2, segments: 6 }, hinge.getScene());
    eye.parent = hinge; eye.material = white; eye.position.set(sx * C.eye * 1.15, C.high * 1.6, C.deep * 0.72);
    const dot = MeshBuilder.CreateSphere("clamCritterPupil", { diameter: C.eye, segments: 6 }, scene);
    dot.parent = hinge; dot.material = pupil; dot.position.copyFrom(eye.position.add(new Vector3(0, -C.eye * 0.1, C.eye * 0.75)));
    out.push(eye, dot);
  }
  for (const m of out) { if (!/Eye|Pupil|Lip/.test(m.name)) m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

const KONU_ROBE = { knee: -0.02 };
export function chuKoNuRobe(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const torso = body.torsoMesh;
  const bounds = torso.getBoundingInfo().boundingBox;
  const width = bounds.extendSize.x * 2 * torso.scaling.x;
  const depth = bounds.extendSize.z * 2 * torso.scaling.z;
  // [S] 515 (a.3 "skirt stops at mid-thigh"; secret.chu_ko_nu.red.png: knee-length robe, two orange hem bands): the tiers run from the old top
  // (.12 hip-to-knee lengths over the torso joint) down to KONU_ROBE.knee m over the knee joint read into the torso frame (LESSONS 512: anchor a
  // hem to the knee, not a share of a length), so 1 on the tier scale is the knee, wherever the torso joint sits over the hips
  const hipToKnee = Math.abs(body.leftKnee.position.y);
  const kneeY = (originIn(body.leftKnee, body.torso).y + originIn(body.rightKnee, body.torso).y) / 2;
  const topY = hipToKnee * 0.12, length = topY - (kneeY + KONU_ROBE.knee);
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
    panel.position.y = topY - length * (from + to) / 2;
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
/**
 * [S] 514 the Ballooner's ruff (secret.ballooner.red.png, .blue.png: a wide grey pleated ruff standing round the neck under the chin, about 1.4
 * head widths across, its rim a crown of rounded flutes, dark between them; audit a.4 "collar: none"). Spec in head widths W and heights H (the
 * head box, read into the torso's frame with the neck joint): .flutes short 6-sided upright tubes, each .flute W across, their centres on a ring
 * .ring W across round the neck, from the neck joint .below H under it up to .lap H over the head's foot (lapping the jaw), every other one
 * .stagger H lower; inside them a darker 12-sided core .core of the ring across, as tall. Lit grey cloth, self-lit .15, flat-shaded, out of the glow.
 */
const BALLOONER_RUFF = { flutes: 16, flute: 0.22, ring: 1.34, below: 0.06, lap: 0.18, stagger: 0.05, core: 0.9, grey: new Color3(0.55, 0.55, 0.58), dark: new Color3(0.2, 0.2, 0.22) };
export function balloonerRuff(scene: Scene, body: ArticulatedBody): Mesh[] {
  const R = BALLOONER_RUFF, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const torso = body.torsoMesh, head = body.headMesh;
  const neck = originIn(body.neck, torso);
  head.computeWorldMatrix(true); head.refreshBoundingInfo();
  const inv = Matrix.Invert(torso.getWorldMatrix());
  let lo = Infinity;
  for (const v of head.getBoundingInfo().boundingBox.vectorsWorld) lo = Math.min(lo, Vector3.TransformCoordinates(v, inv).y);
  const hb = head.getBoundingInfo().boundingBox, ts = torso.absoluteScaling, hs = head.absoluteScaling;
  // head sizes in the torso's local units
  const W = (hb.extendSize.x * 2 * hs.x) / ts.x, H = (hb.extendSize.y * 2 * hs.y) / ts.y;
  const bottom = neck.y - H * R.below, topY = lo + H * R.lap, tall = topY - bottom;
  const grey = mf.get("cloth", R.grey, { emissive: R.grey.scale(0.15), roughness: 1 });
  const dark = mf.get("cloth", R.dark, { emissive: R.dark.scale(0.15), roughness: 1 });
  const out: Mesh[] = [];
  const core = MeshBuilder.CreateCylinder("balloonerRuffCore", { height: tall * 0.92, diameter: W * R.ring * R.core, tessellation: 12 }, scene);
  core.parent = torso; core.position.set(neck.x, bottom + tall * 0.46, neck.z); core.material = dark; out.push(core);
  for (let k = 0; k < R.flutes; k++) {
    const a = (k / R.flutes) * Math.PI * 2, drop = (k % 2) * H * R.stagger;
    const tube = MeshBuilder.CreateCylinder("balloonerRuffFlute", { height: tall - drop, diameter: W * R.flute, tessellation: 6 }, scene);
    tube.parent = torso;
    tube.position.set(neck.x + Math.sin(a) * W * R.ring * 0.5, bottom + (tall - drop) / 2, neck.z + Math.cos(a) * W * R.ring * 0.5);
    tube.rotation.y = a;
    tube.scaling.z = 0.7;
    tube.material = grey; out.push(tube);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 514 the Ballooner's hair and goggles (secret.ballooner.red.png, .blue.png: brown hair from a cap over the crown falling straight to the
 * shoulders down both sides and the back, the face open; thick round goggle rims ringing each eye; card Appearance "goggles"; audit a.5 "bare,
 * no hair or goggles"). Spec in head widths W, heights H, depths D (head box, centre c, front +z; e the eyes' top): a cap .capW W across from
 * .capLo H over e up to .capTop H over c, .capD D deep set .capBack D back; per side a fall .sideW W thick at .sideX W out, from .sideHi H over c down
 * to .low H under c, .sideD D deep set .sideBack D back, splayed .splay rad at its foot; a back fall .backW W across, .backD D thick, .rear D behind c,
 * from the crown down to .low. Per eye a goggle rim: a 10-sided torus round the eye's own centre (both read into the head frame, LESSONS 403), .rim
 * of the eye's width across, its tube .tube of that, standing .proud of the eye's width before it. Brown lit hair self-lit .12; the rims dark leather.
 * Flat-shaded, out of the glow.
 */
const BALLOONER_HEAD = {
  brown: new Color3(0.2, 0.11, 0.06), rimC: new Color3(0.16, 0.12, 0.1), capW: 1.14, capLo: 0.05, capTop: 0.62, capD: 1.12, capBack: 0.06,
  sideW: 0.2, sideX: 0.56, sideHi: 0.42, low: 0.78, sideD: 0.86, sideBack: 0.12, splay: 0.12, backW: 1.12, backD: 0.26, rear: 0.5,
  rim: 1.32, tube: 0.24, proud: 0.12,
};
export function balloonerHead(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = BALLOONER_HEAD, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const hair = mf.get("cloth", C.brown, { emissive: C.brown.scale(0.12), roughness: 1 });
  const rimMat = mf.get("cloth", C.rimC, { emissive: C.rimC.scale(0.15), roughness: 1 });
  const out: Mesh[] = [];
  const box = (name: string, w: number, lo: number, hi: number, d: number, x: number, z: number): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: hi - lo, depth: d }, scene);
    m.parent = head; m.position.set(x, (lo + hi) / 2, z); m.material = hair; out.push(m); return m;
  };
  box("balloonerHairCap", W * C.capW, e + H * C.capLo, c.y + H * C.capTop, D * C.capD, c.x, c.z - D * C.capBack);
  for (const side of [-1, 1]) {
    const fall = box("balloonerHairSide", W * C.sideW, c.y - H * C.low, c.y + H * C.sideHi, D * C.sideD, c.x + side * W * C.sideX, c.z - D * C.sideBack);
    fall.rotation.z = side * C.splay;
  }
  box("balloonerHairBack", W * C.backW, c.y - H * C.low, c.y + H * C.capTop * 0.9, D * C.backD, c.x, c.z - D * C.rear);
  // goggle rims round each bead eye, the eye's centre read into the head's frame
  for (let n: TransformNode | null = head; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
  const inv = Matrix.Invert(head.getWorldMatrix());
  for (const eye of [body.leftEye, body.rightEye]) {
    if (!eye) continue;
    for (let n: TransformNode | null = eye; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
    eye.refreshBoundingInfo();
    const eb = eye.getBoundingInfo().boundingBox;
    const at = Vector3.TransformCoordinates(eb.centerWorld, inv);
    const ew = eb.extendSizeWorld.x * 2 / head.absoluteScaling.x;
    const rim = MeshBuilder.CreateTorus("balloonerGoggleRim", { diameter: ew * C.rim, thickness: ew * C.tube, tessellation: 10 }, scene);
    rim.parent = head; rim.position.set(at.x, at.y, at.z + ew * C.proud); rim.rotation.x = Math.PI / 2;
    rim.material = rimMat; out.push(rim);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

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
 * [S] 515 the Ballooner's legs (secret.ballooner.blue.png: loose team knee pantaloons in the doublet's cloth from the belt to just under the knee,
 * a little fuller at the thigh and flared at the hem; tan stockings from the hem to the ankle; low orange shoes with a team tongue; audit a.6
 * "straight team legs in boots"). Spec per thigh (limb box centre c, half size s, in its joint frame): a 7-sided lathe from .top s.y down to .hem m
 * under the knee joint (LESSONS 512: anchored to the knee, not a share of the thigh box), .waist s.x round at the top, .bulge at .4 of the way up,
 * .low at the hem, with a .cuffH m roll .cuff shin widths round at the hem. Shin and pelvis re-clothed (stocking, pantaloon). Per foot box (L, Wf, Hf)
 * an orange shoe .shoeH Hf tall over its whole length (tops the grass, LESSONS 434), a low toe, and a team tongue on the instep; the team foot hidden.
 * Stocking and shoe flat unlit (LESSONS 442: lit cream/tan reads grey in shade), picked off palette.png. No generic tunic skirt (unitFactory).
 */
// [S] 516 (CONFIRM 515 a.1 "pantaloons nearly to the shoes"; DEFECTS "the two legs read as one wide block"): hem .03 m over the knee joint, each
// leg slimmer (bulge 1.5 -> 1.22, low 1.36 -> 1.1) so a gap shows between them; the legs are longer (unitVisuals legLength 1.2)
const BALLOONER_LEG = {
  top: 0.98, hem: 0.03, waist: 1.08, bulge: 1.22, low: 1.1, cuffH: 0.06, cuff: 2.3, shoeW: 1.08, shoeH: 0.82, toeH: 0.5, tongueW: 0.42,
  stocking: new Color3(0.6, 0.44, 0.22), shoe: new Color3(1, 0.2, 0.05), // 515 swatch: (1,.42,.12) displayed tan in the grass
};
export function balloonerBreeches(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const B = BALLOONER_LEG, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const cloth = mf.get("cloth", team, { emissive: team.scale(0.12), roughness: 1 });
  const stocking = mf.get("unlit", B.stocking, { emissive: B.stocking });
  const shoe = mf.get("unlit", B.shoe, { emissive: B.shoe });
  const tongue = mf.get("cloth", team, { emissive: team.scale(0.3), roughness: 1 });
  const out: Mesh[] = [];
  for (const [thigh, knee, shin] of [[body.leftUpperLeg, body.leftKnee, body.leftLowerLeg], [body.rightUpperLeg, body.rightKnee, body.rightLowerLeg]] as const) {
    const { center: c, extendSize: s } = thigh.getBoundingInfo().boundingBox;
    const hem = (knee.position.y - thigh.position.y + B.hem - c.y) / s.y;
    const at = (f: number) => hem + (B.top - hem) * f;
    const shape = [[0, hem], [B.low, hem], [B.bulge * 0.94, at(0.2)], [B.bulge, at(0.45)], [B.bulge * 0.92, at(0.75)], [B.waist, B.top], [0, B.top]]
      .map(([w, h]) => new Vector3(w * s.x, h * s.y, 0));
    const leg = MeshBuilder.CreateLathe("balloonerPantaloon", { shape, tessellation: 7 }, scene);
    leg.parent = thigh; leg.position.copyFrom(c); leg.scaling.z = s.z / s.x; leg.material = cloth;
    out.push(leg);
    thigh.isVisible = false;
    const sc = shin.getBoundingInfo().boundingBox;
    const kneeY = -shin.position.y;
    const roll = MeshBuilder.CreateCylinder("balloonerPantaloonCuff", { height: B.cuffH, diameter: sc.extendSize.x * B.cuff, tessellation: 7 }, scene);
    roll.parent = shin; roll.position.set(sc.center.x, kneeY + B.hem + B.cuffH / 2 - 0.01, sc.center.z); roll.scaling.z = sc.extendSize.z / sc.extendSize.x;
    roll.material = cloth; out.push(roll);
    shin.material = stocking;
    glow?.addExcludedMesh(shin);
  }
  for (const foot of body.allMeshes.filter((m) => /_[lr]FootM$/.test(m.name))) {
    const { minimum: lo, maximum: hi } = foot.getBoundingInfo().boundingBox;
    const L = hi.z - lo.z, Wf = hi.x - lo.x, Hf = hi.y - lo.y, x = (lo.x + hi.x) / 2;
    const part = (name: string, w: number, h: number, d: number, y: number, z: number, material: Material) => {
      const mesh = MeshBuilder.CreateBox(name, { width: Wf * w, height: Hf * h, depth: L * d }, scene);
      mesh.parent = foot; mesh.material = material;
      mesh.position.set(x, lo.y + Hf * y, lo.z + L * z);
      out.push(mesh);
      return mesh;
    };
    part("balloonerShoe", B.shoeW, B.shoeH, 0.62, B.shoeH / 2, 0.31, shoe);
    const toe = part("balloonerShoeToe", B.shoeW * 0.94, B.toeH, 0.44, B.toeH / 2, 0.76, shoe);
    toe.rotation.x = 0.12;
    const tg = part("balloonerShoeTongue", B.tongueW, 0.3, 0.2, B.shoeH * 0.8, 0.66, tongue);
    tg.rotation.x = -0.5;
    foot.isVisible = false;
  }
  const pelvis = body.allMeshes.find((m) => m.name.endsWith("_pelvis"));
  if (pelvis) pelvis.material = cloth;
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

/**
 * [S] 516 the Taekwondo's gi jacket (secret.taekwondo.red.png: a team wrap jacket, a broad cream lapel band from each side of the neck down and in
 * to cross at the belt, the right over the left; wide straight team sleeves to the wrist; a near-black belt knotted at the front with two tails
 * hanging and splayed; audit 515 a.1 "sleeveless team vest block", a.2 "bare team arms", a.3 "no belt"). Spec in torso widths TW, heights TH,
 * depths TD (torso box, torso frame): torso, yoke and pads in team cloth; per side a cream lapel .lapW TW wide from .lapTop TW out at the collar
 * to .cross TW past the middle at .lapDeep TH down, .lapOut TW proud of the chest; a cream collar band round the back of the neck; the belt
 * .beltH TH tall at .beltAt TH over the torso foot, .beltOut round, a knot box and two tails .tail TH long splayed .splay rad. Per upper and lower
 * arm an 8-sided team shell (.upper/.lower of the limb's width round, the forearm's flaring .flare at the wrist). Cream unlit (LESSONS 442),
 * near-black lit cloth self-lit .4 (LESSONS 494), out of the glow.
 */
const TKD_GI = {
  lapW: 0.17, lapTop: 0.24, lapDeep: 0.86, cross: 0.06, lapOut: 0.035, beltH: 0.1, beltAt: 0.08, beltOut: 1.1, tail: 0.42, splay: 0.32,
  upper: 1.7, lower: 1.85, flare: 1.3, over: 0.12,
  cream: new Color3(0.95, 0.86, 0.76), black: new Color3(0.08, 0.06, 0.07),
};
export function taekwondoGi(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = TKD_GI, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  // 516b: the jacket in the body's own team material, the trousers' shade (a team cloth of its own read pale lilac beside them, look 516)
  const cloth = body.bodyMaterial ?? mf.get("cloth", team, { emissive: team.scale(0.12), roughness: 1 });
  const cream = mf.get("unlit", C.cream, { emissive: C.cream });
  const black = mf.get("cloth", C.black, { emissive: C.black.scale(0.4), roughness: 1 });
  for (const m of [body.torsoMesh, ...body.allMeshes.filter((x) => /_yoke$|_[lr]Pad$/.test(x.name))]) m.material = cloth;
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, sc = tm.scaling;
  const TW = tb.extendSize.x * 2 * sc.x, TH = tb.extendSize.y * 2 * sc.y, TD = tb.extendSize.z * 2 * sc.z;
  const top = tm.position.y + (tb.center.y + tb.extendSize.y) * sc.y, cx = tm.position.x + tb.center.x * sc.x, cz = tm.position.z + tb.center.z * sc.z;
  const front = cz + TD / 2;
  const out: Mesh[] = [];
  const slab = (name: string, a: Vector3, e: Vector3, w: number, d: number, material: Material): Mesh => {
    const v = e.subtract(a);
    const m = MeshBuilder.CreateBox(name, { width: w, height: v.length(), depth: d }, scene);
    m.parent = body.torso; m.material = material; m.position.copyFrom(a.add(e).scale(0.5));
    m.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), v.normalize(), new Quaternion());
    out.push(m);
    return m;
  };
  // the lapels: the left one first, the right one laid over it a little prouder, each running past the middle so they cross
  for (const side of [-1, 1]) {
    const z = front + TW * (C.lapOut + (side > 0 ? 0.02 : 0));
    slab("tkdLapel", new Vector3(cx + side * TW * C.lapTop, top + TH * 0.02, z), new Vector3(cx - side * TW * C.cross, top - TH * C.lapDeep, z), TW * C.lapW, TW * 0.04, cream);
  }
  // the collar band round the back of the neck, joining the lapels' tops
  const collar = MeshBuilder.CreateBox("tkdCollar", { width: TW * C.lapTop * 2 + TW * C.lapW, height: TH * 0.08, depth: TW * 0.05 }, scene);
  collar.parent = body.torso; collar.material = cream; collar.position.set(cx, top + TH * 0.01, cz - TD / 2 - TW * 0.02); out.push(collar);
  for (const side of [-1, 1]) {
    const wing = MeshBuilder.CreateBox("tkdCollarSide", { width: TW * 0.05, height: TH * 0.08, depth: TD * 1.02 }, scene);
    wing.parent = body.torso; wing.material = cream; wing.position.set(cx + side * TW * (C.lapTop + C.lapW / 2), top + TH * 0.01, cz); out.push(wing);
  }
  // [S] 517 the belt moved to taekwondoBelt, built over the jacket's skirt (it sat inside the skirt's flare here: only side wedges showed)
  // wide sleeves to the wrist
  for (const [arm, lower] of [[body.leftUpperArm, false], [body.rightUpperArm, false], [body.leftLowerArm, true], [body.rightLowerArm, true]] as const) {
    const { center: c, extendSize: s } = arm.getBoundingInfo().boundingBox;
    const r = s.x * 2 * (lower ? C.lower : C.upper), over = lower ? 0 : s.y * 2 * C.over;
    const shell = MeshBuilder.CreateCylinder(lower ? "tkdSleeveLower" : "tkdSleeveUpper", {
      height: s.y * 2 + over, diameterTop: lower ? r * C.flare : r, diameterBottom: lower ? r * C.flare : r * 1.02, tessellation: 8,
    }, scene);
    shell.parent = arm; shell.position.set(c.x, c.y + over / 2, c.z); shell.scaling.z = s.z / s.x; shell.rotation.y = Math.PI / 8;
    shell.material = cloth; out.push(shell);
    arm.material = cloth;
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 516 Cupid's curly mop (secret.cupid.red.png: a golden curly mop of small lumps over the whole crown, from just over the eyes to a little
 * above the head's top, down the sides to the ear and the back of the head to the nape; audit 515 a.3 "bald team head"). Spec in head widths W,
 * heights H, depths D (head box, head frame): a cap of .rows rings of curls, each ring .perRing ico lumps .curl W across on an ellipse .ringW W wide,
 * from the eye tops + .lo H up to .hi H over the centre, the front arc (within .gap rad of the face) left open under the top ring so the eyes show;
 * a crown lump on top. Unlit gold x.7 off palette.png (LESSONS 442: lit tan reads grey), out of the glow.
 */
const CUPID_HAIR = { rows: 4, perRing: 9, curl: 0.34, ringW: 1.08, lo: 0.04, hi: 0.66, gap: 0.75, back: -0.4, gold: new Color3(0.7, 0.5, 0.15) };
export function cupidHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CUPID_HAIR, glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const gold = getMaterialFactory().get("unlit", C.gold, { emissive: C.gold });
  const out: Mesh[] = [];
  const curl = (x: number, y: number, z: number, r: number, k: number): void => {
    const m = MeshBuilder.CreateIcoSphere("cupidCurl", { radius: r, subdivisions: 1 }, scene);
    m.parent = head; m.material = gold; m.position.set(x, y, z); m.rotation.set(k * 0.9, k * 1.7, k * 0.6);
    out.push(m);
  };
  const top = c.y + H * C.hi;
  let k = 0;
  for (let row = 0; row < C.rows; row++) {
    const t = row / (C.rows - 1);
    // the lowest ring runs from the eye tops at the front to the nape at the back; each ring higher and narrower to the crown
    const y0 = e + H * C.lo, shrink = Math.cos(t * 1.1);
    for (let i = 0; i < C.perRing; i++) {
      const a = (i / C.perRing) * Math.PI * 2 + row * 0.35;
      const facing = Math.cos(a); // +1 at the face (+z)
      if (row < C.rows - 1 && facing > Math.cos(C.gap) && row < 2) continue;
      const y = y0 + (top - y0) * t + (facing < 0 ? H * C.back * (1 - t) * -facing : 0);
      const rx = W * C.ringW * 0.5 * shrink, rz = D * C.ringW * 0.5 * shrink;
      curl(c.x + Math.sin(a) * rx, y, c.z + facing * rz, W * C.curl * 0.5 * (1.05 - 0.25 * t), k++);
    }
  }
  curl(c.x, top + H * 0.04, c.z - D * 0.05, W * C.curl * 0.55, k++);
  // the brow fringe: three curls along the front over the eyes
  for (const s of [-1, 0, 1]) curl(c.x + s * W * 0.26, e + H * (C.lo + 0.14), c.z + D * 0.44, W * C.curl * 0.42, k++);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 516 the Cheerleader's pleated skirt (secret.cheerleader.blue.png: a short purple skirt in knife pleats from the waist to mid-thigh, flared;
 * audit 515 a.2 "team tunic hem"). Spec in torso widths TW, depths TD (torso box, torso frame): .pleats flat panels round an ellipse .waist TW
 * across at the waist (.top TH over the torso's foot), each .wide of its share of the round, hanging to .hem of the way from the torso's foot down
 * to the knees (read into the torso frame, LESSONS 512), tipped out .flare rad; alternate panels set .step proud and a shade darker, so the
 * pleats read. Lit purple cloth off palette.png (purple x .7, x .45), out of the glow. The generic tunic skirt is not hung (unitFactory).
 */
const CHEER_SKIRT = { pleats: 14, waist: 1.12, top: 0.06, hem: 0.55, flare: 0.38, wide: 1.18, step: 0.025, purple: new Color3(0.42, 0.14, 0.63), dark: new Color3(0.27, 0.09, 0.4) };
export function cheerleaderSkirt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CHEER_SKIRT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const light = mf.get("cloth", C.purple, { emissive: C.purple.scale(0.15), roughness: 1 });
  const dark = mf.get("cloth", C.dark, { emissive: C.dark.scale(0.15), roughness: 1 });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, sc = tm.scaling;
  const TW = tb.extendSize.x * 2 * sc.x, TH = tb.extendSize.y * 2 * sc.y, TD = tb.extendSize.z * 2 * sc.z;
  const foot = tm.position.y + (tb.center.y - tb.extendSize.y) * sc.y, cx = tm.position.x + tb.center.x * sc.x, cz = tm.position.z + tb.center.z * sc.z;
  const kneeY = (originIn(body.leftKnee, body.torso).y + originIn(body.rightKnee, body.torso).y) / 2;
  const top = foot + TH * C.top, hem = foot - (foot - kneeY) * C.hem, long = (top - hem) / Math.cos(C.flare);
  const rx = (TW * C.waist) / 2, rz = Math.max(TD * C.waist, TW * 0.7) / 2;
  const out: Mesh[] = [];
  for (let i = 0; i < C.pleats; i++) {
    const a = (i / C.pleats) * Math.PI * 2;
    const nx = Math.sin(a), nz = Math.cos(a);
    const proud = i % 2 ? C.step * TW : 0;
    const share = (2 * Math.PI * Math.sqrt((rx * rx + rz * rz) / 2)) / C.pleats;
    const panel = MeshBuilder.CreateBox("cheerSkirtPleat", { width: share * C.wide, height: long, depth: TW * 0.035 }, scene);
    panel.parent = body.torso; panel.material = i % 2 ? dark : light;
    // hung from the waist ellipse, its middle half way down the flare
    const r = (x: number, z: number, out_: number) => new Vector3(cx + x * (1 + out_), 0, cz + z * (1 + out_));
    const at = r(nx * rx, nz * rz, 0).add(new Vector3(nx, 0, nz).scale(Math.sin(C.flare) * long * 0.5 + proud));
    panel.position.set(at.x, top - (top - hem) / 2, at.z);
    // yaw onto the outward normal, then the hem tipped out (Rx(+) would tip the top out)
    panel.rotation.set(-C.flare, a, 0);
    out.push(panel);
  }
  // a waistband over the panels' tops
  const band = MeshBuilder.CreateCylinder("cheerSkirtBand", { height: TH * 0.07, diameter: rx * 2 * 1.06, tessellation: 14 }, scene);
  band.parent = body.torso; band.material = dark; band.position.set(cx, top, cz); band.scaling.z = rz / rx; out.push(band);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 516 the CLAMS' clam-shell hat (secret.clams.blue.png: a big grey scalloped half-shell fanned up behind the head, its hinge behind the nape,
 * its rim standing a head's height over the crown and twice the head wide, cupped toward the front, radial ridges in two greys; audit 515 a.2
 * "bare head"). Spec in head widths W, heights H, depths D (head box, head frame): from a hinge .hingeY H under the centre and .hingeZ D behind
 * it, .ribs tapered ribs fanned over .span rad either side of straight up, each .long H long, .rim W wide at the rim and .root W at the hinge, .thick
 * W deep, leaned back .lean rad and cupped forward .cup rad at the sides; lighter and darker grey in turn; a scalloped rim lump on each rib's end.
 * Lit stone-grey cloth (CLAM_HAND's greys), out of the glow.
 */
// 516b: rim .5 -> .8, root .08 -> .16 (look 516: the ribs stood apart as fingers, not one shell): neighbours now overlap at the rim
const CLAM_HAT = { ribs: 9, span: 1.3, long: 1.5, rim: 0.8, root: 0.16, thick: 0.1, hingeY: 0.42, hingeZ: 0.62, lean: 0.32, cup: 0.35, light: new Color3(0.5, 0.48, 0.47), dark: new Color3(0.3, 0.29, 0.29) };
export function clamsHat(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CLAM_HAT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const light = mf.get("cloth", C.light, { emissive: C.light.scale(0.15), roughness: 1 });
  const dark = mf.get("cloth", C.dark, { emissive: C.dark.scale(0.15), roughness: 1 });
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const hinge = new TransformNode("clamHatHinge", scene);
  hinge.parent = head; hinge.position.set(c.x, c.y - H * C.hingeY, c.z - D * C.hingeZ); hinge.rotation.x = -C.lean;
  const out: Mesh[] = [];
  for (let i = 0; i < C.ribs; i++) {
    const f = (i / (C.ribs - 1)) * 2 - 1; // -1 .. 1 across the fan
    const ang = f * C.span;
    const arm = new TransformNode("clamHatArm", scene);
    // fanned in the head's x-y plane, the sides cupped forward (+z)
    arm.parent = hinge; arm.rotation.z = -ang;
    // the cup in the rib's own frame (a child turn), so a side rib tips forward too
    const cup = new TransformNode("clamHatCup", scene);
    cup.parent = arm; cup.rotation.x = C.cup * Math.abs(f);
    const rib = MeshBuilder.CreateCylinder("clamHatRib", { height: H * C.long, diameterTop: W * C.rim, diameterBottom: W * C.root, tessellation: 4 }, scene);
    rib.parent = cup; rib.position.y = (H * C.long) / 2; rib.rotation.y = Math.PI / 4; rib.scaling.z = C.thick / C.rim;
    rib.material = i % 2 ? dark : light;
    out.push(rib);
    const lump = MeshBuilder.CreateIcoSphere("clamHatScallop", { radius: W * C.rim * 0.42, subdivisions: 1 }, scene);
    lump.parent = cup; lump.position.y = H * C.long; lump.scaling.set(1, 0.55, 0.45); lump.material = i % 2 ? light : dark;
    out.push(lump);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 517 the Present Elf's elf cap (secret.present_elf.png: a deep green floppy cap over the crown, a thick cream fur band round the brow just
 * over the eyes, an orange-brown pompom on the cap's front above the band, the cap's tip flopping over to one side; the face bare under it;
 * audit 515 a.1 "a green ball covering the whole head over a brim"). Spec in head widths W, heights H, depths D (head box, centre c, front +z;
 * e the eyes' top): a 10-sided fur band .bandH H tall from .over H above e, .bandW W across (x D/W deep); the cap a 10-sided cone from the
 * band's top, .capW W at its foot to .capTop W, .capH H tall; its tip a tapered chain over ELF_TIP [x W, y H over the cap top, z D] from
 * .tipRoot W to .tipEnd W; a pompom ico .pom W across on the cap front .pomY H over the band top. Green and pompom lit cloth self-lit .12,
 * the fur unlit cream (LESSONS 442); all out of the glow. The generic hood off (unitVisuals hat none).
 */
const ELF_CAP = {
  over: 0.02, bandH: 0.2, bandW: 1.2, capW: 1.08, capTop: 0.52, capH: 0.42, tipRoot: 0.5, tipEnd: 0.14, pom: 0.22, pomY: 0.12,
  // [S] 517b the green brighter (.02,.2,.08 read near-black in the look), the pompom a brighter orange-brown
  green: new Color3(0.04, 0.42, 0.17), fur: new Color3(0.82, 0.76, 0.6), pomC: new Color3(0.85, 0.28, 0.06),
};
/*
 * [S] 519 the Present Elf's present (secret.present_elf.red.png, .blue.png: a team-coloured gift box as wide as one and a half trunks and as tall as the
 * trunk and hips, held up before the chest so its lid sits under the chin; a deeper team ribbon band with a gold stripe down each edge runs over the
 * front and across the lid both ways; on the lid a big ribbon bow, two loops flaring up and out, a knot, two long tails, and two gold bells at the knot).
 * PRESENT, in torso-box units (W wide, H tall, D deep, read off the torso mesh): box .w x .h x .d, its top .top of the trunk's half above the trunk's
 * middle, its back .gap in front of the chest; lid .lid proud, .lidH tall; band .band of W, stripes .stripe of W; loops .loop W long, raised .loopUp;
 * tails .tail W; bells .bell W. Box team (saturated, self-lit .12, FAN_DRESS rule), band team x .band2, gold unlit, all out of the glow. Torso-rooted
 * so it is held before the chest in every pose; the hand prop is off (unitVisuals weapon none).
 */
/*
 * [S] 526 (b.1, b.2) the present is a near-cube, not a trunk-sized slab (secret.present_elf.blue.png: the box about twice his shoulder span wide,
 * its lid under the chin and its floor at the knees, only shins and boots below it; it hides his whole front). Sized off the joints, not the torso
 * mesh (limbBox reads about half the shown width on these slim rigs): W = .span x the shoulder joints' spread, its floor .knee of the way from the
 * knee joint up to the hip joint (0: at the knee), its top as before; D = .deepW x W. His fists hold its side walls (RuntimeUnit._tendPresentHold).
 */
const PRESENT = { span: 2.0, knee: 0, deepW: 0.82, w: 1.55, h: 1.25, d: 1.5, top: 0.95, gap: 0.15, lid: 1.07, lidH: 0.14, band: 0.2, stripe: 0.04, band2: 0.55, loop: 0.38, loopUp: 0.6, tail: 0.55, bell: 0.21, gold: new Color3(0.62, 0.26, 0.03) };
export function presentElfPresent(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const P = PRESENT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const T = limbBox(body.torsoMesh);
  const rs = originIn(body.rightShoulder, body.torso), ls = originIn(body.leftShoulder, body.torso);
  const kneeY = (originIn(body.leftKnee, body.torso).y + originIn(body.rightKnee, body.torso).y) / 2;
  const hipY = (originIn(body.leftHip, body.torso).y + originIn(body.rightHip, body.torso).y) / 2;
  const floorY = kneeY + (hipY - kneeY) * P.knee;
  const W = Math.max(T.wide * 2 * P.w, Math.abs(rs.x - ls.x) * P.span);
  const H = Math.max(T.half * 2 * P.h, T.mid + T.half * P.top - floorY), D = Math.max(T.deep * 2 * P.d, W * P.deepW);
  const peak = Math.max(team.r, team.g, team.b), sat = new Color3(team.r ** 2, team.g ** 2, team.b ** 2);
  const deep = sat.scale(peak / Math.max(sat.r, sat.g, sat.b, 1e-3));
  const boxCol = deep.scale(0.85), bandCol = deep.scale(P.band2);
  const boxMat = mf.get("cloth", boxCol, { emissive: boxCol.scale(0.12), roughness: 1 });
  const bandMat = mf.get("cloth", bandCol, { emissive: bandCol.scale(0.12), roughness: 1 });
  const gold = mf.get("unlit", P.gold, { emissive: P.gold });
  const out: Mesh[] = [];
  const root = new TransformNode("presentRoot", scene);
  root.parent = body.torso;
  const top = T.mid + T.half * P.top, cy = top - H / 2, cz = T.deep + P.gap * T.deep + D / 2;
  root.position.set(0, cy, cz);
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, m: Material, parent: TransformNode = root): Mesh => {
    const b = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    b.parent = parent; b.position.set(x, y, z); b.material = m; out.push(b); glow?.addExcludedMesh(b);
    return b;
  };
  const wall = Math.min(W, D) * 0.075;
  box("presentBox", W, wall, D, 0, (wall - H) / 2, 0, boxMat);
  for (const side of [-1, 1]) {
    box("presentWall", W, H, wall, 0, 0, side * (D - wall) / 2, boxMat);
    box("presentWall", wall, H, D - wall * 2, side * (W - wall) / 2, 0, 0, boxMat);
  }
  const lidY = H / 2 - H * P.lidH / 2;
  const lid = box("presentLid", W * P.lid, H * P.lidH, D * P.lid, 0, lidY, 0, boxMat);
  const bw = W * P.band, sw = W * P.stripe, eps = 0.006;
  // the band down the front and over the lid both ways, gold stripes at its edges
  box("presentBandX", W * P.lid + eps * 2, H * P.lidH + eps, bw, 0, 0, 0, bandMat, lid);
  box("presentBandZ", bw, H * P.lidH + eps, D * P.lid + eps * 2, 0, 0, 0, bandMat, lid);
  for (const side of [-1, 1]) {
    box("presentBand", bw, H, eps, 0, 0, side * (D + eps) / 2, bandMat);
    for (const edge of [-1, 1]) {
      box("presentStripe", sw, H, eps, edge * (bw - sw) / 2, 0, side * (D + eps * 2) / 2, gold);
    }
    box("presentStripeX", W * P.lid + eps * 4, H * P.lidH + eps * 2, sw, 0, 0, side * (bw / 2 - sw / 2), gold, lid);
    box("presentStripeZ", sw, H * P.lidH + eps * 2, D * P.lid + eps * 4, side * (bw / 2 - sw / 2), 0, 0, gold, lid);
  }
  // the bow on the lid: a knot, two loops flaring up and out, two long tails fanned back, two gold bells at the knot's front
  const bow = new TransformNode("presentBow", scene);
  bow.parent = lid; bow.position.set(0, H / 2 + W * 0.06 - lidY, 0);
  box("presentKnot", W * 0.16, W * 0.13, W * 0.16, 0, 0, 0, bandMat, bow);
  for (const side of [-1, 1]) {
    const loop = box("presentLoop", W * P.loop, W * 0.16, W * 0.12, side * W * P.loop * 0.45, W * 0.06, 0, bandMat, bow);
    loop.rotation.z = side * P.loopUp;
    box("presentLoopStripe", W * P.loop * 0.98, W * 0.03, W * 0.125, 0, 0, 0, gold, loop);
    const tail = box("presentTail", W * 0.08, W * 0.012, W * P.tail, side * W * 0.12, -W * 0.03, -W * P.tail * 0.45, bandMat, bow);
    tail.rotation.y = side * 0.35; tail.rotation.x = -0.25;
    // Flared open mouths face outward from the bow so the rims and clappers read against the lid.
    const size = W * P.bell;
    const profile = [[0, 0.46], [0.23, 0.46], [0.34, 0.31], [0.39, -0.08], [0.53, -0.31], [0.53, -0.42], [0.4, -0.42], [0.29, -0.21], [0.18, 0.27], [0, 0.27]];
    const bell = MeshBuilder.CreateLathe("presentBell", {
      shape: profile.map(([radius, y]) => new Vector3(radius * size, y * size, 0)), tessellation: 9,
    }, scene);
    bell.parent = bow;
    bell.material = mf.get("cloth", new Color3(1, 0.7, 0.18), { emissive: P.gold.scale(0.24), roughness: 0.75 });
    bell.position.set(side * W * 0.17, W * 0.06, W * 0.21);
    bell.rotation.set(-1.15, 0, side * 0.34);
    bell.convertToFlatShadedMesh();
    const clapper = MeshBuilder.CreateIcoSphere("presentBellClapper", { radius: size * 0.13, subdivisions: 1, flat: true }, scene);
    clapper.parent = bell;
    clapper.position.y = -size * 0.39;
    clapper.material = gold;
    out.push(bell, clapper);
    glow?.addExcludedMesh(bell);
    glow?.addExcludedMesh(clapper);
  }
  out.push(...presentCandyCane(scene, lid, W, H * P.lidH / 2, deep));
  return out;
}
/*
 * [S] 524 (b.3) the candy cane laid across the present's lid (secret.present_elf.red.png: a cream-and-team striped cane lying on the lid behind the bow,
 * its straight end run out past the box's side, its hook curled up at the other end). PRESENT_CANE in present widths W: a straight shaft .long long
 * of .stripes short cylinders .r thick, alternating unlit cream and the box's deep team shade, lying on the lid's top turned .yaw rad, set .back
 * behind the bow and shifted .out toward the straight end; at its end a hook of .hookSegs pieces round a half circle .hook in radius, rising up
 * off the lid. All out of the glow.
 */
const PRESENT_CANE = { long: 1.05, r: 0.035, stripes: 14, yaw: 0.28, back: 0.22, out: -0.2, hook: 0.1, hookSegs: 7, cream: new Color3(0.9, 0.86, 0.76) };
function presentCandyCane(scene: Scene, lid: TransformNode, W: number, lidTop: number, team: Color3): Mesh[] {
  const C = PRESENT_CANE, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const cream = mf.get("unlit", C.cream, { emissive: C.cream });
  const red = mf.get("cloth", team, { emissive: team.scale(0.12), roughness: 1 });
  const r = C.r * W, len = C.long * W, seg = len / C.stripes;
  const cane = new TransformNode("presentCane", scene);
  cane.parent = lid;
  cane.position.set(C.out * W, lidTop + r, -C.back * W);
  cane.rotation.y = C.yaw;
  const out: Mesh[] = [];
  const piece = (a: Vector3, b: Vector3, i: number): void => {
    const d = b.subtract(a), l = d.length();
    const m = MeshBuilder.CreateCylinder("presentCaneStripe", { height: l * 1.04, diameter: r * 2, tessellation: 8 }, scene);
    m.parent = cane; m.material = i % 2 ? red : cream;
    m.position.copyFrom(Vector3.Center(a, b));
    // the cylinder's axis (+y) turned onto a->b
    const axis = Vector3.Cross(Vector3.Up(), d.normalize());
    const ang = Math.acos(Math.max(-1, Math.min(1, Vector3.Dot(Vector3.Up(), d))));
    m.rotationQuaternion = axis.lengthSquared() > 1e-8 ? Quaternion.RotationAxis(axis.normalize(), ang) : Quaternion.Identity();
    glow?.addExcludedMesh(m); out.push(m);
  };
  for (let i = 0; i < C.stripes; i++) piece(new Vector3(-len / 2 + i * seg, 0, 0), new Vector3(-len / 2 + (i + 1) * seg, 0, 0), i);
  // the hook: up and over from the shaft's +x end, a half circle in the x-y plane
  const hx = len / 2, hr = C.hook * W;
  for (let k = 0; k < C.hookSegs; k++) {
    const a0 = -Math.PI / 2 + (Math.PI * k) / C.hookSegs, a1 = -Math.PI / 2 + (Math.PI * (k + 1)) / C.hookSegs;
    piece(new Vector3(hx + Math.cos(a0) * hr, hr + Math.sin(a0) * hr, 0), new Vector3(hx + Math.cos(a1) * hr, hr + Math.sin(a1) * hr, 0), C.stripes + k);
  }
  return out;
}
const ELF_TIP: [number, number, number][] = [[0, 0, 0], [0.06, 0.2, -0.05], [0.24, 0.3, 0.05], [0.42, 0.22, 0.2], [0.52, 0.04, 0.32]];
export function elfCap(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = ELF_CAP, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const green = mf.get("cloth", C.green, { emissive: C.green.scale(0.12), roughness: 1 });
  const fur = mf.get("unlit", C.fur, { emissive: C.fur });
  const pomM = mf.get("cloth", C.pomC, { emissive: C.pomC.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const bandLo = e + H * C.over, bandHi = bandLo + H * C.bandH;
  const band = MeshBuilder.CreateCylinder("elfCapFur", { height: bandHi - bandLo, diameterTop: W * C.bandW * 0.97, diameterBottom: W * C.bandW, tessellation: 10 }, scene);
  band.parent = head; band.position.set(c.x, (bandLo + bandHi) / 2, c.z); band.scaling.z = D / W; band.material = fur; out.push(band);
  const capTop = bandHi + H * C.capH;
  const cap = MeshBuilder.CreateCylinder("elfCap", { height: capTop - bandHi, diameterTop: W * C.capTop, diameterBottom: W * C.capW, tessellation: 10 }, scene);
  cap.parent = head; cap.position.set(c.x, (bandHi + capTop) / 2, c.z - D * 0.04); cap.scaling.z = D / W; cap.material = green; out.push(cap);
  const pts = ELF_TIP.map(([x, y, z]) => new Vector3(c.x + x * W, capTop + y * H - H * 0.04, c.z - D * 0.04 + z * D));
  taper(scene, "elfCapTip", pts, W * C.tipRoot, W * C.tipEnd, head, green, out);
  const pom = MeshBuilder.CreateIcoSphere("elfCapPompom", { radius: (W * C.pom) / 2, subdivisions: 1, flat: true }, scene);
  pom.parent = head; pom.position.set(c.x, bandHi + H * C.pomY, c.z + D * 0.5 + W * C.pom * 0.2); pom.material = pomM; out.push(pom);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 517 the Ice Mage's long white hair (secret.ice_mage.red.png: cream-white hair, a cap over the crown, parted at the middle and swept to one
 * side over the brow above the eyes, long locks falling either side of the face to the jaw, a back mass to the nape; card Appearance "long, white
 * hair"; audit 515 a.1 "a blue ball hood with a brim"). Spec in head widths W, heights H, depths D (head box, centre c, front +z; e the eyes'
 * top): cap box .capW W x .capD D from .capLo H over e to .capTop H over c, set .capBack D back; a swept fringe slab .fringeW W wide over the
 * brow, .fringeH H tall, tilted .fringeTilt; per side a front lock tapering from .lockRoot W at the cap's side to .lockTip W at .lockLo H under
 * c, .lockX W out, .lockZ D forward (beside the face, outside the eyes); a back mass .backW W wide down to .backLo H under c. Unlit cream (fur
 * cut, LESSONS 442), out of the glow. The generic hood off (unitVisuals hat none).
 */
const ICE_HAIR = {
  capW: 1.16, capD: 1.12, capLo: 0.03, capTop: 0.6, capBack: 0.06, fringeW: 0.62, fringeH: 0.2, fringeTilt: 0.32,
  lockRoot: 0.34, lockTip: 0.2, lockLo: -0.42, lockX: 0.64, lockZ: 0.3, backW: 1.0, backLo: -0.44, cream: new Color3(0.74, 0.68, 0.52),
};
// [S] 517b the cap a faceted half dome (the box read as a flat-topped hat), the side locks further out and thicker (they sat inside the head)
export function iceMageHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = ICE_HAIR, glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const hair = getMaterialFactory().get("unlit", C.cream, { emissive: C.cream });
  const out: Mesh[] = [];
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.parent = head; m.position.set(x, y, z); m.material = hair; out.push(m); return m;
  };
  const lo = e + H * C.capLo, hi = c.y + H * C.capTop;
  const cap = MeshBuilder.CreateSphere("iceMageHairCap", { diameter: 1, segments: 4, slice: 0.5 }, scene);
  cap.parent = head; cap.scaling.set(W * C.capW, (hi - lo) * 2, D * C.capD); cap.position.set(c.x, lo, c.z - D * C.capBack); cap.material = hair; out.push(cap);
  const fringe = box("iceMageHairFringe", W * C.fringeW, H * C.fringeH, D * 0.18, c.x + W * 0.14, lo + H * C.fringeH * 0.45, c.z + D * 0.52);
  fringe.rotation.z = C.fringeTilt;
  for (const side of [-1, 1]) {
    const pts = [new Vector3(c.x + side * W * 0.56, lo + H * 0.06, c.z + D * C.lockZ), new Vector3(c.x + side * W * C.lockX * 1.04, c.y, c.z + D * C.lockZ * 1.1),
      new Vector3(c.x + side * W * C.lockX * 0.94, c.y + H * C.lockLo, c.z + D * C.lockZ * 0.9)];
    taper(scene, "iceMageHairLock", pts, W * C.lockRoot, W * C.lockTip, head, hair, out);
  }
  box("iceMageHairBack", W * C.backW, hi - (c.y + H * C.backLo), D * 0.3, c.x, (hi + c.y + H * C.backLo) / 2, c.z - D * 0.5);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 517 the Infernal Whip's igneous-rock hair (secret.infernal_whip.red.png: near-black rock over the crown breaking up into tall jagged
 * spikes, the face and its angry eyes bare under it; card Appearance "solid igneous rock on its head"; audit 515 a.1 "a brown ball covering the
 * head over a tan brim"). Spec in head widths W, heights H, depths D (head box, centre c, front +z; e the eyes' top): a flat-faceted rock cap
 * (ico) .capW W x .capH H x .capD D, its foot .capLo H over e, set .capBack D back; ROCK_SPIKES [x W, z D, height H, lean x, lean z] 5-sided
 * cones .spike W across at the root from the cap's top. Near-black lit rock self-lit .4 (LESSONS 494), a few thin glowing magma cracks
 * (unlit orange) on the cap front. Out of the glow. The generic hood off (unitVisuals hat none).
 */
const ROCK_HAIR = { capW: 1.18, capH: 0.5, capD: 1.16, capLo: 0.03, capBack: 0.05, spike: 0.3, rock: new Color3(0.07, 0.045, 0.04), magma: new Color3(1.4, 0.35, 0.02) };
const ROCK_SPIKES: [number, number, number, number, number][] = [
  [0, 0.05, 0.62, 0, -0.15], [-0.26, 0.12, 0.5, -0.35, 0.1], [0.26, 0.1, 0.52, 0.38, 0.05], [-0.14, -0.26, 0.48, -0.2, -0.45], [0.16, -0.24, 0.46, 0.25, -0.4],
  [-0.42, -0.06, 0.34, -0.7, -0.1], [0.42, -0.08, 0.34, 0.7, -0.1],
];
export function infernalRockHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = ROCK_HAIR, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const rock = mf.get("cloth", C.rock, { emissive: C.rock.scale(0.4), roughness: 1 });
  const magma = mf.get("unlit", C.magma, { emissive: C.magma });
  const out: Mesh[] = [];
  const lo = e + H * C.capLo, z0 = c.z - D * C.capBack;
  const cap = MeshBuilder.CreateIcoSphere("infernalRockCap", { radius: 0.5, subdivisions: 1, flat: true }, scene);
  cap.parent = head; cap.scaling.set(W * C.capW, H * C.capH * 2, D * C.capD); cap.position.set(c.x, lo, z0); cap.material = rock; out.push(cap);
  const top = lo + H * C.capH * 0.7;
  for (const [x, z, h, lx, lz] of ROCK_SPIKES) {
    const s = MeshBuilder.CreateCylinder("infernalRockSpike", { height: H * h, diameterTop: 0, diameterBottom: W * C.spike, tessellation: 5 }, scene);
    const dir = new Vector3(Math.sin(lx), Math.cos(lx) * Math.cos(lz), Math.sin(lz)).normalize();
    s.parent = head; s.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, new Quaternion()); s.material = rock;
    const root = new Vector3(c.x + x * W, top - H * 0.08 - Math.abs(x) * H * 0.3, z0 + z * D);
    s.position.copyFrom(root.add(dir.scale((H * h) / 2)));
    out.push(s);
  }
  for (const [x, y, t] of [[-0.22, 0.16, 0.5], [0.18, 0.22, -0.6], [0.02, 0.32, 0.2]]) {
    const crack = MeshBuilder.CreateBox("infernalRockCrack", { width: W * 0.2, height: H * 0.025, depth: D * 0.04 }, scene);
    crack.parent = head; crack.position.set(c.x + x * W, lo + y * H, z0 + D * C.capD * 0.47); crack.rotation.z = t; crack.material = magma; out.push(crack);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 517 the Taekwondo's black belt, proud of the jacket (secret.taekwondo.red.png: a near-black belt round the waist where the jacket's skirt
 * flares out below it, a square knot at the front and two tails hanging from it down over the skirt, splayed apart; audit 515 a.3 "none"; 516
 * DEFECTS "the belt band sits inside the jacket, only side wedges show"). Built after the jacket's skirt (unitFactory tunicSkirt, hip frame) and
 * sized off its top ring (radius rx/rz at its top, flaring to its hem over its height h): an 8-sided band .band h tall centred .sink h under the
 * skirt top, .out of the skirt's radius there (top and foot each, so it stands over the flare); a knot box .knotW rx wide, .knotH band tall on
 * its front, .stand rz proud; two tails .tail h long from under the knot, splayed .splay rad apart, leaning out with the skirt's flare plus
 * .stand. Near-black lit cloth self-lit .4 (LESSONS 494), out of the glow.
 */
const TKD_BELT = { band: 0.17, sink: 0.04, out: 1.1, knotW: 0.42, knotH: 1.5, stand: 0.12, tail: 0.62, splay: 0.3, black: new Color3(0.08, 0.06, 0.07) };
export function taekwondoBelt(scene: Scene, body: ArticulatedBody, skirt: Mesh): Mesh[] {
  const B = TKD_BELT, glow = scene.getGlowLayerByName("glow");
  const black = getMaterialFactory().get("cloth", B.black, { emissive: B.black.scale(0.4), roughness: 1 });
  const pos = skirt.getVerticesData("position");
  if (!pos) return [];
  let yHi = -Infinity, yLo = Infinity;
  for (let i = 1; i < pos.length; i += 3) { yHi = Math.max(yHi, pos[i]); yLo = Math.min(yLo, pos[i]); }
  let rTop = 0, rBot = 0;
  for (let i = 0; i < pos.length; i += 3) {
    const r = Math.hypot(pos[i], pos[i + 2]);
    if (pos[i + 1] > yHi - 1e-4) rTop = Math.max(rTop, r); else if (pos[i + 1] < yLo + 1e-4) rBot = Math.max(rBot, r);
  }
  const sz = skirt.scaling.z, h = yHi - yLo, top = skirt.position.y + yHi, x0 = skirt.position.x, z0 = skirt.position.z;
  const rAt = (drop: number) => rTop + (rBot - rTop) * (drop / h);
  const out: Mesh[] = [];
  const bandH = h * B.band, mid = top - h * B.sink;
  const band = MeshBuilder.CreateCylinder("tkdBelt", {
    height: bandH, diameterTop: rAt(Math.max(0, h * B.sink - bandH / 2)) * 2 * B.out, diameterBottom: rAt(h * B.sink + bandH / 2) * 2 * B.out, tessellation: 8,
  }, scene);
  band.parent = body.hip; band.position.set(x0, mid, z0); band.scaling.z = sz; band.rotation.y = Math.PI / 8; band.material = black; out.push(band);
  const front = (drop: number) => z0 + rAt(drop) * B.out * sz + rTop * sz * B.stand;
  const knot = MeshBuilder.CreateBox("tkdBeltKnot", { width: rTop * B.knotW, height: bandH * B.knotH, depth: rTop * 0.2 }, scene);
  knot.parent = body.hip; knot.position.set(x0, mid, front(h * B.sink)); knot.rotation.z = 0.25; knot.material = black; out.push(knot);
  for (const side of [-1, 1]) {
    const d0 = h * B.sink + bandH * 0.3, d1 = d0 + h * B.tail * Math.cos(B.splay);
    const a = new Vector3(x0 + side * rTop * 0.08, top - d0, front(d0));
    const e = new Vector3(x0 + side * (rTop * 0.08 + h * B.tail * Math.sin(B.splay)), top - d1, front(d1));
    const v = e.subtract(a);
    const tail = MeshBuilder.CreateBox("tkdBeltTail", { width: rTop * 0.24, height: v.length(), depth: rTop * 0.07 }, scene);
    tail.parent = body.hip; tail.position.copyFrom(a.add(e).scale(0.5));
    tail.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), v.normalize(), new Quaternion());
    tail.material = black; out.push(tail);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 517 Cupid's diaper on a bare body (secret.cupid.blue.png, .red.png: a bare team-skin body from neck to feet, only a cream cloth diaper
 * at the hips, bunched round the waist, full over the seat and crotch, the thighs coming out of its leg holes, a small gold pin at the front;
 * audit 515 a.4 "ours wears a team vest and tunic"). Spec in the pelvis frame (box centre c, half size h; front +z): a 9-sided lathe shell from
 * .top h.y over the pelvis top through a waist roll .waist h.x round, the seat bulge .bulge h.x at .bulgeAt of the way down, to the crotch
 * .low h.x round at .drop h.y under the pelvis foot, .deep h.z/h.x deep; a waist roll ring .roll h.x round .rollH h.y tall at its top; a gold
 * pin ico .pin h.x across on the front of the roll. Torso, yoke, pads, belt, pelvis and every leg limb in the skin material; no tunic skirt
 * (unitFactory). Cream unlit (LESSONS 442), the pin lit gold self-lit .12; out of the glow.
 */
const CUPID_DIAPER = { top: 0.35, waist: 1.18, bulge: 1.34, bulgeAt: 0.45, low: 0.62, drop: 0.9, deep: 1.2, roll: 1.26, rollH: 0.3, pin: 0.3,
  cream: new Color3(0.74, 0.64, 0.46), gold: new Color3(0.8, 0.52, 0.1) };
export function cupidDiaper(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CUPID_DIAPER, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const pelvis = body.allMeshes.find((m) => m.name.endsWith("_pelvis"));
  if (!pelvis) return [];
  const { center: c, extendSize: h } = pelvis.getBoundingInfo().boundingBox;
  const cream = mf.get("unlit", C.cream, { emissive: C.cream });
  const gold = mf.get("cloth", C.gold, { emissive: C.gold.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const yTop = c.y + h.y * (1 + C.top), yLow = c.y - h.y * (1 + C.drop), span = yTop - yLow;
  const shape = [[0, yLow], [C.low, yLow], [C.bulge * 0.92, yLow + span * (1 - C.bulgeAt) * 0.55], [C.bulge, yTop - span * C.bulgeAt], [C.waist, yTop], [0, yTop]]
    .map(([w, y]) => new Vector3(w * h.x, y - c.y, 0));
  const shell = MeshBuilder.CreateLathe("cupidDiaper", { shape, tessellation: 9 }, scene);
  shell.parent = pelvis; shell.position.set(c.x, c.y, c.z); shell.scaling.z = (h.z * C.deep) / h.x; shell.material = cream; out.push(shell);
  const roll = MeshBuilder.CreateCylinder("cupidDiaperRoll", { height: h.y * C.rollH, diameter: h.x * 2 * C.roll, tessellation: 9 }, scene);
  roll.parent = pelvis; roll.position.set(c.x, yTop - h.y * C.rollH * 0.5, c.z); roll.scaling.z = (h.z * C.deep) / h.x; roll.material = cream; out.push(roll);
  const pin = MeshBuilder.CreateIcoSphere("cupidDiaperPin", { radius: (h.x * C.pin) / 2, subdivisions: 1, flat: true }, scene);
  pin.parent = pelvis; pin.position.set(c.x + h.x * 0.25, yTop - h.y * C.rollH * 0.5, c.z + h.z * C.deep * C.roll * 1.02); pin.material = gold; out.push(pin);
  // the bare team body: the torso block, its yoke and pads, the belt, the pelvis and both legs in the skin material
  for (const m of [body.torsoMesh, pelvis, body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg,
    ...body.allMeshes.filter((x) => /_yoke$|_[lr]Pad$|_belt$/.test(x.name))]) { m.material = body.skinMaterial; glow?.addExcludedMesh(m); }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 517 the Cheerleader's striped knee socks (secret.cheerleader.red.png: cream socks from just under the knee down to the shoes, with narrow
 * team-colour stripes running down them, about three showing on each side; audit 515 a.3 "plain legs"). Spec on each shin (limbBox: its length
 * and half-width in the knee's frame, 0 the shin's top, 1 its foot): an 8-sided cream shell from .from to .to of the way down, .out of the
 * half-width round (x deep/wide for depth), a turned-over cuff band .cuff of the length tall .cuffOut round at its top; .stripes vertical team
 * stripes evenly round it, each .stripeW of the shell's radius wide and .stripeT thick, standing on the shell's surface. Cream unlit (LESSONS
 * 442); stripes in their own team cloth x .shade self-lit .12 (LESSONS 449); out of the glow.
 */
const CHEER_SOCK = { from: 0.08, to: 1.0, out: 1.28, cuff: 0.1, cuffOut: 1.08, stripes: 8, stripeW: 0.34, stripeT: 0.1, shade: 0.85, cream: new Color3(0.82, 0.76, 0.64) };
export function cheerleaderSocks(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = CHEER_SOCK, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const cream = mf.get("unlit", C.cream, { emissive: C.cream });
  const stripeC = team.scale(C.shade), stripe = mf.get("cloth", stripeC, { emissive: stripeC.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const L = limbBox(shin), top = L.mid + L.half, r = Math.max(L.wide, L.deep) * C.out, sz = L.deep / Math.max(L.wide, L.deep);
    const yTop = top - C.from * L.half * 2, yBot = top - C.to * L.half * 2, h = yTop - yBot, yMid = (yTop + yBot) / 2;
    const sock = MeshBuilder.CreateCylinder("cheerSock", { height: h, diameter: r * 2, tessellation: 8 }, scene);
    sock.parent = shin.parent; sock.position.set(0, yMid, 0); sock.scaling.z = sz; sock.rotation.y = Math.PI / 8; sock.material = cream; out.push(sock);
    const cuffH = L.half * 2 * C.cuff;
    const cuff = MeshBuilder.CreateCylinder("cheerSockCuff", { height: cuffH, diameter: r * 2 * C.cuffOut, tessellation: 8 }, scene);
    cuff.parent = shin.parent; cuff.position.set(0, yTop - cuffH / 2, 0); cuff.scaling.z = sz; cuff.rotation.y = Math.PI / 8; cuff.material = cream; out.push(cuff);
    for (let k = 0; k < C.stripes; k++) {
      const a = (k / C.stripes) * Math.PI * 2;
      const bar = MeshBuilder.CreateBox("cheerSockStripe", { width: r * C.stripeW, height: h - cuffH, depth: r * C.stripeT }, scene);
      bar.parent = shin.parent; bar.rotation.y = a;
      bar.position.set(Math.sin(a) * r * 0.97, yBot + (h - cuffH) / 2, Math.cos(a) * r * 0.97 * sz);
      bar.material = stripe; out.push(bar);
    }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 518 the Taekwondo's gi trousers (secret.taekwondo.red.png: wide straight team trousers from the jacket's hem to the ankle, about twice the
 * leg's width, flaring a little to a deep cream cuff a quarter of the shin long over the top of the bare foot; audit 515 a.4 "plain legs").
 * Spec on each leg (limbBox in its joint's frame, 0 the limb's top, 1 its foot): an 8-sided shell .thigh of the thigh's half-width round from
 * .over above its top to its foot; on the shin a shell .shin round at the knee flaring to .flare at the ankle, from 0 to .cuffAt; then a cream
 * cuff band .cuff round from .cuffAt to .low (past the shin's foot, over the instep). The jacket's own material (body.bodyMaterial, so trousers
 * and jacket share the shade); cream unlit (LESSONS 442). The grey boot gone: both feet bare team skin. Out of the glow.
 */
const TKD_TROUSER = { thigh: 2.0, over: 0.12, shin: 2.15, flare: 2.4, cuffAt: 0.72, cuff: 2.55, low: 1.12, cream: new Color3(0.95, 0.86, 0.76) };
export function taekwondoTrousers(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const T = TKD_TROUSER, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const cloth = body.bodyMaterial ?? mf.get("cloth", team, { emissive: team.scale(0.12), roughness: 1 });
  const cream = mf.get("unlit", T.cream, { emissive: T.cream });
  const out: Mesh[] = [];
  const shell = (name: string, limb: Mesh, from: number, to: number, rTop: number, rBot: number, material: Material): void => {
    const L = limbBox(limb), top = L.mid + L.half, r = Math.max(L.wide, L.deep), sz = L.deep / r;
    const yTop = top - from * L.half * 2, yBot = top - to * L.half * 2;
    const m = MeshBuilder.CreateCylinder(name, { height: yTop - yBot, diameterTop: r * 2 * rTop, diameterBottom: r * 2 * rBot, tessellation: 8 }, scene);
    m.parent = limb.parent; m.position.set(0, (yTop + yBot) / 2, 0); m.scaling.z = Math.max(0.8, sz); m.rotation.y = Math.PI / 8; m.material = material;
    out.push(m);
  };
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) { shell("tkdTrouserThigh", thigh, -T.over, 1, T.thigh, T.thigh * 1.04, cloth); thigh.material = cloth; }
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const k = T.shin + (T.flare - T.shin) * T.cuffAt;
    shell("tkdTrouserShin", shin, -0.02, T.cuffAt, T.shin, k, cloth);
    shell("tkdTrouserCuff", shin, T.cuffAt, T.low, T.cuff, T.cuff * 1.04, cream);
    shin.material = cloth;
  }
  for (const foot of body.allMeshes.filter((m) => /_[lr]FootM$/.test(m.name))) foot.material = body.skinMaterial;
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 518 the Taekwondo's hair (secret.taekwondo.red.png, .jpg: dark brown-black hair close over the crown, its front edge just over the bead eyes,
 * gathered into a tall topknot bun on the crown tied by a team-colour hairband; card Appearance "a black belt and hairband in their hair"; audit
 * 515 a.6 "pale grey cap with a tie"). Spec in head widths W, heights H, depths D (head box, centre c; e the eyes' top): the hair a half ellipsoid
 * .capW W x .capH H x .capD D on a base .capLo H over e, set .capBack D back; the bun a 6-sided cylinder .bunW W across (.bunTop of it at its top)
 * .bun H tall on the crown .bunBack D back, leaning .lean rad back, its hairband .band H tall .bandW of the bun round at .bandAt of its height.
 * Near-black lit cloth self-lit .4 (LESSONS 494), team band; out of the glow. The bandana hat off (unitVisuals).
 */
const TKD_HAIR = { capW: 1.12, capH: 0.6, capD: 1.12, capLo: 0.03, capBack: 0.04, bunW: 0.34, bunTop: 0.85, bun: 0.4, bunBack: 0.1, lean: -0.25, band: 0.1, bandW: 1.14, bandAt: 0.3,
  dark: new Color3(0.11, 0.08, 0.07) };
export function taekwondoHair(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = TKD_HAIR, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const hair = mf.get("cloth", C.dark, { emissive: C.dark.scale(0.4), roughness: 1 });
  const band = mf.get("cloth", team, { emissive: team.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const base = e + H * C.capLo;
  const cap = MeshBuilder.CreateSphere("tkdHair", { diameter: 1, segments: 5, slice: 0.5 }, scene);
  cap.parent = head; cap.material = hair; cap.position.set(c.x, base, c.z - D * C.capBack); cap.scaling.set(W * C.capW, H * C.capH * 2, D * C.capD); out.push(cap);
  const knot = new TransformNode("tkdBunRoot", scene);
  knot.parent = head; knot.position.set(c.x, base + H * C.capH * 0.9, c.z - D * C.bunBack); knot.rotation.x = C.lean;
  const bun = MeshBuilder.CreateCylinder("tkdBun", { height: H * C.bun, diameterBottom: W * C.bunW, diameterTop: W * C.bunW * C.bunTop, tessellation: 6 }, scene);
  bun.parent = knot; bun.position.y = (H * C.bun) / 2; bun.material = hair; out.push(bun);
  const tie = MeshBuilder.CreateCylinder("tkdHairband", { height: H * C.band, diameter: W * C.bunW * C.bandW, tessellation: 6 }, scene);
  tie.parent = knot; tie.position.y = H * C.bun * C.bandAt; tie.material = band; out.push(tie);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 531 the Gatling Gun operator's hair (secret.gatling_gun.red.png, .jpg: bare head, short dark brown-black hair close over the crown and down to
 * the ears and nape, swept up into a low quiff over the forehead; audit 527 a.1 "a giant black top hat"). Spec in head widths W, heights H, depths D
 * (head box, centre c; e the eyes' top): a half ellipsoid .capW W x .capH H x .capD D on a base .capLo H over e, set .capBack D back; a back fall box
 * .backW W wide from the cap's foot down to .backLo H under e at the nape; a quiff, a flattened ellipsoid .quiffW W x .quiffH H x .quiffD D at the
 * cap's front .quiffUp H over e, tipped .tilt rad up. Near-black lit cloth self-lit .4 (LESSONS 494), out of the glow. captain_hat off (linkedActorPresets).
 */
const GATLING_HAIR = { capW: 1.1, capH: 0.5, capD: 1.12, capLo: 0.02, capBack: 0.05, backW: 1.0, backLo: -0.3, quiffW: 0.8, quiffH: 0.26, quiffD: 0.4, quiffUp: 0.22, tilt: -0.35,
  dark: new Color3(0.11, 0.08, 0.07) };
export function gatlingGunnerHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = GATLING_HAIR, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const hair = mf.get("cloth", C.dark, { emissive: C.dark.scale(0.4), roughness: 1 });
  const out: Mesh[] = [];
  const base = e + H * C.capLo;
  const cap = MeshBuilder.CreateSphere("gatlingHair", { diameter: 1, segments: 5, slice: 0.5 }, scene);
  cap.parent = head; cap.material = hair; cap.position.set(c.x, base, c.z - D * C.capBack); cap.scaling.set(W * C.capW, H * C.capH * 2, D * C.capD); out.push(cap);
  const backH = base - (e + H * C.backLo);
  const fall = MeshBuilder.CreateBox("gatlingHairBack", { width: W * C.backW, height: backH, depth: D * 0.18 }, scene);
  fall.parent = head; fall.material = hair; fall.position.set(c.x, base - backH / 2, c.z - D * C.capD * 0.5 + D * 0.06); out.push(fall);
  const quiff = MeshBuilder.CreateSphere("gatlingHairQuiff", { diameter: 1, segments: 4 }, scene);
  quiff.parent = head; quiff.material = hair; quiff.position.set(c.x, e + H * C.quiffUp, c.z + D * C.capD * 0.32);
  quiff.scaling.set(W * C.quiffW, H * C.quiffH, D * C.quiffD); quiff.rotation.x = C.tilt; out.push(quiff);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 518 the Cheerleader's short hair (secret.cheerleader.blue.png: a short team-colour hair cap, a shade deeper than the skin, close over the crown
 * and down to the ears and nape, its front edge a short fringe just over the bead eyes; audit 515 a.5 "a grey cap"). Spec in head widths W, heights
 * H, depths D (head box, centre c; e the eyes' top): a half ellipsoid .capW W x .capH H x .capD D on a base .capLo H over e, set .capBack D back;
 * a back fall box .backW W wide from the cap's foot down to .backLo H under e at the nape; a fringe slab .fringeW W wide .fringeH H tall across the
 * forehead over the eyes, tilted .tilt rad out. Own team cloth x .shade self-lit .12 (LESSONS 449), out of the glow. The bandana off (unitVisuals).
 */
const CHEER_HAIR = { capW: 1.14, capH: 0.56, capD: 1.14, capLo: 0.02, capBack: 0.04, backW: 1.02, backLo: -0.36, fringeW: 0.9, fringeH: 0.16, tilt: 0.25, shade: 0.72 };
export function cheerleaderHair(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = CHEER_HAIR, glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const tint = team.scale(C.shade), hair = getMaterialFactory().get("cloth", tint, { emissive: tint.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const base = e + H * C.capLo;
  const cap = MeshBuilder.CreateSphere("cheerHair", { diameter: 1, segments: 5, slice: 0.5 }, scene);
  cap.parent = head; cap.material = hair; cap.position.set(c.x, base, c.z - D * C.capBack); cap.scaling.set(W * C.capW, H * C.capH * 2, D * C.capD); out.push(cap);
  const low = e + H * C.backLo;
  const back = MeshBuilder.CreateBox("cheerHairBack", { width: W * C.backW, height: base - low + H * 0.05, depth: D * 0.4 }, scene);
  back.parent = head; back.material = hair; back.position.set(c.x, (base + low) / 2, c.z - D * 0.36); out.push(back);
  const fringe = MeshBuilder.CreateBox("cheerHairFringe", { width: W * C.fringeW, height: H * C.fringeH, depth: D * 0.12 }, scene);
  fringe.parent = head; fringe.material = hair; fringe.position.set(c.x, base + H * C.fringeH * 0.4, c.z + D * 0.52); fringe.rotation.x = -C.tilt; out.push(fringe);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 518 Cupid's bare feet (secret.cupid.red.png, .blue.png: bare team-skin feet under the bare legs, no shoe or boot; audit 515 a.5 "grey boots").
 * The grey boot is the body's own foot mesh (cuff + toe box) in the boot material: both feet re-clothed in the skin material, slimmed to .slim of
 * their width and lowered in the cuff (.cuff of its height) so they read as a foot under the shin rather than a boot; out of the glow.
 */
const CUPID_FOOT = { slim: 0.86, cuff: 0.7 };
export function cupidFeet(scene: Scene, body: ArticulatedBody): void {
  const glow = scene.getGlowLayerByName("glow");
  for (const foot of body.allMeshes.filter((m) => /_[lr]FootM$/.test(m.name))) {
    const lo = foot.getBoundingInfo().boundingBox.minimum.y;
    foot.material = body.skinMaterial;
    foot.scaling.x *= CUPID_FOOT.slim;
    foot.scaling.y *= CUPID_FOOT.cuff;
    foot.position.y += lo * (1 - CUPID_FOOT.cuff);
    glow?.addExcludedMesh(foot);
  }
}

/*
 * [S] 520 the Mace Spinner's two maces (secret.mace_spinner.blue.png, .red.png: one mace in each fist, held at the hip and stood upright, leaning a
 * little out; each a long near-black iron shaft with a dark flanged head as wide as his head at the top, a spike over it; card Main Hand and Off Hand
 * "Mace Spin"; audit 515 b.2 "one mace upright in each fist; ours has the second hanging at the hip, out of hand", b.3 "maces held upright at waist
 * height; ours lays the shaft across the shoulders"). SPINNER_MACE in his standing height Hs: a 6-sided shaft .shaft Hs long, .thick Hs across, the
 * fist .grip of it up from its butt, a ring at the butt; the head .head Hs tall: a 6-sided core .core Hs across, .flanges flat flanges .fin Hs out
 * from it, a collar under it and a spike .spike Hs over it. Each mace is anchored to a fist and aimed each frame (RuntimeUnit._tendSpinnerMaces), the shaft
 * up the world's up leaned .lean rad out to his side and .fore ahead, so it stands upright whatever the hand's own turn. Near-black lit cloth self-lit
 * .4 (LESSONS 494), the flanges a dark grey, out of the glow. The unit's own mace props are off (unitVisuals weapon none).
 */
const SPINNER_MACE = { shaft: 0.6, thick: 0.03, grip: 0.14, head: 0.17, core: 0.07, flanges: 6, fin: 0.06, spike: 0.08, lean: 0.22, fore: 0.12,
  iron: new Color3(0.08, 0.075, 0.08), flange: new Color3(0.16, 0.16, 0.17) };
export class SpinnerMaces {
  private readonly _roots: TransformNode[] = [];
  private readonly _meshes: Mesh[] = [];
  constructor(scene: Scene, private readonly _body: ArticulatedBody, height: number) {
    const M = SPINNER_MACE, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
    const iron = mf.get("cloth", M.iron, { emissive: M.iron.scale(0.4), roughness: 1 });
    const flange = mf.get("cloth", M.flange, { emissive: M.flange.scale(0.4), roughness: 1 });
    const L = height * M.shaft, H = height * M.head;
    for (let k = 0; k < 2; k++) {
      const root = new TransformNode("spinnerMace", scene);
      root.parent = k === 0 ? _body.rightHand : _body.leftHand;
      root.rotationQuaternion = Quaternion.Identity();
      const put = (m: Mesh, material: Material, y: number): Mesh => { m.parent = root; m.material = material; m.position.y = y; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); this._meshes.push(m); return m; };
      const lo = -L * M.grip, hi = lo + L;
      put(MeshBuilder.CreateCylinder("spinnerMaceShaft", { height: L, diameter: height * M.thick, tessellation: 6 }, scene), iron, (lo + hi) / 2);
      put(MeshBuilder.CreateCylinder("spinnerMaceButt", { height: height * 0.025, diameter: height * M.thick * 1.7, tessellation: 6 }, scene), iron, lo);
      put(MeshBuilder.CreateCylinder("spinnerMaceCollar", { height: H * 0.14, diameterTop: height * M.core, diameterBottom: height * M.thick * 1.6, tessellation: 6 }, scene), iron, hi - H * 0.07);
      const mid = hi + H / 2;
      put(MeshBuilder.CreateCylinder("spinnerMaceCore", { height: H, diameter: height * M.core, tessellation: 6 }, scene), iron, mid);
      for (let f = 0; f < M.flanges; f++) {
        const a = (f / M.flanges) * Math.PI * 2;
        const fin = put(MeshBuilder.CreateBox("spinnerMaceFlange", { width: height * M.fin, height: H * 0.92, depth: height * 0.018 }, scene), flange, mid);
        fin.rotation.y = a;
        fin.position.x = Math.cos(a) * (height * (M.core + M.fin)) / 2;
        fin.position.z = -Math.sin(a) * (height * (M.core + M.fin)) / 2;
      }
      put(MeshBuilder.CreateCylinder("spinnerMaceSpike", { height: height * M.spike, diameterTop: 0, diameterBottom: height * M.core * 0.7, tessellation: 6 }, scene), iron, hi + H + height * M.spike / 2);
      this._roots.push(root);
    }
    this.place();
  }
  get meshes(): Mesh[] { return this._meshes; }
  /** Keep the maces upright in the carry and extend them past the fists in the whirl. */
  place(whirling = false): void {
    const M = SPINNER_MACE, b = this._body;
    b.root.computeWorldMatrix(true);
    const fwd = Vector3.TransformNormal(new Vector3(0, 0, 1), b.root.getWorldMatrix());
    fwd.y = 0;
    if (fwd.lengthSquared() < 1e-6) fwd.set(0, 0, 1);
    fwd.normalize();
    const right = Vector3.Cross(Vector3.Up(), fwd).normalize();
    [b.rightHand, b.leftHand].forEach((hand, k) => {
      const chain: TransformNode[] = [];
      for (let n: TransformNode | null = hand; n; n = n.parent as TransformNode | null) chain.unshift(n);
      for (const n of chain) n.computeWorldMatrix(true);
      const side = k === 0 ? 1 : -1;
      const elbow = k === 0 ? b.rightElbow : b.leftElbow;
      const up = whirling
        ? hand.getAbsolutePosition().subtract(elbow.getAbsolutePosition()).normalize()
        : Vector3.Up().add(right.scale(side * Math.tan(M.lean))).add(fwd.scale(Math.tan(M.fore))).normalize();
      const root = this._roots[k];
      const worldRotation = Quaternion.Identity();
      Quaternion.FromUnitVectorsToRef(Vector3.Up(), up, worldRotation);
      hand.absoluteRotationQuaternion.conjugate().multiplyToRef(worldRotation, root.rotationQuaternion!);
    });
  }
  dispose(): void {
    for (const r of this._roots) r.dispose(false, false);
  }
}

/*
 * [S] 520 the Mace Spinner's helmet (secret.mace_spinner.blue.png: a round grey closed helm, a smooth dome over the crown running down the sides and
 * back of the head to the jaw, the face closed under the eyes, the eyes showing through a slit; a gold brow band across over the eyes and a gold
 * nose guard down the middle of the face plate; card "a helmet very similar to the one of a Squire but a lot less cubic and more round with no
 * holes"; audit 515 a.2 "ours is a team flat cap"). Spec in head widths W, heights H, depths D (head box, centre c, front +z; e/eb the eyes' top and
 * bottom in the head's frame): dome .dome W wide from .rim H over the eye top to .crown H over c; a 10-sided skirt .skirt W wide from the eye top
 * down to .jaw H under c, open across the front (the slit and the face plate's place); a face plate from the eye bottom to the jaw; gold brow
 * band .brow H tall across the front at the eye top, .browW W wide; a nose guard .nose W wide from the band to the plate's foot. Grey lit cloth
 * self-lit .12, gold unlit (LESSONS 400), all out of the glow. The shared team "helmet" hat is off (unitVisuals hat none).
 */
const SPINNER_HELM = { dome: 1.24, rim: 0.03, crown: 0.68, skirt: 1.22, jaw: 0.56, brow: 0.1, browW: 1.08, nose: 0.13, stand: 0.03,
  grey: new Color3(0.36, 0.37, 0.39), gold: new Color3(0.62, 0.26, 0.03) };
export function maceSpinnerHelm(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = SPINNER_HELM, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const eyes = eyeBoxInHead(body) ?? { lo: new Vector3(c.x - W * 0.3, c.y, c.z + D * 0.4), hi: new Vector3(c.x + W * 0.3, c.y + H * 0.15, c.z + D * 0.55) };
  const e = eyes.hi.y, eb = eyes.lo.y;
  const grey = mf.get("cloth", C.grey, { emissive: C.grey.scale(0.12), roughness: 1 });
  const gold = mf.get("unlit", C.gold, { emissive: C.gold });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: Material = grey): Mesh => { m.parent = head; m.material = material; out.push(m); return m; };
  const foot = e + H * C.rim, crown = c.y + H * C.crown, jaw = c.y - H * C.jaw;
  const dome = put(MeshBuilder.CreateSphere("spinnerHelmDome", { diameter: 1, segments: 6, slice: 0.5 }, scene));
  dome.scaling.set(W * C.dome, (crown - foot) * 2, D * C.dome); dome.position.set(c.x, foot, c.z);
  // the skirt: sides and back from the dome's foot to the jaw, its front arc left open (arc .78 of the round), turned so the gap faces +z
  const skirt = put(MeshBuilder.CreateCylinder("spinnerHelmSkirt", { height: foot - jaw, diameter: W * C.skirt, tessellation: 10, arc: 0.78, enclose: true }, scene));
  skirt.scaling.z = (D * C.dome) / (W * C.skirt); skirt.position.set(c.x, (foot + jaw) / 2, c.z); skirt.rotation.y = Math.PI / 2 + Math.PI * 0.22;
  const front = Math.max(eyes.lo.z, c.z + D / 2) + D * C.stand;
  const plateTop = eb - H * 0.01;
  const plate = put(MeshBuilder.CreateBox("spinnerHelmFace", { width: W * C.skirt * 0.72, height: plateTop - jaw, depth: D * 0.12 }, scene));
  plate.position.set(c.x, (plateTop + jaw) / 2, front - D * 0.04);
  const brow = put(MeshBuilder.CreateBox("spinnerHelmBrow", { width: W * C.browW, height: H * C.brow, depth: D * 0.1 }, scene), gold);
  brow.position.set(c.x, e + (H * C.brow) / 2, front + D * 0.01);
  const nose = put(MeshBuilder.CreateBox("spinnerHelmNose", { width: W * C.nose, height: e - jaw, depth: D * 0.1 }, scene), gold);
  nose.position.set(c.x, (e + jaw) / 2, front + D * 0.04);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/** Faceted breastplate with a separate flared waist fauld. */
export function maceSpinnerBreastplate(scene: Scene, body: ArticulatedBody): Mesh[] {
  const torso = body.torsoMesh;
  const bounds = torso.getBoundingInfo().boundingBox;
  const center = torso.position.add(bounds.center.multiply(torso.scaling));
  const size = bounds.extendSize.multiply(torso.scaling);
  const color = new Color3(0.54, 0.5, 0.43);
  const steel = getMaterialFactory().get("cloth", color, { emissive: color.scale(0.2), roughness: 1 });
  const glow = scene.getGlowLayerByName("glow");
  const sections = [
    { name: "spinnerFauld", rings: [[1.48, -1.32], [1.12, -0.88], [1.12, -0.72]] },
    { name: "spinnerBreastplate", rings: [[0.9, -1.03], [1.38, -0.58], [1.51, 0.1], [1.36, 0.82], [1.07, 1.02]] },
  ];
  return sections.map(({ name, rings }) => {
    const plate = MeshBuilder.CreateLathe(name, {
      shape: rings.map(([radius, height]) => new Vector3(radius * size.x, height * size.y, 0)),
      tessellation: 10,
    }, scene);
    plate.parent = body.torso;
    plate.position.copyFrom(center);
    plate.scaling.z = 1.22 * size.z / size.x;
    plate.material = steel;
    plate.convertToFlatShadedMesh();
    glow?.addExcludedMesh(plate);
    return plate;
  });
}

/** Steel knee cops sit over tapered shin plates. */
export function maceSpinnerGreaves(scene: Scene, body: ArticulatedBody): Mesh[] {
  const color = new Color3(0.54, 0.5, 0.43);
  const steel = getMaterialFactory().get("cloth", color, { emissive: color.scale(0.2), roughness: 1 });
  const glow = scene.getGlowLayerByName("glow");
  return [body.leftLowerLeg, body.rightLowerLeg].flatMap((shin) => {
    const { center, extendSize } = shin.getBoundingInfo().boundingBox;
    const greave = shirtSleeve(scene, shin, steel, "spinnerGreave", 0.9, 1.58, 1.32);
    const knee = MeshBuilder.CreateIcoSphere("spinnerKneeCop", { radius: 1, subdivisions: 1 }, scene);
    knee.parent = shin;
    knee.position.set(center.x, center.y + extendSize.y * 0.77, center.z + extendSize.z * 0.7);
    knee.scaling.set(extendSize.x * 1.55, extendSize.x * 1.2, extendSize.z * 0.95);
    knee.material = steel;
    glow?.addExcludedMesh(knee);
    return [greave, knee];
  });
}

/*
 * [S] 519 the Infernal Whip's chain whip (secret.infernal_whip.red.png: a chain of dark iron links about a body length long, hanging from the fist and
 * lying out over the ground, ending in a dark leaf-shaped blade; audit 518 b.1 "a short rigid dark stick with a few loose links behind"). CHAIN_WHIP:
 * .links links, the whole .long of his standing height; each link a dark box .wide x .thick of its length (in link lengths), every other one turned a quarter about the
 * chain so it reads as linked rings; the blade a flat four-sided point .blade of the length past the last link. The chain is a little rope laid in the
 * world (not under the hand: a rigid prop cannot hang from a swinging fist): its first point pinned to the fist each frame, the rest falling under
 * .gravity with .drag, lying on the ground (.ground m up) with .friction, held to their link length by .passes passes; stepped at most .step s at a time
 * (the capture advances 100 ms chunks). Laid out at spawn hanging to the ground and out ahead-and-aside (.out rad off his facing), so the idle shot
 * finds it lying. Near-black lit cloth self-lit .4 (LESSONS 494), out of the glow.
 */
const CHAIN_WHIP = { links: 14, long: 1.0, wide: 0.5, thick: 0.22, blade: 0.13, gravity: 22, drag: 2.5, ground: 0.03, friction: 12, passes: 8, step: 1 / 60, out: 0.6, sag: 0.04, dark: new Color3(0.08, 0.06, 0.07) };
const CHAIN_EMBER = { every: 3, from: 1, crack: 1.0, crackH: 0.45, tilt: 0.5, sparkEvery: 4, spark: 2.0, sparkOut: 0.6, sparkTilt: 0.9,
  hot: new Color3(1.6, 0.5, 0.05), sparkC: new Color3(1.5, 1.15, 0.45) };
export class ChainWhip {
  private readonly _pts: Vector3[] = [];
  private readonly _prev: Vector3[] = [];
  private readonly _links: Mesh[] = [];
  private readonly _blade: Mesh;
  private readonly _seg: number;
  constructor(scene: Scene, private readonly _hand: TransformNode, height: number, facing: Vector3, side: 1 | -1 = 1) {
    const C = CHAIN_WHIP, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
    const dark = mf.get("cloth", C.dark, { emissive: C.dark.scale(0.4), roughness: 1 });
    const L = Math.max(0.6, height * C.long);
    this._seg = L / C.links;
    for (let i = 0; i < C.links; i++) {
      const link = MeshBuilder.CreateBox("chainWhipLink", { width: this._seg * C.wide, height: this._seg * 1.08, depth: this._seg * C.thick }, scene);
      link.material = dark; link.isPickable = false; link.rotationQuaternion = Quaternion.Identity();
      glow?.addExcludedMesh(link);
      this._links.push(link);
    }
    this._dressEmbers(scene);
    this._blade = MeshBuilder.CreateCylinder("chainWhipBlade", { height: L * C.blade, diameterTop: 0, diameterBottom: L * C.blade * 0.55, tessellation: 4 }, scene);
    this._blade.scaling.z = 0.3; this._blade.material = dark; this._blade.isPickable = false; this._blade.rotationQuaternion = Quaternion.Identity();
    glow?.addExcludedMesh(this._blade);
    // spawn layout: down from the fist to the ground, then out over it ahead and to his weapon side
    _hand.computeWorldMatrix(true);
    const h = _hand.getAbsolutePosition().clone();
    const f = new Vector3(facing.x, 0, facing.z);
    if (f.lengthSquared() < 1e-6) f.set(0, 0, 1);
    f.normalize();
    const angle = C.out * side;
    const along = new Vector3(f.x * Math.cos(angle) + f.z * Math.sin(angle), 0, -f.x * Math.sin(angle) + f.z * Math.cos(angle));
    let p = h.clone();
    for (let i = 0; i <= C.links; i++) {
      if (i > 0) {
        const down = p.y - C.ground;
        if (down > this._seg * 0.5) p = p.add(new Vector3(along.x * 0.3, -0.95, along.z * 0.3).normalize().scale(this._seg));
        else p = new Vector3(p.x + along.x * this._seg, C.ground, p.z + along.z * this._seg);
      }
      this._pts.push(p.clone());
      this._prev.push(p.clone());
    }
    this._place();
  }
  /*
   * [S] 524 (b.3) the chain burns (secret.infernal_whip.red.png: bright orange-white cracks glow in the links all along both whips, sparks and glowing
   * flecks standing off them). CHAIN_EMBER: on every .every-th link, staggered from .from, a hot crack across both broad faces (.crack of the link's
   * width, .crackH tall, tilted .tilt), unlit hot orange in the glow layer so it blooms; on every .sparkEvery-th link a spark: a thin bright diamond
   * .spark of a link long standing .sparkOut out from the link's side at .sparkTilt, unlit yellow-white. Children of their links, so they ride the chain.
   */
  private _embers: Mesh[] = [];
  private _dressEmbers(scene: Scene): void {
    const E = CHAIN_EMBER, mf = getMaterialFactory();
    const hot = mf.get("unlit", E.hot, { emissive: E.hot });
    const spark = mf.get("unlit", E.sparkC, { emissive: E.sparkC });
    const s = this._seg;
    this._links.forEach((link, i) => {
      if ((i + E.from) % E.every === 0) {
        for (const face of [-1, 1]) {
          const crack = MeshBuilder.CreateBox("chainWhipEmber", { width: s * CHAIN_WHIP.wide * E.crack, height: s * E.crackH, depth: s * 0.02 }, scene);
          crack.parent = link; crack.material = hot; crack.isPickable = false;
          crack.position.z = face * s * CHAIN_WHIP.thick * 0.52;
          crack.rotation.z = (i % 2 ? 1 : -1) * E.tilt;
          this._embers.push(crack);
        }
      }
      if ((i + 1) % E.sparkEvery === 0) {
        const fleck = MeshBuilder.CreateCylinder("chainWhipSpark", { height: s * E.spark, diameterTop: 0, diameterBottom: s * 0.12, tessellation: 4 }, scene);
        fleck.parent = link; fleck.material = spark; fleck.isPickable = false;
        const side = i % 4 < 2 ? 1 : -1;
        fleck.position.set(side * s * (CHAIN_WHIP.wide * 0.5 + E.sparkOut), s * 0.2, 0);
        fleck.rotation.z = -side * E.sparkTilt;
        this._embers.push(fleck);
      }
    });
  }
  get meshes(): Mesh[] { return [...this._links, this._blade, ...this._embers]; }
  /**
   * [S] 520 the lash (audit 515 c.1: "the whip extends to the target, range 10; ours throws a dark dart from the hand"; card Weapons "Whip - Melee;
   * range 10", Characteristics "two flaming whips that will extend toward enemy units"): for .out s the chain runs straight out of the fist toward
   * `to()` (the man's chest), its links stretched to cover the gap, sagging .sag of the reach at its middle; it stays on him .hold s, then draws back
   * to its own length over .back s and falls slack under the rope again. True while a lash is under way.
   */
  private _lash: { to: () => Vector3 | null; t: number; out: number; hold: number; back: number; last: Vector3 } | null = null;
  lash(to: () => Vector3 | null, out: number, hold: number, back: number): boolean {
    if (this._lash) return false;
    const at = to();
    if (!at) return false;
    this._lash = { to, t: 0, out, hold, back, last: at.clone() };
    return true;
  }
  get lashing(): boolean { return this._lash !== null; }
  private _stepLash(dt: number): void {
    const l = this._lash!, n = this._pts.length - 1, natural = this._seg * n;
    l.t += dt;
    const at = l.to();
    if (at) l.last.copyFrom(at);
    this._hand.computeWorldMatrix(true);
    const pin = this._hand.getAbsolutePosition().clone();
    const dir = l.last.subtract(pin);
    const far = Math.max(natural, dir.length());
    if (dir.lengthSquared() < 1e-6) dir.set(0, 0, 1);
    dir.normalize();
    const ease = (u: number) => 1 - (1 - u) * (1 - u);
    const reach = l.t < l.out ? natural + (far - natural) * ease(l.t / l.out)
      : l.t < l.out + l.hold ? far
        : far + (natural - far) * Math.min(1, (l.t - l.out - l.hold) / l.back);
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const p = pin.add(dir.scale(reach * u));
      p.y -= Math.sin(Math.PI * u) * reach * CHAIN_WHIP.sag;
      if (p.y < CHAIN_WHIP.ground) p.y = CHAIN_WHIP.ground;
      this._pts[i].copyFrom(p);
      this._prev[i].copyFrom(p);
    }
    if (l.t >= l.out + l.hold + l.back) this._lash = null;
  }
  step(dt: number): void {
    const C = CHAIN_WHIP;
    if (this._lash) { this._stepLash(Math.max(0, dt)); this._place(); return; }
    let left = Math.min(0.25, Math.max(0, dt));
    while (left > 1e-6) {
      const h = Math.min(C.step, left);
      left -= h;
      this._hand.computeWorldMatrix(true);
      const pin = this._hand.getAbsolutePosition();
      const keep = Math.exp(-C.drag * h);
      for (let i = 1; i < this._pts.length; i++) {
        const p = this._pts[i], q = this._prev[i];
        const v = p.subtract(q).scale(keep);
        if (p.y <= C.ground + 1e-3) { const k = Math.exp(-C.friction * h); v.x *= k; v.z *= k; }
        q.copyFrom(p);
        p.addInPlace(v);
        p.y -= C.gravity * h * h;
        if (p.y < C.ground) p.y = C.ground;
      }
      this._pts[0].copyFrom(pin);
      this._prev[0].copyFrom(pin);
      for (let k = 0; k < C.passes; k++) {
        for (let i = 0; i < this._pts.length - 1; i++) {
          const a = this._pts[i], b = this._pts[i + 1];
          const d = b.subtract(a);
          const len = d.length();
          if (len < 1e-6) continue;
          const corr = d.scale((len - this._seg) / len);
          if (i === 0) b.subtractInPlace(corr);
          else { a.addInPlace(corr.scale(0.5)); b.subtractInPlace(corr.scale(0.5)); }
          if (b.y < C.ground) b.y = C.ground;
        }
      }
    }
    this._place();
  }
  private _place(): void {
    for (let i = 0; i < this._links.length; i++) {
      const a = this._pts[i], b = this._pts[i + 1], link = this._links[i];
      const d = b.subtract(a);
      if (d.lengthSquared() < 1e-8) continue;
      link.position.copyFrom(a.add(b).scale(0.5));
      // a link stretches along the chain to cover a lash's longer gaps (520), and is its own length at rest
      link.scaling.y = Math.max(1, d.length() / this._seg);
      Quaternion.FromUnitVectorsToRef(Vector3.Up(), d.normalize(), link.rotationQuaternion!);
      if (i % 2) link.rotationQuaternion!.multiplyInPlace(Quaternion.RotationAxis(Vector3.Up(), Math.PI / 2));
    }
    const n = this._pts.length, tip = this._pts[n - 1], dir = tip.subtract(this._pts[n - 2]);
    if (dir.lengthSquared() > 1e-8) {
      dir.normalize();
      const half = this._blade.getBoundingInfo().boundingBox.extendSize.y;
      this._blade.position.copyFrom(tip.add(dir.scale(half)));
      Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, this._blade.rotationQuaternion!);
    }
  }
  dispose(): void {
    for (const m of this.meshes) m.dispose(false, false);
  }
}

/** Cream cheer top with short caps that follow the shoulder joints. */
export function cheerleaderTop(scene: Scene, body: ArticulatedBody): Mesh[] {
  const color = new Color3(0.94, 0.9, 0.79);
  const cream = getMaterialFactory().get("unlit", color, { emissive: color });
  const glow = scene.getGlowLayerByName("glow");
  body.torsoMesh.material = cream;
  glow?.addExcludedMesh(body.torsoMesh);
  for (const mesh of body.allMeshes.filter((m) => m.name.endsWith("_yoke"))) {
    mesh.material = cream;
    glow?.addExcludedMesh(mesh);
  }
  return [body.leftUpperArm, body.rightUpperArm].map((arm) =>
    shirtSleeve(scene, arm, cream, "cheerTopCap", 0.34, 1.43, 1.2));
}

function shirtSleeve(
  scene: Scene, arm: Mesh, material: Material, name: string, coverage: number, flareTop: number, flareBottom: number,
): Mesh {
  const { center, extendSize } = arm.getBoundingInfo().boundingBox;
  const length = extendSize.y * 2 * coverage;
  const diameter = extendSize.x * 2;
  const sleeve = MeshBuilder.CreateCylinder(name, {
    height: length,
    diameterTop: diameter * flareTop,
    diameterBottom: diameter * flareBottom,
    tessellation: 8,
  }, scene);
  sleeve.parent = arm;
  sleeve.position.set(center.x, center.y + extendSize.y - length / 2, center.z);
  sleeve.rotation.y = Math.PI / 8;
  sleeve.scaling.z = extendSize.z / extendSize.x;
  sleeve.material = material;
  sleeve.convertToFlatShadedMesh();
  scene.getGlowLayerByName("glow")?.addExcludedMesh(sleeve);
  return sleeve;
}

/** CLAMS wears a rolled tan shirt laced across the open collar. */
export function clamsShirt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const fabric = new Color3(0.8, 0.6, 0.35).scale(0.84);
  const mf = getMaterialFactory();
  const cloth = mf.get("cloth", fabric, { emissive: fabric.scale(0.18), roughness: 1 });
  const fold = mf.get("cloth", fabric.scale(0.72), { emissive: fabric.scale(0.1), roughness: 1 });
  const laceColor = new Color3(0.26, 0.13, 0.09);
  const lace = mf.get("cloth", laceColor, { emissive: laceColor.scale(0.18), roughness: 1 });
  body.torsoMesh.material = cloth;
  for (const mesh of body.allMeshes.filter((m) => m.name.endsWith("_yoke"))) mesh.material = cloth;

  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    const sleeve = shirtSleeve(scene, arm, cloth, "clamsRolledSleeve", 0.88, 1.35, 1.3);
    const cuff = shirtSleeve(scene, arm, fold, "clamsShirtRoll", 0.21, 1.4, 1.47);
    cuff.position.y -= arm.getBoundingInfo().boundingBox.extendSize.y * 1.42;
    out.push(sleeve, cuff);
  }

  const chest = limbBox(body.torsoMesh);
  const top = chest.mid + chest.half * 0.96;
  const width = chest.wide * 0.39;
  const front = chest.deep * 1.16;
  const left = new Vector3(-width, top, front);
  const right = new Vector3(width, top, front);
  const point = new Vector3(0, top - chest.half * 0.71, front);
  const back = new Vector3(0, top - chest.half * 0.21, front - 0.014);
  const neckline = facetedSolid(scene, "clamsShirtNeckline", [[left, right, point], [left, back, right], [left, point, back], [right, back, point]]);
  neckline.parent = body.torso;
  neckline.material = body.skinMaterial;
  out.push(neckline);
  for (const start of [0.04, 0.34]) {
    const end = start + 0.26;
    for (const [from, to] of [[left, right], [right, left]]) {
      const a = Vector3.Lerp(from, point, start);
      const b = Vector3.Lerp(to, point, end);
      a.z += 0.009;
      b.z += 0.009;
      taper(scene, "clamsShirtLacing", [a, b], width * 0.11, width * 0.11, body.torso, lace, out);
    }
  }
  return out;
}

/*
 * [S] 524 CLAMS' shell collar (secret.clams.red.png, .blue.png: his neck comes up out of a clam's lower half-shell, a wide shallow dish round the
 * neck as wide as the shoulders, its underside dark charcoal, its inside team coloured, a pale grey lip round the edge; audit 515 a.3). CLAM_COLLAR
 * in torso half-widths, on the torso joint at the chest's top: a closed lathe dish from the neck (.neck) down and out to its rim (.rim, .rimUp above
 * the neck's foot), .thick deep at the middle, squashed front to back to .depth of its width; a team-coloured inside disc .inset under the rim's top;
 * a pale lip torus .lip thick round the rim. Lit cloth a little self-lit, the lip unlit, all out of the glow.
 */
// 524b: the limbBox width of his slim torso is about half its shown half-width: rim 1.22 read as a neck ring the head's width
const CLAM_COLLAR = { neck: 0.9, rim: 1.95, rimUp: 0.32, thick: 0.45, drop: 0.06, depth: 0.82, inset: 0.035, lip: 0.07, segs: 14,
  dark: new Color3(0.07, 0.068, 0.072), pale: new Color3(0.62, 0.62, 0.6) };
export function clamsCollar(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = CLAM_COLLAR, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const chest = limbBox(body.torsoMesh);
  const W = chest.wide, top = chest.mid + chest.half * (1 - C.drop);
  const dark = mf.get("cloth", C.dark, { emissive: C.dark.scale(0.4), roughness: 1 });
  // the inside is a deep team shade (team squared, x.7): plain team cloth read near white in the sun
  const deep = new Color3(team.r * team.r, team.g * team.g, team.b * team.b).scale(0.7);
  const inside = mf.get("cloth", deep, { emissive: deep.scale(0.12), roughness: 1 });
  const pale = mf.get("unlit", C.pale, { emissive: C.pale });
  const root = new TransformNode("clamsCollar", scene);
  root.parent = body.torso;
  root.position.set(0, top, 0);
  root.scaling.set(1, 1, C.depth);
  // a closed profile, out along the underside and back along the top, so the dish is a solid with no open faces
  const n = C.neck * W, r = C.rim * W, up = C.rimUp * W, th = C.thick * W;
  const profile = [
    new Vector3(n, up * 0.6, 0), new Vector3(n * 1.05, -th * 0.5, 0), new Vector3((n + r) / 2, -th * 0.45, 0), new Vector3(r, up - th * 0.25, 0),
    new Vector3(r * 1.02, up + th * 0.15, 0), new Vector3((n + r) / 2, th * 0.05, 0), new Vector3(n, up * 0.6, 0),
  ];
  const dish = MeshBuilder.CreateLathe("clamsCollarShell", { shape: profile, tessellation: C.segs, closed: true }, scene);
  dish.parent = root;
  dish.material = dark;
  dish.convertToFlatShadedMesh();
  const disc = MeshBuilder.CreateCylinder("clamsCollarInside", {
    height: th * 0.12, diameterTop: 2 * (r - C.lip * W), diameterBottom: 2 * n * 1.4, tessellation: C.segs,
  }, scene);
  disc.parent = root;
  disc.position.y = up * 0.55 + th * 0.06 - C.inset * W;
  disc.material = inside;
  disc.convertToFlatShadedMesh();
  const lip = MeshBuilder.CreateTorus("clamsCollarLip", { diameter: 2 * r * 1.01, thickness: C.lip * W, tessellation: C.segs }, scene);
  lip.parent = root;
  lip.position.y = up + th * 0.08;
  lip.material = pale;
  const out = [dish, disc, lip];
  for (const m of out) glow?.addExcludedMesh(m);
  return out;
}

/*
 * [S] 524 (a.3) the Bank Robbers' charcoal sleeves (secret.bank_robbers.blue.png: a dark charcoal shirt under the vest, its sleeves running up the raised
 * arms to a turned cuff below the elbow-to-wrist's end, a short strip of team skin between cuff and glove). BANK_SLEEVE: the upper arm mesh charcoal
 * under a full sleeve shell .out over it; on the forearm a sleeve over its top .fore with a turned cuff .cuff long flared .flare at its end, in .cuffShade
 * of the charcoal; the rest of the forearm stays team. Near-black lit cloth self-lit (LESSONS 494), out of the glow. Both men, not the safe actor.
 */
const BANK_SLEEVE = { out: 1.14, fore: 0.72, cuff: 0.18, flare: 1.5, cuffShade: 1.35, charcoal: new Color3(0.1, 0.095, 0.1) };
export function bankRobberSleeves(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = BANK_SLEEVE, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const cloth = mf.get("cloth", S.charcoal, { emissive: S.charcoal.scale(0.4), roughness: 1 });
  const cuffC = S.charcoal.scale(S.cuffShade);
  const cuffM = mf.get("cloth", cuffC, { emissive: cuffC.scale(0.4), roughness: 1 });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    arm.material = cloth;
    out.push(shirtSleeve(scene, arm, cloth, "bankSleeveUpper", 1.0, S.out, S.out));
  }
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(shirtSleeve(scene, arm, cloth, "bankSleeveFore", S.fore, S.out, S.out * 1.04));
    const cuff = shirtSleeve(scene, arm, cuffM, "bankSleeveCuff", S.cuff, S.flare * 0.9, S.flare);
    cuff.position.y -= arm.getBoundingInfo().boundingBox.extendSize.y * 2 * (S.fore - S.cuff);
    out.push(cuff);
  }
  for (const m of out) glow?.addExcludedMesh(m);
  return out;
}

/*
 * [S] 527 (a.4) the Bank Robbers' cowboy boots (secret.bank_robbers.png, .red.png: broad near-black boot shafts over the lower half of each shin,
 * their tops folded down into a wide turned cuff that flares out over the shaft). BANK_BOOT: the foot and a shaft .shaft of the shin tall .round of
 * its box in near-black; at the shaft's top a band .cuff round, and the turned fold hung from it, .turnH of the shin long, flaring from .turn to
 * .turnHem round downward, in .turnShade of the black. Near-black lit cloth self-lit .4 (LESSONS 494), out of the glow. Both men, not the safe actor.
 */
const BANK_BOOT = { shaft: 0.62, round: 1.42, cuff: 1.5, cuffH: 0.06, turn: 1.52, turnHem: 1.82, turnH: 0.17, turnShade: 1.3,
  black: new Color3(0.1, 0.08, 0.075) };
export function bankRobberBoots(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = BANK_BOOT, mf = getMaterialFactory();
  const black = mf.get("cloth", B.black, { emissive: B.black.scale(0.4), roughness: 1 });
  const turnC = B.black.scale(B.turnShade);
  const turnM = mf.get("cloth", turnC, { emissive: turnC.scale(0.4), roughness: 1 });
  const out = shinBoot(scene, body, "bankBoot", black, black, B);
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const { center: c, extendSize: s } = shin.getBoundingInfo().boundingBox;
    const top = c.y - s.y + s.y * 2 * B.shaft;
    out.push(legShell(scene, "bankBootTurn", shin, turnM, top + s.y * 0.02, top - s.y * 2 * B.turnH, B.turn, B.turnHem));
  }
  return out;
}

/*
 * [S] 527 (a.2) the Bank Robbers' vests (secret.bank_robbers.red.png, .blue.png: a fitted team vest closed down the front from the belt to a deep
 * V at the chest, the charcoal shirt showing in the V, a row of small grey buttons down the closing; straight sides, no flare at the waist).
 * BANK_VEST in the yoke's half-sizes, on the torso joint: back and side panels standing .out off the yoke from .top to .low of its height; the
 * front closed below the V's point (.vee of the height down from the top) and above it in .rows strips whose inner edges close from .open of
 * the half-width at the top to the middle at the point; .buttons grey buttons down the middle below the point. The torso and yoke take the
 * shirt's charcoal (BANK_SLEEVE) so the V shows it; the vest wears the body's team cloth. Out of the glow. Both men, not the safe actor.
 */
const BANK_VEST = { out: 1.08, thick: 0.08, top: 0.98, low: 0.95, vee: 0.46, open: 0.62, rows: 6, buttons: 4, grey: new Color3(0.42, 0.42, 0.44) };
export function bankRobberVest(scene: Scene, body: ArticulatedBody): Mesh[] {
  const V = BANK_VEST, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const vestM = body.torsoMesh.material as Material;
  const ch = BANK_SLEEVE.charcoal, shirt = mf.get("cloth", ch, { emissive: ch.scale(0.4), roughness: 1 });
  const yoke = body.allMeshes.find((m) => m.name.endsWith("_yoke")) ?? body.torsoMesh;
  for (const m of [body.torsoMesh, ...body.allMeshes.filter((x) => /_yoke$|_[lr]Pad$/.test(x.name))]) { m.material = shirt; glow?.addExcludedMesh(m); }
  const greyM = mf.get("cloth", V.grey, { emissive: V.grey.scale(0.2), roughness: 0.8 });
  const T = limbBox(yoke);
  const top = T.mid + T.half * V.top, low = T.mid - T.half * V.low, h = top - low, cy = (top + low) / 2;
  const wx = T.wide * V.out, dz = T.deep * V.out, th = T.deep * V.thick;
  const out: Mesh[] = [];
  const box = (name: string, w: number, hh: number, d: number, x: number, y: number, z: number, m: Material): Mesh => {
    const b = MeshBuilder.CreateBox(name, { width: w, height: hh, depth: d }, scene);
    b.parent = body.torso; b.position.set(x, y, z); b.material = m; glow?.addExcludedMesh(b); out.push(b);
    return b;
  };
  box("bankVestBack", wx * 2 + th, h, th, 0, cy, -dz, vestM);
  for (const side of [-1, 1]) box("bankVestSide", th, h, dz * 2 + th, side * wx, cy, 0, vestM);
  const point = top - h * V.vee;
  box("bankVestFront", wx * 2 + th, point - low, th, 0, (point + low) / 2, dz, vestM);
  const rowH = (top - point) / V.rows;
  for (let k = 0; k < V.rows; k++) {
    const t = (k + 0.5) / V.rows, gap = wx * V.open * (1 - t);
    const y = top - rowH * (k + 0.5), w = wx + th / 2 - gap;
    for (const side of [-1, 1]) box("bankVestLapel", w, rowH * 1.04, th, side * (gap + w / 2), y, dz, vestM);
  }
  for (let k = 0; k < V.buttons; k++) {
    const y = point - (point - low) * (0.14 + 0.24 * k);
    box("bankVestButton", T.wide * 0.1, T.half * 0.07, th * 1.2, 0, y, dz + th * 0.7, greyM);
  }
  return out;
}

/*
 * [S] 527 (a.2) the Skeleton Giant's Greek helmet (secret.skeleton_giant.red.png, .jpg: a team-coloured helmet that hoods the skull, a rounded bowl
 * over the crown, broad cheek guards down both sides framing the face to below the eyes, a back plate to the neck; the face open in the middle).
 * GIANT_HELM in the head box (W wide, H tall, D deep, c centre) and the bead eyes (eyeBoxInHead): a half-sphere bowl .bowl W across from .rim H over
 * the eye tops to .crown H over c; a back plate .backW W wide from the rim down .back H at the back; per side a side plate .sideD D long from the
 * rim down .side H, .sideX W out; and a cheek guard .cheekW W wide in front of the face just outside the eyes, from the rim to .under H under the
 * eye bottoms. Team in a deep shade (deepTeam .shade), lit cloth self-lit .12, out of the glow. The grey crown ball and its horns are hidden.
 */
/*
 * [S] 536 (a.2; CONFIRM 533 "rounded bucket helmet with boxy ear flaps and a front brim - TABS: a Corinthian-style team helmet that falls like a hood
 * to the shoulders, with long cheek guards framing the bone face"; secret.skeleton_giant.jpg, .blue.png: the helmet is one hood over the skull, its
 * sides and back running down past the jaw to the shoulders and flaring a little there; in front only a narrow open slot down the middle shows the
 * eyes and the bone nose and jaw, framed by two long cheek guards that come down from the brow past the jaw). The back and side plates gave way to
 * the hood: a 9-sided frustum from the bowl's foot down .hood H under the head's foot, .hoodTop W across at the top flaring to .hoodFoot W, .hoodD
 * of that deep, set back .hoodBack D so the face stands out of its open front; the cheek guards .cheekW W wide from the rim down to .under H under
 * the head's foot, turned in .cheekTurn rad, and a nasal-less open slot between them.
 */
const GIANT_HELM = { bowl: 1.26, rim: 0.03, crown: 0.66, hood: 0.62, hoodTop: 1.24, hoodFoot: 1.5, hoodD: 0.95, hoodBack: 0.36, cheekW: 0.3, under: 0.32,
  cheekTurn: 0.4, shade: 0.85 };
export function skeletonGiantHelm(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = GIANT_HELM, glow = scene.getGlowLayerByName("glow");
  for (const m of body.headTop.getChildMeshes(false)) if (/^(giantCrown|boneHorn)$/.test(m.name)) m.setEnabled(false);
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const eyes = eyeBoxInHead(body) ?? { lo: new Vector3(c.x - W * 0.3, c.y, c.z + D * 0.4), hi: new Vector3(c.x + W * 0.3, c.y + H * 0.15, c.z + D * 0.55) };
  const col = deepTeam(team, C.shade);
  const helm = getMaterialFactory().get("cloth", col, { emissive: col.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const put = (m: Mesh): Mesh => { m.parent = head; m.material = helm; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.position.set(x, y, z); return put(m);
  };
  const foot = eyes.hi.y + H * C.rim, crown = c.y + H * C.crown;
  const bowl = put(MeshBuilder.CreateSphere("giantHelmBowl", { diameter: 1, segments: 5, slice: 0.5 }, scene));
  bowl.scaling.set(W * C.bowl, (crown - foot) * 2, D * C.bowl); bowl.position.set(c.x, foot, c.z);
  // [S] 536 the hood falling from the bowl's foot to the shoulders, set back so the face stands out of its open front
  const hoodBot = c.y - H / 2 - H * C.hood, hoodH = foot - hoodBot;
  const hood = put(MeshBuilder.CreateCylinder("giantHelmHood", { height: hoodH, diameterTop: W * C.hoodTop, diameterBottom: W * C.hoodFoot, tessellation: 9 }, scene));
  hood.scaling.z = C.hoodD; hood.position.set(c.x, (foot + hoodBot) / 2, c.z - D * C.hoodBack);
  for (const side of [-1, 1]) {
    const ex = side < 0 ? eyes.lo.x : eyes.hi.x;
    const cheekBot = c.y - H / 2 - H * C.under, front = Math.max(eyes.lo.z, c.z + D / 2) + D * 0.02;
    const cheek = box("giantHelmCheek", W * C.cheekW, foot - cheekBot, D * 0.14, ex + side * (W * C.cheekW) / 2, (foot + cheekBot) / 2, front - D * 0.06);
    cheek.rotation.y = -side * C.cheekTurn;
  }
  return out;
}

/*
 * [S] 527 (a.1) the Cavalry knight's helmet (secret.cavalry.red.png, .png: a grey steel helm closing round the head, a brow band over the eyes,
 * a bevor plate over the mouth and chin below them so only the eyes show between, and a tall team crest running front to back over the crown).
 * CAV_HELM in the head box (W, H, D, c) and the bead eyes: a half-sphere bowl .bowl W across from .rim H over the eye tops to .crown H over c;
 * a back plate and two side plates from the rim down .side H; a brow band .browH H tall in front over the eyes; a bevor .bevorW W wide from .gap H
 * under the eye bottoms down .bevor H, with a ridge down its middle; a crest fin .crestH H tall and .crestL D long on the bowl's top. Steel in
 * pale lit cloth (metal renders near black), crest team self-lit .12, out of the glow. The hat's plain "helm" cup and "plume" are hidden.
 */
const CAV_HELM = { bowl: 1.24, rim: 0.02, crown: 0.62, side: 0.72, browH: 0.12, bevorW: 1.02, gap: 0.03, bevor: 0.42, crestH: 0.42, crestL: 1.05,
  steel: new Color3(0.5, 0.51, 0.54) };
export function cavalryHelm(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = CAV_HELM, glow = scene.getGlowLayerByName("glow"), mf = getMaterialFactory();
  for (const m of [...body.headTop.getChildMeshes(false), ...body.headMesh.getChildMeshes(false)]) if (/^(helm|plume)$/.test(m.name)) m.setEnabled(false);
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const eyes = eyeBoxInHead(body) ?? { lo: new Vector3(c.x - W * 0.3, c.y, c.z + D * 0.4), hi: new Vector3(c.x + W * 0.3, c.y + H * 0.15, c.z + D * 0.55) };
  const steel = mf.get("cloth", C.steel, { emissive: C.steel.scale(0.15), roughness: 0.9 });
  const crestM = mf.get("cloth", team, { emissive: team.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, mt: Material = steel): Mesh => { m.parent = head; m.material = mt; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, mt: Material = steel): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.position.set(x, y, z); return put(m, mt);
  };
  const foot = eyes.hi.y + H * C.rim, crown = c.y + H * C.crown;
  const bowl = put(MeshBuilder.CreateSphere("cavHelmBowl", { diameter: 1, segments: 6, slice: 0.5 }, scene));
  bowl.scaling.set(W * C.bowl, (crown - foot) * 2, D * C.bowl); bowl.position.set(c.x, foot, c.z);
  box("cavHelmBack", W * 1.16, H * C.side, D * 0.1, c.x, foot - (H * C.side) / 2, c.z - D * 0.57);
  for (const side of [-1, 1]) box("cavHelmSide", W * 0.1, H * C.side, D * 1.08, c.x + side * W * 0.6, foot - (H * C.side) / 2, c.z);
  const front = Math.max(eyes.hi.z, c.z + D / 2) + D * 0.03;
  box("cavHelmBrow", W * 1.18, H * C.browH, D * 0.1, c.x, foot + (H * C.browH) / 2 - H * 0.02, front);
  const top = eyes.lo.y - H * C.gap, bot = top - H * C.bevor;
  box("cavHelmBevor", W * C.bevorW, top - bot, D * 0.1, c.x, (top + bot) / 2, front);
  box("cavHelmRidge", W * 0.08, top - bot, D * 0.16, c.x, (top + bot) / 2, front + D * 0.04);
  box("cavHelmCrest", W * 0.1, H * C.crestH, D * C.crestL, c.x, crown + (H * C.crestH) / 2 - H * 0.06, c.z, crestM);
  return out;
}

/** Three sewn bands run diagonally from shoulder to opposite hip. */
export function cheerleaderSash(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const torso = body.torsoMesh;
  const { center, extendSize } = torso.getBoundingInfo().boundingBox;
  const c = torso.position.add(center.multiply(torso.scaling));
  const e = extendSize.multiply(torso.scaling);
  const from = c.add(new Vector3(-0.72 * e.x, -0.87 * e.y, 0.94 * e.z));
  const to = c.add(new Vector3(0.77 * e.x, 0.84 * e.y, 1.34 * e.z));
  const axis = to.subtract(from);
  const angle = Math.atan2(-axis.x, axis.y);
  const across = new Vector3(Math.cos(angle), Math.sin(angle), 0);
  const width = e.x * 0.19;
  const colors = [new Color3(0.54, 0.88, 0.92), team, new Color3(1, 0.51, 0.72)];
  return colors.map((color, index) => {
    const band = MeshBuilder.CreateBox("cheerSashBand", {
      width, height: axis.length(), depth: 0.15 * e.z,
    }, scene);
    band.parent = body.torso;
    band.position.copyFrom(Vector3.Center(from, to).add(across.scale((index - 1) * width)));
    band.rotation.set(Math.atan2(axis.z, Math.hypot(axis.x, axis.y)), 0, angle);
    band.material = getMaterialFactory().get("unlit", color, { emissive: color });
    scene.getGlowLayerByName("glow")?.addExcludedMesh(band);
    return band;
  });
}

/*
 * [S] 526 (a.2) the Raptor Rider's own head (secret.raptor_rider.red.png, .blue.png: the team face bare, brown hair parted over the crown and
 * falling straight to the shoulders either side of the face and down the back; audit "a grey-beige lumpy mask"). The bone mask is off (unitVisuals
 * hat none). RIDER_HAIR in head widths W, heights H, depths D (head box, centre c, front +z; e the eyes' top): a half-dome cap .capW W x .capD D
 * from .capLo H over e to .capTop H over c, .capBack D back; per side a lock tapering from .lockRoot W at the cap's side to .lockTip W at .lockLo H
 * under c, .lockX W out and .lockZ D forward (outside the eyes, framing the face); a back mass .backW W wide to .backLo H under c. Lit brown cloth
 * self-lit .3, out of the glow.
 */
const RIDER_HAIR = {
  capW: 1.14, capD: 1.12, capLo: 0.02, capTop: 0.56, capBack: 0.06, lockRoot: 0.3, lockTip: 0.22, lockLo: -0.62, lockX: 0.6, lockZ: 0.12,
  backW: 1.02, backLo: -0.6, brown: new Color3(0.2, 0.1, 0.05),
};
export function raptorRiderHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = RIDER_HAIR, glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const hair = getMaterialFactory().get("cloth", C.brown, { emissive: C.brown.scale(0.3), roughness: 1 });
  const out: Mesh[] = [];
  const lo = e + H * C.capLo, hi = c.y + H * C.capTop;
  const cap = MeshBuilder.CreateSphere("riderHairCap", { diameter: 1, segments: 4, slice: 0.5 }, scene);
  cap.parent = head; cap.scaling.set(W * C.capW, (hi - lo) * 2, D * C.capD); cap.position.set(c.x, lo, c.z - D * C.capBack); cap.material = hair; out.push(cap);
  for (const side of [-1, 1]) {
    const pts = [new Vector3(c.x + side * W * 0.54, lo + H * 0.04, c.z + D * C.lockZ), new Vector3(c.x + side * W * C.lockX, c.y - H * 0.1, c.z + D * C.lockZ),
      new Vector3(c.x + side * W * C.lockX * 1.04, c.y + H * C.lockLo, c.z + D * C.lockZ * 0.4)];
    taper(scene, "riderHairLock", pts, W * C.lockRoot, W * C.lockTip, head, hair, out);
  }
  const back = MeshBuilder.CreateBox("riderHairBack", { width: W * C.backW, height: hi - (c.y + H * C.backLo), depth: D * 0.3 }, scene);
  back.parent = head; back.position.set(c.x, (hi + c.y + H * C.backLo) / 2, c.z - D * 0.48); back.material = hair; out.push(back);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/*
 * [S] 526 (a.3) the Raptor Rider's feather headdress (secret.raptor_rider.red.png: a dark red-brown headband round the brow above the eyes, and from
 * its back an upright fan of six long dark green-black feathers standing over the crown). RIDER_FEATHERS in head units as RIDER_HAIR: a 10-sided band
 * .bandH H tall, .bandW W round (x D/W deep), its foot .over H over e; .count feathers, each a flat 4-sided spindle .long H long and .wide W wide,
 * rooted on the band's back half .back D behind c, fanned .fan rad from the upright across the fan, leaning .lean rad back. Band lit red-brown, the
 * feathers lit near-black green self-lit .3, all out of the glow; the fan's top stays under the head + .3 unit height (LESSONS 420).
 */
const RIDER_FEATHERS = { bandH: 0.14, bandW: 1.2, over: 0.04, count: 6, long: 0.78, wide: 0.13, back: 0.18, fan: 0.42, lean: 0.18,
  band: new Color3(0.3, 0.09, 0.05), green: new Color3(0.02, 0.09, 0.06) };
export function raptorRiderFeathers(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = RIDER_FEATHERS, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const bandM = mf.get("cloth", C.band, { emissive: C.band.scale(0.3), roughness: 1 });
  const green = mf.get("cloth", C.green, { emissive: C.green.scale(0.3), roughness: 1 });
  const out: Mesh[] = [];
  const by = e + H * C.over + H * C.bandH / 2;
  const band = MeshBuilder.CreateCylinder("riderHeadband", { height: H * C.bandH, diameter: W * C.bandW, tessellation: 10 }, scene);
  band.parent = head; band.position.set(c.x, by, c.z); band.scaling.z = D / W; band.material = bandM; out.push(band);
  for (let k = 0; k < C.count; k++) {
    const u = C.count > 1 ? k / (C.count - 1) - 0.5 : 0;
    const f = MeshBuilder.CreateCylinder("riderFeather", { height: H * C.long, diameterTop: 0, diameterBottom: W * C.wide, tessellation: 4 }, scene);
    f.parent = head; f.material = green; f.scaling.z = 0.3;
    const tilt = u * 2 * C.fan, len = H * C.long;
    f.rotation.set(-C.lean, 0, -tilt);
    const rootX = c.x + u * W * 0.5, rootY = by + H * C.bandH * 0.4, rootZ = c.z - D * C.back;
    f.position.set(rootX + Math.sin(tilt) * len * 0.5, rootY + Math.cos(tilt) * Math.cos(C.lean) * len * 0.5, rootZ - Math.sin(C.lean) * len * 0.5);
    out.push(f);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/*
 * [S] 526 (a.5) the Raptor Rider's fur loincloth (secret.raptor_rider.jpg, card Appearance "a fur loincloth": a bare team torso over a dark shaggy fur
 * wrap round the hips, ragged flaps hanging front and back to mid-thigh; ours wore a team box tunic). The tunic skirt is off for him (unitFactory).
 * RIDER_LOIN off the pelvis mesh's box (centre c, half size s): an 8-sided wrap .round of the pelvis round and .wrapH of its height tall at its top;
 * front and back flaps .flapW of its width wide hanging .flapL of the thigh's length below the wrap, each with .teeth ragged points along its hem;
 * pelvis mesh in the same fur. Near-black olive-grey lit fur self-lit .4 (LESSONS 494), out of the glow.
 */
const RIDER_LOIN = { round: 1.16, wrapH: 0.7, flapW: 0.8, flapL: 0.55, teeth: 4, fur: new Color3(0.07, 0.065, 0.05) };
export function raptorRiderLoincloth(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = RIDER_LOIN, glow = scene.getGlowLayerByName("glow");
  const pelvis = body.allMeshes.find((m) => m.name.endsWith("_pelvis"));
  if (!pelvis) return [];
  const fur = getMaterialFactory().get("cloth", C.fur, { emissive: C.fur.scale(0.4), roughness: 1 });
  const { center: c, extendSize: s } = pelvis.getBoundingInfo().boundingBox;
  const thighL = body.leftUpperLeg.getBoundingInfo().boundingBox.extendSize.y * 2;
  const out: Mesh[] = [];
  const wrapH = s.y * 2 * C.wrapH, top = c.y + s.y;
  const wrap = MeshBuilder.CreateCylinder("riderLoinWrap", { height: wrapH, diameterTop: s.x * 2 * C.round, diameterBottom: s.x * 2 * C.round * 1.08, tessellation: 8 }, scene);
  wrap.parent = pelvis; wrap.position.set(c.x, top - wrapH / 2, c.z); wrap.scaling.z = s.z / s.x; wrap.rotation.y = Math.PI / 8; wrap.material = fur; out.push(wrap);
  const flapW = s.x * 2 * C.flapW, flapL = thighL * C.flapL, flapTop = top - wrapH * 0.6;
  for (const side of [-1, 1]) {
    const flap = MeshBuilder.CreateBox("riderLoinFlap", { width: flapW, height: flapL, depth: s.z * 0.12 }, scene);
    flap.parent = pelvis; flap.material = fur;
    const z = c.z + side * s.z * C.round * 1.02;
    flap.position.set(c.x, flapTop - flapL / 2, z); flap.rotation.x = side * 0.12; out.push(flap);
    for (let k = 0; k < C.teeth; k++) {
      const tw = flapW / C.teeth;
      const tooth = MeshBuilder.CreateCylinder("riderLoinTooth", { height: flapL * 0.28, diameterTop: tw * 0.9, diameterBottom: 0, tessellation: 4 }, scene);
      tooth.parent = pelvis; tooth.material = fur; tooth.scaling.z = 0.25;
      tooth.position.set(c.x - flapW / 2 + tw * (k + 0.5), flapTop - flapL - flapL * 0.14 + (k % 2) * flapL * 0.06, z + side * flapL * 0.12 * 0.5);
      out.push(tooth);
    }
  }
  pelvis.material = fur;
  glow?.addExcludedMesh(pelvis);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/** The rider is bare-chested above the waist. */
export function bareRaptorRiderChest(body: ArticulatedBody): void {
  body.torsoMesh.material = body.skinMaterial;
  for (const mesh of body.allMeshes.filter((m) => m.name.endsWith("_yoke"))) mesh.material = body.skinMaterial;
  for (const arm of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm]) arm.material = body.skinMaterial;
}

/** Team cloth for the Infernal Whip's fitted shirt and short shoulder caps. */
export function infernalShirt(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const color = new Color3(team.r ** 2, team.g ** 2, team.b ** 2).scale(0.48);
  const cloth = getMaterialFactory().get("cloth", color, { emissive: color.scale(0.12), roughness: 1 });
  body.torsoMesh.material = cloth;
  for (const mesh of body.allMeshes.filter((m) => m.name.endsWith("_yoke"))) mesh.material = cloth;
  const out = [body.leftUpperArm, body.rightUpperArm].map((arm) =>
    shirtSleeve(scene, arm, cloth, "infernalShirtCap", 0.45, 1.35, 1.15));
  out.push(...infernalSleeves(scene, body, color));
  return out;
}
/*
 * [S] 524 (a.2) the Infernal Whip's long dark sleeves (secret.infernal_whip.red.png: his arms are sleeved in a dark team shade from the shoulder caps
 * to the wrist, darker on the forearm, a turned cuff at the wrist, only the hands bare). INFERNAL_SLEEVE: the arm meshes themselves take the shirt's
 * shade (upper) and .fore of it (forearm), each covered by a full tapered sleeve shell .out over the limb, and a cuff ring .cuff long flared .flare
 * at the wrist end of the forearm, .cuffShade of the shirt. Out of the glow.
 */
const INFERNAL_SLEEVE = { out: 1.12, fore: 0.62, cuff: 0.2, flare: 1.42, cuffShade: 0.4 };
function infernalSleeves(scene: Scene, body: ArticulatedBody, shirt: Color3): Mesh[] {
  const S = INFERNAL_SLEEVE, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const upper = mf.get("cloth", shirt, { emissive: shirt.scale(0.12), roughness: 1 });
  const foreC = shirt.scale(S.fore), cuffC = shirt.scale(S.cuffShade);
  const fore = mf.get("cloth", foreC, { emissive: foreC.scale(0.12), roughness: 1 });
  const cuffM = mf.get("cloth", cuffC, { emissive: cuffC.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    arm.material = upper;
    out.push(shirtSleeve(scene, arm, upper, "infernalSleeveUpper", 1.0, S.out, S.out));
  }
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    arm.material = fore;
    out.push(shirtSleeve(scene, arm, fore, "infernalSleeveFore", 1.0, S.out, S.out * 1.05));
    const cuff = shirtSleeve(scene, arm, cuffM, "infernalSleeveCuff", S.cuff, S.flare * 0.92, S.flare);
    cuff.position.y -= arm.getBoundingInfo().boundingBox.extendSize.y * 2 * (1 - S.cuff);
    out.push(cuff);
  }
  for (const m of out) glow?.addExcludedMesh(m);
  return out;
}

/*
 * [S] 524 (a.2) the Ice Mage's sash (secret.ice_mage.red.png: a team-coloured sash round the waist where the bib meets the skirt, a round teal brooch in
 * a gold rim at its front, a broad team tail hanging from under the brooch half way down the skirt). ICE_SASH in torso half-sizes, on the torso joint
 * at the skirt's top: a band .tall high and .out wide (squashed as the skirt, .depth), a gold ring .brooch across and a teal boss inside it standing
 * off the band's front, and a tail .tailW wide hanging .tail down from the brooch, flaring .flare to its end. Team in a deep shade (team squared),
 * teal and gold unlit; all out of the glow.
 */
const ICE_SASH = { tall: 0.22, out: 1.12, depth: 1.28, brooch: 0.42, tailW: 0.42, tail: 0.95, flare: 1.35,
  teal: new Color3(0.2, 0.62, 0.58), gold: new Color3(0.62, 0.3, 0.05) };
export function iceMageSash(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const S = ICE_SASH, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const torso = body.torsoMesh, bounds = torso.getBoundingInfo().boundingBox;
  const center = torso.position.add(bounds.center.multiply(torso.scaling));
  const size = bounds.extendSize.multiply(torso.scaling);
  const peak = Math.max(team.r, team.g, team.b), sat = new Color3(team.r ** 2, team.g ** 2, team.b ** 2);
  const deep = sat.scale(peak / Math.max(sat.r, sat.g, sat.b, 1e-3) * 0.85);
  const cloth = mf.get("cloth", deep, { emissive: deep.scale(0.12), roughness: 1 });
  const teal = mf.get("unlit", S.teal, { emissive: S.teal });
  const gold = mf.get("unlit", S.gold, { emissive: S.gold });
  const waist = center.y - size.y * 0.78;
  const zScale = Math.max(0.75, size.z / size.x * S.depth);
  const out: Mesh[] = [];
  const band = MeshBuilder.CreateCylinder("iceMageSash", { height: size.y * S.tall, diameter: 2 * size.x * S.out, tessellation: 10 }, scene);
  band.parent = body.torso; band.position.set(center.x, waist, center.z); band.scaling.z = zScale; band.material = cloth;
  band.convertToFlatShadedMesh();
  out.push(band);
  const front = center.z + size.x * S.out * zScale;
  const r = size.x * S.brooch / 2;
  const ring = MeshBuilder.CreateTorus("iceMageSashBroochRim", { diameter: r * 2, thickness: r * 0.4, tessellation: 12 }, scene);
  ring.parent = body.torso; ring.position.set(center.x, waist, front + r * 0.15); ring.rotation.x = Math.PI / 2; ring.material = gold;
  const boss = MeshBuilder.CreateCylinder("iceMageSashBrooch", { height: r * 0.35, diameter: r * 1.7, tessellation: 10 }, scene);
  boss.parent = body.torso; boss.position.set(center.x, waist, front + r * 0.2); boss.rotation.x = Math.PI / 2; boss.material = teal;
  const tailLen = size.y * S.tail, tw = size.x * S.tailW;
  const tail = MeshBuilder.CreateCylinder("iceMageSashTail", { height: tailLen, diameterTop: tw, diameterBottom: tw * S.flare, tessellation: 4 }, scene);
  tail.parent = body.torso; tail.material = cloth;
  tail.position.set(center.x, waist - size.y * S.tall * 0.4 - tailLen / 2, front - r * 0.1);
  tail.scaling.z = 0.18; tail.rotation.x = -0.08;
  tail.convertToFlatShadedMesh();
  out.push(ring, boss, tail);
  for (const m of out) glow?.addExcludedMesh(m);
  return out;
}

/** The pinafore's brown-red bib and straps meet a flared, thigh-length skirt. */
export function iceMagePinafore(scene: Scene, body: ArticulatedBody): Mesh[] {
  const torso = body.torsoMesh;
  const bounds = torso.getBoundingInfo().boundingBox;
  const center = torso.position.add(bounds.center.multiply(torso.scaling));
  const size = bounds.extendSize.multiply(torso.scaling);
  const color = new Color3(0.29, 0.10, 0.12);
  const cloth = getMaterialFactory().get("cloth", color, { emissive: color.scale(0.2), roughness: 1 });
  const top = center.y - size.y * 0.78;
  const knee = (originIn(body.leftKnee, body.torso).y + originIn(body.rightKnee, body.torso).y) / 2;
  // [S] 525 (a.3): the skirt stops .58 of the way to the knee (was .72), so the dark shorts show below it as in secret.ice_mage.blue.png
  const hem = top + (knee - top) * 0.58;
  const skirt = MeshBuilder.CreateLathe("iceMagePinaforeSkirt", {
    shape: [new Vector3(size.x * 1.37, hem, 0), new Vector3(size.x * 1.22, hem + (top - hem) * 0.45, 0), new Vector3(size.x * 1.02, top, 0)],
    tessellation: 10,
  }, scene);
  skirt.parent = body.torso;
  skirt.position.set(center.x, 0, center.z);
  skirt.scaling.z = Math.max(0.75, size.z / size.x * 1.28);
  skirt.material = cloth;
  skirt.convertToFlatShadedMesh();
  const bib = MeshBuilder.CreateBox("iceMagePinaforeBib", {
    width: size.x * 1.48, height: size.y * 1.16, depth: size.z * 0.44,
  }, scene);
  bib.parent = body.torso;
  bib.position.set(center.x, center.y - size.y * 0.29, center.z + size.z * 0.9);
  bib.material = cloth;
  const out = [skirt, bib];
  for (const side of [-1, 1]) {
    const strap = MeshBuilder.CreateBox("iceMagePinaforeStrap", {
      width: size.x * 0.23, height: size.y * 0.92, depth: size.z * 0.36,
    }, scene);
    strap.parent = body.torso;
    strap.position.set(center.x + side * size.x * 0.57, center.y + size.y * 0.57, center.z + size.z * 1.04);
    strap.rotation.z = -side * 0.16;
    strap.material = cloth;
    out.push(strap);
  }
  const brass = new Color3(0.8, 0.43, 0.12);
  const gold = getMaterialFactory().get("cloth", brass, { emissive: brass.scale(0.18), roughness: 0.8 });
  const glow = scene.getGlowLayerByName("glow");
  const studY = center.y + size.y * 0.24;
  const studZ = center.z + size.z * 1.25;
  for (const side of [-1, 1]) {
    const stud = MeshBuilder.CreateIcoSphere("iceMageStrapStud", { radius: size.x * 0.15, subdivisions: 1 }, scene);
    stud.parent = body.torso;
    stud.position.set(center.x + side * size.x * 0.61, studY, studZ);
    stud.scaling.z = 0.6;
    stud.material = gold;
    glow?.addExcludedMesh(stud);
    out.push(stud);
  }
  for (let index = 0; index < 11; index++) {
    const offset = (index - 5) / 5;
    const link = MeshBuilder.CreateTorus("iceMageBibChainLink", {
      diameter: size.x * 0.15, thickness: size.x * 0.048, tessellation: 8,
    }, scene);
    link.parent = body.torso;
    link.position.set(center.x + offset * size.x * 0.59, studY - size.y * (0.56 - 0.51 * offset ** 2), studZ);
    link.rotation.set(Math.PI * (index % 2 ? 0.32 : 0.5), 0, offset * 0.65);
    link.material = gold;
    glow?.addExcludedMesh(link);
    out.push(link);
  }
  return out;
}

/** Pale frost gathers around each fist in one large core and small satellites. */
export function iceMageFrostHands(scene: Scene, body: ArticulatedBody): Mesh[] {
  const color = new Color3(0.57, 0.88, 1);
  const frost = getMaterialFactory().get("unlit", color, { emissive: color.scale(1.35) });
  const radius = body.headMesh.getBoundingInfo().boundingBox.extendSize.x;
  const out: Mesh[] = [];
  for (const [hand, side] of [[body.leftHand, -1], [body.rightHand, 1]] as const) {
    const core = MeshBuilder.CreateIcoSphere("iceMageFrostCore", { radius: radius * (side < 0 ? 0.49 : 0.72), subdivisions: 2 }, scene);
    core.parent = hand;
    core.position.set(side * radius * 0.42, -radius * 0.33, radius * 0.29);
    core.material = frost;
    out.push(core);
    for (let index = 0; index < 4; index++) {
      const angle = index * Math.PI / 2 + side * 0.4;
      const shard = MeshBuilder.CreateIcoSphere("iceMageFrostBead", { radius: radius * (0.11 + index * 0.024), subdivisions: 1 }, scene);
      shard.parent = hand;
      shard.position.copyFrom(core.position.add(new Vector3(Math.cos(angle) * 0.85, Math.sin(angle) * 0.85, 0.3).scale(radius)));
      shard.material = frost;
      out.push(shard);
    }
  }
  return out;
}

/*
 * [S] 524 (a.2) the Present Elf's open vest (secret.present_elf.png: a team vest open down the front over the cream shirt, cream piping along its open
 * edges, three green toggles on one side and three orange pegs on the other; its sides and back closed). ELF_VEST in torso half-sizes, on the torso
 * joint: a back panel and two side panels standing .out off the torso, and two front panels .front wide each from the sides in, leaving the shirt
 * bare between them; a cream strip .trim wide down each front panel's inner edge; .toggles toggles a side, green bars on one and orange pegs on the
 * other. From .top to .low of the torso's height. Team in a deep shade (team squared, as the present), cream unlit; all out of the glow.
 */
const ELF_VEST = { out: 1.07, front: 0.6, thick: 0.08, trim: 0.1, top: 0.98, low: 0.86, toggles: 3,
  cream: new Color3(0.9, 0.86, 0.74), green: new Color3(0.04, 0.42, 0.17), orange: new Color3(0.85, 0.36, 0.07) };
export function presentElfVest(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const V = ELF_VEST, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  // [S] 525: the body's team yoke wraps the torso and filled the vest's opening; it takes the shirt's cream, and the vest stands off the yoke
  const yoke = body.allMeshes.find((m) => m.name.endsWith("_yoke")) ?? body.torsoMesh;
  for (const m of body.allMeshes.filter((x) => /_yoke$|_[lr]Pad$/.test(x.name))) { m.material = body.torsoMesh.material; glow?.addExcludedMesh(m); }
  const T = limbBox(yoke);
  const peak = Math.max(team.r, team.g, team.b), sat = new Color3(team.r ** 2, team.g ** 2, team.b ** 2);
  const deep = sat.scale(peak / Math.max(sat.r, sat.g, sat.b, 1e-3) * 0.8);
  const vestM = mf.get("cloth", deep, { emissive: deep.scale(0.12), roughness: 1 });
  const creamM = mf.get("unlit", V.cream, { emissive: V.cream });
  const greenM = mf.get("cloth", V.green, { emissive: V.green.scale(0.15), roughness: 1 });
  const orangeM = mf.get("cloth", V.orange, { emissive: V.orange.scale(0.15), roughness: 1 });
  const top = T.mid + T.half * V.top, low = T.mid - T.half * V.low, h = top - low, cy = (top + low) / 2;
  const wx = T.wide * V.out, dz = T.deep * V.out, th = T.deep * V.thick;
  const out: Mesh[] = [];
  const box = (name: string, w: number, hh: number, d: number, x: number, y: number, z: number, m: Material): Mesh => {
    const b = MeshBuilder.CreateBox(name, { width: w, height: hh, depth: d }, scene);
    b.parent = body.torso; b.position.set(x, y, z); b.material = m; glow?.addExcludedMesh(b); out.push(b);
    return b;
  };
  box("elfVestBack", wx * 2 + th, h, th, 0, cy, -dz, vestM);
  const fw = T.wide * V.front;
  for (const side of [-1, 1]) {
    box("elfVestSide", th, h, dz * 2 + th, side * wx, cy, 0, vestM);
    const fx = side * (wx - fw / 2);
    box("elfVestFront", fw, h, th, fx, cy, dz, vestM);
    const inner = side * (wx - fw);
    box("elfVestTrim", T.wide * V.trim, h, th * 1.3, inner + side * T.wide * V.trim / 2, cy, dz + th * 0.2, creamM);
    for (let k = 0; k < V.toggles; k++) {
      const y = top - h * (0.22 + 0.24 * k);
      const peg = side < 0
        ? box("elfVestToggle", T.wide * 0.26, T.half * 0.07, th * 1.6, inner + side * T.wide * 0.05, y, dz + th * 0.9, greenM)
        : box("elfVestPeg", T.wide * 0.16, T.half * 0.06, th * 1.6, inner + side * T.wide * 0.16, y, dz + th * 0.9, orangeM);
      peg.rotation.z = side * 0.25;
    }
  }
  return out;
}

/** Cream undershirt with bell sleeves that finish at the wrists. */
export function presentElfShirt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const color = new Color3(0.9, 0.8, 0.64);
  const cloth = getMaterialFactory().get("unlit", color, { emissive: color });
  const glow = scene.getGlowLayerByName("glow");
  body.torsoMesh.material = cloth;
  glow?.addExcludedMesh(body.torsoMesh);
  const arms = [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm];
  return arms.map((arm, index) => {
    arm.material = cloth;
    glow?.addExcludedMesh(arm);
    return shirtSleeve(scene, arm, cloth, "elfShirtSleeve", 1.0, 1.26, index < 2 ? 1.2 : 1.65);
  });
}

/** An 8-sided cloth shell round a leg limb, from local y `topY` down to `hemY` of the limb mesh, `round` (top) and `hemRound` of its box wide. */
function legShell(scene: Scene, name: string, limb: Mesh, material: Material, topY: number, hemY: number, round: number, hemRound = round): Mesh {
  const { center: c, extendSize: s } = limb.getBoundingInfo().boundingBox;
  const shell = MeshBuilder.CreateCylinder(name, { height: topY - hemY, diameterTop: s.x * 2 * round, diameterBottom: s.x * 2 * hemRound, tessellation: 8 }, scene);
  shell.parent = limb; shell.position.set(c.x, (topY + hemY) / 2, c.z);
  shell.scaling.z = s.z / s.x; shell.rotation.y = Math.PI / 8;
  shell.material = material; shell.convertToFlatShadedMesh();
  scene.getGlowLayerByName("glow")?.addExcludedMesh(shell);
  return shell;
}

/** A team colour saturated (squared, renormalised to its own peak) and scaled by k: TABS's deep team cloth (LESSONS 517). */
function deepTeam(team: Color3, k: number): Color3 {
  const peak = Math.max(team.r, team.g, team.b), sat = new Color3(team.r ** 2, team.g ** 2, team.b ** 2);
  return sat.scale(peak / Math.max(sat.r, sat.g, sat.b, 1e-3) * k);
}

/*
 * [S] 525 (a.3) the Present Elf's green trousers (secret.present_elf.png, .blue.png: straight green trousers from the belt to the boots on both
 * teams; ours had team legs). ELF_TROUSER: per thigh an 8-sided shell .thigh of its box round over its whole length, per shin one .shin round to
 * its foot end; thighs, shins and pelvis re-clothed in the same green (own lit cloth, self-lit .selfLit, out of the glow). The tunic skirt is off
 * for him (unitFactory), so the trousers run up to the vest.
 */
const ELF_TROUSER = { thigh: 1.14, shin: 1.12, selfLit: 0.25, green: new Color3(0.03, 0.36, 0.15) };
export function presentElfTrousers(scene: Scene, body: ArticulatedBody): Mesh[] {
  const E = ELF_TROUSER, glow = scene.getGlowLayerByName("glow");
  const green = getMaterialFactory().get("cloth", E.green, { emissive: E.green.scale(E.selfLit), roughness: 1 });
  const out: Mesh[] = [];
  for (const [limb, shin] of [[body.leftUpperLeg, false], [body.rightUpperLeg, false], [body.leftLowerLeg, true], [body.rightLowerLeg, true]] as const) {
    const { center: c, extendSize: s } = limb.getBoundingInfo().boundingBox;
    out.push(legShell(scene, shin ? "elfTrouserShin" : "elfTrouserThigh", limb, green, c.y + s.y, c.y - s.y, shin ? E.shin : E.thigh));
    limb.material = green; glow?.addExcludedMesh(limb);
  }
  const pelvis = body.allMeshes.find((m) => m.name.endsWith("_pelvis"));
  if (pelvis) { pelvis.material = green; glow?.addExcludedMesh(pelvis); }
  return out;
}

/*
 * [S] 525 (a.3) the Ice Mage's dark shorts (secret.ice_mage.blue.png: deep team shorts from under the pinafore skirt to just above the knee, the
 * team shins bare below them). ICE_SHORTS: per thigh an 8-sided shell from its box top down to .hem above the knee joint (anchored on the knee,
 * LESSONS 512), .round of the box round at the hip, .hemRound at the hem; thighs and pelvis in the same deep team cloth (team saturated x .deep,
 * self-lit .12), so the secret_ice tint is off them. Out of the glow.
 */
/*
 * [S] 526 (a.5) the Ice Mage's team sleeves (secret.ice_mage.blue.png: a deep team undershirt whose full sleeves run from the pinafore straps to the
 * wrists, flaring a little at a turned cuff; her face and hands plain team skin). The secret_ice tint is off (unitVisuals: default preset), so skin
 * and body are the team's. ICE_SLEEVE: the upper arm under a full shell .out round; the forearm under a shell over its top .fore, then a cuff .cuff
 * long flaring .flare; team saturated x .deep, self-lit .12 (LESSONS 517), its own material (LESSONS 449). Out of the glow.
 */
const ICE_SLEEVE = { out: 1.16, fore: 0.8, cuff: 0.16, flare: 1.42, deep: 0.72 };
export function iceMageSleeves(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const S = ICE_SLEEVE, glow = scene.getGlowLayerByName("glow");
  const c = deepTeam(team, S.deep);
  const cloth = getMaterialFactory().get("cloth", c, { emissive: c.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    arm.material = cloth;
    out.push(shirtSleeve(scene, arm, cloth, "iceSleeveUpper", 1.0, S.out, S.out));
  }
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(shirtSleeve(scene, arm, cloth, "iceSleeveFore", S.fore, S.out, S.out * 1.05));
    const cuff = shirtSleeve(scene, arm, cloth, "iceSleeveCuff", S.cuff, S.flare * 0.88, S.flare);
    cuff.position.y -= arm.getBoundingInfo().boundingBox.extendSize.y * 2 * (S.fore - S.cuff);
    out.push(cuff);
  }
  for (const m of out) glow?.addExcludedMesh(m);
  return out;
}

const ICE_SHORTS = { hem: 0.035, round: 1.2, hemRound: 1.26, deep: 0.42 };
export function iceMageShorts(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const S = ICE_SHORTS, glow = scene.getGlowLayerByName("glow");
  const deep = deepTeam(team, S.deep);
  const cloth = getMaterialFactory().get("cloth", deep, { emissive: deep.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  for (const [thigh, knee] of [[body.leftUpperLeg, body.leftKnee], [body.rightUpperLeg, body.rightKnee]] as const) {
    const { center: c, extendSize: s } = thigh.getBoundingInfo().boundingBox;
    const hemY = knee.position.y - thigh.position.y + S.hem;
    out.push(legShell(scene, "iceMageShorts", thigh, cloth, c.y + s.y, hemY, S.round, S.hemRound));
  }
  const pelvis = body.allMeshes.find((m) => m.name.endsWith("_pelvis"));
  if (pelvis) { pelvis.material = cloth; glow?.addExcludedMesh(pelvis); }
  return out;
}

/*
 * [S] 525 (a.5) CLAMS' tan trousers and rope belt (secret.clams.blue.png: straight tan trousers from the waist to the boots, a pale rust rope
 * twice round the waist tied in a front knot with two ends hanging to mid-thigh; card Appearance "a rope around its pants that acts as a belt").
 * CLAM_TROUSER: per thigh and shin an 8-sided shell .thigh/.shin of its box round over its whole length; thighs, shins and pelvis in tan cloth
 * (own lit cloth, out of the glow). The rope: the body's waist belt re-clothed in rope cloth, a second rope ring .ring of the belt box round
 * just under it, a knot block at the front and two ends .tail of the thigh long, splayed .splay. The tunic skirt is off for him (unitFactory).
 */
const CLAM_TROUSER = { thigh: 1.12, shin: 1.1, ring: 1.08, ringH: 0.42, knot: 0.32, tail: 0.42, splay: 0.2,
  tan: new Color3(0.72, 0.5, 0.3), rope: new Color3(0.78, 0.42, 0.28) };
export function clamsTrousers(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CLAM_TROUSER, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const tan = mf.get("cloth", C.tan, { emissive: C.tan.scale(0.18), roughness: 1 });
  const rope = mf.get("cloth", C.rope, { emissive: C.rope.scale(0.2), roughness: 1 });
  const out: Mesh[] = [];
  for (const [limb, shin] of [[body.leftUpperLeg, false], [body.rightUpperLeg, false], [body.leftLowerLeg, true], [body.rightLowerLeg, true]] as const) {
    const { center: c, extendSize: s } = limb.getBoundingInfo().boundingBox;
    out.push(legShell(scene, shin ? "clamsTrouserShin" : "clamsTrouserThigh", limb, tan, c.y + s.y, c.y - s.y, shin ? C.shin : C.thigh));
    limb.material = tan; glow?.addExcludedMesh(limb);
  }
  const pelvis = body.allMeshes.find((m) => m.name.endsWith("_pelvis"));
  if (pelvis) { pelvis.material = tan; glow?.addExcludedMesh(pelvis); }
  const belt = body.allMeshes.find((m) => m.name.endsWith("_belt"));
  if (belt) {
    belt.material = rope; glow?.addExcludedMesh(belt);
    const { center: c, extendSize: s } = belt.getBoundingInfo().boundingBox;
    const ring = MeshBuilder.CreateCylinder("clamsRopeRing", { height: s.y * 2 * C.ringH, diameter: s.x * 2 * C.ring, tessellation: 10 }, scene);
    ring.parent = belt; ring.position.set(c.x, c.y - s.y * (1 + C.ringH * 0.6), c.z); ring.scaling.z = s.z / s.x;
    ring.material = rope; out.push(ring);
    const front = c.z + s.z * C.ring;
    const knot = MeshBuilder.CreateBox("clamsRopeKnot", { width: s.x * C.knot * 1.2, height: s.y * 2 * C.knot * 1.6, depth: s.z * C.knot }, scene);
    knot.parent = belt; knot.position.set(c.x, c.y - s.y * 0.3, front + s.z * C.knot * 0.3); knot.rotation.z = 0.5;
    knot.material = rope; out.push(knot);
    const thigh = body.leftUpperLeg.getBoundingInfo().boundingBox.extendSize.y * 2;
    for (const side of [-1, 1]) {
      const len = thigh * C.tail * (side < 0 ? 1 : 0.85);
      const end = MeshBuilder.CreateCylinder("clamsRopeEnd", { height: len, diameterTop: s.x * 0.16, diameterBottom: s.x * 0.12, tessellation: 6 }, scene);
      end.parent = belt; end.material = rope;
      end.position.set(c.x + side * (s.x * 0.12 + Math.sin(C.splay) * len / 2), c.y - s.y * 0.5 - Math.cos(C.splay) * len / 2, front + s.z * C.knot * 0.35);
      end.rotation.z = side * C.splay;
      out.push(end);
    }
  }
  for (const m of out) if (m.name.startsWith("clamsRope")) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * A boot: the foot mesh re-clothed in `boot`, a shaft over the shin's foot end `shaft` of its length tall and `round` of its box round, and a cuff
 * band `cuffH` of the shin long at the shaft's top, `cuff` round, in `cuffMat`. Returns the shaft and cuff meshes (flat shaded, out of the glow).
 */
function shinBoot(scene: Scene, body: ArticulatedBody, name: string, boot: Material, cuffMat: Material,
  B: { shaft: number; round: number; cuff: number; cuffH: number }): Mesh[] {
  const glow = scene.getGlowLayerByName("glow"), out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const { center: c, extendSize: s } = shin.getBoundingInfo().boundingBox;
    const foot = c.y - s.y, top = foot + s.y * 2 * B.shaft, cuffLen = s.y * 2 * B.cuffH;
    out.push(legShell(scene, `${name}Shaft`, shin, boot, top, foot, B.round, B.round * 1.04));
    out.push(legShell(scene, `${name}Cuff`, shin, cuffMat, top + cuffLen * 0.35, top - cuffLen * 0.65, B.cuff, B.cuff * 0.94));
  }
  for (const foot of body.allMeshes.filter((m) => /_[lr]FootM$/.test(m.name))) { foot.material = boot; glow?.addExcludedMesh(foot); }
  return out;
}

/*
 * [S] 525 (a.6) CLAMS' boots (secret.clams.red.png, .blue.png: dark brown boots with a wide rust rope wrap round the ankle and lower shin; card
 * Appearance "shoes with ropes around them"). CLAM_BOOT: the foot in brown, a brown shaft .shaft of the shin tall (the foot box is ~.34 of it), a rust rope cuff .cuff round at
 * its top, and two thin rope rings wound below it. Lit cloth, out of the glow.
 */
const CLAM_BOOT = { shaft: 0.45, round: 1.28, cuff: 1.62, cuffH: 0.13, wraps: 2, wrap: 1.46,
  brown: new Color3(0.26, 0.11, 0.06), rust: new Color3(0.62, 0.24, 0.12) };
export function clamsBoots(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CLAM_BOOT, mf = getMaterialFactory();
  const brown = mf.get("cloth", C.brown, { emissive: C.brown.scale(0.3), roughness: 1 });
  const rust = mf.get("cloth", C.rust, { emissive: C.rust.scale(0.2), roughness: 1 });
  const out = shinBoot(scene, body, "clamsBoot", brown, rust, C);
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const { center: c, extendSize: s } = shin.getBoundingInfo().boundingBox;
    for (let k = 0; k < C.wraps; k++) {
      const y = c.y - s.y + s.y * 2 * C.shaft * (0.6 + k * 0.2);
      out.push(legShell(scene, "clamsBootWrap", shin, rust, y + s.y * 0.035, y - s.y * 0.035, C.wrap));
    }
  }
  return out;
}

/*
 * [S] 525 (a.4) the Present Elf's black boots (secret.present_elf.red.png, .png: black boots to mid-shin over the green trousers, their tops a
 * little wider). ELF_BOOT: the foot in near-black, a shaft .shaft of the shin tall (over the trouser shell), a flared top band. Near-black lit cloth
 * self-lit .4 (LESSONS 494), out of the glow.
 */
const ELF_BOOT = { shaft: 0.55, round: 1.36, cuff: 1.52, cuffH: 0.09, black: new Color3(0.08, 0.06, 0.07) };
export function presentElfBoots(scene: Scene, body: ArticulatedBody): Mesh[] {
  const black = getMaterialFactory().get("cloth", ELF_BOOT.black, { emissive: ELF_BOOT.black.scale(0.4), roughness: 1 });
  return shinBoot(scene, body, "elfBoot", black, black, ELF_BOOT);
}

/*
 * [S] 525 (a.4) the Ice Mage's fur-cuffed boots (secret.ice_mage.red.png, .blue.png: brown-red ankle boots under a thick cream fur cuff round the
 * lower shin, the team shin bare above it). ICE_BOOT: the foot in the pinafore's brown-red, a shaft .shaft of the shin tall, and a fur cuff
 * .cuff round and .cuffH of the shin tall at its top in unlit cream (LESSONS 442), out of the glow.
 */
const ICE_BOOT = { shaft: 0.42, round: 1.3, cuff: 1.78, cuffH: 0.17, red: new Color3(0.29, 0.1, 0.12), fur: new Color3(0.82, 0.76, 0.6) };
export function iceMageBoots(scene: Scene, body: ArticulatedBody): Mesh[] {
  const mf = getMaterialFactory();
  const red = mf.get("cloth", ICE_BOOT.red, { emissive: ICE_BOOT.red.scale(0.2), roughness: 1 });
  const fur = mf.get("unlit", ICE_BOOT.fur, { emissive: ICE_BOOT.fur });
  return shinBoot(scene, body, "iceMageBoot", red, fur, ICE_BOOT);
}

/*
 * [S] 525 (a.3) the Infernal Whip's magma armbands (secret.infernal_whip.blue.png, .red.png: a dark rock plate over each shoulder with a short spike,
 * and a dark rock band round the upper arm, both split by bright orange glowing cracks). MAGMA_BAND in the upper arm's box (centre c, half size s,
 * the shoulder end +y): a pauldron, a flat ico .pad of the box round and .padH of its length tall over the shoulder end, a spike cone .spike long
 * up and out of it; a band .bandH of the arm long and .band round, its middle .bandAt down the arm from the shoulder (outside the 524 sleeve, out
 * 1.12, and the shirt cap, 1.35); .cracks thin magma slivers round each, standing proud of the rock. Rock near-black lit self-lit .4 (ROCK_HAIR),
 * cracks unlit magma (ROCK_HAIR) left in the glow so they bloom.
 */
const MAGMA_BAND = { pad: 1.85, padH: 0.42, spike: 0.32, band: 1.5, bandH: 0.2, bandAt: 0.55, cracks: 4, crackW: 0.16, tilt: 0.45 };
export function infernalArmbands(scene: Scene, body: ArticulatedBody): Mesh[] {
  const M = MAGMA_BAND, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const rock = mf.get("cloth", ROCK_HAIR.rock, { emissive: ROCK_HAIR.rock.scale(0.4), roughness: 1 });
  const magma = mf.get("unlit", ROCK_HAIR.magma, { emissive: ROCK_HAIR.magma });
  const out: Mesh[] = [];
  for (const [arm, side] of [[body.leftUpperArm, -1], [body.rightUpperArm, 1]] as const) {
    const { center: c, extendSize: s } = arm.getBoundingInfo().boundingBox;
    const L = s.y * 2, zs = s.z / s.x;
    const crackRing = (y: number, r: number, h: number, n: number, phase: number) => {
      for (let k = 0; k < n; k++) {
        const a = phase + (k / n) * Math.PI * 2;
        const crack = MeshBuilder.CreateBox("infernalMagmaCrack", { width: r * M.crackW, height: h, depth: r * 0.08 }, scene);
        crack.parent = arm; crack.material = magma;
        crack.position.set(c.x + Math.cos(a) * r * 1.02, y, c.z + Math.sin(a) * r * zs * 1.02);
        crack.rotation.set(0, Math.PI / 2 - a, (k % 2 ? 1 : -1) * M.tilt);
        out.push(crack);
      }
    };
    const top = c.y + s.y;
    const pad = MeshBuilder.CreateIcoSphere("infernalPauldron", { radius: 0.5, subdivisions: 1, flat: true }, scene);
    pad.parent = arm; pad.material = rock; glow?.addExcludedMesh(pad);
    pad.scaling.set(s.x * 2 * M.pad, L * M.padH, s.z * 2 * M.pad);
    pad.position.set(c.x, top - L * M.padH * 0.25, c.z);
    out.push(pad);
    const spike = MeshBuilder.CreateCylinder("infernalPauldronSpike", { height: L * M.spike, diameterTop: 0, diameterBottom: s.x * 0.7, tessellation: 5 }, scene);
    spike.parent = arm; spike.material = rock; glow?.addExcludedMesh(spike);
    spike.position.set(c.x + side * s.x * 0.45, top + L * M.spike * 0.3, c.z);
    spike.rotation.z = -side * 0.5;
    out.push(spike);
    crackRing(top - L * M.padH * 0.25, s.x * M.pad, L * M.padH * 0.4, 5, 0.3);
    const bandY = top - L * M.bandAt;
    const band = MeshBuilder.CreateCylinder("infernalArmband", { height: L * M.bandH, diameter: s.x * 2 * M.band, tessellation: 8 }, scene);
    band.parent = arm; band.material = rock; glow?.addExcludedMesh(band);
    band.position.set(c.x, bandY, c.z); band.scaling.z = zs; band.rotation.y = Math.PI / 8;
    band.convertToFlatShadedMesh();
    out.push(band);
    crackRing(bandY, s.x * M.band, L * M.bandH * 0.8, M.cracks, 0);
  }
  return out;
}

/*
 * [S] 526 (a.4) the Infernal Whip's dark legs (secret.infernal_whip.blue.png, .red.png: deep team trousers from the tunic to the shins, near-black
 * boots to mid-shin, and a dark rock plate over each knee split by glowing magma cracks; ours had the secret_demon tint's pale lilac legs).
 * MAGMA_LEG in each limb's box (centre c, half size s, the hip/knee end +y): thigh an 8-sided shell .round over its length; shin a shell .round from
 * its top down .shin of its length, a boot shaft .boot round from there to its foot end; thighs, shins and pelvis in deep team (team^2, renormalised,
 * x .deep, self-lit .12), boot shafts and feet near-black rock (ROCK_HAIR, LESSONS 494); a knee plate, a flat ico .knee of the shin's width across,
 * .kneeH of its length tall, on the shin's front at its top, with .cracks magma slivers on its face (ROCK_HAIR magma, left in the glow).
 */
const MAGMA_LEG = { round: 1.14, shin: 0.5, boot: 1.24, deep: 0.38, knee: 1.5, kneeH: 0.26, cracks: 3 };
export function infernalTrousers(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const M = MAGMA_LEG, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const c0 = deepTeam(team, M.deep);
  const cloth = mf.get("cloth", c0, { emissive: c0.scale(0.12), roughness: 1 });
  const rock = mf.get("cloth", ROCK_HAIR.rock, { emissive: ROCK_HAIR.rock.scale(0.4), roughness: 1 });
  const magma = mf.get("unlit", ROCK_HAIR.magma, { emissive: ROCK_HAIR.magma });
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) {
    const { center: c, extendSize: s } = thigh.getBoundingInfo().boundingBox;
    out.push(legShell(scene, "infernalTrouserThigh", thigh, cloth, c.y + s.y, c.y - s.y, M.round));
    thigh.material = cloth; glow?.addExcludedMesh(thigh);
  }
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const { center: c, extendSize: s } = shin.getBoundingInfo().boundingBox;
    const top = c.y + s.y, L = s.y * 2, cut = top - L * M.shin;
    out.push(legShell(scene, "infernalTrouserShin", shin, cloth, top, cut, M.round));
    out.push(legShell(scene, "infernalBootShaft", shin, rock, cut, c.y - s.y, M.boot, M.boot * 1.06));
    shin.material = rock; glow?.addExcludedMesh(shin);
    const plate = MeshBuilder.CreateIcoSphere("infernalKneePlate", { radius: 0.5, subdivisions: 1, flat: true }, scene);
    plate.parent = shin; plate.material = rock; glow?.addExcludedMesh(plate);
    plate.scaling.set(s.x * 2 * M.knee, L * M.kneeH, s.z * 1.1);
    const pz = c.z + s.z * 1.05, py = top - L * M.kneeH * 0.3;
    plate.position.set(c.x, py, pz);
    out.push(plate);
    for (let k = 0; k < M.cracks; k++) {
      const crack = MeshBuilder.CreateBox("infernalKneeCrack", { width: s.x * 0.16, height: L * M.kneeH * 0.62, depth: s.z * 0.12 }, scene);
      crack.parent = shin; crack.material = magma;
      crack.position.set(c.x + (k - (M.cracks - 1) / 2) * s.x * 0.55, py, pz + s.z * 0.52);
      crack.rotation.z = (k % 2 ? 1 : -1) * 0.5;
      out.push(crack);
    }
  }
  for (const m of body.allMeshes) {
    if (m.name.endsWith("_pelvis")) { m.material = cloth; glow?.addExcludedMesh(m); }
    if (m.name.endsWith("_lFootM") || m.name.endsWith("_rFootM")) { m.material = rock; glow?.addExcludedMesh(m); }
  }
  return out;
}

/*
 * [S] 528 (b.1, b.2) the Banshee Hands (secret.banshee.red.png: no weapon and no wings, both hands empty and open, held out low; round each forearm at the
 * wrist a pale-blue glowing spirit ring, loose and a little wobbly, wider than the hand is long, tipped off the forearm's axis). SPIRIT_RING per forearm:
 * a ring .wide of the forearm's length across, .thick of it thick, .at of the forearm's length up from its wrist end, tipped .tilt rad, its radius
 * wobbling .wobble in .lobes lobes; pale blue unlit (emissive only) and left in the glow so it shines.
 */
const SPIRIT_RING = { wide: 1.15, thick: 0.045, at: 0.12, tilt: 0.38, wobble: 0.07, lobes: 3, blue: new Color3(0.72, 0.9, 1.15) };
export function bansheeSpiritRings(scene: Scene, body: ArticulatedBody): Mesh[] {
  const R = SPIRIT_RING, mf = getMaterialFactory();
  const glowM = mf.get("unlit", R.blue, { emissive: R.blue });
  const out: Mesh[] = [];
  [body.leftLowerArm, body.rightLowerArm].forEach((arm, i) => {
    const { center: c, extendSize: s } = arm.getBoundingInfo().boundingBox;
    const L = s.y * 2, rad = (L * R.wide) / 2;
    const path: Vector3[] = [];
    const n = 28;
    for (let k = 0; k <= n; k++) {
      const a = (k / n) * Math.PI * 2, r = rad * (1 + R.wobble * Math.sin(a * R.lobes + i * 1.7));
      path.push(new Vector3(Math.cos(a) * r, R.wobble * rad * 0.5 * Math.sin(a * 2 + i), Math.sin(a) * r));
    }
    const ring = MeshBuilder.CreateTube("bansheeSpiritRing", { path, radius: (L * R.thick) / 2, tessellation: 5 }, scene);
    ring.parent = arm;
    ring.position.set(c.x, c.y - s.y + L * R.at, c.z);
    ring.rotation.set((i ? -1 : 1) * R.tilt, 0, R.tilt * 0.6);
    ring.material = glowM;
    out.push(ring);
  });
  return out;
}

/*
 * [S] 528 (a.2) the Solar Architect's sun halo (secret.solar_architect.red.png: a big flat gold sun standing upright behind and above the bald head, its
 * middle about a head over the crown: a small 12-sided inner ring about a head and a quarter across, a larger 12-sided outer ring about two heads across,
 * and 12 thin straight spikes radiating from the outer ring, long ones up and out to the sides about two and a half heads from the middle, shorter ones
 * between). SUN_HALO in head widths W: centre .up W over the head's top, .back W behind its middle; rings .inner and .outer W across, bars .bar W thick;
 * .spikes spikes from the outer ring, the long ones (every third, starting straight up) .long W from the middle, the rest .short W; spikes .spikeW W wide
 * at the root. Unlit gold (palette right wall gold x1), out of the glow, parented to the head.
 */
const SUN_HALO = { up: 0.95, back: 0.55, inner: 1.25, outer: 2.1, bar: 0.07, spikes: 12, long: 2.55, short: 1.75, spikeW: 0.11, gold: new Color3(1, 0.7, 0.18) };

/*
 * [S] 536 (a.3) the Solar Architect's white coat (audit 527: "torso is a grey vest/shirt - TABS: a long white coat with gold trim, a high collar and
 * wide cuffs, open over a team front"; secret.solar_architect.red.png, card Appearance "wears white garments, with golden outlines": a white coat from
 * the shoulders to mid-thigh, flaring a little, open down the front over a team chest, its front edges and hem edged in gold; a stand-up collar lined
 * gold; a gold frog clasp across the opening high on the chest; wide white sleeves to mid-forearm with broad gold cuffs, the bare team forearm and
 * hand below). SOLAR_COAT in the yoke's box (T: wide, deep, mid, half, torso frame) and the hip and knee joints: the coat slabs (back, two sides, two
 * fronts) from .top of the yoke's half over its middle down to .hem of the way from the hips to the knees, .out T across and deep at the top flaring
 * .flare at the hem, .th T.deep thick; the front opening .gap T.wide each side of the middle at the top, .gapHem at the hem; gold edge strips .edge
 * T.wide wide down the opening and a band .hemBand T.half tall round the hem; the collar .collar T.wide across, .collarH T.half tall round the neck, a
 * gold ring on its top; the clasp .clasp T.half under the top; the sleeves a limbShell .sleeveOut thick over the upper arm and a bell on the forearm to
 * .bell of its length, .bellOut wide at its mouth, ending in a gold cuff .cuff of the forearm long. The trunk under it in the team skin. Unlit white and
 * gold (palette right wall: white x.9, gold x.85), out of the glow.
 */
const SOLAR_COAT = { top: 0.92, hem: 0.5, out: 1.16, flare: 1.32, th: 0.1, gap: 0.16, gapHem: 0.34, edge: 0.11, hemBand: 0.12, collar: 0.9, collarH: 0.32,
  clasp: 0.3, sleeveOut: 1.5, bell: 0.5, bellOut: 2.3, cuff: 0.14, white: new Color3(0.9, 0.9, 0.88), gold: new Color3(0.85, 0.6, 0.15) };
/*
 * [S] 536 (a.4) the Solar Architect's legs (audit 527: "dark blue trousers with dark boots - TABS: team ankle pants with gold cuffs and white shoes";
 * secret.solar_architect.red.png: slim pants in the team colour down to the ankle, a gold band round each ankle, small white shoes). SOLAR_LEGS: the
 * pelvis, thighs and shins in the team skin; round each shin's foot a gold cuff .cuff of the shin long, .cuffOut of its width across, its foot at
 * .low of the shin's length above the ankle; the foot boxes white. Unlit white and gold as SOLAR_COAT's, out of the glow.
 */
const SOLAR_LEGS = { cuff: 0.11, cuffOut: 1.3, low: 0.0 };
export function solarArchitectLegs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = SOLAR_LEGS, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const white = mf.get("unlit", SOLAR_COAT.white, { emissive: SOLAR_COAT.white });
  const gold = mf.get("unlit", SOLAR_COAT.gold, { emissive: SOLAR_COAT.gold });
  const pelvis = body.hip.getChildMeshes(true).find((m) => /_pelvis$/.test(m.name));
  for (const m of [pelvis, body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) if (m && body.skinMaterial) m.material = body.skinMaterial;
  const out: Mesh[] = [];
  for (const [shin, knee] of [[body.leftLowerLeg, body.leftKnee], [body.rightLowerLeg, body.rightKnee]] as const) {
    for (const m of knee.getChildMeshes(true)) if (/_[lr]FootM$/.test(m.name)) { m.material = white; glow?.addExcludedMesh(m as Mesh); }
    const L = limbBox(shin), len = L.half * 2, foot = L.mid - L.half + len * S.low, r = Math.max(L.wide, L.deep);
    const cuff = MeshBuilder.CreateCylinder("solarLegCuff", { height: len * S.cuff, diameter: r * 2 * S.cuffOut, tessellation: 8 }, scene);
    cuff.parent = knee; cuff.position.set(shin.position.x, foot + (len * S.cuff) / 2, shin.position.z); cuff.scaling.z = L.deep / r;
    cuff.material = gold; cuff.convertToFlatShadedMesh(); glow?.addExcludedMesh(cuff); out.push(cuff);
  }
  return out;
}
export function solarArchitectCoat(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = SOLAR_COAT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const white = mf.get("unlit", S.white, { emissive: S.white });
  const gold = mf.get("unlit", S.gold, { emissive: S.gold });
  const yoke = body.allMeshes.find((m) => m.name.endsWith("_yoke")) ?? body.torsoMesh;
  const T = limbBox(yoke);
  // the open front shows the trunk in the team skin, not the grey vest
  for (const m of [yoke, body.torsoMesh]) if (body.skinMaterial) m.material = body.skinMaterial;
  const out: Mesh[] = [];
  const put = (m: Mesh, mt: Material, parent: TransformNode = body.torso): Mesh => {
    m.parent = parent; m.material = mt; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m;
  };
  const hipY = (originIn(body.leftHip, body.torso).y + originIn(body.rightHip, body.torso).y) / 2;
  const kneeY = (originIn(body.leftKnee, body.torso).y + originIn(body.rightKnee, body.torso).y) / 2;
  const top = T.mid + T.half * S.top, hem = hipY + (kneeY - hipY) * S.hem;
  const wx0 = T.wide * S.out, wx1 = wx0 * S.flare, dz0 = T.deep * S.out, dz1 = dz0 * S.flare, th = T.deep * S.th;
  // a slab hanging from p0 (top) to p1 (hem): its +y laid along p1 -> p0 (front/back tip about x, sides about z)
  const hang = (name: string, w: number, d: number, p0: Vector3, p1: Vector3, aboutX: boolean, mt: Material): Mesh => {
    const L = Vector3.Distance(p0, p1);
    const m = MeshBuilder.CreateBox(name, { width: w, height: L, depth: d }, scene);
    m.position.copyFrom(p0.add(p1).scale(0.5));
    if (aboutX) m.rotation.x = Math.atan2(p0.z - p1.z, p0.y - p1.y); else m.rotation.z = Math.atan2(p1.x - p0.x, p0.y - p1.y);
    return put(m, mt);
  };
  hang("solarCoatBack", (wx0 + wx1), th, new Vector3(0, top, -dz0), new Vector3(0, hem, -dz1), true, white);
  for (const sd of [-1, 1]) {
    hang("solarCoatSide", th, (dz0 + dz1) * 1.02, new Vector3(sd * wx0, top, 0), new Vector3(sd * wx1, hem, 0), false, white);
    // the front panel from the side round to the opening, the opening widening toward the hem
    const g0 = T.wide * S.gap, g1 = T.wide * S.gapHem;
    const x0 = sd * (g0 + wx0) / 2, x1 = sd * (g1 + wx1) / 2;
    hang("solarCoatFront", ((wx0 - g0) + (wx1 - g1)) / 2 * 1.04, th, new Vector3(x0, top, dz0), new Vector3(x1, hem, dz1), true, white);
    // gold down the opening's edge, standing a little proud of the panel
    const e = T.wide * S.edge;
    hang("solarCoatEdge", e, th * 1.2, new Vector3(sd * (g0 + e / 2), top, dz0 + th * 0.4), new Vector3(sd * (g1 + e / 2), hem, dz1 + th * 0.4), true, gold);
  }
  // the gold band round the hem: front, back and sides
  const hb = T.half * 2 * S.hemBand, hy = hem + hb / 2 - T.half * 0.02;
  const band = (name: string, w: number, d: number, x: number, z: number): void => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: hb, depth: d }, scene); m.position.set(x, hy, z); put(m, gold);
  };
  band("solarCoatHemBack", wx1 * 2 + th, th * 1.3, 0, -dz1 - th * 0.15);
  for (const sd of [-1, 1]) {
    band("solarCoatHemSide", th * 1.3, dz1 * 2 + th, sd * (wx1 + th * 0.15), 0);
    const g1 = T.wide * S.gapHem;
    band("solarCoatHemFront", wx1 - g1 + th, th * 1.3, sd * (g1 + wx1) / 2, dz1 + th * 0.15);
  }
  // the shoulders: a lid over the top
  const lid = MeshBuilder.CreateBox("solarCoatShoulders", { width: wx0 * 2 + th, height: th, depth: dz0 * 2 + th }, scene);
  lid.position.set(0, top, 0); put(lid, white);
  // the high collar round the neck, lined gold at its top, and the clasp across the opening
  const neck = originIn(body.neck, body.torso);
  const cH = T.half * S.collarH, cD = T.wide * S.collar;
  const collar = MeshBuilder.CreateCylinder("solarCoatCollar", { height: cH, diameterTop: cD * 1.08, diameterBottom: cD, tessellation: 10 }, scene);
  collar.position.set(neck.x, Math.max(top, neck.y - cH * 0.3) + cH / 2, neck.z); collar.scaling.z = T.deep / T.wide; put(collar, white);
  const lip = MeshBuilder.CreateTorus("solarCoatCollarLip", { diameter: cD * 1.08, thickness: T.wide * 0.06, tessellation: 14 }, scene);
  lip.position.set(neck.x, collar.position.y + cH / 2, neck.z); lip.scaling.z = T.deep / T.wide; put(lip, gold);
  const clasp = MeshBuilder.CreateBox("solarCoatClasp", { width: T.wide * S.gap * 2.6, height: T.half * 0.06, depth: th }, scene);
  clasp.position.set(0, top - T.half * S.clasp, dz0 + th * 0.6); put(clasp, gold);
  // wide white sleeves: over the upper arm, then a bell on the forearm ending in a broad gold cuff
  for (const [upper, lower] of [[body.leftUpperArm, body.leftLowerArm], [body.rightUpperArm, body.rightLowerArm]] as const) {
    const s = limbShell(scene, "solarCoatSleeve", upper, 0, 1.05, S.sleeveOut, white);
    glow?.addExcludedMesh(s); out.push(s);
    const F = limbBox(lower), len = F.half * 2, ftop = F.mid + F.half, r = Math.max(F.wide, F.deep);
    const bellH = len * S.bell;
    const bell = MeshBuilder.CreateCylinder("solarCoatBell", { height: bellH, diameterTop: r * 2 * S.sleeveOut, diameterBottom: r * 2 * S.bellOut, tessellation: 8 }, scene);
    bell.position.set(lower.position.x, ftop - bellH / 2, lower.position.z); put(bell, white, lower.parent as TransformNode);
    const cuff = MeshBuilder.CreateCylinder("solarCoatCuff", { height: len * S.cuff, diameter: r * 2 * S.bellOut * 1.04, tessellation: 8 }, scene);
    cuff.position.set(lower.position.x, ftop - bellH + (len * S.cuff) / 2 - len * 0.02, lower.position.z); put(cuff, gold, lower.parent as TransformNode);
  }
  return out;
}
export function solarArchitectHalo(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = SUN_HALO, glow = scene.getGlowLayerByName("glow");
  const gold = getMaterialFactory().get("unlit", S.gold, { emissive: S.gold });
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, top = c.y + b.extendSize.y;
  const root = new Mesh("sunHalo", scene);
  root.parent = head;
  root.position.set(c.x, top + S.up * W, c.z - S.back * W);
  const out: Mesh[] = [];
  const put = (m: Mesh): Mesh => { m.parent = root; m.material = gold; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  for (const d of [S.inner, S.outer]) {
    const path: Vector3[] = [];
    for (let k = 0; k <= 12; k++) { const a = (k / 12) * Math.PI * 2 + Math.PI / 12; path.push(new Vector3(Math.cos(a) * d * W / 2, Math.sin(a) * d * W / 2, 0)); }
    put(MeshBuilder.CreateTube("sunHaloRing", { path, radius: (S.bar * W) / 2, tessellation: 4 }, scene));
  }
  const R0 = (S.outer * W) / 2;
  for (let k = 0; k < S.spikes; k++) {
    const a = Math.PI / 2 + (k / S.spikes) * Math.PI * 2, len = (k % 3 === 0 ? S.long : S.short) * W - R0;
    const spike = MeshBuilder.CreateCylinder("sunHaloSpike", { height: len, diameterBottom: S.spikeW * W, diameterTop: 0, tessellation: 4 }, scene);
    spike.scaling.z = 0.4;
    spike.rotation.z = a - Math.PI / 2;
    spike.position.set(Math.cos(a) * (R0 + len / 2), Math.sin(a) * (R0 + len / 2), 0);
    put(spike);
  }
  out.push(root as Mesh);
  return out;
}

/*
 * [S] 528 (a.1) the Bank Robbers' bandanas (secret.bank_robbers.blue.png, .red.png: a magenta cloth tied round the face from just under the eyes down
 * past the chin, its front falling in a point onto the top of the chest; the same magenta on both teams). ROBBER_BANDANA in the head box (W, H, D, c)
 * and the bead eyes: a band .wrap W and D round, from .gap H under the eye bottoms down to .chin H under the head's bottom; a front fold a little
 * proud of it; a triangular point .pointW W across and .point H long hanging from the front under the chin, tipped .tip rad out over the chest;
 * a knot at the back. Magenta lit cloth self-lit .12, out of the glow. Both men, not the safe actor.
 */
const ROBBER_BANDANA = { wrap: 1.1, gap: 0.03, chin: 0.06, pointW: 0.95, point: 0.55, tip: 0.35, magenta: new Color3(0.58, 0.05, 0.3) };
export function bankRobberBandana(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = ROBBER_BANDANA, glow = scene.getGlowLayerByName("glow");
  const cloth = getMaterialFactory().get("cloth", B.magenta, { emissive: B.magenta.scale(0.12), roughness: 1 });
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const eyes = eyeBoxInHead(body) ?? { lo: new Vector3(c.x - W * 0.3, c.y, c.z + D * 0.4), hi: new Vector3(c.x + W * 0.3, c.y + H * 0.15, c.z + D * 0.55) };
  const out: Mesh[] = [];
  const put = (m: Mesh): Mesh => { m.parent = head; m.material = cloth; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  const top = eyes.lo.y - H * B.gap, bot = c.y - H / 2 - H * B.chin, h = top - bot;
  const band = put(MeshBuilder.CreateBox("robberBandana", { width: W * B.wrap, height: h, depth: D * B.wrap }, scene));
  band.position.set(c.x, (top + bot) / 2, c.z);
  const front = Math.max(c.z + (D * B.wrap) / 2, eyes.hi.z);
  const fold = put(MeshBuilder.CreateBox("robberBandanaFold", { width: W * B.wrap * 0.92, height: h * 0.55, depth: D * 0.06 }, scene));
  fold.position.set(c.x, bot + h * 0.3, front + D * 0.02);
  // the point: a flat four-sided cone hung point-down from the band's front foot, tipped out over the chest
  const P = H * B.point;
  const hinge = new Mesh("robberBandanaHinge", scene); hinge.parent = head; hinge.position.set(c.x, bot + H * 0.02, front - D * 0.04); hinge.rotation.x = -B.tip;
  const point = MeshBuilder.CreateCylinder("robberBandanaPoint", { height: P, diameterTop: W * B.pointW * Math.SQRT2, diameterBottom: 0, tessellation: 4 }, scene);
  point.rotation.y = Math.PI / 4; point.bakeCurrentTransformIntoVertices(); point.rotation.y = 0;
  point.scaling.z = 0.12; point.position.y = -P / 2;
  put(point); point.parent = hinge;
  const knot = put(MeshBuilder.CreateBox("robberBandanaKnot", { width: W * 0.22, height: h * 0.4, depth: D * 0.16 }, scene));
  knot.position.set(c.x, top - h * 0.3, c.z - (D * B.wrap) / 2 - D * 0.06);
  out.push(hinge);
  return out;
}

/*
 * [S] 528 (a.1) Vlad's crown (secret.vlad.red.png, .jpg: a dark iron band round the head just over the eyes, a gold eight-pointed star badge on its
 * front, and above the brow a tall close fan of thin grey iron spikes, six or so, each with a round iron bead at its foot, standing about a head over
 * the crown). VLAD_CROWN in the head box (W, H, D, c) and the bead eyes: a band .band W across (8-sided) and .bandH H tall from .gap H over the eye
 * tops; a star .star W across of .points points at the band's front; .spikes spikes over the front half of the band top, spread .spread W across,
 * .tall H high in the middle falling to .low of that at the ends, splayed .splay rad, .spikeW W thick at the foot; a bead .bead W at each foot.
 * Iron in lit cloth self-lit .3 (metal renders black), star gold unlit, out of the glow. The plain crown hat is not built (unitVisuals hat none).
 */
const VLAD_CROWN = { band: 1.1, bandH: 0.2, gap: 0.0, star: 0.42, points: 8, spikes: 6, spread: 0.62, tall: 0.95, low: 0.7, splay: 0.16, spikeW: 0.08, bead: 0.14,
  iron: new Color3(0.26, 0.26, 0.29), gold: new Color3(0.85, 0.46, 0.08) };
export function vladCrown(scene: Scene, body: ArticulatedBody): Mesh[] {
  const V = VLAD_CROWN, glow = scene.getGlowLayerByName("glow"), mf = getMaterialFactory();
  const iron = mf.get("cloth", V.iron, { emissive: V.iron.scale(0.3), roughness: 0.9 });
  const gold = mf.get("unlit", V.gold, { emissive: V.gold });
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const eyes = eyeBoxInHead(body) ?? { lo: new Vector3(c.x - W * 0.3, c.y, c.z + D * 0.4), hi: new Vector3(c.x + W * 0.3, c.y + H * 0.15, c.z + D * 0.55) };
  const out: Mesh[] = [];
  const put = (m: Mesh, mt: Material = iron): Mesh => { m.parent = head; m.material = mt; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  const foot = eyes.hi.y + H * V.gap, bandTop = foot + H * V.bandH;
  const band = put(MeshBuilder.CreateCylinder("vladCrownBand", { height: H * V.bandH, diameter: W * V.band, tessellation: 8 }, scene));
  band.scaling.z = (D / W) * 1.02; band.position.set(c.x, (foot + bandTop) / 2, c.z);
  const front = c.z + (D * V.band * 1.02) / 2;
  // the star: points as thin flat diamonds round a boss
  const S = W * V.star;
  for (let k = 0; k < V.points; k++) {
    const ray = MeshBuilder.CreateCylinder("vladCrownStarRay", { height: S / 2, diameterBottom: S * 0.2, diameterTop: 0, tessellation: 4 }, scene);
    ray.scaling.z = 0.3;
    const a = (k / V.points) * Math.PI * 2;
    ray.rotation.z = a; ray.position.set(c.x - Math.sin(a) * S * 0.25, (foot + bandTop) / 2 + Math.cos(a) * S * 0.25, front + D * 0.03);
    put(ray, gold);
  }
  const boss = put(MeshBuilder.CreateIcoSphere("vladCrownStarBoss", { radius: S * 0.16, subdivisions: 1, flat: true }, scene), gold);
  boss.scaling.z = 0.6; boss.position.set(c.x, (foot + bandTop) / 2, front + D * 0.05);
  // the spike fan over the brow
  for (let k = 0; k < V.spikes; k++) {
    const t = V.spikes > 1 ? k / (V.spikes - 1) - 0.5 : 0;
    const tall = H * V.tall * (1 - (1 - V.low) * Math.abs(t) * 2);
    const x = c.x + t * W * V.spread, z = c.z + D * 0.2;
    const spike = MeshBuilder.CreateCylinder("vladCrownSpike", { height: tall, diameterBottom: W * V.spikeW, diameterTop: W * V.spikeW * 0.25, tessellation: 5 }, scene);
    spike.setPivotPoint(new Vector3(0, -tall / 2, 0));
    spike.position.set(x, bandTop + tall / 2, z); spike.rotation.z = -t * V.splay * 2;
    put(spike);
    const bead = put(MeshBuilder.CreateIcoSphere("vladCrownBead", { radius: (W * V.bead) / 2, subdivisions: 1, flat: true }, scene));
    bead.position.set(x, bandTop + W * V.bead * 0.3, z + D * 0.05);
  }
  return out;
}

/*
 * [S] 529 (a.2) the Bank Robbers' gun belts (secret.bank_robbers.blue.png: a dark brown leather belt round the waist just under the vest's foot,
 * a square buckle at the front, and on each hip a brown holster hanging down the thigh with a dark handgun grip standing out of it, butt back).
 * ROBBER_BELT in the yoke's half-sizes (the vest's frame), on the torso joint: a band .h of the half-height tall at .at under the yoke's middle,
 * .out of its half-width and depth round; a buckle .buckle wide at the front; per side a holster .hw of the half-width wide, .hd of the half-depth
 * deep and .long of the half-height long, hung from the band at .side of the half-width out, splayed .splay rad; out of its top a grip .grip long
 * tipped .tilt rad back, with a hammer block. Leather lit cloth self-lit .12 (the approved GUN_BELT browns), out of the glow. Both men, not the safe.
 */
const ROBBER_BELT = { at: 0.97, h: 0.16, out: 1.13, buckle: 0.26, side: 1.02, hw: 0.32, hd: 0.62, long: 0.78, splay: 0.14, grip: 0.42, tilt: 0.55,
  leather: new Color3(0.15, 0.085, 0.05), holster: new Color3(0.24, 0.13, 0.07), gun: new Color3(0.07, 0.065, 0.065), brass: new Color3(0.62, 0.42, 0.14) };
export function bankRobberBelt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = ROBBER_BELT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const lit = (c: Color3, e = 0.12): Material => mf.get("cloth", c, { emissive: c.scale(e), roughness: 1 });
  const leather = lit(B.leather), holsterM = lit(B.holster), gunM = lit(B.gun, 0.4), brass = lit(B.brass, 0.3);
  const yoke = body.allMeshes.find((m) => m.name.endsWith("_yoke")) ?? body.torsoMesh;
  const T = limbBox(yoke);
  const out: Mesh[] = [];
  const box = (name: string, w: number, h: number, d: number, m: Material, parent: TransformNode = body.torso): Mesh => {
    const b = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    b.parent = parent; b.material = m; b.convertToFlatShadedMesh(); glow?.addExcludedMesh(b); out.push(b);
    return b;
  };
  const y = T.mid - T.half * B.at, bh = T.half * B.h, wx = T.wide * B.out, dz = T.deep * B.out;
  box("robberBelt", wx * 2, bh, dz * 2, leather).position.set(0, y, 0);
  box("robberBeltBuckle", T.wide * B.buckle * 2, bh * 1.25, T.deep * 0.12, brass).position.set(0, y, dz + T.deep * 0.04);
  for (const side of [-1, 1]) {
    // a hinge at the belt's side; the holster hangs from it down the thigh, its foot splayed out
    const hinge = new TransformNode("robberHolsterHinge", scene);
    hinge.parent = body.torso; hinge.position.set(side * T.wide * B.side, y, 0); hinge.rotation.z = side * B.splay;
    const long = T.half * B.long, hw = T.wide * B.hw, hd = T.deep * B.hd;
    box("robberHolster", hw, long, hd, holsterM, hinge).position.set(side * hw * 0.55, -long / 2 + bh * 0.2, 0);
    box("robberHolsterLoop", hw * 1.15, bh * 1.1, hd * 1.08, leather, hinge).position.set(side * hw * 0.55, -bh * 0.2, 0);
    // the grip: out of the holster's mouth, butt tipped back
    const grip = new TransformNode("robberGunGrip", scene);
    grip.parent = hinge; grip.position.set(side * hw * 0.55, bh * 0.4, -hd * 0.1); grip.rotation.x = -B.tilt;
    const gl = T.half * B.grip;
    box("robberGunButt", hw * 0.62, gl, hd * 0.42, gunM, grip).position.set(0, gl / 2, -gl * 0.12);
    box("robberGunHammer", hw * 0.4, gl * 0.22, hd * 0.3, gunM, grip).position.set(0, gl * 0.1, hd * 0.28);
  }
  return out;
}

/*
 * [S] 529 (a.2) the Banshee's gown (secret.banshee.red.png: a long ragged off-white shift hung from the shoulders, straight over the chest and
 * flaring a little to a hem below the knees; the hem cut in a zigzag of points with a team-coloured border under it; torn holes in the cloth showing
 * the team body behind, one on the chest's side, two on the skirt). BANSHEE_GOWN on the torso joint, in the yoke's half-sizes (T) and the knee read
 * into the torso frame: a bodice .out of the yoke round from its top to the waist (.waist of the half-height under its middle); an eight-sided
 * skirt from the waist, .top to .foot of the yoke's width across, to .below m under the knee; at the hem .teeth cream points .tooth m long over
 * .teeth team points a little longer behind them (the zigzag border); .holes torn patches in team on the cloth. Cream unlit (LESSONS 442), team
 * lit cloth self-lit .12, out of the glow.
 */
const BANSHEE_GOWN = { out: 1.12, waist: 0.95, top: 2.3, foot: 2.9, depth: 1.05, below: 0.1, teeth: 12, tooth: 0.11, teamDrop: 0.035,
  cream: new Color3(0.9, 0.88, 0.8),
  holes: [[0.62, 0.35, 0.55, 0.16], [-0.35, -0.45, 0.42, 0.13], [0.42, -0.7, 0.32, 0.1]] as [number, number, number, number][] };
export function bansheeGown(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const G = BANSHEE_GOWN, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const cream = mf.get("unlit", G.cream, { emissive: G.cream });
  const teamM = mf.get("cloth", team, { emissive: team.scale(0.12), roughness: 1 });
  const yoke = body.allMeshes.find((m) => m.name.endsWith("_yoke")) ?? body.torsoMesh;
  const T = limbBox(yoke);
  const out: Mesh[] = [];
  const put = (m: Mesh, mt: Material): Mesh => { m.parent = body.torso; m.material = mt; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  const top = T.mid + T.half, waist = T.mid - T.half * G.waist;
  const kneeY = (originIn(body.leftKnee, body.torso).y + originIn(body.rightKnee, body.torso).y) / 2;
  const hem = kneeY - G.below;
  const wx = T.wide * G.out, dz = T.deep * G.out;
  const bodice = put(MeshBuilder.CreateBox("bansheeBodice", { width: wx * 2, height: top - waist, depth: dz * 2 }, scene), cream);
  bodice.position.set(0, (top + waist) / 2, 0);
  // the skirt: an eight-sided flared shell, its depth in the trunk's depth/width ratio
  const ratio = (T.deep / T.wide) * G.depth, rTop = T.wide * G.top / 2, rFoot = T.wide * G.foot / 2;
  const skirt = put(MeshBuilder.CreateCylinder("bansheeSkirt", { height: waist - hem, diameterTop: rTop * 2, diameterBottom: rFoot * 2, tessellation: 8 }, scene), cream);
  skirt.rotation.y = Math.PI / 8; skirt.scaling.z = ratio; skirt.position.y = (waist + hem) / 2;
  // the zigzag hem: cream points over a team border of longer points behind them
  for (let k = 0; k < G.teeth; k++) {
    const a = (k / G.teeth) * Math.PI * 2, along = (2 * Math.PI * rFoot) / G.teeth;
    for (const [mt, drop, grow, inset] of [[cream, 0, 1, 0.99], [teamM, G.teamDrop, 1.05, 0.96]] as const) {
      const len = G.tooth * (k % 2 ? 0.75 : 1) + drop;
      const p = MeshBuilder.CreateCylinder("bansheeHemPoint", { height: len, diameterTop: along * grow, diameterBottom: 0, tessellation: 4 }, scene);
      p.scaling.z = 0.12;
      p.rotation.y = Math.PI / 2 - a;
      p.position.set(Math.cos(a) * rFoot * inset, hem - len / 2, Math.sin(a) * rFoot * ratio * inset);
      put(p, mt);
    }
  }
  // torn holes: team patches a little proud of the front ([x of the half-width, y of the half-height from the waist or skirt, w, h])
  for (const [hx, hy, hw, hh] of G.holes) {
    const onSkirt = hy < 0, y = onSkirt ? waist + (waist - hem) * hy * 0.9 : T.mid + T.half * hy;
    const r = onSkirt ? rTop + (rFoot - rTop) * Math.min(1, -hy) : wx;
    const z = onSkirt ? r * ratio * 0.95 + 0.004 : dz + 0.004;
    const hole = MeshBuilder.CreateCylinder("bansheeGownHole", { height: T.half * hh * 2, diameterTop: T.wide * hw * 0.6, diameterBottom: T.wide * hw, tessellation: 5 }, scene);
    hole.rotation.x = Math.PI / 2; hole.scaling.y = 0.05; hole.rotation.z = hx;
    hole.position.set(T.wide * hx * (onSkirt ? 1.4 : 1), y, z);
    put(hole, teamM);
  }
  return out;
}

/*
 * [S] 534 (a.1) the Banshee's chains in place of legs (audit 527, re-audit 531: "full team legs, two legs and boots standing below the hem";
 * secret.banshee.red.png; card Appearance: no legs at all, three dark iron chains hang out from under the zigzag hem side by side, the middle one
 * longest, nearly to the ground, the outer two a little shorter and splayed). BANSHEE_CHAINS: every mesh on both legs (hips down, any dress on
 * them too) hidden; she hovers .lift of her height up (proceduralAnimation REAPER_HOVER via a "reaperHover" mark on the hip, as the Tempest
 * Lich), the chains reaching down into the gap; .strands chains from .rise m up inside the gown's hem, .apart of the trunk's half-width apart, each .reach (middle first) of the
 * hem-to-ground drop long, splayed .splay rad; links tori .link m across, .thick thick, .step m apart, each turned a quarter to the last, dark iron
 * lit cloth. On the torso joint, out of the glow.
 */
const BANSHEE_CHAINS = { lift: 0.16, strands: 3, rise: 0.04, apart: 0.9, reach: [0.85, 0.97, 0.8], splay: 0.12, link: 0.09, thick: 0.024, step: 0.068,
  iron: new Color3(0.13, 0.13, 0.15) };
export function bansheeChainLegs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = BANSHEE_CHAINS, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const iron = mf.get("cloth", C.iron, { emissive: C.iron.scale(0.4), roughness: 1 });
  // the ground: the lowest point of the legs she no longer shows, read into the torso frame before they are hidden
  const toTorso = body.torso.computeWorldMatrix(true).clone().invert();
  let ground = Infinity;
  for (const hip of [body.leftHip, body.rightHip]) for (const m of hip.getChildMeshes(false)) {
    m.computeWorldMatrix(true);
    for (const v of m.getBoundingInfo().boundingBox.vectorsWorld) ground = Math.min(ground, Vector3.TransformCoordinates(v, toTorso).y);
    m.isVisible = false;
  }
  const yoke = body.allMeshes.find((m) => m.name.endsWith("_yoke")) ?? body.torsoMesh;
  const T = limbBox(yoke);
  const kneeY = (originIn(body.leftKnee, body.torso).y + originIn(body.rightKnee, body.torso).y) / 2;
  const hem = kneeY - BANSHEE_GOWN.below;
  // she floats .lift of her height up (the animator's hover, the "reaperHover" mark's own lift), the chains reaching down into the gap
  const mark = new TransformNode("reaperHover", scene); mark.parent = body.hip; mark.position.y = C.lift;
  const drop = Math.max(0.2, hem - (Number.isFinite(ground) ? ground : hem - 0.5)) + body.metrics.overallHeight * C.lift;
  const out: Mesh[] = [];
  for (let s = 0; s < C.strands; s++) {
    const side = s - (C.strands - 1) / 2;
    const strand = new TransformNode("bansheeChain", scene);
    strand.parent = body.torso; strand.position.set(side * T.wide * C.apart, hem + C.rise, side === 0 ? 0.02 : -0.02);
    strand.rotation.z = -side * C.splay;
    const n = Math.max(3, Math.round((drop * C.reach[s] + C.rise) / C.step));
    for (let k = 0; k < n; k++) {
      const link = MeshBuilder.CreateTorus("bansheeChainLink", { diameter: C.link, thickness: C.thick, tessellation: 8 }, scene);
      link.parent = strand; link.position.y = -k * C.step - C.link / 2;
      // a link stands upright (its ring in a vertical plane), each turned a quarter about the chain's line to the one before
      link.rotation.set(Math.PI / 2, (k % 2) * (Math.PI / 2), 0); link.scaling.x = 0.75;
      link.material = iron; link.convertToFlatShadedMesh(); glow?.addExcludedMesh(link); out.push(link);
    }
  }
  return out;
}

/*
 * [S] 538 (a.5) the Banshee's body chains (audit 527: "no chains around the body - TABS: dark chains wrapped round the waist and trailing off the arms";
 * secret.banshee.red.png, card Appearance "several chains wrapping around their body": one dark iron chain of big links round the gown at the waist,
 * sagging a little at the front; a dark iron manacle round each forearm a hand above the wrist, a short chain hanging off it). BANSHEE_WAIST on the
 * torso joint, in the yoke's half-sizes (T): links round a rounded rectangle .out of the bodice (BANSHEE_GOWN.out) at .at of the half-height over the
 * waist, the front sagging .sag m in the middle; links .link m across, .thick thick, .step m apart, alternate links turned a quarter about the run.
 * Manacles in each forearm's box (the elbow end +y): a ring .cuff of its half-width round, .cuffH of its length tall, its middle .cuffAt down the
 * forearm; off its outer side .dangle links hang along the forearm toward the hand, standing .proud of its skin. BANSHEE_CHAINS iron, out of the glow.
 */
const BANSHEE_WAIST = { at: 0.06, out: 1.06, sag: 0.05, link: 0.075, thick: 0.02, step: 0.056, cuff: 1.55, cuffH: 0.16, cuffAt: 0.72, dangle: 5, proud: 1.5 };
export function bansheeBodyChains(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = BANSHEE_WAIST, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const iron = mf.get("cloth", BANSHEE_CHAINS.iron, { emissive: BANSHEE_CHAINS.iron.scale(0.4), roughness: 1 });
  const out: Mesh[] = [];
  const link = (parent: TransformNode, p: Vector3, dir: Vector3, k: number): void => {
    // a link's ring lies along the chain's run: its torus axis (local y) square to the run, every other one turned a quarter about it
    const m = MeshBuilder.CreateTorus("bansheeBodyChainLink", { diameter: C.link, thickness: C.thick, tessellation: 8 }, scene);
    m.parent = parent; m.position.copyFrom(p); m.scaling.x = 0.72;
    const yaw = Math.atan2(dir.x, dir.z), pitch = -Math.asin(Math.max(-1, Math.min(1, dir.y)));
    m.rotation.set(pitch, yaw - Math.PI / 2, k % 2 ? Math.PI / 2 : 0);
    m.material = iron; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m);
  };
  // the waist chain round the bodice
  const yoke = body.allMeshes.find((m) => m.name.endsWith("_yoke")) ?? body.torsoMesh;
  const T = limbBox(yoke);
  const y0 = T.mid - T.half * BANSHEE_GOWN.waist + T.half * C.at;
  const wx = T.wide * BANSHEE_GOWN.out * C.out + C.thick, dz = T.deep * BANSHEE_GOWN.out * C.out + C.thick, rr = Math.min(wx, dz) * 0.35;
  const path: Vector3[] = [];
  const corners: [number, number][] = [[wx - rr, dz - rr], [-(wx - rr), dz - rr], [-(wx - rr), -(dz - rr)], [wx - rr, -(dz - rr)]];
  for (let c = 0; c < 4; c++) for (let k = 0; k <= 6; k++) {
    const a = (c * Math.PI) / 2 + (k / 6) * (Math.PI / 2);
    path.push(new Vector3(corners[c][0] + Math.cos(a) * rr, 0, corners[c][1] + Math.sin(a) * rr));
  }
  path.push(path[0].clone());
  let carry = 0, k = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1], seg = Vector3.Distance(a, b);
    let s = carry;
    while (s < seg) {
      const p = Vector3.Lerp(a, b, s / seg);
      // the front run sags in its middle
      const sagY = p.z > 0 ? -C.sag * Math.max(0, 1 - (p.x / wx) ** 2) : 0;
      link(body.torso, new Vector3(p.x, y0 + sagY, p.z), b.subtract(a).normalize(), k++);
      s += C.step;
    }
    carry = s - seg;
  }
  // a manacle on each forearm, a short chain hanging off its outer side toward the hand
  for (const [arm, side] of [[body.leftLowerArm, -1], [body.rightLowerArm, 1]] as const) {
    const L = limbBox(arm), r = Math.max(L.wide, L.deep);
    const cy = L.mid + L.half - L.half * 2 * C.cuffAt;
    const cuff = MeshBuilder.CreateCylinder("bansheeManacle", { height: L.half * 2 * C.cuffH, diameter: r * 2 * C.cuff, tessellation: 8 }, scene);
    cuff.parent = arm; cuff.position.set(0, cy, 0); cuff.rotation.y = Math.PI / 8;
    cuff.material = iron; cuff.convertToFlatShadedMesh(); glow?.addExcludedMesh(cuff); out.push(cuff);
    for (let j = 0; j < C.dangle; j++) {
      link(arm, new Vector3(side * r * C.proud, cy - L.half * C.cuffH - C.link * 0.3 - j * C.step, 0), new Vector3(0, -1, 0), j);
    }
  }
  return out;
}

/*
 * [S] 538 (a.6) the Banshee's armbands (audit 527: "bare team upper arms - TABS: two gold armbands on each upper arm"; secret.banshee.red.png: two
 * broad gold bands round each upper arm, one under the shoulder and one above the elbow, a band's width of team skin between them). BANSHEE_ARMBAND
 * in each upper arm's box (shoulder end +y): rings .round of its half-width round, .tall of its length tall, their middles at .at of the way
 * down. BANSHEE_CROWN gold, out of the glow.
 */
const BANSHEE_ARMBAND = { at: [0.34, 0.66], round: 1.42, tall: 0.17 };
export function bansheeArmbands(scene: Scene, body: ArticulatedBody): Mesh[] {
  const A = BANSHEE_ARMBAND, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const gold = mf.get("cloth", BANSHEE_CROWN.gold, { emissive: BANSHEE_CROWN.gold.scale(0.3), roughness: 1 });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    const { center: c, extendSize: s } = arm.getBoundingInfo().boundingBox;
    for (const at of A.at) {
      const band = MeshBuilder.CreateCylinder("bansheeArmband", { height: s.y * 2 * A.tall, diameter: s.x * 2 * A.round, tessellation: 8 }, scene);
      band.parent = arm; band.position.set(c.x, c.y + s.y - s.y * 2 * at, c.z); band.scaling.z = s.z / s.x; band.rotation.y = Math.PI / 8;
      band.material = gold; band.convertToFlatShadedMesh(); glow?.addExcludedMesh(band); out.push(band);
    }
  }
  return out;
}

/*
 * [S] 539 (necromancer a.6) the Necromancer's armbands (audit 527: "no armbands - TABS: grey metal bands on both upper arms"; card Appearance "two
 * metallic armbands on each Humerus"; secret.necromancer.red.png: two broad pale grey metal bands round each upper arm bone, far wider than the bone,
 * one under the shoulder and one at mid-arm, a thin dark purple ring between them). NECRO_ARMBAND in each upper arm bone's box (shoulder end +y): rings
 * .round of its half-width round (a Stiffy bone is thin), .tall of its length tall, middles at .at of the way down; between them a ring .gapRound
 * round, .gapTall tall in .purple. Pale grey lit cloth self-lit .12 (palette: white x .7 reads pale grey), out of the glow.
 */
const NECRO_ARMBAND = { at: [0.3, 0.62], round: 2.7, tall: 0.2, gapRound: 2.3, gapTall: 0.1, grey: new Color3(0.62, 0.62, 0.64), purple: new Color3(0.2, 0.08, 0.2) };
export function necromancerArmbands(scene: Scene, body: ArticulatedBody): Mesh[] {
  const A = NECRO_ARMBAND, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const grey = mf.get("cloth", A.grey, { emissive: A.grey.scale(0.12), roughness: 0.8 });
  const purple = mf.get("cloth", A.purple, { emissive: A.purple.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    const { center: c, extendSize: s } = arm.getBoundingInfo().boundingBox;
    const ring = (at: number, round: number, tall: number, mat: Material) => {
      const band = MeshBuilder.CreateCylinder("necromancerArmband", { height: s.y * 2 * tall, diameter: s.x * 2 * round, tessellation: 8 }, scene);
      band.parent = arm; band.position.set(c.x, c.y + s.y - s.y * 2 * at, c.z); band.scaling.z = s.z / s.x; band.rotation.y = Math.PI / 8;
      band.material = mat; band.convertToFlatShadedMesh(); glow?.addExcludedMesh(band); out.push(band);
    };
    for (const at of A.at) ring(at, A.round, A.tall, grey);
    ring((A.at[0] + A.at[1]) / 2, A.gapRound, A.gapTall, purple);
  }
  return out;
}

/*
 * [S] 529 (b.2) the Necromancer's lantern (secret.necromancer.red.png; card Off Hand "a magical, team-colored kerosene lantern, with a ghostly flame
 * inside ... the blue ghost-flame also is seen encircling the lantern": a team lantern hung from his off fist by a wire bail: a domed cap with a
 * chimney knob, a pale glass chimney between four thin team posts with a pale-blue ghost flame inside it, a round team fount under it; round its
 * middle a flat, glowing pale-blue ring, tilted). NECRO_LANTERN in the head's half-width R, on the off hand (its -y the knuckles' way, down when the
 * arm hangs): the bail .bail R across from the fist; the lantern's top .top R under the hand, the cap .cap R tall, the glass .glass R tall and
 * .glassW R across, the fount .fount R tall and .fountW across; the ring .ring R across, .ringT thick, tilted .tilt rad. Team lit cloth self-lit .12,
 * glass and flame unlit; the ring unlit and glowing.
 */
const NECRO_LANTERN = { bail: 0.75, top: 0.85, cap: 0.5, glass: 0.8, glassW: 0.62, fount: 0.42, fountW: 0.85, ring: 3.4, ringT: 0.16, tilt: 0.32,
  glassC: new Color3(0.55, 0.78, 0.82), flame: new Color3(0.6, 0.95, 1.1), ringC: new Color3(0.75, 0.95, 1.15) };
export function necromancerLantern(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const L = NECRO_LANTERN, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const R = body.headMesh.getBoundingInfo().boundingBox.extendSize.x;
  const teamM = mf.get("cloth", team, { emissive: team.scale(0.12), roughness: 1 });
  const glass = mf.get("unlit", L.glassC, { emissive: L.glassC });
  const flame = mf.get("unlit", L.flame, { emissive: L.flame });
  const ringM = mf.get("unlit", L.ringC, { emissive: L.ringC });
  const hang = new TransformNode("necroLanternHang", scene);
  hang.parent = body.leftHand; hang.position.set(0, -R * 0.35, R * 0.1);
  const out: Mesh[] = [];
  const put = (m: Mesh, mt: Material, y: number, keepGlow = false): Mesh => {
    m.parent = hang; m.material = mt; m.position.y = y; m.convertToFlatShadedMesh(); if (!keepGlow) glow?.addExcludedMesh(m); out.push(m); return m;
  };
  // the wire bail from the fist down to the cap's sides
  const bail = put(MeshBuilder.CreateTorus("necroLanternBail", { diameter: R * L.bail, thickness: R * 0.07, tessellation: 10 }, scene), teamM, -R * L.top * 0.5);
  bail.rotation.z = Math.PI / 2; bail.scaling.y = 1.3;
  let y = -R * L.top;
  const cap = put(MeshBuilder.CreateCylinder("necroLanternCap", { height: R * L.cap, diameterTop: R * 0.22, diameterBottom: R * L.glassW * 1.3, tessellation: 8 }, scene), teamM, y - R * L.cap / 2);
  cap.rotation.y = Math.PI / 8;
  put(MeshBuilder.CreateCylinder("necroLanternKnob", { height: R * 0.14, diameter: R * 0.3, tessellation: 6 }, scene), teamM, y + R * 0.05);
  y -= R * L.cap;
  const gH = R * L.glass;
  put(MeshBuilder.CreateCylinder("necroLanternGlass", { height: gH, diameterTop: R * L.glassW * 0.8, diameterBottom: R * L.glassW, tessellation: 8 }, scene), glass, y - gH / 2);
  const ghost = put(MeshBuilder.CreateIcoSphere("necroLanternFlame", { radius: R * L.glassW * 0.28, subdivisions: 1, flat: true }, scene), flame, y - gH * 0.55, true);
  ghost.scaling.y = 1.5;
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4, r = R * L.glassW * 0.52;
    const post = put(MeshBuilder.CreateCylinder("necroLanternPost", { height: gH, diameter: R * 0.07, tessellation: 4 }, scene), teamM, y - gH / 2);
    post.position.x = Math.cos(a) * r; post.position.z = Math.sin(a) * r;
  }
  y -= gH;
  const fH = R * L.fount;
  put(MeshBuilder.CreateCylinder("necroLanternFount", { height: fH, diameterTop: R * L.fountW, diameterBottom: R * L.fountW * 0.8, tessellation: 8 }, scene), teamM, y - fH / 2);
  // the glowing ghost ring round the lantern's middle
  const ring = put(MeshBuilder.CreateTorus("necroLanternRing", { diameter: R * L.ring, thickness: R * L.ringT, tessellation: 8 }, scene), ringM, -R * L.top - R * L.cap - gH * 0.5, true);
  ring.scaling.y = 0.35; ring.rotation.x = L.tilt; ring.rotation.z = L.tilt * 0.5;
  return out;
}

/*
 * [S] 536 (a.2) the Necromancer's horned cap (audit 527: "headgear is a dark round hood with a flat collar brim - TABS: a dark team leather cap with
 * two long curved horns and lank dark hair"; secret.necromancer.red.png: a close dark team cap over the skull from the brow up, the bone face and its
 * bead eyes bare under it; from each side of the crown a long dark horn sweeps out, then up, curling in a little at its pale tip, two pale bands round
 * it; under the cap's sides lank dark hair hangs straight past the jaw to the collarbones). NECRO_CAP in the head box (W, H, D, c) and the bead eyes:
 * the cap a half-sphere .cap W across and .capD deep from .brow H over the eyes' tops to .crown H over c, set back .back D; per side a horn of
 * .seg H segments, .w W across at the root tapering to a point, rooted .hornX W out and .hornY H under the crown, the first segment leaned .out rad
 * outward, each next kinked .bend rad back up and .curl in; .bands pale bands; the hair .strands slabs a side from the cap's foot down .hair H,
 * .strandW W wide, behind the eyes. The cap dark team (deepTeam .shade), lit cloth self-lit .12; horns dark .horn, tips and bands pale .bone; hair
 * .hairC; out of the glow. The hood hat is off (unitVisuals).
 */
const NECRO_CAP = { cap: 1.14, capD: 1.08, brow: 0.04, crown: 0.62, back: 0.06, seg: [0.5, 0.42, 0.34], w: 0.24, hornX: 0.4, hornY: 0.22, out: 1.05,
  bend: 0.62, curl: 0.18, bands: 2, strands: 3, hair: 1.0, strandW: 0.13, shade: 0.42,
  horn: new Color3(0.16, 0.05, 0.05), bone: new Color3(0.86, 0.78, 0.62), hairC: new Color3(0.09, 0.05, 0.05) };
export function necromancerHornCap(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const K = NECRO_CAP, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const capC = deepTeam(team, K.shade);
  const capM = mf.get("cloth", capC, { emissive: capC.scale(0.12), roughness: 1 });
  const hornM = mf.get("cloth", K.horn, { emissive: K.horn.scale(0.3), roughness: 1 });
  const boneM = mf.get("cloth", K.bone, { emissive: K.bone.scale(0.3), roughness: 1 });
  const hairM = mf.get("cloth", K.hairC, { emissive: K.hairC.scale(0.4), roughness: 1 });
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const eyes = eyeBoxInHead(body) ?? { lo: new Vector3(c.x - W * 0.3, c.y, c.z + D * 0.4), hi: new Vector3(c.x + W * 0.3, c.y + H * 0.15, c.z + D * 0.55) };
  const out: Mesh[] = [];
  const put = (m: Mesh, mt: Material, parent: TransformNode = head): Mesh => { m.parent = parent; m.material = mt; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  const foot = eyes.hi.y + H * K.brow, crown = c.y + H * K.crown;
  const cap = put(MeshBuilder.CreateSphere("necroCap", { diameter: 1, segments: 5, slice: 0.5 }, scene), capM);
  cap.scaling.set(W * K.cap, (crown - foot) * 2, D * K.capD); cap.position.set(c.x, foot, c.z - D * K.back);
  // the horns from the crown's sides, out, then up, curling in at the pale tip
  for (const sd of [-1, 1]) {
    let joint = new Mesh("necroHornJoint", scene); joint.parent = head; out.push(joint);
    joint.position.set(c.x + sd * W * K.hornX, crown - H * K.hornY, c.z - D * K.back);
    joint.rotation.z = -sd * K.out;
    for (let k = 0; k < K.seg.length; k++) {
      if (k > 0) joint.rotation.set(-0.12, 0, sd * (k === 1 ? K.bend : K.curl));
      const len = H * K.seg[k], w0 = W * K.w * (1 - k / K.seg.length), w1 = W * K.w * (1 - (k + 1) / K.seg.length);
      const seg = MeshBuilder.CreateCylinder("necroHorn", { height: len, diameterBottom: w0, diameterTop: Math.max(w1, W * 0.01), tessellation: 7 }, scene);
      seg.position.y = len / 2;
      put(seg, k === K.seg.length - 1 ? boneM : hornM, joint);
      if (k < K.bands) {
        const band = MeshBuilder.CreateCylinder("necroHornBand", { height: len * 0.14, diameter: w1 * 1.22 + w0 * 0.08, tessellation: 7 }, scene);
        band.position.y = len * 0.85; put(band, boneM, joint);
      }
      const next = new Mesh("necroHornJoint", scene); next.parent = joint; next.position.y = len; out.push(next);
      joint = next;
    }
  }
  // lank hair hanging from under the cap's sides, behind the eyes
  for (const sd of [-1, 1]) for (let s = 0; s < K.strands; s++) {
    const x = c.x + sd * (W * K.cap * 0.5 - W * K.strandW * (0.5 + s * 0.6));
    const z = c.z - D * 0.05 - s * D * 0.22;
    const len = H * K.hair * (1 - s * 0.12);
    const strand = MeshBuilder.CreateBox("necroHair", { width: W * K.strandW, height: len, depth: D * 0.16 }, scene);
    strand.position.set(x + sd * W * 0.06, foot - len / 2 + H * 0.12, z); strand.rotation.z = sd * 0.06;
    put(strand, hairM);
  }
  return out;
}

/*
 * [S] 537 (banshee a.2) the Banshee's crown (audit 527 "a flat grey dish round the neck (the base hood) with no crown - TABS: a large team-coloured
 * fan crown with gold spikes standing behind the head"; card Appearance "wears a crown"; secret.banshee.red.png: an upright half-disc fan of team
 * plates behind the head, its foot at the eyes, its rim a head and a half across, rising about half a head over the crown; gold ribs run from its
 * foot out to the rim, a gold spike stands out of the rim at the top and at each side, smaller ones between). BANSHEE_CROWN in the head box
 * (W, H, D, c): the fan a half-disc .r W in radius, .thick D thick, its axis through the head front-to-back, its foot .foot H over c and .back D
 * behind c, leaning back .lean rad; .ribs gold ribs .ribW W wide from the foot to the rim at even angles over the half; a gold spike out of the
 * rim at each rib's end, .spike W long (the middle .top x that), .spikeW W across at the root. Team cloth saturated (c^2) x.shade self-lit .15;
 * gold lit .gold self-lit .3; out of the glow. The hood hat is off (unitVisuals).
 */
// 537.5b r .82 -> 1.3, foot .05 -> .2, back .42 -> .5 (look: the fan hid behind her head, only its spikes showing)
const BANSHEE_CROWN = { r: 1.3, thick: 0.08, foot: 0.2, back: 0.5, lean: 0.18, ribs: 5, ribW: 0.07, spike: 0.26, top: 1.5, spikeW: 0.14, shade: 0.9,
  gold: new Color3(0.85, 0.6, 0.15) };
export function bansheeCrown(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const K = BANSHEE_CROWN, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const teamC = new Color3(team.r * team.r, team.g * team.g, team.b * team.b).scale(K.shade);
  const teamM = mf.get("cloth", teamC, { emissive: teamC.scale(0.15), roughness: 1 });
  const gold = mf.get("cloth", K.gold, { emissive: K.gold.scale(0.3), roughness: 1 });
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const out: Mesh[] = [];
  const fan = new TransformNode("bansheeCrown", scene);
  fan.parent = head; fan.position.set(c.x, c.y + H * K.foot, c.z - D * K.back); fan.rotation.x = -K.lean;
  const put = (m: Mesh, mt: Material): Mesh => { m.parent = fan; m.material = mt; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  const R = W * K.r;
  // the half-disc: a cylinder arc along local z (RotationX(+PI/2) stands its half up, as the gravestone tops)
  const disc = put(MeshBuilder.CreateCylinder("bansheeCrownFan", { height: D * K.thick, diameter: R * 2, tessellation: 14, arc: 0.5 }, scene), teamM);
  disc.rotation.x = Math.PI / 2;
  for (let i = 0; i < K.ribs; i++) {
    const a = -Math.PI / 2 + (Math.PI * (i + 0.5)) / K.ribs; // from the right side round over the top to the left
    const dx = Math.sin(a), dy = Math.cos(a);
    const rib = put(MeshBuilder.CreateBox("bansheeCrownRib", { width: W * K.ribW, height: R * 0.96, depth: D * K.thick * 1.3 }, scene), gold);
    rib.rotation.z = -a; rib.position.set(dx * R * 0.48, dy * R * 0.48, D * K.thick * 0.2);
    const len = W * K.spike * (i === (K.ribs - 1) / 2 ? K.top : 1);
    const spike = put(MeshBuilder.CreateCylinder("bansheeCrownSpike", { height: len, diameterBottom: W * K.spikeW, diameterTop: 0, tessellation: 4 }, scene), gold);
    spike.rotation.z = -a; spike.position.set(dx * (R + len * 0.45), dy * (R + len * 0.45), 0);
  }
  // the gold rim at the fan's two flat feet, so its sides end in gold as the render's
  for (const sd of [-1, 1]) {
    const foot = put(MeshBuilder.CreateCylinder("bansheeCrownSpike", { height: W * K.spike, diameterBottom: W * K.spikeW, diameterTop: 0, tessellation: 4 }, scene), gold);
    foot.rotation.z = -sd * Math.PI / 2; foot.position.set(sd * (R + W * K.spike * 0.4), W * 0.03, 0);
  }
  return out;
}

/*
 * [S] 537 (banshee a.3) the Banshee's face (audit 527 "the head is a plain round ball with no eyes - TABS: two glowing white eyes on a long, pointed
 * team face"; secret.banshee.red.png: the face a long team wedge from the brow down past the jaw, narrowing to a point at the collar, two big round
 * glowing white eyes side by side high on it). BANSHEE_FACE in the head box (W, H, D, c): a four-sided wedge .long H tall, its top .top H over c
 * and .wide W across, narrowing to a point at its foot, .deep D deep, standing .ahead D forward of c; the body's bead eyes hidden; in their place
 * two white eyes .eye W across, .eyeX W each side of the middle, .eyeY H over c, set into the wedge's front. The wedge in the head's own material
 * (the team ghost skin); the eyes unlit white over 1 (LESSONS 442), left in the glow so they shine.
 */
// 537.6b wide .82 -> 1.0, ahead .16 -> .32, top .32 -> .4, long 1.25 -> 1.5 (look: the wedge sank inside the head ball, no point showing)
const BANSHEE_FACE = { long: 1.5, top: 0.4, wide: 1.0, deep: 0.62, ahead: 0.32, eye: 0.27, eyeX: 0.19, eyeY: 0.12, white: new Color3(1.3, 1.3, 1.4) };
export function bansheeFace(scene: Scene, body: ArticulatedBody): Mesh[] {
  const F = BANSHEE_FACE, mf = getMaterialFactory();
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  for (const m of body.allMeshes) if (/_[lr]Eye(Rim)?$/.test(m.name)) m.isVisible = false;
  const out: Mesh[] = [];
  const wedge = MeshBuilder.CreateCylinder("bansheeFace", { height: H * F.long, diameterTop: W * F.wide * Math.SQRT2, diameterBottom: 0, tessellation: 4 }, scene);
  // turn the square's faces front and side and bake that (unparented: the bake takes the world matrix), then parent and squash in the head frame
  wedge.rotation.y = Math.PI / 4; wedge.bakeCurrentTransformIntoVertices();
  wedge.parent = head; wedge.scaling.z = (F.deep * D) / (W * F.wide);
  wedge.position.set(c.x, c.y + H * F.top - (H * F.long) / 2, c.z + D * F.ahead);
  wedge.material = head.material; wedge.convertToFlatShadedMesh(); out.push(wedge);
  const white = mf.get("unlit", F.white, { emissive: F.white });
  const front = c.z + D * F.ahead + (F.deep * D) / 2;
  for (const sd of [-1, 1]) {
    const eye = MeshBuilder.CreateIcoSphere("bansheeEye", { radius: (W * F.eye) / 2, subdivisions: 2 }, scene);
    eye.parent = head; eye.scaling.z = 0.6; eye.position.set(c.x + sd * W * F.eyeX, c.y + H * F.eyeY, front - W * F.eye * 0.12);
    eye.material = white; out.push(eye);
  }
  return out;
}

/*
 * [S] 537 (banshee a.4) the Banshee's hair (audit 527 "no hair - TABS: long dark wild hair framing the face"; secret.banshee.red.png: near-black hair
 * in loose wavy locks down both sides of the face to the shoulders, splaying out at the ends, a fringe of short spiky tufts over the top of the head
 * under the crown, a dark mass behind). BANSHEE_HAIR in the head box (W, H, D, c): per side .locks locks from the head's side (.x W out, from .from D
 * forward to the back), each two flat segments .seg H long, .w W wide, the upper splayed .splay rad out, the lower kinked .kink back in and out by
 * turns (wild); .tufts tufts .tuft H tall over the top from side to side, leaning out; a back mass .backW W wide, .backH H tall behind the head.
 * Near-black lit cloth self-lit .4 (LESSONS 494), out of the glow.
 */
// 537.7b x .44 -> .58, w .16 -> .22, seg .55/.5 -> .7/.6 (look: the locks sat inside the head's sides)
const BANSHEE_HAIR = { locks: 4, x: 0.58, from: 0.18, seg: [0.7, 0.6], w: 0.22, splay: 0.22, kink: 0.35, tufts: 7, tuft: 0.28, backW: 0.95, backH: 1.2,
  dark: new Color3(0.08, 0.06, 0.07) };
export function bansheeHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const K = BANSHEE_HAIR, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const hairM = mf.get("cloth", K.dark, { emissive: K.dark.scale(0.4), roughness: 1 });
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const out: Mesh[] = [];
  const put = (m: Mesh, parent: TransformNode): Mesh => { m.parent = parent; m.material = hairM; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  const top = c.y + H * 0.42;
  for (const sd of [-1, 1]) for (let i = 0; i < K.locks; i++) {
    const t = i / (K.locks - 1);
    let joint = new TransformNode("bansheeLock", scene); joint.parent = head;
    joint.position.set(c.x + sd * W * (K.x + 0.04 * (i % 2)), top - H * 0.08 * i, c.z + D * K.from - D * 0.5 * t);
    joint.rotation.set(0.12 * (i % 2 ? 1 : -1), 0, Math.PI - sd * (K.splay + 0.06 * i)); // hang down (+y turned to -y), splayed out
    for (let k = 0; k < K.seg.length; k++) {
      const len = H * K.seg[k] * (1 - 0.08 * i);
      if (k > 0) joint.rotation.set(0.1, 0, sd * K.kink * (i % 2 ? 1 : -0.6));
      const seg = MeshBuilder.CreateBox("bansheeHair", { width: W * K.w * (1 - 0.3 * k), height: len, depth: D * 0.1 }, scene);
      seg.position.y = len / 2; put(seg, joint);
      const next = new TransformNode("bansheeLock", scene); next.parent = joint; next.position.y = len; joint = next;
    }
  }
  for (let i = 0; i < K.tufts; i++) {
    const u = i / (K.tufts - 1) - 0.5;
    const tuft = MeshBuilder.CreateCylinder("bansheeHairTuft", { height: H * K.tuft, diameterBottom: W * 0.16, diameterTop: 0, tessellation: 4 }, scene);
    tuft.rotation.set(-0.25, 0, -u * 1.6); tuft.position.set(c.x + u * W * 0.85, top + H * 0.02 - Math.abs(u) * H * 0.2 + H * K.tuft * 0.3, c.z + D * 0.05);
    put(tuft, head);
  }
  const back = MeshBuilder.CreateBox("bansheeHairBack", { width: W * K.backW, height: H * K.backH, depth: D * 0.3 }, scene);
  back.position.set(c.x, top - H * K.backH / 2 + H * 0.1, c.z - D * 0.38); put(back, head);
  return out;
}

/*
 * [S] 530 (a.2) the Witch's hood-hat (secret.witch.red.png: a tall team-coloured hat with no brim at all; its foot is a hood that comes down round
 * the face to the jaw, wider at the bottom, the face showing in its open front; over the head it narrows into a long crooked spire that bends back
 * and to one side, kinked twice). WITCH_HOOD in the head box (W, H, D, c): the hood a 9-sided frustum from .chin H under the head's foot to .crown
 * H over its top, .foot W across at the bottom and .top W at the top, set back .back D so the face stands out of its open front; a brow lip, a
 * flattened four-sided point over the forehead tipped down .lip rad; the spire three tapering segments of .seg H each, .w W across at the base,
 * each kinked .bend rad back and .twist rad sideways on the one below. Team lit cloth self-lit .12, out of the glow. The hat is hers (and her
 * clones'); unitVisuals sets no witch_hat.
 */
// 530.7b foot 1.42->1.7, top 1.05->1.25, back .28->.45, seg .62/.62/.66->.95/.95/1.0, w .82/.55/.3->.95/.62/.32, team squared x.9 (look: hood and spire read as a slim cap)
const WITCH_HOOD = { chin: 0.12, crown: 0.12, foot: 1.7, top: 1.25, back: 0.45, lip: 0.5, seg: [0.95, 0.95, 1.0], w: [0.95, 0.62, 0.32], bend: 0.22, twist: 0.12, shade: 0.9 };
export function witchHoodHat(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const K = WITCH_HOOD, glow = scene.getGlowLayerByName("glow");
  const tc = new Color3(team.r * team.r, team.g * team.g, team.b * team.b).scale(K.shade);
  const cloth = getMaterialFactory().get("cloth", tc, { emissive: tc.scale(0.12), roughness: 1 });
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const out: Mesh[] = [];
  const put = (m: Mesh, parent: TransformNode = head): Mesh => { m.parent = parent; m.material = cloth; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  const bot = c.y - H / 2 - H * K.chin, crown = c.y + H / 2 + H * K.crown, hh = crown - bot;
  const hood = put(MeshBuilder.CreateCylinder("witchHood", { height: hh, diameterBottom: W * K.foot, diameterTop: W * K.top, tessellation: 9 }, scene));
  hood.position.set(c.x, (bot + crown) / 2, c.z - D * K.back);
  // the brow lip: the hood's front point over the forehead
  const lipHinge = new Mesh("witchHoodLipHinge", scene); lipHinge.parent = head;
  lipHinge.position.set(c.x, crown - H * 0.04, c.z - D * K.back + W * K.top * 0.5); lipHinge.rotation.x = K.lip;
  const lip = MeshBuilder.CreateCylinder("witchHoodLip", { height: H * 0.42, diameterTop: W * 0.62, diameterBottom: 0, tessellation: 4 }, scene);
  lip.rotation.y = Math.PI / 4; lip.bakeCurrentTransformIntoVertices(); lip.rotation.y = 0;
  lip.scaling.z = 0.3; lip.position.set(0, -H * 0.21, 0);
  put(lip, lipHinge);
  out.push(lipHinge);
  // the crooked spire
  let joint: Mesh = new Mesh("witchSpireJoint", scene); joint.parent = head;
  joint.position.set(c.x, crown - H * 0.02, c.z - D * K.back);
  out.push(joint);
  for (let k = 0; k < K.seg.length; k++) {
    if (k > 0) joint.rotation.set(-K.bend, 0, (k % 2 ? 1 : -0.5) * K.twist);
    const len = H * K.seg[k], w0 = W * K.w[k], w1 = k + 1 < K.w.length ? W * K.w[k + 1] : 0;
    const seg = MeshBuilder.CreateCylinder("witchSpire", { height: len, diameterBottom: w0, diameterTop: w1, tessellation: 9 }, scene);
    seg.position.y = len / 2;
    put(seg, joint);
    const next = new Mesh("witchSpireJoint", scene); next.parent = joint; next.position.y = len; out.push(next);
    joint = next;
  }
  return out;
}

/*
 * [S] 536 (a.5) the Witch's broom (audit 527: "she stands on her feet - TABS: she rides a long floating broom that hangs below her between the
 * legs"; secret.witch.red.png, .blue.png, card Appearance "a Stiffy riding a floating broom": a long dark red-brown pole under her crotch, the same on
 * both teams, running out ahead of her and sloping down to the front, a little thicker toward its far end; she sits on it, her bone legs hanging
 * either side of it, her feet clear of the ground). WITCH_BROOM in her standing height H: she floats .lift H up (proceduralAnimation REAPER_HOVER via
 * a "reaperHover" mark on the hip: legs hang loose); the pole on the hip under the pelvis's foot (.seat H below it), .ahead H out in front and .behind
 * H back, pitched .pitch rad nose-down, .thin H across at the seat swelling to .thick H at the front; behind the seat a short bristle bundle .brush H
 * long, .brushW H across at its foot, tied on with a band. Dark red-brown lit cloth (.wood), self-lit .3, out of the glow.
 */
// 536.1b lift .12 -> .2, pitch .32 -> .18, brush .2 -> .28, brushW .12 -> .18 (look: feet read on the ground, pole stabbing down, brush lost)
// 537 [P] lift .2 -> .3, pitch .18 -> .9 (critic 536: a level stick at the waist; the ref's pole hangs steeply down between her legs to the ground)
/*
 * [S] 538 (a.5) the broom rebuilt as the render's club (critic 537: "inverted, thin end on the grass, brush up behind, feet grounded"; secret.witch.red.png:
 * no bristles anywhere; one dark red-brown pole from her crotch hanging almost straight down between the dangling legs, leaning a little out toward the
 * front, thin at the seat and swelling over its lower third into a fat club end ~2.5x the seat's width, that end a hand clear of the ground, lower than
 * her feet). WITCH_BROOM (H her standing height): she floats .lift H up (REAPER_HOVER, legs hang); the pole's top .seat H under the pelvis's foot,
 * pitched .lean rad off straight down toward her front; its length runs from the seat to .clear H over the ground (the ground read off her feet in the
 * hip frame, plus the lift); upper shaft .thin H across to .mid H at .neck of the length, then the club .mid H to .thick H, closed by a blunt cap.
 */
const WITCH_BROOM = { lift: 0.38, seat: 0.0, lean: 0.24, clear: 0.1, thin: 0.045, mid: 0.065, thick: 0.115, neck: 0.55,
  wood: new Color3(0.17, 0.06, 0.045) };
export function witchBroom(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = WITCH_BROOM, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const H = body.metrics.overallHeight;
  const wood = mf.get("cloth", B.wood, { emissive: B.wood.scale(0.3), roughness: 1 });
  const mark = new TransformNode("reaperHover", scene); mark.parent = body.hip; mark.position.y = B.lift;
  const pelvis = body.hip.getChildMeshes(true).find((m) => /_pelvis$/.test(m.name));
  const pFoot = pelvis ? pelvis.position.y - pelvis.getBoundingInfo().boundingBox.extendSize.y * pelvis.scaling.y : 0;
  // the ground in the hip frame: the lowest point of the feet as built (standing), before the hover lifts her
  const toHip = body.hip.computeWorldMatrix(true).clone().invert();
  let ground = Infinity;
  for (const m of body.allMeshes.filter((x) => /_[lr]FootM$/.test(x.name))) {
    m.computeWorldMatrix(true);
    for (const v of m.getBoundingInfo().boundingBox.vectorsWorld) ground = Math.min(ground, Vector3.TransformCoordinates(v, toHip).y);
  }
  if (!Number.isFinite(ground)) ground = pFoot - 0.5 * H;
  const seatY = pFoot - B.seat * H;
  const len = Math.max(0.2 * H, (seatY - ground + (B.lift - B.clear) * H) / Math.cos(B.lean));
  // the pole's frame: origin at the seat, -y down along the pole, leaned toward her front (+z)
  const pole = new TransformNode("witchBroom", scene);
  pole.parent = body.hip; pole.position.set(0, seatY, 0.02 * H); pole.rotation.x = -B.lean;
  const out: Mesh[] = [];
  const put = (m: Mesh): Mesh => { m.parent = pole; m.material = wood; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  const upper = len * B.neck, lower = len - upper;
  const shaft = put(MeshBuilder.CreateCylinder("witchBroomPole", { height: upper, diameterTop: B.thin * H, diameterBottom: B.mid * H, tessellation: 7 }, scene));
  shaft.position.y = -upper / 2;
  const club = put(MeshBuilder.CreateCylinder("witchBroomClub", { height: lower, diameterTop: B.mid * H, diameterBottom: B.thick * H, tessellation: 7 }, scene));
  club.position.y = -upper - lower / 2;
  const cap = put(MeshBuilder.CreateCylinder("witchBroomTip", { height: B.thick * H * 0.35, diameterTop: B.thick * H, diameterBottom: B.thick * H * 0.7, tessellation: 7 }, scene));
  cap.position.y = -len - B.thick * H * 0.17;
  return out;
}

/*
 * [S] 536 (a.4) the Witch's tattered robe (audit 527: "no robe - TABS: a tattered dark team robe/tunic with a lighter team sash and belt";
 * secret.witch.red.png, .blue.png, card Appearance "a tattered robe with trousers that have been ripped to its femurs": a dark team tunic over the
 * whole rib cage from just under the collarbone to mid-thigh, a little wider at the hem, its hem cut into rag points; two light team bands down its
 * front edges from the shoulders to the hem; a light team sash knotted round the waist with its end hanging at the front, a brown belt under it;
 * dark team short sleeves to the elbow; the collarbone and neck bone showing above). WITCH_ROBE in the rib cage's box (the ribs' and collarbone's
 * bounds in the torso frame, W across, D deep): the tunic a 9-sided frustum from .top under the collarbone's top to .hem of the way from the hip
 * joints to the knees, .out W across at the top and .flare W at the hem, .deep of its width deep; .rags rag points .rag of the hem's drop long; the
 * bands .band W wide at .bandX W each side of the middle; the sash .sash W tall at .waist of the way from the hips up to the collar, .sashOut of the
 * tunic there, its tail .tail W long; the belt .belt W tall under it; the sleeves limbShell .sleeve of the upper arm, .sleeveOut thick. Team cloth
 * saturated (c^2): dark x.dark, light lerped .light to white; self-lit .12, out of the glow. Her shorts are spookyDress stiffyShorts in the dark cloth.
 */
const WITCH_ROBE = { top: 0.04, hem: 0.45, out: 1.2, flare: 1.5, deep: 0.85, rags: 9, rag: 0.35, band: 0.12, bandX: 0.2, sash: 0.13, waist: 0.12,
  sashOut: 1.04, tail: 0.32, belt: 0.06, sleeve: 0.8, sleeveOut: 3.4, dark: 0.42, light: 0.22, leather: new Color3(0.28, 0.13, 0.06) };
export function witchRobe(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const R = WITCH_ROBE, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const sq = new Color3(team.r * team.r, team.g * team.g, team.b * team.b);
  const darkC = sq.scale(R.dark), lightC = Color3.Lerp(sq, Color3.White(), R.light);
  const dark = mf.get("cloth", darkC, { emissive: darkC.scale(0.12), roughness: 1 });
  const light = mf.get("cloth", lightC, { emissive: lightC.scale(0.12), roughness: 1 });
  const leather = mf.get("cloth", R.leather, { emissive: R.leather.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, mt: Material, parent: TransformNode = body.torso): Mesh => {
    m.parent = parent; m.material = mt; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m;
  };
  // the rib cage's box in the torso frame
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity, yTop = -Infinity;
  const toTorso = body.torso.computeWorldMatrix(true).clone().invert();
  for (const m of body.torso.getChildMeshes(true)) {
    if (!/_rib$|_collarbone$/.test(m.name)) continue;
    m.computeWorldMatrix(true);
    for (const v of m.getBoundingInfo().boundingBox.vectorsWorld) {
      const p = Vector3.TransformCoordinates(v, toTorso);
      x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); z0 = Math.min(z0, p.z); z1 = Math.max(z1, p.z); yTop = Math.max(yTop, p.y);
    }
  }
  if (!Number.isFinite(x0)) return out;
  const W = x1 - x0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const hipY = (originIn(body.leftHip, body.torso).y + originIn(body.rightHip, body.torso).y) / 2;
  const kneeY = (originIn(body.leftKnee, body.torso).y + originIn(body.rightKnee, body.torso).y) / 2;
  const top = yTop - R.top * W, hem = hipY + (kneeY - hipY) * R.hem, long = top - hem;
  const dTop = W * R.out, dBot = W * R.flare;
  const tunic = put(MeshBuilder.CreateCylinder("witchRobe", { height: long, diameterTop: dTop, diameterBottom: dBot, tessellation: 9 }, scene), dark);
  tunic.scaling.z = R.deep; tunic.position.set(cx, (top + hem) / 2, cz);
  // rag points round the hem
  for (let i = 0; i < R.rags; i++) {
    const a = ((i + 0.5) / R.rags) * Math.PI * 2, drop = long * R.rag * (i % 3 === 1 ? 0.55 : 1);
    const rag = put(MeshBuilder.CreateCylinder("witchRobeRag", { height: drop, diameterTop: dBot * 0.32, diameterBottom: 0, tessellation: 3 }, scene), dark);
    rag.scaling.z = 0.35; rag.rotation.y = a;
    rag.position.set(cx + Math.sin(a) * dBot * 0.44, hem - drop / 2 + long * 0.01, cz + Math.cos(a) * dBot * 0.44 * R.deep);
  }
  // the light bands down the front edges, laid on the frustum's sloping front
  const zTop = cz + (dTop / 2) * R.deep, zBot = cz + (dBot / 2) * R.deep;
  for (const side of [-1, 1]) {
    const band = put(MeshBuilder.CreateBox("witchRobeBand", { width: W * R.band, height: Math.hypot(long, zBot - zTop), depth: W * 0.04 }, scene), light);
    band.rotation.x = -Math.atan2(zBot - zTop, long); // 536.2b top in, foot out along the flare (+x tips +y toward +z)
    band.position.set(cx + side * W * R.bandX * (1 + (R.flare - R.out) * 0.25), (top + hem) / 2, (zTop + zBot) / 2 - W * 0.02);
  }
  // the sash knotted round the waist, its tail hanging at the front, and the brown belt under it
  const waistY = hipY + (top - hipY) * R.waist, k = (top - waistY) / long, dWaist = dTop + (dBot - dTop) * k;
  const sash = put(MeshBuilder.CreateCylinder("witchRobeSash", { height: W * R.sash, diameter: dWaist * R.sashOut, tessellation: 9 }, scene), light);
  sash.scaling.z = R.deep; sash.position.set(cx, waistY, cz);
  const tail = put(MeshBuilder.CreateBox("witchRobeSashTail", { width: W * R.sash * 0.9, height: W * R.tail, depth: W * 0.035 }, scene), light);
  tail.rotation.z = 0.25; tail.position.set(cx - W * 0.22, waistY - W * R.tail * 0.45, cz + (dWaist / 2) * R.deep * R.sashOut + W * 0.02);
  const belt = put(MeshBuilder.CreateCylinder("witchRobeBelt", { height: W * R.belt, diameter: (dWaist + (dBot - dTop) * (W * R.sash / long)) * R.sashOut * 1.01, tessellation: 9 }, scene), leather);
  belt.scaling.z = R.deep; belt.position.set(cx, waistY - W * (R.sash + R.belt) / 2, cz);
  // short dark sleeves to the elbow
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    const s = limbShell(scene, "witchRobeSleeve", arm, 0, R.sleeve, R.sleeveOut, dark);
    glow?.addExcludedMesh(s); out.push(s);
  }
  return out;
}
/** The dark team cloth of the Witch's robe, for her shorts (WITCH_ROBE.dark). */
export function witchRobeDark(team: Color3): Color3 { return new Color3(team.r * team.r, team.g * team.g, team.b * team.b).scale(WITCH_ROBE.dark); }

/*
 * [S] 537 (necromancer a.3) the Necromancer's vest (audit 527 "no vest - TABS: a tattered dark team vest stitched with pale laces"; card Appearance
 * "two crudely stitched together pieces of cloth"; secret.necromancer.red.png: a dark team vest over the rib cage from the collarbone to just under
 * the last rib, a little wider than the ribs, its hem torn into uneven points; a dark seam straight down the front middle, crossed by five short
 * pale laces, tilted a little each way; a strap over each shoulder with two pale stitches; the neck and collarbone ends showing above, the spine
 * bare below). NECRO_VEST in the rib cage's box (ribs + collarbone bounds in the torso frame, W across): an 8-sided frustum from .top W under the
 * collarbone's top to .below W under the ribs' foot, .out W across at the top and .flare at the hem, .deep of its width deep; .rags rag points
 * .rag W long; the seam .seam W wide; .laces laces .lace W long from .laceTop to .laceLow of the vest's height; straps .strap W wide. Dark team
 * cloth (c^2 x .dark), self-lit .12; pale laces unlit (LESSONS 442); all out of the glow.
 */
/*
 * [S] 538 (necromancer a.4) his shorts (audit 527 "no shorts - TABS: ragged dark shorts with a pink rope belt over bare bone thighs";
 * secret.necromancer.red.png: the vest's dark team cloth in two short baggy legs to mid-thigh, rag-cut hems, a thin pink rope tied round the
 * pelvis; no rag skirt). spookyDress stiffyShorts in NECRO_SHORTS: hem .hem of the knee drop, the belt in .rope pink; dressSkeleton builds no
 * skirt for him (unitFactory).
 */
/*
 * [S] 538 (necromancer a.5) his boots (audit 527 "no boots - TABS: tall laced worn brown boots to the knee"; secret.necromancer.red.png, card
 * "his only foot protection are some worn out boots": a worn pinkish-brown boot round the whole shin from the foot to just under the knee, far wider
 * than the bone, a little wider at the top; a row of pale crossed laces up its front). shinBoot in NECRO_BOOT: shaft .shaft of the shin tall, .round
 * of its half-width round, a slightly wider top band; .laces pale bars .lace of the shaft's width long, crossed .cross rad each way, up the front from
 * .laceLo to .laceHi of the shaft. Brown lit cloth self-lit .25, laces unlit cream (NECRO_VEST), out of the glow.
 */
const NECRO_BOOT = { shaft: 0.97, round: 2.5, cuff: 2.7, cuffH: 0.08, laces: 4, lace: 0.62, cross: 0.5, laceLo: 0.22, laceHi: 0.82,
  brown: new Color3(0.36, 0.17, 0.13) };
export function necromancerBoots(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = NECRO_BOOT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const brown = mf.get("cloth", B.brown, { emissive: B.brown.scale(0.25), roughness: 1 });
  const cream = mf.get("unlit", NECRO_VEST.cream, { emissive: NECRO_VEST.cream });
  const out = shinBoot(scene, body, "necroBoot", brown, brown, B);
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const { center: c, extendSize: s } = shin.getBoundingInfo().boundingBox;
    const foot = c.y - s.y, tall = s.y * 2 * B.shaft, w = s.x * 2 * B.round, front = c.z + s.z * B.round + 0.006;
    for (let i = 0; i < B.laces; i++) {
      const y = foot + tall * (B.laceLo + ((B.laceHi - B.laceLo) * i) / (B.laces - 1));
      for (const sgn of [-1, 1]) {
        const lace = MeshBuilder.CreateBox("necroBootLace", { width: w * B.lace, height: w * 0.09, depth: w * 0.08 }, scene);
        lace.parent = shin; lace.position.set(c.x, y, front); lace.rotation.z = sgn * B.cross;
        lace.material = cream; glow?.addExcludedMesh(lace); out.push(lace);
      }
    }
  }
  return out;
}

export const NECRO_SHORTS = { hem: 0.4, belt: 0.12, beltOut: 1.36, leather: new Color3(0.55, 0.2, 0.36) };
export function necromancerDark(team: Color3): Color3 { return new Color3(team.r * team.r, team.g * team.g, team.b * team.b).scale(NECRO_VEST.dark); }
const NECRO_VEST = { top: 0.08, below: 0.06, out: 1.16, flare: 1.24, deep: 0.88, rags: 8, rag: 0.16, seam: 0.035, laces: 5, lace: 0.2, laceTop: 0.18, laceLow: 0.85,
  strap: 0.2, dark: 0.42, cream: new Color3(0.86, 0.8, 0.66) };
export function necromancerVest(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const V = NECRO_VEST, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const darkC = new Color3(team.r * team.r, team.g * team.g, team.b * team.b).scale(V.dark);
  const dark = mf.get("cloth", darkC, { emissive: darkC.scale(0.12), roughness: 1 });
  const seamC = darkC.scale(0.45), seamM = mf.get("cloth", seamC, { emissive: seamC.scale(0.12), roughness: 1 });
  const cream = mf.get("unlit", V.cream, { emissive: V.cream });
  const out: Mesh[] = [];
  const put = (m: Mesh, mt: Material): Mesh => { m.parent = body.torso; m.material = mt; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity, yTop = -Infinity, yLow = Infinity;
  const toTorso = body.torso.computeWorldMatrix(true).clone().invert();
  for (const m of body.torso.getChildMeshes(true)) {
    if (!/_rib$|_collarbone$/.test(m.name)) continue;
    m.computeWorldMatrix(true);
    for (const v of m.getBoundingInfo().boundingBox.vectorsWorld) {
      const p = Vector3.TransformCoordinates(v, toTorso);
      x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); z0 = Math.min(z0, p.z); z1 = Math.max(z1, p.z); yTop = Math.max(yTop, p.y);
      if (/_rib$/.test(m.name)) yLow = Math.min(yLow, p.y);
    }
  }
  if (!Number.isFinite(x0) || !Number.isFinite(yLow)) return out;
  const W = x1 - x0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const top = yTop - V.top * W, hem = yLow - V.below * W, long = top - hem;
  const dTop = W * V.out, dBot = W * V.flare;
  const vest = put(MeshBuilder.CreateCylinder("necroVest", { height: long, diameterTop: dTop, diameterBottom: dBot, tessellation: 8 }, scene), dark);
  vest.scaling.z = V.deep; vest.position.set(cx, (top + hem) / 2, cz);
  // torn points round the hem, uneven
  for (let i = 0; i < V.rags; i++) {
    const a = ((i + 0.5) / V.rags) * Math.PI * 2, drop = W * V.rag * (i % 3 === 0 ? 1 : i % 3 === 1 ? 0.55 : 0.8);
    const rag = put(MeshBuilder.CreateCylinder("necroVestRag", { height: drop, diameterTop: dBot * 0.36, diameterBottom: 0, tessellation: 3 }, scene), dark);
    rag.scaling.z = 0.35; rag.rotation.y = a;
    rag.position.set(cx + Math.sin(a) * dBot * 0.44, hem - drop / 2 + W * 0.01, cz + Math.cos(a) * dBot * 0.44 * V.deep);
  }
  // the front seam laid on the frustum's sloping front, and the pale laces across it
  const zTop = cz + (dTop / 2) * V.deep, zBot = cz + (dBot / 2) * V.deep, slope = Math.atan2(zBot - zTop, long);
  const seam = put(MeshBuilder.CreateBox("necroVestSeam", { width: W * V.seam, height: Math.hypot(long, zBot - zTop), depth: W * 0.03 }, scene), seamM);
  seam.rotation.x = -slope; seam.position.set(cx, (top + hem) / 2, (zTop + zBot) / 2 + W * 0.005);
  for (let i = 0; i < V.laces; i++) {
    const k = V.laceTop + ((V.laceLow - V.laceTop) * i) / (V.laces - 1), y = top - long * k, z = zTop + (zBot - zTop) * k;
    const lace = put(MeshBuilder.CreateBox("necroVestLace", { width: W * V.lace, height: W * 0.035, depth: W * 0.03 }, scene), cream);
    lace.rotation.x = -slope; lace.rotation.z = (i % 2 ? 1 : -1) * 0.22; lace.position.set(cx + (i % 2 ? 1 : -1) * W * 0.015, y, z + W * 0.02);
  }
  // a strap over each shoulder, two pale stitches on it
  for (const side of [-1, 1]) {
    const sx = cx + side * dTop * 0.3;
    const strap = put(MeshBuilder.CreateBox("necroVestStrap", { width: W * V.strap, height: W * 0.07, depth: dTop * V.deep * 0.9 }, scene), dark);
    strap.position.set(sx, top + W * 0.03, cz);
    for (const f of [-0.22, 0.22]) {
      const st = put(MeshBuilder.CreateBox("necroVestStitch", { width: W * 0.025, height: W * 0.02, depth: W * 0.09 }, scene), cream);
      st.position.set(sx + W * f * V.strap, top + W * 0.07, cz + dTop * V.deep * 0.3);
    }
  }
  return out;
}

/*
 * [S] 532 the Wheelbarrow Dragon's driver, the Traveller (secret.wheelbarrow_dragon.red.png, .jpg; card Appearance "that goofy Traveller Unit, with
 * their Afro and overalls"; audit a.4 "a hulking slab-torsoed giant - TABS: a lanky normal-sized Traveller in team overalls"): a bare team chest and
 * bare team arms (the trunk, yoke and pads in his skin), team overalls over it: a bib on the trunk's front from BARROW_OVERALLS.lo to .hi of the
 * neck's height, .bib of the trunk across, standing .proud of it off the chest; two straps .strap across from the bib's top corners over the
 * shoulders and down the back to .backLo; and the trousers, the pelvis, thighs and shins all in the overall cloth. The cloth is the team colour
 * saturated (c^.sat, renormalised) and scaled .shade, self-lit .glow, out of the glow layer (LESSONS: team garment shade). His lanky build is
 * unitVisuals secret_wheelbarrow_dragon's proportions.
 */
const BARROW_OVERALLS = { lo: 0.0, hi: 0.56, bib: 0.66, proud: 0.035, strap: 0.14, backLo: 0.3, sat: 2, shade: 0.62, glow: 0.12 };
export function barrowDriverOveralls(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const O = BARROW_OVERALLS, glow = scene.getGlowLayerByName("glow");
  const peak = Math.max(team.r, team.g, team.b), sat = new Color3(team.r ** O.sat, team.g ** O.sat, team.b ** O.sat);
  const deep = sat.scale((peak / Math.max(sat.r, sat.g, sat.b, 1e-3)) * O.shade);
  const cloth = getMaterialFactory().get("cloth", deep, { emissive: deep.scale(O.glow), roughness: 1 });
  // bare team chest and arms; overall cloth trousers
  for (const m of [body.torsoMesh, body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm, ...body.allMeshes.filter((x) => /_yoke$|_[lr]Pad$/.test(x.name))]) {
    m.material = body.skinMaterial; glow?.addExcludedMesh(m);
  }
  for (const m of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg, ...body.allMeshes.filter((x) => /_pelvis$|_belt$/.test(x.name))]) {
    m.material = cloth; glow?.addExcludedMesh(m);
  }
  const out: Mesh[] = [];
  const put = (m: Mesh): Mesh => { m.material = cloth; m.parent = body.torso; out.push(m); return m; };
  const band = barrowTrunkBand(body, O.lo, O.hi), top = barrowTrunkBand(body, O.hi, 1);
  const across = band.maxX - band.minX, midX = (band.minX + band.maxX) / 2, thin = O.proud * across, trunk = body.neck.position.y;
  const bib = put(MeshBuilder.CreateBox("barrowDriverBib", { width: across * O.bib, height: trunk * (O.hi - O.lo), depth: thin }, scene));
  bib.position.set(midX, trunk * (O.lo + O.hi) * 0.5, band.maxZ + thin * 0.5);
  for (const side of [-1, 1]) {
    const x = midX + side * across * O.bib * 0.36;
    const front = new Vector3(x, trunk * O.hi, top.maxZ + thin * 0.5);
    const over = new Vector3(x, trunk * 1.02, (top.maxZ + top.minZ) * 0.5);
    const back = new Vector3(x, trunk * O.backLo, top.minZ - thin * 0.5);
    for (const [a, b] of [[front, over], [over, back]]) {
      const span = b.subtract(a);
      const strap = put(MeshBuilder.CreateBox("barrowDriverStrap", { width: across * O.strap, height: span.length(), depth: thin }, scene));
      strap.position.copyFrom(a.add(b).scale(0.5));
      strap.rotation.x = Math.atan2(span.z, span.y);
    }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}
// The trunk's x/z extent (torso frame) between lo and hi of the neck's height, from the torso mesh's and yoke's vertices
function barrowTrunkBand(body: ArticulatedBody, lo: number, hi: number) {
  const trunk = body.neck.position.y;
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  body.torso.computeWorldMatrix(true);
  const toTorso = body.torso.getWorldMatrix().clone().invert();
  for (const part of body.torso.getChildMeshes(true).filter((m) => m === body.torsoMesh || /_yoke$/.test(m.name))) {
    const local = part.computeWorldMatrix(true).multiply(toTorso);
    const at = part.getVerticesData("position") ?? [];
    for (let v = 0; v < at.length; v += 3) {
      const p = Vector3.TransformCoordinates(new Vector3(at[v], at[v + 1], at[v + 2]), local);
      if (p.y < trunk * lo || p.y > trunk * hi) continue;
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
    }
  }
  if (!Number.isFinite(minX)) { const e = body.torsoMesh.getBoundingInfo().boundingBox.extendSize; minX = -e.x; maxX = e.x; minZ = -e.z; maxZ = e.z; }
  return { minX, maxX, minZ, maxZ };
}

/*
 * [S] 532 (a.3) the Cavalry knight's armour (secret.cavalry.red.png, .png: a regular Knight in grey plate: rounded steel pauldrons on both shoulders,
 * a steel gorget round the neck over the chest top, steel arms; a team tabard hung over the plate front and back, narrower than the trunk so the
 * grey plate shows at its sides, from under the gorget to below the hips; audit a.3 "bare team with a dark collar"). CAV_ARMOUR in the trunk mesh's
 * box as the torso joint sees it (c, half size e): the trunk, yoke and pads go steel; a tabard front and back .tabW e.x*2 wide from .tabTop e.y over
 * c down to .tabLo e.y under it, standing .proud e.z off the plate; a gorget plate .gorW e.x*2 wide and .gorH e.y tall over the tabard's top, a
 * steel collar ring .collar e.x*2 across round the neck; per upper arm the arm steel and a pauldron, a half dome .paul of the limb's radius round
 * over its top and a lame ring under it. Steel = CAV_HELM's pale lit cloth; tabard team self-lit .12; all out of the glow.
 */
const CAV_ARMOUR = { tabW: 0.72, tabTop: 0.62, tabLo: 1.45, proud: 1.06, gorW: 0.82, gorH: 0.32, collar: 0.66, paul: 2.5, lame: 2.1 };
export function cavalryArmour(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = CAV_ARMOUR, glow = scene.getGlowLayerByName("glow"), mf = getMaterialFactory();
  const steel = mf.get("cloth", CAV_HELM.steel, { emissive: CAV_HELM.steel.scale(0.15), roughness: 0.9 });
  const tabard = mf.get("cloth", team, { emissive: team.scale(0.12), roughness: 1 });
  for (const m of [body.torsoMesh, body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm, ...body.allMeshes.filter((x) => /_yoke$|_[lr]Pad$/.test(x.name))]) {
    m.material = steel; glow?.addExcludedMesh(m);
  }
  const torso = body.torsoMesh, { center, extendSize } = torso.getBoundingInfo().boundingBox;
  const c = torso.position.add(center.multiply(torso.scaling)), e = extendSize.multiply(torso.scaling);
  const out: Mesh[] = [];
  const put = (m: Mesh, mt: Material, parent: TransformNode = body.torso): Mesh => { m.parent = parent; m.material = mt; out.push(m); return m; };
  const tabH = e.y * (C.tabTop + C.tabLo), tabY = c.y + e.y * (C.tabTop - C.tabLo) / 2;
  for (const side of [-1, 1]) {
    const t = put(MeshBuilder.CreateBox("cavTabard", { width: e.x * 2 * C.tabW, height: tabH, depth: e.z * 0.1 }, scene), tabard);
    t.position.set(c.x, tabY, c.z + side * e.z * C.proud);
  }
  const gor = put(MeshBuilder.CreateBox("cavGorget", { width: e.x * 2 * C.gorW, height: e.y * C.gorH, depth: e.z * 0.12 }, scene), steel);
  gor.position.set(c.x, c.y + e.y * (C.tabTop + C.gorH / 2), c.z + e.z * (C.proud + 0.04));
  const ring = put(MeshBuilder.CreateCylinder("cavGorgetCollar", { height: e.y * 0.2, diameterTop: e.x * 2 * C.collar * 0.82, diameterBottom: e.x * 2 * C.collar, tessellation: 8 }, scene), steel);
  ring.scaling.z = Math.min(1.4, (e.z * 2.2) / (e.x * 2 * C.collar)); ring.position.set(c.x, c.y + e.y * 1.02, c.z);
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    const L = limbBox(arm), r = Math.max(L.wide, L.deep), top = L.mid + L.half, joint = arm.parent as TransformNode;
    const dome = put(MeshBuilder.CreateSphere("cavPauldron", { diameter: 1, segments: 5, slice: 0.5 }, scene), steel, joint);
    dome.scaling.set(r * C.paul, r * C.paul * 0.8, r * C.paul); dome.position.set(arm.position.x, top - r * 0.9, arm.position.z);
    const lame = put(MeshBuilder.CreateCylinder("cavPauldronLame", { height: r * 0.7, diameter: r * C.lame, tessellation: 8 }, scene), steel, joint);
    lame.position.set(arm.position.x, top - r * 1.25, arm.position.z);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/*
 * [S] 532 (a.3) the Gatling Gun operator's shirt and vest (secret.gatling_gun.red.png, .jpg; card Appearance "a nice beige shirt and a vest in blue
 * or red"; audit a.3 "plain team"): a long-sleeved beige shirt (the trunk, yoke, pads and both arms in it) under a fitted team vest closed from the
 * belt to a V at the chest, the beige showing in the V. GATLING_VEST in the yoke's half-sizes on the torso joint (BANK_VEST's cut): back and side
 * panels .out off the yoke from .top to .low of its height; the front closed below the V's point (.vee of the height down) and above it in .rows
 * strips opening to .open of the half-width at the top. Beige unlit (cream reads grey lit in shade, LESSONS), vest the team colour saturated
 * (c^2, renormalised) x .shade, self-lit .12; out of the glow. Crank gunner only (the loader keeps his bandana and plain dress).
 */
const GATLING_VEST = { out: 1.1, thick: 0.08, top: 0.98, low: 0.95, vee: 0.5, open: 0.6, rows: 5, shade: 0.72, beige: new Color3(0.86, 0.76, 0.52) };
export function gatlingGunnerShirt(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const V = GATLING_VEST, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const beige = mf.get("unlit", V.beige, { emissive: V.beige });
  const peak = Math.max(team.r, team.g, team.b), sat = new Color3(team.r ** 2, team.g ** 2, team.b ** 2);
  const deep = sat.scale((peak / Math.max(sat.r, sat.g, sat.b, 1e-3)) * V.shade);
  const vestM = mf.get("cloth", deep, { emissive: deep.scale(0.12), roughness: 1 });
  const yoke = body.allMeshes.find((m) => m.name.endsWith("_yoke")) ?? body.torsoMesh;
  for (const m of [body.torsoMesh, body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm, ...body.allMeshes.filter((x) => /_yoke$|_[lr]Pad$/.test(x.name))]) {
    m.material = beige; glow?.addExcludedMesh(m);
  }
  const T = limbBox(yoke);
  const top = T.mid + T.half * V.top, low = T.mid - T.half * V.low, h = top - low, cy = (top + low) / 2;
  const wx = T.wide * V.out, dz = T.deep * V.out, th = T.deep * V.thick;
  const out: Mesh[] = [];
  const box = (name: string, w: number, hh: number, d: number, x: number, y: number, z: number): Mesh => {
    const b = MeshBuilder.CreateBox(name, { width: w, height: hh, depth: d }, scene);
    b.parent = body.torso; b.position.set(x, y, z); b.material = vestM; glow?.addExcludedMesh(b); out.push(b);
    return b;
  };
  box("gatlingVestBack", wx * 2 + th, h, th, 0, cy, -dz);
  for (const side of [-1, 1]) box("gatlingVestSide", th, h, dz * 2 + th, side * wx, cy, 0);
  const point = top - h * V.vee;
  box("gatlingVestFront", wx * 2 + th, point - low, th, 0, (point + low) / 2, dz);
  const rowH = (top - point) / V.rows;
  for (let k = 0; k < V.rows; k++) {
    const t = (k + 0.5) / V.rows, gap = wx * V.open * (1 - t);
    const y = top - rowH * (k + 0.5), w = wx + th / 2 - gap;
    for (const side of [-1, 1]) box("gatlingVestLapel", w, rowH * 1.04, th, side * (gap + w / 2), y, dz);
  }
  return out;
}

/*
 * [S] 532 (a.5) the Skeleton Giant's greaves (secret.skeleton_giant.red.png: big team-coloured greaves over the bare bone shins, from just under
 * the knee to above the ankle, wide and squarish, flaring a little at the top, the bone foot below; card Appearance "a Greek-style helmet and
 * greaves"). GIANT_GREAVE on each shin (limbBox: its length 2*half in the knee joint's frame, 0 its top, 1 the ankle): an 8-sided shell from .from
 * to .to of the way down, .top of the shin's length across at the top tapering to .foot at the bottom, deeper .deep than wide; a rim ring .rim
 * of the length tall round its top, .rimOut wider. GIANT_HELM's team shade (deepTeam .shade), lit cloth self-lit .12, out of the glow; the rim a
 * shade darker so the top edge reads.
 */
const GIANT_GREAVE = { from: 0.06, to: 0.86, top: 0.36, foot: 0.27, deep: 1.12, rim: 0.07, rimOut: 1.1, shade: 0.85 };
export function skeletonGiantGreaves(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const G = GIANT_GREAVE, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const col = deepTeam(team, G.shade), dark = col.scale(0.72);
  const cloth = mf.get("cloth", col, { emissive: col.scale(0.12), roughness: 1 });
  const rimM = mf.get("cloth", dark, { emissive: dark.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const L = limbBox(shin), len = L.half * 2, top = L.mid + L.half, joint = shin.parent as TransformNode;
    const yTop = top - G.from * len, yBot = top - G.to * len;
    const shell = MeshBuilder.CreateCylinder("giantGreave", { height: yTop - yBot, diameterTop: len * G.top, diameterBottom: len * G.foot, tessellation: 8 }, scene);
    shell.parent = joint; shell.position.set(shin.position.x, (yTop + yBot) / 2, shin.position.z); shell.scaling.z = G.deep; shell.material = cloth;
    const rim = MeshBuilder.CreateCylinder("giantGreaveRim", { height: len * G.rim, diameter: len * G.top * G.rimOut, tessellation: 8 }, scene);
    rim.parent = joint; rim.position.set(shin.position.x, yTop - (len * G.rim) / 2, shin.position.z); rim.scaling.z = G.deep; rim.material = rimM;
    out.push(shell, rim);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  out.push(...giantBoneFeet(scene, body));
  return out;
}

/*
 * [S] 536 (a.3; CONFIRM 533 "oversized cream block feet - TABS: small thin bone feet below the greaves"; secret.skeleton_giant.blue.png: under each
 * greave a slim bone foot, about as wide as the greave's foot, low, reaching a little forward). GIANT_FEET: the body's foot box (cuff + toe) hidden;
 * in its place, in the knee frame, a bone foot .wide of the old box's width, .tall of its height, .long of its length, sole on the old sole, its back
 * at the old heel; an ankle knob .knob of the new width across on its top at the back. The foot's own bone material.
 * [S] 537 (a.3 again; critic 536 "still greave-wide boxes"): no box. Each foot is a thin bone: a six-sided wedge .wide of the old box's width at
 * the heel narrowing to .toe of that at the toes, .long of its length forward from the old heel, .tall of its height, sole on the old sole; a
 * round heel knob .heel of the wedge's heel width across at its back; a thin ankle peg .peg of the heel width across from the wedge's top up
 * .pegUp of the old height into the greave's mouth, so a bone ankle shows between greave and foot.
 */
const GIANT_FEET = { wide: 0.34, toe: 0.55, tall: 0.36, long: 0.86, heel: 1.05, peg: 0.5, pegUp: 0.6 };
function giantBoneFeet(scene: Scene, body: ArticulatedBody): Mesh[] {
  const F = GIANT_FEET, out: Mesh[] = [];
  for (const knee of [body.leftKnee, body.rightKnee]) {
    const old = knee.getChildMeshes(true).find((m) => /_[lr]FootM$/.test(m.name));
    if (!old) continue;
    const bb = old.getBoundingInfo().boundingBox, s = old.scaling, p = old.position;
    const lo = new Vector3(p.x + bb.minimum.x * s.x, p.y + bb.minimum.y * s.y, p.z + bb.minimum.z * s.z);
    const hi = new Vector3(p.x + bb.maximum.x * s.x, p.y + bb.maximum.y * s.y, p.z + bb.maximum.z * s.z);
    const H0 = hi.y - lo.y, w = (hi.x - lo.x) * F.wide, h = H0 * F.tall, d = (hi.z - lo.z) * F.long, cx = (lo.x + hi.x) / 2;
    old.isVisible = false;
    // the wedge: a cylinder along +y (heel at -y, toes at +y) laid forward (RotationX(+PI/2) tips +y to +z), squashed to .tall
    const foot = MeshBuilder.CreateCylinder("giantBoneFoot", { height: d, diameterBottom: w, diameterTop: w * F.toe, tessellation: 6 }, scene);
    foot.parent = knee; foot.rotation.x = Math.PI / 2; foot.scaling.z = h / w;
    foot.position.set(cx, lo.y + h / 2, lo.z + d / 2); foot.material = old.material;
    const knob = MeshBuilder.CreateIcoSphere("giantBoneAnkle", { radius: (w * F.heel) / 2, subdivisions: 1 }, scene);
    knob.parent = knee; knob.position.set(cx, lo.y + h * 0.55, lo.z + w * 0.35); knob.material = old.material;
    const pegH = H0 * F.pegUp;
    const peg = MeshBuilder.CreateCylinder("giantBoneAnklePeg", { height: pegH, diameter: w * F.peg, tessellation: 6 }, scene);
    peg.parent = knee; peg.position.set(cx, lo.y + h * 0.7 + pegH / 2, lo.z + w * 0.45); peg.material = old.material;
    for (const m of [foot, knob, peg]) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); out.push(m); }
  }
  return out;
}

/*
 * [R] 535 (bomb_cannon a.1) the Bomb Cannon's one crewman on foot (secret.bomb_cannon.jpg: behind the breech, beside the rider, a pirate in a striped
 * shirt, cream bands round a team trunk). BOMB_GUNNER_STRIPES over the yoke box: .rows cream bands, each .band of the trunk's height, standing .out
 * of its width and depth, from .low under the middle to .top over it; unlit cream (LESSONS 442), out of the glow. Four slabs a band (front, back,
 * sides) so no ribbon faces in (LESSONS SSAO).
 */
const BOMB_GUNNER_STRIPES = { rows: 4, band: 0.09, out: 1.07, top: 0.8, low: 0.75, cream: new Color3(0.92, 0.88, 0.78) };
export function bombGunnerStripes(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = BOMB_GUNNER_STRIPES, glow = scene.getGlowLayerByName("glow");
  const cream = getMaterialFactory().get("unlit", S.cream, { emissive: S.cream });
  const yoke = body.allMeshes.find((m) => m.name.endsWith("_yoke")) ?? body.torsoMesh;
  const T = limbBox(yoke);
  const top = T.mid + T.half * S.top, low = T.mid - T.half * S.low, h = (T.half * 2) * S.band;
  const wx = T.wide * S.out, dz = T.deep * S.out, th = T.deep * 0.08;
  const out: Mesh[] = [];
  for (let k = 0; k < S.rows; k++) {
    const y = low + ((top - low) * (k + 0.5)) / S.rows;
    const slab = (w: number, d: number, x: number, z: number): void => {
      const b = MeshBuilder.CreateBox("bombGunnerStripe", { width: w, height: h, depth: d }, scene);
      b.parent = body.torso; b.position.set(x, y, z); b.material = cream; glow?.addExcludedMesh(b); out.push(b);
    };
    slab(wx * 2 + th, th, 0, dz);
    slab(wx * 2 + th, th, 0, -dz);
    for (const s of [-1, 1]) slab(th, dz * 2 + th, s * wx, 0);
  }
  return out;
}

/*
 * [S] 533 (a.3) the Bomb Cannon crew's floppy pirate caps (secret.bomb_cannon.jpg: both pirates wear a big soft team cap, a rolled band low on the
 * brow just over the bead eyes and a puffed crown slouched back and to one side, a knot at the back with two short tails; no helmet, no beret).
 * BOMB_CREW_CAP in the head's box (W, H, D its sizes; e the eyes' top): band .bandH H tall, .bandOut of the head across and deep, its foot .bandLo
 * H over e; crown an ellipsoid .crownW W x .crownH H x .crownD D centred .crownUp H over e, slouched .slouch D back and .side W aside, tipped
 * .droop rad back and .lean rad aside; a knot .knot W across at the back of the band, two tails .tailL H long, .tailW W wide, splayed .splay.
 * Team saturated (c^2, renormalised) x .shade, self-lit .12; out of the glow. Both crewmen (gunner and loader, hat "none").
 */
const BOMB_CREW_CAP = { bandH: 0.16, bandOut: 1.12, bandLo: 0.02, crownW: 1.3, crownH: 0.5, crownD: 1.35, crownUp: 0.36, slouch: 0.12, side: 0.08,
  droop: -0.3, lean: 0.22, knot: 0.22, tailL: 0.42, tailW: 0.14, splay: 0.35, shade: 0.8 };
export function bombCrewCap(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = BOMB_CREW_CAP, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const peak = Math.max(team.r, team.g, team.b), sat = new Color3(team.r ** 2, team.g ** 2, team.b ** 2);
  const deep = sat.scale((peak / Math.max(sat.r, sat.g, sat.b, 1e-3)) * C.shade);
  const cloth = mf.get("cloth", deep, { emissive: deep.scale(0.12), roughness: 1 });
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const out: Mesh[] = [];
  const bandY = e + H * (C.bandLo + C.bandH / 2);
  const band = MeshBuilder.CreateCylinder("bombCrewCapBand", { height: H * C.bandH, diameter: 1, tessellation: 8 }, scene);
  band.parent = head; band.position.set(c.x, bandY, c.z); band.scaling.set(W * C.bandOut, 1, D * C.bandOut); out.push(band);
  const crown = MeshBuilder.CreateSphere("bombCrewCap", { diameter: 1, segments: 5 }, scene);
  crown.parent = head; crown.position.set(c.x + W * C.side, e + H * C.crownUp, c.z - D * C.slouch);
  crown.scaling.set(W * C.crownW, H * C.crownH, D * C.crownD); crown.rotation.set(C.droop, 0, C.lean); out.push(crown);
  const backZ = c.z - (D * C.bandOut) / 2;
  const knot = MeshBuilder.CreateBox("bombCrewCapKnot", { width: W * C.knot, height: W * C.knot * 0.8, depth: W * C.knot * 0.7 }, scene);
  knot.parent = head; knot.position.set(c.x - W * 0.1, bandY, backZ - W * C.knot * 0.2); out.push(knot);
  for (const s of [-1, 1]) {
    const tail = MeshBuilder.CreateBox("bombCrewCapTail", { width: W * C.tailW, height: H * C.tailL, depth: W * 0.05 }, scene);
    tail.setPivotPoint(new Vector3(0, (H * C.tailL) / 2, 0));
    tail.parent = head; tail.position.set(c.x - W * 0.1 + s * W * C.tailW * 0.5, bandY - (H * C.tailL) / 2, backZ - W * C.knot * 0.3);
    tail.rotation.set(-0.35, 0, s * C.splay); out.push(tail);
  }
  for (const m of out) { m.material = cloth; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/*
 * [S] 534 (a.2) the Bomb Cannon's barrel rider as a team pirate (CONFIRM 533: "pale grey-blue plated mannequin body ... reads as armour";
 * secret.bomb_cannon.blue.png, .red.png, .jpg: a team-skinned pirate in an open team shirt, its collar laid open in a V on the chest and its
 * loose sleeves to the elbow, a wide green sash knotted round his waist with two tails hanging down his left front, brown shoes). Replaces the
 * crew's white cannonShirt on him. BOMB_RIDER_DRESS on the trunk's box (W, H, D): every body and skin mesh recoloured to the deep team skin (the
 * cap's saturated team .skin, self-lit .12); the shirt a six-sided shell .shirtOut of the trunk round from the shoulders to .shirtTo of H under
 * them, a touch lighter (.shirt); two collar flaps .lapel of W long laid open .lapelOpen rad either side of a V; sleeves .sleeveOut round the
 * upper arms to .sleeveTo; the sash .sashH of H tall .sashOut round the waist, green, two tails .tailL of H long; shoes brown on the foot ends
 * of the shins. Out of the glow.
 */
const BOMB_RIDER_DRESS = { skin: 0.85, shirt: 1.12, shirtOut: 1.1, shirtTo: 0.95, lapel: 0.34, lapelOpen: 0.5, sleeveOut: 1.35, sleeveTo: 0.85,
  sashH: 0.17, sashOut: 1.16, sashAt: 0.92, tailL: 0.38, green: new Color3(0.06, 0.32, 0.1), shoe: new Color3(0.2, 0.1, 0.05), shoeTo: 0.78 };
export function bombRiderDress(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const R = BOMB_RIDER_DRESS, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const peak = Math.max(team.r, team.g, team.b), sat = new Color3(team.r ** 2, team.g ** 2, team.b ** 2);
  const deep = sat.scale(peak / Math.max(sat.r, sat.g, sat.b, 1e-3));
  const skinC = deep.scale(R.skin), shirtC = deep.scale(R.skin * R.shirt);
  const skin = mf.get("cloth", skinC, { emissive: skinC.scale(0.12), roughness: 1 });
  const shirt = mf.get("cloth", shirtC, { emissive: shirtC.scale(0.14), roughness: 1 });
  const green = mf.get("cloth", R.green, { emissive: R.green.scale(0.2), roughness: 1 });
  const shoe = mf.get("cloth", R.shoe, { emissive: R.shoe.scale(0.3), roughness: 1 });
  // the team skin on the man himself (his bead eyes keep their own materials)
  const own = new Set([body.torsoMesh.material, body.headMesh.material, body.leftUpperArm.material, body.leftUpperLeg.material].filter(Boolean));
  for (const m of body.allMeshes) if (m.material && own.has(m.material)) m.material = skin;
  const out: Mesh[] = [];
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const top = cy + H / 2, put = (m: Mesh, mat: Material) => { m.parent = tm.parent; m.material = mat; out.push(m); return m; };
  const shellH = H * R.shirtTo;
  const shell = put(MeshBuilder.CreateCylinder("bombRiderShirt", { height: shellH, diameter: 1, tessellation: 6 }, scene), shirt);
  shell.scaling.set(W * R.shirtOut, 1, D * R.shirtOut * 1.15); shell.position.set(cx, top - shellH / 2, cz);
  // the open collar: two flaps laid back either side of a V on the chest, standing proud of the shirt's front
  for (const s of [-1, 1]) {
    const flap = put(MeshBuilder.CreateBox("bombRiderLapel", { width: W * 0.2, height: W * R.lapel, depth: D * 0.06 }, scene), shirt);
    flap.position.set(cx + s * W * 0.14, top - W * R.lapel * 0.45, cz + (D * R.shirtOut * 1.15) / 2 + D * 0.04);
    flap.rotation.set(-0.15, 0, s * R.lapelOpen);
    // the V between them shows the team chest in the skin shade, a dark crease at its point
  }
  const vee = put(MeshBuilder.CreateCylinder("bombRiderVee", { height: D * 0.04, diameterTop: W * 0.3, diameterBottom: 0, tessellation: 3 }, scene), skin);
  vee.rotation.x = Math.PI / 2; vee.rotation.y = Math.PI; vee.position.set(cx, top - W * 0.2, cz + (D * R.shirtOut * 1.15) / 2 + D * 0.02);
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "bombRiderSleeve", arm, 0, R.sleeveTo, R.sleeveOut, shirt));
  // the green sash round the waist, two tails down his left front
  const sashY = top - H * R.sashAt;
  const sash = put(MeshBuilder.CreateCylinder("bombRiderSash", { height: H * R.sashH, diameter: 1, tessellation: 8 }, scene), green);
  sash.scaling.set(W * R.sashOut, 1, D * R.sashOut * 1.15); sash.position.set(cx, sashY, cz);
  for (const s of [0, 1]) {
    const tail = put(MeshBuilder.CreateBox("bombRiderSashTail", { width: W * 0.13, height: H * R.tailL, depth: D * 0.06 }, scene), green);
    tail.position.set(cx - W * (0.22 + s * 0.12), sashY - (H * R.tailL) / 2, cz + (D * R.sashOut * 1.15) / 2 + D * 0.03);
    tail.rotation.z = (s ? -0.25 : 0.12);
  }
  // brown shoes on the shins' foot ends
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) out.push(limbShell(scene, "bombRiderShoe", shin, R.shoeTo, 1.02, 1.25, shoe));
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/*
 * [S] 533 (a.3) the Traveller's own afro on the Wheelbarrow Dragon (CONFIRM 532: "a big round brown puff rising well above and around the head";
 * secret.wheelbarrow_dragon.blue.png: a round brown mass about half again the head's width, from just over the eyes to well over the head, coming
 * down both temples to the ears and round the back to the nape; the shared dressAfro is a flat puff on top, kept for farmer.wheelbarrow).
 * BARROW_AFRO in the head's box (W, H, D; e the eyes' top): a crown ball .crown (x W, y H, z D radii) centred .crownUp H over e and .crownBack D
 * behind the middle, so its front foot stays over the eyes; a temple ball per side .temple radii at .templeX W out, .templeY H about e,
 * .templeBack D back; a nape ball .nape radii .napeBack D back. Faceted icospheres, lit brown cloth self-lit .2, out of the glow.
 */
const BARROW_AFRO = { crown: [0.82, 0.62, 0.78], crownUp: 0.55, crownBack: 0.12, temple: [0.3, 0.42, 0.45], templeX: 0.46, templeY: -0.02, templeBack: 0.15,
  nape: [0.6, 0.48, 0.38], napeBack: 0.42, brown: new Color3(0.28, 0.15, 0.09) };
export function barrowDriverAfro(scene: Scene, body: ArticulatedBody): Mesh[] {
  const A = BARROW_AFRO, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const hair = mf.get("cloth", A.brown, { emissive: A.brown.scale(0.2), roughness: 1 });
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const out: Mesh[] = [];
  const ball = (name: string, r: readonly number[], x: number, y: number, z: number) => {
    const m = MeshBuilder.CreateIcoSphere(name, { radius: 1, subdivisions: 2, flat: true }, scene);
    m.parent = head; m.position.set(x, y, z); m.scaling.set(W * r[0], H * r[1], D * r[2]); out.push(m);
  };
  ball("barrowAfro", A.crown, c.x, e + H * A.crownUp, c.z - D * A.crownBack);
  for (const s of [-1, 1]) ball("barrowAfroTemple", A.temple, c.x + s * W * A.templeX, e + H * A.templeY, c.z - D * A.templeBack);
  ball("barrowAfroNape", A.nape, c.x, e + H * A.templeY, c.z - D * A.napeBack);
  for (const m of out) { m.material = hair; glow?.addExcludedMesh(m); }
  return out;
}

/*
 * [S] 537 (vlad a.3) Vlad's long hair (audit 527 "a small dark tuft behind the head - TABS: long dark hair down over both shoulders in front"; card
 * Appearance "somewhat long hair over its shoulders in front of them"; secret.vlad.red.png: dark brown hair from under the crown down each side of
 * the face, past the jaw, falling forward over the shoulders onto the chest to about the armpits, a dark mass behind the head). VLAD_HAIR: on the
 * head (head box W, H, D, c) a side curtain each side .sideW W wide, .sideD D deep, from .from H over c down past the jaw to .to H under it, .out W
 * out of the middle; a back mass .backW W wide behind; on the torso (LESSONS 401: a head-hung piece is buried in the chest box), in the trunk's box
 * T, a lock each side .lockW of the width wide and .lockD of the depth thick, .lockX of the width out, laid on the coat's front from .lockTop of
 * the half height over the top to .lockLow of it under the top, tipped .tilt rad out at the foot. Dark brown lit cloth self-lit .3, out of the glow.
 */
const VLAD_HAIR = { sideW: 0.2, sideD: 0.6, from: 0.3, to: 0.62, out: 0.56, backW: 0.95, lockW: 0.3, lockD: 0.2, lockX: 0.55, lockTop: 0.25, lockLow: 0.7, tilt: 0.1,
  brown: new Color3(0.14, 0.08, 0.05) };
export function vladHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const K = VLAD_HAIR, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const hair = mf.get("cloth", K.brown, { emissive: K.brown.scale(0.3), roughness: 1 });
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const out: Mesh[] = [];
  const put = (m: Mesh, parent: TransformNode): Mesh => { m.parent = parent; m.material = hair; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  const sideH = H * (K.from + K.to);
  for (const sd of [-1, 1]) {
    const side = put(MeshBuilder.CreateBox("vladHairSide", { width: W * K.sideW, height: sideH, depth: D * K.sideD }, scene), head);
    side.position.set(c.x + sd * W * K.out, c.y + H * K.from - sideH / 2, c.z - D * 0.05);
  }
  const back = put(MeshBuilder.CreateBox("vladHairBack", { width: W * K.backW, height: sideH, depth: D * 0.3 }, scene), head);
  back.position.set(c.x, c.y + H * K.from - sideH / 2, c.z - D * 0.45);
  // the locks over the shoulders onto the chest, on the torso
  const yoke = body.allMeshes.find((m) => m.name.endsWith("_yoke")) ?? body.torsoMesh;
  const T = limbBox(yoke);
  const yTop = T.mid + T.half * (1 + K.lockTop), yLow = T.mid + T.half * (1 - K.lockLow), lH = yTop - yLow;
  for (const sd of [-1, 1]) {
    const lock = put(MeshBuilder.CreateBox("vladHairLock", { width: T.wide * 2 * K.lockW, height: lH, depth: T.deep * 2 * K.lockD }, scene), body.torso);
    lock.rotation.z = sd * K.tilt; lock.rotation.x = -0.12;
    lock.position.set(sd * T.wide * K.lockX, (yTop + yLow) / 2, T.deep * 1.05);
  }
  return out;
}

/*
 * [S] 537 (vlad a.2) Vlad's mustache (audit 527 "no mustache - TABS: a big brown mustache"; secret.vlad.red.png: a big dark brown handlebar under the
 * eyes, wider than the face, each half running out from under the nose, drooping, its end curling back up). VLAD_STACHE in the head box (W, H, D,
 * c) and the bead eyes: from .under H under the eyes' foot at the face's front (.front D forward of c), each half three tapering segments .seg W long,
 * .thick H thick at the root: out and .droop rad down, then .bend more down, then curled .curl back up. Dark brown lit cloth self-lit .3, out of
 * the glow.
 */
const VLAD_STACHE = { under: 0.06, front: 0.56, seg: [0.26, 0.22, 0.16], thick: 0.15, droop: 0.25, bend: 0.5, curl: 1.3, brown: new Color3(0.14, 0.08, 0.05) };
export function vladMustache(scene: Scene, body: ArticulatedBody): Mesh[] {
  const K = VLAD_STACHE, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const hair = mf.get("cloth", K.brown, { emissive: K.brown.scale(0.3), roughness: 1 });
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const eyes = eyeBoxInHead(body);
  const y = (eyes ? eyes.lo.y : c.y) - H * K.under, z = c.z + D * K.front;
  const out: Mesh[] = [];
  const root = MeshBuilder.CreateIcoSphere("vladStacheRoot", { radius: H * K.thick * 0.6, subdivisions: 1 }, scene);
  root.parent = head; root.position.set(c.x, y, z); root.material = hair; out.push(root);
  for (const sd of [-1, 1]) {
    let joint = new TransformNode("vladStacheJoint", scene); joint.parent = head;
    joint.position.set(c.x, y, z); joint.rotation.z = -sd * (Math.PI / 2 + K.droop); // +y laid out sideways and a little down
    for (let k = 0; k < K.seg.length; k++) {
      if (k === 1) joint.rotation.z = -sd * K.bend;
      if (k === 2) joint.rotation.z = sd * K.curl;
      const len = W * K.seg[k], w0 = H * K.thick * (1 - k * 0.28), w1 = H * K.thick * (1 - (k + 1) * 0.28);
      const seg = MeshBuilder.CreateCylinder("vladStache", { height: len, diameterBottom: w0, diameterTop: Math.max(w1, H * 0.02), tessellation: 6 }, scene);
      seg.parent = joint; seg.position.y = len / 2; seg.scaling.z = 0.7; seg.material = hair; out.push(seg);
      const next = new TransformNode("vladStacheJoint", scene); next.parent = joint; next.position.y = len; joint = next;
    }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/*
 * [S] 533 (a.4) Vlad's long coat (secret.vlad.red.png, .jpg: a dark team coat closed over the chest and flaring to a skirt that falls past the knees
 * to mid-shin; a brown fur mantle round the shoulders whose two ends hang down the chest like a stole; two gold star buttons down the middle between
 * them; a brown belt at the waist). VLAD_COAT in the torso frame (T = the trunk's box): a closed shell .out of the trunk from .top of the half height
 * over the middle to its foot, .thick of its depth thick; a flared skirt from .skirtTop of the half height under the middle, .flareTop to .flareFoot
 * of the trunk's width across, its hem .hem hip-to-knee lengths under the knees; a belt .belt of the half height tall; a fur mantle from .mantleUp
 * over the top, .mantleTop to .mantleFoot of the width across and .mantleDrop of the half height long; two stole ends .stoleW of the width wide at
 * .stoleX out, down to the belt; .stars gold stars .star of the width across at .starAt of the way down the chest. Team saturated (c^2) x .shade,
 * self-lit .12; fur brown lit cloth self-lit .2; gold unlit; all out of the glow.
 */
/*
 * [S] 538 (vlad a.5) Vlad's boots (audit 527 "legs are team legs - TABS: tan boots under the coat hem"; secret.vlad.jpg, .red.png: worn tan leather
 * boots from the foot up into the coat's skirt, a little wider than the shin, a turned-down band at the top, scuffed a darker tan at the toe).
 * shinBoot in VLAD_BOOT: shaft .shaft of the shin tall (its top inside the coat, hem VLAD_COAT.hem under the knee), .round round; cuff .cuff round,
 * .cuffH of the shin tall, in the tan x .toe (worn darker). Tan lit cloth self-lit .2, out of the glow.
 */
// 538.6b tan (.8,.6,.35) -> (.62,.36,.16) (look: the boots read pale grey under the hem)
const VLAD_BOOT = { shaft: 0.72, round: 1.3, cuff: 1.46, cuffH: 0.12, toe: 0.7, tan: new Color3(0.62, 0.36, 0.16) };
export function vladBoots(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = VLAD_BOOT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const tan = mf.get("cloth", B.tan, { emissive: B.tan.scale(0.2), roughness: 1 });
  const dark = B.tan.scale(B.toe), darkM = mf.get("cloth", dark, { emissive: dark.scale(0.2), roughness: 1 });
  const out = shinBoot(scene, body, "vladBoot", tan, darkM, B);
  return out;
}

// 537 [S] box shell -> fitted shell fitTop .9 fitFoot 1.04 fitDeep 1.08; mantleFoot 1.38 -> 1.12; fur collar collarH .45 collarW .62
const VLAD_COAT = { out: 1.1, top: 0.98, thick: 0.1, skirtTop: 0.82, flareTop: 1.12, flareFoot: 1.75, hem: 0.45, belt: 0.13, mantleUp: 0.04,
  fitTop: 0.9, fitFoot: 1.04, fitDeep: 1.08, collarH: 0.45, collarW: 0.62,
  mantleTop: 0.8, mantleFoot: 1.12, mantleDrop: 0.5, stoleW: 0.3, stoleX: 0.42, stars: 2, star: 0.26, starAt: [0.4, 0.7], shade: 0.7,
  fur: new Color3(0.3, 0.17, 0.09), beltC: new Color3(0.2, 0.11, 0.06), gold: new Color3(0.85, 0.55, 0.1) };
const VLAD_MANTLE = { top: 0.72, foot: 1.6, drop: 0.62, deep: 1.3, tufts: 14, tuft: 0.13, hang: 0.3, fur: new Color3(0.8, 0.5, 0.2) };
export function vladCoat(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const V = VLAD_COAT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const peak = Math.max(team.r, team.g, team.b), sat = new Color3(team.r ** 2, team.g ** 2, team.b ** 2);
  const deep = sat.scale((peak / Math.max(sat.r, sat.g, sat.b, 1e-3)) * V.shade);
  const coat = mf.get("cloth", deep, { emissive: deep.scale(0.12), roughness: 1 });
  const fur = mf.get("cloth", V.fur, { emissive: V.fur.scale(0.2), roughness: 1 });
  const beltM = mf.get("cloth", V.beltC, { emissive: V.beltC.scale(0.2), roughness: 1 });
  const gold = mf.get("unlit", V.gold, { emissive: V.gold });
  const yoke = body.allMeshes.find((m) => m.name.endsWith("_yoke")) ?? body.torsoMesh;
  const T = limbBox(yoke);
  const top = T.mid + T.half * V.top, low = T.mid - T.half, h = top - low, cy = (top + low) / 2;
  const th = T.deep * V.thick;
  const out: Mesh[] = [];
  const add = (m: Mesh, mt: Material, x: number, y: number, z: number): Mesh => {
    m.parent = body.torso; m.position.set(x, y, z); m.material = mt; out.push(m); return m;
  };
  // [S] 537 (a.6; critic 533 "a flat-sided box standing out past both shoulders like a sandwich board"): the closed coat is an 8-sided shell fitted
  // round the trunk, .fitTop of its width across at the shoulders (narrower than the trunk's box corners) to .fitFoot at the waist, its depth in
  // the trunk's proportion; the brown fur mantle a rounded collar-cape over it (.mantleTop/.mantleFoot), and a fur collar standing up round the back
  // of the neck (.collarH of the half height tall, .collarW of the width across, a half ring open at the front) in place of the dark vampire collar
  const shell = add(MeshBuilder.CreateCylinder("vladCoatShell", { height: h, diameterTop: T.wide * 2 * V.fitTop, diameterBottom: T.wide * 2 * V.fitFoot, tessellation: 8 }, scene), coat, 0, cy, 0);
  shell.scaling.z = (T.deep / T.wide) * V.fitDeep; shell.rotation.y = Math.PI / 8;
  const zFront = T.deep * V.fitDeep * V.fitTop * 0.95;
  // [S] 539 (a.1; CONFIRM 538 "a dull grey-brown chunk on the left shoulder and a dark slab behind the right one"): the open half-ring
  // collar (a one-sided arc, its inside face SSAO-dark) is now a closed fur ring round the neck, standing up out of the mantle
  const collarH = T.half * V.collarH;
  const collar = add(MeshBuilder.CreateCylinder("vladFurCollar", { height: collarH, diameterTop: T.wide * 2 * V.collarW * 1.12, diameterBottom: T.wide * 2 * V.collarW, tessellation: 10 }, scene), fur, 0, top + T.half * V.mantleUp + collarH / 2, -T.deep * 0.05);
  collar.scaling.z = (T.deep / T.wide) * 1.2;
  // the flared skirt to mid-shin (hem anchored to the knees, LESSONS 512)
  const hipToKnee = Math.abs(body.leftKnee.position.y);
  const kneeY = (originIn(body.leftKnee, body.torso).y + originIn(body.rightKnee, body.torso).y) / 2;
  const sTop = T.mid - T.half * V.skirtTop, hem = kneeY - hipToKnee * V.hem, sH = sTop - hem;
  const skirt = add(MeshBuilder.CreateCylinder("vladCoatSkirt", { height: sH, diameterTop: T.wide * 2 * V.flareTop, diameterBottom: T.wide * 2 * V.flareFoot, tessellation: 8 }, scene), coat, 0, sTop - sH / 2, 0);
  skirt.scaling.z = (T.deep / T.wide) * 1.2; skirt.rotation.y = Math.PI / 8;
  const belt = add(MeshBuilder.CreateCylinder("vladCoatBelt", { height: T.half * 2 * V.belt, diameter: T.wide * 2 * (V.out + 0.12), tessellation: 8 }, scene), beltM, 0, low + T.half * V.belt, 0);
  belt.scaling.z = (T.deep / T.wide) * 1.05; belt.rotation.y = Math.PI / 8;
  // [S] 539 (a.1; CONFIRM 538: "TABS: a broad tan-gold fur mantle across both shoulders and the upper chest, the brightest area of the figure";
  // secret.vlad.red.png: a fur cape round the neck spreading out over both shoulders past the upper arms' tops, down the chest to about the armpits,
  // its lower edge ragged with fur tufts; the coat and its stars below it). VLAD_MANTLE: a 10-sided frustum from .top of the trunk's width across at
  // the neck to .foot across over the shoulders, .drop of the half height long, .deep of the width's depth ratio; round its foot .tufts faceted
  // tufts .tuft of the width across hanging .hang of the half height under the edge. Bright tan-gold lit cloth self-lit .3, out of the glow. The
  // two brown stole slabs down the chest (533) are gone: they hid the stars, and the long hair locks lie there in the render.
  const M = VLAD_MANTLE, furM = mf.get("cloth", M.fur, { emissive: M.fur.scale(0.3), roughness: 1 });
  const mTop = top + T.half * V.mantleUp, mH = T.half * M.drop, mFoot = mTop - mH;
  const mantle = add(MeshBuilder.CreateCylinder("vladMantle", { height: mH, diameterTop: T.wide * 2 * M.top, diameterBottom: T.wide * 2 * M.foot, tessellation: 10 }, scene), furM, 0, mTop - mH / 2, 0);
  mantle.scaling.z = (T.deep / T.wide) * M.deep;
  collar.material = furM;
  for (let k = 0; k < M.tufts; k++) {
    const a = (k / M.tufts) * Math.PI * 2;
    const tuft = add(MeshBuilder.CreateIcoSphere("vladMantleTuft", { radius: T.wide * M.tuft, subdivisions: 1, flat: true }, scene), furM,
      Math.sin(a) * T.wide * M.foot * 0.96, mFoot - T.half * M.hang * 0.4, Math.cos(a) * T.wide * M.foot * 0.96 * (T.deep / T.wide) * M.deep);
    tuft.scaling.set(1, 1.5, 0.7); tuft.rotation.y = a;
  }
  // gold star buttons down the middle
  const S = T.wide * 2 * V.star;
  for (let k = 0; k < V.stars; k++) {
    const y = top - h * V.starAt[k], z = zFront + th * 0.3;
    add(MeshBuilder.CreateCylinder("vladStarBoss", { height: th, diameter: S * 0.4, tessellation: 5 }, scene), gold, 0, y, z).rotation.x = Math.PI / 2;
    for (let r = 0; r < 5; r++) {
      const ray = add(MeshBuilder.CreateCylinder("vladStarRay", { height: S / 2, diameterBottom: S * 0.22, diameterTop: 0, tessellation: 4 }, scene), gold, 0, y, z);
      ray.setPivotPoint(new Vector3(0, -S / 4, 0)); ray.position.y = y + S / 4; ray.rotation.z = (Math.PI * 2 * r) / 5; ray.scaling.z = 0.35;
    }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/*
 * [S] 538 (blackbeard a.2) Blackbeard's beard (audit 538: "bare face under the hat, no beard - TABS: huge black braided beard from the eyes to the
 * belly"; secret.blackbeard.red.png, card Appearance: a black beard filling the face from cheek to cheek just under the eyes, falling over the chest
 * as a broad faceted wedge to a point at the belly, wider than the neck at the chin; two thin braids down its front tied with red bands; a thick
 * black moustache across the top). BEARD_BB: the face part on the head (W, H, D its box, c the centre, e the eye box's bottom) a faceted slab from
 * the cheeks (.top W half-wide, .gap H under e, .cheekZ D forward) to the chin (.chin W half-wide at .chinY H under c, .chinZ D forward), .thick D
 * deep; the chest part on the torso joint (T its box, front +z): a wedge from .chestTop of the half height over the middle (.chestW of the width
 * half-wide) to a tip .tip of the half height under it, .stand of the depth out of the chest front, .chestThick of the depth deep; .braids braids
 * .braidW of the width across at .braidX either side, .ties red ties on each; the moustache two flat icos .stache W across under the eyes. Near-black
 * lit cloth self-lit .4 (LESSONS 494); red ties lit; out of the glow.
 */
const BEARD_BB = { top: 0.56, gap: 0.04, cheekZ: 0.42, chin: 0.42, chinY: 0.62, chinZ: 0.62, thick: 0.4, chestTop: 1.02, chestW: 0.62, tip: 0.55,
  stand: 0.08, chestThick: 0.32, braids: 2, braidW: 0.07, braidX: 0.16, ties: 2, stache: 0.3,
  black: new Color3(0.08, 0.06, 0.07), red: new Color3(0.75, 0.08, 0.06) };
export function blackbeardBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = BEARD_BB, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const black = mf.get("cloth", B.black, { emissive: B.black.scale(0.4), roughness: 1 });
  const red = mf.get("cloth", B.red, { emissive: B.red.scale(0.2), roughness: 1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, parent: TransformNode, mt: Material): Mesh => { m.parent = parent; m.material = mt; m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); out.push(m); return m; };
  // the face part, on the head
  const head = body.headMesh, hb = head.getBoundingInfo().boundingBox, c = hb.center;
  const W = hb.extendSize.x * 2, H = hb.extendSize.y * 2, D = hb.extendSize.z * 2;
  const e = eyeBoxInHead(body)?.lo.y ?? c.y - H * 0.1;
  const at = (x: number, y: number, z: number) => new Vector3(c.x + x * W, y, c.z + z * D);
  const top = e - H * B.gap, chin = c.y - H * B.chinY;
  const front = [at(-B.top, top, B.cheekZ), at(B.top, top, B.cheekZ), at(B.chin, chin, B.chinZ), at(0, chin - H * 0.12, B.chinZ + 0.05), at(-B.chin, chin, B.chinZ)];
  const back = front.map((p) => p.add(new Vector3(0, 0, -D * B.thick)));
  const ridge = at(0, (top + chin) / 2, B.chinZ + 0.12), rear = at(0, (top + chin) / 2, B.cheekZ - B.thick * 1.4);
  const tris: Vector3[][] = [];
  for (let i = 0; i < 5; i++) {
    const j = (i + 1) % 5;
    tris.push([ridge, front[i], front[j]], [rear, back[j], back[i]], [front[i], back[i], back[j]], [front[i], back[j], front[j]]);
  }
  put(facetedSolid(scene, "blackbeardBeardFace", tris), head, black);
  for (const side of [-1, 1]) {
    const m = put(MeshBuilder.CreateIcoSphere("blackbeardMoustache", { radius: (W * B.stache) / 2, subdivisions: 1 }, scene), head, black);
    m.position.set(c.x + side * W * 0.17, top - H * 0.05, c.z + D * (B.cheekZ + 0.06)); m.scaling.set(1.2, 0.42, 0.55); m.rotation.z = -side * 0.35;
  }
  // the chest part, on the torso: a faceted wedge from under the chin to a point at the belly
  const torsoM = body.allMeshes.find((m) => m.name.endsWith("_yoke")) ?? body.torsoMesh;
  const T = limbBox(torsoM);
  const zF = T.deep * (1 + B.stand), yTop = T.mid + T.half * B.chestTop, yTip = T.mid - T.half * B.tip, hw = T.wide * B.chestW;
  const dz = T.deep * B.chestThick;
  const cf = [new Vector3(-hw, yTop, zF), new Vector3(hw, yTop, zF), new Vector3(hw * 0.8, (yTop + yTip) / 2 + T.half * 0.2, zF + dz * 0.4), new Vector3(0, yTip, zF), new Vector3(-hw * 0.8, (yTop + yTip) / 2 + T.half * 0.2, zF + dz * 0.4)];
  const cb = cf.map((p) => new Vector3(p.x * 0.9, p.y, T.deep * 0.6));
  const cRidge = new Vector3(0, (yTop + yTip) / 2 + T.half * 0.15, zF + dz), cRear = new Vector3(0, (yTop + yTip) / 2, T.deep * 0.4);
  const ct: Vector3[][] = [];
  for (let i = 0; i < 5; i++) {
    const j = (i + 1) % 5;
    ct.push([cRidge, cf[i], cf[j]], [cRear, cb[j], cb[i]], [cf[i], cb[i], cb[j]], [cf[i], cb[j], cf[j]]);
  }
  put(facetedSolid(scene, "blackbeardBeardChest", ct), body.torso, black);
  // two braids down its front, red ties on each
  for (let b = 0; b < B.braids; b++) {
    const x = (b ? 1 : -1) * T.wide * B.braidX, y0 = yTop - T.half * 0.15, y1 = yTip + T.half * 0.3, z = zF + dz * 0.75;
    const braid = put(MeshBuilder.CreateCylinder("blackbeardBraid", { height: y0 - y1, diameterTop: T.wide * B.braidW * 2, diameterBottom: T.wide * B.braidW * 1.4, tessellation: 5 }, scene), body.torso, black);
    braid.position.set(x, (y0 + y1) / 2, z);
    for (let k = 0; k < B.ties; k++) {
      const ty = y1 + (y0 - y1) * (0.12 + 0.3 * k);
      const tie = put(MeshBuilder.CreateCylinder("blackbeardBraidTie", { height: T.half * 0.06, diameter: T.wide * B.braidW * 2.6, tessellation: 6 }, scene), body.torso, red);
      tie.position.set(x, ty, z);
    }
  }
  return out;
}
