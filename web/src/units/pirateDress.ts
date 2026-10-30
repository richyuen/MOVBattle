import { Scene, Color3, Mesh, MeshBuilder, Matrix, Vector3, TransformNode, VertexBuffer, type Node } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { limbBox, limbShell } from "./medievalDress";
import { eyeSpanInHead } from "./dynastyDress";

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
  const B = BARREL_BRACERS;
  const out: Mesh[] = [];
  const limbs: [Mesh, number, number][] = [
    [body.leftLowerArm, B.from, B.to], [body.rightLowerArm, B.from, B.to], [body.leftUpperArm, B.upFrom, B.upTo], [body.rightUpperArm, B.upFrom, B.upTo],
  ];
  for (const [limb, from, to] of limbs) if (limb) out.push(...braceLimb(scene, limb, from, to, B.out));
  return out;
}

/*
 * [S] 432 the barrel greaves (CONFIRM 431 a.1: "thighs and shins bare team blue - TABS: banded wooden barrel staves around both thighs and both shins";
 * pirate.blunderbuss.blue.png, card Appearance "large straps around their arms, legs": a short stave barrel round each thigh from under the chest barrel's
 * foot to above the knee, another round each shin from below the knee to above the ankle, the bare knee showing between, each held by two black straps).
 * BARREL_GREAVES, per leg limb: the bracer's staves and straps (braceLimb) .out of the limb's half-size, from .thighFrom to .thighTo of the thigh and
 * .shinFrom to .shinTo of the shin.
 */
const BARREL_GREAVES = { out: 1.38, thighFrom: 0.3, thighTo: 0.9, shinFrom: 0.1, shinTo: 0.8 };

export function barrelGreaves(scene: Scene, body: ArticulatedBody): Mesh[] {
  const G = BARREL_GREAVES;
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) if (thigh) out.push(...braceLimb(scene, thigh, G.thighFrom, G.thighTo, G.out));
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) if (shin) out.push(...braceLimb(scene, shin, G.shinFrom, G.shinTo, G.out));
  return out;
}

/** One short stave barrel round a limb (its joint's frame) from `from` to `to` of the way down it, .out of its half-size, two black straps (BARREL_BRACERS). */
function braceLimb(scene: Scene, limb: Mesh, from: number, to: number, outScale: number): Mesh[] {
  const B = BARREL_BRACERS, A = BARREL_ARMOUR;
  const mf = getMaterialFactory();
  const brown = mf.get("cloth", A.brown, { emissive: A.brown.scale(A.glow) });
  const brownAlt = A.brown.scale(A.alt);
  const brown2 = mf.get("cloth", brownAlt, { emissive: brownAlt.scale(A.glow) });
  const dark = mf.get("cloth", A.dark, { emissive: A.dark.scale(A.glow) });
  const out: Mesh[] = [];
  const L = limbBox(limb);
  const yTop = L.mid + L.half - from * L.half * 2, yBot = L.mid + L.half - to * L.half * 2, tall = yTop - yBot, mid = (yTop + yBot) / 2;
  const rx = L.wide * outScale, rz = L.deep * outScale, thick = L.wide * 2 * B.thick;
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
 * [S] 430 the Bomb Thrower's bomb sash (audit 422 bomb_thrower a.4: "the hip - nothing across it - TABS: a team sash slung from the belt across the hip
 * carrying a bomb"; pirate.bomb_thrower.red.png, card Appearance "bomb pouch": a team cloth band from under the belt at his left hip slung down across
 * the front of the shorts to his right hip, where it gathers into a pouch holding one black fused bomb at the side of his thigh). BOMB_SASH, on the
 * trunk (torso frame, -x his left; W, H, D the trunk's box): a band .wide of W across and .thick of D thick from (.fromX of W/2, .fromY of H/2 under the
 * middle) to (.toX, .toY), standing .proud of D off the trunk's front; at its foot a pouch, a team cloth cup .pouch of W across, and in it a black
 * faceted bomb .bomb of W across sat .seat of its radius up, a brown fuse stub on top. Team times .shade self-lit .glow, the bomb .bombGlow.
 */
const BOMB_SASH = {
  wide: 0.16, thick: 0.1, fromX: -0.75, fromY: -0.92, toX: 1.2, toY: -1.25, proud: 0.4, pouch: 0.3, bomb: 0.3, seat: 0.55, shade: 0.85,
  black: new Color3(0.035, 0.035, 0.04), fuse: new Color3(0.24, 0.13, 0.065), glow: 0.12, bombGlow: 0.2,
};

