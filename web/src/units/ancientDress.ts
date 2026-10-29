import { Scene, Color3, Mesh, MeshBuilder, TransformNode, Vector3, VertexBuffer, Quaternion, type Material, type Node } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { trunkBand, jitterVertices } from "./tribalDress";
import { limbShell } from "./medievalDress";

/*
 * Ancient dress (units/ancient.*): fur, cloth and ornaments built per unit id by unitFactory, sized off the body's own metrics and joints. Pieces worn on
 * the trunk are parented to the torso joint (+z his front, +y up, y 0 at the hip line, the shoulders at body.neck.position.y).
 */

/*
 * [S] the minotaur in his own brown fur (378; ancient.minotaur.red.png, card Appearance "a brown, anthropomorphic bull ... chest hair, a brown belt-like
 * sash with a patterned iron belt, and a patterned shoulder pad. The color of the belt and its shoulder pad changes color depending on the team"; critic
 * 378: a team-blue body, a tunic and trousers, no gear). Every body mesh (trunk, pelvis, arms, legs, hands, feet, head) takes one brown fur, the same on
 * both teams, self-lit MINO_FUR.glow so his shaded side stays brown; the team colour is only on his gear:
 *   - a team belt round the waist: a MINO_BELT.sides-sided band .tall of the trunk high at .at of it, .proud out from the trunk, with .swirls lighter
 *     (team lerped .lighter to white) flat scroll tiles across its front;
 *   - a team pauldron on the shoulder the render shows it on (his left: the render's right): a squashed half dome .wide of the trunk across, a lighter
 *     scroll band round its middle;
 *   - a brown leather sash from that shoulder down across the chest to the other hip, .sash of the trunk wide, a grey iron buckle square on it at the
 *     middle of the chest;
 *   - a dark chest-hair tuft on the breastbone, .tuft of the trunk across.
 */
const MINO_FUR = new Color3(0.42, 0.24, 0.17);
const MINO_FUR_GLOW = 0.16;
const MINO_BELT = { sides: 8, tall: 0.16, at: 0.06, proud: 1.1, swirls: 3, lighter: 0.35 };
/*
 * [S] 386 the scrolled belt (ancient.minotaur.red.png: a tall team girdle at the hips, a dark brown-red rim band along its foot and a thin one at its
 * top, and on its front two big lighter scrolls wound outward from the middle like a ram's horns, each outlined darker, a small scroll beyond each;
 * critic 385: a plain flared band, the 383 curls unreadable, the chest tuft half under the sash). The belt MINO_SCROLL.tall of the trunk tall at .at;
 * the foot rim .foot of its height, the top rim .top, in team x .rimShade; per side a big scroll of .big of the belt's height round centred .bigAt of
 * the half width out, wound .turns from its outer end in, with a tail .tail of the half width long to the middle line, and a small one .small round at
 * .smallAt; each a light tube .line of the height thick (team lerped .light to white) over a dark outline tube .outline thick, .proud of a line off
 * the faces. The chest tuft at .tuftX of the chest half width on his right (+x, the sash runs from his left shoulder) at .tuftY of the trunk.
 */
const MINO_SCROLL = {
  tall: 0.24, at: 0.04, foot: 0.24, top: 0.1, rimShade: 0.42, big: 0.32, bigAt: 0.3, turns: 1.3, tail: 0.3, small: 0.22, smallAt: 0.74,
  line: 0.075, outline: 0.12, light: 0.55, proud: 1.4, tuftX: 0.55, tuftY: 0.6,
};
/* [S] 389 the girdle's band (spec at its build in dressMinotaur): from .lo to .hi of the trunk, .proudX/.proudZ of the pelvis and thighs there, .flare */
/*
 * [R] 402 one girdle band (critic 396/400 a.2: "its scrolls darker blue 3D curls standing off the face, the left flank a separate boxy flap; no pauldron
 * scroll from the front"; ancient.minotaur.red.png: one smooth team band hugging the hips, its foot rim darker, two LIGHTER flat scrolls lying on its
 * front face, and the pauldron's lighter scroll on the plate's top, read from the front). Spec, read off the render:
 *   band: .sides-sided (12, no octagon corners to read as flaps) from .lo to .hi of the trunk, hugging the pelvis at .proudX/.proudZ (1.03/1.1) with
 *     only .flare at the foot, so no facet stands off the flank; the rims .rimGrow (1.02) wider, flush;
 *   scrolls: one light tube per scroll, .line of the band's height thick, HALF-SUNK into the face (.proud .5 of its radius) so it reads as a flat
 *     inlay, no dark outline tube; light = team lerped .light (.72) to white;
 *   pauldron scroll: wound on the plate's TOP (.scrollAt 1.3 rad up from straight out), .scroll (.3 pw) round, and a second one on the plate's FRONT
 *     face (z = +D/2) at the shoulder's top-outer quarter, so a scroll faces the idle's front three-quarter camera whichever side it stands.
 */
const MINO_GIRDLE = { lo: -0.3, hi: 0.03, proudX: 1.03, proudZ: 1.1, flare: 1.04, sides: 12, rimGrow: 1.02, light: 0.72, sunk: 0.5 };
const MINO_PAULDRON = { wide: 0.42, tall: 0.55 };
const MINO_SASH = { sash: 0.3, thick: 0.03, buckle: 0.17, tuft: 0.22 };
/** [S] 405 the sash as a proud slab (spec at its build in dressMinotaur). */
const MINO_STRAP = { wide: 0.44, proud: 0.32, footX: 0.95, footY: 0.06, buckleAt: 0.3, clear: 0.03 };
/*
 * [S] the minotaur's gear redone (383; ancient.minotaur.red.png: a patterned team pauldron on his left shoulder, a broad tan sash with a chunky grey
 * square buckle, a scrolled team belt; critic 382: a plain light-blue dome on the wrong shoulder, a thin fur-toned sash, a tiny white diamond buckle, a
 * plain belt). In the pauldron's width pw: the top slab .padWide x .padThick x .padDeep tilted .padTilt rad down outward, the flap .flap of pw tall bent
 * .flapTilt rad; the belt's rims .rim of its height, .curls scroll pairs at those shares of its half width, each .curl of its height round, wound .turns,
 * .thick of it thick; the sash MINO_SASH.sash of the trunk wide in MINO_LEATHER; the buckle .buckle of the trunk across, its bars .bar of that.
 */
const MINO_GEAR = { padWide: 1.25, padThick: 0.18, padDeep: 1.15, padTilt: 0.32, flap: 0.6, flapTilt: 0.35, rim: 0.2, curls: [0.22, 0.62], curl: 0.3, turns: 1.1, thick: 0.06, buckle: 0.3, bar: 0.24 };
/*
 * [S] the pauldron as one curved shell seated on the deltoid (385; ancient.minotaur.red.png: a team plate wrapped over his left shoulder top and down its
 * outer side, a darker rim along its foot, a lighter team scroll on its face; critic 383: a tilted plank sticking up off the shoulder with a dark block
 * standing off behind it). Spec at the build (dressMinotaur): radius, deep, low, over, thick, inX, atY, rim, scroll, scrollAt.
 */
/* [S] 404 the shell gave way to a flat wedge plate (spec at its build in dressMinotaur). */
const MINO_SHELL = { inX: 0.85, atY: 0.86, long: 0.85, lip: 0.3, lipBend: 0.45, thick: 0.14, rootDeep: 0.7, tipDeep: 0.95, faceUp: 0.3, droop: 0.18, swirl: 0.3 };
const MINO_LEATHER = new Color3(0.66, 0.46, 0.3);
const MINO_IRON = new Color3(0.42, 0.44, 0.47);

