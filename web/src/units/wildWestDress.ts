import { Scene, Color3, Matrix, Mesh, MeshBuilder, Quaternion, TransformNode, Vector3, VertexBuffer, type Material, type Node } from "@babylonjs/core";
import { getMaterialFactory } from "./materialFactory";
import type { ArticulatedBody } from "./bodyBuilder";
import { limbBox, limbShell } from "./medievalDress";
import { eyeSpanInHead } from "./dynastyDress";

/*
 * Wild West dress (units/wild_west.*): per-unit hats, cloth, hair and ornaments. Sized off the body's own joints and meshes.
 */

/*
 * [S] 445 the Gunslinger's bowler (audit 444 a.1: "brown wide flat-brim hat with band - TABS: dark team bowler, round crown, narrow brim";
 * wild_west.gunslinger.red.png: a deep team-coloured felt hat, its crown about a head and a fifth across with near-straight sides a little wider at
 * the top, a round dome on it; a short brim about 1.6 heads across, curled up at both sides). BOWLER, in the head's width W and height H: crown .crown W
 * across at the seat, .flare of that at the top, standing from the seat to .tall H over the head top; dome .dome H high; brim .brim W across, .thick H,
 * its sides curled up .curl H at the rim; a band .band H tall just above the brim; felt the team colour times .shade, the band times .bandShade.
 */
const BOWLER = { sides: 12, crown: 1.14, flare: 1.06, tall: 0.18, dome: 0.32, brim: 1.62, thick: 0.035, curl: 0.12, band: 0.08, shade: 0.25, bandShade: 0.12 };

/**
 * The bowler (spec at BOWLER), in the hat's own units (`unit` per metre of the neck frame). `seat` is the hat's seat (negative: under the head
 * top, just over the eyes); returns the crown, seated there.
 */
export function buildBowler(scene: Scene, W: number, H: number, seat: number, unit: number, teamColor?: Color3): Mesh {
  const B = BOWLER;
  const u = (v: number) => v / unit;
  const team = teamColor ?? new Color3(0.3, 0.3, 0.35);
  const mats = getMaterialFactory();
  const felt = mats.get("cloth", team.scale(B.shade), { emissive: team.scale(B.shade * 0.12) });
  const dark = mats.get("cloth", team.scale(B.bandShade), {});
  // from the seat (under the head top) to .tall H over it
  const tall = -seat + B.tall * H;
  const crownD = B.crown * W;
  const crown = MeshBuilder.CreateCylinder("bowlerCrown", { height: u(tall), diameterBottom: u(crownD), diameterTop: u(crownD * B.flare), tessellation: B.sides }, scene);
  crown.position.y = u(seat + tall * 0.5);
  crown.material = felt;
  crown.convertToFlatShadedMesh();
  // The round dome on the crown, its lower half inside it
  const dome = MeshBuilder.CreateSphere("bowlerDome", { diameter: u(crownD * B.flare), segments: 6 }, scene);
  dome.scaling.y = (2 * B.dome * H) / (crownD * B.flare);
  dome.position.y = u(tall * 0.5);
  dome.material = felt;
  dome.convertToFlatShadedMesh();
  dome.parent = crown;
  // The short brim, its sides curled up toward the rim
  const brimR = B.brim * W * 0.5;
  const brim = MeshBuilder.CreateCylinder("bowlerBrim", { height: u(B.thick * H), diameter: u(2 * brimR), tessellation: 16, subdivisions: 1 }, scene);
  const pos = brim.getVerticesData(VertexBuffer.PositionKind);
  if (pos) {
    for (let i = 0; i < pos.length; i += 3) {
      const r = Math.hypot(pos[i], pos[i + 2]) / u(brimR);
      const side = Math.abs(pos[i]) / (Math.hypot(pos[i], pos[i + 2]) || 1);
      pos[i + 1] += u(B.curl * H) * r * r * side * side;
    }
    brim.updateVerticesData(VertexBuffer.PositionKind, pos);
  }
  brim.refreshBoundingInfo();
  brim.position.y = u(-tall * 0.5 + B.thick * H * 0.5);
  brim.material = felt;
  brim.convertToFlatShadedMesh();
  brim.parent = crown;
  // The dark band round the crown's foot
  const band = MeshBuilder.CreateCylinder("bowlerBand", { height: u(B.band * H), diameter: u(crownD * 1.03), tessellation: B.sides }, scene);
  band.position.y = u(-tall * 0.5 + B.thick * H + B.band * H * 0.5);
  band.material = dark;
  band.convertToFlatShadedMesh();
  band.parent = crown;
  return crown;
}

/*
 * [S] 447 the Quick Draw's hat (critic 446 quick_draw a.1: "black top hat with a yellow disc badge - TABS: team flat-crown wide-brim hat with a black
 * band"; wild_west.quick_draw.red.png: a team-coloured felt hat, its crown about a head across with straight sides and a flat top, standing about half
 * a head over the eyes; a flat brim a little over two heads across; a black band at the crown's foot). FLAT_HAT, in the head's width W and height H:
 * crown .crown W across, .flare of that at the top, from the seat to .tall H over the head top (under .3, so the capture keeps its framing); brim .brim
 * W across, .thick H; band .band H tall over the brim; felt the team colour times .shade, self-lit .glow; band near black.
 */
const FLAT_HAT = { sides: 10, crown: 1.12, flare: 0.94, tall: 0.24, brim: 2.15, thick: 0.04, band: 0.1, shade: 0.85, glow: 0.12, bandColor: new Color3(0.03, 0.03, 0.035) };

/** The flat-crown wide-brim hat (spec at FLAT_HAT), in the hat's units; `seat` under the head top. Returns the crown. */
export function buildFlatHat(scene: Scene, W: number, H: number, seat: number, unit: number, teamColor?: Color3): Mesh {
  const F = FLAT_HAT;
  const u = (v: number) => v / unit;
  const team = (teamColor ?? new Color3(0.5, 0.5, 0.55)).scale(F.shade);
  const mats = getMaterialFactory();
  const felt = mats.get("cloth", team, { emissive: team.scale(F.glow) });
  const dark = mats.get("cloth", F.bandColor, {});
  const tall = -seat + F.tall * H;
  const crownD = F.crown * W;
  const crown = MeshBuilder.CreateCylinder("flatHatCrown", { height: u(tall), diameterBottom: u(crownD), diameterTop: u(crownD * F.flare), tessellation: F.sides }, scene);
  crown.position.y = u(seat + tall * 0.5);
  crown.material = felt;
  crown.convertToFlatShadedMesh();
  const brim = MeshBuilder.CreateCylinder("flatHatBrim", { height: u(F.thick * H), diameter: u(F.brim * W), tessellation: 16 }, scene);
  brim.position.y = u(-tall * 0.5 + F.thick * H * 0.5);
  brim.material = felt;
  brim.convertToFlatShadedMesh();
  brim.parent = crown;
  const band = MeshBuilder.CreateCylinder("flatHatBand", { height: u(F.band * H), diameter: u(crownD * 1.03), tessellation: F.sides }, scene);
  band.position.y = u(-tall * 0.5 + F.thick * H + F.band * H * 0.5);
  band.material = dark;
  band.convertToFlatShadedMesh();
  band.parent = crown;
  return crown;
}

/*
 * [S] 449 the peaked hat of the Deadeye and the Dynamite Thrower (audit 444 deadeye a.1: "brown tall-crown wide-brim hat - TABS: team peaked conical
 * hat"; dynamite_thrower a.1: "black-brown tall flat-crown hat, gold band, brim three heads wide - TABS: team low peaked/conical hat with a turned-down
 * brim"; wild_west.deadeye.red.png, wild_west.dynamite_thrower.red.png: a team-coloured felt hat, a low faceted crown rising to a blunt peak, its brim a
 * wide lampshade sloping down and out all round, about two and a quarter heads across). PEAK_HAT in the head's W and H: the brim a .sides-sided
 * frustum from .crown W across at the seat out and down to .brim W across, .slope H lower; on it the crown from .crown W across up to .peak of that at
 * its top, .tall H over the head top (under .3 of the unit height). Team colour times .shade, self-lit .glow.
 */
const PEAK_HAT = { sides: 8, crown: 1.12, brim: 2.25, slope: 0.3, peak: 0.22, tall: 0.6, shade: 0.9, glow: 0.12 };

/** The team peaked hat with a sloped lampshade brim (spec at PEAK_HAT), in the hat's units; `seat` under the head top. Returns the brim. */
export function buildPeakHat(scene: Scene, W: number, H: number, seat: number, unit: number, teamColor?: Color3): Mesh {
  const P = PEAK_HAT;
  const u = (v: number) => v / unit;
  const team = (teamColor ?? new Color3(0.5, 0.5, 0.55)).scale(P.shade);
  const felt = getMaterialFactory().get("cloth", team, { emissive: team.scale(P.glow) });
  const brim = MeshBuilder.CreateCylinder("peakHatBrim", { height: u(P.slope * H), diameterTop: u(P.crown * W), diameterBottom: u(P.brim * W), tessellation: P.sides }, scene);
  brim.position.y = u(seat - P.slope * H * 0.5 + 0.04 * H);
  brim.material = felt;
  brim.convertToFlatShadedMesh();
  const tall = -seat + P.tall * H;
  const crown = MeshBuilder.CreateCylinder("peakHatCrown", { height: u(tall), diameterBottom: u(P.crown * W), diameterTop: u(P.crown * W * P.peak), tessellation: P.sides }, scene);
  crown.position.y = u(P.slope * H * 0.5 - 0.04 * H + tall * 0.5);
  crown.material = felt;
  crown.convertToFlatShadedMesh();
  crown.parent = brim;
  return brim;
}

