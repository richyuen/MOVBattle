# Loop state
Iteration: 183   Last re-audit: 180   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: shooting archers square up, feet parallel; heroes half squat with the free arm thrown wide (Zeus's off arm level, Thor arms out); the pushing rank leans in one shared pose; wall spears pitch over the enemy's heads; casters stand feet together under the hold
unit-look: a PASS b PASS c FAIL d FAIL (2/4) — c: the torso tops out in a flat plate with eave corners over each arm, hull a V; forearm as thick as the upper arm; chin as narrow as the neck, bare neck long; d: pinprick eyes, faces blank at battle distance
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b FAIL c PASS d PASS (3/4) — b: the burst is translucent orange jelly lobes with black shards; the ball shows only at 3800ms and reads navy
Total 20/24. Weak passes (re-audit): battle-feel.a overlap seen side-on only; battle-feel.b rests on the cannon pair; camera.c and ui-flow.d have no still.

## Focus (every gap this iteration)
BASE 1ced154
- [S] battle-feel.c casters-stand-to-attention (6c4a3c2) — APPROVE, criterion still FAIL
- [S] unit-look.c head-is-a-tall-square-box (0c88ed4) — APPROVE, criterion still FAIL
- [P] battle-feel.c bow ready stagger/yaw (8408f80) — APPROVE, criterion still FAIL
- [P] unit-look.c YOKE_RISE 0.1, HULL_WAIST 1.0 (def3bf5) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] battle-feel.c casters-stand-to-attention (6c4a3c2) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [S] unit-look.c head-is-a-tall-square-box (0c88ed4) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [P] battle-feel.c bow ready stagger 0.24-0.40 -> 0.40-0.60, yaw 0.35-0.70 -> 0.60-0.95 (8408f80) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [P] unit-look.c YOKE_RISE 0.3 -> 0.1 and HULL_WAIST 0.8 -> 1.0 (def3bf5) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] unit-look.c torso-top-is-a-plate-with-eaves [0] — replace the yoke slab with a ridge sloping from the neck to each sleeve head, hull sides near parallel — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
2. [S] battle-feel.c wall-spears-pitch-over-heads [0] — a rear-rank spear state levelled over the front man's shoulder at the enemy's chest when engaged — ref trailer_3_sheet_01 r3c1 — ours shield_wall_2500ms
3. [S] battle-feel.c archers-square-up-to-shoot [0] — hold the ready turn and stagger through draw and loose — ref trailer_3_sheet_01 r1c1 — ours big_melee_9s
4. [S] battle-feel.c heroes-half-squat-arm-wide [0] — a hero stance (upright stride, weight forward, free arm hanging or on the weapon) — ref tabs_screenshot_02 — ours closeup_pair_zeus_thor
5. [S] unit-look.d pinprick-eyes [0] — large white eyeball with a black pupil that reads at battle distance — ref tabs_screenshot_04 — ours closeup_weapon_reads
6. [S] vfx.b burst-is-jelly-lobes [0] — opaque white-yellow flash core with a solid smoke bank, no translucent shells or black shards — ref trailer_3_sheet_02 r2c1 — ours war_machines_1100ms
7. [P] unit-look.c HEAD_RINGS chin 0.5 -> 0.72, cheek 0.8 -> 0.9 [0] — fallout of 183 head-is-a-tall-square-box — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
8. [P] battle-feel.c bolt hold off arm (left.out to -0.1..0.15, left.elbow -1.2) [0] — fallout of 183 casters-stand-to-attention — ref trailer_3_sheet_01 r3c1 — ours closeup_pair_zeus_thor

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
- LEDGER.md sits at its byte cap: trim prose before adding, run budget.mjs after each edit; commit per gap with `git commit <path> -F <msgfile>`. No [P] on YOKE_REACH/_RISE, HULL_WAIST, bow ready yaw/stagger, sunk crouch, spearDip, FOREARM/CALF_SWELL, helm crown, lawn shade, carry bob.
- Poses: `_buildCarry().ready` is the bow hold (aimed) or, with `cast: true`, the staff/bolt hold (rod = `bolt` or `staff` with an `orb`; `prop.plant` stands the staff on the ground in `_carryProp`); casters cast through `_animateCast` (from `_animateAttackHumanoid`) and `castsFromHold` turns off runtimeUnit's caster arm spread. A drawing bowman leaves the stance (`_animateBowDrawRelease`): gap 3. Ranged units in closeup_state_reads are mostly Attacking at 2200ms, not Idle. No still shows a cast mid-drive.
- Head: bodyBuilder `blockHead` maps 5 cylinder rings through HEAD_RINGS; HEAD_SQUAT scales height (hat anchor and eyes follow). Eye whites and pupils exist but are `setEnabled(false)`.
- Torso: `wedgeTorso` plus `shoulderYoke` (box hull up to the yoke, slope to the neck); leave `shoulderOffX` alone, the helm rim is cut from it. Do not fatten forearms or legs. Never raise idle lean or the free-foot 0.08; no walk torso yaw.
- Wall: `_buildBracePose`, `_squareShield`, `_carrySpear` (dip only, never yaw). Shafts: projectileSystem `_leaveAsLitter`. Shadows pass, leave them.
