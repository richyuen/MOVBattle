# ancient.snake_archer
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 378)
 2. kit in _idle: team legs, a dark bar — TABS: brown baldric to a back quiver, brown belt, brown knee boots over sandals (ref: .red.png)
b FAIL (2 since 378)
 2. nocked snake in unit_ancient.snake_archer_idle: all parts there but a slender stick, head fist-sized — TABS: fat snake, head bigger than his own (ref: .red.png)
c FAIL (1 since 378)
 2. missing snake summon: _struck shows the snake lodged in the man like an arrow, summary status:poison — TABS: the snake lands and slithers/bites as a unit (ref: card, .png)
d PASS (cost 300, hp 0.63x, dmg 0.72x, cd 7.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c snake that becomes a biting snake unit on impact — blocker 2: summon-on-impact (crow summon pattern) — ref: .png — ours: unit_ancient.snake_archer_struck.png
2. [S] a kit — blocker 2: brown baldric across the chest to a back quiver, brown belt, brown knee boots (ancientDress) — ref: .red.png — ours: unit_ancient.snake_archer_idle.png
3. [P] b snake size (fallout of 100ea4a) — NEXT: [P] ancientDress.ts SNAKE head .22 -> .4, neck .72 -> 1.0, held .48 -> .6; shows in unit_ancient.snake_archer_idle.png, the snake's head reaching his head's size
4. [P] b (fallout of cdddba0 +91a781d) — NEXT: [P] propBuilder.ts SNAKE_BOW hold 1.1 -> ~1.6; shows in unit_ancient.snake_archer_idle.png, the bow angle
## Attempts (iter | gap | criterion | verdict)
382 | team hood: cap + peak, back shell, face wrap, collar + point, tan cord (SNAKE_HOOD) [S] (7a7a3fb) | a | approved (struck a.1)
384 | snake bow: .95 tall, green, white belly panels, snake head + tongue at the tip, stood up (SNAKE_BOW) [S] (cdddba0 +91a781d) | b | approved (struck b.1)
385 | nocked snake in the draw fist, flies as the same snake (SNAKE, SNAKE_ARROWS, _dressSnake) [S] (100ea4a) | b,c | approved (struck c.1)
## Rejected (last 4)
## Notes (max 3 lines)
- Hood ancientDress dressSnakeArcher; bow weaponVariant "snake_bow" (propBuilder buildSnakeBow). Snake: ancientDress buildSnake (along +y), heldSnake ("heldArrow" on leftHand, hidden by the sim's _arrowsAway); flying: FLYING_SNAKE_LONG 1.1 m.
- Critic 378: _windup shows him running with the bow slung; full-draw frame is _release. 384: _flight hides the bow side-on.
- Summon: the flying snake still sticks like an arrow (litter); a summon must replace it at impact.