/*
 * [S] 454 the Miner's hat (CONFIRM 452 miner a.1: "a rounded skullcap with a short front bill - TABS: a tall faceted team-colour crown with a wide brim
 * all round"; wild_west.miner.blue.png, .red.png: a team felt hat, its crown an 8-sided block taller than the head is above the eyes, narrowing a little
 * to a flat top and tipped back; the brim all round, sloping down and out like a shallow lampshade, about one and three quarter heads across; replaces
 * the 447 MINER_CAP dome and bill). MINER_HAT in the head's W and H: the brim a .sides frustum from .crown W across at the seat out and down to .brim W,
 * .slope H deep; the crown from .crown W at the seat to .top of that at its flat top, .tall H over the head top; the whole hat tipped back .tilt rad.
 * Team colour times .shade, self-lit .glow.
 */
const MINER_HAT = { sides: 8, crown: 1.2, brim: 1.85, slope: 0.16, top: 0.86, tall: 0.75, tilt: 0.14, shade: 0.9, glow: 0.12 };

/** The miner's tall team hat with a brim all round (spec at MINER_HAT), in the hat's units; `seat` under the head top. Returns the brim. */
export function buildMinerCap(scene: Scene, W: number, H: number, seat: number, unit: number, teamColor?: Color3): Mesh {
  const C = MINER_HAT;
  const u = (v: number) => v / unit;
  const team = (teamColor ?? new Color3(0.5, 0.5, 0.55)).scale(C.shade);
  const felt = getMaterialFactory().get("cloth", team, { emissive: team.scale(C.glow) });
  const brim = MeshBuilder.CreateCylinder("minerHatBrim", { height: u(C.slope * H), diameterTop: u(C.crown * W), diameterBottom: u(C.brim * W), tessellation: C.sides }, scene);
  brim.position.y = u(seat - C.slope * H * 0.5 + 0.04 * H);
  brim.rotation.x = -C.tilt;
  brim.material = felt;
  brim.convertToFlatShadedMesh();
  const tall = -seat + C.tall * H;
  const crown = MeshBuilder.CreateCylinder("minerHatCrown", { height: u(tall), diameterBottom: u(C.crown * W), diameterTop: u(C.crown * W * C.top), tessellation: C.sides }, scene);
  crown.position.y = u(C.slope * H * 0.5 - 0.04 * H + tall * 0.5);
  crown.material = felt;
  crown.convertToFlatShadedMesh();
  crown.parent = brim;
  return brim;
}

/*
 * [S] 445 the Lasso's thrown rope (audit 444 lasso c.1; wild_west.lasso.jpg: a tan rope from the rider's fist, a loop round the man). LASSO_ROPE: a rope
 * .thick m across, 1 long up +y from its root (the caller places, aims and stretches it), and a loop .loop m across at its end, .loopThick thick; tan rope.
 */
const LASSO_ROPE = { thick: 0.045, loop: 0.62, loopThick: 0.06, color: new Color3(0.55, 0.34, 0.13), glow: 0.15 };

/** The rope and its loop (spec at LASSO_ROPE): the rope 1 long up +y from the origin; the loop a ring the caller seats round the man's chest. */
export function lassoRope(scene: Scene): { rope: Mesh; loop: Mesh } {
  const R = LASSO_ROPE;
  const tan = getMaterialFactory().get("cloth", R.color, { emissive: R.color.scale(R.glow) });
  const rope = MeshBuilder.CreateCylinder("lassoRope", { height: 1, diameter: R.thick, tessellation: 6 }, scene);
  rope.position.y = 0.5;
  rope.bakeCurrentTransformIntoVertices();
  rope.material = tan;
  rope.isPickable = false;
  const loop = MeshBuilder.CreateTorus("lassoLoop", { diameter: R.loop, thickness: R.loopThick, tessellation: 14 }, scene);
  loop.material = tan;
  loop.isPickable = false;
  return { rope, loop };
}

/*
 * [S] 446 the Lasso's rope at the ready (critic 445 lasso b.1: "rein hand holds a short dark stick, grey loop at the horse's flank away from the hand -
 * TABS: coiled tan rope loop held up in the rider's hand"; wild_west.lasso.jpg, .red.png: a big open tan loop held up on his right, the rope running from
 * it down into his fist, where a few small coils hang). LASSO_COIL in the prop's units s (the fist at the origin, +y up the arm's line): a rope .rise
 * long up from the fist to the big loop, .loop across and .loopThick thick, standing on edge over the fist and tipped .tip rad back; .coils small
 * hanging coils .coil across round the fist, .coilStep apart. Tan LASSO_ROPE rope. Hidden while the thrown rope is out (simulationSystem _tryLasso).
 */
const LASSO_COIL = { rise: 0.14, loop: 0.3, loopThick: 0.026, tip: 0.35, coils: 3, coil: 0.15, coilThick: 0.022, coilStep: 0.025 };

/** The rope at the ready in the rider's fist (spec at LASSO_COIL): a node named "lassoCoil". */
export function lassoCoil(scene: Scene, s: number): Mesh {
  const C = LASSO_COIL, R = LASSO_ROPE;
  const tan = getMaterialFactory().get("cloth", R.color, { emissive: R.color.scale(R.glow) });
  const root = new Mesh("lassoCoil", scene);
  const rope = MeshBuilder.CreateCylinder("lassoCoilRope", { height: C.rise * s, diameter: C.loopThick * s, tessellation: 6 }, scene);
  rope.position.y = C.rise * s * 0.5;
  rope.material = tan;
  rope.parent = root;
  const loop = MeshBuilder.CreateTorus("lassoCoilLoop", { diameter: C.loop * s, thickness: C.loopThick * s, tessellation: 16 }, scene);
  loop.rotation.set(Math.PI / 2 - C.tip, 0, 0);
  loop.position.y = (C.rise + C.loop * 0.5) * s;
  loop.material = tan;
  loop.parent = root;
  for (let i = 0; i < C.coils; i++) {
    const coil = MeshBuilder.CreateTorus("lassoCoilRing", { diameter: (C.coil - i * 0.02) * s, thickness: C.coilThick * s, tessellation: 12 }, scene);
    coil.rotation.set(0, 0, Math.PI / 2);
    coil.position.set(i * C.coilStep * s, -C.coil * 0.42 * s, 0);
    coil.material = tan;
    coil.parent = root;
  }
  return root;
}

/*
 * [S] 446 the Gunslinger's suit jacket (critic 445 a.2: "short vest block, bare team arms - TABS: long-sleeved team suit jacket with lapels over a
 * buttoned waistcoat"; wild_west.gunslinger.red.png: the jacket's sleeves run from the shoulder to the wrist, a little loose, a beige shirt cuff showing
 * at each wrist; its fronts turn back in two broad lapels from the collar to mid-chest, a lighter shirt V between them; its skirts hang to mid-thigh).
 * GUNSLINGER_JACKET: sleeves in the jacket cloth (the body's own material, so they match the trunk) .upperOut of the upper arm round its whole length
 * and .lowerOut of the forearm round to .lowerTo of it; a beige cuff .cuff of the forearm long at its hand end, .cuffOut round. On the trunk (torso
 * frame, W H D its box): the shirt V a wedge .vee W across at the collar to a point .veeLong H down, .proud D off the front; each lapel a slab .lapel W
 * across and .lapelLong H long along the V's edge, .lapelProud D proud, leaning .lean rad in, the team colour x .lapelShade. The skirts are the tunic
 * skirt hung to .skirt of the knee's drop (unitFactory). Self-lit .glow.
 */
export const GUNSLINGER_JACKET = {
  upperOut: 1.4, lowerOut: 1.35, lowerTo: 0.86, cuff: 0.14, cuffOut: 1.25, skirt: 0.78, skirtFlare: 1.35,
  vee: 0.34, veeLong: 0.4, proud: 0.03, lapel: 0.13, lapelLong: 0.46, lapelProud: 0.06, lean: 0.32, lapelShade: 0.62,
  shirt: new Color3(0.78, 0.66, 0.46), glow: 0.12,
};

/*
 * [S] 449 the suit cloth (CONFIRM 448 a.1: "the coat, sleeves and coat skirts are tan/khaki and the red shows only on the legs and face - TABS: the whole
 * suit jacket is team red, the same tone as the trousers"): the faction tint and the warm-cloth hue shift turn red-team body cloth tan, so the trunk,
 * sleeves and coat skirts wear the team colour itself times GUNSLINGER_SUIT.shade, self-lit .glow.
 */
const GUNSLINGER_SUIT = { shade: 0.8, glow: 0.12 };

/** The Gunslinger's team suit cloth (spec at GUNSLINGER_SUIT); the factory caches it by colour, so the coat skirts share it. */
export function gunslingerSuit(teamColor: Color3): Material {
  const c = teamColor.scale(GUNSLINGER_SUIT.shade);
  return getMaterialFactory().get("cloth", c, { emissive: c.scale(GUNSLINGER_SUIT.glow) });
}

