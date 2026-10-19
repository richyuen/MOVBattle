# farmer.potion_seller
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (377)
b FAIL (3 since 375)
 1. flasks in unit_farmer.potion_seller_idle (also _release): bulb near head-sized, riding on top of or beside the fist (cork down in the fist, bulb up), glass pale blue-grey/white; in _release the off-hand flask is inverted — TABS: fist-sized pale-teal flask (~184,200,195) gripped by the neck, bulb below/ahead of the fist at the hip (ref: .red.png, .jpg)
c PASS (375)
d PASS (cost 340, hp 0.76x, dmg 0.11x, cd 3.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b fist-sized pale-teal flask hanging bulb-down/ahead from the grip — blocker 1: "potion" prop orientation + size (propBuilder POTION, grip preset) — ref: .red.png — ours: unit_farmer.potion_seller_idle.png
## Attempts (iter | gap | criterion | verdict)
339-345 | bottle per hand, lobbed bottle, drunk splash, hair cap, jerkin, hosen + boots [S] | a,b,c | approved
375 | chunky faceted flask (POTION) [S] (5af9646) | b | approved
376 | fitted jerkin (POTION_FIT) [S] approved a; flask seat + glass [P] (665e5e0, reverted) | b | rejected
377 | flasks held by the neck, arms hanging at the hips (POTION_HANG) [S] (eeb43aa) | b | approved; round head (POTION_HEAD) [S] (ccd37ad) | a | approved
378 | flask neck seated on the mitt, stays in the fist through the windup (seatNeckInFist) [S] (c1e205c) | b | approved
## Rejected (last 4)
- flask seat + glass [P] [1] — 376: seat along the prop axis does not put the bulb in the fist — glass steel-blue, TABS pale grey-green (184,200,195)
## Notes (max 3 lines)
- Flask = holder "potionBall" (origin = the cork, on the hand's mitt since 378) holding the turned-over "potionBulb"; POTION_HANG is both arms' carry.
- Critic 377 minor: cap shell 1.08 a little mushroom-wide. 376: in red light the jerkin reads muddy brown.
- Off-hand flask is vis() offhandWeapon "potion". THROWS_HELD_PROP flies the held mesh. Probe: output/loop/probe_potion.mjs.
