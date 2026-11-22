// Curated levels sometimes start actors on scenery. Presentation stays separate
// from flat deterministic battle coordinates and is removed whenever a level resets.
import { Color3, Mesh, MeshBuilder, StandardMaterial, TransformNode, Vector3, type Scene, type ShadowGenerator } from "@babylonjs/core";
import { markStatic, setActiveHeightField, terrainMesh, type HeightField } from "../map/terrain";
import type { RuntimeUnit } from "../units/runtimeUnit";

let cleanup: (() => void) | null = null;

// Scenery seats use clear departure coordinates in the flat simulation. Draw
// the actor on the adjacent crown until it leaves its seat, then lower it onto
// that clear approach over its first four metres. Restore before simulation;
// walls remain solid and ground infantry never inherit the crown's height.
function crownSeats(scene: Scene, units: RuntimeUnit[], base: HeightField | null,
  seat: (unit: RuntimeUnit) => { dx: number; y: number } | null): void {
  const seats = units.flatMap(unit => {
    const offset = unit.team === 1 ? seat(unit) : null;
    return offset ? [{ unit, offset, start: unit.position.clone() }] : [];
  });
  const saved = new Map<RuntimeUnit, Vector3>();
  const before = scene.onBeforeRenderObservable.add(() => {
    for (const { unit, offset, start } of seats) {
      if (unit.body.root.isDisposed()) continue;
      const p = unit.position;
      const t = Math.max(0, 1 - Math.hypot(p.x - start.x, p.z - start.z) / 4);
      if (!t) continue;
      saved.set(unit, p.clone());
      // Terrain's observer already lifted the actor on its departure surface.
      p.x += offset.dx * t;
      p.y += (offset.y - (base?.(start.x, start.z) ?? 0)) * t;
    }
  });
  const restore = () => {
    for (const [unit, p] of saved) {
      if (unit.body.root.isDisposed()) continue;
      // Terrain's after-render observer has removed its own lift by now.
      unit.position.x = p.x;
      unit.position.y = p.y - (base?.(p.x, p.z) ?? 0);
      unit.position.z = p.z;
      unit.body.root.computeWorldMatrix(true);
      for (const node of unit.body.root.getDescendants(false)) node.computeWorldMatrix(true);
    }
    saved.clear();
  };
  const after = scene.onAfterRenderObservable.add(restore);
  cleanup = () => { restore(); scene.onBeforeRenderObservable.remove(before); scene.onAfterRenderObservable.remove(after); };
}

/**
 * Survey "perched on the trees" (reference/stages/adventure.tree_mammoths.png): every enemy starts on its own big ball crown on a white
 * birch trunk, the tribal_1 ring's crowns at perch size, set along the enemy arc of the ring. Spec: one crown under each team-1 unit's
 * spawn, radius r, its standing top at y top..top+vary (seeded per unit). The height field is flat over the crown (flat m from its
 * centre) and ramps to the ground by r + ramp, so a unit that walks off slides down the crown. Drawn only: the battle stays flat.
 */
interface Perch { r: number; top: number; vary: number; flat: number; ramp: number }
const PERCHES: Record<string, Perch> = {
  "adventure.tree_mammoths": { r: 3.6, top: 6.5, vary: 1.5, flat: 2.4, ramp: 3.2 },
  // reference/stages/adventure.tree_tribe.png: the tribe stands one man to a crown, crowns 3-4 m across at 5-7.5 m, three loose rows
  "adventure.tree_tribe": { r: 1.6, top: 5, vary: 2.5, flat: 0.9, ramp: 1.6 },
};
const PERCH_CROWNS = ["tribal1CrownOrange", "tribal1CrownRed", "tribal1CrownOrange2", "tribal1CrownYellow", "tribal1CrownRed2"];

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

/**
 * Survey "a dim cave ... hiding inside, enjoying the fire" (reference/stages/adventure.sneaky_tribe.png): a dark mouth in a wall of
 * faceted grey rock, a boulder either side of it and flat slabs on the ground before it. Spec: the tribe stands 6 x 6 at 1.4 m in
 * x 19..26, z -23.5..-16.5 (adventure.ts), on the front-right ridge's foot; round it a rock shell open to -x (the player): side walls at
 * z -26 and -14 (6-7 m), a back wall at x 30, a 1.8 m roof over x 16..32 whose lip hangs to 3.4 m at the mouth, a crag on top, the
 * inside lined near-black and the roof casting shadow, a fire at the back. Drawn only: no colliders, the battle stays flat.
 */
