import { Scene, Color3, Mesh, MeshBuilder, Node, TransformNode, Vector3, VertexBuffer } from "@babylonjs/core";
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
const HELD_BALLOON_ARROW = { long: 0.42, shaft: 0.018, grip: 0.3, head: 0.06, ball: 0.13, squash: 1.15, glow: 0.25 };
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
  // across the fist, square to the forearm (the hand joint's +y runs down the forearm out of the fist), the head out to his off side
  shaft.rotation.z = Math.PI / 2;
  shaft.position.x = -long * (0.5 - A.grip);
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
  ball.material = mf.get("cloth", teamColor, { emissiveIntensity: A.glow });
  return [shaft, head, ball];
}

/*
 * [S] the feather plume (370; renaissance.jouster.png, card Appearance "Both the rider and the horse have colored feathers": a spray of broad team
 * feathers off the helm's crown and off the horse's poll, rising and curling back over like a cock's tail, their edges stepped). Not the 335 stack of
 * tufts, which read as a twisted spiral horn. In the parent's frame (+y up, -z back), all sizes in `size` units: FEATHER_PLUME.feathers feathers fanned
 * .fan side to side about the root (the outer ones turned .turn toward the front), each leaning .rake back and built of .segs flat diamond blades on a chain of joints, each blade bent .curl[k] further
 * back than the last; the middle feather .long long, the outer ones .outer of that; a blade .wide across at its foot narrowing to .tip of that at its
 * top, the next blade starting .step of the last's foot (so the outline steps like a ragged feather), .thick of its width thin side to side. Matte team
 * cloth self-lit .glow.
 */
export const FEATHER_PLUME = { feathers: 7, fan: 0.4, turn: 1.4, rake: 0.25, segs: 3, curl: [0.05, 0.6, 0.75], long: 3.4, outer: 0.7, wide: 0.85, tip: 0.6, step: 0.85, thick: 0.45, glow: 0.2 };

/** A team feather plume (spec at FEATHER_PLUME) rooted at `at` in `parent`'s frame, `size` the unit length. Returns the blades. */
export function featherPlume(scene: Scene, name: string, parent: TransformNode, at: Vector3, size: number, color: Color3): Mesh[] {
  const F = FEATHER_PLUME;
  const material = getMaterialFactory().get("cloth", color, { emissiveIntensity: F.glow });
  const root = new TransformNode(name, scene);
  root.parent = parent;
  root.position.copyFrom(at);
  const blades: Mesh[] = [];
  for (let f = 0; f < F.feathers; f++) {
    const t = F.feathers > 1 ? f / (F.feathers - 1) - 0.5 : 0;
    const len = F.long * size * (1 - (1 - F.outer) * Math.abs(2 * t));
    const seg = len / F.segs;
    let joint = new TransformNode(`${name}Feather`, scene);
    joint.parent = root;
    // the outer feathers turn their flat faces toward the front, so the spray reads as a fan from ahead and from the side
    joint.rotation.set(-F.rake - Math.abs(t) * 0.3, t * F.turn, -t * 2 * F.fan);
    let wide = F.wide * size * (1 - Math.abs(t) * 0.3);
    for (let k = 0; k < F.segs; k++) {
      if (k > 0) {
        const next = new TransformNode(`${name}Joint`, scene);
        next.parent = joint;
        next.position.y = seg;
        joint = next;
      }
      joint.rotation.x += -F.curl[Math.min(k, F.curl.length - 1)];
      // a little twist per blade, alternating, so the stepped edges catch the light
      joint.rotation.y += (k % 2 ? 1 : -1) * 0.18 * (f % 2 ? 1 : -1);
      const blade = MeshBuilder.CreateCylinder(`${name}Blade`, { height: seg * 1.08, diameterTop: wide * F.tip, diameterBottom: wide, tessellation: 4 }, scene);
      blade.position.y = seg * 0.5;
      blade.scaling.x = F.thick;
      blade.material = material;
      blade.convertToFlatShadedMesh();
      blade.parent = joint;
      blades.push(blade);
      wide *= F.step;
    }
  }
  return blades;
}

