import { Color3, Mesh, MeshBuilder, Quaternion, Ray, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

/*
 * [S] 512 the Raptor's open mouth (card Appearance "a tongue corresponding to its team's colors"; secret.raptor.blue.png: the jaw hangs open on a
 * dark mouth with a team tongue between the white tooth rows; audit a.1). Spec in half-rig units: the jaw rests RAPTOR_MOUTH.jawRest rad open (the
 * bite closes it to .jawShut, runtimeUnit _updateRaptorBite); a near-black palate under the skull (.palate centre, .palateSize radii) and a
 * near-black floor on the jaw (.floor, .floorSize) fill the gap, and a flat team tongue (.tongue, .tongueSize) lies on the floor between the
 * lower tooth rows (x under .115), flat lit team colour out of the glow.
 */
export const RAPTOR_MOUTH = {
  jawRest: 0.68, jawShut: 0.04,
  palate: [0, -0.1, 0.24], palateSize: [0.13, 0.035, 0.19],
  floor: [0, 0.03, 0.22], floorSize: [0.12, 0.03, 0.2],
  tongue: [0, 0.055, 0.26], tongueSize: [0.085, 0.03, 0.2],
};

export function dressRaptorBody(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  for (const mesh of body.allMeshes) mesh.isVisible = false;
  const mf = getMaterialFactory();
  const skinColor = new Color3(0.17, 0.14, 0.09);
  const skin = mf.get("cloth", skinColor, { emissive: skinColor.scale(0.12) });
  const dark = mf.get("cloth", skinColor.scale(0.55));
  const feathers = mf.get("cloth", team.scale(0.65));
  const eye = mf.get("unlit", new Color3(0.92, 0.86, 0.72), { emissive: new Color3(0.92, 0.86, 0.72) });
  const claw = (parent: TransformNode, x: number, y: number, z: number, length: number, splay: number) => {
    const mesh = MeshBuilder.CreateCylinder("raptorClaw", {
      height: scale * length, diameterTop: 0, diameterBottom: scale * length * 0.67, tessellation: 3,
    }, scene);
    mesh.parent = parent;
    mesh.position.set(x * scale, y * scale, z * scale);
    mesh.rotation.x = Math.PI * 0.58;
    mesh.rotation.y = splay;
    mesh.material = eye;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(mesh);
    out.push(mesh);
  };
  const out: Mesh[] = [];
  const scale = body.metrics.overallHeight / 2;
  const shape = (name: string, parent: TransformNode, at: Vector3, size: Vector3, material = skin, pitch = 0) => {
    const mesh = MeshBuilder.CreateIcoSphere(name, { radius: scale, subdivisions: 1, flat: true }, scene);
    mesh.parent = parent;
    mesh.position.copyFrom(at.scale(scale));
    mesh.scaling.copyFrom(size);
    mesh.rotation.x = pitch;
    mesh.material = material;
    out.push(mesh);
    return mesh;
  };
  const v = (x: number, y: number, z: number) => new Vector3(x, y, z);
  const torso = body.hip;
  shape("raptorTrunk", torso, v(0, 0.12, -0.03), v(0.3, 0.32, 0.59), skin, 0.12);
  shape("raptorNeck", torso, v(0, 0.31, 0.40), v(0.19, 0.31, 0.26), skin, 0.44);
  const skull = new TransformNode("raptorSkullPivot", scene);
  skull.parent = torso;
  skull.position.copyFrom(v(0, 0.53, 0.52).scale(scale));
  shape("raptorSkull", skull, v(0, 0.05, 0.15), v(0.25, 0.22, 0.34), dark, -0.16);
  const jaw = new TransformNode("raptorJawPivot", scene);
  jaw.parent = skull;
  jaw.position.copyFrom(v(0, -0.03, 0.01).scale(scale));
  const M = RAPTOR_MOUTH;
  jaw.rotation.x = M.jawRest;
  shape("raptorJaw", jaw, v(0, -0.04, 0.21), v(0.18, 0.08, 0.29), dark);
  const throat = mf.get("cloth", new Color3(0.035, 0.02, 0.02), { roughness: 1 });
  const tongueColor = team.scale(0.85);
  const tongue = mf.get("unlit", tongueColor, { emissive: tongueColor });
  const glow = scene.getGlowLayerByName("glow");
  shape("raptorPalate", skull, v(M.palate[0], M.palate[1], M.palate[2]), v(M.palateSize[0], M.palateSize[1], M.palateSize[2]), throat);
  shape("raptorMouthFloor", jaw, v(M.floor[0], M.floor[1], M.floor[2]), v(M.floorSize[0], M.floorSize[1], M.floorSize[2]), throat);
  const tongueMesh = shape("raptorTongue", jaw, v(M.tongue[0], M.tongue[1], M.tongue[2]), v(M.tongueSize[0], M.tongueSize[1], M.tongueSize[2]), tongue);
  glow?.addExcludedMesh(tongueMesh);
  for (const side of [-1, 1]) {
    shape("raptorEye", skull, v(side * 0.21, 0.09, 0.10), v(0.07, 0.09, 0.09), eye);
    shape("raptorPupil", skull, v(side * 0.259, 0.09, 0.12), v(0.029, 0.05, 0.05), dark);
    shape("raptorCrest", skull, v(side * 0.14, 0.17, -0.11), v(0.075, 0.10, 0.22), feathers, -0.37);
    shape("raptorForeleg", torso, v(side * 0.18, 0.03, 0.47), v(0.065, 0.18, 0.07), dark, -0.48);
    claw(torso, side * 0.18, -0.106, 0.585, 0.095, side * 0.18);
  }
  for (const [hip, knee] of [[body.leftHip, body.leftKnee], [body.rightHip, body.rightKnee]]) {
    const shin = body.leftLowerLeg.getBoundingInfo().boundingBox;
    shape("raptorThigh", hip, v(0, knee.position.y * 0.32 / scale, 0.04), v(0.16, 0.28, 0.19));
    shape("raptorShin", knee, shin.center.scale(1 / scale), v(0.09, shin.extendSize.y / scale, 0.10), dark);
    shape("raptorFoot", knee, v(0, shin.minimum.y / scale, 0.095), v(0.11, 0.068, 0.19), dark);
    for (const toe of [-1, 1]) claw(knee, toe * 0.05, shin.minimum.y / scale - 0.01, 0.266, 0.123, toe * 0.19);
  }
  for (let i = 0; i < 5; i++) {
    const radius = 0.19 - i * 0.03;
    shape("raptorTail", torso, v(0, 0.12 + 0.019 * i * i, -0.49 - 0.19 * i),
      v(radius, radius, 0.19 - 0.009 * i), skin, 0.12 * i);
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const feather = shape("raptorTailFeather", torso,
        v(side * (0.075 - 0.013 * i), 0.36 + 0.062 * i, -1.14 - 0.1 * i),
        v(0.039, 0.092 - 0.013 * i, 0.17 - 0.018 * i), dark, 0.6);
      feather.rotation.y = side * 0.24;
    }
  }
  return out;
}

