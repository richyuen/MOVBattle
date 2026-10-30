# viking.brawler
Status: open   Audited: 391, 395-398, 401, 402, 413 (re-audit a, CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (413 re-audit: struck 4; CONFIRM 413)
b PASS (415: struck 3 by b8bdfcee, 1 by 2d2156d4)
c FAIL (0 since 413; the CONFIRM's list)
 1. missing: lunge on first contact - summary.json records only "melee hit at 1283 ms", no leap or lunge event; unit_viking.brawler_windup shows an ordinary stride - TABS: "They also lunge on first contact" (ref: card Characteristics)
d PASS (cost 220, hp 2.39x, dmg 1.08x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c lunge - blocker 1: evidence first (start the brawler scene farther out, log the lunge in abilityLog), then a one-shot forward lunge when he first closes to melee - ref: card Characteristics - ours: unit_viking.brawler_windup.png
## Attempts (iter | gap | criterion | verdict)
392-393 | bearded axe with a crescent head; own round board [S] | b | approved (b PASS)
394-408 | helm; beard cuts (395, 401, 402 rejected; [R] 407 BRAWLER_BEARD approved; 408 tail dropped: tray board hides it) | a | mixed
413 | evidence 922ff0f: idle camera level with the chest; re-audit struck a.4 (a PASS) | a | evidence; CONFIRM 413 failed b, c
414 | BRAWLER_HATCHET: bearded axe at .6, dark iron (cf3af41) | b | approved (struck 2; haft still 1.5x)
415 | NORSE_BOARD + _restNorseBoard: board plumb before him (b8bdfcee); [P] BRAWLER_HATCHET.haft .67 (2d2156d4) | b | approved (struck 3, 1; b PASS)
## Rejected (last 4)
- beard [S] [3] - 395/401/402: under the mask, a second bib, a sideways splay - all read wrong; the chest under the tray board never showed
## Notes (max 3 lines)
- 413: a 408-style beard tail was retried after the evidence commit and dropped uncommitted: the tray board still hides the belly.
- 407 probe_axes: in the idle the board lies as a tray, face normal (0,.97,.23) in the torso frame, centre .1 under the chin; the torso front is at z .11.
- 413 CONFIRM: the axe is the shared bearded_axe at man length; b.3 is the same tray board that hid the beard.
