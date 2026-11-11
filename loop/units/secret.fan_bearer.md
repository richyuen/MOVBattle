# secret.fan_bearer
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (3 since 500, 3 struck)
 4. wrists in unit_secret.fan_bearer_idle — none; TABS brown leather wrist guards (ref: secret.fan_bearer.red.png)
b FAIL (2 since 500, 1 struck)
 2. fan held across the waist at hip level in unit_secret.fan_bearer_idle — TABS: pole held two-handed and angled down, fan resting forward on the ground (ref: secret.fan_bearer.red.png) [audit2]
c PASS (503 Fan Blow: a gust cone of white streaks from the fan leaf shoves the man)
d PASS (513 stats)
## Ranked gaps
1. [S] secret.fan_bearer.a wrists — blocker 4: brown leather wrist-guard cuffs on both forearms (8-sided cuffs at each forearm's wrist end, secretDress) — ref: reference/units/secret.fan_bearer.red.png — ours: unit_secret.fan_bearer_idle.png
2. [S] secret.fan_bearer.b grip — blocker 2: carry the shaft ahead of the hips (it now runs through the pelvis), both fists visibly on it, angled down, fan forward on the ground — ref: reference/units/secret.fan_bearer.red.png — ours: unit_secret.fan_bearer_idle.png
## Attempts (iter | gap | criterion | verdict)
513 | three-piece layered team skirt to mid-thigh on the pelvis, thighs skin, no generic tunic skirt, secretDress fanBearerSkirt (75907159) | a | approved (struck 3)
511 | sash mirrored to the right shoulder (a7fed8e1) | a | approved [P] (struck 2)
511 | off fist clamped inboard of the shaft end (e64bd0b8, reverted f553726d) | b | dropped: shaft butt runs through the pelvis so the grip is hidden
509 | bare chest and diagonal team sash (de9ad3b0) | a | approved [S] (no strike: opposite shoulder)
506 | two-handed fan carry angled toward the ground (83f17efd, c2e1505e) | b | approved
503-504 | Fan Blow gust cone; bare head | a, c | approved
500 | pole fan GIANT_FAN (69b5ae21) | b | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 511 probe: at idle the far fist is 4 cm off the shaft line; the shaft passes inside the hip box, so b.2 needs the carry moved forward, not a grip clamp.
- 513 DEFECTS: shins below the skirt are dark team; TABS bare team legs to dark sandals.
