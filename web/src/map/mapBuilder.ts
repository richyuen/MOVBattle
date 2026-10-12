import {
  Scene, MeshBuilder, Vector3, StandardMaterial, Color3, Mesh, VertexData, type ShadowGenerator,
} from "@babylonjs/core";
import type { PlacementZone } from "./placementValidator";
import type { Obstacle } from "./obstacles";
import type { HazardKind, HazardRegion } from "./hazards";

const MAP_WIDTH = 160;  // full X extent (placement/navigation bounds)
const MAP_DEPTH = 120;  // full Z extent (placement/navigation bounds)
const ISLAND_WIDTH = 108;  // floating island slab, X extent: just outside the tree ring so the placement view shows both end rims
const ISLAND_DEPTH = 96;   // floating island slab, Z extent
const ISLAND_ROUND = 3;    // rim is a superellipse of this power: the slab's rectangle with its four corners cut round
const TREE_RING_X = 42;   // tree ring radii around the fighting field
const TREE_RING_Z = 36;
const BLADE_DARK = 0.9;    // grass-blade shades relative to the field color
const BLADE_LIGHT = 1.0;   // in-hue: scaled, never mixed toward white
const HAZE_MIX = 0.08;     // how far the far treeline is mixed toward the lightened fog color
const HAZE_LIFT = 0.4;     // how far the fog color is lightened before far props are mixed into it
const FAR_ROCK = new Color3(0.6, 0.61, 0.65);   // neutral grey, dark enough that the snow tips read against it
const FAR_ROCK_SHADE = new Color3(0.5, 0.52, 0.57);
const FAR_SNOW = new Color3(0.97, 0.98, 1);
const FAR_SNOW_MIX = 0.4;
const FAR_SNOW_GLOW = 0.05; // matte: snow tips shade with the sun like the rock under them
const FAR_ROCK_GLOW = 0.06; // low self-light, so faces turned from the sun stay darker than lit ones
const FAR_ROCK_MIX = 0.5;   // far ridge sits half-way into the sky haze

/** The sun's shadow generator, when the scene has one: trees register with it so they throw ground shadows like units do */
function sunShadows(scene: Scene): ShadowGenerator | null {
  return (scene.getLightByName("dir")?.getShadowGenerator() as ShadowGenerator | null | undefined) ?? null;
}

/** Where the island's rim lies in the direction of angle `a` from its centre */
function islandRim(a: number): [number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const r = (Math.abs(c / (ISLAND_WIDTH / 2)) ** ISLAND_ROUND + Math.abs(s / (ISLAND_DEPTH / 2)) ** ISLAND_ROUND) ** (-1 / ISLAND_ROUND);
  return [c * r, s * r];
}

/** Whether a spot is on the island, at least `inset` metres in from the rim */
function onIsland(x: number, z: number, inset = 0): boolean {
  return Math.abs(x / (ISLAND_WIDTH / 2 - inset)) ** ISLAND_ROUND + Math.abs(z / (ISLAND_DEPTH / 2 - inset)) ** ISLAND_ROUND <= 1;
}

/** Distance haze by color: far props are mixed toward a lightened sky, so they sit paler than near ones */
function hazed(color: Color3, fogColor: Color3, mix: number): Color3 {
  return Color3.Lerp(color, Color3.Lerp(fogColor, Color3.White(), HAZE_LIFT), mix);
}

function paintFarProps(scene: Scene, canopy: Color3): void {
  const hazeTrees = scene.getMaterialByName("hazeTrees") as StandardMaterial | null;
  if (hazeTrees) {
    hazeTrees.diffuseColor = hazed(canopy, scene.fogColor, HAZE_MIX);
    hazeTrees.emissiveColor = hazeTrees.diffuseColor.scale(0.05);
  }
  const hazeTreesShade = scene.getMaterialByName("hazeTreesShade") as StandardMaterial | null;
  if (hazeTrees && hazeTreesShade) {
    hazeTreesShade.diffuseColor = hazeTrees.diffuseColor.scale(0.8);
    hazeTreesShade.emissiveColor = hazeTreesShade.diffuseColor.scale(0.05);
  }
  for (const [name, base] of [["farRock", FAR_ROCK], ["farRockShade", FAR_ROCK_SHADE]] as const) {
    const farRock = scene.getMaterialByName(name) as StandardMaterial | null;
    if (!farRock) continue;
    farRock.diffuseColor = hazed(base, scene.fogColor, FAR_ROCK_MIX);
    farRock.emissiveColor = farRock.diffuseColor.scale(FAR_ROCK_GLOW);
  }
  const farSnow = scene.getMaterialByName("farSnow") as StandardMaterial | null;
  if (farSnow) {
    farSnow.diffuseColor = hazed(FAR_SNOW, scene.fogColor, FAR_SNOW_MIX);
    farSnow.emissiveColor = farSnow.diffuseColor.scale(FAR_SNOW_GLOW);
  }
}

export interface MapBuildResult {
  zones: PlacementZone[];
  /** Where the player may place units, when tighter than `zones` (which also size the nav grid). */
  placementZones?: PlacementZone[];
  obstacles: Obstacle[];
  hazards: HazardRegion[];
  dispose?: () => void;
}

export class TribalSandboxMapBuilder {
  private _scene: Scene;
  private _obstacles: Obstacle[] = [];
  private _renderPlacementGuides: boolean;

  constructor(scene: Scene, renderPlacementGuides = true) {
    this._scene = scene;
    this._renderPlacementGuides = renderPlacementGuides;
  }

  build(): MapBuildResult {
    this._createMaterials();
    this._createGround();
    this._createMountains();
    this._createRocks();
    this._createTrees();
    this._createGrassPatches();
    this._createFieldBlades();
    this._createHazeTreeline();
    this._createScatterProps();
    this._createSetDressing();
    this._createClouds();
    if (this._renderPlacementGuides) {
      this._createZoneOverlays();
      this._createZoneBorders();
    }
    return { zones: getPlacementZones(), placementZones: getIslandGuideZones(), obstacles: this._obstacles, hazards: [] };
  }

  private _seededValue(index: number, seed: number): number {
    const raw = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
    return raw - Math.floor(raw);
  }

  private _createMaterials(): void {
    // Grass: autumn orange
    const grass = new StandardMaterial("grass", this._scene);
    grass.diffuseColor = new Color3(0.86, 0.45, 0.2);
    grass.specularColor = new Color3(0.05, 0.05, 0.05);

    // Warm orange-grass for edges
    const dryGrass = new StandardMaterial("dryGrass", this._scene);
    dryGrass.diffuseColor = new Color3(0.8, 0.4, 0.19);
    dryGrass.specularColor = new Color3(0.05, 0.05, 0.05);

    // Boulder stone: pale sandy tan
    const rock = new StandardMaterial("rock", this._scene);
    rock.diffuseColor = new Color3(0.78, 0.72, 0.58);
    rock.specularColor = new Color3(0.08, 0.08, 0.08);

    // Dark boulder stone: cool grey
    const darkRock = new StandardMaterial("darkRock", this._scene);
    darkRock.diffuseColor = new Color3(0.55, 0.56, 0.58);
    darkRock.specularColor = new Color3(0.06, 0.06, 0.06);

    // Cliff rock: the island's sides are grey stone, a different stuff from the warm earth and boulders on top
    const cliffRock = new StandardMaterial("cliffRock", this._scene);
    cliffRock.diffuseColor = new Color3(0.50, 0.47, 0.44);
    cliffRock.specularColor = new Color3(0.04, 0.04, 0.04);

    // Tree trunk
    const trunk = new StandardMaterial("trunk", this._scene);
    trunk.diffuseColor = new Color3(0.80, 0.74, 0.66);
    trunk.specularColor = new Color3(0.03, 0.03, 0.03);

    // Tree leaves: autumn red
    const leaves = new StandardMaterial("leaves", this._scene);
    leaves.diffuseColor = new Color3(0.8, 0.27, 0.2);
    leaves.specularColor = new Color3(0.03, 0.03, 0.03);

    // Second canopy colour: orange among the red
    const darkLeaves = new StandardMaterial("darkLeaves", this._scene);
    darkLeaves.diffuseColor = new Color3(0.9, 0.5, 0.2);
    darkLeaves.specularColor = new Color3(0.03, 0.03, 0.03);

    // Grass blades: one shade under and one over the field color, so the carpet reads as texture
    const bladeDark = new StandardMaterial("grassBladeDark", this._scene);
    bladeDark.diffuseColor = grass.diffuseColor.scale(BLADE_DARK);
    const bladeLight = new StandardMaterial("grassBladeLight", this._scene);
    bladeLight.diffuseColor = grass.diffuseColor.scale(BLADE_LIGHT);
    for (const blade of [bladeDark, bladeLight]) {
      blade.specularColor = Color3.Black();
      blade.backFaceCulling = false;
    }

    // Far treeline and off-island mountains: colors pre-mixed toward the sky so they sit back in the haze
    for (const name of ["hazeTrees", "hazeTreesShade", "farRock", "farRockShade", "farSnow"]) {
      new StandardMaterial(name, this._scene).specularColor = Color3.Black();
    }
    paintFarProps(this._scene, leaves.diffuseColor);
  }

