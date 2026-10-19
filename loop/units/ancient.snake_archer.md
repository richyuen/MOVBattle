# ancient.snake_archer
Status: open   Audited: 378, a 388 (re-audit)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 388)
 2. stance in unit_ancient.snake_archer_idle: a deep forward lunge, front knee bent, rear leg trailing, trunk pitched forward — TABS: upright on straight legs, bow held across the body (ref: .red.png, .blue.png)
 3. headgear in _idle: a tall flat-sided cylinder with a fin on top, reads as a bucket helm — TABS: a short rounded team cap with a small peak over a face wrap tied with a cord (ref: .blue.png)
b PASS (386)
c PASS (388)
d PASS (cost 300, hp 0.63x, dmg 0.72x, cd 7.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a headgear — blocker 3: short rounded team cap with a small peak over the face wrap, replacing the tall finned cylinder — ref: .blue.png — ours: unit_ancient.snake_archer_idle.png
2. [S] a stance — blocker 2: upright straight-legged idle pose, bow held across the body (proceduralAnimation) — ref: .red.png — ours: unit_ancient.snake_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
382-386 | hood, snake bow, nocked snake, baldric/belt/boots (SNAKE_HOOD, SNAKE_BOW, SNAKE, SNAKE_KIT) [S]; SNAKE head [P] | a,b,c | approved
387 | snake summon: lands live, slithers, lunges, 2 bites / 30 s (SNAKE_LIVE) [S] (c513c8f) | c | approved (added c.3)
388 | ground snake: own 2 m thin banded build in a travelling S, head on a neck (GROUND_SNAKE buildGroundSnake) [S] (3afbc34) | c | approved (c PASS)
388 | quiver high on the back on the baldric, mouth over the left shoulder, arrows; no hip quiver_back (SNAKE_QUIVER) [S] (2f31243) | a | approved (struck a.1)
## Rejected (last 4)
## Notes (max 3 lines)
- Hood ancientDress dressSnakeArcher, kit snakeArcherKit + snakeArcherQuiver; bow buildSnakeBow; snake buildSnake/heldSnake; ground snake buildGroundSnake, sim SNAKE_LIVE _landSnake _slitherSnakes.
- _idle is a rear three-quarter (5b88632): face wrap and cord front only judge in lineup_ancient. 388 minor: in _ability the ground snake lies near straight, head barely up.
- Capture: _ability pair on snake_land (700 ms), framed on the struck man, after +30 ticks.
