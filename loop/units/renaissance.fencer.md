# renaissance.fencer
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 2. no hair, no moustache in unit_renaissance.fencer_idle — TABS: dark shoulder-length hair and a black curled moustache (ref: renaissance.fencer.blue.png)
 3. body in unit_renaissance.fencer_idle is a plain team tunic with skirt — TABS: team doublet with cream shoulder bands over puffed breeches striped team/cream (ref: renaissance.fencer.red.png)
 4. no boots in unit_renaissance.fencer_idle — TABS: brown knee-high cuffed boots (ref: renaissance.fencer.blue.png)
b PASS (330)
c FAIL (2 since 330)
 4. in unit_renaissance.fencer_release no lunge in the legs, rear leg not long — TABS: front foot well in, rear leg long behind (ref: renaissance.fencer.png)
d PASS (cost 150, hp 0.82x vs 0.88x, dmg 0.67x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c lunge legs — blocker 4: leg layer for the lunge (front knee bent forward, rear leg long behind, hip sunk) — ref: renaissance.fencer.png — ours: unit_renaissance.fencer_release.png
2. [S] a hair and moustache — blocker 2 — ref: renaissance.fencer.blue.png — ours: unit_renaissance.fencer_idle.png
## Attempts (iter | gap | criterion | verdict)
327 | cavalier hat [S] (fbe32ce + 0acead3) | a | approved
328 | no back slab [S] (68ad77a) | b | approved
330 | lunge [S] (841edec + f287302 + fa4c27d) | c | approved
330 | cup hilt [S] (d255f45) | b | approved
331 | point-first rapier [S] (d2b3a7b) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- _pointRapier (the last carry layer) stands the rapier point-first along his front in every living state (RAPIER_POINT.guard, level on the lunge); _turnRapier is gone.
- _animateLunge sets the leg joints, yet the release shot shows the legs near together: probe what overrides them before an [S] on blocker 4.
- Critic 330 nit on the hilt: cup small and cone-deep vs TABS's broad shallow bowl (RAPIER.cup, cupDeep).