  private _createGround(): void {
    // Main ground — warm orange earth
    const ground = this._islandSlab("ground", 0, 0.04);
    const mat = new StandardMaterial("groundMat", this._scene);
    mat.diffuseColor = new Color3(0.74, 0.4, 0.2);
    mat.specularColor = new Color3(0.05, 0.05, 0.05);
    ground.material = mat;
    ground.receiveShadows = true;

    // Lawn: the same orange from rim to rim, so no band of another colour frames the field
    const centerGrass = this._islandSlab("centerGrass", 0.02, 0.04);
    centerGrass.material = this._scene.getMaterialByName("grass")!;
    centerGrass.receiveShadows = true;

    // Island underside — tapered rock slab so the field ends at a visible edge against the sky
    const under = this._islandSlab("islandUnder", -0.02, 20, 0.55);
    under.material = this._scene.getMaterialByName("cliffRock")!;
    under.isPickable = false;

    // Rock shelf: a coarse ledge of the cliff standing out past the lawn well below its lip, a different width at
    // every corner, so from above the grass ends on broken rock and not on a ruled line against the sky.
    const shelf = this._islandSlab("islandShelf", -2.5, 5, 0.8, 20, 0.14);
    shelf.material = this._scene.getMaterialByName("cliffRock")!;
    shelf.isPickable = false;

    // Cliff face: rock buttresses hang all the way round under the rim and taper down slower than the slab does, so
    // the cliff below the lawn is ragged while the lawn's own edge stays clean.
    const crags: Mesh[] = [];
    const count = 48;
    for (let k = 0; k < count; k++) {
      const width = 6 + this._seededValue(k, 91) * 6;
      const height = 7 + this._seededValue(k, 92) * 9;
      const crag = MeshBuilder.CreateCylinder("islandCrag", {
        diameterTop: width, diameterBottom: width * 0.35, height, tessellation: 5,
      }, this._scene);
      const [x, z] = islandRim(((k + 0.2 + this._seededValue(k, 93) * 0.6) / count) * Math.PI * 2);
      // Centred at least half its width inside the rim, so its top never juts sideways past the lawn as a tab
      const pull = 1 - width * (0.5 + this._seededValue(k, 94) * 0.3) / Math.hypot(x, z);
      crag.position.set(x * pull, -height / 2 - 0.03, z * pull);
      crag.rotation.y = this._seededValue(k, 95) * Math.PI;
      crags.push(crag);
    }
    const cliff = Mesh.MergeMeshes(crags, true);
    if (cliff) {
      cliff.name = "islandCliff";
      cliff.convertToFlatShadedMesh();
      cliff.material = this._scene.getMaterialByName("cliffRock")!;
      cliff.isPickable = false;
    }
  }

  /**
   * A slab in the island's outline: a round drum with every vertex pushed out to the rim, its top face at `top`.
   * `ragged` pushes each corner a further, seeded fraction of its reach out past the rim and drops its top edge.
   */
  private _islandSlab(name: string, top: number, height: number, taper = 1, tessellation = 48, ragged = 0): Mesh {
    const slab = MeshBuilder.CreateCylinder(name, {
      diameterTop: 1, diameterBottom: taper, height, tessellation,
    }, this._scene);
    const positions = slab.getVerticesData("position")!;
    for (let i = 0; i < positions.length; i += 3) {
      const angle = Math.atan2(positions[i + 2], positions[i]);
      // Every vertex at one corner shares the corner's seed, so side faces stay whole.
      const corner = (Math.round(angle / (Math.PI * 2) * tessellation) + tessellation) % tessellation;
      const out = ragged > 0 ? 0.03 + ragged * this._seededValue(corner, 96) : 0;
      const reach = Math.hypot(positions[i], positions[i + 2]) * 2 * (1 + out);
      if (ragged > 0 && positions[i + 1] > 0 && reach > 0.5) positions[i + 1] -= this._seededValue(corner, 97) * 1.6;
      const [x, z] = islandRim(angle);
      positions[i] = x * reach;
      positions[i + 2] = z * reach;
    }
    slab.setVerticesData("position", positions);
    slab.position.y = top - height / 2;
    slab.convertToFlatShadedMesh();
    return slab;
  }

  private _createMountains(): void {
    const rock = this._scene.getMaterialByName("farRock") as StandardMaterial;
    const darkRock = this._scene.getMaterialByName("farRockShade") as StandardMaterial;
    const grass = this._scene.getMaterialByName("grass") as StandardMaterial;

    // Far ridges stand well off the two long edges only, so the placement view shows open sky past
    // the treeline and off both ends instead of a wall of rock boxing the field in.
    // ── Back mountains (positive Z) ──
    this._createMountain(new Vector3(-50, 0, 96), 35, 22, 20, rock);
    this._createMountain(new Vector3(-20, 0, 101), 28, 18, 18, darkRock);
    this._createMountain(new Vector3(15, 0, 99), 32, 25, 22, rock);
    this._createMountain(new Vector3(50, 0, 96), 30, 20, 18, darkRock);

    // ── Front mountains (negative Z) ──
    this._createMountain(new Vector3(-55, 0, -96), 30, 18, 20, rock);
    this._createMountain(new Vector3(-20, 0, -101), 25, 16, 16, darkRock);
    this._createMountain(new Vector3(20, 0, -99), 28, 20, 18, rock);
    this._createMountain(new Vector3(55, 0, -96), 32, 22, 20, darkRock);

    // ── Grassy hills (smaller, in play area for variety) ──
    this._createHill(new Vector3(-40, 0, 30), 12, 4, 10, grass);
    this._createHill(new Vector3(40, 0, -30), 12, 4, 10, grass);
    this._createHill(new Vector3(-35, 0, -25), 10, 3, 8, grass);
    this._createHill(new Vector3(35, 0, 25), 10, 3, 8, grass);
  }

  /** Low hazed ridge: three closely overlapping peaks strung along the island edge, two to three treelines tall, each snow-tipped. */
  private _createMountain(
    pos: Vector3, diameterX: number, height: number, diameterZ: number,
    mat: StandardMaterial,
  ): void {
    const snow = this._scene.getMaterialByName("farSnow")!;
    // Ridges run along the island edge: x-long behind the long sides, z-long off the two ends
    const alongX = Math.abs(pos.x) < 70;
    const long = Math.max(diameterX, diameterZ) * 1.5;
    const short = Math.min(diameterX, diameterZ) * 1.4;
    const seed = pos.x * 0.37 + pos.z * 0.11;
    // [offset along the ridge, footprint scale, rock height]: a main peak and two close shoulders,
    // so the three merge into one ridge with shallow saddles instead of separate cones
    const humps = [
      [0, 1, height * 0.6],
      [-0.22, 0.8, height * (0.48 + 0.06 * Math.sin(seed))],
      [0.22, 0.74, height * (0.42 + 0.06 * Math.cos(seed * 1.7))],
    ];
    for (const [offset, size, rockHeight] of humps) {
      const x = pos.x + (alongX ? offset * long : 0);
      const z = pos.z + (alongX ? 0 : offset * long);
      const sizeX = (alongX ? long : short) * size;
      const sizeZ = (alongX ? short : long) * size;
      const body = MeshBuilder.CreateCylinder("mountainBase", {
        diameterTop: 0.25, diameterBottom: 1, height: 1, tessellation: 7,
      }, this._scene);
      body.material = mat;
      // Snow tip carries the slope on up to a point
      const capHeight = rockHeight * 0.3;
      const cap = MeshBuilder.CreateCylinder("mountainCap", {
        diameterTop: 0.03, diameterBottom: 1, height: 1, tessellation: 7,
      }, this._scene);
      cap.material = snow;
      for (const [tier, width, tall] of [[body, 1, rockHeight], [cap, 0.25, capHeight]] as const) {
        // Twist the facets before stretching, so every hump turns different faces to the sun
        tier.rotation.y = seed + offset * 3;
        tier.bakeCurrentTransformIntoVertices();
        tier.position.set(x, tier === body ? rockHeight / 2 : rockHeight + capHeight / 2, z);
        tier.scaling.set(sizeX * width, tall, sizeZ * width);
        tier.receiveShadows = true;
        tier.convertToFlatShadedMesh();
      }
    }
    // Rock root below ground level so off-island mountains read as their own floating rocks
    const root = MeshBuilder.CreateCylinder("mountainRoot", {
      diameterTop: 1, diameterBottom: 0.35, height: 1, tessellation: 8,
    }, this._scene);
    root.scaling.set((alongX ? long * 1.4 : short), 16, (alongX ? short : long * 1.4));
    root.position.set(pos.x, -8, pos.z);
    root.material = mat;
    root.convertToFlatShadedMesh();

    // Add collision — approximate as a cylinder covering the base
    const collisionRadius = Math.min(diameterX, diameterZ) * 0.35;
    this._obstacles.push({
      type: "cylinder",
      center: new Vector3(pos.x, 0, pos.z),
      radius: collisionRadius,
    });
  }

  private _createHill(
    pos: Vector3, diameterX: number, height: number, diameterZ: number,
    mat: StandardMaterial,
  ): void {
    const mound = MeshBuilder.CreateSphere("hill", { diameter: 1, segments: 10 }, this._scene);
    mound.scaling.set(diameterX, height * 0.6, diameterZ);
    // Centred on the ground, so only the upper dome shows and the rise has no underside.
    mound.position.set(pos.x, 0, pos.z);
    mound.material = mat;
    mound.receiveShadows = true;

    // Smaller collision since hills are walkable near edges
    const collisionRadius = Math.min(diameterX, diameterZ) * 0.25;
    this._obstacles.push({
      type: "cylinder",
      center: new Vector3(pos.x, 0, pos.z),
      radius: collisionRadius,
    });
  }

  private _createRocks(): void {
    const rock = this._scene.getMaterialByName("rock") as StandardMaterial;
    const darkRock = this._scene.getMaterialByName("darkRock") as StandardMaterial;

    // Scattered boulders in the play area
    const boulders: { pos: Vector3; size: number }[] = [
      { pos: new Vector3(-15, 0, 15), size: 2.5 },
      { pos: new Vector3(18, 0, -12), size: 3.0 },
      { pos: new Vector3(-25, 0, -8), size: 2.0 },
      { pos: new Vector3(28, 0, 10), size: 2.8 },
      { pos: new Vector3(0, 0, 20), size: 2.2 },
      { pos: new Vector3(5, 0, -18), size: 1.8 },
      { pos: new Vector3(-45, 0, 5), size: 3.0 },
      { pos: new Vector3(45, 0, -5), size: 3.0 },
      // Near edges
      { pos: new Vector3(-45, 0, 31), size: 4.0 },
      { pos: new Vector3(45, 0, -31), size: 4.0 },
      { pos: new Vector3(-43, 0, -34), size: 3.5 },
      { pos: new Vector3(43, 0, 34), size: 3.5 },
    ];

    // Tan and grey stone are mixed over the whole field by place, not one colour to each team's half.
    boulders.forEach((b, i) => {
      this._createBoulder(b.pos, b.size, this._seededValue(i, 102) > 0.5 ? rock : darkRock);
    });
  }

