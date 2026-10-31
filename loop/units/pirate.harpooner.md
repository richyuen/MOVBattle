# pirate.harpooner
Status: open   Audited: 422, 431 (CONFIRM: failed a), 434 (CONFIRM: failed b), 436 (CONFIRM: failed a, b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 436; CONFIRM 436 list) plateau (CONFIRM failed 431, 436)
 1. torso in unit_pirate.harpooner_idle: pitched hard to one side in a hunch, a wide square box over hidden legs — TABS: stands upright and slim, the open coat hanging straight over the beige legs (ref: reference/units/pirate.harpooner.blue.png)
 2. coat trim in unit_pirate.harpooner_idle: the lapels are plain cream strips, with no orange/tan edging on the lapels, front edges or cuffs — TABS: a bold orange/tan band runs down both lapels and front edges and round the cuffs (ref: reference/units/pirate.harpooner.blue.png; reference/factions/pirate.jpg)
 3. hat in unit_pirate.harpooner_idle: reads as one flat brown plank tilted over the head — TABS: a tall brown tricorn with three upturned brim points (ref: reference/units/pirate.harpooner.red.png)
 4. trousers in lineup_pirate: pale grey-white — TABS: beige/tan rolled-up pants (ref: card Appearance; reference/units/pirate.harpooner.red.png)
b PASS (438: both fists on the gun, the off fist across the body on the carry bar)
c PASS (426: shoot, reel, kick; CONFIRM 431, 434, 436)
d PASS (cost 300, hp 3.38x, dmg 0.29x, cd 1.80x; 438 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a stance + coat - every CONFIRM a list: upright slim body, the open coat hanging straight over the beige legs, orange/tan trim on lapels, front edges and cuffs, tall three-point tricorn, beige rolled pants - ref: pirate.harpooner.blue.png, .red.png - ours: unit_pirate.harpooner_idle (critic 438)
## Attempts (iter | gap | criterion | verdict)
423-434 | HARPOON_BREECH, OFF_GRIP, TRICORN_BROWN, reel, OPEN_COAT, KICK, BAYONET, BEARD, scale, PANTS, SHOES | a,b,c | approved (c PASS)
435-436 | HARPOON_BAYONET spike (1026d70e); HARPOON_REST hip carry (b4465c82) | b | approved (struck 1, 2; CONFIRM 436 failed a, b)
437 | [R] gun carry: team drum main mass, short fat grey muzzle, long carry bar, both fists (0799890a) | b | approved (struck 2)
438 | off fist settled onto the carry bar (_gripHarpoon settle 2) (da4b3767) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- a starves at 440 (no a attempt since 434): its [R] takes the iteration's [R] slot first. 438 critic: the off fist is on the bar at the belly, not a raised top handle (minor).
- Gun: propBuilder case harpoon (HARPOON_BREECH [R] 437 spec); anim _restHarpoon, _gripHarpoon; sim _reelIn, _landKicks.
