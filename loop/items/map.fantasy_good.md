# map.fantasy_good
Status: open   Audited: 587 (AUDIT x2), 595 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (597: struck 3, 4): 1. Underside of the slab in map_fantasy_good_island: a flat white wall with square dark windows over short grey stub pillars — TABS: arcaded viaduct arches over hanging grey basalt column clusters with teal trees, clouds below (ref: reference/maps/wiki/fantasy_good.png, reference/maps/heaven_good.png) 2. The two gate arches in map_fantasy_good_island and _top: small plain boxes with one round arch and a thin spike — TABS: huge ornate gate towers with stained-glass windows and tall pale-blue crystal spires (ref: reference/maps/wiki/fantasy_good.png) 5. Corrupted-darkness pieces in map_fantasy_good_top: none — TABS: black thorn vines and a dark corrupted obelisk in the pits beside the light statues (ref: reference/maps/wiki/fantasy_good.png, card Overview)
b FAIL (597: "lower ledge walkway along the front rim" clause cleared, no strike): 2. Deck outline in map_fantasy_good_top: a plain rectangle with a notched front edge — TABS: a stepped outline with a lower ledge walkway along the front rim and an angled jog at the back (ref: reference/maps/wiki/fantasy_good.png, reference/maps/heaven_good.png)
c PASS (597 judge)

## Ranked gaps
1. [S] a5 corruption: 3-4 black thorn vine clusters (arched tubes 4-8 m) and a dark obelisk with a cracked black cap in the front-centre pit beside the light spire — ours: map_fantasy_good_top.png
2. [S] b2 back jog: a diagonal jog cut into the back rim at x 12..28 (deck edge drops ~6 m), parapet, kerb and colliders following it (EDGE_STEPS/edgeSegments) — ref: heaven_good.png — ours: map_fantasy_good_top.png
3. [S] a2 gate towers 2x taller, gold-trimmed stained-glass lancets, pale-blue crystal spire cluster each — ours: map_fantasy_good_island.png
4. [P] fallout of 10bafbf2 / cfe386c3 (to 600): front falls pierce the ledge: start them past the ledge's outer edge or spill over it; falls fade (mist) at the bottom — ours: map_fantasy_good_island.png

## Attempts (iter | gap | criterion | verdict)
597 | [S] pit shafts: dark floors, navy liners, basalt columns 6bbd3b7d | a4 | APPROVE, struck a4
597 | [S] waterfalls: gate channels into back pits, 3 front falls 10bafbf2 | a3 | APPROVE, struck a3
597 | [S] lower front ledge walkway with parapet and stairs cfe386c3 | b2 | APPROVE, no strike (ledge clause cleared) (attempt 1)
596 | [S] five staggered pits 65479838; clean deck + inlays 788ad169 | b1, a6 | APPROVE, struck both
591-595 | [S] builder, deck, pits, centre, parapets, towers, sky, steps, islets | a, b | APPROVE; CONFIRM 595 failed a, b

## Rejected (last 4)

## Notes (max 3 lines)
- tabs/fantasy_good.ts: deck x+-52 z+-40, EDGE_STEPS, PITS (5), TOWERS (+-40,30); frontLedge (first, own materials), waterfalls (after viaduct), pitShafts (last). No stage. 2nd CONFIRM fail -> plateau.
- Critic 597: basalt columns uniform pale posts; deck channels thin and pale from _top.
