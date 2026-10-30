import { Scene, Color3, Mesh, MeshBuilder, TransformNode, Vector3 } from "@babylonjs/core";
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
