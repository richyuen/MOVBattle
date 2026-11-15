// TABS "Farmer 1" (farmer map): a river runs down the middle of the island from the back rim, under a stone bridge at the centre, and drops
// off the front rim as a waterfall beside the watermill (reference/maps/wiki/farmer_1.png, reference/maps/farm_1.png).
// Spec read off farm_1.png: the team centre line runs down the river, so the river follows x = 0 with a gentle bend, about 4 m wide, from
// z = +48 (back rim) to z = -48 (front rim); the crossing is at the centre (z = 0), 8 m clear. The water kills like any water hazard; it stays
// inside |x| < 4 so both team zones (|x| >= 5) stay dry. Built on campaign.introduction (base()).
import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
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

/**
 * The two red timber houses at the back rim, left of the river (wiki shot): dark red board walls in a brown frame, a steep plank gable
 * facing the field, a balcony with a rail across the front at the upper floor, lit yellow windows and a door. Spec: [x, z, wall height]:
 * a 6 m house at the back-left and a taller 7.5 m one nearer the river, each 7 m wide and 6 m deep; the ring trees on their footprint go.
 */
const HOUSES: Array<[number, number, number]> = [[-26, 36, 6], [-11, 39, 7.5]];
const HOUSE = { width: 7, depth: 6, roof: 4.2, balcony: 1.3 };

function redHouses(scene: Scene, obstacles: Obstacle[], built: Set<unknown>): Obstacle[] {
  const mat = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = new Color3(0.03, 0.03, 0.03);
    return m;
  };
  const red = mat("farmer1HouseRed", new Color3(0.5, 0.1, 0.08), 0.22);
  const timber = mat("farmer1HouseTimber", new Color3(0.42, 0.27, 0.15), 0.2);
  const lit = new StandardMaterial("farmer1HouseLight", scene);
  lit.diffuseColor = Color3.Black();
  lit.emissiveColor = new Color3(1, 0.78, 0.3);
  lit.specularColor = Color3.Black();
  // Clear the ring trees standing on the footprints (and their colliders)
  const cleared: Array<[number, number]> = [];
  for (const trunk of scene.meshes.filter((m) => built.has(m) && m.name === "trunk")) {
    const p = trunk.getAbsolutePosition();
    if (!HOUSES.some(([x, z]) => Math.abs(p.x - x) < HOUSE.width / 2 + 2.5 && Math.abs(p.z - z) < HOUSE.depth / 2 + 3)) continue;
    cleared.push([p.x, p.z]);
    trunk.dispose();
  }
  const kept = obstacles.filter((o) => !cleared.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
  const walls: Mesh[] = [], wood: Mesh[] = [], lights: Mesh[] = [];
  for (const [cx, cz, wall] of HOUSES) {
    const body = MeshBuilder.CreateBox("farmer1HouseBody", { width: HOUSE.width, height: wall, depth: HOUSE.depth }, scene);
    body.position.set(cx, wall / 2, cz);
    walls.push(body);
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const post = MeshBuilder.CreateBox("farmer1HousePost", { width: 0.4, height: wall, depth: 0.4 }, scene);
      post.position.set(cx + dx * HOUSE.width / 2, wall / 2, cz + dz * HOUSE.depth / 2);
      wood.push(post);
    }
    for (const y of [0.25, wall * 0.5, wall - 0.15]) {
      const beam = MeshBuilder.CreateBox("farmer1HouseBeam", { width: HOUSE.width + 0.4, height: 0.3, depth: HOUSE.depth + 0.4 }, scene);
      beam.position.set(cx, y, cz);
      wood.push(beam);
    }
    // Gable roof, ridge along z so the gable faces the field (the mill's prism, turned the same way)
    const roof = MeshBuilder.CreateCylinder("farmer1HouseRoof", { diameter: HOUSE.width * 1.3, height: HOUSE.depth + 1.2, tessellation: 3 }, scene);
    roof.rotation.y = Math.PI / 2;
    roof.bakeCurrentTransformIntoVertices();
    roof.rotation.x = Math.PI / 2;
    const tall = HOUSE.roof / (HOUSE.width * 1.3 * 0.75);
    roof.scaling.set(1, 1, tall);
    roof.position.set(cx, wall + HOUSE.width * 1.3 * 0.25 * tall, cz);
    wood.push(roof);
    // Balcony across the front at the upper floor: deck, posts under it, a rail with balusters
    const front = cz - HOUSE.depth / 2;
    const deckY = wall * 0.5;
    const deck = MeshBuilder.CreateBox("farmer1HouseBalcony", { width: HOUSE.width * 0.8, height: 0.25, depth: HOUSE.balcony }, scene);
    deck.position.set(cx, deckY, front - HOUSE.balcony / 2);
    wood.push(deck);
    for (const dx of [-1, 1]) {
      const leg = MeshBuilder.CreateBox("farmer1HouseLeg", { width: 0.25, height: deckY, depth: 0.25 }, scene);
      leg.position.set(cx + dx * HOUSE.width * 0.38, deckY / 2, front - HOUSE.balcony + 0.15);
      wood.push(leg);
    }
    const rail = MeshBuilder.CreateBox("farmer1HouseRail", { width: HOUSE.width * 0.8, height: 0.15, depth: 0.15 }, scene);
    rail.position.set(cx, deckY + 1, front - HOUSE.balcony + 0.08);
    wood.push(rail);
    for (let i = 0; i <= 8; i++) {
      const b = MeshBuilder.CreateBox("farmer1HouseBaluster", { width: 0.1, height: 1, depth: 0.1 }, scene);
      b.position.set(cx - HOUSE.width * 0.4 + i * (HOUSE.width * 0.8 / 8), deckY + 0.5, front - HOUSE.balcony + 0.08);
      wood.push(b);
    }
    // Door below, two lit windows above, a lit window on the ground floor
    const door = MeshBuilder.CreateBox("farmer1HouseDoor", { width: 1.2, height: 2, depth: 0.12 }, scene);
    door.position.set(cx + 1.6, 1, front - 0.06);
    wood.push(door);
    for (const [dx, y] of [[-1.4, deckY + 1.3], [1.4, deckY + 1.3], [-1.6, 1.4]]) {
      const w = MeshBuilder.CreateBox("farmer1HouseWindow", { width: 0.9, height: 0.9, depth: 0.1 }, scene);
      w.position.set(cx + dx, y, front - 0.06);
      lights.push(w);
    }
    kept.push({ type: "box", center: new Vector3(cx, 0, cz), halfX: HOUSE.width / 2, halfZ: HOUSE.depth / 2 });
  }
  const glow = scene.getGlowLayerByName("glow");
  for (const [list, m, name] of [[walls, red, "farmer1HouseWalls"], [wood, timber, "farmer1HouseWood"], [lights, lit, "farmer1HouseLights"]] as const) {
    const merged = Mesh.MergeMeshes(list, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = m;
    merged.receiveShadows = true;
    merged.isPickable = false;
    if (m !== lit) glow?.addExcludedMesh(merged);
  }
  return kept;
}

