# renaissance.halberd
Status: open   Audited: 368 (re; a re-audited 374 after evidence 6b5cef8)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 374)
 2. stance in unit_renaissance.halberd_idle: torso bowed forward over bent knees, legs ~45% of his height, reads squat — TABS: tall, upright on long straight legs, over half his height below the belt (ref: .red.png, factions/renaissance.jpg)
 3. visor in unit_renaissance.halberd_idle: two glowing white dots in the black helm — TABS: a slit in team colour across the helm face (ref: .red.png, .blue.png)
b PASS (374)
c PASS (369)
d PASS (cost 400, hp 5.74x, dmg 0.92x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a stance — blocker 2: his own rest stance on straight knees, upright torso, legs over half his height (proceduralAnimation _restHalberd, like JAVELIN_UPRIGHT) — ref: .red.png — ours: unit_renaissance.halberd_idle.png
2. [S] a visor — blocker 3: team slit across the sallet face, no white eye dots; renders also show a wider team gap at the jaw above the bevor — ref: .red.png — ours: unit_renaissance.halberd_idle.png
## Attempts (iter | gap | criterion | verdict)
327-373 | head, sallet, grip, chop, dress, tabard, sallet re-cut, dash back, quilted sleeves, rest grip [S] | a,b,c | approved
372 | bevor as a chin cup (SALLET_FACETED) [S] (512e743, reverted) | a | dropped (no change in the shot)
374 | low leather shoes, turned cuff, dark team stocking (halberdHose, HALBERD_SHOE) [S] (b46132a) | a | approved
375 | puffed slashed team breeches hip to knee (halberdBreeches, HALBERD_BREECH) [S] (a74b9af) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- HALBERD shared with good.radiant_glaive. _poseHalberd; _restHalberd. dressHalberd: tabard, belt, sleeves; renaissanceDress halberdHose, halberdBreeches. Sallet is halberd-only.
- Critic 375 minor: breech slashes pale tan read as stripes (TABS darker/lighter team panels, no tan).
- Idle camera swings to his other side (evidence 6b5cef8). 374 minor: shoe tan-khaki, stocking barely darker than the thigh.
