# renaissance.balloon_archer
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 2. body in unit_renaissance.balloon_archer_idle is a plain team tunic — TABS: team doublet with cream vertical stripes, puffed slashed sleeves, brown belt, knee breeches, tan stockings (ref: renaissance.balloon_archer.blue.png)
b PASS (330)
c FAIL (0 since 327)
 1. missing: in unit_renaissance.balloon_archer_struck no balloon swells and the knight stays grounded — TABS: the arrow's ball expands into balloons that float the hit unit up (ref: card Characteristics)
 2. arrow in unit_renaissance.balloon_archer_release is a bare shaft — TABS: a team ball behind the arrowhead (ref: card Appearance; renaissance.balloon_archer.jpg)
d PASS (cost 200, hp 1.09x vs 1.00x, dmg 0.39x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c balloon float — blocker 1: team balloons swell on the target on the arrow's hit and lift it — ref: card Characteristics — ours: unit_renaissance.balloon_archer_struck.png
2. [S] c team ball on the arrow — blocker 2: team sphere behind the arrowhead — ref: renaissance.balloon_archer.jpg — ours: unit_renaissance.balloon_archer_release.png
3. [S] a doublet — blocker 2: striped team doublet, puffed slashed sleeves, belt, knee breeches over tan stockings — ref: renaissance.balloon_archer.blue.png — ours: unit_renaissance.balloon_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
327 | black brim hat, no head balloon [S] (d747d43) | a | approved
329 | light-grey longbow [S] (ea71dc1 + c2aff34) | b | approved
330 | longbow length [P] (d3cb713) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 327 defect on the hat: brim short and drooped like a bowler; TABS ~2 heads, flatter (BRIM_HAT).
- The longbow is the shared "bow" with weaponVariant longbow (LONGBOW); _idle sees the archer from behind.
