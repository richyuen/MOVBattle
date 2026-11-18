// TABS "Legacy" (legacy map): a round yellow-green glade in a valley, closed in by dense dark pine forest under snowy mountains, a spired
// stone church at the back with its graveyard, tent camps at both ends (reference/maps/wiki/legacy.png, reference/maps/legacy.png; card
// loop/cards/maps/legacy.md). Built on campaign.legacy (base(); never edit the base, dress its build here).
//
// Pine forest (576, wiki legacy.png and legacy.the_war.png: the glade is walled in by a dense band of tall dark-green conifers, no round
// leafy trees). Spec: every base ring tree (an unparented "trunk" with its crown as children) goes, its collider kept; in its place a pine
// 9-14 m tall, a short brown trunk under four stacked seven-sided cones, dark green (0.1, 0.27, 0.12) with a lighter tier
// (0.15, 0.35, 0.15) every other cone; beside each, two more pines 1.8-3.8 m along the ring and up to 2.5 m in or 1 m out (drawn
// only) so the band reads dense; all merged
// per material, in the glow pass (dark solids), receiving shadows.
import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function pineForest(scene: Scene, built: Set<unknown>): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    dark: mk("legacyPineDark", new Color3(0.1, 0.27, 0.12), 0.3),
    light: mk("legacyPineLight", new Color3(0.15, 0.35, 0.15), 0.3),
    bark: mk("legacyPineBark", new Color3(0.36, 0.24, 0.15), 0.3),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { dark: [], light: [], bark: [] };
  const spots: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || mesh.name !== "trunk" || mesh.parent || !mesh.isEnabled()) continue;
    spots.push([mesh.position.x, mesh.position.z]);
    mesh.setEnabled(false);
  }
  let k = 0;
  const pine = (x: number, z: number) => {
    k++;
    // The ruined building occupies a clearing in the right forest belt.
    if(x>28&&x<51&&z>19&&z<42) return;
    const tall = 9 + seeded(k, 21) * 5, wide = tall * (0.36 + seeded(k, 22) * 0.06);
    const trunk = MeshBuilder.CreateCylinder("legacyPineTrunk", { height: tall * 0.2, diameter: wide * 0.14, tessellation: 6 }, scene);
    trunk.position.set(x, tall * 0.1, z);
    parts.bark.push(trunk);
    for (let t = 0; t < 4; t++) {
      const f = 1 - t * 0.2;
      const h = tall * 0.34 * (0.85 + t * 0.05);
      const cone = MeshBuilder.CreateCylinder("legacyPineCone", { height: h, diameterBottom: wide * f, diameterTop: wide * f * 0.08, tessellation: 7 }, scene);
      cone.rotation.y = seeded(k * 4 + t, 23) * 6.28;
      cone.position.set(x, tall * 0.15 + t * tall * 0.19 + h / 2, z);
      parts[t % 2 ? "light" : "dark"].push(cone);
    }
  };
  for (const [x, z] of spots) {
    pine(x, z);
    const out = Math.hypot(x, z) || 1;
    for (let j = 0; j < 2; j++) {
      // along the ring and a little in or out (never far out: the ring stands near the rim)
      const d = -2.5 + seeded(k, 31 + j) * 3.5, side = (j ? 1 : -1) * (1.8 + seeded(k, 33 + j) * 2);
      pine(x + (x / out) * d - (z / out) * side, z + (z / out) * d + (x / out) * side);
    }
  }
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `legacyPines_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

// Meadow (577, legacy.the_war.png and the wiki shot: the glade is a bright yellow-green meadow of tall soft grass,
// shin-high, in lighter and darker swathes; no lilac floor and no red or blue tint across the halves). Spec: the base
// floor ("ground", "centerGrass") recoloured (0.56, 0.64, 0.2), barely self-lit; the base's blades and tufts hidden; the
// translucent team-zone slabs (campaign_zone_overlay_* / border_*) hidden; tall faceted grass clumps 0.8-1.4 m across and
// 0.35-0.6 m high on a 1.1 m jittered grid inside the rim (superellipse 52 x 46, power 3), two yellow-greens (0.62, 0.72,
// 0.2) and (0.48, 0.6, 0.15) chosen in broad swathes by a slow sine field; thin instances, receiving shadows.
function meadow(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (/^(fieldBlades_|fieldTufts_|grassTuft|campaign_zone_overlay_|campaign_zone_border_)/.test(mesh.name)) mesh.setEnabled(false);
    if ((mesh.name === "ground" || mesh.name === "centerGrass") && mesh.material instanceof StandardMaterial) {
      mesh.material.diffuseColor.set(0.56, 0.64, 0.2);
      mesh.material.emissiveColor.set(0.08, 0.09, 0.03);
    }
  }
  const clump = (name: string, colour: Color3) => {
    const mesh = MeshBuilder.CreateIcoSphere(name, { radius: 0.5, subdivisions: 1, flat: true }, scene);
    const mat = new StandardMaterial(name, scene);
    mat.diffuseColor = colour;
    mat.emissiveColor = colour.scale(0.24);
    mat.specularColor = Color3.Black();
    mesh.material = mat;
    mesh.isPickable = false;
    mesh.receiveShadows = true;
    return { mesh, m: [] as number[] };
  };
  const grass = [clump("legacyMeadowLight", new Color3(0.62, 0.72, 0.2)), clump("legacyMeadowDark", new Color3(0.48, 0.6, 0.15))];
  let i = 0;
  for (let z = -46; z < 46; z += 1.1) {
    for (let x = -52; x < 52; x += 1.1) {
      i += 1;
      const jx = seeded(i, 41), jz = seeded(i, 43);
      const px = x + (jx - 0.5) * 0.9, pz = z + (jz - 0.5) * 0.9;
      if (Math.abs(px / 52) ** 3 + Math.abs(pz / 46) ** 3 > 1) continue;
      const swathe = Math.sin(px * 0.08 + 0.7) * Math.cos(pz * 0.11 + 1.9) + Math.sin((px - pz) * 0.05) * 0.6;
      const w = 0.35 + jx * 0.25, h = 0.7 + jz * 0.4;
      const at = new Vector3(px, h * 0.35, pz);
      grass[swathe + jz * 0.4 > 0.4 ? 1 : 0].m.push(...Matrix.Compose(new Vector3(w, h, w * (0.8 + jz * 0.3)), Quaternion.RotationAxis(Vector3.Up(), jx * 6.28), at).m);
    }
  }
  for (const { mesh, m } of grass) mesh.thinInstanceSetBuffer("matrix", new Float32Array(m), 16);
}

// Church (578, legacy.png: at the back of the glade stands the dark grey stone church of St. Wobbly Horse: a long nave under a
// steep dark slate gable roof, a side transept, and at its left end a tall square tower with belfry openings under a very steep
// pointed spire, the highest thing in the glade). Spec: the base church (a dark box at (-20, 20) with its side cylinder) goes with
// its colliders; the new one at the back centre: nave x -4..10, z 28.5..35.5, walls 6 m, a gable roof 4.5 m high overhanging 0.5
// m; a transept 5 x 10 m across the nave at x 5 with its own gable; the tower 4.4 m square at x -6.5, 14 m to its parapet, belfry
// slits, a four-sided spire 9 m; pointed dark windows along the nave. Stone (0.24, 0.24, 0.28) and slate (0.13, 0.14, 0.19),
// self-lit 0.35, in the glow pass (dark solids). One box collider for nave and tower, one for the transept.
function church(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const old = (x: number, z: number) => Math.abs(z - 20) < 0.5 && x > -23.5 && x < -19.5;
  const gone: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && !mesh.parent && /^Legacy Parade Grounds_(box|cyl)$/.test(mesh.name) && old(mesh.position.x, mesh.position.z)) {
      gone.push(mesh.position.clone());
      mesh.setEnabled(false);
    }
  }
  result.obstacles = result.obstacles.filter(({ center }) => !gone.some((p) => Math.hypot(center.x - p.x, center.z - p.z) < 0.6));
  const mk = (name: string, c: Color3) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(0.35);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = { stone: mk("legacyChurchStone", new Color3(0.24, 0.24, 0.28)), slate: mk("legacyChurchSlate", new Color3(0.13, 0.14, 0.19)), dark: mk("legacyChurchDark", new Color3(0.05, 0.05, 0.07)) };
  const parts: Record<keyof typeof mats, Mesh[]> = { stone: [], slate: [], dark: [] };
  const box = (k: keyof typeof mats, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("legacyChurchPart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    parts[k].push(b);
  };
  // A gable roof with its ridge along x (or along z): two slate slabs leaning together over the span
  const gable = (len: number, span: number, h: number, x: number, y: number, z: number, alongZ: boolean) => {
    const slope = Math.hypot(span / 2, h), tilt = Math.atan2(h, span / 2);
    for (const s of [-1, 1]) {
      const slab = MeshBuilder.CreateBox("legacyChurchRoof", { width: alongZ ? slope : len, height: 0.35, depth: alongZ ? len : slope }, scene);
      if (alongZ) slab.rotation.z = -s * tilt;
      else slab.rotation.x = s * tilt;
      slab.position.set(x + (alongZ ? s * span / 4 : 0), y + h / 2, z + (alongZ ? 0 : s * span / 4));
      parts.slate.push(slab);
    }
  };
  const Z = 32;
  box("stone", 14, 6, 7, 3, 3, Z);
  gable(15, 8, 4.5, 3, 6, Z, false);
  box("stone", 5, 6, 10, 5, 3, Z);
  gable(11, 6, 4.5, 5, 6, Z, true);
  for (let i = 0; i < 4; i++) box("dark", 0.9, 2.6, 0.2, -2 + i * 3.4, 3.4, Z - 3.55);
  box("dark", 1.8, 3.2, 0.2, 5, 1.6, Z - 5.05);
  box("stone", 4.4, 14, 4.4, -6.5, 7, Z);
  box("stone", 5, 0.6, 5, -6.5, 14.2, Z);
  for (const [dx, dz] of [[0, -2.25], [0, 2.25], [-2.25, 0], [2.25, 0]]) box("dark", dx ? 0.2 : 1, 2.4, dz ? 0.2 : 1, -6.5 + dx, 11.6, Z + dz);
  box("dark", 1.6, 2.8, 0.2, -6.5, 1.4, Z - 2.25);
  const spire = MeshBuilder.CreateCylinder("legacyChurchSpire", { height: 9, diameterBottom: 4.6 * Math.SQRT2, diameterTop: 0.05, tessellation: 4 }, scene);
  spire.rotation.y = Math.PI / 4;
  spire.position.set(-6.5, 14.5 + 4.5, Z);
  parts.slate.push(spire);
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `legacyChurch_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  result.obstacles.push({ type: "box", center: new Vector3(1.5, 0, Z), halfX: 9.5, halfZ: 3.6 });
  result.obstacles.push({ type: "box", center: new Vector3(5, 0, Z), halfX: 2.6, halfZ: 5.1 });
}

