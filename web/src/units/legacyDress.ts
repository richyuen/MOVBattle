import { Scene, Color3, Mesh, MeshBuilder } from "@babylonjs/core";
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
