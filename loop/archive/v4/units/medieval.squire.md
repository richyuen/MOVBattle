# medieval.squire
Status: done   Audited: 355   Done: 360
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (360)
b PASS (355)
c PASS (351)
d PASS (cost 100, hp 1.63x, dmg 1.33x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
352 | longsword slab cut (LONGSWORD) [S] (4285473) | b | approved
353 | two-fisted hilt (TWO_FIST_SWORD) [S] (7f4b61c) | b | approved
355 | crusader great helm (CRUSADER_HELM) [S] (92256f8) | a | approved
356 | tabard: beige cross pattee, hem band (SQUIRE_TABARD) [S] (3122a04 +78cf8cc) | a | approved
357 | lower legs: greaves, knee cops, shoes (SQUIRE_LEGS) [S] (74fa206) | a | approved
358 | arms: sleeve shells, couters, gauntlets (squireArms, SQUIRE_ARMS) [S] (56aed0c) | a | approved
359 | sleeve tone: SQUIRE_ARMS.beige (.74,.6,.4) glow .04 [P] (caa7905, reverted e6c54e8) | a | rejected
360 | sleeve material: warmCloth + unglow (WARM_CLOTH) [S] (ca82190 +def8b50) | a | approved
## Rejected (last 4)
- sleeve tone [P] [1] — 359: no visible step, sleeves still neutral grey; SQUIRE_ARMS spent
## Notes (max 3 lines)
- 360 readback: shell materials were intact; the cool hemi ground light + ACES grey pale tan. Light warm cloth = warmCloth (own amber emissive), out of the glow layer.
- critic 360 (minor): self-lit sleeves nearly unshaded. critic 357: greaves bulky, shoes muted.
