import { Scene, Color3, Mesh, MeshBuilder, VertexBuffer } from "@babylonjs/core";
import { getMaterialFactory } from "./materialFactory";

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
