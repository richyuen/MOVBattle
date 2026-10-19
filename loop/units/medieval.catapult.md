# medieval.catapult
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 355)
 2. wood in unit_medieval.catapult_idle flat plain mauve-brown — TABS: orange wood with team paint streaks on the beams (ref: medieval.catapult.blue.png)
 3. wheels in unit_medieval.catapult_idle large, black rubber-look tyres, stuck out at the sides — TABS: smaller wooden wheels, grey iron rims, tucked in at the frame corners (ref: medieval.catapult.red.png)
b PASS (355)
c PASS (351)
d PASS (cost 1000, hp 3.77x, dmg 0.85x, cd 5.01x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a wheels — blocker 3: wooden wheel with grey iron rim band, smaller, tucked in at the rail-end caps — ref: medieval.catapult.red.png — ours: unit_medieval.catapult_idle.png
2. [S] a wood — blocker 2: orange timber material plus team paint-streak strips on the beams and uprights — ref: medieval.catapult.blue.png — ours: unit_medieval.catapult_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | arm on a pivot, whips upright on the shot (CATAPULT_ARM, CATAPULT_THROW) [S] (df37545 +a4cb4c1) | c | approved
352 | faceted grey-brown boulder (BOULDER) [S] (639c5f4 +439f40c) | b | approved
354 | visible crewman: coif/shirt/belt/breeches, arms up to the bucket (CATAPULT_CREW) [S] (0264878 +e6055d9) | b | approved
355 | spoon bucket: open flared cup, rim ring, boulder sunk in it (CATAPULT_BUCKET) [S] (56a8ab6) | b | approved
356 | box trestle: rails, 3 crossbeams, caps, bolts, A-frame uprights, rear deck (CATAPULT_FRAME) [S] (4375f6d) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 355 (b PASS): the cup is a smooth flared cylinder; TABS bucket is chunky boxed timber in the arm's orange wood.
- The spooky pumpkin catapult shares buildCatapult (frame, bucket). The crewman stands on the rear deck (CATAPULT_FRAME.deck).
