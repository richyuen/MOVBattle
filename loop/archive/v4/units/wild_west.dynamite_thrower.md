# wild_west.dynamite_thrower
Status: done   Audited: 444, 454 (CONFIRM: passed b, c; failed a), 455 (CONFIRM: passed b, c; failed a), 456 (CONFIRM: passed a)   Done: 456
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (456: peaked team hat lifted off the bead eyes, lighter team bandanna, team shirt and dark sleeves, braid, striped skirt, black boots; DYNAMITE_LOOK [R]; CONFIRM 456)
b PASS (452: upright bundle at the belly in both hands, released for the 1 s throw; DYNAMITE_HOLD + throwWindupCap; CONFIRM 454, 455)
c PASS (444: lit bundle thrown one-handed, blast flash and debris, the knight flung; throw at 1150 ms; CONFIRM 454, 455)
d PASS (cost 100, hp 0.63x, dmg 0.22x, cd 49.5x; 456 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
449 | DYNAMITE_WIRES, PEAK_HAT | a, b | approved
451-452 | DYNAMITE_HOLD + throwWindupCap 1 s (rejected c3d7f4df, resubmit 8326af8e) | b | approved (b PASS)
452-454 | DYNAMITE_SKIRT, DYNAMITE_BOOTS, skirt teamGlow 0, WESTERN_BRAID | a | approved (a PASS 454; CONFIRM failed a)
455 | DYNAMITE_SHIRT team cloth, sleeves to the wrist, sleeveShade .35 (905d3fd4, 9e286699) | a | approved (a PASS; CONFIRM failed a, plateau)
456 | [R] DYNAMITE_LOOK hat lifted .24 H (dynamite_hat), lighter team bandanna (a089b2c5) | a | approved (struck 1, 2; a PASS; CONFIRM passed a; D)
## Rejected (last 4)
- two-handed hold [S] [1] - 451: _holdDynamite held through the fire event, no throw (c regression)
## Notes (max 3 lines)
- Her throw windup was cooldown x .36 (~30 s at cd 49.5x); visualConfig.throwWindupCap 1 caps it (452).
- 456 critic: bead eyes read half-lidded (pupils low) next to the render's round stare - polish.
- 453 critic: the skirt a muted mauve-pink (TABS saturated red), the stripes cream-white (TABS gold) - not blockers.
