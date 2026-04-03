import { Vector3 } from "@babylonjs/core";

export type HazardKind = "water" | "pit" | "void";

export interface BoxHazardRegion {
  shape: "box";
  kind: HazardKind;
  center: Vector3;
  halfX: number;
  halfZ: number;
}

export interface CylinderHazardRegion {
  shape: "cylinder";
  kind: HazardKind;
  center: Vector3;
  radius: number;
}

export type HazardRegion = BoxHazardRegion | CylinderHazardRegion;

export function isPointInsideHazard(point: Vector3, hazard: HazardRegion, padding = 0): boolean {
  if (hazard.shape === "box") {
    const dx = Math.abs(point.x - hazard.center.x);
    const dz = Math.abs(point.z - hazard.center.z);
    return dx <= hazard.halfX + padding && dz <= hazard.halfZ + padding;
  }

  const dx = point.x - hazard.center.x;
  const dz = point.z - hazard.center.z;
  const radius = hazard.radius + padding;
  return dx * dx + dz * dz <= radius * radius;
}
