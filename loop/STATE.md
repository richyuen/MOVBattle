# Loop state
Iteration: 168   Last re-audit: 165   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a FAIL b PASS c FAIL d PASS (2/4) — a: red's rear rank now holds a pace behind the front on one heading, but rear spears fan and cross, rear boards hang low, the front is narrower than the rear, blue forms no wall; c: lineup units share one symmetric stance
unit-look: a PASS b PASS c FAIL d PASS (3/4) — c: the head is a tall flat-faced block, but straight-sided like a can, hidden under hair and dome caps, on a stalk neck, and the hands are round fists
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: shadows are a faint smudge on the grass cards, sky one flat teal
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 20/24.

## Focus (every gap this iteration)
BASE ff40ef4
- [S] battle-feel.a rear-rank-march-depth (6b76b4c) — APPROVE, criterion still FAIL
- [S] unit-look.c pin-ball-head (c8873d4) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] rear-rank-march-depth (6b76b4c) VERDICT: APPROVE CRITERION: battle-feel.a FAIL (previous: FAIL)
- GAP: [S] pin-ball-head (c8873d4) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] unit-look.c round-fist-hands [0] — mitt() as a flat box-slab paddle wider than the wrist, thin through — ref trailer_3_sheet_02 r2c2 — ours closeup_pair_zeus_thor
2. [S] battle-feel.a rear-spears-fan-and-cross [0] — rear-rank carrier pose: spear upright on the march, levelled over the front man's shoulder in contact, board upright at chest — ref tabs_screenshot_06 — ours shield_wall_2650ms
3. [S] unit-look.c hair-caps-hide-head-block [0] — hair/helmet props cut as a cap over the crown and back only, face flat exposed — ref tabs_screenshot_06 — ours shield_wall_2500ms
4. [S] battle-feel.a front-rank-narrower-than-rear [0] — slot assignment fills the front rank to full width before a rear rank opens, both teams, tower/kite boards too — ref tabs_screenshot_06 — ours shield_wall_2500ms
5. [S] battle-feel.c idle-stance-variants [0] — per-unit idle stance seed: weight on one leg, weapon arm carried per weapon type, head turned — ref trailer_3_sheet_01 r1c2 — ours lineup_medieval
6. [S] maps-light.b sky-gradient-and-shadows [0] — vertical sky gradient dome plus a low sun so unit shadows run two body lengths — ref tabs_screenshot_01 — ours lineup_medieval
7. [P] unit-look.c bucket-helm-torso-sized [0] — HAT_CUT_FOR_HEAD 0.7 -> 0.85 — fallout of pin-ball-head (168) — ours closeup_weapon_reads
8. [P] unit-look.c head-straight-sided-can [0] — blockHead jaw ring 0.78 -> 0.62 — fallout of pin-ball-head (168) — ours closeup_pair_zeus_thor

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
- LEDGER.md holds tuned values and spent gaps: read it first. Patch sources and loop files (all LF) with quoted-heredoc node scripts in the scratchpad; commit per gap with `git commit <paths> -F -`. The two [P] gaps above touch the head row approved 168: the critic ranked them itself, but weigh "ledger reversal" before picking. Dropped: [P] stalk-neck (same row).
- Fast probe: scratch playwright script (createRequire from loop/scripts, executablePath = capture.mjs chromePath, build + vite preview, spawn, advanceTime, temporary `globalThis.__probe` lines, screenshot) runs in ~60 s. big_melee outcome changes run to run.
- Shield walls: `_assignShieldSlots` keeps a rank per carrier in `_shieldRanks`; rank r slots on the half spacings of its host wall with `hold` (side + depth). `_moveUnitToward` halts a rear man whose hold depth is reached (side step only, heading held, path state cleared: it returns before hazard and nav steering, critic 168) and slows him over shieldRankFollowBand; the contact branch uses the same `hold`. Never pull a rank back on the march.
- Shield pose: board is the `/shield$/` child of leftHand, face +z; `_squareShield` squares it to root yaw gated by shove*(1-limp), so a halted rear man who is not shoving carries his board loose. Corpses: `_layCorpseFlat` + `_writeDeathRest`.
- Body: `blockHead` is an 8-sided cylinder squared up (HEAD_CORNER) with crown/brow/jaw rings, built at headBase and scaled; head size comes from HEAD_OF_BODY; `headTop` is scaled by headUnit/(HAT_CUT_FOR_HEAD*headSize), which enlarges every hat, crown and halo; hair (unitFactory) is a sphere 1.5x the head, parented to the head mesh. Mitt is a scaled sphere sized from `upperArmTop`.
