# secret.witch
Status: open   Audited: 527 (AUDIT x2), 536 (CONFIRM: passed a, b, c, d)   Done: -
## Verdicts
a FAIL (4 since 527, 5 struck)
 5. She stands on her feet in unit_secret.witch_idle — TABS: she rides a long floating broom that hangs below her between the legs (ref: secret.witch.red.png, secret.witch.png; card Appearance)
b PASS (535: struck 2, crooked lashed branch)
c FAIL (3 since 527, 2 struck)
 3. The struck target in unit_secret.witch_struck only gets a pink head glow — TABS: mushrooms grow on the victim, which turns on its allies while poisoned (ref: card Characteristics)
d PASS (536 stats)
## Ranked gaps
1. [P] secret.witch.a broom hang — blocker 5: WITCH_BROOM pitch .18 -> ~.9, lift .2 -> ~.3 so the pole drops below her feet between the legs (fallout of approved [S] ee3c7d9d/58bc88c9) — ref: secret.witch.red.png — ours: unit_secret.witch_idle, lineup_secret_3
2. evidence first for c.3: capture.mjs witch scene puts a friend of the struck man within ~2 m so "turncoat" (SHROOM_TURN) is logged and a shot shows him striking his ally — ours: unit_secret.witch_struck / _ability_after
## Attempts (iter | gap | criterion | verdict)
536 | broom WITCH_BROOM, hover lift .2, legs hang (ee3c7d9d, 58bc88c9) | a | approved (no strike; pole too level)
536 | robe WITCH_ROBE, bands, sash, belt, sleeves, stiffyShorts hem .5 (23df7426, 45c25948) | a | approved (struck 4)
536 | toadstools on the struck man SHROOMS, poison, SHROOM_TURN on friends (7be05a62, 108b1557, 8af4aaa4) | c | approved (mushroom clause cleared, turn unseen)
535 | Stiffy body; crooked lashed staff (a156627c, cbb156f0) | a, b | approved (struck 1, 6; b PASS)
528-534 | clones; staff; hood-hat WITCH_HOOD; mushroom spell MUSHROOM_SPELL | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 536 CONFIRM passed all four; gap critic held a.5 (broom reads as a level stick at the waist, feet planted at lineup) and c.3 (turn on allies not seen).
- 536 critic: robe a stiff barrel hiding the arms (minor). 529: the clones copy her look and missile.
- 530 critic: hood a straight drum, spire kinks faint (not blocking).
