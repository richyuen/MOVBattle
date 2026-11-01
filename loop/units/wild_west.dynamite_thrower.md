# wild_west.dynamite_thrower
Status: open   Audited: 444, 454 (CONFIRM: passed b, c; failed a), 455 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 455; CONFIRM list) plateau (CONFIRM failed a twice: 454, 455)
 1. hat brim seated down over the eyes (face reads blank, no bead eyes under the brim) in unit_wild_west.dynamite_thrower_idle — TABS: conical hat sits above the face, two big bead eyes clearly visible under the brim (ref: reference/units/wild_west.dynamite_thrower.blue.png; reference/factions/wild_west.jpg leftmost unit)
 2. neck bandanna absent (chest plain shirt colour up to the neck) in unit_wild_west.dynamite_thrower_idle — TABS: a lighter team-colour bandanna triangle over the collar and upper chest (ref: reference/units/wild_west.dynamite_thrower.red.png; card Appearance "a bandanna around its neck")
b PASS (452: upright bundle at the belly in both hands, released for the 1 s throw; DYNAMITE_HOLD + throwWindupCap; CONFIRM 454, 455)
c PASS (444: lit bundle thrown one-handed, blast flash and debris, the knight flung; throw at 1150 ms; CONFIRM 454, 455)
d PASS (cost 100, hp 0.63x, dmg 0.22x, cd 49.5x; 455 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a plateau - one rebuild from both CONFIRM lists (454: team shirt, sleeves - cleared 455; 455: PEAK_HAT seat lifted so the bead eyes show under the brim, a lighter team bandanna triangle over the collar) - ref: blue.png, red.png - ours: unit_wild_west.dynamite_thrower_idle, lineup_wild_west (CONFIRM 455)
## Attempts (iter | gap | criterion | verdict)
449 | DYNAMITE_WIRES, PEAK_HAT | a, b | approved
451-452 | DYNAMITE_HOLD + throwWindupCap 1 s (rejected c3d7f4df, resubmit 8326af8e) | b | approved (b PASS)
452-453 | DYNAMITE_SKIRT, DYNAMITE_BOOTS, skirt teamGlow 0 | a | approved (struck 2, 4)
454 | WESTERN_BRAID on her off side (e92d6925) | a | approved (struck 3; a PASS; CONFIRM failed a)
455 | DYNAMITE_SHIRT team cloth, sleeves to the wrist, sleeveShade .35 (905d3fd4, 9e286699) | a | approved (struck 1, 2; a PASS; CONFIRM failed a)
## Rejected (last 4)
- two-handed hold [S] [1] - 451: _holdDynamite held through the fire event, no throw (c regression)
## Notes (max 3 lines)
- Her throw windup was cooldown x .36 (~30 s at cd 49.5x); visualConfig.throwWindupCap 1 caps it (452).
- 455 critic: in the blue idle the bloom lifts the sleeves near the shirt's blue (below lineup notice).
- 453 critic: the skirt a muted mauve-pink (TABS saturated red), the stripes cream-white (TABS gold) - not blockers.
