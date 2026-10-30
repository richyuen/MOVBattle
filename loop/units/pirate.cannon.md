# pirate.cannon
Status: open   Audited: 422, 428 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 428; the CONFIRM list, the 422 list cleared at 428)
 1. rider's headgear in unit_pirate.cannon_idle is a flat-topped peaked cap with a jutting front brim, like a kepi - TABS: a brimless, rounded, team-coloured bandanna skullcap snug on the head (ref: reference/units/pirate.cannon.red.png, .blue.png; card Appearance "a bandanna")
 2. rider's face in unit_pirate.cannon_idle is plain team skin under the brim with no eyes showing - TABS: two big white bead eyes face the camera just under the bandanna (ref: reference/units/pirate.cannon.blue.png, .red.png)
b PASS (428: rider behind the breech, a fist on each handle; CONFIRM 428)
c PASS (427: a fast flat shot off the level barrel, level smoke trail; CONFIRM 428)
d PASS (cost 1000, hp 6.25x, dmg 2.09x, cd 3.00x; 428 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bandanna - blocker 1: a rounded brimless team bandanna skullcap on the rider in place of the crewCap crown + peak (pirate cannon only; dressCannonCrew cap=false, cap in pirateDress) - ref: pirate.cannon.blue.png - ours: unit_pirate.cannon_idle (CONFIRM 428)
2. [S] a bead eyes - blocker 2: two big white bead eyes on the rider's face under the bandanna, facing the camera (the operator body may have none at detailLevel "operator") - ref: pirate.cannon.blue.png - ours: unit_pirate.cannon_idle (CONFIRM 428)
## Attempts (iter | gap | criterion | verdict)
423 | CANNON_BARREL long faceted lathe barrel proud of the carriage (b1f1f4aa) | b | approved (struck 1)
425 | CANNON_WHEEL tall octagon-rimmed wheels with clamps, axle raised (5b429ac7, 396cefd1) | a | approved (struck 1)
426 | CANNON_SIGHT ring crosshair on the barrel's back (bd059354) | a | approved (struck 2, 4)
427 | LAUNCH.cannonball ballistic flat shot at 45 m/s (5adcac44) | c | approved (struck 1; c PASS)
428 | CANNON_HANDLES rider .66 behind the breech, fists on two handles (8009017b, 0a24e9b0) | b | approved (struck 2; b PASS)
428 | CANNON_SHIRT white shell, crewHoop bands team, striped sleeves (a478d4ce) | a | approved (struck 3; a PASS, CONFIRM failed a)
## Rejected (last 4)
## Notes (max 3 lines)
- A vehicle (vehicleBuilder buildCannon, special "cannon_base"); crewman dressed by dressCannonCrew (shared with the pumpkin catapult) + pirateDress cannonShirt. Barrel "barrel", sight "cannonSight", handles "cannonHandle".
- Evidence 428 (c6ac0351): idle swings .25 rad so the rider shows between the wheels; RE-AUDIT not needed (the CONFIRM judged a and b on it).
- 428 defects: handles stand up off the barrel's top (TABS off the blocks); stripes narrow white bands (TABS equal bands). 427: no muzzle flash at the bore.
