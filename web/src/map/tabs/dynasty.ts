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
//
// Garden look rebuild (597 [R], criterion a plateau; reference/maps/dynasty.png, wiki dynasty.png, stages/wild_west.shogun_s_samurai):
// - Lawn (a1): soft pale pastel green, sRGB about (150,200,125): turf (.32,.55,.24) self .3 (was saturated (.12,.38,.14)).
// - Cobble loop (a2): the cherries over it thinned (every 4th ring tree, not every 3rd) and their limbs lean outward, so
//   the pale grey 5 m loop shows between them from the top camera.
// - Blossom shrubs (a3): low rows of lilac-pink shrub clumps (2-3 faceted balls r .7-1.2 m every ~2.3 m, (.9,.68,.9) self
//   .45) along the canal-side lip of each outer lawn and both cheeks of each terrace stair, runs broken at stairs, bridges
//   and spurs; drawn only (no colliders: units may stand in them, as on the four stages).
// - Cliffs (a4): the boulder courses teal grey-blue (.22,.36,.44) self ~.4 (were pale lavender), bright moss (.26,.52,.2)
//   lying on the upper outer shoulder of every 2nd top boulder and every 3rd lower one, where the island camera sees it.
// - Cherries (a5): crowns pale pink-lilac (.94,.72,.88) self .46, bark tan-brown (.42,.28,.16); every 4th ring tree, so
//   they stand apart.
// - Pagoda (a6): an open frame: no white walls or lattice panels; a wooden floor in each storey, pink-red (.82,.1,.3)
//   columns with a low red rail (open at the front), a dark lattice frieze and ceiling under the beam; platform darker
//   blue-grey stone (.34,.4,.46). Site, size, stair and collider unchanged (b, c).
import { Color3, DynamicTexture, Mesh, MeshBuilder, Quaternion, StandardMaterial, Texture, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

// Pagoda re-sited (594, blocker b1; wiki dynasty.png: the pagoda stands over the north canal close behind the courtyard, its
// stair coming down over the water toward the pit, an arched stone bridge across the canal on either side of it). Spec: centre
// (0, 19) on the centre line, platform 15 x 15 (x -7.5..7.5, z 11.5..26.5: its front half over the canal z 7..17, its back
// short of the cobble loop at z ~28), stair 8 steps from the platform's front edge down to the courtyard's north edge (z 7),
// replacing the north court approach; one box collider over platform and stair. Two stone bridges at x +-12.5 cross the canal
// (z 7..17), 4.8 m decks with parapets on an arched body with a dark opening, climbing from the middle lawn (0.97 m) to the
// outer lawn (2.52 m) with a 0.8 m arch; the canal's back arm is carried on under the pagoda and the right bridge (water
// x -19.6..16, dry lawn 16..23), its hazard cut out under both bridge decks. The old site (17, 37) is left to the ring.
const PAGODA = { x: 0, z: 19, size: 15 };
const SIDE_BRIDGES = [-12.5, 12.5];

function pagoda(scene: Scene): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    stone: mk("dynastyPagodaStone", new Color3(0.34, 0.4, 0.46), 0.45),
    kerb: mk("dynastyPagodaKerb", new Color3(0.26, 0.3, 0.36), 0.45),
    wood: mk("dynastyPagodaStair", new Color3(0.58, 0.4, 0.24), 0.4),
    red: mk("dynastyPagodaRed", new Color3(0.82, 0.1, 0.3), 0.45),
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
  const P = 3, S = PAGODA.size, front = -S / 2, run = Z + front - 7, steps = 8;
  box("stone", S, P, S, 0, P / 2, 0);
  box("kerb", S + 0.6, 0.5, S + 0.6, 0, P - 0.1, 0);
  // stone piers under the front edge where it stands in the canal
  for (const sx of [-1, 1]) box("kerb", 1.2, P, 1.2, sx * (S / 2 - 0.6), P / 2, front + 0.6);
  for (let s = 0; s < steps; s++) {
    const h = P * (s + 1) / steps;
    box(s % 2 ? "wood" : "kerb", 7, h, run / steps, 0, h / 2, front - run + (s + 0.5) * run / steps);
  }
  for (const sx of [-1, 1]) box("red", 0.4, 1.4, run, sx * 3.7, P * 0.55, front - run / 2);
  // A storey (597 [R], blocker a6): an open frame, no walls: a wooden floor, a ring of pink-red columns with a low red rail
  // between them (open at the front), a shallow lattice frieze hung under the beam, a dark ceiling seen through the columns
  const storey = (y: number, w: number, h: number, posts: number) => {
    box("wood", w - 0.2, 0.3, w - 0.2, 0, y + 0.15, 0);
    box("lattice", w - 1, 0.2, w - 1, 0, y + h - 0.1, 0);
    for (const [fx, fz] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      box("lattice", fz ? w - 0.6 : 0.12, 0.7, fz ? 0.12 : w - 0.6, fx * (w / 2 - 0.05), y + h - 0.45, fz * (w / 2 - 0.05));
      if (fz === -1) continue;
      box("red", fz ? w - 0.6 : 0.16, 0.16, fz ? 0.16 : w - 0.6, fx * (w / 2), y + 1.1, fz * (w / 2));
    }
    for (let i = 0; i < posts; i++) {
      const t = i / posts * 4, side = Math.floor(t), f = t - side;
      const u = -w / 2 + f * w;
      const [px, pz] = [[u, -w / 2], [w / 2, u], [-u, w / 2], [-w / 2, -u]][side];
      cyl("red", 0.6, h, px, y + h / 2, pz);
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
    if (!parts[key].length) continue;
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
  const inFootprint = (p: Vector3) => Math.abs(p.x - PAGODA.x) < PAGODA.size / 2 + 2 && p.z > 8 && p.z < PAGODA.z + PAGODA.size / 2 + 2;
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
  sideBridges(scene, result);
  canalOutlets(scene, result, obstacles);
  // platform and stair (z 7 .. 26.5)
  obstacles.push({ type: "box", center: new Vector3(PAGODA.x, 0, (7 + PAGODA.z + PAGODA.size / 2) / 2), halfX: PAGODA.size / 2, halfZ: (PAGODA.z + PAGODA.size / 2 - 7) / 2 });
  rimTorii(scene,new Set<unknown>(scene.meshes.filter((m)=>!prior.has(m))),obstacles);
  columnCliffs(scene,new Set<unknown>(scene.meshes.filter((m)=>!prior.has(m))));
  cherryGrove(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))), result, obstacles);
  blossomShrubs(scene, result);
  return { ...result, obstacles, dispose: () => { restoreSky(); result.dispose?.(); } };
}

