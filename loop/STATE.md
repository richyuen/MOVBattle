# Loop state
Iteration: 58   Last re-audit: 55   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- flame-tongues-needle-cones ffce323 — APPROVE
- helm-torso-wide-pale 86b463f — APPROVE
- tabs-filled-round-tiles fbba6db — REJECT (reverted ceb2e0a)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: flame-tongues-needle-cones (ffce323) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: helm-torso-wide-pale (86b463f) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: tabs-filled-round-tiles (fbba6db) VERDICT: REJECT SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [ui-flow] tabs-peak-up-on-tray: house-shaped tabs, peak at TOP, flat base flush on tray edge, tray-tint fill [attempts: 1] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
2. [unit-look] helm-stovepipe-pale: shorter, head-wide, dark charcoal steel, bold slit [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_weapon_reads.png
3. [vfx] fire-orange-not-fringe: outer-leaning tongues orange, core brighter than smoke [attempts: 0] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
4. [vfx] burst-narrow-upright: low, wide, round-ended lobes over several body-widths [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
5. [ui-flow] budget-separate-disc: two stacked boxes with icons joined to tray's left arc [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
6. [unit-look] torso-plain-columns: belts, cuffs, boots, two-tone tunics [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
7. [maps-light] arena-flat-rectangle: round island, warm saturated ground, hard shadows [attempts: 0] — ref: gameplay_sheet_02 r3c3 — ours: big_melee_placement.png
8. [battle-feel] front-line-loose-groups: shoulder-to-shoulder, overlapping shields [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- tabs-filled-round-tiles [attempts: 1] — point on wrong end; hollow tabs float off the tray
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey
- front-line-does-not-compress [attempts: 1] — regression: pack-scaled solver radii failed crowd_topple, spillover_chain
- idle-arms-hang-symmetric [attempts: 1] — raised weapon arm did not show on knight/Zeus

## Notes for next iteration (max 5 lines)
- Gap 2: propBuilder great_helm: height .21->.16, diameters .175/.21->.15/.18, steel (.28,.29,.32), slit height .03; recompute faceR.
- Gap 3: visualEffects tongue loop: lean >= 0.8 -> flameMat, near-vertical -> flashMat; coreMat brighter than smokeMat.
- Gap 1 (2nd try): SVG bg path `M2 98V30L50 2L98 30V98Z`, dark fill ~.6, padding 12px 9px 5px, no top margin.
- visualEffects.ts is CRLF; script edits must match line endings. No new Math.random in VFX or poses.
- Prefer different files: 2 (propBuilder), 3 (visualEffects), 5 (index.html).
