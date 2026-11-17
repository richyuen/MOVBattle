# map.viking_sandbox
Status: open   Audited: 562 (AUDIT x2), 568 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (0 since 568): 1. Three ranks of near-uniform flat-capped pillars dominate map_viking_sandbox_ground.png — TABS: broad uneven ice ledges bridge columns of varied widths and profiles into a fractured cliff (ref: reference/maps/wiki/viking_sandbox.png). 2. Separate pale aqua slabs interrupt the white arena floor in map_viking_sandbox_ground.png — TABS: a broad connected blue ice surface with narrow branching fractures and irregular snow banks (ref: reference/stages/pirate.arrows_and_arrow.png). 3. A dark floating mountain shelf hangs behind the upper rim in map_viking_sandbox_top.png — TABS: angular blue-white ice peaks rise directly from the rim into mist (ref: reference/maps/winter_viking_sandbox.png).
b PASS (568: CONFIRM)
c PASS (568 judge)

## Ranked gaps
1. [S] a — blocker 1: overlapping irregular ice shelves instead of separate flat caps — ref: reference/maps/wiki/viking_sandbox.png — ours: map_viking_sandbox_ground.png
2. [S] a — blocker 2: connected blue ice with branching cracks and uneven snowbanks — ref: reference/stages/pirate.arrows_and_arrow.png — ours: map_viking_sandbox_ground.png
3. [S] a — blocker 3: replace detached mountain shelf with blue-white outcrops rooted on the rim — ref: reference/maps/winter_viking_sandbox.png — ours: map_viking_sandbox_top.png

## Attempts (iter | gap | criterion | verdict)
563 | [S] own builder; tree ring -> closed three-tier ice-cliff wall, placement inside |x| <= 44 (632026ad) | a2 | APPROVE struck 2
564 | [S] base junk (Challenge Bluffs_box/_cyl/_totem_top) removed with colliders (617a5f5a) | b4 | APPROVE struck monolith clause, b2 struck
564 | [S] snow floor, lobed teal ice patches, white cracks, tufts/blades hidden (78fc3163) | a1 | APPROVE struck 1
565 | [S] base field dressing (wallStone, boulder, hayBale, hill, stump, both pits) removed with colliders and hazards (6278850c) | b4 | APPROVE struck 4
566 | [S] cyan sky and airborne snow (b2df5dd6) | a4 | APPROVE struck a4
567 | [S] left-hand carved gate with chain swag (e2665129) | a3 | APPROVE struck a3 and b3
568 | [S] faceted glacier underside and blue shards (da540cdb) | a5 | APPROVE, struck a5
568 | [S] circular arena floor and rim (3da0c3ba) | b1 | APPROVE, struck b1

## Rejected (last 4)

## Notes (max 3 lines)
- Pirate Arrows and Arrow uses x 29..36, |z| <= 10. Placement zones are clipped to |x| <= 44.
- 568 CONFIRM passed layout. Its appearance blockers are the ice shelves, floor continuity, and detached backdrop.
