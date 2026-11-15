# farmer.potion_seller
Status: done   Audited: 375 (re)   Done: 381
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (377)
b PASS (381)
c PASS (375)
d PASS (cost 340, hp 0.76x, dmg 0.11x, cd 3.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
339-345 | bottle per hand, lobbed bottle, drunk splash, hair cap, jerkin, hosen + boots [S] | a,b,c | approved
375-378 | chunky flask, neck held, arms at the hips, neck seated on the mitt [S] approved; flask seat + glass [P] rejected | b | -
379 | _hangFlasks bulb-down, bulb .085, glass (.5,.68,.64) [S] (3535a13, reverted) | b | rejected
380 | re-land: _hangFlasks + bulb .085, glass/glow as 377 [S] (e6efab4) | b | approved
381 | teal liquid cap in the bulb under a level surface (POTION_LIQUID) [S] (acfb585 +7af06ac) | b | approved (b PASS)
## Rejected (last 4)
- flask seat + glass [P] [1] — 376: seat along the prop axis did not put the bulb in the fist — glass steel-blue
- flask hang [S] [1] — 379: ledger reversal on POTION_GLASS/glow; glass went slate blue
## Notes (max 3 lines)
- Flask = holder "potionBall" (origin the cork, on the mitt) holding "potionBulb" (+ child "potionLiquid"); _hangFlasks turns the holder bulb-down (FLASK_HANG).
- Critic 381 minor: neck/shoulder glass bluish-grey (151,166,182), render greener pale teal.
