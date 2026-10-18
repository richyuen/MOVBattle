import { Scene, Vector3, Color3, Mesh, MeshBuilder } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { jitterVertices } from "./tribalDress";

// Medieval faction hair, cloth and ornaments (loop v2: per-unit dress lives here, not in the builder monoliths).

/*
 * [S] the Healer's tonsure (355; medieval.healer.red.png, card Appearance "having the tonsure", "an old Wobbler"): the crown of the head bare skin, a thick
 * grey fringe ring round the sides and back of the head and a short grey beard over the jaw. In head half-extents (x across, y up, z ahead):
 * fringe TONSURE.ring of the head round its sides and back (the front TONSURE.open rad either side of the face left bare), its middle TONSURE.y of the
 * half-height above the head's middle, TONSURE.thick of the head height thick, standing TONSURE.out past the skull; beard TONSURE.beard: .wide of the
 * head across, .down head heights below the chin, .deep of the half-depth thick; both TONSURE.grey, self-lit .glow so the grey stays grey in the sky light.
 */
const TONSURE = {
  ring: 1.0, open: 0.95, y: 0.18, thick: 0.26, out: 1.06, jitter: 0.12,
  beard: { wide: 1.0, down: 0.22, deep: 0.55 }, grey: new Color3(0.66, 0.64, 0.62), glow: 0.15,
};

function healerTonsure(scene: Scene, body: ArticulatedBody): Mesh[] {
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const T = TONSURE;
  const hair = getMaterialFactory().get("cloth", T.grey, { emissiveIntensity: T.glow });
  const path: Vector3[] = [];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const phi = T.open + (i / steps) * (2 * Math.PI - 2 * T.open); // round the back from one temple to the other; 0 is the face
    path.push(new Vector3(Math.sin(phi) * e.x * T.out, e.y * T.y, Math.cos(phi) * e.z * T.out));
  }
  const fringe = MeshBuilder.CreateTube("tonsureFringe", {
    path, tessellation: 6, cap: Mesh.CAP_ALL, radiusFunction: () => e.y * T.thick,
  }, scene);
  fringe.convertToFlatShadedMesh();
  fringe.material = hair;
  fringe.parent = body.headMesh;

  const B = T.beard;
  const tall = e.y * 0.75 + e.y * 2 * B.down;
  const beard = MeshBuilder.CreateIcoSphere("tonsureBeard", { radius: 1, subdivisions: 1, flat: true }, scene);
  jitterVertices(beard, T.jitter, 21.7, e.x * 1.08 * B.wide, tall * 0.5, e.z * B.deep);
  beard.position.set(0, -e.y * 0.1 - tall * 0.5, e.z * 0.85);
  beard.material = hair;
  beard.parent = body.headMesh;
  return [fringe, beard];
}

/** Every medieval unit's own dress; an empty list for a unit with none. */
export function dressMedieval(scene: Scene, body: ArticulatedBody, unitId: string): Mesh[] {
  switch (unitId) {
    case "medieval.healer": return healerTonsure(scene, body);
    default: return [];
  }
}
