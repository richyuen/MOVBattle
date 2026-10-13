# Loop state
Iteration: 132   Last re-audit: 130   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- melee-misses-giant e4283d7 — APPROVE
- eyes-navy 2c6cfd7 — APPROVE
- victory-shot-blocked 6239506 — APPROVE
- red-lit-faces-short 0bdecd8 — APPROVE
- blast-body-cream 0a45825 — REJECT (reverted 5e10246)
- contact-line-low f7fd9a0 — APPROVE
- shadow-not-plum cee6e5c — APPROVE
- muzzle-smoke-belly e83592b — REJECT (reverted 190f8e4)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: melee-misses-giant (e4283d7) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: eyes-navy (2c6cfd7) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: victory-shot-blocked (6239506) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: red-lit-faces-short (0bdecd8) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: blast-body-cream (0a45825) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: contact-line-low (f7fd9a0) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: shadow-not-plum (cee6e5c) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: muzzle-smoke-belly (e83592b) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] giant-barely-hit: mammoth takes 9 melee hits in 17 s, ends 91% hp, 0/30 vs 17/31; see Notes, _tryAttack has no gate [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
2. [vfx] blast-body-cream: body must be 250,250,226 (ours 232,228,211), hard step at y 488-491; visualEffects.ts flashMat all channels up, blue ~0.75; flameMat blue 0.3 as rim [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
3. [vfx] muzzle-smoke-belly: belly must be slate 95-134 under a 220 top, ratio 0.45; projectileSystem.ts smoke emissive ~0.05,0.05,0.08 [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
4. [unit-look] red-shade-flat: shaded 177,92,89, median 190,109,111 vs 148,41,83 and 194,62,102; unitFactory.ts lower WARM_SKIN_GLOW, keep base [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
5. [unit-look] head-darker-than-limbs: Thor head 68,116,152 vs arms 100-109,138-150,172-185 since the head left the glow layer; raise head emissive to match forearm [attempts: 0] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
6. [maps-light] lit-field-dull: 217,130,97 vs 240,168,111; mapBuilder.ts grass.diffuseColor green 0.48 toward 0.58 [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
7. [camera] victory-giant-backdrop: rump 44% of width at centre, no face in frame; cameraController.ts farSide PI to 0.7*PI [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
8. [camera] feet-cropped-2s: 154 px at y=920 at 2 s until the sink ends; FOLLOW_DROP_SPEED 0.3 to ~0.8 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- muzzle-smoke-belly [attempts: 1] — emissive 0.22, base x0.9: belly 172-184, ratio 0.75, a white ball; ref wants it darker and cool
- blast-body-cream [attempts: 1] — flashMat blue 0.32: body 232,227,172, away from the ref's cream-white; 255,245,170 was the rim
- giant-untouched-wipe [attempts: 1] — healthScale 1.8: same 336 hp lost
- crowd-thin [attempts: 1] — fourth rank in capture.mjs: yardstick moved; dropped at audit 130
- victory-crowded [attempts: 1] — radius cap 6: eye still inside the crowd; dropped at audit 130
- mammoth-no-trample [attempts: 2] — spent
- muzzle-smoke-low-contrast [attempts: 1] — base 0.90 warm, emissive 0.01: lit unchanged, underside brown

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth-no-trample, boulders lit colour, fireball lobe sizes/balloon, grass tufts, presser-lean-capped, mammoth melee-hit launch/mop-hat/tusks/hide, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs for a gap.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210, 2.0 ~235. Saturated red tops out near 205 whatever the base red (1.8 tried): only lifting green and blue with it raised it. Grass emissive blue 0.036 kept the lit field orange.
- Probe all gaps uncommitted with `capture.mjs --iter 9123 --showcase-only`, measure, then commit one file per gap (`git commit <file> -m`). A zlib PNG sampler is ~30 lines; poses differ run to run, so re-find pixels. Critic's named material can be wrong: blast body is flashMat/coreMat, not flameMat.
- Giant: _tryAttack has no range gate; melee damage is direct. Few hits because few men reach or pick it: look at who targets it (big_melee_final_state.json impactDebug) and at the contactDistance press (line ~513) before another reach term.
- Camera: followBattle slides x/z (slack 0.6, 2.5/s) and sinks y 0.6. The victory shot differs run to run. hemi.intensity is 0.45: no further fill cuts.
