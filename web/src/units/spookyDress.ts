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
 */
const SWORDCASTER_SKIRT = { top: 0.12, hem: 0.55, out: 1.1, flare: 1.32, deep: 1.25, stripes: 1, stripeAt: 0.5, stripe: 0.12, dark: 0.42, proud: 0.025, glow: 0.14 };

/** A flared team tunic skirt from the waist to mid-thigh with dark stripes down it (spec at SWORDCASTER_SKIRT). */
export function swordcasterSkirt(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = SWORDCASTER_SKIRT;
  const f = getMaterialFactory();
  const cloth = f.get("cloth", teamColor, { emissive: teamColor.scale(S.glow) });
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
