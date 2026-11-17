# map.renaissance
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (576: struck 2): 1. arcaded palazzo in map_renaissance_island — TABS: a two-storey cream palazzo with an open arched loggia wrapping the courtyard's left corner (ref: reference/maps/wiki/renaissance.png) 3. pavement in map_renaissance_ground — TABS: large pale cream flagstones in a checker of slightly different shades, not blue-grey tiles with dark grout (ref: reference/stages/renaissance.balloons.png) 4. island base in map_renaissance_island — TABS: the city block sits on a plain pale stone base, not a stalactite slab (ref: reference/maps/renaissance_town.png) 5. house facades in map_renaissance_ground — TABS: Venetian houses with crenellated parapets, balconies, window shutters and planters, not flat stamped boxes (ref: reference/stages/pirate.boom_and_the_units_go_down.png) 6. sky in map_renaissance_island — TABS: bright white-blue haze with no mountain range (ref: reference/maps/renaissance_town.png)
b FAIL (577: struck 1): 2. front canal in map_renaissance_top — TABS: a green canal runs along the front edge behind a terrace of orange-roofed houses (ref: reference/maps/wiki/renaissance.png) 3. bridge to the right-hand block in map_renaissance_top — TABS: a covered arched bridge links the palace to the pink house at the back right (ref: reference/maps/wiki/renaissance.png) 4. front terrace row in map_renaissance_island — TABS: a solid front row of buildings closes the near side, not a low broken wall (ref: reference/maps/renaissance_town.png) 5. fountain in map_renaissance_top — TABS: the piazza centre is open paving, and the round thing there in the level shots is a unit, not a fountain (ref: reference/maps/renaissance_town.png) 6. Walk-in arcades in map_renaissance_top — TABS: open ground arcades under the palace and loggia that units can stand in; ours is a solid house wall (ref: card Appearance)
c PASS (577 judge)

## Ranked gaps
1. [S] b front terrace — blocker 4: solid orange-roofed front terrace along z -30.5 for the low wall — ref: reference/maps/renaissance_town.png — ours: map_renaissance_island.png
2. [S] a pavement — blocker 3: large pale cream flagstones in a soft checker, no dark grout — ref: reference/stages/renaissance.balloons.png — ours: map_renaissance_ground.png

## Attempts (iter | gap | criterion | verdict)
576 | [S] Doge's-palace facade across the back (68a1fa37) | a | APPROVE, struck a2
577 | [S] rectangular piazza: straight side/back rows, corners, straight front wall (aa80ffb9) | b | APPROVE, struck b1

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: renaissance.a_new_art_wave, balloons, renaissance_fencer, pirate.boom_and_the_units_go_down, fantasy_good.chaotic_cavalry (enemies x 21..29.8, z 2.1..21.9). Zones clipped to |x| <= 43 (577); water hazard z -34..-14.
- Critic 577: paving runs past the front wall onto the rounded lip; zone slabs stick out beyond the side rows. 576: facade a flat slab, ground arches solid (b6).
