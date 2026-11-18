# map.low_ground
Status: open   Audited: 587 (AUDIT x2), 591 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (0 since 591, CONFIRM list; critic 591 struck a5): 1. the team-1 bank (the slope climbing from the floor to the right-hand high flat) in map_low_ground_ground is drawn as a flat lilac-grey sheet the colour of the slab's side faces, so it reads as a sheer wall rather than ground — TABS: both banks are the same warm beige grid as the floor and the high flats, only a shade darker on the slope (ref: reference/maps/wiki/low_ground.png, the bank between x 120-940 and y 0-480)
b PASS (588: struck 1, 2, 3; CONFIRM 591)
c PASS (591 judge)

## Ranked gaps
1. [S] a bank tone — blocker 1: the shaded bank's lighting, not an emissive overlay (591's unlit sheet rendered (224,224,223), lighter than the flats, and was dropped): e.g. turn the trough so neither bank faces away from the sun, or give the slab vertex normals bent toward the light on the banks — ref: wiki/low_ground.png — ours: map_low_ground_ground.png

## Attempts (iter | gap | criterion | verdict)
591 | [S] kit sky untoned eadae3e9 (via map.hill) | a5 | APPROVE, struck a5
591 | [S] unlit bank sheets c8082cb0 (+51f659a2 glow, f37f2aeb fog) | a (CONFIRM 589 bank) | dropped, reverted d0d1eacd..a2badb4c (rendered (224,224,223), lighter than the flats)
589 | [P] kit haze 8d4fd3bc (via map.bridge) | a4 | APPROVE, struck a4; added a5
588 | [S] bounded grid slab with trough (low_ground.ts) ae6ad36b; pale sky 98ebf959 | b1, a4 | APPROVE, struck b1-b3, a1-a3

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/low_ground.ts: slab x +-60 |z|<=22, floor |x|<=10 at 0, banks to 7 m at |x| 20, 400 m skirt. Stage: simulation.pit (x 20..27.4).
- A 2nd CONFIRM fail on a makes it plateau.
