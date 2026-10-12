# Loop state
Iteration: 85   Last re-audit: 85   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- red-team-salmon-pink 5b44038 — APPROVE
- tribal-trunks-dark-and-fat 6570bed — APPROVE
- fight-zone-bare-ground eefd212 — APPROVE
- tribal-ring-gappy-big-crowns f2ac8d1 — APPROVE
- red-spike-hedge-behind-ring c932cf5 — APPROVE
- lightning-ruler-straight-bars 10d4f40 — REJECT (reverted bc62d47)
- zeus-laurel-floats-as-halo a1a12e9 — APPROVE
- flung-bodies-open-stars a850b3b — REJECT (reverted 71b8db0)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: red-team-salmon-pink (5b44038) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: tribal-trunks-dark-and-fat (6570bed) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: fight-zone-bare-ground (eefd212) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: tribal-ring-gappy-big-crowns (f2ac8d1) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: red-spike-hedge-behind-ring (c932cf5) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: lightning-ruler-straight-bars (10d4f40) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: zeus-laurel-floats-as-halo (a1a12e9) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: flung-bodies-open-stars (a850b3b) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] lightning-ruler-straight-bars: spawnLightning y nudge takes its own random sign * amp*(0.2+r*0.5); amp 0.7 of a shard clamped 0.3..0.6; divisor 0.7 -> 0.45 [attempts: 1] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
2. [battle-feel] flung-bodies-open-stars: _buildAirPose knees 0.15+h*0.35 -> 0.2+h*0.9, elbows -> 0.2+h*0.7 in all three variants [attempts: 1] — ref: trailer_3_sheet_03 r1c3 — ours: war_machines_1100ms.png
3. [maps-light] tribal-ring-single-file: _createTrees spread jitter 0.14 -> 0.34, ringCount 64 -> 90 [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
4. [maps-light] grass-needles-not-cards: _createFieldBlades half 0.022+r*0.014 -> 0.04+r*0.03 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
5. [unit-look] red-knight-tabard-pink: unitFactory TABARD_PALE 0.3 -> 0.75 [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
6. [maps-light] far-band-level-berry-hedge: _createHazeTreeline height 2.0+r*2.2 -> 2.0+r*4.5, radius h*0.4 -> h*(0.28+seeded*0.3) [attempts: 0] — ref: gameplay_sheet_01 r2c1 — ours: big_melee_2s.png
7. [unit-look] laurel-hoop-on-crown: propBuilder laurel y -0.04 -> -0.07, diameter 0.17 -> 0.15, tessellation 16 -> 8 [attempts: 0] — ref: gameplay_sheet_06 r3c1 — ours: closeup_pair_zeus_thor.png
8. [maps-light] crowns-read-as-dice: _createTree lollipop CreateIcoSphere subdivisions 1 -> 2 [attempts: 0] — ref: tabs_screenshot_01 — ours: lineup_medieval.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- flung-bodies-open-stars [attempts: 1] — knees 0.6+h*0.7, elbows 0.5+h*0.6: every body the same tucked crouch; TABS mixes long trailing limbs with bent ones
- lightning-ruler-straight-bars [attempts: 1] — divisor 0.45, amp 1.1 clamp 0.5..0.9: side swing and y nudge share one sign, so shards form a rack of parallel diagonal bars
- kite-shield-door-sized [attempts: 1] — widths 0.14/0.18 fine, but rim lerped 0.6 to white: references show rims darker than the face
- upright-idle-locked-legs [attempts: 2] — sag 0.2 + lean*0.4: plain idle units bend; before that 0.06 + lean*0.4: invisible
- placement-armies-specks [attempts: 2] — beta PI/6 -> PI/4.5 at radius 88: still specks; before that radius 70: rims off frame
- fireball-balloon-stack [attempts: 2] — heart 1.3 -> 0.8 and yellow: no white core; before that tongue widths halved: tongues buried
- corpses-share-heading-lie-flat [attempts: 2] — seeded yaw spin on blast flight: bodies still on one screen axis, planar
- arrowheads-outside-shafts-one-height [attempts: 1] — back -0.19, symmetric +-0.25 height: heads still visible, shafts at thigh and knee

## Notes for next iteration (max 5 lines)
- Any cut to blast lift stalls battle_recap_result_legacy_tank_shell; do not retry it. Air-pose edits must stay pose-only.
- The "trunk" material is now pale birch and shared with stumps; campaign maps use their own trunkMat (mapBuilder ~1081).
- Haze treeline is now icospheres merged per shade (variable still named cone); HAZE_MIX 0.08. Crowns use `${leaf}Crown` clones.
- TEAM_COLORS[1] is now (0.8, 0.16, 0.2) in factionColors; do not mutate TEAM_COLORS in unitFactory. getCloth materials are shared: no emissive.
- sed patterns can match twice (laurel/feather y, kite/round rim): anchor by line number and check `git diff -U0`.
