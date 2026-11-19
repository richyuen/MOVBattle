# map.pirate
Status: open   Audited: 576 (AUDIT x2), 592 (CONFIRM: failed a,b), 599 (CONFIRM: failed a,b)   Done: -
## Verdicts
a FAIL (600 [R]: struck 2,3; plateau lifted): 1. Ships in output/loop/iter-599/map_pirate_island.png — TABS: large, deep, tiered hulls with elaborate raised sterns and broad crow's nests dominate both shores; ours read as shallow narrow boats with box cabins (ref: reference/maps/wiki/pirate.png).
b FAIL (plateau; 0 since 599): 1. Ship-to-field proportions in output/loop/iter-599/map_pirate_top.png — TABS: each ship runs along most of its beach shore, closely framing the fighting ground; ours has short ships beside a disproportionately broad central sand field (ref: reference/maps/wiki/pirate.png).
c PASS (600 judge)

## Ranked gaps
1. [R] b shore proportions — blocker 1: long shore-framing galleon footprint; preserve deck formations, gangplanks and zones — ref: reference/maps/wiki/pirate.png — ours: map_pirate_top.png
2. [S] a sculpted high stern — blocker 1: extended raked quarter galleries, curved upper stern deck and projecting gold-framed transom — ref: reference/maps/wiki/pirate.png — ours: map_pirate_island.png, map_pirate_deck.png

## Attempts (iter | gap | criterion | verdict)
600 | [R] galleons/shore f99eb4fd | a | APPROVE, struck a2,a3; deep hull/nest clauses of a1 cleared; a plateau lifted
599 | [S] stern galleries 9b680d9d (starvation) | a2 | APPROVE, struck a2; second failed a/b CONFIRM -> plateau
596 | [S] standable deck/zone ca380e64; outer sand/palms ffb7e7ad,8e8d3c20 | b2,a3 | APPROVE, struck both
595 | [S] two team ships b3ba566f | b1 | APPROVE, struck b1
594 | [S] transom 29222f58 | a2 | REJECT, reverted b4a3cdd9 (attempt2)
593 | [S] curved hull c6dfd275,0a50ce06 | a2 | APPROVE, struck a1 and bow clause (attempt1)
576-592 | [S] look/layout mechanisms | a,b | old lists struck; CONFIRM592 failed a,b

## Rejected (last 4)
594 | [S] a2 29222f58 | transom faced +-x, invisible; reverted b4a3cdd9

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder on -z deck x8..26; zone x2..32 z-41..-20. All a/c PASS600.
- b plateau waiting since599 takes601 R; a1 now1 attempt on new599 list. Blocker stands verbatim despite hull/nest clauses cleared.
- ce687e96 raises Pirate army camera targety8.2 for deck7.2; three corrected army shots reviewed. 600 thumbnail refreshed.
