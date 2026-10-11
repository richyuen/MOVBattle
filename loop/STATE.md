# Loop state
Iteration: 16   Last re-audit: 15   Consecutive rejects: 1   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 3 | vfx 3

## Focus (2-3 gaps this iteration)
- polearm-brace-gap dec489d — REJECT, reverted bf0029a
- upright-rigid-ranks 478dac9 — REJECT, reverted 8db14bb
- cube-hands-stick-limbs fabf24b — REJECT, reverted 414d8cf

## Last verdicts (one line per gap, verbatim critic header)
- GAP: polearm-brace-gap (dec489d) VERDICT: REJECT SCORE: battle-feel 2/5 (previous: 2/5)
- GAP: upright-rigid-ranks (478dac9) VERDICT: REJECT SCORE: battle-feel 2/5 (previous: 2/5)
- GAP: cube-hands-stick-limbs (fabf24b) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] polearm-brace-gap: braced shield lines do not meet; protectors planted, hoplites a body length short [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
2. [battle-feel] upright-rigid-ranks: engaged and holding units vertical, straight legs; want 30-45 deg hunch, crouched brace, idle sway [attempts: 1] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_9s.png
3. [unit-look] cube-hands-stick-limbs: square plate hands on needle wrists, line ankles on disc feet; want compact mitts, limbs thick to the cuff [attempts: 1] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_5s.png
4. [unit-look] tray-shields: small pale discs flat at the waist; want shoulder-wide team-colored round shields vertical in front of the torso [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
5. [vfx] balloon-explosion: opaque yellow/orange/white balls; want a fire flash breaking into dark smoke [attempts: 0] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
6. [maps-light] flat-lime-ground: few dark tufts, hard horizon; want dense grass blades, hazy distant treeline [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_5s.png
7. [unit-look] mammoth-box-tusks: stacked brown boxes, straight tusks, no fur; want faceted rounded body, curved tusks [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
8. [camera] gallery-high-far: lineup/closeup units ~40 px tall; want a low, close hero angle [attempts: 0] — ref: tabs_screenshot_02 — ours: lineup_medieval.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- cube-hands-stick-limbs [attempts: 1] — mitt 0.4x1.3x1.0 shows its big face side-on; LIMB_THIN compounded to 0.64 at wrist/ankle
- upright-rigid-ranks [attempts: 1] — 0.22-0.38 rad lean unreadable on standing units; holding bracers and idle untouched
- polearm-brace-gap [attempts: 1] — brace-on-brace only, so mixed lines stay planted; big_melee has no polearm_melee
- cannon-ball-and-impact-burst [attempts: 1] — no black ball in any still: hidden by a 1.6-scale puff
- nav-match-slab [attempts: 1] — no evidence file shows a nav clip; campaign half untouched

## Notes for next iteration (max 5 lines)
- Gaps 1-3 are under Rejected: pick 4-8. Earlier rejects (mammoth-launch, spell-solid-shapes, camera-spread-radius) stay unpickable.
- Critic NEXT EDITs: bracer presses whenever target is not moving, gap 0; shove pitch 0.40+h*0.25 and call it from the brace hold path; mitt 0.6/1.0/0.7, thin only elbow/knee.
- Gap 4: hoplite and protector are shield_melee; shield meshes are in propBuilder (87 KB, grep only).
- Sideways fling over ~3 m/s or re-launching airborne bodies fails battle_recap_result_legacy_tank_shell.
