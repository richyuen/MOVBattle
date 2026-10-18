# renaissance.musketeer
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 327)
 2. no facial hair in unit_renaissance.musketeer_idle — TABS: black moustache and goatee (ref: renaissance.musketeer.blue.png)
 3. blouse sleeves and collar in unit_renaissance.musketeer_idle read pale grey-white, and the vest is not distinguishable from the body below it — TABS: tan-cream sleeves and collar, a team vest ending at the waist over the breeches (ref: renaissance.musketeer.red.png)
b PASS (331)
c PASS (332)
d PASS (cost 250, hp 1.12x, dmg 2.05x vs 2.44x, cd 5.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a facial hair — blocker 2: black curled moustache (reuse tribalDress curledMoustache) plus a goatee wedge under the chin — ref: renaissance.musketeer.blue.png — ours: unit_renaissance.musketeer_idle.png
2. [P] a cream tone (fallout of 335 [S] f5030a9) — blocker 3: MUSKETEER_CREAM (0.84,0.72,0.52) -> (0.8,0.6,0.36), MUSKETEER_GLOW 0.25 -> 0.15 — NEXT shot: unit_renaissance.musketeer_idle.png (sleeves and collar turn tan)
## Attempts (iter | gap | criterion | verdict)
327 | black iron morion [S] (affc57f) | a | approved
328 | matchlock musket [S] (9951a96 + 418ba56) | b | approved
329 | two-handed carry [S] (f4cff29) | b | approved
331 | shouldered level aim, muzzle smoke [S] (0b9f1b9 + 4992778 + 12c8bc1) | c | approved
332 | bullet fling [S] (ac25108) | c | approved
335 | vest, blouse sleeves, collar, puffy breeches, banded stockings [S] (f5030a9) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- _aimMusket holds the shouldered aim (MUSKET_AIM); GUN_FLING (weaponHint musket) is shared with wild_west.deadeye; MUSKET and _aimMusket too.
- The _idle shot sees him from behind: facial hair must stand proud of the cheeks / hang under the chin to read (or re-aim with an evidence commit if the critic says so).
- dressMusketeer (MUSKETEER_DRESS): the vest is a box the trunk's shade; critic 335 wants a visible hem at the waist over the breeches.