  private _createBoulder(pos: Vector3, size: number, mat: StandardMaterial): void {
    // A coarse ball of a few dozen flat faces, squashed and turned by its place on the map, so each
    // boulder is a chunky faceted lump of its own shape and not a smooth loaf.
    // It is a heap and not a lone stone: two lumps about three quarters its size lean on its flanks, a third of a turn apart.
    const seed = pos.x * 7 + pos.z * 13;
    for (let j = 0; j < 3; j++) {
      const k = seed + j * 31;
      const lump = j === 0 ? size : size * (0.7 + this._seededValue(k, 103) * 0.15);
      const turn = this._seededValue(seed, 104) * Math.PI * 2 + j * 2.4;
      const reach = j === 0 ? 0 : size * 0.5;
      const rock = MeshBuilder.CreateSphere("boulder", {
        diameter: lump, segments: 2,
      }, this._scene);
      rock.scaling.set(0.85 + this._seededValue(k, 96) * 0.3, 0.6 + this._seededValue(k, 97) * 0.25, 0.9 + this._seededValue(k, 98) * 0.3);
      rock.rotation.set((this._seededValue(k, 99) - 0.5) * 0.5, this._seededValue(k, 100) * Math.PI, (this._seededValue(k, 101) - 0.5) * 0.5);
      rock.position.set(pos.x + Math.cos(turn) * reach, lump * 0.22, pos.z + Math.sin(turn) * reach);
      rock.convertToFlatShadedMesh();
      rock.material = mat;
      rock.receiveShadows = true;
    }

    this._obstacles.push({
      type: "cylinder",
      center: new Vector3(pos.x, 0, pos.z),
      radius: size * 0.75, // the heap, not only its middle stone
    });
  }

  private _createTrees(): void {
    const trunk = this._scene.getMaterialByName("trunk") as StandardMaterial;
    const leaves = this._scene.getMaterialByName("leaves") as StandardMaterial;
    const darkLeaves = this._scene.getMaterialByName("darkLeaves") as StandardMaterial;

    // A ring of trees around the fighting field plus a few inside it
    const trees: { pos: Vector3; height: number; leafMat: StandardMaterial }[] = [
      // Sparse trees in play area
      { pos: new Vector3(-30, 0, 18), height: 7, leafMat: leaves },
      { pos: new Vector3(30, 0, -18), height: 7, leafMat: darkLeaves },
      { pos: new Vector3(-20, 0, -30), height: 6, leafMat: leaves },
      { pos: new Vector3(20, 0, 30), height: 6, leafMat: darkLeaves },
    ];

    const ringCount = 64;
    for (let i = 0; i < ringCount; i++) {
      const angle = ((i + this._seededValue(i, 61) * 0.6) / ringCount) * Math.PI * 2;
      const spread = 1 + (this._seededValue(i, 62) - 0.5) * 0.14;
      trees.push({
        pos: new Vector3(Math.cos(angle) * TREE_RING_X * spread, 0, Math.sin(angle) * TREE_RING_Z * spread),
        height: 4 + this._seededValue(i, 63) * 5,
        leafMat: this._seededValue(i, 64) > 0.5 ? leaves : darkLeaves,
      });
    }

    trees.forEach((t, i) => {
      this._createTree(
        t.pos,
        t.height,
        trunk,
        t.leafMat,
        t.leafMat === leaves ? darkLeaves : leaves,
        i,
      );
    });
  }

  private _createTree(
    pos: Vector3, height: number,
    trunkMat: StandardMaterial, leafMat: StandardMaterial, upperLeafMat: StandardMaterial,
    index: number,
  ): void {
    // Every third tree is a lumpy broadleaf; the rest are a single ball on a thin stalk, of varied girth. All lean a little.
    const broadleaf = index % 3 === 1;
    const girth = 0.75 + this._seededValue(index, 65) * 0.6;
    const trunkHeight = height * (broadleaf ? 0.5 : 0.6);
    const trunkRadius = height * 0.035;
    const canopyRadius = height * 0.3 * girth;

    // Trunk
    const trunkMesh = MeshBuilder.CreateCylinder("trunk", {
      diameterTop: trunkRadius * 1.6,
      diameterBottom: trunkRadius * 2,
      height: trunkHeight,
      tessellation: 8,
    }, this._scene);
    trunkMesh.position.set(pos.x, trunkHeight / 2 - 0.15, pos.z);
    trunkMesh.rotation.x = (this._seededValue(index, 66) - 0.5) * 0.3;
    trunkMesh.rotation.z = (this._seededValue(index, 67) - 0.5) * 0.3;
    trunkMesh.material = trunkMat;
    trunkMesh.receiveShadows = true;

    // Canopy pieces hang off the trunk (local y measured from the trunk top) so they lean with it.
    const addCanopy = (mesh: Mesh, x: number, y: number, z: number, mat: StandardMaterial): void => {
      mesh.parent = trunkMesh;
      mesh.position.set(x, trunkHeight / 2 + y, z);
      mesh.material = mat;
      // Crowns take no cast shadow: a neighbour's or their own trunk's would land as a black blotch on the leaves
      mesh.receiveShadows = false;
      mesh.convertToFlatShadedMesh();
    };

    // A round crown has facets that face the ground and catch only the dim bounce light. Part self-lit, so its
    // shaded side is a deeper shade of the leaf and not near-black; kept out of the glow layer.
    const crownMat = (mat: StandardMaterial): StandardMaterial => {
      const name = `${mat.name}Crown`;
      const existing = this._scene.getMaterialByName(name) as StandardMaterial | null;
      if (existing) return existing;
      const crown = mat.clone(name);
      crown.diffuseColor = mat.diffuseColor.scale(0.88);
      crown.emissiveColor = mat.diffuseColor.scale(0.26);
      return crown;
    };
    const glow = this._scene.getGlowLayerByName("glow");
    if (broadleaf) {
      // Lumpy crown: three squashed faceted blobs of different size
      const lobe = canopyRadius * 1.25;
      for (let j = 0; j < 3; j++) {
        const size = lobe * (1 - j * 0.2);
        const blob = MeshBuilder.CreateIcoSphere("canopy", { radius: size, subdivisions: 1 }, this._scene);
        blob.scaling.y = 0.72;
        blob.rotation.y = this._seededValue(index * 10 + j, 68) * Math.PI;
        const around = this._seededValue(index, 69) * Math.PI * 2 + j * 2.1;
        addCanopy(
          blob,
          j === 0 ? 0 : Math.cos(around) * lobe * 0.6,
          size * 0.45 + j * lobe * 0.38,
          j === 0 ? 0 : Math.sin(around) * lobe * 0.6,
          crownMat(j === 1 ? upperLeafMat : leafMat),
        );
        glow?.addExcludedMesh(blob);
      }
    } else {
      // Lollipop: one faceted ball sat on the top of the stalk
      const ball = MeshBuilder.CreateIcoSphere("canopy", { radius: canopyRadius, subdivisions: 1 }, this._scene);
      ball.scaling.y = 0.9;
      ball.rotation.y = this._seededValue(index * 10, 68) * Math.PI;
      addCanopy(ball, 0, canopyRadius * 0.7, 0, crownMat(leafMat));
      glow?.addExcludedMesh(ball);
    }

    // Registered once the crown hangs off the trunk: the caster list takes the children the trunk has at this moment
    sunShadows(this._scene)?.addShadowCaster(trunkMesh);

    // Collision for tree trunk
    this._obstacles.push({
      type: "cylinder",
      center: new Vector3(pos.x, 0, pos.z),
      radius: trunkRadius + 0.3,
    });
  }

  private _createGrassPatches(): void {
    const tuftMat = this._scene.getMaterialByName("grassBladeDark") as StandardMaterial;

    for (let i = 0; i < 36; i++) {
      const x = -45 + this._seededValue(i, 1) * 90;
      const z = -35 + this._seededValue(i, 2) * 70;
      const blades = 3 + Math.floor(this._seededValue(i, 3) * 2);

      for (let j = 0; j < blades; j++) {
        const blade = MeshBuilder.CreateCylinder("grassTuft", {
          height: 0.1 + this._seededValue(i * 10 + j, 4) * 0.08,
          diameterTop: 0.05,
          diameterBottom: 0.1 + this._seededValue(i * 10 + j, 5) * 0.05,
          tessellation: 4,
        }, this._scene);
        blade.position.set(
          x + (this._seededValue(i * 10 + j, 6) - 0.5) * 0.45,
          blade.getBoundingInfo().boundingBox.extendSize.y,
          z + (this._seededValue(i * 10 + j, 7) - 0.5) * 0.45,
        );
        blade.rotation.z = (this._seededValue(i * 10 + j, 8) - 0.5) * 0.4;
        blade.rotation.x = (this._seededValue(i * 10 + j, 9) - 0.5) * 0.25;
        blade.material = tuftMat;
        blade.receiveShadows = true;
      }
    }
  }

