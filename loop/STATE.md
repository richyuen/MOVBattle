# Loop state
Iteration: 181   Last re-audit: 180   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: aimed and ranged men still stand to attention, arms plumb and mirrored; the hip-shot stance leaves both legs straight posts; the sunk stance is a half squat with arms thrown wide; the pushing rank leans in one shared pose; some wall spears point over the enemy's heads
unit-look: a PASS b PASS c FAIL d FAIL (2/4) — c: the shoulder yoke is a broad flat shelf with an armpit gap below it, forearm as thick as the upper arm, pelvis a separate box, head a tall square-jawed box; d: pinprick eyes, faces blank at battle distance
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b FAIL c PASS d PASS (3/4) — b: the burst is translucent orange jelly lobes with black spike artefacts; the ball shows only at 3800ms and reads navy
Total 20/24. Weak passes (re-audit): battle-feel.a overlap seen side-on only; battle-feel.b rests on the cannon pair; camera.c and ui-flow.d have no still.

## Focus (every gap this iteration)
BASE b055692
- [S] battle-feel.c lineup-stands-to-attention (7f534e9) — APPROVE, criterion still FAIL
- [S] unit-look.c arm-is-a-detached-pillar (9a713e8) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] lineup-stands-to-attention (7f534e9) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [S] arm-is-a-detached-pillar (9a713e8) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] battle-feel.c aimed-men-stand-to-attention [0] — a ready stance for aimed units in `_animateIdleHumanoid`: weapon across the chest in two hands, staggered feet, turned torso — ref trailer_3_sheet_01 r3c1 — ours closeup_state_reads
2. [S] unit-look.c shoulder-shelf-armpit-gap [0] — torso and yoke as one hull, side planes from the yoke edge down to the waist (underarm gusset) — ref tabs_screenshot_04 — ours closeup_state_reads
3. [S] unit-look.c tall-box-head [0] — replace `blockHead` with a shorter soft-cornered block narrowing to a small chin — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
4. [S] unit-look.d pinprick-eyes [0] — eyes as raised white discs with a black pupil, sized to the head — ref tabs_screenshot_01 — ours big_melee_5s
5. [S] vfx.b jelly-burst [0] — opaque faceted fire shells; a black ball mesh with a white streak held in frame from muzzle to impact — ref trailer_3_sheet_02 r2c1 — ours war_machines_1100ms
6. [S] battle-feel.c push-rank-one-pose [0] — per-man push pose (lean, leg phase) and a spear aimed at the nearest enemy's chest — ref tabs_screenshot_06 — ours shield_wall_2500ms
7. [P] unit-look.c YOKE_REACH 0.42 -> 0.2 [0] — fallout of 181 arm-is-a-detached-pillar — ref trailer_3_sheet_01 r1c2 — ours closeup_state_reads
8. [P] battle-feel.c `_buildIdlePose` sunk crouch 0.45-0.80 -> 0.25-0.45 [0] — fallout of 181 lineup-stands-to-attention — ref tabs_screenshot_04 — ours lineup_medieval

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
- LEDGER.md sits at its byte cap: trim prose before adding, run budget.mjs after each edit. Sources are LF: patch with a node script written by the Write tool into the scratchpad (bash heredocs break on apostrophes; each find asserted once), commit per gap with `git commit <path> -F <msgfile>`. No [P] on spearDip, FOREARM/CALF_SWELL, helm crown, lawn shade, carry bob.
- Idle: `_buildIdlePose` picks hip-shot/sunk/at-ease (hash 121-126); the weapon arm takes `_buildCarry()`'s hold and `_carryProp` turns the weapon in Idle too; aimed units (`locomotionBias === "aimed"`) are left on the plumb hang, which is gap 1. `_idleSink` lowers the hip with `_braceSink`. Do not raise idle lean or the free-foot 0.08; never add walk torso yaw.
- Shoulders: bodyBuilder `shoulderYoke` (two box frustums on the torso joint, YOKE_*); leave `shoulderOffX` alone, the helm rim is cut from it. Limbs: `tapered(..., headDiameter, bellyDiameter)`, elbow/knee from `throughHinge`; do not fatten forearms or legs. Eye whites and pupils exist but are `setEnabled(false)`.
- Shafts: projectileSystem `_leaveAsLitter` ray-tests the struck body along the flight line and parents the shaft to that part's joint. Wall: `_buildBracePose` (hash 101-117) feeds the shove overlay, `_squareShield`, `_carrySpear` (dip only, never yaw).
- Shadows: mapBuilder `LawnShadePlugin` and `RootShadowPlugin`; maps-light.b passes, leave it.
