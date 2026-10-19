# farmer.potion_seller
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 375)
 2. head in unit_farmer.potion_seller_idle: cuboid with a flat hair cap — TABS: unusually round head with an umber hair cap (ref: .red.png, card)
b FAIL (1 since 375)
 1. flasks in unit_farmer.potion_seller_idle (also _windup): the off-hand bulb sits a bulb's width up the arm from the hand, in the windup the held bulb floats above the open hand; glass near-white — TABS: pale-teal flask gripped in each fist by the neck, bulb below/ahead of it at the hip (ref: .red.png)
c PASS (375)
d PASS (cost 340, hp 0.76x, dmg 0.11x, cd 3.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b flasks — blocker 1: mount the flask by its neck in the fist with the bulb hanging below it (propBuilder potion mount), both arms low at the hips in idle (proceduralAnimation) — ref: .red.png — ours: unit_farmer.potion_seller_idle.png
2. [S] a round head — blocker 2: round faceted ico head, umber cap following its curve — ref: .red.png — ours: unit_farmer.potion_seller_idle.png
## Attempts (iter | gap | criterion | verdict)
339-345 | bottle per hand, lobbed bottle, drunk splash, hair cap, jerkin, hosen + boots [S] | a,b,c | approved
375 | chunky faceted flask: bulb .12, shoulder, neck, lip, cork (POTION) [S] (5af9646) | b | approved
376 | fitted 8-sided jerkin as his trunk, skirt band, lean build (farmerDress POTION_FIT) [S] (bfd2385) | a | approved
376 | flask seat .06 -> -.02, glass (.45,.68,.72) (POTION) [P] (665e5e0, reverted) | b | rejected
## Rejected (last 4)
- flask seat + glass [P] [1] — 376: seat along the prop axis does not put the bulb in the fist — glass steel-blue, TABS pale grey-green (184,200,195)
## Notes (max 3 lines)
- Off-hand flask is vis() offhandWeapon "potion". THROWS_HELD_PROP flies the held mesh. The trunk mesh is hidden (potionJerkin is the trunk).
- Critic 376 minor: in red light the jerkin reads muddy brown, not dark team red.
- 342 critic: splash cloud one big opaque blob hiding the victim. 345: boot cuffs a little high.