  /** Patches of tall grass clumps between short turf and open ground: two meshes, no per-blade nodes */
  private _createFieldBlades(): void {
    const BLADES = 480000;
    const PER_TUFT = 4;
    for (const [pass, matName] of ["grassBladeDark", "grassBladeLight"].entries()) {
      const positions: number[] = [];
      const normals: number[] = [];
      const indices: number[] = [];
      for (let i = 0; i < BLADES; i++) {
        // Four narrow blades share a tuft center and a shade, fanned around it, so a clump is a wisp of grass and not a star.
        const tuft = Math.floor(i / PER_TUFT);
        if (tuft % 2 !== pass) continue;
        // Grass runs out to the island's rim; past the fighting field it is a little under half as thick.
        const tuftX = -50 + this._seededValue(tuft, 31) * 100;
        const tuftZ = -44 + this._seededValue(tuft, 32) * 88;
        if (!onIsland(tuftX, tuftZ, 0.5)) continue;
        if ((Math.abs(tuftX) > 34 || Math.abs(tuftZ) > 24) && this._seededValue(tuft, 43) > 0.45) continue;
        // Low-frequency mask: a quarter of the 4 m cells stay open ground, with a ragged edge from per-tuft jitter.
        // Across the middle where the lines meet it is a little more, so the fight still stands in grass.
        const cellX = Math.floor((tuftX + 50 + (this._seededValue(tuft, 40) - 0.5) * 3) / 4);
        const cellZ = Math.floor((tuftZ + 44 + (this._seededValue(tuft, 41) - 0.5) * 3) / 4);
        if (this._seededValue(cellX * 32 + cellZ, 39) < (Math.abs(tuftX) < 14 ? 0.3 : 0.25)) continue;
        // Each patch has its own height, from ankle turf to full clumps, so the field is not one level carpet.
        // Where the armies stand and fight no patch tops the shin, easing back to full height by the flanks.
        const heightCap = 0.6 + 0.4 * Math.min(1, Math.max(0, (Math.abs(tuftX) - 24) / 6));
        const patchHeight = Math.min(heightCap, 0.45 + this._seededValue(cellX * 32 + cellZ, 42) * 0.55);
        const x = tuftX + (this._seededValue(i, 34) - 0.5) * 0.16;
        const z = tuftZ + (this._seededValue(i, 35) - 0.5) * 0.16;
        const h = (0.2 + this._seededValue(i, 33) * 0.25) * patchHeight; // shin to knee in the tall patches on the flanks
        const yaw = (this._seededValue(tuft, 37) + (i % PER_TUFT) / PER_TUFT) * Math.PI;
        const half = 0.022 + this._seededValue(i, 38) * 0.014; // a blade is a finger wide; the carpet comes from their number
        const dx = Math.cos(yaw) * half;
        const dz = Math.sin(yaw) * half;
        const lean = (this._seededValue(i, 36) - 0.5) * 0.12; // up to 0.06 m either way, so no two blades stand alike
        const base = positions.length / 3;
        // Top edge 0.4 of the base width, so each card is a flat blade and not a spike.
        positions.push(
          x - dx, 0.02, z - dz, x + dx, 0.02, z + dz,
          x + lean + dx * 0.4, 0.02 + h, z + lean + dz * 0.4, x + lean - dx * 0.4, 0.02 + h, z + lean - dz * 0.4,
        );
        // Up-facing normals: blades take the same light as the ground and never go black edge-on.
        normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
        indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
      }
      const blades = new Mesh(`fieldBlades_${pass}`, this._scene);
      const data = new VertexData();
      data.positions = positions;
      data.normals = normals;
      data.indices = indices;
      data.applyToMesh(blades);
      blades.material = this._scene.getMaterialByName(matName);
      blades.isPickable = false;
      // Shaded with the lawn under them, so a tree's shadow is not peppered with sunlit flecks
      blades.receiveShadows = true;
    }
  }

  /** Ragged band of small conifers along the long island edges, behind the big tree ring: low and close to the canopy colour, a thin row, broken by gaps and mixed light and dark */
  private _createHazeTreeline(): void {
    const cones: Mesh[] = [];
    const shadeCones: Mesh[] = [];
    const perSide = 150;
    for (const side of [-1, 1]) {
      for (let i = 0; i < perSide; i++) {
        const k = side > 0 ? i : i + perSide;
        // About one run of fifteen in four is left out, so sky shows through the band in clumps
        if (this._seededValue(Math.floor(k / 15), 75) < 0.25) continue;
        const height = 2.0 + this._seededValue(k, 71) * 2.2;
        const x = -ISLAND_WIDTH / 2 + ((i + this._seededValue(k, 72)) / perSide) * ISLAND_WIDTH;
        const z = side * (37.5 + this._seededValue(k, 73) * 3);
        if (!onIsland(x, z, 1)) continue; // none left standing on air past the rounded corners
        const cone = MeshBuilder.CreateCylinder("hazeTree", {
          height, diameterTop: 0, diameterBottom: height * 0.75, tessellation: 5,
        }, this._scene);
        cone.position.set(x, height / 2, z);
        cone.rotation.y = this._seededValue(k, 74) * Math.PI;
        (this._seededValue(k, 76) < 0.4 ? shadeCones : cones).push(cone);
      }
    }
    for (const [group, matName] of [[cones, "hazeTrees"], [shadeCones, "hazeTreesShade"]] as const) {
      const treeline = Mesh.MergeMeshes(group, true);
      if (!treeline) continue;
      treeline.name = "hazeTreeline";
      treeline.convertToFlatShadedMesh();
      treeline.material = this._scene.getMaterialByName(matName);
      treeline.isPickable = false;
    }
  }

  /** Puffy low-poly clouds ringing the island; sunlit, fog-free and kept out of the glow layer so each facet reads hard-edged */
  private _createClouds(): void {
    const cloudMat = new StandardMaterial("cloud", this._scene);
    cloudMat.diffuseColor = new Color3(1, 1, 1);
    // Enough self-light that the undersides stay a pale grey-white; the sun does the rest
    cloudMat.emissiveColor = new Color3(0.6, 0.63, 0.66);
    cloudMat.specularColor = new Color3(0, 0, 0);
    const glow = this._scene.getGlowLayerByName("glow");

    // Three low clouds drift just past the far rim (x, base y, z, size): the high placement camera looks down too
    // steeply to see the ring above, so these sit low enough to show over the far treeline in that view
    // Small, medium and large at three heights and depths, so they do not read as one matched row on the horizon
    const lowClouds = [[-44, 16, 56, 6], [20, 14, 61, 9], [50, 19, 54, 13]];
    for (let i = 0; i < 12 + lowClouds.length; i++) {
      const low = lowClouds[i - 12];
      const angle = (i / 12) * Math.PI * 2 + this._seededValue(i, 41) * 0.35;
      const radius = 70 + this._seededValue(i, 42) * 30;
      const size = low ? low[3] : 9 + this._seededValue(i, 43) * 8;
      const puffs: Mesh[] = [];
      // A fifth puff rides on top of the two middle ones, so the cloud is a heap and not a row
      const crown = MeshBuilder.CreateSphere("cloudPuff", { diameter: 1, segments: 3 }, this._scene);
      const crownD = size * (0.6 + this._seededValue(i, 47) * 0.2);
      crown.scaling.set(crownD, crownD * 0.7, crownD * 0.7);
      crown.position.set((this._seededValue(i, 48) - 0.5) * size * 0.2, size * 0.62, 0);
      puffs.push(crown);
      for (let j = 0; j < 4; j++) {
        const puff = MeshBuilder.CreateSphere("cloudPuff", { diameter: 1, segments: 3 }, this._scene);
        // The two middle puffs are bigger and taller than the end ones and every puff sits on one flat base,
        // so the cloud heaps up in the middle instead of reading as four beads on a string
        const middle = j === 1 || j === 2;
        const d = size * ((middle ? 0.85 : 0.5) + this._seededValue(i * 10 + j, 44) * 0.3);
        puff.scaling.set(d, d * (middle ? 0.75 : 0.5), d * 0.7);
        puff.position.set((j - 1.5) * size * 0.36, puff.scaling.y * 0.5, (this._seededValue(i * 10 + j, 45) - 0.5) * size * 0.2);
        puffs.push(puff);
      }
      const cloud = Mesh.MergeMeshes(puffs, true);
      if (!cloud) continue;
      cloud.name = "cloud";
      cloud.convertToFlatShadedMesh();
      if (low) {
        cloud.position.set(low[0], low[1], low[2]);
      } else {
        cloud.position.set(Math.cos(angle) * radius, 24 + this._seededValue(i, 46) * 16, Math.sin(angle) * radius);
        cloud.rotation.y = -angle + Math.PI / 2;
      }
      cloud.material = cloudMat;
      cloud.applyFog = false;
      cloud.isPickable = false;
      glow?.addExcludedMesh(cloud);
    }
  }

  private _createScatterProps(): void {
    const flowerColors = [
      new Color3(0.88, 0.24, 0.2),
      new Color3(0.96, 0.82, 0.28),
      new Color3(0.95, 0.95, 0.9),
    ];
    const flowerMats = flowerColors.map((color, index) => {
      const material = new StandardMaterial(`flower${index}`, this._scene);
      material.diffuseColor = color;
      material.specularColor = new Color3(0.03, 0.03, 0.03);
      return material;
    });
    const pebbleMat = new StandardMaterial("pebble", this._scene);
    pebbleMat.diffuseColor = new Color3(0.22, 0.2, 0.18);
    pebbleMat.specularColor = new Color3(0.03, 0.03, 0.03);

    for (let i = 0; i < 18; i++) {
      const flower = MeshBuilder.CreateSphere("flowerDot", {
        diameter: 0.08 + this._seededValue(i, 10) * 0.04,
        segments: 4,
      }, this._scene);
      flower.position.set(
        -45 + this._seededValue(i, 11) * 90,
        0.03,
        -35 + this._seededValue(i, 12) * 70,
      );
      flower.material = flowerMats[i % flowerMats.length];
    }

    for (let i = 0; i < 11; i++) {
      const pebbleSize = 0.1 + this._seededValue(i, 13) * 0.1;
      const pebble = MeshBuilder.CreateSphere("pebble", {
        diameter: pebbleSize,
        segments: 5,
      }, this._scene);
      pebble.scaling.set(
        1 + this._seededValue(i, 14) * 0.3,
        0.45 + this._seededValue(i, 15) * 0.2,
        0.8 + this._seededValue(i, 16) * 0.3,
      );
      pebble.position.set(
        -45 + this._seededValue(i, 17) * 90,
        0.03,
        -35 + this._seededValue(i, 18) * 70,
      );
      pebble.material = pebbleMat;
      pebble.receiveShadows = true;
    }
  }

