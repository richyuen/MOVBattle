# Loop state
Iteration: 264   Last re-audit: 260   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-260 every 5):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL deferred (two [R] rejected since rewrite 240: 240, 241; re-audits 245-260: deferred stands) [S since: 0, rejected since: 0, R rejected: 2 (240, 241)] B: 1 on the registered hit frame no blue club is on a red head: one club hip-high along the board line's shins, the front clubber's club bolt upright over him, a third over a downed blue man; hoplites upright, no recoil — press_clubbers_hit, press_clubbers_side; 2 red clubbers 1-3 bodies behind their own front, clubs cocked up and forward over the line (2s/2150ms) or upright (9s); none reaches a blue board — big_melee_2s, 2150ms, 9s; 3 red knights folded nearly double, one sword cocked behind the shoulder, others low at the hip; no blade meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-260; ours lineup_<faction> / biome_<map>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i j k l m o q r s v PASS, n p t u FAIL (10/14) [S since: 0 each, except n 2 (260, 262; 4' written 259), p 3 (250, 251, 252), t 2 (262, 263), u 3 (249, 253, 254)]
- i tribal PASS (cleared 243, 251; polish: antlers pale, staff topper)
- j farmer PASS (cleared 249; polish: brims repeat, braids unreadable)
- k ancient PASS (cleared by a5f0805, 245; polish: crest small, helm close to skin value)
- l viking PASS (cleared by 312a742, 242)
- m dynasty PASS (cleared 247; polish: beads small, monk no bo staff)
- n renaissance: 1-3 struck (254-256; polish: palette low, hose olive in shade, neck crosses shield at chest height); 4' narrowed by 67f0425 (260); 4''(a) struck by 34d65d5 (262: ~48% leg under a level hem, stadium drape); 4''(b) drape back rounds into a dome at the shoulders, body reads about as tall as long (tub), not a long low flat-backed box with a hard shoulder edge and overhanging ends (units/renaissance.jouster); polish: dags grey-white not cream, horse head a flat brown plank
- o pirate PASS (cleared 249, 250; polish: bandana knot/tails, no vests)
- p spooky: 1 struck (f37d3bf, 250; polish: bone greyish, no studded shield); 2 narrowed (01ef730 251, 7155691 252): blade a short stepped slab hanging off a level, lance-carried snath, not a long crescent arcing over the hood (units/spooky.reaper); polish: skull/shins grey not cream
- q wild_west PASS (cleared a63efa7 256, 54c5f57 258 pinto; still PASS after 67f0425, but pinto legs now flat tan planks, untapered, tiny hooves: give the pinto its own tapered leg; polish: coat tan in shade, rope loop unseen; robe a broad box)
- r legacy PASS (cleared 7b0fb2a 263, 971918b 264 chariot; polish: chariot hidden behind giant in lineup, driver bare (no crested galea/scutum), car a plain drum (no laurel), horse barrel three lumps, gait a trot; straw saturated gold)
- s good PASS (cleared 67760f2 259, 5c7d65b 261; polish: elephant keeps mammoth column legs/forward tusks, blanket pale with no device, rider stiff with floating bow, throne back low; paladin arms white, kite+cross shield, gold lemon)
- t evil: 1'' (cultist 792620c 262; shadow_walker, death_bringer b28d051 263) mad_mechanic and tempest_lich still in plain hoods, no horns/spikes/branch crown/dark armour (units/evil.tempest_lich); polish: walker sleeves dark not team arms, spikes small; bringer skull a white cube, no jaw tilt; 2 void_monarch bright yellow jewelled crown (units/evil.void_monarch); polish: cultist robe bands pale blue-white
- u secret: 1-3 struck (249, 253, 254); 3' crown two merged lobes near the ground in front, not three distinct lobes clear of it out at his flank; hood navy not maroon-brown (units/secret.tree_giant)
- v medieval PASS (cleared adb58a6 244, 507a3fe 264 feather hat; polish: feather thin and pale, straw grey-beige not salmon-tan, brim flat)
maps-light tier 3: k l n o PASS, i j m FAIL (4/7) [S since: 0 each]
- i introduction (meadow): 1 shared pale-sage puffball ring, not dark twisted oaks; 2 no ruins/castle, generic rocks and walls (maps/meadow_medieval_1)
- j adventure (meadow): 1 pools are flat grey-blue rectangles, not water (maps/meadow_medieval_2); 2 same ring and props as introduction
- k challenge PASS (cleared 247, 248; polish: island side wall slate blue-violet, not ochre strata)
- l dynasty PASS (cleared by [R] 466ebe1, 246; polish: dark far bushes, olive field, no terraces/stone paths)
- m renaissance: 1 no townhouses, two boxes and columns in a field; 2 sage grass, not a paved plaza (maps/renaissance_town)
- n pirate PASS (cleared by [R] ddcb86b, 258; polish: team-zone rectangles cooler grey, corner hill discs smooth domes, slab hulls/short masts)
- o simulation PASS (cleared bd1653a 260, e54ee13 261; polish: plane cool lavender not warm cream (do not re-nudge colours, row 260), grey void-hazard disc the only object, line a bit wide/red vs thin magenta)
Total tier 1 24/24; tier 2 23/24; tier 3 14/21.

## Focus (every gap this iteration)
BASE 2bec940 (iter 264; picks ranked 1 and 4, ranks 2-3 would repeat pair r,t; [P] straw-pale-tan skipped: ledger reversal of a 263 row; evidence 264.0 closeup_legacy_chariot)
- [S] unit-look.r legacy-chariot (971918b) — APPROVE, r PASS (2 struck)
- [S] unit-look.v bard-feather-hat (507a3fe) — APPROVE, v PASS (2 struck)


## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] legacy-chariot (971918b) VERDICT: APPROVE CRITERION: unit-look.r PASS (previous: FAIL)
- GAP: [S] bard-feather-hat (507a3fe) VERDICT: APPROVE CRITERION: unit-look.v PASS (previous: FAIL)


## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] unit-look.t evil-lich-mechanic-horns [0] — blocker 1'': tempest_lich and mad_mechanic through HORNED_EVIL (branch-spike crown, ragged dark robe) — ref units/evil.tempest_lich — ours lineup_evil
2. [S] unit-look.t monarch-dark-crown [0] — blocker 2: dark spiked crown, bone armour, dark cloth replacing the yellow jewelled crown — ref units/evil.void_monarch — ours lineup_evil
3. [S] unit-look.p reaper-crescent [0] — blocker 2: long crescent arcing over the hood — ref units/spooky.reaper — ours lineup_spooky
4. [S] unit-look.n jouster-flat-drape [0] — blocker 4''(b): long low flat-backed box, hard shoulder edge — ref units/renaissance.jouster — ours lineup_renaissance
5. [S] unit-look.u tree-giant-crown-lobes [0] — blocker 3': three distinct crown lobes clear of the ground at his flank, maroon-brown hood — ref units/secret.tree_giant — ours lineup_secret_giants
6. [S] maps-light.m renaissance-townhouses [0] — blocker 1: half-timbered townhouses round a plaza — ref maps/renaissance_town — ours biome_renaissance
7. [S] maps-light.i meadow-oaks [0] — blocker 1: dark twisted oak ring replacing the sage puffballs — ref maps/meadow_medieval_1 — ours biome_introduction
8. [S] battle-feel.e (deferred stands) — registered hit frame lands the club on a head — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_hit
(Off-list: chariot driver galea/scutum + car laurel (r polish), feather_hat FEATHER_WIDE .6 / straw warmer ([P] fallout of 507a3fe, but a ledger reversal within 20), adventure water (j.1), pinto tapered legs (q polish), elephant tusks (s polish).)


## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- [R] aimed-blow rebuild [attempts: 2] — 241: fist-mark IK + step-in + board-top fallback + hit re-pose; hit frame still shows the front club upright, no hoplite lean, rank-back clubs fan in the air, knights over-folded
- [R] aimed-blow rebuild [attempts: 1] — 240: blow locked to the sim hit, weapon pointed from the existing fist; a low/kneeling fist jabs the club UP at the head; flinch not visible on the hit frame
- archer-brim [attempts: 1, dropped] — 237: the lineup cones are hood_liripipe, not conical_hat
- cone-brim-skirt [attempts: 1] — 235: flared skirt 1.5->2.4 heads, 0.1 deep, lighter: invisible edge-on at eye level
- aimed-club-cycle [attempts: 1] — 234: laid clubs end on the clubber's own front man, short of the foe
- rear-strike-lands [attempts: 1] — 233: aimed lay only at the landed fraction; rear club still cocked vertical between beats
- second-rank-blow [attempts: 1] — 231: beat-only strike from the rear rank; between beats the cocked hold is what stills catch

## Notes for next iteration (max 5 lines)
- battle-feel.e deferred. 241 findings: clubbers strike from up to ~2 m, hoplites taller than clubbers, units animate BEFORE the decision loop, so the hit frame renders the pre-hit pose unless re-posed in the same step.
- Next re-audit 265. buildChariot (264) is a rig shifted -0.5 z with a seg(a,b) tapered-limb helper; driver = operator under a stand scaled CHARIOT_DRIVER 2.3; closeup_legacy_chariot shot added. Simulation: theme.bare -> barePlane + bareCentreLine (no zone guides); plane colour barely responds to ground/fog/emissive at the placement height (tried 261, reverted). mapBuilder.ts and LOG.md are CRLF: use Edit.
- buildHorse (jouster, lasso "pinto", secret cavalry): frame at barrel middle; legs = 4-sided wedge in a holder scaled HORSE_UPPER_DEEP in z, joint at hem - UPPER_SHOW; thick legs must stay inside hem (W>=.85 H). Lineup horse pose varies run to run; crop the look PNG (System.Drawing) to judge legs.
- Unit PBR colours grey out in lineup shade: self-light (mat emissive). dress* in unitFactory: set body.bodyMaterial.baseColor; dressPaladin also whitens arms (bodyMaterial) - restore skin on arm meshes for s polish. Head is a blockHead (box, non-uniform scaled): spheres sized off its extents leave corners bare; box caps/skulls (hExt.x*2.2) cover it. Eyes: body.leftEye/rightEye.setEnabled(false).
- HORNED_EVIL table (263) dresses evil units via dressHornedEvil (hat none; horn = head-local point path via taperedPath). Extend it for lich/mechanic. dressSuperPeasant: straw box cap + locks. No [P] on rows approved within 20 iterations.
