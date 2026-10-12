# Loop state
Iteration: 90   Last re-audit: 90   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- corpses-all-flat 5207500 — REJECT (reverted f942358)
- limbs-stick-thin 8399b1b — APPROVE
- sky-teal-greyed 31c6d12 — REJECT (reverted 76ece96)
- zeus-no-robe-skirt 89932e6 — APPROVE
- flung-torsos-rigid-planks cd199f1 — APPROVE
- muzzle-smoke-one-ball 0672920 — APPROVE
- tribal-ring-top-arc-thin 78c8fb6 — APPROVE
- tray-filled-trapezoid f6e699f — REJECT (reverted 90ecf31)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: corpses-all-flat (5207500) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: limbs-stick-thin (8399b1b) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: sky-teal-greyed (31c6d12) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: zeus-no-robe-skirt (89932e6) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: flung-torsos-rigid-planks (cd199f1) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: muzzle-smoke-one-ball (0672920) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: tribal-ring-top-arc-thin (78c8fb6) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: tray-filled-trapezoid (f6e699f) VERDICT: REJECT SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] sky-teal-greyed: clear and fog colour overcompensated to about (0.14, 0.62, 0.46) so the rendered sky lands near rgb(88,190,166) [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
2. [battle-feel] corpses-all-flat: side-lying corpses fold both knees about 0.9 rad and drop the upper arm forward [attempts: 1] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
3. [ui-flow] tray-filled-trapezoid: tray fill rgba(10,14,20,0.3) with a 0.9 white outline [attempts: 1] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
4. [unit-look] zeus-no-robe-skirt: zeusSkirt z scale 1.15 -> 1.7, length 0.9 -> 1.6 of the thigh [attempts: 0] — ref: gameplay_sheet_06 r3c1 — ours: closeup_pair_zeus_thor.png
5. [battle-feel] flung-torsos-rigid-planks: fold() floor 0.4 -> 0.7 rad [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
6. [ui-flow] faction-tabs-rounded-squares: pointed shield top on the faction tabs by clip-path [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
7. [vfx] muzzle-smoke-one-ball: lobe base diameter 0.3 -> 0.2, smokeLife 1.5 -> 0.9 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
8. [maps-light] tribal-rim-grey-slab-exposed: back tree row arc 1.3 -> 2.2 rad, min height 3 -> 4 [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- tray-filled-trapezoid [attempts: 1] — fill 0.15: too faint, the reference tray is a dark panel; names sat on bright crowns
- sky-teal-greyed [attempts: 1] — constant (0.38, 0.80, 0.72): tone mapping (main.ts 259-266) still renders it grey rgb(157,196,190)
- corpses-all-flat [attempts: 1] — root roll to a side from `fall` bits: straight-limbed side bodies not readable, 0 of 9 seen
- crowns-second-hue-lemon [attempts: 1] — leaves (0.90, 0.38, 0.30) and emissive 0.30: the yellow material was untouched and still lemon
- grass-knee-high-carpet [attempts: 2] — half 0.025+s*0.02: needles, cards must be wide; before that patchHeight cut
- far-band-level-berry-hedge [attempts: 2] — height 5-11: giant trunkless balls; before that 2-6.5: hidden below the ring
- lightning-ruler-straight-bars [attempts: 2] — strict alternation still an even thin sawtooth; before that parallel bars
- kite-shield-door-sized [attempts: 1] — rim lerped 0.6 to white: references show rims darker than the face

## Notes for next iteration (max 5 lines)
- Spent (2 attempts, never retry): upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack. Blast-lift cuts stall battle_recap_result_legacy_tank_shell. Air-pose edits stay pose-only.
- Ring is 210 trees 3-6 tall, spread 1+s*0.26, plus a 12-tree back row at +Z (top of placement view; seeds 121-124). trailer_3_sheet_03 r3c1 is not TABS.
- _buildLimpPose and death must draw no new Math.random(): use `pick`/`fall` bits (512, 1024, 2048 taken). Corpse side roll lives in runtimeUnit _layCorpseFlat (root rot.z = +-PI/2).
- TEAM_COLORS[1] is (0.8, 0.16, 0.2); do not mutate. getCloth materials are shared: no emissive. Zeus edits gate on `isZeus`. LIMB_THIN is 1.2.
- Sources are CRLF on disk: sed -i by line number works; multi-line edits need a node script that matches the file's EOL (heredocs to $TEMP are unreliable, use Write).
