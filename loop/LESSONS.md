# Lessons (loop v3): facts about the pipeline, the capture and the rig that outlive one unit

One line each, newest last within its heading. Written by the worker at step 9 whenever an iteration learns something that is not about
one unit (a rendering behaviour, a probe, a pattern that failed twice, a camera rule). Read whole at step 1. Near the cap: merge duplicates,
drop a lesson once it is a comment at the code it describes.

## Rendering (swiftshader + PBR + SSAO + ACES + glow)
- PBR colours are linear: an sRGB target c needs about c^2.2 as the code value (wood (.62,.3,.2) displayed taupe; terracotta needed (.55,.15,.075)). Pick code values off `output/loop/palette.png` (every unit capture rewrites it; `capture.mjs --palette` renders it alone).
- SSAO (main.ts, radius 1.5) reads a DOUBLESIDE ribbon's inward faces as occlusion and greys the cloth: build dress shells one-sided facing out (check flipFaces), never double-sided at the same depth.
- Flat colour that survives ACES: an "unlit" material with emissive = the colour, excluded from the glow layer (glow.addExcludedMesh). A saturated red needs emissive r > 1 and b near 0.
- "metal" renders near black under swiftshader: use "cloth" with a small emissive instead.
- Lit cloth under a beard, a brim or a held prop reads grey however white its material: self-light it (emissive) or go unlit.
- A preset's particle emitter at the chest (iconic_zeus "solar" fx) hazes everything behind it in a still: strip per-unit fx the render does not show.
- wrapAsBody team-tints the main mesh's material on every mesh sharing it: timber, iron and leather need their own materials.
- A front light washes a flat lower block: a lighter layer next to a darker one needs more than x.97 vs x.85 in team colour to read apart.
- ExtrudeShape with closeShape and cap CAP_ALL builds a closed thin slab from a 2D polygon: use it for flat emblems (Zeus's bolt) where a double-sided disc/ribbon would lose a face to culling or SSAO.
- A vehicle's body material IS the team colour (unitFactory tints `bodyMaterial`): a timber hull needs its own material, and a team-trim mesh goes in as the body source (392 longship).
- Timber under a deck's overhang reads black even at .62/.42/.25: give it a small emissive (392).

## Capture and probes
- Capture renders once per advanceTime call: step 100 ms chunks and replay to a frame in one call (16 ms stepping made a batch take 32 min).
- stats.json is written by stats.mjs, not by capture: rerun `stats.mjs --iter N` after the last capture of the iteration.
- Probes live in `loop/scripts/probes/` (run from the repo root, `--build` after a source change, each starts its own vite preview on its own port): probe_bbox (--unit --pat --frame=torso --ylo --yhi: vertex bboxes), probe_mat <unit> <name regex> (meshes + materials), probe_near (scene meshes and particle systems near the unit), probe_zeus_shot (--unit --aim=head|torso|root --dist --yaw: close-up PNGs), probe_head, probe_local, and per-unit ones (_halfling, _wheelbarrow, _sarissa, _mino, _hoplite, _shield, _potion).
- Sim reads of joint positions must settle world matrices first (computeWorldMatrix(true) up the parent chain, as capture's __wp does).
- A ParticleSystem shares one texture: dispose(false), or later particles never render.
- The idle and lineup shots are a front three-quarter on the weapon side; a blocker on a face, chest ornament or shield face judged in a side shot is mis-aimed (re-aim with an evidence commit, not a dress change).
- The idle look-around can flip the idle camera to the other side between builds (zeus 391): the eye-flip follows the face at that idle phase, which shifts with the scene's readiness, so a one-sided chest ornament must read from both sides or the camera must be pinned.
- Every capture run clears iter-N including stats.json: rerun `stats.mjs` for the units named in the CONFIRM/critic prompt after the final capture.
- A unit that logs a spawn-time mechanic first (spins, swoops at tick 1) needs its own ABILITY_PREF entry, or the ability pair is shot on the spawn event (392 berserker).
- The critic judges the named shot: an element hidden behind another mesh (the brawler's axe head behind the shield) is not there. Check the named shot, not just a later one (392).

## Rig and dress
- The generic tunicSkirt covers waist gear: exclude the unit in unitFactory's skirt condition.
- A preset look (iconic_zeus) comes from getPresetVisual, not the faction map entry in unitVisuals.
- Body -x is a humanoid's left in the dress modules; a unit faces -x in the probes, so compare world bboxes along x.
- A knee target is only a direction: the knee lands one thigh length along it (aimLimb); solve knees off the thing they should straddle, not off the seat.
- Flipping a flat disc or ribbon one-sided by its summed normal (faceFront) can turn it away from the camera (390 halfling V vanished): build small flat dress pieces as thin closed slabs instead.
- An engine's projectile can be a copy of a named node on the build (LOADED_BOLTS + heldProp/_buildHeldMissile): the flying shape then matches the loaded one for free.
- A hood or cap over the block head needs a superellipsoid profile (exponent about 3, 1.2 of the head) to clear the chamfered corners and the top ring.
- A pose keyed off `_air` reaches every airborne humanoid (hop-backs, the halfling's jump): gate it on a runtime flag set by the one mechanic it belongs to (392 leap pose).
- A hook on a shared ability name (`flying_hover`) hits every unit that lists it, including done units outside the batch (balloon_archer): gate on the unit's own kind (392 valkyrie).
