# pirate.bomb_thrower
Status: open   Audited: 422, 430 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 430; the CONFIRM 430 list)
 1. The bandana is a fixed slate blue-grey cap, in lineup_pirate on the red man (third unit from left) and in unit_pirate.bomb_thrower_idle (dark slate). TABS: the bandana is team-coloured, red on the red unit and blue on the blue unit (ref: reference/units/pirate.bomb_thrower.jpg; pirate.bomb_thrower.blue.png).
 2. No belt is visible at the waist, between the vest hem and the shorts, in unit_pirate.bomb_thrower_idle or lineup_pirate. TABS: a wide orange-brown leather belt with a big buckle at the waist, the unit's largest accent colour (ref: pirate.bomb_thrower.blue.png; pirate.bomb_thrower.jpg; reference/factions/pirate.jpg, third unit).
b PASS (422: two black fused bombs, one per hand, fist-sized; CONFIRM 430)
c PASS (422: overarm throw, high arc, orange blast hurls the knight; CONFIRM 430)
d PASS (cost 250, hp 1.89x, dmg 0.27x, cd 4.99x; 430 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a belt - blocker 2: pirateBelt, a wide orange-brown leather band round the waist over the vest hem with a big square tan buckle at the front (pirateDress) - ref: pirate.bomb_thrower.blue.png - ours: unit_pirate.bomb_thrower_idle, lineup_pirate (CONFIRM 430)
2. [S] a bandana - blocker 1: the "bandana" hat in the team colour (shared with the flintlock's blocker 1) - ref: pirate.bomb_thrower.jpg - ours: lineup_pirate (CONFIRM 430)
## Attempts (iter | gap | criterion | verdict)
423 | PIRATE_VEST open vest, the Flintlock's cut (9bb121db) | a | approved (struck 1)
424 | PIRATE_SHORTS ripped tan shorts, torn hem (d95ec795) | a | approved (struck 2)
429 | PIRATE_SOCKS grey top, six team/grey rings knee to shoe (784eeeca) | a | approved (struck 3)
430 | BOMB_SASH team band from the belt line to a pouch + fused bomb at the right hip (9c97ba97, 4ce95061) | a | approved (struck 4; a PASS; CONFIRM failed a)
## Rejected (last 4)
## Notes (max 3 lines)
- 430 defect: the sash band mostly hides under the vest hem in the idle; the bomb sits near the shorts' centre (TABS at the side of the thigh). 429: sock rings 1.3x the shin read as stacked collars.
- 424 summary records a "fire" event at 383 ms before the 1617 ms throw; release unchanged.
