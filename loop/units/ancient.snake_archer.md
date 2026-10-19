# ancient.snake_archer
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 378)
 2. kit in _idle: brown knee boots now; the baldric and belt cannot be seen (behind the held snake) — TABS: brown baldric to a back quiver, brown belt with buckle (ref: .red.png)
b PASS (386)
c FAIL (1 since 378)
 2. missing snake summon: _struck shows the snake lodged in the man like an arrow, summary status:poison — TABS: the snake lands and slithers/bites as a unit (ref: card, .png)
d PASS (cost 300, hp 0.63x, dmg 0.72x, cd 7.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c snake summon — blocker 2: the landed snake becomes a small actor that slithers, lunges and bites (2 bites / 30 s life), replacing the lodged projectile at impact, visible 100 ms on — ref: .png — ours: unit_ancient.snake_archer_struck.png
2. evidence: re-aim _idle so the chest above the held snake shows (capture.mjs), then judge baldric/belt (blocker 2)
## Attempts (iter | gap | criterion | verdict)
382 | team hood (SNAKE_HOOD) [S] (7a7a3fb) | a | approved (struck a.1)
384 | snake bow (SNAKE_BOW) [S] (cdddba0 +91a781d) | b | approved (struck b.1)
385 | nocked snake in the draw fist, flies as the same snake (SNAKE, _dressSnake) [S] (100ea4a) | b,c | approved (struck c.1)
386 | baldric, belt + gold buckle, knee boots over strap sandals (SNAKE_KIT) [S] (915b7e7) | a | approved (narrowed a.2)
386 | SNAKE head .22 -> .4, neck .72 -> 1.0, held .48 -> .6 [P] (789d171) | b | approved (b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Hood ancientDress dressSnakeArcher, kit snakeArcherKit; bow propBuilder buildSnakeBow; snake buildSnake/heldSnake (hidden by the sim's _arrowsAway); flying FLYING_SNAKE_LONG 1.1 m. Quiver is the "quiver_back" special.
- No snake unit definition exists: a roster-unit summon blows the [S] cap; build a sim-driven actor (reuse buildSnake). 386 minor: sandal straps unreadable.
- Critic 378: _windup shows him running with the bow slung; full-draw frame is _release. 384: _flight hides the bow side-on.
