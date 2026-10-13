# Loop state
Iteration: 119   Last re-audit: 115   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- carriage-shade-warm b07c624 — APPROVE
- field-pale 050f321 — APPROVE
- fireball-core-dull 501d110 — REJECT (reverted ebe7596)
- fireball-foot-dull 69b6027 — REJECT (reverted 02e5f6c)
- muzzle-smoke-unfaceted f01a725 — APPROVE
- red-rank-knot ae2c385 — REJECT, regression before critic (reverted 1ffe610)
- runner-stride-uniform c9f6304 — APPROVE
- mammoth-flat-purple e422e25 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: carriage-shade-warm (b07c624) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: field-pale (050f321) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: fireball-core-dull (501d110) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: fireball-foot-dull (69b6027) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: muzzle-smoke-unfaceted (f01a725) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: runner-stride-uniform (c9f6304) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: mammoth-flat-purple (e422e25) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] fireball-foot-dull: foot 227,204,186 (S0.18) vs 241,170,131 (S0.46), two stacked balls; visualEffects.ts flameMat.emissiveColor to (1.3, 0.50, 0.22); if still pale the lever is dustMat [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
2. [maps-light] field-shadows-faint: tree shadow 204,101,57 (0.74 of field) vs 125,60,68 (0.45); main.ts shadowGen.darkness 0.35 to 0.22 [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
3. [maps-light] boulders-periwinkle: 146,150,188 vs rock 105,68,88; mapBuilder.ts boulder diffuse to about (0.34, 0.22, 0.28) [attempts: 0] — ref: tabs_screenshot_01 — ours: hud_placement.png
4. [vfx] fireball-core-dull: 240,236,228 vs 250,250,227, R/G capped near 240; coreMat.emissiveColor to (1.0, 1.0, 0.55) [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
5. [vfx] muzzle-smoke-no-dark: 154-218 vs 71-231, underside warm vs blue-violet; projectileSystem.ts spawnMuzzleFlash sm.emissiveColor to (0.09, 0.09, 0.12) [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
6. [unit-look] mammoth-hide-taupe: 108,77,76 (S0.30) vs 115,66,78 (S0.43); vehicleBuilder.ts MAMMOTH_HIDE to (0.36, 0.15, 0.19), teamTint stays 0 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
7. [unit-look] carriage-side-light: side 184,131,121 lighter than top 170,125,117, TABS shade 100,60,75; buildCannon wood emissive to (0.07, 0.035, 0.03) [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
8. [battle-feel] red-rank-knot: clubbers beside protectors at full spacing; simulationSystem.ts bracedRank keep both-bracer 0.8, mixed bracer/teammate pair 0.9 [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_5s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- fireball-foot-dull [attempts: 1] — flameMat (1.3,0.62,0.40), lobe 1 0.85: foot washed to pale pink S0.18, narrowing not visible
- fireball-core-dull [attempts: 1] — coreMat (1.0,0.97,0.75): only blue rose, whiter not creamier
- red-rank-knot [attempts: 1] — either-bracer 0.8: battlefeel_spillover_chain squire shift 0.20 < 0.55 (hoplite is a bracer)
- carriage-shade-warm [attempts: 1] — emissive (0.18,0.09,0.09): self-lit blue made the top pink
- field-dark [attempts: 1] — dir.intensity 1.0: wrong lever
- presser-lean-capped [attempts: 2] — clamp while Walking: line units are Idle/Attack
- fireball-lobes-cream [attempts: 2] — coreMat emissive (0.70,0.60,0.25): heart still 236,232,209
- mammoth-mop-hat [attempts: 2] — hideLight on crestMat: bright violet beanie

## Notes for next iteration (max 5 lines)
- Spent (never retry): presser-lean-capped, fireball-lobes-cream, mammoth-no-launch, mammoth-mop-hat, tusk-white-not-ivory, airborne-sit-square, fireball-no-orange, cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm, grass tufts. Never shrink enemy collision distance.
- ACES crushes material red and lifts G/B; judge by screen pixel. Fire mats are unlit; orange discs are flameMat (lobes i=1,3). Raising fire emissive past 1 washes to white. Self-light lifts lit and shaded faces alike.
- One gap, one change: the critic rejects scope creep and any claim not visible on screen; keep comments true.
- runtimeUnit owns root.rotation.x/z; positive hip x swings the leg back. Self-lit materials bloom unless glow-excluded. battlefeel_spillover_chain needs the squire shoved 0.55 off a hoplite.
- Self-light via factory get(cat, c, { emissive }); never mutate cached makeMat. Edit with `sed -i -b` by line number (CRLF files; main.ts and mapBuilder.ts are LF); commit with `git commit <file> -F -` heredoc.
