# viking.headbutter
Status: open   Audited: 391, 395, 396, 400   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 395)
 4. gear in _idle - TABS: a brown belt, fur-trimmed bracers and thick fur boot cuffs over brown boots (ref: .red.png, card Appearance); ours: bracers, fur cuffs, brown boot shells and a belt now, but the boot stops at the ankle (the feet stay team blue), the fur reads pale grey as a fringe of spikes rather than a warm puffy roll, and the belt is hidden by the braids and the stoop
  (struck 1, 3 at 392: his own spiked cap; the dark nose cone went with the shared helmet; struck 2 at 393: the braids; 396: the feet are brown boots with a dark sole and the fringe is a puffy roll, but the fur still reads pale grey-white and the buckle stays behind the braids)
b PASS (391)
c FAIL (2 since 391)
 1. headbutt ram in _release/_flight - TABS: dives head-first, the helmet spike into the foe, ending prone (ref: .png, card Headbutt); ours: bowing about 90 at the waist with both feet planted, his head a forearm short of the foe; he never leaves the vertical or ends on the ground (394)
d PASS (cost 90, hp 0.69x, dmg 0.25x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c ram reach - blocker 1: a longer leap so the spike meets the foe, both arms trailing - ref: .png - ours: unit_viking.headbutter_release.png
2. [S] a bracer fur and belt - blocker 4: unlit cream tufts on the bracers, the belt and buckle at the waist - ref: .red.png - ours: unit_viking.headbutter_idle.png
## Attempts (iter | gap | criterion | verdict)
392 | spiked team cap (fb91bba) | a | approved (struck a.1, a.3)
393 | two tan braids with dark ties (52066c2) | a | approved (struck a.2)
394 | Headbutt: ready at the start, head-down drive, logged (a5904a5) | c | approved (narrowed c.1)
395 | belt, bracers, cream fur boot cuffs over brown boots (607fd74) | a | approved (narrowed a.4)
396 | boots over the feet + fur rolls warmer and puffier (cb83fbe) | a | approved (narrowed a.4)
400 | unlit cream fur (0.78,0.58,0.34) + buckle .5 at 1.35 proud (4c49b9b) | a | approved (blocker 4 stands: bracers bare, belt a thin hidden band)
400 | head-first dive (DIVE) + leap + prone sprawl (7c3bc11) | c | approved (blocker 1 stands: the spike stops short, one hand planted)
## Rejected (last 4)
## Notes (max 3 lines)
- 400: HEADBUTTER_FUR is unlit with emissive = its colour, out of the glow; buckle chest.x*.5 at beltOut*1.35. DIVE tip 1.22 rad on the hip joint, head -.62, arms -.45; HEADBUTT.dive 3.0 m/s leap ~= the .28 s windup; headbuttSprawl .36/.22/.5 s.
- 396: HEADBUTTER_KIT's sole/boot shell covers the foot mesh; the fur is a roll with lumps. The ram's blow also pushes a hitLog entry, so `release` is at the ram tick.
- The critic's next ask on c: the spike must meet the foe and both arms must trail (one hand is planted through the dive).
