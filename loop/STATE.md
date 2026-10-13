# Loop state
Iteration: 180   Last re-audit: 180   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: the lineup stands bolt upright, arms plumb and mirrored; every braced man's legs make the same crouch zigzag; some wall spears point over the enemy's heads
unit-look: a PASS b PASS c FAIL d FAIL (2/4) — c: the arm is a detached pillar under a swollen cap with an armpit gap, forearm as thick as the upper arm, pelvis a separate box, head a tall square-jawed box; d: pinprick eyes, faces blank at battle distance
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b FAIL c PASS d PASS (3/4) — b: the burst is translucent orange jelly lobes with black spike artefacts; the ball shows only at 3800ms and reads navy
Total 20/24. Weak passes (re-audit): battle-feel.a overlap seen side-on only; battle-feel.b rests on the cannon pair; camera.c and ui-flow.d have no still.

## Focus (every gap this iteration)
BASE 79e688f
- [S] vfx.a nothing-sticks (c182916) — APPROVE, criterion PASS
- [S] unit-look.c pinched-link-limbs (fec6fb2) — APPROVE, criterion still FAIL
- [P] battle-feel.c spears-one-parallel-bundle (df2510a) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] nothing-sticks (c182916) VERDICT: APPROVE CRITERION: vfx.a PASS (previous: FAIL)
- GAP: [S] pinched-link-limbs (fec6fb2) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [P] spears-one-parallel-bundle (df2510a) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] battle-feel.c lineup-stands-to-attention [0] — idle stance archetypes in _buildIdlePose: weight on one leg with knees bent, weapon arm cocked across the body, other arm loose, torso slouch — ref tabs_screenshot_04 — ours lineup_medieval
2. [S] unit-look.c arm-is-a-detached-pillar [0] — shoulder yoke in bodyBuilder: the torso top extends over the arm root so the arm starts inside the chest silhouette, no armpit gap or swollen cap — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
3. [S] unit-look.c tall-box-head [0] — head mesh as a short wedge, wider at the brow, narrowing to the chin, about 0.8 of the present height — ref trailer_3_sheet_01 r3c1 — ours closeup_state_reads
4. [S] unit-look.d pinprick-eyes [0] — eye as a white ball with a black pupil, about 0.2 of head width, proud of the face — ref tabs_screenshot_04 — ours lineup_medieval
5. [S] vfx.b jelly-burst [0] — one opaque unlit white-yellow fireball mesh that swells and breaks into smoke, in place of the translucent shells; ball reads navy — ref trailer_3_sheet_03 r1c1 — ours war_machines_1100ms
6. [S] battle-feel.c braced-legs-one-zigzag [0] — per-man leg stance archetypes in _buildBracePose (lunge, upright, squat); spear dip aimed at the nearest enemy's chest — ref tabs_screenshot_06 — ours shield_wall_2500ms
7. [S] vfx.a shafts-in-one-hip-bundle [0] — _leaveAsLitter keeps the true impact point with no chest fallback, one shaft per part before reuse — ref tabs_screenshot_01 — ours big_melee_9s
No [P] ranked: every candidate constant sits on a spent row or a row approved in 178-180.

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
- LEDGER.md sits near its byte cap: trim prose before adding, run budget.mjs after each edit; update it (pending) before the critic runs, commit it with the docs. Sources are LF: patch with a node script in the scratchpad (each find asserted once) or sed by line; commit per gap with `git commit <paths> -F -`. No [P] on spearDip, FOREARM/CALF_SWELL, helm crown, lawn shade, carry bob.
- Limbs: `tapered(..., jointEnd, stubMat, headDiameter, bellyDiameter)`; elbow/knee width comes from `throughHinge` (line from limb top to belly). Critic now finds forearms and legs heavy: do not fatten further. Sleeve head cap (SLEEVE_HEAD*) is the shoulder notch; eye whites and pupils exist in bodyBuilder but are `setEnabled(false)`.
- Shafts: projectileSystem `_leaveAsLitter` ray-tests the struck body's meshes along the flight line (fallback ray bent to the torso), parents the shaft to the struck part's joint; mark already dead: planted steep in the turf. Litter capped at 60.
- Wall: `_buildBracePose` (hash 101-117) feeds the shove overlay, `_squareShield` and `_carrySpear` (dip only, never yaw: spears must not cross in plan). Idle: `_buildIdlePose`; do not grow the free-foot 0.08 offset. Never add walk torso yaw.
- Shadows: mapBuilder `LawnShadePlugin` (3-band filter) and `RootShadowPlugin`; maps-light.b now passes, leave it.
