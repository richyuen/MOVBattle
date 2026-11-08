# Lessons (loop v3): facts about the pipeline, the capture and the rig that outlive one unit

Read whole at step 1; one fact per line, merge near cap.

## Rendering (swiftshader + PBR + SSAO + ACES + glow)
- PBR colours are linear: an sRGB target c needs about c^2.2 as the code (wood (.62,.3,.2) displayed taupe). Pick values off `output/loop/palette.png` (rewritten every capture; `capture.mjs --palette` alone).
- SSAO (main.ts, radius 1.5) reads a DOUBLESIDE ribbon's inward faces as occlusion and greys the cloth: build dress shells one-sided facing out (check flipFaces), never double-sided at the same depth.
- Flat colour that survives ACES: an "unlit" material's colour comes from its EMISSIVE only (baseColor alone renders black), excluded from the glow layer (glow.addExcludedMesh). A saturated red needs emissive r > 1 and b near 0.
- ACES lifts a mid code value toward pale, so an unlit plate keeps a deep value (zeus's gold emblem is (0.62,0.26,0.03), 400); the same for timber: an IBL-lit mid albedo reads beige, so a brown hull wants (.2,.11,.055) with a small self-light (400).
- "metal" renders near black: use "cloth" with a small emissive. Lit cloth in shade reads grey however white or warm: cream wants the flat unlit cut out of the glow (442).
- wrapAsBody team-tints the main mesh's material on every mesh sharing it (a vehicle's `bodyMaterial` IS the team colour: timber, iron, leather need their own; 392), and the head's as skin: a bone crewman needs a hidden anchor head (440 pumpkin operator).
- vehicleBuilder makeMat is getWood and greys a mid colour (472 tank tan swatched sat .05): paint with a cloth lit() material, check a --noglow swatch.
- A prop hung in a crewman's fist with holdInFist is aimed by the prop's local +Z: geometry built up +Y leaves the hand horizontal. Put the shape under a child rotated +PI/2 on x (longship oars, 395).

## Capture and probes
- `release` is the first PLAIN event in the list, and only then `events[0]`: a mechanic judged in `_release` must also log a plain hit at its blow (394 headbutter: the headbutt pushes a hitLog entry, so release and ability land on the same tick).
- stats.json is stats.mjs's; every non-regression capture wipes iter-N (stats.json, a tail batch's audit.md): back audit.md up before step 5, rerun `stats.mjs <ids> --iter N` after the final capture (422). Checkpoint replaces summary.json: back up first (483).
- Probes in loop/scripts/probes/, repo root (--build after source changes): probe_bbox (--unit --pat --frame=torso), probe_near/close/head/local/axes/impale/bowdraw; probe_close takes --aim=head|torso|y:<y>, --dist, --yaw, --noglow; probe_eval --unit --expr=<file> runs a function body on the spawned unit (u, game, scene) and prints its JSON (materials, a scene with extra men, event timing).
- capture's PLAIN regex takes any ability kind starting missile/fire/throw/cast/burst/volley as the plain attack: a special's kind must not (475 wizard firework: no ability shot).
- A held pole stands planted upright (PRIEST_HOLD) only as a rod (named "staff" with an "orb" or "uprightPole" child); any other staff rides the support slant, +y to the ground (457).
- A bowman not in simulationSystem DRAWS_BEFORE_LOOSE looses at the decision: his _release/_windup shots catch the carry, never the draw (443 skeleton archer); a struck shot may frame the ENEMY archer.
- materialPreset secret_ghost blends the team body 55% to lavender at alpha .94: a unit with a team garment wants the plain preset (443 vampire).
- Babylon fresnel t=|n.v|^power is 1 face-on: opacity fresnel ADDS left*(1-t)+right*t, so a thin rim wants power<1 (.25; 3 washed a field amber, 489). Cull back faces; give a 6 m field a pulled-back shot. Probing in-page: swap in a new material (prop edits do not recompile).
- The idle and lineup shots are a front three-quarter on the weapon side; a blocker on a face, chest ornament or shield face judged in a side shot is mis-aimed (re-aim with an evidence commit, not a dress change).
- The idle shot is ~100 ms after spawn: a lift, pose or weight eased in from zero reads as absent - start at full weight from spawn and keep it in every later re-solve (393 valkyrie, 394 berserker).
- Capture frames by mesh top when a prop exceeds the head by .3 of UNIT height: taller props re-frame all shots, requiring RE-AUDIT (420, 447).
- `capture.mjs --units` takes a comma list, no spaces; an iter-N capture clears probe swatches (render them after).
- A dress change aimed at the idle must clear the rest pose: probe what covers that band first (442 queen). A giant's metrics.overallHeight is pre-hover: use headTop world y.
- Two gaps in one file: commit apart (stage a hunk subset with git apply --cached) so each reverts alone (406).
- Logged at the swing start / let-go, not the landing: a preset's instant "slam" (use the pending blow, 426); a special logged as a missile leaves owns that missile (427 queen). A status logged at the cast (fire_dot) makes _struck precede the missile: an on-landing mechanic needs ABILITY_PREF (435 candlehead).
- The _ability/_release shots are the log tick itself, before RuntimeUnit.update: a swap or pose set at the log shows only after (437 bat). A latch reads in _release when it pins at the decision and its plain hits come from the draughts .3 s on (444 vampire).
- A piece rooted at the neck must clear the head box: probe_bbox it beside the headM (439 vampire spikes sat inside the head). A pose over a swing: probe yaw and torso world pitch at the hit before flipping signs (439 bite).