// Cherry grove (596, blocker a5; reference/maps/dynasty.png: the ring is a loose grove of big cherry trees standing apart, each
// a tall, bent and twisted brown trunk forking into two or three limbs that carry large clustered lilac-pink canopies, not a
// dense double row of small white-pink puffs on short sticks). Spec: every base ring tree (an unparented "trunk", its puffs its
// children) is hidden; every third one, in ring order, is replaced at its foot by a cherry: a trunk of four tapering segments
// (0.9 m to 0.35 m) 5.5-8 m high, each segment bent 0.18-0.4 rad a new way (a twisted, leaning bole), forking at the top into
// three limbs 2.2-3.4 m spread 120 degrees, each carrying a clump of 3-4 faceted balls r 1.4-2.4 m (one big canopy 7-9 m across
// overall) in lilac-pink (.8,.52,.84) self .42, trunks brown (.3,.19,.1) self .25, both flat shaded, crowns out of the glow and
// fog-free so they stay saturated. Hidden trees lose their colliders; kept ones keep theirs. Seated on the drawn ground height.
function cherryGrove(scene: Scene, built: Set<unknown>, result: MapBuildResult, obstacles: MapBuildResult["obstacles"]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  // 597 [R] blocker a5: pale pink-lilac crowns (the 596 ones read violet), lighter bark, every 4th tree (a closed wall at 3rd)
  const bark = mk("dynastyCherryBark", new Color3(0.42, 0.28, 0.16), 0.25);
  const bloom = mk("dynastyCherryBloom", new Color3(0.94, 0.72, 0.88), 0.46);
  const hash = (i: number, s: number) => { const v = Math.sin(i * 17.31 + s * 61.7) * 43758.5453; return v - Math.floor(v); };
  const trunks: Mesh[] = [], crowns: Mesh[] = [];
  const seg = (from: Vector3, dir: Vector3, len: number, d0: number, d1: number) => {
    const c = MeshBuilder.CreateCylinder("dynastyCherryLimb", { height: len * 1.04, diameterBottom: d0, diameterTop: d1, tessellation: 6 }, scene);
    const axis = Vector3.Cross(Vector3.Up(), dir);
    const ang = Math.acos(Math.max(-1, Math.min(1, dir.y)));
    if (axis.length() > 1e-4) c.rotationQuaternion = Quaternion.RotationAxis(axis.normalize(), ang);
    c.position.copyFrom(from.add(dir.scale(len / 2)));
    trunks.push(c);
    return from.add(dir.scale(len));
  };
  // 599 a5: ten large separated trees, with open sky between canopies. The
  // former every-fourth sample of the dense ring still formed a wall of puffs.
  const feet = [[-43,-26],[-24,-40],[13,-42],[40,-31],[49,-6],[45,26],[27,40],[-13,43],[-40,31],[-50,4]].map(([x,z])=>new Vector3(x,0,z));
  for (const m of scene.meshes) {
    if (!built.has(m) || m.name !== "trunk" || m.parent || !m.isEnabled()) continue;
    m.setEnabled(false);
    for (let o = obstacles.length - 1; o >= 0; o--) if (Math.hypot(obstacles[o].center.x - m.position.x, obstacles[o].center.z - m.position.z) < 0.6) obstacles.splice(o, 1);
  }
  feet.forEach((foot, i) => {
    obstacles.push({type:"cylinder",center:foot.clone(),radius:0.9});
    const y0 = result.height?.(foot.x, foot.z) ?? 0;
    let p = new Vector3(foot.x, y0 - 0.2, foot.z);
    const tall = 9 + hash(i, 1) * 4;
    let yaw = hash(i, 2) * 6.28;
    for (let s = 0; s < 4; s++) {
      const tilt = 0.18 + hash(i, 3 + s) * 0.22;
      yaw += 1.4 + hash(i, 8 + s) * 1.6;
      const dir = new Vector3(Math.sin(tilt) * Math.cos(yaw), Math.cos(tilt), Math.sin(tilt) * Math.sin(yaw));
      p = seg(p, dir, tall / 4, 1.3 - s * 0.2, 1.3 - (s + 1) * 0.2);
    }
    const spin = hash(i, 13) * 6.28;
    // 597: limbs lean outward (off the cobble loop inside the ring)
    const rl = Math.hypot(foot.x, foot.z) || 1, ox = foot.x / rl, oz = foot.z / rl;
    for (let l = 0; l < 3; l++) {
      const a = spin + (l * Math.PI * 2) / 3, reach = 2.2 + hash(i * 3 + l, 14) * 1.2;
      const dir = new Vector3(Math.cos(a) * 0.8 + ox * 0.6, 0.6, Math.sin(a) * 0.8 + oz * 0.6).normalize();
      const end = seg(p, dir, reach, 0.36, 0.2);
      const balls = 3 + Math.floor(hash(i * 3 + l, 15) * 2);
      for (let b = 0; b < balls; b++) {
        const r = 2.3 + hash(i * 7 + l * 3 + b, 16) * 1.3, ba = a + (b - balls / 2) * 1.1;
        const ball = MeshBuilder.CreateIcoSphere("dynastyCherryCrown", { radius: r, subdivisions: 1, flat: true }, scene);
        ball.scaling.set(1, 0.82, 1);
        ball.position.set(end.x + Math.cos(ba) * r * 0.55, end.y + 0.4 + (b % 2) * 0.7, end.z + Math.sin(ba) * r * 0.55);
        crowns.push(ball);
      }
    }
  });
  const glow = scene.getGlowLayerByName("glow");
  for (const [list, mat, name] of [[trunks, bark, "dynastyCherryTrunks"], [crowns, bloom, "dynastyCherryCrowns"]] as const) {
    const merged = Mesh.MergeMeshes(list, true, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.receiveShadows = true;
    merged.isPickable = false;
    if (name === "dynastyCherryCrowns") { merged.applyFog = false; glow?.addExcludedMesh(merged); }
  }
}

// Blossom shrubs (597 [R], blocker a3; spec at the head of this file): clumps along each outer lawn's canal-side lip
// (|z| 19.4, x 10.6..39.4 per side) broken at the terrace stairs (|x - 27| < 4.8), the back side bridges (|x - 12.5| < 3)
// and the spurs (|x - spur| < 3.2), plus a clump at each cheek of every stair's foot (middle lawn, |z| 6) and head.
function blossomShrubs(scene: Scene, result: MapBuildResult): void {
  const mat = new StandardMaterial("dynastyBlossomShrub", scene);
  mat.diffuseColor = new Color3(0.9, 0.68, 0.9);
  mat.emissiveColor = mat.diffuseColor.scale(0.45);
  mat.specularColor = Color3.Black();
  const hash = (i: number, s: number) => { const v = Math.sin(i * 23.17 + s * 41.3) * 43758.5453; return v - Math.floor(v); };
  const balls: Mesh[] = [];
  let n = 0;
  const clump = (x: number, z: number) => {
    const y = result.height?.(x, z) ?? 0, i = n++, k = 2 + Math.floor(hash(i, 1) * 2);
    for (let b = 0; b < k; b++) {
      const r = 0.7 + hash(i * 3 + b, 2) * 0.5, a = hash(i * 3 + b, 3) * 6.28;
      const ball = MeshBuilder.CreateIcoSphere("dynastyBlossomShrub", { radius: r, subdivisions: 1, flat: true }, scene);
      ball.scaling.set(1.15, 0.8, 1.15);
      ball.position.set(x + Math.cos(a) * 0.6 * b, y + r * 0.6, z + Math.sin(a) * 0.6 * b);
      ball.bakeCurrentTransformIntoVertices();
      balls.push(ball);
    }
  };
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    for (let u = 10.8; u <= 39.4; u += 2.3) {
      const x = sx * u;
      if (Math.abs(u - 27) < 4.8) continue;
      if (sz > 0 && Math.abs(u - 12.5) < 3) continue;
      if (SPURS.some(([spx, spz]) => spz === sz && Math.abs(x - spx) < 3.2)) continue;
      clump(x, sz * 19.4);
    }
    for (const side of [-1, 1]) {
      clump(sx * 27 + side * 5.4, sz * 5.8);
      clump(sx * 27 + side * 5.4, sz * 19.4);
    }
  }
  const merged = Mesh.MergeMeshes(balls, true, true);
  if (!merged) return;
  merged.name = "dynastyBlossomShrubs";
  merged.convertToFlatShadedMesh();
  merged.material = mat;
  merged.receiveShadows = true;
  merged.isPickable = false;
  merged.applyFog = false;
  scene.getGlowLayerByName("glow")?.addExcludedMesh(merged);
}

