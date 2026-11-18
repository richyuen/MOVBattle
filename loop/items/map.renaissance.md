# map.renaissance
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (584: struck 1): 3. pavement in map_renaissance_ground — TABS: large pale cream flagstones in a checker of slightly different shades, not blue-grey tiles with dark grout (ref: reference/stages/renaissance.balloons.png) 4. island base in map_renaissance_island — TABS: the city block sits on a plain pale stone base, not a stalactite slab (ref: reference/maps/renaissance_town.png) 5. house facades in map_renaissance_ground — TABS: Venetian houses with crenellated parapets, balconies, window shutters and planters, not flat stamped boxes (ref: reference/stages/pirate.boom_and_the_units_go_down.png) 6. sky in map_renaissance_island — TABS: bright white-blue haze with no mountain range (ref: reference/maps/renaissance_town.png)
b FAIL (582: struck 3): 6. Walk-in arcades in map_renaissance_top — TABS: open ground arcades under the palace and loggia that units can stand in; ours is a solid house wall (ref: card Appearance)
c PASS (584 judge)

## Ranked gaps
1. [S] a grey mountain range behind the city — blocker 6: hide the range, white-blue haze sky — ref: reference/maps/renaissance_town.png — ours: map_renaissance_island.png
2. [S] a stalactite slab under the city — blocker 4: plain pale stone block base replacing the dark hanging underside — ref: reference/maps/renaissance_town.png — ours: map_renaissance_island.png
3. [S] b arcade not shown walk-in — blocker 6: lit arcade floor and back wall plus a capture pose or units inside the ground arcade — ref: reference/maps/wiki/renaissance.png — ours: map_renaissance_top.png

## Attempts (iter | gap | criterion | verdict)
584 | [S] corner palazzo 89c01adc (starvation) | a1 | APPROVE, struck a1
584 | [S] palace walk-in arcade 7813a271 | b6 | APPROVE, no strike (attempt 1: hollow not shown by any shot)
582 | [S] covered bridge b0840e69 | b3 | APPROVE, struck b3
580 | [S] front canal eae680b0; open centre 19ca5178; cream pavement 304cb24f | a, b | 3 APPROVE, struck b2, b5 (a3 attempts 1)
576-578 | [S] palace, rectangular piazza, front terrace | a, b | 3 APPROVE, struck a2, b1, b4

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: renaissance.a_new_art_wave, balloons, renaissance_fencer, pirate.boom_and_the_units_go_down, fantasy_good.chaotic_cavalry (x21..29.8,z2.1..21.9).
- Evidence first on b6: map_renaissance_top cannot show the hollow. Re-aim with an evidence commit (skirmish units or a low pose from z ~15 looking +z at the palace front) and light the arcade floor and back wall.
- Palazzo: back wing x -44..-18.5 z 31, side wing x -44 from the left row's end to z 31; arcades 2.6 m deep (palace 3.2 m), colliders on the walls behind only.
