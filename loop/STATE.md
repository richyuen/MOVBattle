# Loop state
Iteration: 163   Last re-audit: 161   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d FAIL (2/4) — c: lineup units are vertical posts, arms hung symmetric; d: landed corpses are flat T's and planks on edge
unit-look: a PASS b PASS c FAIL d PASS (3/4) — c: sphere joint caps between square sticks read as a mannequin
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: no long cast shadows under the crowd or mammoth
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b FAIL c PASS d PASS (3/4) — b: fire is cream-white glass shards; dust is tan now but an ankle-high dark slab; no ball in flight
Total 19/24.

## Focus (every gap this iteration)
BASE d75119e
- [S] vfx.b dust-burst-unread (f14b41f) — APPROVE, criterion still FAIL
- [S] battle-feel.d plank-corpses (f94e647) — REJECT, reverted by c1a258a
- [P] vfx.b heart-lobe-dome (d523f23) — REJECT, reverted by 5b5abb9

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] dust-burst-unread (f14b41f) VERDICT: APPROVE CRITERION: vfx.b FAIL (previous: FAIL)
- GAP: [S] plank-corpses (f94e647) VERDICT: REJECT CRITERION: battle-feel.d FAIL (previous: FAIL)
- GAP: [P] heart-lobe-dome (d523f23) VERDICT: REJECT CRITERION: vfx.b FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] vfx.b burst-white-not-fire [0] — two-tone unlit fire: fat yellow core lobes inside an orange lobe shell, spikes cut to a few short orange flecks — ref trailer_3_sheet_03 r1c1/r2c1 — ours war_machines_3800ms
2. [S] battle-feel.d plank-corpses [1] — out-of-plane landed poses for back/front corpses too (knee propped vertical, arm across chest, head rolled, asymmetric) and a drape-height lift on other corpses — ref tabs_screenshot_01 — ours big_melee_result
3. [S] vfx.b no-ball-in-flight [0] — larger ball with a short dark trail on a slower visible arc from muzzle to target — ref trailer_3_sheet_03 r2c1 — ours war_machines_1250ms
4. [S] battle-feel.c statue-idle [0] — per-unit idle stance variants: weight on one leg, hip shift, one arm cocked, head tilt (not the spent idle lean) — ref trailer_3_sheet_01 r1c2 — ours lineup_medieval
5. [S] maps-light.b no-battle-shadows [0] — elongated sun-direction shadow casters for large and massed units — ref tabs_screenshot_01 — ours big_melee_5s
6. [S] unit-look.c ball-joint-mannequin [0] — tapered overlapping limb segments without ball joints — ref trailer_3_sheet_01 r1c2 — ours closeup_pair_zeus_thor
7. [P] vfx.b dust-bank-slab [0] — visualEffects.ts dust `tall` 0.5 - 0.18*spread -> 0.9 - 0.3*spread, tans lightened toward (0.8, 0.6, 0.35); fallout of [S] dust-burst-unread (163)
8. [S] vfx.b dust-no-billow [0] — puffs that keep swelling and lift off the ground as the fire dies — ref trailer_3_sheet_03 r2c1 — ours war_machines_1250ms

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still, pushes further toward shards
- plank-corpses [attempts: 1] — 2-in-5 flank landing + sagittal curl: on a flank the curl lies in the ground plane, still a flat strip; none of ~30 dead read as curled
- dust-ring-grey [attempts: 1, spent] — stone (0.92,0.8,0.55) still rendered neutral grey; colour is not the cause
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare
- cannonball-team-navy [attempts: 1] — near-black stone: no shot in flight in either frame, claim not visible
- fireball-burns-cream (= cannon-impact-balls) [attempts: 2] — emissives under white: lemon paint
- giant-lean-cuts-blue [attempts: 1] — GIANT_LEAN 0.25: the cut moved to red's rear
- result-foreground-club [attempts: 2] — sideOn fov 0.65 + radius x1.23: clubs still across the bottom third

## Notes for next iteration (max 5 lines)
- Tuned values and spent gaps live in LEDGER.md: read it before touching any constant. Structural gaps are the point now; a [P] gap is only fallout of an approved [S].
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; bloom threshold 0.65. No environment texture: an "unlit" material shows only its emissive (`_fxMat(Color3.Black(), colour)`); lit tans go grey. Dust emissive (0.62,0.36,0.12) rendered khaki-olive, darker than the grass.
- Commit per gap with `git commit <path> -m`; edit via a node script in the scratchpad (quoted heredoc works), EOL-aware; sed -i turns CRLF files to LF. big_melee outcome changes run to run.
- Corpses: root pivot is the feet, Euler order YXZ: at rot.x = +-90 deg any rot.z is flat; a flank needs rot.z = +-90 deg AND rot.x = k*PI. Limp pose keeps every fold in the ground plane on purpose: the next try must stand folds up out of it (knee tent exists as `tent`), for back/front corpses too. Downed living bodies use the same limp overlay.
- Burst heart is the LOBES table in spawnExplosionBurst; the critic wants lobes dominant and spikes minor. Result shot (`_pickSubject`): if camera.d reopens add a facing/fill term, do not re-tune.
