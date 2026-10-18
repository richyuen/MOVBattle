# medieval.catapult
Status: open   Audited: 351   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 351)
 1. frame in unit_medieval.catapult_idle is one T-post on a flat bed — TABS: box trestle, two A-frame uprights, thick crossbeams, block caps, bolts (ref: medieval.catapult.red.png)
 2. wood plain brown in unit_medieval.catapult_idle — TABS: orange wood with team paint streaks (ref: medieval.catapult.blue.png)
 3. wheels large with black tyres in unit_medieval.catapult_idle — TABS: smaller wooden wheels, grey iron rims at the frame corners (ref: medieval.catapult.red.png)
b FAIL (2 since 351)
 2. boulder in unit_medieval.catapult_windup sits on a flat plank end — TABS: wooden spoon bucket cupping the rock (ref: medieval.catapult.blue.png)
c PASS (351)
d PASS (cost 1000, hp 3.77x, dmg 0.85x, cd 5.01x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b spoon bucket — blocker 2: wooden spoon bucket at the arm's long end cupping the boulder — ref: medieval.catapult.blue.png — ours: unit_medieval.catapult_windup.png
2. [S] a box trestle frame — blocker 1: two A-frame uprights, thick crossbeams, block caps, bolts — ref: medieval.catapult.red.png — ours: unit_medieval.catapult_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | arm on a pivot, whips upright on the shot (CATAPULT_ARM, CATAPULT_THROW) [S] (df37545 +a4cb4c1) | c | approved
352 | faceted grey-brown boulder (BOULDER, buildFacetedBoulder) [S] (639c5f4 +439f40c) | b | approved
354 | visible crewman: no counterweight, coif/shirt/belt/breeches, arms up to the bucket (CATAPULT_CREW, dressCatapultCrew) [S] (0264878 +e6055d9) | b | approved
354 | BOULDER.stone (.6,.5,.4) lit .1 [P] (3cd7525) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 354: crewman's arms stay raised into air after the arm fires (TABS lets go); he reads small, dark-legged at the rear corner.
- critic 354: boulder still a little cool grey (TABS warmer grey-brown). Spooky pumpkin catapult keeps the old crewman and counterweight.
