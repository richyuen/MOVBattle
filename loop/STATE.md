# Loop state
Iteration: 173   Last re-audit: 170   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a PASS b PASS c FAIL d PASS (3/4) — c: the marching trunk now rolls and nods on each man's own step, but every trunk is still pitched forward alike (knights bent 20-30 degrees at the waist), the roll is faint at battle distance, clubs are held level and parallel, idle rows still read as one mannequin
unit-look: a PASS b FAIL c FAIL d PASS (2/4) — b: the great helm is inside the shoulders and seated on them but too tall for its width (a flat-lidded can), knight sword a thin sliver; c: the fist steps out past a bare wrist but vanishes under a sleeve and does not wrap the grip, knob joints at shoulder and elbow, the boot box-cornered, the bare pelvis a proud box
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: units cast a foot-sized blot, the wall no shadow, grass blades stay bright inside a shadow
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 20/24.

## Focus (every gap this iteration)
BASE 738a0e1
- [S] battle-feel.c march-torsos-one-pitch (1d7551b) — APPROVE, criterion still FAIL
- [S] unit-look.b bucket-helm-drum (543d6f1) — APPROVE, criterion still FAIL
- [P] unit-look.c mitt-width (5db2590) — APPROVE, criterion still FAIL
- [P] battle-feel.c carry-bob (0e5ea88) — REJECT, reverted (d0dd80d)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] march-torsos-one-pitch (1d7551b) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [S] bucket-helm-drum (543d6f1) VERDICT: APPROVE CRITERION: unit-look.b FAIL (previous: FAIL)
- GAP: [P] mitt-width (5db2590) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [P] carry-bob (0e5ea88) VERDICT: REJECT CRITERION: battle-feel.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] unit-look.b knight-sword-sliver [0] — blade as a broad slab sized from fist and standing height in buildWeapon — ref tabs_screenshot_02 — ours lineup_medieval
2. [S] battle-feel.c clubs-level-parallel [0] — per-unit carry attitude (shouldered, trailed, upright, across the chest) in _buildCarry, bob on top — ref tabs_screenshot_01 — ours big_melee_2s
3. [S] battle-feel.c idle-rows-one-mannequin [0] — per-unit idle stance variants (weapon rested, hip shot, turned), a new pose state — ref tabs_screenshot_06 — ours lineup_medieval
4. [S] maps-light.b foot-blot-shadows [0] — body-length directional unit shadows, wall shadows, grass darkened inside shadow — ref tabs_screenshot_06 — ours lineup_medieval
5. [S] unit-look.c knob-joints-and-open-hand [0] — drop the shoulder and elbow knobs, mitt closed round the grip and sized from the sleeve end — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
6. [S] battle-feel.c knights-hunched [0] — per-unit carriage state (upright with dropped head, chest-out, stooped) replacing the single forward-lean band — ref trailer_3_sheet_01 r1c2 — ours closeup_weapon_reads
7. [P] unit-look.b helm-too-tall [0] — HelmFit crown 0.86 -> 0.75 of rim; fallout of [S] bucket-helm-drum (173) — ref trailer_3_sheet_01 r3c2 — ours closeup_weapon_reads
8. [P] battle-feel.c shoulder-roll-faint [0] — gait roll 0.04-0.14 -> 0.08-0.20; fallout of [S] march-torsos-one-pitch (173) — ref trailer_3_sheet_01 r1c2 — ours big_melee_2150ms

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: no prop seen dropping in the motion pair; a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off the head
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still, pushes further toward shards
- plank-corpses [attempts: 2, 1 approved 164] — 163: 2-in-5 flank landing + sagittal curl lay in the ground plane, a flat strip
- dust-ring-grey [attempts: 1, spent] — stone (0.92,0.8,0.55) still rendered neutral grey; colour is not the cause
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare
- cannonball-team-navy [attempts: 1] — near-black stone: no shot in flight in either frame, claim not visible
- fireball-burns-cream (= cannon-impact-balls) [attempts: 2] — emissives under white: lemon paint

## Notes for next iteration (max 5 lines)
- LEDGER.md sits just under 10000 bytes: trim prose before adding rows. proceduralAnimation.ts and propBuilder.ts are LF, bodyBuilder.ts is CRLF: patch with EOL-aware node scripts in the scratchpad; commit per gap with `git commit <paths> -F -`. Critic 173: no further [P] on MITT_OF_WRIST, BARE_FOOT_SHADE, gait lift or carry bob.
- Hands: `mitt(n, width)` merges a square palm and a thumb box into `_[lr]HandM`, sized from `lowerArmBottom` (the bare wrist, not the sleeve end); props parent to the hand joints and the fist does not wrap the grip. Legs: `foot()` merges cuff + toe into `_[lr]FootM`.
- Walk: `_animateWalkHumanoid` (per-unit `_buildGait`, hashes 71-80 and 89-91; trunk roll, nod and chin ride `stride`; base lean hash 51 is the one shared forward band) then `_applyWalkBias` (hashes 61-63), then in update the shove overlay, spear carry, and prop carry (`_buildCarry`, hashes 81-88). Never add walk torso yaw: idle does not reset it.
- Idle: `_buildIdlePose` drives `_animateIdleHumanoid`; `hip.rotation.z` is the pelvis drop. Do not grow the free-foot 0.08 offset.
- Hats: `attachProps` builds a `HelmFit` for the great helm from `body.metrics.head` (width, height, neck), `metrics.shoulderWidth` and `headTop.scaling`; other hats still ride `headTop` and HAT_OVERSIZE. Fit single props this way, never through HAT_CUT_FOR_HEAD.