// Open glade (578,the wiki shot and legacy.the_war.png: the meadow between the two armies is open grass with only small
// scattered boulders; nothing stands across the middle). Spec: the base's dark barricade box at (22, 0) and its collider go.
function openGlade(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const atBar = (x: number, z: number) => Math.hypot(x - 22, z) < 0.5;
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && mesh.name === "Legacy Parade Grounds_box" && atBar(mesh.position.x, mesh.position.z)) mesh.setEnabled(false);
  }
  result.obstacles = result.obstacles.filter(({ center }) => !atBar(center.x, center.z));
}

// Small ridge-tent camps inside the pine band: blue on the left, red on the right, six tents per side.
function tentCamps(scene: Scene): void {
  const pole=new StandardMaterial("legacyTentPole",scene);
  pole.diffuseColor.set(0.23,0.15,0.08);pole.emissiveColor.set(0.05,0.03,0.01);
  for(const side of [-1,1]) {
    const cloth=new StandardMaterial(side<0?"legacyBlueCamp":"legacyRedCamp",scene);
    cloth.diffuseColor=side<0?new Color3(0.035,0.16,0.4):new Color3(0.5,0.045,0.025);
    cloth.emissiveColor=cloth.diffuseColor.scale(0.35);cloth.specularColor=Color3.Black();
    const dark=new StandardMaterial("legacyTentOpening",scene);
    dark.diffuseColor.set(0.025,0.025,0.03);
    for(let i=0;i<6;i++) {
      const x=side*(35+(i%2)*6), z=-14+Math.floor(i/2)*10;
      const root=new Mesh("legacyCampTent",scene);root.position.set(x,0,z);root.rotation.y=side*0.25+(i%2)*0.3;
      for(const s of [-1,1]) {
        const roof=MeshBuilder.CreateBox("legacyTentCanvas",{width:2.5,height:0.09,depth:3.8},scene);
        roof.parent=root;roof.position.set(s*0.8,1.05,0);roof.rotation.z=-s*0.87;roof.material=cloth;
      }
      const back=MeshBuilder.CreateCylinder("legacyTentBack",{height:0.1,diameter:3.7,tessellation:3},scene);
      back.parent=root;back.rotation.x=Math.PI/2;back.rotation.y=Math.PI;back.scaling.y=0.85;back.position.set(0,0.87,1.8);back.material=cloth;
      const opening=MeshBuilder.CreateBox("legacyTentInterior",{width:2.5,height:1.6,depth:0.08},scene);
      opening.parent=root;opening.position.set(0,0.8,1.65);opening.material=dark;
      const mast=MeshBuilder.CreateCylinder("legacyTentFrontPole",{height:2.05,diameter:0.09,tessellation:5},scene);
      mast.parent=root;mast.position.set(0,1.02,-1.8);mast.material=pole;
    }
  }
}

