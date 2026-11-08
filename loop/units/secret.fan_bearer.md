# secret.fan_bearer
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 500)
 1. hat in unit_secret.fan_bearer_idle — a grey conical witch/straw hat; TABS a bare team head (ref: secret.fan_bearer.red.png)
 2. chest in unit_secret.fan_bearer_idle — a grey chest-plate block; TABS a bare team chest with a darker team sash over the right shoulder (ref: secret.fan_bearer.red.png)
 3. skirt in unit_secret.fan_bearer_idle — dark-blue shorts; TABS a three-piece layered team skirt to mid-thigh (ref: secret.fan_bearer.red.png)
 4. wrists in unit_secret.fan_bearer_idle — none; TABS brown leather wrist guards (ref: secret.fan_bearer.red.png)
b FAIL (1 since 500, 1 struck)
 2. fan held across the waist at hip level in unit_secret.fan_bearer_idle — TABS: pole held two-handed and angled down, fan resting forward on the ground (ref: secret.fan_bearer.red.png) [audit2]
c PASS (503 Fan Blow: a gust cone of white streaks from the fan leaf shoves the man)
d PASS (503 stats)
## Ranked gaps
1. [S] secret.fan_bearer.a bare head — blocker 1: drop the conical hat (visual entry and the manifest hatHint), bare team head — ref: secret.fan_bearer.red.png — ours: unit_secret.fan_bearer_idle.png
2. [S] secret.fan_bearer.b grounded fan — blocker 2: idle grip with the pole angled down, fan leaf resting forward on the ground — ref: secret.fan_bearer.red.png — ours: unit_secret.fan_bearer_idle.png
3. [P] secret.fan_bearer.c streaks (fallout of 59e6b1af) — visualEffects FAN_GUST: taper and splay the streaks (rotation.y spread +-.25 rad), unit_secret.fan_bearer_flight
## Attempts (iter | gap | criterion | verdict)
503 | Fan Blow: gust cone (SS _tryFanBlow, FAN_BLOW reach 10 half .32 push 10) shoves every enemy in it, white streaks and swirls from the fan leaf (FX spawnFanGust) (59e6b1af) | c | approved (struck 1; c PASS)
500 | pole fan, flat team half-oval 1.4 L on a crescent mount, propBuilder GIANT_FAN (halberd variant giant_fan) (69b5ae21) | b | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 500 DEFECTS: idle carries the fan high over the shoulder (b.2). Rig 2.82 m (framed by the fan).
- 503 DEFECTS: the gust's streaks are dead-straight parallel bars (TABS tapering slivers fanning out).
