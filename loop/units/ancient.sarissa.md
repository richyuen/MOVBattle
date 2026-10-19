# ancient.sarissa
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 378)
 1. crest in unit_ancient.sarissa_idle: a solid stepped arc, but the eye opening is still a band with a nose bar — TABS: narrow eye slots either side of the nose guard (ref: .red.png, .png)
 2. cape in _idle: dark now, but hangs straight behind — TABS: a folded collar wrapping the left shoulder onto the chest (ref: .png, .red.png)
b PASS (379)
c PASS (380)
d PASS (cost 120, hp 0.49x, dmg 0.16x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a eye slots — blocker 1: two narrow eye slots either side of a nose guard in place of the band (CORINTH_HELM) — ref: .red.png — ours: unit_ancient.sarissa_idle.png
2. [S] a cape collar — blocker 2: a folded collar chunk wrapping the left shoulder onto the chest (ancientDress SARISSA_CAPE) — ref: .png — ours: unit_ancient.sarissa_idle.png
## Attempts (iter | gap | criterion | verdict)
379-380 | pike levelled (PIKE_LEVEL) [S]; backs up (SARISSA_KEEP) [S] | b,c | approved (c PASS)
381-383 | Corinthian helm; crest bands; dark team cape + collar (SARISSA_CAPE) [S] | a | approved
384 | big brown belt round the body ring, dagger forward of the cape, bracers (SARISSA_KIT) [S] (b635f94 +5c01360) | a | approved (struck a.3)
384 | cape shade .62 -> .45, glow .12 -> .06 (SARISSA_CAPE) [P] (26d6450) | a | approved (colour cleared)
## Rejected (last 4)
## Notes (max 3 lines)
- crested_helm (propBuilder, CORINTH_HELM + CORINTH_CREST) is shared with the hoplite. Kit/cape in ancientDress sarissaKit/dressSarissa; probe output/loop/probe_sarissa.mjs (--unit= --pat=).
- 384 minors: right bracer a long box nearly sheathing the pike grip (TABS short chunky cuffs); dagger faint.
- trunkBand on a box trunk finds no vertices in a thin slice and falls back to a big box: size from trunkBand(body,0,1) or the body _belt ring.
