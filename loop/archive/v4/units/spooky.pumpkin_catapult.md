# spooky.pumpkin_catapult
Status: done   Audited: 434, 441 (CONFIRM: passed b, c; failed a), 444 (CONFIRM: passed a, b, c)   Done: 444
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (444: near-black timber frame, posts, wheels and hubs, bone arm and crossbars, team banners, skeleton crew; CONFIRM 444)
b PASS (438: bone arm with lashed crossbones, bone crossbars, rib cradle; CONFIRM 441)
c PASS (435: jack-o'-lantern payload bursts into rind and bouncing lanterns; CONFIRM 441)
d PASS (cost 1000, hp 3.77x, dmg 0.85x, cd 5.01x; 444 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
434-438 | PUMPKIN_SHOT, PUMPKIN_BURST; RIB_CRADLE, BONE_FRAME | b,c | approved (b, c PASS)
438-440 | CATAPULT_BANNER; SKELETON_CREW; operator skull anchor | a | approved (struck 2, 3)
441 | PUMPKIN_TIMBER own near-black cloth timber: frame, arm wood, wheel faces, counterweight (fcb568a7) | a | approved (struck 1; a PASS; CONFIRM failed a)
442 | PUMPKIN_POSTS two upright square posts per rail, collar + cleat, no A-frame (4a2e5f3b) | a | approved (struck 3)
443 | no counterweight box on the spooky build, the bare bone arm (1992ee2c) | a | approved (struck 2)
444 | spooky wheel tyre + hub in PUMPKIN_TIMBER (d50fe07b) | a | approved (struck 1; a PASS; CONFIRM 444)
## Rejected (last 4)
## Notes (max 3 lines)
- Cradle/bones/banners/posts: vehicleBuilder buildCatapult spooky branch (RIB_CRADLE, BONE_FRAME, CATAPULT_BANNER, PUMPKIN_TIMBER, PUMPKIN_POSTS); operator spookyDress skeletonCrew. Wheels: CATAPULT_WHEEL tyre + hub use the grey iron.
- wrapAsBody's body source must stay the team axle (LESSONS 14). Every spooky-branch change must stay gated on options.spooky: medieval.catapult is done.
