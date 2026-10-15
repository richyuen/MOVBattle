# Loop state
Iteration: 253   Last re-audit: 250   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220, 225, 230, 235, 240, 245, 250):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL deferred (two [R] rejected since rewrite 240: 240, 241; re-audit 245: deferred stands, no new angle) [S since: 0, rejected since: 0, R rejected: 2 (240, 241)] B: 1 on the registered hit frame no blue club is on a red head: one club hip-high along the board line's shins, the front clubber's club bolt upright over him, a third over a downed blue man; hoplites upright, no recoil — press_clubbers_hit, press_clubbers_side; 2 red clubbers 1-3 bodies behind their own front, clubs cocked up and forward over the line (2s/2150ms) or upright (9s); none reaches a blue board — big_melee_2s, 2150ms, 9s; 3 red knights folded nearly double, one sword cocked behind the shoulder, others low at the hip; no blade meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245, 250; ours lineup_<faction> / biome_<map>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i j k l m o PASS, n p-v FAIL (6/14) [S since: 0 each, except p 3 (250, 251, 252), u 2 (249, 253), v 1 (244)]
- i tribal PASS (cleared 243, 251; polish: antlers pale, staff topper)
- j farmer PASS (cleared 249; polish: brims repeat, braids unreadable)
- k ancient PASS (cleared by a5f0805, 245; crest small at lineup distance, helm close to skin value: polish, no blocker)
- l viking PASS (cleared by 312a742, 242)
- m dynasty PASS (cleared 247; polish: beads small, monk no bo staff)
- n renaissance: 1 jouster on a box, no horse (units/renaissance.jouster); 2 painter no palette, no two-tone doublet, all plain blue (units/renaissance.painter)
- o pirate PASS (cleared 249, 250; polish: bandana knot/tails, no vests)
- p spooky: 1 struck (f37d3bf, 250; polish: bone greyish, no studded round shield); 2 narrowed (01ef730 251, 7155691 252: cowl opens on the face, skull+jaw+bead eye, hem at mid-shin): blade a short stepped slab hanging off a level, lance-carried snath, not a long crescent arcing over the hood (units/spooky.reaper); polish: skull/shins grey not cream
- q wild_west: 1 cactus a man with a green plank, not the spiked suit (units/wild_west.cactus); 2 lasso on a grey box, no llama (units/wild_west.lasso)
- r legacy: 1 super_peasant in a dark wizard cone, not straw hair + sack (units/legacy.super_peasant); 2 no horse-drawn chariot (units/legacy.chariot)
- s good: 1 no white/gold accent, plain blue tunics (units/good.righteous_paladin); 2 sacred elephant grey, no gold trappings or rider (units/good.sacred_elephant)
- t evil: 1 four of seven in the same plain cone, no horns/spikes/dark armour (units/evil.void_cultist); 2 void_monarch bright yellow jewelled crown (units/evil.void_monarch)
- u secret: 1 struck (be09948, 249); 2 struck (b6f7350, 253: hooded bearded woodsman, teal tunic, rope belt, rag skirt, carried tree); 3 tree carried level at shoulder height out to the side: crown a big olive blob hiding the lineup_secret centre and sunk into the samurai giant in lineup_secret_giants; TABS holds it low diagonal across the hip, crown forward at its own side (units/secret.tree_giant); polish: crown lobes merge, hood navy not maroon-brown
- v medieval: 1 struck (cross kite + bucket helm, adb58a6, 244); 2 bard purple beret, not feathered straw hat (units/medieval.bard)
maps-light tier 3: k l PASS, i j m-o FAIL (2/7) [S since: 0 each, except n 2 (252, 253)]
- i introduction (meadow): 1 shared pale-sage puffball ring, not dark twisted oaks; 2 no ruins/castle, generic rocks and walls (maps/meadow_medieval_1)
- j adventure (meadow): 1 pools are flat grey-blue rectangles, not water (maps/meadow_medieval_2); 2 same ring and props as introduction
- k challenge PASS (cleared by 812ce52, 247, e50d2f3, 248; polish: island side wall slate blue-violet, not ochre strata)
- l dynasty PASS (cleared by 466ebe1, 246; polish: dark green far bushes behind the pagoda, olive field with no green terraces/stone paths)
- m renaissance: 1 no townhouses, two boxes and columns in a field; 2 sage grass, not a paved plaza (maps/renaissance_town)
- n pirate: 1 struck (af8ccfc, 252; polish: sails not furled, masts short, slab hull, no gold sheer stripe); 2 narrowed (bcf648c 253: palms, sea, ships in water): pale-sage puffballs still about half the ring (top arc, both flanks), TABS palms + dark broadleaf bushes only; 3 ring palms/puffballs/rocks stand in open turquoise water, sand a hard rectangle; TABS sand beaches/spits with irregular edges carry the palms, water in the coves (maps/pirate_beach)
- o simulation: 1 purple ground with trees and rocks, not a bare off-white plane; 2 wide tinted centre band, not one thin red line (maps/simulation)
Total tier 1 24/24; tier 2 23/24; tier 3 8/21.

