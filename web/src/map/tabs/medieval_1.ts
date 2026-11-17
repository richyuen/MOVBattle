import { Color3, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, VertexData, type Scene, type ShadowGenerator } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

// The placement reference shows two grassy cliff shelves, a deep front inlet, and a narrow bridge.
const SHORE = [
  [-43, 12, 24], [-35, 9, 38], [-23, 7, 48], [-10, 5, 52], [-3, 4, 53],
  [5, 4, 53], [18, 6, 49], [31, 8, 40], [40, 13, 25],
] as const;
const BRIDGE_Z = 1;
const BRIDGE_DEPTH = 8;

function landfallRamp(scene: Scene, grass: StandardMaterial, stone: StandardMaterial): void {
  // The western ledge descends along the inlet to the door underneath the bridge.
  const start = new Vector3(-7.7, -0.18, -19.5);
  const end = new Vector3(-2.7, -5.8, -3.5);
  const delta = end.subtract(start);
  const ramp = MeshBuilder.CreateBox("medieval1LandfallRamp", { width: 2.9, height: 0.5, depth: delta.length() }, scene);
  ramp.position.copyFrom(Vector3.Center(start, end));
  ramp.rotationQuaternion = Quaternion.FromLookDirectionLH(delta.normalize(), Vector3.Up());
  ramp.material = grass;
  ramp.receiveShadows = true;
  const landing = MeshBuilder.CreateBox("medieval1LandfallLanding", { width: 4.2, height: 0.7, depth: 4.4 }, scene);
  landing.position.set(-2.8, -6, -1.6);
  landing.material = stone;
  const doorStone = new StandardMaterial("medieval1LandfallDoor", scene);
  doorStone.diffuseColor = new Color3(0.18, 0.21, 0.31);
  doorStone.emissiveColor = doorStone.diffuseColor.scale(0.28);
  const door = MeshBuilder.CreateBox("medieval1LandfallDoor", { width: 2.15, height: 3.15, depth: 0.22 }, scene);
  door.position.set(-2.8, -4.05, 0.36);
  door.material = doorStone;
  for (const x of [-4.1, -1.5]) {
    const pier = MeshBuilder.CreateBox("medieval1LandfallJamb", { width: 0.46, height: 3.5, depth: 0.58 }, scene);
    pier.position.set(x, -4.03, 0.32);
    pier.material = stone;
  }
  const lintel = MeshBuilder.CreateBox("medieval1LandfallLintel", { width: 3.06, height: 0.55, depth: 0.63 }, scene);
  lintel.position.set(-2.8, -2.2, 0.32);
  lintel.material = stone;
  const emblem = MeshBuilder.CreateBox("medieval1LandfallEmblem", { width: 0.56, height: 0.56, depth: 0.1 }, scene);
  emblem.position.set(-2.8, -3.75, 0.21);
  emblem.rotation.z = Math.PI / 4;
  emblem.material = stone;
}

