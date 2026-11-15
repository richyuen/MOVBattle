# secret.samurai_giant
Status: open   Audited: 538 (AUDIT x2), 544 (RE-AUDIT x2), 553 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts
a FAIL (0 since 553, CONFIRM list)
 1. build in unit_secret.samurai_giant_idle: a squat giant with a slab torso about as wide as it is tall, a wide-flared armour skirt and short thick legs that are well under half the height — TABS: a lanky magnified samurai with a narrow torso, a straight hakama to the knee and long thin shins, the legs about half the height (ref: reference/units/secret.samurai_giant.red.png, .blue.png; reference/factions/secret.jpg, the tall slim figure beside the Tree Giant)
 2. gold hoop bands ringing the thighs and shins in unit_secret.samurai_giant_idle — TABS: plain team-coloured leg greaves with small studs and no gold rings (ref: reference/units/secret.samurai_giant.red.png)
 3. helmet neck guard in unit_secret.samurai_giant_idle: a tight rounded dome that sits close to the head — TABS: the Shogun helmet's tiered gold-edged shikoro flaring out on both sides of the face down to the shoulders (ref: reference/units/secret.samurai_giant.red.png; card Appearance "uses the Shogun helmet")
b PASS (547; CONFIRM 553)
c PASS (547; CONFIRM 553)
d PASS (553 stats)
## Ranked gaps
1. [S] secret.samurai_giant.a build — blocker 1: slimmer torso (bulk 1.75 down, cuirass narrower), straight hakama, legs toward half the height — ref: secret.samurai_giant.red.png — ours: unit_secret.samurai_giant_idle.png
2. [S] secret.samurai_giant.a greaves — blocker 2: SAMURAI_SUNEATE plain team plates with small studs, no gold hoops — ref: secret.samurai_giant.red.png — ours: unit_secret.samurai_giant_idle.png
3. [S] secret.samurai_giant.a helmet — blocker 3: KABUTO lames flared wide down to the shoulders on both sides of the face, as the Shogun's layered kabuto — ref: secret.samurai_giant.red.png — ours: unit_secret.samurai_giant_idle.png
## Attempts (iter | gap | criterion | verdict)
553 | scale 2.3 -> 2.9, legLength .95 -> 1.2 (91749ead) | a | approved (struck 6)
553 | vambraces SAMURAI_KOTE + fixed low guard SAMURAI_GUARD (85b298cc, 2b57229d, 74f4038c) | a | approved (struck 2)
553 | broad flat crescent maedate + boss in KABUTO (0d259eb8) | a | approved (struck 5; a PASS, CONFIRM failed a)
552 | hakama SHOGUN_HAKAMA (2f25e8fb); banded shin guards SAMURAI_SUNEATE + sandals (debe76f4) | a | approved (struck 3, 4)
549 | vambraces SAMURAI_KOTE (5ce1d544, 2482989c) | a | dropped (hidden behind the blade)
543-548 | kabuto, broad katana, two-handed grip, Foot Stomp flip and burst, katana ground burst, cuirass | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Probe 553: head top ~4.75 m (Shogun 2.17, Tree Giant ~4.9). Shares the Shogun's body; KABUTO's giant branch is gated on the head mesh name.
- The guard blade is canted out (SAMURAI_GUARD tip x .42): upright, the broad blade hid the face and crest. Critic noted the cant, not a b fail.
- The 553 CONFIRM's gold hoops (2) are SAMURAI_SUNEATE's rim bands: dropping them is part of a.
