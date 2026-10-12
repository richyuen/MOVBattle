# Loop state
Iteration: 117   Last re-audit: 115   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- fireball-lobes-cream a14b362 — REJECT (reverted e50b0b2)
- presser-lean-capped 56c0387 — REJECT (reverted 1732da0)
- lean-waist-fold e98a19b — APPROVE
- field-dark 8f25a40 — REJECT (reverted 99bbffe)
- carriage-top-tan 53c7b44 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-lobes-cream (a14b362) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: presser-lean-capped (56c0387) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: lean-waist-fold (e98a19b) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: field-dark (8f25a40) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: carriage-top-tan (53c7b44) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] fireball-no-rim: cream 236,230,201 to the edge vs white core 250,250,226 with yellow rim 240,221,129; flashMat lobes buried in heart; visualEffects.ts lobeSizes[0] 1.3 to 1.0, leave coreMat [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [maps-light] field-dark: field 211,151,101 vs 238,164,105, tree shadow 151,73,51 vs 188,108,83; mapBuilder.ts _createMaterials grass.emissiveColor (0.14, 0.07, 0.035), leave the sun [attempts: 1] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
3. [battle-feel] presser-lean-capped: front rank at the line torso-vertical; standing pressers get 0.2-0.35 rad; _buildShovePose pitch 0.2 to 0.4 base [attempts: 2, spent] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
4. [vfx] fireball-foot-peach: foot 229,206,172 / 210,160,118 vs opaque orange 243,189,143 to 238,168,134; visualEffects.ts lobeSizes i=1,3 0.8/0.7 to 1.0/0.9 [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
5. [battle-feel] runner-lean-uniform: every runner 0.22 trail + 0.55 lean, forward reach 0.33 rad; _animateWalkHumanoid trail per-unit 0.12-0.32 from _wobblePhase [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: closeup_weapon_reads.png
6. [unit-look] carriage-shade-warm: shaded faces 141,95,75 B/R 0.54 vs 0.67-0.71, top G/R 0.79 vs 0.74; buildCannon wood emissive to (0.18, 0.09, 0.09), diffuse G 0.30 to 0.27 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
7. [vfx] muzzle-smoke-grey: 157,156,157 vs near-white puffs, grey only on shaded facets; visualEffects.ts muzzle smoke emissive +0.15 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
8. [battle-feel] red-line-loose: single file, a body-width between shields, no two-deep press; shield-unit spacing/separation -20% [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- field-dark [attempts: 1] — dir.intensity 1.0: field red 209 to 211 only, shadows darker; wrong lever
- presser-lean-capped [attempts: 2] — clamp 0.75 while Walking: no front-rank torso past 0.6, line units are Idle/Attack
- fireball-lobes-cream [attempts: 2] — coreMat emissive (0.70,0.60,0.25): heart still 236,232,209; TABS core is cream, rim is the yellow
- mammoth-mop-hat [attempts: 2] — hideLight on crestMat: cap 98,60,116, bright violet beanie, further from ref
- tusk-white-not-ivory [attempts: 2] — diffuse (0.80,0.60,0.40): still 202,190,174; emissive and bloom set it
- mammoth-no-launch [attempts: 2] — lift 13-17: farmer airborne and "steady" at 2.1s, fails battlefeel_spillover_chain
- shove-attack-fold [attempts: 1] — half shove pitch while Attacking: folds still there at 5s
- mammoth-mop-beret [attempts: 1] — dome (0, 0.5, 0.52): still two lumps, reads as a cap peak

## Notes for next iteration (max 5 lines)
- Spent (never retry): presser-lean-capped, fireball-lobes-cream, mammoth-no-launch, mammoth-mop-hat, tusk-white-not-ivory, airborne-sit-square, fireball-no-orange, cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm, grass tufts. Never shrink enemy collision distance.
- ACES crushes material red and lifts G/B; judge by screen pixel. Fire mats are unlit; orange discs are flameMat (lobes i=1,3). TEAM_COLORS[1] must not be mutated. Sun intensity does not lift the field.
- One gap, one change: the critic rejects scope creep and any claim not visible on screen; keep comments true.
- runtimeUnit owns root.rotation.x/z (do not write it in animation); positive hip x swings the leg back. Self-lit materials bloom unless glow-excluded.
- Self-light via factory get(cat, c, { emissive }); never mutate cached makeMat. Edit with `sed -i -b` (CRLF files; main.ts and mapBuilder.ts are LF); commit with `git commit <file> -F -` heredoc.
