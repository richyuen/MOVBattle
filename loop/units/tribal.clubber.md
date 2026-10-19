# tribal.clubber
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 360)
 2. loincloth in unit_tribal.clubber_idle: pale beige card across the hips to the top of the thigh, tongues merged, white skull — TABS: ragged mid-brown hide strips to mid-thigh, torn hem, large tan skull, a bone each side (ref: tribal.clubber.red.png, .jpg)
b PASS (361)
c PASS (360)
d PASS (cost 70, hp 1.00x, dmg 1.00x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a loincloth — blocker 2: re-cut RAGGED_LOIN as separate mid-brown hide strips to mid-thigh with a torn hem, a large tan (not white) skull at the centre, a bone tied each side — ref: tribal.clubber.red.png, .jpg — ours: unit_tribal.clubber_idle.png
## Attempts (iter | gap | criterion | verdict)
322-325 | hair and beard, loincloth, tusk necklace, bracelets | a | approved
361 | cudgel (CLUB) [S] (6b4a076); dreadlock mop (d59089b) | a,b | approved
362 | ragged hide loincloth (RAGGED_LOIN) [S]; [P] mop darker, wider (e4f3774) | a | approved
365 | upright lanky stance: default pose, scale .95, bulk .8, legs 1.08, arms 1.1 [S] (6fba04b) | a | approved
366 | curly mop: 22 three-piece hooked locks, crown tufts (curlyMop, CURLY_MOP) [S] (6ca5eb6) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 362 hide: dressTribalLoincloth `ragged` branch (clubber only); critic: tongues merge into one card, skull white.
- Hair: curlyMop (366, replaces dreadMop for dreads_beard) + tribalBeard in DREAD_MOP.clubberColor. critic 366 (minor): a shade light, sparse on the face side.
- 365 stance: unitVisuals proportions + posePreset "default" (was "brute"); heavy_carry walk kept.
