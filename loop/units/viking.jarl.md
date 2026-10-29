# viking.jarl
Status: open   Audited: 391, 396, 400, 401, 402, 403 (re-audit a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 403; list rewritten by the 403 re-audit, struck 1 at 403, 3 at 404)
 2. chest in unit_viking.jarl_idle - TABS: a shirtless team-skin chest between the two pelt curtains, a leather belt at the waist (ref: .red.png, .jpg); ours: a flat brown mantle box over the chest and a blue tunic whose hem flares as a skirt below it
 4. fur calf cuffs in unit_viking.jarl_idle - TABS: big cream fur cuffs over brown boots under puffy pants (ref: .red.png); ours: slim blue legs straight to plain blue boots
  (struck 1 at 403: the beard, now a bib down the chest into a red-tied plait; struck 3 at 404: maroon forearm wraps with fur at the elbow)
b PASS (392)
c PASS (396)
d PASS (cost 1500, hp 13.81x, dmg 2.50x, cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a fur calf cuffs - blocker 4: add brawlerLegs(...) to the jarl branch in unitFactory, as the ice archer did in db12da9 - ref: .red.png - ours: unit_viking.jarl_idle.png
2. [S] a chest - blocker 2: replace the mantle box and tunic skirt with a bare team-skin chest between the curtains and a leather belt with a round buckle - ref: .red.png - ours: unit_viking.jarl_idle.png
## Attempts (iter | gap | criterion | verdict)
392-396 | Jarl Axe (b PASS); bear hood + drape (393); bear pelt retry (394 rejected); his own chop (c PASS) | a,b,c | approved
400 | [R] bear-head hood rebuilt from the skull down (f80dd04) | a | approved (struck 1; added 5)
401 | [R/S] pelt curtains to the hips + rounded mantle + chest strips (fd578de + 9c1b402) | a | approved (struck 5)
402 | JARL_BEARD: narrow jaw between the curtains, bib, moustache, .66 H plait with three ties (03c2cf1) | a | approved (blocker 2 stands)
403 | JARL_BEARD_RUN: torso-hung bib in front of the mantle into a plait with two red ties (76b6c7d) | a | approved (struck 1)
404 | JARL_WRAPS: maroon limbShell wraps with 3 dark bands on each forearm, a lit tan fur roll at the elbow (9e3df06) | a | approved (struck 3)
## Rejected (last 4)
- bear pelt retry [S] [2] - 394: a rounded fur skull with googly eyes on its front, curtains, a rounded shoulder mass - the near curtain stood in front of his face and hid the eyes
## Notes (max 3 lines)
- 404 critic (not a blocker): the elbow fur reads near-white cream, TABS's fringe is tan.
- 403 evidence (88e3f00): lineup_viking stands him clear of the longship's hull; 403 critic: the bib is a lighter tan than the jaw chunk (shade only).
- 401: JARL_PELT curtainFoot -1.1 + two torso `jarlPeltChest` strips and a rounded `jarlPeltMantle`. 396: CHOP_JARL. Probe: probe_local.mjs.
