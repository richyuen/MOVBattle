# viking.jarl
Status: open   Audited: 391, 396, 400, 401, 402   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 391; 1 rejected [S], 1 approved [R] since 391; struck 5 at 401)
 2. beard in _idle/_windup - TABS: a large brown braided beard tied at the end (ref: .jpg, .red.png); ours: the thin brown cone nose, no beard
 3. chest/arms in _idle - TABS: a shirtless chest with maroon arm wraps and fur wrist cuffs (ref: .jpg, .red.png); ours: a blue tunic with a V panel and bare blue forearms
 4. legs in _flight - TABS: puffy team pants with big cream fur calf cuffs and brown boots (ref: .red.png); ours: slim blue pants and plain blue boots
  (struck 1 at 400: the bear-head hood; struck 5 at 401: the pelt drape - curtains to the hip line, one rounded mantle)
b PASS (392)
c PASS (396)
d PASS (cost 1500, hp 13.81x, dmg 2.50x, cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a legs - blocker 4: puffy team pants with cream fur calf cuffs over brown boots (the Brawler's leg kit cut, vikingDress jarlLegs) - ref: .red.png - ours: unit_viking.jarl_flight.png
2. [S] a beard - blocker 2: a jaw-wide beard (jaw x to the curtains' outer faces) with the bib and plait stood proud of the pelt's chest strips so the plait hangs in front of them between the hands - ref: .jpg - ours: unit_viking.jarl_idle.png
## Attempts (iter | gap | criterion | verdict)
392 | Jarl Axe: long haft, dark bearded crescent, bronze collar (0b6bed2 + 92c5442) | b | approved (b PASS)
393 | bear-head hood and fur drape, horned helm off (JARL_PELT) (b7b4463 + 1df50c9) | a | approved (no strike: a.1 stands)
394 | bear pelt retry: rounded skull, eyes on its front, curtains (reverted 1ec0c3a) | a | rejected
396 | his own chop: lands .42 m under the crown, trunk pitched (6b98556) | c | approved (c PASS)
400 | [R] bear-head hood rebuilt from the skull down (f80dd04) | a | approved (struck 1; added 5)
401 | [R/S] pelt curtains to the hips + rounded mantle + chest strips (fd578de + 9c1b402) | a | approved (struck 5)
402 | JARL_BEARD: narrow jaw between the curtains, bib, moustache, .66 H plait with three ties (03c2cf1) | a | approved (blocker 2 stands: "no beard" cleared, not "large, braided, tied")
## Rejected (last 4)
- bear pelt retry [S] [2] - 394: a rounded fur skull with googly eyes on its front, curtains, a rounded shoulder mass - the near curtain stood in front of his face and hid the eyes; the snout read as a pale block off to one side
## Notes (max 3 lines)
- 402 critic: the beard is a short chin mass ending at the collar; the plait does not read (the hands cross the chest). lineup_viking hides him behind the longship's stern, so blocker 2 could not be lineup-tested (held, not struck): an evidence commit re-aiming lineup_viking with the jarl clear of the hull comes first next iteration.
- 401: JARL_PELT curtainFoot -1.1 + two torso `jarlPeltChest` strips (W .23 out, .54D proud, 3 tufts) and a rounded `jarlPeltMantle`; head curtains hang at the head's z.
- 396: CHOP_JARL (below .42, pitch .52, step -.56). Probe: probe_local.mjs.
