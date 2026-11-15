# tribal.bone_mage
Status: done   Audited: 360   Done: 366
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (366)
b PASS (364)
c PASS (360)
d PASS (cost 300, hp 1.23x, dmg 1.33x, cd 4.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
318-322 | spike leaves, loft; cape, loincloth, necklace+bracelets | a,c | approved
361-362 | deer mask (DEER_MASK) [S]; mask rack (DEER_RACK) [S]; staff rack x1.4 [S] | a,b | approved
363 | staff skull (STAFF_SKULL) [S] approved; [P] antler tan (326d648, reverted) rejected | a,b | -
364 | cheek leaves + mask tan (MASK_LEAF) [S]; wide tan staff rack (DEER_RACK.staffBend) [S] | a,b | approved
365 | worn rack sweep: maskBend, maskLong 1.3, MASK_LEAF.tan [S] (179ef76, reverted) | a | rejected
366 | worn rack swept wide: wornBend near-level, 1.4x, bare first joint, own matte tan (DEER_RACK.worn*) [S] (1c62590 +8d1905d) | a | approved
## Rejected (last 4)
- antler tan [P] [1] — 363: DEER_RACK.tan — ledger reversal; not visible in lineup
- worn rack sweep [S] [1] — 365: curls up after the first piece, about one head out; MASK_LEAF.tan renders pale grey like the skull
## Notes (max 3 lines)
- addDeerSkull(chin) builds face plate + rack; rackScale !== 1 is the staff; the worn mask is chin set and rackScale 1 (`worn`, DEER_RACK.worn*).
- critic 366 (minor): worn rack has fewer tines than TABS, beams a little thin. critic 364 (minor): left leaf reads salmon-pink.
