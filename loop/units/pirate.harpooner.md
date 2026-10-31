# pirate.harpooner
Status: open   Audited: 422, 431 (CONFIRM: failed a), 434 (CONFIRM: failed b), 436 (CONFIRM: failed a, b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 436; CONFIRM 436 list) plateau (CONFIRM failed 431, 436)
 1. torso in unit_pirate.harpooner_idle: pitched hard to one side in a hunch, a wide square box over hidden legs — TABS: stands upright and slim, the open coat hanging straight over the beige legs (ref: reference/units/pirate.harpooner.blue.png)
 2. coat trim in unit_pirate.harpooner_idle: the lapels are plain cream strips, with no orange/tan edging on the lapels, front edges or cuffs — TABS: a bold orange/tan band runs down both lapels and front edges and round the cuffs (ref: reference/units/pirate.harpooner.blue.png; reference/factions/pirate.jpg)
 3. hat in unit_pirate.harpooner_idle: reads as one flat brown plank tilted over the head — TABS: a tall brown tricorn with three upturned brim points (ref: reference/units/pirate.harpooner.red.png)
 4. trousers in lineup_pirate: pale grey-white — TABS: beige/tan rolled-up pants (ref: card Appearance; reference/units/pirate.harpooner.red.png)
b FAIL (1 since 436; [R] 437 approved, struck 2)
 1. off hand in unit_pirate.harpooner_idle: hangs free at the side, away from the gun (same in lineup_pirate, where the free arm sticks out to the side) — TABS: Weapon Type Two-handed, both hands on the gun, one on the top handle and one on the body (ref: reference/units/pirate.harpooner.blue.png; card Infobox)
c PASS (426: shoot, reel, kick; CONFIRM 431, 434, 436)
d PASS (cost 300, hp 3.38x, dmg 0.29x, cd 1.80x; 437 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b off fist on the bar - blocker 1: solve the off arm onto HARPOON_OFF_GRIP at rest after the rest seat is set (critic 437: the off fist hovers at chest height, short of the bar) - ref: pirate.harpooner.blue.png - ours: unit_pirate.harpooner_idle
2. [R] a stance + coat - every CONFIRM a list: upright slim body, the open coat hanging straight over the beige legs, orange/tan trim, three-point tricorn, beige pants - ref: pirate.harpooner.blue.png - ours: unit_pirate.harpooner_idle
## Attempts (iter | gap | criterion | verdict)
423-434 | HARPOON_BREECH, OFF_GRIP, TRICORN_BROWN, reel, OPEN_COAT, KICK, BAYONET, BEARD, scale, PANTS, SHOES | a,b,c | approved (c PASS)
435-436 | HARPOON_BAYONET spike (1026d70e); HARPOON_REST hip carry (b4465c82) | b | approved (struck 1, 2; CONFIRM 436 failed a, b)
437 | [R] gun carry: team drum main mass, short fat grey muzzle, long carry bar, both fists (0799890a) | b | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 437 critic: drum reads square, not eight-sided (minor). Off fist: _gripHarpoon now calls _restHarpoon then _offArmTo(grip); the reach falls short.
- Gun: propBuilder case harpoon (HARPOON_BREECH [R] 437 spec); anim _restHarpoon, _gripHarpoon; sim _reelIn, _landKicks.
