import { Scene, Vector3, Color3, Mesh, MeshBuilder, Quaternion, VertexBuffer, VertexData } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

/*
 * Tribal ornaments (units/tribal.*): the bone and rope trinkets each tribesman wears over his bare team-coloured skin, built per unit id by unitFactory's
 * bareSkinned branch. Everything is sized off the body's own joints and the trunk's vertices taken into the torso joint's frame (+z is his front).
 *   Bone is pale and self-lit (BONE_COLOR, emissive 0.2) so it stays bone in the capture's shade; rope and strap are a mid red-brown (ROPE_COLOR).
 */
const BONE_COLOR = new Color3(0.86, 0.79, 0.64);
const SOCKET_COLOR = new Color3(0.16, 0.12, 0.1);
const ROPE_COLOR = new Color3(0.5, 0.26, 0.16);
/*
 * The protector's critter-skull necklace (tribal.protector.png, card Appearance: "a necklace made out of three skulls from small critters with a strap tied
 * through their orbits"): a strap round the neck from the nape over both shoulders and down across the upper chest, three small faceted bone skulls threaded
 * on its front run, one at the breastbone and one each side out toward the collarbones so they stand off the chest's profile from the side.
 *   CRITTER_NECKLACE.skull head widths across each skull, .spread of the trunk's half width out from the middle for the side skulls, .drop of the trunk
 *   height below the neck for the middle one (the side ones ride .lift higher), .strap the strap's thickness in trunk heights.
 */
const CRITTER_NECKLACE = { skull: 0.5, spread: 0.55, drop: 0.2, lift: 0.05, strap: 0.03 };
/*
 * The bone necklace (tribal.stoner.red.png, card Appearance: "a necklace made out of three bones tied to a strap with twine"): a strap round the neck from the
 * nape over both shoulders, meeting in a short V high on the chest, a twine bar across the V's foot and three knobbed pale bones hanging from it side by side,
 * the middle one longest, standing a little off the chest (and off a tunic's front) so they keep their own silhouette in profile.
 *   BONE_NECKLACE.drop of the trunk height below the neck for the V's foot, .bone head heights long (the middle one .middle times that), .thick head widths
 *   across each bone, .gap bone thicknesses between them, .strap the strap's thickness in trunk heights, .off of the trunk's depth the bones stand off the chest.
 */
const BONE_NECKLACE = { drop: 0.16, bone: 0.55, middle: 1.25, thick: 0.13, gap: 2.4, strap: 0.03, off: 0.14 };
/*
 * The fang necklace (tribal.spear_thrower.blue.png, card Appearance: "a necklace made from a beast's fang tied with a strap and ropes"): a red-brown strap
 * from the nape over both shoulders down in a long V to the middle of the chest, and one long pale fang hanging point down from its foot, curling to one
 * side, a turn of rope round its root. It stands off the chest so it keeps its own silhouette in profile.
 *   FANG_NECKLACE.drop of the trunk height below the neck for the V's foot, .long head heights for the fang, .thick head widths across its root, .curl of
 *   its length the tip swings aside, .strap the strap's thickness in trunk heights, .off of the trunk's depth the fang stands off the chest.
 */
const FANG_NECKLACE = { drop: 0.34, long: 0.8, thick: 0.2, curl: 0.3, strap: 0.03, off: 0.14 };
/*
 * The clubber's tusk necklace (tribal.clubber.blue.png, card Appearance: "a Tribal necklace made out of tusks that are tied together with a rope"): a
 * red-brown rope from the nape over both shoulders, sagging in a shallow U across the top of the chest below the beard, and three short pale tusks hung
 * from its front run side by side, point down, each curling outward and a little forward, the middle one longest, a turn of rope round each root.
 *   TUSK_NECKLACE.drop of the trunk height below the neck for the U's foot, .long head heights for the middle tusk (the side ones .side times that),
 *   .thick head widths across each root, .gap head widths between roots, .curl of its length each tip swings out, .strap the rope's thickness in trunk
 *   heights, .off of the trunk's depth the tusks stand off the chest.
 */
const TUSK_NECKLACE = { drop: 0.3, long: 0.5, side: 0.8, thick: 0.17, gap: 0.3, curl: 0.3, strap: 0.03, off: 0.16 };
// Which tribesmen wear which necklace (the furCollar is dropped for them)
const NECKLACES: Record<string, "critter_skulls" | "bones" | "fang" | "tusks"> = {
  "tribal.protector": "critter_skulls", "tribal.stoner": "bones", "tribal.bone_mage": "bones", "tribal.spear_thrower": "fang", "tribal.clubber": "tusks",
};

export function hasTribalNecklace(unitId: string): boolean {
  return unitId in NECKLACES;
}

function boneMaterial() {
  return getMaterialFactory().get("cloth", BONE_COLOR, { emissiveIntensity: 0.2 });
}

function ropeMaterial() {
  return getMaterialFactory().get("cloth", ROPE_COLOR, { emissiveIntensity: 0.15 });
}

/** A hashed share in [0, 1) for vertex jitter: the same mesh every spawn. */
function hashShare(serial: number, x: number, y: number, z: number): number {
  const seed = Math.sin(Math.round(x * 89 + y * 53 + z * 37) * 311.7 + serial) * 43758.5453;
  return seed - Math.floor(seed);
}

/** Pushes every vertex of a flat-faced mesh in or out by its own hashed share (then scales it by sx, sy, sz) and recomputes normals. */
export function jitterVertices(mesh: Mesh, jitter: number, serial: number, sx = 1, sy = 1, sz = 1): void {
  const at = mesh.getVerticesData(VertexBuffer.PositionKind);
  if (!at) return;
  const r = mesh.getBoundingInfo().boundingSphere.radius || 1;
  for (let v = 0; v < at.length; v += 3) {
    const k = 1 - jitter + 2 * jitter * hashShare(serial, at[v] / r * 10, at[v + 1] / r * 10, at[v + 2] / r * 10);
    at[v] *= k * sx; at[v + 1] *= k * sy; at[v + 2] *= k * sz;
  }
  mesh.setVerticesData(VertexBuffer.PositionKind, at);
  const normals: number[] = [];
  VertexData.ComputeNormals(at, mesh.getIndices() ?? [], normals);
  mesh.setVerticesData(VertexBuffer.NormalKind, normals);
  mesh.refreshBoundingInfo();
}

/**
 * The trunk's box in the torso joint's frame between two heights (shares of the neck's height), read off the torso wedge and the shoulder yoke vertices:
 * bounding boxes go stale once the body builder reshapes the chest.
 */
export function trunkBand(body: ArticulatedBody, lo: number, hi: number) {
  const trunk = body.neck.position.y;
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  body.torso.computeWorldMatrix(true);
  const toTorso = body.torso.getWorldMatrix().clone().invert();
  for (const part of body.torso.getChildMeshes(true).filter((m) => m === body.torsoMesh || /_yoke$/.test(m.name))) {
    const local = part.computeWorldMatrix(true).multiply(toTorso);
    const at = part.getVerticesData(VertexBuffer.PositionKind) ?? [];
    for (let v = 0; v < at.length; v += 3) {
      const p = Vector3.TransformCoordinates(new Vector3(at[v], at[v + 1], at[v + 2]), local);
      if (p.y < trunk * lo || p.y > trunk * hi) continue;
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
    }
  }
  if (!Number.isFinite(minX)) {
    const e = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
    minX = -e.x; maxX = e.x; minZ = -e.z; maxZ = e.z;
  }
  return { trunk, minX, maxX, minZ, maxZ, midX: (minX + maxX) * 0.5, halfX: (maxX - minX) * 0.5 };
}

/** The head's width across, in the neck joint's frame. */
function headWide(body: ArticulatedBody): number {
  return body.headMesh.getBoundingInfo().boundingBox.extendSize.x * 2 * body.headMesh.scaling.x;
}

/**
 * A small faceted animal skull, snout down and facing +z, `wide` across: a jittered cranium ball, a tapering snout under its front, two dark sockets.
 * The first mesh is the cranium (the others are its children); its origin is the cranium's middle.
 */
export function boneSkull(scene: Scene, name: string, wide: number, serial: number, material?: ReturnType<typeof boneMaterial>): Mesh[] {
  const bone = material ?? boneMaterial();
  const cranium = MeshBuilder.CreateIcoSphere(name, { radius: wide * 0.5, subdivisions: 1, flat: true }, scene);
  jitterVertices(cranium, 0.1, serial, 1, 0.85, 0.9);
  cranium.material = bone;
  const snout = MeshBuilder.CreateCylinder(`${name}Snout`, { height: wide * 0.75, diameterTop: wide * 0.62, diameterBottom: wide * 0.3, tessellation: 5 }, scene);
  snout.convertToFlatShadedMesh();
  snout.rotation.x = -0.35;
  snout.position.set(0, -wide * 0.45, wide * 0.18);
  snout.material = bone;
  snout.parent = cranium;
  const parts = [cranium, snout];
  for (const side of [-1, 1]) {
    const socket = MeshBuilder.CreateIcoSphere(`${name}Socket`, { radius: wide * 0.13, subdivisions: 1, flat: true }, scene);
    socket.scaling.z = 0.5;
    socket.position.set(side * wide * 0.2, wide * 0.02, wide * 0.4);
    socket.material = getMaterialFactory().get("cloth", SOCKET_COLOR);
    socket.parent = cranium;
    parts.push(socket);
  }
  return parts;
}

/** Hangs the unit's necklace (spec at CRITTER_NECKLACE) on a bare tribesman, parented to the torso joint. Empty when he wears none. */
export function dressTribalNecklace(scene: Scene, body: ArticulatedBody, unitId: string): Mesh[] {
  if (NECKLACES[unitId] === "bones") return boneNecklace(scene, body);
  if (NECKLACES[unitId] === "fang") return fangNecklace(scene, body);
  if (NECKLACES[unitId] === "tusks") return tuskNecklace(scene, body);
  if (NECKLACES[unitId] !== "critter_skulls") return [];
  const added: Mesh[] = [];
  const band = trunkBand(body, 0.6, 0.9);
  const top = trunkBand(body, 0.9, 1.05);
  const { trunk } = band;
  const head = headWide(body);
  const skullWide = head * CRITTER_NECKLACE.skull;
  const thick = trunk * CRITTER_NECKLACE.strap;
  const neckX = head * 0.42;
  const front = band.maxZ + thick * 0.6;
  const back = Math.min(top.minZ, band.minZ) - thick * 0.6;
  const midY = trunk * (1 - CRITTER_NECKLACE.drop);
  const sideY = midY + trunk * CRITTER_NECKLACE.lift;
  const sideX = band.halfX * CRITTER_NECKLACE.spread;
  const over = trunk;
  // The strap: from the nape over each shoulder by the neck, down onto the chest and across it through the three skulls' orbits
  const path = [
    new Vector3(0, over - thick, back),
    new Vector3(neckX, over + thick * 0.5, (back + front) * 0.5),
    new Vector3(sideX * 1.05, sideY + trunk * 0.03, front),
    new Vector3(sideX * 0.5, (sideY + midY) * 0.5, front),
    new Vector3(0, midY, front),
    new Vector3(-sideX * 0.5, (sideY + midY) * 0.5, front),
    new Vector3(-sideX * 1.05, sideY + trunk * 0.03, front),
    new Vector3(-neckX, over + thick * 0.5, (back + front) * 0.5),
    new Vector3(0, over - thick, back),
  ].map((p) => p.add(new Vector3(band.midX, 0, 0)));
  const strap = MeshBuilder.CreateTube("necklaceStrap", { path, radius: thick * 0.5, tessellation: 5, cap: Mesh.CAP_ALL }, scene);
  strap.material = ropeMaterial();
  strap.parent = body.torso;
  added.push(strap);
  // The three skulls on its front run, standing off the chest by about half their depth, the side ones turned a little outward
  const spots = [new Vector3(-sideX, sideY, 0), new Vector3(0, midY, 0), new Vector3(sideX, sideY, 0)];
  spots.forEach((at, i) => {
    const parts = boneSkull(scene, "necklaceSkull", skullWide * (i === 1 ? 1.1 : 1), 17.3 + i * 5.1);
    const skull = parts[0];
    skull.position.set(band.midX + at.x, at.y - skullWide * 0.1, front + skullWide * 0.35);
    skull.rotation.set(0.15, (i - 1) * 0.5, 0);
    skull.parent = body.torso;
    added.push(...parts);
  });
  return added;
}

