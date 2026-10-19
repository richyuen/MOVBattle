# farmer.wheelbarrow
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (6 since 375; 1 rejected [S] since 375)
 1. riders in unit_farmer.wheelbarrow_windup/_idle: the Thrower now sits up on the rear quarter, head well clear above the Farmer, but his near leg drops nearly straight down outside the board, the far knee does not show, and his thighs do not wrap round the Farmer — TABS: knees splayed out round the front rider on both sides, shins outside (ref: .red.png)
b PASS (375)
c PASS (375)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a riders — blocker 1: aim the knee targets forward and outward, level with the Farmer's chest, so both knees show either side of him in _idle (vehicleBuilder legsRoundFarmer) — ref: .red.png — ours: unit_farmer.wheelbarrow_idle.png
## Attempts (iter | gap | criterion | verdict)
346-378 | crew, tray + hay, fork/apple, wheel, ram, dress, stab; riders on the tray; narrow tray; short tray, reclined [S] | a,b,c | approved
380-381 | low rim, seats on the tray middle (LOW_RIM); Thrower's thighs solved to knee targets (THROWER_LEGS) [S] | a | approved
382 | hay mound on the rear quarter, Thrower on it .2 higher (HAY_MOUND) [S] (ed5a3b5, reverted) | a | rejected
387 | Thrower perched on the rear quarter on a small hay tuft, knees aimed outside the side boards (THROWER_PERCH) [S] (51b7c67) | a | approved (narrowed a.1)
## Rejected (last 4)
- riders [S] [1] — 382: hay mound on the rear quarter — the mound read as a pale crate filling the rear instead of a rider; riders still one merged body
## Notes (max 3 lines)
- Crew bodies on root.metadata.wheelbarrowCrew; dressed in unitFactory dressWheelbarrowCrew; posed by poseWheelbarrowCrew; legs static from build (legsRoundFarmer aims thighs at THROWER_PERCH knee targets, aimLimb). Probe: output/loop/probe_wheelbarrow.mjs --build.
- Thigh ~.15 rig (.33 world): a knee target is only a direction; the knee lands one thigh length along it. Thrower hips z -.07 rig (trayZ .08 + seat -.15), Farmer's +.14.
- Sim reads of joint positions must settle world matrices first.
