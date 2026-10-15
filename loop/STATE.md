# Loop state
Iteration: 266   Last re-audit: 265   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-265 every 5):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL deferred (two [R] rejected since rewrite 240: 240, 241; re-audits 245-265: deferred stands) [S since: 0, rejected since: 0, R rejected: 2 (240, 241)] B: 1 on the registered hit frame no blue club is on a red head: one club hip-high along the board line's shins, the front clubber's club bolt upright over him, a third over a downed blue man; hoplites upright, no recoil — press_clubbers_hit, press_clubbers_side; 2 red clubbers 1-3 bodies behind their own front, clubs cocked up and forward over the line (2s/2150ms) or upright (9s); none reaches a blue board — big_melee_2s, 2150ms, 9s; 3 red knights folded nearly double, one sword cocked behind the shoulder, others low at the hip; no blade meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-265; ours lineup_<faction> / biome_<map>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i j k l m o q r s t v PASS, n p u FAIL (11/14) [S since: 0 each, except n 2 (260, 262; 4' written 259), p 3 (250, 251, 252; rejected 266), u 4 (249, 253, 254, 265) plateau]
- i tribal PASS (cleared 243, 251; polish: antlers pale, staff topper)
- j farmer PASS (cleared 249; polish: brims repeat, braids unreadable)
- k ancient PASS (cleared by a5f0805, 245; polish: crest small, helm close to skin value)
- l viking PASS (cleared by 312a742, 242)
- m dynasty PASS (cleared 247; polish: beads small, monk no bo staff)
- n renaissance: 1-3 struck (254-256); 4''(a) struck by 34d65d5 (262); 4''(b) drape back rounds into a dome at the shoulders, body reads about as tall as long (tub), not a long low flat-backed box with a hard shoulder edge and overhanging ends (units/renaissance.jouster); polish: dags grey-white not cream, horse head a flat brown plank
- o pirate PASS (cleared 249, 250; polish: bandana knot/tails, no vests)
- p spooky: 1 struck (f37d3bf, 250); 2 narrowed (01ef730 251, 7155691 252; 266 kept): blade a short stepped slab hanging off a level, lance-carried snath, not a long crescent arcing over the hood (units/spooky.reaper); polish: skull/shins grey not cream
- q wild_west PASS (cleared a63efa7 256, 54c5f57 258; polish: pinto legs flat tan planks, tiny hooves; coat tan in shade; robe a broad box)
- r legacy PASS (cleared 7b0fb2a 263, 971918b 264; polish: chariot hidden behind giant in lineup, driver bare (no galea/scutum), car a plain drum, horse barrel three lumps; straw saturated gold)
- s good PASS (cleared 67760f2 259, 5c7d65b 261; polish: elephant mammoth column legs, blanket pale no device, rider stiff; paladin gold lemon)
- t evil PASS (cleared 5e1852e 265, 0beab60 266; polish: monarch staff held level, not a bone glaive; pauldrons upright posts not level arms; lich tines splay like antlers; mechanic one brown; walker sleeves dark, spikes small; bringer skull a white cube; cultist bands pale blue-white)
- u secret PLATEAU: 1-3 struck (249, 253, 254); 3' struck by 578f217 (265: three-lobe crown clear of ground at flank, maroon hood; polish: lobes grape-separate, greyer than olive); 4 added by 578f217: the lifted crown blots out the middle of lineup_secret (knight/pikeman); trunk a thin level pole whose roots read as a crossguard, not a thick gnarled trunk bent down toward the crown (units/secret.tree_giant)
- v medieval PASS (cleared adb58a6 244, 507a3fe 264; polish: feather thin and pale, straw grey-beige, brim flat)
maps-light tier 3: k l n o PASS, i j m FAIL (4/7) [S since: 0 each]
- i introduction (meadow): 1 shared pale-sage puffball ring, not dark twisted oaks; 2 no ruins/castle, generic rocks and walls (maps/meadow_medieval_1)
- j adventure (meadow): 1 pools are flat grey-blue rectangles, not water (maps/meadow_medieval_2); 2 same ring and props as introduction
- k challenge PASS (cleared 247, 248; polish: island side wall slate blue-violet, not ochre strata)
- l dynasty PASS (cleared by [R] 466ebe1, 246; polish: olive field, no terraces/stone paths)
- m renaissance: 1 no townhouses, two boxes and columns in a field; 2 sage grass, not a paved plaza (maps/renaissance_town)
- n pirate PASS (cleared by [R] ddcb86b, 258; polish: team-zone rectangles cool grey, slab hulls/short masts)
- o simulation PASS (cleared bd1653a 260, e54ee13 261; polish: plane cool lavender (do not re-nudge colours, row 260), grey void disc the only object, line wide)
Total tier 1 24/24; tier 2 23/24; tier 3 15/21.

## Focus (every gap this iteration)
BASE 12f174d (iter 266; picks ranked 1 and 3: rank 2 [R] u would repeat 265's t+u pair; no [P] fallout listed)
- [S] unit-look.t void-monarch-bone-crown (0beab60) — APPROVE, t PASS (2 struck)
- [S] unit-look.p reaper-crescent-blade (4e5e97d, reverted 26f2da2) — REJECT, p FAIL (2 kept)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] void-monarch-bone-crown (0beab60) VERDICT: APPROVE CRITERION: unit-look.t PASS (previous: FAIL)
- GAP: [S] reaper-crescent-blade (4e5e97d) VERDICT: REJECT CRITERION: unit-look.p FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] unit-look.p reaper-high-carry [1] — blocker 2: keep 266 ribbon crescent + bowed snath (reads on the farmer), carry the snath up over the shoulder (no downward rx), head above the hood, flat face to camera — ref units/spooky.reaper — ours lineup_spooky
2. [R] unit-look.u tree-giant-carry-rebuild [0] — plateau; clear 4: tree_club as a thick gnarled trunk bent down toward a 3-lobe olive crown that hangs low beside him (out of lineup_secret's sightline), roots not a crossguard; spec from units/secret.tree_giant — ours lineup_secret, lineup_secret_giants
3. [S] unit-look.n jouster-flat-drape [0] — blocker 4''(b): long low flat-backed box, hard shoulder edge, overhanging ends — ref units/renaissance.jouster — ours lineup_renaissance
4. [S] maps-light.m renaissance-townhouses [0] — blocker 1: tall gabled townhouses round a paved plaza — ref maps/renaissance_town — ours biome_renaissance
5. [S] maps-light.j meadow-water-pools [0] — blocker 1: recessed water with a wet rim and irregular outline — ref maps/meadow_medieval_2 — ours biome_adventure
6. [S] maps-light.i meadow-ruins-oaks [0] — blocker 2: castle ruins / broken walls replacing generic rocks and walls — ref maps/meadow_medieval_1 — ours biome_introduction
7. [S] battle-feel.e (deferred stands) — registered hit frame lands the club on a head — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_hit

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- reaper-crescent-blade [attempts: 1] — 266: weaponRotationOffset rx -0.7 tipped the scythe head down into the ground in the full capture; no blade visible (ribbon crescent itself read on the farmer)
- [R] aimed-blow rebuild [attempts: 2] — 241: fist-mark IK + step-in + board-top fallback + hit re-pose; hit frame still shows the front club upright, no hoplite lean, rank-back clubs fan in the air, knights over-folded
- [R] aimed-blow rebuild [attempts: 1] — 240: blow locked to the sim hit, weapon pointed from the existing fist; a low/kneeling fist jabs the club UP at the head; flinch not visible on the hit frame
- archer-brim [attempts: 1, dropped] — 237: the lineup cones are hood_liripipe, not conical_hat
- cone-brim-skirt [attempts: 1] — 235: flared skirt 1.5->2.4 heads, 0.1 deep, lighter: invisible edge-on at eye level
- aimed-club-cycle [attempts: 1] — 234: laid clubs end on the clubber's own front man, short of the foe
- rear-strike-lands [attempts: 1] — 233: aimed lay only at the landed fraction; rear club still cocked vertical between beats

## Notes for next iteration (max 5 lines)
- battle-feel.e deferred. 241 findings: clubbers strike from up to ~2 m, hoplites taller than clubbers, units animate BEFORE the decision loop, so the hit frame renders the pre-hit pose unless re-posed in the same step.
- Next re-audit 270. u is plateau: next pick on it is one [R] (tree carry + trunk; TREE_HIP_TIP is now a fixed tip in proceduralAnimation _buildCarry, no jitter; crown lobes in propBuilder tree_club). Simulation plane colour barely responds to ground/fog/emissive (tried 261, reverted). mapBuilder.ts and LOG.md are CRLF: use Edit.
- buildHorse (jouster, pinto, secret cavalry): frame at barrel middle; legs = 4-sided wedge in a holder scaled HORSE_UPPER_DEEP in z, joint at hem - UPPER_SHOW; thick legs must stay inside hem (W>=.85 H). Lineup horse pose varies run to run; crop the look PNG to judge legs.
- Unit PBR colours grey out in lineup shade: self-light (mf.get("cloth", c, { emissiveIntensity })). dress* in unitFactory set body.bodyMaterial.baseColor. Head is a blockHead (box): box caps (hExt.x*2.2) cover it. Eyes: body.leftEye/rightEye.setEnabled(false).
- Reaper (iconic_reaper, posePreset giant, grip blade_slash) swings its arm in lineup: the --only look and the full capture caught different arm phases (266: rx -0.7 upright in look, head-down in full run). Fix the carry in a pose (proceduralAnimation), not a hand rotation offset; check 2 runs. No [P] on rows approved within 20 iterations.
