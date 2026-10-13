# Loop state
Iteration: 172   Last re-audit: 170   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: prop arms now have a per-unit hold on the march and the deep knee fold is gone, but marching torsos pitch alike (knights read hunched), the carry bob is not visible, clubs are held level and parallel, idle rows still read as one mannequin
unit-look: a PASS b FAIL c FAIL d PASS (2/4) — b: bucket helm a drum wider than the shoulders and torso tall with no neck, knight sword a thin sliver; c: the hand is a block fist with a thumb but no wider than the wrist (a stump end, gone at distance) and does not wrap the grip, knob joints at shoulder and elbow like a mannequin, the boot box-cornered, the bare pelvis a proud box
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: units cast a foot-sized blot, the wall no shadow, grass blades stay bright inside a shadow
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 20/24.

## Focus (every gap this iteration)
BASE 846ad24
- [S] unit-look.c paddle-hands (410a6cb) — APPROVE, criterion still FAIL
- [S] battle-feel.c prop-arm-no-carry (cbdf483) — APPROVE, criterion still FAIL
- [P] unit-look.c boot-shade (42771cc) — APPROVE, criterion still FAIL
- [P] battle-feel.c gait-lift-ceiling (a47e6ed) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] paddle-hands (410a6cb) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [S] prop-arm-no-carry (cbdf483) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [P] boot-shade (42771cc) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [P] gait-lift-ceiling (a47e6ed) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] battle-feel.c march-torsos-one-pitch [0] — per-unit torso pitch, shoulder roll and head bob in the walk, hashed like _buildGait — ref trailer_3_sheet_01 r1c2 — ours closeup_weapon_reads
2. [S] unit-look.b bucket-helm-drum [1] — size the great helm from head width in propBuilder (narrower than the shoulders, about 1.3 heads tall, seated on the shoulders); HAT_CUT_FOR_HEAD untouched (spent) — ref trailer_3_sheet_02 r1c1 — ours closeup_weapon_reads
3. [S] unit-look.c mannequin-joint-knobs [0] — drop or merge the shoulder, elbow and knee knob meshes so each limb is one unbroken tapered line — ref tabs_screenshot_04 — ours lineup_medieval
4. [S] battle-feel.c idle-rows-one-mannequin [0] — per-unit idle stance states (weapon grounded or shouldered, weight shift, head turned), a new pose state, not amplitude on the 170 idle rest row — ref trailer_3_sheet_01 r3c1 — ours lineup_medieval
5. [S] unit-look.b knight-sword-sliver [0] — blade with a broad diamond cross-section and heavy guard — ref trailer_2_sheet_02 r1c1 — ours lineup_medieval
6. [S] maps-light.b blob-shadows [0] — low warm directional sun casting long soft body shadows in place of the dark smear under each unit — ref tabs_screenshot_06 — ours lineup_medieval
7. [P] unit-look.c mitt-width [0] — MITT_OF_WRIST 1.0 -> 1.25; fallout of [S] paddle-hands (172) — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
8. [P] battle-feel.c carry-bob [0] — prop carry bob 0.08-0.18 -> 0.15-0.30; fallout of [S] prop-arm-no-carry (172) — ref tabs_screenshot_06 — ours big_melee_2150ms

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
- LEDGER.md is at ~9990/10000 bytes: compact rows before adding any. Sources are LF in the working tree; patch with EOL-aware node scripts in the scratchpad; commit per gap with `git commit <paths> -F -`. `--showcase-only` capture (~90 s) is the quick probe. Critic 172: no further [P] on gait lift or BARE_FOOT_SHADE; boot must read by shape ([S] bevel foot() corners).
- Hands: `mitt(n, width)` merges a 3-ring square palm and a thumb box into `_[lr]HandM`, sized from `lowerArmBottom` (handWidth/handLength); props parent to the hand joints and the fist does not wrap the grip. Legs: `foot()` merges cuff + toe into `_[lr]FootM` on the knee; unitFactory colours it by name.
- Walk: `_animateWalkHumanoid` (per-unit `_buildGait`, hashes 71-76; torso lean hash 51) then `_applyWalkBias` (heavy_carry hashes 61-63: clubs), then in update the shove overlay, spear carry, and prop carry (`_buildCarry`, hashes 81-88; weapon arm only for bias none/braced, board arm for any `_shieldBoard()`), each weighted (1-shove)(1-limp).
- Idle: `_buildIdlePose` drives `_animateIdleHumanoid`; `hip.rotation.z` is the pelvis drop. Do not grow the free-foot 0.08 offset.
- Shield walls: `_shieldRanks` keeps a rank per carrier; `_squareShield` and `_carrySpear` set rotationQuaternion from root yaw after all overlays. `headTop` carries every hat, hair and wreath, so fit single props in propBuilder.
