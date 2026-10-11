# Loop state
Iteration: 15   Last re-audit: 15   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 3 | vfx 3

## Focus (2-3 gaps this iteration)
- mammoth-pink-box 347c8e2 — APPROVE (unit-look 2->3)
- front-lines-stand-apart 45ea617 + 988a954 — APPROVE (battle-feel 2->2)
- bulb-heads-tube-limbs 9334f57 — APPROVE (unit-look 2->3)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: mammoth-pink-box (347c8e2) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 2/5)
- GAP: front-lines-stand-apart (45ea617 + 988a954) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)
- GAP: bulb-heads-tube-limbs (9334f57) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 2/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] upright-rigid-ranks: engaged and bracing units stand vertical, identical poses; want torsos pitched into the shove, idle sway [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
2. [battle-feel] polearm-brace-gap: spear and shield ranks still stop a body length apart; want shield contact two deep [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
3. [unit-look] cube-hands-stick-limbs: cube hands on uniform pencil limbs; want flat mitts, thick thigh tapering to thin ankle [attempts: 0] — ref: trailer_3_sheet_01 — ours: big_melee_5s.png
4. [unit-look] mammoth-tusks-straps: thin kinked tusks dropping from the jaw, strap-like barrel bands; want fat forward-and-up arcs, face paint splotches [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
5. [vfx] balloon-explosion: smooth yellow/orange balloon cluster; want ragged fire, chunky debris, flung bodies [attempts: 0] — ref: trailer_3_sheet_02 — ours: war_machines_1100ms.png
6. [maps-light] brown-cone-mountains: brown flat-topped cones, teal hex pillars, fuzzy clouds; want pale faceted ranges behind a tree line, crisp clouds [attempts: 0] — ref: trailer_3_sheet_01 — ours: big_melee_2s.png
7. [unit-look] props-undersized: small flat shields at the waist, plain bucket hats; want shoulder-wide shields in front of the torso [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
8. [ui-flow] text-pill-tray: bordered text pills under a full-width tab bar; want thin spaced white caps on dark tiles [attempts: 0] — ref: tabs_screenshot_04 — ours: hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- cannon-ball-and-impact-burst [attempts: 1] — no black ball in any still: hidden by a 1.6-scale puff; still times guessed
- nav-match-slab [attempts: 1] — no evidence file shows a nav clip; campaign half untouched
- mammoth-launch [attempts: 1] — no airborne body in any still; no scenario exercises the launch
- spell-solid-shapes [attempts: 1] — no capture shows a bolt/fireball; soft halo remains
- camera-spread-radius [attempts: 1] — both-teams bbox backs the camera off; sparse fights still empty

## Notes for next iteration (max 5 lines)
- Gap 2: simulationSystem `distance <= engageDistance` block: polearms press to contactDistance + 0.6; bracers must stay put (shield_wall scenario).
- Gap 3: bodyBuilder mitt() width 0.78 -> 0.4; apply LIMB_THIN to bottom radii only.
- Gap 4: buildMammoth tuskPitches start ~1.1, tuskGirths +40%; paintMat is bodyMaterial (team tint).
- Sideways fling over ~3 m/s or re-launching airborne bodies fails battle_recap_result_legacy_tank_shell.
