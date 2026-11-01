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
