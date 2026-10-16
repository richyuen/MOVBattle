# Loop state
Iteration: 298   Last re-audit: 295   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-295):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL (list rewritten by re-audit 295) [S since: 3 (296 3dd543e, 297 18ad559, 298 83a42ef); rejected since: 0] B: 1 struck in part (3dd543e melee_club_drop club below level; 18ad559 closers cocked back; 83a42ef big_melee_5s no club upright at the blue pile); remaining: no big_melee frame catches a club landed on a board top or head: big_melee_5s the halo man's club is driven past the board into the turf (landed arc is a fixed angle, not stopped on the man), big_melee_9s the low club is at shin height; one walking-in red clubber at far right of big_melee_2s/2150ms still carries his club upright — TABS r2c3 the club arcs down through the man and stops on him; 2 big_melee_2s/2150ms: red clubbers 1-3 bodies behind their front carry clubs cocked over the shoulder and never swing; only the front man acts; 3 closeup_weapon_reads: no red knight's blade meets a body; the one raised sword is held behind the head with a bent arm, nothing follows through — TABS r3c1 arm cocked well back over the shoulder, then committed forward; 4 press_clubbers_blow: the thrown hoplite goes over head-first, face to the ground — TABS r2c3 back seat-first, legs swinging up (club half struck by 3dd543e). Ref trailer_3_sheet_01 r2c3, r3c1
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-295; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i PASS j PASS k PASS l PASS m PASS n PASS o PASS p FAIL (7/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294; m cce136e 296)
- p swordcaster [S since: 3 (288 462b2dc, 295 1cbd0b1, 297 3c905de)] B: struck 1 (462b2dc); 2 struck in part (1cbd0b1 lockbox replaces hand sword; 3c905de chest across the belly, an arm each side); remaining: box ~1/4 of its width off-centre, overhanging his right side (lineup_spooky), right forearm pokes past its end and left hand unseen (throw_casters_release): the box is placed at the hands' midpoint so asymmetric arms carry it off-centre; 3 one sword at a time, no 5-6 blades standing point-up round him (throw_casters_flight); TABS chest centred at the navel, both mitts on its ends, ring of upright blades (units/spooky.swordcaster.jpg, factions/spooky.png)
Total tier 1 24/24; tier 2 23/24; tier 3 28/29.

## Focus (every gap this iteration)
BASE a4203c7 (iter 298; no re-audit due; pair rule blocked a second [S] after 297's battle-feel.e + vfx.p, so one [S] + the [P] fallout)
- [S] press-mark-held (battle-feel.e blocker 1) — 83a42ef — APPROVE (battle-feel.e stays FAIL, 1 struck in part)
- [P] lockbox-grip-centre (vfx.p blocker 2) — 67732cb — REJECT, reverted 11a0036

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] press-mark-held (83a42ef) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [P] lockbox-grip-centre (67732cb) VERDICT: REJECT CRITERION: vfx.p FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e press-landed-contact — blocker 1: solve the landed club arc to the marked man's head or board-top world point and hold it in contact through BLOW_HOLD (_aimBlow/_carryProp), not a fixed _pressLand angle — ref trailer_3_sheet_01 r2c3 — ours big_melee_5s, big_melee_9s
2. [S] battle-feel.e press-rank-rotation — blocker 2: after his blow the front clubber steps back and the man behind steps into his slot and swings (a slot swap in simulationSystem, not the rejected 293 reach-over blow) — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s, big_melee_2150ms
3. [S] battle-feel.e sword-committed-swing — blocker 3: sword swing cocked back over the shoulder, arm straight, then a forward follow-through ending at the target's body — ref trailer_3_sheet_01 r3c1 — ours closeup_weapon_reads
4. [S] battle-feel.e blow-throw-seat-first — blocker 4: pitch the thrown man about the pelvis, trunk back, legs swung up, landing on his back — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_blow
5. [S] vfx.p lockbox-body-anchor — blocker 2: box fixed at the navel on the torso centreline, both forearms reaching to its two ends (two-bone reach), not placed from the hands — ref units/spooky.swordcaster.jpg — ours throw_casters_release, lineup_spooky
6. [S] vfx.p sword-ring — blocker 3: 5-6 upright hovering blades orbiting him, launched one by one, ring refilling — ref units/spooky.swordcaster.jpg, factions/spooky.png — ours throw_casters_flight

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- lockbox-grip-centre [P] [attempts: 1] — 298: LOCKBOX_CARRY turn .8 out .25; box still ~1/4 width off-centre (placed from hands' midpoint, arms asymmetric)
- press-blow-rebuild [R] [attempts: 1] — 294: one _pressStrike pose for clubs + blades (cock: fist behind head, weapon back over shoulder; land: IK arm at struck man's crown), blade_slash windup to the cock, REAR_RANK_REACH 2.4. Critic: rear rank holds the cock all beat, front man ~2 bodies off so club stops in the air; knights land on men 3-5 m off
- press-second-rank-blow [attempts: 1] — 293: over-rank pending blow (REAR_RANK_REACH band + _allyBetween) + BLOW_STEP 1.3 hip lunge; no shot shows a club landing over a rank
- press-blow-in-crowd [attempts: 1, dropped] — 292: shield-wall break where a board-less melee man stands in the row + queue skip; rank-1 clubbers still >1 m behind protectors
- press-blow-off-feet [attempts: 1, dropped; approved on 2nd at 291] — 290: no capture framing showed the laid-out body
- press-throw-airborne [attempts: 1, dropped] — 288: fixed min lift 4.4 / back 1.6 m/s on the blow throw; struck man hidden in both press shots
- press-blow-lands [attempts: 2, rejected-kept] — 287: non-topple blow throw (THROWN pose); critic saw no hoplite airborne or arms-out. Code kept
- press-blow-lands [attempts: 1] — 286: forced blast topple + fixed throw on every heavy_swing land; regression battlefeel_shield_wall_vs_light_swarm

## Notes for next iteration (max 5 lines)
- 299 picks: battle-feel.e press-landed-contact + vfx.p lockbox-body-anchor (298's [S] pair was battle-feel.e alone, so the pair rule allows it). 300 is a re-audit: full capture, PASS criteria re-checked there only.
- Focus capture (since 298): `capture.mjs --iter N --focus` shoots only the shots FAIL blockers and Ranked open gaps name (~3 min); `--list` previews, `--shots a,b` adds. Probe pattern: playwright via createRequire(loop/scripts/package.json), vite preview on 4199; expose `(globalThis as any).__sim` at main.ts `new SimulationSystem()` (remove before commit).
- Press beat: in-reach strikers mark the target headTop (_pressMark, held PRESS_MARK_HOLD 1.5 s past the last call and through any swing); marked heavy_swing winds to PRESS_CLUB_COCK and recovers landed via _pressLand -> _pressDownArc (a fixed angle onto the board line: the next gap must stop it on the man). Rear rank (REAR_CLUB_REST) unchanged.
- Lockbox: LOCKBOX_CARRY arms in _carryBoulder, box at the hands' midpoint (torso-local z ~.26): constants cannot centre it; anchor to the torso. Casters: swordcaster sword spawns at headTop (simulationSystem ~1540), self-built in projectileSystem, hover .7 s.
- melee_club_drop times out on render-ready but the frame is complete. Python/node file edits: keep each file's EOL. No [P] on rows approved within 20 iterations, except critic fallout.
