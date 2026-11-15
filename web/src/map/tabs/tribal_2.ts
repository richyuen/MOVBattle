// TABS "Tribal 2" (tribal map): a tall grey rock mountain fills the right side of the island, its peak at the back-right, falling to the
// front as stacked rock blocks, with a dark cave mouth at its foot looking into the field (reference/maps/wiki/tribal_2.png,
// reference/stages/challenge.a_warm_welcome.png).
// Spec read off the wiki shot: the mass runs along the right rim from the back (z +44) to the front (z -38); the peak, about 26 m high, stands
// at the back-right; the middle is a 10-14 m cliff of blocks with the cave mouth (5 m wide, 4 m high) near the middle at its foot; the front is
// a low step of boulders. Its foot keeps clear of the stage armies fought here (team 1 stands at x <= 40). Built on sandbox.tribal (base()).
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const FOOT_X = 45;   // the mountain's field-side foot
const CAVE = { z: 6, width: 5, height: 4 };

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

/** [x, z, width, height, depth] of each rock block, back to front */
const BLOCKS: Array<[number, number, number, number, number]> = [
  [53, 38, 16, 18, 14], [52, 29, 18, 22, 14], [53, 20, 16, 17, 12], [52, 13, 14, 13, 10],
  [53, 1, 16, 12, 12], [52, -7, 14, 10, 10], [53, -15, 15, 8, 11], [52, -23, 13, 6, 10], [52, -31, 12, 4, 9], [51, -38, 9, 3, 7],
];

// The open field (wiki shot): no dry-stone walls cross it; the base's wall stones inside the ellipse |x| < 47, |z| < 32 go with their colliders
const FIELD = { rx: 47, rz: 32 };
const inField = (x: number, z: number, margin = 0) => (x / (FIELD.rx + margin)) ** 2 + (z / (FIELD.rz + margin)) ** 2 < 1;

function clearFieldWalls(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes.filter((m) => built.has(m) && m.name === "wallStone")) {
    if (!inField(mesh.position.x, mesh.position.z, 2)) continue;
    gone.push([mesh.position.x, mesh.position.z]);
    mesh.dispose();
  }
  result.obstacles = result.obstacles.filter((o) => !(inField(o.center.x, o.center.z, 2)
    && gone.some(([x, z]) => Math.abs(x - o.center.x) < 0.01 && Math.abs(z - o.center.z) < 0.01)));
}

/**
 * Autumn birches (wiki shot; tribal_1's birch kit, this map's own copy): every ring tree is one faceted ball crown on a tall thin white
 * trunk, crowns red, orange and yellow (about 2:2:1), 2.8-4.4 m across the ball (larger than tribal_1's first cut, which read half size).
 * Crowns are lit by their own colour and kept out of fog, glow and the canopy haze so they stay saturated. Trees standing under the
 * mountain (x > FOOT_X - 2) go, so no crown pokes out of the rock.
 */
const BIRCH_CROWNS: Array<[string, Color3]> = [
  ["tribal2CrownRed", new Color3(0.72, 0.12, 0.05)],
  ["tribal2CrownOrange", new Color3(0.82, 0.3, 0.05)],
  ["tribal2CrownRed2", new Color3(0.66, 0.16, 0.06)],
  ["tribal2CrownOrange2", new Color3(0.78, 0.38, 0.07)],
  ["tribal2CrownYellow", new Color3(0.7, 0.55, 0.08)],
];
const BIRCH_STRETCH = 1.5;

