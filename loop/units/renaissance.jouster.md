# renaissance.jouster
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 327)
 1. horse in unit_renaissance.jouster_idle is a near-rectangular blue block with plumb sides and square ends, no brown barrel or chest showing — TABS: brown horse in a draped team caparison following the barrel, chest standing out ahead of it (ref: renaissance.jouster.png)
b PASS (334)
c PASS (333)
d PASS (cost 1000, hp 8.28x vs 8.32x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a caparison body — blocker 1: rebuild the horse drape to follow the barrel, rounded ends, with the brown chest and neck base standing out ahead of it and below its hem — ref: renaissance.jouster.png — ours: unit_renaissance.jouster_idle.png
## Attempts (iter | gap | criterion | verdict)
328 | spiral-striped jousting lance [S] (4a390e5 + b5ed844) | b | approved
329 | yellow heater shield [S] (fa71e96 + 9cb619c) | b | approved
330 | couched lance [S] (fa74b0b) | c | approved
333 | level lance, yaw-only aim [S] (eea51ad) | c | approved
334 | heater held upright, torso-sized [S] (69073a5) | b | approved
334 | domed drape, crenellated tan hem [S] (73fd09c + ea5c8af) | a | approved
335 | plate rider, close helm, team plume [S] (909f200 + e5e55bd) | a | approved
336 | chanfron: grey cased face, eye holes, ears, tufted plume [S] (493017a) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- LANCE is shared with secret.cavalry; _couchLance holds any "lance" level (COUCH). _holdHeater (HEATER_HOLD) stands "hshield" in the world.
- dressJouster (JOUSTER_HELM, JOUSTER_PLATE) dresses the rider. buildHorse (shared with wild_west.lasso's pinto: keep changes in !pinto) has buildChanfron (CHANFRON).
- Critic 336 nits: horse plume a few small tufts (TABS bushy); neck a straight brown plank (TABS curved, mostly under the caparison).
