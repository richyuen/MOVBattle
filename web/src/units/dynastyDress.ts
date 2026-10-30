import { Scene, Color3, Mesh, MeshBuilder, Node, TransformNode, Vector3 } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { limbShell } from "./medievalDress";
import { getMaterialFactory } from "./materialFactory";

/*
 * Dynasty dress (units/dynasty.*): cloth, hair, masks and held pieces built per unit id by unitFactory, sized off the body's own metrics and joints.
 * Pieces worn on the head are parented to the head mesh (+z his front, +y up, its origin its middle); pieces on the trunk to the torso joint.
 */

/** The bead eyes' bottom and top in the head block's own frame (null when the body has no eyes); the eyes hang off the neck, not the head block. */
function eyeSpanInHead(body: ArticulatedBody): [number, number] | null {
  const eyes = [body.leftEye, body.rightEye].filter((m): m is Mesh => !!m);
  if (!eyes.length) return null;
  const chain: Node[] = [];
  for (let n: Node | null = eyes[0]; n; n = n.parent) chain.unshift(n);
  for (const n of chain) if (n instanceof TransformNode) n.computeWorldMatrix(true);
  body.headMesh.computeWorldMatrix(true);
  const toHead = body.headMesh.getWorldMatrix().clone().invert();
  let lo = Infinity, hi = -Infinity;
  for (const eye of eyes) {
    eye.computeWorldMatrix(true);
    const bb = eye.getBoundingInfo().boundingBox;
    lo = Math.min(lo, Vector3.TransformCoordinates(new Vector3(bb.centerWorld.x, bb.minimumWorld.y, bb.centerWorld.z), toHead).y);
    hi = Math.max(hi, Vector3.TransformCoordinates(new Vector3(bb.centerWorld.x, bb.maximumWorld.y, bb.centerWorld.z), toHead).y);
  }
  return [lo, hi];
}

/*
 * [S] 411 the Monk's bo (audit 411 b.1: "missing: Monk Staff - TABS: a long bo, wider than his arm span, with grey capped ends, held two-handed across
 * the body"; dynasty.monk.red.png: a plain orange-brown pole about 1.2 of his height, a grey cap and a dark band at each end, held level across his
 * chest in both fists). In the weapon fist: a holder at the fist (proceduralAnimation _restMonkBo lays it level across his front) carrying the shaft
 * .long of his height, .thick of it across, its middle .offset of its length off the fist toward his off side, so both fists sit on it either side of
 * his middle; a grey cap .cap of the length at each end, .capWide of the shaft, a dark band .band of the length inside each cap. The off hand rides the
 * shaft (POLE_GRIP boGrip).
 */
const MONK_STAFF = {
  long: 1.2, thick: 0.022, offset: 0.2, cap: 0.08, capWide: 1.45, band: 0.025,
  wood: new Color3(0.62, 0.34, 0.16), steel: new Color3(0.5, 0.5, 0.5), dark: new Color3(0.2, 0.14, 0.1), glow: 0.14,
};
/** The Monk's bo staff in his weapon fist (spec at MONK_STAFF). */
export function monkStaff(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = MONK_STAFF;
  const mf = getMaterialFactory();
  const wood = mf.get("cloth", S.wood, { emissive: S.wood.scale(S.glow) });
  const steel = mf.get("cloth", S.steel, { emissive: S.steel.scale(S.glow) });
  const dark = mf.get("cloth", S.dark, { emissive: S.dark.scale(S.glow) });
  // his height in the hand's frame: the world height over the hand's world scale
  body.rightHand.computeWorldMatrix(true);
  const scale = Math.max(0.001, body.rightHand.absoluteScaling.y);
  const height = (body.metrics.overallHeight * body.root.scaling.y) / scale;
  const L = height * S.long, r = height * S.thick;
  const holder = new TransformNode("monkBoHolder", scene);
  holder.parent = body.rightHand;
  const shaft = MeshBuilder.CreateCylinder("monkBo", { height: L, diameter: r * 2, tessellation: 7 }, scene);
  shaft.parent = holder;
  shaft.position.y = L * S.offset;
  shaft.material = wood;
  shaft.convertToFlatShadedMesh();
  new TransformNode("boGrip", scene).parent = shaft;
  const out: Mesh[] = [shaft];
  for (const end of [-1, 1]) {
    const cap = MeshBuilder.CreateCylinder("monkBoCap", { height: L * S.cap, diameterTop: r * 2 * S.capWide * (end > 0 ? 0.8 : 1), diameterBottom: r * 2 * S.capWide * (end > 0 ? 1 : 0.8), tessellation: 7 }, scene);
    cap.parent = shaft;
    cap.position.y = end * (L * 0.5 - L * S.cap * 0.5);
    cap.material = steel;
    cap.convertToFlatShadedMesh();
    const band = MeshBuilder.CreateCylinder("monkBoBand", { height: L * S.band, diameter: r * 2 * 1.25, tessellation: 7 }, scene);
    band.parent = shaft;
    band.position.y = end * (L * 0.5 - L * S.cap - L * S.band);
    band.material = dark;
    out.push(cap, band);
  }
  return out;
}

/*
 * [S] 411 the Ninja's hood and mask (audit 411 a.1: "an oversized near-black ball about twice head size with a stub at the back - TABS: a head-sized
 * team-coloured hood and face mask"; dynasty.ninja.red.png: a boxy team hood over the crown and down the back and sides of the head, a mask over the
 * face from under the eyes to the chin, an open band at the eyes for the two bead eyes, a short tied tail hanging at the back). In the head's half
 * extents e, all boxes .out of e proud:
 *   crown: from .clear over the eyes' top to .top of e.y; back: the full height behind .backFrom of e.z; sides: the full height from .sideFrom of e.x out;
 *   mask: the full width and depth from .chin of e.y up to .clear under the eyes' bottom, a shade .maskShade of the team;
 *   tail: a knot .knot of e at the back of the crown with a band .tail of e.y long hanging from it.
 * Replaces the shared ninja_mask hat (unitVisuals).
 */
