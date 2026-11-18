# map.low_ground
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (588: struck 1, 2, 3): 4. Grey sky band in map_low_ground_island — TABS: pale cyan haze (ref: wiki/low_ground.png)
b PASS (588: struck 1, 2, 3; CONFIRM pending)
c PASS (588 judge)

## Ranked gaps
1. [P] a sky hue — blocker 4, fallout of 98ebf959 (588; eligible to 591): simKit.ts paleSky haze (.86,.9,.9) -> (.78,.9,.92), span .57 -> .15 (see map.bridge) — ours: map_low_ground_island.png
2. [S] b bank shading — fallout of ae6ad36b (critic 588): the left bank reads like the floor in map_low_ground_top; darker bank facets so both slopes read

## Attempts (iter | gap | criterion | verdict)
588 | [S] bounded grid slab with trough (low_ground.ts) ae6ad36b | b1 | APPROVE, struck b1, b2, b3 (b PASS)
588 | [S] pale sky 98ebf959 | a4 | APPROVE, no strike (a1-a3 struck by ae6ad36b)

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/low_ground.ts: slab x +-60 |z|<=22, floor |x|<=10 at 0, banks to 7 m at |x| 20, 400 m skirt (culled grid material: the skirt has both windings). Stage: simulation.pit (x 20..27.4).
- Once a4 clears: CONFIRM (a and b).
