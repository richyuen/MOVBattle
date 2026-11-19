# map.pirate
Status: open   Audited: 576 (AUDIT x2), 592 (CONFIRM: failed a,b), 599 (CONFIRM: failed a,b)   Done: -
## Verdicts
a FAIL (plateau; 0 since 599): 1. Ships in output/loop/iter-599/map_pirate_island.png — TABS: large, deep, tiered hulls with elaborate raised sterns and broad crow's nests dominate both shores; ours read as shallow narrow boats with box cabins (ref: reference/maps/wiki/pirate.png). 2. Mountain summit in output/loop/iter-599/map_pirate_top.png — TABS: a stranded wooden ship hull sits on the grassy crag; ours has an oversized bell-shaped object on an exposed rock pile (ref: reference/maps/wiki/pirate.png). 3. Shore vegetation in output/loop/iter-599/map_pirate_ground.png — TABS: dense, irregular palms and broad green undergrowth close the ends of the beach; ours has evenly spaced low palm rows with sparse tall trees (ref: reference/maps/wiki/pirate.png).
b FAIL (plateau; 0 since 599): 1. Ship-to-field proportions in output/loop/iter-599/map_pirate_top.png — TABS: each ship runs along most of its beach shore, closely framing the fighting ground; ours has short ships beside a disproportionately broad central sand field (ref: reference/maps/wiki/pirate.png).
c PASS (599 judge)

## Ranked gaps
1. [R] a galleon/shore look — blockers 1-3: deep elaborate hulls, sterns and crow's nests; wreck on grassy summit; dense irregular palms/undergrowth; preserve 592's dark planks/gold trim and sandy palm rim — ref: reference/maps/wiki/pirate.png, reference/maps/pirate_beach.png — ours: map_pirate_island.png, _top, _ground
2. [R] b shore proportions — blocker 1: rescale ships to frame each shore and the sand field; preserve 592's one ship per team and standable decks/gangplanks — ref: reference/maps/wiki/pirate.png — ours: map_pirate_top.png

## Attempts (iter | gap | criterion | verdict)
599 | [S] stern galleries 9b680d9d (starvation) | a2 | APPROVE, struck a2; second failed a/b CONFIRM -> both plateau
596 | [S] team-1 deck zone, castle tops standable, 3 stage armies on the -z deck ca380e64 | b2 | APPROVE, struck b2 (b PASS)
596 | [S] outer sand ring with palm clumps and sandy drum side ffb7e7ad (+8e8d3c20) | a3 | APPROVE, struck a3
595 | [S] one galleon per team side (x -17 / +17) b3ba566f; evidence deck shot 637bc25c | b1 | APPROVE, struck b1
594 | [S] raked gold transom, 2 rows lit windows 29222f58 | a2 | REJECT, reverted b4a3cdd9 (attempt 2)
593 | [S] lofted curved hull shell c6dfd275 (+0a50ce06) | a2 | APPROVE, struck a1, a2 bow clause (attempt 1)
576-592 | [S] galleons, lagoon, sand island, bell mountain, beach, gangplanks, shore, sky, golden sand, decks, spit | a, b | struck a1-a6, b1-b5; CONFIRM 592 failed a, b

## Rejected (last 4)
594 | [S] a2 29222f58 | transom faced +-x, invisible; reverted b4a3cdd9

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder, on -z deck x8..26; zone x2..32 z-41..-20.
- Both R specs include CONFIRM lists at iter-592/confirm.md:12-16 and iter-599/confirm.md. One waiting R takes iteration600's slot.
