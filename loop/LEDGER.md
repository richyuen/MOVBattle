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
bodyBuilder.ts:neck (NECK_LENGTH, NECK_BASE, NECK_TOP, NECK_SUNK, NECK_INTO_HEAD, COLLAR_SEAT) | one skin solid 0.05 tall, 0.72 head at the foot, 0.6 at the chin; trapezius ends 0.2 up it | 193 | approved | post 0.5-0.62 head, 0.07 tall, collar 1.2 necks 0.85 up (189)
bodyBuilder.ts:eyes (EYE_OF_FACE, EYE_RIM, EYE_SPREAD, EYE_FLAT, PUPIL_OF_EYE) | white disc 0.3 face, dark rim disc 1.2x behind, 0.16 off centre, depth 0.3; pupil 0.5 | 218 | approved | 0.24, no rim (185)
propBuilder.ts:laurel hair cap cut | front below 0.02 s pulled back to the cap's middle | 197 | approved |
proceduralAnimation.ts:shield brace (_buildBracePose; BRACE_PITCH_*, BRACE_CROUCH_DEEP, BRACE_STEP_*) | trunk pitch 0.14-0.56 own, set not added; head level 0.1-0.8; crouch to 0.7; step 0.22-0.5; twist 0.1-0.5; board follows | 192 | approved | 3 stands pitch -0.08..0.34, crouch to 1.05 (179); lunge 0.35-0.75 (188)
proceduralAnimation.ts:spear carry (_carrySpear; SPEAR_WALL_UP, SPEAR_FRONT_GRIP_*, SPEAR_COUCH_*) | one wall line: slot heading at 1.48 above level, no strike drop; grip 0.2-0.28 | 197 | approved | per man 1.05-1.4, rear strike 0.3 (196); front dipped 0.42-0.64 (192-193)
proceduralAnimation.ts:spear thrust (_thrustStroke, SPEAR_LUNGE, SPEAR_DRAW; brace thrustRate) | lunge 0.45 m, draw -0.4 of it; beat 0.9-1.4/s | 192 | approved | choke 0.45 removed (186)
proceduralAnimation.ts:bow shot (_animateBowDrawRelease, BOW_TURN_*, _carryProp shooting) | turned 0.95-1.3 own; lean 0.06-0.22; stave upright in the fist while the arm is up | 192 | approved | turn 1.15, stave hung (191)
proceduralAnimation.ts:caster hold (_buildCarry cast, _animateCast, CASTER_CROUCH) | staff beside/leant/cradled, bolt cocked/overhead/low; cast from a stride; rest crouch x0.3; overhead off arm thrown out | 191 | approved | squat give 0.1/0.22, off arm hung (184 [P] rejected)
bodyBuilder.ts:lower limb belly (CALF_SWELL, LIMB_BELLY_DROP; armTaper) | shin 1.4 of its top width, 0.3 down; arm one straight taper sleeve top to wrist, no belly | 191 | approved | forearm belly 1.35 (179); no [P]
vehicleBuilder.ts:mammoth hull (BODY_RADII, BODY_LIFT, fur hem, paint daubs, leg width) | ellipsoid 0.85/0.68/1.16 lifted 0.12; 5 hem lobes a side; 4 daubs a side; legs 0.6 | 196 | approved | barrel, skirts, bands, legs 0.8 (spent for [P], 159)
vehicleBuilder.ts:mammoth trunk (TRUNK_PITCH, _PIECE, _ROOT, _TIP, trunkMat; cheek paint removed) | 8 pieces 0.2 from (0,-0.12,0.76), pitch 1.0..0.1..1.3, 0.5 -> 0.22; hide 0.6 to black | 199 | approved | 7 short pieces inside the head; 8-knot hanging tube in hide purple, unseen (198)
visualEffects.ts:hit debris litter (spawnHitDebris, LITTER_CAP, _debrisMats) | 3-4 chunks 0.26-0.04i, land flat x1.15/0.45 and stay; cap 240; reds 0.55/0.38 | 199 | approved | 0.16-0.035i, shrink away at 0.7 s
proceduralAnimation.ts:heavy swing (_animateHeavySwing, CLUB_COCK, CLUB_LAND; press/readyBlow hold, blowReadyReach) | cock -0.4, land 1.8, recover 0.65; hold arm -2.5/-1.3, heave 0.12; ready 4 m | 201 | approved | heave 0.6 per-man phase rejected 201 (ledger reversal; needs a press blow)
proceduralAnimation.ts:press blow (_pressBlow landed-dominant beat: PRESS_BLOW_BEAT_*, _REST, _HEAVE, _COCK, _SLAM, _ARM, _CLUB; flinch on landing; blowStrikeReach) | beat 1.5-2.4 s, rest 0.38, heave 0.14, cock 0.1, slam 0.08, impact rest; arm 1.7, club arc 1.2; strike reach 0.9 m | 226 | approved | was drop 0.1/hold 0.16/back 0.16, arm 3.0 (202)
cameraController.ts:result drift (RESULT_DRIFT_RATE; _resultDrift) | settled victory shot orbits 0.055 rad/s in the swoop direction; stops on viewer input or a new shot | 204 | approved |
main.ts:landing hold (LANDING_HOLD_SECONDS; cameraController LANDING_FOLLOW_SPEED, _standoffAim) | view leans to bodies above 0.4 m and holds 1.6 s; 6 m/s, standoff view too | 213 | approved |
cameraController.ts:spectator low (LOW_LAUNCH, LOW_EYE, LOW_PITCH, LOW_HOLD, LOW_EASE; offset over the follow aim) | 3+ bodies flung: eye 0.45 m, pitch +0.3 rad, hold 1.2 s, ease 4 | 221 | approved |
simulationSystem.ts:front-rank dress (SHIELD_DRESS_PULL, _STEP; _dressShieldFronts) | reverted | 204 | rejected | 0.35, 0.04 m/step after the solver: depth only, boards still split sideways; dress idea spent
simulationSystem.ts:board contact (SHIELD_BOARD_STANDOFF; _resolveLivingCollisions enemy reach) | front-rank carrier reach vs an enemy = max(radius, 0.46) | 205 | approved |
simulationSystem.ts:wall frame (SHIELD_SLOT_SNAP; ShieldSlot.at, _holdShieldFrames, RuntimeUnit.wallBraced) | carriers put back on their frame slot up to 0.15 m a step; braced men not crowd-toppled | 210 | approved | pull 0.4, step 0.05 (206)
projectileSystem.ts:cannonball wake (TRAIL_PUFF_EVERY, _BORN, _GROWN, _LIFE, _CAP) | feathered billboard puff every 0.03 s, 0.55 -> x2.6, life 1.6, cap 240 | 200 | approved |
visualEffects.ts:shock ring (_spawnShockRing) | upright camera-facing white torus at the strike, 0.4 -> 2.6 m over 0.7 s, fade last third | 198 | approved |
visualEffects.ts:spell dome (spawnSpellDome, DOME_LIFE, _RISE, _FADE, _ALPHA) | unlit one-colour hemisphere over a lightning/area strike: 1.4 s, rise 0.15, fade 0.35, alpha 0.5, pink | 215 | approved |
propBuilder.ts:held lightning bolt (lightning_bolt) | 4 flat white jagged shards in a zigzag, cyan shard 1.55x behind each | 216 | approved | 3 yellow glow boxes
visualEffects.ts:shed gear (spawnGearLitter, GEAR_TOSS_MIN/MAX, GEAR_BOARD_LEAN, GEAR_BLADE_RAISE; RuntimeUnit.shedGear) | on death shield+weapon copies land 0.6-1.1 m off, board leant 0.35 off upright, blade grip raised 0.28, set on lowest point | 217 | approved |
visualEffects.ts:fireball sprites (_spawnFireball, FIREBALL_CORE/BODY/RIM, _GROW, _LIFE, DUST_SPRITES/_LIFE, SMOKE_SPRITES/_LIFE; peaks) | additive core 3 @0.95, body 5 @0.7, rim 7 @0.55, grow 0.28, life 0.9; dust 10 @0.8, smoke 6; alphaIndex dust < smoke < fire (FIREBALL_ALPHA_INDEX) ; fire set back FIREBALL_BEHIND 1.6 along the view | 223 | approved | [P] dust 0.45/body 0.95 rejected 221
rosterManifest.ts:giantScale (unitDefinitions collision/reach, vehicleBuilder rig) | mammoth 1.25: rig, metrics, collision radius and reach scaled together | 220 | approved |
projectileSystem.ts:muzzle smoke (MUZZLE_PUFFS; _leavePuff size/life/rise/drift) | 7 feathered puffs 0.45-0.85, ~3 s, drift 0.15-0.5 down the line | 218 | approved | 8 faceted lobes
main.ts:aerial haze and vignette (HAZE_LEAD, HAZE_DEPTH; vignetteWeight) | fog from camera radius+12 m over 95 m; vignette 1.6 | 215 | approved | fog 70-170 from the eye, vignette 0.3; HAZE_DEPTH 60 rejected 219 (ledger reversal, ring milky)
proceduralAnimation.ts:rank board strip (_lapBoard, BOARD_PLANE_REACH, BOARD_LAP, BOARD_SEAT_HEIGHT; _boardSlot) | every rank: board on its slot, 0.42 ahead of the rank line, 0.62 of neck height, heading+0.22 | 210 | approved | front only, from the hand (202); 201/203/207-209 rejected
proceduralAnimation.ts:board grip (_gripBoard, BOARD_GRIP_BACK) | shield arm aimed from the shoulder at 0.12 m behind the board seat, elbow straight | 211 | approved |

