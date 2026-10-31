import { Scene, Color3, Mesh, MeshBuilder, TransformNode, Vector3, VertexData, type Node } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { eyeSpanInHead } from "./dynastyDress";

/*
 * Spooky dress (units/spooky.*): per-unit cloth, hair and ornaments, built per unit id by unitFactory. Sized off the body's own joints and meshes.
 */

/*
 * [S] 434 the Vampire's Hungry Hands (audit 434 vampire b.1: "hands hold two dark shuriken stars - TABS: empty clawed team hands";
 * spooky.vampire.red.png, card Main/Off Hand "Hungry Hand, Unarmed": no weapon, each hand a big team-skin fist held up at the belly, its fingers
 * curled forward into hooks). VAMPIRE_CLAWS, in each hand mesh's frame (its box hb, the arm running down -y): the mitt grown .grow; .fingers hooks
 * along its width, each a knuckle segment .knuckle of the mitt tall from the mitt's foot, bent .curl rad forward into a tip .tip of the mitt long, a
 * dark nail .nail of the finger long at the tip. Skin is the hand's own material; nails self-lit .glow.
 */
const VAMPIRE_CLAWS = {
  grow: 1.3, fingers: 4, thick: 0.2, knuckle: 0.5, tip: 0.45, curl: 1.1, nail: 0.35, glow: 0.12,
  dark: new Color3(0.12, 0.05, 0.06),
};

/** Empty clawed hands: the mitt grown and hooked fingers curled forward (spec at VAMPIRE_CLAWS). */
export function vampireClaws(scene: Scene, body: ArticulatedBody): Mesh[] {
  const V = VAMPIRE_CLAWS;
  const nailMat = getMaterialFactory().get("cloth", V.dark, { emissive: V.dark.scale(V.glow) });
  const out: Mesh[] = [];
  for (const hand of [body.leftHand, body.rightHand]) {
    const mitt = hand.getChildMeshes(true).find((m) => /_[lr]HandM$/.test(m.name)) as Mesh | undefined;
    if (!mitt) continue;
    mitt.scaling.scaleInPlace(V.grow);
    mitt.computeWorldMatrix(true);
    const hb = mitt.getBoundingInfo().boundingBox, ex = hb.extendSize;
    const sx = mitt.scaling.x, sy = mitt.scaling.y, sz = mitt.scaling.z;
    // in the hand joint's frame: the mitt's box scaled by its own scaling about its position
    const w = ex.x * 2 * sx, h = ex.y * 2 * sy, d = ex.z * 2 * sz;
    const cx = mitt.position.x + hb.center.x * sx, footY = mitt.position.y + (hb.center.y - ex.y) * sy, cz = mitt.position.z + hb.center.z * sz;
    const t = w * V.thick;
    for (let i = 0; i < V.fingers; i++) {
      const x = cx - w / 2 + t / 2 + ((w - t) * i) / (V.fingers - 1);
      const knuckle = new TransformNode("vampireClawKnuckle", scene);
      knuckle.parent = hand;
      knuckle.position.set(x, footY + h * 0.08, cz + d * 0.15);
      const seg1 = MeshBuilder.CreateBox("vampireClaw", { width: t, height: h * V.knuckle, depth: t }, scene);
      seg1.parent = knuckle;
      seg1.position.y = -h * V.knuckle / 2;
      const bend = new TransformNode("vampireClawBend", scene);
      bend.parent = knuckle;
      bend.position.y = -h * V.knuckle;
      bend.rotation.x = -V.curl;
      const seg2 = MeshBuilder.CreateBox("vampireClawTip", { width: t * 0.85, height: h * V.tip, depth: t * 0.85 }, scene);
      seg2.parent = bend;
      seg2.position.y = -h * V.tip / 2;
      const nail = MeshBuilder.CreateCylinder("vampireClawNail", { height: h * V.tip * V.nail, diameterTop: 0, diameterBottom: t * 0.8, tessellation: 4 }, scene);
      nail.parent = bend;
      nail.rotation.x = Math.PI;
      nail.position.y = -h * V.tip - h * V.tip * V.nail / 2;
      for (const m of [seg1, seg2]) { m.material = mitt.material; m.convertToFlatShadedMesh(); out.push(m); }
      nail.material = nailMat;
      nail.convertToFlatShadedMesh();
      out.push(nail);
    }
  }
  return out;
}

/*
 * [S] 437 the Vampire's Bat Transformation (audit 434 vampire c.1: "swoop in unit_spooky.vampire_ability is the man running with stars in his hands -
 * TABS: turns into a bat with his hairstyle and flies to the enemy"; card Abilities "it transforms into a bat with the same hairstyle, and flies towards
 * the nearest enemy (much like the Scarecrow's crows). Once close to the enemy, it transforms back"). A bat built hidden on his root; RuntimeUnit
 * swaps it in for his whole body while a swoop carries him (startBatForm, cleared on landing) and beats its wings. VAMPIRE_BAT, in the root's frame
 * (h his height, +z his front): a team body .body of h long at .at of h up, a team head .head of h across ahead of it with two pointed ears .ear of h
 * tall, his dark brown slicked hair a swept cap over the head's crown and back, two white bead eyes with dark pupils; each wing a membrane .span of h
 * out from the shoulder, its trailing edge scalloped between .fingers finger bones, in dark team (.dark of it), flapping .beat rad about .lift.
 */
const VAMPIRE_BAT = {
  at: 0.55, body: 0.3, head: 0.2, ear: 0.1, span: 0.7, fingers: 3, dark: 0.35, glow: 0.16, beat: 0.75, lift: 0.25, rate: 20,
  hair: new Color3(0.12, 0.065, 0.035), eye: new Color3(0.95, 0.95, 0.92), pupil: new Color3(0.03, 0.03, 0.03),
};
export const VAMPIRE_BAT_NODE = "vampireBat";
export const VAMPIRE_BAT_WING = "vampireBatWing";

/** The Vampire's bat form, built hidden on his root (spec at VAMPIRE_BAT); RuntimeUnit shows it during a swoop. */
export function vampireBat(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const V = VAMPIRE_BAT;
  const f = getMaterialFactory();
  const team = f.get("cloth", teamColor, { emissive: teamColor.scale(V.glow) });
  const darkC = teamColor.scale(V.dark);
  const wingMat = f.get("cloth", darkC, { emissive: darkC.scale(V.glow) });
  const hairMat = f.get("cloth", V.hair, { emissive: V.hair.scale(0.12) });
  const eyeMat = f.get("unlit", V.eye, { emissive: V.eye });
  const pupilMat = f.get("cloth", V.pupil, { emissive: V.pupil });
  const h = body.metrics.overallHeight;
  const bat = new TransformNode(VAMPIRE_BAT_NODE, scene);
  bat.parent = body.root;
  bat.position.y = h * V.at;
  const out: Mesh[] = [];
  const put = (m: Mesh, parent: TransformNode, mat: typeof team, flat = true): Mesh => {
    m.parent = parent;
    m.material = mat;
    if (flat) m.convertToFlatShadedMesh();
    m.isPickable = false;
    out.push(m);
    return m;
  };
  const trunk = put(MeshBuilder.CreateSphere("vampireBatBody", { diameterX: h * V.body * 0.6, diameterY: h * V.body * 0.55, diameterZ: h * V.body, segments: 4 }, scene), bat, team);
  trunk.position.z = -h * V.body * 0.1;
  const head = put(MeshBuilder.CreateSphere("vampireBatHead", { diameter: h * V.head, segments: 4 }, scene), bat, team);
  head.position.set(0, h * V.head * 0.25, h * V.body * 0.45);
  for (const side of [-1, 1]) {
    const ear = put(MeshBuilder.CreateCylinder("vampireBatEar", { height: h * V.ear, diameterTop: 0, diameterBottom: h * V.ear * 0.6, tessellation: 4 }, scene), head, team);
    ear.position.set(side * h * V.head * 0.28, h * V.head * 0.5, -h * V.head * 0.05);
    ear.rotation.z = -side * 0.35;
    const eye = put(MeshBuilder.CreateSphere("vampireBatEye", { diameter: h * V.head * 0.36, segments: 6 }, scene), head, eyeMat, false);
    eye.position.set(side * h * V.head * 0.2, h * V.head * 0.08, h * V.head * 0.4);
    const pupil = put(MeshBuilder.CreateSphere("vampireBatPupil", { diameter: h * V.head * 0.14, segments: 4 }, scene), head, pupilMat, false);
    pupil.position.set(side * h * V.head * 0.2, h * V.head * 0.08, h * V.head * 0.57);
  }
  // his slicked-back hair: a swept cap over the crown, running back off the head
  const hair = put(MeshBuilder.CreateSphere("vampireBatHair", { diameterX: h * V.head * 1.04, diameterY: h * V.head * 0.55, diameterZ: h * V.head * 1.25, segments: 4 }, scene), head, hairMat);
  hair.position.set(0, h * V.head * 0.32, -h * V.head * 0.12);
  hair.rotation.x = -0.25;
  // the wings: a scalloped membrane between finger bones, hinged at the shoulder
  for (const side of [-1, 1]) {
    const hinge = new TransformNode(VAMPIRE_BAT_WING, scene);
    hinge.parent = bat;
    hinge.position.set(side * h * V.body * 0.22, h * V.body * 0.12, 0);
    const S = h * V.span;
    // the outline in the hinge's frame (x out along the wing, z its front): the leading edge, then the scalloped trailing edge back in
    const pts: [number, number][] = [[0, h * 0.04], [S * 0.45, h * 0.1], [S, h * 0.02]];
    for (let k = V.fingers; k >= 1; k--) {
      const x = S * (k / (V.fingers + 1) + 0.12);
      pts.push([x, -h * 0.2], [x - S * 0.12, -h * 0.12]);
    }
    pts.push([0, -h * 0.1]);
    const pos: number[] = [], idx: number[] = [];
    // two faces a little apart (a thin closed slab, not one double-sided sheet)
    for (const [face, dy] of [[1, h * 0.006], [-1, -h * 0.006]] as const) {
      const base = pos.length / 3;
      pos.push(0, dy, -h * 0.03);
      for (const [x, z] of pts) pos.push(side * x, dy, z);
      for (let i = 1; i < pts.length; i++) {
        const a = base, b = base + i, c = base + i + 1;
        if ((face * side) > 0) idx.push(a, c, b); else idx.push(a, b, c);
      }
    }
    const wing = new Mesh("vampireBatMembrane", scene);
    const vd = new VertexData();
    vd.positions = pos;
    vd.indices = idx;
    const normals: number[] = [];
    VertexData.ComputeNormals(pos, idx, normals);
    vd.normals = normals;
    vd.applyToMesh(wing);
    put(wing, hinge, wingMat);
    for (let k = 1; k <= V.fingers; k++) {
      const x = S * (k / (V.fingers + 1) + 0.12);
      const len = Math.hypot(x, h * 0.2);
      const bone = put(MeshBuilder.CreateBox("vampireBatFinger", { width: len, height: h * 0.018, depth: h * 0.018 }, scene), hinge, team);
      bone.position.set(side * x / 2, 0, -h * 0.08);
      bone.rotation.y = side * Math.atan2(h * 0.2, x) * 0.6;
    }
    hinge.rotation.z = side * V.lift;
  }
  bat.setEnabled(false);
  return out;
}

/** The bat's wing beat at `t` seconds (rad about the shoulder hinge, signed per side by the caller). */
export function vampireBatBeat(t: number): number {
  return VAMPIRE_BAT.lift + VAMPIRE_BAT.beat * Math.sin(t * VAMPIRE_BAT.rate);
}

