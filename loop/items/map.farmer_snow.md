# map.farmer_snow
Status: open   Audited: 555 (AUDIT x2), 563 (CONFIRM: passed none; failed a, b), 569 (CONFIRM: passed b; failed a), 572 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (0 since 572; plateau, CONFIRM failed 3x): 1. snow ground colour in map_farmer_snow_island.png and map_farmer_snow_top.png: the whole field is a saturated cobalt blue that reads as water or paint — TABS: pale lavender-white snow lit blue by the night, with the field clearly lighter than the sky (ref: reference/maps/wiki/farmer_snow.png) 2. tall snow-laden broadleaf trees at the island corners, missing from map_farmer_snow_island.png — TABS: tall faceted lollipop trees with snow caps stand behind the mill, behind the houses and on the right rim, next to the pine grove (ref: reference/maps/wiki/farmer_snow.png) 3. island side band in map_farmer_snow_island.png: a near-black skirt with a few blue chips — TABS: a slate-blue rock band studded with snow-dusted stones under a thick white snow lip (ref: reference/maps/farm_snow.png)
b PASS (569: CONFIRM; 572 CONFIRM)
c PASS (572 judge)

## Ranked gaps
1. [R] a — snow palette, corner trees and slate side band — blockers 1-3: rebuild the night snow look (pale lavender-white field lighter than the sky, snow-capped faceted lollipop trees at the corners, slate-blue studded side band under a white lip), specced from every CONFIRM list — ref: reference/maps/wiki/farmer_snow.png, reference/maps/farm_snow.png — ours: map_farmer_snow_island.png, map_farmer_snow_top.png

## Attempts (iter | gap | criterion | verdict)
555-565 | river, snow, bridge, sky, grove, bowl, houses, mill, outline, lights, hills, slab | a, b | 13 APPROVE, b PASS 565
566-569 | [S] open rim, blue mill, boulder, furrows, carts | a | 5 APPROVE struck a1-a5
570 | [R] winter lighting and field dressing (1371524f+24937b53) | a | APPROVE, struck a2
572 | [R] snow-capped slate rock clusters + drawn mill-bank shade (2cf0d365) | a | APPROVE, struck a1, a3 (a PASS); CONFIRM failed a

## Rejected (last 4)

## Notes (max 3 lines)
- Sandbox map. Critic 572: mill shade plate reads as a stain; rock caps hide most slate from above.
- Every CONFIRM so far (563, 569, 572) failed a on palette or dressing: the next [R] must spec the field's snow colour against the wiki shot first.