const NINJA_HOOD = { out: 1.12, clear: 0.05, top: 1.12, backFrom: -0.15, sideFrom: 0.72, chin: -1.08, maskShade: 0.82, knot: 0.22, tail: 0.9, glow: 0.12 };
/** The Ninja's boxy team hood with an eye band and a face mask (spec at NINJA_HOOD). */
export function ninjaHood(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const N = NINJA_HOOD;
  const mf = getMaterialFactory();
  const cloth = mf.get("cloth", teamColor, { emissive: teamColor.scale(N.glow) });
  const shade = teamColor.scale(N.maskShade);
  const maskCloth = mf.get("cloth", shade, { emissive: shade.scale(N.glow) });
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const span = eyeSpanInHead(body) ?? [-e.y * 0.2, e.y * 0.3];
  const X = e.x * N.out, Z = e.z * N.out;
  const out: Mesh[] = [];
  const slab = (name: string, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, mat = cloth): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: x1 - x0, height: y1 - y0, depth: z1 - z0 }, scene);
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    m.parent = body.headMesh;
    m.material = mat;
    out.push(m);
    return m;
  };
  const eyeTop = span[1] + e.y * N.clear, eyeBottom = span[0] - e.y * N.clear;
  const bottom = e.y * N.chin, top = e.y * N.top;
  slab("ninjaHoodCrown", -X, X, eyeTop, top, -Z, Z);
  slab("ninjaHoodBack", -X, X, bottom, eyeTop, -Z, e.z * N.backFrom);
  for (const side of [-1, 1]) slab("ninjaHoodSide", side > 0 ? e.x * N.sideFrom : -X, side > 0 ? X : -e.x * N.sideFrom, eyeBottom, eyeTop, -Z, Z);
  slab("ninjaMask", -X, X, bottom, eyeBottom, -Z, Z * 1.02, maskCloth);
  const k = e.y * N.knot;
  slab("ninjaHoodKnot", -k, k, eyeTop - k, eyeTop + k, -Z - k * 1.4, -Z);
  const tail = slab("ninjaHoodTail", -k * 0.6, k * 0.6, eyeTop - e.y * N.tail, eyeTop, -Z - k * 1.1, -Z - k * 0.5);
  tail.rotation.x = -0.25;
  return out;
}

/*
 * [S] 412 the Monk's tengu mask (audit 411 a.1: "a plain head with bead eyes - TABS: a tengu mask (a scowling face with brows and a nose) under the hat";
 * dynasty.monk.red.png, .jpg: a team mask over the whole face, a deeper shade than the skin, heavy orange brows slanting down to the nose in a scowl
 * over the bead eyes, a broad orange nose ridge, a dark grimacing mouth with two small white fangs at its corners). On the head's front, in its half
 * extents e: the plate .plate of e.z proud of the face, from .chin of e.y up to the eyes' bottom, a shade .shade of the team; each brow a slab .brow of
 * e.x long, .browTall of e.y tall, over the eye's top, its inner end turned down .scowl rad; the nose a wedge .nose of e.y long under the eyes, .noseOut
 * of e.z proud; the mouth a dark bar .mouth of e.x wide at .mouthY of e.y with a fang .fang of e.y long under each end.
 */
const TENGU_MASK = {
  plate: 1.04, chin: -0.92, shade: 0.72, brow: 0.62, browTall: 0.16, scowl: 0.38, nose: 0.42, noseOut: 0.3, noseWide: 0.3, mouth: 0.9, mouthY: -0.6, fang: 0.2,
  orange: new Color3(0.86, 0.38, 0.12), dark: new Color3(0.12, 0.07, 0.06), fangColor: new Color3(0.92, 0.9, 0.84), glow: 0.12,
};
/** The Monk's team tengu mask with orange scowling brows, nose ridge and a fanged grimace (spec at TENGU_MASK). */
export function tenguMask(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const T = TENGU_MASK;
  const mf = getMaterialFactory();
  const shade = teamColor.scale(T.shade);
  const plateMat = mf.get("cloth", shade, { emissive: shade.scale(T.glow) });
  const orange = mf.get("cloth", T.orange, { emissive: T.orange.scale(T.glow) });
  const dark = mf.get("cloth", T.dark);
  const fangMat = mf.get("cloth", T.fangColor, { emissive: T.fangColor.scale(T.glow) });
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const span = eyeSpanInHead(body) ?? [-e.y * 0.2, e.y * 0.3];
  const front = e.z * T.plate;
  const out: Mesh[] = [];
  const put = (m: Mesh, mat: typeof plateMat): Mesh => { m.parent = body.headMesh; m.material = mat; out.push(m); return m; };
  const plateTop = span[0]; // under the bead eyes, so they stay in front
  const plate = put(MeshBuilder.CreateBox("tenguPlate", { width: e.x * 2.04, height: plateTop - e.y * T.chin, depth: e.z * 0.08 }, scene), plateMat);
  plate.position.set(0, (plateTop + e.y * T.chin) / 2, front);
  const eyeMid = (span[0] + span[1]) / 2;
  for (const side of [-1, 1]) {
    const brow = put(MeshBuilder.CreateBox("tenguBrow", { width: e.x * T.brow, height: e.y * T.browTall, depth: e.z * 0.14 }, scene), orange);
    brow.position.set(side * e.x * 0.42, span[1] + e.y * T.browTall * 0.3, front + e.z * 0.06);
    brow.rotation.z = side * T.scowl;
    const fang = put(MeshBuilder.CreateCylinder("tenguFang", { height: e.y * T.fang, diameterTop: 0, diameterBottom: e.x * 0.12, tessellation: 4 }, scene), fangMat);
    fang.rotation.x = Math.PI;
    fang.position.set(side * e.x * T.mouth * 0.42, e.y * T.mouthY - e.y * T.fang * 0.5, front + e.z * 0.08);
  }
  const nose = put(MeshBuilder.CreateCylinder("tenguNose", { height: e.y * T.nose, diameterTop: e.x * 0.12, diameterBottom: e.x * T.noseWide, tessellation: 4 }, scene), orange);
  nose.scaling.z = (e.z * T.noseOut) / (e.x * T.noseWide);
  nose.position.set(0, eyeMid - e.y * T.nose * 0.55, front + e.z * T.noseOut * 0.4);
  const mouth = put(MeshBuilder.CreateBox("tenguMouth", { width: e.x * T.mouth, height: e.y * 0.12, depth: e.z * 0.1 }, scene), dark);
  mouth.position.set(0, e.y * T.mouthY, front + e.z * 0.04);
  return out;
}

