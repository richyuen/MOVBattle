# farmer.wheelbarrow
Status: done   Audited: 375 (re), 397, 422 (CONFIRM)   Done: 422
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (422: [R] FRONT_SPLIT + THROWER_SPLIT struck the last blocker; CONFIRM 422 passed)
b PASS (375; CONFIRM 422)
c PASS (375; CONFIRM 422)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
346-389 | crew, tray + hay, fork/apple, wheel, ram, dress, stab; riders on the tray; narrow/short tray, reclined; LOW_RIM; THROWER_LEGS/PERCH/KNEES [S][P]; hay mound (382 rejected) | a,b,c | approved
397 | [R] knees solved to a reachable point, thighs stretched, shins hanging (2e73091 + 2c2cc8b, reverted) | a | rejected
403 | [R] FRONT_SPLIT thighs aimed out .88/ahead .42/down .12 without moving the hips (06ea4d4, reverted a5b8099) | a | rejected -> parked
422 | [R] unparked by hand: the Farmer's hip joints slid .05 rig out onto the board tops, thighs straight sideways (knees .545 root, a thigh past the .22 board), shins down and out; the Thrower's thighs aimed by direction, not at an unreachable target (4c36f7da) | a | approved (a PASS; CONFIRM passed)
## Rejected (last 4)
- riders [R] [2] - 403: thighs aimed out in the rig frame with the hips left at |x| .106 - the knee span about one shoulder width, the knee forward at the tray's lip
- riders [R] [1] - 397: the thrower's thigh stretched to a point outside the Farmer's shoulder - stretching does not read as the split
## Notes (max 3 lines)
- The fix that worked (422): the knee span is set by the hip joints' x plus one thigh (.33 root); a wide split needs the hip joints moved out (the pelvis frame, hip.position.x), not a longer aim. The CONFIRM critic's residuals, below the bar: the Thrower's head paler than his body; the Farmer's near shin hangs rather than thrusts out (the 422 critic: [P] FRONT_SPLIT.shinOut .45 -> ~.8 if ever listed).
- Crew on root.metadata.wheelbarrowCrew; posed by poseWheelbarrowCrew; legs static from build (seatFarmerSplit, legsRoundFarmer, aimLimb). Probe: probe_wheelbarrow.mjs --build.