export function dressMinotaur(scene: Scene, body: ArticulatedBody, teamColor: Color3, props: Mesh[]): Mesh[] {
  const out: Mesh[] = [];
  const mf = getMaterialFactory();
  const fur = mf.get("cloth", MINO_FUR, { emissive: MINO_FUR.scale(MINO_FUR_GLOW) });
  // his whole body in fur: everything the body builder made, not his props (nor any piece of one: the hat's horns, the hammer's head), nor the eyes
  const propParts = new Set<unknown>(props.flatMap((p) => [p, ...p.getChildMeshes(false)]));
  for (const m of body.root.getChildMeshes(false)) {
    if (propParts.has(m) || /eye|pupil|brow/i.test(m.name)) continue;
    m.material = fur;
  }
  // [R] 402 the bull head is carried low on the shoulders (propBuilder BULL_HEAD .drop): the man's own head block would poke out above its cranium,
  // so it is hidden (its box still sizes the hat and the dress)
  body.headMesh.isVisible = false;
  // [S] 409 the barrel chest (spec at MINO_BARREL), built before any gear so every piece sized off the trunk (trunkBand) takes its new width and depth
  out.push(...minoBarrel(scene, body, fur));
  const team = mf.get("cloth", teamColor, { emissive: teamColor.scale(0.12) });
  const lightTeam = Color3.Lerp(teamColor, new Color3(1, 1, 1), MINO_BELT.lighter);
  const light = mf.get("cloth", lightTeam, { emissive: lightTeam.scale(0.15) });
  const leather = mf.get("cloth", MINO_LEATHER, { emissive: MINO_LEATHER.scale(0.12) });
  const iron = mf.get("cloth", MINO_IRON, { emissive: MINO_IRON.scale(0.15) });
  const darkFur = mf.get("cloth", MINO_FUR.scale(0.6), { emissive: MINO_FUR.scale(0.06) });
  const add = (m: Mesh, parent: TransformNode, material = team): Mesh => { m.parent = parent; m.material = material; out.push(m); return m; };

  // the belt (MINO_BELT)
  const B = MINO_BELT;
  const K = MINO_SCROLL;
  // [S] 389 the girdle sized off what it wraps (MINO_GIRDLE): in the torso's frame the pelvis and thigh tops stand .34 out in front at the waist, past
  // the 386 band (.24 out, sized off the trunk), which showed only as its rims and scroll tubes between the thighs; now a flared band from .hi of the
  // trunk down to .lo (navel to crotch, ancient.minotaur.red.png), round the pelvis block, .proudX/.proudZ of it out (the idle's flexed thigh tops
  // stand .33 out in front), the foot .flare wider; on the hip joint with the pelvis, so the trunk's idle lean does not swing it off the hips
  const Gd = MINO_GIRDLE;
  const trunk = body.neck.position.y;
  const y0 = trunk * Gd.lo, y1 = trunk * Gd.hi;
  const pelvis = body.root.getChildMeshes(false).find((m) => /_pelvis$/.test(m.name));
  const hipNode = (pelvis?.parent as TransformNode | null) ?? body.torso;
  let gx0 = -0.5, gx1 = 0.5, gz0 = -0.3, gz1 = 0.3;
  if (pelvis) {
    const bb = pelvis.getBoundingInfo().boundingBox;
    gx0 = pelvis.position.x + bb.minimum.x * pelvis.scaling.x; gx1 = pelvis.position.x + bb.maximum.x * pelvis.scaling.x;
    gz0 = pelvis.position.z + bb.minimum.z * pelvis.scaling.z; gz1 = pelvis.position.z + bb.maximum.z * pelvis.scaling.z;
  }
  const waist = { midX: (gx0 + gx1) / 2, halfX: ((gx1 - gx0) / 2) * Gd.proudX, midZ: (gz0 + gz1) / 2, halfZ: ((gz1 - gz0) / 2) * Gd.proudZ };
  const tall = y1 - y0;
  const beltY = (y0 + y1) / 2;
  // the half extents at height y: the top's at y1, .flare of them at y0
  const widen = (y: number) => 1 + (Gd.flare - 1) * Math.min(1, Math.max(0, (y1 - y) / tall));
  // [R] 402 one smooth band: 12 sides, hugging the hips, the rims flush (spec at MINO_GIRDLE)
  const girdleRing = (name: string, top: number, bottom: number, grow: number, material: typeof team) => {
    const m = MeshBuilder.CreateCylinder(name, { height: top - bottom, diameterTop: 2 * widen(top) * grow, diameterBottom: 2 * widen(bottom) * grow, tessellation: Gd.sides }, scene);
    m.scaling.set(waist.halfX, 1, waist.halfZ);
    m.position.set(waist.midX, (top + bottom) / 2, waist.midZ);
    m.convertToFlatShadedMesh();
    return add(m, hipNode, material);
  };
  girdleRing("minoBelt", y1, y0, 1, team);
  // [S] 386 (MINO_SCROLL): a deep rim along the foot and a thin one at the top, two big scrolls wound out from the middle, a small one beyond
  const G = MINO_GEAR;
  const dark = mf.get("cloth", teamColor.scale(K.rimShade), { emissive: teamColor.scale(0.05) });
  const lightScroll = Color3.Lerp(teamColor, new Color3(1, 1, 1), Gd.light);
  const scrollMat = mf.get("cloth", lightScroll, { emissive: lightScroll.scale(0.2) });
  girdleRing("minoBeltRim", y0 + tall * K.foot, y0, Gd.rimGrow, dark);
  girdleRing("minoBeltRim", y1, y1 - tall * K.top, Gd.rimGrow, dark);
  // on the band's front faces: z falls off from its front ridge as on a 12-gon (cos of the half-step); the face leans out toward the foot with the flare
  const faceZ = (x: number, y: number, lift: number) => {
    const w = widen(y);
    const across = Math.abs(x - waist.midX) / (waist.halfX * w);
    return waist.midZ + waist.halfZ * w * Math.sqrt(Math.max(0, 1 - across * across)) * Math.cos(Math.PI / Gd.sides) + lift;
  };
  // the band's open middle, between the rims
  const midY = beltY + tall * (K.foot - K.top) / 2;
  for (const mirror of [-1, 1]) {
    const spiral = (cxShare: number, round: number, tail: boolean): Vector3[] => {
      const cx = waist.midX + mirror * cxShare * waist.halfX;
      const pts: Vector3[] = [];
      if (tail) pts.push(new Vector3(waist.midX + mirror * waist.halfX * 0.02, midY - tall * round * 0.9, 0));
      for (let i = 0; i <= 20; i++) {
        const t = i / 20, rho = tall * round * (1 - 0.8 * t), phi = -Math.PI / 2 - mirror * Math.PI * 2 * K.turns * t;
        pts.push(new Vector3(cx + Math.cos(phi) * rho * mirror, midY + Math.sin(phi) * rho, 0));
      }
      return pts;
    };
    // [R] 402 flat light inlays: one tube per scroll, half-sunk into the band's face, no dark outline (spec at MINO_GIRDLE)
    for (const [cxShare, round, tail] of [[K.bigAt, K.big, true], [K.smallAt, K.small, false]] as const) {
      const pts = spiral(cxShare, round, tail);
      const path = pts.map((p) => new Vector3(p.x, p.y, faceZ(p.x, p.y, tall * K.line * Gd.sunk)));
      add(MeshBuilder.CreateTube("minoBeltScroll", { path, radius: tall * K.line, tessellation: 4, cap: 2 }, scene), hipNode, scrollMat);
    }
  }

  // the chest: its box at the breastbone, for the sash, buckle and tuft
  const chest = trunkBand(body, 0.45, 0.85);
  const front = chest.maxZ;
  // the tuft of chest hair on the breastbone
  const S = MINO_SASH;
  // [S] 385: a ragged clump of dark spikes fanned out from the breastbone (ancient.minotaur.red.png), not a flat chip hidden under the sash
  for (let k = 0; k < 7; k++) {
    const ang = -Math.PI / 2 + (Math.PI * 2 * k) / 7 + 0.3;
    const len = chest.halfX * S.tuft * (k % 2 ? 1.6 : 2.3);
    const spike = MeshBuilder.CreateCylinder("minoChestHair", { height: len, diameterTop: 0, diameterBottom: len * 0.55, tessellation: 3 }, scene);
    spike.scaling.z = 0.25;
    spike.rotation.z = ang - Math.PI / 2;
    spike.position.set(chest.midX + chest.halfX * K.tuftX + Math.cos(ang) * len * 0.45, chest.trunk * K.tuftY + Math.sin(ang) * len * 0.45, front + 0.01);
    add(spike, body.torso, darkFur);
  }

  // the pauldron on his left shoulder (the render's right) (MINO_PAULDRON)
  const P = MINO_PAULDRON;
  // [S] 383: body -x is his left (the 378 +x put it on his right in _idle, critic 382)
  const side = -1;
  const pw = chest.halfX * 2 * P.wide;
  // [S] 404 the pauldron as a flat wedge plate (CONFIRM 403 a.1: "a huge rounded team-coloured barrel, bigger than the head, riding over the shoulder and
  // the back of the head"; ancient.minotaur.red.png: a flat, palm-sized team plate jutting out level from the shoulder top, its outer end wider and bent
  // a little down, a lighter swirl on its top, well under the head). Spec, in the chest's half width hx and the trunk's depth:
  //   plate: a four-sided frustum lying along x from .inX of hx out to .inX + .long, its inner end .rootDeep of the trunk depth front to back widening to
  //     .tipDeep at the outer end, .thick of hx thick, its top tilted .faceUp rad toward the front so the camera reads it, drooping .droop rad outward,
  //     seated at .atY of the trunk (under the head, which hangs forward of the shoulder line);
  //   lip: the outer end bent .lipBend rad further down, .lip of hx long, the same section;
  //   rim: a darker team bar along the lip's outer edge;
  //   swirl: a lighter spiral tube .swirl of the plate's depth round, lying on the plate's top near its outer end.
  const M = MINO_SHELL;
  const hx = chest.halfX, deepT = chest.maxZ - chest.minZ;
  const cz = (chest.minZ + chest.maxZ) / 2;
  const plateNode = new TransformNode("minoPauldronPlate", scene);
  plateNode.parent = body.torso;
  plateNode.position.set(chest.midX + side * hx * M.inX, chest.trunk * M.atY, cz);
  plateNode.rotation.set(-M.faceUp, 0, -side * M.droop);
  const wedge = (name: string, long: number, rootD: number, tipD: number, thick: number): Mesh => {
    // a square frustum along +y, turned to lie along the side's x, then flattened in y and stretched in z (rootD/tipD set its two ends' depth)
    const m = MeshBuilder.CreateCylinder(name, { height: long, diameterBottom: 1, diameterTop: tipD / rootD, tessellation: 4 }, scene);
    m.rotation.y = Math.PI / 4;
    m.bakeCurrentTransformIntoVertices();
    m.scaling.set(thick / Math.SQRT1_2, 1, rootD / Math.SQRT1_2);
    m.bakeCurrentTransformIntoVertices();
    m.rotation.z = -side * Math.PI / 2;
    m.bakeCurrentTransformIntoVertices();
    m.convertToFlatShadedMesh();
    return m;
  };
  const plateLong = hx * M.long, thick = hx * M.thick;
  const plate = wedge("minoPauldron", plateLong, deepT * M.rootDeep, deepT * M.tipDeep, thick);
  plate.position.x = side * plateLong / 2;
  add(plate, plateNode);
  const lipNode = new TransformNode("minoPauldronLipJoint", scene);
  lipNode.parent = plateNode;
  lipNode.position.x = side * plateLong;
  lipNode.rotation.z = -side * M.lipBend;
  const lipLong = hx * M.lip;
  const lip = wedge("minoPauldronLip", lipLong, deepT * M.tipDeep, deepT * M.tipDeep * 1.04, thick);
  lip.position.x = side * lipLong / 2;
  add(lip, lipNode);
  const rimBar = MeshBuilder.CreateBox("minoPauldronRim", { width: thick * 1.3, height: thick * 1.5, depth: deepT * M.tipDeep * 1.06 }, scene);
  rimBar.position.x = side * lipLong;
  rimBar.convertToFlatShadedMesh();
  add(rimBar, lipNode, dark);
  // the lighter swirl lying on the plate's top, toward its outer end
  const swirlR = deepT * M.tipDeep * M.swirl;
  const swirlAt = new Vector3(side * plateLong * 0.66, thick * 0.5 + hx * 0.01, 0);
  const swirlPath: Vector3[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, rho = swirlR * (1 - 0.75 * t), phi = Math.PI * 2 * 1.1 * t;
    swirlPath.push(swirlAt.add(new Vector3(side * Math.cos(phi) * rho, 0, Math.sin(phi) * rho)));
  }
  add(MeshBuilder.CreateTube("minoPauldronScroll", { path: swirlPath, radius: swirlR * 0.16, tessellation: 4, cap: 2 }, scene), plateNode, light);

  // the sash, from that shoulder across the chest down to the other hip, laid on the chest's front
  // [S] 405 rebuilt as a wide slab standing proud of the chest (CONFIRM 403 a.2: "diagonal chest sash missing in _idle"; probe_bbox 405 in the torso
  // frame: the dropped bull face and neck cover the chest from x -.5 to +.17 and y .24 up, z out to .79; the chest's front is at z .26). Spec, in the
  // chest's half width hx: the strap .wide of the chest's width across, a solid slab from the chest's front out .proud of hx, running from the plate's
  // root over his left shoulder to his right hip (.footX of hx out, .footY of the trunk up), so its lower run - under and beside the muzzle - reads in
  // the front three-quarter; the grey square buckle rides that lower run at .buckleAt of the strap from its foot, in front of the slab's face.
  const W = MINO_STRAP;
  const top = { x: chest.midX + side * chest.halfX * 0.75, y: chest.trunk * 0.95 };
  // [S] 408 the strap's foot seated on the girdle's measured top (CONFIRM 405 a.3: the girdle "not readable"; probe_bbox 408: the slab's lower run
  // and buckle, y 1.15-1.83, lay over the band, y 1.05-1.53; ancient.minotaur.red.png: the strap ends at the right flank above the swirl belt): the
  // band's top front point is carried from the hip joint's frame into the torso's, and the foot stands .clear of the trunk over it plus the slab's own
  // half width, so the slab's lowest corner clears the band and the whole belt reads under it.
  for (let n: Node | null = hipNode; n; n = n.parent) if (n instanceof TransformNode) n.computeWorldMatrix(true);
  for (let n: Node | null = body.torso; n; n = n.parent) if (n instanceof TransformNode) n.computeWorldMatrix(true);
  const bandTop = Vector3.TransformCoordinates(
    Vector3.TransformCoordinates(new Vector3(waist.midX, y1, waist.midZ + waist.halfZ), hipNode.getWorldMatrix()),
    body.torso.getWorldMatrix().clone().invert(),
  ).y;
  const foot = { x: chest.midX - side * chest.halfX * W.footX, y: Math.max(chest.trunk * W.footY, bandTop + chest.trunk * W.clear + chest.halfX * W.wide) };
  const len = Math.hypot(top.x - foot.x, top.y - foot.y);
  const slabD = S.thick * chest.halfX + W.proud * chest.halfX;
  const sash = MeshBuilder.CreateBox("minoSash", { width: chest.halfX * 2 * W.wide, height: len, depth: slabD }, scene);
  sash.position.set((top.x + foot.x) / 2, (top.y + foot.y) / 2, front + slabD * 0.5);
  sash.rotation.z = Math.atan2(top.x - foot.x, top.y - foot.y) * -1;
  sash.convertToFlatShadedMesh();
  add(sash, body.torso, leather);
  // [S] 383 (MINO_GEAR): a chunky grey square frame buckle, four bars round an open middle the sash shows through, and a prong
  // [S] 405 on the strap's lower run (.buckleAt), in front of the slab's face
  const bw = chest.halfX * 2 * G.buckle, bar = bw * G.bar, bd = S.thick * chest.halfX * 3;
  const bu = W.buckleAt;
  const bx = foot.x + (top.x - foot.x) * bu, by = foot.y + (top.y - foot.y) * bu;
  const holder = new TransformNode("minoBuckle", scene);
  holder.parent = body.torso;
  holder.position.set(bx, by, front + slabD + bd / 2);
  holder.rotation.z = sash.rotation.z;
  for (const [w, h, x, y] of [[bw, bar, 0, (bw - bar) / 2], [bw, bar, 0, -(bw - bar) / 2], [bar, bw, (bw - bar) / 2, 0], [bar, bw, -(bw - bar) / 2, 0]]) {
    const b = MeshBuilder.CreateBox("minoBuckle", { width: w, height: h, depth: bd }, scene);
    b.position.set(x, y, 0);
    add(b, holder, iron);
  }
  const prong = MeshBuilder.CreateBox("minoBuckleProng", { width: bw * 0.55, height: bar * 0.6, depth: bd * 0.7 }, scene);
  prong.position.set(bw * 0.15, 0, bd * 0.1);
  add(prong, holder, iron);

  // [S] 407 slim bull legs on split hooves (MINO_LEGS)
  const Lg = MINO_LEGS;
  for (const [thigh, shin, knee] of [[body.leftUpperLeg, body.leftLowerLeg, body.leftKnee], [body.rightUpperLeg, body.rightLowerLeg, body.rightKnee]] as const) {
    thigh.scaling.x *= Lg.thigh; thigh.scaling.z *= Lg.thigh;
    shin.scaling.x *= Lg.shin; shin.scaling.z *= Lg.shin;
    const foot = knee.getChildMeshes(true).find((m): m is Mesh => m instanceof Mesh && /_[lr]FootM$/.test(m.name));
    if (!foot) continue;
    foot.isVisible = false;
    const fb = foot.getBoundingInfo().boundingBox, ex = fb.extendSize, c = fb.center;
    const at = (x: number, y: number, z: number): Vector3 => new Vector3(foot.position.x + x * foot.scaling.x, foot.position.y + y * foot.scaling.y, foot.position.z + z * foot.scaling.z);
    const S = new Vector3(ex.x * foot.scaling.x, ex.y * foot.scaling.y, ex.z * foot.scaling.z);
    // the hoof: two toes either side of a cleft, their fronts sloped back
    for (const side of [-1, 1]) {
      const toe = MeshBuilder.CreateBox("minoHoofToe", { width: S.x * Lg.toeWide, height: S.y * Lg.toeTall, depth: S.z * Lg.toeDeep }, scene);
      toe.position.copyFrom(at(c.x + side * ex.x * Lg.cleft, fb.minimum.y + ex.y * Lg.toeTall * 0.5, c.z + ex.z * Lg.toeAhead));
      toe.rotation.x = Lg.toeSlope;
      add(toe, knee, darkFur);
      toe.convertToFlatShadedMesh();
    }
    // the raised heel: a slim pastern slanting from the hock behind the ankle down and forward onto the hoof, a knob of hock at its top
    const hockAt = at(c.x, fb.maximum.y + ex.y * Lg.hockUp, fb.minimum.z + ex.z * Lg.hockBack);
    const hoofTop = at(c.x, fb.minimum.y + ex.y * Lg.toeTall, c.z + ex.z * (Lg.toeAhead - 0.2));
    const run = hoofTop.subtract(hockAt);
    const pastern = MeshBuilder.CreateCylinder("minoPastern", { height: run.length(), diameterTop: S.x * Lg.pastern, diameterBottom: S.x * Lg.pastern * 0.8, tessellation: 6 }, scene);
    pastern.rotationQuaternion = Quaternion.Identity();
    Quaternion.FromUnitVectorsToRef(new Vector3(0, -1, 0), run.normalize(), pastern.rotationQuaternion);
    pastern.position = Vector3.Center(hockAt, hoofTop);
    add(pastern, knee, fur);
    pastern.convertToFlatShadedMesh();
    const hock = MeshBuilder.CreateIcoSphere("minoHock", { radius: S.x * Lg.hock, subdivisions: 1, flat: true }, scene);
    hock.position.copyFrom(hockAt);
    add(hock, knee, fur);
  }
  return out;
}

