# map.viking
Status: open   Audited: 562 (AUDIT x2)   Done: -
## Verdicts
a FAIL (571: struck 4): 3. Sky in map_viking_ground is warm beige haze — TABS: pale cyan fog with falling snow (ref: reference/maps/wiki/viking.png) 5. Island underside in map_viking_island is a navy slab with stalactites — TABS: icy white-blue rounded underside (ref: reference/maps/winter_viking.png) 6. Frozen waterfall absent in map_viking_island — TABS: waterfall at the top of the map (ref: card Overview)
b FAIL (571: struck 3): 2. Snowbanks with pine forest on the sides absent in map_viking_top — TABS: raised snowy shore with pines (ref: reference/stages/introduction.ice_archers_only_almost.png)
c PASS (571 judge)

## Ranked gaps
1. [S] a — cyan snow haze — blocker 3: pale cyan clearColor/fog and a falling-snow field — ref: reference/maps/wiki/viking.png — ours: map_viking_ground.png
2. [S] a — frozen waterfall — blocker 6: stacked pale-blue ice columns at the top of the lake — ref: loop/cards/maps/viking.md (Overview) — ours: map_viking_island.png
3. [S] b — raised snowbanks — blocker 2: raised snowy shore banks on both sides under the pines — ref: reference/stages/introduction.ice_archers_only_almost.png — ours: map_viking_top.png

## Attempts (iter | gap | criterion | verdict)
565 | [S] own builder; ice lake with crack network, snow banks (4d8db327) | a1 | APPROVE struck a1, b1
566 | [S] clear inherited obstacles and pits off the lake (1e70afc3) | b4 | APPROVE struck b4
570 | [S] layered snow pines (23af4ed0) | a | APPROVE, struck a2
571 | [S] wooden ship locked in the ice by the left shore (d5caaf8b) | b | APPROVE, struck b3 and a4

## Rejected (last 4)

## Notes (max 3 lines)
- Stages on it (8): introduction.ice_archers_only_almost, introduction.longships, challenge.ice_archer_and_friends, challenge.big_brawl, dynasty.viking_army, spooky.breakout, fantasy_good.clash_of_warriors, fantasy_evil.dismantle_the_spears.
- Critic 571: the ship is small and half behind the pines at the back-left (TABS large and clear on the left).
