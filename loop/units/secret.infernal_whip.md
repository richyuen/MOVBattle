# secret.infernal_whip
Status: open   Audited: 515 (AUDIT x2), 518 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a FAIL (1 since 518, 1 struck)
 2. darker team sleeves in unit_secret.infernal_whip_idle — TABS: dark team sleeves; ours has bare light team arms (ref: secret.infernal_whip.red.png)
 3. glowing magma armbands in unit_secret.infernal_whip_idle — TABS: orange-glow cracked bands on the arms and shoulders; ours has none (ref: secret.infernal_whip.blue.png)
 4. trouser colour in unit_secret.infernal_whip_idle — TABS: dark team trousers and boots; ours has pale lilac legs (ref: secret.infernal_whip.blue.png)
b FAIL (2 since 518, 2 struck)
 3. ember glow along the whips in unit_secret.infernal_whip_windup — TABS: glowing links and sparks; ours has none (ref: secret.infernal_whip.red.png)
c PASS (523)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.infernal_whip.a darker team sleeves — blocker 2: extend the sleeve cloth along the arm — ref: secret.infernal_whip.red.png — ours: unit_secret.infernal_whip_idle.png
2. [S] secret.infernal_whip.b ember links — blocker 3: stagger bright cracks and sparks along both chains in windup.
## Attempts (iter | gap | criterion | verdict)
523 | expanding flash and sparks at contact (d97f5061) | c | approved (struck 3, c PASS)
523 | second chain on the left hand (2bcec881) | b | approved (struck 2)
522 | ignite the victim on the hit tick (20ef0217) | c | approved (struck 2)
521 | dress the torso in a team-coloured shirt (1985b55a) | a | approved (struck 1)
520 | the chain lashes out of the fist onto the man and bursts there, no dart, secretDress ChainWhip.lash, simulationSystem WHIP_LASH (64e33a1e) | c | approved (struck 1)
519 | body-length chain whip of dark links with a blade tip, secretDress ChainWhip CHAIN_WHIP, RU _tendChainWhip (8182f4b6) | b | approved (struck 1)
517 | spiky igneous rock hair with magma cracks, hood off, secretDress infernalRockHair (78eabf45) | a | approved (struck 1; 5, 6 struck by lineup)
## Rejected (last 4)
## Notes (max 3 lines)
- 521: c.3 now uses _struck at the tick of contact (6afb20f1).
- 520 DEFECTS: the stretched chain reads as a thin dark rod, no glow (b.3).
- 518 RE-AUDIT: the secret_demon materialPreset tints shirt and legs (a.1, a.4).
