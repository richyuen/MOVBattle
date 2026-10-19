# renaissance.halberd
Status: open   Audited: 368 (re; a re-audited 374 after evidence 6b5cef8)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 374)
 1. breeches in unit_renaissance.halberd_idle (also _windup): the thigh is a straight team tube with a small flat patch, no puff — TABS: puffed, slashed team breeches to the knee, wider than the thigh, over a slimmer dark stocking (ref: .blue.png, .red.png)
 2. stance in unit_renaissance.halberd_idle: torso bowed forward over bent knees, legs ~45% of his height, reads squat — TABS: tall, upright on long straight legs, over half his height below the belt (ref: .red.png, factions/renaissance.jpg)
 3. visor in unit_renaissance.halberd_idle: two glowing white dots in the black helm — TABS: a slit in team colour across the helm face (ref: .red.png, .blue.png)
b PASS (374)
c PASS (369)
d PASS (cost 400, hp 5.74x, dmg 0.92x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a breeches — blocker 1: a faceted puff lathe per thigh, hip to knee, ~1.5x the thigh, slashed, in renaissanceDress halberdHose — ref: .blue.png — ours: unit_renaissance.halberd_idle.png
2. [S] a stance — blocker 2: his own rest stance on straight legs, upright torso, legLength over 1 (like JAVELIN_UPRIGHT) — ref: .red.png — ours: unit_renaissance.halberd_idle.png
3. [S] a visor — blocker 3: a team-colour slit across the sallet face in place of the white eye dots — ref: .red.png — ours: unit_renaissance.halberd_idle.png
## Attempts (iter | gap | criterion | verdict)
327-373 | head, sallet, grip, chop, dress, tabard, sallet re-cut, dash back, quilted sleeves, rest grip [S] | a,b,c | approved
372 | bevor as a chin cup (SALLET_FACETED) [S] (512e743, reverted) | a | dropped (no change in the shot)
374 | low leather shoes, turned cuff, dark team stocking (halberdHose, HALBERD_SHOE) [S] (b46132a) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- HALBERD shared with good.radiant_glaive. _poseHalberd; _restHalberd; _chopOnto; _holdChopDown. dressHalberd: tabard, belt, sleeves HALBERD_QUILT; renaissanceDress halberdHose (shoes, stocking).
- Idle camera swings to his other side (evidence 6b5cef8; the backdrop boulder had read as a sallet flap).
- Critic 374 minor: shoe reads tan-khaki in sun, stocking (team x .42) barely darker than the thigh. 370 minor: puffs dusty pink-mauve.
