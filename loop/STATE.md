# Loop state
Iteration: 300   Last re-audit: 300   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-300):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL plateau (list written by re-audit 295, kept at 300) [S since: 4 (296 3dd543e, 297 18ad559, 298 83a42ef, 300 7f84d8e); rejected since: 1 (299 d33a3d5 kept)] B: 1 no big_melee frame shows a club landed on a board top or head: big_melee_5s halo man's club held forward and up over the blue pile; big_melee_9s clubs level at shoulder and shin height; a walking-in red clubber far right of big_melee_2s/2150ms carries his club upright; press_clubbers_blow the club now ends on the thrown hoplite (7f84d8e) but comes in level at belly height, not down onto the board top — TABS r2c3 the club arcs down through the man and stops on him; 2 big_melee_2s/2150ms: red clubbers 1-3 bodies behind their front carry clubs cocked over the shoulder and never swing; 3 closeup_weapon_reads: no red knight's blade meets a body, the raised sword held behind the head with a bent arm, nothing follows through — TABS r3c1 arm cocked well back over the shoulder, then committed forward; 4 press_clubbers_blow: the thrown hoplite goes over head-first, face down — TABS r2c3 back seat-first, legs swinging up. Ref trailer_3_sheet_01 r2c3, r3c1
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-300; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i PASS j PASS k PASS l PASS m PASS n PASS o PASS p FAIL (7/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294; m cce136e 296)
- p swordcaster (list rewritten by re-audit 300; plateau cleared by [R] 1f14c83) [S since: 0] B: struck 1-3 (1f14c83: ring of 6 upright blades, the missile lifted out of it point-first, elbows-out hug on the box ends); 4 throw_casters_release/flight: the blade lifted out of the ring hangs at knee/shin height, already turned near-flat over the grass, reads as a sword dropped in the turf and flies off low — TABS the airborne blade rides up at head height above the ring (units/spooky.swordcaster.jpg). Also noted: ring blades ~.7 H, tallest TABS blades stand well over his head; box a bit high (chest to belt)
Total tier 1 24/24; tier 2 23/24; tier 3 28/29.

## Focus (every gap this iteration)
BASE 776e273 (iter 300; re-audit done first, no flips; no [P] fallout listed)
- [S] press-club-lands-on-board (battle-feel.e blocker 1) — 7f84d8e — APPROVE (e stays FAIL; 4th approved [S] since list: now plateau)
- [R] swordcaster-blade-ring (vfx.p blockers 1-3) — 1f14c83 — APPROVE (1-3 struck, 4 added; plateau cleared)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] press-club-lands-on-board (7f84d8e) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [R] swordcaster-blade-ring (1f14c83) VERDICT: APPROVE CRITERION: vfx.p FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e press-landed-in-melee — blocker 1: route every in-reach heavy_swing (not only press-marked) through _contactOn so free-melee clubs end on a board top or crown — ref trailer_3_sheet_01 r2c3 — ours big_melee_9s (battle-feel.e is plateau: take as part of an [R])
2. [S] battle-feel.e thrown-seat-first — blocker 4: pivot the blow throw about the hips so the seat leads and the legs swing up — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_blow
3. [S] battle-feel.e knight-overhead-cock — blocker 3: sword windup cocks the arm well back over the shoulder, then drives forward through the man's body line to a follow-through — ref trailer_3_sheet_01 r3c1 — ours closeup_weapon_reads
4. [S] battle-feel.e rear-rank-clubs-swing — blocker 2: clubbers 1-3 bodies back with an enemy within reach plus one body take overhead swings over their front man's shoulder — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s
5. [S] vfx.p ring-sword-rises — blocker 4: the hovering ring blade rises from its guard point to over-head height while it turns onto the man, then flies point-first from there — ref units/spooky.swordcaster.jpg — ours throw_casters_release

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- press-landed-contact [S] [attempts: 1, rejected-kept] — 299: _contactOn (crown or near-face board top) for the landed press arc + _aimBlow follow ends on board top; critic: 5s club head in the air over the pile, 9s clubs at hip/shin height. Code kept (d33a3d5)
- lockbox-grip-centre [P] [attempts: 1] — 298: LOCKBOX_CARRY turn .8 out .25; box still ~1/4 width off-centre (placed from hands' midpoint, arms asymmetric)
- press-blow-rebuild [R] [attempts: 1] — 294: one _pressStrike pose for clubs + blades (cock: fist behind head, weapon back over shoulder; land: IK arm at struck man's crown), blade_slash windup to the cock, REAR_RANK_REACH 2.4. Critic: rear rank holds the cock all beat, front man ~2 bodies off so club stops in the air; knights land on men 3-5 m off
- press-second-rank-blow [attempts: 1] — 293: over-rank pending blow (REAR_RANK_REACH band + _allyBetween) + BLOW_STEP 1.3 hip lunge; no shot shows a club landing over a rank
- press-blow-in-crowd [attempts: 1, dropped] — 292: shield-wall break where a board-less melee man stands in the row + queue skip; rank-1 clubbers still >1 m behind protectors
- press-blow-off-feet [attempts: 1, dropped; approved on 2nd at 291] — 290: no capture framing showed the laid-out body
- press-throw-airborne [attempts: 1, dropped] — 288: fixed min lift 4.4 / back 1.6 m/s on the blow throw; struck man hidden in both press shots
- press-blow-lands [attempts: 2, rejected-kept] — 287: non-topple blow throw (THROWN pose); critic saw no hoplite airborne or arms-out. Code kept

## Notes for next iteration (max 5 lines)
- 301 picks: battle-feel.e is plateau (4 approved [S] since its 295 list): only one [R] on it, spec'd from trailer_3_sheet_01 r2c3/r3c1, clearing >= 2 of its 4 blockers (e.g. one blow mechanism for every in-reach heavy_swing + rear-rank swing, or + seat-first throw). Second pick: [S] vfx.p ring-sword-rises.
- Ring: propBuilder buildSwordRing on body.root (name swordRing, children ringSword, metadata restY/phase/refillIn); launchRingSword hides the nearest; animator _tendSwordRing bobs/refills/hides on death; projectileSystem hover turns point-up -> man over SWORD_TURN_IN, size option. Lift the hover in projectileSystem's hover branch.
- Press club: _contactOn now pins the head at full reach on the man's near face (CONTACT_LOWEST .6); _aimBlow landing + follow use it. Only marked press beats / sim swings with aimBlowAt get it; free-melee clubs in big_melee do not.
- Focus capture ~3 min; `--only a,b` takes a comma list. melee_club_drop times out on render-ready but the frame is complete. Python/node file edits: keep each file's EOL.
- No [P] on rows approved within 20 iterations, except critic fallout. Probe pattern: playwright via createRequire(loop/scripts/package.json), vite preview on 4199.
