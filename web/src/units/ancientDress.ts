import { Scene, Color3, Mesh, MeshBuilder, TransformNode, Vector3, Quaternion } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { trunkBand, jitterVertices } from "./tribalDress";
import { limbShell } from "./medievalDress";

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
/*
 * [S] 386 the scrolled belt (ancient.minotaur.red.png: a tall team girdle at the hips, a dark brown-red rim band along its foot and a thin one at its
 * top, and on its front two big lighter scrolls wound outward from the middle like a ram's horns, each outlined darker, a small scroll beyond each;
 * critic 385: a plain flared band, the 383 curls unreadable, the chest tuft half under the sash). The belt MINO_SCROLL.tall of the trunk tall at .at;
 * the foot rim .foot of its height, the top rim .top, in team x .rimShade; per side a big scroll of .big of the belt's height round centred .bigAt of
 * the half width out, wound .turns from its outer end in, with a tail .tail of the half width long to the middle line, and a small one .small round at
 * .smallAt; each a light tube .line of the height thick (team lerped .light to white) over a dark outline tube .outline thick, .proud of a line off
 * the faces. The chest tuft at .tuftX of the chest half width on his right (+x, the sash runs from his left shoulder) at .tuftY of the trunk.
 */
const MINO_SCROLL = {
  tall: 0.24, at: 0.04, foot: 0.24, top: 0.1, rimShade: 0.42, big: 0.32, bigAt: 0.3, turns: 1.3, tail: 0.3, small: 0.22, smallAt: 0.74,
  line: 0.075, outline: 0.12, light: 0.55, proud: 1.4, tuftX: 0.55, tuftY: 0.6,
};
const MINO_PAULDRON = { wide: 0.42, tall: 0.55 };
const MINO_SASH = { sash: 0.3, thick: 0.03, buckle: 0.17, tuft: 0.22 };
/*
 * [S] the minotaur's gear redone (383; ancient.minotaur.red.png: a patterned team pauldron on his left shoulder, a broad tan sash with a chunky grey
 * square buckle, a scrolled team belt; critic 382: a plain light-blue dome on the wrong shoulder, a thin fur-toned sash, a tiny white diamond buckle, a
 * plain belt). In the pauldron's width pw: the top slab .padWide x .padThick x .padDeep tilted .padTilt rad down outward, the flap .flap of pw tall bent
 * .flapTilt rad; the belt's rims .rim of its height, .curls scroll pairs at those shares of its half width, each .curl of its height round, wound .turns,
 * .thick of it thick; the sash MINO_SASH.sash of the trunk wide in MINO_LEATHER; the buckle .buckle of the trunk across, its bars .bar of that.
 */
const MINO_GEAR = { padWide: 1.25, padThick: 0.18, padDeep: 1.15, padTilt: 0.32, flap: 0.6, flapTilt: 0.35, rim: 0.2, curls: [0.22, 0.62], curl: 0.3, turns: 1.1, thick: 0.06, buckle: 0.3, bar: 0.24 };
/*
 * [S] the pauldron as one curved shell seated on the deltoid (385; ancient.minotaur.red.png: a team plate wrapped over his left shoulder top and down its
 * outer side, a darker rim along its foot, a lighter team scroll on its face; critic 383: a tilted plank sticking up off the shoulder with a dark block
 * standing off behind it). Spec at the build (dressMinotaur): radius, deep, low, over, thick, inX, atY, rim, scroll, scrollAt.
 */
