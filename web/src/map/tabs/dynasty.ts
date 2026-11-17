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

export function buildDynasty(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const restoreSky = mintSky(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));
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
  obstacles.push({ type: "box", center: new Vector3(PAGODA.x, 0, PAGODA.z - 1.4), halfX: 8.5, halfZ: 9.9 });
  return { ...result, obstacles, dispose: () => { restoreSky(); result.dispose?.(); } };
}