/*
 * [S] 412 the Ninja's gi (audit 411 a.3: "a plain blue trunk - TABS: a loose team-coloured gi with crossed lapels and a knotted belt sash";
 * dynasty.ninja.red.png: a loose boxy team jacket wider than the trunk to the hips, a lighter V of undershirt at the throat between two lapels that
 * cross to the opposite hip, wide short sleeves to the elbow, and a darker sash round the waist tied in a knot at the front with two ends hanging).
 * In the trunk box (W, H, D): the shell .out wide, .deep deep, from .hem of H under the trunk's foot to its top; the undershirt V a lighter (.light)
 * slab .vWide of W at the throat, .vLong of H down; each lapel a slab .lapel of W wide, .lapelLong of H long, running from the shoulder to the opposite
 * side at .cross rad, darker (.lapelShade); the sash .sash of H tall at .sashAt of H above the trunk's foot, .sashOut proud, darker (.sashShade), a
 * knot .knot of W at its front and two ends .tail of H long hanging from it; sleeves .sleeveOut over the upper arm, to .sleeveTo of the forearm.
 */
const NINJA_GI = {
  out: 1.2, deep: 1.25, hem: 0.08, light: 1.3, vWide: 0.32, vLong: 0.32, lapel: 0.14, lapelLong: 0.7, cross: 0.5, lapelShade: 0.82,
  sash: 0.12, sashAt: 0.16, sashOut: 1.06, sashShade: 0.7, knot: 0.14, tail: 0.24, sleeveOut: 1.5, sleeveTo: 0.25, glow: 0.12,
};
/** The Ninja's loose team gi with a light V, crossed lapels, a knotted sash and wide short sleeves (spec at NINJA_GI). */
export function ninjaGi(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const G = NINJA_GI;
  const mf = getMaterialFactory();
  const tone = (k: number) => { const c = new Color3(Math.min(1, teamColor.r * k), Math.min(1, teamColor.g * k), Math.min(1, teamColor.b * k)); return mf.get("cloth", c, { emissive: c.scale(G.glow) }); };
  const cloth = tone(1), light = tone(G.light), lapelMat = tone(G.lapelShade), sashMat = tone(G.sashShade);
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const out: Mesh[] = [];
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, mat: ReturnType<typeof tone>, rz = 0): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.position.set(cx + x, cy + y, cz + z);
    m.rotation.copyFrom(tm.rotation);
    m.rotation.z += rz;
    m.parent = tm.parent;
    m.material = mat;
    out.push(m);
    return m;
  };
  const hemH = H * (1 + G.hem);
  box("ninjaGi", W * G.out, hemH, D * G.deep, 0, -H * G.hem / 2, 0, cloth);
  const front = D * G.deep / 2;
  box("ninjaGiV", W * G.vWide, H * G.vLong, D * 0.04, 0, H / 2 - H * G.vLong / 2, front + D * 0.01, light);
  for (const side of [-1, 1]) {
    // from the shoulder on this side, down across the chest toward the other hip
    box("ninjaGiLapel", W * G.lapel, H * G.lapelLong, D * 0.05, side * W * 0.16, H / 2 - H * G.lapelLong / 2, front + D * 0.03, lapelMat, -side * G.cross * 0.5);
  }
  const sashY = -H / 2 + H * G.sashAt;
  box("ninjaGiSash", W * G.out * G.sashOut, H * G.sash, D * G.deep * G.sashOut, 0, sashY, 0, sashMat);
  box("ninjaGiKnot", W * G.knot, H * G.sash * 1.4, D * 0.12, 0, sashY, D * G.deep * G.sashOut / 2 + D * 0.04, sashMat);
  for (const side of [-1, 1]) box("ninjaGiTail", W * G.knot * 0.6, H * G.tail, D * 0.05, side * W * 0.06, sashY - H * G.tail / 2, D * G.deep * G.sashOut / 2 + D * 0.06, sashMat, side * 0.2);
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "ninjaGiSleeve", arm, 0, 1, G.sleeveOut, cloth));
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) out.push(limbShell(scene, "ninjaGiSleeve", arm, 0, G.sleeveTo, G.sleeveOut, cloth));
  return out;
}

/*
 * [S] 412 the Firework Archer's long hair (audit 411 a.1: "a brown conical straw hat - TABS: no hat; black long hair with a bun over a team-coloured
 * head"; dynasty.firework_archer.red.png: dark grey-brown hair over the crown and down the back to the shoulders, falling at both sides of the face
 * behind its front, a small knot at the back of the crown). In the head's half extents e: a cap from .clear over the eyes' top to .top of e.y, the
 * whole head across and .capDeep of e.z deep from the back; a back fall .fall of e.y long from the crown down past the jaw, .fallOut of e.z behind
 * the head; side locks .side of e.x thick from the cap down to .sideDrop of e.y, behind .sideFrom of e.z; a bun .bun of e.y across at the back of the
 * crown. Replaces the shared conical_hat (unitVisuals).
 */
const ARCHER_HAIR = { clear: 0.08, top: 1.14, out: 1.1, capDeep: 2.1, fall: 2.6, fallOut: 0.22, side: 0.2, sideDrop: -0.85, sideFrom: 0.35, bun: 0.42, color: new Color3(0.24, 0.21, 0.2), glow: 0.1 };
/** The Firework Archer's dark long hair with side locks and a knot (spec at ARCHER_HAIR). */
export function archerHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const A = ARCHER_HAIR;
  const hairMat = getMaterialFactory().get("cloth", A.color, { emissive: A.color.scale(A.glow) });
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const span = eyeSpanInHead(body) ?? [-e.y * 0.2, e.y * 0.3];
  const X = e.x * A.out, Z = e.z * A.out;
  const out: Mesh[] = [];
  const slab = (name: string, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: x1 - x0, height: y1 - y0, depth: z1 - z0 }, scene);
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    m.parent = body.headMesh;
    m.material = hairMat;
    out.push(m);
    return m;
  };
  const capFoot = span[1] + e.y * A.clear, top = e.y * A.top;
  slab("archerHairCap", -X, X, capFoot, top, -Z, -Z + e.z * A.capDeep);
  slab("archerHairFall", -X * 0.92, X * 0.92, top - e.y * A.fall, top, -Z - e.z * A.fallOut, -Z + e.z * 0.3);
  for (const side of [-1, 1]) {
    const x0 = side > 0 ? X - e.x * A.side : -X, x1 = side > 0 ? X : -X + e.x * A.side;
    slab("archerHairLock", x0, x1, e.y * A.sideDrop, capFoot, -Z, e.z * A.sideFrom);
  }
  const bun = MeshBuilder.CreateIcoSphere("archerHairBun", { radius: e.y * A.bun, subdivisions: 1 }, scene);
  bun.position.set(0, top - e.y * 0.15, -Z - e.z * A.fallOut - e.y * A.bun * 0.5);
  bun.parent = body.headMesh;
  bun.material = hairMat;
  out.push(bun);
  return out;
}

