# tribal.bone_mage
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 360)
 2. antlers in lineup_tribal (idle: the staff rack covers it): a thick many-tined rack, light grey, rising mostly upward about one head out — TABS: wide warm-tan antlers sweeping out nearly sideways about two heads before curling up (ref: tribal.bone_mage.red.png, .png)
 3. skull colour in unit_tribal.bone_mage_idle grey-white — TABS: warm bone-tan (ref: tribal.bone_mage.red.png)
 4. missing in unit_tribal.bone_mage_idle: an orange-brown leaf hanging by each cheek (ref: tribal.bone_mage.red.png, card Appearance)
b FAIL (2 since 360)
 1. staff head in unit_tribal.bone_mage_windup: now a long tapering deer face with a googly eye, but grey, and the rack rises tall and narrow — TABS: a long tapering tan deer skull with a rack branching wide, as large as the head pair (ref: tribal.bone_mage.png)
c PASS (360)
d PASS (cost 300, hp 1.23x, dmg 1.33x, cd 4.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a cheek leaves — blocker 4: an orange-brown leaf hung by each cheek off the mask's strap; colour mask and rack only within this [S] — ref: tribal.bone_mage.red.png — ours: unit_tribal.bone_mage_idle.png
2. [S] b wide tan staff rack — blocker 1: splay the staff rack sideways (beams leaving sideways before curling up) and put cranium and plate in the rack's tan — ref: tribal.bone_mage.png — ours: unit_tribal.bone_mage_windup.png
## Attempts (iter | gap | criterion | verdict)
318-319 | spike leaves, loft | c | approved
320-322 | cape, loincloth, necklace+bracelets | a | approved
361 | deer mask (DEER_MASK) [S] (1edd0db) | a | approved
362 | mask rack (DEER_RACK) [S] (c66c10a) | a | approved
362 | staff rack x1.4 [S] (42d26c9) | b | approved
363 | staff skull: mask plate, googly eyes (STAFF_SKULL) [S] (f270dce) | b | approved
363 | [P] antler tan (326d648, reverted) | a | rejected
## Rejected (last 4)
- antler tan [P] [1] — 363: DEER_RACK.tan — ledger reversal; not visible in lineup
## Notes (max 3 lines)
- addDeerSkull(chin) builds the face plate (mask; staff since 363) and rack (rackScale). Staff root "staff", child "orb". 317: BONE_HOLD.
- DEER_RACK colours only inside an [S] that replaces the mechanism (ledger).
