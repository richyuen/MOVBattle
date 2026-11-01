# legacy.pike
Status: open   Audited: 457, 462 (RE-AUDIT lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (1 since 457)
 2. torso in unit_legacy.pike_idle, plain team body — TABS: a cream armour vest with a half-circle team emblem (ref: legacy.pike.jpg)
 3. hair in unit_legacy.pike_idle, hidden or none — TABS: brown hair below the hat brim (ref: legacy.pike.jpg)
 4. waist in unit_legacy.pike_idle, none — TABS: a dark belt over baggy team trousers (ref: legacy.pike.jpg)
b PASS (463: an orange pike over 3.5x his height, collar and hooked blade, levelled two-handed; LONG_PIKE + PIKE_LEVEL)
c FAIL (1 since 457)
 2. drop in unit_legacy.pike_flight, the pike is still in hand after the attack — TABS: it loses its pike after one attack and then slaps (ref: card Characteristics)
d PASS (cost 300, hp 0.45x, dmg 1.11x, cd 1.30; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.pike.c drop the pike after the first hit, then slap — blocker 2: detach the shaft on the first landed hit, unarmed slap profile — ref: card Characteristics — ours: _flight
2. [S] legacy.pike.a cream vest — blocker 2: PIKE_VEST cream cuirass with a half-circle team emblem — ref: legacy.pike.jpg — ours: _idle
3. [S] legacy.pike.a hair — blocker 3: brown hair locks below the hat brim — ref: legacy.pike.jpg — ours: _idle
## Attempts (iter | gap | criterion | verdict)
462 | cavalier_hat in place of the great-helm (9708312a) | a | approved (none struck: plume team-coloured)
463 | LONG_PIKE orange pike, collar, hooked blade (55c1c679) | b | approved (struck 1, 2, 3; b PASS)
463 | levelsPike: PIKE_LEVEL two-hand hold and thrust (cf35fc1b) | c | approved (struck 1)
463 | [P] PIKE_PLUME tan plume (87ab1edc) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 462 critic (minor): the brim is narrower than TABS's broad tilted brim (near twice the head width).
- 463 critic (minor): in _idle the pike head is out of frame to the right; it reads in _windup.
