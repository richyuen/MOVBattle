// TABS "Wild West" (wild west map): a round desert island, a western town of false-front wooden buildings along the back and front
// right of a wide dirt street, a stepped red mesa with cacti on the back left, red rock arches, a white chapel in the back right
// corner, under an orange sunset (reference/maps/wiki/wild_west.png, reference/maps/western.png; card loop/cards/maps/wild_west.md).
// Built on campaign.wild_west (base(); never edit the base, dress its build here).
//
// Town (576, wiki wild_west.png: the street is lined by two-storey clapboard buildings painted slate blue-grey, each with a tall false
// front whose top is stepped or arched, white trim, pale lit windows in two rows, a flat blue roof, a covered porch on posts along the
// street with a balcony rail over it on some, and a sign board across the false front). Spec: a back row of five buildings along z 31..40
// (x -27..27, 9-10.5 m wide with 1.4 m alleys) and a front-right row of three along z -31..-40 (x 1..27), all facing the street (z 0);
// bodies 6-7.5 m high, false fronts 1.6-2.6 m above the roof; porch 2.4 m deep, roof at 3.4 m on five posts; a balcony rail on the
// porch roof on every other building; windows 1 x 1.4 m, four per floor; sign board 5.5 x 1.1 m under the false-front top. The base's
// two black boxes (houses at (4,-16) and (6,16)) go with their colliders; one box collider per building plus its porch. Both armies'
// zones (|x| 27..61, |z| 9..27) and the stage armies (x 28.6..35.5, z -25..-11) stay clear.
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type DirectionalLight, type HemisphericLight, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const ROWS: Array<{ z: number; face: number; from: number; to: number }> = [
  { z: 35.5, face: -1, from: -27, to: 27 },
  { z: -35.5, face: 1, from: 1, to: 27 },
];
const DEPTH = 9;
const ALLEY = 1.4;

