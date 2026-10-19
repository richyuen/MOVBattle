# ancient.hoplite
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 378)
 1. helmet in unit_ancient.hoplite_idle (also lineup_ancient; _release, _struck show a detached dome hovering): dome, cheek plates, thin cone crest — TABS: Corinthian helmet enclosing the face, tall boxy stepped crest on the bowl (ref: .red.png, .jpg)
 2. legs in _idle: grey boots — TABS: dark brown greaves knee to ankle over strapped sandals (ref: .red.png)
b FAIL (2 since 378)
 1. aspis rim in unit_ancient.hoplite_idle reads tan/khaki, not orange; swirls three small pellet spirals — TABS: orange rim (~237,153,77), big pale wave swirls filling the face (ref: .red.png)
 2. dory in _idle low outside the aspis now, but near-vertical; lineup_ancient: like a staff planted point-down — TABS: shaft about 40 deg below level, point well ahead of his feet (ref: .red.png)
c FAIL (0 since 378)
 1. spear never thrusts: _release hit is a shield shove, dory trailing — TABS: levels the short spear and thrusts it past the aspis (ref: .jpg, card Weapons)
d PASS (cost 180, hp 1.25x, dmg 0.49x, cd 0.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c dory thrust — blocker 1 (and b.2's angle): from the carry level the dory and drive it past the aspis on the blow (DORY_CARRY new 380: [P] barred) — ref: .jpg, card Weapons — ours: unit_ancient.hoplite_release.png
2. [S] a Corinthian helmet — blocker 1: enclosed face, boxy stepped crest on the bowl (same mechanism as sarissa a.1) — ref: .red.png — ours: unit_ancient.hoplite_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | aspis on the trunk, upright, notch, orange rim, swirls (ASPIS) [S] (66de83f) | b | approved
380 | dory carried low at the weapon hip outside the aspis, point down (DORY_CARRY, _carryDory) [S] (41000a8 +dcff49a) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Aspis is shield type "aspis", parented to body.torso at ASPIS; rim uses SCUTUM_TRIM. Dory carry: animator.carriesDory (runtimeUnit), Idle/Walking only.