/*
 * [S] 409 the minotaur's barrel chest (CONFIRM 408 a.1: "a narrow upright rectangular box, barely wider than the hips - TABS: a hulking barrel chest
 * with massive hunched shoulder masses and a thick neck merging into the head"; ancient.minotaur.blue.png: the upper body far wider than the hips,
 * deep in front, sloping straight up into a thick neck). On the torso joint:
 *   trunk: the body's trunk box and yoke widened .wide and deepened .deep (so the pauldron, sash and chest hair, all sized off them by trunkBand, sit on
 *     the new chest) and hidden; the shoulder joints moved out .wide with them so the arms hang off the barrel's sides;
 *   barrel: a lathe round the trunk, its radius .profile ([share of the trunk height, share of the widened half width]) - narrow at the waist, widest
 *     across the chest, rounding in over the shoulders - squashed to the widened depth, its front pushed .ahead of the trunk depth for the pecs;
 *   hump: a flattened mass .hump ([x, y, z] of the half extents) over the back of the shoulders at .humpY of the trunk, the hunched trapezius;
 *   neck: a frustum from .neckFrom to .neckTo of the trunk height, .neckBottom to .neckTop of the half width across, leant .neckLean forward, merging
 *     the barrel's top into the bull head's own neck.
 */
const MINO_BARREL = {
  wide: 1.35, deep: 1.8, ahead: 0.08,
  profile: [[0.0, 0.8], [0.25, 0.9], [0.5, 1.0], [0.78, 1.02], [0.95, 0.9], [1.06, 0.62], [1.12, 0.3]] as [number, number][],
  hump: [0.95, 0.24, 0.7] as const, humpY: 0.98, neckFrom: 0.92, neckTo: 1.3, neckBottom: 0.95, neckTop: 0.62, neckLean: 0.25,
};
function minoBarrel(scene: Scene, body: ArticulatedBody, fur: Material): Mesh[] {
  const R = MINO_BARREL;
  const out: Mesh[] = [];
  const trunkParts = body.torso.getChildMeshes(true).filter((m) => m === body.torsoMesh || /_yoke$/.test(m.name));
  for (const m of trunkParts) {
    m.scaling.x *= R.wide;
    m.scaling.z *= R.deep;
    m.isVisible = false;
  }
  for (const sh of [body.leftShoulder, body.rightShoulder]) sh.position.x *= R.wide;
  const band = trunkBand(body, 0.2, 0.9);
  const trunk = band.trunk;
  const hx = band.halfX, hz = (band.maxZ - band.minZ) / 2, mz = (band.minZ + band.maxZ) / 2;
  const shape = R.profile.map(([y, r]) => new Vector3(r * hx, y * trunk, 0));
  const barrel = MeshBuilder.CreateLathe("minoBarrel", { shape, tessellation: 10, cap: Mesh.CAP_ALL }, scene);
  barrel.convertToFlatShadedMesh();
  barrel.scaling.z = hz / hx;
  barrel.position.set(band.midX, 0, mz + hz * R.ahead);
  barrel.parent = body.torso;
  barrel.material = fur;
  out.push(barrel);
  const hump = MeshBuilder.CreateIcoSphere("minoHump", { radius: 1, subdivisions: 1, flat: true }, scene);
  hump.scaling.set(hx * R.hump[0], trunk * R.hump[1], hz * R.hump[2]);
  hump.position.set(band.midX, trunk * R.humpY, mz - hz * 0.15);
  hump.parent = body.torso;
  hump.material = fur;
  out.push(hump);
  const neckH = trunk * (R.neckTo - R.neckFrom);
  const neck = MeshBuilder.CreateCylinder("minoNeck", { height: neckH, diameterBottom: 2 * hx * R.neckBottom, diameterTop: 2 * hx * R.neckTop, tessellation: 8 }, scene);
  neck.convertToFlatShadedMesh();
  neck.scaling.z = (hz / hx) * 0.9;
  neck.rotation.x = R.neckLean;
  neck.position.set(band.midX, trunk * R.neckFrom + neckH / 2, mz + Math.sin(R.neckLean) * neckH / 2);
  neck.parent = body.torso;
  neck.material = fur;
  out.push(neck);
  return out;
}

/*
 * [S] 407 the minotaur's slim legs on split hooves (CONFIRM 405 a.4: "thick pillar legs with large block feet"; ancient.minotaur.red.png, .blue.png: slim
 * furred legs, the heel raised off the ground, each ending in a small cloven hoof). His bulk makes the leg blocks a man's pillars, so the thigh and shin
 * meshes are thinned (.thigh, .shin of their width and depth); the foot block is hidden and, in its own box (S its half extents), replaced by
 *   hoof: two dark toes .toeWide of the foot across either side of a cleft (.cleft of the half width out), .toeTall high, .toeDeep deep, set .toeAhead
 *     forward, their fronts sloped .toeSlope rad;
 *   pastern: a slim fur column .pastern of the foot across from the hock - .hockUp over the foot's top and .hockBack toward its heel - down and forward
 *     onto the toes, so the heel stands off the ground as a bull's does, with a fur knob .hock across at the hock.
 */
const MINO_LEGS = {
  thigh: 0.7, shin: 0.58,
  toeWide: 0.62, toeTall: 0.55, toeDeep: 0.85, cleft: 0.36, toeAhead: 0.35, toeSlope: -0.3,
  pastern: 0.75, hockUp: 0.5, hockBack: 0.25, hock: 0.5,
};

/*
 * [S] Zeus's beard and locks (379; ancient.zeus.red.png, card Appearance "luscious locks of dirty blond hair and grand beard with hairs that resemble
 * lightning bolts ... an olive wreath around the sides of their head"; critic 378: no beard, a short brown cap, a flat green band). In the head's half
 * extents (x across, y up, z his front), all dirty blond ZEUS_HAIR self-lit .glow:
 *   - the beard (rebuilt 387, spec at ZEUS_BEARD);
 *   - ZEUS_LOCKS.strands bolt locks all round the back and sides from .rootY of the half height (none over the face, a gap of .face rad each side of
 *     the front), .long head heights long to the shoulders, .thick at the root;
 *   - the laurel hat's cap recoloured blond (it carries the wreath), and .leaves olive leaf clumps along each temple under the wreath.
 */
const ZEUS_HAIR = new Color3(0.62, 0.48, 0.3);
const ZEUS_HAIR_GLOW = 0.16;
/*
 * [S] 387 the beard rebuilt as a dense shaggy mass (ancient.zeus.red.png: a huge dirty-blond beard from the cheeks under the eyes and the chin down to
 * mid-chest, a heap of jagged bolt-like flakes; critic 386: a sparse fringe of thin pale needle strands). In the head's half extents e:
 *   - the jaw mass ZEUS_BEARD.jaw of e, its middle .jawY down and .jawZ ahead; a bib mass .bib of e below it, its middle .bibY down, .bibZ ahead;
 *   - .rows rows of .perRow broad flat zig-zag slabs over them, from .top to .foot of e.y, each round an arc of .arc rad (narrowing .narrow toward
 *     the foot), .halfW of e.x out to a side; a slab two flat links .slab (W across, H long, W thick), the lower one bent .kink rad aside, tilted
 *     up to .tilt rad at random, leaning its foot out .lean rad; every other slab a shade .dark darker.
 * [R] 398 the mass ends at the collarbone (.foot -1.95, bib .78 tall at 1.42 down) as it does in ancient.zeus.red.png, not at the belt: it was hanging
 * over the whole drape and hid the bolt emblem the toga needs to show.
 */
const ZEUS_BEARD = {
  jaw: [1.22, 0.7, 0.72] as const, jawY: 0.62, jawZ: 0.5, bib: [0.95, 0.78, 0.55] as const, bibY: 1.42, bibZ: 0.62,
  rows: 6, perRow: 7, top: -0.25, foot: -1.95, arc: 1.45, narrow: 0.45, halfW: 1.22, slab: [0.24, 0.3, 0.05] as const, kink: 0.55, tilt: 0.45, lean: 0.3, dark: 0.82,
};
const ZEUS_LOCKS = { strands: 16, rootY: 0.3, face: 0.95, long: 1.05, thick: 0.2 };
const ZEUS_LEAF = { leaves: 4, size: 0.16, color: new Color3(0.38, 0.52, 0.2) };

