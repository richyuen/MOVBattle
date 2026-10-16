# Loop state
Iteration: 295   Last re-audit: 295   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-295):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL (list rewritten by re-audit 295; plateau cleared; [R] count reset) [S since: 0; rejected since: 0] B: 1 big_melee_5s/9s: no club ever comes down onto a blue board or head: at 5s two red clubs stand straight up over the heads and stay; at 9s clubs run level at chest height into the blue pile — TABS r2c3 the club arcs down through the man and he is thrown; 2 big_melee_2s/2150ms: red clubbers 1-3 bodies behind their front carry clubs level over the shoulder, never wind up or swing; only the front man acts; 3 closeup_weapon_reads: no red knight's blade meets a body; the one raised sword is held behind the head with a bent arm, nothing follows through — TABS r3c1 arm cocked well back over the shoulder, then committed forward; 4 press_clubbers_hit/blow: at contact the club lies level at the hoplite's hip, not coming down from overhead; the thrown man goes over head-first, face to the ground — TABS r2c3 back seat-first, legs swinging up. Ref trailer_3_sheet_01 r2c3, r3c1
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-295; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i PASS j PASS k PASS l PASS m FAIL n PASS o PASS p FAIL (6/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294)
- m dynamite_thrower [S since: 2 (284 345314d, 295 e3ac0a5)] B: struck 1-3; 4 struck in part (e3ac0a5: 3x2 block of separate sticks, two broad black straps, hip to chest, same block flies); remaining: the fuse is a pale unlit stub in throw_bombs_release and throw_bombs_flight; TABS a glowing orange-white point at the fuse tip (units/wild_west.dynamite_thrower.jpg)
- p swordcaster [S since: 2 (288 462b2dc, 295 1cbd0b1)] B: struck 1 (462b2dc); 2 struck in part (1cbd0b1: hand sword replaced by a dark iron lockbox with straps and keyhole plate); remaining: the chest rides out at his side at hip height, not square across the belly between both hands (throw_casters_release, lineup_spooky); one sword at a time, no 5-6 blades standing point-up round him (throw_casters_flight); TABS chest at the belly in both hands, ring of upright blades (units/spooky.swordcaster.jpg)
Total tier 1 24/24; tier 2 23/24; tier 3 27/29.

## Focus (every gap this iteration)
BASE bbca232 (iter 295; re-audit ran first, no flips)
- [S] dynamite-big-bundle (vfx.m blocker 4) — e3ac0a5 — APPROVE (vfx.m stays FAIL, 4 trimmed to the lit fuse)
- [S] swordcaster-lockbox (vfx.p blocker 2) — 1cbd0b1 — APPROVE (vfx.p stays FAIL, 2 trimmed to belly carry + blade ring)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] dynamite-big-bundle (e3ac0a5) VERDICT: APPROVE CRITERION: vfx.m FAIL (previous: FAIL)
- GAP: [S] swordcaster-lockbox (1cbd0b1) VERDICT: APPROVE CRITERION: vfx.p FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e club-overhead-drop — blocker 1: general club/mace melee attack gets a raise-over-head windup that drops onto the target's head or board at hit time (reuse _aimBlow overhead path outside the press) — ref trailer_3_sheet_01 r2c3 — ours big_melee_5s, big_melee_9s
2. [S] battle-feel.e rear-rank-windup — blocker 2: second-rank melee men blocked from reach enter a "ready swing" state, cycling a raised windup and short feint — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s/2150ms
3. [S] battle-feel.e sword-shoulder-cock — blocker 3: sword attack cocks the blade back over the shoulder, then a diagonal cut through the target's torso at the damage frame — ref trailer_3_sheet_01 r2c3 — ours closeup_weapon_reads
4. [S] battle-feel.e press-club-overhead-contact — blocker 4: press clubber's contact pose has the club above head height and descending; thrown man pitches back-first — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_blow, press_clubbers_hit
5. [S] vfx.m dynamite-lit-fuse — blocker 4: solid unlit orange-yellow spark mesh parented to the fuse tip in propBuilder "dynamite", carried by the thrown clone — ref units/wild_west.dynamite_thrower.jpg — ours throw_bombs_flight
6. [S] vfx.p swordcaster-blade-ring — blocker 2: 5-6 white blades point-up in a ring round him; each cast launches one from the ring, and it regrows — ref units/spooky.swordcaster.jpg — ours lineup_spooky, throw_casters_flight
7. [S] vfx.p lockbox-belly-carry — blocker 2: chest centred on the belly at the torso's front, both hands on its ends, elbows out — ref units/spooky.swordcaster.jpg — ours throw_casters_release

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- press-blow-rebuild [R] [attempts: 1] — 294: one _pressStrike pose for clubs + blades (cock: fist behind head, weapon back over shoulder; land: IK arm at struck man's crown), blade_slash windup to the cock, REAR_RANK_REACH 2.4. Critic: rear rank holds the cock all beat, front man ~2 bodies off so club stops in the air; knights land on men 3-5 m off
- press-second-rank-blow [attempts: 1] — 293: over-rank pending blow (REAR_RANK_REACH band + _allyBetween) + BLOW_STEP 1.3 hip lunge; no shot shows a club landing over a rank
- press-blow-in-crowd [attempts: 1, dropped] — 292: shield-wall break where a board-less melee man stands in the row + queue skip; rank-1 clubbers still >1 m behind protectors
- press-blow-off-feet [attempts: 1, dropped; approved on 2nd at 291] — 290: no capture framing showed the laid-out body
- press-throw-airborne [attempts: 1, dropped] — 288: fixed min lift 4.4 / back 1.6 m/s on the blow throw; struck man hidden in both press shots
- press-blow-lands [attempts: 2, rejected-kept] — 287: non-topple blow throw (THROWN pose); critic saw no hoplite airborne or arms-out. Code kept
- press-blow-lands [attempts: 1] — 286: forced blast topple + fixed throw on every heavy_swing land; regression battlefeel_shield_wall_vs_light_swarm
- head-snap-under-crown [attempts: 1] — 283: triggerBuckle from staggerFromBlow; hidden behind his own board / his file

## Notes for next iteration (max 5 lines)
- battle-feel.e is an ordinary FAIL again (re-audit 295 rewrote its list): pick its top [S] (club-overhead-drop) plus one vfx gap. 294 probe: press front men stand ~2 bodies off their mark; big_melee clubbers need a target within arm+weapon before the overhead drop can land. Knights in closeup aim at men 3-5 m off.
- Probe pattern: playwright via createRequire(loop/scripts/package.json), Chrome executablePath, vite preview on 4199 (build first); globalThis.__pp rows from animator update (remove before commit); window.game.frameCamera(target, r, alpha, beta) + renderWhenReady.
- Dynamite: held prop's top fixed at .155 s; the litFuse glow rides the right hand (propBuilder special "bomb_lit"), not the prop, so the thrown clone has no spark. Lockbox: _carryBoulder finds "boulder"|"lockbox" at the hands' midpoint, rotation = torso world less hand; swordcaster keeps weaponPresentationFamily blade_slash.
- Casters: fireball and leaves pend to CAST_LOOSE from the staff head; swordcaster sword spawns at headTop (simulationSystem ~1540), self-built in projectileSystem, hover .7 s. Thrown props are clones of the held prop (_buildHeldMissile).
- capture.mjs `--only a,b` takes several shots. Python file edits: open with encoding='utf-8' (unitVisuals non-ASCII), keep each file's EOL; big heredocs with apostrophes break bash, use Write. No [P] on rows approved within 20 iterations, except critic fallout.
