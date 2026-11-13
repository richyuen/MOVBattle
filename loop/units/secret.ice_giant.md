# secret.ice_giant
Status: open   Audited: 538 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 538, 1 struck)
 2. grey ball helmet with two horns in unit_secret.ice_giant_idle — TABS: bare team head with a snow cap (ref: secret.ice_giant.red.png)
 3. uniform pale grey-blue, no snow, in unit_secret.ice_giant_idle — TABS: white snow mantle over the chest and shoulders on team skin (ref: secret.ice_giant.red.png)
 4. no belt in unit_secret.ice_giant_idle — TABS: team belt with an icicle emblem and brawler shields at the hips (ref: secret.ice_giant.red.png)
 5. no taller than the samurai and tree giants in lineup_secret_4 — TABS: the largest unit of the faction (ref: card Characteristics, secret.jpg far right)
b FAIL (1 since 538, 1 struck)
 2. fists in unit_secret.ice_giant_windup, faceted balls wider than the giant's head and about three forearms across — TABS: blunt club ends little thicker than the forearm (ref: secret.ice_giant.red.png, secret.ice_giant.jpg)
c FAIL (0 since 538)
 1. missing: ice shockwave where the punch lands; only the target frosts in unit_secret.ice_giant_ability_after (ref: card Characteristics)
 2. missing: Ice Breath freezing cone (ref: card Abilities)
 3. punch in unit_secret.ice_giant_release: a short jab — TABS: long-arm slam (ref: secret.ice_giant.jpg)
d PASS (542 stats)
## Ranked gaps
1. [S] secret.ice_giant.a snow mantle — blocker 3: white faceted snow chunk over the chest, shoulders and upper arms on team skin — ref: secret.ice_giant.red.png — ours: unit_secret.ice_giant_idle
2. [P] secret.ice_giant.b fist size — blocker 2 (fallout of [S] 9cac10ab): ICE_FIST fist 1.75 -> 1.1, swell 1.35 -> 1.2; shows in unit_secret.ice_giant_windup as a fist about 1.3x the forearm — ref: secret.ice_giant.red.png
3. [S] secret.ice_giant.c shockwave — blocker 1: an ice ring burst where the punch lands (as Ullr's ICE_BURST) — ref: card Characteristics — ours: unit_secret.ice_giant_ability_after
## Attempts (iter | gap | criterion | verdict)
542 | huge club fist on each hand ICE_FIST (9cac10ab) | b | approved (struck 1; added 2: overshoots into mace balls)
541 | ape rig ICE_APE: arm bones 1.5/1.6 long, 1.45/1.7 thick, shoulders 1.12 out, waist .72 (816231de) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 538 audit A passed b (empty fists as the card's punch); audit B failed it on fist size.
- c.1 can reuse VisualEffects.spawnIceBurst (542, Ullr) for the punch shockwave.
