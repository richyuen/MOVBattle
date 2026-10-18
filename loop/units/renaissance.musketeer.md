# renaissance.musketeer
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 2. no facial hair in unit_renaissance.musketeer_idle — TABS: black moustache and goatee (ref: renaissance.musketeer.blue.png)
 3. body in unit_renaissance.musketeer_idle is a plain team tunic, arms team skin — TABS: team vest over cream blouse sleeves, cream collar, puffy knee breeches, banded stockings (ref: renaissance.musketeer.red.png)
b FAIL (1 since 327)
 2. in unit_renaissance.musketeer_windup the musket is carried upright one-handed — TABS: held two-handed at hip or shoulder, barrel forward (ref: renaissance.musketeer.jpg)
c FAIL (0 since 327)
 1. unit_renaissance.musketeer_release/_flight fire with the gun diagonal across the chest, then vertical — TABS: stock shouldered, barrel level at the target, muzzle smoke (ref: renaissance.musketeer.jpg)
 2. in unit_renaissance.musketeer_struck the knight runs on unmoved — TABS: the 1500-force bullet throws the hit unit (ref: card Weapons)
d PASS (cost 250, hp 1.12x, dmg 2.05x vs 2.44x, cd 5.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b two-handed carry — blocker 2: off hand on the fore-stock, gun at hip or shoulder, barrel forward — ref: renaissance.musketeer.jpg — ours: unit_renaissance.musketeer_windup.png
2. [S] c shouldered level aim — blocker 1: butt to shoulder, barrel level at the target, muzzle smoke — ref: renaissance.musketeer.jpg — ours: unit_renaissance.musketeer_release.png
3. [S] a moustache and goatee — blocker 2 — ref: renaissance.musketeer.blue.png — ours: unit_renaissance.musketeer_idle.png
4. [P] b musket length (fallout of 328 musket [S]) — propBuilder.ts MUSKET long 1.05->1.3, bore 0.034->0.045 — NEXT shot: unit_renaissance.musketeer_idle.png
## Attempts (iter | gap | criterion | verdict)
327 | black iron morion [S] (affc57f) | a | approved
328 | matchlock musket [S] (9951a96 + 418ba56) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 327 defect on the morion: peaks high enough to read cowboy-like from the side, comb lost (MORION.peak, comb).
- MUSKET is shared with wild_west.deadeye.
