# Loop ledger: every value the loop has tuned

Rows: `file:identifier | current value | last iter | verdict | earlier values (newest first)`.
Verdicts: approved, rejected, pending, spent. A row is `spent` after two attempts without approval
or when it was listed as never-retry; it is not pickable as [P]. The critic rejects a [P] gap that
reverses or re-nudges a row approved within the last 20 iterations ("ledger reversal"). An [S] gap
that replaces the mechanism owning a row may set new values: the worker resets the row to pending
and keeps the old value under earlier values. One row per tuning knob a mechanism exposes, not per
line. The worker updates rows at commit time (pending) and after verdicts. Drop rows untouched for
40 iterations.

## Rows
main.ts:GIANT_LEAN | 0.4 | 159 | spent |
cameraController.ts:FOLLOW_DROP | 0.9 | 155 | approved |
cameraController.ts:clearRadius | depth + max(6.0, giant/0.58) | 157 | approved |
cameraController.ts:melee alpha | -PI/3 | 159 | approved |
cameraController.ts:_pickSubject (places, band, knot, cut weight) | 12 places, BAND 0.28, knot 3, cut 0.3 + 3*size | 162 | approved |
cameraController.ts:_pickSubject facing (FACE_SIDE, HEADLESS, CORPSE_CUT, GIANT_PITCH) | side-on 0.4 of face-on, giant +2, corpse x0.15, giant pitch 0.12 | 165 | approved | no [P]
simulationSystem.ts:contactBias (ally) | 0.55 | 153 | spent | never lower
simulationSystem.ts:shove spread | 0.15 + h*0.3 | 160 | approved |
simulationSystem.ts:shield wall slots (Spacing, RankDepth, WallGap, SlotStride, RankGap, HeadingArc) | 0.54, 1.0, 2.2, 0.6, 0.75, 1.0 | 168 | approved |
simulationSystem.ts:_buildShovePose arms | level | 160 | approved |
unitFactory.ts:CLOTH_SHADE | 0.8 | 151 | approved |
unitFactory.ts:BARE_FOOT_SHADE | 0.72 | 172 | approved | 0.85; no [P]
unitFactory.ts:team blue colour | (0.42, 0.60, 0.98) | 150 | spent |
unitFactory.ts:idle lean | 0.26 + h*0.14 | 148 | spent | do not raise, drives lineups
bodyBuilder.ts:limb taper and torso wedge (LOWER_LIMB_MIN_TAPER, CHEST_LINE, CHEST_SWELL, SHOULDER_SLOPE, WAIST_DEPTH) | throughHinge line, min taper 0.6; chest 0.36, 1.05, 0.8, 0.85 | 180 | approved |
bodyBuilder.ts:head, neck, limb length, mitt (HEAD_OF_BODY, HEAD_SQUAT, HEAD_RINGS, HEAD_CORNER, NECK_LENGTH, LIMB_STRETCH, MITT_OF_WRIST, MITT_LENGTH, MITT_DEPTH) | head 0.18 of height x0.86, rings chin 0.5/cheek 0.8/brow 1/temple 0.95/crown 0.66, corners 0.55; neck 0.07; limbs x1.16; mitt 1.25/1.4/0.8, thumb | 183 | approved | no [P] on MITT_OF_WRIST
bodyBuilder.ts:boot and shin end (SHIN_END, BOOT_OVER_SHIN, BOOT_RISE, BOOT_LENGTH, BOOT_TOE_HEIGHT) | shin keeps 0.78; cuff 1.3 shin ends wide, 0.34 shin tall, toe 1.7 long, 0.5 high | 171 | approved |
bodyBuilder.ts:pelvis block (PELVIS_OF_SHOULDERS, PELVIS_HEIGHT) | box 0.8 shoulders wide, 1.2 thigh tops tall | 170 | approved |
bodyBuilder.ts:HAT_CUT_FOR_HEAD | 0.7 | 169 | spent | 0.85 rejected: shrinks every hat
propBuilder.ts:great helm (HelmFit rim, crown, height) | rim min(1.3 heads, 0.8 shoulders), crown 0.86 rim, height 1.06 heads + neck | 174 | spent | crown 0.75 rejected; needs a mechanism
propBuilder.ts:slab sword (buildSlabSword) | blade 0.46 of standing height (great 0.68), 2.8 fists wide, 0.3 as thick, blunt over the last 0.22 | 174 | approved |
bodyBuilder.ts:SLEEVE_BULK | 1.05 | 167 | approved | 1.15; no further [P]; also scales thighs
propBuilder.ts:hair scale/y | 1.5x head, y 0.24 | 160 | approved |
propBuilder.ts:rshield disc/rim | 0.36 / 0.4 | 160 | approved |
mapBuilder.ts:BLADES | 720000 | 159 | approved |
mapBuilder.ts:blade width (`half`) | x1.0 | 160 | spent | x1.5 rejected: squat cones
projectileSystem.ts:muzzle smoke lobes | lead 0.6, seven small | 154 | spent | every value tried
projectileSystem.ts:cannonball colour | near-black | 160 | spent | no shot in flight in any still
visualEffects.ts:explosion burst | 4 unlit yellow lobes in inside-out orange shells x1.5; fireScale cap 1.6 | 164 | approved | lobe size spent
visualEffects.ts:explosion dust bank | 14 unlit puffs, reach 2.3*sqrt, size 0.7-1.45 | 164 | approved | no [P] on tall and tans
visualEffects.ts:explosion clods | 9, speed 1.2-3.0, up 3.5-6.5 | 161 | approved |
proceduralAnimation.ts:shield brace (_buildBracePose) | crouched/tall/shoulder-in 0.35/0.35/0.30 (crouch 0.05-1.05), shift 1.2-2.6/s, head turn +-0.35; board yaw +-0.22, tilt +-0.16 | 179 | approved | one pose (165)
proceduralAnimation.ts:spear carry (_carrySpear, spear arm) | upright on the march, level at 1.5*shove, dip 0.02+-0.45 (no yaw) | 180 | approved | dip +-0.18 (179); no further [P]
proceduralAnimation.ts:march gait (_buildGait) | rate 6.8-9.4, knee fold 0.6-1.1, thigh lift 0.35x, sink 0.05-0.27, asym +-0.18, arm lag +-0.7, swing 0.5-0.95 | 174 | approved | no further [P] on roll
proceduralAnimation.ts:prop carry (_buildCarry, _carryProp) | shouldered/upright/across/trailed 0.30/0.25/0.25/0.20 (jitter 0.3); bob 0.08-0.18 | 174 | approved | bob spent for [P]
proceduralAnimation.ts:idle rest (_buildIdlePose) | hip-shot/sunk/at-ease 0.35/0.35/0.30: roll 0.17-0.27/0.05-0.11/0.10-0.17, crouch 0.02-0.10/0.25-0.45/0.16-0.32; free foot 0.08 (do not grow) | 182 | approved |
proceduralAnimation.ts:bow ready (_buildCarry ready) | port/upright/low 0.38/0.34/0.28, yaw 0.60-0.95, stagger 0.40-0.60, give 0.10-0.26 | 183 | approved | yaw 0.35-0.70, stagger 0.24-0.40 (182); no [P]
proceduralAnimation.ts:caster hold (_buildCarry cast, _animateCast) | staff beside/leant/cradled 0.45/0.30/0.25, bolt cocked/overhead/low 0.40/0.30/0.30; yaw 0.10-0.35, tilt +0.08 | 183 | approved |
proceduralAnimation.ts:landed corpse folds (_writeDeathRest) | back: thigh 0.95+0.3u, knee 2x, arm across chest; front: shin 1.3+0.4u, wing arm, arch -0.3; neck roll 0.7+0.4u | 164 | approved |
main.ts:sun and shadow map (dir, CascadedShadowGenerator, SHADOW_REACH) | sun 42 deg up at 1.0; 4 cascades 2048, lambda 0.8, reach 70 + pull-back, darkness 0.04 | 176 | approved | no azimuth [P]
main.ts:hemi.groundColor | (0.30, 0.30, 0.42) | 176 | approved | no [P]
mapBuilder.ts:blade shade (RootShadowPlugin, BLADE_SIGHT_REACH) | blade takes the shadow where its sight line meets the lawn (reach 1.5 m) | 178 | approved | reach 4 (177); no [P]
mapBuilder.ts:lawn shade (LawnShadePlugin, LAWN_BAND_RISE, _BLUR, _WEIGHT, LAWN_SHADE_TINT, _LIFT) | 3 bands by caster height: split 0.4/1.6 m, blur 0.025/0.10/0.24 m, weight 1/0.92/0.8; shade x(0.80,1.0,1.3)+(0,0.02,0.07) | 179 | spent | fainter weights rejected; needs a mechanism
projectileSystem.ts:stuck shafts (_leaveAsLitter, arrow mesh) | ray to the struck hide, head 0.07 in, on that part's joint; mark down: planted at pitch 1.0-1.35; arrow 0.75 x 0.035 | 180 | approved |
bodyBuilder.ts:joint stubs (JOINT_STUB, JOINT_STUB_END) | segment overruns its joint by 0.45 of its width, drawn in to 0.6 | 175 | approved |
bodyBuilder.ts:sleeve head (SLEEVE_HEAD, _PLATE, _DROP, _RISE, _CROWN) | head 1.08 sleeves over the top 0.4, crown 0.35 tall drawn in to 0.6 | 181 | approved |
bodyBuilder.ts:shoulder ridge and hull (YOKE_REACH, _DROP, _DEPTH, _NECK, HULL_FOOT, HULL_WAIST, HULL_TAPER) | gable from a line 0.6 sleeves under the joints (reach 0.2, depth 0.92) up to a 0.5 neck; hull foot 1.0 waist, at least 0.84 of that line | 184 | pending | slab rise 0.1, hull to waist (183); no [P]
bodyBuilder.ts:thigh (THIGH_OF_LEG, THIGH_HEAD, THIGH_LAP) | thigh at least 0.2 of the leg, head 1.15 thighs, pelvis at least 0.9 of the pair | 177 | approved |
bodyBuilder.ts:lower limb belly (FOREARM_SWELL, CALF_SWELL, LIMB_BELLY_DROP) | forearm 1.35, shin 1.4 of its top width, 0.3 down | 179 | approved | 1.18, 1.22 (178); no further [P]
unitFactory.ts:garment solids (hangSkirt, furCollar; vehicleBuilder crewBreeches) | hex skirt on the hips: tabard 0.7 thighs flare 1.6, kilt 0.6/1.55, tunic 0.45/1.5, hide 0.5/1.45; collar torus 0.64 chest; breeches 1.75 -> 1.3 thighs | 179 | approved | breeches top 1.45 open as [P]
bodyBuilder.ts:crewProportions (addOperator, linked crew) | infantry widths at the crew's own scale | 178 | approved |
vehicleBuilder.ts:catapult | see 155-158 | 158 | spent |
vehicleBuilder.ts:mammoth | see 15-159 | 159 | spent |

## Structural attempts (last 10 iterations; `iter | gap | criterion | verdict`)
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
- 179 | shield-rank-one-pose | battle-feel.c | approved
- 179 | clothes-are-paint | unit-look.d | approved
- 180 | nothing-sticks | vfx.a | approved
- 180 | pinched-link-limbs | unit-look.c | approved
- 181 | lineup-stands-to-attention | battle-feel.c | approved
- 181 | arm-is-a-detached-pillar | unit-look.c | approved
- 182 | aimed-men-stand-to-attention | battle-feel.c | approved
- 182 | shoulder-shelf-armpit-gap | unit-look.c | approved
- 183 | casters-stand-to-attention | battle-feel.c | approved
- 183 | head-is-a-tall-square-box | unit-look.c | approved
- 184 | torso-top-is-a-plate-with-eaves | unit-look.c | pending

## Spent gaps (never retry as [P]; an [S] on the same criterion is allowed)
slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, hoop colour, smoke diameters, fire segments/emissives, result-foreground-club, run-arms-one-splay, crew hoops.
