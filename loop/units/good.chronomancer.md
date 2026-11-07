# good.chronomancer
Status: open   Audited: 481 (AUDIT x2), 489 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 489; CONFIRM list)
 1. spiked halo ring behind the back in unit_good.chronomancer_idle: a thin pale wire that barely shows at lineup distance (lineup_good_wide, far right white unit) — TABS: a thick, bold gold ring with spikes, wider than the shoulders, the unit's dominant silhouette element (ref: reference/units/good.chronomancer.blue.png, reference/factions/good.jpg far right)
b PASS (482 gap review; CONFIRM 489)
c PASS (486 transformation lights the clock ring; CONFIRM 489)
d PASS (489 stats)
## Ranked gaps
1. [S] good.chronomancer.a bold back ring — blocker 1: a thick gold ring about twice the shoulder width (goodDress chronoBackRing: tube and spikes several times heavier, ring wider) with a tall top spike — ref: reference/units/good.chronomancer.red.png — ours: unit_good.chronomancer_idle.png, lineup_good_wide
## Attempts (iter | gap | criterion | verdict)
489 | upright long-legged slim build (f0e9a4e5) | a | approved (struck 6; CONFIRM failed a)
488 | crop top (a58de409), breeches/belt/boots (aa380788), arm bands (b6a91fc9) | a | approved (struck 3-5)
486 | back clock ring (20a4e925) | a | approved (struck 2)
486 | transformation (1813eeb8,ec63e03e) | c | approved (struck 2; c PASS)
482-485 | wrist gauntlets, clock bolts, gold spiked crown | a,b,c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Dress is goodDress chronoCropTop/chronoBreeches/chronoArmBands; ring chronoBackRing (tube .07W, R 1.25W; sim CHRONO_TRANSFORM moves it).
- 489 critic DEFECTS: legs read as one blocky white column with faint knee bands. Stance hook on chronoCrownBand (proceduralAnimation).
- He shows only in lineup_good_wide, not lineup_good. Visual preset iconic_chronomancer (unitVisuals case), materialPreset secret_ice.
