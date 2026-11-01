# Lessons (loop v3): facts about the pipeline, the capture and the rig that outlive one unit

One line each, newest last within its heading. Written by the worker at step 9 whenever an iteration learns something that is not about
one unit (a rendering behaviour, a probe, a pattern that failed twice, a camera rule). Read whole at step 1. Near the cap: merge duplicates,
drop a lesson once it is a comment at the code it describes.

## Rendering (swiftshader + PBR + SSAO + ACES + glow)
- PBR colours are linear: an sRGB target c needs about c^2.2 as the code (wood (.62,.3,.2) displayed taupe). Pick values off `output/loop/palette.png` (rewritten every capture; `capture.mjs --palette` alone).
- SSAO (main.ts, radius 1.5) reads a DOUBLESIDE ribbon's inward faces as occlusion and greys the cloth: build dress shells one-sided facing out (check flipFaces), never double-sided at the same depth.
- Flat colour that survives ACES: an "unlit" material's colour comes from its EMISSIVE only (baseColor alone renders black), excluded from the glow layer (glow.addExcludedMesh). A saturated red needs emissive r > 1 and b near 0.
- ACES lifts a mid code value toward pale, so an unlit plate keeps a deep value (zeus's gold emblem is (0.62,0.26,0.03), 400); the same for timber: an IBL-lit mid albedo reads beige, so a brown hull wants (.2,.11,.055) with a small self-light (400).
- "metal" renders near black under swiftshader: use "cloth" with a small emissive.
- Lit cloth in shade reads grey however white or warm: cream wants the flat unlit cut out of the glow (442 bone (1.1,.78,.4) swatched 215/199/164; self-lit cloth stayed grey 441).
- wrapAsBody team-tints the main mesh's material on every mesh sharing it (a vehicle's `bodyMaterial` IS the team colour: timber, iron, leather need their own; 392), and the head's as skin: a bone crewman needs a hidden anchor head (440 pumpkin operator).
- A prop hung in a crewman's fist with holdInFist is aimed by the prop's local +Z: geometry built up +Y leaves the hand horizontal. Put the shape under a child rotated +PI/2 on x (longship oars, 395).

