# Loop state
Iteration: 104   Last re-audit: 100   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- cloud-level-bases bfa2c83 — REJECT (reverted a30de66)
- mammoth-topknot-black-cap 974b82c — APPROVE
- fireball-pale-small 3b25f0c — APPROVE
- blast-scatter-too-high 0d2ce1e — REJECT (reverted 048a12f)
- lightning-shards-broad c201cd4 — APPROVE
- clubber-rank-one-pose 35cb4b0 — APPROVE
- limbs-sticks f1d74a0 — APPROVE
- cannon-rim-wire-thin e490c42 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: cloud-level-bases (bfa2c83) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-topknot-black-cap (974b82c) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: fireball-pale-small (3b25f0c) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: blast-scatter-too-high (0d2ce1e) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: lightning-shards-broad (c201cd4) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: clubber-rank-one-pose (35cb4b0) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: limbs-sticks (f1d74a0) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cannon-rim-wire-thin (e490c42) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] blast-scatter-too-high: bodies 4-5 heights up and uneven; runtimeUnit applyBlastLaunch lift factor (0.65 + 0.7*spread(1))*scale to (0.75 + 0.2*spread(1))*Math.min(1, scale), base lift stays 8 + 4*falloff [attempts: 1] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
2. [maps-light] cloud-level-bases: middle puffs still planed at -0.12*size; _createClouds clamp to Math.max(-0.25 * size, y) [attempts: 2] — ref: tabs_screenshot_01 — ours: closeup_state_reads.png
3. [vfx] fireball-heart-cream: heart screen pixel 222,216,186; coreMat.emissiveColor (0.62, 0.56, 0.36) to (0.5, 0.34, 0.05) [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
4. [vfx] lightning-fill-grey: bolt fill 195,200,202 with a hairline rim; boltMat emissive to full white [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
5. [unit-look] mammoth-topknot-head-wide: tufts as wide as the skull; tuft.scaling (h*1.5, h*0.8, h*1.5) to (h*0.95, h*0.8, h*0.95) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
6. [battle-feel] clubber-march-upright: clubbers march bolt upright; heavy_carry torso.rotation.x += 0.06 to += 0.2 [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_2s.png
7. [unit-look] forearm-shin-sticks: forearms about 0.18 of torso width; halve the forearm/shin step-in in bodyBuilder [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
8. [unit-look] cannon-carriage-tan: tan plank carriage; buildCannon carriage wood to red-brown (0.45, 0.2, 0.15) [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- blast-scatter-too-high [attempts: 1] — base lift 6 + 3*falloff: bodies still above the canopy; height comes from the per-body spread and impactMultiplier/mass
- cloud-level-bases [attempts: 2] — clamp -0.12*size: middle puffs bottom at -0.17 to -0.23*size, still planed, grey chamfer band
- mammoth-topknot-black-prism [attempts: 1] — sphere tufts plus eye 0.16: scope creep on the eyes, cap still near-black and head-wide
- cloud-slab-undersides [attempts: 1] — big banks at 8-11, small 6-11: level base still above the canopy, a white wall on the treeline
- explosion-smooth-balls [attempts: 1] — segments 3, fire root 1.5 wide: still separate balls, orange caps float above
- launched-cloud-height [attempts: 1] — lift 4-6: apex under half a body, a knock-over
- far-ridge-cones [attempts: 2] — top 0.5, cap 0.12: flat-topped mesas, snow invisible
- bucket-helm-tall [attempts: 2] — scaling (0.9, 0.8, 0.9), pale steel: a wide near-white bin

## Notes for next iteration (max 5 lines)
- Spent (never retry): cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red; judge colours by screen pixel. TEAM_COLORS[1] must not be mutated. Bomb cannon disposes field barrel meshes by name.
- One gap, one change: the critic rejects a commit that also touches anything the gap does not name. Do not lower the blast base lift again.
- Sources are CRLF: edit with sed one-liners or a CRLF-aware node script, check `git diff --stat`. Commit with `git commit -F -` heredoc.
