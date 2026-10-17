# Loop state
Iteration: 306   Last re-audit: 305   Consecutive rejects: 1   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-305):
battle-feel: e FAIL f PASS g FAIL h PASS (2/4) (h cleared by [R] 065ba9e, 242; g's blocker moved from e by hand after 304)
- e FAIL (list written by re-audit 304, kept by re-audit 305; blocker 1 struck by 305.1 b3af71a) [S since: 1; rejected since: 2 (304 0d0a413, 306 9bb24df, both reverted)] B: 2 big_melee_2s/2150ms: the 150 ms pair shows no club coming down (right-hand red clubbers: the edge club vertical in both frames, the diagonal one holds its angle, the one at the mammoth's hind foot level at hip height; 306: no blue is within reach of any right-hand red clubber in either frame, the front is at the tusks, so a strike-call mechanism never shows here); 3 closeup_weapon_reads: no red knight's blade meets a body, nothing follows through (the knight right of centre carries his blade level at shoulder height across his chest into open air; r3c1 arm cocked well back, committed forward). Struck 1 (305): club head on the struck hoplite's shoulder/board top while he stands in his file at +64 ms, the same head on the board top at +336 ms with him thrown a metre off it. Ref trailer_3_sheet_01 r2c3, r3c1
- g FAIL (blocker moved from e by hand after 304; kept by re-audit 305, narrowed by 305.2 f796087, kept by 306) [S since: 1; rejected since: 1 (306 8bf659b reverted)] B: 1 press_clubbers_blow (side-on, 336 ms after the landing): the head-first torpedo is gone (helmet highest, seat lowest, trunk ~45 deg, shield off the trunk), but no leg reads at or above the hip (both hang under the pelvis in a V, the kicked thigh down-forward ~45 deg) and the hips sit below the shoulders — TABS r2c3: one knee carried at thigh height with the shin up, hips the high point, trunk dipping ~60 deg; what remains of the blocker is the raised leg and the seat leading. 306 critic: from the 883d669 lens the kicked thigh now reads level with the pelvis toward the striker (knee at hip height, shin down); the seat-leading half does not read. Ref trailer_3_sheet_01 r2c3, trailer_3_sheet_03 r1c2-r1c3
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-305; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i-p all PASS (8/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294; m cce136e 296; p 81ea78f 301; confirmed 302-305)
Total tier 1 24/24; tier 2 22/24; tier 3 29/29.

## Focus (every gap this iteration)
BASE 20d53ca (iter 306; only e and g fail, so the pair (e, g) repeats 305's: the two-different-criteria rule wins over the not-the-same-pair rule)
- [S] kick-above-hip (battle-feel.g blocker 1) — 8bf659b — REJECT (reverted 9526239: the press man in the shot was struck from his front, the mirror branch never ran for him)
- [S] open-melee-strike-clock (battle-feel.e blocker 2) — 9bb24df — REJECT (reverted 070415f: no right-hand clubber is in reach in the pair, the strike call never issues)
- evidence 883d669 (kept): press_clubbers pair taken at the first blow whose man flies clear of his mates, lens at his right-hand end of the line

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] kick-above-hip (8bf659b) VERDICT: REJECT CRITERION: battle-feel.g FAIL (previous: FAIL)
- GAP: [S] open-melee-strike-clock (9bb24df) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e strike-on-arrival — blocker 2: a closing clubber whose target is within reach + one stride starts the heavy swing's drop on the run, timed to BLOW_LAND as he arrives, so clubs are mid-fall at the line — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s/2150ms (prove the clock with a pair bracketing the call: melee_club_drop at the call frame and +150 ms)
2. [S] battle-feel.g flight-tumble — blocker 1: the root pitch keeps turning about the pelvis through BLOW_THROW_SECONDS (an angular rate, not the fixed _blowStaggerLean) so by +336 ms the hips are the high point and the trunk has dipped ~60 deg, head below the hips — ref trailer_3_sheet_01 r2c3, trailer_3_sheet_03 r1c2-r1c3 — ours press_clubbers_blow
3. [S] battle-feel.e sword-stroke-on-the-man — blocker 3: the knight's slash aimed and pinned on the target's trunk at its land with a follow-through past him (the clubber's _aimBlow + BLOW_FOLLOW for slashes) — ref trailer_3_sheet_01 r2c3, r3c1 — ours closeup_weapon_reads
4. [S] battle-feel.g right-leg-kick — blocker 1: the kicked knee on the right (spear-side, board-free) hip, the near leg at the capture's preferred right end, so the raised leg is never the occluded far one — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_blow
5. [S] battle-feel.e run-carried-club — blocker 2: the cocked club arcs with the stride on the charge (the ready hold is a swing, not a frozen vertical) so no club holds one angle across 150 ms — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s/2150ms
(no [P]: no approved [S] in the last 3 iterations lists fallout)
Watch only (PASS, not pickable): vfx.o fireball not visible in throw_casters_flight (re-audit 303, unchanged code, noise).

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
- 306: both [S] were rejected as "mechanism not visible in the named shot", no regressions. capture.mjs now seeds Math.random and reseeds at every resetBattle (hand, after 306), so a --only look shows the critic's frame; before that the first press blow landed anywhere from 272 to 640 ms run to run. 883d669 takes candidate blows in turn in one pass (first whose man is airborne and .55 m clear of mates, else the last) and prefers the lens at the thrown man's right-hand end (the board on his left arm hides him). The kicked leg is leftHip: a kick on the right hip (ranked 4) or a lens rule change would show it.
- Hand session after 306 (bench, no critic): e blocker 2's cause is sim-side. Two men charging head-on topple each other (toppled ~0.8 s, no attack till ~1.75 s after contact), so at big_melee_2s the front is down or recovering and no club falls; the blow then lands at shoulder contact (roots 0.87 m, nearer than the 0.9 m club), the club hanging in the gap. Strike-on-arrival cannot fire (contact 0.1 s after engage range at 8.7 m/s closing; a blow takes 0.32 s) and an animator-only fix did not read better: tried and reverted. Needs a design call from the user: soften head-on charge topples between two men, or start the windup on the run. e blocker 3 is shot timing: in the duel the squire's blade lands overhead on the hoplite's board/shoulder (bench: tip 0.19 m from the strike point).
- Pose bench: `node loop/scripts/bench.mjs [--attacker id --targets a,b --frames --at ms,ms --trace]` after `npm run build --prefix web`; one man on one in the open, measured by seeded replay (reading world matrices every frame changes the sim). g's thrown pose passes it since 203b0ca (trunk 57/58 deg, kicked thigh ~20 deg under level toward the striker). Re-aim candidates: g blocker 1 and e blocker 3 to duel_club_thrown / duel_club_land (59bcad4). Blocker drift: 'hips the high point, shin up' is not in r2c3 (that man flies face-first, hip extended); spec from the tile, not the wording.
- The `scene not ready after -1 renders` note on melee_club_drop was the capture's 30 s race losing to the game's 40-render loop; the race is now 120 s (hand, after 306). A blocker whose shot cannot show its element may now be re-aimed by an evidence commit (ITERATE step 3): e blocker 2 is the first candidate (big_melee pair -> melee_club_drop). Autoloop was turned off during 306 by the user.
- A sim change reshuffles big_melee and the camera follows (mammoth fills 2s-9s since 304): watch camera framing. Focus capture ~2.5 min. File edits keep each file's EOL (STATE/LEDGER/capture.mjs LF, LOG.md CRLF). Do not chain shell commands.
