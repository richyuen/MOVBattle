# renaissance.balloon_archer
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 2. body in unit_renaissance.balloon_archer_idle is a plain team tunic — TABS: team doublet with cream vertical stripes, puffed slashed sleeves, brown belt, knee breeches, tan stockings (ref: renaissance.balloon_archer.blue.png)
b FAIL (1 since 327)
 2. longbow in unit_renaissance.balloon_archer_windup/_flight is about 0.6 of the archer's height and thin — TABS: stave about 0.9 of his height, thick at the grip (ref: renaissance.balloon_archer.red.png)
c FAIL (0 since 327)
 1. missing: in unit_renaissance.balloon_archer_struck no balloon swells and the knight stays grounded — TABS: the arrow's ball expands into balloons that float the hit unit up (ref: card Characteristics)
 2. arrow in unit_renaissance.balloon_archer_release is a bare shaft — TABS: a team ball behind the arrowhead (ref: card Appearance; renaissance.balloon_archer.jpg)
d PASS (cost 200, hp 1.09x vs 1.00x, dmg 0.39x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] b longbow length (fallout of 329 longbow [S]) — propBuilder.ts LONGBOW long 0.85->1.2, thick 0.05->0.065 — NEXT shot: unit_renaissance.balloon_archer_flight.png
2. [S] c balloon float — blocker 1: balloons swell on impact and float the target — ref: card Characteristics — ours: unit_renaissance.balloon_archer_struck.png
3. [S] a doublet — blocker 2: striped team doublet, puffed slashed sleeves, belt, knee breeches over tan stockings — ref: renaissance.balloon_archer.blue.png — ours: unit_renaissance.balloon_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
327 | black brim hat, no head balloon [S] (d747d43) | a | approved
329 | light-grey longbow [S] (ea71dc1 + c2aff34) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 327 defect on the hat: brim short and drooped like a bowler; TABS ~2 heads, flatter (BRIM_HAT).
- The longbow is the shared "bow" with weaponVariant longbow (LONGBOW); _idle sees the archer from behind, the bow hides in front of him.
