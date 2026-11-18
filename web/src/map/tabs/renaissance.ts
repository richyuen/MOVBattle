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
import { Color3, Mesh, MeshBuilder, StandardMaterial, TransformNode, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const PALACE = { z: 31, wide: 36, deep: 8 };
const ARCADE = 3.2;

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
  // Body. Walk-in arcade (584, card Appearance and wiki renaissance.png: the palace stands on an open ground arcade that
  // units can stand in). The ground storey is hollow for its front ARCADE metres: the upper body rests on the columns,
  // the ground wall stands back with the dark doorways on it, and each bay's pointed head is cut by stone diamonds over
  // the columns under a lintel band; the collider (buildRenaissance) covers only the wall behind.
  box("wall", W, 14.5, D, 0, 13.75, F + D / 2);
  box("wall", W, 6.5, D - ARCADE, 0, 3.25, F + ARCADE + (D - ARCADE) / 2);
  // Ground arcade: eight pointed arches between stout columns
  const n = 8, bay = W / n;
  for (let i = 0; i < n; i++) {
    const x = -W / 2 + bay * (i + 0.5);
    pointed("shade", x, 0, 3, 5.2, F + ARCADE - 0.05);
    if (i > 0) {
      box("stone", 0.9, 5, 0.9, x - bay / 2, 2.5, F - 0.3);
      box("stone", bay / Math.SQRT2, bay / Math.SQRT2, 0.6, x - bay / 2, 5.1, F - 0.3, Math.PI / 4);
    }
  }
  box("stone", W, 1.4, 0.9, 0, 5.8, F - 0.3);
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

// Rectangular piazza (577, wiki renaissance.png and renaissance_town.png: the square is a rectangle; along each side runs one
// straight unbroken frontage of tall Venetian houses, ochre, salmon pink, cream and straw, three to five storeys, some with an
// orange hipped roof and some with a crenellated parapet, a dark ground arcade, rows of tall windows and stone balconies; the
// back frontage meets the palace; the near side stays low). Spec: the base's oval townhouse ring (the merged "townRing" meshes,
// its near wall too) is hidden; straight rows with their fronts on x = -44 and x = +44 (6 m deep, z -28..24) and on z = 31 beside
// the palace (7 m deep, |x| 18..40), corner blocks 7 x 7 m at (+-44.5, 28); houses 7.5-10.5 m wide along the row, storey 3.2 m;
// a straight low cream wall with a stone cap along z = -30.5 for |x| <= 44. All inside the rim (superellipse 54 x 48, power 3).
// One box collider per row and corner; the placement zones end at |x| 43, in front of the side rows.
// Returns the z at which the left row ends and the corner palazzo's side wing begins (584).
function rectangularPiazza(scene: Scene, built: Set<unknown>, result: MapBuildResult): number {
  let palazzoFrom = 2;
  for (const mesh of scene.meshes) if (built.has(mesh) && mesh.name === "townRing") mesh.setEnabled(false);
  const mk = (name: string, c: Color3, self = 0.42) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c.scale(1 - self);
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const walls = [new Color3(0.93, 0.7, 0.42), new Color3(0.9, 0.58, 0.52), new Color3(0.95, 0.88, 0.74), new Color3(0.95, 0.8, 0.52)].map((c, i) => mk(`renaissanceRowWall${i}`, c));
  const mats = { roof: mk("renaissanceRowRoof", new Color3(0.84, 0.42, 0.26)), stone: mk("renaissanceRowStone", new Color3(0.92, 0.89, 0.82)), dark: mk("renaissanceRowDark", new Color3(0.3, 0.24, 0.24), 0.2) };
  const parts = new Map<StandardMaterial, Mesh[]>();
  let k = 0;
  const r = (n: number) => Math.abs((Math.sin(k * 23.117 + n * 41.37) * 31337.77) % 1);
  // A row: its front line runs along `axis` from `from` to `to` at `line`; `inward` points from the front into the square
  // `cut`: houses starting at or past it are left out; `skip`: the whole row is (584: the corner palazzo stands there).
  // The random sequence still advances for them, so every other house keeps its look.
  type Row = { axis: "x" | "z"; line: number; from: number; to: number; inward: number; deep: number; cut?: number; skip?: boolean };
  const put = (mat: StandardMaterial, row: Row, along: number, high: number, through: number, u: number, y: number, back: number) => {
    const across = row.line - row.inward * back;
    const b = row.axis === "z"
      ? MeshBuilder.CreateBox("renaissanceRowPart", { width: through, height: high, depth: along }, scene)
      : MeshBuilder.CreateBox("renaissanceRowPart", { width: along, height: high, depth: through }, scene);
    if (row.axis === "z") b.position.set(across, y, u);
    else b.position.set(u, y, across);
    (parts.get(mat) ?? parts.set(mat, []).get(mat)!).push(b);
  };
  const house = (row: Row, u: number, wide: number, low = false) => {
    k++;
    const floors = (low ? 2 : 3) + Math.round(r(2) * (low ? 1 : 2)), tall = floors * 3.2;
    const D = row.deep;
    const pinkBridgeHouse=row.axis==="x"&&row.line===31&&row.from===30;
    put(walls[pinkBridgeHouse?1:Math.floor(r(3) * walls.length) % walls.length], row, wide, tall + 1, D, u, (tall - 1) / 2, D / 2);
    put(mats.stone, row, wide * 1.02, 0.4, D * 1.04, u, tall + 0.2, D / 2);
    if (r(4) < 0.5) {
      // an orange hipped roof
      put(mats.roof, row, wide * 0.96, 1.2, D * 0.9, u, tall + 1, D / 2);
      put(mats.roof, row, wide * 0.6, 0.9, D * 0.5, u, tall + 2, D / 2);
    } else {
      // a crenellated parapet along the front
      for (let m = -wide / 2 + 0.5; m <= wide / 2 - 0.4; m += 1.4) put(mats.stone, row, 0.6, 0.9, 0.5, u + m, tall + 0.85, 0.3);
    }
    const arches = Math.max(2, Math.floor(wide / 2.6));
    for (let i = 0; i < arches; i++) put(mats.dark, row, 1.5, 2.4, 0.2, u + (i + 0.5 - arches / 2) * (wide / arches), 1.2, -0.05);
    const panes = Math.max(2, Math.floor(wide / 2.4));
    for (let f = 1; f < floors; f++) {
      for (let i = 0; i < panes; i++) put(mats.dark, row, 0.8, 1.5, 0.16, u + (i + 0.5 - panes / 2) * (wide / panes), f * 3.2 + 1.4, -0.03);
    }
    if (r(5) < 0.55) {
      put(mats.stone, row, wide * 0.55, 0.2, 0.9, u, 3.8, -0.45);
      put(mats.stone, row, wide * 0.55, 0.75, 0.12, u, 4.25, -0.85);
    }
  };
  const rows: Row[] = [
    { axis: "z", line: -44, from: -28, to: 24, inward: 1, deep: 6, cut: 2 },
    { axis: "z", line: 44, from: -28, to: 24, inward: -1, deep: 6 },
    { axis: "x", line: 31, from: -40, to: -18, inward: -1, deep: 7, skip: true },
    { axis: "x", line: 31, from: 30, to: 40, inward: -1, deep: 7 },
  ];
  for (const row of rows) {
    let u = row.from, end = row.to;
    while (row.to - u > 4) {
      k++;
      const wide = Math.min(7.5 + r(1) * 3, row.to - u);
      if (row.skip || (row.cut !== undefined && u >= row.cut)) {
        k++;
        end = Math.min(end, u);
      } else house(row, u + wide / 2, wide);
      u += wide;
    }
    if (row.skip) continue;
    if (row.cut !== undefined) palazzoFrom = end;
    const mid = (row.from + end) / 2, half = (end - row.from) / 2, centre = row.line - row.inward * row.deep / 2;
    result.obstacles.push(row.axis === "z"
      ? { type: "box", center: new Vector3(centre, 0, mid), halfX: row.deep / 2, halfZ: half }
      : { type: "box", center: new Vector3(mid, 0, centre), halfX: half, halfZ: row.deep / 2 });
  }
  for (const sx of [-1, 1]) {
    if (sx < 0) {
      k++;
      continue;
    }
    house({ axis: "z", line: sx * 41, from: 24.5, to: 31.5, inward: -sx, deep: 7 }, 28, 7);
    result.obstacles.push({ type: "box", center: new Vector3(sx * 44.5, 0, 28), halfX: 3.5, halfZ: 3.5 });
  }
  // Front terrace (578, renaissance_town.png: the near side of the square is closed by a solid row of lower houses, cream and
  // ochre under orange hipped roofs, their backs to the canal; no gap and no low wall). Spec: the low wall goes; houses 7.5-10.5 m
  // wide along z = -30.5 (fronts facing the square, 5.5 m deep) for |x| <= 44, two or three storeys, the same house kit; one
  // box collider (it stands in the canal hazard, behind the armies' zones).
  const front: Row = { axis: "x", line: -30.5, from: -44, to: 44, inward: 1, deep: 5.5 };
  for (let u = front.from; front.to - u > 4;) {
    k++;
    const wide = Math.min(7.5 + r(1) * 3, front.to - u);
    house(front, u + wide / 2, wide, true);
    u += wide;
  }
  result.obstacles.push({ type: "box", center: new Vector3(0, 0, -30.5 - 2.75), halfX: 44, halfZ: 2.75 });
  const glow = scene.getGlowLayerByName("glow");
  for (const [mat, group] of parts) {
    const merged = Mesh.MergeMeshes(group, true);
    if (!merged) continue;
    merged.name = "renaissancePiazza";
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.receiveShadows = true;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  }
  result.placementZones = (result.placementZones ?? result.zones).map((zone) => {
    const inner = Math.min(Math.abs(zone.center.x) - zone.size.x / 2, 43), outer = Math.min(Math.abs(zone.center.x) + zone.size.x / 2, 43);
    const sx = Math.sign(zone.center.x) || 1;
    return { ...zone, center: new Vector3(sx * (inner + outer) / 2, zone.center.y, zone.center.z), size: new Vector3(outer - inner, zone.size.y, zone.size.z) };
  });
  return palazzoFrom;
}

// Corner palazzo (584, wiki renaissance.png: the square's back left corner is wrapped by one long two-storey cream stone
// palazzo, L-shaped: on both storeys an open loggia of round arches on columns runs its whole front, a balustrade along the
// upper one, a plain cornice and a low orange tiled roof above; it meets the Doge's palace at the back and runs well down
// the left side). Spec: a back wing fronting z = 31 from x -44 to -18.5 (6 m deep) and a side wing fronting x = -44 from
// the left row's end (z ~2..12) to z 31 (5 m deep), joined by a solid 5 x 6 m corner block; bays of about 3.3 m; each
// storey 5.4 m: columns 0.55 m, round arches of eight voussoirs springing at 3.2 m, a beam over them; the front 2.6 m of
// both storeys is open, the wall behind a shade darker with a dark doorway per bay; cornice at 10.8 m, roof to 13.2 m.
// Units can stand in the ground loggia: the colliders cover only the walls behind it and the corner block.
function cornerPalazzo(scene: Scene, result: MapBuildResult, sideFrom: number): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c.scale(1 - self);
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    cream: mk("renaissancePalazzoCream", new Color3(0.95, 0.9, 0.78), 0.42),
    inner: mk("renaissancePalazzoInner", new Color3(0.7, 0.64, 0.56), 0.35),
    dark: mk("renaissancePalazzoDark", new Color3(0.3, 0.24, 0.24), 0.2),
    roof: mk("renaissancePalazzoRoof", new Color3(0.84, 0.42, 0.26), 0.42),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { cream: [], inner: [], dark: [], roof: [] };
  const RECESS = 2.6, STOREY = 5.4;
  // A wing is built along local x (u) with its front on local z = 0 and its depth toward +z, under a pivot that places it
  const wing = (pivot: TransformNode, from: number, to: number, deep: number, closeFrom: boolean, closeTo: boolean) => {
    pivot.computeWorldMatrix(true);
    const box = (k: keyof typeof mats, along: number, high: number, through: number, u: number, y: number, v: number, turn = 0) => {
      const b = MeshBuilder.CreateBox("renaissancePalazzoPart", { width: along, height: high, depth: through }, scene);
      b.position.set(u, y, v);
      b.rotation.z = turn;
      b.parent = pivot;
      parts[k].push(b);
    };
    const len = to - from, mid = (from + to) / 2, n = Math.max(2, Math.round(len / 3.3)), bay = len / n;
    box("inner", len, STOREY * 2, deep - RECESS, mid, STOREY, RECESS + (deep - RECESS) / 2);
    for (let s = 0; s < 2; s++) {
      const y0 = s * STOREY;
      for (let i = 0; i <= n; i++) {
        const u = from + i * bay;
        box("cream", 0.55, 3.3, 0.55, u, y0 + 1.65, 0.3);
        box("cream", 0.8, 0.25, 0.8, u, y0 + 3.3, 0.3);
        box("cream", 0.95, 1.5, 0.6, u, y0 + 4.15, 0.3);
        if (s === 0) box("cream", 0.8, 0.3, 0.8, u, 0.15, 0.3);
      }
      for (let i = 0; i < n; i++) {
        const u = from + (i + 0.5) * bay, radius = bay / 2 - 0.2;
        for (let j = 0; j < 8; j++) {
          const a = (j + 0.5) / 8 * Math.PI;
          box("cream", radius * 0.44, 0.42, 0.6, u + Math.cos(a) * radius, y0 + 3.2 + Math.sin(a) * radius, 0.3, a + Math.PI / 2);
        }
        box("dark", 1.3, s ? 2.2 : 2.7, 0.12, u, y0 + (s ? 2 : 1.35), RECESS - 0.06);
      }
      box("cream", len + 0.3, 0.6, 0.75, mid, y0 + 5.1, 0.3);
      box("cream", len, 0.4, RECESS, mid, y0 + 5.2, RECESS / 2);
    }
    box("cream", len, 0.14, 0.22, mid, STOREY + 1.05, 0.2);
    for (let u = from + 0.3; u < to; u += 0.55) box("cream", 0.14, 0.9, 0.14, u, STOREY + 0.5, 0.2);
    for (const [close, u] of [[closeFrom, from], [closeTo, to]] as const) if (close) box("cream", 0.6, STOREY * 2, deep, u, STOREY, deep / 2);
    box("cream", len + 0.6, 0.5, deep + 0.6, mid, STOREY * 2 + 0.25, deep / 2);
    box("roof", len + 0.2, 1.1, deep * 0.92, mid, STOREY * 2 + 1.05, deep / 2);
    box("roof", len - 2.4, 0.9, deep * 0.5, mid, STOREY * 2 + 2, deep / 2);
  };
  const back = new TransformNode("renaissancePalazzoBack", scene);
  back.position.set(0, 0, 31);
  wing(back, -44, -18.5, 6, false, true);
  const sideWing = new TransformNode("renaissancePalazzoSide", scene);
  sideWing.position.set(-44, 0, 0);
  sideWing.rotation.y = -Math.PI / 2;
  wing(sideWing, sideFrom, 31, 5, true, false);
  const corner = (k: keyof typeof mats, w: number, h: number, d: number, y: number) => {
    const b = MeshBuilder.CreateBox("renaissancePalazzoPart", { width: w, height: h, depth: d }, scene);
    b.position.set(-46.5, y, 34);
    parts[k].push(b);
  };
  corner("cream", 5, STOREY * 2, 6, STOREY);
  corner("cream", 5.6, 0.5, 6.6, STOREY * 2 + 0.25);
  corner("roof", 4.8, 1.1, 5.6, STOREY * 2 + 1.05);
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `renaissancePalazzo_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  }
  back.dispose();
  sideWing.dispose();
  result.obstacles.push(
    { type: "box", center: new Vector3(-31.25, 0, 31 + RECESS + 1.7), halfX: 12.75, halfZ: 1.7 },
    { type: "box", center: new Vector3(-44 - RECESS - 1.2, 0, (sideFrom + 31) / 2), halfX: 1.2, halfZ: (31 - sideFrom) / 2 },
    { type: "box", center: new Vector3(-46.5, 0, 34), halfX: 2.5, halfZ: 3 },
  );
}

// Large close-set cream slabs replace the coarse blue-grey paving and wide dark grout.
function creamPavement(scene: Scene, built: Set<unknown>): void {
  for(const m of scene.meshes) if(built.has(m)&&(/^(plazaStones|campaign_zone_)/.test(m.name))) m.setEnabled(false);
  const mats=[0,1,2].map(i=>{
    const mat=new StandardMaterial(`renaissanceCreamSlab${i}`,scene);
    mat.diffuseColor.set(0.71+i*0.035,0.68+i*0.035,0.58+i*0.035);
    mat.emissiveColor.set(0.28,0.265,0.22);mat.specularColor=Color3.Black();return mat;
  });
  const parts:Mesh[][]=[[],[],[]];
  for(let row=0;row<18;row++) for(let col=0;col<29;col++) {
    const tile=MeshBuilder.CreateBox("renaissanceCreamTile",{width:2.965,height:0.05,depth:2.965},scene);
    tile.position.set(-42+col*3,0.062,-22.95+row*3);parts[(row+col)%3].push(tile);
  }
  for(let i=0;i<3;i++) {const m=Mesh.MergeMeshes(parts[i],true);if(m){m.name="renaissanceCreamPavement";m.material=mats[i];m.receiveShadows=true;scene.getGlowLayerByName("glow")?.addExcludedMesh(m);}}
}

// Canal immediately behind the front house terrace, with quays and two short arched crossings.
function frontCanal(scene: Scene): void {
  const water=new StandardMaterial("renaissanceCanalGreen",scene);
  water.diffuseColor.set(0.025,0.34,0.2);water.emissiveColor.set(0.025,0.22,0.13);water.specularColor=Color3.Black();
  const stone=new StandardMaterial("renaissanceCanalQuay",scene);
  stone.diffuseColor.set(0.65,0.59,0.47);stone.emissiveColor.set(0.2,0.18,0.14);
  const box=(w:number,h:number,d:number,x:number,y:number,z:number,mat=stone)=>{
    const m=MeshBuilder.CreateBox("renaissanceCanal",{width:w,height:h,depth:d},scene);m.position.set(x,y,z);m.material=mat;scene.getGlowLayerByName("glow")?.addExcludedMesh(m);return m;
  };
  box(86,0.12,5,0,0.08,-27.4,water);
  for(const z of [-24.7,-30.1]) box(87,0.4,0.45,0,0.22,z);
  for(const x of [-26,26]) for(let i=0;i<12;i++) {
    const z=-30.1+i*0.48,y=0.35+Math.sin(i/11*Math.PI)*0.75;
    const deck=box(3.2,0.25,0.6,x,y,z);deck.rotation.x=Math.cos(i/11*Math.PI)*0.42;
    for(const s of [-1,1]) box(0.18,0.8,0.6,x+s*1.55,y+0.5,z);
  }
}

export function buildRenaissance(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const palazzoFrom = rectangularPiazza(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))), result);
  cornerPalazzo(scene, result, palazzoFrom);
  dogesPalace(scene);
  coveredBridge(scene);
  frontCanal(scene);
  creamPavement(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));
  // The circular object in the reference battle is a unit: the piazza itself has no fountain.
  for(const m of scene.meshes) if(!prior.has(m)&&m.name.startsWith("plazaFountain")) m.setEnabled(false);
  const obstacles = [...result.obstacles.filter(o=>!(o.type==="cylinder"&&Math.hypot(o.center.x,o.center.z)<0.1&&o.radius===3.5)), { type: "box" as const, center: new Vector3(0, 0, PALACE.z + ARCADE + (PALACE.deep - ARCADE) / 2), halfX: PALACE.wide / 2, halfZ: (PALACE.deep - ARCADE) / 2 }];
  return { ...result, obstacles };
}

// Wiki: an elevated covered loggia bridges the palace's right side to the
// pink house, with a broad open arch beneath and four small upper arches.
function coveredBridge(scene: Scene): void {
  const stone=scene.getMaterialByName("renaissancePalaceStone")!;
  const roof=scene.getMaterialByName("renaissanceRowRoof")!;
  const box=(name:string,w:number,h:number,d:number,x:number,y:number,z:number,mat=stone)=>{
    const m=MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);
    m.position.set(x,y,z);m.material=mat;m.receiveShadows=true;scene.getGlowLayerByName("glow")?.addExcludedMesh(m);return m;
  };
  // Elliptic stone arch from x18 to30. The space beneath remains open.
  for(let i=0;i<20;i++) {
    const a=(i+0.5)/20*Math.PI;
    const m=box("renaissanceBridgeArch",1.05,0.7,4.8,24+6*Math.cos(a),3.8+2.9*Math.sin(a),34);
    m.rotation.z=Math.atan2(2.9*Math.cos(a),-6*Math.sin(a));
  }
  box("renaissanceBridgeDeck",12.4,0.55,5.1,24,7.05,34);
  for(const z of [31.6,36.4]) {
    box("renaissanceBridgeRail",12,0.2,0.35,24,8.25,z);
    for(let i=0;i<=24;i++)box("renaissanceBridgeBaluster",0.14,0.9,0.15,18+i*0.5,7.8,z);
    for(let i=0;i<=4;i++)box("renaissanceBridgeColumn",0.35,3.2,0.4,18+i*3,9.5,z);
    for(let bay=0;bay<4;bay++)for(let j=0;j<10;j++) {
      const a=(j+0.5)/10*Math.PI;
      const m=box("renaissanceBridgeUpperArch",0.5,0.3,0.4,19.5+bay*3+1.35*Math.cos(a),10+1.05*Math.sin(a),z);
      m.rotation.z=Math.atan2(1.05*Math.cos(a),-1.35*Math.sin(a));
    }
  }
  box("renaissanceBridgeCornice",12.6,0.35,5.4,24,11.35,34);
  for(const s of [-1,1]) {
    const slope=box("renaissanceBridgeRoof",12.8,0.25,3,24,11.9,34+s*1.25,roof);
    slope.rotation.x=s*0.3;
  }
}
