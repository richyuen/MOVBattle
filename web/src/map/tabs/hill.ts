// TABS "Hill" (simulation map): the left half's flat ground runs into a long straight ramp that climbs to a high flat top where the right half
// stands (reference/maps/wiki/hill.png, reference/stages/simulation.hill.png). Visual height only (map/terrain.ts): the sim fights on the flat.
// Spec read off the wiki shot: the ramp starts a little left of the centre line, climbs about a fifth of its run, and the top is as wide as the
// field; its sides drop straight down as plain block faces. Built on the bare simulation plane (base()).
import type { Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import { rampAlongX, terrainMesh } from "../terrain";

const HILL = { from: -8, to: 30, top: 8, width: 70, depth: 56, step: 2 };

export function buildHill(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  const height = rampAlongX(HILL.from, HILL.to, HILL.top);
  const xFrom = HILL.from, xTo = HILL.from + HILL.width;
  terrainMesh(scene, "hill_ramp", height, {
    width: HILL.width,
    depth: HILL.depth,
    cx: (xFrom + xTo) / 2,
    step: HILL.step,
    skirt: 0.5,
    material: scene.getMeshByName("barePlane")?.material ?? undefined,
  });
  return { ...result, height };
}