## Structural attempts (last 10 iterations; `iter | gap | criterion | verdict`)
- 229 | head-fitted-hats | unit-look.h | rejected
- 229 | body-deep-ranks | battle-feel.h | approved
- 230 | wall-queue | battle-feel.h | approved
- 230 | levelled-thrust | battle-feel.e | approved
- 231 | second-rank-blow | battle-feel.e | rejected
- 231 | canopy-lift | maps-light.f | approved
- 232 | rear-club-rest | battle-feel.e | approved
- 232 | pressing-lean | battle-feel.h | approved
- 233 | [R] hat-seat rebuild | unit-look.h | approved
- 233 | rear-strike-lands | battle-feel.e | rejected
- 234 | aimed-club-cycle | battle-feel.e | rejected
- 234 | pressing-stride | battle-feel.h | approved
- 235 | cone-brim-skirt | unit-look.h | rejected
- 235 | upright-wall-stance | battle-feel.h | approved
- 236 | upright-wall-legs | battle-feel.h | approved
- 237 | wall-head-level | battle-feel.h | approved
- 237 | archer-brim | unit-look.h | dropped
- 238 | wall-board-lean | battle-feel.h | approved

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
proceduralAnimation.ts:pressed board tilt + press stride (BOARD_PRESS_TILT, PRESS_DRIVE; per-man lean = half tilt + half trunk pitch + rock 0.06) | 0.3 rad; drive 0.4 at full shove | 234 | approved | shared tilt 0.3 (232)
propBuilder.ts:buildFittedHat (HEAD_FITTED_HATS incl. helmet/plume_helmet, HELM_HEADS, HELM_CROWN, PLUME_TALL, HAT_EYE_CLEAR, BERET_*, CONE_*) | seat 0.05 head over eye top; beret 2 heads x 0.32, tilt 0.22; cone brim 2.1, foot 1.5, tall 1.05; helm dome 1.2 heads to 0.12 over crown, crest 0.45 | 237 | approved | flared skirt rejected 235
proceduralAnimation.ts:upright wall stance (WALL_TRUNK_MAX, WALL_HEAD_LEVEL, WALL_KNEE_MAX, WALL_HIP_MAX, WALL_SINK_SHARE; hip splay cleared, by wallHold) | trunk <= 0.3, head 0.9 back; knee <= 0.35, thigh +-0.35, sink 0.3 | 236 | approved |
proceduralAnimation.ts:board scatter (BOARD_SCATTER of brace boardYaw/Tilt/Roll + a height step, in _lapBoard) | 0.6 | 238 | approved |