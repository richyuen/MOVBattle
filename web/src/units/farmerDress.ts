import { Scene, Color3, Mesh, MeshBuilder, Node, TransformNode, Vector3 } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

/*
 * Farmer dress (units/farmer.*): cloth, hair and ornaments built per unit id by unitFactory, sized off the body's own metrics and joints. Pieces worn on
 * the trunk are parented to the torso joint (+z his front, +y up).
 */

/** The head's box in the torso joint's frame: its lowest point, its middle's height and depth, its width and height. */
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
 * [S] the harvester's braids down the chest (376; farmer.harvester.red.png, .png, card Appearance "two long braids tied with team-colored bands": from
 * under the hat beside each cheek two thick brown plaits hang down the front of the shoulders onto the upper chest, ending about a third of the way from
 * the collar to the rope belt in a team band and a short tuft; the 340-347 braids hung off the head and ended at the side of the neck). Hung from the
 * torso, not the head, so they lie on the chest whatever the neck does. In the head's own size (head heights H, head widths W), torso frame:
 *   root CHEST_BRAID.apart W out from the middle, .rootUp H above the chin (beside the cheek, under the brim), .rootAhead W ahead of the head's middle;
 *   foot .footOut W out, .footDrop H below the chin, laid .standOff W ahead of the chest's front; the path bows forward .bow W over the shoulder line;
 *   .plaits lobes .thick W across on a hair core .core of that, overlapping .overlap of a step, tipped alternately (one rope plait, not beads);
 *   a team band .band H tall, .bandWide of the braid round, at the foot, a tuft .tuft H long below it. Hair self-lit .glow.
 */
const CHEST_BRAID = {
  apart: 0.44, rootUp: 0.45, rootAhead: 0.12, footOut: 0.5, footDrop: 1.05, standOff: 0.14, bow: 0.18,
  plaits: 7, thick: 0.3, core: 0.62, overlap: 1.5, band: 0.16, bandWide: 1.15, tuft: 0.18, glow: 0.2,
};
const BRAID_HAIR = new Color3(0.36, 0.2, 0.11);

/** The harvester's two braids from beside the cheeks down onto the upper chest, a team band and tuft at each end (spec at CHEST_BRAID). */
export function harvesterBraids(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const B = CHEST_BRAID;
  const mf = getMaterialFactory();
  const hair = mf.get("cloth", BRAID_HAIR, { emissiveIntensity: B.glow });
  const band = mf.get("cloth", teamColor, { emissiveIntensity: 0.06 });
  const head = headInTorso(body);
  const H = head.tall, W = head.wide;
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const front = chest.position.z + ext.z * chest.scaling.z;
  const thick = B.thick * W;
  const added: Mesh[] = [];
  const put = (m: Mesh, mat: typeof hair): Mesh => {
    m.material = mat;
    m.parent = body.torso;
    added.push(m);
    return m;
  };
  for (const side of [-1, 1]) {
    const root = new Vector3(side * B.apart * W, head.chin + B.rootUp * H, head.midZ + B.rootAhead * W);
    const foot = new Vector3(side * B.footOut * W, head.chin - B.footDrop * H, front + B.standOff * W + thick * 0.5);
    // a quadratic from the root to the foot, bowed forward over the shoulder line so it lies on the collar and chest, not through them
    const mid = Vector3.Lerp(root, foot, 0.5);
    mid.z = Math.max(mid.z, foot.z) + B.bow * W;
    const along = (t: number): Vector3 => root.scale((1 - t) ** 2).add(mid.scale(2 * t * (1 - t))).add(foot.scale(t * t));
    const tangent = (t: number): Vector3 => mid.subtract(root).scale(2 * (1 - t)).add(foot.subtract(mid).scale(2 * t)).normalize();
    // a piece's +y turned onto the braid's line, its top end up and back toward the root
    const lean = (t: number): number => Math.atan2(-tangent(t).z, -tangent(t).y);
    const path: Vector3[] = [];
    for (let k = 0; k <= 10; k++) path.push(along(k / 10));
    put(MeshBuilder.CreateTube("chestBraidCore", { path, radius: thick * 0.5 * B.core, tessellation: 6 }, scene), hair);
    const step = 1 / B.plaits;
    const len = Vector3.Distance(root, foot) * 1.05;
    for (let k = 0; k < B.plaits; k++) {
      const t = (k + 0.5) * step * 0.92;
      const lobe = put(MeshBuilder.CreateIcoSphere("chestBraid", { radiusX: thick * 0.5, radiusY: len * step * 0.5 * B.overlap, radiusZ: thick * 0.42, subdivisions: 1, flat: true }, scene), hair);
      lobe.position.copyFrom(along(t));
      lobe.position.x += (k % 2 ? 1 : -1) * thick * 0.08;
      lobe.rotation.set(lean(t), 0, (k % 2 ? 1 : -1) * 0.35);
    }
    const tie = put(MeshBuilder.CreateCylinder("chestBraidBand", { height: B.band * H, diameter: thick * B.bandWide, tessellation: 7 }, scene), band);
    tie.position.copyFrom(foot);
    tie.rotation.x = lean(1);
    const tuft = put(MeshBuilder.CreateCylinder("chestBraidTuft", { height: B.tuft * H, diameterTop: thick * 0.7, diameterBottom: thick * 0.25, tessellation: 5 }, scene), hair);
    tuft.convertToFlatShadedMesh();
    tuft.position.copyFrom(foot.add(tangent(1).scale((B.band + B.tuft) * H * 0.5)));
    tuft.rotation.x = lean(1);
  }
  return added;
}

