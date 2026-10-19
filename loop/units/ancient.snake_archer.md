# ancient.snake_archer
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 378)
 2. kit in _idle: brown knee boots now; the baldric and belt cannot be seen (behind the held snake) — TABS: brown baldric to a back quiver, brown belt with buckle (ref: .red.png) [387: _idle re-aimed to his other side, 5b88632; re-audit pending]
b PASS (386)
c FAIL (1 since 378)
 3. ground snake in _ability/_ability_after: a short fat green log a thigh thick, red bands only on a cone tail, lying straight, no S bend — TABS: a long thin snake banded its whole length, laid in S curves, head up (ref: .png) (introduced by c513c8f)
d PASS (cost 300, hp 0.63x, dmg 0.72x, cd 7.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c ground snake — blocker 3: a separate ground-snake build ~2 m long, thin, banded segments the whole length, S bends of a few tenths of a metre, head held up (simulationSystem _landSnake / ancientDress buildSnake) — ref: .png — ours: unit_ancient.snake_archer_ability.png
2. [S] a kit — blocker 2: baldric and belt with buckle visible in _idle — ref: .red.png — ours: unit_ancient.snake_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
382 | team hood (SNAKE_HOOD) [S] (7a7a3fb) | a | approved (struck a.1)
384 | snake bow (SNAKE_BOW) [S] (cdddba0 +91a781d) | b | approved (struck b.1)
385 | nocked snake in the draw fist, flies as the same snake (SNAKE, _dressSnake) [S] (100ea4a) | b,c | approved (struck c.1)
386 | baldric, belt + gold buckle, knee boots over strap sandals (SNAKE_KIT) [S] (915b7e7) | a | approved (narrowed a.2)
386 | SNAKE head .22 -> .4, neck .72 -> 1.0, held .48 -> .6 [P] (789d171) | b | approved (b PASS)
387 | snake summon: lands as a live snake, slithers, lunges, 2 bites / 30 s (SNAKE_LIVE) [S] (c513c8f, evidence e4d3ca7) | c | approved (struck c.2, added c.3)
## Rejected (last 4)
## Notes (max 3 lines)
- Hood ancientDress dressSnakeArcher, kit snakeArcherKit; bow buildSnakeBow; snake buildSnake/heldSnake; flying FLYING_SNAKE_LONG 1.1 m. Live snake simulationSystem SNAKE_LIVE _landSnake _slitherSnakes (projectileSystem snakeLand hook); not targetable.
- Capture: _ability pair on snake_land (700 ms), framed on the struck man, after +30 ticks; no snake_bite inside the window yet.
- Critic 378: _windup shows him running with the bow slung; full-draw frame is _release. 386 minor: sandal straps unreadable.
