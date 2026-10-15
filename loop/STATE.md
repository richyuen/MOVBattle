# Loop state
Iteration: 258   Last re-audit: 255   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-250 every 5, 255):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL deferred (two [R] rejected since rewrite 240: 240, 241; re-audits 245, 250, 255: deferred stands) [S since: 0, rejected since: 0, R rejected: 2 (240, 241)] B: 1 on the registered hit frame no blue club is on a red head: one club hip-high along the board line's shins, the front clubber's club bolt upright over him, a third over a downed blue man; hoplites upright, no recoil — press_clubbers_hit, press_clubbers_side; 2 red clubbers 1-3 bodies behind their own front, clubs cocked up and forward over the line (2s/2150ms) or upright (9s); none reaches a blue board — big_melee_2s, 2150ms, 9s; 3 red knights folded nearly double, one sword cocked behind the shoulder, others low at the hip; no blade meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245, 250, 255; ours lineup_<faction> / biome_<map>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i j k l m o q PASS, n p r-v FAIL (7/14) [S since: 0 each, except n 4 (254-257) plateau, p 3 (250, 251, 252), u 3 (249, 253, 254), v 1 (244)]
- i tribal PASS (cleared 243, 251; polish: antlers pale, staff topper)
- j farmer PASS (cleared 249; polish: brims repeat, braids unreadable)
- k ancient PASS (cleared by a5f0805, 245; polish: crest small, helm close to skin value)
- l viking PASS (cleared by 312a742, 242)
- m dynasty PASS (cleared 247; polish: beads small, monk no bo staff)
- n renaissance (plateau, 257: next pick is one [R] horse rebuild): 1-3 struck (254-256; polish: palette low, hose olive in shade, neck crosses shield's lower half in 3/4 view); 4 kept, partly addressed (8dece32, 257: bell skirt + dags, tapered legs): stilts under a lampshade: short straight frustum, no barrel/belly bulge, legs below the hem long thin poles ~2x the drop, wedges hidden under cloth, hock Z faint, hooves small; TABS deep drape to knee over a bulging barrel, thick upper leg below the hem, short cannon, big hoof (units/renaissance.jouster)
- o pirate PASS (cleared 249, 250; polish: bandana knot/tails, no vests)
- p spooky: 1 struck (f37d3bf, 250; polish: bone greyish, no studded shield); 2 narrowed (01ef730 251, 7155691 252): blade a short stepped slab hanging off a level, lance-carried snath, not a long crescent arcing over the hood (units/spooky.reaper); polish: skull/shins grey not cream
- q wild_west PASS (cleared a63efa7 256, 54c5f57 258 pinto; polish: coat tan in shade, patches on hindquarters, rope loop unseen at lineup distance, horse body small = n.4; robe a broad box)
- r legacy: 1 super_peasant in a dark wizard cone, not straw hair + sack (units/legacy.super_peasant); 2 no horse-drawn chariot (units/legacy.chariot)
- s good: 1 no white/gold accent, plain blue tunics (units/good.righteous_paladin); 2 sacred elephant grey, no gold trappings or rider (units/good.sacred_elephant)
- t evil: 1 four of seven in the same plain cone, no horns/spikes/dark armour (units/evil.void_cultist); 2 void_monarch bright yellow jewelled crown (units/evil.void_monarch)
- u secret: 1-3 struck (249, 253, 254); 3' crown two merged lobes near the ground in front, not three distinct lobes clear of it out at his flank; hood navy not maroon-brown (units/secret.tree_giant)
- v medieval: 1 struck (adb58a6, 244); 2 bard purple beret, not feathered straw hat (units/medieval.bard)
maps-light tier 3: k l n PASS, i j m o FAIL (3/7) [S since: 0 each]
- i introduction (meadow): 1 shared pale-sage puffball ring, not dark twisted oaks; 2 no ruins/castle, generic rocks and walls (maps/meadow_medieval_1)
- j adventure (meadow): 1 pools are flat grey-blue rectangles, not water (maps/meadow_medieval_2); 2 same ring and props as introduction
- k challenge PASS (cleared 247, 248; polish: island side wall slate blue-violet, not ochre strata)
- l dynasty PASS (cleared by 466ebe1, 246; polish: dark far bushes, olive field, no terraces/stone paths)
- m renaissance: 1 no townhouses, two boxes and columns in a field; 2 sage grass, not a paved plaza (maps/renaissance_town)
- n pirate PASS (cleared by [R] ddcb86b, 258: one sand, wet edge only at the waterline; polish: team-zone rectangles cooler grey, corner hill discs smooth round domes, slab hulls/short masts)
- o simulation: 1 purple ground with trees and rocks, not a bare off-white plane; 2 wide tinted centre band, not one thin red line (maps/simulation)
Total tier 1 24/24; tier 2 23/24; tier 3 10/21.

## Focus (every gap this iteration)
BASE 3f52025 (iter 258; picks ranked 1 as [R] and 3; no [P])
- [R] maps-light.n pirate-wet-rim-on-water (ddcb86b) — APPROVE, blocker 4 struck, n PASS
- [S] unit-look.q lasso-llama (54c5f57) — APPROVE, blocker 2 struck, q PASS

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [R] pirate-wet-rim-on-water (ddcb86b) VERDICT: APPROVE CRITERION: maps-light.n PASS (previous: FAIL)
- GAP: [S] lasso-llama (54c5f57) VERDICT: APPROVE CRITERION: unit-look.q PASS (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [R] unit-look.n jouster-horse-rebuild [0] — blocker 4: rebuild buildHorse's body from the jouster ref: bulging barrel, caparison to the knee over it, thick upper leg below the hem, short cannon, strong hock Z, big hooves (pinto shares the body) — ref units/renaissance.jouster — ours lineup_renaissance
2. [S] unit-look.s paladin-white-gold [0] — blocker 1: white tabard, gold trim, gold on helm and shield — ref units/good.righteous_paladin — ours lineup_good
3. [S] unit-look.t void-cultist-horns [0] — blocker 1: horned/spiked dark-armour headgear replacing the plain cone — ref units/evil.void_cultist — ours lineup_evil
4. [S] maps-light.m renaissance-townhouses [0] — blocker 1: tall coloured townhouse facades (windows, balconies, cornices) round the plaza — ref maps/renaissance_town — ours biome_renaissance
5. [S] unit-look.v bard-straw-hat [0] — blocker 2: feathered straw hat replacing the purple beret — ref units/medieval.bard — ours lineup_medieval
6. [S] unit-look.r super-peasant-straw [0] — blocker 1: straw-hair tuft and sack tunic replacing the dark wizard cone — ref units/legacy.super_peasant — ours lineup_legacy
7. [S] maps-light.o simulation-bare-plane [0] — blocker 1: bare off-white plane, no trees/rocks, purple ground removed — ref maps/simulation — ours biome_simulation
8. [S] battle-feel.e (deferred stands) — blocker 1: hit frame lands the club head on the foe's head with a recoil — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_hit
(Off-list: tree-crown-lobes (u.3'), reaper crescent (p.2). Fallout [P] lasso PINTO_COAT/_GLOW/_PATCHES (q passes; row approved 258, so a re-nudge within 20 is a ledger reversal). Open: maps-light.i/.j.)

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
- Secret giants read in lineup_secret_giants. Pirate: palmRing + seaRim + sandSpits (overWater gates the wet band; dry spits wear the lawn "grass" material). N=260 is a re-audit.
- Placement camera sits at -z: far edge of a biome shot is +z. Theme passes in recolorBaseTerrain: deadenRing, blossomRing, ballRing, autumnField. mapBuilder.ts and LOG.md are CRLF: use Edit.
- buildHorse (shared: jouster, lasso as style "pinto" via wildwest_leather, secret cavalry) lifts body.hip at build; animator keeps it as _hipRest. Unit PBR colours grey out in lineup shade: self-light (mat emissive) to keep saturation. dress* in unitFactory: set body.bodyMaterial.baseColor.
- --only looks differ in pose run to run (random id suffix shifts idle phase): make a prop read from every side. Sphere arc gap sits at -z before rotation. No [P] on rows approved within 20 iterations.
