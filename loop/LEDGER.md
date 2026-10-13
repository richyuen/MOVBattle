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
simulationSystem.ts:contactBias (ally) | 0.55 | 153 | spent | never lower; never shrink enemy collision distance
simulationSystem.ts:shove spread | 0.15 + h*0.3 | 160 | approved |
simulationSystem.ts:_buildShovePose arms | level | 160 | approved |
unitFactory.ts:CLOTH_SHADE | 0.8 | 151 | approved | also darkens armour
unitFactory.ts:team blue colour | (0.42, 0.60, 0.98) | 150 | spent | (0.62,0.86,1.0) 123, (0.50,0.68,0.96) 121, (0.38,0.58,0.95) 120: walked up and back down
unitFactory.ts:team red colour | greyed crimson | 142 | spent | plum 123, pink 126, crimson 127, bright 128 rejected, greyed 129, bubblegum 140: walked in circles
unitFactory.ts:idle lean | 0.26 + h*0.14 | 148 | spent | do not raise, drives lineups
propBuilder.ts:hair scale/y | 1.5x head, y 0.24 | 160 | approved |
propBuilder.ts:bare shoulder cap | 1.3 | 160 | approved |
propBuilder.ts:rshield disc/rim | 0.36 / 0.4 | 160 | approved | 0.3/0.33 154
mapBuilder.ts:BLADES | 720000 | 159 | approved | 480000 before
mapBuilder.ts:blade width (`half`) | x1.0 | 160 | spent | x1.5 rejected: squat cones
projectileSystem.ts:muzzle smoke lobes (size, count, drift, tint, glow) | lead 0.6, seven small | 154 | spent | 35 attempts over iters 11-154, lead lobe 0.6 -> 0.48 -> 0.6: every value tried
projectileSystem.ts:cannonball colour | near-black | 160 | spent | no shot in flight in any still until the 1250ms pair exists
visualEffects.ts:explosion burst shards (count, reach, size, length, life) | 22: 5 heart, 9 spikes, 8 skirt; fireScale cap 1.6 | 161 | approved | sphere stack: lobeSizes [1,1,.5,.9,.45,.6] + 7 tongues (spent; cream grade kept, emissives untouched)
visualEffects.ts:explosion dust ring (lumps, reach, size, colour) | 10 lumps, reach 1.1-1.8, size 0.26-0.46, matte tan | 161 | approved | one self-lit mound 0.85 (spent: fireScale cap 1.35 snowman)
visualEffects.ts:explosion clods | 9, speed 1.2-3.0, up 3.5-6.5 | 161 | approved | 6, speed 0.9-2.2, up 3-5.4
vehicleBuilder.ts:catapult arm/posts/bucket/wheels | see 155-158 | 158 | spent | goalpost rejected-kept twice
vehicleBuilder.ts:mammoth hide/tusks/hat/trample/launch/legs | see 15-159 | 159 | spent | ~30 attempts

## Structural attempts (last 10 iterations; `iter | gap | criterion | verdict`)
- 161 | impact-globe-stack | vfx.b | approved
- 161 | result-shot-occluded | camera.d | rejected

## Spent gaps (never retry as [P]; an [S] on the same criterion is allowed)
slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, hoop colour, smoke diameters, fire segments/emissives, result-foreground-club, run-arms-one-splay, crew hoops.
