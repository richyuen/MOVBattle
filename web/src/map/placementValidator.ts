import { Vector3 } from "@babylonjs/core";
import type { RuntimeUnit } from "../units/runtimeUnit";

export interface PlacementZone {
  team: number;
  center: Vector3;
  size: Vector3;
}

export class PlacementValidator {
  private _zones: PlacementZone[];

  constructor(zones: PlacementZone[]) {
    this._zones = zones;
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
