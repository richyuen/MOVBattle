import { Vector3 } from "@babylonjs/core";

/** Axis-aligned box obstacle for unit collision */
export interface BoxObstacle {
  type: "box";
  center: Vector3;
  halfX: number;
  halfZ: number;
}

/** Cylinder obstacle for unit collision */
export interface CylinderObstacle {
  type: "cylinder";
  center: Vector3;
  radius: number;
}

export type Obstacle = BoxObstacle | CylinderObstacle;

/**
 * Resolve collision between a unit position and all obstacles.
 * Pushes the position out of any overlapping obstacle.
 * @param pos  The unit's position (mutated in place)
 * @param unitRadius  The unit's collision radius
 * @param obstacles  All map obstacles
 */
export function resolveObstacleCollisions(
  pos: Vector3, unitRadius: number, obstacles: readonly Obstacle[],
): void {
  for (const obs of obstacles) {
    if (obs.type === "box") {
      resolveBox(pos, unitRadius, obs);
    } else {
      resolveCylinder(pos, unitRadius, obs);
    }
  }
}

function resolveBox(pos: Vector3, r: number, box: BoxObstacle): void {
  const dx = pos.x - box.center.x;
  const dz = pos.z - box.center.z;

  const penX = (box.halfX + r) - Math.abs(dx);
  const penZ = (box.halfZ + r) - Math.abs(dz);

  if (penX <= 0 || penZ <= 0) return; // no overlap

  // Push out along the axis with the smallest penetration
  if (penX < penZ) {
    pos.x += penX * Math.sign(dx);
  } else {
    pos.z += penZ * Math.sign(dz);
  }
}

function resolveCylinder(pos: Vector3, r: number, cyl: CylinderObstacle): void {
  const dx = pos.x - cyl.center.x;
  const dz = pos.z - cyl.center.z;
  const distSq = dx * dx + dz * dz;
  const minDist = cyl.radius + r;

  if (distSq >= minDist * minDist || distSq < 0.0001) return;

  const dist = Math.sqrt(distSq);
  const pen = minDist - dist;
  const nx = dx / dist;
  const nz = dz / dist;
  pos.x += nx * pen;
  pos.z += nz * pen;
}
