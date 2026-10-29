import { Scene, Color3, Mesh, MeshBuilder, Node, Quaternion, TransformNode, Vector3 } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { limbBox, limbShell } from "./medievalDress";

/*
 * Viking dress (units/viking.*): cloth, hair and ornaments built per unit id by unitFactory, sized off the body's own metrics and joints.
 * Pieces worn on the head are parented to the head mesh (+z his front, +y up, its origin its middle); pieces on the trunk to the torso joint.
 */

/**
 * The higher bead eye's top, in the head block's own frame (null when the body has no eyes). The eyes hang off the neck, not the head block, so a cap
 * or band on the head must be seated off this or it covers them (403 ice archer, 404 headbutter).
 */
function eyeTopInHead(body: ArticulatedBody): number | null {
  const eyes = [body.leftEye, body.rightEye].filter((m): m is Mesh => !!m);
  if (!eyes.length) return null;
  const chain: Node[] = [];
  for (let n: Node | null = eyes[0]; n; n = n.parent) chain.unshift(n);
  for (const n of chain) if (n instanceof TransformNode) n.computeWorldMatrix(true);
  body.headMesh.computeWorldMatrix(true);
  const toHead = body.headMesh.getWorldMatrix().clone().invert();
  let eyeTop = -Infinity;
  for (const eye of eyes) {
    eye.computeWorldMatrix(true);
    const bb = eye.getBoundingInfo().boundingBox;
    eyeTop = Math.max(eyeTop, Vector3.TransformCoordinates(new Vector3(bb.centerWorld.x, bb.maximumWorld.y, bb.centerWorld.z), toHead).y);
  }
  return eyeTop;
}

/** The head block's half extents in its own frame. */
function headExtents(body: ArticulatedBody): Vector3 {
  body.headMesh.computeWorldMatrix(true);
  return body.headMesh.getBoundingInfo().boundingBox.extendSize.clone();
}

/*
 * [S] the Headbutter's spiked cap (392; viking.headbutter.red.png, card Appearance "a helmet with one single spike"; critic 391: a blue dome with
 * two grey horns and a grey nose strip instead). A team-colour cap over the crown, its rim just over the eyes, a dark studded brow band round it,
 * leather ear flaps down each side of the face, and one tall grey spike off the crown with a dark stud at its foot. No horns, nasal strip or beard:
 * those came from the shared viking_helmet, which the Brawler still wears.
 *   dome: a sliced sphere .dome of the head across and .tall of it high, its middle .rise of the head up so its rim sits over the eyes;
 *   band: a dark ring .band of the head tall round the head .bandProud out, studs .stud of the head across round its front;
 *   flaps: dark boxes .flapDrop of the head down from the band at each side, .flapWide across and .flapDeep deep (the head's own depth);
 *   spike: a four-sided grey cone .spike of the head tall off the crown, its foot .spikeBase of the head across, with a stud at its foot.
 */
/*
 * [S] 403 a low skull cap (CONFIRM 402 a.1: "a full sphere as wide as the shoulders"; viking.headbutter.red.png: a low dome over the brow band, no wider
 * than the head, a dark strip running up its front from the band to the spike): the head itself is smaller (unitVisuals headSize 1.3), the dome
 * .dome 1.1 across and .tall .72 high so it hugs the crown, and a dark leather strip .strip of the head across runs over the dome's front from the band
 * to the spike's foot, standing .stripProud of the dome's own surface.
 */
const HEADBUTTER_CAP = {
  dome: 1.1, tall: 0.72, rise: 0.16, eyeClear: 0.03, band: 0.15, bandProud: 1.05, studs: 5, stud: 0.11, strip: 0.2, stripProud: 0.04,
  flapDrop: 0.62, flapWide: 0.2, flapDeep: 0.66, spike: 0.9, spikeBase: 0.2, spikeRise: 0.02, glow: 0.08, darkGlow: 0.06,
};

/** The Headbutter's spiked team cap (spec at HEADBUTTER_CAP). */
export function headbutterCap(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const C = HEADBUTTER_CAP;
  const mf = getMaterialFactory();
  const e = headExtents(body);
  const cap = mf.get("cloth", teamColor.scale(0.92), { emissiveIntensity: C.glow });
  const leather = mf.get("cloth", new Color3(0.2, 0.13, 0.1), { emissiveIntensity: C.darkGlow });
  const steel = mf.get("cloth", new Color3(0.45, 0.46, 0.5), { emissiveIntensity: 0.1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: typeof cap): Mesh => {
    m.material = material;
    m.convertToFlatShadedMesh();
    m.parent = body.headMesh;
    out.push(m);
    return m;
  };
  // [S] 404 the brow band seated above the eyes (critic 403 a.3: "the dark band runs across the eye beads like goggles" once the head shrank to 1.3;
  // viking.headbutter.red.png: the band above the eyes, the eyes on the face under it). As the Ice Archer's cap (403): the band's foot is put
  // .eyeClear of H over the higher eye bead's top read into the head's frame, and the dome, studs, strip, flaps and spike all ride up with it.
  let top = e.y * C.rise;
  const eyeTop = eyeTopInHead(body);
  if (eyeTop !== null) top = Math.max(top, eyeTop + e.y * (C.band * 0.5 + C.eyeClear) + e.y * C.band * 0.35);
  const dome = put(MeshBuilder.CreateSphere("headbutterCap", {
    diameterX: 2 * e.x * C.dome, diameterY: 2 * e.y * C.tall, diameterZ: 2 * e.z * C.dome, segments: 10, slice: 0.56,
  }, scene), cap);
  dome.position.y = top;
  // the brow band: a dark ring round the head, its middle a touch under the cap's rim
  const bandY = top - e.y * C.band * 0.35;
  const band = put(MeshBuilder.CreateBox("headbutterBand", {
    width: 2 * e.x * C.bandProud, height: e.y * C.band, depth: 2 * e.z * C.bandProud,
  }, scene), leather);
  band.position.y = bandY;
  // studs across the band's front, a bead proud of it
  for (let i = 0; i < C.studs; i++) {
    const t = C.studs === 1 ? 0 : i / (C.studs - 1) - 0.5;
    const stud = put(MeshBuilder.CreateIcoSphere("headbutterStud", {
      radius: e.x * C.stud * 0.5, subdivisions: 1, flat: true,
    }, scene), steel);
    stud.position.set(t * 2 * e.x * C.bandProud * 0.82, bandY, e.z * C.bandProud + e.x * C.stud * 0.18);
  }
  // [S] 403 the strip over the dome's front, from the band up to the crown (spec at HEADBUTTER_CAP): short flat slabs laid along the dome's front
  // quarter arc, each stood .stripProud off the ellipse there
  const rimY = top - (2 * 0.56 - 1) * e.y * C.tall;
  const domeRY = e.y * C.tall, domeRZ = e.z * C.dome;
  const pieces = 5;
  for (let i = 0; i < pieces; i++) {
    const a0 = Math.asin(Math.max(-1, Math.min(1, (rimY - top) / domeRY))), a1 = Math.PI / 2;
    const a = a0 + ((i + 0.5) / pieces) * (a1 - a0);
    const da = (a1 - a0) / pieces;
    const y = top + Math.sin(a) * domeRY, z = Math.cos(a) * domeRZ;
    const len = Math.hypot(Math.cos(a) * domeRY, Math.sin(a) * domeRZ) * da * 1.15;
    const slab = put(MeshBuilder.CreateBox("headbutterCapStrip", { width: 2 * e.x * C.strip, height: len, depth: e.z * 0.08 }, scene), leather);
    const nz = Math.cos(a) / domeRZ, ny = Math.sin(a) / domeRY, nl = Math.hypot(nz, ny);
    slab.position.set(0, y + (ny / nl) * e.z * C.stripProud, z + (nz / nl) * e.z * C.stripProud);
    slab.rotation.x = -Math.atan2(ny, nz);
  }
  // the ear flaps: a dark panel down each side of the face, from the band to under the jaw
  for (const side of [-1, 1]) {
    const flap = put(MeshBuilder.CreateBox("headbutterFlap", {
      width: e.x * C.flapWide, height: e.y * C.flapDrop, depth: 2 * e.z * C.flapDeep,
    }, scene), leather);
    flap.position.set(side * (e.x * C.bandProud + e.x * C.flapWide * 0.28), bandY - e.y * C.flapDrop * 0.35, -e.z * 0.06);
    flap.rotation.z = side * 0.07;
  }
  // the single spike: a tall grey cone off the crown, with its stud at the foot
  const crown = top + e.y * C.tall - e.y * 0.03;
  const spike = put(MeshBuilder.CreateCylinder("headbutterSpike", {
    height: e.y * C.spike, diameterTop: 0, diameterBottom: 2 * e.x * C.spikeBase, tessellation: 4,
  }, scene), steel);
  spike.position.y = crown + e.y * C.spike * 0.5;
  const foot = put(MeshBuilder.CreateIcoSphere("headbutterSpikeStud", {
    radius: e.x * C.stud * 0.4, subdivisions: 1, flat: true,
  }, scene), leather);
  foot.position.set(0, crown + e.x * C.stud * 0.2, e.z * C.bandProud * 0.75);
  return out;
}

/*
 * [S] the Ice Archer's round cap (396; viking.ice_archer.red.png, viking.jpg: a round team cap over the crown with a pale fur brim and a pale
 * fur/snow pom; critic 391: a smooth blue cone with a bare point, which was the shared hood). In the head's half extents (W across, H high, D deep):
 *   dome: a sliced sphere 1.26 W across and 1.12 H high, its middle .rise H up, its rim just over the eyes;
 *   brim: a pale fur roll round the rim, .brim of H thick, the head's own depth across;
 *   pom: a faceted pale ball .pom of W across on the crown, with two smaller clumps at its foot.
 */
const ICE_ARCHER_CAP = { dome: 1.26, tall: 1.12, rise: 0.12, slice: 0.58, brim: 0.26, brimOut: 1.3, pom: 0.62, pomLump: 0.36, glow: 0.1 };
const ICE_ARCHER_FUR = new Color3(0.9, 0.74, 0.5);
/** [S] 405 the cap's dark leather band and its rivet studs (spec in iceArcherCap). */
const ICE_ARCHER_BAND = { leather: new Color3(0.26, 0.12, 0.06), rivet: new Color3(0.5, 0.48, 0.44), glow: 0.14, rivets: 8, rivetSize: 0.42, rivetProud: 0.8 };
/** [S] 403 head heights left between the eye beads' top and the brim's foot (spec in iceArcherCap). */
const ICE_ARCHER_EYE_CLEAR = 0.03;
/** The Ice Archer's round team cap with its pale fur brim and snow pom (spec at ICE_ARCHER_CAP). */
export function iceArcherCap(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const C = ICE_ARCHER_CAP;
  const mf = getMaterialFactory();
  const e = headExtents(body);
  const cap = mf.get("cloth", teamColor.scale(0.94), { emissiveIntensity: C.glow });
  const fur = mf.get("cloth", ICE_ARCHER_FUR, { emissiveIntensity: C.glow * 1.2 });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: typeof cap): Mesh => {
    m.material = material;
    m.convertToFlatShadedMesh();
    m.parent = body.headMesh;
    out.push(m);
    return m;
  };
  // [S] 403 the cap seated on the eye line (re-audit 403 a.1: with the idle aimed on her eyes the face under the brim was blank blue - the .rise .12 dome
  // came down over the eye beads, which hang off the neck in front of the head block; viking.ice_archer.red.png: two big bead eyes right under the brim).
  // The rim is placed off the eye meshes themselves: the higher eye's top, read into the head's frame, plus half the brim's tube and .eyeClear of H, so the
  // fur roll sits just over the eyes and the dome rides above them.
  let rise = e.y * C.rise;
  const eyeTop = eyeTopInHead(body);
  if (eyeTop !== null) {
    const rimAt = eyeTop + e.y * (C.brim * 0.5 + ICE_ARCHER_EYE_CLEAR);
    rise = Math.max(rise, rimAt + (2 * C.slice - 1) * e.y * C.tall);
  }
  const dome = put(MeshBuilder.CreateSphere("iceArcherCap", {
    diameterX: 2 * e.x * C.dome, diameterY: 2 * e.y * C.tall, diameterZ: 2 * e.z * C.dome, segments: 10, slice: C.slice,
  }, scene), cap);
  dome.position.y = rise;
  // [S] 405 the brim a dark brown leather band studded with rivets (403 re-audit a.4: "a thin pale grey band"; viking.ice_archer.red.png: a dark brown
  // band round the cap's foot with small studs along it). The band keeps the roll's place and depth; ICE_ARCHER_BAND.rivets faceted studs stand
  // .rivetProud of its tube off its outer face, every other one a little higher so the row reads as studs and not as a second ring.
  const B = ICE_ARCHER_BAND;
  const leather = mf.get("cloth", B.leather, { emissiveIntensity: B.glow });
  const stud = mf.get("cloth", B.rivet, { emissiveIntensity: B.glow * 1.6 });
  const rimY = rise - (2 * C.slice - 1) * e.y * C.tall;
  const brim = put(MeshBuilder.CreateTorus("iceArcherCapBrim", { diameter: 2 * e.x * C.brimOut, thickness: e.y * C.brim, tessellation: 12 }, scene), leather);
  brim.position.y = rimY;
  brim.scaling.z = e.z / e.x;
  const ringR = e.x * C.brimOut + e.y * C.brim * 0.5 * B.rivetProud;
  for (let i = 0; i < B.rivets; i++) {
    const a = (i / B.rivets) * Math.PI * 2 + Math.PI / B.rivets;
    const r = put(MeshBuilder.CreateIcoSphere("iceArcherCapRivet", { radius: e.y * C.brim * B.rivetSize, subdivisions: 1, flat: true }, scene), stud);
    r.position.set(Math.cos(a) * ringR, rimY, Math.sin(a) * ringR * (e.z / e.x));
  }
  // the snow pom on the crown, two clumps at its foot
  const crown = rise + e.y * C.tall - e.y * 0.06;
  const pom = put(MeshBuilder.CreateIcoSphere("iceArcherCapPom", { radius: e.x * C.pom, subdivisions: 1, flat: true }, scene), fur);
  pom.position.set(0, crown, 0);
  for (const side of [-1, 1]) {
    const lump = put(MeshBuilder.CreateIcoSphere("iceArcherCapPomLump", { radius: e.x * C.pomLump, subdivisions: 1, flat: true }, scene), fur);
    lump.position.set(side * e.x * C.pomLump * 1.15, crown - e.y * 0.08, e.z * 0.1);
  }
  return out;
}

