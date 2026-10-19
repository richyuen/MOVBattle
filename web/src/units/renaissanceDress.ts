import { Scene, Color3, Mesh, MeshBuilder, Node, TransformNode, Vector3, VertexBuffer, VertexData } from "@babylonjs/core";
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
 * [S] 372 the jabot as a front bib (critic 372: a scrunched ring under the chin no wider than the neck, stopping at the throat; renaissance.painter.jpg:
 * three warm-tan ruffles hanging down the front over the chest top, each lower one wider, the last out toward the collar edges and dropping to a point in
 * the middle). Not rings round the neck: each tier is a half-round flared panel on the chest's front only. Tier i (top first) hangs from .gap of a head
 * height under the head's lowest point plus i * .step, .tall head heights long, (.across + i * .grow) head widths across at its foot and .lip of that at its
 * top; half a round (.arc) turned to face forward, flattened so it bulges .bulge of the chest's depth ahead of its sides, its sides set .tuck of the depth
 * ahead of the chest's middle; foot rim in .points ragged points (every other one dropped .ragged of the tier), the last tier's middle dropping .vee of
 * its height more. A darker fold (.under) just under each tier's foot. Matte warm tan (.color, self-lit .glow).
 */
const PAINTER_JABOT = {
  tiers: 3, gap: 0.04, step: 0.25, tall: 0.36, across: 1.0, grow: 0.3, lip: 0.72, arc: 0.56, bulge: 0.55, tuck: 0.12, points: 7, ragged: 0.3, vee: 0.45,
  under: new Color3(0.46, 0.3, 0.16), underTall: 0.25, color: new Color3(0.8, 0.58, 0.34), glow: 0.16,
};

