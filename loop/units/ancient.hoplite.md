# ancient.hoplite
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 378)
 1. crest in unit_ancient.hoplite_idle (also lineup_ancient; shared crested_helm, sarissa's 382 bands now on it too): a thin comb, a fan of spikes side-on — TABS: tall boxy stepped crest on the bowl (ref: .red.png, .jpg)
 2. legs in _idle: grey boots — TABS: dark brown greaves knee to ankle over strapped sandals (ref: .red.png)
b FAIL (3 since 378)
 1. aspis rim in unit_ancient.hoplite_idle reads tan/khaki, not orange; swirls three small pellet spirals — TABS: orange rim (~237,153,77), big pale wave swirls filling the face (ref: .red.png)
c PASS (381)
d PASS (cost 180, hp 1.26x, dmg 0.49x, cd 0.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b aspis rim and swirls — blocker 1: rim on a flat unlit trim material (as SCUTUM_TRIM_FLAT); three big pale wave swirls filling the face (propBuilder ASPIS) — ref: .red.png — ours: unit_ancient.hoplite_idle.png
2. [S] a greaves — blocker 2: dark brown greaves over strapped sandals (ancientDress) — ref: .red.png — ours: unit_ancient.hoplite_idle.png
3. [S] a crest — blocker 1: same mechanism as sarissa a.1 (crested_helm crest) — ref: .red.png — ours: unit_ancient.hoplite_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | aspis on the trunk, upright, notch, orange rim, swirls (ASPIS) [S] (66de83f) | b | approved
380 | dory carried low at the weapon hip outside the aspis, point down (DORY_CARRY, _carryDory) [S] (41000a8 +dcff49a) | b | approved
381 | dory thrust: level line, drawn at the blow, driven out by .22 of it (DORY_THRUST) [S] (52a1b5c +512e06f) | c | approved (c PASS)
382 | dory carry aimed at a ground point ahead and out past his weapon side (DORY_AIM) [S] (e3ebcbd) | b | approved (struck b.2)
## Rejected (last 4)
## Notes (max 3 lines)
- Aspis is shield type "aspis" on body.torso at ASPIS; rim uses SCUTUM_TRIM (lit). _carryDory runs Idle/Walking/Attacking; probe output/loop/probe_hoplite.mjs.
- The sim logs a melee blow as the attack starts (hit ~80 ms on); the _release shot is taken a tick before the animator enters the attack, so the motion shows in _flight.
- Critic 382 minor: the spearhead barely reads at the point (TABS a big dark leaf head).
