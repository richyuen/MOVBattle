# map.legacy
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (578: struck 2, 3): 4. snow mountains in map_legacy_island — TABS: snow-capped valley walls rising all around the glade, not a floating grey range (ref: reference/maps/wiki/legacy.png) 5. ruined building in map_legacy_top — TABS: a crumbling sandstone ruin with dead trees on the right (ref: reference/maps/wiki/legacy.png) 6. tent camps in map_legacy_top — TABS: small blue tents on the left edge and red tents on the right (ref: card Overview; reference/stages/legacy.a_tank.png) 7. Sky in map_legacy_island — TABS: clear pale-blue sky; ours is grey-white haze (ref: reference/stages/legacy.a_tank.png)
b FAIL (578: struck 5): 1. church placement in map_legacy_top — TABS: the church stands at the back centre with a graveyard and a winding dirt path (ref: reference/maps/wiki/legacy.png) 2. island form in map_legacy_island — TABS: a round glade in a valley floor, not a floating slab (ref: reference/maps/legacy.png) 3. field outline in map_legacy_top — TABS: a wide round meadow with scattered grey boulders (ref: reference/maps/wiki/legacy.png) 4. graveyard in map_legacy_top — TABS: headstone rows on both sides of the church (ref: card Appearance; reference/maps/legacy.png)
c PASS (578 judge)

## Ranked gaps
1. [S] b graveyard — blocker 4: headstone rows both sides of the church, a winding sandy path from its door (clears b1's clauses too) — ref: reference/maps/legacy.png — ours: map_legacy_top.png
2. [S] a snow mountains — blocker 4: snow-capped valley walls round the island for the floating range, sky pale blue — ref: reference/maps/wiki/legacy.png — ours: map_legacy_island.png
3. [S] a tent camps — blocker 6: blue ridge tents on the left rim, red on the right, inside the pines, outside zones — ref: reference/stages/legacy.a_tank.png — ours: map_legacy_top.png

## Attempts (iter | gap | criterion | verdict)
576 | [S] dense stacked-cone pine band for the leafy ring (341586e1) | a | APPROVE, struck a1
577 | [S] yellow-green meadow, faceted clumps, zone slabs hidden (1d4cd558) | a | APPROVE, no strike (palette cleared; tall-tuft clause stands)
578 | [S] open glade: barricade (22,0) and collider removed (5adcb485) | b | APPROVE, struck b5
578 | [S] dark stone church at back centre, nave, transept, spired tower (486e6428) | a | APPROVE, struck a3
578 | [P] meadow tufts upright (30f467e1) | a | APPROVE, struck a2

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: legacy.a_tank, the_war, thor_s_battle, fantasy_good.fortified_formation (enemies x 7..21, |z| <= 10). Church at (0..10, 28.5..35.5), tower x -6.5.
- Critic 578: black round base tree right in front of the church door (base prop "tree" (0,24)); low grey wall stubs on the field; church uniformly dark and smooth.
- Critic 578: tufts rounded olive lumps (TABS thin pale blades); pines saturated mid green (576).
