import { Scene, Color3, Mesh, MeshBuilder } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

/*
 * Renaissance dress and held pieces (units/renaissance.*): cloth, ornaments and small held things built per unit id by unitFactory, sized off the body's
 * own metrics. Held pieces hang off a hand joint, +y along the piece from the fist (the weapons' convention).
 */

/*
 * [S] the balloon arrow in the draw hand (369; renaissance.balloon_archer.red.png, .jpg: at rest and in the draw his off fist holds a balloon arrow across
 * his front beside the bow, a big team ball just behind its grey head). In the man's heights (overallHeight): a light shaft HELD_BALLOON_ARROW.long long
 * and .shaft across, the fist .grip of it from the nock; a grey four-sided head .head long; the team ball .ball across, squashed .squash along the shaft,
 * set just behind the head. Named "heldArrow": the sim hides it from the loose until half the reload is past (SimulationSystem _arrowsAway).
 */
const HELD_BALLOON_ARROW = { long: 0.42, shaft: 0.016, grip: 0.3, head: 0.05, ball: 0.1, squash: 1.15 };
const ARROW_WOOD = new Color3(0.62, 0.42, 0.24);
const ARROW_HEAD = new Color3(0.7, 0.7, 0.7);

/** The balloon archer's nocked balloon arrow in his off (draw) fist (spec at HELD_BALLOON_ARROW). */
export function heldBalloonArrow(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const A = HELD_BALLOON_ARROW;
  const H = body.metrics.overallHeight;
  const mf = getMaterialFactory();
  const long = A.long * H;
  const shaft = MeshBuilder.CreateCylinder("heldArrow", { height: long, diameter: A.shaft * H, tessellation: 5 }, scene);
  shaft.parent = body.leftHand;
  shaft.position.y = long * (0.5 - A.grip);
  shaft.material = mf.get("cloth", ARROW_WOOD, { emissiveIntensity: 0.1 });
  const head = MeshBuilder.CreateCylinder("heldArrowHead", { height: A.head * H, diameterTop: 0, diameterBottom: A.shaft * H * 3.2, tessellation: 4 }, scene);
  head.convertToFlatShadedMesh();
  head.parent = shaft;
  head.position.y = long / 2 + A.head * H / 2;
  head.material = mf.get("cloth", ARROW_HEAD, { emissiveIntensity: 0.15 });
  const ball = MeshBuilder.CreateSphere("heldArrowBall", { diameter: A.ball * H, segments: 6 }, scene);
  ball.convertToFlatShadedMesh();
  ball.parent = shaft;
  ball.scaling.y = A.squash;
  ball.position.y = long / 2 - A.ball * H * A.squash * 0.35;
  ball.material = mf.get("cloth", teamColor, { emissiveIntensity: 0.12 });
  return [shaft, head, ball];
}
