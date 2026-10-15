# Loop state
Iteration: 272   Last re-audit: 270   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-270 every 5):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL deferred (two [R] rejected since rewrite 240: 240, 241; re-audits 245-270: deferred stands) [S since: 0, rejected since: 0, R rejected: 2 (240, 241)] B: 1 on the registered hit frame no blue club is on a red head: one club hip-high along the board line's shins, the front clubber's club bolt upright over him, a third over a downed blue man; hoplites upright, no recoil — press_clubbers_hit, press_clubbers_side; 2 red clubbers 1-3 bodies behind their own front, clubs cocked up and forward over the line (2s/2150ms) or upright (9s); none reaches a blue board — big_melee_2s, 2150ms, 9s; 3 red knights folded nearly double, one sword cocked behind the shoulder, others low at the hip; no blade meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-270; ours lineup_<faction> / biome_<map>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14)
- i tribal PASS (cleared 243, 251; polish: antlers pale, staff topper)
- j farmer PASS (cleared 249; polish: brims repeat, braids unreadable; harvester scythe now level-then-droop, 268)
- k ancient PASS (cleared by a5f0805, 245; polish: crest small, helm close to skin value)
- l viking PASS (cleared by 312a742, 242)
- m dynasty PASS (cleared 247; polish: beads small, monk no bo staff)
- n renaissance PASS (cleared by 038ffcf, 268; polish: drape corners very hard, rump a flat panel; dags grey-white not cream; horse head a flat brown plank)
- o pirate PASS (cleared 249, 250; polish: bandana knot/tails, no vests)
- p spooky PASS (cleared by e37d2ff, 268; polish: heel block + socket reads as a squat plate; skull/shins grey not cream)
- q wild_west PASS (cleared a63efa7 256, 54c5f57 258; polish: pinto legs flat tan planks, tiny hooves; coat tan in shade; robe a broad box)
- r legacy PASS (cleared 7b0fb2a 263, 971918b 264; polish: chariot hidden behind giant in lineup, driver bare, car a plain drum, horse barrel three lumps; straw saturated gold)
- s good PASS (cleared 67760f2 259, 5c7d65b 261; polish: elephant mammoth column legs, blanket pale no device, rider stiff; paladin gold lemon)
- t evil PASS (cleared 5e1852e 265, 0beab60 266; polish: monarch staff held level; pauldrons upright posts; lich tines splay like antlers; mechanic one brown; walker sleeves dark; bringer skull a white cube; cultist bands pale)
- u secret PASS (cleared by 6d39da3 267, f694e83 269; polish: crown lobes ~1/3 ref size, trunk thin and smooth, crown slightly behind his flank)
- v medieval PASS (cleared adb58a6 244, 507a3fe 264; polish: feather thin and pale, straw grey-beige, brim flat)
maps-light tier 3: i k l m n o PASS, j FAIL (6/7) [S since: j 2]
- i introduction PASS (cleared c585210 270, 22e5909 271; polish: oak crowns dark olive, ref yellow-green; in-field prop trees ball-on-stalk + tan ball; tower squat, takes red-zone tint)
- j adventure (meadow): 1 struck by aa8235e (271); 2 part-cleared by 85e15ab (272: boulders, rubble walls, bales gone, grey castle on far rim); still open: ball-on-stalk field trees (by castle left wall, lower-left, lower pool right bank) (maps/meadow_medieval_2); polish: castle off-centre and cropped under Start pill, cones royal blue-violet not slate periwinkle, stone mauve-tinted, no trees at castle foot; lagoon sky-cyan, deep a hard fried-egg blob, shore even white ring
- k challenge PASS (cleared 247, 248; polish: island side wall slate blue-violet, not ochre strata)
- l dynasty PASS (cleared by [R] 466ebe1, 246; polish: olive field, no terraces/stone paths)
- m renaissance PASS (cleared 4b36e9f 269, 8492a63 270; polish: 2.6 m tiles + dark grout a strong grid, ref near seamless; lone bridge plank on the square; house row bends round a round rim)
- n pirate PASS (cleared by [R] ddcb86b, 258; polish: team-zone rectangles cool grey, slab hulls/short masts)
- o simulation PASS (cleared bd1653a 260, e54ee13 261; polish: plane cool lavender (do not re-nudge colours, row 260), grey void disc the only object, line wide)
Total tier 1 24/24; tier 2 23/24; tier 3 20/21.

