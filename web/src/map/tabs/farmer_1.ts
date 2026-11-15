// TABS "Farmer 1" (farmer map): a river runs down the middle of the island from the back rim, under a stone bridge at the centre, and drops
// off the front rim as a waterfall beside the watermill (reference/maps/wiki/farmer_1.png, reference/maps/farm_1.png).
// Spec read off farm_1.png: the team centre line runs down the river, so the river follows x = 0 with a gentle bend, about 4 m wide, from
// z = +48 (back rim) to z = -48 (front rim); the crossing is at the centre (z = 0), 8 m clear. The water kills like any water hazard; it stays
// inside |x| < 4 so both team zones (|x| >= 5) stay dry. Built on campaign.introduction (base()).
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { HazardRegion } from "../hazards";
import type { Obstacle } from "../obstacles";

const RIVER = { halfWidth: 2, bend: 1.4, bendRate: 0.075, back: 48, front: -48, crossing: 4, step: 8, fall: 16 };

/** The river's centre line: x at depth z */
export function riverX(z: number): number {
  return RIVER.bend * Math.sin(z * RIVER.bendRate);
}

function riverHazards(): HazardRegion[] {
  const out: HazardRegion[] = [];
  for (const side of [1, -1]) {
    for (let z0 = RIVER.crossing; z0 < RIVER.back; z0 += RIVER.step) {
      const z1 = Math.min(z0 + RIVER.step, RIVER.back);
      const zc = side * (z0 + z1) / 2;
      out.push({ shape: "box", kind: "water", center: new Vector3(riverX(zc), 0, zc), halfX: RIVER.halfWidth, halfZ: (z1 - z0) / 2 });
    }
  }
  return out;
}

function riverMeshes(scene: Scene): void {
  const water = new StandardMaterial("farmer1River", scene);
  water.diffuseColor = new Color3(0.34, 0.52, 0.78);
  water.emissiveColor = new Color3(0.08, 0.14, 0.24);
  water.specularColor = new Color3(0.25, 0.25, 0.3);
  const bank = new StandardMaterial("farmer1RiverBank", scene);
  bank.diffuseColor = new Color3(0.42, 0.38, 0.3);
  bank.specularColor = new Color3(0.03, 0.03, 0.03);
  const foam = new StandardMaterial("farmer1Fall", scene);
  foam.diffuseColor = new Color3(0.86, 0.92, 0.98);
  foam.emissiveColor = new Color3(0.3, 0.34, 0.38);
  foam.specularColor = Color3.Black();

  const strip = (name: string, half: number, y: number, mat: StandardMaterial) => {
    const left: Vector3[] = [], right: Vector3[] = [];
    for (let z = RIVER.back + 1; z >= RIVER.front - 0.5; z -= 1) {
      left.push(new Vector3(riverX(z) - half, y, z));
      right.push(new Vector3(riverX(z) + half, y, z));
    }
    const mesh = MeshBuilder.CreateRibbon(name, { pathArray: [left, right], sideOrientation: Mesh.DOUBLESIDE }, scene);
    mesh.material = mat;
    mesh.receiveShadows = true;
    mesh.isPickable = false;
  };
  strip("farmer1RiverBank", RIVER.halfWidth + 0.7, 0.05, bank);
  strip("farmer1River", RIVER.halfWidth, 0.08, water);

  // The waterfall: a sheet of white water off the front rim, widening as it falls, with a churned lip
  const x = riverX(RIVER.front);
  const fall = MeshBuilder.CreateCylinder("farmer1Waterfall", {
    diameterTop: RIVER.halfWidth * 2.2, diameterBottom: RIVER.halfWidth * 3.4, height: RIVER.fall, tessellation: 7,
  }, scene);
  fall.scaling.z = 0.45;
  fall.position.set(x, -RIVER.fall / 2 + 0.05, RIVER.front - 0.6);
  fall.convertToFlatShadedMesh();
  fall.material = foam;
  fall.isPickable = false;
  for (let i = 0; i < 4; i++) {
    const lump = MeshBuilder.CreateSphere("farmer1Foam", { diameter: 1.6 + (i % 2) * 0.6, segments: 2 }, scene);
    lump.scaling.y = 0.55;
    lump.position.set(x - 1.8 + i * 1.2, 0.05, RIVER.front + 0.2 - (i % 2) * 0.5);
    lump.convertToFlatShadedMesh();
    lump.material = foam;
    lump.isPickable = false;
  }
}

