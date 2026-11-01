# legacy.flag_bearer
Status: open   Audited: 457   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (2 since 457)
 2. jacket in unit_legacy.flag_bearer_idle, plain team body — TABS: a team military jacket with gold front trim (ref: legacy.flag_bearer.blue.png, card Appearance)
 3. cuffs in unit_legacy.flag_bearer_idle, bare forearms — TABS: white-and-gold striped cuffs (ref: legacy.flag_bearer.red.png)
 4. boots in unit_legacy.flag_bearer_idle, team feet — TABS: white boots with gold tops (ref: legacy.flag_bearer.blue.png)
b FAIL (2 since 457)
 3. grip in unit_legacy.flag_bearer_idle, one hand on the pole and the other raised — TABS: both fists on the upright pole (ref: legacy.flag_bearer.jpg)
 4. flag shape in unit_legacy.flag_bearer_idle, a wide landscape sheet standing out sideways from the pole top — TABS: a narrow tall pennant hanging down the pole's upper part (ref: legacy.flag_bearer.blue.png)
c FAIL (2 since 457)
 1. effect in unit_legacy.flag_bearer_release, the capture records a heal at 17 ms with nothing visible — TABS: boosts teammates' movement speed (ref: card Characteristics)
d FAIL (cost 500, hp 1.02x, dmg 0.00x, cd 3.00x; 457 stats; dmg 0: no blow, needs an [S])
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.flag_bearer.a jacket — blocker 2: team coat with gold placket and collar (trunkFrame) — ref: legacy.flag_bearer.blue.png — ours: _idle
2. [S] legacy.flag_bearer.a boots — blocker 4: white shin shells with a gold top ring — ref: legacy.flag_bearer.blue.png — ours: _idle
3. [S] legacy.flag_bearer.b grip — blocker 3: pole solved upright before the chest, fists stacked on it — ref: legacy.flag_bearer.jpg — ours: _idle
4. [S] legacy.flag_bearer.b pennant shape — blocker 4: CHARGE_FLAG narrow tall pennant hanging down the pole top — ref: legacy.flag_bearer.blue.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
457 | CHARGE_FLAG team flag, gold rim, emblem, gold ball; pole upright in the Healer's hold (3537400d, 35ba9eb6) | b | approved (struck 1, 2; added 4)
458 | POLE_GRIP.bearerPole off fist on the shaft (6864fd6b) | b | approved (none struck: 3 holds on upright)
459 | BEARER_RING ground torus 1.6 H, team colour (502c506c, shared) | c | approved (struck 2; added 3 ring colour)
459 | scale 1.34 -> 1.0, bulk .92 (f1844412) | a | approved (struck 5)
460 | FLAG_HELMET white crown, gold band and plate, team crest (53a654d8) | a | approved (struck 1)
460 | BEARER_AURA haste on allies in the ring, ring at their feet, no heal (f1ecb6fc, shared) | c | approved (none struck: not seen in the pair)
460 | [P] BEARER_RING orange-gold (eb73db0b) | c | approved (struck 3)
## Rejected (last 4)
## Notes (max 3 lines)
- c.1 evidence first (critic 460): capture.mjs must frame _release/_flight on a whole ally inside the ring (his aura ring, his stride) before another c gap.
- a.4 boots: the tank turret hides his shins in lineup_legacy (critic 460); a lineup slot that shows them, or the a approval can't be lineup-tested.