function tribeCave(scene: Scene): void {
  const rock = scene.getMaterialByName("tribal1Cliff");
  const dark = new StandardMaterial("caveDark", scene);
  dark.diffuseColor = new Color3(0.07, 0.055, 0.055);
  dark.emissiveColor = new Color3(0.02, 0.015, 0.015);
  dark.specularColor = Color3.Black();
  const flame = new StandardMaterial("caveFire", scene);
  flame.diffuseColor = Color3.Black();
  flame.emissiveColor = new Color3(1.2, 0.5, 0.08);
  flame.disableLighting = true;
  const parts: Mesh[] = [];
  const block = (w: number, h: number, d: number, x: number, y: number, z: number, k: number) => {
    const b = MeshBuilder.CreateCylinder("caveRock", { diameterTop: w * 0.82, diameterBottom: w, height: h, tessellation: 6 }, scene);
    b.scaling.z = d / w;
    b.position.set(x, y, z);
    b.rotation.set((seeded(k, 71) - 0.5) * 0.12, (seeded(k, 72) - 0.5) * 0.5, (seeded(k, 73) - 0.5) * 0.1);
    parts.push(b);
  };
  let k = 0;
  // side walls: three masses each, stepping down toward the mouth
  for (const side of [-1, 1]) {
    const z = -20 + side * 6.3;
    for (const [x, h] of [[18, 5.6], [23, 6.6], [28, 7]] as const) block(5.6, h, 3.2, x, h / 2, z + side * seeded(++k, 74) * 0.6, k);
  }
  // back wall and the roof slab with its lip, a crag on top
  block(5, 7.4, 13.5, 30.6, 3.7, -20, ++k);
  const roof = MeshBuilder.CreateBox("caveRoof", { width: 16, height: 1.8, depth: 14.5 }, scene);
  roof.position.set(24, 5.3, -20);
  roof.rotation.set(0.04, 0, -0.06);
  parts.push(roof);
  block(4, 1.6, 13.5, 16.6, 4.2, -20, ++k);
  block(5.5, 4.5, 5, 26, 8.2, -21.5, ++k);
  block(3.5, 3, 3.5, 21, 7, -17, ++k);
  // a boulder either side of the mouth, flat slabs before it
  for (const [x, z, r] of [[15.2, -25.4, 1.7], [15.6, -14.8, 1.4]] as const) {
    const b = MeshBuilder.CreateIcoSphere("caveRock", { radius: r, subdivisions: 1 }, scene);
    b.position.set(x, r * 0.6, z);
    b.scaling.y = 0.8;
    parts.push(b);
  }
  for (const [x, z, w, d, yaw] of [[12.5, -21.5, 3.2, 2.2, 0.4], [14, -17.8, 2.6, 1.8, -0.3], [10.8, -18.6, 2, 1.5, 0.9]] as const) {
    const s = MeshBuilder.CreateCylinder("caveRock", { diameter: w, height: 0.35, tessellation: 5 }, scene);
    s.scaling.z = d / w;
    s.position.set(x, 0.1, z);
    s.rotation.set(0.05, yaw, 0.04);
    parts.push(s);
  }
  const shell = Mesh.MergeMeshes(parts, true);
  const meshes: Mesh[] = [];
  if (shell) {
    shell.name = "tribeCave";
    shell.convertToFlatShadedMesh();
    shell.material = rock;
    meshes.push(shell);
  }
  // the dark inside: a liner on the back wall, both side walls and under the roof
  const liner = [
    MeshBuilder.CreatePlane("caveLiner", { width: 12, height: 6 }, scene),
    MeshBuilder.CreatePlane("caveLiner", { width: 12.5, height: 6 }, scene),
    MeshBuilder.CreatePlane("caveLiner", { width: 12.5, height: 6 }, scene),
    MeshBuilder.CreatePlane("caveLiner", { width: 14, height: 11.5 }, scene),
  ];
  liner[0].position.set(28.05, 3, -20);
  liner[0].rotation.y = Math.PI / 2;
  liner[1].position.set(22.5, 3, -24.6);
  liner[2].position.set(22.5, 3, -15.4);
  liner[2].rotation.y = Math.PI;
  liner[3].position.set(23, 4.35, -20);
  liner[3].rotation.x = -Math.PI / 2;
  for (const m of liner) {
    m.material = dark;
    m.sideOrientation = Mesh.DOUBLESIDE;
    meshes.push(m);
  }
  // the fire at the back
  const fire = MeshBuilder.CreateCylinder("caveFire", { diameterTop: 0, diameterBottom: 0.9, height: 1.1, tessellation: 5 }, scene);
  fire.position.set(27.3, 0.55, -20);
  fire.material = flame;
  meshes.push(fire);
  const shadows = scene.lights.map((l) => l.getShadowGenerator() as ShadowGenerator | null).find((g) => g);
  for (const m of meshes) {
    m.isPickable = false;
    m.receiveShadows = m !== fire;
    if (m !== fire) shadows?.addShadowCaster(m);
  }
  markStatic(meshes);
  cleanup = () => {
    for (const m of meshes) if (!m.isDisposed()) m.dispose();
    for (const mat of [dark, flame]) mat.dispose();
  };
}

/**
 * challenge.a_warm_welcome (card Survey; reference/stages/challenge.a_warm_welcome.thumb.png): a big dark cave in tribal_2's boulder
 * massif, a third of the cliff's height, holding most of the army, with two lines of Chieftains outside its mouth. The map's own mouth
 * is a one-man notch at the foot (x 31, z 6) and the massif's colliders start there, so the cave is built out from the foot: boulder
 * side walls at z 0.2 and 11.8 from x 22.5 to 31, a boulder roof over them (its underside at 4.6 m, a lintel at the mouth x 22), and
 * the inside lined near-black and shadowed; the army stands in x 23.4..29.6, z 1.5..10.5 (challenge.ts). Drawn only: no colliders.
 */