/*
 * [S] 402 the Ice Archer's snow mantle (viking.ice_archer.jpg, viking.ice_archer.blue.png: a pale grey jagged fur/snow mantle over both shoulders, its
 * points hanging onto the chest and upper arms; critic 396-401 a.2: "a flat smooth blue disc ring at the neck"). In the chest's size (H high, D deep)
 * and the shoulder width S:
 *   ring: a faceted pale ring .wide S across round the neck's foot, its tube .thick of its radius, sunk .sink H under the collar line, .ahead D forward;
 *   points: .points jagged four-sided points off its outer edge, .point H long, leaning .lean rad out from plumb as they hang over the shoulders and
 *     chest, the ones over the shoulders .shoulderLong longer;
 *   lumps: .lumps rounded clumps along its top so it reads as snow-dusted fur.
 * Pale grey unlit with emissive = colour, out of the glow (LESSONS: pale lit cloth under an overhang reads grey; snow must stay pale).
 */
const ICE_ARCHER_MANTLE = { wide: 0.8, thick: 0.3, sink: 0.05, ahead: 0.04, flat: 0.82, points: 10, point: 0.32, shoulderLong: 0.5, lean: 0.6, lumps: 8, lump: 0.52 };
const ICE_ARCHER_SNOW = new Color3(0.74, 0.76, 0.8);
/** The Ice Archer's pale jagged snow mantle over both shoulders (spec at ICE_ARCHER_MANTLE). */
export function iceArcherMantle(scene: Scene, body: ArticulatedBody): Mesh[] {
  const M = ICE_ARCHER_MANTLE;
  const mf = getMaterialFactory();
  const snow = mf.get("unlit", ICE_ARCHER_SNOW, { emissive: ICE_ARCHER_SNOW });
  const glow = scene.getGlowLayerByName("glow");
  const out: Mesh[] = [];
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const shoulderW = body.metrics.shoulderWidth ?? W * 1.3;
  const r = shoulderW * M.wide * 0.5;
  const y = body.neck.position.y - H * M.sink;
  const z = chest.position.z + D * M.ahead;
  const put = (m: Mesh): Mesh => {
    m.material = snow;
    m.convertToFlatShadedMesh();
    m.parent = body.torso;
    glow?.addExcludedMesh(m);
    out.push(m);
    return m;
  };
  const ring = put(MeshBuilder.CreateTorus("iceArcherMantle", { diameter: r * 2, thickness: r * 2 * M.thick, tessellation: 10 }, scene));
  ring.position.set(0, y, z);
  ring.scaling.z = M.flat;
  for (let i = 0; i < M.points; i++) {
    const a = (i / M.points) * Math.PI * 2 + 0.15;
    const over = Math.abs(Math.cos(a));
    const long = H * M.point * (1 + M.shoulderLong * over);
    const dir = new Vector3(Math.cos(a) * Math.sin(M.lean), -Math.cos(M.lean), Math.sin(a) * M.flat * Math.sin(M.lean)).normalize();
    const point = put(MeshBuilder.CreateCylinder("iceArcherMantlePoint", { height: long, diameterTop: 0, diameterBottom: r * M.thick * 1.3, tessellation: 4 }, scene));
    point.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, new Quaternion());
    const base = new Vector3(Math.cos(a) * r, y - r * M.thick * 0.4, z + Math.sin(a) * r * M.flat);
    point.position.copyFrom(base.add(dir.scale(long * 0.5)));
  }
  for (let i = 0; i < M.lumps; i++) {
    const a = (i / M.lumps) * Math.PI * 2 + 0.5;
    const lump = put(MeshBuilder.CreateIcoSphere("iceArcherMantleLump", { radius: r * M.thick * M.lump, subdivisions: 1, flat: true }, scene));
    lump.position.set(Math.cos(a) * r, y + r * M.thick * (i % 2 ? 0.45 : 0.2), z + Math.sin(a) * r * M.flat);
  }
  return out;
}

/** The head's box in the torso joint's frame: its lowest point, its middle's height and depth, its width, height and depth. */
function headInTorso(body: ArticulatedBody): { chin: number; midY: number; midZ: number; wide: number; tall: number; deep: number } {
  for (let n: Node | null = body.headMesh; n; n = n.parent) if (n instanceof TransformNode) n.computeWorldMatrix(true);
  body.torso.computeWorldMatrix(true);
  const box = body.headMesh.getBoundingInfo().boundingBox;
  const toTorso = body.torso.getWorldMatrix().clone().invert();
  const pts = box.vectorsWorld.map((v) => Vector3.TransformCoordinates(v, toTorso));
  const ys = pts.map((p) => p.y), zs = pts.map((p) => p.z), xs = pts.map((p) => p.x);
  return {
    chin: Math.min(...ys),
    midY: (Math.min(...ys) + Math.max(...ys)) / 2,
    midZ: (Math.min(...zs) + Math.max(...zs)) / 2,
    wide: Math.max(...xs) - Math.min(...xs),
    tall: Math.max(...ys) - Math.min(...ys),
    deep: Math.max(...zs) - Math.min(...zs),
  };
}

/*
 * [S] the Headbutter's two braids (393; viking.headbutter.red.png, viking.headbutter.png, card "long, braided hair"; critic 392: none, a bare blue head).
 * Two thick tan plaits hang from under the cap's ear flaps beside each cheek, down the front of the shoulders and over the chest, ending about a third
 * of the way to the belt in a dark ring tie and a short tuft. Hung from the torso, not the head, so they lie on the chest whatever the neck does. In the
 * head's own size (head heights H, head widths W), torso frame:
 *   root HEADBUTTER_BRAID.apart W out from the middle, .rootUp H above the chin (under the flap), .rootAhead of the head's depth ahead of its middle;
 *   foot .footOut W out, .footDrop H below the chin, laid .standOff W ahead of the chest's front; the path bows forward .bow W over the shoulder line;
 *   .plaits lobes .thick W across on a hair core .core of that, overlapping .overlap of a step, tipped alternately; a tie .band H tall and .bandWide
 *   of the braid round, then a tuft .tuft H long. Tan hair self-lit .glow.
 */
const HEADBUTTER_BRAID = {
  apart: 0.52, rootUp: 0.1, rootAhead: 0.3, footOut: 0.64, footDrop: 1.02, standOff: 0.16, bow: 0.16,
  plaits: 5, thick: 0.34, core: 0.6, overlap: 1.55, band: 0.13, bandWide: 1.35, tuft: 0.22, glow: 0.22,
};
const HEADBUTTER_HAIR = new Color3(0.6, 0.38, 0.2);
const HEADBUTTER_TIE = new Color3(0.34, 0.1, 0.08);

/**
 * A plait's own look (402: the Valkyrie wears the Headbutter's plaits in cream): hair and tie colours, the hair's self-light, or `unlit` for a pale plait
 * that must hold its cream in the chest's shade (emissive = colour, out of the glow), and its own thickness, drop and spread in the head's units.
 */
interface BraidStyle { hair: Color3; tie: Color3; glow: number; unlit?: boolean; thick?: number; footDrop?: number; footOut?: number }
const HEADBUTTER_BRAID_STYLE: BraidStyle = { hair: HEADBUTTER_HAIR, tie: HEADBUTTER_TIE, glow: HEADBUTTER_BRAID.glow };

/** The Headbutter's two tan braids from under the ear flaps down onto the chest, a dark tie and tuft at each end (spec at HEADBUTTER_BRAID). */
export function headbutterBraids(scene: Scene, body: ArticulatedBody, style: BraidStyle = HEADBUTTER_BRAID_STYLE): Mesh[] {
  const B = HEADBUTTER_BRAID;
  const mf = getMaterialFactory();
  const hair = style.unlit ? mf.get("unlit", style.hair, { emissive: style.hair }) : mf.get("cloth", style.hair, { emissiveIntensity: style.glow });
  const tieMat = mf.get("cloth", style.tie, { emissiveIntensity: 0.1 });
  const head = headInTorso(body);
  const H = head.tall, W = head.wide;
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const front = chest.position.z + ext.z * chest.scaling.z;
  const thick = (style.thick ?? B.thick) * W;
  const footDrop = style.footDrop ?? B.footDrop, footOut = style.footOut ?? B.footOut;
  const added: Mesh[] = [];
  const glow = scene.getGlowLayerByName("glow");
  const put = (m: Mesh, material: typeof hair): Mesh => {
    m.material = material;
    m.parent = body.torso;
    if (style.unlit && material === hair) glow?.addExcludedMesh(m);
    added.push(m);
    return m;
  };
  for (const side of [-1, 1]) {
    const root = new Vector3(side * B.apart * W, head.chin + B.rootUp * H, head.midZ + head.deep * B.rootAhead);
    const foot = new Vector3(side * footOut * W, head.chin - footDrop * H, front + B.standOff * W + thick * 0.5);
    // a quadratic from the root to the foot, bowed forward over the shoulder line so it lies on the collar and chest, not through them
    const mid = Vector3.Lerp(root, foot, 0.5);
    mid.z = Math.max(mid.z, foot.z) + B.bow * W;
    const along = (t: number): Vector3 => root.scale((1 - t) ** 2).add(mid.scale(2 * t * (1 - t))).add(foot.scale(t * t));
    const tangent = (t: number): Vector3 => mid.subtract(root).scale(2 * (1 - t)).add(foot.subtract(mid).scale(2 * t)).normalize();
    const lean = (t: number): number => Math.atan2(-tangent(t).z, -tangent(t).y);
    const path: Vector3[] = [];
    for (let k = 0; k <= 10; k++) path.push(along(k / 10));
    put(MeshBuilder.CreateTube("headbutterBraidCore", { path, radius: thick * 0.5 * B.core, tessellation: 6 }, scene), hair);
    const step = 1 / B.plaits;
    const len = Vector3.Distance(root, foot) * 1.05;
    for (let k = 0; k < B.plaits; k++) {
      const t = (k + 0.5) * step * 0.92;
      const lobe = put(MeshBuilder.CreateIcoSphere("headbutterBraid", {
        radiusX: thick * 0.5, radiusY: len * step * 0.5 * B.overlap, radiusZ: thick * 0.42, subdivisions: 1, flat: true,
      }, scene), hair);
      lobe.position.copyFrom(along(t));
      lobe.position.x += (k % 2 ? 1 : -1) * thick * 0.08;
      lobe.rotation.set(lean(t), 0, (k % 2 ? 1 : -1) * 0.35);
    }
    const tie = put(MeshBuilder.CreateCylinder("headbutterBraidTie", { height: B.band * H, diameter: thick * B.bandWide, tessellation: 7 }, scene), tieMat);
    tie.position.copyFrom(foot);
    tie.rotation.x = lean(1);
    const tuft = put(MeshBuilder.CreateCylinder("headbutterBraidTuft", {
      height: B.tuft * H, diameterTop: thick * 0.7, diameterBottom: thick * 0.25, tessellation: 5,
    }, scene), hair);
    tuft.convertToFlatShadedMesh();
    tuft.position.copyFrom(foot.add(tangent(1).scale((B.band + B.tuft) * H * 0.5)));
    tuft.rotation.x = lean(1);
  }
  return added;
}

