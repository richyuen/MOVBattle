# Loop state
Iteration: 175   Last re-audit: 175   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: a shield rank is one pose stamped out (same pitch, same leg phase, spears level at one height), idle men stand bolt upright and symmetric, gun crews hold one stiff pose
unit-look: a PASS b PASS c FAIL d FAIL (2/4) — c: elbows and knees now close as one limb, but shoulders are balls on stick arms, limbs carry no thick-to-thin read, crew legs are wire, the forearm stub shows skin in the sleeve; d: clothes are paint (a belt band, a recoloured torso), no fur collar, skirt or tabard chunk
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: units now throw a whole silhouette, but grass cards shred it into near-black tufts, it is rust-black not a cool tint, hard-edged, and falls away from the battle lens
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a FAIL b PASS c PASS d PASS (3/4) — a: horizon about 82% down, the fight in the bottom third under 60% empty sky
vfx: a FAIL b PASS c PASS d PASS (3/4) — a: no spent spear or arrow stands in the ground or a body after the fight
Total 18/24.

## Focus (every gap this iteration)
BASE d7ba320
- [S] maps-light.b units-cast-no-ground-shadow (52f1a12) — APPROVE, criterion still FAIL
- [S] unit-look.c knob-joint-stick-limbs (ede2956) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] units-cast-no-ground-shadow (52f1a12) VERDICT: APPROVE CRITERION: maps-light.b FAIL (previous: FAIL)
- GAP: [S] knob-joint-stick-limbs (ede2956) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] maps-light.b shadow-shredded-by-grass [0] — grass blades take the ground's shadow value at the root, so a silhouette is one flat tint over grass and soil (mapBuilder blade material) — ref tabs_screenshot_08 — ours closeup_pair_zeus_thor
2. [S] unit-look.c ball-shoulders-on-stick-arms [0] — faceted sleeve head merged into the torso wedge instead of a sphere cap, joint stub in the upper segment's colour (bodyBuilder shoulder build) — ref tabs_screenshot_04 — ours shield_wall_2500ms
3. [S] unit-look.d no-fur-or-cloth-chunks [0] — faceted fur collar ring and ragged hide skirt wedge on tribal men, a rigid tabard wedge on knights, in place of the flat belt band — ref tabs_screenshot_06 — ours big_melee_9s
4. [S] camera.a sky-owns-the-frame [0] — battle framing rule: horizon near the upper third, front rank's heads at mid-frame; a mechanism, not a nudge of FOLLOW_DROP or _pickSubject rows — ref tabs_screenshot_08 — ours shield_wall_2500ms
5. [S] battle-feel.c gun-crew-frozen [0] — crew recoil, brace and sway state on firing — ref tabs_screenshot_08 — ours war_machines_1100ms / 1250ms
6. [S] vfx.a spent-shafts-lie-loose [0] — missed arrows and spears plant in the turf at their flight angle and stay (projectileSystem) — ref tabs_screenshot_02 — ours closeup_weapon_reads
7. [P] maps-light.b shadows-fall-away-from-lens [0] — main.ts sun direction: keep 42 degrees, turn the azimuth toward the battle camera side, e.g. (-0.52, -0.669, -0.53); fallout of [S] units-cast-no-ground-shadow (175) — ref tabs_screenshot_06 — ours big_melee_2s
8. [P] maps-light.b shadow-rust-black [0] — main.ts hemi.groundColor (0.25, 0.22, 0.18) -> cool (0.30, 0.30, 0.42); fallout of [S] units-cast-no-ground-shadow (175) — ref tabs_screenshot_08 — ours big_melee_result

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
- LEDGER.md sits near 10000 bytes: trim prose before adding rows, run budget.mjs after each edit. main.ts is CRLF, bodyBuilder.ts LF: patch with EOL-aware node scripts in the scratchpad, commit per gap with `git commit <paths> -F -`. No [P] on helm crown, gait roll, carry bob, MITT_OF_WRIST.
- Shadows: main.ts uses a `CascadedShadowGenerator` (4 cascades, reach `SHADOW_REACH` + camera pull-back, set in the fog observer); units and solid props are casters (unitFactory), ground and `fieldBlades_*` receive. Blades have up-facing normals and are shaded per fragment, which is what shreds a shadow.
- Limbs: `tapered(..., jointEnd)` in bodyBuilder merges a chamfered stub past the elbow/knee end of each segment (upper: bottom, lower: top); the forearm stub is skin. Shoulder and hip caps are still `sphere()` caps (1.3x sleeve top; 1.1 on a breastplate).
- Walk: `_animateWalkHumanoid` (`_buildGait`, base lean hash 51) then `_applyWalkBias`, shove overlay, spear carry, prop carry (`_buildCarry`), `_carryProp` last. Never add walk torso yaw. Idle: `_buildIdlePose`; do not grow the free-foot 0.08 offset.
- Hats: `attachProps` builds a `HelmFit` for the great helm; other hats ride `headTop` and HAT_OVERSIZE. Swords: `buildSlabSword` fed a `BladeFit` by `attachProps`.
