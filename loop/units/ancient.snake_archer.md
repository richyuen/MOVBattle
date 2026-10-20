# ancient.snake_archer
Status: done   Audited: 378, a 388 (re-audit)   Done: 390
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (390; CONFIRM 390)
b PASS (386; CONFIRM 390)
c PASS (388; CONFIRM 390)
d PASS (cost 300, hp 0.63x, dmg 0.72x, cd 7.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
382-386 | hood, snake bow, nocked snake, baldric/belt/boots (SNAKE_HOOD, SNAKE_BOW, SNAKE, SNAKE_KIT) [S]; SNAKE head [P] | a,b,c | approved
387-388 | snake summon lands live (SNAKE_LIVE) [S]; ground snake (GROUND_SNAKE) [S]; quiver high on the back (SNAKE_QUIVER) [S] | a,c | approved
389 | hood one rounded superellipsoid shell, blunt nub (SNAKE_CAP) [S] (d561c70 +0390b63) | a | approved (narrowed a.3)
390 | stance upright on straight legs, bow across him (proceduralAnimation SNAKE_UPRIGHT) [S] (73c3474) | a | approved (struck a.2)
390 | face wrap one rounded shell tucked under the rim, narrowing to the chin, dark cord + knot (SNAKE_WRAP) [S] (ee39078) | a | approved (struck a.3, a PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Hood ancientDress dressSnakeArcher (SNAKE_CAP, SNAKE_WRAP), kit snakeArcherKit + snakeArcherQuiver; bow buildSnakeBow; snake buildSnake/heldSnake; ground snake buildGroundSnake, sim SNAKE_LIVE.
- Stance: proceduralAnimation SNAKE_UPRIGHT, found by the nocked snake (_snakeNocked). 390 minors: stave near level across the chest (TABS slanted); cap and wrap one tone.
