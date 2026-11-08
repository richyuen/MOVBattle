# evil.void_monarch
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (6 since 489, 6 struck)
 2. crown in unit_evil.void_monarch_idle: a pale grey crown of spikes — TABS: a bone-tan crown of flared rays with a tall black-wrapped central spike ringed in pink (ref: evil.void_monarch.red.png)
b PASS (491 twin bone swords)
c PASS (499 Void Monarch Dodge, a violet blink, in Demon form)
d PASS (499 stats)
## Ranked gaps
1. [S] evil.void_monarch.a crown — blocker 2: bone-tan flared-ray crown with a tall black-wrapped central spike and a pink ring (evilDress monarchCrown, evil preset only; the HORNED_EVIL boneCrown band and MONARCH_SPIKES stay for custom) — ref: evil.void_monarch.red.png — ours: unit_evil.void_monarch_idle.png
## Attempts (iter | gap | criterion | verdict)
499 | Void Monarch Dodge: violet blink 2.2 m off an incoming shaft, either form, simulationSystem MONARCH_DODGE (66fc425a; evidence 4cd1f026, 9b31f638) | c | approved (struck 2; c PASS)
499 | spiked bone balls at both elbows, evilDress monarchElbowBalls (413f738e) | a | approved (struck 6)
499 | [P] knee plates tall .62 to .4, wide 2.7 to 2.2 (d9e80090) | a | approved (struck 7)
498 | Demon Transformation, DEMON_FORM (647a7951) | c | approved (Demon clause of 2)
498 | spiked bone knee plates, evilDress monarchKneePlates (3ab07b72) | a | approved (struck 5; added 7)
497 | dark tunic, bone chevrons, studded belt, evilDress monarchTunic (67617691) | a | approved (struck 4)
496 | bone V harness with spiked wing-arms, evilDress monarchHarness (4f58d007) | a | approved (struck 3)
491-494 | twin bone swords (b PASS); boss_melee, burst (c); man-sized (a) | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Its look and kit match custom.void_monarch: change the evil.* preset only (HORNED_EVIL harness flag gates harness, tunic, knee plates, elbow balls); custom_* presets and custom.* ids untouched.
- 499 DEFECTS: elbow balls about half a head across, TABS about a head (not a blocker). Capture: knight + four packed mates, three archers 8 m behind; dodge pair `_dodge`/`_dodge_after` (SECOND_ABILITY), demon_form ~4.9 s, first dodge ~5.8 s.
