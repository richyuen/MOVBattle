# Loop state
Iteration: 303   Last re-audit: 303   Consecutive rejects: 2   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-303):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL deferred (list written by re-audit 295, kept at 300, 302, 303: deferred stands) [S since: 4 (296 3dd543e, 297 18ad559, 298 83a42ef, 300 7f84d8e); rejected since: 1 (299 d33a3d5 kept); [R] rejected since: 3 (301 477811d, 302 2bccf27, 303 02f0f99, all reverted)] B: 1 no big_melee frame shows a club landed on a board top or head: big_melee_5s/9s clubs at the ready, level or cocked (9s front shafts upright, right-hand pile level at shoulder height), none on a crown; big_melee_2s/2150ms right-hand clubs cocked behind or upright, one level at shin height under the halo man; 2 big_melee_2s/2150ms: the 150 ms pair shows no stroke coming down (halo man's club and right-hand clubs rise or hold, none descends); 3 closeup_weapon_reads: no red knight's blade meets a body, nothing follows through (r3c1 arm cocked well back, committed forward); 4 press_clubbers_blow: the thrown hoplite goes over head-first, head lowest, no seat leading or thighs up — TABS r2c3 seat-first, legs swinging up (struck by 02f0f99 at 303, but that [R] was reverted, so it stands; critic also wants the trunk tipped back past 45 deg, not sat upright). Ref trailer_3_sheet_01 r2c3, r3c1
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-303; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i-p all PASS (8/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294; m cce136e 296; p 81ea78f 301; confirmed 302, 303)
Total tier 1 24/24; tier 2 23/24; tier 3 29/29.

## Focus (every gap this iteration)
BASE 48016db (iter 303; re-audit 303: no flips, deferred stands; the deferred [R] was the only pick)
- evidence: press_clubbers_blow side-on to the throw (wall axis from mates only) — 8e0770b (not scored)
- [R] stroke-cadence-and-contact-hold (battle-feel.e blockers 1, 2, 4) — 02f0f99 — REJECT, reverted ec07a60 (cleared 4 only)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [R] stroke-cadence-and-contact-hold (02f0f99) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e (deferred) press-beat-in-open-melee — blocker 1: route big_melee clubbers who reach an enemy into the marked press beat (PRESS_MARK_HOLD + landed hold + reach lunge) so clubs rest on board tops or crowns in the melee frames; phase the slam so a 150 ms pair catches the drop (simulationSystem heavy_swing marking/cadence) — ref trailer_3_sheet_01 r2c3 — ours big_melee_9s
Watch only (PASS, not pickable): vfx.o fireball not visible in throw_casters_flight (re-audit 303, unchanged code, noise).

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- stroke-cadence-and-contact-hold [R] [attempts: 1] — 303: _pressReach (landed press club: hip/trunk lunged in by the shortfall to _contactOn, max .9 H) + seat-first THROWN (root pitch .5, trunk curl .35 set, thighs -2/-1.7, knee 1.2). Critic: only blocker 4 cleared; big_melee 5s/9s clubs still not on crowns (lunge shows in staged press only); thrown trunk sits upright, wants it tipped back past 45 deg
- two-hand-body-swing [R] [attempts: 1] — 302: _clubStroke two-hand IK stroke (ready 2.35 behind head, downstroke .2 s onto crown/board top, follow -1.25 held .45 s), root lunge .8 m, seat-first THROWN (legs 1.5, pitch .55). Critic: crowd frames only catch ready/cock; thrown hoplite still head-lowest; clears none fully
- one-strike [R] [attempts: 1] — 301: one world-solved _strike (cock, slam, weapon across crown/board top), hip lunge <= .45 H + spring; REAR_RANK_REACH 2.2. Critic: in big_melee no front man within a weapon of a crown; rear clubs held high; throw still head-first
- press-landed-contact [S] [attempts: 1, rejected-kept] — 299: _contactOn for the landed press arc + _aimBlow follow ends on board top; critic: 5s club head in the air over the pile, 9s clubs at hip/shin height. Code kept (d33a3d5)
- lockbox-grip-centre [P] [attempts: 1] — 298: LOCKBOX_CARRY turn .8 out .25; box still ~1/4 width off-centre
- press-blow-rebuild [R] [attempts: 1] — 294: one _pressStrike pose for clubs + blades, blade_slash windup to the cock, REAR_RANK_REACH 2.4. Critic: rear rank holds the cock all beat, front man ~2 bodies off
- press-second-rank-blow [attempts: 1] — 293: over-rank pending blow + BLOW_STEP 1.3 hip lunge; no shot shows a club landing over a rank
- press-blow-in-crowd [attempts: 1, dropped] — 292: shield-wall break + queue skip; rank-1 clubbers still >1 m behind protectors

## Notes for next iteration (max 5 lines)
- 304: e is deferred with 3 rejected [R]s and nothing else fails: run the re-audit (step 2); the 303 critic asked the next re-audit to REWRITE e's list (new angle: probe below + the side-on blow shot 8e0770b) rather than queue a fourth rebuild. Consecutive rejects 2: one more reject writes STOP.
- 303 probe (big_melee): ~half the marked clubbers at 5s/9s ARE in the landed press state (land 1.0) but stand 2.3-2.7 m from their man (contact ~1.0; inReach = engage ~1.9 + blowStrikeReach .9), so the landed club ends in the air; they stay there blocked (shove 0, beyond engageDistance). A hip lunge capped at .9 H closed most gaps to 0 in data but the critic still saw no club on a crown in the melee stills: the sim must bring them in (or not mark them) — fix in simulationSystem, not the pose.
- 303 seat-first throw: root pitch .5 + THROWN set (curl .35, thighs -2.0, knee 1.2) read seat-first in the side-on shot; critic wants the trunk tipped back past 45 deg too (try root .5 + trunk curl ~-.4, thighs up).
- Probe pattern: temp `(window as any).__sim = simulation` after main.ts:347 (never committed), playwright via createRequire(loop/scripts/package.json), vite preview on 4199; animator fields _pressLand, _pressMark, _strikeTimer, _restLowTimer. Old probes: scratchpad probe.mjs of this session (53213034...).
- Focus capture ~3 min; add `--shots press_clubbers_side,press_clubbers_hit` for e. Python/node file edits: keep each file's EOL (LOG.md is CRLF).
