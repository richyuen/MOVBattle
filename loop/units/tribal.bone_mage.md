# tribal.bone_mage
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 315)
 1. (struck 320: hide cape)
 2. loincloth in unit_tribal.bone_mage_idle is a plain dark box — TABS: brown loincloth with rope, a skull at the centre and a bone each side (ref: tribal.bone_mage.red.png)
 3. neck and wrists in unit_tribal.bone_mage_idle are a dark ring and bare — TABS: three bones on a strap and bone bracelets on both wrists (ref: tribal.bone_mage.blue.png, card Appearance)
b PASS (317)
c PASS (319)
d PASS (stats 317: cost 300=300, hp -1%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a ornamented loincloth — blocker 2: a brown flap with a rope belt, a small faceted skull at the centre and a bone each side (shared tribal mechanism) — ref: tribal.bone_mage.red.png — ours: unit_tribal.bone_mage_idle.png
2. [S] a bone necklace and bracelets — blocker 3: three bones on a strap plus bone bands on both wrists — ref: tribal.bone_mage.blue.png — ours: unit_tribal.bone_mage_idle.png
## Attempts (iter | gap | criterion | verdict)
317 | upright carry (b6bc951) | b | approved
318 | leaves along the spike line (000f0de) | c | approved
318 | [P] spike girth (8b32ce8) | c | approved
319 | spike loft (33e7601) | c | approved
320 | hide cape (f5283a1) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 staff: root "staff", child "orb". 317: BONE_HOLD; spawnBoneSpikeRow at the cast. 319: _loftFromSpikes -> applyBlastLaunch(SPIKE_LOFT).
- 320: dressTribalCape (unitFactory, HIDE_CAPE, TRIBAL_CAPE_UNITS): jittered flat icosphere slab on the back + hem points + shoulder flaps. Critic 320 (minor): reads dark grey-brown in the shade and thin in profile.
- The loincloth is the pelvis box (bodyMaterial = LOINCLOTH_COLOR) plus hangSkirt "hideKilt"; the neck ring is furCollar (both unitFactory, bareSkinned).
