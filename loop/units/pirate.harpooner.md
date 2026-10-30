# pirate.harpooner
Status: open   Audited: 422   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 422)
 2. the chin in unit_pirate.harpooner_idle - bare - TABS: a thick dark-brown beard under the eyes (ref: pirate.harpooner.red.png; card "fairly thick beard")
 3. the torso in unit_pirate.harpooner_idle - a dark closed tunic - TABS: an open team coat with tan lapels over a white V undershirt (ref: pirate.harpooner.red.png; card "open coat, undershirt")
 4. his height in lineup_pirate - level with the flintlock and bomb thrower beside him - TABS: 1.30x, a head over the rest of the crew (ref: reference/factions/pirate.jpg; card Size 1.30x)
  (struck 1 at 425)
b FAIL (2 since 422)
 3. the bayonet in unit_pirate.harpooner_idle - a hand-long stub under the barrel - TABS: a thin sword-bayonet under the barrel reaching down past the knee (ref: pirate.harpooner.red.png; card "sword-bayonet under the barrel")
  (struck 1 at 423; 2 at 424)
c FAIL (1 since 422)
 2. the harpooner's leg in unit_pirate.harpooner_struck - out of frame, summary.notes recording only fire and impact - TABS: a kick once the reeled man is in melee range (card Characteristics; Abilities Pirate Kick)
  (struck 1 at 425)
d PASS (cost 300, hp 3.38x, dmg 0.29x, cd 1.80x; 425 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c Pirate Kick - blocker 2: a leg kick with knockback on the reeled man once in reach, logged "kick" (simulationSystem _reelIn follow-up + proceduralAnimation) - ref: loop/cards/pirate.harpooner.md - ours: unit_pirate.harpooner_ability_after (425 rank 1)
2. [S] a open coat - blocker 3: team coat with tan lapels over a white V undershirt (pirateDress) - ref: pirate.harpooner.red.png - ours: unit_pirate.harpooner_idle (425 rank 2)
3. [S] b sword-bayonet - blocker 3: a thin blade under the barrel reaching past the knee (propBuilder harpoon) - ref: pirate.harpooner.red.png - ours: unit_pirate.harpooner_idle
## Attempts (iter | gap | criterion | verdict)
423 | HARPOON_BREECH team block under a carry handle, ringed nozzle (3f4bf980, 18f56ed9) | b | approved (struck 1)
424 | HARPOON_OFF_GRIP + _gripHarpoon off fist on the block (3f068837) | b | approved (struck 2)
425 | brown fitted tricorn, TRICORN_BROWN (75a4ea7d) | a | approved (struck 1)
425 | reel-in: ProjectileSystem.reelIn + _reelIn, HARPOON_REEL, taut rope to the chest (3f3fd30b, 443edc44) | c | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- The harpoon gun is propBuilder case "harpoon" (root "harpoonGun", HARPOON_BREECH, HARPOON_MUZZLE, HARPOON_OFF_GRIP); the reel is simulationSystem _reelIn (logs "reel", capture frames that pair on the man).
- 425 defects: tricorn cocked to one side and narrower than the head (TABS level, wider); the reel pair can't show how far he travels (lands at the harpooner's feet in TABS).
