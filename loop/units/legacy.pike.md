# legacy.pike
Status: done   Audited: 457, 462 (RE-AUDIT lineup), 467 (CONFIRM: passed a, b, c, d)   Done: 467
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a PASS (467: plumed cavalier hat, brown hair under the brim, cream vest with a team half-disc, dark belt over baggy team trousers; PIKE_HAIR + PIKE_BELT; CONFIRM 467)
b PASS (463: an orange pike over 3.5x his height, collar and hooked blade, levelled two-handed; LONG_PIKE + PIKE_LEVEL; CONFIRM 467)
c PASS (464: levelled thrust, the pike dropped on the first blow and lying on the turf; PIKE_DROP; CONFIRM 467)
d PASS (cost 300, hp 0.45x, dmg 1.11x, cd 1.30; 467 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
462-463 | cavalier_hat (9708312a); [P] PIKE_PLUME tan (87ab1edc) | a | approved (struck 1)
463 | LONG_PIKE orange pike, collar, hooked blade (55c1c679) | b | approved (struck 1, 2, 3; b PASS)
463-464 | levelsPike PIKE_LEVEL (cf35fc1b); PIKE_DROP (d57603bb, fa8827d7) | c | approved (struck 1, 2; c PASS)
465 | PIKE_VEST cream vest, team half-disc (ab5eacbe, shared) | a | approved (struck 2)
467 | PIKE_BELT belt and baggy trousers; PIKE_HAIR (c676cf71, shared) | a | approved (struck 4, 3; a PASS; CONFIRM passed)
## Rejected (last 4)
## Notes (max 3 lines)
- CONFIRM 467 (minor): shoes dark team (TABS brown); the steel head a narrower point than TABS's broad hooked blade.
- 467 critic (minor): hair duller than TABS's auburn; 465: emblem a dome (TABS a split disc), the vest greyer than tan cream.
