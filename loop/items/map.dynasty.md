# map.dynasty
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (577: struck 5): 2. canal water in map_dynasty_top — TABS: bright turquoise canals with lily pads set in stone-walled channels (ref: reference/maps/wiki/dynasty.png) 3. island slab sides in map_dynasty_island — TABS: blue-grey faceted rock columns with green tufts, not a dark stalactite underside (ref: reference/maps/dynasty.png) 4. ground palette in map_dynasty_ground — TABS: saturated green lawn blocks edged by grey flagstone paths, not olive-brown dirt (ref: reference/stages/wild_west.shogun_s_samurai.png) 6. arched stone bridges in map_dynasty_ground — TABS: grey arched bridges with parapets crossing the canals (ref: reference/stages/dynasty.art_of_war.png)
b FAIL (577: struck 1): 2. central courtyard in map_dynasty_top — TABS: a square courtyard with a square bottomless pit, ringed by water and reached by bridges and stairs on all four sides (ref: card Overview; reference/maps/wiki/dynasty.png) 3. canal network in map_dynasty_top — TABS: canals cut the field into raised lawn terraces joined by stairs, not two straight grey bands (ref: reference/maps/wiki/dynasty.png) 4. outer flagstone loop path in map_dynasty_top — TABS: a stone path runs around the outer lawn ring (ref: reference/maps/wiki/dynasty.png) 5. stair flights between terraces in map_dynasty_battle — TABS: wide stone stairs climb between lawn levels (ref: reference/stages/wild_west.shogun_s_samurai.png) 6. torii placement in map_dynasty_top — TABS: torii gates stand on the rim at the corners opposite the pagoda, not inside the back field (ref: reference/maps/wiki/dynasty.png)
c PASS (578 judge)

## Ranked gaps
1. [S] a canal water — blocker 2: base canals repainted turquoise with lily pads in stone-walled channels (closes the courtyard's water ring) — ref: reference/maps/wiki/dynasty.png — ours: map_dynasty_top.png
2. [S] b torii placement — blocker 6: torii moved to the rim corners opposite the pagoda — ref: reference/maps/wiki/dynasty.png — ours: map_dynasty_top.png
3. [S] a island sides — blocker 3: blue-grey faceted rock-column underside with green tufts — ref: reference/maps/dynasty.png — ours: map_dynasty_island.png

## Attempts (iter | gap | criterion | verdict)
576 | [S] two-tier pagoda on a platform at the back corner (83a6bd2f) | a | APPROVE, struck a1
577 | [S] mint sky, range hidden (b1711009) | a | APPROVE, struck a5
577 | [S] square island with notched near-left corner (83c9ca4a) | b | APPROVE, struck b1
578 | [S] central courtyard: square court, 6 m square pit, E/W moats with bridges (61f64ff8, d3dab59a) | b | APPROVE, no strike (court and pit cleared; N/S water and stairs missing)

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: dynasty.samurai, art_of_war, renaissance.renaissance_vs_dynasty_3, wild_west.shogun_s_samurai (enemies x 30..34.9, |z| <= 6.6). Base canals are water hazards z +-12 (|x| <= 46, 10 m deep); courtyard |x|,|z| <= 7.
- Critic 578: N/S of the court the canals read grey-olive, no stairs onto the court. 577: mint greyish; cherry ring traces the old oval; notch reads as a bevel.