/** The bone necklace (spec at BONE_NECKLACE), parented to the torso joint. */
function boneNecklace(scene: Scene, body: ArticulatedBody): Mesh[] {
  const added: Mesh[] = [];
  const band = trunkBand(body, 0.6, 0.9);
  const top = trunkBand(body, 0.9, 1.05);
  const { trunk } = band;
  const head = headWide(body);
  const headTall = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2 * body.headMesh.scaling.y;
  const thick = trunk * BONE_NECKLACE.strap;
  const neckX = head * 0.42;
  // Over a tunic's front (its sleeve stands about 8% off the trunk), then the bones a little further out
  const front = band.maxZ * 1.1 + thick;
  const back = Math.min(top.minZ, band.minZ) - thick * 0.6;
  const footY = trunk * (1 - BONE_NECKLACE.drop);
  const boneThick = head * BONE_NECKLACE.thick;
  const step = boneThick * BONE_NECKLACE.gap;
  const off = (band.maxZ - band.minZ) * BONE_NECKLACE.off;
  // The strap: from the nape over each shoulder by the neck and down in a short V to its foot high on the chest
  const path = [
    new Vector3(0, trunk - thick, back),
    new Vector3(neckX, trunk + thick * 0.5, (back + front) * 0.5),
    new Vector3(neckX * 0.9, trunk * 0.97, front),
    new Vector3(step * 0.8, footY + trunk * 0.03, front + off * 0.5),
    new Vector3(0, footY, front + off * 0.6),
    new Vector3(-step * 0.8, footY + trunk * 0.03, front + off * 0.5),
    new Vector3(-neckX * 0.9, trunk * 0.97, front),
    new Vector3(-neckX, trunk + thick * 0.5, (back + front) * 0.5),
    new Vector3(0, trunk - thick, back),
  ].map((p) => p.add(new Vector3(band.midX, 0, 0)));
  const rope = ropeMaterial();
  const strap = MeshBuilder.CreateTube("necklaceStrap", { path, radius: thick * 0.5, tessellation: 5, cap: Mesh.CAP_ALL }, scene);
  strap.material = rope;
  strap.parent = body.torso;
  added.push(strap);
  // The twine bar across the V's foot that the three bones hang from
  const barZ = front + off;
  const bar = MeshBuilder.CreateTube("necklaceTwine", {
    path: [new Vector3(band.midX - step * 1.35, footY + trunk * 0.015, barZ), new Vector3(band.midX, footY - trunk * 0.005, barZ), new Vector3(band.midX + step * 1.35, footY + trunk * 0.015, barZ)],
    radius: thick * 0.45, tessellation: 5, cap: Mesh.CAP_ALL,
  }, scene);
  bar.material = rope;
  bar.parent = body.torso;
  added.push(bar);
  // The three bones, hanging side by side from the bar, the middle one longest, fanned a little
  for (const i of [-1, 0, 1]) {
    const long = headTall * BONE_NECKLACE.bone * (i === 0 ? BONE_NECKLACE.middle : 1);
    const parts = boneStick(scene, "necklaceBone", long, boneThick);
    const shaft = parts[0];
    shaft.rotation.set(-0.12, 0, i * 0.12);
    shaft.position.set(band.midX + i * step + i * Math.sin(0.12) * long * 0.5, footY + boneThick * 0.6 - long * 0.5, barZ + boneThick * 0.3 + Math.sin(0.12) * long * 0.5);
    shaft.parent = body.torso;
    added.push(...parts);
  }
  return added;
}

/** The fang necklace (spec at FANG_NECKLACE), parented to the torso joint. */
function fangNecklace(scene: Scene, body: ArticulatedBody): Mesh[] {
  const added: Mesh[] = [];
  const band = trunkBand(body, 0.6, 0.9);
  const top = trunkBand(body, 0.9, 1.05);
  const { trunk } = band;
  const head = headWide(body);
  const headTall = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2 * body.headMesh.scaling.y;
  const thick = trunk * FANG_NECKLACE.strap;
  const neckX = head * 0.42;
  const front = band.maxZ + thick;
  const back = Math.min(top.minZ, band.minZ) - thick * 0.6;
  const footY = trunk * (1 - FANG_NECKLACE.drop);
  const off = (band.maxZ - band.minZ) * FANG_NECKLACE.off;
  // The strap: from the nape over each shoulder by the neck and down in a long V to its foot on the middle of the chest
  const path = [
    new Vector3(0, trunk - thick, back),
    new Vector3(neckX, trunk + thick * 0.5, (back + front) * 0.5),
    new Vector3(neckX * 0.9, trunk * 0.97, front),
    new Vector3(0, footY, front + off),
    new Vector3(-neckX * 0.9, trunk * 0.97, front),
    new Vector3(-neckX, trunk + thick * 0.5, (back + front) * 0.5),
    new Vector3(0, trunk - thick, back),
  ].map((p) => p.add(new Vector3(band.midX, 0, 0)));
  const rope = ropeMaterial();
  const strap = MeshBuilder.CreateTube("necklaceStrap", { path, radius: thick * 0.5, tessellation: 5, cap: Mesh.CAP_ALL }, scene);
  strap.material = rope;
  strap.parent = body.torso;
  added.push(strap);
  // The fang: a curved four-sided horn from a thick root at the V's foot down to a point, its tip swung aside and a little back toward the chest
  const fangThick = head * FANG_NECKLACE.thick;
  const long = headTall * FANG_NECKLACE.long;
  const root = new Vector3(band.midX, footY - fangThick * 0.2, front + off);
  const tip = new Vector3(band.midX + long * FANG_NECKLACE.curl, footY - long, front + off * 0.7);
  const ctrl = new Vector3(band.midX - long * FANG_NECKLACE.curl * 0.35, footY - long * 0.6, front + off * 1.15);
  added.push(...hornOnRope(scene, body, "necklaceFang", root, ctrl, tip, fangThick, thick));
  return added;
}

/** A curved four-sided horn (fang, tusk) from a thick root down a quadratic curve to a point, a turn of rope round its root; parented to the torso joint. */
function hornOnRope(scene: Scene, body: ArticulatedBody, name: string, root: Vector3, ctrl: Vector3, tip: Vector3, rootThick: number, ropeThick: number): Mesh[] {
  const curve: Vector3[] = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    curve.push(root.scale((1 - t) * (1 - t)).add(ctrl.scale(2 * t * (1 - t))).add(tip.scale(t * t)));
  }
  const horn = MeshBuilder.CreateTube(name, { path: curve, tessellation: 5, cap: Mesh.CAP_START, radiusFunction: (i) => rootThick * 0.5 * Math.max(0.05, 1 - i / 8) }, scene);
  horn.convertToFlatShadedMesh();
  horn.material = boneMaterial();
  horn.parent = body.torso;
  const wrap = MeshBuilder.CreateTorus(`${name}Rope`, { diameter: rootThick * 1.1, thickness: ropeThick * 1.1, tessellation: 8 }, scene);
  wrap.position.copyFrom(curve[1]);
  wrap.material = ropeMaterial();
  wrap.parent = body.torso;
  return [horn, wrap];
}

/** The tusk necklace (spec at TUSK_NECKLACE), parented to the torso joint. */
function tuskNecklace(scene: Scene, body: ArticulatedBody): Mesh[] {
  const added: Mesh[] = [];
  const band = trunkBand(body, 0.6, 0.9);
  const top = trunkBand(body, 0.9, 1.05);
  const { trunk } = band;
  const head = headWide(body);
  const headTall = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2 * body.headMesh.scaling.y;
  const thick = trunk * TUSK_NECKLACE.strap;
  const neckX = head * 0.42;
  const front = band.maxZ + thick;
  const back = Math.min(top.minZ, band.minZ) - thick * 0.6;
  const footY = trunk * (1 - TUSK_NECKLACE.drop);
  const off = (band.maxZ - band.minZ) * TUSK_NECKLACE.off;
  const step = head * TUSK_NECKLACE.gap;
  // The rope: from the nape over each shoulder by the neck, down the chest and across it in a shallow U through the three roots
  const path = [
    new Vector3(0, trunk - thick, back),
    new Vector3(neckX, trunk + thick * 0.5, (back + front) * 0.5),
    new Vector3(neckX * 1.05, trunk * 0.95, front),
    new Vector3(step * 1.6, footY + trunk * 0.05, front + off * 0.6),
    new Vector3(step, footY + trunk * 0.015, front + off),
    new Vector3(0, footY, front + off),
    new Vector3(-step, footY + trunk * 0.015, front + off),
    new Vector3(-step * 1.6, footY + trunk * 0.05, front + off * 0.6),
    new Vector3(-neckX * 1.05, trunk * 0.95, front),
    new Vector3(-neckX, trunk + thick * 0.5, (back + front) * 0.5),
    new Vector3(0, trunk - thick, back),
  ].map((p) => p.add(new Vector3(band.midX, 0, 0)));
  const strap = MeshBuilder.CreateTube("necklaceStrap", { path, radius: thick * 0.5, tessellation: 5, cap: Mesh.CAP_ALL }, scene);
  strap.material = ropeMaterial();
  strap.parent = body.torso;
  added.push(strap);
  // The three tusks, point down, each tip curling out to its own side (the middle one forward) and a little toward the viewer
  const tuskThick = head * TUSK_NECKLACE.thick;
  for (const i of [-1, 0, 1]) {
    const long = headTall * TUSK_NECKLACE.long * (i === 0 ? 1 : TUSK_NECKLACE.side);
    const x = band.midX + i * step;
    const y = footY + (i === 0 ? 0 : trunk * 0.015) - tuskThick * 0.2;
    const z = front + off;
    const swing = (i === 0 ? 0.15 : i) * long * TUSK_NECKLACE.curl;
    const root = new Vector3(x, y, z);
    const ctrl = new Vector3(x - swing * 0.3, y - long * 0.6, z + off * 0.3);
    const tip = new Vector3(x + swing, y - long, z + off * 0.6);
    added.push(...hornOnRope(scene, body, "necklaceTusk", root, ctrl, tip, tuskThick, thick));
  }
  return added;
}

/*
 * Long messy hair (tribal.stoner.blue.png, card Appearance: "long, messy brown hair ... a darker shade of brown"): a jittered faceted cap over the crown and
 * back of the head and LONG_HAIR.strands thick four-sided locks hanging from round its sides and back to the shoulders, the face's sector (LONG_HAIR.face
 * radians either side of the front) left bare but for LONG_HAIR.fringe short locks over the brow. Locks LONG_HAIR.long head heights long (each its own share
 * shorter or longer), LONG_HAIR.thick head widths across at the root. Dark brown, self-lit so it does not go black in the shade.
 */
const LONG_HAIR = { strands: 17, face: 0.8, fringe: 4, long: 1.05, thick: 0.32 };
const LONG_HAIR_COLOR = new Color3(0.3, 0.18, 0.1);
/*
 * The spear thrower's tusk headband (tribal.spear_thrower.blue.png, card Appearance: "a pair of animal tusks wrapped with straps and ropes on the side of
 * their head like a headband"): a bare head (no mop), a brown strap round it TUSK_BAND.band of the head's height above its middle, and a pale curved tusk
 * standing up each side from the cheek, bowed outward, its tip TUSK_BAND.rise head heights over its root and a little back; TUSK_BAND.thick head widths
 * across at the root, tapering to a point; a turn of rope round each tusk where the strap crosses it.
 * 363 [S] hung tusks (critic 360: small white nubs pointing up off the band; tribal.spear_thrower.red.png: large tan tusks strapped to the band's sides,
 * hanging down past the eyes to the cheeks): each tusk's thick root now sits on the band at the side of the head, .rootOut of the half-width out and
 * .rootAhead of the half-depth forward, and the tusk hangs down .drop head heights to its point by the cheek, bowed out .bow head widths at its middle and
 * the point hooked forward .hook of the half-depth; .thick head widths across at the root. Strapped on with .turns rope turns down its root.
 * Tan (.tan, self-lit .glow), not the white bone.
 */
