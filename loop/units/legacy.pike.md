# legacy.pike
Status: open   Audited: 457, 462 (RE-AUDIT lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (2 since 457)
 3. hair in unit_legacy.pike_idle, hidden or none — TABS: brown hair below the hat brim (ref: legacy.pike.jpg)
 4. waist in unit_legacy.pike_idle, none — TABS: a dark belt over baggy team trousers (ref: legacy.pike.jpg)
b PASS (463: an orange pike over 3.5x his height, collar and hooked blade, levelled two-handed; LONG_PIKE + PIKE_LEVEL)
c PASS (464: levelled thrust, the pike dropped on the first blow and lying on the turf; PIKE_DROP)
d PASS (cost 300, hp 0.45x, dmg 1.11x, cd 1.30; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.pike.a belt — blocker 4: dark belt over baggy team trousers — ref: legacy.pike.jpg — ours: _idle
2. [S] legacy.pike.a hair — blocker 3: brown hair locks below the hat brim — ref: legacy.pike.jpg — ours: _idle
## Attempts (iter | gap | criterion | verdict)
462 | cavalier_hat in place of the great-helm (9708312a) | a | approved (none struck: plume team-coloured)
463 | LONG_PIKE orange pike, collar, hooked blade (55c1c679) | b | approved (struck 1, 2, 3; b PASS)
463 | levelsPike: PIKE_LEVEL two-hand hold and thrust (cf35fc1b) | c | approved (struck 1)
463 | [P] PIKE_PLUME tan plume (87ab1edc) | a | approved (struck 1)
464 | PIKE_DROP pike let go on the first blow, disarmToFists (d57603bb; follow-up fa8827d7 falls tipping) | c | approved (struck 2; c PASS)
465 | PIKE_VEST cream vest, team half-disc (ab5eacbe, shared) | a | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 462 critic (minor): the brim is narrower than TABS's broad tilted brim (near twice the head width).
- 464 critic (minor): the slap after the drop shows in no shot (the capture ends on the drop).
- 465 critic (minor): TABS emblem a full disc split team/cream; the vest reads greyer than the jpg's tan cream.
