# pirate.pirate_queen
Status: open   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 431; the CONFIRM 431 list)
 3. hair in unit_pirate.pirate_queen_idle is flat black hanging at the sides of the bandana — TABS: beaded dreadlocks sprouting up above the bandana (ref: pirate.pirate_queen.red.png, pirate.pirate_queen.png, card Appearance "curly long hair with hair beads")
  (struck 1, 2 at 433)
b PASS (431: both blades crossed in an X at rest, the big cutlass and the jewelled sabre; CONFIRM 431)
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises; CONFIRM 431)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 433 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a dreadlocks - blocker 3: replace the flat side panels with 5-7 thick black dreadlock bunches sprouting up and back from the bandana's top, splaying out, with tan beads - ref: pirate.pirate_queen.red.png, pirate.pirate_queen.png - ours: unit_pirate.pirate_queen_idle (critic 433)
2. [S] a hair falls - blocker 3: long curly locks hanging behind the shoulders from under the bandana, bead-tipped, in place of the flat slab beside the face - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_idle (critic 433)
## Attempts (iter | gap | criterion | verdict)
425-427 | CUTLASS both fists; CUTLASS_SLASH; BOMB_SPIN; QUEEN_BANDANA | a,b,c | approved (c PASS; struck a.1)
428-430 | QUEEN_SASH; QUEEN_HAIR; QUEEN_CUTLASS (72765079, 7899b9c6, 83f4e760) | a, b | approved (struck a.3, a.2)
431 | QUEEN_GUARD _restQueenBlades crossed blades (fe03e273) | b | approved (struck 1, 2; b PASS; CONFIRM passed b)
431 | QUEEN_SKIRT wrap skirt, green beads, pale pants (d06b4abd) | a | approved (struck 4; a PASS; CONFIRM failed a)
432 | QUEEN_SKIRT wrap flap, knee 1.08, slant .6, pale .18 (4d8b3736) | a | approved (none struck; 1 progressed)
433 | QUEEN_SKIRT frontDrop .4, trousers as pale leg meshes (c521e5f2) | a | approved (struck 1)
433 | QUEEN_SHIRT team trunk + yoke, puffy sleeves, laced V (c9dcb0cd, c4ad8740) | a | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- a has 3 approved [S] since the 431 list with strikes, so not plateau. 433 critic: skirt front near the legs' shade (hem reads off the beads); laced V hidden by sash + blades in the idle.
- 427 defects: bandana cap a stiff box wider than the head; the 7 bombs leave in one frame at one height.
- Evidence 427: release = melee hit ~2.5 s, ability = bombspin. Her blow is CUTLASS_SLASH (no "slam"). Hair: pirateDress queenHair (QUEEN_HAIR).
