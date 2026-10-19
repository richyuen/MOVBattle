# medieval.bard
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 355)
 1. below the vest in unit_medieval.bard_idle no tunic skirt, the V panel pale grey-white not team, no toggles show — TABS: team tunic in the V ending in a short team skirt below the vest, two beige toggles at the V's top (ref: medieval.bard.red.png)
 2. legs/feet in unit_medieval.bard_idle bare team to the ground — TABS: cream knee socks, brown shoes with team bows (ref: medieval.bard.blue.png)
b PASS (355)
c PASS (354)
d PASS (cost 60, hp 0.71x, dmg 0.58x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a tunic — blocker 1: short team tunic skirt below the vest (hangSkirt), team V panel, two beige toggles — ref: medieval.bard.red.png — ours: unit_medieval.bard_idle.png
2. [S] a legs — blocker 2: cream knee socks, brown shoes with team bows — ref: medieval.bard.blue.png — ours: unit_medieval.bard_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | banjo: drum pot, fretted neck, headstock, laid across him (BANJO, BANJO_HOLD) [S] (e179db7) | b | approved
353 | Banjo Walk: lure, run off round his man (BANJO_WALK) [S] (68d8302 +53c3633) | c | approved
354 | music notes: orange eighth notes off his head during the walk (MUSIC_NOTE) [S] (a20bb74 +3c65ac0) | c | approved
355 | floppy hat: brown felt, drooping brim, raised crown, team leaf feathers (FLOPPY_HAT) [S] (216bf92) | a | approved
356 | peasant vest: dark shells of torso+yoke, V panel, X lacing, toggles (bardVest, BARD_VEST) [S] (ffdb80c +df7b94b) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 355: hat sits low and tipped forward, brim half-hides the eyes: FLOPPY_HAT.dip/seat fallout. Toggles exist but hide under the banjo neck.
- 356: V panel is team lerped .12 to white, glow .3 (BARD_VEST.tunicPale/tunicGlow): plain team read as dark as the vest.