/** The Gunslinger's team suit jacket: full sleeves with beige cuffs, a shirt V and two lapels (spec at GUNSLINGER_JACKET). */
export function gunslingerJacket(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const J = GUNSLINGER_JACKET;
  const mf = getMaterialFactory();
  const cloth = gunslingerSuit(teamColor);
  for (const m of body.allMeshes) if (m.material === body.bodyMaterial) m.material = cloth;
  const shirt = mf.get("cloth", J.shirt, { emissive: J.shirt.scale(J.glow * 1.5) });
  const lapelColor = teamColor.scale(J.lapelShade);
  const lapelMat = mf.get("cloth", lapelColor, { emissive: lapelColor.scale(J.glow) });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    out.push(limbShell(scene, "gunslingerSleeve", arm, 0, 1, J.upperOut, cloth));
  }
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "gunslingerSleeve", arm, 0, J.lowerTo, J.lowerOut, cloth));
    out.push(limbShell(scene, "gunslingerCuff", arm, J.lowerTo - 0.02, J.lowerTo + J.cuff, J.cuffOut, shirt));
  }
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const front = cz + D / 2, topY = cy + H / 2;
  const place = (m: Mesh, x: number, y: number, z: number, rz: number): Mesh => {
    m.position.set(cx + x, y, z);
    m.rotation.copyFrom(tm.rotation);
    m.rotation.z += rz;
    m.parent = tm.parent;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  // the shirt V: a flat 4-sided frustum from the collar down to a point, on the jacket's front
  const veeLong = H * J.veeLong;
  const vee = MeshBuilder.CreateCylinder("gunslingerVee", { height: veeLong, diameterTop: W * J.vee * Math.SQRT2, diameterBottom: 0.002, tessellation: 4 }, scene);
  vee.rotation.y = Math.PI / 4;
  vee.bakeCurrentTransformIntoVertices();
  vee.scaling.z = (D * J.proud) / (W * J.vee);
  vee.material = shirt;
  place(vee, 0, topY - veeLong / 2, front + D * J.proud / 2, 0);
  // the lapels: darker team slabs along the V's edges, turned back from the collar to mid-chest
  const lapelLong = H * J.lapelLong;
  for (const side of [-1, 1]) {
    const lapel = MeshBuilder.CreateBox("gunslingerLapel", { width: W * J.lapel, height: lapelLong, depth: D * J.lapelProud }, scene);
    lapel.material = lapelMat;
    place(lapel, side * (W * J.vee / 4 + W * J.lapel * 0.35), topY - lapelLong / 2, front + D * J.lapelProud / 2, -side * J.lean);
  }
  // [S] 447 the tie (spec at GUNSLINGER_TIE)
  const T = GUNSLINGER_TIE;
  const tieMat = mf.get("cloth", T.color, { emissive: T.color.scale(T.glow) });
  const knot = MeshBuilder.CreateBox("gunslingerTieKnot", { width: W * T.knot, height: H * T.knotTall, depth: D * T.proud }, scene);
  knot.material = tieMat;
  place(knot, 0, topY - H * T.knotTall / 2, front + D * (J.proud + T.proud / 2), 0);
  const blade = MeshBuilder.CreateCylinder("gunslingerTie", { height: H * T.long, diameterTop: W * T.top * Math.SQRT2, diameterBottom: W * T.foot * Math.SQRT2, tessellation: 4 }, scene);
  blade.rotation.y = Math.PI / 4;
  blade.bakeCurrentTransformIntoVertices();
  blade.scaling.z = (D * T.proud * 0.8) / (W * T.foot);
  blade.material = tieMat;
  place(blade, 0, topY - H * T.knotTall - H * T.long / 2, front + D * (J.proud + T.proud * 0.4), 0);
  return out;
}

/*
 * [S] 447 the Gunslinger's tie (critic 446 a.3: "tie: none - TABS: wide purple tie at the throat"; card Appearance; wild_west.gunslinger.red.png: a
 * broad violet cravat from the collar down the shirt V to about the jacket's top button, as wide as the V at the top, a fat knot at the throat).
 * GUNSLINGER_TIE, in the trunk's box W H D: a knot .knot W across and .knotTall H tall at the collar; a blade .top W across under it widening to .foot
 * W at its end .long H down; both .proud D off the shirt V; violet cloth (palette purple x .7), self-lit .glow.
 */
const GUNSLINGER_TIE = { knot: 0.17, knotTall: 0.07, top: 0.15, foot: 0.24, long: 0.32, proud: 0.06, color: new Color3(0.42, 0.14, 0.63), glow: 0.12 };

/*
 * [S] 448 the Quick Draw's shirt (critic 447 quick_draw a.2: "shirt: bare team arms - TABS: beige shirt with rolled-up sleeves"; card Appearance "a
 * beige shirt with rolled-up sleeves and a buttoned team color vest over it"; wild_west.quick_draw.red.png: loose beige sleeves from the shoulder to
 * just past the elbow, rolled into a fat cuff there, the bare forearm below; a beige collar V at the throat between the vest's fronts). QUICK_DRAW_SHIRT:
 * sleeves .upperOut of the upper arm round its length and .lowerOut of the forearm round to .lowerTo of it, a rolled cuff .cuffOut round from .cuffFrom
 * to .lowerTo; on the trunk (torso frame, W H D its box) a beige V .vee W across at the collar to a point .veeLong H down, .proud D off the front.
 * Beige cloth self-lit .glow (cream wants self-light to stay off grey).
 */
const QUICK_DRAW_SHIRT = { upperOut: 1.45, lowerOut: 1.4, lowerTo: 0.28, cuffFrom: 0.16, cuffOut: 1.75, vee: 0.4, veeLong: 0.34, proud: 0.03, color: new Color3(0.8, 0.68, 0.45), glow: 0.18 };

/** The Quick Draw's beige shirt: loose sleeves rolled up past the elbow and a collar V (spec at QUICK_DRAW_SHIRT). */
export function quickDrawShirt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = QUICK_DRAW_SHIRT;
  const shirt = getMaterialFactory().get("cloth", S.color, { emissive: S.color.scale(S.glow) });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "quickDrawSleeve", arm, 0, 1, S.upperOut, shirt));
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "quickDrawSleeve", arm, 0, S.lowerTo, S.lowerOut, shirt));
    out.push(limbShell(scene, "quickDrawCuff", arm, S.cuffFrom, S.lowerTo, S.cuffOut, shirt));
  }
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const veeLong = H * S.veeLong;
  const vee = MeshBuilder.CreateCylinder("quickDrawVee", { height: veeLong, diameterTop: W * S.vee * Math.SQRT2, diameterBottom: 0.002, tessellation: 4 }, scene);
  vee.rotation.y = Math.PI / 4;
  vee.bakeCurrentTransformIntoVertices();
  vee.scaling.z = (D * S.proud) / (W * S.vee);
  vee.material = shirt;
  vee.position.set(cx, cy + H / 2 - veeLong / 2, cz + D / 2 + D * S.proud / 2);
  vee.rotation.copyFrom(tm.rotation);
  vee.parent = tm.parent;
  vee.convertToFlatShadedMesh();
  out.push(vee);
  return out;
}

/*
 * [S] 451 the Deadeye's shirt (critic 448-449 deadeye a.2: "bare team arms under a dark vest block - TABS: puffy white long-sleeved shirt under a team V
 * vest"; wild_west.deadeye.red.png: billowing off-white sleeves from the shoulder to the wrist, fullest over the elbow and forearm, about three arms
 * across there, gathered into a narrower cuff at the wrist; an off-white collar standing in a deep V at the throat between the vest's fronts).
 * DEADEYE_SHIRT: sleeves .upperOut of the upper arm round its whole length, .lowerOut of the forearm round to .lowerTo of it, gathered to .cuffOut round
 * from .lowerTo to the wrist; on the trunk (torso frame, W H D its box) the V .vee W across at the collar to a point .veeLong H down, .proud D off the
 * front. Off-white cloth self-lit .glow (more than the Quick Draw's beige: a lit white sleeve in shade reads grey, LESSONS).
 */
const DEADEYE_SHIRT = { upperOut: 1.75, lowerOut: 1.95, lowerTo: 0.8, cuffOut: 1.35, vee: 0.46, veeLong: 0.4, proud: 0.03, color: new Color3(0.95, 0.9, 0.74), glow: 0.32 };

/** The Deadeye's off-white puffy shirt: full sleeves to the wrist and a collar V (spec at DEADEYE_SHIRT). */
export function deadeyeShirt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = DEADEYE_SHIRT;
  const shirt = getMaterialFactory().get("cloth", S.color, { emissive: S.color.scale(S.glow) });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "deadeyeSleeve", arm, 0, 1, S.upperOut, shirt));
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "deadeyeSleeve", arm, 0, S.lowerTo, S.lowerOut, shirt));
    out.push(limbShell(scene, "deadeyeCuff", arm, S.lowerTo - 0.02, 1, S.cuffOut, shirt));
  }
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const veeLong = H * S.veeLong;
  const vee = MeshBuilder.CreateCylinder("deadeyeVee", { height: veeLong, diameterTop: W * S.vee * Math.SQRT2, diameterBottom: 0.002, tessellation: 4 }, scene);
  vee.rotation.y = Math.PI / 4;
  vee.bakeCurrentTransformIntoVertices();
  vee.scaling.z = (D * S.proud) / (W * S.vee);
  vee.material = shirt;
  vee.position.set(cx, cy + H / 2 - veeLong / 2, cz + D / 2 + D * S.proud / 2);
  vee.rotation.copyFrom(tm.rotation);
  vee.parent = tm.parent;
  vee.convertToFlatShadedMesh();
  out.push(vee);
  return out;
}

/*
 * [S] 448 the Miner's overalls (critic 447 miner a.3: "overalls: dark team vest block, no braces - TABS: team overall trousers, two dark braces over a
 * lighter team shirt"; card Appearance "team colored overalls"; wild_west.miner.red.png: the trunk a lighter team shirt, two dark straps running
 * straight down its front and back from the shoulders into the waist of the team trousers, no tunic skirt; the trousers come up over the hips).
 * MINER_OVERALLS on the trunk (torso frame, W H D its box): the trunk and its shoulder yoke in the shirt (the team colour lifted .lift toward white);
 * a strap .strap W wide each side, .apart W from the middle, .proud D off the front and back, from the top to the foot; the trousers' waist a team band
 * .waist H tall round the trunk's foot, .over of its width and depth. Dark brown straps; all self-lit .glow. The tunic skirt is not hung (unitFactory).
 */
const MINER_OVERALLS = { lift: 0.35, strap: 0.1, apart: 0.22, proud: 0.04, waist: 0.22, over: 1.06, strapColor: new Color3(0.1, 0.06, 0.04), glow: 0.12 };

