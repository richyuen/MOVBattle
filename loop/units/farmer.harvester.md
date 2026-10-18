# farmer.harvester
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 339)
 3. tunic in unit_farmer.harvester_idle plain — TABS: beige collar, rope belt, light team patches (ref: farmer.harvester.red.png)
b PASS (344)
c PASS (346)
d PASS (cost 500, hp 7.52x, dmg 1.25x, cd 1.80x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a tunic — blocker 3: beige shoulder collar, rope belt with hanging ends, two light team patches with twine stitches (unitFactory harvester dress) — ref: farmer.harvester.red.png — ours: unit_farmer.harvester_idle.png
## Attempts (iter | gap | criterion | verdict)
340 | soft floppy hat and side braids (FLOPPY) [S] (e4fd698) | a | approved
342 | low two-handed scythe carry, pegs (SCYTHE_LOW) [S] (0c87e29) | b | approved
343 | pegs on the bow, colours (SNATH_PEG.sink) [S] (0c7f22a) | b | approved
344 | plain snath, grip wraps off [S] (651d95a) | b | approved
345 | low level sweep + fling (SCYTHE_SWEEP, SCYTHE_FLING) [S] (8bd49db +c11f873) | c | rejected
346 | level sweep held through the cut + fling [S] (1e4d069) | c | approved
346 | braids down a curve to the chest, bands [S] (909cf43) | a | rejected
347 | braids retry: core plait to mid-chest, dark band at the end (FLOPPY.core/.overlap) [S] (514b71b) | a | approved
## Rejected (last 4)
- braids to the chest [S] [1] — 346: curved braid 2.8 heads long — overshot to the hip, band pale at the hip, lobes read as beads
- low level sweep + fling [S] [1] — 345: hit before the cut, fling not visible (fixed 346)
## Notes (max 3 lines)
- Scythe prop shared with spooky.reaper: harvester-only changes go in unitFactory addSnathPegs. Sweep is _animateSweep (lowScythe).
- 346 critic: crescent stands upright at release and turns up over his hat in the windup (TABS lies flat), polish only.
- 347 critic: in the lineup only the near braid reads, the far one is hidden behind the head (minor).
