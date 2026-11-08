# evil.void_monarch
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (4 since 489, 4 struck)
 2. crown in unit_evil.void_monarch_idle: a pale grey crown of spikes — TABS: a bone-tan crown of flared rays with a tall black-wrapped central spike ringed in pink (ref: evil.void_monarch.red.png)
 6. arms in unit_evil.void_monarch_idle are bare — TABS: spiked bone balls at the elbows (ref: evil.void_monarch.blue.png)
 7. knee plates in unit_evil.void_monarch_idle cover the whole thigh from the belt down, side by side as one studded slab — TABS: one plate per knee, mid-thigh to just under the knee, with a gap between them (ref: evil.void_monarch.red.png)
b PASS (491 twin bone swords)
c FAIL (3 since 489, 3 struck)
 2. ability in unit_evil.void_monarch_ability_after: a summon plus a fear status are logged — TABS: Void Monarch Dodge (card Abilities; evil.void_monarch.jpg)
d PASS (498 stats)
## Ranked gaps
1. [S] evil.void_monarch.c Void Monarch Dodge — blocker 2: QUICK_DODGE path for evil.void_monarch (evidence commit first: archers in his scene beside the knights) — ref: card Abilities — ours: unit_evil.void_monarch_ability_after.png
2. [S] evil.void_monarch.a elbow balls — blocker 6: spiked bone balls at both elbows — ref: evil.void_monarch.blue.png — ours: unit_evil.void_monarch_idle.png
3. [P] evil.void_monarch.a knee plates — blocker 7: MONARCH_KNEES tall .62 to .4, wide 2.7 to 2.2 (fallout of [S] 3ab07b72) — ref: evil.void_monarch.red.png — ours: unit_evil.void_monarch_idle.png
4. [S] evil.void_monarch.a crown — blocker 2: bone-tan flared rays with a tall black-wrapped central spike ringed in pink — ref: evil.void_monarch.red.png — ours: unit_evil.void_monarch_idle.png
## Attempts (iter | gap | criterion | verdict)
498 | Demon Transformation: after 800 damage dealt (splash counted) a pink burst and he rises to float, no fear, simulationSystem DEMON_FORM + animator demonForm (647a7951; evidence 67337268) | c | approved (struck the Demon Transformation clause of 2)
498 | spiked bone knee plates, evilDress monarchKneePlates (3ab07b72) | a | approved (struck 5; added 7)
497 | dark tunic, bone chevrons, studded belt, evilDress monarchTunic (67617691) | a | approved (struck 4)
496 | bone V harness with spiked wing-arms, evilDress monarchHarness (4f58d007) | a | approved (struck 3)
491-494 | twin bone swords (b PASS); boss_melee, burst (c); man-sized (a) | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Its look and kit match custom.void_monarch: change the evil.* preset only (HORNED_EVIL harness flag gates harness, tunic, knee plates); custom_* presets and custom.* ids untouched (custom keeps staff, summon+fear, pauldrons, giant size).
- 496 DEFECTS: harness and crown read pale grey-white, not bone-tan; wing-arms rise steeply. Capture: a knight and four packed mates (evidence 498); demon_form at ~4.9 s.