/** The trunk mesh's box in the torso joint's frame: width W, height H, depth D, top and foot heights, and its middle's depth. */
function chestBox(body: ArticulatedBody): { W: number; H: number; D: number; top: number; foot: number; z: number } {
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const H = ext.y * 2 * chest.scaling.y;
  return { W: ext.x * 2 * chest.scaling.x, H, D: ext.z * 2 * chest.scaling.z, top: chest.position.y + H * 0.5, foot: chest.position.y - H * 0.5, z: chest.position.z };
}

/*
 * [S] the halfling's long open jacket (376; farmer.halfling.red.png, card Appearance "a team-colored jacket, a light team-colored vest and a white shirt
 * underneath ... buckled with a buckle belt": a loose team coat hangs open from the shoulders to well past the belt, its two fronts falling straight either
 * side of the chest with turned-back lapels at the top, a lighter team vest filling the gap between them, a white shirt in a deep V with a turned collar
 * at the neck, and across the vest at the waist a dark belt with a big grey square buckle; the 341 jacket was one box round the trunk with a white front).
 * Shares of the trunk box (W across, H tall, D deep):
 *   coat from .neck of H under the trunk's top down to .drop of H below its foot: back panel and two side walls .wall of D thick standing .out of W
 *   (sides) and D (back) off the trunk; two fronts .front of W across, .wall thick, .ahead of D in front of the trunk's face, their inner edges .gap of
 *   W either side of the middle, each swung .flare rad out at the hem; lapels: a darker turned-back wedge on each front's top .lapel of H long, .lapelWide
 *   of W across at the shoulder narrowing to a point; vest .vest of W across from the neck to the waist, its face .vestAhead of D in front; shirt V .vee of
 *   W across at the neck, .veeDeep of H deep; collar points .collar of W; belt .belt of H tall across the vest at the waist, buckle .buckle of W across
 *   and .buckleTall of the belt tall with a dark middle. Coat team x .coat, lapels x .lapelShade, vest .vestLight toward white.
 */
