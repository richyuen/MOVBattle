import { Color3, MeshBuilder, StandardMaterial, TransformNode } from "@babylonjs/core";
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
