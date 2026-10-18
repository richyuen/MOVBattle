# medieval.catapult
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 355)
 1. frame in unit_medieval.catapult_idle two plain posts, one top bar, on a flat slab bed — TABS: box trestle, A-frame uprights, thick crossbeams, block caps on every corner, bolts (ref: medieval.catapult.red.png)
 2. wood in unit_medieval.catapult_idle flat plain mauve-brown — TABS: orange wood with team paint streaks on the beams (ref: medieval.catapult.blue.png)
 3. wheels in unit_medieval.catapult_idle large, black rubber-look tyres, stuck out at the sides — TABS: smaller wooden wheels, grey iron rims, tucked in at the frame corners (ref: medieval.catapult.red.png)
b PASS (355)
c PASS (351)
d PASS (cost 1000, hp 3.77x, dmg 0.85x, cd 5.01x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a trestle frame — blocker 1: box trestle, A-frame uprights, crossbeams, corner block caps, bolts — ref: medieval.catapult.red.png — ours: unit_medieval.catapult_idle.png
2. [S] a wheels — blocker 3: smaller wooden wheels, grey iron rims, tucked in at the frame corners — ref: medieval.catapult.red.png — ours: unit_medieval.catapult_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | arm on a pivot, whips upright on the shot (CATAPULT_ARM, CATAPULT_THROW) [S] (df37545 +a4cb4c1) | c | approved
352 | faceted grey-brown boulder (BOULDER, buildFacetedBoulder) [S] (639c5f4 +439f40c) | b | approved
354 | visible crewman: coif/shirt/belt/breeches, arms up to the bucket (CATAPULT_CREW, dressCatapultCrew) [S] (0264878 +e6055d9) | b | approved
354 | BOULDER.stone (.6,.5,.4) lit .1 [P] (3cd7525) | b | approved
355 | spoon bucket: open flared cup, rim ring, boulder sunk in it (CATAPULT_BUCKET) [S] (56a8ab6) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 355 (b PASS): the cup is a smooth flared cylinder; TABS bucket is chunky boxed timber in the arm's orange wood.
- critic 355: crew passes in lineup_medieval but hides behind the uprights in _idle. Spooky pumpkin catapult shares the bucket.
