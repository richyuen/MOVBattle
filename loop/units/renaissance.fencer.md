# renaissance.fencer
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 327)
 2. no hair, no moustache in unit_renaissance.fencer_idle — TABS: dark shoulder-length hair and a black curled moustache (ref: renaissance.fencer.blue.png)
 3. breeches in unit_renaissance.fencer_idle read as one pleated skirt with thin grey stripes — TABS: two puffed thigh rolls paned team/cream, panes about as wide as the gaps (ref: renaissance.fencer.red.png)
 4. no boots in unit_renaissance.fencer_idle — TABS: brown knee-high cuffed boots (ref: renaissance.fencer.blue.png)
b PASS (330)
c PASS (333)
d PASS (cost 150, hp 0.82x vs 0.88x, dmg 0.67x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hair and moustache — blocker 2: dark shoulder-length hair chunk under the hat brim and a black curled moustache — ref: renaissance.fencer.blue.png — ours: unit_renaissance.fencer_idle.png
2. [S] a boots — blocker 4: brown knee-high cuffed boots over the shins — ref: renaissance.fencer.blue.png — ours: unit_renaissance.fencer_idle.png
3. [P] a puffed panes (fallout of 334 [S] c58861e) — blocker 3: FENCER_DRESS.puff 0.82 -> ~1.1, wider panes, self-lit cream — NEXT shot: lineup_renaissance.png (fencer's breeches)
## Attempts (iter | gap | criterion | verdict)
327 | cavalier hat [S] (fbe32ce + 0acead3) | a | approved
328 | no back slab [S] (68ad77a) | b | approved
330 | lunge [S] (841edec + f287302 + fa4c27d) | c | approved
330 | cup hilt [S] (d255f45) | b | approved
331 | point-first rapier [S] (d2b3a7b) | c | approved
333 | lunge legs [S] (90d850a) | c | approved
334 | doublet, waist tabs, shoulder bands, paned breeches [S] (c58861e) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- _lungeLegs (after _pointRapier) is the last leg layer; _pointRapier stands the rapier point-first. Critic 333 nit: front thigh ~45 deg (LUNGE.front).
- dressFencer (FENCER_DRESS, FENCER_CREAM): panes are flattened cylinders round each upper-leg mesh on a team core; getCloth cream renders grey (needs glow).
