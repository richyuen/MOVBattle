// TABS "Spooky 1" (spooky map): Medieval 1's two plateaus at night, the river a fog chasm, a graveyard on the right plateau
// (reference/maps/wiki/spooky_1.png, reference/maps/spooky_1.png; card loop/cards/maps/spooky_1.md). Built on campaign.spooky, which
// Spooky 2 shares: dress its build here only.
//
// Night sky (576, spooky_1.png and the wiki shot: the island hangs in a deep navy night, no clouds and no mountain range, a pale moon
// up in the sky and stars, the light a dim cold blue from above). Spec: clear and fog colour navy (0.035, 0.05, 0.13); the base's
// mountain* range and clouds hidden; the hemispheric light at 0.3 with a blue sky (0.42, 0.52, 1.1) and dark ground (0.1, 0.1, 0.25),
// the directional moonlight 0.65 pale blue from the front left; a moon 14 m across at 175 m high in the back left with a faint halo; 300
// star specks on a 170-200 m dome; all unlit, out of fog and glow. The lights are put back on dispose (a build does not reset them).
import { Color3, Mesh, MeshBuilder, StandardMaterial, type DirectionalLight, type HemisphericLight, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const NIGHT = new Color3(0.035, 0.05, 0.13);

function nightSky(scene: Scene, built: Set<unknown>): () => void {
  scene.clearColor.set(NIGHT.r, NIGHT.g, NIGHT.b, 1);
  scene.fogColor = NIGHT.clone();
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && (mesh.name.startsWith("mountain") || mesh.name.startsWith("cloud"))) mesh.setEnabled(false);
  }
  const hemi = scene.getLightByName("hemi") as HemisphericLight | null;
  const dir = scene.getLightByName("dir") as DirectionalLight | null;
  const saved = {
    hemi: hemi ? [hemi.intensity, hemi.diffuse.clone(), hemi.groundColor.clone()] as const : null,
    dir: dir ? [dir.intensity, dir.diffuse.clone(), dir.direction.clone()] as const : null,
  };
  if (hemi) {
    hemi.intensity = 0.3;
    hemi.diffuse = new Color3(0.42, 0.52, 1.1);
    hemi.groundColor = new Color3(0.1, 0.1, 0.25);
  }
  if (dir) {
    dir.intensity = 0.65;
    dir.diffuse = new Color3(0.58, 0.68, 1.1);
    dir.direction.set(0.55, -0.62, 0.5);
  }
  const glow = scene.getGlowLayerByName("glow");
  const unlit = (name: string, c: Color3, alpha = 1) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.Black();
    m.emissiveColor = c;
    m.specularColor = Color3.Black();
    m.disableLighting = true;
    m.alpha = alpha;
    return m;
  };
  const finish = (mesh: Mesh, mat: StandardMaterial) => {
    mesh.material = mat;
    mesh.applyFog = false;
    mesh.isPickable = false;
    glow?.addExcludedMesh(mesh);
  };
  const stars: Mesh[] = [];
  for (let i = 0; i < 300; i++) {
    const a = seeded(i, 61) * Math.PI * 2, up = 0.08 + seeded(i, 62) * 1.35, r = 170 + seeded(i, 63) * 30;
    const s = MeshBuilder.CreateIcoSphere("spooky1Star", { radius: 0.3 + seeded(i, 64) * 0.45, subdivisions: 1 }, scene);
    s.position.set(Math.cos(a) * Math.cos(up) * r, Math.sin(up) * r - 10, Math.sin(a) * Math.cos(up) * r);
    stars.push(s);
  }
  const starMesh = Mesh.MergeMeshes(stars, true);
  if (starMesh) {
    starMesh.name = "spooky1Stars";
    finish(starMesh, unlit("spooky1Stars", new Color3(0.9, 0.92, 1)));
  }
  const moonAt = { x: -70, y: 120, z: 150 };
  const moon = MeshBuilder.CreateSphere("spooky1Moon", { diameter: 14, segments: 16 }, scene);
  moon.position.set(moonAt.x, moonAt.y, moonAt.z);
  finish(moon, unlit("spooky1Moon", new Color3(0.95, 0.93, 0.82)));
  const halo = MeshBuilder.CreateSphere("spooky1MoonHalo", { diameter: 26, segments: 12 }, scene);
  halo.position.set(moonAt.x, moonAt.y, moonAt.z + 4);
  finish(halo, unlit("spooky1MoonHalo", new Color3(0.35, 0.42, 0.7), 0.25));
  return () => {
    if (hemi && saved.hemi) [hemi.intensity, hemi.diffuse, hemi.groundColor] = [saved.hemi[0], saved.hemi[1], saved.hemi[2]];
    if (dir && saved.dir) [dir.intensity, dir.diffuse, dir.direction] = [saved.dir[0], saved.dir[1], saved.dir[2]];
  };
}

// Night grass (577, wiki spooky_1.png: the grass is a dark navy-grey under the blue night, its tufts a shade lighter where
// the moon catches them; no red or blue tint across the two halves). Spec: the translucent team-zone slabs
// (campaign_zone_overlay_* / border_*, the maroon and blue sheets reaching past the island) hidden; the floor ("ground",
// "centerGrass") navy-grey (0.2, 0.24, 0.38) with a cold self-light (0.05, 0.06, 0.11); the base's grass blades and tufts
// recoloured a lighter blue-grey (0.26, 0.31, 0.46), self-lit (0.06, 0.07, 0.12), so they read in the dark.
function nightGrass(scene: Scene, built: Set<unknown>): void {
  const floor = new StandardMaterial("spooky1NightFloor", scene);
  floor.diffuseColor = new Color3(0.2, 0.24, 0.38);
  floor.emissiveColor = new Color3(0.05, 0.06, 0.11);
  floor.specularColor = Color3.Black();
  const blades = new StandardMaterial("spooky1NightBlades", scene);
  blades.diffuseColor = new Color3(0.26, 0.31, 0.46);
  blades.emissiveColor = new Color3(0.06, 0.07, 0.12);
  blades.specularColor = Color3.Black();
  blades.backFaceCulling = false;
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (/^campaign_zone_(overlay|border)_/.test(mesh.name)) mesh.setEnabled(false);
    else if (mesh.name === "ground" || mesh.name === "centerGrass") mesh.material = floor;
    else if (/^(fieldBlades_|fieldTufts_|grassTuft)/.test(mesh.name)) mesh.material = blades;
  }
}

export function buildSpooky1(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  nightGrass(scene, built);
  const restore = nightSky(scene, built);
  return { ...result, dispose: () => { restore(); result.dispose?.(); } };
}
