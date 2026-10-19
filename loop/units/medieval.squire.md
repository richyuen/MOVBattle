# medieval.squire
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 355)
 2. arms in unit_medieval.squire_idle grey shoulder to hand — TABS: beige sleeves shoulder to elbow under grey couters and gauntlets (ref: medieval.squire.blue.png)
b PASS (355)
c PASS (351)
d PASS (cost 100, hp 1.63x, dmg 1.33x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a arms — blocker 2: beige upper sleeves, grey couters at the elbow, grey gauntlet shells on forearm and hand (model on archerArms) — ref: medieval.squire.blue.png — ours: unit_medieval.squire_idle.png
## Attempts (iter | gap | criterion | verdict)
352 | longsword: slab sword cut LONGSWORD (SlabCut) [S] (4285473) | b | approved
353 | two-fisted hilt: off fist onto the grip (TWO_FIST_SWORD) [S] (7f4b61c) | b | approved
355 | crusader great helm (CRUSADER_HELM) [S] (92256f8) | a | approved
356 | tabard: beige cross pattee, hem band, shoulder edges (squireTabardTrim, SQUIRE_TABARD) [S] (3122a04 +78cf8cc) | a | approved
357 | lower legs: grey greaves, knee cops, brown shoes with ankle strap (squireLegs, SQUIRE_LEGS) [S] (74fa206) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 357: greaves bulky, shoes muted grey-brown (minor). critic 356: cross pale grey rather than beige.
- Mail arms come from unitFactory's tabard block (MAIL_COLOR): the sleeves gap recolours/shells over them in medievalDress.
