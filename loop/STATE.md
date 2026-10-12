# Loop state
Iteration: 56   Last re-audit: 55   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- tribal-hair-missing 80cbbb5 — APPROVE
- hands-ball-not-slab 988cc6b — APPROVE
- tray-dome-not-flat-shelf 4e7ba99 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: tribal-hair-missing (80cbbb5) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: hands-ball-not-slab (988cc6b) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: tray-dome-not-flat-shelf (4e7ba99) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] helm-tall-grey-tube: fitted faceted helmets near head size [attempts: 0] — ref: trailer_3_sheet_02 r1c1 — ours: closeup_weapon_reads.png
2. [vfx] cannon-blast-yellow-ball: flame-shaped burst, not a giant opaque yellow ball [attempts: 0] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
3. [unit-look] hair-cap-not-spiky-mop: spiky near-black mop 1.5-2x head, down to shoulders [attempts: 0] — ref: gameplay_sheet_02 r2c2 — ours: big_melee_9s.png
4. [unit-look] torso-flat-box: chunky cloth, sleeve and fur volumes [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
5. [ui-flow] tray-sides-vertical: flared sides, contiguous shield tabs on the edge, more opaque fill [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
6. [unit-look] hands-pointed-gems: blunt squared mitts ~1.4x wrist [attempts: 0] — ref: tabs_screenshot_04 — ours: closeup_weapon_reads.png
7. [maps-light] arena-slab-not-island: rounded floating island with terrain variation [attempts: 0] — ref: gameplay_sheet_02 r3c3 — ours: big_melee_placement.png
8. [battle-feel] dead-flat-stick-figures: piled bulky ragdolls [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey
- front-line-does-not-compress [attempts: 1] — regression: pack-scaled solver radii failed crowd_topple, spillover_chain
- idle-arms-hang-symmetric [attempts: 1] — raised weapon arm did not show on knight/Zeus
- tree-crowns-cast-no-shadow [attempts: 1] — crowns and rocks shade themselves near-black

## Notes for next iteration (max 5 lines)
- Gap 3: unitFactory hair block, diameter ~1.5x head, y scale 1.25, lower at back, 4-6 rim cones; darker colour.
- Gap 6: bodyBuilder mitt() -> tapered flat-shaded box ~(0.55, 0.75, 0.38) of handDiameter. Don't touch handDiameter.
- Gap 5: index.html #factionLabel/#unitGrid flared bottom corners, #factionTabs tab margin-bottom 0, alpha .3 -> ~.45.
- Gap 2: fireball colour flip-flops across audits; add flame-tongue/pale core meshes, don't recolour the body.
- No new Math.random in VFX or poses. Gaps 3, 4, 6 share unitFactory/bodyBuilder; mix in 1 (propBuilder), 2 or 5.
