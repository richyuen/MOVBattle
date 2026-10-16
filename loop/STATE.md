# Loop state
Iteration: 299   Last re-audit: 295   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-295):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL (list rewritten by re-audit 295) [S since: 3 (296 3dd543e, 297 18ad559, 298 83a42ef); rejected since: 1 (299 d33a3d5 kept)] B: 1 struck in part (3dd543e melee_club_drop club below level; 18ad559 closers cocked back; 83a42ef big_melee_5s no club upright at the blue pile); remaining: no big_melee frame catches a club landed on a board top or head: big_melee_5s the halo man's club is off the turf now but held forward and up, head in the air over the blue pile; big_melee_9s clubs run level at hip and shin height; one walking-in red clubber at far right of big_melee_2s/2150ms still carries his club upright; press_clubbers_blow the clubber's club runs low and back into the turf under the hoplite's board — TABS r2c3 the club arcs down through the man and stops on him; 2 big_melee_2s/2150ms: red clubbers 1-3 bodies behind their front carry clubs cocked over the shoulder and never swing; only the front man acts; 3 closeup_weapon_reads: no red knight's blade meets a body; the one raised sword is held behind the head with a bent arm, nothing follows through — TABS r3c1 arm cocked well back over the shoulder, then committed forward; 4 press_clubbers_blow: the thrown hoplite goes over head-first, face to the ground — TABS r2c3 back seat-first, legs swinging up (club half struck by 3dd543e). Ref trailer_3_sheet_01 r2c3, r3c1
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-295; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i PASS j PASS k PASS l PASS m PASS n PASS o PASS p FAIL (7/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294; m cce136e 296)
- p swordcaster plateau [S since: 4 (288 462b2dc, 295 1cbd0b1, 297 3c905de, 299 b8b4cb1)] B: struck 1 (462b2dc); 2 struck in part (1cbd0b1 lockbox replaces hand sword; 3c905de chest across the belly, an arm each side; b8b4cb1 box centred on his centreline before the belly, one mitt on an end in lineup_spooky); remaining: throw_casters_release right forearm overshoots ~1/3 box width past the end (wrist IK target past the end), other hand hidden; lineup_spooky only one mitt on an end; 3 one sword at a time, no 5-6 blades standing point-up round him (throw_casters_flight); TABS chest centred at the navel, both mitts on its ends, ring of upright blades (units/spooky.swordcaster.jpg, factions/spooky.png)
Total tier 1 24/24; tier 2 23/24; tier 3 28/29.

## Focus (every gap this iteration)
BASE 9e4d7b1 (iter 299; no re-audit due; no [P] fallout listed)
- [S] press-landed-contact (battle-feel.e blocker 1) — d33a3d5 — REJECT, revert conflicted with b8b4cb1: rejected-kept
- [S] lockbox-body-anchor (vfx.p blocker 2) — b8b4cb1 — APPROVE (vfx.p stays FAIL, 2 struck in part; now plateau)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] press-landed-contact (d33a3d5) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [S] lockbox-body-anchor (b8b4cb1) VERDICT: APPROVE CRITERION: vfx.p FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e press-club-pinned-on-man — blocker 1: a pose state "club landed and held on the struck man": pin the weapon head to his crown bone every frame of BLOW_HOLD from his live position after knockback, not one aim target blended toward; prove with a big_melee frame inside a hold — ref trailer_3_sheet_01 r2c3 — ours big_melee_5s, big_melee_9s
2. [R] vfx.p swordcaster-rebuild (plateau) — blockers 2+3: sword ring (5-6 hovering point-up blades circling him, one launched per cast, ring refilled; projectileSystem/unitFactory) plus mitts on the box end faces (palm, not wrist, at the end) — ref units/spooky.swordcaster.jpg, factions/spooky.png — ours throw_casters_flight, throw_casters_release, lineup_spooky
3. [S] battle-feel.e rear-rank-swing — blocker 2: clubbers 1-3 bodies back swing over their front man's shoulder at the enemy in reach of the head, not held cocked — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s
4. [S] battle-feel.e knight-overhead-commit — blocker 3: sword windup cocked over the shoulder, arm straight, then a forward slash ending on a body — ref trailer_3_sheet_01 r3c1 — ours closeup_weapon_reads
5. [S] battle-feel.e thrown-seat-first — blocker 4: the blow throw rotates the body back about the hips, seat lands first, legs swing up — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_blow

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
- 300 is a re-audit (full capture, PASS criteria re-checked there). Then picks: battle-feel.e press-club-pinned-on-man + the vfx.p [R] (plateau: no [S] on vfx.p until an [R] is approved or a re-audit rewrites its list).
- Focus capture: `capture.mjs --iter N --focus` (~3 min); `--only a,b` takes a comma list. Probe pattern: playwright via createRequire(loop/scripts/package.json), vite preview on 4199; expose `(globalThis as any).__sim` at main.ts `new SimulationSystem()` (remove before commit).
- Press club: landed pose now aimed by _contactOn (kept, rejected); _aimBlow overrides it via _aimTip during a swing's BLOW_HOLD. Big_melee frames rarely fall in a hold: the next gap must pin it every frame and time a shot inside one. Rear rank (REAR_CLUB_REST) unchanged.
- Lockbox: _lockboxAnchor fixes the box to the torso (NAVEL .35, FRONT .55 of shoulder ht) and DLS-reaches each wrist to end + GRIP .06; the mitt hangs past the wrist, so target the palm. Swordcaster sword spawns at headTop (simulationSystem ~1540), self-built in projectileSystem, hover .7 s.
- melee_club_drop times out on render-ready but the frame is complete. Python/node file edits: keep each file's EOL. No [P] on rows approved within 20 iterations, except critic fallout.
