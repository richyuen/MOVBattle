# farmer.potion_seller
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (377)
b FAIL (4 since 375)
 1. glass in unit_farmer.potion_seller_idle (also _release): near-white blue-grey — TABS: pale-teal flask (~184,200,195) that reads blue-green at lineup distance (ref: .red.png, .blue.png, factions/farmer.jpg). Size, hang, inversion fixed 380.
c PASS (375)
d PASS (cost 340, hp 0.76x, dmg 0.11x, cd 3.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b teal contents — blocker 1: a pale-teal liquid mesh filling the lower bulb inside the glass (POTION_GLASS approved 377: re-tint = reversal) — ref: .red.png — ours: unit_farmer.potion_seller_idle.png
## Attempts (iter | gap | criterion | verdict)
339-345 | bottle per hand, lobbed bottle, drunk splash, hair cap, jerkin, hosen + boots [S] | a,b,c | approved
375-378 | chunky flask, neck held, arms at the hips, neck seated on the mitt [S] approved; flask seat + glass [P] rejected | b | -
379 | _hangFlasks bulb-down, bulb .085, glass (.5,.68,.64) [S] (3535a13, reverted) | b | rejected
380 | re-land: _hangFlasks + bulb .085, glass/glow as 377 [S] (e6efab4) | b | approved
## Rejected (last 4)
- flask seat + glass [P] [1] — 376: seat along the prop axis did not put the bulb in the fist — glass steel-blue
- flask hang [S] [1] — 379: ledger reversal on POTION_GLASS/glow; glass went slate blue
## Notes (max 3 lines)
- Flask = holder "potionBall" (origin the cork, on the mitt) holding "potionBulb"; _hangFlasks turns the holder bulb-down in the world (FLASK_HANG).
- Off-hand flask is vis() offhandWeapon "potion". THROWS_HELD_PROP flies the held mesh. Probe: output/loop/probe_potion.mjs.
