# Loop state
Iteration: 305   Last re-audit: 305   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-305):
battle-feel: e FAIL f PASS g FAIL h PASS (2/4) (h cleared by [R] 065ba9e, 242; g's blocker moved from e by hand after 304)
- e FAIL (list written by re-audit 304, kept by re-audit 305; blocker 1 struck by 305.1 b3af71a) [S since: 1; rejected since: 1 (304 0d0a413 reverted)] B: 2 big_melee_2s/2150ms: the 150 ms pair shows no club coming down (right-hand red clubbers: the edge club vertical in both frames, the diagonal one holds its angle, the one at the mammoth's hind foot level at hip height); 3 closeup_weapon_reads: no red knight's blade meets a body, nothing follows through (the knight right of centre carries his blade level at shoulder height across his chest into open air; r3c1 arm cocked well back, committed forward). Struck 1 (305): club head on the struck hoplite's shoulder/board top while he stands in his file at +64 ms, the same head on the board top at +336 ms with him thrown a metre off it. Ref trailer_3_sheet_01 r2c3, r3c1
- g FAIL (blocker moved from e by hand after 304; kept by re-audit 305, narrowed by 305.2 f796087) [S since: 1; rejected since: 0] B: 1 press_clubbers_blow (side-on, 336 ms after the landing): the head-first torpedo is gone (helmet highest, seat lowest, trunk ~45 deg, shield off the trunk), but no leg reads at or above the hip (both hang under the pelvis in a V, the kicked thigh down-forward ~45 deg) and the hips sit below the shoulders — TABS r2c3: one knee carried at thigh height with the shin up, hips the high point, trunk dipping ~60 deg; what remains of the blocker is the raised leg and the seat leading. Ref trailer_3_sheet_01 r2c3, trailer_3_sheet_03 r1c2-r1c3
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
BASE 7760def (iter 305; re-audit 305: no flips, e and g lists kept; two criteria fail, so two [S] picks on different criteria)
- [S] press-contact-dwell (battle-feel.e blocker 1) — b3af71a — APPROVE (blocker 1 struck)
- [S] hip-led-launch (battle-feel.g blocker 1) — f796087 — APPROVE (blocker 1 narrowed)
- evidence eca8c11: press_clubbers_blow shot at +336 ms (the top of the dwelled throw), not +224

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] press-contact-dwell (b3af71a) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [S] hip-led-launch (f796087) VERDICT: APPROVE CRITERION: battle-feel.g FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.g kick-above-hip — blocker 1: thigh world angles from the hip's live world rotation (or laid out against the throw direction, not a fixed -z) so one knee reads at or above the hip toward the striker — ref r2c3 — ours press_clubbers_blow
2. [S] battle-feel.e open-melee-strike-clock — blocker 2: a clubber cocked in reach in the open melee brings the club down within 150 ms (contact-gated drop outside the press beat) — ref r2c3 — ours big_melee_2s/2150ms
3. [S] battle-feel.e sword-cut-contact — blocker 3: the knight's cut arcs from the cocked-back arm onto the man in reach and holds a frame on him, not level across the chest into air — ref r3c1 — ours closeup_weapon_reads
4. [S] battle-feel.g pelvis-high-tumble — blocker 1: after BLOW_THROW_HOLD the man keeps pitching about the pelvis so the hips become the high point and he comes over end over end into the landing — ref trailer_3_sheet_03 r1c2, trailer_2_sheet_02 r1c2 — ours press_clubbers_blow
5. [S] battle-feel.e club-swing-through — blocker 2 (fallout of 305.1, replaces the follow pin): hands down past the hip after the dwell, club head to turf beside the thrown man, instead of a pole propped on the board top — ref r2c3 — ours press_clubbers_blow
(no [P]: neither remaining defect is a constant)
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
- 305: the dwell (BLOW_DWELL .12 s, _pendingLaunches) and the hip-led throw (hip anchored over the root, THROWN thighs as world angles with the root pitch taken out) were approved. The kicked leg reads down-forward in the gallery shot though a one-on-one probe (clubber vs hoplite, struck from the front) showed it up at hip height: the gallery man was struck from behind (root pitch +1, so legKick - r.x = -2.9 and the fixed -z lay-out mirrors); lay the legs out against the throw direction (sign of Dot(dir, facing)) and raise legKick, and check for any hip-angle wrap.
- Critic's unscored code defect on 305.1 (melee.heavy has splashRadius .5, so the zeroed knockback of a dwelling blow reached the neighbours in the splash) was fixed by hand after 305: _applySplashDamage takes a primaryImpulse, the neighbours get the real push, only the struck man's is held back.
- The striker's side at +64 ms: in the focus hit shot the striker's hands are over his head on the butt, the club arriving as a pole (critic defect 1); club-swing-through (ranked 5) is the follow-up. melee_club_drop still carries a spurious `scene not ready after -1 renders` note though the shot lands: an evidence fix, not a gap.
- Probe pattern (no main.ts hook needed): a scratchpad playwright script with createRequire('C:/Git/MOVBattle/loop/scripts/x.js') for playwright, vite preview on 4199 (kill both pids after), spawnUnit + startBattleImmediate for an isolated pair, frameCamera side-on; or runScenarioGalleryValidation("gallery_press_clubbers") + getHitLog like capture.mjs. System.Drawing (PowerShell) crops/zooms pngs; no PIL or sharp here.
- A sim change reshuffles big_melee and the camera follows (mammoth filled 2s-9s at 304-305): watch camera framing. Focus capture ~2.5 min. File edits keep each file's EOL (STATE/LEDGER LF, LOG.md CRLF). Do not chain shell commands.
