// TABS "Hill" (simulation map): the left half's flat ground runs into a long straight ramp that climbs to a crest near the middle
// where the right half's front stands on the edge; past the crest the ridge falls again to a lower flat behind it
// (reference/maps/wiki/hill.png, reference/stages/simulation.hill.png; card: "both sides ... small, flat areas leading up to a
// point in the middle"). Visual height only (map/terrain.ts): the sim fights on the flat. Built on the bare simulation plane (base()).
//
// Crest (588, blockers b2, b3; wiki hill.png: the ramp climbs to a narrow crest where the blue army stands on the edge, and the
// block's far side shows the ground falling away again behind it; stages/simulation.hill.png: the army on the crest's edge).
// Spec: flat at 0 to x -24, a straight ramp up to 10 m at x 22 (simulation.hill's front rank stands at x 20-26), a 6 m crest to
// x 28, then down to 4 m at x 40 and a flat at 4 m on to the zone's end (x 76); the sheet is 56 m deep with plain block sides.
import type { Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import { terrainMesh, type HeightField } from "../terrain";

const RIDGE = { foot: -24, crest0: 22, crest1: 28, back: 40, top: 10, low: 4, end: 76, depth: 56, step: 2 };

const height: HeightField = (x) => {
  const r = RIDGE;
  if (x <= r.foot) return 0;
  if (x < r.crest0) return ((x - r.foot) / (r.crest0 - r.foot)) * r.top;
  if (x <= r.crest1) return r.top;
  if (x < r.back) return r.top - ((x - r.crest1) / (r.back - r.crest1)) * (r.top - r.low);
  return r.low;
};

export function buildHill(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  terrainMesh(scene, "hill_ramp", height, {
    width: RIDGE.end - RIDGE.foot,
    depth: RIDGE.depth,
    cx: (RIDGE.foot + RIDGE.end) / 2,
    step: RIDGE.step,
    skirt: 0.5,
    material: scene.getMeshByName("barePlane")?.material ?? undefined,
  });
  return { ...result, height };
}