const TUSK_BAND = { band: 0.45, strap: 0.1, rootOut: 1.06, rootAhead: 0.2, drop: 0.78, bow: 0.16, hook: 0.55, thick: 0.34, turns: 2, tan: new Color3(0.78, 0.66, 0.48), glow: 0.22 };
const BAND_COLOR = new Color3(0.45, 0.27, 0.16);
/*
 * The clubber's hair and beard (tribal.clubber.blue.png, card Appearance: "long, unkempt Tribal brown hair"; the stoner's card: "reminiscent of that of the
 * Clubber but without the beard and with a darker shade of brown"): the same long locks in a lighter brown (CLUBBER_HAIR_COLOR), and a full beard: a jittered
 * faceted chunk over the jaw from cheek to cheek under the eyes, BEARD.down head heights below the chin, and BEARD.locks short locks hanging off its foot.
 */
const CLUBBER_HAIR_COLOR = new Color3(0.4, 0.25, 0.15);
const BEARD = { down: 0.32, wide: 1.0, deep: 0.5, locks: 5, lockLong: 0.3, jitter: 0.15 };
/*
 * The chieftain's beard (tribal.chieftain.blue.png, card Appearance: "a chestnut beard"): the clubber's beard chunk and locks alone, no hair (the skull helm is
 * his crown), in a redder chestnut brown, under the eyes below the helm's snout.
 */
const CHESTNUT = new Color3(0.52, 0.27, 0.14);
/*
 * The painter's hair (332; renaissance.painter.red.png: long dark-brown hair falling from under the beret to the shoulders, round the sides and back, the
 * face bare): the stoner's long locks in a near-black brown (PAINTER_HAIR), with no fringe (the beret sits on the brow) and the cap hidden under the beret.
 */
const PAINTER_HAIR = new Color3(0.17, 0.11, 0.08);
/*
 * [S] fencer's hair and moustache (335; renaissance.fencer.blue.png: dark-brown hair falling from under the hat brim to the shoulders round the sides and
 * back, the face bare; a thin black moustache over the mouth, its ends curled up at the cheeks). The painter's dark locks (no fringe, under the hat), and
 * a curled moustache: two tapering tubes from the middle of the upper lip MOUSTACHE.y half-heights under the head's middle, each swept out MOUSTACHE.span
 * of the half-width and round the face, its last MOUSTACHE.turn of the way curled up MOUSTACHE.curl half-heights; MOUSTACHE.thick of the head across at
 * the root, standing MOUSTACHE.proud of the half-depth off the middle so it shows side-on as a dark hook under the eye.
 */
const MOUSTACHE = { y: -0.38, span: 0.7, turn: 0.4, curl: 0.42, thick: 0.1, proud: 1.14 };
const MOUSTACHE_COLOR = new Color3(0.07, 0.05, 0.04);
/*
 * [S] musketeer's moustache and goatee (336; renaissance.musketeer.blue.png, card Appearance "a black mustache": under the morion a dark moustache curled
 * up at the cheeks and a pointed goatee hanging from the chin; no hair shows). The fencer's curled moustache (MOUSTACHE), and a goatee: a four-sided
 * wedge GOATEE.wide of the head across at the lip, its point GOATEE.down half-heights under the chin, standing GOATEE.proud of the half-depth forward and
 * tipped out GOATEE.tip so it hangs clear of the jaw and shows from the side and from behind.
 */
const GOATEE = { wide: 0.42, down: 0.55, proud: 0.86, tip: 0.35 };
/*
 * [S] halfling's shaggy hair (340; farmer.halfling.red.png, card Appearance "a bushy brown hair"): a messy brown mop wider than the head, its locks
 * sticking out every way. A jittered faceted cap SHAGGY.cap heads wide over the crown, and SHAGGY.locks short four-sided spikes all round its rim
 * (SHAGGY.long of the head long, the front SHAGGY.front of that so a fringe sits over the brow above the eyes), each splayed out SHAGGY.splay rad plus
 * its own hashed share and tilted a hashed bit sideways so no two lie alike. Brown SHAGGY_COLOR, self-lit so it reads brown in the shade.
 */
const SHAGGY = { cap: 1.32, locks: 26, long: 0.5, front: 0.5, thick: 0.3, splay: 0.55 };
const SHAGGY_COLOR = new Color3(0.38, 0.21, 0.12);
/*
 * [S] hay baler's bowl cut (341; farmer.hay_baler.blue.png, card Appearance "a brown bowl cut hair"): a round auburn-brown helmet of hair, fuller than the
 * head, cut dead straight across the brow just over the eyes and hanging down over the ears and the nape. A faceted dome BOWL.dome heads wide over the crown,
 * its rim at BOWL.fringe of the half-height (the fringe line), and a skirt wall round the sides and back from that rim down to BOWL.hang below the head's
 * middle, flaring BOWL.flare at its foot; the skirt leaves the face open across BOWL.face of the round. Auburn BOWL_COLOR, self-lit so it reads brown.
 */
const BOWL_SHARES = { dome: 1.3, crown: 0.78, fringe: 0.5, hang: 0.4, flare: 1.08, face: 0.36 };
const BOWL_COLOR = new Color3(0.45, 0.22, 0.15);
/*
 * [S] potion seller's hair cap (343; farmer.potion_seller.red.png, card Appearance "an unusually round head with umber brown hair"): a close round cap of
 * umber hair over the crown, a little fuller than the head, its edge level across the brow well above the eyes and down to the tops of the ears at the
 * sides and back; no hood, no collar. The bowl cut's dome and skirt with its own shares: HAIR_CAP.dome round, .crown tall, rim at .fringe of the
 * half-height, skirt down to .hang below the middle, face open across .face of the round. Umber HAIR_CAP_COLOR, self-lit so it reads brown, not black.
 */
const HAIR_CAP = { dome: 1.14, crown: 0.62, fringe: 0.62, hang: -0.12, flare: 1.02, face: 0.42 };
const HAIR_CAP_COLOR = new Color3(0.36, 0.25, 0.17);
const HAIR_STYLES: Record<string, "long" | "long_beard" | "dreads" | "dreads_beard" | "tusk_band" | "beard" | "long_dark" | "long_dark_moustache" | "moustache_goatee" | "shaggy" | "bowl" | "cap"> = {
  "farmer.halfling": "shaggy", "farmer.hay_baler": "bowl", "farmer.potion_seller": "cap",
  "tribal.stoner": "dreads", "tribal.clubber": "dreads_beard", "tribal.spear_thrower": "tusk_band", "tribal.chieftain": "beard",
  "renaissance.painter": "long_dark", "renaissance.fencer": "long_dark_moustache", "renaissance.musketeer": "moustache_goatee",
};

/** The tusk headband (spec at TUSK_BAND), parented to the head. */
function tuskBand(scene: Scene, body: ArticulatedBody): Mesh[] {
  const added: Mesh[] = [];
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const W = e.x * 2, H = e.y * 2;
  const bandY = e.y * TUSK_BAND.band;
  const strap = MeshBuilder.CreateBox("tuskBandStrap", { width: W * 1.08, height: H * TUSK_BAND.strap, depth: e.z * 2 * 1.08 }, scene);
  strap.position.y = bandY;
  strap.material = getMaterialFactory().get("cloth", BAND_COLOR, { emissiveIntensity: 0.15 });
  strap.parent = body.headMesh;
  added.push(strap);
  for (const side of [-1, 1]) {
    // Root on the band at the head's side, a little above it; hanging down past the eye, bowed out, the point hooked forward by the cheek
    const T = TUSK_BAND;
    const root = new Vector3(side * e.x * T.rootOut, bandY + H * 0.08, e.z * T.rootAhead);
    const tip = new Vector3(side * e.x * (T.rootOut + 0.05), root.y - H * T.drop, e.z * T.hook);
    const ctrl = new Vector3(side * (e.x * T.rootOut + W * T.bow), (root.y + tip.y) * 0.5, e.z * (T.rootAhead - 0.1));
    const path: Vector3[] = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      path.push(root.scale((1 - t) * (1 - t)).add(ctrl.scale(2 * t * (1 - t))).add(tip.scale(t * t)));
    }
    const tusk = MeshBuilder.CreateTube("tusk", { path, tessellation: 6, cap: Mesh.CAP_START, radiusFunction: (i) => W * T.thick * 0.5 * Math.max(0.08, 1 - (i / 8) ** 1.5) }, scene);
    tusk.convertToFlatShadedMesh();
    tusk.material = getMaterialFactory().get("cloth", T.tan, { emissiveIntensity: T.glow });
    tusk.parent = body.headMesh;
    added.push(tusk);
    // The rope turns strapping its root to the band: the first where the strap crosses it, the next a little lower
    for (let r = 0; r < T.turns; r++) {
      const k = Math.min(8, r + 1);
      const wrap = MeshBuilder.CreateTorus("tuskRope", { diameter: W * T.thick * Math.max(0.08, 1 - (k / 8) ** 1.5) * 1.12, thickness: W * 0.05, tessellation: 8 }, scene);
      wrap.position.copyFrom(path[k]);
      wrap.material = ropeMaterial();
      wrap.parent = body.headMesh;
      added.push(wrap);
    }
  }
  return added;
}

/** The halfling's shaggy mop (spec at SHAGGY), parented to the head. */
function shaggyHair(scene: Scene, body: ArticulatedBody): Mesh[] {
  const added: Mesh[] = [];
  const hair = getMaterialFactory().get("cloth", SHAGGY_COLOR, { emissiveIntensity: 0.2 });
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const W = e.x * 2, H = e.y * 2;
  const cap = MeshBuilder.CreateIcoSphere(`${body.headMesh.name}_hair`, { radius: 1, subdivisions: 1, flat: true }, scene);
  jitterVertices(cap, 0.2, 4.4, e.x * SHAGGY.cap, e.y * 0.78, e.z * SHAGGY.cap);
  cap.position.set(0, e.y * 0.72, -e.z * 0.1);
  cap.material = hair;
  cap.parent = body.headMesh;
  added.push(cap);
  for (let i = 0; i < SHAGGY.locks; i++) {
    const a = (i + 0.5) / SHAGGY.locks * Math.PI * 2; // 0 = the face (+z)
    const share = hashShare(6.7, i * 1.3, i * 0.7, 2);
    const facing = Math.max(0, Math.cos(a)); // 1 at the brow
    const long = H * SHAGGY.long * (1 - (1 - SHAGGY.front) * facing) * (0.75 + 0.5 * share);
    const root = W * SHAGGY.thick * (0.8 + 0.4 * hashShare(2.9, i, 3, i));
    const m = MeshBuilder.CreateCylinder("hairShag", { height: long, diameterTop: root, diameterBottom: 0, tessellation: 4 }, scene);
    m.rotation.y = share * 1.5;
    m.bakeCurrentTransformIntoVertices();
    m.convertToFlatShadedMesh();
    m.material = hair;
    m.parent = body.headMesh;
    added.push(m);
    const sx = Math.sin(a), cz = Math.cos(a);
    const out = SHAGGY.splay * (0.7 + 0.6 * share) + 0.25 * facing;
    const sway = (hashShare(8.3, i, i * 2, 5) - 0.5) * 0.6;
    m.rotation.set(-cz * out + sx * sway, 0, sx * out + cz * sway);
    // Roots round the cap's rim, the fringe's a little higher so the eyes stay clear
    const rootY = e.y * (0.5 + 0.35 * facing);
    const r = 1.05;
    m.position.set(sx * e.x * r + sx * Math.sin(out) * long * 0.5, rootY - Math.cos(out) * long * 0.5, cz * e.z * r - e.z * 0.05 + cz * Math.sin(out) * long * 0.5);
  }
  return added;
}

