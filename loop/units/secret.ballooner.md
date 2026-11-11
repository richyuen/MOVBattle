# secret.ballooner
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 511 split, 4 struck)
 3. doublet in unit_secret.ballooner_idle — TABS ... a belt (ref: secret.ballooner.red.png)
 4. collar in unit_secret.ballooner_idle — none; TABS a wide grey ruff collar under the chin (ref: secret.ballooner.red.png)
 5. head in unit_secret.ballooner_idle — bare, no hair or goggles; TABS brown shoulder-length hair and round goggle rims round the eyes (ref: secret.ballooner.red.png)
 6. legs in unit_secret.ballooner_idle — straight team legs in boots; TABS knee pantaloons over beige stockings, orange shoes (ref: secret.ballooner.blue.png)
b PASS (503 empty beige glue mitts, no shuriken)
c FAIL (1 since 500, 1 struck)
 2. grab in unit_secret.ballooner_release — a shuriken poke from 1 m; TABS dives in and glues onto the target's body (ref: card Characteristics)
d PASS (511 stats)
## Ranked gaps
1. [S] secret.ballooner.c glue grab — blocker 2: dive in and latch both mitts onto the man's body — ref: loop/cards/secret.ballooner.md — ours: unit_secret.ballooner_release.png
2. [S] secret.ballooner.a ruff — blocker 4: wide faceted grey ruff ring under the chin — ref: reference/units/secret.ballooner.red.png — ours: unit_secret.ballooner_idle.png
3. [S] secret.ballooner.a head — blocker 5: brown shoulder-length hair chunk and round goggle rims round the eyes — ref: reference/units/secret.ballooner.red.png — ours: unit_secret.ballooner_idle.png
## Attempts (iter | gap | criterion | verdict)
511 | team doublet, cream V, slashed puffs, belt (f7143acb) | a | approved (struck 3's doublet/V clause)
511 | glued dive and two-fist grip on the held man (026039a3, reverted e2a612c1) | c | dropped: no dive pose in _release; pair apart in _ability
506 | one-use backpack lift with a held opponent (b89901f6) | c | approved (struck 1)
506 | faceted glue lobes along both forearms (03717227) | a | approved (struck 2, 7)
503 | empty glue mitts, no weapon (c9a3b096, 71cb0028) | b | approved (struck 1; b PASS)
501 | leather satchel, straps, 5 balloons (2c5f720b) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 511 DEFECTS: pale-blue tunic hem block still hangs below the waist; belt hidden behind the pack strap's lower bar; slash slats stand off the puff.
- 511 dropped: dive lerp + setDive did not read on the hit tick, and in _ability the pair are ~1.5 m apart; probe where the held man actually is during the lift before the next try.
- 506 DEFECTS: the pair float apart. Add a dive into a sustained two-arm grip.
