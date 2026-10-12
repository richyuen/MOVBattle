# Loop state
Iteration: 37   Last re-audit: 35   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- grass-short-sparse b9bfd85 — APPROVE
- cloth-same-hue-no-boots 4d892cc — APPROVE
- downed-pose-crouch 5e0bc42+60970c4 — REJECT (reverted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: grass-short-sparse (b9bfd85) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 2/5)
- GAP: cloth-same-hue-no-boots (4d892cc) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: downed-pose-crouch (5e0bc42, 60970c4) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] downed-pose-crouch: blast victims invisible once down; want varied limp bodies readable on the ground in heaps [attempts: 1] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
2. [maps-light] grass-slab-carpet: uniform carpet of wide flat-topped lime slabs hides bodies and center line; want thin tapered blades in patches with bare ground [attempts: 0] — ref: tabs_screenshot_02 — ours: lineup_medieval.png
3. [unit-look] red-cloth-bare-thighs: red-team cloth only a darker red, thighs bare; want off-hue cloth and trousers or leg wraps [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
4. [maps-light] island-rect-no-cliff: rectangular slab in pale fog; want round floating island with visible rim [attempts: 1] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
5. [unit-look] stick-limbs-box-hands (= cube-hands-stick-limbs): square stick limbs, cube hands, box torsos, small props [attempts: 2] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
6. [battle-feel] shield-line-gapped: lines mingle loosely; want two-deep compression and overlapping shield wall [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
7. [vfx] cannon-no-dust-debris: smoke is a few small white balls, no dust burst or debris at impact [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
8. [camera] lineup-result-far: units small, half the frame empty grass; want front line filling frame [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- downed-pose-crouch [attempts: 1] — prone bodies not visible in any PNG (grass hides them); air pose cloned rigid stars
- lime-field-flat-sky [attempts: 1] — sky went grey; frame-wide -18 saturation muddied team colours
- muzzle-smoke-bank [attempts: 2] — bank is impact smoke, not muzzle
- plank-lean-rod-arms [attempts: 1] — attack-only elbow clamp
- cube-hands-stick-limbs [attempts: 2] — thin box trades cube for paddle

## Notes for next iteration (max 5 lines)
- Pickable now: 2, 3, 4, 6, 7, 8 (1 and 5 are on the rejected list).
- Gap 2: _createFieldBlades keep height, half back to 0.04-0.06, skip ~1/3 of tufts by a low-frequency seeded mask.
- Gap 3: unitFactory drop CLOTH_SHADE multiply for clothed presets (hue shift, not value); thighs to cloth.
- Blast downed time over 3 s fails battle_recap_result_legacy_tank_shell (12 s window); keep it at or under 3 s.