/** The hay baler's bowl cut (spec at BOWL), or with HAIR_CAP's shares the potion seller's close cap, parented to the head. */
function bowlCut(scene: Scene, body: ArticulatedBody, BOWL = BOWL_SHARES, color = BOWL_COLOR): Mesh[] {
  const hair = getMaterialFactory().get("cloth", color, { emissiveIntensity: 0.2 });
  hair.backFaceCulling = false;
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const rimY = e.y * BOWL.fringe;
  const dome = MeshBuilder.CreateSphere(`${body.headMesh.name}_hair`, {
    diameterX: 2 * e.x * BOWL.dome, diameterY: 2 * e.y * BOWL.crown, diameterZ: 2 * e.z * BOWL.dome, segments: 6, slice: 0.5,
  }, scene);
  dome.convertToFlatShadedMesh();
  dome.position.set(0, rimY, -e.z * 0.04);
  dome.material = hair;
  dome.parent = body.headMesh;
  // The skirt: an open wall round the sides and back, its gap centred on the face (+z)
  const arc = 1 - BOWL.face;
  const tall = rimY + e.y * BOWL.hang;
  const skirt = MeshBuilder.CreateCylinder("hairBowl", {
    height: tall, diameterTop: 2 * e.x * BOWL.dome, diameterBottom: 2 * e.x * BOWL.dome * BOWL.flare, tessellation: 12, arc, enclose: false,
    sideOrientation: Mesh.DOUBLESIDE,
  }, scene);
  skirt.rotation.y = (1 - arc) * Math.PI - Math.PI / 2;
  skirt.bakeCurrentTransformIntoVertices();
  skirt.convertToFlatShadedMesh();
  skirt.scaling.set(1, 1, e.z / e.x);
  skirt.position.set(0, rimY - tall / 2, -e.z * 0.04);
  skirt.material = hair;
  skirt.parent = body.headMesh;
  return [dome, skirt];
}

/** The unit's own hair or headgear (LONG_HAIR, TUSK_BAND), parented to the head; null when he keeps the common mop. */
export function dressTribalHair(scene: Scene, body: ArticulatedBody, unitId: string): Mesh[] | null {
  if (HAIR_STYLES[unitId] === "tusk_band") return tuskBand(scene, body);
  if (HAIR_STYLES[unitId] === "beard") return tribalBeard(scene, body, getMaterialFactory().get("cloth", CHESTNUT, { emissiveIntensity: 0.18 }));
  const style = HAIR_STYLES[unitId];
  if (style === "dreads") return dreadMop(scene, body, LONG_HAIR_COLOR);
  // [S] the Clubber's mop (361; tribal.clubber.red.png: an unkempt curly dreadlock mop wider than the head, framing the face over the beard): the same mop in
  // his lighter brown, the locks DREAD_MOP.clubber head heights, over his beard
  if (style === "dreads_beard") {
    const hair = getMaterialFactory().get("cloth", DREAD_MOP.clubberColor, { emissiveIntensity: DREAD_MOP.glow });
    return [...curlyMop(scene, body, hair), ...tribalBeard(scene, body, hair)];
  }
  if (style === "shaggy") return shaggyHair(scene, body);
  if (style === "bowl") return bowlCut(scene, body);
  if (style === "cap") return bowlCut(scene, body, HAIR_CAP, HAIR_CAP_COLOR);
  if (style === "moustache_goatee") return [...curledMoustache(scene, body), goatee(scene, body)];
  if (style !== "long" && style !== "long_beard" && style !== "long_dark" && style !== "long_dark_moustache") return null;
  const dark = style === "long_dark" || style === "long_dark_moustache";
  const added: Mesh[] = [];
  const hair = getMaterialFactory().get("cloth", style === "long_beard" ? CLUBBER_HAIR_COLOR : dark ? PAINTER_HAIR : LONG_HAIR_COLOR, { emissiveIntensity: 0.18 });
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const halfX = e.x, halfY = e.y, halfZ = e.z;
  const W = halfX * 2, H = halfY * 2;
  // The cap: a faceted dome over the crown, set back so the brow stays bare
  const cap = MeshBuilder.CreateIcoSphere(`${body.headMesh.name}_hair`, { radius: 1, subdivisions: 1, flat: true }, scene);
  jitterVertices(cap, 0.14, 7.7, halfX * 1.22, halfY * 0.75, halfZ * 1.22);
  cap.position.set(0, halfY * 0.7, -halfZ * 0.08);
  cap.material = hair;
  cap.parent = body.headMesh;
  added.push(cap);
  const lock = (name: string, long: number, root: number, twist = 0) => {
    const m = MeshBuilder.CreateCylinder(name, { height: long, diameterTop: root, diameterBottom: root * 0.45, tessellation: 4 }, scene);
    m.rotation.y = twist;
    m.bakeCurrentTransformIntoVertices();
    m.convertToFlatShadedMesh();
    m.material = hair;
    m.parent = body.headMesh;
    added.push(m);
    return m;
  };
  // The locks: round the sides and back from the cap's rim, hanging to the shoulders, splayed a little outward
  const sweep = Math.PI * 2 - LONG_HAIR.face * 2;
  for (let i = 0; i < LONG_HAIR.strands; i++) {
    const a = LONG_HAIR.face + (i + 0.5) / LONG_HAIR.strands * sweep;
    const share = hashShare(3.1, i * 1.7, i * 0.3, 1);
    const long = H * LONG_HAIR.long * (0.85 + 0.3 * share);
    const m = lock("hairLock", long, W * LONG_HAIR.thick * (0.85 + 0.3 * hashShare(5.3, i, 2, i)), share * 1.5);
    const sx = Math.sin(a), cz = Math.cos(a);
    const out = 0.1 + 0.18 * share;
    m.rotation.set(-cz * out, 0, sx * out);
    const rootY = halfY * (0.55 - 0.1 * share);
    m.position.set(sx * halfX * 1.08 + sx * Math.sin(out) * long * 0.5, rootY - long * 0.5, cz * halfZ * 1.08 - cz * Math.sin(out) * long * 0.5 - halfZ * 0.05);
  }
  // The fringe: a few short locks over the brow, above the eyes
  for (let i = 0; i < (dark ? 0 : LONG_HAIR.fringe); i++) {
    const x = ((i + 0.5) / LONG_HAIR.fringe - 0.5) * W * 0.9;
    const long = H * 0.28 * (0.8 + 0.4 * hashShare(9.1, i, 1, 3));
    const m = lock("hairFringe", long, W * LONG_HAIR.thick * 0.8);
    m.rotation.set(-0.35, 0, x / W * 0.6);
    m.position.set(x, halfY * 1.0 - long * 0.45, halfZ * 1.02);
  }
  if (style === "long_beard") added.push(...tribalBeard(scene, body, hair));
  if (style === "long_dark_moustache") added.push(...curledMoustache(scene, body));
  return added;
}

/*
 * [S] the dreadlock mop (361; tribal.stoner.red.png: a messy dark-brown dreadlock mop wider than the head, framing an open face, eyes clear, locks to the
 * shoulders; the old long hair hung straight flat strands from a cap that ran down over the brow, so with the head bowed it read as a slab over the face).
 *   - cap: a jittered faceted dome DREAD_MOP.cap (x, y, z) of the head's half extents, its middle .capUp of the half height up and .capBack of the half depth
 *     back, so its front edge stops above the brow;
 *   - locks: DREAD_MOP.locks thick kinked clumps round the sides and back (the face's sector, .face rad either side of the front, left open), each two
 *     tapered five-sided lengths: the first out and down from the cap's rim, splayed .splay off the hang so the mop stands wider than the head, the second
 *     bent .kink back toward the hang, the pair .long head heights in all (its own share shorter or longer), .thick head widths across at the root;
 *   - fringe: .fringe short clumps over the brow tilted forward, ending above the eyes (.fringeLong head heights);
 *   - tufts: .tufts short clumps standing out of the crown at odd angles for a ragged top.
 * Self-lit (.glow) so it stays brown in the shade.
 */
const DREAD_MOP = {
  cap: [1.32, 0.66, 1.3] as const, capUp: 0.78, capBack: 0.2, jitter: 0.12,
  locks: 20, face: 0.85, splay: 0.42, kink: 0.35, long: 0.95, thick: 0.3,
  fringe: 5, fringeLong: 0.17, tufts: 7, glow: 0.18, clubber: 0.8,
  // the clubber's mop splayed wider and in a darker brown (critic 361 fallout: a dark mop wider than the head), a shade lighter than the stoner's
  clubberSplay: 0.62, clubberColor: new Color3(0.34, 0.2, 0.12),
};

/** A dreadlock mop (spec at DREAD_MOP), parented to the head; `long` overrides the locks' length in head heights. */
function dreadMop(scene: Scene, body: ArticulatedBody, color: Color3, long = DREAD_MOP.long, splayed = DREAD_MOP.splay): Mesh[] {
  const D = DREAD_MOP;
  const added: Mesh[] = [];
  const hair = getMaterialFactory().get("cloth", color, { emissiveIntensity: D.glow });
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const halfX = e.x, halfY = e.y, halfZ = e.z;
  const W = halfX * 2, H = halfY * 2;
  const cap = MeshBuilder.CreateIcoSphere(`${body.headMesh.name}_hair`, { radius: 1, subdivisions: 1, flat: true }, scene);
  jitterVertices(cap, D.jitter, 13.3, halfX * D.cap[0], halfY * D.cap[1], halfZ * D.cap[2]);
  cap.position.set(0, halfY * D.capUp, -halfZ * D.capBack);
  cap.material = hair;
  cap.parent = body.headMesh;
  added.push(cap);
  const up = Vector3.Up();
  // One tapered five-sided length from `from` along `dir`; returns its far end
  const clump = (name: string, from: Vector3, dir: Vector3, length: number, root: number, tip: number, serial: number): Vector3 => {
    const d = dir.normalize();
    const m = MeshBuilder.CreateCylinder(name, { height: length, diameterTop: root, diameterBottom: tip, tessellation: 5 }, scene);
    jitterVertices(m, 0.1, serial);
    // the cylinder's +y (its root, the wide end) points back up the clump: it hangs from `from` toward `from + d * length`
    m.rotationQuaternion = Quaternion.Identity();
    Quaternion.FromUnitVectorsToRef(up, d.scale(-1), m.rotationQuaternion);
    m.position = from.add(d.scale(length * 0.5));
    m.material = hair;
    m.parent = body.headMesh;
    added.push(m);
    return from.add(d.scale(length));
  };
  const sweep = Math.PI * 2 - D.face * 2;
  for (let i = 0; i < D.locks; i++) {
    const a = D.face + (i + 0.5) / D.locks * sweep + (hashShare(2.7, i, 4, 1) - 0.5) * 0.15;
    const share = hashShare(3.1, i * 1.7, i * 0.3, 1);
    const sx = Math.sin(a), cz = Math.cos(a);
    const total = H * long * (0.8 + 0.4 * share);
    const root = W * D.thick * (0.85 + 0.3 * hashShare(5.3, i, 2, i));
    const rootY = halfY * (0.5 + 0.15 * hashShare(6.1, i, 3, 2));
    const from = new Vector3(sx * halfX * 1.12, rootY, cz * halfZ * 1.1 - halfZ * D.capBack * 0.5);
    const splay = splayed * (0.75 + 0.5 * share);
    const outward = new Vector3(sx, 0, cz);
    const first = new Vector3(0, -Math.cos(splay), 0).addInPlace(outward.scale(Math.sin(splay)));
    const bend = clump("hairDread", from, first, total * 0.5, root, root * 0.8, 20 + i);
    const kink = Math.max(0, splay - D.kink * (0.6 + 0.8 * hashShare(7.7, i, 5, 3)));
    const second = new Vector3(0, -Math.cos(kink), 0).addInPlace(outward.scale(Math.sin(kink)));
    clump("hairDread", bend, second, total * 0.5, root * 0.8, root * 0.45, 60 + i);
  }
  for (let i = 0; i < D.fringe; i++) {
    const x = ((i + 0.5) / D.fringe - 0.5) * W * 0.95;
    const length = H * D.fringeLong * (0.8 + 0.4 * hashShare(9.1, i, 1, 3));
    const from = new Vector3(x, halfY * 0.9, halfZ * 0.95);
    clump("hairFringe", from, new Vector3(x / W * 0.8, -1, 0.7), length, W * D.thick * 0.8, W * D.thick * 0.4, 100 + i);
  }
  for (let i = 0; i < D.tufts; i++) {
    const a = (i + 0.5) / D.tufts * Math.PI * 2;
    const from = new Vector3(Math.sin(a) * halfX * 0.6, halfY * (D.capUp + D.cap[1] * 0.75), Math.cos(a) * halfZ * 0.55 - halfZ * D.capBack);
    const dir = new Vector3(Math.sin(a) * 0.9, 0.45 + 0.4 * hashShare(4.4, i, 7, 1), Math.cos(a) * 0.9 - 0.2);
    clump("hairTuft", from, dir, H * 0.2 * (0.8 + 0.4 * hashShare(8.8, i, 2, 5)), W * D.thick * 0.7, W * D.thick * 0.3, 140 + i);
  }
  return added;
}

