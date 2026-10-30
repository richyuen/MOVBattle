# pirate.pirate_queen
Status: open   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 431; the CONFIRM 431 list)
 1. front of the lower body in unit_pirate.pirate_queen_idle reads as pale baggy trousers from hip to knee — TABS: a team-colour skirt hanging over the front to the knees with a slanted hem (ref: pirate.pirate_queen.red.png, card Appearance "a red skirt with green beads around it")
 2. arms in unit_pirate.pirate_queen_idle are bare from the shoulder below a sleeveless dark block vest — TABS: puffy short team sleeves over a laced shirt (ref: pirate.pirate_queen.red.png, card Appearance "red short-sleeved shirt")
 3. hair in unit_pirate.pirate_queen_idle is flat black hanging at the sides of the bandana — TABS: beaded dreadlocks sprouting up above the bandana (ref: pirate.pirate_queen.red.png, pirate.pirate_queen.png, card Appearance "curly long hair with hair beads")
b PASS (431: both blades crossed in an X at rest, the big cutlass and the jewelled sabre; CONFIRM 431)
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises; CONFIRM 431)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 431 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a skirt front - blocker 1: QUEEN_SKIRT's front reads as pale trousers: the team skirt covering the front to the knee, the slant steeper, pants hidden above the knee - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_idle (CONFIRM 431)
2. [S] a sleeves + shirt - blocker 2: puffy short team sleeves over each upper arm, a laced team shirt over the dark trunk - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_idle (CONFIRM 431)
3. [S] a dreads - blocker 3: beaded dreadlocks sprouting up and out above the bandana (pirateDress queenHair) - ref: pirate.pirate_queen.png - ours: unit_pirate.pirate_queen_ability (CONFIRM 431)
## Attempts (iter | gap | criterion | verdict)
425-427 | CUTLASS both fists; CUTLASS_SLASH; BOMB_SPIN; QUEEN_BANDANA | a,b,c | approved (c PASS; struck a.1)
428-430 | QUEEN_SASH; QUEEN_HAIR; QUEEN_CUTLASS (72765079, 7899b9c6, 83f4e760) | a, b | approved (struck a.3, a.2)
431 | QUEEN_GUARD _restQueenBlades crossed blades (fe03e273) | b | approved (struck 1, 2; b PASS; CONFIRM passed b)
431 | QUEEN_SKIRT wrap skirt, green beads, pale pants (d06b4abd) | a | approved (struck 4; a PASS; CONFIRM failed a)
## Rejected (last 4)
## Notes (max 3 lines)
- 431 critic: blades cross high near the face (TABS mid-chest); skirt ends above the knee, slant shallow.
- 427 defects: bandana cap a stiff box wider than the head; the 7 bombs leave in one frame at one height.
- Evidence 427: release = melee hit ~2.5 s, ability = bombspin. Her blow is CUTLASS_SLASH (no "slam").
