# Loop ledger: every value the loop has tuned

Rows: `file:identifier | current value | last iter | verdict | earlier values (newest first)`.
Verdicts: approved, rejected, pending, spent. A row is `spent` after two attempts without approval
or when it was listed as never-retry; it is not pickable as [P]. The critic rejects a [P] gap that
reverses or re-nudges a row approved within the last 20 iterations ("ledger reversal"). An [S] gap
that replaces the mechanism owning a row may set new values: the worker resets the row to pending
and keeps the old value under earlier values. One row per tuning knob a mechanism exposes, not per
line; a value column is at most 80 characters (name the knobs, not their story). The worker updates
rows at commit time (pending) and after verdicts. Drop rows untouched for 25 iterations.

## Rows
proceduralAnimation.ts:press blow (_pressBlow landed-dominant beat: PRESS_BLOW_BEAT_*, _REST, _HEAVE, _COCK, _SLAM, _ARM, _CLUB; flinch on landing; blowStrikeReach) | beat 1.5-2.4 s, rest 0.38, heave 0.14, cock 0.1, slam 0.08, impact rest; arm 1.7, club arc 1.2; strike reach 0.9 m | 226 | approved | was drop 0.1/hold 0.16/back 0.16, arm 3.0 (202)
cameraController.ts:spectator low (LOW_LAUNCH, LOW_EYE, LOW_PITCH, LOW_HOLD, LOW_EASE; offset over the follow aim) | 3+ bodies flung: eye 0.45 m, pitch +0.3 rad, hold 1.2 s, ease 4 | 221 | approved |
visualEffects.ts:fireball sprites (_spawnFireball, FIREBALL_CORE/BODY/RIM, _GROW, _LIFE, DUST_SPRITES/_LIFE, SMOKE_SPRITES/_LIFE; peaks) | additive core 3 @0.95, body 5 @0.7, rim 7 @0.55, grow 0.28, life 0.9; dust 10 @0.8, smoke 6; alphaIndex dust < smoke < fire (FIREBALL_ALPHA_INDEX) ; fire set back FIREBALL_BEHIND 1.6 along the view | 223 | approved | [P] dust 0.45/body 0.95 rejected 221

## Structural attempts (last 10 iterations; `iter | gap | criterion | verdict`)
- 236 | upright-wall-legs | battle-feel.h | approved
- 237 | wall-head-level | battle-feel.h | approved
- 237 | archer-brim | unit-look.h | dropped
- 238 | wall-board-lean | battle-feel.h | approved
- 239 | hood-cowl | unit-look.h | approved
- 240 | healer-cowl | unit-look.h | approved
- 240 | [R] aimed-blow rebuild | battle-feel.e | rejected
- 241 | viking-horned-helm | unit-look.l | approved
- 241 | [R] aimed-blow rebuild | battle-feel.e | rejected
- 242 | valkyrie-wings | unit-look.l | approved
- 242 | [R] wall-surface rebuild | battle-feel.h | approved
- 243 | minotaur-bull-man | unit-look.k | approved
- 243 | protector-slab | unit-look.i | approved
- 244 | hoplite-crested-helm | unit-look.k | approved
- 244 | knight-cross-helm | unit-look.v | approved
- 245 | team-tinted-crested-helm | unit-look.k | approved
- 245 | tiered-pagoda | maps-light.l | approved

## Spent gaps (never retry as [P]; an [S] on the same criterion is allowed)
slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, hoop colour, smoke diameters, fire segments/emissives, result-foreground-club, run-arms-one-splay, crew hoops.

