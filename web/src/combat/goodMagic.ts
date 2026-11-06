import { Color3, MeshBuilder, StandardMaterial, TransformNode } from "@babylonjs/core";
import { TEAM_COLORS } from "../data/factionColors";
import type { RuntimeUnit } from "../units/runtimeUnit";

/** Aegis Shield: transparent enclosing sphere with a faded yellow border,
 * three ordinary units across (card Appearance); no collision with bodies. */
export function aegisField(unit: RuntimeUnit): TransformNode {
  const scene = unit.body.root.getScene(), root = new TransformNode("aegisField", scene);
  root.parent = unit.body.root; root.position.y = 1.7;
  const glass = new StandardMaterial("aegisGlass",scene);
  glass.diffuseColor = new Color3(1,.86,.32); glass.emissiveColor = new Color3(.35,.27,.06);
  glass.alpha=.055; glass.backFaceCulling=false; glass.disableLighting=true;
  const sphere=MeshBuilder.CreateSphere("aegisTransparentField",{diameter:6,segments:16},scene);
  sphere.parent=root;sphere.material=glass;
  const gold = new StandardMaterial("aegisFieldBorder",scene);
  gold.emissiveColor=new Color3(1,.78,.22); gold.alpha=.48; gold.disableLighting=true;
  for(const axis of [0,1]) {
    const ring=MeshBuilder.CreateTorus("aegisGoldBorder",{diameter:6,thickness:.035,tessellation:64},scene);
    ring.parent=root;ring.rotation.x=Math.PI/2;ring.rotation.y=axis*Math.PI/2;ring.material=gold;
  }
  return root;
}

/** Six team-light satellites orbit inside the field at chest height. */
export function aegisOrbits(unit: RuntimeUnit): TransformNode {
  const scene=unit.body.root.getScene(),root=new TransformNode("aegisOrbit",scene);
  root.parent=unit.body.root;root.position.y=1.7;
  const mat=new StandardMaterial("aegisOrbitLight",scene);
  mat.emissiveColor=(TEAM_COLORS[unit.team] ?? Color3.White()).scale(1.6);mat.disableLighting=true;
  for(let k=0;k<6;k++) {
    const a=k*Math.PI/3,orb=MeshBuilder.CreateIcoSphere("aegisOrbitOrb",{radius:.17,subdivisions:1},scene);
    orb.parent=root;orb.position.set(Math.sin(a)*1.8,Math.sin(a*2)*.45,Math.cos(a)*1.8);orb.material=mat;
  }
  return root;
}
