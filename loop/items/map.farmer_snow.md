# map.farmer_snow
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (562: struck 3, 4): 5. evergreen grove in map_farmer_snow_top.png — TABS: a group of snowy evergreen pines at the upper right where Farmer 1's hay field is (ref: loop/cards/maps/farmer_snow.md Overview)
b FAIL (562: struck 3): 6. white snow lump standing out past the island rim in map_farmer_snow_island.png (right end, 1250-1310,480-520) and map_farmer_snow_top.png (lower right, 1150-1240,690-780) — TABS: the snow field ends cleanly at the round rim (ref: reference/maps/wiki/farmer_snow.png)
c PASS (562 judge)
## Ranked gaps
1. [S] b — blocker 6: in roundSnowIsland find the base mesh drawn at about (+50,-30) (a hill or edge disc, by name) and remap it to islandOutline or hide it with its collider
2. [S] a — blocker 5: pineGrove rebuilt dense: 12-15 dark-green tiered pines with white tier lines tight at x 15..40, z 18..40, in the glow pass (see LESSONS: glow-excluded meshes wear the snow's glow) and out of the fog
## Attempts (iter | gap | criterion | verdict)
555-558 | river, snow cover, bridge, night sky, pine grove | a, b | 5 APPROVE, struck a1, a2, b1, b2, b4
559 | [S] deep navy earth bowl, snow-capped stones (398e8db4, 29cc3e5a) | a6 | APPROVE struck a6, b6
561 | [S] two snow-roofed timber houses + two-halved mill (cb41584c) | b5 | APPROVE struck 5
562 | [S] round outline (ellipse 54 x 48), ring trunks thinned to 1 in 3, grove kept inside (e9d95cfa) | b3 | APPROVE struck 3, added 6
562 | [S] bulb strings between houses, on house 2 and mill gables, lit Christmas tree (d7b02859) | a3 | APPROVE struck 3
562 | [S] dark timber mill walls + framing + snow lines; dark buildings kept in the glow pass (23817396, 452f35d3) | a4 | APPROVE struck 4
## Rejected (last 4)
## Notes (max 3 lines)
- No stages fought on it. Builder tabs/farmer_snow.ts: own ice course, bridge, snowBuildings (houses (-26,36),(-11,39); mill z -41), festiveLights; nightSky restores lights in dispose.
- Critic 562: left/right ring trees still 2-3 deep as pale fogged ghosts; Christmas tree small, half hidden by a dark round tree; mill timber a bit warm/light.
