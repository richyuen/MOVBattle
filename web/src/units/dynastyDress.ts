import { Scene, Color3, Mesh, MeshBuilder, Node, TransformNode, Vector3 } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

/*
 * Dynasty dress (units/dynasty.*): cloth, hair, masks and held pieces built per unit id by unitFactory, sized off the body's own metrics and joints.
 * Pieces worn on the head are parented to the head mesh (+z his front, +y up, its origin its middle); pieces on the trunk to the torso joint.
 */

/** The bead eyes' bottom and top in the head block's own frame (null when the body has no eyes); the eyes hang off the neck, not the head block. */
function eyeSpanInHead(body: ArticulatedBody): [number, number] | null {
  const eyes = [body.leftEye, body.rightEye].filter((m): m is Mesh => !!m);
  if (!eyes.length) return null;
  const chain: Node[] = [];
  for (let n: Node | null = eyes[0]; n; n = n.parent) chain.unshift(n);
  for (const n of chain) if (n instanceof TransformNode) n.computeWorldMatrix(true);
  body.headMesh.computeWorldMatrix(true);
  const toHead = body.headMesh.getWorldMatrix().clone().invert();
  let lo = Infinity, hi = -Infinity;
  for (const eye of eyes) {
    eye.computeWorldMatrix(true);
    const bb = eye.getBoundingInfo().boundingBox;
    lo = Math.min(lo, Vector3.TransformCoordinates(new Vector3(bb.centerWorld.x, bb.minimumWorld.y, bb.centerWorld.z), toHead).y);
    hi = Math.max(hi, Vector3.TransformCoordinates(new Vector3(bb.centerWorld.x, bb.maximumWorld.y, bb.centerWorld.z), toHead).y);
  }
  return [lo, hi];
}

/*
 * [S] 411 the Monk's bo (audit 411 b.1: "missing: Monk Staff - TABS: a long bo, wider than his arm span, with grey capped ends, held two-handed across
 * the body"; dynasty.monk.red.png: a plain orange-brown pole about 1.2 of his height, a grey cap and a dark band at each end, held level across his
 * chest in both fists). In the weapon fist: a holder at the fist (proceduralAnimation _restMonkBo lays it level across his front) carrying the shaft
 * .long of his height, .thick of it across, its middle .offset of its length off the fist toward his off side, so both fists sit on it either side of
 * his middle; a grey cap .cap of the length at each end, .capWide of the shaft, a dark band .band of the length inside each cap. The off hand rides the
 * shaft (POLE_GRIP boGrip).
 */
const MONK_STAFF = {
  long: 1.2, thick: 0.022, offset: 0.2, cap: 0.08, capWide: 1.45, band: 0.025,
  wood: new Color3(0.62, 0.34, 0.16), steel: new Color3(0.5, 0.5, 0.5), dark: new Color3(0.2, 0.14, 0.1), glow: 0.14,
};
/** The Monk's bo staff in his weapon fist (spec at MONK_STAFF). */
export function monkStaff(scene: Scene, body: ArticulatedBody): Mesh[] {
  const S = MONK_STAFF;
  const mf = getMaterialFactory();
  const wood = mf.get("cloth", S.wood, { emissive: S.wood.scale(S.glow) });
  const steel = mf.get("cloth", S.steel, { emissive: S.steel.scale(S.glow) });
  const dark = mf.get("cloth", S.dark, { emissive: S.dark.scale(S.glow) });
  // his height in the hand's frame: the world height over the hand's world scale
  body.rightHand.computeWorldMatrix(true);
  const scale = Math.max(0.001, body.rightHand.absoluteScaling.y);
  const height = (body.metrics.overallHeight * body.root.scaling.y) / scale;
  const L = height * S.long, r = height * S.thick;
  const holder = new TransformNode("monkBoHolder", scene);
  holder.parent = body.rightHand;
  const shaft = MeshBuilder.CreateCylinder("monkBo", { height: L, diameter: r * 2, tessellation: 7 }, scene);
  shaft.parent = holder;
  shaft.position.y = L * S.offset;
  shaft.material = wood;
  shaft.convertToFlatShadedMesh();
  new TransformNode("boGrip", scene).parent = shaft;
  const out: Mesh[] = [shaft];
  for (const end of [-1, 1]) {
    const cap = MeshBuilder.CreateCylinder("monkBoCap", { height: L * S.cap, diameterTop: r * 2 * S.capWide * (end > 0 ? 0.8 : 1), diameterBottom: r * 2 * S.capWide * (end > 0 ? 1 : 0.8), tessellation: 7 }, scene);
    cap.parent = shaft;
    cap.position.y = end * (L * 0.5 - L * S.cap * 0.5);
    cap.material = steel;
    cap.convertToFlatShadedMesh();
    const band = MeshBuilder.CreateCylinder("monkBoBand", { height: L * S.band, diameter: r * 2 * 1.25, tessellation: 7 }, scene);
    band.parent = shaft;
    band.position.y = end * (L * 0.5 - L * S.cap - L * S.band);
    band.material = dark;
    out.push(cap, band);
  }
  return out;
}