function shareOf(seed: number, i: number): number {
  const v = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

/*
 * [S] Zeus's toga (385; ancient.zeus.red.png: a bright white toga over his left shoulder only, draped diagonally across the chest to the right hip, the
 * right shoulder and chest bare team skin; a gold lightning emblem on the left shoulder; a triple gold belt round the waist over the white knee skirt;
 * critic 378: a grey box vest over both shoulders and a brown strap). The trunk turns to bare skin; on the torso joint, round the trunk's box (one box
 * over the whole trunk, trunkBand 0-1):
 *   - the drape: a band round the trunk .proud of its half extents (a rounded box section, exponent .round), its middle line falling from .high of the
 *     trunk at his left side (-x) to .low at his right, .wide of the trunk tall, clamped under .top of the trunk so it lies over the shoulder;
 *   - the emblem: a gold zig-zag of .bolt links .boltLong of the trunk long on the drape's front at his left shoulder;
 *   - the belt: .rings gold rings .ring of the trunk tall at .beltAt of it, .ringProud out, a hair's gap between them.
 * White and gold fixed (not team), self-lit .glow. The pelvis and skirt keep the white body cloth.
 * [S] 388 the toga filled (ancient.zeus.red.png: the white covers all the trunk below the diagonal, from over his left shoulder down to his right hip,
 * to the belt; the bolt a bright orange-gold zig-zag on the shoulder; critic 387: a band half the trunk wide, bare belly above the belt, emblem thin
 * and dark): the drape's lower edge now runs level at .foot of the trunk (just under the belt), its upper edge the diagonal from .edgeHigh of the trunk
 * at his left side to .edgeLow at his right (clamped under .top); the bolt .bolt links .boltLong of the trunk long, .boltWide of a link step wide, at
 * .boltX of the half width out on his left, on the belt's own gold at .85 self-light (400; the flat unlit cut washed pale under ACES).
 */
const ZEUS_TOGA = {
  proud: 1.07, round: 4, foot: 0.0, edgeHigh: 1.45, edgeLow: 0.24, top: 1.04, segs: 28,
  bolt: 4, boltTop: 0.98, boltTr: 0.3, boltX: 0.66, boltOut: 0.98, boltWide: 0.15, boltStand: 0.075, boltGap: 0.08,
  rings: 3, ring: 0.075, beltAt: 0.06, ringProud: 1.14,
  whiteGlow: 1,
  white: new Color3(0.94, 0.94, 0.92), gold: new Color3(0.88, 0.58, 0.1), glow: 0.14,
  boltGold: new Color3(0.62, 0.26, 0.03),
};

/** [S] 406 the lowest point of Zeus's beard (every zeusBeard* mesh's world box corners) in the torso's frame, or null when he has none. */
function zeusBeardFootInTorso(body: ArticulatedBody): number | null {
  const chain: Node[] = [];
  for (let n: Node | null = body.headMesh; n; n = n.parent) chain.unshift(n);
  for (const n of chain) (n as TransformNode).computeWorldMatrix?.(true);
  const toTorso = body.torso.computeWorldMatrix(true).clone().invert();
  let foot: number | null = null;
  for (const m of body.headMesh.getChildMeshes(false)) {
    if (!/^zeusBeard/.test(m.name)) continue;
    m.computeWorldMatrix(true);
    for (const c of m.getBoundingInfo().boundingBox.vectorsWorld) {
      const y = Vector3.TransformCoordinates(c, toTorso).y;
      foot = foot === null ? y : Math.min(foot, y);
    }
  }
  return foot;
}

/** Zeus's white toga over the left shoulder, gold bolt emblem and triple gold belt (spec at ZEUS_TOGA), on the torso. */
export function dressZeusToga(scene: Scene, body: ArticulatedBody): Mesh[] {
  const T = ZEUS_TOGA;
  const out: Mesh[] = [];
  const mf = getMaterialFactory();
  // a flat unlit white, out of the glow layer: the lit cloth read grey under the beard's shadow and the ribbon's turned faces (388 step 5)
  const white = mf.get("unlit", T.white, { emissive: T.white.scale(T.whiteGlow) });
  const gold = mf.get("cloth", T.gold, { emissive: T.gold.scale(T.glow) });
  body.torsoMesh.material = body.skinMaterial;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke$|zeusSash/.test(m.name)) m.material = body.skinMaterial;
  // [S] 389 the body's off-white torus belt sat over the gold rings as a wide grey band: the rings are his only belt
  for (const m of body.torso.getChildMeshes(true)) if (/_belt$/.test(m.name)) m.isVisible = false;
  const band = trunkBand(body, 0, 1);
  const halfZ = (band.maxZ - band.minZ) / 2, midZ = (band.minZ + band.maxZ) / 2;
  const tr = band.trunk;
  // a rounded-box section point at angle a, x .proud of the half width
  const rim = (a: number, p: number) => {
    const c = Math.cos(a), s = Math.sin(a);
    const e = 2 / T.round;
    return { x: band.midX + band.halfX * p * Math.sign(c) * Math.abs(c) ** e, z: midZ + halfZ * p * Math.sign(s) * Math.abs(s) ** e };
  };
  // the upper edge: the diagonal, high at his left (-x), low at his right
  const edgeAt = (x: number) => {
    const u = (x - band.midX) / band.halfX; // -1 his left, +1 his right
    return tr * Math.min(T.top, T.edgeHigh + (T.edgeLow - T.edgeHigh) * (u + 1) / 2);
  };
  const upper: Vector3[] = [], lower: Vector3[] = [];
  for (let i = 0; i <= T.segs; i++) {
    const a = (Math.PI * 2 * i) / T.segs;
    const p = rim(a, T.proud);
    upper.push(new Vector3(p.x, edgeAt(p.x), p.z));
    lower.push(new Vector3(p.x, tr * T.foot, p.z));
  }
  // [S] 389 one side only, faces out: the double-sided ribbon laid an inward copy of every face at the same depth, and where it won, the SSAO pass
  // read a normal pointing into the trunk and greyed the white in blotches (probe: white with SSAO off, grey with it on)
  const drape = MeshBuilder.CreateRibbon("zeusToga", { pathArray: [upper, lower] }, scene);
  const nrm = drape.getVerticesData("normal"), pos = drape.getVerticesData("position");
  if (nrm && pos && nrm[0] * (pos[0] - band.midX) + nrm[2] * (pos[2] - midZ) < 0) drape.flipFaces(true);
  drape.convertToFlatShadedMesh();
  drape.material = white;
  scene.getGlowLayerByName("glow")?.addExcludedMesh(drape);
  drape.parent = body.torso;
  out.push(drape);
  // the shoulder cap: the drape's top closed over his left shoulder
  const cap = MeshBuilder.CreateBox("zeusTogaShoulder", { width: band.halfX * 0.9, height: tr * 0.06, depth: halfZ * 2 * T.proud }, scene);
  cap.position.set(band.midX - band.halfX * 0.55, tr * T.top, midZ);
  cap.material = white;
  scene.getGlowLayerByName("glow")?.addExcludedMesh(cap);
  cap.parent = body.torso;
  out.push(cap);
  // [R] 398 the emblem, belt and skirt rebuilt against the critic's 391 rejection ("a pale sliver half under the beard, the bands khaki"):
  //  - the emblem: .bolt chunky links of the trunk's .boltWide across, zig-zagging from .boltTop of the trunk up down .boltTr, out to .boltX/.boltOut of
  //    the half width on his left, laid on the drape's own surface (the rounded-box section sampled at each node's x) so it can never sink into the
  //    ribbon or the trunk; the beard's foot was raised to the collarbone (ZEUS_BEARD) so the chest it sits on is clear;
  //  - its colour: lit cloth self-lit .55 of a deep orange-red (0.95, 0.22, 0.03). An "unlit" emissive washed pale under ACES, and the Zeus bolts'
  //    bloom veils anything small and light on this chest, so the emblem is cut deep and large to hold its hue in the shot;
  //  - the belt: .rings gold rings .ring of the trunk tall at .beltAt up, .ringProud proud, self-lit .85 so they read gold and not khaki.
  // [S] 400 the critic's 399 rejection ("at .55 the emblem still reads dusty pink-grey beside the belt's .85 gold, and the hand's bloom veils its lower
  // half") answered on three levers at once: the SAME gold and self-light as the belt (.85 is the value that survives ACES here), the emblem lifted off
  // the chest by .boltStand (7.5 cm: the ribbon's chords dip inside the rim the plate is sampled from, so a bolt a few cm proud still read as a ghost at
  // 398/399), and the whole zig-zag held high on the open shoulder line (.boltTop .98 down .boltTr .30), above the lowered hand's bolt at his hip whose
  // bloom washed the bottom of the old .72-cut emblem. Links are thicker across and in depth so the cut reads as a plate, not a decal.
  // [S] 406 the emblem seated off the beard's measured foot (critic 405 a.3: "its top touches the beard's foot"; ancient.zeus.red.png: the bolt clear of
  // the beard): the lowest corner of every beard mesh (zeusBeard*, hung on the head by dressZeus before this runs) read into the torso's frame, and the
  // zig-zag's top held .boltGap of the trunk under it (never above .boltTop), as eyeTopInHead seats a cap off the eyes
  const beardFoot = zeusBeardFootInTorso(body);
  const top = Math.min(tr * T.boltTop, beardFoot === null ? Infinity : beardFoot - tr * T.boltGap), tall = tr * T.boltTr;
  const surfaceZ = (x: number): number => {
    let best = midZ + halfZ * T.proud, bestDx = Infinity;
    for (let s = 0; s <= 48; s++) {
      const p = rim(Math.PI * s / 48, T.proud);
      const dx = Math.abs(p.x - x);
      if (dx < bestDx) { bestDx = dx; best = p.z; }
    }
    return best + T.boltStand;
  };
  const at = (i: number): Vector3 => {
    const x = band.midX - band.halfX * (i % 2 ? T.boltOut : T.boltX);
    return new Vector3(x, top - tall * (i / T.bolt), surfaceZ(x));
  };
  // [S] 400 the belt's own .85 gold, not a softer self-light: the two read side by side in the idle, so they must be one hue
  // [S] 400b the lit gold blew out to pale cream up at the shoulder (the belt's own material reads gold only in the trunk's shade): the emblem is an
  // unlit plate with emissive = its colour, the palette's right wall (a PBR "unlit" without emissive renders black), at a deeper code value so ACES
  // lands on a saturated orange-gold in full sun
  const boltMat = mf.get("unlit", T.boltGold, { emissive: T.boltGold });
  for (let k = 0; k < T.bolt; k++) {
    const from = at(k), to = at(k + 1);
    const d = to.subtract(from);
    const link = MeshBuilder.CreateBox("zeusTogaBolt", { width: tr * T.boltWide, height: d.length() * 1.3, depth: 0.03 }, scene);
    link.position.copyFrom(Vector3.Center(from, to));
    link.rotation.z = -Math.atan2(d.x, -d.y);
    link.material = boltMat;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(link);
    // [S] 405 the emblem drawn over the bloom (critic 400 a.3: "the bolt reads red-pink rather than orange-gold"; probe_close 405: orange with the glow
    // off, salmon-pink with it on - the raised hand's blue-white bolt bloom laid additively over the orange). Group 1 is drawn after the glow merge
    // (main.ts glowLayer.renderingGroupId 0) and shares the depth buffer, so the raised forearm still hides it where it is in front.
    link.renderingGroupId = 1;
    link.parent = body.torso;
    out.push(link);
  }
  // the triple gold belt, self-lit so it reads gold and not khaki (391)
  const goldUnlit = mf.get("cloth", T.gold, { emissive: T.gold.scale(0.85) });
  for (let k = 0; k < T.rings; k++) {
    const ring = MeshBuilder.CreateCylinder("zeusBelt", { height: tr * T.ring, diameter: 2, tessellation: 12 }, scene);
    ring.scaling.set(band.halfX * T.ringProud, 1, halfZ * T.ringProud);
    ring.position.set(band.midX, tr * (T.beltAt + (k - 1) * T.ring * 1.2), midZ);
    ring.convertToFlatShadedMesh();
    ring.material = goldUnlit;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(ring);
    ring.parent = body.torso;
    out.push(ring);
  }
  return out;
}

/*
 * [S] Zeus's bare legs in strap sandals (386; ancient.zeus.red.png: bare team legs from the skirt's hem to the feet, short brown strap sandals with a
 * strap round the ankle; card "Zeus also wears short sandals"; critic 378: dark-blue trousers and grey boots). The four leg meshes take the body's
 * skin (the clothed branch had painted them trousers), the feet the hoplite's strapSandals in ZEUS_SANDAL.brown, plus ZEUS_SANDAL.laces thin brown
 * bands round each shin at those shares of its length (the sandal's ankle wrap), .lace long, .out of its half-width; self-lit .glow.
 */
const ZEUS_SANDAL = { laces: [0.86, 0.95], lace: 0.05, out: 1.14, brown: new Color3(0.44, 0.24, 0.13), glow: 0.12 };

/** Zeus's bare team legs and short brown strap sandals (spec at ZEUS_SANDAL). */
export function zeusLegs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = ZEUS_SANDAL;
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) leg.material = body.skinMaterial;
  const lace = getMaterialFactory().get("cloth", S.brown, { emissive: S.brown.scale(S.glow) });
  const out = strapSandals(scene, body, S.brown, S.glow, "zeus");
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    for (const at of S.laces) out.push(limbShell(scene, "zeusSandalLace", shin, at, at + S.lace, S.out, lace));
  }
  return out;
}

/** Zeus's dirty-blond bolt-hair beard, locks and temple leaves (spec at ZEUS_BEARD), on the head. */
export function dressZeus(scene: Scene, body: ArticulatedBody, props: Mesh[]): Mesh[] {
  const out: Mesh[] = [];
  const mf = getMaterialFactory();
  const hair = mf.get("cloth", ZEUS_HAIR, { emissive: ZEUS_HAIR.scale(ZEUS_HAIR_GLOW) });
  const head = body.headMesh;
  const e = head.getBoundingInfo().boundingBox.extendSize;
  const W = e.x * 2, H = e.y * 2;
  const put = (m: Mesh, material = hair) => { m.material = material; m.parent = head; out.push(m); return m; };
  // a zig-zag bolt of tapered links from `from` along `dir`, kinked side to side along `side`
  const bolt = (from: Vector3, dir: Vector3, side: Vector3, long: number, thick: number, kinks: number, zig: number, seed: number) => {
    let at = from;
    const step = long / kinks;
    for (let k = 0; k < kinks; k++) {
      const flip = (k % 2 === 0 ? 1 : -1) * (shareOf(seed, k) > 0.15 ? 1 : -1);
      const to = at.add(dir.scale(step)).add(side.scale(flip * zig * step));
      const d = to.subtract(at);
      const link = MeshBuilder.CreateCylinder("zeusBolt", { height: d.length() * 1.08, diameterTop: thick * (1 - k / kinks), diameterBottom: thick * (1 - (k + 0.8) / kinks), tessellation: 4 }, scene);
      link.rotationQuaternion = Quaternion.Identity();
      Quaternion.FromUnitVectorsToRef(Vector3.Up(), d.normalize().scale(-1), link.rotationQuaternion);
      link.position = Vector3.Center(at, to);
      put(link);
      at = to;
    }
  };
  // the jaw and bib masses (spec at ZEUS_BEARD)
  const B = ZEUS_BEARD;
  const darkHair = mf.get("cloth", ZEUS_HAIR.scale(B.dark), { emissive: ZEUS_HAIR.scale(B.dark * ZEUS_HAIR_GLOW) });
  const jaw = MeshBuilder.CreateIcoSphere("zeusBeard", { radius: 1, subdivisions: 1, flat: true }, scene);
  jitterVertices(jaw, 0.16, 61.7, e.x * B.jaw[0], e.y * B.jaw[1], e.z * B.jaw[2]);
  jaw.position.set(0, -e.y * B.jawY, e.z * B.jawZ);
  put(jaw);
  const bib = MeshBuilder.CreateIcoSphere("zeusBeardBib", { radius: 1, subdivisions: 1, flat: true }, scene);
  jitterVertices(bib, 0.2, 17.3, e.x * B.bib[0], e.y * B.bib[1], e.z * B.bib[2]);
  bib.position.set(0, -e.y * B.bibY, e.z * B.bibZ);
  put(bib, darkHair);
  // the shag: rows of broad flat zig-zag slabs over both, cheeks to mid-chest
  for (let r = 0; r < B.rows; r++) {
    const u = r / (B.rows - 1);
    const y = e.y * (B.top + (B.foot - B.top) * u);
    const arc = B.arc * (1 - B.narrow * u);
    // the surface ahead: the jaw's front at the top rows, the bib's below
    const depth = u < 0.35 ? e.z * (B.jawZ + B.jaw[2] * 0.85) : e.z * (B.bibZ + B.bib[2] * 0.85);
    for (let i = 0; i < B.perRow; i++) {
      const k = r * B.perRow + i;
      const a = ((i + 0.5 + (r % 2) * 0.5) / (B.perRow + 0.5) - 0.5) * 2 * arc;
      const slab = new TransformNode("zeusBeardSlab", scene);
      slab.parent = head;
      slab.position.set(Math.sin(a) * e.x * B.halfW * (1 - 0.3 * u), y, Math.cos(a) * depth);
      slab.rotation.set(-B.lean, a, (shareOf(5.7, k) - 0.5) * 2 * B.tilt);
      const mat = k % 2 ? darkHair : hair;
      const sw = W * B.slab[0] * (0.8 + 0.4 * shareOf(2.9, k)), sl = H * B.slab[1] * (0.85 + 0.3 * shareOf(8.1, k)), st = W * B.slab[2];
      const upper = MeshBuilder.CreateBox("zeusBeardFlake", { width: sw, height: sl, depth: st }, scene);
      upper.position.y = -sl * 0.4;
      upper.parent = slab;
      upper.material = mat;
      out.push(upper);
      const side = shareOf(4.4, k) > 0.5 ? 1 : -1;
      const lower = MeshBuilder.CreateBox("zeusBeardFlake", { width: sw * 0.7, height: sl * 0.8, depth: st }, scene);
      lower.position.set(side * sw * 0.25, -sl * 1.15, st * 0.3);
      lower.rotation.z = side * B.kink;
      lower.parent = slab;
      lower.material = mat;
      out.push(lower);
    }
  }
  // the locks round the back and sides, to the shoulders
  const L = ZEUS_LOCKS;
  for (let i = 0; i < L.strands; i++) {
    const a = L.face + ((i + 0.5) / L.strands) * (Math.PI * 2 - 2 * L.face); // 0 = the face
    const root = new Vector3(Math.sin(a) * e.x * 1.0, e.y * L.rootY, Math.cos(a) * e.z * 1.0);
    const dir = new Vector3(Math.sin(a) * 0.3, -1, Math.cos(a) * 0.3).normalize();
    const side = new Vector3(Math.cos(a), 0, -Math.sin(a));
    bolt(root, dir, side, H * L.long * (0.8 + 0.4 * shareOf(3.3, i)), W * L.thick, 3, 0.45, 21.1 + i);
  }
  // the laurel hat's cap in his own blond (the wreath stays on it)
  for (const p of props) for (const m of [p, ...p.getChildMeshes(false)]) if (m.name === "laurelHair") m.material = hair;
  // olive leaf clumps along each temple
  const leaf = mf.get("cloth", ZEUS_LEAF.color, { emissive: ZEUS_LEAF.color.scale(0.12) });
  for (const sx of [-1, 1]) {
    for (let i = 0; i < ZEUS_LEAF.leaves; i++) {
      const u = i / (ZEUS_LEAF.leaves - 1);
      const m = MeshBuilder.CreateIcoSphere("zeusLeaf", { radius: W * ZEUS_LEAF.size * 0.5, subdivisions: 1, flat: true }, scene);
      m.scaling.set(0.55, 0.8, 1.3);
      m.rotation.set(0.4 - u * 0.8, sx * 0.3, sx * 0.5);
      m.position.set(sx * e.x * 1.04, e.y * (0.5 + 0.12 * Math.sin(u * Math.PI)), e.z * (0.55 - u * 0.95));
      put(m, leaf);
    }
  }
  return out;
}

