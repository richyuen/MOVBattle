# Loop ledger: every value the loop has tuned (read by worker and critic)

Rows: `file:identifier | current value | last iter | verdict | earlier values (newest first)`.
Verdicts: approved, rejected, pending, spent. A row is `spent` after two attempts without approval
or when it was listed as never-retry; it is not pickable as [P]. The critic rejects a [P] gap that
reverses or re-nudges a row approved within the last 20 iterations ("ledger reversal"). An [S] gap
that replaces the mechanism owning a row may set new values: the worker resets the row to pending
and keeps the old value under earlier values. One row per tuning knob a mechanism exposes, not per
line. The worker updates rows at commit time (pending) and after verdicts. Drop rows untouched for
40 iterations. Rows are the memory that stops the loop walking in circles.

## Rows
main.ts:GIANT_LEAN | 0.4 | 159 | spent |
cameraController.ts:FOLLOW_DROP | 0.9 | 155 | approved |
cameraController.ts:clearRadius | depth + max(6.0, giant/0.58) | 157 | approved |
cameraController.ts:melee alpha | -PI/3 | 159 | approved |
cameraController.ts:_pickSubject (places, band, knot, cut weight) | 12 places, BAND 0.28, knot 3, cut 0.3 + 3*size | 162 | approved |
cameraController.ts:_pickSubject facing (FACE_SIDE, HEADLESS, CORPSE_CUT, GIANT_PITCH, giant weight) | side-on 0.4 of face-on, cut giant +2, corpse x0.15, giant eye 1 up pitch 0.12 | 165 | approved | no [P]; shot bodies y >= 0
simulationSystem.ts:contactBias (ally) | 0.55 | 153 | spent | never lower; never shrink enemy collision distance
simulationSystem.ts:shove spread | 0.15 + h*0.3 | 160 | approved |
simulationSystem.ts:shield wall slots (shieldSlotSpacing, RankDepth, WallGap, SlotStride, RankGap, HeadingArc) | 0.54, 1.0, 2.2, 0.6, 0.75, 1.0 | 168 | approved |
simulationSystem.ts:_buildShovePose arms | level | 160 | approved |
unitFactory.ts:CLOTH_SHADE | 0.8 | 151 | approved | also darkens armour
unitFactory.ts:BARE_FOOT_SHADE | 0.72 | 172 | approved | 0.85; no [P]
unitFactory.ts:team blue colour | (0.42, 0.60, 0.98) | 150 | spent | three values
unitFactory.ts:team red colour | greyed crimson | 142 | spent | six hues
unitFactory.ts:idle lean | 0.26 + h*0.14 | 148 | spent | do not raise, drives lineups
bodyBuilder.ts:limb taper and torso wedge (LOWER_LIMB_MIN_TAPER, CHEST_LINE, CHEST_SWELL, SHOULDER_SLOPE, WAIST_DEPTH) | lower limb starts at the upper limb's end, min taper 0.6; chest 0.36, 1.05, 0.8, 0.85 | 166 | approved | min taper 0.88
bodyBuilder.ts:head, neck, limb length, mitt (HEAD_OF_BODY, HEAD_CORNER, NECK_LENGTH, LIMB_STRETCH, MITT_OF_WRIST, MITT_LENGTH, MITT_DEPTH) | head block 0.18 of standing height, corners 0.55; neck 0.07; limbs x1.16; mitt block 1.25 forearm ends wide, 1.4 long, 0.8 deep, thumb block | 173 | approved | MITT_OF_WRIST 1.0 (172), no further [P]
bodyBuilder.ts:boot and shin end (SHIN_END, BOOT_OVER_SHIN, BOOT_RISE, BOOT_LENGTH, BOOT_TOE_HEIGHT) | shin keeps 0.78; cuff box 1.3 shin ends wide, 0.34 of the shin tall, toe box 1.7 long, 0.5 high | 171 | approved |
bodyBuilder.ts:pelvis block (PELVIS_OF_SHOULDERS, PELVIS_HEIGHT) | box 0.8 of the shoulders wide (never under the waist), 1.2 thigh tops tall; hip sockets at its lower corners | 170 | approved |
bodyBuilder.ts:HAT_CUT_FOR_HEAD | 0.7 | 169 | spent | 0.85 rejected: shrinks every hat
propBuilder.ts:great helm (HelmFit rim, crown, height) | rim min(1.3 heads, 0.8 shoulders), crown 0.86 rim, height 1.06 heads + neck | 174 | spent | crown 0.75 rejected; needs a mechanism
propBuilder.ts:slab sword (buildSlabSword) | blade 0.46 of standing height (great 0.68), 2.8 fists wide, 0.3 as thick, blunt point over the last 0.22; guard max(2 blades, 5 fists), grip 1.7 fists (3.2) | 174 | approved |
bodyBuilder.ts:SLEEVE_BULK | 1.05 | 167 | approved | 1.15; no further [P]; also scales thighs
propBuilder.ts:hair scale/y | 1.5x head, y 0.24 | 160 | approved |
propBuilder.ts:rshield disc/rim | 0.36 / 0.4 | 160 | approved |
mapBuilder.ts:BLADES | 720000 | 159 | approved |
mapBuilder.ts:blade width (`half`) | x1.0 | 160 | spent | x1.5 rejected: squat cones
projectileSystem.ts:muzzle smoke lobes | lead 0.6, seven small | 154 | spent | every value tried
projectileSystem.ts:cannonball colour | near-black | 160 | spent | no shot in flight in any still
visualEffects.ts:explosion burst (lobes, shells, flecks, colours) | 4 unlit yellow lobes in inside-out orange shells x1.5, 3 flecks, 5 skirt; fireScale cap 1.6 | 164 | approved | lobe size spent
visualEffects.ts:explosion dust bank (puffs, reach, size, tall, tans) | 14 unlit puffs, reach 2.3*sqrt, size 0.7-1.45, three emissive tans, gone at 60% | 164 | approved | no [P] on tall and tans
visualEffects.ts:explosion clods | 9, speed 1.2-3.0, up 3.5-6.5 | 161 | approved |
proceduralAnimation.ts:shield brace (arm, torso, knees, board) | shoulder x -0.7 z 0.3, elbow -1.1, torso pitch 0.1, roll x0.3, knees +0.15, board slerped square to root yaw at 1.5*shove | 165 | approved |
proceduralAnimation.ts:spear carry (_carrySpear, spear arm) | shaft turned in the fist by root yaw: upright (0.06) on the march, level at 1.5*shove; contact arm x -2.2 z 0.2 elbow -1.2, jab +0.5/+0.9; march arm z 0.25, elbow -0.5 | 169 | approved |
proceduralAnimation.ts:march gait (_buildGait) | per-unit rate 6.8-9.4, knee fold 0.6-1.1, thigh lift 0.35x, knee sink 0.05-0.27, step asymmetry +-0.18, arm lag +-0.7, swing 0.5-0.95; trunk slump +-0.08, roll 0.08-0.20, nod 0.03-0.08, chin -0.28..+0.04, head nod 0.04-0.14; lean 0.28-0.54 | 174 | approved | roll 0.04-0.14 (173), no further [P] on roll
proceduralAnimation.ts:prop carry (_buildCarry, _carryProp) | per-man attitude shouldered/upright/across/trailed at 0.30/0.25/0.25/0.20: arm hold and tip vector (jitter 0.3), eased 10/s, dipped 1.5x bob; board arm x -0.3..-0.7, z +-0.15, elbow -0.8..-1.3; bob 0.08-0.18 | 174 | approved | bob spent for [P]
proceduralAnimation.ts:idle rest (_buildIdlePose tilt, turn, arms) | hip roll 0.11-0.19, torso -1.5x, neck +0.5x, yaw 0.2-0.6; legs upright (free foot 0.08 out, standing 0.06 in: do not grow); arms plumb, elbow 0.4-0.8, pendulum 0.14-0.32 at 0.9-1.6 | 170 | approved |
proceduralAnimation.ts:landed corpse folds (_writeDeathRest) | back: thigh 0.95+0.3u, knee 2x, arm across chest, torso lift 0.3+0.6u in 2 of 5; front: shin 1.3+0.4u, wing arm x 0.7, arch -0.3; neck roll 0.7+0.4u; flank rolls over | 164 | approved |
main.ts:sun and shadow map (dir direction, intensity, CascadedShadowGenerator, SHADOW_REACH) | sun 42 deg up (-0.52, -0.669, -0.53) at 1.0; 4 cascades 2048, lambda 0.8, blend 0.05, reach 70 + pull-back, PCF high, darkness 0.04 | 176 | approved | no azimuth [P]; was (-0.412, -0.669, 0.618) approved 175
main.ts:hemi.groundColor | (0.30, 0.30, 0.42) | 176 | approved | no [P]
mapBuilder.ts:blade shade (RootShadowPlugin, BLADE_SIGHT_REACH, blade emissive) | blade vertex takes the shadow where its line of sight meets the lawn (reach 1.5 m); blades carry the grass emissive | 178 | approved | reach 4 (177); no [P]
mapBuilder.ts:lawn shade (LawnShadePlugin, LAWN_BAND_RISE, _BLUR, _WEIGHT, LAWN_SHADE_TINT, _LIFT) | sun's map read in 3 bands by caster height: split 0.4/1.6 m of ray, blur 0.025/0.10/0.24 m, weight 1/0.92/0.8; shade x(0.80,1.0,1.3)+(0,0.02,0.07) | 178 | approved |
bodyBuilder.ts:joint stubs (JOINT_STUB, JOINT_STUB_END) | segment overruns its elbow or knee by 0.45 of its width, drawn in to 0.6 | 175 | approved |
bodyBuilder.ts:sleeve head (SLEEVE_HEAD, _PLATE, _DROP, _RISE, _CROWN) | upper arm swells over its top 0.4 to a head 1.35 sleeves wide (1.1 under a pad), crown 0.35 tall drawn in to 0.6; forearm stub in the upper arm's material | 176 | approved |
bodyBuilder.ts:thigh (THIGH_OF_LEG, THIGH_HEAD, THIGH_LAP) | thigh at least 0.2 of the leg's length, head 1.15 thighs (no hip caps), pelvis at least 0.9 of the pair | 177 | approved |
bodyBuilder.ts:lower limb belly (FOREARM_SWELL, CALF_SWELL, LIMB_BELLY_DROP) | forearm 1.18, shin 1.22 of its top width, 0.3 down | 178 | approved |
bodyBuilder.ts:crewProportions (addOperator, linked crew) | infantry widths at the crew's own scale | 178 | approved | operator bulk 0.72
vehicleBuilder.ts:catapult arm/posts/bucket/wheels | see 155-158 | 158 | spent |
vehicleBuilder.ts:mammoth hide/tusks/hat/trample/launch/legs | see 15-159 | 159 | spent |

