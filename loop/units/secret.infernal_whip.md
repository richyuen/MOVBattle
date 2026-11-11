# secret.infernal_whip
Status: open   Audited: 515 (AUDIT x2), 518 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a FAIL (0 since 518)
 1. shirt colour in unit_secret.infernal_whip_idle — TABS: team-coloured shirt; ours is pale lilac (ref: secret.infernal_whip.blue.png)
 2. darker team sleeves in unit_secret.infernal_whip_idle — TABS: dark team sleeves; ours has bare light team arms (ref: secret.infernal_whip.red.png)
 3. glowing magma armbands in unit_secret.infernal_whip_idle — TABS: orange-glow cracked bands on the arms and shoulders; ours has none (ref: secret.infernal_whip.blue.png)
 4. trouser colour in unit_secret.infernal_whip_idle — TABS: dark team trousers and boots; ours has pale lilac legs (ref: secret.infernal_whip.blue.png)
b FAIL (1 since 518, 1 struck)
 2. off-hand whip in unit_secret.infernal_whip_idle — TABS: a second whip in the left hand; ours has an empty off hand (ref: secret.infernal_whip.blue.png)
 3. ember glow along the whips in unit_secret.infernal_whip_windup — TABS: glowing links and sparks; ours has none (ref: secret.infernal_whip.red.png)
c FAIL (1 since 515, 1 struck)
 2. fire on the target in unit_secret.infernal_whip_struck — TABS: target set alight; ours has the knight unburnt, though summary logs status:fire (ref: card Characteristics)
 3. tip explosion in unit_secret.infernal_whip_flight — TABS: 1.25 radius explosion where the whip lands; ours has none (ref: card Weapons)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.infernal_whip.c fire on target — blocker 2: flame emitter on a burning man for the fire status — ref: card Characteristics — ours: unit_secret.infernal_whip_struck.png
2. [S] secret.infernal_whip.a shirt colour — blocker 1: team shirt over the torso in place of the pale lilac (secretDress) — ref: secret.infernal_whip.blue.png — ours: unit_secret.infernal_whip_idle.png
3. [S] secret.infernal_whip.b off-hand whip — blocker 2: second ChainWhip on the left hand — ref: secret.infernal_whip.blue.png — ours: unit_secret.infernal_whip_idle
## Attempts (iter | gap | criterion | verdict)
520 | the chain lashes out of the fist onto the man and bursts there, no dart, secretDress ChainWhip.lash, simulationSystem WHIP_LASH (64e33a1e) | c | approved (struck 1)
519 | body-length chain whip of dark links with a blade tip, secretDress ChainWhip CHAIN_WHIP, RU _tendChainWhip (8182f4b6) | b | approved (struck 1)
517 | spiky igneous rock hair with magma cracks, hood off, secretDress infernalRockHair (78eabf45) | a | approved (struck 1; 5, 6 struck by lineup)
## Rejected (last 4)
## Notes (max 3 lines)
- 520: c.3's shot (_flight) frames only him, the target out of frame: evidence commit first (re-aim c.3 to _struck); the lash's burst shows there as a white flash.
- 520 DEFECTS: the stretched chain reads as a thin dark rod, no glow (b.3).
- 518 RE-AUDIT: the secret_demon materialPreset tints shirt and legs (a.1, a.4).
