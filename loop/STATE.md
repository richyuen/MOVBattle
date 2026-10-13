# Loop state
Iteration: 170   Last re-audit: 170   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: idle men now hang their arms and shift weight, but neighbours still read as one mirrored pose, the shift is lost at lineup scale, prop arms have no carry, and men on the march share one leg pose in one phase
unit-look: a PASS b FAIL c FAIL d PASS (2/4) — b: bucket helm a drum wider than the shoulders and torso tall with no neck, knight sword a thin sliver; c: legs now hang hip-width from a pelvis block, but each is a cone to a needle ankle with a tiny foot, the hand a flat tile wider than the forearm, the bare pelvis a proud box
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: units cast a foot-sized blot, the wall no shadow, grass blades stay bright inside a shadow
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 20/24.

## Focus (every gap this iteration)
BASE 86403c3
- [S] unit-look.c legs-a-frame-from-one-point (22b1b79) — APPROVE, criterion still FAIL
- [S] battle-feel.c idle-mannequin-arms-out (82b9634) — APPROVE, criterion still FAIL
- audit rank 2 (unit-look.b bucket helm) skipped only for sharing a dimension with rank 1

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] legs-a-frame-from-one-point (22b1b79) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [S] idle-mannequin-arms-out (82b9634) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] unit-look.c needle-ankles-no-boots [0] — boot block wider and deeper than the shin end with a toe forward; shin ends at boot-top width, not a point (not a [P]: taper row approved 166) — ref tabs_screenshot_06 — ours shield_wall_2650ms
2. [S] battle-feel.c march-legs-one-phase [0] — per-unit stride phase offset and stride length in the humanoid walk, hashed from the wobble phase — ref trailer_3_sheet_01 r1c2 — ours big_melee_2150ms
3. [S] unit-look.b bucket-helm-drum-no-neck [1] — fit the great helm to the head block in propBuilder (width at most the shoulders, ~1.3 heads tall, neck visible under the rim, eye slit); HAT_CUT_FOR_HEAD untouched — ref trailer_2_sheet_02 — ours closeup_weapon_reads
4. [S] maps-light.b unit-shadow-foot-blot [0] — full-body directional shadow from every unit and the wall onto the ground, lower sun — ref tabs_screenshot_05 — ours closeup_pair_zeus_thor
5. [S] battle-feel.c idle-neighbours-mirrored [0] — separate carry poses for weapon and shield arms, per-unit facing yaw — ref tabs_screenshot_08 — ours closeup_state_reads
6. [S] unit-look.c hand-flat-tile [0] — blocky fist no wider than the forearm end, with a thumb facet, in place of the paddle — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
7. [S] unit-look.c bare-pelvis-box [0] — on bare units a tapered hip wedge with a short hanging cloth flap — ref tabs_screenshot_01 — ours big_melee_2150ms
8. [S] maps-light.b grass-bright-in-shadow [0] — grass blades take the shadow tint of the ground under them — ref tabs_screenshot_02 — ours war_machines_3800ms

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off the head, helm still wider than the shoulders
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still, pushes further toward shards
- plank-corpses [attempts: 2, 1 approved 164] — 163: 2-in-5 flank landing + sagittal curl lay in the ground plane, a flat strip
- dust-ring-grey [attempts: 1, spent] — stone (0.92,0.8,0.55) still rendered neutral grey; colour is not the cause
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare
- cannonball-team-navy [attempts: 1] — near-black stone: no shot in flight in either frame, claim not visible
- fireball-burns-cream (= cannon-impact-balls) [attempts: 2] — emissives under white: lemon paint
- giant-lean-cuts-blue [attempts: 1] — GIANT_LEAN 0.25: the cut moved to red's rear

## Notes for next iteration (max 5 lines)
- LEDGER.md holds tuned values and spent gaps: read it first. Sources are CRLF (unitFactory.ts and loop files LF): patch with EOL-aware node scripts written to the scratchpad; commit per gap with `git commit <paths> -F -`. A `--showcase-only` capture (~90 s) is the quick visual probe.
- Legs: `hipOffX` comes from the pelvis block (`_pelvis` mesh on `hip`, kept as the loincloth on bare units with the hip caps); feet are `foot()` boxes parented to the knees, shins `tapered()` cylinders ending at lowerLegBottom.
- Idle: `_buildIdlePose` (lean, side, stride, tilt, turn, arms[2]) drives `_animateIdleHumanoid`; `hip.rotation.z` is the pelvis drop and resets every frame. Do not grow the free-foot 0.08 offset. Walk is `_animateWalkHumanoid` (speed 8, shared phase t).
- Shield walls: `_assignShieldSlots` keeps a rank per carrier in `_shieldRanks`; board is the `/shield$/` child of leftHand, spear the `/shaft$/` child of rightHand; `_squareShield` and `_carrySpear` set rotationQuaternion from root yaw after all overlays.
- Body: `headTop` is scaled by headUnit/(HAT_CUT_FOR_HEAD*headSize) and carries every hat, hair and wreath, so fit single props in propBuilder. `mitt()` is a CreateBox paddle sized from `upperArmTop`; props parent to the hand joints, not the mitt.