function town(scene: Scene, obstacles: Obstacle[]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    board: mk("wildWestBoard", new Color3(0.36, 0.41, 0.53), 0.5),
    boardAlt: mk("wildWestBoardAlt", new Color3(0.5, 0.46, 0.44), 0.5),
    seam: mk("wildWestSeam", new Color3(0.2, 0.22, 0.3), 0.45),
    trim: mk("wildWestTrim", new Color3(0.9, 0.87, 0.8), 0.5),
    roof: mk("wildWestRoof", new Color3(0.27, 0.36, 0.62), 0.5),
    window: mk("wildWestWindow", new Color3(0.85, 0.93, 1), 0.85),
    plank: mk("wildWestPlank", new Color3(0.55, 0.38, 0.24), 0.45),
    sign: mk("wildWestSign", new Color3(0.3, 0.22, 0.17), 0.45),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { board: [], boardAlt: [], seam: [], trim: [], roof: [], window: [], plank: [], sign: [] };
  let k = 0;
  for (const row of ROWS) {
    const count = Math.round((row.to - row.from + ALLEY) / (9.8 + ALLEY));
    const each = (row.to - row.from - ALLEY * (count - 1)) / count;
    for (let i = 0; i < count; i++, k++) {
      const w = each - seeded(k, 1) * 0.8;
      const cx = row.from + i * (each + ALLEY) + each / 2;
      const h = 6 + seeded(k, 2) * 1.5;
      const f = row.face;
      // In local terms: u along the street (x), v toward the street (f * -z offset from the row line)
      const at = (u: number, v: number) => [cx + u, row.z + f * v] as const;
      const box = (key: keyof typeof mats, bw: number, bh: number, bd: number, u: number, y: number, v: number) => {
        const b = MeshBuilder.CreateBox("wildWestPart", { width: bw, height: bh, depth: bd }, scene);
        const [x, z] = at(u, v);
        b.position.set(x, y, z);
        parts[key].push(b);
      };
      const wall = seeded(k, 3) < 0.7 ? "board" : "boardAlt";
      const front = DEPTH / 2;
      box(wall, w, h, DEPTH, 0, h / 2, 0);
      // Clapboard: thin dark seams across the street face
      for (let y = 0.7; y < h - 0.3; y += 0.55) box("seam", w + 0.02, 0.06, 0.05, 0, y, front + 0.02);
      box("roof", w + 0.3, 0.35, DEPTH + 0.3, 0, h + 0.17, 0);
      // False front: a taller board wall at the street face, its top stepped or arched, white trim round it
      const rise = 1.6 + seeded(k, 4) * 1;
      box(wall, w, rise, 0.4, 0, h + rise / 2, front - 0.2);
      if (seeded(k, 5) < 0.5) {
        box(wall, w * 0.5, 0.9, 0.4, 0, h + rise + 0.45, front - 0.2);
        box("trim", w * 0.54, 0.22, 0.55, 0, h + rise + 0.95, front - 0.2);
      } else {
        // A disc whose lower half sinks into the false front: its upper half reads as the arched top
        const arch = MeshBuilder.CreateCylinder("wildWestArch", { diameter: w * 0.55, height: 0.38, tessellation: 16 }, scene);
        arch.rotation.x = Math.PI / 2;
        const [x, z] = at(0, front - 0.2);
        arch.position.set(x, h + rise, z);
        parts[wall].push(arch);
      }
      box("trim", w + 0.3, 0.22, 0.55, 0, h + rise, front - 0.2);
      for (const s of [-1, 1]) box("trim", 0.25, h + rise, 0.5, s * w / 2, (h + rise) / 2, front - 0.15);
      // Sign board under the false-front top
      box("sign", Math.min(5.5, w - 1.5), 1.1, 0.12, 0, h + rise * 0.45, front + 0.05);
      box("trim", Math.min(5.5, w - 1.5) + 0.2, 0.12, 0.14, 0, h + rise * 0.45 + 0.6, front + 0.05);
      // Two rows of windows (lower row beside the door)
      for (const [y, us] of [[1.9, [-w * 0.36, -w * 0.18, w * 0.18, w * 0.36]], [h - 2, [-w * 0.36, -w * 0.12, w * 0.12, w * 0.36]]] as const) {
        for (const u of us) {
          box("window", 1, 1.4, 0.08, u, y, front + 0.06);
          box("trim", 1.2, 0.14, 0.12, u, y + 0.78, front + 0.07);
        }
      }
      box("seam", 1.4, 2.4, 0.08, 0, 1.2, front + 0.06);
      // Porch: deck, posts and a roof along the street; a balcony rail on every other one
      const pd = 2.4;
      box("plank", w, 0.3, pd, 0, 0.15, front + pd / 2);
      for (let p = 0; p < 5; p++) box("plank", 0.22, 3.4, 0.22, -w / 2 + 0.3 + p * (w - 0.6) / 4, 1.7, front + pd - 0.2);
      box("roof", w + 0.2, 0.22, pd + 0.2, 0, 3.5, front + pd / 2);
      if (k % 2 === 0) {
        box("trim", w, 0.12, 0.12, 0, 4.4, front + pd - 0.1);
        for (let p = 0; p <= 12; p++) box("trim", 0.08, 0.8, 0.08, -w / 2 + p * w / 12, 4, front + pd - 0.1);
      }
      const [ox, oz] = at(0, pd / 2);
      obstacles.push({ type: "box", center: new Vector3(ox, 0, oz), halfX: w / 2, halfZ: (DEPTH + pd) / 2 });
    }
  }
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `wildWestTown_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
    if (key !== "window") glow?.addExcludedMesh(merged);
  }
}

// Open street (577, wild_west.leading_cacti.png and the wiki shot: the middle of the main street is clear dirt between the
// two rows; nothing stands in it). Spec: the base's dark barricade box at the field centre (0, 0) and its collider go.
function openStreet(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const atCentre = (x: number, z: number) => Math.hypot(x, z) < 0.5;
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && mesh.name === "Wild West Flats_box" && atCentre(mesh.position.x, mesh.position.z)) mesh.setEnabled(false);
  }
  result.obstacles = result.obstacles.filter(({ center }) => !atCentre(center.x, center.z));
}

// Desert rim (577, western.png and the wiki shot: no leafy trees round the edge; the rim carries tall green saguaro cacti with one
// or two upturned arms, grey-brown dead trees with a few bare limbs, and low red sandstone mesas stepping up in faceted tiers with
// paler bands). Spec: every base ring tree (an unparented "trunk" with its crown as children) goes, its collider kept; in its place
// a saguaro 3-5.5 m tall (column 0.75 m, rounded top, 1-2 arms 1-1.6 m up) for about 60% of them, else a dead tree 4-6 m with
// three limbs; mesas of three stacked 7-sided tiers (radius 4.5/3.4/2.2 m, 3/2.6/2 m high) at the back left (-36, 32), front left
// (-30, -36) and front right (38, -32), outside both zones (|z| <= 27) and the town rows, one cylinder collider each.
function desertRim(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    cactus: mk("wildWestSaguaro", new Color3(0.26, 0.46, 0.2), 0.35),
    wood: mk("wildWestDeadWood", new Color3(0.42, 0.33, 0.25), 0.35),
    rock: mk("wildWestMesa", new Color3(0.72, 0.33, 0.18), 0.45),
    band: mk("wildWestMesaBand", new Color3(0.86, 0.52, 0.32), 0.45),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { cactus: [], wood: [], rock: [], band: [] };
  const spots: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || mesh.name !== "trunk" || mesh.parent || !mesh.isEnabled()) continue;
    spots.push([mesh.position.x, mesh.position.z]);
    mesh.setEnabled(false);
  }
  const limb = (k: keyof typeof mats, x: number, y: number, z: number, len: number, d: number, tiltX: number, tiltZ: number) => {
    const c = MeshBuilder.CreateCylinder("wildWestRimPart", { height: len, diameterTop: d * 0.8, diameterBottom: d, tessellation: 7 }, scene);
    c.rotation.set(tiltX, 0, tiltZ);
    c.position.set(x, y, z);
    parts[k].push(c);
  };
  spots.forEach(([x, z], i) => {
    const tall = seeded(i, 51);
    if (seeded(i, 52) < 0.6) {
      const h = 3 + tall * 2.5;
      limb("cactus", x, h / 2, z, h, 0.75, 0, 0);
      const top = MeshBuilder.CreateIcoSphere("wildWestRimPart", { radius: 0.36, subdivisions: 1 }, scene);
      top.position.set(x, h, z);
      parts.cactus.push(top);
      const arms = seeded(i, 53) < 0.5 ? 1 : 2;
      for (let a = 0; a < arms; a++) {
        const side = a ? -1 : 1, ang = seeded(i, 54) * Math.PI;
        const ox = Math.cos(ang) * side, oz = Math.sin(ang) * side;
        const y = h * (0.35 + seeded(i + a, 55) * 0.2), up = 1 + seeded(i + a, 56) * 0.6;
        limb("cactus", x + ox * 0.55, y, z + oz * 0.55, 1.1, 0.5, Math.PI / 2 * oz, -Math.PI / 2 * ox);
        limb("cactus", x + ox * 1.05, y + up / 2, z + oz * 1.05, up, 0.5, 0, 0);
      }
    } else {
      const h = 4 + tall * 2;
      limb("wood", x, h / 2, z, h, 0.45, 0, 0);
      for (let b = 0; b < 3; b++) {
        const ang = b * 2.1 + seeded(i, 57) * 6.28, len = 1.6 + seeded(i + b, 58) * 1.2;
        limb("wood", x + Math.cos(ang) * len * 0.3, h * (0.6 + b * 0.12), z + Math.sin(ang) * len * 0.3, len, 0.2, Math.sin(ang) * 0.8, -Math.cos(ang) * 0.8);
      }
    }
  });
  for (const [mx, mz] of [[-36, 32], [-30, -36], [38, -32]]) {
    let y = 0;
    for (const [rad, h] of [[4.5, 3], [3.4, 2.6], [2.2, 2]]) {
      const tier = MeshBuilder.CreateCylinder("wildWestRimPart", { height: h, diameterTop: rad * 1.7, diameterBottom: rad * 2, tessellation: 7 }, scene);
      tier.rotation.y = rad;
      tier.position.set(mx + (rad - 4.5) * 0.3, y + h / 2, mz);
      parts.rock.push(tier);
      const band = MeshBuilder.CreateCylinder("wildWestRimPart", { height: 0.35, diameter: rad * 1.95, tessellation: 7 }, scene);
      band.rotation.y = rad;
      band.position.set(mx + (rad - 4.5) * 0.3, y + h * 0.55, mz);
      parts.band.push(band);
      y += h;
    }
    obstacles.push({ type: "cylinder", center: new Vector3(mx, 0, mz), radius: 4.5 });
  }
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `wildWestRim_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  }
}

