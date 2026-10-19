# medieval.knight
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 355)
 2. legs in unit_medieval.knight_idle faceted team — TABS: grey plated cuisses and greaves, grey sabatons (ref: medieval.knight.red.png, .png)
 3. cape in unit_medieval.knight_idle a dark navy wedge rising behind the helm like a hood, nothing down the back — TABS: team cape off the shoulders, hanging to the knees (ref: medieval.knight.png)
b PASS (356)
c PASS (351)
d PASS (cost 650, hp 7.65x, dmg 1.00x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a cape — blocker 3: team cape off the shoulder backs to the knees (reuse medievalDress medievalCape, team colour; drop the "cape" special) — ref: medieval.knight.png — ours: unit_medieval.knight_idle.png
2. [S] a legs — blocker 2: grey cuisse/greave shells and sabatons (model on squireLegs) — ref: medieval.knight.red.png — ours: unit_medieval.knight_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | Knight Charge dash, battered aside on contact (KNIGHT_CHARGE) [S] (b806f45) | c | approved
353 | open armet: grey dome, plates, bevor, face open, team barred visor frame (ARMET) [S] (58cfa04 +4459ae6) | a | approved
355 | sword held out: arming sword out from the side, blade stood up, grey hilt (arming_sword, ARMING_OUT) [S] (1574c11) | b | approved
356 | stray chest hilt: tabard cream cross left off the knight (unitFactory tabardCross) [S] (cc7912d) | b | approved
357 | cuirass: steel shells of torso+yoke, steel fauld with lames; tabard, belt, cloth skirt cut (knightCuirass, KNIGHT_PLATE, KNIGHT_FAULD) [S] (4604755) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 357: cuirass boxy, a skin wider than the frame (minor). critic 355: blade broad and stubby, held upright (TABS slim, angled out).
- critic 351: dash reads as a brisk run. He keeps the tabard block's mail arms; the "cape" special (shared propBuilder box) is the navy wedge.
