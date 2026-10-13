# Loop state
Iteration: 162   Last re-audit: 161   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d FAIL (2/4) — c: lineup units are vertical posts, arms hung symmetric; d: corpses and airborne bodies are straight planks
unit-look: a PASS b PASS c FAIL d PASS (3/4) — c: sphere joint caps between square sticks read as a mannequin
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: no long cast shadows under the crowd or mammoth
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b FAIL c PASS d PASS (3/4) — b: heart is lobed now but cream-white, not fire; dust lumps render grey and read as rocks; no ball in flight
Total 19/24.

## Focus (every gap this iteration)
BASE bb2c72f
- [S] camera.d result-shot-occluded (4d3c275) — APPROVE, criterion PASS
- [S] vfx.b burst-heart-round-ball (099c7de) — APPROVE, criterion still FAIL
- [P] vfx.b dust-ring-grey (cb39a22) — REJECT, reverted by ce6b113

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] result-shot-occluded (4d3c275) VERDICT: APPROVE CRITERION: camera.d PASS (previous: FAIL)
- GAP: [S] burst-heart-round-ball (099c7de) VERDICT: APPROVE CRITERION: vfx.b FAIL (previous: FAIL)
- GAP: [P] dust-ring-grey (cb39a22) VERDICT: REJECT CRITERION: vfx.b FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] vfx.b dust-burst-unread [0] — unlit tan ground-hugging puff bank wider than the fireball, replacing the grey ring lumps (find why "stone" goes grey and bypass it; not the spent self-lit mound) — ref trailer_3_sheet_03 r2c1 — ours war_machines_1100ms
2. [S] vfx.b burst-white-not-fire [0] — two-tone fire material split: yellow core lobes, orange outer shards and skirt (a new split, not a re-tune of the spent emissives) — ref trailer_3_sheet_03 r1c1 — ours war_machines_3800ms
3. [S] battle-feel.d plank-corpses [0] — limp landed pose state: folded knees, arms flopped, torso twisted — ref tabs_screenshot_01 — ours war_machines_3800ms
4. [S] battle-feel.c statue-idle [0] — ready-stance pose state: bent knees, forward torso, weapon arm raised (not the spent idle lean) — ref tabs_screenshot_06 — ours lineup_medieval
5. [S] unit-look.c ball-joint-mannequin [0] — thinner longer forearms ending in oversized mitts, no tube arms (bodyBuilder.ts) — ref tabs_screenshot_01 — ours closeup_pair_zeus_thor
6. [S] vfx.b no-ball-in-flight [0] — larger black ball with a short dark trail so the shot reads mid-air — ref trailer_3_sheet_03 r2c1 — ours war_machines_1250ms
7. [S] maps-light.b no-battle-shadows [0] — lower sun, longer shadow frustum over the battle area — ref tabs_screenshot_08 — ours big_melee_result
8. [P] vfx.b heart-lobe-dome [0] — visualEffects.ts LOBES[0] size 0.95 -> 0.75; fallout of [S] burst-heart-round-ball (162)

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- dust-ring-grey [attempts: 1, spent] — stone (0.92,0.8,0.55) still rendered neutral grey; colour is not the cause
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare
- cannonball-team-navy [attempts: 1] — near-black stone: no shot in flight in either frame, claim not visible
- fireball-burns-cream (= cannon-impact-balls) [attempts: 2] — emissives under white: lemon paint
- giant-lean-cuts-blue [attempts: 1] — GIANT_LEAN 0.25: the cut moved to red's rear
- result-foreground-club [attempts: 2] — sideOn fov 0.65 + radius x1.23: clubs still across the bottom third
- catapult-goalpost [attempts: 2] rejected-kept — arm -0.1, dark cw, team axle: posts still set the height
- run-arms-one-splay [attempts: 1] — phase +PI: exact mirrors, a jumping-jack flap

## Notes for next iteration (max 5 lines)
- Tuned values and spent gaps live in LEDGER.md: read it before touching any constant. Structural gaps are the point now; a [P] gap is only fallout of an approved [S].
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65. Pale accent on "metal" renders black; "stone" renders any tan as neutral grey (two values tried): dust must be an "unlit"-category material.
- Commit per gap with `git commit <path> -m`; bash heredocs break here, write scripts with the Write tool; sed -i turns CRLF files to LF. The big_melee outcome and result shot change run to run.
- Result shot (cameraController `_pickSubject`): subject chosen by fewest frame cuts; passed with the mammoth whole. If camera.d reopens, add a facing/fill term, do not re-tune BAND, knot or cut weight.
- Burst heart is the LOBES table in spawnExplosionBurst; fire died out by 1250 ms with two stray white tiles left. wrapAsBody's 3rd arg is recoloured to the team colour (unitFactory:359). Mammoth hips at x +-0.46.
