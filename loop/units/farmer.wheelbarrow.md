# farmer.wheelbarrow
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (7 since 375; 1 rejected [S] since 375)
 1. riders in unit_farmer.wheelbarrow_idle/_windup: the shins now drop outside the rim over the side boards, but the knees still close to the Farmer's upper arms, not splayed wide past him - TABS: knees splayed wide out past the front rider, at his waist (ref: .red.png)
b PASS (375)
c PASS (375)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a riders - blocker 1: knee targets at the Farmer's waist height, at +-(Farmer half-width + .25) - ref: .red.png - ours: unit_farmer.wheelbarrow_idle.png
## Attempts (iter | gap | criterion | verdict)
346-378 | crew, tray + hay, fork/apple, wheel, ram, dress, stab; riders on the tray; narrow/short tray, reclined [S] | a,b,c | approved
380-381 | low rim, seats on the tray middle (LOW_RIM); Thrower's thighs to knee targets (THROWER_LEGS) [S] | a | approved
382 | hay mound on the rear quarter (HAY_MOUND) [S] (ed5a3b5, reverted) | a | rejected
387 | Thrower perched on the rear quarter on a hay tuft (THROWER_PERCH) [S] (51b7c67) | a | approved (narrowed a.1)
388 | knee targets off the Farmer's own trunk, .55 hip to shoulder, outside the shoulder (THROWER_KNEES; retires THROWER_LEGS) [S] (450e263) | a | approved (narrowed a.1)
389 | THROWER_KNEES out .07 -> .2, shinOut .35 -> .6 [P] (a63c351) | a | approved (narrowed a.1)
## Rejected (last 4)
- riders [S] [1] — 382: hay mound on the rear quarter — the mound read as a pale crate filling the rear instead of a rider
## Notes (max 3 lines)
- Crew bodies on root.metadata.wheelbarrowCrew; dressed in unitFactory dressWheelbarrowCrew; posed by poseWheelbarrowCrew; legs static from build (legsRoundFarmer aims thighs at THROWER_KNEES targets, aimLimb). Probe: output/loop/probe_wheelbarrow.mjs --build.
- 388 probe (world m): Thrower knees +-.305, y 1.185, z .112; Farmer hips +-.106, y .99, z .308. A knee target is only a direction: the knee lands one thigh length along it.
- Sim reads of joint positions must settle world matrices first.
