# farmer.wheelbarrow
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 375)
 1. riders in unit_farmer.wheelbarrow_windup (also _idle): the near Thrower thigh now comes over the side board, shin outside the tray, but the tray's rear quarter by the handles is still bare hay, the far knee does not show, and the riders merge into one hooded body — TABS: riders overfill the tray, the Thrower's knees splayed out round the Farmer on both sides, shins outside (ref: .red.png, .png)
b PASS (375)
c PASS (375)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a riders — blocker 1: Thrower seated on the tray's rear quarter, raised on a hay mound so his torso shows above the Farmer, both knees past the Farmer's hips (vehicleBuilder addOperator/legsRoundFarmer; THROWER_LEGS new 381: [P] barred) — ref: .red.png — ours: unit_farmer.wheelbarrow_windup.png
## Attempts (iter | gap | criterion | verdict)
346-350 | crew, tray + hay, fork/apple, log wheel, ram, dress, fight, stab, drum wheel [S]; afro [P] | a,b,c | approved
376-378 | riders on the tray; narrow tray, Thrower on the rim; short tray, bunched, Farmer reclined [S] | a | approved
380 | low rim (one board), seats on the tray middle, Thrower's thighs forward/out (LOW_RIM) [S] (fe764b2 +f78cb48) | a | approved
381 | Thrower's thighs solved to knee targets outside the Farmer's hips, shins down/out, seat -.08 (THROWER_LEGS) [S] (fd3d2e2) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Crew bodies on root.metadata.wheelbarrowCrew; dressed in unitFactory dressWheelbarrowCrew; posed by poseWheelbarrowCrew (arms, recline); legs static from build.
- legsRoundFarmer aims hips/knees with rotationQuaternion (settleWorld + aimLimb). Thigh ~.33 root units: a seat further back puts the knees behind the Farmer's hips unless he is raised/legs re-aimed. Probe: output/loop/probe_wheelbarrow.mjs.
- Sim reads of joint positions must settle world matrices first.
