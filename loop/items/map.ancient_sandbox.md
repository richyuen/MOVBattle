# map.ancient_sandbox
Status: open   Audited: 562 (AUDIT x2)   Done: -
## Verdicts
a FAIL (564: struck 5): 1. Ground in map_ancient_sandbox_ground is orange autumn grass — TABS: green meadow with brown dirt paths (ref: reference/maps/wiki/ancient_sandbox.png) 2. Edge dressing in map_ancient_sandbox_top is autumn trees — TABS: cypresses and white Greek houses with blue-tile walls (ref: reference/maps/wiki/ancient_sandbox.png) 3. Spiral mountain absent in map_ancient_sandbox_island — TABS: tall spiral rock tower at the back (ref: reference/maps/greek_ancient_sandbox.png) 6. Ruins absent in map_ancient_sandbox_top — TABS: fallen columns and ruined arches (ref: reference/maps/wiki/ancient_sandbox.png)
b FAIL (564: struck 5 monolith clause): 1. Island outline in map_ancient_sandbox_top is a small rounded rectangle — TABS: very large irregular island with cliff terraces (ref: reference/maps/greek_ancient_sandbox.png) 2. Raised terraces with temples at the back edge absent in map_ancient_sandbox_top — TABS: brown-cliffed hills at the far edge (ref: reference/maps/wiki/ancient_sandbox.png) 3. Spiral mountain on the north centreline absent in map_ancient_sandbox_top — TABS: mountain on the centreline (ref: card Overview) 4. Offshore islets absent in map_ancient_sandbox_island — TABS: small islands in the distance (ref: card Overview) 5. Black slabs in mid-field in map_ancient_sandbox_battle — TABS: wide-open field (ref: reference/maps/wiki/ancient_sandbox.png)
c PASS (564 judge)
## Ranked gaps
1. [S] a — blocker 1: green meadow ground with brown dirt paths (grass/groundMat/blades recoloured, fieldTufts_* hidden, path ribbons)
2. [S] a — blocker 3: tall spiral rock tower on the back centre line
3. [S] b — blocker 5: the dark block row the 564 regex missed (battle shot 570-760,400-425): find its mesh names, hide with colliders, and the navy field boulders
4. [S] a — blocker 2: cypresses and white blue-trimmed houses in place of the autumn ring
## Attempts (iter | gap | criterion | verdict)
563 | [S] own builder; navy underside -> ring of faceted terracotta cliff facets + floor (a295aa5a) | a4 | APPROVE struck 4
564 | [S] base junk (Challenge Bluffs_box/_cyl/_totem_top) removed with colliders (d4443b87) | b5 | APPROVE struck monolith clause
564 | [S] blue sea disc to the horizon at y -11, shallows + foam rings (288ca462) | a5 | APPROVE struck 5
## Rejected (last 4)
## Notes (max 3 lines)
- No stages fought on it. Base is campaign.challenge (shared): dress it in tabs/ancient_sandbox.ts only.
- Critic 563: cliff is a smooth evenly lit salmon band with thin seams (TABS darker red-brown, deep buttresses, ledges, clefts).
- Critic 564: beige sky jars over the blue sea (TABS pale blue sky).