const HALFLING_COAT = {
  neck: 0.02, drop: 0.1, wall: 0.08, out: 0.06, front: 0.3, ahead: 0.08, gap: 0.22, flare: 0.08, lapel: 0.4, lapelWide: 0.2,
  vest: 0.46, vestAhead: 0.03, vee: 0.4, veeDeep: 0.46, collar: 0.16, coat: 0.85, lapelShade: 0.55, vestLight: 0.45,
};
/*
 * [S] the jacket fitted on the shoulders with sleeves (380; farmer.halfling.red.png, .blue.png: the team jacket sits on his shoulders, sleeves down to
 * the wrist, open to just past the belt over dark knee shorts; critic 379: a rigid open-topped box off the trunk, its rim showing at the neck, bare arms
 * outside it, the hem near the knee). Replaces HALFLING_COAT's back panel and side walls: one shell round the back and sides, .arc of a full turn,
 * .sides facets, as wide as the walls stood at the shoulders and .flare of that at the hem; a yoke .yoke of H tall over the shoulders closing its
 * top; on each arm a sleeve tube .puff of the arm's girth, the forearm's to .cuffAt of its length, flaring .cuff at the cuff. Hem HALFLING_COAT.drop
 * .32 -> .1 of H below the trunk's foot.
 */
const HALFLING_SLEEVED = { arc: 0.72, sides: 10, flare: 1.12, yoke: 0.14, puff: 1.45, cuffAt: 0.86, cuff: 1.2 };
/*
 * [S] the belt reads (381; farmer.halfling.red.png, .blue.png: a dark team belt across the vest a little above the jacket's hem, a big grey square-frame
 * buckle in its middle; critic 379/380: no belt or buckle in _idle). The 376 belt sat at the trunk's foot, half inside the shorts' seat, in dark brown
 * that read navy on a blue man, and its buckle was "metal", which renders black with no environment map. Now: a band .tall of H, its foot .up of H above
 * the trunk's foot, .wide of W across, .deep of D thick standing off the vest, in team x .dark; the buckle a frame .buckle of W across and .buckleTall of
 * the belt tall, bars .bar of its width, standing .buckleDeep of D proud, in light grey cloth (not metal) lit .buckleGlow, with a pin through it.
 */
const HALFLING_BELT = { tall: 0.13, up: 0.08, wide: 0.98, deep: 0.1, dark: 0.32, glow: 0.12, buckle: 0.3, buckleTall: 1.45, bar: 0.22, buckleDeep: 0.08, buckleGlow: 0.3 };
const HALFLING_SHIRT_WHITE = new Color3(0.93, 0.89, 0.8);
const HALFLING_BUCKLE_GREY = new Color3(0.62, 0.62, 0.64);

