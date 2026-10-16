# Loop state
Iteration: 296   Last re-audit: 295   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-295):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL (list rewritten by re-audit 295) [S since: 1 (296 3dd543e); rejected since: 0] B: 1 struck in part (3dd543e: melee_club_drop shows the club ~50 deg below level through a squire going over backwards); remaining: big_melee_5s two red clubs stand straight up over the heads at the blue pile; big_melee_9s clubs at the pile run level at chest height, none caught coming down onto a board or head (between blows crowded clubbers rest upright or level) — TABS r2c3 the club arcs down through the man; 2 big_melee_2s/2150ms: red clubbers 1-3 bodies behind their front carry clubs level over the shoulder, never wind up or swing; only the front man acts; 3 closeup_weapon_reads: no red knight's blade meets a body; the one raised sword is held behind the head with a bent arm, nothing follows through — TABS r3c1 arm cocked well back over the shoulder, then committed forward; 4 press_clubbers_blow: the thrown hoplite goes over head-first, face to the ground — TABS r2c3 back seat-first, legs swinging up (club half struck by 3dd543e: club now runs steeply down past him). Ref trailer_3_sheet_01 r2c3, r3c1
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-295; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i PASS j PASS k PASS l PASS m PASS n PASS o PASS p FAIL (7/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294; m cce136e 296)
- p swordcaster [S since: 2 (288 462b2dc, 295 1cbd0b1)] B: struck 1 (462b2dc); 2 struck in part (1cbd0b1: hand sword replaced by a dark iron lockbox with straps and keyhole plate); remaining: the chest rides out at his side at hip height, not square across the belly between both hands (throw_casters_release, lineup_spooky); one sword at a time, no 5-6 blades standing point-up round him (throw_casters_flight); TABS chest at the belly in both hands, ring of upright blades (units/spooky.swordcaster.jpg)
Total tier 1 24/24; tier 2 23/24; tier 3 28/29.

## Focus (every gap this iteration)
BASE 0c8f62f (iter 296; no re-audit due)
- evidence melee_club_drop shot — 9ac74f4 (not scored)
- [S] dynamite-lit-fuse (vfx.m blocker 4) — cce136e — APPROVE (vfx.m FAIL -> PASS)
- [S] club-overhead-drop (battle-feel.e blocker 1) — 3dd543e — APPROVE (battle-feel.e stays FAIL, 1 struck in part)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] dynamite-lit-fuse (cce136e) VERDICT: APPROVE CRITERION: vfx.m PASS (previous: FAIL)
- GAP: [S] club-overhead-drop (3dd543e) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e club-cocked-in-press — blocker 1: a held overhead windup for in-reach strikers between blows, then the drop onto the board line — ref trailer_3_sheet_01 r2c3 — ours big_melee_5s, big_melee_9s
2. [S] battle-feel.e rear-rank-windup — blocker 2: rank 2-3 clubbers cock and swing over the front man's shoulder when their target is within reach plus a body — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s, big_melee_2150ms
3. [S] battle-feel.e blade-cock-commit — blocker 3: extend _aimBlow to swords as an arm cocked back over the shoulder, then a committed forward slash that meets the body — ref trailer_3_sheet_01 r3c1 — ours closeup_weapon_reads
4. [S] battle-feel.e thrown-seat-first — blocker 4: thrown pose rotates about the hip so the seat leads and the legs swing up, not head-first — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_blow
5. [S] vfx.p lockbox-belly-two-hand — blocker 2: chest square across the belly between both hands — ref units/spooky.swordcaster.jpg — ours throw_casters_release, lineup_spooky
6. [S] vfx.p sword-ring — blocker 2: a ring of 5-6 upright hovering blades round him before launch — ref units/spooky.swordcaster.jpg — ours throw_casters_flight

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
- Next picks: battle-feel.e club-cocked-in-press (rank 1) plus vfx.p (lockbox-belly or sword-ring), a different pair from 296 (battle-feel.e + vfx.m). 296 probe: big_melee clubbers strike at men 0.9-3 m off (12 clubber blows by 9 s); blows aimed 2-3 m off still miss the body (sim strike reach); landed fall now ~54 deg. Squires' simultaneous blows used to flinch the striker's trunk and level his club; flinch now spares trunk/weapon arm by _aimWeight.
- Probe pattern: playwright via createRequire(loop/scripts/package.json), Chrome executablePath, vite preview on 4199 (build first); expose `(globalThis as any).__sim = simulation` at main.ts `new SimulationSystem()` (remove before commit), read sim._units / unit.animator privates; capture's shot() renders only, it never advances the animator.
- Dynamite: spark is a getEmissive core + 6 rays on the fuse (getUnlit/"unlit" without emissive renders black). Lockbox: _carryBoulder finds "boulder"|"lockbox" at the hands' midpoint, rotation = torso world less hand; swordcaster keeps weaponPresentationFamily blade_slash.
- Casters: fireball and leaves pend to CAST_LOOSE from the staff head; swordcaster sword spawns at headTop (simulationSystem ~1540), self-built in projectileSystem, hover .7 s. Thrown props are clones of the held prop (_buildHeldMissile).
- capture.mjs `--only a,b` takes several shots; melee_club_drop (296.0) is an open-field 5 clubber v 5 squire skirmish shot 32 ms after the first clubber blow. Python/node file edits: keep each file's EOL. No [P] on rows approved within 20 iterations, except critic fallout.
