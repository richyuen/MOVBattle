// TABS "Spooky 2" (spooky map): the Dynasty island turned 180 degrees at night, its canals filled with fog, the pagoda gone, thorn
// masses on the side paths and a grated pit (reference/maps/wiki/spooky_2.png, reference/maps/spooky_2.png; card
// loop/cards/maps/spooky_2.md). Built on campaign.spooky, which Spooky 1 shares: dress its build here only. Self-contained (no import
// from tabs/dynasty.ts) so either map can change or revert alone.
//
// Dynasty layout (578, card Overview and the wiki shot: the square Dynasty island with straight sides and tight corners, its notched
// corner now at the back right after the half turn; two long channels cross the whole field from left to right, filled with pale
// fog instead of water, between stone-kerbed lawn terraces; a flagstone path loops round the outer lawn ring). Spec: the base floor
// and underside ("ground", "centerGrass", islandUnder/Shelf/Cliff) are remapped from the base's rounded rectangle (superellipse
// 54 x 48, power 3) to a squarer one (power 8), vertices inside the notch (x > 36 and z > 30) pushed to its nearer edge, re-uploaded
// as fresh buffers; ring trees and props in the notch go with their colliders; the translucent zone slabs are hidden and team 1's
// zones clipped to z <= 30. The base's void band (z -34..-18) and its overlay go. Two fog channels as on Dynasty (|x| <= 46, z
// +-12, 10 m deep, walkable as there): a navy channel bed, three stacked pale-blue fog sheets (alpha 0.3, y 0.25/0.8/1.4) and
// blue-grey stone kerbs 0.5 m high along both banks with gaps at x 0 and x +-44 where the paths cross. The outer loop path is
// 3.5 m of blue-grey flagstone at x +-44 / z +-38, stepping in round the notch (x 32, z 26).
import { Color3, DynamicTexture, Mesh, MeshBuilder, Quaternion, StandardMaterial, Texture, Vector3, type Scene, type HemisphericLight, type DirectionalLight } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const NOTCH = { x: 36, z: 30 };

function squareIsland(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const gone: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (/^campaign_zone_(overlay|border)_/.test(mesh.name) || mesh.name === "campaign_hazard_box_void") mesh.setEnabled(false);
    if (!mesh.parent && /^(trunk|Spooky Graveyard_)/.test(mesh.name) && mesh.position.x > NOTCH.x - 1 && mesh.position.z > NOTCH.z - 1) {
      gone.push(mesh.position.clone());
      mesh.setEnabled(false);
    }
    if (!(mesh instanceof Mesh) || !/^(ground$|centerGrass$|islandUnder|islandShelf|islandCliff)/.test(mesh.name)) continue;
    const positions = mesh.getVerticesData("position");
    if (!positions) continue;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i], z = positions[i + 2];
      const radial = Math.hypot(x, z);
      if (radial < 0.001) continue;
      const fraction = Math.cbrt(Math.abs(x / 54) ** 3 + Math.abs(z / 48) ** 3);
      const cx = x / radial, cz = z / radial;
      const reach = 1 / (Math.abs(cx / 54) ** 8 + Math.abs(cz / 48) ** 8) ** 0.125;
      let nx = cx * fraction * reach, nz = cz * fraction * reach;
      if (nx > NOTCH.x && nz > NOTCH.z) {
        if (nx - NOTCH.x < nz - NOTCH.z) nx = NOTCH.x;
        else nz = NOTCH.z;
      }
      positions[i] = nx;
      positions[i + 2] = nz;
    }
    mesh.setVerticesData("position", positions, false);
    mesh.refreshBoundingInfo();
  }
  result.obstacles = result.obstacles.filter(({ center }) => !gone.some((p) => Math.hypot(center.x - p.x, center.z - p.z) < 0.6));
  result.hazards = result.hazards.filter((h) => !(h.kind === "void" && h.shape === "box" && Math.abs(h.center.z + 26) < 0.5));
  result.placementZones = (result.placementZones ?? result.zones).map((zone) => {
    const low = zone.center.z - zone.size.z / 2, high = zone.center.z + zone.size.z / 2;
    if (zone.center.x < 0 || high <= NOTCH.z) return zone;
    return { ...zone, center: new Vector3(zone.center.x, zone.center.y, (low + NOTCH.z) / 2), size: new Vector3(zone.size.x, zone.size.y, NOTCH.z - low) };
  });
}

function fogChannels(scene: Scene): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    bed: mk("spooky2ChannelBed", new Color3(0.05, 0.07, 0.16), 0.4),
    stone: mk("spooky2Stone", new Color3(0.36, 0.4, 0.52), 0.4),
    path: mk("spooky2Path", new Color3(0.42, 0.46, 0.58), 0.4),
  };
  const fog = new StandardMaterial("spooky2Fog", scene);
  fog.diffuseColor = new Color3(0.55, 0.62, 0.9);
  fog.emissiveColor = new Color3(0.42, 0.48, 0.78);
  fog.disableLighting = true;
  fog.alpha = 0.3;
  fog.backFaceCulling = false;
  const parts: Record<keyof typeof mats | "fog", Mesh[]> = { bed: [], stone: [], path: [], fog: [] };
  const box = (k: keyof typeof parts, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("spooky2Part", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    parts[k].push(b);
  };
  for (const sz of [-1, 1]) {
    box("bed", 92, 0.06, 10, 0, 0.03, sz * 12);
    for (const y of [0.25, 0.8, 1.4]) box("fog", 92, 0.02, 9.6, 0, y, sz * 12);
    // Banks: kerbs from the field edge to each crossing, gaps at x 0 and x +-44
    for (const bank of [sz * 7, sz * 17]) {
      for (const [from, to] of [[-41.5, -2.5], [2.5, 41.5]]) box("stone", to - from, 0.5, 0.5, (from + to) / 2, 0.25, bank);
    }
  }
  cobbleLoop(scene);
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(parts) as Array<keyof typeof parts>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `spooky2Layout_${key}`;
    merged.material = key === "fog" ? fog : mats[key];
    merged.isPickable = false;
    if (key === "fog") {
      merged.applyFog = false;
      glow?.addExcludedMesh(merged);
    } else merged.receiveShadows = true;
  }
}

