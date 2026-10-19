# medieval.squire
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 355)
 2. arms in unit_medieval.squire_idle: the upper sleeves still read neutral grey (about RGB 141,135,133) under the grey couters and gauntlets — TABS: beige-tan sleeves, about RGB 211,191,160 (ref: medieval.squire.blue.png)
b PASS (355)
c PASS (351)
d PASS (cost 100, hp 1.63x, dmg 1.33x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a sleeve material — blocker 2: find what overwrites the sleeve shells' look (unitFactory's tabard block repaints the arms mail after the dress runs) and give the shells a material that pass skips, or attach them after it; verify with a material readback — ref: medieval.squire.blue.png — ours: unit_medieval.squire_idle.png
## Attempts (iter | gap | criterion | verdict)
352 | longsword slab cut (LONGSWORD) [S] (4285473) | b | approved
353 | two-fisted hilt (TWO_FIST_SWORD) [S] (7f4b61c) | b | approved
355 | crusader great helm (CRUSADER_HELM) [S] (92256f8) | a | approved
356 | tabard: beige cross pattee, hem band (SQUIRE_TABARD) [S] (3122a04 +78cf8cc) | a | approved
357 | lower legs: greaves, knee cops, shoes (SQUIRE_LEGS) [S] (74fa206) | a | approved
358 | arms: sleeve shells, couters, gauntlets (squireArms, SQUIRE_ARMS) [S] (56aed0c) | a | approved
359 | sleeve tone: SQUIRE_ARMS.beige (.74,.6,.4) glow .04 [P] (caa7905, reverted e6c54e8) | a | rejected
## Rejected (last 4)
- sleeve tone [P] [1] — 359: no visible step, sleeves still neutral grey; SQUIRE_ARMS spent
## Notes (max 3 lines)
- Archer's tan shell also rendered grey (359): one shared cause; a material readback in the browser is the first step.
- critic 357: greaves bulky, shoes muted grey-brown (minor). critic 356: cross pale grey rather than beige.
