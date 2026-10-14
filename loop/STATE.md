# Loop state
Iteration: 192   Last re-audit: 190   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 0] BLOCKERS: 2 wall spears pass through their own men: the front men's dipped spears send their butts up through the rear rank's heads — ours shield_wall_2500ms, shield_wall_2650ms; 4 wall shafts cross one another in X's above the helmets (raised rears at 43-80 degrees against dipped fronts; TABS: six raised shafts, none crossing) — ours shield_wall_side; 5 a front man's dipped spear overruns its mark: points end one to two ranks inside the enemy wall and come out through a board and belly — ours shield_wall_side, shield_wall_2500ms. Blockers 1 (one trunk pitch) and 3 (archers square up) struck by the 192 [R]; plateau cleared. Ref tabs_screenshot_06, trailer_3_sheet_01 r3c1.
unit-look: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 4] plateau BLOCKERS: 3 bare neck thin (the head sits on a stepped stub on the trapezius; TABS has a short thick bare neck) — ours closeup_pair_zeus_thor. Blockers 1 and 2 struck (189, 191). Ref tabs_screenshot_04.
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 22/24

## Focus (every gap this iteration)
BASE e419382
- evidence (0c2ee7d): shield_wall_side, closeup_archer_loose
- [R] battle-feel.c shield press, wall spears and the bowman's hold (8e9a94f) — APPROVE, criterion still FAIL (2 blockers struck, 2 added), plateau cleared

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [R] battle-feel.c shield press, wall spears and the bowman's hold (8e9a94f) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.c spear-overruns-its-mark [0] — blocker 5: reach stop in _carrySpear, the lunge clamped to the enemy's near face so a point ends in the board — ref trailer_3_sheet_01 r3c1 — ours shield_wall_side
2. [S] battle-feel.c front-butts-through-rear-helmets [0] — blocker 2: front men hold the spear raised like the rear rank between strokes and dip only inside the stroke, so no butt lies back across the rear heads — ref tabs_screenshot_06 — ours shield_wall_2500ms
3. [S] battle-feel.c wall-shafts-cross [0] — blocker 4: pitch assigned by file/slot within the rank (ordered, near-parallel, small per-man offset) instead of a free hash — ref tabs_screenshot_06 — ours shield_wall_side
4. [S] battle-feel.c rear-strike-has-no-lane [0] — blocker 4: the rear man's stroke comes down over the gap between the two boards ahead (lateral place for the stroke only) — ref tabs_screenshot_06 — ours shield_wall_2650ms
5. [P] battle-feel.c SPEAR_REAR_UP_MIN 0.75 -> 1.05 [0] — blocker 4, fallout of the 192 [R] — shows in shield_wall_side
6. [R] unit-look.c bare-neck [0] — blocker 3: rebuild the head/neck/trapezius junction in bodyBuilder.ts (one short thick neck solid, no stepped stub) from a spec read off tabs_screenshot_04 — ours closeup_pair_zeus_thor
Critic notes: closeup_archer_loose bowmen share one pose, stave canted about 40 degrees, string undrawn, no arrow nocked; shield_wall_side shows both red men down on one knee with the shin flat (for the next re-audit); big_melee_9s shows no bowman mid-shot.

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- wall-spears-thread-helmets [attempts: 1, [S]] — 190: lane from the two heads ahead + height from own crown: no visible step (mechanism replaced by the 192 [R])
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; nothing visible (cleared by the 191 [S])
- shade-density [attempts: 1, lawn shade row spent for [P]] — weight 0.6/0.5/0.4 + lift: shadow contrast fell from 28% to 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still
- plank-corpses [attempts: 2, 1 approved 164] — 163: flank landing + sagittal curl lay flat in the ground plane

## Notes for next iteration (max 5 lines)
- 193 picks: last structural pick was battle-feel.c alone, so take [S] gap 1 or 2 (battle-feel.c) plus the [R] on unit-look.c (gap 6; it takes the second structural slot) and the [P] gap 5. Commit per gap with `git commit <paths> -F <msgfile>`; write commit messages and patch scripts with the Write tool (a heredoc with a long body failed once). The full capture now takes over 10 minutes: run it in the background and wait for the notice.
- Scratch check that paid off in 192: `scratchpad/look.mjs`-style render of a gallery scenario to a PNG outside output/loop, read once before committing, to confirm the mechanism does what was intended (190 was rejected for no visible step). Gallery scenarios take a `cameraOverride` (scenarios.ts `makeGalleryScenario`).
- Spear (rebuilt): `_carrySpear` pitch per man from `_buildBracePose` (`spearUp` rear, `spearDown` front, `spearGrip` front balance grip via `toBalance`), blend `_spearRearHold`, stroke `_thrustStroke` x SPEAR_LUNGE along the shaft; no reach stop any more (`_spearAim`, `_spearAimRadius` and the fist-to-front distance are still computed for `_spearNear`). Front butts rise behind the fist through the rear rank.
- Brace: trunk pitch `br.pitch` is set (not added) under the shove, head by `headLevel` + `tuck`, board follows twist and pitch (`_squareShield`). Bow: `_bowUp` keeps the stave upright via `_carryProp` `shooting`; stave is in the right hand. Neck: `neckMesh` cylinder (0.5-0.62 head wide, NECK_LENGTH 0.07) under `blockHead`; trapezius frustum in `shoulderYoke` rises COLLAR_RISE 0.85 up it to `collarWidth`.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, COLLAR_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob.