/*
 * [S] 413 the Ninja's wide trousers over wrapped shins (audit 411 a.4: "thin legs - TABS: wide trousers to the knee over wrapped shins";
 * dynasty.ninja.red.png: baggy team trousers from the hip, widest over the knee and ending a little below it, then the shins wrapped tight in team
 * cloth in ridged bands to the ankle, over the feet). Team cloth as the gi's (NINJA_GI.glow): the thigh shell .thigh over the upper leg, the
 * trouser leg .knee over the lower leg's top .kneeTo of its length; the wraps .wrap over the rest of the shin, with .bands raised rings .band of the
 * wrap's length, .bandOut proud, a shade .bandShade of the team.
 */
const NINJA_TROUSERS = { thigh: 1.9, knee: 1.75, kneeTo: 0.3, wrap: 1.3, bands: 4, band: 0.09, bandOut: 1.42, bandShade: 0.82 };
/** The Ninja's wide team trousers to below the knee and banded shin wraps (spec at NINJA_TROUSERS). */
export function ninjaTrousers(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const T = NINJA_TROUSERS;
  const mf = getMaterialFactory();
  const cloth = mf.get("cloth", teamColor, { emissive: teamColor.scale(NINJA_GI.glow) });
  const dark = teamColor.scale(T.bandShade);
  const bandMat = mf.get("cloth", dark, { emissive: dark.scale(NINJA_GI.glow) });
  const out: Mesh[] = [];
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg]) out.push(limbShell(scene, "ninjaTrouser", leg, 0, 1, T.thigh, cloth));
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "ninjaTrouserKnee", shin, 0, T.kneeTo, T.knee, cloth));
    out.push(limbShell(scene, "ninjaShinWrap", shin, T.kneeTo, 1, T.wrap, cloth));
    const step = (1 - T.kneeTo) / T.bands;
    for (let i = 0; i < T.bands; i++) {
      const at = T.kneeTo + step * (i + 0.5);
      out.push(limbShell(scene, "ninjaShinBand", shin, at - T.band * 0.5, at + T.band * 0.5, T.bandOut, bandMat));
    }
  }
  return out;
}

/*
 * [S] 413 the Samurai's kabuto (audit 411 a.1: "a dark maroon bowl with a yellow fringe hiding the face - TABS: a team-coloured kabuto with a flared,
 * gold-trimmed neck guard and a front crest, with two bead eyes under the brim"; dynasty.samurai.red.png: a team bowl over the crown, a short peak over
 * the eyes, the neck guard falling in .tiers stepped lames round the back and sides of the head and flaring out, each lame edged in gold, open at the
 * face; a small gold crest at the front of the bowl). In the head's half extents e: the bowl a frustum from .clear over the eyes' top up to .top of e.y,
 * .bowlFoot of e.x across at its foot, .bowlTop at its top; the peak a slab .peak of e.z out over the face; each lame an open ring (.arc of a turn,
 * the gap at the face) .lame of e.y tall, flaring from .flareTop to .flareFoot of e.x, the first hung from the bowl's foot and each next .step of e.y
 * lower; a gold rim .rim of e.y under each lame; the crest a gold disc .crest of e.y across stood at the bowl's front. Replaces samurai_helmet.
 */
const KABUTO = {
  clear: 0.04, top: 1.3, bowlFoot: 2.3, bowlTop: 1.4, peak: 0.42, tiers: 3, lame: 0.32, step: 0.3, flareTop: 2.3, flareFoot: 2.75, arc: 0.55, rim: 0.07,
  crest: 0.42, shade: 0.9, gold: new Color3(0.9, 0.66, 0.2), glow: 0.12,
};
/** The Samurai's team kabuto with a gold-trimmed flared neck guard and a front crest (spec at KABUTO). */
export function samuraiKabuto(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const K = KABUTO;
  const mf = getMaterialFactory();
  const team = teamColor.scale(K.shade);
  const cloth = mf.get("cloth", team, { emissive: team.scale(K.glow) });
  const gold = mf.get("cloth", K.gold, { emissive: K.gold.scale(K.glow) });
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const span = eyeSpanInHead(body) ?? [-e.y * 0.2, e.y * 0.3];
  const out: Mesh[] = [];
  const put = (m: Mesh, mat: typeof cloth): Mesh => { m.parent = body.headMesh; m.material = mat; m.convertToFlatShadedMesh(); out.push(m); return m; };
  const foot = span[1] + e.y * K.clear, top = e.y * K.top;
  const bowl = put(MeshBuilder.CreateCylinder("kabutoBowl", { height: top - foot, diameterTop: e.x * K.bowlTop, diameterBottom: e.x * K.bowlFoot, tessellation: 8 }, scene), cloth);
  bowl.position.y = (top + foot) / 2;
  bowl.scaling.z = e.z / e.x;
  const peak = put(MeshBuilder.CreateBox("kabutoPeak", { width: e.x * K.bowlFoot * 0.8, height: e.y * 0.08, depth: e.z * K.peak }, scene), gold);
  peak.position.set(0, foot, e.z * (K.bowlFoot / 2) * (e.z / e.x) + e.z * K.peak * 0.3);
  peak.rotation.x = 0.25;
  // Babylon lays a cylinder's arc from angle 0 through -2pi*arc (x = cos(-a), z = sin(-a)), so the gap's middle sits at pi*(1-arc); rotation.y
  // takes angle a to a - turn, and the gap is wanted at +z (pi/2): [P] 414 the face opening (critic 413: the lames crossed the face)
  const turn = Math.PI * (0.5 - K.arc);
  for (let i = 0; i < K.tiers; i++) {
    const y = foot - e.y * K.step * i - e.y * K.lame / 2;
    const k = 1 + i * 0.12;
    const lame = put(MeshBuilder.CreateCylinder("kabutoLame", { height: e.y * K.lame, diameterTop: e.x * K.flareTop * k, diameterBottom: e.x * K.flareFoot * k, tessellation: 12, arc: K.arc, sideOrientation: Mesh.DOUBLESIDE }, scene), cloth);
    lame.position.y = y;
    lame.rotation.y = turn;
    const rim = put(MeshBuilder.CreateCylinder("kabutoRim", { height: e.y * K.rim, diameter: e.x * K.flareFoot * k * 1.02, tessellation: 12, arc: K.arc, sideOrientation: Mesh.DOUBLESIDE }, scene), gold);
    rim.position.y = y - e.y * K.lame / 2;
    rim.rotation.y = turn;
  }
  const crest = put(MeshBuilder.CreateCylinder("kabutoCrest", { height: e.z * 0.08, diameter: e.y * K.crest, tessellation: 10 }, scene), gold);
  crest.rotation.x = Math.PI / 2 - 0.2;
  crest.position.set(0, foot + (top - foot) * 0.45, e.z * (K.bowlFoot + K.bowlTop) / 4 * (e.z / e.x) * 1.05);
  return out;
}

