# Loop state
Iteration: 165   Last re-audit: 165   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a FAIL b PASS c FAIL d PASS (2/4) — a: braced boards stand upright now but never overlap into a wall and fall flat out of contact; c: lineup units share one symmetric stance
unit-look: a PASS b PASS c FAIL d PASS (3/4) — c: constant-width limb prisms with a joint break, hand a wrist-width nub, box torso
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: shadows are a faint smudge on the grass cards, sky one flat teal
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 20/24.

## Focus (every gap this iteration)
BASE b0929e1
- [S] camera.d result-giant-headless (529aaa0) — APPROVE, criterion FAIL -> PASS
- [S] battle-feel.a shield-wall-brace (1cd00d4) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] result-giant-headless (529aaa0) VERDICT: APPROVE CRITERION: camera.d PASS (previous: FAIL)
- GAP: [S] shield-wall-brace (1cd00d4) VERDICT: APPROVE CRITERION: battle-feel.a FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] battle-feel.a shield-rank-slotting [0] — carriers take adjacent front-rank slots beside the nearest allied carrier so boards overlap by a third, others file behind (simulationSystem; contactBias spent) — ref tabs_screenshot_06 — ours big_melee_2s
2. [S] battle-feel.a shield-carry-upright [0] — upright square board as the living carry (walk and idle), shove only adds the arm lock; survives stagger (proceduralAnimation `_squareShield`) — ref tabs_screenshot_06 — ours big_melee_2150ms
3. [S] battle-feel.c idle-stance-variants [0] — per-unit asymmetric idle stances: weight on one leg, weapon arm cocked, head turn (idle legs/arms spent as [P]) — ref trailer_3_sheet_01 r1c2 — ours lineup_medieval
4. [S] unit-look.c tapered-limbs [0] — limbs tapering to wrist/ankle, wedge torso (bodyBuilder) — ref tabs_screenshot_08 — ours closeup_pair_zeus_thor
5. [S] maps-light.b unit-shadows-lost-on-grass [0] — a shadow receiver that reads over the grass cards (mapBuilder blades, main shadowGen) — ref tabs_screenshot_06 — ours lineup_medieval
6. [S] battle-feel.d upright-losers-at-result [0] — losing-team bodies still standing when the result is called (three blue archers): rout/collapse state at result — ref gameplay_sheet_02 r1c2 — ours big_melee_result
7. [S] maps-light.b sky-gradient-dome [0] — sky dome graded lighter toward the horizon (mapBuilder by _createClouds) — ref tabs_screenshot_01 — ours war_machines_3800ms
8. [S] unit-look.c mitt-not-readable [0] — mitt wider than the wrist with a thumb facet (bodyBuilder mitt()) — ref tabs_screenshot_08 — ours closeup_pair_zeus_thor

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still, pushes further toward shards
- plank-corpses [attempts: 2, 1 approved 164] — 163: 2-in-5 flank landing + sagittal curl lay in the ground plane, a flat strip
- dust-ring-grey [attempts: 1, spent] — stone (0.92,0.8,0.55) still rendered neutral grey; colour is not the cause
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare
- cannonball-team-navy [attempts: 1] — near-black stone: no shot in flight in either frame, claim not visible
- fireball-burns-cream (= cannon-impact-balls) [attempts: 2] — emissives under white: lemon paint
- giant-lean-cuts-blue [attempts: 1] — GIANT_LEAN 0.25: the cut moved to red's rear
- result-foreground-club [attempts: 2] — sideOn fov 0.65 + radius x1.23: clubs still across the bottom third

## Notes for next iteration (max 5 lines)
- Tuned values and spent gaps live in LEDGER.md: read it before touching any constant. Structural gaps are the point now; a [P] gap is only fallout of an approved [S]. No [P] was ranked in 165.
- Edit with a scratchpad EOL-aware node patch script (sources CRLF, loop/*.md LF); commit per gap with `git commit <paths> -F -`. big_melee outcome changes run to run. `console.error` in page code lands in summary.json consoleErrors: use it (temporarily) to see scores instead of guessing.
- Result shot: `_pickSubject` scores places by cuts minus winners shown by facing (ShotBody fx/fz = sin/cos of root yaw, front is +z for men and vehicles). Giant subject = eye 1 up, pitch 0.12. Critic: men are small (12% of band height) and the bottom quarter is bare grass; if reopened, add a foreground rule (eye within ~6 of the nearest facing survivor), do not re-tune.
- Shield: board is the `/shield$/` child of leftHand, face +z, rest rotation zero; `_squareShield` (end of animator update) turns it square to root yaw, gated by shove*(1-limp), so it drops flat on stagger or out of contact; blue kites did not visibly square in stills. Brace arm lock lives in the shove overlay.
- Corpses: root pivot is the feet, Euler YXZ, face +z; `_layCorpseFlat` + `_writeDeathRest` own the rest pose; bounds of a corpse reach below y = 0.