mapBuilder.ts:backdrop haze plugin (BACKDROP_HAZE_NEAR, _FAR, _MAX, _EYE, _LIFT) | 26 m, 80 m, 0.55, eye 30 m, lift 0.45 toward white | 223 | approved | [P] NEAR 26->18 rejected 224 (not visible; ledger reversal)
runtimeUnit.ts:flung render group (FLUNG_RENDER_GROUP; main.ts group 1 keeps depth) | airborne > 0.35 m drawn after blast sprites | 224 | approved |
mapBuilder.ts:spooky dressing (deadTree, tomb, graveLight kinds; spooky prop list) | 10+10 tombs scale 1.4-1.5, 6 dead trees 1.5-1.8, 4 pink lights | 224 | approved |
mapBuilder.ts:theme ring palette + deadenRing (RING_DEAD_FROM; spooky ring leaves/darkLeaves/trunk/bare) | 30 m; navy 0.2,0.22,0.4 / 0.14,0.15,0.3, trunk 0.1,0.09,0.14, bare 0.6 | 225 | approved | [P] leaves 0.12,0.13,0.26 + crown emissive 0.3 rejected 226 (ledger reversal)
index.html+main.ts:campaign map (CAMPAIGN_NODE_AT node layout, card, thin caps) | 15 node slots, card 300px bottom-right, caption one sentence | 225 | approved |
mapBuilder.ts:setPlacementGuidesVisible hides zone tints (zone_overlay_*, campaign_zone_*) in battle | placement-only tints | 227 | approved |
simulationSystem.ts:_keepRanksDeep (RANK_DEPTH_SHARE; rear-rank vs front-rank depth-only resolve) | 0.95 of the clear body depth | 229 | approved |
simulationSystem.ts:wall queue in _keepRanksDeep (WALL_QUEUE_GAP; non-carrier allies behind front-rank wall men) | body + 0.25 m | 230 | approved |
proceduralAnimation.ts:overhand rear-rank spear (SPEAR_OVERHAND_UP; rear hold x foe near, eased 6/s, aimed on the foe bearing) | 0.18 rad above level | 230 | approved |
mapBuilder.ts:CanopyAerialPlugin on *Crown materials (CANOPY_AERIAL_NEAR, _FAR, _MAX, _LIFT) | 8-55 m from the eye, 0.42, lift 0.55 | 231 | approved |
proceduralAnimation.ts:rear-rank club rest (REAR_CLUB_REST; simulationSystem _allyBetween, REAR_RANK_REACH, _LANE) | 0.85 of cock->landed, heave 0.08; reach +1.4 m, lane 0.7 m | 232 | approved |
proceduralAnimation.ts:pressed board tilt + press stride (BOARD_PRESS_TILT, PRESS_DRIVE; per-man lean = half tilt + half trunk pitch + rock 0.06) | 0.3 rad (half + 1/3 trunk pitch, on wall lean); drive 0.4 | 242 | approved | half tilt + half pitch (234); shared 0.3 (232)
propBuilder.ts:buildFittedHat (HEAD_FITTED_HATS incl. helmet/plume_helmet, HELM_HEADS, HELM_CROWN, PLUME_TALL, HAT_EYE_CLEAR, BERET_*, CONE_*) | seat 0.05 head over eye top; beret 2 heads x 0.32, tilt 0.22; cone brim 2.1, foot 1.5, tall 1.05; helm dome 1.2 heads to 0.12 over crown, crest 0.45 | 237 | approved | flared skirt rejected 235
proceduralAnimation.ts:upright wall stance (WALL_TRUNK_MAX, WALL_HEAD_LEVEL, WALL_KNEE_MAX, WALL_HIP_MAX, WALL_SINK_SHARE; hip splay cleared, by wallHold) | trunk <= 0.3, head 0.9 back; knee <= 0.35, thigh +-0.35, sink 0.3 | 236 | approved |
proceduralAnimation.ts:wall board seeds (WALL_BOARD_DEPTH, _STEP, _TURN, _LEAN; boardRoll whole; in _lapBoard) | 0.09 m, 0.1 m, 0.38 rad, lean -0.2..0.3 + press | 242 | approved | BOARD_SCATTER 0.6 (238)
propBuilder.ts:fitted hood_liripipe + plain hood (HOOD_HEADS, HOOD_OPEN, HOOD_MANTLE_HEADS; peak, tail) | cowl 1.3 heads, open 0.3, mantle 2.2; plain hood same, accent x0.6, no tail | 240 | approved | plain hood a perched cone
propBuilder.ts:fitted horned helm (viking_helmet/horned_helmet; HORN_ROOT, HORN_TIP, HORN_SEAT, HORN_TURN, BEARD_HEADS/TOP/LONG) | iron dome; horns 0.32+0.55 heads, seat 0.45, turn 1.15; beard 0.8 x 0.75 at 0.66 | 241 | approved | sphere-cap dish + splayed cones
propBuilder.ts:round board faces (ROUND_FACES, ROUND_SHADE, ROUND_PAINT; serial seed) | 3 faces, shade +-0.12, paint 1.45 | 242 | approved | 3 parallel seams
propBuilder.ts:bone skull cap (bone_mask fitted: SKULL_HEADS, SKULL_SOCKET, SKULL_SNOUT; no hair mop) | 1.25 heads, socket 0.26, snout 0.45; eyes shown | 242 | approved | face-covering sphere 0.24 s
propBuilder.ts:feather wings (WING_SPAN, _RAISE, _SWEEP, _FEATHERS, _FEATHER_LEN, _FEATHER_FAN) | 2.4 torsos, 0.5, 0.3, 7, 0.32-0.62, 0.35-1.25 | 242 | approved | two 0.35x0.25 s boxes
propBuilder.ts:fitted bull_head (BULL_SHELL, _MUZZLE, _MUZZLE_DIP, _EYE, _HORN_ROOT, _HORN_TIP, _HORN_TURN) | shell 1.15 heads, muzzle 0.75 dip 0.4, eye 0.34, horns 0.42+0.85 turn 1.05 | 243 | approved | vehicle blob 1.4 m
unitVisuals.ts:minotaur humanoid proportions (scale, bulk, headSize, armLength; off the vehicle set) | 2.1, 1.5, 1.7, 1.15 | 243 | approved | 1.7/1.6/1.4 vehicle rig
propBuilder.ts:fitted crested_helm (CREST_HELM_HEADS, _CHEEK_DROP, _CHEEK_WIDE, CREST_TALL, _LONG, _STALK) | 1.28 heads, cheeks 0.62 x 0.24, crest 1.05 x 1.25 x 0.26, stalk 0.14; team x0.88 + 0.18 bronze, crest team x0.62 | 245 | approved | fixed bronze + red crest (244); plume_helmet/helmet dome
propBuilder.ts:kite cross (kcross bars replace the boss; knight hat great_helm) | upright 0.04 x 0.38 at -0.04, arm 0.15 x 0.04 at 0.0, cream | 244 | approved | grey boss; knight plume_helmet
mapBuilder.ts:dynasty pagoda + torii (addPagoda/addRoof/addStorey, addTorii; red cornice 1.08 eave) | pagoda 0.9 at z 29: W 11, eaves 1.18/0.72 W, slate 0.3,0.33,0.42; torii -17,25 | 245 | approved | white temple box at centre
propBuilder.ts:protector slab shield (SLAB_WIDE, SLAB_TALL, slabSerial; carry rotation.x pi/2; wood lerp 0.12 to team) | 0.25 x 0.71 (x1.9 carry), emissive 0.08 | 243 | approved | round board
