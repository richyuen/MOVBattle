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
- Lit cloth in shadow reads grey however white or warm: self-light it or go unlit; cream wants the unlit cut (400 headbutter; 441: cloth (1,.86,.6) self-lit .3 swatched grey 166/161/156).
- wrapAsBody team-tints the main mesh's material on every mesh sharing it (a vehicle's `bodyMaterial` IS the team colour: timber, iron, leather need their own; 392), and the head's as skin: a bone crewman needs a hidden anchor head (440 pumpkin operator).
- A prop hung in a crewman's fist with holdInFist is aimed by the prop's local +Z: geometry built up +Y leaves the hand horizontal. Put the shape under a child rotated +PI/2 on x (longship oars, 395).

## Capture and probes
- `release` is the first PLAIN event in the list, and only then `events[0]`: a mechanic judged in `_release` must also log a plain hit at its blow (394 headbutter: the headbutt pushes a hitLog entry, so release and ability land on the same tick).
- stats.json is written by stats.mjs, not by capture; every non-regression capture wipes iter-N (stats.json, a tail-overlap batch's audit.md too) and each stats run overwrites it: copy audit.md out before step 5 and restore it, rerun `stats.mjs <id,id,...> --iter N` once with every unit after the final capture (422).
- Probes (`loop/scripts/probes/`, repo root, `--build` after a source change): probe_bbox (--unit --pat --frame=torso: vertex bboxes), probe_mat <unit> <regex>, probe_near, probe_close (--aim=head|torso|y:<y> --dist --yaw; --noglow: true colour), probe_head, probe_local, probe_axes (--unit --pat --frame: a prop's axes and face normal).
- A flat plate on a dress ribbon needs 7+ cm of stand-off, not 3: the ribbon's chords dip inside the rim sampled for its surface, so a bolt 3.5 cm proud read as a ghost (398/399 zeus).
- Sim reads of joint positions must settle world matrices first (computeWorldMatrix(true) up the parent chain, as capture's __wp does).
- The idle and lineup shots are a front three-quarter on the weapon side; a blocker on a face, chest ornament or shield face judged in a side shot is mis-aimed (re-aim with an evidence commit, not a dress change).
- A two-stage mechanic that logs its special at the take-off and a plain hit at the impact gets its ability pair shot on the first half and its release pair on the second: use that to show both halves of one throw (396 longship: `hurl` at 2117 ms, `ship_crash` + the hit at 2967 ms).
- The idle shot is ~100 ms after spawn: a lift, pose or weight eased in from zero reads as absent - start at full weight from spawn and keep it in every later re-solve (393 valkyrie, 394 berserker).
- A "haxe" weapon rests via _restHalberd and a bow with the carry mark via _restIceBow (a bare marked stave rides it since 420): world poses, so carry attitudes do nothing.
- The capture frames a unit by its mesh top when a prop stands over the head by more than .3 of it (420: the dragon's head was out of frame from 417; the monkey king's tail pulls his frame back): a new tall prop re-frames every shot, so a RE-AUDIT follows.
- A bowman at the ready turns his chest up to .95 rad and the head again off it: aim such a unit's idle from the head block's own world facing (alpha = atan2(fz, fx) - swing); the root rule's yaw - pi/2 equals that only for the -x facing the idle is shot at (402 ice archer).
- A wide stance reads as a stride from the .6 rad idle swing: probe the feet (probe_local --pat=FootM) before a "stride" pose gap (403).
- `capture.mjs --units` takes a comma list, no spaces; an iter-N capture clears probe swatches: render them after it (402). No python. 4+ units: background it.
- Two gaps in one file: commit them apart by staging a hunk subset (git diff > f.patch, keep the hunks, git apply --cached), so each reverts alone (406).
- Logged at the swing start / let-go, not the landing: a preset's instant "slam" (use the pending blow, 426); a special logged as a missile leaves owns that missile (427 queen). A status logged at the cast (fire_dot) makes _struck precede the missile: an on-landing mechanic needs ABILITY_PREF (435 candlehead).
- The _ability/_release shots are the log tick itself, before RuntimeUnit.update: a swap or pose set at the log shows only after (437 bat); log a latch's hit later (438 bite).
- A crewman moved behind a vehicle hides behind the near wheel at the .6 rad idle swing: re-aim it the same iteration (428 cannon).
- A piece rooted at the neck must clear the head box: probe_bbox it beside the headM (439 vampire spikes sat inside the head). A pose over a swing: probe yaw and torso world pitch at the hit before flipping signs (439 bite).

## Rig and dress
- A hunched idle can be _buildIdlePose's hashed sunk stance: a per-unit stance override fixed what scale/bulk did not (436 QUEEN_UPRIGHT).
- aimLimb only aims a fixed-length bone (397). To change a leg's length scale thigh/shin and knee.position.y; the foot's sole is baked a shin under the knee, so move the foot by the shin's change, and the hip by the total (440). Leg length won't read while the pelvis box and boot tops cover the thigh (441 queen).
- Flipping a flat disc or ribbon one-sided by its summed normal (faceFront) can turn it away from the camera (390 halfling V vanished): build small flat dress pieces as thin closed slabs instead.
- An engine's projectile can be a copy of a named node on the build (LOADED_BOLTS + heldProp/_buildHeldMissile): the flying shape then matches the loaded one for free.
- A hood or cap over the block head needs a superellipsoid profile (exponent about 3, 1.2 of the head) to clear the chamfered corners.
- A shared prop that marks its mechanic by the style OBJECT (`style === VALKYRIE_WINGS`) loses the mechanic the moment one unit gets its own style: key the marker on a flag in the style (`fly: true`) so a per-unit fork keeps the flight/beat (394 valkyrie wings).
- unitFactory replaces every mesh's metadata ({ runtimeUnit }): mark a prop for the animator with a named child node, not metadata (427 dragon pistol).
- A pose keyed off `_air` reaches every airborne humanoid (hop-backs, the halfling's jump): gate it on a runtime flag set by the one mechanic it belongs to (392 leap pose).
- A hook on a shared ability name (`flying_hover`) hits every unit that lists it, including done units outside the batch (392 valkyrie).
- A foot mesh is a merged cuff + toe box ~half the shin tall: a tuft at its bbox middle is buried; the instep's top is lo.y + ~.42 (399). Shoes, anklets, socks go at that height or the boot eats the shin (433); the grass hides a foot box to ~.6, so a shoe must top that (434).
- A hem or band cut at a share of limbBox(thigh) misses the knee: the thigh runs ~.08 past the joint; anchor to knee.position.y in the hip frame. Shin, foot, trunk and _yoke meshes in the dark body shade read as boots or a vest: recolour them to the dress cloth (433).
- A critic's "the X's kit" ask is often cheapest as a call to the other unit's dress function, which adapts to the receiver's own limb boxes (399 berserker/brawlerLegs).
- A pelvis (hip-joint) pitch carries the legs with it: +1.2 rad lays the body flat - head forward, face down, legs trailing - so a whole-body dive pose comes from the hip joint alone (400 headbutter).
- A piece hung in the head's frame cannot run on down the torso: at the chest's z it sits inside the chest box - build the torso run as its own torso-parented piece (401 jarl).
- The bead eyes hang off the neck joint, not the head block: a head-hung cap or band must be seated off the eyes' world tops read into the head's frame, or it covers them (403 ice archer); shrinking headSize leaves the eyes where they were (403 headbutter band across the eyes). A peaked cap brim hides them too (429 cannon).
- A beast hood's ellipsoid skull reads as a flat cap unless its features stand proud of the ellipsoid's own front at their height: sample the skull's front z at the eye's y, not one z for all (400 jarl).
- bakeCurrentTransformIntoVertices on a parented mesh bakes the parent's world transform in too: bake, then parent (407 jarl flaps stood over his head).
- A leg-length change reads only if the dress over the leg scales with it: brawlerLegs' boots and cuffs kept the visible belt-to-sole at 41% while the probe hip rose to 52% (406 headbutter). Measure the shot, not the bone.
- A closed trapezoid plate is a 4-tessellation frustum cylinder squashed in z (KABUTO plate): facet skirts, blades and crests come from it; arc cylinders are one-sided ribbons SSAO greys, their opening an angle to get wrong (421).
