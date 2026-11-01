import { Scene, Color3, Mesh, MeshBuilder } from "@babylonjs/core";
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
