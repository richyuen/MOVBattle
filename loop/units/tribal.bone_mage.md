# tribal.bone_mage
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 360)
 2. antlers in unit_tribal.bone_mage_idle: thin dark sticks, 1-2 tines — TABS: wide many-branched tan antlers, each about two heads out and up (ref: tribal.bone_mage.red.png, .png)
 3. skull colour in unit_tribal.bone_mage_idle grey-white — TABS: warm bone-tan (ref: tribal.bone_mage.red.png)
 4. missing in unit_tribal.bone_mage_idle: an orange-brown leaf hanging by each cheek (ref: tribal.bone_mage.red.png, card Appearance)
b FAIL (0 since 360)
 1. staff head in unit_tribal.bone_mage_windup: small grey skull, one thin tine — TABS: deer skull with a full spread of branching tan antlers, as large as the head pair (ref: tribal.bone_mage.png)
c PASS (360)
d PASS (cost 300, hp 1.23x, dmg 1.33x, cd 4.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a antlers — blocker 2: wide many-branched tan antlers, about two heads out and up — ref: tribal.bone_mage.red.png — ours: unit_tribal.bone_mage_idle.png
2. [S] b staff antlers — blocker 1: branching tan antlers on the staff skull, as large as the head pair — ref: tribal.bone_mage.png — ours: unit_tribal.bone_mage_windup.png
## Attempts (iter | gap | criterion | verdict)
318 | leaves along the spike line (000f0de) | c | approved
319 | spike loft (33e7601) | c | approved
320 | hide cape (f5283a1) | a | approved
321 | ornamented loincloth (3fd478f) | a | approved
322 | bone necklace and bracelets (a79b80b) | a | approved
361 | deer skull worn as a mask (DEER_MASK, eyes onto the plate) [S] (1edd0db + ca5ab06) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 361 mask: addDeerSkull(chin) face plate; attachProps moves body eyes onto it (+ socket rings); staff skull (no chin) keeps its muzzle. Critic 361: reads a flat visor, no long tapering muzzle.
- 316 staff: root "staff", child "orb". 317: BONE_HOLD; spawnBoneSpikeRow. 319: _loftFromSpikes -> applyBlastLaunch(SPIKE_LOFT).
- 320: dressTribalCape (HIDE_CAPE). 321: dressTribalLoincloth (LOINCLOTH). 322: necklace "bones", dressTribalBracelets.
