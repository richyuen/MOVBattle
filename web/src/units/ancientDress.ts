import { Scene, Color3, Mesh, MeshBuilder, TransformNode } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { trunkBand } from "./tribalDress";

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
