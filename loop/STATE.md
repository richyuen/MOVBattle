# Loop state
Iteration: 171   Last re-audit: 170   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: marchers now walk their own gait (one leg straight, one folded), but idle rows still read as one mannequin, the free-leg fold reaches a crouched scuttle, prop arms have no carry, marching torsos pitch alike
unit-look: a PASS b FAIL c FAIL d PASS (2/4) — b: bucket helm a drum wider than the shoulders and torso tall with no neck, knight sword a thin sliver; c: legs now end in a cuffed boot with a toe, but the boot is leg-coloured and box-cornered, the hand a flat paddle wider than the forearm, the bare pelvis a proud box
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: units cast a foot-sized blot, the wall no shadow, grass blades stay bright inside a shadow
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 20/24.

## Focus (every gap this iteration)
BASE 7eb8903
- [S] unit-look.c needle-ankles-no-boots (a8871b2) — APPROVE, criterion still FAIL
- [S] battle-feel.c march-legs-one-phase (103b28e) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] needle-ankles-no-boots (a8871b2) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [S] march-legs-one-phase (103b28e) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] unit-look.c paddle-hands [0] — block mitt no wider than the forearm end, replacing the flat tile, in bodyBuilder mitt() — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
2. [S] unit-look.b bucket-helm-drum [1] — fit the knight helm in propBuilder to head width with a visible neck gap below it; HAT_CUT_FOR_HEAD untouched (spent) — ref trailer_3_sheet_02 r1c1 — ours closeup_weapon_reads
3. [S] battle-feel.c prop-arm-no-carry [0] — weapon and shield arm carry/bob state on the march, per-unit — ref trailer_2_sheet_02 r1c1 — ours big_melee_2s
4. [S] maps-light.b foot-blot-shadows [0] — long body-shaped unit shadow along the sun direction, plus wall shadows — ref trailer_3_sheet_02 r1c1 — ours lineup_medieval
5. [S] battle-feel.c idle-row-one-pose [0] — per-unit idle stance variants (arm hang angle, foot stagger, head drop) readable at lineup scale — ref trailer_3_sheet_01 r1c2 — ours lineup_medieval
6. [S] unit-look.b knight-sword-sliver [0] — broad flat blade mesh with wide crossguard in propBuilder — ref trailer_3_sheet_02 r1c1 — ours closeup_weapon_reads
7. [P] battle-feel.c gait-lift-ceiling [0] — _buildGait lift 0.6-1.5 -> 0.6-1.1; fallout of [S] march-legs-one-phase (171) — ref trailer_3_sheet_01 r1c2 — ours big_melee_2150ms
8. [P] unit-look.c boot-shade [0] — darken the boot against the leg (about 0.75 of the leg colour); fallout of [S] needle-ankles-no-boots (171) — ref tabs_screenshot_06 — ours shield_wall_2650ms

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
- Legs: `hipOffX` comes from the pelvis block (`_pelvis` mesh on `hip`). `foot()` merges a cuff and a toe box into one `_[lr]FootM` mesh parented to the knee; unitFactory colours it by that name (BOOT_SHADE, BARE_FOOT_SHADE). Shins end at SHIN_END.
- Idle: `_buildIdlePose` (lean, side, stride, tilt, turn, arms[2]) drives `_animateIdleHumanoid`; `hip.rotation.z` is the pelvis drop and resets every frame. Do not grow the free-foot 0.08 offset. Walk is `_animateWalkHumanoid`, per-unit `_buildGait` (hashes 71-76); wobble phase is Math.random, so phases already differ per man.
- Shield walls: `_assignShieldSlots` keeps a rank per carrier in `_shieldRanks`; board is the `/shield$/` child of leftHand, spear the `/shaft$/` child of rightHand; `_squareShield` and `_carrySpear` set rotationQuaternion from root yaw after all overlays.
- Body: `headTop` is scaled by headUnit/(HAT_CUT_FOR_HEAD*headSize) and carries every hat, hair and wreath, so fit single props in propBuilder. `mitt()` is a CreateBox paddle sized from `upperArmTop`; props parent to the hand joints, not the mitt.