// Canal outlets (595, blocker b2; reference/maps/dynasty.png front left, wiki dynasty.png bottom: the canals do not stop inside
// the field but run on through the rim and pour off the island's front edge as waterfalls, each crossed near the edge by a
// round-arched stone bridge carrying the path, the cliff opened where the water falls). Spec: the two front spurs (x -34 and
// 17, ending at the dry crossing z -30) run on to the edge (z -47.6) as 3.6 m channels: turquoise water 4 cm proud between stone
// kerbs 0.6 m high; ring trees and props over them go with their colliders; at z -39 (the loop path) a stone bridge 5 m wide
// across the channel, its deck rising 1.3 m over a round arch, low parapets; at the edge a waterfall 3.4 m wide falls 12 m
// down the front face (pale turquoise, self-lit, out of the glow) with a foam lip, and the cliff columns leave a gap round it.
// Water hazards under the channel except under the bridge; units crossing are drawn on the deck.
const OUTLETS = [-34, 17];
const OUTLET = { z0: -30, z1: -47.6, bridgeZ: -39, half: 1.8 };
function canalOutlets(scene: Scene, result: MapBuildResult, obstacles: MapBuildResult["obstacles"]): void {
  const water = scene.getMaterialByName("dynastyCanalTurquoise")!;
  const stone = scene.getMaterialByName("dynastyLawnStone")!;
  const glow = scene.getGlowLayerByName("glow");
  const near = (x: number, z: number, pad: number) => z < OUTLET.z0 + 1 && OUTLETS.some((o) => Math.abs(x - o) < OUTLET.half + pad);
  const gone: Vector3[] = [];
  for (const m of scene.meshes) {
    if (m.parent || !m.isEnabled() || !/^(trunk|Dynasty Garden_)/.test(m.name)) continue;
    if (near(m.position.x, m.position.z, 2.5)) { gone.push(m.position.clone()); m.setEnabled(false); }
  }
  for (let i = obstacles.length - 1; i >= 0; i--) if (gone.some((p) => Math.hypot(obstacles[i].center.x - p.x, obstacles[i].center.z - p.z) < 1)) obstacles.splice(i, 1);
  const fall = new StandardMaterial("dynastyWaterfall", scene);
  fall.diffuseColor = Color3.Black(); fall.disableLighting = true;
  fall.emissiveColor = new Color3(0.55, 0.9, 0.9); fall.specularColor = Color3.Black();
  const foam = new StandardMaterial("dynastyWaterfallFoam", scene);
  foam.diffuseColor = Color3.Black(); foam.disableLighting = true;
  foam.emissiveColor = new Color3(0.92, 0.98, 0.98); foam.specularColor = Color3.Black();
  const parts: { stone: Mesh[]; water: Mesh[]; fall: Mesh[]; foam: Mesh[] } = { stone: [], water: [], fall: [], foam: [] };
  const box = (k: keyof typeof parts, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("dynastyOutletPart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    parts[k].push(b);
  };
  const len = OUTLET.z0 - OUTLET.z1, zc = (OUTLET.z0 + OUTLET.z1) / 2;
  const deckY = (x: number, xs: number) => 1.3 * Math.cos(Math.min(1, Math.abs(x - xs) / 4.5) * Math.PI / 2) + 0.15;
  for (const xs of OUTLETS) {
    box("water", 2 * OUTLET.half, 0.08, len, xs, 0.04, zc);
    for (const s of [-1, 1]) box("stone", 0.5, 0.6, len, xs + s * (OUTLET.half + 0.25), 0.3, zc);
    // the bridge: slices across x, deck following the arch, an opening under the middle
    for (let i = 0; i < 18; i++) {
      const x = xs - 4.5 + (i + 0.5) * 0.5, y = deckY(x, xs), u = (x - xs) / (OUTLET.half + 0.5);
      const under = Math.abs(u) < 1 ? Math.sqrt(1 - u * u) * 1.1 : 0;
      box("stone", 0.52, 0.3, 5, x, y - 0.15, OUTLET.bridgeZ);
      if (y - 0.3 - under > 0.05) box("stone", 0.52, y - 0.3 - under, 4.4, x, under + (y - 0.3 - under) / 2, OUTLET.bridgeZ);
      for (const s of [-1, 1]) box("stone", 0.52, 0.55, 0.3, x, y + 0.27, OUTLET.bridgeZ + s * 2.35);
    }
    box("fall", 3.4, 12, 0.5, xs, -6, OUTLET.z1 - 0.2);
    box("foam", 3.8, 0.35, 1, xs, 0.1, OUTLET.z1 + 0.2);
    box("foam", 4.6, 0.6, 1.4, xs, -12, OUTLET.z1 - 0.3);
    result.hazards.push({ shape: "box", kind: "water", center: new Vector3(xs, 0, (OUTLET.z0 + OUTLET.bridgeZ + 2.6) / 2), halfX: OUTLET.half - 0.3, halfZ: (OUTLET.z0 - OUTLET.bridgeZ - 2.6) / 2 });
    result.hazards.push({ shape: "box", kind: "water", center: new Vector3(xs, 0, (OUTLET.bridgeZ - 2.6 + OUTLET.z1) / 2), halfX: OUTLET.half - 0.3, halfZ: (OUTLET.bridgeZ - 2.6 - OUTLET.z1) / 2 });
  }
  const mats = { stone, water, fall, foam };
  for (const k of Object.keys(parts) as Array<keyof typeof parts>) {
    const merged = Mesh.MergeMeshes(parts[k], true);
    if (!merged) continue;
    merged.name = `dynastyOutlets_${k}`;
    merged.material = mats[k];
    merged.receiveShadows = k === "stone";
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  }
  const oldHeight = result.height;
  result.height = (x, z) => {
    if (Math.abs(z - OUTLET.bridgeZ) < 2.5) for (const xs of OUTLETS) if (Math.abs(x - xs) < 4.5) return Math.max(deckY(x, xs), oldHeight?.(x, z) ?? 0);
    return oldHeight?.(x, z) ?? 0;
  };
}

// The pagoda's two side bridges (594, spec at PAGODA): z 7 .. 18.2 at x +-12.5.
function sideBridges(scene: Scene, result: MapBuildResult): void {
  const stone = new StandardMaterial("dynastySideBridgeStone", scene);
  stone.diffuseColor.set(0.36, 0.4, 0.44); stone.emissiveColor.set(0.1, 0.11, 0.13); stone.specularColor = Color3.Black();
  const Z0 = 7, Z1 = 18.2, LO = 0.97, HI = 2.52, ARCH = 0.8, n = 18, span = Z1 - Z0;
  const deck = (t: number) => LO + (HI - LO) * t + Math.sin(t * Math.PI) * ARCH;
  const parts: Mesh[] = [];
  const box = (w: number, h: number, d: number, x: number, y: number, z: number) => {
    const m = MeshBuilder.CreateBox("dynastySideBridge", { width: w, height: h, depth: d }, scene);
    m.position.set(x, y, z);
    parts.push(m);
  };
  for (const bx of SIDE_BRIDGES) {
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, z = Z0 + t * span, y = deck(t), d = span / n + 0.03;
      box(4.8, 0.35, d, bx, y - 0.175, z);
      for (const s of [-1, 1]) box(0.3, 0.7, d, bx + s * 2.35, y + 0.3, z);
      // arched body: solid at the ends, an opening under the middle over the water
      const u = (z - 8.2) / 8.2;
      const bottom = u > 0 && u < 1 ? 0.1 + Math.sin(u * Math.PI) * Math.min(1.9, y - 0.6) : 0;
      if (y - 0.35 - bottom > 0.05) box(4.2, y - 0.35 - bottom, d, bx, bottom + (y - 0.35 - bottom) / 2, z);
    }
  }
  const merged = Mesh.MergeMeshes(parts, true);
  if (merged) {
    merged.name = "dynastySideBridges";
    merged.material = stone;
    merged.receiveShadows = true;
    merged.isPickable = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(merged);
  }
  const oldHeight = result.height;
  result.height = (x, z) => {
    if (z >= Z0 && z <= Z1 && SIDE_BRIDGES.some((bx) => Math.abs(x - bx) < 2.4)) return deck((z - Z0) / span);
    return oldHeight?.(x, z) ?? 0;
  };
}

