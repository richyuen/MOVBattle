# map.pirate
Status: open   Audited: 576 (AUDIT x2), 592 (CONFIRM: failed a,b), 599 (CONFIRM: failed a,b)   Done: -
## Verdicts
a FAIL (601: no strike; list from599): 1. Ships in output/loop/iter-599/map_pirate_island.png — TABS: large, deep, tiered hulls with elaborate raised sterns and broad crow's nests dominate both shores; ours read as shallow narrow boats with box cabins (ref: reference/maps/wiki/pirate.png).
b FAIL (plateau; 0 since 599): 1. Ship-to-field proportions in output/loop/iter-599/map_pirate_top.png — TABS: each ship runs along most of its beach shore, closely framing the fighting ground; ours has short ships beside a disproportionately broad central sand field (ref: reference/maps/wiki/pirate.png).
c PASS (601 judge)
## Ranked gaps
1. [R] b shore-and-ship footprint — blocker1: replace hourglassBeach and galleon layout together, ships framing most of both shores; preserve deck approaches/armies — ref: reference/maps/wiki/pirate.png — ours: map_pirate_top.png
2. [S] a open stern terrace (2 attempts; starvation/new plateau only) — blocker1: upward-sweeping deck and integrated quarter galleries — ref: reference/maps/wiki/pirate.png — ours: map_pirate_island.png, map_pirate_deck.png
## Attempts (iter | gap | criterion | verdict)
601 | [R] layout e0ec78a8 | b1 | REJECT, reverted d62511b6 (R attempt1)
601 | [S] curved galleries632a9f8c | a1 | APPROVE, no strike (attempt2)
600 | [R] galleonsf99eb4fd | a | APPROVE, strucka2,a3; hull/nest clauses cleared; a plateau lifted
599 | [S] galleries9b680d9d | a2 | APPROVE, strucka2; second failed CONFIRM -> plateau
596 | deckca380e64; shoreffb7e7ad/8e8d3c20 | b2,a3 | APPROVE, struckboth
595 | teamshipsb3ba566f | b1 | APPROVE, struckb1
594 | transom29222f58 | a2 | REJECT,revertedb4a3cdd9
593 | hullc6dfd275/0a50ce06 | a2 | APPROVE, strucka1/bow
576-592 | mechanisms | a,b | old lists struck; CONFIRM592 faileda,b
## Rejected (last 4)
601 | [R] b1 e0ec78a8 | longer hulls leave broad empty shore; R clears no blocker; reverted
594 | [S] a2 29222f58 | transom faced +-x, invisible; reverted
## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder; -z deck armies/zones retained; post-revert a/c all PASS601.
- b R waiting since599, one rejection. a1 next starvation606.
- Early601 CONFIRM unused: not would-be-done. Reviewed pre-revert shots saved iter-601/reviewed/; root shots post-revert.
