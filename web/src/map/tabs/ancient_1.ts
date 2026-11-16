import { Color3, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

// The placement reference shows a long rectangular slab. Two four-metre streets run along it
// between low blocks, with a cross street and an open plaza around each end of the building rows.
const LENGTH = 112;
const WIDTH = 72;
const BLOCK_LENGTH = 18;

export function buildAncient1(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  for (const mesh of scene.meshes) {
    if (!prior.has(mesh) && !mesh.name.startsWith("cloud")) mesh.setEnabled(false);
  }
  const stone = new StandardMaterial("ancient1Pavement", scene);
  stone.diffuseColor = new Color3(0.53, 0.56, 0.62);
  stone.emissiveColor = stone.diffuseColor.scale(0.15);
  const earth = new StandardMaterial("ancient1Island", scene);
  earth.diffuseColor = new Color3(0.49, 0.29, 0.23);
  earth.emissiveColor = earth.diffuseColor.scale(0.24);
  const lime = new StandardMaterial("ancient1Limestone", scene);
  lime.diffuseColor = new Color3(0.84, 0.81, 0.7);
  lime.emissiveColor = lime.diffuseColor.scale(0.13);
  const slab = MeshBuilder.CreateBox("ancient1RectangularIsland", { width: LENGTH + 1.5, height: 11, depth: WIDTH + 1.5 }, scene);
  slab.position.y = -6.05;
  slab.material = earth;
  const pavement = MeshBuilder.CreateBox("ancient1Pavement", { width: LENGTH, height: 0.55, depth: WIDTH }, scene);
  pavement.position.y = -0.275;
  pavement.material = stone;
  pavement.receiveShadows = true;
  for (const z of [-34.5, -12, -8, 8, 12, 34.5]) {
    const seam = MeshBuilder.CreateBox("ancient1LongSeam", { width: LENGTH - 0.5, height: 0.025, depth: 0.13 }, scene);
    seam.position.set(0, 0.01, z);
    seam.material = lime;
    seam.isPickable = false;
  }
  for (const x of [-42, -26, 0, 26, 42]) {
    const seam = MeshBuilder.CreateBox("ancient1CrossSeam", { width: 0.13, height: 0.025, depth: WIDTH - 0.5 }, scene);
    seam.position.set(x, 0.011, 0);
    seam.material = lime;
    seam.isPickable = false;
  }
  for (const x of [-15, 15]) {
    for (const [z, depth] of [[-21, 18], [0, 16], [21, 18]]) {
      const block = MeshBuilder.CreateBox("ancient1StreetBlock", { width: BLOCK_LENGTH, height: 0.22, depth }, scene);
      block.position.set(x, 0.07, z);
      block.material = lime;
      block.receiveShadows = true;
    }
  }
  const obstacles: MapBuildResult["obstacles"] = [];
  for (const z of [7, 13]) {
    const pier = MeshBuilder.CreateBox("ancient1ArchPier", { width: 1.6, height: 4.6, depth: 1.15 }, scene);
    pier.position.set(0, 2.3, z);
    pier.material = lime;
    obstacles.push({ type: "box", center: new Vector3(0, 0, z), halfX: 0.8, halfZ: 0.575 });
  }
  for (let i = 0; i <= 8; i++) {
    const angle = Math.PI * i / 8;
    const block = MeshBuilder.CreateBox("ancient1ArchStone", { width: 1.6, height: 0.8, depth: 1.3 }, scene);
    block.position.set(0, 4.2 + Math.sin(angle) * 3, 10 + Math.cos(angle) * 3);
    block.rotation.x = -angle;
    block.material = lime;
  }
  return {
    ...result,
    zones: result.zones.map((zone) => ({ ...zone, center: new Vector3(Math.sign(zone.center.x) * 40, 0, 0), size: new Vector3(30, zone.size.y, 40) })),
    obstacles,
    hazards: [],
  };
}
