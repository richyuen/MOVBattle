# Loop state
Iteration: 240   Last re-audit: 240   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220, 225, 230, 235, 240):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL plateau (rewritten 240; until an [R] is judged) [S since: 0, rejected since: 0, R rejected: 1 (240)] B: 1 on the registered hit frame no blue club is on a red board or head: front club hip-high along the shins, a second upright behind, a third planted by a downed man; no hoplite recoils — press_clubbers_hit, press_clubbers_side; 2 red clubbers 1-3 bodies behind their own spear front, clubs level at the waist or dragged low (2s/2150ms) or cocked upright (9s); none reaches a blue board — big_melee_2s, 2150ms, 9s; 3 red knight swords level across the chest or low at the hip, no blade meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
- h FAIL plateau (rewritten 240) [S since: 0, rejected since: 0, R rejected: 0] B: 1 red front boards lap edge over edge but all tilt the same way with one identical slat face, one depth on the strip: a row of identical tiles, not one battered surface — shield_wall_front; 2 heads over the rims are blank oversized grey domes (tribal.protector bone_mask), no eyes or face above any board — shield_wall_front, shield_wall_2500ms. Ref tabs_screenshot_06.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240; ours lineup_<faction> / biome_<map>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all FAIL (0/14) [S since: 0 each]
- i tribal: 1 protector round blue boss board + grey sphere head, not the tall wooden slab (units/tribal.protector); 2 bone_mage grey sphere head, no antlered skull (units/tribal.bone_mage)
- j farmer: 1 farmer small green ball cap, not the tall pointed cowl (units/farmer.farmer); 2 halo over a farmer (5th), off-faction
- k ancient: 1 hoplite/sarissa bareheaded, no crested helm (units/ancient.hoplite); 2 minotaur a small round blob, not a tall bull-man (units/ancient.minotaur)
- l viking: 1 valkyrie has no wings (units/viking.valkyrie); 2 horned helms read as wide grey brims (units/viking.jarl)
- m dynasty: 1 dragon a bald big man with a black slab, no dragon-head costume (units/dynasty.dragon); 2 monk wears a halo (units/dynasty.monk)
- n renaissance: 1 jouster on a box, no horse (units/renaissance.jouster); 2 painter no palette, no two-tone doublet, all plain blue (units/renaissance.painter)
- o pirate: 1 every pirate in a black stovepipe, not bandanas/tricorns (units/pirate.flintlock, captain); 2 harpooner wears a halo
- p spooky: 1 skeleton warrior/archer fleshed men, no bone ribs/limbs (units/spooky.skeleton_warrior); 2 reaper cone hat + pole, no hooded robe or scythe blade (units/spooky.reaper)
- q wild_west: 1 cactus a man with a green plank, not the spiked suit (units/wild_west.cactus); 2 lasso on a grey box, no llama (units/wild_west.lasso)
- r legacy: 1 super_peasant in a dark wizard cone, not straw hair + sack (units/legacy.super_peasant); 2 no horse-drawn chariot (units/legacy.chariot)
- s good: 1 no white/gold accent, plain blue tunics (units/good.righteous_paladin); 2 sacred elephant grey, no gold trappings or rider (units/good.sacred_elephant)
- t evil: 1 four of seven in the same plain cone, no horns/spikes/dark armour (units/evil.void_cultist); 2 void_monarch bright yellow jewelled crown (units/evil.void_monarch)
- u secret: 1 halos repeat on 5+ units (factions/secret); 2 tree giant a plain grey block man (units/secret.tree_giant)
- v medieval: 1 knight plain kite board no cross, small capped helm (units/medieval.knight); 2 bard purple beret, not feathered straw hat (units/medieval.bard)
maps-light tier 3: i-o all FAIL (0/7) [S since: 0 each]
- i introduction (meadow): 1 shared pale-sage puffball ring, not dark twisted oaks; 2 no ruins/castle, generic rocks and walls (maps/meadow_medieval_1)
- j adventure (meadow): 1 pools are flat grey-blue rectangles, not water (maps/meadow_medieval_2); 2 same ring and props as introduction
- k challenge (autumn): 1 ground dusty mauve-red, not orange grass; 2 ring pale sage, not orange/red/yellow ball trees (maps/autumn_tribal_1)
- l dynasty: 1 no pink cherry trees, shared sage ring; 2 pagoda a flat white box, no tiered roof or torii (maps/dynasty)
- m renaissance: 1 no townhouses, two boxes and columns in a field; 2 sage grass, not a paved plaza (maps/renaissance_town)
- n pirate: 1 ships are olive boxes with slab sails, no masts/hulls; 2 pale puffball ring, no palms or sea (maps/pirate_beach)
- o simulation: 1 purple ground with trees and rocks, not a bare off-white plane; 2 wide tinted centre band, not one thin red line (maps/simulation)
Total tier 1 24/24; tier 2 22/24; tier 3 0/21.

