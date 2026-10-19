# farmer.wheelbarrow
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 375)
 1. riders in unit_farmer.wheelbarrow_windup (also _idle, _release): over one low rim now, but the tray's rear quarter by the handles is bare hay and the Thrower hides behind the Farmer: no knees out past the Farmer's hips, one shin plumb under the tray — TABS: riders overfill the tray, the Thrower's knees splayed out round the Farmer, shins outside (ref: .red.png, .png)
b PASS (375)
c PASS (375)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a Thrower's legs round the Farmer — blocker 1: solve his thighs from hip to knee targets placed (world-space) outside the Farmer's hips, seat him at the tray's back end (LOW_RIM, CREW_SEAT new 380: [P] barred) — ref: .red.png — ours: unit_farmer.wheelbarrow_idle.png
## Attempts (iter | gap | criterion | verdict)
346-350 | crew, tray + hay, fork/apple, log wheel, ram, dress, fight, stab, drum wheel [S]; afro [P] | a,b,c | approved
376-378 | riders on the tray; narrow tray, Thrower on the rim; short tray, bunched, Farmer reclined [S] | a | approved
380 | low rim (one board), seats on the tray middle, Thrower's thighs forward/out (LOW_RIM) [S] (fe764b2 +f78cb48) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Crew bodies on root.metadata.wheelbarrowCrew; dressed in unitFactory dressWheelbarrowCrew; posed each tick by poseWheelbarrowCrew (arms, Farmer's recline); legs static from build.
- Sim reads of joint positions must settle world matrices first.
- At rig scale a thigh is ~.11; a knee bent only about x swings the shin round a splayed thigh, so roll the knee (z) to hang it.
