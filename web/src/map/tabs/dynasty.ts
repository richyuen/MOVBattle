// TABS "Dynasty" (dynasty map): a square garden island cut by turquoise canals round a central courtyard, with a big two-tier
// pagoda at the back corner (reference/maps/wiki/dynasty.png, reference/maps/dynasty.png; card loop/cards/maps/dynasty.md). Built on
// campaign.dynasty (base(); never edit the base, dress its build here).
//
// Pagoda (576, dynasty.png and the wiki shot): at the island's back corner a large pagoda stands on a raised grey stone platform reached
// by a wide wooden stair; its ground storey is a ring of red columns round a pale wall with dark lattice panels, a broad dark slate roof
// with upturned corners flares far past it, a second smaller red storey sits on that roof under a second curled roof, and a gold finial
// tops it; paper lanterns hang from the lower eaves. Spec: centre (17, 37) turned to face the field (-z); platform 17 x 17 x 3 m with a
// darker kerb; stair 7 m wide, 10 steps down to the field; storey 1 11 m square, 5.5 m high, 12 red columns; roof 1 a four-sided frustum
// 19 m at the eaves, 4 m high, corner tips 2 m curling up; storey 2 7.5 m square, 3.8 m high, 8 columns; roof 2 13 m, 3.2 m high; finial
// 3.5 m. The base's small pagoda at (0, 29) goes with its collider; one box collider for the platform (outside both armies' zones,
// which end at |x| 29 / z 32 and leave x 8..26 free behind the courtyard).
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const PAGODA = { x: 17, z: 37 };

