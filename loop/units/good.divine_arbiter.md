# good.divine_arbiter
Status: open   Audited: 481 (AUDIT x2), 487 (CONFIRM: passed b, c, d; failed a), 488 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (1 since 490 [R], 2 struck)
 3. sleeves: slim robe arms in unit_good.divine_arbiter_idle — TABS: large faceted balloon puffs on the upper arms that widen the shoulders past the torso (ref: good.divine_arbiter.blue.png; card Appearance "puffy sleeves")
b PASS (482 gap review; CONFIRM 487, 488)
c PASS (484 five book lights and descending rays; CONFIRM 487, 488)
d PASS (490 stats)
## Ranked gaps
1. [S] good.divine_arbiter.a balloon sleeves — blocker 3: faceted puffs parented to the upper-arm bone, standing past the shoulders (probe the bbox first) — ref: good.divine_arbiter.blue.png — ours: unit_good.divine_arbiter_idle.png
## Attempts (iter | gap | criterion | verdict)
490 | [R] robe rebuild: knee coat, Medici collar, balloon sleeves (c223381e) | a | approved (struck 1, 2)
488 | long-legged upright build (db9eceee) | a | approved (struck 1)
488 | domed mitre, gold band, diamond (05f78f9f) | a | approved (struck 2; a PASS, CONFIRM failed a)
487 | team robe, puffed sleeves, yellow gloves (5822e7c7) | a | approved (struck 4)
487 | split team skirt, grey trousers, bare feet (353aa34c) | a | approved (struck 5)
482-486 | book, collar, mitre, book lights, card-size scale | a,b,c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 490 critic DEFECTS: arbiterSleeveBalloon (in upperArm.parent frame) does not show past the shoulder; legs below the hem ~1/5 height (TABS ~1/3).
- 490 CONFIRM (run early, not applied): also named a bare face (TABS: tan moustache over a team goatee) and a mitre ~2 head heights (TABS ~1).
- Collar is goodDress arbiterPetalCollar (one solid Medici shell, spec at its head); stance hook on the "arbiterMitre" dome (proceduralAnimation).