/**
 * Dry-stone walls (wiki shot): low grey cobble walls follow the river banks in the back half on both sides and the left bank in the front
 * half by the boulders, and one runs across the houses' yard in front of them. Spec: knee-high runs (two courses of rough cobbles, 1 m
 * thick) 4.8 m off the river's centre line so a 2.8 m grass bank stays between wall and water, each run with one 4 m gap: left bank
 * z 10..36, right bank z 22..46, left bank z -32..-10, yard wall z 30 from x -34 to -7. They keep clear of the bridge (|z| < 10), the mill
 * (z < -36) and the stage armies (team 1 stands in x 2..41, z -26..18). One box collider per 4 m of wall.
 */
const BANK_OFF = 4.8;
const BANK_WALLS: Array<{ path: (t: number) => [number, number]; len: number; gap: number }> = [
  { path: (t) => [riverX(10 + t) - BANK_OFF, 10 + t], len: 26, gap: 0.5 },
  { path: (t) => [riverX(22 + t) + BANK_OFF, 22 + t], len: 24, gap: 0.35 },
  { path: (t) => [riverX(-32 + t) - BANK_OFF, -32 + t], len: 22, gap: 0.6 },
  { path: (t) => [-34 + t, 30], len: 27, gap: 0.55 },
];

function wallSeed(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function bankWalls(scene: Scene): Obstacle[] {
  const stone = new StandardMaterial("farmer1WallStone", scene);
  stone.diffuseColor = new Color3(0.62, 0.6, 0.56);
  stone.emissiveColor = new Color3(0.08, 0.07, 0.07);
  stone.specularColor = new Color3(0.04, 0.04, 0.04);
  const stones: Mesh[] = [];
  const obstacles: Obstacle[] = [];
  let k = 0;
  BANK_WALLS.forEach(({ path, len, gap }, w) => {
    const gapFrom = gap * len - 2, gapTo = gap * len + 2;
    for (let t = 0.4; t < len; t += 0.75) {
      if (t > gapFrom && t < gapTo) continue;
      const [x, z] = path(t);
      const [x2, z2] = path(t + 0.5);
      const l = Math.hypot(x2 - x, z2 - z) || 1;
      const nx = -(z2 - z) / l, nz = (x2 - x) / l;
      for (let layer = 0; layer < 2; layer++) {
        for (const side of [-0.25, 0.25]) {
          k++;
          if (layer === 1 && wallSeed(k + w * 500, 3) < 0.25) continue;
          const size = 0.42 + wallSeed(k + w * 500, 4) * 0.22;
          const s = MeshBuilder.CreatePolyhedron("farmer1Cobble", { type: 1, size }, scene);
          s.scaling.set(1, 0.7, 1);
          const j = (wallSeed(k + w * 500, 5) - 0.5) * 0.3;
          s.position.set(x + nx * side + (x2 - x) / l * j, 0.22 + layer * 0.38, z + nz * side + (z2 - z) / l * j);
          s.rotation.set(wallSeed(k, 6) * 3, wallSeed(k, 7) * 3, wallSeed(k, 8) * 3);
          stones.push(s);
        }
      }
    }
    for (let t = 0; t < len; t += 4) {
      const mid = Math.min(t + 2, len - 0.5);
      if (mid > gapFrom - 1 && mid < gapTo + 1) continue;
      const [x, z] = path(mid);
      const along = Math.abs(path(len)[0] - path(0)[0]) > Math.abs(path(len)[1] - path(0)[1]);
      obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: along ? 2 : 0.5, halfZ: along ? 0.5 : 2 });
    }
  });
  const merged = Mesh.MergeMeshes(stones, true);
  if (merged) {
    merged.name = "farmer1Walls";
    merged.convertToFlatShadedMesh();
    merged.material = stone;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  return obstacles;
}

