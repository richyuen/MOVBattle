# tribal.bone_mage
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 360)
 2. antlers in lineup_tribal (idle: the staff rack covers it): a thick many-tined rack, light grey, rising mostly upward about one head out — TABS: wide warm-tan antlers sweeping out nearly sideways about two heads before curling up (ref: tribal.bone_mage.red.png, .png)
 3. skull colour in unit_tribal.bone_mage_idle grey-white — TABS: warm bone-tan (ref: tribal.bone_mage.red.png)
 4. missing in unit_tribal.bone_mage_idle: an orange-brown leaf hanging by each cheek (ref: tribal.bone_mage.red.png, card Appearance)
b FAIL (1 since 360)
 1. staff head in unit_tribal.bone_mage_windup: a round grey ball with a cone snout under a tall grey rack — TABS: a long tapering tan deer skull with a rack branching wide, as large as the head pair (ref: tribal.bone_mage.png)
c PASS (360)
d PASS (cost 300, hp 1.23x, dmg 1.33x, cd 4.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b staff skull — blocker 1: the mask's long tapered deer-skull mesh (DEER_MASK profile) on the staff in place of the ball and cone — ref: tribal.bone_mage.png — ours: unit_tribal.bone_mage_windup.png
2. [P] a antler tan (fallout of c66c10a) — blocker 2: DEER_RACK.tan (.72,.6,.45) -> (.62,.46,.3), glow .15 -> .22; NEXT shows in lineup_tribal as the rack turning tan
## Attempts (iter | gap | criterion | verdict)
318 | leaves along the spike line (000f0de) | c | approved
319 | spike loft (33e7601) | c | approved
320 | hide cape (f5283a1) | a | approved
321 | ornamented loincloth (3fd478f) | a | approved
322 | bone necklace and bracelets (a79b80b) | a | approved
361 | deer skull worn as a mask (DEER_MASK) [S] (1edd0db + ca5ab06) | a | approved
362 | stag rack on the mask (DEER_RACK) [S] (c66c10a) | a | approved
362 | stag rack on the staff skull (rackScale, DEER_RACK.staff 1.4) [S] (42d26c9) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 362 rack: addDeerSkull `rack` (mask, or staff with rackScale); beams turn upright after the first length (critic: tall, not wide). Old two-length rack code still below it.
- 361 mask: addDeerSkull(chin) face plate; attachProps moves eyes onto it. Staff root "staff", child "orb" (cranium sphere). 317: BONE_HOLD; spawnBoneSpikeRow.
- 320: dressTribalCape (HIDE_CAPE). 321: dressTribalLoincloth (LOINCLOTH). 322: necklace "bones", dressTribalBracelets.
