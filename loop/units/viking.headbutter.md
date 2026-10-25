# viking.headbutter
Status: open   Audited: 391, 395, 396, 400, 401   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 395)
 4. gear in _idle - TABS: a brown belt, fur-trimmed bracers and thick fur boot cuffs over brown boots (ref: .red.png, card Appearance); ours: cream rolls sit on the bracers' tops and a belt with a buckle shows at the waist now, but the fur reads pale grey-white where TABS's rolls are warm cream, and the belt is a thin dark band at the hem rather than the reference's broad brown band
  (struck 1, 3 at 392: his own spiked cap; struck 2 at 393: the braids; 396: the feet are brown boots with a dark sole; 400: the fur is cream and the buckle clears the braids; 401: the bracers are no longer bare and the belt is at the waist)
b PASS (391)
c PASS (401)
d PASS (cost 90, hp 0.69x, dmg 0.25x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a gear - blocker 4: warm cream boot/ bracer fur (a new material, not another HEADBUTTER_KIT nudge - that row is approved) and a broad brown belt band - ref: .red.png - ours: unit_viking.headbutter_idle.png
## Attempts (iter | gap | criterion | verdict)
392 | spiked team cap (fb91bba) | a | approved (struck a.1, a.3)
393 | two tan braids with dark ties (52066c2) | a | approved (struck a.2)
394 | Headbutt: ready at the start, head-down drive, logged (a5904a5) | c | approved (narrowed c.1)
395 | belt, bracers, cream fur boot cuffs over brown boots (607fd74) | a | approved (narrowed a.4)
396 | boots over the feet + fur rolls warmer and puffier (cb83fbe) | a | approved (narrowed a.4)
400 | unlit cream fur + buckle .5 at 1.35 proud (4c49b9b) | a | approved (blocker 4 stands)
400 | head-first dive (DIVE) + leap + prone sprawl (7c3bc11) | c | approved (blocker 1 stands)
401 | the leap covers gap + reach, the sprawl waits .14 s, arms trail (41852fd + fde5dd6) | c | approved (c PASS)
401 | bracer fur onto the bracer's top, belt to the waist (7f8b218) | a | approved (blocker 4 narrowed)
## Rejected (last 4)
## Notes (max 3 lines)
- 401: HEADBUTTER_KIT beltAt -.42, beltTall .3, beltOut 1.3; furFrom .16 (off the elbow onto the bracer's top), furOut 1.62, furThick .26. DIVE.arms 2.3 with the elbows .35 lays the arms along the body when the trunk is level.
- 400: HEADBUTTER_FUR unlit (emissive = colour, out of the glow); HEADBUTT.dive 3.0 m/s; headbuttSprawl .36/.22/.5 s.
- c PASS at 401 (the CONFIRM-less path): dive in the air, spike at the foe, prone after. The critic still saw one arm forward in _release - not a blocker.
