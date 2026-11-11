# secret.fan_bearer
Status: open   Audited: 500 (AUDIT x2), 514 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 514 CONFIRM)
 1. skirt in unit_secret.fan_bearer_idle is a pale grey-blue, lighter than the skin, so it vanishes into the body (in lineup_secret it is the same pink as the skin) — TABS: a three-piece skirt in a clearly darker shade of team colour than the skin, with only a light under-layer showing at the hem (ref: secret.fan_bearer.blue.png, secret.fan_bearer.red.png, card Appearance "different shades of team color")
 2. sash in unit_secret.fan_bearer_idle is a thin dark strap from shoulder to hip — TABS: a broad cloth sash in darker team colour wrapped over the right shoulder and across the chest (ref: secret.fan_bearer.red.png, card Appearance "a sash over its right shoulder")
b PASS (514 CONFIRM: two-handed pole angled down, fan forward on the ground, wrist guards)
c PASS (514 CONFIRM: fan sweep with wind streaks knocks the knight over)
d PASS (514 stats)
## Ranked gaps
1. [S] secret.fan_bearer.a skirt shade — blocker 1: the flaps' own darker team cloth (team x .35-.45 self-lit, its own material, check on a --noglow swatch), only the under-layer light at the hem — ref: reference/units/secret.fan_bearer.blue.png — ours: unit_secret.fan_bearer_idle.png
2. [S] secret.fan_bearer.a sash — blocker 2: a broad wrapped darker-team sash (about a third of the chest wide) over the right shoulder and across the chest, replacing the thin strap — ref: reference/units/secret.fan_bearer.red.png — ours: unit_secret.fan_bearer_idle.png
## Attempts (iter | gap | criterion | verdict)
514 | carry ahead of the hips, butt a stub behind the fist (GIANT_FAN.grip .1), off fist forward on the shaft (fanGrip .13-.24) (6eb5edb1) | b | approved (struck 2; b PASS)
514 | leather wrist guards with dark end straps, secretDress fanBearerWristGuards (77e689a3) | a | approved (struck 4; CONFIRM failed a: skirt shade, sash width)
513 | three-piece layered team skirt to mid-thigh, secretDress fanBearerSkirt (75907159) | a | approved (struck 3)
511 | sash mirrored to the right shoulder (a7fed8e1) | a | approved [P] (struck 2)
511 | off fist clamped inboard of the shaft end (e64bd0b8, reverted f553726d) | b | dropped: shaft butt through the pelvis
509 | bare chest and diagonal team sash (de9ad3b0) | a | approved [S] (no strike)
500-506 | pole fan GIANT_FAN, two-handed carry, Fan Blow gust, bare head | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 514 CONFIRM: the skirt reads lighter than the skin in the red lineup too, so it is the cloth, not the blue glow.
- 513 DEFECTS: shins below the skirt are dark team; TABS bare team legs to dark sandals.
