# renaissance.da_vinci_tank
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 4. tank in lineup_renaissance is about three men wide — TABS: roof spans about four to five men, its peak above the jouster's rider (ref: reference/factions/renaissance.jpg)
b PASS (331)
c PASS (330)
d PASS (cost 4000, hp 62.02x, dmg 0.58x, cd 1.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. evidence first: lineup_renaissance cuts the tank at the right edge behind the jouster (critic 332) — frame the whole tank beside the men (capture.mjs lineup), then:
2. [P] a scale (fallout of 331 roof [S] e4c2a2f) — unitVisuals.ts renaissance.da_vinci_tank proportions.scale ~1.4 (new row, uniform), DAVINCI_ROOF/DAVINCI_CANNON untouched — NEXT shot: lineup_renaissance.png
## Attempts (iter | gap | criterion | verdict)
329 | cannonballs that shatter on impact [S] (495e7d1) | c | approved
330 | spinning drum [S] (7b89341) | c | approved
331 | two-tier plank roof over a dark drum [S] (e4c2a2f) | a | approved
331 | 16 thick octagonal barrels [S] (da39ed0) | b | approved
332 | scale: radii x1.4, heights kept [P] (caea7ba) | a | rejected
## Rejected (last 4)
- scale [P] [1] — 332: DAVINCI_ROOF radii and DAVINCI_CANNON.out x1.4 — ledger reversal of 331 rows; widening without height flattened the roof to ~15 deg
## Notes (max 3 lines)
- Roof, drum, barrels and muzzles ride "davinci_spin" (buildDaVinciRoof, DAVINCI_ROOF, DAVINCI_CANNON); RuntimeUnit._spinDrum turns it. Base plate and wheels stay on root.
- Critic 331 nits: lower tier a little steep, cap pointed; muzzle rings flared (ringWide). Do not touch these rows before 351 as [P] (reversal).
- makeBodyMetrics drives targeting: a uniform scale should be checked against metrics and the sim's reach.