/*
 * [S] 402 the Valkyrie's fur collar and braids (viking.valkyrie.red.png, viking.valkyrie.png; critic 391-401 a.3: "a bare blue chest"): a pale fur
 * ruff round the neck over both shoulders, and two thick pale plaits from under the helm down over the chest to the belt line, each tied dark at its end.
 *   collar: a faceted fur ring .wide of the shoulder width across, round the neck's foot, its tube .thick of its radius, with .lumps rounded clumps stood
 *   round it so it reads as fur, .lift of the chest's height over the collar line and .ahead of the chest's depth forward;
 *   braids: the Headbutter's plait (HEADBUTTER_BRAID) in cream, .braidThick head widths thick, dropped .footDrop head heights to the belt, .footOut apart.
 * Cream unlit with emissive = colour, out of the glow (LESSONS: pale lit cloth under an overhang reads grey).
 */
const VALKYRIE_COLLAR = { wide: 0.62, thick: 0.32, lumps: 9, lift: 0.02, ahead: 0.08, braidThick: 0.42, footDrop: 1.5, footOut: 0.6 };
const VALKYRIE_CREAM = new Color3(0.86, 0.74, 0.5);
const VALKYRIE_TIE = new Color3(0.3, 0.16, 0.1);

/** The Valkyrie's pale fur collar and two cream plaits over the chest (spec at VALKYRIE_COLLAR). */
export function valkyrieCollar(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = VALKYRIE_COLLAR;
  const mf = getMaterialFactory();
  const fur = mf.get("unlit", VALKYRIE_CREAM, { emissive: VALKYRIE_CREAM });
  const out: Mesh[] = [];
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const shoulderW = body.metrics.shoulderWidth ?? W * 1.3;
  const r = shoulderW * C.wide * 0.5;
  const y = body.neck.position.y + H * C.lift;
  const z = chest.position.z + D * C.ahead;
  const put = (m: Mesh): Mesh => {
    m.material = fur;
    m.parent = body.torso;
    out.push(m);
    return m;
  };
  const ring = put(MeshBuilder.CreateTorus("valkyrieCollar", { diameter: r * 2, thickness: r * 2 * C.thick, tessellation: 9 }, scene));
  ring.convertToFlatShadedMesh();
  ring.position.set(0, y, z);
  for (let i = 0; i < C.lumps; i++) {
    const a = (i / C.lumps) * Math.PI * 2 + 0.3;
    const lump = put(MeshBuilder.CreateIcoSphere("valkyrieCollarLump", { radius: r * C.thick * 0.95, subdivisions: 1, flat: true }, scene));
    lump.position.set(Math.cos(a) * r, y + (i % 2 ? r * C.thick * 0.4 : -r * C.thick * 0.15), z + Math.sin(a) * r);
  }
  const glow = scene.getGlowLayerByName("glow");
  for (const m of out) glow?.addExcludedMesh(m);
  out.push(...headbutterBraids(scene, body, { hair: VALKYRIE_CREAM, tie: VALKYRIE_TIE, glow: 0, unlit: true, thick: C.braidThick, footDrop: C.footDrop, footOut: C.footOut }));
  return out;
}

/*
 * [S] 403 the Valkyrie's armour (viking.valkyrie.red.png, viking.valkyrie.png; critic 391-402 a.4: "a plain blue tunic and skirt, no belt, trim or
 * boots"): over the team tunic, a wide brown belt round the waist with a big gold ring on its front, a gold band round each upper arm, dark team
 * bracers on the forearms, and brown boots over the feet and lower shins.
 *   belt: a band .beltTall of the trunk tall at .beltAt of its half height, .beltOut of the trunk's half width out, brown (the Headbutter's belt brown,
 *     HEADBUTTER_BELT) with a dark rim at top and foot; ring: a gold torus .ring of the trunk's width across standing on the belt's front, .ringProud of
 *     the belt's radius out so it clears the plaits' feet;
 *   arm bands: a gold sleeve from .bandFrom to .bandTo of each upper arm, .bandOut of its radius;
 *   bracers: a team-dark (x .bracerDark) sleeve from .bracerFrom to .bracerTo of each forearm, .bracerOut;
 *   boots: a brown sleeve from .bootFrom of the shin to its foot, .bootOut, and the foot mesh itself in the boot's leather.
 * Gold as cloth with its own light (LESSONS: "metal" renders near black under swiftshader), off the palette's gold (ZEUS_TOGA's (.88,.58,.1)).
 */
const VALKYRIE_ARMOUR = {
  beltTall: 0.3, beltAt: -0.42, beltOut: 1.3, rim: 0.18, ring: 0.3, ringThick: 0.3, ringProud: 1.42,
  bandFrom: 0.3, bandTo: 0.5, bandOut: 1.3, bracerFrom: 0.12, bracerTo: 0.9, bracerOut: 1.22, bracerDark: 0.32,
  bootFrom: 0.5, bootOut: 1.2, gold: new Color3(0.88, 0.58, 0.1), goldGlow: 0.5, boot: new Color3(0.36, 0.21, 0.12), glow: 0.2,
};
/** The Valkyrie's brown belt and gold ring, gold arm bands, dark bracers and brown boots (spec at VALKYRIE_ARMOUR). */
export function valkyrieArmour(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const A = VALKYRIE_ARMOUR;
  const mf = getMaterialFactory();
  const beltMat = mf.get("cloth", HEADBUTTER_BELT.color, { emissive: HEADBUTTER_BELT.color.scale(HEADBUTTER_BELT.glow) });
  const rimMat = mf.get("cloth", HEADBUTTER_BELT.rim, { emissive: HEADBUTTER_BELT.rim.scale(HEADBUTTER_BELT.glow) });
  const gold = mf.get("cloth", A.gold, { emissive: A.gold.scale(A.goldGlow) });
  const dark = teamColor.scale(A.bracerDark);
  const bracerMat = mf.get("cloth", dark, { emissive: dark.scale(A.glow) });
  const boot = mf.get("cloth", A.boot, { emissive: A.boot.scale(A.glow) });
  const out: Mesh[] = [];
  // [S] 404 the belt seated off the trunk mesh itself (critic 403 a.4: seated at extendSize.y * beltAt in the torso node's frame, ignoring torsoMesh's own
  // offset and scale, it sat low inside the skirt as a brown box off her left hip and the ring floated under the hem). The trunk box is read as limbBox
  // reads a limb: its middle = torsoMesh.position + its bbox centre x scaling, its half extents = extendSize x scaling, so the band wraps the waist
  // .beltAt of the half height under the middle, centred on the trunk in x and z, and the ring stands on the band's front face.
  const tb = body.torsoMesh.getBoundingInfo().boundingBox, ts = body.torsoMesh.scaling, tp = body.torsoMesh.position;
  const half = new Vector3(tb.extendSize.x * ts.x, tb.extendSize.y * ts.y, tb.extendSize.z * ts.z);
  const mid = new Vector3(tp.x + tb.center.x * ts.x, tp.y + tb.center.y * ts.y, tp.z + tb.center.z * ts.z);
  const beltH = half.y * 2 * A.beltTall;
  const beltD = half.x * 2 * A.beltOut;
  const zScale = (half.z / half.x) * 0.98;
  const beltY = mid.y + half.y * A.beltAt;
  const band = MeshBuilder.CreateCylinder("valkyrieBelt", { height: beltH, diameter: beltD, tessellation: 8 }, scene);
  band.position.set(mid.x, beltY, mid.z);
  band.scaling.z = zScale;
  band.parent = body.torso;
  band.material = beltMat;
  band.convertToFlatShadedMesh();
  out.push(band);
  for (const edge of [-1, 1]) {
    const rim = MeshBuilder.CreateCylinder("valkyrieBeltRim", { height: beltH * A.rim, diameter: beltD * 1.03, tessellation: 8 }, scene);
    rim.position.set(mid.x, beltY + edge * beltH * (0.5 - A.rim * 0.5), mid.z);
    rim.scaling.z = zScale;
    rim.parent = body.torso;
    rim.material = rimMat;
    rim.convertToFlatShadedMesh();
    out.push(rim);
  }
  // the gold ring standing on the belt's front, facing ahead
  const ringD = half.x * 2 * A.ring;
  const ring = MeshBuilder.CreateTorus("valkyrieBeltRing", { diameter: ringD, thickness: ringD * A.ringThick, tessellation: 10 }, scene);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(mid.x, beltY, mid.z + beltD * 0.5 * zScale * A.ringProud);
  ring.parent = body.torso;
  ring.material = gold;
  ring.convertToFlatShadedMesh();
  out.push(ring);
  // gold arm bands, dark bracers, brown boots
  for (const [upper, fore, shin] of [[body.leftUpperArm, body.leftLowerArm, body.leftLowerLeg], [body.rightUpperArm, body.rightLowerArm, body.rightLowerLeg]] as const) {
    out.push(limbShell(scene, "valkyrieArmBand", upper, A.bandFrom, A.bandTo, A.bandOut, gold));
    out.push(limbShell(scene, "valkyrieBracer", fore, A.bracerFrom, A.bracerTo, A.bracerOut, bracerMat));
    out.push(limbShell(scene, "valkyrieBoot", shin, A.bootFrom, 1.0, A.bootOut, boot));
  }
  for (const foot of body.root.getChildMeshes(false)) if (/_[lr]FootM$/.test(foot.name)) foot.material = boot;
  return out;
}

/*
 * [S] the vikings' own beard (395; viking.berserker.red.png, viking.brawler.red.png, card berserker "It has a beard", brawler "the stereotypical Viking
 * beard"; critic 394/391: no beard on either, only the thin dark cone the shared helm used to carry). A full faceted beard hung off the jaw and chin, in
 * the head's own half extents (W across, H high, D deep; +z his front):
 *   sideburns: a tapered column each side from the temple (.burnTop H up) down the cheek to the jaw;
 *   jaw mass: a faceted ball .jaw (x, y, z) of the half extents at .jawY H down and .jawZ D ahead, wider than the head so it reads past its silhouette;
 *   bib: a wedge under the jaw down .down H and .wide W across at its root, narrowing to .tip of that, leaning .lean rad forward off the chest;
 *   locks: .locks pointed locks off the bib's foot, the middle ones longest;
 *   moustache: a drooping faceted bar over the upper lip, .stache W across, its ends hanging into the beard;
 *   braid: two ties and a tuft at the bib's foot (a plaited point), when the cut wears one.
 * Self-lit .glow so the dark hair stays warm in the shade.
 */
