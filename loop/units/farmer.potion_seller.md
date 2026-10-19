# farmer.potion_seller
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (377)
b FAIL (2 since 375)
 1. flasks in unit_farmer.potion_seller_windup: the held flask floats in mid-air beside the head, clear of both hands; in unit_farmer.potion_seller_idle the bulb rides on top of each fist over the wrist, near head-sized; glass blue-grey (~146,162,180) — TABS: pale-teal flask (~184,200,195) gripped by the neck in each fist, bulb below/ahead of the fist at the hip (ref: .red.png, .jpg)
c PASS (375)
d PASS (cost 340, hp 0.76x, dmg 0.11x, cd 3.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b throw grip — blocker 1: keep potionBall under rightHand through the windup until the release (proceduralAnimation throw/windup path) — ref: .jpg, .red.png — ours: unit_farmer.potion_seller_windup.png
2. [S] b hip carry — blocker 1: orient the holder so the neck sits in the fist and the bulb hangs below/ahead; bulb ~.6 of the head across, glass pale teal (propBuilder potion holder, POTION_GLASS) — ref: .red.png — ours: unit_farmer.potion_seller_idle.png
## Attempts (iter | gap | criterion | verdict)
339-345 | bottle per hand, lobbed bottle, drunk splash, hair cap, jerkin, hosen + boots [S] | a,b,c | approved
375 | chunky faceted flask (POTION) [S] (5af9646) | b | approved
376 | fitted 8-sided jerkin, lean build (POTION_FIT) [S] (bfd2385) | a | approved; flask seat + glass [P] (665e5e0, reverted) | b | rejected
377 | flasks held by the neck in a holder, both arms hanging at the hips (POTION, POTION_HANG) [S] (eeb43aa) | b | approved
377 | round head, umber cap following its curve (farmerDress POTION_HEAD) [S] (ccd37ad) | a | approved
## Rejected (last 4)
- flask seat + glass [P] [1] — 376: seat along the prop axis does not put the bulb in the fist — glass steel-blue, TABS pale grey-green (184,200,195)
## Notes (max 3 lines)
- Flask is an empty holder "potionBall" (the carry check and heldThrowProp key on it) holding the turned-over "potionBulb"; POTION_HANG is both arms' carry.
- Critic 377 minor: cap shell 1.08 sits a little mushroom-wide. 376: in red light the jerkin reads muddy brown, not dark team red.
- Off-hand flask is vis() offhandWeapon "potion". THROWS_HELD_PROP flies the held mesh. The trunk mesh is hidden (potionJerkin is the trunk).
