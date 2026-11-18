# map.fantasy_good
Status: open   Audited: 587 (AUDIT x2), 595 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (596: struck 6): 1. Underside of the slab in map_fantasy_good_island: a flat white wall with square dark windows over short grey stub pillars — TABS: arcaded viaduct arches over hanging grey basalt column clusters with teal trees, clouds below (ref: reference/maps/wiki/fantasy_good.png, reference/maps/heaven_good.png) 2. The two gate arches in map_fantasy_good_island and _top: small plain boxes with one round arch and a thin spike — TABS: huge ornate gate towers with stained-glass windows and tall pale-blue crystal spires (ref: reference/maps/wiki/fantasy_good.png) 3. Waterfalls in map_fantasy_good_island and _top: none anywhere — TABS: bright blue water channels running down the gate faces, falling into the pits and off the deck edge (ref: reference/maps/wiki/fantasy_good.png, card Overview "several waterfalls") 4. Pit interiors in map_fantasy_good_top and _ground: shallow boxes with a flat blue or lavender floor and two teal bushes — TABS: deep dark shafts with grey basalt column clusters and trees rising out of them (ref: reference/maps/wiki/fantasy_good.png) 5. Corrupted-darkness pieces in map_fantasy_good_top: none — TABS: black thorn vines and a dark corrupted obelisk in the pits beside the light statues (ref: reference/maps/wiki/fantasy_good.png, card Overview)
b FAIL (596: struck 1): 2. Deck outline in map_fantasy_good_top: a plain rectangle with a notched front edge — TABS: a stepped outline with a lower ledge walkway along the front rim and an angled jog at the back (ref: reference/maps/wiki/fantasy_good.png, reference/maps/heaven_good.png)
c PASS (596 judge)

## Ranked gaps
1. [S] b2 stepped outline: a 6 m ledge 2 m lower along the front edge with two stairs, a 45-degree jog in the back edge between the towers (EDGE_STEPS/deckPieces) — ref: heaven_good.png — ours: map_fantasy_good_top.png
2. [S] a4 deep pit shafts: dark unlit floors (.1,.12,.18), shaded walls, 6-10 grey basalt prism clusters 3-9 m per pit, trees on them (pits()) — ours: map_fantasy_good_top.png
3. [S] a3 waterfalls: blue channels down the gate faces into the pits and off the front deck edge — ours: map_fantasy_good_island.png
4. [S] a5 corruption: black thorn vines + dark obelisk in the obelisk pits
5. [P] a1 (fallout d777e226, to 598): arch head rotation (PI/2,0,0); columns 8+inner*18 m

## Attempts (iter | gap | criterion | verdict)
596 | [S] five staggered pits of different sizes 65479838 | b1 | APPROVE, struck b1
596 | [S] base dressing cleared, teal inlay clusters 788ad169 | a6 | APPROVE, struck a6
595 | [S] b1 3ea9ae23, b5 79c9305c, a4 d777e226; [P] a3 725faf2f | b, a | APPROVE all; CONFIRM failed a, b
591-594 | [S] builder, deck, pits, centre, parapets, towers, sky | a, b | APPROVE, struck old lists

## Rejected (last 4)

## Notes (max 3 lines)
- tabs/fantasy_good.ts: deck x+-52 z+-40, EDGE_STEPS, PITS (5, kinds tree/obelisk/open), TOWERS (+-40,30), cleanDeck last. No stage. 2nd CONFIRM fail -> plateau.
- Critic 596: pit floors flat bright blue, read shallow.
