# tribal.bone_mage
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. shoulders in unit_tribal.bone_mage_idle are bare — TABS: a brown hide cape with pointed edges over the shoulders to the thigh (ref: tribal.bone_mage.blue.png, card Appearance)
 2. loincloth in unit_tribal.bone_mage_idle is a plain dark box — TABS: brown loincloth with rope, a skull at the centre and a bone each side (ref: tribal.bone_mage.red.png)
 3. neck and wrists in unit_tribal.bone_mage_idle are a dark ring and bare — TABS: three bones on a strap and bone bracelets on both wrists (ref: tribal.bone_mage.blue.png, card Appearance)
b FAIL (1 since 315)
 1. (struck 316: deer-skull staff)
 2. staff in unit_tribal.bone_mage_idle is carried level at the hip pointing forward — TABS: the crooked branch held upright beside the body, skull at shoulder height (ref: tribal.bone_mage.red.png)
c FAIL (0 since 315)
 1. no bone spikes rise from the ground between mage and squire in unit_tribal.bone_mage_release or _flight — TABS: a row of pale spikes bursts from the ground, taller toward the target (ref: tribal.bone_mage.png, card Characteristics)
 2. leaf shards in unit_tribal.bone_mage_flight spawn above the mage's head and climb away — TABS: leaves swirl low along the spike line at the target (ref: tribal.bone_mage.png)
 3. squire in unit_tribal.bone_mage_struck walks on untouched — TABS: the spikes send caught units into the air (card Characteristics). Shot re-aimed at the impact frame by the 315 evidence commit.
d PASS (stats 315: cost 300=300, hp 0%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c bone spike row — blocker 1: a row of pale ground spike meshes rising in sequence from mage to target on cast, taller toward the target — ref: tribal.bone_mage.png — ours: unit_tribal.bone_mage_release.png
2. [S] b upright carry — blocker 2: staff held vertical beside the body, butt near the foot, in idle and walk (proceduralAnimation bone_staff carry) — ref: tribal.bone_mage.red.png — ours: unit_tribal.bone_mage_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | deer-skull staff (9474ce7) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 staff: root named "staff", cranium child "orb", id boneStaff (the overhead cast keys on those); BONE_STAFF_LONG 0.62 keeps it in the windup frame.
- Critic: antlers a few short tines vs a shoulder-wide rack (minor).