  /** Farm clutter between the open field and the tree ring: tumbled dry-stone walls, hay bales and stumps. */
  private _createSetDressing(): void {
    const rock = this._scene.getMaterialByName("rock") as StandardMaterial;
    const trunk = this._scene.getMaterialByName("trunk") as StandardMaterial;
    // Wall stone is the boulder rock a shade greyer with a trace of its own colour as glow, so a face turned from the sun
    // is not black and a lit one is grey stone, not a white glow.
    const wallStone = new StandardMaterial("wallStone", this._scene);
    wallStone.diffuseColor = rock.diffuseColor.scale(0.7);
    wallStone.emissiveColor = rock.diffuseColor.scale(0.08);
    wallStone.specularColor = rock.specularColor.clone();
    const straw = new StandardMaterial("straw", this._scene);
    straw.diffuseColor = new Color3(0.86, 0.72, 0.36);
    straw.specularColor = new Color3(0.03, 0.03, 0.03);
    const place = (mesh: Mesh, mat: StandardMaterial, radius: number) => {
      mesh.convertToFlatShadedMesh();
      mesh.material = mat;
      mesh.receiveShadows = true;
      mesh.isPickable = false;
      sunShadows(this._scene)?.addShadowCaster(mesh);
      this._obstacles.push({ type: "cylinder", center: new Vector3(mesh.position.x, 0, mesh.position.z), radius });
    };

    // Each wall is a run of rough blocks along a heading, with one stretch fallen in. All sit off the centre line.
    const walls = [
      { x: -36, z: -4, heading: 1.4, stones: 11 },
      { x: 36, z: 4, heading: 1.4, stones: 11 },
      { x: 13, z: -27, heading: 0.1, stones: 9 },
      { x: -13, z: 27, heading: 0.1, stones: 9 },
    ];
    walls.forEach((wall, w) => {
      const gap = 2 + Math.floor(this._seededValue(w, 111) * (wall.stones - 4));
      for (let i = 0; i < wall.stones; i++) {
        if (i === gap) continue;
        const k = w * 20 + i;
        const along = (i - (wall.stones - 1) / 2) * 1.15;
        // No two stones alike: some half the height and width of their neighbours, so the top is a broken line.
        const height = i === gap - 1 || i === gap + 1 ? 0.45 : 0.6 + this._seededValue(k, 112) * 0.65;
        const stone = MeshBuilder.CreateBox("wallStone", {
          width: 0.85 + this._seededValue(k, 113) * 0.8, height, depth: 0.55 + this._seededValue(k, 114) * 0.4,
        }, this._scene);
        stone.position.set(wall.x + Math.cos(wall.heading) * along, height / 2 - 0.04, wall.z + Math.sin(wall.heading) * along);
        stone.rotation.set((this._seededValue(k, 115) - 0.5) * 0.12, -wall.heading + (this._seededValue(k, 116) - 0.5) * 0.3, (this._seededValue(k, 117) - 0.5) * 0.12);
        place(stone, wallStone, 0.62);
      }
    });

    const bales: [number, number][] = [[24, -27], [26.6, -25.6], [-25, 27.5], [-27.6, 26], [38, -14], [-38, 14]];
    bales.forEach(([x, z], i) => {
      const bale = MeshBuilder.CreateCylinder("hayBale", { diameter: 1.7, height: 1.4, tessellation: 10 }, this._scene);
      bale.position.set(x, 0.82, z);
      bale.rotation.set(Math.PI / 2, this._seededValue(i, 119) * Math.PI, 0);
      place(bale, straw, 0.9);
    });

    const stumps: [number, number][] = [[-33, 9], [33, -9], [-9, -30], [9, 31]];
    stumps.forEach(([x, z], i) => {
      const stump = MeshBuilder.CreateCylinder("stump", {
        diameterTop: 0.9, diameterBottom: 1.15, height: 0.55 + this._seededValue(i, 120) * 0.25, tessellation: 7,
      }, this._scene);
      stump.position.set(x, 0.3, z);
      place(stump, trunk, 0.6);
    });
  }

  /** Tinted ground overlays so each half is clearly blue / red */
  private _createZoneOverlays(): void {
    const zones = getIslandGuideZones();
    const colors = [new Color3(0.2, 0.5, 1.0), new Color3(1.0, 0.25, 0.25)];

    for (const zone of zones) {
      // The team's half of the island's own outline: the lawn slab with the other half folded onto the centre line
      const overlay = this._islandSlab(`zone_overlay_${zone.team}`, 0.03, 0.01);
      const positions = overlay.getVerticesData("position")!;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = zone.team === 0 ? Math.min(positions[i], 0) : Math.max(positions[i], 0);
      }
      overlay.setVerticesData("position", positions);
      const mat = new StandardMaterial(`zone_overlay_mat_${zone.team}`, this._scene);
      mat.diffuseColor = colors[zone.team];
      mat.alpha = 0.08;
      mat.emissiveColor = colors[zone.team].scale(0.15);
      mat.disableLighting = true;
      overlay.material = mat;
    }
  }

  /** The center divider is the only line drawn on the field: the island's own rim marks the outer edge of each half */
  private _createZoneBorders(): void {
    const borderHeight = 0.06;

    // Center divider: thin flat pink line, no glow
    const divider = MeshBuilder.CreateGround("border", { width: 0.12, height: ISLAND_DEPTH }, this._scene);
    divider.position = new Vector3(0, borderHeight + 0.01, 0);
    const dividerMat = new StandardMaterial("center_divider_mat", this._scene);
    dividerMat.diffuseColor = Color3.Black();
    dividerMat.emissiveColor = new Color3(0.92, 0.36, 0.62);
    dividerMat.disableLighting = true;
    divider.material = dividerMat;
  }
}

/** Show or hide the sandbox zone borders and center divider (placement-only guides) */
export function setPlacementGuidesVisible(scene: Scene, visible: boolean): void {
  for (const mesh of scene.meshes) {
    if (mesh.name === "border") mesh.setEnabled(visible);
  }
}

/** Both zones together cover the entire map, split at x = 0 */
export function getPlacementZones(): PlacementZone[] {
  return [
    // Team A: entire left half
    { team: 0, center: new Vector3(-MAP_WIDTH / 2, 0, 0), size: new Vector3(MAP_WIDTH, 100, MAP_DEPTH * 2) },
    // Team B: entire right half
    { team: 1, center: new Vector3(MAP_WIDTH / 2, 0, 0), size: new Vector3(MAP_WIDTH, 100, MAP_DEPTH * 2) },
  ];
}

/** Placement zones clipped to the island slab: drawn guides and player placement, not navigation. */
function getIslandGuideZones(): PlacementZone[] {
  return [
    { team: 0, center: new Vector3(-ISLAND_WIDTH / 4, 0, 0), size: new Vector3(ISLAND_WIDTH / 2, 100, ISLAND_DEPTH) },
    { team: 1, center: new Vector3(ISLAND_WIDTH / 4, 0, 0), size: new Vector3(ISLAND_WIDTH / 2, 100, ISLAND_DEPTH) },
  ];
}

export interface BattleMapInstance extends MapBuildResult {
  id: BattleMapId;
  displayName: string;
  dispose: () => void;
}

export interface BattleMapDefinition {
  id: BattleMapId;
  displayName: string;
  build: (scene: Scene) => BattleMapInstance;
}

export type BattleMapId =
  | "sandbox.tribal"
  | "campaign.introduction"
  | "campaign.adventure"
  | "campaign.challenge"
  | "campaign.dynasty"
  | "campaign.renaissance"
  | "campaign.pirate"
  | "campaign.spooky"
  | "campaign.simulation"
  | "campaign.wild_west"
  | "campaign.legacy"
  | "campaign.fantasy_good"
  | "campaign.fantasy_evil";

interface CampaignPropSpec {
  kind:
    | "tree"
    | "ruin"
    | "lantern"
    | "column"
    | "bones"
    | "crystal"
    | "cactus"
    | "ship"
    | "totem"
    | "barricade"
    | "bridge"
    | "house"
    | "gravestone"
    | "church"
    | "temple"
    | "waterfall";
  x: number;
  z: number;
  scale?: number;
  rotationY?: number;
  blocking?: boolean;
}

interface CampaignMapTheme {
  displayName: string;
  clearColor: Color3;
  fogColor: Color3;
  ground: Color3;
  grass: Color3;
  accent: Color3;
  zones: PlacementZone[];
  hazards: HazardRegion[];
  props: CampaignPropSpec[];
}

function zone(team: number, x: number, z: number, width: number, depth: number): PlacementZone {
  return { team, center: new Vector3(x, 0, z), size: new Vector3(width, 100, depth) };
}

function boxHazard(kind: HazardKind, x: number, z: number, halfX: number, halfZ: number): HazardRegion {
  return { shape: "box", kind, center: new Vector3(x, 0, z), halfX, halfZ };
}

function cylinderHazard(kind: HazardKind, x: number, z: number, radius: number): HazardRegion {
  return { shape: "cylinder", kind, center: new Vector3(x, 0, z), radius };
}

function trackMapBuild(scene: Scene, id: BattleMapId, displayName: string, build: () => MapBuildResult): BattleMapInstance {
  const priorMeshes = new Set(scene.meshes);
  const priorMaterials = new Set(scene.materials);
  const result = build();
  const createdMeshes = scene.meshes.filter((mesh) => !priorMeshes.has(mesh));
  const createdMaterials = scene.materials.filter((material) => !priorMaterials.has(material));
  return {
    ...result,
    id,
    displayName,
    dispose: () => {
      result.dispose?.();
      for (const mesh of createdMeshes) {
        if (!mesh.isDisposed()) mesh.dispose(false, true);
      }
      for (const material of createdMaterials) {
        material.dispose(true, true);
      }
    },
  };
}

function recolorBaseTerrain(scene: Scene, theme: CampaignMapTheme): void {
  scene.clearColor.set(theme.clearColor.r, theme.clearColor.g, theme.clearColor.b, 1);
  scene.fogColor = theme.fogColor;
  const groundMat = scene.getMaterialByName("groundMat") as StandardMaterial | null;
  if (groundMat) groundMat.diffuseColor = theme.ground;
  const grassMat = scene.getMaterialByName("grass") as StandardMaterial | null;
  if (grassMat) grassMat.diffuseColor = theme.grass;
  const dryGrassMat = scene.getMaterialByName("dryGrass") as StandardMaterial | null;
  if (dryGrassMat) dryGrassMat.diffuseColor = Color3.Lerp(theme.ground, theme.grass, 0.45);
  const bladeDark = scene.getMaterialByName("grassBladeDark") as StandardMaterial | null;
  if (bladeDark) bladeDark.diffuseColor = theme.grass.scale(BLADE_DARK);
  const bladeLight = scene.getMaterialByName("grassBladeLight") as StandardMaterial | null;
  if (bladeLight) bladeLight.diffuseColor = theme.grass.scale(BLADE_LIGHT);
  // Campaign trees keep green canopies; only the tribal sandbox is autumn red
  const leaves = scene.getMaterialByName("leaves") as StandardMaterial | null;
  if (leaves) leaves.diffuseColor = new Color3(0.58, 0.7, 0.34);
  const darkLeaves = scene.getMaterialByName("darkLeaves") as StandardMaterial | null;
  if (darkLeaves) darkLeaves.diffuseColor = new Color3(0.48, 0.62, 0.3);
  // The round crowns wear part self-lit clones of the two leaf materials, shaded as _createTree shades them
  for (const mat of [leaves, darkLeaves]) {
    const crown = mat && scene.getMaterialByName(`${mat.name}Crown`) as StandardMaterial | null;
    if (!mat || !crown) continue;
    crown.diffuseColor = mat.diffuseColor.scale(0.88);
    crown.emissiveColor = mat.diffuseColor.scale(0.26);
  }
  paintFarProps(scene, theme.grass.scale(0.85));
}

