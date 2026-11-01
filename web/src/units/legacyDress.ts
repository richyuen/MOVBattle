import { Scene, Color3, Mesh, MeshBuilder, type Material } from "@babylonjs/core";
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
const BEARER_RING = { radius: 1.6, band: 0.05, flat: 0.012, lift: 0.02, sides: 40, glow: 0.45 };

/** A flat team ring on the ground round the bearer (spec at BEARER_RING), hung on the body root at the soles. */
export function bearerRing(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const R = BEARER_RING, H = body.metrics.overallHeight;
  const ring = MeshBuilder.CreateTorus("bearerRing", { diameter: R.radius * H * 2, thickness: R.band * H, tessellation: R.sides }, scene);
  ring.scaling.y = R.flat / R.band;
  ring.position.y = R.lift * H;
  ring.material = getMaterialFactory().get("cloth", teamColor, { emissive: teamColor.scale(R.glow) });
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
const PEASANT_BELT = { lumps: 12, out: 1.12, at: -0.42, lump: 0.36, fat: 0.42, twist: 0.6, cream: new Color3(1, 0.95, 0.8), glow: 0.32 };

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