/**
 * Warm meadow and dirt tracks (wiki shot): the grass is a warm yellow-green (olive-gold in the sun), not a cool green, and worn tan dirt
 * tracks lead off the bridge ends: one west across the left half to the left rim, bending toward the front, and one east from the bridge
 * bending down to the front-right rim. Spec: grass, ground and blade materials of this build take the warm hue (blades keep their shade
 * ratio to the lawn); each track is a 3 m tan ribbon with a paler worn centre strip, drawn only (units walk on it).
 */
const GRASS_WARM = new Color3(0.82, 0.8, 0.24);
const TRACKS: Array<Array<[number, number]>> = [
  [[-5, 0], [-14, 1], [-24, -1], [-33, -5], [-41, -11], [-47, -16]],
  [[5, 0], [13, -3], [21, -9], [28, -17], [34, -26], [38, -34]],
];

function warmMeadow(scene: Scene): void {
  const grass = scene.getMaterialByName("grass") as StandardMaterial | null;
  if (grass) {
    const old = grass.diffuseColor.clone();
    grass.diffuseColor = GRASS_WARM.clone();
    grass.emissiveColor = new Color3(0.08, 0.07, 0.0);
    for (const name of ["grassBladeDark", "grassBladeLight"]) {
      const blade = scene.getMaterialByName(name) as StandardMaterial | null;
      if (!blade) continue;
      const d = blade.diffuseColor;
      blade.diffuseColor = new Color3(d.r / old.r * GRASS_WARM.r, d.g / old.g * GRASS_WARM.g, d.b / old.b * GRASS_WARM.b);
      blade.emissiveColor = grass.emissiveColor.clone();
    }
  }
  const ground = scene.getMaterialByName("groundMat") as StandardMaterial | null;
  if (ground) ground.diffuseColor = new Color3(0.7, 0.62, 0.24);
  const dry = scene.getMaterialByName("dryGrass") as StandardMaterial | null;
  if (dry) dry.diffuseColor = new Color3(0.78, 0.7, 0.26);

  const mk = (name: string, c: Color3) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(0.18);
    m.specularColor = Color3.Black();
    return m;
  };
  const dirt = mk("farmer1Track", new Color3(0.66, 0.5, 0.28));
  const worn = mk("farmer1TrackWorn", new Color3(0.76, 0.62, 0.38));
  TRACKS.forEach((pts, t) => {
    // A smooth line through the points (Catmull-Rom), then a ribbon either side of it
    const line: Vector3[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let s = 0; s < 6; s++) {
        const u = s / 6, u2 = u * u, u3 = u2 * u;
        const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
        line.push(new Vector3(f(p0[0], p1[0], p2[0], p3[0]), 0, f(p0[1], p1[1], p2[1], p3[1])));
      }
    }
    const last = pts[pts.length - 1];
    line.push(new Vector3(last[0], 0, last[1]));
    for (const [name, half, y, m] of [["farmer1Track", 1.5, 0.05, dirt], ["farmer1TrackWorn", 0.45, 0.065, worn]] as const) {
      const left: Vector3[] = [], right: Vector3[] = [];
      line.forEach((p, i) => {
        const q = line[Math.min(i + 1, line.length - 1)], o = line[Math.max(i - 1, 0)];
        const dx = q.x - o.x, dz = q.z - o.z, l = Math.hypot(dx, dz) || 1;
        const w = half * (0.85 + 0.3 * Math.sin(i * 0.9 + t));
        left.push(new Vector3(p.x + dz / l * w, y, p.z - dx / l * w));
        right.push(new Vector3(p.x - dz / l * w, y, p.z + dx / l * w));
      });
      const mesh = MeshBuilder.CreateRibbon(`${name}${t}`, { pathArray: [left, right], sideOrientation: Mesh.DOUBLESIDE }, scene);
      mesh.material = m;
      mesh.receiveShadows = true;
      mesh.isPickable = false;
    }
  });
}

