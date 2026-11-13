# secret.cavalry
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 527, 1 struck)
 2. Rider sits too low in unit_secret.cavalry_idle, legs reaching the ground beside the horse — TABS: the knight sits high in the saddle, his head well above the horse's head (ref: secret.cavalry.png)
 3. Rider body in unit_secret.cavalry_idle is bare team with a dark collar — TABS: grey plate pauldrons and gorget under a team tabard (ref: secret.cavalry.red.png)
 4. Horse cloth in unit_secret.cavalry_windup covers only the rump — TABS: a team caparison that also wraps the neck and chest down to the knees (ref: secret.cavalry.red.png, .png)
b FAIL (1 since 527, 2 struck)
 2. No flags on the spear in unit_secret.cavalry_windup — TABS: three team flags hanging below the head (ref: secret.cavalry.red.png; card Appearance)
c FAIL (0 since 527; audit 1 passed, audit 2 failed)
 1. missing: trample shockwaves — no shockwave rings at the hooves while cantering, and no pull-back charge, in unit_secret.cavalry_release / _flight (only a melee hit is recorded) — TABS: shockwaves wherever the horse canters, and a pull-back charge into the enemy line (ref: card Characteristics)
d PASS (528 stats)
## Ranked gaps
1. [S] secret.cavalry.a rider plate — blocker 3: grey pauldrons and gorget under a team tabard — ref: secret.cavalry.red.png — ours: unit_secret.cavalry_idle
2. [S] secret.cavalry.c trample — blocker 1: hoof shockwave rings while cantering, plus the pull-back charge — ref: card Characteristics — ours: unit_secret.cavalry_release
3. [S] secret.cavalry.a caparison — blocker 4: a team cloth wrapping the horse's neck and chest down to the knees — ref: secret.cavalry.red.png — ours: unit_secret.cavalry_windup
4. [P] secret.cavalry.b flags — blocker 2: CAVALRY_SPEAR flagGap .03 -> .05 so three separate strips show (critic 528 NEXT) — ours: unit_secret.cavalry_windup
## Attempts (iter | gap | criterion | verdict)
528 | [P] CAVALRY_SPEAR flagW .026->.06, flagL .15->.2 (c8877839) | b | approved (no strike: named shot _idle had the head out of frame)
527 | flagged team spear, leaf blade, side prongs, CAVALRY_SPEAR (1cd9657d) | b | approved (struck 1, 3)
527 | grey knight helm, brow band, bevor, team crest, CAV_HELM; on the rider (99708be7, 36fdeb97) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- The horse actor carries visual.special "mount_horse"; rider dress gates on special !== "mount_horse".
- 528: b.2's shot re-aimed _idle -> _windup (critic 528: the spear head is out of frame in _idle, flags show in _windup).
- 527 critic: the crest is a thin fin, TABS taller and bushier.
