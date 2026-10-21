# viking.headbutter
Status: open   Audited: 391, 395   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 391)
 4. gear in _idle - TABS: a brown belt, fur-trimmed bracers and thick fur boot cuffs over brown boots (ref: .red.png, card Appearance); ours: bracers, fur cuffs, brown boot shells and a belt now, but the boot stops at the ankle (the feet stay team blue), the fur reads pale grey as a fringe of spikes rather than a warm puffy roll, and the belt is hidden by the braids and the stoop
  (struck 1, 3 at 392: his own spiked cap; the dark nose cone went with the shared helmet; struck 2 at 393: the braids)
b PASS (391)
c FAIL (1 since 391)
 1. headbutt ram in _release/_flight - TABS: dives head-first, the helmet spike into the foe, ending prone (ref: .png, card Headbutt); ours: bowing about 90 at the waist with both feet planted, his head a forearm short of the foe; he never leaves the vertical or ends on the ground (394)
d PASS (cost 90, hp 0.69x, dmg 0.25x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a boots - blocker 4: extend the brown boot shell over the foot meshes and warm the fur toward (0.9, 0.7, 0.42) as one puffy roll; get the belt clear of the braids - ref: .red.png - ours: unit_viking.headbutter_idle.png
2. [S] c headbutt dive - blocker 1: dive head-first, leaving the vertical and ending prone - ref: .png - ours: unit_viking.headbutter_release.png
## Attempts (iter | gap | criterion | verdict)
392 | spiked team cap (fb91bba) | a | approved (struck a.1, a.3)
393 | two tan braids with dark ties (52066c2) | a | approved (struck a.2)
394 | Headbutt: ready at the start, head-down drive, logged (a5904a5) | c | approved (narrowed c.1)
395 | belt, bracers, cream fur boot cuffs over brown boots (607fd74) | a | approved (narrowed a.4)
## Rejected (last 4)
## Notes (max 3 lines)
- 395: HEADBUTTER_KIT is built on limbShell (bracer .06-.78 of the forearm, boot .48-1.0 of the shin, fur ring at the cuff's top); the foot mesh is not covered yet.
- The ram's blow also pushes a hitLog entry, so `release` is at the ram tick.
