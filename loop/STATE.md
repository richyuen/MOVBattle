# Loop state
Iteration: 302   Last re-audit: 302   Consecutive rejects: 1   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-302):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL deferred (list written by re-audit 295, kept at 300 and 302) [S since: 4 (296 3dd543e, 297 18ad559, 298 83a42ef, 300 7f84d8e); rejected since: 1 (299 d33a3d5 kept); [R] rejected since: 2 (301 477811d, 302 2bccf27, both reverted)] B: 1 no big_melee frame shows a club landed on a board top or head: big_melee_5s/9s clubs at the ready or cock, none on a crown; big_melee_2s/2150ms right-hand clubs cocked behind or upright, one level at shin height under the halo man; 2 big_melee_2s/2150ms: the 150 ms pair shows no stroke coming down (302: rear clubs no longer near-vertical over the man ahead under 2bccf27, reverted); 3 closeup_weapon_reads: no red knight's blade meets a body, nothing follows through (r3c1 arm cocked well back, committed forward); 4 press_clubbers_blow: the thrown hoplite goes over head-first, head lowest, no seat leading or thighs up — TABS r2c3 seat-first, legs swinging up. Ref trailer_3_sheet_01 r2c3, r3c1
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-302; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i-p all PASS (8/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294; m cce136e 296; p 81ea78f 301; confirmed 302)
Total tier 1 24/24; tier 2 23/24; tier 3 29/29.

## Focus (every gap this iteration)
BASE f55674c (iter 302; re-audit 302: no flips, e list kept, plateau stood; the only pickable gap was the [R])
- [R] two-hand-body-swing (battle-feel.e blockers 1, 2, 4) — 2bccf27 — REJECT, reverted 69c8ac7 (struck none; e now deferred)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [R] two-hand-body-swing (2bccf27) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [R] battle-feel.e (deferred) stroke-cadence-and-contact-hold — blockers 1, 2, 4: rebuild the stroke cadence so a crowd frame holds ~1 in 3 clubs mid-fall or landed and held ON the man (crown or board top), not only the ready/cock and a low follow-through; shorten the ready dwell and stagger strokes (simulationSystem attack cadence); thrown pose with the pelvis lowest and thighs up past level, visible in press_clubbers_blow — ref trailer_3_sheet_01 r2c3, r3c1, units/tribal.clubber.jpg — ours big_melee_9s, press_clubbers_blow

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- two-hand-body-swing [R] [attempts: 1] — 302: _clubStroke two-hand IK stroke (ready club 2.35 behind head, cock 2.65, downstroke .2 s onto crown/board top with solved fist height, follow -1.25 held .45 s), RuntimeUnit.lungeInto root lunge (.8 m to .08 body gap), seat-first THROWN (legs 1.5, pitch .55). Critic: crowd frames only catch ready/cock (downstroke .2 of a 1.3 s cycle); thrown hoplite still head-lowest; clears none fully
- one-strike [R] [attempts: 1] — 301: one world-solved _strike (cock, slam, weapon across crown/board top >= 25 deg fall, hip lunge <= .45 H + spring <= .3 H, rear ranks to .8 rad over the man ahead, blades only in reach), replacing press-beat arm, ready cock and _aimBlow; REAR_RANK_REACH 2.2. Critic: in big_melee no front man within a weapon of a crown, so clubs still up/level; rear clubs held high; throw still head-first
- press-landed-contact [S] [attempts: 1, rejected-kept] — 299: _contactOn (crown or near-face board top) for the landed press arc + _aimBlow follow ends on board top; critic: 5s club head in the air over the pile, 9s clubs at hip/shin height. Code kept (d33a3d5)
- lockbox-grip-centre [P] [attempts: 1] — 298: LOCKBOX_CARRY turn .8 out .25; box still ~1/4 width off-centre (placed from hands' midpoint, arms asymmetric)
- press-blow-rebuild [R] [attempts: 1] — 294: one _pressStrike pose for clubs + blades (cock: fist behind head, weapon back over shoulder; land: IK arm at struck man's crown), blade_slash windup to the cock, REAR_RANK_REACH 2.4. Critic: rear rank holds the cock all beat, front man ~2 bodies off so club stops in the air; knights land on men 3-5 m off
- press-second-rank-blow [attempts: 1] — 293: over-rank pending blow (REAR_RANK_REACH band + _allyBetween) + BLOW_STEP 1.3 hip lunge; no shot shows a club landing over a rank
- press-blow-in-crowd [attempts: 1, dropped] — 292: shield-wall break where a board-less melee man stands in the row + queue skip; rank-1 clubbers still >1 m behind protectors
- press-blow-off-feet [attempts: 1, dropped; approved on 2nd at 291] — 290: no capture framing showed the laid-out body

## Notes for next iteration (max 5 lines)
- 303: battle-feel.e is deferred and every other criterion PASSes, so nothing ordinary is pickable: run the re-audit (step 2). The critic may rewrite e's list only with a new angle (else `deferred stands`); if it stands and no [S] is ranked, the deferred [R] is the only pick ("pickable only when nothing else is").
- 302 probe: in big_melee most red clubbers sit 1.6-2.7 m from the nearest blue (contact ~1.08 m); clubbers swing only within engage 1.9 m, the rest hold the ready. In a duel the clubber waits ~1.5 s in contact before the first swing (cooldown 1.3 s, melee.medium windup .2).
- 302 lesson: a 0.2 s downstroke in a 1.3 s cycle is invisible in crowd stills; the critic wants clubs landed and HELD on the man (crown/board top) for a large share of the cycle. A short clubber's fists never top a knight's crown: aim the board top. Seat-first needs thighs past level AND root pitch small.
- Probe pattern: temp `(window as any).__sim = simulation` in main.ts (never committed), playwright via createRequire(loop/scripts/package.json), vite preview on 4199 (dist is re-read per request); frameCamera(target, r, -PI/2, 1.4) gives a side view. Bash: backticks inside node -e "..." are command-substituted.
- Focus capture ~3 min; add `--shots press_clubbers_side,press_clubbers_hit` for e (not in the blocker-named set). Python/node file edits: keep each file's EOL.