// Cobble loop (592, blocker b1 outer loop path; wiki spooky_2.png: a broad path of pale grey-blue cobbles with dark joints
// winds right round the field inside the rim, its corners rounded, past the torii, the shrine and over the channel bridges;
// the 578 path was 3.5 m flat boxes darkened to the turf's tone and never showed). Spec: the same loop (x +-44, z +-38,
// stepping in round the back-right notch at x 32 / z 26), its corners rounded by three Chaikin passes, laid as one flat ribbon
// 5.5 m wide 6 cm proud (units walk over it); a 512 px tile per 4 m of jittered rounded cobbles ~0.45 m, stone (96,106,140)
// varied +-10 on joints (28,32,50), uvs in metres along and across; lit stone with a cool self-light so it reads at night.
function cobbleLoop(scene: Scene): void {
  let pts: Array<[number, number]> = [[-44, -38], [44, -38], [44, 26], [32, 26], [32, 38], [-44, 38]];
  for (let pass = 0; pass < 3; pass++) {
    const next: Array<[number, number]> = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[(i + 1) % pts.length];
      next.push([ax * 0.75 + bx * 0.25, az * 0.75 + bz * 0.25], [ax * 0.25 + bx * 0.75, az * 0.25 + bz * 0.75]);
    }
    pts = next;
  }
  pts.push(pts[0]);
  const half = 2.75, y = 0.06, left: Vector3[] = [], right: Vector3[] = [], along: number[] = [];
  let run = 0;
  for (let i = 0; i < pts.length; i++) {
    const [px, pz] = pts[i];
    const [ax, az] = pts[Math.max(0, i - 1)], [bx, bz] = pts[Math.min(pts.length - 1, i + 1)];
    const dx = bx - ax, dz = bz - az, l = Math.hypot(dx, dz) || 1;
    const nx = -dz / l, nz = dx / l;
    if (i > 0) run += Math.hypot(px - pts[i - 1][0], pz - pts[i - 1][1]);
    along.push(run);
    left.push(new Vector3(px + nx * half, y, pz + nz * half));
    right.push(new Vector3(px - nx * half, y, pz - nz * half));
  }
  const ribbon = MeshBuilder.CreateRibbon("spooky2CobbleLoop", { pathArray: [left, right] }, scene);
  const uv: number[] = [];
  for (const v of [0, 1]) for (let i = 0; i < pts.length; i++) uv.push(along[i] / 4, (v * 2 * half) / 4);
  ribbon.setVerticesData("uv", uv);
  // face up whichever way the loop runs
  const nrm = ribbon.getVerticesData("normal") ?? [];
  if ((nrm[1] ?? 1) < 0) ribbon.flipFaces(true);
  const px = 512, tex = new DynamicTexture("spooky2Cobble_tex", { width: px, height: px }, scene, true, Texture.TRILINEAR_SAMPLINGMODE);
  const ctx = tex.getContext();
  ctx.fillStyle = "rgb(28,32,50)";
  ctx.fillRect(0, 0, px, px);
  let seed = 0x6c0b;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const cell = px / 9;
  for (let j = -1; j <= 9; j++) for (let i = -1; i <= 9; i++) {
    const cx = (i + 0.5 + (rnd() - 0.5) * 0.35) * cell, cy = (j + 0.5 + (rnd() - 0.5) * 0.35) * cell;
    const r = cell * (0.4 + rnd() * 0.06), v = Math.round((rnd() - 0.5) * 20);
    ctx.fillStyle = `rgb(${96 + v},${106 + v},${140 + v})`;
    for (const [ox, oy] of [[0, 0], [px, 0], [-px, 0], [0, px], [0, -px]]) {
      ctx.beginPath();
      ctx.arc(cx + ox, cy + oy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  tex.update(true);
  tex.wrapU = Texture.WRAP_ADDRESSMODE;
  tex.wrapV = Texture.WRAP_ADDRESSMODE;
  tex.anisotropicFilteringLevel = 16;
  const mat = new StandardMaterial("spooky2Cobble", scene);
  mat.diffuseTexture = tex;
  mat.diffuseColor = Color3.White();
  mat.emissiveColor = new Color3(0.12, 0.13, 0.19);
  mat.specularColor = Color3.Black();
  ribbon.material = mat;
  ribbon.receiveShadows = true;
  ribbon.isPickable = false;
}

// Night turf replaces the daylight floor and warm team tint; dense low faceted tufts break the bare plane.
function nightTurf(scene: Scene, built: Set<unknown>): void {
  const grass=new StandardMaterial("spooky2NightGrass",scene);
  grass.diffuseColor.set(0.09,0.12,0.21);grass.emissiveColor.set(0.025,0.035,0.075);grass.specularColor=Color3.Black();
  const blades=new StandardMaterial("spooky2NightBlades",scene);
  blades.diffuseColor.set(0.14,0.19,0.29);blades.emissiveColor.set(0.04,0.055,0.1);blades.specularColor=Color3.Black();
  for(const m of scene.meshes) {
    if(!built.has(m)) continue;
    if(/^(campaign_zone_|fieldBlades_|fieldTufts_|grassTuft)/.test(m.name)) m.setEnabled(false);
    if(m.name==="ground"||m.name==="centerGrass") m.material=grass;
  }
  const tufts:Mesh[]=[];
  for(let z=-35;z<36;z+=1.7) for(let x=-41;x<42;x+=1.7) {
    if(Math.abs(Math.abs(z)-12)<6 || (Math.abs(x)<9 && Math.abs(z)<9)) continue;
    const n=Math.sin(x*12.9+z*78.2)*43758.5, f=n-Math.floor(n);
    const m=MeshBuilder.CreateCylinder("spooky2TurfTuft",{height:0.35+f*0.25,diameterBottom:0.55,diameterTop:0,tessellation:3},scene);
    m.position.set(x+f*0.7,0.12,z+f*0.7);tufts.push(m);
  }
  const merged=Mesh.MergeMeshes(tufts,true);
  if(merged) {merged.name="spooky2NightTurf";merged.material=blades;merged.isPickable=false;merged.receiveShadows=true;}
  for(const name of ["spooky2Stone","spooky2Path"]) {
    const m=scene.getMaterialByName(name);
    if(m instanceof StandardMaterial) {m.diffuseColor.set(0.17,0.21,0.31);m.emissiveColor.set(0.045,0.055,0.09);}
  }
}

// Grated court (584, wiki spooky_2.png and wild_west.spooky_army.png: the Dynasty pit at the island's centre is sealed by a
// square iron grate, an orange glow showing through every opening, set in a paved stone court with lanterns at its corners).
// Spec: a 15 m paved court, flush (0.1 m, units walk over it), with path tongues to the four kerb gaps; a 7 m ember plate at
// 0.14 m, unlit orange (1.6, 0.5, 0.06) and inside the glow pass; over it a flat lattice of nine 0.22 m bars each way on a
// 0.85 m pitch, only 4 cm proud so the low battle camera still sees the embers between them (579's 0.2 m bars hid the bed
// from every camera), a 0.55 m iron frame, and four low corner kerb stones carrying a flame (no colliders).
function gratedCourt(scene: Scene): void {
  const mk = (name: string, c: Color3, self: Color3, unlit = false) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = unlit ? Color3.Black() : c;
    m.emissiveColor = self;
    m.specularColor = Color3.Black();
    m.disableLighting = unlit;
    return m;
  };
  const mats = {
    stone: mk("spooky2CourtStone", new Color3(0.2, 0.24, 0.35), new Color3(0.055, 0.065, 0.11)),
    iron: mk("spooky2GrateIron", new Color3(0.035, 0.04, 0.06), new Color3(0.012, 0.014, 0.025)),
    ember: mk("spooky2GrateEmber", Color3.Black(), new Color3(1.6, 0.5, 0.06), true),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { stone: [], iron: [], ember: [] };
  const box = (k: keyof typeof mats, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("spooky2CourtPart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    parts[k].push(b);
  };
  box("stone", 15, 0.1, 15, 0, 0.05, 0);
  for (const s of [-1, 1]) {
    box("stone", 4.6, 0.08, 4, 0, 0.04, s * 9.2);
    box("stone", 6, 0.08, 4.6, s * 10.4, 0.04, 0);
    for (const t of [-1, 1]) {
      // Low kerb lanterns, drawn only: a stage army (fantasy_good.vicious_terror) stands on these corners
      box("stone", 1.1, 0.4, 1.1, s * 6.6, 0.2, t * 6.6);
      box("ember", 0.5, 0.45, 0.5, s * 6.6, 0.62, t * 6.6);
    }
    box("iron", 8.1, 0.2, 0.55, 0, 0.1, s * 3.78);
    box("iron", 0.55, 0.2, 8.1, s * 3.78, 0.1, 0);
  }
  box("ember", 7, 0.04, 7, 0, 0.14, 0);
  for (let i = -4; i <= 4; i++) {
    box("iron", 0.22, 0.04, 7, i * 0.85, 0.18, 0);
    box("iron", 7, 0.04, 0.22, 0, 0.18, i * 0.85);
  }
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `spooky2Court_${key}`;
    merged.material = mats[key];
    merged.isPickable = false;
    if (key === "ember") merged.applyFog = false;
    else merged.receiveShadows = true;
  }
}

// Pumpkin shrine (584, wiki spooky_2.png: where Dynasty's pagoda stood there is a rocky mound crowned by one huge
// jack-o-lantern, its carved face lit from inside, small lit pumpkins heaped round it and black dead trees leaning over
// it). Spec: on the far rim right of centre, (14, 38) (585; 584 had it at the pagoda's corner after the half turn, the
// near edge): a mound of nine dark boulders 16 m across and 3.8 m high; on it a ribbed orange pumpkin 4.6 m across with a stem, triangle eyes and a toothed mouth in unlit flame colour
// facing the field (+z) and a second face toward the near rim; nine pumpkins 0.9-1.5 m with lit faces round its foot;
// three black trees 7-9.5 m in three bent sections with four limbs each, trunks 1.7 m at the root. Base props and ring trees within 8 m go with their
// colliders; one cylinder collider, radius 6.5 (outside both zones).
function pumpkinShrine(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  // 585 re-site: the wiki shot has the shrine on the far edge just right of centre, between the far channel's bridges,
  // so it stands at (14, 38) on the far rim, clear of the far hedge's line, facing back over the field (-z)
  const AT = { x: 14, z: 38 };
  const gone: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || mesh.parent || !mesh.isEnabled() || !/^(trunk|Spooky Graveyard_)/.test(mesh.name)) continue;
    if (Math.hypot(mesh.position.x - AT.x, mesh.position.z - AT.z) > 8) continue;
    gone.push(mesh.position.clone());
    mesh.setEnabled(false);
  }
  result.obstacles = result.obstacles.filter(({ center }) => !gone.some((p) => Math.hypot(center.x - p.x, center.z - p.z) < 0.6));
  result.obstacles.push({ type: "cylinder", center: new Vector3(AT.x, 0, AT.z), radius: 6.5 });
  const mk = (name: string, c: Color3, self: Color3, unlit = false) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = unlit ? Color3.Black() : c;
    m.emissiveColor = self;
    m.specularColor = Color3.Black();
    m.disableLighting = unlit;
    return m;
  };
  const mats = {
    rock: mk("spooky2ShrineRock", new Color3(0.2, 0.23, 0.36), new Color3(0.05, 0.06, 0.1)),
    pumpkin: mk("spooky2ShrinePumpkin", new Color3(0.9, 0.32, 0.05), new Color3(0.45, 0.09, 0.008)),
    flame: mk("spooky2ShrineFlame", Color3.Black(), new Color3(2, 0.84, 0.2), true),
    bark: mk("spooky2ShrineBark", new Color3(0.035, 0.035, 0.055), new Color3(0.01, 0.01, 0.018)),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { rock: [], pumpkin: [], flame: [], bark: [] };
  const rnd = (i: number, s: number) => {
    const raw = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
    return raw - Math.floor(raw);
  };
  for (let i = 0; i < 9; i++) {
    const a = i * 0.7 + 0.3, r = i ? 2.2 + rnd(i, 1) * 2.6 : 0;
    const rock = MeshBuilder.CreateIcoSphere("spooky2ShrinePart", { radius: 0.5, subdivisions: 1 }, scene);
    rock.scaling.set(i ? 5.5 + rnd(i, 2) * 2.5 : 11, i ? 3.2 + rnd(i, 3) * 2 : 7.5, i ? 5 + rnd(i, 4) * 2.5 : 11);
    rock.rotation.set(rnd(i, 5) * 0.4, rnd(i, 6) * 6.28, rnd(i, 7) * 0.4);
    rock.position.set(AT.x + Math.cos(a) * r, i ? 0.6 : 0.2, AT.z + Math.sin(a) * r);
    parts.rock.push(rock);
  }
  // A jack-o-lantern: a ribbed squashed ball, a stem, and a face of flame-coloured cut-outs toward `yaw`
  const lantern = (x: number, y: number, z: number, size: number, yaws: number[]) => {
    const body = MeshBuilder.CreateSphere("spooky2ShrinePart", { diameter: size, segments: 5 }, scene);
    body.scaling.y = 0.82;
    body.position.set(x, y, z);
    parts.pumpkin.push(body);
    const stem = MeshBuilder.CreateCylinder("spooky2ShrinePart", { height: size * 0.22, diameterTop: size * 0.07, diameterBottom: size * 0.13, tessellation: 5 }, scene);
    stem.position.set(x, y + size * 0.46, z);
    parts.bark.push(stem);
    for (const yaw of yaws) {
      const fx = Math.sin(yaw), fz = Math.cos(yaw);
      const cut = (w: number, h: number, u: number, v: number, eye: boolean) => {
        const c = eye
          ? MeshBuilder.CreateCylinder("spooky2ShrinePart", { height: size * 0.1, diameter: w * size, tessellation: 3 }, scene)
          : MeshBuilder.CreateBox("spooky2ShrinePart", { width: w * size, height: h * size, depth: size * 0.1 }, scene);
        if (eye) c.rotation.set(Math.PI / 2, yaw, 0);
        else c.rotation.y = yaw;
        const out = size * 0.45 * Math.sqrt(Math.max(0.2, 1 - (u * u + v * v) * 4));
        c.position.set(x + fx * out + fz * u * size, y + v * size * 0.82, z + fz * out - fx * u * size);
        parts.flame.push(c);
      };
      cut(0.22, 0, -0.17, 0.12, true);
      cut(0.22, 0, 0.17, 0.12, true);
      cut(0.5, 0.11, 0, -0.14, false);
      for (const t of [-0.15, 0, 0.15]) cut(0.09, 0.09, t, -0.07, false);
    }
  };
  lantern(AT.x, 5, AT.z, 4.6, [0, Math.PI]);
  for (let i = 0; i < 9; i++) {
    const a = i * 0.698 + 0.2, r = 3.4 + rnd(i, 11) * 2.4, size = 0.9 + rnd(i, 12) * 0.6;
    lantern(AT.x + Math.cos(a) * r, 1.5 + rnd(i, 13) * 0.9 - (r - 3.4) * 0.35, AT.z + Math.sin(a) * r, size, [rnd(i, 14) * 6.28]);
  }
  const up = Vector3.Up();
  [[-5.2, 1.5, 9.5, 0.9], [5.4, -1.2, 8, 2.6], [1, 5, 7, 4.4]].forEach(([dx, dz, tall, lean], t) => {
    let at = new Vector3(AT.x + dx, 0.4, AT.z + dz);
    for (let s = 0; s < 3; s++) {
      const tilt = 0.1 + s * 0.22, bend = lean + s * 1.1;
      const dir = new Vector3(Math.sin(tilt) * Math.cos(bend), Math.cos(tilt), Math.sin(tilt) * Math.sin(bend));
      const seg = MeshBuilder.CreateCylinder("spooky2ShrinePart", { height: tall / 3 + 0.2, diameterBottom: 1.7 - s * 0.45, diameterTop: 1.25 - s * 0.4, tessellation: 6 }, scene);
      seg.rotationQuaternion = Quaternion.FromUnitVectorsToRef(up, dir, new Quaternion());
      seg.position = at.add(dir.scale(tall / 6));
      parts.bark.push(seg);
      at = at.add(dir.scale(tall / 3));
      for (let b = 0; b < (s ? 2 : 0); b++) {
        const la = bend + 1.6 + b * 2.7 + t, len = 2.2 + rnd(t * 7 + s * 2 + b, 21) * 1.8;
        const ld = new Vector3(Math.cos(la) * 0.75, 0.66, Math.sin(la) * 0.75).normalize();
        const limb = MeshBuilder.CreateCylinder("spooky2ShrinePart", { height: len, diameterBottom: 0.34, diameterTop: 0.06, tessellation: 5 }, scene);
        limb.rotationQuaternion = Quaternion.FromUnitVectorsToRef(up, ld, new Quaternion());
        limb.position = at.add(ld.scale(len / 2));
        parts.bark.push(limb);
      }
    }
  });
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true, true);
    if (!merged) continue;
    merged.name = `spooky2Shrine_${key}`;
    if (key !== "flame") merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.isPickable = false;
    if (key === "flame") merged.applyFog = false;
    else merged.receiveShadows = key === "rock";
  }
}

