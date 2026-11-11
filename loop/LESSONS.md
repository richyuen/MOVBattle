# Lessons (loop v3): facts about the pipeline, the capture and the rig that outlive one unit

Read whole at step 1; one fact per line, merge near cap.

## Rendering (swiftshader + PBR + SSAO + ACES + glow)
- PBR colours are linear: an sRGB target c needs ~c^2.2 as the code. Pick values off `output/loop/palette.png` (rewritten every capture; `capture.mjs --palette` alone).
- SSAO (main.ts, radius 1.5) reads a DOUBLESIDE ribbon's inward faces as occlusion and greys the cloth: build dress shells one-sided facing out (check flipFaces), never double-sided at the same depth.
- Flat colour that survives ACES: an "unlit" material's colour comes from its EMISSIVE only (baseColor alone renders black), excluded from the glow layer (glow.addExcludedMesh). A saturated red needs emissive r > 1 and b near 0.
- ACES lifts a mid code value toward pale, so an unlit plate keeps a deep value (zeus's gold emblem is (0.62,0.26,0.03), 400); the same for timber: an IBL-lit mid albedo reads beige, so a brown hull wants (.2,.11,.055) with a small self-light (400).
- "metal" renders near black: use "cloth" with a small emissive. Lit cloth in shade reads grey however white or warm: cream wants the flat unlit cut out of the glow (442).
- wrapAsBody team-tints the main mesh's material on every mesh sharing it (a vehicle's `bodyMaterial` IS the team colour: timber, iron, leather need their own; 392), and the head's as skin: a bone crewman needs a hidden anchor head (440 pumpkin operator).
- vehicleBuilder makeMat (getWood) greys a mid colour (472): paint with cloth lit(), check a --noglow swatch.
- holdInFist aims a prop by its local +Z: build up +Y under a child rotated +PI/2 on x (395 oars).

## Capture and probes
- stats.mjs rounds knobs to .01: under .005 prints 0 (NaN next run); set the exact ratio.
- `release` is the first PLAIN event in the list, and only then `events[0]`: a mechanic judged in `_release` must also log a plain hit at its blow (394 headbutter: the headbutt pushes a hitLog entry, so release and ability land on the same tick).
- stats.json is stats.mjs's; every non-regression capture wipes iter-N (stats.json, a tail batch's audit.md): back audit.md up before step 5, rerun `stats.mjs <ids> --iter N` after the final capture (422). Checkpoint replaces summary.json: back up first (483).
- Probes in loop/scripts/probes/, repo root (--build after source changes): probe_bbox (--unit --pat --frame=torso), probe_near/close/head/local/axes/impale/bowdraw; probe_close takes --aim=head|torso|y:<y>, --dist, --yaw, --noglow; probe_eval --unit --expr=<file> runs a function body on the spawned unit (u, game, scene) and prints its JSON (materials, a scene with extra men, event timing).
- capture's PLAIN regex takes any ability kind starting missile/fire/throw/cast/burst/volley as the plain attack: a special's kind must not (475 wizard firework: no ability shot).
- A held pole stands planted upright (PRIEST_HOLD) only as a rod (named "staff" with an "orb" or "uprightPole" child); any other staff rides the support slant, +y to the ground (457).
- A bowman not in simulationSystem DRAWS_BEFORE_LOOSE looses at the decision: his _release/_windup shots catch the carry, never the draw (443 skeleton archer); a struck shot may frame the ENEMY archer.
- materialPreset secret_ghost blends the team body 55% to lavender at alpha .94: a unit with a team garment wants the plain preset (443 vampire).
- The idle and lineup shots are a front three-quarter on the weapon side; a blocker on a face, chest ornament or shield face judged in a side shot is mis-aimed (re-aim with an evidence commit, not a dress change). A faceless unit at .6 rad reads as a back: .25 (497).
- The idle shot is ~100 ms after spawn: a lift, pose or weight eased in from zero reads as absent - start at full weight from spawn and keep it in every later re-solve (393 valkyrie, 394 berserker).
- A prop above head + .3 unit height reframes all shots: RE-AUDIT (420, 447).
- `--units` takes comma-separated IDs and re-shoots lineup_<f> (498); a lethal blast freezes a duel: off-camera reserves (504).
- A dress change aimed at the idle must clear the rest pose: probe what covers that band first (442 queen). A giant's metrics.overallHeight is pre-hover: use headTop world y.
- Commit gaps separately so each reverts alone (406). Aim at a toppled target's current torso bounds (509).
- An instant slam logs at swing start: use the pending blow (426). A special logged at let-go owns its missile (427). A cast status can put _struck before impact: use ABILITY_PREF for on-landing effects (435).
- _ability/_release are on the log tick, before RuntimeUnit.update: pose explicitly for contact, and use the next frame for motion (437 bat, 505 parry). A latch reads on the pin before its damage ticks (444 vampire).
- A piece rooted at the neck must clear the head box: probe_bbox it beside the headM (439 vampire spikes sat inside the head). A pose over a swing: probe yaw and torso world pitch at the hit before flipping signs (439 bite).

