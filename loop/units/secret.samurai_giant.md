# secret.samurai_giant
Status: open   Audited: 538 (AUDIT x2), 544 (RE-AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 548, 3 struck)
 2. bare blue forearms in unit_secret.samurai_giant_idle — TABS: flared angular vambraces with gold borders (ref: secret.samurai_giant.blue.png)
 5. gold brow ornament reads as two thin wires in unit_secret.samurai_giant_idle — TABS: broad flat gold crescent with a center disk (ref: secret.samurai_giant.blue.png)
 6. stands less than twice Shogun's body height in lineup_secret_4 — TABS: towering giant around 3x baseline, more than twice the 1.2x Shogun (ref: reference/factions/secret.jpg, card Infobox)
b PASS (547)
c PASS (547)
d PASS (552 stats)
## Ranked gaps
1. [S] secret.samurai_giant.a forearms — blocker 2: flared gold-bordered team vambraces (reuse shogunVambraces) — ref: secret.samurai_giant.blue.png — ours: unit_secret.samurai_giant_idle.png (552 critic and lineup place the bare forearms at the face: the idle shows them now)
2. [S] secret.samurai_giant.a brow ornament — blocker 5: a broad flat gold crescent maedate with a centre disk in samuraiGiantKabuto — ref: secret.samurai_giant.blue.png — ours: unit_secret.samurai_giant_idle.png
3. [S] secret.samurai_giant.a scale — blocker 6: raise the giant's height toward more than 2x the Shogun (a scale or legLength mechanism change, not a nudge) — ref: reference/factions/secret.jpg — ours: lineup_secret_4.png
## Attempts (iter | gap | criterion | verdict)
552 | Shogun's hakama SHOGUN_HAKAMA on him, tunic skirt off (2f25e8fb) | a | approved (struck 3)
552 | banded team shin guards SAMURAI_SUNEATE + Artemis sandals, lowerLegWidth .5 (debe76f4) | a | approved (struck 4)
549 | flared gold-bordered vambraces SAMURAI_KOTE (5ce1d544, 2482989c) | a | dropped (forearms hidden behind the blade in the idle; reverted 3d645e19, 308cb4b0)
548 | fitted gold-laced lamellar cuirass (5b7b006d) | a | approved (struck 1)
543-547 | kabuto KABUTO, broad katana, two-handed grip, Foot Stomp flip and burst, katana ground burst | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 552 critic: hakama hem a little short of the knee; shin guards a touch wide.
- Shares the Shogun's body (a 1.2x man); the KABUTO is gated on this id only.
- 552: idle carry is random per spawn (proceduralAnimation h(92)): the forearms showed at the face this time; check the shot before the vambrace pick.