/** The Miner's lighter team shirt, two dark braces and the overall trousers' waist (spec at MINER_OVERALLS). */
export function minerOveralls(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const O = MINER_OVERALLS;
  const mf = getMaterialFactory();
  const shirtColor = Color3.Lerp(teamColor, new Color3(1, 1, 1), O.lift);
  const shirt = mf.get("cloth", shirtColor, { emissive: shirtColor.scale(O.glow) });
  const team = mf.get("cloth", teamColor, { emissive: teamColor.scale(O.glow) });
  const strap = mf.get("cloth", O.strapColor, { emissive: O.strapColor.scale(O.glow) });
  const tm = body.torsoMesh;
  tm.material = shirt;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke/.test(m.name) && m instanceof Mesh) m.material = shirt;
  const tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, y: number, z: number, mat: Material): void => {
    m.position.set(cx + x, y, z);
    m.rotation.copyFrom(tm.rotation);
    m.material = mat;
    m.parent = tm.parent;
    m.convertToFlatShadedMesh();
    out.push(m);
  };
  for (const side of [-1, 1]) {
    for (const face of [-1, 1]) {
      const b = MeshBuilder.CreateBox("minerBrace", { width: W * O.strap, height: H, depth: D * O.proud }, scene);
      put(b, side * W * O.apart, cy, cz + face * (D / 2 + D * O.proud / 2), strap);
    }
  }
  const waist = MeshBuilder.CreateBox("minerWaist", { width: W * O.over, height: H * O.waist, depth: D * O.over + D * O.proud * 2 }, scene);
  put(waist, 0, cy - H / 2 + H * O.waist / 2, cz, team);
  return out;
}

/*
 * [S] 452 the Miner's boots (critic 449-451 miner a.4: "plain team feet - TABS: dark brown knee boots"; wild_west.miner.red.png: dark brown leather
 * boots from just under the knee to the sole, the shaft a little wider than the shin with a turned top, the foot a rounded dark toe). MINER_BOOTS in the
 * shin's own box: a 6-sided shell .out of its half-width round it from .from to .to of its length, a turned top .cuff round from .cuffFrom to .from; the
 * foot in the same leather. Dark brown, self-lit .glow.
 */
const MINER_BOOTS = { from: 0.14, to: 1.04, out: 1.25, cuffFrom: 0.06, cuff: 1.45, color: new Color3(0.12, 0.065, 0.04), glow: 0.1 };

/** Dark brown knee boots on both shins and feet (spec at MINER_BOOTS). */
export function minerBoots(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = MINER_BOOTS;
  const leather = getMaterialFactory().get("cloth", B.color, { emissive: B.color.scale(B.glow) });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "minerBoot", shin, B.from, B.to, B.out, leather));
    out.push(limbShell(scene, "minerBootCuff", shin, B.cuffFrom, B.from + 0.02, B.cuff, leather));
  }
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) if (foot instanceof Mesh && /_[lr]FootM$/.test(foot.name)) foot.material = leather;
  }
  return out;
}

/*
 * [S] 453 the Dynamite Thrower's boots (critic 444-452 dynamite a.4: "plain team feet - TABS: black knee boots with a folded cuff"; card Appearance
 * "black boots"; wild_west.dynamite_thrower.red.png: near-black leather from a third of the way down the shin to the sole, bare team shin above; the top
 * folds over in a cuff wider than the shaft and slanting out, the shaft a little wider than the shin). DYNAMITE_BOOTS in the shin's own box, as
 * MINER_BOOTS: a 6-sided shell .out of its half-width round it from .from to .to of its length, the folded cuff .cuff round from .cuffFrom to .from;
 * the foot in the same leather. Near-black, self-lit .glow.
 */
const DYNAMITE_BOOTS = { from: 0.46, to: 1.04, out: 1.3, cuffFrom: 0.32, cuff: 1.6, color: new Color3(0.07, 0.055, 0.05), glow: 0.1 };

/** Black boots with a folded cuff on both shins and feet (spec at DYNAMITE_BOOTS). */
export function dynamiteBoots(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = DYNAMITE_BOOTS;
  const leather = getMaterialFactory().get("cloth", B.color, { emissive: B.color.scale(B.glow) });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "dynamiteBoot", shin, B.from, B.to, B.out, leather));
    out.push(limbShell(scene, "dynamiteBootCuff", shin, B.cuffFrom, B.from + 0.02, B.cuff, leather));
  }
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) if (foot instanceof Mesh && /_[lr]FootM$/.test(foot.name)) foot.material = leather;
  }
  return out;
}

/*
 * [S] 453 the Gunslinger's shoes (CONFIRM 448 gunslinger a.4: "chunky blue-grey cuffed boots in the trouser tone - TABS: small black shoes under straight
 * trouser legs"; card Appearance "black shoes"; wild_west.gunslinger.blue.png: the trouser leg runs straight to the ankle, under it a small low black shoe,
 * no shaft). GUNSLINGER_SHOES: each foot block in black leather, cut to .foot of its size (it read as a chunky boot in the suit cloth), and a low shoe
 * top round the ankle, a 6-sided ring .out of the shin's half-width from .from to .to of the shin's length, in the same leather. Self-lit .glow.
 */
const GUNSLINGER_SHOES = { foot: 0.82, from: 0.9, to: 1.04, out: 1.12, color: new Color3(0.05, 0.045, 0.05), glow: 0.1 };

/** Small black shoes on both feet (spec at GUNSLINGER_SHOES). */
export function gunslingerShoes(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = GUNSLINGER_SHOES;
  const leather = getMaterialFactory().get("cloth", S.color, { emissive: S.color.scale(S.glow) });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) out.push(limbShell(scene, "gunslingerShoe", shin, S.from, S.to, S.out, leather));
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) {
      if (!(foot instanceof Mesh) || !/_[lr]FootM$/.test(foot.name)) continue;
      foot.material = leather;
      foot.scaling.x *= S.foot;
      foot.scaling.y *= S.foot;
    }
  }
  return out;
}

/*
 * [S] 452 the Quick Draw's team vest (CONFIRM 451 quick_draw a.1: "vest a desaturated brown (~115,83,75), not the team red the pants show - TABS:
 * buttoned team-colour vest, a saturated crimson matching the hat and pants"; card Appearance "a buttoned team color vest"; wild_west.quick_draw.red.png:
 * the vest the hat's crimson, four small grey buttons down its front from the collar V to the belt). The secret_bandit body cloth blends the team colour
 * toward brown and the clothed recolour shifts it warm (LESSONS 449), so every body-cloth mesh but the face and hands wears an explicit team cloth,
 * the team colour times QUICK_DRAW_VEST.shade, self-lit .glow; the tunic hem below the belt takes it too (unitFactory). Buttons: .buttons grey studs
 * .button of the trunk's width across, down the front's middle from .from to .to of the trunk's height (top 0), .proud of its depth off it.
 */
const QUICK_DRAW_VEST = { shade: 0.9, glow: 0.12, buttons: 4, button: 0.07, from: 0.4, to: 0.88, proud: 0.05, buttonColor: new Color3(0.45, 0.45, 0.47) };

/** The Quick Draw's team cloth (spec at QUICK_DRAW_VEST); cached by colour, so the hung tunic hem shares it. */
export function quickDrawCloth(teamColor: Color3): Material {
  const c = teamColor.scale(QUICK_DRAW_VEST.shade);
  return getMaterialFactory().get("cloth", c, { emissive: c.scale(QUICK_DRAW_VEST.glow) });
}

