# renaissance.fencer
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 2. no hair, no moustache in unit_renaissance.fencer_idle — TABS: dark shoulder-length hair and a black curled moustache (ref: renaissance.fencer.blue.png)
 3. body in unit_renaissance.fencer_idle is a plain team tunic with skirt — TABS: team doublet with cream shoulder bands over puffed breeches striped team/cream (ref: renaissance.fencer.red.png)
 4. no boots in unit_renaissance.fencer_idle — TABS: brown knee-high cuffed boots (ref: renaissance.fencer.blue.png)
b PASS (330)
c FAIL (1 since 330)
 2. in unit_renaissance.fencer_windup the rapier lies back along the forearm, point behind him — TABS: guard with the point toward the foe (ref: renaissance.fencer.png)
 3. in unit_renaissance.fencer_flight the blade stands straight up on a raised arm — TABS: arm and blade stay level out on the lunge, then a step back (ref: card Characteristics)
 4. in unit_renaissance.fencer_release no lunge in the legs, rear leg not long — TABS: front foot well in, rear leg long behind (ref: renaissance.fencer.png)
d PASS (cost 150, hp 0.82x vs 0.88x, dmg 0.67x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c point-first rapier — blocker 2: rapier rest point-forward out of the fist so guard, lunge and hold lead with the point, arm level through LUNGE.hold — ref: renaissance.fencer.png — ours: unit_renaissance.fencer_windup.png
2. [S] a hair and moustache — blocker 2 — ref: renaissance.fencer.blue.png — ours: unit_renaissance.fencer_idle.png
## Attempts (iter | gap | criterion | verdict)
327 | cavalier hat [S] (fbe32ce + 0acead3) | a | approved
328 | no back slab [S] (68ad77a) | b | approved
330 | lunge [S] (841edec + f287302 + fa4c27d) | c | approved
330 | cup hilt [S] (d255f45) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- The rapier's rest runs blade-up the forearm (hand +y); _turnRapier half-turns it point-first only in the attack. Probe 330: in a 1v1 the squire's blow lands on the hit frame (flinch); _lungeOut carries it through.
- Critic 330 nit on the hilt: cup small and cone-deep vs TABS's broad shallow bowl (RAPIER.cup, cupDeep).
