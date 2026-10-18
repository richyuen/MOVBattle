# medieval.catapult
Status: open   Audited: 351   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 351)
 1. frame in unit_medieval.catapult_idle is one T-post on a flat bed — TABS: box trestle, two A-frame uprights, thick crossbeams, block caps, bolts (ref: medieval.catapult.red.png)
 2. wood plain brown in unit_medieval.catapult_idle — TABS: orange wood with team paint streaks (ref: medieval.catapult.blue.png)
 3. wheels large with black tyres in unit_medieval.catapult_idle — TABS: smaller wooden wheels, grey iron rims at the frame corners (ref: medieval.catapult.red.png)
b FAIL (1 since 351)
 1. a black cube hides the crewman in unit_medieval.catapult_idle (legs only) — TABS: crewman in coif, shirt, belted pants hauling the arm down (ref: medieval.catapult.red.png)
 2. boulder in unit_medieval.catapult_windup is faceted but pale whitish-grey on a flat plank end — TABS: mid grey-brown faceted boulder, darker shaded facets, cupped in a wooden spoon bucket (ref: medieval.catapult.blue.png)
c PASS (351)
d PASS (cost 1000, hp 3.77x, dmg 0.85x, cd 5.01x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b visible crewman — blocker 1: drop the black cube, dress the crewman (coif, shirt, belted pants) hauling the arm — ref: medieval.catapult.red.png — ours: unit_medieval.catapult_idle.png
2. [S] a box trestle frame — blocker 1: two A-frame uprights, thick crossbeams, block caps, bolts — ref: medieval.catapult.red.png — ours: unit_medieval.catapult_idle.png
3. [P] b boulder tone (fallout of 639c5f4) — BOULDER.stone (0.6,0.5,0.4), .lit .1 — shows in unit_medieval.catapult_windup
## Attempts (iter | gap | criterion | verdict)
351 | arm on a pivot, cocked, whips upright on the shot, hauled down over the reload (CATAPULT_ARM, CATAPULT_THROW) [S] (df37545 +a4cb4c1) | c | approved
352 | faceted grey-brown boulder, bucket payload and shot (BOULDER, buildFacetedBoulder) [S] (639c5f4 +439f40c) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Unit shots frame a war machine by its mesh top since 65be27f (rig 3.02 m).
- Pickable [P] fallout: CATAPULT_ARM.cocked lower (351, catapult_idle); BOULDER tone (352, catapult_windup).
