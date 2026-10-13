# Loop state
Iteration: 179   Last re-audit: 175   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: wall spears are level and parallel, backs are straight, gun crews hold one stiff pose
unit-look: a PASS b PASS c FAIL d FAIL (2/4) — c: crew arms are thin bare rods, the limb belly reads only in close-up, the catapult operator is thin-legged; d: garment solids exist only as hip skirts and breeches; upper garments, robe and crew cap are still paint or absent; kilts form one level band
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: the shade is a near-opaque plum, a man casts a blob with no limb or spear in it; lightened by constants it was too faint to read
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a FAIL b PASS c PASS d PASS (3/4) — a: horizon about 80% down, the fight in the bottom third under empty sky
vfx: a FAIL b PASS c PASS d PASS (3/4) — a: no spent spear or arrow stands in the ground or a body after the fight
Total 18/24.

## Focus (every gap this iteration)
BASE 7832670
- [S] battle-feel.c shield-rank-one-pose (e3dffc5) — APPROVE, criterion still FAIL
- [S] unit-look.d clothes-are-paint (7ef888d) — APPROVE, criterion still FAIL
- [P] maps-light.b shade-density (68f86a1, reverted ef6dfca) — REJECT
- [P] unit-look.c limb-belly-invisible (3463bd2) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] shield-rank-one-pose (e3dffc5) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [S] clothes-are-paint (7ef888d) VERDICT: APPROVE CRITERION: unit-look.d FAIL (previous: FAIL)
- GAP: [P] shade-density (68f86a1) VERDICT: REJECT CRITERION: maps-light.b FAIL (previous: FAIL)
- GAP: [P] limb-belly-invisible (3463bd2) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] maps-light.b shade-washed-out [0] — hue-preserving ground-multiply shade (saturation kept) with a dark contact core under the feet, only the far band lightened, in LawnShadePlugin — ref trailer_3_sheet_02 r1c1 — ours lineup_medieval
2. [S] camera.a fight-in-bottom-third [0] — battle framing rule: horizon at the top third, push in until the front line fills the frame — ref tabs_screenshot_06 — ours big_melee_5s
3. [S] battle-feel.c gun-crew-one-stiff-pose [0] — crew work cycle: haul, ram, recoil flinch, each man on his own beat — ref tabs_screenshot_08 — ours war_machines_1100ms / 1250ms
4. [S] unit-look.d garments-stop-at-hip [0] — robe wedge to the ankle for casters, sleeve cuffs, crew cap — ref trailer_3_sheet_02 r1c2 — ours lineup_medieval
5. [S] unit-look.c crew-arms-bare-rods [0] — striped sleeve tubes on crew upper and lower arms (dressCannonCrew) — ref tabs_screenshot_08 — ours war_machines_1250ms
6. [S] vfx.a spent-missiles-do-not-stand [0] — spears and arrows that miss or kill stay planted upright in ground and bodies through the result shot — ref tabs_screenshot_01 — ours big_melee_result
7. [P] battle-feel.c wall-spears-parallel [0] — _buildBracePose spearDip span 0.36 to 0.9; fallout of [S] shield-rank-one-pose (179) — ref tabs_screenshot_06 — ours shield_wall_2650ms
8. [P] unit-look.d crew-breeches-block [0] — crewBreeches diameterTop 1.75 to 1.45 thighs; fallout of [S] clothes-are-paint (179) — ref tabs_screenshot_08 — ours war_machines_3800ms

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- shade-density [attempts: 1, lawn shade row spent for [P]] — weight 0.6/0.5/0.4 + lift: shadow contrast fell from 28% to 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still
- plank-corpses [attempts: 2, 1 approved 164] — 163: flank landing + sagittal curl lay flat in the ground plane
- dust-ring-grey [attempts: 1, spent] — stone tan still rendered neutral grey; colour is not the cause
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare

## Notes for next iteration (max 5 lines)
- LEDGER.md sits at its byte cap: trim prose before adding, run budget.mjs after each edit. Patch sources with an EOL-aware node script (scratchpad, each find asserted once; vehicleBuilder is CRLF); commit per gap with `git commit <paths> -F -`. No [P] on sun azimuth, hemi.groundColor, shadow darkness, LAWN_BAND_WEIGHT/LIFT, BLADE_SIGHT_REACH, helm crown, gait roll, carry bob, MITT_OF_WRIST, FOREARM/CALF_SWELL.
- Shadows: main.ts `CascadedShadowGenerator` (4 cascades, PCF high). mapBuilder `LawnShadePlugin` swaps `computeShadowWithCSMPCF5` by macro for a 3-band filter and tints shade at CUSTOM_FRAGMENT_BEFORE_FOG; the engine's PCSS drops thin shadows, do not use it. `RootShadowPlugin` moves each blade's lookup to the lawn behind it.
- Garments: unitFactory `hangSkirt` (hex bell on `body.hip`, pushed to propMeshes) and `furCollar` (torso joint), dressed after the tabard block; crew are dressed by `dressCannonCrew` (vehicleBuilder: hoops, `crewBreeches` on the hip joints, cap only for operators). Limbs: `tapered(..., bellyDiameter)`; crew widths from `crewProportions`.
- Wall: `_buildBracePose` (hash 101-117) feeds the shove overlay (stand, board arm, crouch with `hip.position.y` let down from `_hipRest`, weight shift), `_squareShield` (board yaw/tilt/roll) and `_carrySpear` (dip only, never yaw: spears must not cross).
- Walk: `_animateWalkHumanoid` (`_buildGait`) then `_applyWalkBias`, shove overlay, spear carry, prop carry, `_carryProp` last. Never add walk torso yaw. Idle: `_buildIdlePose`; do not grow the free-foot 0.08 offset. Hats ride `headTop`; great helm uses `HelmFit`.
