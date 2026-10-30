# pirate.harpooner
Status: open   Audited: 422, 431 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 431; the CONFIRM 431 list)
 1. legs in unit_pirate.harpooner_idle are dark team blue from hip to shoe — TABS: beige pants rolled up to mid-calf, bare team-skin shins below (ref: pirate.harpooner.red.png, pirate.harpooner.jpg, card Appearance "rolled-up beige pants")
 2. hat in unit_pirate.harpooner_idle is a flat brown slab — TABS: a tall brown tricorn with an upturned brim (ref: pirate.harpooner.red.png, pirate.harpooner.jpg)
 3. feet in unit_pirate.harpooner_idle are team-blue blocks — TABS: brown buckled shoes under grey socks (ref: pirate.harpooner.red.png, card Appearance "brown shoes")
b PASS (429: a thin sword-bayonet under the nozzle reaching past the knee; CONFIRM 431)
c PASS (426: shoot, reel, kick all fire and show; CONFIRM 431)
d PASS (cost 300, hp 3.38x, dmg 0.29x, cd 1.80x; 431 stats; size 1.30 vs wiki 1.3)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a rolled pants - blocker 1: piratePants (the flintlock's PIRATE_PANTS) in beige to mid-calf with a turned cuff - ref: pirate.harpooner.jpg - ours: unit_pirate.harpooner_idle (CONFIRM 431)
2. [S] a tricorn - blocker 2: the tricorn's brim turned up three ways, taller and wider than the head (propBuilder tricorn, TRICORN_BROWN) - ref: pirate.harpooner.red.png - ours: unit_pirate.harpooner_idle, _windup (CONFIRM 431)
3. [S] a shoes - blocker 3: grey socks and brown buckled shoes over the feet (pirateSocks plain + a shoe shell) - ref: pirate.harpooner.red.png - ours: unit_pirate.harpooner_idle (CONFIRM 431)
## Attempts (iter | gap | criterion | verdict)
423-426 | HARPOON_BREECH, HARPOON_OFF_GRIP; TRICORN_BROWN; reel-in; OPEN_COAT; PIRATE_KICK | a,b,c | approved (c PASS)
429 | HARPOON_BAYONET lug + thin blade (37ea2e85) | b | approved (struck 3; b PASS)
430 | PIRATE_BEARD jaw mass, sideburns, mouth (a2de9843) | a | approved (struck 2)
431 | [P] scale 1.05 -> 1.3 (ec00c268) | a | approved (struck 4; a PASS; CONFIRM failed a)
## Rejected (last 4)
## Notes (max 3 lines)
- Gun: propBuilder case "harpoon"; reel simulationSystem _reelIn; kick _landKicks. Evidence 426: the ability pair shoots the kick.
- 426 defects: lapels thin and short, coat flares as a stiff box below the waist. 429: bayonet light grey, a little broad.
