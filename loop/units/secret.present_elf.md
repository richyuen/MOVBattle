# secret.present_elf
Status: open   Audited: 515 (AUDIT x2), 518 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a FAIL (0 since 518)
 1. cream long-sleeved shirt in unit_secret.present_elf_idle — TABS: cream sleeves to the wrist; ours has bare team arms (ref: secret.present_elf.png)
 2. open vest with toggles in unit_secret.present_elf_idle — TABS: team vest open over the cream shirt; ours is a dark teal tunic block (ref: secret.present_elf.png)
 3. green trousers in unit_secret.present_elf_idle — TABS: green legs; ours has team legs (ref: secret.present_elf.blue.png)
 4. black boots in unit_secret.present_elf_idle — TABS: black boots; ours has team feet (ref: secret.present_elf.red.png)
b FAIL (1 since 518, 1 struck)
 2. bells on the present in unit_secret.present_elf_idle — TABS: two gold bells on the bow; ours has none (ref: secret.present_elf.blue.png)
 3. candy cane on the present in unit_secret.present_elf_idle — TABS: a cream-and-team striped cane laid across the lid; ours has none (ref: secret.present_elf.red.png)
c FAIL (1 since 515, 1 struck)
 2. present opening in unit_secret.present_elf_flight — TABS: the present lands and bursts open after ~3 s to release the unit; ours has the units appear standing beside the elf (ref: card Characteristics)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.present_elf.c present opening — blocker 2: evidence commit first (log present_open as the capture's ability, ABILITY_PREF), then a lid burst and the unit stepping out — ref: card Characteristics — ours: unit_secret.present_elf_flight.png
2. [S] secret.present_elf.b bells — blocker 2: two head-sized gold bells proud of the bow knot — ref: secret.present_elf.blue.png — ours: unit_secret.present_elf_idle
3. [S] secret.present_elf.a cream shirt — blocker 1: cream sleeve shells to the wrist and a cream shirt front replacing the dark tunic block (secretDress) — ref: reference/units/secret.present_elf.png — ours: unit_secret.present_elf_idle.png
## Attempts (iter | gap | criterion | verdict)
520 | throws the present from his chest at the man; it lands, opens 3 s on and his ally steps out, simulationSystem PRESENT_THROW (ed6474a0) | c | approved (struck 1)
519 | torso-sized team present, gold-edged band, bow with tails and small bells, secretDress presentElfPresent PRESENT (b2600e04) | b | approved (struck 1)
517 | green elf cap, cream fur band, pompom, hood off, secretDress elfCap (b34b4519, 8142c383) | a | approved (struck 1, 7, 6 by lineup)
## Rejected (last 4)
## Notes (max 3 lines)
- 520: the opening (present_open, 3 s after landing) is outside the capture's pair: c.2 needs an evidence commit (ABILITY_PREF present_open) first.
- 519 DEFECTS: bells (PRESENT.bell .13 W) hidden in the knot; box narrower than tall, bow small.
- 517 DEFECTS: the cap is short and upright; TABS taller, flopping forward over the band.