function createPlacementGuides(scene: Scene, zones: readonly PlacementZone[]): void {
  const teamColors = [new Color3(0.24, 0.55, 1.0), new Color3(0.96, 0.30, 0.26)];
  for (const zone of zones) {
    const overlay = MeshBuilder.CreateGround(`campaign_zone_overlay_${zone.team}_${zone.center.x}_${zone.center.z}`, {
      width: zone.size.x,
      height: zone.size.z,
    }, scene);
    overlay.position.copyFrom(zone.center);
    overlay.position.y = 0.03;
    const mat = new StandardMaterial(`campaign_zone_overlay_mat_${zone.team}_${zone.center.x}_${zone.center.z}`, scene);
    mat.diffuseColor = teamColors[zone.team].scale(0.8);
    mat.emissiveColor = teamColors[zone.team].scale(0.15);
    mat.alpha = 0.08;
    mat.disableLighting = true;
    overlay.material = mat;

    const border = MeshBuilder.CreateGround(`campaign_zone_border_${zone.team}_${zone.center.x}_${zone.center.z}`, {
      width: zone.size.x + 0.4,
      height: zone.size.z + 0.4,
    }, scene);
    border.position.copyFrom(zone.center);
    border.position.y = 0.05;
    const borderMat = new StandardMaterial(`campaign_zone_border_mat_${zone.team}_${zone.center.x}_${zone.center.z}`, scene);
    borderMat.diffuseColor = teamColors[zone.team];
    borderMat.emissiveColor = teamColors[zone.team].scale(0.45);
    borderMat.alpha = 0.16;
    borderMat.disableLighting = true;
    border.material = borderMat;
  }
}

function createHazardVisuals(scene: Scene, hazards: readonly HazardRegion[]): void {
  const hazardColor = (kind: HazardKind): Color3 => {
    switch (kind) {
      case "water": return new Color3(0.18, 0.46, 0.78);
      case "pit": return new Color3(0.16, 0.10, 0.08);
      case "void": return new Color3(0.36, 0.16, 0.44);
    }
  };
  for (const hazard of hazards) {
    const mat = new StandardMaterial(`campaign_hazard_${hazard.kind}_${hazard.center.x}_${hazard.center.z}`, scene);
    mat.diffuseColor = hazardColor(hazard.kind);
    mat.emissiveColor = hazardColor(hazard.kind).scale(hazard.kind === "water" ? 0.22 : 0.12);
    mat.alpha = hazard.kind === "water" ? 0.42 : 0.35;
    mat.disableLighting = true;
    if (hazard.shape === "box") {
      const mesh = MeshBuilder.CreateGround(`campaign_hazard_box_${hazard.kind}`, {
        width: hazard.halfX * 2,
        height: hazard.halfZ * 2,
      }, scene);
      mesh.position.copyFrom(hazard.center);
      mesh.position.y = 0.04;
      mesh.material = mat;
    } else {
      const mesh = MeshBuilder.CreateCylinder(`campaign_hazard_cyl_${hazard.kind}`, {
        diameter: hazard.radius * 2,
        height: 0.14,
        tessellation: 18,
      }, scene);
      mesh.position.copyFrom(hazard.center);
      mesh.position.y = 0.07;
      mesh.material = mat;
    }
  }
}

function addCampaignProps(scene: Scene, theme: CampaignMapTheme, obstacles: Obstacle[]): void {
  const accentMat = new StandardMaterial(`${theme.displayName}_accent`, scene);
  accentMat.diffuseColor = theme.accent;
  accentMat.specularColor = new Color3(0.04, 0.04, 0.04);
  const darkMat = new StandardMaterial(`${theme.displayName}_dark`, scene);
  darkMat.diffuseColor = theme.accent.scale(0.45);
  darkMat.specularColor = new Color3(0.04, 0.04, 0.04);
  const trunkMat = new StandardMaterial(`${theme.displayName}_trunk`, scene);
  trunkMat.diffuseColor = new Color3(0.43, 0.28, 0.14);
  trunkMat.specularColor = new Color3(0.03, 0.03, 0.03);
  const canopyMat = new StandardMaterial(`${theme.displayName}_canopy`, scene);
  canopyMat.diffuseColor = theme.grass.scale(0.8);
  canopyMat.specularColor = new Color3(0.03, 0.03, 0.03);
  const paleMat = new StandardMaterial(`${theme.displayName}_pale`, scene);
  paleMat.diffuseColor = Color3.Lerp(theme.ground, new Color3(0.90, 0.88, 0.82), 0.55);
  paleMat.specularColor = new Color3(0.03, 0.03, 0.03);
  const waterMat = new StandardMaterial(`${theme.displayName}_waterfall`, scene);
  waterMat.diffuseColor = new Color3(0.46, 0.7, 0.95);
  waterMat.emissiveColor = new Color3(0.16, 0.24, 0.3);
  waterMat.alpha = 0.65;

  const addCylinderObstacle = (
    x: number,
    z: number,
    radius: number,
    height: number,
    material = accentMat,
    blocking = true,
  ) => {
    const mesh = MeshBuilder.CreateCylinder(`${theme.displayName}_cyl`, {
      height,
      diameter: radius * 2,
      tessellation: 8,
    }, scene);
    mesh.position = new Vector3(x, height / 2, z);
    mesh.material = material;
    mesh.receiveShadows = true;
    if (blocking) {
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: radius * 0.8 });
    }
    return mesh;
  };
  const addBoxObstacle = (
    x: number,
    z: number,
    width: number,
    depth: number,
    height: number,
    material = darkMat,
    blocking = true,
    rotationY = 0,
  ) => {
    const mesh = MeshBuilder.CreateBox(`${theme.displayName}_box`, {
      width,
      depth,
      height,
    }, scene);
    mesh.position = new Vector3(x, height / 2, z);
    mesh.rotation.y = rotationY;
    mesh.material = material;
    mesh.receiveShadows = true;
    if (blocking) {
      obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: width / 2, halfZ: depth / 2 });
    }
  };
  const addTree = (x: number, z: number, scale = 1, blocking = true) => {
    const trunk = addCylinderObstacle(x, z, 0.55 * scale, 5 * scale, trunkMat, blocking);
    const canopy = MeshBuilder.CreateSphere(`${theme.displayName}_tree_canopy`, { diameter: 4.5 * scale, segments: 6 }, scene);
    canopy.position = new Vector3(x, 5.7 * scale, z);
    canopy.scaling.y = 0.8;
    canopy.material = canopyMat;
    canopy.receiveShadows = true;
    sunShadows(scene)?.addShadowCaster(trunk);
    sunShadows(scene)?.addShadowCaster(canopy);
    if (blocking) {
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 1.4 * scale });
    }
  };
  const addLantern = (x: number, z: number, scale = 1, blocking = true) => {
    addCylinderObstacle(x, z, 0.35 * scale, 5 * scale, trunkMat, blocking);
    const glow = MeshBuilder.CreateSphere(`${theme.displayName}_lantern_glow`, { diameter: 1.1 * scale, segments: 6 }, scene);
    glow.position = new Vector3(x, 5.4 * scale, z);
    glow.material = accentMat;
    glow.receiveShadows = true;
  };
  const addColumn = (x: number, z: number, scale = 1, blocking = true) => {
    addCylinderObstacle(x, z, 0.9 * scale, 7.5 * scale, accentMat, blocking);
    addBoxObstacle(x, z, 2.2 * scale, 2.2 * scale, 0.55 * scale, accentMat, false);
  };
  const addCrystal = (x: number, z: number, scale = 1, blocking = true) => {
    const crystal = MeshBuilder.CreateCylinder(`${theme.displayName}_crystal`, {
      height: 6 * scale,
      diameterTop: 0.2 * scale,
      diameterBottom: 2.2 * scale,
      tessellation: 6,
    }, scene);
    crystal.position = new Vector3(x, 3 * scale, z);
    crystal.rotation.z = 0.35;
    crystal.material = accentMat;
    crystal.receiveShadows = true;
    if (blocking) {
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 1.1 * scale });
    }
  };
  const addCactus = (x: number, z: number, scale = 1, blocking = true) => {
    const body = MeshBuilder.CreateCylinder(`${theme.displayName}_cactus_body`, { height: 7 * scale, diameter: 1.3 * scale }, scene);
    body.position = new Vector3(x, 3.5 * scale, z);
    body.material = accentMat;
    body.receiveShadows = true;
    const arm = MeshBuilder.CreateCylinder(`${theme.displayName}_cactus_arm`, { height: 3.2 * scale, diameter: 0.7 * scale }, scene);
    arm.position = new Vector3(x + 1.4 * scale, 4.4 * scale, z);
    arm.rotation.z = Math.PI / 2.6;
    arm.material = accentMat;
    arm.receiveShadows = true;
    if (blocking) {
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 1.1 * scale });
    }
  };
  const addRuin = (x: number, z: number, scale = 1, blocking = true) => {
    addBoxObstacle(x, z, 5 * scale, 3 * scale, 2 * scale, darkMat, blocking);
    addBoxObstacle(x - 1.4 * scale, z + 0.8 * scale, 1.2 * scale, 1.2 * scale, 6 * scale, accentMat, false);
  };
  const addBonePile = (x: number, z: number, scale = 1, blocking = true) => {
    const pile = MeshBuilder.CreateTorus(`${theme.displayName}_bones`, { diameter: 3.6 * scale, thickness: 0.5 * scale, tessellation: 8 }, scene);
    pile.position = new Vector3(x, 0.5 * scale, z);
    pile.rotation.x = Math.PI / 2.3;
    pile.material = accentMat;
    pile.receiveShadows = true;
    if (blocking) {
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 1.4 * scale });
    }
  };
  const addTotem = (x: number, z: number, scale = 1, blocking = true) => {
    addCylinderObstacle(x, z, 0.6 * scale, 5.4 * scale, darkMat, blocking);
    const topper = MeshBuilder.CreateSphere(`${theme.displayName}_totem_top`, { diameter: 1.8 * scale, segments: 6 }, scene);
    topper.position = new Vector3(x, 5.2 * scale, z);
    topper.material = accentMat;
    topper.receiveShadows = true;
  };
  const addBarricade = (x: number, z: number, scale = 1, rotationY = 0, blocking = true) => {
    addBoxObstacle(x, z, 7 * scale, 1.8 * scale, 2 * scale, darkMat, blocking, rotationY);
  };
  const addBridge = (x: number, z: number, scale = 1, rotationY = 0) => {
    addBoxObstacle(x, z, 12 * scale, 3.2 * scale, 0.45 * scale, trunkMat, false, rotationY);
  };
  const addHouse = (x: number, z: number, scale = 1, rotationY = 0, blocking = true) => {
    addBoxObstacle(x, z, 8 * scale, 7 * scale, 4.8 * scale, paleMat, blocking, rotationY);
    addBoxObstacle(x, z, 8.8 * scale, 7.8 * scale, 1.6 * scale, darkMat, false, rotationY);
  };
  const addGravestone = (x: number, z: number, scale = 1) => {
    addBoxObstacle(x, z, 1.4 * scale, 0.5 * scale, 2.1 * scale, paleMat, false);
  };
  const addChurch = (x: number, z: number, scale = 1, blocking = true) => {
    addBoxObstacle(x, z, 10 * scale, 6 * scale, 6 * scale, paleMat, blocking);
    addCylinderObstacle(x - 3 * scale, z, 1.2 * scale, 10 * scale, darkMat, false);
  };
  const addTemple = (x: number, z: number, scale = 1, blocking = true) => {
    addBoxObstacle(x, z, 10 * scale, 8 * scale, 3.5 * scale, paleMat, blocking);
    addBoxObstacle(x, z, 12 * scale, 10 * scale, 1.2 * scale, accentMat, false);
  };
  const addWaterfall = (x: number, z: number, scale = 1) => {
    const fall = MeshBuilder.CreatePlane(`${theme.displayName}_waterfall`, { width: 6 * scale, height: 14 * scale }, scene);
    fall.position = new Vector3(x, 8 * scale, z);
    fall.material = waterMat;
  };
  const addShip = (x: number, z: number, scale = 1, rotationY = 0, blocking = false) => {
    addBoxObstacle(x, z, 16 * scale, 4.5 * scale, 2.8 * scale, darkMat, blocking, rotationY);
    addBoxObstacle(x, z, 13 * scale, 3.4 * scale, 0.6 * scale, accentMat, false, rotationY);
    const mast = MeshBuilder.CreateCylinder(`${theme.displayName}_ship_mast`, { height: 9 * scale, diameter: 0.25 * scale }, scene);
    mast.position = new Vector3(x, 4.8 * scale, z);
    mast.material = trunkMat;
    mast.receiveShadows = true;
    const sail = MeshBuilder.CreateBox(`${theme.displayName}_ship_sail`, {
      width: 0.25 * scale,
      height: 5.4 * scale,
      depth: 3.8 * scale,
    }, scene);
    sail.position = new Vector3(x + Math.sin(rotationY) * 1.2 * scale, 5.6 * scale, z + Math.cos(rotationY) * 1.2 * scale);
    sail.rotation.y = rotationY;
    sail.material = paleMat;
    sail.receiveShadows = true;
  };

  for (const prop of theme.props) {
    const scale = prop.scale ?? 1;
    const blocking = prop.blocking ?? true;
    const rotationY = prop.rotationY ?? 0;
    switch (prop.kind) {
      case "tree": addTree(prop.x, prop.z, scale, blocking); break;
      case "ruin": addRuin(prop.x, prop.z, scale, blocking); break;
      case "lantern": addLantern(prop.x, prop.z, scale, blocking); break;
      case "column": addColumn(prop.x, prop.z, scale, blocking); break;
      case "bones": addBonePile(prop.x, prop.z, scale, blocking); break;
      case "crystal": addCrystal(prop.x, prop.z, scale, blocking); break;
      case "cactus": addCactus(prop.x, prop.z, scale, blocking); break;
      case "ship": addShip(prop.x, prop.z, scale, rotationY, blocking); break;
      case "totem": addTotem(prop.x, prop.z, scale, blocking); break;
      case "barricade": addBarricade(prop.x, prop.z, scale, rotationY, blocking); break;
      case "bridge": addBridge(prop.x, prop.z, scale, rotationY); break;
      case "house": addHouse(prop.x, prop.z, scale, rotationY, blocking); break;
      case "gravestone": addGravestone(prop.x, prop.z, scale); break;
      case "church": addChurch(prop.x, prop.z, scale, blocking); break;
      case "temple": addTemple(prop.x, prop.z, scale, blocking); break;
      case "waterfall": addWaterfall(prop.x, prop.z, scale); break;
    }
  }
}

