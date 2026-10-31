# pirate.pirate_queen
Status: open   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: failed a), 434 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 434; the CONFIRM 434 list; [R] 435 approved, struck 2; struck 3 at 436; width clause of 1 struck at 437)
 1. body bulk in unit_pirate.pirate_queen_idle — clearly taller and broader than the captain in lineup_pirate — TABS: slim long-limbed build, about the captain's height (ref: pirate.pirate_queen.red.png, factions/pirate.jpg)
b PASS (431: both blades crossed in an X at rest, the big cutlass and the jewelled sabre; CONFIRM 431, 434)
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises; CONFIRM 431, 434)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 438 stats; size 1.72 vs wiki 1.4)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] a scale - blocker 1: unitVisuals queen scale 1.45 down toward the captain's height (wiki size 1.4 vs ours 1.72; 438 DEFECTS name it the root, so v6 lets it move once) - ref: factions/pirate.jpg - ours: lineup_pirate (438 review)
2. [S] a leg length - blocker 1: queenFrame shortens the leg chain (upper/lower leg joint offsets) and the boot shafts to ~.85 so she stands at the captain's height; leave the unitVisuals scale row (435) alone - ref: factions/pirate.jpg - ours: lineup_pirate (critic 438)
## Attempts (iter | gap | criterion | verdict)
425-431 | CUTLASS, CUTLASS_SLASH, BOMB_SPIN, QUEEN_BANDANA, QUEEN_SASH, QUEEN_HAIR, QUEEN_CUTLASS, QUEEN_GUARD, QUEEN_SKIRT | a,b,c | approved (b, c PASS; CONFIRM 431 failed a)
432-434 | QUEEN_SKIRT flap, frontDrop, pale legs; QUEEN_SHIRT; QUEEN_DREADS | a | approved (struck 1, 2, 3; CONFIRM 434 failed a)
435 | [R] QUEEN_BOOTS build spec: scale 1.45 bulk .85, slimmer shirt/skirt, red-brown boots + team band, broad sash (ae0de203) | a | approved (struck 2)
436 | QUEEN_UPRIGHT rest stance, no crouch (bdf2f44d) | a | approved (struck 3; the "hunched" clause of 1 cleared)
437 | QUEEN_FRAME narrow trunk, yoke, cape, shoulders, pelvis, hips (b5120813) | a | approved (width clause of 1 struck)
438 | [P] QUEEN_FRAME trunk cut to .85 tall, neck/shoulders lowered (2a71c0b0) | a | approved (no strike: ~1.15x the captain's height)
## Rejected (last 4)
## Notes (max 3 lines)
- 438 critic: still ~1.15x the captain's height to the hat and wider at the shoulder than his coat; the root is the scale 1.45 row (approved 435, no [P] reversal).
- Spec of the [R] at pirateDress QUEEN_BOOTS; QUEEN_FRAME (437, tall 438) runs before her dress in unitFactory; stance proceduralAnimation QUEEN_UPRIGHT.
