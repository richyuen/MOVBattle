# spooky.skeleton_warrior
Status: done   Audited: 434, 442 (CONFIRM: passed a, c; failed b), 443 (CONFIRM: passed a, b, c)   Done: 443
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (442: warm cream unlit bone, team helmet, shorts, greaves; CONFIRM 442)
b PASS (443: studded shield upright on the off fist, face out, a near-circle disc; CONFIRM 443)
c PASS (435: Stiffy Fear, purple skull over the struck man who runs off; CONFIRM 442)
d PASS (cost 80, hp 0.62x, dmg 1.00x, cd 1.00x; 443 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
434-436 | STIFFY_SHIELD, STIFFY_FEAR, STIFFY_SWORD | b,c | approved (b, c PASS)
437-441 | STIFFY_HELMET, STIFFY_SHORTS, STIFFY_GREAVES, knee bone | a | approved (struck 1, 3, 4, 5)
442 | SKELETON_BONE flat unlit cream, unglowBone (21f0bc9a) | a | approved (struck 2; a PASS; CONFIRM passed a, c, failed b)
443 | STIFFY_UPRIGHT shield stood upright on the fist, studded face out front (a18d0a6f) | b | approved (struck 1; b PASS; CONFIRM 443 passed all: D)
## Rejected (last 4)
## Notes (max 3 lines)
- 441 critic (minor): the bare stretch is a knee knob only, the upper shin is still greave (TABS: knee + top third of the shin bare).
- Shorts spookyDress stiffyShorts; greaves + knee bone stiffyGreaves; helmet stiffyHelmet; dressSkeleton (unitFactory) skips his skirt. Sword propBuilder STIFFY_SWORD, shield STIFFY_SHIELD.
- Fear: runtimeUnit applyFear/FEAR_SKULL, simulationSystem STIFFY_FEAR (every 2nd blow) + flee in _processUnitDecision.
