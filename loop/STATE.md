# Loop state
Iteration: 312   Last re-audit: 310   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-305):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242; g cleared by 203b0ca, re-audit 307, judged from duel_club_thrown)
- e FAIL (plateau cleared 312 by the approved [R] e425f5d; counts re-based there) (blocker 2 narrowed 310, 311, 312; 5 added 311, struck 312) [S since: 0 (since the 312 [R]); rejected since: 0] B: 2 melee_club_drop: the clubs lie parallel on one ~35 deg diagonal side by side; the one down on the squire and the ones still raised behind sit on the same line, so their different points of the arc do not read, one bundle of logs, not separate blows (r2c3: one club driven down toward the ground, the next held near vertical over the shoulder). Struck 1 (305), 3 (308), 4 (309), float (310), no-reaction (311), 5 (312: one struck man folds, the knights behind stand; no drilled bow). Ref trailer_3_sheet_01 r2c3, r3c1
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-305; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i-p all PASS (8/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294; m cce136e 296; p 81ea78f 301; confirmed 302-305)
Total tier 1 24/24; tier 2 23/24; tier 3 29/29.

## Focus (every gap this iteration)
BASE c1e4c82 (iter 312, one [R] on the plateau criterion, one evidence commit, one critic review)
- evidence: melee_club_drop pair lens 4.6 m pitched ~17 deg down (was 3.4 m level) — 4094f1d
- [R] one-blow-per-man (battle-feel.e blockers 2, 5) — e425f5d — APPROVE (5 struck, plateau cleared)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [R] one-blow-per-man (e425f5d) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL, plateau)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e ready-club-upright — blocker 2: a lagged striker (STRIKE_LAG holding him) holds his club near vertical over his shoulder until his beat comes, not at the cocked-back diagonal — ref trailer_3_sheet_01 r2c3 (right clubber) — ours melee_club_drop
2. [S] battle-feel.e drive-to-ground — blocker 2: the drive-through carries the club head past the struck man down toward the ground, ending down-forward, the opposite slope to a waiting club — ref trailer_3_sheet_01 r2c3 (left clubber) — ours melee_club_drop
3. [S] battle-feel.e per-man swing plane — blocker 2: each man's swing plane yawed his own way so the clubs cross instead of lying side by side — ref trailer_3_sheet_01 r2c3 — ours melee_club_drop
4. [S] battle-feel.e ragged striker depth — blocker 2: strikers hold their own stand-off depth, so the clubs do not end side by side in one rank — ref trailer_3_sheet_01 r2c3 — ours melee_club_drop, press_clubbers_hit
5. [P] battle-feel.e BLOW_DRIVE_VARY .15 -> .4 rad, fallout of [R] one-blow-per-man (e425f5d, 312). NEXT shot: melee_club_drop — the club on the squire's helm at a visibly different slope from the three raised behind it.
6. [P] battle-feel.e buckle at the knees, fallout of 311 (8d06ed0): partly taken by the 312 [R] (trunk .3 knee 1.4); NEXT shot: duel_club_land — hoplite's hands clear of the turf.

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- open-melee-strike-clock [S] [attempts: 1] — 306: triggerAttack starts a cocked clubber's heavy swing at its commit (landing 80 ms after the call, was ~330). Critic: the pair's right-hand clubbers are a stride or more from any blue, the call never issues there; melee_club_drop at +32 ms looks the same whatever the clock
- kick-above-hip [S] [attempts: 1] — 306: THROWN thighs mirrored by the throw's sign in the facing frame (struck from behind goes forward). Critic: the press man in the shot was struck from his front, the mirror never ran; the kicked knee is leftHip, the board arm's side, which the right-end lens hides
- press-close-in [S] [attempts: 1] — 304: blocked clubber (ally in lane) retargets to nearest clear-lane enemy within +1.6 m else fights as rear rank; landed press beat gated on shoulder contact. Critic: 5s line clubber reaches the shields but club ends level at hip pointing past the knights; 9s clubbers now hold cocked, no landed club visible
- stroke-cadence-and-contact-hold [R] [attempts: 1] — 303: _pressReach hip lunge + seat-first THROWN (root pitch .5, curl .35, thighs -2/-1.7, knee 1.2). Critic: only blocker 4 cleared; thrown trunk sat upright, wants it tipped back past 45 deg
- two-hand-body-swing [R] [attempts: 1] — 302: _clubStroke two-hand IK stroke, root lunge .8 m, seat-first THROWN (legs 1.5, pitch .55). Critic: crowd frames only catch ready/cock; thrown still head-lowest
- one-strike [R] [attempts: 1] — 301: one world-solved _strike, hip lunge <= .45 H; REAR_RANK_REACH 2.2. Critic: no front man within a weapon of a crown; rear clubs high
- press-landed-contact [S] [attempts: 1, rejected-kept] — 299: _contactOn landed arc + follow on board top; critic: 5s club head in air, 9s clubs at hip/shin. Code kept (d33a3d5)
- lockbox-grip-centre [P] [attempts: 1] — 298: LOCKBOX_CARRY turn .8 out .25; box still off-centre

