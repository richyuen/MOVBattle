# renaissance.jouster
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 327)
 1. horse in unit_renaissance.jouster_idle is a blue box on stick legs — TABS: brown horse in a draped team caparison with a cream crenellated hem following the barrel (ref: renaissance.jouster.png)
 2. horse head in unit_renaissance.jouster_idle is a flat brown plank — TABS: grey armoured chanfron with eye holes, ears, team plume (ref: renaissance.jouster.red.png)
 3. rider in unit_renaissance.jouster_idle is plain blue in a grey top hat — TABS: full grey plate and a close helm with team plume (ref: renaissance.jouster.blue.png)
b FAIL (2 since 327)
 3. heater in unit_renaissance.jouster_idle stands taller than the rider's torso, leans back ~30 deg, its point sunk behind the horse's back; in _windup edge-on as a yellow plank — TABS: torso-sized heater upright on the off arm, point down and visible beside the horse's neck (ref: renaissance.jouster.red.png)
c FAIL (0 since 327)
 1. in unit_renaissance.jouster_release the lance points back over the rump, in _flight vertical — TABS: lance couched level and driven forward into the target (ref: renaissance.jouster.png)
d PASS (cost 1000, hp 8.28x vs 8.32x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c couched lance — blocker 1: lance level under the arm, driven forward into the target — ref: renaissance.jouster.png — ours: unit_renaissance.jouster_release.png
2. [P] b heater size and turn (fallout of 329 heater [S]) — propBuilder.ts HEATER wide 0.26->0.2, tall 0.36->0.28, seat upright (no back-lean) — NEXT shot: unit_renaissance.jouster_idle.png
## Attempts (iter | gap | criterion | verdict)
328 | spiral-striped jousting lance [S] (4a390e5 + b5ed844) | b | approved
329 | yellow heater shield [S] (fa71e96 + 9cb619c) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 328 defect on the lance: stripe a thin helix; TABS equal team/cream bands (LANCE.stripe). LANCE is shared with secret.cavalry.
- The heater's turn is set as Euler on shield.rotation (the shield layer rebuilds its rest turn from it); ShieldType heater is the jouster's alone.
