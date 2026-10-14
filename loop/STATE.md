# Loop state
Iteration: 194   Last re-audit: 190   Consecutive rejects: 1   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 1] BLOCKERS: 2 wall spears pass through their own men: the front men's dipped spears send their butts up through the rear rank's heads — ours shield_wall_2500ms, shield_wall_2650ms; 4 wall shafts cross one another in X's above the helmets (raised rears now 60-80 degrees against dipped fronts whose butts rise behind; TABS: six raised shafts, none crossing) — ours shield_wall_side, shield_wall_2500ms; 5 a front man's dipped spear overruns its mark: stopped on the board in shield_wall_2500ms/2650ms, but a spear aimed at a rear man still passes the front man and ends on the second-rank board, and one point shows low behind the front board — ours shield_wall_side. Ref tabs_screenshot_06, trailer_3_sheet_01 r3c1.
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 23/24

## Focus (every gap this iteration)
BASE 5e6cbbb
- [S] battle-feel.c spear-stops-on-the-first-body (a4e68c4) — REJECT, reverted (bd50379)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] battle-feel.c spear-stops-on-the-first-body (a4e68c4) VERDICT: REJECT CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.c spear-stops-on-the-drawn-shaft [0] — blocker 5: a per-frame ray along the rendered shaft (fist plus carry rotation) against enemy board meshes and body capsules; the point is clamped SPEAR_BITE into the nearest hit — ref tabs_screenshot_06 — ours shield_wall_side
2. [S] battle-feel.c front-butt-under-the-arm [0] — blocker 2: a dipped front man pitches the butt down behind his hip (underarm hold, butt below shoulder height) instead of letting it rise through the rear man's head — ref trailer_3_sheet_01 r3c1 — ours shield_wall_2500ms
3. [S] battle-feel.c raised-shafts-parallel [0] — blocker 4: rear-rank raised spears share one near-vertical pitch per wall and stay behind their own board line, so they cannot cross the dipped front shafts — ref tabs_screenshot_06 — ours shield_wall_side
4. [S] battle-feel.c own-rank-shaft-clearance [0] — blocker 2: the rear man's shaft line is tested against his own front man's head and board, and his hold rises or slides aside until it clears — ref tabs_screenshot_06 — ours shield_wall_2650ms
5. [S] battle-feel.c board-collider-stop [0] — blocker 5: shield meshes register as spear stops (pick against the board's bounding disc), so a spear aimed at a rear man ends on the front man's board — ref trailer_3_sheet_01 r3c1 — ours shield_wall_side
No [P] ranked.

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- spear-stops-on-the-first-body [attempts: 1, [S]] — 194: the sim measured the nearest enemy face along the slot heading at decision time and handed it over; no shot changed, a point still ends on the second-rank board. The measured line is not the drawn shaft: needs a per-frame ray from the fist along the carry (gap 1)
- wall-spears-thread-helmets [attempts: 1, [S]] — 190: lane from the two heads ahead + height from own crown: no visible step (mechanism replaced by the 192 [R])
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; nothing visible (cleared by the 191 [S])
- shade-density [attempts: 1, lawn shade row spent for [P]] — weight 0.6/0.5/0.4 + lift: shadow contrast fell from 28% to 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still

## Notes for next iteration (max 5 lines)
- 195 is a re-audit (showcase capture, critic rewrites Criteria and gaps) before picking. Only battle-feel.c fails, so one [S] per iteration; two more reject-only iterations write STOP. Commit per gap with `git commit <paths> -F <msgfile>`; write messages and patch scripts with the Write tool; run the full capture in the background (over 10 minutes).
- 194's lesson: a scratch render (`scratchpad/look.mjs gallery_shield_wall_side`) looked right to me and the critic still saw no change; judge the scratch render against the named blocker point by point (where exactly does each point end), not at a glance.
- Spear: `_carrySpear` pitch per man from `_buildBracePose` (`spearUp` rear 1.05-1.4, `spearDown` front 0.42-0.64, `spearGrip` balance grip via `toBalance`), blend `_spearRearHold`, stroke `run` = `_thrustStroke` x SPEAR_LUNGE, stopped at the aimed man's near face (SPEAR_BITE, SPEAR_GIVE). The shaft is drawn from the fist along `carry` (root yaw, pitch); a ray from `hand.absolutePosition` along that quaternion's +y is the drawn line. The fist is at the ear (`spearRaise` -2.2).
- Brace: trunk pitch `br.pitch` set under the shove, head by `headLevel` + `tuck`, board follows (`_squareShield`). Bow: `_bowUp` keeps the stave upright via `_carryProp` `shooting`. Neck: one skin solid (NECK_*), trapezius ends on its foot.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, SPEAR_REAR_UP_*, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob.
