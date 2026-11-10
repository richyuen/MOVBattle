# secret.fan_bearer
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 500, 1 struck)
 2. chest in unit_secret.fan_bearer_idle — a grey chest-plate block; TABS a bare team chest with a darker team sash over the right shoulder (ref: secret.fan_bearer.red.png)
 3. skirt in unit_secret.fan_bearer_idle — dark-blue shorts; TABS a three-piece layered team skirt to mid-thigh (ref: secret.fan_bearer.red.png)
 4. wrists in unit_secret.fan_bearer_idle — none; TABS brown leather wrist guards (ref: secret.fan_bearer.red.png)
b FAIL (2 since 500, 1 struck)
 2. fan held across the waist at hip level in unit_secret.fan_bearer_idle — TABS: pole held two-handed and angled down, fan resting forward on the ground (ref: secret.fan_bearer.red.png) [audit2]
c PASS (503 Fan Blow: a gust cone of white streaks from the fan leaf shoves the man)
d PASS (509 stats)
## Ranked gaps
1. [S] secret.fan_bearer.a layered skirt — blocker 3: add three overlapping team-cloth panels hanging to mid-thigh — ref: reference/units/secret.fan_bearer.red.png — ours: unit_secret.fan_bearer_idle.png
2. [S] secret.fan_bearer.a wrist guards — blocker 4: add brown leather forearm shells with cuff edges — ref: reference/units/secret.fan_bearer.red.png — ours: unit_secret.fan_bearer_idle.png
3. [S] secret.fan_bearer.b off-hand grip — blocker 2: seat the far fist on the already-lowered shaft — ref: reference/units/secret.fan_bearer.red.png — ours: unit_secret.fan_bearer_idle.png
4. [P] secret.fan_bearer.a sash direction — blocker 2: mirror fanBearerSash's endpoints and bridge across local X, toward screen-left shoulder in idle — fallout of de9ad3b0; ref: secret.fan_bearer.red.png — ours: unit_secret.fan_bearer_idle.png
## Attempts (iter | gap | criterion | verdict)
509 | bare chest and diagonal team sash (de9ad3b0) | a | approved [S] (no strike: opposite shoulder)
506 | two-handed fan carry angled toward the ground (83f17efd, c2e1505e) | b | approved
504 | bare head in place of the conical hat (fa2c8ad9) | a | approved (struck 1)
503 | Fan Blow: gust cone (SS _tryFanBlow, FAN_BLOW reach 10 half .32 push 10) shoves every enemy in it, white streaks and swirls from the fan leaf (FX spawnFanGust) (59e6b1af) | c | approved (struck 1; c PASS)
500 | pole fan, flat team half-oval 1.4 L on a crescent mount, propBuilder GIANT_FAN (halberd variant giant_fan) (69b5ae21) | b | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 509 DEFECTS: bare chest improved; sash crosses the opposite shoulder. Critic permits one X-coordinate mirror as root-blocker [P], fallout of de9ad3b0.
- 506 DEFECTS: downward carry and near fist read. Far fist floats off the shaft at rest.