function welcomeCave(scene: Scene): void {
  const rock = scene.getMaterialByName("tribal2Mountain");
  const dark = scene.getMaterialByName("tribal2Cave");
  const parts: Mesh[] = [];
  const boulder = (r: number, x: number, y: number, z: number, k: number) => {
    const b = MeshBuilder.CreateIcoSphere("welcomeCaveRock", { radius: r, subdivisions: 1 }, scene);
    b.position.set(x, y, z);
    b.scaling.set(1, 0.85 + seeded(k, 81) * 0.3, 1);
    b.rotation.set(seeded(k, 82) * 3, seeded(k, 83) * 3, seeded(k, 84) * 3);
    parts.push(b);
  };
  let k = 0;
  for (const z of [-0.4, 12.4]) {
    for (let x = 22.6; x <= 31; x += 2.8) {
      boulder(2.2 + seeded(++k, 85) * 0.6, x, 1.6, z, k);
      boulder(1.9 + seeded(++k, 85) * 0.5, x + 1.2, 4.4, z + (z < 6 ? 0.4 : -0.4), k);
    }
  }
  for (let x = 22.4; x <= 31; x += 2.6) {
    for (const z of [1.8, 4.6, 7.4, 10.2]) boulder(1.8 + seeded(++k, 86) * 0.7, x, 6.6 + seeded(k, 87) * 0.8, z, k);
  }
  // the lintel: a row of boulders hanging lower across the mouth
  for (const z of [1.2, 3.6, 6, 8.4, 10.8]) boulder(1.5 + seeded(++k, 88) * 0.4, 21.9, 5.4, z, k);
  const shell = Mesh.MergeMeshes(parts, true);
  const meshes: Mesh[] = [];
  if (shell) {
    shell.name = "welcomeCave";
    shell.convertToFlatShadedMesh();
    shell.material = rock;
    meshes.push(shell);
  }
  const ceiling = MeshBuilder.CreatePlane("welcomeCaveLiner", { width: 9.5, height: 11.6 }, scene);
  ceiling.position.set(26.8, 4.6, 6);
  ceiling.rotation.x = -Math.PI / 2;
  const left = MeshBuilder.CreatePlane("welcomeCaveLiner", { width: 9, height: 4.6 }, scene);
  left.position.set(26.8, 2.3, 0.75);
  const right = MeshBuilder.CreatePlane("welcomeCaveLiner", { width: 9, height: 4.6 }, scene);
  right.position.set(26.8, 2.3, 11.25);
  right.rotation.y = Math.PI;
  const back = MeshBuilder.CreatePlane("welcomeCaveLiner", { width: 11, height: 4.6 }, scene);
  back.position.set(30.9, 2.3, 6);
  back.rotation.y = Math.PI / 2;
  for (const m of [ceiling, left, right, back]) {
    m.material = dark;
    m.sideOrientation = Mesh.DOUBLESIDE;
    meshes.push(m);
  }
  const shadows = scene.lights.map((l) => l.getShadowGenerator() as ShadowGenerator | null).find((g) => g);
  for (const m of meshes) {
    m.isPickable = false;
    m.receiveShadows = true;
    shadows?.addShadowCaster(m);
  }
  markStatic(meshes);
  cleanup = () => {
    for (const m of meshes) if (!m.isDisposed()) m.dispose();
  };
}

function perchCrowns(scene: Scene, units: RuntimeUnit[], base: HeightField | null, p: Perch): void {
  const crowns = PERCH_CROWNS.map((n) => scene.getMaterialByName(n));
  const bark = scene.getMaterialByName("tribal1Birch");
  const glow = scene.getGlowLayerByName("glow");
  const seats: Array<{ x: number; z: number; h: number }> = [];
  const meshes: Mesh[] = [];
  units.filter((u) => u.team === 1 && !u.linkedParent).forEach((u, i) => {
    const x = u.position.x, z = u.position.z;
    const h = p.top + seeded(i, 61) * p.vary;
    const centre = h - p.r * 0.8;
    // the trunk stops inside the ball's underside and stays out of the glow: its bloom showed through the crown as a pale veil
    const stem = centre - p.r * 0.55;
    const trunk = MeshBuilder.CreateCylinder("perchTrunk", { height: stem, diameterTop: 0.3 + p.r * 0.06, diameterBottom: 0.45 + p.r * 0.1, tessellation: 6 }, scene);
    trunk.position.set(x, stem / 2, z);
    glow?.addExcludedMesh(trunk);
    trunk.material = bark;
    const ball = MeshBuilder.CreateIcoSphere("perchCrown", { radius: p.r, subdivisions: 1 }, scene);
    ball.scaling.y = 0.92;
    ball.rotation.y = seeded(i, 62) * Math.PI;
    ball.position.set(x, centre, z);
    ball.convertToFlatShadedMesh();
    ball.material = crowns[Math.floor(seeded(i, 63) * crowns.length)];
    ball.applyFog = false;
    glow?.addExcludedMesh(ball);
    for (const m of [trunk, ball]) {
      m.receiveShadows = true;
      m.isPickable = false;
      meshes.push(m);
    }
    seats.push({ x, z, h });
  });
  markStatic(meshes);
  const reach = p.r + p.ramp;
  const perched: HeightField = (x, z) => {
    let best = 0;
    for (const s of seats) {
      const dx = x - s.x, dz = z - s.z;
      if (Math.abs(dx) > reach || Math.abs(dz) > reach) continue;
      const d = Math.hypot(dx, dz);
      if (d >= reach) continue;
      const e = d <= p.flat ? 1 : 1 - (d - p.flat) / (reach - p.flat);
      best = Math.max(best, s.h * e * e * (3 - 2 * e));
    }
    return best;
  };
  setActiveHeightField((x, z) => Math.max(base?.(x, z) ?? 0, perched(x, z)));
  cleanup = () => {
    for (const m of meshes) if (!m.isDisposed()) m.dispose();
    setActiveHeightField(base);
  };
}
/**
 * Survey + reference/stages/dynasty.samurai.png: loose files of Samurai stand on a winding grey flagstone path that climbs a few
 * stairs to a torii seen face-on beyond them, the Monk at the top of the stairs. Spec: the rim torii at (40, -33) is turned to face
 * the player (yaw PI/2) and set on the cobble loop at (44.5, -24) for this stage, on a 3 x 6.4 m stone landing; four 0.18 m treads,
 * 0.7 m deep and 2.8 m wide, climb to it from x 41; from the stair foot the path forks into two winding arms (2.2 m wide) that run
 * to the front along z -21.3 and z -26.7, out to x 29.5. Flagstones 0.75-1.1 m, two across, seeded jitter. Height field lifts the
 * treads and landing only. Drawn only: the torii's post colliders and the battle stay as they are.
 */
