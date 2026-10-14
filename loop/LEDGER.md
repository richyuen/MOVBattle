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
main.ts:placement ghost (GHOST_ALPHA, GHOST_BLOCKED_ALPHA) | 0.85, blocked 0.22 | 188 | approved | 0.55 (187); no further [P]
main.ts:ghost footprint (GHOST_TILE_OF_BODY, _MIN, _HEIGHT, _BLOCKED_ALPHA) | hex slab 1.7 bodies across, at least 1.2 m, 0.22 tall; blocked 0.3 | 188 | approved |
cameraController.ts:_pickSubject (places, band, knot, cut weight) | 12 places, BAND 0.28, knot 3, cut 0.3 + 3*size | 162 | approved |
cameraController.ts:_pickSubject facing (FACE_SIDE, HEADLESS, CORPSE_CUT, GIANT_PITCH) | side-on 0.4 of face-on, giant +2, corpse x0.15, giant pitch 0.12 | 165 | approved | no [P]
simulationSystem.ts:shield wall slots (Spacing, RankDepth, WallGap, SlotStride, RankGap, HeadingArc) | 0.54, 1.0, 2.2, 0.6, 0.75, 1.0 | 168 | approved |
unitFactory.ts:BARE_FOOT_SHADE | 0.72 | 172 | approved | 0.85; no [P]
bodyBuilder.ts:limb taper and torso wedge (LOWER_LIMB_MIN_TAPER, CHEST_LINE, CHEST_SWELL, WAIST_DEPTH) | throughHinge line, min taper 0.6; chest 0.36, 1.05, top drawn in to the collar, waist depth 0.85 | 187 | approved | SHOULDER_SLOPE 0.8 (180)
bodyBuilder.ts:head, neck, limb length, mitt (HEAD_OF_BODY, HEAD_SQUAT, HEAD_RINGS, HEAD_CORNER, NECK_LENGTH, LIMB_STRETCH, MITT_OF_WRIST, MITT_LENGTH, MITT_DEPTH) | head 0.18 of height x0.86, rings chin 0.72/cheek 0.9/brow 1/temple 0.95/crown 0.66, corners 0.55; neck 0.07; limbs x1.16; mitt 1.25/1.4/0.8, thumb | 184 | approved | chin 0.5, cheek 0.8 (183); no [P] on MITT_OF_WRIST
bodyBuilder.ts:neck (NECK_LENGTH, NECK_BASE, NECK_TOP, NECK_SUNK, NECK_INTO_HEAD, COLLAR_SEAT) | one skin solid 0.05 tall, 0.72 head at the foot, 0.6 at the chin; trapezius ends 0.2 up it | 193 | approved | post 0.5-0.62 head, 0.07 tall, collar 1.2 necks 0.85 up (189)
bodyBuilder.ts:eyes (EYE_OF_FACE, EYE_SPREAD, EYE_FLAT, PUPIL_OF_EYE; metrics.pupilTravel) | white disc 0.24 face, 0.16 off centre, depth 0.3; pupil 0.5 disc, travel 0.3 | 185 | approved | black bead 0.17 (184)
bodyBuilder.ts:boot and shin end (SHIN_END, BOOT_OVER_SHIN, BOOT_RISE, BOOT_LENGTH, BOOT_TOE_HEIGHT) | shin keeps 0.78; cuff 1.3 shin ends wide, 0.34 shin tall, toe 1.7 long, 0.5 high | 171 | approved |
bodyBuilder.ts:pelvis block (PELVIS_OF_SHOULDERS, PELVIS_HEIGHT) | box 0.8 shoulders wide, 1.2 thigh tops tall, straight sided | 186 | approved | top drawn in to the waist (170)
bodyBuilder.ts:HAT_CUT_FOR_HEAD | 0.7 | 169 | spent | 0.85 rejected: shrinks every hat
propBuilder.ts:great helm (HelmFit rim, crown, height) | rim min(1.3 heads, 0.8 shoulders), crown 0.86 rim, height 1.06 heads + neck | 174 | spent | needs a mechanism
propBuilder.ts:slab sword (buildSlabSword) | blade 0.46 of standing height (great 0.68), 2.8 fists wide, 0.3 as thick, blunt over the last 0.22 | 174 | approved |
bodyBuilder.ts:SLEEVE_BULK | 1.05 | 167 | approved | 1.15; no further [P]; also scales thighs
propBuilder.ts:laurel wreath y/tilt | y 0.028, tilt 0.1 | 186 | approved | y 0.005, tilt 0.25
propBuilder.ts:laurel hair cap cut | front below 0.02 s pulled back to the cap's middle | 197 | approved |
projectileSystem.ts:cannon shot (cannonball shape, _ironMat, _addStreak width) | ball 0.46 faceted iron 0.045, streak 2.2 x 0.14; bomb iron, streak 1.2 x 0.07 | 185 | approved | near-black (160, spent)
visualEffects.ts:explosion burst | 4 unlit yellow lobes in inside-out orange shells x1.5; fireScale cap 1.6 | 164 | approved | lobe size spent
visualEffects.ts:explosion dust bank | 14 unlit puffs, reach 2.3*sqrt, size 0.7-1.45 | 164 | approved | no [P] on tall and tans
visualEffects.ts:explosion clods | 9, speed 1.2-3.0, up 3.5-6.5 | 161 | approved |
proceduralAnimation.ts:shield brace (_buildBracePose; BRACE_PITCH_*, BRACE_CROUCH_DEEP, BRACE_STEP_*) | trunk pitch 0.14-0.56 own, set not added; head level 0.1-0.8; crouch to 0.7; step 0.22-0.5; twist 0.1-0.5; board follows | 192 | approved | 3 stands pitch -0.08..0.34, crouch to 1.05 (179); lunge 0.35-0.75 (188)
proceduralAnimation.ts:spear carry (_carrySpear; SPEAR_WALL_UP, SPEAR_FRONT_GRIP_*, SPEAR_COUCH_*) | one wall line: slot heading at 1.48 above level, no strike drop; grip 0.2-0.28 | 197 | approved | per man 1.05-1.4, rear strike 0.3 (196); front dipped 0.42-0.64 (192-193)
proceduralAnimation.ts:spear thrust (_thrustStroke, SPEAR_LUNGE, SPEAR_DRAW; brace thrustRate) | lunge 0.45 m, draw -0.4 of it; beat 0.9-1.4/s | 192 | approved | choke 0.45 removed (186)
proceduralAnimation.ts:march gait (_buildGait) | rate 6.8-9.4, knee fold 0.6-1.1, thigh lift 0.35x, sink 0.05-0.27, asym +-0.18, arm lag +-0.7, swing 0.5-0.95 | 174 | approved | no further [P] on roll
proceduralAnimation.ts:prop carry (_buildCarry, _carryProp) | shouldered/upright/across/trailed 0.30/0.25/0.25/0.20 (jitter 0.3); bob 0.08-0.18 | 174 | approved | bob spent for [P]
proceduralAnimation.ts:idle rest (_buildIdlePose) | hip-shot/sunk/at-ease 0.35/0.35/0.30: roll 0.17-0.27/0.05-0.11/0.10-0.17, crouch 0.02-0.10/0.25-0.45/0.16-0.32; free foot 0.08 (do not grow) | 182 | approved |
proceduralAnimation.ts:bow ready (_buildCarry ready) | port/upright/low 0.38/0.34/0.28, yaw 0.60-0.95, stagger 0.40-0.60, give 0.10-0.26 | 183 | approved | no [P]
proceduralAnimation.ts:bow shot (_animateBowDrawRelease, BOW_TURN_*, _carryProp shooting) | turned 0.95-1.3 own; lean 0.06-0.22; stave upright in the fist while the arm is up | 192 | approved | turn 1.15, stave hung (191)
proceduralAnimation.ts:caster hold (_buildCarry cast, _animateCast, CASTER_CROUCH) | staff beside/leant/cradled, bolt cocked/overhead/low; cast from a stride; rest crouch x0.3; overhead off arm thrown out | 191 | approved | squat give 0.1/0.22, off arm hung (184 [P] rejected)
proceduralAnimation.ts:landed corpse folds (_writeDeathRest) | back: thigh 0.95+0.3u, knee 2x, arm across chest; front: shin 1.3+0.4u, wing arm, arch -0.3; neck roll 0.7+0.4u | 164 | approved |
main.ts:sun and shadow map (dir, CascadedShadowGenerator, SHADOW_REACH) | sun 42 deg up at 1.0; 4 cascades 2048, lambda 0.8, reach 70 + pull-back, darkness 0.04 | 176 | approved | no azimuth [P]
main.ts:hemi.groundColor | (0.30, 0.30, 0.42) | 176 | approved | no [P]
mapBuilder.ts:blade shade (RootShadowPlugin, BLADE_SIGHT_REACH) | blade takes the shadow where its sight line meets the lawn (reach 1.5 m) | 178 | approved | no [P]
mapBuilder.ts:lawn shade (LawnShadePlugin, LAWN_BAND_RISE, _BLUR, _WEIGHT, LAWN_SHADE_TINT, _LIFT) | 3 bands by caster height: split 0.4/1.6 m, blur 0.025/0.10/0.24 m, weight 1/0.92/0.8; shade x(0.80,1.0,1.3)+(0,0.02,0.07) | 179 | spent | fainter weights rejected; needs a mechanism
projectileSystem.ts:stuck shafts (_leaveAsLitter, arrow mesh) | ray to the struck hide, head 0.07 in, on that part's joint; mark down: planted at pitch 1.0-1.35; arrow 0.75 x 0.035 | 180 | approved |
bodyBuilder.ts:joint stubs (JOINT_STUB, JOINT_STUB_END) | segment overruns its joint by 0.45 of its width, drawn in to 0.6 | 175 | approved |
bodyBuilder.ts:sleeve head (SLEEVE_HEAD, _PLATE, _DROP, _RISE, _CROWN) | head 1.08 sleeves over the top 0.4, crown 0.35 tall drawn in to 0.6 | 181 | approved |
bodyBuilder.ts:shoulder line, hull and trapezius (SHOULDER_INSET, TRAPEZIUS_OVER_CROWN, YOKE_DEPTH, COLLAR_OF_NECK, COLLAR_RISE, PELVIS_ABOVE_HIP) | edge 0.15 sleeves inside the joints, 0.6 crowns over; trapezius to 1.2 necks, 0.85 up | 189 | approved | edge at the joints + 0.2, collar 1.35 necks 0.6 up (187); no [P]
bodyBuilder.ts:thigh (THIGH_OF_LEG, THIGH_HEAD, THIGH_LAP) | thigh at least 0.2 of the leg, head 1.15 thighs, pelvis at least 0.9 of the pair | 177 | approved |
bodyBuilder.ts:lower limb belly (CALF_SWELL, LIMB_BELLY_DROP; armTaper) | shin 1.4 of its top width, 0.3 down; arm one straight taper sleeve top to wrist, no belly | 191 | approved | forearm belly 1.35 (179); no [P]
unitFactory.ts:garment solids (hangSkirt, furCollar; vehicleBuilder crewBreeches) | hex skirt on the hips: tabard 0.7 thighs flare 1.6, kilt 0.6/1.55, tunic 0.45/1.5, hide 0.5/1.45; collar torus 0.64 chest; breeches 1.75 -> 1.3 thighs | 179 | approved | breeches top 1.45 open as [P]
bodyBuilder.ts:crewProportions (addOperator, linked crew) | infantry widths at the crew's own scale | 178 | approved |
vehicleBuilder.ts:mammoth hull (BODY_RADII, BODY_LIFT, fur hem, paint daubs, leg width) | ellipsoid 0.85/0.68/1.16 lifted 0.12; 5 hem lobes a side; 4 daubs a side; legs 0.6 | 196 | approved | barrel, skirts, bands, legs 0.8 (spent for [P], 159)
vehicleBuilder.ts:mammoth trunk (TRUNK_PITCH, _PIECE, _ROOT, _TIP, trunkMat; cheek paint removed) | 8 pieces 0.2 from (0,-0.12,0.76), pitch 1.0..0.1..1.3, 0.5 -> 0.22; hide 0.6 to black | 199 | approved | 7 short pieces inside the head; 8-knot hanging tube in hide purple, unseen (198)
visualEffects.ts:hit debris litter (spawnHitDebris, LITTER_CAP, _debrisMats) | 3-4 chunks 0.26-0.04i, land flat x1.15/0.45 and stay; cap 240; reds 0.55/0.38 | 199 | approved | 0.16-0.035i, shrink away at 0.7 s
proceduralAnimation.ts:heavy swing (_animateHeavySwing, CLUB_COCK, CLUB_LAND; press/readyBlow hold, blowReadyReach) | cock -0.4, land 1.8, recover 0.65; hold arm -2.5/-1.3, heave 0.12; ready 4 m | 201 | approved | heave 0.6 per-man phase rejected 201 (ledger reversal; needs a press blow)
proceduralAnimation.ts:press blow (_pressBlow, PRESS_BLOW_BEAT_*, _DROP, _HOLD, _BACK; blowStrikeReach) | beat 1.5-2.4 s, drop 0.1, hold 0.16, back 0.16; arm +3.0, trunk +0.45; strike reach 0.9 m | 202 | approved |
cameraController.ts:result drift (RESULT_DRIFT_RATE; _resultDrift) | settled victory shot orbits 0.055 rad/s in the swoop direction; stops on viewer input or a new shot | 204 | approved |
simulationSystem.ts:front-rank dress (SHIELD_DRESS_PULL, _STEP; _dressShieldFronts) | reverted | 204 | rejected | 0.35, 0.04 m/step after the solver: depth only, boards still split sideways; dress idea spent
simulationSystem.ts:board contact (SHIELD_BOARD_STANDOFF; _resolveLivingCollisions enemy reach) | front-rank carrier reach vs an enemy = max(radius, 0.46) | 205 | approved |
projectileSystem.ts:cannonball wake (TRAIL_PUFF_EVERY, _BORN, _GROWN, _LIFE, _CAP) | feathered billboard puff every 0.03 s, 0.55 -> x2.6, life 1.6, cap 240 | 200 | approved |
visualEffects.ts:shock ring (_spawnShockRing) | upright camera-facing white torus at the strike, 0.4 -> 2.6 m over 0.7 s, fade last third | 198 | approved |
proceduralAnimation.ts:front board lap (_lapBoard, BOARD_PLANE_REACH, BOARD_LAP, BOARD_PLANE_MAX_OUT; slot plane) | from slotting: plane 0.42 ahead, lap 0.22, out at most 0.7 | 202 | approved | in contact only (201 rejected); back clamp -0.7 + front-rank dress rejected 203 (keep back clamp -0.2)

