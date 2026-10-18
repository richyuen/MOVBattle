# tribal.bone_mage
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 315)
 1. (struck 320: hide cape)
 2. (struck 321: ornamented loincloth)
 3. neck and wrists in unit_tribal.bone_mage_idle are a dark ring and bare — TABS: three bones on a strap and bone bracelets on both wrists (ref: tribal.bone_mage.blue.png, card Appearance)
b PASS (317)
c PASS (319)
d PASS (stats 317: cost 300=300, hp -1%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bone necklace and wrist bracelets — blocker 3: the stoner's bones necklace (dressTribalNecklace) plus a ring of short boneStick bones round each lower arm — ref: tribal.bone_mage.blue.png — ours: unit_tribal.bone_mage_idle.png
## Attempts (iter | gap | criterion | verdict)
317 | upright carry (b6bc951) | b | approved
318 | leaves along the spike line (000f0de) | c | approved
318 | [P] spike girth (8b32ce8) | c | approved
319 | spike loft (33e7601) | c | approved
320 | hide cape (f5283a1) | a | approved
321 | ornamented loincloth (3fd478f) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 staff: root "staff", child "orb". 317: BONE_HOLD; spawnBoneSpikeRow. 319: _loftFromSpikes -> applyBlastLaunch(SPIKE_LOFT).
- 320: dressTribalCape (unitFactory, HIDE_CAPE). Critic 320 (minor): dark grey-brown in the shade, thin in profile.
- 321: dressTribalLoincloth (tribalDress.ts, LOINCLOTH; boneSkull, boneStick shared) over the hideKilt. Critic 321 (minor): the flap hardly separates from the dark kilt.
