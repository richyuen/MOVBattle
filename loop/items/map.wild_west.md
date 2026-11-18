# map.wild_west
Status: open   Audited: 576 (AUDIT x2), 582 (CONFIRM: failed a, b)   Done: -
## Verdicts
a FAIL (583: struck 1): 2. Ground palette in map_wild_west_ground.png — TABS: the street is light peach sand under the warm sunset; ours is a dark, strongly rust-red surface dominating the frame (ref: reference/stages/wild_west.leading_cacti.png).
b FAIL (583: struck 1): 2. Inner rank's east end in map_wild_west_top.png — TABS: the enemy's street stays open, storefronts standing well back from where the armies form up, not a side wall 6 m from the line that hides it from the player's half (ref: reference/stages/wild_west.leading_cacti.png)
c PASS (583 judge)

## Ranked gaps
1. [S] b inner rank against the enemy line — blocker 2: shift the third ROWS entry west and inward (about x -10..11) or cut it to one building, 15 m or more clear of x 28.6 — ref: reference/stages/wild_west.leading_cacti.png — ours: stage_wild_west.leading_cacti_army.png
2. [S] a sandy street — blocker 2: peach sand floor and tufts (about (0.9,0.66,0.5)) as a surface mechanism, not a colour swap alone — ref: reference/stages/wild_west.leading_cacti.png — ours: map_wild_west_ground.png

## Attempts (iter | gap | criterion | verdict)
583 | [S] timber storefronts 17a180c4, b25c16e2 | a1 | APPROVE, struck a1
583 | [S] inner rank 35137805 | b1 | APPROVE, struck b1; added b2
582 | [S] crooked rock masses 61cfb0a4 | a3 | APPROVE, struck a3; first CONFIRM failed a,b
581 | [S] arches dc051619; street rows c305d702; round plaza 1f0d6c88 | a3, b1, b4 | 3 APPROVE, struck b1, b4
580 | [S] chapel 07b08bd1; base cd907413; mesa ridge 514d0cf8 | a, b | APPROVE, struck a5, a6, b2
576-578 | [S] town rows, barricade removed, desert rim, sunset sky | a, b | 4 APPROVE, struck a1, a2, a4, b3

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: wild_west.leading_cacti, bullets_and_chains, lone_ranger_and_his_friends (enemies x 28.6..35.5, z -25..-11). Zones x +-(27..61), z -27..-9 and 9..27.
- 583: the inner rank (z -23.5, x 2..23.4) fills the right 45% of those three stages' _army shots: clear it before stages_wild_west is audited.
- Critic 583: the near-side block shows blank purple backs with dark smudges in the island shot (TABS: slate roofs, boarded rear walls).
