# viking.headbutter
Status: open   Audited: 391   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 391)
 4. gear in _idle — TABS: a brown belt, fur-trimmed bracers and thick fur boot cuffs over brown boots (ref: .red.png, card Appearance); ours: a plain blue tunic, bare hands and boots, no belt
  (struck 1, 3 at 392: his own spiked cap; the dark nose cone went with the shared helmet; struck 2 at 393: the braids)
b PASS (391)
c FAIL (1 since 391)
 1. headbutt ram in _release/_flight — TABS: dives head-first, the helmet spike into the foe, ending prone (ref: .png, card Headbutt); ours: bowing about 90 at the waist with both feet planted, his head a forearm short of the foe; he never leaves the vertical or ends on the ground (394)
d PASS (cost 90, hp 0.69x, dmg 0.25x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c headbutt ram - blocker 1: a whole-body prone dive: pitch the root near level, slide him the lunge distance onto the man at the blow, hold him prone through `recover`, then get up (simulationSystem HEADBUTT + animator pose) - ref: .png - ours: unit_viking.headbutter_release.png
2. [S] a gear - blocker 4: a brown belt with a buckle, fur-cuffed dark bracers on the forearms, cream fur boot cuffs over brown boots - ref: .red.png - ours: unit_viking.headbutter_idle.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392 | helmet: team cap, studded brow band, ear flaps, one tall spike (vikingDress HEADBUTTER_CAP) [S] (fb91bba) | a | approved (struck a.1, a.3)
393 | braids: two tan plaits from the ear flaps onto the chest, dark tie and tuft (HEADBUTTER_BRAID) [S] (52066c2) | a | approved (struck a.2)
394 | Headbutt: ready at the start, .28 s head-down drive with a .5 m step, .damage + flip, logged "headbutt" and as a hit (HEADBUTT) [S] (a5904a5) | c | approved (narrowed c.1)
## Rejected (last 4)
## Notes (max 3 lines)
- 394: HEADBUTT shares the minotaur's _butts machinery through a per-butt spec: within .55, cd 6, windup .28, recover .5, lunge .5, radius 1.15, dmg 18, fling 5, lift 4.5. The minotaur's first butt still waits its cooldown; the headbutter's is ready at the start so his opening attack is the ram.
- The ram's blow also pushes a hitLog entry, so capture's `release` (first PLAIN event) is at the ram tick: `release = melee hit at 1750 ms; ability headbutt at 1750 ms`.
- Next on c: the dive is a bow, not a whole-body launch (critic 394).