// Churchyard: irregular headstone ranks flank both sides of the nave, connected by a sandy winding approach.
function churchyard(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const stone=new StandardMaterial("legacyHeadstone",scene);
  stone.diffuseColor.set(0.38,0.39,0.37);stone.emissiveColor.set(0.1,0.1,0.09);stone.specularColor=Color3.Black();
  const sand=new StandardMaterial("legacyChurchPath",scene);
  sand.diffuseColor.set(0.56,0.45,0.25);sand.emissiveColor.set(0.1,0.08,0.04);sand.specularColor=Color3.Black();
  const gone:Vector3[]=[];
  for(const m of scene.meshes) if(built.has(m)&&!m.parent&&Math.hypot(m.position.x,m.position.z-24)<1&&/Legacy Parade Grounds_/.test(m.name)) {
    gone.push(m.position.clone());m.setEnabled(false);
  }
  result.obstacles=result.obstacles.filter(o=>!gone.some(p=>Vector3.Distance(p,o.center)<0.6));
  for(const side of [-1,1]) for(let row=0;row<3;row++) for(let col=0;col<5;col++) {
    const x=side*(13+col*2.8),z=24+row*4;
    const h=1+seeded(row*5+col,101)*0.65;
    const slab=MeshBuilder.CreateBox("legacyChurchHeadstone",{width:0.85,height:h,depth:0.32},scene);
    slab.position.set(x,h/2,z);slab.rotation.z=(seeded(col+row*5,102)-0.5)*0.18;slab.material=stone;
    const top=MeshBuilder.CreateCylinder("legacyHeadstoneRound",{height:0.33,diameter:0.85,tessellation:8},scene);
    top.rotation.x=Math.PI/2;top.position.set(x,h,z);top.material=stone;
  }
  const path=[[-3,6],[-6,12],[-3,18],[5,22],[5,26.8]];
  for(let i=1;i<path.length;i++) {
    const [ax,az]=path[i-1],[bx,bz]=path[i];
    const m=MeshBuilder.CreateBox("legacyWindingChurchPath",{width:2.4,height:0.06,depth:Math.hypot(bx-ax,bz-az)+1},scene);
    m.position.set((ax+bx)/2,0.045,(az+bz)/2);m.rotation.y=Math.atan2(bx-ax,bz-az);m.material=sand;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(m);
  }
}

