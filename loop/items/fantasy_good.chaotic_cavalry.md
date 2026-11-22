# fantasy_good.chaotic_cavalry
Status: open   Audited: 623 (AUDIT x2), 624 (CONFIRM: passed -; failed b)   Done: -
## Verdicts
a PASS (624 judge)
b FAIL (1 since 623; list from AUDIT 623; CONFIRM 624 failed b, 1 and 2 unseen in _army): 1. Two Da Vinci Tanks in stage_fantasy_good.chaotic_cavalry_army.png are parked hull to hull at x27.5, z10/14 — TABS: the two tanks sit on opposite ends of a circle around the player (ref: card Survey "two Da Vinci Tanks on opposite ends") 2. Four Jousters in stage_fantasy_good.chaotic_cavalry_army.png ride in one row in front of the tanks (x21, z6..18) — TABS: two Jousters flank each tank, one on either side (ref: card Survey "two on either side of each tank") | s3. the army as one cluster by the north-east facades in _field (struck 624)
c PASS (624 judge)
## Ranked gaps
1. evidence (step 3, first) — blockers 1, 2: _army sees only the west parapet's inside (the default pose, alpha PI radius ~36 round (-12,2), stands behind it): give the stage its own pose in capture-world.mjs stageScene on the plaza (e.g. target (-12,1,2), radius ~22, beta ~1.0, alpha kept over the plaza) framing both tanks and their Jousters — ours: _army
## Attempts (iter | gap | criterion | verdict)
624 | 8af831d3 Tanks at N/S ends of a r12 circle round (-12,2), facing in; stage zone (-12,2) 28x30 | b1 | APPROVE (no strike: unseen in _army)
624 | 9652eeb2 Jousters on the circle 30 deg either side of each Tank, turned in | b2 | APPROVE (struck 3)
## Rejected (last 4)
## Notes (max 3 lines)
- Map renaissance. Critic and CONFIRM 624 both read the ring correct in _field; only the _army camera blocks the strike.
