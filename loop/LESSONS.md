# Lessons (loop v3): facts about the pipeline, the capture and the rig that outlive one unit

Read whole at step 1; one fact a line, merge near cap.

## Rendering (swiftshader + PBR + SSAO + ACES + glow)
- PBR colours are linear: an sRGB target c needs ~c^2.2 as the code. Pick values off `output/loop/palette.png`.
- SSAO greys a DOUBLESIDE ribbon's inward faces: build dress shells one-sided facing out (check flipFaces).
- Flat colour that survives ACES: an "unlit" material's colour comes from its EMISSIVE only (baseColor alone renders black), excluded from the glow layer (glow.addExcludedMesh). A saturated red needs emissive r > 1 and b near 0.
- ACES lifts mid code values toward pale: an unlit plate keeps a deep value (zeus gold (.62,.26,.03)); lit timber wants (.2,.11,.055), small self-light (400).
- "metal" renders near black: use "cloth" with a small emissive. Lit cloth in shade reads grey: cream wants unlit, out of the glow (442).
- wrapAsBody team-tints the main mesh's material on every mesh sharing it (a vehicle's `bodyMaterial` IS the team colour: timber, iron, leather need their own; 392), and the head's as skin: a bone crewman needs a hidden anchor head (440 pumpkin operator).
- vehicleBuilder makeMat (getWood) greys a mid colour (472): paint with cloth lit(), check a --noglow swatch.
- holdInFist aims a prop by its local +Z: build up +Y under a child turned +PI/2 on x (395).