/*
 * [S] the sarissa's cape (383; ancient.sarissa.png, .red.png: a dark team cape from the shoulders to the calves hanging down his back and out past
 * both arms, a thick folded collar round the neck over the shoulders; critic 378: no cape). On the torso joint, in the trunk's box at the shoulders:
 *   - the cape an open shell SARISSA_CAPE.arc of a turn round his back, .out of the trunk's half extents at the top, flaring .flare at the hem, from
 *     .top of the trunk down to .hem of the leg's length under the hip line (the calves), .sides facets;
 *   - the collar a frustum round the neck, .collar of the trunk tall, from .neck of the shoulder span across at its top out to .collarOut at its foot,
 *     a roll .roll of the trunk thick round its foot;
 * team cloth x .shade, self-lit .glow, double-sided.
 */
const SARISSA_CAPE = { arc: 0.56, out: 1.18, flare: 1.45, top: 0.98, hem: 0.72, sides: 9, shade: 0.45, glow: 0.06 };
/*
 * [R] 390 the mantle (rebuilds the 383 collar frustum + roll, the 387 SARISSA_FOLD shoulder bulk and the 389 SARISSA_CHUNK drape; critic 389: the fold
 * grey-blue and lighter than the dark cape, ending in a leaf point, a separate horizontal bar above it). Read off ancient.sarissa.blue.png, .red.png
 * and .png: the cape's top is one dark wedge of cloth lying over his left shoulder, from behind it (where the cape hangs) over the shoulder top and
 * down his chest; its upper edge runs along the neckline from the left shoulder across to his right collarbone, its lower edge from the outside of the
 * left upper arm down to the left armpit (about .4 of the trunk under the shoulder) and up across the chest to the same collarbone, where a small gold
 * ring pins the two edges; the lower edge reads as a thick rolled fold; his right shoulder bare tunic. No collar ring round the neck, no point.
 * Shape: one sheet between two six-point edge paths (.top, .foot), each point [x as a share of the chest's half width toward his left, y trunks over
 * the shoulder joint, z: >= 0 trunks proud of the chest front, < 0 the shoulder's top and back (-1 the trunk's middle, -1.5 half way to its back)],
 * .rows rows bulged .bulge trunks out in the middle; a rolled tube .roll trunks thick along the foot, .rollOut proud; a gold ring .brooch trunks across
 * at the pinned end. Cloth: the cape's tone x .shade (lit face on to the front light, the cape's own tone read lighter than the cape in its shade),
 * one-sided facing out (SSAO greys a double-sided sheet).
 */
const SARISSA_MANTLE = {
  top: [[0.7, 0.05, -1.55], [0.78, 0.09, -1.0], [0.7, 0.07, -0.3], [0.55, 0.04, 0.03], [0.2, 0.0, 0.03], [-0.38, -0.05, 0.03]],
  foot: [[1.1, -0.14, -1.5], [1.16, -0.04, -1.0], [1.12, -0.18, -0.35], [1.0, -0.42, 0.05], [0.25, -0.38, 0.05], [-0.45, -0.15, 0.04]],
  rows: 4, bulge: 0.025, roll: 0.045, rollOut: 0.02, brooch: 0.08, shade: 0.7, gold: new Color3(0.82, 0.62, 0.25),
};

/** The sarissa's cape and folded collar (spec at SARISSA_CAPE), on the torso. */
export function dressSarissa(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const C = SARISSA_CAPE;
  const out: Mesh[] = [];
  const tone = teamColor.scale(C.shade);
  const cloth = getMaterialFactory().get("cloth", tone, { emissive: tone.scale(C.glow) });
  cloth.backFaceCulling = false;
  const put = (m: Mesh) => { m.material = cloth; m.convertToFlatShadedMesh(); m.parent = body.torso; out.push(m); return m; };
  const chest = trunkBand(body, 0.7, 1.0);
  const midZ = (chest.minZ + chest.maxZ) / 2, halfZ = (chest.maxZ - chest.minZ) / 2;
  const leg = Math.abs(body.leftKnee.position.y) * 2;
  const topY = chest.trunk * C.top, hemY = -leg * C.hem;
  const tall = topY - hemY;
  const cape = put(MeshBuilder.CreateCylinder("sarissaCape", { height: tall, diameterTop: 2, diameterBottom: 2 * C.flare, tessellation: C.sides, arc: C.arc, enclose: false, sideOrientation: Mesh.DOUBLESIDE }, scene));
  // the arc's gap to his front, the cloth round his back
  cape.rotation.y = Math.PI / 2 - Math.PI * C.arc;
  cape.scaling.set(chest.halfX * C.out, 1, halfZ * C.out);
  cape.position.set(chest.midX, (topY + hemY) / 2, midZ);
  // [R] 390 the mantle over the left shoulder and across the chest (spec at SARISSA_MANTLE)
  const M = SARISSA_MANTLE;
  const T = chest.trunk, fz = chest.maxZ;
  const L = -(Math.sign(body.rightShoulder.position.x) || 1); // his left's sign on x
  const sy = body.leftShoulder.position.y;
  const at = ([xs, ys, zs]: readonly number[], lift: number): Vector3 => {
    const x = chest.midX + L * chest.halfX * xs;
    // zs < 0: a share of the half depth behind the middle (the shoulder's top and back); else the chest front, trunks proud of it
    if (zs < 0) return new Vector3(x, sy + T * (ys + lift), midZ + halfZ * (zs + 1));
    return new Vector3(x, sy + T * ys, fz + T * (zs + lift));
  };
  const darker = teamColor.scale(C.shade * M.shade);
  const mantleCloth = getMaterialFactory().get("cloth", darker, { emissive: darker.scale(C.glow) });
  const rows: Vector3[][] = [];
  for (let r = 0; r <= M.rows; r++) {
    const v = r / M.rows;
    const bulge = Math.sin(v * Math.PI) * M.bulge;
    rows.push(M.top.map((p, i) => Vector3.Lerp(at(p, bulge), at(M.foot[i], bulge), v)));
  }
  const mantle = MeshBuilder.CreateRibbon("sarissaMantle", { pathArray: rows }, scene);
  const mn = mantle.getVerticesData(VertexBuffer.NormalKind), mp = mantle.getVerticesData(VertexBuffer.PositionKind);
  if (mn && mp) {
    let dot = 0;
    for (let v = 0; v < mp.length; v += 3) dot += mn[v] * (mp[v] - chest.midX) + mn[v + 2] * (mp[v + 2] - midZ);
    if (dot < 0) mantle.flipFaces(true);
  }
  put(mantle).material = mantleCloth;
  // the rolled fold along its lower edge, in the same cloth
  const edge = M.foot.map((p) => at(p, M.rollOut));
  const roll = put(MeshBuilder.CreateTube("sarissaMantleRoll", { path: edge, radius: T * M.roll, tessellation: 7, cap: Mesh.CAP_ALL }, scene));
  roll.material = mantleCloth;
  jitterVertices(roll, 0.05, 41.7);
  // the gold ring pinning its end at his right collarbone
  const end = at(M.top[M.top.length - 1], 0.02);
  const brooch = MeshBuilder.CreateTorus("sarissaMantleBrooch", { diameter: T * M.brooch, thickness: T * M.brooch * 0.3, tessellation: 10 }, scene);
  brooch.material = getMaterialFactory().get("cloth", M.gold, { emissive: M.gold.scale(0.2) });
  brooch.parent = body.torso;
  brooch.rotation.x = Math.PI / 2;
  brooch.position.set(end.x, (end.y + at(M.foot[M.foot.length - 1], 0).y) / 2, fz + T * 0.06);
  out.push(brooch);
  return out;
}

/*
 * [S] the snake archer's hood (382; ancient.snake_archer.red.png, .blue.png, card Appearance "a Chalcidian helmet and garb": a fitted team-cloth hood
 * over the whole head, its top rounded with a small peak, a wrap over the lower face up to just under the eyes so only the eye band shows, and a
 * draped collar round the neck over the shoulders, a point hanging at the front, tied at the throat with a tan cord; critic 378: a huge khaki box with
 * blue stripes wider than the shoulders). In the head's half extents e: the cap the top of an ellipsoid .cap of e across from .capFoot of e.y over the
 * head's middle; a back shell .backArc of a turn round the back from there down to .wrapTop; the wrap all round from .wrapTop down to .wrapFoot, .wrap
 * of e across, flaring .flare; a peak .peak of e.y tall leaning .peakLean forward. On the torso: the collar from the neck down .collar of the head's
 * width, out to .collarOut of the shoulder span, its front point .point of the head's width long; the cord .cord. Team cloth x .shade, self-lit .glow.
 */
const SNAKE_HOOD = {
  cap: 1.14, capFoot: 0.3, backArc: 0.62, wrapTop: -0.16, wrapFoot: -1.12, wrap: 1.1, flare: 1.12, peak: 0.42, peakLean: 0.5,
  collar: 0.42, collarOut: 1.08, point: 0.5, cord: new Color3(0.72, 0.5, 0.3), shade: 0.82, glow: 0.12,
};
/* [S] 389 the hood's rounded shell (spec at its build in dressSnakeArcher); the wrap's foot .wrapTaper of its top across */
const SNAKE_CAP = { cy: 0, rx: 1.22, ry: 1.22, rz: 1.22, pow: 3, rows: 6, segs: 16, nub: 0.26, nubLean: 0.55, wrapTaper: 0.86 };
/*
 * [S] 390 the face wrap (ancient.snake_archer.blue.png, .red.png: the cloth over the lower face rounds smoothly up under the hood's rim with no skin
 * between, narrows to the chin, and a dark cord is tied across it under the eyes, a small knot and bow at the nose; critic 389: a square block under
 * the cap, jagged light-skin gaps between them, no cord). Replaces the 10-sided cylinder (radius 1.1 of e, which the block head's chamfered corners
 * cut through): rows of a rounded shell, .r of e across (inside the hood's back shell, so its top tucks under the rim) from .tuck of e.y above
 * SNAKE_HOOD.wrapTop down to .wrapFoot, easing in from .narrowFrom of e.y to .chin of its width at the foot. The cord a band round it at .cordAt of
 * e.y, .thick m thick, a knot .knot of e.x on the front, two loops .loop of e.x across, two ends .end of e.y long; dark brown.
 */
const SNAKE_WRAP = { tuck: 0.12, r: 1.19, narrowFrom: -0.75, chin: 0.72, rows: 7, cordAt: -0.36, thick: 0.09, knot: 0.2, loop: 0.22, end: 0.22, cord: new Color3(0.2, 0.09, 0.04) };

/*
 * [S] the snake archer's snake (385; ancient.snake_archer.red.png, card Appearance "a bow ... loaded with a snake", Weapons projectile Snake: a big green
 * snake head with two white bead eyes on top, a body banded dark red and green tapering back to the tail; critic 378/384: a plain dark arrow on the
 * string and in flight). Built along +y, tail at 0 and the head's tip at `long`: the body .bands bands from .tail to .neck of the head's width across,
 * alternating red and green, .body of the length; the head an ellipsoid .head of the length across, .headLong of it long, flattened .flat; the eyes
 * white beads .eye of the head across on its top with black pupils; a forked red tongue. Fixed colours self-lit .glow (the same snake on both teams).
 * The draw fist holds it nocked (heldSnake, named "heldArrow" so the sim hides it at the loose, SNAKE_ARROWS); the arrow that flies is dressed as it.
 */
const SNAKE = {
  bands: 8, body: 0.72, tail: 0.25, neck: 1.0, head: 0.4, headLong: 1.45, flat: 0.75, eye: 0.42, glow: 0.18, nock: 0.42, held: 0.6,
  green: new Color3(0.2, 0.42, 0.2), red: new Color3(0.45, 0.1, 0.12), white: new Color3(0.95, 0.95, 0.92), black: new Color3(0.05, 0.05, 0.05),
};