const SAMURAI_TORII = { x: 44.5, z: -24 };
function samuraiPath(scene: Scene, base: HeightField | null): void {
  const meshes: Mesh[] = [];
  const glow = scene.getGlowLayerByName("glow");
  const stone = new StandardMaterial("samuraiPathStone", scene);
  stone.diffuseColor = new Color3(0.5, 0.51, 0.53);
  stone.emissiveColor = new Color3(0.07, 0.07, 0.075);
  stone.specularColor = Color3.Black();
  const ground = (x: number, z: number) => base?.(x, z) ?? 0;
  const RISE = 0.18, FOOT = 41, TREAD = 0.7, TREADS = 4;
  const top = ground(SAMURAI_TORII.x, SAMURAI_TORII.z) + RISE * TREADS;
  const slab = (w: number, h: number, d: number, x: number, y: number, z: number, yaw: number) => {
    const m = MeshBuilder.CreateBox("samuraiPathStone", { width: w, height: h, depth: d }, scene);
    m.position.set(x, y, z);
    m.rotation.y = yaw;
    m.material = stone;
    m.receiveShadows = true;
    m.isPickable = false;
    glow?.addExcludedMesh(m);
    meshes.push(m);
  };
  // the stair and the landing under the torii
  for (let i = 0; i < TREADS; i++) {
    const h = ground(FOOT + (i + 0.5) * TREAD, SAMURAI_TORII.z) + RISE * (i + 1);
    slab(TREAD + 0.04, h, 2.8, FOOT + (i + 0.5) * TREAD, h / 2, SAMURAI_TORII.z, 0);
  }
  slab(3, top, 6.4, SAMURAI_TORII.x + 0.1, top / 2, SAMURAI_TORII.z, 0);
  // two winding arms from the stair foot to the front
  let k = 0;
  for (const side of [1, -1]) {
    const pts: Array<[number, number]> = [[FOOT, -24], [39.6, -24 + side * 1.4], [38.6, -24 + side * 2.7], [36.4, -24 + side * 2.9], [33.6, -24 + side * 2.4], [31.2, -24 + side * 3.1], [29.5, -24 + side * 2.7]];
    for (let s = 0; s < pts.length - 1; s++) {
      const [ax, az] = pts[s], [bx, bz] = pts[s + 1];
      const len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(len / 0.95));
      const yaw = Math.atan2(bx - ax, bz - az), nx = (bz - az) / len, nz = -(bx - ax) / len;
      for (let j = 0; j < n; j++) {
        const t = (j + 0.5) / n, cx = ax + (bx - ax) * t, cz = az + (bz - az) * t;
        for (const across of [-0.52, 0.52]) {
          k++;
          const w = 0.75 + seeded(k, 81) * 0.3, d = 0.75 + seeded(k, 82) * 0.3;
          const x = cx + nx * across + (seeded(k, 83) - 0.5) * 0.18, z = cz + nz * across + (seeded(k, 84) - 0.5) * 0.18;
          slab(w, 0.12, d, x, ground(x, z) + 0.01, z, yaw + (seeded(k, 85) - 0.5) * 0.5);
        }
      }
    }
  }
  markStatic(meshes);
  // the torii, turned to face the player and stood on the landing
  const gate = scene.getMeshByName("dynastyRimToriiTwin");
  const saved = gate ? { p: gate.position.clone(), r: gate.rotation.y } : null;
  if (gate) {
    gate.position.set(SAMURAI_TORII.x, top, SAMURAI_TORII.z);
    gate.rotation.y = Math.PI / 2;
    gate.computeWorldMatrix(true);
  }
  setActiveHeightField((x, z) => {
    const g = ground(x, z);
    if (Math.abs(z - SAMURAI_TORII.z) > 1.4 && !(Math.abs(z - SAMURAI_TORII.z) < 3.2 && x > SAMURAI_TORII.x - 1.4)) return g;
    if (x < FOOT || x > SAMURAI_TORII.x + 1.6) return g;
    const i = Math.min(TREADS - 1, Math.floor((x - FOOT) / TREAD));
    return Math.max(g, x >= FOOT + TREADS * TREAD ? top : g + RISE * (i + 1));
  });
  cleanup = () => {
    for (const m of meshes) if (!m.isDisposed()) m.dispose();
    if (gate && saved && !gate.isDisposed()) {
      gate.position.copyFrom(saved.p);
      gate.rotation.y = saved.r;
    }
    setActiveHeightField(base);
  };
}

/**
 * reference/stages/dynasty.zeus_and_other_folks.png: the phalanx is drawn up in the street right in front of a whitewashed house,
 * its blue door and a stair flight facing the player, Zeus apart by the door. ancient_1's houses all stand west of the team-1 plaza
 * (their doors face the streets), so for this stage a house of the same make stands behind the army. Spec: 6 m deep (x 36.5..42.5),
 * 10 m along z (-8..2), 3.8 m walls, blue roof band, parapet terrace, an upper room with a dome; on its west face a blue door at z -3.6
 * two shutters toward +z, and an 8-step flight 2 m wide against the face from z -5.2 to -7.8 rising to the roof. Drawn only.
 */
