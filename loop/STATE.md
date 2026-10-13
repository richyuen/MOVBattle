# Loop state
Iteration: 177   Last re-audit: 175   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: a shield rank is one pose stamped out (same pitch, same leg phase, spears level at one height), idle men stand bolt upright and symmetric, gun crews hold one stiff pose
unit-look: a PASS b PASS c FAIL d FAIL (2/4) — c: thighs now leave the pelvis as solid faceted legs with no hip ball, but crew are still sticks (torso as thin as the limbs, legs wire), shins and forearms near-parallel tubes, small units thin-legged under a large head; d: clothes are paint (a belt band, a recoloured torso), no fur collar, skirt or tabard chunk
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: a shadow keeps its ground outline through the grass, but it is razor hard-edged, opaque, heavy warm maroon, dark blade tips fringe its near edge and hang under wheels and boots, and it fuses into a mat under a crowd
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a FAIL b PASS c PASS d PASS (3/4) — a: horizon about 80% down, the fight in the bottom third under empty sky
vfx: a FAIL b PASS c PASS d PASS (3/4) — a: no spent spear or arrow stands in the ground or a body after the fight
Total 18/24.

## Focus (every gap this iteration)
BASE ca1bfa9
- [S] maps-light.b shadow-sawtooth-hard-edge (c92105f) — APPROVE, criterion still FAIL
- [S] unit-look.c wire-legs (6a32cec) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] shadow-sawtooth-hard-edge (c92105f) VERDICT: APPROVE CRITERION: maps-light.b FAIL (previous: FAIL)
- GAP: [S] wire-legs (6a32cec) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] maps-light.b shadow-hard-heavy-maroon [0] — penumbra filter (blurred or contact-hardening, widening with distance from the caster) plus a cool shadow-tint term on the ground; no [P] on darkness 0.04 or hemi.groundColor — ref tabs_screenshot_05 — ours war_machines_1100ms
2. [S] unit-look.c crew-stick-body [0] — crew built with shirt/trouser widths from the standard infantry proportions (vehicleBuilder operator), calf and forearm swell profile (bodyBuilder lower limbs) — ref tabs_screenshot_08 — ours war_machines_3800ms
3. [S] unit-look.d clothes-are-paint [0] — faceted fur collar ring, tabard/skirt wedge and tunic hem as separate chunk meshes — ref tabs_screenshot_06 — ours closeup_weapon_reads
4. [S] battle-feel.c wall-rank-one-pose [0] — per-man brace variation (pitch, leg phase, spear height) in the shield rank and a crew work pose cycle — ref tabs_screenshot_06 — ours shield_wall_2500ms
5. [S] vfx.a no-stuck-missiles [0] — spent spears and arrows persist planted in ground and corpses through the result shot — ref trailer_1_sheet_01 r2c2 — ours big_melee_result
6. [S] camera.a horizon-too-low [0] — battle camera rule that pitches up and drops so the horizon sits near two thirds and the front line fills the frame — ref tabs_screenshot_06 — ours big_melee_2s
7. [P] maps-light.b blade-fringe-at-contact [0] — BLADE_SIGHT_REACH 4 down to about 1.5 so blades by wheels and boots stop taking far shadow; fallout of [S] shadow-sawtooth-hard-edge (177) — ref tabs_screenshot_05 — ours war_machines_1250ms
8. [P] unit-look.c thigh-floor-too-low [0] — THIGH_OF_LEG 0.2 to about 0.26; fallout of [S] wire-legs (177) — ref tabs_screenshot_08 — ours war_machines_3800ms

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
- LEDGER.md and STATE.md sit at their byte caps: trim prose before adding, run budget.mjs after each edit. Patch sources with the EOL-aware node script pattern (scratchpad, find/replace asserted to match once); commit per gap with `git commit <paths> -F -`. No [P] on sun azimuth, hemi.groundColor, shadow darkness, helm crown, gait roll, carry bob, MITT_OF_WRIST.
- Shadows: main.ts `CascadedShadowGenerator` (4 cascades, PCF high, reach `SHADOW_REACH` + pull-back). mapBuilder `RootShadowPlugin` redoes each blade vertex's shadow lookup at CUSTOM_VERTEX_MAIN_END from where the eye's line of sight through it meets the lawn (eye from `view`, clamp `BLADE_SIGHT_REACH`); blades carry the grass emissive, which keeps shade warm.
- Limbs: `tapered(..., jointEnd, stubMat, headDiameter)` in bodyBuilder; headDiameter merges a swollen head (SLEEVE_HEAD* shape constants) into upper arms and, at THIGH_HEAD, thighs; hip caps are gone. Crew body is `addOperator` in vehicleBuilder (bulk 0.72, torsoWidth 0.82, scale 0.46); linked crew are dressed in unitFactory near "Linked gun crew".
- Walk: `_animateWalkHumanoid` (`_buildGait`, base lean hash 51) then `_applyWalkBias`, shove overlay, spear carry, prop carry (`_buildCarry`), `_carryProp` last. Never add walk torso yaw. Idle: `_buildIdlePose`; do not grow the free-foot 0.08 offset.
- Hats: `attachProps` builds a `HelmFit` for the great helm; other hats ride `headTop` and HAT_OVERSIZE. Swords: `buildSlabSword` fed a `BladeFit` by `attachProps`.
