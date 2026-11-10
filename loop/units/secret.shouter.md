# secret.shouter
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (3 since 500, 3 struck)
 3. bracers in unit_secret.shouter_idle — none; TABS dark team leather bracers on the forearms (ref: secret.shouter.red.png)
 4. knee wraps in unit_secret.shouter_idle — none; TABS tan wrapped bands at the knees over baggy team trousers (ref: secret.shouter.red.png)
b PASS (500 fists, Fist/Fist)
c PASS (502 Shout: harmless cone blast with a white ring wave from the head)
d PASS (502 stats)
## Ranked gaps
1. [S] secret.shouter.a wrap the knees — blocker 4: add faceted tan bands over the trousers above the boots — ref: secret.shouter.red.png — ours: unit_secret.shouter_idle.png
2. [S] secret.shouter.a fit the bracers — blocker 3: add team leather guards below the fur cuffs — ref: secret.shouter.red.png — ours: unit_secret.shouter_idle.png
## Attempts (iter | gap | criterion | verdict)
508 | faceted shoulder and forearm fur trim (ca17f27b) | a | approved (struck 2)
505 | dark iron vest panels over team tunic (1ff4ba0b) | a | approved (struck 5)
502 | Shout: cone blast (SS _tryShout, SHOUT), no damage, white ring and streak wave (FX spawnShoutWave) (37541423) | c | approved (struck 1; c PASS)
500 | dark iron Nordic helmet, nose guard, cheek plates, curled horns, secretDress shouterHelm (62fb739c) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 508: shoulder and forearm fur reads. Leather bracers and tan knee wraps remain.
- 500 DEFECTS: helm bowl a flat-topped pot (TABS domed); cheek plates float lighter in front of the face; horns curl straight up.
- 502 DEFECTS: no shout lean (TABS head and chest thrown forward); wave one thin ring ~1 m; _tryShout replaces every attack, so he never punches between shouts.
