# pirate.pirate_queen
Status: open   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: failed a), 434 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 434; the CONFIRM 434 list) plateau (CONFIRM failed a twice: next pick is one [R] specified from both CONFIRM lists)
 1. body bulk in unit_pirate.pirate_queen_idle — torso and skirt a wide hunched block, about twice a pirate's width, and clearly taller and broader than the captain in lineup_pirate — TABS: slim long-limbed build, about the captain's height (ref: pirate.pirate_queen.red.png, factions/pirate.jpg)
 2. boots in unit_pirate.pirate_queen_idle — lower legs and feet plain dark team blue — TABS: tall red-brown boots with a team-coloured band (ref: pirate.pirate_queen.blue.png; card Appearance "long red brown boots")
 3. bomb sash in unit_pirate.pirate_queen_idle — only a thin brown strap behind the crossed blades, no bombs on the chest — TABS: a broad brown sash running diagonally from shoulder to hip, with four black bombs on it across the chest (ref: pirate.pirate_queen.red.png; card Appearance "brown bomb sash")
b PASS (431: both blades crossed in an X at rest, the big cutlass and the jewelled sabre; CONFIRM 431, 434)
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises; CONFIRM 431, 434)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 434 stats; size 1.72 vs wiki 1.4)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a body rebuild - blockers 1-3: one dress mechanism from a spec off pirate.pirate_queen.red.png and factions/pirate.jpg: slim long-limbed build about the captain's height (unitVisuals scale 1.6 bulk 1.2 vs wiki size 1.4), tall red-brown boots with a team band in place of the dark shins, and QUEEN_SASH as a broad diagonal sash with four black bombs proud of the chest in front of the crossed blades; the CONFIRM 431 list (skirt, shirt, hair) must not regress - ours: unit_pirate.pirate_queen_idle, lineup_pirate (CONFIRM 431 + 434)
## Attempts (iter | gap | criterion | verdict)
425-427 | CUTLASS both fists; CUTLASS_SLASH; BOMB_SPIN; QUEEN_BANDANA | a,b,c | approved (c PASS; struck a.1)
428-431 | QUEEN_SASH; QUEEN_HAIR; QUEEN_CUTLASS; QUEEN_GUARD; QUEEN_SKIRT | a, b | approved (b PASS; CONFIRM 431 failed a)
432-433 | QUEEN_SKIRT flap, frontDrop, pale leg meshes; QUEEN_SHIRT (4d8b3736, c521e5f2, c9dcb0cd, c4ad8740) | a | approved (struck 1, 2)
434 | QUEEN_DREADS spray + bead-tipped side locks (2f1f2b92) | a | approved (struck 3; a PASS; CONFIRM failed a)
## Rejected (last 4)
## Notes (max 3 lines)
- 434 critic [P] fallout: QUEEN_DREADS rise 1.05 -> 1.6, lean .8 -> .55 (spray lies flat, about a quarter head tall).
- 427 defects: bandana cap a stiff box wider than the head; the 7 bombs leave in one frame at one height.
- Evidence 427: release = melee hit ~2.5 s, ability = bombspin. Blow CUTLASS_SLASH. Hair pirateDress queenHair (QUEEN_DREADS); sash QUEEN_SASH.
