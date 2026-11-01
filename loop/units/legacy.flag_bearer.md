# legacy.flag_bearer
Status: open   Audited: 457, 461 (RE-AUDIT c, lineup), 462 (lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (3 since 457)
 3. cuffs in unit_legacy.flag_bearer_idle, bare forearms — TABS: white-and-gold striped cuffs (ref: legacy.flag_bearer.red.png)
 4. boots in unit_legacy.flag_bearer_idle, team feet — TABS: white boots with gold tops (ref: legacy.flag_bearer.blue.png)
b FAIL (2 since 457)
 3. grip in unit_legacy.flag_bearer_idle, one hand on the pole and the other raised — TABS: both fists on the upright pole (ref: legacy.flag_bearer.jpg)
 4. flag shape in unit_legacy.flag_bearer_idle, a wide landscape sheet standing out sideways from the pole top — TABS: a narrow tall pennant hanging down the pole's upper part (ref: legacy.flag_bearer.blue.png)
c PASS (462: the hasted ally wears his own ring inside the bearer's; BEARER_RING radius 2.2)
d FAIL (cost 500, hp 1.02x, dmg 0.00x, cd 3.00x; 457 stats; dmg 0: no blow, needs an [S])
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.flag_bearer.b flag shape — blocker 4: CHARGE_FLAG narrow tall pennant hanging down the pole top — ref: legacy.flag_bearer.blue.png — ours: _idle
2. [S] legacy.flag_bearer.a cuffs — blocker 3: white limbShell cuffs with a gold band (BANNER_CUFFS cut) — ref: legacy.flag_bearer.red.png — ours: _idle
3. [S] legacy.flag_bearer.a boots — blocker 4: white shin shells with a gold top ring — ref: legacy.flag_bearer.blue.png — ours: _idle
4. [S] legacy.flag_bearer.b grip — blocker 3: pole upright before the chest, fists stacked on it — ref: legacy.flag_bearer.jpg — ours: _idle
## Attempts (iter | gap | criterion | verdict)
457-458 | CHARGE_FLAG + upright pole (3537400d, 35ba9eb6); POLE_GRIP.bearerPole (6864fd6b) | b | approved (struck 1, 2; added 4)
459-461 | BEARER_RING (502c506c); scale 1.0 (f1844412); FLAG_HELMET (53a654d8); FLAG_JACKET (a397cd1f) | a, c | approved (a struck 1, 2, 5; c struck 2)
460 | BEARER_AURA haste (f1ecb6fc, shared); [P] ring orange-gold (eb73db0b) | c | approved (struck 3)
461 | follow-ups 0c, 0d on f1ecb6fc (ring lifted, ring material) | c | dropped (reverted a36b3245, 3cce99f0)
462 | [P] BEARER_RING radius 1.6 -> 2.2, root exception (d9f8f8c5) | c | approved (struck 1, c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- BEARER_RING radius has had its one root-exception move: no further [P] on that row.
- 462 critic (minor): the ally's ring reads pale cream, TABS orange.
