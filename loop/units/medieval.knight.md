# medieval.knight
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 355)
 2. legs in unit_medieval.knight_idle faceted team — TABS: grey plated cuisses and greaves, grey sabatons (ref: medieval.knight.red.png, .png)
 3. cape (half cleared 358: hangs to the knee in knight_windup) in unit_medieval.knight_idle a dark navy wedge (the cape's collar/inner face) rises behind the helm — TABS: cape starts at the shoulder line, nothing above it (ref: medieval.knight.png)
b PASS (356)
c PASS (351)
d PASS (cost 650, hp 7.65x, dmg 1.00x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a plate legs — blocker 2: steel cuisse/greave shells with knee cops and grey sabatons (as squireLegs) — ref: medieval.knight.red.png — ours: unit_medieval.knight_idle.png
2. [S] a cape collar — blocker 3: medievalCape knight variant, no collar flap, top at the shoulder line, front edges over the shoulders so it reads beside the arms — ref: medieval.knight.png — ours: unit_medieval.knight_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | Knight Charge dash, battered aside on contact (KNIGHT_CHARGE) [S] (b806f45) | c | approved
353 | open armet (ARMET) [S] (58cfa04 +4459ae6) | a | approved
355 | sword held out (arming_sword, ARMING_OUT) [S] (1574c11) | b | approved
356 | stray chest hilt: tabard cross left off (unitFactory tabardCross) [S] (cc7912d) | b | approved
357 | cuirass: steel shells of torso+yoke, steel fauld with lames (knightCuirass, KNIGHT_PLATE, KNIGHT_FAULD) [S] (4604755) | a | approved
358 | cape: team medievalCape off the cuirass to the knee, "cape" special dropped (KNIGHT_CAPE) [S] (929b00a +d7037c7) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 358: cape a stiff flat board standing off the back side-on (TABS drapes close). critic 357: cuirass boxy, a skin wider than the frame.
- He keeps the tabard block's mail arms. medievalCape takes skin/drop/hemWide/glow params (358).