/** A banded snake along +y, tail at 0, head tip at `long` (spec at SNAKE). */
export function buildSnake(scene: Scene, name: string, long: number): TransformNode {
  const S = SNAKE;
  const mf = getMaterialFactory();
  const lit = (c: Color3) => mf.get("cloth", c, { emissive: c.scale(S.glow) });
  const root = new TransformNode(name, scene);
  const headW = long * S.head, headL = headW * S.headLong;
  const bodyL = long - headL * 0.85;
  const put = (m: Mesh, c: Color3) => { m.material = lit(c); m.convertToFlatShadedMesh(); m.parent = root; return m; };
  for (let k = 0; k < S.bands; k++) {
    const t0 = k / S.bands, t1 = (k + 1) / S.bands;
    const d = (t: number) => headW * (S.tail + (S.neck - S.tail) * t);
    const band = put(MeshBuilder.CreateCylinder(`${name}Band`, { height: bodyL / S.bands * 1.02, diameterBottom: d(t0), diameterTop: d(t1), tessellation: 7 }, scene), k % 2 ? S.red : S.green);
    band.position.y = bodyL * (t0 + t1) / 2;
  }
  const head = put(MeshBuilder.CreateSphere(`${name}Head`, { diameterX: headW, diameterY: headL, diameterZ: headW * S.flat, segments: 7 }, scene), S.green);
  head.position.y = long - headL / 2;
  for (const side of [-1, 1]) {
    const eye = put(MeshBuilder.CreateSphere(`${name}Eye`, { diameter: headW * S.eye, segments: 6 }, scene), S.white);
    eye.position.set(side * headW * 0.24, long - headL * 0.32, headW * S.flat * 0.38);
    const pupil = put(MeshBuilder.CreateSphere(`${name}Pupil`, { diameter: headW * S.eye * 0.5, segments: 5 }, scene), S.black);
    pupil.position.set(side * headW * 0.26, long - headL * 0.3, headW * S.flat * 0.38 + headW * S.eye * 0.32);
    const fork = put(MeshBuilder.CreateBox(`${name}Tongue`, { width: headW * 0.05, height: headL * 0.32, depth: headW * 0.02 }, scene), S.red);
    fork.position.set(side * headW * 0.05, long + headL * 0.12, 0);
    fork.rotation.z = -side * 0.35;
  }
  return root;
}

/*
 * [S] 388 the live snake on the turf (ancient.snake_archer.png: a long thin snake some two metres long, banded red and green its whole length, laid in
 * S bends, the green head held up off the ground with two big white eyes on top; critic 387: a short fat green log a thigh thick, red bands only on a
 * cone tail, lying straight). Laid along +z on the ground, tail at z 0: .segs body pieces end to end over the length less the head, each .thick across
 * (tapering to .tail of that over the last .taper of the length at the tail), alternating green and red; the last .rise of the body curving up to
 * .neckUp m off the ground; on a neck node at the body's front end the head, .headLong m long and .headWide across, flattened .flat, eyes .eye of
 * the head across on its top, a forked red tongue. Each piece keeps its laid z, y and share of the length in metadata (snakeZ, snakeY, snakeAlong) so
 * the sim can throw the body in a travelling S; the neck carries the head and rears for the lunge. Colours SNAKE's.
 */
const GROUND_SNAKE = { segs: 18, thick: 0.075, tail: 0.3, taper: 0.3, rise: 0.22, neckUp: 0.14, headLong: 0.17, headWide: 0.115, flat: 0.7, eye: 0.42 };
export type GroundSnake = { root: TransformNode; segs: Mesh[]; neck: TransformNode; bodyL: number };

/** The live snake laid along +z on the ground (spec at GROUND_SNAKE). */
export function buildGroundSnake(scene: Scene, name: string, long: number): GroundSnake {
  const G = GROUND_SNAKE;
  const S = SNAKE;
  const mf = getMaterialFactory();
  const lit = (c: Color3) => mf.get("cloth", c, { emissive: c.scale(S.glow) });
  const root = new TransformNode(name, scene);
  const bodyL = long - G.headLong * 0.8;
  const segL = bodyL / G.segs;
  const lift = (t: number) => {
    const r = Math.max(0, (t - (1 - G.rise)) / G.rise);
    return G.neckUp * r * r * (3 - 2 * r);
  };
  const segs: Mesh[] = [];
  for (let k = 0; k < G.segs; k++) {
    const t0 = k / G.segs, t1 = (k + 1) / G.segs, tm = (t0 + t1) / 2;
    const d = (t: number) => G.thick * (t >= G.taper ? 1 : G.tail + (1 - G.tail) * t / G.taper);
    const seg = MeshBuilder.CreateCylinder(`${name}Band`, { height: segL * 1.12, diameterBottom: d(t0), diameterTop: d(t1), tessellation: 7 }, scene);
    seg.material = lit(k % 2 ? S.red : S.green);
    seg.convertToFlatShadedMesh();
    seg.parent = root;
    const y = G.thick / 2 + lift(tm);
    const pitch = Math.atan2(lift(t1) - lift(t0), segL);
    seg.position.set(0, y, bodyL * tm);
    seg.rotation.x = Math.PI / 2 - pitch;
    seg.metadata = { snakeZ: seg.position.z, snakeY: y, snakeAlong: tm };
    segs.push(seg);
  }
  const neck = new TransformNode(`${name}Neck`, scene);
  neck.parent = root;
  neck.position.set(0, G.thick / 2 + G.neckUp, bodyL - segL * 0.3);
  const put = (m: Mesh, c: Color3) => { m.material = lit(c); m.convertToFlatShadedMesh(); m.parent = neck; return m; };
  const hw = G.headWide, hl = G.headLong;
  const head = put(MeshBuilder.CreateSphere(`${name}Head`, { diameterX: hw, diameterY: hw * G.flat, diameterZ: hl, segments: 7 }, scene), S.green);
  head.position.z = hl * 0.42;
  for (const side of [-1, 1]) {
    const eye = put(MeshBuilder.CreateSphere(`${name}Eye`, { diameter: hw * G.eye, segments: 6 }, scene), S.white);
    eye.position.set(side * hw * 0.22, hw * G.flat * 0.38, hl * 0.3);
    const pupil = put(MeshBuilder.CreateSphere(`${name}Pupil`, { diameter: hw * G.eye * 0.5, segments: 5 }, scene), S.black);
    pupil.position.set(side * hw * 0.23, hw * G.flat * 0.38 + hw * G.eye * 0.18, hl * 0.3 + hw * G.eye * 0.22);
    const fork = put(MeshBuilder.CreateBox(`${name}Tongue`, { width: hw * 0.06, height: hw * 0.02, depth: hl * 0.4 }, scene), S.red);
    fork.position.set(side * hw * 0.05, 0, hl * 0.95);
    fork.rotation.y = side * 0.35;
  }
  return { root, segs, neck, bodyL };
}

/** The snake nocked in the snake archer's draw fist (spec at SNAKE), held like the balloon archer's arrow: across the fist, the head out to his off side. */
export function heldSnake(scene: Scene, body: ArticulatedBody): TransformNode {
  const long = SNAKE.held * body.metrics.overallHeight;
  const holder = new TransformNode("heldArrow", scene);
  holder.parent = body.leftHand;
  holder.rotation.z = Math.PI / 2;
  const snake = buildSnake(scene, "heldSnake", long);
  snake.parent = holder;
  snake.position.y = -long * SNAKE.nock;
  return holder;
}

/** The snake archer's hood, face wrap, collar and cord (spec at SNAKE_HOOD): head pieces on the head, the collar on the torso. */
export function dressSnakeArcher(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = SNAKE_HOOD;
  const out: Mesh[] = [];
  const mf = getMaterialFactory();
  const tone = teamColor.scale(S.shade);
  const cloth = mf.get("cloth", tone, { emissive: tone.scale(S.glow) });
  cloth.backFaceCulling = false;
  const cord = mf.get("cloth", S.cord, { emissive: S.cord.scale(0.15) });
  const head = body.headMesh;
  const e = head.getBoundingInfo().boundingBox.extendSize;
  const put = (m: Mesh, parent: TransformNode | Mesh, material = cloth) => { m.material = material; m.convertToFlatShadedMesh(); m.parent = parent; out.push(m); return m; };
  // [S] 389 the hood one rounded shell (SNAKE_CAP), not a half dome on a straight back cylinder over a flaring wrap (critic 388: a tall flat-sided
  // cylinder with a fin, a bucket helm; ancient.snake_archer.blue.png: a short round team cap hugging the crown, a small nub at its top front, the
  // face wrap narrowing to the chin): rows of one superellipsoid (centre .cy of e.y, radii .rx/.ry/.rz of e, profile exponent .pow, so it clears the
  // block head's chamfered corners and top ring: an ellipsoid short enough let them cut through it) from its top down to the brow all round, and
  // from the brow down to the wrap's top round the back only (.backArc of a turn), the gap at the eyes; a blunt nub .nub of e.y tall leaning .nubLean
  const Cp = SNAKE_CAP;
  const cy = e.y * Cp.cy;
  const shellRow = (y: number, a0: number, a1: number): Vector3[] => {
    const k = Math.max(0, 1 - Math.abs((y - cy) / (e.y * Cp.ry)) ** Cp.pow) ** (1 / Cp.pow);
    const row: Vector3[] = [];
    for (let i = 0; i <= Cp.segs; i++) {
      const a = a0 + ((a1 - a0) * i) / Cp.segs;
      row.push(new Vector3(Math.sin(a) * e.x * Cp.rx * k, y, Math.cos(a) * e.z * Cp.rz * k));
    }
    return row;
  };
  const top = cy + e.y * Cp.ry, brow = e.y * S.capFoot, foot = e.y * S.wrapTop;
  const capRows: Vector3[][] = [];
  for (let r = 0; r <= Cp.rows; r++) capRows.push(shellRow(top - ((top - brow) * r) / Cp.rows - (r === 0 ? 1e-4 : 0), 0, Math.PI * 2));
  put(MeshBuilder.CreateRibbon("snakeHoodCap", { pathArray: capRows }, scene), head);
  // the back: the gap of 1 - .backArc of a turn centred on his front (+z)
  const gap = Math.PI * (1 - S.backArc);
  const backRows: Vector3[][] = [];
  for (let r = 0; r <= 3; r++) backRows.push(shellRow(brow - ((brow - foot) * r) / 3, gap, Math.PI * 2 - gap));
  put(MeshBuilder.CreateRibbon("snakeHoodBack", { pathArray: backRows }, scene), head);
  // the nub on the crown, a touch forward, leaning forward
  const peak = put(MeshBuilder.CreateCylinder("snakeHoodPeak", { height: e.y * Cp.nub, diameterTop: e.x * 0.18, diameterBottom: e.x * 0.5, tessellation: 6 }, scene), head);
  peak.rotation.x = Cp.nubLean;
  peak.position.set(0, top - e.y * 0.06 + e.y * Cp.nub * 0.3, e.z * 0.2);
  // [S] 390 the wrap one rounded shell under the cap's rim, narrowing to the chin, tied with a dark cord (spec at SNAKE_WRAP)
  const Wr = SNAKE_WRAP;
  const wrapRows: Vector3[][] = [];
  const wrapTop = e.y * (S.wrapTop + Wr.tuck), wrapFoot = e.y * S.wrapFoot;
  const wrapR = (y: number): number => {
    const t = Math.max(0, Math.min(1, (e.y * Wr.narrowFrom - y) / (e.y * Wr.narrowFrom - wrapFoot)));
    return Wr.r * (1 - (1 - Wr.chin) * t * t * (3 - 2 * t));
  };
  for (let r = 0; r <= Wr.rows; r++) {
    const y = wrapTop - ((wrapTop - wrapFoot) * r) / Wr.rows;
    const row: Vector3[] = [];
    for (let i = 0; i <= Cp.segs; i++) {
      const a = (Math.PI * 2 * i) / Cp.segs;
      row.push(new Vector3(Math.sin(a) * e.x * wrapR(y), y, Math.cos(a) * e.z * wrapR(y)));
    }
    wrapRows.push(row);
  }
  put(MeshBuilder.CreateRibbon("snakeHoodWrap", { pathArray: wrapRows }, scene), head);
  // the cord: a dark band round the wrap, a knot on the front at the nose, two loops and two short ends hanging from it
  const dark = mf.get("cloth", Wr.cord, { emissive: Wr.cord.scale(0.1) });
  const cordY = e.y * Wr.cordAt, cordR = wrapR(cordY) + 0.025;
  const band = put(MeshBuilder.CreateTorus("snakeWrapCord", { diameter: 2, thickness: Wr.thick / cordR, tessellation: 18 }, scene), head, dark);
  band.scaling.set(e.x * cordR, e.x * cordR, e.z * cordR);
  band.position.y = cordY;
  const front = e.z * cordR;
  const knot = put(MeshBuilder.CreateIcoSphere("snakeWrapKnot", { radius: e.x * Wr.knot * 0.5, subdivisions: 1, flat: true }, scene), head, dark);
  knot.position.set(0, cordY, front + e.x * Wr.knot * 0.2);
  for (const side of [-1, 1]) {
    const loop = put(MeshBuilder.CreateTorus("snakeWrapLoop", { diameter: e.x * Wr.loop, thickness: e.x * Wr.thick * 0.8, tessellation: 8 }, scene), head, dark);
    loop.rotation.set(Math.PI / 2, 0, side * 0.5);
    loop.position.set(side * e.x * Wr.loop * 0.55, cordY + e.y * 0.03, front + e.x * 0.03);
    const end = put(MeshBuilder.CreateBox("snakeWrapEnd", { width: e.x * Wr.thick, height: e.y * Wr.end, depth: e.x * Wr.thick }, scene), head, dark);
    end.rotation.z = side * 0.35;
    end.position.set(side * e.x * 0.08, cordY - e.y * Wr.end * 0.5, front + e.x * 0.04);
  }
  // the collar on the shoulders, a point hanging at the front, and the cord tied at the throat
  const torso = body.torso;
  const neckY = body.neck.position.y;
  const span = Math.abs(body.rightShoulder.position.x) + Math.abs(body.leftShoulder.position.x);
  const W = e.x * 2;
  const collarTall = W * S.collar;
  const collar = put(MeshBuilder.CreateCylinder("snakeHoodCollar", { height: collarTall, diameterTop: W * S.wrap * S.flare, diameterBottom: span * S.collarOut, tessellation: 10 }, scene), torso);
  collar.scaling.z = 0.75;
  collar.position.set(0, neckY - collarTall * 0.3, 0);
  const point = put(MeshBuilder.CreateCylinder("snakeHoodPoint", { height: W * S.point, diameterTop: W * 0.9, diameterBottom: 0, tessellation: 3 }, scene), torso);
  point.scaling.z = 0.25;
  point.rotation.x = -0.25;
  point.position.set(0, neckY - collarTall * 0.75 - W * S.point * 0.4, span * S.collarOut * 0.75 * 0.5 * 0.9);
  for (const side of [-1, 1]) {
    const loop = put(MeshBuilder.CreateTorus("snakeHoodCord", { diameter: W * 0.18, thickness: W * 0.04, tessellation: 8 }, scene), torso, cord);
    loop.rotation.set(Math.PI / 2, 0, side * 0.6);
    loop.position.set(side * W * 0.09, neckY + collarTall * 0.1, W * S.wrap * S.flare * 0.5 * 0.75 + W * 0.03);
  }
  return out;
}

