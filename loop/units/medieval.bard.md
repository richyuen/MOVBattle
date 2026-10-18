# medieval.bard
Status: open   Audited: 351   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 351)
 1. no clothing over the skin in unit_medieval.bard_idle — TABS: dark peasant vest, laced V, two toggles, over a team tunic ending in a short skirt (ref: medieval.bard.red.png)
 2. bare team legs/feet in unit_medieval.bard_idle — TABS: cream knee socks, brown shoes with team bows (ref: medieval.bard.blue.png)
 3. hat in unit_medieval.bard_idle is a pale flat wide-brim disc with a stick quill — TABS: brown floppy hat, raised crown, broad team leaf feather (ref: medieval.bard.red.png)
b FAIL (1 since 351)
 1. grip in unit_medieval.bard_idle/_windup: both fists high on the neck near the chin, nothing on the pot, neck near-upright — TABS: weapon hand strums on the pot, off hand frets mid-neck, neck ~45 deg to the off shoulder (ref: medieval.bard.png, .red.png)
c PASS (354)
d PASS (cost 60, hp 0.71x, dmg 0.58x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b strum grip — blocker 1: weapon fist on the pot face, off fist mid-neck, neck at ~45 deg (BANJO_HOLD) — ref: medieval.bard.png — ours: unit_medieval.bard_windup.png
2. [S] a floppy hat — blocker 3: brown floppy hat, raised crown, broad team leaf feather — ref: medieval.bard.red.png — ours: unit_medieval.bard_idle.png
3. [S] a vest and tunic — blocker 1: dark laced vest over a team tunic and short skirt — ref: medieval.bard.red.png — ours: unit_medieval.bard_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | banjo: drum pot, fretted neck, headstock, laid across him (BANJO, BANJO_HOLD) [S] (e179db7) | b | approved
353 | Banjo Walk: lure, run off round his man (BANJO_WALK) [S] (68d8302 +53c3633) | c | approved
354 | music notes: orange eighth notes off his head during the walk (MUSIC_NOTE, BANJO_NOTES) [S] (a20bb74 +3c65ac0) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 354 (c PASS): notes thin, small, dim brown-orange (TABS chunky bright orange, about torso size).
- critic 353: the walk reads as running away more than circling. unit_medieval.bard_walk is 1.5 s into the walk.
