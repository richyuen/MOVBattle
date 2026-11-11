# secret.mace_spinner
Status: open   Audited: 515 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 515, 1 struck)
 1. steel chest plate in unit_secret.mace_spinner_idle — TABS: rounded grey breastplate with a fauld; ours is a team vest (ref: secret.mace_spinner.red.png)
 3. steel knee cops and greaves in unit_secret.mace_spinner_idle — TABS: grey plate from knee to ankle; ours has plain team legs (ref: secret.mace_spinner.red.png)
 4. squat bow-legged stance with a wide torso in unit_secret.mace_spinner_idle — TABS: upright Wobbler build at 1.1x (ref: secret.mace_spinner.blue.png)
b PASS (520: struck 1, 2, 3; flanged upright mace in each fist)
c FAIL (0 since 515, 1 rejected)
 1. whole-body spin with both arms out in unit_secret.mace_spinner_release/_flight — TABS: spins like a blender with both maces extended; ours does an overhead chop (ref: card Characteristics)
 2. spin ability in unit_secret.mace_spinner_ability/_ability_after — summary logs spin at 17 ms, but the pair shows a shoulder carry and a run (ref: card Abilities, Spin to Win)
d PASS (518 stats)
## Ranked gaps
1. [S] secret.mace_spinner.c whirl redone — blocker 1: id-gated (secret.mace_spinner, not posePreset "spinner") whole-body spin held through the attack cooldown and spin_move, both arms out, the maces laid along the forearms (SpinnerMaces.place) — ref: card Characteristics — ours: unit_secret.mace_spinner_release.png
2. [S] secret.mace_spinner.a chest plate — blocker 1: rounded grey breastplate with fauld over the team vest (secretDress) — ref: secret.mace_spinner.red.png — ours: unit_secret.mace_spinner_idle.png
3. [S] secret.mace_spinner.a greaves — blocker 3: grey knee cops and greaves knee to ankle (secretDress) — ref: secret.mace_spinner.red.png — ours: unit_secret.mace_spinner_idle.png
## Attempts (iter | gap | criterion | verdict)
520 | round grey closed helm, gold brow band and nose guard, team cap off, secretDress maceSpinnerHelm SPINNER_HELM (24828404) | a | approved (struck 2)
520 | a flanged iron mace upright in each fist at his flanks, world-space, secretDress SpinnerMaces, RU _tendSpinnerMaces SPINNER_FISTS (30b10961, 7515543f) | b | approved (struck 1, 2, 3; b PASS)
518 | arms-out whirl with hip yaw while attacking/spinning, runtimeUnit _applyMaceWhirl (a80a6032) | c | rejected (reverted aef00f7b)
## Rejected (last 4)
518 | c whirl | attempts 1 | keyed on the shared "spinner" preset (ball_n_chain regression); held only on the attack frame, flight back to the carry
## Notes (max 3 lines)
- 520: the maces stay world-upright through the attack; the c whirl must lay them out along the forearms in the spin.
- 520 DEFECTS: the helm's grey reads a little bluish in the idle glow.
