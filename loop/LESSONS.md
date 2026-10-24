# Lessons (loop v3): facts about the pipeline, the capture and the rig that outlive one unit

One line each, newest last within its heading. Written by the worker at step 9 whenever an iteration learns something that is not about
one unit (a rendering behaviour, a probe, a pattern that failed twice, a camera rule). Read whole at step 1. Near the cap: merge duplicates,
drop a lesson once it is a comment at the code it describes.

## Rendering (swiftshader + PBR + SSAO + ACES + glow)
- PBR colours are linear: an sRGB target c needs about c^2.2 as the code value (wood (.62,.3,.2) displayed taupe). Pick code values off `output/loop/palette.png` (every unit capture rewrites it; `capture.mjs --palette` renders it alone).
- SSAO (main.ts, radius 1.5) reads a DOUBLESIDE ribbon's inward faces as occlusion and greys the cloth: build dress shells one-sided facing out (check flipFaces), never double-sided at the same depth.
- Flat colour that survives ACES: an "unlit" material with emissive = the colour, excluded from the glow layer (glow.addExcludedMesh). A saturated red needs emissive r > 1 and b near 0.
- Bloom veils a small saturated prop pale whatever its material: on zeus's white chest an unlit orange and a StandardMaterial emissive both read salmon, while a lit "cloth" self-lit .55 of a deep orange-red (0.95,.22,.03) held its hue (398).
- "metal" renders near black under swiftshader: use "cloth" with a small emissive instead.
- Lit cloth under a beard, a brim or a held prop reads grey however white its material: self-light it or go unlit. A cream fur at (0.9, 0.7, 0.42) with a small emissive still displays pale-white, so fur that must read cream wants an unlit material (396 headbutter).
- wrapAsBody team-tints the main mesh's material on every mesh sharing it: timber, iron and leather need their own materials.
- A vehicle's body material IS the team colour (unitFactory tints `bodyMaterial`): a timber hull needs its own material, and a team-trim mesh goes in as the body source (392 longship).
- A ship's rig must be read off the reference: the longship has no mast or yard; a plausible addition (sail, then yard) reads as foreign hardware and is rejected whole (393).
- A prop hung in a crewman's fist with holdInFist is aimed by the prop's local +Z: geometry built up +Y leaves the hand horizontal. Put the shape under a child rotated +PI/2 on x (longship oars, 395).
- Ice or fur spikes sized off a part's smallest half-extent come out a few cm and vanish at lineup distance: key them on the mean half-extent times ~2.4, and crop the named shot to check before the critic runs (395 frost).
- An unlit dress mesh still blooms in the glow layer: exclude it per mesh (glow.addExcludedMesh) or its flat cream washes out what it sits on (397 brawler cuffs).

## Capture and probes
- Capture renders once per advanceTime call: step 100 ms chunks and replay to a frame in one call (16 ms stepping made a batch take 32 min).
- `release` is the first PLAIN event (missile|melee hit|fire|throw|cast|burst|volley|shotgun) anywhere in the event list, and only then `events[0]`: a mechanic judged in `_release` must also log a plain hit at its blow, or its shot shows whatever plain attack came first (394 headbutter: the headbutt pushes a hitLog entry, so release and ability land on the same tick).
- stats.json is written by stats.mjs, not by capture: rerun `stats.mjs --iter N` after the last capture of the iteration.
- Probes live in `loop/scripts/probes/` (run from the repo root, `--build` after a source change, each starts its own vite preview on its own port): probe_bbox (--unit --pat --frame=torso --ylo --yhi: vertex bboxes), probe_mat <unit> <name regex> (meshes + materials), probe_near (scene meshes and particle systems near the unit), probe_zeus_shot (--unit --aim=head|torso|root --dist --yaw: close-up PNGs), probe_close (--unit --aim=head|torso|y:<root y> --dist --yaw, UI hidden via capture-mode after resetBattle, frameCamera then renderWhenReady; --noglow kills the GlowLayer to read a swatch's true colour), probe_head, probe_local, and per-unit ones (_halfling, _wheelbarrow, _sarissa, _mino, _hoplite, _shield, _potion).
- A flat plate laid on a dress ribbon needs ~3 cm of stand-off: the ribbon's chords dip inside the ring sampled from the rim, so a bolt 1 cm proud read as a ghost through the cloth (398 zeus).
- Sim reads of joint positions must settle world matrices first (computeWorldMatrix(true) up the parent chain, as capture's __wp does).
- A ParticleSystem shares one texture: dispose(false), or later particles never render.
- The idle and lineup shots are a front three-quarter on the weapon side; a blocker on a face, chest ornament or shield face judged in a side shot is mis-aimed (re-aim with an evidence commit, not a dress change).
- The idle look-around can flip the idle camera to the other side between builds (zeus 391): the eye-flip follows the face at that idle phase, which shifts with the scene's readiness, so a one-sided chest ornament must read from both sides or the camera must be pinned.
- Every capture run clears iter-N including stats.json: rerun `stats.mjs` for the units named in the CONFIRM/critic prompt after the final capture.
- A unit that logs a spawn-time mechanic first (spins, swoops at tick 1) needs its own ABILITY_PREF entry, or the ability pair is shot on the spawn event (392 berserker).
- A two-stage mechanic that logs its special at the take-off and a plain hit at the impact gets its ability pair shot on the first half and its release pair on the second: use that to show both halves of one throw (396 longship: `hurl` at 2117 ms, `ship_crash` + the hit at 2967 ms).
- `RuntimeUnit.landings` counts ground touchdowns: read the counter before a leap and compare each step instead of testing a per-frame grounded flag to time a landing (396 longship).
- The idle shot is ~100 ms after spawn: a lift, pose or weight eased in from zero reads as absent - start at full weight from spawn and keep it in every later re-solve (393 valkyrie, 394 berserker).
- One gap, one commit: a bundled sha cannot be reverted singly, so a REJECT takes the approved gaps with it (394).
- The critic judges the named shot: an element hidden behind another mesh (the brawler's axe head behind the shield) is not there. Check the named shot, not just a later one (392).

## Rig and dress
- aimLimb only aims a fixed-length bone: a knee target further than one bone is never reached, so a wide splay needs the bone stretched (which reads as a rod) or the seat moved (397 wheelbarrow [R], rejected).
- The generic tunicSkirt covers waist gear: exclude the unit in unitFactory's skirt condition.
- A preset look (iconic_zeus) comes from getPresetVisual, not the faction map entry in unitVisuals.
- Body -x is a humanoid's left in the dress modules; a unit faces -x in the probes, so compare world bboxes along x.
- Flipping a flat disc or ribbon one-sided by its summed normal (faceFront) can turn it away from the camera (390 halfling V vanished): build small flat dress pieces as thin closed slabs instead.
- An engine's projectile can be a copy of a named node on the build (LOADED_BOLTS + heldProp/_buildHeldMissile): the flying shape then matches the loaded one for free.
- A hood or cap over the block head needs a superellipsoid profile (exponent about 3, 1.2 of the head) to clear the chamfered corners.
- A shared prop that marks its mechanic by the style OBJECT (`style === VALKYRIE_WINGS`) loses the mechanic the moment one unit gets its own style: key the marker on a flag in the style (`fly: true`) so a per-unit fork keeps the flight/beat (394 valkyrie wings).
- A pose keyed off `_air` reaches every airborne humanoid (hop-backs, the halfling's jump): gate it on a runtime flag set by the one mechanic it belongs to (392 leap pose).
- A hook on a shared ability name (`flying_hover`) hits every unit that lists it, including done units outside the batch (392 valkyrie).
