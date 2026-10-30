import { Scene, Color3, Mesh, MeshBuilder, Matrix } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { limbBox, limbShell } from "./medievalDress";

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
 * [S] 426 the barrel armour (audit 422 a.2: "a dark closed tunic - TABS: a brown barrel of vertical staves with two black straps round the chest";
 * pirate.blunderbuss.red.png, card Appearance "barrel armor": a wooden barrel worn from under the arms to below the hips, wider than the trunk, its
 * staves upright, two dark hoops round it, hung from two dark straps over the shoulders). BARREL_ARMOUR: .staves upright boards round an oval .out of
 * the trunk wide and .deep of it deep, from .top of the trunk's height below its top to .below of it under its foot, each .wide of its share of the
 * girth across and .thick deep, alternating brown and brown times .alt; .hoops dark bands at .hoopAt (share of the barrel's height up) .hoop tall and
 * .hoopOut proud of the staves; two straps .strap of the trunk across at .strapAt of its half-width either side, up the front and the back from the
 * barrel to the shoulders. Self-lit .glow.
 */
const BARREL_ARMOUR = {
  staves: 14, out: 1.3, deep: 1.45, top: 0.28, below: 0.22, wide: 1.08, thick: 0.06, alt: 0.78, hoopAt: [0.18, 0.78], hoop: 0.07, hoopOut: 0.025,
  strap: 0.08, strapAt: 0.55, brown: new Color3(0.26, 0.13, 0.06), dark: new Color3(0.03, 0.03, 0.035), glow: 0.12,
};

export function barrelArmour(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = BARREL_ARMOUR;
  const mf = getMaterialFactory();
  const brown = mf.get("cloth", B.brown, { emissive: B.brown.scale(B.glow) });
  const brownAlt = B.brown.scale(B.alt);
  const brown2 = mf.get("cloth", brownAlt, { emissive: brownAlt.scale(B.glow) });
  const dark = mf.get("cloth", B.dark, { emissive: B.dark.scale(B.glow) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const out: Mesh[] = [];
  const place = (m: Mesh, x: number, y: number, z: number, ry: number, mat: typeof brown): Mesh => {
    m.position.set(cx + x, cy + y, cz + z);
    m.rotation.copyFrom(tm.rotation);
    m.rotation.y += ry;
    m.parent = tm.parent;
    m.material = mat;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  const rx = W * B.out / 2, rz = D * B.deep / 2;
  const top = H / 2 - H * B.top, bottom = -H / 2 - H * B.below, tall = top - bottom, mid = (top + bottom) / 2;
  // the staves: upright boards round the oval, each facing out from the middle
  for (let i = 0; i < B.staves; i++) {
    const a = (i / B.staves) * Math.PI * 2;
    const x = Math.sin(a) * rx, z = Math.cos(a) * rz;
    // the girth share this stave covers on the oval (its local radius times the step)
    const r = Math.hypot(Math.cos(a) * rx, Math.sin(a) * rz);
    const w = r * (Math.PI * 2 / B.staves) * B.wide;
    const stave = MeshBuilder.CreateBox("barrelStave", { width: w, height: tall, depth: D * B.thick }, scene);
    place(stave, x, mid, z, Math.atan2(Math.sin(a) * rz, Math.cos(a) * rx), i % 2 ? brown2 : brown);
  }
  // the hoops: dark bands round the staves
  for (const at of B.hoopAt) {
    const hoop = MeshBuilder.CreateCylinder("barrelHoop", { height: H * B.hoop, diameter: 2, tessellation: B.staves }, scene);
    hoop.scaling.set(rx + D * (B.thick / 2 + B.hoopOut), 1, rz + D * (B.thick / 2 + B.hoopOut));
    place(hoop, 0, bottom + tall * at, 0, Math.PI / B.staves, dark);
  }
  // the straps: up the front and the back from the barrel's rim over each shoulder
  const strapTall = H / 2 - top + H * 0.04;
  for (const side of [-1, 1]) for (const face of [-1, 1]) {
    const strap = MeshBuilder.CreateBox("barrelStrap", { width: W * B.strap, height: strapTall, depth: D * 0.05 }, scene);
    place(strap, side * W * B.strapAt / 2, top + strapTall / 2, face * (D / 2 + D * 0.03), 0, dark);
  }
  return out;
}

/*
 * [S] 426 the open coat (audit 422 a.3: "a dark closed tunic - TABS: an open team coat with tan lapels over a white V undershirt"; pirate.harpooner.red.png,
 * card Appearance "open coat, undershirt": a team coat from the shoulders to the top of the thighs, open down the front over a white undershirt cut in a
 * deep V, its two fronts edged with broad tan lapels turned back from the collar). OPEN_COAT: the coat a shell .out of the trunk wide and .deep of it deep,
 * .long of its height from the shoulders down, in the team colour; the white V a flat wedge .vee of the trunk across at the collar narrowing to a point
 * .veeLong of the trunk's height down, standing .proud off the shell's front; the two fronts .front of the trunk across either side of the V; the lapels
 * tan strips .lapel across, .lapelLong of the height, .lapelProud proud, along the V's edges leaning .lean rad in to its point. Self-lit .glow.
 */
const OPEN_COAT = {
  out: 1.12, deep: 1.14, long: 1.32, vee: 0.42, veeLong: 0.62, proud: 0.03, front: 0.34, lapel: 0.11, lapelLong: 0.5, lapelProud: 0.07, lean: 0.3,
  white: new Color3(0.9, 0.88, 0.84), tan: new Color3(0.8, 0.6, 0.35), glow: 0.12,
};

export function openCoat(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const C = OPEN_COAT;
  const mf = getMaterialFactory();
  const coat = mf.get("cloth", teamColor, { emissive: teamColor.scale(C.glow) });
  const white = mf.get("cloth", C.white, { emissive: C.white.scale(C.glow * 1.5) });
  const tan = mf.get("cloth", C.tan, { emissive: C.tan.scale(C.glow) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const out: Mesh[] = [];
  const place = (m: Mesh, x: number, y: number, z: number, rz: number, mat: typeof coat): Mesh => {
    m.position.set(cx + x, cy + y, cz + z);
    m.rotation.copyFrom(tm.rotation);
    m.rotation.z += rz;
    m.parent = tm.parent;
    m.material = mat;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  // the coat: a shell from the shoulders down past the belt
  const long = H * C.long, drop = (H - long) / 2;
  const front = D * C.deep / 2;
  place(MeshBuilder.CreateBox("openCoat", { width: W * C.out, height: long, depth: D * C.deep }, scene), 0, drop, 0, 0, coat);
  // the white V: a wedge from the collar to a point, a squared 4-sided frustum flattened onto the coat's front
  const veeLong = H * C.veeLong, veeTop = H / 2;
  const vee = MeshBuilder.CreateCylinder("openCoatVee", { height: veeLong, diameterTop: W * C.vee * Math.SQRT2, diameterBottom: 0.002, tessellation: 4 }, scene);
  vee.bakeTransformIntoVertices(Matrix.RotationY(Math.PI / 4));
  vee.scaling.z = (D * C.proud) / (W * C.vee);
  place(vee, 0, veeTop - veeLong / 2, front + D * C.proud / 2, 0, white);
  // the lapels: tan strips along the V's two edges, turned back from the collar toward its point
  const lapelLong = H * C.lapelLong;
  for (const side of [-1, 1]) {
    const x = side * (W * C.vee / 4 + W * C.lapel * 0.3);
    place(MeshBuilder.CreateBox("openCoatLapel", { width: W * C.lapel, height: lapelLong, depth: D * C.lapelProud }, scene),
      x, veeTop - lapelLong / 2, front + D * C.lapelProud / 2, -side * C.lean, tan);
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

/*
 * [S] 424 the ripped shorts (audit 422 a.2: "bare team - TABS: ripped tan shorts ending above the knee"; pirate.bomb_thrower.red.png, card Appearance
 * "ripped shorts": loose tan shorts from the belt to just above the knee, their hem torn into ragged points). PIRATE_SHORTS: over each thigh a six-sided
 * tan shell .out of the limb across from its top to .to of it; round the hem .rags flat torn points, each .rag of the limb's length long and .ragWide of
 * the hem's girth across, hanging from the hem and splayed .splay rad out, alternating long and .short. Self-lit .glow.
 */
const PIRATE_SHORTS = { out: 1.65, to: 0.72, rags: 7, rag: 0.2, ragWide: 0.16, short: 0.6, splay: 0.12, tan: new Color3(0.8, 0.6, 0.35), glow: 0.12 };

export function pirateShorts(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = PIRATE_SHORTS;
  const mf = getMaterialFactory();
  const tan = mf.get("cloth", S.tan, { emissive: S.tan.scale(S.glow) });
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) {
    const shell = limbShell(scene, "pirateShorts", thigh, 0, S.to, S.out, tan);
    out.push(shell);
    // the torn hem: flat points hanging round the shell's foot (limbShell tapers to .86 at its foot)
    const L = limbBox(thigh);
    const r = Math.max(L.wide, L.deep) * S.out * 0.86, deep = shell.scaling.z;
    const hemY = L.mid + L.half - S.to * L.half * 2;
    const girth = 2 * Math.PI * r;
    for (let i = 0; i < S.rags; i++) {
      const a = (i / S.rags) * Math.PI * 2;
      const long = L.half * 2 * S.rag * (i % 2 ? S.short : 1);
      const rag = MeshBuilder.CreateCylinder("pirateShortsRag", { height: long, diameterTop: girth * S.ragWide, diameterBottom: 0, tessellation: 4 }, scene);
      rag.scaling.z = 0.15;
      rag.convertToFlatShadedMesh();
      rag.parent = thigh.parent;
      const x = Math.sin(a) * r, z = Math.cos(a) * r * deep;
      rag.position.set(x, hemY - long / 2 + long * 0.1, z);
      // the flat face looks out from the leg, the point tips out a little
      rag.rotation.set(-S.splay, a, 0);
      rag.material = tan;
      out.push(rag);
    }
  }
  return out;
}

/*
 * [S] 427 the plank hat (audit 422 a.1: "a small round tan cap - TABS: a flat wooden plank hat as wide as the shoulders, a barrel lid worn level";
 * pirate.blunderbuss.red.png: a flat brown board lying on the crown, about two and a half heads across and a head and a half deep, a finger thick, its
 * edge showing as a dark line). PLANK_HAT, in the head's own box (e its half sizes): .boards boards side by side along his front-back, together .wide of
 * the head across and .deep of it deep, each .thick of the head's height thick and parted by a .gap groove, lying .sit into the crown and tipped .tilt rad
 * to his left as the render's; under it a dark batten .batten of the head's width across holding the boards, the lid's cleat. Brown wood self-lit .glow.
 */
const PLANK_HAT = { boards: 3, wide: 2.5, deep: 1.6, thick: 0.17, gap: 0.03, sit: 0.06, tilt: 0.1, batten: 1.1, brown: new Color3(0.4, 0.22, 0.12), dark: new Color3(0.12, 0.06, 0.03), glow: 0.14 };

export function plankHat(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = PLANK_HAT;
  const mf = getMaterialFactory();
  const wood = mf.get("cloth", P.brown, { emissive: P.brown.scale(P.glow) });
  const woodAlt = P.brown.scale(0.82);
  const wood2 = mf.get("cloth", woodAlt, { emissive: woodAlt.scale(P.glow) });
  const dark = mf.get("cloth", P.dark, { emissive: P.dark.scale(P.glow) });
  const bb = body.headMesh.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const W = e.x * 2 * P.wide, D = e.z * 2 * P.deep, T = e.y * 2 * P.thick;
  const top = bb.maximum.y - e.y * 2 * P.sit;
  const out: Mesh[] = [];
  // a pivot on the crown carries the tilt, so the boards and batten tip as one lid
  const lid = MeshBuilder.CreateBox("plankHatPivot", { size: 0.001 }, scene);
  lid.isVisible = false;
  lid.parent = body.headMesh;
  lid.position.set(c.x, top, c.z);
  lid.rotation.z = P.tilt;
  const boardDeep = (D - P.gap * D * (P.boards - 1)) / P.boards;
  for (let i = 0; i < P.boards; i++) {
    const board = MeshBuilder.CreateBox("plankHatBoard", { width: W * (i === 1 ? 1 : 0.94), height: T, depth: boardDeep }, scene);
    board.parent = lid;
    board.position.set(0, T * 0.5 + T * 0.35, -D / 2 + boardDeep / 2 + i * (boardDeep + P.gap * D));
    board.material = i % 2 ? wood2 : wood;
    board.convertToFlatShadedMesh();
    out.push(board);
  }
  // the batten under the boards, across them, sitting on the crown
  const batten = MeshBuilder.CreateBox("plankHatBatten", { width: e.x * 2 * P.batten * 0.35, height: T * 0.7, depth: D * 0.92 }, scene);
  batten.parent = lid;
  batten.position.set(0, T * 0.35, 0);
  batten.material = dark;
  batten.convertToFlatShadedMesh();
  out.push(batten);
  return out;
}
