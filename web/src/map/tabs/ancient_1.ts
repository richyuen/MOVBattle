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
  const plaster = new StandardMaterial("ancient1Whitewash", scene);
  plaster.diffuseColor = new Color3(0.95, 0.92, 0.81);
  plaster.emissiveColor = plaster.diffuseColor.scale(0.23);
  const blue = new StandardMaterial("ancient1BlueTile", scene);
  blue.diffuseColor = new Color3(0.26, 0.5, 0.78);
  blue.emissiveColor = blue.diffuseColor.scale(0.26);
  const box = (name: string, x: number, y: number, z: number, width: number, height: number, depth: number, material: StandardMaterial) => {
    const part = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
    part.position.set(x, y, z);
    part.material = material;
    part.receiveShadows = true;
  };
  const obstacles: MapBuildResult["obstacles"] = [];
  for (const side of [-1, 1]) {
    box("ancient1CityWall", 0, 0.67, side * 35, 111, 1.34, 0.82, plaster);
    box("ancient1CityWallCoping", 0, 1.38, side * 35, 111.3, 0.18, 1.02, blue);
    box("ancient1CityWall", side * 55, 0.67, 0, 0.82, 1.34, 70, plaster);
    box("ancient1CityWallCoping", side * 55, 1.38, 0, 1.02, 0.18, 70.3, blue);
    obstacles.push(
      { type: "box", center: new Vector3(0, 0, side * 35), halfX: 55.5, halfZ: 0.41 },
      { type: "box", center: new Vector3(side * 55, 0, 0), halfX: 0.41, halfZ: 35 },
    );
  }
  const foliage = new StandardMaterial("ancient1CypressLeaves", scene);
  foliage.diffuseColor = new Color3(0.39, 0.56, 0.18);
  foliage.emissiveColor = foliage.diffuseColor.scale(0.17);
  for (const [x, z] of [[-51, -32], [-32, -32], [30, -32], [50, -32], [-50, 32], [-25, 32], [25, 32], [50, 32]]) {
    const basin = MeshBuilder.CreateCylinder("ancient1CypressPlanter", { height: 0.5, diameter: 2.55, tessellation: 10 }, scene);
    basin.scaling.x = 1.78;
    basin.position.set(x, 0.25, z);
    basin.material = plaster;
    const soil = MeshBuilder.CreateCylinder("ancient1PlanterSoil", { height: 0.055, diameter: 2.29, tessellation: 10 }, scene);
    soil.scaling.x = 1.78;
    soil.position.set(x, 0.52, z);
    soil.material = earth;
    for (let i = -1; i <= 1; i++) {
      const crown = MeshBuilder.CreateCylinder("ancient1Cypress", { height: 3.2 + (1 - Math.abs(i)) * 1.2, diameterTop: 0.1, diameterBottom: 1.27, tessellation: 6 }, scene);
      crown.position.set(x + i * 1.1, i === 0 ? 2.69 : 2.08, z + i * 0.26);
      crown.rotation.z = -i * 0.12;
      crown.material = foliage;
    }
    obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: 2.19, halfZ: 1.26 });
  }
  for (const side of [-1, 1]) {
    for (const [row, z] of [-21, 0, 21].entries()) {
      const x = side * 15;
      const depth = row === 1 ? 10.5 : 12.5;
      const height = 2.8 + (row % 2) * 0.9;
      box("ancient1House", x, height / 2, z, 12, height, depth, plaster);
      box("ancient1RoofBand", x, height - 0.24, z, 12.3, 0.24, depth + 0.3, blue);
      box("ancient1RoofTerrace", x, height, z, 12.6, 0.36, depth + 0.55, plaster);
      const tx = x + side * 2.5, tz = z + (row === 1 ? -1.8 : 2.2);
      box("ancient1UpperRoom", tx, height + 1.1, tz, 5.1, 2.2, 5, plaster);
      box("ancient1UpperCoping", tx, height + 2.24, tz, 5.4, 0.27, 5.3, plaster);
      if ((row + (side > 0 ? 1 : 0)) % 2 === 0) {
        const dome = MeshBuilder.CreateSphere("ancient1BlueDome", { diameter: 5.1, segments: 8, slice: 0.5 }, scene);
        dome.position.set(tx, height + 2.3, tz);
        dome.material = blue;
        dome.convertToFlatShadedMesh();
      }
      for (const dz of [-3, 0, 3]) box("ancient1BlueShutter", x - side * 6.03, 1.52, z + dz, 0.12, 1.1, 0.78, blue);
      for (let i = 0; i < 8; i++) {
        const rise = height * (i + 1) / 8;
        box("ancient1RoofStep", x - side * (8.1 - 0.32 * i), rise / 2, z - depth * 0.32, 0.42, rise, 2.1, plaster);
      }
      obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: 6, halfZ: depth / 2 });
      obstacles.push({ type: "box", center: new Vector3(x - side * 7.1, 0, z - depth * 0.32), halfX: 1.25, halfZ: 1.05 });
    }
  }
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
