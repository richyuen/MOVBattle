# map.viking_sandbox
Status: open   Audited: 562 (AUDIT x2), 568 (CONFIRM: passed b; failed a), 569 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (0 since 569; plateau): 1. The interior ice in map_viking_sandbox_top.png is one uninterrupted blue patch inside a white rim — TABS: large irregular snow incursions and islands break up the blue surface across the arena (ref: reference/maps/wiki/viking_sandbox.png). 2. The three continuous narrow snow bands in map_viking_sandbox_ground.png give the ice wall an even layered profile — TABS: broad broken ledges vary their depth between jutting ice columns (ref: reference/maps/wiki/viking_sandbox.png).
b PASS (568: CONFIRM)
c PASS (569 judge)

## Ranked gaps
1. [R] a — rebuild the ice-wall profiles and fractured floor treatment from both CONFIRM lists (568 and 569) — ref: reference/maps/wiki/viking_sandbox.png and reference/stages/pirate.arrows_and_arrow.png — ours: map_viking_sandbox_top.png and map_viking_sandbox_ground.png

## Attempts (iter | gap | criterion | verdict)
563 | [S] own builder; tree ring -> closed three-tier ice-cliff wall, placement inside |x| <= 44 (632026ad) | a2 | APPROVE struck 2
564 | [S] base junk (Challenge Bluffs_box/_cyl/_totem_top) removed with colliders (617a5f5a) | b4 | APPROVE struck monolith clause, b2 struck
564 | [S] snow floor, lobed teal ice patches, white cracks, tufts/blades hidden (78fc3163) | a1 | APPROVE struck 1
565 | [S] base field dressing (wallStone, boulder, hayBale, hill, stump, both pits) removed with colliders and hazards (6278850c) | b4 | APPROVE struck 4
566 | [S] cyan sky and airborne snow (b2df5dd6) | a4 | APPROVE struck a4
567 | [S] left-hand carved gate with chain swag (e2665129) | a3 | APPROVE struck a3 and b3
568 | [S] faceted glacier underside and blue shards (da540cdb) | a5 | APPROVE, struck a5
568 | [S] circular arena floor and rim (3da0c3ba) | b1 | APPROVE, struck b1
569 | [S] fractured ice shelves (eb3c33ae+16dc5699) | a1 | APPROVE, struck a1
569 | [S] continuous cracked ice sheet (b5799593) | a2 | APPROVE, struck a2
569 | [S] rim-rooted ice peaks (2be8528a) | a3 | APPROVE, struck a3

## Rejected (last 4)

## Notes (max 3 lines)
- Pirate Arrows and Arrow uses x 29..36, |z| <= 10. Placement zones are clipped to |x| <= 44.
- Both CONFIRM lists remain in output/loop/iter-568/confirm.md and output/loop/iter-569/confirm.md.
