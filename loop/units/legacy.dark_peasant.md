# legacy.dark_peasant
Status: open   Audited: 468   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (2 since 468)
 4. torso in unit_legacy.dark_peasant_idle: pale lavender plate armour — TABS: a laced grey-brown jerkin open over a tattered team undershirt (ref: legacy.dark_peasant.red.png)
 5. legs in unit_legacy.dark_peasant_idle: lavender greaves — TABS: ragged black braies, rolled team hosen and light shoes (ref: legacy.dark_peasant.red.png)
b PASS (473: a sphere of thirty black floating hands; DARK_HANDS)
c FAIL (0 since 468)
 1. missing: the thrown Dark Peasant volley; nothing flies in unit_legacy.dark_peasant_ability/_ability_after (card Weapons Throw Dark Peasant, count 15)
 2. hand grab-blast in unit_legacy.dark_peasant_ability: three spiked horned minions appear instead — TABS: the black hands seize the victim and blast it (card Abilities Dark Peasant Hands)
d PASS (cost 9999999=9999999, hp 17034.57x vs 16531.25x (+3%), dmg 2.76x vs 2.78x (-1%), cd 4.99x vs 5.00x (0%); 468 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.dark_peasant.c thrown volley — blocker 1: hands launched out of the sphere with long streaks, framed to the target — ref: legacy.dark_peasant.jpg — ours: unit_legacy.dark_peasant_ability_after.png
2. [S] legacy.dark_peasant.a jerkin — blocker 4: open laced grey-brown jerkin over a tattered team undershirt — ref: legacy.dark_peasant.red.png — ours: unit_legacy.dark_peasant_idle.png
## Attempts (iter | gap | criterion | verdict)
474 | DARK_PEASANT_HAIR bare head, brown mop (b40f53c2) | a | approved (struck 2; 3 by the lineup test)
474 | DARK_VOLLEY thrown hands (18b8467d, d8702ccb) | c | rejected (reverted)
473 | peasant lanky cut at 1.15x (f74a0207) | a | approved (struck 1)
473 | DARK_HANDS thirty floating black hands (599bbe2e) | b | approved (struck 1; b PASS)
## Rejected (last 4)
volley [S] [1] - 474: fifteen thrown dark hands (18b8467d, d8702ccb) - read as the sphere, no streak, target not framed
## Notes (max 3 lines)
- ref legacy.dark_peasant.red.png: thin peasant in a jerkin inside a cloud of black hands; ours unit_legacy.dark_peasant_idle: a pale armoured brute with a black hood and no hands around him
- ref legacy.dark_peasant.jpg: hands and dark lines lash outward; ours unit_legacy.dark_peasant_ability_after: summoned minions run off and nothing comes from him
