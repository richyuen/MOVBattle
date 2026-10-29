# Lessons (loop v3): facts about the pipeline, the capture and the rig that outlive one unit

One line each, newest last within its heading. Written by the worker at step 9 whenever an iteration learns something that is not about
one unit (a rendering behaviour, a probe, a pattern that failed twice, a camera rule). Read whole at step 1. Near the cap: merge duplicates,
drop a lesson once it is a comment at the code it describes.

## Rendering (swiftshader + PBR + SSAO + ACES + glow)
- PBR colours are linear: an sRGB target c needs about c^2.2 as the code (wood (.62,.3,.2) displayed taupe). Pick values off `output/loop/palette.png` (rewritten every capture; `capture.mjs --palette` alone).
- SSAO (main.ts, radius 1.5) reads a DOUBLESIDE ribbon's inward faces as occlusion and greys the cloth: build dress shells one-sided facing out (check flipFaces), never double-sided at the same depth.
- Flat colour that survives ACES: an "unlit" material's colour comes from its EMISSIVE only (baseColor alone renders black), excluded from the glow layer (glow.addExcludedMesh). A saturated red needs emissive r > 1 and b near 0.
- ACES lifts a mid code value toward pale, so an unlit plate keeps a deep value (zeus's gold emblem is (0.62,0.26,0.03), 400); the same for timber: an IBL-lit mid albedo reads beige, so a brown hull wants (.2,.11,.055) with a small self-light (400).
- "metal" renders near black under swiftshader: use "cloth" with a small emissive instead.
- Lit cloth in shadow (under a beard, brim, cuff or belt) reads grey however white or warm it is: self-light it or go unlit; fur that must read cream wants the unlit cut (399/400 headbutter).
- wrapAsBody team-tints the main mesh's material on every mesh sharing it: timber, iron and leather need their own materials.
- A vehicle's body material IS the team colour (unitFactory tints `bodyMaterial`): a timber hull needs its own material, and a team-trim mesh goes in as the body source (392 longship).
- A prop hung in a crewman's fist with holdInFist is aimed by the prop's local +Z: geometry built up +Y leaves the hand horizontal. Put the shape under a child rotated +PI/2 on x (longship oars, 395).
- Ice or fur spikes sized off a part's smallest half-extent come out a few cm and vanish at lineup distance: key them on the mean half-extent times ~2.4 (395 frost).

## Capture and probes
- Capture renders once per advanceTime call: step 100 ms chunks and replay to a frame in one call (16 ms stepping made a batch take 32 min).
- `release` is the first PLAIN event in the list, and only then `events[0]`: a mechanic judged in `_release` must also log a plain hit at its blow (394 headbutter: the headbutt pushes a hitLog entry, so release and ability land on the same tick).
- stats.json is written by stats.mjs, not by capture; every capture clears iter-N with it and each stats run overwrites it: rerun `stats.mjs <id,id,...> --iter N` once with every unit after the final capture.
- Probes live in `loop/scripts/probes/` (run from the repo root, `--build` after a source change, each starts its own vite preview on its own port): probe_bbox (--unit --pat --frame=torso --ylo --yhi: vertex bboxes), probe_mat <unit> <name regex>, probe_near, probe_zeus_shot, probe_close (--aim=head|torso|y:<root y> --dist --yaw, UI hidden via capture-mode after resetBattle; --noglow reads a swatch's true colour), probe_head, probe_local, probe_axes (--unit --pat --frame: parent, origin, local axes, local bbox: a prop's face normal), and per-unit ones.
- A flat plate on a dress ribbon needs 7+ cm of stand-off, not 3: the ribbon's chords dip inside the rim sampled for its surface, so a bolt 3.5 cm proud read as a ghost (398/399 zeus).
- Sim reads of joint positions must settle world matrices first (computeWorldMatrix(true) up the parent chain, as capture's __wp does).
- The idle and lineup shots are a front three-quarter on the weapon side; a blocker on a face, chest ornament or shield face judged in a side shot is mis-aimed (re-aim with an evidence commit, not a dress change).
- The idle look-around can flip the idle camera to the other side between builds (zeus 391): it follows the face at that phase, so a one-sided chest ornament must read from both sides.
- A unit that logs a spawn-time mechanic first (spins, swoops at tick 1) needs its own ABILITY_PREF entry, or the ability pair is shot on the spawn event (392 berserker).
- A two-stage mechanic that logs its special at the take-off and a plain hit at the impact gets its ability pair shot on the first half and its release pair on the second: use that to show both halves of one throw (396 longship: `hurl` at 2117 ms, `ship_crash` + the hit at 2967 ms).
- `RuntimeUnit.landings` counts ground touchdowns: read the counter before a leap and compare each step instead of testing a per-frame grounded flag to time a landing (396 longship).
- The idle shot is ~100 ms after spawn: a lift, pose or weight eased in from zero reads as absent - start at full weight from spawn and keep it in every later re-solve (393 valkyrie, 394 berserker).
- One gap, one commit: a bundled sha cannot be reverted singly, so a REJECT takes the approved gaps with it (394).
- The critic judges the named shot: an element hidden behind another mesh is not there (392).
- Hiding the thrower at a transition reads as a pop in the take-off shot: the frame must still show who threw it (401 longship, CONFIRM).
- A bowman at the ready turns his chest up to .95 rad and the head again off it: aim such a unit's idle from the head block's own world facing (alpha = atan2(fz, fx) - swing); the root rule's yaw - pi/2 equals that only for the -x facing the idle is shot at (402 ice archer).
- A wide side-by-side stance reads as a fore-aft stride from the .6 rad idle swing: probe the feet (probe_local --pat=FootM) before a pose gap on "stride"; the fix may be the camera (403 halfling: feet .015 m apart fore-aft).
- `capture.mjs --units` takes a comma-separated list; space-separated ids capture the first unit only. Every iter-N capture also clears the probe swatches: render them after the final capture (402).
- For a small piece in a look shot, a crop of the PNG (python PIL crop + NEAREST resize) is a faster close-up than probe_close, whose --aim can frame another mesh entirely (404 headbutter, minotaur).
- Two gaps in one file: commit them apart by staging a hunk subset (git diff > f.patch, keep the hunks, git apply --cached), so each stays revertable alone (406).
- The glow layer merges after rendering group 0 (main.ts renderingGroupId 0, 405): a mesh in group 1 is drawn over every nearby bloom yet still depth-hidden; a small emblem a glow halo tints (orange + blue-white = pink) goes in group 1. runtimeUnit resets a flung body's meshes to group 0 on landing.

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
- A foot mesh is a merged cuff + toe box: its bbox middle is the ankle cuff's middle, so a tuft rooted at c.y is buried; the instep's top is lo.y + ~.42 of its height (399 halfling).
- A critic's "the X's kit" ask is often cheapest as a call to the other unit's dress function, which adapts to the receiver's own limb boxes (399 berserker/brawlerLegs).
- A pelvis (hip-joint) pitch carries the legs with it: +1.2 rad lays the body flat - head forward, face down, legs trailing - so a whole-body dive pose comes from the hip joint alone (400 headbutter).
- A piece hung in the head's frame cannot run on down the torso: at the chest's z it sits inside the chest box - build the torso run as its own torso-parented piece (401 jarl).
- The bead eyes hang off the neck joint, not the head block: a head-hung cap or band must be seated off the eyes' world tops read into the head's frame, or it covers them (403 ice archer); shrinking headSize leaves the eyes where they were (403 headbutter band across the eyes).
- A beast hood's ellipsoid skull reads as a flat cap unless its features stand proud of the ellipsoid's own front at their height: sample the skull's front z at the eye's y, not one z for all (400 jarl).
- bakeCurrentTransformIntoVertices on a parented mesh bakes the parent's world transform in too: bake, then parent (407 jarl flaps stood over his head).
- A leg-length change reads only if the dress over the leg scales with it: brawlerLegs' boots and cuffs kept the visible belt-to-sole at 41% while the probe hip rose to 52% (406 headbutter). Measure the shot, not the bone.