/** The Quick Draw's buttoned team vest: the body cloth swapped for team cloth, grey buttons down the front (spec at QUICK_DRAW_VEST). */
export function quickDrawVest(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const V = QUICK_DRAW_VEST;
  const cloth = quickDrawCloth(teamColor);
  for (const m of body.allMeshes) if (m.material === body.bodyMaterial && m !== body.headMesh && !/Hand/.test(m.name)) m.material = cloth;
  const grey = getMaterialFactory().get("cloth", V.buttonColor, { emissive: V.buttonColor.scale(0.15) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const out: Mesh[] = [];
  for (let i = 0; i < V.buttons; i++) {
    const t = V.from + (V.to - V.from) * (i / Math.max(1, V.buttons - 1));
    const b = MeshBuilder.CreateBox("quickDrawButton", { width: W * V.button, height: W * V.button, depth: D * V.proud }, scene);
    b.position.set(cx, cy + H / 2 - H * t, cz + D / 2 + D * V.proud / 2);
    b.rotation.copyFrom(tm.rotation);
    b.material = grey;
    b.parent = tm.parent;
    out.push(b);
  }
  return out;
}

/*
 * [S] 452 the Dynamite Thrower's skirt (critic 449-451 dynamite_thrower a.2: "short dark tunic hem at the hip, no stripes - TABS: knee-length team skirt
 * with vertical gold stripes and a gold hem band"; card Appearance "a team color skirt with gold lines on it"; wild_west.dynamite_thrower.red.png: a team
 * skirt from the waist to just above the knee, a little flared, pale gold stripes running straight down it about a hand apart, a pale gold band round the
 * hem). DYNAMITE_SKIRT: the tunic skirt hung .long of the hip-to-knee drop, flaring .flare, in team cloth (not the bandit-tinted body cloth, LESSONS 449);
 * on every face of it .stripes stripes .stripe of the face's width across, running from the waist to the band, .proud of the skirt's radius off it; the
 * hem band .band of the skirt tall and .bandOut of its hem round. Gold self-lit .glow.
 */
export const DYNAMITE_SKIRT = { long: 1.05, flare: 1.35, stripes: 2, stripe: 0.09, proud: 0.03, band: 0.12, bandOut: 1.04, gold: new Color3(0.95, 0.78, 0.42), glow: 0.3, teamGlow: 0 } // [P] 453 teamGlow .12 -> 0: the skirt read pale beside her pants (critic 452 dynamite a defect 1);

/** The team cloth the Dynamite Thrower's skirt is hung in (spec at DYNAMITE_SKIRT). */
export function dynamiteSkirtCloth(teamColor: Color3): Material {
  return getMaterialFactory().get("cloth", teamColor, { emissive: teamColor.scale(DYNAMITE_SKIRT.teamGlow) });
}

/** Gold stripes down every face of the hung 6-sided skirt and a gold band round its hem (spec at DYNAMITE_SKIRT). */
export function dynamiteSkirtTrim(scene: Scene, skirt: Mesh): Mesh[] {
  const S = DYNAMITE_SKIRT;
  const gold = getMaterialFactory().get("cloth", S.gold, { emissive: S.gold.scale(S.glow) });
  const pos = skirt.getVerticesData(VertexBuffer.PositionKind) ?? [];
  let yT = -Infinity, yB = Infinity;
  for (let i = 1; i < pos.length; i += 3) { yT = Math.max(yT, pos[i]); yB = Math.min(yB, pos[i]); }
  let rT = 0, rB = 0;
  for (let i = 0; i < pos.length; i += 3) {
    const r = Math.hypot(pos[i], pos[i + 2]);
    if (Math.abs(pos[i + 1] - yT) < 1e-5) rT = Math.max(rT, r);
    if (Math.abs(pos[i + 1] - yB) < 1e-5) rB = Math.max(rB, r);
  }
  const tall = yT - yB, bandTall = tall * S.band;
  const out: Mesh[] = [];
  // Babylon's cylinder sets its ring vertices at angle -k * 60 deg
  const at = (k: number, r: number, y: number) => new Vector3(Math.cos(-k * Math.PI / 3) * r, y, Math.sin(-k * Math.PI / 3) * r);
  for (let k = 0; k < 6; k++) {
    const t0 = at(k, rT, yT), t1 = at(k + 1, rT, yT), b0 = at(k, rB, yB), b1 = at(k + 1, rB, yB);
    for (let j = 0; j < S.stripes; j++) {
      const u = (j + 1) / (S.stripes + 1);
      const top = Vector3.Lerp(t0, t1, u), foot = Vector3.Lerp(b0, b1, u);
      const y = foot.subtract(top);
      const long = y.length() * (1 - S.band);
      const across = b1.subtract(b0);
      let n = Vector3.Cross(across, y).normalize();
      if (n.x * (top.x + foot.x) + n.z * (top.z + foot.z) < 0) n = n.scale(-1);
      const up = y.normalize().scale(-1), xd = Vector3.Cross(up, n).normalize();
      const bar = MeshBuilder.CreateBox("dynamiteSkirtStripe", { width: across.length() * S.stripe, height: long, depth: rB * S.proud * 2 }, scene);
      const m = Matrix.Identity();
      Matrix.FromXYZAxesToRef(xd, up, n, m);
      bar.rotationQuaternion = Quaternion.FromRotationMatrix(m);
      bar.position.copyFrom(Vector3.Lerp(top, foot, (1 - S.band) / 2).add(n.scale(rB * S.proud)));
      bar.material = gold;
      bar.parent = skirt;
      out.push(bar);
    }
  }
  const band = MeshBuilder.CreateCylinder("dynamiteSkirtBand", { height: bandTall, diameterTop: 2 * (rB - (rB - rT) * S.band) * S.bandOut, diameterBottom: 2 * rB * S.bandOut, tessellation: 6 }, scene);
  band.position.y = yB + bandTall / 2;
  band.material = gold;
  band.parent = skirt;
  band.convertToFlatShadedMesh();
  out.push(band);
  return out;
}

/*
 * [S] 451 the gun belt (critic 449 gunslinger a.3: "no belt or holsters at the waist - TABS: a dark brown belt with two dark holsters on the hips, just
 * below the jacket's buttons"; quick_draw a.3: "none - TABS: dark belt with a holster and a diagonal ammo pouch"; wild_west.gunslinger.red.png,
 * wild_west.quick_draw.red.png: a broad dark brown belt round the hips at the foot of the trunk, a little wider than it; a holster a dark grey-brown
 * block hung from it on the hip's side, its top at the belt, down to about a third of the thigh, standing a little out from the leg; the Quick Draw's
 * other hip carries a short pouch slanting up across the belt to the back, a row of brass cartridge heads along it). GUN_BELT on the trunk (torso
 * frame, W H D its box): the belt .band H tall round the trunk's foot, .over of its width and depth; a holster .holster W wide, .holsterLong H long,
 * .holsterDeep D deep, its middle .holsterOut W out from the trunk's middle, splayed .splay rad off the leg; the pouch .pouch W long, .pouchTall H tall,
 * at .pouchOut W out on its hip, slanted .slant rad, .shells brass heads along it. [S] 452 the Deadeye wears a cartridge pouch on each hip
 * (critic 449-451 deadeye a.3: "dark brown cartridge belts with bullet loops on both hips"; wild_west.deadeye.red.png), no holster. Belt and pouch brown, holsters a darker grey-brown; self-lit .glow.
 */
const GUN_BELT = {
  band: 0.13, over: 1.07, holster: 0.17, holsterLong: 0.42, holsterDeep: 0.42, holsterOut: 0.58, splay: 0.12,
  pouch: 0.44, pouchTall: 0.14, pouchOut: 0.3, slant: 0.55, shells: 4,
  leather: new Color3(0.17, 0.1, 0.06), holsterColor: new Color3(0.1, 0.085, 0.07), brass: new Color3(0.75, 0.5, 0.15), glow: 0.12,
};

/** A dark gun belt round the hips with holsters on the `holsters` sides and slanting ammo pouches on the `pouches` sides (+1 the weapon side; spec at GUN_BELT). */
export function gunBelt(scene: Scene, body: ArticulatedBody, holsters: number[], pouches: number[]): Mesh[] {
  const G = GUN_BELT;
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", G.leather, { emissive: G.leather.scale(G.glow) });
  const dark = mf.get("cloth", G.holsterColor, { emissive: G.holsterColor.scale(G.glow) });
  const brass = mf.get("cloth", G.brass, { emissive: G.brass.scale(0.3) });
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const weapon = Math.sign(body.rightShoulder.position.x) || 1;
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, y: number, z: number, mat: Material, roll = 0): void => {
    m.position.set(cx + x, y, z);
    m.rotation.copyFrom(tm.rotation);
    m.rotation.z += roll;
    m.material = mat;
    m.parent = tm.parent;
    m.convertToFlatShadedMesh();
    out.push(m);
  };
  const beltY = cy - H / 2 + H * G.band / 2;
  put(MeshBuilder.CreateBox("gunBelt", { width: W * G.over, height: H * G.band, depth: D * G.over }, scene), 0, beltY, cz, leather);
  for (const s of holsters) {
    const side = s * weapon;
    const long = H * G.holsterLong;
    const holster = MeshBuilder.CreateBox("gunHolster", { width: W * G.holster, height: long, depth: D * G.holsterDeep }, scene);
    put(holster, side * W * G.holsterOut, beltY + H * G.band / 2 - long / 2, cz, dark, side * G.splay);
  }
  for (const p of pouches) {
    const side = p * weapon;
    const bag = MeshBuilder.CreateBox("gunPouch", { width: W * G.pouch, height: H * G.pouchTall, depth: D * 0.12 }, scene);
    const px = side * W * G.pouchOut, pz = cz + D * G.over / 2 + D * 0.06;
    put(bag, px, beltY + H * G.band * 0.4, pz, leather, side * G.slant);
    // brass cartridge heads along its face, in the bag's slant
    for (let i = 0; i < G.shells; i++) {
      const t = (i + 0.5) / G.shells - 0.5;
      const head = MeshBuilder.CreateBox("gunPouchShell", { width: W * 0.035, height: H * 0.05, depth: D * 0.05 }, scene);
      const along = t * W * G.pouch * 0.85;
      put(head, px + along * Math.cos(side * G.slant), beltY + H * G.band * 0.4 + along * Math.sin(side * G.slant), pz + D * 0.07, brass, side * G.slant);
    }
  }
  return out;
}

/*
 * [S] 448 the Gunslinger's sideburns (critic 447 a.4: "sideburns: none - TABS: black bushy sideburns"; wild_west.gunslinger.red.png: a thick
 * black-grey tuft down each side of the face from under the bowler's brim, beside the eyes, to the jaw, standing out from the cheek and ragged at its
 * edge). GUNSLINGER_SIDEBURNS in the head's own box (e its half sizes, c its centre): on each side .lumps faceted lumps, each .lump of e.x across, in a
 * column from the eyes' top (or .top of e.y over the centre) down to .foot of e.y under it, standing .out of e.x off the head's side, set .ahead of
 * e.z forward, alternately .jag of e.z fore and aft so the edge reads bushy; near black, self-lit .glow.
 */
const GUNSLINGER_SIDEBURNS = { lumps: 4, lump: 0.42, top: 0.35, foot: -0.75, out: 0.12, ahead: 0.18, jag: 0.12, color: new Color3(0.06, 0.055, 0.05), glow: 0.1 };

/** Black bushy sideburns down both cheeks (spec at GUNSLINGER_SIDEBURNS). */
export function gunslingerSideburns(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = GUNSLINGER_SIDEBURNS;
  const hair = getMaterialFactory().get("cloth", S.color, { emissive: S.color.scale(S.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const span = eyeSpanInHead(body);
  const top = span ? span[1] : c.y + e.y * S.top, foot = c.y + e.y * S.foot;
  const out: Mesh[] = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < S.lumps; i++) {
      const t = i / (S.lumps - 1);
      const r = e.x * S.lump * (1 - 0.25 * t);
      const m = MeshBuilder.CreateIcoSphere("gunslingerSideburn", { radius: r, subdivisions: 1, flat: true }, scene);
      m.scaling.set(0.6, 1.25, 1);
      m.position.set(c.x + side * (e.x + e.x * S.out), top - (top - foot) * t, c.z + e.z * (S.ahead + (i % 2 ? S.jag : -S.jag)));
      m.material = hair;
      m.parent = head;
      out.push(m);
    }
  }
  return out;
}

/*
 * [S] 449 the Miner's handlebar moustache (critic 448 miner a.2: "moustache: none - TABS: big black handlebar moustache"; wild_west.miner.red.png: a
 * thick black moustache across the face under the eyes, wider than the mouth, each half sweeping out and down to a rounded end). MINER_MOUSTACHE in
 * the head's own box (e its half sizes, c its centre, +z the face): each half a faceted bar .long of e.x long, .thick of e.y tall, from the middle out
 * along a line drooping .droop rad, its middle .at of e.y under the centre and .proud of e.z in front of the face; at its outer end a lump .tip of
 * e.x round, .tipDrop of e.y lower. Near black, self-lit .glow.
 */
const MINER_MOUSTACHE = { long: 0.8, thick: 0.28, droop: 0.32, at: -0.38, proud: 0.08, tip: 0.22, tipDrop: 0.16, color: new Color3(0.05, 0.045, 0.04), glow: 0.1 };

/** A big black handlebar moustache under the eyes (spec at MINER_MOUSTACHE). */
export function minerMoustache(scene: Scene, body: ArticulatedBody): Mesh[] {
  const M = MINER_MOUSTACHE;
  const hair = getMaterialFactory().get("cloth", M.color, { emissive: M.color.scale(M.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const y = c.y + e.y * M.at, z = c.z + e.z * (1 + M.proud);
  const out: Mesh[] = [];
  for (const side of [-1, 1]) {
    const L = e.x * M.long;
    const bar = MeshBuilder.CreateBox("minerMoustache", { width: L, height: e.y * M.thick, depth: e.z * 0.16 }, scene);
    bar.position.set(c.x + side * (L / 2) * Math.cos(M.droop), y - (L / 2) * Math.sin(M.droop), z);
    bar.rotation.z = -side * M.droop;
    bar.material = hair;
    bar.parent = head;
    out.push(bar);
    const tip = MeshBuilder.CreateIcoSphere("minerMoustacheTip", { radius: e.x * M.tip, subdivisions: 1, flat: true }, scene);
    tip.position.set(c.x + side * L * Math.cos(M.droop), y - L * Math.sin(M.droop) - e.y * M.tipDrop * 0.5, z);
    tip.scaling.set(0.8, 1.2, 0.6);
    tip.material = hair;
    tip.parent = head;
    out.push(tip);
  }
  return out;
}

/*
 * [S] 448 the Cactus's boots (critic 447 cactus a.2: "robe length: hem to the ground, legs hidden - TABS: robe to the knee, team shins and dark brown
 * boots below"; wild_west.cactus.red.png: under the knee-length robe a short band of team shin, then dark brown boots from mid-shin to the foot, their
 * tops a little wider, the toes rounded). CACTUS_BOOTS in the shin's own box: a 6-sided shell .out of its half-width round it from .from to .to of its
 * length, a cuff .cuff round from .cuffFrom to .from; the foot in the same leather, .toe of its width. Dark brown, self-lit .glow. The robe is cut to the
 * knee by CACTUS_ROBE.hem. [R] 451: slim (the 448 fat boots, out 2.1 cuff 2.5, read as a second skirt), from .55 of the shin so a band of team shin shows under the hem.
 */
const CACTUS_BOOTS = { from: 0.55, to: 1.04, out: 1.35, cuffFrom: 0.49, cuff: 1.6, toe: 0.85, color: new Color3(0.13, 0.07, 0.045), glow: 0.1 };

/** Dark brown boots from mid-shin to the foot (spec at CACTUS_BOOTS). */
export function cactusBoots(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = CACTUS_BOOTS;
  const leather = getMaterialFactory().get("cloth", B.color, { emissive: B.color.scale(B.glow) });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "cactusBoot", shin, B.from, B.to, B.out, leather));
    out.push(limbShell(scene, "cactusBootCuff", shin, B.cuffFrom, B.from + 0.02, B.cuff, leather));
  }
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) {
      if (!(foot instanceof Mesh) || !/_[lr]FootM$/.test(foot.name)) continue;
      foot.material = leather;
      foot.scaling.x *= B.toe;
    }
  }
  return out;
}

