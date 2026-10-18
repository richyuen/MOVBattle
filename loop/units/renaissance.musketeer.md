# renaissance.musketeer
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 2. no facial hair in unit_renaissance.musketeer_idle — TABS: black moustache and goatee (ref: renaissance.musketeer.blue.png)
 3. body in unit_renaissance.musketeer_idle is a plain team tunic, arms team skin — TABS: team vest over cream blouse sleeves, cream collar, puffy knee breeches, banded stockings (ref: renaissance.musketeer.red.png)
b PASS (331)
c FAIL (1 since 327)
 2. in unit_renaissance.musketeer_struck the knight runs on unmoved — TABS: the 1500-force bullet throws the hit unit (ref: card Weapons)
d PASS (cost 250, hp 1.12x, dmg 2.05x vs 2.44x, cd 5.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c bullet fling — blocker 2: the musket bullet hit flings the target (stagger plus lift scaled to force 1500) — ref: card Weapons — ours: unit_renaissance.musketeer_struck.png
2. [S] a moustache and goatee — blocker 2 — ref: renaissance.musketeer.blue.png — ours: unit_renaissance.musketeer_idle.png
## Attempts (iter | gap | criterion | verdict)
327 | black iron morion [S] (affc57f) | a | approved
328 | matchlock musket [S] (9951a96 + 418ba56) | b | approved
329 | two-handed carry [S] (f4cff29) | b | approved
331 | shouldered level aim, muzzle smoke [S] (0b9f1b9 + 4992778 + 12c8bc1) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- The shot fires at the start of the attack, often from the march: _aimMusket holds the shouldered aim in every living state (MUSKET_AIM, _armTo); smoke leaves "musketMuzzle" (getSmokeOrigin).
- Critic 331 nit: stock sticks out behind the shoulder, both hands forward on the barrel — TABS butt at the shoulder, fist at the stock's wrist (MUSKET_AIM.ahead).
- MUSKET and _aimMusket are shared with wild_west.deadeye.
