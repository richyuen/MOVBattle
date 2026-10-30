# pirate.pirate_queen
Status: open   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: failed a), 434 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 434; the CONFIRM 434 list; [R] 435 approved, struck 2; struck 3 at 436)
 1. body bulk in unit_pirate.pirate_queen_idle — torso and skirt a wide hunched block, about twice a pirate's width, and clearly taller and broader than the captain in lineup_pirate — TABS: slim long-limbed build, about the captain's height (ref: pirate.pirate_queen.red.png, factions/pirate.jpg)
b PASS (431: both blades crossed in an X at rest, the big cutlass and the jewelled sabre; CONFIRM 431, 434)
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises; CONFIRM 431, 434)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 436 stats; size 1.72 vs wiki 1.4)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a narrow build - blocker 1: narrow shirt trunk and skirt meshes with longer thinner legs (not a re-nudge of the 435 scale/bulk row) - ref: pirate.pirate_queen.red.png, factions/pirate.jpg - ours: lineup_pirate (critic 436)
## Attempts (iter | gap | criterion | verdict)
425-427 | CUTLASS both fists; CUTLASS_SLASH; BOMB_SPIN; QUEEN_BANDANA | a,b,c | approved (c PASS; struck a.1)
428-431 | QUEEN_SASH; QUEEN_HAIR; QUEEN_CUTLASS; QUEEN_GUARD; QUEEN_SKIRT | a, b | approved (b PASS; CONFIRM 431 failed a)
432-433 | QUEEN_SKIRT flap, frontDrop, pale leg meshes; QUEEN_SHIRT (4d8b3736, c521e5f2, c9dcb0cd, c4ad8740) | a | approved (struck 1, 2)
434 | QUEEN_DREADS spray + bead-tipped side locks (2f1f2b92) | a | approved (struck 3; a PASS; CONFIRM failed a)
435 | [R] QUEEN_BOOTS build spec: scale 1.45 bulk .85, slimmer shirt/skirt, red-brown boots + team band, broad sash (ae0de203) | a | approved (struck 2)
436 | QUEEN_UPRIGHT rest stance, no crouch (bdf2f44d) | a | approved (struck 3; the "hunched" clause of 1 cleared)
## Rejected (last 4)
## Notes (max 3 lines)
- 436 critic: upright now, sash and bombs show across the chest; still clearly taller than the captain and about twice his width in lineup_pirate.
- 434 critic [P] fallout: QUEEN_DREADS rise 1.05 -> 1.6, lean .8 -> .55 (spray lies flat).
- Evidence 427: release = melee hit ~2.5 s, ability = bombspin. Spec of the [R] at pirateDress QUEEN_BOOTS; stance proceduralAnimation QUEEN_UPRIGHT.
