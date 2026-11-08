import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import type { Material } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

/*
 * Secret faction cloth, hats and ornaments (loop: new per-unit dress goes here, not into unitFactory or propBuilder).
 */

/** A chain of 6-sided tapered segments through `pts` (in `parent`'s frame), `root` across at the first point to a point at the last. */
function taper(scene: Scene, name: string, pts: Vector3[], root: number, tip: number, parent: TransformNode, material: Material, out: Mesh[]): void {
  const n = pts.length - 1, up = new Vector3(0, 1, 0);
  for (let k = 0; k < n; k++) {
    const a = pts[k], e = pts[k + 1], d = e.subtract(a);
    const r0 = root + (tip - root) * (k / n), r1 = root + (tip - root) * ((k + 1) / n);
    const seg = MeshBuilder.CreateCylinder(name, { height: d.length() * 1.08, diameterBottom: r0, diameterTop: r1, tessellation: 6 }, scene);
    seg.parent = parent; seg.material = material;
    seg.position.copyFrom(a.add(e).scale(0.5));
    seg.rotationQuaternion = Quaternion.FromUnitVectorsToRef(up, d.normalize(), new Quaternion());
    out.push(seg);
  }
}

/** The bead eyes' top, read into the head mesh's frame (LESSONS: the eyes hang off the neck, not the head block). */
function eyeTopInHead(body: ArticulatedBody): number | null {
  const head = body.headMesh, eye = body.leftEye ?? body.rightEye;
  if (!eye) return null;
  for (let n: TransformNode | null = eye; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
  for (let n: TransformNode | null = head; n; n = n.parent as TransformNode | null) n.computeWorldMatrix(true);
  eye.refreshBoundingInfo();
  const inv = Matrix.Invert(head.getWorldMatrix());
  let top = -Infinity;
  for (const v of eye.getBoundingInfo().boundingBox.vectorsWorld) top = Math.max(top, Vector3.TransformCoordinates(v, inv).y);
  return top;
}

/**
 * [S] 500 the Shouter's Nordic helmet (secret.shouter.red.png; audit 500 a.1: "helmet: a bare team head - TABS a dark iron Nordic helmet with
 * curled brown horns and a nose guard"). The render: a dark grey faceted iron bowl over the crown and the sides of the head, its rim just over the
 * bead eyes, a broad nose guard and two cheek plates hanging down the face either side of it to the mouth, the eyes looking out between them; out
 * of each side over the ears a brown ram's horn running out about half a head, curling up and back.
 * Spec in head widths W, heights H, depths D (the head box, its centre c; e the eyes' top in the head frame): an 8-sided iron bowl .bowl W across
 * from .rim H over e up to .top H over the centre, domed over the top (a half sphere .dome H tall); a brow band .band H tall round its foot,
 * .bandOut proud; a nose guard .noseW W wide from the band down .nose H, standing .proud D in front of the face; cheek plates .cheekW W wide,
 * .cheek H long at .cheekX W out, tipped in .cheekTilt rad; per side a horn rooted at the bowl's side .hornY H over e, through HORN_PATH
 * [x W out, y H up, z D back] tapering from .hornRoot W to .hornTip W. Iron dark lit cloth .iron self-lit .12 (LESSONS: metal reads near black);
 * horn brown .horn. All out of the glow.
 */
const SHOUTER_HELM = {
  iron: new Color3(0.2, 0.21, 0.23), horn: new Color3(0.42, 0.22, 0.09), bowl: 1.22, rim: 0.02, top: 0.66, dome: 0.32, band: 0.12, bandOut: 0.04,
  noseW: 0.2, nose: 0.42, proud: 0.56, cheekW: 0.24, cheek: 0.36, cheekX: 0.46, cheekTilt: 0.12, hornY: 0.12, hornRoot: 0.28, hornTip: 0.06,
};
const HORN_PATH: [number, number, number][] = [[0.52, 0, 0], [0.78, 0.04, 0.02], [0.98, 0.2, 0.08], [1.04, 0.42, 0.2], [0.94, 0.56, 0.32], [0.82, 0.5, 0.36]];
export function shouterHelm(scene: Scene, body: ArticulatedBody): Mesh[] {
  const C = SHOUTER_HELM, mf = getMaterialFactory(), glow = scene.getGlowLayerByName("glow");
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const e = eyeTopInHead(body) ?? c.y + H * 0.1;
  const iron = mf.get("cloth", C.iron, { emissive: C.iron.scale(0.12), roughness: 1 });
  const horn = mf.get("cloth", C.horn, { emissive: C.horn.scale(0.12), roughness: 1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: Material): Mesh => { m.parent = head; m.material = material; out.push(m); return m; };
  const foot = e + H * C.rim, crown = c.y + H * C.top, bowlH = crown - foot;
  const bowl = put(MeshBuilder.CreateCylinder("shouterHelm", { height: bowlH, diameterTop: W * C.bowl * 1.02, diameterBottom: W * C.bowl, tessellation: 8 }, scene), iron);
  bowl.rotation.y = Math.PI / 8; bowl.scaling.z = (D * C.bowl) / (W * C.bowl); bowl.position.set(c.x, foot + bowlH / 2, c.z);
  const dome = put(MeshBuilder.CreateSphere("shouterHelmDome", { diameter: 1, segments: 4, slice: 0.5 }, scene), iron);
  dome.scaling.set(W * C.bowl * 1.02, H * C.dome * 2, D * C.bowl * 1.02); dome.position.set(c.x, crown, c.z);
  const band = put(MeshBuilder.CreateCylinder("shouterHelmBand", { height: H * C.band, diameter: W * (C.bowl + C.bandOut * 2), tessellation: 8 }, scene), iron);
  band.rotation.y = Math.PI / 8; band.scaling.z = D / W; band.position.set(c.x, foot + (H * C.band) / 2, c.z);
  const face = c.z + D * C.proud;
  const nose = put(MeshBuilder.CreateBox("shouterHelmNose", { width: W * C.noseW, height: H * C.nose, depth: D * 0.1 }, scene), iron);
  nose.position.set(c.x, foot + H * 0.04 - (H * C.nose) / 2, face);
  for (const side of [-1, 1]) {
    const cheek = put(MeshBuilder.CreateBox("shouterHelmCheek", { width: W * C.cheekW, height: H * C.cheek, depth: D * 0.08 }, scene), iron);
    cheek.position.set(c.x + side * W * C.cheekX, foot - (H * C.cheek) / 2 - H * 0.12, face - D * 0.03);
    cheek.rotation.z = side * C.cheekTilt;
    const pts = HORN_PATH.map(([x, y, z]) => new Vector3(c.x + side * x * W, e + H * C.hornY + y * H, c.z - z * D));
    taper(scene, "shouterHorn", pts, W * C.hornRoot, W * C.hornTip, head, horn, out);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); glow?.addExcludedMesh(m); }
  return out;
}
