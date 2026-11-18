# map.renaissance
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (576: struck 2): 1. arcaded palazzo in map_renaissance_island — TABS: a two-storey cream palazzo with an open arched loggia wrapping the courtyard's left corner (ref: reference/maps/wiki/renaissance.png) 3. pavement in map_renaissance_ground — TABS: large pale cream flagstones in a checker of slightly different shades, not blue-grey tiles with dark grout (ref: reference/stages/renaissance.balloons.png) 4. island base in map_renaissance_island — TABS: the city block sits on a plain pale stone base, not a stalactite slab (ref: reference/maps/renaissance_town.png) 5. house facades in map_renaissance_ground — TABS: Venetian houses with crenellated parapets, balconies, window shutters and planters, not flat stamped boxes (ref: reference/stages/pirate.boom_and_the_units_go_down.png) 6. sky in map_renaissance_island — TABS: bright white-blue haze with no mountain range (ref: reference/maps/renaissance_town.png)
b FAIL (582: struck 3): 6. Walk-in arcades in map_renaissance_top — TABS: open ground arcades under the palace and loggia that units can stand in; ours is a solid house wall (ref: card Appearance)
c PASS (582 judge)

## Ranked gaps
1. [S] b ground arcades — blocker 6: recessed occupiable ground bays and matching collision openings — ref: reference/maps/wiki/renaissance.png — ours: map_renaissance_top.png
2. [S] a corner palazzo — blocker 1: two-storey cream wraparound loggia replacing rear-left frontage — ref: reference/maps/wiki/renaissance.png — ours: map_renaissance_island.png
3. [S] a pale stone base — blocker 4: plain stone block instead of hanging underside — ref: reference/maps/renaissance_town.png — ours: map_renaissance_island.png

## Attempts (iter | gap | criterion | verdict)
582 | [S] covered bridge b0840e69 | b3 | APPROVE, struck b3
580 | [S] front canal eae680b0; open centre 19ca5178 | b | APPROVE, struck b2,b5
580 | [S] cream pavement 304cb24f | a | APPROVE, no strike (a3 attempts 1)
576 | [S] palace 68a1fa37 | a | APPROVE, struck a2
577 | [S] rectangular piazza aa80ffb9 | b | APPROVE, struck b1
578 | [S] front terrace 0de40749 | b | APPROVE, struck b4

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: renaissance.a_new_art_wave, balloons, renaissance_fencer, pirate.boom_and_the_units_go_down, fantasy_good.chaotic_cavalry (x21..29.8,z2.1..21.9).
- Zones |x|<=43; base hazard z-34..-14; front terrace stands in it. Base bridge (0,-24) remains. Cream checker a3 still open.