// Channel bridges (585, wiki spooky_2.png: big stone bridges arch over the fog channels where the outer path crosses them,
// and a wide wooden stair-bridge crosses at the middle between the court and each bank). Spec: on both channels (z +-12,
// banks at |z| 7 and 17), at x +-44 a stone bridge 4.4 m wide spanning |z| 5.5..18.5, its deck a 12-segment arch rising
// 1.4 m, a 0.6 m parapet each side, a pier under each end and a dark arch opening under the middle; at x 0 a timber
// bridge 5 m wide, a flat deck 1 m up over |z| 6.5..17.5 on four posts, with four steps down at each end. Drawn only (no
// colliders; the channels are drawn only too); the decks carry units through the map's height field.
// Black dead trees (586, card Overview "black leafless twisted trees only"; wiki spooky_2.png: the ring is a loose line of
// black gnarled trees, no round crowns). Spec: every base ring tree left after the shrine (an unparented "trunk" with its
// "canopy" crown children) is hidden, its collider kept; one in four spots stays empty so the ring breaks up; on the rest a
// black tree 6-9.5 m: a three-section crooked trunk (root 1.6 m) leaning and turning, then three or four heavy limbs leaving
// it low, bending at an elbow and ending in a claw twig; near-black navy bark (0.035, 0.035, 0.055), barely self-lit, merged
// with 32-bit indices, in the glow pass (dark solid).
function blackTrees(scene: Scene, built: Set<unknown>): void {
  const hash = (i: number, s: number) => { const v = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return v - Math.floor(v); };
  const bark = new StandardMaterial("spooky2DeadBark", scene);
  bark.diffuseColor = new Color3(0.035, 0.035, 0.055);
  bark.emissiveColor = new Color3(0.012, 0.012, 0.02);
  bark.specularColor = Color3.Black();
  const parts: Mesh[] = [];
  const up = Vector3.Up();
  const limb = (from: Vector3, len: number, d: number, yaw: number, tilt: number): Vector3 => {
    const dir = new Vector3(Math.sin(tilt) * Math.cos(yaw), Math.cos(tilt), Math.sin(tilt) * Math.sin(yaw));
    const c = MeshBuilder.CreateCylinder("spooky2DeadLimb", { height: len, diameterBottom: d, diameterTop: d * 0.55, tessellation: 5 }, scene);
    c.rotationQuaternion = Quaternion.Identity();
    Quaternion.FromUnitVectorsToRef(up, dir, c.rotationQuaternion);
    c.position = from.add(dir.scale(len / 2));
    parts.push(c);
    return from.add(dir.scale(len * 0.95));
  };
  let k = 0;
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || mesh.name !== "trunk" || mesh.parent || !mesh.isEnabled()) continue;
    const { x, z } = mesh.position;
    mesh.setEnabled(false);
    k++;
    if (k % 4 === 2) continue;
    // the torii stands in a clearing of the ring (587.5b)
    if (Math.hypot(x - TORII.x, z - TORII.z) < 6) continue;
    const tall = 6 + hash(k, 71) * 3.5, twist = hash(k, 72) * 6.28;
    const knee = limb(new Vector3(x, 0, z), tall * 0.3, 1.6, twist, 0.26);
    const shoulder = limb(knee, tall * 0.26, 1.15, twist + 1.3, 0.42);
    const top = limb(shoulder, tall * 0.2, 0.8, twist - 0.7, 0.3);
    const limbs = 3 + Math.floor(hash(k, 74) * 2);
    for (let j = 0; j < limbs; j++) {
      const yaw = twist + j * 2.4 + hash(k + j, 75) * 0.7;
      const start = j === 0 ? knee : j === 1 ? shoulder : top;
      const elbow = limb(start, 1.6 + hash(k + j, 76) * 1.6, 0.65, yaw, 0.95 + hash(k + j, 77) * 0.6);
      const end = limb(elbow, 1.2 + hash(k + j, 78) * 1.3, 0.4, yaw + 0.65, 0.45 + hash(k + j, 79) * 0.8);
      limb(end, 0.7 + hash(k + j, 80), 0.2, yaw - 0.7, 0.7);
    }
  }
  const merged = Mesh.MergeMeshes(parts, true, true);
  if (!merged) return;
  merged.name = "spooky2DeadTrees";
  merged.convertToFlatShadedMesh();
  merged.material = bark;
  merged.receiveShadows = true;
  merged.isPickable = false;
}

