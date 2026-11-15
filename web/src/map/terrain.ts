// Visual terrain height (2026-11-15, "option A"): the battle simulation stays on flat ground (units, missiles and effects live at y = height above
// the ground), and only the drawing follows a map's height field. Just before each frame is drawn, every dynamic root node (units, corpses,
// missiles, effects, particle emitters, the placement ghost) is lifted by the ground height under it; right after, it is put back and its
// world matrices recomputed, so the simulation never reads a lifted position. Map geometry and the scene's fixed nodes (sky, lights, the map's
// own meshes) are static and never lifted: a map builder shapes its ground with terrainMesh() and seats its props with groundHeightAt().
// With no height field (every map before the maps phase) nothing runs, so those maps draw exactly as before.
// Limits, on purpose: no high-ground advantage, no slope slowdown, no falls off ledges; units stand upright on slopes; a cliff a unit could walk
// into must be a wall or obstacle in the MapBuildResult, or he is drawn sliding up its face.
import { Camera, Light, Mesh, Node, ParticleSystem, Scene, TransformNode, Vector3, VertexData, type Material } from "@babylonjs/core";

export type HeightField = (x: number, z: number) => number;

let active: HeightField | null = null;
const staticNodes = new WeakSet<Node>();

/** The ground height under (x, z) on the active map; 0 on a flat map. */
export function groundHeightAt(x: number, z: number): number {
  return active ? active(x, z) : 0;
}

/** Called by the map loader: the new map's height field, or null for a flat map. */
export function setActiveHeightField(field: HeightField | null): void {
  active = field;
}

/** Nodes that are never lifted: the map's own meshes (trackMapBuild marks them) and whatever stood in the scene before any unit existed. */
export function markStatic(nodes: Iterable<Node>): void {
  for (const n of nodes) staticNodes.add(n);
}

/** Once, after the scene's fixed nodes exist: marks them static and installs the draw-time lift. */
export function installTerrainLift(scene: Scene): void {
  markStatic(scene.rootNodes);
  const lifted: Array<{ node: TransformNode; dy: number }> = [];
  const liftedEmitters: Array<{ emitter: Vector3; dy: number }> = [];
  // After every other before-render observer (the game registers its own earlier): the simulation has finished its step by now
  scene.onBeforeRenderObservable.add(() => {
    if (!active) return;
    for (const node of scene.rootNodes) {
      if (staticNodes.has(node) || node instanceof Camera || node instanceof Light || !(node instanceof TransformNode)) continue;
      if (!node.isEnabled()) continue;
      const p = node.position;
      const dy = active(p.x, p.z);
      if (dy === 0) continue;
      p.y += dy;
      lifted.push({ node, dy });
    }
    for (const ps of scene.particleSystems) {
      if (!(ps instanceof ParticleSystem) || !(ps.emitter instanceof Vector3)) continue;
      const dy = active(ps.emitter.x, ps.emitter.z);
      if (dy === 0) continue;
      ps.emitter.y += dy;
      liftedEmitters.push({ emitter: ps.emitter, dy });
    }
  });
  scene.onAfterRenderObservable.add(() => {
    if (lifted.length === 0 && liftedEmitters.length === 0) return;
    for (const { node, dy } of lifted) {
      if (node.isDisposed()) continue;
      node.position.y -= dy;
      // The frame's world matrices hold the lift: recompute them now, so a hand or a blade read by the simulation before the next frame is flat
      node.computeWorldMatrix(true);
      for (const child of node.getDescendants(false)) if (child instanceof TransformNode) child.computeWorldMatrix(true);
    }
    for (const { emitter, dy } of liftedEmitters) emitter.y -= dy;
    lifted.length = 0;
    liftedEmitters.length = 0;
  });
}

/**
 * A ground sheet shaped by `height` over a width x depth rectangle centred on (cx, cz), `step` m between vertices, faceted (flat-shaded, one
 * normal per triangle, like every TABS ground). `skirt` drops its four edges straight down that far below the lowest edge point, so a raised
 * sheet reads as a solid block from the side. A map builder places it, gives it a material, and passes the same `height` in its MapBuildResult.
 */
export function terrainMesh(
  scene: Scene,
  name: string,
  height: HeightField,
  opts: { width: number; depth: number; cx?: number; cz?: number; step?: number; skirt?: number; material?: Material },
): Mesh {
  const cx = opts.cx ?? 0, cz = opts.cz ?? 0, step = opts.step ?? 2;
  const nx = Math.max(1, Math.round(opts.width / step)), nz = Math.max(1, Math.round(opts.depth / step));
  const x0 = cx - opts.width / 2, z0 = cz - opts.depth / 2;
  const sx = opts.width / nx, sz = opts.depth / nz;
  const positions: number[] = [];
  const indices: number[] = [];
  const vert = (x: number, y: number, z: number) => { positions.push(x, y, z); return positions.length / 3 - 1; };
  const quad = (a: number, b: number, c: number, d: number) => { indices.push(a, b, c, a, c, d); };
  const grid: number[][] = [];
  for (let i = 0; i <= nx; i++) {
    grid.push([]);
    for (let j = 0; j <= nz; j++) {
      const x = x0 + i * sx, z = z0 + j * sz;
      grid[i].push(vert(x, height(x, z), z));
    }
  }
  // wound to face up (+y) in Babylon's left-handed frame
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) quad(grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]);
  if (opts.skirt !== undefined) {
    let low = Infinity;
    for (let k = 1; k < positions.length; k += 3) low = Math.min(low, positions[k]);
    const bottom = low - opts.skirt;
    const edge = (pts: number[]) => {
      for (let k = 0; k < pts.length - 1; k++) {
        const a = pts[k], b = pts[k + 1];
        const a2 = vert(positions[a * 3], bottom, positions[a * 3 + 2]);
        const b2 = vert(positions[b * 3], bottom, positions[b * 3 + 2]);
        // both windings: a skirt is seen from outside the block whichever way its edge runs
        quad(a, a2, b2, b);
        quad(b, b2, a2, a);
      }
    };
    edge(grid.map((col) => col[0]));                                   // z0 side
    edge(grid.map((col) => col[nz]).reverse());                        // far z side
    edge([...grid[0]].reverse());                                      // x0 side
    edge(grid[nx]);                                                    // far x side
  }
  const data = new VertexData();
  data.positions = positions;
  data.indices = indices;
  const normals: number[] = [];
  VertexData.ComputeNormals(positions, indices, normals);
  data.normals = normals;
  const mesh = new Mesh(name, scene);
  data.applyToMesh(mesh);
  mesh.convertToFlatShadedMesh();
  if (opts.material) mesh.material = opts.material;
  mesh.receiveShadows = true;
  return mesh;
}

/** A plain ramp field: 0 before `from` along x, rising linearly to `top` at `to`, flat beyond; an aid for hill and ledge maps. */
export function rampAlongX(from: number, to: number, top: number): HeightField {
  return (x) => (x <= from ? 0 : x >= to ? top : ((x - from) / (to - from)) * top);
}
