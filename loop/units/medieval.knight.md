# medieval.knight
Status: done   Audited: 355   Done: 359
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (359)
b PASS (356)
c PASS (351)
d PASS (cost 650, hp 7.65x, dmg 1.00x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
(none)
## Attempts (iter | gap | criterion | verdict)
351 | Knight Charge dash, battered aside on contact (KNIGHT_CHARGE) [S] (b806f45) | c | approved
353 | open armet (ARMET) [S] (58cfa04 +4459ae6) | a | approved
355 | sword held out (arming_sword, ARMING_OUT) [S] (1574c11) | b | approved
356 | stray chest hilt: tabard cross left off (unitFactory tabardCross) [S] (cc7912d) | b | approved
357 | cuirass (knightCuirass, KNIGHT_PLATE, KNIGHT_FAULD) [S] (4604755) | a | approved
358 | cape: team medievalCape to the knee (KNIGHT_CAPE) [S] (929b00a +d7037c7) | a | approved
359 | plate legs: cuisses, greaves, cops, sabatons (knightLegs, KNIGHT_LEGS) [S] (3dd532f) | a | approved
359 | cape cut: top at the shoulder line, wrap 1.75, no flaps (CapeCut, KNIGHT_CAPE_CUT) [S] (d2850fe) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- The dark navy "wedge" behind his helm in knight_idle is a horizon boulder, not dress (checked 359 with the cape removed).
- critic 359: knee cops large and round (minor). critic 357: cuirass boxy, a skin wider than the frame.