interface VikingBeardCut {
  color: Color3; glow: number; down: number; wide: number; tip: number; braid: boolean; stache: boolean;
  /** The jaw mass's half extents in head units, its drop and its stand-off (defaults read off VIKING_BEARD). */
  jaw?: readonly [number, number, number]; jawY?: number; jawZ?: number;
  /** Where the moustache sits (H down) and how far it stands out (D), so a helmed cut can hang it under the mask's edge. */
  stacheLow?: number; stacheZ?: number;
  /** Sideburns from the temple: off under a full-face helm, whose mask covers them. */
  burns?: boolean;
  /** The plaited length under the bib in head heights, when the cut's braid is longer than VIKING_BEARD.braidLong (the Jarl's, 402). */
  braidLong?: number;
}
const VIKING_BEARD = {
  burnTop: 0.2, burn: 0.22, jaw: 1.2, jawY: 0.66, jawZ: 0.6,
  locks: 5, lockLong: 0.26, braidLong: 0.3, band: 0.09, tuft: 0.16,
};
function vikingBeard(scene: Scene, body: ArticulatedBody, cut: VikingBeardCut): Mesh[] {
  const B = VIKING_BEARD;
  const mf = getMaterialFactory();
  const hair = mf.get("cloth", cut.color, { emissiveIntensity: cut.glow });
  const tie = mf.get("cloth", cut.color.scale(0.45), { emissiveIntensity: cut.glow * 0.6 });
  const e = headExtents(body);
  const halfX = e.x, halfY = e.y, halfZ = e.z;
  const W = halfX * 2, H = halfY * 2;
  const added: Mesh[] = [];
  const put = (m: Mesh): Mesh => {
    m.material = hair;
    m.parent = body.headMesh;
    m.convertToFlatShadedMesh();
    added.push(m);
    return m;
  };
  // a tapered four-sided length from `from` to `to`, its wide end at `from`
  const column = (name: string, from: Vector3, to: Vector3, root: number, tipWide: number): Mesh => {
    const d = to.subtract(from);
    const m = MeshBuilder.CreateCylinder(name, { height: d.length(), diameterTop: root, diameterBottom: tipWide, tessellation: 5 }, scene);
    m.rotationQuaternion = Quaternion.Identity();
    Quaternion.FromUnitVectorsToRef(new Vector3(0, -1, 0), d.normalize(), m.rotationQuaternion);
    m.position = Vector3.Center(from, to);
    return put(m);
  };
  for (const side of [-1, 1]) {
    if (cut.burns === false) break;
    column("vikingBeardBurn", new Vector3(side * halfX * 1.0, halfY * B.burnTop, halfZ * 0.12), new Vector3(side * halfX * 0.96, -halfY * 0.6, halfZ * 0.5),
      W * B.burn, W * B.burn * 1.05);
  }
  const jawScale = cut.jaw ?? ([B.jaw, B.jawY, B.jawZ] as const);
  const jaw = MeshBuilder.CreateIcoSphere("vikingBeardJaw", { radius: 1, subdivisions: 1, flat: true }, scene);
  jaw.scaling.set(halfX * jawScale[0], halfY * jawScale[1], halfZ * jawScale[2]);
  jaw.position.set(0, -halfY * (cut.jawY ?? B.jawY), halfZ * (cut.jawZ ?? B.jawZ));
  put(jaw);
  // the bib: from under the chin down onto the chest, leaning forward off it
  const jawDrop = cut.jawY ?? B.jawY, jawTall = jawScale[1];
  const bibTop = new Vector3(0, -halfY * (jawDrop + jawTall * 0.55), halfZ * (cut.jawZ ?? B.jawZ));
  const lean = 0.12;
  const bibFoot = bibTop.add(new Vector3(0, -Math.cos(lean) * H * cut.down, Math.sin(lean) * H * cut.down));
  const bib = column("vikingBeardBib", bibTop, bibFoot, W * cut.wide, W * cut.wide * cut.tip);
  bib.scaling.z = 0.6;
  for (let i = 0; i < B.locks; i++) {
    const u = (i + 0.5) / B.locks - 0.5;
    const long = H * B.lockLong * (1 - Math.abs(u) * 0.85) * (0.85 + 0.3 * ((i * 7) % 5) / 5);
    const from = Vector3.Lerp(bibTop, bibFoot, 0.72).add(new Vector3(u * W * cut.wide * 0.62, 0, 0));
    column("vikingBeardLock", from, from.add(new Vector3(u * W * 0.28, -long, long * 0.25)), W * 0.15, W * 0.02);
  }
  if (cut.stache) {
    const low = cut.stacheLow ?? 0.2, ahead = cut.stacheZ ?? 1.08;
    for (const side of [-1, 1]) {
      column("vikingBeardStache", new Vector3(0, -halfY * low, halfZ * ahead), new Vector3(side * W * 0.38, -halfY * (low + 0.26), halfZ * (ahead - 0.12)), W * 0.14, W * 0.07);
    }
  }
  if (cut.braid) {
    // the braid at the end of the beard: a plaited length, two dark ties, a short tuft
    const end = bibFoot.add(new Vector3(0, H * B.tuft * 0.35, halfZ * 0.12));
    const foot = end.add(new Vector3(0, -H * (cut.braidLong ?? B.braidLong), halfZ * 0.16));
    const plait = column("vikingBeardBraid", end, foot, W * 0.21, W * 0.16);
    plait.scaling.z = 0.8;
    for (let k = 0; k < 3; k++) {
      const at = Vector3.Lerp(end, foot, (k + 0.5) / 3);
      const band = MeshBuilder.CreateCylinder("vikingBeardBraidBand", { height: H * B.band, diameter: W * (0.23 - k * 0.02), tessellation: 6 }, scene);
      band.rotationQuaternion = Quaternion.Identity();
      band.rotation.x = 0.12;
      band.position.copyFrom(at);
      band.material = tie;
      band.parent = body.headMesh;
      added.push(band);
    }
    const tuft = MeshBuilder.CreateCylinder("vikingBeardBraidTuft", { height: H * B.tuft * 2, diameterTop: W * 0.16, diameterBottom: 0, tessellation: 5 }, scene);
    tuft.position.copyFrom(foot.add(new Vector3(0, -H * B.tuft, 0)));
    tuft.material = hair;
    tuft.parent = body.headMesh;
    tuft.convertToFlatShadedMesh();
    added.push(tuft);
  }
  return added;
}

/** The Berserker's big dark beard and moustache, ending in a tied braid (spec at VIKING_BEARD). */
export function berserkerBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  return vikingBeard(scene, body, { color: new Color3(0.3, 0.12, 0.1), glow: 0.2, down: 0.9, wide: 1.12, tip: 0.48, braid: true, stache: true });
}

/*
 * [S] 402 the Jarl's braided beard (viking.jarl.red.png, viking.jarl.jpg, card Appearance "a stereotypical Viking beard"; critic 400/401 a.2: "the thin
 * brown cone nose, no beard"). A mid-brown beard between the hood's fur curtains: a jaw mass narrower than his face (JARL_BEARD.jaw of the head's half
 * extents, inside the curtains' inner faces at .91 of the half width), a bib .down head heights onto the chest between the pelt's chest strips, a long
 * moustache, no sideburns (the curtains hang there), and under the bib a long plait .braidLong head heights with three dark ties and a tuft - the beard
 * tied at its end, as the render shows it. Self-lit .glow so the brown stays warm under the bear's muzzle.
 */
const JARL_BEARD = { color: new Color3(0.5, 0.28, 0.14), glow: 0.2, down: 0.72, wide: 0.78, tip: 0.6, jaw: [0.9, 0.78, 0.72] as const, jawY: 0.78, jawZ: 0.62, stacheLow: 0.3, stacheZ: 1.1, braidLong: 0.66 };
/** The Jarl's brown beard ending in a long tied plait, between the bear hood's curtains (spec at JARL_BEARD). */
export function jarlBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  const J = JARL_BEARD;
  const head = vikingBeard(scene, body, {
    color: J.color, glow: J.glow, down: J.down, wide: J.wide, tip: J.tip, braid: false, stache: true,
    jaw: J.jaw, jawY: J.jawY, jawZ: J.jawZ, stacheLow: J.stacheLow, stacheZ: J.stacheZ, burns: false,
  });
  return [...head, ...jarlBeardRun(scene, body)];
}

/*
 * [S] 403 the Jarl's beard runs on down his chest (re-audit 403 a.1: "a short tan jaw chunk under the nose, cut off by the mantle's front edge, no
 * plait"; viking.jarl.red.png: a broad brown beard from the chin over the chest, narrowing into a long braid tied red at mid-chest). The head-hung bib
 * cannot run down the torso (LESSONS: at the chest's z it sits inside the chest box, and the pelt's mantle covers it), so the run is torso-parented,
 * stood in front of the mantle's front plane (JARL_PELT.mantleDeep of the chest depth) at .ahead of the depth:
 *   bib: a tapered faceted block from under the chin (.top of the chest height over the neck joint) down .bibDrop of the chest height, .bibWide of the
 *     chest width across at its top narrowing to .bibTip of that, .bibDeep deep;
 *   plait: from the bib's foot down .plaitLong of the chest height, .plait of the chest width thick, with .ties red ties and a short tuft at its end.
 * The head cut keeps the jaw mass and moustache; its own short bib and braid are dropped so only this run hangs below the chin.
 */
const JARL_BEARD_RUN = { ahead: 0.82, top: 0.04, bibDrop: 0.36, bibWide: 0.5, bibTip: 0.55, bibDeep: 0.14, plaitLong: 0.36, plait: 0.13, ties: 2, tie: new Color3(0.55, 0.1, 0.08) };
function jarlBeardRun(scene: Scene, body: ArticulatedBody): Mesh[] {
  const R = JARL_BEARD_RUN, J = JARL_BEARD;
  const mf = getMaterialFactory();
  const hair = mf.get("cloth", J.color, { emissive: J.color.scale(J.glow) });
  const tieMat = mf.get("cloth", R.tie, { emissive: R.tie.scale(0.25) });
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const z = chest.position.z + D * Math.max(R.ahead, JARL_PELT.mantleDeep + 0.1);
  const out: Mesh[] = [];
  const put = (m: Mesh, mat = hair): Mesh => { m.material = mat; m.parent = body.torso; m.convertToFlatShadedMesh(); out.push(m); return m; };
  const topY = body.neck.position.y + H * R.top;
  const bibH = H * R.bibDrop;
  const bib = put(MeshBuilder.CreateCylinder("jarlBeardBib", { height: bibH, diameterTop: W * R.bibWide, diameterBottom: W * R.bibWide * R.bibTip, tessellation: 6 }, scene));
  bib.scaling.z = (D * R.bibDeep) / (W * R.bibWide);
  bib.position.set(0, topY - bibH * 0.5, z);
  const plaitH = H * R.plaitLong;
  const footY = topY - bibH;
  const plait = put(MeshBuilder.CreateCylinder("jarlBeardPlait", { height: plaitH, diameterTop: W * R.plait, diameterBottom: W * R.plait * 0.8, tessellation: 5 }, scene));
  plait.position.set(0, footY - plaitH * 0.5, z + D * 0.02);
  for (let k = 0; k < R.ties; k++) {
    const tie = put(MeshBuilder.CreateCylinder("jarlBeardTie", { height: H * 0.035, diameter: W * R.plait * 1.25, tessellation: 6 }, scene), tieMat);
    tie.position.set(0, footY - plaitH * (0.45 + 0.4 * k), z + D * 0.02);
  }
  const tuft = put(MeshBuilder.CreateCylinder("jarlBeardTuft", { height: H * 0.08, diameterTop: W * R.plait * 1.1, diameterBottom: 0, tessellation: 5 }, scene));
  tuft.position.set(0, footY - plaitH - H * 0.04, z + D * 0.02);
  return out;
}

/*
 * [S] 404 the Jarl's forearm wraps (re-audit 403 a.3: "bare team-skin arms from shoulder to mitt"; viking.jarl.red.png, viking.jarl.jpg: dark maroon
 * wraps from the elbow to the wrist on both forearms, a tan fur roll round the elbow end of each). In each forearm's own frame (limbShell):
 *   wrap: a maroon sleeve from .from to .to of the forearm, .out of its radius, with .bands darker rings across it so it reads as bound cloth;
 *   fur: a faceted roll round the wrap's top, .furOut of the radius, its tube .furThick of that, .lumps rounded clumps on it (the Headbutter's roll),
 *     in the Headbutter's lit tan (HEADBUTTER_CREAM).
 */
const JARL_WRAPS = {
  from: 0.1, to: 0.94, out: 1.24, bands: 3, band: 0.05, bandOut: 1.3, furAt: 0.1, furOut: 1.42, furThick: 0.34, lumps: 7,
  maroon: new Color3(0.3, 0.06, 0.07), dark: new Color3(0.16, 0.03, 0.04), glow: 0.25,
};
/** The Jarl's maroon forearm wraps with a tan fur roll at each elbow (spec at JARL_WRAPS). */
export function jarlArmWraps(scene: Scene, body: ArticulatedBody): Mesh[] {
  const J = JARL_WRAPS;
  const mf = getMaterialFactory();
  const wrapMat = mf.get("cloth", J.maroon, { emissive: J.maroon.scale(J.glow) });
  const bandMat = mf.get("cloth", J.dark, { emissive: J.dark.scale(J.glow) });
  const fur = mf.get("cloth", HEADBUTTER_CREAM.color, { emissive: HEADBUTTER_CREAM.color.scale(HEADBUTTER_CREAM.creamGlow) });
  const out: Mesh[] = [];
  for (const fore of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "jarlWrap", fore, J.from, J.to, J.out, wrapMat));
    for (let k = 0; k < J.bands; k++) {
      const at = J.from + ((J.to - J.from) * (k + 1)) / (J.bands + 1);
      out.push(limbShell(scene, "jarlWrapBand", fore, at - J.band * 0.5, at + J.band * 0.5, J.bandOut, bandMat));
    }
    const L = limbBox(fore);
    const r = Math.max(L.wide, L.deep) * J.furOut;
    const y = L.mid + L.half - J.furAt * L.half * 2;
    const flat = L.deep / Math.max(L.wide, L.deep);
    const ring = MeshBuilder.CreateTorus("jarlWrapFur", { diameter: r * 2, thickness: r * 2 * J.furThick, tessellation: 8 }, scene);
    ring.parent = fore.parent;
    ring.position.set(0, y, 0);
    ring.scaling.z = flat;
    ring.material = fur;
    ring.convertToFlatShadedMesh();
    out.push(ring);
    for (let i = 0; i < J.lumps; i++) {
      const a = (i / J.lumps) * Math.PI * 2 + (i % 2 ? 0.22 : 0);
      const lump = MeshBuilder.CreateIcoSphere("jarlWrapFurLump", { radius: r * J.furThick * 0.92, subdivisions: 1, flat: true }, scene);
      lump.parent = fore.parent;
      lump.position.set(Math.cos(a) * r * 0.99, y + (i % 2 ? r * J.furThick * 0.36 : -r * J.furThick * 0.2), Math.sin(a) * r * flat * 0.99);
      lump.material = fur;
      out.push(lump);
    }
  }
  return out;
}

