# Loop state
Iteration: 221   Last re-audit: 220   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL plateau (rewritten 220) [S since: 0] B: 1 no club comes down on a board top, head or shoulder; overhead windup held, others jammed level into the board face — press_clubbers_side; 2 red clubs lean ~45 deg as a uniform forest, none at the top of a windup or descending — big_melee_5s, 9s; 3 hoplite spears vertical at contact, none thrust from behind the boards — shield_wall_2500ms, 2650ms; 4 knights' swords upright or trailed, no swing mid-arc — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3.
- h FAIL plateau (rewritten 220) [S since: 0] B: 1 blue hoplite boards face the side lens while red boards angle toward the foe — shield_wall_side, 2650ms; 2 pressed red block interpenetrates, helmets merged two and three deep — 2500ms, 2650ms; 3 blue knights overlap and their blades and mitts cross the blue board row — shield_wall_side; 4 no evidence of the band under shove from the enemy side: add shield_wall_front at contact. Ref tabs_screenshot_06.
unit-look: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL [S since: 2, rejected since: 2] B: 3 beret and yellow cone ~1.5 heads wide, small on the head (ref ~2 heads, tabs_screenshot_05) — lineup_medieval. (1 struck 218) Ref tabs_screenshot_04.
maps-light: e FAIL f FAIL g PASS h PASS (2/4)
- e FAIL [S since: 0] B: 1 spooky tree ring lime-green deciduous on purple ground (ref navy night, pink glow); 2 placement top-down only, team tints hide the ground; 3 no spooky dressing (gravestones, dead trees, pink lights) — biome_spooky. Ref tabs_screenshot_03, 05, 09.
- f FAIL [S since: 1, rejected since: 1] B: 2 no distance haze: far tree ring and navy mountains as saturated and dark as the field — big_melee_5s, spell_dome. (1 struck 215) Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g FAIL h PASS (3/4)
- g FAIL [S since: 0] B: 1 levels are text cards in a centred modal, not level nodes on a map; 2 bold mixed-case sans, ref thin tracked white caps; 3 a sentence per card, a wall of text — ui_campaign_select. Ref tabs_screenshot_04.
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL [S since: 0] B: 1 at 1100ms the burst body is a broad tan dust fog: normally blended dust sprites drawn over the additive fire wash it out, the fireball never reads — war_machines_1100ms; 2 flung bodies hang greyed in dull tan haze, not dark against a bright blast — 1100ms, 1250ms. (3, 4 struck 220 by the [R]; plateau cleared) Ref trailer_3_sheet_03 r1c1, r1c2.
Total tier 1 24/24; tier 2 17/24.

## Focus (every gap this iteration)
BASE 91e5620
- [P] vfx.h dust-under-fire (55cd7e3) — REJECT, reverted: more fire opacity does not show; the fire sits under the normally blended dust (draw order)
- [S] camera.f spectator-low (032b203) — APPROVE, blocker 1 struck, camera.f PASS
- [R] battle-feel.e committed-blow (047b3a8) — REJECT, reverted: cleared only the spear lunge drop (1 of 4); CHOP_ARM_DROP 0.9 leaves the landed club above the striker's head (reads as the windup); swords untouched

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [P] dust-under-fire (55cd7e3) VERDICT: REJECT CRITERION: vfx.h FAIL (previous: FAIL)
- GAP: [S] spectator-low (032b203) VERDICT: APPROVE CRITERION: camera.f PASS (previous: FAIL)
- GAP: [R] committed-blow (047b3a8) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [R] battle-feel.e committed-blow-v2 [1] — blockers 1-4: heavy and sword blows as target-aimed strikes (two-joint arm solve to the foe's crown or board top at landing, then a hold); keep the spear lunge drop of 047b3a8 and the no-topple strike window — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side, closeup_weapon_reads
2. [R] battle-feel.h wall-as-surface [0] — blockers 1-4: every board faces the enemy centroid; slot spacing keeps helmets and bodies from merging and blades behind the board row — ref tabs_screenshot_06 — ours shield_wall_side
3. [S] vfx.h fire-over-dust [0] — blocker 1: dust in a lower rendering group than the additive fire body/core, so the fireball composites over the dust — ref trailer_3_sheet_03 r1c1 — ours war_machines_1100ms
4. [S] maps-light.f distance-haze [1] — blocker 2: depth-keyed haze on the far tree ring and mountains (backdrop-only fog or tint pass) — ref tabs_screenshot_05 — ours big_melee_5s
5. [S] unit-look.h hat-scale [0] — blocker 3: per-hat seat scale so beret and cone read ~2 heads wide — ref tabs_screenshot_05 — ours lineup_medieval
6. [S] maps-light.e spooky-biome [0] — blocker 1: navy night palette, pink glow lights, dead-tree ring — ref tabs_screenshot_03 — ours biome_spooky
7. [S] ui-flow.g campaign-map [0] — blocker 1: level nodes on a map backdrop instead of text cards — ref tabs_screenshot_04 — ours ui_campaign_select

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- committed-blow [attempts: 1, [R]] — 221: arm drop 0.9 + hold + no-topple window + spear lunge drop: only the spears read (1 of 4); the landed club stays overhead
- dust-under-fire [attempts: 1, [P]] — 221: dust 0.45, body 0.95: fire still under the dust; needs draw order
- backdrop-haze [attempts: 1, [S]] — 219: far* fog on (good) + HAZE_DEPTH 60: ledger reversal of the 215 haze row and a milky ring; resubmit the flip alone with a ring-owned tint
- envelope-colour [attempts: 1, [P]] — 218: pale core/outer colours at alpha 0.95 rendered mustard/dark orange with hard octagons; needs an [S] (unlit/additive core over the smoke)
- shed-gear [attempts: 1, [S]] — 216: shield/weapon cloned off the hands, laid flat at y 0.04 beside the corpse: hidden by grass cards. Clones keep the source parent (set parent null); skip the rHandM mitt

## Notes for next iteration (max 5 lines)
- 221 picks were [R] battle-feel.e + [S] camera.f + [P] vfx.h. battle-feel.e and .h are plateau (rewritten 220): only [R] on them, one [R] per iteration. The 221 [R] found: spears dropping on the lunge reads; clubs need an aimed arm solve to the target, not joint deltas.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