const MINO_SHELL = { radius: 0.78, deep: 1.35, low: 0.55, over: 0.25, thick: 0.1, inX: 0.82, atY: 0.86, rim: 0.16, scroll: 0.2, scrollAt: 0.45 };
const MINO_LEATHER = new Color3(0.66, 0.46, 0.3);
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
  const K = MINO_SCROLL;
  const waist = trunkBand(body, K.at - K.tall / 2, K.at + K.tall / 2 + 0.05);
  const deep = (waist.maxZ - waist.minZ) / 2;
  const tall = waist.trunk * K.tall;
  const belt = MeshBuilder.CreateCylinder("minoBelt", { height: tall, diameter: 2, tessellation: B.sides }, scene);
  belt.scaling.set(waist.halfX * B.proud, 1, deep * B.proud);
  belt.position.set(waist.midX, waist.trunk * K.at, (waist.minZ + waist.maxZ) / 2);
  belt.convertToFlatShadedMesh();
  add(belt, body.torso);
  // [S] 386 (MINO_SCROLL): a deep rim along the foot and a thin one at the top, two big outlined scrolls wound out from the middle, a small one beyond
  const G = MINO_GEAR;
  const dark = mf.get("cloth", teamColor.scale(K.rimShade), { emissive: teamColor.scale(0.05) });
  const lightScroll = Color3.Lerp(teamColor, new Color3(1, 1, 1), K.light);
  const scrollMat = mf.get("cloth", lightScroll, { emissive: lightScroll.scale(0.2) });
  const beltY = waist.trunk * K.at;
  for (const [share, y] of [[K.foot, -1], [K.top, 1]]) {
    const rimBand = MeshBuilder.CreateCylinder("minoBeltRim", { height: tall * share, diameter: 2, tessellation: B.sides }, scene);
    rimBand.scaling.set(waist.halfX * B.proud * 1.05, 1, deep * B.proud * 1.05);
    rimBand.position.set(waist.midX, beltY + y * tall * (0.5 - share / 2), (waist.minZ + waist.maxZ) / 2);
    rimBand.convertToFlatShadedMesh();
    add(rimBand, body.torso, dark);
  }
  const frontZ = (waist.minZ + waist.maxZ) / 2 + deep * B.proud;
  // on the octagon's front faces: z falls .414 of the way out from its front ridge
  const faceZ = (x: number, lift: number) => frontZ - 0.414 * Math.abs(x - waist.midX) * (deep / waist.halfX) + lift;
  // the band's open middle, between the rims
  const midY = beltY + tall * (K.foot - K.top) / 2;
  for (const mirror of [-1, 1]) {
    const spiral = (cxShare: number, round: number, tail: boolean): Vector3[] => {
      const cx = waist.midX + mirror * cxShare * waist.halfX;
      const pts: Vector3[] = [];
      if (tail) pts.push(new Vector3(waist.midX + mirror * waist.halfX * 0.02, midY - tall * round * 0.9, 0));
      for (let i = 0; i <= 20; i++) {
        const t = i / 20, rho = tall * round * (1 - 0.8 * t), phi = -Math.PI / 2 - mirror * Math.PI * 2 * K.turns * t;
        pts.push(new Vector3(cx + Math.cos(phi) * rho * mirror, midY + Math.sin(phi) * rho, 0));
      }
      return pts;
    };
    for (const [cxShare, round, tail] of [[K.bigAt, K.big, true], [K.smallAt, K.small, false]] as const) {
      const pts = spiral(cxShare, round, tail);
      for (const [r, m, lift] of [[K.outline, dark, 1], [K.line, scrollMat, 1 + K.line * K.proud / K.outline]] as const) {
        const path = pts.map((p) => new Vector3(p.x, p.y, faceZ(p.x, tall * r * lift)));
        add(MeshBuilder.CreateTube("minoBeltScroll", { path, radius: tall * r, tessellation: 4, cap: 2 }, scene), body.torso, m);
      }
    }
  }

  // the chest: its box at the breastbone, for the sash, buckle and tuft
  const chest = trunkBand(body, 0.45, 0.85);
  const front = chest.maxZ;
  // the tuft of chest hair on the breastbone
  const S = MINO_SASH;
  // [S] 385: a ragged clump of dark spikes fanned out from the breastbone (ancient.minotaur.red.png), not a flat chip hidden under the sash
  for (let k = 0; k < 7; k++) {
    const ang = -Math.PI / 2 + (Math.PI * 2 * k) / 7 + 0.3;
    const len = chest.halfX * S.tuft * (k % 2 ? 1.6 : 2.3);
    const spike = MeshBuilder.CreateCylinder("minoChestHair", { height: len, diameterTop: 0, diameterBottom: len * 0.55, tessellation: 3 }, scene);
    spike.scaling.z = 0.25;
    spike.rotation.z = ang - Math.PI / 2;
    spike.position.set(chest.midX + chest.halfX * K.tuftX + Math.cos(ang) * len * 0.45, chest.trunk * K.tuftY + Math.sin(ang) * len * 0.45, front + 0.01);
    add(spike, body.torso, darkFur);
  }

  // the pauldron on his left shoulder (the render's right) (MINO_PAULDRON)
  const P = MINO_PAULDRON;
  // [S] 383: body -x is his left (the 378 +x put it on his right in _idle, critic 382)
  const side = -1;
  const pw = chest.halfX * 2 * P.wide;
  // [S] 385 (MINO_SHELL): one curved team shell seated on the deltoid, not a slab tilted up off it: a quarter-round plate from over the shoulder top
  // round and down its outer side, its axis front to back through the shoulder; a darker rim flush along its lower edge, a lighter scroll inlaid on its
  // outer face. In the plate's width pw: radius .radius, .deep front to back, from .low rad under the horizontal outside to .over rad past the top
  // toward the neck, .thick thick; the centre .inX of the chest half width out at .atY of the trunk; the scroll .scroll of pw round at .scrollAt rad up.
  const M = MINO_SHELL;
  const R = pw * M.radius, D = pw * M.deep;
  const cx = chest.midX + side * chest.halfX * M.inX, cy = chest.trunk * M.atY, cz = (chest.minZ + chest.maxZ) / 2;
  // angles in the torso's xy plane measured from straight out (side x) toward up (+y)
  const a0 = -M.low, a1 = Math.PI / 2 + M.over;
  const rimPath = (r: number, a: number) => new Vector3(cx + side * Math.cos(a) * r, cy + Math.sin(a) * r, 0);
  const shellPaths: Vector3[][] = [];
  for (const z of [-D / 2, D / 2]) {
    for (const r of [R, R + pw * M.thick]) {
      const row: Vector3[] = [];
      for (let i = 0; i <= 8; i++) row.push(rimPath(r, a0 + ((a1 - a0) * i) / 8).add(new Vector3(0, 0, cz + z)));
      shellPaths.push(row);
    }
  }
  // a closed slab bent round the shoulder: inner front, outer front, outer back, inner back, back to the inner front
  const ring = [shellPaths[0], shellPaths[1], shellPaths[3], shellPaths[2], shellPaths[0]];
  const shell = MeshBuilder.CreateRibbon("minoPauldron", { pathArray: ring, closeArray: false, closePath: false, sideOrientation: Mesh.DOUBLESIDE }, scene);
  shell.convertToFlatShadedMesh();
  add(shell, body.torso);
  const rimBox = MeshBuilder.CreateBox("minoPauldronRim", { width: pw * M.thick * 1.6, height: pw * M.rim, depth: D * 1.02 }, scene);
  const rimAt = rimPath(R + pw * M.thick * 0.5, a0 + M.rim * 0.5);
  rimBox.position.set(rimAt.x, rimAt.y, cz);
  rimBox.rotation.z = side * a0;
  add(rimBox, body.torso, dark);
  // the scroll inlaid on the outer face, wound in the face's own plane (front-back and along the arc)
  const sa = M.scrollAt;
  const out1 = new Vector3(side * Math.cos(sa), Math.sin(sa), 0);
  const along = new Vector3(-side * Math.sin(sa), Math.cos(sa), 0);
  const centre = rimPath(R + pw * M.thick * 1.15, sa).add(new Vector3(0, 0, cz));
  const padPath: Vector3[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, rho = pw * M.scroll * (1 - 0.75 * t), phi = Math.PI * 2 * 1.1 * t;
    padPath.push(centre.add(new Vector3(0, 0, Math.cos(phi) * rho)).add(along.scale(Math.sin(phi) * rho)).add(out1.scale(pw * 0.01)));
  }
  add(MeshBuilder.CreateTube("minoPauldronScroll", { path: padPath, radius: pw * 0.045, tessellation: 4, cap: 2 }, scene), body.torso, light);

  // the sash, from that shoulder across the chest down to the other hip, laid on the chest's front
  const top = { x: chest.midX + side * chest.halfX * 0.75, y: chest.trunk * 0.95 };
  const foot = { x: chest.midX - side * chest.halfX * 0.85, y: chest.trunk * 0.12 };
  const len = Math.hypot(top.x - foot.x, top.y - foot.y);
  const sash = MeshBuilder.CreateBox("minoSash", { width: chest.halfX * 2 * S.sash, height: len, depth: S.thick * chest.halfX }, scene);
  sash.position.set((top.x + foot.x) / 2, (top.y + foot.y) / 2, front + S.thick * chest.halfX * 0.5);
  sash.rotation.z = Math.atan2(top.x - foot.x, top.y - foot.y) * -1;
  add(sash, body.torso, leather);
  // [S] 383 (MINO_GEAR): a chunky grey square frame buckle, four bars round an open middle the sash shows through, and a prong, high on the sash
  // toward the pauldron
  const bw = chest.halfX * 2 * G.buckle, bar = bw * G.bar, bd = S.thick * chest.halfX * 3;
  const bu = 0.68;
  const bx = foot.x + (top.x - foot.x) * bu, by = foot.y + (top.y - foot.y) * bu;
  const holder = new TransformNode("minoBuckle", scene);
  holder.parent = body.torso;
  holder.position.set(bx, by, front + S.thick * chest.halfX + bd / 2);
  holder.rotation.z = sash.rotation.z;
  for (const [w, h, x, y] of [[bw, bar, 0, (bw - bar) / 2], [bw, bar, 0, -(bw - bar) / 2], [bar, bw, (bw - bar) / 2, 0], [bar, bw, -(bw - bar) / 2, 0]]) {
    const b = MeshBuilder.CreateBox("minoBuckle", { width: w, height: h, depth: bd }, scene);
    b.position.set(x, y, 0);
    add(b, holder, iron);
  }
  const prong = MeshBuilder.CreateBox("minoBuckleProng", { width: bw * 0.55, height: bar * 0.6, depth: bd * 0.7 }, scene);
  prong.position.set(bw * 0.15, 0, bd * 0.1);
  add(prong, holder, iron);
  return out;
}

/*
 * [S] Zeus's beard and locks (379; ancient.zeus.red.png, card Appearance "luscious locks of dirty blond hair and grand beard with hairs that resemble
 * lightning bolts ... an olive wreath around the sides of their head"; critic 378: no beard, a short brown cap, a flat green band). In the head's half
 * extents (x across, y up, z his front), all dirty blond ZEUS_HAIR self-lit .glow:
 *   - the beard (rebuilt 387, spec at ZEUS_BEARD);
 *   - ZEUS_LOCKS.strands bolt locks all round the back and sides from .rootY of the half height (none over the face, a gap of .face rad each side of
 *     the front), .long head heights long to the shoulders, .thick at the root;
 *   - the laurel hat's cap recoloured blond (it carries the wreath), and .leaves olive leaf clumps along each temple under the wreath.
 */
const ZEUS_HAIR = new Color3(0.62, 0.48, 0.3);
const ZEUS_HAIR_GLOW = 0.16;
/*
 * [S] 387 the beard rebuilt as a dense shaggy mass (ancient.zeus.red.png: a huge dirty-blond beard from the cheeks under the eyes and the chin down to
 * mid-chest, a heap of jagged bolt-like flakes; critic 386: a sparse fringe of thin pale needle strands). In the head's half extents e:
 *   - the jaw mass ZEUS_BEARD.jaw of e, its middle .jawY down and .jawZ ahead; a bib mass .bib of e below it, its middle .bibY down, .bibZ ahead;
 *   - .rows rows of .perRow broad flat zig-zag slabs over them, from .top to .foot of e.y, each round an arc of .arc rad (narrowing .narrow toward
 *     the foot), .halfW of e.x out to a side; a slab two flat links .slab (W across, H long, W thick), the lower one bent .kink rad aside, tilted
 *     up to .tilt rad at random, leaning its foot out .lean rad; every other slab a shade .dark darker.
 */
const ZEUS_BEARD = {
  jaw: [1.22, 0.7, 0.72] as const, jawY: 0.62, jawZ: 0.5, bib: [0.95, 0.95, 0.55] as const, bibY: 1.75, bibZ: 0.62,
  rows: 6, perRow: 7, top: -0.25, foot: -2.65, arc: 1.45, narrow: 0.45, halfW: 1.22, slab: [0.24, 0.3, 0.05] as const, kink: 0.55, tilt: 0.45, lean: 0.3, dark: 0.82,
};
const ZEUS_LOCKS = { strands: 16, rootY: 0.3, face: 0.95, long: 1.05, thick: 0.2 };
const ZEUS_LEAF = { leaves: 4, size: 0.16, color: new Color3(0.38, 0.52, 0.2) };

