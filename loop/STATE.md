# Loop state
Iteration: 249   Last re-audit: 245   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220, 225, 230, 235, 240, 245):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL deferred (two [R] rejected since rewrite 240: 240, 241; re-audit 245: deferred stands, no new angle) [S since: 0, rejected since: 0, R rejected: 2 (240, 241)] B: 1 on the registered hit frame no blue club is on a red head: one club hip-high along the board line's shins, the front clubber's club bolt upright over him, a third over a downed blue man; hoplites upright, no recoil — press_clubbers_hit, press_clubbers_side; 2 red clubbers 1-3 bodies behind their own front, clubs cocked up and forward over the line (2s/2150ms) or upright (9s); none reaches a blue board — big_melee_2s, 2150ms, 9s; 3 red knights folded nearly double, one sword cocked behind the shoulder, others low at the hip; no blade meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245; ours lineup_<faction> / biome_<map>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: j k l m PASS, i n-v FAIL (4/14) [S since: 0 each, except i 1 (243), u 1 (249), v 1 (244)]
- i tribal: 1 struck (slab, 116e106, 243); 2 bone_mage grey sphere head, no antlered skull (units/tribal.bone_mage)
- j farmer PASS (cleared by d2a7e4e, 5b55a1a, 249; polish: 3 of 7 wide flat brims repeat, braids unreadable at lineup range)
- k ancient PASS (cleared by a5f0805, 245; crest small at lineup distance, helm close to skin value: polish, no blocker)
- l viking PASS (cleared by 312a742, 242)
- m dynasty PASS (cleared by a6d3c59, 7263927, 247; polish: kasa straw-yellow ~2 heads, beads small; monk has no bo staff)
- n renaissance: 1 jouster on a box, no horse (units/renaissance.jouster); 2 painter no palette, no two-tone doublet, all plain blue (units/renaissance.painter)
- o pirate: 1 every pirate in a black stovepipe, not bandanas/tricorns (units/pirate.flintlock, captain); 2 struck (bandana wrap, be09948 fallout, 249)
- p spooky: 1 skeleton warrior/archer fleshed men, no bone ribs/limbs (units/spooky.skeleton_warrior); 2 reaper cone hat + pole, no hooded robe or scythe blade (units/spooky.reaper)
- q wild_west: 1 cactus a man with a green plank, not the spiked suit (units/wild_west.cactus); 2 lasso on a grey box, no llama (units/wild_west.lasso)
- r legacy: 1 super_peasant in a dark wizard cone, not straw hair + sack (units/legacy.super_peasant); 2 no horse-drawn chariot (units/legacy.chariot)
- s good: 1 no white/gold accent, plain blue tunics (units/good.righteous_paladin); 2 sacred elephant grey, no gold trappings or rider (units/good.sacred_elephant)
- t evil: 1 four of seven in the same plain cone, no horns/spikes/dark armour (units/evil.void_cultist); 2 void_monarch bright yellow jewelled crown (units/evil.void_monarch)
- u secret: 1 struck (bandana skull wrap + robber cowboy hats, be09948, 249); 2 tree giant a plain grey block man (units/secret.tree_giant)
- v medieval: 1 struck (cross kite + bucket helm, adb58a6, 244); 2 bard purple beret, not feathered straw hat (units/medieval.bard)
maps-light tier 3: k l PASS, i j m-o FAIL (2/7) [S since: 0 each]
- i introduction (meadow): 1 shared pale-sage puffball ring, not dark twisted oaks; 2 no ruins/castle, generic rocks and walls (maps/meadow_medieval_1)
- j adventure (meadow): 1 pools are flat grey-blue rectangles, not water (maps/meadow_medieval_2); 2 same ring and props as introduction
- k challenge PASS (cleared by 812ce52, 247, e50d2f3, 248; polish: island side wall slate blue-violet, not ochre strata)
- l dynasty PASS (cleared by 466ebe1, 246; polish: dark green far bushes behind the pagoda, olive field with no green terraces/stone paths)
- m renaissance: 1 no townhouses, two boxes and columns in a field; 2 sage grass, not a paved plaza (maps/renaissance_town)
- n pirate: 1 ships are olive boxes with slab sails, no masts/hulls; 2 pale puffball ring, no palms or sea (maps/pirate_beach)
- o simulation: 1 purple ground with trees and rocks, not a bare off-white plane; 2 wide tinted centre band, not one thin red line (maps/simulation)
Total tier 1 24/24; tier 2 23/24; tier 3 6/21.

