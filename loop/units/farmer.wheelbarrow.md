# farmer.wheelbarrow
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (7 since 375; 1 rejected [S] since 375)
 1. riders in unit_farmer.wheelbarrow_idle/_windup: the Thrower's thighs now run forward beside the Farmer's flanks, but the knees are tucked against his sides at belly height and the shins drop straight onto the board inside the rim — TABS: knees splayed wide out past the front rider, shins out over the boards on both sides (ref: .red.png)
b PASS (375)
c PASS (375)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] a knees (fallout of 450e263) — NEXT: [P] vehicleBuilder THROWER_KNEES out .07 -> wider (knee targets further out from the Farmer's shoulder), shinOut .35 -> more, so the shins drop outside the rim; shows in unit_farmer.wheelbarrow_idle.png, knees out past the Farmer's arms
## Attempts (iter | gap | criterion | verdict)
346-378 | crew, tray + hay, fork/apple, wheel, ram, dress, stab; riders on the tray; narrow/short tray, reclined [S] | a,b,c | approved
380-381 | low rim, seats on the tray middle (LOW_RIM); Thrower's thighs to knee targets (THROWER_LEGS) [S] | a | approved
382 | hay mound on the rear quarter (HAY_MOUND) [S] (ed5a3b5, reverted) | a | rejected
387 | Thrower perched on the rear quarter on a hay tuft (THROWER_PERCH) [S] (51b7c67) | a | approved (narrowed a.1)
388 | knee targets off the Farmer's own trunk, .55 hip to shoulder, outside the shoulder (THROWER_KNEES; retires THROWER_LEGS) [S] (450e263) | a | approved (narrowed a.1)
## Rejected (last 4)
- riders [S] [1] — 382: hay mound on the rear quarter — the mound read as a pale crate filling the rear instead of a rider
## Notes (max 3 lines)
- Crew bodies on root.metadata.wheelbarrowCrew; dressed in unitFactory dressWheelbarrowCrew; posed by poseWheelbarrowCrew; legs static from build (legsRoundFarmer aims thighs at THROWER_KNEES targets, aimLimb). Probe: output/loop/probe_wheelbarrow.mjs --build.
- 388 probe (world m): Thrower knees +-.305, y 1.185, z .112; Farmer hips +-.106, y .99, z .308. A knee target is only a direction: the knee lands one thigh length along it.
- Sim reads of joint positions must settle world matrices first.