/*
 * [S] 438 the Vampire's slicked-back hair (audit 434 vampire a.1: "head is bald team - TABS: dark brown slicked-back hair"; spooky.vampire.red.png,
 * card Appearance "slicked back hair": a dark brown cap from just over the bead eyes up over the crown, standing well above the head and swept back
 * into a ridge that runs down the back of the skull to the nape, a widow's peak pointing down onto the brow between the eyes, the temples covered
 * behind the eyes). VAMPIRE_HAIR, in the head's own box (e its half sizes): the cap .out of the head wide and deep from .clear over the eyes' top to
 * .crown of e.y over the head's top; on it the swept mass .sweep of e.y tall, leaning back .lean rad and set .back of e.z behind the middle; the peak
 * a three-sided point .peak of e.x wide hanging .peakDrop of e.y down the brow, standing .proud off the face; temples .side of e.x thick from the
 * fringe down to .sideTo of the eye span, from the back to .front of e.z; the back panel down to .nape of e.y. The bat's dark brown, self-lit .glow.
 */
const VAMPIRE_HAIR = { out: 1.12, clear: 0.04, crown: 0.12, sweep: 0.42, lean: 0.4, back: 0.25, peak: 0.5, peakDrop: 0.3, proud: 0.04, side: 0.14, sideTo: 0.5, front: 0.35, nape: -0.7, glow: 0.12 };

/** Dark brown slicked-back hair on the man, as on his bat (spec at VAMPIRE_HAIR). */
export function vampireHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const V = VAMPIRE_HAIR;
  const hair = getMaterialFactory().get("cloth", VAMPIRE_BAT.hair, { emissive: VAMPIRE_BAT.hair.scale(V.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const span = eyeSpanInHead(body) ?? [c.y - e.y * 0.2, c.y + e.y * 0.3];
  const X = e.x * V.out, Z = e.z * V.out;
  const fringe = span[1] + e.y * V.clear, top = bb.maximum.y + e.y * V.crown;
  const out: Mesh[] = [];
  const put = (m: Mesh): Mesh => {
    m.parent = head;
    m.material = hair;
    m.convertToFlatShadedMesh();
    m.isPickable = false;
    out.push(m);
    return m;
  };
  const slab = (name: string, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: x1 - x0, height: y1 - y0, depth: z1 - z0 }, scene);
    m.position.set(c.x + (x0 + x1) / 2, (y0 + y1) / 2, c.z + (z0 + z1) / 2);
    return put(m);
  };
  // the cap over the crown, its front edge the hairline just over the eyes
  slab("vampireHairCap", -X, X, fringe, top, -Z, Z);
  // the swept mass: a tall ridge on the crown leaning back off the brow, narrower than the cap
  const sweepH = e.y * V.sweep;
  const sweep = MeshBuilder.CreateBox("vampireHairSweep", { width: X * 1.7, height: sweepH, depth: Z * 1.5 }, scene);
  sweep.position.set(c.x, top + sweepH * 0.3, c.z - e.z * V.back);
  sweep.rotation.x = -V.lean;
  put(sweep);
  // the widow's peak: a point down onto the brow between the eyes
  const peak = MeshBuilder.CreateCylinder("vampireHairPeak", { height: e.y * V.peakDrop, diameterTop: e.x * V.peak, diameterBottom: 0, tessellation: 3 }, scene);
  peak.scaling.z = 0.35;
  peak.rotation.y = Math.PI;
  peak.position.set(c.x, fringe - e.y * V.peakDrop * 0.4, c.z + Z + e.z * V.proud);
  put(peak);
  // the temples behind the eyes
  const sideFoot = fringe - (span[1] - span[0]) * V.sideTo;
  slab("vampireHairSide", -X, -X + e.x * V.side, sideFoot, fringe, -Z, e.z * V.front);
  slab("vampireHairSide", X - e.x * V.side, X, sideFoot, fringe, -Z, e.z * V.front);
  // the back down to the nape
  slab("vampireHairBack", -X, X, c.y + e.y * V.nape, fringe, -Z, -Z + e.z * 0.32);
  return out;
}

/*
 * [S] 440 the Vampire's beard and fangs (434 vampire a.2: "face bare - TABS: dark beard with two white fangs"; spooky.vampire.red.png: a dark brown
 * beard wrapping the jaw from ear to ear, sideburns up the cheeks to the eyes' foot, its front a short pointed goatee hanging under the chin; just over
 * it at the mouth two white fangs pointing down, a fang's width apart, as long as the eyes are tall). VAMPIRE_BEARD, in the head's own box (e its half
 * sizes, eyes the bead eyes' span): the mouth line .mouth of e.y under the eyes' foot; sideburns .side of e.x thick on each cheek from the eyes' foot
 * down, from .back of e.z to the face; a jaw band round the front from .under of e.y under the head's foot up to .jawTop of e.y under the mouth line,
 * .proud of e.z off the face; the goatee a three-sided point .goatee of e.x wide hanging .drop of e.y under the band. Fangs: white cones .fang of e.x
 * across at the root, .fangLong of e.y long, .fangGap of e.x either side of the middle, .fangProud of e.z in front of the band. Hair brown self-lit .glow.
 */
const VAMPIRE_BEARD = { mouth: 0.42, side: 0.16, back: -0.1, under: 0.18, jawTop: 0.12, proud: 0.08, goatee: 0.6, drop: 0.4, fang: 0.17, fangLong: 0.34, fangGap: 0.22, fangProud: 0.14, glow: 0.12, white: new Color3(1, 0.98, 0.94) };