/**
 * Golden wheat strips (wiki shot, back right): beyond the right-bank wall two long strips of tall golden wheat run back to the rim beside the
 * river, parted by a grass lane a cart could use. Spec (farmer_2's wheat kit, this map's own copy): strips x 8..17 and x 21..33, z 20..44,
 * their ends rounded and cut at the rim, tufts of five stalks 0.5-0.7 m tall with fat ears (waist high), 0.9 m apart and jittered. No
 * colliders: units walk through. They stay behind the stage armies (team 1 stands at z <= 18).
 */
const WHEAT_STRIPS: Array<{ x0: number; x1: number; z0: number; z1: number }> = [
  { x0: 8, x1: 17, z0: 20, z1: 44 },
  { x0: 21, x1: 33, z0: 20, z1: 42 },
];

function wheatStrips(scene: Scene): void {
  const gold = new StandardMaterial("farmer1Wheat", scene);
  gold.diffuseColor = new Color3(0.78, 0.55, 0.16);
  gold.emissiveColor = new Color3(0.26, 0.17, 0.04);
  gold.specularColor = Color3.Black();
  const parts: Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const h = 0.5 + wallSeed(i, 30) * 0.2;
    const stalk = MeshBuilder.CreateCylinder("farmer1WheatStalk", { diameterTop: 0.05, diameterBottom: 0.09, height: h, tessellation: 3 }, scene);
    stalk.position.set(Math.cos(a) * 0.18, h / 2, Math.sin(a) * 0.18);
    stalk.rotation.set(Math.sin(a) * 0.15, 0, -Math.cos(a) * 0.15);
    const ear = MeshBuilder.CreateCylinder("farmer1WheatEar", { diameterTop: 0.04, diameterBottom: 0.16, height: 0.38, tessellation: 4 }, scene);
    ear.rotation.x = Math.PI;
    ear.position.set(Math.cos(a) * 0.25, h + 0.1, Math.sin(a) * 0.25);
    parts.push(stalk, ear);
  }
  const tuft = Mesh.MergeMeshes(parts, true);
  if (!tuft) return;
  tuft.name = "farmer1WheatStrips";
  tuft.convertToFlatShadedMesh();
  tuft.material = gold;
  tuft.isPickable = false;
  const matrices: number[] = [];
  let k = 0;
  for (const s of WHEAT_STRIPS) {
    const cx = (s.x0 + s.x1) / 2, cz = (s.z0 + s.z1) / 2, rx = (s.x1 - s.x0) / 2, rz = (s.z1 - s.z0) / 2;
    for (let x = s.x0; x <= s.x1; x += 0.7) {
      for (let z = s.z0; z <= s.z1; z += 0.7) {
        k++;
        if (((x - cx) / rx) ** 4 + ((z - cz) / rz) ** 4 > 1) continue;
        const px = x + (wallSeed(k, 31) - 0.5) * 0.6, pz = z + (wallSeed(k, 32) - 0.5) * 0.6;
        // Cut at the rim (the island superellipse 54 x 48, power 3), 2 m in
        if (Math.abs(px / 52) ** 3 + Math.abs(pz / 46) ** 3 > 1) continue;
        const sc = 0.85 + wallSeed(k, 33) * 0.3;
        const m = Matrix.Compose(new Vector3(sc, sc, sc), Quaternion.RotationYawPitchRoll(wallSeed(k, 34) * Math.PI * 2, 0.08, (wallSeed(k, 35) - 0.5) * 0.1), new Vector3(px, 0, pz));
        m.copyToArray(matrices, matrices.length);
      }
    }
  }
  tuft.thinInstanceSetBuffer("matrix", new Float32Array(matrices), 16);
  // The stubble under the stalks: a golden patch in each strip's outline, so the strip reads as one block of gold from above
  const stubble = new StandardMaterial("farmer1Stubble", scene);
  stubble.diffuseColor = new Color3(0.76, 0.54, 0.17);
  stubble.emissiveColor = new Color3(0.2, 0.13, 0.03);
  stubble.specularColor = Color3.Black();
  WHEAT_STRIPS.forEach((s, i) => {
    const cx = (s.x0 + s.x1) / 2, cz = (s.z0 + s.z1) / 2, rx = (s.x1 - s.x0) / 2 + 0.3, rz = (s.z1 - s.z0) / 2 + 0.3;
    const pts: Vector3[] = [];
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 24) {
      const c = Math.cos(a), sn = Math.sin(a);
      const r = (Math.abs(c / rx) ** 4 + Math.abs(sn / rz) ** 4) ** -0.25;
      let px = cx + c * r, pz = cz + sn * r;
      const f = Math.abs(px / 52) ** 3 + Math.abs(pz / 46) ** 3;
      if (f > 1) { px *= f ** (-1 / 3); pz *= f ** (-1 / 3); }
      pts.push(new Vector3(px, 0, pz));
    }
    pts.push(pts[0].clone());
    const hub = pts.map(() => new Vector3(cx, 0, cz));
    const patch = MeshBuilder.CreateRibbon(`farmer1Stubble${i}`, { pathArray: [pts, hub], sideOrientation: Mesh.DOUBLESIDE }, scene);
    patch.position.y = 0.045;
    patch.material = stubble;
    patch.receiveShadows = true;
    patch.isPickable = false;
  });
}

