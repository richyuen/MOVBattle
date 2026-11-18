# map.fantasy_good
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (594: struck 5): 3. No gate towers in map_fantasy_good_island — TABS: two huge white-and-gold arched gate towers with stained-glass windows and blue waterfall channels (ref: reference/maps/heaven_good.png) 4. Dark stalactite spikes under the island in map_fantasy_good_island — TABS: white arcaded viaduct arches over grey basalt column cliffs with teal trees (ref: wiki/fantasy_good.png lower left)
b FAIL (594: struck 3): 1. Rounded oval lawn outline in map_fantasy_good_top — TABS: rectangular paved deck with stepped, zig-zag edges (ref: wiki/fantasy_good.png) 5. No side islets in map_fantasy_good_island — TABS: several small floating islands beside the main deck (ref: card Overview, heaven_good.png top left)
c PASS (594 judge)

## Ranked gaps
1. [S] b stepped edge — blocker 1: deck rectangle stepping in and out in zig-zag notches along both long sides, kerb and parapet following — ref: wiki/fantasy_good.png — ours: map_fantasy_good_top.png
2. [S] a underside — blocker 4: base stalactites hidden; white arcaded viaduct band (round arches, 6 m bays) under the rim over grey basalt column clusters with teal trees — ref: wiki/fantasy_good.png — ours: map_fantasy_good_island.png
3. [P] a waterfalls (fallout of b993ae0a, to 597): waterfall on each leg's front (-z) face, 0.5 -> 1.2 m wide — ours: map_fantasy_good_island.png
4. [S] b side islets — blocker 5: small floating islets beside the deck — ref: heaven_good.png — ours: map_fantasy_good_island.png

## Attempts (iter | gap | criterion | verdict)
594 | [S] gate towers (+-40,30) b993ae0a | b3 (a3) | APPROVE, struck b3; a3 towers/gold/glass cleared, waterfalls unseen
594 | [S] heaven sky: kit paleSky + cloud banks, range hidden 7b828924 | a5 | APPROVE, struck a5
593 | [S] open centre 1f3aa7be; parapets 4b047cbf (+9319c5b6) | b4, a2 | APPROVE, struck b4, a6, a2
591-592 | [S] own builder, marble deck; four 10 m pits | a1, b2 | APPROVE, struck a1, b2, b6

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/fantasy_good.ts on campaign.fantasy_good: deck x +-52 z +-40, pits x 6..30 z 9..30 mirrored, parapets drawn only, TOWERS x +-40 z 30 (legs 6 m, 19 m high), heavenSky. No stage here.
- Critic 594: towers read modest (19 m); grey jagged peaks still show beyond the back parapet in map_fantasy_good_top; sage lawn patches and dark boulders (base props) on the deck.
