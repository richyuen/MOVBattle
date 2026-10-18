# tribal.bone_mage
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. shoulders in unit_tribal.bone_mage_idle are bare — TABS: a brown hide cape with pointed edges over the shoulders to the thigh (ref: tribal.bone_mage.blue.png, card Appearance)
 2. loincloth in unit_tribal.bone_mage_idle is a plain dark box — TABS: brown loincloth with rope, a skull at the centre and a bone each side (ref: tribal.bone_mage.red.png)
 3. neck and wrists in unit_tribal.bone_mage_idle are a dark ring and bare — TABS: three bones on a strap and bone bracelets on both wrists (ref: tribal.bone_mage.blue.png, card Appearance)
b PASS (317)
c FAIL (2 since 315)
 1. (struck 317: bone spike row)
 2. (struck 318: leaves along the spike line)
 3. squire in unit_tribal.bone_mage_struck stands bent over backward between two spikes, boots on the turf, never lifted — TABS: the spikes send caught units into the air (card Characteristics; ref: tribal.bone_mage.png)
d PASS (stats 317: cost 300=300, hp -1%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c spike loft — blocker 3: the row's hit lofts the caught man (an upward impulse with the knockback, as staggerFromBlow does along the line) so he rises off his feet above the spike tips — ref: tribal.bone_mage.png — ours: unit_tribal.bone_mage_struck.png
2. [S] a hide cape — blocker 1: brown pointed-edge cape chunk over the shoulders to the thigh — ref: tribal.bone_mage.blue.png — ours: unit_tribal.bone_mage_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | deer-skull staff (9474ce7) | b | approved
317 | bone spike row (7496412) | c | approved
317 | upright carry (b6bc951) | b | approved
318 | leaves along the spike line (000f0de) | c | approved
318 | [P] spike girth (8b32ce8) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 staff: root "staff", child "orb", id boneStaff. 317: BONE_HOLD planted carry; visualEffects.spawnBoneSpikeRow at the cast. 318: the leaves spawn at boneSpikeRowNear (exported from visualEffects) with LEAF_ROW lift 0.6, targetLift 0.7, arc 0.03 (ProjectileSpawnOptions.arc override); BONE_SPIKE_GIRTH 0.32+0.22u.
- Critic 318 (minor): leaves are flat diamonds on stalks in purple/red/tan, TABS elongated brown-red leaves; near spikes knee-high cones, TABS man-height from the first; cones smooth and regular, TABS jagged shards.
