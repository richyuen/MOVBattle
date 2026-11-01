# wild_west.deadeye
Status: open   Audited: 444, 453 (CONFIRM: passed a, b; failed c)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (453: peaked team hat, braid over the off shoulder, white shirt, gun belt with hip pouches; CONFIRM 453)
b PASS (448: dark lever-action Winchester, lever loop, dark wooden stock; WINCHESTER; CONFIRM 453)
c FAIL (2 since 453; CONFIRM list)
 1. Winchester aim in unit_wild_west.deadeye_release — TABS: the rifle is levelled straight out at waist/chest height toward the target, both hands on it, with the flash leaving the muzzle level (ref: reference/units/wild_west.deadeye.png)
 2. rifle pose in unit_wild_west.deadeye_flight — TABS: the rifle stays levelled toward the target through the recoil (ref: reference/units/wild_west.deadeye.png)
d PASS (cost 900, hp 0.91x, dmg 7.22x, cd 2.50x; 455 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c levelled - blocker 1: in _aimWinchester, turn the rifle node back by its measured world pitch so the barrel is level and collinear with the tracer (the WINCHESTER tilt -.2 grip seat a likely source) - ref: deadeye.png - ours: unit_wild_west.deadeye_release (critic 455)
2. [S] c level through the recoil - blocker 2: the kick a backward slide along the rifle's own axis and a settle, not an upward pitch - ref: deadeye.png - ours: unit_wild_west.deadeye_flight (critic 455)
## Attempts (iter | gap | criterion | verdict)
448 | WINCHESTER propBuilder weaponVariant "winchester" (2d87dded) | b | approved (struck 1; b PASS)
449-453 | PEAK_HAT, DEADEYE_SHIRT, GUN_BELT pouches, WESTERN_BRAID | a | approved (a PASS; CONFIRM passed a, b, failed c)
454 | evidence: capture flightAt 3 ticks for the deadeye (087954a5) | c | evidence
454 | WINCHESTER_AIM _aimWinchester two-hand levelled aim, GUN_WARMUP 1 s, readyAim (6a7b4719) | c | approved (none struck)
455 | levelledGun: gunner overlay stands off the aim; WINCHESTER_AIM drop .26 ahead .28 (b5b86f36) | c | rejected (barrel still ~13° up in the shot; reverted c6329a96)
455 | RIFLE_TRACER white streak muzzle to chest (a5310afa) | c | approved (struck 3)
## Rejected (last 4)
- levelled aim [S] [1] - 455: gunner overlay scaled off by levelledGun, fist at the hip - barrel still climbs ~13° from the hip above the level tracer; stock behind the hip
## Notes (max 3 lines)
- 455 probe (scratch probe_aim): the barrel node's world +y read ~2-5° up after the overlay fix, but the shot showed ~13°: measure the muzzle-to-receiver line in the frame, not the node axis (the barrel sits ~.3 m over the fist).
- 455 probe: RuntimeUnit._applyPoseOverlay "gunner" runs after the animator and turns the shoulder z +.18 / elbow x -.18 (and torso x -.06 attacking) - it pitched the barrel 16-20° up.
- 449 critic: the hat crown is a little tall and sharp (witch-like); TABS a lower blunter peak (not a blocker).