/*
 * [S] 414 the Monk's robe trousers and greaves (audit 411 a.4: "slim legs - TABS: wide team-coloured robe trousers over gold-banded greaves";
 * dynasty.monk.red.png: team trousers falling wide and straight from the hip to the knee, then team greaves down the shin banded across in gold, over
 * sandals). Team cloth: the thigh shell .thigh over the upper leg and on over the lower leg's top .kneeTo; the greave .greave over the rest of the
 * shin, with .bands gold rings .band of its length, .bandOut proud.
 */
const MONK_TROUSERS = { thigh: 2.0, kneeTo: 0.22, greave: 1.35, bands: 3, band: 0.07, bandOut: 1.45, gold: new Color3(0.86, 0.62, 0.18), glow: 0.12 };
/** The Monk's wide team trousers to the knee over gold-banded team greaves (spec at MONK_TROUSERS). */
export function monkTrousers(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const T = MONK_TROUSERS;
  const mf = getMaterialFactory();
  const cloth = mf.get("cloth", teamColor, { emissive: teamColor.scale(T.glow) });
  const gold = mf.get("cloth", T.gold, { emissive: T.gold.scale(T.glow) });
  const out: Mesh[] = [];
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg]) out.push(limbShell(scene, "monkTrouser", leg, 0, 1, T.thigh, cloth));
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "monkTrouserKnee", shin, 0, T.kneeTo, T.thigh * 0.95, cloth));
    out.push(limbShell(scene, "monkGreave", shin, T.kneeTo, 1, T.greave, cloth));
    const step = (1 - T.kneeTo) / T.bands;
    for (let i = 0; i < T.bands; i++) {
      const at = T.kneeTo + step * (i + 0.5);
      out.push(limbShell(scene, "monkGreaveBand", shin, at - T.band * 0.5, at + T.band * 0.5, T.bandOut, gold));
    }
  }
  return out;
}

/*
 * [S] 415 the Monk's arm plates (audit 411 a.3: "bare blue arms - TABS: team-coloured lamellar plates banded down both arms"; card Appearance
 * "lamellar armor parts (arms only)"; dynasty.monk.jpg: overlapping team plates in rows down the upper and lower arm). On each arm segment
 * .rows overlapping team rows, each .out of the limb round and a little wider at its foot than at its head, with a thin gold rim .rim of the
 * segment long at the foot of each row.
 */
const MONK_ARM_PLATES = { rows: 3, out: 1.5, overlap: 0.08, rim: 0.05, rimOut: 1.62, shade: 0.9, gold: new Color3(0.86, 0.62, 0.18), glow: 0.12 };
/** The Monk's team lamellar rows down both arms, gold-rimmed (spec at MONK_ARM_PLATES). */
export function monkArmPlates(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const P = MONK_ARM_PLATES;
  const mf = getMaterialFactory();
  const plate = teamColor.scale(P.shade);
  const team = mf.get("cloth", plate, { emissive: plate.scale(P.glow) });
  const gold = mf.get("cloth", P.gold, { emissive: P.gold.scale(P.glow) });
  const out: Mesh[] = [];
  for (const limb of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm]) {
    const step = 1 / P.rows;
    for (let i = 0; i < P.rows; i++) {
      const from = Math.max(0, i * step - P.overlap), to = Math.min(1, (i + 1) * step);
      out.push(limbShell(scene, "monkArmPlate", limb, from, to, P.out, team));
      out.push(limbShell(scene, "monkArmRim", limb, to - P.rim, to, P.rimOut, gold));
    }
  }
  return out;
}

/*
 * [S] 416 the Dragon's paper dragon (audit 411 a.1: "one humanoid wearing a dragon mask - TABS: a giant paper dragon head about twice man height on a
 * long serpentine body"; dynasty.dragon.red.png: a huge round red head held up on a pole over the front carrier, big white eyes under a gold brow,
 * a broad snout, an open jaw with dark fangs and a long tongue hanging down past the carrier's chest; dynasty.dragon.jpg: the body a long scalloped
 * team ribbon behind it with a dark spine fringe). Built on the body's root, in h (his standing height, metrics.headTopY):
 *   head: the skull .skull of h across at .headY up, .headZ ahead; the snout .snout [w, h, d] in front of it; the lower jaw .jaw dropped .gape under
 *     the snout; .fangs dark fangs; the tongue .tongue [w, long] hanging from the jaw; two white eyes .eye across with dark pupils under a gold brow;
 *   pole: a dark-gripped team pole .pole across from his hands (.poleFoot of h) up into the skull;
 *   body: .segs team boxes .seg [w, h, long] trailing back from behind the skull, falling from .bodyY to .bodyTail of h and swaying .sway of h side to
 *     side, each with a dark spine fin .fin of h tall on top and a gold belly strip;
 *   a "dragonMouth" node at the jaw's front: the flame jet leaves from it (simulationSystem DRAGON_BREATH).
 */
