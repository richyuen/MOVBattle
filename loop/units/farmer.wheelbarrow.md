# farmer.wheelbarrow
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 375)
 1. riders in unit_farmer.wheelbarrow_windup (also _idle): bunched and the Farmer reclines now, but they sit at the wheel end with the tray's rear half empty hay and a deep three-board side, so their hips sink below the rim; the Thrower's legs hang plumb down the side — TABS: a short low-rimmed tray the riders overfill, the Thrower's legs splayed forward and out around the Farmer (ref: .red.png, .png)
b PASS (375)
c PASS (375)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a riders centred over a low-rimmed tray, the Thrower's thighs splayed forward and out around the Farmer — blocker 1: CREW_SEAT back pose, one low rim board, seat z (vehicleBuilder) — ref: .red.png — ours: unit_farmer.wheelbarrow_windup.png
## Attempts (iter | gap | criterion | verdict)
346-350 | crew on the cart, plank tray + hay, fork/apple, log wheel, ram, crew dress, riders fight, aimed stab, drum wheel [S]; afro [P] | a,b,c | approved
376 | riders on the tray: Farmer on the lip legs forward, Thrower astride (CREW_SEAT) [S] (78a73b0) | a | approved
377 | narrow tray .2, flat hay bed, Thrower on the rim, knees rolled (HAY_BED, CREW_SEAT) [S] (aa835d7 +4f65905) | a | approved
378 | short tray .5, Thrower's hips .1 behind the Farmer, Farmer reclined -.5 (BUNCHED_CREW) [S] (9ea4314) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Crew bodies on root.metadata.wheelbarrowCrew; dressed in unitFactory dressWheelbarrowCrew; posed each tick by poseWheelbarrowCrew (arms, Farmer's torso recline).
- Sim reads of joint positions must settle world matrices first (capture replays a frame in one advanceTime call; renders refresh them).
- 377: at rig scale a thigh is ~.11; a knee bent only about x swings the shin round a splayed thigh, so roll the knee (z) by the splay to hang it.
