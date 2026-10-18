# farmer.harvester
Status: done   Audited: 339   Done: 348
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (348)
b PASS (344)
c PASS (346)
d PASS (cost 500, hp 7.52x, dmg 1.25x, cd 1.80x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
340 | soft floppy hat and side braids (FLOPPY) [S] (e4fd698) | a | approved
342 | low two-handed scythe carry, pegs (SCYTHE_LOW) [S] (0c87e29) | b | approved
343 | pegs on the bow, colours (SNATH_PEG.sink) [S] (0c7f22a) | b | approved
344 | plain snath, grip wraps off [S] (651d95a) | b | approved
345 | low level sweep + fling (SCYTHE_SWEEP, SCYTHE_FLING) [S] (8bd49db +c11f873) | c | rejected
346 | level sweep held through the cut + fling [S] (1e4d069) | c | approved
346 | braids down a curve to the chest, bands [S] (909cf43) | a | rejected
347 | braids retry: core plait to mid-chest, dark band at the end (FLOPPY.core/.overlap) [S] (514b71b) | a | approved
348 | beige collar, rope belt, two stitched patches (HARVESTER_TRIM) [S] (5824c3f +e00d256) | a | approved
## Rejected (last 4)
- braids to the chest [S] [1] — 346: curved braid 2.8 heads long — overshot to the hip, band pale at the hip, lobes read as beads
- low level sweep + fling [S] [1] — 345: hit before the cut, fling not visible (fixed 346)
## Notes (max 3 lines)
- Scythe prop shared with spooky.reaper: harvester-only changes go in unitFactory addSnathPegs. Sweep is _animateSweep (lowScythe).
- 348 critic: collar near-white and wider than the chest (reads cape/bib); patches show only in the lineup.
