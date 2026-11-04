import { Scene, Color3, Mesh, MeshBuilder, TransformNode, Vector3, type Material } from "@babylonjs/core";
import { limbShell } from "./medievalDress";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

/*
 * Legacy dress (units/legacy.*): per-unit hats, cloth, hair and ornaments. Sized off the body's own joints and meshes.
 */

/*
 * [S] 457 the Poacher's hat (audit 457 a.1: "a dark dome covering the whole head, brim at the chin, face hidden - TABS: a dark wide-brimmed hat with a
 * team band sitting above the eyes"; legacy.poacher.blue.png: a dark brown felt hat, a low round-topped crown a little over a head across, a wide flat
 * brim about two heads across sitting on the brow with the eyes clear under it, a team-coloured band round the crown's foot). POACHER_HAT, in the head's
 * width W and height H: crown .crown W across, .flare of that at its top, from the seat to .tall H over the head top, a flat dome .dome H on it; brim
 * .brim W across, .thick H; band .band H tall over the brim in the team colour; felt .felt, all self-lit .glow.
 */
const POACHER_HAT = { sides: 10, crown: 1.1, flare: 0.92, tall: 0.2, dome: 0.12, brim: 2.0, thick: 0.04, band: 0.11, glow: 0.12, felt: new Color3(0.17, 0.11, 0.07) };

/** The Poacher's dark wide-brim hat with a team band (spec at POACHER_HAT), in the hat's units; `seat` under the head top. Returns the crown. */
export function buildPoacherHat(scene: Scene, W: number, H: number, seat: number, unit: number, teamColor?: Color3): Mesh {
  const P = POACHER_HAT;
  const u = (v: number) => v / unit;
  const mats = getMaterialFactory();
  const felt = mats.get("cloth", P.felt, { emissive: P.felt.scale(P.glow) });
  const teamC = teamColor ?? new Color3(0.5, 0.5, 0.55);
  const band = mats.get("cloth", teamC, { emissive: teamC.scale(P.glow) });
  const tall = -seat + P.tall * H, crownD = P.crown * W;
  const crown = MeshBuilder.CreateCylinder("poacherHatCrown", { height: u(tall), diameterBottom: u(crownD), diameterTop: u(crownD * P.flare), tessellation: P.sides }, scene);
  crown.position.y = u(seat + tall * 0.5);
  crown.material = felt;
  crown.convertToFlatShadedMesh();
  const dome = MeshBuilder.CreateSphere("poacherHatDome", { diameter: u(crownD * P.flare), segments: 4 }, scene);
  dome.scaling.y = (P.dome * H) / (crownD * P.flare * 0.5);
  dome.position.y = u(tall * 0.5);
  dome.material = felt;
  dome.convertToFlatShadedMesh();
  dome.parent = crown;
  const brim = MeshBuilder.CreateCylinder("poacherHatBrim", { height: u(P.thick * H), diameter: u(P.brim * W), tessellation: 16 }, scene);
  brim.position.y = u(-tall * 0.5 + P.thick * H * 0.5);
  brim.material = felt;
  brim.convertToFlatShadedMesh();
  brim.parent = crown;
  const ring = MeshBuilder.CreateCylinder("poacherHatBand", { height: u(P.band * H), diameter: u(crownD * 1.04), tessellation: P.sides }, scene);
  ring.position.y = u(-tall * 0.5 + P.thick * H + P.band * H * 0.5);
  ring.material = band;
  ring.convertToFlatShadedMesh();
  ring.parent = crown;
  return crown;
}

/*
 * [S] 457 the Peasant's hood (audit 457 a.2: "head bare and bald - TABS: a team-coloured hood framing the face"; legacy.peasant.blue.png: a close
 * team cowl a shade darker than his skin over the crown, the sides and the back of the head, open in front round the eyes and face, drawn to a small
 * point on top, its foot a short collar round the neck). PEASANT_HOOD, in the head's width W and height H: a cowl shell .wide W across and .deep W deep,
 * .tall H high, its middle .at H under the head top, an arc .open of the way round left open toward the face (+z); a cone .peak H tall on the crown,
 * set .back W behind it; a collar .collar W across and .collarTall H at the neck, .neck H under the head top. Team colour times .shade, self-lit .glow.
 * One-sided shells (LESSONS: SSAO greys a double-sided ribbon).
 */
const PEASANT_HOOD = { wide: 1.24, deep: 1.2, tall: 1.2, at: 0.42, open: 0.34, peak: 0.28, back: 0.08, collar: 1.32, collarTall: 0.24, neck: 1.02, shade: 0.72, glow: 0.12 };

/** The Peasant's team hood framing the face (spec at PEASANT_HOOD), in the hat's units. Returns the cowl. */
export function buildPeasantHood(scene: Scene, W: number, H: number, unit: number, teamColor?: Color3): Mesh {
  const P = PEASANT_HOOD;
  const u = (v: number) => v / unit;
  const c = (teamColor ?? new Color3(0.5, 0.5, 0.55)).scale(P.shade);
  const cloth = getMaterialFactory().get("cloth", c, { emissive: c.scale(P.glow) });
  const cowl = MeshBuilder.CreateSphere("peasantHood", { diameter: 1, segments: 8, arc: 1 - P.open }, scene);
  cowl.scaling.set(u(P.wide * W), u(P.tall * H), u(P.deep * W));
  // 458: PI/2 + PI*open (propBuilder's hood) left the gap at the back of the head (critic 457: the face buried); half a turn more puts it on the face
  cowl.rotation.y = Math.PI / 2 + Math.PI * P.open + Math.PI;
  cowl.position.y = u(-P.at * H);
  cowl.material = cloth;
  cowl.convertToFlatShadedMesh();
  const peak = MeshBuilder.CreateCylinder("peasantHoodPeak", { height: u(P.peak * H), diameterTop: 0, diameterBottom: u(0.5 * W), tessellation: 6 }, scene);
  peak.position.set(0, u(-P.at * H + P.tall * H * 0.45 + P.peak * H * 0.3), u(-P.back * W));
  peak.rotation.x = -0.35;
  peak.material = cloth;
  peak.convertToFlatShadedMesh();
  peak.setParent(cowl);
  const collar = MeshBuilder.CreateCylinder("peasantHoodCollar", { height: u(P.collarTall * H), diameterTop: u(0.95 * W), diameterBottom: u(P.collar * W), tessellation: 8 }, scene);
  collar.position.y = u(-P.neck * H);
  collar.material = cloth;
  collar.convertToFlatShadedMesh();
  collar.setParent(cowl);
  return cowl;
}

/*
 * [S] 458 the Poacher's hair (critic 457 a.2: "hair in unit_legacy.poacher_idle, none - TABS: long white hair with braids beside the face";
 * legacy.poacher.red.png: pale grey-white hair hanging from under the brim down both sides of the face to the jaw and over the back of the head, a thin
 * braid in front of each side lock running down past the chin). POACHER_HAIR, in the head box (half sizes e, centre c, +z the face): a side lock each
 * side .side e.x thick, from .top e.y over the centre down to .foot e.y under it, from .back e.z behind to .front e.z ahead of the centre; a back sheet
 * .side thick over the back of the head, the same height; a braid .braid e.x square in front of each lock, .braidFoot e.y under the centre, in .knots
 * knots. Pale grey .color, self-lit .glow (LESSONS: lit cloth in shade reads grey, so the code value is near white).
 */
const POACHER_HAIR = { side: 0.22, top: 0.55, foot: 1.25, back: 1.05, front: 0.45, braid: 0.14, braidFoot: 1.75, knots: 4, color: new Color3(0.92, 0.92, 0.9), glow: 0.22 };

/** The Poacher's pale side locks, back sheet and two braids (spec at POACHER_HAIR), hung on the head. */
export function poacherHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = POACHER_HAIR;
  const hair = getMaterialFactory().get("cloth", P.color, { emissive: P.color.scale(P.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, y: number, z: number): void => {
    m.position.set(x, y, z);
    m.material = hair;
    m.parent = head;
    m.convertToFlatShadedMesh();
    out.push(m);
  };
  const tall = e.y * (P.top + P.foot), midY = c.y + e.y * (P.top - P.foot) / 2;
  const t = e.x * P.side;
  for (const s of [-1, 1]) {
    const deep = e.z * (P.back + P.front);
    put(MeshBuilder.CreateBox("poacherLock", { width: t, height: tall, depth: deep }, scene), c.x + s * (e.x + t / 2), midY, c.z + e.z * (P.front - P.back) / 2);
    const b = e.x * P.braid, len = e.y * (P.braidFoot - 0.1), step = len / P.knots;
    for (let k = 0; k < P.knots; k++) {
      put(MeshBuilder.CreateBox("poacherBraid", { width: b, height: step * 0.9, depth: b }, scene), c.x + s * (e.x + t * 0.5), c.y - e.y * 0.1 - step * (k + 0.5), c.z + e.z * P.front + b / 2);
    }
  }
  put(MeshBuilder.CreateBox("poacherBackHair", { width: (e.x + t) * 2, height: tall, depth: t }, scene), c.x, midY, c.z - e.z * P.back - t / 2 + t);
  return out;
}

/*
 * [S] 459 the Flag and Banner Bearers' aura ring (audit 457 flag_bearer c.2 / banner_bearer c.2: "aura ring, none - TABS: a team-coloured circle on the
 * ground around the bearer that marks the units it affects"; legacy.banner_bearer.jpg: a thin blue ring on the grass round the bearer, a few men wide;
 * legacy.flag_bearer.red.png: an orange ring round his feet). BEARER_RING, in his standing height H: a flat ring .radius H out from his feet, .band H
 * wide, .lift H over the soles (the root's y 0), .sides-sided; the team colour self-lit .glow so it reads on the grass.
 */
const BEARER_RING = { radius: 2.2, band: 0.05, flat: 0.012, lift: 0.02, sides: 40, glow: 0.45 };
// [P] 462 radius 1.6 -> 2.2: the reach is .radius of his 1.39 m body, 2.2 m, and the ally 2.3 m off stood on the line, unbuffed (critic 461; probe_aura)
// [P] 460 one colour per bearer for both teams, not the team's (critic 459 flag c.3: legacy.flag_bearer red and blue renders an orange ring; the banner's cyan)
const BEARER_RING_COLOR: Record<string, Color3> = { "legacy.flag_bearer": new Color3(0.95, 0.6, 0.2), "legacy.banner_bearer": new Color3(0.25, 0.75, 0.95) };

/** How far the bearer's ring reaches from his feet (BEARER_RING.radius of his height): his aura holds the allies inside it (simulationSystem). */
export function bearerReach(body: ArticulatedBody): number {
  return BEARER_RING.radius * body.metrics.overallHeight;
}

/** A flat team ring on the ground round the bearer (spec at BEARER_RING), hung on the body root at the soles. */
export function bearerRing(scene: Scene, body: ArticulatedBody, teamColor: Color3, unitId?: string): Mesh[] {
  const R = BEARER_RING, H = body.metrics.overallHeight;
  const ring = MeshBuilder.CreateTorus("bearerRing", { diameter: R.radius * H * 2, thickness: R.band * H, tessellation: R.sides }, scene);
  ring.scaling.y = R.flat / R.band;
  ring.position.y = R.lift * H;
  const c = (unitId && BEARER_RING_COLOR[unitId]) || teamColor;
  ring.material = getMaterialFactory().get("cloth", c, { emissive: c.scale(R.glow) });
  ring.isPickable = false;
  ring.parent = body.root;
  return [ring];
}

/*
 * [S] 459 the Boxer's headgear (audit 457 a.2: "headgear, bald - TABS: team boxing headgear with ear guards"; legacy.boxer.blue.png: a padded team
 * cap over the crown, the back and the sides of the head, open round the face, a round pad over each ear). BOXER_HEADGEAR, in the head's width W and
 * height H: a padded shell .wide W across and .deep W deep, .tall H high, its middle .at H under the head top, an arc .open of the way round left open
 * on the face (the PEASANT_HOOD turn, + PI); an ear pad each side, a disc .ear W across and .earThick W thick, .earOut W out from the middle at .earAt
 * H under the head top. Team colour times .shade, self-lit .glow.
 */
const BOXER_HEADGEAR = { wide: 1.16, deep: 1.12, tall: 0.95, at: 0.38, open: 0.36, ear: 0.46, earThick: 0.14, earOut: 0.6, earAt: 0.55, shade: 0.6, glow: 0.1 };

/** The Boxer's padded team headgear with ear pads (spec at BOXER_HEADGEAR), in the hat's units. Returns the shell. */
export function buildBoxerHeadgear(scene: Scene, W: number, H: number, unit: number, teamColor?: Color3): Mesh {
  const B = BOXER_HEADGEAR;
  const u = (v: number) => v / unit;
  const c = (teamColor ?? new Color3(0.5, 0.5, 0.55)).scale(B.shade);
  const pad = getMaterialFactory().get("cloth", c, { emissive: c.scale(B.glow) });
  const shell = MeshBuilder.CreateSphere("boxerHeadgear", { diameter: 1, segments: 8, arc: 1 - B.open }, scene);
  shell.scaling.set(u(B.wide * W), u(B.tall * H), u(B.deep * W));
  shell.rotation.y = Math.PI / 2 + Math.PI * B.open + Math.PI; // the gap on the face (LESSONS: + PI)
  shell.position.y = u(-B.at * H);
  shell.material = pad;
  shell.convertToFlatShadedMesh();
  for (const side of [-1, 1]) {
    const ear = MeshBuilder.CreateCylinder("boxerEarPad", { height: u(B.earThick * W), diameter: u(B.ear * W), tessellation: 8 }, scene);
    ear.rotation.z = Math.PI / 2;
    ear.position.set(u(side * B.earOut * W), u(-B.earAt * H), 0);
    ear.material = pad;
    ear.convertToFlatShadedMesh();
    ear.setParent(shell);
  }
  return shell;
}

/*
 * [S] 459 the Peasant's dress (audit 457 a.4: "torso, plain team body block - TABS: a knee-length team dress with short sleeves and a pointed hem";
 * legacy.peasant.blue.png: a team tunic a shade darker than the skin from the neck to the knee, short sleeves to mid upper arm, the hem cut to a point in
 * front). PEASANT_DRESS: the trunk and pelvis in the dress cloth (the team colour times .shade, self-lit .glow); a short sleeve .sleeveOut of each upper
 * arm's half-width round it to .sleeveTo of its length; the skirt hung by unitFactory (hangSkirt .long of the hip-to-knee drop, flaring .flare) in the
 * same cloth, and on its front a pointed flap: a 4-sided cone .point W wide hanging .pointLong H of the trunk below the skirt's foot.
 */
export const PEASANT_DRESS = { shade: 0.72, glow: 0.12, sleeveOut: 1.3, sleeveTo: 0.5, long: 1.0, flare: 1.35, point: 0.5, pointLong: 0.22, proud: 0.02 };

/** The team dress cloth (spec at PEASANT_DRESS). */
export function peasantDressCloth(teamColor: Color3): Material {
  const c = teamColor.scale(PEASANT_DRESS.shade);
  return getMaterialFactory().get("cloth", c, { emissive: c.scale(PEASANT_DRESS.glow) });
}

/** The Peasant's dress body and short sleeves (spec at PEASANT_DRESS); the skirt is hung by unitFactory, its point by peasantDressPoint. */
export function peasantDress(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const P = PEASANT_DRESS;
  const cloth = peasantDressCloth(teamColor);
  body.torsoMesh.material = cloth;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke/.test(m.name) && m instanceof Mesh) m.material = cloth;
  for (const m of body.hip.getChildMeshes(true)) if (/_pelvis$/.test(m.name) && m instanceof Mesh) m.material = cloth;
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "peasantSleeve", arm, 0, P.sleeveTo, P.sleeveOut, cloth));
  return out;
}

/** The pointed front flap under the hung skirt's hem (spec at PEASANT_DRESS). */
export function peasantDressPoint(scene: Scene, body: ArticulatedBody, skirt: Mesh, teamColor: Color3): Mesh[] {
  const P = PEASANT_DRESS;
  const bb = skirt.getBoundingInfo().boundingBox;
  const tb = body.torsoMesh.getBoundingInfo().boundingBox;
  const W = tb.extendSize.x * 2 * body.torsoMesh.scaling.x, H = tb.extendSize.y * 2 * body.torsoMesh.scaling.y;
  const flap = MeshBuilder.CreateCylinder("peasantDressPoint", { height: P.pointLong * H, diameterTop: P.point * W, diameterBottom: 0, tessellation: 4 }, scene);
  flap.scaling.z = 0.25;
  flap.rotation.y = Math.PI / 4;
  flap.position.set(bb.center.x, bb.minimum.y - P.pointLong * H / 2 + 0.01, bb.maximum.z - P.proud);
  flap.material = peasantDressCloth(teamColor);
  flap.parent = skirt;
  flap.convertToFlatShadedMesh();
  return [flap];
}

/*
 * [S] 459 the Poacher's coat (audit 457 a.3: "torso, plain team body - TABS: a brown sleeveless coat with a white fur collar"; legacy.poacher.red.png:
 * a brown leather jerkin over the team body, sleeveless so the team arms show, a shaggy white fur collar round the neck and shoulders, the coat's skirt
 * to mid-thigh). POACHER_COAT: the trunk, its yoke and the pelvis in brown leather .leather; the coat skirt hung by unitFactory in the same leather
 * (.long, .flare); a fur collar of .tufts white faceted lumps .tuft W across ringing the trunk's top at .ring of its width and depth. Self-lit .glow.
 */
export const POACHER_COAT = { leather: new Color3(0.36, 0.2, 0.1), fur: new Color3(0.95, 0.94, 0.9), glow: 0.14, long: 0.6, flare: 1.45, tufts: 10, tuft: 0.24, ring: 0.5, furGlow: 0.25 };

/** The Poacher's leather (spec at POACHER_COAT). */
export function poacherCoatCloth(): Material {
  const P = POACHER_COAT;
  return getMaterialFactory().get("cloth", P.leather, { emissive: P.leather.scale(P.glow) });
}

