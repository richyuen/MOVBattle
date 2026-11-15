# map.farmer_1
Status: open   Audited: 555 (AUDIT x2), 560 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (0 since 560, CONFIRM list): 1. grass tufts drawn over the river water and the bridge deck in map_farmer_1_ground.png — TABS: clean blue water and a bare stone bridge (ref: reference/maps/wiki/farmer_1.png) 2. flat slab bridge with boxy block parapets in map_farmer_1_ground.png — TABS: arched humped stone bridge (ref: reference/maps/wiki/farmer_1.png) 3. river drawn as a straight, ruler-edged canal in map_farmer_1_top.png — TABS: winding stream with rocky banks (ref: reference/maps/wiki/farmer_1.png)
b PASS (560: struck 3; CONFIRM 560)
c PASS (560 judge)
## Ranked gaps
1. [S] a — blocker 1: collapse fieldBlades quads within the river and bridge deck (|x - riverX(z)| < halfWidth + 0.6, bridge span) — ours: map_farmer_1_ground.png
2. [S] a — blocker 2: arched stone bridge (humped deck from curved segments, rounded arch under it, stone parapets as rows of blocks) replacing the flat slab
3. [S] a — blocker 3: river course with wider S-bends (RIVER bend/bendRate) and grey rocks along both banks; hazards and walls follow riverX
4. [P] a — MILL gap 2.8 -> 4 m so the wheel shows (fallout of d6119113) — map_farmer_1_island.png
## Attempts (iter | gap | criterion | verdict)
555-559 | a: watermill, red houses, meadow + tracks, earth bowl, ruins out + pumpkins | a | 5 APPROVE, struck 1, 3, 5, 6
555-558 | b: river, bridge, totem out, walls, wheat strips | b | 5 APPROVE, struck 1, 2, 4, 5, 6
560 | [S] eleven sparse leaning Scots pines replace ring trees + haze band (8105869f) | a4 | APPROVE struck 4
560 | [S] round island 54 x 48, crops/props past rim out, placement box hidden (22e0ba71, ba8232f8) | b3 | APPROVE struck 3
560 | [S] watermill rebuilt: plinths, battened boards, jettied plank storeys, plank roofs, 9 m wheel (d6119113) | a2 | APPROVE struck 2
## Rejected (last 4)
## Notes (max 3 lines)
- Builder tabs/farmer_1.ts on campaign.introduction; river |x|<4 (zones |x|>=5). islandOutline is the ellipse 54 x 48; earthBowl only 22 m deep (shows as a thin lip in the island shot).
- Critic 560: two round dark-green base trees left in the field (want olive bushes); wheel edge-on between halves reads as a ladder.
