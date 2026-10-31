# spooky.pumpkin_catapult
Status: open   Audited: 434, 441 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 441) (CONFIRM 441 list)
  (struck 3 at 442)
 1. wheel rims in unit_spooky.pumpkin_catapult_idle (and swatch) are a light slate blue — TABS: the wheels are the same near-black wood as the frame, so the machine reads as "predominantly black" (ref: spooky.pumpkin_catapult.red.png, .blue.png, spooky.pumpkin_catapult.jpg, card Appearance)
 2. a large dark cube counterweight sits on top of the right side of the frame in unit_spooky.pumpkin_catapult_idle — TABS: no box. The top is two posts with a crossbar, and the bone-cross arm stands up in front of them (ref: spooky.pumpkin_catapult.red.png)
b PASS (438: bone arm with lashed crossbones, bone crossbars, rib cradle; CONFIRM 441)
c PASS (435: jack-o'-lantern payload bursts into rind and bouncing lanterns; CONFIRM 441)
d PASS (cost 1000, hp 3.77x, dmg 0.85x, cd 5.01x; 442 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a no counterweight - blocker 2: no counterweight box on the spooky build, posts capped by the bone crossbar - ref: spooky.pumpkin_catapult.red.png - ours: unit_spooky.pumpkin_catapult_idle (critic 442)
2. [S] a dark wheels - blocker 1: spooky wheels in PUMPKIN_TIMBER near-black, rims and hub included (off the grey iron) - ref: spooky.pumpkin_catapult.blue.png - ours: unit_spooky.pumpkin_catapult_idle (critic 442)
## Attempts (iter | gap | criterion | verdict)
434-438 | PUMPKIN_SHOT, PUMPKIN_BURST; RIB_CRADLE, BONE_FRAME | b,c | approved (b, c PASS)
438-440 | CATAPULT_BANNER; SKELETON_CREW; operator skull anchor | a | approved (struck 2, 3)
441 | PUMPKIN_TIMBER own near-black cloth timber: frame, arm wood, wheel faces, counterweight (fcb568a7) | a | approved (struck 1; a PASS; CONFIRM failed a)
442 | PUMPKIN_POSTS two upright square posts per rail, collar + cleat, no A-frame (4a2e5f3b) | a | approved (struck 3)
## Rejected (last 4)
## Notes (max 3 lines)
- Cradle/bones/banners/posts: vehicleBuilder buildCatapult spooky branch (RIB_CRADLE, BONE_FRAME, CATAPULT_BANNER, PUMPKIN_TIMBER, PUMPKIN_POSTS); operator spookyDress skeletonCrew. Wheels: CATAPULT_WHEEL tyre + hub use the grey iron.
- wrapAsBody's body source must stay the team axle (LESSONS 14). Every spooky-branch change must stay gated on options.spooky: medieval.catapult is done.
