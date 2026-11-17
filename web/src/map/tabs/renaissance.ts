// TABS "Renaissance" (renaissance map): a rectangular paved piazza framed by Venetian buildings: an arcaded palazzo on the left, the
// Doge's-palace facade at the back, pink and ochre houses on the right, a canal and a row of orange-roofed houses along the front
// (reference/maps/wiki/renaissance.png, reference/maps/renaissance_town.png; card loop/cards/maps/renaissance.md). Built on
// campaign.renaissance (base(); never edit the base, dress its build here).
//
// Doge's palace (576, wiki renaissance.png: across the back of the square stands a tall pale pink-white gothic palace: a ground
// arcade of tall pointed arches on stout columns, above it a loggia of slender columns and small pointed arches under a band of
// quatrefoil roundels, a balustrade along its foot, then a high plain wall pierced by three great pointed windows with pale blue glass,
// a cornice and a row of small cresting merlons on top). Spec: centred at x 0, front face at z 31, 36 m wide, 8 m deep, 21 m to the
// cornice; ground arcade 6.5 m (eight arches 3 m wide, 5 m high, dark recesses with a pointed head); loggia 5 m (sixteen columns,
// pointed heads, roundels 0.9 m with a four-lobed dark cross); upper wall 9.5 m with three windows 4 x 6.5 m; cresting merlons every
// 1.5 m. It stands in front of the base's back townhouses, outside the armies' zones (z <= 29); one box collider.
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const PALACE = { z: 31, wide: 36, deep: 8 };

function dogesPalace(scene: Scene): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    wall: mk("renaissancePalaceWall", new Color3(0.95, 0.86, 0.85), 0.5),
    stone: mk("renaissancePalaceStone", new Color3(0.97, 0.95, 0.9), 0.55),
    shade: mk("renaissancePalaceShade", new Color3(0.36, 0.3, 0.36), 0.4),
    glass: mk("renaissancePalaceGlass", new Color3(0.55, 0.82, 0.92), 0.6),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { wall: [], stone: [], shade: [], glass: [] };
  const F = PALACE.z, W = PALACE.wide, D = PALACE.deep;
  const box = (k: keyof typeof mats, w: number, h: number, d: number, x: number, y: number, z: number, rz = 0) => {
    const b = MeshBuilder.CreateBox("renaissancePalacePart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    b.rotation.z = rz;
    parts[k].push(b);
    return b;
  };
  // A pointed arch opening: a dark recess with a pointed head (a diamond whose upper half shows above the recess)
  const pointed = (k: keyof typeof mats, x: number, y0: number, w: number, h: number, z: number) => {
    box(k, w, h - w * 0.5, 0.1, x, y0 + (h - w * 0.5) / 2, z);
    const s = w / Math.SQRT2;
    box(k, s, s, 0.1, x, y0 + h - w * 0.5, z, Math.PI / 4);
  };
  const face = F - 0.05;
  // Body
  box("wall", W, 21, D, 0, 10.5, F + D / 2);
  // Ground arcade: eight pointed arches between stout columns
  const n = 8, bay = W / n;
  for (let i = 0; i < n; i++) {
    const x = -W / 2 + bay * (i + 0.5);
    pointed("shade", x, 0, 3, 5.2, face);
    if (i > 0) box("stone", 0.9, 5, 0.9, x - bay / 2, 2.5, F - 0.3);
  }
  box("stone", W + 0.4, 0.5, 1.2, 0, 6.5, F - 0.2);
  // Loggia: slender columns with small pointed heads, a balustrade at its foot, a band of quatrefoil roundels above
  const m = 16, lb = W / m;
  for (let i = 0; i < m; i++) {
    const x = -W / 2 + lb * (i + 0.5);
    pointed("shade", x, 7.6, 1.5, 3.4, face);
    box("stone", 0.3, 3.4, 0.4, x - lb / 2, 8.9, F - 0.2);
    // Roundel with a four-lobed cross
    const ring = MeshBuilder.CreateCylinder("renaissancePalaceRoundel", { diameter: 1.1, height: 0.12, tessellation: 12 }, scene);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, 11.6, face - 0.02);
    parts.stone.push(ring);
    for (const [dx, dy] of [[0.2, 0], [-0.2, 0], [0, 0.2], [0, -0.2]]) {
      const lobe = MeshBuilder.CreateCylinder("renaissancePalaceLobe", { diameter: 0.32, height: 0.14, tessellation: 8 }, scene);
      lobe.rotation.x = Math.PI / 2;
      lobe.position.set(x + dx, 11.6 + dy, face - 0.05);
      parts.shade.push(lobe);
    }
  }
  box("stone", W + 0.2, 0.9, 0.6, 0, 7.35, F - 0.35);
  for (let i = 0; i <= 48; i++) box("stone", 0.18, 0.7, 0.18, -W / 2 + i * W / 48, 7.25, F - 0.6);
  box("stone", W + 0.4, 0.45, 1, 0, 12.5, F - 0.15);
  // Upper wall: three great pointed windows with pale blue glass and white frames
  for (const x of [-W / 3, 0, W / 3]) {
    pointed("stone", x, 13.6, 4.6, 7.2, face - 0.02);
    pointed("glass", x, 13.9, 4, 6.6, face - 0.06);
    box("stone", 0.18, 5.5, 0.1, x, 16.6, face - 0.1);
    box("stone", 4, 0.16, 0.1, x, 16.6, face - 0.1);
  }
  // Cornice and cresting merlons
  box("stone", W + 0.6, 0.5, D + 0.6, 0, 21.2, F + D / 2);
  for (let x = -W / 2 + 0.4; x <= W / 2 - 0.3; x += 1.5) box("stone", 0.5, 1, 0.5, x, 21.9, face + 0.2);
  // Corner shafts
  for (const sx of [-1, 1]) box("stone", 0.8, 21, 0.8, sx * W / 2, 10.5, F);
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `renaissancePalace_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  }
}

export function buildRenaissance(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  dogesPalace(scene);
  const obstacles = [...result.obstacles, { type: "box" as const, center: new Vector3(0, 0, PALACE.z + PALACE.deep / 2), halfX: PALACE.wide / 2, halfZ: PALACE.deep / 2 }];
  return { ...result, obstacles };
}
