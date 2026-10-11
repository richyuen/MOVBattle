# Loop state
Iteration: 11   Last re-audit: 10   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 3 | ui-flow 3 | camera 3 | vfx 2

## Focus (2-3 gaps this iteration)
- cannon-muzzle-puff 6d41f83 — APPROVE (vfx 1->2)
- topple-body-disassembles 711f420 — APPROVE (battle-feel 2->2)
- budget-bare-number-count a7296ec — APPROVE (ui-flow 3->3)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: cannon-muzzle-puff (6d41f83) VERDICT: APPROVE SCORE: vfx 2/5 (previous: 1/5)
- GAP: topple-body-disassembles (711f420) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)
- GAP: budget-bare-number-count (a7296ec) VERDICT: APPROVE SCORE: ui-flow 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] cannon-ball-and-impact-burst: no black ball in flight, no dust/fire burst at the hit [attempts: 0] — ref: trailer_3_sheet_03 — ours: war_machines_1200ms.png
2. [battle-feel] topple-pivots-at-feet: toppled and downed units hang at 30-45 deg, feet planted, not lying flat in a heap [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
3. [battle-feel] dead-not-limp: limp overlay skips AnimState.Dead; result field is hats and weapons, no crumpled corpses [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
4. [vfx] puff-smooth-and-oversized: smoke clump reads as one soft white ball; handgun puffs hide the shooter [attempts: 0] — ref: trailer_2_sheet_02 — ours: closeup_weapon_reads.png
5. [ui-flow] budget-stacked-icons: count is a faint subscript beside a 7-digit number; TABS stacks count over budget with figure/coin icons [attempts: 0] — ref: gameplay_sheet_02 — ours: hud_placement.png
6. [ui-flow] tray-text-pills: text pills + search box, not an arc of line-art icon tiles [attempts: 0] — ref: gameplay_sheet_03 — ours: hud_placement.png
7. [battle-feel] standing-units-rigid: rear units bolt upright, arms at sides; no lean/sway [attempts: 0] — ref: trailer_3_sheet_01 — ours: big_melee_5s.png
8. [camera] gallery-shots-high-far: gallery stills are top-down, units 40-150 px on empty grass [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- nav-match-slab [attempts: 1] — no evidence file shows a nav clip; campaign half untouched
- mammoth-launch [attempts: 1] — no airborne body in any still; no scenario exercises the launch
- spell-solid-shapes [attempts: 1] — no capture shows a bolt/fireball; soft halo remains
- camera-spread-radius [attempts: 1] — both-teams bbox backs the camera off; sparse fights still empty
- cloth-second-tone [attempts: 1] — washed out by light presets; floor 0.24 reads black

## Notes for next iteration (max 5 lines)
- shot() now redraws until shaders compile, so --showcase-only is safe for re-audits and probes.
- Cannon fires near 0.8 s and 3.1 s in war_machines; a ball/impact still needs a frame ~0.2 s after a shot.
- _animateDead adds +2*dt X velocity forever (0.97 damping): joints spin ~1 rad/s endlessly. Fix with gap 3.
- Puff next: 0.45*scale spread, alternate blobs 0.8 grey, shrink for scale <= 1 (spawnMuzzleFlash).
- Topple lean lives in _applyCrowdLean (runtimeUnit ~918): pitch clamp -1.22, pivot at feet.
