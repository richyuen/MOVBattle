# Loop state
Iteration: 280   Last re-audit: 280   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-280):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL (un-deferred by the user after 279; list from re-audit 280, blocker 1 narrowed by 8f62d4e) [S since: 1 (280 overhead-blow approved)] B: 1 on the registered hit frame the club falls from a straight-up arm but lands on the hoplite's face/neck, not his crown; one clubber down on his back; hoplites upright, no readable recoil or head snap — press_clubbers_hit, press_clubbers_blow, press_clubbers_side; 2 red clubbers 1-3 bodies behind their own front, clubs cocked forward over their own rank (2s/2150ms) or flat at hip (5s/9s); none comes down on a blue board or head — big_melee_2s, 2150ms, 5s, 9s; 3 red knights hold swords upright or level before the body; no blade raised over a shoulder, none meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
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
BASE e8a036b (iter 280; re-audit (N%5): no flips, list kept. User asked for the critic's overhead-blow [S], attempt 2.)
- [S] overhead-blow (battle-feel.e blocker 1) — 8f62d4e — APPROVE (blocker 1 narrowed, not struck)

## Last verdicts (one line per gap, verbatim critic header)
- RE-AUDIT 280: no flips; REGRESSIONS: none; "battle-feel.e FAIL (ordinary FAIL, un-deferred; list kept)"
- GAP: [S] overhead-blow (8f62d4e) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL); REGRESSIONS: none; CLOSER "For the first time the swing reads overhead-then-down"

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e overhead-blow-stagger — blocker 1: whole-body ROOT stagger on the land step (root pitches back ~.35 rad + half a step back, ~.3 s) so helmet and board tip back together — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_blow
2. [S] battle-feel.e blow-stance-brace — blocker 1: a striker inside his blow (aim weight > 0 or pending blow) is braced against crowd topple, so both clubbers stand on the hit frame — ref r2c3 — ours press_clubbers_hit
3. [S] battle-feel.e rear-rank-overhead-blow — blocker 2: extend _aimBlow to rear-rank clubbers (REAR_RANK_REACH) so their clubs come down over their own front onto blue boards/heads — ref r3c1 — ours big_melee_5s
4. [S] battle-feel.e knight-high-guard — blocker 3: blade_slash knights carry the sword cocked over the shoulder between swings and lay it onto the foe via the aimed blow — ref r2c3 — ours closeup_weapon_reads
5. [P] battle-feel.e overhead-blow fallout — blocker 1: proceduralAnimation.ts BLOW_PITCH .4 -> .15 (upright trunk lifts the fist over the helmet; club tip from chin to helmet top) — ours press_clubbers_blow

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- overhead-blow [attempts: 1, approved on 2nd at 280] — 279: 278 base + lunge legs + fist aimed at the grip end of a 35 deg line down onto the crown + flinch .85/.9; zoom probe read as overhead blows with hoplites thrown back, but in the capture the fist only reaches the striker's own head height so the club rises to the crests; no visible recoil. Critic: _aimBlow values are now spent
- [R] aimed-blow-final-layer [attempts: 1] — 278: 277's _aimBlow + flinch moved after every stance layer (held full .12 s) + hold .6 s + no reach gate; zoom probe showed clubs on helmets/faces with hoplites snapping back, but in the capture the club arrives level into the face from a low hand on the board rim, no visible recoil; knights and rear clubs unchanged
- [R] target-aimed-blow [attempts: 1] — 277: pending-blow queue + _aimBlow (arm pointed from shoulder at foe headTop, club laid across crown, own blow clock, hold .45 s) + reposeNow flinch + contact hold; probe put club tips .2-.6 m from heads, but the critic saw clubs hip-high/upright on the shot frame, no hoplite recoil, knights level, rear clubs over own rank
- landed-blow-on-hit [attempts: 2] — 276: pending-blow queue landing damage at BLOW_LAND_E .3 of the drop + pressers hold the swing while closing; clubbers reached contact, but the fixed arc ends below/short of the head (board face, shins); no recoil on hoplites
- landed-blow-on-hit [attempts: 1, dropped] — 275: heavy_swing put at impact (or 0.7 through the drop) on the hit step + striker/struck re-posed via animator.update(0) after decisions; look shot: striking clubbers ~2 m off, clubs diagonal at hip/shoulder, front clubber cocked upright; no club on a red head

## Notes for next iteration (max 5 lines)
- 280 overhead-blow (8f62d4e) is IN: pending-blow queue + _aimBlow (arm straight up in the WORLD, not the trunk frame; weapon laid down onto the crown if below the fist, else BLOW_DROP under the fist) + flinch as the very last pose layer. Traps: club prop origin near the grip (reach from mesh OBB corners, ~.99 m); sim steps without rendering so headTop world matrices are stale (force-compute the mark chain); moveTo/stopMoving cut the attack anim (aim keeps its own clock). Clubbers are small (shoulder .9 m) vs hoplite heads 1.55 m: a crown blow needs the fist higher (upright trunk) or a stagger that sells it. Judge from the capture's own press_clubbers_blow; zoom probes are a different random draw.
- Every other criterion PASS (274-280); e is the only open criterion, all ranked gaps are on it (one [S] per iteration). Field oaks: theme.fieldOaks -> oakClump in addTree. mapBuilder.ts is LF, LOG.md CRLF. Hand-built up-facing quads: indices (0,1,2),(0,2,3) or they cull.
- buildHorse (jouster, pinto, secret cavalry): frame at barrel middle; legs = 4-sided wedge in a holder scaled HORSE_UPPER_DEEP in z, joint at hem - UPPER_SHOW; thick legs must stay inside hem (W>=.85 H). Drape = stadium rings (superellipse ends, flat deck profile); pinto returns before it.
- Unit PBR colours grey out in lineup shade: self-light (mf.get("cloth", c, { emissiveIntensity })). dress* in unitFactory set body.bodyMaterial.baseColor. Head is a blockHead (box): box caps (hExt.x*2.2) cover it. Eyes: body.leftEye/rightEye.setEnabled(false).
- Melee hit path: _tryAttack applies damage + hitLog at swing start (setAttackCooldown triggers the anim); decisions run on retargetInterval after unit.update, so per-frame work belongs in update(). Clubber engage ~1.96 m vs contact 1.0 m (light_melee 1.7 + pad .2). Probe recipe: temp console.log in _landMeleeBlow + a playwright script on vite preview (port 4187, build --outDir dist-probe, delete after) running gallery_press_clubbers; window.game.frameCamera zooms a frame. No [P] on rows approved within 20 iterations.
