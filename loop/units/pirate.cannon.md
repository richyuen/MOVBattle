# pirate.cannon
Status: done   Audited: 422, 428 (CONFIRM: failed a), 429 (CONFIRM: passed)   Done: 429
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (429: brimless team bandanna dome, bead eyes under it; CONFIRM 429)
b PASS (428: rider behind the breech, a fist on each handle; CONFIRM 428, 429)
c PASS (427: a fast flat shot off the level barrel, level smoke trail; CONFIRM 428, 429)
d PASS (cost 1000, hp 6.25x, dmg 2.09x, cd 3.00x; 429 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
423 | CANNON_BARREL long faceted lathe barrel proud of the carriage (b1f1f4aa) | b | approved (struck 1)
425 | CANNON_WHEEL tall octagon-rimmed wheels with clamps, axle raised (5b429ac7, 396cefd1) | a | approved (struck 1)
426 | CANNON_SIGHT ring crosshair on the barrel's back (bd059354) | a | approved (struck 2, 4)
427 | LAUNCH.cannonball ballistic flat shot at 45 m/s (5adcac44) | c | approved (struck 1; c PASS)
428 | CANNON_HANDLES rider .66 behind the breech, fists on two handles (8009017b, 0a24e9b0) | b | approved (struck 2; b PASS)
428 | CANNON_SHIRT white shell, crewHoop bands team, striped sleeves (a478d4ce) | a | approved (struck 3; a PASS, CONFIRM failed a)
429 | CANNON_BANDANNA brimless dome replacing dressCannonCrew's cap + peak (1f3e8df6) | a | approved (struck 1, 2; a PASS; CONFIRM passed, D)
## Rejected (last 4)
## Notes (max 3 lines)
- A vehicle (vehicleBuilder buildCannon, special "cannon_base"); crewman dressed by dressCannonCrew(cap=false) + pirateDress cannonShirt + cannonBandanna. Barrel "barrel", sight "cannonSight", handles "cannonHandle".
- 429 defect: bandanna team x.8, close to the skin. 428: handles stand off the barrel's top; stripes narrow white bands.
