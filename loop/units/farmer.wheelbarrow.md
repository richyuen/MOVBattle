# farmer.wheelbarrow
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 375; 1 rejected [S] since 375)
 1. riders in unit_farmer.wheelbarrow_windup (also _idle): the near Thrower thigh comes over the side board, but the tray's rear quarter by the handles holds no rider, the far knee does not show, and the riders merge into one hooded body — TABS: riders overfill the tray, the Thrower's chest and head clear above the Farmer, his knees splayed out round the Farmer on both sides, shins outside (ref: .red.png, .png)
b PASS (375)
c PASS (375)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a riders — blocker 1: Thrower moved back onto the rear quarter (hips over the handles' end of the tray) and up so his chest clears the Farmer's head, knees solved wide to both sides; no mound, or a small one under his hips (vehicleBuilder; THROWER_LEGS [P] barred) — ref: .red.png — ours: unit_farmer.wheelbarrow_idle.png
## Attempts (iter | gap | criterion | verdict)
346-378 | crew, tray + hay, fork/apple, wheel, ram, dress, stab; riders on the tray; narrow tray; short tray, reclined [S] | a,b,c | approved
380 | low rim (one board), seats on the tray middle (LOW_RIM) [S] (fe764b2 +f78cb48) | a | approved
381 | Thrower's thighs solved to knee targets outside the Farmer's hips (THROWER_LEGS) [S] (fd3d2e2) | a | approved
382 | hay mound on the rear quarter, Thrower on its front slope .2 higher (HAY_MOUND) [S] (ed5a3b5, reverted) | a | rejected
## Rejected (last 4)
- riders [S] [1] — 382: hay mound on the rear quarter — the mound read as a pale crate filling the rear instead of a rider; riders still one merged body
## Notes (max 3 lines)
- Crew bodies on root.metadata.wheelbarrowCrew; dressed in unitFactory dressWheelbarrowCrew; posed by poseWheelbarrowCrew; legs static from build (legsRoundFarmer, aimLimb).
- Thigh ~.33 world (probe): seat at -.15 rig left the knees .15 short of the Farmer's hips (z .155 vs .308); seat -.04 + raise .08 reached z .36. Going back needs longer reach (knees by the Farmer's hips is the target) or the Farmer moved back too. Probe: output/loop/probe_wheelbarrow.mjs --build.
- Sim reads of joint positions must settle world matrices first.
