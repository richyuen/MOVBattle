# tribal.bone_mage
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. shoulders in unit_tribal.bone_mage_idle are bare — TABS: a brown hide cape with pointed edges over the shoulders to the thigh (ref: tribal.bone_mage.blue.png, card Appearance)
 2. loincloth in unit_tribal.bone_mage_idle is a plain dark box — TABS: brown loincloth with rope, a skull at the centre and a bone each side (ref: tribal.bone_mage.red.png)
 3. neck and wrists in unit_tribal.bone_mage_idle are a dark ring and bare — TABS: three bones on a strap and bone bracelets on both wrists (ref: tribal.bone_mage.blue.png, card Appearance)
b PASS (317)
c FAIL (1 since 315)
 1. (struck 317: bone spike row)
 2. leaf shards in unit_tribal.bone_mage_flight spawn above the mage's head at the staff skull and climb away — TABS: leaves swirl low along the spike line at the target (ref: tribal.bone_mage.png)
 3. squire in unit_tribal.bone_mage_struck strides on his feet among the spikes, lurching forward, never lifted — TABS: the spikes send caught units into the air (card Characteristics; ref: tribal.bone_mage.png)
d PASS (stats 317: cost 300=300, hp -1%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c leaves along the spike line — blocker 2: the leaves projectile spawned low at the row's far end swirling at the target, not from the staff head — ref: tribal.bone_mage.png — ours: unit_tribal.bone_mage_flight.png
2. [S] a hide cape — blocker 1: brown pointed-edge cape chunk over the shoulders to the thigh — ref: tribal.bone_mage.blue.png — ours: unit_tribal.bone_mage_idle.png
3. [P] c spike girth — fallout of 7496412 (317): spawnBoneSpikeRow diameterBottom 0.14+0.1u -> 0.32+0.22u (a BONE_SPIKE_GIRTH row); NEXT: shows in unit_tribal.bone_mage_struck (the spikes around the squire) — ref: tribal.bone_mage.png
## Attempts (iter | gap | criterion | verdict)
316 | deer-skull staff (9474ce7) | b | approved
317 | bone spike row (7496412) | c | approved
317 | upright carry (b6bc951) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 staff: root "staff", child "orb", id boneStaff. 317: BONE_HOLD (planted hold, _carryTurn 1 at build); visualEffects.spawnBoneSpikeRow called from _launchPendingThrows at the cast for shape "leaves".
- Critic 317: spikes are needles ([P] above); bone tint renders blue-grey (renderer); blocker 3 needs a launch of men caught by the row.