function shareOf(seed: number, i: number): number {
  const v = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

/*
 * [S] Zeus's toga (385; ancient.zeus.red.png: a bright white toga over his left shoulder only, draped diagonally across the chest to the right hip, the
 * right shoulder and chest bare team skin; a gold lightning emblem on the left shoulder; a triple gold belt round the waist over the white knee skirt;
 * critic 378: a grey box vest over both shoulders and a brown strap). The trunk turns to bare skin; on the torso joint, round the trunk's box (one box
 * over the whole trunk, trunkBand 0-1):
 *   - the drape: a band round the trunk .proud of its half extents (a rounded box section, exponent .round), its middle line falling from .high of the
 *     trunk at his left side (-x) to .low at his right, .wide of the trunk tall, clamped under .top of the trunk so it lies over the shoulder;
 *   - the emblem: a gold zig-zag of .bolt links .boltLong of the trunk long on the drape's front at his left shoulder;
 *   - the belt: .rings gold rings .ring of the trunk tall at .beltAt of it, .ringProud out, a hair's gap between them.
 * White and gold fixed (not team), self-lit .glow. The pelvis and skirt keep the white body cloth.
 * [S] 388 the toga filled (ancient.zeus.red.png: the white covers all the trunk below the diagonal, from over his left shoulder down to his right hip,
 * to the belt; the bolt a bright orange-gold zig-zag on the shoulder; critic 387: a band half the trunk wide, bare belly above the belt, emblem thin
 * and dark): the drape's lower edge now runs level at .foot of the trunk (just under the belt), its upper edge the diagonal from .edgeHigh of the trunk
 * at his left side to .edgeLow at his right (clamped under .top); the bolt .bolt links .boltLong of the trunk long, .boltWide of a link step wide, at
 * .boltX of the half width out on his left, on a flat unlit material (out of ACES) in .boltGold.
 */
const ZEUS_TOGA = {
  proud: 1.07, round: 4, foot: 0.0, edgeHigh: 1.45, edgeLow: 0.24, top: 1.04, segs: 28,
  bolt: 3, boltLong: 0.36, boltWide: 0.5, boltX: 0.62, rings: 3, ring: 0.045, beltAt: 0.05, ringProud: 1.12,
  boltGold: new Color3(1.25, 0.72, 0.2),
  white: new Color3(0.94, 0.94, 0.92), gold: new Color3(0.86, 0.56, 0.24), glow: 0.14,
};

/** Zeus's white toga over the left shoulder, gold bolt emblem and triple gold belt (spec at ZEUS_TOGA), on the torso. */
export function dressZeusToga(scene: Scene, body: ArticulatedBody): Mesh[] {
  const T = ZEUS_TOGA;
  const out: Mesh[] = [];
  const mf = getMaterialFactory();
  const white = mf.get("cloth", T.white, { emissive: T.white.scale(T.glow) });
  white.backFaceCulling = false;
  const gold = mf.get("cloth", T.gold, { emissive: T.gold.scale(T.glow) });
  body.torsoMesh.material = body.skinMaterial;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke$|zeusSash/.test(m.name)) m.material = body.skinMaterial;
  const band = trunkBand(body, 0, 1);
  const halfZ = (band.maxZ - band.minZ) / 2, midZ = (band.minZ + band.maxZ) / 2;
  const tr = band.trunk;
  // a rounded-box section point at angle a, x .proud of the half width
  const rim = (a: number, p: number) => {
    const c = Math.cos(a), s = Math.sin(a);
    const e = 2 / T.round;
    return { x: band.midX + band.halfX * p * Math.sign(c) * Math.abs(c) ** e, z: midZ + halfZ * p * Math.sign(s) * Math.abs(s) ** e };
  };
  // the upper edge: the diagonal, high at his left (-x), low at his right
  const edgeAt = (x: number) => {
    const u = (x - band.midX) / band.halfX; // -1 his left, +1 his right
    return tr * Math.min(T.top, T.edgeHigh + (T.edgeLow - T.edgeHigh) * (u + 1) / 2);
  };
  const upper: Vector3[] = [], lower: Vector3[] = [];
  for (let i = 0; i <= T.segs; i++) {
    const a = (Math.PI * 2 * i) / T.segs;
    const p = rim(a, T.proud);
    upper.push(new Vector3(p.x, edgeAt(p.x), p.z));
    lower.push(new Vector3(p.x, tr * T.foot, p.z));
  }
  const drape = MeshBuilder.CreateRibbon("zeusToga", { pathArray: [upper, lower], sideOrientation: Mesh.DOUBLESIDE }, scene);
  drape.convertToFlatShadedMesh();
  drape.material = white;
  drape.parent = body.torso;
  out.push(drape);
  // the shoulder cap: the drape's top closed over his left shoulder
  const cap = MeshBuilder.CreateBox("zeusTogaShoulder", { width: band.halfX * 0.9, height: tr * 0.06, depth: halfZ * 2 * T.proud }, scene);
  cap.position.set(band.midX - band.halfX * 0.55, tr * T.top, midZ);
  cap.material = white;
  cap.parent = body.torso;
  out.push(cap);
  // the gold bolt emblem on the front at his left shoulder
  const frontZ = midZ + halfZ * T.proud + 0.004;
  const step = tr * T.boltLong / T.bolt;
  const boltMat = mf.get("unlit", T.boltGold, { emissive: T.boltGold });
  let at = new Vector3(band.midX - band.halfX * T.boltX, tr * 0.97, frontZ);
  for (let k = 0; k < T.bolt; k++) {
    const to = at.add(new Vector3((k % 2 ? 1 : -1) * step * 0.55, -step, 0));
    const d = to.subtract(at);
    const link = MeshBuilder.CreateBox("zeusTogaBolt", { width: step * T.boltWide, height: d.length() * 1.15, depth: 0.012 }, scene);
    link.position.set((at.x + to.x) / 2, (at.y + to.y) / 2, frontZ);
    link.rotation.z = -Math.atan2(d.x, -d.y);
    link.material = boltMat;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(link);
    link.parent = body.torso;
    out.push(link);
    at = to;
  }
  // the triple gold belt
  for (let k = 0; k < T.rings; k++) {
    const ring = MeshBuilder.CreateCylinder("zeusBelt", { height: tr * T.ring, diameter: 2, tessellation: 10 }, scene);
    ring.scaling.set(band.halfX * T.ringProud, 1, halfZ * T.ringProud);
    ring.position.set(band.midX, tr * (T.beltAt + (k - 1) * T.ring * 1.25), midZ);
    ring.convertToFlatShadedMesh();
    ring.material = gold;
    ring.parent = body.torso;
    out.push(ring);
  }
  return out;
}

/*
 * [S] Zeus's bare legs in strap sandals (386; ancient.zeus.red.png: bare team legs from the skirt's hem to the feet, short brown strap sandals with a
 * strap round the ankle; card "Zeus also wears short sandals"; critic 378: dark-blue trousers and grey boots). The four leg meshes take the body's
 * skin (the clothed branch had painted them trousers), the feet the hoplite's strapSandals in ZEUS_SANDAL.brown, plus ZEUS_SANDAL.laces thin brown
 * bands round each shin at those shares of its length (the sandal's ankle wrap), .lace long, .out of its half-width; self-lit .glow.
 */
const ZEUS_SANDAL = { laces: [0.86, 0.95], lace: 0.05, out: 1.14, brown: new Color3(0.44, 0.24, 0.13), glow: 0.12 };

