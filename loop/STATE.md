# Loop state
Iteration: 182   Last re-audit: 180   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: staff and bolt casters still stand to attention, arms plumb and mirrored; bowmen's stagger and turn do not read at battle distance; heroes still half squat with the free arm thrown wide; the pushing rank leans in one shared pose; wall spears pitch over the enemy's heads
unit-look: a PASS b PASS c FAIL d FAIL (2/4) — c: the torso hull is a V with a flat top plate, eave corners and a wasp waist, chest an inset bib; forearm as thick as the upper arm, pelvis a separate box, head a tall square-jawed box; d: pinprick eyes, faces blank at battle distance
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b FAIL c PASS d PASS (3/4) — b: the burst is translucent orange jelly lobes with black spike artefacts; the ball shows only at 3800ms and reads navy
Total 20/24. Weak passes (re-audit): battle-feel.a overlap seen side-on only; battle-feel.b rests on the cannon pair; camera.c and ui-flow.d have no still.

## Focus (every gap this iteration)
BASE faa6fac
- [S] battle-feel.c aimed-men-stand-to-attention (fc3d8e1) — APPROVE, criterion still FAIL
- [S] unit-look.c shoulder-shelf-armpit-gap (95c74ae) — APPROVE, criterion still FAIL
- [P] unit-look.c YOKE_REACH 0.42 -> 0.2 (6f6ce1e) — APPROVE, criterion still FAIL
- [P] battle-feel.c sunk-stance-half-squat (b6f16ff) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] battle-feel.c aimed-men-stand-to-attention (fc3d8e1) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [S] unit-look.c shoulder-shelf-armpit-gap (95c74ae) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [P] unit-look.c YOKE_REACH 0.42 -> 0.2 (6f6ce1e) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [P] battle-feel.c sunk-stance-half-squat (b6f16ff) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] battle-feel.c casters-stand-to-attention [0] — a staff/bolt ready hold for non-bow ranged men (staff planted with a bent arm, weight on one hip, off hand raised) — ref trailer_3_sheet_02 r1c2 — ours closeup_state_reads
2. [S] unit-look.c head-is-a-tall-square-box [0] — a head shorter than it is wide at the brow, tapering to a narrow chin and rounded crown — ref tabs_screenshot_04 — ours closeup_state_reads
3. [S] unit-look.d faces-blank-at-distance [0] — eye beads sized from head width (large, wide-set, proud of the face) — ref tabs_screenshot_06 — ours big_melee_5s
4. [S] vfx.b jelly-burst-no-ball [0] — opaque faceted fireball core; a black ball mesh held visible along its flight — ref trailer_3_sheet_02 r2c1 — ours war_machines_1100ms
5. [S] battle-feel.c wall-spears-over-heads [0] — aim each wall spear at its target's chest once in contact — ref trailer_3_sheet_01 r3c1 — ours shield_wall_2500ms
6. [P] battle-feel.c bow ready stagger 0.24-0.40 -> 0.40-0.60, yaw 0.35-0.70 -> 0.60-0.95 [0] — fallout of 182 aimed-men-stand-to-attention — ref trailer_3_sheet_01 r1c1 — ours big_melee_9s
7. [P] unit-look.c YOKE_RISE 0.3 -> 0.1 and HULL_WAIST 0.8 -> 1.0 [0] — fallout of 182 shoulder-shelf-armpit-gap — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
8. [S] unit-look.c forearm-thick-as-upper-arm [0] — a forearm tapering steadily to a thin wrist under the mitt, replacing the belly swell — ref tabs_screenshot_04 — ours closeup_state_reads

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- shade-density [attempts: 1, lawn shade row spent for [P]] — weight 0.6/0.5/0.4 + lift: shadow contrast fell from 28% to 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still
- plank-corpses [attempts: 2, 1 approved 164] — 163: flank landing + sagittal curl lay flat in the ground plane
- dust-ring-grey [attempts: 1, spent] — stone tan still rendered neutral grey; colour is not the cause
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare

## Notes for next iteration (max 5 lines)
- LEDGER.md sits at its byte cap: trim prose before adding, run budget.mjs after each edit. Patch sources with a node script written by the Write tool into the scratchpad (each find asserted once), commit per gap with `git commit <path> -F <msgfile>`. No [P] on YOKE_REACH, sunk crouch, spearDip, FOREARM/CALF_SWELL, helm crown, lawn shade, carry bob.
- Idle: `_buildIdlePose` picks hip-shot/sunk/at-ease; `_buildCarry().ready` (bow units, `locomotionBias === "aimed"` with something in the right hand) gives the port/upright/low hold, left hand across, hip+torso yaw, staggered legs, and `_carryProp` turns the node named `bow` (spin, seat) in Idle only. Casters (staff, bolt) have no hold yet: gap 1; the wizard and arbiter in closeup_state_reads stand plumb. Do not raise idle lean or the free-foot 0.08; never add walk torso yaw.
- No idle bowman is close to camera in any still (lineup_medieval archer is small): an evidence shot would help gap 6. `window.game` has no camera setter; gallery scenarios carry `cameraOverride`.
- Torso: bodyBuilder `wedgeTorso` plus `shoulderYoke` (box hull from HULL_WAIST of the waist at HULL_FOOT up to the yoke, then a slope to the neck); leave `shoulderOffX` alone, the helm rim is cut from it. Do not fatten forearms or legs. Eye whites and pupils exist but are `setEnabled(false)`.
- Shafts: projectileSystem `_leaveAsLitter`. Wall: `_buildBracePose` feeds the shove overlay, `_squareShield`, `_carrySpear` (dip only, never yaw). Shadows: maps-light.b passes, leave it.
