# spooky.pumpkin_catapult
Status: open   Audited: 434, 441 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 441) (CONFIRM 441 list; 441 gap critic had passed a)
 1. wheel rims in unit_spooky.pumpkin_catapult_idle (and swatch) are a light slate blue — TABS: the wheels are the same near-black wood as the frame, so the machine reads as "predominantly black" (ref: spooky.pumpkin_catapult.red.png, .blue.png, spooky.pumpkin_catapult.jpg, card Appearance)
 2. a large dark cube counterweight sits on top of the right side of the frame in unit_spooky.pumpkin_catapult_idle — TABS: no box. The top is two posts with a crossbar, and the bone-cross arm stands up in front of them (ref: spooky.pumpkin_catapult.red.png)
 3. the side frames in unit_spooky.pumpkin_catapult_idle are triangular A-frames — TABS: two tall upright square posts rise from the chassis rails, joined by a crossbeam (ref: spooky.pumpkin_catapult.blue.png, spooky.pumpkin_catapult.jpg)
b PASS (438: bone arm with lashed crossbones, bone crossbars, rib cradle; CONFIRM 441)
c PASS (435: jack-o'-lantern payload bursts into rind and bouncing lanterns; CONFIRM 441)
d PASS (cost 1000, hp 3.77x, dmg 0.85x, cd 5.01x; 441 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a upright posts - blocker 3: buildCatapult spooky branch, two tall square posts per side off the rails joined by a crossbeam in place of the A-frame legs + brace - ref: spooky.pumpkin_catapult.blue.png - ours: unit_spooky.pumpkin_catapult_idle (CONFIRM 441)
2. [S] a no counterweight - blocker 2: remove the spooky cw cube (TABS none) - ref: spooky.pumpkin_catapult.red.png - ours: unit_spooky.pumpkin_catapult_idle (CONFIRM 441)
3. [S] a dark wheels - blocker 1: the spooky wheel tyre and hub off the grey iron onto PUMPKIN_TIMBER (or a darker shade of it) - ref: spooky.pumpkin_catapult.red.png - ours: unit_spooky.pumpkin_catapult_swatch.png (CONFIRM 441)
## Attempts (iter | gap | criterion | verdict)
434-438 | PUMPKIN_SHOT, PUMPKIN_BURST; RIB_CRADLE, BONE_FRAME | b,c | approved (b, c PASS)
438-440 | CATAPULT_BANNER; SKELETON_CREW; operator skull anchor | a | approved (struck 2, 3)
441 | PUMPKIN_TIMBER own near-black cloth timber: frame, arm wood, wheel faces, counterweight (fcb568a7) | a | approved (struck 1; a PASS; CONFIRM failed a)
## Rejected (last 4)
## Notes (max 3 lines)
- Cradle/bones/banners: vehicleBuilder buildCatapult spooky branch (RIB_CRADLE, BONE_FRAME, CATAPULT_BANNER, PUMPKIN_TIMBER); operator spookyDress skeletonCrew; skull anchor passed to wrapAsBody. Wheels: CATAPULT_WHEEL tyre + hub use the grey iron.
- wrapAsBody's body source must stay the team axle (LESSONS 14). Every spooky-branch change must stay gated on options.spooky: medieval.catapult is done.