/** The Painter's jabot bib (spec at PAINTER_JABOT), parented to the torso, every tier below the head. */
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
  const cloth = getMaterialFactory().get("cloth", J.color, { emissiveIntensity: J.glow });
  const shade = getMaterialFactory().get("cloth", J.under, { emissiveIntensity: J.glow * 0.5 });
  const added: Mesh[] = [];
  const tall = headTall * J.tall;
  // a half-round panel facing forward: the cylinder's arc runs from +x round the back, so it is turned half a turn to face +z
  const panel = (name: string, height: number, foot: number, lip: number, last: boolean, ragged: boolean): Mesh => {
    const m = MeshBuilder.CreateCylinder(name, { height, diameterTop: lip, diameterBottom: foot, tessellation: J.points * 2, arc: J.arc, cap: Mesh.NO_CAP, sideOrientation: Mesh.DOUBLESIDE }, scene);
    const at = m.getVerticesData(VertexBuffer.PositionKind);
    if (at && ragged) {
      const step = (2 * Math.PI * J.arc) / (J.points * 2);
      for (let v = 0; v < at.length; v += 3) {
        if (at[v + 1] > 0) continue;
        const k = Math.round(Math.atan2(-at[v + 2], at[v]) / step);
        if (k % 2 === 1) at[v + 1] -= height * J.ragged;
        // the last tier drops to a point in the middle (the back of the arc, which faces forward once turned)
        const r = Math.hypot(at[v], at[v + 2]) || 1;
        if (last) at[v + 1] -= height * J.vee * Math.max(0, -at[v + 2] / r) ** 2;
      }
      m.setVerticesData(VertexBuffer.PositionKind, at);
    }
    m.rotation.y = Math.PI;
    m.convertToFlatShadedMesh();
    m.scaling.z = Math.min(1, (D * J.bulge) / (foot * 0.5));
    m.parent = body.torso;
    added.push(m);
    return m;
  };
  for (let i = 0; i < J.tiers; i++) {
    const across = headWide * (J.across + i * J.grow);
    const y = top - headTall * J.step * i - tall * 0.5;
    const tier = panel(`${chest.name}_jabot${i}`, tall, across, across * J.lip, i === J.tiers - 1, true);
    // each lower tier a touch further back, so the one above hangs over its top
    tier.position.set(0, y, D * J.tuck - i * D * 0.03);
    tier.material = cloth;
    if (i < J.tiers - 1) {
      const under = panel(`${chest.name}_jabotFold${i}`, tall * J.underTall, across * 0.92, across * 0.86, false, false);
      under.position.set(0, y - tall * 0.5 - tall * J.underTall * 0.3, D * J.tuck - i * D * 0.03 - D * 0.02);
      under.material = shade;
    }
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
 *   .points tan slashes laid flush on the puff's skin (372; critic 371: the radial cones stood out as spikes): each a pointed pane from .rootLat rad
 *   of the puff's latitude (up by the shoulder) down to its tip at .tipLat, .paneWide rad of the puff's azimuth across at the root, .waist of that
 *   at the middle, lifted .proud off the skin; spaced evenly round the puff.
 */
const ARCHER_FRONT = {
  band: 0.08, gap: 0.09, tall: 0.92, buttons: 4, button: 0.07, neck: 0.62, neckTall: 0.07,
  puff: 2.5, puffTall: 0.55, puffAt: 0.24, points: 7, rootLat: 0.75, tipLat: -0.45, paneWide: 0.42, waist: 0.75, proud: 1.03,
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
    // the slashes: tan panes laid on the puff's skin all round, wide by the shoulder, pointed at the bottom (372)
    const rx = girth * F.puff * 0.5, ry = tall * 0.5;
    const skin = (lat: number, az: number): number[] => [rx * F.proud * Math.cos(lat) * Math.sin(az), ry * F.proud * Math.sin(lat), rx * F.proud * Math.cos(lat) * Math.cos(az)];
    const midLat = (F.rootLat + F.tipLat) * 0.5;
    for (let i = 0; i < F.points; i++) {
      const a = ((i + 0.5) / F.points) * Math.PI * 2, hw = F.paneWide * 0.5;
      const v = [skin(F.rootLat, a - hw), skin(F.rootLat, a + hw), skin(midLat, a + hw * F.waist), skin(midLat, a - hw * F.waist), skin(F.tipLat, a)];
      const vd = new VertexData();
      vd.positions = v.flat();
      // both faces: outward first, then the same panes wound the other way
      vd.indices = [0, 1, 2, 0, 2, 3, 3, 2, 4, 2, 1, 0, 3, 2, 0, 4, 2, 3];
      const normals: number[] = [];
      VertexData.ComputeNormals(vd.positions, vd.indices, normals);
      vd.normals = normals;
      const pane = new Mesh("archerSlash", scene);
      vd.applyToMesh(pane);
      put(pane, tan, puff);
    }
  }
  return added;
}

/*
 * [S] 373 the fencer's shoulder wings and waist skirt (critic 372: a flat chest slab, a thin tan band on one upper arm, no wings, no tabs; the 334 wings
 * were flat discs edge-on to the camera and the tabs thin chips under the doublet's hem; renaissance.fencer.red.png: over each shoulder top a rolled team
 * wing standing out past the arm, a tan band round the sleeve under it; a dark belt at the waist and a ring of broad team tabs flaring out from it over
 * the top of the striped breeches). Shares of the chest (W, H, D) and of each upper arm's girth and length:
 *   wing: a flared team cap from .capTop to .capFoot of the girth round, .capTall of the arm long, its foot rolled in a team roll .roll of the girth thick
 *   round it; under it a tan band .band of the arm long, .bandOut of the girth round. Belt .belt of H tall, .beltOut of the chest round it, dark brown.
 *   The doublet is a box, so the belt is a box band .beltOut of it round, and the skirt a four-sided frustum from .skirtTop of the doublet's
 *   half-width and half-depth out at the belt to .skirtFoot at its foot, .skirtTall of H long, cut into .tabs tabs (.gapShare of each left open),
 *   team at .tabShade so the tabs part from the doublet.
 */
