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
const ICE_ARCHER_SNOWCAP = { lumps: 4, out: 0.4, big: 0.2, small: [0.7, 0.6, 0.55], spread: 0.09, sit: 0.05, squash: 0.75 };
/** The Ice Archer's pale jagged snow mantle over both shoulders (spec at ICE_ARCHER_MANTLE). */
export function iceArcherMantle(scene: Scene, body: ArticulatedBody): Mesh[] {
  const mf = getMaterialFactory();
  const snow = mf.get("unlit", ICE_ARCHER_SNOW, { emissive: ICE_ARCHER_SNOW });
  const glow = scene.getGlowLayerByName("glow");
  const out: Mesh[] = [];
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const shoulderW = body.metrics.shoulderWidth ?? W * 1.3;
  const put = (m: Mesh): Mesh => {
    m.material = snow;
    m.convertToFlatShadedMesh();
    m.parent = body.torso;
    glow?.addExcludedMesh(m);
    out.push(m);
    return m;
  };
  // [S] 408 no ruff (CONFIRM 405 a.1: "white fur ruff ring with icicle teeth hanging down the chest"; viking.ice_archer.red.png, .blue.png: no collar,
  // small grey snow lumps on each shoulder top over the team coat): the ring, its points and its lumps are gone; ICE_ARCHER_SNOWCAP puts a cluster of
  // .lumps rounded clumps on each shoulder top, .out of the shoulder span from the middle, the biggest .big of the trunk width across, the others
  // smaller and scattered .spread of it round it, sat .sit of the trunk height over the shoulder line.
  const C = ICE_ARCHER_SNOWCAP;
  const top = chest.position.y + H * 0.5;
  for (const side of [-1, 1]) {
    for (let i = 0; i < C.lumps; i++) {
      const k = i === 0 ? 1 : C.small[(i - 1) % C.small.length];
      const lump = put(MeshBuilder.CreateIcoSphere("iceArcherSnowLump", { radius: W * C.big * 0.5 * k, subdivisions: 1, flat: true }, scene));
      const a = i * 2.4 + (side > 0 ? 0.6 : 0);
      const off = i === 0 ? 0 : W * C.spread;
      lump.position.set(side * shoulderW * C.out + Math.cos(a) * off, top + H * C.sit * k, chest.position.z + Math.sin(a) * off);
      lump.scaling.y = C.squash;
    }
  }
  return out;
}

/*
 * [S] 409 the Ice Archer's team coat (CONFIRM 405 a.2: "dull brown-mauve vest over the torso in lineup_viking - TABS: the whole coat team red down to
 * mid-thigh, belted"; viking.ice_archer.red.png: a long-sleeved team coat over the whole trunk and arms, a brown belt at the waist, its skirt to
 * mid-thigh). The viking_fur preset tints the trunk toward tan, which read as a vest (the Headbutter's 408 fault); her coat is its own team cloth:
 *   body: a shell round the trunk box, .out of its half width and .deep of its half depth, from the neck to the trunk's foot;
 *   sleeves: the whole upper arm and the forearm to .cuffTo of its length, .sleeveOut of the limb's radius;
 *   belt: a dark leather band .belt of the trunk tall at .beltAt of it over the foot, .beltOut of the shell;
 *   skirt: the tunic skirt in the same cloth, .skirt of the hip-to-knee drop and .flare at its hem (unitFactory, iceArcherCoatCloth).
 */
export const ICE_ARCHER_COAT = { out: 1.06, deep: 1.1, sleeveOut: 1.15, cuffTo: 0.88, belt: 0.11, beltAt: 0.08, beltOut: 1.08, skirt: 0.8, flare: 1.4, glow: 0.12, leather: new Color3(0.26, 0.12, 0.06) };
/** The Ice Archer's team coat cloth (spec at ICE_ARCHER_COAT), shared by the shell, the sleeves and the coat skirt. */
export function iceArcherCoatCloth(teamColor: Color3) {
  return getMaterialFactory().get("cloth", teamColor, { emissive: teamColor.scale(ICE_ARCHER_COAT.glow) });
}
/** The Ice Archer's long-sleeved belted team coat over the trunk (spec at ICE_ARCHER_COAT). */
export function iceArcherCoat(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const C = ICE_ARCHER_COAT;
  const cloth = iceArcherCoatCloth(teamColor);
  const leather = getMaterialFactory().get("cloth", C.leather, { emissive: C.leather.scale(0.2) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const shell = MeshBuilder.CreateBox("iceArcherCoat", { width: W * C.out, height: H, depth: D * C.deep }, scene);
  shell.position.set(cx, cy, cz);
  shell.rotation.copyFrom(tm.rotation);
  shell.parent = tm.parent;
  shell.material = cloth;
  const out: Mesh[] = [shell];
  const belt = MeshBuilder.CreateBox("iceArcherCoatBelt", { width: W * C.out * C.beltOut, height: H * C.belt, depth: D * C.deep * C.beltOut }, scene);
  belt.position.set(cx, cy - H / 2 + H * C.beltAt, cz);
  belt.rotation.copyFrom(tm.rotation);
  belt.parent = tm.parent;
  belt.material = leather;
  out.push(belt);
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "iceArcherSleeve", arm, 0, 1, C.sleeveOut, cloth));
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) out.push(limbShell(scene, "iceArcherSleeve", arm, 0, C.cuffTo, C.sleeveOut, cloth));
  return out;
}