/*
 * [R] 451 the Cactus's robe, spike grid, flowers and boots (plateau a: critic 447-449 a.2 "hem to the ground, legs hidden - TABS: robe to the knee, team
 * shins and dark brown boots below", a.3 "about fifteen scattered small spikes - TABS: dense regular grid of tan pyramid spikes over robe, hood, sleeves",
 * a.4 "one small flower at the hem, a tiny one on the hood - TABS: large flower on the hood top, one on the shoulder, one on the hem"). Probe 451 (idle,
 * root-relative): hip .77, knee .41, the old hem .25 and the old boot cuffs .52, so the boots ran up inside the robe and no shin showed.
 * Spec read off wild_west.cactus.red.png (height from sole to hood top 1): a green A-line robe from the shoulders, a little wider than them at the chest
 * and flaring to about one and a half chest widths at the hem, the hem level with the knee (.25 of the height); under it a band of bare team shin; then
 * slim dark brown boots from just below the knee (.22) to the sole, a shin and a third across with a slightly wider turned cuff at the top. Spikes: tan
 * four-sided pyramids with broad bases, in regular staggered rings, about eight round the robe per ring, two rings over the chest and three down the
 * skirt, each about .4 of a head tall. Flowers: salmon-pink, eight broad flat petals round a yellow eye, one about a head across on the hood's crown, one
 * about .7 of a head on the right shoulder's front, one about .8 low on the skirt's front to the left.
 * CACTUS_ROBE in the chest box (W H D): bodice .bodice W across at the top to .waist W at its foot, .tall H tall, depth .deep of W; skirt from .rise H over
 * the hip joint to the hem, .hem of the hip-to-knee drop down (the knee joint in the hip frame, LESSONS: anchor to knee.position.y), .flare W across at
 * the hem. Spike rings: .chestRings on the bodice and .skirtRings on the skirt, .ring spikes each, alternate rings turned half a step; spikes .spike of
 * the head tall, .base of that across. Flowers .petals petals, sizes .hoodFlower, .shoulderFlower, .hemFlower of the head; petal and eye colours.
 * CACTUS_BOOTS (below) are the slim boots; the hands are hidden inside the mitten sleeves (a team-blue hand showed under the sleeve at the hip).
 */
export const CACTUS_ROBE = {
  bodice: 1.12, waist: 1.24, tall: 1.04, deep: 1.3, rise: 0.08, hem: 0.9, flare: 1.5,
  chestRings: 2, skirtRings: 3, ring: 8, spike: 0.55, base: 1.15, // [S] 452 bigger, broader (critic 451 a.3)
  petals: 8, hoodFlower: 1.05, shoulderFlower: 0.72, hemFlower: 0.82,
  petal: new Color3(1, 0.36, 0.3), eye: new Color3(1, 0.8, 0.2), glow: 0.18,
};

/** A four-sided tan spike on `parent` at `at` (its frame), pointing along unit `out` (spec at CACTUS_ROBE). */
function cactusSpike(scene: Scene, parent: TransformNode, at: Vector3, out: Vector3, tall: number, mat: Material): Mesh {
  const s = MeshBuilder.CreateCylinder("cactusSpine", { height: tall, diameterTop: 0, diameterBottom: tall * CACTUS_ROBE.base, tessellation: 4 }, scene);
  s.parent = parent;
  s.position.copyFrom(at.add(out.scale(tall * 0.38)));
  s.rotation.set(Math.acos(Math.max(-1, Math.min(1, out.y))), Math.atan2(out.x, out.z), 0);
  s.material = mat;
  s.convertToFlatShadedMesh();
  return s;
}

/** A salmon-pink cactus flower of `size` across on `parent` at `at`, its face turned up by `pitch` off facing +y (spec at CACTUS_ROBE). */
export function cactusFlower(scene: Scene, parent: TransformNode, at: Vector3, pitch: number, size: number): Mesh[] {
  const R = CACTUS_ROBE;
  const mf = getMaterialFactory();
  const petal = mf.get("cloth", R.petal, { emissive: R.petal.scale(R.glow) });
  const eye = mf.get("cloth", R.eye, { emissive: R.eye.scale(R.glow * 1.5) });
  const holder = new Mesh("cactusFlower", scene);
  holder.parent = parent;
  holder.position.copyFrom(at);
  holder.rotation.x = pitch;
  const out: Mesh[] = [holder];
  for (let i = 0; i < R.petals; i++) {
    const a = (i / R.petals) * Math.PI * 2;
    const p = MeshBuilder.CreateBox("cactusPetal", { width: size * 0.2, height: size * 0.05, depth: size * 0.42 }, scene);
    p.rotation.set(-0.12, a, 0);
    p.position.set(Math.sin(a) * size * 0.26, 0, Math.cos(a) * size * 0.26);
    p.material = petal;
    p.parent = holder;
    p.convertToFlatShadedMesh();
    out.push(p);
  }
  const c = MeshBuilder.CreateCylinder("cactusFlowerEye", { height: size * 0.08, diameter: size * 0.24, tessellation: 6 }, scene);
  c.position.y = size * 0.03;
  c.material = eye;
  c.parent = holder;
  out.push(c);
  return out;
}

