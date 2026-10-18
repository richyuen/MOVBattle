# renaissance.jouster
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 327)
 1. horse in unit_renaissance.jouster_idle is a blue box on stick legs — TABS: brown horse in a draped team caparison with a cream crenellated hem following the barrel (ref: renaissance.jouster.png)
 2. horse head in unit_renaissance.jouster_idle is a flat brown plank — TABS: grey armoured chanfron with eye holes, ears, team plume (ref: renaissance.jouster.red.png)
 3. rider in unit_renaissance.jouster_idle is plain blue in a grey top hat — TABS: full grey plate and a close helm with team plume (ref: renaissance.jouster.blue.png)
b FAIL (2 since 327)
 3. heater in unit_renaissance.jouster_idle stands taller than the rider's torso, leans back ~30 deg, point sunk behind the horse's back; in _windup edge-on — TABS: torso-sized heater upright on the off arm, point down beside the horse's neck (ref: renaissance.jouster.red.png)
c PASS (333)
d PASS (cost 1000, hp 8.28x vs 8.32x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a draped horse — blocker 1: brown horse body draped in a team cloth following the barrel, cream crenellated hem — ref: renaissance.jouster.png — ours: unit_renaissance.jouster_idle.png
2. [S] b heater shield — blocker 3: torso-sized heater upright on the off arm, point down beside the horse's neck — ref: renaissance.jouster.red.png — ours: unit_renaissance.jouster_idle.png
## Attempts (iter | gap | criterion | verdict)
328 | spiral-striped jousting lance [S] (4a390e5 + b5ed844) | b | approved
329 | yellow heater shield [S] (fa71e96 + 9cb619c) | b | approved
330 | couched lance [S] (fa74b0b) | c | approved
332 | lance on target [S] (062a748) | c | approved
333 | level lance, yaw-only aim [S] (eea51ad) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- LANCE is shared with secret.cavalry; _couchLance holds any "lance" level (COUCH) and aimLanceAt turns it onto the man in yaw only (pitch COUCH.dip).
- The heater's turn is Euler on shield.rotation (the shield layer rebuilds its rest from it); ShieldType heater is the jouster's alone.
- Critic 333 nit: in _release the foe is already down, so the lance never meets a standing chest in the shots.