/** The halfling's open jacket, vest, white shirt V and buckled belt (spec at HALFLING_COAT), parented to the torso. */
export function halflingJacket(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const J = HALFLING_COAT;
  const mf = getMaterialFactory();
  const coat = mf.get("cloth", teamColor.scale(J.coat), { emissiveIntensity: 0.1 });
  const lapelCloth = mf.get("cloth", teamColor.scale(J.coat * J.lapelShade), { emissiveIntensity: 0.1 });
  const vestCloth = mf.get("cloth", Color3.Lerp(teamColor, new Color3(1, 1, 1), J.vestLight), { emissiveIntensity: 0.14 });
  const shirt = mf.get("cloth", HALFLING_SHIRT_WHITE, { emissiveIntensity: 0.25 });
  const { W, H, D, top, foot, z } = chestBox(body);
  const added: Mesh[] = [];
  const put = (m: Mesh, mat: typeof coat): Mesh => {
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.parent = body.torso;
    added.push(m);
    return m;
  };
  const coatTop = top - H * J.neck, hem = foot - H * J.drop, tall = coatTop - hem, mid = (coatTop + hem) / 2;
  const wall = D * J.wall;
  // [S] back and sides hung from the shoulders (380, spec at HALFLING_SLEEVED): a shell round the back and sides, open at the front, narrow at the
  // shoulders and loose at the hem, a yoke over the shoulders closing its top, and a sleeve down each arm to the wrist
  const K = HALFLING_SLEEVED;
  const shell = put(MeshBuilder.CreateCylinder("halflingCoatShell", {
    height: tall, diameterTop: 1, diameterBottom: K.flare, tessellation: K.sides, arc: K.arc, enclose: false, sideOrientation: Mesh.DOUBLESIDE,
  }, scene), coat);
  // the arc's gap turned to the front (+z): Babylon lays the arc from +x round through -z, its gap centred at pi (1 - arc) past +x
  shell.rotation.y = Math.PI / 2 - Math.PI * K.arc;
  shell.scaling.set(W * (1 + 2 * J.out), 1, D * (1 + J.out + J.ahead));
  shell.position.set(0, mid, z);
  const yoke = put(MeshBuilder.CreateCylinder("halflingCoatYoke", { height: H * K.yoke, diameterTop: 0.7, diameterBottom: 1, tessellation: K.sides }, scene), coat);
  yoke.scaling.set(W * (1 + 2 * J.out) * 1.04, 1, D * (1 + J.out + J.ahead) * 1.04);
  yoke.position.set(0, coatTop - H * K.yoke * 0.5 + H * 0.02, z);
  for (const [shoulder, upper, elbow, lower, hand] of [
    [body.leftShoulder, body.leftUpperArm, body.leftElbow, body.leftLowerArm, body.leftHand],
    [body.rightShoulder, body.rightUpperArm, body.rightElbow, body.rightLowerArm, body.rightHand],
  ] as [TransformNode, Mesh, TransformNode, Mesh, TransformNode][]) {
    const armR = (m: Mesh) => { const e = m.getBoundingInfo().boundingBox.extendSize; return Math.max(e.x * m.scaling.x, e.z * m.scaling.z); };
    const upLong = elbow.position.length(), lowLong = hand.position.length() * K.cuffAt;
    const up = MeshBuilder.CreateCylinder("halflingSleeve", { height: upLong * 1.08, diameterTop: armR(upper) * 2 * K.puff, diameterBottom: armR(upper) * 2 * K.puff * 0.95, tessellation: 7 }, scene);
    put(up, coat).parent = shoulder;
    up.position.set(0, -upLong * 0.5 + upLong * 0.04, 0);
    const low = MeshBuilder.CreateCylinder("halflingSleeve", { height: lowLong, diameterTop: armR(lower) * 2 * K.puff, diameterBottom: armR(lower) * 2 * K.puff * K.cuff, tessellation: 7 }, scene);
    put(low, coat).parent = elbow;
    low.position.set(0, -lowLong * 0.5, 0);
  }
  // the two fronts, open down the middle, each hanging from its shoulder and swung a little out at the hem
  const face = z + D * (0.5 + J.ahead);
  const frontWide = W * J.front;
  for (const side of [-1, 1]) {
    const pivot = new TransformNode("halflingCoatHinge", scene);
    pivot.parent = body.torso;
    pivot.position.set(side * (W * J.gap + frontWide * 0.5), coatTop, face + wall * 0.5);
    pivot.rotation.z = side * J.flare;
    const front = put(MeshBuilder.CreateBox("halflingCoatFront", { width: frontWide, height: tall, depth: wall }, scene), coat);
    front.parent = pivot;
    front.position.set(0, -tall * 0.5, 0);
    // the lapel: a darker wedge turned back over the front's top, broad at the shoulder, to a point down the chest
    const lapel = put(MeshBuilder.CreateCylinder("halflingLapel", { height: H * J.lapel, diameterTop: W * J.lapelWide, diameterBottom: 0, tessellation: 3 }, scene), lapelCloth);
    lapel.parent = pivot;
    lapel.scaling.z = 0.25;
    lapel.position.set(-side * frontWide * 0.22, -H * J.lapel * 0.5, wall * 0.7);
  }
  // the light vest between the fronts, from the neck to the waist
  const vestFace = z + D * (0.5 + J.vestAhead);
  const vestTall = coatTop - foot;
  const vest = put(MeshBuilder.CreateBox("halflingVest", { width: W * J.vest * 2 + frontWide * 0.2, height: vestTall, depth: D * 0.06 }, scene), vestCloth);
  vest.position.set(0, coatTop - vestTall * 0.5, vestFace - D * 0.03);
  // the white shirt in a deep V at the vest's neck, and its two collar points turned out over the vest
  const vee = put(MeshBuilder.CreateDisc("halflingShirtVee", { radius: 1, tessellation: 3, sideOrientation: Mesh.DOUBLESIDE }, scene), shirt);
  vee.rotation.z = -Math.PI / 2;
  vee.scaling.set(H * J.veeDeep / 1.5, W * J.vee / Math.sqrt(3), 1);
  vee.position.set(0, coatTop - H * J.veeDeep / 3, vestFace + D * 0.012);
  for (const side of [-1, 1]) {
    const point = put(MeshBuilder.CreateDisc("halflingCollar", { radius: 1, tessellation: 3, sideOrientation: Mesh.DOUBLESIDE }, scene), shirt);
    point.rotation.z = -Math.PI / 2 + side * 0.55;
    point.scaling.set(W * J.collar * 0.8, W * J.collar * 0.6, 1);
    point.position.set(side * W * J.vee * 0.42, coatTop - H * 0.05, vestFace + D * 0.024);
  }
  // [S] the belt and buckle (381, spec at HALFLING_BELT): a dark team band across the vest above the shorts, a light grey square frame buckle on it
  const B = HALFLING_BELT;
  const beltTall = H * B.tall;
  const beltY = foot + H * B.up + beltTall * 0.5;
  const beltCloth = mf.get("cloth", teamColor.scale(B.dark), { emissiveIntensity: B.glow });
  const belt = put(MeshBuilder.CreateBox("halflingBelt", { width: W * B.wide, height: beltTall, depth: D * B.deep }, scene), beltCloth);
  belt.position.set(0, beltY, vestFace + D * (B.deep * 0.5 - 0.03));
  const beltFront = belt.position.z + D * B.deep * 0.5;
  const grey = mf.get("cloth", HALFLING_BUCKLE_GREY, { emissiveIntensity: B.buckleGlow });
  const bw = W * B.buckle, bh = beltTall * B.buckleTall, bar = bw * B.bar;
  for (const [w, h, x, y] of [[bw, bar, 0, (bh - bar) / 2], [bw, bar, 0, -(bh - bar) / 2], [bar, bh, (bw - bar) / 2, 0], [bar, bh, -(bw - bar) / 2, 0]]) {
    const piece = put(MeshBuilder.CreateBox("halflingBuckle", { width: w, height: h, depth: D * B.buckleDeep }, scene), grey);
    piece.position.set(x, beltY + y, beltFront + D * B.buckleDeep * 0.5);
  }
  // the tongue through the frame, a grey pin across its middle
  const pin = put(MeshBuilder.CreateBox("halflingBucklePin", { width: bar * 0.8, height: bh - bar * 2, depth: D * B.buckleDeep * 0.6 }, scene), grey);
  pin.position.set(-bw * 0.12, beltY, beltFront + D * B.buckleDeep * 0.3);
  return added;
}

