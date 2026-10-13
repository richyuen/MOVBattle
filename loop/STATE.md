# Loop state
Iteration: 161   Last re-audit: 161   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d FAIL (2/4) — c: lineup units are vertical posts, arms hung symmetric; d: corpses and airborne bodies are straight planks
unit-look: a PASS b PASS c FAIL d PASS (3/4) — c: sphere joint caps between square sticks read as a mannequin
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: no long cast shadows under the crowd or mammoth
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d FAIL (3/4) — d: result shot cuts the mammoth and near bodies at the frame edge
vfx: a PASS b FAIL c PASS d PASS (3/4) — b: burst is ragged now, but the heart is still a round white ball and no dust reads
Total 18/24.

## Focus (every gap this iteration)
BASE bba353e
- [S] vfx.b impact-globe-stack (2b206c3) — APPROVE, criterion still FAIL
- [S] camera.d result-shot-occluded (ed01aef) — REJECT, reverted by 435a154

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] impact-globe-stack (2b206c3) VERDICT: APPROVE CRITERION: vfx.b FAIL (previous: FAIL)
- GAP: [S] result-shot-occluded (ed01aef) VERDICT: REJECT CRITERION: camera.d FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] camera.d result-shot-occluded [1] — re-pick the subject when no orbit place is clear (cluster farthest from giant/corpses, or the giant fitted whole) and score frame-edge cuts at any depth — ref gameplay_sheet_02 r1c2 — ours big_melee_result
2. [S] vfx.b burst-heart-round-ball [0] — 3-4 fat squashed lobes of unequal size leaning different ways, none centred; fat lobes before points — ref trailer_3_sheet_03 r1c1 — ours war_machines_1100ms
3. [S] vfx.b dust-burst-unread [0] — a low wide tan dust mesh that hugs the ground and reads in the still — ref trailer_3_sheet_03 r2c1 — ours war_machines_1250ms
4. [S] battle-feel.c statue-idle [0] — idle pose state: weight on one leg, arms out, torso sway (not the spent idle lean) — ref tabs_screenshot_06 — ours lineup_medieval
5. [S] battle-feel.d plank-corpses [0] — downed bodies draped limp and visible under the fight — ref tabs_screenshot_01 — ours big_melee_9s, war_machines_3800ms
6. [S] unit-look.c ball-joint-mannequin [0] — longer thinner tapered limb segments, smaller head, no sphere caps (bodyBuilder.ts) — ref tabs_screenshot_06/08 — ours closeup_pair_zeus_thor
7. [S] maps-light.b no-battle-shadows [0] — long soft cast-shadow mechanism from a low sun — ref tabs_screenshot_08 — ours lineup_medieval
8. [P] vfx.b dust-ring-grey [0] — visualEffects.ts dustMat to a warm tan that survives lighting, e.g. (0.92, 0.8, 0.55); fallout of [S] impact-globe-stack (161)

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- result-shot-occluded [attempts: 1] — azimuth/radius walk round one fitted target: least-bad place still had mammoth top-left, a cut body, a corpse at the eye's feet; giant only ever a blocker
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare
- cannonball-team-navy [attempts: 1] — near-black stone: no shot in flight in either frame, claim not visible
- fireball-burns-cream (= cannon-impact-balls) [attempts: 2] — emissives under white: lemon paint
- giant-lean-cuts-blue [attempts: 1] — GIANT_LEAN 0.25: the cut moved to red's rear
- result-foreground-club [attempts: 2] — sideOn fov 0.65 + radius x1.23: clubs still across the bottom third
- catapult-goalpost [attempts: 2] rejected-kept — arm -0.1, dark cw, team axle: posts still set the height
- run-arms-one-splay [attempts: 1] — phase +PI: exact mirrors, a jumping-jack flap

## Notes for next iteration (max 5 lines)
- Tuned values and spent gaps live in LEDGER.md: read it before touching any constant. Structural gaps are the point now; a [P] gap is only fallout of an approved [S].
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65. Pale accent on "metal" renders black: use "stone"; matte tan "stone" (0.75,0.68,0.5) rendered neutral grey in the burst.
- Commit per gap with `git commit <path> -F -`; revert rejects newest first. The big_melee outcome and result shot change run to run: do not attribute them to one patch.
- Burst (visualEffects.ts spawnExplosionBurst): the critic's reference read is a fat lumpy cream fire mass several men wide, not spikes; the 5 heart polyhedra merge into a globe, the clods read as big black tetrahedra. Result shot: a draw-like mixed crowd also failed it, check who is framed.
- wrapAsBody's 3rd arg is recoloured to the team colour (unitFactory:359). Mammoth hips at x +-0.46. Motion pairs at 1100/1250 ms and 2 s/2150 ms; add shots via a `loop(N.0): evidence` commit.