/** The Poacher's brown sleeveless coat body and white fur collar (spec at POACHER_COAT); the coat skirt is hung by unitFactory. */
export function poacherCoat(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = POACHER_COAT;
  const leather = poacherCoatCloth();
  const fur = getMaterialFactory().get("cloth", P.fur, { emissive: P.fur.scale(P.furGlow) });
  const tm = body.torsoMesh;
  tm.material = leather;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke/.test(m.name) && m instanceof Mesh) m.material = leather;
  for (const m of body.hip.getChildMeshes(true)) if (/_pelvis$/.test(m.name) && m instanceof Mesh) m.material = leather;
  const tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, top = tm.position.y + (tb.center.y + tb.extendSize.y) * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const out: Mesh[] = [];
  for (let k = 0; k < P.tufts; k++) {
    const a = (k / P.tufts) * Math.PI * 2;
    const tuft = MeshBuilder.CreateIcoSphere("poacherFur", { radius: P.tuft * W / 2, subdivisions: 1, flat: true }, scene);
    tuft.position.set(cx + Math.sin(a) * W * P.ring, top - H * 0.04, cz + Math.cos(a) * D * P.ring * 1.15);
    tuft.scaling.set(1, 0.75, 1);
    tuft.rotation.set(a * 0.7, a, 0);
    tuft.material = fur;
    tuft.parent = tm.parent;
    out.push(tuft);
  }
  return out;
}

/*
 * [S] 459 the Banner Bearer's shako (audit 457 a.1: "headgear, bald head - TABS: a tall team shako with a gold front plate and a plume";
 * legacy.banner_bearer.red.png: a tall team cylinder a little wider at the top, standing about a head over the head, a short dark peak over the brow,
 * a gold plate on its front, a gold band round its top and a white plume standing up from the front of the crown). SHAKO, in the head's W and H:
 * the body .wide W across at the seat, .flare of that at its top, .tall H over the head top; a dark peak .peak W out over the brow, .peakThick H thick;
 * a gold plate .plate W wide and .plateTall H tall on the front, .proud W off it; a gold band .band H at the top; a white plume, a cone .plume H tall,
 * .plumeWide W across, on the front of the top. Team colour times .shade, self-lit .glow.
 */
const SHAKO = { sides: 10, wide: 1.02, flare: 1.12, tall: 0.95, peak: 0.42, peakThick: 0.04, plate: 0.42, plateTall: 0.34, proud: 0.03, band: 0.08, plume: 0.42, plumeWide: 0.22, shade: 0.85, glow: 0.12 };
const SHAKO_GOLD = new Color3(0.95, 0.66, 0.16);

/** The Banner Bearer's tall team shako (spec at SHAKO), in the hat's units; `seat` under the head top. Returns the body. */
export function buildShako(scene: Scene, W: number, H: number, seat: number, unit: number, teamColor?: Color3): Mesh {
  const S = SHAKO;
  const u = (v: number) => v / unit;
  const mf = getMaterialFactory();
  const t = (teamColor ?? new Color3(0.5, 0.5, 0.55)).scale(S.shade);
  const felt = mf.get("cloth", t, { emissive: t.scale(S.glow) });
  const gold = mf.get("cloth", SHAKO_GOLD, { emissive: SHAKO_GOLD.scale(0.2) });
  const dark = mf.get("cloth", new Color3(0.06, 0.05, 0.05), {});
  const white = mf.get("cloth", new Color3(0.95, 0.94, 0.92), { emissive: new Color3(0.2, 0.2, 0.2) });
  const tall = -seat + S.tall * H;
  const shako = MeshBuilder.CreateCylinder("shako", { height: u(tall), diameterBottom: u(S.wide * W), diameterTop: u(S.wide * W * S.flare), tessellation: S.sides }, scene);
  shako.position.y = u(seat + tall / 2);
  shako.material = felt;
  shako.convertToFlatShadedMesh();
  const part = (m: Mesh, x: number, y: number, z: number, material: Material): Mesh => {
    m.position.set(u(x), u(y), u(z)); m.material = material; m.parent = shako; m.convertToFlatShadedMesh(); return m;
  };
  const front = S.wide * W / 2;
  part(MeshBuilder.CreateBox("shakoPeak", { width: u(S.wide * W * 0.9), height: u(S.peakThick * H), depth: u(S.peak * W) }, scene), 0, -tall / 2 + S.peakThick * H / 2, front * 0.8 + S.peak * W / 2 - front * 0.4, dark);
  part(MeshBuilder.CreateBox("shakoPlate", { width: u(S.plate * W), height: u(S.plateTall * H), depth: u(S.proud * W) }, scene), 0, 0, front * 1.04, gold);
  part(MeshBuilder.CreateCylinder("shakoBand", { height: u(S.band * H), diameter: u(S.wide * W * S.flare * 1.03), tessellation: S.sides }, scene), 0, tall / 2 - S.band * H / 2, 0, gold);
  part(MeshBuilder.CreateCylinder("shakoPlume", { height: u(S.plume * H), diameterTop: 0, diameterBottom: u(S.plumeWide * W), tessellation: 6 }, scene), 0, tall / 2 + S.plume * H / 2, front * 0.6, white);
  return shako;
}

/** The trunk's box in the torso frame (W, H, D its sizes, c its middle) and a maker for flat-shaded pieces laid on it (pirateBelt's frame). */
function trunkFrame(scene: Scene, body: ArticulatedBody, out: Mesh[]) {
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, ts = tm.scaling;
  const W = tb.extendSize.x * 2 * ts.x, H = tb.extendSize.y * 2 * ts.y, D = tb.extendSize.z * 2 * ts.z;
  const cx = tm.position.x + tb.center.x * ts.x, cy = tm.position.y + tb.center.y * ts.y, cz = tm.position.z + tb.center.z * ts.z;
  const lay = (m: Mesh, x: number, y: number, z: number, mat: Material): Mesh => {
    m.position.set(cx + x, cy + y, cz + z);
    m.rotation.addInPlace(tm.rotation);
    m.parent = tm.parent;
    m.material = mat;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  return { W, H, D, lay };
}

/** A dress front outside the yoke and pelvis as well as the inset chest wedge. */
function outerTrunkFrame(scene: Scene, body: ArticulatedBody, out: Mesh[]) {
  const frame = trunkFrame(scene, body, out);
  body.torso.computeWorldMatrix(true);
  const inv = body.torso.getWorldMatrix().clone().invert();
  let halfW = frame.W / 2, halfD = frame.D / 2;
  for (const m of [...body.torso.getChildMeshes(true), ...body.hip.getChildMeshes(true)]) {
    if (!/_yoke$|_pelvis$/.test(m.name)) continue;
    m.computeWorldMatrix(true);
    const transform = m.getWorldMatrix().multiply(inv), p = m.getVerticesData("position") ?? [];
    for (let i = 0; i < p.length; i += 3) {
      const v = Vector3.TransformCoordinates(Vector3.FromArray(p, i), transform);
      halfW = Math.max(halfW, Math.abs(v.x)); halfD = Math.max(halfD, Math.abs(v.z));
    }
  }
  return { ...frame, W: halfW * 2, D: halfD * 2 };
}

/*
 * [S] 460 the Banner Bearer's coatee (critic 459 a.2: "torso, plain team body - TABS: a military coatee with gold epaulettes and a white cross-belt";
 * legacy.banner_bearer.blue.png: a team coatee, a broad gold epaulette lying on each shoulder over the top of the arm, a white belt crossing the chest
 * from the left shoulder to the right hip and a white belt round the waist). BANNER_COATEE: the trunk in the team coat (team times .shade, self-lit
 * .glow); on each upper arm a gold epaulette, a shell .epOut of the limb round from its top to .epTo of it, with a gold fringe ring .fringe below it a
 * shade darker; a white cross-belt .belt W wide and .thick D proud of the trunk's front and back, running corner to corner over .span of the trunk's
 * height; a white waist belt .waist H tall at .waistAt of H/2 under the middle. White self-lit .whiteGlow (lit white in shade reads grey).
 */
const BANNER_COATEE = { shade: 0.85, glow: 0.12, epOut: 1.75, epTo: 0.16, fringe: 0.1, belt: 0.16, thick: 1.12, span: 0.82, waist: 0.12, waistAt: -0.72, white: new Color3(0.95, 0.94, 0.9), whiteGlow: 0.3 };
const COATEE_GOLD = new Color3(1, 0.7, 0.18);

/** The Banner Bearer's team coatee, gold epaulettes, white cross-belt and waist belt (spec at BANNER_COATEE). */
export function bannerCoatee(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const C = BANNER_COATEE;
  const mf = getMaterialFactory();
  const t = teamColor.scale(C.shade);
  const coat = mf.get("cloth", t, { emissive: t.scale(C.glow) });
  const gold = mf.get("cloth", COATEE_GOLD, { emissive: COATEE_GOLD.scale(0.2) });
  const fringeC = COATEE_GOLD.scale(0.75);
  const fringe = mf.get("cloth", fringeC, { emissive: fringeC.scale(0.2) });
  const white = mf.get("cloth", C.white, { emissive: C.white.scale(C.whiteGlow) });
  body.torsoMesh.material = coat;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke/.test(m.name) && m instanceof Mesh) m.material = coat;
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    out.push(limbShell(scene, "coateeEpaulette", arm, 0, C.epTo, C.epOut, gold));
    out.push(limbShell(scene, "coateeFringe", arm, C.epTo, C.epTo + C.fringe, C.epOut * 0.9, fringe));
  }
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  // the cross-belt: one slab through the trunk, its faces proud of the front and the back, tipped corner to corner
  const rise = H * C.span, run = W * 0.92;
  const strap = MeshBuilder.CreateBox("coateeCrossBelt", { width: Math.hypot(rise, run), height: W * C.belt, depth: D * C.thick }, scene);
  strap.rotation.z = -Math.atan2(rise, run);
  lay(strap, 0, 0, 0, white);
  lay(MeshBuilder.CreateBox("coateeWaistBelt", { width: W * 1.06, height: H * C.waist, depth: D * C.thick }, scene), 0, H / 2 * C.waistAt, 0, white);
  return out;
}

/*
 * [S] 460 the Flag Bearer's helmet (audit 457 a.1: "headgear, bald - TABS: a white-and-gold helmet with a team crest"; legacy.flag_bearer.red.png:
 * a white round helmet a little wider than the head, sitting on the brow with the eyes clear under it, a gold band round its foot, a gold plate up its
 * front and a team-coloured crest standing up along the top from front to back). FLAG_HELMET, in the head's W and H: a white crown .wide W across from
 * the seat to .tall H over the head top, a dome .dome H on it; a gold band .band H at its foot, .bandOut of the crown; a gold front plate .plate W wide
 * up the crown; a team crest .crest H tall, .crestLong W long and .crestThin W thin, on the dome's top. White self-lit .whiteGlow.
 */
const FLAG_HELMET = { sides: 10, wide: 1.08, tall: 0.18, dome: 0.3, band: 0.12, bandOut: 1.05, plate: 0.22, crest: 0.42, crestLong: 0.8, crestThin: 0.14, white: new Color3(0.95, 0.94, 0.9), whiteGlow: 0.25, glow: 0.12 };

/** The Flag Bearer's white helmet with a gold band and a team crest (spec at FLAG_HELMET), in the hat's units; `seat` under the head top. */
export function buildFlagHelmet(scene: Scene, W: number, H: number, seat: number, unit: number, teamColor?: Color3): Mesh {
  const F = FLAG_HELMET;
  const u = (v: number) => v / unit;
  const mf = getMaterialFactory();
  const white = mf.get("cloth", F.white, { emissive: F.white.scale(F.whiteGlow) });
  const gold = mf.get("cloth", COATEE_GOLD, { emissive: COATEE_GOLD.scale(0.2) });
  const t = teamColor ?? new Color3(0.5, 0.5, 0.55);
  const team = mf.get("cloth", t, { emissive: t.scale(F.glow) });
  const tall = -seat + F.tall * H, D = F.wide * W;
  const crown = MeshBuilder.CreateCylinder("flagHelmet", { height: u(tall), diameter: u(D), tessellation: F.sides }, scene);
  crown.position.y = u(seat + tall / 2);
  crown.material = white;
  crown.convertToFlatShadedMesh();
  const part = (m: Mesh, x: number, y: number, z: number, material: Material): Mesh => {
    m.position.set(u(x), u(y), u(z)); m.material = material; m.parent = crown; m.convertToFlatShadedMesh(); return m;
  };
  const dome = part(MeshBuilder.CreateSphere("flagHelmetDome", { diameter: u(D), segments: 5, slice: 0.5 }, scene), 0, tall / 2, 0, white);
  dome.scaling.y = (F.dome * H) / (D / 2);
  part(MeshBuilder.CreateCylinder("flagHelmetBand", { height: u(F.band * H), diameter: u(D * F.bandOut), tessellation: F.sides }, scene), 0, -tall / 2 + F.band * H / 2, 0, gold);
  part(MeshBuilder.CreateBox("flagHelmetPlate", { width: u(F.plate * W), height: u(tall + F.dome * H * 0.6), depth: u(0.04 * W) }, scene), 0, F.dome * H * 0.3, D / 2 * 1.02, gold);
  part(MeshBuilder.CreateBox("flagHelmetCrest", { width: u(F.crestThin * W), height: u(F.crest * H), depth: u(F.crestLong * W) }, scene), 0, tall / 2 + F.dome * H + F.crest * H * 0.25, 0, team);
  return crown;
}

/*
 * [S] 460 the Boxer's shorts (critic 459 a.3: "shorts, plain team body - TABS: long dark-team shorts with a gold striped waistband"; legacy.boxer.red.png:
 * loose dark-team shorts from the waist to just above the knee, wider than the thigh, and round the waist a broad gold band of .stripes horizontal
 * stripes, a lighter and a darker gold by turns). BOXER_SHORTS: the pelvis and a shell over each thigh .out of the limb round to .to of it in the team
 * colour times .shade (self-lit .glow); the waistband on the trunk's foot, .band H tall, .bandOut W and D, its stripes stepping proud by turns.
 */
const BOXER_SHORTS = { shade: 0.55, glow: 0.12, out: 1.85, to: 0.88, band: 0.24, bandOut: 1.1, stripes: 4, step: 0.03 };

/** The Boxer's long dark-team shorts and gold striped waistband (spec at BOXER_SHORTS). */
export function boxerShorts(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = BOXER_SHORTS;
  const mf = getMaterialFactory();
  const t = teamColor.scale(S.shade);
  const dark = mf.get("cloth", t, { emissive: t.scale(S.glow) });
  const gold = mf.get("cloth", COATEE_GOLD, { emissive: COATEE_GOLD.scale(0.2) });
  const deep = COATEE_GOLD.scale(0.7);
  const gold2 = mf.get("cloth", deep, { emissive: deep.scale(0.2) });
  for (const m of body.hip.getChildMeshes(true)) if (/_pelvis$/.test(m.name) && m instanceof Mesh) m.material = dark;
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) out.push(limbShell(scene, "boxerShorts", thigh, 0, S.to, S.out, dark));
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  const each = H * S.band / S.stripes;
  for (let k = 0; k < S.stripes; k++) {
    const grow = 1 + (k % 2 ? 0 : S.step);
    lay(MeshBuilder.CreateBox("boxerWaistband", { width: W * S.bandOut * grow, height: each, depth: D * S.bandOut * grow }, scene), 0, -H / 2 + each * (k + 0.5), 0, k % 2 ? gold2 : gold);
  }
  return out;
}

/*
 * [S] 460 the Peasant's rope belt (critic 459 a.5: "waist, no belt - TABS: a thick cream braided rope belt"; legacy.peasant.red.png: a fat cream rope
 * round the waist over the dress, about a third of the way up the trunk, made of twisted lumps leaning one way and then the other). PEASANT_BELT: .lumps
 * faceted lumps on an ellipse .out of the trunk's half width and depth at .at of H/2 under its middle, each .lump W long along the rope and .fat of
 * that thick, leaning .twist rad by turns. Cream .cream, self-lit .glow (lit cream in shade reads grey).
 */
const PEASANT_BELT = { lumps: 14, out: 1.12, at: -0.42, lump: 0.5, fat: 0.8, twist: 0.6, cream: new Color3(1, 0.95, 0.8), glow: 0.32 };

/** The Peasant's cream braided rope belt round the dress's waist (spec at PEASANT_BELT). */
export function peasantBelt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = PEASANT_BELT;
  const cream = getMaterialFactory().get("cloth", P.cream, { emissive: P.cream.scale(P.glow) });
  const out: Mesh[] = [];
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  const rx = W / 2 * P.out, rz = D / 2 * P.out, y = H / 2 * P.at;
  for (let k = 0; k < P.lumps; k++) {
    const a = (k / P.lumps) * Math.PI * 2;
    const lump = MeshBuilder.CreateIcoSphere("peasantBelt", { radius: 0.5, subdivisions: 1, flat: true }, scene);
    const long = W * P.lump;
    lump.scaling.set(long, long * P.fat, long * P.fat);
    // along the rope's tangent, leaning one way and then the other: the braid
    lump.rotation.set(0, a + Math.PI / 2, k % 2 ? P.twist : -P.twist);
    lay(lump, Math.sin(a) * rx, y, Math.cos(a) * rz, cream);
  }
  return out;
}

/*
 * [S] 460 the Poacher's belt (critic 459 a.6: "belt, none - TABS: a tan belt with a buckle"; legacy.poacher.jpg: a light tan leather belt round the
 * waist where the coat meets the legs, a square dark-grey buckle frame on its front). POACHER_BELT, on the trunk: a band .tall of H tall at .at of H/2
 * under the middle, .out of W and D; a square buckle frame .buckle W across of bars .bar of it, .proud W off the band. Tan .tan, buckle .grey.
 */
const POACHER_BELT = { tall: 0.16, at: -0.84, out: 1.14, buckle: 0.3, bar: 0.24, proud: 0.05, tan: new Color3(0.85, 0.55, 0.25), grey: new Color3(0.32, 0.32, 0.34), glow: 0.16 };

