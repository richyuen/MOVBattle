# viking.headbutter
Status: open   Audited: 391, 395, 396, 400, 401, 402 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 402; the gap critic passed a at 402 after striking 4, the CONFIRM failed it on silhouette with this list)
 1. helmet dome in unit_viking.headbutter_idle - a full sphere as wide as the shoulders, the head near 28% of the figure's height (lineup_viking far left reads as a ball-headed figure); TABS: a low skull-cap dome over the brow band, narrower than the shoulders, head about a fifth of the height (ref: .red.png, viking.jpg far-left figure)
 2. legs in unit_viking.headbutter_idle - belt-to-sole about 40% of the height, the fur cuffs stacked right under the shorts at knee level (lineup_viking far left: stubby legs under the belt stack); TABS: legs about half the height, trousers running down to fur cuffs at mid-shin above the boot (ref: .blue.png, viking.jpg)
b PASS (391; CONFIRM 402)
c PASS (401; CONFIRM 402)
d PASS (cost 90, hp 0.69x, dmg 0.25x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a dome - blocker 1: a low skull-cap dome over the brow band, narrower than the shoulders (HEADBUTTER_CAP dome/tall/slice, or headSize 1.8 -> ~1.3 in unitVisuals with the cap re-fitted) - ref: .red.png - ours: unit_viking.headbutter_idle.png
2. [S] a legs - blocker 2: longer legs (legLength in unitVisuals) with the trousers running down to the fur cuffs at mid-shin above the boot (cuffFrom/cuffTo lower on the shin) - ref: .blue.png - ours: unit_viking.headbutter_idle.png
## Attempts (iter | gap | criterion | verdict)
392-393 | spiked team cap (struck a.1, a.3); two tan braids with dark ties (struck a.2) [S] | a | approved
394 | Headbutt: ready at the start, head-down drive, logged (a5904a5) | c | approved (narrowed c.1)
395-396 | belt, bracers, cream fur boot cuffs over brown boots; boots over the feet, rolls warmer [S] | a | approved (narrowed a.4)
400 | unlit cream fur + buckle .5 at 1.35 proud (4c49b9b) | a | approved; head-first dive (DIVE) + leap + prone sprawl (7c3bc11) | c | approved
401 | the leap covers gap + reach, the sprawl waits .14 s, arms trail (41852fd + fde5dd6) | c | approved (c PASS); bracer fur onto the bracer's top, belt to the waist (7f8b218) | a | approved
402 | HEADBUTTER_CREAM lit tan self-lit .42 + HEADBUTTER_BELT broad .44 band with dark rims (688ef22) | a | approved (struck 4, a PASS); CONFIRM failed a (dome, legs)
## Rejected (last 4)
## Notes (max 3 lines)
- 402: the gap critic passed a (fur cream on the swatch, belt broad) and proposed him done; the CONFIRM's two blockers are the body's proportions: headSize 1.8 (unitVisuals) makes the cap a shoulder-wide ball, and the legs read stubby under the belt. Its [P] fallout (creamGlow .42 -> .36 for warmer boot cuffs) is moot while a is on the new list.
- 402: HEADBUTTER_KIT beltTall .44 at -.4 with rims .16; HEADBUTTER_CREAM (0.8,0.6,0.35) cloth self-lit .42, out of the glow. 401: furFrom .16 onto the bracer's top; DIVE.arms 2.3.
- 400: HEADBUTT.dive 3.0 m/s; headbuttSprawl .36/.22/.5 s.
