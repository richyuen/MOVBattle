# Loop state
Iteration: 36   Last re-audit: 35   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- mono-team-no-cloth c8b63e2 — APPROVE
- grass-confetti-cards 8459e8e — APPROVE
- blast-victims-stand-up 6ec6f71 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: mono-team-no-cloth (c8b63e2) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: grass-confetti-cards (8459e8e) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)
- GAP: blast-victims-stand-up (6ec6f71) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] grass-short-sparse: ankle-high clumps ~3 per m2, bare lawn between; want knee-high overlapping clumps hiding feet [attempts: 0] — ref: tabs_screenshot_02 — ours: big_melee_2s.png
2. [unit-look] cloth-same-hue-no-boots: torso only a darker team hue, legs bare skin; want off-hue cloth and dark boots [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
3. [battle-feel] downed-pose-crouch: blast survivors sit arms-up, evenly spaced; want flat splayed bodies in heaps, staggered recovery [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
4. [battle-feel] shield-line-gapped: 2-3 separated shield bearers; want ~ten overlapping into a wall [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
5. [vfx] cannon-no-fireball: impact is a small white puff and pebble ring; want a large orange-white fireball [attempts: 0] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
6. [battle-feel] blast-uniform-popcorn: every body in radius goes straight up to one height; want centre arcing outward, edge staggering [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: war_machines_1100ms.png
7. [unit-look] stick-limbs-box-hands (= cube-hands-stick-limbs): rod limbs, cube hands, flat octagon shields; want tapered limbs, mitts, domed shields [attempts: 2] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
8. [maps-light] blurry-clouds-flat-sky: soft glowing cloud blobs on one-tone sky; want hard-edged low-poly puffs on pastel gradient [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_1100ms.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- lime-field-flat-sky [attempts: 1] — sky went grey; frame-wide -18 saturation muddied team colours
- muzzle-smoke-bank [attempts: 2] — bank is impact smoke, not muzzle
- plank-lean-rod-arms [attempts: 1] — attack-only elbow clamp
- cube-hands-stick-limbs [attempts: 2] — thin box trades cube for paddle
- island-rect-no-cliff [attempts: 1] — cliff band in no PNG

## Notes for next iteration (max 5 lines)
- Gap 1: mapBuilder _createFieldBlades h 0.25-0.45, half 0.08-0.12, count unchanged, no shade changes.
- Gap 2: bodyBuilder shins and feet get a neutral dark boot material, not skin; unitFactory reassigns lower legs to skin.
- Gap 3: runtimeUnit blast-landing branch: prone pose (torso pitch ~90 deg, slack arms), sprawl 3 s +/-1 via spread().
- Gap 8 overlaps rejected lime-field-flat-sky: change clouds only, leave sky saturation alone.
