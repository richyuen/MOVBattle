import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, Scene, TransformNode, Vector3 } from "@babylonjs/core";
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
    const a = new Vector3(c.x - s.x * 0.82, c.y + s.y * 1.08, c.z + front * s.z * 1.10);
    const b = new Vector3(c.x + s.x * 0.78, c.y - s.y * 0.82, c.z + front * s.z * 1.14);
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
  bridge.parent = torso; bridge.position.set(c.x - s.x * 0.82, c.y + s.y * 1.10, c.z);
  bridge.material = cloth; out.push(bridge);
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
    const edge = upper ? 1 : 0.86;
    const height = size.y * (1 + edge) / count;
    for (let index = 0; index < count; index++) {
      const radius = (index: number) => size.x * (1.25 - index * 0.19 / count);
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

/**
 * [S] 500 the Shouter's Nordic helmet (secret.shouter.red.png; audit 500 a.1: "helmet: a bare team head - TABS a dark iron Nordic helmet with
 * curled brown horns and a nose guard"). The render: a dark grey faceted iron bowl over the crown and the sides of the head, its rim just over the
 * bead eyes, a broad nose guard and two cheek plates hanging down the face either side of it to the mouth, the eyes looking out between them; out
 * of each side over the ears a thick tan horn extending sideways, with a short downturned tip.
 * Spec in head widths W, heights H, depths D (the head box, its centre c; e the eyes' top in the head frame): an 8-sided iron bowl .bowl W across
 * from .rim H over e up to .top H over the centre, domed over the top (a half sphere .dome H tall); a brow band .band H tall round its foot,
 * .bandOut proud; a nose guard .noseW W wide from the band down .nose H, standing .proud D in front of the face; cheek plates .cheekW W wide,
 * .cheek H long at .cheekX W out, tipped in .cheekTilt rad; per side a horn rooted at the bowl's side .hornY H over e, through HORN_PATH
 * [x W out, y H up, z D back] tapering from .hornRoot W to .hornTip W. Iron dark lit cloth .iron self-lit .12 (LESSONS: metal reads near black);
 * horn brown .horn. All out of the glow.
 */
const SHOUTER_HELM = {
  iron: new Color3(0.2, 0.21, 0.23), horn: new Color3(0.72, 0.44, 0.24), bowl: 1.22, rim: 0.02, top: 0.66, dome: 0.32, band: 0.12, bandOut: 0.04,
  noseW: 0.2, nose: 0.42, proud: 0.56, cheekW: 0.24, cheek: 0.36, cheekX: 0.46, cheekTilt: 0.12, hornY: 0.12, hornRoot: 0.39, hornTip: 0.11,
};
const HORN_PATH: [number, number, number][] = [[0.52, 0, 0], [0.73, 0.035, 0.015], [0.94, 0.047, 0.04], [1.12, 0.015, 0.07], [1.20, -0.065, 0.08], [1.22, -0.14, 0.08]];
export function shouterHelm(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = SHOUTER_HELM, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const iron = mf.get("cloth", C.iron, { emissive: C.iron.scale(0.12), roughness: 1 });
  const horn = mf.get("cloth", C.horn, { emissive: C.horn.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: Material): Mesh => { m.parent = head; m.material = material; out.push(m); return m; };
  const foot = e + H * C.rim, crown = c.y + H * C.top, bowlH = crown - foot;
  const bowl = put(MeshBuilder.CreateCylinder("shouterHelm", { height: bowlH, diameterTop: W * C.bowl * 1.02, diameterBottom: W * C.bowl, tessellation: 8 }, scene), iron);
  bowl.rotation.y = Math.PI / 8; bowl.scaling.z = (D * C.bowl) / (W * C.bowl); bowl.position.set(c.x, foot + bowlH / 2, c.z);
  const dome = put(MeshBuilder.CreateSphere("shouterHelmDome", { diameter: 1, segments: 4, slice: 0.5 }, scene), iron);
  dome.scaling.set(W * C.bowl * 1.02, H * C.dome * 2, D * C.bowl * 1.02); dome.position.set(c.x, crown, c.z);
  const band = put(MeshBuilder.CreateCylinder("shouterHelmBand", { height: H * C.band, diameter: W * (C.bowl + C.bandOut * 2), tessellation: 8 }, scene), iron);
  band.rotation.y = Math.PI / 8; band.scaling.z = D / W; band.position.set(c.x, foot + (H * C.band) / 2, c.z);
  const face = c.z + D * C.proud;
  const nose = put(MeshBuilder.CreateBox("shouterHelmNose", { width: W * C.noseW, height: H * C.nose, depth: D * 0.1 }, scene), iron);
  nose.position.set(c.x, foot + H * 0.04 - (H * C.nose) / 2, face);
  for (const side of [-1, 1]) {
    const cheek = put(MeshBuilder.CreateBox("shouterHelmCheek", { width: W * C.cheekW, height: H * C.cheek, depth: D * 0.08 }, scene), iron);
    cheek.position.set(c.x + side * W * C.cheekX, foot - (H * C.cheek) / 2 - H * 0.12, face - D * 0.03);
    cheek.rotation.z = side * C.cheekTilt;
    const pts = HORN_PATH.map(([x, y, z]) => new Vector3(c.x + side * x * W, e + H * C.hornY + y * H, c.z - z * D));
    taper(scene, "shouterHorn", pts, W * C.hornRoot, W * C.hornTip, head, horn, out);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

export function shouterVest(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const torso = body.torsoMesh;
  const { center, extendSize } = torso.getBoundingInfo().boundingBox;
  const mf = getMaterialFactory();
  const iron = SHOUTER_HELM.iron;
  const material = mf.get("cloth", iron, { emissive: iron.scale(0.12) });
  torso.material = mf.get("cloth", team.scale(0.52));
  const out: Mesh[] = [];
  for (const side of [-1, 1]) {
    const panel = MeshBuilder.CreateBox("shouterVestPanel", {
      width: extendSize.x * 0.93, height: extendSize.y * 1.78, depth: extendSize.z * 0.49,
    }, scene);
    panel.parent = torso;
    panel.position.set(center.x + side * extendSize.x * 0.45, center.y + extendSize.y * 0.08, center.z + extendSize.z * 0.94);
    panel.rotation.y = side * 0.19;
    panel.rotation.z = side * 0.07;
    panel.material = material;
    out.push(panel);
  }
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
  const beard = put(MeshBuilder.CreateCylinder("teacherBeard", {
    height: H * 0.5, diameterTop: W * 0.69, diameterBottom: W * 0.035, tessellation: 5,
  }, scene), c.x, c.y - H * 0.47, c.z + D * 0.48);
  beard.scaling.z = 0.65;
  beard.rotation.y = Math.PI / 5;
  for (const side of [-1, 1]) {
    const moustache = put(MeshBuilder.CreateIcoSphere("teacherMoustache", {
      radius: W * 0.19, subdivisions: 1,
    }, scene), c.x + side * W * 0.16, c.y - H * 0.23, c.z + D * 0.58);
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
  box("chuKoNuBeltFront", 0, -0.93, 1.19, 2.15, 0.23, 0.19, leather);
  box("chuKoNuBeltBack", 0, -0.93, -1.16, 2.15, 0.23, 0.16, leather);
  for (const side of [-1, 1]) box("chuKoNuBeltSide", side * 1.04, -0.93, 0, 0.16, 0.23, 2.4, leather);
  for (const side of [-1, 1]) {
    box("chuKoNuBuckleSide", side * 0.20, -0.93, 1.36, 0.055, 0.30, 0.10, gold);
    box("chuKoNuBuckleBar", 0, -0.93 + side * 0.145, 1.36, 0.43, 0.055, 0.10, gold);
  }
  box("chuKoNuBuckleTongue", 0, -0.93, 1.42, 0.29, 0.035, 0.06, gold);
  const end = box("chuKoNuLooseBelt", 0.62, -1.39, 1.48, 0.24, 1.0, 0.13, leather);
  end.rotation.z = 0.32;
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

export function shouterBreeches(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const color = team.scale(0.62);
  const cloth = getMaterialFactory().get("cloth", color, { emissive: color.scale(0.15) });
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) {
    const { center, extendSize: size } = thigh.getBoundingInfo().boundingBox;
    const shape = [[0, -1.05], [1.04, -1.05], [1.48, -0.58], [1.42, 0.16], [1.14, 0.94], [0, 0.94]]
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
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const { center: c, extendSize: s } = shin.getBoundingInfo().boundingBox;
    for (let index = 0; index < 4; index++) {
      const band = MeshBuilder.CreateCylinder("shouterKneeBand", {
        height: s.y * 0.25, diameterTop: s.x * 2.6, diameterBottom: s.x * 2.45, tessellation: 7,
      }, scene);
      band.parent = shin; band.position.set(c.x, c.y + s.y * (0.94 - index * 0.19), c.z);
      band.scaling.z = s.z / s.x * 0.95; band.rotation.z = index % 2 ? -0.10 : 0.10;
      band.material = cloth; band.convertToFlatShadedMesh(); out.push(band);
    }
  }
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