// Right-hand sandstone ruin: broken wall teeth, open doorway and windows, fallen masonry and bare trees.
function sandstoneRuin(scene: Scene, result: MapBuildResult): void {
  result.obstacles=result.obstacles.filter(o=>!(o.center.x>28&&o.center.x<51&&o.center.z>19&&o.center.z<42));
  const stone=new StandardMaterial("legacyRuinSandstone",scene);
  stone.diffuseColor.set(0.52,0.43,0.28);stone.emissiveColor.set(0.16,0.13,0.08);
  const bark=new StandardMaterial("legacyRuinDeadwood",scene);bark.diffuseColor.set(0.08,0.075,0.06);
  const box=(w:number,h:number,d:number,x:number,y:number,z:number)=>{
    const m=MeshBuilder.CreateBox("legacyRuinWall",{width:w,height:h,depth:d},scene);m.position.set(x,y,z);m.material=stone;return m;
  };
  for(let i=0;i<7;i++) {
    const x=33+i*1.5,h=4+seeded(i,211)*4;
    if(i===3) {box(1.5,1.1,0.8,x,5.8,32);continue;}
    box(1.5,h,0.8,x,h/2,32);
    if(i%2===0) box(0.7,0.7,0.85,x,h+0.35,32);
  }
  for(let i=0;i<5;i++) box(0.8,2.2+i*0.5,1.5,33,1.1+i*0.25,25+i*1.5);
  for(let i=0;i<15;i++) {const m=box(0.8,0.6,1.2,32+seeded(i,212)*13,0.3,23+seeded(i,213)*12);m.rotation.y=i;}
  for(const [x,z] of [[31,27],[46,32],[41,36]]) for(let i=0;i<4;i++) {
    const m=MeshBuilder.CreateCylinder("legacyRuinDeadTree",{height:i?3.2:6,diameterBottom:i?0.24:0.5,diameterTop:0.08,tessellation:5},scene);
    m.position.set(x+(i?Math.cos(i*2)*0.7:0),i?4.3:3,z+(i?Math.sin(i*2)*0.7:0));
    m.rotation.z=i?Math.cos(i*2)*0.8:0;m.rotation.x=i?Math.sin(i*2)*0.8:0;m.material=bark;
  }
  result.obstacles.push({type:"box",center:new Vector3(38,0,32),halfX:5.8,halfZ:0.5});
  result.obstacles.push({type:"box",center:new Vector3(33,0,28),halfX:0.5,halfZ:4});
}

