# map.fantasy_evil
Status: open   Audited: 587 (AUDIT x2), 599 (CONFIRM: failed a,b)   Done: -
## Verdicts
a FAIL (600: struck 2,1): 3. Mushroom dressing in output/loop/iter-599/map_fantasy_evil_island.png — TABS: small vivid green mushroom clusters light the rocks; ours has conspicuous large dull magenta caps around the perimeter (ref: reference/maps/wiki/fantasy_evil.png).
b FAIL (600: no strike; list from599): 1. Interior platform network in output/loop/iter-599/map_fantasy_evil_top.png — TABS: substantial broken cliffs divide elevated islands and sunken routes, linked by broad stairs around the central shrine; ours has a mostly continuous paved plane divided by thin straight green channels around one rectangular raised platform (ref: reference/maps/wiki/fantasy_evil.png).
c PASS (600 judge)

## Ranked gaps
1. [S] a small green mushrooms — blocker 3: replace inherited large magenta caps with compact green-lit clusters among rocks — ref: reference/maps/wiki/fantasy_evil.png — ours: map_fantasy_evil_island.png
2. [S] b broken cliff network — blocker 1: substantial shelves separated by broken escarpments, broad stair corridors as explicit connections; wall any walk-in vertical face — ref: reference/maps/wiki/fantasy_evil.png — ours: map_fantasy_evil_top.png

## Attempts (iter | gap | criterion | verdict)
600 | [S] five shelves bb5ee8bb | b1 | APPROVE, no strike (attempt1); single rectangular platform clause cleared
600 | [S] winged monument d0fccfc5 | a2 | APPROVE, struck2
600 | [S] fractured plates ff505e0b,b79bc009 | a1 | APPROVE, struck1; followup corrected winding
599 | [S] leaning spire/chains f749b1d8 | a6 | APPROVE, struck a6,a5; b re-audit PASS; first CONFIRM failed a,b
597 | [S] backdrop crag/chains 89b4f29e,4818fb5b | a6 | APPROVE, no strike (attempt1)
596 | [S] statue re-site f4eef72d,990ecde8 | a5 | APPROVE, no strike (attempt2); P da34040c REJECT
595 | [S] stairs da55aaca; rim27e30aa2; rock3b0cd8d4 | b2,a4,a6 | APPROVE, struck b2,a4,a6 slab clause
590-594 | [S] void, floor, shrine, statue mechanisms | a,b | old lists struck; CONFIRM599 replaced lists

## Rejected (last 4)
596 | [P] a6 da34040c | rock mass under slab, unseen; reverted

## Notes (max 3 lines)
- No dependent stage. Monument(32,38) above crag; smaller STATUE(18,15) and front chains retained.
- Evidence685f65a9 island targety16/r230, topy12/r160 reopens a/b; full wings in island. Top owns ground/platform, not silhouette.
- First counted CONFIRM failure599 only. b1 now1 attempt; a3 unattempted. 600 thumbnail refreshed.