export function dressRaptorTeeth(scene: Scene, body: ArticulatedBody): Mesh[] {
  const skull = body.hip.getChildTransformNodes(true).find(node => node.name === "raptorSkullPivot");
  const jaw = skull?.getChildTransformNodes(true).find(node => node.name === "raptorJawPivot");
  if (!skull || !jaw) return [];
  const scale = body.metrics.overallHeight / 2;
  const ivory = new Color3(0.95, 0.9, 0.75);
  const enamel = getMaterialFactory().get("unlit", ivory, { emissive: ivory });
  const teeth: Mesh[] = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      for (const upper of [true, false]) {
        const tooth = MeshBuilder.CreateCylinder("raptorTooth", {
          height: scale * (0.093 - 0.011 * i), diameterTop: 0, diameterBottom: scale * 0.06, tessellation: 3,
        }, scene);
        tooth.parent = upper ? skull : jaw;
        tooth.position.set(side * scale * (0.115 + 0.014 * i), scale * (upper ? -0.103 : 0.029), scale * (0.385 - 0.061 * i));
        tooth.rotation.x = upper ? Math.PI + 0.22 : 0.22;
        tooth.material = enamel;
        scene.getGlowLayerByName("glow")?.addExcludedMesh(tooth);
        teeth.push(tooth);
      }
    }
  }
  return teeth;
}

