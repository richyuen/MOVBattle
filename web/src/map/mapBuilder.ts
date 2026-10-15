import {
  Scene, MeshBuilder, Vector3, StandardMaterial, Color3, Mesh, TransformNode, VertexData, Quaternion, MaterialPluginBase, RegisterClass, type Material, type UniformBuffer, type ShadowGenerator,
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
const BLADE_ROOT_Y = 0.02; // the lawn's top, where every blade is rooted
const BLADE_SIGHT_REACH = 1.5; // metres: the farthest a blade looks past its own root for the lawn the eye sees behind it (at 4 the blades by a wheel or a boot took shadow from far behind it)
const HAZE_MIX = 0.08;     // how far the far treeline is mixed toward the lightened fog color
const HAZE_LIFT = 0.4;     // how far the fog color is lightened before far props are mixed into it
const FAR_ROCK = new Color3(0.5, 0.48, 0.44);  // warm grey-brown, dark enough that the snow tips read against it
const FAR_ROCK_SHADE = new Color3(0.42, 0.44, 0.48);
const FAR_SNOW = new Color3(0.97, 0.98, 1);
const FAR_SNOW_MIX = 0.4;
const FAR_SNOW_GLOW = 0.05; // matte: snow tips shade with the sun like the rock under them
const FAR_ROCK_GLOW = 0.06; // low self-light, so faces turned from the sun stay darker than lit ones
const FAR_ROCK_MIX = 0.3;   // far ridge sits three tenths into the sky haze: its sunlit faces stay rock, darker than the snow on them

/**
 * Grass takes the shadow of the lawn the eye sees through it. A blade is shaded per fragment like anything else, so a man's shadow fell on the tips a hand's breadth
 * from where it fell on the lawn, and each card cut its own lit or dark sliver out of the silhouette. Shaded whole from its root, a blade stood dark out of the
 * shadow's far edge and lit into its near one, and the outline was a sawtooth of cards. Here the shadow lookup of every blade vertex is redone, after the standard
 * shader has done it from the vertex itself, from the point where the line of sight through that vertex meets the lawn: the root looks itself up, the tip the
 * lawn behind it, and the card fades between the two. What a blade shows is what the lawn it covers would show, so a shadow keeps the outline it has on bare ground.
 */
class RootShadowPlugin extends MaterialPluginBase {
  constructor(material: Material) {
    super(material, "RootShadow", 200);
    this._enable(true);
  }

  getClassName(): string {
    return "RootShadowPlugin";
  }

  getCustomCode(shaderType: string): { [pointName: string]: string } | null {
    if (shaderType !== "vertex") return null;
    // The same lookup as the engine's shadowsVertex include, for whichever light slot the sun holds
    const depth = (x: number, at: string) => `
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetric${x}${at}=(-vPositionFromLight${x}${at}.z+light${x}.depthValues.x)/light${x}.depthValues.y;
#else
vDepthMetric${x}${at}=(vPositionFromLight${x}${at}.z+light${x}.depthValues.x)/light${x}.depthValues.y;
#endif`;
    const slot = (x: number) => `
#if defined(SHADOWCSM${x})
vPositionFromCamera${x}=view*bladeRoot;
for (int i=0; i<SHADOWCSMNUM_CASCADES${x}; i++) {
vPositionFromLight${x}[i]=lightMatrix${x}[i]*bladeRoot;${depth(x, "[i]")}
}
#elif defined(SHADOW${x}) && !defined(SHADOWCUBE${x})
vPositionFromLight${x}=lightMatrix${x}*bladeRoot;${depth(x, "")}
#endif`;
    return {
      CUSTOM_VERTEX_MAIN_END: `
#ifdef SHADOWS
vec3 bladeEye=-vec3(dot(view[0].xyz,view[3].xyz),dot(view[1].xyz,view[3].xyz),dot(view[2].xyz,view[3].xyz));
vec2 bladeSight=(worldPos.xz-bladeEye.xz)*(max(worldPos.y-${BLADE_ROOT_Y.toFixed(3)},0.0)/max(bladeEye.y-worldPos.y,0.05));
bladeSight*=min(1.0,${BLADE_SIGHT_REACH.toFixed(1)}/max(length(bladeSight),0.0001));
vec4 bladeRoot=vec4(worldPos.xz+bladeSight,${BLADE_ROOT_Y.toFixed(3)},1.0).xzyw;${[0, 1, 2, 3].map(slot).join("")}
#endif`,
    };
  }
}

/**
 * The lawn's own shadow filter and shade colour. The engine's filter gives every shadow one hair-thin edge, and its contact-hardening one finds a blocker only where one of a
 * few taps strewn a light's width apart happens to land, so a limb's or a spear's shadow drops out of it. Here the lawn reads the sun's map in bands by how far above it the
 * caster stands: the map is asked again with the lawn's depth lifted toward the sun by LAWN_BAND_RISE, which leaves only what stands that much higher, and each band is blurred
 * over its own radius and laid in at its own weight. A boot's or a wheel's shadow stays crisp and dark where it meets the ground; a chest's is soft; a head's, a spear tip's and
 * a tree's are wide, pale smudges. What is shaded is then turned from the grass's warm glow toward the sky's blue (LAWN_SHADE_TINT, LAWN_SHADE_LIFT), by how deep the shade is.
 */
/*
 * Backdrop haze (aerial perspective on the scenery only; tabs_screenshot_05, 01): the tree ring and the ridges past the field are washed toward a lightened
 * sky the farther out from the field's middle they stand, so they sit pale and soft behind the fight while the field and the men keep their colour. Keyed to
 * the point's distance out from the field's middle (BACKDROP_HAZE_NEAR to _FAR) and faded out close to the eye (BACKDROP_HAZE_EYE), so a tree the camera
 * stands by is not washed. Separate from the scene fog (main.ts HAZE_*), which is keyed to the fight and leaves the fog-free ridges alone.
 */
const BACKDROP_HAZE_NEAR = 26;
const BACKDROP_HAZE_FAR = 80;
const BACKDROP_HAZE_MAX = 0.55;
const BACKDROP_HAZE_EYE = 30;
const BACKDROP_HAZE_LIFT = 0.45;
class BackdropHazePlugin extends MaterialPluginBase {
  constructor(material: Material) {
    super(material, "BackdropHaze", 220);
    this._enable(true);
  }

  getUniforms(): { ubo: { name: string; size: number; type: string }[]; fragment: string } {
    return { ubo: [{ name: "backdropHaze", size: 3, type: "vec3" }], fragment: "uniform vec3 backdropHaze;" };
  }

  // The sky it washes toward follows the biome's fog colour, lightened
  bindForSubMesh(uniformBuffer: UniformBuffer, scene: Scene): void {
    const c = Color3.Lerp(scene.fogColor, Color3.White(), BACKDROP_HAZE_LIFT);
    uniformBuffer.updateColor3("backdropHaze", c);
  }

  getClassName(): string {
    return "BackdropHazePlugin";
  }

  getCustomCode(shaderType: string): { [pointName: string]: string } | null {
    if (shaderType !== "fragment") return null;
    const f = (v: number) => v.toFixed(4);
    return {
      CUSTOM_FRAGMENT_BEFORE_FOG: `
{
float hazeOut=smoothstep(${f(BACKDROP_HAZE_NEAR)},${f(BACKDROP_HAZE_FAR)},length(vPositionW.xz));
float hazeEye=smoothstep(${f(BACKDROP_HAZE_EYE * 0.5)},${f(BACKDROP_HAZE_EYE)},distance(vPositionW,vEyePosition.xyz));
color.rgb=mix(color.rgb,backdropHaze,${f(BACKDROP_HAZE_MAX)}*hazeOut*hazeEye);
}`,
    };
  }
}

/*
 * Canopy aerial grade (tabs_screenshot_01: the background canopies lift to pale peach against the sky, weaker than the lawn): the tree crowns only are mixed
 * toward a lightened sky by their distance from the eye, CANOPY_AERIAL_NEAR to _FAR metres, up to CANOPY_AERIAL_MAX, so a crown twenty metres off already sits
 * paler than the lawn in front of it. Keyed to the eye, not the field (the backdrop haze), and only on crowns, so the lawn and the men keep their colour.
 */
const CANOPY_AERIAL_NEAR = 8;
const CANOPY_AERIAL_FAR = 55;
const CANOPY_AERIAL_MAX = 0.42;
const CANOPY_AERIAL_LIFT = 0.55;
class CanopyAerialPlugin extends MaterialPluginBase {
  constructor(material: Material) {
    super(material, "CanopyAerial", 230);
    this._enable(true);
  }

  getClassName(): string {
    return "CanopyAerialPlugin";
  }

  getUniforms(): { ubo: { name: string; size: number; type: string }[]; fragment: string } {
    return { ubo: [{ name: "canopySky", size: 3, type: "vec3" }], fragment: "uniform vec3 canopySky;" };
  }

  bindForSubMesh(uniformBuffer: UniformBuffer, scene: Scene): void {
    uniformBuffer.updateColor3("canopySky", Color3.Lerp(scene.fogColor, Color3.White(), CANOPY_AERIAL_LIFT));
  }

  getCustomCode(shaderType: string): { [pointName: string]: string } | null {
    if (shaderType !== "fragment") return null;
    const f = (v: number) => v.toFixed(4);
    return {
      CUSTOM_FRAGMENT_BEFORE_FOG: `
{
float canopyFar=smoothstep(${f(CANOPY_AERIAL_NEAR)},${f(CANOPY_AERIAL_FAR)},distance(vPositionW,vEyePosition.xyz));
color.rgb=mix(color.rgb,canopySky,${f(CANOPY_AERIAL_MAX)}*canopyFar);
}`,
    };
  }
}
RegisterClass("BABYLON.CanopyAerialPlugin", CanopyAerialPlugin);

// Tree materials are cloned (per-tree tints), and a clone rebuilds its plugins by class name
RegisterClass("BABYLON.BackdropHazePlugin", BackdropHazePlugin);

const LAWN_BAND_RISE = [0.4, 1.6];           // metres along the sun's ray: what stands less than the first above the lawn is contact, more than the second is high
const LAWN_BAND_BLUR = [0.025, 0.10, 0.24];  // metres: blur radius of the contact, middle and high bands
const LAWN_BAND_WEIGHT = [1.0, 0.92, 0.8];   // how much of the sun each band's shadow takes
const LAWN_SHADE_TINT = new Color3(0.80, 1.0, 1.3);
const LAWN_SHADE_LIFT = new Color3(0.0, 0.02, 0.07);
const LAWN_TAPS = 16;
class LawnShadePlugin extends MaterialPluginBase {
  constructor(material: Material) {
    super(material, "LawnShade", 210);
    this._enable(true);
  }

  getClassName(): string {
    return "LawnShadePlugin";
  }

  getCustomCode(shaderType: string): { [pointName: string]: string } | null {
    if (shaderType !== "fragment") return null;
    const f = (v: number) => v.toFixed(4);
    const vec = (c: Color3) => `vec3(${f(c.r)},${f(c.g)},${f(c.b)})`;
    // An even spiral of taps over a unit disc
    const disc = Array.from({ length: LAWN_TAPS }, (_, i) => {
      const r = Math.sqrt((i + 0.5) / LAWN_TAPS), a = i * 2.399963;
      return `vec2(${f(r * Math.cos(a))},${f(r * Math.sin(a))})`;
    }).join(",");
    // Stands in for the engine's cascaded filter, with its arguments, for whichever light slot the sun holds
    const slot = (x: number) => `
#if defined(SHADOWCSM${x})
float lawnShade${x}(float layer,vec4 fromLight,float depthMetric,highp sampler2DArrayShadow map,vec2 sizeAndInverse,float darkness,float edgeFalloff){
vec3 clipSpace=fromLight.xyz/fromLight.w;
vec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));
uvDepth.z=clamp(ZINCLIP,0.,GREATEST_LESS_THAN_ONE);
mat4 sun=lightMatrix${x}[int(layer)];
float perMetre=0.5*length(vec3(sun[0].x,sun[1].x,sun[2].x));
float rise=length(vec3(sun[0].z,sun[1].z,sun[2].z));
#ifndef IS_NDC_HALF_ZRANGE
rise*=0.5;
#endif
float mid=max(uvDepth.z-rise*${f(LAWN_BAND_RISE[0])},0.);
float high=max(uvDepth.z-rise*${f(LAWN_BAND_RISE[1])},0.);
float contactAll=0.,contactMid=0.,midMid=0.,midHigh=0.,highHigh=0.;
for(int i=0;i<${LAWN_TAPS};i++){
vec2 at=LAWN_DISC[i]*perMetre;
contactAll+=texture2D(map,vec4(uvDepth.xy+at*${f(LAWN_BAND_BLUR[0])},layer,uvDepth.z));
contactMid+=texture2D(map,vec4(uvDepth.xy+at*${f(LAWN_BAND_BLUR[0])},layer,mid));
midMid+=texture2D(map,vec4(uvDepth.xy+at*${f(LAWN_BAND_BLUR[1])},layer,mid));
midHigh+=texture2D(map,vec4(uvDepth.xy+at*${f(LAWN_BAND_BLUR[1])},layer,high));
highHigh+=texture2D(map,vec4(uvDepth.xy+at*${f(LAWN_BAND_BLUR[2])},layer,high));
}
float shade=${f(LAWN_BAND_WEIGHT[0])}*max(contactMid-contactAll,0.)+${f(LAWN_BAND_WEIGHT[1])}*max(midHigh-midMid,0.)+${f(LAWN_BAND_WEIGHT[2])}*(${LAWN_TAPS}.-highHigh);
return computeFallOff(mix(darkness,1.,1.-clamp(shade/${LAWN_TAPS}.,0.,1.)),clipSpace.xy,edgeFalloff);
}
#define computeShadowWithCSMPCF5 lawnShade${x}
#endif`;
    return {
      CUSTOM_FRAGMENT_DEFINITIONS: `
#ifdef SHADOWS
const vec2 LAWN_DISC[${LAWN_TAPS}]=vec2[${LAWN_TAPS}](${disc});${[0, 1, 2, 3].map(slot).join("")}
#endif`,
      // aggShadow is the mean over the lights of what each lets through, and only the sun is ever shadowed
      CUSTOM_FRAGMENT_BEFORE_FOG: `
#ifdef SHADOWS
float lawnShaded=clamp((1.-aggShadow)*numLights,0.,1.);
color.rgb=mix(color.rgb,color.rgb*${vec(LAWN_SHADE_TINT)}+${vec(LAWN_SHADE_LIFT)},lawnShaded);
#endif`,
    };
  }
}

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
    // The crowns (every *Crown clone the trees made) take the canopy aerial grade
    for (const mat of this._scene.materials) if (mat.name.endsWith("Crown") && !mat.pluginManager?.getPlugin("CanopyAerial")) new CanopyAerialPlugin(mat);
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
    grass.diffuseColor = new Color3(1.08, 0.56, 0.19);
    grass.specularColor = new Color3(0.05, 0.05, 0.05);
    grass.emissiveColor = new Color3(0.09, 0.04, 0.06); // self-lit red-orange, less than half as red as it was and the sunlit red raised to make it up: the glow shows in shadow too and held the shade at three quarters of the lit red; the blue is raised over that, so the shade is a plum and not a rust

    // Warm orange-grass for edges
    const dryGrass = new StandardMaterial("dryGrass", this._scene);
    dryGrass.diffuseColor = new Color3(0.92, 0.38, 0.26);
    dryGrass.specularColor = new Color3(0.05, 0.05, 0.05);

    // Boulder stone: pale sandy tan
    const rock = new StandardMaterial("rock", this._scene);
    rock.diffuseColor = new Color3(0.78, 0.72, 0.58);
    rock.specularColor = new Color3(0.08, 0.08, 0.08);

    // Dark boulder stone: a warm dusky brown-grey, part self-lit blue so its faces turned from the sun are a deep blue and not black
    const darkRock = new StandardMaterial("darkRock", this._scene);
    darkRock.diffuseColor = new Color3(0.30, 0.25, 0.15);
    darkRock.emissiveColor = new Color3(0.01, 0.015, 0.08);
    darkRock.specularColor = new Color3(0.06, 0.06, 0.06);

    // Cliff rock: the island's sides are grey stone, a different stuff from the warm earth and boulders on top
    const cliffRock = new StandardMaterial("cliffRock", this._scene);
    cliffRock.diffuseColor = new Color3(0.50, 0.47, 0.44);
    cliffRock.specularColor = new Color3(0.04, 0.04, 0.04);

    // Tree trunk: part self-lit, so the side turned from the sun stays pale wood and not navy
    const trunk = new StandardMaterial("trunk", this._scene);
    trunk.diffuseColor = new Color3(0.86, 0.74, 0.56);
    trunk.emissiveColor = trunk.diffuseColor.scale(0.4);
    trunk.specularColor = new Color3(0.03, 0.03, 0.03);

    // Tree leaves: autumn red
    const leaves = new StandardMaterial("leaves", this._scene);
    leaves.diffuseColor = new Color3(0.95, 0.58, 0.24);
    leaves.specularColor = new Color3(0.03, 0.03, 0.03);

    // Second canopy colour: yellow-orange among the red
    const darkLeaves = new StandardMaterial("darkLeaves", this._scene);
    darkLeaves.diffuseColor = new Color3(0.95, 0.56, 0.28);
    darkLeaves.specularColor = new Color3(0.03, 0.03, 0.03);

    // Grass blades: one shade under and one over the field color, so the carpet reads as texture
    const bladeDark = new StandardMaterial("grassBladeDark", this._scene);
    bladeDark.diffuseColor = grass.diffuseColor.scale(BLADE_DARK);
    const bladeLight = new StandardMaterial("grassBladeLight", this._scene);
    bladeLight.diffuseColor = grass.diffuseColor.scale(BLADE_LIGHT);
    for (const blade of [bladeDark, bladeLight]) {
      blade.specularColor = Color3.Black();
      blade.backFaceCulling = false;
      // The lawn's own glow, so a shaded blade is the plum of the shaded lawn under it and not a near-black tuft on it
      blade.emissiveColor = grass.emissiveColor.clone();
      new RootShadowPlugin(blade);
      new LawnShadePlugin(blade);
    }
    new LawnShadePlugin(grass);

    // Far treeline and off-island mountains: colors pre-mixed toward the sky so they sit back in the haze
    for (const name of ["hazeTrees", "hazeTreesShade", "farRock", "farRockShade", "farSnow"]) {
      const far = new StandardMaterial(name, this._scene);
      far.specularColor = Color3.Black();
      // The ridges are fog-free: scene fog would paint them flat fog-green, so they keep their own pre-hazed rock colour
      far.fogEnabled = !name.startsWith("far");
    }
    // The scenery past the field (ring trees, far treeline, ridges) takes the backdrop haze; the field's own trees stand inside its near radius
    for (const name of ["trunk", "leaves", "darkLeaves", "hazeTrees", "hazeTreesShade", "farRock", "farRockShade", "farSnow"]) {
      const mat = this._scene.getMaterialByName(name);
      if (mat) new BackdropHazePlugin(mat);
    }
    paintFarProps(this._scene, leaves.diffuseColor);
  }

  private _createGround(): void {
    // Main ground — warm orange earth
    const ground = this._islandSlab("ground", 0, 0.04);
    const mat = new StandardMaterial("groundMat", this._scene);
    mat.diffuseColor = new Color3(0.8, 0.35, 0.2);
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
    const shelf = this._islandSlab("islandShelf", -2.5, 5, 0.8, 20, 0.05);
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
    const glow = this._scene.getGlowLayerByName("glow");
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
        glow?.addExcludedMesh(tier); // no glow rim on a far ridge, same as the clouds
      }
    }
    // Rock root below ground level so off-island mountains read as their own floating rocks. Its top sits well under
    // the lawn line: level with it, the low battle camera saw the flat top edge-on as a black strip along the horizon
    const root = MeshBuilder.CreateCylinder("mountainRoot", {
      diameterTop: 1, diameterBottom: 0.35, height: 1, tessellation: 8,
    }, this._scene);
    root.scaling.set((alongX ? long * 1.4 : short), 16, (alongX ? short : long * 1.4));
    root.position.set(pos.x, -14, pos.z);
    root.material = mat;
    root.convertToFlatShadedMesh();
    glow?.addExcludedMesh(root);

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

    const ringCount = 210;
    for (let i = 0; i < ringCount; i++) {
      const angle = ((i + this._seededValue(i, 61) * 0.6) / ringCount) * Math.PI * 2;
      const spread = 1 + this._seededValue(i, 62) * 0.26;
      trees.push({
        pos: new Vector3(Math.cos(angle) * TREE_RING_X * spread, 0, Math.sin(angle) * TREE_RING_Z * spread),
        height: 3 + this._seededValue(i, 63) * 3,
        leafMat: this._seededValue(i, 64) > 0.2 ? leaves : darkLeaves,
      });
    }

    // A further row of sixteen stands behind the far arc and both upper flanks (the top of the placement view), where the ring is at its
    // thinnest, so it is as deep there as on the flanks and covers the bare apron to the rim.
    const backRowCount = 16;
    for (let i = 0; i < backRowCount; i++) {
      const angle = Math.PI / 2 + ((i + this._seededValue(i, 121) * 0.6) / backRowCount - 0.5) * 3.0;
      const spread = 1.24 + this._seededValue(i, 122) * 0.06;
      trees.push({
        pos: new Vector3(Math.cos(angle) * TREE_RING_X * spread, 0, Math.sin(angle) * TREE_RING_Z * spread),
        height: 4 + this._seededValue(i, 123) * 3,
        leafMat: this._seededValue(i, 124) > 0.2 ? leaves : darkLeaves,
      });
    }

    trees.forEach((t, i) => {
      this._createTree(
        t.pos,
        t.height,
        trunk,
        t.leafMat,
        t.leafMat,
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

    // A round crown has facets that face the ground and catch only the dim bounce light. Mostly self-lit, so its
    // shaded side stays nearly as bright as its sunlit side and the sunlit tops do not wash out; kept out of the glow layer. The self-light leans to red and blue over green, so the shade of an autumn crown is crimson and not brick; the yellow-orange crown takes more of its red and green, so its shade is orange and not dark brown.
    const crownMat = (mat: StandardMaterial): StandardMaterial => {
      const name = `${mat.name}Crown`;
      const existing = this._scene.getMaterialByName(name) as StandardMaterial | null;
      if (existing) return existing;
      const crown = mat.clone(name);
      crown.diffuseColor = mat.diffuseColor.scale(0.38);
      crown.emissiveColor = mat.diffuseColor.multiply(mat.name === "darkLeaves" ? new Color3(0.78, 0.68, 0.9) : new Color3(0.72, 0.45, 1.1));
      return crown;
    };
    const glow = this._scene.getGlowLayerByName("glow");
    glow?.addExcludedMesh(trunkMesh); // the trunk is part self-lit: left in, its glow smears a pale haze over the crown at the trunk top
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
      const ball = MeshBuilder.CreateIcoSphere("canopy", { radius: canopyRadius, subdivisions: 2 }, this._scene);
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
    const BLADES = 720000; // half as many again, and fewer open cells below: at 480000 the field was wisps on bare ground
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
        if (this._seededValue(cellX * 32 + cellZ, 39) < (Math.abs(tuftX) < 14 ? 0.15 : 0.12)) continue;
        // Each patch has its own height, from ankle turf to full clumps, so the field is not one level carpet.
        // Where the armies stand and fight no patch tops the shin, easing back to full height by the flanks.
        const heightCap = 0.6 + 0.4 * Math.min(1, Math.max(0, (Math.abs(tuftX) - 24) / 6));
        const patchHeight = Math.min(heightCap, 0.45 + this._seededValue(cellX * 32 + cellZ, 42) * 0.55);
        const x = tuftX + (this._seededValue(i, 34) - 0.5) * 0.08;
        const z = tuftZ + (this._seededValue(i, 35) - 0.5) * 0.08;
        const h = (0.12 + this._seededValue(i, 33) * 0.15) * patchHeight; // ankle to shin, so feet and fallen bodies show above the grass
        const yaw = (this._seededValue(tuft, 37) + (i % PER_TUFT) / PER_TUFT) * Math.PI;
        const half = 0.02 + this._seededValue(i, 38) * 0.015; // a blade is two fingers wide and a tuft's four stand within a hand: thin wisps with ground between, not a carpet of fat cones
        const dx = Math.cos(yaw) * half;
        const dz = Math.sin(yaw) * half;
        const lean = (this._seededValue(i, 36) - 0.5) * 0.12; // up to 0.06 m either way, so no two blades stand alike
        const base = positions.length / 3;
        // Top edge 0.4 of the base width, so each card is a flat blade and not a spike.
        positions.push(
          x - dx, BLADE_ROOT_Y, z - dz, x + dx, BLADE_ROOT_Y, z + dz,
          x + lean + dx * 0.4, BLADE_ROOT_Y + h, z + lean + dz * 0.4, x + lean - dx * 0.4, BLADE_ROOT_Y + h, z + lean - dz * 0.4,
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
      // Shaded with the lawn under them (RootShadowPlugin), so a shadow is not peppered with sunlit flecks
      blades.receiveShadows = true;
    }
  }

  /** Ragged band of small ball crowns along the long island edges, behind the big tree ring: low and close to the canopy colour, a thin row, broken by gaps and mixed light and dark */
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
        const cone = MeshBuilder.CreateIcoSphere("hazeTree", { radius: height * 0.4, subdivisions: 1 }, this._scene);
        cone.position.set(x, height * 0.7, z);
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

  /** Flat, stretched low-poly clouds ringing the island; sunlit, fog-free and kept out of the glow layer so each facet reads hard-edged */
  private _createClouds(): void {
    const cloudMat = new StandardMaterial("cloud", this._scene);
    cloudMat.diffuseColor = new Color3(1, 1, 1);
    // Enough sky-tinted self-light that the undersides stay nearly as pale as the tops; the sun does the rest
    cloudMat.emissiveColor = new Color3(0.80, 0.86, 0.83);
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
      // One ring cloud in three is a big bank 1.2 times the size of its neighbours, so the sky is not a row of equals
      const size = low ? low[3] : (9 + this._seededValue(i, 43) * 8) * (i % 3 === 0 ? 1.2 : 1);
      const puffs: Mesh[] = [];
      // A fifth puff stands on the two middle ones, nearly as tall as it is wide: a rounded head rising off the bank
      const crown = MeshBuilder.CreateSphere("cloudPuff", { diameter: 1, segments: 3 }, this._scene);
      const crownD = size * (0.6 + this._seededValue(i, 47) * 0.2);
      crown.scaling.set(crownD, crownD * 0.9, crownD * 0.7);
      // Well off centre to one side or the other, so the top outline is unequal bumps and not a centred dome
      crown.position.set((this._seededValue(i, 48) < 0.5 ? -1 : 1) * size * 0.3, size * 0.3, 0);
      puffs.push(crown);
      for (let j = 0; j < 4; j++) {
        const puff = MeshBuilder.CreateSphere("cloudPuff", { diameter: 1, segments: 3 }, this._scene);
        // Every puff is a round lobe a little under twice as wide as tall, spaced a good third of a size apart, the
        // middle two bigger: a lumpy cumulus bank. Each sinks a third below the base line, where the underside is cut level below
        const middle = j === 1 || j === 2;
        const d = size * ((middle ? 0.85 : 0.5) + this._seededValue(i * 10 + j, 44) * 0.3);
        puff.scaling.set(d * 1.05, d * (middle ? 0.62 : 0.5), d * 0.7);
        puff.position.set((j - 1.5) * size * 0.38, puff.scaling.y * 0.17, (this._seededValue(i * 10 + j, 45) - 0.5) * size * 0.2);
        puffs.push(puff);
      }
      const cloud = Mesh.MergeMeshes(puffs, true);
      if (!cloud) continue;
      cloud.name = "cloud";
      // Level underside: everything below the base line is pressed up onto it
      const positions = cloud.getVerticesData("position")!;
      for (let v = 1; v < positions.length; v += 3) positions[v] = Math.max(0, positions[v]);
      cloud.setVerticesData("position", positions);
      cloud.convertToFlatShadedMesh();
      if (low) {
        cloud.position.set(low[0], low[1], low[2]);
      } else {
        // The big banks sit down on the treeline, their flat undersides hidden behind the canopy; the small ones ride high
        const big = i % 3 === 0;
        cloud.position.set(Math.cos(angle) * radius, (big ? 12 : 24) + this._seededValue(i, 46) * (big ? 5 : 16), Math.sin(angle) * radius);
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

/**
 * Show or hide the placement-only guides: the centre divider and every team tint (the sandbox halves and a campaign's zone fills and borders). Once the battle
 * starts the field is the biome's own ground (tabs_screenshot_09: a spooky fight on navy ground, no team colour on it); placement brings the tints back.
 */
export function setPlacementGuidesVisible(scene: Scene, visible: boolean): void {
  for (const mesh of scene.meshes) {
    if (mesh.name === "border" || mesh.name.startsWith("zone_overlay_") || mesh.name.startsWith("campaign_zone_")) mesh.setEnabled(visible);
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
    | "deadTree"
    | "tomb"
    | "graveLight"
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
    | "pagoda"
    | "torii"
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
  /** The ring trees' own palette (canopy, upper canopy, trunk) in place of the campaign green, and the share of ring trees stood bare and dead (see deadenRing) */
  ring?: { leaves: Color3; darkLeaves: Color3; trunk: Color3; bare: number; blossom?: number; balls?: Color3[]; palms?: number; oaks?: number };
  /** Opaque turquoise shallows in place of the see-through hazard tint, a pale shore round each pool and a band of sea round the island rim (see seaRim) */
  sea?: { water: Color3; shore: Color3 };
  /** The theme's own lawn in place of the sandbox's (see autumnField): ground and grass colour, the lawn's self-light, and the tuft clumps' palette */
  field?: { ground: Color3; grass: Color3; glow: Color3; tufts: Color3[] };
  /** No island: everything the sandbox base stood on the field and round it is taken away and the lawn runs on to the horizon (see barePlane) */
  bare?: boolean;
  /** A row of townhouses round the rim in place of the tree ring, a low city wall on the near side (see townRing) */
  town?: boolean;
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
  scene.getMeshByName("skyDome")?.setEnabled(false);
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
  if (leaves) leaves.diffuseColor = theme.ring?.leaves ?? new Color3(0.58, 0.7, 0.34);
  const darkLeaves = scene.getMaterialByName("darkLeaves") as StandardMaterial | null;
  if (darkLeaves) darkLeaves.diffuseColor = theme.ring?.darkLeaves ?? new Color3(0.48, 0.62, 0.3);
  const trunk = scene.getMaterialByName("trunk") as StandardMaterial | null;
  if (trunk && theme.ring) trunk.diffuseColor = theme.ring.trunk;
  // The round crowns wear mostly self-lit clones of the two leaf materials, evenly self-lit so their shade stays green
  for (const mat of [leaves, darkLeaves]) {
    const crown = mat && scene.getMaterialByName(`${mat.name}Crown`) as StandardMaterial | null;
    if (!mat || !crown) continue;
    crown.diffuseColor = mat.diffuseColor.scale(0.38);
    crown.emissiveColor = mat.diffuseColor.scale(0.62);
  }
  paintFarProps(scene, theme.grass.scale(0.85));
  if (theme.ring && theme.ring.bare > 0) deadenRing(scene, theme.ring.bare, theme.ring.trunk);
  if (theme.ring?.blossom) blossomRing(scene, theme.ring.blossom);
  if (theme.ring?.balls) ballRing(scene, theme.ring.balls);
  if (theme.ring?.palms) palmRing(scene, theme.ring.palms);
  if (theme.ring?.oaks) oakRing(scene, theme.ring.oaks, theme.ring.trunk);
  if (theme.town) townRing(scene);
  if (theme.field) autumnField(scene, theme.field);
  if (theme.sea) seaRim(scene, theme.sea);
}

/*
 * A palm ring (pirate; maps/pirate_beach: the beach is fringed with palms, never round puffballs). Read off the reference: a thin tan trunk leaning PALM_LEAN
 * off upright, banded every few metres (PALM_BANDS rings), topped by PALM_FRONDS long flat green fronds radiating from one point, each rising a little then
 * arching over and drooping to its tip (three flat cards per frond, pitched PALM_ARCH, PALM_FROND of the tree's height long in all), with a cluster of brown
 * coconuts under them. A seeded share of the ring trees takes this form; their crown is hidden. Palms lean in over the beach.
 * Every other ring tree becomes a dark broadleaf bush (255; the reference fringes its palms with dark green clumps, never a pale round crown): the tree is
 * hidden and in its place sits a mound of BUSH_LUMPS faceted dark lumps BUSH_TALL of the tree's height, BUSH_WIDE across, with BUSH_LEAVES broad pointed
 * leaves fanned up and out of it.
 */
const BUSH_LUMPS = [3, 5];
const BUSH_TALL = 0.3;
const BUSH_WIDE = 0.42;
const BUSH_LEAVES = [5, 7];
const BUSH_GREEN = new Color3(0.16, 0.36, 0.15);
const PALM_LEAN = [0.22, 0.5];
const PALM_BANDS = 4;
const PALM_FRONDS = [6, 8];
const PALM_FROND = 0.5;
const PALM_ARCH = [0.35, -0.25, -0.85];
const PALM_GREEN = new Color3(0.34, 0.6, 0.22);
function palmRing(scene: Scene, share: number): void {
  const frondMat = new StandardMaterial("palmFrond", scene);
  frondMat.diffuseColor = PALM_GREEN.scale(0.55);
  frondMat.emissiveColor = PALM_GREEN.scale(0.45);
  frondMat.specularColor = Color3.Black();
  frondMat.backFaceCulling = false;
  const darkFrond = frondMat.clone("palmFrondDark");
  darkFrond.diffuseColor = PALM_GREEN.scale(0.42);
  darkFrond.emissiveColor = PALM_GREEN.scale(0.32);
  const bandMat = new StandardMaterial("palmBand", scene);
  bandMat.diffuseColor = new Color3(0.42, 0.32, 0.2);
  bandMat.specularColor = Color3.Black();
  const nutMat = new StandardMaterial("palmNut", scene);
  nutMat.diffuseColor = new Color3(0.36, 0.24, 0.12);
  nutMat.specularColor = Color3.Black();
  const bushMat = new StandardMaterial("bushLeaf", scene);
  bushMat.diffuseColor = BUSH_GREEN.scale(0.6);
  bushMat.emissiveColor = BUSH_GREEN.scale(0.45);
  bushMat.specularColor = Color3.Black();
  bushMat.backFaceCulling = false;
  const bushDark = bushMat.clone("bushLeafDark");
  bushDark.diffuseColor = BUSH_GREEN.scale(0.45);
  bushDark.emissiveColor = BUSH_GREEN.scale(0.3);
  const trunks = new Set<Mesh>();
  for (const mesh of scene.meshes) {
    if (mesh.name === "canopy" && mesh.parent instanceof Mesh && mesh.parent.name === "trunk") trunks.add(mesh.parent);
  }
  const glow = scene.getGlowLayerByName("glow");
  const shadows = sunShadows(scene);
  let k = 0;
  for (const trunk of trunks) {
    k++;
    const r = (n: number) => Math.abs((Math.sin(k * 19.391 + n * 47.23) * 28411.371) % 1);
    if (r(1) > share) {
      broadleafBush(scene, trunk, r, bushMat, bushDark, glow, shadows);
      continue;
    }
    for (const child of trunk.getChildMeshes()) if (child.name === "canopy") child.setEnabled(false);
    const info = trunk.getBoundingInfo().boundingBox;
    const trunkLong = info.maximum.y - info.minimum.y;
    const height = trunkLong / 0.55;
    const rad = info.maximum.x;
    // Lean in toward the field (a little off the radial line), replacing the base tree's small random tilt
    const at = trunk.position;
    const out = Math.hypot(at.x, at.z) || 1;
    const lean = PALM_LEAN[0] + r(2) * (PALM_LEAN[1] - PALM_LEAN[0]);
    const turn = (r(3) - 0.5) * 1.2;
    const ix = -at.x / out, iz = -at.z / out;
    const lx = ix * Math.cos(turn) - iz * Math.sin(turn), lz = ix * Math.sin(turn) + iz * Math.cos(turn);
    trunk.rotation.set(lz * lean, trunk.rotation.y, -lx * lean);
    for (let b = 1; b <= PALM_BANDS; b++) {
      const band = MeshBuilder.CreateCylinder("palmBand", { height: trunkLong * 0.04, diameter: rad * 2.5, tessellation: 7 }, scene);
      band.parent = trunk;
      band.position.y = -trunkLong / 2 + (b / (PALM_BANDS + 1)) * trunkLong;
      band.material = bandMat;
      band.isPickable = false;
    }
    const top = new Vector3(0, trunkLong / 2, 0);
    // Fronds radiate about the world's up, not the leaning trunk's: their directions and turns are taken back into the trunk's frame
    const unlean = Quaternion.FromEulerAngles(trunk.rotation.x, 0, trunk.rotation.z).invert();
    const fronds = PALM_FRONDS[0] + Math.round(r(4) * (PALM_FRONDS[1] - PALM_FRONDS[0]));
    for (let i = 0; i < fronds; i++) {
      const yaw = (i / fronds) * Math.PI * 2 + r(10 + i) * 0.6;
      const long = height * PALM_FROND * (0.8 + r(20 + i) * 0.35);
      const wide = height * 0.11;
      let from = top.clone();
      PALM_ARCH.forEach((pitch, j) => {
        const seg = long / PALM_ARCH.length;
        const p = pitch + (r(30 + i) - 0.5) * 0.3;
        const dir = new Vector3(Math.sin(yaw) * Math.cos(p), Math.sin(p), Math.cos(yaw) * Math.cos(p)).applyRotationQuaternion(unlean);
        const card = MeshBuilder.CreateBox("palmFrond", { width: wide * (1 - j * 0.28), height: height * 0.012, depth: seg * 1.08 }, scene);
        card.parent = trunk;
        card.position = from.add(dir.scale(seg / 2));
        card.rotationQuaternion = unlean.multiply(Quaternion.FromEulerAngles(-p, yaw, 0));
        card.material = (i + j) % 3 === 0 ? darkFrond : frondMat;
        card.isPickable = false;
        glow?.addExcludedMesh(card);
        shadows?.addShadowCaster(card, false);
        from = from.add(dir.scale(seg));
      });
    }
    for (let n = 0; n < 3; n++) {
      const a = (n / 3) * Math.PI * 2 + r(50);
      const nut = MeshBuilder.CreateIcoSphere("palmNut", { radius: height * 0.03, subdivisions: 1 }, scene);
      nut.parent = trunk;
      nut.position.set(Math.cos(a) * rad * 1.4, trunkLong / 2 - height * 0.03, Math.sin(a) * rad * 1.4);
      nut.material = nutMat;
      nut.isPickable = false;
    }
  }
}

/*
 * A town ring (renaissance; maps/renaissance_town: the square is walled in by tall townhouses, never trees). Read off the reference: an unbroken row of narrow
 * three- and four-storey houses round the far and side rims, each its own wall colour (ochre, salmon pink, cream, straw), with a dark arcade of round arches
 * along the ground floor, rows of dark windows above, a stone balcony on some, a pale cornice and a low hipped terracotta roof. The near rim, under the
 * placement camera, has only a low cream city wall so the square stays in view. Houses stand TOWN_INSET in from the rim, TOWN_WIDE along it, TOWN_DEEP
 * through, TOWN_STOREY a floor and TOWN_FLOORS floors; the ring trees and the far haze band are taken away. Each material's pieces merge into one mesh.
 */
const TOWN_INSET = 5;
const TOWN_WIDE = [7.5, 10.5];
const TOWN_DEEP = 7;
const TOWN_STOREY = 3.2;
const TOWN_FLOORS = [3, 4];
const TOWN_NEAR = -30;
const TOWN_WALLS = [new Color3(0.93, 0.7, 0.42), new Color3(0.9, 0.58, 0.52), new Color3(0.95, 0.88, 0.74), new Color3(0.95, 0.8, 0.52)];
const TOWN_ROOF = new Color3(0.84, 0.42, 0.26);
function townRing(scene: Scene): void {
  const self = (name: string, c: Color3, lit = 0.42): StandardMaterial => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c.scale(1 - lit);
    m.emissiveColor = c.scale(lit);
    m.specularColor = Color3.Black();
    return m;
  };
  const walls = TOWN_WALLS.map((c, i) => self(`townWall${i}`, c));
  const roof = self("townRoof", TOWN_ROOF);
  const stone = self("townStone", new Color3(0.9, 0.87, 0.8));
  const dark = self("townDark", new Color3(0.3, 0.24, 0.24), 0.2);
  const parts = new Map<StandardMaterial, Mesh[]>();
  const put = (mesh: Mesh, mat: StandardMaterial, root: TransformNode): void => {
    mesh.parent = root;
    mesh.computeWorldMatrix(true);
    (parts.get(mat) ?? parts.set(mat, []).get(mat)!).push(mesh);
  };
  // Clear the ring: the trees round the rim and the haze band behind them
  for (const mesh of scene.meshes) {
    if (mesh.name === "hazeTreeline") mesh.setEnabled(false);
    if (mesh.name === "trunk") {
      const at = mesh.getAbsolutePosition();
      if (!onIsland(at.x, at.z, 18)) mesh.setEnabled(false);
    }
  }
  let k = 0;
  const r = (n: number) => Math.abs((Math.sin(k * 23.117 + n * 41.37) * 31337.77) % 1);
  // Walk the rim by arc length, a house (or a run of wall on the near side) at each step
  const step = 0.004;
  let a = -Math.PI / 2;
  let carried = 0;
  let next = 0;
  let [px, pz] = islandRim(a);
  while (a < Math.PI * 1.5) {
    a += step;
    const [x, z] = islandRim(a);
    carried += Math.hypot(x - px, z - pz);
    px = x;
    pz = z;
    if (carried < next) continue;
    k++;
    const wide = TOWN_WIDE[0] + r(1) * (TOWN_WIDE[1] - TOWN_WIDE[0]);
    carried = 0;
    next = wide;
    const out = Math.hypot(x, z) || 1;
    const cx = x - (x / out) * TOWN_INSET, cz = z - (z / out) * TOWN_INSET;
    const root = new TransformNode("townHouse", scene);
    root.position.set(cx, 0, cz);
    // Its front (local +z) faces the middle of the square
    root.rotation.y = Math.atan2(-cx, -cz);
    root.computeWorldMatrix(true);
    if (cz < TOWN_NEAR) {
      const wall = MeshBuilder.CreateBox("townCityWall", { width: wide * 1.05, depth: 1.4, height: 3.2 }, scene);
      wall.position.y = 0.6;
      put(wall, walls[2], root);
      const cap = MeshBuilder.CreateBox("townCityWallCap", { width: wide * 1.08, depth: 1.8, height: 0.35 }, scene);
      cap.position.y = 2.35;
      put(cap, stone, root);
      continue;
    }
    const floors = TOWN_FLOORS[0] + Math.round(r(2) * (TOWN_FLOORS[1] - TOWN_FLOORS[0]));
    const tall = floors * TOWN_STOREY;
    const front = TOWN_DEEP / 2;
    const body = MeshBuilder.CreateBox("townHouseWall", { width: wide, depth: TOWN_DEEP, height: tall + 1 }, scene);
    body.position.y = (tall - 1) / 2;
    put(body, walls[Math.floor(r(3) * walls.length) % walls.length], root);
    const cornice = MeshBuilder.CreateBox("townCornice", { width: wide * 1.04, depth: TOWN_DEEP * 1.06, height: 0.4 }, scene);
    cornice.position.y = tall + 0.2;
    put(cornice, stone, root);
    // A low hipped roof: a four-sided frustum turned square to the walls, then stretched to them
    const hip = MeshBuilder.CreateCylinder("townRoof", { height: 1, diameterTop: 0.35 * Math.SQRT2, diameterBottom: Math.SQRT2, tessellation: 4 }, scene);
    hip.rotation.y = Math.PI / 4;
    hip.bakeCurrentTransformIntoVertices();
    hip.scaling.set(wide * 1.12, 1.6 + r(4) * 0.8, TOWN_DEEP * 1.14);
    hip.position.y = tall + 0.4 + hip.scaling.y / 2;
    put(hip, roof, root);
    // The ground-floor arcade: round-headed dark arches across the front
    const arches = Math.max(2, Math.floor(wide / 2.6));
    for (let i = 0; i < arches; i++) {
      const ax = (i + 0.5 - arches / 2) * (wide / arches);
      const door = MeshBuilder.CreateBox("townArch", { width: 1.5, depth: 0.2, height: 1.9 }, scene);
      door.position.set(ax, 0.95, front);
      put(door, dark, root);
      const head = MeshBuilder.CreateCylinder("townArchHead", { diameter: 1.5, height: 0.2, tessellation: 10 }, scene);
      head.rotation.x = Math.PI / 2;
      head.position.set(ax, 1.9, front);
      put(head, dark, root);
    }
    // Rows of tall windows on each upper floor, and a stone balcony on the first floor of about half the houses
    const panes = Math.max(2, Math.floor(wide / 2.4));
    for (let f = 1; f < floors; f++) {
      for (let i = 0; i < panes; i++) {
        const pane = MeshBuilder.CreateBox("townWindow", { width: 0.8, depth: 0.16, height: 1.4 }, scene);
        pane.position.set((i + 0.5 - panes / 2) * (wide / panes), f * TOWN_STOREY + 1.4, front);
        put(pane, dark, root);
      }
    }
    if (r(5) < 0.55) {
      const ledge = MeshBuilder.CreateBox("townBalcony", { width: wide * 0.55, depth: 0.9, height: 0.2 }, scene);
      ledge.position.set(0, TOWN_STOREY + 0.6, front + 0.45);
      put(ledge, stone, root);
      const rail = MeshBuilder.CreateBox("townBalconyRail", { width: wide * 0.55, depth: 0.12, height: 0.75 }, scene);
      rail.position.set(0, TOWN_STOREY + 1.05, front + 0.85);
      put(rail, stone, root);
    }
  }
  const shadows = sunShadows(scene);
  const glow = scene.getGlowLayerByName("glow");
  for (const [mat, group] of parts) {
    const merged = Mesh.MergeMeshes(group, true, true);
    if (!merged) continue;
    merged.name = "townRing";
    merged.material = mat;
    merged.isPickable = false;
    merged.receiveShadows = true;
    glow?.addExcludedMesh(merged);
    shadows?.addShadowCaster(merged, false);
  }
  for (const node of scene.transformNodes.filter((n) => n.name === "townHouse")) node.dispose();
}

/*
 * The town square's floor (renaissance; maps/renaissance_town: inside the house row the ground is one pale cream-grey paved plaza, not a meadow, with a
 * round fountain in the middle and nothing else on it). Every bit of meadow dressing the sandbox base scattered on the island (boulders, mounds, trees,
 * rubble walls, bales, stumps, flowers, pebbles, grass, the lawn itself) is put away with its obstacle, and flat flagstones PLAZA_STONE square are laid
 * in running-bond rows at the lawn's height, PLAZA_JOINT apart so the ground slab under them (the theme's grout grey) shows as the joints, each stone one of PLAZA_TONES. The
 * stones sit under the placement guides (zone fills at 0.03), as the lawn did. The fountain is a
 * low round basin of PLAZA_BASIN metres with teal water, a pillar and a raised bowl, one round obstacle.
 */
const PLAZA_STONE = 2.6;
const PLAZA_JOINT = 0.28;
const PLAZA_TOP = 0.02;
const PLAZA_TONES = [new Color3(0.84, 0.8, 0.72), new Color3(0.8, 0.76, 0.67), new Color3(0.87, 0.84, 0.77)];
const PLAZA_BASIN = 7;
const PLAZA_DRESSING = new Set(["boulder", "hill", "trunk", "canopy", "grassTuft", "flowerDot", "pebble", "wallStone", "hayBale", "stump"]);
function townPlaza(scene: Scene, obstacles: MapBuildResult["obstacles"]): void {
  for (const mesh of scene.meshes) {
    if (mesh.name.startsWith("fieldBlades_") || mesh.name === "centerGrass") mesh.setEnabled(false);
    if (!PLAZA_DRESSING.has(mesh.name)) continue;
    const at = mesh.getAbsolutePosition();
    if (onIsland(at.x, at.z)) mesh.setEnabled(false);
  }
  for (let i = obstacles.length - 1; i >= 0; i--) {
    if (onIsland(obstacles[i].center.x, obstacles[i].center.z)) obstacles.splice(i, 1);
  }
  const self = (name: string, c: Color3, lit: number): StandardMaterial => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c.scale(1 - lit);
    m.emissiveColor = c.scale(lit);
    m.specularColor = Color3.Black();
    return m;
  };
  // Flagstones: one flat quad each, gathered per tone into one mesh, kept out of the glow like the houses
  const glow = scene.getGlowLayerByName("glow");
  const tones = PLAZA_TONES.map(() => ({ positions: [] as number[], normals: [] as number[], indices: [] as number[] }));
  const half = (PLAZA_STONE - PLAZA_JOINT) / 2;
  let row = 0;
  for (let z = -ISLAND_DEPTH / 2; z < ISLAND_DEPTH / 2; z += PLAZA_STONE, row++) {
    const shift = (row % 2) * PLAZA_STONE / 2;
    for (let x = -ISLAND_WIDTH / 2 - shift; x < ISLAND_WIDTH / 2; x += PLAZA_STONE) {
      const cx = x + PLAZA_STONE / 2, cz = z + PLAZA_STONE / 2;
      if (!onIsland(cx, cz, 1.2)) continue;
      const pick = Math.abs((Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453) % 1);
      const t = tones[Math.floor(pick * tones.length) % tones.length];
      const base = t.positions.length / 3;
      t.positions.push(cx - half, PLAZA_TOP, cz - half, cx + half, PLAZA_TOP, cz - half, cx + half, PLAZA_TOP, cz + half, cx - half, PLAZA_TOP, cz + half);
      t.normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
      t.indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
  }
  tones.forEach((t, i) => {
    const mesh = new Mesh(`plazaStones${i}`, scene);
    const data = new VertexData();
    data.positions = t.positions;
    data.normals = t.normals;
    data.indices = t.indices;
    data.applyToMesh(mesh);
    mesh.material = self(`plazaStone${i}`, PLAZA_TONES[i], 0.15);
    mesh.isPickable = false;
    mesh.receiveShadows = true;
    glow?.addExcludedMesh(mesh);
  });
  // The fountain: a round stone basin of teal water, a pillar in it and a bowl on the pillar
  const stone = self("plazaFountainStone", new Color3(0.9, 0.86, 0.78), 0.35);
  const water = self("plazaFountainWater", new Color3(0.36, 0.72, 0.78), 0.55);
  const shadows = sunShadows(scene);
  const piece = (mesh: Mesh, mat: StandardMaterial, y: number): void => {
    mesh.position.y = y;
    mesh.material = mat;
    glow?.addExcludedMesh(mesh);
    mesh.isPickable = false;
    mesh.receiveShadows = true;
    shadows?.addShadowCaster(mesh, false);
  };
  piece(MeshBuilder.CreateTorus("plazaFountainRim", { diameter: PLAZA_BASIN - 0.5, thickness: 0.7, tessellation: 16 }, scene), stone, 0.55);
  piece(MeshBuilder.CreateCylinder("plazaFountainWall", { diameter: PLAZA_BASIN, height: 0.55, tessellation: 16 }, scene), stone, 0.28);
  piece(MeshBuilder.CreateCylinder("plazaFountainWater", { diameter: PLAZA_BASIN - 1, height: 0.1, tessellation: 16 }, scene), water, 0.6);
  piece(MeshBuilder.CreateCylinder("plazaFountainPillar", { diameterTop: 0.6, diameterBottom: 0.9, height: 2.2, tessellation: 8 }, scene), stone, 1.1);
  piece(MeshBuilder.CreateCylinder("plazaFountainBowl", { diameterTop: 2.8, diameterBottom: 1.2, height: 0.45, tessellation: 12 }, scene), stone, 2.2);
  piece(MeshBuilder.CreateCylinder("plazaFountainBowlWater", { diameter: 2.4, height: 0.06, tessellation: 12 }, scene), water, 2.43);
  piece(MeshBuilder.CreateSphere("plazaFountainFinial", { diameter: 0.6, segments: 4 }, scene), stone, 2.75);
  obstacles.push({ type: "cylinder", center: new Vector3(0, 0, 0), radius: PLAZA_BASIN / 2 });
}

/** Hides a ring tree and sets a dark broadleaf bush on the ground where it stood (see BUSH_*) */
function broadleafBush(
  scene: Scene, trunk: Mesh, r: (n: number) => number, leaf: StandardMaterial, dark: StandardMaterial,
  glow: ReturnType<Scene["getGlowLayerByName"]>, shadows: ReturnType<typeof sunShadows>,
): void {
  const info = trunk.getBoundingInfo().boundingBox;
  const height = (info.maximum.y - info.minimum.y) / 0.55;
  const foot = trunk.getAbsolutePosition().y - (info.maximum.y - info.minimum.y) / 2 * trunk.scaling.y;
  const at = trunk.getAbsolutePosition();
  trunk.setEnabled(false);
  const tall = height * BUSH_TALL * (0.8 + r(5) * 0.4);
  const wide = height * BUSH_WIDE * (0.8 + r(6) * 0.4);
  const root = new Mesh("bush", scene);
  root.position.set(at.x, foot, at.z);
  root.rotation.y = r(7) * Math.PI * 2;
  const parts: Mesh[] = [];
  const lumps = BUSH_LUMPS[0] + Math.round(r(8) * (BUSH_LUMPS[1] - BUSH_LUMPS[0]));
  for (let i = 0; i < lumps; i++) {
    const a = (i / lumps) * Math.PI * 2 + r(60 + i);
    const off = i === 0 ? 0 : wide * 0.28;
    const size = (i === 0 ? 1 : 0.7 + r(70 + i) * 0.25) * wide * 0.6;
    const lump = MeshBuilder.CreateIcoSphere("bushLump", { radius: size / 2, subdivisions: 1, flat: true }, scene);
    lump.scaling.y = (tall / size) * (i === 0 ? 1.1 : 0.75);
    lump.position.set(Math.cos(a) * off, tall * (i === 0 ? 0.5 : 0.36), Math.sin(a) * off);
    lump.rotation.y = r(80 + i) * Math.PI;
    lump.material = i % 2 === 0 ? dark : leaf;
    parts.push(lump);
  }
  // Broad pointed leaves: a flattened four-sided spindle leaning out of the mound, each pitched up and turned round the bush
  const leaves = BUSH_LEAVES[0] + Math.round(r(9) * (BUSH_LEAVES[1] - BUSH_LEAVES[0]));
  for (let i = 0; i < leaves; i++) {
    const yaw = (i / leaves) * Math.PI * 2 + r(90 + i) * 0.5;
    const long = wide * (0.55 + r(100 + i) * 0.25);
    const blade = MeshBuilder.CreateCylinder("bushLeaf", { height: long, diameterTop: 0, diameterBottom: long * 0.42, tessellation: 4 }, scene);
    blade.scaling.z = 0.12;
    blade.bakeCurrentTransformIntoVertices();
    blade.position.y = long / 2;
    blade.bakeCurrentTransformIntoVertices();
    const stem = new Mesh("bushStem", scene);
    stem.parent = root;
    stem.position.set(Math.sin(yaw) * wide * 0.15, tall * 0.55, Math.cos(yaw) * wide * 0.15);
    stem.rotation.set(0.9 + r(110 + i) * 0.35, yaw, 0);
    blade.parent = stem;
    blade.material = i % 3 === 0 ? dark : leaf;
    parts.push(blade);
  }
  for (const part of parts) {
    if (!part.parent) part.parent = root;
    part.isPickable = false;
    glow?.addExcludedMesh(part);
    shadows?.addShadowCaster(part, false);
  }
}

/*
 * Sea (pirate; maps/pirate_beach: the sand island sits in turquoise shallows, a pale wet-sand edge where the water meets the beach and the ships moored in
 * the cove). A band SEA_RIM metres wide of opaque turquoise runs round the whole island rim, a paler shore strip SEA_SHORE wide along its inner edge.
 */
const SEA_RIM = 5;
const SEA_SHORE = 1.2;
const SEA_GLOW = 0.3;
/** Sea cloth: partly self-lit so the shaded side of the cove stays turquoise, kept out of the glow layer so it does not bloom a haze over the field */
function seaMaterial(scene: Scene, name: string, colour: Color3, mesh?: Mesh): StandardMaterial {
  const mat = new StandardMaterial(name, scene);
  mat.diffuseColor = colour.scale(1 - SEA_GLOW);
  mat.emissiveColor = colour.scale(SEA_GLOW);
  mat.specularColor = new Color3(0.05, 0.05, 0.05);
  if (mesh) scene.getGlowLayerByName("glow")?.addExcludedMesh(mesh);
  return mat;
}
function seaRim(scene: Scene, sea: NonNullable<CampaignMapTheme["sea"]>): void {
  const band = (name: string, inner: number, outer: number, y: number, colour: Color3) => {
    const positions: number[] = [], normals: number[] = [], indices: number[] = [];
    const steps = 160;
    for (let i = 0; i <= steps; i++) {
      const [x, z] = islandRim((i / steps) * Math.PI * 2);
      const d = Math.hypot(x, z);
      for (const inset of [outer, inner]) {
        const f = 1 - inset / d;
        positions.push(x * f, y, z * f);
        normals.push(0, 1, 0);
      }
      if (i < steps) {
        const b = i * 2;
        indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
      }
    }
    const mesh = new Mesh(name, scene);
    const data = new VertexData();
    data.positions = positions;
    data.normals = normals;
    data.indices = indices;
    data.applyToMesh(mesh);
    const mat = seaMaterial(scene, `${name}Mat`, colour, mesh);
    mat.backFaceCulling = false;
    mesh.material = mat;
    mesh.isPickable = false;
    mesh.receiveShadows = true;
  };
  band("seaShore", SEA_RIM, SEA_RIM + SEA_SHORE, 0.06, sea.shore);
  band("seaRim", 0, SEA_RIM, 0.07, sea.water);
}

/*
 * Pirate shoreline, rebuilt from maps/pirate_beach (spec, read off the reference at the placement view):
 *   - One sand. The whole island top is a single pale sand, the fighting field included: no second, olive or grey field colour, no seam where the field
 *     meets the beach (the theme's ground and grass are that sand; see campaign.pirate).
 *   - Water only in the coves and round the rim. The palms and bushes stand on beaches and spits with ragged, faceted edges (about 8-10 facets a lobe, each
 *     corner 0.6-1.4x the lobe radius), the turquoise only between them; the field's edge against the shallows is scalloped in rounded teeth, never a
 *     ruled line.
 *   - The wet edge is the waterline and nothing else: a thin pale band, about 0.15-0.2 of a lobe radius wide, drawn only where sand meets water. Where sand
 *     meets sand (lobe against field, lobe against lobe, the field's ends) there is no line at all: 0 metres of wet edge on dry land.
 * Mechanism: under every ring tree lies a lobe of dry sand, an irregular SPIT_SIDES-gon of radius SPIT_RADIUS[0]-[1] m with each corner jittered by up to
 * SPIT_JITTER of it, pushed SPIT_OUT of its radius out toward the rim; along each pool's edges a row of smaller lobes (SPIT_EDGE[0]-[1] m, one every
 * SPIT_EDGE_STEP m) straddles the line. Round every lobe runs a wet ring SPIT_WET m wide, but only as a band outside the dry edge (never a fan under it), and
 * each corner of that band reaches out only when the spot it reaches lies over water (overWater: inside a pool, or within SEA_RIM of the island rim);
 * over land the band pinches to nothing, so the dry sand runs straight into the field.
 */
const SPIT_SIDES = 9;
const SPIT_RADIUS = [2.6, 4.6];
const SPIT_JITTER = 0.38;
const SPIT_OUT = 0.35;
const SPIT_WET = 0.7;
const SPIT_EDGE = [1.3, 2.4];
const SPIT_EDGE_STEP = 3.2;
const SPIT_SAND = new Color3(0.8, 0.66, 0.4);
const SPIT_SAND_GLOW = 0.12;
function sandSpits(scene: Scene, sea: NonNullable<CampaignMapTheme["sea"]>, hazards: readonly HazardRegion[]): void {
  const dry: number[] = [], wet: number[] = [];
  const pools = hazards.filter((hazard) => hazard.kind === "water" && hazard.shape === "box");
  // Water under a spot: inside a pool, or out in the band of sea round the island rim
  const overWater = (x: number, z: number): boolean => {
    for (const pool of pools) {
      if (pool.shape === "box" && Math.abs(x - pool.center.x) <= pool.halfX && Math.abs(z - pool.center.z) <= pool.halfZ) return true;
    }
    const [rx, rz] = islandRim(Math.atan2(z, x));
    return Math.hypot(x, z) >= Math.hypot(rx, rz) - SEA_RIM;
  };
  let k = 0;
  const lobe = (x: number, z: number, radius: number) => {
    k++;
    const r = (n: number) => Math.abs((Math.sin(k * 23.117 + n * 41.73) * 31337.177) % 1);
    const turn = r(1) * Math.PI * 2;
    const corners = Array.from({ length: SPIT_SIDES }, (_, i) => {
      const a = turn + (i / SPIT_SIDES) * Math.PI * 2;
      const d = radius * (1 - SPIT_JITTER + r(2 + i) * SPIT_JITTER * 2);
      // The wet band reaches out from this corner only over water; over land it pinches shut on the dry edge
      const reach = overWater(x + Math.cos(a) * (d + SPIT_WET), z + Math.sin(a) * (d + SPIT_WET)) ? SPIT_WET : 0;
      return [a, d, reach];
    });
    corners.forEach(([a, d, reach], i) => {
      const [b, e, reachB] = corners[(i + 1) % SPIT_SIDES];
      const ax = x + Math.cos(a) * d, az = z + Math.sin(a) * d, bx = x + Math.cos(b) * e, bz = z + Math.sin(b) * e;
      dry.push(x, z, ax, az, bx, bz);
      if (reach === 0 && reachB === 0) return;
      // The wet band: a quad outside the dry edge, from the edge out to each corner's reach
      const aox = x + Math.cos(a) * (d + reach), aoz = z + Math.sin(a) * (d + reach);
      const box = x + Math.cos(b) * (e + reachB), boz = z + Math.sin(b) * (e + reachB);
      wet.push(ax, az, aox, aoz, box, boz, ax, az, box, boz, bx, bz);
    });
  };
  for (const mesh of scene.meshes) {
    if (mesh.name !== "canopy" || !(mesh.parent instanceof Mesh) || mesh.parent.name !== "trunk") continue;
    const at = mesh.parent.getAbsolutePosition();
    const d = Math.hypot(at.x, at.z) || 1;
    const radius = SPIT_RADIUS[0] + Math.abs((Math.sin(at.x * 3.71 + at.z * 1.93) * 9137.3) % 1) * (SPIT_RADIUS[1] - SPIT_RADIUS[0]);
    lobe(at.x + (at.x / d) * radius * SPIT_OUT, at.z + (at.z / d) * radius * SPIT_OUT, radius);
  }
  for (const hazard of hazards) {
    if (hazard.kind !== "water" || hazard.shape !== "box") continue;
    const { x: cx, z: cz } = hazard.center;
    const edges: [number, number, number, number, number, number][] = [
      // [from x, from z, step x, step z, out x, out z]: the outward side is away from the pool
      [cx - hazard.halfX, cz - hazard.halfZ, 1, 0, 0, -1], [cx - hazard.halfX, cz + hazard.halfZ, 1, 0, 0, 1],
      [cx - hazard.halfX, cz - hazard.halfZ, 0, 1, -1, 0], [cx + hazard.halfX, cz - hazard.halfZ, 0, 1, 1, 0],
    ];
    for (const [fx, fz, sx, sz, ox, oz] of edges) {
      const long = sx ? hazard.halfX * 2 : hazard.halfZ * 2;
      const n = Math.max(2, Math.round(long / SPIT_EDGE_STEP));
      for (let i = 0; i <= n; i++) {
        const t = (i / n) * long;
        const radius = SPIT_EDGE[0] + Math.abs((Math.sin((fx + t * sx) * 2.9 + (fz + t * sz) * 5.3) * 7193.1) % 1) * (SPIT_EDGE[1] - SPIT_EDGE[0]);
        lobe(fx + t * sx + ox * radius * 0.25, fz + t * sz + oz * radius * 0.25, radius);
      }
    }
  }
  for (const [name, tris, y, colour] of [["sandWet", wet, 0.078, Color3.Lerp(sea.shore, sea.water, 0.45)], ["sandSpit", dry, 0.086, Color3.Lerp(sea.shore, SPIT_SAND, 0.6)]] as const) {
    const positions: number[] = [], indices: number[] = [];
    for (let i = 0; i < tris.length; i += 2) {
      positions.push(tris[i], y, tris[i + 1]);
      indices.push(i / 2);
    }
    const mesh = new Mesh(name, scene);
    const data = new VertexData();
    data.positions = positions;
    data.indices = indices;
    data.normals = positions.map((_, i) => (i % 3 === 1 ? 1 : 0));
    data.applyToMesh(mesh);
    mesh.isPickable = false;
    mesh.receiveShadows = true;
    // One sand: the dry spits wear the lawn's own material, so beach and field meet without a seam
    const lawn = name === "sandSpit" ? scene.getMaterialByName("grass") as StandardMaterial | null : null;
    if (lawn) {
      lawn.emissiveColor = SPIT_SAND.scale(SPIT_SAND_GLOW);
      lawn.backFaceCulling = false;
      mesh.material = lawn;
      continue;
    }
    const mat = seaMaterial(scene, `${name}Mat`, colour, mesh);
    mat.backFaceCulling = false;
    mesh.material = mat;
  }
}

/*
 * An autumn field (maps/autumn_tribal_1: the island top is one warm orange lawn, ochre where it wears thin, never a dusty mauve; spiky orange and yellow grass
 * clumps stand in a band along the foot of the tree ring and dot the open field). The sandbox lawn's plum self-light suits its saturated orange; under a
 * campaign theme's own colours it is what turned the field mauve, so a theme with a field sets the lawn, the dry rim, both blade shades and the ground from
 * its own colours and swaps the plum self-light for its own warm glow. Clumps: FIELD_TUFTS clumps, FIELD_TUFT_RING_SHARE of them in the band FIELD_TUFT_BAND
 * of the ring radii in from the trees, the rest over the open field clear of the hazards; each is FIELD_TUFT_CARDS[0]-[1] crossed spiky cards
 * FIELD_TUFT_TALL[0]-[1] m high, one palette colour per clump, self-lit FIELD_TUFT_GLOW so a clump in shade stays orange.
 */
const FIELD_TUFTS = 260;
const FIELD_TUFT_RING_SHARE = 0.7;
const FIELD_TUFT_BAND = [0.8, 0.97];
const FIELD_TUFT_CARDS = [3, 5];
const FIELD_TUFT_TALL = [0.9, 1.5];
const FIELD_TUFT_GLOW = 0.45;
function autumnField(scene: Scene, field: NonNullable<CampaignMapTheme["field"]>): void {
  const set = (name: string, diffuse: Color3, glow: Color3) => {
    const mat = scene.getMaterialByName(name) as StandardMaterial | null;
    if (!mat) return;
    mat.diffuseColor = diffuse;
    mat.emissiveColor = glow;
  };
  set("groundMat", field.ground, field.glow);
  set("grass", field.grass, field.glow);
  set("dryGrass", Color3.Lerp(field.ground, field.grass, 0.45), field.glow);
  set("grassBladeDark", field.grass.scale(BLADE_DARK), field.glow);
  set("grassBladeLight", field.grass.scale(BLADE_LIGHT), field.glow);
  if (field.tufts.length === 0) return;
  const rand = (k: number, n: number) => Math.abs((Math.sin(k * 17.231 + n * 41.77) * 24634.634) % 1);
  const perColour = field.tufts.map(() => ({ positions: [] as number[], normals: [] as number[], indices: [] as number[] }));
  for (let k = 0; k < FIELD_TUFTS; k++) {
    let x: number, z: number;
    if (rand(k, 1) < FIELD_TUFT_RING_SHARE) {
      const a = rand(k, 2) * Math.PI * 2;
      const band = FIELD_TUFT_BAND[0] + rand(k, 3) * (FIELD_TUFT_BAND[1] - FIELD_TUFT_BAND[0]);
      x = Math.cos(a) * TREE_RING_X * band;
      z = Math.sin(a) * TREE_RING_Z * band;
    } else {
      x = (rand(k, 2) - 0.5) * TREE_RING_X * 1.5;
      z = (rand(k, 3) - 0.5) * TREE_RING_Z * 1.5;
      // Clear of the challenge pits and the middle lane where the lines meet
      if (Math.abs(Math.abs(z) - 16) < 7.5 || Math.abs(x) < 4) continue;
    }
    if (!onIsland(x, z, 2)) continue;
    const bucket = perColour[Math.floor(rand(k, 4) * field.tufts.length) % field.tufts.length];
    const cards = FIELD_TUFT_CARDS[0] + Math.floor(rand(k, 5) * (FIELD_TUFT_CARDS[1] - FIELD_TUFT_CARDS[0] + 1));
    const tall = FIELD_TUFT_TALL[0] + rand(k, 6) * (FIELD_TUFT_TALL[1] - FIELD_TUFT_TALL[0]);
    for (let c = 0; c < cards; c++) {
      // Each card a spike splayed out from the clump's foot: a narrow root, a pointed tip leaning away
      const yaw = (c / cards + rand(k * 7 + c, 7) * 0.3) * Math.PI;
      const splay = (rand(k * 7 + c, 8) - 0.5) * 0.7;
      const h = tall * (0.65 + rand(k * 7 + c, 9) * 0.35);
      const half = 0.16 + rand(k * 7 + c, 10) * 0.1;
      const dx = Math.cos(yaw) * half, dz = Math.sin(yaw) * half;
      const lx = -Math.sin(yaw) * splay * h, lz = Math.cos(yaw) * splay * h;
      const base = bucket.positions.length / 3;
      bucket.positions.push(
        x - dx, BLADE_ROOT_Y, z - dz, x + dx, BLADE_ROOT_Y, z + dz, x + lx, BLADE_ROOT_Y + h, z + lz,
      );
      bucket.normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0);
      bucket.indices.push(base, base + 1, base + 2);
    }
  }
  const shadows = sunShadows(scene);
  field.tufts.forEach((colour, i) => {
    const bucket = perColour[i];
    if (bucket.positions.length === 0) return;
    const mat = new StandardMaterial(`fieldTuft${i}`, scene);
    mat.diffuseColor = colour.scale(1 - FIELD_TUFT_GLOW);
    mat.emissiveColor = colour.scale(FIELD_TUFT_GLOW);
    mat.specularColor = Color3.Black();
    mat.backFaceCulling = false;
    const mesh = new Mesh(`fieldTufts_${i}`, scene);
    const data = new VertexData();
    data.positions = bucket.positions;
    data.normals = bucket.normals;
    data.indices = bucket.indices;
    data.applyToMesh(mesh);
    mesh.material = mat;
    mesh.isPickable = false;
    mesh.receiveShadows = true;
    shadows?.addShadowCaster(mesh, false);
  });
}

/*
 * A ball ring (autumn; maps/autumn_tribal_1: every ring tree is a lollipop, one round crown on a thin pale stalk, and neighbouring crowns differ: orange,
 * red, yellow and yellow-green mixed through the ring, so it reads as a speckled autumn wood and not one sage mass). Each ring tree takes a seeded colour
 * from the palette (balls) on its own crown material; a broadleaf's three lobes are hidden and it carries one ball BALL_OF_HEIGHT of its height across
 * instead, so the whole ring is balls. The crown materials are lit like the theme crowns (diffuse 0.38, self-light 0.62) and take the canopy haze.
 */
const BALL_OF_HEIGHT = 0.5;
function ballRing(scene: Scene, palette: Color3[]): void {
  const base = scene.getMaterialByName("leavesCrown") as StandardMaterial | null;
  if (!base || palette.length === 0) return;
  const crowns = palette.map((color, i) => {
    const crown = base.clone(`autumnBall${i}Crown`);
    crown.diffuseColor = color.scale(0.38);
    crown.emissiveColor = color.scale(0.62);
    if (!crown.pluginManager?.getPlugin("CanopyAerial")) new CanopyAerialPlugin(crown);
    return crown;
  });
  const trunks = new Set<Mesh>();
  for (const mesh of scene.meshes) {
    if (mesh.name === "canopy" && mesh.parent instanceof Mesh && mesh.parent.name === "trunk") trunks.add(mesh.parent);
  }
  const glow = scene.getGlowLayerByName("glow");
  const shadows = sunShadows(scene);
  let k = 0;
  for (const trunk of trunks) {
    k++;
    const r = (n: number) => Math.abs((Math.sin(k * 23.417 + n * 37.13) * 31871.553) % 1);
    const crown = crowns[Math.floor(r(1) * crowns.length) % crowns.length];
    const lobes = trunk.getChildMeshes().filter((child) => child.name === "canopy" && child.isEnabled());
    if (lobes.length === 1) {
      lobes[0].material = crown;
      continue;
    }
    for (const lobe of lobes) lobe.setEnabled(false);
    const info = trunk.getBoundingInfo().boundingBox;
    const trunkLong = info.maximum.y - info.minimum.y;
    const radius = (trunkLong / 0.5) * BALL_OF_HEIGHT * 0.5;
    const ball = MeshBuilder.CreateIcoSphere("canopy", { radius, subdivisions: 2 }, scene);
    ball.parent = trunk;
    ball.position.set(0, trunkLong / 2 + radius * 0.7, 0);
    ball.scaling.y = 0.9;
    ball.rotation.y = r(2) * Math.PI;
    ball.material = crown;
    ball.receiveShadows = false;
    ball.isPickable = false;
    ball.convertToFlatShadedMesh();
    glow?.addExcludedMesh(ball);
    shadows?.addShadowCaster(ball, false);
  }
}

/*
 * An oak ring (meadow; maps/meadow_medieval_1: the island is ringed by broad dark-green oaks, never pale puffballs on stalks). Read off the reference: a
 * stout brown trunk that leans one way and kinks back the other (two boles, OAK_LEAN off upright, the lower OAK_BOLE of the tree's height and thick), forking
 * at its top into OAK_LIMBS limbs that reach out and up, under one broad crown wider than tall: a flat dome OAK_CROWN of the height across, squashed
 * OAK_SQUASH, with a lump at each limb end and OAK_SKIRT lumps hung round its rim, so the canopy is a lumpy umbrella with trunk showing under it. The tree
 * is OAK_SCALE the size of the stalk it replaces. A seeded share (oaks) of the trees takes this form; the old stalk (now hidden) stays as the parent and
 * keeps its obstacle. The lumps wear their own part self-lit copies of the theme's ring leaves, without the crown haze that pales the puffballs to sage;
 * the boles wear the trunk material, darkened to bark.
 */
const OAK_SCALE = 1.35;
const OAK_LEAN = [0.18, 0.4];
const OAK_BOLE = 0.34;
const OAK_LIMBS = 2;
const OAK_CROWN = 0.62;
const OAK_SQUASH = 0.5;
const OAK_SKIRT = 3;
function oakRing(scene: Scene, share: number, bark: Color3): void {
  const leaf = (name: string, from: string): StandardMaterial | null => {
    const source = scene.getMaterialByName(from) as StandardMaterial | null;
    if (!source) return null;
    const mat = new StandardMaterial(name, scene);
    mat.diffuseColor = source.diffuseColor.scale(0.6);
    mat.emissiveColor = source.diffuseColor.scale(0.4);
    mat.specularColor = Color3.Black();
    return mat;
  };
  const light = leaf("oakLeaves", "leaves");
  const dark = leaf("oakLeavesDark", "darkLeaves");
  const wood = scene.getMaterialByName("trunk") as StandardMaterial | null;
  if (!light || !dark || !wood) return;
  wood.diffuseColor = bark;
  wood.emissiveColor = bark.scale(0.25);
  const trunks = new Set<Mesh>();
  for (const mesh of scene.meshes) {
    if (mesh.name === "canopy" && mesh.parent instanceof Mesh && mesh.parent.name === "trunk") trunks.add(mesh.parent);
  }
  const glow = scene.getGlowLayerByName("glow");
  const shadows = sunShadows(scene);
  const up = new Vector3(0, 1, 0);
  let k = 0;
  for (const trunk of trunks) {
    k++;
    const r = (n: number) => Math.abs((Math.sin(k * 19.411 + n * 47.13) * 27183.2818) % 1);
    if (r(1) > share) continue;
    for (const child of trunk.getChildMeshes()) if (child.name === "canopy") child.setEnabled(false);
    trunk.isVisible = false;
    const info = trunk.getBoundingInfo().boundingBox;
    const trunkLong = info.maximum.y - info.minimum.y;
    const height = (trunkLong / 0.6) * OAK_SCALE;
    const finish = (mesh: Mesh, mat: StandardMaterial): void => {
      mesh.parent = trunk;
      mesh.material = mat;
      mesh.isPickable = false;
      mesh.convertToFlatShadedMesh();
      glow?.addExcludedMesh(mesh);
      shadows?.addShadowCaster(mesh, false);
    };
    // A tapered cylinder from one point to another, in the stalk's own frame
    const bole = (from: Vector3, to: Vector3, foot: number, head: number): void => {
      const span = to.subtract(from);
      const mesh = MeshBuilder.CreateCylinder("oakBole", { height: span.length(), diameterBottom: foot, diameterTop: head, tessellation: 6 }, scene);
      mesh.position = from.add(span.scale(0.5));
      const dir = span.normalize();
      const axis = Vector3.Cross(up, dir);
      mesh.rotationQuaternion = axis.length() < 1e-4 ? Quaternion.Identity() : Quaternion.RotationAxis(axis.normalize(), Math.acos(Math.min(1, Vector3.Dot(up, dir))));
      mesh.receiveShadows = true;
      finish(mesh, wood);
    };
    const lump = (at: Vector3, radius: number, squash: number, n: number): void => {
      const mesh = MeshBuilder.CreateIcoSphere("oakCrown", { radius, subdivisions: 1 }, scene);
      mesh.position = at;
      mesh.scaling.y = squash;
      mesh.rotation.y = r(n) * Math.PI;
      mesh.receiveShadows = false;
      finish(mesh, r(n + 1) > 0.45 ? dark : light);
    };
    const lean = (tilt: number, yaw: number) => new Vector3(Math.sin(tilt) * Math.sin(yaw), Math.cos(tilt), Math.sin(tilt) * Math.cos(yaw));
    // Two boles: the lower leans one way, the upper kinks back across it
    const foot = new Vector3(0, -trunkLong / 2, 0);
    const yaw = r(2) * Math.PI * 2;
    const bend = lean(OAK_LEAN[0] + r(3) * (OAK_LEAN[1] - OAK_LEAN[0]), yaw);
    const knee = foot.add(bend.scale(height * OAK_BOLE));
    const top = knee.add(lean(OAK_LEAN[1], yaw + Math.PI * (0.6 + r(4) * 0.5)).scale(height * 0.2));
    bole(foot, knee, height * 0.14, height * 0.1);
    bole(knee, top, height * 0.1, height * 0.07);
    // The broad crown over the fork, a lump at each limb end and more hung round the rim
    const crown = height * OAK_CROWN / 2;
    const dome = top.add(new Vector3(0, crown * 0.32, 0));
    lump(dome, crown, OAK_SQUASH, 10);
    for (let i = 0; i < OAK_LIMBS; i++) {
      const out = yaw + Math.PI * (i + 0.3 + r(20 + i) * 0.4);
      const end = top.add(lean(0.95, out).scale(height * 0.22));
      bole(top, end, height * 0.06, height * 0.035);
      lump(end.add(new Vector3(0, crown * 0.18, 0)), crown * 0.62, OAK_SQUASH + 0.08, 30 + i * 2);
    }
    for (let i = 0; i < OAK_SKIRT; i++) {
      const around = yaw + (i / OAK_SKIRT) * Math.PI * 2 + r(40 + i) * 0.9;
      const at = dome.add(new Vector3(Math.sin(around) * crown * 0.72, -crown * 0.12 + r(50 + i) * crown * 0.2, Math.cos(around) * crown * 0.72));
      lump(at, crown * (0.48 + r(60 + i) * 0.16), OAK_SQUASH + 0.1, 70 + i * 2);
    }
  }
}

/*
 * A cherry ring (dynasty; maps/dynasty.png, units/dynasty.dragon: the island's trees are pale pink, never sage). Spec read off the reference: two kinds stand
 * mixed. Tall ones are a thin stalk with one big pink ball (the base lollipops, recoloured by the theme). The rest are cherries: a crooked tan trunk forking at
 * its top into CHERRY_LIMBS[0]-[1] limbs that reach out and up at CHERRY_TILT off upright, CHERRY_LIMB of the tree's height long, each carrying a cluster of
 * two or three faceted puffs, plus one cluster on the trunk top, so the crown is 3-5 separate lumps with sky between them, wider than tall (puffs squashed
 * CHERRY_SQUASH), each lump CHERRY_PUFF of the height across. A seeded share (blossom) of the trees takes this form; their single ball or broadleaf is hidden.
 * The puffs wear the leavesCrown / darkLeavesCrown materials so the canopy haze and the theme's crown light reach them.
 */
const CHERRY_LIMBS = [2, 4];
const CHERRY_TILT = [0.6, 1.05];
const CHERRY_LIMB = [0.32, 0.5];
const CHERRY_PUFF = [0.16, 0.24];
const CHERRY_SQUASH = 0.72;
function blossomRing(scene: Scene, share: number): void {
  const light = scene.getMaterialByName("leavesCrown") as StandardMaterial | null;
  const dark = scene.getMaterialByName("darkLeavesCrown") as StandardMaterial | null;
  if (!light || !dark) return;
  const trunks = new Set<Mesh>();
  for (const mesh of scene.meshes) {
    if (mesh.name === "canopy" && mesh.parent instanceof Mesh && mesh.parent.name === "trunk") trunks.add(mesh.parent);
  }
  const glow = scene.getGlowLayerByName("glow");
  const shadows = sunShadows(scene);
  let k = 0;
  for (const trunk of trunks) {
    k++;
    const r = (n: number) => Math.abs((Math.sin(k * 17.137 + n * 51.71) * 24634.6345) % 1);
    if (r(1) > share) continue;
    for (const child of trunk.getChildMeshes()) if (child.name === "canopy") child.setEnabled(false);
    const info = trunk.getBoundingInfo().boundingBox;
    const trunkLong = info.maximum.y - info.minimum.y;
    const height = trunkLong / 0.6; // the stalk is 0.6 of the tree
    const top = new Vector3(0, trunkLong / 2, 0);
    // The trunk itself kinks: lean it further off upright so it reads crooked, not a pole
    trunk.rotation.x += (r(2) - 0.5) * 0.35;
    trunk.rotation.z += (r(3) - 0.5) * 0.35;
    const puff = (at: Vector3, radius: number, n: number): void => {
      const ball = MeshBuilder.CreateIcoSphere("blossom", { radius, subdivisions: 1 }, scene);
      ball.parent = trunk;
      ball.position = at;
      ball.scaling.y = CHERRY_SQUASH;
      ball.rotation.y = r(n) * Math.PI;
      ball.material = r(n + 1) > 0.3 ? light : dark;
      ball.receiveShadows = false;
      ball.isPickable = false;
      ball.convertToFlatShadedMesh();
      glow?.addExcludedMesh(ball);
      shadows?.addShadowCaster(ball, false);
    };
    const cluster = (at: Vector3, n: number): void => {
      const big = height * (CHERRY_PUFF[0] + r(n) * (CHERRY_PUFF[1] - CHERRY_PUFF[0]));
      puff(at, big, n + 1);
      const lumps = 1 + Math.round(r(n + 2));
      for (let j = 0; j < lumps; j++) {
        const yaw = r(n + 3 + j) * Math.PI * 2;
        puff(at.add(new Vector3(Math.cos(yaw) * big * 0.85, -big * 0.2 + r(n + 5 + j) * big * 0.4, Math.sin(yaw) * big * 0.85)), big * (0.55 + r(n + 7 + j) * 0.2), n + 9 + j);
      }
    };
    const limbs = CHERRY_LIMBS[0] + Math.round(r(4) * (CHERRY_LIMBS[1] - CHERRY_LIMBS[0]));
    for (let i = 0; i < limbs; i++) {
      const yaw = (i / limbs) * Math.PI * 2 + r(10 + i) * 1.1;
      const tilt = CHERRY_TILT[0] + r(20 + i) * (CHERRY_TILT[1] - CHERRY_TILT[0]);
      const length = height * (CHERRY_LIMB[0] + r(30 + i) * (CHERRY_LIMB[1] - CHERRY_LIMB[0]));
      const dir = new Vector3(Math.sin(tilt) * Math.sin(yaw), Math.cos(tilt), Math.sin(tilt) * Math.cos(yaw));
      const from = top.add(new Vector3(0, -trunkLong * 0.18 * (i % 2), 0));
      const rad = height * 0.03;
      const limb = MeshBuilder.CreateCylinder("cherryLimb", { height: length, diameterTop: rad, diameterBottom: rad * 1.8, tessellation: 5 }, scene);
      limb.parent = trunk;
      limb.position = from.add(dir.scale(length / 2));
      const axis = Vector3.Cross(Vector3.Up(), dir);
      if (axis.lengthSquared() > 1e-6) limb.rotationQuaternion = Quaternion.RotationAxis(axis.normalize(), Math.acos(Vector3.Dot(Vector3.Up(), dir)));
      limb.material = trunk.material;
      limb.isPickable = false;
      glow?.addExcludedMesh(limb);
      shadows?.addShadowCaster(limb, false);
      cluster(from.add(dir.scale(length)), 40 + i * 20);
    }
    cluster(top.add(new Vector3(0, height * 0.08, 0)), 200);
  }
}

/*
 * A dead ring (spooky; tabs_screenshot_09: black bare trees are the skyline): a seeded share of the ring trees out past RING_DEAD_FROM drop their crowns
 * and stand bare, each trunk forking into three or four angled limbs with a twig on each, in the trunk's dark colour; the rest keep the theme's dark canopy.
 */
const RING_DEAD_FROM = 30;
function deadenRing(scene: Scene, share: number, color: Color3): void {
  const wood = new StandardMaterial("deadRingWood", scene);
  wood.diffuseColor = color;
  wood.specularColor = Color3.Black();
  const trunks = new Set<Mesh>();
  for (const mesh of scene.meshes) {
    if (mesh.name === "canopy" && mesh.parent instanceof Mesh && mesh.parent.name === "trunk") trunks.add(mesh.parent);
  }
  let k = 0;
  for (const trunk of trunks) {
    k++;
    const at = trunk.position;
    if (Math.hypot(at.x, at.z) < RING_DEAD_FROM) continue;
    const r = (n: number) => (Math.sin(k * 12.9898 + n * 78.233) * 43758.5453) % 1;
    const pick = Math.abs(r(1));
    if (pick > share) continue;
    for (const child of trunk.getChildMeshes()) if (child.name === "canopy") child.setEnabled(false);
    const info = trunk.getBoundingInfo().boundingBox;
    const height = info.maximum.y - info.minimum.y;
    const top = new Vector3(0, height / 2, 0);
    const limbs = 3 + Math.round(Math.abs(r(2)));
    for (let i = 0; i < limbs; i++) {
      const yaw = (i / limbs) * Math.PI * 2 + Math.abs(r(3 + i)) * 1.2;
      const tilt = 0.55 + Math.abs(r(9 + i)) * 0.5;
      const length = height * (0.45 + Math.abs(r(15 + i)) * 0.35);
      const dir = new Vector3(Math.sin(tilt) * Math.sin(yaw), Math.cos(tilt), Math.sin(tilt) * Math.cos(yaw));
      const from = top.add(new Vector3(0, -height * 0.15 * (i % 2), 0));
      for (const [len, rad, d] of [[length, height * 0.035, dir], [length * 0.5, height * 0.018, new Vector3(dir.x * 0.4, 1, dir.z * 0.4).normalize()]] as const) {
        const limb = MeshBuilder.CreateCylinder("deadLimb", { height: len, diameterTop: rad, diameterBottom: rad * 2, tessellation: 5 }, scene);
        limb.parent = trunk;
        const base = d === dir ? from : from.add(dir.scale(length));
        limb.position = base.add(d.scale(len / 2));
        const axis = Vector3.Cross(Vector3.Up(), d);
        if (axis.lengthSquared() > 1e-6) limb.rotationQuaternion = Quaternion.RotationAxis(axis.normalize(), Math.acos(Vector3.Dot(Vector3.Up(), d)));
        limb.material = wood;
        limb.isPickable = false;
      }
    }
    trunk.material = wood;
  }
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

function createHazardVisuals(scene: Scene, hazards: readonly HazardRegion[], sea?: CampaignMapTheme["sea"]): void {
  const hazardColor = (kind: HazardKind): Color3 => {
    switch (kind) {
      case "water": return new Color3(0.18, 0.46, 0.78);
      case "pit": return new Color3(0.16, 0.10, 0.08);
      case "void": return new Color3(0.36, 0.16, 0.44);
    }
  };
  for (const hazard of hazards) {
    // A sea theme's pools are solid turquoise shallows on a pale shore strip (see seaRim), not a see-through tint
    if (sea && hazard.kind === "water" && hazard.shape === "box") {
      for (const [name, grow, y, colour] of [["shore", SEA_SHORE * 2, 0.05, sea.shore], ["water", 0, 0.065, sea.water]] as const) {
        const mesh = MeshBuilder.CreateGround(`campaign_hazard_sea_${name}`, { width: hazard.halfX * 2 + grow, height: hazard.halfZ * 2 + grow }, scene);
        mesh.position.set(hazard.center.x, y, hazard.center.z);
        mesh.material = seaMaterial(scene, `campaign_hazard_sea_${name}_${hazard.center.z}`, colour, mesh);
        mesh.receiveShadows = true;
        mesh.isPickable = false;
      }
      continue;
    }
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
  /*
   * Graveyard dressing (spooky; tabs_screenshot_09, 03): bare dead trees, a crooked dark trunk forking into a few angled bare limbs with no canopy; headstones
   * with a rounded top or a cross, pale, leaning a little each; and pink grave lights, a dark post with a glowing pink lamp the glow layer haloes.
   */
  const deadWoodMat = new StandardMaterial(`${theme.displayName}_deadWood`, scene);
  deadWoodMat.diffuseColor = new Color3(0.16, 0.14, 0.2);
  deadWoodMat.specularColor = Color3.Black();
  const graveGlowMat = new StandardMaterial(`${theme.displayName}_graveGlow`, scene);
  graveGlowMat.diffuseColor = new Color3(1, 0.45, 0.8);
  graveGlowMat.emissiveColor = new Color3(1, 0.4, 0.78);
  graveGlowMat.disableLighting = true;
  const limb = (from: Vector3, length: number, radius: number, yaw: number, tilt: number): Vector3 => {
    const dir = new Vector3(Math.sin(tilt) * Math.sin(yaw), Math.cos(tilt), Math.sin(tilt) * Math.cos(yaw));
    const mesh = MeshBuilder.CreateCylinder(`${theme.displayName}_deadLimb`, { height: length, diameterTop: radius * 0.9, diameterBottom: radius * 2, tessellation: 5 }, scene);
    mesh.position = from.add(dir.scale(length / 2));
    const up = new Vector3(0, 1, 0);
    const axis = Vector3.Cross(up, dir);
    if (axis.lengthSquared() > 1e-6) mesh.rotationQuaternion = Quaternion.RotationAxis(axis.normalize(), Math.acos(Vector3.Dot(up, dir)));
    mesh.material = deadWoodMat;
    mesh.receiveShadows = true;
    return from.add(dir.scale(length));
  };
  const addDeadTree = (x: number, z: number, scale = 1, blocking = true) => {
    const seed = Math.abs(Math.sin(x * 12.9898 + z * 78.233)) * 43758.5453;
    const r = (k: number) => (Math.sin(seed + k * 17.31) + 1) / 2;
    const top = limb(new Vector3(x, 0, z), 4.2 * scale, 0.32 * scale, r(1) * 6.28, 0.12);
    const fork = limb(top, 2.2 * scale, 0.2 * scale, r(2) * 6.28, 0.3);
    for (let i = 0; i < 4; i++) {
      const from = i < 2 ? top : fork;
      const end = limb(from, (1.4 + r(3 + i) * 1.4) * scale, 0.12 * scale, r(7 + i) * 6.28, 0.7 + r(11 + i) * 0.5);
      limb(end, 0.8 * scale, 0.06 * scale, r(13 + i) * 6.28, 0.5 + r(17 + i) * 0.6);
    }
    if (blocking) obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 0.4 * scale });
  };
  const addTomb = (x: number, z: number, scale = 1, rotationY = 0) => {
    const lean = (Math.sin(x * 3.1 + z * 1.7) * 0.12);
    const root = new Mesh(`${theme.displayName}_tomb`, scene);
    root.position = new Vector3(x, 0, z);
    root.rotation.set(lean, rotationY, lean * 0.5);
    const cross = Math.abs(Math.sin(x * 5.3 - z * 2.9)) > 0.65;
    const parts: Mesh[] = [];
    if (cross) {
      const post = MeshBuilder.CreateBox(`${theme.displayName}_tombPost`, { width: 0.3 * scale, depth: 0.3 * scale, height: 2 * scale }, scene);
      post.position.y = 1 * scale;
      const bar = MeshBuilder.CreateBox(`${theme.displayName}_tombBar`, { width: 1.2 * scale, depth: 0.28 * scale, height: 0.28 * scale }, scene);
      bar.position.y = 1.45 * scale;
      parts.push(post, bar);
    } else {
      const slab = MeshBuilder.CreateBox(`${theme.displayName}_tombSlab`, { width: 1.1 * scale, depth: 0.3 * scale, height: 1.1 * scale }, scene);
      slab.position.y = 0.55 * scale;
      const cap = MeshBuilder.CreateCylinder(`${theme.displayName}_tombCap`, { diameter: 1.1 * scale, height: 0.3 * scale, tessellation: 12 }, scene);
      cap.rotation.x = Math.PI / 2;
      cap.position.y = 1.1 * scale;
      parts.push(slab, cap);
    }
    for (const part of parts) {
      part.parent = root;
      part.material = paleMat;
      part.receiveShadows = true;
    }
  };
  const addGraveLight = (x: number, z: number, scale = 1) => {
    addCylinderObstacle(x, z, 0.12 * scale, 2.6 * scale, deadWoodMat, false);
    const lamp = MeshBuilder.CreateSphere(`${theme.displayName}_graveLight`, { diameter: 0.7 * scale, segments: 6 }, scene);
    lamp.position = new Vector3(x, 2.8 * scale, z);
    lamp.material = graveGlowMat;
    const pool = MeshBuilder.CreateDisc(`${theme.displayName}_graveLightPool`, { radius: 3.2 * scale, tessellation: 20 }, scene);
    pool.rotation.x = Math.PI / 2;
    pool.position = new Vector3(x, 0.07, z);
    const poolMat = new StandardMaterial(`${theme.displayName}_graveLightPool`, scene);
    poolMat.diffuseColor = Color3.Black();
    poolMat.emissiveColor = new Color3(0.55, 0.18, 0.42);
    poolMat.disableLighting = true;
    poolMat.alpha = 0.35;
    pool.material = poolMat;
    pool.isPickable = false;
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
  /*
   * Dynasty pagoda and torii (245; maps/dynasty.png, tabs_screenshot_03). Spec read off the reference:
   *   Pagoda: a grey stone plinth with steps, a ground storey of red posts round a pale wall, then two dark slate hipped roofs stacked, each a low four-sided
   *   pyramid whose eaves flare out well past the storey under it (eaves about 1.6x the storey width, lower roof about a third of the storey high), a small
   *   upper storey of red posts between them, and a dark finial on top. Overall about 1.3x as tall as the plinth is wide; red, slate and grey, no white box.
   *   Torii: two red posts leaning in a touch, a red tie beam under the top, and a dark lintel across the top that overhangs both posts and turns up at its ends.
   */
  const pagodaRedMat = new StandardMaterial(`${theme.displayName}_pagodaRed`, scene);
  pagodaRedMat.diffuseColor = new Color3(0.72, 0.13, 0.15);
  pagodaRedMat.specularColor = new Color3(0.03, 0.03, 0.03);
  const slateMat = new StandardMaterial(`${theme.displayName}_slate`, scene);
  slateMat.diffuseColor = new Color3(0.3, 0.33, 0.42);
  slateMat.specularColor = new Color3(0.03, 0.03, 0.03);
  const stoneMat = new StandardMaterial(`${theme.displayName}_stone`, scene);
  stoneMat.diffuseColor = new Color3(0.62, 0.6, 0.56);
  stoneMat.specularColor = new Color3(0.03, 0.03, 0.03);
  const paperMat = new StandardMaterial(`${theme.displayName}_paper`, scene);
  paperMat.diffuseColor = new Color3(0.9, 0.86, 0.74);
  paperMat.specularColor = new Color3(0.03, 0.03, 0.03);
  const placePart = (root: Mesh, mesh: Mesh, material: StandardMaterial, x: number, y: number, z: number) => {
    mesh.parent = root;
    mesh.position.set(x, y, z);
    mesh.material = material;
    mesh.receiveShadows = true;
    sunShadows(scene)?.addShadowCaster(mesh);
  };
  // A hipped roof: a four-sided low pyramid (a square-tessellated cone turned to the walls) on a thin flared eave slab
  const addRoof = (root: Mesh, y: number, eave: number, top: number, tall: number) => {
    // The red cornice under the eave stands out past the slate all round, so each tier's edge reads from the placement view
    const slab = MeshBuilder.CreateBox(`${theme.displayName}_pagodaEave`, { width: eave * 1.08, depth: eave * 1.08, height: tall * 0.12 }, scene);
    placePart(root, slab, pagodaRedMat, 0, y + tall * 0.06, 0);
    const roof = MeshBuilder.CreateCylinder(`${theme.displayName}_pagodaRoof`, { height: tall, diameterTop: top * Math.SQRT2, diameterBottom: eave * Math.SQRT2, tessellation: 4 }, scene);
    roof.rotation.y = Math.PI / 4;
    placePart(root, roof, slateMat, 0, y + tall * 0.5 + tall * 0.1, 0);
    // The eave corners turn up: a short slate horn at each corner
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const tip = MeshBuilder.CreateBox(`${theme.displayName}_pagodaEaveTip`, { width: eave * 0.08, depth: eave * 0.08, height: tall * 0.35 }, scene);
      tip.rotation.set(sz * 0.6, 0, -sx * 0.6);
      placePart(root, tip, slateMat, sx * eave * 0.47, y + tall * 0.2, sz * eave * 0.47);
    }
  };
  const addStorey = (root: Mesh, y: number, width: number, tall: number, posts: number) => {
    const wall = MeshBuilder.CreateBox(`${theme.displayName}_pagodaWall`, { width: width * 0.82, depth: width * 0.82, height: tall }, scene);
    placePart(root, wall, paperMat, 0, y + tall / 2, 0);
    for (let i = 0; i < posts; i++) {
      const t = -0.5 + i / (posts - 1);
      for (const [px, pz] of [[t, -0.5], [t, 0.5], [-0.5, t], [0.5, t]]) {
        const post = MeshBuilder.CreateBox(`${theme.displayName}_pagodaPost`, { width: width * 0.07, depth: width * 0.07, height: tall }, scene);
        placePart(root, post, pagodaRedMat, px * width * 0.9, y + tall / 2, pz * width * 0.9);
      }
    }
    const beam = MeshBuilder.CreateBox(`${theme.displayName}_pagodaBeam`, { width: width * 0.98, depth: width * 0.98, height: tall * 0.14 }, scene);
    placePart(root, beam, pagodaRedMat, 0, y + tall * 0.93, 0);
  };
  const addPagoda = (x: number, z: number, scale = 1, rotationY = 0, blocking = true) => {
    const root = new Mesh(`${theme.displayName}_pagoda`, scene);
    root.position.set(x, 0, z);
    root.rotation.y = rotationY;
    const W = 11 * scale;
    const plinthTall = 1.6 * scale;
    const plinth = MeshBuilder.CreateBox(`${theme.displayName}_pagodaPlinth`, { width: W * 1.15, depth: W * 1.15, height: plinthTall }, scene);
    placePart(root, plinth, stoneMat, 0, plinthTall / 2, 0);
    const steps = MeshBuilder.CreateBox(`${theme.displayName}_pagodaSteps`, { width: W * 0.35, depth: W * 0.3, height: plinthTall * 0.55 }, scene);
    placePart(root, steps, stoneMat, 0, plinthTall * 0.275, -W * 0.72);
    const ground = 4.2 * scale;
    addStorey(root, plinthTall, W * 0.8, ground, 4);
    const roof1 = plinthTall + ground;
    addRoof(root, roof1, W * 1.18, W * 0.34, 2.4 * scale);
    const upper = roof1 + 2.4 * scale * 0.7;
    addStorey(root, upper, W * 0.4, 3.4 * scale, 3);
    const roof2 = upper + 3.4 * scale;
    addRoof(root, roof2, W * 0.72, W * 0.1, 2.6 * scale);
    const finial = MeshBuilder.CreateCylinder(`${theme.displayName}_pagodaFinial`, { height: 2.2 * scale, diameterTop: 0, diameterBottom: 0.5 * scale, tessellation: 6 }, scene);
    placePart(root, finial, slateMat, 0, roof2 + 2.6 * scale * 1.1 + 1.1 * scale, 0);
    if (blocking) obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: W * 0.58, halfZ: W * 0.58 });
  };
  const addTorii = (x: number, z: number, scale = 1, rotationY = 0) => {
    const root = new Mesh(`${theme.displayName}_torii`, scene);
    root.position.set(x, 0, z);
    root.rotation.y = rotationY;
    const span = 6 * scale;
    const tall = 7 * scale;
    for (const side of [-1, 1]) {
      const post = MeshBuilder.CreateCylinder(`${theme.displayName}_toriiPost`, { height: tall, diameterTop: 0.5 * scale, diameterBottom: 0.7 * scale, tessellation: 8 }, scene);
      post.rotation.z = side * 0.04;
      placePart(root, post, pagodaRedMat, side * span / 2, tall / 2, 0);
      // The lintel's upturned end
      const end = MeshBuilder.CreateBox(`${theme.displayName}_toriiEnd`, { width: 1.4 * scale, depth: 0.7 * scale, height: 0.45 * scale }, scene);
      end.rotation.z = -side * 0.28;
      placePart(root, end, slateMat, side * (span / 2 + 1.5 * scale), tall + 0.75 * scale, 0);
    }
    const tie = MeshBuilder.CreateBox(`${theme.displayName}_toriiTie`, { width: span + 1.2 * scale, depth: 0.45 * scale, height: 0.45 * scale }, scene);
    placePart(root, tie, pagodaRedMat, 0, tall * 0.8, 0);
    const lintelRed = MeshBuilder.CreateBox(`${theme.displayName}_toriiLintelRed`, { width: span + 2 * scale, depth: 0.6 * scale, height: 0.5 * scale }, scene);
    placePart(root, lintelRed, pagodaRedMat, 0, tall + 0.1 * scale, 0);
    const lintel = MeshBuilder.CreateBox(`${theme.displayName}_toriiLintel`, { width: span + 2.4 * scale, depth: 0.75 * scale, height: 0.45 * scale }, scene);
    placePart(root, lintel, slateMat, 0, tall + 0.55 * scale, 0);
    obstacles.push({ type: "cylinder", center: new Vector3(x - Math.cos(rotationY) * span / 2, 0, z + Math.sin(rotationY) * span / 2), radius: 0.4 * scale });
    obstacles.push({ type: "cylinder", center: new Vector3(x + Math.cos(rotationY) * span / 2, 0, z - Math.sin(rotationY) * span / 2), radius: 0.4 * scale });
  };
  const addWaterfall = (x: number, z: number, scale = 1) => {
    const fall = MeshBuilder.CreatePlane(`${theme.displayName}_waterfall`, { width: 6 * scale, height: 14 * scale }, scene);
    fall.position = new Vector3(x, 8 * scale, z);
    fall.material = waterMat;
  };
  /*
   * A moored galleon (252; maps/pirate_beach: two dark wooden ships lying in the cove, each about a third of the island long). Read off the reference: the hull is
   * about SHIP_BEAM of its length across and SHIP_HULL of it high, dark brown with a pale gunwale band and a light plank deck, a pointed bow carrying a raking
   * bowsprit, and a raised stern castle over the aft SHIP_CASTLE of the length; three masts (fore, main, mizzen) SHIP_MASTS of the length tall, each with two
   * square cream sails hung from yards wider than the beam (SHIP_YARD), the upper one narrower, and a crow's nest on the main. The yards are braced SHIP_BRACE
   * off square, toward the placement camera, so the sails show their faces from the high oblique view rather than their edges.
   */
  const SHIP_LONG = 17, SHIP_BEAM = 0.26, SHIP_HULL = 0.15, SHIP_CASTLE = 0.24;
  const SHIP_MASTS: [number, number][] = [[0.3, 0.62], [0.02, 0.74], [-0.24, 0.55]];
  const SHIP_YARD = 1.45, SHIP_BRACE = 0.55;
  const shipMat = (name: string, c: Color3) => {
    const m = new StandardMaterial(`${theme.displayName}_${name}`, scene);
    m.diffuseColor = c;
    m.specularColor = new Color3(0.03, 0.03, 0.03);
    return m;
  };
  let shipMats: Record<"hull" | "band" | "deck" | "sail" | "flag", StandardMaterial> | null = null;
  const addShip = (x: number, z: number, scale = 1, rotationY = 0, blocking = false) => {
    shipMats ??= {
      hull: shipMat("shipHull", new Color3(0.27, 0.17, 0.1)),
      band: shipMat("shipBand", new Color3(0.62, 0.45, 0.24)),
      deck: shipMat("shipDeck", new Color3(0.66, 0.52, 0.34)),
      sail: shipMat("shipSail", new Color3(0.94, 0.91, 0.82)),
      flag: shipMat("shipFlag", new Color3(0.12, 0.1, 0.1)),
    };
    // Sun-through cloth: the placement camera looks at the sails' shaded faces, which went navy with no light of their own
    shipMats.sail.emissiveColor = new Color3(0.94, 0.91, 0.82).scale(0.4);
    const glow = scene.getGlowLayerByName("glow");
    const M = shipMats;
    const L = SHIP_LONG * scale, B = L * SHIP_BEAM, H = L * SHIP_HULL;
    const root = new Mesh(`${theme.displayName}_ship`, scene);
    root.position.set(x, 0, z);
    root.rotation.y = rotationY;
    const hull = MeshBuilder.CreateBox(`${theme.displayName}_shipHull`, { width: L * 0.86, depth: B, height: H }, scene);
    placePart(root, hull, M.hull, -L * 0.07, H / 2, 0);
    // Bow: a diamond-section prow, its point B/2 past the hull end, a little higher than the waist
    const bowSide = B / Math.SQRT2;
    const bow = MeshBuilder.CreateBox(`${theme.displayName}_shipBow`, { width: bowSide, depth: bowSide, height: H * 1.12 }, scene);
    bow.rotation.y = Math.PI / 4;
    placePart(root, bow, M.hull, L * 0.36, H * 0.56, 0);
    const band = MeshBuilder.CreateBox(`${theme.displayName}_shipBand`, { width: L * 0.87, depth: B * 1.04, height: H * 0.14 }, scene);
    placePart(root, band, M.band, -L * 0.07, H * 0.86, 0);
    const deck = MeshBuilder.CreateBox(`${theme.displayName}_shipDeck`, { width: L * 0.8, depth: B * 0.84, height: H * 0.04 }, scene);
    placePart(root, deck, M.deck, -L * 0.04, H * 1.01, 0);
    for (const side of [-1, 1]) {
      const rail = MeshBuilder.CreateBox(`${theme.displayName}_shipRail`, { width: L * 0.84, depth: B * 0.08, height: H * 0.3 }, scene);
      placePart(root, rail, M.hull, -L * 0.06, H * 1.15, side * B * 0.46);
    }
    // Stern castle over the aft quarter, its top decked, a band at its rim
    const castleLong = L * SHIP_CASTLE;
    const castle = MeshBuilder.CreateBox(`${theme.displayName}_shipCastle`, { width: castleLong, depth: B * 0.98, height: H * 0.7 }, scene);
    placePart(root, castle, M.hull, -L * 0.5 + castleLong / 2, H * 1.35, 0);
    const castleBand = MeshBuilder.CreateBox(`${theme.displayName}_shipCastleBand`, { width: castleLong * 1.02, depth: B * 1.02, height: H * 0.12 }, scene);
    placePart(root, castleBand, M.band, -L * 0.5 + castleLong / 2, H * 1.66, 0);
    const castleDeck = MeshBuilder.CreateBox(`${theme.displayName}_shipCastleDeck`, { width: castleLong * 0.9, depth: B * 0.86, height: H * 0.04 }, scene);
    placePart(root, castleDeck, M.deck, -L * 0.5 + castleLong / 2, H * 1.72, 0);
    const bowsprit = MeshBuilder.CreateCylinder(`${theme.displayName}_shipBowsprit`, { height: L * 0.28, diameter: 0.22 * scale, tessellation: 6 }, scene);
    bowsprit.rotation.z = -Math.PI / 2 + 0.38;
    placePart(root, bowsprit, M.hull, L * 0.48, H * 1.45, 0);
    // Masts with two square sails each on yards braced toward the camera
    const brace = SHIP_BRACE * (rotationY < 0 ? -1 : 1);
    SHIP_MASTS.forEach(([at, tall], i) => {
      const mastTall = L * tall;
      const mast = MeshBuilder.CreateCylinder(`${theme.displayName}_shipMast`, { height: mastTall, diameterTop: 0.18 * scale, diameterBottom: 0.38 * scale, tessellation: 6 }, scene);
      placePart(root, mast, M.hull, L * at, H + mastTall / 2, 0);
      const sails: [number, number, number][] = [[0.4, 0.3, 1], [0.76, 0.22, 0.74]];
      for (const [mid, high, wide] of sails) {
        const sailW = B * SHIP_YARD * wide, sailH = mastTall * high;
        const rig = new Mesh(`${theme.displayName}_shipRig`, scene);
        rig.parent = root;
        rig.position.set(L * at, H + mastTall * mid, 0);
        rig.rotation.y = brace;
        // Bellied forward: the cloth's middle stands proud of its edges
        const sail = MeshBuilder.CreateBox(`${theme.displayName}_shipSail`, { width: 0.12 * scale, depth: sailW, height: sailH }, scene);
        placePart(rig, sail, M.sail, 0.35 * scale, 0, 0);
        const belly = MeshBuilder.CreateBox(`${theme.displayName}_shipSailBelly`, { width: 0.12 * scale, depth: sailW * 0.62, height: sailH * 0.8 }, scene);
        placePart(rig, belly, M.sail, 0.6 * scale, -sailH * 0.04, 0);
        glow?.addExcludedMesh(sail); // self-lit cloth, no bloom halo
        glow?.addExcludedMesh(belly);
        const yard = MeshBuilder.CreateCylinder(`${theme.displayName}_shipYard`, { height: sailW * 1.12, diameter: 0.16 * scale, tessellation: 5 }, scene);
        yard.rotation.x = Math.PI / 2;
        placePart(rig, yard, M.hull, 0.2 * scale, sailH / 2, 0);
      }
      if (i === 1) {
        const nest = MeshBuilder.CreateCylinder(`${theme.displayName}_shipNest`, { height: 0.6 * scale, diameter: 1.1 * scale, tessellation: 8 }, scene);
        placePart(root, nest, M.hull, L * at, H + mastTall * 0.92, 0);
      }
      const flag = MeshBuilder.CreateBox(`${theme.displayName}_shipFlag`, { width: 1.3 * scale, depth: 0.05 * scale, height: 0.75 * scale }, scene);
      placePart(root, flag, M.flag, L * at - 0.65 * scale, H + mastTall + 0.2 * scale, 0);
    });
    if (blocking) {
      obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: L / 2, halfZ: B / 2 });
    }
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
      case "deadTree": addDeadTree(prop.x, prop.z, scale, blocking); break;
      case "tomb": addTomb(prop.x, prop.z, scale, rotationY); break;
      case "graveLight": addGraveLight(prop.x, prop.z, scale); break;
      case "church": addChurch(prop.x, prop.z, scale, blocking); break;
      case "temple": addTemple(prop.x, prop.z, scale, blocking); break;
      case "pagoda": addPagoda(prop.x, prop.z, scale, rotationY, blocking); break;
      case "torii": addTorii(prop.x, prop.z, scale, rotationY); break;
      case "waterfall": addWaterfall(prop.x, prop.z, scale); break;
    }
  }
}