function buildCampaignBattlefield(scene: Scene, theme: CampaignMapTheme): MapBuildResult {
  const base = new TribalSandboxMapBuilder(scene, false).build();
  const obstacles = [...base.obstacles];
  const hazards = theme.hazards.map((hazard) => hazard.shape === "box"
    ? { ...hazard, center: hazard.center.clone() }
    : { ...hazard, center: hazard.center.clone() },
  );
  recolorBaseTerrain(scene, theme);
  addCampaignProps(scene, theme, obstacles);
  createHazardVisuals(scene, hazards);
  createPlacementGuides(scene, theme.zones);
  return {
    zones: theme.zones.map((zoneDef) => ({
      team: zoneDef.team,
      center: zoneDef.center.clone(),
      size: zoneDef.size.clone(),
    })),
    obstacles,
    hazards,
  };
}

function restoreSandboxSceneLook(scene: Scene): void {
  scene.clearColor.set(0.36, 0.74, 0.78, 1);
  scene.fogColor = new Color3(0.36, 0.74, 0.78);
}

const defaultHalfZones = (): PlacementZone[] => [
  zone(0, -40, 0, 70, 80),
  zone(1, 40, 0, 70, 80),
];

const campaignThemes: Record<Exclude<BattleMapId, "sandbox.tribal">, CampaignMapTheme> = {
  "campaign.introduction": {
    displayName: "Introduction Grounds",
    clearColor: new Color3(0.64, 0.79, 0.94),
    fogColor: new Color3(0.64, 0.79, 0.94),
    ground: new Color3(0.62, 0.59, 0.32),
    grass: new Color3(0.52, 0.67, 0.29),
    zones: defaultHalfZones(),
    hazards: [],
    accent: new Color3(0.92, 0.82, 0.38),
    props: [
      { kind: "tree", x: -26, z: -26, scale: 1.1 },
      { kind: "tree", x: -24, z: 24, scale: 1.1 },
      { kind: "totem", x: 22, z: 0, scale: 1.15 },
      { kind: "barricade", x: 10, z: 16, scale: 0.9, rotationY: 0.18 },
    ],
  },
  "campaign.adventure": {
    displayName: "Adventure Wilds",
    clearColor: new Color3(0.52, 0.76, 0.72),
    fogColor: new Color3(0.52, 0.76, 0.72),
    ground: new Color3(0.42, 0.46, 0.24),
    grass: new Color3(0.28, 0.43, 0.18),
    zones: [
      zone(0, -46, -16, 40, 28),
      zone(0, -46, 16, 40, 28),
      zone(1, 46, -16, 40, 28),
      zone(1, 46, 16, 40, 28),
    ],
    hazards: [
      boxHazard("water", 0, -10, 18, 6),
      boxHazard("water", 0, 10, 18, 6),
    ],
    accent: new Color3(0.78, 0.68, 0.34),
    props: [
      { kind: "tree", x: -28, z: -24, scale: 1.15 },
      { kind: "tree", x: -22, z: 22, scale: 1.1 },
      { kind: "tree", x: 18, z: -10, scale: 1.05 },
      { kind: "ruin", x: 22, z: 20, scale: 1.0 },
      { kind: "bridge", x: 0, z: 0, scale: 0.9 },
    ],
  },
  "campaign.challenge": {
    displayName: "Challenge Bluffs",
    clearColor: new Color3(0.74, 0.68, 0.52),
    fogColor: new Color3(0.74, 0.68, 0.52),
    ground: new Color3(0.56, 0.44, 0.29),
    grass: new Color3(0.47, 0.36, 0.23),
    zones: [
      zone(0, -44, 0, 34, 40),
      zone(1, 44, 0, 34, 40),
    ],
    hazards: [
      boxHazard("pit", 0, -16, 16, 6),
      boxHazard("pit", 0, 16, 16, 6),
    ],
    accent: new Color3(0.95, 0.79, 0.37),
    props: [
      { kind: "barricade", x: -6, z: -20, scale: 1.1, rotationY: 0.2 },
      { kind: "barricade", x: -4, z: 20, scale: 1.1, rotationY: -0.2 },
      { kind: "ruin", x: 22, z: 0, scale: 1.1 },
      { kind: "totem", x: -24, z: 0, scale: 1.0 },
    ],
  },
  "campaign.dynasty": {
    displayName: "Dynasty Garden",
    clearColor: new Color3(0.72, 0.76, 0.66),
    fogColor: new Color3(0.72, 0.76, 0.66),
    ground: new Color3(0.46, 0.42, 0.2),
    grass: new Color3(0.34, 0.41, 0.2),
    zones: [
      zone(0, -46, -24, 34, 16),
      zone(0, -46, 0, 34, 18),
      zone(0, -46, 24, 34, 16),
      zone(1, 46, -24, 34, 16),
      zone(1, 46, 0, 34, 18),
      zone(1, 46, 24, 34, 16),
    ],
    hazards: [
      boxHazard("water", 0, -12, 46, 5),
      boxHazard("water", 0, 12, 46, 5),
      cylinderHazard("pit", 0, 0, 5),
    ],
    accent: new Color3(0.72, 0.18, 0.18),
    props: [
      { kind: "lantern", x: -20, z: -18, scale: 1.0 },
      { kind: "lantern", x: -20, z: 18, scale: 1.0 },
      { kind: "temple", x: 0, z: 0, scale: 0.8, blocking: false },
      { kind: "bridge", x: -44, z: -12, scale: 0.7 },
      { kind: "bridge", x: -44, z: 12, scale: 0.7 },
      { kind: "bridge", x: 44, z: -12, scale: 0.7 },
      { kind: "bridge", x: 44, z: 12, scale: 0.7 },
      { kind: "bridge", x: 0, z: -12, scale: 0.55 },
      { kind: "bridge", x: 0, z: 12, scale: 0.55 },
    ],
  },
  "campaign.renaissance": {
    displayName: "Renaissance Terrace",
    clearColor: new Color3(0.82, 0.84, 0.9),
    fogColor: new Color3(0.82, 0.84, 0.9),
    ground: new Color3(0.66, 0.56, 0.34),
    grass: new Color3(0.5, 0.56, 0.33),
    zones: [
      zone(0, -42, 12, 46, 34),
      zone(1, 42, 12, 46, 34),
    ],
    hazards: [
      boxHazard("water", 0, -24, 52, 10),
    ],
    accent: new Color3(0.95, 0.87, 0.52),
    props: [
      { kind: "column", x: -22, z: -4, scale: 1.0 },
      { kind: "column", x: -22, z: 20, scale: 1.0 },
      { kind: "house", x: 18, z: -2, scale: 0.9 },
      { kind: "house", x: 20, z: 18, scale: 0.9 },
      { kind: "bridge", x: 0, z: -24, scale: 0.9 },
    ],
  },
  "campaign.pirate": {
    displayName: "Pirate Cove",
    clearColor: new Color3(0.58, 0.76, 0.88),
    fogColor: new Color3(0.58, 0.76, 0.88),
    ground: new Color3(0.73, 0.63, 0.42),
    grass: new Color3(0.54, 0.58, 0.34),
    zones: [
      zone(0, -44, 0, 34, 34),
      zone(0, -18, -24, 16, 10),
      zone(0, -18, 24, 16, 10),
      zone(1, 44, 0, 34, 34),
      zone(1, 18, -24, 16, 10),
      zone(1, 18, 24, 16, 10),
    ],
    hazards: [
      boxHazard("water", 0, -24, 44, 8),
      boxHazard("water", 0, 24, 44, 8),
    ],
    accent: new Color3(0.94, 0.82, 0.38),
    props: [
      { kind: "ship", x: -20, z: 20, scale: 1.0, rotationY: 0.28, blocking: false },
      { kind: "ship", x: 20, z: 20, scale: 1.0, rotationY: -0.28, blocking: false },
      { kind: "bridge", x: -6, z: 20, scale: 0.7 },
      { kind: "bridge", x: 6, z: 20, scale: 0.7 },
      { kind: "waterfall", x: 58, z: 0, scale: 1.0 },
    ],
  },
  "campaign.spooky": {
    displayName: "Spooky Graveyard",
    clearColor: new Color3(0.3, 0.32, 0.42),
    fogColor: new Color3(0.3, 0.32, 0.42),
    ground: new Color3(0.23, 0.26, 0.23),
    grass: new Color3(0.18, 0.2, 0.18),
    zones: defaultHalfZones(),
    hazards: [
      boxHazard("void", 0, -26, 40, 8),
    ],
    accent: new Color3(0.82, 0.7, 0.38),
    props: [
      { kind: "gravestone", x: -22, z: -16, scale: 1.0 },
      { kind: "gravestone", x: -20, z: 16, scale: 1.0 },
      { kind: "bones", x: 18, z: -12, scale: 1.0 },
      { kind: "tree", x: 18, z: 18, scale: 0.95 },
      { kind: "totem", x: 0, z: 24, scale: 1.0 },
    ],
  },
  "campaign.simulation": {
    displayName: "Simulation Arena",
    clearColor: new Color3(0.62, 0.67, 0.75),
    fogColor: new Color3(0.62, 0.67, 0.75),
    ground: new Color3(0.44, 0.44, 0.47),
    grass: new Color3(0.32, 0.34, 0.38),
    zones: defaultHalfZones(),
    hazards: [
      cylinderHazard("void", 0, 0, 8),
    ],
    accent: new Color3(0.96, 0.84, 0.4),
    props: [
      { kind: "crystal", x: -20, z: -18, scale: 1.05 },
      { kind: "crystal", x: -20, z: 18, scale: 1.05 },
      { kind: "column", x: 18, z: -10, scale: 0.9 },
      { kind: "column", x: 18, z: 10, scale: 0.9 },
      { kind: "bridge", x: 0, z: 0, scale: 0.65 },
    ],
  },
  "campaign.wild_west": {
    displayName: "Wild West Flats",
    clearColor: new Color3(0.9, 0.76, 0.58),
    fogColor: new Color3(0.9, 0.76, 0.58),
    ground: new Color3(0.78, 0.62, 0.3),
    grass: new Color3(0.67, 0.55, 0.28),
    zones: [
      zone(0, -44, -18, 34, 18),
      zone(0, -44, 18, 34, 18),
      zone(1, 44, -18, 34, 18),
      zone(1, 44, 18, 34, 18),
    ],
    hazards: [],
    accent: new Color3(0.92, 0.82, 0.34),
    props: [
      { kind: "cactus", x: -24, z: -18, scale: 1.0 },
      { kind: "cactus", x: -24, z: 18, scale: 1.0 },
      { kind: "house", x: 4, z: -16, scale: 0.9 },
      { kind: "house", x: 6, z: 16, scale: 0.9 },
      { kind: "barricade", x: 0, z: 0, scale: 1.1, rotationY: 0 },
    ],
  },
  "campaign.legacy": {
    displayName: "Legacy Parade Grounds",
    clearColor: new Color3(0.78, 0.8, 0.84),
    fogColor: new Color3(0.78, 0.8, 0.84),
    ground: new Color3(0.64, 0.63, 0.54),
    grass: new Color3(0.56, 0.58, 0.46),
    zones: defaultHalfZones(),
    hazards: [],
    accent: new Color3(0.94, 0.84, 0.4),
    props: [
      { kind: "church", x: -20, z: 20, scale: 0.8 },
      { kind: "gravestone", x: -8, z: 18, scale: 0.9 },
      { kind: "gravestone", x: -4, z: 24, scale: 0.9 },
      { kind: "barricade", x: 22, z: 0, scale: 1.0, rotationY: 0.2 },
      { kind: "tree", x: 0, z: 24, scale: 0.95 },
    ],
  },
  "campaign.fantasy_good": {
    displayName: "Fantasy Good Sanctum",
    clearColor: new Color3(0.86, 0.9, 0.96),
    fogColor: new Color3(0.86, 0.9, 0.96),
    ground: new Color3(0.74, 0.7, 0.47),
    grass: new Color3(0.6, 0.66, 0.42),
    zones: [
      zone(0, -44, 0, 30, 40),
      zone(1, 44, 0, 30, 40),
    ],
    hazards: [
      boxHazard("water", 0, -18, 18, 7),
      boxHazard("water", 0, 18, 18, 7),
    ],
    accent: new Color3(0.98, 0.95, 0.74),
    props: [
      { kind: "crystal", x: -22, z: -16, scale: 1.0 },
      { kind: "crystal", x: -22, z: 16, scale: 1.0 },
      { kind: "temple", x: 0, z: 0, scale: 0.8 },
      { kind: "bridge", x: 0, z: -18, scale: 0.75 },
      { kind: "bridge", x: 0, z: 18, scale: 0.75 },
      { kind: "waterfall", x: 54, z: 0, scale: 0.9 },
    ],
  },
  "campaign.fantasy_evil": {
    displayName: "Fantasy Evil Rift",
    clearColor: new Color3(0.26, 0.18, 0.2),
    fogColor: new Color3(0.26, 0.18, 0.2),
    ground: new Color3(0.2, 0.18, 0.19),
    grass: new Color3(0.16, 0.14, 0.16),
    zones: [
      zone(0, -44, 0, 34, 38),
      zone(1, 44, 0, 34, 38),
    ],
    hazards: [
      cylinderHazard("void", 0, 0, 10),
      boxHazard("void", 0, 24, 16, 5),
    ],
    accent: new Color3(0.86, 0.32, 0.34),
    props: [
      { kind: "bones", x: -22, z: -16, scale: 1.0 },
      { kind: "bones", x: -22, z: 16, scale: 1.0 },
      { kind: "crystal", x: 18, z: -10, scale: 0.95 },
      { kind: "crystal", x: 18, z: 10, scale: 0.95 },
      { kind: "bridge", x: 0, z: 0, scale: 0.55 },
    ],
  },
};

