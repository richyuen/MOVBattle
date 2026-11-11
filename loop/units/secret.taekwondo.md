# secret.taekwondo
Status: open   Audited: 515 (AUDIT x2)   Done: -
## Verdicts
a PASS (518: struck 4, 6; gi, belt, trousers, cuffs, topknot)
b PASS (515 empty fists, card Fist/Fist)
c FAIL (1 since 515, 1 struck)
 2. ability leap in unit_secret.taekwondo_ability/_ability_after — TABS: the Taekwondo Kick; ours is a hop with legs together and no leg extended (ref: card Abilities)
d PASS (518 stats)
## Ranked gaps
1. [S] secret.taekwondo.c kick — blocker 2: Taekwondo Kick pose, one leg extended high in the leap pair (simulationSystem leap + proceduralAnimation setKick) — ref: card Abilities, secret.taekwondo.jpg — ours: unit_secret.taekwondo_ability.png
## Attempts (iter | gap | criterion | verdict)
518 | wide gi trousers, deep cream cuffs, bare feet, secretDress taekwondoTrousers (5ac81c17) | a | approved (struck 4)
518 | dark hair cap, topknot bun, team hairband, bandana off, secretDress taekwondoHair (a8cf176b) | a | approved (struck 6; a PASS)
517 | black belt over the jacket skirt top, front knot, two tails, secretDress taekwondoBelt (6679b6c8) | a | approved (struck 3, 5 by lineup)
516 | team gi jacket, crossed cream lapels, wide sleeves, black belt, secretDress taekwondoGi (1955e016, f438c488) | a | approved (struck 1, 2)
516 | high front kick as his main blow, KICK_BY_UNIT raise 2.05, plain hit (23d145b2) | c | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- c.2 is his last blocker: once it clears, CONFIRM him. The ability shot catches a run (leap at 1033 ms), not the kick.
- 518 DEFECTS: cuffs near-white (TABS cream-peach), hair mid-brown (TABS brown-black); colour only.
