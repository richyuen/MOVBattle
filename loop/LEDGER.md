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
main.ts:GIANT_LEAN | 0.4 | 159 | spent | 0.25 rejected
cameraController.ts:FOLLOW_DROP | 0.9 | 155 | approved |
cameraController.ts:clearRadius | depth + max(6.0, giant/0.58) | 157 | approved |
cameraController.ts:melee alpha | -PI/3 | 159 | approved |
cameraController.ts:_pickSubject (places, band, knot, cut weight) | 12 places, BAND 0.28, knot 3, cut 0.3 + 3*size, fitted shot kept within 0.2 | 162 | approved |
cameraController.ts:_pickSubject facing (FACE_SIDE, HEADLESS, CORPSE_CUT, GIANT_PITCH, giant weight) | side-on 0.4 of face-on, cut giant +2, cut corpse x0.15, giant shot eye 1 up pitch 0.12, giant counts min(1.5, 2*size) | 165 | approved | no [P] on this row; shot bodies clamped to y >= 0
simulationSystem.ts:contactBias (ally) | 0.55 | 153 | spent | never lower; never shrink enemy collision distance
simulationSystem.ts:shove spread | 0.15 + h*0.3 | 160 | approved |
simulationSystem.ts:shield wall slots (spacing, rank depth, wall gap, stride, rank gap, heading arc) | shieldSlotSpacing 0.54, shieldRankDepth 1.0, shieldWallGap 2.2, shieldSlotStride 0.6, shieldRankGap 0.75 (rear man halts at it over shieldRankFollowBand 0.25), shieldHeadingArc 1.0 | 168 | approved |
simulationSystem.ts:_buildShovePose arms | level | 160 | approved |
unitFactory.ts:CLOTH_SHADE | 0.8 | 151 | approved | also darkens armour
unitFactory.ts:BARE_FOOT_SHADE | 0.72 | 172 | approved | 0.85; no further [P]
unitFactory.ts:team blue colour | (0.42, 0.60, 0.98) | 150 | spent | three values over 120-123
unitFactory.ts:team red colour | greyed crimson | 142 | spent | six hues over 123-140
unitFactory.ts:idle lean | 0.26 + h*0.14 | 148 | spent | do not raise, drives lineups
bodyBuilder.ts:limb taper and torso wedge (LOWER_LIMB_MIN_TAPER, CHEST_LINE, CHEST_SWELL, SHOULDER_SLOPE, WAIST_DEPTH) | lower limb starts at the upper limb's end, min taper 0.6 (forearms; shins: boot row); chest line 0.36, swell 1.05, shoulders 0.8, waist depth 0.85 | 166 | approved | min taper 0.88; plain hex torso
bodyBuilder.ts:head, neck, limb length, mitt (HEAD_OF_BODY, HEAD_CORNER, NECK_LENGTH, LIMB_STRETCH, MITT_OF_WRIST, MITT_LENGTH, MITT_DEPTH) | head a bevelled block (crown 0.9, brow at 0.6 up, jaw 0.78) 0.18 of standing height, corners 0.55; neck column 0.07; arm and leg segments x1.16; mitt a block fist 1.25 forearm ends wide, 1.4 widths long, 0.8 deep (wrist ring x0.85, tip x0.7) with a thumb block on the front | 173 | approved | MITT_OF_WRIST 1.0 (172), no further [P]
bodyBuilder.ts:boot and shin end (SHIN_END, BOOT_OVER_SHIN, BOOT_RISE, BOOT_LENGTH, BOOT_TOE_HEIGHT) | shin keeps 0.78 of its top width; foot() merges a cuff box 1.3 shin ends wide, 0.34 of the shin tall (top x0.9), and a toe box 1.7 cuffs long, 0.5 its height (toe x0.8 wide, top x0.4) | 171 | approved |
bodyBuilder.ts:pelvis block (PELVIS_OF_SHOULDERS, PELVIS_HEIGHT) | box 0.8 of the shoulders wide (never under the waist), 1.2 thigh tops tall, set 0.2 of its height down the hip; hip sockets at its lower corners; no hip splay | 170 | approved | hipOffX 0.28 torsoBottom, splay 0.08-0.12
bodyBuilder.ts:HAT_CUT_FOR_HEAD | 0.7 | 169 | spent | 0.85 rejected 169: scales headTop, so every hat, hair and wreath shrank off the head
propBuilder.ts:great helm (HelmFit rim, crown, height) | rim min(1.3 heads, 0.8 shoulders), crown 0.86 rim, height 1.06 heads + neck, slit at the eyes | 174 | spent | crown 0.75 rejected 174: the head breaks the helm wall; the lid needs a mechanism; stock cut 0.78/0.92
propBuilder.ts:slab sword (buildSlabSword) | blade 0.46 of standing height (greatsword 0.68), 2.8 fists wide kept within length/5..length/4 (great /6.5../5), 0.3 as thick, blunt point over the last 0.22; guard max(2 blades, 5 fists), grip 1.7 fists (3.2), pommel 1 fist | 174 | approved | box 0.055 x 0.5 x 0.02 of weapon scale
bodyBuilder.ts:SLEEVE_BULK | 1.05 | 167 | approved | 1.15; no further [P] (critic 167); also scales thighs
propBuilder.ts:hair scale/y | 1.5x head, y 0.24 | 160 | approved |
propBuilder.ts:bare shoulder cap | 1.3 | 160 | approved |
propBuilder.ts:rshield disc/rim | 0.36 / 0.4 | 160 | approved | 0.3/0.33 154
mapBuilder.ts:BLADES | 720000 | 159 | approved | 480000 before
mapBuilder.ts:blade width (`half`) | x1.0 | 160 | spent | x1.5 rejected: squat cones
projectileSystem.ts:muzzle smoke lobes | lead 0.6, seven small | 154 | spent | every value tried
projectileSystem.ts:cannonball colour | near-black | 160 | spent | no shot in flight in any still
visualEffects.ts:explosion burst (lobes, shells, flecks, colours) | 4 unlit yellow lobes (1.3,0.6,0) (size .95/.7/.52/.4, reach .34-.64, wide 1.3, deep 0.68) in inside-out orange shells (1.0,0.22,0) x1.5 reach +0.06, 3 flecks reach .95-1.25, 5 skirt (0.85,0.13,0); fireScale cap 1.6 | 164 | approved | lobe size spent (0.75 rejected 163); emissives untouched
visualEffects.ts:explosion dust bank (puffs, reach, size, tall, tans) | 14 unlit puffs, reach 2.3*sqrt, size 0.7-1.45, tall 0.9-0.3*spread, emissive tans (0.8,0.6,0.35)/(0.68,0.5,0.28)/(0.56,0.4,0.22), gone at 60% | 164 | approved | no [P] on tall and tans; lit tans render grey (spent)
visualEffects.ts:explosion clods | 9, speed 1.2-3.0, up 3.5-6.5 | 161 | approved |
proceduralAnimation.ts:shield brace (arm, torso, knees, board) | shoulder x -0.7 z 0.3, elbow -1.1, torso pitch 0.1, roll x0.3, knees +0.15, board slerped square to root yaw at 1.5*shove | 165 | approved |
proceduralAnimation.ts:spear carry (_carrySpear, spear arm) | shaft turned in the fist by root yaw: upright (pitch 0.06) on the march, level (+PI/2+0.04) at 1.5*shove; contact arm shoulder x -2.2 z 0.2 elbow -1.2, jab +0.5/+0.9; march arm x ~0, z 0.25, elbow -0.5 | 169 | approved |
proceduralAnimation.ts:march gait (_buildGait) | per-unit rate 6.8-9.4, free-leg knee fold 0.6-1.1 at mid-swing with thigh lift 0.35x, standing knee sink 0.05-0.27, step asymmetry +-0.18, arm lag +-0.7 rad, arm swing 0.5-0.95; trunk on the step: slump +-0.08, roll 0.08-0.20, footfall nod 0.03-0.08, chin -0.28..+0.04, head nod 0.04-0.14 a beat late; base lean 0.28-0.54 kept | 174 | approved | roll 0.04-0.14 (173), no further [P] on roll; fold 0.6-1.5 (171)
proceduralAnimation.ts:prop carry (_buildCarry, _carryProp) | per-man attitude shouldered/upright/across/trailed at 0.30/0.25/0.25/0.20: its own arm hold and a tip vector (jitter 0.3) the club, blade or hafted head is turned to in the fist, eased at 10/s, dipped 1.5x bob; heavy_carry included; board arm x -0.3..-0.7, z +-0.15, elbow -0.8..-1.3; bob 0.08-0.18 on |sin(step)| | 174 | approved | bob spent for [P]; one hold x -0.35..-0.85, prop fixed in the hand (172)
proceduralAnimation.ts:idle rest (_buildIdlePose tilt, turn, arms) | hip root roll 0.11-0.19, torso -1.5x, neck +0.5x and yaw 0.2-0.6; legs upright (free foot 0.08 out, standing 0.06 in: do not grow); arms plumb (shoulder x -0.7 lean, z -roll, 0.08-0.18 out), elbow 0.4-0.8, each its own pendulum 0.14-0.32 at rate 0.9-1.6 | 170 | approved | elbow 0.15-0.45 hung the hands at the shins
proceduralAnimation.ts:landed corpse folds (_writeDeathRest) | back: thigh 0.95+0.3u, knee 2x, arm across chest (z 0.5, y 1.57, elbow -1.7), torso lift 0.3+0.6u in 2 of 5; front: shin 1.3+0.4u, wing arm x 0.7, arch -0.3; neck roll 0.7+0.4u; flank rolls over | 164 | approved |
vehicleBuilder.ts:catapult arm/posts/bucket/wheels | see 155-158 | 158 | spent |
vehicleBuilder.ts:mammoth hide/tusks/hat/trample/launch/legs | see 15-159 | 159 | spent |

## Structural attempts (last 10 iterations; `iter | gap | criterion | verdict`)
- 165 | result-giant-headless | camera.d | approved
- 165 | shield-wall-brace | battle-feel.a | approved
- 166 | shield-rank-slotting | battle-feel.a | approved
- 166 | tapered-limbs | unit-look.c | approved
- 167 | wall-second-rank-parallel | battle-feel.a | approved
- 167 | squat-proportions | unit-look.c | approved
- 168 | rear-rank-march-depth | battle-feel.a | approved
- 168 | pin-ball-head | unit-look.c | approved
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

## Spent gaps (never retry as [P]; an [S] on the same criterion is allowed)
slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, hoop colour, smoke diameters, fire segments/emissives, result-foreground-club, run-arms-one-splay, crew hoops.
