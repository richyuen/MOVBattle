# legacy.boxer
Status: open   Audited: 457   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (2 since 457)
 1. build in unit_legacy.boxer_idle, a short figure (size 0.68) — TABS: a tall lanky man at 1.08x (ref: legacy.boxer.red.png, card Size)
 4. boots in unit_legacy.boxer_idle, team feet — TABS: tall laced boots (ref: legacy.boxer.blue.png)
b PASS (458: team mitts centred on the fists, white palm band, team x .5 on the swatch; TEAM_GLOVE)
c FAIL (0 since 457)
 1. punch in unit_legacy.boxer_release, the arm is raised overhead and the glove does not drive forward — TABS: a straight glove jab into the enemy (ref: legacy.boxer.png)
 2. missing: Backwards Dodge (no ability event within the capture) — TABS: backs away 1-5 on a 3 s cooldown (ref: card Weapons ability)
d PASS (cost 450, hp 3.66x, dmg 1.00x, cd 0.60x; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.boxer.a laced boots — blocker 4: team shin shells from .55 to the foot, white lace bars across the front, a darker sole — ref: legacy.boxer.blue.png — ours: unit_legacy.boxer_idle.png
2. [S] legacy.boxer.c jab — blocker 1: a straight-jab pose, the glove driven forward at shoulder height into the target — ref: legacy.boxer.png — ours: unit_legacy.boxer_release.png
3. [S] legacy.boxer.c Backwards Dodge — blocker 2: a 3 s cooldown hop back of 1-5 m, logged in abilityLog — ref: card Weapons ability — ours: unit_legacy.boxer_release.png
4. [S] legacy.boxer.a build — blocker 1: a tall lanky 1.08x build in place of the 0.68 scale — ref: legacy.boxer.red.png — ours: unit_legacy.boxer_idle.png
## Attempts (iter | gap | criterion | verdict)
457 | TEAM_GLOVE team mitt centred on each fist, white band; wide .17 -> .11 (4e6b33f9, bc99e306) | b | approved (struck 2)
458 | [P] TEAM_GLOVE team x .5, glow .06 (f7d4c129) | b | approved (struck 1; b PASS)
459 | BOXER_HEADGEAR padded team shell open on the face, ear pads (17904d07) | a | approved (struck 2, 5: cheek bandage too small for the lineup)
460 | BOXER_SHORTS dark-team thigh shells, pelvis, gold striped waistband (37bcb6d4) | a | approved (struck 3)
## Rejected (last 4)
## Notes (max 3 lines)
- c starves at 462 (no attempt since the 457 audit): the jab overrides the melee swing in proceduralAnimation, not the boxer pose overlay in runtimeUnit.
