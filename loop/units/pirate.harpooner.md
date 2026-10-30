# pirate.harpooner
Status: open   Audited: 422   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 422)
 2. the chin in unit_pirate.harpooner_idle - bare - TABS: a thick dark-brown beard under the eyes (ref: pirate.harpooner.red.png; card "fairly thick beard")
 4. his height in lineup_pirate - level with the flintlock and bomb thrower beside him - TABS: 1.30x, a head over the rest of the crew (ref: reference/factions/pirate.jpg; card Size 1.30x)
  (struck 1 at 425; 3 at 426)
b PASS (429: a thin sword-bayonet under the nozzle reaching past the knee)
c PASS (426: shoot, reel, kick all fire and show)
d PASS (cost 300, hp 3.38x, dmg 0.29x, cd 1.80x; 426 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a beard - blocker 2: thick dark-brown faceted beard round the jaw under the eyes (pirateDress) - ref: pirate.harpooner.red.png - ours: unit_pirate.harpooner_idle (429 rank 3)
2. [S] a size - blocker 4: build him at the card's 1.30x so he stands a head over the crew - ref: reference/factions/pirate.jpg - ours: lineup_pirate (429 rank 4)
## Attempts (iter | gap | criterion | verdict)
423 | HARPOON_BREECH team block under a carry handle, ringed nozzle (3f4bf980, 18f56ed9) | b | approved (struck 1)
424 | HARPOON_OFF_GRIP + _gripHarpoon off fist on the block (3f068837) | b | approved (struck 2)
425 | brown fitted tricorn, TRICORN_BROWN (75a4ea7d) | a | approved (struck 1)
425 | reel-in: ProjectileSystem.reelIn + _reelIn, HARPOON_REEL, taut rope to the chest (3f3fd30b, 443edc44) | c | approved (struck 1)
426 | OPEN_COAT team coat, tan lapels, white V (04163e67) | a | approved (struck 3)
426 | PIRATE_KICK front kick on the reeled man + PIRATE_KICK_POSE (1ae5476f, 9476aac6) | c | approved (struck 2; c PASS)
429 | HARPOON_BAYONET lug + thin blade under the nozzle (37ea2e85) | b | approved (struck 3; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Gun: propBuilder case "harpoon" (HARPOON_BREECH, HARPOON_MUZZLE, HARPOON_OFF_GRIP); reel simulationSystem _reelIn ("reel"); kick _landKicks ("kick"). Evidence 426: the ability pair shoots the kick, the reel shows in _struck.
- 426 defects: lapels thin and short, V small, coat flares as a stiff box below the waist; the kicking foot ends a man's width short of the knight.
- 429 defect: bayonet light grey, a little broad. 425: tricorn cocked, narrower than the head (TABS level, wider).
