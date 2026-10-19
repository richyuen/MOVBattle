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
  neck: 0.02, drop: 0.32, wall: 0.08, out: 0.06, front: 0.3, ahead: 0.08, gap: 0.22, flare: 0.08, lapel: 0.4, lapelWide: 0.2,
  vest: 0.46, vestAhead: 0.03, vee: 0.4, veeDeep: 0.46, collar: 0.16, belt: 0.12, buckle: 0.24, buckleTall: 1.6, coat: 0.85, lapelShade: 0.55, vestLight: 0.45,
};
const HALFLING_SHIRT_WHITE = new Color3(0.93, 0.89, 0.8);
const HALFLING_BELT_DARK = new Color3(0.22, 0.12, 0.09);
const HALFLING_BUCKLE_GREY = new Color3(0.6, 0.6, 0.62);

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
  // back and sides: the coat hangs loose off the trunk
  const back = put(MeshBuilder.CreateBox("halflingCoatBack", { width: W * (1 + 2 * J.out) + wall * 2, height: tall, depth: wall }, scene), coat);
  back.position.set(0, mid, z - D * (0.5 + J.out) - wall * 0.5);
  for (const side of [-1, 1]) {
    const sideWall = put(MeshBuilder.CreateBox("halflingCoatSide", { width: wall, height: tall, depth: D * (1 + J.out + J.ahead) + wall }, scene), coat);
    sideWall.position.set(side * (W * (0.5 + J.out) + wall * 0.5), mid, z + D * (J.ahead - J.out) * 0.5);
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
  // the dark belt across the vest at the waist, a big grey square buckle with a dark middle
  const beltTall = H * J.belt;
  const belt = put(MeshBuilder.CreateBox("halflingBelt", { width: W * (J.vest * 2 + 0.1), height: beltTall, depth: D * 0.08 }, scene), mf.get("cloth", HALFLING_BELT_DARK, { emissiveIntensity: 0.1 }));
  belt.position.set(0, foot + beltTall * 0.5, vestFace + D * 0.02);
  const buckle = put(MeshBuilder.CreateBox("halflingBuckle", { width: W * J.buckle, height: beltTall * J.buckleTall, depth: D * 0.05 }, scene), mf.get("metal", HALFLING_BUCKLE_GREY, { emissiveIntensity: 0.25 }));
  buckle.position.set(0, belt.position.y, belt.position.z + D * 0.05);
  const hole = put(MeshBuilder.CreateBox("halflingBuckleHole", { width: W * J.buckle * 0.55, height: beltTall * J.buckleTall * 0.5, depth: D * 0.02 }, scene), mf.get("cloth", HALFLING_BELT_DARK, { emissiveIntensity: 0.1 }));
  hole.position.set(0, belt.position.y, buckle.position.z + D * 0.025);
  return added;
}
