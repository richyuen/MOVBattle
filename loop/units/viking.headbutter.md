# viking.headbutter
Status: open   Audited: 391, 395, 396, 400, 401, 402 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 402; 1 rejected [S] since 402; struck 1 at 403, added 3 at 403, struck 3 at 404)
 2. legs in unit_viking.headbutter_idle - belt-to-sole about 40% of the height, the fur cuffs stacked right under the shorts at knee level (lineup_viking far left: stubby legs under the belt stack); TABS: legs about half the height, trousers running down to fur cuffs at mid-shin above the boot (ref: .blue.png, viking.jpg)
  (struck 1 at 403: the ball dome; struck 3 at 404: the brow band now above the eyes)
b PASS (391; CONFIRM 402)
c PASS (401; CONFIRM 402)
d PASS (cost 90, hp 0.69x, dmg 0.25x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a leg proportion - blocker 2: a Headbutter cut of the leg kit (vikingDress brawlerLegs / HEADBUTTER_KIT): trousers from the belt to mid-shin, the cream cuffs at mid-shin over a shorter boot, or a shorter trunk so the belt sits at mid-height; no legLength nudge, no beltAt [P] - ref: .blue.png - ours: unit_viking.headbutter_idle.png
## Attempts (iter | gap | criterion | verdict)
392-396 | spiked cap; braids; Headbutt (c); belt, bracers, fur boot cuffs, boots [S] | a,c | approved
400-401 | unlit cream fur + buckle; head-first DIVE + leap + sprawl; reach .75, sprawl .14 s (c PASS); bracer fur, belt to the waist | a,c | approved
402 | HEADBUTTER_CREAM lit tan self-lit .42 + HEADBUTTER_BELT broad band (688ef22) | a | approved (struck 4, a PASS); CONFIRM failed a (dome, legs)
403 | headSize 1.8 -> 1.3, HEADBUTTER_CAP dome 1.1 / tall .72, a dark strip of 5 slabs up the dome's front (bcd3eb5) | a | approved (struck 1; added 3)
404 | the band and cap seated off the eye beads' tops (eyeTopInHead, HEADBUTTER_CAP.eyeClear .03) (47ca693) | a | approved (struck 3)
405 | brawlerLegs in place of headbutterKit's knee cuffs and boots (kit `legs` flag off) (db2616f) | a | approved (cuff clause moved; blocker 2 stands on length)
406 | standSquare (the halberd's square stance) + legLength 1.22 (e25bd21, reverted) | a | rejected
## Rejected (last 4)
- legs [S] [1] - 406: upright square stance and legLength 1.22 - upright now, but belt-to-sole unmoved at 41% and the trousers only 13% of the height (TABS 33%): the boots and cuffs take the leg
## Notes (max 3 lines)
- 406 critic: ref blue.png cap 115, belt 490, cuff top 780, sole 1000 px; the probe put his hip at 52% of his height with the stance, yet the shot's belt-to-sole stayed 41% - the kit's boots/cuffs, not the bone, set what reads.
- 404 critic (not a blocker): the side flaps stand out as dark blocks at eye level; TABS's cap sides drop flush over the ears.
- 402: HEADBUTTER_KIT beltTall .44 at -.4; HEADBUTTER_CREAM (0.8,0.6,0.35) cloth self-lit .42. 400: HEADBUTT.dive 3.0 m/s.
