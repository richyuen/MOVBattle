# viking.headbutter
Status: open   Audited: 391, 395, 396   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 395)
 4. gear in _idle - TABS: a brown belt, fur-trimmed bracers and thick fur boot cuffs over brown boots (ref: .red.png, card Appearance); ours: bracers, fur cuffs, brown boot shells and a belt now, but the boot stops at the ankle (the feet stay team blue), the fur reads pale grey as a fringe of spikes rather than a warm puffy roll, and the belt is hidden by the braids and the stoop
  (struck 1, 3 at 392: his own spiked cap; the dark nose cone went with the shared helmet; struck 2 at 393: the braids; 396: the feet are brown boots with a dark sole and the fringe is a puffy roll, but the fur still reads pale grey-white and the buckle stays behind the braids)
b PASS (391)
c FAIL (1 since 391)
 1. headbutt ram in _release/_flight - TABS: dives head-first, the helmet spike into the foe, ending prone (ref: .png, card Headbutt); ours: bowing about 90 at the waist with both feet planted, his head a forearm short of the foe; he never leaves the vertical or ends on the ground (394)
d PASS (cost 90, hp 0.69x, dmg 0.25x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c headbutt ram - blocker 1: a head-first dive, the helmet spike into the foe, ending prone - ref: .png - ours: unit_viking.headbutter_release.png
2. [S] a warm fur and belt - blocker 4: an unlit warm-tan fur that stays cream in the shot, buckle dropped in front of the braids - ref: .red.png - ours: unit_viking.headbutter_idle.png
## Attempts (iter | gap | criterion | verdict)
392 | spiked team cap (fb91bba) | a | approved (struck a.1, a.3)
393 | two tan braids with dark ties (52066c2) | a | approved (struck a.2)
394 | Headbutt: ready at the start, head-down drive, logged (a5904a5) | c | approved (narrowed c.1)
395 | belt, bracers, cream fur boot cuffs over brown boots (607fd74) | a | approved (narrowed a.4)
396 | boots over the feet + fur rolls warmer and puffier (cb83fbe) | a | approved (narrowed a.4)
## Rejected (last 4)
## Notes (max 3 lines)
- 396: HEADBUTTER_KIT's sole/boot shell covers the foot mesh; the fur is a torus roll with lumps at (0.9, 0.7, 0.42) and still displays pale - the critic asks for an unlit cream.
- The ram's blow also pushes a hitLog entry, so `release` is at the ram tick.
