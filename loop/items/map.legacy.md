# map.legacy
Status: open   Audited: 576 (AUDIT x2), 582 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (0 since 582): 1. Ground cover in map_legacy_ground.png — TABS: low, thin grass tufts leave a readable grassy surface; ours covers the field with large upright polygonal clumps that read as a dense crop of stones (ref: reference/stages/legacy.a_tank.png). 2. Forest ring in map_legacy_top.png — TABS: an irregular forest of varied-height, separated conifers opens into the glade; ours is a tightly packed, nearly continuous wall of uniformly tall conifers (ref: reference/maps/wiki/legacy.png). 3. Church in map_legacy_island.png — TABS: the landmark has a visibly broken roof and irregular ruined masonry; ours has a clean, complete roof and a largely intact rectangular nave (ref: reference/maps/legacy.png).
b PASS (581: struck 3; CONFIRM 582)
c PASS (582 judge)

## Ranked gaps
1. [S] a fine meadow — blocker 1: replace upright stone-like clumps with low thin grass tufts — ref: reference/stages/legacy.a_tank.png — ours: map_legacy_ground.png
2. [S] a irregular forest — blocker 2: separated conifers of varied heights around the glade — ref: reference/maps/wiki/legacy.png — ours: map_legacy_top.png
3. [S] a ruined church — blocker 3: broken roof and irregular ruined masonry — ref: reference/maps/legacy.png — ours: map_legacy_island.png

## Attempts (iter | gap | criterion | verdict)
582 | [S] sky backdrop bf604f4a, cd5ed429 | a7 | APPROVE, struck a7; CONFIRM a FAIL (first), b PASS
581 | [S] pale-blue sky 4ca22ba3 | a7 | APPROVE, no strike
581 | [S] circular clearing 5a649e0c | b3 | APPROVE, struck b3
580 | [S] valley floor f5d5ce85 | b | APPROVE, struck b2
580 | [S] mountains bfb1c703; ruin 9a3f5024 + 2fc231cb | a | APPROVE, struck a4, a5
576 | [S] 341586e1 | a | APPROVE, struck a1
577 | [S] 1d4cd558 | a | APPROVE, no strike (palette cleared; tall-tuft clause stands)
578 | [S] 5adcb485 | b | APPROVE, struck b5
578 | [S] 486e6428 | a | APPROVE, struck a3
578 | [P] 30f467e1 | a | APPROVE, struck a2
579 | [S] churchyard 0167e0b6 | b | APPROVE, struck b1, b4
579 | [S] camps 2f5b6c6f | a | APPROVE, struck a6

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: legacy.a_tank, the_war, thor_s_battle, fantasy_good.fortified_formation (x 7..21, |z| <= 10).
- Church x -4..10 z 28.5..35.5; tower x -6.5. Camps x +-(35/41), z -14/-4/6; ruin clearing x28..51 z19..42.
- 582 CONFIRM supplied the new a list; b confirmed. Sky mechanism passed the gap critic.
