import { Scene, Vector3, Color3, Mesh, MeshBuilder, VertexBuffer, VertexData } from "@babylonjs/core";
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
export function boneSkull(scene: Scene, name: string, wide: number, serial: number): Mesh[] {
  const bone = boneMaterial();
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
 */
const TUSK_BAND = { band: 0.45, strap: 0.1, rise: 0.65, bow: 0.22, thick: 0.4 };
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
const HAIR_STYLES: Record<string, "long" | "long_beard" | "tusk_band" | "beard"> = {
  "tribal.stoner": "long", "tribal.clubber": "long_beard", "tribal.spear_thrower": "tusk_band", "tribal.chieftain": "beard",
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
    // Root at the cheek beside the strap's side, bowing out, the tip over the head's side and a little back
    const root = new Vector3(side * e.x * 1.12, -e.y * 0.25, e.z * 0.15);
    const tip = new Vector3(side * e.x * 1.0, -e.y * 0.25 + H * TUSK_BAND.rise, -e.z * 0.25);
    const ctrl = new Vector3(side * (e.x * 1.12 + W * TUSK_BAND.bow), (root.y + tip.y) * 0.5, e.z * 0.05);
    const path: Vector3[] = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      path.push(root.scale((1 - t) * (1 - t)).add(ctrl.scale(2 * t * (1 - t))).add(tip.scale(t * t)));
    }
    const tusk = MeshBuilder.CreateTube("tusk", { path, tessellation: 6, cap: Mesh.CAP_START, radiusFunction: (i) => W * TUSK_BAND.thick * 0.5 * Math.max(0.06, 1 - i / 8) }, scene);
    tusk.convertToFlatShadedMesh();
    tusk.material = boneMaterial();
    tusk.parent = body.headMesh;
    added.push(tusk);
    // The rope turn round the tusk at the strap's height
    const k = Math.min(8, Math.max(0, Math.round((bandY - root.y) / (tip.y - root.y) * 8)));
    const wrap = MeshBuilder.CreateTorus("tuskRope", { diameter: W * TUSK_BAND.thick * (1 - k / 8) * 1.15, thickness: W * 0.05, tessellation: 8 }, scene);
    wrap.position.copyFrom(path[k]);
    wrap.material = ropeMaterial();
    wrap.parent = body.headMesh;
    added.push(wrap);
  }
  return added;
}

/** The unit's own hair or headgear (LONG_HAIR, TUSK_BAND), parented to the head; null when he keeps the common mop. */
export function dressTribalHair(scene: Scene, body: ArticulatedBody, unitId: string): Mesh[] | null {
  if (HAIR_STYLES[unitId] === "tusk_band") return tuskBand(scene, body);
  if (HAIR_STYLES[unitId] === "beard") return tribalBeard(scene, body, getMaterialFactory().get("cloth", CHESTNUT, { emissiveIntensity: 0.18 }));
  const style = HAIR_STYLES[unitId];
  if (style !== "long" && style !== "long_beard") return null;
  const added: Mesh[] = [];
  const hair = getMaterialFactory().get("cloth", style === "long_beard" ? CLUBBER_HAIR_COLOR : LONG_HAIR_COLOR, { emissiveIntensity: 0.18 });
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
  for (let i = 0; i < LONG_HAIR.fringe; i++) {
    const x = ((i + 0.5) / LONG_HAIR.fringe - 0.5) * W * 0.9;
    const long = H * 0.28 * (0.8 + 0.4 * hashShare(9.1, i, 1, 3));
    const m = lock("hairFringe", long, W * LONG_HAIR.thick * 0.8);
    m.rotation.set(-0.35, 0, x / W * 0.6);
    m.position.set(x, halfY * 1.0 - long * 0.45, halfZ * 1.02);
  }
  if (style === "long_beard") added.push(...tribalBeard(scene, body, hair));
  return added;
}

/** The beard (spec at BEARD) in the given hair material, parented to the head. */
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
const LOINCLOTHS = new Set(["tribal.bone_mage", "tribal.spear_thrower", "tribal.clubber"]);

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
  // The flap: a brown hide panel down the front over the kilt, leaning out with the kilt's flare, its foot cut to a point
  const flapLong = drop * LOINCLOTH.flap;
  const flapTop = beltY;
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
  // The skull on the rope at the middle of the front, over the flap's head
  const skullWide = size.x * 2 * LOINCLOTH.skull;
  const skullParts = boneSkull(scene, "loinSkull", skullWide, 29.1);
  skullParts[0].position.set(0, beltY - skullWide * 0.25, frontAt(beltY) + ropeThick + skullWide * 0.3);
  skullParts[0].rotation.x = 0.1;
  skullParts[0].parent = body.hip;
  added.push(...skullParts);
  // A bone slanting on the rope at each front corner of the hips, standing off it
  const boneLong = size.x * 2 * LOINCLOTH.bone;
  for (const side of [-1, 1]) {
    const a = side * LOINCLOTH.boneAt;
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
const PAULDRON = { wide: 1.9, long: 0.95, top: 0.12, out: 0.55 };
const PAULDRONS = new Set(["tribal.chieftain"]);

/** Straps a skull pauldron (spec at PAULDRON) to each upper arm, parented to the shoulder joints. Empty when he wears none. */
export function dressTribalPauldrons(scene: Scene, body: ArticulatedBody, unitId: string): Mesh[] {
  if (!PAULDRONS.has(unitId)) return [];
  const added: Mesh[] = [];
  for (const [shoulder, arm, elbow] of [[body.leftShoulder, body.leftUpperArm, body.leftElbow], [body.rightShoulder, body.rightUpperArm, body.rightElbow]] as const) {
    const side = Math.sign(shoulder.position.x) || 1;
    const len = Math.abs(elbow.position.y);
    const e = arm.getBoundingInfo().boundingBox.extendSize;
    const armWide = Math.max(e.x * arm.scaling.x, e.z * arm.scaling.z) * 2;
    const wide = armWide * PAULDRON.wide;
    const parts = boneSkull(scene, "pauldronSkull", wide, side > 0 ? 41.3 : 47.9);
    const skull = parts[0];
    // boneSkull stands about 1.2 widths tall from the crown's top to the snout's foot: stretch it down the arm
    const tall = len * PAULDRON.long;
    skull.scaling.set(1, tall / (wide * 1.2), 0.8);
    skull.rotation.set(0, side * Math.PI / 2, side * 0.12);
    skull.position.set(side * armWide * PAULDRON.out, len * PAULDRON.top - wide * 0.5 * (tall / (wide * 1.2)), 0);
    skull.parent = shoulder;
    added.push(...parts);
    const rope = MeshBuilder.CreateTorus("pauldronRope", { diameter: armWide * 1.35, thickness: armWide * 0.16, tessellation: 10 }, scene);
    rope.position.set(side * armWide * 0.15, -len * 0.45, 0);
    rope.rotation.z = side * 0.15;
    rope.material = ropeMaterial();
    rope.parent = shoulder;
    added.push(rope);
  }
  return added;
}
