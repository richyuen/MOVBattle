# wild_west.lasso
Status: open   Audited: 444, 454 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 454; CONFIRM list)
 1. horse legs in lineup_wild_west (centre-right horse): four wide flat-sided box pillars as thick as the horse's head, the body on a table-like block — TABS: slim tapering legs with small dark hooves under a deep rounded barrel (ref: reference/units/wild_west.lasso.jpg; reference/factions/wild_west.jpg)
 2. rider mustache in unit_wild_west.lasso_idle: plain face under the eyes — TABS: a big dark curled "fancy mustache" right under the eyes (ref: reference/units/wild_west.lasso.red.png; card Appearance)
 3. rider shirt in lineup_wild_west (red rider) renders olive-brown, not red; the gunslinger's torso is red-mauve — TABS: a team-red shirt (ref: reference/units/wild_west.lasso.red.png; card Appearance "dark team colored shirt")
b PASS (451: big open tan loop held up over the fist, small coils in the fist; LASSO_RAISE; CONFIRM 454)
c PASS (445: rope thrown onto the man, hauled in low under the horse and run over; LASSO_DRAG; CONFIRM 454)
d PASS (cost 740, hp 6.77x; dmg/cd no wiki; 454 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a horse legs - blocker 1: slim tapering pinto legs with dark hooves, deeper rounded barrel - ref: lasso.jpg - ours: lineup_wild_west (CONFIRM 454)
2. [S] a mustache - blocker 2: MINER_MOUSTACHE-style dark curled moustache on the rider - ref: red.png - ours: unit_wild_west.lasso_idle (CONFIRM 454)
3. [S] a shirt - blocker 3: team-cloth shirt in place of the wildwest_leather trunk - ref: red.png - ours: lineup_wild_west (CONFIRM 454)
## Attempts (iter | gap | criterion | verdict)
445 | LASSO_DRAG rope + loop to the drawn chest, haul, trample (cbd214cd, 7db56d0f) | c | approved (c PASS)
446-447 | PINTO_HEAD sphere skull, muzzle, leaf ears, blaze (2a2551a9, 1db23f8a) | a | approved (struck 4 by lineup)
446 | LASSO_COIL in the fist on the whip node (39f31f9f, 467a8f23) | b | approved
448 | FLAT_HAT on the rider (fac00c2d) | a | approved (struck 3)
451 | LASSO_RAISE coil stood in the world, out .45 back .15 face -.6 (363add1b) | b | approved (b PASS)
453 | pinto coat + patches cloth, out of the glow layer, (1,.3,.06) / (.9,.55,.34) (37b8faec) | a | approved (struck 2)
454 | PINTO_HEAD round faceted skull, PINTO_BEAD white bead eyes (641323cc) | a | approved (struck 1; a PASS; CONFIRM passed b, c, failed a)
## Rejected (last 4)
## Notes (max 3 lines)
- A toppled man is drawn away from his root: the rope aims at man.body.torso's world position, not root + height.
- 453 probe: the coat read golden in the glow layer's bloom; codes past (1,.5,.16) / (1,.76,.54) wash to yellow / white.
- 454 critic: the ears are shorter than the reference's tall leaf ears (not a blocker).
