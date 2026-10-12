# Loop state
Iteration: 60   Last re-audit: 60   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- torso-box-no-shoulders e93b15d — APPROVE
- placement-haze-washes-teams e38b30b — APPROVE
- cannon-barrel-team-blue 7abd529 — APPROVE (closed)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: torso-box-no-shoulders (e93b15d) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: placement-haze-washes-teams (e38b30b) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: cannon-barrel-team-blue (7abd529) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] red-armour-muddy-maroon: red knight armour and helms brown-maroon, TABS is saturated crimson [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
2. [maps-light] placement-haze-washes-teams: no cast tree shadows in placement; far tree wall and canopies bleach mint [attempts: 1] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
3. [unit-look] torso-box-no-shoulders: forearms and shins still sticks, no shoulder caps, armoured torsos read as columns [attempts: 1] — ref: gameplay_sheet_03 r1c3 — ours: closeup_weapon_reads.png
4. [vfx] fire-yellow-outweighs-orange: white-hot core fading through orange, no hard yellow planks [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
5. [maps-light] placement-board-bare: round island with fields, paths, huts, river [attempts: 0] — ref: gameplay_sheet_02 r3c3 — ours: hud_placement.png
6. [battle-feel] shield-wall-loose: shields overlap rim to rim in a facing line [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
7. [unit-look] helm-neutral-steel: blue knights' helms and plate neutral grey, TABS has blue-tinted gear and a team tabard [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: big_melee_2s.png
8. [unit-look] cannon-barrel-plain-tube: short stepped barrel set low between carriage cheeks, spoked wheels [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- fire-orange-not-fringe [attempts: 1] — orange mass went up (4/7 tongues); grey smoke reads as rocks
- tabs-filled-round-tiles [attempts: 1] — point on wrong end; hollow tabs float off the tray
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey
- front-line-does-not-compress [attempts: 1] — regression: pack-scaled solver radii failed crowd_topple, spillover_chain

## Notes for next iteration (max 5 lines)
- Gap 1: unitFactory medieval_steel blend (.62,.64,.68) x CLOTHED_PRESET_WEIGHT .75, CLOTH_SHADE .8. Gap 7 wants the opposite of the old helm notes: more team tint.
- Gap 2: main.ts ShadowGenerator/dir light frustum must cover the island at radius 100; fog now follows camera radius.
- Gap 3: bodyBuilder `/ SLEEVE_BULK` on lowerArmTop/lowerLegTop cancels the bulk; halve it.
- Cannon body mesh is now a hidden axle: check hit-flash still shows. main.ts, bodyBuilder, visualEffects are CRLF: edit by node script.
- shield-wall-loose is solver territory (see rejected front-line); also open: fireball-merged-bloom, tabs-filled-round-tiles.
