# secret.necromancer
Status: open   Audited: 527 (AUDIT x2), 539 (CONFIRM: passed c, d; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 539, CONFIRM list)
 1. vest in unit_secret.necromancer_idle — a deep square box with raised shoulder pads, as wide as the shoulders, so the torso reads as a slab (also red, lower left of lineup_secret_3) — TABS: a thin, fitted, open vest over a narrow ribcage, with the torso clearly narrower than the arm-band span (ref: reference/units/secret.necromancer.red.png)
 2. bare spine between vest hem and shorts in unit_secret.necromancer_idle — the vest runs down to the belt and no spine shows — TABS: the vest stops at mid-torso and a hand-span of bare vertebrae shows above the shorts, the skeleton silhouette's signature (ref: reference/units/secret.necromancer.blue.png)
 3. horns in unit_secret.necromancer_idle — thin, straight, short spikes on top of the head — TABS: thick curved horns with white bands that sweep out from the hood and rise about a head's height above it (ref: reference/units/secret.necromancer.red.png)
b FAIL (0 since 539, CONFIRM list)
 1. lantern in unit_secret.necromancer_idle — a tiny lantern, about a third of the head's height, hanging inside the glow ring; just as small in unit_secret.necromancer_windup — TABS: a large team-colored kerosene lantern, about forearm-length and taller than the head, held out at the hip (ref: reference/units/secret.necromancer.red.png; card Off Hand Necromancer Lantern)
c PASS (538: struck 3; CONFIRM 539)
d PASS (539 stats; CONFIRM 539)
## Ranked gaps
1. [S] secret.necromancer.a cropped narrow vest — blocker 1 and 2: NECRO_VEST narrower than the arm-band span, its hem at mid-torso so the spine shows over the shorts — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_idle
2. [S] secret.necromancer.b big lantern — blocker 1: NECRO_LANTERN taller than the head, forearm-long, held out at the hip — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_idle
3. [S] secret.necromancer.a horns — blocker 3: thick curved banded horns rising a head over the cap — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_idle
## Attempts (iter | gap | criterion | verdict)
539 | two grey armbands each upper arm, dark ring between NECRO_ARMBAND (01f56fe3) | a | approved (struck 6, a PASS; CONFIRM failed a, b)
539 | [P] NECRO_SHORTS hem .55 -> .4 (25ff6c1c) | a | approved (row spent for further nudging)
538 | shorts NECRO_SHORTS (3997814f); boots NECRO_BOOT (ed76fae6); graves push (96aeee6b) | a, c | approved (struck 4, 5, 3)
537 | NECRO_VEST (b9583fd6); NECRO_GRAVES (bd4c21ff, 664a3f18) | a, c | approved
528-536 | NECRO_KNIFE; NECRO_LANTERN; NECRO_SKULL; NECRO_CURSE; NECRO_CAP; Stiffy body | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 539 critic: only the weapon-side arm's bands show in the idle (off arm behind the vest).
- A second CONFIRM fail on a or b makes it plateau ([R] from every CONFIRM list).