function zeusHouse(scene: Scene): void {
  const plaster = scene.getMaterialByName("ancient1Whitewash");
  const blue = scene.getMaterialByName("ancient1BlueTile");
  const meshes: Mesh[] = [];
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, mat: typeof plaster) => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.position.set(x, y, z);
    m.material = mat;
    m.receiveShadows = true;
    m.isPickable = false;
    meshes.push(m);
  };
  const X0 = 36.5, X1 = 42.5, Z0 = -8, Z1 = 2, H = 3.8;
  const cx = (X0 + X1) / 2, cz = (Z0 + Z1) / 2, w = X1 - X0, d = Z1 - Z0;
  box("zeusHouse", w, H, d, cx, H / 2, cz, plaster);
  box("zeusHouseRoofBand", w + 0.2, 0.24, d + 0.2, cx, H - 0.24, cz, blue);
  box("zeusHouseTerrace", w + 0.3, 0.36, d + 0.3, cx, H, cz, plaster);
  box("zeusHouseUpper", 4.4, 2.2, 4.6, cx + 0.6, H + 1.1, cz + 1.2, plaster);
  box("zeusHouseCoping", 4.7, 0.27, 4.9, cx + 0.6, H + 2.24, cz + 1.2, plaster);
  const dome = MeshBuilder.CreateSphere("zeusHouseDome", { diameter: 4.4, segments: 8, slice: 0.5 }, scene);
  dome.position.set(cx + 0.6, H + 2.3, cz + 1.2);
  dome.material = blue;
  dome.convertToFlatShadedMesh();
  meshes.push(dome);
  // door and shutters on the west (player) face
  box("zeusHouseDoor", 0.14, 2.1, 1.3, X0 - 0.04, 1.05, -3.6, blue);
  for (const z of [-1.6, 0.6]) box("zeusHouseShutter", 0.12, 1.1, 0.78, X0 - 0.03, 1.52, z, blue);
  // the stair flight against the face, climbing toward -z
  for (let i = 0; i < 8; i++) {
    const rise = H * (i + 1) / 8;
    box("zeusHouseStep", 2, rise, 0.34, X0 - 1, rise / 2, -5.2 - 0.33 * i, plaster);
  }
  markStatic(meshes);
  cleanup = () => {
    for (const m of meshes) if (!m.isDisposed()) m.dispose();
  };
}

/**
 * reference/stages/renaissance.balloons.thumb.png: the army stands at the back of the plaza with the street mouth between a
 * pink and a yellow townhouse right behind its centre. The east row (fronts at x = 44) is one unbroken terrace, so the two
 * house fronts and the dark street between them are drawn here on its face behind the centre chevron (z 12), no collider.
 */
function balloonStreet(scene: Scene): void {
  const mat = (name: string, r: number, g: number, b: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = new Color3(r, g, b).scale(0.72);
    m.emissiveColor = new Color3(r, g, b).scale(0.28);
    m.specularColor = Color3.Black();
    return m;
  };
  const pink = mat("balloonStreetPink", 0.88, 0.58, 0.56);
  const yellow = mat("balloonStreetYellow", 0.93, 0.79, 0.42);
  const shade = mat("balloonStreetShade", 0.16, 0.13, 0.12);
  const roof = mat("balloonStreetRoof", 0.78, 0.36, 0.2);
  const glow = scene.getGlowLayerByName("glow");
  const meshes: Mesh[] = [];
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, m: StandardMaterial) => {
    const b = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    b.material = m;
    b.receiveShadows = true;
    b.isPickable = false;
    glow?.addExcludedMesh(b);
    meshes.push(b);
  };
  const Z = 12, GAP = 3.6, W = 5.2, H = 9.5;
  // the street: a dark slot running back between the houses, its floor paving the same shade
  box("balloonStreetMouth", 0.3, H - 0.5, GAP, 43.8, (H - 0.5) / 2, Z, shade);
  for (const [side, m, h] of [[-1, pink, H], [1, yellow, H - 1.2]] as const) {
    const zc = Z + side * (GAP + W) / 2;
    box("balloonStreetFront", 0.4, h, W, 43.75, h / 2, zc, m);
    box("balloonStreetEave", 1.0, 0.45, W + 0.3, 43.55, h + 0.1, zc, roof);
    for (const dz of [-1.4, 1.4]) for (const y of [2.2, 5.2]) box("balloonStreetWindow", 0.1, 1.3, 0.8, 43.5, y, zc + dz, shade);
  }
  markStatic(meshes);
  cleanup = () => {
    for (const m of meshes) if (!m.isDisposed()) m.dispose();
    for (const m of [pink, yellow, shade, roof]) m.dispose();
  };
}

/**
 * Survey "the three Knights are positioned on the land arch" (reference/stages/pirate.you_won_t_make_us_walk_the_plank.png:
 * a leaning ruined stone arch at frame-left of the three Knights). medieval_1 has no arch in the team-1 half, so one is drawn
 * here beside the Knights: two broken stone piers leaning toward the army and a cracked lintel, no collider.
 */
function plankArch(scene: Scene): void {
  const stone = scene.getMaterialByName("medieval1Cliff");
  const coping = scene.getMaterialByName("medieval1RuinedCoping");
  const meshes: Mesh[] = [];
  const root = new TransformNode("plankArchRoot", scene);
  root.position.set(19.4, 0, 6.2);
  root.rotation.x = -0.2; // lean toward -z, over the Knights
  root.rotation.y = 0.35;
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, mat: typeof stone, rz = 0) => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.position.set(x, y, z);
    m.rotation.z = rz;
    m.material = mat;
    m.parent = root;
    m.receiveShadows = true;
    m.isPickable = false;
    meshes.push(m);
  };
  // two piers built of offset courses, the east one broken short
  for (const [x, courses] of [[-1.9, 6], [1.9, 4]] as const) {
    for (let i = 0; i < courses; i++) box("plankArchCourse", 1.25, 1.02, 1.35, x + ((i * 5) % 3 - 1) * 0.08, 0.51 + i * 1.03, 0, stone, ((i % 3) - 1) * 0.03);
  }
  // the lintel resting on the tall pier and slumped onto the broken one
  box("plankArchLintel", 5.2, 0.9, 1.4, 0.2, 5.25, 0, stone, -0.23);
  box("plankArchCoping", 2.4, 0.32, 1.5, -1.5, 5.95, 0, coping, -0.23);
  box("plankArchRubble", 1.1, 0.55, 0.9, 3.2, 0.27, 1.1, stone, 0.3);
  box("plankArchRubble", 0.8, 0.4, 0.8, -3.0, 0.2, -0.9, stone, -0.2);
  markStatic(meshes);
  cleanup = () => {
    for (const m of meshes) if (!m.isDisposed()) m.dispose();
    root.dispose();
  };
}

