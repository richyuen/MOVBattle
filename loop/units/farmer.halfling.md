# farmer.halfling
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (343)
b PASS (339)
c FAIL (1 since 339)
 2. missing: grab/cling, carried along by the target, in unit_farmer.halfling_flight — TABS: he latches onto the man and is dragged along, even after the man dies (ref: card Characteristics)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c grab and cling — blocker 2: on landing or on a hit he attaches to the target (torso or limb) as a linked actor carried along, kept after the target's death, shown in _flight — ref: card Characteristics, farmer.halfling.png — ours: unit_farmer.halfling_flight.png
## Attempts (iter | gap | criterion | verdict)
339 | empty mitt hands, pan removed [S] (697a9c6) | b | approved
340 | shaggy brown mop (SHAGGY, tribalDress) [S] (9ccfb6c) | a | approved
341 | jacket, vest, white shirt V (HALFLING_DRESS) [S] (76bdeb8) | a | approved
342 | dark team knee shorts, belt and buckle (HALFLING_SHORTS) [S] (439c08e) | a | approved
343 | hairy feet, brown clump and tufts (HALFLING_FEET) [S] (87e37b9) | a | approved
344 | Halfling Jump, ballistic leap onto the man (HALFLING_JUMP, RuntimeUnit.leap) [S] (2cb2be2) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 344 critic: leap fires at 17 ms (capture d 2.5 puts him in range at once), so _ability is the take-off crouch; lands .3 m short and stands. Leap is simulationSystem HALFLING_JUMP keyed on unit id.
- 343 critic: foot tufts a little spiky and dark in idle (TABS a rounder shag on top of the foot); minor.
- 342 critic: belt reads tan at lineup distance, buckle lost (TABS dark belt, big grey square buckle).
