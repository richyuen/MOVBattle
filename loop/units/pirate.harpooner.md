# pirate.harpooner
Status: open   Audited: 422   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 422)
 1. the head in unit_pirate.harpooner_idle - a flat grey-blue beret - TABS: a wide brown tricorn with its brim turned up three ways (ref: pirate.harpooner.red.png; card "brown tricorn hat")
 2. the chin in unit_pirate.harpooner_idle - bare - TABS: a thick dark-brown beard under the eyes (ref: pirate.harpooner.red.png; card "fairly thick beard")
 3. the torso in unit_pirate.harpooner_idle - a dark closed tunic - TABS: an open team coat with tan lapels over a white V undershirt (ref: pirate.harpooner.red.png; card "open coat, undershirt")
 4. his height in lineup_pirate - level with the flintlock and bomb thrower beside him - TABS: 1.30x, a head over the rest of the crew (ref: reference/factions/pirate.jpg; card Size 1.30x)
b FAIL (2 since 422)
 3. the bayonet in unit_pirate.harpooner_idle - a hand-long stub under the barrel - TABS: a thin sword-bayonet under the barrel reaching down past the knee (ref: pirate.harpooner.red.png; card "sword-bayonet under the barrel")
  (struck 1 at 423; 2 at 424)
c FAIL (0 since 422)
 1. the knight in unit_pirate.harpooner_struck - on its feet swinging its sword, the line slack - TABS: hauled along the line to the harpooner once the harpoon lands (card Characteristics "reel in the enemy unit")
 2. the harpooner's leg in unit_pirate.harpooner_struck - out of frame, summary.notes recording only fire and impact - TABS: a kick once the reeled man is in melee range (card Characteristics; Abilities Pirate Kick)
d PASS (cost 300, hp 3.38x, dmg 0.29x, cd 1.80x; 424 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a brown tricorn - blocker 1: a wide brown tricorn (pirate_hat corners turned up three ways, in brown) replacing the beret - ref: pirate.harpooner.red.png - ours: unit_pirate.harpooner_idle (424 rank 1)
2. [S] c reel-in - blocker 1: after the harpoon lands, pull the struck unit along the line to the harpooner (simulationSystem pull_hook) - ref: card Characteristics - ours: unit_pirate.harpooner_struck (424 rank 2)
3. [S] b sword-bayonet - blocker 3: a thin blade under the barrel reaching past the knee (propBuilder harpoon) - ref: pirate.harpooner.red.png - ours: unit_pirate.harpooner_idle
## Attempts (iter | gap | criterion | verdict)
423 | HARPOON_BREECH team block under a carry handle, ringed nozzle (3f4bf980, 18f56ed9) | b | approved (struck 1)
424 | HARPOON_OFF_GRIP + _gripHarpoon off fist on the block (3f068837) | b | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- The harpoon gun is propBuilder case "harpoon" (root "harpoonGun" at the fist on the handle, HARPOON_BREECH; the rope leaves HARPOON_MUZZLE; off fist on HARPOON_OFF_GRIP); the pull is simulationSystem pull_hook.
- 424 defects: in _windup/_release one hand is raised free (the run/hip-shot arm pose may run after _gripHarpoon); in _release the nozzle and line point behind him (c).