## Focus (every gap this iteration)
BASE 14f82de (iter 272; only maps-light.j ordinarily pickable (e deferred), so one [S]; [P] lagoon-turquoise skipped: row 271 approved within 20)
- [S] maps-light.j adventure-castle (85e15ab) — APPROVE, j blocker 2 part-cleared (j still FAIL)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] maps-light.j adventure-castle (85e15ab) VERDICT: APPROVE CRITERION: maps-light.j FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] maps-light.j field-oak-clumps [0] — blocker 2: replace ball-on-stalk "tree" props on the adventure field with clustered multi-lobe oak clumps (ring mesh family) — ref maps/meadow_medieval_2 — ours biome_adventure
2. [S] maps-light.j castle-foot-trees [0] — blocker 2 polish: band of oak clumps hugging the castle wall bases — ref maps/meadow_medieval_2 — ours biome_adventure
3. [S] maps-light.j lagoon-depth-shelf [0] — polish: stepped/offset shelf fading foam to teal, no fried-egg oval — ref maps/meadow_medieval_2 — ours biome_adventure
4. [S] maps-light.j ragged-foam-shore [0] — polish: uneven foam rim with breaks, bank grass over it — ref maps/meadow_medieval_1 — ours biome_adventure
5. [S] maps-light.i meadow-field-trees [0] — polish: oak clumps in place of introduction's ball-on-stalk trees and tan ball — ref maps/meadow_medieval_1 — ours biome_introduction
6. [P] maps-light.j castle-frame [0] (fallout of [S] adventure-castle, 272) — CASTLE_X -10->0, CASTLE_Z 31->28, CASTLE_ROOF ->.45,.55,.78 — NEXT: biome_adventure, castle centred with great spire below Start pill, slate cones (note: row approved 272, 20-iteration reversal rule applies)
7. [S] battle-feel.e (deferred stands) — wide windup then committed connecting swing — ref trailer_3_sheet_01 r2c3 — ours closeup_weapon_reads

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
- Next re-audit 275. Simulation plane colour barely responds to ground/fog/emissive (tried 261, reverted). mapBuilder.ts is LF, LOG.md CRLF. Hand-built up-facing quads: indices (0,1,2),(0,2,3) or they cull.
- buildHorse (jouster, pinto, secret cavalry): frame at barrel middle; legs = 4-sided wedge in a holder scaled HORSE_UPPER_DEEP in z, joint at hem - UPPER_SHOW; thick legs must stay inside hem (W>=.85 H). Drape = stadium rings (superellipse ends, flat deck profile); pinto returns before it.
- Unit PBR colours grey out in lineup shade: self-light (mf.get("cloth", c, { emissiveIntensity })). dress* in unitFactory set body.bodyMaterial.baseColor. Head is a blockHead (box): box caps (hExt.x*2.2) cover it. Eyes: body.leftEye/rightEye.setEnabled(false).
- Scythe/tree ride fixed carries in _buildCarry (carryTurn 1); tree bow authored to trunk +x, spun +pi to face up (269). Renaissance: townRing + townPlaza (hides base dressing + obstacles on island, flat flagstone quads replace centerGrass). Meadow: oakRing (theme.ring.oaks), meadowRuins (theme.ruins: hides boulder/wallStone + their obstacles, far rim z 28; +z is far), lagoonPools (theme.lagoon), meadowCastle (theme.castle: hides boulder/wallStone/hayBale + ring trunks on footprint). No [P] on rows approved within 20 iterations.
