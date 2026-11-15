# secret.samurai_giant
Status: open   Audited: 538 (AUDIT x2), 544 (RE-AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 548, 1 struck)
 2. bare blue forearms in unit_secret.samurai_giant_idle — TABS: flared angular vambraces with gold borders (ref: secret.samurai_giant.blue.png)
 3. narrow segmented thighs in unit_secret.samurai_giant_idle — TABS: flared knee-length hakama legs (ref: secret.samurai_giant.blue.png)
 4. bulky box boots in unit_secret.samurai_giant_idle — TABS: tall narrow shin guards over open strapped sandals (ref: secret.samurai_giant.blue.png)
 5. gold brow ornament reads as two thin wires in unit_secret.samurai_giant_idle — TABS: broad flat gold crescent with a center disk (ref: secret.samurai_giant.blue.png)
 6. stands less than twice Shogun's body height in lineup_secret_4 — TABS: towering giant around 3x baseline, more than twice the 1.2x Shogun (ref: reference/factions/secret.jpg, card Infobox)
b PASS (547)
c PASS (547)
d PASS (544 stats)
## Ranked gaps
1. [S] secret.samurai_giant.a boots — blocker 4: slim team shin guards over sandals in place of the box boots — ref: secret.samurai_giant.blue.png — ours: unit_secret.samurai_giant_idle.png
2. [S] secret.samurai_giant.a thighs — blocker 3: a wide hakama-and-tasset thigh shell — ref: secret.samurai_giant.blue.png — ours: unit_secret.samurai_giant_idle.png
3. [S] secret.samurai_giant.a forearm armor — blocker 2: flared gold-bordered vambraces — evidence commit first: the idle hides the forearms behind the broad blade — ref: secret.samurai_giant.blue.png — ours: unit_secret.samurai_giant_idle.png
## Attempts (iter | gap | criterion | verdict)
549 | flared gold-bordered vambraces SAMURAI_KOTE (5ce1d544, 2482989c) | a | dropped (forearms hidden behind the blade in the idle; reverted 3d645e19, 308cb4b0)
548 | fitted gold-laced lamellar cuirass (5b7b006d) | a | approved (struck 1)
547 | ground burst at katana contact (ad2a7610) | c | approved (struck 2)
547 | broad curved giant katana (7d42f44a) | b | approved (struck 1)
546 | stomp flip at the hip driven by leap state (5f704998) | c | approved (struck 1)
544 | two-handed katana grip (956424a6) | b | approved (struck 2)
544 | Foot Stomp launch and landing burst (f022685c) | c | approved (no strike)
543 | team kabuto, gold crescent maedate, tiered neck guard KABUTO (acb87a26) | a | approved (struck 1, 5, 6)
## Rejected (last 4)
## Notes (max 3 lines)
- 543 critic: the maedate horns are thin wires (TABS a broad flat gold crescent).
- Shares the Shogun's body (the Shogun is a 1.2x man); the KABUTO is gated on this id only.
- 549 probe_bbox: forearms lie across the waist behind the broad blade in the idle; a vambrace needs a pose or camera that shows them.
