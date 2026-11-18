# map.pirate
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a PASS (586: struck 1, 5; CONFIRM pending)
b FAIL (585: struck 2): 3. beach outline in map_pirate_top — TABS: an hourglass sand spit narrowing toward the back mountain, not a rectangle (ref: reference/maps/wiki/pirate.png) 5. ship decks in map_pirate_battle — TABS: the decks are standable fighting ground with cannon batteries (ref: card Overview; reference/stages/pirate.x_marks_the_spot.png)
c PASS (586 judge)

## Ranked gaps
1. [S] b ship decks — blocker 5: standable deck as fighting ground with cannon batteries reachable by the gangplanks (deck height field, hull collider swapped for edge rails, zone reach onto it or an evidence re-aim so map_pirate_battle can show units on a deck) — ref: reference/stages/pirate.x_marks_the_spot.png — ours: map_pirate_battle.png
2. [S] b hourglass outline — blocker 3: beach narrowing to a waist toward the bell mountain — ref: reference/maps/wiki/pirate.png — ours: map_pirate_top.png
3. [P] a ripple tone — fallout of 05e50f52: ripple emissive (0.2, 0.13, 0.05) toward (0.06, 0.04, 0.01) so the strokes read darker — ours: map_pirate_ground.png

## Attempts (iter | gap | criterion | verdict)
586 | [S] golden sand 05e50f52 (+bb77a558); galleon rebuild f49048a8 (+f3ee1295) | a5, a1 | 2 APPROVE, struck a5, a1 (critic a PASS)
585 | [S] gangplanks 07e0b708; open shore 26b8a6d7; tropic sky 8f023e21 | b2, a6, a4 | 3 APPROVE, struck b2, a6, a4
583-584 | [S] bell mountain 1bac6c2d, 36dabe6f, 5395195a | a2 | 2 APPROVE, struck a2
582 | [S] beach ca76875d, 013ff74f (starvation) | b3 | APPROVE, no strike (attempt 1)
576-578 | [S] galleons, lagoon drained, sand island; [P] stern (rejected) | a, b | 3 APPROVE, struck b1, b4, a3

## Rejected (last 4)
577 | [P] stern material (0.2,0.11,0.055) | attempts 1 | full-width gold cap slabs cover stern tops; change did not show

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder (x29..41.4, |z|<=9.9). Mountain (34,38), collider r 10.5. b5 deferred 586: zones stop at |z| ~29, so no unit reaches a deck in the battle shot.
- A translucent blue slab still floats off the right rim (x ~58-60: base waterfall prop at (58,0)?): find and remove before a CONFIRM.
- 586 leftovers: hull light orange-brown and boxy; furled sails read as white blobs end-on from the island camera.