/*
 * [S] 512 the Raptor's spine spots, seated on the real hide (secret.raptor.blue.png: small flat team triangles scattered along the spine from the
 * shoulders down onto the tail's root; audit a.2 "a clump of raised scute plates bunched over the shoulders"). The trunk is a coarse flat ico, so a
 * spot set on its ideal ellipsoid floats off the faces: each spot is instead dropped straight down (hip -y) onto the nearest raptorTrunk or
 * raptorTail face and laid along that face's normal. Spec in half-rig units: RAPTOR_SPOTS [z along the spine (shoulders +.38 to tail -.98), x
 * across, size, twist]; each a three-sided slab .tri x size across and .thick thick, sunk to .sink of its thickness, turned twist about the normal;
 * team cloth, a little self-lit, out of the glow.
 */
const RAPTOR_SPOT = { tri: 1.7, thick: 0.014, sink: 0.25, from: 1.2, hide: ["raptorTrunk", "raptorTail"] };
const RAPTOR_SPOTS: [number, number, number, number][] = [
  [0.36, 0.1, 0.06, 0.2], [0.3, -0.16, 0.07, -0.5], [0.2, 0.21, 0.07, 0.9], [0.12, -0.05, 0.075, 0.1], [0.04, -0.22, 0.07, 1.3],
  [-0.04, 0.13, 0.075, -0.3], [-0.14, -0.12, 0.07, 0.6], [-0.2, 0.23, 0.065, -0.9], [-0.3, 0.02, 0.07, 0.4], [-0.38, -0.2, 0.065, -0.2],
  [-0.48, 0.15, 0.06, 0.8], [-0.6, -0.06, 0.06, -0.6], [-0.72, 0.08, 0.05, 0.3], [-0.85, -0.04, 0.045, 1.0], [-0.97, 0.03, 0.04, -0.4],
];
export function dressRaptorSpots(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const S = RAPTOR_SPOT, scale = body.metrics.overallHeight / 2;
  const paint = getMaterialFactory().get("cloth", team, { emissive: team.scale(0.18), roughness: 1 });
  const glow = scene.getGlowLayerByName("glow");
  const hipW = body.hip.computeWorldMatrix(true).clone();
  const inv = hipW.clone().invert();
  const hide = body.hip.getChildMeshes(true).filter(mesh => S.hide.includes(mesh.name));
  for (const mesh of hide) mesh.computeWorldMatrix(true);
  const down = Vector3.TransformNormal(new Vector3(0, -1, 0), hipW).normalize();
  const out: Mesh[] = [];
  for (const [z, x, size, twist] of RAPTOR_SPOTS) {
    const ray = new Ray(Vector3.TransformCoordinates(new Vector3(x, S.from, z).scale(scale), hipW), down, scale * 4);
    let best: { at: Vector3; normal: Vector3; d: number } | null = null;
    for (const mesh of hide) {
      const pick = ray.intersectsMesh(mesh);
      const n = pick.hit ? pick.getNormal(true, true) : null;
      if (pick.hit && pick.pickedPoint && n && (!best || pick.distance < best.d)) best = { at: pick.pickedPoint, normal: n, d: pick.distance };
    }
    if (!best) continue;
    const at = Vector3.TransformCoordinates(best.at, inv);
    let normal = Vector3.TransformNormal(best.normal, inv).normalize();
    if (normal.y < 0) normal = normal.scale(-1);
    const thick = scale * S.thick;
    const spot = MeshBuilder.CreateCylinder("raptorSpot", { height: thick, diameter: scale * size * S.tri, tessellation: 3 }, scene);
    spot.parent = body.hip; spot.material = paint;
    spot.position.copyFrom(at.add(normal.scale(thick * (0.5 - S.sink))));
    const lay = Quaternion.FromUnitVectorsToRef(Vector3.Up(), normal, new Quaternion());
    spot.rotationQuaternion = lay.multiply(Quaternion.RotationAxis(Vector3.Up(), twist));
    spot.convertToFlatShadedMesh();
    glow?.addExcludedMesh(spot);
    out.push(spot);
  }
  return out;
}