/** Zeus's bare team legs and short brown strap sandals (spec at ZEUS_SANDAL). */
export function zeusLegs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = ZEUS_SANDAL;
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) leg.material = body.skinMaterial;
  const lace = getMaterialFactory().get("cloth", S.brown, { emissive: S.brown.scale(S.glow) });
  const out = strapSandals(scene, body, S.brown, S.glow, "zeus");
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    for (const at of S.laces) out.push(limbShell(scene, "zeusSandalLace", shin, at, at + S.lace, S.out, lace));
  }
  return out;
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
  // the jaw and bib masses (spec at ZEUS_BEARD)
  const B = ZEUS_BEARD;
  const darkHair = mf.get("cloth", ZEUS_HAIR.scale(B.dark), { emissive: ZEUS_HAIR.scale(B.dark * ZEUS_HAIR_GLOW) });
  const jaw = MeshBuilder.CreateIcoSphere("zeusBeard", { radius: 1, subdivisions: 1, flat: true }, scene);
  jitterVertices(jaw, 0.16, 61.7, e.x * B.jaw[0], e.y * B.jaw[1], e.z * B.jaw[2]);
  jaw.position.set(0, -e.y * B.jawY, e.z * B.jawZ);
  put(jaw);
  const bib = MeshBuilder.CreateIcoSphere("zeusBeardBib", { radius: 1, subdivisions: 1, flat: true }, scene);
  jitterVertices(bib, 0.2, 17.3, e.x * B.bib[0], e.y * B.bib[1], e.z * B.bib[2]);
  bib.position.set(0, -e.y * B.bibY, e.z * B.bibZ);
  put(bib, darkHair);
  // the shag: rows of broad flat zig-zag slabs over both, cheeks to mid-chest
  for (let r = 0; r < B.rows; r++) {
    const u = r / (B.rows - 1);
    const y = e.y * (B.top + (B.foot - B.top) * u);
    const arc = B.arc * (1 - B.narrow * u);
    // the surface ahead: the jaw's front at the top rows, the bib's below
    const depth = u < 0.35 ? e.z * (B.jawZ + B.jaw[2] * 0.85) : e.z * (B.bibZ + B.bib[2] * 0.85);
    for (let i = 0; i < B.perRow; i++) {
      const k = r * B.perRow + i;
      const a = ((i + 0.5 + (r % 2) * 0.5) / (B.perRow + 0.5) - 0.5) * 2 * arc;
      const slab = new TransformNode("zeusBeardSlab", scene);
      slab.parent = head;
      slab.position.set(Math.sin(a) * e.x * B.halfW * (1 - 0.3 * u), y, Math.cos(a) * depth);
      slab.rotation.set(-B.lean, a, (shareOf(5.7, k) - 0.5) * 2 * B.tilt);
      const mat = k % 2 ? darkHair : hair;
      const sw = W * B.slab[0] * (0.8 + 0.4 * shareOf(2.9, k)), sl = H * B.slab[1] * (0.85 + 0.3 * shareOf(8.1, k)), st = W * B.slab[2];
      const upper = MeshBuilder.CreateBox("zeusBeardFlake", { width: sw, height: sl, depth: st }, scene);
      upper.position.y = -sl * 0.4;
      upper.parent = slab;
      upper.material = mat;
      out.push(upper);
      const side = shareOf(4.4, k) > 0.5 ? 1 : -1;
      const lower = MeshBuilder.CreateBox("zeusBeardFlake", { width: sw * 0.7, height: sl * 0.8, depth: st }, scene);
      lower.position.set(side * sw * 0.25, -sl * 1.15, st * 0.3);
      lower.rotation.z = side * B.kink;
      lower.parent = slab;
      lower.material = mat;
      out.push(lower);
    }
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

/*
 * [S] the sarissa's cape (383; ancient.sarissa.png, .red.png: a dark team cape from the shoulders to the calves hanging down his back and out past
 * both arms, a thick folded collar round the neck over the shoulders; critic 378: no cape). On the torso joint, in the trunk's box at the shoulders:
 *   - the cape an open shell SARISSA_CAPE.arc of a turn round his back, .out of the trunk's half extents at the top, flaring .flare at the hem, from
 *     .top of the trunk down to .hem of the leg's length under the hip line (the calves), .sides facets;
 *   - the collar a frustum round the neck, .collar of the trunk tall, from .neck of the shoulder span across at its top out to .collarOut at its foot,
 *     a roll .roll of the trunk thick round its foot;
 * team cloth x .shade, self-lit .glow, double-sided.
 */
const SARISSA_CAPE = { arc: 0.56, out: 1.18, flare: 1.45, top: 0.98, hem: 0.72, sides: 9, collar: 0.16, neck: 0.42, collarOut: 1.12, roll: 0.06, shade: 0.45, glow: 0.06 };
/*
 * [S] 387 the cape's folded collar (ancient.sarissa.red.png, .png: the cape's top gathered in a thick fold over his left shoulder and wrapped round onto
 * his chest, pinned there, the cape hanging down his back from it; critic 386: the cape hangs straight behind). In trunk heights and the shoulder span,
 * on the torso, the cape's cloth: a lumpy bulk .bulk of the trunk thick lying over the left shoulder top front to back (.bulkLong of the trunk's
 * depth, .bulkWide wide, at .bulkAt of the shoulder's x, .bulkUp over it, tipped .bulkTilt toward the neck); .folds thick drape folds off the
 * shoulder's front (.drapeFrom of its x) down across the upper chest past the breastbone, each .drapeLong of the span long, .drapeTall tall, .drapeDeep
 * proud, tilted .drapeTilt (high at the shoulder), from .drapeDown under the shoulder; a gold brooch .brooch across pinning it at the shoulder.
 */
const SARISSA_FOLD = {
  bulk: 0.2, bulkLong: 1.25, bulkWide: 1.5, bulkAt: 0.9, bulkUp: 0.05, bulkTilt: 0.25,
  folds: 2, drapeFrom: 0.85, drapeLong: 0.72, drapeTall: 0.13, drapeDeep: 0.09, drapeTilt: 0.42, drapeDown: 0.08, brooch: 0.09, gold: new Color3(0.82, 0.62, 0.25),
};

/** The sarissa's cape and folded collar (spec at SARISSA_CAPE), on the torso. */
export function dressSarissa(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const C = SARISSA_CAPE;
  const out: Mesh[] = [];
  const tone = teamColor.scale(C.shade);
  const cloth = getMaterialFactory().get("cloth", tone, { emissive: tone.scale(C.glow) });
  cloth.backFaceCulling = false;
  const put = (m: Mesh) => { m.material = cloth; m.convertToFlatShadedMesh(); m.parent = body.torso; out.push(m); return m; };
  const chest = trunkBand(body, 0.7, 1.0);
  const midZ = (chest.minZ + chest.maxZ) / 2, halfZ = (chest.maxZ - chest.minZ) / 2;
  const leg = Math.abs(body.leftKnee.position.y) * 2;
  const topY = chest.trunk * C.top, hemY = -leg * C.hem;
  const tall = topY - hemY;
  const cape = put(MeshBuilder.CreateCylinder("sarissaCape", { height: tall, diameterTop: 2, diameterBottom: 2 * C.flare, tessellation: C.sides, arc: C.arc, enclose: false, sideOrientation: Mesh.DOUBLESIDE }, scene));
  // the arc's gap to his front, the cloth round his back
  cape.rotation.y = Math.PI / 2 - Math.PI * C.arc;
  cape.scaling.set(chest.halfX * C.out, 1, halfZ * C.out);
  cape.position.set(chest.midX, (topY + hemY) / 2, midZ);
  const span = Math.abs(body.rightShoulder.position.x) + Math.abs(body.leftShoulder.position.x);
  const collarTall = chest.trunk * C.collar;
  const neckY = body.neck.position.y;
  const collar = put(MeshBuilder.CreateCylinder("sarissaCollar", { height: collarTall, diameterTop: span * C.neck, diameterBottom: span * C.collarOut, tessellation: 10 }, scene));
  collar.scaling.z = (halfZ * 2.4) / (span * C.collarOut);
  collar.position.set(chest.midX, neckY - collarTall * 0.45, midZ);
  const roll = put(MeshBuilder.CreateTorus("sarissaCollarRoll", { diameter: span * C.collarOut, thickness: chest.trunk * C.roll, tessellation: 12 }, scene));
  roll.scaling.z = collar.scaling.z;
  roll.position.set(chest.midX, neckY - collarTall * 0.95, midZ);
  // [S] 387 the folded collar over his left shoulder onto the chest (spec at SARISSA_FOLD)
  const F = SARISSA_FOLD;
  const lx = body.leftShoulder.position.x;
  const side = Math.sign(lx) || -1;
  const sy = body.leftShoulder.position.y;
  // the bulk lying over the shoulder top, front to back
  const bulk = put(MeshBuilder.CreateCylinder("sarissaFoldBulk", { height: halfZ * 2 * F.bulkLong, diameter: chest.trunk * F.bulk, tessellation: 7 }, scene));
  bulk.rotation.set(Math.PI / 2, 0, side * F.bulkTilt);
  bulk.scaling.x = F.bulkWide;
  bulk.position.set(lx * F.bulkAt, sy + chest.trunk * F.bulkUp, midZ + halfZ * 0.1);
  jitterVertices(bulk, 0.12, 33.1);
  // the drape: a thick sash off the shoulder's front down across the upper chest past the breastbone, two folds stacked
  for (let k = 0; k < F.folds; k++) {
    const w = span * F.drapeLong * (1 - 0.18 * k);
    const t = chest.trunk * F.drapeTall;
    const fold = put(MeshBuilder.CreateBox("sarissaFoldDrape", { width: w, height: t, depth: chest.trunk * F.drapeDeep }, scene));
    jitterVertices(fold, 0.08, 41.7 + k);
    fold.rotation.z = -side * F.drapeTilt;
    fold.position.set(lx * F.drapeFrom - side * w * 0.42, sy - chest.trunk * (F.drapeDown + k * F.drapeTall * 0.8), chest.maxZ + chest.trunk * (F.drapeDeep * 0.4 + 0.012 * k));
  }
  // the brooch pinning it on the shoulder's front
  const brooch = MeshBuilder.CreateCylinder("sarissaFoldBrooch", { height: chest.trunk * 0.03, diameter: chest.trunk * F.brooch, tessellation: 8 }, scene);
  brooch.material = getMaterialFactory().get("cloth", F.gold, { emissive: F.gold.scale(0.2) });
  brooch.parent = body.torso;
  brooch.rotation.x = Math.PI / 2;
  brooch.position.set(lx * F.drapeFrom, sy - chest.trunk * (F.drapeDown - F.drapeTall * 0.3), chest.maxZ + chest.trunk * (F.drapeDeep + 0.02));
  out.push(brooch);
  return out;
}

/*
 * [S] the snake archer's hood (382; ancient.snake_archer.red.png, .blue.png, card Appearance "a Chalcidian helmet and garb": a fitted team-cloth hood
 * over the whole head, its top rounded with a small peak, a wrap over the lower face up to just under the eyes so only the eye band shows, and a
 * draped collar round the neck over the shoulders, a point hanging at the front, tied at the throat with a tan cord; critic 378: a huge khaki box with
 * blue stripes wider than the shoulders). In the head's half extents e: the cap the top of an ellipsoid .cap of e across from .capFoot of e.y over the
 * head's middle; a back shell .backArc of a turn round the back from there down to .wrapTop; the wrap all round from .wrapTop down to .wrapFoot, .wrap
 * of e across, flaring .flare; a peak .peak of e.y tall leaning .peakLean forward. On the torso: the collar from the neck down .collar of the head's
 * width, out to .collarOut of the shoulder span, its front point .point of the head's width long; the cord .cord. Team cloth x .shade, self-lit .glow.
 */
const SNAKE_HOOD = {
  cap: 1.14, capFoot: 0.3, backArc: 0.62, wrapTop: -0.16, wrapFoot: -1.12, wrap: 1.1, flare: 1.12, peak: 0.42, peakLean: 0.5,
  collar: 0.42, collarOut: 1.08, point: 0.5, cord: new Color3(0.72, 0.5, 0.3), shade: 0.82, glow: 0.12,
};

/*
 * [S] the snake archer's snake (385; ancient.snake_archer.red.png, card Appearance "a bow ... loaded with a snake", Weapons projectile Snake: a big green
 * snake head with two white bead eyes on top, a body banded dark red and green tapering back to the tail; critic 378/384: a plain dark arrow on the
 * string and in flight). Built along +y, tail at 0 and the head's tip at `long`: the body .bands bands from .tail to .neck of the head's width across,
 * alternating red and green, .body of the length; the head an ellipsoid .head of the length across, .headLong of it long, flattened .flat; the eyes
 * white beads .eye of the head across on its top with black pupils; a forked red tongue. Fixed colours self-lit .glow (the same snake on both teams).
 * The draw fist holds it nocked (heldSnake, named "heldArrow" so the sim hides it at the loose, SNAKE_ARROWS); the arrow that flies is dressed as it.
 */
const SNAKE = {
  bands: 8, body: 0.72, tail: 0.25, neck: 1.0, head: 0.4, headLong: 1.45, flat: 0.75, eye: 0.42, glow: 0.18, nock: 0.42, held: 0.6,
  green: new Color3(0.2, 0.42, 0.2), red: new Color3(0.45, 0.1, 0.12), white: new Color3(0.95, 0.95, 0.92), black: new Color3(0.05, 0.05, 0.05),
};

/** A banded snake along +y, tail at 0, head tip at `long` (spec at SNAKE). */
export function buildSnake(scene: Scene, name: string, long: number): TransformNode {
  const S = SNAKE;
  const mf = getMaterialFactory();
  const lit = (c: Color3) => mf.get("cloth", c, { emissive: c.scale(S.glow) });
  const root = new TransformNode(name, scene);
  const headW = long * S.head, headL = headW * S.headLong;
  const bodyL = long - headL * 0.85;
  const put = (m: Mesh, c: Color3) => { m.material = lit(c); m.convertToFlatShadedMesh(); m.parent = root; return m; };
  for (let k = 0; k < S.bands; k++) {
    const t0 = k / S.bands, t1 = (k + 1) / S.bands;
    const d = (t: number) => headW * (S.tail + (S.neck - S.tail) * t);
    const band = put(MeshBuilder.CreateCylinder(`${name}Band`, { height: bodyL / S.bands * 1.02, diameterBottom: d(t0), diameterTop: d(t1), tessellation: 7 }, scene), k % 2 ? S.red : S.green);
    band.position.y = bodyL * (t0 + t1) / 2;
  }
  const head = put(MeshBuilder.CreateSphere(`${name}Head`, { diameterX: headW, diameterY: headL, diameterZ: headW * S.flat, segments: 7 }, scene), S.green);
  head.position.y = long - headL / 2;
  for (const side of [-1, 1]) {
    const eye = put(MeshBuilder.CreateSphere(`${name}Eye`, { diameter: headW * S.eye, segments: 6 }, scene), S.white);
    eye.position.set(side * headW * 0.24, long - headL * 0.32, headW * S.flat * 0.38);
    const pupil = put(MeshBuilder.CreateSphere(`${name}Pupil`, { diameter: headW * S.eye * 0.5, segments: 5 }, scene), S.black);
    pupil.position.set(side * headW * 0.26, long - headL * 0.3, headW * S.flat * 0.38 + headW * S.eye * 0.32);
    const fork = put(MeshBuilder.CreateBox(`${name}Tongue`, { width: headW * 0.05, height: headL * 0.32, depth: headW * 0.02 }, scene), S.red);
    fork.position.set(side * headW * 0.05, long + headL * 0.12, 0);
    fork.rotation.z = -side * 0.35;
  }
  return root;
}

/*
 * [S] 388 the live snake on the turf (ancient.snake_archer.png: a long thin snake some two metres long, banded red and green its whole length, laid in
 * S bends, the green head held up off the ground with two big white eyes on top; critic 387: a short fat green log a thigh thick, red bands only on a
 * cone tail, lying straight). Laid along +z on the ground, tail at z 0: .segs body pieces end to end over the length less the head, each .thick across
 * (tapering to .tail of that over the last .taper of the length at the tail), alternating green and red; the last .rise of the body curving up to
 * .neckUp m off the ground; on a neck node at the body's front end the head, .headLong m long and .headWide across, flattened .flat, eyes .eye of
 * the head across on its top, a forked red tongue. Each piece keeps its laid z, y and share of the length in metadata (snakeZ, snakeY, snakeAlong) so
 * the sim can throw the body in a travelling S; the neck carries the head and rears for the lunge. Colours SNAKE's.
 */
const GROUND_SNAKE = { segs: 18, thick: 0.075, tail: 0.3, taper: 0.3, rise: 0.22, neckUp: 0.14, headLong: 0.17, headWide: 0.115, flat: 0.7, eye: 0.42 };
export type GroundSnake = { root: TransformNode; segs: Mesh[]; neck: TransformNode; bodyL: number };

/** The live snake laid along +z on the ground (spec at GROUND_SNAKE). */
export function buildGroundSnake(scene: Scene, name: string, long: number): GroundSnake {
  const G = GROUND_SNAKE;
  const S = SNAKE;
  const mf = getMaterialFactory();
  const lit = (c: Color3) => mf.get("cloth", c, { emissive: c.scale(S.glow) });
  const root = new TransformNode(name, scene);
  const bodyL = long - G.headLong * 0.8;
  const segL = bodyL / G.segs;
  const lift = (t: number) => {
    const r = Math.max(0, (t - (1 - G.rise)) / G.rise);
    return G.neckUp * r * r * (3 - 2 * r);
  };
  const segs: Mesh[] = [];
  for (let k = 0; k < G.segs; k++) {
    const t0 = k / G.segs, t1 = (k + 1) / G.segs, tm = (t0 + t1) / 2;
    const d = (t: number) => G.thick * (t >= G.taper ? 1 : G.tail + (1 - G.tail) * t / G.taper);
    const seg = MeshBuilder.CreateCylinder(`${name}Band`, { height: segL * 1.12, diameterBottom: d(t0), diameterTop: d(t1), tessellation: 7 }, scene);
    seg.material = lit(k % 2 ? S.red : S.green);
    seg.convertToFlatShadedMesh();
    seg.parent = root;
    const y = G.thick / 2 + lift(tm);
    const pitch = Math.atan2(lift(t1) - lift(t0), segL);
    seg.position.set(0, y, bodyL * tm);
    seg.rotation.x = Math.PI / 2 - pitch;
    seg.metadata = { snakeZ: seg.position.z, snakeY: y, snakeAlong: tm };
    segs.push(seg);
  }
  const neck = new TransformNode(`${name}Neck`, scene);
  neck.parent = root;
  neck.position.set(0, G.thick / 2 + G.neckUp, bodyL - segL * 0.3);
  const put = (m: Mesh, c: Color3) => { m.material = lit(c); m.convertToFlatShadedMesh(); m.parent = neck; return m; };
  const hw = G.headWide, hl = G.headLong;
  const head = put(MeshBuilder.CreateSphere(`${name}Head`, { diameterX: hw, diameterY: hw * G.flat, diameterZ: hl, segments: 7 }, scene), S.green);
  head.position.z = hl * 0.42;
  for (const side of [-1, 1]) {
    const eye = put(MeshBuilder.CreateSphere(`${name}Eye`, { diameter: hw * G.eye, segments: 6 }, scene), S.white);
    eye.position.set(side * hw * 0.22, hw * G.flat * 0.38, hl * 0.3);
    const pupil = put(MeshBuilder.CreateSphere(`${name}Pupil`, { diameter: hw * G.eye * 0.5, segments: 5 }, scene), S.black);
    pupil.position.set(side * hw * 0.23, hw * G.flat * 0.38 + hw * G.eye * 0.18, hl * 0.3 + hw * G.eye * 0.22);
    const fork = put(MeshBuilder.CreateBox(`${name}Tongue`, { width: hw * 0.06, height: hw * 0.02, depth: hl * 0.4 }, scene), S.red);
    fork.position.set(side * hw * 0.05, 0, hl * 0.95);
    fork.rotation.y = side * 0.35;
  }
  return { root, segs, neck, bodyL };
}

/** The snake nocked in the snake archer's draw fist (spec at SNAKE), held like the balloon archer's arrow: across the fist, the head out to his off side. */
export function heldSnake(scene: Scene, body: ArticulatedBody): TransformNode {
  const long = SNAKE.held * body.metrics.overallHeight;
  const holder = new TransformNode("heldArrow", scene);
  holder.parent = body.leftHand;
  holder.rotation.z = Math.PI / 2;
  const snake = buildSnake(scene, "heldSnake", long);
  snake.parent = holder;
  snake.position.y = -long * SNAKE.nock;
  return holder;
}

/** The snake archer's hood, face wrap, collar and cord (spec at SNAKE_HOOD): head pieces on the head, the collar on the torso. */
export function dressSnakeArcher(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = SNAKE_HOOD;
  const out: Mesh[] = [];
  const mf = getMaterialFactory();
  const tone = teamColor.scale(S.shade);
  const cloth = mf.get("cloth", tone, { emissive: tone.scale(S.glow) });
  cloth.backFaceCulling = false;
  const cord = mf.get("cloth", S.cord, { emissive: S.cord.scale(0.15) });
  const head = body.headMesh;
  const e = head.getBoundingInfo().boundingBox.extendSize;
  const put = (m: Mesh, parent: TransformNode | Mesh, material = cloth) => { m.material = material; m.convertToFlatShadedMesh(); m.parent = parent; out.push(m); return m; };
  // the cap over the crown
  const capFoot = e.y * S.capFoot;
  const cap = put(MeshBuilder.CreateSphere("snakeHoodCap", { diameterX: 2 * e.x * S.cap, diameterY: 2 * (e.y * S.cap - capFoot) * 1.1, diameterZ: 2 * e.z * S.cap, segments: 7, slice: 0.5 }, scene), head);
  cap.position.y = capFoot;
  // the small peak on top, leaning forward
  const peak = put(MeshBuilder.CreateCylinder("snakeHoodPeak", { height: e.y * S.peak, diameterTop: 0, diameterBottom: e.x * 0.7, tessellation: 5 }, scene), head);
  peak.rotation.x = S.peakLean;
  peak.position.set(0, e.y * S.cap * 1.05 + e.y * S.peak * 0.25, e.z * 0.25);
  // the back shell from the cap's foot down to the wrap, its gap at the eyes
  const backTall = capFoot - e.y * S.wrapTop;
  const back = put(MeshBuilder.CreateCylinder("snakeHoodBack", { height: backTall, diameter: 2, tessellation: 12, arc: S.backArc, enclose: false, sideOrientation: Mesh.DOUBLESIDE }, scene), head);
  back.rotation.y = Math.PI / 2 - Math.PI * S.backArc;
  back.scaling.set(e.x * S.cap, 1, e.z * S.cap);
  back.position.y = capFoot - backTall / 2;
  // the wrap over the lower face and round the neck, under the eyes
  const wrapTall = e.y * (S.wrapTop - S.wrapFoot);
  const wrap = put(MeshBuilder.CreateCylinder("snakeHoodWrap", { height: wrapTall, diameterTop: 2, diameterBottom: 2 * S.flare, tessellation: 10 }, scene), head);
  wrap.scaling.set(e.x * S.wrap, 1, e.z * S.wrap);
  wrap.position.y = e.y * S.wrapTop - wrapTall / 2;
  // the collar on the shoulders, a point hanging at the front, and the cord tied at the throat
  const torso = body.torso;
  const neckY = body.neck.position.y;
  const span = Math.abs(body.rightShoulder.position.x) + Math.abs(body.leftShoulder.position.x);
  const W = e.x * 2;
  const collarTall = W * S.collar;
  const collar = put(MeshBuilder.CreateCylinder("snakeHoodCollar", { height: collarTall, diameterTop: W * S.wrap * S.flare, diameterBottom: span * S.collarOut, tessellation: 10 }, scene), torso);
  collar.scaling.z = 0.75;
  collar.position.set(0, neckY - collarTall * 0.3, 0);
  const point = put(MeshBuilder.CreateCylinder("snakeHoodPoint", { height: W * S.point, diameterTop: W * 0.9, diameterBottom: 0, tessellation: 3 }, scene), torso);
  point.scaling.z = 0.25;
  point.rotation.x = -0.25;
  point.position.set(0, neckY - collarTall * 0.75 - W * S.point * 0.4, span * S.collarOut * 0.75 * 0.5 * 0.9);
  for (const side of [-1, 1]) {
    const loop = put(MeshBuilder.CreateTorus("snakeHoodCord", { diameter: W * 0.18, thickness: W * 0.04, tessellation: 8 }, scene), torso, cord);
    loop.rotation.set(Math.PI / 2, 0, side * 0.6);
    loop.position.set(side * W * 0.09, neckY + collarTall * 0.1, W * S.wrap * S.flare * 0.5 * 0.75 + W * 0.03);
  }
  return out;
}

/*
 * [S] the snake archer's kit (386; ancient.snake_archer.red.png: a brown baldric from the quiver over his left shoulder diagonally across the chest to
 * the right hip, a brown belt with a gold buckle round the tunic's waist, brown knee boots from under the knee to the ankle over a team foot in a
 * strapped sandal; card "a quiver full of arrows"; critic 378: team legs, a dark bar). On the torso, round the trunk's box (trunkBand 0-1):
 *   - the baldric: a band round the trunk .proud of its half extents (rounded box section, exponent 4), its middle line from .high of the trunk at
 *     his left (-x) to .low at his right, .wide of the trunk tall, clamped under .top of the trunk so it crosses the shoulder;
 *   - the belt: a ring .belt of the trunk tall at .beltAt, .beltProud out, a gold buckle .buckle of the trunk square on its front;
 *   - on each shin a boot shell .bootOut of its half-width from .bootFrom to .bootTo of its length, a turned rim .rim long at its top, darker;
 *     the feet the hoplite's strapSandals.
 * Fixed browns, self-lit .glow.
 */
const SNAKE_KIT = {
  proud: 1.08, high: 0.95, low: 0.12, wide: 0.11, top: 1.03, segs: 28,
  belt: 0.09, beltAt: 0.05, beltProud: 1.12, buckle: 0.11,
  bootOut: 1.35, bootFrom: 0.12, bootTo: 0.92, rim: 0.1,
  leather: new Color3(0.42, 0.25, 0.14), boot: new Color3(0.3, 0.17, 0.11), gold: new Color3(0.8, 0.58, 0.26), glow: 0.12,
};

/** The snake archer's baldric, belt and knee boots over strap sandals (spec at SNAKE_KIT). */
export function snakeArcherKit(scene: Scene, body: ArticulatedBody): Mesh[] {
  const K = SNAKE_KIT;
  const out: Mesh[] = [];
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", K.leather, { emissive: K.leather.scale(K.glow) });
  leather.backFaceCulling = false;
  const boot = mf.get("cloth", K.boot, { emissive: K.boot.scale(K.glow) });
  const bootRim = mf.get("cloth", K.boot.scale(0.75), { emissive: K.boot.scale(K.glow * 0.5) });
  const gold = mf.get("cloth", K.gold, { emissive: K.gold.scale(K.glow) });
  const band = trunkBand(body, 0, 1);
  const halfZ = (band.maxZ - band.minZ) / 2, midZ = (band.minZ + band.maxZ) / 2;
  const tr = band.trunk;
  const rim = (a: number, p: number) => {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: band.midX + band.halfX * p * Math.sign(c) * Math.abs(c) ** 0.5, z: midZ + halfZ * p * Math.sign(s) * Math.abs(s) ** 0.5 };
  };
  // the baldric
  const upper: Vector3[] = [], lower: Vector3[] = [];
  for (let i = 0; i <= K.segs; i++) {
    const p = rim((Math.PI * 2 * i) / K.segs, K.proud);
    const u = (p.x - band.midX) / band.halfX;
    const mid = tr * (K.high + (K.low - K.high) * (u + 1) / 2);
    upper.push(new Vector3(p.x, Math.min(mid + tr * K.wide / 2, tr * K.top), p.z));
    lower.push(new Vector3(p.x, Math.min(mid - tr * K.wide / 2, tr * K.top - tr * 0.05), p.z));
  }
  const baldric = MeshBuilder.CreateRibbon("snakeBaldric", { pathArray: [upper, lower], sideOrientation: Mesh.DOUBLESIDE }, scene);
  baldric.convertToFlatShadedMesh();
  baldric.material = leather;
  baldric.parent = body.torso;
  out.push(baldric);
  // the belt and its buckle
  const belt = MeshBuilder.CreateCylinder("snakeBelt", { height: tr * K.belt, diameter: 2, tessellation: 10 }, scene);
  belt.scaling.set(band.halfX * K.beltProud, 1, halfZ * K.beltProud);
  belt.position.set(band.midX, tr * K.beltAt, midZ);
  belt.convertToFlatShadedMesh();
  belt.material = leather;
  belt.parent = body.torso;
  out.push(belt);
  const buckle = MeshBuilder.CreateBox("snakeBuckle", { width: tr * K.buckle, height: tr * K.buckle, depth: tr * 0.03 }, scene);
  buckle.position.set(band.midX, tr * K.beltAt, midZ + halfZ * K.beltProud * 1.02);
  buckle.material = gold;
  buckle.parent = body.torso;
  out.push(buckle);
  // knee boots over strap sandals
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "snakeBoot", shin, K.bootFrom, K.bootTo, K.bootOut, boot));
    out.push(limbShell(scene, "snakeBootRim", shin, K.bootFrom, K.bootFrom + K.rim, K.bootOut * 1.12, bootRim));
  }
  out.push(...strapSandals(scene, body, K.leather, K.glow, "snakeArcher"));
  return out;
}

