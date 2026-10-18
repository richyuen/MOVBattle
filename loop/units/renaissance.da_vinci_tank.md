# renaissance.da_vinci_tank
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 4. tank in lineup_renaissance is about three men wide — TABS: roof spans about four to five men (ref: reference/factions/renaissance.jpg)
b PASS (331)
c PASS (330)
d PASS (cost 4000, hp 62.02x, dmg 0.58x, cd 1.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] a scale (fallout of 331 roof [S]) — vehicleBuilder.ts DAVINCI_ROOF eaveR 1.25->2.0, drumR and DAVINCI_CANNON.out scaled with it — NEXT shot: lineup_renaissance.png (roof width)
## Attempts (iter | gap | criterion | verdict)
329 | cannonballs that shatter on impact [S] (495e7d1) | c | approved
330 | spinning drum [S] (7b89341) | c | approved
331 | two-tier plank roof over a dark drum, pilot skirt hidden [S] (e4c2a2f) | a | approved
331 | 16 thick octagonal barrels [S] (da39ed0) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Roof, drum, barrels and muzzles ride "davinci_spin" (buildDaVinciRoof, DAVINCI_ROOF, DAVINCI_CANNON); RuntimeUnit._spinDrum turns it. Base plate and wheels stay on root.
- Critic 331 nits: lower tier a little steep, cap pointed (TABS shallow, blunt cap); muzzle rings flared like bolts (DAVINCI_CANNON.ringWide 1.3->1.15).
- makeBodyMetrics drives targeting: a rescaled roof (blocker 4) should leave metrics alone or move them on purpose.
