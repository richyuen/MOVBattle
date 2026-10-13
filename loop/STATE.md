# Loop state
Iteration: 160   Last re-audit: 160 (old 1-5 scale)   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
unscored — the loop was rebuilt after iteration 160 (coarse-to-fine, ledger, criteria scoring, motion pairs).
Iteration 161 must re-audit. Old scores for reference: battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3 (flat since iteration 37).

## Focus (every gap this iteration)
- none yet

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-burns-cream (54419bd) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: cannonball-team-navy (4323c48) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: press-arms-level (37490d3) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: tribal-hair-skullcap (dd9fe79) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: grass-bare-raised-eye (9aaad4a) VERDICT: REJECT SCORE: maps-light 4/5 (previous: 4/5)
- GAP: shoulder-bead (18aa309) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: shields-never-lap (f3e7896) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, tags and attempts in brackets)
- none: the re-audit at iteration 161 writes this list. The pre-rebuild list was all [P] constant nudges on criteria that never moved; it is not carried over.

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare
- cannonball-team-navy [attempts: 1] — near-black stone: no shot in flight in either frame, claim not visible
- fireball-burns-cream (= cannon-impact-balls) [attempts: 2] — emissives under white: lemon paint
- giant-lean-cuts-blue [attempts: 1] — GIANT_LEAN 0.25: the cut moved to red's rear
- result-foreground-club [attempts: 2] — sideOn fov 0.65 + radius x1.23: clubs still across the bottom third
- catapult-goalpost [attempts: 2] rejected-kept — arm -0.1, dark cw, team axle: posts still set the height
- run-arms-one-splay [attempts: 1] — phase +PI: exact mirrors, a jumping-jack flap
- impact-dust-house-sphere [attempts: 2] — fireScale cap 1.35: still 2.5 men, a snowman

## Notes for next iteration (max 5 lines)
- Tuned values and spent gaps live in LEDGER.md: read it before touching any constant. Structural gaps are the point now; a [P] gap is only fallout of an approved [S].
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65. Pale accent on "metal" renders black: use "stone".
- Commit per gap with `git commit <path> -F -`; revert rejects newest first. The big_melee outcome and result shot change run to run: do not attribute them to one patch.
- wrapAsBody's 3rd arg is recoloured to the team colour (unitFactory:359). Mammoth hips at x +-0.46. Capture now has motion pairs (1100/1250 ms, 2 s/2150 ms); add shots via a `loop(N.0): evidence` commit when a gap cannot be seen.
