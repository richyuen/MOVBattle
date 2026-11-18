# map.renaissance
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (576: struck 2): 1. arcaded palazzo in map_renaissance_island — TABS: a two-storey cream palazzo with an open arched loggia wrapping the courtyard's left corner (ref: reference/maps/wiki/renaissance.png) 3. pavement in map_renaissance_ground — TABS: large pale cream flagstones in a checker of slightly different shades, not blue-grey tiles with dark grout (ref: reference/stages/renaissance.balloons.png) 4. island base in map_renaissance_island — TABS: the city block sits on a plain pale stone base, not a stalactite slab (ref: reference/maps/renaissance_town.png) 5. house facades in map_renaissance_ground — TABS: Venetian houses with crenellated parapets, balconies, window shutters and planters, not flat stamped boxes (ref: reference/stages/pirate.boom_and_the_units_go_down.png) 6. sky in map_renaissance_island — TABS: bright white-blue haze with no mountain range (ref: reference/maps/renaissance_town.png)
b FAIL (580: struck 2, 5): 3. bridge to the right-hand block in map_renaissance_top — TABS: a covered arched bridge links the palace to the pink house at the back right (ref: reference/maps/wiki/renaissance.png) 6. Walk-in arcades in map_renaissance_top — TABS: open ground arcades under the palace and loggia that units can stand in; ours is a solid house wall (ref: card Appearance)
c PASS (580 judge)

## Ranked gaps
1. [S] a pale stone base — blocker 4: replace hanging underside with plain stone block — ref: reference/maps/renaissance_town.png — ours: map_renaissance_island.png
2. [S] a clear city skyline — blocker 6: bright white-blue haze instead of inherited mountains — ref: reference/maps/renaissance_town.png — ours: map_renaissance_island.png
3. [S] b covered bridge — blocker 3: elevated arched bridge from palace to back-right pink house — ref: reference/maps/wiki/renaissance.png — ours: map_renaissance_top.png

## Attempts (iter | gap | criterion | verdict)
580 | [S] front canal eae680b0; open centre 19ca5178 | b | APPROVE, struck b2, b5
580 | [S] cream pavement 304cb24f | a | APPROVE, no strike (a3 attempts 1)
576 | [S] Doge's-palace facade across the back (68a1fa37) | a | APPROVE, struck a2
577 | [S] rectangular piazza: straight side/back rows, corners, straight front wall (aa80ffb9) | b | APPROVE, struck b1
578 | [S] front terrace: row of 2-3 storey houses along z -30.5 for the low wall (0de40749) | b | APPROVE, struck b4

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: renaissance.a_new_art_wave, balloons, renaissance_fencer, pirate.boom_and_the_units_go_down, fantasy_good.chaotic_cavalry (enemies x 21..29.8, z 2.1..21.9). Zones |x| <= 43; base water hazard z -34..-14 (the terrace stands in it).
- 580: paving paler, but uniform cool-grey with continuous dark seams; cream checker still uncleared. Base bridge (0,-24) remains.
