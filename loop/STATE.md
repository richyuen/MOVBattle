# Loop state
Iteration: 190   Last re-audit: 190   Consecutive rejects: 1   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 3] BLOCKERS: 1 the pushing rank leans in one shared trunk pitch (drive legs differ per man; the red trunks are all upright at one pitch, helmets at one tilt, no shoulder turn reads) — ours shield_wall_2650ms; 2 levelled wall spears pass through their own men (rear shafts ride at crown height; three or four still cross or thread helmets in both frames of the pair) — ours shield_wall_2650ms; 3 aimed men stand to attention: shooting archers square up, bolt holders' off arm hangs idle, Zeus half squats — ours closeup_state_reads. Ref trailer_3_sheet_01 r3c1, tabs_screenshot_06.
unit-look: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 3] BLOCKERS: 2 forearm as thick as the upper arm (one taper from sleeve head to a thin wrist); 3 bare neck thin (the head sits on a stepped stub on the trapezius; TABS has a short thick bare neck). Ref tabs_screenshot_04.
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 22/24 (190 re-audit: no verdict changed, lists kept, counts not reset; one more approved [S] without a flip marks either criterion `plateau`)

## Focus (every gap this iteration)
BASE c66fd50
- [S] battle-feel.c wall-spears-thread-helmets (662dc02) — REJECT, reverted (78ac46c)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] battle-feel.c wall-spears-thread-helmets (662dc02) VERDICT: REJECT CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.c aimed-men-stand-to-attention [0] — blocker 3: shooting stance state (archer side-on with a rear-leg brace and bow-arm lean, bolt holder's off arm thrown out as a counterweight, Zeus upright on a stride, not a half squat) — ref trailer_3_sheet_01 r3c1 — ours closeup_state_reads
2. [S] unit-look.c forearm-as-thick-as-upper-arm [0] — blocker 2: one continuous taper from the sleeve head to a thin wrist, replacing the forearm belly on arms — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
3. [S] battle-feel.c pushing-rank-one-trunk-pitch [0] — blocker 1: per-man trunk pitch and shoulder turn into the board in the brace pose, helmet tilt following the trunk — ref tabs_screenshot_06 — ours shield_wall_2650ms
4. [S] unit-look.c bare-neck-thin-stub [0] — blocker 3: short thick bare neck column carrying the head, replacing the stepped stub — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
5. [S] battle-feel.c wall-spears-overhand-clearance [1] — blocker 2: overhand rear carry: the sim hands the rear man the tallest crown in his lane as well as the gap, the fist goes above his own helmet, the shaft is pitched down from there to clear that crown — ref trailer_3_sheet_01 r3c1 — ours shield_wall_2650ms
Evidence the critic asked for (not owed as blockers): a close side-on shot of an archer at release and a caster mid-cast; a three-quarter front view of the pushing rank. No camera hook is exposed on `window.game`, so these need one added. Capture notes "scene not ready after 30 s" on many shots; no missing meshes seen.

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- wall-spears-thread-helmets [attempts: 1, [S]] — 190: lane from the two heads ahead + height from own crown: no visible step, butts still trail out of rear helmets, the shaft dips back to helmet height by the front rank, a 0.45 m clamp from the fist cannot reach the gap, the raised arm is unseen
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; the Zeus in the shot rolled the untouched overhead branch, nothing visible. Needs the [S] (gap 1)
- shade-density [attempts: 1, lawn shade row spent for [P]] — weight 0.6/0.5/0.4 + lift: shadow contrast fell from 28% to 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still
- plank-corpses [attempts: 2, 1 approved 164] — 163: flank landing + sagittal curl lay flat in the ground plane

## Notes for next iteration (max 5 lines)
- 190 had one [S] only (pair rule: battle-feel.c + unit-look.c was 189's pair and they are the only failing criteria). 190's "pair" is battle-feel.c alone, so 191 may take gap 1 (battle-feel.c) + gap 2 (unit-look.c). Two more reject-only iterations write STOP. Commit per gap with `git commit <paths> -F <msgfile>`; run budget.mjs after each edit.
- Aim poses: `_buildCarry().ready` (bow, or `cast: true` staff/bolt hold), `_animateCast`; branches hash from `_wobblePhase`, random per unit, so change every branch or aim it. The stills show no archer at full draw; consider an evidence shot first (needs a camera hook in main.ts).
- Brace: `_buildBracePose` (stand pitch/crouch/raise, lead/lunge/twist/tuck, thrustRate), applied under `hold` in update; the critic reads all trunks as upright. Spear: `_carrySpear` (pitch from the neck), `_thrustStroke`, rear `_spearLane` over the man's own middle line with SPEAR_REAR_LIFT 0.12; the shaft's place is offset from the fist in hand space.
- Arms: `tapered(...)` builds each segment; forearm belly via the last argument `lowerArmTop * FOREARM_SWELL` and `throughHinge` elbow width. Torso: `shoulderYoke(n, jointX, jointY, crownH, pelvisW, pelvisD, beltY)`; neck post `neckMesh` (0.5-0.62 head wide), collar to COLLAR_RISE 0.85 up the neck. Leave `shoulderOffX` alone.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, COLLAR_*, hull, pelvis, ghost, bow ready, spear carry/thrust/lane, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob.