/*
 * [S] the snake archer's kit (386; ancient.snake_archer.red.png: a brown baldric from the quiver over his left shoulder diagonally across the chest to
 * the right hip, a brown belt with a gold buckle round the tunic's waist, brown knee boots from under the knee to the ankle over a team foot in a
 * strapped sandal; card "a quiver full of arrows"; critic 378: team legs, a dark bar). On the torso, round the trunk's box (trunkBand 0-1):
 *   - the baldric: a band round the trunk .proud of its half extents (rounded box section, exponent 4), its middle line from .high of the trunk at
 *     his left (-x) to .low at his right, .wide of the trunk tall, clamped under .top of the trunk so it crosses the shoulder;
 *   - the belt: a ring .belt of the trunk tall at .beltAt, .beltProud out, a gold buckle .buckle of the trunk square on its front;
 *   - on each shin a boot shell .bootOut of its half-width from .bootFrom to .bootTo of its length, a turned rim .rim long at its top, darker;
 *     the feet the hoplite's strapSandals.
 * Fixed browns, self-lit .glow.
 */
const SNAKE_KIT = {
  proud: 1.08, high: 0.95, low: 0.12, wide: 0.11, top: 1.03, segs: 28,
  belt: 0.09, beltAt: 0.05, beltProud: 1.12, buckle: 0.11,
  bootOut: 1.35, bootFrom: 0.12, bootTo: 0.92, rim: 0.1,
  leather: new Color3(0.42, 0.25, 0.14), boot: new Color3(0.3, 0.17, 0.11), gold: new Color3(0.8, 0.58, 0.26), glow: 0.12,
};

/** The snake archer's baldric, belt and knee boots over strap sandals (spec at SNAKE_KIT). */
export function snakeArcherKit(scene: Scene, body: ArticulatedBody): Mesh[] {
  const K = SNAKE_KIT;
  const out: Mesh[] = [];
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", K.leather, { emissive: K.leather.scale(K.glow) });
  leather.backFaceCulling = false;
  const boot = mf.get("cloth", K.boot, { emissive: K.boot.scale(K.glow) });
  const bootRim = mf.get("cloth", K.boot.scale(0.75), { emissive: K.boot.scale(K.glow * 0.5) });
  const gold = mf.get("cloth", K.gold, { emissive: K.gold.scale(K.glow) });
  const band = trunkBand(body, 0, 1);
  const halfZ = (band.maxZ - band.minZ) / 2, midZ = (band.minZ + band.maxZ) / 2;
  const tr = band.trunk;
  const rim = (a: number, p: number) => {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: band.midX + band.halfX * p * Math.sign(c) * Math.abs(c) ** 0.5, z: midZ + halfZ * p * Math.sign(s) * Math.abs(s) ** 0.5 };
  };
  // the baldric
  const upper: Vector3[] = [], lower: Vector3[] = [];
  for (let i = 0; i <= K.segs; i++) {
    const p = rim((Math.PI * 2 * i) / K.segs, K.proud);
    const u = (p.x - band.midX) / band.halfX;
    const mid = tr * (K.high + (K.low - K.high) * (u + 1) / 2);
    upper.push(new Vector3(p.x, Math.min(mid + tr * K.wide / 2, tr * K.top), p.z));
    lower.push(new Vector3(p.x, Math.min(mid - tr * K.wide / 2, tr * K.top - tr * 0.05), p.z));
  }
  const baldric = MeshBuilder.CreateRibbon("snakeBaldric", { pathArray: [upper, lower], sideOrientation: Mesh.DOUBLESIDE }, scene);
  baldric.convertToFlatShadedMesh();
  baldric.material = leather;
  baldric.parent = body.torso;
  out.push(baldric);
  // the belt and its buckle
  const belt = MeshBuilder.CreateCylinder("snakeBelt", { height: tr * K.belt, diameter: 2, tessellation: 10 }, scene);
  belt.scaling.set(band.halfX * K.beltProud, 1, halfZ * K.beltProud);
  belt.position.set(band.midX, tr * K.beltAt, midZ);
  belt.convertToFlatShadedMesh();
  belt.material = leather;
  belt.parent = body.torso;
  out.push(belt);
  const buckle = MeshBuilder.CreateBox("snakeBuckle", { width: tr * K.buckle, height: tr * K.buckle, depth: tr * 0.03 }, scene);
  buckle.position.set(band.midX, tr * K.beltAt, midZ + halfZ * K.beltProud * 1.02);
  buckle.material = gold;
  buckle.parent = body.torso;
  out.push(buckle);
  // knee boots over strap sandals
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "snakeBoot", shin, K.bootFrom, K.bootTo, K.bootOut, boot));
    out.push(limbShell(scene, "snakeBootRim", shin, K.bootFrom, K.bootFrom + K.rim, K.bootOut * 1.12, bootRim));
  }
  out.push(...strapSandals(scene, body, K.leather, K.glow, "snakeArcher"));
  out.push(...snakeArcherQuiver(scene, body, band, tr, leather));
  return out;
}

/*
 * [S] 388 the quiver high on his back (ancient.snake_archer.red.png, .png: a brown quiver slung on the baldric across his back, its mouth over his left
 * shoulder behind the head, arrow ends standing out of it; card "a quiver full of arrows despite not using them"; critic 388: a dark tube hung low at
 * the hip, the generic quiver_back special). On the torso, against the back of the trunk's box: a tube from its foot at .footX of the half width out
 * on his right (+x) at .footY of the trunk, up to its mouth at .mouthX out on his left (-x) at .mouthY, .wide of the half width across, standing .off
 * of the half depth behind the back; a darker rim .rim of the length at the mouth; .arrows shafts standing .shaft of the length out of the mouth, each
 * with light fletching. Brown SNAKE_KIT.leather.
 */
const SNAKE_QUIVER = { footX: 0.35, footY: 0.3, mouthX: 0.75, mouthY: 1.12, wide: 0.42, off: 0.25, rim: 0.08, arrows: 4, shaft: 0.22 };

function snakeArcherQuiver(scene: Scene, body: ArticulatedBody, band: ReturnType<typeof trunkBand>, tr: number, leather: Material): Mesh[] {
  const Q = SNAKE_QUIVER;
  const out: Mesh[] = [];
  const mf = getMaterialFactory();
  const dark = mf.get("cloth", SNAKE_KIT.leather.scale(0.6), { emissive: SNAKE_KIT.leather.scale(0.05) });
  const fletchMat = mf.get("cloth", new Color3(0.9, 0.88, 0.8), { emissive: new Color3(0.12, 0.12, 0.1) });
  const shaftMat = mf.get("cloth", new Color3(0.7, 0.55, 0.35), { emissive: new Color3(0.08, 0.06, 0.04) });
  const halfZ = (band.maxZ - band.minZ) / 2;
  const across = band.halfX * Q.wide;
  const backZ = band.minZ - across / 2 - halfZ * Q.off * 0.4;
  const foot = new Vector3(band.midX + band.halfX * Q.footX, tr * Q.footY, backZ);
  const mouth = new Vector3(band.midX - band.halfX * Q.mouthX, tr * Q.mouthY, backZ);
  const axis = mouth.subtract(foot);
  const long = axis.length();
  const holder = new TransformNode("snakeQuiver", scene);
  holder.parent = body.torso;
  holder.position.copyFrom(foot);
  holder.rotation.z = -Math.atan2(axis.x, axis.y);
  const put = (m: Mesh, mat: Material) => { m.material = mat; m.convertToFlatShadedMesh(); m.parent = holder; out.push(m); return m; };
  const tube = put(MeshBuilder.CreateCylinder("snakeQuiver", { height: long, diameterTop: across * 1.08, diameterBottom: across * 0.9, tessellation: 8 }, scene), leather);
  tube.position.y = long / 2;
  const rimRing = put(MeshBuilder.CreateCylinder("snakeQuiverRim", { height: long * Q.rim, diameter: across * 1.2, tessellation: 8 }, scene), dark);
  rimRing.position.y = long * (1 - Q.rim / 2);
  for (let k = 0; k < Q.arrows; k++) {
    const a = (Math.PI * 2 * k) / Q.arrows;
    const shaft = put(MeshBuilder.CreateCylinder("snakeQuiverArrow", { height: long * Q.shaft, diameter: across * 0.12, tessellation: 5 }, scene), shaftMat);
    shaft.position.set(Math.cos(a) * across * 0.22, long * (1 + Q.shaft / 2 - 0.05), Math.sin(a) * across * 0.22);
    const fletch = put(MeshBuilder.CreateBox("snakeQuiverFletch", { width: across * 0.32, height: long * Q.shaft * 0.45, depth: across * 0.05 }, scene), fletchMat);
    fletch.position.set(shaft.position.x, long * (1 + Q.shaft * 0.8 - 0.05), shaft.position.z);
    fletch.rotation.y = a;
  }
  return out;
}

/*
 * [S] the hoplite's greaves and sandals (384; ancient.hoplite.red.png: dark brown greaves from under the knee to the ankle, the bare team foot below in a
 * brown strapped sandal; critic 378: grey boots). On each shin a faceted shell HOPLITE_LEGS.out of its half-width round it from .from to .to of its length,
 * a rim band .rim long round its top, in a fixed dark brown (not a team lerp, which read grey under blue) self-lit .glow; the foot the team skin, with a
 * brown sandal: a sole .sole of the foot's height under it, a strap over the instep at .instep of its length and one round the ankle at its back.
 */
const HOPLITE_LEGS = {
  out: 1.3, from: 0.06, to: 0.86, rim: 0.07, sole: 0.22, instep: 0.55, strap: 0.18,
  greave: new Color3(0.3, 0.17, 0.1), sandal: new Color3(0.42, 0.25, 0.14), glow: 0.12,
};

export function dressHoplite(scene: Scene, body: ArticulatedBody): Mesh[] {
  const H = HOPLITE_LEGS;
  const mf = getMaterialFactory();
  const greave = mf.get("cloth", H.greave, { emissive: H.greave.scale(H.glow) });
  const rim = mf.get("cloth", H.greave.scale(1.35), { emissive: H.greave.scale(H.glow) });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "hopliteGreave", shin, H.from, H.to, H.out, greave));
    out.push(limbShell(scene, "hopliteGreaveRim", shin, H.from, H.from + H.rim, H.out * 1.1, rim));
  }
  out.push(...strapSandals(scene, body, H.sandal, H.glow));
  return out;
}

/**
 * Brown strapped sandals on bare team feet (HOPLITE_LEGS sole, instep, strap; shared by the hoplite and the shield bearer): each foot mesh takes the
 * body's skin, a sole under it, a strap over the instep and one round the ankle at its back.
 */
export function strapSandals(scene: Scene, body: ArticulatedBody, colour: Color3, glow: number, prefix = "hoplite"): Mesh[] {
  const H = HOPLITE_LEGS;
  const sandal = getMaterialFactory().get("cloth", colour, { emissive: colour.scale(glow) });
  const out: Mesh[] = [];
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) {
      if (!(foot instanceof Mesh) || !/_[lr]FootM$/.test(foot.name)) continue;
      foot.material = body.skinMaterial;
      const fb = foot.getBoundingInfo().boundingBox;
      const ex = fb.extendSize;
      const put = (m: Mesh, x: number, y: number, z: number) => { m.parent = foot; m.position.set(x, y, z); m.material = sandal; out.push(m); };
      put(MeshBuilder.CreateBox(`${prefix}Sole`, { width: ex.x * 2.1, height: ex.y * 2 * H.sole, depth: ex.z * 2.06 }, scene), fb.center.x, fb.minimum.y + ex.y * H.sole, fb.center.z);
      put(MeshBuilder.CreateBox(`${prefix}Strap`, { width: ex.x * 2.12, height: ex.y * 2.02, depth: ex.z * 2 * H.strap }, scene), fb.center.x, fb.center.y, fb.minimum.z + ex.z * 2 * H.instep);
      put(MeshBuilder.CreateBox(`${prefix}Strap`, { width: ex.x * 2.12, height: ex.y * 2 * 0.4, depth: ex.z * 2 * H.strap }, scene), fb.center.x, fb.maximum.y - ex.y * 0.3, fb.minimum.z + ex.z * 2 * 0.12);
    }
  }
  return out;
}

