import { Color3, FresnelParameters, MeshBuilder, StandardMaterial, TransformNode } from "@babylonjs/core";
import { TEAM_COLORS } from "../data/factionColors";
import type { RuntimeUnit } from "../units/runtimeUnit";

/** [S] 488 Aegis Shield (good.celestial_aegis.red.png, card Appearance): it
 * stands round her from spawn, not only once the battle runs. Spec: a
 * see-through sphere 6 m across (three units), centred 1.7 m up, clear where
 * it faces the eye and fading to a pale yellow rim at its silhouette (an
 * opacity and emissive fresnel, no drawn rings); no collision with bodies.
 * Built once per unit: a second call returns the field already on her root. */
export function aegisField(root0: TransformNode): TransformNode {
  const had = root0.getChildren().find(n => n.name === "aegisField");
  if (had instanceof TransformNode) return had;
  const scene = root0.getScene(), root = new TransformNode("aegisField", scene);
  root.parent = root0; root.position.y = 1.7;
  const glass = new StandardMaterial("aegisGlass",scene);
  glass.diffuseColor = new Color3(1,.86,.32); glass.emissiveColor = Color3.White();
  // only the outer shell: its inner faces read their fresnel as all rim and filled the bubble brown (look 488)
  // the opacity fresnel ADDS to alpha (Babylon: alpha += right*(1-t) + left*t), so the base is ~0: .04 face-on, ~.5 at the rim
  glass.alpha=.01; glass.backFaceCulling=true; glass.disableLighting=true;
  glass.opacityFresnelParameters = new FresnelParameters({ leftColor: new Color3(.5,.5,.5), rightColor: new Color3(.03,.03,.03), bias: 0, power: 3 });
  // the emissive is multiplied by the fresnel colour: pale yellow at the rim, near white face-on
  glass.emissiveFresnelParameters = new FresnelParameters({ leftColor: new Color3(1,.88,.45), rightColor: new Color3(1,.96,.8), bias: 0, power: 2 });
  const sphere=MeshBuilder.CreateSphere("aegisTransparentField",{diameter:6,segments:24},scene);
  sphere.parent=root;sphere.material=glass;sphere.isPickable=false;
  scene.getGlowLayerByName("glow")?.addExcludedMesh(sphere);
  return root;
}

/** Six team-light satellites float inside the field at chest height (from spawn; the battle spins them). */
export function aegisOrbits(root0: TransformNode, team: Color3): TransformNode {
  const had = root0.getChildren().find(n => n.name === "aegisOrbit");
  if (had instanceof TransformNode) return had;
  const scene=root0.getScene(),root=new TransformNode("aegisOrbit",scene);
  root.parent=root0;root.position.y=1.7;
  const mat=new StandardMaterial("aegisOrbitLight",scene);
  mat.emissiveColor=team.scale(1.6);mat.disableLighting=true;
  for(let k=0;k<6;k++) {
    const a=k*Math.PI/3,orb=MeshBuilder.CreateIcoSphere("aegisOrbitOrb",{radius:.17,subdivisions:1},scene);
    orb.parent=root;orb.position.set(Math.sin(a)*1.8,Math.sin(a*2)*.45,Math.cos(a)*1.8);orb.material=mat;
  }
  return root;
}

/** [S] 485 Shockwave Hammer (card Characteristics: "summon a giant glowing
 * hammer on top of enemy units, in which will smash down"). Spec: a pale-gold
 * see-through hammer about 1.5 men tall: haft 2.6 m, head 1.5 x .8 x .8 m with
 * brighter faces, hinged at the haft's foot (the returned node's origin) and
 * standing along its +Y; the caller swings the hinge's x rotation. */
export function paladinGiantHammer(unit: RuntimeUnit): TransformNode {
  const scene = unit.body.root.getScene(), hinge = new TransformNode("paladinHammerHinge", scene);
  const glow = new StandardMaterial("paladinHammerGlow", scene);
  glow.emissiveColor = new Color3(1, .86, .45); glow.alpha = .78; glow.disableLighting = true;
  const face = new StandardMaterial("paladinHammerFace", scene);
  face.emissiveColor = new Color3(1.25, 1.15, .8); face.alpha = .9; face.disableLighting = true;
  const haft = MeshBuilder.CreateCylinder("paladinGiantHaft", { height: 2.6, diameter: .2, tessellation: 6 }, scene);
  haft.parent = hinge; haft.position.y = 1.3; haft.material = glow;
  const head = MeshBuilder.CreateBox("paladinGiantHead", { width: .8, height: .8, depth: 1.5 }, scene);
  head.parent = hinge; head.position.y = 2.6; head.material = glow;
  for (const side of [-1, 1]) {
    const plate = MeshBuilder.CreateBox("paladinGiantFace", { width: .62, height: .62, depth: .06 }, scene);
    plate.parent = head; plate.position.z = side * .76; plate.material = face;
  }
  return hinge;
}

/** [S] 486 Chronomancer Transformation (good.chronomancer.png): bright white
 * and pale-gold cubes drift round the transformed man. Spec: ten cubes .14-.26
 * m, on a 1.4 m circle round his root, at .3-2.1 m, every second one gold;
 * the caller turns the node. */
export function chronoLights(unit: RuntimeUnit): TransformNode {
  const scene = unit.body.root.getScene(), root = new TransformNode("chronoLights", scene);
  root.parent = unit.body.root;
  const white = new StandardMaterial("chronoLightWhite", scene);
  white.emissiveColor = new Color3(1.3, 1.3, 1.2); white.disableLighting = true;
  const gold = new StandardMaterial("chronoLightGold", scene);
  gold.emissiveColor = new Color3(1.2, .95, .4); gold.disableLighting = true;
  for (let k = 0; k < 10; k++) {
    const a = k * Math.PI * 2 / 10, size = .14 + (k % 3) * .06;
    const cube = MeshBuilder.CreateBox("chronoLightCube", { size }, scene);
    cube.parent = root; cube.position.set(Math.sin(a) * 1.4, .3 + ((k * 7) % 10) * .2, Math.cos(a) * 1.4);
    cube.rotation.set(k * .7, k * 1.1, k * .4); cube.material = k % 2 ? gold : white;
  }
  return root;
}

/** The lit ring of the transformed Chronomancer: the gold turns to glowing gold-white. */
export function chronoRingLit(scene: import("@babylonjs/core").Scene): StandardMaterial {
  const lit = new StandardMaterial("chronoRingLit", scene);
  lit.emissiveColor = new Color3(1.35, 1.1, .55); lit.disableLighting = true;
  return lit;
}
