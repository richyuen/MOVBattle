# farmer.scarecrow
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 375)
 2. elbow crows in unit_farmer.scarecrow_reload: crows clump at the hands as spiky balls with glowing white eyes — TABS: one wingless crow perched upright on each elbow, plus one in each hand (ref: .red.png)
 3. mask in unit_farmer.scarecrow_reload: a tall flat-topped can — TABS: rounded sack hood with a seam, button eyes, narrow tan collar (ref: .png)
b PASS (375)
c PASS (375)
d PASS (cost 1200, hp 1.38x, dmg 5.56x, cd 9.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a elbow crows — blocker 2: a wingless upright crow perched on each elbow (body, head, beak, two bead eyes, no glow), separate from the hand crows — ref: .red.png — ours: unit_farmer.scarecrow_reload.png
2. [S] a mask — blocker 3: rounded sack hood with a seam, button eyes, narrow tan collar instead of the flat-topped can — ref: .png — ours: unit_farmer.scarecrow_reload.png
## Attempts (iter | gap | criterion | verdict)
339-347 | crow wings, sack mask, held crow, flying crows, T-pose + perches, A-pose reload, clothes, hover [S] | a,b,c | approved
375 | layered feather rows, team wedge on the leading edge (CROW_LAYERS, crow only) [S] (730ae01) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- T/A pose is _holdTPose; hover is _hover. FLYING_CROW must not be re-nudged as [P]. Wings: buildFeatherWings with style.rows (valkyrie untouched).
- Critic 375 minor: team band short and above the arm (TABS red edge runs along the arm's line to the hand).
- 347 critic: hover lift .13 small, legs keep walking while hovering - polish only.
