# Loop state
Iteration: 189   Last re-audit: 185   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 3] BLOCKERS: 1 the pushing rank leans in one shared trunk pitch (188: the drive leg now differs per man; trunks all upright at one pitch, helmets at near one tilt, the shoulder turn does not read) — ours shield_wall_2650ms; 2 levelled wall spears pass through their own men (189: rear shafts are off the front rank's trunks and ride at crown height, but two or three per frame still thread helmets) — ours shield_wall_2650ms; 3 aimed men stand to attention: shooting archers square up, bolt holders' off arm hangs idle, Zeus half squats — ours closeup_state_reads. Ref trailer_3_sheet_01 r3c1, tabs_screenshot_06.
unit-look: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 3] BLOCKERS: 2 forearm as thick as the upper arm (one taper from sleeve head to a thin wrist); 3 bare neck thin (189: the head sits on a stepped stub on the trapezius; TABS has a short thick bare neck). Blocker 1 (flat shoulder plate, slab trunk) struck at 189. Ref tabs_screenshot_04.
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 22/24

## Focus (every gap this iteration)
BASE 599188d
- [S] battle-feel.c wall-spears-through-own-men (54cc0a3) — APPROVE, criterion still FAIL
- [S] unit-look.c trunk-top-flat-plate (16ef4ab) — APPROVE, criterion still FAIL (blocker 1 struck)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] battle-feel.c wall-spears-through-own-men (54cc0a3) VERDICT: APPROVE CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [S] unit-look.c trunk-top-flat-plate (16ef4ab) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.c pushing-rank-one-pitch [0] — blocker 1: per-man trunk pitch, shoulder turn and helmet tilt in the pushing rank — ref trailer_3_sheet_01 r1c1, tabs_screenshot_06 — ours shield_wall_2650ms
2. [P] battle-feel.c SPEAR_REAR_LIFT 0.12 -> about 0.3 [0] — blocker 2, fallout of 189 wall-spears-through-own-men: the visor-height shaft must clear the helmet crowns — shows in shield_wall_2650ms
3. [S] unit-look.c neck-is-a-stub [0] — blocker 3: one short thick neck solid from the trapezius into the head, replacing the collar stub — ref tabs_screenshot_04 — ours closeup_state_reads
4. [S] battle-feel.c archers-square-up [0] — blocker 3: shooting stance turned side-on, bow arm out, draw elbow back, trunk leaning into the shot — ref trailer_3_sheet_01 r1c1, r3c1 — ours closeup_state_reads
5. [S] unit-look.c forearm-one-taper [0] — blocker 2: single taper from sleeve head to a thin wrist, replacing the forearm swell — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
6. [S] battle-feel.c caster-off-arm-and-squat [0] — blocker 3: off arm counterbalances the bolt, Zeus throws from a stride, not a half squat — ref trailer_3_sheet_01 r3c1 — ours closeup_state_reads, closeup_pair_zeus_thor
Critic notes: shoulder slope reads 20-25 degrees (TABS 35-40); Zeus's cuirass is still 2.3 heads wide and his sash overhangs the narrowed trunk; rear shafts are ruler-parallel at one height; low shafts at waist height run back through the rear men (front-rank butts).

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; the Zeus in the shot rolled the untouched overhead branch, nothing visible. Needs the [S] (gap 6)
- shade-density [attempts: 1, lawn shade row spent for [P]] — weight 0.6/0.5/0.4 + lift: shadow contrast fell from 28% to 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still
- plank-corpses [attempts: 2, 1 approved 164] — 163: flank landing + sagittal curl lay flat in the ground plane
- dust-ring-grey [attempts: 1, spent] — stone tan still rendered neutral grey; colour is not the cause

## Notes for next iteration (max 5 lines)
- 190 is a re-audit (showcase capture, critic rewrites Criteria and gaps) before picking. Both failing criteria stand at 3 approved [S] since their lists: one more without a flip marks `plateau` unless the re-audit rewrites the blockers. Last [S] pair was battle-feel.c + unit-look.c, the only two failing criteria: if the pair rule leaves nothing else, take one [S] and the [P].
- Brace: `_buildBracePose` (stand pitch/crouch/raise, lead/lunge/twist/tuck, thrustRate); the brace block in update applies it under `hold`; `br.pitch` is 0.2-0.34 / -0.08-0.04 / 0.08-0.2 by stand and the critic reads all trunks as upright. Shove pose for men without boards: `_buildShovePose`.
- Spear: `_carrySpear` aims the shaft (pitch from the neck); `_thrustStroke` slides it (SPEAR_*), `_spearRestAim` chokes up; rear rank (`_spearLane`, flag from the sim's slot.hold) sets the shaft over the man's middle line. Poses: `_buildCarry().ready`, branches hash from `_wobblePhase` (change every branch or aim it).
- Torso: `shoulderYoke(n, jointX, jointY, crownH, pelvisW, pelvisD, beltY)`: hull from the pelvis top face to an edge inside and just over the joints, then the trapezius frustum to `collarWidth` at COLLAR_RISE up the neck; it squeezes torsoMesh.scaling.x to the hull. Neck post: `neckMesh` (0.5-0.62 head wide). Leave `shoulderOffX` alone, the helm rim is cut from it; tabards and Zeus's sash size from torsoMesh.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, COLLAR_*, hull, pelvis, ghost, bow ready, spear carry/thrust, laurel, sunk crouch, FOREARM/CALF_SWELL, helm crown, lawn shade, carry bob.