/** A team sash slung from the belt across the front to a pouch and bomb at the right hip (spec at BOMB_SASH). */
export function bombSash(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = BOMB_SASH;
  const mf = getMaterialFactory();
  const shade = teamColor.scale(S.shade);
  const cloth = mf.get("cloth", shade, { emissive: shade.scale(S.glow) });
  const black = mf.get("cloth", S.black, { emissive: S.black.scale(S.bombGlow) });
  const fuseMat = mf.get("cloth", S.fuse, { emissive: S.fuse.scale(S.glow) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const out: Mesh[] = [];
  const put = (m: Mesh, mat = cloth): Mesh => {
    m.parent = tm.parent;
    m.material = mat;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  const x0 = W / 2 * S.fromX, y0 = H / 2 * S.fromY, x1 = W / 2 * S.toX, y1 = H / 2 * S.toY;
  const len = Math.hypot(x1 - x0, y1 - y0), ang = Math.atan2(y1 - y0, x1 - x0);
  const thick = D * S.thick, faceZ = cz + D / 2 + D * S.proud;
  const band = put(MeshBuilder.CreateBox("bombSash", { width: len, height: W * S.wide, depth: thick }, scene));
  band.position.set(cx + (x0 + x1) / 2, cy + (y0 + y1) / 2, faceZ + thick / 2);
  band.rotation.z = ang;
  // the pouch at the foot of the band, the bomb sat in it at the side of the thigh
  const pr = W * S.pouch / 2, br = W * S.bomb / 2;
  // the pouch stands out of the shorts' front (their shell is .65 of the thigh proud of it), not in them
  const px = cx + x1, py = cy + y1, pz = faceZ + thick;
  const pouch = put(MeshBuilder.CreateSphere("bombSashPouch", { diameter: pr * 2, segments: 4, slice: 0.5 }, scene));
  pouch.rotation.x = Math.PI;
  pouch.position.set(px, py, pz);
  const bomb = put(MeshBuilder.CreateIcoSphere("bombSashBomb", { radius: br, subdivisions: 1, flat: true }, scene), black);
  bomb.position.set(px, py + br * S.seat, pz);
  const fuse = put(MeshBuilder.CreateCylinder("bombSashFuse", { height: br * 0.7, diameter: br * 0.3, tessellation: 5 }, scene), fuseMat);
  fuse.position.set(px + br * 0.2, py + br * S.seat + br * 1.15, pz);
  fuse.rotation.z = -0.4;
  return out;
}

/*
 * [S] 431 the Bomb Thrower's belt (CONFIRM 430 bomb_thrower a.2: "no belt is visible at the waist, between the vest hem and the shorts - TABS: a wide
 * orange-brown leather belt with a big buckle at the waist, the unit's largest accent colour"; pirate.bomb_thrower.blue.png: a broad reddish-brown band
 * round the waist over the vest's foot, its front a little taller, a big square tan buckle frame in the middle with its tongue). PIRATE_BELT, on the trunk
 * (W, H, D the trunk's box, torso frame): a band .tall of H tall at .at of H/2 under the middle, .out of W wide and .deep of D deep (clear of the open
 * vest's fronts); on its front a square buckle frame .buckle of W across, four bars .bar of it thick, .proud of D off the band, and the tongue across its
 * middle. Leather self-lit .glow, the buckle tan .buckleGlow. It sits above the sash (BOMB_SASH): at the sash's height the band hid behind it (431 look).
 */
const PIRATE_BELT = { tall: 0.18, at: -0.6, out: 1.18, deep: 1.4, buckle: 0.34, bar: 0.2, proud: 0.06, leather: new Color3(0.62, 0.22, 0.1), tan: new Color3(0.8, 0.6, 0.35), glow: 0.14, buckleGlow: 0.3 };

/** A wide leather belt round the waist over the vest's foot with a big square tan buckle (spec at PIRATE_BELT). */
export function pirateBelt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = PIRATE_BELT;
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", B.leather, { emissive: B.leather.scale(B.glow) });
  const tan = mf.get("cloth", B.tan, { emissive: B.tan.scale(B.buckleGlow) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const out: Mesh[] = [];
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, mat = leather): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.position.set(cx + x, cy + y, cz + z);
    m.rotation.copyFrom(tm.rotation);
    m.parent = tm.parent;
    m.material = mat;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  const y = H / 2 * B.at, tall = H * B.tall, front = D * B.deep / 2;
  box("pirateBelt", W * B.out, tall, D * B.deep, 0, y, 0);
  // the buckle: a square frame on the band's front, a tongue across it
  const s = W * B.buckle, bar = s * B.bar, z = front + D * B.proud / 2;
  for (const side of [-1, 1]) {
    box("pirateBeltBuckle", bar, s, D * B.proud, side * (s - bar) / 2, y, z, tan);
    box("pirateBeltBuckle", s, bar, D * B.proud, 0, y + side * (s - bar) / 2, z, tan);
  }
  box("pirateBeltTongue", s * 0.55, bar * 0.6, D * B.proud * 0.6, -s * 0.12, y, z + D * B.proud * 0.3, tan);
  return out;
}

/*
 * [S] 428 the cannon rider's striped shirt (audit 422 a.3: "the rider's shirt - plain team - TABS: a white shirt with team stripes"; pirate.cannon.red.png,
 * card Appearance "a white, striped shirt": a white short-sleeved shirt over the trunk with broad team bands round it, the sleeves striped too).
 * CANNON_SHIRT, on the crewman (dressCannonCrew's five "crewHoop" bands round his trunk, torso frame): under the bands a white faceted shell following
 * their taper from the waist to .top of the trunk's height, .under of their girth; the bands become team cloth, set .out of their girth; over each
 * upper arm a white short sleeve .sleeve of the limb's half-size from the shoulder to .sleeveTo of it, a team band .band of its length at .bandAt.
 * White self-lit .glow (lit white in his own shade reads grey), team .teamGlow.
 */
const CANNON_SHIRT = { top: 0.9, under: 1.0, out: 1.06, sleeve: 1.4, sleeveTo: 0.55, band: 0.22, bandAt: 0.28, white: new Color3(0.9, 0.88, 0.84), glow: 0.2, teamGlow: 0.12 };

export function cannonShirt(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = CANNON_SHIRT;
  const mf = getMaterialFactory();
  const white = mf.get("cloth", S.white, { emissive: S.white.scale(S.glow) });
  const team = mf.get("cloth", teamColor, { emissive: teamColor.scale(S.teamGlow) });
  const out: Mesh[] = [];
  // the bands: dressCannonCrew's hoops, turned team and set out over the shell
  const hoops = body.allMeshes.filter((m) => m.name === "crewHoop");
  for (const hoop of hoops) {
    hoop.material = team;
    hoop.scaling.x *= S.out;
    hoop.scaling.z *= S.out;
  }
  // the white shell under them, the hoops' own taper (dressCannonCrew: girth(t) = max half-size * 2 * (.76 + .26 t) * 1.03)
  const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
  const girth = (t: number): number => Math.max(chest.x, chest.z) * 2 * (0.76 + 0.26 * t) * 1.03 * S.under;
  const shell = MeshBuilder.CreateCylinder("cannonShirt", { height: chest.y * 2 * S.top, diameterTop: girth(S.top), diameterBottom: girth(0), tessellation: 6 }, scene);
  shell.convertToFlatShadedMesh();
  shell.parent = body.torso;
  shell.position.y = chest.y * S.top;
  shell.scaling.z = body.torsoMesh.scaling.z;
  shell.material = white;
  out.push(shell);
  // the short striped sleeves
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    if (!arm) continue;
    out.push(limbShell(scene, "cannonShirtSleeve", arm, 0, S.sleeveTo, S.sleeve, white));
    out.push(limbShell(scene, "cannonShirtSleeve", arm, S.bandAt, S.bandAt + S.band, S.sleeve * 1.08, team));
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

export function piratePants(scene: Scene, body: ArticulatedBody, color: Color3 = PIRATE_PANTS.brown, cuffLight: number = PIRATE_PANTS.cuffLight): Mesh[] {
  const P = PIRATE_PANTS;
  const mf = getMaterialFactory();
  const brown = mf.get("cloth", color, { emissive: color.scale(P.glow) });
  const cuffColor = color.scale(cuffLight);
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

/*
 * [S] 431 the Pirate Queen's wrap skirt (audit 422 queen a.4: "the hips - bare team legs from the tunic hem - TABS: a team wrap skirt with green beads at
 * its hem over pink pants"; pirate.pirate_queen.red.png, card "red skirt with green beads": a faceted team skirt from the waist flaring to the knees, its
 * hem slanting lower on her left, a row of small green beads round its front at the waist band's foot and hem; pale-pink trousers under it to the boots).
 * QUEEN_SKIRT, in the torso joint's frame (W, H, D the trunk's box): an eight-sided frustum from .top of H above the trunk's foot down .knee of the way
 * to the knees, .out of W across at the top and .flare times that at the hem, .deep of D deep for each W; its hem slants .slant of its length from her
 * right (high) to her left (low); .beads green beads .bead of W across round the front of the hem; trousers: a shell .pantsOut of each leg over the
 * whole thigh and the shin to .shin, in the team colour .pale of the way to white. Self-lit .glow.
 */
/*
 * [S] 432 the skirt's front (CONFIRM 431 a.1: "the front of the lower body reads as pale baggy trousers from hip to knee - TABS: a team-colour skirt
 * hanging over the front to the knees with a slanted hem"; pirate.pirate_queen.red.png: the skirt reaches the knee on her right and a hand below it
 * on her left, and over its front hangs the wrap's loose end, a team flap from the waist band on her left front down to a point below the knee, so
 * the trousers show only from the knee down). The skirt now .knee 1.08 of the way to the knees and slants .slant .6; the wrap flap a thin team
 * trapezoid .flapWide of W across at the waist narrowing to .flapFoot of it, from the waist at .flapX of W/2 on her left down .flapLong of the
 * skirt's length, .flapProud off the skirt's front, leaning .flapLean rad; the trousers .pale .18 so they read as the team's light shade, not white.
 */
const QUEEN_SKIRT = {
  top: 0.14, knee: 1.08, out: 1.06, flare: 1.45, deep: 1.25, slant: 0.6, sides: 8, beads: 7, bead: 0.11, pantsOut: 1.14, shin: 0.6, pale: 0.18,
  flapWide: 0.6, flapFoot: 0.22, flapX: -0.25, flapLong: 1.3, flapProud: 0.06, flapLean: 0.12, green: new Color3(0.12, 0.55, 0.3), glow: 0.12,
};

/** The Pirate Queen's team wrap skirt to the knees, a slanted hem with green beads, and pale trousers under it (spec at QUEEN_SKIRT). */
export function queenSkirt(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const Q = QUEEN_SKIRT;
  const mf = getMaterialFactory();
  const cloth = mf.get("cloth", teamColor, { emissive: teamColor.scale(Q.glow) });
  const pale = Color3.Lerp(teamColor, Color3.White(), Q.pale);
  const pants = mf.get("cloth", pale, { emissive: pale.scale(Q.glow) });
  const green = mf.get("cloth", Q.green, { emissive: Q.green.scale(Q.glow * 2) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const frame = tm.parent as TransformNode;
  // the knees read into the torso joint's frame
  const inFrame = (n: TransformNode): Vector3 => {
    const chain: Node[] = [];
    for (let k: Node | null = n; k; k = k.parent) chain.unshift(k);
    for (const k of chain) if (k instanceof TransformNode) k.computeWorldMatrix(true);
    return Vector3.TransformCoordinates(n.getAbsolutePosition(), frame.getWorldMatrix().clone().invert());
  };
  const kneeY = (inFrame(body.leftKnee).y + inFrame(body.rightKnee).y) / 2;
  const top = cy - H / 2 + H * Q.top, hem = top - (top - kneeY) * Q.knee, long = top - hem;
  const rTop = W * Q.out / 2, rHem = rTop * Q.flare, zs = D * Q.deep / W;
  const out: Mesh[] = [];
  const skirt = MeshBuilder.CreateCylinder("queenSkirt", { height: long, diameterTop: rTop * 2, diameterBottom: rHem * 2, tessellation: Q.sides }, scene);
  // the hem slants down toward her left (-x)
  const pos = skirt.getVerticesData(VertexBuffer.PositionKind)!;
  for (let i = 0; i < pos.length; i += 3) if (pos[i + 1] < 0) pos[i + 1] += Q.slant * long * 0.5 * (pos[i] / rHem);
  skirt.setVerticesData(VertexBuffer.PositionKind, pos);
  skirt.refreshBoundingInfo();
  skirt.convertToFlatShadedMesh();
  skirt.scaling.z = zs;
  skirt.parent = frame;
  skirt.position.set(cx, (top + hem) / 2, cz);
  skirt.material = cloth;
  out.push(skirt);
  // the wrap's loose end hanging over the front from the waist on her left to a point below the knee
  const flapLong = long * Q.flapLong, flapZ = cz + (rTop + (rHem - rTop) * 0.5) * zs + W * Q.flapProud;
  const flap = MeshBuilder.CreateCylinder("queenSkirtFlap", { height: flapLong, diameterTop: W * Q.flapWide, diameterBottom: W * Q.flapFoot, tessellation: 4 }, scene);
  flap.rotation.y = Math.PI / 4;
  flap.bakeCurrentTransformIntoVertices();
  flap.scaling.z = 0.12;
  flap.convertToFlatShadedMesh();
  flap.parent = frame;
  flap.position.set(cx + W / 2 * Q.flapX, top - flapLong / 2, flapZ);
  flap.rotation.set(-0.08, 0, -Q.flapLean);
  flap.material = cloth;
  out.push(flap);
  // the green beads round the front of the hem
  for (let k = 0; k < Q.beads; k++) {
    const a = Math.PI * (0.12 + 0.76 * k / (Q.beads - 1));
    const x = Math.cos(a) * rHem, z = Math.sin(a) * rHem * zs;
    const bead = MeshBuilder.CreateIcoSphere("queenSkirtBead", { radius: W * Q.bead / 2, subdivisions: 1, flat: true }, scene);
    bead.parent = frame;
    bead.position.set(cx + x, hem + Q.slant * long * 0.5 * (x / rHem) + W * Q.bead * 0.2, cz + z + W * Q.bead * 0.3);
    bead.material = green;
    out.push(bead);
  }
  // the pale trousers under it
  for (const [thigh, shin] of [[body.leftUpperLeg, body.leftLowerLeg], [body.rightUpperLeg, body.rightLowerLeg]]) {
    out.push(limbShell(scene, "queenPants", thigh, 0, 1, Q.pantsOut, pants));
    out.push(limbShell(scene, "queenPants", shin, 0, Q.shin, Q.pantsOut, pants));
  }
  return out;
}

/*
 * [S] 429 the pirate's long hair (audit 422 flintlock a.4: "the sides of the head - bare under the cap - TABS: long dark-team hair falling to the
 * shoulders either side of the face"; pirate.flintlock.red.png: two thick locks a shade darker than the skin from under the cap at the eyes' top,
 * down past the jaw to the shoulders either side, behind the face's front, joined by a fall down the back of the head). PIRATE_HAIR, in the head's
 * own box (e its half sizes): two side locks .side of e.x thick each, .out of the head apart, from .top of e.y (up under the hat) down to .drop,
 * from the back to .front of e.z (the face's front is e.z), hinged .clear over the eyes' top and splayed .splay rad out at the foot; a back
 * fall .out wide from .top to .drop, .back of e.z behind the head. No crown of hair: the hat covers it. The caller's colour, self-lit .glow.
 */
const PIRATE_HAIR = { out: 1.08, clear: 0.06, top: 0.62, side: 0.28, drop: -1.7, front: 0.25, splay: 0.12, back: 0.2, glow: 0.12 };

/** Long hair from under the cap to the shoulders either side of the face (spec at PIRATE_HAIR). */
export function pirateHair(scene: Scene, body: ArticulatedBody, color: Color3, opts: Partial<typeof PIRATE_HAIR> = {}): Mesh[] {
  const P = { ...PIRATE_HAIR, ...opts };
  const hair = getMaterialFactory().get("cloth", color, { emissive: color.scale(P.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const span = eyeSpanInHead(body) ?? [c.y - e.y * 0.2, c.y + e.y * 0.3];
  const X = e.x * P.out, Z = e.z * P.out;
  const capFoot = span[1] + e.y * P.clear, top = c.y + e.y * P.top, foot = c.y + e.y * P.drop;
  const out: Mesh[] = [];
  const slab = (name: string, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: x1 - x0, height: y1 - y0, depth: z1 - z0 }, scene);
    m.position.set(c.x + (x0 + x1) / 2, (y0 + y1) / 2, c.z + (z0 + z1) / 2);
    m.parent = head;
    m.material = hair;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  // the locks either side of the face, from under the hat's rim, hinged at the eyes' top and splayed out over the shoulders (no cap of hair over
  // the crown: the hat covers it, and a hair crown stood over the hat as a hood box, 429)
  for (const side of [-1, 1]) {
    const x0 = side > 0 ? X - e.x * P.side : -X, x1 = side > 0 ? X : -X + e.x * P.side;
    const lock = slab("pirateHairLock", x0, x1, foot, top, -Z, e.z * P.front);
    lock.setPivotPoint(new Vector3(0, capFoot - (top + foot) / 2, 0));
    lock.rotation.z = side * P.splay;
  }
  // the fall down the back of the head
  slab("pirateHairFall", -X * 0.94, X * 0.94, foot, top, -Z - e.z * P.back, -Z + e.z * 0.3);
  return out;
}

/*
 * [S] 432 the Flintlock's ginger locks (CONFIRM 430 a.2: "the hair is a pair of team-dark panels down both sides of the head to the shoulders - TABS:
 * ginger/orange-brown locks hang either side of the face from under the bandana, the brightest accent on the unit"; pirate.flintlock.blue.png: on
 * each side of the face three thin ginger strands from under the bandana's rim at the eyes' top down to about the jaw, the front one beside the
 * eyes, the others stepping back along the head's side, each splayed a little out at its foot; the same ginger on both teams). FLINTLOCK_LOCKS, in
 * the head's own box (e its half sizes): per side .locks upright slabs .thick of e.x thick and .wide of e.z across, set .out of e.x off the middle,
 * stepping back .step of e.z from .front of e.z, from .clear over the eyes' top down to .drop of e.y (the back ones .longer of that lower), splayed
 * .splay rad; fixed .ginger, self-lit .glow. No hood: nothing over the crown or down the back, the bandana covers it.
 */
const FLINTLOCK_LOCKS = { locks: 3, thick: 0.2, wide: 0.34, out: 1.06, front: 0.42, step: 0.42, clear: 0.04, drop: -1.15, longer: 0.18, splay: 0.14, ginger: new Color3(0.75, 0.3, 0.15), glow: 0.16 };

export function flintlockLocks(scene: Scene, body: ArticulatedBody): Mesh[] {
  const F = FLINTLOCK_LOCKS;
  const hair = getMaterialFactory().get("cloth", F.ginger, { emissive: F.ginger.scale(F.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const span = eyeSpanInHead(body) ?? [c.y - e.y * 0.2, c.y + e.y * 0.3];
  const top = span[1] + e.y * F.clear;
  const out: Mesh[] = [];
  for (const side of [-1, 1]) for (let k = 0; k < F.locks; k++) {
    const foot = c.y + e.y * (F.drop - F.longer * k);
    const m = MeshBuilder.CreateBox("flintlockLock", { width: e.x * F.thick, height: top - foot, depth: e.z * F.wide }, scene);
    m.parent = head;
    m.position.set(c.x + side * e.x * (F.out + F.thick / 2), (top + foot) / 2, c.z + e.z * (F.front - F.step * k));
    m.setPivotPoint(new Vector3(0, (top - foot) / 2, 0));
    m.rotation.z = side * F.splay * (1 + 0.3 * k);
    m.material = hair;
    m.convertToFlatShadedMesh();
    out.push(m);
  }
  return out;
}

/*
 * [S] 430 the Blunderbuss's hair (audit 422 blunderbuss a.4: "the sides of the head - bare - TABS: dark-brown hair falling to the shoulders either side
 * of the face"; pirate.blunderbuss.blue.png: a mid-dark brown bob from under the plank hat down past the jaw either side of the face, over the crown under
 * the plank). BLUNDERBUSS_HAIR: pirateHair's locks and fall in .color reaching .top of e.y up under the plank, dropping to .drop; over the crown a cap
 * .cap of the head across from the locks' top to the plank's underside (PLANK_HAT.sit under the head's top), so the plank sits on hair.
 */
/*
 * [S] 432 the Harpooner's rolled pants (CONFIRM 431 a.1: "legs dark team blue from hip to shoe - TABS: beige pants rolled up to mid-calf, bare team-skin
 * shins below"; pirate.harpooner.red.png, card Appearance "rolled-up beige pants": loose grey-beige trousers from the coat's hem over the knee to
 * halfway down the calf, a turned cuff a shade darker, the bare shin below in the face's team skin). HARPOONER_PANTS: the Flintlock's PIRATE_PANTS
 * cut in .beige, its cuff the beige times .cuff; the shin and thigh meshes take the head's team-skin material so the calf shows bare under the cuff.
 */
const HARPOONER_PANTS = { beige: new Color3(0.5, 0.43, 0.33), cuff: 0.82 };

export function harpoonerPants(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = HARPOONER_PANTS;
  const skin = body.headMesh.material;
  if (skin) for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) if (leg) leg.material = skin;
  return piratePants(scene, body, P.beige, P.cuff);
}

/*
 * [S] 432 the Captain's pants and boots (CONFIRM 431 a.1: "legs dark team blue from coat hem to feet - TABS: beige pants between the coat tails, ending in
 * black knee boots"; pirate.captain.blue.png, card Appearance "beige pants, black boots": straight tan trousers from the waist down between the coat's
 * skirts to just below the knee, tucked into tall black boots whose wide turned top stands out round the shin under the knee, the boot running down
 * into a black shoe with a small brass buckle at the instep). CAPTAIN_LEGS: over each thigh a six-sided tan shell .thigh of the limb, top to knee, and on
 * the shin down to .pantsTo; the boot a black shell .boot of the shin from .bootFrom to its foot, its top a wider ring .cuffOut, .cuff of the shin tall;
 * the foot mesh black, a brass buckle .buckle of the foot's width on its front. Self-lit .glow.
 */
const CAPTAIN_LEGS = {
  thigh: 1.45, pantsTo: 0.3, shin: 1.38, bootFrom: 0.2, boot: 1.5, cuff: 0.2, cuffOut: 1.85, buckle: 0.45,
  tan: new Color3(0.62, 0.42, 0.24), black: new Color3(0.05, 0.05, 0.06), brass: new Color3(0.8, 0.6, 0.25), glow: 0.12,
};

export function captainLegs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CAPTAIN_LEGS;
  const mf = getMaterialFactory();
  const tan = mf.get("cloth", C.tan, { emissive: C.tan.scale(C.glow) });
  const black = mf.get("cloth", C.black, { emissive: C.black.scale(C.glow) });
  const brass = mf.get("cloth", C.brass, { emissive: C.brass.scale(C.glow) });
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) if (thigh) out.push(limbShell(scene, "captainPantsThigh", thigh, 0, 1, C.thigh, tan));
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    if (!shin) continue;
    out.push(limbShell(scene, "captainPantsShin", shin, 0, C.pantsTo, C.shin, tan));
    out.push(limbShell(scene, "captainBoot", shin, C.bootFrom, 1, C.boot, black));
    out.push(limbShell(scene, "captainBootTop", shin, C.bootFrom, C.bootFrom + C.cuff, C.cuffOut, black));
  }
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) {
      if (!(foot instanceof Mesh) || !/_[lr]FootM$/.test(foot.name)) continue;
      foot.material = black;
      const fb = foot.getBoundingInfo().boundingBox, ex = fb.extendSize;
      const buckle = MeshBuilder.CreateBox("captainBootBuckle", { width: ex.x * 2 * C.buckle, height: ex.y * 2 * 0.22, depth: ex.z * 0.12 }, scene);
      buckle.parent = foot;
      buckle.position.set(fb.center.x, fb.minimum.y + ex.y * 2 * 0.42, fb.maximum.z + ex.z * 0.02);
      buckle.material = brass;
      buckle.convertToFlatShadedMesh();
      out.push(buckle);
    }
  }
  return out;
}

const BLUNDERBUSS_HAIR = { top: 0.95, drop: -1.55, side: 0.3, cap: 1.1, color: new Color3(0.28, 0.135, 0.09) };

/** The Blunderbuss's dark-brown bob under the plank hat (spec at BLUNDERBUSS_HAIR). */
export function blunderbussHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = BLUNDERBUSS_HAIR;
  const out = pirateHair(scene, body, B.color, { top: B.top, drop: B.drop, side: B.side });
  const bb = body.headMesh.getBoundingInfo().boundingBox, e = bb.extendSize, c = bb.center;
  const from = c.y + e.y * B.top - e.y * 0.3, to = bb.maximum.y - e.y * 2 * PLANK_HAT.sit + e.y * 0.06;
  const cap = MeshBuilder.CreateBox("blunderbussHairCap", { width: e.x * 2 * B.cap, height: to - from, depth: e.z * 2 * B.cap }, scene);
  cap.parent = body.headMesh;
  cap.position.set(c.x, (from + to) / 2, c.z - e.z * 0.04);
  cap.material = out[0].material;
  cap.convertToFlatShadedMesh();
  out.push(cap);
  return out;
}

/*
 * [S] 430 the Harpooner's beard (audit 422 harpooner a.2: "the chin - bare - TABS: a thick dark-brown beard under the eyes"; pirate.harpooner.red.png,
 * card Appearance "a fairly thick beard": a short full dark-brown beard from just under the bead eyes round the jaw and chin, wider than the face and
 * standing out of it, joined to sideburns up the cheeks under the hat, the open mouth a dark notch in its front). PIRATE_BEARD, in the head's own box
 * (e its half sizes): a faceted jaw mass .jaw[0] of e.x across and .jaw[2] of e.z deep, from .under of e.y below the eyes' bottom down to .foot of e.y
 * under the head's middle, sat .ahead of e.z forward; up each cheek a sideburn .burn of e.x thick from the eyes' top to the jaw's middle, from .burnBack
 * to .burnFront of e.z; on its front a mouth notch .mouth of e.x across, .mouthTall of e.y, in .mouthColor. Dark brown self-lit .glow.
 */
const PIRATE_BEARD = {
  jaw: [1.14, 0, 0.72] as const, under: 0.06, foot: -1.38, ahead: 0.46, burn: 0.22, burnBack: -0.35, burnFront: 0.62, mouth: 0.42, mouthTall: 0.16,
  color: new Color3(0.18, 0.09, 0.06), mouthColor: new Color3(0.45, 0.08, 0.06), glow: 0.14,
};

/** A short full dark-brown beard round the jaw under the eyes, with sideburns and a mouth notch (spec at PIRATE_BEARD). */
export function pirateBeard(scene: Scene, body: ArticulatedBody, color: Color3 = PIRATE_BEARD.color): Mesh[] {
  const B = PIRATE_BEARD;
  const mf = getMaterialFactory();
  const hair = mf.get("cloth", color, { emissive: color.scale(B.glow) });
  const mouthMat = mf.get("cloth", B.mouthColor, { emissive: B.mouthColor.scale(B.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const span = eyeSpanInHead(body) ?? [c.y - e.y * 0.2, c.y + e.y * 0.3];
  const out: Mesh[] = [];
  const put = (m: Mesh, mat = hair): Mesh => {
    m.parent = head;
    m.material = mat;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  const top = span[0] - e.y * B.under, foot = c.y + e.y * B.foot;
  const jawZ = c.z + e.z * B.ahead, jawD = e.z * 2 * B.jaw[2];
  const jaw = put(MeshBuilder.CreateIcoSphere("pirateBeard", { radius: 1, subdivisions: 1, flat: true }, scene));
  jaw.scaling.set(e.x * B.jaw[0], (top - foot) / 2, jawD / 2);
  jaw.position.set(c.x, (top + foot) / 2, jawZ);
  for (const side of [-1, 1]) {
    const y1 = span[1], y0 = (top + foot) / 2;
    const z0 = c.z + e.z * B.burnBack, z1 = c.z + e.z * B.burnFront;
    const burn = put(MeshBuilder.CreateBox("pirateBeardBurn", { width: e.x * B.burn, height: y1 - y0, depth: z1 - z0 }, scene));
    burn.position.set(c.x + side * (e.x + e.x * B.burn * 0.3), (y0 + y1) / 2, (z0 + z1) / 2);
  }
  // the mouth: a dark notch in the beard's front, just under the eyes
  const mouthY = top - e.y * B.mouthTall * 1.3;
  const mouth = put(MeshBuilder.CreateBox("pirateBeardMouth", { width: e.x * B.mouth, height: e.y * B.mouthTall, depth: e.z * 0.1 }, scene), mouthMat);
  mouth.position.set(c.x, mouthY, jawZ + jawD / 2 * 0.93);
  return out;
}

/*
 * [S] 431 the Captain's long beard (audit 422 captain a.4: "the chin - dark hair hangs beside the face but the chin is bare - TABS: a long brown beard
 * with a moustache under the eyes"; pirate.captain.red.png, card "long, brown beard": a mid-brown beard from under the eyes round the jaw, hanging past
 * the chin over the collar onto the top of the chest, a broad moustache bar across the face just under the eyes). CAPTAIN_BEARD: PIRATE_BEARD's jaw,
 * sideburns and mouth in .color; across the face over the mouth a moustache slab .tash of e.x across and .tashTall of e.y tall, .tashAhead of e.z
 * proud of the jaw's front, drooping .droop rad at each end; the run onto the chest a faceted torso-parented lump (a head-hung piece sinks into the
 * chest box) .run[0] of the trunk's width across, .run[1] of its height down from its top, .run[2] of its depth deep, standing .proud of the depth off
 * its front.
 */
const CAPTAIN_BEARD = { tash: 1.15, tashTall: 0.2, tashAhead: 0.1, droop: 0.22, run: [0.46, 0.42, 0.34] as const, proud: 0.3, color: new Color3(0.4, 0.2, 0.12) };

/** The Captain's long brown beard with a moustache, run down onto his chest (spec at CAPTAIN_BEARD). */
export function captainBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = CAPTAIN_BEARD, B = PIRATE_BEARD;
  const out = pirateBeard(scene, body, C.color);
  const hair = out[0].material;
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const span = eyeSpanInHead(body) ?? [c.y - e.y * 0.2, c.y + e.y * 0.3];
  const front = c.z + e.z * B.ahead + e.z * B.jaw[2];
  for (const side of [-1, 1]) {
    const half = MeshBuilder.CreateBox("captainTash", { width: e.x * C.tash * 0.5, height: e.y * C.tashTall, depth: e.z * 0.22 }, scene);
    half.parent = head;
    half.position.set(c.x + side * e.x * C.tash * 0.25, span[0] - e.y * (B.under + C.tashTall * 0.55), front + e.z * C.tashAhead);
    half.rotation.z = -side * C.droop;
    half.material = hair;
    half.convertToFlatShadedMesh();
    out.push(half);
  }
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const run = MeshBuilder.CreateIcoSphere("captainBeardRun", { radius: 1, subdivisions: 1, flat: true }, scene);
  run.parent = tm.parent;
  run.scaling.set(W * C.run[0] / 2, H * C.run[1] / 2, D * C.run[2] / 2);
  // centred on the trunk's top edge so it runs up into the chin's beard (one lower on the chest floated apart from it, 431 look)
  run.position.set(cx, cy + H / 2 - H * C.run[1] * 0.05, cz + D / 2 + D * C.proud);
  run.material = hair;
  out.push(run);
  return out;
}

/*
 * [S] 430 the Pirate Queen's beaded locks (audit 422 queen a.2: "the sides of the head - bare - TABS: long black curly locks with beads hanging to the
 * shoulders"; pirate.pirate_queen.red.png, card Appearance "curly long hair with hair beads": thick black locks from under the bandana either side of
 * the face down past the jaw onto the shoulders, a few tan beads strung in them). QUEEN_HAIR: pirateHair's locks and back fall in near-black, the locks
 * .side of e.x thick and dropping to .drop; on each lock's outer face .curls faceted lumps .curl of e.x across stepping down it, alternately in and out
 * (the curls), and .beads tan beads .bead of e.x across at the lumps' joins. Black and tan self-lit PIRATE_HAIR.glow.
 */
const QUEEN_HAIR = { side: 0.36, drop: -2.0, splay: 0.16, curls: 4, curl: 0.42, beads: 3, bead: 0.18, black: new Color3(0.03, 0.03, 0.035), tan: new Color3(0.8, 0.6, 0.35) };

/** The Pirate Queen's long black curly locks with tan beads (spec at QUEEN_HAIR). */
export function queenHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const Q = QUEEN_HAIR;
  const out = pirateHair(scene, body, Q.black, { side: Q.side, drop: Q.drop, splay: Q.splay });
  const mf = getMaterialFactory();
  const black = mf.get("cloth", Q.black, { emissive: Q.black.scale(PIRATE_HAIR.glow) });
  const tan = mf.get("cloth", Q.tan, { emissive: Q.tan.scale(PIRATE_HAIR.glow) });
  const locks = out.filter((m) => m.name === "pirateHairLock");
  for (const lock of locks) {
    const lb = lock.getBoundingInfo().boundingBox, le = lb.extendSize;
    const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
    const sideSign = Math.sign(lock.position.x - body.headMesh.getBoundingInfo().boundingBox.center.x) || 1;
    for (let i = 0; i < Q.curls; i++) {
      const y = le.y - (le.y * 2) * ((i + 0.5) / Q.curls);
      const lump = MeshBuilder.CreateIcoSphere("queenHairCurl", { radius: e.x * Q.curl / 2, subdivisions: 1, flat: true }, scene);
      lump.parent = lock;
      lump.position.set(sideSign * (le.x * (i % 2 ? 0.7 : 1.0)), y, (i % 2 ? -0.3 : 0.2) * le.z);
      lump.material = black;
      out.push(lump);
      if (i > 0 && i <= Q.beads) {
        const bead = MeshBuilder.CreateIcoSphere("queenHairBead", { radius: e.x * Q.bead / 2, subdivisions: 1, flat: true }, scene);
        bead.parent = lock;
        bead.position.set(sideSign * (le.x + e.x * Q.curl * 0.3), y + (le.y * 2) / Q.curls * 0.5, le.z * 0.4);
        bead.material = tan;
        out.push(bead);
      }
    }
  }
  return out;
}

/*
 * [S] 430 the Captain's two parrots (audit 422 captain a.2: "the hat's crown - bare - TABS: two parrots, one blue and one red, perched on it";
 * pirate.captain.red.png, card Appearance "two parrots": on the black tricorn's two front corners, either side of the skull plate, a blue parrot over
 * his right eye and a red one over his left, each about as tall as the hat's crown is wide: an upright egg body, a round head with a pale hooked beak
 * and white bead eyes, a long tail sloping down behind, an orange-yellow chest on the blue bird and a pale face on the red). CAPTAIN_PARROTS, in the hat's
 * crown frame (the "tricornCrown" mesh, +z his front, its half width h): each bird stands at (.x h either side, .y h up, .z h ahead) scaled .size h,
 * turned .turn rad out; body (.body), head (.head) at .headY, beak .beak, eyes, tail .tail long leaning .tailLean. Cloth self-lit .glow.
 */
const CAPTAIN_PARROTS = {
  x: 1.15, y: 0.55, z: 0.35, size: 1.0, turn: 0.35, body: [0.32, 0.5, 0.34] as const, head: 0.27, headY: 1.05, beak: 0.16, tail: 0.75, tailLean: 0.45, glow: 0.2,
  blue: new Color3(0.08, 0.2, 0.9), chest: new Color3(1, 0.55, 0.08), red: new Color3(0.9, 0.06, 0.04), face: new Color3(0.85, 0.83, 0.8),
  beakColor: new Color3(0.2, 0.19, 0.2), white: new Color3(0.95, 0.94, 0.9), black: new Color3(0.03, 0.03, 0.035),
};

/** Two parrots, blue and red, perched on the front corners of the Captain's tricorn (spec at CAPTAIN_PARROTS). */
export function captainParrots(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = CAPTAIN_PARROTS;
  const crown = body.root.getChildMeshes(false).find((m) => m.name === "tricornCrown") as Mesh | undefined;
  if (!crown) return [];
  const mf = getMaterialFactory();
  const m = (c: Color3) => mf.get("cloth", c, { emissive: c.scale(P.glow) });
  const h = crown.getBoundingInfo().boundingBox.extendSize.x;
  const out: Mesh[] = [];
  const birds = [
    { side: 1, color: P.blue, patch: P.chest, patchFace: false },
    { side: -1, color: P.red, patch: P.face, patchFace: true },
  ];
  for (const b of birds) {
    const s = h * P.size;
    const pivot = new TransformNode("captainParrot", scene);
    pivot.parent = crown;
    pivot.position.set(b.side * h * P.x, h * P.y, h * P.z);
    pivot.rotation.y = b.side * P.turn;
    const put = (mesh: Mesh, mat: ReturnType<typeof m>): Mesh => {
      mesh.parent = pivot;
      mesh.material = mat;
      mesh.convertToFlatShadedMesh();
      out.push(mesh);
      return mesh;
    };
    const feathers = m(b.color);
    const bodyM = put(MeshBuilder.CreateIcoSphere("captainParrotBody", { radius: 1, subdivisions: 1, flat: true }, scene), feathers);
    bodyM.scaling.set(s * P.body[0], s * P.body[1], s * P.body[2]);
    bodyM.position.y = s * P.body[1];
    bodyM.rotation.x = -0.15;
    const headM = put(MeshBuilder.CreateIcoSphere("captainParrotHead", { radius: s * P.head, subdivisions: 1, flat: true }, scene), feathers);
    headM.position.set(0, s * P.headY, s * 0.04);
    // the chest (blue bird) or the face (red bird) in the second colour
    const patch = put(MeshBuilder.CreateIcoSphere("captainParrotPatch", { radius: 1, subdivisions: 1, flat: true }, scene), m(b.patch));
    if (b.patchFace) {
      patch.scaling.set(s * P.head * 0.8, s * P.head * 0.7, s * P.head * 0.5);
      patch.position.set(0, s * P.headY, s * (0.04 + P.head * 0.6));
    } else {
      patch.scaling.set(s * P.body[0] * 0.75, s * P.body[1] * 0.7, s * P.body[2] * 0.5);
      patch.position.set(0, s * P.body[1] * 1.05, s * P.body[2] * 0.62);
    }
    const beak = put(MeshBuilder.CreateCylinder("captainParrotBeak", { height: s * P.beak * 2, diameterTop: s * P.beak * 1.3, diameterBottom: 0, tessellation: 4 }, scene), m(P.beakColor));
    beak.position.set(0, s * (P.headY - 0.08), s * (0.04 + P.head * 1.05));
    beak.rotation.x = 2.4;
    for (const ex of [-1, 1]) {
      const eye = put(MeshBuilder.CreateIcoSphere("captainParrotEye", { radius: s * 0.085, subdivisions: 1, flat: true }, scene), m(P.white));
      eye.position.set(ex * s * P.head * 0.75, s * (P.headY + 0.06), s * (0.04 + P.head * 0.55));
      const pupil = put(MeshBuilder.CreateIcoSphere("captainParrotPupil", { radius: s * 0.04, subdivisions: 1, flat: true }, scene), m(P.black));
      pupil.position.set(ex * s * P.head * 0.86, s * (P.headY + 0.06), s * (0.04 + P.head * 0.66));
    }
    const tail = put(MeshBuilder.CreateBox("captainParrotTail", { width: s * 0.22, height: s * P.tail, depth: s * 0.06 }, scene), feathers);
    tail.setPivotPoint(new Vector3(0, s * P.tail / 2, 0));
    tail.position.set(0, s * (P.body[1] * 0.6 - P.tail / 2), -s * P.body[2] * 0.8);
    tail.rotation.x = -P.tailLean;
  }
  return out;
}

/*
 * [S] 429 the striped socks (audit 422 bomb_thrower a.3: "the shins - bare - TABS: team-and-grey ringed socks from the knee down to brown shoes";
 * pirate.bomb_thrower.red.png: below a bare knee a grey turned-down top, then the sock ringed in even team and grey bands down into the shoe, a little
 * proud of the shin). PIRATE_SOCKS, on each lower leg (share of its length from the knee): the turned top a grey ring from .from to .top, .topOut of the
 * shin across; under it .bands rings to .to, .out across, alternating the team times .shade and grey from the top. Self-lit .glow.
 */
const PIRATE_SOCKS = { from: 0.22, top: 0.34, topOut: 1.5, bands: 6, to: 0.98, out: 1.3, shade: 0.8, grey: new Color3(0.5, 0.49, 0.47), glow: 0.12 };

/*
 * [S] 430 the Flintlock's plain socks (audit 422 flintlock a.3: "the shins - bare - TABS: grey socks between the pant cuff and brown shoes";
 * pirate.flintlock.blue.png: under the turned pant cuff a plain warm-grey sock down into the shoe, no rings). PLAIN_SOCKS: one shell from .from of the
 * shin (up inside the pant cuff, which ends at PIRATE_PANTS.to) to PIRATE_SOCKS.to, .out of the shin across, in .grey self-lit PIRATE_SOCKS.glow.
 */
const PLAIN_SOCKS = { from: 0.46, out: 1.24, grey: new Color3(0.45, 0.4, 0.34) };

/** Ringed team-and-grey socks from below the knee into the shoe (spec at PIRATE_SOCKS); `plain` gives the Flintlock's one grey sock (PLAIN_SOCKS). */
export function pirateSocks(scene: Scene, body: ArticulatedBody, teamColor: Color3, plain?: typeof PLAIN_SOCKS): Mesh[] {
  const S = PIRATE_SOCKS;
  const mf = getMaterialFactory();
  const plainGrey = plain ? mf.get("cloth", plain.grey, { emissive: plain.grey.scale(S.glow) }) : undefined;
  const grey = mf.get("cloth", S.grey, { emissive: S.grey.scale(S.glow) });
  const stripe = teamColor.scale(S.shade);
  const team = mf.get("cloth", stripe, { emissive: stripe.scale(S.glow) });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    if (plain) {
      out.push(limbShell(scene, "pirateSock", shin, plain.from, S.to, plain.out, plainGrey!));
      continue;
    }
    out.push(limbShell(scene, "pirateSockTop", shin, S.from, S.top, S.topOut, grey));
    const step = (S.to - S.top) / S.bands;
    for (let i = 0; i < S.bands; i++) {
      out.push(limbShell(scene, "pirateSockBand", shin, S.top + step * i, S.top + step * (i + 1), S.out, i % 2 ? grey : team));
    }
  }
  return out;
}

/** The Flintlock's plain warm-grey socks from inside the pant cuff into the shoe (spec at PLAIN_SOCKS). */
export function flintlockSocks(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  return pirateSocks(scene, body, teamColor, PLAIN_SOCKS);
}

/*
 * [S] 429 the cannon rider's bandanna (CONFIRM 428 cannon a.1: "a flat-topped peaked cap with a jutting front brim, like a kepi - TABS: a brimless,
 * rounded, team-coloured bandanna skullcap snug on the head"; pirate.cannon.blue.png: a dark-team cloth dome over the crown from just above the bead
 * eyes, no brim, a small knot at the back). CANNON_BANDANNA, in the head's own box (e its half sizes): a faceted half dome .out of the head across and
 * deep, its rim .clear over the eyes' top and its crown .rise of e.y over the head's top, sat .back of e.z behind the middle; a knot .knot of e.y
 * across at the back of the rim. Team times .shade, self-lit .glow. Replaces dressCannonCrew's cap and peak on the pirate cannon.
 */
const CANNON_BANDANNA = { out: 1.22, clear: 0.05, rise: 0.12, back: 0.04, knot: 0.32, segments: 6, shade: 0.8, glow: 0.12 };

/** A brimless team cloth dome over the crown with a knot at the back (spec at CANNON_BANDANNA). */
export function cannonBandanna(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const B = CANNON_BANDANNA;
  const shade = teamColor.scale(B.shade);
  const cloth = getMaterialFactory().get("cloth", shade, { emissive: shade.scale(B.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const span = eyeSpanInHead(body) ?? [c.y - e.y * 0.2, c.y + e.y * 0.3];
  const rim = span[1] + e.y * B.clear, crown = c.y + e.y * (1 + B.rise);
  const out: Mesh[] = [];
  // the upper half of a squashed sphere, its equator on the rim
  const dome = MeshBuilder.CreateSphere("cannonBandanna", { diameterX: e.x * 2 * B.out, diameterY: (crown - rim) * 2, diameterZ: e.z * 2 * B.out, segments: B.segments, slice: 0.5 }, scene);
  dome.parent = head;
  dome.position.set(c.x, rim, c.z - e.z * B.back);
  dome.material = cloth;
  dome.convertToFlatShadedMesh();
  out.push(dome);
  const knot = MeshBuilder.CreateBox("cannonBandannaKnot", { width: e.y * B.knot * 1.3, height: e.y * B.knot, depth: e.y * B.knot * 0.8 }, scene);
  knot.parent = head;
  knot.position.set(c.x, rim + e.y * B.knot * 0.3, c.z - e.z * B.out - e.z * B.back - e.y * B.knot * 0.2);
  knot.material = cloth;
  knot.convertToFlatShadedMesh();
  out.push(knot);
  return out;
}
