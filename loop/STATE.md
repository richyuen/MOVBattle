# Loop state
Iteration: 166   Last re-audit: 165   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion, from last audit; see CRITIC.md for the letters)
battle-feel: a FAIL b PASS c FAIL d PASS (2/4) — a: two boards of a wall lap now, but no rank of more than two reads as a line, boards point every way, no second rank; c: lineup units share one symmetric stance
unit-look: a PASS b PASS c FAIL d PASS (3/4) — c: limbs taper and the torso is a wedge, but bodies are squat: big head on the shoulders, short arms and legs, wrist-width nub hands
maps-light: a PASS b FAIL c PASS d PASS (3/4) — b: shadows are a faint smudge on the grass cards, sky one flat teal
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Total 20/24.

## Focus (every gap this iteration)
BASE 71f54ac (evidence c233a23: shield_wall_2500ms / 2650ms)
- [S] battle-feel.a shield-rank-slotting (1eaf71b) — APPROVE, criterion still FAIL
- [S] unit-look.c tapered-limbs (786c497) — APPROVE, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] shield-rank-slotting (1eaf71b) VERDICT: APPROVE CRITERION: battle-feel.a FAIL (previous: FAIL)
- GAP: [S] tapered-limbs (786c497) VERDICT: APPROVE CRITERION: unit-look.c FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets)
1. [S] battle-feel.a wall-second-rank-parallel [0] — rear-rank carriers and spearmen get a depth slot behind a front slot; slotted carriers hold heading to the wall's advance in contact (simulationSystem `_assignShieldSlots`) — ref tabs_screenshot_06 — ours shield_wall_2650ms
2. [S] unit-look.c squat-proportions [0] — neck segment, smaller head, longer arm and leg segments, mitt sized from the limb top (bodyBuilder) — ref tabs_screenshot_04 — ours lineup_medieval
3. [S] battle-feel.c idle-stance-variants [0] — per-unit idle pose set hashed per unit: weight on one leg, weapon arm hanging or shouldered, head tilt — ref trailer_3_sheet_01 r3c1 — ours lineup_medieval
4. [S] maps-light.b sky-gradient-and-shadows [0] — sky dome pale horizon to teal zenith, long low-sun body shadows on the ground — ref tabs_screenshot_01 — ours closeup_state_reads
5. [S] battle-feel.a wall-evidence-front-view [0] — evidence-only: three-quarter front capture of the shield_wall scenario (capture.mjs) — ref tabs_screenshot_06 — ours shield_wall_2500ms
6. [S] battle-feel.a carriers-fall-out-of-line [0] — braced carriers in a wall resist topple and turn while both neighbours stand — ref trailer_3_sheet_01 r2c2 — ours shield_wall_2500ms
7. [P] battle-feel.a bodies-merge-under-boards [0] — shieldSlotSpacing 0.54 -> 0.62 — fallout of shield-rank-slotting (166) — ours shield_wall_2650ms
8. [P] unit-look.c upper-limbs-blocky [0] — SLEEVE_BULK 1.15 -> 1.05 — fallout of tapered-limbs (166) — ours closeup_pair_zeus_thor

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
- LEDGER.md holds tuned values and spent gaps: read it first. Edit with a scratchpad EOL-aware node patch script (spec written with the Write tool; bash heredocs choke on apostrophes); commit per gap with `git commit <paths> -F -`.
- Fast probe beats full captures: a scratch playwright script (createRequire from loop/scripts, build + vite preview, spawn, advanceTime, print temporary `console.error` lines, optional screenshot) runs in ~40 s. big_melee outcome changes run to run.
- Shield walls: `_assignShieldSlots` (every update) groups ai.brace carriers with a full board by rank depth then sideways gap, slots about the wall centre; `_shieldSlotStep` feeds march steer and in-contact sidle; same-wall pairs collide at 0.9 of the spacing. In big_melee several protectors on one flank stand still for the first second (was so before 166, cause unknown) and the mammoth hides red's wall: judge walls in shield_wall_*. A march hold for men without boards and a blocked-way gate were tried and dropped (walls stopped closing in the press).
- Shield pose: board is the `/shield$/` child of leftHand, face +z; `_squareShield` squares it to root yaw gated by shove*(1-limp). Corpses: `_layCorpseFlat` + `_writeDeathRest`.
- Body: `wedgeTorso` is a 3-ring cylinder with displaced rings (unitFactory clones torsoMesh for tabards and skirts and reads its bounds); limbs are `tapered` cylinders, lower limb starts at the upper limb's end; feet sized from FOOT_ANKLE.