/** The Poacher's tan belt with a grey square buckle at the coat's waist (spec at POACHER_BELT). */
export function poacherBelt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = POACHER_BELT;
  const mf = getMaterialFactory();
  const tan = mf.get("cloth", P.tan, { emissive: P.tan.scale(P.glow) });
  const grey = mf.get("cloth", P.grey, { emissive: P.grey.scale(P.glow) });
  const out: Mesh[] = [];
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  const y = H / 2 * P.at;
  lay(MeshBuilder.CreateBox("poacherBelt", { width: W * P.out, height: H * P.tall, depth: D * P.out }, scene), 0, y, 0, tan);
  const s = W * P.buckle, bar = s * P.bar, z = D * P.out / 2 + W * P.proud / 2;
  for (const side of [-1, 1]) {
    lay(MeshBuilder.CreateBox("poacherBuckle", { width: bar, height: s, depth: W * P.proud }, scene), side * (s - bar) / 2, y, z, grey);
    lay(MeshBuilder.CreateBox("poacherBuckle", { width: s, height: bar, depth: W * P.proud }, scene), 0, y + side * (s - bar) / 2, z, grey);
  }
  return out;
}

/*
 * [S] 461 the Banner Bearer's white cuffs (critic 460 a.3: "cuffs, bare team forearms - TABS: white cuffs"; legacy.banner_bearer.red.png: a broad white
 * cuff round each wrist, the lower third of the forearm, a little wider than the sleeve). BANNER_CUFFS: on each forearm a white shell .out of the limb
 * round from .from to .to of its length. White self-lit BANNER_COATEE.whiteGlow (lit white in shade reads grey).
 */
const BANNER_CUFFS = { from: 0.62, to: 1.0, out: 1.45 };

/** The Banner Bearer's broad white cuffs at the wrists (spec at BANNER_CUFFS). */
export function bannerCuffs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = BANNER_CUFFS;
  const white = getMaterialFactory().get("cloth", BANNER_COATEE.white, { emissive: BANNER_COATEE.white.scale(BANNER_COATEE.whiteGlow) });
  return [body.leftLowerArm, body.rightLowerArm].map((arm) => limbShell(scene, "bannerCuff", arm, C.from, C.to, C.out, white));
}

/*
 * [S] 461 the Boxer's laced boots (critic 460 a.4: "boots, team feet - TABS: tall laced boots"; legacy.boxer.red.png: team boots from mid-shin to the sole,
 * the shaft wider than the shin, a white lace crossed in .laces bars up its front, the foot a team block). BOXER_BOOTS in the shin's box: a 6-sided team
 * shell .out of its half-width round it from .from to .to of its length, the foot in the same cloth; up the shaft's front .laces white bars .lace of the
 * shell across, .bar of its length tall, tipped .tilt rad by turns (the crossing), .proud off it. Team times .shade, white self-lit .whiteGlow.
 */
const BOXER_BOOTS = { from: 0.5, to: 1.04, out: 1.45, laces: 4, lace: 1.5, bar: 0.035, tilt: 0.35, proud: 0.015, shade: 0.85, glow: 0.12, whiteGlow: 0.3 };

/** The Boxer's tall team boots with white crossed laces (spec at BOXER_BOOTS). */
export function boxerBoots(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const B = BOXER_BOOTS;
  const mf = getMaterialFactory();
  const t = teamColor.scale(B.shade);
  const team = mf.get("cloth", t, { emissive: t.scale(B.glow) });
  const white = mf.get("cloth", BANNER_COATEE.white, { emissive: BANNER_COATEE.white.scale(B.whiteGlow) });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const shell = limbShell(scene, "boxerBoot", shin, B.from, B.to, B.out, team);
    out.push(shell);
    const bb = shin.getBoundingInfo().boundingBox, half = bb.extendSize.y * shin.scaling.y, mid = shin.position.y + bb.center.y * shin.scaling.y;
    const r = Math.max(bb.extendSize.x * shin.scaling.x, bb.extendSize.z * shin.scaling.z) * B.out;
    const front = r * shell.scaling.z;
    for (let k = 0; k < B.laces; k++) {
      const y = mid + half - (B.from + (0.85 - B.from) * (k + 0.5) / B.laces) * half * 2;
      const lace = MeshBuilder.CreateBox("boxerLace", { width: r * B.lace, height: half * 2 * B.bar, depth: r * 0.12 }, scene);
      lace.position.set(0, y, front + B.proud); // limbShell's shell sits on the joint's axis
      lace.rotation.z = k % 2 ? B.tilt : -B.tilt;
      lace.material = white;
      lace.parent = shin.parent;
      lace.convertToFlatShadedMesh();
      out.push(lace);
    }
  }
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) if (foot instanceof Mesh && /_[lr]FootM$/.test(foot.name)) foot.material = team;
  }
  return out;
}

/*
 * [S] 461 the Flag Bearer's jacket (critic 460 a.2: "jacket, plain team body - TABS: a team military jacket with gold front trim"; legacy.flag_bearer
 * .red.png: a team jacket over the trunk, a gold placket down the middle of its front from the collar to the hem, a gold standing collar round the neck,
 * the hem a little below the waist). FLAG_JACKET on the trunk: the trunk and yoke in the team coat (team times .shade, self-lit .glow); a gold placket
 * .placket W wide down the front, .proud D off it; a gold collar ring at the trunk's top, .collar H tall, .collarOut of W and D across. Gold COATEE_GOLD.
 */
const FLAG_JACKET = { shade: 0.85, glow: 0.12, placket: 0.12, proud: 0.05, collar: 0.1, collarOut: 0.82 };

/** The Flag Bearer's team jacket with a gold placket and a gold collar (spec at FLAG_JACKET). */
export function flagJacket(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const J = FLAG_JACKET;
  const mf = getMaterialFactory();
  const t = teamColor.scale(J.shade);
  const coat = mf.get("cloth", t, { emissive: t.scale(J.glow) });
  const gold = mf.get("cloth", COATEE_GOLD, { emissive: COATEE_GOLD.scale(0.2) });
  body.torsoMesh.material = coat;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke/.test(m.name) && m instanceof Mesh) m.material = coat;
  const out: Mesh[] = [];
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  lay(MeshBuilder.CreateBox("flagJacketPlacket", { width: W * J.placket, height: H * 0.98, depth: D * J.proud }, scene), 0, 0, D / 2 + D * J.proud / 2, gold);
  lay(MeshBuilder.CreateCylinder("flagJacketCollar", { height: H * J.collar, diameterTop: W * J.collarOut * 0.9, diameterBottom: W * J.collarOut, tessellation: 8 }, scene), 0, H / 2 + H * J.collar / 2 - H * 0.02, 0, gold).scaling.z = D / W;
  return out;
}

/*
 * [S] 461 the Peasant's pants, socks and shoes (critic 460 a.6: "lower legs, team legs to the feet - TABS: cuffed team pants above tan socks and brown
 * shoes"; legacy.peasant.red.png: team pants from the dress hem to mid-shin, a turned cuff a little wider at their foot, under it a tan sock down into a
 * low brown shoe). PEASANT_LEGS in the shin's box: the pant leg a team shell .pantOut round from the knee to .pantTo, a cuff .cuffOut round over
 * .cuff of the shin above .pantTo, a tan sock .sockOut round from .pantTo to .sockTo; each foot block in brown leather. Self-lit .glow.
 */
const PEASANT_LEGS = { pantOut: 1.35, pantTo: 0.55, cuff: 0.1, cuffOut: 1.55, sockOut: 1.2, sockTo: 1.0, shade: 0.8, tan: new Color3(0.8, 0.6, 0.35), brown: new Color3(0.3, 0.16, 0.08), glow: 0.14 };

/** The Peasant's cuffed team pants to mid-shin, tan socks and brown shoes (spec at PEASANT_LEGS). */
export function peasantLegs(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const P = PEASANT_LEGS;
  const mf = getMaterialFactory();
  const t = teamColor.scale(P.shade);
  const pants = mf.get("cloth", t, { emissive: t.scale(P.glow) });
  const tan = mf.get("cloth", P.tan, { emissive: P.tan.scale(P.glow) });
  const brown = mf.get("cloth", P.brown, { emissive: P.brown.scale(P.glow) });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "peasantPants", shin, 0, P.pantTo, P.pantOut, pants));
    out.push(limbShell(scene, "peasantPantsCuff", shin, P.pantTo - P.cuff, P.pantTo, P.cuffOut, pants));
    out.push(limbShell(scene, "peasantSock", shin, P.pantTo, P.sockTo, P.sockOut, tan));
  }
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) if (foot instanceof Mesh && /_[lr]FootM$/.test(foot.name)) foot.material = brown;
  }
  return out;
}

/*
 * [S] 461 the Peasant's fringe (critic 460 a.3: "hair, none - TABS: dark shaggy fringe hanging out of the hood over the eyes"; legacy.peasant.red.png:
 * dark brown-black hair in long ragged locks hanging from under the hood's front edge over the brow and down both cheeks to the jaw, the eyes showing
 * between them). PEASANT_FRINGE in the head box (half sizes e, centre c, +z the face): .locks thin faceted locks along the front from side to side,
 * each .lockW e.x wide and .thick e.z deep, from .top e.y over the centre down to .foot e.y under it (the side ones longer by .sideLong), .proud e.z in
 * front of the face plane; the middle .gap e.x left open over the eyes. Near-black brown .color, self-lit .glow.
 */
const PEASANT_FRINGE = { locks: 6, lockW: 0.22, thick: 0.12, top: 0.92, foot: 0.18, sideLong: 0.75, proud: 0.04, gap: 0.5, color: new Color3(0.07, 0.05, 0.04), glow: 0.1 };

/** The Peasant's dark shaggy fringe hanging out of the hood over the brow (spec at PEASANT_FRINGE), hung on the head. */
export function peasantFringe(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = PEASANT_FRINGE;
  const hair = getMaterialFactory().get("cloth", P.color, { emissive: P.color.scale(P.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const out: Mesh[] = [];
  const per = P.locks / 2;
  for (const s of [-1, 1]) {
    for (let k = 0; k < per; k++) {
      // from beside the eyes out to the cheek: the outer locks hang longest, down the sides of the face
      const u = (k + 0.5) / per;
      const x = s * e.x * (P.gap / 2 + (1 - P.gap / 2) * u);
      const foot = P.foot + P.sideLong * u * u;
      const tall = e.y * (P.top + foot);
      const lock = MeshBuilder.CreateBox("peasantFringe", { width: e.x * P.lockW, height: tall, depth: e.z * P.thick }, scene);
      lock.position.set(c.x + x, c.y + e.y * (P.top - foot) / 2, c.z + e.z * (1 + P.proud) - e.z * P.thick * 0.5 - e.z * 0.25 * u);
      lock.rotation.z = s * 0.12 * (k % 2 ? 1 : 0.4);
      lock.material = hair;
      lock.parent = head;
      lock.convertToFlatShadedMesh();
      out.push(lock);
    }
  }
  return out;
}

/*
 * [S] 461 the Poacher's boots (critic 460 a.5: "boots, team feet - TABS: tan fur boots"; legacy.poacher.red.png: tan-brown leather boots from below the
 * mid-shin to the sole, a wide turned-down top over the shaft, the foot a tan block). POACHER_BOOTS in the shin's box (the MINER_BOOTS cut): a 6-sided
 * shell .out round from .from to .to of its length, a turned top .cuff round from .cuffFrom to .from; the foot in the same leather. Self-lit .glow.
 */
const POACHER_BOOTS = { from: 0.62, to: 1.04, out: 1.3, cuffFrom: 0.5, cuff: 1.6, color: new Color3(0.62, 0.36, 0.18), glow: 0.14 };

/** The Poacher's tan boots with a turned-down top (spec at POACHER_BOOTS). */
export function poacherBoots(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = POACHER_BOOTS;
  const leather = getMaterialFactory().get("cloth", B.color, { emissive: B.color.scale(B.glow) });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "poacherBoot", shin, B.from, B.to, B.out, leather));
    out.push(limbShell(scene, "poacherBootTop", shin, B.cuffFrom, B.from + 0.02, B.cuff, leather));
  }
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) if (foot instanceof Mesh && /_[lr]FootM$/.test(foot.name)) foot.material = leather;
  }
  return out;
}

/*
 * [S] 462 the Blowdarter's hair; [S] 469 the bob rebuilt (CONFIRM 468 a.3: "TABS: a dark-brown bob with a centre part and side locks down to the jaw, framing
 * the face; ours is a flat brown slab behind the head with a flat lid overhanging the brow"; legacy.blowdarter.blue.png: the crown in two sloped halves
 * meeting at a ridge down the middle, no brim over the brow; a lock each side flaring out from the temple to the jaw, its front edge framing the face;
 * the back falling to the nape). BLOWDARTER_HAIR in the head box (half sizes e, centre c, +z the face): two roof halves .roof e.x across and .cap e.y
 * thick, sloped .slope rad down from the centre ridge, from .back e.z behind to .brow e.z ahead of the centre (short of the brow); a lock each side .side
 * e.x thick from .top e.y over the centre to .foot e.y under it, .back to .front e.z, flared .flare rad out at its foot; a back sheet to .nape e.y
 * under the centre. Dark brown .color, self-lit .glow.
 */
const BLOWDARTER_HAIR = { roof: 1.12, cap: 0.3, slope: 0.32, brow: 0.7, side: 0.3, top: 0.95, foot: 0.85, back: 1.08, front: 0.55, flare: 0.14, nape: 0.8, color: new Color3(0.16, 0.08, 0.06), glow: 0.12 };

/** The Blowdarter's parted dark brown bob over a bare head (spec at BLOWDARTER_HAIR), hung on the head. */
export function blowdarterHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = BLOWDARTER_HAIR;
  const hair = getMaterialFactory().get("cloth", B.color, { emissive: B.color.scale(B.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, y: number, z: number): Mesh => {
    m.position.set(x, y, z);
    m.material = hair;
    m.parent = head;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  const depth = e.z * (B.back + B.brow), zMid = c.z + e.z * (B.brow - B.back) / 2;
  for (const s of [-1, 1]) {
    // a roof half: its inner edge at the ridge over the centre, sloping down to the side
    const w = e.x * B.roof;
    const roof = put(MeshBuilder.CreateBox("blowdarterRoof", { width: w, height: e.y * B.cap, depth }, scene),
      c.x + s * (w / 2) * Math.cos(B.slope), c.y + e.y * (1 + B.cap / 2) - (w / 2) * Math.sin(B.slope) + e.y * 0.08, zMid);
    roof.rotation.z = -s * B.slope;
    const t = e.x * B.side, tall = e.y * (B.top + B.foot);
    const lock = put(MeshBuilder.CreateBox("blowdarterHair", { width: t, height: tall, depth: e.z * (B.back + B.front) }, scene),
      c.x + s * (e.x + t / 2), c.y + e.y * (B.top - B.foot) / 2, c.z + e.z * (B.front - B.back) / 2);
    lock.rotation.z = s * B.flare;
  }
  const t = e.x * B.side, tall = e.y * (B.top + B.nape);
  put(MeshBuilder.CreateBox("blowdarterBackHair", { width: (e.x + t) * 2, height: tall, depth: t }, scene), c.x, c.y + e.y * (B.top - B.nape) / 2, c.z - e.z * B.back + t / 2);
  return out;
}

/*
 * [P] 463 the Pike's plume tan (critic 462 pike a.1: "the plume over his brim is team red, not tan"; legacy.pike.jpg, .red.png: a tan feather plume
 * on the team hat). The cavalier hat's plume lumps (propBuilder featherClump, named featherHatPlume) take PIKE_PLUME.color, self-lit .glow.
 */
const PIKE_PLUME = { color: new Color3(1.0, 0.72, 0.32), glow: 0.08 };

/** Recolours the Pike's cavalier plume tan (spec at PIKE_PLUME); the hat is already on the head. */
export function pikePlume(body: ArticulatedBody): void {
  const tan = getMaterialFactory().get("cloth", PIKE_PLUME.color, { emissiveIntensity: PIKE_PLUME.glow });
  for (const m of body.root.getChildMeshes(false, (n) => n.name === "featherHatPlume")) m.material = tan;
}

/*
 * [S] 463 the Barrel Roller rides his barrel (audit 457 barrel_roller b.1: "a dark barrel carried at the waist - TABS: he stands on top of a lying
 * barrel"; b.2: "a dark brown drum - TABS: a light wooden staved barrel with two riveted grey hoops"; legacy.barrel_roller.red.png, card Appearance
 * "riding on a normal explosive barrel": a barrel lying across his way under his boots, about a third of his height thick and nearly half his height
 * long, light orange-brown staves, a grey hoop riveted round it near each end, his feet on its top). BARREL_RIDE in his height H: the barrel .wide H
 * across, .long H long, of .staves boards .thick of its radius deep (every other one .alt darker), lying on the ground across his heading; hoops .hoop H
 * wide at +-.hoopAt of the half-length, .hoopOut H proud, each with .rivets rivets .rivet H across. His hip is lifted the barrel's height: a
 * "barrelRide" mark under the hip carries the lift in its position.y (proceduralAnimation _rideBarrel).
 */
const BARREL_RIDE = { wide: 0.3, long: 0.44, staves: 12, thick: 0.14, alt: 0.8, hoop: 0.035, hoopAt: 0.72, hoopOut: 0.008, rivets: 6, rivet: 0.016, wood: new Color3(0.9, 0.48, 0.2), iron: new Color3(0.38, 0.38, 0.4), glow: 0.1 };

/** The Barrel Roller's barrel lying under his feet (spec at BARREL_RIDE), on the root; returns its core, the staves and hoops under it. */
export function barrelRide(scene: Scene, body: ArticulatedBody): Mesh {
  const B = BARREL_RIDE, H = body.metrics.overallHeight;
  const mf = getMaterialFactory();
  const lit = (c: Color3) => mf.get("cloth", c, { emissive: c.scale(B.glow) });
  const wood = lit(B.wood), wood2 = lit(B.wood.scale(B.alt)), iron = lit(B.iron);
  const R = (B.wide * H) / 2, L = B.long * H, t = R * B.thick;
  const core = MeshBuilder.CreateCylinder("barrelBody", { height: L * 0.98, diameter: (R - t) * 2, tessellation: B.staves }, scene);
  core.material = wood2;
  core.rotation.z = Math.PI / 2; // its axis across his heading
  core.position.y = R;
  core.parent = body.root;
  const put = (m: Mesh, mat: Material): void => {
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.parent = core;
  };
  for (let i = 0; i < B.staves; i++) {
    const a = (i / B.staves) * Math.PI * 2;
    const stave = MeshBuilder.CreateBox("barrelStave", { width: ((2 * Math.PI * R) / B.staves) * 1.04, height: L, depth: t }, scene);
    stave.position.set(Math.sin(a) * (R - t / 2), 0, Math.cos(a) * (R - t / 2));
    stave.rotation.y = a;
    put(stave, i % 2 ? wood2 : wood);
  }
  for (const side of [-1, 1]) {
    const y = (side * B.hoopAt * L) / 2, rr = R + B.hoopOut * H;
    const hoop = MeshBuilder.CreateCylinder("barrelRideHoop", { height: B.hoop * H, diameter: rr * 2, tessellation: B.staves }, scene);
    hoop.position.y = y;
    hoop.rotation.y = Math.PI / B.staves;
    put(hoop, iron);
    for (let k = 0; k < B.rivets; k++) {
      const a = ((k + 0.5) / B.rivets) * Math.PI * 2;
      const rivet = MeshBuilder.CreateBox("barrelRivet", { width: B.rivet * H, height: B.rivet * H, depth: B.rivet * H }, scene);
      rivet.position.set(Math.sin(a) * rr, y, Math.cos(a) * rr);
      rivet.rotation.y = a;
      put(rivet, iron);
    }
  }
  const mark = new TransformNode("barrelRide", scene);
  mark.position.y = R * 2;
  mark.parent = body.hip;
  return core;
}

/*
 * [S] 465 the Pike's armour vest (audit 457 a.2: "torso, plain team body - TABS: a cream armour vest with a half-circle team emblem"; legacy.pike.jpg:
 * a pale cream cuirass over the trunk, a team half-disc on its chest, flat edge down). PIKE_VEST: the trunk in cream (self-lit .glow); a rim .rim H tall
 * at its foot, .rimOut of the trunk and a shade darker; the emblem a team half-disc .emblem W across, .proud D in front of the chest, its flat edge
 * .emblemAt of H/2 above the middle.
 */
const PIKE_VEST = { rim: 0.1, rimOut: 1.06, emblem: 0.62, proud: 0.04, emblemAt: -0.05, cream: new Color3(0.9, 0.76, 0.52), glow: 0.18, rimShade: 0.82, teamGlow: 0.15 };

/** The Pike's cream armour vest with a team half-disc on the chest (spec at PIKE_VEST). */
export function pikeVest(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const V = PIKE_VEST;
  const mf = getMaterialFactory();
  const cream = mf.get("cloth", V.cream, { emissive: V.cream.scale(V.glow) });
  const rimC = V.cream.scale(V.rimShade);
  const rim = mf.get("cloth", rimC, { emissive: rimC.scale(V.glow) });
  const team = mf.get("cloth", teamColor, { emissive: teamColor.scale(V.teamGlow) });
  body.torsoMesh.material = cream;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke/.test(m.name) && m instanceof Mesh) m.material = cream;
  const out: Mesh[] = [];
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  lay(MeshBuilder.CreateBox("pikeVestRim", { width: W * V.rimOut, height: H * V.rim, depth: D * V.rimOut }, scene), 0, -H / 2 + H * V.rim / 2, 0, rim);
  const emblem = MeshBuilder.CreateDisc("pikeVestEmblem", { radius: W * V.emblem / 2, arc: 0.5, tessellation: 20, sideOrientation: Mesh.DOUBLESIDE }, scene);
  lay(emblem, 0, H / 2 * V.emblemAt, D / 2 + D * V.proud, team);
  return out;
}

/*
 * [S] 465 the Barrel Roller's vest (audit 457 a.4: "shirt, plain team body - TABS: a team vest over a white open shirt"; legacy.barrel_roller.blue.png:
 * a dark team waistcoat, a white shirt showing in a deep V down the chest from the collar). BARREL_VEST: the trunk in team times .shade (self-lit
 * .glow); the shirt a white down-pointing triangle .vWide W across its top edge at the collar, reaching .vDeep of H down, .proud D in front of the chest;
 * white self-lit .whiteGlow.
 */
const BARREL_VEST = { shade: 0.7, glow: 0.12, vWide: 0.62, vDeep: 0.62, proud: 0.03, white: new Color3(0.95, 0.94, 0.9), whiteGlow: 0.3 };

/** The Barrel Roller's team vest over a white open shirt V (spec at BARREL_VEST). */
export function barrelVest(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const V = BARREL_VEST;
  const mf = getMaterialFactory();
  const t = teamColor.scale(V.shade);
  const vest = mf.get("cloth", t, { emissive: t.scale(V.glow) });
  const white = mf.get("cloth", V.white, { emissive: V.white.scale(V.whiteGlow) });
  body.torsoMesh.material = vest;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke/.test(m.name) && m instanceof Mesh) m.material = vest;
  const out: Mesh[] = [];
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  // a three-sided disc, one corner turned straight down: the flat top edge at the collar, the point down the chest
  const top = W * V.vWide, r = top / Math.sqrt(3);
  const shirt = MeshBuilder.CreateDisc("barrelVestShirt", { radius: r, tessellation: 3, sideOrientation: Mesh.DOUBLESIDE }, scene);
  shirt.rotation.z = -Math.PI / 2;
  shirt.scaling.x = (H * V.vDeep) / (1.5 * r); // the point runs along the disc's own x, turned down
  lay(shirt, 0, H / 2 - (r / 2) * shirt.scaling.x, D / 2 + D * V.proud, white);
  return out;
}

