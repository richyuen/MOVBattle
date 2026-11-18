# map.spooky_2
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 576): 1. night palette in map_spooky_2_ground — TABS: deep navy night with blue-grey stone and dark grass, not maroon ground (ref: reference/maps/wiki/spooky_2.png) 2. sky in map_spooky_2_island — TABS: navy night void with no clouds and no mountain range (ref: reference/maps/spooky_2.png) 3. thorn thickets in map_spooky_2_top — TABS: giant dark thorn masses blocking the left and right paths (ref: card Overview; reference/maps/wiki/spooky_2.png) 4. pumpkin shrine in map_spooky_2_top — TABS: a large jack-o-lantern on a dead-tree mound where the pagoda stood (ref: reference/maps/wiki/spooky_2.png) 5. leafy round trees in map_spooky_2_ground — TABS: black leafless twisted trees only (ref: card Overview) 6. island sides in map_spooky_2_island — TABS: blue rock-column cliffs, not a stalactite slab (ref: reference/maps/spooky_2.png) 7. Torii gate in map_spooky_2_top — TABS: a dark torii at the left corner; ours has none (ref: reference/maps/wiki/spooky_2.png)
b FAIL (0 since 576): 1. dynasty terrace layout in map_spooky_2_top — TABS: Dynasty's square island rotated 180 degrees, with canals turned to fog, terraces and outer loop path (ref: card Overview; reference/maps/wiki/spooky_2.png) 2. arched bridges in map_spooky_2_top — TABS: big stone arched bridges and a wide central wooden stair cross the fog channels (ref: reference/maps/wiki/spooky_2.png) 3. grated centre in map_spooky_2_battle — TABS: the central pit is covered by a glowing iron grate (ref: card Overview; reference/stages/wild_west.spooky_army.png) 4. field outline in map_spooky_2_top — TABS: square with notched corners, not an oval (ref: reference/maps/spooky_2.png)
c PASS (578 judge)

## Ranked gaps
1. [S] a night palette — blocker 1: navy ground, dark grass, blue-grey stone, zone tint gone (after spooky_1 nightGrass, copied) — ref: reference/maps/wiki/spooky_2.png — ours: map_spooky_2_ground.png
2. [S] a sky — blocker 2: navy void, range and clouds hidden, moonlight (lights restored on dispose) — ref: reference/maps/spooky_2.png — ours: map_spooky_2_island.png
3. [S] b grated centre — blocker 3: raised square courtyard with a glowing iron grate over the pit, fog ringing it — ref: reference/stages/wild_west.spooky_army.png — ours: map_spooky_2_battle.png

## Attempts (iter | gap | criterion | verdict)
578 | [S] own builder: square island turned 180 deg, fog channels, kerbed banks, loop path, void band gone (43348d28) | b | APPROVE, no strike (fog and loop path cleared; no courtyard or terraces)

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: spooky.war, wild_west.spooky_army (enemies x 20, |z| <= 10), fantasy_good.vicious_terror (x 7, z -17.6..18): fog channels are drawn only (no hazard) because vicious_terror stands in them.
- Critic 578: kerbs and loop path glow white-blue (take out of glow, dull them); notch not visible, corners rounded (b4 partly).
