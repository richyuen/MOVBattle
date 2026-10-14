# Loop state
Iteration: 217   Last re-audit: 215   Consecutive rejects: 0   Branch: main

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
vfx: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL [S since: 2] B: 3 muzzle puff faceted white spheres, no drifting smoke — war_machines_1250ms (left cannon); 4 the envelope is translucent saturated orange over grey smoke, the burst reads as a brown dust cloud, not a glowing near-white core fading to pale yellow (added 217 by 3485412) — war_machines_1250ms. (1 struck 217, 2 struck 200) Ref trailer_3_sheet_03 r1c1, r1c2.
Total tier 1 24/24; tier 2 15/24.

## Focus (every gap this iteration)
BASE 8bb7a14
- [S] vfx.g shed-gear-visible (5953933) — APPROVE, blocker 2 struck, vfx.g PASS
- [S] vfx.h fire-envelope (3485412) — APPROVE, blocker 1 struck, blocker 4 added (envelope colour), criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] shed-gear-visible (5953933) VERDICT: APPROVE CRITERION: vfx.g PASS (previous: FAIL)
- GAP: [S] fire-envelope (3485412) VERDICT: APPROVE CRITERION: vfx.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] vfx.h muzzle-smoke [0] — blocker 3: a soft drifting white muzzle puff of feathered billboard sprites (reuse _envelopeMat), replacing the faceted spheres — ref trailer_3_sheet_03 r1c1 — ours war_machines_1250ms
2. [P] vfx.h envelope-colour [0] — blocker 4, fallout of fire-envelope (approved 217): fire sprite colour (1, 0.92, 0.7) at the core and (1, 0.75, 0.4) outer, peak alpha 0.95 — NEXT shot: war_machines_1250ms, the brown haze round the burst turns pale yellow-white
3. [S] unit-look.f mammoth-scale [2] — blocker 1: a giant-scale body rule so the mammoth stands ~3.5 men tall, legs and tusks scaled as parts — ref tabs_screenshot_01 — ours big_melee_result
4. [S] unit-look.h lineup-eyes [0] — blocker 1: eye whites sized for lineup distance on bare-faced units — ref tabs_screenshot_04 — ours lineup_medieval
5. [S] maps-light.f backdrop-haze [0] — blocker 2: wash the tree ring and mountain materials toward the sky colour with distance — ref tabs_screenshot_05 — ours big_melee_5s
6. [S] camera.f spectator-camera [0] — blocker 1: a near-ground camera rule looking up at the mammoth or a launch — ref trailer_3_sheet_01 r1c2 — ours war_machines_1250ms
7. [R] battle-feel.h shield-wall [0] — both teams' boards toward the enemy, crowd separation keeping men from passing through one another in the pressed block — ref tabs_screenshot_06 — ours shield_wall_side, 2500ms
8. [R] battle-feel.e attack-stroke [0] — windup, descent and contact aimed at the target's head or shoulder, spear thrust levelled from behind the boards — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side, big_melee_5s

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- shed-gear [attempts: 1, [S]] — 216: shield/weapon cloned off the hands, laid flat at y 0.04 beside the corpse: hidden by grass cards. Clones keep the source parent (set parent null); skip the rHandM mitt
- board-layers [attempts: 1, [S]] — 214: square boards, every other one 0.07 forward: head-on band good, but blue boards beside the knights still face-on in the side shot
- board-axis-from-heading [attempts: 1, [S]] — 213: lap scaled by (1 - shove) on the strip path: blue boards unchanged face-on to the side camera; squaring removes the overlap
- press-club-lands [attempts: 2, [S], dropped] — 205-212, never committed: in contact clubbers topple, stood off they are speared before a chop lands
- lapped-band-at-contact [attempts: 2, [S], dropped] — 212: from the side one wall shows faces, the other backs; turning boards cannot make a side band
- wall-side-band [attempts: 1, [S]] — 209: end men wing boards out 0.9 rad, gap-side boards turn up to 0.6 rad: a turned disc does not move into the gap, torsos still show; wings read edge-on under the shove
- wall-board-yaw-from-frame [attempts: 1, [S]] — 208: rear-rank boards on their own lapped line square to the heading: side/2500/2650 still show two turned discs and ~6 bare torsos; a board covers half a man's width side-on

## Notes for next iteration (max 5 lines)
- 217 [S] pair was (vfx.g, vfx.h); 218 must not repeat it. battle-feel.e and .h are plateau (rewritten 215): only [R] on them. Visual effects stop updating once the battle ends: anything mid-flight at the result freezes; shed gear is laid at once for that reason.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
