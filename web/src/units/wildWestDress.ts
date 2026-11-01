import { Scene, Color3, Mesh, MeshBuilder, VertexBuffer, type Material } from "@babylonjs/core";
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
 * [S] 447 the Miner's cap (critic 446 miner a.1: "black top hat with a headlamp - TABS: team miner's cap, tall dome crown, front peak";
 * wild_west.miner.red.png: a team-coloured cap whose round crown rises well over the head, wider than it, and a stiff peak jutting out over the
 * eyes, tilted up a little; no lamp). MINER_CAP, in the head's width W and height H: a wall .wall W across from the seat to the head top, so it clears
 * the block head's chamfered corners; on it a dome .dome W across rising .rise H over the head top (447.3b: .29 read as a flat cap),
 * its lower half inside the wall; a peak .peak W wide and .peakLong W out front at the seat, .thick H thick, tipped up .tip rad. Team colour times
 * .shade, self-lit .glow.
 */
const MINER_CAP = { sides: 12, wall: 1.42, dome: 1.38, rise: 0.72, peak: 1.0, peakLong: 0.55, thick: 0.05, tip: 0.22, shade: 0.9, glow: 0.12 };

/** The miner's cap (spec at MINER_CAP), in the hat's units; `seat` under the head top. Returns the wall. */
export function buildMinerCap(scene: Scene, W: number, H: number, seat: number, unit: number, teamColor?: Color3): Mesh {
  const C = MINER_CAP;
  const u = (v: number) => v / unit;
  const team = (teamColor ?? new Color3(0.5, 0.5, 0.55)).scale(C.shade);
  const felt = getMaterialFactory().get("cloth", team, { emissive: team.scale(C.glow) });
  const wallTall = -seat;
  const wall = MeshBuilder.CreateCylinder("minerCapWall", { height: u(wallTall), diameterBottom: u(C.wall * W), diameterTop: u(C.dome * W), tessellation: C.sides }, scene);
  wall.position.y = u(seat + wallTall * 0.5);
  wall.material = felt;
  wall.convertToFlatShadedMesh();
  const dome = MeshBuilder.CreateSphere("minerCapDome", { diameter: u(C.dome * W), segments: 6 }, scene);
  dome.scaling.y = (2 * C.rise * H) / (C.dome * W);
  dome.position.y = u(wallTall * 0.5);
  dome.material = felt;
  dome.convertToFlatShadedMesh();
  dome.parent = wall;
  const peak = MeshBuilder.CreateBox("minerCapPeak", { width: u(C.peak * W), height: u(C.thick * H), depth: u(C.peakLong * W) }, scene);
  peak.rotation.x = -C.tip;
  peak.position.set(0, u(-wallTall * 0.5 + C.thick * H * 0.5), u(C.wall * W * 0.5 + C.peakLong * W * 0.4));
  peak.material = felt;
  peak.convertToFlatShadedMesh();
  peak.parent = wall;
  return wall;
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

/** The Gunslinger's team suit jacket: full sleeves with beige cuffs, a shirt V and two lapels (spec at GUNSLINGER_JACKET). */
export function gunslingerJacket(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const J = GUNSLINGER_JACKET;
  const mf = getMaterialFactory();
  const cloth = body.bodyMaterial;
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
