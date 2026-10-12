# Loop state
Iteration: 118   Last re-audit: 115   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- fireball-no-rim e8c25c3 — APPROVE
- field-dark b2342a2 — APPROVE
- fireball-foot-peach d536974 — APPROVE
- runner-lean-uniform d49a245 — APPROVE
- carriage-shade-warm 4b6f26a — REJECT (reverted 7aaf8d0)
- muzzle-smoke-grey 5abc943 — APPROVE
- red-line-loose 2bb5068 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-no-rim (e8c25c3) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: field-dark (b2342a2) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: fireball-foot-peach (d536974) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: runner-lean-uniform (d49a245) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: carriage-shade-warm (4b6f26a) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-grey (5abc943) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: red-line-loose (2bb5068) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] carriage-shade-warm: critic saw top 191,150,154 (B/R 0.80) vs 160-171,112-123,104-110 (B/R 0.65), 30-40 too light; buildCannon wood diffuse to (0.50, 0.20, 0.12), emissive to (0.14, 0.07, 0.06) [attempts: 1] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
2. [maps-light] field-pale: 220,170,119 (B/R 0.54) vs 238,164,103 (0.43), shadows 0.89 of field vs 0.4-0.8; mapBuilder.ts grass.emissiveColor to (0.16, 0.035, 0.0) [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
3. [vfx] fireball-core-dull: 238,235,219 vs 250,250,226; visualEffects.ts coreMat.emissiveColor to (1.0, 0.97, 0.75) [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
4. [vfx] fireball-foot-dull: 213,156,111 vs 243,189,143, orange lobe as wide as the core (two balls); flameMat.emissiveColor to (1.3, 0.62, 0.40), lobeSizes[1] 1.0 to 0.85 [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
5. [vfx] muzzle-smoke-unfaceted: 182-214 throughout vs lit 209 beside shaded 76-125, cool tint; projectileSystem.ts spawnMuzzleFlash sm emissive to (0.22, 0.21, 0.19), diffuse to (0.90, 0.88, 0.80) [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
6. [battle-feel] red-rank-knot: a knot plus stragglers, tightening skips protector-clubber pairs; simulationSystem.ts bracedRank 0.8 for same-team pairs with at least one ai.brace [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
7. [battle-feel] runner-stride-uniform: rigid planks at 20-35 deg, one stride length vs 10-15 deg, mixed strides; _animateWalkHumanoid hash legSwing 0.45-0.65 per unit [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: closeup_weapon_reads.png
8. [unit-look] mammoth-flat-purple: flat team purple vs brown fur with blue paint stripes and banded tusks; vehicleBuilder.ts mammoth body to brown (0.36, 0.20, 0.16), team colour on stripes and tusk bands only [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- carriage-shade-warm [attempts: 1] — diffuse G 0.27, emissive (0.18,0.09,0.09): self-lit blue lifts the lit top to pink B/R 0.80, top G/R unchanged
- field-dark [attempts: 1] — dir.intensity 1.0: field red 209 to 211 only, shadows darker; wrong lever
- presser-lean-capped [attempts: 2] — clamp 0.75 while Walking: no front-rank torso past 0.6, line units are Idle/Attack
- fireball-lobes-cream [attempts: 2] — coreMat emissive (0.70,0.60,0.25): heart still 236,232,209; TABS core is cream, rim is the yellow
- mammoth-mop-hat [attempts: 2] — hideLight on crestMat: cap 98,60,116, bright violet beanie, further from ref
- tusk-white-not-ivory [attempts: 2] — diffuse (0.80,0.60,0.40): still 202,190,174; emissive and bloom set it
- mammoth-no-launch [attempts: 2] — lift 13-17: farmer airborne and "steady" at 2.1s, fails battlefeel_spillover_chain
- shove-attack-fold [attempts: 1] — half shove pitch while Attacking: folds still there at 5s

## Notes for next iteration (max 5 lines)
- Spent (never retry): presser-lean-capped, fireball-lobes-cream, mammoth-no-launch, mammoth-mop-hat, tusk-white-not-ivory, airborne-sit-square, fireball-no-orange, cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm, grass tufts. Never shrink enemy collision distance.
- ACES crushes material red and lifts G/B; judge by screen pixel. Fire mats are unlit; orange discs are flameMat (lobes i=1,3). TEAM_COLORS[1] must not be mutated. Sun intensity does not lift the field; self-light does, and it lifts lit faces too.
- One gap, one change: the critic rejects scope creep and any claim not visible on screen; keep comments true.
- runtimeUnit owns root.rotation.x/z (do not write it in animation); positive hip x swings the leg back. Self-lit materials bloom unless glow-excluded.
- Self-light via factory get(cat, c, { emissive }); never mutate cached makeMat. Edit with `sed -i -b`, never `\n` in the replacement (CRLF files; main.ts and mapBuilder.ts are LF); commit with `git commit <file> -F -` heredoc.
