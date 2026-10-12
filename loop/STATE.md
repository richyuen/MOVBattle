# Loop state
Iteration: 40   Last re-audit: 40   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- arena-boxed-by-cliff-slabs b28ee15 — APPROVE
- launched-bodies-stiff-identical ad44f99 — APPROVE
- lightning-soft-beam-fog-ball 7a8aed3 — REJECT (reverted b1e6d7c)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: arena-boxed-by-cliff-slabs (b28ee15) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: launched-bodies-stiff-identical (ad44f99) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: lightning-soft-beam-fog-ball (7a8aed3) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] arena-rectangle-no-rim: straight-edged field ending in a hairline; want round island with cliff rim [attempts: 2] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
2. [vfx] lightning-straight-bar-halo: straight white bar, soft halo, thin slivers; want wide crisp jagged shards [attempts: 1] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
3. [battle-feel] landed-bodies-arms-up: downed bodies on backs, forearms vertical; want slack, flat, mixed poses [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
4. [battle-feel] flung-bodies-one-crumple: same tucked crumple, helmet-down, plank torsos; want splayed limbs, bent waists [attempts: 1] — ref: trailer_3_sheet_03 r1c3 — ours: war_machines_1100ms.png
5. [unit-look] torsos-boxy-mitts-cubes: slab torsos, stick limbs, cube hands; want tapered torsos, mitts [attempts: 2] — ref: trailer_3_sheet_01 r1c2 — ours: closeup_weapon_reads.png
6. [maps-light] back-ridge-pale-slab: pale ridge band across screen above straight picket treeline; want void past curved tree ring [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: big_melee_placement.png
7. [maps-light] clouds-soft-blobs: blurred glowing smears; want hard-edged faceted puffs [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_1100ms.png
8. [battle-feel] crowd-thin-ground-visible: ~30 a side, grass between clusters; want shoulder-to-shoulder ranks [attempts: 0] — ref: trailer_1_sheet_01 r3c1 — ours: big_melee_2s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- lightning-soft-beam-fog-ball [attempts: 1] — straight bar still main read; kinks along horizontal side axis invisible from eye level; halo remains
- shield-line-gapped [attempts: 1] — ally overlap fails battlefeel_spillover_chain (squire shift 0.50 < 0.55)
- downed-pose-crouch [attempts: 1] — prone bodies hidden by grass; air pose cloned rigid stars
- lime-field-flat-sky [attempts: 1] — sky went grey; -18 saturation muddied team colours
- muzzle-smoke-bank [attempts: 2] — bank is impact smoke, not muzzle

## Notes for next iteration (max 5 lines)
- Pickable: 3, 4, 6, 7, 8 (1 and 5 at 2 attempts; 2 rejected). 3 and 4 share proceduralAnimation _limpPose.
- Gap 6: halve heights of the four back _createMountain calls (now z 96-101).
- Gap 7: cloud emissive (0.82) trips GlowLayer "glow" + bloom threshold 0.65; lower emissive / exclude from glow.
- Gap 3: _limpPose arm X range -1.5..0.6 holds forearms up when supine; bias arms flat. Blast downed time over 3 s fails battle_recap_result_legacy_tank_shell.
- Lightning: swing corners along world up, thick ~0.8; unlit PBR needs emissive.
