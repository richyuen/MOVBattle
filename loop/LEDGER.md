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
main.ts:GIANT_LEAN | 0.4 | 159 | spent | 0.25 rejected (cut moved to red's rear)
cameraController.ts:FOLLOW_DROP | 0.9 | 155 | approved |
cameraController.ts:clearRadius | depth + max(6.0, giant/0.58) | 157 | approved |
cameraController.ts:melee alpha | -PI/3 | 159 | approved |
cameraController.ts:_pickSubject (places, band, knot, cut weight) | 12 places, BAND 0.28, knot 3, cut 0.3 + 3*size, fitted shot kept within 0.2 | 162 | approved |
cameraController.ts:_pickSubject facing (FACE_SIDE, HEADLESS, CORPSE_CUT, GIANT_PITCH, giant weight) | side-on 0.4 of face-on, cut winning giant +2, cut corpse x0.15, giant shot eye 1 up pitch 0.12, giant counts min(1.5, 2*size) outside the men's 1.5 cap | 165 | approved | no [P] on this row (critic 165); shot bodies clamped to y >= 0 (main.ts)
simulationSystem.ts:contactBias (ally) | 0.55 | 153 | spent | never lower; never shrink enemy collision distance
simulationSystem.ts:shove spread | 0.15 + h*0.3 | 160 | approved |
simulationSystem.ts:shield wall slots (spacing, rank depth, wall gap, stride, rank gap, heading arc) | shieldSlotSpacing 0.54 (same-wall collision at 0.9 of it), shieldRankDepth 1.0 (sorts a carrier into a rank once, rank kept after), shieldWallGap 2.2, shieldSlotStride 0.6, shieldRankGap 0.75 (rear slot behind the gaps, held in contact and on the march: a rear man halts at it square to the advance, slowing over shieldRankFollowBand 0.25, never pulled back), shieldHeadingArc 1.0 | 168 | approved | rear depth held in contact only (167); ranks re-banded every tick (166)
simulationSystem.ts:_buildShovePose arms | level | 160 | approved |
unitFactory.ts:CLOTH_SHADE | 0.8 | 151 | approved | also darkens armour
unitFactory.ts:team blue colour | (0.42, 0.60, 0.98) | 150 | spent | three values over 120-123: walked up and back down
unitFactory.ts:team red colour | greyed crimson | 142 | spent | six hues over 123-140: walked in circles
unitFactory.ts:idle lean | 0.26 + h*0.14 | 148 | spent | do not raise, drives lineups
bodyBuilder.ts:limb taper and torso wedge (LOWER_LIMB_MIN_TAPER, CHEST_LINE, CHEST_SWELL, SHOULDER_SLOPE, WAIST_DEPTH) | lower limb starts at the upper limb's end (no step), min taper 0.6 (forearms; shins: see boot row); chest line 0.36, swell 1.05, shoulders 0.8, waist depth 0.85 | 166 | approved | LOWER_LIMB_STEP 1.0375 joint step + min taper 0.88; torso a plain hex frustum
bodyBuilder.ts:head, neck, limb length, mitt (HEAD_OF_BODY, HEAD_CORNER, NECK_LENGTH, LIMB_STRETCH, MITT_FROM_SLEEVE, mitt box) | head a bevelled block (blockHead: crown 0.9, brow at 0.6 of its height, jaw 0.78) sized 0.18 of standing height, corners 0.55, eyes on the face flat; neck column 0.07 with head, eyes and hat anchor on top, arm and leg segments x1.16, mitt 1.7 sleeve tops: a box paddle 0.66 wide, 0.84 long, 0.24 thick, wrist end x0.6, fingertip depth x0.7 | 169 | approved | mitt and head were spheres (167-168)
bodyBuilder.ts:boot and shin end (SHIN_END, BOOT_OVER_SHIN, BOOT_RISE, BOOT_LENGTH, BOOT_TOE_HEIGHT) | shin keeps 0.78 of its top width; foot() merges a cuff box 1.3 shin ends wide and deep, standing 0.34 of the shin up it (top x0.9), with a toe box 1.7 cuffs long and 0.5 of its height (toe x0.8 wide, top x0.4) | 171 | approved | FOOT_ANKLE 0.85: a 0.07 tall wedge tile under a shin tapered to 0.57
bodyBuilder.ts:pelvis block (PELVIS_OF_SHOULDERS, PELVIS_HEIGHT) | box 0.8 of the shoulders wide (never under the waist), 1.2 thigh tops tall, top drawn in to the waist, set 0.2 of its height down the hip; hip sockets at its lower corners; no idle or march hip splay | 170 | approved | hipOffX 0.28 of torsoBottom, idle splay 0.08-0.12
bodyBuilder.ts:HAT_CUT_FOR_HEAD | 0.7 | 169 | spent | 0.85 rejected 169: scales headTop, so every hat, hair and wreath shrank off the head and the helm was still wider than the shoulders; fit the helm in propBuilder instead
bodyBuilder.ts:SLEEVE_BULK | 1.05 | 167 | approved | 1.15; tuned, no further [P] (critic 167); also scales thighs and the mitt
propBuilder.ts:hair scale/y | 1.5x head, y 0.24 | 160 | approved |
propBuilder.ts:bare shoulder cap | 1.3 | 160 | approved |
propBuilder.ts:rshield disc/rim | 0.36 / 0.4 | 160 | approved | 0.3/0.33 154
mapBuilder.ts:BLADES | 720000 | 159 | approved | 480000 before
mapBuilder.ts:blade width (`half`) | x1.0 | 160 | spent | x1.5 rejected: squat cones
projectileSystem.ts:muzzle smoke lobes (size, count, drift, tint, glow) | lead 0.6, seven small | 154 | spent | 35 attempts over iters 11-154, lead lobe 0.6 -> 0.48 -> 0.6: every value tried
projectileSystem.ts:cannonball colour | near-black | 160 | spent | no shot in flight in any still until the 1250ms pair exists
visualEffects.ts:explosion burst (lobes, shells, flecks, colours) | 4 unlit yellow heart lobes (1.3,0.6,0) (size .95/.7/.52/.4, reach .34-.64, wide 1.3, deep 0.68), each in an inside-out orange shell (1.0,0.22,0) size x1.5 reach +0.06, 3 flecks reach .95-1.25, 5 skirt (0.85,0.13,0); fireScale cap 1.6 | 164 | approved | lobe size spent (LOBES[0] 0.75 rejected 163); lit/cream shards (163), heart lumps globe (161), sphere stack (spent; emissives untouched)
visualEffects.ts:explosion dust bank (puffs, reach, size, tall, tans) | 14 unlit puffs on a disc, reach 2.3*sqrt, size 0.7-1.45, tall 0.9-0.3*spread, emissive tans (0.8,0.6,0.35)/(0.68,0.5,0.28)/(0.56,0.4,0.22), gone at 60% | 164 | approved | no further [P] on tall and tans (critic 164); any lit tan renders grey (colour spent 162); fireScale cap 1.35 snowman (spent)
visualEffects.ts:explosion clods | 9, speed 1.2-3.0, up 3.5-6.5 | 161 | approved | 6, speed 0.9-2.2, up 3-5.4
proceduralAnimation.ts:shield brace (arm, torso, knees, board) | shoulder x -0.7 z 0.3, elbow -1.1, torso pitch 0.1, roll x0.3, knees +0.15, board slerped square to root yaw at 1.5*shove | 165 | approved |
proceduralAnimation.ts:spear carry (_carrySpear, spear arm) | wall carrier's shaft turned in the fist by root yaw: upright (pitch 0.06) on the march, level (+PI/2+0.04) at 1.5*shove, weight 1-limp; contact arm shoulder x -2.2 z 0.2 elbow -1.2, jab +0.5/+0.9 over the attack; march arm x ~0, z 0.25, elbow -0.5; a rear man halted within engage + shieldRankGap + 1 of his target braces (simulationSystem) | 169 | approved |
proceduralAnimation.ts:march gait (_buildGait) | per-unit rate 6.8-9.4, free-leg knee fold 0.6-1.5 at mid-swing with thigh lift 0.35x, standing knee sink 0.05-0.27, step asymmetry +-0.18, arm lag +-0.7 rad, arm swing 0.5-0.95 | 171 | approved | one cycle at speed 8, knee 0.6 only with the thigh forward, arms 0.75
proceduralAnimation.ts:idle rest (_buildIdlePose tilt, turn, arms) | weight on the free (leading) leg: hip root roll 0.11-0.19, torso -1.5x, neck +0.5x and yaw 0.2-0.6; legs upright (free foot 0.08 out, standing 0.06 in: do not grow); arms plumb (shoulder x -0.7 lean, z -roll, 0.08-0.18 out), elbow 0.4-0.8, each its own pendulum 0.14-0.32 at rate 0.9-1.6 | 170 | approved | elbow 0.15-0.45 hung the hands at the shins
proceduralAnimation.ts:landed corpse folds (_writeDeathRest) | back: thigh 0.95+0.3u, knee 2x, arm across chest (z 0.5, y 1.57, elbow -1.7), torso lift 0.3+0.6u in 2 of 5; front: shin 1.3+0.4u, wing arm x 0.7, arch -0.3; neck roll 0.7+0.4u; flank rolls over | 164 | approved |
vehicleBuilder.ts:catapult arm/posts/bucket/wheels | see 155-158 | 158 | spent | goalpost rejected-kept twice
vehicleBuilder.ts:mammoth hide/tusks/hat/trample/launch/legs | see 15-159 | 159 | spent | ~30 attempts

## Structural attempts (last 10 iterations; `iter | gap | criterion | verdict`)
- 161 | impact-globe-stack | vfx.b | approved
- 161 | result-shot-occluded | camera.d | rejected
- 162 | result-shot-occluded | camera.d | approved
- 162 | burst-heart-round-ball | vfx.b | approved
- 163 | dust-burst-unread | vfx.b | approved
- 163 | plank-corpses | battle-feel.d | rejected
- 164 | burst-white-not-fire | vfx.b | approved
- 164 | plank-corpses | battle-feel.d | approved
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

## Spent gaps (never retry as [P]; an [S] on the same criterion is allowed)
slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, hoop colour, smoke diameters, fire segments/emissives, result-foreground-club, run-arms-one-splay, crew hoops.
