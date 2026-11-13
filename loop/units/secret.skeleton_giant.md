# secret.skeleton_giant
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 527, 3 struck)
 3. Scale in lineup_secret_3: he stands under 2x the witch beside him — TABS: Size 3x, towering over the units round his knees (ref: card Infobox; secret.skeleton_giant.jpg)
 5. No greaves in unit_secret.skeleton_giant_idle — TABS: team greaves over bare bone shins (ref: secret.skeleton_giant.red.png)
b PASS (528: struck 2, Stiffy Shield)
c FAIL (1 since 527, 1 struck)
 1. The hit at 317 ms in unit_secret.skeleton_giant_release is a punch — TABS: a sword blow (ref: card Weapons)
d PASS (531 stats)
## Ranked gaps
1. [S] secret.skeleton_giant.c sword blow — blocker 1: Stiffy-sword swing as the hit (overhead, hit from the blade) — ref: card Weapons — ours: unit_secret.skeleton_giant_release.png
2. [S] secret.skeleton_giant.a greaves — blocker 5: team greaves over bone shins (spookyDress stiffyGreaves) — ref: secret.skeleton_giant.red.png — ours: unit_secret.skeleton_giant_idle.png
## Attempts (iter | gap | criterion | verdict)
531 | Stiffy bone body via dressSkeleton (SKELETON_UNITS), no hood under the helm (aad23125) | a | approved (struck 1, 4)
531 | Giant Fear: ghost-green burst 6 m round him frightens every enemy, 8 s cooldown, logged giant_fear, GIANT_FEAR (SS) (d7859f2a) | c | approved (struck 2)
528 | Stiffy Shield on the off arm (unitVisuals shield stiffy) (53ccdaed) | b | approved (struck 2, b PASS)
527 | Giant Stiffy Sword GIANT_STIFFY_SWORD (77116afd); team Greek helmet GIANT_HELM (deff238b) | b, a | approved (struck b.1, a.2)
## Rejected (last 4)
## Notes (max 3 lines)
- 531 critic: a team/grey torso slab shows behind the ribs (TABS open ribcage; minor). Ability shots frame giant_fear (capture ABILITY_PREF, 531.0).
- 527 critic: blade renders cool grey-white (TABS warm bone-tan); helm stops at eye level, TABS hoods to the neck.
- 531: release now melee hit at 950 ms; the critic still reads no sword stroke.
