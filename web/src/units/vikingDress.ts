import { Scene, Color3, Mesh, MeshBuilder, Node, TransformNode, Vector3 } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

/*
 * Viking dress (units/viking.*): cloth, hair and ornaments built per unit id by unitFactory, sized off the body's own metrics and joints.
 * Pieces worn on the head are parented to the head mesh (+z his front, +y up, its origin its middle); pieces on the trunk to the torso joint.
 */

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
const HEADBUTTER_CAP = {
  dome: 1.16, tall: 1.04, rise: 0.16, band: 0.15, bandProud: 1.05, studs: 5, stud: 0.11,
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
  const top = e.y * C.rise;
  const dome = put(MeshBuilder.CreateSphere("headbutterCap", {
    diameterX: 2 * e.x * C.dome, diameterY: 2 * e.y * C.tall, diameterZ: 2 * e.z * C.dome, segments: 10, slice: 0.56,
  }, scene), cap);
  dome.position.y = top;
  // the brow band: a dark ring round the head, its middle a touch under the cap's rim
  const bandY = e.y * (C.rise - C.band * 0.35);
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
  // the ear flaps: a dark panel down each side of the face, from the band to under the jaw
  for (const side of [-1, 1]) {
    const flap = put(MeshBuilder.CreateBox("headbutterFlap", {
      width: e.x * C.flapWide, height: e.y * C.flapDrop, depth: 2 * e.z * C.flapDeep,
    }, scene), leather);
    flap.position.set(side * (e.x * C.bandProud + e.x * C.flapWide * 0.28), bandY - e.y * C.flapDrop * 0.35, -e.z * 0.06);
    flap.rotation.z = side * 0.07;
  }
  // the single spike: a tall grey cone off the crown, with its stud at the foot
  const crown = e.y * (C.rise + C.tall) - e.y * 0.03;
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

/** The Headbutter's two tan braids from under the ear flaps down onto the chest, a dark tie and tuft at each end (spec at HEADBUTTER_BRAID). */
export function headbutterBraids(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = HEADBUTTER_BRAID;
  const mf = getMaterialFactory();
  const hair = mf.get("cloth", HEADBUTTER_HAIR, { emissiveIntensity: B.glow });
  const tieMat = mf.get("cloth", HEADBUTTER_TIE, { emissiveIntensity: 0.1 });
  const head = headInTorso(body);
  const H = head.tall, W = head.wide;
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const front = chest.position.z + ext.z * chest.scaling.z;
  const thick = B.thick * W;
  const added: Mesh[] = [];
  const put = (m: Mesh, material: typeof hair): Mesh => {
    m.material = material;
    m.parent = body.torso;
    added.push(m);
    return m;
  };
  for (const side of [-1, 1]) {
    const root = new Vector3(side * B.apart * W, head.chin + B.rootUp * H, head.midZ + head.deep * B.rootAhead);
    const foot = new Vector3(side * B.footOut * W, head.chin - B.footDrop * H, front + B.standOff * W + thick * 0.5);
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
 * [S] the Jarl's bear pelt (393, rebuilt 394; viking.jarl.red.png: a rounded bear's head over his own, two big googly eyes on its FRONT face, a blunt muzzle
 * with a dark nose and teeth under it, small round ears, and the bear's fur hanging down each side of his face onto a thick mantle over both shoulders;
 * critic 393: the hood was a flat crate with the eyes on its top face and the drapes were flat planks off his flanks). Body -x is his left, the head's frame
 * +z his front. In the head's size (e the head's half extents):
 *   skull: a rounded fur ball over his crown, .skullWide W across, .skullTall H high, .skullDeep D deep, its middle .skullRise H up and .skullAhead D ahead,
 *   so its rounded face stands out over his brow;
 *   muzzle: a blunt tapered snout off that face, .muzzleWide W across at the root, .muzzleDeep D long, tipped down .muzzleDrop rad, a dark nose ball at its tip
 *   and .teeth white teeth under it;
 *   eyes: two pale googly eyes .eye W across, set wide .eyeOut W either side and .eyeUp H up on the skull's FRONT face (their centres pushed out onto the
 *   sphere's surface), each with a black pupil .pupil of the eye;
 *   ears: two fur balls .ear W across at the skull's top .earOut W out and .earUp H above its middle;
 *   curtains: per side .curtains overlapping fur panels down beside his own face, .curtainWide W across, .curtainDrop H down from the skull's middle, .curtainOut
 *   W out, each ending in .curtainTufts ragged tufts;
 * and hung from the torso: a thick fur mantle over both shoulders (.mantle of the shoulder span wide, .mantleTall H tall, .mantleDeep D deep) with a fur lump
 * over each shoulder, a drape off each shoulder down the chest to the hips (.drape of the shoulder span wide, .drapeDrop H down) ending in ragged tufts, and a
 * back panel over the spine. Fur self-lit .glow so the hood does not read grey under its own overhang.
 */
const JARL_PELT = {
  skullWide: 1.16, skullTall: 0.84, skullDeep: 1.2, skullRise: 0.76, skullAhead: 0.22,
  muzzleWide: 0.34, muzzleDeep: 0.62, muzzleDrop: 0.22, nose: 0.34,
  eye: 0.2, eyeUp: 0.18, eyeOut: 0.5, pupil: 0.42, teeth: 3, tooth: 0.13, ear: 0.24, earOut: 0.66, earUp: 0.62,
  curtains: 2, curtainWide: 0.52, curtainDrop: 1.5, curtainOut: 0.86, curtainAhead: 0.22, curtainTufts: 3, curtainTuft: 0.26,
  mantle: 1.14, mantleTall: 0.3, mantleDeep: 1.3, mantleLump: 0.34,
  drape: 0.26, drapeOut: 0.44, drapeDrop: 0.78, drapeDeep: 0.5, back: 0.85, backDeep: 0.16, tufts: 3, tuft: 0.2, glow: 0.2,
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
  // the skull: a rounded fur ball over his crown, its face standing out over his brow
  const skullR = new Vector3(e.x * P.skullWide, e.y * P.skullTall, e.z * P.skullDeep);
  const skullY = e.y * P.skullRise, skullZ = e.z * P.skullAhead;
  const skull = put(MeshBuilder.CreateSphere("jarlBearSkull", {
    diameterX: 2 * skullR.x, diameterY: 2 * skullR.y, diameterZ: 2 * skullR.z, segments: 8,
  }, scene), fur, body.headMesh);
  skull.position.set(0, skullY, skullZ);
  // the skull's own surface at a point on its front face, so a googly eye sits ON it, not inside or on its top
  const faceZ = (x: number, y: number): number => {
    const u = Math.min(1, Math.abs(x) / Math.max(0.001, skullR.x));
    const v = Math.min(1, Math.abs(y - skullY) / Math.max(0.001, skullR.y));
    return skullZ + skullR.z * Math.sqrt(Math.max(0.04, 1 - u * u - v * v));
  };
  // the muzzle: a blunt tapered snout off that face, tipped down, a dark nose ball at its tip
  const muzzleLen = e.z * P.muzzleDeep;
  const muzzleY = skullY - e.y * 0.1, muzzleZ = faceZ(0, muzzleY) - e.z * 0.1;
  const muzzle = put(MeshBuilder.CreateCylinder("jarlBearMuzzle", {
    height: muzzleLen * 2, diameterBottom: 2 * e.x * P.muzzleWide, diameterTop: 2 * e.x * P.muzzleWide * 1.35, tessellation: 6,
  }, scene), muzzleMat, body.headMesh);
  muzzle.rotation.x = Math.PI / 2 + P.muzzleDrop;
  muzzle.position.set(0, muzzleY - Math.sin(P.muzzleDrop) * muzzleLen * 0.5, muzzleZ + Math.cos(P.muzzleDrop) * muzzleLen * 0.5);
  const muzzleTip = new Vector3(0, muzzleY - Math.sin(P.muzzleDrop) * muzzleLen, muzzleZ + Math.cos(P.muzzleDrop) * muzzleLen);
  const nose = put(MeshBuilder.CreateIcoSphere("jarlBearNose", { radius: e.x * P.nose * 0.34, subdivisions: 1, flat: true }, scene), pupilMat, body.headMesh);
  nose.position.set(0, muzzleTip.y + e.y * 0.04, muzzleTip.z + e.z * 0.02);
  // the googly eyes on the skull's front face, and the ears on its top corners
  for (const side of [-1, 1]) {
    const ex = side * e.x * P.eyeOut, ey = skullY + e.y * P.eyeUp;
    const ez = faceZ(ex, ey);
    const eye = put(MeshBuilder.CreateIcoSphere("jarlBearEye", { radius: e.x * P.eye, subdivisions: 2 }, scene), bone, body.headMesh, false);
    eye.position.set(ex, ey, ez + e.x * P.eye * 0.35);
    const pupil = put(MeshBuilder.CreateIcoSphere("jarlBearPupil", { radius: e.x * P.eye * P.pupil, subdivisions: 1 }, scene), pupilMat, body.headMesh, false);
    pupil.position.set(ex, ey, ez + e.x * P.eye * 1.1);
    const ear = put(MeshBuilder.CreateIcoSphere("jarlBearEar", { radius: e.x * P.ear, subdivisions: 1, flat: true }, scene), darkFur, body.headMesh);
    ear.position.set(side * e.x * P.earOut, skullY + e.y * P.earUp, skullZ - e.z * 0.2);
    // the curtains: fur panels hanging beside his own face, from the skull down past the jaw, ragged at the bottom
    const wide = e.x * P.curtainWide, drop = e.y * P.curtainDrop;
    for (let k = 0; k < P.curtains; k++) {
      const w = wide * (1 - k * 0.22), dropK = drop * (1 - k * 0.12);
      const panel = put(MeshBuilder.CreateBox("jarlBearCurtain", {
        width: w, height: dropK, depth: e.z * (1.5 - k * 0.2),
      }, scene), fur, body.headMesh);
      panel.position.set(
        side * (e.x * P.curtainOut + k * w * 0.36),
        skullY - dropK * 0.5 + e.y * 0.12,
        e.z * P.curtainAhead - k * e.z * 0.2,
      );
      panel.rotation.z = side * (0.05 + k * 0.05);
      if (k) continue;
      for (let j = 0; j < P.curtainTufts; j++) {
        const tuft = put(MeshBuilder.CreateCylinder("jarlBearCurtainTuft", {
          height: e.y * P.curtainTuft, diameterTop: w * 0.34, diameterBottom: 0, tessellation: 4,
        }, scene), darkFur, body.headMesh);
        tuft.position.set(
          side * (e.x * P.curtainOut + (j - (P.curtainTufts - 1) / 2) * w * 0.32),
          skullY - dropK + e.y * 0.12 - e.y * P.curtainTuft * 0.35,
          e.z * P.curtainAhead,
        );
        tuft.rotation.z = Math.PI;
      }
    }
  }
  for (let i = 0; i < P.teeth; i++) {
    const tooth = put(MeshBuilder.CreateCylinder("jarlBearTooth", {
      height: e.y * P.tooth, diameterTop: 0, diameterBottom: e.x * 0.13, tessellation: 4,
    }, scene), bone, body.headMesh);
    tooth.position.set((i - (P.teeth - 1) / 2) * e.x * 0.28, muzzleTip.y + e.y * 0.06, muzzleTip.z - e.z * 0.12);
    tooth.rotation.z = Math.PI;
  }
  // the pelt: a rounded fur mass over both shoulders with a lump on each, a drape off each shoulder down the chest, and one over the spine
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const top = chest.position.y + H * 0.5;
  const shoulderW = body.metrics.shoulderWidth ?? W * 1.3;
  const drapeH = H * P.drapeDrop;
  const mantleH = H * P.mantleTall;
  const mantle = put(MeshBuilder.CreateIcoSphere("jarlPeltMantle", {
    radiusX: shoulderW * P.mantle * 0.5, radiusY: mantleH * 0.5, radiusZ: D * P.mantleDeep * 0.5, subdivisions: 2, flat: true,
  }, scene), fur, body.torso);
  mantle.position.set(0, top - mantleH * 0.3, chest.position.z + D * 0.04);
  for (const side of [-1, 1]) {
    // the fur lump over the shoulder, so the pelt rounds off his shoulder line rather than ending in a plank
    const lump = put(MeshBuilder.CreateIcoSphere("jarlPeltShoulder", {
      radiusX: shoulderW * P.mantleLump * 0.5, radiusY: mantleH * 0.9, radiusZ: D * P.mantleLump * 0.5, subdivisions: 1, flat: true,
    }, scene), fur, body.torso);
    lump.position.set(side * shoulderW * 0.42, top - mantleH * 0.3, chest.position.z + D * 0.04);
    const panel = put(MeshBuilder.CreateBox("jarlPeltSide", {
      width: shoulderW * P.drape, height: drapeH, depth: D * P.drapeDeep,
    }, scene), fur, body.torso);
    panel.position.set(side * shoulderW * P.drapeOut, top - mantleH * 0.9 - drapeH * 0.5, chest.position.z + D * 0.3);
    panel.rotation.z = side * 0.05;
    for (let k = 0; k < P.tufts; k++) {
      const tuft = put(MeshBuilder.CreateCylinder("jarlPeltTuft", {
        height: H * P.tuft, diameterTop: shoulderW * P.drape * 0.7, diameterBottom: 0, tessellation: 4,
      }, scene), darkFur, body.torso);
      tuft.position.set(
        side * shoulderW * P.drapeOut + (k - (P.tufts - 1) / 2) * shoulderW * P.drape * 0.4,
        top - mantleH * 0.9 - drapeH - H * P.tuft * 0.4,
        chest.position.z + D * 0.3,
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
 *   mask: a team plate over the lower face from just under the eyes (.maskTop H) to the chin (.maskBottom H), .maskWide W wide and .maskDepth D deep, stood
 *   a hair proud of the face; a cheek guard down each side of it (.cheek W wide, .cheekTop H up) so the jaw is boxed in;
 *   nasal: a dark strip from the brow band down between the eyes to the mask's top, .nasal W wide, stood .nasalProud D proud, so the eye slots read as two
 *   holes either side of it. Team cloth self-lit .glow (LESSONS: metal reads near black under swiftshader).
 */
const BRAWLER_HELM = {
  domeWide: 1.14, domeTall: 0.7, domeRise: 0.5, domeSlice: 0.6,
  band: 0.14, bandProud: 1.08, eyeTop: 0.42,
  maskTop: -0.18, maskBottom: -1.02, maskWide: 1.03, maskDepth: 1.04, maskProud: 0.06,
  cheek: 0.16, cheekTop: 0.3, cheekDeep: 0.92, cheekOut: 1.0,
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
      width: e.x * B.cheek, height: (B.cheekTop - B.maskBottom) * e.y, depth: 2 * e.z * B.cheekDeep,
    }, scene), dark);
    cheek.position.set(side * e.x * (B.maskWide + B.cheek * 0.35), e.y * (B.cheekTop + B.maskBottom) * 0.5, 0);
  }
  // the nasal: from the brow band down between the eyes onto the mask
  const nasal = put(MeshBuilder.CreateBox("brawlerHelmNasal", {
    width: 2 * e.x * B.nasal * 0.5, height: (B.eyeTop - B.nasalLow) * e.y, depth: e.z * B.nasalProud,
  }, scene), leather);
  nasal.position.set(0, e.y * (B.eyeTop + B.nasalLow) * 0.5, e.z * 0.98);
  return out;
}