/** A dark brown beard round the jaw with a goatee point, two white fangs at the mouth (spec at VAMPIRE_BEARD). */
export function vampireBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  const V = VAMPIRE_BEARD;
  const f = getMaterialFactory();
  const hair = f.get("cloth", VAMPIRE_BAT.hair, { emissive: VAMPIRE_BAT.hair.scale(V.glow) });
  const white = f.get("cloth", V.white, { emissive: V.white.scale(0.35) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const span = eyeSpanInHead(body) ?? [c.y - e.y * 0.2, c.y + e.y * 0.3];
  const X = e.x * 1.06, front = bb.maximum.z;
  const mouth = span[0] - e.y * V.mouth;
  const foot = bb.minimum.y - e.y * V.under;
  const out: Mesh[] = [];
  const put = (m: Mesh, mat: typeof hair): Mesh => {
    m.parent = head;
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.isPickable = false;
    out.push(m);
    return m;
  };
  const slab = (name: string, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: x1 - x0, height: y1 - y0, depth: z1 - z0 }, scene);
    m.position.set(c.x + (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    return put(m, hair);
  };
  // sideburns down each cheek from the eyes' foot, and the jaw band round the front under the mouth
  const bandFront = front + e.z * V.proud;
  slab("vampireBeardSide", -X, -X + e.x * V.side, foot, span[0], c.z + e.z * V.back, bandFront);
  slab("vampireBeardSide", X - e.x * V.side, X, foot, span[0], c.z + e.z * V.back, bandFront);
  slab("vampireBeardJaw", -X, X, foot, mouth - e.y * V.jawTop, front - e.z * 0.5, bandFront);
  // the goatee: a point hanging under the chin
  const goatee = MeshBuilder.CreateCylinder("vampireBeardGoatee", { height: e.y * V.drop, diameterTop: e.x * V.goatee, diameterBottom: 0, tessellation: 3 }, scene);
  goatee.scaling.z = 0.5;
  goatee.rotation.y = Math.PI;
  goatee.position.set(c.x, foot - e.y * V.drop * 0.5, bandFront - e.z * 0.2);
  put(goatee, hair);
  // two white fangs at the mouth line, pointing down in front of the band
  for (const s of [-1, 1]) {
    const fang = MeshBuilder.CreateCylinder("vampireFang", { height: e.y * V.fangLong, diameterTop: e.x * V.fang, diameterBottom: 0, tessellation: 4 }, scene);
    fang.position.set(c.x + s * e.x * V.fangGap, mouth - e.y * V.fangLong * 0.5 + e.y * 0.06, bandFront + e.z * (V.fangProud - V.proud));
    put(fang, white);
  }
  return out;
}

/*
 * [S] 435 the Swordcaster's bowl haircut (audit 434 swordcaster a.1: "head is a closed purple dome with a spike, no face - TABS: team face with two
 * bead eyes under a black bowl haircut"; spooky.swordcaster.red.png: a glossy black bowl over the crown, its fringe cut straight across the brow just
 * over the bead eyes, the sides down past the eyes to about the jaw's top, the back down to the nape; the face and eyes bare team skin). SWORDCASTER_BOWL,
 * in the head's own box (e its half sizes): a crown .out of the head wide and deep from .clear over the eyes' top to .crown of e.y over the head's top;
 * a side panel each side .side of e.x thick from that fringe line down to .sideTo of e.y under the eyes' bottom, from the back to .front of e.z; a back
 * panel .back of e.z thick down to .nape of e.y. Near-black self-lit .glow so it reads black, not grey, under SSAO.
 */
const SWORDCASTER_BOWL = {
  out: 1.14, clear: 0.05, crown: 0.16, side: 0.16, sideTo: 0.15, front: 0.45, back: 0.16, nape: -0.75, glow: 0.1,
  black: new Color3(0.03, 0.03, 0.04),
};

/** A black bowl cut round the bare face, its fringe straight over the eyes (spec at SWORDCASTER_BOWL). */
export function swordcasterBowl(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = SWORDCASTER_BOWL;
  const hair = getMaterialFactory().get("cloth", B.black, { emissive: B.black.scale(B.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const span = eyeSpanInHead(body) ?? [c.y - e.y * 0.2, c.y + e.y * 0.3];
  const X = e.x * B.out, Z = e.z * B.out;
  const fringe = span[1] + e.y * B.clear, top = bb.maximum.y + e.y * B.crown;
  const out: Mesh[] = [];
  const slab = (name: string, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): void => {
    const m = MeshBuilder.CreateBox(name, { width: x1 - x0, height: y1 - y0, depth: z1 - z0 }, scene);
    m.position.set(c.x + (x0 + x1) / 2, (y0 + y1) / 2, c.z + (z0 + z1) / 2);
    m.parent = head;
    m.material = hair;
    m.convertToFlatShadedMesh();
    out.push(m);
  };
  // the crown, its front edge the straight fringe over the eyes
  slab("swordcasterBowlCrown", -X, X, fringe, top, -Z, Z);
  // the sides down past the eyes, behind the face's front
  const sideFoot = span[0] - e.y * B.sideTo;
  slab("swordcasterBowlSide", -X, -X + e.x * B.side, sideFoot, fringe, -Z, e.z * B.front);
  slab("swordcasterBowlSide", X - e.x * B.side, X, sideFoot, fringe, -Z, e.z * B.front);
  // the back down to the nape
  slab("swordcasterBowlBack", -X, X, c.y + e.y * B.nape, fringe, -Z, -Z + e.z * B.back * 2);
  return out;
}

/*
 * [S] 436 the Swordcaster's locked cuirass (audit 434 swordcaster a.2: "torso grey-team, no cuirass - TABS: black locked cuirass with a padlock on the
 * chest and team studs"; spooky.swordcaster.red.png, card Appearance "a locked, heavy cuirass": a charcoal plate vest from the collar to the waist,
 * broader than the trunk, its front ridged down the middle, a ring of round team studs over the shoulders and down the front edges, a grey chain from
 * either side of the collar meeting at a big grey padlock on the upper chest, a dark keyhole in it). SWORDCASTER_CUIRASS, in the torso mesh's box (e its
 * half sizes): the shell .out of the trunk wide, .deep of it deep, from .top over the trunk's top to .foot of e.y under its middle; a front ridge, a
 * four-sided prism .ridge of e.x across standing .proud off the shell; .studs studs each side .stud of e.x across; the padlock .lock of e.x wide at .lockY
 * of e.y, its shackle a torus above it; the chain two bars from the collar's sides to the shackle. Charcoal self-lit .glow so it reads black, not a hole.
 */
const SWORDCASTER_CUIRASS = {
  out: 1.16, deep: 1.22, top: 0.04, foot: -0.75, ridge: 0.5, proud: 0.12, studs: 4, stud: 0.16, lock: 0.42, lockY: 0.3, glow: 0.12,
  plate: new Color3(0.05, 0.05, 0.06), grey: new Color3(0.42, 0.4, 0.37), hole: new Color3(0.04, 0.03, 0.03),
};

/** A charcoal plate cuirass with team studs and a chained grey padlock on the chest (spec at SWORDCASTER_CUIRASS). */
export function swordcasterCuirass(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const C = SWORDCASTER_CUIRASS;
  const f = getMaterialFactory();
  const plate = f.get("cloth", C.plate, { emissive: C.plate.scale(C.glow) });
  const grey = f.get("cloth", C.grey, { emissive: C.grey.scale(0.15) });
  const hole = f.get("cloth", C.hole, { emissive: C.hole.scale(0.1) });
  const team = f.get("cloth", teamColor, { emissive: teamColor.scale(0.15) });
  const torso = body.torsoMesh;
  const bb = torso.getBoundingInfo().boundingBox, e = bb.extendSize, c = bb.center;
  const out: Mesh[] = [];
  const add = (m: Mesh, material: typeof plate): Mesh => {
    m.parent = torso;
    m.material = material;
    m.convertToFlatShadedMesh();
    m.isPickable = false;
    out.push(m);
    return m;
  };
  const yTop = bb.maximum.y + e.y * C.top, yFoot = c.y + e.y * C.foot;
  const X = e.x * C.out, Z = e.z * C.deep;
  const shell = add(MeshBuilder.CreateBox("swordcasterCuirass", { width: X * 2, height: yTop - yFoot, depth: Z * 2 }, scene), plate);
  shell.position.set(c.x, (yTop + yFoot) / 2, c.z);
  // the ridged front: a four-sided prism lying up the chest, its edge toward the viewer
  const ridge = add(MeshBuilder.CreateCylinder("swordcasterCuirassRidge", { height: (yTop - yFoot) * 0.92, diameter: e.x * C.ridge * 2, tessellation: 4 }, scene), plate);
  ridge.scaling.z = C.proud * 2 / C.ridge;
  ridge.position.set(c.x, (yTop + yFoot) / 2, c.z + Z);
  // team studs: over each shoulder and down each front edge
  for (const side of [-1, 1]) {
    for (let i = 0; i < C.studs; i++) {
      const stud = add(MeshBuilder.CreateSphere("swordcasterStud", { diameter: e.x * C.stud, segments: 3 }, scene), team);
      const t = i / (C.studs - 1);
      // the first two on the shoulder top, then down the front edge
      if (i < 2) stud.position.set(c.x + side * X * (0.45 + 0.35 * i), yTop + e.x * C.stud * 0.2, c.z + Z * (0.2 - 0.3 * i));
      else stud.position.set(c.x + side * X * 0.82, yTop - (yTop - yFoot) * (0.15 + 0.5 * t), c.z + Z + e.x * C.stud * 0.25);
    }
  }
  // the padlock on the upper chest, proud of the ridge, and its shackle over it
  const lockW = e.x * C.lock, lockY = c.y + e.y * C.lockY, lockZ = c.z + Z + e.z * C.proud * 1.6;
  const lock = add(MeshBuilder.CreateBox("swordcasterPadlock", { width: lockW, height: lockW * 1.05, depth: lockW * 0.45 }, scene), grey);
  lock.position.set(c.x, lockY, lockZ);
  const keyhole = add(MeshBuilder.CreateBox("swordcasterKeyhole", { width: lockW * 0.18, height: lockW * 0.45, depth: lockW * 0.1 }, scene), hole);
  keyhole.position.set(c.x, lockY - lockW * 0.05, lockZ + lockW * 0.24);
  const shackle = add(MeshBuilder.CreateTorus("swordcasterShackle", { diameter: lockW * 0.7, thickness: lockW * 0.14, tessellation: 10 }, scene), grey);
  shackle.rotation.x = Math.PI / 2;
  shackle.position.set(c.x, lockY + lockW * 0.6, lockZ);
  // the chain from either side of the collar down to the shackle
  for (const side of [-1, 1]) {
    const from = new Vector3(c.x + side * X * 0.42, yTop, c.z + Z * 0.8);
    const to = new Vector3(c.x + side * lockW * 0.2, lockY + lockW * 0.85, lockZ);
    const d = to.subtract(from);
    const bar = add(MeshBuilder.CreateBox("swordcasterChain", { width: lockW * 0.12, height: d.length(), depth: lockW * 0.12 }, scene), grey);
    bar.position.copyFrom(from.add(to).scale(0.5));
    bar.rotation.z = -Math.atan2(d.x, d.y);
    bar.rotation.x = Math.atan2(d.z, Math.hypot(d.x, d.y));
  }
  return out;
}

/** A node's position read into another node's frame (world matrices settled up both chains first). */
function inFrameOf(n: TransformNode, frame: TransformNode): Vector3 {
  for (const leaf of [n, frame]) {
    const chain: Node[] = [];
    for (let k: Node | null = leaf; k; k = k.parent) chain.unshift(k);
    for (const k of chain) if (k instanceof TransformNode) k.computeWorldMatrix(true);
  }
  return Vector3.TransformCoordinates(n.getAbsolutePosition(), frame.getWorldMatrix().clone().invert());
}

/*
 * [S] 437 the Swordcaster's tunic skirt (audit 434 swordcaster a.3: "hips bare - TABS: team tunic skirt with dark stripes to mid-thigh";
 * spooky.swordcaster.blue.png, .red.png, card Appearance "fantasy prison clothes": under the cuirass's foot a team tunic skirt flares out like a short
 * four-sided bell, from the waist to about the middle of the thigh, a little wider than the hips at the hem, two darker team stripes running down its
 * front and its back either side of the middle). SWORDCASTER_SKIRT, in the torso joint's frame (W, D the trunk's width and depth before any cuirass):
 * a four-sided frustum from .top of the trunk's height over its foot down .hem of the way from there to the knees, .out of W across at the top and
 * .flare of that at the hem, .deep of D deep; .stripes stripes each side of the middle at .stripeAt of the half width, .stripe of W wide, a darker
 * team (.dark of it) standing .proud off the faces, front and back. Team cloth self-lit .glow.
 * 437 look: the skirt in the body's own team shade read as the pale legs and hid behind the lockbox: the cloth is now a mid team shade (.shade of it),
 * longer (.hem .55 -> .8) and wider at the hem (.flare 1.32 -> 1.5) so it stands out past the box's sides and below it.
 */
const SWORDCASTER_SKIRT = { top: 0.12, hem: 0.8, out: 1.1, flare: 1.5, deep: 1.25, stripes: 1, stripeAt: 0.5, stripe: 0.12, shade: 0.6, dark: 0.3, proud: 0.025, glow: 0.14 };

/** A flared team tunic skirt from the waist to mid-thigh with dark stripes down it (spec at SWORDCASTER_SKIRT). */
export function swordcasterSkirt(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = SWORDCASTER_SKIRT;
  const f = getMaterialFactory();
  const midC = teamColor.scale(S.shade);
  const cloth = f.get("cloth", midC, { emissive: midC.scale(S.glow) });
  const darkC = teamColor.scale(S.dark);
  const dark = f.get("cloth", darkC, { emissive: darkC.scale(S.glow) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const frame = tm.parent as TransformNode;
  const kneeY = (inFrameOf(body.leftKnee, frame).y + inFrameOf(body.rightKnee, frame).y) / 2;
  const top = cy - H / 2 + H * S.top, hem = top - (top - kneeY) * S.hem, long = top - hem;
  // half widths of the four flat faces at the top and the hem
  const xTop = W * S.out / 2, xHem = xTop * S.flare, zTop = D * S.deep / 2, zHem = zTop * S.flare;
  const out: Mesh[] = [];
  const skirt = MeshBuilder.CreateCylinder("swordcasterSkirt", { height: long, diameterTop: xTop * 2 * Math.SQRT2, diameterBottom: xHem * 2 * Math.SQRT2, tessellation: 4 }, scene);
  skirt.rotation.y = Math.PI / 4;
  skirt.bakeCurrentTransformIntoVertices();
  skirt.scaling.z = zTop / xTop;
  skirt.convertToFlatShadedMesh();
  skirt.parent = frame;
  skirt.position.set(cx, (top + hem) / 2, cz);
  skirt.material = cloth;
  skirt.isPickable = false;
  out.push(skirt);
  // the stripes lie on the front and back faces, leaning out with the flare
  const lean = Math.atan2(zHem - zTop, long);
  for (const face of [-1, 1]) {
    for (let i = 0; i < S.stripes; i++) for (const side of [-1, 1]) {
      const at = side * S.stripeAt * (i + 1) / S.stripes;
      const stripe = MeshBuilder.CreateBox("swordcasterSkirtStripe", { width: W * S.stripe, height: long / Math.cos(lean) * 0.98, depth: W * S.proud * 2 }, scene);
      stripe.parent = frame;
      stripe.position.set(cx + at * (xTop + xHem) / 2, (top + hem) / 2, cz + face * ((zTop + zHem) / 2 + W * S.proud * 0.6));
      stripe.rotation.x = face * lean;
      stripe.rotation.z = -at * Math.atan2(xHem - xTop, long);
      stripe.material = dark;
      stripe.convertToFlatShadedMesh();
      stripe.isPickable = false;
      out.push(stripe);
    }
  }
  return out;
}

/** The skeleton's built-in round hood (unitFactory dressSkeleton), hidden when a unit wears its own headgear. */
function hideSkeletonHood(body: ArticulatedBody): void {
  for (const m of body.headMesh.getChildMeshes(true)) if (/_hood$/.test(m.name)) { m.isVisible = false; m.setEnabled(false); }
}

/*
 * [S] 437 the Skeleton Warrior's Roman helmet (audit 434 skeleton_warrior a.1: "helmet is a small round skullcap on top of the skull - TABS: Roman-style
 * team helmet whose cheek guards hang down both sides of the skull to the jaw"; spooky.skeleton_warrior.red.png, card Appearance "a Roman-style helmet":
 * a team bowl over the whole crown down to a brow line just over the bead eyes, a long cheek guard each side hanging from it past the eye sockets to
 * below the jaw, a little flared and forward to the cheekbones, and a short neck guard flaring out behind). STIFFY_HELMET, in the head block's box
 * (e its half sizes): the bowl .out of the head wide and deep from .clear over the eyes' top to .crown over the head's top, its top a smaller .cap
 * block; cheek guards .cheek of e.x thick from the brow down to .jaw of e.y under the head's foot, from the back to .front of e.z, splayed .splay rad;
 * the neck guard .neck of e.z thick at the back down to .nape of e.y, kicked out .kick rad. Team cloth self-lit .glow.
 */
const STIFFY_HELMET = { out: 1.16, clear: 0.06, crown: 0.14, cap: 0.82, cheek: 0.2, jaw: 0.22, front: 0.62, splay: 0.08, neck: 0.22, nape: -0.85, kick: 0.3, glow: 0.14 };

/** A team Roman helmet: a bowl to the brow, cheek guards to the jaw, a flared neck guard (spec at STIFFY_HELMET). */
export function stiffyHelmet(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const R = STIFFY_HELMET;
  hideSkeletonHood(body);
  const team = getMaterialFactory().get("cloth", teamColor, { emissive: teamColor.scale(R.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox, e = bb.extendSize, c = bb.center;
  const span = eyeSpanInHead(body) ?? [c.y - e.y * 0.2, c.y + e.y * 0.3];
  const X = e.x * R.out, Z = e.z * R.out;
  const brow = span[1] + e.y * R.clear, top = bb.maximum.y + e.y * R.crown;
  const out: Mesh[] = [];
  const slab = (name: string, w: number, h: number, d: number, x: number, y: number, z: number): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.position.set(c.x + x, y, c.z + z);
    m.parent = head;
    m.material = team;
    m.convertToFlatShadedMesh();
    m.isPickable = false;
    out.push(m);
    return m;
  };
  // the bowl over the crown, and a narrower cap on it
  slab("stiffyHelmetBowl", X * 2, top - brow, Z * 2, 0, (top + brow) / 2, 0);
  const capH = (top - brow) * 0.35;
  slab("stiffyHelmetCap", X * 2 * R.cap, capH, Z * 2 * R.cap, 0, top + capH / 2, 0);
  // the cheek guards hang from the brow past the eyes to under the jaw
  const foot = bb.minimum.y - e.y * R.jaw, depth = Z + e.z * R.front;
  for (const side of [-1, 1]) {
    const g = slab("stiffyHelmetCheek", e.x * R.cheek, brow - foot, depth, side * (X - e.x * R.cheek / 2), (brow + foot) / 2, (e.z * R.front - Z) / 2);
    g.rotation.z = side * R.splay;
  }
  // the neck guard down the back, kicked out at its foot
  const nape = c.y + e.y * R.nape;
  const n = slab("stiffyHelmetNeck", X * 2, brow - nape, e.z * R.neck, 0, (brow + nape) / 2, -Z + e.z * R.neck / 2);
  n.rotation.x = -R.kick;
  return out;
}

/*
 * [S] 437 the Skeleton Archer's hood (audit 434 skeleton_archer a.1: "headgear is a round blue skullcap - TABS: team hood around the whole skull with a
 * short shoulder capelet"; spooky.skeleton_archer.red.png, card Appearance "a rugged Archer hood with a tattered cape": a team hood closed round the
 * whole skull, over the crown to a soft point at the back of the top, its sides down past the jaw framing the face, the face and bead eyes bare in its
 * opening; from its foot a short flared team capelet over the shoulders, a ragged pentagon from collarbone to shoulder tips). SKELETON_HOOD, in the
 * head block's box (e its half sizes): the shell .out of the head wide and deep, from .jaw of e.y under the head's foot to .crown over its top, the
 * face opening a gap from .open of e.z forward; a back peak .peak of e.y tall leaning .lean rad back; the capelet in the torso joint's frame a
 * .sides-sided frustum from the neck at the trunk's top, .collar of the shoulder span across, flaring to .cape of it, .drop of the trunk's height
 * long, with .tatters points round its hem. Team cloth self-lit .glow.
 */
const SKELETON_HOOD = {
  out: 1.18, jaw: 0.3, crown: 0.16, open: 0.55, side: 0.2, peak: 0.5, lean: 0.55, sides: 7, collar: 0.4, cape: 1.12, drop: 0.24, tatters: 7, tatter: 0.12, glow: 0.14,
};

/** A team hood closed round the skull with a short ragged capelet over the shoulders (spec at SKELETON_HOOD). */
export function skeletonArcherHood(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const R = SKELETON_HOOD;
  hideSkeletonHood(body);
  const team = getMaterialFactory().get("cloth", teamColor, { emissive: teamColor.scale(R.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox, e = bb.extendSize, c = bb.center;
  const span = eyeSpanInHead(body) ?? [c.y - e.y * 0.2, c.y + e.y * 0.3];
  const X = e.x * R.out, Z = e.z * R.out;
  const top = bb.maximum.y + e.y * R.crown, foot = bb.minimum.y - e.y * R.jaw;
  const out: Mesh[] = [];
  const add = (m: Mesh, parent: TransformNode): Mesh => {
    m.parent = parent;
    m.material = team;
    m.convertToFlatShadedMesh();
    m.isPickable = false;
    out.push(m);
    return m;
  };
  const slab = (name: string, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): Mesh => {
    const m = add(MeshBuilder.CreateBox(name, { width: x1 - x0, height: y1 - y0, depth: z1 - z0 }, scene), head);
    m.position.set(c.x + (x0 + x1) / 2, (y0 + y1) / 2, c.z + (z0 + z1) / 2);
    return m;
  };
  // the crown over the eyes, the brow forward of the face like a hood's lip
  const brow = span[1] + e.y * 0.08;
  slab("skeletonHoodCrown", -X, X, brow, top, -Z, Z * 1.06);
  // the sides from the crown down past the jaw, framing the face, and the back
  slab("skeletonHoodSide", -X, -X + e.x * R.side, foot, brow, -Z, Z * R.open + e.z * 0.35);
  slab("skeletonHoodSide", X - e.x * R.side, X, foot, brow, -Z, Z * R.open + e.z * 0.35);
  slab("skeletonHoodBack", -X, X, foot, brow, -Z, -Z + e.z * 0.3);
  // the soft point at the back of the top
  const peak = add(MeshBuilder.CreateCylinder("skeletonHoodPeak", { height: e.y * R.peak * 2, diameterTop: 0, diameterBottom: X * 1.2, tessellation: 4 }, scene), head);
  peak.rotation.set(-R.lean, Math.PI / 4, 0);
  peak.scaling.z = 0.8;
  peak.position.set(c.x, top + e.y * R.peak * 0.55, c.z - Z * 0.45);
  // the capelet: a ragged frustum over the shoulders from the neck
  const torso = body.torso;
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox;
  const H = tb.extendSize.y * 2 * tm.scaling.y, topY = tm.position.y + tb.center.y * tm.scaling.y + H / 2;
  const span2 = Math.abs(body.rightShoulder.position.x - body.leftShoulder.position.x) || H * 0.8;
  const capeTop = Math.max(body.leftShoulder.position.y, body.rightShoulder.position.y, topY) + H * 0.04;
  const drop = H * R.drop;
  const cape = add(MeshBuilder.CreateCylinder("skeletonCapelet", { height: drop, diameterTop: span2 * R.collar, diameterBottom: span2 * R.cape, tessellation: R.sides }, scene), torso);
  cape.position.set(0, capeTop - drop / 2, 0);
  cape.scaling.z = 0.8;
  for (let i = 0; i < R.tatters; i++) {
    const a = ((i + 0.5) / R.tatters) * Math.PI * 2;
    const long = drop * (0.6 + 0.35 * ((i * 5) % 3) / 2);
    const t = add(MeshBuilder.CreateCylinder("skeletonCapeletTatter", { height: long, diameterTop: span2 * R.tatter * 2, diameterBottom: 0, tessellation: 3 }, scene), torso);
    t.position.set(Math.sin(a) * span2 * R.cape * 0.46, capeTop - drop - long / 2 + drop * 0.05, Math.cos(a) * span2 * R.cape * 0.46 * 0.8);
    t.rotation.y = a;
  }
  return out;
}

/*
 * [S] 438 the Skeleton Archer's belt (audit 434 skeleton_archer a.2: "blue skirt block from the ribs to mid-thigh - TABS: no skirt; bare pelvis with a
 * belt and small team tassels"; spooky.skeleton_archer.blue.png, card Appearance "... and a belt": the bone hips bare, a brown leather belt slung round
 * them with a small buckle in front, and a few short team cloth tabs hanging off it over the hips and the front, the bone thighs bare below).
 * unitFactory's dressSkeleton leaves his pelvis bone and builds no skirt. SKELETON_BELT, in the hip joint's frame (P the pelvis box, its width W):
 * the belt a band .belt of W tall, .out of the pelvis wide and deep, its top .at of the pelvis's height over the pelvis foot; a buckle .buckle of W;
 * .tabs team tassels round it at .tabAt rad from the front, each .tab of W wide and .long of W long, tapering to .taper of its width, swung .flare rad
 * out. Leather and team self-lit .glow.
 */
const SKELETON_BELT = { belt: 0.16, out: 1.12, at: 0.8, buckle: 0.2, tabs: 4, tabAt: [-0.5, 0.5, -1.6, 1.6], tab: 0.24, long: 0.42, taper: 0.55, flare: 0.18, glow: 0.14, leather: new Color3(0.3, 0.15, 0.07), brass: new Color3(0.7, 0.55, 0.2) };

/** A brown belt slung round the bare bone pelvis with short team tassels hung off it (spec at SKELETON_BELT). */
export function skeletonArcherBelt(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const B = SKELETON_BELT;
  const pelvis = body.hip.getChildMeshes(true).find((m) => /_pelvis$/.test(m.name)) as Mesh | undefined;
  if (!pelvis) return [];
  const f = getMaterialFactory();
  const leather = f.get("cloth", B.leather, { emissive: B.leather.scale(B.glow) });
  const brass = f.get("cloth", B.brass, { emissive: B.brass.scale(B.glow) });
  const team = f.get("cloth", teamColor, { emissive: teamColor.scale(B.glow) });
  const pb = pelvis.getBoundingInfo().boundingBox, pe = pb.extendSize;
  const W = pe.x * 2 * pelvis.scaling.x, D = pe.z * 2 * pelvis.scaling.z, PH = pe.y * 2 * pelvis.scaling.y;
  const cx = pelvis.position.x + pb.center.x * pelvis.scaling.x, cz = pelvis.position.z + pb.center.z * pelvis.scaling.z;
  const foot = pelvis.position.y + (pb.center.y - pe.y) * pelvis.scaling.y;
  const y = foot + PH * B.at - W * B.belt / 2;
  const out: Mesh[] = [];
  const put = (m: Mesh, mat: typeof team): Mesh => {
    m.parent = body.hip;
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.isPickable = false;
    out.push(m);
    return m;
  };
  const belt = put(MeshBuilder.CreateCylinder("skeletonBelt", { height: W * B.belt, diameter: W * B.out, tessellation: 8 }, scene), leather);
  belt.scaling.z = (D * B.out) / (W * B.out);
  belt.rotation.y = Math.PI / 8;
  belt.position.set(cx, y, cz);
  const buckle = put(MeshBuilder.CreateBox("skeletonBeltBuckle", { width: W * B.buckle, height: W * B.belt * 1.25, depth: W * 0.04 }, scene), brass);
  buckle.position.set(cx, y, cz + (D * B.out) / 2 + W * 0.015);
  const rx = (W * B.out) / 2, rz = (D * B.out) / 2;
  for (let i = 0; i < B.tabs; i++) {
    const a = B.tabAt[i % B.tabAt.length];
    const long = W * B.long * (0.85 + 0.15 * (i % 2));
    const tab = put(MeshBuilder.CreateCylinder("skeletonBeltTassel", { height: long, diameterTop: W * B.tab, diameterBottom: W * B.tab * B.taper, tessellation: 4 }, scene), team);
    tab.scaling.z = 0.22;
    tab.rotation.y = a;
    const hang = new Vector3(Math.sin(a) * rx * 1.04, y - W * B.belt * 0.3 - long / 2, Math.cos(a) * rz * 1.04);
    tab.position.set(cx + hang.x, hang.y, cz + hang.z);
    tab.rotation.x = B.flare * Math.cos(a);
    tab.rotation.z = -B.flare * Math.sin(a);
  }
  return out;
}

/*
 * [S] 439 the Skeleton Warrior's ragged shorts (audit 434 skeleton_warrior a.3: "shorts are a straight blue skirt block hung from the ribs - TABS: baggy
 * team shorts to the knee with a brown belt at the pelvis and ragged hems around each leg"; spooky.skeleton_warrior.red.png, card Appearance "ragged
 * shorts": two wide team trouser legs from the hips to just over the knee, each a loose faceted tube far wider than the thin bone thigh and a little
 * wider at the hem, its hem cut into hanging rag points; a brown belt round the top at the pelvis). unitFactory's dressSkeleton builds no skirt for him.
 * STIFFY_SHORTS, in each hip joint's frame (r the bone thigh's half width, K the knee's depth under the joint): a .sides-sided tube .out of r across
 * from .top of K over the joint down .hem of K, .flare wider at the hem, .deep as deep as wide; .rags rag points round its hem, each .rag of r wide and
 * .ragLong of K long (every other one shorter). The belt in the hip frame round the pelvis box: .belt of its width tall, .beltOut of it across, its top at
 * the pelvis top. Team and leather self-lit .glow.
 */
const STIFFY_SHORTS = { top: 0.16, hem: 0.86, out: 3.6, flare: 1.15, deep: 0.88, sides: 7, rags: 6, rag: 0.7, ragLong: 0.2, belt: 0.2, beltOut: 1.3, glow: 0.14, leather: new Color3(0.4, 0.17, 0.07) };

/** Baggy team shorts to the knee with rag-point hems and a brown belt, over the bone legs (spec at STIFFY_SHORTS). */
export function stiffyShorts(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = STIFFY_SHORTS;
  const f = getMaterialFactory();
  const team = f.get("cloth", teamColor, { emissive: teamColor.scale(S.glow) });
  const leather = f.get("cloth", S.leather, { emissive: S.leather.scale(S.glow) });
  const out: Mesh[] = [];
  const put = (m: Mesh, parent: TransformNode, mat: typeof team): Mesh => {
    m.parent = parent;
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.isPickable = false;
    out.push(m);
    return m;
  };
  for (const [joint, thigh, knee] of [[body.leftHip, body.leftUpperLeg, body.leftKnee], [body.rightHip, body.rightUpperLeg, body.rightKnee]] as const) {
    const tb = thigh.getBoundingInfo().boundingBox;
    const r = Math.max(tb.extendSize.x * thigh.scaling.x, tb.extendSize.z * thigh.scaling.z) * S.out;
    const cx = thigh.position.x + tb.center.x * thigh.scaling.x, cz = thigh.position.z + tb.center.z * thigh.scaling.z;
    const K = Math.abs(inFrameOf(knee, joint).y) || tb.extendSize.y * 2 * thigh.scaling.y;
    const top = K * S.top, hem = -K * S.hem, long = top - hem;
    const leg = put(MeshBuilder.CreateCylinder("stiffyShortsLeg", { height: long, diameterTop: r * 2, diameterBottom: r * 2 * S.flare, tessellation: S.sides }, scene), joint, team);
    leg.scaling.z = S.deep;
    leg.position.set(cx, (top + hem) / 2, cz);
    const rh = r * S.flare;
    for (let i = 0; i < S.rags; i++) {
      const a = ((i + 0.5) / S.rags) * Math.PI * 2;
      const drop = K * S.ragLong * (i % 2 ? 0.6 : 1);
      const rag = put(MeshBuilder.CreateCylinder("stiffyShortsRag", { height: drop, diameterTop: rh * S.rag, diameterBottom: 0, tessellation: 3 }, scene), joint, team);
      rag.scaling.z = 0.35;
      rag.rotation.y = a;
      rag.position.set(cx + Math.sin(a) * rh * 0.9, hem - drop / 2 + K * 0.01, cz + Math.cos(a) * rh * 0.9 * S.deep);
    }
  }
  const pelvis = body.hip.getChildMeshes(true).find((m) => /_pelvis$/.test(m.name)) as Mesh | undefined;
  if (pelvis) {
    pelvis.material = team;
    const pb = pelvis.getBoundingInfo().boundingBox, pe = pb.extendSize;
    const W = pe.x * 2 * pelvis.scaling.x, D = pe.z * 2 * pelvis.scaling.z, PH = pe.y * 2 * pelvis.scaling.y;
    const cx = pelvis.position.x + pb.center.x * pelvis.scaling.x, cz = pelvis.position.z + pb.center.z * pelvis.scaling.z;
    const ptop = pelvis.position.y + (pb.center.y + pe.y) * pelvis.scaling.y;
    const tall = Math.min(W * S.belt, PH * 0.45);
    const belt = put(MeshBuilder.CreateCylinder("stiffyShortsBelt", { height: tall, diameter: W * S.beltOut, tessellation: 8 }, scene), body.hip, leather);
    belt.scaling.z = (D * S.beltOut) / (W * S.beltOut);
    belt.rotation.y = Math.PI / 8;
    belt.position.set(cx, ptop - tall / 2, cz);
  }
  return out;
}

/*
 * [S] 440 the Skeleton Warrior's greaves (434 skeleton_warrior a.4: "greaves are grey boot boxes on the feet - TABS: team-coloured greaves over knee and
 * shin, bare bone feet below"; spooky.skeleton_warrior.blue.png: under the shorts' rag hem a fat team tube from the knee to a hand above the ankle, about
 * three bones thick, its top a rounded knee cap; the thin bone ankle and a slim bone foot show under it). STIFFY_GREAVES, in each knee joint's frame (the
 * shin running down -y, S its length): a .sides-sided team tube from .from of S over the knee down to .to of S, .across of the bone's half width across,
 * .flare narrower at its foot, .deep as deep as wide; a knee dome .knee of the tube across, squashed .kneeSquash in y, at the knee; the foot mesh shrunk to
 * .foot in width and height so it reads as a bare bone foot, not a boot box. Team self-lit .glow, a shade (.shade) darker than the shorts.
 */
// 440 look: from -.04 in the shorts' team shade the greave ran on out of the shorts' hem as one column: it starts under the knee, a bone strip between, darker
const STIFFY_GREAVES = { from: 0.14, to: 0.84, across: 3.4, flare: 0.82, deep: 1.0, sides: 7, knee: 1.12, kneeSquash: 0.75, foot: 0.72, shade: 0.55, glow: 0.14 };

/** Team greaves from the knee down the shin over bare bone feet (spec at STIFFY_GREAVES). */
export function stiffyGreaves(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const G = STIFFY_GREAVES;
  const tint = teamColor.scale(G.shade);
  const team = getMaterialFactory().get("cloth", tint, { emissive: tint.scale(G.glow) });
  const out: Mesh[] = [];
  for (const [knee, shin] of [[body.leftKnee, body.leftLowerLeg], [body.rightKnee, body.rightLowerLeg]] as const) {
    const b = shin.getBoundingInfo().boundingBox;
    const half = b.extendSize.y * shin.scaling.y, mid = shin.position.y + b.center.y * shin.scaling.y;
    const S = half * 2;
    const r = Math.max(b.extendSize.x * shin.scaling.x, b.extendSize.z * shin.scaling.z) * G.across;
    const cx = shin.position.x + b.center.x * shin.scaling.x, cz = shin.position.z + b.center.z * shin.scaling.z;
    const y0 = mid + half - G.from * S, y1 = mid + half - G.to * S;
    const tube = MeshBuilder.CreateCylinder("stiffyGreave", { height: y0 - y1, diameterTop: r * 2, diameterBottom: r * 2 * G.flare, tessellation: G.sides }, scene);
    tube.scaling.z = G.deep;
    tube.position.set(cx, (y0 + y1) / 2, cz);
    const cap = MeshBuilder.CreateSphere("stiffyGreaveKnee", { diameter: r * 2 * G.knee, segments: 3 }, scene);
    cap.scaling.y = G.kneeSquash;
    cap.position.set(cx, y0, cz + r * 0.08);
    for (const m of [tube, cap]) {
      m.parent = knee;
      m.material = team;
      m.convertToFlatShadedMesh();
      m.isPickable = false;
      out.push(m);
    }
    for (const foot of knee.getChildMeshes(true)) {
      if (foot instanceof Mesh && /_[lr]FootM$/.test(foot.name)) {
        foot.scaling.x *= G.foot;
        foot.scaling.y *= G.foot;
      }
    }
  }
  return out;
}

/*
 * [S] 439 the Skeleton Archer's bracers and boots (audit 434 skeleton_archer a.4: "limbs bare grey to grey boxy feet - TABS: team bracers on the forearms
 * and brown boots on the feet"; spooky.skeleton_archer.red.png: a wide team cuff round each forearm from just under the elbow to past its middle, far
 * thicker than the bone; low dark-brown faceted boots over the feet, their tops a turned-down cuff round the foot of the shin). ARCHER_KIT, in each elbow
 * joint's frame: the bracer a six-sided team sleeve from .bracerFrom to .bracerTo of the forearm, .bracer of the bone's half width across, flaring
 * .bracerFlare at its foot. In each knee's frame: the foot mesh brown, a brown box over it to .bootTo of the foot box (over the grass line, LESSONS 46),
 * .bootOut wide and .bootLong long; a turned cuff round the shin's foot from .cuffFrom of the shin down, .cuff of its half width across. Self-lit .glow.
 */
const ARCHER_KIT = {
  bracerFrom: 0.12, bracerTo: 0.6, bracer: 3.2, bracerFlare: 1.12, bootTo: 1.0, bootOut: 1.25, bootLong: 1.1, cuffFrom: 0.72, cuff: 3.6, glow: 0.14,
  leather: new Color3(0.4, 0.17, 0.07),
};

/** Team bracers round the forearms and low brown boots with turned cuffs (spec at ARCHER_KIT). */
export function skeletonArcherKit(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const K = ARCHER_KIT;
  const f = getMaterialFactory();
  const team = f.get("cloth", teamColor, { emissive: teamColor.scale(K.glow) });
  const leather = f.get("cloth", K.leather, { emissive: K.leather.scale(K.glow) });
  const out: Mesh[] = [];
  const sleeve = (name: string, limb: Mesh, from: number, to: number, across: number, flare: number, mat: typeof team): void => {
    const b = limb.getBoundingInfo().boundingBox;
    const half = b.extendSize.y * limb.scaling.y, mid = limb.position.y + b.center.y * limb.scaling.y;
    const r = Math.max(b.extendSize.x * limb.scaling.x, b.extendSize.z * limb.scaling.z) * across;
    const y0 = mid + half - from * half * 2, y1 = mid + half - to * half * 2;
    const m = MeshBuilder.CreateCylinder(name, { height: y0 - y1, diameterTop: r * 2, diameterBottom: r * 2 * flare, tessellation: 6 }, scene);
    m.parent = limb.parent;
    m.position.set(limb.position.x + b.center.x * limb.scaling.x, (y0 + y1) / 2, limb.position.z + b.center.z * limb.scaling.z);
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.isPickable = false;
    out.push(m);
  };
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) sleeve("archerBracer", arm, K.bracerFrom, K.bracerTo, K.bracer, K.bracerFlare, team);
  // [S] 440 (439 skeleton_archer a.5: "boots are one low wide brown slab under both feet that reads as a plinth - TABS: tall narrow brown boots to mid-shin
  // with a turned cuff, each on its own foot"): no box over the feet. Each shin gets a narrow brown shaft (BOOT_SHAFT) from mid-shin down past the ankle into
  // the foot, a wider turned cuff round its top, and the foot itself is the boot's toe, narrowed to .toe of its width so the two feet stand apart.
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    sleeve("archerBootShaft", shin, BOOT_SHAFT.from, BOOT_SHAFT.to, BOOT_SHAFT.across, 1.08, leather);
    sleeve("archerBootCuff", shin, BOOT_SHAFT.cuffFrom, BOOT_SHAFT.cuffTo, BOOT_SHAFT.cuff, 0.92, leather);
  }
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) {
      if (!(foot instanceof Mesh) || !/_[lr]FootM$/.test(foot.name)) continue;
      foot.material = leather;
      foot.scaling.x *= BOOT_SHAFT.toe;
    }
  }
  return out;
}

/** The archer's boot, in shin lengths from the knee: shaft .from-.to, .across of the bone's half width; cuff .cuffFrom-.cuffTo, .cuff across; toe width share. */
const BOOT_SHAFT = { from: 0.48, to: 1.06, across: 2.5, cuffFrom: 0.42, cuffTo: 0.56, cuff: 3.3, toe: 0.78 };

/*
 * [S] 439 the Pumpkin Catapult's skeleton operator (audit 434 pumpkin_catapult a.3: "operator is a blue soldier - TABS: skeleton in tattered team
 * clothing"; card Appearance "The operator has been replaced by a skeleton ... clad in a tattered clothing of the appropriate team color"): the crewman
 * stripped to cream bone - thin bone limbs, a bone skull, the chest a thin spine inside rib hoops - in a ragged team rag tunic from the ribs' foot to
 * mid-thigh with rag points round its hem, and a team rag tied round the skull. SKELETON_CREW, on the operator's own body: limbs thinned to .limb in
 * x and z, every flesh, cloth and foot mesh in .bone (the catapult's own bone, self-lit .boneGlow so it reads cream like the arm); the chest block thinned
 * to .spine with .ribs hoops from .ribTop to .ribLow of its height; the rag a .sides-sided team frustum from .ragTop of the chest height down .ragLong of
 * it, .ragOut of the chest width across flaring .ragFlare, .tatters points under it; a head rag .band of the head tall round its crown. Team self-lit .glow.
 */
const SKELETON_CREW = {
  limb: 0.42, spine: 0.16, ribs: 4, ribTop: 0.86, ribLow: 0.45, ragTop: 0.4, ragLong: 0.85, ragOut: 1.05, ragFlare: 1.3, sides: 7, tatters: 7, band: 0.3,
  bone: new Color3(1.0, 0.86, 0.6), boneGlow: 0.3, glow: 0.14,
};

/** Strips a vehicle crewman to cream bone and hangs tattered team rags on him (spec at SKELETON_CREW). */
export function skeletonCrew(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const C = SKELETON_CREW;
  const f = getMaterialFactory();
  const bone = f.get("cloth", C.bone, { emissive: C.bone.scale(C.boneGlow) });
  const team = f.get("cloth", teamColor, { emissive: teamColor.scale(C.glow) });
  const out: Mesh[] = [];
  for (const limb of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm, body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) {
    if (!limb) continue;
    limb.scaling.x *= C.limb;
    limb.scaling.z *= C.limb;
  }
  // every body part goes bone but the bead eyes; the shoulder yoke (the trunk's hull) goes, the ribs stand in for it
  for (const mesh of [...body.allMeshes, ...body.leftElbow.getChildMeshes(false), ...body.rightElbow.getChildMeshes(false), ...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (mesh instanceof Mesh && !/eye|pupil/i.test(mesh.name)) mesh.material = bone;
  }
  for (const mesh of body.torso.getChildMeshes(true)) if (/_yoke/.test(mesh.name)) mesh.setEnabled(false);
  const put = (m: Mesh, parent: TransformNode, mat: typeof team): Mesh => {
    m.parent = parent;
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.isPickable = false;
    out.push(m);
    return m;
  };
  const chest = body.torsoMesh;
  const cb = chest.getBoundingInfo().boundingBox, ext = cb.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const foot = chest.position.y + cb.center.y * chest.scaling.y - H / 2;
  chest.scaling.x *= C.spine;
  chest.scaling.z *= C.spine * 2;
  for (let i = 0; i < C.ribs; i++) {
    const k = i / (C.ribs - 1);
    const across = W * (0.95 - 0.3 * k);
    const rib = put(MeshBuilder.CreateTorus("skeletonCrewRib", { diameter: across, thickness: W * 0.08, tessellation: 8 }, scene), body.torso, bone);
    rib.scaling.z = (D * 0.9) / across;
    rib.position.set(0, foot + H * (C.ribTop - (C.ribTop - C.ribLow) * k), D * 0.05);
  }
  const ragTop = foot + H * C.ragTop, ragLong = H * C.ragLong;
  const rag = put(MeshBuilder.CreateCylinder("skeletonCrewRag", { height: ragLong, diameterTop: W * C.ragOut, diameterBottom: W * C.ragOut * C.ragFlare, tessellation: C.sides }, scene), body.torso, team);
  rag.scaling.z = (D * 1.1) / (W * C.ragOut);
  rag.position.set(0, ragTop - ragLong / 2, 0);
  const hemR = (W * C.ragOut * C.ragFlare) / 2;
  for (let i = 0; i < C.tatters; i++) {
    const a = ((i + 0.5) / C.tatters) * Math.PI * 2;
    const drop = ragLong * (0.3 + 0.15 * (i % 3));
    const t = put(MeshBuilder.CreateCylinder("skeletonCrewTatter", { height: drop, diameterTop: hemR * 0.55, diameterBottom: 0, tessellation: 3 }, scene), body.torso, team);
    t.scaling.z = 0.4;
    t.rotation.y = a;
    t.position.set(Math.sin(a) * hemR * 0.9, ragTop - ragLong - drop / 2 + H * 0.01, Math.cos(a) * hemR * 0.9 * ((D * 1.1) / (W * C.ragOut)));
  }
  const head = body.headMesh, hb = head.getBoundingInfo().boundingBox, he = hb.extendSize;
  const band = put(MeshBuilder.CreateBox("skeletonCrewHeadRag", { width: he.x * 2.12, height: he.y * 2 * C.band, depth: he.z * 2.12 }, scene), head, team);
  band.position.set(hb.center.x, hb.maximum.y - he.y * 2 * C.band * 0.5 + he.y * 0.04, hb.center.z);
  return out;
}

/*
 * [S] 436 the Candlehead's candle arms (audit 434 candlehead b.1: "main hand holds a dark stick - TABS: both forearms sheathed in huge melted cream
 * candles with cyan flames at the bottom"; spooky.candlehead.red.png, card Main/Off Hand "Candle Fire", Appearance "flaming cierges on its ... hands":
 * each forearm swallowed from the elbow down by a fat lumpy cream wax column, about three arms thick, running on past the fist to mid-thigh, melted
 * into uneven bulges, a short wick at its foot and a round cyan flame hanging under it). CANDLE_ARMS, in the elbow joint's frame (the forearm running
 * down -y to the hand, F its length): the column from .top of F over the elbow down .long of F, .lumps stacked bulges each .wide of F across, every
 * other one nudged .wobble of F off the line and squashed or swollen by .swell; a wick .wick of F long under it; the flame a ball .flame of F across.
 * The torch stick in the weapon fist is hidden (the spirit fire still leaves from that hand). Wax self-lit .glow so it reads cream, not grey, in shade.
 */
const CANDLE_ARMS = {
  top: 0.12, long: 2.2, lumps: 6, wide: 0.78, wobble: 0.08, swell: 0.18, wick: 0.12, flame: 0.48, glow: 0.2,
  wax: new Color3(1.0, 0.84, 0.58), wickDark: new Color3(0.1, 0.08, 0.06), fire: new Color3(0.35, 1.1, 1.3),
};

/** Both forearms sheathed in lumpy cream candles, a cyan flame under each (spec at CANDLE_ARMS). */
export function candleArms(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CANDLE_ARMS;
  const wax = getMaterialFactory().get("cloth", C.wax, { emissive: C.wax.scale(C.glow) });
  const wickMat = getMaterialFactory().get("cloth", C.wickDark, { emissive: C.wickDark.scale(0.1) });
  const fire = getMaterialFactory().get("unlit", C.fire, { emissive: C.fire });
  const out: Mesh[] = [];
  for (const [side, elbow, hand] of [[-1, body.leftElbow, body.leftHand], [1, body.rightElbow, body.rightHand]] as const) {
    const F = Math.abs(hand.position.y) || 0.2;
    const y0 = F * C.top, y1 = -F * C.long;
    const step = (y0 - y1) / C.lumps;
    for (let i = 0; i < C.lumps; i++) {
      const k = i % 2 ? 1 : -1;
      const swell = 1 + C.swell * (((i * 7 + (side > 0 ? 3 : 0)) % 5) / 2 - 1);
      const lump = MeshBuilder.CreateSphere("candleArmWax", { diameterX: F * C.wide * swell, diameterY: step * 1.7, diameterZ: F * C.wide * (2 - swell) * 0.95, segments: 4 }, scene);
      lump.position.set(k * F * C.wobble * side, y0 - step * (i + 0.5), (i % 3 - 1) * F * C.wobble * 0.7);
      lump.rotation.y = i * 0.7;
      lump.parent = elbow;
      lump.material = wax;
      lump.convertToFlatShadedMesh();
      lump.isPickable = false;
      out.push(lump);
    }
    const wick = MeshBuilder.CreateCylinder("candleArmWick", { height: F * C.wick, diameter: F * 0.06, tessellation: 5 }, scene);
    wick.position.y = y1 - F * C.wick * 0.3;
    wick.parent = elbow;
    wick.material = wickMat;
    out.push(wick);
    const flame = MeshBuilder.CreateSphere("candleArmFlame", { diameter: F * C.flame, segments: 4 }, scene);
    flame.position.y = y1 - F * C.wick * 0.7 - F * C.flame * 0.45;
    flame.parent = elbow;
    flame.material = fire;
    flame.convertToFlatShadedMesh();
    flame.isPickable = false;
    out.push(flame);
  }
  for (const n of body.rightHand.getChildMeshes(false)) {
    if (n.name !== "torch" && n.name !== "flame") continue;
    n.isVisible = false;
    n.setEnabled(false);
  }
  return out;
}

/*
 * [S] 438 the Candlehead's candle tower (audit 434 candlehead a.1: "head is a plain team head with a tiny wick and a yellow glow - TABS: a tall stacked
 * cream-wax candle tower over the head topped by a big cyan flame"; spooky.candlehead.red.png, card Appearance "flaming cierges on its head": a melted
 * cream cap over the crown, wider than the head, its rim run down the sides to about the eyes' top in drips, and from it a lumpy wax column standing
 * about a head and a half tall, narrowing as it rises, its lumps nudged off the line, a short wick at its top and a big round pale-cyan flame over it,
 * wider than the column's top, a darker cyan core in it). CANDLE_TOWER, in the head's own box (e its half sizes, H the head's height): the cap .cap of
 * the head wide and deep from .capFoot of e.y down the sides to .crown of H over the top, .drips drips round its rim each .drip of H long; the column
 * .lumps lumps over .tall of H, .base of the head's width across at the foot narrowing to .tip of it, every other one .wobble of H off the line;
 * the wick .wick of H; the flame .flame of the head's width across, squashed .flat, and a core .core of it inside. CANDLE_ARMS's wax and fire.
 * The old wick and yellow flame on the head (propBuilder candle_flame) are hidden.
 */
const CANDLE_TOWER = { cap: 1.2, capFoot: 0.35, crown: 0.12, drips: 7, drip: 0.28, lumps: 5, tall: 1.45, base: 0.82, tip: 0.5, wobble: 0.06, wick: 0.1, flame: 1.15, flat: 0.92, core: 0.45 };

/** A melted cream wax cap and lumpy candle tower over the head with a big cyan flame on it (spec at CANDLE_TOWER). */
export function candleTower(scene: Scene, body: ArticulatedBody): Mesh[] {
  const T = CANDLE_TOWER, C = CANDLE_ARMS;
  const f = getMaterialFactory();
  const wax = f.get("cloth", C.wax, { emissive: C.wax.scale(C.glow) });
  const wickMat = f.get("cloth", C.wickDark, { emissive: C.wickDark.scale(0.1) });
  const fire = f.get("unlit", C.fire, { emissive: C.fire });
  const coreC = new Color3(0.05, 0.75, 1.0);
  const core = f.get("unlit", coreC, { emissive: coreC });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const H = e.y * 2, Wd = e.x * 2;
  const out: Mesh[] = [];
  const put = (m: Mesh, mat: typeof wax, flat = true): Mesh => {
    m.parent = head;
    m.material = mat;
    if (flat) m.convertToFlatShadedMesh();
    m.isPickable = false;
    out.push(m);
    return m;
  };
  // the cap: a squat melted dome over the crown, its rim run down the sides
  const capTop = bb.maximum.y + H * T.crown, capFoot = c.y + e.y * T.capFoot;
  const capH = capTop - capFoot;
  const cap = MeshBuilder.CreateCylinder("candleTowerCap", { height: capH, diameterTop: Wd * T.cap * 0.85, diameterBottom: Wd * T.cap, tessellation: 9 }, scene);
  cap.scaling.z = (e.z * 2 * T.cap) / (Wd * T.cap);
  cap.position.set(c.x, capFoot + capH / 2, c.z);
  put(cap, wax);
  for (let i = 0; i < T.drips; i++) {
    const a = ((i + 0.3) / T.drips) * Math.PI * 2;
    const long = H * T.drip * (0.6 + 0.4 * ((i * 5) % 3) / 2);
    const drip = MeshBuilder.CreateCylinder("candleTowerDrip", { height: long, diameterTop: H * 0.11, diameterBottom: H * 0.05, tessellation: 5 }, scene);
    drip.position.set(c.x + Math.sin(a) * e.x * T.cap * 0.95, capFoot - long / 2 + H * 0.03, c.z + Math.cos(a) * e.z * T.cap * 0.95);
    put(drip, wax);
  }
  // the column: lumps stacked up off the cap, narrowing as it rises
  const step = (H * T.tall) / T.lumps;
  let y = capTop - step * 0.2;
  for (let i = 0; i < T.lumps; i++) {
    const k = i / Math.max(1, T.lumps - 1);
    const across = Wd * (T.base + (T.tip - T.base) * k) * (1 + 0.08 * (((i * 7) % 3) - 1));
    const lump = MeshBuilder.CreateSphere("candleTowerWax", { diameterX: across, diameterY: step * 1.55, diameterZ: across * 0.92, segments: 4 }, scene);
    lump.position.set(c.x + (i % 2 ? 1 : -1) * H * T.wobble, y + step / 2, c.z + ((i % 3) - 1) * H * T.wobble * 0.6);
    lump.rotation.y = i * 0.9;
    put(lump, wax);
    y += step;
  }
  const wick = MeshBuilder.CreateCylinder("candleTowerWick", { height: H * T.wick, diameter: H * 0.05, tessellation: 5 }, scene);
  wick.position.set(c.x, y + H * T.wick * 0.3, c.z);
  put(wick, wickMat, false);
  const flameD = Wd * T.flame;
  const flame = MeshBuilder.CreateSphere("candleTowerFlame", { diameter: flameD, segments: 4 }, scene);
  flame.scaling.y = T.flat;
  flame.position.set(c.x, y + H * T.wick * 0.5 + flameD * T.flat * 0.45, c.z);
  put(flame, fire);
  const heart = MeshBuilder.CreateSphere("candleTowerFlameCore", { diameter: flameD * T.core, segments: 4 }, scene);
  heart.scaling.set(1, 0.6, 1);
  heart.position.set(c.x, flame.position.y - flameD * 0.05, c.z + flameD * 0.32);
  put(heart, core);
  // the old wick and yellow flame on the head
  for (const n of body.headTop.getChildMeshes(false)) {
    if (n.name !== "candleWick" && n.name !== "candleFlame") continue;
    n.isVisible = false;
    n.setEnabled(false);
  }
  return out;
}

/*
 * [S] 435 the Reaper Wings (audit 434 reaper a.1: "tendrils in unit_spooky.reaper_idle absent - TABS: six long dark tendrils fanning behind the
 * shoulders, three each side"; spooky.reaper.red.png, card Abilities "a pair of six dark tendrils that looms behind their host; three on the left, three
 * on their right": thin near-black navy tentacles out of the upper back, each running out sideways and a little back for several of his own widths,
 * fanned one over another, waving gently along their length and thinning to a point). REAPER_TENDRILS, in the torso mesh's own box (e its half sizes,
 * T its height): per side .fan tubes rooted .rootX of e.x off the spine at .rootY of e.y on the back, each .long of T long, sent .out of the way
 * sideways and .back of it backward, lifted by its .rise angle (rad), a sine wave .wave of T tall over .waves cycles growing along it, .thick of T thick
 * at the root tapering to .tip of that. Near-black navy, self-lit .glow so it reads dark blue, not a hole.
 */
const REAPER_TENDRILS = {
  rootX: 0.3, rootY: 0.55, long: 4.6, out: 0.88, back: 0.45, rise: [0.24, 0.04, -0.16], wave: 0.22, waves: 1.6, thick: 0.1, tip: 0.18,
  steps: 18, glow: 0.18, color: new Color3(0.035, 0.035, 0.09),
};

/** Six dark tendrils fanned from the upper back, three each side (spec at REAPER_TENDRILS). */
export function reaperTendrils(scene: Scene, body: ArticulatedBody): Mesh[] {
  const R = REAPER_TENDRILS;
  const torso = body.torsoMesh;
  const bb = torso.getBoundingInfo().boundingBox, e = bb.extendSize, c = bb.center;
  const T = e.y * 2;
  const mat = getMaterialFactory().get("cloth", R.color, { emissive: R.color.scale(R.glow) });
  const out: Mesh[] = [];
  for (const side of [-1, 1]) {
    R.rise.forEach((rise, i) => {
      const root = new Vector3(c.x + side * e.x * R.rootX, c.y + e.y * R.rootY - i * e.y * 0.12, c.z - e.z * 0.9);
      const dir = new Vector3(side * R.out, 0, -R.back).normalize();
      const path: Vector3[] = [];
      for (let k = 0; k <= R.steps; k++) {
        const t = k / R.steps, d = R.long * T * t;
        const wave = Math.sin(t * Math.PI * 2 * R.waves + i * 1.3 + (side > 0 ? 0.6 : 0)) * R.wave * T * t;
        path.push(new Vector3(root.x + dir.x * d * Math.cos(rise), root.y + d * Math.sin(rise) + wave, root.z + dir.z * d * Math.cos(rise)));
      }
      const tube = MeshBuilder.CreateTube("reaperTendril", {
        path, tessellation: 6, cap: Mesh.CAP_START,
        radiusFunction: (k: number) => (R.thick * T * 0.5) * (1 - (1 - R.tip) * (k / R.steps)) * (k === R.steps ? 0.05 : 1),
      }, scene);
      tube.parent = torso;
      tube.material = mat;
      tube.isPickable = false;
      out.push(tube);
    });
  }
  return out;
}

/** A closed triangular slab, point down, in the x-y plane: `w` across its top edge, `h` tall, `t` thick (both faces outward, flat shaded). */
function triSlab(scene: Scene, name: string, w: number, h: number, t: number): Mesh {
  const p = [[-w / 2, h / 2], [w / 2, h / 2], [0, -h / 2]];
  const positions: number[] = [];
  for (const z of [t / 2, -t / 2]) for (const [x, y] of p) positions.push(x, y, z);
  // front (+z) and back faces, then the three sides as quads
  const indices = [0, 2, 1, 3, 4, 5];
  for (let i = 0; i < 3; i++) {
    const j = (i + 1) % 3;
    indices.push(i, j, j + 3, i, j + 3, i + 3);
  }
  // each face both ways round: whichever copy faces the camera is drawn, the other culled (no winding to get wrong)
  for (let k = 0, n = indices.length; k < n; k += 3) indices.push(indices[k], indices[k + 2], indices[k + 1]);
  const m = new Mesh(name, scene);
  const vd = new VertexData();
  vd.positions = positions;
  vd.indices = indices;
  const normals: number[] = [];
  VertexData.ComputeNormals(positions, indices, normals);
  vd.normals = normals;
  vd.applyToMesh(m);
  m.convertToFlatShadedMesh();
  return m;
}

/*
 * [S] 439 the Candlehead's robe (audit 434 candlehead a.2: "body bare team skin - TABS: team robe to mid-thigh with a white V collar edged in gold";
 * spooky.candlehead.red.png, card Appearance "wears a robe": a straight team robe from the shoulders to about mid-thigh, square in section and a little
 * wider at the hem than at the chest, a deeper team band round its hem; on the chest a big white V bib from shoulder to shoulder down to a point at
 * mid-chest, edged all round in gold). CANDLE_ROBE, in the torso joint's frame (W, D the trunk's width and depth, H its height): a four-sided frustum
 * from .top of H over the trunk's top down to .hem of the way from the trunk's foot to the knees, .out of W across at the top and .flare of that at the
 * hem, .deep of D deep; a hem band .band of the robe's length in .dark of the team; the bib a white triangle .bib of the top width across and .bibTall of
 * H tall on the front face, a gold triangle .rim larger behind it, both standing .proud of W off the face. Team, white and gold self-lit .glow.
 */
const CANDLE_ROBE = {
  top: 0.02, hem: 0.5, out: 1.12, flare: 1.22, deep: 1.25, band: 0.12, dark: 0.55, bib: 0.92, bibTall: 0.5, rim: 1.14, proud: 0.05, glow: 0.14,
  white: new Color3(1, 0.97, 0.9), gold: new Color3(1, 0.62, 0.16),
};

/** A square team robe to mid-thigh with a dark hem band and a gold-edged white V bib on the chest (spec at CANDLE_ROBE). */
export function candleRobe(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const R = CANDLE_ROBE;
  const f = getMaterialFactory();
  const team = f.get("cloth", teamColor, { emissive: teamColor.scale(R.glow) });
  const darkC = teamColor.scale(R.dark);
  const dark = f.get("cloth", darkC, { emissive: darkC.scale(R.glow) });
  const white = f.get("cloth", R.white, { emissive: R.white.scale(0.3) });
  const gold = f.get("cloth", R.gold, { emissive: R.gold.scale(R.glow) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const frame = tm.parent as TransformNode;
  const kneeY = (inFrameOf(body.leftKnee, frame).y + inFrameOf(body.rightKnee, frame).y) / 2;
  const foot = cy - H / 2;
  const top = cy + H / 2 + H * R.top, hem = foot - (foot - kneeY) * R.hem, long = top - hem;
  const xTop = (W * R.out) / 2, xHem = xTop * R.flare, zTop = (D * R.deep) / 2, zHem = zTop * R.flare;
  const out: Mesh[] = [];
  const put = (m: Mesh, mat: typeof team): Mesh => {
    m.parent = frame;
    m.material = mat;
    m.isPickable = false;
    out.push(m);
    return m;
  };
  const frustum = (name: string, y0: number, y1: number, k0: number, k1: number, mat: typeof team): Mesh => {
    const m = MeshBuilder.CreateCylinder(name, { height: y1 - y0, diameterTop: xTop * 2 * Math.SQRT2 * k1, diameterBottom: xTop * 2 * Math.SQRT2 * k0, tessellation: 4 }, scene);
    m.rotation.y = Math.PI / 4;
    m.bakeCurrentTransformIntoVertices();
    m.scaling.z = zTop / xTop;
    m.convertToFlatShadedMesh();
    m.position.set(cx, (y0 + y1) / 2, cz);
    return put(m, mat);
  };
  // the robe, and its deeper hem band a hair proud of it
  frustum("candleRobe", hem, top, R.flare, 1, team);
  const bandTop = hem + long * R.band, kBand = R.flare - (R.flare - 1) * R.band;
  frustum("candleRobeHem", hem - long * 0.01, bandTop, R.flare * 1.03, kBand * 1.03, dark);
  // the bib on the front face at the top, leaning out with the flare
  const lean = Math.atan2(zHem - zTop, long);
  const bibW = xTop * 2 * R.bib, bibH = H * R.bibTall, bibY = top - bibH / 2 - H * 0.02;
  const faceZ = cz + zTop + (zHem - zTop) * ((top - bibY) / long);
  const rim = put(triSlab(scene, "candleRobeBibRim", bibW * R.rim, bibH * R.rim, W * 0.03), gold);
  rim.position.set(cx, top - (bibH * R.rim) / 2 - H * 0.01, faceZ + W * R.proud * 0.5);
  rim.rotation.x = -lean;
  const bib = put(triSlab(scene, "candleRobeBib", bibW, bibH, W * 0.03), white);
  bib.position.set(cx, bibY, faceZ + W * R.proud);
  bib.rotation.x = -lean;
  return out;
}

/*
 * [S] 440 the Candlehead's boots (434 candlehead a.4: "lower legs plain team - TABS: dark team boots to the knee with gold bands";
 * spooky.candlehead.red.png: from the foot up to just under the knee a dark team boot a little wider than the leg, its top two thin gold rings close
 * together a hand under the knee; the thigh above stays the robe's team). CANDLE_BOOTS, in each knee joint's frame (the shin running down -y, S its
 * length): the shin and foot meshes in .dark of the team (LESSONS 48); a six-sided dark shaft from .from of S under the knee down to .to of S, .across
 * of the shin's half width across, .flare wider at the top; two gold rings at .rings of S, each .ring of S tall and .ringOut of the shaft's top across.
 * Self-lit .glow so the dark reads team, not black, in the idle shade.
 */
const CANDLE_BOOTS = { dark: 0.5, from: 0.04, to: 1.02, across: 1.28, flare: 1.08, rings: [0.1, 0.2], ring: 0.055, ringOut: 1.08, glow: 0.18 };

/** Dark team boots to the knee with two gold rings at the top (spec at CANDLE_BOOTS). */
export function candleBoots(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const B = CANDLE_BOOTS;
  const f = getMaterialFactory();
  const darkC = teamColor.scale(B.dark);
  const dark = f.get("cloth", darkC, { emissive: darkC.scale(B.glow) });
  const gold = f.get("cloth", CANDLE_ROBE.gold, { emissive: CANDLE_ROBE.gold.scale(B.glow) });
  const out: Mesh[] = [];
  for (const [knee, shin] of [[body.leftKnee, body.leftLowerLeg], [body.rightKnee, body.rightLowerLeg]] as const) {
    shin.material = dark;
    for (const foot of knee.getChildMeshes(true)) if (foot instanceof Mesh && /_[lr]FootM$/.test(foot.name)) foot.material = dark;
    const b = shin.getBoundingInfo().boundingBox;
    const half = b.extendSize.y * shin.scaling.y, mid = shin.position.y + b.center.y * shin.scaling.y, S = half * 2;
    const r = Math.max(b.extendSize.x * shin.scaling.x, b.extendSize.z * shin.scaling.z) * B.across;
    const cx = shin.position.x + b.center.x * shin.scaling.x, cz = shin.position.z + b.center.z * shin.scaling.z;
    const y0 = mid + half - B.from * S, y1 = mid + half - B.to * S;
    const shaft = MeshBuilder.CreateCylinder("candleBoot", { height: y0 - y1, diameterTop: r * 2 * B.flare, diameterBottom: r * 2, tessellation: 6 }, scene);
    shaft.position.set(cx, (y0 + y1) / 2, cz);
    shaft.material = dark;
    const pieces: Mesh[] = [shaft];
    for (const at of B.rings) {
      const ring = MeshBuilder.CreateCylinder("candleBootBand", { height: B.ring * S, diameter: r * 2 * B.flare * B.ringOut, tessellation: 6 }, scene);
      ring.position.set(cx, mid + half - at * S, cz);
      ring.material = gold;
      pieces.push(ring);
    }
    for (const m of pieces) {
      m.parent = knee;
      m.convertToFlatShadedMesh();
      m.isPickable = false;
      out.push(m);
    }
  }
  return out;
}

/*
 * [S] 439 the Vampire's high collar and cape (audit 434 vampire a.3: "collar is a small dark-red wedge on the shoulders - TABS: tall spiked team collar
 * rising behind the head over a short shoulder cape"; spooky.vampire.red.png, card Appearance "a high collar, and a small cape": a short faceted team
 * cape over both shoulders, its hem cut in points out past the shoulders; out of its back edge a fan of tall flat team spikes standing up behind and
 * either side of the head to about the crown, leaning out, the outer ones tallest). VAMPIRE_COLLAR, in the torso joint's frame (S the shoulder span,
 * N the neck joint, h the head block's height): the cape a .sides-sided frustum from .capeTop of h over the trunk's top down .capeDrop of h, .capeIn of S
 * across at the neck flaring to .capeOut of S, .deep as deep; .spikes spikes on an arc behind the neck .ring of S out, from .arc[0] to .arc[1] rad round
 * from straight back, each a flat wedge .wide of h wide at its root, .tall[i] of h tall, leaning .lean rad out; tops kept under the head's top + .3 h
 * (LESSONS 27). Team self-lit .glow, the spikes in .shade of it so they part from the cape.
 */
// 439 look: the first fan (ring .26, tall .8-1.15 h) stood inside the head and hair and never showed: the ring is wider and the spikes taller
const VAMPIRE_COLLAR = {
  sides: 6, capeTop: 0.08, capeDrop: 0.55, capeIn: 0.45, capeOut: 1.22, deep: 0.85, spikes: 5, ring: 0.42, arc: [-1.25, 1.25], wide: 0.5, tall: [1.5, 1.3, 1.15, 1.3, 1.5],
  lean: 0.32, back: 0.18, thick: 0.06, glow: 0.14, shade: 0.85,
};

/** A short pointed team cape over the shoulders and a fan of tall team spikes standing up behind the head (spec at VAMPIRE_COLLAR). */
export function vampireCollar(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const V = VAMPIRE_COLLAR;
  const f = getMaterialFactory();
  const team = f.get("cloth", teamColor, { emissive: teamColor.scale(V.glow) });
  const spikeC = teamColor.scale(V.shade);
  const spikeMat = f.get("cloth", spikeC, { emissive: spikeC.scale(V.glow) });
  const torso = body.torso;
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const trunkTop = tm.position.y + tb.center.y * ts.y + H / 2;
  const S = Math.abs(body.rightShoulder.position.x - body.leftShoulder.position.x) || tb.extendSize.x * 2 * ts.x;
  const hb = body.headMesh.getBoundingInfo().boundingBox;
  const h = hb.extendSize.y * 2 * body.headMesh.scaling.y;
  const neck = inFrameOf(body.neck, torso);
  const out: Mesh[] = [];
  const put = (m: Mesh, mat: typeof team): Mesh => {
    m.parent = torso;
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.isPickable = false;
    out.push(m);
    return m;
  };
  // the cape over the shoulders, its six points out past them
  const capeTop = Math.max(trunkTop, neck.y - h * 0.1) + h * V.capeTop, drop = h * V.capeDrop;
  const cape = put(MeshBuilder.CreateCylinder("vampireCape", { height: drop, diameterTop: S * V.capeIn, diameterBottom: S * V.capeOut, tessellation: V.sides }, scene), team);
  cape.scaling.z = Math.max(V.deep, (D * 1.2) / (S * V.capeOut));
  cape.position.set(0, capeTop - drop / 2, 0);
  // the spikes on an arc behind the neck, each a flat wedge standing up and leaning out
  for (let i = 0; i < V.spikes; i++) {
    const k = V.spikes > 1 ? i / (V.spikes - 1) : 0.5;
    const a = V.arc[0] + (V.arc[1] - V.arc[0]) * k;
    const tall = h * V.tall[i % V.tall.length];
    const pivot = new TransformNode("vampireCollarSpike", scene);
    pivot.parent = torso;
    pivot.position.set(Math.sin(a) * S * V.ring, capeTop - drop * 0.15, neck.z - Math.cos(a) * S * V.ring);
    pivot.rotation.y = -a;
    pivot.rotation.x = -V.back;
    pivot.rotation.z = Math.sin(a) * -V.lean;
    const spike = put(MeshBuilder.CreateCylinder("vampireCollarSpike", { height: tall, diameterTop: 0, diameterBottom: h * V.wide, tessellation: 4 }, scene), spikeMat);
    spike.parent = pivot;
    spike.scaling.z = V.thick / V.wide;
    spike.position.set(0, tall / 2, 0);
  }
  return out;
}

/*
 * [S] 439 the Reaper's hover (audit 434 reaper a.2: "legs in unit_spooky.reaper_idle are short grey stumps on the ground under a wide robe - TABS: long
 * thin cream bone legs dangling below the robe hem, hovering"; spooky.reaper.red.png, card Abilities "Hover": he floats off the ground, two long thin
 * cream bone legs hanging loose and straight out of the robe's hem, the bone feet pointing down well clear of the ground). REAPER_LEGS: the thin bone
 * legs and feet in a cream bone self-lit .glow (the plain lit bone reads grey, LESSONS 13); a "reaperHover" node under the hip marks him for the
 * animator, which lifts him and lets the legs hang (proceduralAnimation REAPER_HOVER).
 */
const REAPER_LEGS = { bone: new Color3(1.0, 0.86, 0.6), glow: 0.3 };
export const REAPER_HOVER_NODE = "reaperHover";

/** Cream bone legs and feet, and the hover marker under the hip (spec at REAPER_LEGS). */
export function reaperLegs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const L = REAPER_LEGS;
  const bone = getMaterialFactory().get("cloth", L.bone, { emissive: L.bone.scale(L.glow) });
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) if (leg) leg.material = bone;
  for (const knee of [body.leftKnee, body.rightKnee]) for (const m of knee.getChildMeshes(true)) if (/_[lr]FootM$/.test(m.name)) m.material = bone;
  const mark = new TransformNode(REAPER_HOVER_NODE, scene);
  mark.parent = body.hip;
  return [];
}