/**
 * Island underside (farm_1.png): under the grass lip the island is one deep rounded bowl of dark brown-grey earth with pale grey rounded
 * stones set into its face, not a navy slab hung with black spikes, and no far ridge range or second slab stands behind it. The base's
 * islandUnder/islandShelf/islandCliff and mountain* meshes go. Spec: the bowl follows the island outline (superellipse 54 x 48, power 3),
 * a 1.2 m earth lip, then bulges down in six bands to a rounded point 22 m below the lawn (scale 1, .98, .93, .84, .7, .5, .26, .04);
 * about 70 flattened stones 1.2-3 m across, sunk half into its face between 2 and 16 m down.
 */
const BOWL: Array<[number, number]> = [[1, -0.02], [1, -1.2], [0.98, -3.5], [0.93, -7.5], [0.84, -11.5], [0.7, -15.5], [0.5, -19], [0.26, -21], [0.04, -22]];

function islandOutline(a: number): [number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  const r = (Math.abs(c / 54) ** 2 + Math.abs(s / 48) ** 2) ** (-1 / 2);
  return [c * r, s * r];
}

/**
 * Round island (wiki shot): the island is a near-circle with the meadow running to its rim, not a rounded-rectangle slab inside the
 * translucent placement box. Spec: the outline is the ellipse 54 x 48 (islandOutline, which the earth bowl follows); the base's lawn slabs
 * ("ground", "centerGrass") are remapped vertex by vertex from the base's superellipse (54 x 48, power 3) to it at the same fraction of the
 * radius; thin-instanced blades and wheat past the rim (less 0.5 m) are dropped; base props standing past it (less 1 m) are hidden with
 * their colliders; the placement guide slabs (campaign_zone_overlay_*, campaign_zone_border_*) are hidden.
 */
const RIM_PROPS = new Set(["trunk", "boulder", "wallStone", "hayBale", "stump", "hill", "grassTuft", "flowerDot", "pebble"]);

function roundIsland(scene: Scene, prior: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const oldR = (a: number) => (Math.abs(Math.cos(a) / 54) ** 3 + Math.abs(Math.sin(a) / 48) ** 3) ** (-1 / 3);
  const newR = (a: number) => Math.hypot(...islandOutline(a));
  const inside = (x: number, z: number, m: number) => Math.hypot(x, z) <= newR(Math.atan2(z, x)) - m;
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (prior.has(mesh) || !(mesh instanceof Mesh)) continue;
    if (/^campaign_zone_(overlay|border)_/.test(mesh.name)) mesh.setEnabled(false);
    if (mesh.name === "ground" || mesh.name === "centerGrass") {
      const pos = mesh.getVerticesData("position");
      if (!pos) continue;
      for (let v = 0; v < pos.length; v += 3) {
        const a = Math.atan2(pos[v + 2], pos[v]);
        if (Math.hypot(pos[v], pos[v + 2]) < 1e-6) continue;
        const k = newR(a) / oldR(a);
        pos[v] *= k;
        pos[v + 2] *= k;
      }
      mesh.setVerticesData("position", pos);
      mesh.refreshBoundingInfo();
    } else if (mesh.name.startsWith("fieldBlades_")) {
      // Each blade is a quad of four vertices: one past the rim collapses onto its first corner
      const pos = mesh.getVerticesData("position");
      if (!pos) continue;
      for (let v = 0; v + 11 < pos.length; v += 12) {
        if (inside(pos[v], pos[v + 2], 0.5)) continue;
        for (let c = 3; c < 12; c++) pos[v + c] = pos[v + (c % 3)];
      }
      mesh.setVerticesData("position", pos);
    } else if (mesh.thinInstanceCount > 0 && mesh.name === "farmer1WheatStrips") {
      const kept = mesh.thinInstanceGetWorldMatrices().filter((w) => inside(w.m[12], w.m[14], 0.5));
      const buf = new Float32Array(kept.length * 16);
      kept.forEach((w, i) => buf.set(w.m, i * 16));
      mesh.thinInstanceSetBuffer("matrix", buf, 16);
    } else if (RIM_PROPS.has(mesh.name) && !mesh.parent && mesh.isEnabled() && !inside(mesh.position.x, mesh.position.z, 1)) {
      gone.push([mesh.position.x, mesh.position.z]);
      mesh.setEnabled(false);
    }
  }
  return obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
}

