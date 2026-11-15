# secret.mace_spinner
Status: done   Audited: 515 (AUDIT x2), 523 (CONFIRM: passed a, b, c)   Done: 523
## Verdicts
a PASS (523)
b PASS (520: struck 1, 2, 3; flanged upright mace in each fist)
c PASS (521)
d PASS (518 stats)
## Ranked gaps
## Attempts (iter | gap | criterion | verdict)
523 | level hips, straight knees and 1.1x scale (8999f026) | a | approved (struck 4, a PASS, CONFIRM passed)
522 | faceted breastplate and waist fauld (da6e9b4a) | a | approved (struck 1)
522 | steel knee cops and tapered greaves (a56f3ca0) | a | approved (struck 3)
521 | whirl with both maces extended through the attack cooldown (7586c05a, d8013ac0) | c | approved (struck 1 and 2, c PASS)
520 | round grey closed helm, gold brow band and nose guard, team cap off, secretDress maceSpinnerHelm SPINNER_HELM (24828404) | a | approved (struck 2)
520 | a flanged iron mace upright in each fist at his flanks, world-space, secretDress SpinnerMaces, RU _tendSpinnerMaces SPINNER_FISTS (30b10961, 7515543f) | b | approved (struck 1, 2, 3; b PASS)
518 | arms-out whirl with hip yaw while attacking/spinning, runtimeUnit _applyMaceWhirl (a80a6032) | c | rejected (reverted aef00f7b)
## Rejected (last 4)
518 | c whirl | attempts 1 | keyed on the shared "spinner" preset (ball_n_chain regression); held only on the attack frame, flight back to the carry
## Notes (max 3 lines)
- 522: team waist cloth still covers part of the fauld.
- 520 DEFECTS: the helm's grey reads a little bluish in the idle glow.