/*
 * The bare plane (simulation; maps/simulation: one flat, off-white plane with nothing on it, its far edge lost in a haze of the same pale colour, no island,
 * ring, rocks, grass or clouds). Every mesh the sandbox base made is put away except the lawn and the ground under it, and a plane BARE_PLANE metres
 * across in the lawn's own material is laid flush under them, so the field runs on into the fog with no rim. Its obstacles go with it (see buildCampaignBattlefield).
 */
const BARE_PLANE = 1600;
const BARE_KEEP = new Set(["ground", "centerGrass"]);
function barePlane(scene: Scene, prior: ReadonlySet<Scene["meshes"][number]>): void {
  for (const mesh of scene.meshes) {
    if (!prior.has(mesh) && !BARE_KEEP.has(mesh.name)) mesh.setEnabled(false);
  }
  const plane = MeshBuilder.CreateGround("barePlane", { width: BARE_PLANE, height: BARE_PLANE }, scene);
  plane.position.y = -0.005;
  plane.material = scene.getMaterialByName("grass");
  plane.receiveShadows = true;
}

/*
 * The bare plane's only guide (maps/simulation: one thin red line runs straight across the whole plane and on into the haze, and the two halves either
 * side of it are the plane's own untinted colour). No team fills or zone borders: the line is the guide, named "border" so it hides with the other
 * placement guides once the battle starts.
 */
