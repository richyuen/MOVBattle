# farmer.wheelbarrow
Status: parked   Audited: 375 (re), 397   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (8 since 375; 1 rejected [S], 2 rejected [R] since 375) [parked 403]
 1. riders in unit_farmer.wheelbarrow_idle/_windup: the shins now drop outside the rim over the side boards, but the knees still close to the Farmer's upper arms, not splayed wide past him - TABS: knees splayed wide out past the front rider, at his waist (ref: .red.png)
b PASS (375)
c PASS (375)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
(parked: a is not picked again)
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
346-389 | crew, tray + hay, fork/apple, wheel, ram, dress, stab; riders on the tray; narrow/short tray, reclined; LOW_RIM; THROWER_LEGS/PERCH/KNEES [S][P]; hay mound (382 rejected) | a,b,c | approved
397 | [R] knees solved to a reachable point, thighs stretched, shins hanging (2e73091 + 2c2cc8b, reverted 8f53efc/0e9756d) | a | rejected
403 | [R] FRONT_SPLIT: the Farmer's thighs aimed in the rig frame out .88/ahead .42/down .12, shins down outside the boards (06ea4d4, reverted a5b8099) | a | rejected -> parked
## Rejected (last 4)
- riders [R] [2] - 403: the Farmer's thighs aimed out in the rig frame (knees |x| .40 root vs the .22 board) - the critic: the knee span about one shoulder width, the knee forward at the tray's lip; TABS's thighs run straight out sideways from hips on the board top, knees a full thigh past each board
- riders [R] [1] - 397: the thrower's thigh stretched to a point outside the Farmer's shoulder, shins hanging - the critic: stretching the thrower's thigh does not read as the split
- riders [S] [1] - 382: hay mound on the rear quarter - the mound read as a pale crate filling the rear instead of a rider
## Notes (max 3 lines)
- Parked 403 (an [R] rejected twice). The 403 critic's recipe if ever unparked: seat the Farmer's hips on the board top (root up to the rim), thighs near pure sideways (out ~1, ahead <=.1, down 0), knees a thigh past each board, shins plumb.
- 403 probe: the old Euler seat (CREW_SEAT frontThigh -1.15/splay .62/knee .45, restored by the revert) crosses the Farmer's knees inward to |x| .09 root inside the .22 board.
- Crew on root.metadata.wheelbarrowCrew; posed by poseWheelbarrowCrew; legs static from build (legsRoundFarmer, aimLimb). Probe: probe_wheelbarrow.mjs --build.