## Capture and probes
- `release` is the first PLAIN event in the list, and only then `events[0]`: a mechanic judged in `_release` must also log a plain hit at its blow (394 headbutter: the headbutt pushes a hitLog entry, so release and ability land on the same tick).
- stats.json is written by stats.mjs, not by capture; every non-regression capture wipes iter-N (stats.json, a tail-overlap batch's audit.md too) and each stats run overwrites it: copy audit.md out before step 5 and restore it, rerun `stats.mjs <id,id,...> --iter N` once with every unit after the final capture (422).
- Probes (`loop/scripts/probes/`, repo root, `--build` after a source change): probe_bbox (--unit --pat --frame=torso: vertex bboxes), probe_mat <unit> <regex>, probe_near, probe_close (--aim=head|torso|y:<y> --dist --yaw; --noglow: true colour), probe_head, probe_local, probe_axes (--unit --pat --frame: a prop's axes and face normal), probe_impale, probe_bowdraw (--unit: a bowman's state, arms and bow axis over 1 s, front shot to output/loop/probe_bowdraw.png).
- A bowman not in simulationSystem DRAWS_BEFORE_LOOSE looses at the decision: his _release/_windup shots catch the carry, never the draw (443 skeleton archer); a struck shot may frame the ENEMY archer.
- materialPreset secret_ghost blends the team body 55% to lavender at alpha .94: a unit with a team garment wants the plain preset (443 vampire).
- A flat plate on a dress ribbon needs 7+ cm of stand-off: the ribbon's chords dip inside its rim (398/399 zeus).
- Sim reads of joint positions must settle world matrices first (computeWorldMatrix(true) up the parent chain, as capture's __wp does).
- The idle and lineup shots are a front three-quarter on the weapon side; a blocker on a face, chest ornament or shield face judged in a side shot is mis-aimed (re-aim with an evidence commit, not a dress change).
- The idle shot is ~100 ms after spawn: a lift, pose or weight eased in from zero reads as absent - start at full weight from spawn and keep it in every later re-solve (393 valkyrie, 394 berserker).
- The capture frames a unit by its mesh top when a prop stands over the head by more than .3 of the UNIT height (a cap may rise .7 of a head, 447): a taller prop re-frames every shot, so a RE-AUDIT follows (420).
- A pistol is found by its "pistolBell" child (_aimPistol, GUN_TOSS): a new gun cut without it floats off the fist (445 revolver). Gun smoke/flash are meshes (trailPuff, flash, pistolFlash): take() {hold, clean} holds one camera and hides them (446).
- A bowman at the ready turns his chest up to .95 rad and his head off it: aim his idle from the head block's world facing, alpha = atan2(fz, fx) - swing (402 ice archer).
- A wide stance reads as a stride from the .6 rad idle swing: probe the feet (probe_local --pat=FootM) before a "stride" pose gap (403).
- `capture.mjs --units` takes a comma list, no spaces; an iter-N capture clears probe swatches: render them after it. 4+ units: background it.
- A dress change aimed at the idle must clear the rest pose: probe what covers that band first (442 queen: the hem-to-knee band sat behind her sword guards, two commits dropped). A giant's metrics.overallHeight is pre-hover: use headTop world y.
- Two gaps in one file: commit them apart by staging a hunk subset (git diff > f.patch, keep the hunks, git apply --cached), so each reverts alone (406).
- Logged at the swing start / let-go, not the landing: a preset's instant "slam" (use the pending blow, 426); a special logged as a missile leaves owns that missile (427 queen). A status logged at the cast (fire_dot) makes _struck precede the missile: an on-landing mechanic needs ABILITY_PREF (435 candlehead).
- The _ability/_release shots are the log tick itself, before RuntimeUnit.update: a swap or pose set at the log shows only after (437 bat). A latch reads in _release when it pins at the decision and its plain hits come from the draughts .3 s on (444 vampire).
- A piece rooted at the neck must clear the head box: probe_bbox it beside the headM (439 vampire spikes sat inside the head). A pose over a swing: probe yaw and torso world pitch at the hit before flipping signs (439 bite).

- An idle hold gated on `Attacking && _attackMotion === "throw"` stays on through a long-cooldown thrower's windup (cd x .36): no throw in release/flight (451). Gate it on the fire.
## Rig and dress
- A short-legged read is measured in the shot: probe the hem's SIDES, the cuff top and the hip sink before a stance change (450 queen: 3 rejections cut the front hem while the sides hung to the ankle). metrics.overallHeight is the PRE-CUT height; a shin limbShell's 0 is the calf cap, ~.1 m over the knee.
- aimLimb only aims a fixed-length bone (397). To change a leg's length scale thigh/shin and knee.position.y; the foot's sole is baked a shin under the knee, so move the foot by the shin's change, and the hip by the total (440). Leg length won't read while the pelvis box and boot tops cover the thigh (441 queen). The `_yoke` hull spans the whole trunk, not a collar: never anchor a chest piece to its foot (444).
- Flipping a flat disc or ribbon one-sided by its summed normal (faceFront) can turn it away from the camera (390 halfling V vanished): build small flat dress pieces as thin closed slabs instead.
- unitFactory replaces every mesh's metadata ({ runtimeUnit }): mark a prop for the animator with a named child node, not metadata (427 dragon pistol).
- A foot mesh is a merged cuff + toe box ~half the shin tall: a tuft at its bbox middle is buried; the instep's top is lo.y + ~.42 (399). Shoes, anklets, socks go at that height or the boot eats the shin (433); the grass hides a foot box to ~.6, so a shoe must top that (434).
- A hem or band cut at a share of limbBox(thigh) misses the knee: the thigh runs ~.08 past the joint; anchor to knee.position.y in the hip frame. Shin, foot, trunk and _yoke meshes in the dark body shade read as boots or a vest: recolour them to the dress cloth (433).
- A pelvis (hip-joint) pitch carries the legs with it: +1.2 rad lays the body flat - head forward, face down, legs trailing - so a whole-body dive pose comes from the hip joint alone (400 headbutter).
- A piece hung in the head's frame cannot run on down the torso: at the chest's z it sits inside the chest box - build the torso run as its own torso-parented piece (401 jarl).
- The bead eyes hang off the neck joint, not the head block: a head-hung cap or band must be seated off the eyes' world tops read into the head's frame, or it covers them (403 ice archer); shrinking headSize leaves the eyes where they were (403 headbutter band across the eyes). A peaked cap brim hides them too (429 cannon).
- A beast hood's ellipsoid skull reads as a flat cap unless its features stand proud of the ellipsoid's own front at their height: sample the skull's front z at the eye's y, not one z for all (400 jarl).
- A leg-length change reads only if the dress over the leg scales with it: brawlerLegs' boots and cuffs kept the visible belt-to-sole at 41% while the probe hip rose to 52% (406 headbutter). Measure the shot, not the bone.
- A closed trapezoid plate is a 4-tessellation frustum cylinder squashed in z (KABUTO plate): facet skirts, blades and crests come from it; arc cylinders are one-sided ribbons SSAO greys, their opening an angle to get wrong (421).
- A faction tint plus the clothed recolour's warm hue shift turns red-team body cloth tan (449 wild_west): a garment the ref shows in team colour gets its own team cloth material, not body.bodyMaterial; check the red team on a --noglow swatch.

- A prop not in _carryProp's node regex rides the fist, so _aimBlow's raised fist points it back at the hit: lay it on _aimTip before _twoHandPole (451 miner).
- The hashed idle crouch (knee to .9 rad) pokes a knee through a knee-length hem: pair it with an upright stance (451 cactus).