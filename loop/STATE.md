# Loop state
Iteration: 167   Last re-audit: 165   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a FAIL b PASS c FAIL d PASS (2/4) — a: red stands two deep with bodies on one heading, but the rear rank is pressed into the front's backs, boards face three ways, spears cross, blue forms no wall; c: lineup units share one symmetric stance
unit-look: a PASS b PASS c FAIL d PASS (3/4) — c: limbs are long and the head is off the shoulders, but the head is a pin ball on a stalk neck and the hands are round fists
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: shadows are a faint smudge on the grass cards, sky one flat teal
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 20/24.

## Focus (every gap this iteration)
BASE c681d78 (evidence 71e5c05: six protectors as red's second rank in shield_wall_*)
- [S] battle-feel.a wall-second-rank-parallel (451b3fb) — APPROVE, criterion still FAIL
- [S] unit-look.c squat-proportions (47323c6) — APPROVE, criterion still FAIL
- [P] unit-look.c upper-limbs-blocky (40a1223) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] wall-second-rank-parallel (451b3fb) VERDICT: APPROVE CRITERION: battle-feel.a FAIL (previous: FAIL)
- GAP: [S] squat-proportions (47323c6) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)
- GAP: [P] upper-limbs-blocky (40a1223) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] battle-feel.a rear-rank-march-depth [0] — a rank-1 carrier follows its host wall at shieldRankGap on the approach, paced to the front rank, not only in contact — ref tabs_screenshot_06 — ours shield_wall_2500ms
2. [S] battle-feel.a boards-face-three-ways [0] — a slotted carrier's board yaw locked to slot.heading, not to the arm — ref tabs_screenshot_06 — ours shield_wall_2650ms
3. [S] unit-look.c pin-ball-head [0] — replace the head mesh with a tall flat-faced facet block near 1/5 of body height (sets its own size) — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
4. [S] unit-look.c round-fist-hands [0] — flat paddle mitt mesh (wide, thin, thumbless) replacing the faceted ball — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
5. [S] battle-feel.c idle-stance-variants [0] — per-unit idle stance picked by unit id: weight on one leg, weapon arm cocked, head tilt — ref trailer_3_sheet_01 r1c2 — ours lineup_medieval
6. [P] unit-look.c stalk-neck [0] — NECK_LENGTH 0.07 -> 0.04 — fallout of squat-proportions (167) — ours closeup_weapon_reads
7. [S] battle-feel.a rank-spears-cross [0] — a formed rank carries spears at one shared upright angle until the thrust — ref tabs_screenshot_06 — ours shield_wall_2500ms
8. [S] maps-light.b sky-gradient-and-shadows [0] — sky gradient dome plus a low sun casting long body shadows — ref tabs_screenshot_01 — ours lineup_medieval

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- heart-lobe-dome [attempts: 1, lobe size spent] — LOBES[0] 0.75: not visible in any still, pushes further toward shards
- plank-corpses [attempts: 2, 1 approved 164] — 163: 2-in-5 flank landing + sagittal curl lay in the ground plane, a flat strip
- dust-ring-grey [attempts: 1, spent] — stone (0.92,0.8,0.55) still rendered neutral grey; colour is not the cause
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare
- cannonball-team-navy [attempts: 1] — near-black stone: no shot in flight in either frame, claim not visible
- fireball-burns-cream (= cannon-impact-balls) [attempts: 2] — emissives under white: lemon paint
- giant-lean-cuts-blue [attempts: 1] — GIANT_LEAN 0.25: the cut moved to red's rear
- result-foreground-club [attempts: 2] — sideOn fov 0.65 + radius x1.23: clubs still across the bottom third

## Notes for next iteration (max 5 lines)
- LEDGER.md holds tuned values and spent gaps: read it first. Edit loop files and sources with scratchpad EOL-aware node patch scripts (quoted heredoc to the scratchpad); commit per gap with `git commit <paths> -F -`. Not picked: [P] bodies-merge-under-boards (shieldSlotSpacing row approved 166/167: ledger reversal).
- Fast probe: scratch playwright script (createRequire from loop/scripts, executablePath = capture.mjs chromePath, build + vite preview, spawn, advanceTime, temporary `globalThis.__probe` lines, screenshot) runs in ~60 s. big_melee outcome changes run to run.
- Shield walls: `_assignShieldSlots` keeps a rank per carrier in `_shieldRanks` (set once from depth, promoted when no wall stands ahead); rank 0 slots about the wall centre, rank r slots on the half spacings of its host wall with `hold` (side + depth) used only in the contact branch; `_holdWallHeading` -> `RuntimeUnit.holdHeading` pins root yaw (snaps, no slerp; released at each decision). A depth pull on the march was avoided on purpose (an earlier march hold stopped walls closing): pace the rear to the front instead. The camera picker may shoot the wall from behind red.
- Shield pose: board is the `/shield$/` child of leftHand, face +z; `_squareShield` squares it to root yaw gated by shove*(1-limp), which is why boards still differ from bodies. Corpses: `_layCorpseFlat` + `_writeDeathRest`.
- Body: head, eyes and `headTop` sit NECK_LENGTH up the `neck` joint (collars stay at its base); head is a scaled `sphere`, mitt a scaled sphere sized from `upperArmTop`; SLEEVE_BULK scales sleeves, thighs and so mitts and feet. `wedgeTorso` is a 3-ring cylinder; limbs are `tapered` cylinders.