function earthBowl(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (mesh.name.startsWith("mountain") || ["islandUnder", "islandShelf", "islandCliff"].includes(mesh.name)) mesh.setEnabled(false);
  }
  const mk = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = Color3.Black();
    return m;
  };
  const lip = mk("farmer1UnderLip", new Color3(0.5, 0.4, 0.24), 0.2);
  const earth = mk("farmer1UnderEarth", new Color3(0.34, 0.29, 0.25), 0.22);
  const pebble = mk("farmer1UnderStone", new Color3(0.6, 0.57, 0.52), 0.25);
  const bands: Mesh[] = [];
  for (let i = 0; i < BOWL.length - 1; i++) {
    const [s0, y0] = BOWL[i], [s1, y1] = BOWL[i + 1];
    const band = MeshBuilder.CreateCylinder("farmer1Bowl", { diameterTop: s0, diameterBottom: s1, height: y0 - y1, tessellation: 64 }, scene);
    const pos = band.getVerticesData("position")!;
    for (let v = 0; v < pos.length; v += 3) {
      const a = Math.atan2(pos[v + 2], pos[v]);
      const reach = Math.hypot(pos[v], pos[v + 2]) * 2;
      const [x, z] = islandOutline(a);
      pos[v] = x * reach;
      pos[v + 2] = z * reach;
    }
    band.setVerticesData("position", pos);
    band.position.y = (y0 + y1) / 2;
    if (i === 0) {
      band.convertToFlatShadedMesh();
      band.material = lip;
      band.name = "farmer1BowlLip";
      band.isPickable = false;
    } else bands.push(band);
  }
  const bowl = Mesh.MergeMeshes(bands, true);
  if (bowl) {
    bowl.name = "farmer1Bowl";
    bowl.convertToFlatShadedMesh();
    bowl.material = earth;
    bowl.isPickable = false;
  }
  // Stones set into the face: each sits on the bowl at its depth, flattened along the outward direction
  const stones: Mesh[] = [];
  for (let k = 0; k < 70; k++) {
    const a = wallSeed(k, 91) * Math.PI * 2;
    const y = -2 - wallSeed(k, 92) * 14;
    let j = 1;
    while (j < BOWL.length - 1 && BOWL[j][1] > y) j++;
    const [sa, ya] = BOWL[j - 1], [sb, yb] = BOWL[j];
    const s = sa + (sb - sa) * ((y - ya) / (yb - ya));
    const [ox, oz] = islandOutline(a);
    const d = 1.2 + wallSeed(k, 93) * 1.8;
    const stone = MeshBuilder.CreateIcoSphere("farmer1UnderStone", { radius: d / 2, subdivisions: 2 }, scene);
    stone.scaling.set(1.3, 0.8, 0.45);
    stone.rotation.set(0, Math.PI / 2 - a, (wallSeed(k, 94) - 0.5) * 0.6);
    stone.position.set(ox * s, y, oz * s);
    stones.push(stone);
  }
  const set = Mesh.MergeMeshes(stones, true);
  if (set) {
    set.name = "farmer1UnderStones";
    set.convertToFlatShadedMesh();
    set.material = pebble;
    set.isPickable = false;
  }
}

/**
 * No ruins (wiki shot): the base's grey ruins on the far rim (meshes ruin*: the broken tower at (16, 29), five lone pillars, a fallen
 * pillar and loose blocks) go with their colliders; one of them stood inside the wheat strip. In their stead the field is dressed as a
 * farm: a pumpkin patch on the left of the river at mid-field (the wiki shot's left edge, by a bush and a stone wall). Spec: a dark tilled
 * earth patch 12 x 14 m centred at (-34, 2); 24 pumpkins on it in rough rows, 0.7-1.1 m across, squat (0.75 high), deep orange with a
 * short brown stem, and dark green leaf clumps between them. Drawn only, no colliders: units walk through it.
 */