/*
 * [S] the hoplite's greaves and sandals (384; ancient.hoplite.red.png: dark brown greaves from under the knee to the ankle, the bare team foot below in a
 * brown strapped sandal; critic 378: grey boots). On each shin a faceted shell HOPLITE_LEGS.out of its half-width round it from .from to .to of its length,
 * a rim band .rim long round its top, in a fixed dark brown (not a team lerp, which read grey under blue) self-lit .glow; the foot the team skin, with a
 * brown sandal: a sole .sole of the foot's height under it, a strap over the instep at .instep of its length and one round the ankle at its back.
 */
const HOPLITE_LEGS = {
  out: 1.3, from: 0.06, to: 0.86, rim: 0.07, sole: 0.22, instep: 0.55, strap: 0.18,
  greave: new Color3(0.3, 0.17, 0.1), sandal: new Color3(0.42, 0.25, 0.14), glow: 0.12,
};

export function dressHoplite(scene: Scene, body: ArticulatedBody): Mesh[] {
  const H = HOPLITE_LEGS;
  const mf = getMaterialFactory();
  const greave = mf.get("cloth", H.greave, { emissive: H.greave.scale(H.glow) });
  const rim = mf.get("cloth", H.greave.scale(1.35), { emissive: H.greave.scale(H.glow) });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "hopliteGreave", shin, H.from, H.to, H.out, greave));
    out.push(limbShell(scene, "hopliteGreaveRim", shin, H.from, H.from + H.rim, H.out * 1.1, rim));
  }
  out.push(...strapSandals(scene, body, H.sandal, H.glow));
  return out;
}

