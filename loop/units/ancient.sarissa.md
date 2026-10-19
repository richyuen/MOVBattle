# ancient.sarissa
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (9 since 378) [plateau]
 2. collar in unit_ancient.sarissa_idle: one continuous fold from the shoulder bulk across the chest now, but grey-blue and lighter than the dark cape, ending in a leaf point, a separate horizontal bar above it - TABS: one fold in the cape's own colour wrapping the shoulder onto the chest (ref: .red.png, .png)
b PASS (379)
c PASS (380)
d PASS (cost 120, hp 0.49x, dmg 0.16x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a collar colour - blocker 2: the chunk in the cape's own material (SARISSA_CAPE shade), the separate upper bar removed - ref: .red.png - ours: unit_ancient.sarissa_idle.png
2. [P] a collar (fallout of 9c2d24b) - NEXT: [P] SARISSA_CHUNK tip .45 -> .1; the fold's end square, not a leaf point, in unit_ancient.sarissa_idle.png
## Attempts (iter | gap | criterion | verdict)
379-380 | pike levelled (PIKE_LEVEL) [S]; backs up (SARISSA_KEEP) [S] | b,c | approved (c PASS)
381-384 | Corinthian helm; crest bands; dark team cape + collar (SARISSA_CAPE); belt, dagger, bracers (SARISSA_KIT) [S]; cape shade [P] | a | approved
385-386 | eye slots, brow bars; eyes apart, nose guard (CORINTH_SLOTS) [S] | a | approved (struck a.1)
387 | collar fold: shoulder bulk, two chest drape folds, gold brooch (SARISSA_FOLD) [S] (35cf884) | a | approved (narrowed a.2)
388 | SARISSA_FOLD drapeTall .13 -> .22, drapeTilt .42 -> .6 [P] (485d7e5) | a | approved (narrowed a.2)
389 | chest drape one bent chunk (flat closed tube) from the shoulder bulk across the chest (SARISSA_CHUNK) [S] (9c2d24b) | a | approved (narrowed a.2)
## Rejected (last 4)
## Notes (max 3 lines)
- crested_helm (propBuilder CORINTH_*) is the sarissa's only. Kit/cape/fold ancientDress sarissaKit/dressSarissa; probe loop/scripts/probes/probe_sarissa.mjs (--unit= --pat=).
- 384 minors: right bracer sheathes the pike grip; dagger faint. 386 minor: slots wide squares (TABS narrower almond).
- The unit faces -x in the probe; compare world bboxes along x.
