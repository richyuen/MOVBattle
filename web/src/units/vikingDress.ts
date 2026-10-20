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
 * [S] the Jarl's bear pelt (393; viking.jarl.red.png, viking.jarl.jpg, card "most notable": a bear-head hood over his helm with two googly eyes and
 * teeth, the brown fur draping to the hips; critic 392: no pelt, a blue horned helm over a barrel torso). The horned helm is off and a bear's skin is on:
 *   skull: a wide flat fur block over the crown, .skull of the head across and .skullTall of it high, its middle .skullRise up;
 *   muzzle: a narrow lighter fur block out of the skull's front over his brow, .muzzle of the head across and .muzzleLong of its depth long, tipped down
 *   .muzzleDrop, a dark nose on its tip;
 *   eyes: two pale googly eyes .eye of the head across, set wide .eyeOut either side at the skull's front .eyeUp up, a black pupil .pupil of the eye;
 *   teeth: .teeth white teeth under the muzzle's tip;
 *   ears: two fur balls .ear of the head at the skull's top corners;
 *   side fur: a panel down each side of his own face from the skull past the jaw, .side of the head across;
 * and, hung from the torso: a fur mantle over both shoulders, a drape panel off each shoulder to the hips, a back panel over the spine, each ending in
 * jagged fur tufts. Fur self-lit .glow so the hood does not read grey under its own overhang.
 */
const JARL_PELT = {
  skull: 1.1, skullTall: 0.3, skullRise: 1.08, muzzle: 0.3, muzzleTall: 0.22, muzzleAhead: 1.34, muzzleLong: 1.8, muzzleDrop: 0.25,
  eye: 0.16, eyeUp: 1.3, eyeOut: 0.5, pupil: 0.42, teeth: 3, tooth: 0.14, ear: 0.22, earOut: 0.72, earUp: 0.32,
  side: 0.3, sideDrop: 1.3, sideOut: 0.92, sideAhead: 0.02,
  drape: 0.12, drapeOut: 0.56, drapeDrop: 0.78, drapeDeep: 0.55, back: 0.85, backDeep: 0.14, tufts: 3, tuft: 0.18, glow: 0.2,
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
  // the skull: a wide flat block over his crown
  const skull = put(MeshBuilder.CreateBox("jarlBearSkull", {
    width: e.x * 2 * P.skull, height: e.y * 2 * P.skullTall, depth: e.z * 2 * P.skull,
  }, scene), fur, body.headMesh);
  skull.position.set(0, e.y * P.skullRise, 0);
  // the muzzle: a narrow snout out of the skull's front, tipped down, with a dark nose on its tip
  const muzzle = put(MeshBuilder.CreateBox("jarlBearMuzzle", {
    width: e.x * 2 * P.muzzle, height: e.y * 2 * P.muzzleTall, depth: e.z * P.muzzleLong,
  }, scene), muzzleMat, body.headMesh);
  muzzle.position.set(0, e.y * (P.skullRise - 0.08), e.z * P.muzzleAhead);
  muzzle.rotation.x = P.muzzleDrop;
  const nose = put(MeshBuilder.CreateBox("jarlBearNose", {
    width: e.x * 2 * P.muzzle * 0.8, height: e.y * P.muzzleTall * 1.1, depth: e.z * 0.22,
  }, scene), pupilMat, body.headMesh);
  nose.position.set(0, e.y * (P.skullRise - 0.24), e.z * (P.muzzleAhead + P.muzzleLong * 0.48));
  // the googly eyes set wide on the skull's front, and the ears on its top corners
  for (const side of [-1, 1]) {
    const eye = put(MeshBuilder.CreateIcoSphere("jarlBearEye", { radius: e.x * P.eye, subdivisions: 2 }, scene), bone, body.headMesh, false);
    eye.position.set(side * e.x * P.eyeOut, e.y * P.eyeUp, e.z * 0.46);
    const pupil = put(MeshBuilder.CreateIcoSphere("jarlBearPupil", { radius: e.x * P.eye * P.pupil, subdivisions: 1 }, scene), pupilMat, body.headMesh, false);
    pupil.position.set(side * e.x * P.eyeOut, e.y * P.eyeUp, e.z * 0.46 + e.x * P.eye * 0.8);
    const ear = put(MeshBuilder.CreateIcoSphere("jarlBearEar", { radius: e.x * P.ear, subdivisions: 1, flat: true }, scene), darkFur, body.headMesh);
    ear.position.set(side * e.x * P.earOut, e.y * (P.skullRise + P.earUp), -e.z * 0.1);
    // a strip of fur down the side of his face, from the skull past the jaw
    const cheek = put(MeshBuilder.CreateBox("jarlBearCheek", {
      width: e.x * P.side, height: e.y * P.sideDrop, depth: e.z * 1.25,
    }, scene), fur, body.headMesh);
    cheek.position.set(side * e.x * P.sideOut, -e.y * 0.15, e.z * P.sideAhead);
    cheek.rotation.z = side * 0.05;
  }
  for (let i = 0; i < P.teeth; i++) {
    const tooth = put(MeshBuilder.CreateCylinder("jarlBearTooth", {
      height: e.y * P.tooth, diameterTop: 0, diameterBottom: e.x * 0.13, tessellation: 4,
    }, scene), bone, body.headMesh);
    tooth.position.set((i - (P.teeth - 1) / 2) * e.x * 0.3, e.y * (P.skullRise - 0.44), e.z * (P.muzzleAhead + P.muzzleLong * 0.3));
    tooth.rotation.z = Math.PI;
  }
  // the drape: a mantle over both shoulders, a panel off each shoulder to the hips, and one over the spine, ending in fur tufts
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const top = chest.position.y + H * 0.5;
  const shoulderW = body.metrics.shoulderWidth ?? W * 1.3;
  const drapeH = H * P.drapeDrop;
  for (const side of [-1, 1]) {
    const panel = put(MeshBuilder.CreateBox("jarlPeltSide", {
      width: shoulderW * P.drape, height: drapeH, depth: D * P.drapeDeep,
    }, scene), fur, body.torso);
    panel.position.set(side * shoulderW * P.drapeOut, top - drapeH * 0.5 - H * 0.02, chest.position.z + D * 0.2);
    for (let k = 0; k < P.tufts; k++) {
      const tuft = put(MeshBuilder.CreateCylinder("jarlPeltTuft", {
        height: H * P.tuft, diameterTop: shoulderW * P.drape * 0.6, diameterBottom: 0, tessellation: 4,
      }, scene), darkFur, body.torso);
      tuft.position.set(
        side * shoulderW * P.drapeOut + (k - (P.tufts - 1) / 2) * shoulderW * P.drape * 0.4,
        top - drapeH - H * 0.02 - H * P.tuft * 0.4,
        chest.position.z + D * 0.2,
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
