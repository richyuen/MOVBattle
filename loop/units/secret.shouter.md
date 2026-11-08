# secret.shouter
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 500, 1 struck)
 2. fur trims in unit_secret.shouter_idle — none; TABS tan fur tufts at the shoulders and wrists (ref: secret.shouter.red.png)
 3. bracers in unit_secret.shouter_idle — none; TABS dark team leather bracers on the forearms (ref: secret.shouter.red.png)
 4. knee wraps in unit_secret.shouter_idle — none; TABS tan wrapped bands at the knees over baggy team trousers (ref: secret.shouter.red.png)
 5. light-blue torso block in unit_secret.shouter_idle — TABS: dark grey iron vest over a team tunic (ref: secret.shouter.red.png) [audit2]
b PASS (500 fists, Fist/Fist)
c PASS (502 Shout: harmless cone blast with a white ring wave from the head)
d PASS (502 stats)
## Ranked gaps
1. [S] secret.shouter.a iron vest — blocker 5: dark grey iron vest over a team tunic in place of the light-blue torso block — ref: secret.shouter.red.png — ours: unit_secret.shouter_idle.png
2. [S] secret.shouter.a fur trims — blocker 2: tan fur tufts at the shoulders and wrists — ref: secret.shouter.red.png — ours: unit_secret.shouter_idle.png
## Attempts (iter | gap | criterion | verdict)
502 | Shout: cone blast (SS _tryShout, SHOUT), no damage, white ring and streak wave (FX spawnShoutWave) (37541423) | c | approved (struck 1; c PASS)
500 | dark iron Nordic helmet, nose guard, cheek plates, curled horns, secretDress shouterHelm (62fb739c) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 500 DEFECTS: helm bowl a flat-topped pot (TABS domed); cheek plates float lighter in front of the face; horns curl straight up.
- 502 DEFECTS: no shout lean (TABS head and chest thrown forward); wave one thin ring ~1 m; _tryShout replaces every attack, so he never punches between shouts.
