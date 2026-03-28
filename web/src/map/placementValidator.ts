import { Vector3 } from "@babylonjs/core";
import type { RuntimeUnit } from "../units/runtimeUnit";
import type { Obstacle } from "./obstacles";

export interface PlacementZone {
  team: number;
  center: Vector3;
  size: Vector3;
}

export class PlacementValidator {
  private _zones: PlacementZone[];
  private _obstacles: readonly Obstacle[];

  constructor(zones: PlacementZone[], obstacles: readonly Obstacle[] = []) {
    this._zones = zones;
    this._obstacles = obstacles;
  }

  validate(
    team: number, worldPoint: Vector3, collisionRadius: number,
    placedUnits: RuntimeUnit[],
  ): string | null {
    // Check zone membership
    const zone = this._zones.find((z) => z.team === team);
    if (!zone) return "No placement zone for team.";

    const half = zone.size.scale(0.5);
    const rel = worldPoint.subtract(zone.center);
    if (
      Math.abs(rel.x) > half.x ||
      Math.abs(rel.y) > half.y ||
      Math.abs(rel.z) > half.z
    ) {
      return "Outside placement zone.";
    }

    // Check overlap with obstacles
    for (const obs of this._obstacles) {
      if (obs.type === "box") {
        const dx = Math.abs(worldPoint.x - obs.center.x);
        const dz = Math.abs(worldPoint.z - obs.center.z);
        if (dx < obs.halfX + collisionRadius && dz < obs.halfZ + collisionRadius) {
          return "Too close to an obstacle.";
        }
      } else {
        const dx = worldPoint.x - obs.center.x;
        const dz = worldPoint.z - obs.center.z;
        const distSq = dx * dx + dz * dz;
        const minDist = obs.radius + collisionRadius;
        if (distSq < minDist * minDist) {
          return "Too close to an obstacle.";
        }
      }
    }

    // Check overlap with existing units
    const minDist = collisionRadius * 2;
    const minDistSq = minDist * minDist;
    for (const existing of placedUnits) {
      if (existing.isDead) continue;
      const offset = existing.position.subtract(worldPoint);
      offset.y = 0;
      if (offset.lengthSquared() < minDistSq) {
        return "Too close to another unit.";
      }
    }

    return null; // valid
  }
}