export const DEFAULT_BATTLE_MAP_ID: BattleMapId = "sandbox.tribal";

const battleMapEntries: Array<[BattleMapId, BattleMapDefinition]> = [
  [DEFAULT_BATTLE_MAP_ID, {
    id: DEFAULT_BATTLE_MAP_ID,
    displayName: "Tribal Hills",
    build: (scene) => trackMapBuild(scene, DEFAULT_BATTLE_MAP_ID, "Tribal Hills", () => {
      restoreSandboxSceneLook(scene);
      return new TribalSandboxMapBuilder(scene).build();
    }),
  }],
  ...Object.entries(campaignThemes).map(([id, theme]) => [
    id as BattleMapId,
    {
      id: id as BattleMapId,
      displayName: theme.displayName,
      build: (scene: Scene) => trackMapBuild(scene, id as BattleMapId, theme.displayName, () => buildCampaignBattlefield(scene, theme)),
    },
  ] as [BattleMapId, BattleMapDefinition]),
];
const mapRegistry = new Map<BattleMapId, BattleMapDefinition>(battleMapEntries);

export function loadBattleMap(scene: Scene, id: string): BattleMapInstance {
  const definition = mapRegistry.get(id as BattleMapId) ?? mapRegistry.get(DEFAULT_BATTLE_MAP_ID)!;
  return definition.build(scene);
}

