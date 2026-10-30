# pirate.captain
Status: open   Audited: 422, 431 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 431; the CONFIRM 431 list)
 2. hat in unit_pirate.captain_idle is a flat-topped black box with a skull — TABS: a black tricorn with an upturned peaked brim (ref: pirate.captain.red.png, pirate.captain.jpg)
 3. chest between the lapels in unit_pirate.captain_idle is coat-coloured with a beard block — TABS: white laced shirt over a tan vest with a team sash at the waist (ref: pirate.captain.blue.png, card Appearance "shirt under it and a cloth around the shirt")
  (struck 1 at 432)
b PASS (431: slim curved cutlass on a deep tan bowl guard; dragon pistol; CONFIRM 431)
c PASS (428: dragon pistol blast from the bell hurls the man; slash stays the release; CONFIRM 431)
d PASS (cost 1500, hp 14.67x, dmg 1.33x, cd 0.50x; 432 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a tricorn - blocker 2: CAPTAIN_TRICORN black three-cornered hat with peaked upturned brims, skull on the front face, parrots re-seated on the two front corners, in place of the box hat (propBuilder pirate_hat) - ref: pirate.captain.red.png - ours: unit_pirate.captain_idle (critic 432)
2. [S] a chest - blocker 3: white laced shirt over a tan vest between the lapels, a team sash at the waist (CAPTAIN_COAT front) - ref: pirate.captain.blue.png - ours: unit_pirate.captain_idle (critic 432)
## Attempts (iter | gap | criterion | verdict)
423-428 | TRICORN_PLATE; CUTLASS_SLASH; DRAGON_PISTOL; DRAGON_BLAST; CAPTAIN_COAT | a,b,c | approved (c PASS)
430 | CAPTAIN_PARROTS on the tricorn (674c7165) | a | approved (struck 2)
431 | CAPTAIN_BEARD brown beard, moustache, chest run (927e8a7a, ee1ab3a9) | a | approved (struck 4; a PASS; CONFIRM failed a)
431 | CUTLASS bowl guard + rolled rim (3021427b) | b | approved (b PASS; CONFIRM passed b)
432 | CAPTAIN_LEGS tan pants, black knee boots, brass buckles (209964c9, 8a9e1309) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- unitVisuals: "cutlass" (buildCutlass), off "flintlock" offhandVariant "dragon_pistol", fitted "pirate_hat", special "cape". Coat captainCoat; beard captainBeard; legs captainLegs.
- 432 critic: boots run high and wide in the crouch (bootFrom .2), tan shows as a short band. 431: beard chest lump apart from the jaw.
- 428 defects: blast flash a soft ball, no cone of fire; coat fronts plain slabs, no turned-back lapels.