// Thorn thickets (587, card Overview "giant thorns blocking the pathways on the left and right sides"; reference/maps/wiki/
// spooky_2.png: black tangles of thick thorny vines heaped across the side paths, taller than a man, their limbs arching and
// curling out with hooked spikes). Spec: one thicket on each side path, across the loop path at x -44 and x 44 between the fog
// channels (z -7..7); each is 30 seeded vines rising from a 7 x 14 m footprint, every vine six tapering segments (0.95 m at
// the root to 0.15 m), 7-10 m of vine leaning out only 3-14 degrees at the root and bending 12-22 degrees per joint around a
// turning axis, so they stand 5-7 m high before they curl over (587.4b: 25-45 degree bends kept the first heap under 3 m,
// lost in the tree ring);
// a hooked cone spike 0.5-0.8 m off every other joint. Dark navy (0.1, 0.11, 0.19) self 0.3, merged (32-bit), in the
// glow pass (dark solid). A box collider 3 x 6 m half size blocks each path.
function thornThickets(scene: Scene, result: MapBuildResult): void {
  const hash = (i: number, s: number) => { const v = Math.sin(i * 91.7 + s * 47.31) * 24634.6345; return v - Math.floor(v); };
  // (587.4c) dark navy-blue, a shade above the black ring trees (near-black vines vanished into them): the wiki's thorns read
  // as blue-shadowed tangles under the moonlight
  const mat = new StandardMaterial("spooky2Thorn", scene);
  mat.diffuseColor = new Color3(0.1, 0.11, 0.19);
  mat.emissiveColor = new Color3(0.1, 0.11, 0.19).scale(0.3);
  mat.specularColor = Color3.Black();
  const parts: Mesh[] = [];
  const up = Vector3.Up();
  const piece = (from: Vector3, dir: Vector3, len: number, d0: number, d1: number, name: string) => {
    const c = MeshBuilder.CreateCylinder(name, { height: len, diameterBottom: d0, diameterTop: d1, tessellation: 5 }, scene);
    c.rotationQuaternion = Quaternion.Identity();
    Quaternion.FromUnitVectorsToRef(up, dir, c.rotationQuaternion);
    c.position = from.add(dir.scale(len / 2));
    parts.push(c);
  };
  let k = 0;
  for (const side of [-1, 1]) {
    const cx = side * 44;
    for (let v = 0; v < 30; v++, k++) {
      let p = new Vector3(cx + (hash(k, 1) - 0.5) * 7, 0, (hash(k, 2) - 0.5) * 14);
      let yaw = hash(k, 3) * 6.28;
      let tilt = 0.05 + hash(k, 4) * 0.2;
      const turn = (hash(k, 5) < 0.5 ? -1 : 1) * (0.5 + hash(k, 6) * 0.6);
      const total = 7 + hash(k, 7) * 3;
      for (let s = 0; s < 6; s++) {
        const len = total / 6 * (1.3 - s * 0.1);
        const dir = new Vector3(Math.sin(tilt) * Math.cos(yaw), Math.cos(tilt), Math.sin(tilt) * Math.sin(yaw));
        const d0 = 0.95 - s * 0.14, d1 = Math.max(0.12, 0.95 - (s + 1) * 0.14);
        piece(p, dir, len, d0, d1, "spooky2ThornVine");
        p = p.add(dir.scale(len * 0.95));
        if (s % 2 === 1) {
          const sy = yaw + 1.6 + hash(k + s, 8) * 3;
          const sd = new Vector3(Math.cos(sy) * 0.8, 0.6, Math.sin(sy) * 0.8).normalize();
          piece(p, sd, 0.5 + hash(k + s, 9) * 0.3, d1 * 0.9, 0.02, "spooky2ThornSpike");
        }
        tilt += 0.2 + hash(k + s, 10) * 0.18;
        yaw += turn * 0.5;
      }
    }
    result.obstacles.push({ type: "box", center: new Vector3(cx, 0, 0), halfX: 3.5, halfZ: 7 });
  }
  const merged = Mesh.MergeMeshes(parts, true, true);
  if (!merged) return;
  merged.name = "spooky2ThornThickets";
  merged.convertToFlatShadedMesh();
  merged.material = mat;
  merged.receiveShadows = true;
  merged.isPickable = false;
}