/*
 * [S] 410 the Ice Archer's hip quiver (CONFIRM 405 a.3: "small black tube quiver on the back - TABS: a large brown leather quiver slab hanging at the
 * hip"; viking.ice_archer.red.png, .blue.png: a broad flat brown leather case hanging from the belt down her off side to the knee, a darker rim at its
 * mouth, two pale ice arrow tips standing out of it). On the hip joint, on the off side (away from the bow hand): a slab .wide x .long x .deep of the
 * trunk's width, its top .top of the trunk height over the hip, .side of the half width out, .back behind, leant .tilt out at its foot; a rim .rim
 * tall round its mouth; .tips ice cones standing .tipProud out of the mouth. Replaces the generic quiver_back (unitVisuals).
 */
const ICE_ARCHER_QUIVER = {
  wide: 0.36, long: 1.15, deep: 0.16, top: 0.32, side: 1.12, back: 0.05, tilt: 0.12, rim: 0.07, tips: 2, tipProud: 0.16,
  leather: new Color3(0.32, 0.17, 0.09), dark: new Color3(0.17, 0.09, 0.05), ice: new Color3(0.62, 0.84, 1.0), glow: 0.2,
};
/** The Ice Archer's broad brown leather quiver slab at her off hip (spec at ICE_ARCHER_QUIVER). */
export function iceArcherQuiver(scene: Scene, body: ArticulatedBody): Mesh[] {
  const Q = ICE_ARCHER_QUIVER;
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", Q.leather, { emissive: Q.leather.scale(Q.glow) });
  const dark = mf.get("cloth", Q.dark, { emissive: Q.dark.scale(Q.glow) });
  const ice = mf.get("cloth", Q.ice, { emissive: Q.ice.scale(0.35) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y;
  const side = -(Math.sign(body.rightShoulder.position.x) || 1);
  const holder = new TransformNode("iceArcherQuiverHolder", scene);
  holder.parent = body.hip;
  holder.position.set(side * W * 0.5 * Q.side, H * Q.top, -W * Q.back);
  holder.rotation.z = -side * Q.tilt;
  const out: Mesh[] = [];
  const put = (m: Mesh, mat: typeof leather): Mesh => { m.parent = holder; m.material = mat; m.convertToFlatShadedMesh(); out.push(m); return m; };
  const L = H * Q.long, w = W * Q.wide, d = W * Q.deep;
  const slab = put(MeshBuilder.CreateBox("iceArcherQuiver", { width: d, height: L, depth: w }, scene), leather);
  slab.position.y = -L / 2;
  const rim = put(MeshBuilder.CreateBox("iceArcherQuiverRim", { width: d * 1.2, height: H * Q.rim, depth: w * 1.08 }, scene), dark);
  rim.position.y = -H * Q.rim * 0.5;
  for (let k = 0; k < Q.tips; k++) {
    const tip = put(MeshBuilder.CreateCylinder("iceArcherQuiverTip", { height: H * Q.tipProud, diameterTop: 0, diameterBottom: d * 0.8, tessellation: 4 }, scene), ice);
    tip.position.set(0, H * Q.tipProud * 0.5, (k - (Q.tips - 1) / 2) * w * 0.4);
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
/*
 * [S] 409 copper braids (CONFIRM 407 a.2: "pale tan/beige rope segments - TABS: copper/ginger-brown braids"; viking.headbutter.red.png: copper plaits,
 * their lobes alternating a lighter and a darker copper, a dark brown tie and below it a loose tail flaring wider than the plait). HEADBUTTER_HAIR is a
 * copper code value read off palette.png (the old (.6,.38,.2) displayed beige); every other lobe .shade of it; the tie dark brown; the tuft under the
 * tie opens from .tailTop to .tailFoot of the plait's thickness over .tail head heights (BraidStyle.tail; the Valkyrie's cream plaits keep the cone).
 */
const HEADBUTTER_HAIR = new Color3(0.6, 0.27, 0.12);
const HEADBUTTER_TIE = new Color3(0.2, 0.1, 0.06);
const HEADBUTTER_COPPER = { glow: 0.14, shade: 0.72, tail: 0.3, tailTop: 0.75, tailFoot: 1.25 };

/**
 * A plait's own look (402: the Valkyrie wears the Headbutter's plaits in cream): hair and tie colours, the hair's self-light, or `unlit` for a pale plait
 * that must hold its cream in the chest's shade (emissive = colour, out of the glow), and its own thickness, drop and spread in the head's units.
 */
interface BraidStyle {
  hair: Color3; tie: Color3; glow: number; unlit?: boolean; thick?: number; footDrop?: number; footOut?: number;
  // two-tone lobes and a flared tail under the tie (HEADBUTTER_COPPER)
  shade?: number; tail?: { long: number; top: number; foot: number };
}
const HEADBUTTER_BRAID_STYLE: BraidStyle = {
  hair: HEADBUTTER_HAIR, tie: HEADBUTTER_TIE, glow: HEADBUTTER_COPPER.glow, shade: HEADBUTTER_COPPER.shade,
  tail: { long: HEADBUTTER_COPPER.tail, top: HEADBUTTER_COPPER.tailTop, foot: HEADBUTTER_COPPER.tailFoot },
};

/** The Headbutter's two tan braids from under the ear flaps down onto the chest, a dark tie and tuft at each end (spec at HEADBUTTER_BRAID). */
export function headbutterBraids(scene: Scene, body: ArticulatedBody, style: BraidStyle = HEADBUTTER_BRAID_STYLE): Mesh[] {
  const B = HEADBUTTER_BRAID;
  const mf = getMaterialFactory();
  const hair = style.unlit ? mf.get("unlit", style.hair, { emissive: style.hair }) : mf.get("cloth", style.hair, { emissiveIntensity: style.glow });
  const tieMat = mf.get("cloth", style.tie, { emissiveIntensity: 0.1 });
  const darkHair = style.shade ? mf.get("cloth", style.hair.scale(style.shade), { emissiveIntensity: style.glow }) : hair;
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
      }, scene), k % 2 ? darkHair : hair);
      lobe.position.copyFrom(along(t));
      lobe.position.x += (k % 2 ? 1 : -1) * thick * 0.08;
      lobe.rotation.set(lean(t), 0, (k % 2 ? 1 : -1) * 0.35);
    }
    const tie = put(MeshBuilder.CreateCylinder("headbutterBraidTie", { height: B.band * H, diameter: thick * B.bandWide, tessellation: 7 }, scene), tieMat);
    tie.position.copyFrom(foot);
    tie.rotation.x = lean(1);
    const tail = style.tail;
    const tuftLong = tail ? tail.long : B.tuft;
    const tuft = put(MeshBuilder.CreateCylinder("headbutterBraidTuft", {
      height: tuftLong * H, diameterTop: thick * (tail ? tail.top : 0.7), diameterBottom: thick * (tail ? tail.foot : 0.25), tessellation: tail ? 7 : 5,
    }, scene), hair);
    tuft.convertToFlatShadedMesh();
    tuft.position.copyFrom(foot.add(tangent(1).scale((B.band + tuftLong) * H * 0.5)));
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
const JARL_BEARD = { color: new Color3(0.32, 0.25, 0.22), glow: 0.14, down: 0.72, wide: 0.78, tip: 0.6, jaw: [0.62, 0.6, 0.72] as const, jawY: 0.78, jawZ: 0.62, stacheLow: 0.3, stacheZ: 1.1, braidLong: 0.66 };
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
/*
 * [S] 409 one continuous beard (CONFIRM 406 a.3: "a short brown chin beard - TABS: a long braided beard hanging to mid-chest, tied with a band";
 * critic 408: "only a short brown chin block shows at his jaw, no plait hangs down his chest"). The 403 bib floated .14 of the chest depth in front of
 * the jaw mass and its thin plait, tan like the bear, read as the haft's grip. Now one flat-shaded tube in the torso frame runs from inside the jaw
 * mass (.jawIn of the chest depth, .jawUp of the chest height over the bib top) forward onto the chest at .ahead, down the bib (.bibDrop of the chest
 * height, .bibWide of the chest width across, tapering to .bibTip of that) and on into the plait (.plaitLong, .plait of the chest width), flattened
 * to .flat of its width in depth; .ties red ties round the plait and a tuft at its end. JARL_BEARD.color is the render's grey-brown, darker than the pelt.
 */
/*
 * [S] 410 narrowed and braided (critic 409: "the beard's top wider than the face swallows the lower face, a club off the chin; a smooth tube with no
 * plait lobes; the same brown as the pelt"; viking.jarl.red.png: a grey-brown beard narrower than the face under a visible mouth line, thinning into a
 * braid of stacked lobes tied red at mid-chest). The jaw mass is cut to JARL_BEARD.jaw .62 of the head's half width; the run starts at the chin
 * (.jawUp 0), its bib .bibWide of the chest width (about the chin's); below the bib the plait is .lobes faceted lobes, alternately .shade darker,
 * each .plait of the chest width across, overlapping .overlap of a step, tipped alternately, with the ties and the tuft under them. JARL_BEARD.color
 * a grey-brown, off the pelt's red-brown.
 */
const JARL_BEARD_RUN = {
  ahead: 0.82, jawIn: 0.45, jawUp: 0, top: 0.04, bibDrop: 0.3, bibWide: 0.34, bibTip: 0.55, plaitLong: 0.46, plait: 0.15, flat: 0.5, ties: 1,
  lobes: 4, overlap: 1.4, shade: 0.75, tie: new Color3(0.55, 0.1, 0.08),
};
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
  const footY = topY - bibH;
  const plaitH = H * R.plaitLong;
  const rTop = (W * R.bibWide) / 2, rFoot = rTop * R.bibTip, rPlait = (W * R.plait) / 2;
  // [y, z, radius]; z is divided by .flat because the mesh is squashed by it in depth
  const pts: [number, number, number][] = [
    [topY + H * R.jawUp, chest.position.z + D * R.jawIn, rTop * 0.8],
    [topY, z, rTop],
    [topY - bibH * 0.55, z + D * 0.03, (rTop + rFoot) / 2],
    [footY, z + D * 0.02, rFoot],
  ];
  const beard = put(MeshBuilder.CreateTube("jarlBeardRun", {
    path: pts.map(([y, pz]) => new Vector3(0, y, pz / R.flat)), radiusFunction: (i) => pts[i][2], tessellation: 6, cap: Mesh.CAP_ALL,
  }, scene));
  beard.scaling.z = R.flat;
  const darkHair = mf.get("cloth", J.color.scale(R.shade), { emissive: J.color.scale(R.shade * J.glow) });
  const step = plaitH / R.lobes;
  for (let k = 0; k < R.lobes; k++) {
    const lobe = put(MeshBuilder.CreateIcoSphere("jarlBeardLobe", {
      radiusX: rPlait, radiusY: step * 0.5 * R.overlap, radiusZ: rPlait * 0.8, subdivisions: 1, flat: true,
    }, scene), k % 2 ? darkHair : hair);
    lobe.position.set((k % 2 ? 1 : -1) * rPlait * 0.12, footY - step * (k + 0.5), z + D * 0.02);
    lobe.rotation.z = (k % 2 ? 1 : -1) * 0.35;
  }
  for (let k = 0; k < R.ties; k++) {
    const tie = put(MeshBuilder.CreateCylinder("jarlBeardTie", { height: H * 0.04, diameter: rPlait * 2.5, tessellation: 6 }, scene), tieMat);
    tie.scaling.z = 0.7;
    tie.position.set(0, footY - plaitH * (0.35 + 0.4 * k), z + D * 0.02);
  }
  const tuft = put(MeshBuilder.CreateCylinder("jarlBeardTuft", { height: H * 0.08, diameterTop: rPlait * 2.2, diameterBottom: 0, tessellation: 5 }, scene));
  tuft.scaling.z = 0.7;
  tuft.position.set(0, footY - plaitH - H * 0.04, z + D * 0.01);
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

/*
 * [S] 407 the Longship Carrier's dress (CONFIRM 403 a.4: "plain team mannequins"; viking.longship.red.png, .blue.png: each carrier a bearded viking with a
 * brown beard braided down the chest, a dark headband round the brow with two cream horns, and a belt with a round buckle). Three pieces, each sized
 * off the carrier's own head and trunk:
 *   beard: the shared viking cut (VIKING_BEARD) in mid brown with its tied braid (LONGSHIP_CARRIER.beard*);
 *   headband: a dark leather ring .band of the head tall round the brow at .bandY of the half height, .bandOut of the head's width round, with a cream
 *     horn off each side of it, .horn of the head tall, its foot .hornBase across, splayed .hornSplay rad out and up;
 *   belt: the Jarl's round-buckle belt (JARL_BELT).
 */
const LONGSHIP_CARRIER = {
  beard: new Color3(0.42, 0.22, 0.11), beardGlow: 0.2, down: 0.75, wide: 1.0, tip: 0.5,
  band: 0.22, bandY: 0.32, bandOut: 1.08, horn: 0.85, hornBase: 0.32, hornSplay: 0.55,
  leather: new Color3(0.2, 0.11, 0.06), horn_: new Color3(0.86, 0.82, 0.7),
};
/** A Longship Carrier's braided brown beard, horned headband and round-buckle belt (spec at LONGSHIP_CARRIER). */
export function longshipCarrierDress(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = LONGSHIP_CARRIER;
  const out: Mesh[] = vikingBeard(scene, body, { color: C.beard, glow: C.beardGlow, down: C.down, wide: C.wide, tip: C.tip, braid: true, stache: true });
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", C.leather, { emissive: C.leather.scale(0.2) });
  const hornMat = mf.get("cloth", C.horn_, { emissive: C.horn_.scale(0.25) });
  const e = headExtents(body);
  const band = MeshBuilder.CreateCylinder("carrierHeadband", { height: e.y * 2 * C.band, diameter: e.x * 2 * C.bandOut, tessellation: 10 }, scene);
  band.scaling.z = (e.z / e.x) * 1.0;
  band.position.y = e.y * C.bandY;
  band.parent = body.headMesh;
  band.material = leather;
  band.convertToFlatShadedMesh();
  out.push(band);
  for (const side of [-1, 1]) {
    const horn = MeshBuilder.CreateCylinder("carrierHorn", { height: e.y * 2 * C.horn, diameterTop: 0, diameterBottom: e.y * 2 * C.hornBase, tessellation: 5 }, scene);
    horn.rotation.z = -side * C.hornSplay;
    horn.position.set(side * (e.x * C.bandOut + Math.sin(C.hornSplay) * e.y * C.horn), e.y * C.bandY + Math.cos(C.hornSplay) * e.y * C.horn * 0.8, 0);
    horn.parent = body.headMesh;
    horn.material = hornMat;
    horn.convertToFlatShadedMesh();
    out.push(horn);
  }
  out.push(...jarlBelt(scene, body));
  return out;
}

/*
 * [R] 407 the Brawler's beard, rebuilt (blockers a.2 "a short dark mass under the mask, not a jaw-wide beard onto the chest", a.4 "it stops at the top of
 * the chest under the shield rim", a.5 "a lighter brown than the reference's near-black brown"; viking.brawler.red.png, viking.brawler.jpg: a dark beard
 * filling the jaw under the helm's mask and pouring down the chest over the round board). Read off the renders and the 407 probes:
 *   - the board in his idle lies as a tray across his belly: its face normal is the board's local +z, (0, .97, .23) in the torso frame, centre .1 under
 *     the chin; seen from the front three-quarter its upper face shows, so "down the shield's face toward the boss" is along that face, away from him;
 *   - the head cut's bib, hung from the head, ran down inside the chest and under the board (401 bib2 behind the board; 402 splay sideways), so the
 *     beard is three pieces, each in the frame it must follow:
 *   jaw (head): a faceted mass .jaw (x, y, z) of the head's half extents at .jawY down and .jawZ ahead, wider than the face, filling the open lower face
 *     under the mask; a drooping moustache under the mask's foot (.stacheLow, .stacheZ);
 *   bib (torso): a broad tapered block from under the chin (.bibTop of the trunk height under the neck joint) down .bibDrop of the trunk height, .bibWide
 *     of the trunk width across narrowing to .bibTip of that, .bibDeep deep, its back on the chest's front face and leaning out .bibLean toward its foot,
 *     where it meets the board's face;
 *   spill (board): a tapered slab lying on the board's upper face, .spillFrom to .spillTo in the board's own frame (local y runs toward him, the boss at
 *     its middle), .spillWide across at its root narrowing to .spillTip, .spillThick thick, with .locks pointed locks at its end beside the boss;
 *     the board is found by name ("nshield", attached before the dress); without it the spill is skipped.
 * Near-black brown cloth (palette brown x .2) with a small self-light, nothing sideways or upward: hair hangs down and lies on what is under it.
 */
const BRAWLER_BEARD = {
  jaw: [1.5, 0.95, 0.8] as const, jawY: 1.0, jawZ: 0.55, stacheLow: 0.62, stacheZ: 1.25,
  bibTop: 0.0, bibDrop: 0.28, bibWide: 0.6, bibTip: 0.72, bibDeep: 0.2, bibLean: 0.08,
  spillFrom: [0.085, 0.15] as const, spillTo: [0.12, -0.05] as const, spillWide: 0.11, spillTip: 0.55, spillThick: 0.012, locks: 3, lock: 0.035,
  color: new Color3(0.13, 0.065, 0.045), glow: 0.12,
};
/** The Brawler's near-black beard: a jaw mass under the mask, a bib down the chest and its spill over the board's face (spec at BRAWLER_BEARD). */
export function brawlerBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = BRAWLER_BEARD;
  const mf = getMaterialFactory();
  const hair = mf.get("cloth", B.color, { emissiveIntensity: B.glow });
  const out: Mesh[] = [];
  const put = (m: Mesh, parent: Node): Mesh => { m.material = hair; m.parent = parent; m.convertToFlatShadedMesh(); out.push(m); return m; };
  // jaw and moustache, in the head's half extents
  const e = headExtents(body);
  const jaw = put(MeshBuilder.CreateIcoSphere("brawlerBeardJaw", { radius: 1, subdivisions: 1, flat: true }, scene), body.headMesh);
  jaw.scaling.set(e.x * B.jaw[0], e.y * B.jaw[1], e.z * B.jaw[2]);
  jaw.position.set(0, -e.y * B.jawY, e.z * B.jawZ);
  const column = (name: string, from: Vector3, to: Vector3, root: number, tip: number, parent: Node): Mesh => {
    const d = to.subtract(from);
    const m = MeshBuilder.CreateCylinder(name, { height: d.length(), diameterTop: root, diameterBottom: tip, tessellation: 5 }, scene);
    m.rotationQuaternion = Quaternion.Identity();
    Quaternion.FromUnitVectorsToRef(new Vector3(0, -1, 0), d.normalize(), m.rotationQuaternion);
    m.position = Vector3.Center(from, to);
    return put(m, parent);
  };
  for (const side of [-1, 1]) {
    column("brawlerBeardStache", new Vector3(0, -e.y * B.stacheLow, e.z * B.stacheZ),
      new Vector3(side * e.x * 0.76, -e.y * (B.stacheLow + 0.26), e.z * (B.stacheZ - 0.12)), e.x * 0.28, e.x * 0.14, body.headMesh);
  }
  // the bib down the chest, its back on the chest's front face
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const front = chest.position.z + D * 0.5;
  const bibH = H * B.bibDrop, bibD = D * B.bibDeep;
  const topY = body.neck.position.y - H * B.bibTop;
  const bib = put(MeshBuilder.CreateCylinder("brawlerBeardBib", { height: bibH, diameterTop: W * B.bibWide, diameterBottom: W * B.bibWide * B.bibTip, tessellation: 6 }, scene), body.torso);
  bib.scaling.z = bibD / (W * B.bibWide);
  bib.rotation.x = -B.bibLean * 2;
  bib.position.set(chest.position.x, topY - bibH * 0.5, front + bibD * 0.5 + bibH * B.bibLean);
  // the spill over the board's upper face, in the board's own frame
  const board = body.root.getChildMeshes(false).find((m) => m.name === "nshield");
  if (board) {
    const bb = board.getBoundingInfo().boundingBox;
    const faceZ = bb.maximum.z + B.spillThick * 0.5;
    const from = new Vector3(B.spillFrom[0], B.spillFrom[1], faceZ), to = new Vector3(B.spillTo[0], B.spillTo[1], faceZ);
    const run = to.subtract(from), long = run.length();
    const spill = MeshBuilder.CreateCylinder("brawlerBeardSpill", { height: long, diameterTop: B.spillWide, diameterBottom: B.spillWide * B.spillTip, tessellation: 6 }, scene);
    spill.scaling.z = B.spillThick / B.spillWide;
    spill.rotation.z = Math.atan2(run.x, -run.y);
    spill.position = Vector3.Center(from, to);
    put(spill, board);
    for (let i = 0; i < B.locks; i++) {
      const u = (i + 0.5) / B.locks - 0.5;
      const dir = run.normalize();
      const across = new Vector3(-dir.y, dir.x, 0);
      const root = to.add(across.scale(u * B.spillWide * B.spillTip * 0.9));
      const tip = root.add(dir.scale(B.lock * (1 - Math.abs(u)))).add(across.scale(u * B.lock * 0.4));
      const lock = column("brawlerBeardLock", root, tip, B.spillWide * 0.22, 0.002, board);
      lock.scaling.z = 0.5;
    }
  }
  return out;
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
  // [S] 410 cloth shin wraps in place of the fur cuff when 1 (LEG_WRAPS)
  wrap: 0,
};
/*
 * [S] 410 tan cloth shin wraps (CONFIRM 406 a.4 on the Jarl: "thick white fur rolls at the knees - TABS: tan cloth wraps on the shins above brown leather
 * boots"; viking.jarl.red.png: a baggy khaki wrap round each shin from under the trouser hem to the boot top, bound by darker bands, no fur). With
 * BRAWLER_LEGS.wrap the fur cuff and its roll give way to a faceted tan sleeve over the cuff's span, .out of the shin's radius, with .bands darker
 * bindings .band of the span tall, .bandOut of it.
 */
