import { Color3, Mesh, MeshBuilder, Scene, TransformNode } from "@babylonjs/core";
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
 * [S] 491 the Void Cultist's buckler (evil.void_cultist.jpg, .red.png; audit 489 b.2: "a small brown disc - TABS: a large dark round buckler,
 * shoulder-wide, with a raised rim ring and spikes around the rim and face"). It replaces the 1.5-chest disc that was cut in the hand's own
 * (shrunken) frame and read head-sized.
 * Spec in torso widths W, sized in the world, not the hand's frame (the hand's scale is divided out): a near-black 12-sided board .across W
 * across and .thick W thick on the off hand, its face out from the fist; a raised iron rim ring (a torus .rimT W thick) at its edge and a second
 * raised ring .ring of the radius in; .rim iron spikes .spike W long standing out round the edge; .face spikes .faceSpike W long on the inner
 * ring's line, half a step round from the rim's; a boss spike .boss W long out of the middle.
 */
const CULTIST_BUCKLER = { across: 1.3, thick: 0.06, rimT: 0.07, ring: 0.62, rim: 10, spike: 0.2, face: 5, faceSpike: 0.16, boss: 0.26 };
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
