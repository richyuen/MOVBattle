# Loop state
Iteration: 301   Last re-audit: 300   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-300):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL plateau (list written by re-audit 295, kept at 300) [S since: 4 (296 3dd543e, 297 18ad559, 298 83a42ef, 300 7f84d8e); rejected since: 1 (299 d33a3d5 kept); [R] rejected since: 1 (301 477811d reverted)] B: 1 no big_melee frame shows a club landed on a board top or head: big_melee_5s halo man and clubbers behind hold clubs up and forward ~45 deg over the pile; big_melee_9s clubs raised or level among the bodies, none on a crown; big_melee_2s/2150ms right-hand clubs upright or level at shin height (press_clubbers_blow alone brings the club down ~20-25 deg onto the board rim under 477811d); 2 big_melee_2s/2150ms: rear-rank red clubbers hold clubs up (near-vertical over the man ahead) and the 150 ms pair shows no stroke coming down; 3 closeup_weapon_reads: no red knight's blade meets a body, nothing follows through (r3c1 arm cocked well back, committed forward); 4 press_clubbers_blow: the thrown hoplite goes over inverted, head-first — TABS r2c3 seat-first, legs swinging up. Ref trailer_3_sheet_01 r2c3, r3c1
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-300; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i-p all PASS (8/8) (first scored 281; o d930bf5 287; n 5deb87c 289; i 2dedac6 291; k a73812a 292; l b22b07e 293; j 6eeeb65 294; m cce136e 296; p 81ea78f 301)
Total tier 1 24/24; tier 2 23/24; tier 3 29/29.

## Focus (every gap this iteration)
BASE c455ca3 (iter 301; no re-audit due; no [P] fallout listed; the pair rule could not differ from 300: only e and p were FAIL)
- [R] one-strike (battle-feel.e blockers 1-3) — 477811d — REJECT, reverted 9023bc0 (struck none; e stays plateau)
- [S] ring-sword-rises (vfx.p blocker 4) — 81ea78f — APPROVE (vfx.p flips to PASS)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [R] one-strike (477811d) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [S] ring-sword-rises (81ea78f) VERDICT: APPROVE CRITERION: vfx.p PASS (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [R] battle-feel.e reach-closing-strike — blockers 1, 2, 4: the striker's root (sim position, not the posed hip) closes to weapon reach before the blow lands so the club head ends on a crown or board top in the crowd; rear ranks out of reach lower the club to carry instead of holding it cocked/high; the blow throw pivots seat-first about the hips (runtimeUnit.ts) — ref trailer_3_sheet_01 r2c3 (r3c1 for blades) — ours big_melee_5s, press_clubbers_blow

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- one-strike [R] [attempts: 1] — 301: one world-solved _strike (cock, slam, weapon across crown/board top >= 25 deg fall, hip lunge <= .45 H + spring <= .3 H, rear ranks to .8 rad over the man ahead, blades only in reach), replacing press-beat arm, ready cock and _aimBlow; REAR_RANK_REACH 2.2. Critic: in big_melee no front man within a weapon of a crown, so clubs still up/level; rear clubs held high; throw still head-first
- press-landed-contact [S] [attempts: 1, rejected-kept] — 299: _contactOn (crown or near-face board top) for the landed press arc + _aimBlow follow ends on board top; critic: 5s club head in the air over the pile, 9s clubs at hip/shin height. Code kept (d33a3d5)
- lockbox-grip-centre [P] [attempts: 1] — 298: LOCKBOX_CARRY turn .8 out .25; box still ~1/4 width off-centre (placed from hands' midpoint, arms asymmetric)
- press-blow-rebuild [R] [attempts: 1] — 294: one _pressStrike pose for clubs + blades (cock: fist behind head, weapon back over shoulder; land: IK arm at struck man's crown), blade_slash windup to the cock, REAR_RANK_REACH 2.4. Critic: rear rank holds the cock all beat, front man ~2 bodies off so club stops in the air; knights land on men 3-5 m off
- press-second-rank-blow [attempts: 1] — 293: over-rank pending blow (REAR_RANK_REACH band + _allyBetween) + BLOW_STEP 1.3 hip lunge; no shot shows a club landing over a rank
- press-blow-in-crowd [attempts: 1, dropped] — 292: shield-wall break where a board-less melee man stands in the row + queue skip; rank-1 clubbers still >1 m behind protectors
- press-blow-off-feet [attempts: 1, dropped; approved on 2nd at 291] — 290: no capture framing showed the laid-out body
- press-throw-airborne [attempts: 1, dropped] — 288: fixed min lift 4.4 / back 1.6 m/s on the blow throw; struck man hidden in both press shots

## Notes for next iteration (max 5 lines)
- 302: only battle-feel.e is FAIL and it is plateau ([R] only), so fewer than 2 [S] are pickable: run the re-audit first (step 2); it may rewrite e's blockers (clearing plateau). 294 [R] predates the 295 list, so e is not yet deferred (1 [R] rejected since).
- 301 probe: tribal clubbers stand short (shoulder ~.93 m, fist ~1.3) vs blue crowns ~1.6 m; front clubbers sit 1.0-2.6 m from their nearest man, many beyond arm+club. A posed hip lunge did not read; the critic wants the sim root moved into reach before the blow (simulationSystem _processUnitDecision contactDistance/meleePressGap) plus seat-first throw.
- Probe pattern: temp `(window as any).__sim = simulation` in main.ts (never committed), playwright via createRequire(loop/scripts/package.json), vite preview on 4199; animator privates readable from page.evaluate.
- Focus capture ~3 min; `--only a,b` takes a comma list. melee_club_drop times out on render-ready but the frame is complete. Python/node file edits: keep each file's EOL.
- No [P] on rows approved within 20 iterations, except critic fallout. vfx.p fallout (ring blades .7 H -> ~1.0 H) only if a re-audit reopens vfx.p.
