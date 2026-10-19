# ancient.snake_archer
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 378)
 2. kit in _idle: team legs, a dark bar — TABS: brown baldric to a back quiver, brown belt, brown knee boots over sandals (ref: .red.png)
b FAIL (1 since 378)
 2. nocked snake: a plain dark arrow on the string in unit_ancient.snake_archer_release — TABS: big snake nocked, green head, bead eyes, red/green striped body (ref: .red.png, card)
c FAIL (0 since 378)
 1. projectile in _release/_ability: plain arrow — TABS: red/green striped snake (ref: .png, card)
 2. missing snake summon: _struck shows an arrow stuck in the man, summary status:poison — TABS: the snake becomes a unit that slithers and bites (ref: card, .png)
d PASS (cost 300, hp 0.63x, dmg 0.72x, cd 7.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b nocked snake — blocker 2: snake mesh (green head, bead eyes, red/green striped body) on the string, the same mesh fired as the projectile (also clears c.1) (propBuilder/projectileSystem) — ref: .red.png — ours: unit_ancient.snake_archer_release.png
2. [S] c snake that becomes a biting snake unit on impact — blocker 2: summon-on-impact (crow summon pattern) — ref: .png — ours: unit_ancient.snake_archer_struck.png
3. [S] a kit — blocker 2: brown baldric across the chest to a back quiver, brown belt, brown knee boots (ancientDress) — ref: .red.png — ours: unit_ancient.snake_archer_idle.png
4. [P] b (fallout of cdddba0 +91a781d) — NEXT: [P] propBuilder.ts SNAKE_BOW hold 1.1 -> ~1.6 (carry ~30 -> 60 deg across the body); shows in unit_ancient.snake_archer_idle.png, the bow angle
## Attempts (iter | gap | criterion | verdict)
382 | team hood: cap + peak, back shell, face wrap, collar + point, tan cord (SNAKE_HOOD) [S] (7a7a3fb) | a | approved (struck a.1)
384 | snake bow: .95 tall, green, white belly panels, snake head + tongue at the tip, stood up (SNAKE_BOW) [S] (cdddba0 +91a781d) | b | approved (struck b.1)
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 378: _windup shows him running with the bow slung; full-draw frame is _release. 384: _flight hides the bow side-on.
- Hood is ancientDress dressSnakeArcher (SNAKE_HOOD), hat "none". Bow weaponVariant "snake_bow" (propBuilder buildSnakeBow).
