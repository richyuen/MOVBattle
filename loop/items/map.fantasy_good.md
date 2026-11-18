# map.fantasy_good
Status: open   Audited: 587 (AUDIT x2), 595 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 595, CONFIRM list): 1. Underside of the slab in map_fantasy_good_island: a flat white wall with square dark windows over short grey stub pillars — TABS: arcaded viaduct arches over hanging grey basalt column clusters with teal trees, clouds below (ref: reference/maps/wiki/fantasy_good.png, reference/maps/heaven_good.png) 2. The two gate arches in map_fantasy_good_island and _top: small plain boxes with one round arch and a thin spike — TABS: huge ornate gate towers with stained-glass windows and tall pale-blue crystal spires (ref: reference/maps/wiki/fantasy_good.png) 3. Waterfalls in map_fantasy_good_island and _top: none anywhere — TABS: bright blue water channels running down the gate faces, falling into the pits and off the deck edge (ref: reference/maps/wiki/fantasy_good.png, card Overview "several waterfalls") 4. Pit interiors in map_fantasy_good_top and _ground: shallow boxes with a flat blue or lavender floor and two teal bushes — TABS: deep dark shafts with grey basalt column clusters and trees rising out of them (ref: reference/maps/wiki/fantasy_good.png) 5. Corrupted-darkness pieces in map_fantasy_good_top: none — TABS: black thorn vines and a dark corrupted obelisk in the pits beside the light statues (ref: reference/maps/wiki/fantasy_good.png, card Overview) 6. Deck dressing in map_fantasy_good_top and _ground: dark boulders, khaki mound discs and brown brick-rubble rows lying on the marble — TABS: a clean blue-grey flagstone deck with teal inlay tiles and no rocks or rubble (ref: reference/maps/wiki/fantasy_good.png)
b FAIL (0 since 595, CONFIRM list): 1. Pit arrangement in map_fantasy_good_top: four equal squares in a symmetric 2x2 around a plus-shaped open cross — TABS: five or six pits of different sizes staggered along both long rims (a large tree pit on the left, a large open pit at the front right, small obelisk pits), leaving a zigzag central walkway (ref: reference/maps/wiki/fantasy_good.png) 2. Deck outline in map_fantasy_good_top: a plain rectangle with a notched front edge — TABS: a stepped outline with a lower ledge walkway along the front rim and an angled jog at the back (ref: reference/maps/wiki/fantasy_good.png, reference/maps/heaven_good.png)
c PASS (595 judge)

## Ranked gaps
1. [P] a1 (fallout d777e226, to 598): arch head rotation (PI/2,0,0); columns 8+inner*18 m
2. [S] a6 deck dressing: base boulders, discs, rubble hidden; teal inlays
3. [S] a5 corruption: thorn vines + dark obelisk in two pits

## Attempts (iter | gap | criterion | verdict)
595 | [S] b1 3ea9ae23, b5 79c9305c, a4 d777e226; [P] a3 725faf2f | b, a | APPROVE all; CONFIRM failed a, b
591-594 | [S] builder, deck, pits, centre, parapets, towers, sky | a, b | APPROVE, struck old lists

## Rejected (last 4)

## Notes (max 3 lines)
- tabs/fantasy_good.ts: deck x+-52 z+-40, EDGE_STEPS, pits x 6..30 z 9..30, TOWERS (+-40,30). No stage. 2nd CONFIRM fail -> plateau.
- Critic 595: arch heads edge-on; columns stubs; blue zone column over right islet.
