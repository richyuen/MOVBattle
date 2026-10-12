# Loop state
Iteration: 45   Last re-audit: 45   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- shadows-noon-blobs 38185c6 — REJECT (reverted 75cc2a1)
- idle-mannequin-arms-down 6e0b129 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: shadows-noon-blobs (38185c6) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: idle-mannequin-arms-down (6e0b129) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] trees-cast-no-shadow: trees and props throw no ground shadow, only units cast [attempts: 0] — ref: gameplay_sheet_01 — ours: hud_placement.png
2. [battle-feel] idle-legs-locked-parallel: straight parallel legs, vertical torso, no staggered bent-knee stance [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
3. [maps-light] unit-shadows-pale-and-short: faint half-body smears, some units show none [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
4. [battle-feel] cannon-crew-stands-on-cannon: a crewman stands on the barrel/wheel, not beside the gun [attempts: 0] — ref: trailer_1_sheet_01 — ours: war_machines_3800ms.png
5. [vfx] hit-flash-white-orbs: glowing white spheres mark melee hits; ref has debris, no flash [attempts: 0] — ref: trailer_2_sheet_02 — ours: big_melee_2s.png
6. [maps-light] flat-teal-sky-and-flat-field: flat teal sky, no warm grading, dead-flat field [attempts: 1] — ref: tabs_screenshot_05 — ours: war_machines_3800ms.png
7. [unit-look] box-mitt-hands-and-rod-limbs: cube hands on uniform rods [attempts: 2] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
8. [maps-light] placement-arena-square-slab: square slab, sparse ring, no round island [attempts: 2] — ref: gameplay_sheet_01 — ours: big_melee_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- shadows-noon-blobs [attempts: 1] — sun angle alone: trees cast nothing, unit shadows pale half-body smears
- back-ridge-pale-slab [attempts: 1] — height cut alone leaves the band; footprint makes it from the raised camera
- lightning-soft-beam-fog-ball [attempts: 1] — straight bar still main read; halo remains
- shield-line-gapped [attempts: 1] — ally overlap fails battlefeel_spillover_chain
- downed-pose-crouch [attempts: 1] — prone bodies hidden by grass; air pose cloned rigid stars

## Notes for next iteration (max 5 lines)
- Gap 1: only unitFactory.ts:165 calls addShadowCaster; mapBuilder trees (trunk/canopy ~l.387) need the generator from main.ts:132.
- Gap 2: in _animateIdleHumanoid add hip/knee offsets from _idlePose (one hip forward, that knee bent); no Math.random.
- Gap 3: shadowGen is blur ESM kernel 48 (main.ts:134); try a smaller kernel / darkness before moving the sun again.
- Gap 4: buildCannon operator is already at -Z; check linked actors in runtimeUnit before vehicleBuilder.
- Static gallery frames now run animator.update(0); units no longer render in the zeroed rest pose.
