// TABS "Fantasy Evil" (Void, fantasy map): a broken plateau of dark slate basalt blocks lit by acid-green chasms, a chained Void
// Monarch statue and a gothic shrine, floating in a starless black void (reference/maps/wiki/fantasy_evil.png,
// reference/maps/void_evil.png; card loop/cards/maps/fantasy_evil.md). Built on campaign.fantasy_evil (base()), dressed here only.
//
// Void sky (590, blocker a1; wiki fantasy_evil.png: nothing behind the island but a near-black violet void, no clouds, no
// mountain range, no horizon glow). Spec: the shared sky dome, the base's clouds ("cloud*") and far range ("mountain*") are
// hidden; clear colour and fog colour become near-black violet (.02, .012, .035), so the field's far edge fades into the void
// rather than into daylight haze. Dome, clear and fog colours are put back on dispose.
import { Color3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const VOID = new Color3(0.02, 0.012, 0.035);

function voidSky(scene: Scene, built: Set<unknown>): () => void {
  const dome = scene.getMeshByName("skyDome"), domeOn = dome?.isEnabled();
  dome?.setEnabled(false);
  for (const m of scene.meshes) if (built.has(m) && /^(mountain|cloud)/.test(m.name)) m.setEnabled(false);
  const oldFog = scene.fogColor.clone(), oldClear = scene.clearColor.clone();
  scene.fogColor.copyFrom(VOID);
  scene.clearColor.set(VOID.r, VOID.g, VOID.b, 1);
  return () => {
    dome?.setEnabled(domeOn ?? true);
    scene.fogColor.copyFrom(oldFog);
    scene.clearColor.copyFrom(oldClear);
  };
}

export function buildFantasyEvil(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const restoreSky = voidSky(scene, new Set<unknown>(scene.meshes.filter((m) => !prior.has(m))));
  return { ...result, dispose: () => { restoreSky(); result.dispose?.(); } };
}
