import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import type { Material } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

/*
 * Secret faction cloth, hats and ornaments (loop: new per-unit dress goes here, not into unitFactory or propBuilder).
 */

/** A chain of 6-sided tapered segments through `pts` (in `parent`'s frame), `root` across at the first point to a point at the last. */
function taper(scene: Scene, name: string, pts: Vector3[], root: number, tip: number, parent: TransformNode, material: Material, out: Mesh[]): void {
  const n = pts.length - 1, up = new Vector3(0, 1, 0);
  for (let k = 0; k < n; k++) {
    const a = pts[k], e = pts[k + 1], d = e.subtract(a);
    const r0 = root + (tip - root) * (k / n), r1 = root + (tip - root) * ((k + 1) / n);
    const seg = MeshBuilder.CreateCylinder(name, { height: d.length() * 1.08, diameterBottom: r0, diameterTop: r1, tessellation: 6 }, scene);
    seg.parent = parent; seg.material = material;
    seg.position.copyFrom(a.add(e).scale(0.5));
    seg.rotationQuaternion = Quaternion.FromUnitVectorsToRef(up, d.normalize(), new Quaternion());
    out.push(seg);
  }
}

/** The bead eyes' top, read into the head mesh's frame (LESSONS: the eyes hang off the neck, not the head block). */
function eyeTopInHead(body: ArticulatedBody): number | null {
  const head = body.headMesh, eye = body.leftEye ?? body.rightEye;
  if (!eye) return null;
  for (let n: TransformNode | null = eye; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
  for (let n: TransformNode | null = head; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
  eye.refreshBoundingInfo();
  const inv = Matrix.Invert(head.getWorldMatrix());
  let top = -Infinity;
  for (const v of eye.getBoundingInfo().boundingBox.vectorsWorld) top = Math.max(top, Vector3.TransformCoordinates(v, inv).y);
  return top;
}

/**
 * [S] 500 the Shouter's Nordic helmet (secret.shouter.red.png; audit 500 a.1: "helmet: a bare team head - TABS a dark iron Nordic helmet with
 * curled brown horns and a nose guard"). The render: a dark grey faceted iron bowl over the crown and the sides of the head, its rim just over the
 * bead eyes, a broad nose guard and two cheek plates hanging down the face either side of it to the mouth, the eyes looking out between them; out
 * of each side over the ears a brown ram's horn running out about half a head, curling up and back.
 * Spec in head widths W, heights H, depths D (the head box, its centre c; e the eyes' top in the head frame): an 8-sided iron bowl .bowl W across
 * from .rim H over e up to .top H over the centre, domed over the top (a half sphere .dome H tall); a brow band .band H tall round its foot,
 * .bandOut proud; a nose guard .noseW W wide from the band down .nose H, standing .proud D in front of the face; cheek plates .cheekW W wide,
 * .cheek H long at .cheekX W out, tipped in .cheekTilt rad; per side a horn rooted at the bowl's side .hornY H over e, through HORN_PATH
 * [x W out, y H up, z D back] tapering from .hornRoot W to .hornTip W. Iron dark lit cloth .iron self-lit .12 (LESSONS: metal reads near black);
 * horn brown .horn. All out of the glow.
 */
const SHOUTER_HELM = {
  iron: new Color3(0.2, 0.21, 0.23), horn: new Color3(0.42, 0.22, 0.09), bowl: 1.22, rim: 0.02, top: 0.66, dome: 0.32, band: 0.12, bandOut: 0.04,
  noseW: 0.2, nose: 0.42, proud: 0.56, cheekW: 0.24, cheek: 0.36, cheekX: 0.46, cheekTilt: 0.12, hornY: 0.12, hornRoot: 0.28, hornTip: 0.06,
};
const HORN_PATH: [number, number, number][] = [[0.52, 0, 0], [0.78, 0.04, 0.02], [0.98, 0.2, 0.08], [1.04, 0.42, 0.2], [0.94, 0.56, 0.32], [0.82, 0.5, 0.36]];
export function shouterHelm(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = SHOUTER_HELM, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const iron = mf.get("cloth", C.iron, { emissive: C.iron.scale(0.12), roughness: 1 });
  const horn = mf.get("cloth", C.horn, { emissive: C.horn.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: Material): Mesh => { m.parent = head; m.material = material; out.push(m); return m; };
  const foot = e + H * C.rim, crown = c.y + H * C.top, bowlH = crown - foot;
  const bowl = put(MeshBuilder.CreateCylinder("shouterHelm", { height: bowlH, diameterTop: W * C.bowl * 1.02, diameterBottom: W * C.bowl, tessellation: 8 }, scene), iron);
  bowl.rotation.y = Math.PI / 8; bowl.scaling.z = (D * C.bowl) / (W * C.bowl); bowl.position.set(c.x, foot + bowlH / 2, c.z);
  const dome = put(MeshBuilder.CreateSphere("shouterHelmDome", { diameter: 1, segments: 4, slice: 0.5 }, scene), iron);
  dome.scaling.set(W * C.bowl * 1.02, H * C.dome * 2, D * C.bowl * 1.02); dome.position.set(c.x, crown, c.z);
  const band = put(MeshBuilder.CreateCylinder("shouterHelmBand", { height: H * C.band, diameter: W * (C.bowl + C.bandOut * 2), tessellation: 8 }, scene), iron);
  band.rotation.y = Math.PI / 8; band.scaling.z = D / W; band.position.set(c.x, foot + (H * C.band) / 2, c.z);
  const face = c.z + D * C.proud;
  const nose = put(MeshBuilder.CreateBox("shouterHelmNose", { width: W * C.noseW, height: H * C.nose, depth: D * 0.1 }, scene), iron);
  nose.position.set(c.x, foot + H * 0.04 - (H * C.nose) / 2, face);
  for (const side of [-1, 1]) {
    const cheek = put(MeshBuilder.CreateBox("shouterHelmCheek", { width: W * C.cheekW, height: H * C.cheek, depth: D * 0.08 }, scene), iron);
    cheek.position.set(c.x + side * W * C.cheekX, foot - (H * C.cheek) / 2 - H * 0.12, face - D * 0.03);
    cheek.rotation.z = side * C.cheekTilt;
    const pts = HORN_PATH.map(([x, y, z]) => new Vector3(c.x + side * x * W, e + H * C.hornY + y * H, c.z - z * D));
    taper(scene, "shouterHorn", pts, W * C.hornRoot, W * C.hornTip, head, horn, out);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 501 the Ballooner's Balloon Backpack (card Appearance "a backpack with a mini hot air balloon attached to it"; reference/units/secret.ballooner.png,
 * the icon: a satchel with a cluster of small balloons on strings over it; the red render shows its dark straps at the chest's sides; audit 500 a.1:
 * "one head-sized pink sphere at head height, hiding the head"). The old "balloon" special sphere and its string are hidden.
 * Spec in torso widths TW, heights TH, depths TD (the torso box, torso frame): a brown leather satchel .packW TW wide, .packH TH tall, .packD TD deep,
 * hung on the back .packY TH under the collar, a darker flap .flap of its height over its top and a brass buckle; two straps .strapW TW wide over
 * the shoulders at .strapX TW out, down the chest's front to its foot; from the satchel's top .balloons balloons on BALLOON_SPOTS [x TW, y TH over
 * the collar, z TD behind the back], each a flat-shaded ico ball .ball TW across, a little taller than wide, a dark knot under it, a thin string down
 * to the satchel's top; cream, pale team and team balloons in turn (unlit, out of the glow, so the cream stays cream, LESSONS 442).
 */
const BALLOONER_PACK = {
  packW: 0.62, packH: 0.5, packD: 0.42, packY: 0.12, flap: 0.3, strapW: 0.09, strapX: 0.3, balloons: 5, ball: 0.42, tall: 1.18, string: 0.012,
  leather: new Color3(0.3, 0.16, 0.07), flapC: new Color3(0.2, 0.1, 0.05), brass: new Color3(0.75, 0.55, 0.15), cream: new Color3(0.95, 0.9, 0.78),
};
const BALLOON_SPOTS: [number, number, number][] = [[0, 1.4, 0.7], [-0.36, 1.2, 0.8], [0.36, 1.22, 0.75], [-0.16, 1.0, 1.0], [0.2, 1.02, 0.95]];
export function balloonerPack(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const C = BALLOONER_PACK, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  for (const m of body.torso.getChildMeshes(false)) if (m.name === "balloon" || (m.name === "string" && m.parent?.name === "balloon")) m.setEnabled(false);
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, sc = tm.scaling;
  const TW = tb.extendSize.x * 2 * sc.x, TH = tb.extendSize.y * 2 * sc.y, TD = tb.extendSize.z * 2 * sc.z;
  const top = tm.position.y + (tb.center.y + tb.extendSize.y) * sc.y, cx = tm.position.x + tb.center.x * sc.x, cz = tm.position.z + tb.center.z * sc.z;
  const back = cz - TD / 2;
  const leather = mf.get("cloth", C.leather, { emissive: C.leather.scale(0.12), roughness: 1 });
  const flap = mf.get("cloth", C.flapC, { emissive: C.flapC.scale(0.12), roughness: 1 });
  const brass = mf.get("cloth", C.brass, { emissive: C.brass.scale(0.12) });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: Material, x: number, y: number, z: number): Mesh => { m.parent = body.torso; m.position.set(x, y, z); m.material = material; out.push(m); return m; };
  const packY = top - TH * C.packY - (TH * C.packH) / 2, packZ = back - (TD * C.packD) / 2;
  put(MeshBuilder.CreateBox("balloonerPack", { width: TW * C.packW, height: TH * C.packH, depth: TD * C.packD }, scene), leather, cx, packY, packZ);
  const flapH = TH * C.packH * C.flap;
  put(MeshBuilder.CreateBox("balloonerPackFlap", { width: TW * C.packW * 1.04, height: flapH, depth: TD * C.packD * 1.08 }, scene), flap, cx, packY + TH * C.packH / 2 - flapH / 2 + TH * 0.01, packZ);
  put(MeshBuilder.CreateBox("balloonerPackBuckle", { width: TW * 0.1, height: TW * 0.08, depth: TW * 0.03 }, scene), brass, cx, packY + TH * C.packH / 2 - flapH, packZ - TD * C.packD * 0.55);
  for (const side of [-1, 1]) {
    // a strap over the shoulder: across the top, then down the chest's front to its foot
    put(MeshBuilder.CreateBox("balloonerStrap", { width: TW * C.strapW, height: TW * 0.04, depth: TD * 1.12 }, scene), flap, cx + side * TW * C.strapX, top + TW * 0.015, cz);
    put(MeshBuilder.CreateBox("balloonerStrap", { width: TW * C.strapW, height: TH * 0.85, depth: TW * 0.04 }, scene), flap, cx + side * TW * C.strapX, top - TH * 0.425, cz + TD / 2 + TW * 0.02);
  }
  const packTop = packY + TH * C.packH / 2;
  const tints = [C.cream, team.scale(0.6).add(C.cream.scale(0.4)), team, C.cream, team.scale(0.6).add(C.cream.scale(0.4))];
  for (let i = 0; i < C.balloons; i++) {
    const [x, y, z] = BALLOON_SPOTS[i], col = tints[i % tints.length];
    const skin = mf.get("unlit", col, { emissive: col });
    const R = (TW * C.ball) / 2, bx = cx + x * TW, by = top + y * TH, bz = back - z * TD;
    const ball = put(MeshBuilder.CreateIcoSphere("balloonerBalloon", { radius: R, subdivisions: 1 }, scene), skin, bx, by, bz);
    ball.scaling.y = C.tall;
    put(MeshBuilder.CreateCylinder("balloonerKnot", { height: R * 0.3, diameterTop: R * 0.35, diameterBottom: 0, tessellation: 4 }, scene), skin, bx, by - R * C.tall - R * 0.1, bz);
    // the string from the knot down to the satchel's top
    const from = new Vector3(bx, by - R * C.tall - R * 0.25, bz), to = new Vector3(cx + x * TW * 0.3, packTop, packZ), d = from.subtract(to);
    const s = put(MeshBuilder.CreateCylinder("balloonerString", { height: d.length(), diameter: TW * C.string * 2, tessellation: 3 }, scene), flap, (from.x + to.x) / 2, (from.y + to.y) / 2, (from.z + to.z) / 2);
    s.rotationQuaternion = Quaternion.FromUnitVectorsToRef(new Vector3(0, 1, 0), d.normalize(), new Quaternion());
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 501 the Ball 'n' Chain's stone ball (secret.ball_n_chain.red.png: he hugs a huge faceted grey stone ball, wider than his chest, at chest
 * height in both arms, a thick grey chain of open links hanging from its foot to his knees; audit 500 b.1: "a small dark ball on a stick, held
 * one-handed like a mace"). The flail (handle, chain, ball) in his fist is hidden; the stone rides the torso so it stays at his chest through the
 * walk and the swing, the forearms reaching round its sides.
 * Spec in torso widths TW, heights TH (the torso box, torso frame): a flat-shaded ico boulder .ball TW across, squashed to .squash in y and
 * .deep in z, turned .turn so its facets sit off-axis, its centre .y TH under the collar and .ahead TW in front of the chest; grey stone lit cloth;
 * under it .links chain links, each a 4-sided torus .link TW long x .linkW TW wide (stretched in y), .linkT TW thick, alternating a quarter
 * turn about y, from the ball's foot down .chain TH; dark iron.
 */
const BALL_STONE = {
  ball: 1.3, squash: 0.92, deep: 0.9, turn: 0.5, y: 0.5, ahead: 0.62, links: 6, link: 0.22, linkW: 0.13, linkT: 0.045, chain: 1.05,
  stone: new Color3(0.42, 0.41, 0.4), iron: new Color3(0.26, 0.26, 0.28),
};
export function ballStone(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = BALL_STONE, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  for (const hand of [body.rightHand, body.leftHand]) for (const m of hand.getChildMeshes(false)) if (/^flail/.test(m.name)) m.setEnabled(false);
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, sc = tm.scaling;
  const TW = tb.extendSize.x * 2 * sc.x, TH = tb.extendSize.y * 2 * sc.y, TD = tb.extendSize.z * 2 * sc.z;
  const top = tm.position.y + (tb.center.y + tb.extendSize.y) * sc.y, cx = tm.position.x + tb.center.x * sc.x, cz = tm.position.z + tb.center.z * sc.z;
  const stone = mf.get("cloth", C.stone, { emissive: C.stone.scale(0.12), roughness: 1 });
  const iron = mf.get("cloth", C.iron, { emissive: C.iron.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const R = (TW * C.ball) / 2, by = top - TH * C.y, bz = cz + TD / 2 + TW * C.ahead - R * 0.35;
  const ball = MeshBuilder.CreateIcoSphere("ballStone", { radius: R, subdivisions: 1 }, scene);
  ball.parent = body.torso; ball.position.set(cx, by, bz); ball.material = stone;
  ball.scaling.set(1, C.squash, C.deep); ball.rotation.set(C.turn * 0.4, C.turn, C.turn * 0.2);
  out.push(ball);
  // the chain from the ball's foot straight down
  const linkL = TW * C.link, step = (TH * C.chain) / C.links;
  for (let i = 0; i < C.links; i++) {
    const link = MeshBuilder.CreateTorus("ballChainLink", { diameter: TW * C.linkW, thickness: TW * C.linkT, tessellation: 6 }, scene);
    link.parent = body.torso; link.material = iron;
    link.rotation.set(Math.PI / 2, i % 2 ? Math.PI / 2 : 0, 0);
    link.scaling.set(1, 1, linkL / (TW * C.linkW));
    link.position.set(cx, by - R * C.squash * 0.88 - step * (i + 0.5), bz - R * 0.1);
    out.push(link);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}

/**
 * [S] 502 the Teacher's long renaissance hair (secret.the_teacher.red.png; audit 500 a.1: "a bald head - TABS long brown renaissance hair to the
 * shoulders"). The render: a dark greyish-brown cap over the crown and the back of the head, its front edge high on the brow over the bead eyes;
 * either side a bushy mass of curls standing out past the head from the temple down to the jaw, and behind a thick fall to the nape.
 * Spec in head widths W, heights H, depths D (the head box, its centre c; e the eyes' top in the head frame): a cap box .capW W x from .capLo H
 * over e to .capTop H over the centre x .capD D, set .capBack D back; per side .puffs flat-shaded ico lumps .puff W across, .out W from the
 * centre, from .puffHi H over the centre down to .puffLo H, stepping .stepZ D back as they go down; a back fall of .back lumps .backW W across
 * .rear D behind the centre from the crown to .backLo H. Brown lit cloth (palette brown x .25), self-lit .12, out of the glow.
 */
const TEACHER_HAIR = {
  brown: new Color3(0.16, 0.085, 0.06), capW: 1.12, capLo: 0.06, capTop: 0.6, capD: 1.08, capBack: 0.06,
  puffs: 3, puff: 0.42, out: 0.6, puffHi: 0.3, puffLo: -0.42, stepZ: 0.1, back: 3, backW: 0.6, rear: 0.5, backLo: -0.5,
};
export function teacherHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = TEACHER_HAIR, glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const hair = getMaterialFactory().get("cloth", C.brown, { emissive: C.brown.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, y: number, z: number): Mesh => { m.parent = head; m.position.set(x, y, z); m.material = hair; out.push(m); return m; };
  const lo = e + H * C.capLo, hi = c.y + H * C.capTop;
  put(MeshBuilder.CreateBox("teacherHairCap", { width: W * C.capW, height: hi - lo, depth: D * C.capD }, scene), c.x, (lo + hi) / 2, c.z - D * C.capBack);
  for (const side of [-1, 1]) for (let k = 0; k < C.puffs; k++) {
    const t = k / (C.puffs - 1), y = c.y + H * (C.puffHi + (C.puffLo - C.puffHi) * t);
    const p = put(MeshBuilder.CreateIcoSphere("teacherHairPuff", { radius: (W * C.puff) / 2, subdivisions: 1 }, scene), c.x + side * W * (C.out + 0.05 * Math.sin(k * 2.1)), y, c.z - D * (0.05 + C.stepZ * k));
    p.scaling.set(0.8, 1, 1.15); p.rotation.set(k * 0.7, k * 1.3, side * 0.4);
  }
  for (let k = 0; k < C.back; k++) {
    const t = k / (C.back - 1), y = hi - (hi - (c.y + H * C.backLo)) * t;
    const p = put(MeshBuilder.CreateIcoSphere("teacherHairBack", { radius: (W * C.backW) / 2, subdivisions: 1 }, scene), c.x + (k - 1) * W * 0.12, y, c.z - D * C.rear);
    p.scaling.set(1.5, 1, 0.8); p.rotation.y = k * 0.9;
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}
