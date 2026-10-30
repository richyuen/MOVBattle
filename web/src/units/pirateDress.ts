import { Scene, Color3, Mesh, MeshBuilder, Matrix, Vector3, TransformNode, type Node } from "@babylonjs/core";
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
 * [S] 428 the barrel bracers (audit 422 a.3: "the forearms - bare team - TABS: brown stave bracers with black straps on each arm"; pirate.blunderbuss.red.png,
 * card Appearance "large straps around their arms": short barrels of upright brown staves round each forearm from below the elbow to the wrist and round
 * each upper arm under the shoulder, each held by two black straps). BARREL_BRACERS, per arm limb (its joint's frame): .staves upright boards round an
 * oval .out of the limb's half-size from .from to .to of the way down it (.upFrom/.upTo on the upper arm), each .wide of its share of the girth and
 * .thick of the limb's width thick, alternating BARREL_ARMOUR's brown and its .alt shade; two black straps .strap of the run tall at .strapAt of it,
 * .strapOut proud of the staves. Self-lit as the barrel.
 */
const BARREL_BRACERS = { staves: 8, out: 1.5, from: 0.12, to: 0.92, upFrom: 0.2, upTo: 0.8, wide: 1.12, thick: 0.22, strap: 0.13, strapAt: [0.2, 0.8], strapOut: 0.12 };

export function barrelBracers(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = BARREL_BRACERS, A = BARREL_ARMOUR;
  const mf = getMaterialFactory();
  const brown = mf.get("cloth", A.brown, { emissive: A.brown.scale(A.glow) });
  const brownAlt = A.brown.scale(A.alt);
  const brown2 = mf.get("cloth", brownAlt, { emissive: brownAlt.scale(A.glow) });
  const dark = mf.get("cloth", A.dark, { emissive: A.dark.scale(A.glow) });
  const out: Mesh[] = [];
  const limbs: [Mesh, number, number][] = [
    [body.leftLowerArm, B.from, B.to], [body.rightLowerArm, B.from, B.to], [body.leftUpperArm, B.upFrom, B.upTo], [body.rightUpperArm, B.upFrom, B.upTo],
  ];
  for (const [limb, from, to] of limbs) {
    if (!limb) continue;
    const L = limbBox(limb);
    const yTop = L.mid + L.half - from * L.half * 2, yBot = L.mid + L.half - to * L.half * 2, tall = yTop - yBot, mid = (yTop + yBot) / 2;
    const rx = L.wide * B.out, rz = L.deep * B.out, thick = L.wide * 2 * B.thick;
    for (let i = 0; i < B.staves; i++) {
      const a = (i / B.staves) * Math.PI * 2;
      const r = Math.hypot(Math.cos(a) * rx, Math.sin(a) * rz);
      const stave = MeshBuilder.CreateBox("barrelBracerStave", { width: r * (Math.PI * 2 / B.staves) * B.wide, height: tall, depth: thick }, scene);
      stave.parent = limb.parent;
      stave.position.set(limb.position.x + Math.sin(a) * rx, mid, limb.position.z + Math.cos(a) * rz);
      stave.rotation.y = Math.atan2(Math.sin(a) * rz, Math.cos(a) * rx);
      stave.material = i % 2 ? brown2 : brown;
      stave.convertToFlatShadedMesh();
      out.push(stave);
    }
    for (const at of B.strapAt) {
      const strap = MeshBuilder.CreateCylinder("barrelBracerStrap", { height: tall * B.strap, diameter: 2, tessellation: B.staves }, scene);
      strap.parent = limb.parent;
      strap.scaling.set(rx + thick / 2 + L.wide * B.strapOut, 1, rz + thick / 2 + L.wide * B.strapOut);
      strap.position.set(limb.position.x, yTop - tall * at, limb.position.z);
      strap.rotation.y = Math.PI / B.staves;
      strap.material = dark;
      strap.convertToFlatShadedMesh();
      out.push(strap);
    }
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
 * [S] 428 the Captain's long coat (audit 422 a.3: "a dark closed tunic ending at the hips - TABS: a long team coat with tan trim hanging open to the knees
 * over a tan shirt and white cravat"; pirate.captain.red.png, card Appearance "a long, team-colored coat with a shirt under it and a cloth around the
 * shirt": the coat from the shoulders to just below the knee, open down the whole front, a broad tan shirt between its fronts, a white cravat bunched
 * at the collar, tan edging down each front and round the hem). CAPTAIN_COAT: on the trunk (torso frame) a team shell .out of the trunk wide and .deep
 * of it deep over the shoulders to its foot; the tan shirt a slab .shirt of the trunk across standing .proud off the shell's front; the cravat a white
 * block .cravat across and .cravatLong of the trunk's height under the collar, .cravatProud proud; tan edges .edge across down each side of the shirt.
 * Below the waist (hip frame, off the pelvis's box p) the skirts: a back panel .back of the pelvis across, a side panel each side, and a front panel each
 * side .front of the pelvis across leaving the shirt's width open between them, all from the pelvis's top to .long of the knee's drop below it, flaring
 * .flare rad out, .thick of the pelvis deep; a tan hem .hem tall round every panel's foot and a tan edge down each front panel's inner side. Self-lit .glow.
 */
const CAPTAIN_COAT = {
  out: 1.12, deep: 1.22, shirt: 0.36, proud: 0.04, cravat: 0.24, cravatLong: 0.26, cravatProud: 0.1, edge: 0.07,
  back: 1.2, front: 0.42, long: 1.35, flare: 0.1, thick: 0.12, hem: 0.07,
  tan: new Color3(0.8, 0.6, 0.35), shirtTan: new Color3(0.86, 0.68, 0.45), white: new Color3(0.9, 0.88, 0.84), glow: 0.12,
};

export function captainCoat(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const C = CAPTAIN_COAT;
  const mf = getMaterialFactory();
  const coat = mf.get("cloth", teamColor, { emissive: teamColor.scale(C.glow) });
  const tan = mf.get("cloth", C.tan, { emissive: C.tan.scale(C.glow) });
  const shirt = mf.get("cloth", C.shirtTan, { emissive: C.shirtTan.scale(C.glow) });
  const white = mf.get("cloth", C.white, { emissive: C.white.scale(C.glow * 1.5) });
  const out: Mesh[] = [];
  const slab = (name: string, w: number, h: number, d: number, parent: Node | null, x: number, y: number, z: number, mat: typeof coat): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.parent = parent;
    m.position.set(x, y, z);
    if (parent === tm.parent) m.rotation.copyFrom(tm.rotation);
    m.material = mat;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  // the trunk: shell, shirt, cravat and the tan edges of the open front (torso frame, as the open coat)
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const front = cz + D * C.deep / 2;
  slab("captainCoat", W * C.out, H * 1.02, D * C.deep, tm.parent, cx, cy, cz, coat);
  slab("captainCoatShirt", W * C.shirt, H * 0.98, D * C.proud, tm.parent, cx, cy, front + D * C.proud / 2, shirt);
  slab("captainCoatCravat", W * C.cravat, H * C.cravatLong, D * C.cravatProud, tm.parent, cx, cy + H / 2 - H * C.cravatLong / 2, front + D * C.cravatProud / 2, white);
  for (const side of [-1, 1]) {
    slab("captainCoatEdge", W * C.edge, H * 1.0, D * C.proud * 1.6, tm.parent, cx + side * W * (C.shirt + C.edge) / 2, cy, front + D * C.proud * 0.8, tan);
  }
  // the skirts below the waist (hip frame)
  const pelvis = body.hip.getChildMeshes(true).find((m) => /_pelvis$/.test(m.name));
  if (!pelvis) return out;
  const pb = pelvis.getBoundingInfo().boundingBox, ps = pelvis.scaling;
  const PW = pb.extendSize.x * 2 * ps.x, PD = pb.extendSize.z * 2 * ps.z;
  const px = pelvis.position.x + pb.center.x * ps.x, pz = pelvis.position.z + pb.center.z * ps.z;
  const top = pelvis.position.y + pb.center.y * ps.y + pb.extendSize.y * ps.y;
  const long = Math.abs(body.leftKnee.position.y) * C.long;
  const thick = PD * C.thick, wide = PW * C.back, halfX = wide / 2, halfZ = PD * 0.5 + thick * 1.5;
  // each panel hangs from its top edge (local +z its outer face), tipped out at the hem; a tan strip at its foot and, on a front, down its inner side
  const panel = (w: number, x: number, z: number, ry: number, inner = 0): void => {
    const hang = MeshBuilder.CreateBox("captainCoatHang", { size: 0.001 }, scene);
    hang.isVisible = false;
    hang.parent = body.hip;
    hang.position.set(x, top, z);
    hang.rotation.set(-C.flare, ry, 0);
    slab("captainCoatSkirt", w, long, thick, hang, 0, -long / 2, 0, coat);
    slab("captainCoatHem", w * 1.02, long * C.hem, thick * 1.5, hang, 0, -long + long * C.hem / 2, thick * 0.3, tan);
    if (inner) slab("captainCoatEdge", PW * C.edge, long, thick * 1.5, hang, inner * (w / 2 - PW * C.edge / 2), -long / 2, thick * 0.3, tan);
  };
  // back (its face out to his back: turned half round), sides, and the two fronts either side of the shirt's opening
  panel(wide, px, pz - halfZ, Math.PI);
  for (const side of [-1, 1]) {
    panel(PD + thick * 3, px + side * halfX, pz, side * Math.PI / 2);
    const fw = PW * C.front, fx = px + side * (W * C.shirt / 2 + fw / 2);
    panel(fw, fx, pz + halfZ, 0, -side);
  }
  return out;
}

/*
 * [S] 428 the Pirate Queen's bomb sash (audit 422 a.3: "a plain dark tunic - TABS: a brown sash slung from the shoulder across the chest carrying four
 * black bombs"; pirate.pirate_queen.red.png, card Appearance "a brown bomb sash": a broad brown strap from over her right shoulder down across the
 * chest to her left hip, four round black bombs strung along it, each about a fifth of the chest across, standing well out of it). QUEEN_SASH, on the
 * trunk (torso frame, -x her left): a strap .wide of the trunk's width across and .thick of its depth thick, from .fromX of the half-width at the
 * shoulder's top (.over above it, so it runs over onto the back) to .toX at .toY of the half-height below the middle (her left hip), standing .proud
 * off the trunk's front, with its twin down the back; .bombs black faceted balls .bomb of the trunk's width across at even steps .at along the
 * strap, each sat .seat of its radius out of the strap's face, a short fuse stub on top. Brown self-lit .glow, the bombs .bombGlow.
 */
const QUEEN_SASH = {
  wide: 0.17, thick: 0.08, fromX: 0.72, over: 0.04, toX: -0.86, toY: -0.92, proud: 0.03, bombs: 4, bomb: 0.2, at: [0.14, 0.36, 0.58, 0.8], seat: 0.75,
  brown: new Color3(0.24, 0.13, 0.065), black: new Color3(0.035, 0.035, 0.04), glow: 0.14, bombGlow: 0.2,
};

export function queenSash(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = QUEEN_SASH;
  const mf = getMaterialFactory();
  const brown = mf.get("cloth", S.brown, { emissive: S.brown.scale(S.glow) });
  const black = mf.get("cloth", S.black, { emissive: S.black.scale(S.bombGlow) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const out: Mesh[] = [];
  // the line of the strap on the chest: from the right shoulder's top to the left hip
  const x0 = W / 2 * S.fromX, y0 = H / 2 + H * S.over, x1 = W / 2 * S.toX, y1 = H / 2 * S.toY;
  const len = Math.hypot(x0 - x1, y0 - y1), ang = Math.atan2(y0 - y1, x0 - x1);
  const thick = D * S.thick;
  for (const face of [1, -1]) {
    const strap = MeshBuilder.CreateBox("queenSash", { width: len, height: W * S.wide, depth: thick }, scene);
    strap.parent = tm.parent;
    strap.position.set(cx + (x0 + x1) / 2, cy + (y0 + y1) / 2, cz + face * (D / 2 + D * S.proud + thick / 2));
    strap.rotation.copyFrom(tm.rotation);
    // the back run comes down from the same shoulder to the same hip
    strap.rotation.z += ang;
    strap.material = brown;
    strap.convertToFlatShadedMesh();
    out.push(strap);
  }
  // the bombs strung down the front run of the strap
  const r = W * S.bomb / 2, face = cz + D / 2 + D * S.proud + thick;
  for (let i = 0; i < S.bombs; i++) {
    const t = S.at[i] ?? (i + 0.5) / S.bombs;
    const ball = MeshBuilder.CreateIcoSphere("queenSashBomb", { radius: r, subdivisions: 1, flat: true }, scene);
    ball.parent = tm.parent;
    ball.position.set(cx + x0 + (x1 - x0) * t, cy + y0 + (y1 - y0) * t, face + r * S.seat);
    ball.material = black;
    out.push(ball);
    const fuse = MeshBuilder.CreateCylinder("queenSashFuse", { height: r * 0.6, diameter: r * 0.3, tessellation: 5 }, scene);
    fuse.parent = ball;
    fuse.position.y = r * 1.1;
    fuse.material = brown;
    out.push(fuse);
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

/*
 * [S] 427 the Pirate Queen's bandana (audit 422 a.1: "a flat black angular hat - TABS: a team bandana with a white eyepatch over one eye";
 * pirate.pirate_queen.red.png, card Appearance "a cloth covering one of their eyes": a team cloth tied tight over the crown and brow, its front edge
 * slanting down across the face to cover her left eye, the right eye bare and big below it, the knot at the back). QUEEN_BANDANA, in the head's own
 * box (e its half sizes): a cloth shell .out of the head wide and deep from .brow above the eyes' top to .top over the crown, sitting .sink back; the
 * flap over the left eye a slab .flap of the head across from the cap's foot to .below the eye's bottom, .proud off the face and slanting .slant rad
 * (down toward her left), the eye and pupil under it hidden; at the back a knot .knot across with two tails .tail long splayed .splay rad. Team cloth
 * self-lit .glow.
 */
const QUEEN_BANDANA = { out: 1.1, brow: 0.06, top: 1.14, sink: 0.04, flap: 0.95, below: 0.12, proud: 0.1, slant: 0.32, knot: 0.36, tail: 0.75, splay: 0.35, glow: 0.12 };

export function queenBandana(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const Q = QUEEN_BANDANA;
  const cloth = getMaterialFactory().get("cloth", teamColor, { emissive: teamColor.scale(Q.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  // the bead eyes hang off the neck: read them into the head's frame
  const toHead = (n: Mesh): Vector3 => {
    const chain: Node[] = [];
    for (let k: Node | null = n; k; k = k.parent) chain.unshift(k);
    for (const k of chain) if (k instanceof TransformNode) k.computeWorldMatrix(true);
    head.computeWorldMatrix(true);
    return Vector3.TransformCoordinates(n.getBoundingInfo().boundingBox.centerWorld, head.getWorldMatrix().clone().invert());
  };
  const eyeR = body.leftEye ? body.leftEye.getBoundingInfo().boundingBox.extendSize.y * body.leftEye.scaling.y : e.y * 0.2;
  const eye = body.leftEye ? toHead(body.leftEye) : new Vector3(-e.x * 0.4, c.y + e.y * 0.1, c.z + e.z);
  const eyeTop = eye.y + eyeR;
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, y: number, z: number): Mesh => {
    m.parent = head;
    m.position.set(x, y, z);
    m.material = cloth;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  // the cap over the crown and brow
  const foot = eyeTop + e.y * 2 * Q.brow, top = c.y + e.y * Q.top;
  put(MeshBuilder.CreateBox("queenBandana", { width: e.x * 2 * Q.out, height: top - foot, depth: e.z * 2 * Q.out }, scene), c.x, (top + foot) / 2, c.z - e.z * Q.sink);
  // the flap slanting down over her left eye
  const flapTop = foot + e.y * 0.1, flapFoot = eye.y - eyeR - e.y * 2 * Q.below;
  const flap = put(MeshBuilder.CreateBox("queenBandanaFlap", { width: e.x * 2 * Q.flap * 0.5, height: flapTop - flapFoot, depth: e.z * 2 * Q.proud }, scene),
    eye.x, (flapTop + flapFoot) / 2, Math.max(eye.z, c.z + e.z) + e.z * Q.proud * 0.6);
  flap.rotation.z = -Q.slant * Math.sign(eye.x || -1);
  body.leftEye?.setEnabled(false);
  body.leftPupil?.setEnabled(false);
  // the knot at the back and its two tails
  const back = c.z - e.z * Q.out - e.z * Q.knot * 0.4;
  put(MeshBuilder.CreateBox("queenBandanaKnot", { width: e.x * 2 * Q.knot, height: e.y * 2 * Q.knot * 0.8, depth: e.z * 2 * Q.knot * 0.6 }, scene), c.x, foot + e.y * 0.3, back);
  for (const side of [-1, 1]) {
    const tail = put(MeshBuilder.CreateBox("queenBandanaTail", { width: e.x * 0.5, height: e.y * 2 * Q.tail, depth: e.z * 0.12 }, scene),
      c.x + side * e.x * 0.25, foot + e.y * 0.3 - e.y * Q.tail, back - e.z * 0.1);
    tail.setPivotPoint(new Vector3(0, e.y * Q.tail, 0));
    tail.rotation.z = side * Q.splay;
  }
  return out;
}
