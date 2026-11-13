# secret.ice_giant
Status: open   Audited: 538 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 538, 2 struck)
 2. grey ball helmet with two horns in unit_secret.ice_giant_idle — TABS: bare team head with a snow cap (ref: secret.ice_giant.red.png)
 4. no belt in unit_secret.ice_giant_idle — TABS: team belt with an icicle emblem and brawler shields at the hips (ref: secret.ice_giant.red.png)
 5. no taller than the samurai and tree giants in lineup_secret_4 — TABS: the largest unit of the faction (ref: card Characteristics, secret.jpg far right)
b PASS (543: struck 2)
c FAIL (0 since 538)
 1. missing: ice shockwave where the punch lands; only the target frosts in unit_secret.ice_giant_ability_after (ref: card Characteristics)
 2. missing: Ice Breath freezing cone (ref: card Abilities)
 3. punch in unit_secret.ice_giant_release: a short jab — TABS: long-arm slam (ref: secret.ice_giant.jpg)
d PASS (543 stats)
## Ranked gaps
1. [S] secret.ice_giant.c shockwave — blocker 1: an ice shockwave ring at the punch's landing point (VisualEffects.spawnIceBurst as Ullr's) — ref: card Characteristics — ours: unit_secret.ice_giant_ability_after.png
2. [S] secret.ice_giant.a head — blocker 2: helmet off (propBuilder giant_ice giantCrown/iceHorn), a bare team head with a snow cap — ref: secret.ice_giant.red.png — ours: unit_secret.ice_giant_idle.png
## Attempts (iter | gap | criterion | verdict)
543 | white faceted snow mantle, shoulder caps, V down the chest, team skin (preset default) ICE_SNOW (56dbea5a) | a | approved (struck 3)
543 | [P] ICE_FIST fist 1.75 -> 1.1, swell 1.35 -> 1.2 (26e9bae9) | b | approved (struck 2, b PASS)
542 | huge club fist on each hand ICE_FIST (9cac10ab) | b | approved (struck 1)
541 | ape rig ICE_APE (816231de) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 543 critic: a pale grey belly block shows under the V point above the legs (TABS team skin to the belt).
- ICE_FIST row spent for [P].