/*
 * [S] 466 the Peasant's undersleeves (CONFIRM 465 a.1: "bare team forearms below the short dress sleeves - TABS: tan/brown long undersleeves run from under
 * the short team sleeve to the wrist, ending in a flared tan cuff"; legacy.peasant.blue.png). PEASANT_SLEEVES: a tan shell .upperOut of the upper arm round
 * from .from of it (under the dress sleeve's foot) to its end, a tan shell .lowerOut round the forearm to .lowerTo of it, and a flared cuff .cuffOut round
 * from .cuffFrom to its end. Tan .tan self-lit .glow (lit tan in shade reads grey).
 */
const PEASANT_SLEEVES = { from: 0.45, upperOut: 1.2, lowerOut: 1.25, lowerTo: 0.8, cuffFrom: 0.72, cuffOut: 1.75, tan: new Color3(0.85, 0.55, 0.28), glow: 0.22 };

/** The Peasant's tan undersleeves to the wrist with a flared cuff (spec at PEASANT_SLEEVES). */
export function peasantSleeves(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = PEASANT_SLEEVES;
  const tan = getMaterialFactory().get("cloth", P.tan, { emissive: P.tan.scale(P.glow) });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "peasantUnderSleeve", arm, P.from, 1.0, P.upperOut, tan));
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "peasantUnderSleeve", arm, 0, P.lowerTo, P.lowerOut, tan));
    out.push(limbShell(scene, "peasantSleeveCuff", arm, P.cuffFrom, 1.0, P.cuffOut, tan));
  }
  return out;
}

/*
 * [S] 466 the Boxer's bare chest (CONFIRM 465 a.1: "dark vest block covering the chest above the yellow waistband - TABS: bare team-skin chest and
 * shoulders, nothing between the neck and the yellow waistband"; legacy.boxer.red.png). The trunk and its yoke take the arm's skin material, so the
 * body's dark clothing shade no longer reads as a vest.
 */
export function boxerBareChest(body: ArticulatedBody): void {
  const skin = body.leftUpperArm.material;
  if (!skin) return;
  body.torsoMesh.material = skin;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke/.test(m.name) && m instanceof Mesh) m.material = skin;
}


/*
 * [S] 472 the Super Boxer's yellow eyes (audit 468 super_boxer a.6: "eyes: black beads - TABS: yellow eyes"; card Appearance: "its eyes are yellow unlike
 * most units"; legacy.super_boxer.red.png: two bright pale discs under the headband). SUPER_BOXER_EYES: each eye disc in a self-lit .eye yellow, its pupil
 * a deep amber .pupil so the disc still reads as an eye; the dark rim stays.
 */
const SUPER_BOXER_EYES = { eye: new Color3(1, 0.82, 0.12), eyeGlow: 0.7, pupil: new Color3(0.5, 0.26, 0.02), pupilGlow: 0.2 };

/** The Super Boxer's yellow eye discs with amber pupils (spec at SUPER_BOXER_EYES). */
export function superBoxerEyes(body: ArticulatedBody): void {
  const E = SUPER_BOXER_EYES;
  const mf = getMaterialFactory();
  const eye = mf.get("bone", E.eye, { emissive: E.eye.scale(E.eyeGlow) });
  const pupil = mf.get("bone", E.pupil, { emissive: E.pupil.scale(E.pupilGlow) });
  for (const m of [body.leftEye, body.rightEye]) {
    if (!m) continue;
    m.material = eye;
    for (const c of m.getChildMeshes(true)) if (/Pupil$/.test(c.name)) c.material = pupil;
  }
}


/*
 * [S] 472 Thor's belt (audit 468 thor a.4: "belt missing - TABS: a wide grey Viking belt with a round central buckle"; legacy.thor.red.png: at the foot of
 * the coat a broad grey band round the waist, a quarter of the trunk tall, and on its front a big round grey buckle wider than the band, an octagonal
 * plate with a darker raised boss in its middle and small studs along the band beside it). THOR_BELT: a band .tall H high, .out of W and D, its middle
 * .at of H/2 under the trunk's middle, grey .grey; an octagonal plate .buckle W across on its front, .proud D out; a boss .boss of the plate, darker
 * .dark; .studs studs each side .stud W across. Self-lit .glow (lit grey in shade reads near black).
 */
const THOR_BELT = { tall: 0.2, out: 1.2, at: -0.8, buckle: 0.36, proud: 0.08, boss: 0.45, studs: 2, stud: 0.06, grey: new Color3(0.55, 0.55, 0.57), dark: new Color3(0.32, 0.33, 0.36), glow: 0.25 };

/** Thor's wide grey belt with a big round buckle (spec at THOR_BELT). */
export function thorBelt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = THOR_BELT;
  const mf = getMaterialFactory();
  const grey = mf.get("cloth", B.grey, { emissive: B.grey.scale(B.glow) });
  const dark = mf.get("cloth", B.dark, { emissive: B.dark.scale(B.glow) });
  const out: Mesh[] = [];
  const { W, H, D, lay } = outerTrunkFrame(scene, body, out);
  const y = -H * 0.36, front = D * 0.56;
  lay(MeshBuilder.CreateBox("thorBelt", { width: W * 1.06, height: H * 0.25, depth: D * 1.12 }, scene), 0, y, 0, dark);
  const plate = MeshBuilder.CreateCylinder("thorBeltBuckle", { height: D * B.proud, diameter: W * 0.48, tessellation: 10 }, scene);
  plate.rotation.x = Math.PI / 2;
  lay(plate, 0, y, front + (D * B.proud) / 2, grey);
  const boss = MeshBuilder.CreateCylinder("thorBeltBoss", { height: D * B.proud, diameter: W * 0.25, tessellation: 8 }, scene);
  boss.rotation.x = Math.PI / 2;
  lay(boss, 0, y, front + D * B.proud, dark);
  for (const side of [-1, 1]) {
    for (let k = 1; k <= B.studs; k++) {
      const a = side * (k === 1 ? 0.65 : 2.5);
      const stud = MeshBuilder.CreateCylinder("thorBeltStud", { height: D * B.proud, diameter: W * 0.07, tessellation: 8 }, scene);
      stud.rotation.x = Math.PI / 2;
      lay(stud, Math.sin(a) * W * 0.18, y + Math.cos(a) * W * 0.18, front + D * B.proud * 1.1, grey);
    }
  }
  return out;
}


/*
 * [S] 472 the Pharaoh's broad collar (audit 468 pharaoh a.3: "broad collar missing at the neck - TABS: a gold collar across the shoulders";
 * legacy.pharaoh.red.png: a flat gold collar round the foot of the neck, spreading over the tops of the shoulders and dipping in a shallow curve onto the
 * top of the chest). PHARAOH_COLLAR: a flat faceted gold plate .sides round, .wide W across (squashed to the trunk's depth, .deep of D), .thick H thick,
 * its top .top of H/2 over the trunk's middle; below its front a gold bib of .bibs stepped slabs, each .bibW W wide and .bibH H tall, .proud D proud of
 * the chest. Self-lit .glow.
 */
const PHARAOH_COLLAR = { sides: 10, wide: 1.12, deep: 1.25, thick: 0.08, top: 0.98, bibs: 2, bibW: 0.62, bibH: 0.07, proud: 0.06, glow: 0.22 };

/** The Pharaoh's flat gold broad collar over the shoulders and the top of the chest (spec at PHARAOH_COLLAR). */
export function pharaohCollar(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = PHARAOH_COLLAR;
  const gold = getMaterialFactory().get("cloth", COATEE_GOLD, { emissive: COATEE_GOLD.scale(C.glow) });
  const out: Mesh[] = [];
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  const y = (H / 2) * C.top - (H * C.thick) / 2;
  const plate = MeshBuilder.CreateCylinder("pharaohCollar", { height: H * C.thick, diameter: W * C.wide, tessellation: C.sides }, scene);
  plate.scaling.z = (D * C.deep) / (W * C.wide);
  lay(plate, 0, y, 0, gold);
  for (let k = 0; k < C.bibs; k++) {
    const w = W * C.bibW * (1 - k * 0.25);
    lay(MeshBuilder.CreateBox("pharaohCollarBib", { width: w, height: H * C.bibH, depth: D * C.proud }, scene), 0, y - H * C.thick / 2 - H * C.bibH * (k + 0.5), D / 2 + (D * C.proud) / 2, gold);
  }
  // [S] 477: small gold false beard from the lower face onto the collar,
  // as in legacy.pharaoh.red.png. A squared tapered pendant, not facial hair.
  const head = body.headMesh;
  const hb = head.getBoundingInfo().boundingBox;
  const beard = MeshBuilder.CreateCylinder("pharaohFalseBeard", {
    height: hb.extendSize.y * 1.05, diameterTop: hb.extendSize.x * 0.55,
    diameterBottom: hb.extendSize.x * 0.42, tessellation: 4,
  }, scene);
  beard.parent = head;
  beard.position.set(hb.center.x, hb.center.y - hb.extendSize.y * 1.05, hb.center.z + hb.extendSize.z * 1.17);
  beard.material = gold;
  beard.convertToFlatShadedMesh();
  out.push(beard);
  return out;
}


/*
 * [S] 472 the Wizard's coat-robe (audit 468 wizard a.4: "body: grey vest block over a short navy skirt - TABS: a long team coat-robe to the knees with a
 * dark belt"; legacy.wizard.red.png: a team coat from the shoulders to the knees, its skirts flaring a little from the waist and parted in front over team
 * trousers, long team sleeves to the wrist, a dark brown belt with a grey buckle round the waist). WIZARD_ROBE: the trunk, yoke, arms and legs in team
 * times .shade; a faceted coat skirt .sides round from .waist of the trunk's foot width at the belt to .flare at the hem, .long of the hip-to-knee drop
 * past the knee, hung from the trunk foot; a dark belt .belt H tall, .beltOut of W and D, with a grey buckle .buckle W wide on its front. Self-lit .glow.
 */
const WIZARD_ROBE = { shade: 0.9, sides: 10, waist: 1.1, flare: 1.45, long: 1.15, belt: 0.12, beltOut: 1.14, buckle: 0.2, leather: new Color3(0.22, 0.12, 0.06), steel: new Color3(0.5, 0.5, 0.52), glow: 0.12 };

/** The Wizard's long team coat-robe to the knees with a dark belt (spec at WIZARD_ROBE). */
export function wizardRobe(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const R = WIZARD_ROBE;
  const mf = getMaterialFactory();
  const t = teamColor.scale(R.shade);
  const coat = mf.get("cloth", t, { emissive: t.scale(R.glow) });
  const leather = mf.get("cloth", R.leather, { emissive: R.leather.scale(R.glow) });
  const steel = mf.get("cloth", R.steel, { emissive: R.steel.scale(0.25) });
  body.torsoMesh.material = coat;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke/.test(m.name) && m instanceof Mesh) m.material = coat;
  for (const limb of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm, body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) limb.material = coat;
  const out: Mesh[] = [];
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  const beltY = -H / 2 + (H * R.belt) / 2;
  lay(MeshBuilder.CreateBox("wizardRobeBelt", { width: W * R.beltOut, height: H * R.belt, depth: D * R.beltOut }, scene), 0, beltY, 0, leather);
  lay(MeshBuilder.CreateBox("wizardRobeBuckle", { width: W * R.buckle, height: H * R.belt * 1.2, depth: D * 0.08 }, scene), 0, beltY, (D * R.beltOut) / 2 + D * 0.03, steel);
  // the skirts: a bell from the trunk foot down past the knee
  const drop = Math.abs(body.leftKnee.position.y) * R.long;
  const top = W * R.waist, hem = W * R.flare;
  const skirt = MeshBuilder.CreateCylinder("wizardRobeSkirt", { height: drop, diameterTop: top, diameterBottom: hem, tessellation: R.sides }, scene);
  skirt.scaling.z = Math.max(0.7, D / W);
  lay(skirt, 0, -H / 2 - drop / 2 + H * R.belt * 0.5, 0, coat);
  return out;
}


/*
 * [S] 473 the Dark Peasant's floating hands (audit 468 dark_peasant b.1: "floating hands missing - TABS: a sphere of dozens of big black hands circling
 * him"; legacy.dark_peasant.red.png, card Appearance: some thirty black gloved hands, each about a head and a half long, spread over a ball round him from
 * his feet to over his head and out to about half his height on each side, fingers splayed, a cuff at each wrist, turned every way). DARK_HANDS in his
 * standing height H: .count hands on a Fibonacci sphere .radius H round a centre .centre H up (squashed .squash in y); each a palm .palm H square, four
 * fingers and a thumb .finger H long, a cuff .cuff H across at the wrist; each turned to face out from the centre and rolled by a golden-angle step.
 * Near-black .color, a little self-lit .glow so the faces still read in shade. Each hand is merged to one mesh.
 */
const DARK_HANDS = { count: 30, radius: 0.62, centre: 0.5, squash: 0.85, palm: 0.1, finger: 0.075, cuff: 0.075, color: new Color3(0.07, 0.06, 0.1), glow: 0.35 };

