# ancient.sarissa
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (7 since 378)
 2. cape in _idle: dark, but hangs straight behind — TABS: a folded collar wrapping the left shoulder onto the chest (ref: .png, .red.png)
b PASS (379)
c PASS (380)
d PASS (cost 120, hp 0.49x, dmg 0.16x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a cape collar — blocker 2: a folded collar chunk wrapping over his left shoulder onto the chest, the cape hanging from it (ancientDress SARISSA_CAPE) — ref: .red.png — ours: unit_ancient.sarissa_idle.png
## Attempts (iter | gap | criterion | verdict)
379-380 | pike levelled (PIKE_LEVEL) [S]; backs up (SARISSA_KEEP) [S] | b,c | approved (c PASS)
381-383 | Corinthian helm; crest bands; dark team cape + collar (SARISSA_CAPE) [S] | a | approved
384 | big brown belt, dagger, bracers (SARISSA_KIT) [S] (b635f94 +5c01360) | a | approved (struck a.3)
384 | cape shade .62 -> .45, glow .12 -> .06 (SARISSA_CAPE) [P] (26d6450) | a | approved (colour cleared)
385 | eye slots: temple plates + slanted brow bars (CORINTH_SLOTS) [S] (fd2a912) | a | approved (blocker 1 narrowed)
386 | eyes apart x1.45, .85 size, proud nose guard (CORINTH_SLOTS) [S] (041521a) | a | approved (struck a.1)
## Rejected (last 4)
## Notes (max 3 lines)
- crested_helm (propBuilder CORINTH_HELM + CORINTH_CREST + CORINTH_SLOTS; eyes moved in attachProps) is the sarissa's only. Kit/cape ancientDress sarissaKit/dressSarissa; probe output/loop/probe_sarissa.mjs (--unit= --pat=).
- 384 minors: right bracer a long box nearly sheathing the pike grip; dagger faint. 386 minor: slots wide squares (TABS narrower almond).
- The unit faces -x in the probe; compare world bboxes of eyes and helm parts along x.
