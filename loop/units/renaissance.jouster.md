# renaissance.jouster
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 1. horse in unit_renaissance.jouster_idle is a near-rectangular blue block with plumb sides and square ends, no brown barrel or chest showing — TABS: brown horse in a draped team caparison following the barrel, chest standing out ahead of it (ref: renaissance.jouster.png)
 2. horse head in unit_renaissance.jouster_idle is a flat brown plank — TABS: grey armoured chanfron with eye holes, ears, team plume (ref: renaissance.jouster.red.png)
 3. rider in unit_renaissance.jouster_idle is plain blue in a grey top hat — TABS: full grey plate and a close helm with team plume (ref: renaissance.jouster.blue.png)
b PASS (334)
c PASS (333)
d PASS (cost 1000, hp 8.28x vs 8.32x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a plate rider — blocker 3: grey plate dress on the rider plus a close helm with a team plume in place of the top hat — ref: renaissance.jouster.blue.png — ours: unit_renaissance.jouster_idle.png
2. [S] a chanfron — blocker 2: grey armoured horse head with eye holes, ears and a team plume over the plank head — ref: renaissance.jouster.red.png — ours: unit_renaissance.jouster_idle.png
3. [S] a drape open at the chest — blocker 1: visible brown barrel and chest, the drape cut shorter at the front and tapered in plan (buildHorse) — ref: renaissance.jouster.png — ours: unit_renaissance.jouster_idle.png
## Attempts (iter | gap | criterion | verdict)
328 | spiral-striped jousting lance [S] (4a390e5 + b5ed844) | b | approved
329 | yellow heater shield [S] (fa71e96 + 9cb619c) | b | approved
330 | couched lance [S] (fa74b0b) | c | approved
332 | lance on target [S] (062a748) | c | approved
333 | level lance, yaw-only aim [S] (eea51ad) | c | approved
334 | heater held upright, torso-sized [S] (69073a5) | b | approved
334 | domed drape, crenellated tan hem [S] (73fd09c + ea5c8af) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- LANCE is shared with secret.cavalry; _couchLance holds any "lance" level (COUCH), aimLanceAt turns it in yaw only.
- _holdHeater (HEATER_HOLD) solves the off fist ahead of the shoulder and stands "hshield" in the world; HEATER_GRIP_SIZE 1.3. Critic 334 nit: sits high, over the chest.
- buildHorse caparison: stadium rings, dome HORSE_DRAPE (crest, round), hem HORSE_DRAPE_CREAM; wild_west.lasso's pinto shares buildHorse (no drape).
