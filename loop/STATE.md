# Loop state
Iteration: 176   Last re-audit: 175   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: a shield rank is one pose stamped out (same pitch, same leg phase, spears level at one height), idle men stand bolt upright and symmetric, gun crews hold one stiff pose
unit-look: a PASS b PASS c FAIL d FAIL (2/4) — c: the shoulder is now a faceted sleeve head on a tapering upper arm, but crew and tribal legs are wire, forearms and shins near-parallel tubes, padded bodies keep a square outboard nub; d: clothes are paint (a belt band, a recoloured torso), no fur collar, skirt or tabard chunk
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: a shadow is one flat tint over grass and soil and falls toward the lens, but its outline is a sawtooth of whole dark blades, hard-edged, heavy, warm brick-maroon at eye level, and merges into a mat under a crowd
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a FAIL b PASS c PASS d PASS (3/4) — a: horizon about 80% down, the fight in the bottom third under empty sky
vfx: a FAIL b PASS c PASS d PASS (3/4) — a: no spent spear or arrow stands in the ground or a body after the fight
Total 18/24.

## Focus (every gap this iteration)
BASE 25a9b56
- [S] maps-light.b shadow-shredded-by-grass (5f58b89) — APPROVE, criterion still FAIL
- [S] unit-look.c ball-shoulders-on-stick-arms (5164099) — APPROVE, criterion still FAIL
- [P] maps-light.b shadows-fall-away-from-lens (57df62e) — APPROVE, criterion still FAIL
- [P] maps-light.b shadow-rust-black (22af47c) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] shadow-shredded-by-grass (5f58b89) VERDICT: APPROVE CRITERION: maps-light.b FAIL (previous: FAIL)
- GAP: [S] ball-shoulders-on-stick-arms (5164099) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [P] shadows-fall-away-from-lens (57df62e) VERDICT: APPROVE CRITERION: maps-light.b FAIL (previous: FAIL)
- GAP: [P] shadow-rust-black (22af47c) VERDICT: APPROVE CRITERION: maps-light.b FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] maps-light.b shadow-sawtooth-hard-edge [0] — soft penumbra filter plus edge blend (blade-height fade) for root-shaded blades so a silhouette keeps a smooth outline — ref tabs_screenshot_05 — ours closeup_pair_zeus_thor
2. [S] unit-look.c wire-legs [0] — thigh mass and trouser taper for crew and tribal leg presets (bodyBuilder leg build) — ref tabs_screenshot_08 — ours war_machines_1100ms
3. [S] unit-look.d clothes-are-paint [0] — solid faceted cloth chunk (fur collar ring, skirt or tabard wedge) on tribal and knight bodies — ref tabs_screenshot_06 — ours big_melee_2s
4. [S] battle-feel.c shield-rank-one-pose [0] — per-man brace variance (pitch, leg phase, spear height) in the wall state — ref tabs_screenshot_06 — ours shield_wall_2500ms
5. [S] camera.a horizon-too-low [0] — battle camera rule that lifts the fight so sky fills only the top third; a mechanism, not a nudge of FOLLOW_DROP or _pickSubject rows — ref trailer_1_sheet_01 r2c2 — ours big_melee_2s
6. [S] maps-light.b shade-stays-warm [0] — shadow-tint term on ground and blade materials mixing shaded fragments toward a cool hue — ref tabs_screenshot_06 — ours lineup_medieval
7. [S] vfx.a spent-shafts-do-not-stand [0] — thrown spears and arrows plant in ground and bodies and persist to the result shot (projectileSystem) — ref tabs_screenshot_02 — ours big_melee_result
8. [S] unit-look.c shoulder-pad-nub [0] — replace the outboard square pad on padded bodies with a plate sloping off the torso corner over the sleeve head — ref tabs_screenshot_04 — ours closeup_state_reads

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still
- plank-corpses [attempts: 2, 1 approved 164] — 163: flank landing + sagittal curl lay flat in the ground plane
- dust-ring-grey [attempts: 1, spent] — stone tan still rendered neutral grey; colour is not the cause
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare
- cannonball-team-navy [attempts: 1] — near-black stone: no shot in flight in either frame

## Notes for next iteration (max 5 lines)
- LEDGER.md sits near 10000 bytes: trim prose before adding rows, run budget.mjs after each edit. Source files are CRLF on disk whatever grep says: patch with an EOL-aware node script kept in the scratchpad (inline sed/node -e loses backslashes), commit per gap with `git commit <paths> -F -`. No [P] on sun azimuth, hemi.groundColor, helm crown, gait roll, carry bob, MITT_OF_WRIST.
- Shadows: main.ts `CascadedShadowGenerator` (4 cascades, PCF high, reach `SHADOW_REACH` + pull-back); units and solid props cast, ground and `fieldBlades_*` receive. mapBuilder `RootShadowPlugin` (a MaterialPluginBase on both blade materials) redoes the shadow lookup at CUSTOM_VERTEX_MAIN_END from the lawn under each vertex; blades carry the grass emissive, which is what keeps shade warm.
- Limbs: `tapered(..., jointEnd, stubMat, headDiameter)` in bodyBuilder: stub merged, or its own `_stub` mesh when stubMat is given (forearms; unitFactory recolours it to the upper arm); headDiameter merges the sleeve head (SLEEVE_HEAD*) into the upper arm. Hip caps are still `sphere()`; shoulder pads are separate `_lPad/_rPad` frustums.
- Walk: `_animateWalkHumanoid` (`_buildGait`, base lean hash 51) then `_applyWalkBias`, shove overlay, spear carry, prop carry (`_buildCarry`), `_carryProp` last. Never add walk torso yaw. Idle: `_buildIdlePose`; do not grow the free-foot 0.08 offset.
- Hats: `attachProps` builds a `HelmFit` for the great helm; other hats ride `headTop` and HAT_OVERSIZE. Swords: `buildSlabSword` fed a `BladeFit` by `attachProps`.