/*
 * [S] the Clubber's curly mop (366; tribal.clubber.red.png: an unkempt mop of short curly locks, dark brown, standing out round the head to about half a head
 * each side and down to the jaw, framing the face over the beard, a bushy crown; critic 362/365: the dreadlock mop hung as a straight curtain about head-wide).
 * Replaces his dreadMop with:
 *   - cap: the dread mop's dome, CURLY_MOP.cap of the head's half extents;
 *   - curls: CURLY_MOP.locks locks round the sides and back (the face's .face rad either side of the front left open), each three short tapered pieces of
 *     .long head heights in all (its own share longer or shorter): out from the cap's rim nearly level (.out rad off the hang), then down and round the head
 *     (.curl of the way sideways, alternating), then hooked back up and out, so every lock ends in a kink outward;
 *   - crown: .crown short two-piece tufts out of the top of the cap, out and up then over, so the top stands bushy and wider than the head.
 */
const CURLY_MOP = { cap: [1.4, 0.72, 1.36] as const, locks: 22, face: 0.72, out: 1.05, curl: 0.75, long: 0.78, thick: 0.27, crown: 9 };

/** The Clubber's curly mop (spec at CURLY_MOP), parented to the head. */
function curlyMop(scene: Scene, body: ArticulatedBody, hair: ReturnType<typeof boneMaterial>): Mesh[] {
  const C = CURLY_MOP;
  const added: Mesh[] = [];
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const halfX = e.x, halfY = e.y, halfZ = e.z;
  const W = halfX * 2, H = halfY * 2;
  const back = halfZ * DREAD_MOP.capBack;
  const cap = MeshBuilder.CreateIcoSphere(`${body.headMesh.name}_hair`, { radius: 1, subdivisions: 1, flat: true }, scene);
  jitterVertices(cap, DREAD_MOP.jitter, 17.9, halfX * C.cap[0], halfY * C.cap[1], halfZ * C.cap[2]);
  cap.position.set(0, halfY * DREAD_MOP.capUp, -back);
  cap.material = hair;
  cap.parent = body.headMesh;
  added.push(cap);
  const up = Vector3.Up();
  // One tapered five-sided piece from `from` along `dir`, its wide end at `from`; returns its far end
  const piece = (name: string, from: Vector3, dir: Vector3, length: number, root: number, tip: number, serial: number): Vector3 => {
    const d = dir.normalize();
    const m = MeshBuilder.CreateCylinder(name, { height: length, diameterTop: root, diameterBottom: tip, tessellation: 5 }, scene);
    jitterVertices(m, 0.12, serial);
    m.rotationQuaternion = Quaternion.Identity();
    Quaternion.FromUnitVectorsToRef(up, d.scale(-1), m.rotationQuaternion);
    m.position = from.add(d.scale(length * 0.5));
    m.material = hair;
    m.parent = body.headMesh;
    added.push(m);
    return from.add(d.scale(length * 0.9));
  };
  const sweep = Math.PI * 2 - C.face * 2;
  for (let i = 0; i < C.locks; i++) {
    const a = C.face + (i + 0.5) / C.locks * sweep + (hashShare(2.9, i, 4, 1) - 0.5) * 0.18;
    const share = hashShare(3.7, i * 1.3, i * 0.7, 1);
    const sx = Math.sin(a), cz = Math.cos(a);
    const outward = new Vector3(sx, 0, cz);
    const round = new Vector3(cz, 0, -sx).scale(i % 2 ? 1 : -1);
    const total = H * C.long * (0.8 + 0.4 * share);
    const root = W * C.thick * (0.85 + 0.3 * hashShare(5.7, i, 2, i));
    const rootY = halfY * (0.35 + 0.35 * hashShare(6.3, i, 3, 2));
    const from = new Vector3(sx * halfX * 1.15, rootY, cz * halfZ * 1.12 - back * 0.5);
    const out = C.out * (0.85 + 0.3 * share);
    const first = outward.scale(Math.sin(out)).addInPlace(new Vector3(0, -Math.cos(out), 0));
    const p1 = piece("hairCurl", from, first, total * 0.4, root, root * 0.85, 200 + i);
    const second = new Vector3(0, -1, 0).addInPlace(round.scale(C.curl)).addInPlace(outward.scale(0.3));
    const p2 = piece("hairCurl", p1, second, total * 0.34, root * 0.85, root * 0.65, 240 + i);
    const third = outward.scale(0.85).addInPlace(new Vector3(0, 0.45, 0)).addInPlace(round.scale(-0.4));
    piece("hairCurl", p2, third, total * 0.26, root * 0.65, root * 0.35, 280 + i);
  }
  for (let i = 0; i < C.crown; i++) {
    const a = (i + 0.5) / C.crown * Math.PI * 2 + 0.3;
    const sx = Math.sin(a), cz = Math.cos(a);
    const outward = new Vector3(sx, 0, cz);
    const from = new Vector3(sx * halfX * 0.75, halfY * (DREAD_MOP.capUp + C.cap[1] * 0.6), cz * halfZ * 0.7 - back);
    const long = H * 0.2 * (0.8 + 0.4 * hashShare(8.3, i, 2, 5));
    const tip = piece("hairTuft", from, outward.scale(0.9).addInPlace(new Vector3(0, 0.55, 0)), long, W * C.thick * 0.8, W * C.thick * 0.6, 320 + i);
    piece("hairTuft", tip, outward.scale(0.8).addInPlace(new Vector3(0, -0.6, 0)), long * 0.8, W * C.thick * 0.6, W * C.thick * 0.3, 340 + i);
  }
  return added;
}

/** The curled moustache (spec at MOUSTACHE), parented to the head. */
function curledMoustache(scene: Scene, body: ArticulatedBody): Mesh[] {
  const added: Mesh[] = [];
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const halfX = e.x, halfY = e.y, halfZ = e.z;
  const M = MOUSTACHE;
  const mat = getMaterialFactory().get("cloth", MOUSTACHE_COLOR, { emissiveIntensity: 0.1 });
  const steps = 8;
  for (const side of [-1, 1]) {
    const path: Vector3[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const out = Math.max(0, (t - (1 - M.turn)) / M.turn);
      // out along the lip and round the face, dipping a little at the middle of its run, then curled up at the end
      path.push(new Vector3(
        side * halfX * (0.04 + M.span * t),
        halfY * (M.y - 0.1 * Math.sin(Math.PI * Math.min(1, t / (1 - M.turn))) + M.curl * out * out),
        halfZ * (M.proud - 0.32 * t * t),
      ));
    }
    const tube = MeshBuilder.CreateTube("moustache", { path, tessellation: 5, cap: Mesh.CAP_ALL, radiusFunction: (i) => halfX * M.thick * (1 - 0.65 * i / steps) }, scene);
    tube.convertToFlatShadedMesh();
    tube.material = mat;
    tube.parent = body.headMesh;
    added.push(tube);
  }
  return added;
}

/** The pointed goatee (spec at GOATEE), parented to the head. */
function goatee(scene: Scene, body: ArticulatedBody): Mesh {
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const halfX = e.x, halfY = e.y, halfZ = e.z;
  const G = GOATEE;
  const long = halfY * (0.45 + G.down);
  const m = MeshBuilder.CreateCylinder("goatee", { height: long, diameterTop: halfX * 2 * G.wide, diameterBottom: 0, tessellation: 4 }, scene);
  m.rotation.y = Math.PI / 4;
  m.bakeCurrentTransformIntoVertices();
  m.scaling.z = 0.7;
  m.convertToFlatShadedMesh();
  m.material = getMaterialFactory().get("cloth", MOUSTACHE_COLOR, { emissiveIntensity: 0.1 });
  m.parent = body.headMesh;
  // its root under the lip, hanging down and tipped forward-out off the chin
  m.setPivotPoint(new Vector3(0, long * 0.5, 0));
  m.rotation.x = -G.tip;
  m.position.set(0, -halfY * 0.55 - long * 0.5, halfZ * G.proud);
  return m;
}

/** The beard (spec at BEARD) in the given hair material, parented to the head. */
/** [S] The wheelbarrow's Apple Thrower's brown beard (349; farmer.wheelbarrow.red.png): the tribal beard in chestnut, on any head. */
export function dressBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  return tribalBeard(scene, body, getMaterialFactory().get("cloth", CHESTNUT, { emissiveIntensity: 0.18 }));
}

/*
 * [S] The wheelbarrow's Traveller's afro (349; farmer.wheelbarrow.red.png/.blue.png: a big round brown puff standing up off the crown and out past the ears,
 * about one and a half heads across, the face clear in front of it): one faceted ball AFRO.wide head widths across, AFRO.tall head heights tall and
 * AFRO.deep head depths deep, its middle AFRO.up head heights above the head's middle and set back AFRO.back head depths so its front stays behind the
 * face, jittered AFRO.jitter so it reads tufted; brown self-lit so it reads brown and not black.
 */
const AFRO = { wide: 2.0, tall: 1.1, deep: 1.5, up: 0.32, back: 0.18, jitter: 0.1 };
export function dressAfro(scene: Scene, body: ArticulatedBody): Mesh[] {
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const puff = MeshBuilder.CreateIcoSphere(`${body.headMesh.name}_afro`, { radius: 1, subdivisions: 2, flat: true }, scene);
  jitterVertices(puff, AFRO.jitter, 34.9, e.x * AFRO.wide, e.y * AFRO.tall, e.z * AFRO.deep);
  puff.position.set(0, e.y * 2 * AFRO.up, -e.z * 2 * AFRO.back);
  puff.material = getMaterialFactory().get("cloth", SHAGGY_COLOR, { emissiveIntensity: 0.2 });
  puff.parent = body.headMesh;
  return [puff];
}

function tribalBeard(scene: Scene, body: ArticulatedBody, hair: ReturnType<typeof boneMaterial>): Mesh[] {
  const added: Mesh[] = [];
  const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
  const halfX = e.x, halfY = e.y, halfZ = e.z;
  const W = halfX * 2, H = halfY * 2;
  // A faceted chunk over the jaw and chin, from cheek to cheek under the eyes, hanging BEARD.down head heights below the chin and standing off the face
  const beard = MeshBuilder.CreateIcoSphere("beard", { radius: 1, subdivisions: 1, flat: true }, scene);
  const beardTall = halfY * 0.75 + H * BEARD.down;
  jitterVertices(beard, BEARD.jitter, 13.9, halfX * 1.08 * BEARD.wide, beardTall * 0.5, halfZ * BEARD.deep);
  beard.position.set(0, -halfY * 0.1 - beardTall * 0.5, halfZ * 0.85);
  beard.material = hair;
  beard.parent = body.headMesh;
  added.push(beard);
  // ...its ragged foot: short locks hanging off the chin, the middle ones longest, splayed a little
  for (let i = 0; i < BEARD.locks; i++) {
    const u = (i + 0.5) / BEARD.locks - 0.5;
    const long = H * BEARD.lockLong * (1 - Math.abs(u) * 0.8) * (0.85 + 0.3 * hashShare(11.3, i, 4, 2));
    const root = W * LONG_HAIR.thick * 0.7;
    const m = MeshBuilder.CreateCylinder("beardLock", { height: long, diameterTop: root, diameterBottom: root * 0.45, tessellation: 4 }, scene);
    m.rotation.y = i * 0.9;
    m.bakeCurrentTransformIntoVertices();
    m.convertToFlatShadedMesh();
    m.material = hair;
    m.parent = body.headMesh;
    m.rotation.set(0.25, 0, u * 0.6);
    m.position.set(u * halfX * 1.4, -halfY * 0.1 - beardTall * 0.85 - long * 0.4, halfZ * (0.95 + 0.1 * (0.5 - Math.abs(u))));
    added.push(m);
  }
  return added;
}

