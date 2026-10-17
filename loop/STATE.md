# Loop state
Iteration: 307   Last re-audit: 307   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-305):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242; g cleared by 203b0ca, re-audit 307, judged from duel_club_thrown)
- e FAIL (blockers 2 and 3 re-aimed by hand after 306 and rewritten by re-audit 307 from the shots they now name; blocker 1 struck 305) [S since: 0; rejected since: 0] B: 2 melee_club_drop_pre -> melee_club_drop: at pre the red clubbers carry their logs shouldered back (reads as cocked); at drop the front club's head stops at the second knight's hip and that knight is unchanged (mid-stride, sword raised, no flinch), the rear club's head goes into the turf by the corpse: no club meets a man (head, shoulder or board) with a reaction, unlike r2c3 where the club head drives into the leaping man's body; 3 duel_club_land: the club stands upright, its fat head above the clubber's own head, beside and behind the hoplite's board rim, not on it; only the clubber's two fists are on the board, so it reads as a two-hand shove with a raised club, and the hoplite is already doubled over before any visible contact. Struck 1 (305). Ref trailer_3_sheet_01 r2c3, r3c1
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
BASE c2ec437 (iter 307, by hand: re-audit only, no gaps picked; the user steered the session after 306)
- hand 203b0ca battle-feel.g thrown trunk set over its layers, kicked leg near straight (bench) -> re-audit CLEARED g
- hand 104a90a two plain men meeting at a run no longer topple each other -> no regression
- evidence 59bcad4 (clock reset, duel_club shots), c4f6d15 (melee_club_drop_pre, blockers re-aimed)

## Last verdicts (one line per gap, verbatim critic header)
- RE-AUDIT 307: tier 1 24/24; tier 2 23/24; tier 3 29/29. battle-feel.g FAIL -> PASS, CLEARED BY: 203b0ca. REGRESSIONS: none.

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e open-melee-landing — blocker 3: pin the heavy swing's landing to the target's board top or shoulder in open melee as in the press; the club head comes over and down onto the board, the fists follow it (proceduralAnimation.ts _aimBlow open-melee path) — ref trailer_3_sheet_01 r2c3 — ours duel_club_land
2. [S] battle-feel.e reaction-after-contact — blocker 3: the struck man's stagger/throw waits until the club head is on him, so the land frame shows contact first, recoil second (simulationSystem.ts dwell/_pendingLaunches) — ref trailer_3_sheet_01 r2c3 — ours duel_club_land / duel_club_thrown
3. [S] battle-feel.e aim-height — blocker 2: the open-melee drop targets head or shoulder line, not hip or the ground in front (heavy_swing aim in open melee; not the 306 strike-clock retiming) — ref trailer_3_sheet_01 r3c1 — ours melee_club_drop
4. [S] battle-feel.e hit-flinch — blocker 2: a man struck and not thrown takes a short visible flinch (head snapped away, trunk bent, sword arm dropped) — ref trailer_3_sheet_01 r2c3 — ours melee_club_drop
5. [S] battle-feel.e wide-windup — blocker 2: the pre frame raises the log high overhead from the shoulder, so the pair shows a big top-to-target arc — ref trailer_3_sheet_01 r2c3 — ours melee_club_drop_pre
(no [P])
Hand-session finding (bench): the open-field blow lands at shoulder contact (roots ~0.9 m, nearer than the 0.9 m club); gaps 1 and 3 are bounded by that spacing.

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
- Hand session after 306 (bench, no critic): e blocker 2's cause is sim-side. Two men charging head-on topple each other (toppled ~0.8 s, no attack till ~1.75 s after contact), so at big_melee_2s the front is down or recovering and no club falls; the blow then lands at shoulder contact (roots 0.87 m, nearer than the 0.9 m club), the club hanging in the gap. Strike-on-arrival cannot fire (contact 0.1 s after engage range at 8.7 m/s closing; a blow takes 0.32 s) and an animator-only fix did not read better: tried and reverted. User chose: two plain men meeting no longer knock each other down (run-in speed left out of topple pressure; a wall-shield bearer or a charger still bowls men over). Open field first blow now 2.6 s, all standing (melee_club_drop); big_melee_2s unchanged (its contacts are wall shields and the front has not met). e blocker 3 is shot timing: in the duel the squire's blade lands overhead on the hoplite's board/shoulder (bench: tip 0.19 m from the strike point).
- Pose bench: `node loop/scripts/bench.mjs [--attacker id --targets a,b --frames --at ms,ms --trace]` after `npm run build --prefix web`; one man on one in the open, measured by seeded replay (reading world matrices every frame changes the sim). g's thrown pose passes it since 203b0ca (trunk 57/58 deg, kicked thigh ~20 deg under level toward the striker). Re-aim candidates: g blocker 1 and e blocker 3 to duel_club_thrown / duel_club_land (59bcad4). Blocker drift: 'hips the high point, shin up' is not in r2c3 (that man flies face-first, hip extended); spec from the tile, not the wording.
- The `scene not ready after -1 renders` note on melee_club_drop was the capture's 30 s race losing to the game's 40-render loop; the race is now 120 s (hand, after 306). A blocker whose shot cannot show its element may now be re-aimed by an evidence commit (ITERATE step 3): e blocker 2 is the first candidate (big_melee pair -> melee_club_drop). Autoloop was turned off during 306 by the user.
- A sim change reshuffles big_melee and the camera follows (mammoth fills 2s-9s since 304): watch camera framing. Focus capture ~2.5 min. File edits keep each file's EOL (STATE/LEDGER/capture.mjs LF, LOG.md CRLF). Do not chain shell commands.