/*
 * [S] the potionseller's fitted jerkin (376; farmer.potion_seller.red.png, card Appearance "a dark team-colored jerkin with a light team-colored bottom
 * tighten with four rope. Each side has a copper button above the chest of the vest. They also wear a brown undershirt": a slim dark team jerkin fitted
 * to a lean trunk, no wider than his shoulders and narrowing to the waist, a deep laced V down its front showing the brown undershirt, a copper button at
 * each top corner, a band at its foot, and under it a light team skirt band over the hips; the 344 jerkin was a box 1.12 of the trunk round it, a broad
 * square block wider than the shoulders). The trunk mesh is hidden; the jerkin is his trunk. Shares of the trunk box (W, H, D):
 *   jerkin an eight-sided lathe, flats to the front and sides, .top of W across the flats at the shoulders and .waist at its foot, .deep of D front to
 *   back, from the trunk's top down to .foot of H above its foot; band at its foot .band of H tall, .bandOut round, team x .bandShade; skirt below
 *   .skirt of H tall flaring from .waist to .hips, team .light toward white, a brown hem .hem of H under it; V .vee of W across at the neck, .veeDeep of H
 *   deep; .laces crossings of tan cord; buttons .button of W across. Jerkin team x .dark, self-lit .glow.
 */
const POTION_FIT = {
  top: 1.0, waist: 0.84, deep: 1.04, foot: 0.02, band: 0.1, bandOut: 1.04, bandShade: 0.75, skirt: 0.2, hips: 0.94, light: 0.55, hem: 0.05,
  vee: 0.4, veeDeep: 0.6, laces: 3, button: 0.13, dark: 0.42, glow: 0.16,
};
const POTION_BROWN = new Color3(0.5, 0.26, 0.17);
const POTION_CORD = new Color3(0.88, 0.58, 0.34);
const POTION_BUTTON = new Color3(0.86, 0.5, 0.26);

