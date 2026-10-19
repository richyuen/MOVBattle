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

/*
 * [S] the musketeer's hose (371; renaissance.musketeer.red.png: under the breeches' knee band the shin is a team stocking, a dark garter wrapped just
 * below the knee and tied in a small bow on the outer side; at the ankle a pale tan sock top turned down over the shoe, flaring a little; low orange
 * shoes. Not the 335 pair of dark rings down the shin, which read as dark boots). Shares of the shin's girth and length:
 *   garter MUSKETEER_HOSE.garter of the shin long, .garterAt of it down from the knee, .garterOut of the girth round; bow loops .loop of the girth long,
 *   splayed .splay rad, two tails .tail of the shin long; sock top .sock of the shin long, from .sockTop to .sockFoot of the girth round at its foot;
 *   shoe MUSKETEER_HOSE.shoe self-lit .shoeGlow, sock .tan self-lit .tanGlow.
 */
const MUSKETEER_HOSE = {
  garter: 0.09, garterAt: 0.1, garterOut: 1.16, loop: 0.55, splay: 0.6, tail: 0.18,
  sock: 0.2, sockTop: 1.04, sockFoot: 1.32, tan: new Color3(0.86, 0.72, 0.5), tanGlow: 0.24, shoe: new Color3(0.86, 0.42, 0.18), shoeGlow: 0.16,
};

/** The musketeer's stockings below the breeches: garter and bow under the knee, turned-down tan sock tops, orange shoes (spec at MUSKETEER_HOSE). */
export function musketeerHose(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const S = MUSKETEER_HOSE;
  const mf = getMaterialFactory();
  const dark = mf.getCloth(teamColor.scale(0.35));
  const tan = mf.get("cloth", S.tan, { emissiveIntensity: S.tanGlow });
  const added: Mesh[] = [];
  const put = (m: Mesh, mat: ReturnType<typeof mf.getCloth>, parent: TransformNode): Mesh => {
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  for (const [shin, out] of [[body.leftLowerLeg, -1], [body.rightLowerLeg, 1]] as const) {
    shin.material = mf.getCloth(teamColor.scale(0.82));
    const e = shin.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2, long = e.y * 2;
    // the garter under the knee, and its bow on the outer side: two flat loops splayed up and down from a knot, two short tails hanging
    const gy = long * 0.5 - long * (S.garterAt + S.garter * 0.5);
    put(MeshBuilder.CreateCylinder("musketeerGarter", { height: long * S.garter, diameter: girth * S.garterOut, tessellation: 8 }, scene), dark, shin).position.y = gy;
    const knot = put(MeshBuilder.CreateBox("musketeerGarterKnot", { width: girth * 0.16, height: long * S.garter * 1.1, depth: girth * 0.2 }, scene), dark, shin);
    knot.position.set(out * girth * S.garterOut * 0.52, gy, 0);
    for (const k of [-1, 1]) {
      const loop = put(MeshBuilder.CreateCylinder("musketeerGarterLoop", { height: girth * S.loop, diameterTop: girth * 0.26, diameterBottom: girth * 0.08, tessellation: 4 }, scene), dark, shin);
      loop.scaling.x = 0.35;
      loop.rotation.z = out * (Math.PI / 2 - k * S.splay);
      loop.position.set(out * (girth * S.garterOut * 0.52 + girth * S.loop * 0.4), gy + k * girth * S.loop * 0.25, 0);
    }
    for (const k of [-1, 1]) {
      const tail = put(MeshBuilder.CreateBox("musketeerGarterTail", { width: girth * 0.05, height: long * S.tail, depth: girth * 0.13 }, scene), dark, shin);
      tail.rotation.z = out * 0.18 * k;
      tail.position.set(out * girth * S.garterOut * 0.56, gy - long * S.tail * 0.5, k * girth * 0.08);
    }
    // the sock top turned down over the ankle, flared at its foot
    const sock = put(MeshBuilder.CreateCylinder("musketeerSockTop", { height: long * S.sock, diameterTop: girth * S.sockTop, diameterBottom: girth * S.sockFoot, tessellation: 8 }, scene), tan, shin);
    sock.position.y = -long * 0.5 + long * S.sock * 0.5;
  }
  const shoe = mf.get("cloth", S.shoe, { emissiveIntensity: S.shoeGlow });
  for (const mesh of [...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name)) mesh.material = shoe;
  }
  return added;
}

