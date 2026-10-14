# Loop state
Iteration: 195   Last re-audit: 195   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 2] BLOCKERS: 4 wall shafts cross one another above the helmets: every spear is now raised, but they lean both ways in yaw and roll and make a tepee of crossing shafts over the red line (TABS: six raised shafts, parallel, none crossing) — ours shield_wall_side, shield_wall_2500ms; 5 a spear aimed at a rear man still passes the front man and ends on the second-rank board (a dark shaft runs level into the rear red board) — ours shield_wall_side. Blocker 2 (front butts through the rear rank's heads) struck at 195. Ref tabs_screenshot_06, trailer_3_sheet_01 r3c1.
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (e-h, see CRITIC.md): unscored for every dimension — 196 must re-audit and write blockers for each FAIL; a dimension's tier 2 is pickable only once its a-d all pass (battle-feel: not yet).
Total tier 1 23/24 (195 re-audit: no verdict changed); tier 2 0/24 unscored.

## Focus (every gap this iteration)
BASE bda7c10
- [S] battle-feel.c couched-butt-grip (88979fc) — APPROVE, criterion still FAIL (blocker 2 struck)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] battle-feel.c couched-butt-grip (88979fc) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.c formation-locked-spear-yaw [0] — blocker 4: the raised carry's yaw comes from the line's shared facing (not each man's root yaw or aim) and roll is zeroed, so shafts stand parallel and do not cross — ref tabs_screenshot_06 — ours shield_wall_side
2. [S] battle-feel.c file-slot-spear-lane [0] — blocker 4: each raised shaft is held to its own file's lateral lane (fist moved to the shoulder line of his file slot), so neighbouring shafts are kept apart — ref trailer_3_sheet_01 r3c1 — ours shield_wall_2500ms
3. [S] battle-feel.c rear-strike-over-own-file [0] — blocker 5: a rear man's strike target is limited to the enemy directly ahead of his own front man, falling only through the gap above that front man's shoulder — ref trailer_3_sheet_01 r3c1 — ours shield_wall_side
4. [S] battle-feel.c strike-ends-on-first-board [0] — blocker 5: the rear strike's run along the shaft is cut at the first enemy shield board it meets, a geometric stop on board planes (not 194's body-stop) — ref tabs_screenshot_06 — ours shield_wall_side
5. [S] battle-feel.c toppled-man-drops-spear [0] — blocker 5: a wall man who topples or staggers lets his spear fall flat on the ground instead of holding a low carry — ref trailer_3_sheet_01 r3c1 — ours shield_wall_side
6. [S] battle-feel.c front-rank-short-forward-stab [0] — blocker 4: the front man's stroke tips forward from the couch to about 0.3 above level only inside the lunge, butt kept below the fist, so it connects without crossing the raised rear shafts — ref trailer_3_sheet_01 r3c1 — ours shield_wall_2650ms
No [P] ranked. Critic notes: the front man's stroke now ends above the enemy's head and no front spear visibly connects (digest: "spears thrust from behind shield lines"); the 193 reach stop was removed with the dipped hold.

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- spear-stops-on-the-first-body [attempts: 1, [S]] — 194: the sim measured the nearest enemy face along the slot heading at decision time; no shot changed. The measured line is not the drawn shaft
- wall-spears-thread-helmets [attempts: 1, [S]] — 190: lane from the two heads ahead + height from own crown: no visible step (mechanism replaced by the 192 [R])
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; nothing visible (cleared by the 191 [S])
- shade-density [attempts: 1, lawn shade row spent for [P]] — weight 0.6/0.5/0.4 + lift: shadow contrast fell from 28% to 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still

## Notes for next iteration (max 5 lines)
- After 195: particle VFX (trails, smoke, fire, dust, ambient magic) were absent from every capture since the first reset (a shared texture was disposed; fixed) and the capture spent 5 of 9 minutes waiting on it; it is about 4 minutes again, run it in the foreground. Tier-2 criteria exist: 196 re-audits them. Particle VFX appear in the shots for the first time at 196: a tier-1 vfx flip because of them uses `MISSED: particles`, not REGRESSED BY. Self-check with `capture.mjs --only <shot>` before committing (ITERATE step 4), judged against the blocker point by point, not at a glance. Commit per gap with `git commit <paths> -F <msgfile>`.
- Spear: `_carrySpear` raises front and rear alike to `br.spearUp` (1.05-1.4 above level, hashed per man) along `root.rotation.y`; rear strike falls to SPEAR_REAR_STRIKE inside the lunge; front men are couched at the waist (SPEAR_COUCH_*) with the grip near the butt (SPEAR_FRONT_GRIP_*, `toGrip`); stroke `run` = `_thrustStroke` x SPEAR_LUNGE along the shaft. Slots and the wall heading live in the sim (`_shieldSlots`, `slot.heading`).
- Brace: trunk pitch `br.pitch` set under the shove, head by `headLevel` + `tuck`, board follows (`_squareShield`). Bow: `_bowUp` keeps the stave upright via `_carryProp` `shooting`. Neck: one skin solid (NECK_*), trapezius ends on its foot.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, SPEAR_REAR_UP_*, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob.