/*
 * [S] 406 the Jarl's belt (re-audit 403 a.2: "a flat brown mantle box over the chest and a blue tunic whose hem flares as a skirt"; viking.jarl.red.png:
 * a bare team chest between the pelt curtains down to a dark leather belt at the waist, a round metal buckle on its front, the trousers straight under
 * it). Seated off the trunk mesh as VALKYRIE_ARMOUR's belt is: a band .tall of the trunk tall at .at of its half height under the middle, .out of its
 * half width round, dark rims top and foot; the buckle a round ring .ring of the trunk's width across, .ringThick of that thick, standing .proud of the
 * band's radius out on its front, with a tongue bar across it. The generic tunicSkirt is off for him (unitFactory skirt condition).
 */
const JARL_BELT = {
  tall: 0.24, at: -0.74, out: 1.2, rim: 0.2, ring: 0.24, ringThick: 0.3, proud: 1.08,
  leather: new Color3(0.24, 0.13, 0.07), rimDark: new Color3(0.13, 0.07, 0.04), metal: new Color3(0.55, 0.52, 0.48), glow: 0.2,
};
/** The Jarl's dark leather belt with a round buckle (spec at JARL_BELT). */
export function jarlBelt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = JARL_BELT;
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", B.leather, { emissive: B.leather.scale(B.glow) });
  const rimMat = mf.get("cloth", B.rimDark, { emissive: B.rimDark.scale(B.glow) });
  const metal = mf.get("cloth", B.metal, { emissive: B.metal.scale(0.3) });
  const tb = body.torsoMesh.getBoundingInfo().boundingBox, ts = body.torsoMesh.scaling, tp = body.torsoMesh.position;
  const half = new Vector3(tb.extendSize.x * ts.x, tb.extendSize.y * ts.y, tb.extendSize.z * ts.z);
  const mid = new Vector3(tp.x + tb.center.x * ts.x, tp.y + tb.center.y * ts.y, tp.z + tb.center.z * ts.z);
  const h = half.y * 2 * B.tall, d = half.x * 2 * B.out, zScale = (half.z / half.x) * 0.98, y = mid.y + half.y * B.at;
  const out: Mesh[] = [];
  const ringOf = (name: string, tall: number, wide: number, material: typeof leather, at: number): void => {
    const m = MeshBuilder.CreateCylinder(name, { height: tall, diameter: wide, tessellation: 8 }, scene);
    m.position.set(mid.x, at, mid.z);
    m.scaling.z = zScale;
    m.parent = body.torso;
    m.material = material;
    m.convertToFlatShadedMesh();
    out.push(m);
  };
  ringOf("jarlBelt", h, d, leather, y);
  for (const edge of [-1, 1]) ringOf("jarlBeltRim", h * B.rim, d * 1.03, rimMat, y + edge * h * (0.5 - B.rim * 0.5));
  const front = mid.z + d * 0.5 * zScale * B.proud;
  const ringD = half.x * 2 * B.ring;
  const buckle = MeshBuilder.CreateTorus("jarlBeltBuckle", { diameter: ringD, thickness: ringD * B.ringThick, tessellation: 12 }, scene);
  buckle.rotation.x = Math.PI / 2;
  buckle.position.set(mid.x, y, front);
  buckle.parent = body.torso;
  buckle.material = metal;
  buckle.convertToFlatShadedMesh();
  out.push(buckle);
  const tongue = MeshBuilder.CreateBox("jarlBeltTongue", { width: ringD * 0.95, height: ringD * 0.14, depth: ringD * 0.16 }, scene);
  tongue.position.set(mid.x, y, front + ringD * 0.05);
  tongue.parent = body.torso;
  tongue.material = metal;
  out.push(tongue);
  return out;
}

/**
 * The Brawler's dark beard, hung from under his full-face helm's mask: the jaw mass starts BELOW the mask's bottom edge (-1.02 H) and stands proud of the
 * mask's face (1.04 D), so it spills out under the helmet instead of sitting inside it (critic 395: nearly all of it was buried in the mask), with the
 * moustache hung at the mask's foot and the bib .9 head heights down onto the chest.
 * [S] 398 the critic read 396's cut as a short dark mass, not a jaw-wide beard. The mask now ends at the cheek line (maskBottom -0.52, the cheek guards
 * kept long) so the lower face is open, and the beard fills it: a jaw mass 1.5 H across and .95 H tall hung at 1.0 H, wider than the face it sits on,
 * with a bigger moustache under the mask's foot and the bib wider down onto the chest.
 */
export function brawlerBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  return vikingBeard(scene, body, {
    color: new Color3(0.32, 0.15, 0.11), glow: 0.22, down: 0.95, wide: 1.4, tip: 0.55, braid: true, stache: true,
    jaw: [1.5, 0.95, 0.8], jawY: 1.0, jawZ: 0.55, stacheLow: 0.62, stacheZ: 1.25, burns: false,
  });
}

/*
 * [S] 397 the Brawler's puffy pants, fur calf cuffs and brown boots (viking.brawler.red.png, viking.brawler.jpg, card Appearance: puffy team trousers
 * with big cream fur cuffs over brown boots; critic 396: slim blue legs and plain blue boots). In the legs' own frames: a fat team trouser shell round
 * each thigh from the hip down past the knee (.thighFrom-.thighTo, .thighOut of the limb), a flared trouser hem over the shin's top, a puffy cream fur
 * roll round the calf (.cuffFrom-.cuffTo, .cuffOut, .cuffThick, .cuffLumps rounded clumps so it reads as fur), a brown boot shell over the shin below
 * it, and the foot mesh itself in the boot's leather with a dark sole slab standing proud all round, so the boot runs on over the toe.
 */
const BRAWLER_LEGS = {
  thighFrom: 0.06, thighTo: 0.98, thighOut: 1.3, hemFrom: 0.0, hemTo: 0.34, hemOut: 1.36,
  cuffFrom: 0.26, cuffTo: 0.5, cuffOut: 1.52, cuffThick: 0.36, cuffLumps: 7,
  bootFrom: 0.46, bootTo: 1.0, bootOut: 1.14, sole: 0.07, soleOut: 1.06, glow: 0.14,
};
/** The Brawler's puffy team trousers, cream fur calf cuffs and brown boots (spec at BRAWLER_LEGS). */
export function brawlerLegs(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const B = BRAWLER_LEGS;
  const mf = getMaterialFactory();
  const pants = mf.get("cloth", teamColor.scale(0.84), { emissiveIntensity: B.glow * 0.5 });
  const boot = mf.get("cloth", new Color3(0.36, 0.21, 0.12), { emissiveIntensity: B.glow * 0.5 });
  const soleMat = mf.get("cloth", new Color3(0.2, 0.12, 0.07), { emissiveIntensity: B.glow * 0.35 });
  // cream fur that has to read cream and not grey in the shade (LESSONS: a lit fur under the tunic reads grey): flat, out of the glow layer
  const furColor = new Color3(0.9, 0.7, 0.42);
  const fur = mf.get("unlit", furColor, { emissive: furColor });
  const out: Mesh[] = [];
  /** A puffy roll of fur round a limb at `at` of the way down it (a faceted torus plus `lumps` rounded clumps on its face). */
  const furRoll = (limb: Mesh, at: number, outOf: number, thick: number, lumps: number): void => {
    const L = limbBox(limb);
    const r = Math.max(L.wide, L.deep) * outOf;
    const y = L.mid + L.half - at * L.half * 2;
    const flat = L.deep / Math.max(L.wide, L.deep);
    const ring = MeshBuilder.CreateTorus("brawlerCuffRoll", { diameter: r * 2, thickness: r * 2 * thick, tessellation: 8 }, scene);
    ring.parent = limb.parent;
    ring.position.set(0, y, 0);
    ring.scaling.z = flat;
    ring.material = fur;
    ring.convertToFlatShadedMesh();
    out.push(ring);
    for (let i = 0; i < lumps; i++) {
      const a = (i / lumps) * Math.PI * 2 + (i % 2 ? 0.22 : 0);
      const lump = MeshBuilder.CreateIcoSphere("brawlerCuffFur", { radius: r * thick * 0.9, subdivisions: 1, flat: true }, scene);
      lump.parent = limb.parent;
      lump.position.set(Math.cos(a) * r * 0.98, y + (i % 2 ? r * thick * 0.34 : -r * thick * 0.2), Math.sin(a) * r * flat * 0.98);
      lump.material = fur;
      out.push(lump);
    }
  };
  for (const [thigh, shin] of [[body.leftUpperLeg, body.leftLowerLeg], [body.rightUpperLeg, body.rightLowerLeg]] as const) {
    out.push(limbShell(scene, "brawlerPants", thigh, B.thighFrom, B.thighTo, B.thighOut, pants));
    out.push(limbShell(scene, "brawlerPantsHem", shin, B.hemFrom, B.hemTo, B.hemOut, pants));
    out.push(limbShell(scene, "brawlerFurCuff", shin, B.cuffFrom, B.cuffTo, B.cuffOut, fur));
    furRoll(shin, B.cuffFrom, B.cuffOut, B.cuffThick, B.cuffLumps);
    out.push(limbShell(scene, "brawlerBoot", shin, B.bootFrom, B.bootTo, B.bootOut, boot));
  }
  for (const foot of body.root.getChildMeshes(false)) {
    if (!/_[lr]FootM$/.test(foot.name)) continue;
    foot.material = boot;
    const bb = foot.getBoundingInfo().boundingBox;
    const wide = (bb.maximum.x - bb.minimum.x) * B.soleOut;
    const deep = (bb.maximum.z - bb.minimum.z) * B.soleOut;
    const sole = MeshBuilder.CreateBox("brawlerSole", { width: wide, height: bb.extendSize.y * B.sole, depth: deep }, scene);
    sole.parent = foot.parent;
    sole.position.set(foot.position.x, bb.minimum.y + bb.extendSize.y * B.sole * 0.5, foot.position.z + bb.center.z);
    sole.material = soleMat;
    sole.convertToFlatShadedMesh();
    out.push(sole);
  }
  // the fur is unlit, so keep it out of the glow layer or its flat cream blooms to white (the brawler's cuffs washed out the knees)
  const glow = scene.getGlowLayerByName("glow");
  for (const m of out) if (m.material === fur) glow?.addExcludedMesh(m);
  return out;
}

/*
 * [S] the Berserker's fur belt (395; viking.berserker.red.png: a thick cream fur roll round the hips with a big navy round buckle carrying the red
 * Landfall mark; critic 394: a thin plain belt with a small square buckle). In the torso's frame:
 *   roll: a faceted torus round the hips .at of the chest's half height up, .out of the chest proud, its tube .thick of that, with .lumps rounded
 *   clumps standing round its front;
 *   buckle: a navy ten-sided disc .face across the chest's half width on the roll's front, .deep proud, and the mark a flat red three-sided plate
 *   .mark of that disc's width on its face.
 * Fur self-lit like the rest of the viking fur, the navy and the red a little brighter so they read under the belly's shade.
 */
const BERSERKER_BELT = { at: 0.0, out: 1.16, thick: 0.66, lumps: 9, face: 1.5, deep: 0.08, mark: 0.6, proud: 2.2, glow: 0.14 };
const BERSERKER_FUR = new Color3(0.9, 0.7, 0.42);
const BERSERKER_NAVY = new Color3(0.05, 0.07, 0.2);
const BERSERKER_RED = new Color3(0.62, 0.06, 0.06);
/** The Berserker's cream fur belt with its big navy Landfall buckle (spec at BERSERKER_BELT). */
export function berserkerBelt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = BERSERKER_BELT;
  const mf = getMaterialFactory();
  const fur = mf.get("cloth", BERSERKER_FUR, { emissiveIntensity: B.glow });
  const navy = mf.get("cloth", BERSERKER_NAVY, { emissiveIntensity: B.glow * 0.8 });
  const red = mf.get("cloth", BERSERKER_RED, { emissiveIntensity: B.glow * 1.1 });
  const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
  const round = Math.max(chest.x, chest.z);
  const flat = chest.z / Math.max(chest.x, chest.z);
  const out: Mesh[] = [];
  const y = chest.y * B.at;
  const ring = MeshBuilder.CreateTorus("berserkerBelt", { diameter: round * 2 * B.out, thickness: chest.y * B.thick, tessellation: 9 }, scene);
  ring.parent = body.torso;
  ring.position.y = y;
  ring.scaling.z = flat;
  ring.material = fur;
  ring.convertToFlatShadedMesh();
  out.push(ring);
  for (let i = 0; i < B.lumps; i++) {
    const a = (i / B.lumps) * Math.PI * 2 + (i % 2 ? 0.18 : 0);
    const lump = MeshBuilder.CreateIcoSphere("berserkerBeltFur", { radius: chest.y * B.thick * 0.48, subdivisions: 1, flat: true }, scene);
    lump.parent = body.torso;
    lump.position.set(Math.cos(a) * round * B.out, y + (i % 2 ? chest.y * B.thick * 0.22 : -chest.y * B.thick * 0.12), Math.sin(a) * round * B.out * flat);
    lump.material = fur;
    out.push(lump);
  }
  // the buckle: a navy disc standing proud of the fur roll, the red mark flat on its face
  const buckleZ = round * B.out * flat + chest.y * B.thick * 0.5;
  const buckle = MeshBuilder.CreateCylinder("berserkerBuckle", { height: round * B.deep, diameter: round * B.face, tessellation: 10 }, scene);
  buckle.rotation.x = Math.PI / 2;
  buckle.bakeCurrentTransformIntoVertices();
  buckle.position.set(0, y, buckleZ);
  buckle.parent = body.torso;
  buckle.material = navy;
  buckle.convertToFlatShadedMesh();
  out.push(buckle);
  const mark = MeshBuilder.CreateCylinder("berserkerBuckleMark", { height: round * B.deep * 0.6, diameter: round * B.face * B.mark, tessellation: 3 }, scene);
  mark.rotation.x = Math.PI / 2;
  mark.rotation.z = Math.PI / 2;
  mark.bakeCurrentTransformIntoVertices();
  mark.position.set(0, y, buckleZ + round * B.deep * 0.5);
  mark.parent = body.torso;
  mark.material = red;
  mark.convertToFlatShadedMesh();
  out.push(mark);
  return out;
}