// Overlapping faceted valley walls rise directly from the outer forest, capped with angular snow.
function snowMountains(scene: Scene, built: Set<unknown>): void {
  for(const m of scene.meshes) if(built.has(m)&&m.name.startsWith("mountain")) m.setEnabled(false);
  const rock=new StandardMaterial("legacyValleyRock",scene);
  rock.diffuseColor.set(0.24,0.3,0.31);rock.emissiveColor.set(0.12,0.15,0.16);
  const snow=new StandardMaterial("legacyPeakSnow",scene);
  snow.diffuseColor.set(0.8,0.87,0.9);snow.emissiveColor.set(0.4,0.44,0.47);
  for(let i=0;i<22;i++) {
    const a=i/22*Math.PI*2, h=27+seeded(i,201)*22, r=98+seeded(i,202)*12;
    const root=MeshBuilder.CreateCylinder("legacyValleyMountain",{height:h,diameterBottom:61,diameterTop:3,tessellation:5},scene);
    root.position.set(Math.cos(a)*r,h/2-1,Math.sin(a)*r);root.rotation.y=a;root.material=rock;root.convertToFlatShadedMesh();
    const cap=MeshBuilder.CreateCylinder("legacySnowSummit",{height:h*0.28,diameterBottom:19.3,diameterTop:3,tessellation:5},scene);
    cap.position.set(root.position.x,h*0.86-0.9,root.position.z);cap.rotation.y=a;cap.material=snow;cap.convertToFlatShadedMesh();
  }
}

// The glade continues into a valley floor beyond its pine belt; no exposed floating island sides.
function valleyFloor(scene: Scene, built: Set<unknown>): void {
  for(const m of scene.meshes) if(built.has(m)&&/^(islandUnder|islandShelf|islandCliff)/.test(m.name)) m.setEnabled(false);
  const mat=new StandardMaterial("legacyValleyGround",scene);
  mat.diffuseColor.set(0.4,0.46,0.19);mat.emissiveColor.set(0.13,0.15,0.05);mat.specularColor=Color3.Black();
  const ground=MeshBuilder.CreateCylinder("legacyValleyFloor",{height:12,diameter:290,tessellation:40},scene);
  ground.position.y=-6.25;ground.material=mat;ground.convertToFlatShadedMesh();
}

export function buildLegacy(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  openGlade(scene, built, result);

  pineForest(scene, built);
  meadow(scene, built);
  church(scene, built, result);
  churchyard(scene,built,result);
  tentCamps(scene);
  valleyFloor(scene,built);
  snowMountains(scene,built);
  sandstoneRuin(scene,result);
  const restoreSky = paleBlueSky(scene);
  return {...result, dispose: () => { restoreSky(); result.dispose?.(); }};
}

// Clear pale blue above the snowy valley, as in legacy.a_tank; no grey-white sky dome.
function paleBlueSky(scene: Scene): () => void {
  const clear = scene.clearColor.clone(), fog = scene.fogColor.clone();
  scene.clearColor.set(0.52, 0.77, 0.88, 1);
  scene.fogColor.set(0.67, 0.82, 0.88);
  return () => {scene.clearColor.copyFrom(clear); scene.fogColor.copyFrom(fog);};
}