/** The Dark Peasant's sphere of big black floating hands round him (spec at DARK_HANDS). */
export function darkPeasantHands(scene: Scene, body: ArticulatedBody): Mesh[] {
  const D = DARK_HANDS;
  const black = getMaterialFactory().get("cloth", D.color, { emissive: D.color.scale(D.glow) });
  const H = body.metrics.headTopY - body.metrics.footBottomY;
  const p = H * D.palm, fl = H * D.finger, fw = p / 4.6;
  const out: Mesh[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < D.count; i++) {
    const parts: Mesh[] = [];
    const palm = MeshBuilder.CreateBox("darkHandPalm", { width: p, height: p, depth: p * 0.32 }, scene);
    parts.push(palm);
    for (let k = 0; k < 4; k++) {
      const fin = MeshBuilder.CreateBox("darkHandFinger", { width: fw, height: fl * (k === 1 || k === 2 ? 1 : 0.85), depth: fw }, scene);
      fin.position.set((k - 1.5) * p * 0.26, p / 2 + fl * 0.45, 0);
      fin.rotation.z = (k - 1.5) * -0.12;
      parts.push(fin);
    }
    const thumb = MeshBuilder.CreateBox("darkHandThumb", { width: fw, height: fl * 0.7, depth: fw }, scene);
    thumb.position.set(p * 0.62, p * 0.05, 0);
    thumb.rotation.z = -0.9;
    parts.push(thumb);
    const cuff = MeshBuilder.CreateCylinder("darkHandCuff", { height: p * 0.35, diameter: H * D.cuff, tessellation: 8 }, scene);
    cuff.position.y = -p / 2 - p * 0.15;
    parts.push(cuff);
    const hand = Mesh.MergeMeshes(parts, true);
    if (!hand) continue;
    hand.name = "darkHand";
    // a point on the Fibonacci sphere
    const y = 1 - (2 * (i + 0.5)) / D.count, r = Math.sqrt(1 - y * y), a = i * golden;
    const dir = new Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
    hand.position.set(dir.x * H * D.radius, H * D.centre + dir.y * H * D.radius * D.squash, dir.z * H * D.radius);
    // fingers along the sphere's tangent, the palm facing out
    hand.rotation.set(Math.asin(-dir.y) * 0.8 + Math.PI / 2 * (i % 2), Math.atan2(dir.x, dir.z), a * 1.7);
    hand.parent = body.root;
    hand.material = black;
    hand.convertToFlatShadedMesh();
    out.push(hand);
  }
  return out;
}


/*
 * [S] 474 the Dark Peasant's messy hair (audit 468 dark_peasant a.2: "head: a dark navy pointed hood with a ruff collar - TABS: a bare team head with messy
 * brown hair"; legacy.dark_peasant.red.png: a bare head under a shaggy mid-brown mop, a thick cap over the crown, uneven tufts sticking up and out at odd
 * angles, a ragged fringe across the brow over the eyes' tops and locks over the ears). DARK_PEASANT_HAIR in the head box (half sizes e, centre c, +z the
 * face): a cap .cap e.x across and .thick e.y thick on the crown from .back e.z behind to .brow e.z ahead; .tufts tufts .tuft e.x long leaning out at
 * hashed angles over the crown; a fringe of .fringe flat locks across the brow down to .fringeTo e.y over the centre; a lock over each ear. Brown .color.
 */
const DARK_PEASANT_HAIR = { cap: 1.08, thick: 0.32, back: 1.08, brow: 0.85, tufts: 8, tuft: 0.55, fringe: 4, fringeTo: 0.45, side: 0.25, color: new Color3(0.3, 0.17, 0.08), glow: 0.14 };

/** The Dark Peasant's messy brown mop over a bare head (spec at DARK_PEASANT_HAIR), hung on the head. */
export function darkPeasantHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const H = DARK_PEASANT_HAIR;
  const hair = getMaterialFactory().get("cloth", H.color, { emissive: H.color.scale(H.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, y: number, z: number, rx = 0, rz = 0): Mesh => {
    m.position.set(x, y, z);
    m.rotation.set(rx, 0, rz);
    m.material = hair;
    m.parent = head;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  const top = c.y + e.y;
  const depth = e.z * (H.back + H.brow), zMid = c.z + (e.z * (H.brow - H.back)) / 2;
  put(MeshBuilder.CreateBox("darkPeasantHairCap", { width: e.x * 2 * H.cap, height: e.y * H.thick, depth }, scene), c.x, top + e.y * H.thick * 0.3, zMid);
  for (let k = 0; k < H.tufts; k++) {
    const hx = Math.sin(k * 2.3) , hz = Math.cos(k * 1.7);
    const len = e.x * H.tuft * (0.7 + 0.3 * ((k * 5) % 3));
    put(MeshBuilder.CreateCylinder("darkPeasantHairTuft", { height: len, diameterTop: 0, diameterBottom: e.x * 0.42, tessellation: 4 }, scene),
      c.x + hx * e.x * 0.7, top + e.y * H.thick * 0.5 + len * 0.3, c.z + hz * e.z * 0.7, hz * 0.7, -hx * 0.9);
  }
  for (let k = 0; k < H.fringe; k++) {
    const x = c.x + ((k + 0.5) / H.fringe - 0.5) * e.x * 2 * 0.9;
    const tall = e.y * (1 - H.fringeTo) * (0.8 + 0.25 * (k % 2));
    put(MeshBuilder.CreateCylinder("darkPeasantFringe", { height: tall, diameterTop: e.x * 0.5, diameterBottom: 0, tessellation: 4 }, scene),
      x, top - tall / 2 + e.y * 0.1, c.z + e.z * 1.02, -0.2, (k - 1.5) * 0.15);
  }
  for (const sd of [-1, 1]) {
    put(MeshBuilder.CreateBox("darkPeasantHairSide", { width: e.x * H.side, height: e.y * 0.9, depth: e.z * 1.3 }, scene), c.x + sd * (e.x + (e.x * H.side) / 2), c.y + e.y * 0.45, c.z - e.z * 0.15, 0, sd * 0.12);
  }
  out.push(...darkPeasantJerkin(scene, body));
  return out;
}

/** [S] 479: legacy.dark_peasant.red.png, open grey-brown jerkin over team undershirt,
 * two patchy front panels, four crossed stitches and pointed ragged waist tails. */
function darkPeasantJerkin(scene: Scene, body: ArticulatedBody): Mesh[] {
  const out: Mesh[] = [];
  const mf = getMaterialFactory(), brown = new Color3(0.17, 0.13, 0.1);
  const leather = mf.get("cloth", brown, { emissive: brown.scale(0.15) });
  const stitch = mf.get("cloth", new Color3(0.06, 0.045, 0.03));
  const patch = mf.get("cloth", new Color3(0.38, 0.32, 0.22));
  body.torsoMesh.material = body.skinMaterial;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke$/.test(m.name)) m.material = body.skinMaterial;
  const { W, H, D, lay } = outerTrunkFrame(scene, body, out), front = D / 2 + 0.04;
  for (const side of [-1, 1]) {
    const panel = MeshBuilder.CreateBox("darkJerkinPanel", { width: W * 0.32, height: H * 0.93, depth: 0.045 }, scene);
    panel.rotation.z = side * -0.06;
    lay(panel, side * W * 0.32, 0, front, leather);
    lay(MeshBuilder.CreateBox("darkJerkinSide", { width: W * 0.06, height: H * 0.92, depth: D * 1.1 }, scene), side * W * 0.49, 0, 0, leather);
    const tail = MeshBuilder.CreateCylinder("darkJerkinTail", { height: H * 0.42, diameterTop: W * 0.43, diameterBottom: 0, tessellation: 4 }, scene);
    tail.scaling.z = 0.18;
    lay(tail, side * W * 0.28, -H * 0.62, front, leather);
    lay(MeshBuilder.CreateBox("darkJerkinPatch", { width: W * 0.1, height: H * 0.17, depth: 0.018 }, scene), side * W * 0.34, side * H * 0.19, front + 0.03, patch);
  }
  lay(MeshBuilder.CreateBox("darkJerkinBack", { width: W, height: H * 0.94, depth: 0.04 }, scene), 0, 0, -front, leather);
  for (let k = 0; k < 4; k++) {
    const lace = MeshBuilder.CreateBox("darkJerkinLace", { width: W * 0.36, height: H * 0.018, depth: 0.025 }, scene);
    lace.rotation.z = (k % 2 ? -1 : 1) * 0.4;
    lay(lace, 0, H * (0.26 - k * 0.15), front + 0.035, stitch);
  }
  return out;
}


/*
 * [S] 474 the Super Peasant's tunic (audit 468 super_peasant a.2: "shirt: a grey vest block - TABS: a white peasant tunic to mid-thigh with a laced
 * collar"; legacy.super_peasant.red.png: a loose white tunic from the shoulders to mid-thigh, short sleeves to mid upper arm, its skirt flaring a little
 * below the waist, and at the throat a small slit closed by a brown lace crossed twice). SUPER_TUNIC: the trunk, yoke and pelvis in white .white self-lit
 * .glow (lit white in shade reads grey); a white sleeve .sleeveOut round each upper arm to .sleeveTo; a faceted skirt .sides round from .waist of the
 * trunk's width at its foot to .flare at the hem, .long of the hip-to-knee drop; a dark slit .slit W wide down .slitLong H from the top of the chest front
 * and .laces brown crossed laces over it.
 */
const SUPER_TUNIC = { white: new Color3(0.96, 0.95, 0.91), glow: 0.4, sleeveOut: 1.35, sleeveTo: 0.55, sides: 10, waist: 1.08, flare: 1.32, long: 0.62, slit: 0.06, slitLong: 0.2, laces: 2, lace: new Color3(0.36, 0.2, 0.08) };

/** The Super Peasant's white mid-thigh tunic with a laced collar (spec at SUPER_TUNIC). */
export function superPeasantTunic(scene: Scene, body: ArticulatedBody): Mesh[] {
  const T = SUPER_TUNIC;
  const mf = getMaterialFactory();
  const white = mf.get("cloth", T.white, { emissive: T.white.scale(T.glow) });
  const lace = mf.get("cloth", T.lace, { emissive: T.lace.scale(0.15) });
  body.torsoMesh.material = white;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke/.test(m.name) && m instanceof Mesh) m.material = white;
  for (const m of body.hip.getChildMeshes(true)) if (/_pelvis$/.test(m.name) && m instanceof Mesh) m.material = white;
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "superTunicSleeve", arm, 0, T.sleeveTo, T.sleeveOut, white));
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  const drop = Math.abs(body.leftKnee.position.y) * T.long;
  const skirt = MeshBuilder.CreateCylinder("superTunicSkirt", { height: drop, diameterTop: W * T.waist, diameterBottom: W * T.flare, tessellation: T.sides }, scene);
  skirt.scaling.z = Math.max(0.7, D / W);
  lay(skirt, 0, -H / 2 - drop / 2 + H * 0.06, 0, white);
  const slitH = H * T.slitLong, front = D / 2 + D * 0.02;
  lay(MeshBuilder.CreateBox("superTunicSlit", { width: W * T.slit, height: slitH, depth: D * 0.03 }, scene), 0, H / 2 - slitH / 2, front, lace);
  for (let k = 0; k < T.laces; k++) {
    for (const sd of [-1, 1]) {
      const l = MeshBuilder.CreateBox("superTunicLace", { width: W * T.slit * 3.2, height: H * 0.018, depth: D * 0.03 }, scene);
      l.rotation.z = sd * 0.5;
      lay(l, 0, H / 2 - slitH * (k + 0.6) / (T.laces + 0.4), front + D * 0.01, lace);
    }
  }
  return out;
}


/*
 * [S] 474 the Pharaoh's arm bands (audit 468 pharaoh a.5: "arm cuffs missing: bare team arms - TABS: gold bands at upper arm and wrist";
 * legacy.pharaoh.red.png, legacy.pharaoh.jpg: a broad gold band round each upper arm under the shoulder and a broader gold cuff at each wrist).
 * PHARAOH_BANDS: on each upper arm a gold shell .out round from .armFrom to .armTo of its length; on each forearm a gold shell .out round from .wristFrom
 * to its end. Self-lit .glow.
 */
const PHARAOH_BANDS = { out: 1.45, armFrom: 0.22, armTo: 0.4, wristFrom: 0.68, glow: 0.24 };

/** The Pharaoh's gold armlets and wrist cuffs (spec at PHARAOH_BANDS). */
export function pharaohBands(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = PHARAOH_BANDS;
  const gold = getMaterialFactory().get("cloth", COATEE_GOLD, { emissive: COATEE_GOLD.scale(B.glow) });
  const out: Mesh[] = [];
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "pharaohArmlet", arm, B.armFrom, B.armTo, B.out, gold));
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) out.push(limbShell(scene, "pharaohWristCuff", arm, B.wristFrom, 1.0, B.out, gold));
  return out;
}

/*
 * [S] 466 the Flag Bearer's cuffs (audit 457 a.3: "cuffs, bare forearms - TABS: white-and-gold striped cuffs"; legacy.flag_bearer.red.png: a broad white
 * cuff round each wrist with a gold band at its top and foot). FLAG_CUFFS on each forearm: a white shell BANNER_CUFFS.out round from .from to its end, and
 * gold bands .band of the forearm tall, a little wider, at the cuff's top and foot.
 */
const FLAG_CUFFS = { from: 0.6, band: 0.07, bandOut: 1.6 };

/** The Flag Bearer's white cuffs banded in gold at the wrists (spec at FLAG_CUFFS). */
export function flagCuffs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = FLAG_CUFFS;
  const mf = getMaterialFactory();
  const white = mf.get("cloth", BANNER_COATEE.white, { emissive: BANNER_COATEE.white.scale(BANNER_COATEE.whiteGlow) });
  const gold = mf.get("cloth", COATEE_GOLD, { emissive: COATEE_GOLD.scale(0.2) });
  const out: Mesh[] = [];
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "flagCuff", arm, C.from, 1.0, BANNER_CUFFS.out, white));
    out.push(limbShell(scene, "flagCuffBand", arm, C.from, C.from + C.band, C.bandOut, gold));
    out.push(limbShell(scene, "flagCuffBand", arm, 1.0 - C.band, 1.0, C.bandOut, gold));
  }
  return out;
}

/*
 * [S] 467 the Flag Bearer's boots (audit 457 a.4: "boots, team feet - TABS: white boots with gold tops"; legacy.flag_bearer.blue.png: white boot
 * shafts from below the knee to the sole, a gold band round the top, white feet). FLAG_BOOTS on each shin: a white shell .out round from .from to .to,
 * a gold band .band of the shin tall and .bandOut round at its top; the foot block white.
 */
const FLAG_BOOTS = { from: 0.42, to: 1.04, out: 1.4, band: 0.09, bandOut: 1.62 };

/** The Flag Bearer's white boots with gold tops (spec at FLAG_BOOTS). */
export function flagBoots(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = FLAG_BOOTS;
  const mf = getMaterialFactory();
  const white = mf.get("cloth", BANNER_COATEE.white, { emissive: BANNER_COATEE.white.scale(BANNER_COATEE.whiteGlow) });
  const gold = mf.get("cloth", COATEE_GOLD, { emissive: COATEE_GOLD.scale(0.2) });
  const out: Mesh[] = [];
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "flagBoot", shin, B.from, B.to, B.out, white));
    out.push(limbShell(scene, "flagBootTop", shin, B.from - 0.02, B.from + B.band, B.bandOut, gold));
  }
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) if (foot instanceof Mesh && /_[lr]FootM$/.test(foot.name)) foot.material = white;
  }
  return out;
}

/*
 * [S] 467 the Pike's belt and trousers (audit 457 a.4: "waist, none - TABS: a dark belt over baggy team trousers"; legacy.pike.jpg: a dark brown belt
 * round the foot of the cream vest with a small gold buckle, loose team trousers below it). PIKE_BELT: a belt .tall H high, .out of W and D, its middle
 * .at of H/2 under the trunk's middle, dark .leather; a gold buckle .buckle W wide on its front; baggy team shells .thighOut round each thigh to .thighTo.
 */
const PIKE_BELT = { tall: 0.11, out: 1.14, at: -0.78, buckle: 0.16, thighOut: 1.5, thighTo: 0.85, leather: new Color3(0.2, 0.11, 0.05), glow: 0.12, teamShade: 0.85 };

/** The Pike's dark belt with a gold buckle and baggy team trousers (spec at PIKE_BELT). */
export function pikeBelt(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const P = PIKE_BELT;
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", P.leather, { emissive: P.leather.scale(P.glow) });
  const gold = mf.get("cloth", COATEE_GOLD, { emissive: COATEE_GOLD.scale(0.2) });
  const t = teamColor.scale(P.teamShade);
  const team = mf.get("cloth", t, { emissive: t.scale(0.12) });
  const out: Mesh[] = [];
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  const y = H / 2 * P.at;
  lay(MeshBuilder.CreateBox("pikeBelt", { width: W * P.out, height: H * P.tall, depth: D * P.out }, scene), 0, y, 0, leather);
  lay(MeshBuilder.CreateBox("pikeBeltBuckle", { width: W * P.buckle, height: H * P.tall * 1.2, depth: D * 0.06 }, scene), 0, y, D * P.out / 2 + D * 0.02, gold);
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) out.push(limbShell(scene, "pikeTrousers", thigh, 0, P.thighTo, P.thighOut, team));
  return out;
}

/*
 * [S] 467 the Pike's hair (audit 457 a.3: "hair, hidden or none - TABS: brown hair below the hat brim"; legacy.pike.jpg: brown hair falling from under
 * the brim over the ears and the nape). PIKE_HAIR in the head box (half sizes e, centre c, +z the face): a side lock each side .side e.x thick from
 * .top e.y over the centre to .foot e.y under it, from .back e.z behind to .front e.z ahead; a back sheet the same height. Brown .color, self-lit .glow.
 */
const PIKE_HAIR = { side: 0.22, top: 0.35, foot: 0.7, back: 1.05, front: 0.15, color: new Color3(0.32, 0.16, 0.06), glow: 0.14 };

