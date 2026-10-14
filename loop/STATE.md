# Loop state
Iteration: 186   Last re-audit: 185   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 1] BLOCKERS: 1 the pushing rank leans in one shared pose and leg stance (per-man drive leg, lean, head) — ours shield_wall_2650ms; 2 levelled wall spears are held, not thrust, and pass through their own front men (186: a stroke now shows; the pass-through half stands) — ours shield_wall_2500ms; 3 aimed men stand to attention: shooting archers square up, bolt holders' off arm hangs idle, Zeus half squats — ours closeup_state_reads. Ref trailer_3_sheet_01 r3c1, tabs_screenshot_06.
unit-look: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 1] BLOCKERS: 1 the torso is a three-head barrel, widest mid-chest, plateau at the neck base and hull corners below the belt (186: the corners and the three-head height are gone; widest mid-chest and the neck-base shelf stand) — ours closeup_pair_zeus_thor; 2 forearm as thick as the upper arm (one taper from sleeve head to a thin wrist); 3 bare neck long and thin. Ref tabs_screenshot_04.
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d FAIL (3/4)
- d FAIL [S since list: 0] BLOCKERS: 1 no evidence: add a placement shot with a ghost preview under the cursor (`loop(N.0): evidence`). Ref gameplay_sheet_02 r1c3.
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 21/24

## Focus (every gap this iteration)
BASE 8c0e135
- [S] unit-look.c torso-is-a-barrel (77eea46) — APPROVE, criterion still FAIL
- [S] battle-feel.c wall-spears-held-not-thrust (a5730f8) — APPROVE, criterion still FAIL
- [P] unit-look.d laurel-covers-eyes (16daa21) — APPROVE, criterion PASS

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] unit-look.c torso-is-a-barrel (77eea46) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [S] battle-feel.c wall-spears-held-not-thrust (a5730f8) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [P] unit-look.d laurel-covers-eyes (16daa21) VERDICT: APPROVE CRITERION: unit-look.d PASS (previous: PASS)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] unit-look.c trunk-widest-below-the-arms [0] — blocker 1: one trapezoid with the arm roots at its top corners (gable cut to a short collar bevel), width from head width (about 2.2 heads at the top, belt about 0.75 of that) — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
2. [S] battle-feel.c rear-spears-through-front-men [0] — blocker 2: per-man shaft lane (sideways and up into the gap between the two helmets ahead, position only, no yaw), pitch held fixed through the stroke — ref trailer_3_sheet_01 r3c1, tabs_screenshot_06 — ours shield_wall_2500ms
3. [S] battle-feel.c pushing-rank-one-stance [0] — blocker 1: per-man drive leg, lean angle and head set in the shove pose — ref trailer_3_sheet_01 r1c1 — ours shield_wall_2650ms
4. [S] unit-look.c forearm-as-thick-as-upper-arm [0] — blocker 2: one continuous taper from sleeve head to a thin wrist replacing the forearm belly — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
5. [S] unit-look.c neck-is-a-thin-post [0] — blocker 3: short thick neck frustum merged into the collar, no shelf — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
6. [S] battle-feel.c aimed-men-stand-to-attention [0] — blocker 3: side-on shooting stance for archers, working off arm for bolt holders, Zeus upright — ref trailer_3_sheet_01 r1c1, r3c1 — ours closeup_state_reads
7. [S] ui-flow.d ghost-preview [0] — blocker 1: a cursor ghost for the selected tray unit, then a placement shot with it — ref gameplay_sheet_02 r1c3 — ours hud_placement
No [P] ranked (hull, pelvis, spear thrust and laurel rows were just approved). Evidence the critic asked for: a front three-quarter shield_wall shot so spear points and arms can be judged.

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
- Last [S] pair was unit-look.c + battle-feel.c: 187 may not pick that pair again, so take gap 1 or 2 with gap 7 (ui-flow.d). main.ts has no ghost or preview code at all, so gap 7 builds the cursor ghost and its capture shot. Commit per gap with `git commit <paths> -F <msgfile>`; run budget.mjs after each edit.
- Torso: `shoulderYoke(n, jointX, jointY, pelvisW, pelvisD, beltY)`: hull frustum from the pelvis top face up to yokeY (YOKE_DROP under the joints, yokeW from arm-root reach), then the gable `slope` to the neck. The critic reads the yoke line as the widest line sitting below the arm roots, and pelvisW's 0.8-of-shoulders floor as a crate. Leave `shoulderOffX` alone, the helm rim is cut from it; hangSkirt sizes from the pelvis box.
- Spear: `_carrySpear` aims the shaft from the fist; `_thrustStroke` slides it through the fist (SPEAR_*), `_spearRestAim` chokes up toward the enemy front (radius passed by the sim); brace block's spear arm follows `_spearThrust`. Choking up sends butts back over the rear rank and the bundle fans.
- Poses: `_buildCarry().ready`, branches hash from `_wobblePhase` (random per unit: change every branch or aim it); shove stance in `_buildShovePose`/`_buildBracePose`. Eyes: `buildEye` (EYE_*). Cannon shot: shape `cannonball`, still the stone's lob. Capture probe: war_machines shots fly 0-0.85 s and 3.1-3.8 s.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on YOKE_*, hull, pelvis, bow ready, spear carry/thrust, laurel, sunk crouch, FOREARM/CALF_SWELL, helm crown, lawn shade, carry bob.