function birchRing(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const crowns = BIRCH_CROWNS.map(([name, c]) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c.scale(0.55);
    m.emissiveColor = c.scale(0.55);
    m.specularColor = Color3.Black();
    return m;
  });
  const bark = new StandardMaterial("tribal2Birch", scene);
  bark.diffuseColor = new Color3(0.9, 0.88, 0.84);
  bark.emissiveColor = new Color3(0.4, 0.39, 0.37);
  bark.specularColor = Color3.Black();
  const glow = scene.getGlowLayerByName("glow");
  const trunks = scene.meshes.filter((m): m is Mesh => built.has(m) && m.name === "trunk" && m instanceof Mesh);
  const buried: Array<[number, number]> = [];
  trunks.forEach((trunk, i) => {
    const p = trunk.getAbsolutePosition();
    if (p.x > FOOT_X - 2) {
      buried.push([p.x, p.z]);
      trunk.dispose();
      return;
    }
    for (const child of trunk.getChildMeshes()) if (child.name === "canopy") child.dispose();
    const h = trunk.getBoundingInfo().boundingBox.extendSize.y * 2;
    trunk.scaling.set(0.7, BIRCH_STRETCH, 0.7);
    trunk.position.y = (h * BIRCH_STRETCH) / 2 - 0.15;
    trunk.material = bark;
    trunk.computeWorldMatrix(true);
    const top = Vector3.TransformCoordinates(new Vector3(0, h / 2, 0), trunk.getWorldMatrix());
    const r = 1.4 + seeded(i, 21) * 0.8 + h * 0.1;
    const ball = MeshBuilder.CreateIcoSphere("tribal2Crown", { radius: r, subdivisions: 1 }, scene);
    ball.scaling.y = 1.08;
    ball.rotation.y = seeded(i, 22) * Math.PI;
    ball.position.set(top.x, top.y + r * 0.7, top.z);
    ball.convertToFlatShadedMesh();
    ball.material = crowns[Math.floor(seeded(i, 23) * crowns.length)];
    ball.applyFog = false;
    ball.isPickable = false;
    glow?.addExcludedMesh(ball);
  });
  result.obstacles = result.obstacles.filter((o) => !buried.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
  // The low band of ball crowns behind the ring takes the same colours
  scene.meshes.filter((m) => built.has(m) && m.name === "hazeTreeline").forEach((m, i) => {
    m.material = crowns[i % 2 === 0 ? 0 : 1];
    m.applyFog = false;
  });
}

export function buildTribal2(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  clearFieldWalls(scene, new Set(scene.meshes.filter((m) => !prior.has(m))), result);
  birchRing(scene, new Set(scene.meshes.filter((m) => !prior.has(m))), result);
  const rock = new StandardMaterial("tribal2Mountain", scene);
  rock.diffuseColor = new Color3(0.6, 0.54, 0.52);
  rock.emissiveColor = new Color3(0.08, 0.06, 0.05);
  rock.specularColor = new Color3(0.03, 0.03, 0.03);
  const dark = new StandardMaterial("tribal2Cave", scene);
  dark.diffuseColor = new Color3(0.04, 0.03, 0.04);
  dark.specularColor = Color3.Black();

  const pieces: Mesh[] = [];
  // The peak: a leaning faceted cone over the back-right blocks
  const peak = MeshBuilder.CreateCylinder("tribal2Peak", { diameterTop: 5, diameterBottom: 24, height: 30, tessellation: 6 }, scene);
  peak.position.set(55, 14, 27);
  peak.rotation.set(0.08, 0.4, -0.1);
  pieces.push(peak);
  BLOCKS.forEach(([x, z, w, h, d], i) => {
    // Each block is two or three leaning slabs, so the face reads as stacked rock and not one box
    for (let j = 0; j < 3; j++) {
      const k = i * 10 + j;
      const s = 1 - j * 0.22;
      const slab = MeshBuilder.CreateCylinder("tribal2Block", {
        diameterTop: w * s * 0.5, diameterBottom: w * s, height: h * (1 - j * 0.18), tessellation: 5,
      }, scene);
      slab.scaling.z = d / w;
      slab.position.set(x + (seeded(k, 1) - 0.5) * 3, h * (1 - j * 0.18) / 2, z + (seeded(k, 2) - 0.5) * 4);
      slab.rotation.set((seeded(k, 3) - 0.5) * 0.15, seeded(k, 4) * Math.PI, (seeded(k, 5) - 0.5) * 0.15);
      pieces.push(slab);
    }
  });
  const mountain = Mesh.MergeMeshes(pieces, true);
  if (mountain) {
    mountain.name = "tribal2Mountain";
    mountain.convertToFlatShadedMesh();
    mountain.material = rock;
    mountain.receiveShadows = true;
    mountain.isPickable = false;
  }
  // The cave mouth: a dark arch sunk into the cliff foot, facing the field
  const mouth = MeshBuilder.CreateSphere("tribal2CaveMouth", { diameter: 1, segments: 6 }, scene);
  mouth.scaling.set(2.5, CAVE.height * 2, CAVE.width);
  mouth.position.set(FOOT_X - 0.2, 0, CAVE.z);
  mouth.material = dark;
  mouth.isPickable = false;

  // The mountain is solid: one box over its foot along the right rim
  const obstacles = [
    ...result.obstacles,
    { type: "box" as const, center: new Vector3(FOOT_X + 6, 0, 3), halfX: 6, halfZ: 41 },
  ];
  return { ...result, obstacles };
}
