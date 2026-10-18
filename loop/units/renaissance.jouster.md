# renaissance.jouster
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 327)
 1. horse in unit_renaissance.jouster_idle is a near-rectangular blue block with plumb sides and square ends, no brown barrel or chest showing — TABS: brown horse in a draped team caparison following the barrel, chest standing out ahead of it (ref: renaissance.jouster.png)
 2. horse head in unit_renaissance.jouster_idle is a flat brown plank — TABS: grey armoured chanfron with eye holes, ears, team plume (ref: renaissance.jouster.red.png)
b PASS (334)
c PASS (333)
d PASS (cost 1000, hp 8.28x vs 8.32x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a chanfron — blocker 2: grey faceted chanfron over the horse's muzzle with eye holes, two ears and a team plume, replacing the plank head (propBuilder buildHorse) — ref: renaissance.jouster.red.png — ours: unit_renaissance.jouster_idle.png
2. [S] a horse body — blocker 1: brown barrel and chest built out ahead of the drape; caparison rounded to follow the barrel, not a square block — ref: renaissance.jouster.png — ours: unit_renaissance.jouster_idle.png
## Attempts (iter | gap | criterion | verdict)
328 | spiral-striped jousting lance [S] (4a390e5 + b5ed844) | b | approved
329 | yellow heater shield [S] (fa71e96 + 9cb619c) | b | approved
330 | couched lance [S] (fa74b0b) | c | approved
333 | level lance, yaw-only aim [S] (eea51ad) | c | approved
334 | heater held upright, torso-sized [S] (69073a5) | b | approved
334 | domed drape, crenellated tan hem [S] (73fd09c + ea5c8af) | a | approved
335 | plate rider, close helm, team plume [S] (909f200 + e5e55bd) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- LANCE is shared with secret.cavalry; _couchLance holds any "lance" level (COUCH). _holdHeater (HEATER_HOLD) stands "hshield" in the world.
- dressJouster (JOUSTER_HELM, JOUSTER_PLATE, JOUSTER_STEEL) dresses the rider; hat is "none". Critic 335 nits: plume reads as a narrow twisted spire (TABS: bushy tuft wider than the helm, curling back); steel still pale blue-white.
- buildHorse caparison: stadium rings, dome HORSE_DRAPE, hem HORSE_DRAPE_CREAM; wild_west.lasso's pinto shares buildHorse (no drape).