- An idle hold gated on Attacking+throw stays on through a long-cooldown windup: gate it on the fire (451). RuntimeUnit._applyPoseOverlay (posePreset gunner, archer...) runs AFTER the animator's layers and re-turns a held aim: probe the final frame (455 barrel 17° up).
## Rig and dress
- Retire superseded hip skirts/ropes (482). The `_yoke` hull spans the trunk, wider than a slim torso: re-skin it for a bare waist, size shells from it (487).
- A short-legged read is measured in the shot: probe the hem's SIDES, the cuff top and the hip sink before a stance change (450 queen: 3 rejections cut the front hem while the sides hung to the ankle). metrics.overallHeight is the PRE-CUT height; a shin limbShell's 0 is the calf cap, ~.1 m over the knee.
- aimLimb only aims a fixed-length bone (397). To change a leg's length scale thigh/shin and knee.position.y; the foot's sole is baked a shin under the knee, so move the foot by the shin's change, and the hip by the total (440). Leg length won't read while the pelvis box and boot tops cover the thigh (441 queen).
- unitFactory replaces every mesh's metadata ({ runtimeUnit }): mark a prop for the animator with a named child node, not metadata (427 dragon pistol).
- A foot mesh is a merged cuff + toe box ~half the shin tall: a tuft at its bbox middle is buried; the instep's top is lo.y + ~.42 (399). Shoes, anklets, socks go at that height or the boot eats the shin (433); the grass hides a foot box to ~.6, so a shoe must top that (434).
- A hem or band cut at a share of limbBox(thigh) misses the knee: the thigh runs ~.08 past the joint; anchor to knee.position.y in the hip frame. Shin, foot, trunk and _yoke meshes in the dark body shade read as boots or a vest: recolour them to the dress cloth (433).
- A head-hung piece cannot run on down the torso (it sits inside the chest box): build the torso run torso-parented (401).
- The bead eyes hang off the neck joint, not the head block: a head-hung cap or band must be seated off the eyes' world tops read into the head's frame, or it covers them (403 ice archer); shrinking headSize leaves the eyes where they were (403 headbutter band across the eyes). A peaked cap brim hides them too (429 cannon).
- A leg-length change reads only if the dress over the leg scales with it: brawlerLegs' boots and cuffs kept the visible belt-to-sole at 41% while the probe hip rose to 52% (406 headbutter). Measure the shot, not the bone.
- Flat dress pieces are closed slabs (a one-sided disc can face away, 390; a plate on a ribbon needs 7+ cm stand-off, 398); a trapezoid plate is a 4-tessellation frustum squashed in z (KABUTO); arc cylinders are one-sided ribbons SSAO greys (421).
- A faction tint plus the clothed recolour's warm hue shift turns red-team body cloth tan (449 wild_west): a garment the ref shows in team colour gets its own team cloth material, not body.bodyMaterial; check the red team on a --noglow swatch.

- A prop not in _carryProp's node regex rides the fist, so _aimBlow's raised fist points it back at the hit: lay it on _aimTip before _twoHandPole (451 miner).
- The hashed idle crouch (knee to .9 rad) pokes a knee through a knee-length hem: pair it with an upright stance (451 cactus).
- A glove's blow is blade_slash (inferWeaponPresentationFamily): gate a fist layer on Attacking, not _attackMotion "strike" (463).
- A torso-rooted shield detaches in windup (483, 489 pavise); dispose sim meshes in endSimulation (485).
- An effect child of a longer one (a cloud's .3 s bolts) can die inside one capture advance before _struck: tie its life to its owner (492 lich).
- _buildCarry turns only nodes in its name regex; a marker child (uprightHammerCarry) gives the head-up carry. Unmarking a "staff"+"orb" rod hung it head-down (493).
- A ground-length skirt hides a hover lift: shorten the dress first (493 lich).
- Near-black cloth: "unlit" near-black and smooth lit near-black both read plum in the field haze (494 cultist robe); use lit cloth (.08,.06,.07), self-lit .4, roughness 1.
- A missile catch needs arrows before contact: spar against archers (494 sentinel).
- In a fist prop's hand frame +y runs up the forearm (time_gauntlet cuff): past the knuckles is -y (492 claw).
- bakeCurrentTransformIntoVertices bakes the world matrix: bake before parenting (495).
- Black in front of self-lit cloth or bone reads brown: the glow halo (black with --noglow); exclude the neighbours from the glow (495).