/** The Cactus's robe to the knee with its spike grid and the shoulder and hem flowers, the hands hidden (spec at CACTUS_ROBE). */
export function cactusRobe(scene: Scene, body: ArticulatedBody, green: Material, spineMat: Material): Mesh[] {
  const R = CACTUS_ROBE;
  const out: Mesh[] = [];
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y;
  const headSize = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2;
  const tall = headSize * R.spike;
  const top = W * R.bodice, waist = W * R.waist, hem = W * R.flare, deep = R.deep * (ext.z * chest.scaling.z) / Math.max(1e-4, ext.x * chest.scaling.x);
  const bodiceH = H * R.tall;
  const bodice = MeshBuilder.CreateCylinder(`${chest.name}_cactusRobe`, { height: bodiceH, diameterTop: top, diameterBottom: waist, tessellation: 8 }, scene);
  bodice.scaling.z = deep;
  bodice.position.set(0, chest.position.y, 0);
  bodice.material = green;
  bodice.convertToFlatShadedMesh();
  bodice.parent = body.torso;
  out.push(bodice);
  // The skirt: from just over the hip joint to the hem at the knee (the knee joint in the hip frame)
  const skirtTop = H * R.rise;
  const hemY = body.leftHip.position.y + body.leftKnee.position.y * R.hem;
  const long = skirtTop - hemY;
  const skirt = MeshBuilder.CreateCylinder(`${chest.name}_cactusSkirt`, { height: long, diameterTop: waist, diameterBottom: hem, tessellation: 9 }, scene);
  skirt.scaling.z = deep;
  skirt.position.y = (skirtTop + hemY) / 2;
  skirt.material = green;
  skirt.convertToFlatShadedMesh();
  skirt.parent = body.hip;
  out.push(skirt);
  // Regular staggered rings of spikes: on the bodice (torso frame) and down the skirt (hip frame)
  const ringOf = (parent: TransformNode, y: number, r: number, k: number): void => {
    for (let i = 0; i < R.ring; i++) {
      const a = ((i + (k % 2) * 0.5) / R.ring) * Math.PI * 2;
      const dir = new Vector3(Math.sin(a), 0, Math.cos(a) * deep).normalize();
      out.push(cactusSpike(scene, parent, new Vector3(Math.sin(a) * r, y, Math.cos(a) * r * deep), dir, tall, spineMat));
    }
  };
  for (let k = 0; k < R.chestRings; k++) {
    const u = (k + 0.5) / R.chestRings;
    ringOf(body.torso, chest.position.y + bodiceH * (0.32 - 0.64 * u), (top + (waist - top) * (0.18 + 0.64 * u)) / 2, k);
  }
  for (let k = 0; k < R.skirtRings; k++) {
    const u = (k + 0.5) / R.skirtRings;
    ringOf(body.hip, skirtTop - long * (0.08 + 0.84 * u), (waist + (hem - waist) * (0.08 + 0.84 * u)) / 2, k + R.chestRings);
  }
  // Flowers: the right shoulder's front (torso frame) and low on the skirt's front to the left (hip frame)
  const side = Math.sign(body.rightShoulder.position.x) || 1;
  const shoulderY = chest.position.y + bodiceH * 0.36;
  const rS = (top + (waist - top) * 0.14) / 2;
  out.push(...cactusFlower(scene, body.torso, new Vector3(side * W * 0.32, shoulderY, Math.sqrt(Math.max(0, rS * rS - (W * 0.32) ** 2)) * deep + headSize * 0.03), Math.PI / 2 - 0.25, headSize * R.shoulderFlower));
  const hemFlowerY = skirtTop - long * 0.78, rH = (waist + (hem - waist) * 0.78) / 2;
  out.push(...cactusFlower(scene, body.hip, new Vector3(-side * hem * 0.16, hemFlowerY, Math.sqrt(Math.max(0, rH * rH - (hem * 0.16) ** 2)) * deep + headSize * 0.03), Math.PI / 2 - 0.1, headSize * R.hemFlower));
  // The hands are inside the mitten sleeves
  for (const elbow of [body.leftElbow, body.rightElbow]) for (const m of elbow.getChildMeshes(false)) if (/_[lr]HandM$/.test(m.name)) m.isVisible = false;
  return out;
}

/*
 * [S] 447 the Cactus's sleeves (critic 446 cactus a.1: "bare team arms shoulder to hand - TABS: thick green spiked cactus sleeves over the forearms";
 * wild_west.cactus.red.png: each forearm cased from the elbow past the hand in a fat green cactus pad, about three arms across, its end rounded like a
 * mitten, the hand hidden in it; tan pyramid spikes in regular rows round it). CACTUS_SLEEVE in the forearm's own box: a 6-sided shell .out of its
 * half-width round it, from .from of its length to .to (past the hand), a rounded cap .cap of the shell across at the end; .rows rows of .ring spikes
 * each, the rows staggered by half a step, each spike .spike of the shell's radius tall. The suit's green (the caller's), the robe's spikes' material.
 */
const CACTUS_SLEEVE = { out: 2.2, from: 0.04, to: 1.32, cap: 0.95, rows: 4, ring: 5, spike: 0.42 };

/** The fat spiked sleeves over both forearms (spec at CACTUS_SLEEVE), in the suit's `green` with `spikeMat` spikes. */
export function cactusSleeves(scene: Scene, body: ArticulatedBody, green: Material, spikeMat: Material): Mesh[] {
  const C = CACTUS_SLEEVE;
  const out: Mesh[] = [];
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    const L = limbBox(arm);
    const shell = limbShell(scene, "cactusSleeve", arm, C.from, C.to, C.out, green);
    out.push(shell);
    const r = Math.max(L.wide, L.deep) * C.out;
    const zs = shell.scaling.z;
    const yTop = L.mid + L.half - C.from * L.half * 2, yBot = L.mid + L.half - C.to * L.half * 2;
    const cap = MeshBuilder.CreateSphere("cactusSleeveCap", { diameter: r * 2 * 0.86 * C.cap, segments: 4 }, scene);
    cap.scaling.set(1, 0.7, zs);
    cap.position.y = yBot;
    cap.material = green;
    cap.convertToFlatShadedMesh();
    cap.parent = arm.parent;
    out.push(cap);
    const tall = r * C.spike;
    for (let row = 0; row < C.rows; row++) {
      const y = yTop - (yTop - yBot) * (row + 0.5) / C.rows;
      const rr = r * (1 - 0.14 * (row + 0.5) / C.rows);
      for (let k = 0; k < C.ring; k++) {
        const a = (Math.PI * 2 * (k + (row % 2) * 0.5)) / C.ring;
        const dir = { x: Math.sin(a), z: Math.cos(a) };
        const s = MeshBuilder.CreateCylinder("cactusSleeveSpine", { height: tall, diameterTop: 0, diameterBottom: tall * 0.85, tessellation: 4 }, scene);
        s.position.set(dir.x * (rr + tall * 0.3), y, dir.z * (rr * zs + tall * 0.3));
        s.rotation.set(Math.PI / 2, Math.atan2(dir.x, dir.z), 0);
        s.material = spikeMat;
        s.convertToFlatShadedMesh();
        s.parent = arm.parent;
        out.push(s);
      }
    }
  }
  return out;
}

/** The head's box in the torso's frame: chin, middle height and depth, width, height and depth (as farmerDress / vikingDress). */
function headInTorso(body: ArticulatedBody): { chin: number; midY: number; midZ: number; wide: number; tall: number; deep: number } {
  for (let n: Node | null = body.headMesh; n; n = n.parent) if (n instanceof TransformNode) n.computeWorldMatrix(true);
  body.torso.computeWorldMatrix(true);
  const box = body.headMesh.getBoundingInfo().boundingBox;
  const toTorso = body.torso.getWorldMatrix().clone().invert();
  const pts = box.vectorsWorld.map((v) => Vector3.TransformCoordinates(v, toTorso));
  const ys = pts.map((p) => p.y), zs = pts.map((p) => p.z), xs = pts.map((p) => p.x);
  return {
    chin: Math.min(...ys), midY: (Math.min(...ys) + Math.max(...ys)) / 2, midZ: (Math.min(...zs) + Math.max(...zs)) / 2,
    wide: Math.max(...xs) - Math.min(...xs), tall: Math.max(...ys) - Math.min(...ys), deep: Math.max(...zs) - Math.min(...zs),
  };
}

/*
 * [S] 453 a brown braid under the hat (critic 451-452 deadeye a.4: "braid: none - TABS: brown braid under the hat"; wild_west.deadeye.red.png and
 * wild_west.dynamite_thrower.red.png: a thick brown plait leaves the head under the brim beside one cheek, falls over the front of that shoulder and ends
 * on the upper chest in a dark tie, a little tuft below). WESTERN_BRAID, hung from the torso so it lies on the shoulder whatever the neck does, in the
 * head's own size (W head widths, H head heights), torso frame: root .apart W out on `side`, .rootUp H above the chin, .rootBack W behind the head's
 * middle (under the brim); foot .footOut W out, .footDrop H under the chin, .standOff W in front of the chest's front; a quadratic bowed .bow W forward
 * over the shoulder. .plaits flat lobes .thick W thick along it, every other one .shade darker; a dark tie .band H tall and a tuft .tuft H long at the
 * foot. Hair brown, self-lit .glow.
 */
const WESTERN_BRAID = {
  apart: 0.42, rootUp: 0.32, rootBack: 0.12, footOut: 0.5, footDrop: 0.85, standOff: 0.12, bow: 0.18,
  plaits: 5, thick: 0.3, overlap: 1.5, shade: 0.75, band: 0.12, tuft: 0.2,
  hair: new Color3(0.36, 0.19, 0.09), tie: new Color3(0.12, 0.1, 0.1), glow: 0.14,
};

