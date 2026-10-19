# ancient.hoplite
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 378)
 1. helmet in unit_ancient.hoplite_idle (also lineup_ancient; _release, _struck show a detached dome hovering): dome, cheek plates, thin cone crest — TABS: Corinthian helmet enclosing the face, tall boxy stepped crest on the bowl (ref: .red.png, .jpg)
 2. legs in _idle: grey boots — TABS: dark brown greaves knee to ankle over strapped sandals (ref: .red.png)
b FAIL (1 since 378)
 1. aspis rim in unit_ancient.hoplite_idle reads tan/khaki, not orange; swirls three small pellet spirals — TABS: orange rim (~237,153,77), big pale wave swirls filling the face (ref: .red.png)
 2. spear in _idle runs level at the waist through the aspis face (lineup_ancient: upright like a staff) — TABS: short dory held low at his weapon side outside the shield, point forward/down (ref: .red.png, card)
c FAIL (0 since 378)
 1. spear never thrusts: _release/_flight hit is a shield shove, spear vertical behind — TABS: levels the short spear and thrusts it past the aspis (ref: .jpg, card Weapons)
d PASS (cost 180, hp 1.25x, dmg 0.49x, cd 0.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b dory carry — blocker 2: short spear low at the weapon hip outside the aspis, point forward-down — ref: .red.png — ours: unit_ancient.hoplite_idle.png
2. [S] a Corinthian helmet — blocker 1: enclosed face, tall boxy stepped crest on the bowl — ref: .red.png — ours: unit_ancient.hoplite_idle.png
3. [S] c levelled dory thrust past the shield — blocker 1: thrust attack pose — ref: .jpg — ours: unit_ancient.hoplite_release.png
## Attempts (iter | gap | criterion | verdict)
379 | aspis on the trunk, upright, crescent notch, orange rim, pale swirls (propBuilder ASPIS) [S] (66de83f) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Aspis is shield type "aspis", parented to body.torso at ASPIS (x,y,z), not the hand; rim uses SCUTUM_TRIM lit .15 (reads tan).
- Critic 379: in _release the spear now runs level into the knight; re-check c.1 at the next audit.