## Structural attempts (last 10 iterations; `iter | gap | criterion | verdict`)
- 169 | round-fist-hands | unit-look.c | approved
- 169 | rear-spears-fan-and-cross | battle-feel.a | approved
- 170 | legs-a-frame-from-one-point | unit-look.c | approved
- 170 | idle-mannequin-arms-out | battle-feel.c | approved
- 171 | needle-ankles-no-boots | unit-look.c | approved
- 171 | march-legs-one-phase | battle-feel.c | approved
- 172 | paddle-hands | unit-look.c | approved
- 172 | prop-arm-no-carry | battle-feel.c | approved
- 173 | march-torsos-one-pitch | battle-feel.c | approved
- 173 | bucket-helm-drum | unit-look.b | approved
- 174 | knight-sword-sliver | unit-look.b | approved
- 174 | clubs-level-parallel | battle-feel.c | approved
- 175 | units-cast-no-ground-shadow | maps-light.b | approved
- 175 | knob-joint-stick-limbs | unit-look.c | approved
- 176 | shadow-shredded-by-grass | maps-light.b | approved
- 176 | ball-shoulders-on-stick-arms | unit-look.c | approved
- 177 | shadow-sawtooth-hard-edge | maps-light.b | approved
- 177 | wire-legs | unit-look.c | approved
- 178 | shadow-hard-heavy-maroon | maps-light.b | approved
- 178 | crew-stick-body | unit-look.c | approved

## Spent gaps (never retry as [P]; an [S] on the same criterion is allowed)
slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, hoop colour, smoke diameters, fire segments/emissives, result-foreground-club, run-arms-one-splay, crew hoops.
