# secret.cavalry
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 527, 1 struck)
 2. Rider sits too low in unit_secret.cavalry_idle, legs reaching the ground beside the horse — TABS: the knight sits high in the saddle, his head well above the horse's head (ref: secret.cavalry.png)
 3. Rider body in unit_secret.cavalry_idle is bare team with a dark collar — TABS: grey plate pauldrons and gorget under a team tabard (ref: secret.cavalry.red.png)
 4. Horse cloth in unit_secret.cavalry_windup covers only the rump — TABS: a team caparison that also wraps the neck and chest down to the knees (ref: secret.cavalry.red.png, .png)
b PASS (529: struck 2, three flags)
c PASS (530: struck 1, pull-back charge and hoof shockwaves)
d PASS (530 stats)
## Ranked gaps
1. [S] secret.cavalry.a seat height — blocker 2: rider seated on the saddle top, legs along the horse's flanks — ref: secret.cavalry.png — ours: unit_secret.cavalry_idle
2. [S] secret.cavalry.a rider plate — blocker 3: grey pauldrons and gorget under a team tabard — ref: secret.cavalry.red.png — ours: unit_secret.cavalry_idle
3. [S] secret.cavalry.a caparison — blocker 4: a team cloth wrapping the horse's neck and chest down to the knees — ref: secret.cavalry.red.png — ours: unit_secret.cavalry_windup
## Attempts (iter | gap | criterion | verdict)
530 | CAVALRY_CHARGE: pull-back (logged pull_back) then a run through the man, hoof shockwave rings every .35 s fling enemies, CAVALRY_WAVE (SS) (489d21ae) | c | approved (struck 1, c PASS)
529 | [P] CAVALRY_SPEAR flagGap .03->.05 (7878cffd) | b | approved (struck 2, b PASS)
528 | [P] CAVALRY_SPEAR flagW .026->.06, flagL .15->.2 (c8877839) | b | approved (no strike)
527 | flagged team spear, CAVALRY_SPEAR (1cd9657d); grey knight helm CAV_HELM (99708be7, 36fdeb97) | b, a | approved (struck b.1, b.3, a.1)
## Rejected (last 4)
## Notes (max 3 lines)
- The horse actor carries visual.special "mount_horse"; rider dress gates on special !== "mount_horse".
- 530 critic: the shockwave reads as dust clods, not a pale expanding ripple; the pull-back is in no shot (not blocking).
- 529 critic: the flags run flat along the shaft (TABS hang below it). 527: crest a thin fin, TABS bushier.