// Sunset sky (578, wild_west.bullets_and_chains.png: the town stands under a warm orange-peach haze, a big pale sun low over the
// horizon flooding the field with warm light and long shadows; no grey range and no clouds). Spec: clear colour (0.95, 0.66, 0.44)
// and fog (0.97, 0.72, 0.5); the base's mountain* range and clouds hidden; the directional light low (elevation ~17 deg) from +x,
// warm (1.25, 0.85, 0.55) at 1.1; the hemispheric light warm (1, 0.8, 0.62) over a rust ground (0.45, 0.3, 0.22); a sun disc 22 m
// across 190 m out along the light, with a soft halo, unlit, out of fog and glow; lights and colours restored on dispose.
function sunsetSky(scene: Scene, built: Set<unknown>): () => void {
  const oldClear = scene.clearColor.clone();
  const oldFog = scene.fogColor.clone();
  scene.clearColor.set(0.95, 0.66, 0.44, 1);
  scene.fogColor = new Color3(0.97, 0.72, 0.5);
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && (mesh.name.startsWith("mountain") || mesh.name.startsWith("cloud"))) mesh.setEnabled(false);
  }
  const hemi = scene.getLightByName("hemi") as HemisphericLight | null;
  const dir = scene.getLightByName("dir") as DirectionalLight | null;
  const saved = {
    hemi: hemi ? [hemi.intensity, hemi.diffuse.clone(), hemi.groundColor.clone()] as const : null,
    dir: dir ? [dir.intensity, dir.diffuse.clone(), dir.direction.clone()] as const : null,
  };
  const toward = new Vector3(-0.9, -0.3, 0.32).normalize();
  if (hemi) {
    hemi.diffuse = new Color3(1, 0.8, 0.62);
    hemi.groundColor = new Color3(0.45, 0.3, 0.22);
  }
  if (dir) {
    dir.intensity = 1.1;
    dir.diffuse = new Color3(1.25, 0.85, 0.55);
    dir.direction.copyFrom(toward);
  }
  const glow = scene.getGlowLayerByName("glow");
  const disc = (name: string, d: number, c: Color3, alpha: number, back: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.Black();
    m.emissiveColor = c;
    m.disableLighting = true;
    m.alpha = alpha;
    const s = MeshBuilder.CreateSphere(name, { diameter: d, segments: 16 }, scene);
    s.position = toward.scale(-(190 + back));
    s.material = m;
    s.applyFog = false;
    s.isPickable = false;
    glow?.addExcludedMesh(s);
  };
  disc("wildWestSun", 22, new Color3(1, 0.97, 0.86), 1, 0);
  disc("wildWestSunHalo", 44, new Color3(1, 0.85, 0.6), 0.3, 6);
  return () => {
    scene.clearColor.copyFrom(oldClear);
    scene.fogColor.copyFrom(oldFog);
    if (hemi && saved.hemi) [hemi.intensity, hemi.diffuse, hemi.groundColor] = [saved.hemi[0], saved.hemi[1], saved.hemi[2]];
    if (dir && saved.dir) [dir.intensity, dir.diffuse, dir.direction] = [saved.dir[0], saved.dir[1], saved.dir[2]];
  };
}

