# legacy.super_boxer
Status: open   Audited: 468   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (4 since 468)
 1. build in unit_legacy.super_boxer_idle: hunched slab-torsoed bulk on thick legs — TABS: a lanky slim body (ref: legacy.super_boxer.red.png)
b FAIL (1 since 468)
 1. gloves in unit_legacy.super_boxer_idle: dull khaki spheres, one slung at the shoulder, a khaki cuff on the other wrist — TABS: two big glowing gold-white gloves on both fists (ref: legacy.super_boxer.red.png)
c FAIL (0 since 468)
 1. missing: Superboxer Punch (dash back, then forward with an explosion); summary records only a melee hit at 1183 ms (card Abilities)
 2. glove trails missing in unit_legacy.super_boxer_release: a plain punch — TABS: glowing white-yellow trails behind the gloves (ref: legacy.super_boxer.jpg)
 3. hit burst missing in unit_legacy.super_boxer_struck: the knight lies flat with no flash — TABS: a burst of light at contact (ref: legacy.super_boxer.jpg; card weapon explosion radius 1.75)
d PASS (cost 10000=10000, hp 58.99x vs 57.86x (+2%), dmg 2.98x vs 3.00x (-1%), cd 0.11x vs 0.13x (-8%); 468 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.super_boxer.b glove on the fist — blocker 1: centre the glow_glove mitt on the hand joint, hand hidden inside — ref: legacy.super_boxer.red.png — ours: unit_legacy.super_boxer_windup.png
2. [S] legacy.super_boxer.c Superboxer Punch — blocker 1: dash back, then forward with an explosion — ref: card Abilities, legacy.super_boxer.jpg — ours: unit_legacy.super_boxer_release.png
## Attempts (iter | gap | criterion | verdict)
472 | GLOW_GLOVE glowing gold mitts (d6551dd7, d0d1329f) | b | approved (none struck; not on the fists)
472 | SUPER_BOXER_EYES yellow eyes (0cd79ea7) | a | approved (struck 6)
472 | [P] SUPER_BOXER_SHORTS.stripe .28 -> .12 (b86b479d) | a | approved
471 | bare chest: team-skin trunk, no pads or belt (f1bc0724, 360d7a5a) | a | approved (struck 2)
471 | SUPER_BOXER_SHORTS white shorts, team stripes, gold waistband (6b0b6c96) | a | approved (struck 4)
470 | SUPER_BOXER_HAIR gold spikes, headband (8bcd54e9, shared) | a | approved (struck 3; 5 by the lineup test)
## Rejected (last 4)
## Notes (max 3 lines)
- ref legacy.super_boxer.red.png: slim shirtless body, gold spikes, white shorts, glowing gloves; ours unit_legacy.super_boxer_idle: bulky navy armour, bare head, khaki gloves
- ref legacy.super_boxer.jpg: glove trails and light shards around a lunging punch; ours unit_legacy.super_boxer_release: an ordinary grapple-punch with no glow
