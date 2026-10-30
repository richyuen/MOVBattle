# pirate.captain
Status: open   Audited: 422, 431 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 431; the CONFIRM 431 list)
 1. legs in unit_pirate.captain_idle are dark team blue from coat hem to feet — TABS: beige pants between the coat tails, ending in black knee boots (ref: pirate.captain.blue.png, card Appearance "beige pants, black boots")
 2. hat in unit_pirate.captain_idle is a flat-topped black box with a skull — TABS: a black tricorn with an upturned peaked brim (ref: pirate.captain.red.png, pirate.captain.jpg)
 3. chest between the lapels in unit_pirate.captain_idle is coat-coloured with a beard block — TABS: white laced shirt over a tan vest with a team sash at the waist (ref: pirate.captain.blue.png, card Appearance "shirt under it and a cloth around the shirt")
b PASS (431: slim curved cutlass on a deep tan bowl guard; dragon pistol; CONFIRM 431)
c PASS (428: dragon pistol blast from the bell hurls the man; slash stays the release; CONFIRM 431)
d PASS (cost 1500, hp 14.67x, dmg 1.33x, cd 0.50x; 431 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a pants + boots - blocker 1: beige trouser shells on both legs from the coat hem down, black knee boots over the shins (pirateDress) - ref: pirate.captain.blue.png - ours: unit_pirate.captain_idle (CONFIRM 431)
2. [S] a tricorn - blocker 2: the pirate_hat crown with a brim turned up three ways into peaks (propBuilder pirate_hat) - ref: pirate.captain.jpg - ours: unit_pirate.captain_idle, _ability (CONFIRM 431)
3. [S] a shirt + sash - blocker 3: CAPTAIN_COAT's front a white laced shirt over a tan vest, a team sash at the waist - ref: pirate.captain.blue.png - ours: unit_pirate.captain_idle (CONFIRM 431)
## Attempts (iter | gap | criterion | verdict)
423-428 | TRICORN_PLATE; CUTLASS_SLASH; DRAGON_PISTOL; DRAGON_BLAST; CAPTAIN_COAT | a,b,c | approved (c PASS)
430 | CAPTAIN_PARROTS on the tricorn (674c7165) | a | approved (struck 2)
431 | CAPTAIN_BEARD brown beard, moustache, chest run (927e8a7a, ee1ab3a9) | a | approved (struck 4; a PASS; CONFIRM failed a)
431 | CUTLASS bowl guard + rolled rim (3021427b) | b | approved (struck 2; b PASS; CONFIRM passed b)
## Rejected (last 4)
## Notes (max 3 lines)
- unitVisuals: "cutlass" (buildCutlass, bowl guard since 431), off "flintlock" offhandVariant "dragon_pistol", fitted "pirate_hat", special "cape". Coat pirateDress captainCoat; beard captainBeard.
- 431 critic: beard's chest lump reads apart from the jaw beard (gap over the cravat); cutlass curve slight.
- 428 defects: blast flash a soft ball, no cone of fire; coat fronts plain slabs, no turned-back lapels.
