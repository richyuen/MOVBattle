# pirate.captain
Status: open   Audited: 422   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 422)
 2. the hat's crown in unit_pirate.captain_idle - bare - TABS: two parrots, one blue and one red, perched on it (ref: pirate.captain.red.png; card "two parrots")
 3. the torso in unit_pirate.captain_idle - a dark closed tunic ending at the hips - TABS: a long team coat with tan trim hanging open to the knees over a tan shirt and white cravat (ref: pirate.captain.red.png; card "long, team-colored coat")
 4. the chin in unit_pirate.captain_idle - dark hair hangs beside the face but the chin is bare - TABS: a long brown beard with a moustache under the eyes (ref: pirate.captain.red.png; card "long, brown beard")
  (struck 1 at 423)
b FAIL (1 since 422)
 2. the main-hand blade in unit_pirate.captain_idle - a straight broad double-edged sword with a cross guard - TABS: a curved slim cutlass with a tan cup guard (ref: pirate.captain.red.png; card Main Hand Captain's Cutlass)
  (struck 1 at 427)
c FAIL (1 since 422)
 2. missing: the dragon pistol blast - summary.notes records only a melee hit - TABS: a point-blank bell-muzzle shot that hurls the man (card Weapons off Flintlock Blunderbuss, force 3000, range 3)
  (struck 1 at 425)
d PASS (cost 1500, hp 14.67x, dmg 1.33x, cd 0.50x; 427 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c dragon pistol blast - blocker 2: fire the held-out bell pistol at range 3, force 3000, PISTOL_SHOT flash at the bell, logged as a second event - ref: card Weapons - ours: unit_pirate.captain_release (427 rank 1)
2. [S] a long coat - blocker 3: knee-length team coat with tan trim over a tan shirt and white cravat (OPEN_COAT cut long) - ref: pirate.captain.red.png - ours: unit_pirate.captain_idle (427 rank 2)
## Attempts (iter | gap | criterion | verdict)
423 | TRICORN_PLATE skull + crossbones on the hat's front wall (f22c1648) | a | approved (struck 1)
425 | CUTLASS_SLASH level one-hand slash, aimBlowAt skips a cutlass (8b450772) | c | approved (struck 1)
427 | DRAGON_PISTOL off-hand variant held out alone by _aimPistol ("pistolHeldOut" mark) (e5f2be6b, d63a4705) | b | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- unitVisuals: "cutlass" (propBuilder buildCutlass, slim curved on a tan cup since 425: b.2 is for a review of b to judge), off "flintlock" offhandVariant "dragon_pistol", fitted "pirate_hat", special "cape".
- 427: the factory overwrites mesh metadata, so the held-out mark is a child node. Defect: the pistol never fires (c.2).
- 425 defect: in _flight/_struck the blade turns back along the forearm, pommel leading.
