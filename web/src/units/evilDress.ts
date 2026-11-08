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
