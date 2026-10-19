# farmer.potion_seller
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 375)
 1. torso in unit_farmer.potion_seller_idle: broad square box wider than the shoulders — TABS: slim fitted dark-team jerkin, light-team lower band, brown undershirt flap (ref: .red.png)
 2. head in unit_farmer.potion_seller_idle: cuboid with a flat hair cap — TABS: unusually round head with an umber hair cap (ref: .red.png, card)
b FAIL (1 since 375)
 1. flasks in unit_farmer.potion_seller_idle (also _windup): size and faceting now match (375), but the bulb floats up the forearm toward the elbow, not gripped in the fist; glass near-white; idle shows one — TABS: pale-teal flask gripped in each fist, bulb below/ahead of it at the hip (ref: .red.png)
c PASS (375)
d PASS (cost 340, hp 0.76x, dmg 0.11x, cd 3.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a torso — blocker 1: slim fitted dark-team jerkin, light-team lower band, brown undershirt flap, replacing the box torso — ref: .red.png — ours: unit_farmer.potion_seller_idle.png
2. [P] b flask seat — fallout of 5af9646: POTION.seat .06 -> -.02, glass (.45,.68,.72) — NEXT shot: unit_farmer.potion_seller_idle (bulb drops into the fist at the hip)
3. [S] a round head — blocker 2: round head with hair cap — ref: .red.png — ours: unit_farmer.potion_seller_idle.png
## Attempts (iter | gap | criterion | verdict)
339-345 | bottle per hand, lobbed bottle, drunk splash, hair cap, jerkin, hosen + boots [S] | a,b,c | approved
375 | chunky faceted flask: bulb .12, shoulder, neck, lip, cork (POTION) [S] (5af9646) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Off-hand flask is vis() offhandWeapon "potion" (both hands carry one; the off one sits low/behind). THROWS_HELD_PROP flies the held mesh.
- 345 critic: boot cuffs a little high. 344: V reads tan at lineup distance.
- 342 critic: splash cloud one big opaque blob hiding the victim.
