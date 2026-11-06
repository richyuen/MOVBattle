import { Color3, Mesh, MeshBuilder, Scene, type Material, type TransformNode } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { limbBox } from "./medievalDress";

/** [S] 483, good.celestial_aegis.red.png: white hair frames the temples,
 * with a short tied braid behind. The team butterfly has two upright oval
 * wings (~1.4 head heights) and two smaller horizontal lower wings; its full
 * span is about 2.8 head widths. All four are solid flattened faceted lobes. */
export function aegisButterflyHair(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const head = body.headMesh, box = head.getBoundingInfo().boundingBox;
  const W = box.extendSize.x * 2, H = box.extendSize.y * 2, D = box.extendSize.z * 2, c = box.center;
  const white = new Color3(0.85, 0.88, 0.95);
  const hair = getMaterialFactory().get("unlit", white, { emissive: white });
  const wing = getMaterialFactory().get("cloth", team, { emissive: team.scale(0.12) });
  const out: Mesh[] = [];
  const put = (mesh: Mesh, material: Material, x: number, y: number, z: number): Mesh => {
    mesh.parent = head; mesh.position.set(c.x + x, c.y + y, c.z + z); mesh.material = material;
    mesh.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(mesh);
    out.push(mesh); return mesh;
  };
  put(MeshBuilder.CreateSphere("aegisWhiteCrown", { diameterX: W * 1.12, diameterY: H * 0.4, diameterZ: D * 1.1, segments: 6 }, scene), hair, 0, H * 0.47, 0);
  for (const side of [-1, 1]) {
    put(MeshBuilder.CreateBox("aegisWhiteTemple", { width: W * 0.17, height: H * 0.6, depth: D * 0.8 }, scene), hair, side * W * 0.49, H * 0.13, -D * 0.1);
    const upper = put(MeshBuilder.CreateSphere("aegisButterflyUpperWing", {
      diameterX: W * 0.78, diameterY: H * 1.32, diameterZ: W * 0.13, segments: 6,
    }, scene), wing, side * W * 0.79, H * 0.95, -D * 0.44);
    upper.rotation.z = side * -0.6;
    const lower = put(MeshBuilder.CreateSphere("aegisButterflyLowerWing", {
      diameterX: W * 1.03, diameterY: H * 0.4, diameterZ: W * 0.14, segments: 6,
    }, scene), wing, side * W * 0.9, H * 0.18, -D * 0.43);
    lower.rotation.z = side * 0.16;
    const antenna = put(MeshBuilder.CreateCylinder("aegisButterflyAntenna", {
      height: H * 0.65, diameterTop: W * 0.025, diameterBottom: W * 0.045, tessellation: 5,
    }, scene), wing, side * W * 0.13, H * 1.02, -D * 0.42);
    antenna.rotation.z = side * -0.2;
  }
  for (let k = 0; k < 4; k++) {
    put(MeshBuilder.CreateSphere("aegisWhiteBraid", { diameterX: W * (0.24 - k * 0.025), diameterY: H * 0.22, diameterZ: D * 0.24, segments: 4 }, scene), hair,
      k % 2 ? W * 0.025 : -W * 0.025, -H * (0.05 + k * 0.16), -D * 0.55);
  }
  put(MeshBuilder.CreateBox("aegisBraidTie", { width: W * 0.22, height: H * 0.08, depth: D * 0.25 }, scene), wing, 0, -H * 0.4, -D * 0.55);
  return out;
}

/** [S] 483, good.devout_gauntlet.red.png: each beige trouser leg expands
 * continuously from the hip to a broad ankle hem, with a slim team border.
 * Two articulated six-sided frusta meet at the knee; ankle width is 2.2 thigh
 * widths, knee 1.55, waistband 1.06 pelvis widths, bare team toes below it.
 * The waist cloth folds upward in two points above its team securing band. */
export function devoutTrousers(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const beige = new Color3(0.8, 0.72, 0.56);
  const cloth = getMaterialFactory().get("unlit", beige, { emissive: beige });
  const trim = getMaterialFactory().get("cloth", team, { emissive: team.scale(0.12) });
  const out: Mesh[] = [];
  const put = (mesh: Mesh, parent: TransformNode, mat: Material, y: number): Mesh => {
    mesh.parent = parent; mesh.position.y = y; mesh.material = mat;
    mesh.convertToFlatShadedMesh();
    scene.getGlowLayerByName("glow")?.addExcludedMesh(mesh);
    out.push(mesh); return mesh;
  };
  for (const [hip, thigh, knee, shin] of [
    [body.leftHip, body.leftUpperLeg, body.leftKnee, body.leftLowerLeg],
    [body.rightHip, body.rightUpperLeg, body.rightKnee, body.rightLowerLeg],
  ] as const) {
    const T = limbBox(thigh), S = limbBox(shin);
    const width = T.wide * 2.15;
    const upperH = -knee.position.y;
    const lowerH = S.half * 1.7;
    const upper = put(MeshBuilder.CreateCylinder("devoutTrouserThigh", {
      height: upperH, diameterTop: width * 1.08, diameterBottom: width * 1.55, tessellation: 6,
    }, scene), hip, cloth, -upperH * 0.5);
    upper.scaling.z = 0.83;
    const lower = put(MeshBuilder.CreateCylinder("devoutTrouserFlare", {
      height: lowerH, diameterTop: width * 1.55, diameterBottom: width * 2.2, tessellation: 6,
    }, scene), knee, cloth, -lowerH * 0.5 + 0.015);
    lower.scaling.z = 0.83;
    const hemH = lowerH * 0.055;
    const hem = put(MeshBuilder.CreateCylinder("devoutTrouserTeamHem", {
      height: hemH, diameterTop: width * 2.18, diameterBottom: width * 2.22, tessellation: 6,
    }, scene), knee, trim, -lowerH + hemH * 0.5 + 0.015);
    hem.scaling.z = 0.83;
    for (const mesh of knee.getChildMeshes(true)) {
      if (/_[lr]FootM$/.test(mesh.name)) mesh.material = body.skinMaterial;
    }
  }
  const pelvis = body.hip.getChildMeshes(true).find(m => m.name.endsWith("_pelvis"));
  if (pelvis instanceof Mesh) {
    pelvis.material = cloth;
    const P = limbBox(pelvis), W = P.wide * 2.12, D = P.deep * 2.18;
    put(MeshBuilder.CreateBox("devoutTrouserWaistband", { width: W, height: P.half * 0.38, depth: D }, scene), body.hip, trim, P.mid + P.half * 0.65);
    for (const side of [-1, 1]) {
      const fold = put(MeshBuilder.CreateCylinder("devoutTrouserWaistFold", {
        height: P.half * 1.55, diameterTop: 0, diameterBottom: W * 0.6, tessellation: 4,
      }, scene), body.hip, cloth, P.mid + P.half * 1.2);
      fold.scaling.z = D / W;
      fold.position.x = side * W * 0.29;
      fold.rotation.z = side * -0.28;
    }
  }
  return out;
}
