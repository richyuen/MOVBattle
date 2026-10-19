# farmer.potion_seller
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (377)
b FAIL (3 since 375)
 1. flasks in unit_farmer.potion_seller_idle (also _release): bulb near head-sized, riding on top of or beside the fist (cork down in the fist, bulb up), glass pale blue-grey/white; in _release the off-hand flask is inverted — TABS: fist-sized pale-teal flask (~184,200,195) gripped by the neck, bulb below/ahead of the fist at the hip (ref: .red.png, .jpg)
c PASS (375)
d PASS (cost 340, hp 0.76x, dmg 0.11x, cd 3.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b flask hang — blocker 1: re-land _hangFlasks + .085 bulb of 3535a13 with POTION_GLASS and glow untouched (critic 379: those cleared size, grip and the inverted flask) — ref: .red.png — ours: unit_farmer.potion_seller_idle.png
## Attempts (iter | gap | criterion | verdict)
339-345 | bottle per hand, lobbed bottle, drunk splash, hair cap, jerkin, hosen + boots [S] | a,b,c | approved
375-377 | chunky flask (5af9646), neck held, arms at the hips (eeb43aa) [S] approved; flask seat + glass [P] (665e5e0) rejected | b | -
378 | flask neck seated on the mitt, stays in the fist through the windup (seatNeckInFist) [S] (c1e205c) | b | approved
379 | _hangFlasks bulb-down in the world, bulb .085, glass (.5,.68,.64) lit .06 [S] (3535a13, reverted) | b | rejected
## Rejected (last 4)
- flask seat + glass [P] [1] — 376: seat along the prop axis does not put the bulb in the fist — glass steel-blue, TABS pale grey-green (184,200,195)
- flask hang [S] [1] — 379: ledger reversal on POTION_GLASS/glow (approved 377), glass went slate blue (~113,130,151); the hang and size themselves were right
## Notes (max 3 lines)
- Flask = holder "potionBall" (origin the cork, on the mitt since 378) holding the turned-over "potionBulb" (bulb along holder +y); POTION_HANG is both arms' carry.
- Re-land: git show 3535a13 minus the POTION_GLASS / glow lines (keep shoulder/neck/cork shrink with the bulb).
- Off-hand flask is vis() offhandWeapon "potion". THROWS_HELD_PROP flies the held mesh. Probe: output/loop/probe_potion.mjs.
