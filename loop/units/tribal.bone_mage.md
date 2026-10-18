# tribal.bone_mage
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. shoulders in unit_tribal.bone_mage_idle are bare — TABS: a brown hide cape with pointed edges over the shoulders to the thigh (ref: tribal.bone_mage.blue.png, card Appearance)
 2. loincloth in unit_tribal.bone_mage_idle is a plain dark box — TABS: brown loincloth with rope, a skull at the centre and a bone each side (ref: tribal.bone_mage.red.png)
 3. neck and wrists in unit_tribal.bone_mage_idle are a dark ring and bare — TABS: three bones on a strap and bone bracelets on both wrists (ref: tribal.bone_mage.blue.png, card Appearance)
b PASS (317)
c PASS (319)
d PASS (stats 317: cost 300=300, hp -1%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hide cape — blocker 1: a rigid brown faceted wedge with pointed edges hung from the shoulder joints to the thigh — ref: tribal.bone_mage.blue.png — ours: unit_tribal.bone_mage_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | deer-skull staff (9474ce7) | b | approved
317 | bone spike row (7496412) | c | approved
317 | upright carry (b6bc951) | b | approved
318 | leaves along the spike line (000f0de) | c | approved
318 | [P] spike girth (8b32ce8) | c | approved
319 | spike loft (33e7601) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 staff: root "staff", child "orb", id boneStaff. 317: BONE_HOLD planted carry; visualEffects.spawnBoneSpikeRow at the cast. 318: leaves spawn at boneSpikeRowNear with LEAF_ROW. 319: projectileSystem._loftFromSpikes -> applyBlastLaunch(SPIKE_LOFT up 10, along 2.5) on every man the leaves' splash catches.
- Critic 319 (cosmetic, c passed): the loft is generous (three rig heights above the spikes; TABS a body height or two). 318: leaves are flat diamonds, TABS elongated brown-red leaves; near spikes knee-high, TABS man-height.
- The hat "antler_skull" keeps its own smooth cranium path in buildFittedHat (the protector's SKULL_FACETED is bone_mask only).
