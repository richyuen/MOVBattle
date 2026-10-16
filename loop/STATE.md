# Loop state
Iteration: 304   Last re-audit: 304   Consecutive rejects: 0 (STOP cleared after a hand fix, see Notes)   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-304):
battle-feel: e FAIL f PASS g FAIL h PASS (2/4) (h cleared by [R] 065ba9e, 242; g's blocker moved from e by hand after 304)
- e FAIL (list REWRITTEN by re-audit 304 on the side-on blow shot 8e0770b + the 303 stand-off probe; deferred cleared; old blocker 4, the thrown pose, moved to g by hand after 304: it is a flung-body defect, not a strike one) [S since: 0; rejected since: 1 (304 0d0a413 reverted)] B: 1 press_clubbers_hit (side-on to the blow, 64 ms after it lands; big_melee_5s/9s second, where the mammoth fills half the frame): the landed club's head finishes on the struck man's crown or board top, the man thrown off it — TABS r2c3 clubber chest to chest, club head finishes on or through the man (hand fix after 304 pins the landed club on the strike point through the hold; before it, landed clubs ended level in open air at shoulder height or at shin height in the turf); 2 big_melee_2s/2150ms: the 150 ms pair shows no club coming down (halo man's and right-hand clubs rise or hold); 3 closeup_weapon_reads: no red knight's blade meets a body, nothing follows through (r3c1 arm cocked well back, committed forward). Ref trailer_3_sheet_01 r2c3, r3c1
- g FAIL (blocker moved from e by hand after 304; list otherwise as e's re-audit 304 wrote it) [S since: 0; rejected since: 0] B: 1 press_clubbers_blow (side-on): hoplite flies horizontal head-first, helmet lowest below the board, legs trail up-left at hip height, trunk not tipped back — TABS r2c3 seat-first, trunk back past 45 deg, one leg up above the hip. Ref trailer_3_sheet_01 r2c3
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-304; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i-p all PASS (8/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294; m cce136e 296; p 81ea78f 301; confirmed 302-304)
Total tier 1 24/24; tier 2 22/24; tier 3 29/29.

## Focus (every gap this iteration)
BASE be960cb (iter 304; re-audit 304: no flips; e's list rewritten, deferred cleared; one criterion fails, so one [S] pick)
- [S] press-close-in (battle-feel.e blocker 1) — 0d0a413 — REJECT, reverted bfbd2d6

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] press-close-in (0d0a413) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e press-beat-descends — blocker 2: a crowd clubber in reach runs a full cock-to-drop stroke on his beat so a 150 ms pair catches a club coming down — ref r2c3 — ours big_melee_2s/2150ms
2. [S] battle-feel.e blade-cock-and-commit — blocker 3: knight sword stroke cocked back over the shoulder, then committed forward through the torso with follow-through — ref r3c1 — ours closeup_weapon_reads
3. [S] battle-feel.g seat-first-throw-pose — blocker 1: thrown pose leads with the pelvis, trunk back past 45 deg, one leg above the hip — ref r2c3 — ours press_clubbers_blow
4. [S] battle-feel.e strike-recover-stand — blocker 1: a striker stands on his landed blow through its hold (~0.45 s, club on the point) before the sim walks him on to the next man; today he is walked off ~60 ms after the landing and the hold is let go (BLOW_HOLD_SLIP) — ref r2c3 — ours press_clubbers_hit, big_melee_5s
(e blocker 1's landing itself, press-crown-landing, was done by hand after 304: the 305 re-audit judges it from the new shots before any [S] is picked on it)
Watch only (PASS, not pickable): vfx.o fireball not visible in throw_casters_flight (re-audit 303, unchanged code, noise).

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- press-close-in [S] [attempts: 1] — 304: blocked clubber (ally in lane) retargets to nearest clear-lane enemy within +1.6 m else fights as rear rank; landed press beat gated on shoulder contact. Critic: 5s line clubber reaches the shields but club ends level at hip pointing past the knights; 9s clubbers now hold cocked, no landed club visible; press_clubbers_hit heads at knee/shin before the boards. 12/12 scenarios, but big_melee framing shifted (mammoth fills 9s)
- stroke-cadence-and-contact-hold [R] [attempts: 1] — 303: _pressReach hip lunge + seat-first THROWN (root pitch .5, curl .35, thighs -2/-1.7, knee 1.2). Critic: only blocker 4 cleared; thrown trunk sat upright, wants it tipped back past 45 deg
- two-hand-body-swing [R] [attempts: 1] — 302: _clubStroke two-hand IK stroke, root lunge .8 m, seat-first THROWN (legs 1.5, pitch .55). Critic: crowd frames only catch ready/cock; thrown still head-lowest
- one-strike [R] [attempts: 1] — 301: one world-solved _strike, hip lunge <= .45 H; REAR_RANK_REACH 2.2. Critic: no front man within a weapon of a crown; rear clubs high
- press-landed-contact [S] [attempts: 1, rejected-kept] — 299: _contactOn landed arc + follow on board top; critic: 5s club head in air, 9s clubs at hip/shin. Code kept (d33a3d5)
- lockbox-grip-centre [P] [attempts: 1] — 298: LOCKBOX_CARRY turn .8 out .25; box still off-centre
- press-blow-rebuild [R] [attempts: 1] — 294: one _pressStrike pose, REAR_RANK_REACH 2.4. Critic: rear rank holds the cock, front man ~2 bodies off
- press-second-rank-blow [attempts: 1] — 293: over-rank pending blow + BLOW_STEP 1.3 hip lunge; no shot shows a club landing over a rank

## Notes for next iteration (max 5 lines)
- Hand fix after 304 (STOP cleared, rejects reset): a frame probe showed the landed club was pinned right at the land step but then chased the struck man's crown as the blow threw him over (club down to shin height, into the turf), and the walk cutting the swing handed the arm to the cosmetic press beat mid-phase. Now `blowStruck()` freezes the strike point on the land step, the hold solves the arm to keep the club head on it, `_pressBlow` yields to a live swing, and a thrown/toppled man is no press mark. Rules: an [R] is approved on one cleared blocker (partial wins kept); e's thrown-pose blocker moved to g.
- 305 is a re-audit: judge e from press_clubbers_hit (club head on the strike point, man flying off it) and big_melee; g from press_clubbers_blow. The frozen point and hold solve also run for blade_slash (knights): if a landed sword reads pinned rather than swung through, gate the hold to heavy_swing as an [S] on blocker 3.
- Probe pattern: temp `(window as any).__sim = simulation` after main.ts:347 (never committed), vite build, preview on 4199 (an old preview may already hold the port and serves the new dist), probe.mjs in the fixing session's scratchpad (417d6149...): patches sim._landMeleeBlow to catch attacker/target and logs club head vs crown/contact per frame.
- A sim change reshuffles big_melee and the camera follows (mammoth filled 9s at 304): watch camera framing. Focus capture ~3 min with `--shots press_clubbers_side,press_clubbers_hit`. Python/node file edits: keep each file's EOL (LOG.md is CRLF).