const LEG_WRAPS = { color: new Color3(0.55, 0.45, 0.28), dark: new Color3(0.32, 0.24, 0.14), out: 1.42, bands: 2, band: 0.12, bandOut: 1.5, glow: 0.2 };
/*
 * [S] 407 the Headbutter's cut of the leg kit (blocker a.2: "belt-to-sole about 40% of the height, the fur cuffs stacked right under the shorts at knee
 * level"; 406 critic off viking.headbutter.blue.png: cap 115, belt 490, cuff top 780, sole 1000 px, so the trousers are a third of his height and the
 * cuffs sit at mid-shin over a short boot). The trousers run on down the shin to .hemTo of it, baggy (.hemOut), gathered into the cuff at mid-shin
 * (.cuffFrom-.cuffTo), and the boot starts under it (.bootFrom); with unitVisuals' longer shin (shinLength) and shorter trunk (torsoLength) the leg
 * under the belt is the longer half of him, as in the render.
 */
const HEADBUTTER_LEGS: Partial<typeof BRAWLER_LEGS> = { thighOut: 1.36, hemTo: 0.62, hemOut: 1.44, cuffFrom: 0.58, cuffTo: 0.76, bootFrom: 0.74 };
/** The Headbutter's long trousers into mid-shin fur cuffs over short boots (spec at HEADBUTTER_LEGS). */
export function headbutterLegs(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  return brawlerLegs(scene, body, teamColor, HEADBUTTER_LEGS);
}
/** The Brawler's puffy team trousers, cream fur calf cuffs and brown boots (spec at BRAWLER_LEGS); `cut` overrides the cut per unit. */
export function brawlerLegs(scene: Scene, body: ArticulatedBody, teamColor: Color3, cut: Partial<typeof BRAWLER_LEGS> = {}): Mesh[] {
  const B = { ...BRAWLER_LEGS, ...cut };
  const mf = getMaterialFactory();
  const pants = mf.get("cloth", teamColor.scale(0.84), { emissiveIntensity: B.glow * 0.5 });
  const boot = mf.get("cloth", new Color3(0.36, 0.21, 0.12), { emissiveIntensity: B.glow * 0.5 });
  const soleMat = mf.get("cloth", new Color3(0.2, 0.12, 0.07), { emissiveIntensity: B.glow * 0.35 });
  // cream fur that has to read cream and not grey in the shade (LESSONS: a lit fur under the tunic reads grey): flat, out of the glow layer
  const furColor = new Color3(0.9, 0.7, 0.42);
  const fur = mf.get("unlit", furColor, { emissive: furColor });
  const wrapMat = mf.get("cloth", LEG_WRAPS.color, { emissive: LEG_WRAPS.color.scale(LEG_WRAPS.glow) });
  const wrapDark = mf.get("cloth", LEG_WRAPS.dark, { emissive: LEG_WRAPS.dark.scale(LEG_WRAPS.glow) });
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
    if (B.wrap) {
      const span = B.cuffTo - B.cuffFrom;
      out.push(limbShell(scene, "legWrap", shin, B.cuffFrom - span * 0.15, B.cuffTo + span * 0.1, LEG_WRAPS.out, wrapMat));
      for (let k = 0; k < LEG_WRAPS.bands; k++) {
        const at = B.cuffFrom + span * ((k + 0.5) / LEG_WRAPS.bands);
        out.push(limbShell(scene, "legWrapBand", shin, at - span * LEG_WRAPS.band * 0.5, at + span * LEG_WRAPS.band * 0.5, LEG_WRAPS.bandOut, wrapDark));
      }
    } else {
      out.push(limbShell(scene, "brawlerFurCuff", shin, B.cuffFrom, B.cuffTo, B.cuffOut, fur));
      furRoll(shin, B.cuffFrom, B.cuffOut, B.cuffThick, B.cuffLumps);
    }
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
/*
 * [S] 408 the Headbutter's team tunic (CONFIRM 407 a.1: "a grey-brown leather vest/plate over the chest with a hanging flap ... not the team skin";
 * viking.headbutter.red.png: a plain team-coloured short-sleeved tunic, broken only by the brown belt). The viking_fur preset tints the trunk half way to
 * tan, so the trunk reads as a brown vest; his tunic is its own team cloth over it: a shell round the trunk box .out of its half width and .deep of its
 * half depth from the neck to its foot, a short sleeve round each upper arm from the shoulder to .sleeve of its length (.sleeveOut of its radius), and
 * the tunic skirt under the belt in the same cloth (unitFactory, headbutterTunicCloth). Team cloth self-lit .glow so the shaded side stays team.
 */
const HEADBUTTER_TUNIC = { out: 1.05, deep: 1.08, sleeve: 0.42, sleeveOut: 1.2, glow: 0.12 };
/** The Headbutter's team tunic cloth (spec at HEADBUTTER_TUNIC), shared by the trunk shell, the sleeves and the tunic skirt. */
export function headbutterTunicCloth(teamColor: Color3) {
  return getMaterialFactory().get("cloth", teamColor, { emissive: teamColor.scale(HEADBUTTER_TUNIC.glow) });
}
/** The Headbutter's short-sleeved team tunic over the trunk (spec at HEADBUTTER_TUNIC). */
export function headbutterTunic(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const T = HEADBUTTER_TUNIC;
  const cloth = headbutterTunicCloth(teamColor);
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const shell = MeshBuilder.CreateBox("headbutterTunic", {
    width: tb.extendSize.x * 2 * ts.x * T.out, height: tb.extendSize.y * 2 * ts.y, depth: tb.extendSize.z * 2 * ts.z * T.deep,
  }, scene);
  shell.position.set(tm.position.x + tb.center.x * ts.x, tm.position.y + tb.center.y * ts.y, tm.position.z + tb.center.z * ts.z);
  shell.rotation.copyFrom(tm.rotation);
  shell.parent = tm.parent;
  shell.material = cloth;
  const out: Mesh[] = [shell];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "headbutterSleeve", arm, 0, T.sleeve, T.sleeveOut, cloth));
  return out;
}
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
  skullW: 1.45, skullH: 1.0, skullD: 1.35, skullY: 1.25, skullZ: -0.05,
  eye: 0.3, eyeOut: 0.44, eyeY: 1.5, eyeProud: 1.32, pupil: 0.45,
  muzzle: 0.66, muzzleTall: 0.42, muzzleLong: 0.72, muzzleZ: 1.3, muzzleDrop: 0.1,
  nose: 0.34, noseTall: 0.16, fangs: 2, fang: 0.3, fangOut: 0.17, fangClear: 0.05,
  ear: 0.3, earOut: 0.9, earY: 2.0, earZ: -0.15,
  curtainW: 0.42, curtainD: 0.8, curtainOut: 1.12, curtainZ: -0.06, curtainTop: 0.52, curtainFoot: -1.1,
  drape: 0.18, drapeOut: 0.58, drapeDrop: 0.88, drapeDeep: 0.6, back: 0.85, backDeep: 0.14, tufts: 4, tuft: 0.2, glow: 0.2,
  mantleDeep: 0.68,
  chestW: 0.2, chestOut: 0.23, chestDeep: 0.12, chestProud: 0.54, chestDrop: 0.98, chestTufts: 3,
};
const JARL_FLAPS = { out: 0.3, capWide: 0.3, capTall: 0.16, capBack: 0.3, capRise: 0.02, wide: 0.32, tip: 0.8, deep: 0.16, proud: 0.03, lean: 0.06, past: 0.04, tufts: 3 };
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
  // [S] 408 the bear head sits ON his head, its face over his brow (CONFIRM 406 a.2: "a small brown cap with stub ears, no snout, googly eyes or fangs
  // above the face"; viking.jarl.red.png: a large bear head on top of the head, googly eyes, fangs overhanging the face): the skull is raised to
  // .skullY (its foot just over his eyes) and enlarged, the googly eyes high on its front (.eyeY), and a broad snout .muzzleLong out of its front whose
  // underside sits .fang + .fangClear head half-heights over his own eye beads (eyeTopInHead), with a dark nose on its tip and two white fangs .fang
  // long hanging from its front corners down over his brow, clear of his eyes.
  const eyeTop = eyeTopInHead(body) ?? e.y * 0.4;
  const muzzleY = eyeTop + e.y * (P.fang + P.fangClear + P.muzzleTall * 0.5);
  const muzzle = put(MeshBuilder.CreateBox("jarlBearMuzzle", {
    width: e.x * P.muzzle, height: e.y * P.muzzleTall, depth: e.z * P.muzzleLong,
  }, scene), muzzleMat, body.headMesh);
  muzzle.position.set(0, muzzleY, e.z * P.muzzleZ);
  muzzle.rotation.x = P.muzzleDrop;
  const tipZ = e.z * (P.muzzleZ + P.muzzleLong * 0.5);
  const nose = put(MeshBuilder.CreateBox("jarlBearNose", {
    width: e.x * P.nose, height: e.y * P.noseTall, depth: e.z * 0.14,
  }, scene), pupilMat, body.headMesh);
  nose.position.set(0, muzzleY + e.y * P.muzzleTall * 0.3, tipZ);
  for (let i = 0; i < P.fangs; i++) {
    const side = i === 0 ? -1 : 1;
    const fang = put(MeshBuilder.CreateCylinder("jarlBearTooth", {
      height: e.y * P.fang, diameterTop: 0, diameterBottom: e.x * 0.12, tessellation: 4,
    }, scene), bone, body.headMesh);
    fang.position.set(side * e.x * P.fangOut, muzzleY - e.y * (P.muzzleTall * 0.5 + P.fang * 0.5), tipZ - e.z * 0.08);
    fang.rotation.z = Math.PI;
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
  // [S] 407 the pelt's two long front flaps (CONFIRM 406 a.1: "two flat rectangular brown slabs standing on the shoulders like a backpack";
  // viking.jarl.red.png, viking.jarl.jpg: the pelt hangs from the bear head over both shoulders as long fur flaps down the front to the belt, framing
  // the chest). The shoulder side panels (jarlPeltSide) and the thin chest strips are gone; JARL_FLAPS, in the trunk's size (W wide, H tall, D deep) and
  // the shoulder span S: each flap is
  //   cap: a rounded fur pad over the shoulder top at .out of S from the middle, .capWide of S across, from .capBack of D behind the chest's middle to
  //     the chest's front, so the hood's curtain runs on over the shoulder instead of standing behind it;
  //   flap: a tapered fur slab from the cap down the chest front to the belt (JARL_BELT.at) and .past it, .wide of S across at the shoulder narrowing
  //     to .tip of that, .deep of D thick, its back .proud of D off the chest's front face, leaning .lean in toward the middle at its foot;
  //   tufts: .tufts jagged dark points at its foot, the pelt's ragged edge.
  const F = JARL_FLAPS;
  const S = shoulderW;
  const frontZ = chest.position.z + D * 0.5;
  const beltY = chest.position.y + (H * 0.5) * JARL_BELT.at;
  const flapTop = top + H * F.capRise, flapFoot = beltY - H * F.past;
  const flapH = flapTop - flapFoot;
  for (const side of [-1, 1]) {
    const cap = put(MeshBuilder.CreateIcoSphere("jarlPeltCap", { radius: 1, subdivisions: 1, flat: true }, scene), fur, body.torso);
    const capDeep = frontZ - (chest.position.z - D * F.capBack);
    cap.scaling.set(S * F.capWide * 0.5, H * F.capTall * 0.5, capDeep * 0.5);
    cap.position.set(side * S * F.out, top, frontZ - capDeep * 0.5);
    // a square-section taper turned flat to the chest, then thinned (both baked before parenting, or the parent's transform is baked in too)
    const slab = MeshBuilder.CreateCylinder("jarlPeltFlap", {
      height: flapH, diameterTop: S * F.wide, diameterBottom: S * F.wide * F.tip, tessellation: 4,
    }, scene);
    slab.rotation.y = Math.PI / 4;
    slab.bakeCurrentTransformIntoVertices();
    slab.scaling.set(1, 1, (D * F.deep) / (S * F.wide));
    slab.bakeCurrentTransformIntoVertices();
    const flap = put(slab, fur, body.torso);
    flap.rotation.z = -side * F.lean;
    flap.position.set(side * (S * F.out - Math.sin(F.lean) * flapH * 0.5), flapFoot + flapH * 0.5, frontZ + D * F.proud + D * F.deep * 0.5);
    for (let k = 0; k < F.tufts; k++) {
      const tuft = put(MeshBuilder.CreateCylinder("jarlPeltFlapTuft", {
        height: H * P.tuft, diameterTop: S * F.wide * F.tip * 0.45, diameterBottom: 0, tessellation: 4,
      }, scene), darkFur, body.torso);
      tuft.position.set(
        side * (S * F.out - Math.sin(F.lean) * flapH) + (k - (F.tufts - 1) / 2) * S * F.wide * F.tip * 0.4,
        flapFoot - H * P.tuft * 0.4,
        frontZ + D * F.proud + D * F.deep * 0.5,
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
