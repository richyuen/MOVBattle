# Loop state
Iteration: 184   Last re-audit: 180   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: the pushing rank leans in one shared pose and leg stance; levelled wall spears are held, not thrust, and pass through their own front men; shooting archers square up; bolt holders' off arm hangs wide or idle, Zeus half squats
unit-look: a PASS b PASS c FAIL d FAIL (2/4) — c: the torso is a barrel three heads wide, widest mid-chest, with a plateau at the neck base and hull corners below the belt; forearm as thick as the upper arm; bare neck long and thin; d: pinprick eyes, faces blank at battle distance
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b FAIL c PASS d PASS (3/4) — b: the burst is translucent orange jelly lobes with black shards; the ball shows only at 3800ms and reads navy
Total 20/24. Weak passes (re-audit): battle-feel.a overlap seen side-on only; battle-feel.b rests on the cannon pair; camera.c and ui-flow.d have no still.

## Focus (every gap this iteration)
BASE 583c7ba
- [S] unit-look.c torso-top-is-a-plate-with-eaves (15bc8ad) — APPROVE, criterion still FAIL
- [S] battle-feel.c wall-spears-pitch-over-heads (158371a) — APPROVE, criterion still FAIL
- [P] unit-look.c HEAD_RINGS chin 0.72, cheek 0.9 (e98f429) — APPROVE, criterion still FAIL
- [P] battle-feel.c bolt hold off arm (5c6e707) — REJECT, reverted (f214c28)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] unit-look.c torso-top-is-a-plate-with-eaves (15bc8ad) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [S] battle-feel.c wall-spears-pitch-over-heads (158371a) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [P] unit-look.c HEAD_RINGS chin 0.5 -> 0.72, cheek 0.8 -> 0.9 (e98f429) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [P] battle-feel.c bolt hold off arm (5c6e707) VERDICT: REJECT CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] battle-feel.c pushing-rank-one-lean [0] — per-man shove stance (alternating drive leg, differing lean and head) — ref tabs_screenshot_06 — ours shield_wall_2650ms
2. [S] unit-look.d faces-blank-pinprick-eyes [0] — white eye disc with black pupil, about a quarter of the face wide — ref tabs_screenshot_04 — ours lineup_medieval
3. [S] unit-look.c torso-is-a-three-head-barrel [0] — hull sized from pelvis and head width (cap near two heads), arm root set in the slope — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
4. [S] battle-feel.c bolt-off-arm-idle [0] — off arm aimed at the target in every bolt branch, as levelSpearAt aims the spear — ref trailer_3_sheet_01 r3c1 — ours closeup_state_reads
5. [S] vfx.b burst-is-translucent-jelly-no-ball [0] — opaque faceted fireball solids and a ball mesh with a streak that survives to impact — ref trailer_3_sheet_02 r2c1 — ours war_machines_1100ms
6. [S] battle-feel.c wall-spears-held-not-thrust [0] — thrust cycle along the aimed shaft (phase hashed), shaft offset past the front man's head — ref trailer_3_sheet_01 r3c1 — ours shield_wall_2500ms
7. [S] unit-look.c forearm-thick-as-upper-arm [0] — one continuous taper from sleeve head to a thin wrist — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
8. [P] unit-look.c NECK_LENGTH 0.07 -> 0.04 [0] — fallout of 183 head-is-a-tall-square-box — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; the Zeus in the shot rolled the untouched overhead branch, nothing visible. Needs the [S] (gap 4)
- shade-density [attempts: 1, lawn shade row spent for [P]] — weight 0.6/0.5/0.4 + lift: shadow contrast fell from 28% to 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still
- plank-corpses [attempts: 2, 1 approved 164] — 163: flank landing + sagittal curl lay flat in the ground plane
- dust-ring-grey [attempts: 1, spent] — stone tan still rendered neutral grey; colour is not the cause

## Notes for next iteration (max 5 lines)
- LEDGER.md sits at its byte cap (9991): trim prose before adding, run budget.mjs after each edit; commit per gap with `git commit <paths> -F <msgfile>`. No [P] on YOKE_*/HULL_*, bow ready, spear carry, sunk crouch, FOREARM/CALF_SWELL, helm crown, lawn shade, carry bob.
- Spear: sim calls `unit.levelSpearAt(enemy.position)` for slotted wall men within reach + `spearLevelReach`; `_carrySpear` aims the shaft from the fist at the enemy's chest (`_spearLevel`, yaw stays the root's). Thrust and a sideways shaft offset are gap 6; the jab lives in the brace block's spear arm.
- Poses: `_buildCarry().ready` (bow, or `cast: true` staff/bolt hold); pose branches hash from `_wobblePhase`, random per unit, so a pose [P] may not show in a still: change every branch or aim it. `_animateCast`; shove stance in `_buildShovePose`/`_buildBracePose`.
- Torso: `wedgeTorso` plus `shoulderYoke` (hull to a line YOKE_DROP under the joints, gable to the neck; yokeW comes from arm-root reach, the barrel's cause); leave `shoulderOffX` alone, the helm rim is cut from it. Head: `blockHead` HEAD_RINGS; eye whites and pupils exist but are `setEnabled(false)`.
- Shafts: projectileSystem `_leaveAsLitter`. Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw.