/*
 * The ornamented loincloth (tribal.bone_mage.red.png, card Appearance: "a brown loincloth crudely tied with a rope ... ornamented with a skull tied through its
 * orbit with the rope at the center and two bones tied with thick strings on each side"): over the hide kilt, LOINCLOTH.ropes turns of red-brown rope round
 * the hips just outside the kilt's waist, a brown flap hanging at the front LOINCLOTH.flap of the kilt's drop long, a faceted animal skull LOINCLOTH.skull
 * pelvis widths across hung on the rope at the middle of the front, and a bone LOINCLOTH.bone pelvis widths long tied slanting on the rope at each front
 * corner of the hips (LOINCLOTH.boneAt radians round from the front), standing proud of the hips so they show from the side too.
 */
const LOINCLOTH = { ropes: 2, flap: 0.85, skull: 0.42, bone: 0.62, boneAt: 0.95, kiltDrop: 0.5, kiltWaist: 1.15, kiltFlare: 1.45 };
const FLAP_COLOR = new Color3(0.5, 0.3, 0.18);
// The spear thrower and the clubber wear the same (cards: "a brown loincloth tied with a rope that is ornamented with bones and a skull"; the clubber's
// "crudely tied with a rope ... a skull tied through its orbit with a rope at the center and two bones tied with thick strings on each side")
const LOINCLOTHS = new Set(["tribal.bone_mage", "tribal.spear_thrower", "tribal.clubber", "tribal.chieftain"]);
/*
 * The clubber's own cut (tribal.clubber.red.png: a ragged brown hide hanging to mid-thigh, a large tan skull on it below the rope, a bone slanting each side
 * of the skull): in place of the short pointed flap, RAGGED_LOIN.strips hide tongues side by side, together .wide pelvis widths across, each its own length
 * between .short and 1 of .long of the knee's drop below the rope and ending in a torn point, a little turned and in its own shade of hide (.hide, lighter
 * than FLAP_COLOR so it stays brown in the capture's shade); the skull .skull pelvis widths across with its snout stretched by .snout, hung .hang of its width
 * below the rope; the bones .boneAt radians round from the front, close beside the skull.
 */
const RAGGED_LOIN = { strips: 6, wide: 0.95, long: 0.75, short: 0.7, skull: 0.5, snout: 1.3, hang: 0.55, boneAt: 0.42, hide: new Color3(0.62, 0.43, 0.27) };
/*
 * [S] the clubber's hide re-cut as strips (367; tribal.clubber.red.png, .jpg: ragged mid-brown hide strips hanging from the rope to mid-thigh, each torn at
 * its foot, skin showing between them, a large tan skull on the middle and a bone each side; critic 362/366: the box tongues overlapped into one pale beige
 * card to the top of the thigh, the skull white). Replaces the overlapping boxes and their cone tips:
 *   - RAGGED_STRIPS.strips flat strips at a pitch of .wide pelvis widths / strips, each .fill of the pitch wide (the rest a gap), hung off the rope;
 *   - each strip's length between .short and .long of the knee's drop, the middle ones longest; the sides narrowing to .taper at the foot; the foot
 *     torn into .teeth points, the notches between them .tear of the length deep (each its own share);
 *   - leaning out only .lean of the kilt's flare, so they hang rather than stand off; each a little turned;
 *   - mid-brown hide .hide (each its own shade), barely self-lit .glow (at .3 the light hide read beige-white);
 *   - the skull in matte tan .skullTan, self-lit .skullGlow, not the necklace bone.
 */
const RAGGED_STRIPS = {
  strips: 5, wide: 1.0, fill: 0.74, short: 0.62, long: 0.95, taper: 0.85, teeth: 2, tear: 0.22, lean: 0.5,
  hide: new Color3(0.42, 0.26, 0.15), glow: 0.1, skullTan: new Color3(0.68, 0.52, 0.34), skullGlow: 0.18,
};
/*
 * [S] the Chieftain's hide loincloth and hip tusks (364; tribal.chieftain.red.png, card Appearance: "a loincloth tied with ropes along with a pair of tusks
 * tied to their hip"): on the rope belt, CHIEF_LOIN.tongues torn tan hide tongues all round the hips over the dark kilt (so none of it shows), each standing
 * .out of the kilt's radius, the front ones .long of the knee's drop and the back ones .back of it, torn to a point; no skull or bones. At each hip
 * (.tuskAt radians round from the front) a large curved tusk hangs off the rope: a tapered tube .tusk of the knee's drop long, .thick pelvis widths across
 * at its root, curving down and then forward through .curl radians with a little outward flare, bone-tan (.tan, self-lit .glow), a rope turn at its root.
 */
const CHIEF_LOIN = {
  tongues: 9, out: 1.1, long: 0.62, back: 0.45, hide: new Color3(0.58, 0.4, 0.22),
  tusk: 0.72, thick: 0.24, tuskAt: 1.35, curl: 1.7, tan: new Color3(0.8, 0.66, 0.46), glow: 0.22,
};

/** A bone `long` long along +y: a round shaft with a pair of knobs at each end. The first mesh is the shaft (the others are its children). */
export function boneStick(scene: Scene, name: string, long: number, thick: number): Mesh[] {
  const bone = boneMaterial();
  const shaft = MeshBuilder.CreateCylinder(name, { height: long, diameter: thick, tessellation: 6 }, scene);
  shaft.convertToFlatShadedMesh();
  shaft.material = bone;
  const parts = [shaft];
  for (const end of [-1, 1]) {
    for (const side of [-1, 1]) {
      const knob = MeshBuilder.CreateIcoSphere(`${name}Knob`, { radius: thick * 0.85, subdivisions: 1, flat: true }, scene);
      knob.position.set(side * thick * 0.6, end * long * 0.5, 0);
      knob.material = bone;
      knob.parent = shaft;
      parts.push(knob);
    }
  }
  return parts;
}

/** Ties the ornamented loincloth (spec at LOINCLOTH) round a bare tribesman's hips, parented to the hip joint. Empty when he wears the plain one. */
export function dressTribalLoincloth(scene: Scene, body: ArticulatedBody, unitId: string): Mesh[] {
  if (!LOINCLOTHS.has(unitId)) return [];
  const pelvis = body.hip.getChildMeshes(true).find((m) => /_pelvis$/.test(m.name));
  if (!pelvis) return [];
  const added: Mesh[] = [];
  const size = pelvis.getBoundingInfo().boundingBox.extendSize;
  const top = pelvis.position.y + size.y;
  const drop = Math.abs(body.leftKnee.position.y) * LOINCLOTH.kiltDrop;
  // The kilt (unitFactory hangSkirt "hideKilt") is a six-sided sleeve from the pelvis top, size.x * kiltWaist round at the waist, its depth squashed by zk
  const zk = Math.max(0.7, size.z / size.x * 1.25);
  const waist = size.x * LOINCLOTH.kiltWaist;
  const rope = ropeMaterial();
  const ropeThick = size.x * 0.13;
  const beltR = waist + ropeThick * 0.6;
  const beltY = top - size.y * 0.35;
  for (let i = 0; i < LOINCLOTH.ropes; i++) {
    const ring = MeshBuilder.CreateTorus("loinRope", { diameter: beltR * 2, thickness: ropeThick, tessellation: 10 }, scene);
    ring.scaling.z = zk;
    ring.rotation.x = (i - 0.5) * 0.08;
    ring.position.y = beltY - i * ropeThick * 0.9;
    ring.material = rope;
    ring.parent = body.hip;
    added.push(ring);
  }
  const frontAt = (y: number) => {
    const r = waist + (size.x * LOINCLOTH.kiltFlare - waist) * Math.min(1, Math.max(0, (top - y) / drop));
    return r * zk;
  };
  const flapTop = beltY;
  if (unitId === "tribal.chieftain") {
    const kiltR = (y: number) => waist + (size.x * LOINCLOTH.kiltFlare - waist) * Math.min(1, Math.max(0, (top - y) / drop));
    return [...added, ...chieftainLoin(scene, body, beltY, beltR, ropeThick, zk, size.x, kiltR)];
  }
  const ragged = unitId === "tribal.clubber";
  if (ragged) {
    // [S] 367 the clubber's hide re-cut (spec at RAGGED_STRIPS): separate torn strips with gaps between them, mid-brown, down to mid-thigh
    const R = RAGGED_STRIPS;
    const knee = Math.abs(body.leftKnee.position.y);
    const pitch = size.x * 2 * R.wide / R.strips;
    const stripW = pitch * R.fill;
    for (let i = 0; i < R.strips; i++) {
      const share = (k: number) => hashShare(83.7, i, k, 0);
      const mid = 1 - Math.abs(i - (R.strips - 1) * 0.5) / ((R.strips - 1) * 0.5);
      const long = knee * (R.short + (R.long - R.short) * (0.55 * mid + 0.45 * share(1)));
      const x = (i - (R.strips - 1) * 0.5) * pitch;
      const lean = Math.atan2(frontAt(flapTop - long) - frontAt(flapTop), long) * R.lean;
      // its outline: straight top on the rope, the sides narrowing a little, the hem torn into R.teeth ragged points of their own depths
      const top: Vector3[] = [], foot: Vector3[] = [];
      const n = R.teeth * 2;
      for (let k = 0; k <= n; k++) {
        const u = k / n - 0.5;
        top.push(new Vector3(u * stripW, 0, 0));
        const deep = k % 2 === 1 ? 1 : 1 - R.tear * (0.6 + 0.8 * share(10 + k));
        foot.push(new Vector3(u * stripW * R.taper, -long * deep, 0));
      }
      const tongue = MeshBuilder.CreateRibbon("loinFlap", { pathArray: [top, foot], sideOrientation: Mesh.DOUBLESIDE }, scene);
      tongue.convertToFlatShadedMesh();
      tongue.rotation.set(-lean, (share(2) - 0.5) * 0.3, (share(3) - 0.5) * 0.12);
      tongue.position.set(x, flapTop + ropeThick * 0.3, frontAt(flapTop) + ropeThick * (0.6 + share(4) * 0.4));
      tongue.material = getMaterialFactory().get("cloth", R.hide.scale(0.85 + share(5) * 0.3), { emissiveIntensity: R.glow });
      tongue.parent = body.hip;
      added.push(tongue);
    }
  } else {
    // The flap: a brown hide panel down the front over the kilt, leaning out with the kilt's flare, its foot cut to a point
    const flapLong = drop * LOINCLOTH.flap;
    const lean = Math.atan2(frontAt(flapTop - flapLong) - frontAt(flapTop), flapLong);
    const flap = MeshBuilder.CreateBox("loinFlap", { width: size.x * 1.0, height: flapLong, depth: ropeThick * 0.5 }, scene);
    flap.rotation.x = -lean;
    flap.position.set(0, flapTop - flapLong * 0.5, (frontAt(flapTop) + frontAt(flapTop - flapLong)) * 0.5 + ropeThick * 0.5);
    flap.material = getMaterialFactory().get("cloth", FLAP_COLOR, { emissiveIntensity: 0.15 });
    flap.parent = body.hip;
    added.push(flap);
    const point = MeshBuilder.CreateCylinder("loinFlapPoint", { height: flapLong * 0.3, diameterTop: 0, diameterBottom: size.x * 1.0, tessellation: 3 }, scene);
    point.convertToFlatShadedMesh();
    point.scaling.z = 0.25;
    point.rotation.x = Math.PI;
    point.position.set(0, -flapLong * 0.5 - flapLong * 0.13, 0);
    point.material = flap.material;
    point.parent = flap;
    added.push(point);
  }
  // The skull on the rope at the middle of the front, over the flap's head (the clubber's large, long-snouted and hung lower on the hide)
  const skullWide = size.x * 2 * (ragged ? RAGGED_LOIN.skull : LOINCLOTH.skull);
  const skullParts = boneSkull(scene, "loinSkull", skullWide, 29.1, ragged ? getMaterialFactory().get("cloth", RAGGED_STRIPS.skullTan, { emissiveIntensity: RAGGED_STRIPS.skullGlow }) : undefined);
  const skullY = beltY - skullWide * (ragged ? RAGGED_LOIN.hang : 0.25);
  skullParts[0].position.set(0, skullY, frontAt(skullY) + ropeThick + skullWide * 0.3);
  if (ragged) skullParts[0].scaling.set(1, RAGGED_LOIN.snout, 0.8);
  skullParts[0].rotation.x = 0.1;
  skullParts[0].parent = body.hip;
  added.push(...skullParts);
  // A bone slanting on the rope at each front corner of the hips, standing off it (the clubber's close beside the skull)
  const boneLong = size.x * 2 * LOINCLOTH.bone;
  for (const side of [-1, 1]) {
    const a = side * (ragged ? RAGGED_LOIN.boneAt : LOINCLOTH.boneAt);
    const parts = boneStick(scene, "loinBone", boneLong, ropeThick * 0.9);
    const shaft = parts[0];
    const r = beltR + ropeThick * 0.9;
    shaft.rotation.set(0, a, side * 0.9);
    shaft.position.set(Math.sin(a) * r, beltY - ropeThick * 0.5, Math.cos(a) * r * zk);
    shaft.parent = body.hip;
    added.push(...parts);
  }
  return added;
}