/** The potionseller's fitted jerkin, laced V, copper buttons and light skirt band, in place of the trunk mesh (spec at POTION_FIT). */
export function potionJerkin(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const P = POTION_FIT;
  const mf = getMaterialFactory();
  const { W, H, D, top, foot, z } = chestBox(body);
  body.torsoMesh.isVisible = false;
  const added: Mesh[] = [];
  const put = (m: Mesh, mat: ReturnType<typeof mf.getCloth>): Mesh => {
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.parent = body.torso;
    added.push(m);
    return m;
  };
  const flat = Math.cos(Math.PI / 8); // an octagon's flat-to-flat over corner-to-corner
  const zs = (D * P.deep) / W; // depth over width
  // an eight-sided band of the trunk, flats front and sides: `a`/`b` the flat-to-flat widths at its top and foot
  const lathe = (name: string, tall: number, a: number, b: number, y: number, mat: ReturnType<typeof mf.getCloth>): Mesh => {
    const m = MeshBuilder.CreateCylinder(name, { height: tall, diameterTop: a / flat, diameterBottom: b / flat, tessellation: 8 }, scene);
    // the eighth-turn baked in before the depth squash (scaling acts before rotation), and before any parenting
    m.rotation.y = Math.PI / 8;
    m.bakeCurrentTransformIntoVertices();
    m.scaling.z = zs;
    m.position.set(0, y, z);
    return put(m, mat);
  };
  const jerkinCloth = mf.get("cloth", teamColor.scale(P.dark), { emissiveIntensity: P.glow });
  const jTop = top, jFoot = foot + H * P.foot, jTall = jTop - jFoot;
  lathe("potionJerkin", jTall, W * P.top, W * P.waist, (jTop + jFoot) / 2, jerkinCloth);
  lathe("potionJerkinBand", H * P.band, W * P.waist * P.bandOut * 1.02, W * P.waist * P.bandOut, jFoot + H * P.band * 0.5, mf.get("cloth", teamColor.scale(P.dark * P.bandShade), { emissiveIntensity: P.glow }));
  const skirtTall = H * P.skirt;
  lathe("potionSkirt", skirtTall, W * P.waist * 0.98, W * P.hips, jFoot - skirtTall * 0.5, mf.get("cloth", Color3.Lerp(teamColor, new Color3(1, 1, 1), P.light), { emissiveIntensity: 0.14 }));
  lathe("potionHem", H * P.hem, W * P.hips * 0.99, W * P.hips * 1.01, jFoot - skirtTall - H * P.hem * 0.5, mf.get("cloth", POTION_BROWN, { emissiveIntensity: 0.18 }));
  // the front face's depth at height y (the jerkin narrows from the shoulders to the waist)
  const faceAt = (y: number): number => z + ((W * (P.waist + (P.top - P.waist) * (y - jFoot) / jTall)) / 2) * zs + D * 0.012;
  // the brown undershirt in the parted V: a downward triangle, flat edge along the neckline
  const neck = jTop - H * 0.04;
  const veeMid = neck - H * P.veeDeep / 3;
  const vee = put(MeshBuilder.CreateDisc("potionUndershirt", { radius: 1, tessellation: 3, sideOrientation: Mesh.DOUBLESIDE }, scene), mf.get("cloth", POTION_BROWN, { emissiveIntensity: 0.2 }));
  vee.rotation.z = -Math.PI / 2;
  vee.scaling.set(H * P.veeDeep / 1.5, W * P.vee / Math.sqrt(3), 1);
  vee.position.set(0, veeMid, faceAt(veeMid));
  // crossed tan cord laced over the V, narrowing with it
  const cord = mf.get("cloth", POTION_CORD, { emissiveIntensity: 0.25 });
  for (let i = 0; i < P.laces; i++) {
    const t = (i + 0.6) / (P.laces + 0.6);
    const across = W * P.vee * (1 - t) * 0.9;
    const y = neck - H * P.veeDeep * t;
    for (const lean of [-1, 1]) {
      const lace = put(MeshBuilder.CreateBox("potionLace", { width: Math.hypot(across, H * 0.08), height: H * 0.022, depth: D * 0.02 }, scene), cord);
      lace.rotation.z = lean * Math.atan2(H * 0.08, across);
      lace.position.set(0, y, faceAt(y) + D * 0.012);
    }
  }
  // a round copper button at each top corner of the V
  const copper = mf.get("metal", POTION_BUTTON, { emissiveIntensity: 0.3 });
  for (const side of [-1, 1]) {
    const button = put(MeshBuilder.CreateCylinder("potionButton", { height: D * 0.06, diameter: W * P.button, tessellation: 8 }, scene), copper);
    button.rotation.x = Math.PI / 2;
    button.position.set(side * W * P.vee * 0.5, neck - H * 0.05, faceAt(neck - H * 0.05) + D * 0.02);
  }
  return added;
}