// Dark torii (587, reference/maps/wiki/spooky_2.png: a black torii stands at the back-left corner of the island, its curved
// top beam overhanging the posts; Dynasty's rim torii rotated 180 degrees with the map). Spec: at (-40, 33), spanning x; two
// round posts 0.75 m thick and 7.2 m high, 5.6 m apart, on 1.1 m square plinths; the nuki tie beam 7.4 m long at 5.4 m; the
// kasagi top 9.6 m long, two stacked beams whose ends sweep up 0.5 m, with a short gakuzuka strut between the beams. Dark
// blue-grey stone (587.5c), in the glow pass. A small collider round each post. (587.5b) It stands in a clearing:
// no ring tree within 6 m, and the base's low "hill" mound under it (a red self-lit grass lump at (-40, 30)) is hidden.
const TORII = { x: -40, z: 33 };
function darkTorii(scene: Scene, result: MapBuildResult): void {
  // (587.5c) the mound's vertices are baked (its position is the origin): find it by its bounds; and the torii is the lit dark
  // blue-grey stone of the approved bridges (0.2, 0.21, 0.28) self 0.35, since near-black vanished into the black tree ring
  for (const mesh of scene.meshes) {
    if (mesh.name !== "hill") continue;
    const c = mesh.getBoundingInfo().boundingBox.centerWorld;
    if (Math.hypot(c.x - TORII.x, c.z - TORII.z) < 6) mesh.setEnabled(false);
  }
  const mat = new StandardMaterial("spooky2Torii", scene);
  mat.diffuseColor = new Color3(0.2, 0.21, 0.28);
  mat.emissiveColor = new Color3(0.2, 0.21, 0.28).scale(0.35);
  mat.specularColor = Color3.Black();
  const [tx, tz] = [TORII.x, TORII.z];
  const parts: Mesh[] = [];
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, rz = 0) => {
    const b = MeshBuilder.CreateBox("spooky2ToriiPart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z); b.rotation.z = rz;
    parts.push(b);
  };
  for (const s of [-1, 1]) {
    const post = MeshBuilder.CreateCylinder("spooky2ToriiPart", { height: 7.2, diameterBottom: 0.8, diameterTop: 0.68, tessellation: 10 }, scene);
    post.position.set(tx + s * 2.8, 3.6, tz);
    parts.push(post);
    box(1.1, 0.6, 1.1, tx + s * 2.8, 0.3, tz);
    // kasagi ends sweep up
    box(1.6, 0.42, 0.75, tx + s * 4.1, 7.55, tz, s * 0.3);
    box(1.6, 0.34, 0.65, tx + s * 4.05, 7.1, tz, s * 0.26);
    result.obstacles.push({ type: "cylinder", center: new Vector3(tx + s * 2.8, 0, tz), radius: 0.6 });
  }
  box(7.4, 0.45, 0.4, tx, 5.4, tz);
  box(6.8, 0.36, 0.62, tx, 6.95, tz);
  box(6.9, 0.42, 0.72, tx, 7.4, tz);
  box(0.4, 1.1, 0.35, tx, 6.2, tz);
  const merged = Mesh.MergeMeshes(parts, true, true);
  if (!merged) return;
  merged.name = "spooky2DarkTorii";
  merged.convertToFlatShadedMesh();
  merged.material = mat;
  merged.receiveShadows = true;
  merged.isPickable = false;
}

