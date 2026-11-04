# legacy.super_boxer
Status: open   Audited: 468   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)

a PASS (477: lanky upright build)
b FAIL (2 since 468)
 1. gloves in unit_legacy.super_boxer_idle: dull khaki spheres, one slung at the shoulder, a khaki cuff on the other wrist — TABS: two big glowing gold-white gloves on both fists (ref: legacy.super_boxer.red.png)
c FAIL (1 since 468)
 1. missing: Superboxer Punch (dash back, then forward with an explosion); summary records only a melee hit at 1183 ms (card Abilities)
 2. glove trails missing in unit_legacy.super_boxer_release: a plain punch — TABS: glowing white-yellow trails behind the gloves (ref: legacy.super_boxer.jpg)
d PASS (cost 10000=10000, hp 58.99x vs 57.86x (+2%), dmg 2.98x vs 3.00x (-1%), cd 0.11x vs 0.13x (-8%); 477 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.super_boxer.b glove mass — blocker 1: broad padded knuckle mesh, wrist cuff and thumb around each fist-fitted anchor — ref: legacy.super_boxer.red.png — ours: unit_legacy.super_boxer_idle.png
2. [S] legacy.super_boxer.c Superboxer Punch — blocker 1: dash backwards, forwards and explode as a logged ability — ref: card Abilities — ours: unit_legacy.super_boxer_release.png
3. [S] legacy.super_boxer.c glove trails — blocker 2: luminous ribbons following both gloves through strike — ref: legacy.super_boxer.jpg — ours: unit_legacy.super_boxer_release.png
## Attempts (iter | gap | criterion | verdict)
477 | lanky upright build (e09e65d6) | a | approved (struck 1)
477 | luminous fist-fitted mitts (533a1de9) | b | approved
473 | PUNCH_BURST white-gold flash at contact (ca68611a) | c | approved
472 | GLOW_GLOVE glowing gold mitts (d6551dd7, d0d1329f) | b | approved
472 | SUPER_BOXER_EYES yellow eyes (0cd79ea7) | a | approved
472 | [P] SUPER_BOXER_SHORTS.stripe .28 -> .12 (b86b479d) | a | approved
471 | bare chest: team-skin trunk, no pads or belt (f1bc0724, 360d7a5a) | a | approved
471 | SUPER_BOXER_SHORTS white shorts, team stripes, gold waistband (6b0b6c96) | a | approved
470 | SUPER_BOXER_HAIR gold spikes, headband (8bcd54e9, shared) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 477: both gloves now centred on fists and glowing; still small balls instead of large padded mitts. b blocker kept verbatim.
