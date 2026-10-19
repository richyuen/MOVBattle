import { Scene, Color3, Mesh, MeshBuilder, TransformNode, Vector3, Quaternion } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { trunkBand, jitterVertices } from "./tribalDress";

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
const MINO_PAULDRON = { wide: 0.42, tall: 0.55 };
const MINO_SASH = { sash: 0.16, thick: 0.03, buckle: 0.17, tuft: 0.22 };
const MINO_LEATHER = new Color3(0.5, 0.3, 0.19);
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
  const team = mf.get("cloth", teamColor, { emissive: teamColor.scale(0.12) });
  const lightTeam = Color3.Lerp(teamColor, new Color3(1, 1, 1), MINO_BELT.lighter);
  const light = mf.get("cloth", lightTeam, { emissive: lightTeam.scale(0.15) });
  const leather = mf.get("cloth", MINO_LEATHER, { emissive: MINO_LEATHER.scale(0.12) });
  const iron = mf.get("cloth", MINO_IRON, { emissive: MINO_IRON.scale(0.15) });
  const darkFur = mf.get("cloth", MINO_FUR.scale(0.6), { emissive: MINO_FUR.scale(0.06) });
  const add = (m: Mesh, parent: TransformNode, material = team): Mesh => { m.parent = parent; m.material = material; out.push(m); return m; };

  // the belt (MINO_BELT)
  const B = MINO_BELT;
  const waist = trunkBand(body, B.at - B.tall / 2, B.at + B.tall / 2 + 0.05);
  const deep = (waist.maxZ - waist.minZ) / 2;
  const tall = waist.trunk * B.tall;
  const belt = MeshBuilder.CreateCylinder("minoBelt", { height: tall, diameter: 2, tessellation: B.sides }, scene);
  belt.scaling.set(waist.halfX * B.proud, 1, deep * B.proud);
  belt.position.set(waist.midX, waist.trunk * B.at, (waist.minZ + waist.maxZ) / 2);
  belt.convertToFlatShadedMesh();
  add(belt, body.torso);
  for (let i = 0; i < B.swirls; i++) {
    const x = waist.midX + (i - (B.swirls - 1) / 2) * waist.halfX * 0.55;
    const tile = MeshBuilder.CreateBox("minoBeltSwirl", { width: waist.halfX * 0.4, height: tall * 0.55, depth: 0.01 }, scene);
    tile.position.set(x, waist.trunk * B.at, waist.maxZ * B.proud + 0.004);
    tile.rotation.z = i % 2 ? 0.35 : -0.35;
    add(tile, body.torso, light);
  }

  // the chest: its box at the breastbone, for the sash, buckle and tuft
  const chest = trunkBand(body, 0.45, 0.85);
  const front = chest.maxZ;
  // the tuft of chest hair on the breastbone
  const S = MINO_SASH;
  const tuft = MeshBuilder.CreateIcoSphere("minoChestHair", { radius: 1, subdivisions: 1, flat: true }, scene);
  tuft.scaling.set(chest.halfX * S.tuft, chest.trunk * 0.12, 0.02);
  tuft.position.set(chest.midX - chest.halfX * 0.2, chest.trunk * 0.7, front + 0.005);
  add(tuft, body.torso, darkFur);

  // the pauldron on his left shoulder (the render's right) (MINO_PAULDRON)
  const P = MINO_PAULDRON;
  const side = 1; // body +x is his left
  const pw = chest.halfX * 2 * P.wide;
  const pauldron = MeshBuilder.CreateSphere("minoPauldron", { diameter: 1, segments: 4, slice: 0.5 }, scene);
  pauldron.scaling.set(pw * 1.1, pw * P.tall * 1.6, pw);
  pauldron.position.set(side * chest.halfX * 0.9 + chest.midX, chest.trunk * 0.96, (chest.minZ + chest.maxZ) / 2);
  pauldron.rotation.z = -side * 0.35;
  pauldron.convertToFlatShadedMesh();
  add(pauldron, body.torso);
  const scroll = MeshBuilder.CreateCylinder("minoPauldronScroll", { height: pw * 0.16, diameter: 1, tessellation: 8 }, scene);
  scroll.scaling.set(pw * 1.13, 1, pw * 1.03);
  scroll.position.copyFrom(pauldron.position);
  scroll.position.y += pw * 0.08;
  scroll.rotation.z = pauldron.rotation.z;
  add(scroll, body.torso, light);

  // the sash, from that shoulder across the chest down to the other hip, laid on the chest's front
  const top = { x: chest.midX + side * chest.halfX * 0.75, y: chest.trunk * 0.95 };
  const foot = { x: chest.midX - side * chest.halfX * 0.85, y: chest.trunk * 0.12 };
  const len = Math.hypot(top.x - foot.x, top.y - foot.y);
  const sash = MeshBuilder.CreateBox("minoSash", { width: chest.halfX * 2 * S.sash, height: len, depth: S.thick * chest.halfX }, scene);
  sash.position.set((top.x + foot.x) / 2, (top.y + foot.y) / 2, front + S.thick * chest.halfX * 0.5);
  sash.rotation.z = Math.atan2(top.x - foot.x, top.y - foot.y) * -1;
  add(sash, body.torso, leather);
  // the iron buckle square on the sash, a frame with a dark middle
  const bw = chest.halfX * 2 * S.buckle;
  const buckle = MeshBuilder.CreateBox("minoBuckle", { width: bw, height: bw, depth: S.thick * chest.halfX * 1.6 }, scene);
  buckle.position.set(chest.midX + side * chest.halfX * 0.15, chest.trunk * 0.62, front + S.thick * chest.halfX);
  buckle.rotation.z = sash.rotation.z;
  add(buckle, body.torso, iron);
  const hole = MeshBuilder.CreateBox("minoBuckleHole", { width: bw * 0.5, height: bw * 0.5, depth: 0.004 }, scene);
  hole.position.set(buckle.position.x, buckle.position.y, buckle.position.z + S.thick * chest.halfX * 0.8 + 0.002);
  hole.rotation.z = sash.rotation.z;
  add(hole, body.torso, leather);
  return out;
}

