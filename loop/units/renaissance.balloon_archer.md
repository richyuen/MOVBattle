# renaissance.balloon_archer
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 368)
 1. sleeves in unit_renaissance.balloon_archer_idle: tight — TABS: big puffed shoulder sleeves with tan slashes (ref: renaissance.balloon_archer.red.png, .jpg)
 2. torso in unit_renaissance.balloon_archer_idle/_flight: striped tan all over — TABS: solid team doublet, tan placket and buttons down the front, stripes on the sleeves (ref: .red.png)
 3. hat in unit_renaissance.balloon_archer_idle: round bowler dome, narrow brim — TABS: flat-topped black hat, wide flat brim (ref: .jpg)
b FAIL (0 since 368)
 1. draw hand empty in unit_renaissance.balloon_archer_idle/_windup — TABS: holds the balloon arrow, team ball behind the head beside the bow (ref: .red.png, .jpg)
 2. bow level across the hips in unit_renaissance.balloon_archer_idle — TABS: diagonal across the chest, upper limb by the shoulder (ref: .red.png)
c PASS (368)
d PASS (cost 200, hp 1.09x vs 1.00x, dmg 0.39x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b arrow in hand — blocker 1: balloon arrow with its team ball in the draw hand at idle/windup, hidden at release — ref: renaissance.balloon_archer.red.png — ours: unit_renaissance.balloon_archer_idle.png
2. [S] a puffed slashed sleeves — blocker 1 (and 2): shoulder puffs with tan slash strips, solid doublet with a tan placket — ref: .red.png — ours: unit_renaissance.balloon_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
327 | black brim hat, no head balloon [S] (d747d43) | a | approved
329 | light-grey longbow [S] (ea71dc1 + c2aff34) | b | approved
330 | longbow length [P] (d3cb713) | b | approved
332 | balloon float [S] (c99a50c + 08c4efd) | c | approved
333 | team ball on the arrow [S] (4e0e02c) | c | approved
336 | striped doublet, slashed sleeves, belt, breeches, tan stockings [S] (921719c) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Float: BALLOON_ARROWS -> RuntimeUnit.floatOnBalloons (BALLOON_FLOAT); the arrow's BALLOON_BALL is hidden on the hit.
- dressBalloonArcher (ARCHER_DRESS). Critic 336 nits: stripes even all round (TABS: cream front panel with buttons), shoes read dark not orange.
