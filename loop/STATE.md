# Loop state
Iteration: 59   Last re-audit: 55   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- helm-stovepipe-pale 9b653f4 — APPROVE
- fire-orange-not-fringe d981b0b — REJECT (reverted 91bf40e)
- budget-separate-disc 33beafb — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: helm-stovepipe-pale (9b653f4) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: fire-orange-not-fringe (d981b0b) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: budget-separate-disc (33beafb) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] fire-yellow-outweighs-orange: fewer orange tongues, two heart lobes yellow, smoke stays off-white [attempts: 1] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
2. [unit-look] helm-neutral-steel: near-black steel, almost no team wash, narrower than shoulders [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_weapon_reads.png
3. [unit-look] torso-box-no-shoulders: taper from broad shoulders, chunky sleeves and thighs [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
4. [vfx] fireball-merged-bloom: one continuous mass, several times larger [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
5. [ui-flow] budget-arc-joins-tray: equal-width boxes, arc is the tray's border stroke, bigger filled icons, white numbers [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
6. [battle-feel] shield-wall-loose: shoulder to shoulder, overlapping round shields [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
7. [maps-light] placement-board-bare: organic island with buildings, paths, river [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
8. [camera] victory-shot-on-rump: frame a survivor from behind over the field [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- fire-orange-not-fringe [attempts: 1] — orange mass went up (4/7 tongues); grey smoke reads as rocks
- tabs-filled-round-tiles [attempts: 1] — point on wrong end; hollow tabs float off the tray
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey
- front-line-does-not-compress [attempts: 1] — regression: pack-scaled solver radii failed crowd_topple, spillover_chain

## Notes for next iteration (max 5 lines)
- Gap 1: visualEffects tongue material `tongueLeans[i] >= 0.85`; heart lobes 1-2 flashMat; do not touch smokeMat.
- Gap 2: propBuilder great_helm steel (.2,.21,.24), lerp .08. Head half-width ~.095s is not hidden: keep bottom diameter >= .21.
- Gap 5: index.html `.budget-units` min-width 138px; shrink `.budget-label::before` so its foot meets the tray corner.
- visualEffects.ts is CRLF; edit by node script, check `git diff --stat`. No new Math.random in VFX or poses.
- Next iteration (60) is a re-audit.
