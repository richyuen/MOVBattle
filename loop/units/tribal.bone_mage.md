# tribal.bone_mage
Status: done   Audited: 315   Done: 322
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (322)
b PASS (317)
c PASS (319)
d PASS (stats 317: cost 300=300, hp -1%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
318 | leaves along the spike line (000f0de) | c | approved
319 | spike loft (33e7601) | c | approved
320 | hide cape (f5283a1) | a | approved
321 | ornamented loincloth (3fd478f) | a | approved
322 | bone necklace and bracelets (a79b80b) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 staff: root "staff", child "orb". 317: BONE_HOLD; spawnBoneSpikeRow. 319: _loftFromSpikes -> applyBlastLaunch(SPIKE_LOFT).
- 320: dressTribalCape (unitFactory, HIDE_CAPE). 321: dressTribalLoincloth (tribalDress.ts, LOINCLOTH). Critic 321 (minor): flap hardly separates from the kilt.
- 322: dressTribalNecklace "bones"; dressTribalBracelets (BRACELET, on the elbow joints). Critic 322 (minor): bones swing past the chest's edge in windup.
