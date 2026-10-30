import { Scene, Color3, Mesh, MeshBuilder, TransformNode } from "@babylonjs/core";
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