// A broad, flat-bottomed sandstone drum replaces the suspended pointed underside.
function sandstoneBase(scene: Scene, built: Set<unknown>): void {
  for(const m of scene.meshes) if(built.has(m)&&/^(islandUnder|islandShelf|islandCliff)/.test(m.name)) m.setEnabled(false);
  const sand=new StandardMaterial("westSandstoneBase",scene);
  sand.diffuseColor.set(0.65,0.46,0.28);sand.emissiveColor.set(0.3,0.21,0.13);sand.specularColor=Color3.Black();
  const slab=MeshBuilder.CreateCylinder("westSandstoneDrum",{height:9,diameterTop:111,diameterBottom:106,tessellation:20},scene);
  slab.position.y=-4.7;slab.scaling.z=0.91;slab.material=sand;slab.convertToFlatShadedMesh();
}

// Long overlapping polygonal terraces behind the left rear town row, as in the wiki overview.
function mesaRidge(scene: Scene): void {
  const rock=new StandardMaterial("westRidgeRed",scene);
  rock.diffuseColor.set(0.55,0.19,0.095);rock.emissiveColor.set(0.18,0.055,0.025);
  const band=new StandardMaterial("westRidgeBand",scene);
  band.diffuseColor.set(0.72,0.32,0.15);band.emissiveColor.set(0.18,0.08,0.03);
  for(let i=0;i<5;i++) for(let t=0;t<3;t++) {
    const m=MeshBuilder.CreateCylinder("westMesaRidge",{height:2.8,diameterBottom:18-t*3,diameterTop:16-t*3,tessellation:6},scene);
    m.scaling.set(1.25,1,0.55);m.position.set(-43+i*6,1.4+t*2.65,43+t*1.6);
    m.rotation.y=0.2+0.12*i;m.material=t===1?band:rock;m.convertToFlatShadedMesh();
  }
}