/**
 * Brown strapped sandals on bare team feet (HOPLITE_LEGS sole, instep, strap; shared by the hoplite and the shield bearer): each foot mesh takes the
 * body's skin, a sole under it, a strap over the instep and one round the ankle at its back.
 */
export function strapSandals(scene: Scene, body: ArticulatedBody, colour: Color3, glow: number, prefix = "hoplite"): Mesh[] {
  const H = HOPLITE_LEGS;
  const sandal = getMaterialFactory().get("cloth", colour, { emissive: colour.scale(glow) });
  const out: Mesh[] = [];
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) {
      if (!(foot instanceof Mesh) || !/_[lr]FootM$/.test(foot.name)) continue;
      foot.material = body.skinMaterial;
      const fb = foot.getBoundingInfo().boundingBox;
      const ex = fb.extendSize;
      const put = (m: Mesh, x: number, y: number, z: number) => { m.parent = foot; m.position.set(x, y, z); m.material = sandal; out.push(m); };
      put(MeshBuilder.CreateBox(`${prefix}Sole`, { width: ex.x * 2.1, height: ex.y * 2 * H.sole, depth: ex.z * 2.06 }, scene), fb.center.x, fb.minimum.y + ex.y * H.sole, fb.center.z);
      put(MeshBuilder.CreateBox(`${prefix}Strap`, { width: ex.x * 2.12, height: ex.y * 2.02, depth: ex.z * 2 * H.strap }, scene), fb.center.x, fb.center.y, fb.minimum.z + ex.z * 2 * H.instep);
      put(MeshBuilder.CreateBox(`${prefix}Strap`, { width: ex.x * 2.12, height: ex.y * 2 * 0.4, depth: ex.z * 2 * H.strap }, scene), fb.center.x, fb.maximum.y - ex.y * 0.3, fb.minimum.z + ex.z * 2 * 0.12);
    }
  }
  return out;
}

