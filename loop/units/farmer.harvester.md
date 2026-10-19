# farmer.harvester
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 375)
 1. hat in unit_farmer.harvester_idle: pale tan wide straw brim, a dark navy blob behind the head — TABS: brown felt hat, pinched dented crown, drooping brim (ref: .red.png)
 2. braids in unit_farmer.harvester_idle: one brown braid at the side of the neck — TABS: two long braids down the front of the chest, each tied with a team band (ref: .red.png, .png)
b PASS (375)
c PASS (375)
d PASS (cost 500, hp 7.52x, dmg 1.25x, cd 1.80x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a braids — blocker 2: two long braids down the front of the chest, each tied with a team band — ref: .red.png — ours: unit_farmer.harvester_idle.png
2. [S] a hat — blocker 1: brown felt hat, pinched dented crown, drooping brim; remove the navy blob behind the head — ref: .red.png — ours: unit_farmer.harvester_idle.png
## Attempts (iter | gap | criterion | verdict)
340-348 | floppy hat + braids, low carry, pegs, plain snath, sweep, braids retry, collar/belt/patches [S] | a,b,c | approved
345 | low level sweep + fling [S] (8bd49db) | c | rejected
346 | braids down a curve to the chest [S] (909cf43) | a | rejected
375 | sweep carried through a step in the press (setState _afterSweep) [S] (3a94e9e) | c | approved
## Rejected (last 4)
- braids to the chest [S] [1] — 346: curved braid 2.8 heads long — overshot to the hip, band pale at the hip, lobes read as beads
- low level sweep + fling [S] [1] — 345: hit before the cut, fling not visible (fixed 346)
## Notes (max 3 lines)
- Scythe shared with spooky.reaper: harvester-only changes in unitFactory addSnathPegs. Sweep is _animateSweep; setState defers a step till it ends (375).
- 375: the press (moveTo -> Walking) had cancelled the sweep mid-cut while the sim's pending blow still landed. Check animator state at the hit tick first.
- 348 critic: collar near-white and wider than the chest (reads cape/bib).
