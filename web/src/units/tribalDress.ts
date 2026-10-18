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
// Which tribesmen wear which necklace (the furCollar is dropped for them)
const NECKLACES: Record<string, "critter_skulls"> = { "tribal.protector": "critter_skulls" };

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

/*
 * Long messy hair (tribal.stoner.blue.png, card Appearance: "long, messy brown hair ... a darker shade of brown"): a jittered faceted cap over the crown and
 * back of the head and LONG_HAIR.strands thick four-sided locks hanging from round its sides and back to the shoulders, the face's sector (LONG_HAIR.face
 * radians either side of the front) left bare but for LONG_HAIR.fringe short locks over the brow. Locks LONG_HAIR.long head heights long (each its own share
 * shorter or longer), LONG_HAIR.thick head widths across at the root. Dark brown, self-lit so it does not go black in the shade.
 */
const LONG_HAIR = { strands: 17, face: 0.8, fringe: 4, long: 1.05, thick: 0.32 };
const LONG_HAIR_COLOR = new Color3(0.3, 0.18, 0.1);
const HAIR_STYLES: Record<string, "long"> = { "tribal.stoner": "long" };

/** The unit's own hair (spec at LONG_HAIR), parented to the head; null when he keeps the common mop. */
export function dressTribalHair(scene: Scene, body: ArticulatedBody, unitId: string): Mesh[] | null {
  if (HAIR_STYLES[unitId] !== "long") return null;
  const added: Mesh[] = [];
  const hair = getMaterialFactory().get("cloth", LONG_HAIR_COLOR, { emissiveIntensity: 0.18 });
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
  return added;
}