/**
 * Survey "there's Fencers in the large cornered building ... ready to step down the stairs" (reference/stages/renaissance.renaissance_fencer.png:
 * cream arcaded buildings round the square, the Musketeers alone on the open paving). The Fencers must stand in the team-1 zone, so for this
 * stage a corner building of the piazza's make stands in team 1's back corner with them inside it. Spec: x 33.5..40.5, z 20.5..28.5; a ground
 * loggia open to the player (-x) on five columns, its floor 0.6 m up with three steps down the whole front; solid side and back walls in
 * cream, the inside a shade darker; an upper storey with three windows, a cornice and a low orange roof (13 m). Height field lifts the floor
 * and steps. Drawn only.
 */
const LOGGIA = { x0: 33.5, x1: 40.5, z0: 20.5, z1: 28.5, floor: 0.6 };
function fencerLoggia(scene: Scene, base: HeightField | null): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const cream = mk("fencerLoggiaCream", new Color3(0.93, 0.86, 0.72), 0.45);
  const shade = mk("fencerLoggiaShade", new Color3(0.45, 0.38, 0.33), 0.3);
  const stone = mk("fencerLoggiaStone", new Color3(0.82, 0.78, 0.72), 0.35);
  const roof = mk("fencerLoggiaRoof", new Color3(0.78, 0.36, 0.2), 0.3);
  const dark = mk("fencerLoggiaWindow", new Color3(0.16, 0.14, 0.16), 0.1);
  const meshes: Mesh[] = [];
  // pale self-lit walls in the glow pass bloom near-white (LESSONS): keep the loggia out of it
  const glow = scene.getGlowLayerByName("glow");
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, mat: StandardMaterial) => {
    const m = MeshBuilder.CreateBox("fencerLoggia", { width: w, height: h, depth: d }, scene);
    glow?.addExcludedMesh(m);
    m.position.set(x, y, z);
    m.material = mat;
    m.receiveShadows = true;
    m.isPickable = false;
    meshes.push(m);
  };
  const { x0, x1, z0, z1, floor: F } = LOGGIA;
  const w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const G = 4.4, U = 4.6;
  box(w, F, d, cx, F / 2, cz, stone);
  for (let i = 0; i < 3; i++) box(0.35, F * (3 - i) / 4, d, x0 - 0.175 - 0.35 * i, F * (3 - i) / 8, cz, stone);
  // back and side walls of the ground loggia, the inside face darker
  box(0.4, G, d, x1 - 0.2, F + G / 2, cz, cream);
  box(0.06, G - 0.2, d - 0.8, x1 - 0.43, F + G / 2, cz, shade);
  for (const z of [z0 + 0.2, z1 - 0.2]) box(w, G, 0.4, cx, F + G / 2, z, cream);
  box(w - 0.6, 0.06, d - 0.8, cx + 0.1, F + G - 0.05, cz, shade);
  // five columns and the beam over the open front
  for (let i = 0; i < 5; i++) box(0.5, G - 0.6, 0.5, x0 + 0.3, F + (G - 0.6) / 2, z0 + 0.4 + i * (d - 0.8) / 4, cream);
  box(0.7, 0.6, d, x0 + 0.3, F + G - 0.3, cz, cream);
  // upper storey with windows, cornice and roof
  box(w, U, d, cx, F + G + U / 2, cz, cream);
  for (const z of [cz - 2.4, cz, cz + 2.4]) box(0.08, 1.9, 1.0, x0 - 0.02, F + G + 2.2, z, dark);
  box(w + 0.5, 0.35, d + 0.5, cx, F + G + U + 0.17, cz, stone);
  box(w + 0.2, 1.2, d + 0.2, cx, F + G + U + 0.95, cz, roof);
  markStatic(meshes);
  const ground = (x: number, z: number) => base?.(x, z) ?? 0;
  setActiveHeightField((x, z) => {
    if (z < z0 + 0.4 || z > z1 - 0.4 || x > x1 || x < x0 - 1.05) return ground(x, z);
    if (x >= x0) return Math.max(ground(x, z), F);
    const step = Math.floor((x0 - x) / 0.35);
    return Math.max(ground(x, z), F * (3 - step) / 4);
  });
  cleanup = () => {
    for (const m of meshes) if (!m.isDisposed()) m.dispose();
    setActiveHeightField(base);
  };
}

// Ancient 2's army stands on the approach below the city, with a pale path
// along its front edge and returning left to the temple stair (reference:
// renaissance.renaissance_vs_ancient_2.png). Preserve the map's general paths.
function ancientApproach(scene: Scene): void {
  const material = scene.getMaterialByName("ancient2PathClay");
  const pieces = [
    { x: 26, z: 12, w: 3.4, d: 28 },
    { x: 13, z: 24, w: 26, d: 3.4 },
  ].map(({ x, z, w, d }) => {
    const m = MeshBuilder.CreateBox("ancientApproach", { width: w, height: 0.08, depth: d }, scene);
    m.position.set(x, 0.25, z);
    m.material = material;
    m.receiveShadows = true;
    m.isPickable = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(m);
    return m;
  });
  markStatic(pieces);
  cleanup = () => { for (const m of pieces) if (!m.isDisposed()) m.dispose(); };
}