/*
 * [S] the sarissa's belt, dagger and bracers (384; ancient.sarissa.red.png, card Appearance "a big brown belt around its hips, holding what seems to be an
 * Acinaces dagger": a broad brown belt round the hips over the tunic, a darker strap band along its foot, a dagger in a brown sheath hanging down his left
 * hip, brown leather bracers on the forearms). On the torso, in the trunk's box at the hips: the belt SARISSA_KIT.tall of the trunk tall at .at, .proud of
 * the body belt ring (hidden), .sides facets, its lower .band a darker brown; the sheath on his left (-x) at .hipOut of the belt half-width, .ahead of its
 * half-depth forward (clear of the cape), .sheath of the trunk long hanging
 * from the belt, tilted .tilt rad out at the foot, a gold chape at its tip, the grip and a cross guard above the belt. On each forearm a bracer shell .out of
 * its half-width round it from .from to .to of its length, a dark strap at each end. Fixed browns, self-lit .glow.
 */
const SARISSA_KIT = {
  at: 0.06, tall: 0.2, proud: 1.1, sides: 8, band: 0.35, hipOut: 0.92, ahead: 0.55, sheath: 0.42, tilt: 0.18,
  out: 1.6, from: 0.12, to: 0.88,
  leather: new Color3(0.4, 0.24, 0.13), dark: new Color3(0.24, 0.14, 0.08), gold: new Color3(0.78, 0.6, 0.28), glow: 0.12,
};