/** The Pike's brown hair under the hat's brim (spec at PIKE_HAIR), hung on the head. */
export function pikeHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = PIKE_HAIR;
  const hair = getMaterialFactory().get("cloth", P.color, { emissive: P.color.scale(P.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const t = e.x * P.side, tall = e.y * (P.top + P.foot), midY = c.y + e.y * (P.top - P.foot) / 2;
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, z: number): void => {
    m.position.set(x, midY, z);
    m.material = hair;
    m.parent = head;
    m.convertToFlatShadedMesh();
    out.push(m);
  };
  for (const s of [-1, 1]) put(MeshBuilder.CreateBox("pikeHair", { width: t, height: tall, depth: e.z * (P.back + P.front) }, scene), c.x + s * (e.x + t / 2), c.z + e.z * (P.front - P.back) / 2);
  put(MeshBuilder.CreateBox("pikeBackHair", { width: (e.x + t) * 2, height: tall, depth: t }, scene), c.x, c.z - e.z * P.back + t / 2);
  return out;
}

/*
 * [S] 467 the Poacher's knee caps (audit 457 a.4: "knees, bare team legs - TABS: tan knee caps"; legacy.poacher.blue.png, card Appearance "knee caps":
 * a rounded tan leather cap over the front of each knee). POACHER_KNEES: a faceted cap .size of the shin's width across, squashed .flat front to back,
 * .ahead of the shin's half-depth in front of the knee joint, .drop of the shin's length under it. Tan .color, self-lit .glow.
 */
const POACHER_KNEES = { size: 1.5, flat: 0.6, ahead: 1.15, drop: 0.04, color: new Color3(0.82, 0.5, 0.22), glow: 0.16 };

/** The Poacher's tan knee caps (spec at POACHER_KNEES). */
export function poacherKnees(scene: Scene, body: ArticulatedBody): Mesh[] {
  const K = POACHER_KNEES;
  const tan = getMaterialFactory().get("cloth", K.color, { emissive: K.color.scale(K.glow) });
  return [body.leftLowerLeg, body.rightLowerLeg].map((shin) => {
    const bb = shin.getBoundingInfo().boundingBox;
    const wide = bb.extendSize.x * 2 * shin.scaling.x, half = bb.extendSize.z * shin.scaling.z, long = bb.extendSize.y * 2 * shin.scaling.y;
    const cap = MeshBuilder.CreateIcoSphere("poacherKnee", { radius: wide * K.size / 2, subdivisions: 1 }, scene);
    cap.scaling.z = K.flat;
    cap.parent = shin.parent;
    cap.position.set(0, -long * K.drop, half * K.ahead);
    cap.material = tan;
    cap.convertToFlatShadedMesh();
    return cap;
  });
}

/*
 * [S] 467 the Barrel Roller's arm wraps (audit 457 a.5: "arms, bare - TABS: brown arm wraps"; legacy.barrel_roller.red.png, card Appearance "arm wraps":
 * brown cloth bound round each forearm from below the elbow to the wrist). BARREL_WRAPS on each forearm: a brown shell .out round from .from to .to, and
 * .bands darker turns .bandOut round, .band of the forearm tall, spread down it. Brown .color, self-lit .glow.
 */
const BARREL_WRAPS = { from: 0.25, to: 0.96, out: 1.3, bands: 3, band: 0.07, bandOut: 1.42, color: new Color3(0.45, 0.25, 0.11), glow: 0.14 };

/** The Barrel Roller's brown forearm wraps (spec at BARREL_WRAPS). */
export function barrelWraps(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = BARREL_WRAPS;
  const mf = getMaterialFactory();
  const cloth = mf.get("cloth", B.color, { emissive: B.color.scale(B.glow) });
  const darkC = B.color.scale(0.7);
  const dark = mf.get("cloth", darkC, { emissive: darkC.scale(B.glow) });
  const out: Mesh[] = [];
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "barrelWrap", arm, B.from, B.to, B.out, cloth));
    for (let k = 0; k < B.bands; k++) {
      const at = B.from + (B.to - B.from) * (k + 0.5) / B.bands;
      out.push(limbShell(scene, "barrelWrapTurn", arm, at - B.band / 2, at + B.band / 2, B.bandOut, dark));
    }
  }
  return out;
}

/*
 * [S] 468 the Blowdarter's feathered scarf; [S] 469 rebuilt as one solid V (CONFIRM 468 a.2: "TABS: a large tan V over the chest front with white feather
 * drops, the unit's most readable accent from the front; ours shows only a thin tan edge strip"; legacy.blowdarter.red.png, .blue.png: a solid tan
 * triangle from shoulder to shoulder across the collar, its point at mid-chest; six white feather blades hang from its two lower edges and its point,
 * and a white feather stands up beside the neck on each shoulder). BLOWDARTER_SCARF on the trunk: a tan three-sided plate .wide W across the top,
 * .deep H from the collar to the point, .proud D off the front; .feathers white blades .feather H long, .featherWide W across, hung along the lower
 * edges; a white wing .wing H tall on each shoulder at .wingAt W out. Tan .tan, white .white, both self-lit.
 */
const BLOWDARTER_SCARF = { wide: 0.92, deep: 0.5, proud: 0.14, feathers: 7, feather: 0.24, featherWide: 0.11, wing: 0.38, wingAt: 0.34, tan: new Color3(0.85, 0.55, 0.25), white: new Color3(0.95, 0.94, 0.9), glow: 0.22 };

/** The Blowdarter's solid tan V scarf with white feathers hanging and two upright at the shoulders (spec at BLOWDARTER_SCARF). */
export function blowdarterScarf(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = BLOWDARTER_SCARF;
  const mf = getMaterialFactory();
  const tan = mf.get("cloth", B.tan, { emissive: B.tan.scale(B.glow) });
  const white = mf.get("cloth", B.white, { emissive: B.white.scale(0.3) });
  const out: Mesh[] = [];
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  const z = D / 2 + D * B.proud / 2, top = H / 2, half = W * B.wide / 2, tip = top - H * B.deep;
  // a three-sided disc, one corner turned straight down (as BARREL_VEST): the flat top edge at the collar, the point at mid-chest
  const r = (half * 2) / Math.sqrt(3);
  const plate = MeshBuilder.CreateDisc("blowdarterScarf", { radius: r, tessellation: 3, sideOrientation: Mesh.DOUBLESIDE }, scene);
  plate.rotation.z = -Math.PI / 2;
  plate.scaling.x = (H * B.deep) / (1.5 * r);
  lay(plate, 0, top - (r / 2) * plate.scaling.x, z, tan);
  // a thick backing so the plate reads as cloth from the side, not a sheet
  const back = MeshBuilder.CreateDisc("blowdarterScarfBack", { radius: r, tessellation: 3, sideOrientation: Mesh.DOUBLESIDE }, scene);
  back.rotation.z = -Math.PI / 2;
  back.scaling.x = plate.scaling.x;
  lay(back, 0, top - (r / 2) * plate.scaling.x, z - D * B.proud * 0.5, tan);
  for (let k = 0; k < B.feathers; k++) {
    const u = k / (B.feathers - 1) * 2 - 1;
    const x = u * half * 0.82, y = tip + Math.abs(u) * (top - tip) * 0.82 - H * B.feather * 0.42;
    const f = lay(MeshBuilder.CreateCylinder("blowdarterFeather", { height: H * B.feather, diameterTop: W * B.featherWide, diameterBottom: W * B.featherWide * 0.2, tessellation: 4 }, scene), x, y, z + D * 0.05, white);
    f.scaling.z = 0.35;
  }
  for (const s of [-1, 1]) {
    const w = lay(MeshBuilder.CreateCylinder("blowdarterWing", { height: H * B.wing, diameterTop: 0, diameterBottom: W * B.featherWide * 1.3, tessellation: 4 }, scene), s * W * B.wingAt, top + H * B.wing * 0.38, z - D * 0.1, white);
    w.rotation.z += -s * 0.3;
    w.scaling.z = 0.35;
  }
  return out;
}

/*
 * [S] 469 the Blowdarter's shorts (CONFIRM 468 a.1: "TABS: the knee pants are team-coloured with a tan fringed hem"; legacy.blowdarter.red.png, .blue.png:
 * team shorts a shade darker than the skin from the belt to the knee, a tan band round each hem with a fringe of short tan tabs below it, bare team shins).
 * BLOWDARTER_SHORTS: the pelvis and a shell .out round each thigh in team times .shade; a tan band .bandOut round from .bandFrom to the thigh's end; .tabs
 * tan tabs .tab of the thigh long hanging from the band's foot round the leg. Tan .tan self-lit .glow.
 */
const BLOWDARTER_SHORTS = { out: 1.3, shade: 0.8, bandFrom: 0.84, bandOut: 1.5, tabs: 7, tab: 0.16, tan: new Color3(0.85, 0.55, 0.25), glow: 0.22 };

/** The Blowdarter's team knee shorts with a tan fringed hem (spec at BLOWDARTER_SHORTS). */
export function blowdarterShorts(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const P = BLOWDARTER_SHORTS;
  const mf = getMaterialFactory();
  const t = teamColor.scale(P.shade);
  const team = mf.get("cloth", t, { emissive: t.scale(0.12) });
  const tan = mf.get("cloth", P.tan, { emissive: P.tan.scale(P.glow) });
  for (const m of body.hip.getChildMeshes(true)) if (/_pelvis$/.test(m.name) && m instanceof Mesh) m.material = team;
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) {
    out.push(limbShell(scene, "blowdarterShorts", thigh, 0, 1.0, P.out, team));
    const band = limbShell(scene, "blowdarterShortsHem", thigh, P.bandFrom, 1.0, P.bandOut, tan);
    out.push(band);
    const bb = thigh.getBoundingInfo().boundingBox;
    const r = Math.max(bb.extendSize.x * thigh.scaling.x, bb.extendSize.z * thigh.scaling.z) * P.bandOut;
    const long = bb.extendSize.y * 2 * thigh.scaling.y * P.tab;
    const footY = band.position.y - band.getBoundingInfo().boundingBox.extendSize.y;
    for (let k = 0; k < P.tabs; k++) {
      const a = (k / P.tabs) * Math.PI * 2;
      const tab = MeshBuilder.CreateBox("blowdarterFringe", { width: r * 0.45, height: long, depth: r * 0.12 }, scene);
      tab.parent = thigh.parent;
      tab.position.set(Math.sin(a) * r * 0.92, footY - long / 2, Math.cos(a) * r * 0.92 * band.scaling.z);
      tab.rotation.y = a;
      tab.material = tan;
      tab.convertToFlatShadedMesh();
      out.push(tab);
    }
  }
  return out;
}

/*
 * [S] 468 the Barrel Roller's hair (audit 457 a.3: "hair, none - TABS: white hair"; legacy.barrel_roller.red.png: white hair puffing out under the
 * tricorn's brim over the ears and at the nape). BARREL_HAIR in the head box (as PIKE_HAIR): a side lock each side .side e.x thick from .top e.y over
 * the centre to .foot e.y under it, .back to .front e.z; a back sheet the same height. White .color, self-lit .glow.
 */
const BARREL_HAIR = { side: 0.26, top: 0.3, foot: 0.55, back: 1.05, front: 0.1, color: new Color3(0.93, 0.93, 0.9), glow: 0.28 };

/** The Barrel Roller's white hair under the tricorn (spec at BARREL_HAIR), hung on the head. */
export function barrelHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = BARREL_HAIR;
  const hair = getMaterialFactory().get("cloth", P.color, { emissive: P.color.scale(P.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const t = e.x * P.side, tall = e.y * (P.top + P.foot), midY = c.y + e.y * (P.top - P.foot) / 2;
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, z: number): void => {
    m.position.set(x, midY, z);
    m.material = hair;
    m.parent = head;
    m.convertToFlatShadedMesh();
    out.push(m);
  };
  for (const s of [-1, 1]) put(MeshBuilder.CreateBox("barrelHair", { width: t, height: tall, depth: e.z * (P.back + P.front) }, scene), c.x + s * (e.x + t / 2), c.z + e.z * (P.front - P.back) / 2);
  put(MeshBuilder.CreateBox("barrelBackHair", { width: (e.x + t) * 2, height: tall, depth: t }, scene), c.x, c.z - e.z * P.back + t / 2);
  return out;
}

/*
 * [S] 468 the Barrel Roller's legs (audit 457 a.6: "legs, team legs to blocky feet - TABS: baggy team pants, cream socks, tan shoes";
 * legacy.barrel_roller.blue.png: loose team pants to below the knee, cream socks to the ankle, tan shoes). BARREL_LEGS: a team shell .pantOut round each
 * thigh and on down the shin to .pantTo; a cream sock shell .sockOut round the shin from .pantTo to its end; the foot blocks tan.
 */
const BARREL_LEGS = { pantOut: 1.45, shinPantOut: 1.4, pantTo: 0.8, sockOut: 1.2, cream: new Color3(0.95, 0.9, 0.75), tan: new Color3(0.7, 0.42, 0.18), glow: 0.1, shade: 0.85 };

/** The Barrel Roller's baggy team pants, cream socks and tan shoes (spec at BARREL_LEGS). */
export function barrelLegs(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const L = BARREL_LEGS;
  const mf = getMaterialFactory();
  const t = teamColor.scale(L.shade);
  const team = mf.get("cloth", t, { emissive: t.scale(0.12) });
  const cream = mf.get("cloth", L.cream, { emissive: L.cream.scale(L.glow) });
  const tan = mf.get("cloth", L.tan, { emissive: L.tan.scale(0.16) });
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) out.push(limbShell(scene, "barrelPants", thigh, 0, 1.0, L.pantOut, team));
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "barrelPants", shin, 0, L.pantTo, L.shinPantOut, team));
    out.push(limbShell(scene, "barrelSock", shin, L.pantTo, 1.0, L.sockOut, cream));
  }
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) if (foot instanceof Mesh && /_[lr]FootM$/.test(foot.name)) foot.material = tan;
  }
  return out;
}

/*
 * [S] 468 the Super Peasant's bracelets (audit 468 b.1: "bracelets missing on both wrists - TABS: thick glowing gold cuffs at each wrist";
 * legacy.super_peasant.red.png, legacy.super_peasant.jpg: a fat gold cuff round each wrist, lit from within). SUPER_CUFFS: a gold shell .out round each
 * forearm from .from to its end, with a brighter rim band .rim long and .rimOut round at each edge. Gold .gold self-lit .glow.
 */
const SUPER_CUFFS = { from: 0.62, out: 1.75, rim: 0.08, rimOut: 1.95, gold: new Color3(1, 0.78, 0.2), glow: 0.75, rimGlow: 1.0 };

/** The Super Peasant's glowing gold wrist cuffs (spec at SUPER_CUFFS). */
export function superPeasantCuffs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = SUPER_CUFFS;
  const mf = getMaterialFactory();
  const gold = mf.get("cloth", C.gold, { emissive: C.gold.scale(C.glow) });
  const rim = mf.get("cloth", C.gold, { emissive: C.gold.scale(C.rimGlow) });
  const out: Mesh[] = [];
  for (const arm of [body.leftLowerArm, body.rightLowerArm]) {
    out.push(limbShell(scene, "superCuff", arm, C.from, 1.0, C.out, gold));
    out.push(limbShell(scene, "superCuffRim", arm, C.from, C.from + C.rim, C.rimOut, rim));
    out.push(limbShell(scene, "superCuffRim", arm, 1.0 - C.rim, 1.0, C.rimOut, rim));
  }
  return out;
}

/*
 * [S] 468 the Wizard's beard (audit 468 a.2: "beard missing: bare chin - TABS: a long grey beard to mid-chest"; legacy.wizard.red.png, card Appearance:
 * a long grey beard from the cheeks to the middle of the chest, a moustache over it). WIZARD_BEARD on the head box: a faceted grey wedge .wide e.x across at
 * the cheeks narrowing to .tip at its end, .long head-heights long from .from e.y under the centre, .proud e.z off the face and .thick e.z deep; a moustache
 * bar .mous e.x across under the eyes. Grey .grey self-lit .glow.
 */
const WIZARD_BEARD = { wide: 1.9, tip: 0.4, long: 2.4, from: 0.1, proud: 1.35, thick: 1.0, mous: 1.3, grey: new Color3(0.78, 0.78, 0.8), glow: 0.3 };

