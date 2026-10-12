# Loop state
Iteration: 103   Last re-audit: 100   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- blast-lift-too-low a1923e5 — APPROVE
- explosion-detached-caps 9a866c8 — APPROVE
- cloud-slab-undersides 0b2feeb — REJECT (reverted 8ec5bc4)
- cannon-solid-wheels 836ce9f — APPROVE
- lightning-no-cyan-rim 74e920e — APPROVE
- mammoth-topknot-black-prism f75072a — REJECT (reverted 2673c4d)
- sleeve-blocks-wide d34dbda — APPROVE
- clubber-club-overlong ee798c0 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: blast-lift-too-low (a1923e5) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: explosion-detached-caps (9a866c8) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: cloud-slab-undersides (0b2feeb) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: cannon-solid-wheels (836ce9f) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: lightning-no-cyan-rim (74e920e) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: mammoth-topknot-black-prism (f75072a) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: sleeve-blocks-wide (d34dbda) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: clubber-club-overlong (ee798c0) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] cloud-level-bases: every cloud base is cut to a plane, the three lowClouds too; _createClouds clamp Math.max(0, y) to -0.12 * size [attempts: 1] — ref: tabs_screenshot_01 — ours: closeup_state_reads.png
2. [unit-look] mammoth-topknot-black-cap: near-black upright blocks; tufts to CreateSphere segments 3 scaled (h*1.5, h*0.8, h*1.5), crestMat lerp 0.8 to 0.45, no eye edit [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
3. [vfx] fireball-pale-small: cream, no orange, 1.5 men tall; coreMat (1, 0.85, 0.3), lobes 1 and 3 flameMat, fireScale cap 1.6 to 2.4 [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
4. [battle-feel] blast-scatter-too-high: bodies fly singly to the top of the frame, stiff; projectileSystem lift 6 + 3 * falloff [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
5. [vfx] lightning-shards-broad: torso-wide panes, thin pale rim; halve the width passed to addShard, rim scale 1.3 to 1.6 [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
6. [battle-feel] clubber-rank-one-pose: every clubber holds the club upright at one angle; per-unit phase/angle offset on the carry pose [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_2s.png
7. [unit-look] limbs-sticks: limbs thin beside the torso; bodyBuilder LIMB_THIN 1.02 to 1.12 [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
8. [unit-look] cannon-rim-wire-thin: thin hoop, no hub; buildCannon torus thickness 0.06 to 0.1, add a 0.12 hub cylinder per wheel [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- mammoth-topknot-black-prism [attempts: 1] — sphere tufts plus eye 0.16: scope creep on the eyes, cap still near-black and head-wide
- cloud-slab-undersides [attempts: 1] — big banks at 8-11, small 6-11: level base still above the canopy, a white wall on the treeline
- explosion-smooth-balls [attempts: 1] — segments 3, fire root 1.5 wide: still separate balls, orange caps float above
- launched-cloud-height [attempts: 1] — lift 4-6: apex under half a body, a knock-over
- far-ridge-cones [attempts: 2] — top 0.5, cap 0.12: flat-topped mesas, snow invisible
- bucket-helm-tall [attempts: 2] — scaling (0.9, 0.8, 0.9), pale steel: a wide near-white bin
- grass-thin-scatter [attempts: 2] — BLADES 840000, PER_TUFT 7: tuft spacing unchanged
- red-team-maroon [attempts: 2] — team red lerped to coral: screen skin unchanged

## Notes for next iteration (max 5 lines)
- Spent (never retry): far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red; judge colours by screen pixel. TEAM_COLORS[1] must not be mutated. Bomb cannon disposes field barrel meshes by name.
- One gap, one change: the critic rejects a commit that also touches anything the gap does not name (mammoth eyes).
- Source files are CRLF in the working tree and Git Bash grep does not show it: edit with sed one-liners or a CRLF-aware script. Commit with `git commit -F -` heredoc.
