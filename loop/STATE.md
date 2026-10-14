# Loop state
Iteration: 202   Last re-audit: 200   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 200):
battle-feel: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 2] B: 1 no swing caught mid-arc against a target — closeup_weapon_reads (only sword knights, no clubber, no landed blow); 3 no press club caught landing on a man: clubs leave the cock and slant forward over the front, but none down on a head, and the camera behind red hides a landed club — big_melee_2s, 9s. (2 struck 200) Ref trailer_3_sheet_01 r2c3.
- g FAIL [S since: 0] B: 1 landing not shown: flung knights out of frame at war_machines_3800ms, no landed spread of varied poses. Ref trailer_2_sheet_02 r1c2.
- h FAIL [S since: 1] B: 1 the lap holds while the wall closes (shield_wall_front centre and right) but breaks under the shove: boards clamped to their displaced men re-scatter into separate discs — shield_wall_side, 2650ms; the left wing in shield_wall_front unlapped; 2 men pass through each other at contact, blue rank fused, shafts sink into red boards — shield_wall_side. Ref tabs_screenshot_06.
unit-look: e PASS f FAIL g PASS h FAIL (2/4)
- f FAIL [S since: 2] B: 1 mammoth ~2.5-2.9 men tall (ref ~3.5) — big_melee_result. (3 struck 199) Ref tabs_screenshot_01.
- h FAIL [S since: 1] B: 1 eyes do not read at lineup distance on bare-faced units; 3 beret and yellow cone ~1 head wide (ref ~2 heads, tabs_screenshot_05) — lineup_medieval. Ref tabs_screenshot_04.
maps-light: e FAIL f FAIL g PASS h PASS (2/4)
- e FAIL [S since: 0] B: 1 spooky tree ring is lime-green deciduous, a day meadow palette on purple ground (ref navy night, pink glow); 2 placement top-down only, team tints hide the ground, no battle-angle shot; 3 no spooky dressing (gravestones, dead trees, pink lights) — biome_spooky. Ref tabs_screenshot_03, 05.
- f FAIL [S since: 0] B: 1 corners no darker than centre (no vignette); 2 no distance haze, far trees as saturated as near grass — big_melee_5s. Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g FAIL h PASS (3/4)
- g FAIL [S since: 0] B: 1 levels are text cards in a centred two-column modal, not level nodes on a campaign map; 2 bold mixed-case sans, ref thin widely tracked white caps (tabs_screenshot_04); 3 a sentence of description per card, a wall of text, ref terse labels on empty screen — ui_campaign_select.
camera: e PASS f FAIL g FAIL h PASS (2/4)
- f FAIL B: 1 no evidence: add a near-ground spectator shot looking up at the mammoth or a launch.
- g FAIL B: 1 no evidence: add a big_melee_result pair 1 s apart.
vfx: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 1] B: 1 no whole solid ring or dome (198 ring shows a quarter arc behind a body) — closeup_state_reads; 2 Zeus held bolt is a pale yellow glow slab (ref white jagged slabs trailer_2_sheet_03 r3c2) — closeup_pair_zeus_thor. Ref trailer_2_sheet_03 r2c1.
- g FAIL [S since: 1] B: 2 no broken-gear debris (r1c2) — big_melee_5s, 9s. (1 struck 199) Ref trailer_2_sheet_02.
- h FAIL [S since: 1] B: 1 burst hard solid lobes, no soft fire envelope (ref trailer_3_sheet_03 r1c2) — war_machines_1100ms; 3 muzzle puff faceted spheres, no drifting smoke — 1250ms. (2 struck 200)
Total tier 1 24/24; tier 2 11/24.

