# good.righteous_paladin
Status: open   Audited: 481 (AUDIT x2), 486 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (2 since 486)
 1. team-coloured baggy shorts between the chest armour and the thigh plates in lineup_good (paladin, centre, between the Celestial Aegis and the elephant's front leg) and unit_good.righteous_paladin_idle (below the belt): ours runs white plate from just under a thin red waist band down to the feet — TABS: a large team-coloured block of puffed shorts from the waist to mid-thigh, sitting above the gold-topped thigh plates (ref: reference/units/good.righteous_paladin.red.png, card Appearance "pants ... baggy and puffs out").
 2. gold-trimmed knee cops in unit_good.righteous_paladin_idle (the lower legs): ours shows the legs as one white column with a single gold swoosh across the thighs and no gold at the knees — TABS: separate knee pieces, each with a gold V-shaped rim, read clearly on both legs (ref: reference/units/good.righteous_paladin.blue.png, reference/factions/good.jpg paladin knees, card Appearance "trimmed with gold on the top of the thigh and knee armor").
b PASS (483 round emblem shield; CONFIRM 486)
c PASS (485 summoned shockwave hammer; CONFIRM 486)
d PASS (487 stats)
## Ranked gaps
1. [S] good.righteous_paladin.a puffed shorts read from the front — blocker 1: widen paladinShortsSeat and paladinShortsUpper so the team puff spreads past both edges of the shield at the hips — ref: reference/units/good.righteous_paladin.red.png — ours: unit_good.righteous_paladin_idle
2. [S] good.righteous_paladin.a parted legs with clear knee cops — blocker 2: a wider leg stance or shin plates narrower than the leg spacing, with each cop proud of the shin plate face — ref: reference/units/good.righteous_paladin.blue.png — ours: unit_good.righteous_paladin_idle
3. [S] good.righteous_paladin.a knee cops lower and clear of the shield — blocker 2: drop each knee cop's gold V and top rim below the shield's lower rim line, with team cloth showing between the thigh gold and the cop — ref: reference/factions/good.jpg — ours: lineup_good
## Attempts (iter | gap | criterion | verdict)
487 | forward knee cops with gold V (2b127af7) | a | approved (no strike)
487 | bloused team shorts (6c3892a7) | a | approved (no strike)
486 | upright long-legged build (2b940c2b) | a | approved (struck 1)
486 | split grey cuirass (86c5d31f) | a | approved (struck 3)
486 | leg plates over team trousers (3287a3d9,5af5b18b) | a | approved (no strike)
485 | summoned hammer (4da0b53d,d1c4d6d0) | c | approved (struck 1; c PASS)
482-484 | hammer, emblem shield, parted grey hair | a,b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- a: 2 approved [S] since the 486 CONFIRM list, none struck; a third unstruck approval makes it plateau.
- 487 CONFIRM (run beside the gap critic) passed a; discarded as he was not would-be-done. Shield covers waist to mid-thigh in idle.
- Hip spacing is (pelvisW - legTop)/2: wider legs close the gap; the plates must stay narrower than the leg spacing.
