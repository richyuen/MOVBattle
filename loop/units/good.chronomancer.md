# good.chronomancer
Status: open   Audited: 481 (AUDIT x2)   Done: -
## Verdicts
a FAIL (3 since 481, 3 struck 488)
 6. build in unit_good.chronomancer_idle: a short-legged crouched caster — TABS: an upright slender figure with long white lower legs (ref: reference/units/good.chronomancer.red.png).
b PASS (482 gap review)
c PASS (486 transformation lights the clock ring)
d PASS (488 stats)
## Ranked gaps
1. [S] good.chronomancer.a upright build — blocker 6: an upright no-crouch idle stance with straight knees (proceduralAnimation._idlePose, found by chronoCrown), with a longer-shin leg ratio if needed — ref: reference/units/good.chronomancer.red.png — ours: unit_good.chronomancer_idle.png
## Attempts (iter | gap | criterion | verdict)
488 | white crop top over team midriff (a58de409) | a | approved (struck 3)
488 | white breeches, belt, gold-banded boots (aa380788) | a | approved (struck 4)
488 | gold arm bands with winglets (b6a91fc9) | a | approved (struck 5)
486 | back clock ring (20a4e925) | a | approved (struck 2)
486 | transformation (1813eeb8,ec63e03e) | c | approved (struck 2; c PASS)
485 | clock bolts, gold spiked crown | a,c | approved
482 | paired wrist gauntlets (81f139f6) | b | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- Dress is goodDress chronoCropTop/chronoBreeches/chronoArmBands; ring chronoBackRing (sim CHRONO_TRANSFORM moves it).
- 488 critic DEFECTS: neck/armhole trim do not read; no knee blousing, thin boot bands; winglets long thin blades.
- He shows only in lineup_good_wide, not lineup_good. Visual preset iconic_chronomancer (unitVisuals case), materialPreset secret_ice.
