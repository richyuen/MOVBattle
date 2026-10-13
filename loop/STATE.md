# Loop state
Iteration: 164   Last re-audit: 161   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d FAIL (2/4) — c: lineup units are vertical posts, arms hung symmetric; d: some limbs stand up now, but heaps are ankle-high flat slabs on one ground plane
unit-look: a PASS b PASS c FAIL d PASS (3/4) — c: sphere joint caps between square sticks read as a mannequin
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: no long cast shadows under the crowd or mammoth
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b FAIL c PASS d PASS (3/4) — b: fire is yellow/orange now but flat plates with no hot heart; dust is a row of pale lumps; no ball in flight
Total 19/24.

## Focus (every gap this iteration)
BASE 0813373
- [S] vfx.b burst-white-not-fire (0136987) — APPROVE, criterion still FAIL
- [S] battle-feel.d plank-corpses (f65e867) — APPROVE, criterion still FAIL
- [P] vfx.b dust-bank-slab (0f7fa5f) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] burst-white-not-fire (0136987) VERDICT: APPROVE CRITERION: vfx.b FAIL (previous: FAIL)
- GAP: [S] plank-corpses (f65e867) VERDICT: APPROVE CRITERION: battle-feel.d FAIL (previous: FAIL)
- GAP: [P] dust-bank-slab (0f7fa5f) VERDICT: APPROVE CRITERION: vfx.b FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] vfx.b fire-flat-plates [0] — pale near-white unlit heart blob inside the largest lobes, and lobes/shells as rounded closed solids rather than flat polyhedron plates — ref trailer_3_sheet_03 r1c1/r2c1 — ours war_machines_1100ms
2. [S] vfx.b no-ball-in-flight [0] — oversized black shot with a short dark trail, visible mid-arc between muzzle and target at 1100/1250ms (colour spent as [P]) — ref trailer_3_sheet_03 r3c1 — ours war_machines_1250ms
3. [S] battle-feel.d corpse-heap-flat [0] — corpse stacking: a body landing on a body rests on top at body thickness, tilted across it (runtimeUnit `_layCorpseFlat`) — ref tabs_screenshot_01 — ours big_melee_result
4. [S] battle-feel.c lineup-posts [0] — per-unit asymmetric idle stance state: weight on one leg, hip shifted, weapon arm low, other arm bent (idle legs/arms spent as [P]) — ref trailer_3_sheet_01 r1c2 — ours lineup_medieval
5. [S] unit-look.c mannequin-joints [0] — tapered limb segments that overlap at the joint, no sphere caps — ref tabs_screenshot_01 — ours closeup_pair_zeus_thor
6. [S] maps-light.b no-crowd-shadows [0] — long cast shadows for the crowd and the mammoth in battle shots — ref tabs_screenshot_01 — ours big_melee_5s
7. [S] vfx.b dust-sandbags [0] — dust puffs rise and shrink outward into one mound thinning at the rim — ref trailer_3_sheet_03 r1c1 — ours war_machines_1250ms
8. [P] vfx.b fire-shell-rim [0] — shell `size * 1.5` -> `size * 1.25`, coreMat emissive (1.3, 0.6, 0) -> (1.4, 0.85, 0.1); fallout of [S] burst-white-not-fire (164)

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
- Tuned values and spent gaps live in LEDGER.md: read it before touching any constant. Structural gaps are the point now; a [P] gap is only fallout of an approved [S].
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; bloom threshold 0.65. Unlit = `_fxMat(Color3.Black(), colour)`; lit tans go grey. Fire: unlit, blue 0 kept it off cream; shells are inside-out hulls (`cullBackFaces = false`), critic finds them too thick and the polyhedra flat plates with detached hexagon flecks.
- Edit with scratchpad `patch.mjs <file> <patchfile>` style node scripts (EOL-aware; sources are CRLF, loop/*.md LF); commit per gap with `git commit <paths> -F -`. big_melee outcome changes run to run.
- Corpses: root pivot is the feet, Euler YXZ, face is +z, left is -x; face up when -sin(rot.x) > 0. `_layCorpseFlat` always targets back/front and calls `animator.setLandedFace`; `_writeDeathRest` holds the per-face folds. Only leg folds showed in stills; bodies are thin and rest at y = 0 (torso half depth ~0.1), no stacking.
- Result shot (`_pickSubject`): if camera.d reopens add a facing/fill term, do not re-tune.