/*
 * [S] 411 the Ninja's hood and mask (audit 411 a.1: "an oversized near-black ball about twice head size with a stub at the back - TABS: a head-sized
 * team-coloured hood and face mask"; dynasty.ninja.red.png: a boxy team hood over the crown and down the back and sides of the head, a mask over the
 * face from under the eyes to the chin, an open band at the eyes for the two bead eyes, a short tied tail hanging at the back). In the head's half
 * extents e, all boxes .out of e proud:
 *   crown: from .clear over the eyes' top to .top of e.y; back: the full height behind .backFrom of e.z; sides: the full height from .sideFrom of e.x out;
 *   mask: the full width and depth from .chin of e.y up to .clear under the eyes' bottom, a shade .maskShade of the team;
 *   tail: a knot .knot of e at the back of the crown with a band .tail of e.y long hanging from it.
 * Replaces the shared ninja_mask hat (unitVisuals).
 */
const NINJA_HOOD = { out: 1.12, clear: 0.05, top: 1.12, backFrom: -0.15, sideFrom: 0.72, chin: -1.08, maskShade: 0.82, knot: 0.22, tail: 0.9, glow: 0.12 };
/** The Ninja's boxy team hood with an eye band and a face mask (spec at NINJA_HOOD). */
export function ninjaHood(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const N = NINJA_HOOD;
  const mf = getMaterialFactory();
  const cloth = mf.get("cloth", teamColor, { emissive: teamColor.scale(N.glow) });
  const shade = teamColor.scale(N.maskShade);
  const maskCloth = mf.get("cloth", shade, { emissive: shade.scale(N.glow) });
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const span = eyeSpanInHead(body) ?? [-e.y * 0.2, e.y * 0.3];
  const X = e.x * N.out, Z = e.z * N.out;
  const out: Mesh[] = [];
  const slab = (name: string, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, mat = cloth): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: x1 - x0, height: y1 - y0, depth: z1 - z0 }, scene);
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    m.parent = body.headMesh;
    m.material = mat;
    out.push(m);
    return m;
  };
  const eyeTop = span[1] + e.y * N.clear, eyeBottom = span[0] - e.y * N.clear;
  const bottom = e.y * N.chin, top = e.y * N.top;
  slab("ninjaHoodCrown", -X, X, eyeTop, top, -Z, Z);
  slab("ninjaHoodBack", -X, X, bottom, eyeTop, -Z, e.z * N.backFrom);
  for (const side of [-1, 1]) slab("ninjaHoodSide", side > 0 ? e.x * N.sideFrom : -X, side > 0 ? X : -e.x * N.sideFrom, eyeBottom, eyeTop, -Z, Z);
  slab("ninjaMask", -X, X, bottom, eyeBottom, -Z, Z * 1.02, maskCloth);
  const k = e.y * N.knot;
  slab("ninjaHoodKnot", -k, k, eyeTop - k, eyeTop + k, -Z - k * 1.4, -Z);
  const tail = slab("ninjaHoodTail", -k * 0.6, k * 0.6, eyeTop - e.y * N.tail, eyeTop, -Z - k * 1.1, -Z - k * 0.5);
  tail.rotation.x = -0.25;
  return out;
}
