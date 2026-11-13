# secret.skeleton_giant
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 527, 1 struck)
 1. Body in unit_secret.skeleton_giant_idle is a bulky team slab body with blocky limbs — TABS: a lanky skeleton of cream bones (ref: secret.skeleton_giant.jpg, .red.png; card Appearance)
 3. Scale in lineup_secret_3: he stands under 2x the witch beside him — TABS: Size 3x, towering over the units round his knees (ref: card Infobox; secret.skeleton_giant.jpg)
 4. No ragged shorts in unit_secret.skeleton_giant_idle — TABS: torn team shorts with a jagged hem (ref: secret.skeleton_giant.red.png)
 5. No greaves in unit_secret.skeleton_giant_idle — TABS: team greaves over bare bone shins (ref: secret.skeleton_giant.red.png)
b PASS (528: struck 2, Stiffy Shield)
c FAIL (0 since 527)
 1. The hit at 317 ms in unit_secret.skeleton_giant_release is a punch — TABS: a sword blow (ref: card Weapons)
 2. missing: Giant Fear aura making nearby enemies flee (ref: card Weapons ability; secret.skeleton_giant.jpg glowing frightened units)
d PASS (528 stats)
## Ranked gaps
1. [S] secret.skeleton_giant.a lanky bone body — blocker 1: thin cream bone limbs, rib cage and pelvis in place of the slab body — ref: secret.skeleton_giant.jpg — ours: unit_secret.skeleton_giant_idle
2. [S] secret.skeleton_giant.c sword blow — blocker 1: the hit swung with the Giant Stiffy Sword, not a punch — ref: card Weapons — ours: unit_secret.skeleton_giant_release
3. [S] secret.skeleton_giant.c Giant Fear — blocker 2: fear aura that makes nearby enemies flee, logged in abilityLog — ref: card Weapons — ours: unit_secret.skeleton_giant_release
## Attempts (iter | gap | criterion | verdict)
528 | Stiffy Shield on the off arm (unitVisuals shield stiffy) (53ccdaed) | b | approved (struck 2, b PASS)
527 | Giant Stiffy Sword, jagged bone blade GIANT_STIFFY_SWORD (77116afd) | b | approved (struck 1)
527 | team Greek helmet with cheek guards, crown ball hidden, GIANT_HELM (deff238b) | a | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 527 critic: blade renders cool grey-white (TABS warm bone-tan); helm stops at eye level, TABS hoods to the neck.
- 527 critic: with the sword his release (now 950 ms) may already clear c.1 (punch): check at the next audit.
