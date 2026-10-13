# Loop state
Iteration: 174   Last re-audit: 170   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: clubs and swords are now carried each in its own attitude and the shoulders roll on the step, but every marching knight is still bent the same 25-30 degrees at the waist, carried weapons stand rigid in the fist, the hips do not counter-roll, idle rows still read as one mannequin
unit-look: a PASS b FAIL c FAIL d PASS (2/4) — b: the great helm is too tall for its width (a flat-lidded can), the slab sword reads as a sword but is stubby at lineup distance with a heavy guard; c: the fist sits beside the guard and does not wrap the grip, knob joints at shoulder and elbow, the boot box-cornered, the bare pelvis a proud box
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: units cast a foot-sized blot, the wall no shadow, grass blades stay bright inside a shadow
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 20/24.

## Focus (every gap this iteration)
BASE 9bc87c7
- [S] unit-look.b knight-sword-sliver (ae74797) — APPROVE, criterion still FAIL
- [S] battle-feel.c clubs-level-parallel (08d1208) — APPROVE, criterion still FAIL
- [P] unit-look.b helm-too-tall (fce9b4b) — REJECT, reverted (d9511b3)
- [P] battle-feel.c shoulder-roll-faint (4d0a258) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] knight-sword-sliver (ae74797) VERDICT: APPROVE CRITERION: unit-look.b FAIL (previous: FAIL)
- GAP: [S] clubs-level-parallel (08d1208) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [P] helm-too-tall (fce9b4b) VERDICT: REJECT CRITERION: unit-look.b FAIL (previous: FAIL)
- GAP: [P] shoulder-roll-faint (4d0a258) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] unit-look.b helm-lid-and-clearance [0] — great helm as a straight drum plus a chamfered lid ring, lid clamped to clear the head's corner diagonal, in buildHat great_helm — ref trailer_3_sheet_01 r3c2 — ours closeup_weapon_reads
2. [S] battle-feel.c march-knights-one-pitch [0] — per-man base lean class (upright, leaning, hunched) with neck counter-arch in _buildGait, replacing the single 0.28-0.54 band — ref trailer_3_sheet_01 r1c2 — ours closeup_weapon_reads
3. [S] unit-look.c fist-off-grip [0] — anchor every gripped prop so the grip passes through the mitt, a finger block closing over it, in attachProps and the mitt — ref tabs_screenshot_04 — ours closeup_weapon_reads
4. [S] battle-feel.c idle-row-mannequin [0] — idle stance states per man (weight on one leg, weapon grounded or shouldered, head look-around) in _buildIdlePose — ref trailer_3_sheet_01 r3c1 — ours lineup_medieval
5. [S] maps-light.b foot-blot-shadows [0] — whole body, props and wall as shadow casters with a long sun-angle projection — ref tabs_screenshot_06 — ours shield_wall_2500ms
6. [S] battle-feel.c carried-weapon-rigid [0] — damped-spring lag of the prop behind the hand in _carryProp — ref tabs_screenshot_01 — ours big_melee_2150ms
7. [S] unit-look.c knob-joints [0] — flush faceted collars instead of ball knobs at shoulder and elbow in bodyBuilder — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
8. [P] unit-look.b sword-stubby-at-distance [0] — buildSlabSword length 0.46 -> 0.55 of standing height; fallout of [S] knight-sword-sliver (174) — ref tabs_screenshot_06 — ours lineup_medieval

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall, and the taper does not shorten the helm
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: no prop seen dropping in the motion pair; a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off the head
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still, pushes further toward shards
- plank-corpses [attempts: 2, 1 approved 164] — 163: 2-in-5 flank landing + sagittal curl lay in the ground plane, a flat strip
- dust-ring-grey [attempts: 1, spent] — stone (0.92,0.8,0.55) still rendered neutral grey; colour is not the cause
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare
- cannonball-team-navy [attempts: 1] — near-black stone: no shot in flight in either frame, claim not visible

## Notes for next iteration (max 5 lines)
- LEDGER.md sits just under 10000 bytes: trim prose before adding rows. Source and loop files may be CRLF in the working copy: patch with EOL-aware node scripts in the scratchpad (never `\n` inside sed), commit per gap with `git commit <paths> -F -`. Critic 174: no further [P] on helm crown, gait roll, carry bob, MITT_OF_WRIST.
- Swords: `buildSlabSword` (propBuilder) is fed a `BladeFit` (fist from `metrics.hand.width`, standing height) by `attachProps`; the root sits so the guard is at the wrist, the fist beside it and the grip hanging below (critic: fist-off-grip). Hands: `mitt(n, width)` merges palm and thumb into `_[lr]HandM`.
- Walk: `_animateWalkHumanoid` (`_buildGait`, hashes 71-80, 89-91; base lean hash 51 is the one shared band) then `_applyWalkBias` (61-63), then in update the shove overlay, spear carry and prop carry (`_buildCarry`, hashes 81-88 and 92-95: four attitudes, arm hold + `tip`), and after all overlays `_carryProp` turns club/blade/handle meshes in the fist to the tip (world attitude, eased out in contact). Never add walk torso yaw.
- Idle: `_buildIdlePose` drives `_animateIdleHumanoid`; `hip.rotation.z` is the pelvis drop. Do not grow the free-foot 0.08 offset. `_carryProp` is off in idle.
- Hats: `attachProps` builds a `HelmFit` for the great helm (8-sided drum: flat-to-flat is diameter x cos 22.5, so the lid must clear a 1.0-head block); other hats ride `headTop` and HAT_OVERSIZE.
