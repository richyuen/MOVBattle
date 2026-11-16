# map.viking_sandbox
Status: open   Audited: 562 (AUDIT x2)   Done: -
## Verdicts
a FAIL (564: struck 1): 3. Great gate absent in map_viking_sandbox_top — TABS: carved ice gate hung with chains (ref: reference/maps/wiki/viking_sandbox.png) 4. Sky in map_viking_sandbox_ground is warm beige haze — TABS: cyan mist with snow (ref: reference/maps/wiki/viking_sandbox.png) 5. Island in map_viking_sandbox_island is a navy slab with stalactites — TABS: white ice chunk with crystal shards (ref: reference/maps/winter_viking_sandbox.png)
b FAIL (564: struck 2, 4 monolith clause): 1. Outline in map_viking_sandbox_top is a rounded rectangle — TABS: circular arena bowl (ref: reference/maps/winter_viking_sandbox.png) 3. Gate on the left side absent in map_viking_sandbox_top — TABS: gate at left (ref: card Overview) 4. Black slabs in mid-field in map_viking_sandbox_battle — TABS: flat open ice (ref: reference/stages/pirate.arrows_and_arrow.png)
c PASS (564 judge)
## Ranked gaps
1. [S] b — blocker 4: the dark block row the 564 regex missed (battle shot 500-760,400-420; arrows_and_arrow army shot): find its mesh names in the built set (rubble rows / wallStone?), hide with colliders, and the navy field boulders
2. [S] a — blocker 4: cold sky: cyan-white clear colour and fog, drifting snow (save and restore in dispose)
3. [S] a — blocker 5: white ice-chunk underside with crystal shards in place of islandUnder/Shelf/Cliff
4. [S] a — blocker 3: carved ice gate hung with chains set into the left wall (180 deg)
## Attempts (iter | gap | criterion | verdict)
563 | [S] own builder; tree ring -> closed three-tier ice-cliff wall, placement inside |x| <= 44 (632026ad) | a2 | APPROVE struck 2
564 | [S] base junk (Challenge Bluffs_box/_cyl/_totem_top) removed with colliders (617a5f5a) | b4 | APPROVE struck monolith clause, b2 struck
564 | [S] snow floor, lobed teal ice patches, white cracks, tufts/blades hidden (78fc3163) | a1 | APPROVE struck 1
## Rejected (last 4)
## Notes (max 3 lines)
- Stage on it: pirate.arrows_and_arrow (x 29..36, |z| <= 10; keep its spots on open ice). Base zones reach x +-61: placementZones clipped to +-44.
- Critic 564: b1 looks met by the 563 wall (round bowl in top shot): judge it at the next b review. Ice patches lighter cyan than TABS teal; grey rectangles (pit overlays) show through the snow.
- Base is campaign.challenge (shared): dress it in tabs/viking_sandbox.ts only.
