# viking.brawler
Status: done   Audited: 391, 395-398, 401, 402, 413, 418 (CONFIRM)   Done: 418
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (413 re-audit; CONFIRM 413, 418)
b PASS (415; CONFIRM 418)
c PASS (418: lunge on first contact, 3c3337d0; CONFIRM 418)
d PASS (cost 220, hp 2.39x, dmg 1.08x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
392-393 | bearded axe with a crescent head; own round board [S] | b | approved (b PASS)
394-408 | helm; beard cuts (395, 401, 402 rejected; [R] 407 BRAWLER_BEARD approved; 408 tail dropped: tray board hides it) | a | mixed
413 | evidence 922ff0f: idle camera level with the chest; re-audit struck a.4 (a PASS) | a | evidence; CONFIRM 413 failed b, c
414 | BRAWLER_HATCHET: bearded axe at .6, dark iron (cf3af41) | b | approved (struck 2; haft still 1.5x)
415 | NORSE_BOARD + _restNorseBoard: board plumb before him (b8bdfcee); [P] BRAWLER_HATCHET.haft .67 (2d2156d4) | b | approved (struck 3, 1; b PASS)
418 | FIRST_LUNGE (3c3337d0; evidence ff56094b: starts 5.5 m out) | c | approved (c PASS); CONFIRM 418 passed - done
## Rejected (last 4)
- beard [S] [3] - 395/401/402: under the mask, a second bib, a sideways splay - all read wrong; the chest under the tray board never showed
## Notes (max 3 lines)
- 418 CONFIRM (minor): shield boss light grey (render brown); a brown strap across the shield face; judged on _idle (no viking lineup).
- 418 critic: the first hit lands 1.1 s after the lunge; the axe hides behind the board through it.
