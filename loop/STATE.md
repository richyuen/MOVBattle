# Loop state
Iteration: 191   Last re-audit: 190   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 4] plateau BLOCKERS: 1 the pushing rank leans in one shared trunk pitch (drive legs differ per man; the red trunks are all upright at one pitch, helmets at one tilt, no shoulder turn reads) — ours shield_wall_2650ms; 2 levelled wall spears pass through their own men (rear shafts ride at crown height; three or four still cross or thread helmets in both frames of the pair) — ours shield_wall_2650ms; 3 shooting archers still square up: upright, legs together, forearm folded across the chest, the stave hanging at hip height away from the arrow's flight (191: Zeus's half squat and the idle off arm are cleared) — ours big_melee_9s. Ref trailer_3_sheet_01 r1c1, r3c1, tabs_screenshot_06.
unit-look: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 4] plateau BLOCKERS: 3 bare neck thin (the head sits on a stepped stub on the trapezius; TABS has a short thick bare neck) — ours closeup_pair_zeus_thor. Blockers 1 and 2 struck (189, 191). Ref tabs_screenshot_04.
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 22/24 (both failing criteria are `plateau`: only an [R] may be picked on them, one per iteration)

## Focus (every gap this iteration)
BASE f5e5253
- [S] battle-feel.c aimed-men-stand-to-attention (07f08b9) — APPROVE, criterion still FAIL, plateau
- [S] unit-look.c forearm-as-thick-as-upper-arm (b3de7a4) — APPROVE, criterion still FAIL (blocker 2 struck), plateau

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] battle-feel.c aimed-men-stand-to-attention (07f08b9) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL) [S since list: 4] plateau
- GAP: [S] unit-look.c forearm-as-thick-as-upper-arm (b3de7a4) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL) [S since list: 4] plateau

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [R] battle-feel.c wall brace, rear spear lane and the aimed-archer hold [0] — blockers 1, 2, 3: rebuild _buildBracePose (per-man trunk pitch, shoulder turn, helmet tilt), _carrySpear/levelSpearAt with SPEAR_REAR_* (rear shafts carried in the gap between heads, not through them), and the bow hold through the draw (stave upright, seated in the bow fist at the enemy end of the level arm; stance hashed per archer) — ref trailer_3_sheet_01 r1c1, r3c1, tabs_screenshot_06 — ours shield_wall_2500ms/2650ms, big_melee_9s
2. [R] unit-look.c head-neck-trapezius junction [0] — blocker 3: rebuild the neck as one short thick bare column from the trunk top into the head (NECK_LENGTH, TRAPEZIUS_OVER_CROWN, COLLAR_OF_NECK, COLLAR_RISE), no stepped stub — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor, closeup_state_reads
No [S] or [P] ranked: every failing criterion is plateau. Critic notes: Zeus's hold has no stride and his knees are locked; the elbow stub shows as a small notch on an outstretched arm; a side-on archer close-up at the loose would settle the bow read.

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- wall-spears-thread-helmets [attempts: 1, [S]] — 190: lane from the two heads ahead + height from own crown: no visible step, butts still trail out of rear helmets, the shaft dips back to helmet height by the front rank, a 0.45 m clamp from the fist cannot reach the gap, the raised arm is unseen
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; nothing visible (cleared by the 191 [S])
- shade-density [attempts: 1, lawn shade row spent for [P]] — weight 0.6/0.5/0.4 + lift: shadow contrast fell from 28% to 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still
- plank-corpses [attempts: 2, 1 approved 164] — 163: flank landing + sagittal curl lay flat in the ground plane

## Notes for next iteration (max 5 lines)
- 192 takes one [R] (gap 1 or 2; one per iteration, up to 5 files and 600 lines, a spec comment block first, designed from the reference, not the last defect). An [R] approved clears the plateau mark. Commit per gap with `git commit <paths> -F <msgfile>`; run budget.mjs after each edit.
- Bow: the stave is in the RIGHT hand (`ready.prop`, turned in the fist by `_carryProp` only while `kept`, which is false in the attack state, so during `_animateBowDrawRelease` it rides the hand's built orientation); the draw sets the right arm level down the line and the left as string hand. Cast: `_animateCast` stride, CASTER_CROUCH.
- Brace: `_buildBracePose` (stand pitch/crouch/raise, lead/lunge/twist/tuck, thrustRate), applied under `hold` in update. Spear: `_carrySpear` (pitch from the neck), `_thrustStroke`, rear `_spearLane` over the man's own middle line, SPEAR_REAR_LIFT 0.12; the sim passes `slot.hold !== null` as the rear flag (`_shieldSlots`, heading in the slot).
- Neck: `neckMesh` cylinder (0.5-0.62 head wide, NECK_LENGTH 0.07) under `blockHead`; trapezius frustum in `shoulderYoke` rises COLLAR_RISE 0.85 up it to `collarWidth`. Arms: `armTaper`. Leave `shoulderOffX` alone, the helm rim is cut from it.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, COLLAR_*, hull, pelvis, arm taper, ghost, bow ready/shot, spear carry/thrust/lane, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob.