const RUIN_COLLIDERS: Array<[number, number]> = [[16, 29], [-31, 29], [-24, 27], [-16, 30], [-8, 28], [30, 26], [-16.5, 24]];
const PUMPKINS = { x: -34, z: 2, w: 12, d: 14 };

function clearRuins(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  for (const mesh of scene.meshes.filter((m) => built.has(m) && m.name.startsWith("ruin"))) mesh.dispose();
  return obstacles.filter((o) => !RUIN_COLLIDERS.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.01));
}

function pumpkinPatch(scene: Scene): void {
  const mk = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = Color3.Black();
    return m;
  };
  const soil = MeshBuilder.CreateDisc("farmer1PumpkinSoil", { radius: 0.5, tessellation: 18, sideOrientation: Mesh.DOUBLESIDE }, scene);
  soil.rotation.x = Math.PI / 2;
  soil.scaling.set(PUMPKINS.w, PUMPKINS.d, 1);
  soil.position.set(PUMPKINS.x, 0.05, PUMPKINS.z);
  soil.material = mk("farmer1PumpkinSoil", new Color3(0.36, 0.24, 0.12), 0.15);
  soil.receiveShadows = true;
  soil.isPickable = false;
  const fruit: Mesh[] = [], stems: Mesh[] = [], leaves: Mesh[] = [];
  for (let k = 0; k < 24; k++) {
    const row = k % 4, col = Math.floor(k / 4);
    const x = PUMPKINS.x - PUMPKINS.w * 0.35 + row * (PUMPKINS.w * 0.7 / 3) + (wallSeed(k, 71) - 0.5) * 1.6;
    const z = PUMPKINS.z - PUMPKINS.d * 0.38 + col * (PUMPKINS.d * 0.76 / 5) + (wallSeed(k, 72) - 0.5) * 1.4;
    const d = 0.7 + wallSeed(k, 73) * 0.4;
    const p = MeshBuilder.CreateSphere("farmer1Pumpkin", { diameter: d, segments: 6 }, scene);
    p.scaling.y = 0.75;
    p.position.set(x, d * 0.36, z);
    fruit.push(p);
    const stem = MeshBuilder.CreateCylinder("farmer1PumpkinStem", { diameterTop: 0.06, diameterBottom: 0.1, height: 0.22, tessellation: 5 }, scene);
    stem.position.set(x, d * 0.72 + 0.08, z);
    stem.rotation.z = (wallSeed(k, 74) - 0.5) * 0.6;
    stems.push(stem);
    const leaf = MeshBuilder.CreateIcoSphere("farmer1PumpkinLeaf", { radius: 0.45, subdivisions: 1 }, scene);
    leaf.scaling.set(1.3, 0.35, 1);
    leaf.position.set(x + (wallSeed(k, 75) - 0.5) * 1.8, 0.14, z + 0.6 + wallSeed(k, 76) * 0.5);
    leaf.rotation.y = wallSeed(k, 77) * Math.PI;
    leaves.push(leaf);
  }
  const mats: Array<[Mesh[], StandardMaterial, string]> = [
    [fruit, mk("farmer1Pumpkin", new Color3(0.86, 0.36, 0.05), 0.3), "farmer1Pumpkins"],
    [stems, mk("farmer1PumpkinStem", new Color3(0.36, 0.26, 0.1), 0.15), "farmer1PumpkinStems"],
    [leaves, mk("farmer1PumpkinLeaf", new Color3(0.2, 0.36, 0.1), 0.15), "farmer1PumpkinLeaves"],
  ];
  for (const [list, m, name] of mats) {
    const merged = Mesh.MergeMeshes(list, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = m;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

/**
 * Scots pines (wiki shot): the rim is mostly open grass with a few tall pines standing alone, not a solid ring of round dark trees. Every
 * base ring tree (trunk with its crowns) and the haze band behind them go, with the trees' colliders. Spec read off the wiki shot: 11 pines
 * round the rim (two by the back houses, two on the right by the wheat, one at the mill, the rest spaced on the flanks), each a thin
 * red-brown trunk 8-11 m tall leaning 6-14 degrees outward, carrying 3 flattened faceted olive crown clumps 1.6-2.4 m across over its top
 * third, the highest at the tip; a 0.6 m collider at each foot.
 */
const PINES: Array<[number, number]> = [[-32, 36], [-6, 46], [17, 43], [37, 31], [49, 14], [49, -12], [36, -33], [16, -44], [-44, -22], [-50, 6], [-42, 25]];

function scotsPines(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const cleared: Array<[number, number]> = [];
  for (const mesh of scene.meshes.filter((m) => built.has(m) && (m.name === "trunk" || m.name === "hazeTreeline"))) {
    if (mesh.name === "trunk") {
      const p = mesh.getAbsolutePosition();
      cleared.push([p.x, p.z]);
    }
    mesh.setEnabled(false);
  }
  const kept = obstacles.filter((o) => !cleared.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
  const bark = new StandardMaterial("farmer1PineBark", scene);
  bark.diffuseColor = new Color3(0.3, 0.16, 0.09);
  bark.emissiveColor = new Color3(0.06, 0.035, 0.02);
  bark.specularColor = Color3.Black();
  const needles = new StandardMaterial("farmer1PineCrown", scene);
  needles.diffuseColor = new Color3(0.3, 0.32, 0.09);
  needles.emissiveColor = new Color3(0.11, 0.12, 0.03);
  needles.specularColor = Color3.Black();
  const trunks: Mesh[] = [], crowns: Mesh[] = [];
  PINES.forEach(([x, z], i) => {
    const h = 8 + wallSeed(i, 61) * 3;
    const lean = 0.1 + wallSeed(i, 62) * 0.14;
    const out = Math.atan2(z, x);
    const tipX = x + Math.cos(out) * Math.sin(lean) * h, tipZ = z + Math.sin(out) * Math.sin(lean) * h, tipY = Math.cos(lean) * h;
    const trunk = MeshBuilder.CreateCylinder("farmer1PineTrunk", { diameterTop: 0.25, diameterBottom: 0.5, height: h, tessellation: 6 }, scene);
    trunk.position.set((x + tipX) / 2, tipY / 2, (z + tipZ) / 2);
    trunk.rotation.set(Math.sin(out) * lean, 0, -Math.cos(out) * lean);
    trunks.push(trunk);
    for (let c = 0; c < 3; c++) {
      const t = 0.68 + c * 0.14;
      const r = 1.6 + wallSeed(i * 3 + c, 63) * 0.8 - c * 0.15;
      const side = (wallSeed(i * 3 + c, 64) - 0.5) * 2.2;
      const crown = MeshBuilder.CreateIcoSphere("farmer1PineCrown", { radius: r, subdivisions: 1 }, scene);
      crown.scaling.y = 0.62;
      crown.rotation.y = wallSeed(i * 3 + c, 65) * Math.PI;
      crown.position.set(x + (tipX - x) * t + side * Math.sin(out), tipY * t + r * 0.3, z + (tipZ - z) * t - side * Math.cos(out));
      crowns.push(crown);
    }
    kept.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 0.6 });
  });
  const trunkMesh = Mesh.MergeMeshes(trunks, true);
  if (trunkMesh) {
    trunkMesh.name = "farmer1Pines";
    trunkMesh.material = bark;
    trunkMesh.isPickable = false;
  }
  const crownMesh = Mesh.MergeMeshes(crowns, true);
  if (crownMesh) {
    crownMesh.name = "farmer1PineCrowns";
    crownMesh.convertToFlatShadedMesh();
    crownMesh.material = needles;
    crownMesh.isPickable = false;
  }
  return kept;
}

export function buildFarmer1(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  // Open grass where the base stood its dark totem pillar (22, 0) and black barricade box (10, 16): meshes and colliders go
  const FIELD_JUNK: Array<[number, number]> = [[22, 0], [10, 16]];
  for (const mesh of scene.meshes.filter((m) => built.has(m) && /^Introduction Grounds_(cyl|box|totem_top)$/.test(m.name))) {
    if (FIELD_JUNK.some(([x, z]) => Math.hypot(mesh.position.x - x, mesh.position.z - z) < 0.5)) mesh.dispose();
  }
  result.obstacles = result.obstacles.filter((o) => !FIELD_JUNK.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
  result.obstacles = clearRuins(scene, built, result.obstacles);
  warmMeadow(scene);
  pumpkinPatch(scene);
  riverMeshes(scene);
  const hazards = [...result.hazards, ...riverHazards()];
  // Nothing the base put down may stand in the water
  const obstacles = redHouses(scene, result.obstacles.filter((o) => Math.abs(o.center.x - riverX(o.center.z)) > RIVER.halfWidth + 1.5), built);
  obstacles.push(...stoneBridge(scene));
  obstacles.push(...watermill(scene));
  obstacles.push(...bankWalls(scene));
  wheatStrips(scene);
  earthBowl(scene, built);
  return { ...result, hazards, obstacles: roundIsland(scene, prior, scotsPines(scene, built, obstacles)) };
}
