# map.ancient_sandbox
Status: open   Audited: 562 (AUDIT x2)   Done: -
## Verdicts
a FAIL (564: struck 5): 1. Ground in map_ancient_sandbox_ground is orange autumn grass — TABS: green meadow with brown dirt paths (ref: reference/maps/wiki/ancient_sandbox.png) 2. Edge dressing in map_ancient_sandbox_top is autumn trees — TABS: cypresses and white Greek houses with blue-tile walls (ref: reference/maps/wiki/ancient_sandbox.png) 3. Spiral mountain absent in map_ancient_sandbox_island — TABS: tall spiral rock tower at the back (ref: reference/maps/greek_ancient_sandbox.png) 6. Ruins absent in map_ancient_sandbox_top — TABS: fallen columns and ruined arches (ref: reference/maps/wiki/ancient_sandbox.png)
b FAIL (565: struck 5): 1. Island outline in map_ancient_sandbox_top is a small rounded rectangle — TABS: very large irregular island with cliff terraces (ref: reference/maps/greek_ancient_sandbox.png) 2. Raised terraces with temples at the back edge absent in map_ancient_sandbox_top — TABS: brown-cliffed hills at the far edge (ref: reference/maps/wiki/ancient_sandbox.png) 3. Spiral mountain on the north centreline absent in map_ancient_sandbox_top — TABS: mountain on the centreline (ref: card Overview) 4. Offshore islets absent in map_ancient_sandbox_island — TABS: small islands in the distance (ref: card Overview)
c PASS (565 judge)
## Ranked gaps
1. [S] a — blocker 1: green meadow ground with brown dirt paths (grass/groundMat/blades recoloured, fieldTufts_* hidden, path ribbons)
2. [S] b — blocker 2: terrace set piece along the back rim: two or three brown cliff steps with green tops, white Greek houses with blue-tile walls and a small temple
3. [S] a — blocker 3: tall spiral rock tower on the back centre line
## Attempts (iter | gap | criterion | verdict)
563 | [S] own builder; navy underside -> ring of faceted terracotta cliff facets + floor (a295aa5a) | a4 | APPROVE struck 4
564 | [S] base junk (Challenge Bluffs_box/_cyl/_totem_top) removed with colliders (d4443b87) | b5 | APPROVE struck monolith clause
564 | [S] blue sea disc to the horizon at y -11, shallows + foam rings (288ca462) | a5 | APPROVE struck 5
565 | [S] base field dressing (wallStone, boulder, hayBale, hill, stump, both pits) removed with colliders and hazards (b149e156) | b5 | APPROVE struck 5
## Rejected (last 4)
## Notes (max 3 lines)
- No stages fought on it. Base is campaign.challenge (shared): dress it in tabs/ancient_sandbox.ts only.
- Critic 565: dark boulder rows remain at the front and back rim among the trees (outside the 0.8 rim clear).
- Critic 564: beige sky jars over the blue sea (TABS pale blue sky). Critic 563: cliff a smooth salmon band (TABS darker, deep buttresses).