/*
 * [S] the balloon archer's doublet front and sleeve puffs (371; renaissance.balloon_archer.red.png: a solid team doublet, down its front a tan placket
 * of two upright bands either side of the middle with round buttons between them, a tan edge round the neck; at each shoulder a big round team puff
 * as wide as the head, slashed with tan points standing out of it all round. Not the 336 tan stripes all over the doublet, nor its arm-girth puffs,
 * which read as tight sleeves). Shares of the chest (W, H, D) and of each upper arm's girth and length:
 *   placket bands ARCHER_FRONT.band of W across, .gap of W either side of the middle, .tall of H; buttons .buttons of .button of W round; neck edge
 *   .neck of W across, .neckTall of H; puff .puff of the girth round, .puffTall of the arm long, its middle .puffAt of it down from the shoulder;
 *   .points tan points .point of the puff's height long, .pointWide of the girth across at the root.
 */
const ARCHER_FRONT = {
  band: 0.08, gap: 0.09, tall: 0.92, buttons: 4, button: 0.07, neck: 0.62, neckTall: 0.07,
  puff: 2.5, puffTall: 0.55, puffAt: 0.24, points: 7, point: 0.85, pointWide: 0.8,
  tan: new Color3(0.82, 0.6, 0.32), glow: 0.3,
};

/** The balloon archer's tan placket, buttons and neck edge on a solid team doublet, and his slashed shoulder puffs (spec at ARCHER_FRONT). */
export function balloonArcherFront(scene: Scene, body: ArticulatedBody, teamColor: Color3, doublet: { W: number; H: number; D: number; y: number }): Mesh[] {
  const F = ARCHER_FRONT;
  const mf = getMaterialFactory();
  const tan = mf.get("cloth", F.tan, { emissiveIntensity: F.glow });
  const team = mf.getCloth(teamColor.scale(0.82));
  const added: Mesh[] = [];
  const put = (m: Mesh, mat: ReturnType<typeof mf.getCloth>, parent: TransformNode): Mesh => {
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  const { W, H, D, y } = doublet;
  const front = D * 0.5 + D * 0.015;
  for (const side of [-1, 1]) {
    const band = put(MeshBuilder.CreateBox("archerPlacket", { width: W * F.band, height: H * F.tall, depth: D * 0.04 }, scene), tan, body.torso);
    band.position.set(side * W * F.gap, y, front);
  }
  for (let i = 0; i < F.buttons; i++) {
    const b = put(MeshBuilder.CreateSphere("archerButton", { diameter: W * F.button, segments: 3 }, scene), tan, body.torso);
    b.scaling.z = 0.6;
    b.position.set(0, y + H * F.tall * (0.38 - (0.76 * i) / Math.max(1, F.buttons - 1)), front + D * 0.01);
  }
  const neck = put(MeshBuilder.CreateCylinder("archerNeckEdge", { height: H * F.neckTall, diameter: W * F.neck, tessellation: 8 }, scene), tan, body.torso);
  neck.scaling.z = Math.min(1, (D * 1.05) / (W * F.neck));
  neck.position.set(0, y + H * 0.5 - H * F.neckTall * 0.3, 0);
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    const e = arm.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2, long = e.y * 2;
    const tall = long * F.puffTall;
    const puff = put(MeshBuilder.CreateSphere("archerPuff", { diameterX: girth * F.puff, diameterY: tall, diameterZ: girth * F.puff, segments: 5 }, scene), team, arm);
    puff.position.y = long * 0.5 - long * F.puffAt;
    // the slashes: tan points standing out of the puff's waist all round, each tipped up a little, like the render's star of tan
    for (let i = 0; i < F.points; i++) {
      const a = ((i + 0.5) / F.points) * Math.PI * 2;
      const pivot = new TransformNode("archerSlashPivot", scene);
      pivot.parent = puff;
      pivot.rotation.y = a;
      const pt = put(MeshBuilder.CreateCylinder("archerSlash", { height: tall * F.point, diameterTop: 0, diameterBottom: girth * F.pointWide, tessellation: 4 }, scene), tan, pivot);
      pt.scaling.z = 0.3;
      // out along the pivot's +z on the puff's skin, its point up
      pt.position.set(0, tall * 0.1, girth * F.puff * 0.5);
      pt.rotation.x = 0.45;
    }
  }
  return added;
}