/** The Chieftain's hide wrap and hip tusks (spec at CHIEF_LOIN), on the rope at `beltY`; `kiltR(y)` is the kilt's radius at height y (its depth x zk). */
function chieftainLoin(scene: Scene, body: ArticulatedBody, beltY: number, beltR: number, rope: number, zk: number, half: number, kiltR: (y: number) => number): Mesh[] {
  const C = CHIEF_LOIN;
  const added: Mesh[] = [];
  const knee = Math.abs(body.leftKnee.position.y);
  const mats = getMaterialFactory();
  // The wrap: torn hide tongues all round, front ones long, back ones short, each leaning out with the kilt's flare
  for (let i = 0; i < C.tongues; i++) {
    const share = (k: number) => hashShare(61.9, i, k, 0);
    const a = (i / C.tongues) * Math.PI * 2;
    const front = (Math.cos(a) + 1) * 0.5;
    const long = knee * (C.back + (C.long - C.back) * front) * (0.88 + 0.24 * share(1));
    const rTop = kiltR(beltY) * C.out, rBot = kiltR(beltY - long) * C.out;
    const wide = (2 * Math.PI * (rTop + rBot) * 0.5) / C.tongues * 1.18;
    const lean = Math.atan2(rBot - rTop, long);
    const tongue = MeshBuilder.CreateBox("loinFlap", { width: wide, height: long * 0.82, depth: rope * 0.45 }, scene);
    tongue.convertToFlatShadedMesh();
    tongue.rotation.set(-lean, a, (share(2) - 0.5) * 0.14);
    const r = (rTop + rBot) * 0.5 + rope * 0.35;
    tongue.position.set(Math.sin(a) * r, beltY - long * 0.41, Math.cos(a) * r * zk);
    tongue.material = mats.get("cloth", C.hide.scale(0.88 + share(3) * 0.24), { emissiveIntensity: 0.28 });
    tongue.parent = body.hip;
    added.push(tongue);
    const tip = MeshBuilder.CreateCylinder("loinFlapPoint", { height: long * 0.2, diameterTop: 0, diameterBottom: wide, tessellation: 3 }, scene);
    tip.convertToFlatShadedMesh();
    tip.scaling.z = 0.25;
    tip.rotation.set(Math.PI, 0, (share(4) - 0.5) * 0.5);
    tip.position.set(0, -long * 0.5, 0);
    tip.material = tongue.material;
    tip.parent = tongue;
    added.push(tip);
  }
  // The rope tied round over the wrap's top
  const ropeMat = ropeMaterial();
  const over = MeshBuilder.CreateTorus("loinRope", { diameter: Math.max(beltR, kiltR(beltY) * C.out + rope * 0.5) * 2, thickness: rope, tessellation: 10 }, scene);
  over.scaling.z = zk;
  over.position.y = beltY - rope * 0.2;
  over.material = ropeMat;
  over.parent = body.hip;
  added.push(over);
  // A big curved tusk off the rope at each hip: down, then forward, flaring out a little
  const tan = mats.get("cloth", C.tan, { emissiveIntensity: C.glow });
  const L = knee * C.tusk;
  const R = L / C.curl;
  const thick = half * 2 * C.thick;
  for (const side of [-1, 1]) {
    const a = side * C.tuskAt;
    // Outside the hide wrap all the way down (the wrap flares as it drops), a little further out toward the tip
    const path: Vector3[] = [];
    for (let k = 0; k <= 10; k++) {
      const th = (k / 10) * C.curl;
      const y = beltY - rope * 0.6 - R * Math.sin(th);
      const rr = kiltR(y) * C.out + rope + thick * (0.55 + 0.25 * (k / 10));
      path.push(new Vector3(Math.sin(a) * rr, y, Math.cos(a) * rr * zk + R * (1 - Math.cos(th))));
    }
    const tusk = MeshBuilder.CreateTube("hipTusk", { path, radiusFunction: (k) => thick * 0.5 * (1 - (k / 10) * 0.86), tessellation: 6, cap: Mesh.CAP_ALL }, scene);
    tusk.convertToFlatShadedMesh();
    tusk.material = tan;
    tusk.parent = body.hip;
    added.push(tusk);
    const turn = MeshBuilder.CreateTorus("hipTuskRope", { diameter: thick * 1.15, thickness: rope * 0.7, tessellation: 8 }, scene);
    turn.position.copyFrom(path[1]);
    turn.material = ropeMat;
    turn.parent = body.hip;
    added.push(turn);
  }
  return added;
}

/*
 * Bone bracelets (tribal.bone_mage.blue.png, card Appearance: "a pair of bracelets made out of bones bound to two straps"): round each forearm just above the
 * wrist, two red-brown straps BRACELET.apart forearm lengths apart and BRACELET.bones short knobbed bones laid along the arm between and across them, evenly
 * round it, standing BRACELET.proud forearm widths off the skin so the cuff reads as a chunky pale-and-red band at the wrist.
 *   BRACELET.at of the forearm's length from the elbow for the cuff's middle, .long forearm lengths for each bone, .thick forearm widths across each bone.
 */
const BRACELET = { at: 0.76, apart: 0.16, bones: 6, long: 0.3, thick: 0.28, proud: 0.18 };
const BRACELETS = new Set(["tribal.bone_mage", "tribal.clubber"]);

/** Binds the bone bracelets (spec at BRACELET) round both forearms, parented to the elbow joints. Empty when he wears none. */
export function dressTribalBracelets(scene: Scene, body: ArticulatedBody, unitId: string): Mesh[] {
  if (!BRACELETS.has(unitId)) return [];
  const added: Mesh[] = [];
  const rope = ropeMaterial();
  for (const [elbow, arm, hand] of [[body.leftElbow, body.leftLowerArm, body.leftHand], [body.rightElbow, body.rightLowerArm, body.rightHand]] as const) {
    const len = Math.abs(hand.position.y);
    const e = arm.getBoundingInfo().boundingBox.extendSize;
    const wide = Math.max(e.x * arm.scaling.x, e.z * arm.scaling.z) * 2;
    const y = -len * BRACELET.at;
    const r = wide * 0.5 * 1.05;
    const proud = wide * BRACELET.proud;
    for (const side of [-1, 1]) {
      const strap = MeshBuilder.CreateTorus("braceletStrap", { diameter: (r + proud * 0.6) * 2, thickness: proud * 0.9, tessellation: 10 }, scene);
      strap.position.y = y + side * len * BRACELET.apart * 0.5;
      strap.material = rope;
      strap.parent = elbow;
      added.push(strap);
    }
    for (let i = 0; i < BRACELET.bones; i++) {
      const a = (i + 0.5) / BRACELET.bones * Math.PI * 2;
      const parts = boneStick(scene, "braceletBone", len * BRACELET.long, wide * BRACELET.thick);
      const shaft = parts[0];
      // Along the arm, its knob pairs lying round the arm's surface rather than standing out of it
      shaft.rotation.y = a;
      shaft.position.set(Math.sin(a) * (r + proud * 0.5), y, Math.cos(a) * (r + proud * 0.5));
      shaft.parent = elbow;
      added.push(...parts);
    }
  }
  return added;
}

/*
 * The chieftain's skull pauldrons (tribal.chieftain.red.png, card Appearance: "a pair of animal skulls strapped to their arm as shoulder guards"): a big pale
 * faceted animal skull on the outside of each upper arm, from the shoulder's top down most of the way to the elbow, its sockets looking out sideways and its
 * snout pointing down the arm, a turn of rope round the arm through it. PAULDRON.wide upper-arm widths across, .long of the upper arm's length tall, .top of
 * the upper arm's length above the shoulder joint for its crown, .out upper-arm widths it stands off the arm's middle.
 */
/*
 * [S] the pauldron skulls re-cut (366; tribal.chieftain.red.png: on each arm a big tan beast skull as wide as most of his head, from over the shoulder down
 * past the middle of the upper arm nearly to the elbow, its rounded brain case up at the shoulder and its long muzzle tapering down the arm, a white googly
 * eye with a dark pupil on its outer face looking out and ahead; critic 360: small white skulls with black sockets). Replaces the small boneSkull:
 *   - brain case: a jittered faceted ellipsoid PAULDRON.wide head widths across (front to back), .deep of that out from the arm, its top .top of the upper
 *     arm above the shoulder joint, standing .out of its depth off the arm's outer face;
 *   - muzzle: a flattened six-sided taper from under the brain case down the arm, the whole skull .long of the upper arm, .snout of the width at its foot;
 *   - eye: a dark ring .eye of the width across on the brain case's outer face, the white in it and a pupil turned .look ahead;
 *   - all in the helm's tan (.tan, self-lit .glow), so it reads as the same bone as the beast skull on his head.
 */
const PAULDRON = {
  wide: 1.0, deep: 0.62, long: 1.08, top: 0.16, out: 0.42, snout: 0.45, eye: 0.42, look: 0.45,
  tan: new Color3(0.68, 0.52, 0.34), glow: 0.2,
};
const PAULDRONS = new Set(["tribal.chieftain"]);

