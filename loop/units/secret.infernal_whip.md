# secret.infernal_whip
Status: open   Audited: 515 (AUDIT x2), 518 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a FAIL (0 since 518)
 1. shirt colour in unit_secret.infernal_whip_idle — TABS: team-coloured shirt; ours is pale lilac (ref: secret.infernal_whip.blue.png)
 2. darker team sleeves in unit_secret.infernal_whip_idle — TABS: dark team sleeves; ours has bare light team arms (ref: secret.infernal_whip.red.png)
 3. glowing magma armbands in unit_secret.infernal_whip_idle — TABS: orange-glow cracked bands on the arms and shoulders; ours has none (ref: secret.infernal_whip.blue.png)
 4. trouser colour in unit_secret.infernal_whip_idle — TABS: dark team trousers and boots; ours has pale lilac legs (ref: secret.infernal_whip.blue.png)
b FAIL (0 since 518)
 1. whip in unit_secret.infernal_whip_idle — TABS: long segmented chain whip, about a body length, ending in a blade tip; ours is a short rigid dark stick with a few loose links behind (ref: secret.infernal_whip.red.png)
 2. off-hand whip in unit_secret.infernal_whip_idle — TABS: a second whip in the left hand; ours has an empty off hand (ref: secret.infernal_whip.blue.png)
 3. ember glow along the whips in unit_secret.infernal_whip_windup — TABS: glowing links and sparks; ours has none (ref: secret.infernal_whip.red.png)
c FAIL (0 since 515)
 1. whip lash in unit_secret.infernal_whip_release/_flight — TABS: the whip extends to the target, range 10; ours throws a dark dart from the hand (ref: card Weapons)
 2. fire on the target in unit_secret.infernal_whip_struck — TABS: target set alight; ours has the knight unburnt, though summary logs status:fire (ref: card Characteristics)
 3. tip explosion in unit_secret.infernal_whip_flight — TABS: 1.25 radius explosion where the whip lands; ours has none (ref: card Weapons)
d PASS (518 stats)
## Ranked gaps
1. [S] secret.infernal_whip.b chain whip — blocker 1: a body-length chain of dark links laid out from the main hand ending in a dark blade tip (propBuilder) — ref: reference/units/secret.infernal_whip.red.png — ours: unit_secret.infernal_whip_idle.png
2. [S] secret.infernal_whip.a team shirt — blocker 1: team-coloured shirt cloth replacing the pale lilac body tint (secretDress / visual entry) — ref: reference/units/secret.infernal_whip.blue.png — ours: unit_secret.infernal_whip_idle.png
3. [S] secret.infernal_whip.a magma armbands — blocker 3: near-black cracked bands with unlit orange cracks on arms and shoulders — ref: reference/units/secret.infernal_whip.blue.png — ours: unit_secret.infernal_whip_idle.png
## Attempts (iter | gap | criterion | verdict)
517 | spiky igneous rock hair with magma cracks, hood off, secretDress infernalRockHair (78eabf45) | a | approved (struck 1; 5, 6 struck by lineup: hidden behind the Cupid)
## Rejected (last 4)
## Notes (max 3 lines)
- 517 DEFECTS: the magma cracks float on the forehead skin under the spikes (the cap sits back); TABS cracks in the rock over the crown.
- 518 RE-AUDIT: a.4 trouser colour new (pale lilac legs); the secret_demon materialPreset tints shirt and legs.
