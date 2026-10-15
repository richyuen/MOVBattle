# Loop state
Iteration: 245   Last re-audit: 245   Consecutive rejects: 0   Branch: main

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
unit-look tier 3: k l PASS, i j m-v FAIL (2/14) [S since: 0 each, except i 1 (243), v 1 (244)]
- i tribal: 1 struck (slab, 116e106, 243); 2 bone_mage grey sphere head, no antlered skull (units/tribal.bone_mage)
- j farmer: 1 farmer small green ball cap, not the tall pointed cowl (units/farmer.farmer); 2 halo over a farmer (5th), off-faction
- k ancient PASS (cleared by a5f0805, 245; crest small at lineup distance, helm close to skin value: polish, no blocker)
- l viking PASS (cleared by 312a742, 242)
- m dynasty: 1 dragon a bald big man with a black slab, no dragon-head costume (units/dynasty.dragon); 2 monk wears a halo (units/dynasty.monk)
- n renaissance: 1 jouster on a box, no horse (units/renaissance.jouster); 2 painter no palette, no two-tone doublet, all plain blue (units/renaissance.painter)
- o pirate: 1 every pirate in a black stovepipe, not bandanas/tricorns (units/pirate.flintlock, captain); 2 harpooner wears a halo
- p spooky: 1 skeleton warrior/archer fleshed men, no bone ribs/limbs (units/spooky.skeleton_warrior); 2 reaper cone hat + pole, no hooded robe or scythe blade (units/spooky.reaper)
- q wild_west: 1 cactus a man with a green plank, not the spiked suit (units/wild_west.cactus); 2 lasso on a grey box, no llama (units/wild_west.lasso)
- r legacy: 1 super_peasant in a dark wizard cone, not straw hair + sack (units/legacy.super_peasant); 2 no horse-drawn chariot (units/legacy.chariot)
- s good: 1 no white/gold accent, plain blue tunics (units/good.righteous_paladin); 2 sacred elephant grey, no gold trappings or rider (units/good.sacred_elephant)
- t evil: 1 four of seven in the same plain cone, no horns/spikes/dark armour (units/evil.void_cultist); 2 void_monarch bright yellow jewelled crown (units/evil.void_monarch)
- u secret: 1 halos repeat on 5+ units (factions/secret); 2 tree giant a plain grey block man (units/secret.tree_giant)
- v medieval: 1 struck (cross kite + bucket helm, adb58a6, 244); 2 bard purple beret, not feathered straw hat (units/medieval.bard)
maps-light tier 3: i-o all FAIL (0/7) [S since: 0 each, except l 1 (245)]
- i introduction (meadow): 1 shared pale-sage puffball ring, not dark twisted oaks; 2 no ruins/castle, generic rocks and walls (maps/meadow_medieval_1)
- j adventure (meadow): 1 pools are flat grey-blue rectangles, not water (maps/meadow_medieval_2); 2 same ring and props as introduction
- k challenge (autumn): 1 ground dusty mauve-red, not orange grass; 2 ring pale sage, not orange/red/yellow ball trees (maps/autumn_tribal_1)
- l dynasty: 1 no pink cherry trees, shared sage ring; 2 struck (pagoda + torii, 74768c1, 245)
- m renaissance: 1 no townhouses, two boxes and columns in a field; 2 sage grass, not a paved plaza (maps/renaissance_town)
- n pirate: 1 ships are olive boxes with slab sails, no masts/hulls; 2 pale puffball ring, no palms or sea (maps/pirate_beach)
- o simulation: 1 purple ground with trees and rocks, not a bare off-white plane; 2 wide tinted centre band, not one thin red line (maps/simulation)
Total tier 1 24/24; tier 2 23/24; tier 3 2/21.

## Focus (every gap this iteration)
BASE b40ef3e (re-audit 245, no flips; picks ranked 1 k and 4 maps-light.l: pairs k+v (244) and k+i (243) were repeats; no [P]: none listed as fallout)
- [S] unit-look.k team-tinted-crested-helm (a5f0805) — APPROVE, blocker 3 struck, k PASS
- [S] maps-light.l tiered-pagoda (74768c1) — APPROVE, blocker 2 struck, l FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] team-tinted-crested-helm (a5f0805) VERDICT: APPROVE CRITERION: unit-look.k PASS (previous: FAIL)
- GAP: [S] tiered-pagoda (74768c1) VERDICT: APPROVE CRITERION: maps-light.l FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] maps-light.l dynasty-cherry-ring [0] — blocker 1: dynasty-only cherry tree (crooked tan trunk, 3-5 pale pink faceted puff clusters) replacing the sage ring — ref maps/dynasty.png — ours biome_dynasty
2. [S] unit-look.m dragon-costume-head [0] — blocker 1: big faceted dragon head with horns and jaw over the man — ref units/dynasty.dragon — ours lineup_dynasty
3. [S] unit-look.i bone-mage-antler-skull [0] — blocker 2: antlered animal skull mask replacing the grey sphere head — ref units/tribal.bone_mage.png — ours lineup_tribal
4. [S] unit-look.p skeleton-bone-body [0] — blocker 1: thin bone-white limbs and rib cage chunks for skeleton warrior/archer — ref units/spooky.skeleton_warrior.png — ours lineup_spooky
5. [S] maps-light.k challenge-orange-ground [0] — blocker 1: challenge ground palette orange grass, not mauve — ref maps/autumn_tribal_1.png — ours biome_challenge
6. [S] unit-look.j farmer-pointed-cowl [0] — blocker 1: tall pointed cowl hat replacing the ball cap — ref units/farmer.farmer.png — ours lineup_farmer
7. [S] maps-light.n pirate-ship-hulls [0] — blocker 1: curved hull, mast and cloth sail replacing the olive boxes — ref maps/pirate_beach.png — ours biome_pirate
8. [R] battle-feel.e deferred [2] — deferred stands (re-audit 245); respec from trailer_3_sheet_01 r2c3 only after a new angle
(Off-list but ranked at the re-audit: [S] unit-look.v bard-feather-hat — blocker 2, ref units/medieval.bard.png: team-tinted floppy wide brim + one tall feather; [S] unit-look.j halo-gate — blocker 2, also clears m2, o2, u1.)

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
- Placement camera sits at -z (alpha -pi/2): the far edge of a biome shot is +z. Dynasty pagoda is at z 29 (outside zones); critic 245 defects: slate reads royal blue, ground storey hidden by the eave, no terrace/stairs (polish, no blocker).
- Kite boards carry a cream cross for every kite user. buildFittedHat now takes teamColor (crested_helm uses it); other fitted hats still use the unit accent.
- Tier 3 letters are separate criteria. TABS medieval.healer is bare-headed in a robe (unit-look.v candidate). mapBuilder.ts and loop files are CRLF: use Edit, not node string replace.
- capture.mjs runs the showcase first; --only looks can differ in pose from full-run frames. No [P] on rows approved within 20 iterations (incl. crested helm 245, pagoda 245).
