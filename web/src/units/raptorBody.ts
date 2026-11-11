import { Color3, Mesh, MeshBuilder, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

export function dressRaptorBody(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  for (const mesh of body.allMeshes) mesh.isVisible = false;
  const mf = getMaterialFactory();
  const skinColor = new Color3(0.17, 0.14, 0.09);
  const skin = mf.get("cloth", skinColor, { emissive: skinColor.scale(0.12) });
  const dark = mf.get("cloth", skinColor.scale(0.55));
  const feathers = mf.get("cloth", team.scale(0.65));
  const eye = mf.get("unlit", new Color3(0.92, 0.86, 0.72), { emissive: new Color3(0.92, 0.86, 0.72) });
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
  jaw.rotation.x = 0.46;
  shape("raptorJaw", jaw, v(0, -0.04, 0.21), v(0.18, 0.08, 0.29), dark);
  for (const side of [-1, 1]) {
    shape("raptorEye", skull, v(side * 0.21, 0.09, 0.10), v(0.07, 0.09, 0.09), eye);
    shape("raptorPupil", skull, v(side * 0.259, 0.09, 0.12), v(0.029, 0.05, 0.05), dark);
    shape("raptorCrest", skull, v(side * 0.14, 0.17, -0.11), v(0.075, 0.10, 0.22), feathers, -0.37);
    shape("raptorForeleg", torso, v(side * 0.18, 0.03, 0.47), v(0.065, 0.18, 0.07), dark, -0.48);
  }
  for (const [hip, knee] of [[body.leftHip, body.leftKnee], [body.rightHip, body.rightKnee]]) {
    const shin = body.leftLowerLeg.getBoundingInfo().boundingBox;
    shape("raptorThigh", hip, v(0, knee.position.y * 0.32 / scale, 0.04), v(0.16, 0.28, 0.19));
    shape("raptorShin", knee, shin.center.scale(1 / scale), v(0.09, shin.extendSize.y / scale, 0.10), dark);
    shape("raptorFoot", knee, v(0, shin.minimum.y / scale, 0.095), v(0.11, 0.068, 0.19), dark);
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