/*
 * [S] the jouster's feather clump (371; renaissance.jouster.blue.png, .png, card "colored feathers": on the helm's crown and on the horse's poll a dense,
 * bushy plume in a deep saturated team colour, a packed column of fat lumps about a head across, rising and curling back at its top, no sky between the
 * lumps. Critic 370: the stacked single tufts read as a spiral horn, the flat fanned blades as a claw; team cloth self-lit .2 washed out to lavender).
 * In the clump's size S (its base across): FEATHER_CLUMP.tiers rings of lumps, ring k holding .ring[k] lumps .spread[k] S out from the axis, each lump
 * .lump S round squashed to .squash front to back and stretched .stretch tall, the rings .rise S apart, ring k set .curl * k * k S back; one crowning
 * lump on top bent furthest back. Lumps lean out .lean rad from the axis. Matte team at .shade, self-lit .glow.
 */
const FEATHER_CLUMP = { tiers: 3, ring: [4, 4, 3], spread: [0.22, 0.2, 0.15], lump: 0.42, squash: 0.85, stretch: 1.3, rise: 0.3, curl: 0.07, lean: 0.35, shade: 0.85, glow: 0.08 };

/** A packed team feather clump on `parent` (spec at FEATHER_CLUMP): its base middle at `base`, +y up, -z back, `size` across at the base. */
export function featherClump(scene: Scene, parent: TransformNode, base: Vector3, size: number, teamColor: Color3, name: string): Mesh[] {
  const C = FEATHER_CLUMP;
  const mat = getMaterialFactory().get("cloth", teamColor.scale(C.shade), { emissiveIntensity: C.glow });
  const added: Mesh[] = [];
  const lump = (x: number, y: number, z: number, scale: number, tiltX: number, tiltZ: number, spin: number) => {
    const m = MeshBuilder.CreateIcoSphere(name, { radius: 1, subdivisions: 1, flat: true }, scene);
    const r = size * C.lump * scale;
    m.scaling.set(r, r * C.stretch, r * C.squash);
    m.position.set(base.x + x, base.y + y, base.z + z);
    m.rotation.set(tiltX, spin, tiltZ);
    m.material = mat;
    m.parent = parent;
    added.push(m);
  };
  let y = size * C.lump * 0.5;
  for (let k = 0; k < C.tiers; k++) {
    const n = C.ring[k], out = size * C.spread[k], back = -size * C.curl * k * k, scale = 1 - k * 0.12;
    for (let i = 0; i < n; i++) {
      const a = ((i + (k % 2) * 0.5) / n) * Math.PI * 2;
      const sx = Math.sin(a), sz = Math.cos(a);
      lump(sx * out, y, back + sz * out, scale, sz * C.lean - k * 0.25, -sx * C.lean, a);
    }
    y += size * C.rise;
  }
  // the crowning lump, bent furthest back
  lump(0, y - size * C.rise * 0.2, -size * C.curl * C.tiers * C.tiers, 0.75, -0.9, 0, 0.4);
  return added;
}
