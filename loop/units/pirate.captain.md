# pirate.captain
Status: done   Audited: 422, 431 (CONFIRM: failed a), 433 (CONFIRM: passed)   Done: 433
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (433: peaked tricorn struck 2, white laced shirt + tan vest + team sash struck 3; CONFIRM 433)
b PASS (431: slim curved cutlass on a deep tan bowl guard; dragon pistol; CONFIRM 431, 433)
c PASS (428: dragon pistol blast from the bell hurls the man; slash stays the release; CONFIRM 431, 433)
d PASS (cost 1500, hp 14.67x, dmg 1.33x, cd 0.50x; 433 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
423-428 | TRICORN_PLATE; CUTLASS_SLASH; DRAGON_PISTOL; DRAGON_BLAST; CAPTAIN_COAT | a,b,c | approved (c PASS)
430 | CAPTAIN_PARROTS on the tricorn (674c7165) | a | approved (struck 2)
431 | CAPTAIN_BEARD brown beard, moustache, chest run (927e8a7a, ee1ab3a9) | a | approved (struck 4; a PASS; CONFIRM failed a)
431 | CUTLASS bowl guard + rolled rim (3021427b) | b | approved (b PASS; CONFIRM passed b)
432 | CAPTAIN_LEGS tan pants, black knee boots, brass buckles (209964c9, 8a9e1309) | a | approved (struck 1)
433 | CAPTAIN_TRICORN peaked walls, raised crown (1543b25e) | a | approved (struck 2)
433 | CAPTAIN_FRONT white laced shirt, tan V vest, team sash (5033a559) | a | approved (struck 3; a PASS; CONFIRM passed, D)
## Rejected (last 4)
## Notes (max 3 lines)
- unitVisuals: "cutlass" (buildCutlass), off "flintlock" offhandVariant "dragon_pistol", fitted "pirate_hat", special "cape". Coat captainCoat (CAPTAIN_FRONT); beard captainBeard; legs captainLegs.
- 433 critic: front band's top edge dips little at the skull; beard chest run floats over the shirt. CONFIRM 433: stockier body, coat trim beige not orange.
- pirate_hat is the captain's alone (the queen wears QUEEN_BANDANA): peakedWall only on pirate_hat.
