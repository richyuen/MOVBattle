# legacy.flag_bearer
Status: open   Audited: 457   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (1 since 457)
 1. headgear in unit_legacy.flag_bearer_idle, bald — TABS: a white-and-gold helmet with a team crest (ref: legacy.flag_bearer.red.png)
 2. jacket in unit_legacy.flag_bearer_idle, plain team body — TABS: a team military jacket with gold front trim (ref: legacy.flag_bearer.blue.png, card Appearance)
 3. cuffs in unit_legacy.flag_bearer_idle, bare forearms — TABS: white-and-gold striped cuffs (ref: legacy.flag_bearer.red.png)
 4. boots in unit_legacy.flag_bearer_idle, team feet — TABS: white boots with gold tops (ref: legacy.flag_bearer.blue.png)
b FAIL (2 since 457)
 3. grip in unit_legacy.flag_bearer_idle, one hand on the pole and the other raised — TABS: both fists on the upright pole (ref: legacy.flag_bearer.jpg)
 4. flag shape in unit_legacy.flag_bearer_idle, a wide landscape sheet standing out sideways from the pole top — TABS: a narrow tall pennant hanging down the pole's upper part (ref: legacy.flag_bearer.blue.png)
c FAIL (1 since 457)
 1. effect in unit_legacy.flag_bearer_release, the capture records a heal at 17 ms with nothing visible — TABS: boosts teammates' movement speed (ref: card Characteristics)
 3. ring colour in unit_legacy.flag_bearer_release, a pale team-blue ring — TABS: an orange-gold ring in both team renders (ref: legacy.flag_bearer.red.png, .blue.png; from 502c506c)
d FAIL (cost 500, hp 1.02x, dmg 0.00x, cd 3.00x; 457 stats; dmg 0: no blow, needs an [S])
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.flag_bearer.a helmet — blocker 1: FLAG_HELMET white dome, gold brow band, team crest — ref: legacy.flag_bearer.red.png — ours: _idle
2. [S] legacy.flag_bearer.c speed buff — blocker 1: a logged haste status on allies in the ring, replacing the heal — ref: card Characteristics — ours: _release
3. [P] legacy.flag_bearer.c ring colour — blocker 3: BEARER_RING per-unit colour, orange-gold (.95,.6,.2); fallout of 502c506c — ref: legacy.flag_bearer.blue.png — ours: _release
4. [S] legacy.flag_bearer.b grip — blocker 3: pole solved upright before the chest, fists stacked on it — ref: legacy.flag_bearer.jpg — ours: _idle
5. [S] legacy.flag_bearer.b pennant shape — blocker 4: CHARGE_FLAG narrow tall pennant hanging down the pole top — ref: legacy.flag_bearer.blue.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
457 | CHARGE_FLAG team flag, gold rim, emblem, gold ball; pole upright in the Healer's hold (3537400d, 35ba9eb6) | b | approved (struck 1, 2; added 4)
458 | POLE_GRIP.bearerPole off fist on the shaft (6864fd6b) | b | approved (none struck: 3 holds on upright)
459 | BEARER_RING ground torus 1.6 H, team colour (502c506c, shared) | c | approved (struck 2; added 3 ring colour)
459 | scale 1.34 -> 1.0, bulk .92 (f1844412) | a | approved (struck 5)
## Rejected (last 4)
## Notes (max 3 lines)
