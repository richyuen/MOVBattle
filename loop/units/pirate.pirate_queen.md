# pirate.pirate_queen
Status: open   Audited: 422, 426 (RE-AUDIT c)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 422)
 2. the sides of the head in unit_pirate.pirate_queen_idle - bare - TABS: long black curly locks with beads hanging to the shoulders (ref: pirate.pirate_queen.red.png; card "curly long hair with hair beads")
 3. the chest in unit_pirate.pirate_queen_idle - a plain dark tunic - TABS: a brown sash slung from the shoulder across the chest carrying four black bombs (ref: pirate.pirate_queen.red.png; card "brown bomb sash")
 4. the hips in unit_pirate.pirate_queen_idle - bare team legs from the tunic hem - TABS: a team wrap skirt with green beads at its hem over pink pants (ref: pirate.pirate_queen.red.png; card "red skirt with green beads")
  (struck 1 at 427)
b FAIL (1 since 422)
 1. the off hand in unit_pirate.pirate_queen_idle - a long dark rod held low - TABS: a jewelled sabre, a slim curved blade on a tan hilt (ref: pirate.pirate_queen.red.png; card Main Hand Piratequeen's Sabre / Appearance "jewel-embedded custom Sabre")
 2. the main-hand blade in unit_pirate.pirate_queen_idle - a straight broad double-edged sword with a cross guard - TABS: an unusually big curved cutlass with a tan guard (ref: pirate.pirate_queen.red.png; card "unusually big Cutlass")
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 427 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bomb sash - blocker 3: a brown diagonal sash carrying four black bombs (pirateDress) - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_idle (427 rank 3)
2. [S] a locks - blocker 2: long black curly locks with beads to the shoulders - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_idle (427 rank 4)
3. [S] b big cutlass - blocker 2: an oversized curved cutlass with a tan guard in the main hand, blades out ahead of the fists - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_idle (426 rank 11)
## Attempts (iter | gap | criterion | verdict)
425 | CUTLASS curved blade, tan cup hilt, both fists (e5226412) | b | approved (none struck)
426 | slam replaced by CUTLASS_SLASH on the pending-blow path, carried through a step (45024151) | c | approved (struck 1)
427 | BOMB_SPIN + BOMB_SPIN_POSE: whirl, 7 bombs to ground points (projectile `at`/`flight`), thrown up (4e116860) | c | approved (struck 2; c PASS)
427 | QUEEN_BANDANA team cap, flap over her left eye, knot and tails (2a45e931) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 427 defects: bandana cap a stiff box wider than the head (TABS tied tight); the 7 bombs leave in one frame at one height (TABS flung out through the whirl).
- Evidence 427: capture no longer counts the spin's bombs as her release (missile within 12 ticks of a special); release = melee hit ~2.5 s, ability = bombspin.
- 426 defect: release a level thrust at shoulder height (TABS sweeping low). Her blow is CUTLASS_SLASH (no "slam").
