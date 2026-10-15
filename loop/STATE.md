# Loop state
Iteration: 278   Last re-audit: 278   Consecutive rejects: 2   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-278):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL deferred (two [R] rejected since the 277 list: 277, 278; un-deferred by the user after 276) [S since: 0] B: 1 on the registered hit frame no blue club comes down on a red head: press_clubbers_blow shows one club driven level into the front hoplite's face (a poke from a low hand on the board rim, not onto the crown), the rest hip-high or lying low; hoplites upright, no visible recoil or head snap — press_clubbers_hit, press_clubbers_blow, press_clubbers_side; 2 red clubbers 1-3 bodies behind their own front, clubs cocked forward over their own rank (2s/2150ms), upright (9s) or flat at hip (5s); none comes down on a blue board or head — big_melee_2s, 2150ms, 5s, 9s; 3 red knights hold swords level at shoulder or upright before the chest; no blade raised over a shoulder, none meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
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
BASE 7598497 (iter 278; re-audit (pickable < 2): no flips, list kept. Plateau battle-feel.e takes its last [R].)
- evidence 1200743: press_clubbers_blow (the hit frame framed close side-on via window.game.frameCamera)
- [R] aimed-blow-final-layer (battle-feel.e blockers 1-3) — ebb241e — REJECT (0/3 cleared), reverted 84ce7d2

## Last verdicts (one line per gap, verbatim critic header)
- RE-AUDIT 278: no flips; REGRESSIONS: none; "battle-feel.e FAIL (plateau; list kept: these shots give no new angle and reconfirm every blocker)"
- GAP: [R] aimed-blow-final-layer (ebb241e) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL); REGRESSIONS: none; CLOSER "For the first time a blue club reaches a red head height on the hit frame"

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e overhead-blow (deferred; blocker 1) — plant the striker's fist above his own head so the aimed arc comes DOWN onto the foe's crown (not a level poke from a low hand), plus an additive backward pitch >= .3 rad and head snap held ~.25 s on the struck man — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_blow, press_clubbers_hit

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- [R] aimed-blow-final-layer [attempts: 1] — 278: 277's _aimBlow + flinch moved after every stance layer (held full .12 s) + hold .6 s + no reach gate; zoom probe showed clubs on helmets/faces with hoplites snapping back, but in the capture the club arrives level into the face from a low hand on the board rim, no visible recoil; knights and rear clubs unchanged
- [R] target-aimed-blow [attempts: 1] — 277: pending-blow queue + _aimBlow (arm pointed from shoulder at foe headTop, club laid across crown, own blow clock, hold .45 s) + reposeNow flinch + contact hold; probe put club tips .2-.6 m from heads, but the critic saw clubs hip-high/upright on the shot frame, no hoplite recoil, knights level, rear clubs over own rank
- landed-blow-on-hit [attempts: 2] — 276: pending-blow queue landing damage at BLOW_LAND_E .3 of the drop + pressers hold the swing while closing; clubbers reached contact, but the fixed arc ends below/short of the head (board face, shins); no recoil on hoplites
- landed-blow-on-hit [attempts: 1, dropped] — 275: heavy_swing put at impact (or 0.7 through the drop) on the hit step + striker/struck re-posed via animator.update(0) after decisions; look shot: striking clubbers ~2 m off, clubs diagonal at hip/shoulder, front clubber cocked upright; no club on a red head
- reaper-crescent-blade [attempts: 1] — 266: weaponRotationOffset rx -0.7 tipped the scythe head down into the ground in the full capture; no blade visible (ribbon crescent itself read on the farmer)
- [R] aimed-blow rebuild [attempts: 2] — 241: fist-mark IK + step-in + board-top fallback + hit re-pose; hit frame still shows the front club upright, no hoplite lean, rank-back clubs fan in the air, knights over-folded
- [R] aimed-blow rebuild [attempts: 1] — 240: blow locked to the sim hit, weapon pointed from the existing fist; a low/kneeling fist jabs the club UP at the head; flinch not visible on the hit frame
- archer-brim [attempts: 1, dropped] — 237: the lineup cones are hood_liripipe, not conical_hat

## Notes for next iteration (max 5 lines)
- e is DEFERRED again (277, 278 [R] rejected). Base for any next try: ebb241e (reverted) = pending-blow queue + _aimBlow + late flinch; it gets clubs to head height. Traps: club prop origin near the grip (reach from mesh OBB corners, ~.99 m); sim steps without rendering so headTop world matrices are stale (force-compute the mark chain); moveTo/stopMoving cut the attack anim (aim keeps its own clock); flinch must come after the brace layer. Missing: fist overhead so the club comes DOWN on the crown, and a bigger recoil. Clubbers are small (shoulder .9 m) vs hoplite heads 1.55 m.
- Every other criterion PASS (274-278); consecutive rejects 2, a third writes STOP. Needs a human: new criteria in CRITIC.md, or accept e as is. Field oaks: theme.fieldOaks -> oakClump in addTree. mapBuilder.ts is LF, LOG.md CRLF. Hand-built up-facing quads: indices (0,1,2),(0,2,3) or they cull.
- buildHorse (jouster, pinto, secret cavalry): frame at barrel middle; legs = 4-sided wedge in a holder scaled HORSE_UPPER_DEEP in z, joint at hem - UPPER_SHOW; thick legs must stay inside hem (W>=.85 H). Drape = stadium rings (superellipse ends, flat deck profile); pinto returns before it.
- Unit PBR colours grey out in lineup shade: self-light (mf.get("cloth", c, { emissiveIntensity })). dress* in unitFactory set body.bodyMaterial.baseColor. Head is a blockHead (box): box caps (hExt.x*2.2) cover it. Eyes: body.leftEye/rightEye.setEnabled(false).
- Melee hit path: _tryAttack applies damage + hitLog at swing start (setAttackCooldown triggers the anim); decisions run on retargetInterval after unit.update, so per-frame work belongs in update(). Clubber engage ~1.96 m vs contact 1.0 m (light_melee 1.7 + pad .2). Probe recipe: temp console.log in _landMeleeBlow + a playwright script on vite preview (port 4187, build --outDir dist-probe, delete after) running gallery_press_clubbers; window.game.frameCamera zooms a frame. No [P] on rows approved within 20 iterations.
