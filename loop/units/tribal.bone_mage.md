# tribal.bone_mage
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 360; 1 [S] rejected)
 2. antlers in lineup_tribal (idle: the staff rack covers it): a many-tined rack in light grey, rising at about 50 degrees and about one head out — TABS: wide warm-tan antlers sweeping out nearly sideways about two heads before curling up, darker than the skull (ref: tribal.bone_mage.red.png, .png)
b PASS (364)
c PASS (360)
d PASS (cost 300, hp 1.23x, dmg 1.33x, cd 4.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a antlers — blocker 2: worn beams near-level for about two skull widths (first two pieces bend about 1.55 and 1.45) before curling up, in their own darker tan antler material (about .58,.42,.26, low glow) distinct from the skull (addDeerSkull worn rack) — ref: tribal.bone_mage.red.png — ours: lineup_tribal.png
## Attempts (iter | gap | criterion | verdict)
318-322 | spike leaves, loft; cape, loincloth, necklace+bracelets | a,c | approved
361 | deer mask (DEER_MASK) [S] (1edd0db) | a | approved
362 | mask rack (DEER_RACK) [S] (c66c10a); staff rack x1.4 [S] (42d26c9) | a,b | approved
363 | staff skull: mask plate, googly eyes (STAFF_SKULL) [S] (f270dce) | b | approved
363 | [P] antler tan (326d648, reverted) | a | rejected
364 | cheek leaves + mask tan (MASK_LEAF) [S] (0456062 +23d1047) | a | approved
364 | wide tan staff rack (DEER_RACK.staffBend) [S] (ad6c3d7 +3600f5d) | b | approved
365 | worn rack sweep: maskBend [1.5,1.3,.95,.45], maskLong 1.3, MASK_LEAF.tan [S] (179ef76, reverted) | a | rejected
## Rejected (last 4)
- antler tan [P] [1] — 363: DEER_RACK.tan — ledger reversal; not visible in lineup
- worn rack sweep [S] [1] — 365: curls up after the first piece, about one head out; MASK_LEAF.tan renders pale grey like the skull
## Notes (max 3 lines)
- addDeerSkull(chin) builds face plate + rack; rackScale !== 1 is the staff; the worn mask is chin set and rackScale 1 (propBuilder hat call). Mask leaves/tan (MASK_LEAF) only on the worn mask.
- Rack beams pale grey (DEER_RACK.tan, approved 363): change only inside an [S] that replaces the rack; a light tan renders pale: go darker.
- critic 364 (minor): left leaf reads salmon-pink, leaves small next to the muzzle.
