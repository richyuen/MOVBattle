import { Color3, Mesh, MeshBuilder, Quaternion, Scene, TransformNode, Vector3, VertexData } from "@babylonjs/core";
import type { Material } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

/*
 * Evil faction cloth, hats and ornaments (loop: new per-unit dress goes here, not into unitFactory or propBuilder).
 */

/**
 * [S] 489 the Exiled Sentinel's spiked cone hat (evil.exiled_sentinel.red.png, .blue.png, .jpg; audit 489 a.1: "a grey bucket great helm with an eye
 * slit - TABS: a tall black cone hat about 1.5 heads high, studded with team-coloured diamond spikes, with the bead-eyed face open below it").
 * Spec in head widths W, heights H, depths D (the head box, its centre c):
 *   - a near-black 8-sided cone, its brim .baseW across sitting at .brim over the head's centre (above the bead eyes, so the face stays open),
 *     rising .tall to a blunt tip .tipW across, leaning .lean rad forward;
 *   - team pyramid spikes in .rows rows up the cone (at .rowsAt of its height), .perRow round each row (each row turned half a step), each a 4-sided
 *     point .spike long and .spikeW across at its root, standing out from the surface and tipped .rise rad upward.
 */
const SENTINEL_CONE = { baseW: 1.06, brim: 0.36, tall: 1.75, tipW: 0.2, lean: 0.12, rowsAt: [0.14, 0.4, 0.66], perRow: 6, spike: 0.24, spikeW: 0.17, rise: 0.35 };
export function sentinelConeHat(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = SENTINEL_CONE, head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const mf = getMaterialFactory();
  const blackC = new Color3(0.07, 0.05, 0.07), black = mf.get("unlit", blackC, { emissive: blackC });
  const spikeMat = mf.get("cloth", team, { emissive: team.scale(0.18) });
  const root = new TransformNode("sentinelConeHat", scene);
  root.parent = head; root.position.set(c.x, c.y + H * C.brim, c.z); root.rotation.x = C.lean;
  const tall = H * C.tall, r0 = (W * C.baseW) / 2, r1 = (W * C.tipW) / 2, squash = D / W;
  const cone = MeshBuilder.CreateCylinder("sentinelCone", { height: tall, diameterBottom: r0 * 2, diameterTop: r1 * 2, tessellation: 8 }, scene);
  cone.parent = root; cone.position.y = tall / 2; cone.scaling.z = squash; cone.rotation.y = Math.PI / 8; cone.material = black;
  const out: Mesh[] = [cone];
  C.rowsAt.forEach((t, row) => {
    const r = r0 * (1 - t) + r1 * t;
    for (let k = 0; k < C.perRow; k++) {
      const a = ((k + (row % 2) * 0.5) / C.perRow) * Math.PI * 2;
      const spike = MeshBuilder.CreateCylinder("sentinelConeSpike", { height: W * C.spike, diameterBottom: W * C.spikeW, diameterTop: 0, tessellation: 4 }, scene);
      spike.parent = root;
      // +y laid out along the surface normal at angle a (pitch to +z, then yaw), tipped up by .rise
      spike.rotation.set(Math.PI / 2 - C.rise, a, 0);
      const out1 = r + W * C.spike * 0.4;
      spike.position.set(Math.sin(a) * out1, tall * t, Math.cos(a) * out1 * squash);
      spike.material = spikeMat; out.push(spike);
    }
  });
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 491 the Exiled Sentinel's ginger mane (evil.exiled_sentinel.blue.png; card "ginger hair"; audit 489 a.2: "hair: none - TABS: a bushy ginger
 * mane framing the face under the cone").
 * Spec in head widths W, heights H, depths D (the head box, its centre c): a bushy mass of low-poly lumps (1-subdivision icospheres, flat-shaded,
 * each turned its own way so the facets break up) from just under the cone's brim to below the jaw, round both sides and the back, the face open:
 *   - per side three stacked side lumps .5W-.6W across, centred .55W out from the middle, at +.22H, -.08H and -.36H, .05D behind the centre;
 *   - per side a cheek tuft .36W across at .5W out, -.12H, .12D forward (its inner edge stays outside the bead eyes);
 *   - three back lumps .62W across, .5D behind the centre, at +.15H (middle) and -.2H (.3W either side);
 * the whole mane ~1.7W across, as in the render (the hair stands about a third of a head out past each cheek). Lit ginger cloth (.85,.3,.06),
 * self-lit .2, out of the glow layer (an unlit orange washed out to a faint halo under the glow, probe 491).
 */
const SENTINEL_MANE: [number, number, number, number][] = [
  // [x W (per side), y H, z D, across W]
  [0.55, 0.22, -0.05, 0.56], [0.58, -0.08, -0.05, 0.6], [0.5, -0.36, -0.05, 0.5], [0.5, -0.12, 0.12, 0.36],
];
const SENTINEL_MANE_BACK: [number, number, number, number][] = [[0, 0.15, -0.5, 0.62], [-0.3, -0.2, -0.5, 0.62], [0.3, -0.2, -0.5, 0.62]];
export function sentinelMane(scene: Scene, body: ArticulatedBody): Mesh[] {
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const gingerC = new Color3(0.85, 0.3, 0.06), ginger = getMaterialFactory().get("cloth", gingerC, { emissive: gingerC.scale(0.2) });
  const out: Mesh[] = [];
  const lump = (x: number, y: number, z: number, across: number, i: number): void => {
    const m = MeshBuilder.CreateIcoSphere("sentinelMane", { radius: (W * across) / 2, subdivisions: 1 }, scene);
    m.parent = head; m.position.set(c.x + W * x, c.y + H * y, c.z + D * z);
    m.rotation.set(i * 0.7, i * 1.3, i * 0.4); m.scaling.y = 1.1; m.material = ginger; out.push(m);
  };
  let i = 0;
  for (const side of [-1, 1]) for (const [x, y, z, a] of SENTINEL_MANE) lump(side * x, y, z, a, i++);
  for (const [x, y, z, a] of SENTINEL_MANE_BACK) lump(x, y, z, a, i++);
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 492 the Shadow Walker's helm (evil.shadow_walker.blue.png, .red.png; audit 489 a.2: "a flat dark box cap with a brim sitting on top of the
 * head - TABS: a dark rounded helmet that encloses the head, with four tan vertical teeth-bars over the face"). It replaces the box cap, its dome
 * and the five hanging teeth; the horns (HORNED_EVIL) still leave its upper sides.
 * Spec in head widths W, heights H, depths D (the head box, its centre c): an 8-sided dark shell .wide W across and .deep D deep, from .low H under
 * the centre up to .crown H over it, its top a rounded 8-sided dome .dome H tall; the bead eyes hidden (the face is closed); on its front four tan
 * bars .barW W wide and .barH H tall, .gap W apart, centred .barY H off the centre, standing a little proud of the shell.
 */
const WALKER_HELM = { wide: 1.24, deep: 1.26, low: 0.56, crown: 0.36, dome: 0.3, barW: 0.13, barH: 0.52, gap: 0.24, barY: -0.06 };
export function walkerHelm(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = WALKER_HELM, head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const mf = getMaterialFactory();
  const darkC = new Color3(0.14, 0.09, 0.11), dark = mf.get("cloth", darkC, { emissive: darkC.scale(0.35) });
  const tanC = new Color3(0.6, 0.42, 0.18), tan = mf.get("cloth", tanC, { emissive: tanC.scale(0.3) });
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, y: number, z: number, material: typeof dark): Mesh => {
    m.parent = head; m.position.set(c.x + x, c.y + y, c.z + z); m.material = material; out.push(m); return m;
  };
  const tall = H * (C.low + C.crown), squash = (D * C.deep) / (W * C.wide);
  const shell = put(MeshBuilder.CreateCylinder("walkerHelm", { height: tall, diameter: W * C.wide, tessellation: 8 }, scene), 0, H * (C.crown - C.low) / 2, 0, dark);
  shell.scaling.z = squash; shell.rotation.y = Math.PI / 8;
  const dome = put(MeshBuilder.CreateSphere("walkerHelmDome", { diameterX: W * C.wide, diameterY: H * C.dome * 2, diameterZ: W * C.wide, segments: 4, slice: 0.5 }, scene), 0, H * C.crown, 0, dark);
  dome.scaling.z = squash;
  const front = (D * C.deep) / 2 * Math.cos(Math.PI / 8);
  for (let k = 0; k < 4; k++) {
    const x = (k - 1.5) * W * C.gap;
    put(MeshBuilder.CreateBox("walkerHelmBar", { width: W * C.barW, height: H * C.barH, depth: D * 0.06 }, scene), x, H * C.barY, front + D * 0.02, tan);
  }
  body.leftEye?.setEnabled(false);
  body.rightEye?.setEnabled(false);
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 497 the Shadow Walker's hair (evil.shadow_walker.red.png: long dark hair hangs from under the helm down both sides of the neck to the
 * shoulders; audit 489 a.6).
 * Spec in head widths W, heights H, depths D (the head box, its centre c): from under the helm's rim (.root H under the centre) a near-black
 * curtain: per side a flat slab .sideW W wide and .sideD D deep, .out W out from the middle, a little behind the centre, hanging .long H; at the
 * back a slab .backW W across behind the head; and .strands 4-sided strands .strandW W thick tapering to points, spread round the sides and back,
 * hanging .strandL H below the slabs, so the ends are ragged. Lit near-black cloth (LESSONS 494), out of the glow next to the team skin.
 */
const WALKER_HAIR = { root: 0.42, long: 0.62, sideW: 0.16, sideD: 0.7, out: 0.56, backW: 1.06, strands: 9, strandW: 0.13, strandL: 0.34 };
export function walkerHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = WALKER_HAIR, head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const hairC = new Color3(0.08, 0.06, 0.07), hair = getMaterialFactory().get("cloth", hairC, { emissive: hairC.scale(0.4), roughness: 1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, y: number, z: number): Mesh => { m.parent = head; m.position.set(c.x + x, c.y + y, c.z + z); m.material = hair; out.push(m); return m; };
  const top = -H * C.root, mid = top - (H * C.long) / 2;
  for (const s of [-1, 1]) put(MeshBuilder.CreateBox("walkerHair", { width: W * C.sideW, height: H * C.long, depth: D * C.sideD }, scene), s * W * C.out, mid, -D * 0.12);
  put(MeshBuilder.CreateBox("walkerHair", { width: W * C.backW, height: H * C.long, depth: D * 0.16 }, scene), 0, mid, -D * 0.56);
  const bottom = top - H * C.long;
  for (let i = 0; i < C.strands; i++) {
    // round the sides and back, from one cheek (a = -1.9) to the other (1.9), a = 0 straight back
    const a = -1.9 + (3.8 * i) / (C.strands - 1), len = H * C.strandL * (0.75 + 0.5 * (((i * 7) % 5) / 4));
    const x = Math.sin(a) * W * C.out, z = -Math.cos(a) * D * 0.56 - D * 0.04;
    const s = put(MeshBuilder.CreateCylinder("walkerHairStrand", { height: len, diameterTop: W * C.strandW, diameterBottom: 0, tessellation: 4 }, scene), x, bottom - len / 2 + H * 0.02, z);
    s.rotation.y = a;
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 492 the Exiled Sentinel's shoulder spikes (evil.exiled_sentinel.red.png; audit 489 a.5: "rounded pauldrons - TABS: a row of tall black
 * spikes standing up over both shoulders, behind the shields").
 * Spec in torso widths W and heights TH (the torso box, torso frame): per shoulder a row of .count near-black 4-sided spikes along the shoulder
 * top from .from to .to W out from the middle, a little behind the centre (.back of the torso depth), each rooted at the torso's top and standing
 * up .tall TH (the middle ones tallest, the ends .endShare of that), .wide W across at the root, leaning out .splay rad toward its own side.
 */
const SENTINEL_SPIKES = { count: 4, from: 0.26, to: 0.56, back: 0.12, tall: 0.62, endShare: 0.72, wide: 0.12, splay: 0.22 };
export function sentinelShoulderSpikes(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = SENTINEL_SPIKES, tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling;
  const W = tb.extendSize.x * 2 * s.x, TH = tb.extendSize.y * 2 * s.y, TD = tb.extendSize.z * 2 * s.z;
  const top = tm.position.y + (tb.center.y + tb.extendSize.y) * s.y, cz = tm.position.z + tb.center.z * s.z;
  const blackC = new Color3(0.07, 0.05, 0.07), black = getMaterialFactory().get("cloth", blackC, { emissive: blackC.scale(0.4) });
  const out: Mesh[] = [];
  for (const side of [-1, 1]) for (let k = 0; k < S.count; k++) {
    const t = k / (S.count - 1), mid = 1 - Math.abs(t - 0.45) * 2;
    const tall = TH * S.tall * (S.endShare + (1 - S.endShare) * Math.max(0, mid));
    const m = MeshBuilder.CreateCylinder("sentinelShoulderSpike", { height: tall, diameterBottom: W * S.wide, diameterTop: 0, tessellation: 4 }, scene);
    m.parent = body.torso;
    const x = side * W * (S.from + (S.to - S.from) * t), lean = side * S.splay * (0.5 + t);
    m.rotation.set(-0.1, 0, -lean);
    m.position.set(x + Math.sin(lean) * tall * 0.5, top - TH * 0.04 + Math.cos(lean) * tall * 0.5, cz - TD * S.back);
    m.material = black; out.push(m);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 492 the Void Cultist's spiked halo (evil.void_cultist.red.png; card "spiked halo"; audit 489 a.1: "a brown spoked wagon wheel behind the head -
 * TABS: a dark ring with black triangular spikes pointing inward toward the head"). It replaces the wooden wheel, hub and spokes.
 * Spec in head heights H (the head box, head frame): an upright near-black 12-sided ring .across H across, its tube .tube H thick, centred .up H
 * over the head's centre and .back H behind it; .count flat black triangles round its inside, each rooted on the ring and pointing in at the
 * centre, .len of the radius long and .base H wide at the root, .thin H thick; the middle left open (the head shows through it).
 */
const CULTIST_HALO = { across: 2.1, tube: 0.11, up: 0.15, back: 0.62, count: 10, len: 0.5, base: 0.38, thin: 0.06 };
export function cultistHalo(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CULTIST_HALO, head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center, H = b.extendSize.y * 2;
  const darkC = new Color3(0.08, 0.06, 0.08), dark = getMaterialFactory().get("cloth", darkC, { emissive: darkC.scale(0.4) });
  const root = new TransformNode("cultistHalo", scene);
  root.parent = head; root.position.set(c.x, c.y + H * C.up, c.z - H * C.back);
  const R = (H * C.across) / 2, out: Mesh[] = [];
  const ring = MeshBuilder.CreateTorus("cultistHaloRing", { diameter: R * 2, thickness: H * C.tube, tessellation: 12 }, scene);
  ring.rotation.x = Math.PI / 2; ring.parent = root; ring.material = dark; out.push(ring);
  for (let i = 0; i < C.count; i++) {
    const a = (i / C.count) * Math.PI * 2, len = R * C.len;
    // a 4-sided cone flattened in z is a flat triangle; its +y turned by a about z points at angle a, so a + PI points it at the centre
    const t = MeshBuilder.CreateCylinder("cultistHaloSpike", { height: len, diameterBottom: H * C.base, diameterTop: 0, tessellation: 4 }, scene);
    t.scaling.z = C.thin / C.base; t.parent = root; t.material = dark;
    const r = R - len * 0.5;
    t.position.set(-Math.sin(a) * r, Math.cos(a) * r, 0); t.rotation.z = a + Math.PI;
    out.push(t);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 493 the Void Cultist's beard (evil.void_cultist.blue.png, .red.png; card "beard"; audit 489 a.2: "a small grey mask over the chin - TABS: a big
 * dark-grey pointed beard and drooping moustache from the nose to mid-chest"). It replaces the 6-sided chin wedge and its five thin strands.
 * Spec in head widths W, heights H, depths D (the head box, its centre c):
 *   - the beard: a 6-sided cone turned point-down, .wide W across at its top, which sits .top H under the head's centre (below the bead eyes), and
 *     .long H long down to a blunt point on the chest; flattened to .flat of its width in depth, its back .back D in front of the centre so it
 *     hangs over the chin and the chest, tipped .tip rad forward at the point;
 *   - sideburns: per side a slab .sideW W wide and .sideH H tall from the temple down into the beard, .side W out, at the cheek;
 *   - the moustache: per side a 4-sided horn .mLong H long and .mW W thick at the root under the nose (.mY H under the centre, .mX W out), drooping
 *     down and out .mDroop rad, in a lighter grey; two lighter streaks .streak H long down the beard's front.
 * Flat unlit dark grey (.dark) and light grey (.light), out of the glow.
 */
const CULTIST_BEARD = {
  wide: 1.12, top: 0.08, long: 1.55, flat: 0.42, back: -0.2, tip: 0.2, sideW: 0.14, sideH: 0.55, side: 0.5,
  mLong: 0.5, mW: 0.13, mY: 0.1, mX: 0.07, mDroop: 0.5, streak: 0.8,
  dark: new Color3(0.17, 0.15, 0.14), light: new Color3(0.42, 0.39, 0.35),
};
export function cultistBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CULTIST_BEARD, head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const mf = getMaterialFactory();
  const dark = mf.get("unlit", C.dark, { emissive: C.dark }), light = mf.get("unlit", C.light, { emissive: C.light });
  const out: Mesh[] = [];
  const front = c.z + D * 0.5;
  const root = new TransformNode("cultistBeard", scene);
  root.parent = head; root.position.set(c.x, c.y - H * C.top, front - D * C.back); root.rotation.x = -C.tip; // -x turns the hanging point forward
  const long = H * C.long;
  const beard = MeshBuilder.CreateCylinder("cultistBeardMass", { height: long, diameterTop: W * C.wide, diameterBottom: W * 0.12, tessellation: 6 }, scene);
  beard.parent = root; beard.position.set(0, -long / 2, W * C.wide * C.flat * 0.5); beard.scaling.z = C.flat; beard.rotation.y = Math.PI / 6; beard.material = dark; out.push(beard);
  for (const x of [-0.16, 0.16]) {
    const s = MeshBuilder.CreateBox("cultistBeardStreak", { width: W * 0.07, height: H * C.streak, depth: W * 0.05 }, scene);
    s.parent = root; s.position.set(x * W, -H * (0.15 + C.streak / 2), W * C.wide * C.flat + W * 0.01); s.rotation.z = x * 0.6; s.material = light; out.push(s);
  }
  for (const side of [-1, 1]) {
    const burn = MeshBuilder.CreateBox("cultistSideburn", { width: W * C.sideW, height: H * C.sideH, depth: D * 0.5 }, scene);
    burn.parent = head; burn.position.set(c.x + side * W * C.side, c.y - H * 0.12, c.z + D * 0.12); burn.material = dark; out.push(burn);
    const m = MeshBuilder.CreateCylinder("cultistMoustache", { height: H * C.mLong, diameterTop: W * C.mW, diameterBottom: 0, tessellation: 4 }, scene);
    m.parent = head; m.rotation.z = side * C.mDroop;
    m.position.set(c.x + side * (W * C.mX + Math.sin(C.mDroop) * H * C.mLong * 0.5), c.y - H * C.mY - Math.cos(C.mDroop) * H * C.mLong * 0.5, front + D * 0.06);
    m.material = light; out.push(m);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 491 the Void Cultist's buckler (evil.void_cultist.jpg, .red.png; audit 489 b.2: "a small brown disc - TABS: a large dark round buckler,
 * shoulder-wide, with a raised rim ring and spikes around the rim and face"). It replaces the 1.5-chest disc that was cut in the hand's own
 * (shrunken) frame and read head-sized.
 * Spec in torso widths W, sized in the world, not the hand's frame (the hand's scale is divided out): a near-black 12-sided board .across W
 * across and .thick W thick on the off hand, its face out from the fist; a raised iron rim ring (a torus .rimT W thick) at its edge and a second
 * raised ring .ring of the radius in; .rim iron spikes .spike W long standing out round the edge; .face spikes .faceSpike W long on the inner
 * ring's line, half a step round from the rim's; a boss spike .boss W long out of the middle.
 */
// [S] 496 (b.2) 1.85 chests across, wider than the shoulders (was 1.3; 1.6 read torso-wide in the three-quarter idle, look 496); proceduralAnimation
// _seatBuckler centres it chin to hip
const CULTIST_BUCKLER = { across: 1.85, thick: 0.06, rimT: 0.07, ring: 0.62, rim: 10, spike: 0.2, face: 5, faceSpike: 0.16, boss: 0.26 };
export function cultistBuckler(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CULTIST_BUCKLER, tm = body.torsoMesh, te = tm.getBoundingInfo().boundingBox.extendSize;
  body.torso.computeWorldMatrix(true); body.leftHand.computeWorldMatrix(true);
  // torso-frame lengths into the hand's frame
  const k = body.torso.absoluteScaling.x / Math.max(1e-4, body.leftHand.absoluteScaling.x);
  const W = te.x * 2 * tm.scaling.x * k, R = (W * C.across) / 2;
  const mf = getMaterialFactory();
  const boardC = new Color3(0.13, 0.08, 0.07), board = mf.get("cloth", boardC, { emissive: boardC.scale(0.15) });
  const ironC = new Color3(0.2, 0.16, 0.15), iron = mf.get("cloth", ironC, { emissive: ironC.scale(0.15) });
  const root = new TransformNode("cultistBuckler", scene);
  // where the 489 disc sat: an offset in the hand frame (torso widths unscaled), so the board stays off the face
  root.parent = body.leftHand; root.position.set((W / k) * 0.25, (W / k) * 0.55, (W / k) * 0.45);
  // the face points +z (out from the body in front of the fist): the disc lies in x-y
  const out: Mesh[] = [];
  const add = (m: Mesh, material: typeof board): Mesh => { m.parent = root; m.material = material; out.push(m); return m; };
  const disc = add(MeshBuilder.CreateCylinder("cultistBucklerBoard", { height: W * C.thick, diameter: R * 2, tessellation: 12 }, scene), board);
  disc.rotation.x = Math.PI / 2;
  for (const [r, name] of [[R * 0.97, "cultistBucklerRim"], [R * C.ring, "cultistBucklerRing"]] as const) {
    const ring = add(MeshBuilder.CreateTorus(name, { diameter: r * 2, thickness: W * C.rimT, tessellation: 12 }, scene), iron);
    ring.rotation.x = Math.PI / 2; ring.position.z = W * C.thick * 0.5;
  }
  const spike = (name: string, len: number, x: number, y: number, z: number, rx: number, rz: number): void => {
    const m = add(MeshBuilder.CreateCylinder(name, { height: len, diameterTop: 0, diameterBottom: W * 0.08, tessellation: 4 }, scene), iron);
    m.position.set(x, y, z); m.rotation.set(rx, 0, rz);
  };
  for (let i = 0; i < C.rim; i++) {
    // out along the radius in the disc's plane: +y turned by -a about z points at angle a
    const a = (i / C.rim) * Math.PI * 2, r = R + W * C.spike * 0.45;
    spike("cultistBucklerSpike", W * C.spike, Math.sin(a) * r, Math.cos(a) * r, 0, 0, -a);
  }
  for (let i = 0; i < C.face; i++) {
    const a = ((i + 0.5) / C.face) * Math.PI * 2, r = R * C.ring;
    spike("cultistBucklerFaceSpike", W * C.faceSpike, Math.sin(a) * r, Math.cos(a) * r, W * (C.thick * 0.5 + C.faceSpike * 0.45), Math.PI / 2, 0);
  }
  spike("cultistBucklerBoss", W * C.boss, 0, 0, W * (C.thick * 0.5 + C.boss * 0.45), Math.PI / 2, 0);
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 494 the Mad Mechanic's goggles and bun (evil.mad_mechanic.red.png; card "goggles with 3 eye holes"; audit 489 a.1: "a brown flat cap with
 * glowing round goggles over the eyes - TABS: dark goggles pushed up on the forehead over a top bun, the bead eyes uncovered"). It replaces the cap
 * and the pale-blue lenses over the eyes (HORNED_EVIL mad_mechanic: no helm, no goggles).
 * Spec in head widths W, heights H, depths D (the head box, its centre c; the bead eyes' top read into the head frame, LESSONS 46):
 *   - a dark leather strap .strapH H tall round the head, its lower edge .above H over the eyes' top, .wrap of the head box across;
 *   - on its front, three dark goggle cups (two .cup W across .apart W either side of the middle, a smaller .mid one between and a little higher),
 *     each a 8-sided cup .deep D long with a dark red lens on its end, tipped .tilt rad up so the lenses look at the sky (pushed up, not worn);
 *   - a ginger-blond bun, a faceted ball .bun W across on the crown, .bunBack D behind the centre, a small knot .knot W on its top.
 */
const MECHANIC_GOGGLES = { strapH: 0.13, above: 0.05, wrap: 1.07, cup: 0.3, mid: 0.2, apart: 0.24, deep: 0.2, tilt: 1.05, bun: 0.46, bunBack: 0.12, knot: 0.22 };
export function mechanicGoggles(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = MECHANIC_GOGGLES, head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  // the bead eyes hang off the neck joint: read their top into the head's frame
  let eyeTop = c.y + H * 0.12;
  const eye = body.leftEye;
  if (eye) {
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = eye; n; n = n.parent as TransformNode | null) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    head.computeWorldMatrix(true);
    const inv = head.getWorldMatrix().clone().invert();
    eyeTop = Vector3.TransformCoordinates(eye.getBoundingInfo().boundingBox.maximumWorld, inv).y;
  }
  const mf = getMaterialFactory();
  const leatherC = new Color3(0.07, 0.05, 0.05), leather = mf.get("cloth", leatherC, { emissive: leatherC.scale(0.3) });
  const lensC = new Color3(0.3, 0.03, 0.03), lens = mf.get("cloth", lensC, { emissive: lensC.scale(0.4) });
  const hairC = MECHANIC_HAIR.hair, hair = mf.get("cloth", hairC, { emissive: hairC.scale(0.12) }); // [S] 495 the bun shares the long hair's ginger-brown
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, y: number, z: number, material: typeof leather): Mesh => {
    m.parent = head; m.position.set(x, y, z); m.material = material; out.push(m); return m;
  };
  const strapY = eyeTop + H * (C.above + C.strapH / 2);
  put(MeshBuilder.CreateBox("mechanicStrap", { width: W * C.wrap, height: H * C.strapH, depth: D * C.wrap }, scene), c.x, strapY, c.z, leather);
  const front = c.z + (D * C.wrap) / 2;
  for (const [x, across, lift] of [[-C.apart, C.cup, 0], [C.apart, C.cup, 0], [0, C.mid, 0.06]] as const) {
    const len = D * C.deep, y = strapY + H * (C.strapH * 0.5 + lift);
    // a cup's +y pitched forward by (PI/2 - tilt): it stands out of the brow and looks up
    const pitch = Math.PI / 2 - C.tilt;
    const cup = put(MeshBuilder.CreateCylinder("mechanicGoggle", { height: len, diameterBottom: W * across * 0.85, diameterTop: W * across, tessellation: 8 }, scene),
      c.x + W * x, y + Math.cos(pitch) * len * 0.5, front + Math.sin(pitch) * len * 0.5 - D * 0.04, leather);
    cup.rotation.x = pitch;
    const glass = put(MeshBuilder.CreateCylinder("mechanicLens", { height: len * 0.12, diameter: W * across * 0.7, tessellation: 8 }, scene),
      c.x + W * x, y + Math.cos(pitch) * len * 1.02, front + Math.sin(pitch) * len * 1.02 - D * 0.04, lens);
    glass.rotation.x = pitch;
  }
  put(MeshBuilder.CreateIcoSphere("mechanicBun", { radius: (W * C.bun) / 2, subdivisions: 1 }, scene), c.x, c.y + H * 0.5 + W * C.bun * 0.3, c.z - D * C.bunBack, hair);
  put(MeshBuilder.CreateIcoSphere("mechanicBunKnot", { radius: (W * C.knot) / 2, subdivisions: 1 }, scene), c.x, c.y + H * 0.5 + W * (C.bun * 0.75 + C.knot * 0.2), c.z - D * C.bunBack, hair);
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 495 the Mad Mechanic's long hair (evil.mad_mechanic.blue.png; audit 489 a.2: "hair: none - TABS: long ginger-blond hair falling past the ears
 * to the shoulders"). It hangs under the goggles' strap (mechanicGoggles) and shares the bun's colour.
 * Spec in head widths W, heights H, depths D (the head box, its centre c): per side a faceted 4-sided panel from under the strap (.top H over the
 * centre) down to .low H under it (the shoulder), .sideD D deep at the top narrowing to .sideD*.7 at its foot, .sideW W thick, hung just outside
 * the cheek (.out W from the middle), .back D behind the centre, its foot flared out .flare rad; a back panel .backW W across widening to
 * .backW*1.15, .backT D thick, from the strap down to .low, .rear D behind the centre; the ends cut into .tips points per side. Ginger-brown cloth
 * .hair self-lit .12 (palette: orange x.7 reads ginger-brown; the bun at (.95,.5,.15) read pale tan, look 494).
 */
export const MECHANIC_HAIR = { hair: new Color3(0.7, 0.3, 0.07), top: 0.3, low: 0.62, sideD: 0.72, sideW: 0.24, out: 0.6, back: 0.1, flare: 0.12, backW: 1.08, backT: 0.2, rear: 0.5, tips: 3 };
export function mechanicHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = MECHANIC_HAIR, head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const hair = getMaterialFactory().get("cloth", C.hair, { emissive: C.hair.scale(0.12) });
  const out: Mesh[] = [];
  const tall = H * (C.top + C.low), midY = c.y + H * (C.top - C.low) / 2;
  const panel = (name: string, x: number, z: number, top: number, foot: number, thick: number, rz: number, alongX: boolean): Mesh => {
    // a 4-sided frustum turned so its faces are square to the axes, then squashed to a slab
    const m = MeshBuilder.CreateCylinder(name, { height: tall, diameterTop: top * Math.SQRT2, diameterBottom: foot * Math.SQRT2, tessellation: 4 }, scene);
    // bake the eighth-turn before parenting: the bake takes the world matrix
    m.rotation.set(0, Math.PI / 4, 0); m.material = hair;
    const k = thick / top;
    m.bakeCurrentTransformIntoVertices();
    m.rotation.set(0, 0, 0); m.parent = head;
    if (alongX) m.scaling.z = k; else m.scaling.x = k;
    m.rotation.z = rz; m.position.set(x, midY, z); out.push(m); return m;
  };
  for (const side of [-1, 1]) {
    panel("mechanicHairSide", c.x + side * W * C.out, c.z - D * C.back, D * C.sideD, D * C.sideD * 0.7, W * C.sideW, side * C.flare, false);
    for (let k = 0; k < C.tips; k++) {
      // points along the side panel's foot, front to back
      const tip = MeshBuilder.CreateCylinder("mechanicHairTip", { height: H * 0.28, diameterTop: D * C.sideD * 0.7 / C.tips * 1.2, diameterBottom: 0, tessellation: 4 }, scene);
      tip.parent = head; tip.material = hair; tip.scaling.x = 0.6;
      tip.position.set(c.x + side * (W * C.out + Math.sin(C.flare) * tall * 0.5), c.y - H * C.low - H * 0.12, c.z - D * C.back + D * C.sideD * 0.7 * ((k + 0.5) / C.tips - 0.5));
      out.push(tip);
    }
  }
  panel("mechanicHairBack", c.x, c.z - D * C.rear, W * C.backW, W * C.backW * 1.15, D * C.backT, 0, true);
  for (let k = 0; k < C.tips + 1; k++) {
    const tip = MeshBuilder.CreateCylinder("mechanicHairTip", { height: H * 0.3, diameterTop: W * C.backW * 1.15 / (C.tips + 1) * 1.2, diameterBottom: 0, tessellation: 4 }, scene);
    tip.parent = head; tip.material = hair; tip.scaling.z = 0.6;
    tip.position.set(c.x + W * C.backW * 1.15 * ((k + 0.5) / (C.tips + 1) - 0.5), c.y - H * C.low - H * 0.13, c.z - D * C.rear);
    out.push(tip);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 494 the Exiled Sentinel's spiked leggings (evil.exiled_sentinel.red.png; card "a spiked uniform ... bracers and leggings ... all covered in
 * spikes"; audit 489 a.4: "smooth armoured legs - TABS: dark leggings covered in rows of team-coloured diamond spikes").
 * Spec in each leg mesh's own frame (its box half-extents e, radius r = the larger of e.x, e.z): the thigh, shin and foot go near-black cloth;
 * on each shin .shinRows rows and on each thigh .thighRows rows, evenly from .from to .to of the mesh's height (top to bottom), each row .perRow
 * team diamonds round the front half and the sides (from -.arc to +.arc rad off the front, rows turned half a step apart): a diamond is a
 * 4-sided double point (two pyramids base to base) .long r tall up the leg, .wide r across, standing .proud r out of the leg's surface.
 */
const SENTINEL_LEGGINGS = { shinRows: 4, thighRows: 2, from: 0.82, to: 0.12, perRow: 4, arc: 1.75, long: 0.95, wide: 0.6, proud: 0.42 };
export function sentinelLeggings(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const S = SENTINEL_LEGGINGS, mf = getMaterialFactory();
  const blackC = new Color3(0.07, 0.05, 0.07), black = mf.get("cloth", blackC, { emissive: blackC.scale(0.4) });
  const spikeMat = mf.get("cloth", team, { emissive: team.scale(0.18) });
  const out: Mesh[] = [];
  const legs: [Mesh, number][] = [[body.leftLowerLeg, S.shinRows], [body.rightLowerLeg, S.shinRows], [body.leftUpperLeg, S.thighRows], [body.rightUpperLeg, S.thighRows]];
  for (const [leg, rows] of legs) {
    leg.material = black;
    const bb = leg.getBoundingInfo().boundingBox, e = bb.extendSize, cc = bb.center, r = Math.max(e.x, e.z);
    for (let row = 0; row < rows; row++) {
      const t = rows === 1 ? 0.5 : S.from + (S.to - S.from) * (row / (rows - 1));
      const y = cc.y - e.y + e.y * 2 * t;
      for (let k = 0; k < S.perRow; k++) {
        const a = -S.arc + (2 * S.arc) * ((k + (row % 2) * 0.5) / S.perRow);
        const half = (r * S.long) / 2;
        for (const up of [1, -1]) {
          // one pyramid of the pair: its base at the diamond's middle, its point up (or down) the leg; the pair flattened onto the leg
          const p = MeshBuilder.CreateCylinder("sentinelLegSpike", { height: half, diameterBottom: r * S.wide, diameterTop: 0, tessellation: 4 }, scene);
          p.parent = leg; p.material = spikeMat;
          p.rotation.set(up > 0 ? 0 : Math.PI, a, 0);
          const out1 = r * (1 + S.proud * 0.35);
          p.position.set(cc.x + Math.sin(a) * out1, y + up * half * 0.5, cc.z + Math.cos(a) * out1);
          p.scaling.z = 0.55; // flattened toward the leg (z is its depth after the yaw)
          out.push(p);
        }
        // the diamond's point standing out of the leg
        const tip = MeshBuilder.CreateCylinder("sentinelLegSpikeTip", { height: r * S.proud, diameterBottom: r * S.wide * 0.55, diameterTop: 0, tessellation: 4 }, scene);
        tip.parent = leg; tip.material = spikeMat;
        tip.rotation.set(Math.PI / 2, a, 0);
        tip.position.set(cc.x + Math.sin(a) * (r + r * S.proud * 0.5), y, cc.z + Math.cos(a) * (r + r * S.proud * 0.5));
        out.push(tip);
      }
    }
  }
  for (const knee of [body.leftKnee, body.rightKnee]) for (const m of knee.getChildMeshes(false)) if (/_[lr]FootM$/.test(m.name)) m.material = black;
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 495 the Exiled Sentinel's dark uniform (evil.exiled_sentinel.blue.png; card "a spiked uniform ... bracers and leggings"; audit 489 a.3: "plain
 * team-blue plate armour all over - TABS: a dark uniform with team skin at the face and hands only").
 * Spec: the trunk, yoke, pelvis, neck, upper and lower arms (the body cloth and the arm skin) go near-black lit cloth .dark self-lit .4, roughness 1
 * (the cultist robe's cloth, LESSONS: near-black); the head and the fists keep the team skin; on each forearm a bracer, an 8-sided near-black cuff
 * .cuffW of the forearm's width across and .cuffL of its length long at the wrist end, ringed by .spikes team pyramid spikes .spike forearm widths
 * long standing straight out (the leggings' spike cloth); a near-black collar ring .collar torso widths across round the neck's foot.
 */
const SENTINEL_UNIFORM = { dark: new Color3(0.08, 0.06, 0.07), cuffW: 1.3, cuffL: 0.55, spikes: 5, spike: 0.45, collar: 0.62 };
export function sentinelUniform(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = SENTINEL_UNIFORM, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const dark = mf.get("cloth", C.dark, { emissive: C.dark.scale(0.4), roughness: 1 });
  const spikeMat = mf.get("cloth", team, { emissive: team.scale(0.18) });
  for (const m of body.allMeshes) if (/_(torsoM|yoke|pelvis|neckM|[lr](Upper|Lower)Arm(_stub)?)$/.test(m.name)) { m.material = dark; glow?.addExcludedMesh(m); }
  const out: Mesh[] = [];
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    const bb = arm.getBoundingInfo().boundingBox, e = bb.extendSize, cc = bb.center;
    // the forearm runs along its local y; the wrist is its lower end (toward the hand)
    const r = Math.max(e.x, e.z), len = e.y * 2 * C.cuffL;
    const root = new TransformNode("sentinelBracer", scene);
    root.parent = arm; root.position.set(cc.x, cc.y - e.y + len / 2, cc.z);
    const cuff = MeshBuilder.CreateCylinder("sentinelBracerCuff", { height: len, diameterTop: r * 2 * C.cuffW * 0.9, diameterBottom: r * 2 * C.cuffW, tessellation: 8 }, scene);
    cuff.parent = root; cuff.material = dark; out.push(cuff);
    for (let k = 0; k < C.spikes; k++) {
      const a = (k / C.spikes) * Math.PI * 2;
      const sp = MeshBuilder.CreateCylinder("sentinelBracerSpike", { height: r * 2 * C.spike, diameterBottom: r * 0.7, diameterTop: 0, tessellation: 4 }, scene);
      const out1 = r * C.cuffW + r * C.spike * 0.8;
      sp.parent = root; sp.rotation.set(Math.PI / 2, a, 0); sp.position.set(Math.sin(a) * out1, 0, Math.cos(a) * out1); sp.material = spikeMat; out.push(sp);
    }
  }
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling, W = tb.extendSize.x * 2 * s.x;
  const top = tm.position.y + (tb.center.y + tb.extendSize.y) * s.y;
  const collar = MeshBuilder.CreateCylinder("sentinelCollar", { height: W * 0.12, diameterBottom: W * C.collar, diameterTop: W * C.collar * 0.8, tessellation: 8 }, scene);
  collar.parent = body.torso; collar.position.set(0, top + W * 0.03, tm.position.z + tb.center.z * s.z); collar.material = dark; out.push(collar);
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 494 the Void Cultist's dark priest robe (evil.void_cultist.red.png, .blue.png; card "dark priest clothing"; audit 489 a.3: "a grey-lilac robe
 * - TABS: a near-black priest robe with a team-coloured stripe down the front"). The lit maroon robe read grey-lilac under the evil_void cloth.
 * Spec: every mesh in the body's own cloth or in the robe cloth (trunk, yoke, sleeves, legs, the hip skirt) goes near-black cloth .dark, self-lit .4
 * like the halo (an unlit near-black read plum in the haze, look 494), out of the glow; one team stripe .stripe torso widths wide runs down the front, .off torso widths to his right of the middle: on the trunk
 * from the neck to the waist, standing .proud torso widths off the front of whichever is further out, the torso or the yoke; on the skirt from its
 * waist to its hem along its front face (tilted with the flare), in lit team cloth self-lit .18 (the sentinel's spikes).
 */
// waist: hangSkirt SKIRT_WAIST over VOID_HEM (1.15 / 1.6), the skirt's waist radius over its hem radius
const CULTIST_ROBE = { dark: new Color3(0.08, 0.06, 0.07), stripe: 0.13, off: -0.14, proud: 0.03, thick: 0.03, waist: 1.15 / 1.6 };
export function cultistDarkRobe(scene: Scene, body: ArticulatedBody, team: Color3, robeCloth: unknown, skirt: Mesh | null): Mesh[] {
  const C = CULTIST_ROBE, mf = getMaterialFactory();
  // fully rough: a smoother near-black cloth picked up the sky as a plum sheen across the robe (probe 494)
  const dark = mf.get("cloth", C.dark, { emissive: C.dark.scale(0.4), roughness: 1 });
  const teamM = mf.get("cloth", team, { emissive: team.scale(0.18) });
  const glow = scene.getGlowLayerByName("glow");
  for (const m of body.allMeshes) if (m.material === body.bodyMaterial || m.material === robeCloth) { m.material = dark; glow?.addExcludedMesh(m); }
  if (skirt) { skirt.material = dark; glow?.addExcludedMesh(skirt); }
  const out: Mesh[] = [];
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling;
  const W = tb.extendSize.x * 2 * s.x, TH = tb.extendSize.y * 2 * s.y;
  // the trunk's front in the torso joint's frame: the further of the torso box and the yoke hull (read in the world, then back)
  const chain: TransformNode[] = [];
  for (let n: TransformNode | null = tm; n; n = n.parent as TransformNode | null) chain.unshift(n);
  for (const n of chain) n.computeWorldMatrix(true);
  const yoke = body.allMeshes.find((m) => /_yoke$/.test(m.name));
  yoke?.computeWorldMatrix(true);
  const inv = body.torso.getWorldMatrix().clone().invert();
  let front = -Infinity;
  for (const m of [tm, yoke]) {
    if (!m) continue;
    const bw = m.getBoundingInfo().boundingBox;
    for (const v of bw.vectorsWorld) front = Math.max(front, Vector3.TransformCoordinates(v, inv).z);
  }
  const midY = tm.position.y + tb.center.y * s.y;
  const trunk = MeshBuilder.CreateBox("cultistStripe", { width: W * C.stripe, height: TH * 1.02, depth: W * C.thick }, scene);
  trunk.parent = body.torso; trunk.position.set(W * C.off, midY, front + W * C.proud); trunk.material = teamM; out.push(trunk);
  if (skirt) {
    const sb = skirt.getBoundingInfo().boundingBox;
    // the 6-sided skirt (hangSkirt): its local x half-extent is the hem radius (a corner on x), its waist .waist of that; a flat face fronts +z at
    // cos 30 deg of the radius
    const hemR = sb.extendSize.x, topR = hemR * C.waist, face = Math.cos(Math.PI / 6);
    const top = new Vector3(W * C.off / Math.max(1e-3, skirt.absoluteScaling.x / body.torso.absoluteScaling.x), sb.maximum.y, topR * face);
    const hem = new Vector3(top.x, sb.minimum.y, hemR * face);
    const run = hem.subtract(top);
    const strip = MeshBuilder.CreateBox("cultistSkirtStripe", { width: W * C.stripe, height: run.length(), depth: W * C.thick }, scene);
    strip.parent = skirt; strip.position.copyFrom(top.add(hem).scale(0.5)); strip.position.z += W * C.proud;
    strip.rotation.x = -Math.atan2(run.z, -run.y);
    strip.material = teamM; out.push(strip);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 496 the Void Cultist's knee coat and boots (evil.void_cultist.blue.png, .red.png lower third; CONFIRM 494 a.2: "coat hem reaches the ground as a
 * bell, hiding the legs - TABS: coat ends at the knee, with dark trousers and boots with team-coloured cuffs showing below").
 * Spec: the robe skirt (hangSkirt, a share of the knee drop K) is cut from the pelvis top to .above K over the rest knee joint, both read in the hip
 * frame, so the hem sits on the knee whatever the leg's build (the idle's bent hip lifts the knee ~.3 K; a share of the 1.75 K skirt reached the
 * ankle); below it the near-black trouser legs show.
 * On each shin (its mesh box, limb along y, r the larger of its x and z half-extents) a boot: an 8-sided shell in dark leather .boot from the foot
 * up to .bootTop of the shin's length, .bootW r across, and a team cuff band .cuff of the shin long round its top, .cuffW r across, standing proud.
 */
const CULTIST_COAT = { above: 0.3, boot: new Color3(0.06, 0.045, 0.04), bootTop: 0.5, bootW: 2.25, cuff: 0.13, cuffW: 2.5 };
export function cultistCoatLength(body: ArticulatedBody): number {
  const pelvis = body.allMeshes.find((m) => /_pelvis$/.test(m.name));
  const K = Math.abs(body.leftKnee.position.y);
  if (!pelvis || K < 1e-4) return 1;
  const top = pelvis.position.y + pelvis.getBoundingInfo().boundingBox.extendSize.y;
  const hem = body.leftHip.position.y + body.leftKnee.position.y + K * CULTIST_COAT.above;
  return Math.max(0.3, (top - hem) / K);
}
export function cultistBoots(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = CULTIST_COAT, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const boot = mf.get("cloth", C.boot, { emissive: C.boot.scale(0.4), roughness: 1 });
  const teamM = mf.get("cloth", team, { emissive: team.scale(0.18) });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const bb = shin.getBoundingInfo().boundingBox, e = bb.extendSize, cc = bb.center, r = Math.max(e.x, e.z);
    const y0 = cc.y - e.y, long = e.y * 2 * C.bootTop;
    const shell = MeshBuilder.CreateCylinder("cultistBoot", { height: long, diameter: r * C.bootW, tessellation: 8 }, scene);
    shell.parent = shin; shell.position.set(cc.x, y0 + long / 2, cc.z); shell.material = boot; out.push(shell);
    const cuffL = e.y * 2 * C.cuff;
    const cuff = MeshBuilder.CreateCylinder("cultistBootCuff", { height: cuffL, diameterTop: r * C.cuffW * 1.06, diameterBottom: r * C.cuffW, tessellation: 8 }, scene);
    cuff.parent = shin; cuff.position.set(cc.x, y0 + long - cuffL / 2 + cuffL * 0.15, cc.z); cuff.material = teamM; out.push(cuff);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 495 the Void Cultist's coat sleeves (evil.void_cultist.red.png, both arms; CONFIRM 494 a.1: "bare team-coloured arms, no sleeve - TABS: dark
 * priest-coat sleeves to the wrist, team colour only on a cuff band and the mitt").
 * Spec in each arm mesh's own frame (its box half-extents e, r the larger of e.x, e.z; the limb runs along y): the upper and lower arm meshes and
 * their stubs go the robe's near-black cloth; over each lower arm a sleeve, an 8-sided near-black frustum from the elbow end (.top r across) widening
 * to a bell .bell r across at the wrist end, .over r past the wrist; a team cuff band .band of the sleeve long round its open end (the hand's own
 * voidCuff band sits just under it), standing a little proud.
 */
const CULTIST_SLEEVE = { top: 2.3, bell: 3.1, over: 0.6, band: 0.22 };
export function cultistSleeves(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = CULTIST_SLEEVE, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const dark = mf.get("cloth", CULTIST_ROBE.dark, { emissive: CULTIST_ROBE.dark.scale(0.4), roughness: 1 });
  const teamM = mf.get("cloth", team, { emissive: team.scale(0.18) });
  for (const m of body.allMeshes) if (/_[lr](Upper|Lower)Arm(_stub)?$/.test(m.name)) { m.material = dark; glow?.addExcludedMesh(m); }
  const out: Mesh[] = [];
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    const bb = arm.getBoundingInfo().boundingBox, e = bb.extendSize, cc = bb.center, r = Math.max(e.x, e.z);
    // the wrist is the arm's lower end (-y); the sleeve runs from the top of the forearm to .over r past the wrist
    const y0 = cc.y + e.y, y1 = cc.y - e.y - r * C.over, long = y0 - y1;
    const sleeve = MeshBuilder.CreateCylinder("cultistSleeve", { height: long, diameterTop: r * C.top, diameterBottom: r * C.bell, tessellation: 8 }, scene);
    sleeve.parent = arm; sleeve.position.set(cc.x, (y0 + y1) / 2, cc.z); sleeve.material = dark; out.push(sleeve);
    const bandL = long * C.band;
    const band = MeshBuilder.CreateCylinder("cultistSleeveBand", { height: bandL, diameterTop: r * C.bell * 0.97 + r * 0.12, diameterBottom: r * C.bell + r * 0.14, tessellation: 8 }, scene);
    band.parent = arm; band.position.set(cc.x, y1 + bandL / 2, cc.z); band.material = teamM; out.push(band);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 494 the Tempest Lich's tunic (evil.tempest_lich.red.png; audit 489 a.4: "a wide purple bell skirt down to the ground - TABS: a team tunic over
 * thin dark legs, with long black tattered strips trailing"). It replaces the ground-length bell skirt and its rags (HORNED_EVIL tempest_lich
 * skirt 0) and opens the legs for the Hover lift (c.2, LESSONS 58).
 * Spec in pelvis widths P (the pelvis box's x extent) and knee drops K (the knee joint's depth under the hip): an 8-sided team tunic skirt from the
 * pelvis top, .waist P across there, flaring to .hem P across at .long K down (above the knee), its depth the pelvis's ratio; under its hem
 * .strips near-black strips round the back half and the sides (from .arc rad off the back either way), each a flat 3-sided blade .stripW P wide at
 * the hem tapering to a point .stripLong K below it (lengths varied by .vary), hanging a little out (.flare rad); the thighs, shins and feet go
 * near-black cloth (the thin legs are UV lowerLegWidth/upperLegWidth).
 */
const LICH_TUNIC = { waist: 1.12, hem: 1.42, long: 0.78, strips: 7, arc: 2.2, stripW: 0.26, stripLong: 1.05, vary: 0.3, flare: 0.12 };
export function lichTunic(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = LICH_TUNIC, mf = getMaterialFactory();
  const pelvis = body.allMeshes.find((m) => /_pelvis$/.test(m.name));
  if (!pelvis) return [];
  const size = pelvis.getBoundingInfo().boundingBox.extendSize, P = size.x * 2, K = Math.abs(body.leftKnee.position.y);
  const cloth = mf.get("cloth", team, { emissive: team.scale(0.18) });
  const blackC = new Color3(0.05, 0.035, 0.05), black = mf.get("unlit", blackC, { emissive: blackC });
  const legC = new Color3(0.07, 0.05, 0.08), legs = mf.get("cloth", legC, { emissive: legC.scale(0.4) });
  const out: Mesh[] = [];
  const drop = K * C.long, depth = Math.max(0.7, (size.z / size.x) * 1.2);
  const root = new TransformNode("lichTunic", scene);
  root.parent = body.hip; root.position.y = pelvis.position.y + size.y; root.scaling.z = depth;
  const skirt = MeshBuilder.CreateCylinder("lichTunicSkirt", { height: drop, diameterTop: P * C.waist, diameterBottom: P * C.hem, tessellation: 8 }, scene);
  skirt.parent = root; skirt.position.y = -drop / 2; skirt.rotation.y = Math.PI / 8; skirt.material = cloth; out.push(skirt);
  const hemR = (P * C.hem) / 2;
  for (let i = 0; i < C.strips; i++) {
    // round the back (angle PI is straight behind) from -arc to +arc
    const a = Math.PI + C.arc * (i / (C.strips - 1) * 2 - 1);
    const long = K * C.stripLong * (1 - C.vary * (((i * 5) % 3) / 2));
    const s = MeshBuilder.CreateCylinder("lichTunicStrip", { height: long, diameterTop: P * C.stripW, diameterBottom: 0, tessellation: 3 }, scene);
    s.parent = root; s.material = black; s.scaling.z = 0.25;
    // tipped about its own x before the yaw: its point swings out (+z is outward once yawed onto a)
    s.rotation.set(-C.flare, a, 0);
    s.position.set(Math.sin(a) * hemR * 0.92, -drop - long / 2 + K * 0.08, Math.cos(a) * hemR * 0.92);
    out.push(s);
  }
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) leg.material = legs;
  for (const knee of [body.leftKnee, body.rightKnee]) for (const m of knee.getChildMeshes(false)) if (/_[lr]FootM$/.test(m.name)) m.material = legs;
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 495 the Tempest Lich's tendrils (evil.tempest_lich.red.png; audit 489 a.2: "a blue head with bead eyes under a dark box crown sprouting brown
 * twigs - TABS: headless; tall black tendrils rise from the neck in place of a head"). The block head, its bead eyes, the box cap and dome and the
 * brown tines (HORNED_EVIL tempest_lich) are hidden; the head mesh stays as the anchor.
 * Spec in head widths W and heights H (the head box, its centre c): a near-black 8-sided socket from the head's foot up .socket H, .sockW W across;
 * out of its top .count black tendrils, each a chain of 5-sided tapered segments through LICH_TENDRILS points [x W, y H over the socket top, z D],
 * rooted .root H thick and tapering to a point; the middle one tallest (about 2.4 H, the old tines' height, so the capture's framing holds), two
 * flanking ones near 2 H leaning out, the rest shorter and curling outward. Lit near-black cloth self-lit .4, roughness 1 (LESSONS near-black).
 */
const LICH_SOCKET = { socket: 0.42, sockW: 0.78, root: 0.2 };
const LICH_TENDRILS: [number, number, number][][] = [
  [[0, 0, 0], [0.05, 0.7, 0.02], [-0.06, 1.4, 0], [0.04, 2.0, -0.04], [0.02, 2.45, -0.02]],
  [[-0.18, 0, 0.05], [-0.3, 0.6, 0.06], [-0.32, 1.2, 0.04], [-0.45, 1.75, 0], [-0.5, 2.0, -0.02]],
  [[0.18, 0, 0.05], [0.28, 0.65, 0.06], [0.36, 1.25, 0], [0.42, 1.7, -0.04], [0.55, 1.95, -0.04]],
  [[-0.25, 0, -0.15], [-0.42, 0.45, -0.2], [-0.5, 0.9, -0.24], [-0.68, 1.15, -0.26]],
  [[0.25, 0, -0.15], [0.44, 0.5, -0.2], [0.52, 0.95, -0.22], [0.72, 1.2, -0.25]],
  [[-0.1, 0, 0.22], [-0.16, 0.4, 0.34], [-0.28, 0.8, 0.42], [-0.36, 0.95, 0.5]],
  [[0.1, 0, -0.25], [0.14, 0.55, -0.4], [0.08, 1.05, -0.52], [0.15, 1.35, -0.6]],
];
export function lichTendrils(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = LICH_SOCKET, head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  head.isVisible = false;
  body.leftEye?.setEnabled(false);
  body.rightEye?.setEnabled(false);
  for (const m of head.getChildMeshes(false)) if (/^(evilCap|evilCapDome|lichTine|lichTwig)/.test(m.name)) m.isVisible = false;
  const blackC = new Color3(0.08, 0.06, 0.07), black = getMaterialFactory().get("cloth", blackC, { emissive: blackC.scale(0.4), roughness: 1 });
  // the neck stub under the socket read as a blue band (look 495): it goes the tendrils' black
  for (const m of body.allMeshes) if (/_neckM$/.test(m.name)) { m.material = black; scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  const out: Mesh[] = [];
  const foot = c.y - H * 0.5, top = foot + H * C.socket;
  const socket = MeshBuilder.CreateCylinder("lichSocket", { height: H * C.socket, diameterBottom: W * C.sockW * 0.9, diameterTop: W * C.sockW, tessellation: 8 }, scene);
  socket.parent = head; socket.position.set(c.x, (foot + top) / 2, c.z); socket.material = black; out.push(socket);
  const up = new Vector3(0, 1, 0);
  for (const path of LICH_TENDRILS) {
    const pts = path.map(([x, y, z]) => new Vector3(c.x + x * W, top + y * H - H * 0.05, c.z + z * D));
    const n = pts.length - 1;
    for (let k = 0; k < n; k++) {
      const a = pts[k], e = pts[k + 1], d = e.subtract(a), len = d.length();
      const r0 = H * C.root * (1 - k / n), r1 = k === n - 1 ? 0 : H * C.root * (1 - (k + 1) / n);
      const seg = MeshBuilder.CreateCylinder("lichTendril", { height: len * 1.06, diameterBottom: r0, diameterTop: r1, tessellation: 5 }, scene);
      seg.parent = head; seg.material = black;
      seg.position.copyFrom(a.add(e).scale(0.5));
      seg.rotationQuaternion = Quaternion.FromUnitVectorsToRef(up, d.normalize(), new Quaternion());
      out.push(seg);
    }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 496 the Death Bringer's skull mask (evil.death_bringer.blue.png, .red.png; audit 489 a.2: "a white cube skull with purple horns - TABS: a
 * bone-tan skull mask with sad sockets and team-coloured curved horns"). It replaces HORNED_EVIL's cream skull and jaw boxes and their sockets.
 * Spec in head widths W, heights H, depths D (the head box, its centre c), read off the blue render (a 110 px mask over a 95 px head): a faceted
 * prism whose face outline runs from a brow .brow W across at .top H over the centre, out to the cheekbones .cheek W across at .cheekY, and in to a
 * blunt chin .chin W across at .chinY, its depth .deep D centred .back D behind the face so it hides the whole block; on its face two sad sockets,
 * dark slabs .sockW W x .sockH H at .sockX W out and .sockY H, their outer ends tipped .droop rad down; a dark inverted 3-sided nose .nose W wide at
 * .noseY. Lit tan cloth (palette 496 tan row), self-lit .12, out of the glow with the skull's old meshes. The horns go team cloth, darkened .horn.
 */
const DEATH_MASK = {
  tan: new Color3(0.8, 0.6, 0.35), brow: 1.04, top: 0.56, cheek: 1.18, cheekY: 0.02, chin: 0.42, chinY: -0.62, deep: 1.12, back: 0.04,
  sockW: 0.3, sockH: 0.11, sockX: 0.24, sockY: 0.06, droop: 0.35, nose: 0.14, noseY: -0.18, horn: 0.5,
};
function prism(scene: Scene, name: string, outline: number[][], depth: number): Mesh {
  const pos: number[] = [], idx: number[] = [], n = outline.length;
  for (const z of [depth / 2, -depth / 2]) for (const [x, y] of outline) pos.push(x, y, z);
  for (let j = 1; j < n - 1; j++) idx.push(0, j, j + 1, n, n + j + 1, n + j);
  for (let j = 0; j < n; j++) { const k = (j + 1) % n; idx.push(j, k + n, k, j, j + n, k + n); }
  const normals: number[] = []; VertexData.ComputeNormals(pos, idx, normals);
  const data = new VertexData(); data.positions = pos; data.indices = idx; data.normals = normals;
  const mesh = new Mesh(name, scene); data.applyToMesh(mesh); mesh.convertToFlatShadedMesh();
  return mesh;
}
export function deathBringerMask(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = DEATH_MASK, head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center, mf = getMaterialFactory();
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2, glow = scene.getGlowLayerByName("glow");
  for (const m of head.getChildMeshes(true)) if (/^evil(Skull|Jaw|Socket|Nose)$/.test(m.name)) m.setEnabled(false);
  const hornC = team.scale(C.horn), horn = mf.get("cloth", hornC, { emissive: hornC.scale(0.18) });
  for (const m of head.getChildMeshes(true)) if (m.name === "evilHorn") (m as Mesh).material = horn;
  const tan = mf.get("cloth", C.tan, { emissive: C.tan.scale(0.12) });
  const dark = mf.get("unlit", new Color3(0.03, 0.02, 0.03), { emissive: new Color3(0.03, 0.02, 0.03) });
  const out: Mesh[] = [];
  // clockwise from the brow's right corner (+x is his left as seen from the front; the outline is symmetric)
  const outline = [
    [C.brow / 2, C.top], [C.cheek / 2, C.cheekY], [C.chin / 2, C.chinY], [-C.chin / 2, C.chinY], [-C.cheek / 2, C.cheekY], [-C.brow / 2, C.top],
  ].map(([x, y]) => [x * W, y * H]);
  const mask = prism(scene, "deathMask", outline, D * C.deep);
  mask.parent = head; mask.position.set(c.x, c.y, c.z - D * C.back); mask.material = tan; out.push(mask);
  const face = c.z - D * C.back + (D * C.deep) / 2;
  for (const side of [-1, 1]) {
    const s = MeshBuilder.CreateBox("deathMaskSocket", { width: W * C.sockW, height: H * C.sockH, depth: D * 0.06 }, scene);
    s.parent = head; s.position.set(c.x + side * W * C.sockX, c.y + H * C.sockY, face + D * 0.02); s.rotation.z = -side * C.droop; s.material = dark; out.push(s);
  }
  const nose = MeshBuilder.CreateCylinder("deathMaskNose", { height: H * 0.14, diameterBottom: W * C.nose, diameterTop: 0, tessellation: 3 }, scene);
  nose.parent = head; nose.rotation.x = Math.PI; nose.scaling.z = 0.3; nose.position.set(c.x, c.y + H * C.noseY, face + D * 0.02); nose.material = dark; out.push(nose);
  // the team-skin neck under the chin glowed blue over the mask's foot (probe 496): out of the glow
  for (const m of body.allMeshes) if (/_neckM$/.test(m.name)) glow?.addExcludedMesh(m);
  for (const m of out) { if (m !== mask) m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 496 the Tempest Lich's collar (evil.tempest_lich.blue.png; audit 489 a.3: "collar: none - TABS: a jagged ochre-brown collar at the base of the
 * tendrils").
 * Spec in head widths W and heights H (the head box, its centre c; the socket LICH_SOCKET .sockW W across sits from the head's foot): an ochre 8-sided
 * band .band H tall, .wide W across, round the socket's foot; .points flat 3-sided points round it, each .pointW W wide at the root: the front and
 * sides hang .down H below the band, every other one shorter (.vary), and the same count stand .up H above it, turned half a step, so the ring
 * reads jagged above and below. Lit ochre cloth (palette 496: gold x .45 displays the render's ochre-brown), self-lit .12, out of the glow.
 */
const LICH_COLLAR = { ochre: new Color3(0.45, 0.31, 0.08), band: 0.16, wide: 0.98, points: 8, pointW: 0.3, down: 0.3, up: 0.2, vary: 0.35 };
export function lichCollar(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = LICH_COLLAR, head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const ochre = getMaterialFactory().get("cloth", C.ochre, { emissive: C.ochre.scale(0.12) });
  const out: Mesh[] = [];
  const foot = c.y - H * 0.5, r = (W * C.wide) / 2, rz = r * Math.max(0.8, D / W);
  const band = MeshBuilder.CreateCylinder("lichCollar", { height: H * C.band, diameterBottom: r * 2 * 1.04, diameterTop: r * 2, tessellation: 8 }, scene);
  band.parent = head; band.scaling.z = rz / r; band.position.set(c.x, foot + H * C.band / 2, c.z); band.material = ochre; out.push(band);
  for (let i = 0; i < C.points * 2; i++) {
    const down = i % 2 === 0, k = Math.floor(i / 2), a = ((k + (down ? 0 : 0.5)) / C.points) * Math.PI * 2;
    const long = H * (down ? C.down : C.up) * (k % 2 ? 1 - C.vary : 1);
    const p = MeshBuilder.CreateCylinder("lichCollarPoint", { height: long, diameterBottom: W * C.pointW, diameterTop: 0, tessellation: 3 }, scene);
    p.parent = head; p.material = ochre; p.scaling.z = 0.3;
    p.rotation.set(down ? Math.PI : 0, a, 0);
    const y = down ? foot - long / 2 + H * 0.02 : foot + H * C.band + long / 2 - H * 0.02;
    p.position.set(c.x + Math.sin(a) * r * 1.02, y, c.z + Math.cos(a) * rz * 1.02);
    out.push(p);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 495 the Death Bringer's long black hair (evil.death_bringer.red.png; audit 489 a.3: "hair: none - TABS: long black hair falling over the chest to
 * the waist"). Built in two parts (LESSONS: a head-hung piece cannot run on down the torso): the crown head-hung, the fall over the chest and back
 * torso-parented.
 * Spec. Head part, in head widths W, heights H, depths D (the head box, its centre c; the skull mask is 1.15 W across): a near-black cap .capW W
 * across over the crown and the back of the head, from .capTop H over the centre down to the head's foot, .rear D behind the centre; per side a
 * strand slab .sideT W thick, .sideD D deep, just outside the mask (.side W out) from the cap down to the head's foot. Torso part, in torso widths TW
 * and heights TH (the torso box, torso frame): .front strands down the chest from the collar, spread over .spread TW across, each .strandW TW wide,
 * .strandT TW thick, .long TH long (varied by .vary) to a point at the waist, standing .proud TW off the chest's front, tipped .lean rad out at the
 * foot; .back strands the same down the back, .backLong TH long. Lit near-black cloth self-lit .4, roughness 1, out of the glow.
 */
const DEATH_HAIR = {
  capW: 1.3, capTop: 0.62, rear: 0.58, sideT: 0.18, sideD: 0.85, side: 0.66,
  front: 7, spread: 0.66, strandW: 0.2, strandT: 0.07, long: 1.0, vary: 0.18, proud: 0.05, lean: 0.06, back: 5, backLong: 0.8,
};
export function deathBringerHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = DEATH_HAIR, mf = getMaterialFactory();
  // darker than the robe recipe: the chest strands face the lit field and the .08 cloth read brown (probe 495)
  const blackC = new Color3(0.025, 0.02, 0.025), black = mf.get("cloth", blackC, { emissive: blackC.scale(0.5), roughness: 1 });
  // the fall over the chest sits in the fxPreset ember light, which turned lit black cloth leather-brown (probe 495): flat unlit black
  const fallC = new Color3(0.02, 0.015, 0.02), fall = mf.get("unlit", fallC, { emissive: fallC });
  const out: Mesh[] = [];
  const head = body.headMesh, hb = head.getBoundingInfo().boundingBox, c = hb.center;
  const W = hb.extendSize.x * 2, H = hb.extendSize.y * 2, D = hb.extendSize.z * 2;
  const put = (m: Mesh, parent: TransformNode, x: number, y: number, z: number): Mesh => { m.parent = parent; m.position.set(x, y, z); m.material = black; out.push(m); return m; };
  const capH = H * (C.capTop + 0.5);
  put(MeshBuilder.CreateBox("deathHairCap", { width: W * C.capW, height: capH, depth: D * 0.5 }, scene), head, c.x, c.y + H * C.capTop - capH / 2, c.z - D * C.rear);
  put(MeshBuilder.CreateBox("deathHairCrown", { width: W * C.capW, height: H * 0.16, depth: D * 0.9 }, scene), head, c.x, c.y + H * (C.capTop - 0.08), c.z - D * 0.2);
  for (const side of [-1, 1]) {
    const s = put(MeshBuilder.CreateBox("deathHairSide", { width: W * C.sideT, height: capH, depth: D * C.sideD }, scene), head, c.x + side * W * C.side, c.y + H * C.capTop - capH / 2, c.z - D * 0.12);
    s.rotation.z = side * 0.05;
  }
  // the "cape" prop hung over his chest read as a brown cuirass and hid the fall (probe 495): TABS has none
  for (const m of body.torso.getChildMeshes(true)) if (m.name === "cape") m.setEnabled(false);
  // the self-lit skull mask's glow halo washed the black fall leather-brown (probe 495: black with --noglow): keep the mask out of the glow
  for (const m of head.getChildMeshes(true)) if (/^evil(Skull|Jaw)$/.test(m.name)) scene.getGlowLayerByName("glow")?.addExcludedMesh(m as Mesh);
  // and the self-lit body cloth under it glowed through the fall the same way: out of the glow
  for (const m of body.allMeshes) if (m.material === body.bodyMaterial) scene.getGlowLayerByName("glow")?.addExcludedMesh(m);
  // the fall over the chest and the back, in the torso joint's frame
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, sc = tm.scaling;
  const TW = tb.extendSize.x * 2 * sc.x, TH = tb.extendSize.y * 2 * sc.y, TD = tb.extendSize.z * 2 * sc.z;
  const top = tm.position.y + (tb.center.y + tb.extendSize.y) * sc.y, cz = tm.position.z + tb.center.z * sc.z;
  const strands = (n: number, z: number, long: number, dir: number): void => {
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0 : i / (n - 1) - 0.5, len = TH * long * (1 - C.vary * ((i * 5) % 3) / 2);
      // a 4-sided frustum turned an eighth (baked) so its faces are square, flattened in z: a flat strand, wide at the collar, a point at its foot
      const m = MeshBuilder.CreateCylinder("deathHairStrand", { height: len, diameterTop: TW * C.strandW * Math.SQRT2, diameterBottom: TW * C.strandW * 0.25, tessellation: 4 }, scene);
      m.rotation.y = Math.PI / 4; m.bakeCurrentTransformIntoVertices(); m.rotation.y = 0;
      m.scaling.z = C.strandT / C.strandW;
      put(m, body.torso, t * TW * C.spread + Math.sin(t * C.lean * 4) * len * 0.5, top + TW * 0.04 - len / 2, z);
      m.material = fall;
      m.rotation.set(dir * 0.04, 0, -t * C.lean * 4);
    }
  };
  strands(C.front, cz + TD / 2 + TW * C.proud, C.long, 1);
  strands(C.back, cz - TD / 2 - TW * C.proud, C.backLong, -1);
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 495 the Tempest Lich's Hover (card Abilities "Hover"; ref evil.tempest_lich.jpg: he floats a shin's height over the ground, legs hanging; audit
 * 489 c.2: "he strides on the ground"). The 493 try (the Reaper's mark at its .15 lift) was hidden by the ground-length skirt; the tunic (494) now
 * leaves the legs open. A "reaperHover" node under the hip marks him for the animator's hover (proceduralAnimation REAPER_HOVER: legs hang, no
 * stride); its position.y carries his own lift, LICH_HOVER.lift of his height, so the gap under his feet clears the field's grass (~.6 of a foot box).
 */
const LICH_HOVER = { lift: 0.22 };
export function lichHover(scene: Scene, body: ArticulatedBody): void {
  const mark = new TransformNode("reaperHover", scene);
  mark.parent = body.hip; mark.position.y = LICH_HOVER.lift;
}

/**
 * [S] 494 the Tempest Lich's staff head (evil.tempest_lich.red.png; card "a staff with a crude design on the top"; audit 489 b.1: "a white orb - TABS:
 * a crude, jagged, team-coloured blade-crystal head"). The orb is hidden, not removed: a "staff" with an "orb" child is still a planted rod (LESSONS 20).
 * Spec in staff lengths L (the staff mesh's own height, its +y up the shaft): one jagged crystal blade .long L long rising from the shaft's top: .shards
 * 4-sided frustums stacked end to end, each one's foot as wide as the one below's top (.wide L across at the root, narrowing to a point at the tip),
 * flattened to .flat in depth, each set .kink L to alternate sides so the edges step out and in; a barb .barb L long off each side of the second shard,
 * pointing up and out .barbOut rad; a dark collar .collar L across where it meets the shaft. Lit team cloth self-lit .3, out of the glow.
 * (look 494: four double points touching tip to tip read as loose beads above the staff, not one blade)
 */
const LICH_CRYSTAL = { long: 0.3, shards: 4, wide: 0.1, flat: 0.45, kink: 0.012, barb: 0.07, barbOut: 0.75, collar: 0.06 };
export function lichStaffCrystal(scene: Scene, staff: Mesh, team: Color3): Mesh[] {
  const C = LICH_CRYSTAL, bb = staff.getBoundingInfo().boundingBox, L = bb.maximum.y - bb.minimum.y;
  const orb = staff.getChildMeshes(true).find((m) => m.name === "orb");
  if (orb) orb.isVisible = false;
  const mf = getMaterialFactory();
  const crystal = mf.get("cloth", team, { emissive: team.scale(0.3) });
  const darkC = new Color3(0.08, 0.06, 0.08), dark = mf.get("cloth", darkC, { emissive: darkC.scale(0.4) });
  const out: Mesh[] = [];
  const top = bb.maximum.y - L * 0.02;
  const collar = MeshBuilder.CreateCylinder("lichStaffCollar", { height: L * 0.03, diameter: L * C.collar, tessellation: 6 }, scene);
  collar.parent = staff; collar.position.y = top; collar.material = dark; out.push(collar);
  const seg = (L * C.long) / C.shards;
  // widths at each joint: the root .wide, then down to nothing at the tip (the last shard a point)
  const width = (k: number): number => L * C.wide * (1 - k / C.shards) * (k === 0 ? 1 : 1.12);
  for (let i = 0; i < C.shards; i++) {
    const x = (i % 2 ? 1 : -1) * L * C.kink;
    const p = MeshBuilder.CreateCylinder("lichCrystal", { height: seg * 1.04, diameterBottom: width(i), diameterTop: i === C.shards - 1 ? 0 : width(i + 1), tessellation: 4 }, scene);
    p.parent = staff; p.material = crystal; p.scaling.z = C.flat; p.rotation.y = Math.PI / 4;
    p.position.set(x, top + seg * (i + 0.5), 0);
    out.push(p);
    if (i === 1) for (const side of [-1, 1]) {
      const barb = MeshBuilder.CreateCylinder("lichCrystalBarb", { height: L * C.barb, diameterBottom: width(2) * 0.6, diameterTop: 0, tessellation: 4 }, scene);
      barb.parent = staff; barb.material = crystal; barb.scaling.z = C.flat; barb.rotation.z = -side * C.barbOut;
      barb.position.set(x + side * (width(1) * 0.4 + Math.sin(C.barbOut) * L * C.barb * 0.5), top + seg * 1.3 + Math.cos(C.barbOut) * L * C.barb * 0.5, 0);
      out.push(barb);
    }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 497 the Tempest Lich's staff shaft (evil.tempest_lich.blue.png, .red.png: a thin near-black pole, a few bands along it; audit 489 b.3: "a thick
 * grey tube"). The rod mesh itself is hidden (its children, the crystal and the hidden orb, still ride it: it stays the planted "staff" rod) and a
 * new pole stands in its place.
 * Spec in staff lengths L (the rod's own height, +y up the shaft): a 6-sided near-black pole .thick L across from the rod's foot to its top; .bands
 * slightly wider dark-iron bands .bandW L across and .bandH L tall at .bandsAt of its length (the grip at chest and waist, one under the head).
 */
const LICH_POLE = { thick: 0.022, bands: [0.38, 0.55, 0.9], bandW: 0.034, bandH: 0.025 };
export function lichStaffPole(scene: Scene, staff: Mesh): Mesh[] {
  const C = LICH_POLE, bb = staff.getBoundingInfo().boundingBox, L = bb.maximum.y - bb.minimum.y;
  staff.isVisible = false;
  const mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const poleC = new Color3(0.05, 0.04, 0.05), pole = mf.get("cloth", poleC, { emissive: poleC.scale(0.4), roughness: 1 });
  const ironC = new Color3(0.14, 0.12, 0.13), iron = mf.get("cloth", ironC, { emissive: ironC.scale(0.3), roughness: 1 });
  const out: Mesh[] = [];
  const shaft = MeshBuilder.CreateCylinder("lichStaffPole", { height: L, diameter: L * C.thick, tessellation: 6 }, scene);
  shaft.parent = staff; shaft.position.y = (bb.minimum.y + bb.maximum.y) / 2; shaft.material = pole; out.push(shaft);
  for (const at of C.bands) {
    const band = MeshBuilder.CreateCylinder("lichStaffBand", { height: L * C.bandH, diameter: L * C.bandW, tessellation: 6 }, scene);
    band.parent = staff; band.position.y = bb.minimum.y + L * at; band.material = iron; out.push(band);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 497 the Tempest Lich's lightning-bolt staff foot (card: "the symbol of a lightning bolt on the bottom"; evil.tempest_lich.red.png: a flat
 * team-coloured zig-zag bolt below the shaft's foot, as long as a forearm; audit 489 b.2: "a plain round end").
 * Spec in staff lengths L (+y up the shaft): a flat bolt in the staff's x-y plane hanging from the rod's foot: .segs straight 4-sided strips
 * .stripW L wide and .flat of that thick, joined end to end through the points .path (x, y in L, y down from the foot), narrowing to a point at the
 * tip; team cloth self-lit .3 like the crystal, out of the glow.
 */
const LICH_BOLT = { path: [[0, 0], [0.035, -0.07], [-0.03, -0.1], [0.025, -0.19]] as const, stripW: 0.03, flat: 0.45 };
export function lichStaffFoot(scene: Scene, staff: Mesh, team: Color3): Mesh[] {
  const C = LICH_BOLT, bb = staff.getBoundingInfo().boundingBox, L = bb.maximum.y - bb.minimum.y, y0 = bb.minimum.y;
  const bolt = getMaterialFactory().get("cloth", team, { emissive: team.scale(0.3) });
  const out: Mesh[] = [];
  for (let i = 0; i < C.path.length - 1; i++) {
    const a = new Vector3(C.path[i][0] * L, y0 + C.path[i][1] * L, 0), b = new Vector3(C.path[i + 1][0] * L, y0 + C.path[i + 1][1] * L, 0);
    const run = b.subtract(a), last = i === C.path.length - 2;
    const w0 = L * C.stripW * (1 - i * 0.18), w1 = last ? 0 : L * C.stripW * (1 - (i + 1) * 0.18);
    const m = MeshBuilder.CreateCylinder("lichStaffBolt", { height: run.length() + (last ? 0 : w0 * 0.5), diameterTop: w0, diameterBottom: w1 || 0, tessellation: 4 }, scene);
    m.parent = staff; m.material = bolt; m.scaling.z = C.flat;
    m.position.copyFrom(a.add(b).scale(0.5));
    // +y (the wide top) turned onto b->a: rotation.z t takes +y to (-sin t, cos t)
    m.rotation.z = Math.atan2(run.x, -run.y);
    out.push(m);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 496 the Shadow Walker's vest (evil.shadow_walker.red.png; audit 489 a.3: "a team-blue jacket with a dark spiked plate on the chest - TABS: a dark
 * sleeveless tattered vest with a jagged hem over team skin").
 * Spec in the trunk's box in the torso joint frame (the larger of the torso box and the yoke hull, LESSONS 487: W across, H high, D deep, its
 * bottom y0): the trunk, yoke and upper arms go team skin (the head's material); the pelvis goes the leg cloth; a near-black open 8-sided shell
 * (one-sided, facing out) .wide W x .deep D from .top H up the trunk down to .hem H under its bottom; .teeth flat 3-sided points hang from its hem
 * all round (.toothL H long, varied by .vary), .crown points stand up off its top across the front, so the skin chest shows over a jagged edge;
 * two straps .strap W wide run up the front and over each shoulder, .strapX W out.
 */
const WALKER_VEST = { cloth: new Color3(0.08, 0.06, 0.07), wide: 1.1, deep: 1.25, top: 0.62, hem: 0.22, teeth: 12, toothL: 0.2, vary: 0.4, crown: 5, crownL: 0.16, strap: 0.22, strapX: 0.3 };
export function walkerVest(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = WALKER_VEST, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const dark = mf.get("cloth", C.cloth, { emissive: C.cloth.scale(0.4), roughness: 1 });
  const yoke = body.allMeshes.find((m) => /_yoke$/.test(m.name)), pelvis = body.allMeshes.find((m) => /_pelvis$/.test(m.name));
  const chain: TransformNode[] = [];
  for (let n: TransformNode | null = body.torsoMesh; n; n = n.parent as TransformNode | null) chain.unshift(n);
  for (const n of chain) n.computeWorldMatrix(true);
  yoke?.computeWorldMatrix(true);
  const inv = body.torso.getWorldMatrix().clone().invert();
  const lo = new Vector3(Infinity, Infinity, Infinity), hi = new Vector3(-Infinity, -Infinity, -Infinity);
  for (const m of [body.torsoMesh, yoke]) {
    if (!m) continue;
    for (const v of m.getBoundingInfo().boundingBox.vectorsWorld) { const p = Vector3.TransformCoordinates(v, inv); lo.minimizeInPlace(p); hi.maximizeInPlace(p); }
  }
  const W = hi.x - lo.x, H = hi.y - lo.y, D = hi.z - lo.z, cx = (lo.x + hi.x) / 2, cz = (lo.z + hi.z) / 2;
  // out of the glow: the self-lit skin's halo washed over the near-black vest (look 496, LESSONS 495)
  for (const m of [body.torsoMesh, yoke, body.leftUpperArm, body.rightUpperArm]) if (m) { m.material = body.skinMaterial; glow?.addExcludedMesh(m); }
  if (pelvis) pelvis.material = body.leftUpperLeg.material;
  const out: Mesh[] = [];
  const add = (m: Mesh): Mesh => { m.parent = body.torso; m.material = dark; out.push(m); return m; };
  const yTop = lo.y + H * C.top, yHem = lo.y - H * C.hem, rx = (W * C.wide) / 2, rz = (D * C.deep) / 2;
  const shell = add(MeshBuilder.CreateCylinder("walkerVest", { height: yTop - yHem, diameter: 2, tessellation: 8, cap: Mesh.NO_CAP }, scene));
  shell.scaling.set(rx, 1, rz); shell.position.set(cx, (yTop + yHem) / 2, cz); shell.rotation.y = Math.PI / 8;
  // flat points round the rim: angle a from the front (+z), pointing down (hem) or up (crown)
  const point = (a: number, y: number, long: number, dir: 1 | -1): void => {
    const p = add(MeshBuilder.CreateCylinder("walkerVestTooth", { height: long, diameterBottom: W * 0.2, diameterTop: 0, tessellation: 3 }, scene));
    p.scaling.z = 0.25; p.rotation.set(dir < 0 ? Math.PI : 0, a, 0);
    p.position.set(cx + Math.sin(a) * rx * 0.97, y + dir * long / 2, cz + Math.cos(a) * rz * 0.97);
  };
  for (let i = 0; i < C.teeth; i++) point((i / C.teeth) * Math.PI * 2, yHem + H * 0.02, H * C.toothL * (1 - C.vary * ((i * 5) % 3) / 2), -1);
  for (let i = 0; i < C.crown; i++) point(((i / (C.crown - 1)) - 0.5) * 1.6, yTop - H * 0.02, H * C.crownL * (1 - C.vary * ((i * 7) % 3) / 2), 1);
  for (const side of [-1, 1]) {
    const x = cx + side * W * C.strapX, up = hi.y + H * 0.02 - yTop;
    for (const z of [cz + rz, cz - rz]) {
      const s = add(MeshBuilder.CreateBox("walkerVestStrap", { width: W * C.strap, height: up, depth: D * 0.08 }, scene));
      s.position.set(x, yTop + up / 2, z);
    }
    const over = add(MeshBuilder.CreateBox("walkerVestStrap", { width: W * C.strap, height: D * 0.08, depth: rz * 2 + D * 0.08 }, scene));
    over.position.set(x, hi.y + H * 0.02, cz);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/** The trunk's box in the torso joint frame: the union of the torso box and the yoke hull (LESSONS 487), read in the world and brought back */
function trunkBox(body: ArticulatedBody): { lo: Vector3; hi: Vector3 } {
  const yoke = body.allMeshes.find((m) => /_yoke$/.test(m.name));
  const chain: TransformNode[] = [];
  for (let n: TransformNode | null = body.torsoMesh; n; n = n.parent as TransformNode | null) chain.unshift(n);
  for (const n of chain) n.computeWorldMatrix(true);
  yoke?.computeWorldMatrix(true);
  const inv = body.torso.getWorldMatrix().clone().invert();
  const lo = new Vector3(Infinity, Infinity, Infinity), hi = new Vector3(-Infinity, -Infinity, -Infinity);
  for (const m of [body.torsoMesh, yoke]) {
    if (!m) continue;
    for (const v of m.getBoundingInfo().boundingBox.vectorsWorld) { const p = Vector3.TransformCoordinates(v, inv); lo.minimizeInPlace(p); hi.maximizeInPlace(p); }
  }
  return { lo, hi };
}

/**
 * [S] 496 the Mad Mechanic's shirt and overalls (evil.mad_mechanic.red.png; audit 489 a.3: "a black vest block - TABS: a grey collared shirt under
 * dark overalls, with a bone-white tool emblem on the bib").
 * Spec in the trunk box (trunkBox: W across, H high, D deep, front zf): the trunk and yoke go grey shirt cloth .shirt; a grey shirt collar, an 8-sided
 * ring .collar W across at the trunk's top with two flat points .flap W long folded down over the front; a near-black bib .bibW W wide from .bibTop
 * H down to the trunk's bottom, standing .proud W off the front; two near-black straps .strap W wide from the bib's top corners up and over each
 * shoulder to the back; on the bib a bone-white emblem in flat unlit pieces (out of the glow): a wrench (a bar with an open ring at one end) crossed
 * over a hammer (a handle with a block head), .emblem W across, at .emblemAt H up the trunk.
 */
const MECHANIC_OVERALLS = {
  shirt: new Color3(0.2, 0.2, 0.21), dark: new Color3(0.06, 0.05, 0.05), bone: new Color3(0.85, 0.82, 0.72),
  collar: 0.62, flap: 0.2, bibW: 0.66, bibTop: 0.74, proud: 0.03, strap: 0.13, emblem: 0.42, emblemAt: 0.5,
};
export function mechanicOveralls(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = MECHANIC_OVERALLS, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const shirt = mf.get("cloth", C.shirt, { emissive: C.shirt.scale(0.3), roughness: 1 });
  const dark = mf.get("cloth", C.dark, { emissive: C.dark.scale(0.4), roughness: 1 });
  const bone = mf.get("unlit", C.bone, { emissive: C.bone });
  const yoke = body.allMeshes.find((m) => /_yoke$/.test(m.name));
  for (const m of [body.torsoMesh, yoke]) if (m) { m.material = shirt; glow?.addExcludedMesh(m); }
  const { lo, hi } = trunkBox(body);
  const W = hi.x - lo.x, H = hi.y - lo.y, D = hi.z - lo.z, cx = (lo.x + hi.x) / 2, cz = (lo.z + hi.z) / 2, zf = hi.z;
  const out: Mesh[] = [];
  const add = (m: Mesh, material: typeof shirt): Mesh => { m.parent = body.torso; m.material = material; out.push(m); return m; };
  const collar = add(MeshBuilder.CreateCylinder("mechanicCollar", { height: H * 0.08, diameterBottom: W * C.collar, diameterTop: W * C.collar * 0.86, tessellation: 8 }, scene), shirt);
  collar.scaling.z = Math.min(1.3, (D * 1.05) / (W * C.collar)); collar.position.set(cx, hi.y + H * 0.02, cz);
  for (const side of [-1, 1]) {
    const flap = add(MeshBuilder.CreateCylinder("mechanicCollarFlap", { height: W * C.flap, diameterBottom: W * 0.14, diameterTop: 0, tessellation: 3 }, scene), shirt);
    flap.scaling.z = 0.3; flap.rotation.set(Math.PI, 0, side * 0.5);
    flap.position.set(cx + side * W * 0.1, hi.y - W * C.flap * 0.35, zf + W * C.proud * 0.6);
  }
  const bibH = H * C.bibTop, bibY = lo.y + bibH / 2;
  const bib = add(MeshBuilder.CreateBox("mechanicBib", { width: W * C.bibW, height: bibH, depth: W * 0.04 }, scene), dark);
  bib.position.set(cx, bibY, zf + W * C.proud);
  for (const side of [-1, 1]) {
    const x = cx + side * W * (C.bibW / 2 - C.strap / 2), up = hi.y - (lo.y + bibH);
    const front = add(MeshBuilder.CreateBox("mechanicStrap", { width: W * C.strap, height: up + H * 0.04, depth: W * 0.04 }, scene), dark);
    front.position.set(x, lo.y + bibH + up / 2, zf + W * C.proud);
    const over = add(MeshBuilder.CreateBox("mechanicStrap", { width: W * C.strap, height: W * 0.04, depth: D + W * C.proud * 2 + W * 0.04 }, scene), dark);
    over.position.set(x, hi.y + H * 0.02, cz + W * C.proud / 2);
    const back = add(MeshBuilder.CreateBox("mechanicStrap", { width: W * C.strap, height: H * 0.5, depth: W * 0.04 }, scene), dark);
    back.position.set(x, hi.y - H * 0.25, lo.z - W * 0.02);
  }
  // the emblem: a wrench and a hammer crossed in an X on the bib's face
  const E = W * C.emblem, ez = zf + W * C.proud + W * 0.03, ey = lo.y + H * C.emblemAt;
  const wrench = add(MeshBuilder.CreateBox("mechanicEmblemWrench", { width: E * 0.13, height: E, depth: W * 0.02 }, scene), bone);
  wrench.position.set(cx, ey, ez); wrench.rotation.z = -0.75;
  const ring = add(MeshBuilder.CreateTorus("mechanicEmblemRing", { diameter: E * 0.3, thickness: E * 0.1, tessellation: 8 }, scene), bone);
  ring.rotation.x = Math.PI / 2; ring.position.set(cx - Math.sin(0.75) * E * 0.55, ey + Math.cos(0.75) * E * 0.55, ez);
  const handle = add(MeshBuilder.CreateBox("mechanicEmblemHammer", { width: E * 0.11, height: E, depth: W * 0.02 }, scene), bone);
  handle.position.set(cx, ey, ez + W * 0.005); handle.rotation.z = 0.75;
  const head = add(MeshBuilder.CreateBox("mechanicEmblemHead", { width: E * 0.42, height: E * 0.18, depth: W * 0.025 }, scene), bone);
  head.position.set(cx + Math.sin(0.75) * E * 0.5, ey + Math.cos(0.75) * E * 0.5, ez + W * 0.005); head.rotation.z = 0.75;
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 497 the Mad Mechanic's rolled shirt sleeves (evil.mad_mechanic.red.png: the grey shirt's sleeves run to just past the elbow, rolled up in a
 * thick cuff, the team skin forearm below; audit 489 a.4: "bare team arms").
 * Spec in each upper arm's own box (r its radius, h its length, +y up the bone): the upper arm goes the shirt's grey cloth; a rolled cuff, a
 * 7-sided ring .roll r thick out to .cuffR r, .cuffH h tall, at its foot (.at h under the centre), a shade darker so the fold reads.
 */
const MECHANIC_SLEEVE = { shirt: new Color3(0.2, 0.2, 0.21), fold: new Color3(0.14, 0.14, 0.15), cuffR: 1.55, cuffH: 0.24, at: 0.42 };
export function mechanicSleeves(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = MECHANIC_SLEEVE, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const shirt = mf.get("cloth", C.shirt, { emissive: C.shirt.scale(0.3), roughness: 1 });
  const fold = mf.get("cloth", C.fold, { emissive: C.fold.scale(0.3), roughness: 1 });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    arm.material = shirt; glow?.addExcludedMesh(arm);
    const bb = arm.getBoundingInfo().boundingBox, e = bb.extendSize, r = Math.max(e.x, e.z), h = e.y * 2;
    const cuff = MeshBuilder.CreateCylinder("mechanicSleeveCuff", { height: h * C.cuffH, diameterTop: r * 2 * C.cuffR, diameterBottom: r * 2 * C.cuffR * 1.06, tessellation: 7 }, scene);
    cuff.parent = arm; cuff.position.set(bb.center.x, bb.center.y - h * C.at, bb.center.z); cuff.material = fold;
    cuff.convertToFlatShadedMesh(); glow?.addExcludedMesh(cuff); out.push(cuff);
  }
  return out;
}

/**
 * [S] 497 the Mad Mechanic's Mechanic Tank (card: "a round, cauldronlike fuel source that floats behind a unit. Spikes protrude its surface, while
 * three trails of soul smoke ooze out its mouth"; evil.mad_mechanic.png: a dark spiked ball as wide as his trunk hanging behind his hip and shoulder,
 * glowing pale-cyan smoke curling up and out of it; audit 489 a.5).
 * Spec in trunk-box widths W, heights H, depths D (torso joint frame, +z his front, +x his weapon side):
 *   - a near-black faceted ball .ball W across, its centre .out W to the weapon side of the middle, .up H up the trunk, .back W behind the back;
 *   - .spikes 4-sided dark spikes .spike W long standing out of it all round (golden-angle spread, none pointing into his back);
 *   - a dark mouth ring .mouth W across on its top-outer face, and from it three soul-smoke tubes, unlit pale cyan out of nothing but their emissive,
 *     each .smoke W long, curling up and out with a twist, tapering to a point.
 */
const MECHANIC_TANK = {
  dark: new Color3(0.07, 0.06, 0.06), smokeC: new Color3(0.75, 1.05, 1.15),
  ball: 1.05, out: 0.55, up: 0.42, back: 0.62, spikes: 14, spike: 0.28, mouth: 0.42, smoke: 1.5, tube: 0.1,
};
export function mechanicTank(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = MECHANIC_TANK, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const dark = mf.get("cloth", C.dark, { emissive: C.dark.scale(0.4), roughness: 1 });
  const smoke = mf.get("unlit", C.smokeC, { emissive: C.smokeC });
  const { lo, hi } = trunkBox(body);
  const W = hi.x - lo.x, H = hi.y - lo.y, cx = (lo.x + hi.x) / 2;
  const R = (W * C.ball) / 2, c = new Vector3(cx + W * C.out, lo.y + H * C.up, lo.z - W * C.back + R * 0.4);
  const out: Mesh[] = [];
  const add = (m: Mesh, material: Material): Mesh => { m.parent = body.torso; m.material = material; out.push(m); return m; };
  const ball = add(MeshBuilder.CreateIcoSphere("mechanicTank", { radius: R, subdivisions: 1 }, scene), dark);
  ball.position.copyFrom(c);
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < C.spikes; i++) {
    const y = 1 - (2 * (i + 0.5)) / C.spikes, r = Math.sqrt(1 - y * y), a = i * ga;
    const dir = new Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
    if (dir.z > 0.55) continue; // not into his back
    const len = W * C.spike;
    const s = add(MeshBuilder.CreateCylinder("mechanicTankSpike", { height: len, diameterTop: 0, diameterBottom: W * 0.11, tessellation: 4 }, scene), dark);
    s.position.copyFrom(c.add(dir.scale(R + len * 0.38)));
    s.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, new Quaternion());
  }
  // the mouth on the top, tipped out to the weapon side and back
  const mDir = new Vector3(0.45, 0.85, -0.3).normalize();
  const mouth = add(MeshBuilder.CreateTorus("mechanicTankMouth", { diameter: W * C.mouth, thickness: W * 0.09, tessellation: 10 }, scene), dark);
  mouth.position.copyFrom(c.add(mDir.scale(R * 0.92)));
  mouth.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), mDir, new Quaternion());
  const L = W * C.smoke;
  for (let k = 0; k < 3; k++) {
    const turn = (k / 3) * Math.PI * 2 + 0.4, path: Vector3[] = [];
    const start = c.add(mDir.scale(R * 0.9));
    for (let j = 0; j <= 10; j++) {
      const t = j / 10, sw = turn + t * 2.6;
      path.push(start.add(new Vector3(
        mDir.x * L * t * 0.8 + Math.cos(sw) * W * 0.32 * Math.sin(t * Math.PI * 0.9),
        L * t * 0.85,
        mDir.z * L * t * 0.8 + Math.sin(sw) * W * 0.32 * Math.sin(t * Math.PI * 0.9))));
    }
    const tube = add(MeshBuilder.CreateTube("mechanicTankSmoke", { path, radius: W * C.tube, tessellation: 6, cap: Mesh.CAP_START, radiusFunction: (i: number) => W * C.tube * (1 - (i / 10) * 0.92) }, scene), smoke);
    tube.isPickable = false;
  }
  for (const m of out) { m.convertToFlatShadedMesh(); if (m.material === dark) glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 496 the Void Monarch's bone harness (evil.void_monarch.blue.png; audit 489 a.3: "a single grey antler branch behind one shoulder - TABS: a bone
 * V harness whose spiked wing-arms reach out over both shoulders"). It replaces the evil preset's bone pauldrons (custom.void_monarch keeps them).
 * Spec in trunk-box widths W, heights H, depths D (torso joint frame; read off the render: a 200 px chest, the V's foot on the belt, its arms
 * meeting the shoulder tops 100 px out, the wings running on up and out to 200 px at mouth height):
 *   - the V: two flat bone straps .strap W wide and .strapT W thick from one foot .foot H over the trunk's bottom, standing .proud W off the front,
 *     up to each shoulder top .shoulder W out and .over H above the trunk's top;
 *   - a wing-arm off each shoulder: a 6-sided bone tube .wing W thick tapering to a point, from the strap's top up and out through .mid to the tip
 *     at .tip (x W out, y H over the top, z D back), with .spikes 4-sided bone spikes .spike W long standing up and out along its top.
 */
const MONARCH_HARNESS = {
  strap: 0.13, strapT: 0.05, foot: 0.06, proud: 0.05, shoulder: 0.44, over: 0.04, wing: 0.16,
  mid: [0.74, 0.22, -0.05], tip: [1.05, 0.38, -0.12], spikes: 4, spike: 0.17,
};
export function monarchHarness(scene: Scene, body: ArticulatedBody, bone: Material): Mesh[] {
  const C = MONARCH_HARNESS, tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling;
  const W = tb.extendSize.x * 2 * s.x, H = tb.extendSize.y * 2 * s.y, D = tb.extendSize.z * 2 * s.z;
  const cy = tm.position.y + tb.center.y * s.y, top = cy + H / 2, bottom = cy - H / 2;
  const front = tm.position.z + (tb.center.z + tb.extendSize.z) * s.z;
  const out: Mesh[] = [];
  const add = (m: Mesh): Mesh => { m.parent = body.torso; m.material = bone; out.push(m); return m; };
  const foot = new Vector3(0, bottom + H * C.foot, front + W * C.proud);
  for (const side of [-1, 1]) {
    const sh = new Vector3(side * W * C.shoulder, top + H * C.over, front * 0.55 + W * C.proud);
    const run = sh.subtract(foot);
    const strap = add(MeshBuilder.CreateBox("monarchHarnessStrap", { width: W * C.strap, height: run.length() + W * C.strap * 0.5, depth: W * C.strapT }, scene));
    strap.position.copyFrom(foot.add(sh).scale(0.5));
    strap.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), run.normalize(), new Quaternion());
    const mid = new Vector3(side * W * C.mid[0], top + H * C.mid[1], D * C.mid[2]);
    const tip = new Vector3(side * W * C.tip[0], top + H * C.tip[1], D * C.tip[2]);
    add(MeshBuilder.CreateTube("monarchHarnessWing", {
      path: [sh, mid, tip], tessellation: 6, cap: Mesh.CAP_ALL,
      radiusFunction: (i: number) => (W * C.wing / 2) * (i === 0 ? 1 : i === 1 ? 0.75 : 0.08),
    }, scene));
    for (let k = 0; k < C.spikes; k++) {
      const t = (k + 0.5) / C.spikes, a = t < 0.5 ? Vector3.Lerp(sh, mid, t * 2) : Vector3.Lerp(mid, tip, t * 2 - 1);
      const r = (W * C.wing / 2) * (1 - t * 0.85);
      const dir = new Vector3(side * 0.35, 1, 0).normalize();
      const len = W * C.spike * (1 - t * 0.35);
      const sp = add(MeshBuilder.CreateCylinder("monarchHarnessSpike", { height: len, diameterTop: 0, diameterBottom: len * 0.42, tessellation: 4 }, scene));
      sp.position.copyFrom(a.add(dir.scale(r + len * 0.4)));
      sp.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, new Quaternion());
    }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 497 the Void Monarch's tunic, ribs and belt (evil.void_monarch.red.png: under the harness's V three bone chevrons dip across the dark chest,
 * one under the other, over a dark belt studded with bone; audit 489 a.4: "a plain lilac block with a white fur collar"). Evil preset only.
 * Spec in trunk-box widths W, heights H, depths D (torso joint frame, as the harness): the trunk and yoke go near-black lit cloth (LESSONS 494);
 * .ribs bone chevrons, each two flat bars .barH W tall and .barT W thick from .reach W either side of the middle down to the centre, dipping .dip H,
 * standing .proud W off the front (over the harness straps), their centres at .ribsAt H up the trunk; a dark belt .beltH H tall round the trunk's
 * foot, .beltOut W proud all round, with .studs 5-sided bone studs .stud W across on its front.
 */
const MONARCH_TUNIC = {
  dark: new Color3(0.08, 0.06, 0.07), ribs: 3, ribsAt: [0.62, 0.45, 0.28], reach: 0.46, dip: 0.12, barH: 0.085, barT: 0.05, proud: 0.09,
  beltH: 0.14, beltOut: 0.05, studs: 7, stud: 0.09,
};
export function monarchTunic(scene: Scene, body: ArticulatedBody, bone: Material): Mesh[] {
  const C = MONARCH_TUNIC, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const dark = mf.get("cloth", C.dark, { emissive: C.dark.scale(0.4), roughness: 1 });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling;
  const W = tb.extendSize.x * 2 * s.x, H = tb.extendSize.y * 2 * s.y, D = tb.extendSize.z * 2 * s.z;
  const cy = tm.position.y + tb.center.y * s.y, bottom = cy - H / 2;
  const cz = tm.position.z + tb.center.z * s.z, front = cz + D / 2;
  const yoke = body.allMeshes.find((m) => /_yoke$/.test(m.name));
  for (const m of [tm, yoke]) if (m) { m.material = dark; glow?.addExcludedMesh(m); }
  const out: Mesh[] = [];
  const add = (m: Mesh, material: Material): Mesh => { m.parent = body.torso; m.material = material; out.push(m); return m; };
  for (let r = 0; r < C.ribs; r++) {
    const y = bottom + H * C.ribsAt[r], wide = W * C.reach * (1 - r * 0.1);
    for (const side of [-1, 1]) {
      const a = new Vector3(side * wide, y + (H * C.dip) / 2, front + W * C.proud), b = new Vector3(0, y - (H * C.dip) / 2, front + W * C.proud);
      const run = b.subtract(a);
      const bar = add(MeshBuilder.CreateBox("monarchRib", { width: run.length() + W * C.barH * 0.6, height: W * C.barH, depth: W * C.barT }, scene), bone);
      bar.position.copyFrom(a.add(b).scale(0.5));
      bar.rotation.z = Math.atan2(run.y, run.x);
    }
  }
  const belt = add(MeshBuilder.CreateBox("monarchBelt", { width: W + W * C.beltOut * 2, height: H * C.beltH, depth: D + W * C.beltOut * 2 }, scene), dark);
  belt.position.set(0, bottom + (H * C.beltH) / 2, cz);
  for (let k = 0; k < C.studs; k++) {
    const x = (k / (C.studs - 1) - 0.5) * W * 0.9;
    const stud = add(MeshBuilder.CreateCylinder("monarchStud", { height: W * C.stud * 0.7, diameterBottom: W * C.stud, diameterTop: W * C.stud * 0.3, tessellation: 5 }, scene), bone);
    stud.rotation.x = Math.PI / 2;
    stud.position.set(x, bottom + (H * C.beltH) / 2, front + W * C.beltOut + W * C.stud * 0.3);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}