/*
 * [S] the sarissa's belt, dagger and bracers (384; ancient.sarissa.red.png, card Appearance "a big brown belt around its hips, holding what seems to be an
 * Acinaces dagger": a broad brown belt round the hips over the tunic, a darker strap band along its foot, a dagger in a brown sheath hanging down his left
 * hip, brown leather bracers on the forearms). On the torso, in the trunk's box at the hips: the belt SARISSA_KIT.tall of the trunk tall at .at, .proud of
 * the body belt ring (hidden), .sides facets, its lower .band a darker brown; the sheath on his left (-x) at .hipOut of the belt half-width, .ahead of its
 * half-depth forward (clear of the cape), .sheath of the trunk long hanging
 * from the belt, tilted .tilt rad out at the foot, a gold chape at its tip, the grip and a cross guard above the belt. On each forearm a bracer shell .out of
 * its half-width round it from .from to .to of its length, a dark strap at each end. Fixed browns, self-lit .glow.
 */
const SARISSA_KIT = {
  at: 0.06, tall: 0.2, proud: 1.1, sides: 8, band: 0.35, hipOut: 0.92, ahead: 0.55, sheath: 0.42, tilt: 0.18,
  out: 1.6, from: 0.12, to: 0.88,
  leather: new Color3(0.4, 0.24, 0.13), dark: new Color3(0.24, 0.14, 0.08), gold: new Color3(0.78, 0.6, 0.28), glow: 0.12,
};

export function sarissaKit(scene: Scene, body: ArticulatedBody): Mesh[] {
  const K = SARISSA_KIT;
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", K.leather, { emissive: K.leather.scale(K.glow) });
  const dark = mf.get("cloth", K.dark, { emissive: K.dark.scale(K.glow) });
  const gold = mf.get("cloth", K.gold, { emissive: K.gold.scale(K.glow) });
  const out: Mesh[] = [];
  const add = (m: Mesh, material = leather, parent: TransformNode = body.torso) => { m.parent = parent; m.material = material; m.convertToFlatShadedMesh(); out.push(m); return m; };
  // the belt and its darker foot band, round the outside of the body's own team belt ring (which it replaces: inside the trunk's box it was hidden by it)
  const waist = trunkBand(body, K.at - K.tall / 2, K.at + K.tall / 2 + 0.05);
  const ring = body.torso.getChildMeshes(true).find((m) => /_belt$/.test(m.name));
  const ringOut = ring ? ring.getBoundingInfo().boundingBox.extendSize : null;
  const halfX = Math.max(waist.halfX, ringOut?.x ?? 0) * K.proud;
  const halfZ = Math.max((waist.maxZ - waist.minZ) / 2, ringOut?.z ?? 0) * K.proud;
  const midX = ring ? ring.position.x : waist.midX;
  const midZ = ring ? ring.position.z : (waist.minZ + waist.maxZ) / 2;
  if (ring) ring.setEnabled(false);
  const tall = waist.trunk * K.tall;
  const beltY = ring ? ring.position.y : waist.trunk * K.at;
  const belt = add(MeshBuilder.CreateCylinder("sarissaBelt", { height: tall, diameter: 2, tessellation: K.sides }, scene));
  belt.scaling.set(halfX, 1, halfZ);
  belt.position.set(midX, beltY, midZ);
  const band = add(MeshBuilder.CreateCylinder("sarissaBeltBand", { height: tall * K.band, diameter: 2, tessellation: K.sides }, scene), dark);
  band.scaling.set(halfX * 1.04, 1, halfZ * 1.04);
  band.position.set(midX, beltY - tall * (0.5 - K.band / 2), midZ);
  // the dagger down his left hip: sheath, chape, grip, guard, pommel, on a pivot at the belt
  const hang = new TransformNode("sarissaDaggerHang", scene);
  hang.parent = body.torso;
  // forward of the side, where the cape (open .44 of a turn at his front) does not cover it
  hang.position.set(midX - halfX * K.hipOut, beltY, midZ + halfZ * K.ahead);
  hang.rotation.z = K.tilt;
  const L = waist.trunk * K.sheath;
  const w = L * 0.13;
  const sheath = add(MeshBuilder.CreateCylinder("sarissaSheath", { height: L, diameterTop: w, diameterBottom: w * 0.6, tessellation: 6 }, scene), leather, hang);
  sheath.scaling.z = 0.55;
  sheath.position.y = -L * 0.5;
  const chape = add(MeshBuilder.CreateCylinder("sarissaChape", { height: L * 0.14, diameterTop: w * 0.66, diameterBottom: w * 0.2, tessellation: 6 }, scene), gold, hang);
  chape.position.y = -L * 1.05;
  const guard = add(MeshBuilder.CreateBox("sarissaGuard", { width: w * 1.9, height: L * 0.06, depth: w * 0.6 }, scene), gold, hang);
  guard.position.y = L * 0.04;
  const grip = add(MeshBuilder.CreateCylinder("sarissaGrip", { height: L * 0.24, diameter: w * 0.5, tessellation: 6 }, scene), dark, hang);
  grip.position.y = L * 0.18;
  const pommel = add(MeshBuilder.CreateBox("sarissaPommel", { width: w * 1.3, height: L * 0.05, depth: w * 0.5 }, scene), gold, hang);
  pommel.position.y = L * 0.32;
  // bracers on the forearms, a dark strap at each end
  for (const fore of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "sarissaBracer", fore, K.from, K.to, K.out, leather));
    for (const at of [K.from, K.to - 0.08]) out.push(limbShell(scene, "sarissaBracerStrap", fore, at, at + 0.08, K.out * 1.1, dark));
  }
  return out;
}

/*
 * [S] the shield bearer's lorica segmentata (384, re-land of 383's a4076de; ancient.shield_bearer.jpg, card Appearance "a lorica segmentata (Roman
 * segmented armor)": thin dark brown plates fitted to the team tunic round the trunk, flat shoulder strips; critic 383: the stepped hoops ballooned into a
 * grey-mauve barrel twice his width). On the torso joint, in the trunk's box at each hoop's own height:
 *   - LORICA.hoops straight bands from .low to .high of the trunk (under the shoulder yoke, whose width is the arms'), each .sides-sided, a fixed .proud of
 *     the trunk's half extents (no step), .fill of its share tall, a thin darker .seam band .seamProud round the joint above it, so the plates read apart;
 *   - on each shoulder .strips flat strips lying over the deltoid, each .stripWide of the shoulder joint's offset across, .stripThick of the trunk thick,
 *     .stripDeep of the trunk's depth front to back, the k-th at .stripAt + .stripStep k of the shoulder offset out, dropping .drop k and tilting .tilt k rad;
 * fixed browns (a team lerp read grey under blue), self-lit .glow.
 */
const LORICA = {
  hoops: 4, low: 0.24, high: 0.74, sides: 8, proud: 1.05, fill: 0.92, seamProud: 1.07, seam: 0.018,
  strips: 2, stripWide: 0.5, stripThick: 0.03, stripDeep: 1.02, stripAt: 0.62, stripStep: 0.32, drop: 0.07, tilt: 0.38,
  plate: new Color3(0.3, 0.18, 0.12), dark: new Color3(0.17, 0.1, 0.07), glow: 0.1,
};

/** The shield bearer's segmented hoop armour and flat shoulder strips (spec at LORICA), on the torso. */
export function dressShieldBearer(scene: Scene, body: ArticulatedBody): Mesh[] {
  const L = LORICA;
  const out: Mesh[] = [];
  const mf = getMaterialFactory();
  const plate = mf.get("cloth", L.plate, { emissive: L.plate.scale(L.glow) });
  const dark = mf.get("cloth", L.dark, { emissive: L.dark.scale(L.glow) });
  const put = (m: Mesh, material = plate) => { m.material = material; m.convertToFlatShadedMesh(); m.parent = body.torso; out.push(m); return m; };
  const share = (L.high - L.low) / L.hoops;
  // one box over the whole trunk: the trunk is a straight box with vertices only at its ends, so a hoop-high slice found none and fell back to a box
  // round the whole torso joint, belt ring included (384 probe: .23 deep on a .09 trunk), which stood the lower hoops off his chest as a drum
  const band = trunkBand(body, 0, 1);
  for (let k = 0; k < L.hoops; k++) {
    const lo = L.low + share * k, hi = lo + share;
    const halfZ = (band.maxZ - band.minZ) / 2, midZ = (band.minZ + band.maxZ) / 2;
    const hoop = put(MeshBuilder.CreateCylinder("loricaHoop", { height: band.trunk * share * L.fill, diameter: 2, tessellation: L.sides }, scene));
    hoop.scaling.set(band.halfX * L.proud, 1, halfZ * L.proud);
    hoop.position.set(band.midX, band.trunk * (lo + hi) / 2, midZ);
    const seam = put(MeshBuilder.CreateCylinder("loricaSeam", { height: band.trunk * L.seam, diameter: 2, tessellation: L.sides }, scene), dark);
    seam.scaling.set(band.halfX * L.seamProud, 1, halfZ * L.seamProud);
    seam.position.set(band.midX, band.trunk * hi, midZ);
  }
  const top = trunkBand(body, 0.85, 1.0);
  const deep = (top.maxZ - top.minZ) * L.stripDeep;
  const midZ = (top.minZ + top.maxZ) / 2;
  for (const shoulder of [body.leftShoulder, body.rightShoulder]) {
    const sx = shoulder.position.x;
    const side = Math.sign(sx) || 1;
    for (let k = 0; k < L.strips; k++) {
      const strip = put(MeshBuilder.CreateBox("loricaShoulder", { width: Math.abs(sx) * L.stripWide, height: top.trunk * L.stripThick, depth: deep }, scene));
      strip.rotation.z = -side * L.tilt * (k + 0.5);
      strip.position.set(sx * (L.stripAt + L.stripStep * k), shoulder.position.y - top.trunk * L.drop * k, midZ);
    }
  }
  out.push(...shieldBearerSandals(scene, body));
  return out;
}

/*
 * [S] the shield bearer's sandals (385; ancient.shield_bearer.jpg: bare team feet in brown strapped sandals, the laces wound up round the lower shin, no
 * boots; critic 378/384: dark team/grey boots). The hoplite's strapSandals (sole, instep, ankle strap, the foot in skin) without his greaves, plus
 * SB_SANDAL.laces thin brown bands round each shin at those shares of its length, .lace long, .out of its half-width; fixed brown, self-lit .glow.
 */
const SB_SANDAL = { laces: [0.7, 0.82, 0.93], lace: 0.045, out: 1.12, brown: new Color3(0.4, 0.23, 0.13), glow: 0.12 };

function shieldBearerSandals(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = SB_SANDAL;
  const lace = getMaterialFactory().get("cloth", S.brown, { emissive: S.brown.scale(S.glow) });
  const out = strapSandals(scene, body, S.brown, S.glow, "shieldBearer");
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    for (const at of S.laces) out.push(limbShell(scene, "shieldBearerLace", shin, at, at + S.lace, S.out, lace));
  }
  return out;
}

/*
 * [S] 388 the ballista's crewman's helmet (re-landed from 387's 3b71139; ancient.ballista.blue.png: a helmeted team crewman behind the machine at its
 * stock; critic 378: a bare team man). On the head, in its half extents e: a grey iron bowl BALLISTA_HELM.bowl of e across, cut at .cut of a sphere, its foot .foot of e.y over
 * the head's middle; a brow rim .rim of e.y tall round its foot; a neck guard flaring out behind, .guard of e.y tall, .flare of the bowl's width; two
 * cheek guards .cheek of e.y long down the sides. Iron cloth .iron, self-lit .glow.
 */
const BALLISTA_HELM = { bowl: 1.16, cut: 0.55, foot: 0.12, rim: 0.16, guard: 0.42, flare: 1.18, cheek: 0.8, iron: new Color3(0.42, 0.42, 0.45), glow: 0.14 };

/** The ballista crewman's iron helmet (spec at BALLISTA_HELM), on his head. */
export function dressBallistaCrew(scene: Scene, body: ArticulatedBody): Mesh[] {
  const H = BALLISTA_HELM;
  const out: Mesh[] = [];
  const iron = getMaterialFactory().get("cloth", H.iron, { emissive: H.iron.scale(H.glow) });
  const head = body.headMesh;
  const e = head.getBoundingInfo().boundingBox.extendSize;
  const put = (m: Mesh) => { m.material = iron; m.convertToFlatShadedMesh(); m.parent = head; out.push(m); body.allMeshes.push(m); return m; };
  const bowl = put(MeshBuilder.CreateSphere("ballistaCrewHelm", { diameterX: 2 * e.x * H.bowl, diameterY: 2 * e.y * H.bowl, diameterZ: 2 * e.z * H.bowl, segments: 7, slice: H.cut }, scene));
  bowl.position.y = e.y * H.foot;
  const rim = put(MeshBuilder.CreateCylinder("ballistaCrewRim", { height: e.y * H.rim, diameter: 2 * e.x * H.bowl * 1.04, tessellation: 10 }, scene));
  rim.scaling.z = (e.z / e.x) * 1.0;
  rim.position.y = e.y * (H.foot + H.rim * 0.5);
  const guard = put(MeshBuilder.CreateCylinder("ballistaCrewGuard", { height: e.y * H.guard, diameterTop: 2 * e.x * H.bowl, diameterBottom: 2 * e.x * H.bowl * H.flare, tessellation: 10, arc: 0.5 }, scene));
  guard.rotation.y = Math.PI / 2; // the half shell round the back
  guard.scaling.z = e.z / e.x;
  guard.position.set(0, e.y * (H.foot - H.guard * 0.4), -e.z * 0.05);
  for (const sx of [-1, 1]) {
    const cheek = put(MeshBuilder.CreateBox("ballistaCrewCheek", { width: e.x * 0.12, height: e.y * H.cheek, depth: e.z * 0.7 }, scene));
    cheek.position.set(sx * e.x * H.bowl * 0.98, e.y * (H.foot - H.cheek * 0.45), e.z * 0.25);
    cheek.rotation.z = sx * 0.08;
  }
  return out;
}
