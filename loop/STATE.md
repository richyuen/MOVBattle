# Loop state
Iteration: 53   Last re-audit: 50   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- fireball-cream-not-fire 7e0ffa7 — REJECT (reverted 035cd97)
- corpses-still-T-and-paired-legs ab78ff2 — APPROVE
- grass-foreground-and-drift 0a46f92 — REJECT (reverted 4103db1)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-cream-not-fire (7e0ffa7) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: corpses-still-T-and-paired-legs (ab78ff2) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: grass-foreground-and-drift (0a46f92) VERDICT: REJECT SCORE: camera 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] bare-grass-bottom-quarter: near rank's feet should reach the bottom edge [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
2. [vfx] fireball-translucent-cream: duller than the clouds; needs opaque bright yellow body [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
3. [battle-feel] flyer-legs-barely-part: knees fold into loops; need wide scissor on straight legs [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
4. [camera] mammoth-cropped: cut by top and right edges while clash sits low [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
5. [battle-feel] no-foreground-bodies-no-pile: dead lie far back and small [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
6. [unit-look] box-torsos-stick-limbs-cube-hands [attempts: 2] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
7. [maps-light] flat-green-weak-shadows-no-warm-sun [attempts: 2] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
8. [vfx] orange-lobes-hard-separate-balls: want one soft skirt fused into the blast [attempts: 0] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_3800ms.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey
- front-line-does-not-compress [attempts: 1] — regression: pack-scaled solver radii failed crowd_topple, spillover_chain
- idle-arms-hang-symmetric [attempts: 1] — raised weapon arm did not show on knight/Zeus
- tree-crowns-cast-no-shadow [attempts: 1] — crowns and rocks shade themselves near-black

## Notes for next iteration (max 5 lines)
- Gap 1: swoopToBattle clearRadius depth+3, radius floor 5; change nothing else.
- Gap 2: flashMat diffuse ~(1,0.85,0.12), emissive blue ~0.02; find why body is see-through, hold alpha 1 until late.
- Gap 3: _buildAirPose hipGap 0.6-1.0, kick 0.4-0.7, cap flight knees ~0.5.
- Pickable next: 1, 2, 3, 4, 8, 5 (not 6, 7). No new Math.random calls in VFX or poses.
