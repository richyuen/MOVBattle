# Loop state
Iteration: 276   Last re-audit: 276   Consecutive rejects: 3   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-276):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL deferred (two [R] rejected since rewrite 240: 240, 241; re-audits 245-276: deferred stands) [S since: 0, rejected since: 2 (275 dropped, 276 rejected), R rejected: 2 (240, 241)] B: 1 on the registered hit frame no blue club is on a red head: one club hip-high along the board line's shins, the front clubber's club bolt upright over him, a third over a downed blue man; hoplites upright, no recoil — press_clubbers_hit, press_clubbers_side; 2 red clubbers 1-3 bodies behind their own front, clubs cocked up and forward over the line (2s/2150ms) or upright (9s); none reaches a blue board — big_melee_2s, 2150ms, 9s; 3 red knights folded nearly double, one sword cocked behind the shoulder, others low at the hip; no blade meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-276; ours lineup_<faction> / biome_<map>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
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
maps-light tier 3: i-o all PASS (7/7)
- i introduction PASS (cleared c585210 270, 22e5909 271; polish: oak crowns dark olive, ref yellow-green; in-field prop trees ball-on-stalk + tan ball; tower squat, takes red-zone tint)
- j adventure PASS (cleared aa8235e 271, 85e15ab 272, 95b1309 273; polish: rim ring pale balls on stalks vs saturated field clumps; pool-bank clump overhangs shore; castle off-centre under Start pill, cones royal blue-violet; lagoon sky-cyan, hard fried-egg deep blob, even white shore)
- k challenge PASS (cleared 247, 248; polish: island side wall slate blue-violet, not ochre strata)
- l dynasty PASS (cleared by [R] 466ebe1, 246; polish: olive field, no terraces/stone paths)
- m renaissance PASS (cleared 4b36e9f 269, 8492a63 270; polish: 2.6 m tiles + dark grout a strong grid, ref near seamless; lone bridge plank on the square; house row bends round a round rim)
- n pirate PASS (cleared by [R] ddcb86b, 258; polish: team-zone rectangles cool grey, slab hulls/short masts)
- o simulation PASS (cleared bd1653a 260, e54ee13 261; polish: plane cool lavender (do not re-nudge colours, row 260), grey void disc the only object, line wide)
Total tier 1 24/24; tier 2 23/24; tier 3 21/21.

## Focus (every gap this iteration)
BASE 347805f (iter 276; re-audit (pickable < 2): no flips, deferred stands. Deferred battle-feel.e picked, nothing else pickable.)
- [S] landed-blow-on-hit (battle-feel.e blocker 1) — d73adb3 — REJECT, reverted 05448b2

## Last verdicts (one line per gap, verbatim critic header)
- RE-AUDIT 276: no flips; REGRESSIONS: none; "battle-feel.e FAIL (deferred stands: no commit or new shot angle since 275; list kept)"; "There are fewer than 4 real [S] gaps"
- GAP: [S] landed-blow-on-hit (d73adb3) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL); REGRESSIONS: none

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e (deferred stands; blockers 1-3 unchanged) — target-aimed club drop: IK the club head onto the foe's head joint at the landing fraction, plus same-frame recoil on the struck man — ref trailer_3_sheet_01 r2c3, r3c1 — ours press_clubbers_hit, press_clubbers_side, big_melee_2150ms, closeup_weapon_reads

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- landed-blow-on-hit [attempts: 2] — 276: pending-blow queue landing damage at BLOW_LAND_E .3 of the drop + pressers hold the swing while closing; clubbers reached contact, but the fixed arc ends below/short of the head (board face, shins); no recoil on hoplites
- landed-blow-on-hit [attempts: 1, dropped] — 275: heavy_swing put at impact (or 0.7 through the drop) on the hit step + striker/struck re-posed via animator.update(0) after decisions; look shot: striking clubbers ~2 m off, clubs diagonal at hip/shoulder, front clubber cocked upright; no club on a red head
- reaper-crescent-blade [attempts: 1] — 266: weaponRotationOffset rx -0.7 tipped the scythe head down into the ground in the full capture; no blade visible (ribbon crescent itself read on the farmer)
- [R] aimed-blow rebuild [attempts: 2] — 241: fist-mark IK + step-in + board-top fallback + hit re-pose; hit frame still shows the front club upright, no hoplite lean, rank-back clubs fan in the air, knights over-folded
- [R] aimed-blow rebuild [attempts: 1] — 240: blow locked to the sim hit, weapon pointed from the existing fist; a low/kneeling fist jabs the club UP at the head; flinch not visible on the hit frame
- archer-brim [attempts: 1, dropped] — 237: the lineup cones are hood_liripipe, not conical_hat
- cone-brim-skirt [attempts: 1] — 235: flared skirt 1.5->2.4 heads, 0.1 deep, lighter: invisible edge-on at eye level
- aimed-club-cycle [attempts: 1] — 234: laid clubs end on the clubber's own front man, short of the foe

## Notes for next iteration (max 5 lines)
- STOPPED at 276 (3 consecutive rejects). battle-feel.e is the only open criterion and landed-blow-on-hit is now at attempts 2 (not pickable). Timing (275 re-pose, 276 deferred landing) is solved in principle; the wall is the arc: club head must be IK-aimed at the foe's head joint at the landing frame, and the struck man must recoil that frame. Hoplites are taller than clubbers and stand behind boards.
- SATURATED (274-276): needs a human: new criteria in CRITIC.md, or un-defer e and allow a fresh [R] (target-aimed arm/club IK + same-frame recoil). Field oaks: theme.fieldOaks -> oakClump in addTree. mapBuilder.ts is LF, LOG.md CRLF. Hand-built up-facing quads: indices (0,1,2),(0,2,3) or they cull.
- buildHorse (jouster, pinto, secret cavalry): frame at barrel middle; legs = 4-sided wedge in a holder scaled HORSE_UPPER_DEEP in z, joint at hem - UPPER_SHOW; thick legs must stay inside hem (W>=.85 H). Drape = stadium rings (superellipse ends, flat deck profile); pinto returns before it.
- Unit PBR colours grey out in lineup shade: self-light (mf.get("cloth", c, { emissiveIntensity })). dress* in unitFactory set body.bodyMaterial.baseColor. Head is a blockHead (box): box caps (hExt.x*2.2) cover it. Eyes: body.leftEye/rightEye.setEnabled(false).
- Melee hit path: _tryAttack applies damage + hitLog at swing start (setAttackCooldown triggers the anim); decisions run on retargetInterval after unit.update, so per-frame work belongs in update(). Clubber engage ~1.96 m vs contact 1.0 m (light_melee 1.7 + pad .2). No [P] on rows approved within 20 iterations.
