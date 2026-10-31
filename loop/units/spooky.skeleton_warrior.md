# spooky.skeleton_warrior
Status: open   Audited: 434, 442 (CONFIRM: passed a, c; failed b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (442: warm cream unlit bone, team helmet, shorts, greaves; CONFIRM 442)
b FAIL (0 since 442) (CONFIRM 442 list)
 1. shield orientation in unit_spooky.skeleton_warrior_idle: the studded round shield is held flat across the chest like a tray, face tilted up to the sky, so it shows as a wide ellipse about twice as wide as tall, with the same flat ellipse in lineup_spooky, leftmost unit — TABS: the round studded shield is held upright, face out to the front and side on the off arm, and reads as a near-circle disc (ref: reference/units/spooky.skeleton_warrior.red.png, .blue.png, spooky.skeleton_warrior.png)
c PASS (435: Stiffy Fear, purple skull over the struck man who runs off; CONFIRM 442)
d PASS (cost 80, hp 0.62x, dmg 1.00x, cd 1.00x; 442 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b upright shield - blocker 1: the studded shield held upright on the off arm, face out front-and-side, reading as a near-circle in the idle and lineup (probe its axes with probe_axes first) - ref: spooky.skeleton_warrior.png - ours: unit_spooky.skeleton_warrior_idle (CONFIRM 442)
## Attempts (iter | gap | criterion | verdict)
434-436 | STIFFY_SHIELD, STIFFY_FEAR, STIFFY_SWORD | b,c | approved (b, c PASS)
437-441 | STIFFY_HELMET, STIFFY_SHORTS, STIFFY_GREAVES, knee bone | a | approved (struck 1, 3, 4, 5)
442 | SKELETON_BONE flat unlit cream, unglowBone (21f0bc9a) | a | approved (struck 2; a PASS; CONFIRM passed a, c, failed b)
## Rejected (last 4)
## Notes (max 3 lines)
- 441 critic (minor): the bare stretch is a knee knob only, the upper shin is still greave (TABS: knee + top third of the shin bare).
- Shorts spookyDress stiffyShorts; greaves + knee bone stiffyGreaves; helmet stiffyHelmet; dressSkeleton (unitFactory) skips his skirt. Sword propBuilder STIFFY_SWORD, shield STIFFY_SHIELD.
- Fear: runtimeUnit applyFear/FEAR_SKULL, simulationSystem STIFFY_FEAR (every 2nd blow) + flee in _processUnitDecision.
