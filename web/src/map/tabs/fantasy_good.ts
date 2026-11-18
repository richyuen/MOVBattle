// TABS "Fantasy Good" (Heaven, fantasy map): a rectangular deck of white marble paving trimmed in gold, sunk with four planted
// pits, guarded by two white-and-gold gate towers with waterfalls, floating in a pale sky among cloud banks
// (reference/maps/wiki/fantasy_good.png, reference/maps/heaven_good.png; card loop/cards/maps/fantasy_good.md). Built on
// campaign.fantasy_good (base()), dressed here only.
//
// Marble deck (591, blocker a1; wiki fantasy_good.png: the whole field is paved with white marble slabs laid in running bond,
// the seams a pale blue-grey, here and there a pale teal tile; every edge of the deck carries a gold-yellow kerb). Spec: the
// base lawn ("ground", "centerGrass") and its grass (fieldBlades_*, grassTuft) are hidden; a 104 x 80 m slab (x +-52, z +-40),
// top at 0, 4 m deep, is laid in their place, its top textured with a 512 px tile per 4 x 4 m: 1 x 0.5 m pavers in running bond,
// white (236,240,244) varied by +-3 levels, 3 px seams (196,208,220), one pavers in ~14 a pale teal (176,222,226); its sides
// plain white stone. A gold kerb 0.7 m wide, 0.35 m high runs round the deck's top edge, gold (.78,.62,.1) lit with a warm
// self-light (.22,.17,.02). The deck's corners overhang the base island's oval (drawn only; the base's hazards are unchanged).
import { Color3, DynamicTexture, Mesh, MeshBuilder, StandardMaterial, Texture, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const DECK = { x: 52, z: 40, depth: 4, tileM: 4, tilePx: 512, kerbW: 0.7, kerbH: 0.35 };

function marbleMaterial(scene: Scene): StandardMaterial {
  const px = DECK.tilePx, perM = px / DECK.tileM;
  const tex = new DynamicTexture("heavenMarble_tex", { width: px, height: px }, scene, true, Texture.TRILINEAR_SAMPLINGMODE);
  const ctx = tex.getContext();
  ctx.fillStyle = "rgb(196,208,220)";
  ctx.fillRect(0, 0, px, px);
  let seed = 0x2b3f;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const w = perM, h = perM / 2, seam = 3;
  for (let row = 0; row < DECK.tileM * 2; row++) {
    const shift = row % 2 ? w / 2 : 0;
    for (let i = -1; i < DECK.tileM + 1; i++) {
      const teal = rnd() < 0.07;
      const v = Math.round((rnd() - 0.5) * 6);
      ctx.fillStyle = teal ? "rgb(176,222,226)" : `rgb(${236 + v},${240 + v},${244 + v})`;
      ctx.fillRect(Math.round(i * w + shift) + seam, Math.round(row * h) + seam, Math.round(w) - seam, Math.round(h) - seam);
    }
  }
  tex.update(true);
  tex.wrapU = Texture.WRAP_ADDRESSMODE;
  tex.wrapV = Texture.WRAP_ADDRESSMODE;
  tex.uScale = (2 * DECK.x) / DECK.tileM;
  tex.vScale = (2 * DECK.z) / DECK.tileM;
  tex.anisotropicFilteringLevel = 16;
  const mat = new StandardMaterial("heavenMarble", scene);
  mat.diffuseTexture = tex;
  mat.diffuseColor = Color3.White();
  mat.emissiveColor = new Color3(0.22, 0.23, 0.25);
  mat.specularColor = new Color3(0.08, 0.08, 0.09);
  return mat;
}

function marbleDeck(scene: Scene, built: Set<unknown>): void {
  for (const m of scene.meshes) {
    if (!built.has(m)) continue;
    if (m.name === "ground" || m.name === "centerGrass" || m.name === "grassTuft" || m.name.startsWith("fieldBlades_")) m.setEnabled(false);
  }
  const top = MeshBuilder.CreateGround("heavenDeckTop", { width: 2 * DECK.x, height: 2 * DECK.z }, scene);
  top.position.y = 0.005;
  top.material = marbleMaterial(scene);
  top.receiveShadows = true;
  const stone = new StandardMaterial("heavenStone", scene);
  stone.diffuseColor = new Color3(0.86, 0.89, 0.93);
  stone.emissiveColor = new Color3(0.2, 0.21, 0.24);
  stone.specularColor = Color3.Black();
  const body = MeshBuilder.CreateBox("heavenDeckBody", { width: 2 * DECK.x, height: DECK.depth, depth: 2 * DECK.z }, scene);
  body.position.y = -DECK.depth / 2;
  body.material = stone;
  const gold = new StandardMaterial("heavenGold", scene);
  gold.diffuseColor = new Color3(0.78, 0.62, 0.1);
  gold.emissiveColor = new Color3(0.22, 0.17, 0.02);
  gold.specularColor = new Color3(0.2, 0.18, 0.08);
  const k = DECK.kerbW, kh = DECK.kerbH;
  const kerbs = [
    { w: 2 * DECK.x, d: k, x: 0, z: DECK.z - k / 2 },
    { w: 2 * DECK.x, d: k, x: 0, z: -DECK.z + k / 2 },
    { w: k, d: 2 * DECK.z - 2 * k, x: DECK.x - k / 2, z: 0 },
    { w: k, d: 2 * DECK.z - 2 * k, x: -DECK.x + k / 2, z: 0 },
  ].map((r, i) => {
    const b = MeshBuilder.CreateBox(`heavenKerb${i}`, { width: r.w, height: kh, depth: r.d }, scene);
    b.position.set(r.x, kh / 2, r.z);
    b.bakeCurrentTransformIntoVertices();
    return b;
  });
  const kerb = Mesh.MergeMeshes(kerbs, true, true);
  if (kerb) { kerb.name = "heavenKerb"; kerb.material = gold; }
}

export function buildFantasyGood(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  marbleDeck(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));
  return result;
}