/*
 * [S] 397 the Berserker's armpit hair (card "both of their armpits are hairy"; viking.berserker.red.png, .jpg: a bare chest with a dark tuft high in
 * each armpit). [S] 398 re-hung off the ARM: the critic read the 397 cut on the trunk's front face as stickers inboard of the arm, not hair in the
 * hollow, and _windup showed none in the crease. So each tuft hangs off the shoulder joint (it swings with the arm and stays in the crease when the
 * arm comes up), in the upper arm's own frame: .in of the way in to the arm's inner face from the shoulder's centre line, .drop below the arm's top,
 * on its front face (.front of its depth). .tufts tapered shards fan .spread apart about the vertical, each .len of the upper arm's height long,
 * .wide of its half width across at the root, leaning .lean in under the arm, in the beard's dark brown self-lit at .glow.
 */
const BERSERKER_ARMPITS = { in: 0.95, across: 0.16, drop: 0.02, arc: 0.12, front: 0.95, tufts: 6, len: 0.52, wide: 0.26, lean: 0.3, splay: 0.5, glow: 0.24 };
/** The Berserker's dark armpit tufts, hung off each shoulder joint (spec at BERSERKER_ARMPITS). */
export function berserkerArmpits(scene: Scene, body: ArticulatedBody): Mesh[] {
  const A = BERSERKER_ARMPITS;
  const hair = getMaterialFactory().get("cloth", new Color3(0.3, 0.12, 0.1), { emissiveIntensity: A.glow });
  const out: Mesh[] = [];
  const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
  for (const side of [-1, 1]) {
    const shoulder = side < 0 ? body.leftShoulder : body.rightShoulder;
    const arm = side < 0 ? body.leftUpperArm : body.rightUpperArm;
    const L = limbBox(arm);
    const tall = L.half * 2;
    for (let i = 0; i < A.tufts; i++) {
      const u = i / (A.tufts - 1) - 0.5; // -0.5 (by the arm) .. 0.5 (in toward the sternum)
      const long = tall * A.len * (1 - 0.34 * Math.abs(u) * 2);
      const pivot = new TransformNode("berserkerArmpitPivot", scene);
      pivot.parent = shoulder;
      pivot.position.set(
        -side * (L.wide * A.in + (u + 0.5) * chest.x * A.across),
        L.mid + L.half - tall * (A.drop + (1 - Math.abs(u) * 2) * A.arc),
        chest.z * (A.front - Math.abs(u) * 0.26),
      );
      pivot.rotation.z = -side * (A.lean - u * A.splay);
      pivot.rotation.x = -0.1 + u * 0.2;
      const shard = MeshBuilder.CreateCylinder("berserkerArmpitHair", { height: long, diameterTop: chest.x * A.wide, diameterBottom: 0, tessellation: 4 }, scene);
      shard.position.y = -long * 0.5;
      shard.parent = pivot;
      shard.material = hair;
      shard.convertToFlatShadedMesh();
      out.push(shard);
    }
  }
  return out;
}

/*
 * [S] the Headbutter's kit (395; viking.headbutter.red.png, viking.headbutter.png, card Appearance "thick furry boots"; critic 391: "a plain blue tunic,
 * bare hands and boots, no belt"). In the trunk's and the limbs' own frames:
 *   belt: a brown band round the hips .tall of the trunk's height at .at up, .proud of it, a dark buckle box on its front;
 *   bracers: a dark leather shell .out of the forearm's half-width from .from to .to down it, a puffy cream fur roll round its top;
 *   boots: a brown shell .out of the shin from .bootFrom down to the foot, the foot mesh itself in the boot's leather, a wide cream fur roll .cuffOut of
 *   it from .cuffFrom to .cuffTo round its top, and a dark sole under the boot.
 * Fur and leather self-lit so the cream reads cream and the brown stays warm in the shade.
 * [S] 401 the belt at the waist and fur on the bracers (critic 400: "bracers bare, belt a thin hidden band"): the band drops from the belly to the hips
 * (.beltAt -0.42) and stands wider, under the braids' ends instead of behind them, and each bracer's fur roll moves off the elbow (where the upper arm
 * buried it) down onto the bracer's own top, fatter and proud of the leather shell, so the cream cuff shows on the arm.
 */
const HEADBUTTER_KIT = {
  beltTall: 0.44, beltAt: -0.4, beltOut: 1.3, beltRim: 0.16, buckle: 0.5, buckleProud: 1.35, buckleGlow: 0.1,
  bracerFrom: 0.06, bracerTo: 0.78, bracerOut: 1.24, furFrom: 0.16, furTo: 0.24, furOut: 1.62, furThick: 0.26, furLumps: 6,
  bootFrom: 0.48, bootTo: 1.0, bootOut: 1.16, cuffFrom: 0.1, cuffTo: 0.46, cuffOut: 1.5, cuffThick: 0.28, cuffLumps: 7,
  sole: 0.06, soleOut: 1.06, glow: 0.14,
};
/**
 * The kit's warm cream fur. [S] 400 tried an UNLIT plate (0.78, 0.58, 0.34), emissive = colour, out of the glow; the critic (401 a.4) still read its
 * rolls pale grey-white against the reference's warm cream. [S] 402 HEADBUTTER_CREAM is its own LIT cut instead: the palette's left wall tan (0.8, 0.6,
 * 0.35) at full, which displays as the warm cream-tan of viking.headbutter.red.png's rolls, self-lit at .creamGlow of its colour so the shaded side of a
 * roll stays cream and not grey (LESSONS: lit cloth in shade goes grey without its own light). The old unlit value is in the ledger (HEADBUTTER_KIT).
 */
const HEADBUTTER_CREAM = { color: new Color3(0.8, 0.6, 0.35), creamGlow: 0.42 };
/**
 * [S] 402 the broad brown belt (critic 401 a.4: "a thin dark band at the hem rather than the reference's broad brown band"; viking.headbutter.red.png: a
 * wide mid-brown band round the waist with darker edges): the band .beltTall of the trunk tall in a lighter brown HEADBUTTER_BELT, with a darker rim
 * .beltRim of its height along its top and foot edges, the buckle on its front as before.
 */
const HEADBUTTER_BELT = { color: new Color3(0.5, 0.3, 0.15), rim: new Color3(0.26, 0.15, 0.08), glow: 0.2 };
/** The Headbutter's brown belt and buckle, dark fur-cuffed bracers, and cream fur boot cuffs over brown boots (spec at HEADBUTTER_KIT). */
export function headbutterKit(scene: Scene, body: ArticulatedBody, legs = false): Mesh[] {
  const K = HEADBUTTER_KIT;
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", new Color3(0.3, 0.17, 0.09), { emissiveIntensity: K.glow * 0.5 });
  const beltMat = mf.get("cloth", HEADBUTTER_BELT.color, { emissive: HEADBUTTER_BELT.color.scale(HEADBUTTER_BELT.glow) });
  const rimMat = mf.get("cloth", HEADBUTTER_BELT.rim, { emissive: HEADBUTTER_BELT.rim.scale(HEADBUTTER_BELT.glow) });
  const boot = mf.get("cloth", new Color3(0.36, 0.21, 0.12), { emissiveIntensity: K.glow * 0.5 });
  const soleMat = mf.get("cloth", new Color3(0.2, 0.12, 0.07), { emissiveIntensity: K.glow * 0.35 });
  // [S] 402 the fur is a lit warm cream, self-lit (spec at HEADBUTTER_CREAM)
  const fur = mf.get("cloth", HEADBUTTER_CREAM.color, { emissive: HEADBUTTER_CREAM.color.scale(HEADBUTTER_CREAM.creamGlow) });
  const buckleMat = mf.get("cloth", new Color3(0.62, 0.5, 0.26), { emissiveIntensity: K.glow * 0.6 });
  const out: Mesh[] = [];
  // the belt round the hips, a buckle on its front: a broad brown band with darker rims (spec at HEADBUTTER_BELT)
  const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
  const beltH = chest.y * 2 * K.beltTall;
  const beltD = Math.max(chest.x, chest.z) * 2 * K.beltOut;
  const band = MeshBuilder.CreateCylinder("headbutterBelt", { height: beltH, diameter: beltD, tessellation: 8 }, scene);
  band.position.y = chest.y * K.beltAt;
  band.scaling.z = body.torsoMesh.scaling.z * 0.98;
  band.parent = body.torso;
  band.material = beltMat;
  band.convertToFlatShadedMesh();
  out.push(band);
  for (const edge of [-1, 1]) {
    const rim = MeshBuilder.CreateCylinder("headbutterBeltRim", { height: beltH * K.beltRim, diameter: beltD * 1.03, tessellation: 8 }, scene);
    rim.position.y = chest.y * K.beltAt + edge * beltH * (0.5 - K.beltRim * 0.5);
    rim.scaling.z = band.scaling.z;
    rim.parent = body.torso;
    rim.material = rimMat;
    rim.convertToFlatShadedMesh();
    out.push(rim);
  }
  // [S] 400 the buckle stood in front of the braids (critic 396/399: the belt was hidden by the braids and the stoop, the buckle behind them): a broad
  // square plate .buckle of the chest's half width across, stood .buckleProud of the belt's own front, so it clears the braids' forward bow
  const buckle = MeshBuilder.CreateBox("headbutterBuckle", {
    width: chest.x * K.buckle, height: chest.y * 2 * K.beltTall * 1.05, depth: chest.z * 0.16,
  }, scene);
  buckle.position.set(0, chest.y * K.beltAt, Math.max(chest.x, chest.z) * K.beltOut * K.buckleProud);
  buckle.parent = body.torso;
  buckle.material = buckleMat;
  buckle.convertToFlatShadedMesh();
  out.push(buckle);
  /**
   * A puffy roll of fur round a limb at `at` of the way down it: a faceted torus round the limb, its tube .thick of the limb's radius, and `lumps`
   * rounded clumps standing round its front so the roll reads as fur and not as a smooth band. (The old cut was a fringe of cones, which read grey and
   * spiky - critic 395.)
   */
  const furRoll = (limb: Mesh, at: number, outOf: number, thick: number, lumps: number): void => {
    const L = limbBox(limb);
    const r = Math.max(L.wide, L.deep) * outOf;
    const y = L.mid + L.half - at * L.half * 2;
    const flat = L.deep / Math.max(L.wide, L.deep);
    const ring = MeshBuilder.CreateTorus("headbutterFurRoll", { diameter: r * 2, thickness: r * 2 * thick, tessellation: 8 }, scene);
    ring.parent = limb.parent;
    ring.position.set(0, y, 0);
    ring.scaling.z = flat;
    ring.material = fur;
    ring.convertToFlatShadedMesh();
    out.push(ring);
    for (let i = 0; i < lumps; i++) {
      const a = (i / lumps) * Math.PI * 2 + (i % 2 ? 0.22 : 0);
      const lump = MeshBuilder.CreateIcoSphere("headbutterFurLump", { radius: r * thick * 0.92, subdivisions: 1, flat: true }, scene);
      lump.parent = limb.parent;
      lump.position.set(Math.cos(a) * r * 0.99, y + (i % 2 ? r * thick * 0.36 : -r * thick * 0.2), Math.sin(a) * r * flat * 0.99);
      lump.material = fur;
      out.push(lump);
    }
  };
  // [S] 405 the legs leave this kit for the Brawler's cut (critic 403 a.2: "the fur cuffs stacked right under the shorts at knee level", legs about 40%
  // of the height; viking.headbutter.blue.png: puffy trousers running down to fur cuffs at mid-shin over the boot). unitFactory hangs brawlerLegs on
  // him, so the kit keeps the belt and bracers only; `legs: true` keeps the old knee cuffs for a caller that wants them.
  for (const [fore, shin] of [[body.leftLowerArm, body.leftLowerLeg], [body.rightLowerArm, body.rightLowerLeg]] as const) {
    out.push(limbShell(scene, "headbutterBracer", fore, K.bracerFrom, K.bracerTo, K.bracerOut, leather));
    furRoll(fore, K.furFrom, K.furOut, K.furThick, K.furLumps);
    if (!legs) continue;
    out.push(limbShell(scene, "headbutterBoot", shin, K.bootFrom, K.bootTo, K.bootOut, boot));
    out.push(limbShell(scene, "headbutterCuff", shin, K.cuffFrom, K.cuffTo, K.cuffOut, fur));
    furRoll(shin, K.cuffFrom, K.cuffOut, K.cuffThick, K.cuffLumps);
  }
  // [S] the boots over the feet (395 a.4: the boot stopped at the ankle and the feet stayed team blue): the foot mesh itself in the boot's leather,
  // with a dark sole slab under it standing a hair proud all round, so the boot runs on over the toe (viking.headbutter.red.png: brown boots to the toes).
  for (const foot of legs ? body.root.getChildMeshes(false) : []) {
    if (!/_[lr]FootM$/.test(foot.name)) continue;
    foot.material = boot;
    const bb = foot.getBoundingInfo().boundingBox;
    const wide = (bb.maximum.x - bb.minimum.x) * K.soleOut;
    const deep = (bb.maximum.z - bb.minimum.z) * K.soleOut;
    const sole = MeshBuilder.CreateBox("headbutterSole", { width: wide, height: bb.extendSize.y * K.sole, depth: deep }, scene);
    sole.parent = foot.parent;
    sole.position.set(foot.position.x, bb.minimum.y + bb.extendSize.y * K.sole * 0.5, foot.position.z + bb.center.z);
    sole.material = soleMat;
    sole.convertToFlatShadedMesh();
    out.push(sole);
  }
  // the fur sits out of the glow layer, so the bloom does not veil its cream (LESSONS 10)
  const glow = scene.getGlowLayerByName("glow");
  for (const m of out) if (m.material === fur) glow?.addExcludedMesh(m);
  return out;
}