function plateau(scene: Scene, side: number, grass: StandardMaterial, stone: StandardMaterial): void {
  const points = [
    ...SHORE.map(([z, inside]) => new Vector3(side * inside, 0, z)),
    ...[...SHORE].reverse().map(([z, , outside]) => new Vector3(side * outside, 0, z)),
  ];
  const mesh = new Mesh("medieval1Meadow", scene);
  const positions = [side * 25, 0, 0, ...points.flatMap((p) => [p.x, p.y, p.z])];
  const indices = points.flatMap((_, i) => {
    const j = (i + 1) % points.length;
    return side > 0 ? [0, j + 1, i + 1] : [0, i + 1, j + 1];
  });
  const normals: number[] = [];
  VertexData.ComputeNormals(positions, indices, normals);
  const data = new VertexData();
  data.positions = positions;
  data.indices = indices;
  data.normals = normals;
  data.applyToMesh(mesh);
  mesh.material = grass;
  mesh.receiveShadows = true;
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    const span = Vector3.Distance(a, b);
    const count = Math.ceil(span / 5);
    const nx = side * (a.z - b.z) / span, nz = side * (b.x - a.x) / span;
    for (let j = 0; j < count; j++) {
      const p = Vector3.Lerp(a, b, (j + 0.5) / count);
      const width = span / count;
      const upper = 6 + ((i * 3 + j * 5) % 7);
      for (const [height, top, offset] of [[upper, 0, 0.35], [19 - upper, -upper, 1.65 + j % 3]]) {
        const x = p.x + nx * offset, z = p.z + nz * offset;
        const shaft = MeshBuilder.CreateCylinder("medieval1CliffColumn", {
          height, diameterTop: width * 1.18, diameterBottom: width * 1.37, tessellation: 6,
        }, scene);
        shaft.scaling.z = 0.72;
        shaft.rotation.y = Math.atan2(a.z - b.z, b.x - a.x);
        shaft.position.set(x, top - height / 2 - 0.18, z);
        shaft.material = stone;
        shaft.convertToFlatShadedMesh();
        const cap = MeshBuilder.CreateCylinder("medieval1TurfLedge", {
          height: 0.72, diameterTop: width * 1.23, diameterBottom: width * 1.13, tessellation: 6,
        }, scene);
        cap.scaling.copyFrom(shaft.scaling);
        cap.rotation.y = shaft.rotation.y;
        cap.position.set(x, top - 0.39, z);
        cap.material = grass;
      }
    }
  }
}

function rightBankRuins(scene: Scene, stone: StandardMaterial, obstacles: MapBuildResult["obstacles"]): void {
  const terracotta = new StandardMaterial("medieval1RuinedCoping", scene);
  terracotta.diffuseColor = new Color3(0.76, 0.38, 0.17);
  terracotta.emissiveColor = terracotta.diffuseColor.scale(0.23);
  const block = (name: string, x: number, y: number, z: number, width: number, height: number, depth: number, material: StandardMaterial): Mesh => {
    const piece = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
    piece.position.set(x, y, z);
    piece.material = material;
    piece.receiveShadows = true;
    return piece;
  };
  for (const [x, start, count] of [[12, -29, 5], [10.5, 14, 6], [24, 31, 4]]) {
    for (let i = 0; i < count; i++) {
      const z = start + i * 3, height = 1.4 + ((i * 7 + count) % 5) * 0.43;
      const foot = block("medieval1BrokenWall", x + (i % 2) * 0.45, height / 2, z, 1.5, height, 3.08, stone);
      foot.rotation.y = (i % 3 - 1) * 0.08;
      if (i % 3 !== 1) block("medieval1Merlon", x, height + 0.4, z - 0.38, 1.62, 0.8, 1.28, stone);
      obstacles.push({ type: "box", center: new Vector3(x, 0, z), halfX: 0.74, halfZ: 1.5 });
    }
  }
  for (const [x, z, courses] of [[12.6, 18, 8], [15.4, -27.7, 5], [31.8, 32, 4]]) {
    for (let i = 0; i < courses; i++) {
      const shaft = block("medieval1PillarCourse", x + i * 0.09, i * 1.04 + 0.52, z, 1.72, 1.06, 1.82, stone);
      shaft.rotation.y = i * 0.055;
    }
    if (courses === 8) {
      block("medieval1PillarCapital", x + 0.63, 8.45, z, 3.5, 0.54, 2.55, stone);
      for (const dz of [-0.77, 0.75]) {
        const shard = block("medieval1OrangeCoping", x + 0.54, 8.79, z + dz, 3.25, 0.44, 1.15, terracotta);
        shard.rotation.z = dz * 0.11;
      }
    }
    obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 1.2 });
  }
}