// Bone's reference is a graveyard approach: two broken low walls flank the
// receding warriors and a tower rises immediately at the left. For this stage
// only, use the map's own stone/tower, with all moved map meshes restored on exit.
function boneApproach(scene: Scene): void {
  const stone = scene.getMaterialByName("spooky1CliffStone");
  const walls: Mesh[] = [];
  for (const z of [1.5, 24]) for (const [x, w] of [[13, 6], [21.5, 5], [29, 6]] as const) {
    for (let course = 0; course < 2; course++) {
      const m = MeshBuilder.CreateBox("boneApproachWall", { width: w, height: 0.38, depth: 0.8 }, scene);
      m.position.set(x + course * 0.2, 0.19 + course * 0.38, z);
      m.material = stone;
      m.isPickable = false;
      markStatic([m]);
      walls.push(m);
    }
  }
  const towers = ["spooky1Watchtower", "spooky1TowerWindows"].flatMap(name => {
    const m = scene.getMeshByName(name);
    if (!m) return [];
    const position = m.position.clone();
    m.position.addInPlace(new Vector3(-15, 0, -6));
    return [{ m, position }];
  });
  const fence = scene.getMeshByName("spooky1GraveFence");
  const fenceEnabled = fence?.isEnabled();
  fence?.setEnabled(false);
  cleanup = () => {
    for (const m of walls) if (!m.isDisposed()) m.dispose();
    for (const { m, position } of towers) if (!m.isDisposed()) m.position.copyFrom(position);
    if (fence && !fence.isDisposed()) fence.setEnabled(fenceEnabled ?? true);
  };
}

export function clearStagePresentation(): void {
  cleanup?.();
  cleanup = null;
}

