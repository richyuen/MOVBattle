# Loop state
Iteration: 212   Last re-audit: 210   Consecutive rejects: 0   Branch: main

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
- h FAIL [S since: 1] B: 1 under the shove only the lead red board of each rank faces the enemy, the rank's other boards hidden behind it, no lapped band at contact — shield_wall_2500ms, 2650ms; 4 blue (hoplite, round) boards seat face-on to the side camera, a mitt and a blade through the board face — shield_wall_side. (2, 3 struck 210; 5 struck 211) Ref tabs_screenshot_06, trailer_2_sheet_03 r2c3.
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
BASE 3f052ca
- [S] battle-feel.h lapped-band-at-contact — dropped uncommitted: boards turned a further 0.4 rad under the shove still stack behind the lead board from the side camera (both walls lap with one handedness, so from the flank one wall shows faces, the other backs)
- [S] battle-feel.e press-club-lands — dropped uncommitted: clubbers stood off a braced wall (no shove) with an upright chop stayed on their feet, but were speared before any chop landed in frame (4.8 s)
- No gap reached the critic; consecutive rejects unchanged.

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] board-grip (7a4746a) VERDICT: APPROVE CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h lapped-band-at-contact [2] — blocker 1: lay each rank's boards along the wall line with the lap offset, so side and 2650ms show 3+ boards overlapping, not one lead board per rank — ref tabs_screenshot_06 — ours shield_wall_2650ms
2. [S] battle-feel.h board-axis-from-heading [0] — blocker 4: blue hoplite boards face the enemy, not the side camera; blade and mitt kept behind the board plane — ref trailer_2_sheet_03 r2c3 — ours shield_wall_side
3. [S] battle-feel.e press-club-lands [2] — blocker 3: an overhead club arc ending on the head or shoulders of a man behind the board, held a frame on contact — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side
4. [S] battle-feel.g landed-spread-shot [1] — blocker 1: keep the camera on the flung knights through landing so varied landed poses show — ref trailer_2_sheet_02 r1c2 — ours war_machines_3800ms
5. [S] unit-look.f mammoth-scale [2] — blocker 1: mammoth ~3.5 men tall, legs and tusks scaled to match — ref tabs_screenshot_01 — ours big_melee_result
6. [S] vfx.e solid-ring [0] — blocker 1: a whole flat solid one-colour ring or dome round the caster — ref trailer_2_sheet_03 r2c1 — ours closeup_state_reads
7. [S] maps-light.f vignette-and-haze [0] — blockers 1-2 — ref tabs_screenshot_05 — ours big_melee_5s
8. [S] unit-look.h hat-scale [0] — blocker 3: beret and cone ~2 heads wide, seated on the head — ref tabs_screenshot_05 — ours lineup_medieval

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- press-club-lands [attempts: 2, [S], dropped] — 205-212, never committed: in contact clubbers topple, stood off they are speared before a chop lands
- lapped-band-at-contact [attempts: 2, [S], dropped] — 212: from the side one wall shows faces, the other backs; turning boards cannot make a side band
- wall-side-band [attempts: 1, [S]] — 209: end men wing boards out 0.9 rad, gap-side boards turn up to 0.6 rad: a turned disc does not move into the gap, torsos still show; wings read edge-on under the shove
- wall-board-yaw-from-frame [attempts: 1, [S]] — 208: rear-rank boards on their own lapped line square to the heading: side/2500/2650 still show two turned discs and ~6 bare torsos; a board covers half a man's width side-on
- wall-face-held-in-contact [attempts: 1, [S]] — 207: board seated across on its ShieldSlot.at (0.45 m reach), kept up under a stagger: front boards in shield_wall_side/2650ms still face a flank camera (yaw not square to the wall) with torsos between them
- dressed-front-under-shove [attempts: 2, [S]] — 204: front rank pulled onto its mean depth after the solver (0.35/step, 0.04 m cap): depth only, boards still split sideways, bodies still overlap at the line; no contact shot of the board faces
- lapped-boards-in-contact [attempts: 1, [S]] — 203: front-rank dress step onto the live line + board back clamp -0.7: men still three or four depths deep under the shove, boards flat or edge-on, boards trail behind bearers
- lapped-shield-boards [attempts: 1, [S]] — 201: front boards on one plane 0.42 ahead of the rank line, lap 0.22; in the full capture still separate discs at different depths, the front shot stood behind blue

## Notes for next iteration (max 5 lines)
- 212 committed nothing. ITERATE step 4 now counts a dropped gap as an attempt (user, after 212), so lapped-band-at-contact and press-club-lands are at [2] and not pickable; the next picks come from ranks 2 and 4-8 until a re-audit (215) re-ranks.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
