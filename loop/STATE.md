# Loop state
Iteration: 294   Last re-audit: 290   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-290):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL plateau (rejected [R] since list: 1 — 294 press-blow-rebuild a295281, reverted; a second rejected [R] makes it deferred) (list rewritten by re-audit 285, kept 290) [S since: 2 (289 2bb3413, 291 ba425b2); rejected since: 4 (286, 287 rejected-kept, 293 01de458, 294 [R] a295281)] B: struck old 1 (ba425b2). 1 big_melee_2s/2150ms/5s/9s: red clubbers 1-3 bodies behind their own front never bring a club down on a blue board or head: at 2s/2150ms rear clubs cocked back level over the shoulder; at 5s the front club points up and forward over the blue helm; at 9s the front club runs level at chest height into the blue pile; 2 closeup_weapon_reads: red knights' blades never meet a body and none is cocked back over the shoulder — TABS r3c1 arm cocked well back over the shoulder. Ref trailer_3_sheet_01 r2c3, r3c1. Minor: the thrown man goes over head-first; TABS r2c3 goes back seat-first, legs swinging up
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-290; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i PASS j PASS k PASS l PASS m FAIL n PASS o PASS p FAIL (6/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294)
- m dynamite_thrower [S since: 1 (284 345314d)] B: struck 1-3; 4 the bundle is a forearm-length 3-pack at the hip (lineup_wild_west), and in flight sticks and bands merge into one plain red cylinder, no lit spark at the fuse (throw_bombs_flight); TABS a hip-to-chest, near torso-wide bundle of distinct sticks, two broad black bands, glowing fuse (units/wild_west.dynamite_thrower.jpg)
- p swordcaster [S since: 1 (288 462b2dc)] B: struck 1 (462b2dc: glowing white sword, hangs .7 s over his head, then flies; throw_casters_flight shows it flying level); 2 holds a short dark hand sword at the hip, one sword at a time; TABS a dark lockbox chest in both hands at the belly, 5-6 blades standing point-up round him (units/spooky.swordcaster.jpg)
Total tier 1 24/24; tier 2 23/24; tier 3 27/29.

## Focus (every gap this iteration)
BASE 7570ae1 (iter 294)
- [R] press-blow-rebuild (battle-feel.e blockers 1+2) — a295281 — REJECT (reverted 9f5852a)
- [S] harpoon-rope-tied (vfx.j blocker 5) — 6eeeb65 — APPROVE (vfx.j flips PASS)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [R] press-blow-rebuild (a295281) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL, plateau)
- GAP: [S] harpoon-rope-tied (6eeeb65) VERDICT: APPROVE CRITERION: vfx.j PASS (previous: FAIL); REGRESSIONS: none

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [R] battle-feel.e press-strike reach [R attempts: 1] — blockers 1+2: land only on a man inside weapon reach, weapon head ON his head or board (else stay cocked); stagger the rear rank's beats so most clubs are down in any still; knights cocked behind the shoulder — ref trailer_3_sheet_01 r2c3, r3c1 — ours big_melee_5s, closeup_weapon_reads
2. [S] vfx.m dynamite-bundle — blocker 4: hip-to-chest, near torso-wide bundle of distinct red sticks, two broad black bands — ref units/wild_west.dynamite_thrower.jpg — ours lineup_wild_west
3. [S] vfx.m lit-fuse-in-flight — blocker 4: thrown copy keeps separate sticks and bands, glowing spark at the fuse tip — ref units/wild_west.dynamite_thrower.jpg — ours throw_bombs_flight
4. [S] vfx.p lockbox-chest — blocker 2: dark iron-banded lockbox in both hands at the belly — ref units/spooky.swordcaster.jpg — ours throw_casters_release
5. [S] vfx.p standing-blade-ring — blocker 2: 5-6 glowing white blades point-up round him, launched one at a time — ref units/spooky.swordcaster.jpg — ours throw_casters_flight, lineup_spooky
6. [P] vfx.j rope-tie (fallout of [S] harpoon-rope-tied 6eeeb65) — projectileSystem.ts _layRope: end the rope at the harpoon's tail ring, not p.mesh.position — NEXT: shows in throw_spears_harpoon

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- press-blow-rebuild [R] [attempts: 1] — 294: one _pressStrike pose for clubs + blades (cock: fist behind head, weapon back over shoulder arc -1.2; land: IK arm .75/.5 rad from vertical at struck man's crown, minDrop .55/.35), blade_slash windup to the cock, REAR_RANK_REACH 2.4. Critic: rear rank holds the cock all beat (clubs laid back level), front man ~2 bodies off so club stops in the air / runs level; knights land on men 3-5 m off. 0/2 blockers
- press-second-rank-blow [attempts: 1] — 293: over-rank pending blow (REAR_RANK_REACH band + _allyBetween, damage .35) + BLOW_STEP 1.3 hip lunge in _aimBlow; critic: no shot shows a club landing over a rank. Critic: gate on the ally lane out to two bodies, not the distance band
- press-blow-in-crowd [attempts: 1, dropped] — 292: shield-wall break where a board-less melee man stands in the row + queue skip; red line advanced slower, rank-1 clubbers still >1 m behind protectors at 3500 ms
- press-blow-off-feet [attempts: 1, dropped; approved on 2nd at 291] — 290: no capture framing showed the laid-out body
- press-throw-airborne [attempts: 1, dropped] — 288: fixed min lift 4.4 / back 1.6 m/s on the blow throw; struck man hidden in both press shots
- press-blow-lands [attempts: 2, rejected-kept] — 287: non-topple blow throw (THROWN pose); critic saw no hoplite airborne or arms-out. Code kept
- press-blow-lands [attempts: 1] — 286: forced blast topple + fixed throw on every heavy_swing land; regression battlefeel_shield_wall_vs_light_swarm
- head-snap-under-crown [attempts: 1] — 283: triggerBuckle from staggerFromBlow; hidden behind his own board / his file

## Notes for next iteration (max 5 lines)
- battle-feel.e: second [R] next (a second reject makes it deferred). 294 probe: with the [R], press men (strike=true) were ~70% down by tip vector, but the shot read rear rows as cocked-level and fronts as stopping short: the big_melee front stands ~2 bodies off its mark. Fix reach (step in / pick a target within arm+weapon) before pose; knights in closeup aim at men 3-5 m off.
- Probe pattern: playwright via createRequire(loop/scripts/package.json), Chrome executablePath, vite preview on 4199 (build first); globalThis.__pp rows pushed from animator update (remove before commit); window.game.frameCamera(target, r, alpha, beta) + renderWhenReady for a zoom still.
- Casters: fireball and leaves pend to CAST_LOOSE from the staff head; swordcaster sword hovers .7 s over headTop. Thrown props are copies of the held prop (_buildHeldMissile). Two-hand pattern: stoner _carryBoulder; config.offhandWeapon puts a second prop in the left hand.
- Harpoon: motion "thrust" mapped in unitVisuals; hip fire branch in _animateThrust keyed on rightHand child "harpoonGun". Rope from tether with world chain recomputed each step. mapBuilder.ts LF, LOG.md CRLF, projectileSystem.ts CRLF (use Edit).
- capture.mjs `--only a,b` takes several shots. Melee: _tryAttack damages at swing start unless a heavy blow is pending. No [P] on rows approved within 20 iterations, except critic-named fallout.