const FENCER_TRIM = {
  capTop: 1.25, capFoot: 1.95, capTall: 0.3, roll: 0.34, band: 0.12, bandOut: 1.3,
  belt: 0.09, beltOut: 1.06, tabs: 8, gapShare: 0.1, skirtTop: 1.04, skirtFoot: 1.3, skirtTall: 0.34, tabShade: 0.7,
  leather: new Color3(0.3, 0.16, 0.09), tan: new Color3(0.8, 0.56, 0.28), glow: 0.3,
};

/** The fencer's rolled shoulder wings with tan bands, dark belt and flared skirt of tabs (spec at FENCER_TRIM). `waist` is the chest's foot in the torso's frame. */
export function fencerTrim(scene: Scene, body: ArticulatedBody, teamColor: Color3, chest: { W: number; H: number; D: number; waist: number }): Mesh[] {
  const T = FENCER_TRIM;
  const mf = getMaterialFactory();
  const team = mf.getCloth(teamColor.scale(0.82));
  const tan = mf.get("cloth", T.tan, { emissiveIntensity: T.glow });
  const belt = mf.getCloth(T.leather);
  const added: Mesh[] = [];
  const put = (m: Mesh, mat: ReturnType<typeof mf.getCloth>, parent: TransformNode): Mesh => {
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    const e = arm.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2, long = e.y * 2;
    const capTall = long * T.capTall;
    const capY = long * 0.5 - capTall * 0.5;
    const cap = put(MeshBuilder.CreateCylinder("fencerWingCap", { height: capTall, diameterTop: girth * T.capTop, diameterBottom: girth * T.capFoot, tessellation: 8 }, scene), team, arm);
    cap.position.y = capY;
    const roll = put(MeshBuilder.CreateTorus("fencerWingRoll", { diameter: girth * T.capFoot, thickness: girth * T.roll, tessellation: 8 }, scene), team, arm);
    roll.position.y = capY - capTall * 0.5;
    const band = put(MeshBuilder.CreateCylinder("fencerBand", { height: long * T.band, diameter: girth * T.bandOut, tessellation: 8 }, scene), tan, arm);
    band.position.y = capY - capTall * 0.5 - girth * T.roll * 0.5 - long * T.band * 0.5;
  }
  const { W, H, D, waist } = chest;
  // the doublet is a box: the belt is a box band just proud of it, and the skirt a four-sided flared frustum round its hem, cut into tabs
  const beltBand = put(MeshBuilder.CreateBox("fencerBelt", { width: W * T.beltOut, height: H * T.belt, depth: D * T.beltOut }, scene), belt, body.torso);
  beltBand.position.y = waist;
  const tall = H * T.skirtTall;
  const a = (W / 2) * T.skirtTop, b = (D / 2) * T.skirtTop;
  const corners = [new Vector3(a, 0, b), new Vector3(-a, 0, b), new Vector3(-a, 0, -b), new Vector3(a, 0, -b)];
  const perFace = T.tabs / 4;
  const flare = T.skirtFoot / T.skirtTop;
  const tabCloth = mf.getCloth(teamColor.scale(T.tabShade));
  const top = waist - H * T.belt * 0.4;
  for (let f = 0; f < 4; f++) {
    const c0 = corners[f], c1 = corners[(f + 1) % 4];
    for (let j = 0; j < perFace; j++) {
      const t0 = (j + T.gapShare * 0.5) / perFace, t1 = (j + 1 - T.gapShare * 0.5) / perFace;
      const edge = [Vector3.Lerp(c0, c1, t0), Vector3.Lerp(c0, c1, t1)].map((v) => v.add(new Vector3(0, top, 0)));
      const foot = [Vector3.Lerp(c0, c1, t0), Vector3.Lerp(c0, c1, t1)].map((v) => new Vector3(v.x * flare, top - tall, v.z * flare));
      put(MeshBuilder.CreateRibbon("fencerTab", { pathArray: [edge, foot], sideOrientation: Mesh.DOUBLESIDE }, scene), tabCloth, body.torso);
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
