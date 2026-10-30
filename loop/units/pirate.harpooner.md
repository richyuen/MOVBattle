# pirate.harpooner
Status: open   Audited: 422, 431 (CONFIRM: failed a), 434 (CONFIRM: failed b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (434; CONFIRM 434 passed a)
b FAIL (0 since 434; the CONFIRM 434 list)
 1. sword-bayonet in unit_pirate.harpooner_idle — a broad sword blade jutting past the muzzle, longer than the whole gun and about the unit's height — TABS: a thin spike bayonet under the barrel, about as long as the barrel (ref: pirate.harpooner.red.png; card Appearance "sword-bayonet under the barrel")
 2. harpoon gun carry in unit_pirate.harpooner_idle — gun shouldered high across the chest, muzzle up and out (stood upright with the blade pointing at the sky in lineup_pirate) — TABS: gun hangs low at hip height, held by its top handle, muzzle down and forward (ref: pirate.harpooner.red.png, pirate.harpooner.jpg, factions/pirate.jpg)
c PASS (426: shoot, reel, kick all fire and show; CONFIRM 431, 434)
d PASS (cost 300, hp 3.38x, dmg 0.29x, cd 1.80x; 434 stats; size 1.30 vs wiki 1.3)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b thin bayonet - blocker 1: HARPOON_BAYONET as a thin spike under the barrel about the barrel's length, not a broad blade past the muzzle - ref: pirate.harpooner.red.png - ours: unit_pirate.harpooner_idle (CONFIRM 434)
2. [S] b low carry - blocker 2: a rest pose holding the gun by its top handle at the hip, muzzle down and forward - ref: pirate.harpooner.red.png, pirate.harpooner.jpg - ours: unit_pirate.harpooner_idle (CONFIRM 434)
## Attempts (iter | gap | criterion | verdict)
423-426 | HARPOON_BREECH, HARPOON_OFF_GRIP; TRICORN_BROWN; reel-in; OPEN_COAT; PIRATE_KICK | a,b,c | approved (c PASS)
429 | HARPOON_BAYONET lug + thin blade (37ea2e85) | b | approved (struck 3; b PASS)
430-433 | PIRATE_BEARD; [P] scale 1.3; HARPOONER_PANTS; HARPOONER_SHOES | a | approved (struck 2, 4, 1)
434 | HARPOONER_SHOES shell to .62 over the grass, sock to the top (10346a0f, 8c62322b) | a | approved (struck 3; a PASS; CONFIRM passed a, failed b)
## Rejected (last 4)
## Notes (max 3 lines)
- Gun: propBuilder case "harpoon" (HARPOON_BAYONET); reel simulationSystem _reelIn; kick _landKicks. Evidence 426: the ability pair shoots the kick.
- 434 critic left on a: sock a tall bulky block (a thin cuff in TABS), tongue/buckle unreadable. Legs take the head skin since 432.
