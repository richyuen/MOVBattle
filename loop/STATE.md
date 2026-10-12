# Loop state
Iteration: 88   Last re-audit: 85   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- crowns-blood-red f02ca9a — APPROVE
- flung-bodies-all-horizontal 9c18f82 — APPROVE
- grass-knee-high-carpet 412e23f — REJECT (reverted 01b2bd5)
- tabard-back-salmon-fat-cross 580549c — APPROVE
- zeus-bald-sweatband 68f9474 — APPROVE
- tribal-ring-one-deep 008b158 — REJECT (reverted ae8672e)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: crowns-blood-red (f02ca9a) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: flung-bodies-all-horizontal (9c18f82) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: grass-knee-high-carpet (412e23f) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: tabard-back-salmon-fat-cross (580549c) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: zeus-bald-sweatband (68f9474) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: tribal-ring-one-deep (008b158) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] tribal-ring-one-deep: _createTrees ringCount 140 -> 210, spread 1 + s * 0.26 so trees fill out to the rim [attempts: 1] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
2. [maps-light] grass-knee-high-carpet: _createFieldBlades half 0.05+s*0.04, mask 0.38/0.33 on 2 m cells (index cellX*64+cellZ) [attempts: 2] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png
3. [unit-look] zeus-grey-breastplate: zeus torso cloth (0.94, 0.92, 0.86), shoulder pads off, red sash (0.8, 0.2, 0.2); hair radiusY 0.075, radiusZ 0.08 at (0, -0.05, -0.03), laurel local y +0.005 [attempts: 0] — ref: gameplay_sheet_06 r3c1 — ours: closeup_pair_zeus_thor.png
4. [battle-feel] downed-one-prone-pose: downed pose gets hashed shoulder z +-0.6 per arm and torso twist +-0.5 [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
5. [vfx] fireball-balloon-stack: white smoke sphere x0.6, core emissive (1, 0.75, 0.35), puff count halved [attempts: 2] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
6. [unit-look] knight-limbs-team-colour: tabard branch arms to mail grey (0.78, 0.8, 0.84), TABARD_LENGTH 1.35 -> 1.6, tabard z 1.06 -> 1.18 [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: lineup_medieval.png
7. [battle-feel] flung-bodies-wide-v: _buildAirPose hipGap 0.25+h(45)*0.35, kick 0.15+h(47)*0.25, elbows 0.2+h()*0.8 [attempts: 0] — ref: trailer_3_sheet_03 r1c3 — ours: war_machines_1100ms.png
8. [maps-light] crowns-second-hue-lemon: crown emissive 0.38 -> 0.30 (both sites), leaves (0.90, 0.38, 0.30); far clumps still blood red [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- tribal-ring-one-deep [attempts: 1] — spread 0.34 -> 0.22: band got narrower, not deeper; bare apron to the rim
- grass-knee-high-carpet [attempts: 2] — half 0.025+s*0.02: needles, cards must be wide; 4 m open cells do not read; before that patchHeight cut
- far-band-level-berry-hedge [attempts: 2] — height 5-11, y 0.85h, subdiv 2: giant trunkless balls dwarf the ring; before that 2-6.5: hidden below the ring
- lightning-ruler-straight-bars [attempts: 2] — strict left/right alternation still an even thin sawtooth; before that parallel bars
- kite-shield-door-sized [attempts: 1] — rim lerped 0.6 to white: references show rims darker than the face
- upright-idle-locked-legs [attempts: 2] — sag 0.2 + lean*0.4: plain idle units bend; before that 0.06: invisible
- placement-armies-specks [attempts: 2] — beta PI/4.5 at radius 88: still specks; radius 70: rims off frame
- fireball-balloon-stack [attempts: 2] — heart 0.8 and yellow: no white core; tongue widths halved: tongues buried

## Notes for next iteration (max 5 lines)
- Any cut to blast lift stalls battle_recap_result_legacy_tank_shell; do not retry it. Air-pose edits must stay pose-only.
- Ring is 140 trees 3-6 tall, spread 1+(s-0.3)*0.34: bias outward, never inward. trailer_3_sheet_03 r3c1 is not TABS: do not cite it.
- Haze treeline is trunkless icospheres merged per shade; far crowns must stay smaller than ring crowns. Crowns use `${leaf}Crown` clones.
- TEAM_COLORS[1] is (0.8, 0.16, 0.2); do not mutate TEAM_COLORS in unitFactory. getCloth materials are shared: no emissive.
- Working copies are LF: sed -i by line number after a fresh grep -n works; check `git diff -U0`. unitVisuals has no per-unit torso colour hook (materialPreset only); laurel case is shared by all laurel wearers.
