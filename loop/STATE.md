# Loop state
Iteration: 185   Last re-audit: 185   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 0] BLOCKERS: 1 the pushing rank leans in one shared pose and leg stance (per-man drive leg, lean, head) — ours shield_wall_2650ms; 2 levelled wall spears are held, not thrust, and pass through their own front men — ours shield_wall_2500ms; 3 aimed men stand to attention: shooting archers square up, bolt holders' off arm hangs idle, Zeus half squats — ours closeup_state_reads. Ref trailer_3_sheet_01 r3c1, tabs_screenshot_06.
unit-look: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 0] BLOCKERS: 1 the torso is a three-head barrel, widest mid-chest, plateau at the neck base and hull corners below the belt (hull sized from pelvis and head, cap near two heads) — ours closeup_pair_zeus_thor; 2 forearm as thick as the upper arm (one taper from sleeve head to a thin wrist); 3 bare neck long and thin. Ref tabs_screenshot_04.
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d FAIL (3/4)
- d FAIL [S since list: 0] BLOCKERS: 1 no evidence: add a placement shot with a ghost preview under the cursor (`loop(N.0): evidence`). Ref gameplay_sheet_02 r1c3.
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 21/24 (185: unit-look.d and vfx.b flipped by their gaps, camera.c by the evidence shot big_melee_500ms).

## Focus (every gap this iteration)
BASE 5f51ad1
- evidence (b6a189d): war_machines_400ms/550ms in-flight pair, big_melee_500ms mid-swoop — camera.c blocker cleared
- [S] unit-look.d faces-blank-at-distance (7061475) — APPROVE, criterion PASS
- [S] vfx.b no-ball-in-flight (300f655) — APPROVE, criterion PASS

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] unit-look.d faces-blank-at-distance (7061475) VERDICT: APPROVE CRITERION: unit-look.d PASS (previous: FAIL)
- GAP: [S] vfx.b no-ball-in-flight (300f655) VERDICT: APPROVE CRITERION: vfx.b PASS (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] unit-look.c torso-is-a-barrel [0] — blocker 1: hull sized from pelvis and head, capped near two heads, no neck-base plateau or hull corners — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
2. [S] battle-feel.c wall-spears-held-not-thrust [0] — blocker 2: thrust stroke for levelled spears, held outside the front man — ref tabs_screenshot_06 — ours shield_wall_2500ms
3. [S] battle-feel.c pushing-rank-one-pose [0] — blocker 1: per-man drive leg, lean and head in the shove pose — ref trailer_3_sheet_01 r3c1 — ours shield_wall_2650ms
4. [S] unit-look.c forearm-thick-as-upper-arm [0] — blocker 2: one taper from sleeve head to a thin wrist (replaces the FOREARM_SWELL belly) — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
5. [S] battle-feel.c aimed-men-stand-to-attention [0] — blocker 3: archer draw stance, bolt holder off arm, Zeus half squat — ref tabs_screenshot_06 — ours closeup_state_reads
6. [S] ui-flow.d ghost-preview [0] — blocker 1: placement shot with a ghost under the cursor — ref gameplay_sheet_02 r1c3 — ours hud_placement
7. [S] unit-look.c neck-long-and-thin [0] — blocker 3: shorter, thicker bare neck — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
8. [P] unit-look.d laurel-covers-eyes [0] — fallout of 185 faces-blank-at-distance: raise the laurel wreath clear of the eye line — shows in closeup_pair_zeus_thor
Evidence owed: ui-flow.d ghost-preview shot; vfx.b a low-camera in-flight frame of the second salvo (about 3.3 s).

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; the Zeus in the shot rolled the untouched overhead branch, nothing visible. Needs the [S] (gap 5)
- shade-density [attempts: 1, lawn shade row spent for [P]] — weight 0.6/0.5/0.4 + lift: shadow contrast fell from 28% to 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still
- plank-corpses [attempts: 2, 1 approved 164] — 163: flank landing + sagittal curl lay flat in the ground plane
- dust-ring-grey [attempts: 1, spent] — stone tan still rendered neutral grey; colour is not the cause

## Notes for next iteration (max 5 lines)
- Last [S] pair was unit-look.d + vfx.b, so unit-look.c + battle-feel.c is pickable again. Commit per gap with `git commit <paths> -F <msgfile>`; LEDGER value columns max 80 chars; run budget.mjs after each edit.
- ui-flow.d: main.ts has no ghost or preview code at all (grep), so the blocker needs an [S] that builds the cursor ghost before an evidence shot can exist. Capture probe: war_machines shots fly 0-0.85 s and 3.1-3.8 s.
- Spear: sim calls `unit.levelSpearAt(enemy.position)` for slotted wall men; `_carrySpear` aims the shaft from the fist at the enemy's chest; the jab lives in the brace block's spear arm. Poses: `_buildCarry().ready`, branches hash from `_wobblePhase` (random per unit: change every branch or aim it); shove stance in `_buildShovePose`/`_buildBracePose`.
- Torso: `wedgeTorso` plus `shoulderYoke` (yokeW comes from arm-root reach, the barrel's cause); leave `shoulderOffX` alone, the helm rim is cut from it. Eyes: `buildEye` in bodyBuilder (EYE_* constants), hidden by propBuilder under face-covering hats. Cannon shot: shape `cannonball` (sim `resolveProjectileShape`), still the stone's lob.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on YOKE_*/HULL_*, bow ready, spear carry, sunk crouch, FOREARM/CALF_SWELL, helm crown, lawn shade, carry bob.
