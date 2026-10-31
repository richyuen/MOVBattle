# pirate.pirate_queen
Status: open   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: passed b, c; failed a), 434 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 434) plateau (CONFIRM failed a twice, 431 and 434: the next pick on a is one [R] from both CONFIRM lists and blocker 1)
 1. body bulk in unit_pirate.pirate_queen_idle — clearly taller and broader than the captain in lineup_pirate — TABS: slim long-limbed build, about the captain's height (ref: pirate.pirate_queen.red.png, factions/pirate.jpg)
b PASS (431: both blades crossed in an X at rest, the big cutlass and the jewelled sabre; CONFIRM 431, 434)
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises; CONFIRM 431, 434)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 439 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a height and build - blocker 1: queenFrame shortens the torso and leg chain (upper/lower leg joint offsets, boot shafts to ~.85) to the captain's height, narrow shoulders, long legs; leave the unitVisuals scale row alone (spent its one exception move at 439) - ref: factions/pirate.jpg - ours: lineup_pirate (critic 439)
## Attempts (iter | gap | criterion | verdict)
425-431 | CUTLASS, CUTLASS_SLASH, BOMB_SPIN, QUEEN_BANDANA, QUEEN_SASH, QUEEN_HAIR, QUEEN_CUTLASS, QUEEN_GUARD, QUEEN_SKIRT | a,b,c | approved (b, c PASS; CONFIRM 431 failed a)
432-434 | QUEEN_SKIRT flap, frontDrop, pale legs; QUEEN_SHIRT; QUEEN_DREADS | a | approved (struck 1, 2, 3; CONFIRM 434 failed a)
435 | [R] QUEEN_BOOTS build spec: scale 1.45 bulk .85, slimmer shirt/skirt, red-brown boots + team band, broad sash (ae0de203) | a | approved (struck 2)
436 | QUEEN_UPRIGHT rest stance, no crouch (bdf2f44d) | a | approved (struck 3; the "hunched" clause of 1 cleared)
437 | QUEEN_FRAME narrow trunk, yoke, cape, shoulders, pelvis, hips (b5120813) | a | approved (width clause of 1 struck)
438 | [P] QUEEN_FRAME trunk cut to .85 tall, neck/shoulders lowered (2a71c0b0) | a | approved (no strike: ~1.15x the captain's height)
439 | [P] unitVisuals scale 1.45 -> 1.2 (65339e86) | a | approved (no strike: still about a head over the captain)
## Rejected (last 4)
## Notes (max 3 lines)
- 439 critic: still about a head taller than the captain, upper body boxy and broad-shouldered; the scale row is not rankable as [P] again.
- Spec of the [R] at pirateDress QUEEN_BOOTS; QUEEN_FRAME (437, tall 438) runs before her dress in unitFactory; stance proceduralAnimation QUEEN_UPRIGHT.
