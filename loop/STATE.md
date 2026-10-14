# Loop state
Iteration: 193   Last re-audit: 190   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 1] BLOCKERS: 2 wall spears pass through their own men: the front men's dipped spears send their butts up through the rear rank's heads — ours shield_wall_2500ms, shield_wall_2650ms; 4 wall shafts cross one another in X's above the helmets (raised rears now 60-80 degrees against dipped fronts whose butts rise behind; TABS: six raised shafts, none crossing) — ours shield_wall_side, shield_wall_2500ms; 5 a front man's dipped spear overruns its mark: stopped on the board in shield_wall_2500ms/2650ms, but a spear aimed at a rear man still passes the front man and ends on the second-rank board, and one point shows low behind the front board — ours shield_wall_side. Ref tabs_screenshot_06, trailer_3_sheet_01 r3c1.
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 23/24 (193: unit-look.c flipped by the neck [R]; plateau cleared)

## Focus (every gap this iteration)
BASE 5017562
- [S] battle-feel.c spear-overruns-its-mark (43724f5) — APPROVE, criterion still FAIL (blocker 5 not struck)
- [R] unit-look.c bare-neck (1405ccd) — APPROVE, criterion PASS
- [P] battle-feel.c SPEAR_REAR_UP_MIN 0.75 -> 1.05 (4840c7b) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] battle-feel.c spear-overruns-its-mark (43724f5) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [R] unit-look.c bare-neck (1405ccd) VERDICT: APPROVE CRITERION: unit-look.c PASS (previous: FAIL)
- GAP: [P] battle-feel.c SPEAR_REAR_UP_MIN 0.75 -> 1.05 (4840c7b) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.c spear-stops-on-the-first-body [0] — blocker 5: the reach stop tests the nearest enemy body or board along the shaft's own line, not the aimed man — ref trailer_3_sheet_01 r3c1 — ours shield_wall_side
2. [S] battle-feel.c front-hold-level [0] — blocker 4: the front rank holds the spear level and couched, not dipped overhand, so no butt rises into the rear shafts (may reset SPEAR_FRONT_DIP_*) — ref tabs_screenshot_06 — ours shield_wall_side
3. [S] battle-feel.c butt-kept-off-the-rear-rank [0] — blocker 2: cap the front man's butt below the rear rank's shoulder line, or grip near the butt so little shaft runs behind the fist — ref tabs_screenshot_06 — ours shield_wall_2500ms, shield_wall_2650ms
4. [S] battle-feel.c one-pitch-per-wall [0] — blocker 4: raised rears share a wall-wide pitch and strike by running the shaft forward at that pitch, not by falling to 0.3 — ref tabs_screenshot_06 — ours shield_wall_side
5. [S] battle-feel.c rear-files-in-the-gaps [0] — blocker 2: rear-rank spearmen stand in the gaps between front men so shafts pass between heads, not through them — ref tabs_screenshot_06 — ours shield_wall_2500ms
No [P] ranked. Critic notes: the neck shows about a third of a head (spec says under a fifth) and flares at its foot, not a blocker, no NECK_LENGTH [P]; SPEAR_GIVE lengthens the butt behind the front man, which works against blocker 2.

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
- Only battle-feel.c fails, so each iteration has one [S] slot (two [S] must be on different criteria): 194 takes one gap; gaps 2-4 all say the same thing (front hold level and couched low, butts below the rear shafts, one pitch for the raised rears), which is one coherent mechanism change. 195 is a re-audit. Commit per gap with `git commit <paths> -F <msgfile>`; write messages and patch scripts with the Write tool; run the full capture in the background (over 10 minutes).
- Scratch check before committing: `scratchpad/look.mjs <gallery scenario>` renders a gallery scene to a PNG outside output/loop (gallery_shield_wall_side, gallery_archer_loose, gallery_pair_ancient_zeus_vs_legacy_thor); read it once to confirm the mechanism is visible.
- Spear: `_carrySpear` pitch per man from `_buildBracePose` (`spearUp` rear 1.05-1.4, `spearDown` front 0.42-0.64, `spearGrip` balance grip via `toBalance`), blend `_spearRearHold`, stroke `run` = `_thrustStroke` x SPEAR_LUNGE, stopped at the aimed man's near face (SPEAR_BITE, SPEAR_GIVE). The fist is at the ear (`spearRaise` -2.2), so a level couched hold needs the arm lowered to the hip for front men.
- Brace: trunk pitch `br.pitch` set under the shove, head by `headLevel` + `tuck`, board follows (`_squareShield`). Bow: `_bowUp` keeps the stave upright via `_carryProp` `shooting`. Neck: one skin solid (NECK_*), trapezius ends on its foot.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, SPEAR_REAR_UP_*, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob.
