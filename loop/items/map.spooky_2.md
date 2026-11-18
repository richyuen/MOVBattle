# map.spooky_2
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (579: struck 1, 2): 3. thorn thickets in map_spooky_2_top — TABS: giant dark thorn masses blocking the left and right paths (ref: card Overview; reference/maps/wiki/spooky_2.png) 4. pumpkin shrine in map_spooky_2_top — TABS: a large jack-o-lantern on a dead-tree mound where the pagoda stood (ref: reference/maps/wiki/spooky_2.png) 5. leafy round trees in map_spooky_2_ground — TABS: black leafless twisted trees only (ref: card Overview) 6. island sides in map_spooky_2_island — TABS: blue rock-column cliffs, not a stalactite slab (ref: reference/maps/spooky_2.png) 7. Torii gate in map_spooky_2_top — TABS: a dark torii at the left corner; ours has none (ref: reference/maps/wiki/spooky_2.png)
b FAIL (0 since 576): 1. dynasty terrace layout in map_spooky_2_top — TABS: Dynasty's square island rotated 180 degrees, with canals turned to fog, terraces and outer loop path (ref: card Overview; reference/maps/wiki/spooky_2.png) 2. arched bridges in map_spooky_2_top — TABS: big stone arched bridges and a wide central wooden stair cross the fog channels (ref: reference/maps/wiki/spooky_2.png) 3. grated centre in map_spooky_2_battle — TABS: the central pit is covered by a glowing iron grate (ref: card Overview; reference/stages/wild_west.spooky_army.png) 4. field outline in map_spooky_2_top — TABS: square with notched corners, not an oval (ref: reference/maps/spooky_2.png)
c PASS (579 judge)

## Ranked gaps
1. [S] map.spooky_2.a pumpkin shrine — blocker 4: large jack-o-lantern on a rocky dead-tree mound at the former pagoda corner — ref: reference/maps/wiki/spooky_2.png — ours: output/loop/iter-579/map_spooky_2_top.png
2. [S] map.spooky_2.b grated centre — blocker 3: raised square courtyard with four approaches and a visibly glowing iron grate; prove the light in a small capture first — ref: reference/stages/wild_west.spooky_army.png — ours: output/loop/iter-579/map_spooky_2_battle.png
3. [S] map.spooky_2.a dead trees — blocker 5: crooked bare black ring trunks and branching limbs for every round leafy crown — ref: loop/cards/maps/spooky_2.md Overview — ours: output/loop/iter-579/map_spooky_2_ground.png

## Attempts (iter | gap | criterion | verdict)
578 | [S] 43348d28 | b | APPROVE, no strike (fog and loop path cleared; no courtyard or terraces)
579 | [S] night sky (d8e18d58) | a | APPROVE, struck a2
579 | [S] night turf (b20691d0) | a | APPROVE, struck a1
579 | [S] grate (ca88f7b3, 6d6941ac, ac19ef0d; revert fc6bf11f) | b | dropped after 2 follow-ups, no glow

## Rejected (last 4)


## Notes (max 3 lines)
- Stages: spooky.war, wild_west.spooky_army, fantasy_good.vicious_terror. Fog channels are drawn only: vicious_terror stands in them.
- 579 grate dropped after two follow-ups: ember bed stayed black. Probe the light before building the replacement court.
