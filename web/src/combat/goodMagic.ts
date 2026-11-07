import { Color3, FresnelParameters, MeshBuilder, StandardMaterial, TransformNode } from "@babylonjs/core";
import { TEAM_COLORS } from "../data/factionColors";
import type { RuntimeUnit } from "../units/runtimeUnit";

/** [R] 489 Aegis Shield rebuild (good.celestial_aegis.red.png, reference/factions/good.jpg, card Appearance
 * "see through shield with a faded yellow border"; six team-coloured orbs inside).
 * Spec read off the renders:
 * - a sphere 6 m across (three units), centred 1.7 m up, standing from spawn; no collision with bodies.
 * - near-clear glass: everything behind and inside keeps its colour. Face-on alpha ~.02; the alpha stays
 *   under ~.1 out to 90% of the disc radius and climbs to ~.6 only in the last few percent: a thin rim.
 * - the rim is a faded pale yellow; face-on the (nearly invisible) tint is cream. No drawn rings.
 * - six soft orbs at chest height, ~1.8 m out, in the team colour lifted a quarter toward white,
 *   never over 1 in any channel (at 1.6x the blue team's orbs blew out white).
 * Babylon fresnel term t = |n.v|^power is 1 face-on and 0 at the silhouette; the opacity fresnel ADDS
 * left*(1-t) + right*t to alpha. A power under 1 keeps t near 1 until the very edge, so the rim is thin;
 * at power 3 (488) half the disc sat at alpha .2-.5 and read as an opaque amber wash.
 * Built once per unit: a second call returns the field already on her root. */
const AEGIS = { diameter: 6, lift: 1.7, power: .25, rimAlpha: .62, faceAlpha: .02,
  rim: new Color3(1, .82, .3), face: new Color3(1, .97, .86), orbs: 6, orbOut: 1.8, orbBob: .45, orbR: .17, orbWhite: .25 };
export function aegisField(root0: TransformNode): TransformNode {
  const had = root0.getChildren().find(n => n.name === "aegisField");
  if (had instanceof TransformNode) return had;
  const scene = root0.getScene(), root = new TransformNode("aegisField", scene);
  root.parent = root0; root.position.y = AEGIS.lift;
  const glass = new StandardMaterial("aegisGlass", scene);
  // all colour from the emissive (diffuse black, unlit), so the sun and the IBL never tint the glass
  glass.diffuseColor = Color3.Black(); glass.specularColor = Color3.Black(); glass.emissiveColor = Color3.White();
  glass.alpha = 0; glass.backFaceCulling = true; glass.disableLighting = true;
  const a = (v: number) => new Color3(v, v, v);
  glass.opacityFresnelParameters = new FresnelParameters({ leftColor: a(AEGIS.rimAlpha), rightColor: a(AEGIS.faceAlpha), bias: 0, power: AEGIS.power });
  glass.emissiveFresnelParameters = new FresnelParameters({ leftColor: AEGIS.rim, rightColor: AEGIS.face, bias: 0, power: AEGIS.power });
  // only the outer shell: inner faces would read their fresnel as all rim (look 488)
  const sphere = MeshBuilder.CreateSphere("aegisTransparentField", { diameter: AEGIS.diameter, segments: 32 }, scene);
  sphere.parent = root; sphere.material = glass; sphere.isPickable = false;
  scene.getGlowLayerByName("glow")?.addExcludedMesh(sphere);
  return root;
}

/** Six soft team-light satellites float inside the field at chest height (from spawn; the battle spins them). */
export function aegisOrbits(root0: TransformNode, team: Color3): TransformNode {
  const had = root0.getChildren().find(n => n.name === "aegisOrbit");
  if (had instanceof TransformNode) return had;
  const scene = root0.getScene(), root = new TransformNode("aegisOrbit", scene);
  root.parent = root0; root.position.y = AEGIS.lift;
  const mat = new StandardMaterial("aegisOrbitLight", scene);
  const tint = Color3.Lerp(team, Color3.White(), AEGIS.orbWhite);
  mat.diffuseColor = Color3.Black(); mat.specularColor = Color3.Black();
  mat.emissiveColor = new Color3(Math.min(1, tint.r), Math.min(1, tint.g), Math.min(1, tint.b)); mat.disableLighting = true;
  for (let k = 0; k < AEGIS.orbs; k++) {
    const ang = k * 2 * Math.PI / AEGIS.orbs, orb = MeshBuilder.CreateSphere("aegisOrbitOrb", { diameter: AEGIS.orbR * 2, segments: 8 }, scene);
    orb.parent = root; orb.position.set(Math.sin(ang) * AEGIS.orbOut, Math.sin(ang * 2) * AEGIS.orbBob, Math.cos(ang) * AEGIS.orbOut); orb.material = mat;
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