function pagoda(scene: Scene): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    stone: mk("dynastyPagodaStone", new Color3(0.62, 0.64, 0.68), 0.45),
    kerb: mk("dynastyPagodaKerb", new Color3(0.42, 0.44, 0.5), 0.45),
    wood: mk("dynastyPagodaStair", new Color3(0.58, 0.4, 0.24), 0.4),
    red: mk("dynastyPagodaRed", new Color3(0.85, 0.12, 0.16), 0.45),
    wall: mk("dynastyPagodaWall", new Color3(0.93, 0.86, 0.72), 0.5),
    lattice: mk("dynastyPagodaLattice", new Color3(0.32, 0.12, 0.12), 0.4),
    slate: mk("dynastyPagodaSlate", new Color3(0.17, 0.19, 0.28), 0.55),
    gold: mk("dynastyPagodaGold", new Color3(1, 0.75, 0.25), 0.55),
    paper: mk("dynastyPagodaLantern", new Color3(1, 0.93, 0.78), 0.8),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { stone: [], kerb: [], wood: [], red: [], wall: [], lattice: [], slate: [], gold: [], paper: [] };
  const { x: X, z: Z } = PAGODA;
  const box = (k: keyof typeof mats, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("dynastyPagodaPart", { width: w, height: h, depth: d }, scene);
    b.position.set(X + x, y, Z + z);
    parts[k].push(b);
    return b;
  };
  const cyl = (k: keyof typeof mats, d: number, h: number, x: number, y: number, z: number) => {
    const c = MeshBuilder.CreateCylinder("dynastyPagodaPost", { diameter: d, height: h, tessellation: 8 }, scene);
    c.position.set(X + x, y, Z + z);
    parts[k].push(c);
    return c;
  };
  // Platform with a kerb, and the wide stair down to the field (-z)
  const P = 3;
  box("stone", 17, P, 17, 0, P / 2, 0);
  box("kerb", 17.6, 0.5, 17.6, 0, P - 0.1, 0);
  for (let s = 0; s < 10; s++) {
    const h = P * (s + 1) / 10;
    box(s % 2 ? "wood" : "kerb", 7, h, 0.6, 0, h / 2, -8.5 - 5.7 + s * 0.6);
  }
  for (const sx of [-1, 1]) box("red", 0.4, 1.4, 6.2, sx * 3.7, P * 0.55, -8.5 - 2.8);
  // A storey: columns round a pale wall with lattice panels, a beam on top
  const storey = (y: number, w: number, h: number, posts: number) => {
    box("wall", w * 0.82, h, w * 0.82, 0, y + h / 2, 0);
    for (const [fx, fz] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      for (let i = 0; i < 2; i++) {
        const along = (i - 0.5) * w * 0.4;
        box("lattice", fz ? w * 0.26 : 0.1, h * 0.55, fz ? 0.1 : w * 0.26, fx * w * 0.415 + (fz ? along : 0), y + h * 0.5, fz * w * 0.415 + (fx ? along : 0));
      }
    }
    for (let i = 0; i < posts; i++) {
      const t = i / posts * 4, side = Math.floor(t), f = t - side;
      const u = -w / 2 + f * w;
      const [px, pz] = [[u, -w / 2], [w / 2, u], [-u, w / 2], [-w / 2, -u]][side];
      cyl("red", 0.55, h, px, y + h / 2, pz);
    }
    box("red", w + 0.3, 0.5, w + 0.3, 0, y + h + 0.25, 0);
  };
  // A curled roof: a four-sided frustum (corners on the diagonals) plus an upturned tip at each corner
  const roof = (y: number, eave: number, h: number, top: number) => {
    const r = MeshBuilder.CreateCylinder("dynastyPagodaRoof", { diameterBottom: eave * Math.SQRT2, diameterTop: top * Math.SQRT2, height: h, tessellation: 4 }, scene);
    r.rotation.y = Math.PI / 4;
    r.position.set(X, y + h / 2, Z);
    parts.slate.push(r);
    box("slate", eave * 0.92, 0.35, eave * 0.92, 0, y + 0.1, 0);
    for (const [cx, cz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const tip = MeshBuilder.CreateCylinder("dynastyPagodaTip", { diameterBottom: 0.9, diameterTop: 0.1, height: 2.2, tessellation: 4 }, scene);
      tip.rotation.set(cz * -0.85, 0, cx * 0.85);
      tip.position.set(X + cx * eave * 0.5, y + 0.6, Z + cz * eave * 0.5);
      parts.slate.push(tip);
      const bead = MeshBuilder.CreateIcoSphere("dynastyPagodaTipBead", { radius: 0.3, subdivisions: 1 }, scene);
      bead.position.set(X + cx * (eave * 0.5 + 0.8), y + 1.5, Z + cz * (eave * 0.5 + 0.8));
      parts.gold.push(bead);
    }
  };
  storey(P, 11, 5.5, 12);
  roof(P + 6, 19, 4, 7);
  // Lanterns under the lower eaves at the front corners
  for (const sx of [-1, 1]) {
    box("red", 0.08, 1.2, 0.08, sx * 8, P + 5.2, -8);
    cyl("paper", 0.9, 1.3, sx * 8, P + 4, -8);
  }
  const up = P + 10;
  storey(up, 7.5, 3.8, 8);
  roof(up + 4.3, 13, 3.2, 4);
  cyl("gold", 0.5, 3.5, 0, up + 7.5 + 1.75, 0);
  for (let i = 0; i < 3; i++) cyl("gold", 1.1 - i * 0.25, 0.25, 0, up + 7.9 + i * 0.9, 0);
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `dynastyPagoda_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
    if (key !== "paper") glow?.addExcludedMesh(merged);
  }
}

// Mint sky (577, dynasty.png and the wiki shot: the island floats in a soft pale mint-green haze, a few faint clouds, no
// mountain range behind it). Spec: clear colour (0.68, 0.86, 0.74) and fog (0.76, 0.9, 0.8); the base's far range and
// second slab (mountainBase/Cap/Root) hidden, its clouds kept; both colours restored on dispose.
function mintSky(scene: Scene, built: Set<unknown>): () => void {
  const oldClear = scene.clearColor.clone();
  const oldFog = scene.fogColor.clone();
  scene.clearColor.set(0.68, 0.86, 0.74, 1);
  scene.fogColor = new Color3(0.76, 0.9, 0.8);
  for (const mesh of scene.meshes) if (built.has(mesh) && mesh.name.startsWith("mountain")) mesh.setEnabled(false);
  return () => {
    scene.clearColor.copyFrom(oldClear);
    scene.fogColor.copyFrom(oldFog);
  };
}

// Square island (577, dynasty.png: a square island with straight sides and tight corners, its near-left corner cut away in
// a square notch where the cliff steps in; the wiki shot shows the same square field framed by the outer path). Spec: the
// base floor and underside ("ground", "centerGrass", islandUnder/Shelf/Cliff) are remapped radially from the base's rounded
// rectangle (superellipse 54 x 48, power 3) to a squarer one (same half sizes, power 8), then every vertex inside the notch
// (x < -36 and z < -30) is pushed to the nearer notch edge; the shapes are re-uploaded as fresh buffers (static base
// buffers). Ring trees and props left standing in the notch go with their colliders; the translucent team-zone slabs
// (reaching past the rim) are hidden; the player's front zone is clipped to z >= -30 so nobody is placed over the notch.
const NOTCH = { x: -36, z: -30 };
function squareIsland(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const gone: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (/^campaign_zone_(overlay|border)_/.test(mesh.name)) mesh.setEnabled(false);
    if (!mesh.parent && /^(trunk|Dynasty Garden_)/.test(mesh.name) && mesh.position.x < NOTCH.x + 1 && mesh.position.z < NOTCH.z + 1) {
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
      if (nx < NOTCH.x && nz < NOTCH.z) {
        if (NOTCH.x - nx < NOTCH.z - nz) nx = NOTCH.x;
        else nz = NOTCH.z;
      }
      positions[i] = nx;
      positions[i + 2] = nz;
    }
    mesh.setVerticesData("position", positions, false);
    mesh.refreshBoundingInfo();
  }
  result.obstacles = result.obstacles.filter(({ center }) => !gone.some((p) => Math.hypot(center.x - p.x, center.z - p.z) < 0.6));
  result.placementZones = (result.placementZones ?? result.zones).map((zone) => {
    const low = zone.center.z - zone.size.z / 2, high = zone.center.z + zone.size.z / 2;
    if (zone.center.x > 0 || low >= NOTCH.z) return zone;
    return { ...zone, center: new Vector3(zone.center.x, zone.center.y, (NOTCH.z + high) / 2), size: new Vector3(zone.size.x, zone.size.y, high - NOTCH.z) };
  });
}

// Central courtyard (578, card Overview and the wiki shot: in the middle of the island a square flagstone courtyard with a
// square bottomless pit at its heart, walled by stone kerbs, ringed by turquoise water and reached by bridges on all four
// sides). Spec: the courtyard fills the dry strip between the base's two canals (|x|, |z| <= 7), paved in warm grey stone
// (0.62, 0.62, 0.58) with a darker kerb; the base's round pit (r 5) becomes a square pit 6 x 6 m (a near-black well with a
// 0.35 m stone lip, the hazard a box of half 3); the courtyard's east and west sides are moat channels 3 m wide (|x| 7..10,
// turquoise (0.2, 0.8, 0.75) water hazards in two pieces each) leaving a 4.4 m gap at z 0 under a grey arched bridge with
// parapets; the base's canals already close the north and south sides and their bridges at x 0 stay.
function courtyard(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  for (const mesh of scene.meshes) if (built.has(mesh) && mesh.name === "campaign_hazard_cyl_pit") mesh.setEnabled(false);
  result.hazards = result.hazards.filter((h) => !(h.kind === "pit" && h.shape === "cylinder" && Math.hypot(h.center.x, h.center.z) < 0.5));
  result.hazards.push({ shape: "box", kind: "pit", center: new Vector3(0, 0, 0), halfX: 3, halfZ: 3 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    result.hazards.push({ shape: "box", kind: "water", center: new Vector3(sx * 8.5, 0, sz * 4.6), halfX: 1.5, halfZ: 2.4 });
  }
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    pave: mk("dynastyCourtPave", new Color3(0.4, 0.41, 0.4), 0.2),
    kerb: mk("dynastyCourtKerb", new Color3(0.44, 0.45, 0.46), 0.4),
    water: mk("dynastyCourtWater", new Color3(0.2, 0.8, 0.75), 0.35),
    well: mk("dynastyCourtWell", new Color3(0.03, 0.03, 0.04), 0),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { pave: [], kerb: [], water: [], well: [] };
  const box = (k: keyof typeof mats, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("dynastyCourtPart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    parts[k].push(b);
  };
  // Paving round the pit: four slabs, a flagstone seam grid drawn as thin kerb strips
  box("pave", 14, 0.12, 4, 0, 0.06, -5);
  box("pave", 14, 0.12, 4, 0, 0.06, 5);
  box("pave", 4, 0.12, 6, -5, 0.06, 0);
  box("pave", 4, 0.12, 6, 5, 0.06, 0);
  for (const s of [-1, 1]) {
    box("kerb", 14, 0.13, 0.08, 0, 0.065, s * 5);
    box("kerb", 0.08, 0.13, 14, s * 5, 0.065, 0);
  }
  // The square pit: a black well under a stone lip
  box("well", 6, 0.1, 6, 0, 0.02, 0);
  for (const s of [-1, 1]) {
    box("kerb", 6.7, 0.35, 0.35, 0, 0.17, s * 3.17);
    box("kerb", 0.35, 0.35, 6.7, s * 3.17, 0.17, 0);
  }
  // East and west moat channels with stone walls, and a bridge across each at z 0
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) box("water", 3, 0.1, 4.8, sx * 8.5, 0.05, sz * 4.6);
    box("kerb", 0.4, 0.5, 14.4, sx * 7, 0.25, 0);
    box("kerb", 0.4, 0.5, 14.4, sx * 10, 0.25, 0);
    box("kerb", 4.4, 0.4, 3.6, sx * 8.5, 0.55, 0);
    box("kerb", 3.4, 0.4, 3.6, sx * 8.5, 0.25, 0);
    for (const pz of [-1, 1]) box("kerb", 4.4, 0.5, 0.25, sx * 8.5, 0.95, pz * 1.7);
  }
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `dynastyCourt_${key}`;
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
    if (key !== "well") glow?.addExcludedMesh(merged);
  }
}

// Two rim torii diagonally opposite the pagoda; preserve the base gate geometry and move its post colliders.
function rimTorii(scene: Scene, built: Set<unknown>, obstacles: MapBuildResult["obstacles"]): void {
  const gate=scene.getMeshByName("Dynasty Garden_torii");
  if(!gate) return;
  const old=gate.position.clone(), yaw=gate.rotation.y;
  for(let i=obstacles.length-1;i>=0;i--) {
    if([-1,1].some(s=>Math.hypot(obstacles[i].center.x-(old.x+s*Math.cos(yaw)*2.7),obstacles[i].center.z-(old.z-s*Math.sin(yaw)*2.7))<0.5)) obstacles.splice(i,1);
  }
  const twin=gate.clone("dynastyRimToriiTwin",null);
  const gates=[gate,twin];
  for(const [i,[x,z]] of [[-43,28],[40,-33]].entries()) {
    const g=gates[i];if(!g) continue;
    g.position.set(x,0,z);g.rotation.y=0;
    for(const m of scene.meshes) {
      if(!built.has(m)||m.name!=="trunk"||m.parent||Math.hypot(m.position.x-x,m.position.z-z)>5) continue;
      m.setEnabled(false);
      for(let j=obstacles.length-1;j>=0;j--) if(Vector3.Distance(obstacles[j].center,m.position)<0.6) obstacles.splice(j,1);
    }
    for(const s of [-1,1]) obstacles.push({type:"cylinder",center:new Vector3(x+s*2.7,0,z),radius:0.36});
  }
}

// Turquoise canals: two 92 x 10 m stone-lined channels, lily groups kept clear of the six bridges.
function gardenCanals(scene: Scene, built: Set<unknown>): void {
  for(const m of scene.meshes) if(built.has(m)&&m.name==="campaign_hazard_box_water") m.setEnabled(false);
  const water=new StandardMaterial("dynastyCanalTurquoise",scene);
  water.diffuseColor.set(0.2,0.8,0.75);water.emissiveColor.set(0.07,0.28,0.26);water.specularColor=Color3.Black();
  const stone=new StandardMaterial("dynastyCanalStone",scene);
  stone.diffuseColor.set(0.3,0.34,0.37);stone.emissiveColor.set(0.09,0.1,0.11);stone.specularColor=Color3.Black();
  const leaf=new StandardMaterial("dynastyLily",scene);
  leaf.diffuseColor.set(0.25,0.38,0.07);leaf.emissiveColor.set(0.05,0.08,0.01);
  const glow=scene.getGlowLayerByName("glow");
  for(const sz of [-1,1]) {
    const sheet=MeshBuilder.CreateBox("dynastyCanalWater",{width:92,height:0.08,depth:10},scene);
    sheet.position.set(0,0.14,sz*12);sheet.material=water;glow?.addExcludedMesh(sheet);
    for(const z of [sz*7,sz*17]) for(const [a,b] of [[-41,-3],[3,41]]) {
      const wall=MeshBuilder.CreateBox("dynastyCanalWall",{width:b-a,height:0.65,depth:0.5},scene);
      wall.position.set((a+b)/2,0.3,z);wall.material=stone;wall.receiveShadows=true;
    }
    for(let i=0;i<32;i++) {
      const x=-37+(i%16)*4.8, z=sz*12+(i<16?-2.2:2.2)+Math.sin(i*3.7)*0.7;
      if(Math.abs(x)<4) continue;
      const pad=MeshBuilder.CreateCylinder("dynastyLilyPad",{height:0.05,diameter:0.6+(i%3)*0.25,tessellation:7},scene);
      pad.position.set(x,0.22,z);pad.material=leaf;glow?.addExcludedMesh(pad);
    }
  }
}

export function buildDynasty(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const restoreSky = mintSky(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));
  squareIsland(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))), result);
  // The base's small pagoda (a root with its parts as children) and its collider
  // and any ring tree standing in the new pagoda's footprint, with their colliders
  const gone: Vector3[] = [];
  const inFootprint = (p: Vector3) => Math.abs(p.x - PAGODA.x) < 10.5 && p.z > PAGODA.z - 16 && p.z < PAGODA.z + 11;
  for (const mesh of scene.meshes) {
    if (prior.has(mesh)) continue;
    if (mesh.name === "Dynasty Garden_pagoda" || (!mesh.parent && inFootprint(mesh.position) && /^(trunk|Dynasty Garden_(lantern|cyl|box))/.test(mesh.name))) {
      gone.push(mesh.position.clone());
      mesh.setEnabled(false);
    }
  }
  const obstacles = result.obstacles.filter(({ center }) => !gone.some((p) => Math.hypot(center.x - p.x, center.z - p.z) < 1));
  pagoda(scene);
  courtyard(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))), result);
  gardenCanals(scene,new Set<unknown>(scene.meshes.filter((m)=>!prior.has(m))));
  lawnTerraces(scene,new Set<unknown>(scene.meshes.filter((m)=>!prior.has(m))),result);
  courtApproaches(scene,result);
  terraceBranches(scene,result);
  perimeterFlagstones(scene,result);
  canalSpurs(scene, result);
  canalPools(scene, result);
  obstacles.push({ type: "box", center: new Vector3(PAGODA.x, 0, PAGODA.z - 1.4), halfX: 8.5, halfZ: 9.9 });
  rimTorii(scene,new Set<unknown>(scene.meshes.filter((m)=>!prior.has(m))),obstacles);
  columnCliffs(scene,new Set<unknown>(scene.meshes.filter((m)=>!prior.has(m))));
  return { ...result, obstacles, dispose: () => { restoreSky(); result.dispose?.(); } };
}

// Dynasty placement reference: blue-grey faceted columns form a continuous
// vertical island edge, with irregular green ledges; no hanging stalactites.
function columnCliffs(scene: Scene, built: Set<unknown>): void {
  for(const m of scene.meshes)if(built.has(m)&&/^(islandUnder|islandShelf|islandCliff)/.test(m.name))m.setEnabled(false);
  const stone=new StandardMaterial("dynastyColumnRock",scene);
  stone.diffuseColor.set(0.2,0.4,0.48);stone.emissiveColor.set(0.06,0.12,0.14);stone.specularColor=Color3.Black();
  const turf=scene.getMaterialByName("dynastyGreenLawn")!;
  const rocks: Mesh[]=[],caps: Mesh[]=[];
  // Follow the square's chamfered corners and the existing near-left notch.
  const edge=[[-36,-30],[-36,-47],[41,-47],[53,-36],[53,36],[41,47],[-41,47],[-53,36],[-53,-30],[-36,-30]];
  let k=0;
  for(let e=1;e<edge.length;e++) {
    const [ax,az]=edge[e-1],[bx,bz]=edge[e],n=Math.ceil(Math.hypot(bx-ax,bz-az)/3);
    for(let j=0;j<n;j++,k++) {
      const t=(j+0.5)/n,x=ax+(bx-ax)*t,z=az+(bz-az)*t,h=10+Math.sin(k*1.7)*2.5;
      const c=MeshBuilder.CreateCylinder("dynastyCliffColumn",{height:h,diameterTop:4.4,diameterBottom:3.8,tessellation:5},scene);
      c.position.set(x,-h/2-0.15,z);c.rotation.y=k*0.7;rocks.push(c);
      if(k%3===0) {
        const cap=MeshBuilder.CreateIcoSphere("dynastyCliffTurf",{radius:1.8,subdivisions:1},scene);
        cap.position.set(x,-0.7-(k%4)*1.3,z);cap.scaling.set(1.1,0.22,1.1);caps.push(cap);
      }
    }
  }
  for(const [parts,mat,name] of [[rocks,stone,"dynastyColumnCliffs"],[caps,turf,"dynastyColumnLedges"]] as const) {
    const merged=Mesh.MergeMeshes(parts,true);if(!merged)continue;
    merged.material=mat;merged.name=name;merged.convertToFlatShadedMesh();merged.receiveShadows=true;
  }
}

// The wiki's waterways wrap raised lawns rather than ending as parallel strips.
// Join them at each side, and give the middle/outer lawns wide stepped crossings.
function terraceBranches(scene: Scene, result: MapBuildResult): void {
  const water=scene.getMaterialByName("dynastyCanalTurquoise")!;
  const stone=scene.getMaterialByName("dynastyLawnStone")!;
  const put=(name:string,w:number,h:number,d:number,x:number,y:number,z:number,mat=stone)=>{
    const m=MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);m.position.set(x,y,z);m.material=mat;m.receiveShadows=true;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(m);
  };
  for(const sign of [-1,1]) {
    put("dynastyBranchWater",3,0.1,14,sign*42,0.15,0,water);
    for(const x of [40.4,43.6])put("dynastyBranchBank",0.35,1.05,14,sign*x,0.5,0);
    // The dry crossing at z0 keeps the outer loop connected to the middle lawn.
    put("dynastyBranchCrossing",3.8,1.05,4.8,sign*42,0.525,0);
    for(const z of [-4.7,4.7])result.hazards.push({shape:"box",kind:"water",center:new Vector3(sign*42,0,z),halfX:1.5,halfZ:2.3});
  }
  // Terrace stairs (583, shogun_s_samurai: wide stone stairs climb from the middle lawns to the higher outer lawns). Each
  // flight is a flat 8 m deck over the canal's near 6 m (|z| 7..13) at the middle lawn's level, then ten 0.5 m treads
  // climbing to the outer lawn's top at |z| 18, between stepped cheek walls.
  const outer=scene.meshes.find(m=>m.name==="dynastyLawnRetaining"&&Math.abs(m.position.z)>20);
  const DECK=0.97,TOP=(outer?outer.position.y*2:1.4)+0.12;
  for(const sx of [-1,1])for(const sz of [-1,1]) {
    put("dynastyTerraceStair",8,DECK,6,sx*27,DECK/2,sz*10);
    for(const side of [-1,1])put("dynastyTerraceStairCheek",0.5,DECK+0.45,6,sx*27+side*4.25,(DECK+0.45)/2,sz*10);
    for(let i=0;i<10;i++) {
      const h=DECK+(i+1)/10*(TOP-DECK),z=sz*(13+(i+0.5)*0.5);
      put("dynastyTerraceStair",8,h,0.53,sx*27,h/2,z);
      if(i%2===0)for(const side of [-1,1])put("dynastyTerraceStairCheek",0.5,h+0.75,1.03,sx*27+side*4.25,(h+0.75)/2,z+sz*0.25);
    }
  }
  // Carve the four new dry flights out of the existing canal hazards.
  result.hazards=result.hazards.flatMap(h=>{
    if(h.shape!=="box"||h.kind!=="water"||Math.abs(Math.abs(h.center.z)-12)>0.1||h.halfX<40)return [h];
    return [[-46,-31],[-23,23],[31,46]].map(([a,b])=>({...h,center:new Vector3((a+b)/2,0,h.center.z),halfX:(b-a)/2}));
  });
  const oldHeight=result.height;
  result.height=(x,z)=>{
    if(Math.abs(Math.abs(x)-27)<4&&Math.abs(z)>=7&&Math.abs(z)<=18)return Math.abs(z)<=13?DECK:DECK+Math.ceil((Math.abs(z)-13)/5*10)/10*(TOP-DECK);
    if(Math.abs(Math.abs(x)-42)<1.9&&Math.abs(z)<2.4)return 1.05;
    return oldHeight?.(x,z)??0;
  };
}

// A continuous walkable flagstone loop frames the outer lawn (wiki Dynasty).
// Follow the corner notch and rise onto the existing canal bridges at x +/-44.
function perimeterFlagstones(scene: Scene, result: MapBuildResult): void {
  const stone=scene.getMaterialByName("dynastyLawnStone")!;
  const parts: Mesh[]=[];
  const corners=[[-32,-26],[-32,-35],[41,-35],[46,-29],[46,30],[39,35],[-39,35],[-46,29],[-46,-26],[-32,-26]];
  const oldHeight=result.height;
  const pathHeight=(x:number,z:number)=>{
    // Leave the pagoda's raised platform alone.
    const h=oldHeight?.(x,z)??0;
    return Math.max(0.22,h);
  };
  for(let e=1;e<corners.length;e++) {
    const [ax,az]=corners[e-1],[bx,bz]=corners[e],len=Math.hypot(bx-ax,bz-az),n=Math.ceil(len/1.15),yaw=Math.atan2(bz-az,bx-ax);
    for(let i=0;i<n;i++)for(let row=-1;row<=1;row++) {
      const t=(i+0.5)/n,off=row*0.9;
      const x=ax+(bx-ax)*t-Math.sin(yaw)*off,z=az+(bz-az)*t+Math.cos(yaw)*off;
      const p=MeshBuilder.CreateBox("dynastyPerimeterFlagstone",{width:len/n-0.08,height:0.16,depth:0.82},scene);
      p.position.set(x,pathHeight(x,z)+0.06,z);p.rotation.y=-yaw+(i%3-1)*0.035;parts.push(p);
    }
  }
  const merged=Mesh.MergeMeshes(parts,true);
  if(merged){merged.name="dynastyPerimeterLoop";merged.material=stone;merged.receiveShadows=true;scene.getGlowLayerByName("glow")?.addExcludedMesh(merged);}
}

// Four separate stone bridge/stair approaches over the water ring around the square courtyard.
// N/S spans z7..17; E/W spans x7..10. Curved decks rise at their centres, with low parapets.
function courtApproaches(scene: Scene, result: MapBuildResult): void {
  const stone=new StandardMaterial("dynastyApproachStone",scene);
  stone.diffuseColor.set(0.3,0.35,0.38);stone.emissiveColor.set(0.09,0.1,0.12);stone.specularColor=Color3.Black();
  const box=(w:number,h:number,d:number,x:number,y:number,z:number)=>{
    const m=MeshBuilder.CreateBox("dynastyCourtApproach",{width:w,height:h,depth:d},scene);m.position.set(x,y,z);m.material=stone;m.receiveShadows=true;
  };
  for(const ns of [true,false]) for(const sign of [-1,1]) {
    const start=7,end=ns?17:10,span=end-start,n=16;
    for(let i=0;i<n;i++) {
      const t=(i+0.5)/n,along=sign*(start+t*span),y=0.7+Math.sin(t*Math.PI)*0.65;
      box(ns?4.8:span/n+0.03,0.35,ns?span/n+0.03:4.8,ns?0:along,y-0.175,ns?along:0);
      for(const side of [-1,1]) box(ns?0.25:span/n+0.04,0.65,ns?span/n+0.04:0.25,ns?side*2.3:along,y+0.25,ns?along:side*2.3);
    }
    for(const endSide of [-1,1]) for(let i=0;i<6;i++) {
      const along=sign*((endSide<0?start:end)+endSide*(i+0.5)*0.45),y=0.7*(1-(i+0.5)/6);
      box(ns?4.8:0.48,y+0.12,ns?0.48:4.8,ns?0:along,y/2,ns?along:0);
    }
  }
  const oldHeight=result.height;
  result.height=(x,z)=>{
    for(const ns of [true,false]) {
      const across=Math.abs(ns?x:z),along=Math.abs(ns?z:x),end=ns?17:10;
      if(across<2.4&&along>=7&&along<=end)return 0.7+Math.sin((along-7)/(end-7)*Math.PI)*0.65;
      if(across<2.4&&along>4.3&&along<7)return 0.7*(along-4.3)/2.7;
      if(across<2.4&&along>end&&along<end+2.7)return 0.7*(end+2.7-along)/2.7;
    }
    return oldHeight?.(x,z)??0;
  };
}

// Green lawn blocks separated from the canals by grey flagstone edges (shogun_s_samurai).
// Four middle lawns x11..40, |z|<7, and outer lawns z18..30 rise on low stone retaining faces.
function lawnTerraces(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const turf=new StandardMaterial("dynastyGreenLawn",scene);
  turf.diffuseColor.set(0.12,0.38,0.14);turf.emissiveColor.set(0.035,0.11,0.04);turf.specularColor=Color3.Black();
  const stone=new StandardMaterial("dynastyLawnStone",scene);
  stone.diffuseColor.set(0.3,0.35,0.36);stone.emissiveColor.set(0.08,0.095,0.1);stone.specularColor=Color3.Black();
  for(const mesh of scene.meshes) if(built.has(mesh)) {
    if(/^(ground$|centerGrass$)/.test(mesh.name))mesh.material=turf;
    if(/^(fieldBlades_|fieldTufts_|grassTuft)/.test(mesh.name))mesh.setEnabled(false);
  }
  const blocks:Array<{x:number;z:number;w:number;d:number;h:number}>=[];
  const box=(name:string,w:number,h:number,d:number,x:number,y:number,z:number,mat=stone)=>{
    const m=MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);m.position.set(x,y,z);m.material=mat;m.receiveShadows=true;return m;
  };
  for(const sx of [-1,1]) for(const sz of [-1,1]) {
    blocks.push({x:sx*26,z:sz*3.7,w:29,d:6.3,h:0.85});
    blocks.push({x:sx*25,z:sz*24,w:30,d:12,h:2.4});
  }
  for(const b of blocks) {
    box("dynastyLawnRetaining",b.w,b.h,b.d,b.x,b.h/2,b.z);
    box("dynastyLawnTurf",b.w-0.6,0.16,b.d-0.6,b.x,b.h+0.04,b.z,turf);
    // Discrete offset flagstones, rather than a continuous pale stripe.
    for(const side of [-1,1]) for(let x=-b.w/2+0.6;x<b.w/2;x+=1.3)
      box("dynastyLawnFlagstone",1.15,0.12,0.65,b.x+x,b.h+0.1,b.z+side*(b.d/2-0.35));
  }
  const oldHeight=result.height;
  result.height=(x,z)=>{
    const b=blocks.find(b=>Math.abs(x-b.x)<b.w/2&&Math.abs(z-b.z)<b.d/2);
    return b?b.h+0.12:oldHeight?.(x,z)??0;
  };
}

// Canal spurs (583, wiki dynasty.png: the water is a network, each long canal sending an arm out between the lawns so the
// field is cut into separate raised terraces with stone banks). Spec: four spurs in a pinwheel, one per quadrant, at
// x 34 and -17 (back) and -34 and 17 (front); each leaves its long canal at |z| 17.6 and runs 9.4 m out to |z| 27 through
// the outer lawn, 4.4 m of turquoise water between stone banks as high as the lawn. The outer lawn block (its retaining
// box and turf) is cut in two across the spur, the canal wall and the edge flagstones opened at its mouth, and the last
// 3 m (|z| 27..30) stay a dry stone crossing between the two terraces. Water hazard under each spur; the ground there is
// drawn at water level.
const SPURS = [[34, 1], [-17, 1], [-34, -1], [17, -1]] as const;
function canalSpurs(scene: Scene, result: MapBuildResult): void {
  const water = scene.getMaterialByName("dynastyCanalTurquoise")!;
  const stone = scene.getMaterialByName("dynastyLawnStone")!;
  const glow = scene.getGlowLayerByName("glow");
  const put = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, mat = stone) => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.position.set(x, y, z);
    m.material = mat;
    m.receiveShadows = true;
    glow?.addExcludedMesh(m);
  };
  // Open a box that runs along x around the spur: the box keeps one side, a clone takes the other.
  const splitX = (m: Mesh, xs: number, gap: number) => {
    const w = m.getBoundingInfo().boundingBox.extendSize.x * 2;
    const lo = m.position.x - w / 2, hi = m.position.x + w / 2;
    const other = m.clone(m.name);
    m.scaling.x = (xs - gap - lo) / w;
    m.position.x = (lo + xs - gap) / 2;
    other.scaling.x = (hi - xs - gap) / w;
    other.position.x = (hi + xs + gap) / 2;
  };
  const HALF = 2.6, NEAR = 17.6, FAR = 27;
  for (const [xs, sz] of SPURS) {
    let top = 1.4;
    for (const m of [...scene.meshes]) {
      if (!(m instanceof Mesh) || m.position.z * sz < 16 || Math.sign(m.position.x) !== Math.sign(xs)) continue;
      if (m.name === "dynastyLawnFlagstone") {
        if (Math.abs(m.position.x - xs) < HALF + 0.7 && Math.abs(m.position.z) < FAR) m.dispose();
      } else if (m.name === "dynastyLawnRetaining" && Math.abs(m.position.z) > 20) {
        top = m.position.y * 2;
        splitX(m, xs, HALF);
      } else if (m.name === "dynastyLawnTurf" && Math.abs(m.position.z) > 20) splitX(m, xs, HALF + 0.3);
      else if (m.name === "dynastyCanalWall" && Math.abs(Math.abs(m.position.z) - 17) < 0.2) splitX(m, xs, HALF - 0.4);
    }
    const len = FAR - NEAR, zc = sz * (NEAR + FAR) / 2;
    put("dynastySpurWater", HALF * 2 - 0.8, 0.1, len + 1.4, xs, 0.15, zc - sz * 0.7, water);
    for (const s of [-1, 1]) put("dynastySpurBank", 0.45, top + 0.3, len, xs + s * (HALF - 0.2), (top + 0.3) / 2, zc);
    put("dynastySpurCrossing", HALF * 2 + 0.6, top + 0.2, 3, xs, (top + 0.2) / 2, sz * (FAR + 1.5));
    result.hazards.push({ shape: "box", kind: "water", center: new Vector3(xs, 0, zc), halfX: HALF - 0.6, halfZ: len / 2 });
  }
  const oldHeight = result.height;
  result.height = (x, z) => {
    for (const [xs, sz] of SPURS) if (Math.abs(x - xs) < HALF - 0.4 && z * sz > NEAR && z * sz < FAR) return 0;
    return oldHeight?.(x, z) ?? 0;
  };
}

// L-shaped pools (588, blocker b3; wiki dynasty.png: the water is not two long straight canals but separate pools, each an
// arm of canal that turns into a side arm between the lawns, the rest of the field dry raised lawn). Spec: each long canal
// (|z| 7..17) keeps water only from its spur back along the canal, so every quadrant holds one L (canal arm + spur): back
// (z > 0) x -19.6..3 (the inner arm to the spur at -17, under the centre bridge) and x 31..36.6 (stair to the spur at 34);
// front (z < 0) x -36.6..-31 and x -3..19.6. Every other stretch of canal is filled by a dry lawn block at the middle lawns'
// height (0.85 m): stone retaining box, turf cap and offset edge flagstones, as lawnTerraces. The canal hazards are cut to the
// kept arms; the ground over the dry blocks is drawn at the lawn height.
const POOL_ARMS: Record<number, Array<[number, number]>> = { 1: [[-19.6, 3], [31, 36.6]], [-1]: [[-36.6, -31], [-3, 19.6]] };
const DRY_BLOCKS: Record<number, Array<[number, number]>> = {
  1: [[-46, -31], [-23, -19.6], [3, 23], [36.6, 46]],
  [-1]: [[-46, -36.6], [-23, -3], [19.6, 23], [31, 46]],
};
function canalPools(scene: Scene, result: MapBuildResult): void {
  const stone = scene.getMaterialByName("dynastyLawnStone")!;
  const turf = scene.getMaterialByName("dynastyGreenLawn")!;
  const H = 0.85, Z0 = 7.25, Z1 = 16.75, ZC = 12, D = Z1 - Z0;
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, mat = stone) => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.position.set(x, y, z);
    m.material = mat;
    m.receiveShadows = true;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(m);
  };
  const dry: Array<{ a: number; b: number; sz: number }> = [];
  for (const sz of [1, -1]) for (const [a, b] of DRY_BLOCKS[sz]) {
    const w = b - a, x = (a + b) / 2, z = sz * ZC;
    dry.push({ a, b, sz });
    box("dynastyPoolLawnRetaining", w, H, D, x, H / 2, z);
    box("dynastyPoolLawnTurf", w - 0.6, 0.16, D - 0.6, x, H + 0.04, z, turf);
    for (const side of [-1, 1]) for (let dx = 0.6; dx < w - 0.6; dx += 1.3)
      box("dynastyLawnFlagstone", Math.min(1.15, w - dx - 0.1), 0.12, 0.65, a + dx + 0.575, H + 0.1, z + side * (D / 2 - 0.35));
  }
  const canal = result.hazards.find((h) => h.shape === "box" && h.kind === "water" && Math.abs(Math.abs(h.center.z) - 12) < 0.1);
  const halfZ = canal && canal.shape === "box" ? canal.halfZ : 5;
  result.hazards = result.hazards.filter((h) => !(h.shape === "box" && h.kind === "water" && Math.abs(Math.abs(h.center.z) - 12) < 0.1));
  for (const sz of [1, -1]) for (const [a, b] of POOL_ARMS[sz])
    result.hazards.push({ shape: "box", kind: "water", center: new Vector3((a + b) / 2, 0, sz * ZC), halfX: (b - a) / 2, halfZ });
  const oldHeight = result.height;
  result.height = (x, z) => {
    if (Math.abs(z) > Z0 && Math.abs(z) < Z1 && dry.some((d) => Math.sign(z) === d.sz && x > d.a && x < d.b)) return H + 0.12;
    return oldHeight?.(x, z) ?? 0;
  };
}