const BARE_LINE_WIDE = 0.16;
const BARE_LINE_RED = new Color3(0.78, 0.22, 0.3);
function bareCentreLine(scene: Scene): void {
  const line = MeshBuilder.CreateGround("border", { width: BARE_LINE_WIDE, height: BARE_PLANE }, scene);
  line.position.y = 0.04;
  const mat = new StandardMaterial("bare_line_mat", scene);
  mat.diffuseColor = Color3.Black();
  mat.emissiveColor = BARE_LINE_RED;
  mat.disableLighting = true;
  line.material = mat;
  line.isPickable = false;
}

function buildCampaignBattlefield(scene: Scene, theme: CampaignMapTheme): MapBuildResult {
  const prior = new Set(scene.meshes);
  const base = new TribalSandboxMapBuilder(scene, false).build();
  const obstacles = theme.bare ? [] : [...base.obstacles];
  const hazards = theme.hazards.map((hazard) => hazard.shape === "box"
    ? { ...hazard, center: hazard.center.clone() }
    : { ...hazard, center: hazard.center.clone() },
  );
  recolorBaseTerrain(scene, theme);
  if (theme.bare) barePlane(scene, prior);
  if (theme.town) townPlaza(scene, obstacles);
  addCampaignProps(scene, theme, obstacles);
  createHazardVisuals(scene, hazards, theme.sea);
  if (theme.sea) sandSpits(scene, theme.sea, hazards);
  if (theme.bare) bareCentreLine(scene);
  else createPlacementGuides(scene, theme.zones);
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
  scene.clearColor.set(0.14, 0.62, 0.46, 1);
  scene.fogColor = new Color3(0.62, 0.86, 0.76);
  scene.getMeshByName("skyDome")?.setEnabled(true);
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
    // Broad dark-green oaks on kinked brown trunks round the meadow (see oakRing)
    ring: { leaves: new Color3(0.32, 0.52, 0.2), darkLeaves: new Color3(0.22, 0.4, 0.15), trunk: new Color3(0.42, 0.29, 0.19), bare: 0, oaks: 1 },
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
    // Pale stalks under orange, red, yellow and yellow-green balls, one colour per tree (see ballRing)
    ring: {
      leaves: new Color3(0.95, 0.55, 0.2), darkLeaves: new Color3(0.86, 0.36, 0.18), trunk: new Color3(0.9, 0.86, 0.76), bare: 0,
      balls: [new Color3(1, 0.45, 0.06), new Color3(0.92, 0.18, 0.08), new Color3(1, 0.76, 0.1), new Color3(0.74, 0.78, 0.12), new Color3(1, 0.58, 0.1)],
    },
    // Orange lawn, ochre ground, a warm glow in place of the sandbox plum; red-orange, rust and straw-yellow tuft clumps (see autumnField)
    field: {
      ground: new Color3(0.86, 0.52, 0.22), grass: new Color3(1.0, 0.58, 0.2), glow: new Color3(0.1, 0.055, 0.02),
      tufts: [new Color3(0.95, 0.32, 0.08), new Color3(0.86, 0.22, 0.1), new Color3(1, 0.86, 0.3)],
    },
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
    // Pale pink blossom on tan wood, most of the ring stood as forked cherries (see blossomRing)
    ring: { leaves: new Color3(0.9, 0.58, 0.84), darkLeaves: new Color3(0.76, 0.46, 0.74), trunk: new Color3(0.6, 0.47, 0.32), bare: 0, blossom: 0.65 },
    props: [
      { kind: "lantern", x: -20, z: -18, scale: 1.0 },
      { kind: "lantern", x: -20, z: 18, scale: 1.0 },
      { kind: "pagoda", x: 0, z: 29, scale: 0.9 },
      { kind: "torii", x: -17, z: 25, scale: 0.9, rotationY: 0.35 },
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
    // Grout grey under the flagstones of the paved square (see townPlaza)
    ground: new Color3(0.5, 0.47, 0.43),
    grass: new Color3(0.68, 0.64, 0.57),
    zones: [
      zone(0, -42, 12, 46, 34),
      zone(1, 42, 12, 46, 34),
    ],
    hazards: [
      boxHazard("water", 0, -24, 52, 10),
    ],
    accent: new Color3(0.95, 0.87, 0.52),
    // The square is walled in by townhouses, not trees (see townRing); the old pair of grey house boxes in the field are gone with them
    // The square is paved and bare but for its fountain (see townPlaza)
    town: true,
    props: [
      { kind: "bridge", x: 0, z: -24, scale: 0.9 },
    ],
  },
  "campaign.pirate": {
    displayName: "Pirate Cove",
    clearColor: new Color3(0.58, 0.76, 0.88),
    fogColor: new Color3(0.58, 0.76, 0.88),
    // One sand: the field is the beach's own sand (see sandSpits), not an olive lawn
    ground: new Color3(0.84, 0.72, 0.5),
    grass: new Color3(0.8, 0.68, 0.46),
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
    // Most of the ring stood as leaning palms, the rest bright tropical green; turquoise shallows round the rim and in the cove where the ships lie
    ring: { leaves: new Color3(0.42, 0.68, 0.3), darkLeaves: new Color3(0.3, 0.55, 0.24), trunk: new Color3(0.7, 0.58, 0.4), bare: 0, palms: 0.72 },
    sea: { water: new Color3(0.26, 0.74, 0.62), shore: new Color3(0.86, 0.8, 0.62) },
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
    // Navy night canopies on near-black trunks, and most of the ring stood bare and dead
    ring: { leaves: new Color3(0.2, 0.22, 0.4), darkLeaves: new Color3(0.14, 0.15, 0.3), trunk: new Color3(0.1, 0.09, 0.14), bare: 0.6 },
    props: [
      { kind: "gravestone", x: -22, z: -16, scale: 1.0 },
      { kind: "gravestone", x: -20, z: 16, scale: 1.0 },
      { kind: "bones", x: 18, z: -12, scale: 1.0 },
      { kind: "tree", x: 18, z: 18, scale: 0.95 },
      { kind: "totem", x: 0, z: 24, scale: 1.0 },
      // Graveyard dressing: two rows of headstones off each flank, dead trees round the field, pink grave lights among the stones
      ...[-1, 1].flatMap((side) => [0, 1, 2, 3, 4].flatMap((i) => [
        { kind: "tomb" as const, x: side * (8 + i * 4), z: -30, scale: 1.5, rotationY: side * 0.1 },
        { kind: "tomb" as const, x: side * (10 + i * 4), z: 30, scale: 1.4, rotationY: Math.PI },
      ])),
      { kind: "deadTree", x: -34, z: -24, scale: 1.7 },
      { kind: "deadTree", x: -36, z: 8, scale: 1.5 },
      { kind: "deadTree", x: 34, z: -20, scale: 1.6 },
      { kind: "deadTree", x: 36, z: 12, scale: 1.8 },
      { kind: "deadTree", x: -8, z: 36, scale: 1.6 },
      { kind: "deadTree", x: 10, z: -36, scale: 1.5 },
      { kind: "graveLight", x: -14, z: -27, scale: 1 },
      { kind: "graveLight", x: 14, z: -27, scale: 1 },
      { kind: "graveLight", x: -16, z: 27, scale: 1 },
      { kind: "graveLight", x: 16, z: 27, scale: 1 },
    ],
  },
  "campaign.simulation": {
    displayName: "Simulation Arena",
    // One pale plane under a sky of the same pale haze, nothing standing on it (see barePlane)
    clearColor: new Color3(0.9, 0.89, 0.86),
    fogColor: new Color3(0.9, 0.89, 0.86),
    ground: new Color3(0.86, 0.85, 0.82),
    grass: new Color3(0.86, 0.85, 0.82),
    zones: defaultHalfZones(),
    hazards: [
      cylinderHazard("void", 0, 0, 8),
    ],
    accent: new Color3(0.96, 0.84, 0.4),
    bare: true,
    props: [],
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

