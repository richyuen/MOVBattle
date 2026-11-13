# secret.bomb_cannon
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 527, 1 struck)
 2. Barrel in unit_secret.bomb_cannon_idle is a short plain cylinder — TABS: a long grey octagonal barrel with a flared muzzle and a sight ring on top (ref: secret.bomb_cannon.red.png)
 3. Crew headgear in unit_secret.bomb_cannon_idle is a dark kettle helmet and a beret — TABS: team pirate caps/bandanas (ref: secret.bomb_cannon.jpg)
 4. Crew clothing in unit_secret.bomb_cannon_windup is a plain blue shirt — TABS: a striped pirate shirt and a green sash (ref: secret.bomb_cannon.red.png, .jpg)
b FAIL (1 since 527, 1 struck)
 2. Cutlasses in unit_secret.bomb_cannon_idle are held point-down, the basket hilt above the fist and the blade hanging below it, and the raised one in unit_secret.bomb_cannon_windup points down at the loader's head — TABS: the cutlass blade stands up from the fist, the raised one held blade-up overhead (ref: secret.bomb_cannon.jpg)
c PASS (527 AUDIT x2: fused bomb arcs and explodes on the target)
d PASS (529 stats)
## Ranked gaps
1. [S] secret.bomb_cannon.a long barrel — blocker 2: long octagonal grey barrel with a flared muzzle and a sight ring (buildBombCannon; keep the rider seated on it) — ref: secret.bomb_cannon.red.png — ours: unit_secret.bomb_cannon_idle
2. [S] secret.bomb_cannon.b cutlass grip — blocker 2: re-seat the crew cutlass blade-up on the fist (the flip needs the pivot moved to the grip, not a constant) — ref: secret.bomb_cannon.jpg — ours: unit_secret.bomb_cannon_windup
## Attempts (iter | gap | criterion | verdict)
529 | small pirate astride the barrel, cannon crew bandanna and shirt, BOMB_RIDER (addOperator in buildBombCannon) (be2c0fc3) | a | approved (struck 1)
527 | crew cutlasses, the loader's reload raises his (PA _reloadCutlass) (7d5002bd) | b | approved (struck 1; added 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 529 critic: the rider renders washed-out pale blue-grey and his cap is a tight skull cap (TABS team rider, floppy cap).
- 529: the [P] cutlass flip was not taken: a rotation offset turns about the blade's middle, so it needs an [S] re-seat.