const DRAGON_FORM = {
  skull: 0.62, size: 2.0, headY: 1.95, headZ: 0.5, snout: [0.6, 0.28, 0.4] as const, jaw: [0.5, 0.1, 0.38] as const, gape: 0.2, fangs: 4,
  tongue: [0.17, 0.55] as const, eye: 0.17, pole: 0.05, poleFoot: 0.55,
  segs: 9, seg: [0.36, 0.32, 0.36] as const, bodyY: 1.3, bodyTail: 0.85, sway: 0.18, fin: 0.14,
  gold: new Color3(0.86, 0.62, 0.3), dark: new Color3(0.12, 0.08, 0.08), white: new Color3(0.95, 0.93, 0.88), tongueTint: 0.85, glow: 0.12,
};
/** [S] 417 the Dragon Carriers (dragonForm): one under every .every-th segment, legs .legLong of h, trunk .trunk, head .head, arms .arm thick up to the
 * pole's dark .grip; trousers .trouserShade and skin .skinShade of the team colour. */
const DRAGON_CARRIER = { every: 3, leg: 0.09, legLong: 0.45, trunk: [0.26, 0.32, 0.16] as const, head: 0.17, arm: 0.06, grip: 0.16, trouserShade: 0.7, skinShade: 1.1 };
/** The Dragon's giant paper head on its pole and its long team body ribbon (spec at DRAGON_FORM). */
export function dragonForm(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const D = DRAGON_FORM;
  const mf = getMaterialFactory();
  const lit = (c: Color3) => mf.get("cloth", c, { emissive: c.scale(D.glow) });
  const team = lit(teamColor), gold = lit(D.gold), dark = lit(D.dark), white = lit(D.white), tongueMat = lit(teamColor.scale(D.tongueTint));
  const h = body.metrics.headTopY;
  const out: Mesh[] = [];
  const holder = new TransformNode("dragonForm", scene);
  holder.parent = body.root;
  const put = (m: Mesh, at: Vector3, material = team): Mesh => {
    m.position.copyFrom(at);
    m.parent = holder;
    m.material = material;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  const head = new Vector3(0, D.headY * h, D.headZ * h);
  const hk = h * D.size; // [P] 417 the head's own scale
  const skullR = D.skull * hk * 0.5;
  const skull = put(MeshBuilder.CreateIcoSphere("dragonSkull", { radius: skullR, subdivisions: 2 }, scene), head);
  skull.scaling.set(1.12, 0.92, 1);
  const snoutAt = head.add(new Vector3(0, -skullR * 0.25, skullR * 0.85));
  put(MeshBuilder.CreateIcoSphere("dragonSnout", { radiusX: D.snout[0] * hk * 0.5, radiusY: D.snout[1] * hk * 0.5, radiusZ: D.snout[2] * hk * 0.5, subdivisions: 1 }, scene), snoutAt);
  const jawAt = snoutAt.add(new Vector3(0, -D.gape * hk, -D.jaw[2] * hk * 0.1));
  put(MeshBuilder.CreateBox("dragonJaw", { width: D.jaw[0] * hk, height: D.jaw[1] * hk, depth: D.jaw[2] * hk }, scene), jawAt);
  // the mouth's dark inside between snout and jaw
  put(MeshBuilder.CreateBox("dragonMaw", { width: D.jaw[0] * hk * 0.85, height: D.gape * hk * 0.9, depth: D.jaw[2] * hk * 0.6 }, scene), Vector3.Center(snoutAt, jawAt).add(new Vector3(0, 0, -D.jaw[2] * hk * 0.15)), dark);
  for (let i = 0; i < D.fangs; i++) {
    const x = (i / (D.fangs - 1) - 0.5) * D.jaw[0] * hk * 0.8;
    put(MeshBuilder.CreateCylinder("dragonFang", { height: D.gape * hk * 0.5, diameterTop: 0.05 * hk, diameterBottom: 0, tessellation: 4 }, scene), snoutAt.add(new Vector3(x, -D.snout[1] * hk * 0.5 - D.gape * hk * 0.2, D.snout[2] * hk * 0.25)), dark);
  }
  const tongue = put(MeshBuilder.CreateBox("dragonTongue", { width: D.tongue[0] * hk, height: D.tongue[1] * hk, depth: 0.06 * hk }, scene), jawAt.add(new Vector3(0, -D.tongue[1] * hk * 0.45, D.jaw[2] * hk * 0.5)), tongueMat);
  tongue.rotation.x = 0.15;
  for (const side of [-1, 1]) {
    const eyeAt = head.add(new Vector3(side * skullR * 0.48, skullR * 0.32, skullR * 0.78));
    put(MeshBuilder.CreateCylinder("dragonEye", { height: 0.03 * hk, diameter: D.eye * hk, tessellation: 10 }, scene), eyeAt, white).rotation.x = Math.PI / 2;
    put(MeshBuilder.CreateCylinder("dragonPupil", { height: 0.035 * hk, diameter: D.eye * hk * 0.5, tessellation: 8 }, scene), eyeAt.add(new Vector3(0, 0, 0.015 * hk)), dark).rotation.x = Math.PI / 2;
    put(MeshBuilder.CreateBox("dragonBrow", { width: D.eye * hk * 1.3, height: 0.05 * hk, depth: 0.08 * hk }, scene), eyeAt.add(new Vector3(side * 0.01 * hk, D.eye * hk * 0.62, 0)), gold).rotation.z = -side * 0.25;
  }
  // the pole up from his hands into the skull
  const foot = new Vector3(0, D.poleFoot * h, D.headZ * h * 0.8);
  const top = head.add(new Vector3(0, -skullR * 0.6, 0));
  put(MeshBuilder.CreateCylinder("dragonPole", { height: top.y - foot.y, diameter: D.pole * h, tessellation: 6 }, scene), Vector3.Center(foot, top));
  put(MeshBuilder.CreateCylinder("dragonPoleGrip", { height: 0.18 * h, diameter: D.pole * h * 1.3, tessellation: 6 }, scene), foot.add(new Vector3(0, 0.05 * h, 0)), dark);
  // [S] 417 a Dragon Carrier under every .every-th body segment (audit 411 a.2 "carriers: none - TABS: four Dragon Carriers in team clothes with Chinese
  // hair beneath the body"; b.1 "carrier poles: none - TABS: red poles with dark grips linking each carrier to the body"; dynasty.dragon.jpg): a
  // standing man in team clothes (darker trousers), a dark topknot, both arms up on a team pole with a dark grip running from his fists into the segment
  const C = DRAGON_CARRIER;
  const trousers = lit(teamColor.scale(C.trouserShade)), skin = lit(teamColor.scale(C.skinShade));
  const carrier = (at: Vector3, underside: number): void => {
    const x = at.x, z = at.z;
    for (const side of [-1, 1]) put(MeshBuilder.CreateBox("dragonCarrierLeg", { width: C.leg * h, height: C.legLong * h, depth: C.leg * h }, scene), new Vector3(x + side * C.leg * h * 0.7, C.legLong * h * 0.5, z), trousers);
    put(MeshBuilder.CreateBox("dragonCarrierBody", { width: C.trunk[0] * h, height: C.trunk[1] * h, depth: C.trunk[2] * h }, scene), new Vector3(x, (C.legLong + C.trunk[1] * 0.5) * h, z));
    const headY = (C.legLong + C.trunk[1] + C.head * 0.55) * h;
    put(MeshBuilder.CreateBox("dragonCarrierHead", { width: C.head * h, height: C.head * h, depth: C.head * h }, scene), new Vector3(x, headY, z), skin);
    put(MeshBuilder.CreateBox("dragonCarrierHair", { width: C.head * h * 1.05, height: C.head * h * 0.4, depth: C.head * h * 1.05 }, scene), new Vector3(x, headY + C.head * h * 0.35, z), dark);
    put(MeshBuilder.CreateIcoSphere("dragonCarrierKnot", { radius: C.head * h * 0.22, subdivisions: 1 }, scene), new Vector3(x, headY + C.head * h * 0.62, z), dark);
    const fist = (C.legLong + C.trunk[1] + C.head * 1.3) * h;
    for (const side of [-1, 1]) {
      const arm = put(MeshBuilder.CreateBox("dragonCarrierArm", { width: C.arm * h, height: (fist - (C.legLong + C.trunk[1] * 0.9) * h), depth: C.arm * h }, scene), new Vector3(x + side * C.trunk[0] * h * 0.5, ((C.legLong + C.trunk[1] * 0.9) * h + fist) / 2, z), skin);
      arm.rotation.z = side * 0.35;
    }
    const pole = put(MeshBuilder.CreateCylinder("dragonCarrierPole", { height: underside - fist + C.grip * h, diameter: D.pole * h, tessellation: 6 }, scene), new Vector3(x, (fist + underside) / 2, z));
    pole.position.y -= C.grip * h * 0.5;
    put(MeshBuilder.CreateCylinder("dragonCarrierGrip", { height: C.grip * h, diameter: D.pole * h * 1.35, tessellation: 6 }, scene), new Vector3(x, fist, z), dark);
  };
  // the body ribbon trailing back
  for (let i = 0; i < D.segs; i++) {
    const t = i / (D.segs - 1);
    const at = new Vector3(Math.sin(t * Math.PI * 1.6) * D.sway * h, (D.bodyY + (D.bodyTail - D.bodyY) * t) * h, head.z - skullR * 0.8 - (i + 0.5) * D.seg[2] * h * 0.92);
    const k = 1 - t * 0.35;
    const turn = Math.cos(t * Math.PI * 1.6) * 0.35;
    put(MeshBuilder.CreateBox("dragonBody", { width: D.seg[0] * h * k, height: D.seg[1] * h * k, depth: D.seg[2] * h }, scene), at).rotation.y = turn;
    put(MeshBuilder.CreateCylinder("dragonFin", { height: D.fin * h * k, diameterTop: 0, diameterBottom: D.seg[2] * h * 0.6, tessellation: 4 }, scene), at.add(new Vector3(0, D.seg[1] * h * k * 0.5 + D.fin * h * k * 0.4, 0)), dark).rotation.y = turn;
    put(MeshBuilder.CreateBox("dragonBelly", { width: D.seg[0] * h * k * 1.04, height: 0.04 * h, depth: D.seg[2] * h * 0.96 }, scene), at.add(new Vector3(0, -D.seg[1] * h * k * 0.5, 0)), gold).rotation.y = turn;
    if (i % DRAGON_CARRIER.every === DRAGON_CARRIER.every - 1) carrier(at, at.y - D.seg[1] * h * k * 0.5);
  }
  const mouth = new TransformNode("dragonMouth", scene);
  mouth.parent = holder;
  mouth.position.copyFrom(Vector3.Center(snoutAt, jawAt).add(new Vector3(0, 0, D.jaw[2] * h * 0.55)));
  return out;
}

/*
 * [S] 416 the Monkey King's staff (audit 411 b.1: "a dark brown pole about 1 m long - TABS: a staff longer than his arm span"; b.2: "plain brown -
 * TABS: a team-coloured shaft with gold banded ends"; dynasty.monkey_king.red.png: a team staff held level across his chest in both fists, reaching
 * well past both hands, each end sheathed in gold with green bands). Carried on the Monk's holder ("monkBoHolder"), so _restMonkBo lays it level
 * across his chest and swings it two-handed: MONKEY_STAFF.long of his height, .thick across, team-coloured; each end a gold sleeve .end of it long,
 * a shade wider, with .bands green bands.
 */
const MONKEY_STAFF = {
  long: 1.35, thick: 0.024, offset: 0.12, end: 0.2, endWide: 1.25, bands: 2, band: 0.018,
  gold: new Color3(0.9, 0.6, 0.2), green: new Color3(0.25, 0.55, 0.3), glow: 0.14,
};
/** The Monkey King's long team staff with gold banded ends, on the Monk's level carry (spec at MONKEY_STAFF). */
export function monkeyStaff(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = MONKEY_STAFF;
  const mf = getMaterialFactory();
  const lit = (c: Color3) => mf.get("cloth", c, { emissive: c.scale(S.glow) });
  const team = lit(teamColor), gold = lit(S.gold), green = lit(S.green);
  body.rightHand.computeWorldMatrix(true);
  const scale = Math.max(0.001, body.rightHand.absoluteScaling.y);
  const height = (body.metrics.overallHeight * body.root.scaling.y) / scale;
  const L = height * S.long, r = height * S.thick;
  const holder = new TransformNode("monkBoHolder", scene);
  holder.parent = body.rightHand;
  const shaft = MeshBuilder.CreateCylinder("monkBo", { height: L, diameter: r * 2, tessellation: 7 }, scene);
  shaft.parent = holder;
  shaft.position.y = L * S.offset;
  shaft.material = team;
  shaft.convertToFlatShadedMesh();
  new TransformNode("boGrip", scene).parent = shaft;
  const out: Mesh[] = [shaft];
  for (const end of [-1, 1]) {
    const sleeve = MeshBuilder.CreateCylinder("monkeyStaffEnd", { height: L * S.end, diameter: r * 2 * S.endWide, tessellation: 7 }, scene);
    sleeve.parent = shaft;
    sleeve.position.y = end * (L * 0.5 - L * S.end * 0.5);
    sleeve.material = gold;
    sleeve.convertToFlatShadedMesh();
    out.push(sleeve);
    for (let i = 0; i < S.bands; i++) {
      const band = MeshBuilder.CreateCylinder("monkeyStaffBand", { height: L * S.band, diameter: r * 2 * S.endWide * 1.15, tessellation: 7 }, scene);
      band.parent = shaft;
      band.position.y = end * (L * 0.5 - L * S.end * (0.2 + i * 0.6));
      band.material = green;
      out.push(band);
    }
  }
  return out;
}

/*
 * [S] 416 the Monkey King's tail (audit 411 a.3: "none - TABS: a long curved team tail rising above his head"; dynasty.monkey_king.red.png and .jpg:
 * a thick team tail from the small of his back, out behind and up, standing over his head with a rounded tip). A faceted tube on the hip through
 * MONKEY_TAIL.path ([y, z] of his height: up, and back as -z), .root thick at the hip tapering to .tip.
 */
const MONKEY_TAIL = {
  path: [[0.0, -0.08], [-0.04, -0.2], [0.08, -0.3], [0.35, -0.32], [0.65, -0.28], [0.92, -0.24], [1.08, -0.2]] as [number, number][],
  root: 0.045, tip: 0.035, glow: 0.12,
};
/** The Monkey King's long team tail rising behind him over his head (spec at MONKEY_TAIL). */
export function monkeyTail(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const T = MONKEY_TAIL;
  const team = getMaterialFactory().get("cloth", teamColor, { emissive: teamColor.scale(T.glow) });
  body.hip.computeWorldMatrix(true);
  const scale = Math.max(0.001, body.hip.absoluteScaling.y);
  const h = (body.metrics.overallHeight * body.root.scaling.y) / scale;
  const path = T.path.map(([y, z]) => new Vector3(0, y * h, z * h));
  const n = path.length - 1;
  const tail = MeshBuilder.CreateTube("monkeyTail", {
    path, tessellation: 6, cap: Mesh.CAP_ALL,
    radiusFunction: (i: number) => (T.root + (T.tip - T.root) * (i / n)) * h,
  }, scene);
  tail.parent = body.hip;
  tail.material = team;
  tail.convertToFlatShadedMesh();
  return [tail];
}

/*
 * [S] 417 the Firework Archer's robe (audit 411 a.2: "a short purple tunic box - TABS: a crossed-lapel team-coloured robe to the knee"; a.3: "none -
 * TABS: an orange-brown waist sash"; dynasty.firework_archer.jpg, .red.png: a team robe over the trunk with a lighter V at the throat between two lapels
 * crossing to the opposite hip, an orange-brown sash round the waist, the skirt falling flared to the knee). In the trunk box (W, H, D), on the trunk's
 * parent like NINJA_GI: the bodice ARCHER_ROBE.out wide, .deep deep over the trunk; the V .vWide of W, .vLong of H, lighter .light; lapels .lapel of W
 * wide, .lapelLong of H long at .cross rad, darker .lapelShade; the sash .sash of H tall at .sashAt of H above the trunk's foot, .sashOut proud,
 * orange-brown; the skirt a six-sided frustum from the trunk's foot .skirt of H long, .skirtTop of W across at the waist flaring to .skirtFoot.
 */
const ARCHER_ROBE = {
  out: 1.14, deep: 1.2, light: 1.3, vWide: 0.3, vLong: 0.3, lapel: 0.13, lapelLong: 0.75, cross: 0.5, lapelShade: 0.82,
  sash: 0.14, sashAt: 0.1, sashOut: 1.08, sashColor: new Color3(0.72, 0.4, 0.16), skirt: 0.95, skirtTop: 1.4, skirtFoot: 1.65, glow: 0.12,
};
/** The Firework Archer's crossed-lapel team robe to the knee with an orange-brown sash (spec at ARCHER_ROBE). */
export function archerRobe(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const G = ARCHER_ROBE;
  const mf = getMaterialFactory();
  const tone = (k: number) => { const c = new Color3(Math.min(1, teamColor.r * k), Math.min(1, teamColor.g * k), Math.min(1, teamColor.b * k)); return mf.get("cloth", c, { emissive: c.scale(G.glow) }); };
  const cloth = tone(1), light = tone(G.light), lapelMat = tone(G.lapelShade);
  const sashMat = mf.get("cloth", G.sashColor, { emissive: G.sashColor.scale(G.glow) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const out: Mesh[] = [];
  const place = (m: Mesh, x: number, y: number, z: number, mat: ReturnType<typeof tone>, rz = 0): Mesh => {
    m.position.set(cx + x, cy + y, cz + z);
    m.rotation.copyFrom(tm.rotation);
    m.rotation.z += rz;
    m.parent = tm.parent;
    m.material = mat;
    out.push(m);
    return m;
  };
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, mat: ReturnType<typeof tone>, rz = 0): Mesh =>
    place(MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene), x, y, z, mat, rz);
  box("archerRobe", W * G.out, H, D * G.deep, 0, 0, 0, cloth);
  const front = D * G.deep / 2;
  box("archerRobeV", W * G.vWide, H * G.vLong, D * 0.04, 0, H / 2 - H * G.vLong / 2, front + D * 0.01, light);
  for (const side of [-1, 1]) {
    box("archerRobeLapel", W * G.lapel, H * G.lapelLong, D * 0.05, side * W * 0.15, H / 2 - H * G.lapelLong / 2, front + D * 0.03, lapelMat, -side * G.cross * 0.5);
  }
  const sashY = -H / 2 + H * G.sashAt;
  box("archerRobeSash", W * G.out * G.sashOut, H * G.sash, D * G.deep * G.sashOut, 0, sashY, 0, sashMat);
  const skirt = MeshBuilder.CreateCylinder("archerRobeSkirt", { height: H * G.skirt, diameterTop: W * G.skirtTop, diameterBottom: W * G.skirtFoot, tessellation: 6 }, scene);
  skirt.convertToFlatShadedMesh();
  skirt.scaling.z = (D * G.deep) / (W * G.out);
  place(skirt, 0, -H / 2 - H * G.skirt / 2 + H * 0.02, 0, cloth);
  return out;
}
