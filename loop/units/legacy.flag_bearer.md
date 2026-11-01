# legacy.flag_bearer
Status: open   Audited: 457, 461 (RE-AUDIT c, lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (3 since 457)
 3. cuffs in unit_legacy.flag_bearer_idle, bare forearms — TABS: white-and-gold striped cuffs (ref: legacy.flag_bearer.red.png)
 4. boots in unit_legacy.flag_bearer_idle, team feet — TABS: white boots with gold tops (ref: legacy.flag_bearer.blue.png)
b FAIL (2 since 457)
 3. grip in unit_legacy.flag_bearer_idle, one hand on the pole and the other raised — TABS: both fists on the upright pole (ref: legacy.flag_bearer.jpg)
 4. flag shape in unit_legacy.flag_bearer_idle, a wide landscape sheet standing out sideways from the pole top — TABS: a narrow tall pennant hanging down the pole's upper part (ref: legacy.flag_bearer.blue.png)
c FAIL (0 since 461)
 1. aura in unit_legacy.flag_bearer_release, the capture records haste at 17 ms but the ally knight standing on the bearer's ring wears no ring of his own at his feet — TABS: each buffed ally is marked by a coloured ring round its feet, the same as the Banner Bearer's (ref: card Appearance, legacy.banner_bearer.jpg)
d FAIL (cost 500, hp 1.02x, dmg 0.00x, cd 3.00x; 457 stats; dmg 0: no blow, needs an [S])
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.flag_bearer.c aura — blocker 1: BEARER_AURA ring a visible self-lit orange torus over the grass at each hasted ally's feet (the ring mesh must exist) — ref: legacy.banner_bearer.jpg — ours: _release
2. [S] legacy.flag_bearer.a cuffs — blocker 3: white limbShell cuffs with a gold band (BANNER_CUFFS cut) — ref: legacy.flag_bearer.red.png — ours: _idle
3. [S] legacy.flag_bearer.b flag shape — blocker 4: CHARGE_FLAG narrow tall pennant hanging down the pole top — ref: legacy.flag_bearer.blue.png — ours: _idle
4. [S] legacy.flag_bearer.a boots — blocker 4: white shin shells with a gold top ring — ref: legacy.flag_bearer.blue.png — ours: _idle
5. [S] legacy.flag_bearer.b grip — blocker 3: pole upright before the chest, fists stacked on it — ref: legacy.flag_bearer.jpg — ours: _idle
## Attempts (iter | gap | criterion | verdict)
457-458 | CHARGE_FLAG + upright pole (3537400d, 35ba9eb6); POLE_GRIP.bearerPole (6864fd6b) | b | approved (struck 1, 2; added 4)
459 | BEARER_RING ground torus (502c506c); scale 1.0 (f1844412) | c, a | approved (c struck 2; a struck 5)
460 | FLAG_HELMET (53a654d8) | a | approved (struck 1)
460 | BEARER_AURA haste (f1ecb6fc, shared); [P] ring orange-gold (eb73db0b) | c | approved (struck 3)
461 | FLAG_JACKET team coat, gold placket and collar (a397cd1f) | a | approved (struck 2)
461 | follow-ups 0c (ring lifted .14 H) and 0d (ring material from legacyDress) on f1ecb6fc | c | dropped (still no ring on the ally; reverted a36b3245, 3cce99f0)
## Rejected (last 4)
## Notes (max 3 lines)
- No aura ring on the ally, lifted or not: probe whether applyAura runs on him before another c gap.
- lineup_legacy (461) crops him off the right end of the near rank: his a blockers stand until a lineup frames him.