/** The arched stone bridge over the crossing: a low deck the width of the gap, a stone arch under each face, a parapet along each side */
const BRIDGE = { span: 10, width: 6, deck: 0.12, rise: 1.1, parapet: 0.7 };

function stoneBridge(scene: Scene): Obstacle[] {
  const stone = new StandardMaterial("farmer1BridgeStone", scene);
  stone.diffuseColor = new Color3(0.64, 0.62, 0.58);
  stone.emissiveColor = new Color3(0.07, 0.07, 0.07);
  stone.specularColor = new Color3(0.04, 0.04, 0.04);
  const x = riverX(0);
  const parts: Mesh[] = [];
  const deck = MeshBuilder.CreateBox("farmer1BridgeDeck", { width: BRIDGE.span, height: 0.3, depth: BRIDGE.width }, scene);
  deck.position.set(x, BRIDGE.deck - 0.15, 0);
  parts.push(deck);
  // Each face is a ring of voussoirs over the water: an arch read from the banks
  for (const side of [-1, 1]) {
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (i + 0.5) / n;
      const block = MeshBuilder.CreateBox("farmer1BridgeArch", { width: 1.15, height: 0.5, depth: 0.5 }, scene);
      block.position.set(x - Math.cos(a) * (BRIDGE.span / 2 - 1.6), Math.sin(a) * BRIDGE.rise - 0.55, side * (BRIDGE.width / 2 - 0.25));
      block.rotation.z = -Math.cos(a) * 0.9;
      parts.push(block);
    }
    // Parapet: a hump of rough blocks, highest over the middle
    for (let i = 0; i < 8; i++) {
      const along = -BRIDGE.span / 2 + 0.6 + i * ((BRIDGE.span - 1.2) / 7);
      const h = BRIDGE.parapet + 0.35 * Math.cos((along / BRIDGE.span) * Math.PI);
      const block = MeshBuilder.CreateBox("farmer1BridgeParapet", { width: 1.2, height: h, depth: 0.55 }, scene);
      block.position.set(x + along, h / 2, side * (BRIDGE.width / 2 - 0.1));
      block.rotation.y = (i % 2 - 0.5) * 0.08;
      parts.push(block);
    }
  }
  const bridge = Mesh.MergeMeshes(parts, true);
  if (bridge) {
    bridge.name = "farmer1Bridge";
    bridge.convertToFlatShadedMesh();
    bridge.material = stone;
    bridge.receiveShadows = true;
    bridge.isPickable = false;
  }
  return [-1, 1].map((side) => ({
    type: "box" as const, center: new Vector3(x, 0, side * (BRIDGE.width / 2 - 0.1)), halfX: BRIDGE.span / 2, halfZ: 0.3,
  }));
}

/**
 * The watermill farmhouse straddling the river at the front rim (farm_1.png): two timber houses either side of the water, blue-grey
 * board walls in a brown frame under steep plank gables, and a big waterwheel turning in the river between them.
 */
const MILL = { z: -41, gap: 2.6, width: 8, depth: 8, wall: 5, roof: 4, wheel: 6.4 };

