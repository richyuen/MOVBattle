# map.legacy
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (579: struck 6): 4. snow mountains in map_legacy_island — TABS: snow-capped valley walls rising all around the glade, not a floating grey range (ref: reference/maps/wiki/legacy.png) 5. ruined building in map_legacy_top — TABS: a crumbling sandstone ruin with dead trees on the right (ref: reference/maps/wiki/legacy.png) 7. Sky in map_legacy_island — TABS: clear pale-blue sky; ours is grey-white haze (ref: reference/stages/legacy.a_tank.png)
b FAIL (579: struck 1, 4): 2. island form in map_legacy_island — TABS: a round glade in a valley floor, not a floating slab (ref: reference/maps/legacy.png) 3. field outline in map_legacy_top — TABS: a wide round meadow with scattered grey boulders (ref: reference/maps/wiki/legacy.png)
c PASS (579 judge)

## Ranked gaps
1. [S] map.legacy.b valley floor — blocker 2: broad round glade merging into surrounding valley ground instead of a floating slab — ref: reference/maps/legacy.png — ours: output/loop/iter-579/map_legacy_island.png
2. [S] map.legacy.a snow mountains — blocker 4: continuous faceted valley walls around the glade with snowy summits — ref: reference/maps/wiki/legacy.png — ours: output/loop/iter-579/map_legacy_island.png
3. [S] map.legacy.a ruin — blocker 5: crumbling sandstone walls with broken openings and dead trees on the right rim — ref: reference/maps/wiki/legacy.png — ours: output/loop/iter-579/map_legacy_top.png

## Attempts (iter | gap | criterion | verdict)
576 | [S] 341586e1 | a | APPROVE, struck a1
577 | [S] 1d4cd558 | a | APPROVE, no strike (palette cleared; tall-tuft clause stands)
578 | [S] 5adcb485 | b | APPROVE, struck b5
578 | [S] 486e6428 | a | APPROVE, struck a3
578 | [P] 30f467e1 | a | APPROVE, struck a2
579 | [S] churchyard (0167e0b6) | b | APPROVE, struck b1, b4
579 | [S] camps (2f5b6c6f) | a | APPROVE, struck a6

## Rejected (last 4)


## Notes (max 3 lines)
- Stages: legacy.a_tank, the_war, thor_s_battle, fantasy_good.fortified_formation (x 7..21, |z| <= 10).
- Church nave x -4..10, z 28.5..35.5, tower x -6.5. Camps x +-(35/41), z -14/-4/6. Mountains and ruins still open.