/*
 * [R] 400 the Jarl's bear pelt, rebuilt head to hips (viking.jarl.red.png, viking.jarl.jpg, card "the most notable piece of clothing on the Jarl is their
 * bear pelt ... the pelt itself has googly eyes, brown fur, teeth, and claws"). The 393 cut's flat crate skull and its side panels, whose depth ran past
 * the face plane, hid the bear's eyes from the three-quarter view and left the snout a pale block off to one side (critic 394), so the head is rebuilt
 * from the reference, and the horned helm stays off:
 *   skull: a rounded fur mass over his crown - a faceted ellipsoid .skullW of the head across, .skullH of it tall and .skullD deep, its middle .skullY up
 *     and .skullZ back, so the bear's face stands over his forehead and its mass overhangs the back of his head;
 *   eyes: two big pale googly balls .eye of the head across on the skull's FRONT, .eyeOut either side of its middle and .eyeY up, each with a black
 *     pupil on its face; they stand .eyeProud ahead of the fur, and nothing else is allowed in front of that plane;
 *   muzzle: a short fur wedge out of the skull's front below the eyes, .muzzle of the head across, .muzzleLong deep, tipped down .muzzleDrop, a dark nose
 *     box on its tip and .teeth white teeth under it;
 *   ears: a dark fur ball .ear across at each top corner of the skull;
 *   curtains: a fur panel down each side of his own face, hung OUT at .curtainOut of the head's half width (>= 1.0, outside his cheeks) and BEHIND the
 *     face plane (.curtainZ <= 0, no part of it in front of the eyes), from .curtainTop down to .curtainFoot, .curtainW wide and .curtainD deep, ending
 *     in .tufts jagged points; this is the fur that drapes to his hips over the shoulder panels below;
 * [S] 401 the curtains run on to the hips (critic 400 a.5: "fur curtains from the hood down to the hips ... the shoulder fur is boxy pads that stop at the
 * chest"): .curtainFoot -3.3 head half-heights down (the belt's line) and .curtainW .42 of the head's half width, .curtainZ +0.12 so they hang over the
 * chest front, and the torso's shoulder fur is a rounded faceted mass (JARL_PELT.mantle*) rather than two flat pads; the side panels drop behind the arms.
 * and, hung from the torso: the mantle over both shoulders, a drape panel off each shoulder to the hips (.drapeDrop of the trunk) and a back panel over
 * the spine, each ending in jagged fur tufts. Fur self-lit .glow so the hood does not read grey under its own overhang.
 */
const JARL_PELT = {
  skullW: 1.3, skullH: 0.95, skullD: 1.3, skullY: 0.58, skullZ: -0.1,
  eye: 0.24, eyeOut: 0.48, eyeY: 0.6, eyeProud: 1.2, pupil: 0.45,
  muzzle: 0.44, muzzleTall: 0.32, muzzleLong: 0.34, muzzleY: 0.12, muzzleZ: 1.24, muzzleDrop: 0.34,
  nose: 0.26, noseTall: 0.13, noseZ: 1.24, teeth: 3, tooth: 0.1, toothY: -0.2, toothZ: 1.16,
  ear: 0.2, earOut: 0.85, earY: 1.3, earZ: -0.2,
  curtainW: 0.42, curtainD: 0.8, curtainOut: 1.12, curtainZ: -0.06, curtainTop: 0.52, curtainFoot: -1.1,
  drape: 0.18, drapeOut: 0.58, drapeDrop: 0.88, drapeDeep: 0.6, back: 0.85, backDeep: 0.14, tufts: 4, tuft: 0.2, glow: 0.2,
  mantleDeep: 0.68,
  chestW: 0.2, chestOut: 0.23, chestDeep: 0.12, chestProud: 0.54, chestDrop: 0.98, chestTufts: 3,
};
const JARL_FUR = new Color3(0.42, 0.21, 0.14);
const JARL_FUR_DARK = new Color3(0.29, 0.14, 0.09);

/** The Jarl's bear-head hood and the pelt draping to his hips (spec at JARL_PELT). */
export function jarlPelt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = JARL_PELT;
  const mf = getMaterialFactory();
  const fur = mf.get("cloth", JARL_FUR, { emissiveIntensity: P.glow });
  const darkFur = mf.get("cloth", JARL_FUR_DARK, { emissiveIntensity: P.glow * 0.8 });
  const muzzleMat = mf.get("cloth", new Color3(0.62, 0.46, 0.34), { emissiveIntensity: P.glow });
  const bone = mf.get("cloth", new Color3(0.9, 0.88, 0.8), { emissiveIntensity: 0.16 });
  const pupilMat = mf.get("cloth", new Color3(0.05, 0.05, 0.06), { emissiveIntensity: 0.05 });
  const added: Mesh[] = [];
  const e = headExtents(body);
  const put = (m: Mesh, material: typeof fur, parent: Node, flat = true): Mesh => {
    m.material = material;
    if (flat) m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  // the skull: a rounded fur mass over his crown, its face over his forehead
  const skull = put(MeshBuilder.CreateIcoSphere("jarlBearSkull", { radius: 1, subdivisions: 1, flat: true }, scene), fur, body.headMesh);
  skull.scaling.set(e.x * P.skullW, e.y * P.skullH, e.z * P.skullD);
  skull.position.set(0, e.y * P.skullY, e.z * P.skullZ);
  // the muzzle: a short centred wedge out of the skull's front below the eyes, nose on its tip, teeth under it
  const muzzle = put(MeshBuilder.CreateBox("jarlBearMuzzle", {
    width: e.x * P.muzzle, height: e.y * P.muzzleTall, depth: e.z * P.muzzleLong,
  }, scene), muzzleMat, body.headMesh);
  muzzle.position.set(0, e.y * P.muzzleY, e.z * P.muzzleZ);
  muzzle.rotation.x = P.muzzleDrop;
  const nose = put(MeshBuilder.CreateBox("jarlBearNose", {
    width: e.x * P.nose, height: e.y * P.noseTall, depth: e.z * 0.1,
  }, scene), pupilMat, body.headMesh);
  nose.position.set(0, e.y * (P.muzzleY - P.muzzleTall * 0.55), e.z * P.noseZ);
  for (let i = 0; i < P.teeth; i++) {
    const tooth = put(MeshBuilder.CreateCylinder("jarlBearTooth", {
      height: e.y * P.tooth, diameterTop: 0, diameterBottom: e.x * 0.05, tessellation: 4,
    }, scene), bone, body.headMesh);
    tooth.position.set((i - (P.teeth - 1) / 2) * e.x * 0.09, e.y * P.toothY, e.z * P.toothZ);
    tooth.rotation.z = Math.PI;
  }
  for (const side of [-1, 1]) {
    // the googly eyes on the skull's front, proud of the fur so nothing can stand in front of them
    const eye = put(MeshBuilder.CreateIcoSphere("jarlBearEye", { radius: e.x * P.eye, subdivisions: 2 }, scene), bone, body.headMesh, false);
    eye.position.set(side * e.x * P.eyeOut, e.y * P.eyeY, e.z * P.eyeProud);
    const pupil = put(MeshBuilder.CreateIcoSphere("jarlBearPupil", { radius: e.x * P.eye * P.pupil, subdivisions: 1 }, scene), pupilMat, body.headMesh, false);
    pupil.position.set(side * e.x * P.eyeOut, e.y * P.eyeY, e.z * P.eyeProud + e.x * P.eye * 0.8);
    const ear = put(MeshBuilder.CreateIcoSphere("jarlBearEar", { radius: e.x * P.ear, subdivisions: 1, flat: true }, scene), darkFur, body.headMesh);
    ear.position.set(side * e.x * P.earOut, e.y * P.earY, e.z * P.earZ);
    // the curtain down the side of his own face: out past his cheek, behind the eyes' plane
    const tall = e.y * (P.curtainTop - P.curtainFoot);
    const curtain = put(MeshBuilder.CreateBox("jarlBearCurtain", {
      width: e.x * P.curtainW, height: tall, depth: e.z * P.curtainD,
    }, scene), fur, body.headMesh);
    curtain.position.set(side * e.x * P.curtainOut, e.y * (P.curtainTop + P.curtainFoot) * 0.5, e.z * P.curtainZ);
    curtain.rotation.z = side * 0.04;
    for (let k = 0; k < P.tufts; k++) {
      const tuft = put(MeshBuilder.CreateCylinder("jarlBearTuft", {
        height: e.y * P.tuft * 2, diameterTop: e.x * P.curtainW * 0.5, diameterBottom: 0, tessellation: 4,
      }, scene), darkFur, body.headMesh);
      tuft.position.set(
        side * e.x * P.curtainOut + (k - (P.tufts - 1) / 2) * e.x * P.curtainW * 0.55,
        e.y * P.curtainFoot - e.y * P.tuft * 0.6,
        e.z * P.curtainZ,
      );
      tuft.rotation.z = Math.PI;
    }
  }
  // the drape: a rounded mantle over both shoulders, a panel off each shoulder down the back to the hips, and one over the spine, ending in fur tufts
  // [S] 401 the shoulder fur is a rounded fur mass, not two boxy pads (critic 400 a.5), and the side panels hang behind the arms as the pelt's back edge
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const top = chest.position.y + H * 0.5;
  const shoulderW = body.metrics.shoulderWidth ?? W * 1.3;
  const drapeH = H * P.drapeDrop;
  // [S] 406 no mantle over the chest (re-audit 403 a.2: "a flat brown mantle box over the chest"; viking.jarl.red.png: a bare chest between the two
  // curtains): the rounded jarlPeltMantle is gone; the curtains and the side panels carry the pelt (jarlBelt for the waist)
  // [S] 401b the fur curtains down the chest front (the hood's own curtains hang at the head's z, so run on down the torso): a strip either side of the
  // chest from under the mantle to the belt, stood proud of the chest's front face, ending in jagged tufts
  const chestH = H * P.chestDrop;
  for (const side of [-1, 1]) {
    const strip = put(MeshBuilder.CreateBox("jarlPeltChest", {
      width: W * P.chestW, height: chestH, depth: D * P.chestDeep,
    }, scene), fur, body.torso);
    strip.position.set(side * W * P.chestOut, top - H * 0.1 - chestH * 0.5, chest.position.z + D * P.chestProud);
    for (let k = 0; k < P.chestTufts; k++) {
      const tuft = put(MeshBuilder.CreateCylinder("jarlPeltChestTuft", {
        height: H * P.tuft, diameterTop: W * P.chestW * 0.6, diameterBottom: 0, tessellation: 4,
      }, scene), darkFur, body.torso);
      tuft.position.set(
        side * W * P.chestOut + (k - (P.chestTufts - 1) / 2) * W * P.chestW * 0.5,
        top - H * 0.1 - chestH - H * P.tuft * 0.4,
        chest.position.z + D * P.chestProud,
      );
      tuft.rotation.z = Math.PI;
    }
  }
  for (const side of [-1, 1]) {
    const panel = put(MeshBuilder.CreateBox("jarlPeltSide", {
      width: shoulderW * P.drape, height: drapeH, depth: D * P.drapeDeep,
    }, scene), fur, body.torso);
    panel.position.set(side * shoulderW * P.drapeOut, top - drapeH * 0.5 - H * 0.02, chest.position.z - D * 0.22);
    for (let k = 0; k < P.tufts; k++) {
      const tuft = put(MeshBuilder.CreateCylinder("jarlPeltTuft", {
        height: H * P.tuft, diameterTop: shoulderW * P.drape * 0.6, diameterBottom: 0, tessellation: 4,
      }, scene), darkFur, body.torso);
      tuft.position.set(
        side * shoulderW * P.drapeOut + (k - (P.tufts - 1) / 2) * shoulderW * P.drape * 0.4,
        top - drapeH - H * 0.02 - H * P.tuft * 0.4,
        chest.position.z - D * 0.22,
      );
      tuft.rotation.z = Math.PI;
    }
  }
  const back = put(MeshBuilder.CreateBox("jarlPeltBack", {
    width: W * P.back, height: drapeH * 0.9, depth: D * P.backDeep,
  }, scene), fur, body.torso);
  back.position.set(0, top - drapeH * 0.47 - H * 0.12, chest.position.z - D * 0.48);
  return added;
}

