# ancient.sarissa
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (8 since 378)
 2. collar in unit_ancient.sarissa_idle: the two chest folds now slant broadly down off the left shoulder, but read as two stacked grey-blue boxes, lighter and greyer than the dark cape, stepped edges, not joined to the shoulder bulk — TABS: one continuous fold in the cape's own colour wrapping the shoulder and down onto the chest (ref: .red.png, .png)
b PASS (379)
c PASS (380)
d PASS (cost 120, hp 0.49x, dmg 0.16x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a collar — blocker 2: replace the two boxes with one bent chunk from the shoulder bulk round onto the chest, in the cape material (SARISSA_FOLD; no further [P] on this row) — ref: .red.png — ours: unit_ancient.sarissa_idle.png
## Attempts (iter | gap | criterion | verdict)
379-380 | pike levelled (PIKE_LEVEL) [S]; backs up (SARISSA_KEEP) [S] | b,c | approved (c PASS)
381-384 | Corinthian helm; crest bands; dark team cape + collar (SARISSA_CAPE); belt, dagger, bracers (SARISSA_KIT) [S]; cape shade [P] | a | approved
385-386 | eye slots, brow bars; eyes apart, nose guard (CORINTH_SLOTS) [S] | a | approved (struck a.1)
387 | collar fold: shoulder bulk, two chest drape folds, gold brooch (SARISSA_FOLD) [S] (35cf884) | a | approved (narrowed a.2)
388 | SARISSA_FOLD drapeTall .13 -> .22, drapeTilt .42 -> .6 [P] (485d7e5) | a | approved (narrowed a.2)
## Rejected (last 4)
## Notes (max 3 lines)
- crested_helm (propBuilder CORINTH_*) is the sarissa's only. Kit/cape/fold ancientDress sarissaKit/dressSarissa; probe output/loop/probe_sarissa.mjs (--unit= --pat=).
- 384 minors: right bracer sheathes the pike grip; dagger faint. 386 minor: slots wide squares (TABS narrower almond).
- The unit faces -x in the probe; compare world bboxes along x.