## Focus (every gap this iteration)
BASE 36ac3f1 (re-audit 240; picks: top [R] + top ordinary [S])
- [S] unit-look.h healer-cowl (810f6c6, fixup 7edd279) — APPROVE, unit-look.h PASS
- [R] battle-feel.e aimed-blow rebuild (49c84f2, reverted ea8aeaf) — REJECT, no blocker struck

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] unit-look.h healer-cowl (810f6c6) VERDICT: APPROVE CRITERION: unit-look.h PASS (previous: FAIL) CLEARED BY: 810f6c6
- GAP: [R] battle-feel.e aimed-blow rebuild (49c84f2) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [R] battle-feel.e aimed blow over the man [1] — blockers 1-3: fist solved to a point ABOVE and ahead of the struck head (not from where the fist is), club 40-60 deg below level onto head/board top; a root lean-back impulse on the struck man visible on the hit frame; rank-back clubbers and knights take a target across their own front within reach + 1 body — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_hit, big_melee_2150ms, closeup_weapon_reads
2. [R] battle-feel.h wall-surface rebuild [0] — blockers 1-2: per-man board yaw/tilt/height scatter on a lapped surface, faces (eyes) over the rims — ref tabs_screenshot_06 — ours shield_wall_front
3. [S] unit-look.l viking-horned-helm [0] — blocker 2: domed iron cap with two upturned horns (+ faceted beard chunk) — ref factions/viking.jpg, units/viking.jarl.jpg — ours lineup_viking
4. [S] maps-light.n pirate-palms [0] — blocker 2: palm-tree ring props and a turquoise shallows band at the edge, pale sand field — ref maps/pirate_beach.png — ours biome_pirate
5. [S] unit-look.k ancient-crested-helm [0] — blocker 1: crested helm on hoplite/sarissa (critic also flags boards held flat like trays: aspis upright on the forearm) — ref units/ancient.hoplite.jpg — ours lineup_ancient
6. [S] unit-look.m dragon-head [0] — blocker 1: oversized faceted red dragon-head costume over head and shoulders — ref units/dynasty.dragon.jpg — ours lineup_dynasty
7. [S] unit-look.p skeleton-body [0] — blocker 1: bone body (rib cage, thin bone limbs, skull) for skeleton_warrior/archer — ref units/spooky.skeleton_warrior.png — ours lineup_spooky
8. [S] maps-light.l cherry-ring [0] — blocker 1: pink blossom crowns and twisted trunks for the dynasty ring — ref maps/dynasty.png — ours biome_dynasty

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- [R] aimed-blow rebuild [attempts: 1] — 240: blow locked to the sim hit, weapon pointed from the existing fist; a low/kneeling fist jabs the club UP at the head; flinch not visible on the hit frame; rank-back men and knights get no target
- archer-brim [attempts: 1, dropped] — 237: the lineup cones are hood_liripipe, not conical_hat
- cone-brim-skirt [attempts: 1] — 235: flared skirt 1.5->2.4 heads, 0.1 deep, lighter: invisible edge-on at eye level
- aimed-club-cycle [attempts: 1] — 234: laid clubs end on the clubber's own front man, short of the foe; rank-back men need to close to reach
- rear-strike-lands [attempts: 1] — 233: aimed lay only at the landed fraction; rear club still cocked vertical between beats
- second-rank-blow [attempts: 1] — 231: beat-only strike from the rear rank; between beats the cocked hold is what stills catch
- head-fitted-hats [attempts: 1] — 229: 2-head width read; fixed brow seat covers the cone archer's eyes
- body-spaced-slots [attempts: 1] — 228: lateral slot pitch from body width opens board gaps; merging is front-to-back

## Notes for next iteration (max 5 lines)
- Tier 3 is now scored and pickable (its tier 2s are 3/4 or better: unit-look 3/4, maps-light 4/4); each tier-3 letter is its own criterion, so two tier-3 [S] picks on different letters are two different criteria.
- press_clubbers_hit is shot on the sim frame a clubber's blow registered (hit log): a club off its target there is the pose; tell the critic. shield_wall: blue = ancient.hoplite, red = tribal.protector.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced; boards ride the rank strip at 0.62 of neck height; shield arm aims at the board back (_gripBoard). battle-feel.e: contact clubbers go limp 0.8-0.98 when toppled by braced hoplites, overriding the club pose.
- unit-look tier 2 now 4/4. Critic: TABS medieval.healer is bare-headed in a robe; ours shares the archer cowl (unit-look.v candidate). LEDGER rows last touched before 215 dropped at 240 (wall frame/board strip/grip, brace, spear, mammoth; dress idea spent).
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. .gitattributes normalises EOL to LF on commit. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave; skip [P]s on rows approved within 20 iterations.