export function sarissaKit(scene: Scene, body: ArticulatedBody): Mesh[] {
  const K = SARISSA_KIT;
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", K.leather, { emissive: K.leather.scale(K.glow) });
  const dark = mf.get("cloth", K.dark, { emissive: K.dark.scale(K.glow) });
  const gold = mf.get("cloth", K.gold, { emissive: K.gold.scale(K.glow) });
  const out: Mesh[] = [];
  const add = (m: Mesh, material = leather, parent: TransformNode = body.torso) => { m.parent = parent; m.material = material; m.convertToFlatShadedMesh(); out.push(m); return m; };
  // the belt and its darker foot band, round the outside of the body's own team belt ring (which it replaces: inside the trunk's box it was hidden by it)
  const waist = trunkBand(body, K.at - K.tall / 2, K.at + K.tall / 2 + 0.05);
  const ring = body.torso.getChildMeshes(true).find((m) => /_belt$/.test(m.name));
  const ringOut = ring ? ring.getBoundingInfo().boundingBox.extendSize : null;
  const halfX = Math.max(waist.halfX, ringOut?.x ?? 0) * K.proud;
  const halfZ = Math.max((waist.maxZ - waist.minZ) / 2, ringOut?.z ?? 0) * K.proud;
  const midX = ring ? ring.position.x : waist.midX;
  const midZ = ring ? ring.position.z : (waist.minZ + waist.maxZ) / 2;
  if (ring) ring.setEnabled(false);
  const tall = waist.trunk * K.tall;
  const beltY = ring ? ring.position.y : waist.trunk * K.at;
  const belt = add(MeshBuilder.CreateCylinder("sarissaBelt", { height: tall, diameter: 2, tessellation: K.sides }, scene));
  belt.scaling.set(halfX, 1, halfZ);
  belt.position.set(midX, beltY, midZ);
  const band = add(MeshBuilder.CreateCylinder("sarissaBeltBand", { height: tall * K.band, diameter: 2, tessellation: K.sides }, scene), dark);
  band.scaling.set(halfX * 1.04, 1, halfZ * 1.04);
  band.position.set(midX, beltY - tall * (0.5 - K.band / 2), midZ);
  // the dagger down his left hip: sheath, chape, grip, guard, pommel, on a pivot at the belt
  const hang = new TransformNode("sarissaDaggerHang", scene);
  hang.parent = body.torso;
  // forward of the side, where the cape (open .44 of a turn at his front) does not cover it
  hang.position.set(midX - halfX * K.hipOut, beltY, midZ + halfZ * K.ahead);
  hang.rotation.z = K.tilt;
  const L = waist.trunk * K.sheath;
  const w = L * 0.13;
  const sheath = add(MeshBuilder.CreateCylinder("sarissaSheath", { height: L, diameterTop: w, diameterBottom: w * 0.6, tessellation: 6 }, scene), leather, hang);
  sheath.scaling.z = 0.55;
  sheath.position.y = -L * 0.5;
  const chape = add(MeshBuilder.CreateCylinder("sarissaChape", { height: L * 0.14, diameterTop: w * 0.66, diameterBottom: w * 0.2, tessellation: 6 }, scene), gold, hang);
  chape.position.y = -L * 1.05;
  const guard = add(MeshBuilder.CreateBox("sarissaGuard", { width: w * 1.9, height: L * 0.06, depth: w * 0.6 }, scene), gold, hang);
  guard.position.y = L * 0.04;
  const grip = add(MeshBuilder.CreateCylinder("sarissaGrip", { height: L * 0.24, diameter: w * 0.5, tessellation: 6 }, scene), dark, hang);
  grip.position.y = L * 0.18;
  const pommel = add(MeshBuilder.CreateBox("sarissaPommel", { width: w * 1.3, height: L * 0.05, depth: w * 0.5 }, scene), gold, hang);
  pommel.position.y = L * 0.32;
  // bracers on the forearms, a dark strap at each end
  for (const fore of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "sarissaBracer", fore, K.from, K.to, K.out, leather));
    for (const at of [K.from, K.to - 0.08]) out.push(limbShell(scene, "sarissaBracerStrap", fore, at, at + 0.08, K.out * 1.1, dark));
  }
  return out;
}

/*
 * [S] the shield bearer's lorica segmentata (384, re-land of 383's a4076de; ancient.shield_bearer.jpg, card Appearance "a lorica segmentata (Roman
 * segmented armor)": thin dark brown plates fitted to the team tunic round the trunk, flat shoulder strips; critic 383: the stepped hoops ballooned into a
 * grey-mauve barrel twice his width). On the torso joint, in the trunk's box at each hoop's own height:
 *   - LORICA.hoops straight bands from .low to .high of the trunk (under the shoulder yoke, whose width is the arms'), each .sides-sided, a fixed .proud of
 *     the trunk's half extents (no step), .fill of its share tall, a thin darker .seam band .seamProud round the joint above it, so the plates read apart;
 *   - on each shoulder .strips flat strips lying over the deltoid, each .stripWide of the shoulder joint's offset across, .stripThick of the trunk thick,
 *     .stripDeep of the trunk's depth front to back, the k-th at .stripAt + .stripStep k of the shoulder offset out, dropping .drop k and tilting .tilt k rad;
 * fixed browns (a team lerp read grey under blue), self-lit .glow.
 */
const LORICA = {
  hoops: 4, low: 0.24, high: 0.74, sides: 8, proud: 1.05, fill: 0.92, seamProud: 1.07, seam: 0.018,
  strips: 2, stripWide: 0.5, stripThick: 0.03, stripDeep: 1.02, stripAt: 0.62, stripStep: 0.32, drop: 0.07, tilt: 0.38,
  plate: new Color3(0.3, 0.18, 0.12), dark: new Color3(0.17, 0.1, 0.07), glow: 0.1,
};

/** The shield bearer's segmented hoop armour and flat shoulder strips (spec at LORICA), on the torso. */
export function dressShieldBearer(scene: Scene, body: ArticulatedBody): Mesh[] {
  const L = LORICA;
  const out: Mesh[] = [];
  const mf = getMaterialFactory();
  const plate = mf.get("cloth", L.plate, { emissive: L.plate.scale(L.glow) });
  const dark = mf.get("cloth", L.dark, { emissive: L.dark.scale(L.glow) });
  const put = (m: Mesh, material = plate) => { m.material = material; m.convertToFlatShadedMesh(); m.parent = body.torso; out.push(m); return m; };
  const share = (L.high - L.low) / L.hoops;
  // one box over the whole trunk: the trunk is a straight box with vertices only at its ends, so a hoop-high slice found none and fell back to a box
  // round the whole torso joint, belt ring included (384 probe: .23 deep on a .09 trunk), which stood the lower hoops off his chest as a drum
  const band = trunkBand(body, 0, 1);
  for (let k = 0; k < L.hoops; k++) {
    const lo = L.low + share * k, hi = lo + share;
    const halfZ = (band.maxZ - band.minZ) / 2, midZ = (band.minZ + band.maxZ) / 2;
    const hoop = put(MeshBuilder.CreateCylinder("loricaHoop", { height: band.trunk * share * L.fill, diameter: 2, tessellation: L.sides }, scene));
    hoop.scaling.set(band.halfX * L.proud, 1, halfZ * L.proud);
    hoop.position.set(band.midX, band.trunk * (lo + hi) / 2, midZ);
    const seam = put(MeshBuilder.CreateCylinder("loricaSeam", { height: band.trunk * L.seam, diameter: 2, tessellation: L.sides }, scene), dark);
    seam.scaling.set(band.halfX * L.seamProud, 1, halfZ * L.seamProud);
    seam.position.set(band.midX, band.trunk * hi, midZ);
  }
  const top = trunkBand(body, 0.85, 1.0);
  const deep = (top.maxZ - top.minZ) * L.stripDeep;
  const midZ = (top.minZ + top.maxZ) / 2;
  for (const shoulder of [body.leftShoulder, body.rightShoulder]) {
    const sx = shoulder.position.x;
    const side = Math.sign(sx) || 1;
    for (let k = 0; k < L.strips; k++) {
      const strip = put(MeshBuilder.CreateBox("loricaShoulder", { width: Math.abs(sx) * L.stripWide, height: top.trunk * L.stripThick, depth: deep }, scene));
      strip.rotation.z = -side * L.tilt * (k + 0.5);
      strip.position.set(sx * (L.stripAt + L.stripStep * k), shoulder.position.y - top.trunk * L.drop * k, midZ);
    }
  }
  out.push(...shieldBearerSandals(scene, body));
  return out;
}

/*
 * [S] the shield bearer's sandals (385; ancient.shield_bearer.jpg: bare team feet in brown strapped sandals, the laces wound up round the lower shin, no
 * boots; critic 378/384: dark team/grey boots). The hoplite's strapSandals (sole, instep, ankle strap, the foot in skin) without his greaves, plus
 * SB_SANDAL.laces thin brown bands round each shin at those shares of its length, .lace long, .out of its half-width; fixed brown, self-lit .glow.
 */
const SB_SANDAL = { laces: [0.7, 0.82, 0.93], lace: 0.045, out: 1.12, brown: new Color3(0.4, 0.23, 0.13), glow: 0.12 };

function shieldBearerSandals(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = SB_SANDAL;
  const lace = getMaterialFactory().get("cloth", S.brown, { emissive: S.brown.scale(S.glow) });
  const out = strapSandals(scene, body, S.brown, S.glow, "shieldBearer");
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    for (const at of S.laces) out.push(limbShell(scene, "shieldBearerLace", shin, at, at + S.lace, S.out, lace));
  }
  return out;
}
