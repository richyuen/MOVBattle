# medieval.squire
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 355)
 2. arms in unit_medieval.squire_idle (narrowed 358): sleeve over grey couter and gauntlet there, but the upper sleeves read pale grey-white — TABS: beige-tan sleeves shoulder to elbow under grey couters and gauntlets (ref: medieval.squire.blue.png)
b PASS (355)
c PASS (351)
d PASS (cost 100, hp 1.63x, dmg 1.33x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] a sleeve tone (fallout of 56aed0c, 358) — blocker 2: SQUIRE_ARMS.beige (.82,.72,.52) -> (.74,.6,.4), glow .1 -> .04; NEXT: unit_medieval.squire_idle, upper sleeves turn tan — ref: medieval.squire.blue.png
## Attempts (iter | gap | criterion | verdict)
352 | longsword: slab sword cut LONGSWORD (SlabCut) [S] (4285473) | b | approved
353 | two-fisted hilt: off fist onto the grip (TWO_FIST_SWORD) [S] (7f4b61c) | b | approved
355 | crusader great helm (CRUSADER_HELM) [S] (92256f8) | a | approved
356 | tabard: beige cross pattee, hem band, shoulder edges (squireTabardTrim, SQUIRE_TABARD) [S] (3122a04 +78cf8cc) | a | approved
357 | lower legs: grey greaves, knee cops, brown shoes with ankle strap (squireLegs, SQUIRE_LEGS) [S] (74fa206) | a | approved
358 | arms: beige sleeve shells, grey couters, gauntlet shells, grey hands (squireArms, SQUIRE_ARMS) [S] (56aed0c) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 357: greaves bulky, shoes muted grey-brown (minor). critic 356: cross pale grey rather than beige.
- Arm dress is shells: unitFactory's tabard block paints the arms mail (MAIL_COLOR) after dressMedieval runs.