/*
 * [S] the Painter's jabot (369; renaissance.painter.jpg: three tan ruffles stacked at the throat from under the jaw to the top of the chest, each a little
 * wider than the one above and out past the neck toward the collar, a darker fold under each so the steps read; the face clear above it. Critic 368: the
 * last cut rose over the chin and read as a beard, its tiers merged into one pale cone). The stack is measured off the body: its top PAINTER_JABOT.gap of a
 * head height under the head mesh's lowest point (taken into the torso's frame), its foot .below of a head height under the chest's top; the span is split
 * into .tiers even bands. Tier i (top first) is (.across + i * .grow) head widths across at its foot, its top .lip of that, flattened to .flat of the chest's
 * depth front to back and pushed .ahead of the chest's depth forward, its foot rim cut in .points ragged points (every other one dropped .ragged of the
 * tier). Just under each tier's foot a darker ring (.under colour), .underTall of the tier tall and .underWide of its foot across (inside the ragged
 * points, over the next tier's narrow top), reads as the fold's shadow between the steps. Matte warm tan
 * (.color, self-lit .glow).
 */
const PAINTER_JABOT = {
  tiers: 3, gap: 0.04, below: 0.12, across: 0.95, grow: 0.25, lip: 0.6, flat: 1.3, ahead: 0.12, points: 10, ragged: 0.4,
  under: new Color3(0.46, 0.3, 0.16), underTall: 0.3, underWide: 0.9, color: new Color3(0.78, 0.57, 0.34), glow: 0.14,
};

/** The Painter's stacked-tier jabot (spec at PAINTER_JABOT), parented to the torso, every tier below the head. */
export function painterJabot(scene: Scene, body: ArticulatedBody): Mesh[] {
  const J = PAINTER_JABOT;
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const D = ext.z * 2 * chest.scaling.z;
  const chestTop = chest.position.y + ext.y * chest.scaling.y;
  // The head's lowest point in the torso's frame (the head hangs off the neck joint, not the torso)
  for (let n: Node | null = body.headMesh; n; n = n.parent) if (n instanceof TransformNode) n.computeWorldMatrix(true);
  body.torso.computeWorldMatrix(true);
  const head = body.headMesh.getBoundingInfo().boundingBox;
  const headTall = head.extendSize.y * 2 * body.headMesh.scaling.y;
  const headWide = head.extendSize.x * 2 * body.headMesh.scaling.x;
  const toTorso = body.torso.getWorldMatrix().clone().invert();
  const chin = Math.min(...head.vectorsWorld.map((v) => Vector3.TransformCoordinates(v, toTorso).y));
  const top = Math.min(chin, chestTop + headTall * 0.6) - headTall * J.gap;
  const foot = chestTop - headTall * J.below;
  const band = (top - foot) / J.tiers;
  const cloth = getMaterialFactory().get("cloth", J.color, { emissiveIntensity: J.glow });
  const shade = getMaterialFactory().get("cloth", J.under, { emissiveIntensity: J.glow * 0.5 });
  const added: Mesh[] = [];
  for (let i = 0; i < J.tiers; i++) {
    const across = headWide * (J.across + i * J.grow);
    const tier = MeshBuilder.CreateCylinder(`${chest.name}_jabot${i}`, {
      height: band, diameterTop: across * J.lip, diameterBottom: across, tessellation: J.points * 2, cap: Mesh.NO_CAP, sideOrientation: Mesh.DOUBLESIDE,
    }, scene);
    const at = tier.getVerticesData(VertexBuffer.PositionKind);
    if (at) {
      // the foot rim's every other vertex hangs lower: ragged ruffle points
      for (let v = 0; v < at.length; v += 3) {
        if (at[v + 1] > 0) continue;
        const k = Math.round(((Math.atan2(at[v + 2], at[v]) + Math.PI) / (2 * Math.PI)) * J.points * 2);
        if (k % 2 === 0) at[v + 1] -= band * J.ragged;
      }
      tier.setVerticesData(VertexBuffer.PositionKind, at);
    }
    tier.convertToFlatShadedMesh();
    const flat = Math.min(1, (D * J.flat) / across);
    tier.scaling.z = flat;
    const y = top - band * (i + 0.5);
    tier.position.set(0, y, D * J.ahead);
    tier.material = cloth;
    tier.parent = body.torso;
    added.push(tier);
    // the fold's shadow under this tier's foot
    const under = MeshBuilder.CreateCylinder(`${chest.name}_jabotFold${i}`, {
      height: band * J.underTall, diameterTop: across * J.underWide, diameterBottom: across * J.underWide * 0.88, tessellation: J.points * 2, cap: Mesh.NO_CAP, sideOrientation: Mesh.DOUBLESIDE,
    }, scene);
    under.convertToFlatShadedMesh();
    under.scaling.z = flat;
    under.position.set(0, y - band * 0.5 - band * J.underTall * 0.5, D * J.ahead);
    under.material = shade;
    under.parent = body.torso;
    added.push(under);
  }
  return added;
}
