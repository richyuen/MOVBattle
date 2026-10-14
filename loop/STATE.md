# Loop state
Iteration: 188   Last re-audit: 185   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 2] BLOCKERS: 1 the pushing rank leans in one shared trunk pitch (188: the drive leg now differs per man; trunks all upright at one pitch, helmets at near one tilt, the shoulder turn does not read) — ours shield_wall_2650ms; 2 levelled wall spears pass through their own front men — ours shield_wall_2500ms; 3 aimed men stand to attention: shooting archers square up, bolt holders' off arm hangs idle, Zeus half squats — ours closeup_state_reads. Ref trailer_3_sheet_01 r3c1, tabs_screenshot_06.
unit-look: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 2] BLOCKERS: 1 the trunk's top is a flat plate from arm root to arm root with the neck on a small collar stub, and the trunk is a slab about 2.5 heads wide (187: the widest line is now the top edge; the shelf runs the whole shoulder line) — ours closeup_state_reads, closeup_pair_zeus_thor; 2 forearm as thick as the upper arm (one taper from sleeve head to a thin wrist); 3 bare neck thin (187: "long" is gone, the collar takes its lower part). Ref tabs_screenshot_04.
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 22/24 (188: ui-flow.d flipped by the ghost footprint slab)

## Focus (every gap this iteration)
BASE 39ec08e
- [S] ui-flow.d ghost-unreadable (fd1f4ea) — APPROVE, criterion PASS
- [S] battle-feel.c pushing-rank-one-pose (23f9741) — APPROVE, criterion still FAIL
- [P] ui-flow.d GHOST_ALPHA 0.55 -> 0.85 (d5e3729) — APPROVE, criterion PASS

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] ui-flow.d ghost-unreadable (fd1f4ea) VERDICT: APPROVE CRITERION: ui-flow.d PASS (previous: FAIL)
- GAP: [S] battle-feel.c pushing-rank-one-pose (23f9741) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [P] ui-flow.d GHOST_ALPHA 0.55 -> 0.85 (d5e3729) VERDICT: APPROVE CRITERION: ui-flow.d PASS (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.c wall-spears-through-own-men [0] — blocker 2: rear-rank shafts routed over the shoulder or helmet gap of the man ahead (clearance against the front man's head and board) — ref tabs_screenshot_06 — ours shield_wall_2500ms
2. [S] unit-look.c trunk-top-flat-plate [0] — blocker 1: shoulders sloped from the neck down to the arm roots (joint line stays widest), trunk narrowed under 2 heads — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
3. [S] battle-feel.c pushing-rank-one-trunk-pitch [0] — blocker 1: per-man forward trunk pitch into the board (hip back, shoulders over the lead knee), scaled by shove load, board angle following — ref tabs_screenshot_06 — ours shield_wall_2650ms
4. [S] battle-feel.c aimed-men-stand-to-attention [0] — blocker 3: aim stance with a staggered leg and the off arm braced or thrown out, Zeus off the symmetric half squat — ref trailer_3_sheet_01 r3c1 — ours closeup_state_reads
5. [S] unit-look.c forearm-as-thick-as-upper-arm [0] — blocker 2: one taper from sleeve head to a thin wrist — ref tabs_screenshot_04 — ours closeup_state_reads
6. [S] unit-look.c bare-neck-thin [0] — blocker 3: neck stub thickened into the collar line — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
No [P] ranked. Critic notes: rear-file boots sit above the grass in the shield_wall pair (unattributed); the refused-spot ghost dimming is in no shot.

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
- Only battle-feel.c and unit-look.c still fail; last [S] pair was ui-flow.d + battle-feel.c, so 189 takes gap 1 (battle-feel.c) + gap 2 (unit-look.c). 190 is a re-audit. Commit per gap with `git commit <paths> -F <msgfile>`; run budget.mjs after each edit.
- Brace: `_buildBracePose` (stand pitch/crouch/raise, lead/lunge/twist/tuck, thrustRate); the brace block in update applies it under `hold`; `br.pitch` is 0.2-0.34 / -0.08-0.04 / 0.08-0.2 by stand and the critic reads all trunks as upright. Shove pose for men without boards: `_buildShovePose`.
- Spear: `_carrySpear` aims the shaft from the fist; `_thrustStroke` slides it (SPEAR_*), `_spearRestAim` chokes up toward the enemy front. Poses: `_buildCarry().ready`, branches hash from `_wobblePhase` (change every branch or aim it).
- Torso: `shoulderYoke(n, jointX, jointY, pelvisW, pelvisD, beltY)`: hull frustum from the pelvis top face to the joint line (yokeW = max of chest, pelvis, joint span + YOKE_REACH), then a `collar` frustum to `collarWidth`; `wedgeTorso` draws in to the same collar. Leave `shoulderOffX` alone, the helm rim is cut from it; tabards clone torsoMesh. Ghost: main.ts `showPlacementGhost`.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on YOKE_*, COLLAR_*, hull, pelvis, ghost, bow ready, spear carry/thrust, laurel, sunk crouch, FOREARM/CALF_SWELL, helm crown, lawn shade, carry bob.
