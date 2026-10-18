# renaissance.da_vinci_tank
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 4. tank in lineup_renaissance is squat, its roof peak below the halberdier's head — TABS: tall conical roof, peak above the jouster's rider, the tank about 1.5 men tall (ref: reference/factions/renaissance.jpg)
b PASS (331)
c PASS (330)
d PASS (cost 4000, hp 62.02x, dmg 0.58x, cd 1.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hut roof at TABS scale — blocker 4: keep ~30 deg pitch, a flat-topped cap frustum, height from a wider machine (eaveR, drumR, cannon ring out together) — ref: reference/factions/renaissance.jpg, renaissance.da_vinci_tank.red.png — ours: lineup_renaissance.png
## Attempts (iter | gap | criterion | verdict)
329 | cannonballs that shatter on impact [S] (495e7d1) | c | approved
330 | spinning drum [S] (7b89341) | c | approved
331 | two-tier plank roof over a dark drum [S] (e4c2a2f) | a | approved
331 | 16 thick octagonal barrels [S] (da39ed0) | b | approved
332 | scale: radii x1.4, heights kept [P] (caea7ba) | a | rejected
333 | evidence: lineup opened (2.7 m rank, radius 15) (04ea157) | a | -
334 | taller roof by tier pitch (DAVINCI_PITCH) [S] (519d913 + 52df144) | a | rejected
## Rejected (last 4)
- scale [P] [1] — 332: DAVINCI_ROOF radii and DAVINCI_CANNON.out x1.4 — ledger reversal of 331 rows; widening without height flattened the roof to ~15 deg
- taller roof [S] [1] — 334: tiers raised at 41/54 deg, peak 2.23 — a witch-hat cone with a spike cap; TABS gets its height from overall size, pitch ~30 deg, flat-topped cap
## Notes (max 3 lines)
- Roof, drum, barrels and muzzles ride "davinci_spin" (buildDaVinciRoof, DAVINCI_ROOF, DAVINCI_CANNON); RuntimeUnit._spinDrum turns it. Base and wheels stay on root. The vehicle root is not scaled by proportions.scale.
- Critic 334: the fix is a whole-machine scale [S] (drum, roof, cannons and base together, ~30 deg pitch kept), not radii alone (332) nor pitch alone (334). One more rejected [S] on a = plateau.
- makeBodyMetrics drives targeting: a scale or height change should be checked against metrics and the sim's reach.
