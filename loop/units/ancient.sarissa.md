# ancient.sarissa
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (6 since 378)
 1. eye opening in unit_ancient.sarissa_idle: temples closed and frown brows in, but both eyes sit in one open band; the nose bar starts under the eyes — TABS: the nose guard rises between the eyes to the brow, two narrow slots (ref: .red.png)
 2. cape in _idle: dark, but hangs straight behind — TABS: a folded collar wrapping the left shoulder onto the chest (ref: .png, .red.png)
b PASS (379)
c PASS (380)
d PASS (cost 120, hp 0.49x, dmg 0.16x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a eye slots — blocker 1: extend the nose guard (chelmNose) up between the eyes to the brow bar, splitting the band into two slots (propBuilder CORINTH_SLOTS, crested_helm only) — ref: .red.png — ours: unit_ancient.sarissa_idle.png
2. [S] a cape collar — blocker 2: a folded collar chunk wrapping the left shoulder onto the chest (ancientDress SARISSA_CAPE) — ref: .png — ours: unit_ancient.sarissa_idle.png
## Attempts (iter | gap | criterion | verdict)
379-380 | pike levelled (PIKE_LEVEL) [S]; backs up (SARISSA_KEEP) [S] | b,c | approved (c PASS)
381-383 | Corinthian helm; crest bands; dark team cape + collar (SARISSA_CAPE) [S] | a | approved
384 | big brown belt round the body ring, dagger forward of the cape, bracers (SARISSA_KIT) [S] (b635f94 +5c01360) | a | approved (struck a.3)
384 | cape shade .62 -> .45, glow .12 -> .06 (SARISSA_CAPE) [P] (26d6450) | a | approved (colour cleared)
385 | eye slots: temple plates + slanted brow bars (CORINTH_SLOTS) [S] (fd2a912) | a | approved (blocker 1 narrowed)
## Rejected (last 4)
## Notes (max 3 lines)
- crested_helm (propBuilder CORINTH_HELM + CORINTH_CREST + CORINTH_SLOTS) is the sarissa's only; the hoplite has hoplite_helm. Kit/cape in ancientDress sarissaKit/dressSarissa; probe output/loop/probe_sarissa.mjs (--unit= --pat=).
- 384 minors: right bracer a long box nearly sheathing the pike grip (TABS short chunky cuffs); dagger faint.
- Eyes sit at +-.16 W, ~.36 W across each (bodyBuilder EYE_SPREAD/EYE_OF_FACE): a nose guard between them must stay thin (~.04 W).
