# map.viking_sandbox
Status: open   Audited: 562 (AUDIT x2)   Done: -
## Verdicts
a FAIL (564: struck 1): 3. Great gate absent in map_viking_sandbox_top — TABS: carved ice gate hung with chains (ref: reference/maps/wiki/viking_sandbox.png) 4. Sky in map_viking_sandbox_ground is warm beige haze — TABS: cyan mist with snow (ref: reference/maps/wiki/viking_sandbox.png) 5. Island in map_viking_sandbox_island is a navy slab with stalactites — TABS: white ice chunk with crystal shards (ref: reference/maps/winter_viking_sandbox.png)
b FAIL (565: struck 4): 1. Outline in map_viking_sandbox_top is a rounded rectangle — TABS: circular arena bowl (ref: reference/maps/winter_viking_sandbox.png) 3. Gate on the left side absent in map_viking_sandbox_top — TABS: gate at left (ref: card Overview)
c PASS (565 judge)
## Ranked gaps
1. [S] a — blocker 4: cold sky: cyan-white clear colour and fog, drifting snow (save and restore in dispose)
2. [S] b — blocker 3: gap in the ice wall on the left (-x) with a carved ice gate: two tall pale-cyan pillars, a lintel, hanging chain links (iceWall)
3. [S] a — blocker 5: white ice-chunk underside with crystal shards in place of islandUnder/Shelf/Cliff
## Attempts (iter | gap | criterion | verdict)
563 | [S] own builder; tree ring -> closed three-tier ice-cliff wall, placement inside |x| <= 44 (632026ad) | a2 | APPROVE struck 2
564 | [S] base junk (Challenge Bluffs_box/_cyl/_totem_top) removed with colliders (617a5f5a) | b4 | APPROVE struck monolith clause, b2 struck
564 | [S] snow floor, lobed teal ice patches, white cracks, tufts/blades hidden (78fc3163) | a1 | APPROVE struck 1
565 | [S] base field dressing (wallStone, boulder, hayBale, hill, stump, both pits) removed with colliders and hazards (6278850c) | b4 | APPROVE struck 4
## Rejected (last 4)
## Notes (max 3 lines)
- Stage on it: pirate.arrows_and_arrow (x 29..36, |z| <= 10; keep its spots on open ice). Base zones reach x +-61: placementZones clipped to +-44.
- Critic 564: b1 looks met by the 563 wall (round bowl in top shot): judge it at the next b review. Ice patches lighter cyan than TABS teal.
- Base is campaign.challenge (shared): dress it in tabs/viking_sandbox.ts only.
