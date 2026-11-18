# map.renaissance
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (585: struck 4, 6): 3. pavement in map_renaissance_ground — TABS: large pale cream flagstones in a checker of slightly different shades, not blue-grey tiles with dark grout (ref: reference/stages/renaissance.balloons.png) 5. house facades in map_renaissance_ground — TABS: Venetian houses with crenellated parapets, balconies, window shutters and planters, not flat stamped boxes (ref: reference/stages/pirate.boom_and_the_units_go_down.png)
b PASS (585: struck 6 on map_renaissance_arcade; CONFIRM pending)
c PASS (585 judge)

## Ranked gaps
1. [S] a pavement — blocker 3: creamPavement replaced by warm cream flagstone checker in two or three shades with fine light joints — ref: reference/stages/renaissance.balloons.png — ours: map_renaissance_ground.png
2. [S] a house facades — blocker 5: facade kit (crenellated parapets, balconies with rails, shutters, window planters) on the house rows — ref: reference/stages/pirate.boom_and_the_units_go_down.png — ours: map_renaissance_ground.png

## Attempts (iter | gap | criterion | verdict)
585 | [S] haze sky 7325dec5; stone plinth 2cfb1cf0 | a6, a4 | 2 APPROVE, struck a6, a4
585 | [E] arcade shot a67a7d56 | b6 | APPROVE, struck b6 (b PASS)
584 | [S] corner palazzo 89c01adc; palace walk-in arcade 7813a271 | a1, b6 | 2 APPROVE, struck a1
582 | [S] covered bridge b0840e69 | b3 | APPROVE, struck b3
580 | [S] front canal eae680b0; open centre 19ca5178; cream pavement 304cb24f | a, b | 3 APPROVE, struck b2, b5 (a3 attempts 1)
576-578 | [S] palace, rectangular piazza, front terrace | a, b | 3 APPROVE, struck a2, b1, b4

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: renaissance.a_new_art_wave, balloons, renaissance_fencer, pirate.boom_and_the_units_go_down, fantasy_good.chaotic_cavalry (x21..29.8,z2.1..21.9).
- 585 critic fallout: the inherited oval floor drum's lavender rim shows on the plinth in front of the front row (hide/square it in stoneBase); sky a shade greyer than the near-white haze.
- a3 has 1 attempt (580 creamPavement): the next is a new checker mechanism, not a re-tune.