export function applyStagePresentation(scene: Scene, id: string, units: RuntimeUnit[], base: HeightField | null): void {
  clearStagePresentation();
  if (id === "simulation.wall") {
    // Reference: five Berserkers along each seven-metre wall crown. Their
    // clear departure pad is x10; crown x6, z +/-4..12, leaves the slot open.
    crownSeats(scene, units, base, unit => unit.definition.id === "viking.berserker" ? { dx: -4, y: 7 } : null);
    return;
  }
  if (id === "simulation.siege" || id === "legacy.siege") {
    // Legacy's Siege is the same level on the same map (card Survey).
    const terraces = id === "simulation.siege";
    // Four rifle seats on either front wall, at the two stepped crown heights.
    crownSeats(scene, units, base, unit => unit.definition.id === "renaissance.musketeer"
      ? { dx: 3.5, y: Math.abs(unit.position.z) < 12 ? 15 : 18 }
      // Each rear terrace wing seats one King behind four Fencers. Their
      // clear courtyard departure points are eight metres before the seats.
      : terraces && (unit.definition.id === "medieval.king" || unit.definition.id === "renaissance.fencer")
        ? { dx: 8, y: 14 } : null);
    return;
  }
  if (id === "simulation.catapult_castle") {
    // This level seats an engine inside the gate, below its crown. Keep the
    // map's normal crown height for its other stages and sandbox defenders.
    setActiveHeightField((x, z) => x > 27.5 && x < 36.5 && Math.abs(z) < 4.6 ? 12 : base?.(x, z) ?? 0);
    cleanup = () => setActiveHeightField(base);
    return;
  }
  if (id === "spooky.war") {
    // War Survey/reference: nine Vampires wait behind the central force up a
    // broad stair. Ten 1 m treads climb from x22 to a 4 m landing at x32..34.
    const steps: Mesh[] = [];
    const stone = scene.getMaterialByName("spooky2TerraceStone");
    for (let i = 0; i < 12; i++) {
      const h = Math.min(i + 1, 10) * 0.4;
      const m = MeshBuilder.CreateBox("warRearStair", { width: 1, height: h, depth: 8 }, scene);
      m.position.set(22.5 + i, h / 2, 0);
      m.material = stone;
      m.receiveShadows = true;
      steps.push(m);
    }
    markStatic(steps);
    setActiveHeightField((x, z) => x >= 22 && x < 34 && Math.abs(z) < 4
      ? Math.min(Math.floor(x - 22) + 1, 10) * 0.4 : base?.(x, z) ?? 0);
    cleanup = () => { setActiveHeightField(base); for (const m of steps) m.dispose(); };
    return;
  }
  if (id === "spooky.bone") {
    boneApproach(scene);
    return;
  }
  if (id === "adventure.final_destination_wheelbarrow") {
    const cart = units.find(unit => unit.team === 1 && unit.definition.id === "farmer.wheelbarrow");
    if (!cart) return;
    // The existing arch spans the back street at (0,10), its apex at y7.2.
    // A contiguous 8 x 3.6 m crown gives the cart a full-width standing approach
    // before the statue, with the pavement below remaining available to passers.
    const cap = MeshBuilder.CreateBox("wheelbarrowArchCrown", { width: 8, height: 0.5, depth: 3.6 }, scene);
    cap.position.set(1.2, 7.15, 10);
    cap.material = scene.getMaterialByName("ancient1Whitewash");
    cap.receiveShadows = true;
    markStatic([cap]);
    const crew = units.filter(unit => unit === cart || unit.linkedParent === cart);
    const heights = new Map<RuntimeUnit, number>();
    const before = scene.onBeforeRenderObservable.add(() => {
      if (cart.isDead || cart.body.root.isDisposed()) return;
      const p = cart.position;
      if (p.x < -2.8 || p.x > 5.2 || Math.abs(p.z - 10) > 1.8) return;
      for (const unit of crew) {
        if (unit.body.root.isDisposed()) continue;
        heights.set(unit, unit.position.y);
        unit.position.y += 7.4;
      }
    });
    const restore = () => {
      for (const [unit, y] of heights) {
        if (unit.body.root.isDisposed()) continue;
        unit.position.y = y;
        unit.body.root.computeWorldMatrix(true);
        for (const node of unit.body.root.getDescendants(false)) node.computeWorldMatrix(true);
      }
      heights.clear();
    };
    const after = scene.onAfterRenderObservable.add(restore);
    cleanup = () => {
      restore();
      scene.onBeforeRenderObservable.remove(before);
      scene.onAfterRenderObservable.remove(after);
      if (!cap.isDisposed()) cap.dispose();
    };
    return;
  }
  if (id === "adventure.a_fierce_rider") {
    const host = units.find(unit => unit.team === 1 && unit.definition.id === "tribal.mammoth");
    const rider = units.find(unit => unit.team === 1 && unit.definition.id === "farmer.halfling");
    if (!host || !rider) return;
    // One scripted Halfling sits astride the leader's shoulder, the knees bent
    // down either side of the hide. Draw placement tracks the animated host;
    // restore every transform before simulation reads attack origins or bounds.
    const body = rider.body;
    const joints = [body.leftHip, body.rightHip, body.leftKnee, body.rightKnee];
    const rotations = joints.map(joint => joint.rotation.clone());
    const saved = new Vector3(), facing = new Vector3();
    let mounted = false;
    const before = scene.onBeforeRenderObservable.add(() => {
      if (host.isDead || rider.isDead || body.root.isDisposed() || host.body.root.isDisposed()) return;
      saved.copyFrom(body.root.position);
      facing.copyFrom(body.root.rotation);
      joints.forEach((joint, i) => rotations[i].copyFrom(joint.rotation));
      // Anchor to the actual enlarged head and mane bounds. The torso-space
      // shoulder is behind the projecting skull and occludes a tiny Halfling
      // even at its nominal crown height. Seat the pelvis on the visible crest.
      host.body.headMesh.computeWorldMatrix(true);
      const seat = host.body.headMesh.getAbsolutePosition().clone();
      let crown = -Infinity;
      for (const mesh of host.body.allMeshes) {
        if (mesh !== host.body.headMesh && mesh.name !== "crest") continue;
        mesh.computeWorldMatrix(true);
        crown = Math.max(crown, mesh.getBoundingInfo().boundingBox.maximumWorld.y);
      }
      seat.y = crown + 0.08;
      body.root.position.copyFrom(seat);
      body.root.position.y -= body.hip.position.y;
      body.root.rotation.copyFrom(host.body.root.rotation);
      for (const joint of [body.leftHip, body.rightHip]) joint.rotation.x = -1.05;
      body.leftHip.rotation.z = -0.5;
      body.rightHip.rotation.z = 0.5;
      for (const joint of [body.leftKnee, body.rightKnee]) joint.rotation.x = 1.35;
      mounted = true;
    });
    const restore = () => {
      if (!mounted || body.root.isDisposed()) return;
      body.root.position.copyFrom(saved);
      body.root.rotation.copyFrom(facing);
      joints.forEach((joint, i) => joint.rotation.copyFrom(rotations[i]));
      body.root.computeWorldMatrix(true);
      for (const node of body.root.getDescendants(false)) node.computeWorldMatrix(true);
      mounted = false;
    };
    const after = scene.onAfterRenderObservable.add(restore);
    cleanup = () => {
      restore();
      scene.onBeforeRenderObservable.remove(before);
      scene.onAfterRenderObservable.remove(after);
    };
    return;
  }
  if (id === "challenge.a_warm_welcome") {
    welcomeCave(scene);
    return;
  }
  if (id === "adventure.sneaky_tribe") {
    tribeCave(scene);
    return;
  }
  if (id === "dynasty.samurai") {
    samuraiPath(scene, base);
    return;
  }
  if (id === "dynasty.zeus_and_other_folks") {
    zeusHouse(scene);
    return;
  }
  if (id === "renaissance.renaissance_fencer") {
    fencerLoggia(scene, base);
    return;
  }
  if (id === "renaissance.renaissance_vs_ancient_2") {
    ancientApproach(scene);
    return;
  }
  if (id === "renaissance.balloons") {
    balloonStreet(scene);
    return;
  }
  if (id === "pirate.you_won_t_make_us_walk_the_plank") {
    plankArch(scene);
    return;
  }
  const perch = PERCHES[id];
  if (perch) {
    perchCrowns(scene, units, base, perch);
    return;
  }
  if (id !== "adventure.the_tiniest_attack") return;
  // Reference: a lone Farmer silhouettes the rounded crest above surrounding
  // wheat. An 18 x 16 m pasture hill rises 6.5 m, with smooth walkable shoulders.
  const hill: HeightField = (x, z) => {
    const r = Math.hypot((x - 20) / 9, (z + 9.9) / 8);
    return r >= 1 ? 0 : 6.5 * Math.pow(1 - r * r, 2);
  };
  const mound = terrainMesh(scene, "tiniestSummit", hill, { width: 18, depth: 16, step: 1, cx: 20, cz: -9.9 });
  mound.material = scene.getMaterialByName("grass");
  mound.receiveShadows = true;
  markStatic([mound]);
  setActiveHeightField((x, z) => Math.max(base?.(x, z) ?? 0, hill(x, z)));
  cleanup = () => {
    if (!mound.isDisposed()) mound.dispose();
    setActiveHeightField(base);
  };
}
