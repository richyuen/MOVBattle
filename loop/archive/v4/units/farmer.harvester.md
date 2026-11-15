# farmer.harvester
Status: done   Audited: 375 (re)   Done: 377
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (377)
b PASS (375)
c PASS (375)
d PASS (cost 500, hp 7.52x, dmg 1.25x, cd 1.80x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
340-348 | floppy hat + braids, low carry, pegs, plain snath, sweep, braids retry, collar/belt/patches [S] | a,b,c | approved
345 | low level sweep + fling [S] (8bd49db) | c | rejected
346 | braids down a curve to the chest [S] (909cf43) | a | rejected
375 | sweep carried through a step in the press (setState _afterSweep) [S] (3a94e9e) | c | approved
376 | braids hung from the torso down the chest, team bands (farmerDress CHEST_BRAID) [S] (ca0eef1) | a | approved
377 | brown felt hat: creased pinched crown, brim drooping front/sides (FELT_HAT) [S] (84980cf) | a | approved
## Rejected (last 4)
- braids to the chest [S] [1] — 346: curved braid 2.8 heads long — overshot to the hip, band pale at the hip, lobes read as beads
- low level sweep + fling [S] [1] — 345: hit before the cut, fling not visible (fixed 346)
## Notes (max 3 lines)
- 377: the navy blob was the old double-sided bell brim; FELT_HAT is closed lathes.
- Scythe shared with spooky.reaper: harvester-only changes in unitFactory addSnathPegs. Sweep is _animateSweep; setState defers a step till it ends (375).
- The sun_hat holds no braids since 376 (farmerDress harvesterBraids on the torso).