/** Straps a skull pauldron (spec at PAULDRON) to each upper arm, parented to the shoulder joints. Empty when he wears none. */
export function dressTribalPauldrons(scene: Scene, body: ArticulatedBody, unitId: string): Mesh[] {
  if (!PAULDRONS.has(unitId)) return [];
  const added: Mesh[] = [];
  const P = PAULDRON;
  const mats = getMaterialFactory();
  const tan = mats.get("cloth", P.tan, { emissiveIntensity: P.glow });
  const dark = mats.get("cloth", SOCKET_COLOR);
  const white = mats.get("cloth", new Color3(0.96, 0.95, 0.92), { emissiveIntensity: 0.4 });
  for (const [shoulder, arm, elbow] of [[body.leftShoulder, body.leftUpperArm, body.leftElbow], [body.rightShoulder, body.rightUpperArm, body.rightElbow]] as const) {
    const side = Math.sign(shoulder.position.x) || 1;
    const len = Math.abs(elbow.position.y);
    const e = arm.getBoundingInfo().boundingBox.extendSize;
    const armWide = Math.max(e.x * arm.scaling.x, e.z * arm.scaling.z) * 2;
    const wide = headWide(body) * P.wide;
    const deep = wide * P.deep;
    const tall = len * P.long;
    const seed = side > 0 ? 41.3 : 47.9;
    // the brain case, up at the shoulder
    const caseX = side * (armWide * 0.5 + deep * P.out);
    const caseY = len * P.top - wide * 0.45;
    const cranium = MeshBuilder.CreateIcoSphere("pauldronSkull", { radius: 1, subdivisions: 1, flat: true }, scene);
    jitterVertices(cranium, 0.1, seed, deep * 0.5, wide * 0.45, wide * 0.5);
    cranium.position.set(caseX, caseY, 0);
    cranium.material = tan;
    cranium.parent = shoulder;
    // the muzzle, tapering down the arm from under it
    const snoutLong = Math.max(wide * 0.3, tall - wide * 0.55);
    const snout = MeshBuilder.CreateCylinder("pauldronSkullSnout", { height: snoutLong, diameterTop: wide * 0.82, diameterBottom: wide * P.snout, tessellation: 6 }, scene);
    jitterVertices(snout, 0.05, seed + 3);
    snout.convertToFlatShadedMesh();
    snout.scaling.x = P.deep * 0.9;
    snout.position.set(caseX - side * deep * 0.08, caseY - wide * 0.2 - snoutLong * 0.5, wide * 0.02);
    snout.rotation.z = side * 0.06;
    snout.material = tan;
    snout.parent = shoulder;
    // the googly eye on the brain case's outer face, looking out and ahead
    const ring = MeshBuilder.CreateCylinder("pauldronSkullSocket", { height: wide * 0.05, diameter: wide * P.eye * 1.25, tessellation: 8 }, scene);
    ring.rotation.set(0, -side * P.look, -side * Math.PI / 2);
    ring.position.set(caseX + side * deep * 0.46, caseY + wide * 0.04, wide * 0.12);
    ring.material = dark;
    ring.parent = shoulder;
    const ball = MeshBuilder.CreateCylinder("pauldronSkullEye", { height: wide * 0.05, diameter: wide * P.eye, tessellation: 14 }, scene);
    ball.position.y = wide * 0.03;
    ball.material = white;
    ball.parent = ring;
    const pupil = MeshBuilder.CreateCylinder("pauldronSkullPupil", { height: wide * 0.03, diameter: wide * P.eye * 0.42, tessellation: 10 }, scene);
    pupil.position.set(0, wide * 0.03, wide * P.eye * 0.12);
    pupil.material = dark;
    pupil.parent = ball;
    added.push(cranium, snout, ring, ball, pupil);
    const rope = MeshBuilder.CreateTorus("pauldronRope", { diameter: armWide * 1.35, thickness: armWide * 0.16, tessellation: 10 }, scene);
    rope.position.set(side * armWide * 0.15, -len * 0.45, 0);
    rope.rotation.z = side * 0.15;
    rope.material = ropeMaterial();
    rope.parent = shoulder;
    added.push(rope);
  }
  return added;
}

/*
 * [S] The stoner's one-strap hide dress (362; tribal.stoner.red.png, card Appearance: "a simple brown garment held by a shoulder strap on their right side"):
 * a reddish-brown hide dress whose top edge runs on a slant from over the right shoulder across the chest to under the left arm, the left shoulder and the
 * top of the left chest bare, hanging on below the waist as a flared skirt to mid-thigh with a ragged, zig-zag hem. Replaces the tunic that wrapped the whole
 * trunk to the yoke (it covered both shoulders).
 *   - bodice: a HIDE_DRESS.sides-sided open sleeve round the trunk's box (its half widths a skin out), its foot just under the waist; its top edge
 *     .top of the trunk high at the strap side, falling to .low of the trunk at the bare side;
 *   - strap: a curved band .strapWide of the shoulder span each way of .strapAt along it, arched .strapRise over the shoulder (363), front to back;
 *   - skirt: an open sleeve from the waist .skirt of the thigh long, flaring .flare at the foot, every other foot corner hung .rag of the thigh lower (each
 *     its own share) so the hem is torn into points;
 *   - hide .color, self-lit .glow so it stays brown in the shade.
 * [S] the skirt hung close per thigh (365; tribal.stoner.red.png: a reddish-brown skirt hanging close round the hips and down each thigh to mid-thigh, its
 * hem torn; critic 363/364: the flared sleeve on the trunk stood out like a lampshade, a hip-rigid box jutted out behind). The skirt is no longer one piece
 * on the trunk: a snug waist band (an open sleeve the trunk's own depth, .bandDrop of the thigh below the waist) and on each hip joint a panel sleeve round
 * the thigh, .panelOut of its half-width round it, from just above the hip to .skirt of the thigh down, flaring only .panelFlare, every other foot corner
 * torn .rag of the thigh lower; each panel swings with its own leg. unitFactory hangs no skin kilt under it (wearsHideDress).
 */
const HIDE_SKIRT = { bandDrop: 0.16, panelOut: 1.45, panelFlare: 1.12, sides: 7 };
const HIDE_DRESS = { sides: 8, top: 1.0, low: 0.56, strapAt: 0.55, strapWide: 0.13, strapRise: 0.45, skirt: 0.62, flare: 1.4, rag: 0.16, color: new Color3(0.52, 0.3, 0.22), glow: 0.15 };
const HIDE_EDGE = { color: new Color3(0.34, 0.19, 0.12), wide: 0.2, thick: 0.05, lift: 0.12, rimPoints: 24 };
const HIDE_DRESSES = new Set(["tribal.stoner"]);
/** Whether the unit wears the hide dress (and so no skin kilt under it). */
export function wearsHideDress(unitId: string): boolean {
  return HIDE_DRESSES.has(unitId);
}

/** Dresses a bare tribesman in the one-strap hide dress (spec at HIDE_DRESS), parented to the torso joint. Empty when he wears none. */
export function dressTribalHideDress(scene: Scene, body: ArticulatedBody, unitId: string): Mesh[] {
  if (!HIDE_DRESSES.has(unitId)) return [];
  const added: Mesh[] = [];
  const D = HIDE_DRESS;
  const hide = getMaterialFactory().get("cloth", D.color, { emissiveIntensity: D.glow });
  const band = trunkBand(body, 0, 0.95);
  const trunk = band.trunk;
  const thigh = Math.abs(body.leftKnee.position.y);
  const side = Math.sign(body.rightShoulder.position.x) || 1;
  const halfX = band.halfX * 1.08;
  const halfZ = (band.maxZ - band.minZ) * 0.5 * 1.12;
  const midZ = (band.minZ + band.maxZ) * 0.5;
  // An open sleeve with its rim reshaped vertex by vertex: `place` gets the unit circle's (x, z) and whether the vertex is on the top rim
  const sleeve = (name: string, place: (x: number, z: number, top: boolean) => [number, number, number], parent = body.torso, sides = D.sides) => {
    const m = MeshBuilder.CreateCylinder(name, { height: 1, diameter: 2, tessellation: sides, cap: Mesh.NO_CAP, sideOrientation: Mesh.DOUBLESIDE }, scene);
    const at = m.getVerticesData(VertexBuffer.PositionKind);
    if (at) {
      for (let v = 0; v < at.length; v += 3) {
        const [x, y, z] = place(at[v], at[v + 2], at[v + 1] > 0);
        at[v] = x; at[v + 1] = y; at[v + 2] = z;
      }
      m.setVerticesData(VertexBuffer.PositionKind, at);
    }
    m.convertToFlatShadedMesh();
    m.material = hide;
    m.parent = parent;
    added.push(m);
    return m;
  };
  // The bodice: its top rim on a slant, high at the strap side, low at the bare side
  sleeve("tunicWrap", (x, z, top) => {
    const strapSide = (x * side + 1) * 0.5;
    const y = top ? trunk * (D.low + (D.top - D.low) * strapSide) : -trunk * 0.04;
    return [band.midX + x * halfX, y, midZ + z * halfZ];
  });
  // [S] 363 the strap (critic 362: a flat plank standing off the shoulder): a narrow curved band from the bodice's front top edge up over the strap
  // shoulder and down to its back edge, hugging the shoulder: a half-ellipse .strapWide of the shoulder span across, its crown .strapRise of the half-depth
  // over the shoulder joint, laid as two stacked ribbons (outer and inner skin) so it has a little thickness
  const shoulderX = Math.abs(body.rightShoulder.position.x);
  const strapX = side * shoulderX * D.strapAt;
  const foot = trunk * D.top * 0.94;
  const crown = Math.max(trunk * D.top, body.rightShoulder.position.y) + halfZ * D.strapRise;
  const arc = (dx: number, grow: number): Vector3[] => {
    const pts: Vector3[] = [];
    for (let i = 0; i <= 10; i++) {
      const a = (i / 10) * Math.PI;
      pts.push(new Vector3(strapX + dx, foot + (crown - foot) * grow * Math.sin(a), midZ + halfZ * 1.02 * grow * Math.cos(a)));
    }
    return pts;
  };
  // [S] 366 (critic 365: the strap hid under the locks and the bodice's slant barely read against the skin): the strap is a solid band of HIDE_EDGE.thick
  // of the trunk, HIDE_EDGE.wide of the shoulder span across, in the darker edge hide, lifted .lift of the half-depth proud of the shoulder so its front leg
  // stands clear on the chest below the hair; and a rolled hem of the same dark hide runs round the bodice's slanted top rim, so the diagonal reads plain.
  const E = HIDE_EDGE;
  const edge = getMaterialFactory().get("cloth", E.color, { emissiveIntensity: D.glow });
  const halfW = shoulderX * E.wide;
  const lift = 1 + E.lift;
  const thickness = trunk * E.thick;
  const outer = lift + thickness / Math.max(1e-3, halfZ);
  const section = [arc(-halfW, outer), arc(halfW, outer), arc(halfW, lift), arc(-halfW, lift), arc(-halfW, outer)];
  const strap = MeshBuilder.CreateRibbon("tunicStrap", { pathArray: section, sideOrientation: Mesh.DOUBLESIDE }, scene);
  strap.convertToFlatShadedMesh();
  strap.material = edge;
  strap.parent = body.torso;
  added.push(strap);
  const rim: Vector3[] = [];
  for (let k = 0; k <= E.rimPoints; k++) {
    const a = (k / E.rimPoints) * Math.PI * 2;
    const x = Math.cos(a), z = Math.sin(a);
    const strapSide = (x * side + 1) * 0.5;
    rim.push(new Vector3(band.midX + x * halfX * 1.03, trunk * (D.low + (D.top - D.low) * strapSide), midZ + z * halfZ * 1.03));
  }
  const hem = MeshBuilder.CreateTube("tunicHem", { path: rim, radius: thickness * 0.5, tessellation: 5 }, scene);
  hem.convertToFlatShadedMesh();
  hem.material = edge;
  hem.parent = body.torso;
  added.push(hem);
  // The skirt: flared, its foot torn into points
  const pelvis = body.hip.getChildMeshes(true).find((m) => /_pelvis$/.test(m.name));
  const pelvisX = pelvis ? pelvis.getBoundingInfo().boundingBox.extendSize.x : halfX;
  const skirtTop = Math.max(halfX * 0.95, pelvisX * 1.12);
  // [S] 365 the skirt hung close: a snug waist band, then a torn panel round each thigh on its own hip joint
  const S = HIDE_SKIRT;
  sleeve("tunicSkirt", (x, z, top) => [band.midX + x * skirtTop, top ? trunk * 0.06 : -thigh * S.bandDrop, midZ + z * halfZ * 0.9]);
  for (const [hipJ, leg, seed] of [[body.leftHip, body.leftUpperLeg, 1], [body.rightHip, body.rightUpperLeg, 2]] as const) {
    const lb = leg.getBoundingInfo().boundingBox;
    const rx = lb.extendSize.x * leg.scaling.x * S.panelOut, rz = lb.extendSize.z * leg.scaling.z * S.panelOut;
    sleeve("tunicSkirtPanel", (x, z, top) => {
      if (top) return [x * rx, thigh * 0.04, z * rz];
      const k = ((Math.round(Math.atan2(x, z) / (Math.PI * 2) * S.sides) % S.sides) + S.sides) % S.sides;
      const torn = (k % 2) * thigh * D.rag * (0.6 + 0.8 * hashShare(5.9 + seed, k, 1, 2));
      return [x * rx * S.panelFlare, -thigh * D.skirt - torn, z * rz * S.panelFlare];
    }, hipJ, S.sides);
  }
  return added;
}