## Focus (every gap this iteration)
BASE a5298c6
- evidence dffa857 ui_campaign_select (ui-flow.g scored: FAIL) + regression set after the showcase; 2b1ff6b regression set on a fresh page; e193c76 shield_wall_front re-aimed to red's board side at 800 ms
- [S] battle-feel.e press-blow (2a80fbf) — APPROVE, blocker 3 rewritten (rocking cleared, landing not shown), criterion still FAIL
- [S] battle-feel.h lapped-boards retry (9621302) — APPROVE, blocker 1 narrowed to the lap under the shove, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] press-blow (2a80fbf) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [S] lapped-boards retry (9621302) VERDICT: APPROVE CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h lapped-boards-in-contact [0] — blocker 1: in contact the board plane follows the wall's live mean depth every step and the men follow their boards, so the lap holds under the shove — ref tabs_screenshot_06 — ours shield_wall_side
2. [S] battle-feel.h rank-no-pass-through [0] — blocker 2: a front-to-front contact constraint stopping opposing bodies and shafts at the board plane — ref tabs_screenshot_06 — ours shield_wall_side
3. [S] battle-feel.e press-blow-framed [0] — blocker 3: a side-on clubber-in-press gallery pair so the landed blow is framed on its target — ref trailer_3_sheet_01 r2c3 — ours big_melee_9s
4. [S] battle-feel.g landed-spread [1] — blocker 1: hold the war_machines camera on the landing zone, settle-pose picker (side, back, sprawled, folded) on touchdown — ref trailer_2_sheet_02 r1c2 — ours war_machines_3800ms
5. [S] ui-flow.g campaign-map [0] — blocker 1: campaign screen with level nodes or flags on a map plus a short list rail — ref tabs_screenshot_04 (type), gameplay_sheet_03 — ours ui_campaign_select
6. [S] camera.f spectator-low-shot [0] — blocker 1: near-ground camera rule looking up at the mammoth or a launch, plus its shot — ref trailer_3_sheet_01 r1c2 — ours big_melee_5s
7. [S] vfx.h soft-fire-envelope [0] — blocker 1: soft billboard fire and smoke sprites round the solid burst lobes — ref trailer_3_sheet_03 r1c2 — ours war_machines_3800ms
8. [P] battle-feel.e press-blow fallout [0] — of press-blow (approved 202): PRESS_BLOW_HOLD 0.16 -> 0.3 so about a third of the press shows landed — NEXT shot: big_melee_9s, red clubs at x 500-1100 below head height onto the front men

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- lapped-shield-boards [attempts: 1, [S]] — 201: front boards on one plane 0.42 ahead of the rank line, lap 0.22; in the full capture still separate discs at different depths, the front shot stood behind blue
- press-club-phase [attempts: 1, [P]] — 201: heave 0.12 -> 0.6 per-man phase: ledger reversal of the 200 row; sway, not a blow landing
- mammoth-trunk [attempts: 1, [S]] — 198: 8-knot hanging tube in hide purple off the neck: blends into the chest, sits behind the tusk arc; salmon cheek panel left; 0.05 m knot rings too thin to read (199 retry approved)
- wall-shafts-share-one-heading [attempts: 1, [S]] — 196: heading only while levelSpearAt fires; pitch band and rear strike drop still fan shafts
- spear-stops-on-the-first-body [attempts: 1, [S]] — 194: measured the nearest enemy face along the slot heading; no shot changed
- wall-spears-thread-helmets [attempts: 1, [S]] — 190: lane from the two heads ahead + own crown height: no visible step
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; nothing visible
- shade-density [attempts: 1, lawn shade row spent for [P]] — fainter weights: shadow contrast 28% -> 6%, figures float; needs a mechanism

## Notes for next iteration (max 5 lines)
- 202 [S] pair was (battle-feel.e, battle-feel.h); 203 must not repeat it. Evidence first: next `no evidence` blockers are camera.f (low spectator shot) then camera.g (big_melee_result pair 1 s apart).
- capture.mjs now runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Gallery shots stop advancing at Result; a war_machines salvo kills ~1 squire and throws it ~16 m.
- Shield wall: front-rank board plane = slot-time mean depth of the rank (ShieldSlot.plane), boards lap from slotting (_boardLap); lines meet at ~1.3 s in the gallery wall. Clubbers: press blow runs in the shove overlay and in readyBlow when within blowStrikeReach.
- Probe animator branches with console.error -> look/summary.json consoleErrors. Commit per gap with `git commit <paths> -F <msgfile>`; python edits must respect CRLF (match the file's eol).
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
