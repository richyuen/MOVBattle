# farmer.wheelbarrow
Status: open   Audited: 375 (re), 397   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (8 since 375; 1 rejected [S], 1 rejected [R] since 375) [plateau]
 1. riders in unit_farmer.wheelbarrow_idle/_windup: the shins now drop outside the rim over the side boards, but the knees still close to the Farmer's upper arms, not splayed wide past him - TABS: knees splayed wide out past the front rider, at his waist (ref: .red.png)
b PASS (375)
c PASS (375)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a seated split - blocker 1: rebuild the FRONT rider's sit (.red.png: thighs near-horizontal, both knees at his waist outside the tray, shins down outside the boards; the thrower's knees are the second pair beside his ribs, not a substitute for that split) - ref: farmer.wheelbarrow.red.png - ours: unit_farmer.wheelbarrow_idle.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
346-378 | crew, tray + hay, fork/apple, wheel, ram, dress, stab; riders on the tray; narrow/short tray, reclined [S] | a,b,c | approved
380-381 | low rim, seats on the tray middle (LOW_RIM); Thrower's thighs to knee targets (THROWER_LEGS) [S] | a | approved
382 | hay mound on the rear quarter (HAY_MOUND) [S] (ed5a3b5, reverted) | a | rejected
387 | Thrower perched on the rear quarter on a hay tuft (THROWER_PERCH) [S] (51b7c67) | a | approved (narrowed a.1)
388 | knee targets off the Farmer's own trunk, .55 hip to shoulder, outside the shoulder (THROWER_KNEES) [S] (450e263) | a | approved (narrowed a.1)
389 | THROWER_KNEES out .07 -> .2, shinOut .35 -> .6 [P] (a63c351) | a | approved (narrowed a.1)
397 | [R] knees solved to a reachable point, thighs stretched, shins hanging (2e73091 + 2c2cc8b, reverted 8f53efc/0e9756d) | a | rejected
## Rejected (last 4)
- riders [R] [1] - 397: the thrower's thigh stretched to a point outside the Farmer's shoulder, shins hanging - the critic: stretching the thrower's thigh does not read as the split; in _idle/_windup both of the FRONT rider's knees are still not at his waist outside the tray
- riders [S] [1] - 382: hay mound on the rear quarter - the mound read as a pale crate filling the rear instead of a rider
## Notes (max 3 lines)
- 397 critic's recipe: rebuild the front rider's seated split (thighs near-horizontal, knees at his waist outside the tray, shins vertical outside the boards); the thrower's knees go as a second pair beside his ribs.
- Crew bodies on root.metadata.wheelbarrowCrew; dressed in unitFactory dressWheelbarrowCrew; posed by poseWheelbarrowCrew; legs static from build (legsRoundFarmer, aimLimb). Probe: loop/scripts/probes/probe_wheelbarrow.mjs --build.
- A knee target is only a direction: the knee lands one thigh length along it. Sim reads of joint positions must settle world matrices first.