## Focus (every gap this iteration)
BASE 4e4b014 (iter 249; no re-audit; picks ranked 1 and 2, pair j+u; no [P]: none listed as fallout)
- [S] unit-look.j farmer-halo (5b55a1a) — APPROVE, blocker 2 struck, j PASS
- [S] unit-look.u secret-halos (be09948) — APPROVE, blocker 1 struck, u FAIL (fallout: o blocker 2 struck)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] farmer-halo (5b55a1a) VERDICT: APPROVE CRITERION: unit-look.j PASS (previous: FAIL)
- GAP: [S] secret-halos (be09948) VERDICT: APPROVE CRITERION: unit-look.u FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] unit-look.u tree-giant [0] — blocker 2: bark-limbed giant holding an uprooted leafy tree — ref units/secret.tree_giant — ours lineup_secret
2. [S] unit-look.o pirate-hats [0] — blocker 1: bandanas and tricorns on the crew, feathered tricorn on the captain, in place of black stovepipes — ref units/pirate.flintlock, captain — ours lineup_pirate
3. [S] unit-look.i bone-mage-skull [0] — blocker 2: antlered bone skull mask in place of the grey sphere head — ref units/tribal.bone_mage — ours lineup_tribal
4. [S] unit-look.p skeleton-bones [0] — blocker 1: rib cage and bone limb segments on skeleton_warrior/archer — ref units/spooky.skeleton_warrior — ours lineup_spooky
5. [S] unit-look.q cactus-suit [0] — blocker 1: green spiked cactus body suit — ref units/wild_west.cactus — ours lineup_wild_west
6. [S] unit-look.t cultist-variety [0] — blocker 1: horns, spikes, dark armour across void units in place of the shared cone — ref units/evil.void_cultist — ours lineup_evil
7. [S] maps-light.n pirate-ships [0] — blocker 1: hull + masts + cloth sails on the moored ships — ref maps/pirate_beach — ours biome_pirate
8. [R] battle-feel.e deferred [2] — deferred stands; respec from trailer_3_sheet_01 r2c3 only after a new angle
(Off-list: polish: farmer brims repeat 3/7, a loose cream ring in lineup_secret right background (halo special?), challenge cliff ochre strata, monk bo staff. Still open, unranked this time: maps-light.j water pools, maps-light.o bare plane, unit-look.v bard hat.)

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- [R] aimed-blow rebuild [attempts: 2] — 241: fist-mark IK + step-in + board-top fallback + hit re-pose; hit frame still shows the front club upright (cocked for his next), no visible hoplite lean, rank-back clubs fan in the air, knights over-folded
- [R] aimed-blow rebuild [attempts: 1] — 240: blow locked to the sim hit, weapon pointed from the existing fist; a low/kneeling fist jabs the club UP at the head; flinch not visible on the hit frame; rank-back men and knights get no target
- archer-brim [attempts: 1, dropped] — 237: the lineup cones are hood_liripipe, not conical_hat
- cone-brim-skirt [attempts: 1] — 235: flared skirt 1.5->2.4 heads, 0.1 deep, lighter: invisible edge-on at eye level
- aimed-club-cycle [attempts: 1] — 234: laid clubs end on the clubber's own front man, short of the foe; rank-back men need to close to reach
- rear-strike-lands [attempts: 1] — 233: aimed lay only at the landed fraction; rear club still cocked vertical between beats
- second-rank-blow [attempts: 1] — 231: beat-only strike from the rear rank; between beats the cocked hold is what stills catch
- head-fitted-hats [attempts: 1] — 229: 2-head width read; fixed brow seat covers the cone archer's eyes

## Notes for next iteration (max 5 lines)
- battle-feel.e is deferred (deferred stands at re-audit 245). 241 findings: clubbers strike from up to ~2 m, hoplites taller than clubbers, units animate BEFORE the decision loop, so the hit frame renders the pre-hit pose unless re-posed in the same step.
- Placement camera sits at -z (alpha -pi/2): far edge of a biome shot is +z. Theme passes in recolorBaseTerrain: deadenRing, blossomRing, ballRing (ring.*), autumnField (theme.field: lawn/blade glow + tuft clumps; campaign lawns otherwise keep the sandbox plum glow).
- Kite boards carry a cream cross for every kite user. buildFittedHat takes teamColor (crested_helm, pointed_cowl use it); hood_liripipe is shared by medieval archer + secret: add new hat types rather than reshaping it.
- Tier 3 letters are separate criteria. The "halos" were the bandana torus (fixed 249: fitted wrap); real halo specials remain on solar_architect/artemis. mapBuilder.ts and loop files are CRLF: use Edit.
- capture.mjs runs the showcase first; --only looks can differ in pose from full-run frames. No [P] on rows approved within 20 iterations (incl. 247-249 rows: ballRing, autumnField, pointed_cowl, sun_hat, bandana).