/*
 * [S] the potionseller's round head (377; farmer.potion_seller.red.png, card Appearance "an unusually round head with umber brown hair"): his block
 * head's vertices are laid on the ellipsoid of its own extents, so it keeps its size but reads as a faceted ball, not a box; the hair is a close cap
 * following that curve: the top POTION_HEAD.slice of a shell POTION_HEAD.shell times the head, its axis tipped POTION_HEAD.tip back so its rim runs
 * over the brow in front and down to the nape behind. Umber POTION_HAIR, self-lit POTION_HEAD.glow.
 */
const POTION_HEAD = { shell: 1.08, slice: 0.56, tip: 0.42, lift: 0.04, back: 0.04, glow: 0.2 };
const POTION_HAIR = new Color3(0.36, 0.25, 0.17);

/** Rounds the potionseller's head and caps it with his umber hair (spec at POTION_HEAD). */
export function potionHead(scene: Scene, body: ArticulatedBody): Mesh[] {
  const head = body.headMesh;
  const at = head.getVerticesData("position");
  if (!at) return [];
  let hx = 0, hy = 0, hz = 0;
  for (let v = 0; v < at.length; v += 3) {
    hx = Math.max(hx, Math.abs(at[v]));
    hy = Math.max(hy, Math.abs(at[v + 1]));
    hz = Math.max(hz, Math.abs(at[v + 2]));
  }
  for (let v = 0; v < at.length; v += 3) {
    const x = at[v] / hx, y = at[v + 1] / hy, z = at[v + 2] / hz;
    const r = Math.hypot(x, y, z) || 1;
    at[v] = (x / r) * hx;
    at[v + 1] = (y / r) * hy;
    at[v + 2] = (z / r) * hz;
  }
  head.setVerticesData("position", at);
  head.convertToFlatShadedMesh();
  head.refreshBoundingInfo();
  const H = POTION_HEAD;
  const hair = getMaterialFactory().get("cloth", POTION_HAIR, { emissiveIntensity: H.glow });
  hair.backFaceCulling = false;
  const cap = MeshBuilder.CreateSphere(`${head.name}_hair`, {
    diameterX: 2 * hx * H.shell, diameterY: 2 * hy * H.shell, diameterZ: 2 * hz * H.shell, segments: 6, slice: H.slice, sideOrientation: Mesh.DOUBLESIDE,
  }, scene);
  cap.convertToFlatShadedMesh();
  cap.rotation.x = -H.tip;
  cap.position.set(0, hy * H.lift, -hz * H.back);
  cap.material = hair;
  cap.parent = head;
  return [cap];
}