/** The Wizard's long grey beard and moustache (spec at WIZARD_BEARD), hung on the head. */
export function wizardBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = WIZARD_BEARD;
  const grey = getMaterialFactory().get("cloth", B.grey, { emissive: B.grey.scale(B.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const long = e.y * 2 * B.long;
  const out: Mesh[] = [];
  const beard = MeshBuilder.CreateCylinder("wizardBeard", { height: long, diameterTop: e.x * B.wide, diameterBottom: e.x * B.tip, tessellation: 6 }, scene);
  beard.scaling.z = (e.z * B.thick) / (e.x * B.wide);
  beard.position.set(c.x, c.y - e.y * B.from - long / 2, c.z + e.z * B.proud);
  const mous = MeshBuilder.CreateBox("wizardMoustache", { width: e.x * B.mous, height: e.y * 0.18, depth: e.z * 0.3 }, scene);
  mous.position.set(c.x, c.y - e.y * 0.2, c.z + e.z * 1.02);
  for (const m of [beard, mous]) {
    m.material = grey;
    m.parent = head;
    m.convertToFlatShadedMesh();
    out.push(m);
  }
  return out;
}

/*
 * [S] 469 the Pharaoh's modius (audit 468 pharaoh a.1: "headgear: a wide flat yellow box with blue stripes and side lappets - TABS: a tall narrow
 * team-coloured modius cylinder with gold bands, about twice the head's height"; legacy.pharaoh.red.png: a team cylinder about as wide as the head,
 * a little wider at its top, standing near two heads over the brow; a gold rim round its top; low down a gold band, a white band and a gold band
 * stacked over the brow). MODIUS, in the head's W and H: the body .wide W across at the seat, .flare of that at its top, .tall H over the seat;
 * .sides facets; a gold rim .rim H at the top; the base bands .band H each from .bandsAt H up the body, gold, white, gold. Team times .shade.
 */
const MODIUS = { sides: 10, wide: 1.0, flare: 1.14, tall: 1.75, rim: 0.07, band: 0.07, bandsAt: 0.12, proud: 1.04, shade: 0.9, glow: 0.12 };
const MODIUS_GOLD = new Color3(0.95, 0.66, 0.16);

/*
 * [S] 474 the Wizard's floppy hat (audit 468 wizard a.1: "hat: a tall rigid navy cone over a wide flat brim with a pale band - TABS: a shorter floppy
 * team hat with a bent tip and a drooping brim"; legacy.wizard.red.png: a team felt hat a little taller than the head, its crown a wide cone whose upper
 * half bends over to one side and its tip hangs down, on a brim that droops all round from the crown's foot like a soft bell). WIZARD_HAT in the head's
 * width W and height H: a crown frustum .crown H tall from .foot W across to .neck W; over it a second frustum .upper H tall bent .bend rad over, then a
 * tip cone .tip H long bent .tipBend more; the brim a shallow downward bell from .brimTop W across at the crown's foot to .brim W, .droop H deep. Team
 * felt times .shade, self-lit .glow.
 */
const WIZARD_HAT = { crown: 0.62, foot: 1.12, neck: 0.62, upper: 0.5, bend: 0.65, tip: 0.42, tipBend: 0.8, brimTop: 1.15, brim: 2.0, droop: 0.32, sides: 9, shade: 0.9, glow: 0.12 };

/** The Wizard's floppy team hat with a bent tip and a drooping brim (spec at WIZARD_HAT), in the hat's units; `seat` under the head top. */
export function buildWizardHat(scene: Scene, W: number, H: number, seat: number, unit: number, teamColor?: Color3): Mesh {
  const Z = WIZARD_HAT;
  const u = (v: number) => v / unit;
  const t = (teamColor ?? new Color3(0.5, 0.5, 0.55)).scale(Z.shade);
  const felt = getMaterialFactory().get("cloth", t, { emissive: t.scale(Z.glow) });
  const part = (m: Mesh, parent: TransformNode | null, y: number): Mesh => {
    m.position.y = y;
    if (parent) m.parent = parent;
    m.material = felt;
    m.convertToFlatShadedMesh();
    return m;
  };
  const crownH = Z.crown * H;
  const crown = part(MeshBuilder.CreateCylinder("wizardHat", { height: u(crownH), diameterBottom: u(Z.foot * W), diameterTop: u(Z.neck * W), tessellation: Z.sides }, scene), null, u(seat + crownH / 2));
  const knee = new TransformNode("wizardHatBend", scene);
  knee.parent = crown;
  knee.position.y = u(crownH / 2);
  knee.rotation.z = -Z.bend;
  const upperH = Z.upper * H;
  const upper = part(MeshBuilder.CreateCylinder("wizardHatUpper", { height: u(upperH), diameterBottom: u(Z.neck * W), diameterTop: u(Z.neck * W * 0.45), tessellation: Z.sides }, scene), knee, u(upperH / 2));
  const ankle = new TransformNode("wizardHatTipBend", scene);
  ankle.parent = upper;
  ankle.position.y = u(upperH / 2);
  ankle.rotation.z = -Z.tipBend;
  const tipH = Z.tip * H;
  part(MeshBuilder.CreateCylinder("wizardHatTip", { height: u(tipH), diameterBottom: u(Z.neck * W * 0.45), diameterTop: 0, tessellation: Z.sides }, scene), ankle, u(tipH / 2));
  const droop = Z.droop * H;
  part(MeshBuilder.CreateCylinder("wizardHatBrim", { height: u(droop), diameterTop: u(Z.brimTop * W), diameterBottom: u(Z.brim * W), tessellation: Z.sides * 2 }, scene), crown, u(-crownH / 2 - droop / 2 + droop * 0.25));
  return crown;
}

/** The Pharaoh's tall team modius with gold and white bands (spec at MODIUS), in the hat's units; `seat` under the head top. Returns the body. */
export function buildModius(scene: Scene, W: number, H: number, seat: number, unit: number, teamColor?: Color3): Mesh {
  const M = MODIUS;
  const u = (v: number) => v / unit;
  const mf = getMaterialFactory();
  const t = (teamColor ?? new Color3(0.5, 0.5, 0.55)).scale(M.shade);
  const felt = mf.get("cloth", t, { emissive: t.scale(M.glow) });
  const gold = mf.get("cloth", MODIUS_GOLD, { emissive: MODIUS_GOLD.scale(0.2) });
  const white = mf.get("cloth", new Color3(0.95, 0.94, 0.9), { emissive: new Color3(0.25, 0.25, 0.24) });
  const tall = -seat + M.tall * H;
  const lo = M.wide * W, hi = lo * M.flare;
  const body = MeshBuilder.CreateCylinder("modius", { height: u(tall), diameterBottom: u(lo), diameterTop: u(hi), tessellation: M.sides }, scene);
  body.position.y = u(seat + tall / 2);
  body.material = felt;
  body.convertToFlatShadedMesh();
  const ring = (name: string, y: number, h: number, mat: Material): void => {
    // the body's width at that height (from its foot), a little proud of it
    const at = (y + tall / 2) / tall, d = (lo + (hi - lo) * at) * M.proud;
    const m = MeshBuilder.CreateCylinder(name, { height: u(h), diameter: u(d), tessellation: M.sides }, scene);
    m.position.y = u(y);
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.parent = body;
  };
  ring("modiusRim", tall / 2 - (M.rim * H) / 2, M.rim * H, gold);
  const b = M.band * H, foot = -tall / 2 + M.bandsAt * H;
  ring("modiusBand", foot + b / 2, b, gold);
  ring("modiusBand", foot + b * 1.5, b, white);
  ring("modiusBand", foot + b * 2.5, b, gold);
  return body;
}

/*
 * [S] 469 Thor's winged headband (audit 468 thor a.1: "headgear: a dark dome helmet with two grey horns - TABS: a metal headband with two upswept white
 * wings"; legacy.thor.red.png: no helmet; a thin grey metal band round the head over the brow, and on each side above the ear a white wing of a few
 * long feathers sweeping up and back, standing near a head over the crown). WINGED_BAND, in the head's W and H: the band .wide W across, .band H tall
 * at the seat; each wing .feathers white blades, the first .feather H long and each next .shorter of it, .blade W across, rooted at the band's side
 * .rootUp H above its foot, leant .out rad outward and .back rad back, fanned .fan rad apart toward the back. Grey .iron, white .white, self-lit.
 */
const WINGED_BAND = { wide: 1.08, band: 0.13, feathers: 4, feather: 0.95, shorter: 0.78, blade: 0.42, rootUp: 0.1, out: 0.22, back: 0.42, fan: 0.32, iron: new Color3(0.62, 0.62, 0.66), white: new Color3(0.96, 0.95, 0.92), glow: 0.3 };

/** Thor's grey headband with two upswept white wings (spec at WINGED_BAND), in the hat's units; `seat` under the head top. Returns the band. */
export function buildWingedBand(scene: Scene, W: number, H: number, seat: number, unit: number): Mesh {
  const B = WINGED_BAND;
  const u = (v: number) => v / unit;
  const mf = getMaterialFactory();
  const iron = mf.get("cloth", B.iron, { emissive: B.iron.scale(0.15) });
  const white = mf.get("cloth", B.white, { emissive: B.white.scale(B.glow) });
  const bandH = B.band * H;
  const band = MeshBuilder.CreateCylinder("wingedBand", { height: u(bandH), diameter: u(B.wide * W), tessellation: 12 }, scene);
  band.position.y = u(seat + bandH / 2);
  band.material = iron;
  band.convertToFlatShadedMesh();
  for (const s of [-1, 1]) {
    for (let k = 0; k < B.feathers; k++) {
      // [S] 477: long layered vanes with a raised root, rather than a tuft
      // of cones at the ear. Reference wings extend a head above the crown.
      const long = H * (1.65 - k * 0.23);
      const lean = 0.22 + k * 0.22;
      const dir = new Vector3(s * 0.2, Math.cos(lean), -Math.sin(lean));
      const root = new Vector3(s * W * 0.57, H * (0.22 + k * 0.04), -k * W * 0.08);
      const f = MeshBuilder.CreateCylinder("wingFeather", { height: u(long), diameterTop: 0, diameterBottom: u(W * 0.28), tessellation: 4 }, scene);
      f.scaling.x = 0.32;
      f.position.set(u(root.x + dir.x * long / 2), u(root.y + dir.y * long / 2), u(root.z + dir.z * long / 2));
      f.rotation.set(-lean, 0, -s * 0.2);
      f.material = white;
      f.convertToFlatShadedMesh();
      f.parent = band;
      const covert = MeshBuilder.CreateSphere("wingCovert", { diameterX: u(W * 0.16), diameterY: u(H * 0.5), diameterZ: u(W * 0.35), segments: 4 }, scene);
      covert.parent = band;
      covert.position.set(u(root.x), u(root.y), u(root.z));
      covert.material = white;
      covert.convertToFlatShadedMesh();
    }
  }
  return band;
}

/*
 * [R] 478 Pharaoh torso dress, specified from legacy.pharaoh.red.png and .blue.png and CONFIRM 475/477:
 * Preserve the slim long-legged build, modius, chin beard, collar, armlets and short pleated kilt (475 list).
 * Two touching gold chest courses span about a fifth of the shoulder-to-waist height below the armpits;
 * a separate broad gold waistband sits immediately above the kilt, with team cloth exposed between (477 list).
 * Replace the buried box bands with closed tapered shells fitted to the OUTER trunk hull, including the yoke
 * and chest swell. Each course samples both boundaries independently, then stands 0.025 body units proud.
 * Four broad faces follow the body's planar sides; the lower waist lip flares slightly over the kilt top.
 */
const PHARAOH_GARB = { shade: 0.85, proud: 0.025, chest: 0.22, chestAt: 0.12, waist: 0.23, flare: 1.08, gold: new Color3(0.95, 0.66, 0.16), glow: 0.2 };

/** The Pharaoh's team garb banded in gold at the chest and waist (spec at PHARAOH_GARB). */
export function pharaohGarb(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const G = PHARAOH_GARB;
  const mf = getMaterialFactory();
  const t = teamColor.scale(G.shade);
  const cloth = mf.get("cloth", t, { emissive: t.scale(0.12) });
  const gold = mf.get("cloth", G.gold, { emissive: G.gold.scale(G.glow) });
  body.torsoMesh.material = cloth;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke/.test(m.name) && m instanceof Mesh) m.material = cloth;
  for (const m of body.hip.getChildMeshes(true)) if (/_pelvis$/.test(m.name) && m instanceof Mesh) m.material = cloth;
  const out: Mesh[] = [];
  const { H } = trunkFrame(scene, body, out);
  body.torso.computeWorldMatrix(true);
  const inverse = body.torso.getWorldMatrix().clone().invert();
  const hull = [body.torsoMesh, ...body.torso.getChildMeshes(true).filter(m => /_yoke$/.test(m.name)),
    ...body.hip.getChildMeshes(true).filter(m => /_pelvis$/.test(m.name))];
  const triangles: Vector3[][] = [];
  for (const mesh of hull) {
    mesh.computeWorldMatrix(true);
    const positions = mesh.getVerticesData("position")!, indices = mesh.getIndices()!;
    const transform = mesh.getWorldMatrix().multiply(inverse);
    const points: Vector3[] = [];
    for (let i = 0; i < positions.length; i += 3) points.push(Vector3.TransformCoordinates(Vector3.FromArray(positions, i), transform));
    for (let i = 0; i < indices.length; i += 3) triangles.push([points[indices[i]], points[indices[i + 1]], points[indices[i + 2]]]);
  }
  // Slice the actual hull rather than the smaller torsoMesh bounding box: the yoke owns its outer surface.
  const section = (y: number): { x: number; z: number } => {
    let x = 0, z = 0;
    for (const triangle of triangles) for (let i = 0; i < 3; i++) {
      const a = triangle[i], b = triangle[(i + 1) % 3];
      if (y < Math.min(a.y, b.y) || y > Math.max(a.y, b.y)) continue;
      const t = Math.abs(b.y - a.y) < 1e-6 ? 0 : (y - a.y) / (b.y - a.y);
      const p = Vector3.Lerp(a, b, t);
      x = Math.max(x, Math.abs(p.x)); z = Math.max(z, Math.abs(p.z));
    }
    return { x: x + G.proud, z: z + G.proud };
  };
  const ring = (name: string, y0: number, y1: number, flare = 1): void => {
    const bottom = section(y0), top = section(y1);
    const band = MeshBuilder.CreateBox(name, { size: 1 }, scene);
    const positions = band.getVerticesData("position")!;
    for (let i = 0; i < positions.length; i += 3) {
      const upper = positions[i + 1] > 0, edge = upper ? top : bottom;
      positions[i] = Math.sign(positions[i]) * edge.x * (upper ? 1 : flare);
      positions[i + 1] = upper ? y1 : y0;
      positions[i + 2] = Math.sign(positions[i + 2]) * edge.z * (upper ? 1 : flare);
    }
    band.setVerticesData("position", positions);
    band.refreshBoundingInfo();
    band.parent = body.torso;
    band.material = gold;
    band.convertToFlatShadedMesh();
    out.push(band);
  };
  const chestY = body.torsoMesh.position.y + H * G.chestAt;
  const chestBottom = chestY - H * G.chest / 2;
  ring("pharaohChestBandLower", chestBottom, chestY);
  ring("pharaohChestBandUpper", chestY, chestY + H * G.chest / 2);
  ring("pharaohWaistBand", 0, H * G.waist, G.flare);
  return out;
}

/*
 * [S] 470 the Super Boxer's hair (audit 468 super_boxer a.3: "hair missing: bare team head - TABS: tall golden super-saiyan spikes over a headband";
 * legacy.super_boxer.red.png: a pale gold mop of a dozen long spikes standing near straight up off the crown, the tallest about a head high, fanning a
 * little outward at the sides; a team headband round the brow under them). SUPER_BOXER_HAIR on the head box (half sizes e, centre c, +z the face): a
 * gold cap .cap e.y thick on the crown, .capOut e across; .spikes spikes rooted on the crown in rows, each .spike to .spikeMax e.y*2 tall and .base e.x
 * across at its foot, leant .fan rad out from the middle and .back rad back; a team band .band e.y tall round the brow, .bandOut e across. Gold .gold.
 */
const SUPER_BOXER_HAIR = { cap: 0.32, capOut: 1.08, spikes: 12, spike: 0.55, spikeMax: 1.0, base: 0.5, fan: 0.35, back: 0.18, band: 0.22, bandOut: 1.08, bandAt: 0.42, gold: new Color3(1, 0.88, 0.5), glow: 0.35 };

/** The Super Boxer's tall pale-gold spiked hair over a team headband (spec at SUPER_BOXER_HAIR), hung on the head. */
export function superBoxerHair(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const P = SUPER_BOXER_HAIR;
  const mf = getMaterialFactory();
  const gold = mf.get("cloth", P.gold, { emissive: P.gold.scale(P.glow) });
  const team = mf.get("cloth", teamColor, { emissive: teamColor.scale(0.15) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const out: Mesh[] = [];
  const put = (m: Mesh, mat: Material, x: number, y: number, z: number): Mesh => {
    m.position.set(x, y, z);
    m.material = mat;
    m.parent = head;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  const topY = c.y + e.y;
  put(MeshBuilder.CreateBox("superBoxerCap", { width: e.x * 2 * P.capOut, height: e.y * P.cap, depth: e.z * 2 * P.capOut }, scene), gold, c.x, topY - e.y * P.cap * 0.3, c.z - e.z * 0.05);
  put(MeshBuilder.CreateBox("superBoxerBand", { width: e.x * 2 * P.bandOut, height: e.y * P.band, depth: e.z * 2 * P.bandOut }, scene), team, c.x, c.y + e.y * P.bandAt, c.z);
  // rows of spikes across the crown, front to back; the middle ones the tallest
  const cols = 4, rows = Math.ceil(P.spikes / cols);
  for (let i = 0; i < P.spikes; i++) {
    const u = (i % cols) / (cols - 1) * 2 - 1, v = Math.floor(i / cols) / Math.max(1, rows - 1) * 2 - 1;
    const tall = e.y * 2 * (P.spikeMax - (P.spikeMax - P.spike) * (Math.abs(u) * 0.7 + ((i * 7) % 5) / 10));
    const lean = u * P.fan, back = P.back - v * 0.1;
    const x = c.x + u * e.x * 0.75, z = c.z - v * e.z * 0.6 - e.z * 0.1;
    const s = put(MeshBuilder.CreateCylinder("superBoxerSpike", { height: tall, diameterTop: 0, diameterBottom: e.x * P.base, tessellation: 4 }, scene), gold,
      x + Math.sin(lean) * tall / 2, topY + Math.cos(lean) * tall / 2 - e.y * 0.05, z - Math.sin(back) * tall / 2);
    s.rotation.set(-back, 0, -lean);
  }
  return out;
}

/*
 * [S] 470 Thor's hair (audit 468 thor a.2: "hair missing: bare head under the helmet - TABS: shoulder-length blond hair"; legacy.thor.red.png: straw-blond
 * hair from under the headband over the crown, falling at both sides past the jaw to the shoulders and down the back of the neck, the face clear).
 * THOR_HAIR on the head box (half sizes e, centre c, +z the face): a crown cap .cap e.y thick, .capOut e across; a lock each side .side e.x thick from
 * .top e.y over the centre to .foot e.y under it, .back to .front e.z, flared .flare rad; a back sheet the same height. Blond .color, self-lit .glow.
 */
const THOR_HAIR = { cap: 0.28, capOut: 1.1, side: 0.32, top: 0.9, foot: 1.7, back: 1.1, front: 0.45, flare: 0.12, color: new Color3(0.93, 0.78, 0.42), glow: 0.25 };

/** Thor's blond shoulder-length hair under the band (spec at THOR_HAIR), hung on the head. */
export function thorHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = THOR_HAIR;
  const hair = getMaterialFactory().get("cloth", P.color, { emissive: P.color.scale(P.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const out: Mesh[] = [];
  const put = (m: Mesh, x: number, y: number, z: number): Mesh => {
    m.position.set(x, y, z);
    m.material = hair;
    m.parent = head;
    m.convertToFlatShadedMesh();
    out.push(m);
    return m;
  };
  put(MeshBuilder.CreateBox("thorHairCap", { width: e.x * 2 * P.capOut, height: e.y * P.cap, depth: e.z * 2 * P.capOut }, scene), c.x, c.y + e.y * (1 + P.cap / 2) - e.y * 0.1, c.z - e.z * 0.08);
  const t = e.x * P.side, tall = e.y * (P.top + P.foot), midY = c.y + e.y * (P.top - P.foot) / 2;
  for (const s of [-1, 1]) {
    const lock = put(MeshBuilder.CreateBox("thorHair", { width: t, height: tall, depth: e.z * (P.back + P.front) }, scene), c.x + s * (e.x + t / 2), midY, c.z + e.z * (P.front - P.back) / 2);
    lock.rotation.z = s * P.flare;
  }
  put(MeshBuilder.CreateBox("thorBackHair", { width: (e.x + t) * 2, height: tall, depth: t }, scene), c.x, midY, c.z - e.z * P.back + t / 2);
  // [S] 477: blond pointed beard over the lower face, chin and upper chest.
  // The render has a broad jaw wedge, two cheek locks and a single low point.
  const beard = put(MeshBuilder.CreateCylinder("thorBeard", {
    height: e.y * 2.0, diameterTop: e.x * 1.8, diameterBottom: 0,
    tessellation: 5,
  }, scene), c.x, c.y - e.y * 1.25, c.z + e.z * 1.12);
  beard.scaling.z = 0.42;
  for (const s of [-1, 1]) {
    const cheek = put(MeshBuilder.CreateCylinder("thorBeardCheek", {
      height: e.y * 1.12, diameterTop: e.x * 0.7, diameterBottom: e.x * 0.35,
      tessellation: 4,
    }, scene), c.x + s * e.x * 0.65, c.y - e.y * 0.8, c.z + e.z * 1.08);
    cheek.rotation.z = s * 0.22;
    cheek.scaling.z = 0.55;
  }
  return out;
}

/*
 * [S] 471 the Super Boxer's shorts (audit 468 super_boxer a.4: "shorts: navy legs to the knee - TABS: white boxing shorts under a gold waistband";
 * legacy.super_boxer.red.png: loose white shorts from the waist to above the knee, a team stripe down each side, under a broad banded gold waistband).
 * SUPER_BOXER_SHORTS: the pelvis white; a white shell .out round each thigh to .to of it; a team stripe .stripe W wide down the outer side of each;
 * the waistband as BOXER_SHORTS' (.band of the trunk, .stripes gold bands alternating deep and bright). White .white self-lit .glow.
 */
const SUPER_BOXER_SHORTS = { out: 1.7, to: 0.72, stripe: 0.12, white: new Color3(0.96, 0.95, 0.92), glow: 0.3, band: 0.22, bandOut: 1.1, stripes: 4, step: 0.03 };

/** The Super Boxer's white shorts with team side stripes under a gold waistband (spec at SUPER_BOXER_SHORTS). */
export function superBoxerShorts(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = SUPER_BOXER_SHORTS;
  const mf = getMaterialFactory();
  const white = mf.get("cloth", S.white, { emissive: S.white.scale(S.glow) });
  const team = mf.get("cloth", teamColor, { emissive: teamColor.scale(0.15) });
  const gold = mf.get("cloth", COATEE_GOLD, { emissive: COATEE_GOLD.scale(0.2) });
  const deep = COATEE_GOLD.scale(0.7);
  const gold2 = mf.get("cloth", deep, { emissive: deep.scale(0.2) });
  for (const m of body.hip.getChildMeshes(true)) if (/_pelvis$/.test(m.name) && m instanceof Mesh) m.material = white;
  const out: Mesh[] = [];
  for (const [thigh, side] of [[body.leftUpperLeg, 1], [body.rightUpperLeg, -1]] as const) {
    const shell = limbShell(scene, "superBoxerShorts", thigh, 0, S.to, S.out, white);
    out.push(shell);
    // a team stripe down the outer side: a thin box on the shell's outer face
    const bb = shell.getBoundingInfo().boundingBox;
    const stripe = MeshBuilder.CreateBox("superBoxerStripe", { width: bb.extendSize.x * 0.25, height: bb.extendSize.y * 1.9, depth: bb.extendSize.z * 2 * S.stripe }, scene);
    stripe.parent = shell;
    stripe.position.set(bb.center.x + side * bb.extendSize.x * 0.95, bb.center.y, bb.center.z);
    stripe.material = team;
    stripe.convertToFlatShadedMesh();
    out.push(stripe);
  }
  const { W, H, D, lay } = trunkFrame(scene, body, out);
  const each = H * S.band / S.stripes;
  for (let k = 0; k < S.stripes; k++) {
    const grow = 1 + (k % 2 ? 0 : S.step);
    lay(MeshBuilder.CreateBox("superBoxerWaistband", { width: W * S.bandOut * grow, height: each, depth: D * S.bandOut * grow }, scene), 0, -H / 2 + each * (k + 0.5), 0, k % 2 ? gold2 : gold);
  }
  return out;
}

/*
 * [S] 471 the Pharaoh's kilt (audit 468 pharaoh a.4: "lower body: dark navy trousers to the boots - TABS: a flared team kilt to mid-thigh over bare team
 * legs"; legacy.pharaoh.red.png: a team skirt from the gold waist band flaring out to a wide hem at mid-thigh, its faces in two shades like pleats, the legs
 * below it bare team skin). PHARAOH_KILT: the legs (thighs and shins) in the body's skin; a faceted bell .sides round from the pelvis's top, .waist of its
 * width at the top and .flare at the hem, .long of the hip-to-knee drop long, in team times .shade; .pleats darker strips .pleatWide of the hem's side
 * round its foot. Self-lit .glow.
 */
const PHARAOH_KILT = { sides: 10, waist: 1.15, flare: 1.9, long: 0.62, shade: 0.9, pleatShade: 0.72, pleats: 10, pleatWide: 0.35, glow: 0.12 };

/** The Pharaoh's flared team kilt to mid-thigh over bare legs (spec at PHARAOH_KILT). */
export function pharaohKilt(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const K = PHARAOH_KILT;
  const mf = getMaterialFactory();
  const t = teamColor.scale(K.shade), d = teamColor.scale(K.pleatShade);
  const cloth = mf.get("cloth", t, { emissive: t.scale(K.glow) });
  const dark = mf.get("cloth", d, { emissive: d.scale(K.glow) });
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) leg.material = body.skinMaterial;
  const pelvis = body.allMeshes.find((m) => /_pelvis$/.test(m.name));
  if (!pelvis) return [];
  const size = pelvis.getBoundingInfo().boundingBox.extendSize;
  const drop = Math.abs(body.leftKnee.position.y) * K.long;
  const top = size.x * 2 * K.waist, hem = size.x * 2 * K.flare;
  const kilt = MeshBuilder.CreateCylinder("pharaohKilt", { height: drop, diameterTop: top, diameterBottom: hem, tessellation: K.sides }, scene);
  kilt.convertToFlatShadedMesh();
  kilt.scaling.z = Math.max(0.75, (size.z / size.x) * 1.3);
  kilt.position.y = pelvis.position.y + size.y - drop / 2;
  kilt.parent = body.hip;
  kilt.material = cloth;
  const out: Mesh[] = [kilt];
  // pleats: darker strips on every other face of the bell, leaning out with it
  const lean = Math.atan2((hem - top) / 2, drop);
  for (let k = 0; k < K.pleats; k += 2) {
    const a = ((k + 0.5) / K.sides) * Math.PI * 2;
    const r = (top + hem) / 4 * 1.01;
    const strip = MeshBuilder.CreateBox("pharaohKiltPleat", { width: (Math.PI * (top + hem) / 2 / K.sides) * K.pleatWide * 2, height: drop / Math.cos(lean), depth: 0.01 }, scene);
    strip.parent = kilt;
    strip.position.set(Math.sin(a) * r, 0, Math.cos(a) * r);
    strip.rotation.set(-lean, a, 0);
    strip.rotationQuaternion = null;
    strip.material = dark;
    strip.convertToFlatShadedMesh();
    out.push(strip);
  }
  return out;
}


/*
 * [S] 471 Thor's open coat (audit 468 thor a.3: "torso: grey vest block - TABS: a short-sleeved team coat open over the chest with gold trim and a gold chain
 * clasp"; legacy.thor.red.png: the trunk in a team coat whose fronts part down the middle over his bare chest, a gold strip along each front edge, short team
 * sleeves to mid upper arm, and a gold chain of a few links hanging across the opening at the chest). THOR_COAT: the trunk and yoke in team times .shade; on
 * its front a skin panel .open W wide from top to foot, .proud D off it, edged each side by a gold strip .trim W wide; a team sleeve shell .sleeveOut round
 * each upper arm to .sleeve of it; .links gold links, a chain sagging across the opening at .chainAt H over the middle. Gold .gold self-lit .glow.
 */
const THOR_COAT = { shade: 0.85, open: 0.3, proud: 0.04, trim: 0.06, sleeve: 0.55, sleeveOut: 1.3, links: 3, link: 0.11, chainAt: 0.22, sag: 0.06, gold: new Color3(0.95, 0.66, 0.16), glow: 0.22 };

/*
 * [S] 475 Thor's trousers, fur cuffs and boots (audit 468 thor a.5: "plain navy legs into dark boots - TABS: knee-length trousers ending in fur cuffs over
 * leather boots"; legacy.thor.red.png, .blue.png: baggy team trousers, darker than the coat, from the belt to just under the knee; a ragged cream fur
 * cuff round each leg at their foot; a short band of bare leg; then rust-brown leather boots to mid-shin with a turned cream top and a cream strap round
 * the ankle). THOR_LEGS: a team shell .pantOut round each thigh and on down the shin to .pantTo (shinOut); a cream cuff shell .furOut round the shin
 * over .fur above .pantTo, with .tufts cream wedges .tuft of the shin wide hanging off its rim; a leather boot shell .bootOut from .bootFrom to the
 * foot, a cream turned top .topOut over .top of it, a cream strap .strapOut at .strapAt; the foot blocks leather. Self-lit .glow.
 */
const THOR_LEGS = { shade: 0.72, pantOut: 1.5, shinOut: 1.5, pantTo: 0.34, fur: 0.14, furOut: 1.85, tufts: 7, tuft: 0.55, bootFrom: 0.5, bootOut: 1.35, top: 0.1, topOut: 1.55, strapAt: 0.9, strapOut: 1.45, cream: new Color3(0.96, 0.86, 0.62), leather: new Color3(0.55, 0.26, 0.14), glow: 0.16 };

/** Thor's knee-length team trousers with ragged fur cuffs over leather boots (spec at THOR_LEGS). */
export function thorLegs(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const L = THOR_LEGS;
  const mf = getMaterialFactory();
  const t = teamColor.scale(L.shade);
  const pants = mf.get("cloth", t, { emissive: t.scale(0.12) });
  const fur = mf.get("cloth", L.cream, { emissive: L.cream.scale(L.glow * 1.6) });
  const leather = mf.get("cloth", L.leather, { emissive: L.leather.scale(L.glow) });
  const out: Mesh[] = [];
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) out.push(limbShell(scene, "thorPants", thigh, 0, 1.0, L.pantOut, pants));
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    out.push(limbShell(scene, "thorPants", shin, 0, L.pantTo, L.shinOut, pants));
    const cuff = limbShell(scene, "thorFurCuff", shin, L.pantTo - L.fur, L.pantTo + 0.02, L.furOut, fur);
    out.push(cuff);
    // ragged tufts hanging off the cuff's rim, turned round the leg
    const bb = shin.getBoundingInfo().boundingBox;
    const half = Math.max(bb.extendSize.x, bb.extendSize.z) * shin.scaling.x;
    const cuffH = cuff.getBoundingInfo().boundingBox.extendSize.y * 2;
    for (let k = 0; k < L.tufts; k++) {
      const a = (k / L.tufts) * Math.PI * 2 + 0.3;
      const tall = cuffH * (0.9 + 0.5 * ((k * 37) % 5) / 4);
      const tuft = MeshBuilder.CreateCylinder("thorFurTuft", { height: tall, diameterTop: half * L.tuft, diameterBottom: 0, tessellation: 3 }, scene);
      tuft.convertToFlatShadedMesh();
      tuft.parent = cuff.parent;
      const r = half * L.furOut * 0.92;
      tuft.position.set(Math.sin(a) * r, cuff.position.y - cuffH / 2 - tall * 0.3, Math.cos(a) * r * 0.9);
      tuft.rotation.y = a;
      tuft.material = fur;
      out.push(tuft);
    }
    out.push(limbShell(scene, "thorBoot", shin, L.bootFrom, 1.04, L.bootOut, leather));
    out.push(limbShell(scene, "thorBootTop", shin, L.bootFrom - 0.02, L.bootFrom + L.top, L.topOut, fur));
    out.push(limbShell(scene, "thorBootStrap", shin, L.strapAt, L.strapAt + 0.06, L.strapOut, fur));
  }
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const foot of knee.getChildMeshes(true)) if (foot instanceof Mesh && /_[lr]FootM$/.test(foot.name)) foot.material = leather;
  }
  return out;
}

/** [R] 479, refs legacy.thor.red/blue.png, CONFIRM 475/477: keep slim upright build, blond beard and swept wings.
 * Dark short sleeves; gold-edged open V spans .8 trunk widths at the collar, narrows to .16 at the clasp,
 * with exposed team abdomen below. The front clears the outer yoke. Broad dark belt .25 trunk heights,
 * round grey .48-width buckle with raised boss and four surrounding studs (thorBelt); retain boots/pants. */
export function thorCoat(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const C = THOR_COAT;
  const mf = getMaterialFactory();
  const t = teamColor.scale(C.shade);
  const coat = mf.get("cloth", t, { emissive: t.scale(0.12) });
  const gold = mf.get("cloth", C.gold, { emissive: C.gold.scale(C.glow) });
  body.torsoMesh.material = coat;
  for (const m of body.torso.getChildMeshes(true)) if (/_yoke/.test(m.name) && m instanceof Mesh) m.material = coat;
  const out: Mesh[] = [];
  const { W, H, D, lay } = outerTrunkFrame(scene, body, out);
  const z = D / 2 + 0.035;
  const panel = MeshBuilder.CreateBox("thorCoatOpenV", { width: W * 0.8, height: H * 0.62, depth: 0.025 }, scene);
  const vertices = panel.getVerticesData("position")!;
  for (let i = 0; i < vertices.length; i += 3) if (vertices[i + 1] < 0) vertices[i] *= 0.2;
  panel.setVerticesData("position", vertices); panel.refreshBoundingInfo();
  lay(panel, 0, H * 0.16, z, body.skinMaterial);
  lay(MeshBuilder.CreateBox("thorCoatAbdomen", { width: W * 0.16, height: H * 0.32, depth: 0.025 }, scene), 0, -H * 0.3, z, body.skinMaterial);
  for (const s of [-1, 1]) {
    const dx = W * 0.32, dy = H * 0.62;
    const trim = MeshBuilder.CreateBox("thorCoatTrimV", { width: W * 0.055, height: Math.hypot(dx, dy), depth: 0.035 }, scene);
    trim.rotation.z = -s * Math.atan2(dx, dy);
    lay(trim, s * W * 0.24, H * 0.16, z + 0.02, gold);
    lay(MeshBuilder.CreateBox("thorCoatTrimLower", { width: W * 0.055, height: H * 0.32, depth: 0.035 }, scene), s * W * 0.08, -H * 0.3, z + 0.02, gold);
  }
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) out.push(limbShell(scene, "thorSleeve", arm, 0, C.sleeve, C.sleeveOut, coat));
  // the chain: links across the opening, the middle one lowest
  for (let k = 0; k < C.links; k++) {
    const u = C.links === 1 ? 0 : (k / (C.links - 1)) * 2 - 1;
    const x = u * W * C.open * 0.42, y = H * C.chainAt - (1 - u * u) * H * C.sag;
    const link = MeshBuilder.CreateTorus("thorChainLink", { diameter: W * C.link, thickness: W * C.link * 0.3, tessellation: 8 }, scene);
    link.rotation.x = Math.PI / 2;
    lay(link, x, y, z + D * C.proud, gold);
  }
  return out;
}

