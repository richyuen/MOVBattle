# Loop state
Iteration: 210   Last re-audit: 210   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 210):
battle-feel: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 2] B: 1 no swing caught mid-arc against a target — closeup_weapon_reads (only sword knights, no clubber, no landed blow); 3 no press club caught landing on a man: side-on press_clubbers_side shows one club cocked and one driven level into the board face, none down on a head or body — press_clubbers_side, big_melee_9s. (2 struck 200) Ref trailer_3_sheet_01 r2c3.
- g FAIL [S since: 0] B: 1 landing not shown: flung knights out of frame at war_machines_3800ms, no landed spread of varied poses. Ref trailer_2_sheet_02 r1c2.
- h FAIL [S since: 0] B: 1 under the shove only the lead red board of each rank faces the enemy, the rank's other boards hidden behind it, no lapped band at contact — shield_wall_2500ms, 2650ms; 4 blue tower boards seat face-on to the side camera (prop axis off the heading), a mitt and a blade through the board face — shield_wall_side; 5 front men's board arms reach past the rim with empty mitts, the board floating off the hand (added 210 by 725bd56) — shield_wall_side, 2650ms. (2, 3 struck 210 by the [R]; plateau cleared) Ref tabs_screenshot_06, trailer_2_sheet_03 r2c3.
unit-look: e PASS f FAIL g PASS h FAIL (2/4)
- f FAIL [S since: 2] B: 1 mammoth ~2.5-2.9 men tall (ref ~3.5) — big_melee_result. (3 struck 199) Ref tabs_screenshot_01.
- h FAIL [S since: 1] B: 1 eyes do not read at lineup distance on bare-faced units; 3 beret and yellow cone ~1 head wide (ref ~2 heads, tabs_screenshot_05) — lineup_medieval. Ref tabs_screenshot_04.
maps-light: e FAIL f FAIL g PASS h PASS (2/4)
- e FAIL [S since: 0] B: 1 spooky tree ring is lime-green deciduous, a day meadow palette on purple ground (ref navy night, pink glow); 2 placement top-down only, team tints hide the ground, no battle-angle shot; 3 no spooky dressing (gravestones, dead trees, pink lights) — biome_spooky. Ref tabs_screenshot_03, 05.
- f FAIL [S since: 0] B: 1 corners no darker than centre (no vignette); 2 no distance haze, far trees as saturated as near grass — big_melee_5s. Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g FAIL h PASS (3/4)
- g FAIL [S since: 0] B: 1 levels are text cards in a centred two-column modal, not level nodes on a campaign map; 2 bold mixed-case sans, ref thin widely tracked white caps (tabs_screenshot_04); 3 a sentence of description per card, a wall of text, ref terse labels on empty screen — ui_campaign_select.
camera: e PASS f FAIL g PASS h PASS (3/4)
- f FAIL [S since: 0] B: 1 missing: a near-ground spectator camera rule looking up at the mammoth or a launch (none in web/src; confirmed 203).
vfx: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 1] B: 1 no whole solid ring or dome (198 ring shows a quarter arc behind a body) — closeup_state_reads; 2 Zeus held bolt is a pale yellow glow slab (ref white jagged slabs trailer_2_sheet_03 r3c2) — closeup_pair_zeus_thor. Ref trailer_2_sheet_03 r2c1.
- g FAIL [S since: 1] B: 2 no broken-gear debris (r1c2) — big_melee_5s, 9s. (1 struck 199) Ref trailer_2_sheet_02.
- h FAIL [S since: 1] B: 1 burst hard solid lobes, no soft fire envelope (ref trailer_3_sheet_03 r1c2) — war_machines_1100ms; 3 muzzle puff faceted spheres, no drifting smoke — 1250ms. (2 struck 200)
Total tier 1 24/24; tier 2 12/24.

