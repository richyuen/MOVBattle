# Loop state
Iteration: 116   Last re-audit: 115   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- fireball-discs-separate b8c9162 — APPROVE
- tusk-white-not-ivory 50bf618 — REJECT (reverted 794eacd)
- charge-lean-half c3739f8 — APPROVE
- trunk-top-haze 9d447eb — APPROVE
- carriage-bed-taupe 297d8bd — APPROVE
- trunks-grey-not-cream f08e5f6 — APPROVE
- mammoth-mop-hat e060bac — REJECT (reverted 4f4a023)
- ground-ochre-overshoot d8effb7 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-discs-separate (b8c9162) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: tusk-white-not-ivory (50bf618) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: charge-lean-half (c3739f8) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: trunk-top-haze (9d447eb) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: carriage-bed-taupe (297d8bd) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: trunks-grey-not-cream (f08e5f6) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-mop-hat (e060bac) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: ground-ochre-overshoot (d8effb7) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] mammoth-mop-hat: cap vs tuft 38,27,66 at 0.35x hide brightness; crestMat no self-light, indigo lerp 0.75 to 0.35 [attempts: 2] — ref: tabs_screenshot_01 — ours: big_melee_result.png
2. [unit-look] tusk-white-not-ivory: 202,190,174 B/R 0.86 vs 152-188,119-152,102-122 B/R 0.65-0.67; tuskMat emissive to (0.08,0.05,0.03), tusks out of glow [attempts: 2] — ref: tabs_screenshot_01 — ours: big_melee_result.png
3. [unit-look] red-team-maroon: skin 115,42,61 vs coral 176-206,67-76,86-95 [attempts: 2, spent] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
4. [vfx] fireball-lobes-cream: lobes 229,223,199 B/R 0.87 vs yellow 244,221,152, orange foot 241,173,134; visualEffects.ts coreMat.emissiveColor (0.95,0.88,0.5) to (0.70,0.60,0.25) [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
5. [battle-feel] presser-lean-capped: walk 0.55 under clamp 0.6, front ranks upright at contact; proceduralAnimation.ts shove clamp 0.6 to 0.75 [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
6. [battle-feel] lean-waist-fold: torso folds over vertical legs vs whole-body tilt, trailing leg; walk: move part of the 0.55 pitch to hips/root [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_weapon_reads.png
7. [maps-light] field-dark: field 209 red vs 235, trunks 186 vs 218; small lift of sun intensity or exposure in mapBuilder.ts [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
8. [unit-look] carriage-top-tan: bed top G/R 0.84 vs 0.70-0.76; vehicleBuilder.ts buildCannon wood green 0.36 to 0.30 [attempts: 1] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- mammoth-mop-hat [attempts: 2] — hideLight on crestMat: cap 98,60,116, bright violet beanie, further from ref
- tusk-white-not-ivory [attempts: 2] — diffuse (0.80,0.60,0.40): still 202,190,174; emissive and bloom set it
- mammoth-no-launch [attempts: 2] — lift 13-17: farmer airborne and "steady" at 2.1s, fails battlefeel_spillover_chain
- shove-attack-fold [attempts: 1] — half shove pitch while Attacking: folds still there at 5s
- mammoth-mop-beret [attempts: 1] — dome (0, 0.5, 0.52): still two lumps, reads as a cap peak
- fireball-no-orange [attempts: 2] — flashMat emissive (0.7, 0.45, 0.15): 0% orange, lit cloth base clips
- shadow-red-stain [attempts: 1] — darkness 0.2: R landed, G/B overshoot, shade blood red
- airborne-sit-square [attempts: 2] — Sit hip 0.5-0.85, knees 0.15-0.6: knees straight

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth-no-launch, mammoth-mop-hat, tusk-white-not-ivory, airborne-sit-square, fireball-no-orange, cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm, grass tufts. Never shrink enemy collision distance.
- ACES crushes material red and lifts G/B; judge by screen pixel. Fire mats are unlit; orange discs are flameMat (lobes i=1,3). TEAM_COLORS[1] must not be mutated.
- One gap, one change: the critic rejects scope creep and any claim not visible on screen; keep comments true.
- Self-lit materials bloom unless glow-excluded (vehicleBuilder.ts excludes none). Crown lit faces still 15-25 R dim.
- Self-light via factory get(cat, c, { emissive }); never mutate cached makeMat. Edit with `sed -i -b` (plain -i strips CRLF; mapBuilder.ts is LF); commit with `git commit <file> -F -` heredoc.
