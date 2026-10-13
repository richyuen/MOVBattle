# Loop state
Iteration: 178   Last re-audit: 175   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: a shield rank is one pose stamped out (same pitch, same leg phase, spears level at one height), idle men stand bolt upright and symmetric, gun crews hold one stiff pose
unit-look: a PASS b PASS c FAIL d FAIL (2/4) — c: crew now have a torso wider than their limbs, but their legs are still thin dark sticks, the calf and forearm belly shows in no still, the catapult operator and small units are thin-legged under a large head; d: clothes are paint (a belt band, a recoloured torso), no fur collar, skirt or tabard chunk
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: shadows are soft-edged and lean mauve, but the shade is still a near-opaque dark plum, a man casts a short blob with no limb or spear in it, and it fuses into a mat under a crowd
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a FAIL b PASS c PASS d PASS (3/4) — a: horizon about 80% down, the fight in the bottom third under empty sky
vfx: a FAIL b PASS c PASS d PASS (3/4) — a: no spent spear or arrow stands in the ground or a body after the fight
Total 18/24.

## Focus (every gap this iteration)
BASE 2bb52a7
- [S] maps-light.b shadow-hard-heavy-maroon (399e586) — APPROVE, criterion still FAIL
- [S] unit-look.c crew-stick-body (d87a43f) — APPROVE, criterion still FAIL
- [P] maps-light.b blade-fringe-at-contact (e94d579) — APPROVE, criterion still FAIL
- [P] unit-look.c thigh-floor-too-low — not attempted: at infantry widths the 0.2 floor no longer binds for crew, and 0.26 would thicken every unit's thigh

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] shadow-hard-heavy-maroon (399e586) VERDICT: APPROVE CRITERION: maps-light.b FAIL (previous: FAIL)
- GAP: [S] crew-stick-body (d87a43f) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [P] blade-fringe-at-contact (e94d579) VERDICT: APPROVE CRITERION: maps-light.b FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] battle-feel.c shield-rank-one-pose [0] — per-man brace variation in the wall (own pitch, knee depth, shield height and yaw, spear elevation, leg phase) — ref tabs_screenshot_06 — ours shield_wall_2500ms
2. [S] unit-look.d clothes-are-paint [0] — solid garment chunks: fur collar ring, skirt/tabard wedge, crew trousers and cap as separate faceted meshes — ref tabs_screenshot_06 — ours war_machines_1250ms
3. [S] camera.a horizon-80-percent-down [0] — battle camera rule: eye at unit head height, pitched up so the ground line sits near 60-65% and the front line fills the frame — ref tabs_screenshot_06 — ours big_melee_5s
4. [S] vfx.a no-stuck-projectiles [0] — spent spears/arrows stand planted at an angle in ground and bodies and persist to the result shot (they lie flat now) — ref tabs_screenshot_02 — ours closeup_weapon_reads
5. [P] maps-light.b shade-density [0] — LAWN_BAND_WEIGHT about 0.6/0.5/0.4, LAWN_SHADE_LIFT about (0.04,0.08,0.14); fallout of [S] shadow-hard-heavy-maroon (178) — ref tabs_screenshot_05 — ours war_machines_3800ms
6. [S] maps-light.b shadow-blob-no-figure [0] — high band keeps the caster's outline (blur by caster width) and a lower sun-length rule so shadows run long — ref tabs_screenshot_05 — ours closeup_pair_zeus_thor
7. [S] unit-look.c crew-wire-legs [0] — trouser tube mesh on crew and small units so legs are not sticks under a large head — ref tabs_screenshot_08 — ours lineup_medieval
8. [P] unit-look.c limb-belly-invisible [0] — FOREARM_SWELL 1.18 to about 1.35, CALF_SWELL 1.22 to about 1.4; fallout of [S] crew-stick-body (178) — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor

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
- LEDGER.md sits at its byte cap: trim prose before adding, run budget.mjs after each edit. Patch sources with an EOL-aware node script (scratchpad, each find asserted to match once); commit per gap with `git commit <paths> -F -`. No [P] on sun azimuth, hemi.groundColor, shadow darkness, BLADE_SIGHT_REACH, helm crown, gait roll, carry bob, MITT_OF_WRIST.
- Shadows: main.ts `CascadedShadowGenerator` (4 cascades, PCF high). mapBuilder `LawnShadePlugin` (grass + blades) swaps the engine's `computeShadowWithCSMPCF5` by macro for a 3-band filter (map re-read with depth lifted by LAWN_BAND_RISE, per-band blur and weight) and tints shade at CUSTOM_FRAGMENT_BEFORE_FOG; the engine's PCSS drops thin shadows, do not use it. `RootShadowPlugin` moves each blade's lookup to the lawn behind it.
- Limbs: `tapered(..., jointEnd, stubMat, headDiameter, bellyDiameter)` in bodyBuilder; bellyDiameter pushes a mid ring out on forearms and shins. Crew: `crewProportions` (bodyBuilder) gives `addOperator` (vehicleBuilder) and linked crew (unitFactory, posePreset "crew") infantry widths; `dressCannonCrew` recolours legs as trousers.
- Walk: `_animateWalkHumanoid` (`_buildGait`, base lean hash 51) then `_applyWalkBias`, shove overlay, spear carry, prop carry (`_buildCarry`), `_carryProp` last. Never add walk torso yaw. Idle: `_buildIdlePose`; do not grow the free-foot 0.08 offset.
- Hats: `attachProps` builds a `HelmFit` for the great helm; other hats ride `headTop` and HAT_OVERSIZE. Swords: `buildSlabSword` fed a `BladeFit` by `attachProps`.
