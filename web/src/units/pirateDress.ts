import { Scene, Color3, Mesh, MeshBuilder } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { limbShell } from "./medievalDress";

/*
 * Pirate dress (units/pirate.*): the cloth each sailor wears over the dark tar trunk, built per unit id by unitFactory. Sized off the trunk mesh's own
 * box in the torso joint's frame (+z is his front, -x his left), as the dynasty dress is.
 */

/*
 * [S] 423 the open vest (critic 422: a closed dark tunic; pirate.flintlock.red.png, card Appearance "vest": a team vest hanging open from the shoulders
 * to the hips, its two fronts either side of a bare team chest a third of the trunk across). PIRATE_VEST: the vest a shell .out of the trunk wide and
 * .deep of it deep, .long of its height from the shoulders down, in the team colour times .dark; the bare chest a slab .chest of the trunk across standing
 * .proud of the trunk's depth off the shell's front in the plain team colour; the two fronts .front of the trunk across each, beside the chest and
 * .lapel of the depth further out, flaring .flare rad toward the hem. All self-lit .glow.
 */
const PIRATE_VEST = { out: 1.08, deep: 1.1, long: 1.08, dark: 0.4, chest: 0.36, proud: 0.03, front: 0.3, lapel: 0.06, flare: 0.08, glow: 0.12 };

export function pirateVest(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const V = PIRATE_VEST;
  const mf = getMaterialFactory();
  const vestColor = teamColor.scale(V.dark);
  const vest = mf.get("cloth", vestColor, { emissive: vestColor.scale(V.glow) });
  const skin = mf.get("cloth", teamColor, { emissive: teamColor.scale(V.glow) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const out: Mesh[] = [];
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, mat: typeof vest, rz = 0): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.position.set(cx + x, cy + y, cz + z);
    m.rotation.copyFrom(tm.rotation);
    m.rotation.z += rz;
    m.parent = tm.parent;
    m.material = mat;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  // the vest's body: a shell round the trunk from the shoulders to below the belt
  const long = H * V.long, drop = (H - long) / 2;
  const shellFront = D * V.deep / 2;
  box("pirateVest", W * V.out, long, D * V.deep, 0, drop, 0, vest);
  // the bare chest showing down the open middle
  const chestZ = shellFront + D * V.proud / 2;
  box("pirateVestChest", W * V.chest, long * 0.97, D * V.proud, 0, drop, chestZ, skin);
  // the two fronts hanging either side of it, standing proud as lapels and flaring out toward the hem
  for (const side of [-1, 1]) {
    const x = side * W * (V.chest + V.front) / 2;
    box("pirateVestFront", W * V.front, long, D * V.lapel, x, drop, shellFront + D * V.lapel / 2, vest, side * V.flare);
  }
  return out;
}

/*
 * [S] 424 the rolled-up pants (audit 422 a.2: "bare team legs - TABS: brown rolled-up pants ending mid-shin"; pirate.flintlock.red.png, card Appearance
 * "rolled-up brown pants": loose brown trousers from the belt over the knee to halfway down the shin, finished in a thick turned-up cuff a shade lighter).
 * PIRATE_PANTS: over each thigh a six-sided brown shell .thigh of the limb across, top to knee; over each shin a shell .shin across from the knee to .to
 * of the shin; at its foot the turned cuff, a ring .cuff of the shin tall and .cuffOut across, in the brown lifted by .cuffLight. Self-lit .glow.
 */
const PIRATE_PANTS = { thigh: 1.6, shin: 1.5, to: 0.5, cuff: 0.14, cuffOut: 1.78, cuffLight: 1.3, brown: new Color3(0.45, 0.19, 0.045), glow: 0.12 };

export function piratePants(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = PIRATE_PANTS;
  const mf = getMaterialFactory();
  const brown = mf.get("cloth", P.brown, { emissive: P.brown.scale(P.glow) });
  const cuffColor = P.brown.scale(P.cuffLight);
  const cuff = mf.get("cloth", cuffColor, { emissive: cuffColor.scale(P.glow) });
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) out.push(limbShell(scene, "piratePantsThigh", thigh, 0, 1, P.thigh, brown));
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "piratePantsShin", shin, 0, P.to, P.shin, brown));
    out.push(limbShell(scene, "piratePantsCuff", shin, P.to - P.cuff, P.to, P.cuffOut, cuff));
  }
  return out;
}