function watermill(scene: Scene): Obstacle[] {
  const mat = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = new Color3(0.03, 0.03, 0.03);
    return m;
  };
  const boards = mat("farmer1MillBoards", new Color3(0.44, 0.48, 0.58), 0.12);
  const timber = mat("farmer1MillTimber", new Color3(0.5, 0.36, 0.22), 0.15);
  const x0 = riverX(MILL.z);
  const walls: Mesh[] = [], wood: Mesh[] = [];
  const obstacles: Obstacle[] = [];
  for (const side of [-1, 1]) {
    const cx = x0 + side * (MILL.gap + MILL.width / 2);
    const body = MeshBuilder.CreateBox("farmer1MillBody", { width: MILL.width, height: MILL.wall, depth: MILL.depth }, scene);
    body.position.set(cx, MILL.wall / 2, MILL.z);
    walls.push(body);
    // Frame: corner posts, a sill beam and a beam under the eaves
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const post = MeshBuilder.CreateBox("farmer1MillPost", { width: 0.45, height: MILL.wall, depth: 0.45 }, scene);
      post.position.set(cx + dx * MILL.width / 2, MILL.wall / 2, MILL.z + dz * MILL.depth / 2);
      wood.push(post);
    }
    for (const y of [0.3, MILL.wall - 0.2]) {
      const beam = MeshBuilder.CreateBox("farmer1MillBeam", { width: MILL.width + 0.5, height: 0.35, depth: MILL.depth + 0.5 }, scene);
      beam.position.set(cx, y, MILL.z);
      wood.push(beam);
    }
    // A steep gable roof running along z, overhanging the walls
    const roof = MeshBuilder.CreateCylinder("farmer1MillRoof", { diameter: MILL.width * 1.25, height: MILL.depth + 1.4, tessellation: 3 }, scene);
    // Turn one corner of the triangle to -z and bake, then tip the prism's axis onto z: that corner becomes the ridge, straight up
    roof.rotation.y = Math.PI / 2;
    roof.bakeCurrentTransformIntoVertices();
    roof.rotation.x = Math.PI / 2;
    const tall = MILL.roof / (MILL.width * 1.25 * 0.75); // the triangle is 1.5 circumradii tall
    roof.scaling.set(1, 1, tall);
    roof.position.set(cx, MILL.wall + MILL.width * 1.25 * 0.25 * tall, MILL.z);
    wood.push(roof);
    obstacles.push({ type: "box", center: new Vector3(cx, 0, MILL.z), halfX: MILL.width / 2, halfZ: MILL.depth / 2 });
  }
  // The waterwheel in the river between the houses: rim, hub and paddles, its axle across the river
  const wheel = MeshBuilder.CreateTorus("farmer1MillWheel", { diameter: MILL.wheel, thickness: 0.5, tessellation: 12 }, scene);
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(x0, MILL.wheel / 2 - 0.6, MILL.z - 1);
  wood.push(wheel);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const paddle = MeshBuilder.CreateBox("farmer1MillPaddle", { width: 1.6, height: 0.2, depth: MILL.wheel * 0.55 }, scene);
    paddle.rotation.x = a;
    paddle.position.set(x0, MILL.wheel / 2 - 0.6 + Math.sin(a) * MILL.wheel * 0.24, MILL.z - 1 + Math.cos(a) * MILL.wheel * 0.24);
    wood.push(paddle);
  }
  const axle = MeshBuilder.CreateCylinder("farmer1MillAxle", { diameter: 0.5, height: MILL.gap * 2 + 0.4, tessellation: 6 }, scene);
  axle.rotation.z = Math.PI / 2;
  axle.position.set(x0, MILL.wheel / 2 - 0.6, MILL.z - 1);
  wood.push(axle);
  for (const [list, m, name] of [[walls, boards, "farmer1MillWalls"], [wood, timber, "farmer1MillWood"]] as const) {
    const merged = Mesh.MergeMeshes(list, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = m;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  return obstacles;
}

export function buildFarmer1(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  riverMeshes(scene);
  const hazards = [...result.hazards, ...riverHazards()];
  // Nothing the base put down may stand in the water
  const obstacles = result.obstacles.filter((o) => Math.abs(o.center.x - riverX(o.center.z)) > RIVER.halfWidth + 1.5);
  obstacles.push(...stoneBridge(scene));
  obstacles.push(...watermill(scene));
  return { ...result, hazards, obstacles };
}
