# viking.headbutter
Status: open   Audited: 391, 395, 396, 400, 401, 402 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 402; struck 1 at 403, added 3 at 403)
 2. legs in unit_viking.headbutter_idle - belt-to-sole about 40% of the height, the fur cuffs stacked right under the shorts at knee level (lineup_viking far left: stubby legs under the belt stack); TABS: legs about half the height, trousers running down to fur cuffs at mid-shin above the boot (ref: .blue.png, viking.jpg)
 3. brow band in unit_viking.headbutter_idle - the dark band runs across the eye beads like goggles; TABS: the band above the eyes, the eyes on the face under it (ref: .red.png) (added 403, introduced by bcd3eb5 at unitVisuals.ts headSize 1.8 -> 1.3)
  (struck 1 at 403: the ball dome - a low skull cap on a smaller head)
b PASS (391; CONFIRM 402)
c PASS (401; CONFIRM 402)
d PASS (cost 90, hp 0.69x, dmg 0.25x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a brow band - blocker 3: seat the band and the dome's rim off the eye beads' tops (the iceArcherCap 403 pattern) so the band rides above the eyes - ref: .red.png - ours: unit_viking.headbutter_idle.png
2. [S] a legs - blocker 2: longer legs (legLength in unitVisuals) with the trousers running down to the fur cuffs at mid-shin above the boot - ref: .blue.png - ours: unit_viking.headbutter_idle.png
## Attempts (iter | gap | criterion | verdict)
392-396 | spiked cap; braids; Headbutt (c); belt, bracers, fur boot cuffs, boots [S] | a,c | approved
400-401 | unlit cream fur + buckle; head-first DIVE + leap + sprawl; reach .75, sprawl .14 s (c PASS); bracer fur, belt to the waist | a,c | approved
402 | HEADBUTTER_CREAM lit tan self-lit .42 + HEADBUTTER_BELT broad band (688ef22) | a | approved (struck 4, a PASS); CONFIRM failed a (dome, legs)
403 | headSize 1.8 -> 1.3, HEADBUTTER_CAP dome 1.1 / tall .72, a dark strip of 5 slabs up the dome's front (bcd3eb5) | a | approved (struck 1; added 3)
## Rejected (last 4)
## Notes (max 3 lines)
- 403 critic: the cap dome is the head's own team shade, so cap and head read as one egg (minor, not a blocker); the strip reads faintly. The ram still reads head-first at headSize 1.3.
- 402: HEADBUTTER_KIT beltTall .44 at -.4; HEADBUTTER_CREAM (0.8,0.6,0.35) cloth self-lit .42, out of the glow.
- 400: HEADBUTT.dive 3.0 m/s; headbuttSprawl .36/.22/.5 s; DIVE.arms 2.3.