## Focus (every gap this iteration)
BASE 7f0861d (re-audit 210: verdicts unchanged; battle-feel.h blockers rewritten, plateau kept)
- [R] battle-feel.h wall-as-body (725bd56) — APPROVE, blockers 2 and 3 struck, 5 added, plateau cleared, criterion still FAIL
- [S] battle-feel.e strike-survives-shove — dropped uncommitted (not attempted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [R] wall-as-body (725bd56) VERDICT: APPROVE CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h board-grip-and-axis [0] — blockers 5, 4: with the board on its strip, put the shield hand on the board's boss (or fold the arm behind it), and correct the yaw for the tower prop's local axis so blue boards face the heading — ref tabs_screenshot_06, trailer_2_sheet_03 r2c3 — ours shield_wall_side, 2650ms
2. [S] battle-feel.e press-club-lands [0] — blockers 1, 3: a press clubber's blow comes down on a head or body, caught mid-arc against a target (contact clubbers are limp 0.8-0.98) — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side, closeup_weapon_reads
3. [S] battle-feel.g landed-spread-shot [1] — blocker 1: frame the flung knights' landing so varied rest poses are in shot — ref trailer_2_sheet_02 r1c2 — ours war_machines_3800ms
4. [S] vfx.h soft-fire-envelope [0] — blocker 1: soft sprite fire and smoke round the burst lobes, drifting muzzle smoke — ref trailer_3_sheet_03 r1c2 — ours war_machines_1100ms, 1250ms
5. [S] vfx.e solid-magic-ring [0] — blockers 1-2: a whole one-colour ring or dome in frame; Zeus's bolt as jagged white slabs — ref trailer_2_sheet_03 r2c1, r3c2 — ours closeup_state_reads, closeup_pair_zeus_thor
6. [S] maps-light.f vignette-and-haze [0] — blockers 1-2 — ref tabs_screenshot_05, 01 — ours big_melee_5s
7. [S] unit-look.f mammoth-scale [2] — blocker 1: mammoth ~3.5 men tall — ref tabs_screenshot_01 — ours big_melee_result
8. [S] vfx.g broken-gear-debris [1] — blocker 2: dropped shield and weapon pieces as litter — ref trailer_2_sheet_02 r1c2 — ours big_melee_5s, 9s

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- wall-side-band [attempts: 1, [S]] — 209: end men wing boards out 0.9 rad, gap-side boards turn up to 0.6 rad: a turned disc does not move into the gap, torsos still show; wings read edge-on under the shove
- wall-board-yaw-from-frame [attempts: 1, [S]] — 208: rear-rank boards on their own lapped line square to the heading: side/2500/2650 still show two turned discs and ~6 bare torsos; a board covers half a man's width side-on
- wall-face-held-in-contact [attempts: 1, [S]] — 207: board seated across on its ShieldSlot.at (0.45 m reach), kept up under a stagger: front boards in shield_wall_side/2650ms still face a flank camera (yaw not square to the wall) with torsos between them
- dressed-front-under-shove [attempts: 2, [S]] — 204: front rank pulled onto its mean depth after the solver (0.35/step, 0.04 m cap): depth only, boards still split sideways, bodies still overlap at the line; no contact shot of the board faces
- lapped-boards-in-contact [attempts: 1, [S]] — 203: front-rank dress step onto the live line + board back clamp -0.7: men still three or four depths deep under the shove, boards flat or edge-on, boards trail behind bearers
- lapped-shield-boards [attempts: 1, [S]] — 201: front boards on one plane 0.42 ahead of the rank line, lap 0.22; in the full capture still separate discs at different depths, the front shot stood behind blue

## Notes for next iteration (max 5 lines)
- 210 pick was the [R] on battle-feel.h; 211 picks the top 2 [S] on two criteria. Step 7 plateau rule now counts rejected [S] since the blocker list was written (rewritten 210), not a 10-iteration window, so an approved [R] or a re-audit resets it.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the board no longer follows the hand (blocker 5). Tower shields (blue knights) use another local axis than the round board.
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
