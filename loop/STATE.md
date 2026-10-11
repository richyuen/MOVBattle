# Loop state
Iteration: 10   Last re-audit: 10   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 3 | ui-flow 3 | camera 3 | vfx 1

## Focus (2-3 gaps this iteration)
- war-machines-empty-frame b74a85a — APPROVE (vfx 1->1)
- placement-debug-clutter e6900cc — APPROVE (ui-flow 3->3)
- plank-corpses afc12bb — APPROVE (battle-feel 2->2)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: war-machines-empty-frame (b74a85a) VERDICT: APPROVE SCORE: vfx 1/5 (previous: 1/5)
- GAP: placement-debug-clutter (e6900cc) VERDICT: APPROVE SCORE: ui-flow 3/5 (previous: 3/5)
- GAP: plank-corpses (afc12bb) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] cannon-muzzle-puff: no fat white puff; current one is tiny, gone in 0.35 s [attempts: 0] — ref: trailer_3_sheet_03 — ours: war_machines_4000ms.png
2. [battle-feel] topple-body-disassembles: downed squires are a ground ring with hat/collar/hands floating above, no torso [attempts: 0] — ref: trailer_3_sheet_03 — ours: war_machines_2400ms.png
3. [vfx] cannon-ball-and-impact-burst: no black ball in flight, no dust/fire burst at the hit [attempts: 0] — ref: trailer_3_sheet_03 — ours: war_machines_2400ms.png
4. [battle-feel] dead-not-limp: limp overlay skips AnimState.Dead; corpses get no crumple [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
5. [battle-feel] topple-pivots-at-feet: toppled units hang at 45 deg, feet planted, not lying in a heap [attempts: 0] — ref: trailer_2_sheet_02 — ours: big_melee_5s.png
6. [ui-flow] budget-bare-number-count: "Team A: 1000000" x2; TABS has a bare number + unit count, active side only [attempts: 0] — ref: gameplay_sheet_02 — ours: hud_placement.png
7. [ui-flow] tray-text-pills: text pills + search box, not an arc of line-art icon tiles [attempts: 0] — ref: gameplay_sheet_03 — ours: hud_placement.png
8. [battle-feel] standing-units-rigid: rear units bolt upright, arms at sides; no lean/sway [attempts: 0] — ref: trailer_3_sheet_01 — ours: big_melee_5s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- nav-match-slab [attempts: 1] — no evidence file shows a nav clip; campaign half untouched
- mammoth-launch [attempts: 1] — no airborne body in any still; no scenario exercises the launch
- spell-solid-shapes [attempts: 1] — no capture shows a bolt/fireball; soft halo remains
- camera-spread-radius [attempts: 1] — both-teams bbox backs the camera off; sparse fights still empty
- cloth-second-tone [attempts: 1] — washed out by light presets; floor 0.24 reads black

## Notes for next iteration (max 5 lines)
- `--showcase-only` captures run cold: gallery shots draw shadows but no bodies (shaders not ready). Use a full capture for re-audits, or warm up first.
- Gap 2 predates the limp overlay (seen before afc12bb): looks like dead squires, check _animateDead (endless +2*dt X pull) before the overlay.
- Cannon stills at 2400/4000 ms fall between shots; retime them or lengthen VFX life. Puff is projectileSystem.ts ~173-185.
- Launch still needs scenario proof first (airborne-height asserts); lift caps: applyDamage 0.95, _enterTopple 0.7, _die 1.35.
- Gallery cameras are high and far (units 40-130 px); camera score fell 4->3 on that, not on the battle camera.
