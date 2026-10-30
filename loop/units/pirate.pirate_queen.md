# pirate.pirate_queen
Status: open   Audited: 422, 426 (RE-AUDIT c)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 422)
 4. the hips in unit_pirate.pirate_queen_idle - bare team legs from the tunic hem - TABS: a team wrap skirt with green beads at its hem over pink pants (ref: pirate.pirate_queen.red.png; card "red skirt with green beads")
  (struck 1 at 427; 3 at 428; 2 at 430)
b FAIL (2 since 422)
 1. the off hand in unit_pirate.pirate_queen_idle - a long dark rod held low - TABS: a jewelled sabre, a slim curved blade on a tan hilt (ref: pirate.pirate_queen.red.png; card Main Hand Piratequeen's Sabre / Appearance "jewel-embedded custom Sabre")
 2. the main-hand blade in unit_pirate.pirate_queen_idle - a straight broad double-edged sword with a cross guard - TABS: an unusually big curved cutlass with a tan guard (ref: pirate.pirate_queen.red.png; card "unusually big Cutlass")
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 430 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
0. evidence commit first on b.2: the idle shows the blade end-on (critic 430); the big cutlass shows in unit_pirate.pirate_queen_release - re-aim the blocker's shot (capture.mjs) before any b pick
1. [S] a skirt - blocker 4: queenSkirt, a faceted team wrap skirt from waist to knee, a slanted hem, a row of green bead balls along it (pirateDress) - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_idle (430 rank 2)
2. [S] b off-hand sabre - blocker 1: the slim CUTLASS (tan hilt, red jewel) in the off hand blade up, crossed over the main blade as in the render - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_idle (430 rank 3)
## Attempts (iter | gap | criterion | verdict)
425 | CUTLASS curved blade, tan cup hilt, both fists (e5226412) | b | approved (none struck)
426-427 | CUTLASS_SLASH blow; BOMB_SPIN + _POSE whirl, 7 bombs (45024151, 4e116860) | c | approved (c PASS)
427 | QUEEN_BANDANA team cap, flap over her left eye, knot and tails (2a45e931) | a | approved (struck 1)
428 | QUEEN_SASH brown strap right shoulder to left hip, four black bombs (72765079, cfa8f57b) | a | approved (struck 3)
430 | QUEEN_HAIR black pirateHair locks, curl lumps, tan beads (7899b9c6) | a | approved (struck 2)
430 | QUEEN_CUTLASS big curved main blade, weaponVariant queen_cutlass (83f4e760) | b | approved (none struck: idle shows it end-on)
## Rejected (last 4)
## Notes (max 3 lines)
- 427 defects: bandana cap a stiff box wider than the head (TABS tied tight); the 7 bombs leave in one frame at one height (TABS flung out through the whirl).
- Evidence 427: capture no longer counts the spin's bombs as her release (missile within 12 ticks of a special); release = melee hit ~2.5 s, ability = bombspin.
- 426 defect: release a level thrust at shoulder height (TABS sweeping low). Her blow is CUTLASS_SLASH (no "slam").
