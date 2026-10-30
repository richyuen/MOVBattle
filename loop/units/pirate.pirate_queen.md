# pirate.pirate_queen
Status: open   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: failed a), 434 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 434; the CONFIRM 434 list; [R] 435 approved, struck 2)
 1. body bulk in unit_pirate.pirate_queen_idle — torso and skirt a wide hunched block, about twice a pirate's width, and clearly taller and broader than the captain in lineup_pirate — TABS: slim long-limbed build, about the captain's height (ref: pirate.pirate_queen.red.png, factions/pirate.jpg)
 3. bomb sash in unit_pirate.pirate_queen_idle — only a thin brown strap behind the crossed blades, no bombs on the chest — TABS: a broad brown sash running diagonally from shoulder to hip, with four black bombs on it across the chest (ref: pirate.pirate_queen.red.png; card Appearance "brown bomb sash")
b PASS (431: both blades crossed in an X at rest, the big cutlass and the jewelled sabre; CONFIRM 431, 434)
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises; CONFIRM 431, 434)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 435 stats; size 1.72 vs wiki 1.4)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a upright slim build - blocker 1: an upright posture (not the crouch), narrow trunk and long thin limbs to the captain's height - ref: pirate.pirate_queen.red.png, factions/pirate.jpg - ours: unit_pirate.pirate_queen_idle, lineup_pirate (critic 435)
2. [S] a sash high on the chest - blocker 3: the sash and its four bombs seated high, collarbone to mid-chest, above the blade cross - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_idle (critic 435)
## Attempts (iter | gap | criterion | verdict)
425-427 | CUTLASS both fists; CUTLASS_SLASH; BOMB_SPIN; QUEEN_BANDANA | a,b,c | approved (c PASS; struck a.1)
428-431 | QUEEN_SASH; QUEEN_HAIR; QUEEN_CUTLASS; QUEEN_GUARD; QUEEN_SKIRT | a, b | approved (b PASS; CONFIRM 431 failed a)
432-433 | QUEEN_SKIRT flap, frontDrop, pale leg meshes; QUEEN_SHIRT (4d8b3736, c521e5f2, c9dcb0cd, c4ad8740) | a | approved (struck 1, 2)
434 | QUEEN_DREADS spray + bead-tipped side locks (2f1f2b92) | a | approved (struck 3; a PASS; CONFIRM failed a)
435 | [R] QUEEN_BOOTS build spec: scale 1.45 bulk .85, slimmer shirt/skirt, red-brown boots + team band, broad sash (ae0de203) | a | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 435 critic: still a wide hunched block taller than the captain (scale/bulk alone did not do it: the crouch pose + skirt read wide); sash bombs hidden behind the blades at the hip.
- 434 critic [P] fallout: QUEEN_DREADS rise 1.05 -> 1.6, lean .8 -> .55 (spray lies flat).
- Evidence 427: release = melee hit ~2.5 s, ability = bombspin. Spec of the [R] at pirateDress QUEEN_BOOTS.
