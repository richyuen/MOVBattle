# Loop state
Iteration: 89   Last re-audit: 85   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- tribal-ring-one-deep 8ce9990 — APPROVE
- zeus-grey-breastplate 47d0ce0 — APPROVE
- downed-one-prone-pose 6d6953b — APPROVE
- knight-limbs-team-colour 39e92a4 — APPROVE
- flung-bodies-wide-v 86a42c1 — APPROVE
- crowns-second-hue-lemon 40ae08c — REJECT (reverted 0fdd871)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: tribal-ring-one-deep (8ce9990) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: zeus-grey-breastplate (47d0ce0) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: downed-one-prone-pose (6d6953b) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: knight-limbs-team-colour (39e92a4) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: flung-bodies-wide-v (86a42c1) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: crowns-second-hue-lemon (40ae08c) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] crowns-second-hue-lemon: darkLeaves diffuse (0.93, 0.62, 0.22) -> about (0.93, 0.58, 0.22); leave `leaves` and emissive alone [attempts: 1] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
2. [maps-light] grass-knee-high-carpet: blade height -40%, blades wider flat cards; hides feet and corpses [attempts: 2] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
3. [battle-feel] corpses-all-flat: a third of limp bodies (from `pick`) roll 0.9-1.3 rad about the long axis to rest on a side [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
4. [unit-look] knight-tabard-no-skirt: tabard-colour piece below the belt (torso clone, y about 0.5, x/z about 1.15, at the hip) [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
5. [battle-feel] flung-torsos-rigid-planks: _buildAirPose knees 0.1+h*1.2, torso x-arch +-0.5 on the sit variant [attempts: 0] — ref: trailer_3_sheet_03 r1c3 — ours: war_machines_1100ms.png
6. [unit-look] zeus-no-robe-skirt: off-white skirt (torso clone about 1.1 wide, waist to knee), zeusSash width 2.3 -> 1.9 [attempts: 0] — ref: gameplay_sheet_06 r3c1 — ours: closeup_pair_zeus_thor.png
7. [maps-light] tribal-ring-top-arc-thin: spread 0.94 + s*0.32, ring crown radius x1.25 [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
8. [vfx] muzzle-smoke-one-ball: split cannon muzzle smoke into 3-4 smaller grey-white lumps along the barrel axis [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- crowns-second-hue-lemon [attempts: 1] — leaves (0.90, 0.38, 0.30) and emissive 0.30: the yellow material was untouched and still lemon
- tribal-ring-one-deep [attempts: 1] — spread 0.34 -> 0.22: band got narrower, not deeper; bare apron to the rim
- grass-knee-high-carpet [attempts: 2] — half 0.025+s*0.02: needles, cards must be wide; 4 m open cells do not read; before that patchHeight cut
- far-band-level-berry-hedge [attempts: 2] — height 5-11, y 0.85h, subdiv 2: giant trunkless balls dwarf the ring; before that 2-6.5: hidden below the ring
- lightning-ruler-straight-bars [attempts: 2] — strict left/right alternation still an even thin sawtooth; before that parallel bars
- kite-shield-door-sized [attempts: 1] — rim lerped 0.6 to white: references show rims darker than the face
- upright-idle-locked-legs [attempts: 2] — sag 0.2 + lean*0.4: plain idle units bend; before that 0.06: invisible
- placement-armies-specks [attempts: 2] — beta PI/4.5 at radius 88: still specks; radius 70: rims off frame

## Notes for next iteration (max 5 lines)
- Any cut to blast lift stalls battle_recap_result_legacy_tank_shell; do not retry it. Air-pose edits must stay pose-only. fireball-balloon-stack is spent (2 attempts).
- Ring is 210 trees 3-6 tall, spread 1+s*0.26. trailer_3_sheet_03 r3c1 is not TABS: do not cite it. Far crowns must stay smaller than ring crowns.
- _buildLimpPose must draw no new Math.random(): derive from `pick` bits (512, 1024, 2048 are taken). It has torsoY now.
- TEAM_COLORS[1] is (0.8, 0.16, 0.2); do not mutate it. getCloth materials are shared: no emissive. Zeus edits gate on `isZeus` in unitFactory.
- Working copies are LF: sed -i by line number after a fresh grep -n works; multi-line edits via a node script in $TEMP. Laurel case is shared.
