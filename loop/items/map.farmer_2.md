# map.farmer_2
Status: open   Audited: 555 (AUDIT x2), 560 (CONFIRM: passed b; failed a), 561 (CONFIRM: failed a), 563 (CONFIRM: failed a), 564 (CONFIRM: failed a), 565 (CONFIRM: passed a; critic failed a)   Done: -
## Verdicts
a FAIL plateau (565: struck 1, 2, 4): 3. wheat field in map_farmer_2_top and map_farmer_2_ground is a dull brown-ochre, speckled dark from above — TABS: the wheat is a bright pale straw-gold, the lightest and warmest surface on the map (ref: reference/maps/wiki/farmer_2.png; reference/stages/adventure.the_tiniest_attack.png)
b PASS (560: struck 4; CONFIRM 560)
c PASS (565 judge)
## Ranked gaps
1. [R] a — blocker 3: wheatField re-spec from the wiki's sampled wheat, warm gold-orange about (0.93, 0.68, 0.3) with self-light <= 0.15 (fog and glow bleached 565's (1, 0.8, 0.3) x0.35 to cream from above, khaki at ground), the straw floor one step darker than the stalks
## Attempts (iter | gap | criterion | verdict)
555-559 | a: wheat, sheaves, olive meadow + furrows; b: walls, path, fence, alley | a, b | 11 APPROVE
560-561 | [S] farmhouse + pines, round island, stone walls, earth bowl, olive crowns + lumps | a, b | 5 APPROVE struck a1, a2, a3, a5, b4
563 | [R] khaki meadow, pale wheat, oak wall -> stacked-crown olives + bush clumps (115b231d) | a1-4 | APPROVE struck 1, 2, 4
564 | [R] tree groups of 2-3 with 4-block crowns over bush masses, hedge, 6 cottage-high heaps, warmer taller wheat (8992d360) | a1-3 | APPROVE (critic PASS a); CONFIRM failed a
565 | [R] rim discs -> bush+boulder masses, pale tan cottage, straw-gold wheat on a straw floor, alley strip gone (b84ba5a1) | a1-4 | APPROVE struck 1, 2, 4; CONFIRM passed a
## Rejected (last 4)
## Notes (max 3 lines)
- Team 1 armies stand in x 2..41, z -26..18 (inside the wheat). Ring: farmer2OliveCrowns/Dark, OliveTrunks (oliveGrove, GROVE_SITES, BUSH_HEAPS).
- Wheat colour history (LEDGER): 562 orange, 563 (0.95,0.8,0.32) too pale, 564 (0.9,0.66,0.2) ochre, 565 (1,0.8,0.3) x0.35 cream. Lower the self-light, not the hue.
- 565: CONFIRM passed a, the gap critic kept blocker 3: one blocker left; striking it sends a to CONFIRM.