## Capture and probes
- A volley unit fires through SS._fireVolley: per-unit arrow options (heartArrow, iceArrow) go there too (519).
- stats.mjs rounds knobs to .01: under .005 prints 0 (NaN next run); set the exact ratio.
- `release` is the first PLAIN event in the list, and only then `events[0]`: a mechanic judged in `_release` must also log a plain hit at its blow (394 headbutter).
- A capture wipes iter-N (stats.json, a tail audit.md): back audit.md up, rerun `stats.mjs <id,id> --iter N` (comma list) after the last capture (527). Checkpoint replaces summary.json (483).
- RotationX(+a) tips +y toward +z; a cylinder arc .5 under RotationX(+PI/2) has its half up (537). A turn-on-friends status: a friend in the scene, his log counted (537).
- A cast fired as a man closes in misses a duel whose man dies at range: a second man walks in, own pair (537).
- Probes (loop/scripts/probes/, repo root, --build after source changes): probe_bbox (--unit --pat --frame=torso), probe_near/close/head/local/axes/impale/bowdraw; probe_close --aim=head|torso|y:<y> --dist --yaw --noglow; probe_eval --unit --expr=<file> runs a function body (u, game, scene), prints its JSON.
- capture's PLAIN regex takes any ability kind starting missile/fire/throw/cast/burst/volley as the plain attack: a special's kind must not (475 wizard firework: no ability shot).
- A held pole stands planted upright (PRIEST_HOLD) only as a rod (named "staff" with an "orb" or "uprightPole" child); any other staff rides the support slant, +y to the ground (457).
- A bowman not in simulationSystem DRAWS_BEFORE_LOOSE looses at the decision: his _release/_windup shots catch the carry, never the draw (443 skeleton archer); a struck shot may frame the ENEMY archer.
- materialPreset secret_ghost tints the team body 55% lavender: team garments want the plain preset (443).
- Idle/lineup: front 3/4, weapon side; a face/chest/shield blocker judged side-on is mis-aimed (evidence commit); prop over the chest: post-release idle-angle shot (525); hips behind a shield: rig 13 (526); off-side shield: rig 14 mirror (534). Faceless at .6 rad reads as a back: .25 (497).
- Size a held prop off joint spreads (originIn), not limbBox (526); a stave thick by share of length: own girth when lengthened (540).
- The idle is ~100 ms after spawn: full weight from spawn, in every re-solve (393).
- A prop above head + .3 unit height reframes all shots: RE-AUDIT (420, 447).
- `--units` takes comma-separated IDs and re-shoots lineup_<f> (498); a lethal blast freezes a duel: off-camera reserves (504).
- A dress change aimed at the idle must clear the rest pose and the held weapon: probe what covers it first (442; 539 log over chest). A giant's metrics.overallHeight is pre-hover: use headTop world y.
- Frame prop openings at the landing spot (522), toppled targets at torso bounds (509), a sky drop on the man ~20 ticks on, sky in frame (539).
- Instant slam logs at swing start: use the pending blow (426); a special logged at let-go owns its missile (427); a cast status can put _struck before impact: ABILITY_PREF for on-landing effects (435).
- _ability/_release are on the log tick, before RuntimeUnit.update: pose for contact, next frame for motion (437, 505); a latch reads on the pin before its damage (444).
- A neck-rooted piece must clear the head box: probe_bbox it (439). Probe yaw and pitch before flipping a pose's sign.
- A world box refreshes only on render: computeWorldMatrix(true) before centerWorld in a per-tick pose (516). Gate an idle hold on the fire (451). Team garment shade: saturate (c^2), scale, self-lit .12; x k at self-lit .4 reads grey (517). RuntimeUnit._applyPoseOverlay runs after the animator and re-turns a held aim (455).
- _heading() is the move heading (backing off, it points away): aim a held weapon at the target; re-lay a fist prop off the hand's world position, not its hand-frame offset (511).
- Gate ability starts on his feet (512). Offset-0 linked actor: build off body.root (528).
- RU.leap sets _leapAir (the in-flight pose hook) only for jump_charge: a leap with a flight pose must set it (513).
- A flat ico's faces sit ~20% inside its ellipsoid: ray-cast surface dress on (512).
- Two pinned men topple apart: RU.holdUpright each step (514).
- A vehicle rider is an addOperator in its builder, posed in the callback (529); flip a held blade at its grip, a rotation offset turns it about its middle.
## Rig and dress
- A chain or rope off a moving fist: a world-space rope pinned to the hand in RU.update, laid out at spawn (secretDress ChainWhip, 519).
- A pole butt in the hip box hides the off fist: carry it ahead of the hips (511). Move the whole body to reach a target (509). A tall crown tips with the head pitch: stand it on the torso joint (500); a torso board on body.root (496).
- A prop placed before movement can lag a turn: parent to the fist and convert world aim to hand space (521). IK: carryOverheadAt (520).
- Linked actors (mount, safe, shell) share the parent's definition id. Gate dress on visual.special and shared pose presets on the unit id (518, 523); a horse actor holds mount_horse (527); suppressParentSpecial blanks the parent's: gate on posePreset.
- Retire old skirts (482); a belt hides in a tunicSkirt flare: build it off its top ring (517). Use the `_yoke` for trunk backing or shell sizing (487). Check for later dress passes that repaint it (508).
- Before changing stance, probe hem sides, cuff top and hip sink (450). Shin limbShell 0 is the calf cap, ~.1 m over the knee.
- aimLimb only aims a fixed-length bone (397). To change a leg's length scale thigh/shin and knee.position.y; the foot's sole is baked a shin under the knee, so move the foot by the shin's change, and the hip by the total (440). Leg length won't read while the pelvis box and boot tops cover the thigh (441 queen).
- unitFactory overwrites mesh metadata: mark a prop for the animator with a named child node (427).
- A foot mesh is a merged cuff + toe box ~half the shin tall: a tuft at its bbox middle is buried; the instep's top is lo.y + ~.42 (399). Shoes, anklets, socks go at that height or the boot eats the shin (433); the grass hides a foot box to ~.6, so a shoe must top that (434).
- A hem or band cut at a share of limbBox(thigh) misses the knee: the thigh runs ~.08-.12 past the joint; anchor to knee.position.y - thigh.position.y (shin: -shin.position.y) (512 shouter). Shin, foot, trunk and _yoke meshes in the dark body shade read as boots or a vest: recolour them to the dress cloth (433); open dress stands off the _yoke box (525).
- A head-hung piece cannot run on down the torso (it sits inside the chest box): build the torso run torso-parented (401).
- The bead eyes hang off the neck joint, not the head block: a head-hung cap or band must be seated off the eyes' world tops read into the head's frame, or it covers them (403 ice archer); shrinking headSize leaves the eyes where they were (403 headbutter band across the eyes). A peaked cap brim hides them too (429 cannon).
- A leg-length change reads only if the dress over it scales with it (406).
- Flat dress pieces are closed slabs (a one-sided disc can face away, 390; a plate on a ribbon needs 7+ cm stand-off, 398); arc cylinders are one-sided ribbons SSAO greys (421).
- A faction tint plus the clothed recolour's warm hue shift turns red-team body cloth tan (449 wild_west): a garment the ref shows in team colour gets its own team cloth material, not body.bodyMaterial; check the red team on a --noglow swatch.
- Hashed crouch pokes a knee through a hem: stand up (451). A glove's blow is blade_slash: gate on Attacking (463).
- A torso-rooted shield detaches in windup (483, 489 pavise); dispose sim meshes in endSimulation (485).
- _buildCarry turns only nodes in its name regex (marker child uprightHammerCarry: head-up carry, 493).
- A ground-length skirt hides a hover lift: robe under the knee rides each shin (493).
- Replay probes as capture: mulberry32 0x4d4f5642 reseeded before resetBattle, resetClock, _nextRuntimeId 100000 (503, 512). hpoint without "haxe": shouldered carry (502).
- Fist prop hand frame: +y up the forearm, knuckles -y (492). bakeCurrentTransformIntoVertices bakes the world matrix: bake, then parent (495).
- Near-black: lit cloth (.08,.06,.07) self-lit .4 rough 1 (unlit/smooth reads plum, 494); by self-lit skin or bone the glow halo browns it: exclude those from the glow (495).
- execSync runs cmd.exe, which eats a caret: write sha~1 (530). On-death effects: RU.onDeath (the last death ends the duel first, 535).
