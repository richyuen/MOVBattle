# Loop state
Iteration: 187   Last re-audit: 185   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 1] BLOCKERS: 1 the pushing rank leans in one shared pose and leg stance (per-man drive leg, lean, head) — ours shield_wall_2650ms; 2 levelled wall spears are held, not thrust, and pass through their own front men (186: a stroke now shows; the pass-through half stands) — ours shield_wall_2500ms; 3 aimed men stand to attention: shooting archers square up, bolt holders' off arm hangs idle, Zeus half squats — ours closeup_state_reads. Ref trailer_3_sheet_01 r3c1, tabs_screenshot_06.
unit-look: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 2] BLOCKERS: 1 the trunk's top is a flat plate from arm root to arm root with the neck on a small collar stub, and the trunk is a slab about 2.5 heads wide (187: the widest line is now the top edge; the shelf runs the whole shoulder line) — ours closeup_state_reads, closeup_pair_zeus_thor; 2 forearm as thick as the upper arm (one taper from sleeve head to a thin wrist); 3 bare neck thin (187: "long" is gone, the collar takes its lower part). Ref tabs_screenshot_04.
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d FAIL (3/4)
- d FAIL [S since list: 0] BLOCKERS: 1 the ghost is a 3 x 8 px pale sliver at placement zoom, a third the footprint of a placed man and washed toward the ground colour, found only by diffing (TABS: a saturated team-colour block as large as a placed unit) — ours big_melee_placement_ghost. Ref gameplay_sheet_02 r1c3.
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 21/24

## Focus (every gap this iteration)
BASE 173d67f
- evidence (4fd0dfb): big_melee_placement_ghost — the no-evidence blocker of ui-flow.d struck
- [S] ui-flow.d ghost-preview (8f5254b) — APPROVE, criterion still FAIL
- [S] unit-look.c trunk-widest-below-the-arms (bfe3725) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] ui-flow.d ghost-preview (8f5254b) VERDICT: APPROVE CRITERION: ui-flow.d FAIL (previous: FAIL)
- GAP: [S] unit-look.c trunk-widest-below-the-arms (bfe3725) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] ui-flow.d ghost-unreadable [0] — blocker 1: a flat team-colour footprint tile under the ghost, sized from `collisionRadius`, opaque and unlit, dimmed where blocked — ref gameplay_sheet_02 r1c3 — ours big_melee_placement_ghost
2. [S] unit-look.c flat-shoulder-plate [0] — blocker 1: a trapezius plane from the collar foot down to each joint (joint line stays widest), shoulder span sized from head width (about 1.7 heads), not the max of chest and pelvis — ref tabs_screenshot_04 — ours closeup_state_reads
3. [S] battle-feel.c pushing-rank-one-pose [0] — blocker 1: per-man drive leg, lean and head in the shove pose — ref tabs_screenshot_06 — ours shield_wall_2650ms
4. [S] unit-look.c forearm-thick-as-upper-arm [0] — blocker 2: one taper from sleeve head to a thin wrist — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
5. [S] battle-feel.c wall-spears-pass-through-front-men [0] — blocker 2: rear-rank shafts given a lane over or between the front men's shoulders (position only, no yaw), pitch fixed through the stroke — ref tabs_screenshot_06 — ours shield_wall_2500ms
6. [S] battle-feel.c aimed-men-stand-to-attention [0] — blocker 3: archer draw stance, bolt holder's off arm, Zeus's half squat — ref trailer_3_sheet_01 r3c1 — ours closeup_state_reads
7. [S] unit-look.c neck-thin [0] — blocker 3: neck post about half a head wide, meeting the collar — ref tabs_screenshot_04 — ours closeup_state_reads
8. [P] ui-flow.d GHOST_ALPHA 0.55 -> 0.85 [0] — fallout of 187 ghost-preview — shows in big_melee_placement_ghost
Critic notes: the ghost throws a solid shadow (spawn registers it as a caster); the hover path and the blocked state are not in evidence; closeup_pair_zeus_thor showed Zeus side-on this run.

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; the Zeus in the shot rolled the untouched overhead branch, nothing visible. Needs the [S] (gap 6)
- shade-density [attempts: 1, lawn shade row spent for [P]] — weight 0.6/0.5/0.4 + lift: shadow contrast fell from 28% to 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still
- plank-corpses [attempts: 2, 1 approved 164] — 163: flank landing + sagittal curl lay flat in the ground plane
- dust-ring-grey [attempts: 1, spent] — stone tan still rendered neutral grey; colour is not the cause

## Notes for next iteration (max 5 lines)
- Last [S] pair was ui-flow.d + unit-look.c: 188 may not pick that pair, so gap 1 (ui-flow.d) goes with gap 3 (battle-feel.c), plus [P] gap 8. Commit per gap with `git commit <paths> -F <msgfile>`; run budget.mjs after each edit.
- Ghost: main.ts `showPlacementGhost(point)` / `previewPlacementAt(x, y)` / `clearPlacementGhost`, a `unitFactory.spawn` body with mesh.visibility, cleared in `tick`; capture hook `window.game.previewPlacementAtGround(x, z)`.
- Torso: `shoulderYoke(n, jointX, jointY, pelvisW, pelvisD, beltY)`: hull frustum from the pelvis top face to the joint line (yokeW = max of chest, pelvis, joint span + YOKE_REACH), then a `collar` frustum to `collarWidth` (neck post x COLLAR_OF_NECK); `wedgeTorso` draws in to the same collar. Leave `shoulderOffX` alone, the helm rim is cut from it; hangSkirt sizes from the pelvis box; tabards clone torsoMesh.
- Spear: `_carrySpear` aims the shaft from the fist; `_thrustStroke` slides it (SPEAR_*), `_spearRestAim` chokes up toward the enemy front. Poses: `_buildCarry().ready`, branches hash from `_wobblePhase` (change every branch or aim it); shove stance in `_buildShovePose`/`_buildBracePose`. Capture probe: war_machines shots fly 0-0.85 s and 3.1-3.8 s.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on YOKE_*, COLLAR_*, hull, pelvis, bow ready, spear carry/thrust, laurel, sunk crouch, FOREARM/CALF_SWELL, helm crown, lawn shade, carry bob.
