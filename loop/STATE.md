# Loop state
Iteration: 169   Last re-audit: 165   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a FAIL b PASS c FAIL d PASS (2/4) — a: red's spears stand upright on the march and lie level and parallel in contact, but as one flat rack with no fist on the shaft, a toppling man's spear stays level, rear boards hang low, the front is narrower than the rear, blue forms no wall; c: lineup units share one symmetric stance
unit-look: a PASS b PASS c FAIL d PASS (3/4) — c: the head is a tall flat-faced block, but straight-sided like a can, hidden under hair and dome caps, on a stalk neck; the hands are flat slabs but flare like a trowel, too long, and do not close on a shaft; helms wider than the shoulders
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: shadows are a faint smudge on the grass cards, sky one flat teal
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 20/24.

## Focus (every gap this iteration)
BASE 0dbba2b
- [S] unit-look.c round-fist-hands (dafad8c) — APPROVE, criterion still FAIL
- [S] battle-feel.a rear-spears-fan-and-cross (5b5d8d6) — APPROVE, criterion still FAIL
- [P] unit-look.c bucket-helm-torso-sized (054031b) — REJECT, reverted (15ee89d)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] round-fist-hands (dafad8c) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [S] rear-spears-fan-and-cross (5b5d8d6) VERDICT: APPROVE CRITERION: battle-feel.a FAIL (previous: FAIL)
- GAP: [P] bucket-helm-torso-sized (054031b) VERDICT: REJECT CRITERION: unit-look.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] unit-look.c bucket-helm-torso-sized [1] — helm mesh fitted to the head block inside propBuilder (a sleeve ~1.15x the head), global hat anchor untouched — ref trailer_2_sheet_02 r1c1 — ours closeup_weapon_reads
2. [S] battle-feel.a front-rank-narrower-than-rear [0] — slot assignment fills the front rank to full width before a rear rank opens, both teams, tower/kite boards too, so blue forms a wall — ref tabs_screenshot_06 — ours shield_wall_2500ms
3. [S] battle-feel.a toppled-spears-stay-level [0] — spear and board released to the hand when toppled or airborne; rear man's board held at chest; overhand fist visibly on the shaft — ref tabs_screenshot_06 — ours shield_wall_2650ms
4. [S] unit-look.c hair-caps-hide-head-block [0] — hair/helmet props cut as a cap over the crown and back only, at head width, face flat exposed (covers Zeus's laurel) — ref tabs_screenshot_06 — ours shield_wall_2500ms
5. [S] battle-feel.c idle-stance-variants [0] — per-unit idle stance seed: weight on one leg, weapon arm carried per weapon type, head turned (not an idle-lean nudge: spent) — ref trailer_3_sheet_01 r1c2 — ours lineup_medieval
6. [S] maps-light.b sky-gradient-and-shadows [0] — vertical sky gradient dome plus a low sun so unit shadows run two body lengths — ref tabs_screenshot_01 — ours lineup_medieval
7. [P] unit-look.c mitt-flares-like-a-trowel [0] — mitt() wrist taper 0.6 -> 0.85, height 0.84 -> 0.7, depth 0.24 -> 0.34 — fallout of round-fist-hands (169) — ours closeup_pair_zeus_thor
8. [P] unit-look.c head-straight-sided-can [0] — blockHead jaw ring 0.78 -> 0.62 — fallout of pin-ball-head (168) — ours closeup_pair_zeus_thor

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
- LEDGER.md holds tuned values and spent gaps: read it first. Sources are CRLF, loop files LF: patch with EOL-aware node scripts written to the scratchpad; commit per gap with `git commit <paths> -F -`. Both [P] gaps above sit on the head/mitt row: take one at most.
- Fast probe: scratch playwright script (createRequire from loop/scripts, chromePath from capture.mjs, build + vite preview, spawn, advanceTime, screenshot) runs in ~60 s. big_melee outcome changes run to run.
- Shield walls: `_assignShieldSlots` keeps a rank per carrier in `_shieldRanks`; rank r slots on the half spacings of its host wall with `hold` (side + depth). `_moveUnitToward` halts a rear man at his hold depth (returns before hazard and nav steering) and there calls leanIntoShove when the target is near. Never pull a rank back on the march.
- Shield and spear: board is the `/shield$/` child of leftHand, spear the `/shaft$/` child of rightHand (wall carriers only); `_squareShield` (shove*(1-limp)) and `_carrySpear` (1-limp, level by shove) set rotationQuaternion from root yaw after all overlays, so a toppling body keeps a world-level spear: gate on topple/air.
- Body: `headTop` is scaled by headUnit/(HAT_CUT_FOR_HEAD*headSize) and carries every hat, hair and wreath, so fit single props in propBuilder. `mitt()` is a CreateBox paddle sized from `upperArmTop`; props parent to the hand joints, not the mitt.