/** A brown plait from under the hat over the `side` shoulder onto the chest, a dark tie and tuft at its end (spec at WESTERN_BRAID). */
export function westernBraid(scene: Scene, body: ArticulatedBody, side: number): Mesh[] {
  const B = WESTERN_BRAID;
  const mf = getMaterialFactory();
  const hair = mf.get("cloth", B.hair, { emissive: B.hair.scale(B.glow) });
  const dark = mf.get("cloth", B.hair.scale(B.shade), { emissive: B.hair.scale(B.shade * B.glow) });
  const tieMat = mf.get("cloth", B.tie, { emissive: B.tie.scale(0.1) });
  const head = headInTorso(body);
  const H = head.tall, W = head.wide;
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const front = chest.position.z + ext.z * chest.scaling.z;
  const thick = B.thick * W;
  const out: Mesh[] = [];
  const put = (m: Mesh, mat: Material): Mesh => {
    m.material = mat;
    m.parent = body.torso;
    out.push(m);
    return m;
  };
  const root = new Vector3(side * B.apart * W, head.chin + B.rootUp * H, head.midZ - B.rootBack * W);
  const foot = new Vector3(side * B.footOut * W, head.chin - B.footDrop * H, front + B.standOff * W + thick * 0.5);
  const mid = Vector3.Lerp(root, foot, 0.5);
  mid.z = Math.max(mid.z, foot.z) + B.bow * W;
  const along = (t: number): Vector3 => root.scale((1 - t) ** 2).add(mid.scale(2 * t * (1 - t))).add(foot.scale(t * t));
  const tangent = (t: number): Vector3 => mid.subtract(root).scale(2 * (1 - t)).add(foot.subtract(mid).scale(2 * t)).normalize();
  const lean = (t: number): number => Math.atan2(-tangent(t).z, -tangent(t).y);
  const len = Vector3.Distance(root, foot) * 1.05;
  const step = 1 / B.plaits;
  for (let k = 0; k < B.plaits; k++) {
    const t = (k + 0.5) * step;
    const lobe = put(MeshBuilder.CreateIcoSphere("westernBraid", {
      radiusX: thick * 0.5, radiusY: len * step * 0.5 * B.overlap, radiusZ: thick * 0.42, subdivisions: 1, flat: true,
    }, scene), k % 2 ? dark : hair);
    lobe.position.copyFrom(along(t));
    lobe.position.x += (k % 2 ? 1 : -1) * thick * 0.08;
    lobe.rotation.set(lean(t), 0, (k % 2 ? 1 : -1) * 0.35);
  }
  const tie = put(MeshBuilder.CreateCylinder("westernBraidTie", { height: B.band * H, diameter: thick * 1.25, tessellation: 7 }, scene), tieMat);
  tie.position.copyFrom(foot);
  tie.rotation.x = lean(1);
  const tuft = put(MeshBuilder.CreateCylinder("westernBraidTuft", { height: B.tuft * H, diameterTop: thick * 0.8, diameterBottom: thick * 1.1, tessellation: 6 }, scene), hair);
  const down = tangent(1);
  tuft.position.copyFrom(foot.add(down.scale(B.band * H * 0.5 + B.tuft * H * 0.5)));
  tuft.rotation.x = lean(1);
  for (const m of out) m.convertToFlatShadedMesh();
  return out;
}

/*
 * [S] 455 the Dynamite Thrower's team shirt (CONFIRM 454 dynamite_thrower a.1-2: "team-colour shirt on the torso renders olive-brown, not red" and "the
 * arms are bare skin sticks from shoulder to hand - TABS: long dark team-colour sleeves down to the wrist, only the hands in skin colour"; card Appearance
 * "a team color shirt"; wild_west.dynamite_thrower.blue.png: a dark team shirt on the trunk, its sleeves full to the wrist). The secret_bandit body cloth
 * blends the team colour toward brown (LESSONS 449), so every body-cloth mesh but the head and hands wears team cloth, the team colour times
 * DYNAMITE_SHIRT.shade, self-lit .glow; sleeves over both arms to the wrist in the same cloth times .sleeveShade, .upperOut of the upper arm round,
 * .lowerOut of the forearm.
 */
const DYNAMITE_SHIRT = { shade: 0.85, sleeveShade: 0.7, glow: 0.12, upperOut: 1.22, lowerOut: 1.2 };

/** The Dynamite Thrower's team shirt with full sleeves to the wrist (spec at DYNAMITE_SHIRT). */
export function dynamiteShirt(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = DYNAMITE_SHIRT;
  const mf = getMaterialFactory();
  const c = teamColor.scale(S.shade), sc = teamColor.scale(S.sleeveShade);
  const cloth = mf.get("cloth", c, { emissive: c.scale(S.glow) });
  const sleeve = mf.get("cloth", sc, { emissive: sc.scale(S.glow) });
  for (const m of body.allMeshes) if (m.material === body.bodyMaterial && m !== body.headMesh && !/Hand/.test(m.name)) m.material = cloth;
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "dynamiteSleeve", arm, 0, 1, S.upperOut, sleeve));
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) out.push(limbShell(scene, "dynamiteSleeve", arm, 0, 1, S.lowerOut, sleeve));
  return out;
}

/*
 * [S] 455 the Miner's overall legs (CONFIRM 452 miner a.2: "bare team skin from a thin navy waistband down to the boots - TABS: dark team-shade overall
 * legs running into the boots"; wild_west.miner.blue.png: the overall trousers a dark team shade from the waist, straight full legs, tucked into the
 * boot tops). MINER_LEGS: the pelvis, thighs and shins in dark team cloth (the team colour times .shade, self-lit .glow); a 6-sided trouser leg .out of
 * the thigh's half-width round it its whole length, and on the shin .shinOut round from its top to .shinTo of it, inside the boot's turned top.
 */
const MINER_LEGS = { shade: 0.55, glow: 0.12, out: 1.18, shinOut: 1.12, shinTo: 0.3 };

/** The Miner's dark team overall legs, from the waist into the boots (spec at MINER_LEGS). */
export function minerLegs(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const L = MINER_LEGS;
  const c = teamColor.scale(L.shade);
  const cloth = getMaterialFactory().get("cloth", c, { emissive: c.scale(L.glow) });
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) {
    thigh.material = cloth;
    out.push(limbShell(scene, "minerTrouser", thigh, 0, 1.04, L.out, cloth));
  }
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    shin.material = cloth;
    out.push(limbShell(scene, "minerTrouser", shin, 0, L.shinTo, L.shinOut, cloth));
  }
  for (const m of body.hip.getChildMeshes(true)) if (/_pelvis$/.test(m.name) && m instanceof Mesh) m.material = cloth;
  return out;
}

/*
 * [S] 455 the Miner's sleeves and gloves (CONFIRM 452 miner a.4: "bare skin arms - TABS: dark team-colour sleeves ending in tan glove cuffs";
 * wild_west.miner.red.png: dark team sleeves from the shoulder down the forearm, then tan leather work gloves with a wide flared cuff over the wrist).
 * MINER_SLEEVES: the upper arm .upperOut of its half-width round its whole length and the forearm .lowerOut round to .cuffFrom of it, in the dark team
 * cloth (MINER_LEGS.shade); a glove cuff .cuffOut round from .cuffFrom to the wrist and the hands in tan leather .glove, self-lit .glow.
 */
const MINER_SLEEVES = { upperOut: 1.22, lowerOut: 1.18, cuffFrom: 0.55, cuffOut: 1.55, glove: new Color3(0.72, 0.5, 0.26), glow: 0.15 };

/** The Miner's dark team sleeves ending in tan glove cuffs, tan gloved hands (spec at MINER_SLEEVES). */
export function minerSleeves(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = MINER_SLEEVES;
  const mf = getMaterialFactory();
  const c = teamColor.scale(MINER_LEGS.shade);
  const cloth = mf.get("cloth", c, { emissive: c.scale(MINER_LEGS.glow) });
  const glove = mf.get("cloth", S.glove, { emissive: S.glove.scale(S.glow) });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "minerSleeve", arm, 0, 1, S.upperOut, cloth));
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "minerSleeve", arm, 0, S.cuffFrom + 0.02, S.lowerOut, cloth));
    out.push(limbShell(scene, "minerGloveCuff", arm, S.cuffFrom, 1, S.cuffOut, glove));
  }
  for (const hand of [body.leftHand, body.rightHand]) {
    for (const m of hand.getChildMeshes(true)) if (m instanceof Mesh && /_[lr]HandM$/.test(m.name)) m.material = glove;
  }
  return out;
}

/*
 * [S] 455 the Lasso rider's moustache (CONFIRM 454 lasso a.2: "the face directly under the eyes is plain - TABS: a big dark curled fancy mustache right
 * under the eyes, readable at distance"; card Appearance "a fancy mustache"; wild_west.lasso.red.png: a thick black moustache under the eyes, wider than
 * the mouth, each half running out level and curling up at its end into a round loop). LASSO_MOUSTACHE in the head's own box (e its half sizes, c its
 * centre, +z the face): each half a faceted bar .long of e.x long, .thick of e.y tall, from the middle out along a line drooping .droop rad, its middle
 * .at of e.y under the centre and .proud of e.z in front of the face; at its outer end an upturned curl, a ring .curl of e.x across and .curlThick of
 * e.y thick standing in the face's plane, sat on the bar's end. Near black, self-lit .glow.
 */
const LASSO_MOUSTACHE = { long: 0.66, thick: 0.26, droop: 0.12, at: -0.36, proud: 0.08, curl: 0.36, curlThick: 0.13, color: new Color3(0.05, 0.045, 0.04), glow: 0.1 };

/** The Lasso rider's dark curled moustache under the eyes (spec at LASSO_MOUSTACHE). */
export function lassoMoustache(scene: Scene, body: ArticulatedBody): Mesh[] {
  const M = LASSO_MOUSTACHE;
  const hair = getMaterialFactory().get("cloth", M.color, { emissive: M.color.scale(M.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const y = c.y + e.y * M.at, z = c.z + e.z * (1 + M.proud);
  const out: Mesh[] = [];
  for (const side of [-1, 1]) {
    const L = e.x * M.long;
    const bar = MeshBuilder.CreateBox("lassoMoustache", { width: L, height: e.y * M.thick, depth: e.z * 0.16 }, scene);
    bar.position.set(c.x + side * (L / 2) * Math.cos(M.droop), y - (L / 2) * Math.sin(M.droop), z);
    bar.rotation.z = -side * M.droop;
    bar.material = hair;
    bar.parent = head;
    bar.convertToFlatShadedMesh();
    out.push(bar);
    const r = e.x * M.curl * 0.5;
    const curl = MeshBuilder.CreateTorus("lassoMoustacheCurl", { diameter: r * 2, thickness: e.y * M.curlThick, tessellation: 8 }, scene);
    curl.rotation.x = Math.PI / 2;
    curl.position.set(c.x + side * (L * Math.cos(M.droop) + r * 0.6), y - L * Math.sin(M.droop) + r * 0.8, z);
    curl.material = hair;
    curl.parent = head;
    curl.convertToFlatShadedMesh();
    out.push(curl);
  }
  return out;
}