function gnarledOaks(scene: Scene, feet: readonly Vector3[]): void {
  const bark = new StandardMaterial("medieval1OakBark", scene);
  bark.diffuseColor = new Color3(0.32, 0.17, 0.11);
  bark.emissiveColor = bark.diffuseColor.scale(0.2);
  const foliage = new StandardMaterial("medieval1OakCrown", scene);
  foliage.diffuseColor = new Color3(0.49, 0.62, 0.23);
  foliage.emissiveColor = foliage.diffuseColor.scale(0.26);
  const darkFoliage = foliage.clone("medieval1OakCrownShade");
  darkFoliage.diffuseColor.scaleInPlace(0.77);
  darkFoliage.emissiveColor.scaleInPlace(0.77);
  const trunks: Mesh[] = [], crowns: Mesh[] = [], smallCrowns: Mesh[] = [];
  const stem = (foot: Vector3, tip: Vector3, diameter: number, taper: number) => {
    const axis = tip.subtract(foot);
    const limb = MeshBuilder.CreateCylinder("medieval1OakLimb", {
      height: axis.length() + diameter * 0.16, diameterBottom: diameter, diameterTop: diameter * taper, tessellation: 6,
    }, scene);
    limb.position = foot.add(tip).scale(0.5);
    const up = Vector3.Up();
    const direction = axis.normalize();
    const cross = Vector3.Cross(up, direction);
    limb.rotationQuaternion = cross.lengthSquared() < 1e-6 ? Quaternion.Identity()
      : Quaternion.RotationAxis(cross.normalize(), Math.acos(Vector3.Dot(up, direction)));
    trunks.push(limb);
  };
  feet.forEach((foot, i) => {
    const yaw = i * 2.39996;
    const offset = (angle: number, reach: number, y: number) =>
      new Vector3(foot.x + Math.cos(angle) * reach, y, foot.z + Math.sin(angle) * reach);
    const scale = 0.9 + (i % 5) * 0.13;
    const elbow = offset(yaw, 1.4 * scale, 2.3 * scale);
    const fork = offset(yaw + 0.48, 2.1 * scale, 4.5 * scale);
    stem(offset(0, 0, -0.35), elbow, 1.52 * scale, 0.7);
    stem(elbow, fork, 1.07 * scale, 0.64);
    for (let n = 0; n < 4; n++) {
      const angle = yaw + n * 1.65;
      const reach = scale * (n === 0 ? 2.4 : 3.3 + 0.35 * (n % 2));
      const tip = offset(angle, reach, scale * (n === 0 ? 6.7 : 5.2 + (n % 2) * 0.75));
      stem(fork, tip, (n === 0 ? 0.74 : 0.49) * scale, 0.43);
      const crown = MeshBuilder.CreateIcoSphere("medieval1OakLobe", {
        radius: scale * (n === 0 ? 2.25 : 1.3 + 0.16 * n), subdivisions: 1,
      }, scene);
      crown.position = tip.add(new Vector3(0, 0.45, 0));
      crown.scaling.y = 0.74 + 0.05 * (n % 3);
      crown.rotation.y = angle;
      (n % 2 === 0 ? crowns : smallCrowns).push(crown);
    }
  });
  const shadows = scene.getLightByName("dir")?.getShadowGenerator() as ShadowGenerator | null | undefined;
  for (const [parts, material] of [[trunks, bark], [crowns, foliage], [smallCrowns, darkFoliage]] as const) {
    const grove = Mesh.MergeMeshes(parts, true);
    if (!grove) continue;
    grove.name = material.name;
    grove.material = material;
    grove.isPickable = false;
    grove.receiveShadows = true;
    shadows?.addShadowCaster(grove);
  }
}