/*
 * [S] the Brawler's full-face Norse helm (394; viking.brawler.red.png, card Appearance, critic 391: a blue dome with two grey horns and a thin nose strip).
 * The horns, nasal strip and beard cone of the shared viking_helmet are the Headbutter's old hat, not his: his helm covers the whole head but the eyes.
 * In the head's own size (W across, H high; the bead eyes sit on the face's plane .12 H above its middle and are .3 W across):
 *   dome: a team shell over the crown, .domeWide W across and .domeTall H deep (a sphere sliced .domeSlice), its middle .domeRise H up so its rim comes
 *   down onto the brow; a darker team brow band .band H tall round it .bandProud proud, its foot on the eye line (.eyeTop H up);
 *   mask: a team plate over the lower face from just under the eyes (.maskTop H) to the cheek line (.maskBottom H), .maskWide W wide and .maskDepth D
 *   deep, stood a hair proud of the face; a cheek guard down each side of it (.cheek W wide, from .cheekTop H down past the mask to .cheekBottom H) so
 *   the jaw is boxed in - 398: the mask ends at the cheek line and the beard fills the open mouth and chin under it; the guards run on to the chin;
 *   nasal: a dark strip from the brow band down between the eyes to the mask's top, .nasal W wide, stood .nasalProud D proud, so the eye slots read as two
 *   holes either side of it. Team cloth self-lit .glow (LESSONS: metal reads near black under swiftshader).
 */
const BRAWLER_HELM = {
  domeWide: 1.14, domeTall: 0.7, domeRise: 0.5, domeSlice: 0.6,
  band: 0.14, bandProud: 1.08, eyeTop: 0.42,
  maskTop: -0.18, maskBottom: -0.52, maskWide: 1.03, maskDepth: 1.04, maskProud: 0.06,
  cheek: 0.16, cheekTop: 0.3, cheekDeep: 0.92, cheekOut: 1.0, cheekBottom: -1.02,
  nasal: 0.24, nasalLow: -0.2, nasalProud: 0.11,
  glow: 0.1, darkGlow: 0.06,
};

/** The Brawler's full-face Norse helm: dome, brow band, lower-face mask with cheek guards, and a nasal between the eye holes (spec at BRAWLER_HELM). */
export function brawlerHelm(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const B = BRAWLER_HELM;
  const mf = getMaterialFactory();
  const e = headExtents(body);
  const helm = mf.get("cloth", teamColor.scale(0.8), { emissiveIntensity: B.glow });
  const dark = mf.get("cloth", teamColor.scale(0.45), { emissiveIntensity: B.darkGlow });
  const leather = mf.get("cloth", new Color3(0.18, 0.12, 0.1), { emissiveIntensity: B.darkGlow });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: typeof helm): Mesh => {
    m.material = material;
    m.convertToFlatShadedMesh();
    m.parent = body.headMesh;
    out.push(m);
    return m;
  };
  // the dome over the crown, its rim coming down onto the brow band
  const dome = put(MeshBuilder.CreateSphere("brawlerHelmDome", {
    diameterX: 2 * e.x * B.domeWide, diameterY: 2 * e.y * B.domeTall, diameterZ: 2 * e.z * B.domeWide, segments: 10, slice: B.domeSlice,
  }, scene), helm);
  dome.position.y = e.y * B.domeRise;
  // the brow band, its foot on the eye line
  const band = put(MeshBuilder.CreateBox("brawlerHelmBand", {
    width: 2 * e.x * B.bandProud, height: e.y * B.band, depth: 2 * e.z * B.bandProud,
  }, scene), dark);
  band.position.y = e.y * B.eyeTop + e.y * B.band * 0.5;
  // the lower-face mask, stood proud of the face
  const maskH = (B.maskTop - B.maskBottom) * e.y;
  const mask = put(MeshBuilder.CreateBox("brawlerHelmMask", {
    width: 2 * e.x * B.maskWide, height: maskH, depth: 2 * e.z * B.maskDepth,
  }, scene), helm);
  mask.position.set(0, e.y * (B.maskTop + B.maskBottom) * 0.5, e.z * B.maskProud);
  // a cheek guard down each side of the mask, boxing the jaw in
  for (const side of [-1, 1]) {
    const cheek = put(MeshBuilder.CreateBox("brawlerHelmCheek", {
      width: e.x * B.cheek, height: (B.cheekTop - B.cheekBottom) * e.y, depth: 2 * e.z * B.cheekDeep,
    }, scene), dark);
    cheek.position.set(side * e.x * (B.maskWide + B.cheek * 0.35), e.y * (B.cheekTop + B.cheekBottom) * 0.5, 0);
  }
  // the nasal: from the brow band down between the eyes onto the mask
  const nasal = put(MeshBuilder.CreateBox("brawlerHelmNasal", {
    width: 2 * e.x * B.nasal * 0.5, height: (B.eyeTop - B.nasalLow) * e.y, depth: e.z * B.nasalProud,
  }, scene), leather);
  nasal.position.set(0, e.y * (B.eyeTop + B.nasalLow) * 0.5, e.z * 0.98);
  return out;
}

/*
 * [S] the Valkyrie's own winged helm (400; viking.valkyrie.png, viking.valkyrie.red.png: a dark team dome over the crown, a bronze brow band across it
 * with a gold frame over the face, cream feathers sprouting from the frame at each side, and a tall pointed crest in the team's dark red on the crown;
 * critic 398: "flat pale fins on a grey-blue dome, no crest or brow band" - the shared plume_helmet's grey shell and pale plume). In the head's half
 * extents (W across, H high, D deep):
 *   dome: a team shell .domeWide W across and .domeTall H deep (a sphere sliced .domeSlice), its middle .domeRise H up so its rim comes down onto the brow;
 *   band: a bronze brow band .band H tall round the head .bandProud proud, its foot on the eye line (.eyeTop H up), the metal frame the feathers sit on;
 *   crest: a four-sided team-dark spike .crestTall H tall off the crown, its base .crestWide W across, the helm's point;
 *   mounts: a bronze plate .mountWide W wide and .mountTall H tall at each temple, tilted .mountCant up and back, where the wings leave the helm.
 * Cloth, not "metal": metal reads near black under swiftshader (LESSONS); the bronze is self-lit a little.
 */
const VALKYRIE_HELM = {
  domeWide: 1.16, domeTall: 0.72, domeRise: 0.46, domeSlice: 0.55,
  band: 0.14, bandProud: 1.07, eyeTop: 0.56,
  crestTall: 0.95, crestWide: 0.2, crestRise: 1.12, crestFlat: 0.55,
  mountWide: 0.16, mountTall: 0.6, mountOut: 1.04, mountUp: 0.36, mountBack: 0.12, mountCant: 0.3,
  feathers: 5, featherLen: 2.1, featherWide: 0.3, featherFlat: 0.34, featherSpread: 0.24, featherFan: 0.78,
  featherBack: 0.08, featherSweep: 0.42, featherUp: 0.5,
  glow: 0.1, crestGlow: 0.12, bronzeGlow: 0.24,
};
const VALKYRIE_BRONZE = new Color3(0.72, 0.52, 0.2);
/** The helm's cream feathers (viking.valkyrie.red.png): unlit with emissive = colour so they hold cream in the dome's shade (LESSONS). */
const VALKYRIE_FEATHER = new Color3(0.86, 0.74, 0.5);

/** The Valkyrie's winged helm: dark team dome, bronze brow band and wing mounts, cream feather wings, and a tall pointed team-dark crest (spec at VALKYRIE_HELM). */
export function valkyrieHelm(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const V = VALKYRIE_HELM;
  const mf = getMaterialFactory();
  const e = headExtents(body);
  const helm = mf.get("cloth", teamColor.scale(0.72), { emissiveIntensity: V.glow });
  const crest = mf.get("cloth", teamColor.scale(0.5), { emissiveIntensity: V.crestGlow });
  const bronze = mf.get("cloth", VALKYRIE_BRONZE, { emissiveIntensity: V.bronzeGlow });
  const feather = mf.get("unlit", VALKYRIE_FEATHER, { emissive: VALKYRIE_FEATHER });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: typeof helm): Mesh => {
    m.material = material;
    m.convertToFlatShadedMesh();
    m.parent = body.headMesh;
    out.push(m);
    return m;
  };
  const dome = put(MeshBuilder.CreateSphere("valkyrieHelmDome", {
    diameterX: 2 * e.x * V.domeWide, diameterY: 2 * e.y * V.domeTall, diameterZ: 2 * e.z * V.domeWide, segments: 10, slice: V.domeSlice,
  }, scene), helm);
  dome.position.y = e.y * V.domeRise;
  const band = put(MeshBuilder.CreateBox("valkyrieHelmBand", {
    width: 2 * e.x * V.bandProud, height: e.y * V.band, depth: 2 * e.z * V.bandProud,
  }, scene), bronze);
  band.position.y = e.y * V.eyeTop + e.y * V.band * 0.5;
  // [S] 401 the crest a tall flat fin off the crown (critic 400: "a nub"): a four-sided blade, .crestFlat through it, leaning back a hair
  const spike = put(MeshBuilder.CreateCylinder("valkyrieHelmCrest", {
    height: e.y * V.crestTall, diameterTop: 0, diameterBottom: 2 * e.x * V.crestWide, tessellation: 4,
  }, scene), crest);
  spike.scaling.z = V.crestFlat;
  spike.rotation.x = -0.12;
  spike.position.y = e.y * V.crestRise + e.y * V.crestTall * 0.5;
  for (const side of [-1, 1]) {
    const mount = put(MeshBuilder.CreateBox("valkyrieHelmMount", {
      width: e.x * V.mountWide, height: e.y * V.mountTall, depth: e.z * 0.9,
    }, scene), bronze);
    mount.position.set(side * e.x * V.mountOut, e.y * V.mountUp, -e.z * V.mountBack);
    mount.rotation.z = side * V.mountCant;
    /*
     * [S] 401 the cream feather wings (critic 400: "no cream feathers"; viking.valkyrie.red.png: a fan of five broad cream feathers per side, springing
     * from the bronze mount at the temple and sweeping up and back over the dome). Each feather is a flat four-sided blade .featherLen H long, .featherWide
     * W across at its root and .featherFlat through it, fanned .featherFan rad apart from the mount and swept .featherSweep back, so the five overlap into
     * one wing. Their roots sit at the mount's top, .featherUp H above the eye line.
     */
    for (let i = 0; i < V.feathers; i++) {
      const t = V.feathers > 1 ? i / (V.feathers - 1) : 0;
      const len = e.y * V.featherLen * (1 - 0.3 * t);
      const fan = V.featherSpread + V.featherFan * t;
      const back = V.featherBack + V.featherSweep * t;
      const dir = new Vector3(side * Math.sin(fan) * Math.cos(back), Math.cos(fan) * Math.cos(back), -Math.sin(back)).normalize();
      const blade = put(MeshBuilder.CreateCylinder("valkyrieHelmFeather", {
        height: len, diameterTop: 0, diameterBottom: 2 * e.x * V.featherWide * (1 - 0.18 * t), tessellation: 4,
      }, scene), feather);
      blade.scaling.z = V.featherFlat;
      blade.rotation.z = -side * fan;
      blade.rotation.x = -back;
      blade.position.set(
        side * e.x * V.mountOut + dir.x * len * 0.5,
        e.y * V.mountUp + e.y * V.featherUp + dir.y * len * 0.5,
        -e.z * V.mountBack + dir.z * len * 0.5,
      );
      scene.getGlowLayerByName("glow")?.addExcludedMesh(blade);
    }
  }
  return out;
}