## Focus (every gap this iteration)
BASE 868fca2 (iter 253; picks ranked 1 and 3, rank 2 skipped to avoid repeating pair p+n; no [P]: none listed as fallout; evidence 89d4360 adds lineup_secret_giants)
- [S] maps-light.n pirate-palms-and-sea (bcf648c) — APPROVE, blocker 2 narrowed, 3 added, n FAIL
- [S] unit-look.u tree-giant-woodsman-and-tree (b6f7350) — APPROVE, blocker 2 struck, 3 added, u FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] pirate-palms-and-sea (bcf648c) VERDICT: APPROVE CRITERION: maps-light.n FAIL (previous: FAIL)
- GAP: [S] tree-giant-woodsman-and-tree (b6f7350) VERDICT: APPROVE CRITERION: unit-look.u FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] unit-look.u tree-hip-carry [0] — blocker 3: re-rig tree_club carry to a low diagonal hip grip, crown forward within the giant's footprint — ref units/secret.tree_giant — ours lineup_secret, lineup_secret_giants
2. [S] maps-light.n pirate-sand-spits [0] — blocker 3: faceted sand mounds/spits under the ring trees in the sea band, irregular sand edge to the field — ref maps/pirate_beach — ours biome_pirate
3. [S] maps-light.n pirate-full-palm-ring [0] — blocker 2: replace remaining puffballs with palms and dark broadleaf bushes (a bush form in palmRing, not a share tweak) — ref maps/pirate_beach — ours biome_pirate
4. [S] unit-look.n jouster-horse [0] — blocker 1: faceted horse under the jouster, lance — ref units/renaissance.jouster — ours lineup_renaissance
5. [S] unit-look.q cactus-spiked-suit [0] — blocker 1: green cactus body suit with spike cones and arms — ref units/wild_west.cactus — ours lineup_wild_west
6. [S] maps-light.m renaissance-townhouses [0] — blocker 1: ring of tall gabled townhouses round the field — ref maps/renaissance_town — ours biome_renaissance
7. [S] unit-look.p reaper-crescent-blade [0] — blocker 2: long crescent blade arcing over the hood on an upright snath — ref units/spooky.reaper — ours lineup_spooky
8. [R] battle-feel.e deferred [2] — deferred stands; wait for a re-audit
(Off-list polish: reaper skull/shins cream; ship sails furled, gold sheer stripe; bone_staff antlered topper; bandana knot/tails; farmer brims; monk bo staff. Still open: unit-look.t void cultist, .v bard hat; maps-light.i oaks/ruins, .j pools, .o simulation plane.)

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
- battle-feel.e is deferred (deferred stands at re-audits 245, 250). 241 findings: clubbers strike from up to ~2 m, hoplites taller than clubbers, units animate BEFORE the decision loop, so the hit frame renders the pre-hit pose unless re-posed in the same step.
- Secret lineup (8x5) leaves its front rank right of the shogun out of frame: tree/ice giants read in lineup_secret_giants (gallery_secret_giants, 253). Pirate theme: ring.palms (palmRing) + sea (seaRim + opaque hazard pools), sea meshes kept out of the glow layer (they bloomed a haze).
- Placement camera sits at -z (alpha -pi/2): far edge of a biome shot is +z. Theme passes in recolorBaseTerrain: deadenRing, blossomRing, ballRing (ring.*), autumnField (theme.field: lawn/blade glow + tuft clumps; campaign lawns otherwise keep the sandbox plum glow).
- Tier 3 letters are separate criteria. buildFittedHat takes teamColor; hood_liripipe is shared by medieval archer + secret: add new hat types rather than reshaping it. mapBuilder.ts and loop files are CRLF: use Edit.
- capture.mjs runs the showcase first; --only looks differ in pose run to run (random unit-id suffix shifts the idle phase): make a prop read from every side. Sphere arc gaps: CreateSphere arc gap sits at -z before rotation; reaper cowl needed rotation.y = -pi/2 + pi*open (252). No [P] on rows approved within 20 iterations (incl. 247-253 rows). Body mesh _yoke is the trunk hull: hide it to thin a body. Probe trick: temporarily expose scene on window in main.ts, build, read mesh world positions with playwright from loop/node_modules; revert.