const STONE_X = 30;
function channelBridges(scene: Scene): (x: number, z: number) => number {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    // (586) darker than the fog (0.1, 0.125, 0.26 at alpha .34): a deep slate stone
    stone: mk("spooky2BridgeStone", new Color3(0.2, 0.21, 0.28), 0.35),
    dark: mk("spooky2BridgeDark", new Color3(0.03, 0.04, 0.09), 0.3),
    wood: mk("spooky2BridgeWood", new Color3(0.34, 0.3, 0.32), 0.35),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { stone: [], dark: [], wood: [] };
  const box = (k: keyof typeof mats, w: number, h: number, d: number, x: number, y: number, z: number, tilt = 0) => {
    const b = MeshBuilder.CreateBox("spooky2BridgePart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    b.rotation.x = tilt;
    parts[k].push(b);
  };
  // (586, wiki spooky_2.png: the stone bridges stand inboard of the corners, high humped arches with a dark opening under
  // them) Spec: at x +-30, spanning |z| 5..19 (half 7), the deck rising 3 m, piers 3.4 m deep below the banks, the dark
  // opening 3.2 m wide and 2.4 m high under the crown.
  const HALF = 7, RISE = 3, SEGS = 14;
  const arch = (dz: number) => RISE * Math.max(0, 1 - (dz / HALF) ** 2);
  for (const sz of [-1, 1]) {
    const cz = sz * 12;
    for (const x of [-STONE_X, STONE_X]) {
      for (let s = 0; s < SEGS; s++) {
        const z0 = -HALF + (s * 2 * HALF) / SEGS, z1 = z0 + (2 * HALF) / SEGS;
        const y0 = arch(z0), y1 = arch(z1), len = Math.hypot(z1 - z0, y1 - y0) + 0.05;
        const tilt = -Math.atan2(y1 - y0, z1 - z0);
        box("stone", 4.4, 0.45, len, x, (y0 + y1) / 2 - 0.2, cz + (z0 + z1) / 2, tilt);
        for (const side of [-1, 1]) box("stone", 0.4, 0.6, len, x + side * 2, (y0 + y1) / 2 + 0.3, cz + (z0 + z1) / 2, tilt);
      }
      for (const end of [-1, 1]) box("stone", 4.6, 3.4, 2.2, x, -1.2, cz + end * (HALF - 1.6));
      // spandrel walls fill the hump either side of the opening, the opening itself dark
      for (const end of [-1, 1]) box("stone", 4.2, 1.8, 2.4, x, 1.0, cz + end * 3.6);
      box("dark", 3.2, 2.4, 4.8, x, 0.6, cz);
    }
    // Timber bridge at the middle: deck, posts, side beams and steps
    box("wood", 5, 0.25, 11, 0, 0.88, cz);
    for (const side of [-1, 1]) box("wood", 0.3, 0.5, 11, side * 2.4, 1.2, cz);
    for (const [px, pz] of [[-2, -3.5], [2, -3.5], [-2, 3.5], [2, 3.5]]) box("dark", 0.4, 1.2, 0.4, px, 0.2, cz + pz);
    for (const end of [-1, 1]) for (let k = 0; k < 4; k++) {
      const h = 0.25 * (4 - k);
      box("wood", 5, h, 0.5, 0, h / 2, cz + end * (5.5 + 0.5 * (k + 1)));
    }
  }
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `spooky2Bridges_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  }
  return (x, z) => {
    const dz = Math.abs(z) - 12;
    if (Math.abs(dz) > 8) return 0;
    if (Math.abs(Math.abs(x) - STONE_X) < 2.2) return arch(dz);
    if (Math.abs(x) < 2.5) {
      const off = Math.abs(dz);
      return off <= 5.5 ? 1 : Math.max(0, 1 - Math.ceil((off - 5.5) / 0.5) * 0.25 + 0.25);
    }
    return 0;
  };
}

// Rock skirt (590, blocker a6; reference/maps/spooky_2.png: under the square island's edge hang heaped blue-grey boulders,
// large and of unequal size, swelling into big masses under the front corners; no smooth slab, no stalactites). Spec: the base
// underside (islandUnder/Shelf/Cliff) is hidden; round the squared outline (power 8, 54 x 48, notch at x > 36, z > 30) stand
// three courses of faceted icosphere boulders (subdivisions 1): course k with its tops at -0.3 - 6k m, inset 1 + 5k m, radii
// 3-6.5 m shrinking down, spaced ~4-8 m with seeded jitter; under the front corners (z < 0, |x| > 30) larger, with a fourth
// course 18 m down. Tops stay under the floor's edge (y 0). Lit blue-grey (.3,.34,.48) with self-light .55 of it, no shadows received, one 32-bit merge.
function rockSkirt(scene: Scene, built: Set<unknown>): void {
  for (const m of scene.meshes) if (built.has(m) && /^(islandUnder|islandShelf|islandCliff)/.test(m.name)) m.setEnabled(false);
  let seed = 0x5b2;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const edge = (a: number) => {
    const cx = Math.cos(a), cz = Math.sin(a);
    const reach = 1 / (Math.abs(cx / 54) ** 8 + Math.abs(cz / 48) ** 8) ** 0.125;
    let x = cx * reach, z = cz * reach;
    if (x > NOTCH.x && z > NOTCH.z) { if (x - NOTCH.x < z - NOTCH.z) x = NOTCH.x; else z = NOTCH.z; }
    return { x, z };
  };
  const rocks: Mesh[] = [];
  const rock = (x: number, top: number, z: number, r: number) => {
    const m = MeshBuilder.CreateIcoSphere("spooky2Rock", { radius: r, subdivisions: 1, flat: true }, scene);
    const sy = 0.75 + rnd() * 0.35;
    m.scaling.set(1 + rnd() * 0.35, sy, 1 + rnd() * 0.35);
    m.rotation.set(0, rnd() * Math.PI, 0);
    m.position.set(x, top - r * sy * 1.05, z);
    m.bakeCurrentTransformIntoVertices();
    rocks.push(m);
  };
  const steps = 96;
  for (let k = 0; k < 4; k++) {
    for (let i = 0; i < steps; i++) {
      const p = edge((i + rnd() * 0.5) / steps * Math.PI * 2);
      const corner = p.z < 0 && Math.abs(p.x) > 30;
      if (k === 3 && !corner) continue;
      if (k > 0 && i % 2 === 1 && !corner) continue;
      const len = Math.hypot(p.x, p.z), inset = 1 + 5 * k + (corner ? -1.5 : 0);
      const r = (6.5 - k * 1.1) * (0.6 + rnd() * 0.4) * (corner ? 1.25 : 1);
      const s = (len - inset) / len;
      rock(p.x * s, -0.3 - 6 * k, p.z * s, r);
    }
  }
  const merged = Mesh.MergeMeshes(rocks, true, true);
  if (!merged) return;
  merged.name = "spooky2RockSkirt";
  const mat = new StandardMaterial("spooky2Rock", scene);
  mat.diffuseColor = new Color3(0.3, 0.34, 0.48);
  mat.emissiveColor = new Color3(0.07, 0.08, 0.11);
  mat.specularColor = Color3.Black();
  merged.material = mat;
  merged.receiveShadows = false;
  // 590b: in the glow pass its self-light bloomed the skirt near white; out of it, with a dimmer self-light, it stays blue-grey
  scene.getGlowLayerByName("glow")?.addExcludedMesh(merged);
  merged.isPickable = false;
}

// Night void and cold moonlight, no daylight range/clouds. Restore shared lights when changing maps.
function nightSky(scene: Scene, built: Set<unknown>): () => void {
  const clear=scene.clearColor.clone(), fog=scene.fogColor.clone();
  scene.clearColor.set(0.025,0.04,0.12,1); scene.fogColor=new Color3(0.025,0.04,0.12);
  for(const m of scene.meshes) if(built.has(m) && /^(mountain|cloud)/.test(m.name)) m.setEnabled(false);
  const hemi=scene.getLightByName("hemi") as HemisphericLight|null;
  const dir=scene.getLightByName("dir") as DirectionalLight|null;
  const h=hemi ? [hemi.intensity,hemi.diffuse.clone(),hemi.groundColor.clone()] as const:null;
  const d=dir ? [dir.intensity,dir.diffuse.clone(),dir.direction.clone()] as const:null;
  if(hemi) { hemi.intensity=0.3;hemi.diffuse=new Color3(0.42,0.52,1.1);hemi.groundColor=new Color3(0.1,0.1,0.25); }
  if(dir) { dir.intensity=0.65;dir.diffuse=new Color3(0.58,0.68,1.1);dir.direction.set(0.55,-0.62,0.5); }
  return ()=>{
    scene.clearColor.copyFrom(clear);scene.fogColor.copyFrom(fog);
    if(hemi&&h) [hemi.intensity,hemi.diffuse,hemi.groundColor]=[h[0],h[1],h[2]];
    if(dir&&d) [dir.intensity,dir.diffuse,dir.direction]=[d[0],d[1],d[2]];
  };
}

export function buildSpooky2(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  squareIsland(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))), result);
  fogChannels(scene);
  nightTurf(scene,new Set<unknown>(scene.meshes.filter((m)=>!prior.has(m))));
  gratedCourt(scene);
  pumpkinShrine(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))), result);
  blackTrees(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));
  thornThickets(scene, result);
  darkTorii(scene, result);
  rockSkirt(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));

  result.height = channelBridges(scene);
  const restore=nightSky(scene,new Set<unknown>(scene.meshes.filter((m)=>!prior.has(m))));
  return {...result,dispose:()=>{restore();result.dispose?.();}};
}
