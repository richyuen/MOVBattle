# renaissance.da_vinci_tank
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 327)
 4. tank in lineup_renaissance (337: 1.9x, peak above the halberdier, ~1.5 men, but only level with the jouster rider's helm) — TABS: tall conical roof, peak above the jouster's rider, the tank about 1.5 men tall (ref: reference/factions/renaissance.jpg)
b PASS (331)
c PASS (330)
d PASS (cost 4000, hp 62.02x, dmg 0.58x, cd 1.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] a whole-machine scale — blocker 4: DAVINCI_SCALE 1.9 -> 2.3, lastApart to match (fallout of [S] 412d16c, 337) — NEXT shot: lineup_renaissance.png, roof peak above the jouster rider's crest
2. [S] a upper tier as its own hat — blocker 4: cap eave lip proud of the lower roof and a short vertical collar between the tiers, lifting the peak without re-pitching — ref: renaissance.da_vinci_tank.red.png — ours: lineup_renaissance.png
## Attempts (iter | gap | criterion | verdict)
329 | cannonballs that shatter on impact [S] (495e7d1) | c | approved
330 | spinning drum [S] (7b89341) | c | approved
331 | two-tier plank roof over a dark drum [S] (e4c2a2f) | a | approved
331 | 16 thick octagonal barrels [S] (da39ed0) | b | approved
332 | scale: radii x1.4, heights kept [P] (caea7ba) | a | rejected
333 | evidence: lineup opened (2.7 m rank, radius 15) (04ea157) | a | -
334 | taller roof by tier pitch (DAVINCI_PITCH) [S] (519d913 + 52df144) | a | rejected
337 | whole-machine scale 1.9x, flat-topped cap [S] (412d16c; evidence 09659a9) | a | approved
## Rejected (last 4)
- scale [P] [1] — 332: DAVINCI_ROOF radii and DAVINCI_CANNON.out x1.4 — ledger reversal of 331 rows; widening without height flattened the roof to ~15 deg
- taller roof [S] [1] — 334: tiers raised at 41/54 deg, peak 2.23 — a witch-hat cone with a spike cap; TABS gets its height from overall size, pitch ~30 deg, flat-topped cap
## Notes (max 3 lines)
- Roof, drum, barrels and muzzles ride "davinci_spin" (a direct child of root, RuntimeUnit._spinDrum finds it); base, wheels, Da Vinci, smoke/impact sockets ride "davinci_chassis".
- DAVINCI_SCALE (337) grows drum and chassis nodes together; pilot offset in linkedActorPresets scaled by hand (1.86, .53). Lineup: scenarios.ts lastApart.
- makeBodyMetrics drives targeting: a scale or height change should be checked against metrics and the sim's reach.
