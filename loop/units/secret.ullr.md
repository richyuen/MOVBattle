# secret.ullr
Status: open   Audited: 538 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 538)
 1. grey-blue cap with two small horns in unit_secret.ullr_idle — TABS: dark snow cap with mini axes, framed by shaggy brown hair round the face (ref: secret.ullr.red.png)
 2. small brown wedge beard in unit_secret.ullr_idle — TABS: big green-tan beard with mustache to the collar (ref: secret.ullr.red.png, card Appearance)
 3. bare pale team torso and arms in unit_secret.ullr_idle — TABS: team long open jacket over a shirt (ref: secret.ullr.red.png)
 4. nothing at the shoulders in unit_secret.ullr_idle — TABS: brown fur cape collar (ref: secret.ullr.red.png)
 5. no belt in unit_secret.ullr_idle — TABS: wide brown belt with two buckles (ref: secret.ullr.red.png)
 6. plain team shins in unit_secret.ullr_idle — TABS: brown lace-up boots with tan ties (ref: secret.ullr.red.png)
 7. body colour in unit_secret.ullr_idle: pale grey-blue frosted skin — TABS: full team colour (ref: secret.ullr.jpg)
b FAIL (1 since 538)
 1. dark recurve bow in the main hand in unit_secret.ullr_idle — TABS: double-headed axe in each hand (ref: secret.ullr.red.png, card Main Hand)
 2. quiver on the body and no second axe in the off hand in unit_secret.ullr_windup — TABS: a second axe in the off hand (ref: card Off Hand)
c FAIL (1 since 538, 1 struck)
 2. frost only on the target in unit_secret.ullr_struck — TABS: an ice explosion with an area freeze where the axe lands (ref: card Characteristics, explosion radius 2.25)
d PASS (541 stats)
## Ranked gaps
1. [S] secret.ullr.b ULLR_AXE face-on — blocker 1: head turned face-on to the front, blades forearm-long and broad with the boss on the face, the off axe seated in the off fist — ref: secret.ullr.red.png — ours: unit_secret.ullr_idle
2. [S] secret.ullr.c ice burst — blocker 2: the freeze moved to the axe's impact plus a 2.25 m ice burst freezing every enemy in it — ref: card Characteristics — ours: unit_secret.ullr_struck
## Attempts (iter | gap | criterion | verdict)
541 | double-headed axe each fist ULLR_AXE, bow/quiver/drawn arrow off, duelist pose, throw family (e1c62c43) | b | approved (no strike: head edge-on reads as a spear, off fist empty)
541 | the fist's axe thrown at the let-go, tumbling, at 25 m/s ULLR_THROW (12a23e39, 0d7d192d) | c | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 541 critic: freeze logged at 200 ms, before the axe leaves at 800 ms: _applyOnHitStatuses runs at the throw's queueing (12a23e39).
