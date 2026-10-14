# Loop state
Iteration: 216   Last re-audit: 215   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 215):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL plateau (list rewritten 215) [S since: 0] B: 1 press_clubbers_side: two clubbers flung backward off the braced boards with clubs loose in the air, the third's club driven level into the board face; no club comes down on a head or shoulder; 2 big_melee_5s, 9s: tribal clubs held upright over the red crowd at contact, none caught in a wide windup or descending onto a blue man; 3 shield_wall_2500ms, 2650ms: hoplite spears stand vertical at contact, none thrust forward from behind the boards (the knight's levelled sword lunge in 2650ms is the only committed blow on show); 4 closeup_weapon_reads: red knights carry swords shouldered or trailed, no swing caught mid-arc against a target.
- h FAIL plateau (list rewritten 215) [S since: 0] B: 1 blue hoplite boards sit face-on to the side camera (three octagons with slots facing the lens) while red boards face the enemy; both teams must hold boards toward the foe — shield_wall_side, shield_wall_2500ms; 2 the pressed red block interpenetrates: helmets merged two and three into one another, bodies inside bodies — shield_wall_2500ms, 2650ms; 3 a blue knight's blade and mitt pass through the blue board row — shield_wall_side; 4 no evidence of the band under shove from the enemy side: add shield_wall_front at contact (current shield_wall_front is pre-contact and there the red boards do lap edge to edge).
unit-look: e PASS f FAIL g PASS h FAIL (2/4)
- f FAIL [S since: 2] B: 1 mammoth ~2.5-2.9 men tall (ref ~3.5) — big_melee_result. (3 struck 199) Ref tabs_screenshot_01.
- h FAIL [S since: 1, rejected since: 2] B: 1 eyes do not read at lineup distance on bare-faced units; 3 beret and yellow cone ~1 head wide (ref ~2 heads, tabs_screenshot_05) — lineup_medieval. Ref tabs_screenshot_04.
maps-light: e FAIL f FAIL g PASS h PASS (2/4)
- e FAIL [S since: 0] B: 1 spooky tree ring is lime-green deciduous, a day meadow palette on purple ground (ref navy night, pink glow); 2 placement top-down only, team tints hide the ground, no battle-angle shot; 3 no spooky dressing (gravestones, dead trees, pink lights) — biome_spooky. Ref tabs_screenshot_03, 05.
- f FAIL [S since: 1] B: 2 no distance haze: far tree ring and mountains as saturated and dark as the field (fog keyed to the fight, but backdrop materials not washed) — big_melee_5s, spell_dome. (1 struck 215) Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g FAIL h PASS (3/4)
- g FAIL [S since: 0] B: 1 levels are text cards in a centred two-column modal, not level nodes on a campaign map; 2 bold mixed-case sans, ref thin widely tracked white caps (tabs_screenshot_04); 3 a sentence of description per card, a wall of text, ref terse labels on empty screen — ui_campaign_select.
camera: e PASS f FAIL g PASS h PASS (3/4)
- f FAIL [S since: 0] B: 1 missing: a near-ground spectator camera rule looking up at the mammoth or a launch (none in web/src; confirmed 203).
vfx: e PASS f PASS g FAIL h FAIL (2/4)
- g FAIL [S since: 1, rejected since: 1] B: 2 no broken-gear debris (r1c2) — big_melee_5s, 9s. (1 struck 199) Ref trailer_2_sheet_02.
- h FAIL [S since: 1, rejected since: 2] B: 1 burst hard solid lobes, no soft fire envelope (ref trailer_3_sheet_03 r1c2) — war_machines_1100ms; 3 muzzle puff faceted spheres, no drifting smoke — 1250ms. (2 struck 200)
Total tier 1 24/24; tier 2 14/24.

## Focus (every gap this iteration)
BASE e6332f5
- [S] vfx.e zeus-bolt-slabs (3b9c0d6) — APPROVE, blocker 2 struck, vfx.e PASS
- [S] vfx.g shed-gear (27eb4f9) — REJECT, reverted: shield and weapon laid flat at y 0.04 beside the corpse are hidden by the grass cards in every shot

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] zeus-bolt-slabs (3b9c0d6) VERDICT: APPROVE CRITERION: vfx.e PASS (previous: FAIL)
- GAP: [S] shed-gear (27eb4f9) VERDICT: REJECT CRITERION: vfx.g FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] vfx.g shed-gear-visible [1] — blocker 2: shed round boards stand on the rim or lean on the corpse (60-75 deg), blades lie tilted hilt raised above the grass, thrown on a short arc off the body (settle without effect updates: effects stop at the result) — ref trailer_2_sheet_02 r1c2, tabs_screenshot_09 — ours big_melee_result
2. [S] vfx.h fire-envelope [0] — blocker 1: soft fire and smoke sprite envelope round the solid burst lobes — ref trailer_3_sheet_03 r1c2 — ours war_machines_1100ms
3. [S] vfx.h drifting-smoke [0] — blocker 3: soft billboard smoke drifting and spreading from the muzzle puff — ref trailer_3_sheet_03 r1c2 — ours war_machines_1250ms
4. [S] maps-light.f backdrop-haze [0] — blocker 2: distance-washed materials or fog on the tree ring and mountains — ref tabs_screenshot_05 — ours big_melee_5s
5. [S] unit-look.f mammoth-scale [2] — blocker 1: mammoth ~3.5 men tall — ref tabs_screenshot_01 — ours big_melee_result
6. [S] camera.f spectator-low-shot [0] — blocker 1: near-ground camera rule looking up at the mammoth or a launch — ref trailer_3_sheet_01 r1c2 — ours big_melee_9s
7. [R] battle-feel.e attack-cycle [0] — wide windup, committed descending swing landing on head or shoulder, spear thrust from behind the boards — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side, closeup_weapon_reads
8. [R] battle-feel.h wall-facing-and-separation [0] — both teams' boards face the foe, no body or blade passes through another — ref tabs_screenshot_06 — ours shield_wall_side, 2500ms

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- shed-gear [attempts: 1, [S]] — 216: shield/weapon cloned off the hands, laid flat at y 0.04 beside the corpse: hidden by grass cards. Clones keep the source parent (set parent null); skip the rHandM mitt
- board-layers [attempts: 1, [S]] — 214: square boards, every other one 0.07 forward: head-on band good, but blue boards beside the knights still face-on in the side shot
- board-axis-from-heading [attempts: 1, [S]] — 213: lap scaled by (1 - shove) on the strip path: blue boards unchanged face-on to the side camera; squaring removes the overlap
- press-club-lands [attempts: 2, [S], dropped] — 205-212, never committed: in contact clubbers topple, stood off they are speared before a chop lands
- lapped-band-at-contact [attempts: 2, [S], dropped] — 212: from the side one wall shows faces, the other backs; turning boards cannot make a side band
- wall-side-band [attempts: 1, [S]] — 209: end men wing boards out 0.9 rad, gap-side boards turn up to 0.6 rad: a turned disc does not move into the gap, torsos still show; wings read edge-on under the shove
- wall-board-yaw-from-frame [attempts: 1, [S]] — 208: rear-rank boards on their own lapped line square to the heading: side/2500/2650 still show two turned discs and ~6 bare torsos; a board covers half a man's width side-on

## Notes for next iteration (max 5 lines)
- 216 [S] pair was (vfx.e, vfx.g); 217 must not repeat it. battle-feel.e and .h are plateau (rewritten 215): only [R] on them. Visual effects stop updating once the battle ends: anything mid-flight at the result freezes in the air.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
