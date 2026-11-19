# map.dynasty
Status: open   Audited: 576 (AUDIT x2), 588 (CONFIRM: failed a,b)   Done: -
## Verdicts
a FAIL (599: struck 5,4; list from588 CONFIRM): 1. Field grass colour in map_dynasty_ground.png — TABS: soft, pale pastel green with a light texture, not saturated pure green (ref: reference/stages/dynasty.art_of_war.png, reference/maps/wiki/dynasty.png) 2. Cobblestone path loop around the field in map_dynasty_top.png — TABS: a wide grey cobblestone path runs around the whole field just inside the tree ring (ref: reference/maps/wiki/dynasty.png)
b PASS (595: struck 2; CONFIRM pending)
c PASS (599 judge)

## Ranked gaps
1. [S] a perimeter path — blocker 2 (2+ attempts: starvation or new plateau only): broad connected cobblestone loop just inside trees — ref: reference/maps/wiki/dynasty.png — ours: map_dynasty_top.png
2. [S] a turf surface — blocker 1 (2+ attempts: starvation or new plateau only): pale pasture texture and low-contrast grass variation — ref: reference/stages/dynasty.art_of_war.png — ours: map_dynasty_ground.png
3. [P] fallout of5e04109e (to600): pull stair-cheek shrub clumps off stage armies against terrace faces — ours: stage_dynasty.samurai_army.png, stage_dynasty.art_of_war_army.png

## Attempts (iter | gap | criterion | verdict)
599 | [S] ten large cherries e5a967e4 | a5 | APPROVE, struck a5 (attempt2)
599 | [S] pale boulder headlands 70907ec1 | a4 | APPROVE, struck a4 (attempt2)
597 | [R] garden look rebuild 5e04109e (lawn, open pagoda, k%4 cherries, teal cliffs + shoulder moss, shrub rows) | a | APPROVE, struck a3, a6
596 | [S] cherry grove 2fb7605e; boulder cliffs 534e1920 | a5, a4 | APPROVE, no strike (attempt 1 each)
592-595 | [S] cobble loop 66229760, loop clear 0097f9bc (a2 x2); pagoda re-sited 4612ee6b; outlets 65195d10 | a2, b1, b2 | APPROVE; struck b1, b2
576-588 | [S] 14 approved, 582 rejected-kept | a, b | old lists struck; CONFIRM 588 failed a, b

## Rejected (last 4)
582 | [S] b3 5b6181bc | rejected-kept (revert conflict)

## Notes (max 3 lines)
- Stages: dynasty.samurai, art_of_war, renaissance.renaissance_vs_dynasty_3, wild_west.shogun_s_samurai. OUTLETS -34,17.
- a1/a2 have2+ attempts; criterion next starves604 after599 attempts. 597 R lifted plateau; no new plateau this iteration.
- Shrub cheeks still stand in stage armies (drawn only): eligible P to600, fix before stages_dynasty audits.
