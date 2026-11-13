# secret.bank_robbers
Status: open   Audited: 515 (AUDIT x2), 519 (RE-AUDIT a, b x2), 521, 523 (RE-AUDIT a x2), 524 (RE-AUDIT c x2), 527 (CONFIRM: passed c; failed a, b)   Done: -
## Verdicts
a FAIL (1 since 527, 2 struck)
 2. hip gear missing in unit_secret.bank_robbers_idle: no leather belt or holstered handguns at the waist. TABS: a dark brown belt with a leather holster and handgun on each hip (ref: secret.bank_robbers.blue.png; card Appearance "leather belt that has two handguns in leather pouches").
b FAIL (0 since 527; CONFIRM list)
 1. safe body is pale periwinkle in unit_secret.bank_robbers_idle (pink-magenta in lineup_secret_2). TABS: a deep navy (blue) or dark maroon (red) safe with orange trim (ref: secret.bank_robbers.blue.png, .red.png).
 2. safe door face in unit_secret.bank_robbers_idle shows a small inset door with a tiny knob. TABS: a framed door panel carrying a large orange round dial with a cross handle, plus orange hinge blocks and diamond studs down the side (ref: secret.bank_robbers.blue.png).
 3. carry grip in unit_secret.bank_robbers_idle/_windup: elbows bent with hands at the ears, and the safe floats above the hat brims without touching the hands. TABS: arms locked straight overhead with the mitts pressed under the safe's base (ref: secret.bank_robbers.red.png; secret.bank_robbers.png).
c PASS (526: struck 4, fists after the throw; CONFIRM 527)
d PASS (528 stats)
## Ranked gaps
1. [S] secret.bank_robbers.a gun belt — blocker 2: dark brown belt, a leather holster and handgun grip on each hip (bankRobberBelt) — ref: secret.bank_robbers.blue.png — ours: unit_secret.bank_robbers_idle
2. [S] secret.bank_robbers.b straight-arm carry — blocker 3: straighten the elbows so the fists press the safe's floor overhead (critic 527 NEXT) — ref: secret.bank_robbers.red.png — ours: unit_secret.bank_robbers_idle
3. [S] secret.bank_robbers.b safe door — blocker 2: framed door panel with a big orange dial and cross handle, orange hinge blocks and diamond studs — ref: secret.bank_robbers.blue.png — ours: unit_secret.bank_robbers_idle
## Attempts (iter | gap | criterion | verdict)
528 | magenta bandana over the lower face, point over the chest, ROBBER_BANDANA (84812928) | a | approved (struck 1; 3 by lineup)
527 | legs ROBBER_STANCE, legLength 1.22, safe over .3; BANK_BOOT; BANK_VEST (08766f4b, 0fe341bb, 361f605c, 1838836b) | a | approved (struck 5, 4, 2; CONFIRM failed a, b)
518-526 | vault, overhead carry, hurl, crowns, door, sleeves, fists | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- CONFIRM 527 failed a, b once: a second fail makes that criterion plateau.
- 519: card "the taller one", so a slight height gap is TABS.