/*
 * [S] 471 the Wizard's pipe (audit 468 wizard a.3: "pipe missing - TABS: a curved pipe from the mouth"; legacy.wizard.red.png, card Appearance: a long
 * brown pipe from the corner of his mouth out over the beard, its stem curving down and out and its bowl turned up at the end). WIZARD_PIPE on the head
 * box (half sizes e, centre c, +z the face): the stem from the mouth corner (.side e.x out, .mouth e.y under the centre, .out e.z ahead of it, clear of
 * the beard) in .segs segments .seg e.z long, each dropping .bend rad more; a bowl .bowl e.x across and .bowlTall e.y tall standing at its end; brown wood.
 */
const WIZARD_PIPE = { side: 0.45, mouth: 0.35, out: 1.4, segs: 3, seg: 0.6, thick: 0.17, bend: 0.32, bowl: 0.5, bowlTall: 0.55, wood: new Color3(0.42, 0.24, 0.1), glow: 0.14 };

/** The Wizard's curved brown pipe from the mouth over the beard (spec at WIZARD_PIPE), hung on the head. */
export function wizardPipe(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = WIZARD_PIPE;
  const wood = getMaterialFactory().get("cloth", P.wood, { emissive: P.wood.scale(P.glow) });
  const head = body.headMesh;
  const bb = head.getBoundingInfo().boundingBox;
  const e = bb.extendSize, c = bb.center;
  const out: Mesh[] = [];
  let x = c.x + e.x * P.side, y = c.y - e.y * P.mouth, z = c.z + e.z * P.out;
  let pitch = 0.15;
  for (let i = 0; i < P.segs; i++) {
    const len = e.z * P.seg;
    const dy = -Math.sin(pitch) * len, dz = Math.cos(pitch) * len;
    const seg = MeshBuilder.CreateCylinder("wizardPipeStem", { height: len * 1.05, diameter: e.x * P.thick, tessellation: 6 }, scene);
    seg.position.set(x + len * 0.15, y + dy / 2, z + dz / 2);
    seg.rotation.x = Math.PI / 2 + pitch; // its axis along +z, tipped down by the pitch
    seg.rotation.y = 0.25;
    seg.material = wood;
    seg.parent = head;
    seg.convertToFlatShadedMesh();
    out.push(seg);
    x += len * 0.3; y += dy; z += dz;
    pitch += P.bend;
  }
  const bowl = MeshBuilder.CreateCylinder("wizardPipeBowl", { height: e.y * P.bowlTall, diameterTop: e.x * P.bowl, diameterBottom: e.x * P.bowl * 0.75, tessellation: 7 }, scene);
  bowl.position.set(x, y + e.y * P.bowlTall * 0.35, z);
  bowl.material = wood;
  bowl.parent = head;
  bowl.convertToFlatShadedMesh();
  out.push(bowl);
  return out;
}
