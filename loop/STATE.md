# Loop state
Iteration: 84   Last re-audit: 80   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- tribal-grass-wheat-yellow ff70046 — APPROVE
- upright-idle-locked-legs a4d6250 — REJECT (reverted 70b022e)
- mammoth-tusk-low-red-ends 54996d5 — APPROVE
- blast-grey-pancake-mound fbcdae2 — APPROVE
- far-cones-tall-salmon df6b3dc — APPROVE
- kite-shield-door-sized 3b4b501 — REJECT (reverted a4378a2)
- tribal-ring-tiered-pines 6d84324 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: tribal-grass-wheat-yellow (ff70046) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: upright-idle-locked-legs (a4d6250) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: mammoth-tusk-low-red-ends (54996d5) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: blast-grey-pancake-mound (fbcdae2) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: far-cones-tall-salmon (df6b3dc) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: kite-shield-door-sized (3b4b501) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: tribal-ring-tiered-pines (6d84324) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] cast-stance-pillar-legs: proceduralAnimation _animateUtilityAction and ranged attack stances: hips -0.2, knees 0.4, shoulders offset +-0.22 so casting giants leave column legs and mirrored arms [attempts: 0] — ref: gameplay_sheet_05 r3c2 — ours: closeup_state_reads.png
2. [vfx] blast-snowman-stack: visualEffects blast fire lobes: double horizontal reach, halve rise, lobe colours toward (1, 0.93, 0.7), no grey smoke lobes in the first 0.3 s [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
3. [maps-light] tribal-ring-sparse-gems: _createTree ball to subdivisions 2, crown emissive 0.26 -> 0.4, trunk to pale grey-tan; ring tree count up about 1.5x [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
4. [unit-look] kite-rim-pale: propBuilder kite widths 0.18/0.22 -> 0.14/0.18 only; rim stays teamColor.scale(0.45) (reverted, so the rim is already dark) [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
5. [maps-light] far-cones-red-spikes: _createHazeTreeline: small icosphere on a stalk instead of a cone on the tribal map [attempts: 0] — ref: gameplay_sheet_01 r2c1 — ours: big_melee_2s.png
6. [unit-look] mammoth-tusk-plank: buildMammoth last two tuskPitches to about 2.5, 3.0 so tips curl over the crowd; round tessellation; tip colour color.scale(0.8) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
7. [maps-light] tribal-grass-flat-saturated: light grass-blade shade to about (0.95, 0.62, 0.3) so tips are paler than the ground [attempts: 0] — ref: tabs_screenshot_01 — ours: lineup_medieval.png
8. [maps-light] tribal-sky-grey-teal: tribal sky/clear colour toward saturated teal-green, about (0.38, 0.78, 0.68) [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_1100ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- kite-shield-door-sized [attempts: 1] — widths 0.14/0.18 fine, but rim lerped 0.6 to white: references show rims darker than the face
- upright-idle-locked-legs [attempts: 2] — sag 0.2 + lean*0.4: plain idle units bend, the giants in closeup_state_reads are not in the idle path; before that 0.06 + lean*0.4: invisible
- placement-armies-specks [attempts: 2] — beta PI/6 -> PI/4.5 at radius 88: still specks, sky behind Start; before that radius 70: rims off frame
- fireball-balloon-stack [attempts: 2] — heart 1.3 -> 0.8 and yellow: no white core, equal balloons; before that tongue widths halved: tongues buried
- corpses-share-heading-lie-flat [attempts: 2] — seeded yaw spin on living blast flight: lying bodies still on one screen axis, spread-eagled and planar
- arrowheads-outside-shafts-one-height [attempts: 1] — back -0.19, symmetric +-0.25 height: heads still visible, shafts land at thigh and knee

## Notes for next iteration (max 5 lines)
- Critic did not verify the giants' state in closeup_state_reads (gallery_state_reads, 2200 ms); confirm the path before editing. Idle sag is back to lean*0.4.
- Any cut to blast lift stalls battle_recap_result_legacy_tank_shell; do not retry it. Dust mound settle (40%) is approved; leave it.
- All tribal crowns now use `${leaf}Crown` clones; recolorBaseTerrain re-shades them for campaign maps, keep in step. HAZE_MIX is 0.08, cones 2.0-4.2.
- Tusk tips use getCloth(color), a shared cached material: do not set emissive on it. unitFactory: never touch TEAM_COLORS.
- sed patterns can match twice (kite rim line also exists on the round shield): check `git diff -U0` line counts before committing.
