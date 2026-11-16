# map.viking_sandbox
Status: open   Audited: 562 (AUDIT x2)   Done: -
## Verdicts
a FAIL (563: struck 2): 1. Ground in map_viking_sandbox_ground is orange autumn grass — TABS: pale snow with darker blue cracked-ice patches (ref: reference/maps/wiki/viking_sandbox.png) 3. Great gate absent in map_viking_sandbox_top — TABS: carved ice gate hung with chains (ref: reference/maps/wiki/viking_sandbox.png) 4. Sky in map_viking_sandbox_ground is warm beige haze — TABS: cyan mist with snow (ref: reference/maps/wiki/viking_sandbox.png) 5. Island in map_viking_sandbox_island is a navy slab with stalactites — TABS: white ice chunk with crystal shards (ref: reference/maps/winter_viking_sandbox.png)
b FAIL (0 since 562): 1. Outline in map_viking_sandbox_top is a rounded rectangle — TABS: circular arena bowl (ref: reference/maps/winter_viking_sandbox.png) 2. Encircling ice wall absent in map_viking_sandbox_island — TABS: wall closes the field on all sides (ref: card Overview) 3. Gate on the left side absent in map_viking_sandbox_top — TABS: gate at left (ref: card Overview) 4. Black slabs and monolith in mid-field in map_viking_sandbox_battle — TABS: flat open ice (ref: reference/stages/pirate.arrows_and_arrow.png)
c PASS (563 judge)
## Ranked gaps
1. [S] a — blocker 1: retint groundMat/grass/dryGrass to pale snow, hide grass tufts and blades, lay darker blue cracked-ice patches over the field
2. [S] b — blocker 4: remove the base's black slabs, monolith and totem (Challenge Bluffs_box/_cyl/_totem_top) with their colliders
3. [S] a — blocker 3: carved ice gate hung with chains set into the left wall (180 deg)
4. [S] b — blocker 1: hide or trim the slab corners outside the wall (round the island to the wall)
## Attempts (iter | gap | criterion | verdict)
563 | [S] own builder; tree ring -> closed three-tier ice-cliff wall, placement inside |x| <= 44 (632026ad) | a2 | APPROVE struck 2
## Rejected (last 4)
## Notes (max 3 lines)
- Stage on it: pirate.arrows_and_arrow (x 29..36, |z| <= 10; keep its spots on open ice). Base zones reach x +-61: placementZones clipped to +-44.
- Critic 563: the wall also meets b blocker 2 (closes the field on all sides); strike it at the next review of b. Tiers read as a palisade of smooth columns.
- Base is campaign.challenge (shared): dress it in tabs/viking_sandbox.ts only.
