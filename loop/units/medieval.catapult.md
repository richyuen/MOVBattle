# medieval.catapult
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 355)
 2. wood in unit_medieval.catapult_idle flat plain mauve-brown — TABS: orange wood with team paint streaks on the beams (ref: medieval.catapult.blue.png)
b PASS (355)
c PASS (351)
d PASS (cost 1000, hp 3.77x, dmg 0.85x, cd 5.01x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a wood — blocker 2: orange timber material plus team paint-streak slabs on the beams and uprights — ref: medieval.catapult.blue.png — ours: unit_medieval.catapult_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | arm on a pivot, whips upright on the shot (CATAPULT_ARM, CATAPULT_THROW) [S] (df37545 +a4cb4c1) | c | approved
352 | faceted grey-brown boulder (BOULDER) [S] (639c5f4 +439f40c) | b | approved
354 | visible crewman: coif/shirt/belt/breeches, arms up to the bucket (CATAPULT_CREW) [S] (0264878 +e6055d9) | b | approved
355 | spoon bucket: open flared cup, rim ring, boulder sunk in it (CATAPULT_BUCKET) [S] (56a8ab6) | b | approved
356 | box trestle: rails, 3 crossbeams, caps, bolts, A-frame uprights, rear deck (CATAPULT_FRAME) [S] (4375f6d) | a | approved
357 | wheels: small faceted timber drums on grey iron tyres at the rail-end caps (CATAPULT_WHEEL) [S] (4c16604) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 357: iron tyres a little blue-grey, wheels a touch large (minor). critic 355: TABS bucket is chunky boxed timber in the arm's orange wood.
- The spooky pumpkin catapult shares buildCatapult (frame, bucket, wheels). The crewman stands on the rear deck (CATAPULT_FRAME.deck).
