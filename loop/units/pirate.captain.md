# pirate.captain
Status: open   Audited: 422   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 422)
 2. the hat's crown in unit_pirate.captain_idle - bare - TABS: two parrots, one blue and one red, perched on it (ref: pirate.captain.red.png; card "two parrots")
 4. the chin in unit_pirate.captain_idle - dark hair hangs beside the face but the chin is bare - TABS: a long brown beard with a moustache under the eyes (ref: pirate.captain.red.png; card "long, brown beard")
  (struck 1 at 423; 3 at 428)
b FAIL (1 since 422)
 2. the main-hand blade in unit_pirate.captain_idle - a straight broad double-edged sword with a cross guard - TABS: a curved slim cutlass with a tan cup guard (ref: pirate.captain.red.png; card Main Hand Captain's Cutlass)
  (struck 1 at 427)
c PASS (428: dragon pistol blast from the bell hurls the man; slash stays the release)
d PASS (cost 1500, hp 14.67x, dmg 1.33x, cd 0.50x; 428 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a parrots - blocker 2: captainParrots(), two faceted birds (one blue, one red, pale beak, bead eyes) on the tricorn's brim either side of the crown (pirateDress) - ref: pirate.captain.red.png - ours: unit_pirate.captain_idle (428 NEXT)
## Attempts (iter | gap | criterion | verdict)
423 | TRICORN_PLATE skull + crossbones on the hat's front wall (f22c1648) | a | approved (struck 1)
425 | CUTLASS_SLASH level one-hand slash, aimBlowAt skips a cutlass (8b450772) | c | approved (struck 1)
427 | DRAGON_PISTOL off-hand variant held out alone by _aimPistol ("pistolHeldOut" mark) (e5f2be6b, d63a4705) | b | approved (struck 1)
428 | DRAGON_BLAST point-blank shot from the bell, range 3, cooldown 2, logged dragon_pistol (29111559) | c | approved (struck 2; c PASS)
428 | CAPTAIN_COAT open knee coat, tan shirt, white cravat, tan edges; no tunic skirt (9fb9986c) | a | approved (struck 3)
## Rejected (last 4)
## Notes (max 3 lines)
- unitVisuals: "cutlass" (propBuilder buildCutlass, slim curved on a tan cup since 425: b.2 is for a review of b to judge), off "flintlock" offhandVariant "dragon_pistol", fitted "pirate_hat", special "cape".
- 428 defects: blast flash a soft ball, no cone of fire; coat fronts plain slabs, no turned-back lapels. Coat in pirateDress captainCoat; blast simulationSystem _fireDragonPistol.
- 425 defect: in _flight/_struck the blade turns back along the forearm, pommel leading.