/*
 * [S] Zeus's beard and locks (379; ancient.zeus.red.png, card Appearance "luscious locks of dirty blond hair and grand beard with hairs that resemble
 * lightning bolts ... an olive wreath around the sides of their head"; critic 378: no beard, a short brown cap, a flat green band). In the head's half
 * extents (x across, y up, z his front), all dirty blond ZEUS_HAIR self-lit .glow:
 *   - the jaw mass: a jittered faceted ball ZEUS_BEARD.jaw of the half extents, its middle .jawY down and .jawZ ahead, from cheek to cheek under the eyes;
 *   - .strands bolt strands off its lower front, rooted round an arc of .arc rad, each a zig-zag of .kinks tapered four-sided links, kinked .zig of a
 *     link's length side to side, .long head heights long (shorter toward the sides), hanging down and out onto the chest, .thick head widths at the root;
 *   - ZEUS_LOCKS.strands bolt locks all round the back and sides from .rootY of the half height (none over the face, a gap of .face rad each side of
 *     the front), .long head heights long to the shoulders, .thick at the root;
 *   - the laurel hat's cap recoloured blond (it carries the wreath), and .leaves olive leaf clumps along each temple under the wreath.
 */
const ZEUS_HAIR = new Color3(0.62, 0.48, 0.3);
const ZEUS_HAIR_GLOW = 0.16;
const ZEUS_BEARD = { jaw: [1.12, 0.52, 0.6] as const, jawY: 0.72, jawZ: 0.58, strands: 13, arc: 1.25, kinks: 3, zig: 0.55, long: 0.75, thick: 0.15 };
const ZEUS_LOCKS = { strands: 16, rootY: 0.3, face: 0.95, long: 1.05, thick: 0.2 };
const ZEUS_LEAF = { leaves: 4, size: 0.16, color: new Color3(0.38, 0.52, 0.2) };

function shareOf(seed: number, i: number): number {
  const v = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
  return v - Math.floor(v);
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
  // the jaw mass
  const B = ZEUS_BEARD;
  const jaw = MeshBuilder.CreateIcoSphere("zeusBeard", { radius: 1, subdivisions: 1, flat: true }, scene);
  jitterVertices(jaw, 0.16, 61.7, e.x * B.jaw[0], e.y * B.jaw[1], e.z * B.jaw[2]);
  jaw.position.set(0, -e.y * B.jawY, e.z * B.jawZ);
  put(jaw);
  // the bolt strands off its foot, down onto the chest
  for (let i = 0; i < B.strands; i++) {
    const a = ((i + 0.5) / B.strands - 0.5) * 2 * B.arc;
    const root = new Vector3(Math.sin(a) * e.x * B.jaw[0] * 0.8, -e.y * (B.jawY + B.jaw[1] * 0.5), Math.cos(a) * e.z * B.jaw[2] * 0.9 + e.z * B.jawZ * 0.5);
    const dir = new Vector3(Math.sin(a) * 0.3, -1, 0.3 * Math.cos(a)).normalize();
    const side = new Vector3(Math.cos(a), 0, -Math.sin(a));
    const long = H * B.long * (1 - 0.4 * Math.abs(a) / B.arc) * (0.8 + 0.4 * shareOf(7.1, i));
    bolt(root, dir, side, long, W * B.thick, B.kinks, B.zig, 9.3 + i);
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