- Gate an idle hold on the fire, not Attacking+throw; props outside _carryProp's regex ride the fist (451). RuntimeUnit._applyPoseOverlay runs after the animator and re-turns a held aim (455).
- _heading() is the move heading (backing off, it points away): aim a held weapon at the target; re-lay a fist prop off the hand's world position, not its hand-frame offset (511).
- An ability started while toppled/airborne is wiped by its lander and burns the cooldown: gate starts on his feet (512 kick).
- RU.leap sets _leapAir (the in-flight pose hook) only for jump_charge: a leap with a flight pose must set it (513).
- A flat ico's faces sit ~20% inside its ellipsoid: seat surface dress by ray-cast onto the mesh (512 raptor).
- Two men pinned together topple apart under their crowd push: RU.holdUpright each step (514).
## Rig and dress
- A pole butt inside the hip box hides the off fist: carry it ahead of the hips (511). Translating torso to reach a target detaches it from the hips; move the whole body (509). A tall crown hung off the head tips with the head pitch: stand it on the torso joint (500).
- Retire old hip skirts (482). Use the `_yoke` for trunk backing or shell sizing (487). Check for later dress passes that repaint it (508).
- Before changing stance, probe hem sides, cuff top and hip sink (450 queen). metrics.overallHeight is pre-cut; shin limbShell 0 is the calf cap, ~.1 m above the knee.
- aimLimb only aims a fixed-length bone (397). To change a leg's length scale thigh/shin and knee.position.y; the foot's sole is baked a shin under the knee, so move the foot by the shin's change, and the hip by the total (440). Leg length won't read while the pelvis box and boot tops cover the thigh (441 queen).
- unitFactory replaces every mesh's metadata ({ runtimeUnit }): mark a prop for the animator with a named child node, not metadata (427 dragon pistol).
- A foot mesh is a merged cuff + toe box ~half the shin tall: a tuft at its bbox middle is buried; the instep's top is lo.y + ~.42 (399). Shoes, anklets, socks go at that height or the boot eats the shin (433); the grass hides a foot box to ~.6, so a shoe must top that (434).
- A hem or band cut at a share of limbBox(thigh) misses the knee: the thigh runs ~.08-.12 past the joint; anchor to knee.position.y - thigh.position.y (shin: -shin.position.y) (512 shouter). Shin, foot, trunk and _yoke meshes in the dark body shade read as boots or a vest: recolour them to the dress cloth (433).
- A head-hung piece cannot run on down the torso (it sits inside the chest box): build the torso run torso-parented (401).
- The bead eyes hang off the neck joint, not the head block: a head-hung cap or band must be seated off the eyes' world tops read into the head's frame, or it covers them (403 ice archer); shrinking headSize leaves the eyes where they were (403 headbutter band across the eyes). A peaked cap brim hides them too (429 cannon).
- A leg-length change reads only if the dress over the leg scales with it: brawlerLegs' boots and cuffs kept the visible belt-to-sole at 41% while the probe hip rose to 52% (406 headbutter). Measure the shot, not the bone.
- Flat dress pieces are closed slabs (a one-sided disc can face away, 390; a plate on a ribbon needs 7+ cm stand-off, 398); a trapezoid plate is a 4-tessellation frustum squashed in z (KABUTO); arc cylinders are one-sided ribbons SSAO greys (421).
- A faction tint plus the clothed recolour's warm hue shift turns red-team body cloth tan (449 wild_west): a garment the ref shows in team colour gets its own team cloth material, not body.bodyMaterial; check the red team on a --noglow swatch.

- The hashed idle crouch (knee to .9 rad) pokes a knee through a knee-length hem: pair it with an upright stance (451 cactus).
- A glove's blow is blade_slash: gate a fist layer on Attacking, not _attackMotion "strike" (463).
- A torso-rooted shield detaches in windup (483, 489 pavise); dispose sim meshes in endSimulation (485).
- _buildCarry turns only nodes in its name regex; a marker child (uprightHammerCarry) gives the head-up carry. Unmarking a "staff"+"orb" rod hung it head-down (493).
- A ground-length skirt hides a hover lift: robe below the knee rides each shin (493, 499 lich).
- Replay probes as capture: mulberry32 0x4d4f5642 reseeded before resetBattle, resetClock, _nextRuntimeId 100000 (503, 512).
- hpoint without "haxe" gives the shouldered carry: _twoHandPole's off fist lands over the crown (502 bomb stick).
- In a fist prop's hand frame +y runs up the forearm (time_gauntlet cuff): past the knuckles is -y (492 claw).
- bakeCurrentTransformIntoVertices bakes the world matrix: bake, then parent (495).
- Near-black: lit cloth (.08,.06,.07) self-lit .4 rough 1 (unlit/smooth reads plum, 494); by self-lit skin or bone the glow halo browns it: exclude those from the glow (495).
- A torso-rooted board tips back with the idle lean: stand a wall board on body.root, top off the shoulder joint (496 pavise).
