# good.righteous_paladin
Status: open   Audited: 481 (AUDIT x2), 486 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (3 since 486, 1 struck)
 1. team-coloured baggy shorts between the chest armour and the thigh plates in lineup_good (paladin, centre, between the Celestial Aegis and the elephant's front leg) and unit_good.righteous_paladin_idle (below the belt): ours runs white plate from just under a thin red waist band down to the feet — TABS: a large team-coloured block of puffed shorts from the waist to mid-thigh, sitting above the gold-topped thigh plates (ref: reference/units/good.righteous_paladin.red.png, card Appearance "pants ... baggy and puffs out").
b PASS (483 round emblem shield; CONFIRM 486)
c PASS (485 summoned shockwave hammer; CONFIRM 486)
d PASS (488 stats)
## Ranked gaps
1. [S] good.righteous_paladin.a puffed team shorts — blocker 1: a team bloused-shorts hull 1.5P wide from the waist to .5T, proud of the thigh-plate tops (goodDress.paladinLegArmour) — ref: reference/units/good.righteous_paladin.red.png — ours: unit_good.righteous_paladin_idle.png
## Attempts (iter | gap | criterion | verdict)
488 | square parted stance (57449aa1) | a | approved (struck 2)
488 | shield carried at the chest (dba0cb7a) | a | dropped (look: shield unchanged; reverted bf730ed5)
487 | forward knee cops with gold V (2b127af7) | a | approved (no strike)
487 | bloused team shorts (6c3892a7) | a | approved (no strike)
486 | upright build (2b940c2b), split cuirass (86c5d31f), leg plates (3287a3d9) | a | approved (struck 1, 3)
485 | summoned hammer (4da0b53d,d1c4d6d0) | c | approved (struck 1; c PASS)
482-484 | hammer, emblem shield, parted grey hair | a,b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Shield (kite board, posePreset monarch) covers waist to mid-thigh in idle; the carry board pose (_buildCarry board) did not move it: the idle board is placed elsewhere - probe before trying the shield again.
- 488 stance: square with PALADIN_SPLAY .15 (proceduralAnimation p.spread); the legs part, cops read on both.
- 491: no evidence commit: in lineup_good (shield off to the side) the shorts still do not read under the cuirass, so a re-aimed idle would not help; gap 1 (2 attempts) needs a new mechanism from a critic.
