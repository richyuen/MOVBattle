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
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene, type HemisphericLight, type DirectionalLight } from "@babylonjs/core";
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
  // Outer loop path, stepping in round the notch
  const loop: Array<[number, number]> = [[-44, -38], [44, -38], [44, 26], [32, 26], [32, 38], [-44, 38], [-44, -38]];
  for (let i = 1; i < loop.length; i++) {
    const [ax, az] = loop[i - 1], [bx, bz] = loop[i];
    const len = Math.hypot(bx - ax, bz - az) + 3.5;
    box("path", ax === bx ? 3.5 : len, 0.08, ax === bx ? len : 3.5, (ax + bx) / 2, 0.04, (az + bz) / 2);
  }
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

// Nine-metre square courtyard with a sealed luminous iron grate; four stairs meet the fog banks.
function gratedCourt(scene: Scene): void {
  const stone=new StandardMaterial("spooky2CourtStone",scene);
  stone.diffuseColor.set(0.19,0.23,0.34);stone.emissiveColor.set(0.055,0.065,0.11);stone.specularColor=Color3.Black();
  const iron=new StandardMaterial("spooky2GrateIron",scene);
  iron.diffuseColor.set(0.035,0.04,0.06);iron.emissiveColor.set(0.012,0.014,0.025);
  const fire=new StandardMaterial("spooky2GrateLight",scene);
  fire.diffuseColor=Color3.Black();fire.emissiveColor.set(0.75,0.27,0.055);fire.disableLighting=true;
  const parts:Mesh[]=[];
  const box=(w:number,h:number,d:number,x:number,y:number,z:number,mat:StandardMaterial)=>{
    const m=MeshBuilder.CreateBox("spooky2CourtPart",{width:w,height:h,depth:d},scene);
    m.position.set(x,y,z);m.material=mat;m.isPickable=false;
    if(mat===stone) parts.push(m);
    return m;
  };
  for(const s of [-1,1]) {
    box(14,0.6,3.5,0,0.3,s*5.25,stone);box(3.5,0.6,7,s*5.25,0.3,0,stone);
    box(7.6,0.3,0.35,0,0.75,s*3.65,stone);box(0.35,0.3,7.6,s*3.65,0.75,0,stone);
    for(let i=0;i<4;i++) {
      box(4.8,0.15*(4-i),0.8,0,0.075*(4-i),s*(7.4+i*0.8),stone);
      box(0.8,0.15*(4-i),4.8,s*(7.4+i*0.8),0.075*(4-i),0,stone);
    }
  }
  box(7,0.08,7,0,0.39,0,fire);
  for(let i=-7;i<=7;i++) {
    box(0.15,0.2,7,i*0.48,0.58,0,iron);
    box(7,0.2,0.15,0,0.59,i*0.48,iron);
  }
  const merged=Mesh.MergeMeshes(parts,true);
  if(merged) {merged.material=stone;merged.name="spooky2CourtStonework";merged.receiveShadows=true;}
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
  gratedCourt(scene);
  nightTurf(scene,new Set<unknown>(scene.meshes.filter((m)=>!prior.has(m))));
  const restore=nightSky(scene,new Set<unknown>(scene.meshes.filter((m)=>!prior.has(m))));
  return {...result,dispose:()=>{restore();result.dispose?.();}};
}