## Structural attempts (last 10 iterations; `iter | gap | criterion | verdict`)
- 196 | wall-shafts-share-one-heading | battle-feel.c | rejected
- 196 | mammoth-fur-mass | unit-look.f | approved
- 197 | wall-shafts-one-plane | battle-feel.c | approved
- 197 | zeus-no-mouth | unit-look.h | approved
- 198 | mammoth-trunk | unit-look.f | rejected
- 198 | impact-ring | vfx.e | approved
- 199 | mammoth-trunk retry | unit-look.f | approved
- 199 | blood-chunks | vfx.g | approved
- 200 | overhead-club-strike | battle-feel.e | approved
- 200 | cannonball-smoke-trail | vfx.h | approved
- 201 | lapped-shield-boards | battle-feel.h | rejected
- 202 | press-blow | battle-feel.e | approved
- 202 | lapped-boards retry | battle-feel.h | approved
- 203 | lapped-boards-in-contact | battle-feel.h | rejected
- 204 | dressed-front-under-shove | battle-feel.h | rejected
- 204 | result-drift | camera.g | approved
- 205 | board-contact-plane | battle-feel.h | approved

## Spent gaps (never retry as [P]; an [S] on the same criterion is allowed)
slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, hoop colour, smoke diameters, fire segments/emissives, result-foreground-club, run-arms-one-splay, crew hoops.
