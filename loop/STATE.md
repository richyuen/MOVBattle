# Loop state
Iteration: 297   Last re-audit: 295   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-295):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL (list rewritten by re-audit 295) [S since: 2 (296 3dd543e, 297 18ad559); rejected since: 0] B: 1 struck in part (3dd543e: melee_club_drop club ~50 deg below level through the squire; 18ad559: big_melee_9s clubs no longer level at chest, closers carry the club cocked back over the shoulder ~60 deg off vertical); remaining: big_melee_5s the left red clubber at the blue pile still holds his club straight up; no big_melee frame catches a club landed down on a board top or head (the one low club in 9s is at shin height) — TABS r2c3 the club arcs down through the man; 2 big_melee_2s/2150ms: red clubbers 1-3 bodies behind their front carry clubs cocked over the shoulder and never swing; only the front man acts; 3 closeup_weapon_reads: no red knight's blade meets a body; the one raised sword is held behind the head with a bent arm, nothing follows through — TABS r3c1 arm cocked well back over the shoulder, then committed forward; 4 press_clubbers_blow: the thrown hoplite goes over head-first, face to the ground — TABS r2c3 back seat-first, legs swinging up (club half struck by 3dd543e). Ref trailer_3_sheet_01 r2c3, r3c1
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-295; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i PASS j PASS k PASS l PASS m PASS n PASS o PASS p FAIL (7/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294; m cce136e 296)
- p swordcaster [S since: 3 (288 462b2dc, 295 1cbd0b1, 297 3c905de)] B: struck 1 (462b2dc); 2 struck in part (1cbd0b1 lockbox replaces hand sword; 3c905de chest across the belly, long side left-right, an arm each side); remaining: box off-centre by ~1/4 of its width, left mitt hangs beside its end (lineup_spooky), one forearm on its end (throw_casters_release); one sword at a time, no 5-6 blades standing point-up round him (throw_casters_flight); TABS chest centred at the navel, both mitts on its ends, ring of upright blades (units/spooky.swordcaster.jpg, factions/spooky.png)
Total tier 1 24/24; tier 2 23/24; tier 3 28/29.

## Focus (every gap this iteration)
BASE 8a17fab (iter 297; no re-audit due)
- [S] club-cocked-in-press (battle-feel.e blocker 1) — 18ad559 — APPROVE (battle-feel.e stays FAIL, 1 struck in part)
- [S] lockbox-belly-two-hand (vfx.p blocker 2) — 3c905de — APPROVE (vfx.p stays FAIL, 2 struck in part)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] club-cocked-in-press (18ad559) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [S] lockbox-belly-two-hand (3c905de) VERDICT: APPROVE CRITERION: vfx.p FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e press-mark-held — blocker 1: keep the in-reach press mark and the landed arc alive through gaps in the strike calls, so no striker at the pile holds his club upright and some are caught down on a board top — ref trailer_3_sheet_01 r2c3 — ours big_melee_5s, big_melee_9s
2. [S] battle-feel.e rear-rank-windup — blocker 2: rank 2-3 clubbers swing from their cock over the front man's shoulder when their target is within reach plus one body — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s, big_melee_2150ms
3. [S] battle-feel.e blade-cock-commit — blocker 3: extend _aimBlow to swords, arm cocked back over the shoulder then a committed forward slash that meets the body — ref trailer_3_sheet_01 r3c1 — ours closeup_weapon_reads
4. [S] battle-feel.e thrown-seat-first — blocker 4: thrown pose rotates about the hip so the seat leads and the legs swing up, not head-first — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_blow
5. [S] vfx.p sword-ring — blocker 2: a ring of 5-6 upright hovering blades round him at windup, launched one by one — ref units/spooky.swordcaster.jpg, factions/spooky.png — ours throw_casters_flight
6. [P] vfx.p lockbox-grip-centre — blocker 2 (fallout of approved [S] 3c905de): LOCKBOX_CARRY.turn .6 -> ~.8, .out .32 -> ~.25 so both mitts close on the box ends and it centres on the navel. NEXT shot: lineup_spooky, throw_casters_release

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
- Next picks: battle-feel.e press-mark-held (rank 1) plus vfx.p sword-ring (a different pair from 297's battle-feel.e + vfx.p is impossible with only these two FAIL criteria: if the pair rule blocks, pick battle-feel.e + the [P] lockbox-grip-centre fallout). 297 probe: many front-rank clubbers at the pile are limp (topple) so the carry pose is off; the upright 5s club may be a heavy_swing Attacking windup (arc CLUB_COCK -0.4) or a striker with _pressAim null.
- Probe pattern: playwright via createRequire(loop/scripts/package.json), Chrome executablePath, vite preview on 4199 (build first); expose `(globalThis as any).__sim = simulation` at main.ts `new SimulationSystem()` (remove before commit), read sim._units / unit.animator privates; capture's shot() renders only. Club direction: read the tip vector in _carryProp, mesh-centre measures are unreliable.
- Press beat: in-reach strikers (readyBlow mark = target headTop, _pressAim) cock at PRESS_CLUB_COCK and land via _pressDownArc onto the board line; out-of-reach closers carry the same cock; rear rank (REAR_CLUB_REST) unchanged. Lockbox: LOCKBOX_CARRY arms in _carryBoulder, box at hands midpoint (torso-local z ~.26).
- Casters: fireball and leaves pend to CAST_LOOSE from the staff head; swordcaster sword spawns at headTop (simulationSystem ~1540), self-built in projectileSystem, hover .7 s. Thrown props are clones of the held prop (_buildHeldMissile). Dynamite spark is getEmissive core + rays (unlit renders black).
- capture.mjs `--only a,b` takes several shots; melee_club_drop timed out on render-ready at 297 but the frame was complete. Python/node file edits: keep each file's EOL. No [P] on rows approved within 20 iterations, except critic fallout.