## Notes for next iteration (max 5 lines)
- 312: [R] e425f5d: RuntimeUnit.vary(salt) (runtimeId hash) seeds animator.variety; STRIKE_LAG .45 x vary(17) once a swingsAtMan striker stops closing (_strikeReadyAt). runtimeId is a global counter, so a --only look draws other per-man values than the full focus capture (look 1564 ms vs focus 2188 ms first blow): judge from the focus capture, or look with the same --shots set. melee_club_drop now frames from 4.6 m, ~17 deg down. 311: struck-man-buckle (8d06ed0): animator.buckleUnder() called in _landMeleeBlow on a dwelling blow, before reposeNow; overlay after the flinch, cancelled by the throw. In a dense line every man is struck on the same step (the lines are synchronised), hence blockers 2 and 5: an [R] should desynchronise the line (seeded per-man phase) and vary the reaction. 310: grounded-lunge (98c137f) removed BLOW_LEAP (every man of both lines sprang to hip 1.22 from .61 at the first blow; probe) and BLOW_DROP; the hip now sinks by the lunge spread. Duel land now strikes the hoplite's board/shoulder ~45 deg with the clubber grounded. 309: drive-through (8dd8b5d) solves a stand-off fist from a club ANGLE (BLOW_DRIVE_FALL .7->1.2 over BLOW_DRIVE .3 s), point slid down the man's axis to where the arm reaches, trunk pitch .6->.9, leap settles. Bench (hoplite): club 38 deg down at land, ~65 deg at +336. Press (unsolved) blows untouched. Fist stays over the crown because the arm is aimed straight at the fist target; a fist-descent gap would bend the elbow / lower the shoulder.
- Hand session after 306 (bench, no critic): two plain men meeting no longer knock each other down (run-in speed out of topple pressure). Open-field first blow lands ~2 s (melee_club_drop, clubber -> squire at 1980 ms in 309). big_melee_2s contacts are wall shields.
- Pose bench: `node loop/scripts/bench.mjs [--attacker id --targets a,b --frames --at ms,ms --trace]` after `npm run build --prefix web`; one man on one in the open, seeded replay. Hoplite duel lands at 1104 ms. g's thrown pose passes (trunk 57 deg).
- melee_club_drop is shot 32 ms after the land: a struck-react pose must be set on the land step (or move the shot to land + ~120 ms by an evidence commit). Struck men's flinch is held BLOW_DWELL on a dwelling blow (simulationSystem holdFlinch).
- A sim change reshuffles big_melee and the camera follows: watch camera framing. Focus capture ~2.5 min. File edits keep each file's EOL (STATE/LEDGER/capture.mjs LF, LOG.md CRLF). Do not chain shell commands.