// Dynasty placement reference: blue-grey faceted columns form a continuous
// vertical island edge, with irregular green ledges; no hanging stalactites.
function columnCliffs(scene: Scene, built: Set<unknown>): void {
  for(const m of scene.meshes)if(built.has(m)&&/^(islandUnder|islandShelf|islandCliff)/.test(m.name))m.setEnabled(false);
  // Boulder cliffs (596, blocker a4; reference/maps/dynasty.png: the island's sides are heaped, lumpy grey-blue boulders of
  // unequal size, some tall and blocky, others rounded, with bright green moss lying on their ledges, the mass bulging under
  // the corners and tapering below; not a palisade of equal saturated-blue five-sided columns). Spec: along the same edge
  // (square with chamfered corners and the front-left notch) three courses of faceted icosphere boulders: course c (0..2)
  // with tops at -0.2 - 5.5c m, inset 0.8 + 3.5c m, every 3.2 m (course 2 every 4.5 m), radius 2.2-3.8 m shrinking 15% a
  // course, stretched 1.1-1.7 tall and 0.8-1.2 across with a seeded yaw, so the faces read as blocky irregular crags; at the
  // chamfered corners a 4th course 21 m down. Grey-blue (.42,.52,.58) self .4 (it faces away from the sun), no shadows
  // received. Moss: on every second top-course boulder and every fourth lower one a flattened green ball on its top ledge
  // (the lawn material). The cliff still opens round each waterfall (|x - outlet| < 2.6 + 0.8 r on the front face).
  const stone=new StandardMaterial("dynastyCliffBoulder",scene);
  // 597 [R] blocker a4: teal grey-blue (the 596 rocks read pale lavender), moss its own brighter green on the outer shoulders
  stone.diffuseColor.set(0.4,0.52,0.58);stone.emissiveColor.set(0.18,0.24,0.27);stone.specularColor=Color3.Black();
  const turf=new StandardMaterial("dynastyCliffMoss",scene);
  turf.diffuseColor.set(0.26,0.52,0.2);turf.emissiveColor.set(0.1,0.2,0.08);turf.specularColor=Color3.Black();
  const rocks: Mesh[]=[],caps: Mesh[]=[];
  const edge=[[-36,-30],[-36,-47],[41,-47],[53,-36],[53,36],[41,47],[-41,47],[-53,36],[-53,-30],[-36,-30]];
  const hash=(i:number,s:number)=>{const v=Math.sin(i*12.9898+s*78.233)*43758.5453;return v-Math.floor(v);};
  let k=0;
  for(let c=0;c<4;c++) {
    const step=c===2?4.5:c===3?6:3.2;
    for(let e=1;e<edge.length;e++) {
      const [ax,az]=edge[e-1],[bx,bz]=edge[e],len=Math.hypot(bx-ax,bz-az),n=Math.max(1,Math.round(len/step));
      const corner=Math.abs(bx-ax)>1&&Math.abs(bz-az)>1;
      if(c===3&&!corner)continue;
      for(let j=0;j<n;j++,k++) {
        const t=(j+0.5+(hash(k,1)-0.5)*0.4)/n,x=ax+(bx-ax)*t,z=az+(bz-az)*t;
        const r=(2.2+hash(k,2)*1.6)*(1-0.15*c)*(corner?1.2:1);
        if(z<-46&&OUTLETS.some((o)=>Math.abs(x-o)<2.6+0.8*r))continue; // 595: the cliff opens round each waterfall
        // inset toward the island's middle
        const inset=0.8+3.5*c, top=-0.2-5.5*c-(c===3?5:0), sy=1.1+hash(k,3)*0.6, rl=Math.hypot(x,z)||1;
        const px=x-(x/rl)*inset, pz=z-(z/rl)*inset;
        const b=MeshBuilder.CreateIcoSphere("dynastyCliffBoulder",{radius:r,subdivisions:1,flat:true},scene);
        b.scaling.set(0.8+hash(k,4)*0.4,sy,0.8+hash(k,5)*0.4);
        b.rotation.set((hash(k,7)-0.5)*0.5,hash(k,6)*6.28,(hash(k,8)-0.5)*0.55);
        b.position.set(px,top-r*sy,pz);
        b.bakeCurrentTransformIntoVertices();
        rocks.push(b);
        if((c===0&&k%2===0)||(c>0&&k%3===0)) {
          // 597: on the boulder's upper outer shoulder, where the island camera sees it (596's sat under the lawn lip)
          const cap=MeshBuilder.CreateIcoSphere("dynastyCliffMoss",{radius:r*0.6,subdivisions:1,flat:true},scene);
          cap.scaling.set(1.1,0.3,1.1);
          cap.rotation.set((z/rl)*0.5,0,-(x/rl)*0.5);
          cap.position.set(px+(x/rl)*r*0.55,top-r*sy*0.35,pz+(z/rl)*r*0.55);
          cap.bakeCurrentTransformIntoVertices();
          caps.push(cap);
        }
      }
    }
  }
  // 599 a4: major overlapping headlands break up the uniform courses. Each
  // is a fan of three unequal, tilted boulders, away from the outlet mouths.
  for(const [anchor,[x,z]]of [[-51,5],[-16,-47],[31,-47],[52,18]].entries())for(let j=0;j<3;j++){
    const r=4.6+hash(anchor*3+j,21)*2.3,rl=Math.hypot(x,z),t=(j-1)*3.4;
    const px=x-z/rl*t,pz=z+x/rl*t,top=-0.8-j*2.5;
    const b=MeshBuilder.CreateIcoSphere("dynastyCliffHeadland",{radius:r,subdivisions:1,flat:true},scene);
    b.scaling.set(1.05,1.25+j*0.12,0.9);b.rotation.set(0.2*(j-1),hash(anchor+j,22)*6.28,0.3*(1-j));
    b.position.set(px,top-r*b.scaling.y,pz);b.bakeCurrentTransformIntoVertices();rocks.push(b);
    const moss=MeshBuilder.CreateIcoSphere("dynastyHeadlandMoss",{radius:r*0.65,subdivisions:1,flat:true},scene);
    moss.scaling.set(1.2,0.25,0.8);moss.position.set(px+x/rl*r*0.45,top-r*0.35,pz+z/rl*r*0.45);moss.bakeCurrentTransformIntoVertices();caps.push(moss);
  }
  for(const [parts,mat,name] of [[rocks,stone,"dynastyBoulderCliffs"],[caps,turf,"dynastyCliffMoss"]] as const) {
    const merged=Mesh.MergeMeshes(parts,true,true);if(!merged)continue;
    merged.material=mat;merged.name=name;merged.convertToFlatShadedMesh();merged.receiveShadows=false;merged.isPickable=false;
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
// Cobble loop (592, blocker a2; wiki dynasty.png: a wide pale-grey cobblestone path, about a man's height and a half across,
// runs right round the field just inside the cherry ring, its corners rounded, its stones irregular rounded cobbles with
// darker joints; the 582 loop was three rows of 0.82 m dark slate flagstones under the trees and never read from the top).
// Spec: the same route pulled ~5 m in from under the ring (corners x 0.88; at x 0.95 the trees still stood on it), rounded by three Chaikin passes, laid as one ribbon
// 5 m wide sampled every ~1 m, each vertex riding the terraces' drawn height (at least 0.22 m) + 8 cm; a 512 px tile per 4 m
// of jittered cobbles ~0.45 m, stone (176,180,182) varied +-12 on joints (112,118,124); uvs in metres along and across.
function perimeterFlagstones(scene: Scene, result: MapBuildResult): void {
  const route=[[-32,-26],[-32,-35],[41,-35],[46,-29],[46,30],[39,35],[-39,35],[-46,29],[-46,-26]].map(([x,z])=>[x*0.88,z*0.88] as [number,number]);
  let pts=route;
  for(let pass=0;pass<3;pass++){
    const next:Array<[number,number]>=[];
    for(let i=0;i<pts.length;i++){const [ax,az]=pts[i],[bx,bz]=pts[(i+1)%pts.length];next.push([ax*.75+bx*.25,az*.75+bz*.25],[ax*.25+bx*.75,az*.25+bz*.75]);}
    pts=next;
  }
  // resample to ~1 m so the ribbon follows the terraces' heights
  const dense:Array<[number,number]>=[];
  for(let i=0;i<pts.length;i++){const [ax,az]=pts[i],[bx,bz]=pts[(i+1)%pts.length],n=Math.max(1,Math.ceil(Math.hypot(bx-ax,bz-az)));for(let k=0;k<n;k++)dense.push([ax+(bx-ax)*k/n,az+(bz-az)*k/n]);}
  dense.push(dense[0]);
  const oldHeight=result.height;
  const pathHeight=(x:number,z:number)=>Math.max(0.22,oldHeight?.(x,z)??0)+0.08;
  const half=2.5,left:Vector3[]=[],right:Vector3[]=[],along:number[]=[];
  let run=0;
  for(let i=0;i<dense.length;i++){
    const [px,pz]=dense[i],[ax,az]=dense[Math.max(0,i-1)],[bx,bz]=dense[Math.min(dense.length-1,i+1)];
    const l=Math.hypot(bx-ax,bz-az)||1,nx=-(bz-az)/l,nz=(bx-ax)/l;
    if(i>0)run+=Math.hypot(px-dense[i-1][0],pz-dense[i-1][1]);
    along.push(run);
    const lx=px+nx*half,lz=pz+nz*half,rx=px-nx*half,rz=pz-nz*half;
    left.push(new Vector3(lx,pathHeight(lx,lz),lz));right.push(new Vector3(rx,pathHeight(rx,rz),rz));
  }
  const ribbon=MeshBuilder.CreateRibbon("dynastyPerimeterLoop",{pathArray:[left,right]},scene);
  const uv:number[]=[];
  for(const v of [0,1])for(let i=0;i<dense.length;i++)uv.push(along[i]/4,v*2*half/4);
  ribbon.setVerticesData("uv",uv);
  if((ribbon.getVerticesData("normal")??[])[1]<0)ribbon.flipFaces(true);
  const px=512,tex=new DynamicTexture("dynastyCobble_tex",{width:px,height:px},scene,true,Texture.TRILINEAR_SAMPLINGMODE);
  const ctx=tex.getContext();
  ctx.fillStyle="rgb(112,118,124)";ctx.fillRect(0,0,px,px);
  let seed=0x3d1a;const rnd=()=>((seed=(seed*1103515245+12345)&0x7fffffff)/0x7fffffff);
  const cell=px/9;
  for(let j=-1;j<=9;j++)for(let i=-1;i<=9;i++){
    const cx=(i+.5+(rnd()-.5)*.35)*cell,cy=(j+.5+(rnd()-.5)*.35)*cell,r=cell*(.4+rnd()*.06),v=Math.round((rnd()-.5)*24);
    ctx.fillStyle=`rgb(${176+v},${180+v},${182+v})`;
    for(const [ox,oy] of [[0,0],[px,0],[-px,0],[0,px],[0,-px]]){ctx.beginPath();ctx.arc(cx+ox,cy+oy,r,0,Math.PI*2);ctx.fill();}
  }
  tex.update(true);tex.wrapU=Texture.WRAP_ADDRESSMODE;tex.wrapV=Texture.WRAP_ADDRESSMODE;tex.anisotropicFilteringLevel=16;
  const mat=new StandardMaterial("dynastyCobble",scene);
  mat.diffuseTexture=tex;mat.diffuseColor=Color3.White();mat.emissiveColor=new Color3(0.16,0.17,0.18);mat.specularColor=Color3.Black();
  ribbon.material=mat;ribbon.receiveShadows=true;ribbon.isPickable=false;
  scene.getGlowLayerByName("glow")?.addExcludedMesh(ribbon);
  clearLoop(scene,result,dense);
}

// Loop clear (593, blocker a2; wiki dynasty.png: the cherry trees stand beside the cobble path, just outside it, never on it).
// Spec: every ring tree (an unparented "trunk", its blossom puffs its children) whose foot lies within 4.6 m of the loop's
// centre line is set back to 4.6 m (the ribbon's 2.5 m half width + 2.1 m), along the line from its nearest loop point
// through the tree, so it keeps its side (a tree on the line goes outward); its collider (centred on the foot) moves with
// it. Trees are moved, none removed.
function clearLoop(scene: Scene, result: MapBuildResult, line: Array<[number,number]>): void {
  const keep=4.6;
  for(const m of scene.meshes){
    if(m.name!=="trunk"||m.parent||!m.isEnabled())continue;
    const p=m.position;
    let best=Infinity,nx=0,nz=0;
    for(let i=0;i<line.length-1;i++){
      const [ax,az]=line[i],[bx,bz]=line[i+1],dx=bx-ax,dz=bz-az,l2=dx*dx+dz*dz||1;
      const t=Math.max(0,Math.min(1,((p.x-ax)*dx+(p.z-az)*dz)/l2)),qx=ax+dx*t,qz=az+dz*t,d=Math.hypot(p.x-qx,p.z-qz);
      if(d<best){best=d;nx=qx;nz=qz;}
    }
    if(best>=keep)continue;
    // from the loop toward the tree (it keeps its side); a tree right on the line goes outward
    let ux=p.x-nx,uz=p.z-nz;const l=Math.hypot(ux,uz);
    if(l<1e-3){const r=Math.hypot(nx,nz)||1;ux=nx/r;uz=nz/r;}else{ux/=l;uz/=l;}
    const tx=nx+ux*keep,tz=nz+uz*keep;
    for(const o of result.obstacles)if(Math.hypot(o.center.x-p.x,o.center.z-p.z)<1){o.center.x+=tx-p.x;o.center.z+=tz-p.z;}
    p.x=tx;p.z=tz;m.computeWorldMatrix(true);
  }
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
    if(ns&&sign>0)continue; // the north approach is the pagoda's stair (594)
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
      if(ns&&z>0)continue;
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
  // 597 [R] blocker a1: soft pale pastel green, not saturated pure green
  turf.diffuseColor.set(0.32,0.55,0.24);turf.emissiveColor.set(0.1,0.165,0.072);turf.specularColor=Color3.Black();
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
const POOL_ARMS: Record<number, Array<[number, number]>> = { 1: [[-19.6, 16], [31, 36.6]], [-1]: [[-36.6, -31], [-3, 19.6]] };
const DRY_BLOCKS: Record<number, Array<[number, number]>> = {
  1: [[-46, -31], [-23, -19.6], [16, 23], [36.6, 46]],
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
  for (const sz of [1, -1]) for (const [a, b] of POOL_ARMS[sz]) {
    // cut out under the side bridges of the pagoda (594)
    const cuts = sz > 0 ? SIDE_BRIDGES.filter((x) => x > a && x < b).sort((p, q) => p - q) : [];
    let lo = a;
    for (const c of [...cuts, Infinity]) {
      const hi = Math.min(b, c - 2.4);
      if (hi > lo) result.hazards.push({ shape: "box", kind: "water", center: new Vector3((lo + hi) / 2, 0, sz * ZC), halfX: (hi - lo) / 2, halfZ });
      lo = c + 2.4;
    }
  }
  const oldHeight = result.height;
  result.height = (x, z) => {
    if (Math.abs(z) > Z0 && Math.abs(z) < Z1 && dry.some((d) => Math.sign(z) === d.sz && x > d.a && x < d.b)) return H + 0.12;
    return oldHeight?.(x, z) ?? 0;
  };
}
