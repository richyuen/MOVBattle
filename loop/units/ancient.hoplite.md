# ancient.hoplite
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 378)
 1. crest in unit_ancient.hoplite_idle (also lineup_ancient; the helm now encloses the face, no hovering dome, 381 fallout of bf11d67): a thin comb, a fan of short spikes side-on — TABS: tall boxy stepped crest on the bowl (ref: .red.png, .jpg)
 2. legs in _idle: grey boots — TABS: dark brown greaves knee to ankle over strapped sandals (ref: .red.png)
b FAIL (2 since 378)
 1. aspis rim in unit_ancient.hoplite_idle reads tan/khaki, not orange; swirls three small pellet spirals — TABS: orange rim (~237,153,77), big pale wave swirls filling the face (ref: .red.png)
 2. dory in _idle (also lineup_ancient) near-vertical, point by his feet — TABS: shaft about 40 deg below level, point well ahead of his feet (ref: .red.png)
c PASS (381)
d PASS (cost 180, hp 1.25x, dmg 0.49x, cd 0.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b dory angle — blocker 2: idle carry solved to a line about 40 deg down, point ahead of the feet, beside the aspis (DORY_CARRY) — ref: .red.png — ours: unit_ancient.hoplite_idle.png
2. [S] b aspis rim and swirls — blocker 1: rim on a flat unlit trim material (as SCUTUM_TRIM_FLAT); big pale wave swirls filling the face — ref: .red.png — ours: unit_ancient.hoplite_idle.png
3. [S] a crest — blocker 1: same mechanism as sarissa a.1 (crested_helm crest) — ref: .red.png — ours: unit_ancient.hoplite_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | aspis on the trunk, upright, notch, orange rim, swirls (ASPIS) [S] (66de83f) | b | approved
380 | dory carried low at the weapon hip outside the aspis, point down (DORY_CARRY, _carryDory) [S] (41000a8 +dcff49a) | b | approved
381 | dory thrust: level line, drawn at the blow, driven out by .22 of it (DORY_THRUST) [S] (52a1b5c +512e06f) | c | approved (c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Aspis is shield type "aspis" on body.torso at ASPIS; rim uses SCUTUM_TRIM (lit). _carryDory runs Idle/Walking/Attacking; probe output/loop/probe_hoplite.mjs.
- The sim logs a melee blow as the attack starts (hit ~80 ms on); the _release shot is taken a tick before the animator enters the attack, so the motion shows in _flight.