// White clapboard chapel at the far right end of the rear street, outside all placement zones.
function chapel(scene: Scene, obstacles: Obstacle[]): void {
  const white = new StandardMaterial("westChapelWhite", scene);
  white.diffuseColor.set(0.8, 0.76, 0.65); white.emissiveColor.set(0.24, 0.22, 0.18);
  const slate = new StandardMaterial("westChapelSlate", scene);
  slate.diffuseColor.set(0.07, 0.09, 0.15); slate.emissiveColor.set(0.02, 0.025, 0.04);
  const wood = new StandardMaterial("westChapelDoor", scene);
  wood.diffuseColor.set(0.22, 0.12, 0.08);
  const put = (w: number, h: number, d: number, x: number, y: number, z: number, mat = white) => {
    const m = MeshBuilder.CreateBox("westChapel", {width:w,height:h,depth:d}, scene);
    m.position.set(39+x,y,35+z);m.material=mat;return m;
  };
  put(7,8,11,0,4,0);
  for(const s of [-1,1]) { const roof=put(4.8,0.35,12,s*1.9,9.2,0,slate);roof.rotation.z=-s*0.62; }
  put(2.5,3.8,0.15,0,1.9,-5.58,wood);
  for(let i=0;i<17;i++) put(7.04,0.065,11.04,0,0.4+i*0.44,0);
  for(const s of [-1,1]) for(let i=0;i<3;i++) put(0.12,2.8,0.95,s*3.56,4, -3+i*3,slate);
  const rose=MeshBuilder.CreateCylinder("westChapelRose",{diameter:1.9,height:0.15,tessellation:12},scene);
  rose.rotation.x=Math.PI/2;rose.position.set(39,6.3,29.4);rose.material=slate;
  put(2.5,4.6,2.5,0,12,-3.5);
  for(const s of [-1,1]) put(0.15,2.5,1.1,s*1.3,12.2,-3.5,slate);
  const spire=MeshBuilder.CreateCylinder("westChapelSpire",{height:4.2,diameterBottom:4,diameterTop:0,tessellation:4},scene);
  spire.rotation.y=Math.PI/4;spire.position.set(39,16.4,31.5);spire.material=slate;
  for(let i=0;i<4;i++) put(3.6,0.25,0.9,0,0.125+i*0.25,-8+i*0.8);
  obstacles.push({type:"box",center:new Vector3(39,0,35),halfX:3.7,halfZ:5.7});
}

export function buildWildWest(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  openStreet(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))), result);
  // The base's two box houses (two boxes each) and their colliders
  const houses = [[4, -16], [6, 16]];
  for (const mesh of scene.meshes) {
    if (prior.has(mesh) || mesh.name !== "Wild West Flats_box") continue;
    if (houses.some(([x, z]) => Math.hypot(mesh.position.x - x, mesh.position.z - z) < 0.5)) mesh.setEnabled(false);
  }
  const obstacles = result.obstacles.filter(({ center }) => !houses.some(([x, z]) => Math.hypot(center.x - x, center.z - z) < 0.5));
  // Anything else of the base standing where the buildings go (ring trees, cacti) goes with its collider
  const gone: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (prior.has(mesh) || mesh.parent || !mesh.isEnabled() || !/^(trunk|Wild West Flats_)/.test(mesh.name)) continue;
    const p = mesh.position;
    if (ROWS.some((r) => p.x > r.from - 1 && p.x < r.to + 1 && Math.abs(p.z - r.z) < DEPTH / 2 + 3.5)) {
      gone.push(p.clone());
      mesh.setEnabled(false);
    }
  }
  const kept = obstacles.filter(({ center }) => !gone.some((p) => Math.hypot(center.x - p.x, center.z - p.z) < 0.6));
  town(scene, kept);
  chapel(scene, kept);
  mesaRidge(scene);
  sandstoneBase(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));
  desertRim(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))), kept);
  const restoreSky = sunsetSky(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));
  return { ...result, obstacles: kept, dispose: () => { restoreSky(); result.dispose?.(); } };
}