export function buildMedieval1(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const detachedTrees: Vector3[] = [];
  const oakFeet: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (prior.has(mesh)) continue;
    if (/^(ground$|centerGrass$|islandUnder|islandShelf|islandCliff|fieldBlades_|hazeTreeline|campaign_zone_)/.test(mesh.name)) mesh.setEnabled(false);
    if (/^Introduction Grounds_(cyl|totem_top)$/.test(mesh.name)) {
      detachedTrees.push(mesh.position.clone());
      mesh.setEnabled(false);
    }
    if (/^ruin(Tower|Pillar|Rubble)/.test(mesh.name)) {
      if (/^ruin(TowerPlinth|PillarPlinth|Rubble)/.test(mesh.name)) detachedTrees.push(mesh.position.clone());
      mesh.setEnabled(false);
    }
    if (mesh.name !== "trunk") continue;
    const { x, z } = mesh.position;
    let onLand = false;
    for (let i = 1; i < SHORE.length; i++) {
      const [front, near, far] = SHORE[i - 1];
      const [back, nextNear, nextFar] = SHORE[i];
      if (z < front || z > back) continue;
      const t = (z - front) / (back - front);
      onLand = Math.abs(x) > near + (nextNear - near) * t && Math.abs(x) < far + (nextFar - far) * t;
      break;
    }
    // Leave only a few isolated trees beyond the ruins. The western plateau
    // retains its continuous outer canopy and open battlefield by the bridge.
    const rightBankBreak = x > 0 && !(x > 32 && (z < -21 || (z > 18 && z < 27)));
    if (!onLand || rightBankBreak) {
      detachedTrees.push(mesh.position.clone());
      mesh.setEnabled(false);
    } else {
      oakFeet.push(mesh.position.clone());
      mesh.setEnabled(false);
    }
  }
  gnarledOaks(scene, oakFeet);
  const grass = new StandardMaterial("medieval1Meadow", scene);
  grass.diffuseColor = new Color3(0.48, 0.65, 0.24);
  grass.emissiveColor = grass.diffuseColor.scale(0.1);
  const stone = new StandardMaterial("medieval1Cliff", scene);
  stone.diffuseColor = new Color3(0.56, 0.55, 0.64);
  stone.emissiveColor = stone.diffuseColor.scale(0.44);
  plateau(scene, -1, grass, stone);
  plateau(scene, 1, grass, stone);
  landfallRamp(scene, grass, stone);

  const sea = MeshBuilder.CreateCylinder("medieval1Sea", { diameter: 260, height: 0.15, tessellation: 64 }, scene);
  sea.position.y = -17;
  const water = new StandardMaterial("medieval1Sea", scene);
  water.diffuseColor = new Color3(0.08, 0.65, 0.61);
  water.emissiveColor = new Color3(0.02, 0.22, 0.23);
  sea.material = water;
  sea.isPickable = false;

  for (let i = 0; i < 11; i++) {
    const block = MeshBuilder.CreateBox("medieval1BridgeCourse", {
      width: 1.08, height: 0.45 + Math.abs(i - 5) * 0.42, depth: BRIDGE_DEPTH,
    }, scene);
    block.position.set(i - 5, -(0.45 + Math.abs(i - 5) * 0.42) / 2, BRIDGE_Z);
    block.material = stone;
  }
  for (const z of [BRIDGE_Z - BRIDGE_DEPTH / 2, BRIDGE_Z + BRIDGE_DEPTH / 2]) {
    for (let x = -5; x <= 5; x += 2) {
      const coping = MeshBuilder.CreateBox("medieval1BridgeCoping", { width: 1.88, height: 0.52, depth: 0.46 }, scene);
      coping.position.set(x, 0.18, z);
      coping.material = stone;
    }
  }
  const hazards: MapBuildResult["hazards"] = [];
  for (const [front, back, halfX] of [[-45, -34, 9], [-34, -23, 7], [-23, -10, 5.5], [-10, -3, 4.5], [5, 18, 4.5], [18, 31, 6.8], [31, 42, 9.5]]) {
    hazards.push({ shape: "box", kind: "water", center: new Vector3(0, 0, (front + back) / 2), halfX, halfZ: (back - front) / 2 });
  }
  const obstacles = result.obstacles.filter((o) => !detachedTrees.some((p) => Math.hypot(p.x - o.center.x, p.z - o.center.z) < 0.55));
  rightBankRuins(scene, stone, obstacles);
  const placementZones = result.zones.map((zone) => ({
    ...zone,
    center: new Vector3(Math.sign(zone.center.x) * 23, 0, 0),
    size: new Vector3(36, zone.size.y, 62),
  }));
  return { ...result, obstacles, hazards, placementZones };
}
