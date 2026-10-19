# renaissance.jouster
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 368)
 3. helm crest in unit_renaissance.jouster_idle: a twisted spiral horn — TABS: a fluffy team feather plume on the helm and the chanfron (ref: .png, card "colored feathers")
b FAIL (0 since 368)
 1. lance in unit_renaissance.jouster_idle: white, sparse thin team ribbon — TABS: dense diagonal candy stripes, team and tan, whole length (ref: .png, card)
c PASS (369)
d PASS (cost 1000, hp 8.28x vs 8.32x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b candy-stripe lance — blocker 1: dense diagonal team/tan stripes the whole length — ref: .png — ours: unit_renaissance.jouster_idle.png
2. [S] a feather plume — blocker 3: fluffy faceted team plume on the helm (no spiral horn) and on the chanfron — ref: .png — ours: unit_renaissance.jouster_idle.png
## Attempts (iter | gap | criterion | verdict)
328-337 | lance, heater, couch, plate rider, chanfron, caparison [S] | a,b,c | approved
368 | arched neck, low head, front eyes, chestnut coat (BARDED_NECK) [S] (f271f4d) | a | approved
369 | canter charge through the man, lance on contact, trample; hgait_* leg pivots, 3-beat canter (JOUSTER_CHARGE, HORSE_GAIT) [S] (5ac2a1e) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- LANCE shared with secret.cavalry; _couchLance (COUCH). _holdHeater. dressJouster. buildHorse shared with wild_west.lasso's pinto (barded changes in !pinto; hgait_* pivots barded only).
- Charge: simulationSystem JOUSTER_CHARGE on the mammoth/knight ChargeSpec path, _tryAttack on contact; setCharging speeds HORSE_GAIT.
- Critic 369 minor: lance rides at horse-head height over a short foe (TABS chest); no visible trample puff. 368: neck elbow, small box muzzle.
